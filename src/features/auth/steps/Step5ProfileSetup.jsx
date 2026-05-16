import { zodResolver } from '@hookform/resolvers/zod'
import confetti from 'canvas-confetti'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Toggle } from '@/components/shared/Toggle'

const schema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only'),
  bio: z.string().max(160).optional(),
})

export const Step5ProfileSetup = forwardRef(function Step5ProfileSetup(
  { setCanProceed, defaultName, onSkipComplete },
  ref,
) {
  const navigate = useNavigate()
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null))
  const [preview, setPreview] = useState(/** @type {string | null} */ (null))
  const [fileError, setFileError] = useState('')
  const [success, setSuccess] = useState(false)
  const [remindWorkout, setRemindWorkout] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [community, setCommunity] = useState(false)

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { username: '', bio: '' },
  })

  const bio = watch('bio') || ''

  const finish = () => {
    setSuccess(true)
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
  }

  const skipInternal = () => {
    const payload = { username: '', bio: '', skipped: true, notifications: {} }
    finish()
    onSkipComplete?.(payload)
    return Promise.resolve(payload)
  }

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => {
        handleSubmit(
          (data) => {
            const payload = {
              username: data.username,
              bio: data.bio || '',
              avatarPreview: preview,
              notifications: {
                workoutReminders: remindWorkout,
                weeklyReports,
                communityUpdates: community,
              },
            }
            finish()
            resolve(payload)
          },
          () => reject(new Error('invalid')),
        )()
      }),
    skip: skipInternal,
  }))

  useEffect(() => {
    if (success) setCanProceed(true)
    else setCanProceed(isValid)
  }, [success, isValid, setCanProceed])

  const onFile = (e) => {
    const f = e.target.files?.[0]
    setFileError('')
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setFileError('Please choose an image file.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setFileError('Max file size 5MB.')
      return
    }
    setPreview(URL.createObjectURL(f))
  }

  const initials = defaultName
    ? defaultName
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Welcome to FitTrack, {defaultName?.split(' ')[0] || 'friend'}! 🎉
        </h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          Your plan is ready. Small reps today become big wins tomorrow.
        </p>
        <Button variant="primary" size="lg" className="mt-8" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
        <button
          type="button"
          className="mt-4 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          onClick={() => navigate('/dashboard')}
        >
          Complete profile later
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
        }}
        onClick={() => fileInputRef.current?.click()}
        className="group relative mx-auto flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border bg-muted/50 text-2xl font-bold text-foreground hover:border-accent"
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="h-full w-full rounded-full object-cover" />
            <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white group-hover:flex">
              Change
            </span>
          </>
        ) : (
          initials
        )}
      </div>
      {fileError ? (
        <p className="text-center text-sm text-error" role="alert">
          {fileError}
        </p>
      ) : null}
      <p className="text-center text-xs text-muted-foreground">Click or tap to upload (max 5MB)</p>

      <Input
        id="username"
        label="Username"
        required
        aria-required
        aria-invalid={errors.username ? 'true' : undefined}
        error={errors.username?.message}
        {...register('username')}
      />

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Short bio <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="bio"
          rows={3}
          maxLength={160}
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-base text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-sm"
          placeholder="Tell the community what you are training for..."
          {...register('bio')}
        />
        <div className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/160</div>
      </div>

      <div className="space-y-4 rounded-xl border border-border p-4">
        <p className="text-sm font-semibold text-foreground">Notifications</p>
        <Toggle
          id="n1"
          label="Workout Reminders"
          checked={remindWorkout}
          onCheckedChange={setRemindWorkout}
        />
        <Toggle
          id="n2"
          label="Weekly Progress Reports"
          checked={weeklyReports}
          onCheckedChange={setWeeklyReports}
        />
        <Toggle
          id="n3"
          label="Community Updates"
          checked={community}
          onCheckedChange={setCommunity}
        />
      </div>

      <button
        type="button"
        onClick={() => skipInternal()}
        className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Skip for now
      </button>
    </div>
  )
})

Step5ProfileSetup.displayName = 'Step5ProfileSetup'
Step5ProfileSetup.propTypes = {
  setCanProceed: PropTypes.func.isRequired,
  defaultName: PropTypes.string,
  onSkipComplete: PropTypes.func,
}
