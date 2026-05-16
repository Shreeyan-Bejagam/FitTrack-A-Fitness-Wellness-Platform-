import { api } from '@/lib/axios'

export const userApi = {
  getMyProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  uploadAvatar: (formData) =>
    api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAvatar: () => api.delete('/users/me/avatar'),
  updateNotifications: (prefs) => api.patch('/users/me/notifications', prefs),
  updateAppearance: (prefs) => api.patch('/users/me/appearance', prefs),
  getPublicProfile: (username) => api.get(`/users/${encodeURIComponent(username)}`),
  searchUsers: (q) => api.get('/users/search', { params: { q } }),
  deleteAccount: (password) => api.delete('/users/me', { data: { password } }),
}
