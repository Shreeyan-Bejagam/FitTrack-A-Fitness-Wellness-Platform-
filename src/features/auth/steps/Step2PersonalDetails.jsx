import { zodResolver } from '@hookform/resolvers/zod'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/shared/Input'
import { cn } from '@/lib/utils'

const minAge = (dateStr) => {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return false
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age >= 13
}

const schema = z
  .object({
    dob: z.string().min(1, 'Required').refine(minAge, 'You must be at least 13'),
    gender: z.enum(['male', 'female', 'nonbinary']),
    heightUnit: z.enum(['cm', 'ft']),
    heightCm: z.coerce.number().min(100).max(250),
    heightFt: z.coerce.number().min(3).max(8),
    heightIn: z.coerce.number().min(0).max(11),
    weightUnit: z.enum(['kg', 'lbs']),
    weight: z.coerce.number(),
  })
  .superRefine((data, ctx) => {
    if (data.heightUnit === 'cm') {
      if (data.heightCm < 100 || data.heightCm > 250) {
        ctx.addIssue({ code: 'custom', message: 'Height between 100–250 cm', path: ['heightCm'] })
      }
    } else if (data.heightFt < 3 || data.heightFt > 8) {
      ctx.addIssue({ code: 'custom', message: 'Feet between 3–8', path: ['heightFt'] })
    }
    const wMin = data.weightUnit === 'kg' ? 30 : 66
    const wMax = data.weightUnit === 'kg' ? 200 : 440
    if (data.weight < wMin || data.weight > wMax) {
      ctx.addIssue({
        code: 'custom',
        message: `Weight ${wMin}–${wMax} ${data.weightUnit}`,
        path: ['weight'],
      })
    }
  })

const genders = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'nonbinary', label: 'Non-binary' },
]

export const Step2PersonalDetails = forwardRef(function Step2PersonalDetails({ setCanProceed }, ref) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      dob: '',
      gender: 'male',
      heightUnit: 'cm',
      heightCm: 170,
      heightFt: 5,
      heightIn: 8,
      weightUnit: 'kg',
      weight: 70,
    },
  })

  const {
    register,
    control,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = form

  const heightUnit = watch('heightUnit')
  const weightUnit = watch('weightUnit')

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => {
        handleSubmit((data) => {
          resolve({
            dob: data.dob,
            gender: data.gender,
            heightUnit: data.heightUnit,
            heightCm: data.heightUnit === 'cm' ? data.heightCm : undefined,
            heightFt: data.heightUnit === 'ft' ? data.heightFt : undefined,
            heightIn: data.heightUnit === 'ft' ? data.heightIn : undefined,
            weightUnit: data.weightUnit,
            weight: data.weight,
          })
        }, reject)()
      }),
  }))

  useEffect(() => {
    setCanProceed(isValid)
  }, [isValid, setCanProceed])

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Date of birth</p>
        <input
          id="dob"
          type="date"
          className="flex h-11 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-sm"
          aria-required
          aria-invalid={errors.dob ? 'true' : undefined}
          {...register('dob')}
        />
        {errors.dob ? (
          <p className="mt-1 text-sm text-error" role="alert">
            {errors.dob.message}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-foreground">Gender</legend>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Gender">
              {genders.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={field.value === g.id}
                  onClick={() => field.onChange(g.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
                    field.value === g.id
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-accent/50',
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        />
      </fieldset>

      <div className="rounded-xl border border-border p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">Height</span>
          <Controller
            name="heightUnit"
            control={control}
            render={({ field }) => (
              <div className="flex rounded-full border border-border p-0.5 text-xs">
                {['cm', 'ft'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => field.onChange(u)}
                    className={cn(
                      'rounded-full px-3 py-1 font-medium capitalize',
                      field.value === u ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {u === 'ft' ? 'ft + in' : u}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
        {heightUnit === 'cm' ? (
          <div className="space-y-2">
            <input
              type="range"
              min={100}
              max={250}
              className="w-full accent-accent"
              {...register('heightCm', { valueAsNumber: true })}
            />
            <Input
              id="heightCm"
              label="Centimeters"
              type="number"
              aria-required
              error={errors.heightCm?.message}
              {...register('heightCm', { valueAsNumber: true })}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="heightFt"
              label="Feet"
              type="number"
              aria-required
              error={errors.heightFt?.message}
              {...register('heightFt', { valueAsNumber: true })}
            />
            <Input
              id="heightIn"
              label="Inches"
              type="number"
              aria-required
              error={errors.heightIn?.message}
              {...register('heightIn', { valueAsNumber: true })}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">Weight</span>
          <Controller
            name="weightUnit"
            control={control}
            render={({ field }) => (
              <div className="flex rounded-full border border-border p-0.5 text-xs">
                {['kg', 'lbs'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => field.onChange(u)}
                    className={cn(
                      'rounded-full px-3 py-1 font-medium',
                      field.value === u ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
        <input
          type="range"
          min={weightUnit === 'kg' ? 30 : 66}
          max={weightUnit === 'kg' ? 200 : 440}
          className="mb-2 w-full accent-accent"
          {...register('weight', { valueAsNumber: true })}
        />
        <Input
          id="weight"
          label={weightUnit === 'kg' ? 'Kilograms' : 'Pounds'}
          type="number"
          aria-required
          error={errors.weight?.message}
          {...register('weight', { valueAsNumber: true })}
        />
      </div>
    </div>
  )
})

Step2PersonalDetails.displayName = 'Step2PersonalDetails'
Step2PersonalDetails.propTypes = { setCanProceed: PropTypes.func.isRequired }
