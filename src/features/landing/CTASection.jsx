import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

export function CTASection() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!ok) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setDone(true)
  }

  return (
    <section className="px-4 py-20 md:px-6 lg:px-8">
      <motion.div
        className="glass-cta mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-16 text-center text-primary-foreground md:px-12"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <h2 className="text-3xl font-extrabold md:text-4xl">Start Your Fitness Journey Today</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90 md:text-lg">
          Join thousands building better habits with clarity, not chaos.
        </p>
        {done ? (
          <p className="mt-8 text-xl font-semibold">You&apos;re on the list! 🎉</p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-start"
          >
            <div className="w-full min-w-0 flex-1 text-left [&_label]:text-primary-foreground [&_.text-sm]:text-white/80">
              <Input
                id="cta-email"
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                error={error}
                className="w-full border-white/40 bg-white/20 text-primary-foreground backdrop-blur-md placeholder:text-primary-foreground/70"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full shrink-0 sm:mt-8 sm:w-auto"
            >
              Get Started Free
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  )
}
