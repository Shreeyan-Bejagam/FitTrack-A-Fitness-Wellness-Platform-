import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

const schema = z
  .object({
    fullName: z.string().min(2, 'At least 2 characters'),
    email: z.string().email('Valid email required'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Use at least one uppercase letter and one number'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords must match',
    path: ['confirm'],
  })

function strengthScore(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const labels = ['Weak', 'Fair', 'Good', 'Strong']
const segColors = ['bg-error', 'bg-orange-500', 'bg-yellow-500', 'bg-success']

export const Step1CreateAccount = forwardRef(function Step1CreateAccount({ setCanProceed }, ref) {
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)

  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirm: '',
    },
  })

  const pw = watch('password') || ''
  const score = strengthScore(pw)

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => {
        handleSubmit(
          (data) =>
            resolve({
              fullName: data.fullName,
              email: data.email,
              password: data.password,
            }),
          () => reject(new Error('invalid')),
        )()
      }),
  }))

  useEffect(() => {
    setCanProceed(isValid)
  }, [isValid, setCanProceed])

  return (
    <div className="space-y-4">
      <Button type="button" variant="outline" fullWidth className="border-border">
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </Button>
      <div className="relative flex items-center py-1">
        <div className="flex-1 border-t border-border" />
        <span className="px-3 text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Input
          id="fullName"
          label="Full name"
          required
          aria-required
          aria-invalid={errors.fullName ? 'true' : undefined}
          error={errors.fullName?.message}
          {...register('fullName')}
        />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Input
          id="email"
          label="Email"
          type="email"
          required
          aria-required
          aria-invalid={errors.email ? 'true' : undefined}
          error={errors.email?.message}
          {...register('email')}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Input
          id="password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          required
          aria-required
          aria-invalid={errors.password ? 'true' : undefined}
          error={errors.password?.message}
          className="pr-12"
          {...register('password')}
        />
        <button
          type="button"
          className="absolute right-2 top-[34px] rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setShowPw((v) => !v)}
          aria-label={showPw ? 'Hide password' : 'Show password'}
        >
          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </motion.div>
      {pw ? (
        <div aria-live="polite">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < score ? segColors[Math.max(0, score - 1)] : 'bg-muted'}`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Strength:{' '}
            <span className="font-medium text-foreground">{score ? labels[score - 1] : 'Weak'}</span>
          </p>
        </div>
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="relative"
      >
        <Input
          id="confirm"
          label="Confirm password"
          type={showCf ? 'text' : 'password'}
          required
          aria-required
          aria-invalid={errors.confirm ? 'true' : undefined}
          error={errors.confirm?.message}
          className="pr-12"
          {...register('confirm')}
        />
        <button
          type="button"
          className="absolute right-2 top-[34px] rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setShowCf((v) => !v)}
          aria-label={showCf ? 'Hide confirm password' : 'Show confirm password'}
        >
          {showCf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </motion.div>
    </div>
  )
})

Step1CreateAccount.displayName = 'Step1CreateAccount'

Step1CreateAccount.propTypes = {
  setCanProceed: PropTypes.func.isRequired,
}
