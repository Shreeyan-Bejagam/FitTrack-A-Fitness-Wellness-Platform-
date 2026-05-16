import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn } from '@/lib/utils'

const METRICS = [
  { label: 'Weight', value: '78.4 kg', trend: '−2.1 kg this month', up: false, good: true },
  { label: 'Body Fat %', value: '18.2%', trend: '−1.4% this month', up: false, good: true },
  { label: 'Muscle Mass', value: '64.2 kg', trend: '+0.8 kg', up: true, good: true },
  { label: 'Fitness Score', value: '742', trend: '+38 pts', up: true, good: true },
]

const BODY_CHART = [
  { w: 1, weight: 80.2, fat: 20.1 },
  { w: 2, weight: 79.8, fat: 19.6 },
  { w: 3, weight: 79.5, fat: 19.4 },
  { w: 4, weight: 79.0, fat: 19.0 },
  { w: 5, weight: 78.8, fat: 18.8 },
  { w: 6, weight: 78.6, fat: 18.5 },
  { w: 7, weight: 78.5, fat: 18.4 },
  { w: 8, weight: 78.4, fat: 18.2 },
]

const STRENGTH = [
  { name: 'Squat', start: 60, current: 95, pr: false },
  { name: 'Bench Press', start: 50, current: 82.5, pr: true },
  { name: 'Deadlift', start: 70, current: 120, pr: true },
  { name: 'Pull-ups', start: 0, current: 12, pr: false },
  { name: 'Shoulder Press', start: 30, current: 45, pr: false },
]

const MEASUREMENTS = [
  ['May 14', '78.4', '102', '82', '98', '34', '58'],
  ['May 7', '78.6', '101', '83', '99', '34', '58'],
  ['Apr 30', '78.9', '101', '84', '99', '33', '59'],
  ['Apr 23', '79.2', '100', '85', '100', '33', '59'],
  ['Apr 16', '79.5', '100', '86', '100', '32', '60'],
  ['Apr 9', '79.8', '99', '87', '101', '32', '60'],
]

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function HeatmapGrid() {
  const weeks = 12
  const days = 7
  const cells = useMemo(() => {
    const rnd = mulberry32(42)
    const g = []
    for (let w = 0; w < weeks; w++) {
      const col = []
      for (let d = 0; d < days; d++) {
        const isWeekend = d >= 5
        let v = 0
        const r = rnd()
        if (!isWeekend && r > 0.15) v = r > 0.55 ? (r > 0.85 ? 3 : 2) : 1
        else if (isWeekend && r > 0.7) v = 1
        col.push(v)
      }
      g.push(col)
    }
    return g
  }, [])

  const intensity = (v) => {
    if (v === 0) return 'bg-muted'
    if (v === 1) return 'bg-accent/30'
    if (v === 2) return 'bg-accent/60'
    return 'bg-accent'
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <Card className="overflow-x-auto border-border p-4">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Workout frequency</h3>
      <div className="flex min-w-[520px] gap-1">
        <div className="flex flex-col justify-around pt-6 text-[10px] text-muted-foreground">
          {dayLabels.map((d, i) => (
            <div key={i} className="h-3 leading-3">
              {d}
            </div>
          ))}
        </div>
        <div className="flex flex-1 gap-1">
          {cells.map((col, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {wi % 4 === 0 ? (
                <span className="mb-1 text-center text-[10px] text-muted-foreground">W{wi + 1}</span>
              ) : (
                <span className="mb-1 h-3" />
              )}
              {col.map((v, di) => (
                <div
                  key={di}
                  className={cn('h-3 w-3 rounded-sm', intensity(v))}
                  title={`${v} workouts`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-0.5">
          {['bg-muted', 'bg-accent/30', 'bg-accent/60', 'bg-accent'].map((c) => (
            <div key={c} className={cn('h-3 w-3 rounded-sm', c)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </Card>
  )
}

const RANGE = ['1M', '3M', '6M', '1Y']

export function ProgressPage() {
  const [range, setRange] = useState('3M')

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">My Progress</h2>
          <p className="text-muted-foreground">Every rep counts. See how far you&apos;ve come.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGE.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
                range === r
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-border bg-card text-muted-foreground hover:border-accent/40',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{m.value}</p>
              <p
                className={cn(
                  'mt-2 inline-flex items-center gap-1 text-sm font-medium',
                  m.good ? 'text-success' : 'text-error',
                )}
              >
                {m.up ? <ArrowUp className="h-4 w-4" aria-hidden /> : <ArrowDown className="h-4 w-4" aria-hidden />}
                {m.trend}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card className="border-border p-4">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Body Composition Over Time</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BODY_CHART} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="w" tickFormatter={(v) => `Week ${v}`} tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{ value: '%', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fat"
                  name="Body fat %"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Strength Milestones</h3>
        <div className="space-y-3">
          {STRENGTH.map((row, i) => {
            const pct = Math.round(((row.current - row.start) / Math.max(row.start, 1)) * 100)
            return (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Card className="border-border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{row.name}</span>
                      {row.pr ? (
                        <Badge variant="accent" size="sm">
                          PR
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {row.start} kg → {row.current} kg
                    </p>
                    <span className="text-sm font-medium text-success">+{pct}%</span>
                  </div>
                  <ProgressBar value={Math.min(100, pct)} className="mt-3" color="accent" />
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <HeatmapGrid />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">Measurements log</h3>
          <Button variant="outline" size="sm">
            Add Measurement
          </Button>
        </div>
        <Card className="overflow-hidden border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  {['Date', 'Weight', 'Chest', 'Waist', 'Hips', 'Arms', 'Thighs'].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-foreground">
                      <button type="button" className="inline-flex items-center gap-1 hover:text-accent">
                        {h}
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEASUREMENTS.map((row, ri) => (
                  <tr key={ri} className="border-b border-border hover:bg-muted/40">
                    {row.map((cell, ci) => (
                      <td key={`${ri}-${ci}`} className="px-4 py-3 text-foreground">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
