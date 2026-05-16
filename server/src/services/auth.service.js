import { User } from '../models/User.model.js'
import { ApiError } from '../utils/apiError.js'
import { hashRefreshToken } from '../utils/hashRefreshToken.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token.js'

const GOAL_MAP = {
  lose: 'lose_weight',
  muscle: 'build_muscle',
  active: 'stay_active',
  flex: 'improve_flexibility',
  eat: 'eat_healthier',
  stress: 'reduce_stress',
}

const ACTIVITY_MAP = {
  light: 'lightly_active',
  moderate: 'moderately_active',
  very: 'very_active',
  sedentary: 'sedentary',
  athlete: 'athlete',
}

function mapGoals(arr) {
  if (!arr?.length) return []
  return [...new Set(arr.map((g) => GOAL_MAP[g] || g).filter(Boolean))]
}

function mapActivity(act) {
  if (act == null || act === '') return undefined
  return ACTIVITY_MAP[act] || act
}

function mapHeightFromSignup(data) {
  if (data.heightUnit === 'cm' && data.heightCm != null) {
    return { value: data.heightCm, unit: 'cm' }
  }
  if (data.heightUnit === 'ft' && data.heightFt != null) {
    const inches = data.heightFt * 12 + (data.heightIn || 0)
    return { value: Number((inches / 12).toFixed(2)), unit: 'ft' }
  }
  return undefined
}

function mapWeightFromSignup(data) {
  if (data.weight == null) return undefined
  return { value: data.weight, unit: data.weightUnit || 'kg' }
}

export function sanitizeUser(doc) {
  const o = doc.toObject ? doc.toObject() : { ...doc }
  delete o.password
  delete o.refreshTokens
  o.id = String(o._id)
  return o
}

async function pushRefreshToken(userId, refreshToken) {
  const hashed = hashRefreshToken(refreshToken)
  await User.findByIdAndUpdate(userId, { $push: { refreshTokens: hashed } })
  const u = await User.findById(userId).select('refreshTokens')
  if (u && u.refreshTokens?.length > 10) {
    u.refreshTokens = u.refreshTokens.slice(-10)
    await u.save()
  }
}

export async function signup(data) {
  const email = data.email.toLowerCase().trim()
  const username = data.username.toLowerCase().trim()
  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists) throw new ApiError(409, 'Email or username already in use')

  const user = await User.create({
    fullName: data.fullName,
    email,
    password: data.password,
    username,
    bio: data.bio || '',
    dateOfBirth: data.dob ? new Date(data.dob) : undefined,
    gender: data.gender,
    fitnessGoals: mapGoals(data.goals),
    activityLevel: mapActivity(data.activity),
    height: mapHeightFromSignup(data),
    weight: mapWeightFromSignup(data),
    notifications: {
      workoutReminders: data.notifications?.workoutReminders ?? true,
      weeklyReport: data.notifications?.weeklyReports ?? true,
      communityActivity: data.notifications?.communityUpdates ?? false,
    },
  })

  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)
  await pushRefreshToken(user._id, refreshToken)

  return { user: sanitizeUser(user), accessToken, refreshToken }
}

export async function login({ email, password }) {
  const user = await User.findByEmail(email)
  if (!user) throw new ApiError(401, 'Invalid email or password')
  const ok = await user.comparePassword(password)
  if (!ok) throw new ApiError(401, 'Invalid email or password')

  const accessToken = generateAccessToken(user._id)
  const refreshToken = generateRefreshToken(user._id)
  await pushRefreshToken(user._id, refreshToken)

  const fresh = await User.findById(user._id)
  return { user: sanitizeUser(fresh), accessToken, refreshToken }
}

export async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'Not authenticated')
  let decoded
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch {
    throw new ApiError(401, 'Token expired or invalid')
  }
  const hashed = hashRefreshToken(refreshToken)
  const user = await User.findById(decoded.userId).select('+refreshTokens')
  if (!user || !user.refreshTokens?.includes(hashed)) {
    throw new ApiError(401, 'Token expired or invalid')
  }

  const accessToken = generateAccessToken(user._id)
  const newRefresh = generateRefreshToken(user._id)
  const newHashed = hashRefreshToken(newRefresh)

  user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed)
  user.refreshTokens.push(newHashed)
  if (user.refreshTokens.length > 10) user.refreshTokens = user.refreshTokens.slice(-10)
  await user.save()

  return { accessToken, refreshToken: newRefresh }
}

export async function logout(userId, refreshToken) {
  if (!refreshToken) return
  const hashed = hashRefreshToken(refreshToken)
  await User.findByIdAndUpdate(userId, { $pull: { refreshTokens: hashed } })
}

export async function logoutAll(userId) {
  await User.findByIdAndUpdate(userId, { refreshTokens: [] })
}

export async function getMe(userId) {
  const user = await User.findById(userId).select('-password -refreshTokens')
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}
