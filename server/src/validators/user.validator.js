import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/)
    .transform((s) => s.toLowerCase())
    .optional(),
  bio: z.string().max(160).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'nonbinary', 'prefer_not_to_say']).optional(),
  height: z
    .object({
      value: z.number().optional(),
      unit: z.enum(['cm', 'ft']).optional(),
    })
    .optional(),
  weight: z
    .object({
      value: z.number().optional(),
      unit: z.enum(['kg', 'lbs']).optional(),
    })
    .optional(),
  fitnessGoals: z
    .array(
      z.enum([
        'lose_weight',
        'build_muscle',
        'stay_active',
        'improve_flexibility',
        'eat_healthier',
        'reduce_stress',
      ]),
    )
    .optional(),
  activityLevel: z
    .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'])
    .optional(),
})

export const updateNotificationsSchema = z.object({
  workoutReminders: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  communityActivity: z.boolean().optional(),
})

export const updateAppearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  accentColor: z.string().optional(),
})

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
})
