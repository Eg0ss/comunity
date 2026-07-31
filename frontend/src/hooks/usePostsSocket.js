// src/hooks/usePostsSocket.js
// Ouvre une connexion WebSocket vers le backend et appelle "onPostCreated"
// à chaque fois qu'un post est publié par N'IMPORTE QUEL utilisateur connecté
// (pas seulement soi-même) — c'est ça, le "temps réel".

import { useEffect, useRef } from 'react'

export const usePostsSocket = (onPostCreated) => {
  // useRef plutôt que useState : on n'a pas besoin de re-render quand la
  // connexion change, juste de garder une référence stable entre les rendus.
  const socketRef = useRef(null)

  useEffect(() => {
    // On dérive l'URL du WebSocket depuis VITE_API_URL : "http://" devient "ws://"
    // (et "https://" deviendrait "wss://" en production).
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
        // Message non-JSON ou inattendu : on l'ignore silencieusement,
        // pas besoin de faire planter l'app pour ça.
      }
    }

    // Nettoyage : ferme la connexion quand le composant qui utilise ce hook disparaît
    return () => socket.close()
  }, [onPostCreated])
}