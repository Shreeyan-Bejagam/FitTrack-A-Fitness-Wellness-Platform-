import { motion } from 'framer-motion'
import { Armchair, Bike, Flame, Footprints, Trophy } from 'lucide-react'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'

const LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    desc: 'Mostly sitting, desk job',
    Icon: Armchair,
  },
  {
    id: 'light',
    title: 'Lightly Active',
    desc: 'Light exercise 1–2x/week',
    Icon: Footprints,
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    desc: 'Moderate exercise 3–4x/week',
    Icon: Bike,
  },
  {
    id: 'very',
    title: 'Very Active',
    desc: 'Hard training 5+ days/week',
    Icon: Flame,
  },
  {
    id: 'athlete',
    title: 'Athlete',
    desc: 'Professional-level training daily',
    Icon: Trophy,
  },
]

export const Step4ActivityLevel = forwardRef(function Step4ActivityLevel({ setCanProceed }, ref) {
  const [selected, setSelected] = useState(/** @type {string | null} */ (null))
  const [skipped, setSkipped] = useState(false)

  useImperativeHandle(ref, () => ({
    submit: () => Promise.resolve({ activity: skipped ? null : selected }),
  }))

  useEffect(() => {
    setCanProceed(skipped || Boolean(selected))
  }, [skipped, selected, setCanProceed])

  const skip = () => {
    setSkipped(true)
    setSelected(null)
  }

  return (
    <div className="space-y-3">
      {LEVELS.map((l, i) => {
        const on = selected === l.id
        return (
          <motion.button
            key={l.id}
            type="button"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => {
              setSkipped(false)
              setSelected(l.id)
            }}
            className={cn(
              'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors duration-200',
              on ? 'border-l-4 border-l-accent bg-accent/10' : 'border-border bg-card hover:border-accent/30',
            )}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <l.Icon className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{l.title}</p>
              <p className="text-sm text-muted-foreground">{l.desc}</p>
            </div>
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                on ? 'border-accent bg-accent' : 'border-muted-foreground/40',
              )}
              aria-hidden
            >
              {on ? <span className="h-2 w-2 rounded-full bg-accent-foreground" /> : null}
            </div>
          </motion.button>
        )
      })}
      <button
        type="button"
        onClick={skip}
        className="mt-2 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Skip for now
      </button>
    </div>
  )
})

Step4ActivityLevel.displayName = 'Step4ActivityLevel'
Step4ActivityLevel.propTypes = { setCanProceed: PropTypes.func.isRequired }
