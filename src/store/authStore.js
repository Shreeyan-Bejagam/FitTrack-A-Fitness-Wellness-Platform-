import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/**
 * Map API user to fields the existing UI expects (displayName, avatarPreview, flat height/weight).
 * @param {Record<string, unknown> | null | undefined} u
 */
export function mapUserFromApi(u) {
  if (!u) return null
  const height = u.height && typeof u.height === 'object' ? u.height : null
  const weight = u.weight && typeof u.weight === 'object' ? u.weight : null
  const avatar = u.avatar && typeof u.avatar === 'object' ? u.avatar : null
  let heightCm = 175
  let heightFt = 5
  let heightIn = 8
  if (height?.unit === 'cm' && height.value != null) {
    heightCm = height.value
  } else if (height?.unit === 'ft' && height.value != null) {
    const totalIn = Math.round(height.value * 12)
    heightFt = Math.floor(totalIn / 12)
    heightIn = totalIn % 12
  }
  let weightKg = 78
  if (weight?.unit === 'kg' && weight.value != null) weightKg = weight.value
  if (weight?.unit === 'lbs' && weight.value != null) weightKg = Math.round(weight.value / 2.205)

  let dob = ''
  if (u.dateOfBirth) {
    const d = new Date(u.dateOfBirth)
    if (!Number.isNaN(d.getTime())) dob = d.toISOString().slice(0, 10)
  }

  return {
    ...u,
    displayName: u.fullName || u.username,
    avatarPreview: avatar?.url || null,
    email: u.email,
    dob,
    heightCm,
    heightFt,
    heightIn,
    heightUnit: height?.unit === 'ft' ? 'ft' : 'cm',
    weightKg,
    weightUnit: weight?.unit === 'lbs' ? 'lbs' : 'kg',
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: ({ user, accessToken }) =>
        set({
          user: mapUserFromApi(user),
          accessToken,
          isAuthenticated: Boolean(accessToken && user),
        }),

      setUser: (user) => set({ user: mapUserFromApi(user) }),

      logoutLocal: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      logout: async () => {
        try {
          const { api } = await import('@/lib/axios')
          await api.post('/auth/logout')
        } catch {
          /* still clear client */
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        })
      },

      /** Bootstrap session (refresh cookie + /me). Call once on app load. */
      initAuth: async () => {
        set({ isLoading: true })
        const { accessToken: stored, user: storedUser } = get()
        try {
          const { authApi } = await import('@/lib/api/auth.api')
          if (stored && storedUser) {
            try {
              const { data } = await authApi.getMe()
              set({
                user: mapUserFromApi(data?.data?.user),
                accessToken: stored,
                isAuthenticated: true,
              })
              return
            } catch {
              /* token may be expired — try refresh below */
            }
          }
          const { data } = await authApi.refreshToken()
          const token = data?.data?.accessToken
          if (!token) throw new Error('no session')
          set({ accessToken: token })
          const { data: me } = await authApi.getMe()
          set({
            user: mapUserFromApi(me?.data?.user),
            accessToken: token,
            isAuthenticated: true,
          })
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false })
        } finally {
          set({ isLoading: false })
        }
      },

      updateProfile: (patch) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...patch } : null,
        })),
    }),
    {
      name: 'fittrack-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        accessToken: s.accessToken,
        user: s.user,
      }),
    },
  ),
)
