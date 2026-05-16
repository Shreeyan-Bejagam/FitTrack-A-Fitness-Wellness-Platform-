import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteProgress() {
  const { pathname } = useLocation()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
    const t = window.setTimeout(() => setActive(false), 400)
    return () => window.clearTimeout(t)
  }, [pathname])

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent">
      <motion.div
        className="h-full bg-accent"
        initial={{ width: '0%', opacity: 0 }}
        animate={
          active
            ? { width: ['0%', '60%', '100%'], opacity: [1, 1, 0] }
            : { width: '100%', opacity: 0 }
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />
    </div>
  )
}
