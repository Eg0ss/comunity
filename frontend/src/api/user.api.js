import api from './axios'

export const ensureUser = (fullName) =>
  api.post('/users/ensure', { full_name: fullName }).then((r) => r.data)