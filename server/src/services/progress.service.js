import { Progress } from '../models/Progress.model.js'
import { Workout } from '../models/Workout.model.js'
import { deleteStoredAsset } from '../config/uploads.js'
import { ApiError } from '../utils/apiError.js'
import { parseDayParam } from './nutrition.service.js'

export async function logProgress(userId, data) {
  const date = data.date instanceof Date ? data.date : new Date(data.date)
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const existing = await Progress.findOne({ user: userId, date: day })
  if (existing) {
    Object.assign(existing, { ...data, date: day })
    await existing.save()
    return existing
  }
  return Progress.create({ ...data, user: userId, date: day })
}

export async function getProgressHistory(userId, { limit, startDate, endDate }) {
  const q = { user: userId }
  if (startDate || endDate) {
    q.date = {}
    if (startDate) q.date.$gte = parseDayParam(startDate)
    if (endDate) q.date.$lte = parseDayParam(endDate)
  }
  let query = Progress.find(q).sort({ date: 1 })
  if (limit) query = query.limit(Number(limit))
  return query.lean()
}

export async function getLatestProgress(userId) {
  return Progress.findOne({ user: userId }).sort({ date: -1 }).lean()
}

export async function getProgressByDate(userId, dateStr) {
  const day = parseDayParam(dateStr)
  const p = await Progress.findOne({ user: userId, date: day })
  if (!p) throw new ApiError(404, 'No entry for this date')
  return p
}

export async function deleteProgressEntry(userId, progressId) {
  const p = await Progress.findOne({ _id: progressId, user: userId })
  if (!p) throw new ApiError(404, 'Not found')
  for (const ph of p.photos || []) {
    if (ph.publicId) {
      try {
        await deleteStoredAsset(ph.publicId)
      } catch {
        /* ignore */
      }
    }
  }
  await p.deleteOne()
}

export async function uploadProgressPhoto(userId, progressId, assets) {
  const p = await Progress.findOne({ _id: progressId, user: userId })
  if (!p) throw new ApiError(404, 'Not found')
  for (const { url, publicId } of assets || []) {
    p.photos.push({ url, publicId })
  }
  await p.save()
  return p
}

export async function deleteProgressPhoto(userId, progressId, photoId) {
  const p = await Progress.findOne({ _id: progressId, user: userId })
  if (!p) throw new ApiError(404, 'Not found')
  const ph = p.photos.id(photoId)
  if (!ph) throw new ApiError(404, 'Photo not found')
  if (ph.publicId) {
    try {
      await deleteStoredAsset(ph.publicId)
    } catch {
      /* ignore */
    }
  }
  ph.deleteOne()
  await p.save()
  return p
}

export async function getStrengthProgress(userId) {
  const workouts = await Workout.find({ user: userId }).lean()
  const byName = new Map()
  for (const w of workouts) {
    for (const ex of w.exercises || []) {
      if (ex.weight == null) continue
      const name = ex.name.toLowerCase()
      const prev = byName.get(name) || { max: 0, first: ex.weight }
      const mx = Math.max(prev.max, ex.weight || 0)
      byName.set(name, { max: mx, first: prev.first, name: ex.name })
    }
  }
  const rows = [...byName.values()]
    .filter((r) => r.max > 0)
    .sort((a, b) => b.max - a.max)
    .slice(0, 5)
    .map((r) => ({
      exercise: r.name,
      firstMax: r.first,
      latestMax: r.max,
    }))
  return rows
}

export async function getBodyStats(userId, days = 90) {
  const end = new Date()
  const start = new Date()
  start.setUTCDate(start.getUTCDate() - Number(days))
  const entries = await Progress.find({
    user: userId,
    date: { $gte: start, $lte: end },
  })
    .select('date weight bodyFatPercentage')
    .sort({ date: 1 })
    .lean()
  return entries
}
