import PropTypes from 'prop-types'
import { cn } from '@/lib/utils'

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function hashName(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return Math.abs(h)
}

function initials(name) {
  if (!name) return '?'
  const p = name.trim().split(/\s+/)
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase()
  return `${p[0][0] || ''}${p[p.length - 1][0] || ''}`.toUpperCase()
}

const hues = [
  'bg-primary text-primary-foreground',
  'bg-accent text-accent-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-success text-success-foreground',
]

export function Avatar({ src, alt = '', name = '', size = 'md', className }) {
  const h = hashName(name || alt || 'x')
  const colorClass = hues[h % hues.length]

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold',
        sizes[size],
        !src && colorClass,
        className,
      )}
      role="img"
      aria-label={alt || name || 'User avatar'}
    >
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        initials(name || alt)
      )}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
}
