import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Moon, Sun, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/Button'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrolled } from '@/hooks/useScrolled'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
]

export function Navbar() {
  const scrolled = useScrolled(80)
  const [open, setOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const drawerRef = useFocusTrap(open)
  const firstFocusRef = useRef(/** @type {HTMLButtonElement | null} */ (null))

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, drawerRef])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass-nav border-b'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Zap className="h-7 w-7 text-accent" aria-hidden />
          FitTrack
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-muted"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Button variant="outline" size="md" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="primary" size="md" asChild>
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-foreground"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              aria-hidden
            />
            <motion.div
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-panel fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col gap-6 border-l p-6 md:hidden"
            >
              <div className="flex justify-end">
                <button
                  ref={firstFocusRef}
                  type="button"
                  className="rounded-lg p-2 text-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-lg font-medium text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
                <Button variant="outline" fullWidth asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button variant="primary" fullWidth asChild>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
