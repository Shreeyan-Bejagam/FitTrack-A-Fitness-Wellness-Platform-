import * as nutritionService from '../services/nutrition.service.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'

export const getTodayLog = asyncHandler(async (req, res) => {
  const log = await nutritionService.getTodayLog(req.user.id)
  sendSuccess(res, 200, 'OK', { log })
})

export const getLogByDate = asyncHandler(async (req, res) => {
  const log = await nutritionService.getLogByDate(req.user.id, req.params.date)
  sendSuccess(res, 200, 'OK', { log })
})

export const getLogsRange = asyncHandler(async (req, res) => {
  const { start, end } = req.query
  if (!start || !end) throw new ApiError(400, 'start and end query params required')
  const logs = await nutritionService.getLogsRange(req.user.id, start, end)
  sendSuccess(res, 200, 'OK', { logs })
})

export const addFoodToMeal = asyncHandler(async (req, res) => {
  const log = await nutritionService.addFoodToMeal(req.user.id, req.params.date, {
    mealType: req.params.mealType,
    food: req.body.food,
  })
  sendSuccess(res, 200, 'OK', { log })
})

export const removeFoodFromMeal = asyncHandler(async (req, res) => {
  const log = await nutritionService.removeFoodFromMeal(
    req.user.id,
    req.params.date,
    req.params.mealType,
    req.params.foodId,
  )
  sendSuccess(res, 200, 'OK', { log })
})

export const updateWater = asyncHandler(async (req, res) => {
  const log = await nutritionService.updateWaterIntake(req.user.id, req.params.date, req.body.waterIntake)
  sendSuccess(res, 200, 'OK', { log })
})

export const getWeeklySummary = asyncHandler(async (req, res) => {
  const summary = await nutritionService.getWeeklyNutritionSummary(req.user.id)
  sendSuccess(res, 200, 'OK', summary)
})
