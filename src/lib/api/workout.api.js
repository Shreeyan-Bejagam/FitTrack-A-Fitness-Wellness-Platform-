import { api } from '@/lib/axios'

export const workoutApi = {
  createWorkout: (data) => api.post('/workouts', data),
  getMyWorkouts: (params) => api.get('/workouts', { params }),
  getWorkoutById: (id) => api.get(`/workouts/${id}`),
  updateWorkout: (id, data) => api.patch(`/workouts/${id}`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  toggleExercise: (workoutId, exerciseId, completed) =>
    api.patch(`/workouts/${workoutId}/exercises/${exerciseId}/toggle`, { completed }),
  getTemplates: () => api.get('/workouts/templates'),
  duplicateWorkout: (id) => api.post(`/workouts/${id}/duplicate`),
  getWeeklyStats: () => api.get('/workouts/stats/weekly'),
}
