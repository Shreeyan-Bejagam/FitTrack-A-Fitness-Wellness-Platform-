import * as workoutService from '../services/workout.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'

export const createWorkout = asyncHandler(async (req, res) => {
  const w = await workoutService.createWorkout(req.user.id, req.body)
  sendSuccess(res, 201, 'Created', { workout: w })
})

export const getMyWorkouts = asyncHandler(async (req, res) => {
  const result = await workoutService.getUserWorkouts(req.user.id, req.query)
  sendSuccess(res, 200, 'OK', result)
})

export const getWorkoutById = asyncHandler(async (req, res) => {
  const w = await workoutService.getWorkoutById(req.params.id, req.user.id)
  sendSuccess(res, 200, 'OK', { workout: w })
})

export const updateWorkout = asyncHandler(async (req, res) => {
  const w = await workoutService.updateWorkout(req.params.id, req.user.id, req.body)
  sendSuccess(res, 200, 'Updated', { workout: w })
})

export const deleteWorkout = asyncHandler(async (req, res) => {
  await workoutService.deleteWorkout(req.params.id, req.user.id)
  sendSuccess(res, 200, 'Deleted')
})

export const toggleExerciseComplete = asyncHandler(async (req, res) => {
  const w = await workoutService.toggleExerciseComplete(
    req.params.id,
    req.user.id,
    req.params.exerciseId,
    req.body.completed,
  )
  sendSuccess(res, 200, 'Updated', { workout: w })
})

export const getTemplates = asyncHandler(async (req, res) => {
  const list = await workoutService.getWorkoutTemplates(req.user.id)
  sendSuccess(res, 200, 'OK', { templates: list })
})

export const duplicateWorkout = asyncHandler(async (req, res) => {
  const w = await workoutService.duplicateWorkout(req.params.id, req.user.id)
  sendSuccess(res, 201, 'Duplicated', { workout: w })
})

export const getWeeklyStats = asyncHandler(async (req, res) => {
  const stats = await workoutService.getWeeklyStats(req.user.id)
  sendSuccess(res, 200, 'OK', stats)
})
