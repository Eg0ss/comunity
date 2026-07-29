// src/routes/PublicRoute.jsx
// Enveloppe une page réservée aux visiteurs NON connectés (login, register).
// Si déjà connecté -> redirection vers la page d'accueil "membre" (/feed par ex).

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Chargement...
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
