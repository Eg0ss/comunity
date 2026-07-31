// src/api/posts.api.js
import api from './axios'

export const getPosts = (params) =>
  api.get('/posts', { params }).then((r) => r.data)

export const getPost = (slug) =>
  api.get(`/posts/${slug}`).then((r) => r.data)

export const createPost = (data) =>
  api.post('/posts', data).then((r) => r.data)

export const updatePost = (id, data) =>
  api.put(`/posts/${id}`, data).then((r) => r.data)

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((r) => r.data)

export const uploadPostImage = (postId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post(`/posts/${postId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}