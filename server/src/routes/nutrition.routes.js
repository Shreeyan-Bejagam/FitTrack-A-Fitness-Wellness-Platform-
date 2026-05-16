import { Router } from 'express'
import * as nutritionController from '../controllers/nutrition.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { ApiError } from '../utils/apiError.js'
import { validate } from '../middlewares/validate.middleware.js'
import { addFoodBodySchema, updateWaterSchema } from '../validators/nutrition.validator.js'

const router = Router()

router.use(protect)

router.get('/today', nutritionController.getTodayLog)
router.get('/summary/weekly', nutritionController.getWeeklySummary)
router.get('/range', (req, res, next) => {
  if (!req.query.start || !req.query.end) {
    return next(new ApiError(400, 'start and end query params required'))
  }
  next()
}, nutritionController.getLogsRange)
router.get('/:date', nutritionController.getLogByDate)
router.post('/:date/meals/:mealType/foods', validate(addFoodBodySchema), nutritionController.addFoodToMeal)
router.delete('/:date/meals/:mealType/foods/:foodId', nutritionController.removeFoodFromMeal)
router.patch('/:date/water', validate(updateWaterSchema), nutritionController.updateWater)

export default router
