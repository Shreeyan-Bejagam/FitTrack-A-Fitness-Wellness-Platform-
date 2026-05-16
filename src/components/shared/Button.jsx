import { Loader2 } from 'lucide-react'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { Button as UiButton, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  destructive: 'destructive',
}

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
}

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    asChild = false,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <UiButton
      ref={ref}
      asChild={asChild}
      variant={variantMap[variant] ?? 'default'}
      size={sizeMap[size] ?? 'default'}
      disabled={disabled || loading}
      className={cn(fullWidth && 'w-full', className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          ) : null}
          {loading ? <span className="sr-only">Loading</span> : null}
          {children}
        </>
      )}
    </UiButton>
  )
})

Button.displayName = 'Button'

Button.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'destructive',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
}

export { buttonVariants }
