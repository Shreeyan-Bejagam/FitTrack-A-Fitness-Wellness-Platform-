import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const brands = ['Nike', 'Strava', 'MyFitnessPal', 'Fitbit', 'Garmin']

export function SocialProofBar() {
  return (
    <section className="glass border-y border-white/20 py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-medium text-foreground md:text-base">
            Trusted by 50,000+ athletes worldwide
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex text-yellow-500">
              <Star className="h-4 w-4 fill-current" aria-hidden />
            </div>
            <span>
              <span className="font-semibold text-foreground">4.9</span> ★ · 12k reviews
            </span>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {brands.map((b) => (
            <span
              key={b}
              className="glass-chip text-muted-foreground"
            >
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
