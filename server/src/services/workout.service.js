import mongoose from 'mongoose'
import { Workout } from '../models/Workout.model.js'
import { ApiError } from '../utils/apiError.js'

function startOfWeekUtc(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = x.getUTCDay() || 7
  if (day !== 1) x.setUTCDate(x.getUTCDate() - (day - 1))
  x.setUTCHours(0, 0, 0, 0)
  return x
}

export async function createWorkout(userId, data) {
  return Workout.create({ ...data, user: userId })
}

export async function getUserWorkouts(userId, { page, limit, type, isTemplate, search }) {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.min(50, Math.max(1, Number(limit) || 10))
  const q = { user: userId }
  if (type) q.type = type
  if (isTemplate !== undefined && isTemplate !== '') {
    q.isTemplate = isTemplate === 'true' || isTemplate === true
  }
  if (search?.trim()) {
    q.name = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  }
  const [items, total] = await Promise.all([
    Workout.find(q).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
    Workout.countDocuments(q),
  ])
  return {
    workouts: items,
    page: p,
    limit: l,
    total,
    pages: Math.ceil(total / l) || 1,
  }
}

export async function getWorkoutById(workoutId, userId) {
  const w = await Workout.findOne({ _id: workoutId, user: userId })
  if (!w) throw new ApiError(404, 'Workout not found')
  return w
}

export async function updateWorkout(workoutId, userId, data) {
  const w = await Workout.findOne({ _id: workoutId, user: userId })
  if (!w) throw new ApiError(404, 'Workout not found')
  Object.assign(w, data)
  await w.save()
  return w
}

export async function deleteWorkout(workoutId, userId) {
  const w = await Workout.findOneAndDelete({ _id: workoutId, user: userId })
  if (!w) throw new ApiError(404, 'Workout not found')
}

export async function toggleExerciseComplete(workoutId, userId, exerciseId, completed) {
  const w = await Workout.findOne({ _id: workoutId, user: userId })
  if (!w) throw new ApiError(404, 'Workout not found')
  const ex = w.exercises.id(new mongoose.Types.ObjectId(exerciseId))
  if (!ex) throw new ApiError(404, 'Exercise not found')
  ex.completed = completed
  await w.save()
  return w
}

export async function getWorkoutTemplates(userId) {
  return Workout.find({ user: userId, isTemplate: true }).sort({ createdAt: -1 }).lean()
}

export async function duplicateWorkout(workoutId, userId) {
  const w = await Workout.findOne({ _id: workoutId, user: userId }).lean()
  if (!w) throw new ApiError(404, 'Workout not found')
  const { _id, __v, createdAt, updatedAt, ...rest } = w
  return Workout.create({
    ...rest,
    name: `${rest.name} (Copy)`,
    isTemplate: false,
    completedAt: undefined,
    exercises: (rest.exercises || []).map((e) => ({
      ...e,
      _id: undefined,
      completed: false,
    })),
    user: userId,
  })
}

export async function getWeeklyStats(userId) {
  const start = startOfWeekUtc()
  const workouts = await Workout.find({
    user: userId,
    createdAt: { $gte: start },
  }).lean()

  const byDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    val: 0,
  }))

  let totalVolume = 0
  let totalDuration = 0
  let calories = 0

  for (const w of workouts) {
    totalVolume += w.totalVolume || 0
    totalDuration += w.duration || 0
    calories += w.caloriesBurned || 0
    const dow = new Date(w.createdAt).getUTCDay()
    const idx = dow === 0 ? 6 : dow - 1
    byDay[idx].val += w.totalVolume || w.duration || 1
  }

  return {
    weekData: byDay,
    totalVolume,
    totalDuration,
    caloriesBurned: calories,
    workoutCount: workouts.length,
  }
}
