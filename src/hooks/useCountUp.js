import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * @param {number} target
 * @param {number} [duration=1.5]
 */
export function useCountUp(target, duration = 1.5) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const c = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: setV,
    })
    return () => c.stop()
  }, [target, duration])
  return Math.round(v)
}
