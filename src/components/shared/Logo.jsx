import { useId } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-7 w-7',
  lg: 'h-8 w-8',
}

/** Gradient badge + dumbbell mark (replaces lightning icon). */
export function LogoMark({ className, title = 'FitTrack' }) {
  const gradientId = useId().replace(/:/g, '')

  return (
    <svg
      className={cn('shrink-0', className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      <path
        d="M7 13.5h4.2v5H7v-5zm17.8 0H25v5h-4.2v-5z"
        fill="white"
        fillOpacity="0.95"
      />
      <path d="M11.2 14.8h9.6v2.4H11.2v-2.4z" fill="white" />
      <path
        d="M10 22.5c2.2 2.2 9.8 2.2 12 0"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  )
}

LogoMark.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
}

export function Logo({
  className,
  size = 'md',
  showText = true,
  textClassName,
  to,
  onDark = false,
}) {
  const mark = <LogoMark className={sizeMap[size]} />
  const label = showText ? (
    <span
      className={cn(
        'text-lg font-bold',
        onDark ? 'text-primary-foreground' : 'text-foreground',
        textClassName,
      )}
    >
      FitTrack
    </span>
  ) : null

  const inner = (
    <>
      {mark}
      {label}
    </>
  )

  const wrapClass = cn('inline-flex items-center gap-2', className)

  if (to) {
    return (
      <Link to={to} className={wrapClass}>
        {inner}
      </Link>
    )
  }

  return <span className={wrapClass}>{inner}</span>
}

Logo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showText: PropTypes.bool,
  textClassName: PropTypes.string,
  to: PropTypes.string,
  onDark: PropTypes.bool,
}
