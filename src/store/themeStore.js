import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/** @param {'light' | 'dark'} theme */
function applyThemeClass(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      /** @type {'light' | 'dark' | 'system'} */
      themePreference: 'light',
      toggleTheme: () => {
        const pref = get().themePreference
        if (pref === 'system') {
          const cur = get().theme
          const next = cur === 'light' ? 'dark' : 'light'
          applyThemeClass(next)
          set({ theme: next, themePreference: next })
          return
        }
        const next = get().theme === 'light' ? 'dark' : 'light'
        applyThemeClass(next)
        set({ theme: next, themePreference: next })
      },
      /** @param {'light' | 'dark'} theme */
      setTheme: (theme) => {
        applyThemeClass(theme)
        set({ theme, themePreference: theme })
      },
      /** @param {'light' | 'dark' | 'system'} pref */
      setThemePreference: (pref) => {
        const resolved = pref === 'system' ? getSystemTheme() : pref
        applyThemeClass(resolved)
        set({ themePreference: pref, theme: resolved })
      },
      syncSystemTheme: () => {
        if (get().themePreference !== 'system') return
        const resolved = getSystemTheme()
        applyThemeClass(resolved)
        set({ theme: resolved })
      },
    }),
    {
      name: 'fittrack-theme',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ theme: s.theme, themePreference: s.themePreference }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const resolved =
          state.themePreference === 'system' ? getSystemTheme() : state.theme
        applyThemeClass(resolved === 'dark' ? 'dark' : 'light')
        state.theme = resolved
      },
    },
  ),
)

export { applyThemeClass, getSystemTheme }
