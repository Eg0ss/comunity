// src/api/auth.api.js
// Contient UNIQUEMENT les appels HTTP liés à l'authentification.
// Pas de logique métier ici, juste "quelle URL, quelles données".

import api from "./axios";

// Appelle POST /users/register avec les données du formulaire d'inscription
export const registerRequest = (payload) => {
  return api.post("/users/register", payload);
};

// Appelle POST /users/login avec email + password
export const loginRequest = (payload) => {
  return api.post("/users/login", payload);
};

// Appelle GET /users/me (récupère l'utilisateur connecté grâce au token)
export const getMeRequest = () => {
  return api.get("/users/me");
};
