const USER_KEY = 'community_current_user'

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}