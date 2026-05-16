import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { cn } from '@/lib/utils'

const MACROS = [
  { label: 'Calories', cur: 1840, goal: 2200, unit: 'kcal' },
  { label: 'Protein', cur: 142, goal: 180, unit: 'g' },
  { label: 'Carbs', cur: 210, goal: 250, unit: 'g' },
  { label: 'Fat', cur: 58, goal: 70, unit: 'g' },
]

const WEEK_MACRO = [
  { day: 'Mon', p: 130, c: 210, f: 58 },
  { day: 'Tue', p: 140, c: 195, f: 62 },
  { day: 'Wed', p: 128, c: 230, f: 55 },
  { day: 'Thu', p: 150, c: 220, f: 60 },
  { day: 'Fri', p: 135, c: 205, f: 57 },
  { day: 'Sat', p: 145, c: 240, f: 64 },
  { day: 'Sun', p: 138, c: 215, f: 59 },
]

const MEALS = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    total: 590,
    items: [
      { name: 'Oats', portion: '80g', p: 12, c: 54, f: 6, kcal: 350 },
      { name: 'Banana', portion: '120g', p: 1, c: 23, f: 0, kcal: 90 },
      { name: 'Protein Shake', portion: '1 scoop', p: 25, c: 4, f: 3, kcal: 150 },
    ],
  },
  {
    id: 'lunch',
    title: 'Lunch',
    total: 800,
    items: [
      { name: 'Chicken Rice Bowl', portion: '400g', p: 45, c: 62, f: 14, kcal: 620 },
      { name: 'Greek Salad', portion: '200g', p: 8, c: 12, f: 10, kcal: 180 },
    ],
  },
  {
    id: 'dinner',
    title: 'Dinner',
    total: 690,
    items: [
      { name: 'Salmon + Broccoli', portion: '350g', p: 42, c: 18, f: 22, kcal: 480 },
      { name: 'Brown Rice', portion: '180g', p: 6, c: 42, f: 2, kcal: 210 },
    ],
  },
  {
    id: 'snacks',
    title: 'Snacks',
    total: 170,
    items: [{ name: 'Almonds', portion: '30g', p: 6, c: 6, f: 14, kcal: 170 }],
  },
]

const PLANS = [
  { id: '1', name: 'Muscle Gain Plan', kcal: 2800, split: '30 / 45 / 25', active: false },
  { id: '2', name: 'Fat Loss Plan', kcal: 1950, split: '40 / 35 / 25', active: true },
  { id: '3', name: 'Balanced Maintenance', kcal: 2300, split: '30 / 40 / 30', active: false },
]

const FOODS = [
  { name: 'Chicken breast', kcal: 165, sum: '31P · 0C · 4F' },
  { name: 'Greek yogurt', kcal: 97, sum: '9P · 4C · 5F' },
  { name: 'Sweet potato', kcal: 86, sum: '2P · 20C · 0F' },
  { name: 'Avocado', kcal: 160, sum: '2P · 9C · 15F' },
  { name: 'Eggs', kcal: 143, sum: '13P · 1C · 10F' },
  { name: 'Oats', kcal: 389, sum: '17P · 66C · 7F' },
]

const FILTERS = ['All', 'Protein', 'Carbs', 'Fats', 'Vegetables', 'Dairy']

function MacroChip({ children }) {
  return (
    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{children}</span>
  )
}

export function NutritionPage() {
  const [tab, setTab] = useState('today')
  const [foodFilter, setFoodFilter] = useState('All')

  const chartData = useMemo(() => WEEK_MACRO, [])

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Nutrition</h2>
          <p className="text-muted-foreground">Fuel your performance</p>
        </div>
        <Button variant="primary">
          <Plus className="h-4 w-4" aria-hidden />
          Log Meal
        </Button>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex w-full flex-wrap sm:w-auto">
          <TabsTrigger value="today" className="flex-1 sm:flex-none">
            Today
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex-1 sm:flex-none">
            Meal Plans
          </TabsTrigger>
          <TabsTrigger value="library" className="flex-1 sm:flex-none">
            Food Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6 space-y-8">
          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {MACROS.map((m, i) => {
              const pct = Math.min(100, Math.round((m.cur / m.goal) * 100))
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Card className="flex flex-col items-center border-border p-5 text-center">
                    <ProgressRing value={pct} size={100} stroke={8}>
                      <span className="text-xs font-bold">{pct}%</span>
                    </ProgressRing>
                    <p className="mt-3 text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {m.cur.toLocaleString()} / {m.goal.toLocaleString()} {m.unit}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Today&apos;s Meals</h3>
            <Accordion type="multiple" defaultValue={['breakfast', 'lunch', 'dinner', 'snacks']} className="space-y-2">
              {MEALS.map((meal) => (
                <AccordionItem key={meal.id} value={meal.id} className="overflow-hidden rounded-xl border border-border bg-card px-4">
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex w-full items-center justify-between pr-2 text-left">
                      <span className="font-semibold text-foreground">{meal.title}</span>
                      <span className="text-sm text-muted-foreground">{meal.total} kcal</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 border-t border-border pt-3">
                      {meal.items.map((it) => (
                        <li key={it.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-foreground">{it.name}</p>
                            <p className="text-xs text-muted-foreground">{it.portion}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <MacroChip>{it.p}P</MacroChip>
                            <MacroChip>{it.c}C</MacroChip>
                            <MacroChip>{it.f}F</MacroChip>
                            <span className="text-xs text-muted-foreground">{it.kcal} kcal</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="mt-3 w-full text-accent" size="sm">
                      Add food
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-border p-4">
              <h3 className="mb-4 text-lg font-semibold text-foreground">This Week&apos;s Macros</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
                    <Legend />
                    <Bar dataKey="p" name="Protein (g)" fill="hsl(217 91% 55%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="c" name="Carbs (g)" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="f" name="Fat (g)" fill="hsl(48 96% 53%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className={cn('h-full border-border p-5', p.active && 'border-2 border-accent shadow-md')}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    {p.active ? (
                      <Badge variant="accent" size="sm">
                        Active
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Target: {p.kcal} kcal / day</p>
                  <p className="mt-1 text-xs text-muted-foreground">P / C / F %: {p.split}</p>
                  {!p.active ? (
                    <Button variant="outline" className="mt-4 w-full" size="sm">
                      Activate
                    </Button>
                  ) : null}
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-6 space-y-4">
          <input
            type="search"
            placeholder="Search foods..."
            readOnly
            aria-label="Search foods (decorative)"
            className="h-11 w-full max-w-md rounded-lg border border-border bg-background px-3 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFoodFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200',
                  foodFilter === f
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-border bg-card text-muted-foreground hover:border-accent/40',
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOODS.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-border p-4">
                  <h4 className="font-semibold text-foreground">{f.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{f.sum}</p>
                  <p className="mt-2 text-sm text-foreground">{f.kcal} kcal / 100g</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Add to meal
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
