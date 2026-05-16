import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useRef } from 'react'
import avatarManA from '@/assets/testimonials/man-smiling-a.jpg'
import avatarManB from '@/assets/testimonials/man-smiling-b.jpg'
import avatarWomanBraids from '@/assets/testimonials/woman-braids.jpg'
import { Card } from '@/components/shared/Card'

/** Raster exports from project illustration packs (companion .eps files live alongside sources on disk). */
const data = [
  {
    name: 'Jordan Lee',
    role: 'Marathon coach',
    quote: 'FitTrack keeps my clients honest without drowning them in spreadsheets.',
    avatar: avatarManA,
  },
  {
    name: 'Sam Rivera',
    role: 'Hybrid athlete',
    quote: 'Finally an app that respects strength days and recovery in one place.',
    avatar: avatarWomanBraids,
  },
  {
    name: 'Alex Kim',
    role: 'Weekend warrior',
    quote: 'The streaks and quick logging made consistency actually stick for me.',
    avatar: avatarManB,
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-yellow-500" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  )
}

function TestimonialAvatar({ src }) {
  return (
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      className="h-12 w-12 shrink-0 rounded-full border border-border object-cover object-center shadow-sm"
      loading="lazy"
      decoding="async"
    />
  )
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const dragConstraints = { left: -500, right: 0 }

  return (
    <section id="testimonials" className="scroll-mt-24 px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Testimonials</h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Real momentum from people who train for real life.
          </p>
        </motion.div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          {data.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-border p-6 shadow-md">
                <div className="flex items-center gap-3">
                  <TestimonialAvatar src={t.avatar} />
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Stars />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div ref={ref} className="overflow-hidden lg:hidden">
          <motion.div
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            className="flex cursor-grab gap-4 active:cursor-grabbing"
          >
            {data.map((t) => (
              <Card key={t.name} className="min-w-[85vw] shrink-0 border-border p-6 shadow-md sm:min-w-[360px]">
                <div className="flex items-center gap-3">
                  <TestimonialAvatar src={t.avatar} />
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Stars />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
