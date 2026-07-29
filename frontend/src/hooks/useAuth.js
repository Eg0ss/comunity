// src/hooks/useAuth.js
// Évite d'écrire "useContext(AuthContext)" partout dans le code.
// Dans un composant, on fera juste : const { user, login } = useAuth();

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // Garde-fou : évite un bug silencieux si le hook est utilisé hors du Provider
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  return context;
};
