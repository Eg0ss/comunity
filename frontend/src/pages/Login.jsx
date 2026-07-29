import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import BaseInput from '../components/ui/BaseInput'
import BaseButton from '../components/ui/BaseButton'
import toast from 'react-hot-toast'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        await register(fullName, username, email, password)
        toast.success('Inscription réussie !')
      } else {
        await login(email, password)
        toast.success('Connexion réussie !')
      }
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Une erreur est survenue'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-primary">Comm</span>
            <span className="text-secondary">Unity</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-neutral-text">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRegister
              ? 'Rejoignez la communauté'
              : 'Content de vous revoir !'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <BaseInput
                label="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom"
                required
              />
              <BaseInput
                label="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                required
              />
            </>
          )}
          <BaseInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
          />
          <BaseInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <BaseButton variant="primary" type="submit" disabled={loading}>
            {loading
              ? 'Chargement...'
              : isRegister
                ? "S'inscrire"
                : 'Se connecter'}
          </BaseButton>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isRegister ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-secondary hover:underline font-medium"
          >
            {isRegister ? 'Connectez-vous' : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
