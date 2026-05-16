import { fileToAsset } from '../config/uploads.js'
import * as progressService from '../services/progress.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import { ApiError } from '../utils/apiError.js'

export const logProgress = asyncHandler(async (req, res) => {
  const p = await progressService.logProgress(req.user.id, req.body)
  sendSuccess(res, 201, 'Saved', { progress: p })
})

export const getHistory = asyncHandler(async (req, res) => {
  const list = await progressService.getProgressHistory(req.user.id, req.query)
  sendSuccess(res, 200, 'OK', { entries: list })
})

export const getLatest = asyncHandler(async (req, res) => {
  const p = await progressService.getLatestProgress(req.user.id)
  sendSuccess(res, 200, 'OK', { progress: p })
})

export const getByDate = asyncHandler(async (req, res) => {
  const p = await progressService.getProgressByDate(req.user.id, req.params.date)
  sendSuccess(res, 200, 'OK', { progress: p })
})

export const deleteEntry = asyncHandler(async (req, res) => {
  await progressService.deleteProgressEntry(req.user.id, req.params.id)
  sendSuccess(res, 200, 'Deleted')
})

export const uploadPhoto = asyncHandler(async (req, res) => {
  const files = req.files
  if (!files?.length) throw new ApiError(400, 'No files')
  const assets = files.map((f) => fileToAsset(req, f, 'progress'))
  const p = await progressService.uploadProgressPhoto(req.user.id, req.params.id, assets)
  sendSuccess(res, 200, 'Uploaded', { progress: p })
})

export const deletePhoto = asyncHandler(async (req, res) => {
  const p = await progressService.deleteProgressPhoto(req.user.id, req.params.id, req.params.photoId)
  sendSuccess(res, 200, 'OK', { progress: p })
})

export const getStrengthProgress = asyncHandler(async (req, res) => {
  const data = await progressService.getStrengthProgress(req.user.id)
  sendSuccess(res, 200, 'OK', { exercises: data })
})

export const getBodyStats = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 90
  const data = await progressService.getBodyStats(req.user.id, days)
  sendSuccess(res, 200, 'OK', { entries: data })
})
