import * as communityService from '../services/community.service.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'

export const createPost = asyncHandler(async (req, res) => {
  const post = await communityService.createPost(req.user.id, req.body)
  await post.populate('author', 'fullName username avatar')
  sendSuccess(res, 201, 'Created', { post })
})

export const getFeed = asyncHandler(async (req, res) => {
  const uid = req.user?.id || null
  const data = await communityService.getFeed(uid, req.query)
  sendSuccess(res, 200, 'OK', data)
})

export const getPost = asyncHandler(async (req, res) => {
  const uid = req.user?.id || null
  const post = await communityService.getPostById(req.params.id, uid)
  sendSuccess(res, 200, 'OK', { post })
})

export const deletePost = asyncHandler(async (req, res) => {
  await communityService.deletePost(req.params.id, req.user.id)
  sendSuccess(res, 200, 'Deleted')
})

export const toggleLike = asyncHandler(async (req, res) => {
  const data = await communityService.toggleLike(req.params.id, req.user.id)
  sendSuccess(res, 200, 'OK', data)
})

export const addComment = asyncHandler(async (req, res) => {
  const comment = await communityService.addComment(req.params.id, req.user.id, req.body.content)
  sendSuccess(res, 201, 'Created', { comment })
})

export const deleteComment = asyncHandler(async (req, res) => {
  await communityService.deleteComment(req.params.id, req.params.commentId, req.user.id)
  sendSuccess(res, 200, 'Deleted')
})

export const getLeaderboard = asyncHandler(async (req, res) => {
  const period = req.query.period || 'week'
  const rows = await communityService.getLeaderboard(period)
  sendSuccess(res, 200, 'OK', { leaderboard: rows })
})

export const searchPosts = asyncHandler(async (req, res) => {
  const q = req.query.q || ''
  if (!q.trim()) {
    return sendSuccess(res, 200, 'OK', { posts: [], page: 1, limit: 10, total: 0 })
  }
  const data = await communityService.searchPosts(q, req.query)
  sendSuccess(res, 200, 'OK', data)
})
