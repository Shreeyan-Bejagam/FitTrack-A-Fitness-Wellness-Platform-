import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authLimiter } from '../middlewares/rateLimit.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { loginSchema, signupSchema } from '../validators/auth.validator.js'

const router = Router()

router.post('/signup', authLimiter, validate(signupSchema), authController.signup)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', protect, authController.logout)
router.post('/logout-all', protect, authController.logoutAll)
router.get('/me', protect, authController.getMe)

export default router
