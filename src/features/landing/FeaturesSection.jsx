import { motion } from 'framer-motion'
import { Apple, Dumbbell, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/shared/Card'

const feats = [
  {
    title: 'Workout Tracking',
    desc: 'Log sets, reps, and rest with flows built for real gym sessions.',
    Icon: Dumbbell,
  },
  {
    title: 'Nutrition Plans',
    desc: 'Fuel recovery with meal guidance aligned to your daily targets.',
    Icon: Apple,
  },
  {
    title: 'Progress Analytics',
    desc: 'Spot trends early with clear charts and streak-ready summaries.',
    Icon: TrendingUp,
  },
  {
    title: 'Community',
    desc: 'Stay accountable with challenges and friends who show up.',
    Icon: Users,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Features</h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Everything you need to stay consistent without the clutter.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {feats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Card
                  hoverLift
                  className="h-full border-border p-6 transition-colors duration-300 hover:border-accent/60 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <f.Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
