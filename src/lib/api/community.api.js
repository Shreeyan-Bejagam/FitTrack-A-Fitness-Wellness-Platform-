import { api } from '@/lib/axios'

export const communityApi = {
  getFeed: (page, limit) => api.get('/community', { params: { page, limit } }),
  createPost: (data) => api.post('/community', data),
  deletePost: (id) => api.delete(`/community/${id}`),
  toggleLike: (id) => api.post(`/community/${id}/like`),
  addComment: (postId, content) => api.post(`/community/${postId}/comments`, { content }),
  deleteComment: (postId, commentId) => api.delete(`/community/${postId}/comments/${commentId}`),
  getLeaderboard: (period) => api.get('/community/leaderboard', { params: { period } }),
  searchPosts: (q) => api.get('/community/search', { params: { q } }),
}
