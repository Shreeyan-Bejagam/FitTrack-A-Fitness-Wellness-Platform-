import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'

const features = [
  'Workout logging',
  'Basic analytics',
  'Community access',
  'Meal planning AI',
  'Priority support',
  'Advanced reports',
]

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    highlight: false,
    included: [true, true, true, false, false, false],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/mo',
    highlight: true,
    included: [true, true, true, true, true, false],
    cta: 'Start Free Trial',
  },
  {
    name: 'Elite',
    price: '$19.99',
    period: '/mo',
    highlight: false,
    included: [true, true, true, true, true, true],
    cta: 'Start Free Trial',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-muted/30 px-4 py-20 dark:bg-muted/10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Pricing</h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Simple tiers. Compare features in one glance.
          </p>
        </motion.div>
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={tier.highlight ? 'lg:-mt-4 lg:mb-4' : ''}
            >
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card
                  className={`relative flex h-full flex-col p-6 shadow-md ${
                    tier.highlight
                      ? 'scale-105 border-2 border-accent bg-gradient-to-br from-accent/10 via-card to-card'
                      : ''
                  }`}
                >
                  {tier.highlight ? (
                    <Badge variant="accent" className="absolute right-4 top-4">
                      Most Popular
                    </Badge>
                  ) : null}
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="mt-6 flex flex-col gap-3">
                    {features.map((f, j) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        {tier.included[j] ? (
                          <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                        <span
                          className={
                            tier.included[j] ? 'text-foreground' : 'text-muted-foreground line-through'
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="primary" fullWidth className="mt-8" asChild>
                    <Link to="/signup">{tier.cta}</Link>
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
