import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Button } from '@/components/shared/Button'
import { Logo } from '@/components/shared/Logo'
import { cn, glass } from '@/lib/utils'
import { StepIndicator } from '@/components/shared/StepIndicator'

const floatCard = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function AuthLayout({
  step,
  totalSteps = 5,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  canProceed,
  continueLoading = false,
  showBack = true,
  continueLabel = 'Continue',
}) {
  const progress = (step / totalSteps) * 100

  return (
    <motion.div className="flex min-h-screen">
      <motion.div className="relative hidden w-1/2 overflow-hidden border-r border-white/20 bg-gradient-to-br from-primary/95 via-primary/85 to-accent/90 p-12 shadow-2xl backdrop-blur-sm lg:flex lg:flex-col lg:justify-between">
        <Logo size="lg" onDark />
        <div className="relative mx-auto max-w-sm space-y-4">
          {[
            '🔥 Streak: 12 days',
            String.fromCodePoint(0x1f4aa) + ' PR: Bench 225 lbs',
          ].map((t, i) => (
            <motion.div
              key={t}
              variants={floatCard}
              animate="animate"
              className={`rounded-2xl border border-white/30 bg-white/15 p-4 text-sm font-medium text-primary-foreground shadow-lg backdrop-blur-xl ${i === 1 ? 'ml-8' : ''}`}
            >
              {t}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-primary-foreground/80">
          Train smarter. Recover faster. Stay accountable.
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center px-4 py-10 md:px-8">
        <div className={cn('mx-auto w-full max-w-md p-6', glass.panel)}>
          <p className="text-xs font-medium text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="mt-6">
            <StepIndicator currentStep={step} totalSteps={totalSteps} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 flex gap-3">
            {showBack && onBack ? (
              <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              variant="primary"
              className={showBack ? 'flex-1' : 'w-full'}
              disabled={!canProceed}
              loading={continueLoading}
              onClick={onContinue}
            >
              {continueLabel}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

AuthLayout.propTypes = {
  step: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  canProceed: PropTypes.bool.isRequired,
  continueLoading: PropTypes.bool,
  showBack: PropTypes.bool,
  continueLabel: PropTypes.string,
}
