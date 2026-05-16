import { api } from '@/lib/axios'

export const nutritionApi = {
  getTodayLog: () => api.get('/nutrition/today'),
  getLogByDate: (date) => api.get(`/nutrition/${date}`),
  getLogsRange: (start, end) => api.get('/nutrition/range', { params: { start, end } }),
  addFood: (date, mealType, food) =>
    api.post(`/nutrition/${date}/meals/${mealType}/foods`, { food }),
  removeFood: (date, mealType, foodId) =>
    api.delete(`/nutrition/${date}/meals/${mealType}/foods/${foodId}`),
  updateWater: (date, waterIntake) => api.patch(`/nutrition/${date}/water`, { waterIntake }),
  getWeeklySummary: () => api.get('/nutrition/summary/weekly'),
}
