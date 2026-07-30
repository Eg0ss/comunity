// src/components/ui/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import BaseButton from './BaseButton.jsx'
import NavLinks from './nav/NavLinks.jsx'
import SearchBar from './nav/SearchBar.jsx'
import UserMenu from './nav/UserMenu.jsx'
import { useAuth } from '../../hooks/useAuth'

// onCreatePost est optionnel : Home.jsx et Feed.jsx le fournissent,
// mais Login.jsx/Register.jsx (qui n'affichent pas la Navbar) n'ont pas à s'en soucier.
const Navbar = ({ onCreatePost }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth() // <-- remplace "const isLoggedIn = true"

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="40" height="40" viewBox="0 0 64 64" className="w-10 h-10" aria-label="CommUnity" role="img">
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
            <div className="text-2xl font-bold hidden sm:block">
              <span className="text-primary">Comm</span>
              <span className="text-secondary">Unity</span>
            </div>
          </Link>

          {/* isLoggedIn = !!user : true si un utilisateur est chargé, false sinon */}
          {/* onCreatePost transmis à NavLinks pour le lien "Créer un poste" */}
          <NavLinks isLoggedIn={!!user} onCreatePost={onCreatePost} />

          <SearchBar />

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <UserMenu user={user} onLogout={logout} onCreatePost={onCreatePost} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-text font-medium hover:text-secondary transition-colors px-3 py-2 text-sm"
                >
                  Connexion
                </Link>
                <div className="hidden sm:block">
                  <BaseButton variant="primary" onClick={() => navigate('/register')}>
                    Inscription
                  </BaseButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar