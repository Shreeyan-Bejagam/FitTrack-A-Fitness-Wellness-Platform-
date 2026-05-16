import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Dumbbell, Flame } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Button } from '@/components/shared/Button'
import { Logo } from '@/components/shared/Logo'
import { Input } from '@/components/shared/Input'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { cn, glass } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

const highlights = [
  { icon: Flame, text: 'Track streaks and daily wins' },
  { icon: Dumbbell, text: 'Log workouts in seconds' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setFormError('')
    try {
      const { data: res } = await authApi.login({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      })
      setAuth({ user: res.data.user, accessToken: res.data.accessToken })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setFormError(e?.message || 'Invalid email or password')
    }
  }

  return (
    <ErrorBoundary>
      <motion.div
        className="flex min-h-screen items-center justify-center px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="grid w-full max-w-4xl items-center gap-8 lg:grid-cols-[1fr,minmax(0,22rem)] lg:gap-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="glass-cta hidden rounded-2xl p-8 text-primary-foreground lg:block"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Logo onDark />
            <h2 className="mt-6 text-2xl font-bold leading-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-primary-foreground/90">
              Pick up where you left off — your streaks and plans are waiting.
            </p>
            <ul className="mt-6 space-y-3">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <motion.div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                🔥 12-day streak
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                PR: Bench 225 lbs
              </span>
            </motion.div>
          </motion.div>

          <div className="w-full">
            <motion.div
              className="mb-5 flex justify-center lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Logo />
            </motion.div>

            <motion.div
              className={cn('w-full p-6 sm:p-8', glass.panel)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <h1 className="text-2xl font-bold text-foreground">Log in</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Use the email and password from your FitTrack account.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  id="login-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  aria-required
                  aria-invalid={errors.email ? 'true' : undefined}
                  error={errors.email?.message}
                  className="w-full"
                  {...register('email')}
                />
                <Input
                  id="login-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  aria-required
                  aria-invalid={errors.password ? 'true' : undefined}
                  error={errors.password?.message}
                  className="w-full"
                  {...register('password')}
                />
                {formError ? (
                  <p className="text-sm text-error" role="alert">
                    {formError}
                  </p>
                ) : null}
                <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                  Log in
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                New here?{' '}
                <Link to="/signup" className="font-medium text-accent underline-offset-2 hover:underline">
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </ErrorBoundary>
  )
}
