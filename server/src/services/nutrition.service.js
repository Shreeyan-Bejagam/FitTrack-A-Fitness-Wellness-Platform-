import { NutritionLog } from '../models/NutritionLog.model.js'
import { ApiError } from '../utils/apiError.js'

export function parseDayParam(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) throw new ApiError(400, 'Invalid date, use YYYY-MM-DD')
  return new Date(Date.UTC(y, m - 1, d))
}

export async function getTodayLog(userId) {
  const now = new Date()
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  let log = await NutritionLog.findOne({ user: userId, date })
  if (!log) {
    log = await NutritionLog.create({ user: userId, date, meals: [] })
  }
  return log
}

export async function getLogByDate(userId, dateStr) {
  const date = parseDayParam(dateStr)
  let log = await NutritionLog.findOne({ user: userId, date })
  if (!log) {
    log = await NutritionLog.create({ user: userId, date, meals: [] })
  }
  return log
}

export async function getLogsRange(userId, startDateStr, endDateStr) {
  const start = parseDayParam(startDateStr)
  const end = parseDayParam(endDateStr)
  return NutritionLog.find({ user: userId, date: { $gte: start, $lte: end } }).sort({ date: 1 }).lean()
}

export async function addFoodToMeal(userId, dateStr, { mealType, food }) {
  const date = parseDayParam(dateStr)
  let log = await NutritionLog.findOne({ user: userId, date })
  if (!log) {
    log = await NutritionLog.create({ user: userId, date, meals: [] })
  }
  const meal = log.meals.find((m) => m.mealType === mealType)
  if (meal) {
    meal.foods.push(food)
  } else {
    log.meals.push({ mealType, foods: [food] })
  }
  await log.save()
  return log
}

export async function removeFoodFromMeal(userId, dateStr, mealType, foodId) {
  const date = parseDayParam(dateStr)
  const log = await NutritionLog.findOne({ user: userId, date })
  if (!log) throw new ApiError(404, 'Log not found')
  const meal = log.meals.find((m) => m.mealType === mealType)
  if (!meal) throw new ApiError(404, 'Meal not found')
  const food = meal.foods.id(foodId)
  if (!food) throw new ApiError(404, 'Food not found')
  food.deleteOne()
  await log.save()
  return log
}

export async function updateWaterIntake(userId, dateStr, waterIntake) {
  const date = parseDayParam(dateStr)
  let log = await NutritionLog.findOne({ user: userId, date })
  if (!log) {
    log = await NutritionLog.create({ user: userId, date, meals: [], waterIntake })
  } else {
    log.waterIntake = waterIntake
    await log.save()
  }
  return log
}

export async function getDailyTotals(userId, dateStr) {
  const log = await getLogByDate(userId, dateStr)
  return {
    totalCalories: log.totalCalories,
    totalProtein: log.totalProtein,
    totalCarbs: log.totalCarbs,
    totalFat: log.totalFat,
    waterIntake: log.waterIntake,
  }
}

export async function getWeeklyNutritionSummary(userId) {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 6)

  const logs = await NutritionLog.find({
    user: userId,
    date: { $gte: start, $lte: end },
  }).lean()

  const n = logs.length || 1
  const sum = logs.reduce(
    (a, l) => ({
      cal: a.cal + (l.totalCalories || 0),
      p: a.p + (l.totalProtein || 0),
      c: a.c + (l.totalCarbs || 0),
      f: a.f + (l.totalFat || 0),
    }),
    { cal: 0, p: 0, c: 0, f: 0 },
  )

  return {
    avgCaloriesPerDay: Math.round(sum.cal / n),
    avgProteinPerDay: Math.round(sum.p / n),
    avgCarbsPerDay: Math.round(sum.c / n),
    avgFatPerDay: Math.round(sum.f / n),
    daysLogged: logs.length,
  }
}
