import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { glass, cn } from '@/lib/utils'

export const Card = forwardRef(function Card(
  {
    className,
    children,
    hoverLift = false,
    gradientBorder = false,
    glass: useGlass = true,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border text-card-foreground transition-all duration-300',
        useGlass ? glass.card : 'border-border bg-card',
        hoverLift && 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10',
        gradientBorder &&
          'relative border-0 bg-gradient-to-br from-primary/25 via-accent/15 to-transparent p-px shadow-lg',
        className,
      )}
      {...props}
    >
      {gradientBorder ? (
        <div className={cn('h-full w-full rounded-[11px] p-6', glass.card)}>{children}</div>
      ) : (
        children
      )}
    </div>
  )
})
