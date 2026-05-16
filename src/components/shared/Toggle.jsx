import PropTypes from 'prop-types'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function Toggle({ id, label, checked, onCheckedChange, className }) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <Label htmlFor={id} className="cursor-pointer text-foreground">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func,
  className: PropTypes.string,
}
