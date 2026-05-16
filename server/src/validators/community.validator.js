import { z } from 'zod'

export const createPostSchema = z.object({
  content: z.string().min(1).max(1000).trim(),
  sharedWorkout: z.string().optional(),
})

export const addCommentSchema = z.object({
  content: z.string().min(1).max(500).trim(),
})
