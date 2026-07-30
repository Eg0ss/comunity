// src/components/ui/nav/UserMenu.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBell, FiUser, FiHeart, FiEdit3, FiSettings, FiLogOut, FiPlusCircle } from 'react-icons/fi'

const menuItemStyle =
  'flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-text hover:bg-neutral-bg transition-colors'

// user : l'objet utilisateur connecté (pour afficher son initiale)
// onLogout : la vraie fonction logout() venue de AuthContext, transmise par Navbar
// onCreatePost : repris ici aussi, pour l'avoir en raccourci dans le menu mobile
const UserMenu = ({ user, onLogout, onCreatePost }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  // Première lettre du prénom pour l'avatar, avec un repli si jamais absent
  const initial = user?.full_name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label="Notifications" className="relative text-neutral-text hover:text-primary transition-colors">
        <FiBell size={20} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary
                     flex items-center justify-center text-white hover:opacity-90 transition-opacity font-semibold text-sm"
        >
          {initial}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            {/* Raccourci "Créer un poste" visible sur mobile, où NavLinks est caché (hidden lg:flex) */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onCreatePost?.()
              }}
              className={`${menuItemStyle} w-full text-left lg:hidden`}
            >
              <FiPlusCircle size={16} /> Créer un poste
            </button>
            <Link to="/favorites" className={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <FiHeart size={16} /> Favoris
            </Link>
            <Link to="/drafts" className={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <FiEdit3 size={16} /> Brouillons
            </Link>
            <Link to="/settings" className={menuItemStyle} onClick={() => setMenuOpen(false)}>
              <FiSettings size={16} /> Paramètres
            </Link>
            <hr className="my-1 border-gray-100" />
            {/* Le vrai bouton de déconnexion : ferme le menu ET appelle logout() */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onLogout()
              }}
              className={`${menuItemStyle} w-full text-left text-red-600`}
            >
              <FiLogOut size={16} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserMenu