import { api } from '@/lib/axios'

export const progressApi = {
  logProgress: (data) => api.post('/progress', data),
  getHistory: (params) => api.get('/progress', { params }),
  getLatest: () => api.get('/progress/latest'),
  getBodyStats: (days) => api.get('/progress/body-stats', { params: { days } }),
  getStrengthProgress: () => api.get('/progress/strength'),
  deleteEntry: (id) => api.delete(`/progress/${id}`),
  uploadPhoto: (progressId, formData) =>
    api.post(`/progress/${progressId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePhoto: (progressId, photoId) => api.delete(`/progress/${progressId}/photos/${photoId}`),
}
