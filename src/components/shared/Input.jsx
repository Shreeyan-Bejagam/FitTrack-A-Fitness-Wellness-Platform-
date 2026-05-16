import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input as UiInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    ...props
  },
  ref,
) {
  const errId = error ? `${id}-error` : undefined
  const helpId = helperText ? `${id}-help` : undefined

  return (
    <div className="w-full space-y-2">
      {label ? (
        <Label htmlFor={id} className="text-foreground">
          {label}
        </Label>
      ) : null}
      <div className="relative">
        {LeftIcon ? (
          <LeftIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        ) : null}
        <UiInput
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[errId, helpId].filter(Boolean).join(' ') || undefined}
          aria-required={props.required ? 'true' : undefined}
          className={cn(
            LeftIcon && 'pl-10',
            RightIcon && 'pr-10',
            error && 'border-error focus-visible:outline-error',
            className,
          )}
          {...props}
        />
        {RightIcon ? (
          <RightIcon
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        ) : null}
      </div>
      {error ? (
        <p id={errId} className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      {helperText && !error ? (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})

Input.displayName = 'SharedInput'

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  className: PropTypes.string,
}
