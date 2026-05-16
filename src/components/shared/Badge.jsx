import { cva } from 'class-variance-authority'
import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-medium transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-foreground',
        success: 'border-success/30 bg-success/15 text-success',
        warning: 'border-accent/40 bg-accent/15 text-accent-foreground',
        error: 'border-error/40 bg-error/10 text-error',
        accent: 'border-accent/50 bg-accent/20 text-accent-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export function Badge({ className, variant, size, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'accent']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
}

export { badgeVariants }
