import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const ACCENTS = {
  default: { light: '24 95% 53%', dark: '24 95% 58%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  indigo: { light: '239 84% 56%', dark: '239 84% 65%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  teal: { light: '173 80% 36%', dark: '173 72% 48%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  orange: { light: '25 95% 48%', dark: '25 95% 55%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  rose: { light: '346 77% 50%', dark: '346 77% 58%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  violet: { light: '262 83% 52%', dark: '262 83% 62%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
  green: { light: '142 76% 36%', dark: '142 70% 45%', fgLight: '0 0% 100%', fgDark: '222.2 47% 6%' },
}

function applyAccent(key, isDark) {
  const def = ACCENTS[key] || ACCENTS.default
  const hsl = isDark ? def.dark : def.light
  const fg = isDark ? def.fgDark : def.fgLight
  document.documentElement.style.setProperty('--accent', hsl)
  document.documentElement.style.setProperty('--accent-foreground', fg)
}

export const useAppearanceStore = create(
  persist(
    (set, get) => ({
      accentKey: 'default',
      fontScale: 'default',
      sidebarCollapsedDefault: false,
      /** @param {keyof typeof ACCENTS} key */
      setAccentKey: (key) => {
        set({ accentKey: key })
        const dark = document.documentElement.classList.contains('dark')
        applyAccent(key, dark)
      },
      /** @param {'default' | 'large' | 'xlarge'} scale */
      setFontScale: (scale) => {
        set({ fontScale: scale })
        const v = scale === 'large' ? '1.0625' : scale === 'xlarge' ? '1.125' : '1'
        document.documentElement.style.setProperty('--font-scale', v)
      },
      setSidebarCollapsedDefault: (v) => set({ sidebarCollapsedDefault: v }),
      hydrateAccent: () => {
        const dark = document.documentElement.classList.contains('dark')
        applyAccent(get().accentKey, dark)
        const scale = get().fontScale
        const v = scale === 'large' ? '1.0625' : scale === 'xlarge' ? '1.125' : '1'
        document.documentElement.style.setProperty('--font-scale', v)
      },
    }),
    {
      name: 'fittrack-appearance',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        requestAnimationFrame(() => useAppearanceStore.getState().hydrateAccent())
      },
    },
  ),
)

export { ACCENTS }
