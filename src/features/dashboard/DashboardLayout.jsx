import {
  Apple,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Users,
  Bell,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/shared/Avatar'
import { Logo } from '@/components/shared/Logo'
import { useTheme } from '@/hooks/useTheme'
import { useAppearanceStore } from '@/store/appearanceStore'
import { useAuthStore } from '@/store/authStore'
import { cn, glass } from '@/lib/utils'

const nav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/dashboard/nutrition', label: 'Nutrition', icon: Apple },
  { to: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  { to: '/dashboard/community', label: 'Community', icon: Users },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

/** Full nav on mobile so Settings stays reachable without the sidebar */
const bottomNav = nav

function SidebarLink({ item, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
          collapsed && 'justify-center px-0',
          isActive
            ? cn(glass.active, 'text-accent')
            : 'text-muted-foreground hover:bg-white/30 hover:text-foreground dark:hover:bg-white/10',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
    </NavLink>
  )
}

SidebarLink.propTypes = {
  item: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
}

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/workouts': 'Workouts',
  '/dashboard/nutrition': 'Nutrition',
  '/dashboard/progress': 'Progress',
  '/dashboard/community': 'Community',
  '/dashboard/settings': 'Settings',
}

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard'
  const { isDark, toggleTheme } = useTheme()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    if (useAppearanceStore.getState().sidebarCollapsedDefault) setCollapsed(true)
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const onPointerDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  useEffect(() => {
    setUserMenuOpen(false)
  }, [location.pathname])

  return (
    <motion.div className="flex min-h-screen min-w-0 text-foreground">
      <motion.aside
        layout
        className={cn('relative z-20 hidden shrink-0 border-r md:flex md:flex-col', glass.sidebar)}
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Logo to="/dashboard" showText={!collapsed} size="sm" textClassName="text-base" />
          {collapsed ? <span className="sr-only">FitTrack</span> : null}
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Dashboard">
          {nav.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-muted-foreground hover:bg-muted"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed ? 'Collapse' : null}
          </button>
        </div>
        <div className="flex items-center gap-2 border-t border-border p-3">
          <Avatar
            name={user?.displayName || user?.fullName || 'User'}
            src={user?.avatar?.url || user?.avatarPreview}
            size="sm"
          />
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.displayName || user?.fullName || 'Member'}</p>
              <span className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                Pro
              </span>
            </div>
          ) : null}
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-0">
        <header className={cn('sticky top-0 z-10 flex min-w-0 flex-wrap items-center gap-4 border-b px-4 py-3 md:px-6', glass.nav)}>
          <h1 className="min-w-0 shrink text-lg font-semibold text-foreground md:text-xl">{pageTitle}</h1>
          <div className="relative ml-auto hidden min-w-0 max-w-xs flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search"
              readOnly
              aria-label="Search (decorative)"
              className={cn('h-10 w-full rounded-lg py-2 pl-10 pr-3 text-sm', glass.input)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Notifications, 3 unread"
            >
              <Bell className="h-5 w-5" aria-hidden />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
            </button>
            <motion.button
              type="button"
              whileTap={{ rotate: 20 }}
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label="User menu"
                className="flex rounded-full border border-border p-0.5 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <Avatar
                  name={user?.displayName || user?.fullName || 'User'}
                  src={user?.avatar?.url || user?.avatarPreview}
                  size="sm"
                />
              </button>
              {userMenuOpen ? (
                <div
                  className={cn('absolute right-0 z-50 mt-2 w-48 rounded-lg py-1 text-sm shadow-xl', glass.panel)}
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      setUserMenuOpen(false)
                      navigate('/dashboard/settings')
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      setUserMenuOpen(false)
                      navigate('/dashboard/settings')
                    }}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full px-3 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      setUserMenuOpen(false)
                      logout()
                      navigate('/')
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" aria-hidden />
                      Log Out
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <nav
        className={cn('fixed bottom-0 left-0 right-0 z-30 flex w-full min-w-0 max-w-full overflow-x-hidden border-t px-1 py-2 sm:px-2 md:hidden', glass.nav)}
        aria-label="Mobile navigation"
      >
        {bottomNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 text-[10px] font-medium leading-tight sm:text-xs',
                  isActive ? 'text-accent' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </motion.div>
  )
}
