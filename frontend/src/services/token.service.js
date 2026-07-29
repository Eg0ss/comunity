// src/services/token.service.js
// Seul fichier autorisé à toucher le localStorage.
// Tout le reste de l'app passe par ces fonctions.

const TOKEN_KEY = "community_access_token";

// Enregistre le token après un login/register réussi
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Récupère le token stocké (ou null s'il n'existe pas)
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Supprime le token (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Vérifie rapidement si un token est présent (sans vérifier sa validité)
export const hasToken = () => {
  return !!getToken();
};
