// src/components/ui/nav/NavLinks.jsx
// Liens centraux de la navbar : leur contenu change selon isLoggedIn.
// "isLoggedIn" est reçu en PROP — pour l'instant fixé en dur dans Navbar.jsx.
// Il sera remplacé plus tard par la vraie valeur de useAuth(), sans toucher
// à ce fichier : c'est tout l'intérêt de séparer l'affichage de la logique.

import { Link } from 'react-router-dom'
import { FiPlusCircle, FiFileText, FiTrendingUp, FiGrid } from 'react-icons/fi'

// Classe commune à tous les liens, pour ne pas la répéter 4 fois
const linkStyle =
  'flex items-center gap-1.5 text-sm font-medium text-neutral-text hover:text-primary transition-colors whitespace-nowrap'

const NavLinks = ({ isLoggedIn }) => {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {isLoggedIn && (
        // Ces deux liens n'apparaissent QUE pour un utilisateur connecté
        <>
          <Link to="/posts/create" className={linkStyle}>
            <FiPlusCircle size={17} />
            Créer un poste
          </Link>
          <Link to="/my-posts" className={linkStyle}>
            <FiFileText size={17} />
            Mes publications
          </Link>
        </>
      )}

      {/* Ces deux liens sont communs à tout le monde, connecté ou non */}
      <Link to="/trending" className={linkStyle}>
        <FiTrendingUp size={17} />
        Tendances
      </Link>
      <Link to="/categories" className={linkStyle}>
        <FiGrid size={17} />
        Catégories
      </Link>
    </div>
  )
}

export default NavLinks