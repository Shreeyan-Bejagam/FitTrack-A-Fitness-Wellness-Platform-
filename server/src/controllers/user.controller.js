import { fileToAsset } from '../config/uploads.js'
import * as userService from '../services/user.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import { User } from '../models/User.model.js'
import { ApiError } from '../utils/apiError.js'

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id)
  sendSuccess(res, 200, 'OK', { user: profile })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body)
  sendSuccess(res, 200, 'Profile updated', { user })
})

export const uploadAvatarCtrl = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded')
  const { url, publicId } = fileToAsset(req, req.file, 'avatars')
  const user = await userService.updateAvatar(req.user.id, { url, publicId })
  sendSuccess(res, 200, 'Avatar updated', { user })
})

export const deleteAvatarCtrl = asyncHandler(async (req, res) => {
  const user = await userService.deleteAvatar(req.user.id)
  sendSuccess(res, 200, 'Avatar removed', { user })
})

export const updateNotifications = asyncHandler(async (req, res) => {
  const prefs = {}
  if (req.body.workoutReminders != null) prefs.workoutReminders = req.body.workoutReminders
  if (req.body.weeklyReport != null) prefs.weeklyReport = req.body.weeklyReport
  if (req.body.communityActivity != null) prefs.communityActivity = req.body.communityActivity
  const user = await userService.updateNotifications(req.user.id, prefs)
  sendSuccess(res, 200, 'Updated', { user })
})

export const updateAppearance = asyncHandler(async (req, res) => {
  const user = await userService.updateAppearance(req.user.id, req.body)
  sendSuccess(res, 200, 'Updated', { user })
})

export const searchUsers = asyncHandler(async (req, res) => {
  const q = req.query.q || ''
  const users = await userService.searchUsers(q, req.user.id)
  sendSuccess(res, 200, 'OK', { users })
})

export const getPublicProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getPublicProfile(req.params.username)
  sendSuccess(res, 200, 'OK', { user: profile })
})

export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password')
  if (!user) throw new ApiError(404, 'User not found')
  const ok = await user.comparePassword(req.body.password)
  if (!ok) throw new ApiError(401, 'Invalid password')
  await userService.deleteAccount(req.user.id)
  sendSuccess(res, 200, 'Account deleted')
})
