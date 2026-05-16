import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck,
  ChevronDown,
  Dumbbell,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Timer,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { cn } from '@/lib/utils'

const STATS = [
  { label: 'Total Workouts', value: '48', Icon: Dumbbell },
  { label: 'This Month', value: '12', Icon: CalendarCheck },
  { label: 'Avg Duration', value: '52 min', Icon: Timer },
  { label: 'Personal Records', value: '7', Icon: Trophy },
]

const WORKOUTS = [
  {
    id: '1',
    name: 'Full Body Strength',
    tags: ['Strength'],
    duration: 45,
    exercises: 6,
    difficulty: 'medium',
    last: '3 days ago',
  },
  {
    id: '2',
    name: 'HIIT Cardio Blast',
    tags: ['Cardio'],
    duration: 32,
    exercises: 8,
    difficulty: 'hard',
    last: '1 week ago',
  },
  {
    id: '3',
    name: 'Upper Body Push',
    tags: ['Strength'],
    duration: 55,
    exercises: 7,
    difficulty: 'medium',
    last: '5 days ago',
  },
  {
    id: '4',
    name: 'Leg Day',
    tags: ['Strength'],
    duration: 60,
    exercises: 5,
    difficulty: 'hard',
    last: '2 days ago',
  },
  {
    id: '5',
    name: 'Core & Flexibility',
    tags: ['Flexibility'],
    duration: 30,
    exercises: 9,
    difficulty: 'easy',
    last: '1 day ago',
  },
  {
    id: '6',
    name: 'Active Recovery',
    tags: ['Flexibility'],
    duration: 25,
    exercises: 6,
    difficulty: 'easy',
    last: '4 days ago',
  },
]

const WEEK = [
  { day: 'Mon', date: '12', workout: 'Upper Push', rest: false },
  { day: 'Tue', date: '13', workout: 'HIIT Cardio', rest: false },
  { day: 'Wed', date: '14', workout: 'Rest Day', rest: true },
  { day: 'Thu', date: '15', workout: 'Leg Day', rest: false },
  { day: 'Fri', date: '16', workout: 'Full Body', rest: false },
  { day: 'Sat', date: '17', workout: 'Active Recovery', rest: false, today: true },
  { day: 'Sun', date: '18', workout: 'Rest Day', rest: true },
]

const HISTORY = [
  ['May 14, 2026', 'Leg Day', '58 min', '6', '4,200', 'completed'],
  ['May 12, 2026', 'Upper Push', '52 min', '7', '3,850', 'completed'],
  ['May 10, 2026', 'HIIT', '34 min', '8', '2,100', 'completed'],
  ['May 9, 2026', 'Full Body', '47 min', '6', '3,400', 'completed'],
  ['May 7, 2026', 'Core', '31 min', '9', '1,800', 'completed'],
  ['May 5, 2026', 'Recovery', '28 min', '6', '900', 'completed'],
  ['May 3, 2026', 'Leg Day', '61 min', '5', '4,500', 'completed'],
  ['May 1, 2026', 'Push', '49 min', '7', '3,200', 'completed'],
]

function diffDot(diff) {
  const map = {
    easy: 'bg-success',
    medium: 'bg-yellow-500',
    hard: 'bg-error',
  }
  return <span className={cn('inline-block h-2.5 w-2.5 rounded-full', map[diff])} aria-hidden />
}

export function WorkoutsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selected, setSelected] = useState(/** @type {null | (typeof WORKOUTS)[0]} */ (null))
  const [menuId, setMenuId] = useState(/** @type {null | string} */ (null))
  const [checks, setChecks] = useState(/** @type {Record<string, boolean>} */ ({}))

  const openWorkout = (w) => {
    setSelected(w)
    setSheetOpen(true)
    setChecks({})
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">My Workouts</h2>
          <p className="text-muted-foreground">Track, plan, and crush your training</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">
            <Plus className="h-4 w-4" aria-hidden />
            Create Workout
          </Button>
          <Button variant="outline">
            <LayoutGrid className="h-4 w-4" aria-hidden />
            Browse Templates
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border bg-gradient-to-br from-card to-muted/30 p-5 dark:to-muted/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <s.Icon className="h-8 w-8 text-accent" aria-hidden />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Tabs defaultValue="my" className="w-full">
          <TabsList className="flex w-full flex-wrap sm:w-auto">
            <TabsTrigger value="my" className="flex-1 sm:flex-none">
              My Workouts
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1 sm:flex-none">
              This Week&apos;s Plan
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORKOUTS.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Card className="group relative h-full overflow-hidden border-border p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{w.name}</h3>
                      <div className="relative">
                        <button
                          type="button"
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Workout actions"
                          aria-expanded={menuId === w.id}
                          onClick={() => setMenuId(menuId === w.id ? null : w.id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        <AnimatePresence>
                          {menuId === w.id ? (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card py-1 text-sm shadow-lg"
                              role="menu"
                            >
                              <button type="button" className="block w-full px-3 py-2 text-left hover:bg-muted" role="menuitem">
                                Edit
                              </button>
                              <button type="button" className="block w-full px-3 py-2 text-left hover:bg-muted" role="menuitem">
                                Duplicate
                              </button>
                              <button
                                type="button"
                                className="block w-full px-3 py-2 text-left text-error hover:bg-muted"
                                role="menuitem"
                              >
                                Delete
                              </button>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {w.tags.map((t) => (
                        <Badge key={t} variant="accent" size="sm">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{w.duration} min</span>
                      <span>{w.exercises} exercises</span>
                      {diffDot(w.difficulty)}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Last: {w.last}</p>
                    <div className="mt-4 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                      <Button variant="primary" className="w-full" onClick={() => openWorkout(w)}>
                        Start
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="week" className="mt-6">
            <Card className="border-border p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Drag to reschedule (decorative)</p>
                <Button variant="outline" size="sm">
                  Edit Plan
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {WEEK.map((d) => (
                  <div
                    key={d.day}
                    className={cn(
                      'min-w-[100px] flex-1 rounded-xl border p-3 text-center',
                      d.today ? 'border-2 border-accent bg-accent/5 shadow-md' : 'border-border bg-card',
                    )}
                  >
                    <p className="text-xs font-medium text-muted-foreground">{d.day}</p>
                    <p className="text-lg font-bold text-foreground">{d.date}</p>
                    <p className={cn('mt-2 text-xs', d.rest ? 'text-muted-foreground' : 'font-medium text-foreground')}>
                      {d.workout}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="overflow-hidden border-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      {['Date', 'Workout Name', 'Duration', 'Exercises', 'Volume (kg)', 'Status'].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold text-foreground">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:text-accent"
                            aria-label={`Sort by ${h} (visual only)`}
                          >
                            {h}
                            <ChevronDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HISTORY.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3 text-muted-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        <td className="px-4 py-3">{row[3]}</td>
                        <td className="px-4 py-3">{row[4]}</td>
                        <td className="px-4 py-3">
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border p-4 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex flex-col overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.name ?? 'Workout'}</SheetTitle>
            <SheetDescription>
              {selected ? (
                <span className="flex items-center gap-2">
                  {diffDot(selected.difficulty)}
                  <span className="capitalize">{selected.difficulty}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>~{selected.duration} min estimated</span>
                </span>
              ) : null}
            </SheetDescription>
          </SheetHeader>
          <ul className="mt-6 flex-1 space-y-3">
            {selected
              ? [
                  { n: 'Squat', sr: '4 × 8', rest: '90s' },
                  { n: 'Bench Press', sr: '4 × 6', rest: '120s' },
                  { n: 'Romanian Deadlift', sr: '3 × 10', rest: '90s' },
                  { n: 'Pull-ups', sr: '3 × 8', rest: '75s' },
                  { n: 'Plank', sr: '3 × 45s', rest: '60s' },
                ].map((ex) => (
                  <li key={ex.n} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{ex.n}</p>
                        <p className="text-xs text-muted-foreground">
                          {ex.sr} · Rest {ex.rest}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-accent"
                          checked={!!checks[ex.n]}
                          onChange={() => setChecks((c) => ({ ...c, [ex.n]: !c[ex.n] }))}
                        />
                        Done
                      </label>
                    </div>
                  </li>
                ))
              : null}
          </ul>
          <Button variant="primary" className="mt-6 w-full" onClick={() => setSheetOpen(false)}>
            Begin Workout
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
