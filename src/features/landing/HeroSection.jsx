import { motion } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/Button'

const float = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 24,
      y: ((e.clientY - r.top) / r.height - 0.5) * 24,
    })
  }, [])

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-24 pt-8 md:px-6 lg:px-8"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[length:200%_200%] animate-gradient-shift opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.35), transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(var(--accent) / 0.25), transparent 45%)',
          transform: `translate(${mouse.x}px, ${mouse.y}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background/50 backdrop-blur-[2px] dark:bg-background/40" />

      <div className="mx-auto grid max-w-7xl flex-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.h1
            className="text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block">Train smarter with</span>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitTrack
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The all-in-one fitness companion for workouts, nutrition, and momentum that lasts.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="primary" size="lg" fullWidth className="sm:w-auto sm:min-w-[200px]" asChild>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" fullWidth className="sm:w-auto sm:min-w-[200px]">
              <Play className="h-5 w-5" aria-hidden />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center lg:min-h-[400px]">
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl" />
          <div className="relative flex w-full max-w-md flex-col gap-4">
            {[
              { t: 'Calories Burned: 420', emoji: '🔥' },
              { t: 'Workouts: 5 this week', emoji: String.fromCodePoint(0x1f4aa) },
            ].map((c, i) => (
              <motion.div
                key={c.t}
                className="glass-card rounded-2xl p-4 shadow-lg"
                variants={float}
                animate="animate"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                style={{ marginLeft: i % 2 === 0 ? 0 : 'auto', maxWidth: '280px' }}
              >
                <p className="text-sm font-medium text-foreground">
                  {c.emoji} {c.t}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.a
        href="#features"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center text-muted-foreground"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to features"
      >
        <ChevronDown className="h-8 w-8 animate-bounce-arrow" />
      </motion.a>
    </section>
  )
}
