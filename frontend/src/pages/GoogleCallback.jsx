// src/pages/GoogleCallback.jsx
// Routée sur /auth/google/callback CÔTÉ FRONTEND — à ne pas confondre avec
// GOOGLE_REDIRECT_URI (qui pointe vers le BACKEND, 127.0.0.1:8000). C'est le
// backend qui redirige ICI une fois le login Google terminé, avec un token
// (succès) ou un paramètre "error" (échec) dans l'URL.

import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

const GoogleCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithGoogleToken } = useAuth()
  const hasRun = useRef(false) // évite un double-appel en React StrictMode (dev)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error || !token) {
      toast.error('La connexion avec Google a échoué')
      navigate('/login')
      return
    }

    loginWithGoogleToken(token)
      .then(() => navigate('/feed'))
      .catch(() => {
        toast.error('Impossible de finaliser la connexion')
        navigate('/login')
      })
  }, [searchParams, navigate, loginWithGoogleToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
      <p className="text-gray-500">Connexion en cours...</p>
    </div>
  )
}

export default GoogleCallback