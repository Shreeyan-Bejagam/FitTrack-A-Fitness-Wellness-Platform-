import { z } from 'zod'

export const foodItemSchema = z.object({
  name: z.string().min(1),
  portion: z.coerce.number().optional(),
  portionUnit: z.enum(['g', 'ml', 'oz', 'serving']).optional(),
  calories: z.coerce.number().default(0),
  protein: z.coerce.number().default(0),
  carbs: z.coerce.number().default(0),
  fat: z.coerce.number().default(0),
})

export const mealSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snacks']),
  foods: z.array(foodItemSchema),
})

export const createLogSchema = z.object({
  date: z.string().min(1),
  meals: z.array(mealSchema),
  waterIntake: z.coerce.number().optional(),
})

export const addFoodSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snacks']),
  food: foodItemSchema,
})

export const addFoodBodySchema = z.object({
  food: foodItemSchema,
})

export const updateWaterSchema = z.object({
  waterIntake: z.coerce.number().min(0),
})
