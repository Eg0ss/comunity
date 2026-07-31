// src/components/blog/PostCard.jsx — remplacement complet
import CategoryTag from './CategoryTag.jsx'
import formatDate from '../../utils/formatDate.js'
import { FiHeart, FiMessageSquare } from 'react-icons/fi'

// Nouvelle interface : ce composant reçoit maintenant un objet "post" complet
// (plus des props éparpillées) + "onOpen", la fonction fournie par la page
// parente pour ouvrir PostModal au clic.
const PostCard = ({ post, onOpen }) => {
  const { title, excerpt, author, created_at, categories, cover_image, likes_count, comments_count } = post

  const fallback =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3C/svg%3E'

  const authorName = author?.full_name || 'Auteur inconnu'
  const displayCategory = categories?.[0]?.name || ''

  // Le backend renvoie une URL relative ("/static/..."), il faut la préfixer
  // par l'origine de l'API pour obtenir une image chargeable dans le navigateur.
  const imageUrl = cover_image
    ? cover_image.startsWith('http')
      ? cover_image
      : `${import.meta.env.VITE_API_URL}${cover_image}`
    : fallback

  return (
    <article
      onClick={() => onOpen(post)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            if (e?.currentTarget?.src !== fallback) e.currentTarget.src = fallback
          }}
        />
        {displayCategory && (
          <div className="absolute top-3 left-3">
            <CategoryTag category={displayCategory} />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-neutral-text mb-2 hover:text-primary transition-colors">
          {title}
        </h3>

        {/* line-clamp-2 = classe Tailwind qui tronque visuellement à 2 lignes,
            avec "..." automatique, peu importe la longueur réelle du texte */}
        <p className="text-sm text-gray-600 mb-1 flex-1 line-clamp-2">
          {excerpt}
        </p>

        {/* stopPropagation : évite de déclencher DEUX fois l'ouverture du modal
            (une fois via ce bouton, une fois via le clic sur la carte entière) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onOpen(post)
          }}
          className="text-xs font-semibold text-secondary hover:underline text-left mb-4 w-fit"
        >
          Lire la suite →
        </button>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{authorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FiHeart size={13} /> {likes_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare size={13} /> {comments_count ?? 0}
            </span>
            <span>{formatDate(created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard