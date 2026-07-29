import api from './axios'

export const getComments = (postId) =>
  api.get(`/posts/${postId}/comments`).then((r) => r.data)

export const createComment = (postId, data) =>
  api.post(`/posts/${postId}/comments`, data).then((r) => r.data)

export const updateComment = (commentId, data) =>
  api.put(`/comments/${commentId}`, data).then((r) => r.data)

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`).then((r) => r.data)
