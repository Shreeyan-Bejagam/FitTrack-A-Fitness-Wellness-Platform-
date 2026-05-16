import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  color = 'hsl(var(--accent))',
  className,
  children,
}) {
  const v = Math.min(100, Math.max(0, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(v)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
        {children}
      </div>
    </div>
  )
}

ProgressRing.propTypes = {
  value: PropTypes.number.isRequired,
  size: PropTypes.number,
  stroke: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}
