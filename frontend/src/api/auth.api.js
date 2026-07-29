import api from './axios'

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data)

export const register = (fullName, username, email, password) =>
  api.post('/auth/register', { full_name: fullName, username, email, password }).then((r) => r.data)

export const getMe = () =>
  api.get('/users/me').then((r) => r.data)
