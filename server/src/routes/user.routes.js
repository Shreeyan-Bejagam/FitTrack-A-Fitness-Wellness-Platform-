import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { optionalAuth, protect } from '../middlewares/auth.middleware.js'
import { runUpload, uploadAvatar } from '../middlewares/upload.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  deleteAccountSchema,
  updateAppearanceSchema,
  updateNotificationsSchema,
  updateProfileSchema,
} from '../validators/user.validator.js'

const router = Router()

router.get('/me', protect, userController.getProfile)
router.patch('/me', protect, validate(updateProfileSchema), userController.updateProfile)
router.post('/me/avatar', protect, runUpload(uploadAvatar), userController.uploadAvatarCtrl)
router.delete('/me/avatar', protect, userController.deleteAvatarCtrl)
router.patch(
  '/me/notifications',
  protect,
  validate(updateNotificationsSchema),
  userController.updateNotifications,
)
router.patch('/me/appearance', protect, validate(updateAppearanceSchema), userController.updateAppearance)
router.get('/search', protect, userController.searchUsers)
router.delete('/me', protect, validate(deleteAccountSchema), userController.deleteAccount)
router.get('/:username', optionalAuth, userController.getPublicProfile)

export default router
