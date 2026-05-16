import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { authApi } from '@/lib/api/auth.api'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { STEP_KEYS, useMultiStepForm } from '@/features/auth/useMultiStepForm'
import { Step1CreateAccount } from '@/features/auth/steps/Step1CreateAccount'
import { Step2PersonalDetails } from '@/features/auth/steps/Step2PersonalDetails'
import { Step3FitnessGoals } from '@/features/auth/steps/Step3FitnessGoals'
import { Step4ActivityLevel } from '@/features/auth/steps/Step4ActivityLevel'
import { Step5ProfileSetup } from '@/features/auth/steps/Step5ProfileSetup'
import { useAuthStore } from '@/store/authStore'

function buildSignupPayload(fd, profileSlice) {
  const acc = fd.account || {}
  const per = fd.personal || {}
  const goals = fd.goals || {}
  const act = fd.activity || {}
  const pro = profileSlice || fd.profile || {}
  const emailPart = (acc.email || 'user').split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 24) || 'user'
  const username =
    (pro.username && String(pro.username).toLowerCase()) || `${emailPart}_${String(Date.now()).slice(-4)}`

  return {
    fullName: acc.fullName,
    email: acc.email,
    password: acc.password,
    username,
    dob: per.dob,
    gender: per.gender,
    goals: goals.goals,
    activity: act.activity,
    bio: pro.bio || '',
    heightUnit: per.heightUnit,
    heightCm: per.heightCm,
    heightFt: per.heightFt,
    heightIn: per.heightIn,
    weightUnit: per.weightUnit,
    weight: per.weight,
    notifications: pro.notifications,
  }
}

const META = [
  {
    title: 'Create your account',
    subtitle: 'Start with the basics — we will tailor everything next.',
  },
  {
    title: 'Tell us about you',
    subtitle: 'We use this to personalize plans and calorie guidance.',
  },
  {
    title: 'Your goals',
    subtitle: 'Pick what you want to optimize for right now.',
  },
  {
    title: 'Activity level',
    subtitle: 'This helps us estimate energy needs responsibly.',
  },
  {
    title: 'Finish your profile',
    subtitle: 'Add a face and username so the community knows you.',
  },
]

const slideVariants = {
  enter: (d) => ({
    x: d > 0 ? 32 : -32,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({
    x: d > 0 ? -32 : 32,
    opacity: 0,
  }),
}

export function AuthPage() {
  const navigate = useNavigate()
  const {
    currentStep,
    formData,
    setStepData,
    goNext,
    goBack,
    canProceed,
    setCanProceed,
  } = useMultiStepForm()
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  const [dir, setDir] = useState(1)
  const [continueLoading, setContinueLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)

  const r1 = useRef(/** @type {{ submit: () => Promise<unknown> } | null} */ (null))
  const r2 = useRef(/** @type {{ submit: () => Promise<unknown> } | null} */ (null))
  const r3 = useRef(/** @type {{ submit: () => Promise<unknown> } | null} */ (null))
  const r4 = useRef(/** @type {{ submit: () => Promise<unknown> } | null} */ (null))
  const r5 = useRef(
    /** @type {{ submit: () => Promise<unknown>; skip: () => Promise<unknown> } | null} */ (
      null
    ),
  )

  const refs = [r1, r2, r3, r4, r5]

  const submitSignup = async (profileData) => {
    setApiError('')
    const fd = { ...formDataRef.current, profile: profileData }
    const payload = buildSignupPayload(fd, profileData)
    try {
      const { data } = await authApi.signup(payload)
      setAuth({ user: data.data.user, accessToken: data.data.accessToken })
      navigate('/dashboard', { replace: true })
    } catch (e) {
      const msg = e?.message || e?.response?.data?.message || 'Could not create account'
      setApiError(msg)
      throw e
    }
  }

  const handleContinue = async () => {
    const ref = refs[currentStep - 1].current
    if (!ref?.submit) return
    setContinueLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    try {
      const data = await ref.submit()
      const key = STEP_KEYS[currentStep - 1]
      setStepData(key, data)
      if (currentStep < 5) {
        setDir(1)
        goNext()
      } else {
        await submitSignup(data)
      }
    } catch {
      /* Form validation or signup error (api message set in submitSignup) */
    } finally {
      setContinueLoading(false)
    }
  }

  const handleBack = () => {
    setDir(-1)
    goBack()
  }

  const stepEl = (() => {
    switch (currentStep) {
      case 1:
        return <Step1CreateAccount ref={r1} setCanProceed={setCanProceed} />
      case 2:
        return <Step2PersonalDetails ref={r2} setCanProceed={setCanProceed} />
      case 3:
        return <Step3FitnessGoals ref={r3} setCanProceed={setCanProceed} />
      case 4:
        return <Step4ActivityLevel ref={r4} setCanProceed={setCanProceed} />
      case 5:
        return (
          <Step5ProfileSetup
            ref={r5}
            setCanProceed={setCanProceed}
            defaultName={formData.account?.fullName}
            onSkipComplete={async (payload) => {
              setStepData('profile', payload)
              setContinueLoading(true)
              try {
                await submitSignup(payload)
              } catch {
                /* submitSignup sets apiError */
              } finally {
                setContinueLoading(false)
              }
            }}
          />
        )
      default:
        return null
    }
  })()

  const meta = META[currentStep - 1]

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <AuthLayout
          step={currentStep}
          title={meta.title}
          subtitle={meta.subtitle}
          onBack={currentStep > 1 ? handleBack : undefined}
          showBack={currentStep > 1}
          onContinue={handleContinue}
          canProceed={canProceed}
          continueLoading={continueLoading}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={currentStep}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {stepEl}
            </motion.div>
          </AnimatePresence>
        </AuthLayout>
        {apiError ? (
          <p className="px-4 pb-4 text-center text-sm text-error" role="alert">
            {apiError}
          </p>
        ) : null}
        <p className="pb-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent underline-offset-2 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </ErrorBoundary>
  )
}
