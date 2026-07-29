// src/routes/PublicRoute.jsx
// Enveloppe une page réservée aux visiteurs NON connectés (login, register).
// Si déjà connecté -> redirection vers la page d'accueil "membre" (/feed par ex).

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;