// src/pages/Register.jsx
// Même logique que Login.jsx, adaptée à l'inscription.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BaseInput from "../components/ui/BaseInput";
import BaseButton from "../components/ui/BaseButton";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'inscription");
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
        <BaseInput label="Nom complet" name="full_name" value={form.full_name} onChange={handleChange} required />
        <BaseInput label="Nom d'utilisateur" name="username" value={form.username} onChange={handleChange} required />
        <BaseInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
        <BaseInput label="Mot de passe" type="password" name="password" value={form.password} onChange={handleChange} required />
        <BaseButton type="submit" loading={loading}>Créer mon compte</BaseButton>
        <p className="text-center text-sm mt-4">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-secondary font-medium">Se connecter</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;