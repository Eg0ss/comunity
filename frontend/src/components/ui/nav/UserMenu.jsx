// src/components/ui/nav/UserMenu.jsx
// Bloc affiché à droite de la navbar UNIQUEMENT pour un utilisateur connecté :
// cloche de notifications + avatar avec menu déroulant.
//
// Seul état géré ici : menuOpen (le menu est-il ouvert visuellement ?).
// C'est de la logique d'AFFICHAGE, pas de la logique MÉTIER — sans elle,
// le menu déroulant ne pourrait tout simplement pas s'ouvrir/se fermer.
// Aucune vraie notification, aucune vraie déconnexion pour l'instant.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBell, FiUser, FiHeart, FiEdit3, FiSettings, FiLogOut } from 'react-icons/fi'

const menuItemStyle =
  'flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-text hover:bg-neutral-bg transition-colors'

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center gap-4">
      {/* Cloche de notifications — le petit point orange est codé en dur pour
          l'instant ; il représentera plus tard "il y a des notifications non lues" */}
      <button type="button" aria-label="Notifications" className="relative text-neutral-text hover:text-primary transition-colors">
        <FiBell size={20} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
      </button>

      {/* Avatar : icône SVG générique en attendant une vraie photo de profil */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary
                     flex items-center justify-center text-white hover:opacity-90 transition-opacity"
        >
          <FiUser size={18} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <Link to="/favorites" className={menuItemStyle}>
              <FiHeart size={16} /> Favoris
            </Link>
            <Link to="/drafts" className={menuItemStyle}>
              <FiEdit3 size={16} /> Brouillons
            </Link>
            <Link to="/settings" className={menuItemStyle}>
              <FiSettings size={16} /> Paramètres
            </Link>
            <hr className="my-1 border-gray-100" />
            <button type="button" className={`${menuItemStyle} w-full text-left text-red-600`}>
              <FiLogOut size={16} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserMenu