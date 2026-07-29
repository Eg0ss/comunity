import { createContext, useState, useCallback, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getMe } from '../api/auth.api'
import { setToken, getToken, removeToken } from '../services/token.service'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      getMe()
        .then((u) => setUser(u))
        .catch(() => removeToken())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (fullName, username, email, password) => {
    const data = await apiRegister(fullName, username, email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
