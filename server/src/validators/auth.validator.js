import { z } from 'zod'

export const signupSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must contain uppercase and number'),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .transform((s) => s.toLowerCase()),
  dob: z.string().optional(),
  gender: z.enum(['male', 'female', 'nonbinary']).optional(),
  goals: z.array(z.string()).optional(),
  activity: z.string().nullable().optional(),
  bio: z.string().max(160).optional(),
  heightUnit: z.enum(['cm', 'ft']).optional(),
  heightCm: z.coerce.number().optional(),
  heightFt: z.coerce.number().optional(),
  heightIn: z.coerce.number().optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  weight: z.coerce.number().optional(),
  notifications: z
    .object({
      workoutReminders: z.boolean().optional(),
      weeklyReports: z.boolean().optional(),
      communityUpdates: z.boolean().optional(),
    })
    .optional(),
})

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must contain uppercase and number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must contain uppercase and number'),
})
