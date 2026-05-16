import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

export function StepIndicator({ currentStep, totalSteps = 5, className }) {
  return (
    <div className={cn('flex w-full items-center justify-between gap-1', className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const n = i + 1
        const done = n < currentStep
        const active = n === currentStep
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <motion.div
              layout
              className={cn(
                'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-200',
                done && 'border-accent bg-accent text-accent-foreground',
                active &&
                  'border-accent bg-background text-accent animate-pulse-ring',
                !done && !active && 'border-muted-foreground/30 text-muted-foreground',
              )}
            >
              {done ? <Check className="h-5 w-5" aria-hidden /> : n}
            </motion.div>
            {n < totalSteps ? (
              <div
                className={cn(
                  'mx-1 h-0.5 min-w-0 flex-1 rounded',
                  n < currentStep ? 'bg-accent' : 'bg-muted',
                )}
                aria-hidden
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number,
  className: PropTypes.string,
}
