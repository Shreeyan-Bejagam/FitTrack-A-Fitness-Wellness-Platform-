import { Camera, MessageCircle, Share2, Video, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

const product = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Changelog', href: '#' },
]

const company = [
  { label: 'About', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Valid email required')
      return
    }
    setErr('')
    setEmail('')
  }

  return (
    <footer className="border-t border-border bg-muted/30 px-4 py-14 dark:bg-muted/10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Zap className="h-6 w-6 text-accent" aria-hidden />
            FitTrack
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Momentum you can measure — training that fits real life.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Social feed">
              <Share2 className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Photos">
              <Camera className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Videos">
              <Video className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Developer">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Product</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {product.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {company.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Newsletter</h3>
          <p className="mt-2 text-sm text-muted-foreground">Weekly tips, no spam.</p>
          <form onSubmit={submit} className="mt-4 space-y-2">
            <Input
              id="footer-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (err) setErr('')
              }}
              error={err}
            />
            <Button type="submit" variant="primary" size="sm" fullWidth>
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} FitTrack. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}
