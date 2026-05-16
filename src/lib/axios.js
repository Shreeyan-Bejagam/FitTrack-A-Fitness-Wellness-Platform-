import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/v1`

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let refreshing = false
/** @type {{ resolve: (v: unknown) => void; reject: (e: unknown) => void; config: import('axios').InternalAxiosRequestConfig }[]} */
let queue = []

function flushQueue(error) {
  const pending = [...queue]
  queue = []
  pending.forEach((p) => {
    if (error) {
      p.reject(error)
    } else {
      api(p.config).then(p.resolve).catch(p.reject)
    }
  })
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const url = originalRequest?.url || ''

    const skip =
      !originalRequest ||
      originalRequest._retry ||
      status !== 401 ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/login') ||
      url.includes('/auth/signup')

    if (skip) {
      const d = error.response?.data
      return Promise.reject({
        message: d?.message || error.message || 'Request failed',
        errors: d?.errors || null,
        status: status || 0,
      })
    }

    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, config: originalRequest })
      })
    }

    originalRequest._retry = true
    refreshing = true

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
      const newToken = data?.data?.accessToken
      if (newToken) {
        useAuthStore.getState().setAuth({
          user: useAuthStore.getState().user,
          accessToken: newToken,
        })
      }
      flushQueue(null)
      refreshing = false
      return api(originalRequest)
    } catch (e) {
      flushQueue(e)
      refreshing = false
      useAuthStore.getState().logoutLocal()
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
      const d = error.response?.data
      return Promise.reject({
        message: d?.message || 'Session expired',
        errors: d?.errors || null,
        status: 401,
      })
    }
  },
)
