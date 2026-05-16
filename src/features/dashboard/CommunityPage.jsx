import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Heart,
  ImageIcon,
  MessageCircle,
  Pencil,
  Share2,
  Smile,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn } from '@/lib/utils'

const POSTS = [
  {
    id: '1',
    user: 'Alex M.',
    text: 'Just crushed a new PR on deadlift — 140kg! 🔥',
    time: '2 hours ago',
    likes: 24,
    comments: 6,
    type: 'text',
  },
  {
    id: '2',
    user: 'Sarah K.',
    text: 'Completed Week 4 of the 12-week challenge! Feeling unstoppable 💪',
    time: '5 hours ago',
    likes: 41,
    comments: 12,
    type: 'text',
  },
  {
    id: '3',
    user: 'Dev R.',
    text: '',
    time: 'Yesterday',
    likes: 18,
    comments: 0,
    type: 'workout',
    workout: { name: 'Full Body', min: 52, ex: 6, kcal: 320 },
  },
  {
    id: '4',
    user: 'Priya S.',
    text: 'Rest day done right — yoga + meditation. Recovery is part of the grind 🧘',
    time: '2 days ago',
    likes: 33,
    comments: 9,
    type: 'text',
  },
]

const CHALLENGES = [
  { emoji: '🏋️', name: '30-Day Squat Challenge', participants: 847, day: 12, total: 30, joined: true },
  { emoji: '🚶', name: '10K Steps Daily', participants: 2341, day: 5, total: 30, joined: false },
  { emoji: '🍎', name: 'No Sugar November', participants: 1204, day: 20, total: 30, joined: false },
  { emoji: String.fromCodePoint(0x1f4aa), name: 'Weekly Push-up Record', participants: 512, ends: '3 days', joined: true },
]

const LEADER_ROWS = [
  { rank: 1, name: 'Jordan Peak', workouts: 28, streak: 21, pts: 9820 },
  { rank: 2, name: 'Alex M.', workouts: 26, streak: 18, pts: 9450 },
  { rank: 3, name: 'You', workouts: 24, streak: 14, pts: 9012, me: true },
  { rank: 4, name: 'Sam Rivera', workouts: 22, streak: 12, pts: 8740 },
  { rank: 5, name: 'Chris Lee', workouts: 21, streak: 10, pts: 8620 },
  { rank: 6, name: 'Morgan Blake', workouts: 20, streak: 9, pts: 8400 },
  { rank: 7, name: 'Riley Chen', workouts: 19, streak: 8, pts: 8150 },
]

const FRIENDS = [
  { name: 'Alex M.', goal: 'Build muscle', streak: 14, online: true },
  { name: 'Sarah K.', goal: 'Fat loss', streak: 21, online: false },
  { name: 'Dev R.', goal: 'Stay active', streak: 7, online: true },
  { name: 'Priya S.', goal: 'Flexibility', streak: 30, online: false },
  { name: 'Chris Lee', goal: 'Strength', streak: 10, online: false },
  { name: 'Morgan B.', goal: 'Cardio', streak: 5, online: true },
]

export function CommunityPage() {
  const [tab, setTab] = useState('feed')
  const [likes, setLikes] = useState(() =>
    POSTS.reduce((acc, p) => ({ ...acc, [p.id]: false }), {}),
  )
  const [lbPeriod, setLbPeriod] = useState('week')

  const toggleLike = (id) => setLikes((s) => ({ ...s, [id]: !s[id] }))

  const podium = [
    LEADER_ROWS[1],
    LEADER_ROWS[0],
    LEADER_ROWS[2],
  ]

  return (
    <div className="mx-auto min-w-0 max-w-full space-y-8 md:max-w-7xl">
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Community</h2>
          <p className="text-muted-foreground">Train together, grow together</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">
            <Pencil className="h-4 w-4" aria-hidden />
            Create Post
          </Button>
          <Button variant="outline">
            <UserPlus className="h-4 w-4" aria-hidden />
            Find Friends
          </Button>
        </div>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="w-full min-w-0 max-w-full">
        <TabsList className="flex h-auto min-h-11 w-full min-w-0 flex-wrap gap-1 sm:inline-flex sm:h-11 sm:w-auto">
          <TabsTrigger
            value="feed"
            className="min-w-0 flex-1 px-2 text-xs whitespace-normal sm:flex-none sm:px-3 sm:text-sm sm:whitespace-nowrap"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="min-w-0 flex-1 px-2 text-xs whitespace-normal sm:flex-none sm:px-3 sm:text-sm sm:whitespace-nowrap"
          >
            Challenges
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="min-w-0 flex-1 px-2 text-xs whitespace-normal sm:flex-none sm:px-3 sm:text-sm sm:whitespace-nowrap"
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className="min-w-0 flex-1 px-2 text-xs whitespace-normal sm:flex-none sm:px-3 sm:text-sm sm:whitespace-nowrap"
          >
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4 lg:col-span-2">
                    <Card className="border-border p-4">
                      <div className="flex gap-3">
                        <Avatar name="You" size="md" />
                        <div className="flex-1">
                          <input
                            type="text"
                            readOnly
                            placeholder="What's your win today?"
                            className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                            aria-label="Composer (decorative)"
                          />
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex gap-2 text-muted-foreground">
                              <button type="button" className="rounded-lg p-2 hover:bg-muted" aria-label="Add image">
                                <ImageIcon className="h-4 w-4" />
                              </button>
                              <button type="button" className="rounded-lg p-2 hover:bg-muted" aria-label="Share activity">
                                <Activity className="h-4 w-4" />
                              </button>
                              <button type="button" className="rounded-lg p-2 hover:bg-muted" aria-label="Emoji">
                                <Smile className="h-4 w-4" />
                              </button>
                            </div>
                            <Button variant="primary" size="sm" disabled>
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    {POSTS.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="border-border p-4">
                          <div className="flex gap-3">
                            <Avatar name={p.user} size="md" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-foreground">{p.user}</span>
                                <span className="text-xs text-muted-foreground">{p.time}</span>
                              </div>
                              {p.type === 'workout' ? (
                                <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                                  <p className="font-medium text-foreground">{p.workout?.name}</p>
                                  <p className="text-muted-foreground">
                                    {p.workout?.min} min · {p.workout?.ex} exercises · {p.workout?.kcal} kcal
                                  </p>
                                </div>
                              ) : (
                                <p className="mt-2 text-foreground">{p.text}</p>
                              )}
                              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 hover:text-accent"
                                  onClick={() => toggleLike(p.id)}
                                  aria-label="Like"
                                >
                                  <Heart
                                    className={cn('h-4 w-4', likes[p.id] && 'fill-current text-accent')}
                                    aria-hidden
                                  />
                                  {p.likes + (likes[p.id] ? 1 : 0)}
                                </button>
                                <span className="inline-flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" aria-hidden />
                                  {p.comments}
                                </span>
                                <button type="button" className="inline-flex items-center gap-1 hover:text-accent" aria-label="Share">
                                  <Share2 className="h-4 w-4" aria-hidden />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="hidden space-y-4 lg:block">
                    <Card className="border-border p-4">
                      <h3 className="font-semibold text-foreground">Your Stats This Week</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <li>4 workouts</li>
                        <li>2,400 kcal burned</li>
                        <li>14-day streak</li>
                      </ul>
                    </Card>
                    <Card className="border-border p-4">
                      <h3 className="font-semibold text-foreground">Suggested Friends</h3>
                      {['Jamie L.', 'Taylor N.', 'Casey P.'].map((n, i) => (
                        <div key={n} className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 first:border-0 first:pt-0">
                          <div className="flex items-center gap-2">
                            <Avatar name={n} size="sm" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{n}</p>
                              <p className="text-xs text-muted-foreground">{3 + i} mutual</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </Card>
                    <Card className="border-border p-4">
                      <h3 className="font-semibold text-foreground">Active Challenges</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        <li>30-Day Squat — 18 days left</li>
                        <li>Push-up Record — ends soon</li>
                      </ul>
                    </Card>
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Challenges</h3>
                    <button type="button" className="text-sm font-medium text-accent hover:underline">
                      Browse All
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {CHALLENGES.map((c, i) => (
                      <motion.div
                        key={c.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Card className="h-full border-border p-5">
                          <div className="text-3xl">{c.emoji}</div>
                          <h4 className="mt-2 font-semibold text-foreground">{c.name}</h4>
                          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" aria-hidden />
                            {c.participants.toLocaleString()} participants
                          </p>
                          {c.day != null ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Day {c.day} of {c.total}
                            </p>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">Ends in {c.ends}</p>
                          )}
                          {c.joined ? (
                            <>
                              <Badge variant="accent" className="mt-3" size="sm">
                                Joined
                              </Badge>
                              <ProgressBar value={c.day != null ? (c.day / c.total) * 100 : 60} className="mt-3" />
                            </>
                          ) : (
                            <Button variant="outline" className="mt-4 w-full" size="sm">
                              Join
                            </Button>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {['This Week', 'This Month', 'All Time'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setLbPeriod(p === 'This Week' ? 'week' : p === 'This Month' ? 'month' : 'all')}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
                          (p === 'This Week' && lbPeriod === 'week') ||
                            (p === 'This Month' && lbPeriod === 'month') ||
                            (p === 'All Time' && lbPeriod === 'all')
                            ? 'border-accent bg-accent/15 text-accent'
                            : 'border-border bg-card text-muted-foreground',
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-end justify-center gap-2 pb-4">
                    {[
                      { row: podium[0], h: 'h-24', medal: '🥈' },
                      { row: podium[1], h: 'h-32', medal: '🥇' },
                      { row: podium[2], h: 'h-20', medal: '🥉' },
                    ].map((p) => (
                      <div key={p.row.name} className={cn('flex w-28 flex-col items-center', p.h === 'h-32' && '-mt-2')}>
                        <div className="text-2xl">{p.medal}</div>
                        <Avatar name={p.row.name} size="lg" className="mt-2" />
                        <p className="mt-2 text-center text-xs font-medium text-foreground">{p.row.name}</p>
                        <p className="text-xs text-muted-foreground">{p.row.pts} pts</p>
                        <div className={cn('mt-2 w-full rounded-t-lg bg-muted', p.h)} />
                      </div>
                    ))}
                  </div>
                  <Card className="overflow-hidden border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">#</th>
                          <th className="px-4 py-3">Athlete</th>
                          <th className="px-4 py-3">Workouts</th>
                          <th className="px-4 py-3">Streak</th>
                          <th className="px-4 py-3">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LEADER_ROWS.map((row) => (
                          <tr
                            key={row.rank}
                            className={cn(
                              'border-b border-border hover:bg-muted/40',
                              row.me && 'bg-accent/10',
                            )}
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1">
                                {row.rank <= 3 ? <Trophy className="h-4 w-4 text-yellow-600" aria-hidden /> : null}
                                {row.rank}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar name={row.name} size="sm" />
                                {row.name}
                              </div>
                            </td>
                            <td className="px-4 py-3">{row.workouts}</td>
                            <td className="px-4 py-3">{row.streak}</td>
                            <td className="px-4 py-3 font-medium">{row.pts.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-8">
                  <input
                    type="search"
                    placeholder="Search friends..."
                    readOnly
                    className="h-11 w-full max-w-md rounded-lg border border-border bg-background px-3 text-sm"
                    aria-label="Search friends (decorative)"
                  />
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">My Friends</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {FRIENDS.map((f, i) => (
                        <motion.div
                          key={f.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Card className="border-border p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar name={f.name} size="md" />
                                {f.online ? (
                                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                                ) : null}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{f.name}</p>
                                <Badge variant="default" size="sm">
                                  {f.goal}
                                </Badge>
                                <p className="mt-1 text-xs text-muted-foreground">{f.streak} day streak</p>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                Message
                              </Button>
                              <Button variant="secondary" size="sm" className="flex-1">
                                View Profile
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Friend Requests</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Riley Chen', mutual: 4 },
                        { name: 'Jordan Peak', mutual: 2 },
                      ].map((r) => (
                        <Card key={r.name} className="flex flex-col gap-3 border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={r.name} size="md" />
                            <div>
                              <p className="font-medium text-foreground">{r.name}</p>
                              <p className="text-xs text-muted-foreground">{r.mutual} mutual friends</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm">
                              Accept
                            </Button>
                            <Button variant="outline" size="sm">
                              Decline
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
