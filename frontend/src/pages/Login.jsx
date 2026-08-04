// src/pages/Login.jsx
// Page = orchestration uniquement. Toute la logique lourde est dans useAuth()/AuthContext.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BaseInput from "../components/ui/BaseInput";
import BaseButton from "../components/ui/BaseButton";
import { useAuth } from "../hooks/useAuth";
import GoogleButton from "../components/ui/GoogleButton";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate("/feed");
    } catch (error) {
      // Le message d'erreur vient directement du backend (ex: "Email ou mot de passe incorrect")
      toast.error(error.response?.data?.detail || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          <span className="text-primary">Comm</span>
          <span className="text-secondary">Unity</span>
        </h1>
        <BaseInput
          label="Email" type="email" name="email"
          value={form.email} onChange={handleChange} required
        />
        <BaseInput
          label="Mot de passe" type="password" name="password"
          value={form.password} onChange={handleChange} required
        />
        <BaseButton type="submit" loading={loading}>Se connecter</BaseButton>
        <p className="text-center text-sm mt-4">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-secondary font-medium">S'inscrire</Link>
        </p>
        {/* <BaseButton type="submit" loading={loading}>Se connecter</BaseButton> */}

        {/* AJOUT */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <GoogleButton />
        {/* FIN AJOUT */}

        <p className="text-center text-sm mt-4"></p>
      </form>
    </div>
  );
};

export default Login;
