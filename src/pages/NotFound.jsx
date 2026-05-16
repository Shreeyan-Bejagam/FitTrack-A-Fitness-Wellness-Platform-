import { Link } from 'react-router-dom'
import { Button } from '@/components/shared/Button'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-7xl font-black text-accent">404</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">You&apos;re off track!</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This page did a few extra reps and wandered away. Let&apos;s get you back to the landing page.
      </p>
      <Button variant="primary" size="lg" className="mt-8" asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
