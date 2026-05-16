import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

const colors = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
}

export function ProgressBar({
  value,
  className,
  color = 'primary',
  trackClassName,
}) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', trackClassName)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn('h-full rounded-full', colors[color] ?? colors.primary)}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'accent', 'success']),
  trackClassName: PropTypes.string,
}
