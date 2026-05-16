import mongoose from 'mongoose'
import { Post } from '../models/Post.model.js'
import { Workout } from '../models/Workout.model.js'
import { ApiError } from '../utils/apiError.js'

const authorSelect = 'fullName username avatar'

export async function createPost(userId, { content, sharedWorkout }) {
  let sw = undefined
  if (sharedWorkout) {
    const w = await Workout.findOne({ _id: sharedWorkout, user: userId })
    if (!w) throw new ApiError(400, 'Workout not found or not yours')
    sw = w._id
  }
  return Post.create({ author: userId, content, sharedWorkout: sw })
}

function decoratePost(post, userId) {
  const o = post.toObject ? post.toObject() : { ...post }
  o.isLikedByMe = userId ? (post.likes || []).some((id) => String(id) === String(userId)) : false
  return o
}

export async function getFeed(userId, { page, limit }) {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.min(30, Math.max(1, Number(limit) || 10))
  const [items, total] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .populate('author', authorSelect)
      .populate({
        path: 'sharedWorkout',
        select: 'name duration exercises',
      })
      .populate('comments.author', authorSelect),
    Post.countDocuments(),
  ])
  return {
    posts: items.map((post) => decoratePost(post, userId)),
    page: p,
    limit: l,
    total,
  }
}

export async function getPostById(postId, userId) {
  const post = await Post.findById(postId)
    .populate('author', authorSelect)
    .populate({ path: 'sharedWorkout', select: 'name duration exercises' })
    .populate('comments.author', authorSelect)
  if (!post) throw new ApiError(404, 'Post not found')
  return decoratePost(post, userId)
}

export async function deletePost(postId, userId) {
  const post = await Post.findOne({ _id: postId, author: userId })
  if (!post) throw new ApiError(404, 'Post not found')
  await post.deleteOne()
}

export async function toggleLike(postId, userId) {
  const post = await Post.findById(postId)
  if (!post) throw new ApiError(404, 'Post not found')
  const uid = new mongoose.Types.ObjectId(userId)
  const liked = post.likes.some((id) => id.equals(uid))
  if (liked) {
    post.likes.pull(uid)
    post.likesCount = Math.max(0, (post.likesCount || 0) - 1)
  } else {
    post.likes.addToSet(uid)
    post.likesCount = (post.likesCount || 0) + 1
  }
  await post.save()
  return { liked: !liked, likesCount: post.likesCount }
}

export async function addComment(postId, userId, content) {
  const post = await Post.findById(postId)
  if (!post) throw new ApiError(404, 'Post not found')
  post.comments.push({ author: userId, content })
  await post.save()
  const fresh = await Post.findById(postId).populate('comments.author', authorSelect)
  const c = fresh.comments[fresh.comments.length - 1]
  return c
}

export async function deleteComment(postId, commentId, userId) {
  const post = await Post.findById(postId)
  if (!post) throw new ApiError(404, 'Post not found')
  const c = post.comments.id(commentId)
  if (!c) throw new ApiError(404, 'Comment not found')
  if (String(c.author) !== String(userId) && String(post.author) !== String(userId)) {
    throw new ApiError(403, 'Not allowed')
  }
  c.deleteOne()
  await post.save()
}

export async function getLeaderboard(period) {
  const now = new Date()
  let start = new Date(0)
  if (period === 'week') {
    start = new Date(now)
    start.setUTCDate(start.getUTCDate() - 7)
  } else if (period === 'month') {
    start = new Date(now)
    start.setUTCMonth(start.getUTCMonth() - 1)
  }

  const agg = await Workout.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: '$user',
        workoutsCount: { $sum: 1 },
        totalVolume: { $sum: { $ifNull: ['$totalVolume', 0] } },
        calories: { $sum: { $ifNull: ['$caloriesBurned', 0] } },
      },
    },
    { $sort: { workoutsCount: -1 } },
    { $limit: 20 },
  ])

  const User = (await import('../models/User.model.js')).User
  const users = await User.find({
    _id: { $in: agg.map((a) => a._id) },
  }).select('fullName username avatar')

  const uMap = new Map(users.map((u) => [String(u._id), u]))

  return agg.map((row, i) => ({
    rank: i + 1,
    user: uMap.get(String(row._id)),
    workouts: row.workoutsCount,
    volume: row.totalVolume,
    calories: row.calories,
  }))
}

export async function searchPosts(query, { page, limit }) {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.min(30, Math.max(1, Number(limit) || 10))
  const rx = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const [items, total] = await Promise.all([
    Post.find({ content: rx })
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .populate('author', authorSelect)
      .populate({ path: 'sharedWorkout', select: 'name duration exercises' }),
    Post.countDocuments({ content: rx }),
  ])
  return { posts: items, page: p, limit: l, total }
}
