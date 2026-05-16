import { Router } from 'express'
import * as workoutController from '../controllers/workout.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  completeExerciseSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
} from '../validators/workout.validator.js'

const router = Router()

router.use(protect)

router.post('/', validate(createWorkoutSchema), workoutController.createWorkout)
router.get('/stats/weekly', workoutController.getWeeklyStats)
router.get('/templates', workoutController.getTemplates)
router.get('/', workoutController.getMyWorkouts)
router.post('/:id/duplicate', workoutController.duplicateWorkout)
router.patch(
  '/:id/exercises/:exerciseId/toggle',
  validate(completeExerciseSchema),
  workoutController.toggleExerciseComplete,
)
router.get('/:id', workoutController.getWorkoutById)
router.patch('/:id', validate(updateWorkoutSchema), workoutController.updateWorkout)
router.delete('/:id', workoutController.deleteWorkout)

export default router
