import { Router } from 'express'
import * as communityController from '../controllers/community.controller.js'
import { optionalAuth, protect } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { addCommentSchema, createPostSchema } from '../validators/community.validator.js'

const router = Router()

router.get('/', optionalAuth, communityController.getFeed)
router.get('/leaderboard', protect, communityController.getLeaderboard)
router.get('/search', optionalAuth, communityController.searchPosts)
router.get('/:id', optionalAuth, communityController.getPost)
router.post('/', protect, validate(createPostSchema), communityController.createPost)
router.delete('/:id', protect, communityController.deletePost)
router.post('/:id/like', protect, communityController.toggleLike)
router.post('/:id/comments', protect, validate(addCommentSchema), communityController.addComment)
router.delete('/:id/comments/:commentId', protect, communityController.deleteComment)

export default router
