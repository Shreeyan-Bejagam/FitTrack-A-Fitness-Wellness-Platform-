import { z } from 'zod'

export const exerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.coerce.number().optional(),
  reps: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  restSeconds: z.coerce.number().optional(),
  notes: z.string().optional(),
})

export const createWorkoutSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['strength', 'cardio', 'hiit', 'flexibility', 'sport', 'other']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  duration: z.coerce.number().optional(),
  exercises: z.array(exerciseSchema).default([]),
  caloriesBurned: z.coerce.number().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().optional(),
})

export const updateWorkoutSchema = createWorkoutSchema.partial()

export const completeExerciseSchema = z.object({
  completed: z.boolean(),
})
