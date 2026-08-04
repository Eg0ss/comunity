// src/api/uploads.api.js
// Upload générique (pas lié à un post précis) pour les images insérées
// DANS le contenu par l'éditeur Tiptap — cf. backend POST /uploads/image.

import api from './axios'

export const uploadEditorImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}