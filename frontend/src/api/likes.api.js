import api from './axios'

export const toggleLike = (postId, data) =>
  api.post(`/posts/${postId}/like`, data).then((r) => r.data)
