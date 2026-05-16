import { useThemeStore } from '@/store/themeStore'
import { useAppearanceStore } from '@/store/appearanceStore'
import { useEffect } from 'react'

/** Syncs HTML class, system preference, and accent colors. */
export function ThemeProvider({ children }) {
  const theme = useThemeStore((s) => s.theme)
  const themePreference = useThemeStore((s) => s.themePreference)
  const syncSystemTheme = useThemeStore((s) => s.syncSystemTheme)
  const hydrateAccent = useAppearanceStore((s) => s.hydrateAccent)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    hydrateAccent()
  }, [theme, hydrateAccent])

  useEffect(() => {
    if (themePreference !== 'system') return undefined
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => syncSystemTheme()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [themePreference, syncSystemTheme])

  return children
}
