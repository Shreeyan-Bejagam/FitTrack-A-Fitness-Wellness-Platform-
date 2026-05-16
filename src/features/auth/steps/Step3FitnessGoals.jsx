import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const GOALS = [
  { id: 'lose', label: 'Lose Weight', emoji: '🔥' },
  { id: 'muscle', label: 'Build Muscle', emoji: String.fromCodePoint(0x1f4aa) },
  { id: 'active', label: 'Stay Active', emoji: '🏃' },
  { id: 'flex', label: 'Improve Flexibility', emoji: '🧘' },
  { id: 'eat', label: 'Eat Healthier', emoji: '🥗' },
  { id: 'stress', label: 'Reduce Stress', emoji: '🧠' },
]

export const Step3FitnessGoals = forwardRef(function Step3FitnessGoals({ setCanProceed }, ref) {
  const [selected, setSelected] = useState(/** @type {string[]} */ ([]))

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  useImperativeHandle(ref, () => ({
    submit: () => Promise.resolve({ goals: selected }),
  }))

  useEffect(() => {
    setCanProceed(selected.length >= 1)
  }, [selected, setCanProceed])

  const maxed = selected.length >= 3

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">Select 1–3 goals that matter to you</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {GOALS.map((g, i) => {
          const on = selected.includes(g.id)
          const dim = maxed && !on
          return (
            <motion.button
              key={g.id}
              type="button"
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: dim ? 1 : 1.02 }}
              disabled={dim}
              onClick={() => toggle(g.id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-colors duration-200 ${
                on
                  ? 'border-accent bg-accent/10'
                  : dim
                    ? 'cursor-not-allowed border-border opacity-40'
                    : 'border-border bg-card hover:border-accent/40'
              }`}
            >
              {on ? (
                <CheckCircle className="absolute right-2 top-2 h-5 w-5 text-accent" aria-hidden />
              ) : null}
              <span className="text-2xl">{g.emoji}</span>
              <p className="mt-2 text-sm font-semibold text-foreground">{g.label}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})

Step3FitnessGoals.displayName = 'Step3FitnessGoals'
Step3FitnessGoals.propTypes = { setCanProceed: PropTypes.func.isRequired }
