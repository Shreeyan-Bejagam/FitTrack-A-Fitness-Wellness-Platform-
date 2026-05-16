import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ToastProvider'
import { Avatar } from '@/components/shared/Avatar'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Input } from '@/components/shared/Input'
import { Toggle } from '@/components/shared/Toggle'
import { cn } from '@/lib/utils'
import { ACCENTS, useAppearanceStore } from '@/store/appearanceStore'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/hooks/useTheme'

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account & Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'danger', label: 'Danger Zone' },
]

const profileSchema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().max(160).optional(),
  dob: z.string(),
  gender: z.enum(['male', 'female', 'nonbinary']),
  heightCm: z.coerce.number().min(100).max(250),
  weightKg: z.coerce.number().min(30).max(200),
})

function strengthScore(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const segColors = ['bg-error', 'bg-orange-500', 'bg-yellow-500', 'bg-success']
const labels = ['Weak', 'Fair', 'Good', 'Strong']

export function SettingsPage() {
  const toast = useToast()
  const user = useAuthStore((s) => s.user) || {}
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  const [active, setActive] = useState('profile')
  const [saveLoading, setSaveLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarPreview || user?.avatar?.url || null)
  const fileRef = useRef(null)

  const { setThemePreference, themePreference } = useTheme()
  const accentKey = useAppearanceStore((s) => s.accentKey)
  const setAccentKey = useAppearanceStore((s) => s.setAccentKey)
  const fontScale = useAppearanceStore((s) => s.fontScale)
  const setFontScale = useAppearanceStore((s) => s.setFontScale)
  const sidebarCollapsedDefault = useAppearanceStore((s) => s.sidebarCollapsedDefault)
  const setSidebarCollapsedDefault = useAppearanceStore((s) => s.setSidebarCollapsedDefault)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || user.displayName || '',
      username: user.username || '',
      bio: user.bio || '',
      dob: user.dob || '1995-06-15',
      gender: user.gender || 'male',
      heightCm: user.heightCm ?? 175,
      weightKg: user.weightKg ?? 78,
    },
  })

  const { register, handleSubmit, watch, reset } = form
  const bioLen = String(watch('bio') ?? '').length
  const [pwNew, setPwNew] = useState('')

  useEffect(() => {
    reset({
      fullName: user.fullName || user.displayName || '',
      username: user.username || '',
      bio: user.bio || '',
      dob: user.dob || '1995-06-15',
      gender: user.gender || 'male',
      heightCm: user.heightCm ?? 175,
      weightKg: user.weightKg ?? 78,
    })
  }, [user, reset])

  const onSaveProfile = handleSubmit(async (data) => {
    setSaveLoading(true)
    try {
      const { userApi } = await import('@/lib/api/user.api')
      let latestUser = user
      if (fileRef.current?.files?.[0]) {
        const fd = new FormData()
        fd.append('avatar', fileRef.current.files[0])
        const { data: av } = await userApi.uploadAvatar(fd)
        latestUser = av.data.user
        setAvatarPreview(latestUser?.avatar?.url || null)
        fileRef.current.value = ''
      }
      const { data: res } = await userApi.updateProfile({
        fullName: data.fullName,
        username: data.username,
        bio: data.bio || '',
        dateOfBirth: data.dob,
        gender: data.gender,
        height: { value: data.heightCm, unit: 'cm' },
        weight: { value: data.weightKg, unit: 'kg' },
      })
      setUser(res.data.user)
      setAvatarPreview(res.data.user?.avatar?.url || null)
      toast('Profile updated!')
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Could not save profile'
      toast(msg)
    } finally {
      setSaveLoading(false)
    }
  })

  const [emailEdit, setEmailEdit] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [delText, setDelText] = useState('')

  const [emailToggles, setEmailToggles] = useState({
    a: true,
    b: true,
    c: false,
    d: true,
    e: false,
  })
  const [pushToggles, setPushToggles] = useState({
    pa: true,
    pb: true,
    pc: true,
    pd: false,
  })

  const [privacy, setPrivacy] = useState({
    vis: 'friends',
    shareWorkouts: true,
    leaderboard: true,
    data: false,
  })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <nav className="flex shrink-0 gap-2 overflow-x-auto lg:w-[200px] lg:flex-col lg:overflow-visible">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={cn(
              'whitespace-nowrap rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors duration-200 lg:border-0 lg:px-3',
              active === s.id
                ? 'border-accent bg-accent/10 text-accent lg:border-l-2 lg:border-l-accent lg:bg-transparent'
                : 'border-border bg-card text-muted-foreground hover:text-foreground lg:border-l-2 lg:border-l-transparent',
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {active === 'profile' ? (
              <Card className="border-border p-6">
                <h2 className="text-xl font-bold text-foreground">Profile</h2>
                <p className="text-sm text-muted-foreground">Update how others see you in FitTrack.</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f && f.size <= 5e6) setAvatarPreview(URL.createObjectURL(f))
                }} />
                <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
                  <Avatar name={watch('fullName')} src={avatarPreview} size="xl" className="!h-24 !w-24 !text-2xl" />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    Change Photo
                  </Button>
                </div>
                <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <Input id="sf-name" label="Full name" {...register('fullName')} />
                  <Input id="sf-user" label="Username" {...register('username')} />
                  <div>
                    <label htmlFor="sf-bio" className="text-sm font-medium">
                      Short bio
                    </label>
                    <textarea
                      id="sf-bio"
                      rows={3}
                      maxLength={160}
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      {...register('bio')}
                    />
                    <p className="text-right text-xs text-muted-foreground">{bioLen}/160</p>
                  </div>
                  <Input id="sf-dob" label="Date of birth" type="date" {...register('dob')} />
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">Gender</legend>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { v: 'male', l: 'Male' },
                        { v: 'female', l: 'Female' },
                        { v: 'nonbinary', l: 'Non-binary' },
                      ].map((g) => (
                        <label key={g.v} className="flex cursor-pointer items-center gap-2">
                          <input type="radio" value={g.v} {...register('gender')} className="accent-accent" />
                          <span className="text-sm">{g.l}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <Input id="sf-h" label="Height (cm)" type="number" {...register('heightCm', { valueAsNumber: true })} />
                  <Input id="sf-w" label="Weight (kg)" type="number" {...register('weightKg', { valueAsNumber: true })} />
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button type="button" variant="primary" loading={saveLoading} onClick={() => onSaveProfile()}>
                      Save Changes
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => reset()}>
                      Discard Changes
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}

            {active === 'account' ? (
              <Card className="space-y-8 border-border p-6">
                <h2 className="text-xl font-bold text-foreground">Account &amp; Security</h2>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">{user.email || 'user@example.com'}</span>
                    <button type="button" className="text-sm font-medium text-accent hover:underline" onClick={() => setEmailEdit(!emailEdit)}>
                      Change Email
                    </button>
                  </div>
                  {emailEdit ? (
                    <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
                      <Input id="new-email" label="New email" type="email" />
                      <Input id="email-pw" label="Confirm password" type="password" />
                      <Button variant="primary" size="sm" onClick={() => { setEmailEdit(false); toast('Verification email sent') }}>
                        Submit
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Change password</h3>
                  <div className="mt-4 space-y-3">
                    <Input id="pw-cur" label="Current password" type="password" />
                    <Input id="pw-new" label="New password" type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
                    <Input id="pw-confirm" label="Confirm new password" type="password" />
                    {pwNew ? (
                      <div>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => {
                            const sc = strengthScore(pwNew)
                            return (
                              <div
                                key={i}
                                className={cn('h-1.5 flex-1 rounded-full', i < sc ? segColors[Math.max(0, sc - 1)] : 'bg-muted')}
                              />
                            )
                          })}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Strength: {labels[Math.max(0, strengthScore(pwNew) - 1)] || '—'}</p>
                      </div>
                    ) : null}
                    <Button variant="outline" size="sm" onClick={() => toast('Password updated')}>
                      Update Password
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Connected accounts</h3>
                  <ul className="mt-3 space-y-2">
                    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <span className="text-sm font-medium">Google</span>
                      <BadgeInline connected onAction={() => toast('Disconnected Google')} />
                    </li>
                    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                      <span className="text-sm font-medium">Apple</span>
                      <BadgeInline connected={false} onAction={() => toast('Connect flow started')} />
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Two-factor authentication</h3>
                      <p className="text-sm text-muted-foreground">Add a second step to your login.</p>
                    </div>
                    <Switch checked={twoFA} onCheckedChange={setTwoFA} aria-label="Toggle 2FA" />
                  </div>
                  {twoFA ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="flex h-36 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                        QR code placeholder
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Backup codes</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs">
                          {['482910', '991023', '221884', '009321', '772210', '332198'].map((c) => (
                            <span key={c} className="rounded bg-muted px-2 py-1">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Card>
            ) : null}

            {active === 'notifications' ? (
              <Card className="space-y-6 border-border p-6">
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <div className="mt-4 space-y-4">
                    {[
                      ['Workout Reminders', 'a'],
                      ['Weekly Progress Report', 'b'],
                      ['Community Activity', 'c'],
                      ['New Challenges', 'd'],
                      ['FitTrack News & Updates', 'e'],
                    ].map(([label, key]) => (
                      <ToggleRow key={key} label={label} checked={emailToggles[key]} onChange={(v) => setEmailToggles((s) => ({ ...s, [key]: v }))} id={`em-${key}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Push</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-foreground">Daily workout reminder</span>
                      <input type="time" defaultValue="07:30" className="rounded-md border border-border bg-background px-2 py-1 text-sm" aria-label="Reminder time" />
                    </div>
                    {[
                      ['Streak alerts', 'pa'],
                      ['Friend activity', 'pb'],
                      ['Achievement unlocked', 'pc'],
                      ['Coach tips', 'pd'],
                    ].map(([label, key]) => (
                      <ToggleRow key={key} label={label} checked={pushToggles[key]} onChange={(v) => setPushToggles((s) => ({ ...s, [key]: v }))} id={`pu-${key}`} />
                    ))}
                  </div>
                </div>
                <Button variant="primary" onClick={() => toast('Notification preferences saved')}>
                  Save Notification Preferences
                </Button>
              </Card>
            ) : null}

            {active === 'appearance' ? (
              <Card className="space-y-6 border-border p-6">
                <h2 className="text-xl font-bold text-foreground">Appearance</h2>
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Theme</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { id: 'light', label: 'Light', pref: 'light' },
                      { id: 'dark', label: 'Dark', pref: 'dark' },
                      { id: 'system', label: 'System', pref: 'system' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setThemePreference(t.pref)
                        }}
                        className={cn(
                          'rounded-xl border-2 p-4 text-left transition-colors duration-200',
                          themePreference === t.pref ? 'border-accent' : 'border-border hover:border-accent/40',
                        )}
                      >
                        <div className={cnmbg(t.pref)} />
                        <p className="mt-2 text-sm font-medium text-foreground">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Accent color</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ACCENTS).map((k) => (
                      <button
                        key={k}
                        type="button"
                        aria-label={`Accent ${k}`}
                        onClick={() => setAccentKey(k)}
                        className={cn(
                          'h-10 w-10 rounded-full border-2 ring-offset-2 ring-offset-background transition-transform duration-200 hover:scale-105',
                          accentKey === k ? 'border-foreground ring-2 ring-accent' : 'border-border',
                        )}
                        style={{ background: accentSwatch(k) }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Font size</p>
                  <div className="space-y-2">
                    {[
                      { v: 'default', l: 'Default' },
                      { v: 'large', l: 'Large' },
                      { v: 'xlarge', l: 'Extra Large' },
                    ].map((o) => (
                      <label key={o.v} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="fs"
                          checked={fontScale === o.v}
                          onChange={() => setFontScale(o.v)}
                          className="accent-accent"
                        />
                        <span className="text-sm">{o.l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Toggle
                  id="side-coll"
                  label="Sidebar collapsed by default"
                  checked={sidebarCollapsedDefault}
                  onCheckedChange={setSidebarCollapsedDefault}
                />
                <Button variant="primary" onClick={() => toast('Appearance saved')}>
                  Save Appearance
                </Button>
              </Card>
            ) : null}

            {active === 'privacy' ? (
              <Card className="space-y-6 border-border p-6">
                <h2 className="text-xl font-bold text-foreground">Privacy</h2>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile visibility</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      { v: 'public', l: 'Public', d: 'Anyone can view your profile.' },
                      { v: 'friends', l: 'Friends only', d: 'Only accepted friends.' },
                      { v: 'private', l: 'Private', d: 'Hidden from discovery.' },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setPrivacy((p) => ({ ...p, vis: o.v }))}
                        className={cn(
                          'rounded-xl border-2 p-4 text-left',
                          privacy.vis === o.v ? 'border-accent bg-accent/5' : 'border-border',
                        )}
                      >
                        <p className="font-medium text-foreground">{o.l}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{o.d}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <Toggle
                  id="p-share"
                  label="Share my workouts to community feed"
                  checked={privacy.shareWorkouts}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, shareWorkouts: v }))}
                />
                <p className="-mt-2 text-xs text-muted-foreground">When off, workouts stay private.</p>
                <Toggle
                  id="p-lb"
                  label="Show me on leaderboards"
                  checked={privacy.leaderboard}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, leaderboard: v }))}
                />
                <p className="-mt-2 text-xs text-muted-foreground">Hide your rank from public boards.</p>
                <Toggle
                  id="p-data"
                  label="Allow anonymized data for product improvement"
                  checked={privacy.data}
                  onCheckedChange={(v) => setPrivacy((p) => ({ ...p, data: v }))}
                />
                <p className="-mt-2 text-xs text-muted-foreground">Helps us improve recommendations.</p>
                <Button variant="outline" onClick={() => toast('Your data export will be emailed to you')}>
                  Download my data
                </Button>
              </Card>
            ) : null}

            {active === 'danger' ? (
              <Card className="space-y-4 border-2 border-error/40 bg-error/5 p-6 dark:bg-error/10">
                <h2 className="text-xl font-bold text-error">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">These actions can limit or remove access to your account.</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-error text-error hover:bg-error/10">
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate account?</AlertDialogTitle>
                      <AlertDialogDescription>You can reactivate by signing in later. Some data may be archived.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast('Account deactivated (mock)')}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account Permanently</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>This cannot be undone</AlertDialogTitle>
                      <AlertDialogDescription>
                        Type DELETE in the box below to confirm permanent deletion of your FitTrack account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <input
                      value={delText}
                      onChange={(e) => setDelText(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="DELETE"
                      aria-label="Type DELETE to confirm"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDelText('')}>Cancel</AlertDialogCancel>
                      <button
                        type="button"
                        disabled={delText !== 'DELETE'}
                        className={cn(
                          'inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-destructive-foreground transition-colors duration-200',
                          delText === 'DELETE' ? 'bg-destructive hover:bg-destructive/90' : 'bg-destructive/50 cursor-not-allowed',
                        )}
                        onClick={() => {
                          logout()
                          toast('Account deleted (mock)')
                          window.location.href = '/'
                        }}
                      >
                        Delete forever
                      </button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Card>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ToggleRow({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function BadgeInline({ connected, onAction }) {
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">Connected</span>
      ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Not connected</span>
      )}
      <Button variant="outline" size="sm" onClick={onAction}>
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  )
}

function cnmbg(pref) {
  if (pref === 'light') return 'h-12 rounded-md bg-white shadow-inner ring-1 ring-border'
  if (pref === 'dark') return 'h-12 rounded-md bg-zinc-900 shadow-inner ring-1 ring-border'
  return 'h-12 rounded-md bg-gradient-to-r from-white to-zinc-900 shadow-inner ring-1 ring-border'
}

function accentSwatch(key) {
  const map = {
    default: 'linear-gradient(135deg, #f97316, #ea580c)',
    indigo: '#6366f1',
    teal: '#0d9488',
    orange: '#ea580c',
    rose: '#e11d48',
    violet: '#8b5cf6',
    green: '#16a34a',
  }
  return map[key] || map.default
}
