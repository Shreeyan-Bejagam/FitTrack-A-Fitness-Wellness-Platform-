import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

function Shimmer({ className }) {
  return (
    <span
      className={cn(
        'relative inline-flex overflow-hidden rounded-md bg-muted',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent dark:after:via-white/10',
        className,
      )}
      aria-hidden
    />
  )
}

export function Skeleton({ variant = 'text', className }) {
  if (variant === 'text') {
    return <Shimmer className={cn('h-4 w-full', className)} />
  }
  if (variant === 'card') {
    return <Shimmer className={cn('h-32 w-full', className)} />
  }
  if (variant === 'avatar') {
    return <Shimmer className={cn('h-12 w-12 rounded-full', className)} />
  }
  if (variant === 'chart') {
    return <Shimmer className={cn('h-40 w-full rounded-lg', className)} />
  }
  return <Shimmer className={className} />
}

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'card', 'avatar', 'chart']),
  className: PropTypes.string,
}
