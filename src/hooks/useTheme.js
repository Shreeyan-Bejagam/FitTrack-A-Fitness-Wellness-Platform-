import { useThemeStore } from '@/store/themeStore'

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const themePreference = useThemeStore((s) => s.themePreference)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const setThemePreference = useThemeStore((s) => s.setThemePreference)
  const isDark = theme === 'dark'
  return { theme, themePreference, isDark, toggleTheme, setTheme, setThemePreference }
}
