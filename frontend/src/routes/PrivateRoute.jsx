// src/routes/PrivateRoute.jsx
// Enveloppe une page qui nécessite d'être connecté.
// Si pas connecté -> redirection automatique vers /login.

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Tant qu'on vérifie la session (appel /users/me en cours), on n'affiche rien
  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;