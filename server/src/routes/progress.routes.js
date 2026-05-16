import { Router } from 'express'
import * as progressController from '../controllers/progress.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { runUpload, uploadProgressPhoto } from '../middlewares/upload.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createProgressSchema } from '../validators/progress.validator.js'

const router = Router()

router.use(protect)

router.post('/', validate(createProgressSchema), progressController.logProgress)
router.get('/latest', progressController.getLatest)
router.get('/strength', progressController.getStrengthProgress)
router.get('/body-stats', progressController.getBodyStats)
router.get('/', progressController.getHistory)
router.get('/:date', progressController.getByDate)
router.delete('/:id', progressController.deleteEntry)
router.post('/:id/photos', runUpload(uploadProgressPhoto), progressController.uploadPhoto)
router.delete('/:id/photos/:photoId', progressController.deletePhoto)

export default router
