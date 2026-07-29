// src/App.jsx
// Point central du routage. Enveloppe l'app avec AuthProvider pour que
// useAuth() soit disponible partout, et configure les notifications globales.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toaster = le composant qui affiche réellement les notifications toast.success/error */}
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />
          <Route
            path="/register"
            element={<PublicRoute><Register /></PublicRoute>}
          />
          {/* Exemple pour plus tard : une page protégée */}
          {/* <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;