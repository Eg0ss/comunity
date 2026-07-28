// src/api/axios.js
// Configuration UNIQUE d'Axios pour toute l'application.
// Règle d'or : aucun fichier .jsx n'importe axios directement, tout passe par ici.

import axios from "axios";
import { getToken, removeToken } from "../services/token.service";

// Instance axios avec l'URL de base de l'API (définie dans .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// INTERCEPTEUR DE REQUÊTE : s'exécute AVANT chaque requête envoyée.
// Ajoute automatiquement le token JWT, sans avoir à le faire manuellement partout.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTEUR DE RÉPONSE : s'exécute quand l'API répond.
// Si le token est expiré/invalide (401), on déconnecte automatiquement l'utilisateur.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;