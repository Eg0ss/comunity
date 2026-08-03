// src/hooks/usePostsSocket.js
// Ouvre une connexion WebSocket et se reconnecte automatiquement si elle
// se ferme de façon inattendue (ex: le double-montage de React StrictMode
// en développement, ou une coupure réseau momentanée).

import { useEffect, useRef } from 'react'

export const usePostsSocket = (onPostCreated) => {
  const socketRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const isUnmountedRef = useRef(false)

  useEffect(() => {
    isUnmountedRef.current = false

    const connect = () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const wsUrl = apiUrl.replace(/^http/, 'ws') + '/ws/posts'
      const socket = new WebSocket(wsUrl)
      socketRef.current = socket

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'post_created') {
            onPostCreated(message.post)
          }
        } catch {
          // message non-JSON, on ignore
        }
      }

      // Si la connexion se ferme (StrictMode, coupure réseau, redémarrage
      // du backend...) et que le composant est toujours monté, on retente
      // après une seconde plutôt que de rester silencieusement déconnecté.
      socket.onclose = () => {
        if (!isUnmountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(connect, 1000)
        }
      }
    }

    connect()

    return () => {
      isUnmountedRef.current = true
      clearTimeout(reconnectTimeoutRef.current)
      // readyState check : évite d'appeler close() sur un socket qui n'a
      // jamais fini de s'ouvrir, source du warning que tu as vu.
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close()
      }
    }
  }, [onPostCreated])
}