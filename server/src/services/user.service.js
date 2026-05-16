import { Post } from '../models/Post.model.js'
import { Progress } from '../models/Progress.model.js'
import { NutritionLog } from '../models/NutritionLog.model.js'
import { User } from '../models/User.model.js'
import { Workout } from '../models/Workout.model.js'
import { deleteStoredAsset } from '../config/uploads.js'
import { ApiError } from '../utils/apiError.js'
import { sanitizeUser } from './auth.service.js'

export async function getProfile(userId) {
  const user = await User.findById(userId).select('-password -refreshTokens').lean()
  if (!user) throw new ApiError(404, 'User not found')
  return { ...user, id: String(user._id) }
}

export async function updateProfile(userId, data) {
  const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true }).select(
    '-password -refreshTokens',
  )
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}

export async function updateAvatar(userId, { url, publicId }) {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found')
  if (user.avatar?.publicId) {
    try {
      await deleteStoredAsset(user.avatar.publicId)
    } catch {
      /* ignore */
    }
  }
  user.avatar = { url, publicId }
  await user.save()
  return sanitizeUser(user)
}

export async function deleteAvatar(userId) {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found')
  if (user.avatar?.publicId) {
    try {
      await deleteStoredAsset(user.avatar.publicId)
    } catch {
      /* ignore */
    }
  }
  user.avatar = { url: '', publicId: '' }
  await user.save()
  return sanitizeUser(user)
}

export async function updateNotifications(userId, prefs) {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found')
  const cur = user.notifications?.toObject?.() || user.notifications || {}
  user.notifications = { ...cur, ...prefs }
  await user.save()
  return sanitizeUser(user)
}

export async function updateAppearance(userId, prefs) {
  const patch = {}
  if (prefs.theme != null) patch.theme = prefs.theme
  if (prefs.accentColor != null) patch.accentColor = prefs.accentColor
  const user = await User.findByIdAndUpdate(userId, { $set: patch }, { new: true }).select(
    '-password -refreshTokens',
  )
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}

export async function searchUsers(query, currentUserId) {
  if (!query?.trim()) return []
  const rx = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [{ username: rx }, { fullName: rx }],
  })
    .select('fullName username avatar')
    .limit(20)
    .lean()
  return users.map((u) => ({ ...u, id: String(u._id) }))
}

export async function getPublicProfile(username) {
  const user = await User.findOne({ username: username.toLowerCase() })
    .select('fullName username avatar bio fitnessGoals createdAt')
    .lean()
  if (!user) throw new ApiError(404, 'User not found')
  return { ...user, id: String(user._id) }
}

export async function deleteAccount(userId) {
  const progressList = await Progress.find({ user: userId })
  for (const p of progressList) {
    for (const ph of p.photos || []) {
      if (ph.publicId) {
        try {
          await deleteStoredAsset(ph.publicId)
        } catch {
          /* ignore */
        }
      }
    }
  }

  const user = await User.findById(userId)
  if (user?.avatar?.publicId) {
    try {
      await deleteStoredAsset(user.avatar.publicId)
    } catch {
      /* ignore */
    }
  }

  await Promise.all([
    Workout.deleteMany({ user: userId }),
    NutritionLog.deleteMany({ user: userId }),
    Progress.deleteMany({ user: userId }),
    Post.deleteMany({ author: userId }),
    User.findByIdAndDelete(userId),
  ])
}
