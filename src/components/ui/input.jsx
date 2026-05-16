import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'glass-input flex h-11 min-h-[44px] w-full rounded-md border px-3 py-2 text-base text-foreground transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
