import { motion } from 'framer-motion'
import { Dumbbell, Flame, Target, TrendingUp, UtensilsCrossed, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { Skeleton } from '@/components/shared/Skeleton'
import { useCountUp } from '@/hooks/useCountUp'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const weekData = [
  { day: 'Mon', val: 320, isToday: false },
  { day: 'Tue', val: 410, isToday: false },
  { day: 'Wed', val: 280, isToday: false },
  { day: 'Thu', val: 390, isToday: false },
  { day: 'Fri', val: 450, isToday: false },
  { day: 'Sat', val: 510, isToday: true },
  { day: 'Sun', val: 360, isToday: false },
]

const exercises = [
  { id: '1', name: 'Squat', detail: '4×8' },
  { id: '2', name: 'Bench Press', detail: '4×6' },
  { id: '3', name: 'Deadlift', detail: '3×5' },
  { id: '4', name: 'Pull-ups', detail: '3×10' },
  { id: '5', name: 'Plank', detail: '3×60s' },
]

/** Toggle to preview bonus empty states */
const USE_WORKOUT_EMPTY = false
const USE_CHART_EMPTY = false

export function DashboardOverview() {
  const user = useAuthStore((s) => s.user)
  const name = user?.displayName || user?.fullName || 'Athlete'
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(weekData)
  const [done, setDone] = useState(() =>
    exercises.reduce((acc, e) => ({ ...acc, [e.id]: false }), {}),
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { workoutApi } = await import('@/lib/api/workout.api')
        const { data } = await workoutApi.getWeeklyStats()
        const wd = data?.data?.weekData
        if (!cancelled && Array.isArray(wd) && wd.length) {
          const todayJs = new Date().getDay()
          const idx = todayJs === 0 ? 6 : todayJs - 1
          setChartData(
            wd.map((row, i) => ({
              day: row.day,
              val: Number(row.val) || 0,
              isToday: i === idx,
            })),
          )
        }
      } catch {
        /* offline or no API — keep defaults */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const dateStr = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  )

  const kcal = useCountUp(1840, 1.5)
  const capped = exercises.filter((e) => done[e.id]).length

  if (loading) {
    return (
      <div className="min-w-0 max-w-full space-y-6">
        <div className="flex gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-6 w-48" />
            <Skeleton variant="text" className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <Skeleton variant="chart" />
      </div>
    )
  }

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <motion.header
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {greeting}, {name.split(' ')[0]} 👋
          </h2>
          <p className="text-muted-foreground">{dateStr}</p>
        </div>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Calories burned',
            value: `${kcal.toLocaleString()} kcal`,
            sub: '+12% vs last week',
            Icon: Flame,
          },
          {
            label: 'Workouts this week',
            value: '4 / 5',
            sub: 'Almost there',
            Icon: Dumbbell,
          },
          {
            label: 'Streak',
            value: '14 days',
            sub: 'Keep it rolling',
            Icon: Zap,
          },
          {
            label: 'Goal progress',
            value: '68%',
            sub: '',
            Icon: Target,
            ring: true,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-border bg-gradient-to-br from-card to-muted/30 p-5 transition-shadow duration-200 hover:shadow-lg dark:from-card dark:to-muted/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                  {s.sub ? (
                    <span className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                      {s.sub}
                    </span>
                  ) : null}
                </div>
                {s.ring ? (
                  <ProgressRing value={68} size={72} stroke={6}>
                    68%
                  </ProgressRing>
                ) : (
                  <s.Icon className="h-8 w-8 text-accent" aria-hidden />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Today&apos;s Workout: Full Body Strength</h3>
            <Button variant="primary" size="sm">
              Start Workout
            </Button>
          </div>
          {USE_WORKOUT_EMPTY ? (
            <EmptyState
              icon={Dumbbell}
              title="No workout queued"
              description="Pick a template or build a custom session to get moving."
              ctaLabel="Browse workouts"
              onCta={() => {}}
            />
          ) : (
            <>
              <ul className="space-y-2">
                {exercises.map((ex) => (
                  <li key={ex.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={done[ex.id]}
                      onChange={() => setDone((d) => ({ ...d, [ex.id]: !d[ex.id] }))}
                      className="h-5 w-5 rounded border-border accent-accent"
                      aria-label={`Mark ${ex.name} complete`}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        done[ex.id] && 'text-muted-foreground line-through',
                      )}
                    >
                      {ex.name}{' '}
                      <span className="font-normal text-muted-foreground">{ex.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <ProgressBar value={(capped / exercises.length) * 100} color="accent" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {capped}/{exercises.length} exercises completed
                </p>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <Card className="border-border p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly activity</h3>
          {USE_CHART_EMPTY ? (
            <EmptyState
              icon={TrendingUp}
              title="No activity yet"
              description="Log a workout or sync your wearable to see your week light up."
              ctaLabel="Log workout"
              onCta={() => {}}
            />
          ) : (
            <div className="h-64 w-full min-w-0 max-w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                    {chartData.map((e) => (
                      <Cell
                        key={e.day}
                        fill={e.isToday ? 'hsl(var(--accent))' : 'hsl(var(--muted))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div
        className="flex min-w-0 max-w-full flex-wrap gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
      >
        <Button variant="outline" asChild>
          <Link to="/dashboard/workouts" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" aria-hidden />
            Start Workout
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/nutrition" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" aria-hidden />
            Log Meal
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" aria-hidden />
            View Progress
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
