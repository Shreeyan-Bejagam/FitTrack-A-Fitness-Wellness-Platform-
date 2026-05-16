import PropTypes from 'prop-types'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-4 py-10 text-center',
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-16 w-16 text-muted-foreground" aria-hidden />
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {ctaLabel && onCta ? (
        <Button variant="outline" onClick={onCta}>
          {ctaLabel}
        </Button>
      ) : null}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ctaLabel: PropTypes.string,
  onCta: PropTypes.func,
  className: PropTypes.string,
}
