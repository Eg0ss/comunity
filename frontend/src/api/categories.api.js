import api from './axios'

export const getCategories = () =>
  api.get('/categories').then((r) => r.data)
