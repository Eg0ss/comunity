import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BaseButton from './BaseButton'

const Navbar = ({ onCreatePost }) => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 64 64"
              className="w-10 h-10"
              aria-label="CommUnity"
              role="img"
            >
              <defs>
                <linearGradient id="cuGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E8590C" />
                  <stop offset="100%" stopColor="#1877F2" />
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="30" fill="none" stroke="url(#cuGrad)" strokeWidth="4" />
              <path d="M20 38c3-6 7-9 12-9s9 3 12 9" fill="none" stroke="#1877F2" strokeWidth="3" strokeLinecap="round" />
              <circle cx="32" cy="24" r="7" fill="#E8590C" />
              <circle cx="20" cy="28" r="4.5" fill="#1877F2" opacity="0.9" />
              <circle cx="44" cy="28" r="4.5" fill="#1877F2" opacity="0.9" />
            </svg>
            <div className="text-2xl font-bold">
              <span className="text-primary">Comm</span>
              <span className="text-secondary">Unity</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {onCreatePost && (
                  <button onClick={onCreatePost} className="hidden sm:block">
                    <BaseButton variant="primary">Écrire un article</BaseButton>
                  </button>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
                    {user.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="hidden sm:inline text-neutral-text font-medium">
                    {user.full_name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-primary transition-colors px-3 py-2 text-sm font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-text font-medium hover:text-secondary transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link to="/login" className="hidden sm:block">
                  <BaseButton variant="primary">Inscription</BaseButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
