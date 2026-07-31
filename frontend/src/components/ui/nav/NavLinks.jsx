// src/components/ui/nav/NavLinks.jsx
import { Link } from 'react-router-dom'
import { FiPlusCircle, FiFileText, FiTrendingUp, FiGrid } from 'react-icons/fi'

const linkStyle =
  'flex items-center gap-1.5 text-sm font-medium text-neutral-text hover:text-primary transition-colors whitespace-nowrap'

// onCreatePost est une fonction (celle qui fait setShowCreateModal(true) dans
// Home.jsx/Feed.jsx). On l'appelle directement au clic, plus besoin de
// naviguer vers une route "/posts/create" qui n'existe pas.
const NavLinks = ({ isLoggedIn, onCreatePost }) => {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {isLoggedIn && (
        <>
          <button type="button" onClick={onCreatePost} className={linkStyle}>
            <FiPlusCircle size={17} />
            Créer un poste
          </button>
          <Link to="/my-posts" className={linkStyle}>
            <FiFileText size={17} />
            Mes publications
          </Link>
        </>
      )}

      <Link to="/trending" className={linkStyle}>
        <FiTrendingUp size={17} />
        Tendances
      </Link>
      <Link to="/publications" className={linkStyle}>
        <FiGrid size={17} />
        Publications
      </Link>
    </div>
  )
}

export default NavLinks