import { motion } from 'framer-motion'
import { BarChart2, Target, UserPlus } from 'lucide-react'

const steps = [
  { n: 1, title: 'Sign Up', desc: 'Create your profile in under a minute.', Icon: UserPlus },
  { n: 2, title: 'Set Your Goals', desc: 'Pick the outcomes that matter to you.', Icon: Target },
  { n: 3, title: 'Track Progress', desc: 'Watch trends build week over week.', Icon: BarChart2 },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/30 px-4 py-20 dark:bg-muted/10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">How it works</h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Three steps from signup to unstoppable momentum.
          </p>
        </motion.div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {steps.map((s, i) => (
            <div key={s.n} className="flex flex-1 flex-col items-center lg:flex-row">
              <motion.div
                className="flex w-full max-w-sm flex-col items-center text-center lg:max-w-none"
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                  {s.n}
                </div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <s.Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
              {i < steps.length - 1 ? (
                <div
                  className="my-4 hidden h-0.5 flex-1 border-t-2 border-dashed border-border lg:mx-4 lg:my-0 lg:mt-14 lg:block lg:min-w-[40px]"
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
