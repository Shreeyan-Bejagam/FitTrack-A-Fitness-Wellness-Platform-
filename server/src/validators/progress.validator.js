import { z } from 'zod'

export const measurementsSchema = z.object({
  chest: z.coerce.number().optional(),
  waist: z.coerce.number().optional(),
  hips: z.coerce.number().optional(),
  arms: z.coerce.number().optional(),
  thighs: z.coerce.number().optional(),
})

export const createProgressSchema = z.object({
  date: z.coerce.date(),
  weight: z.coerce.number().optional(),
  weightUnit: z.enum(['kg', 'lbs']).optional(),
  bodyFatPercentage: z.coerce.number().optional(),
  muscleMass: z.coerce.number().optional(),
  measurements: measurementsSchema.optional(),
  notes: z.string().optional(),
})

export const updateProgressSchema = createProgressSchema.partial().extend({
  date: z.coerce.date().optional(),
})
