// src/context/AuthContext.jsx
// Fournit à TOUTE l'application : { user, login, register, logout, loading }
// C'est l'équivalent d'un store Pinia "auth" en Vue.

import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loginRequest, registerRequest, getMeRequest } from "../api/auth.api";
import { setToken, removeToken, hasToken } from "../services/token.service";

// Crée le "conteneur" de contexte, vide au départ
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true tant qu'on vérifie la session

  // Au chargement de l'app : si un token existe, on tente de récupérer l'utilisateur
  useEffect(() => {
    const restoreSession = async () => {
      if (hasToken()) {
        try {
          const { data } = await getMeRequest();
          setUser(data);
        } catch {
          removeToken(); // token invalide/expiré → on nettoie
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials);
    setToken(data.access_token);
    setUser(data.user);
    toast.success(`Bienvenue, ${data.user.full_name} !`);
  };

  const register = async (payload) => {
    await registerRequest(payload);
    toast.success("Compte créé avec succès ! Vous pouvez vous connecter.");
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.success("Déconnexion réussie");
  };

  const loginWithGoogleToken = async (accessToken) => {
  setToken(accessToken)
  const { data } = await getMeRequest() // on n'a que le token, pas encore le profil
  setUser(data)
  toast.success(`Bienvenue, ${data.full_name} !`)
}

  return (
  <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogleToken }}>
    {children}
  </AuthContext.Provider>
);
};
