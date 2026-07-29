// src/components/blog/PostCard.jsx
import CategoryTag from './CategoryTag.jsx'
import formatDate from '../../utils/formatDate.js'

// On ajoute "categories" (pluriel) car c'est le nom renvoyé par le backend réel.
// "category" (singulier) reste géré pour les données statiques de démo.
const PostCard = ({ title, excerpt, author, date, category, categories, image }) => {
  const fallback =
    'data:image/svg+xml,...'

  // --- CORRECTIF PRINCIPAL ---
  // "author" peut être soit une chaîne (ancien format / données de test),
  // soit un objet { full_name: '...' } (format réel de l'API et des posts statiques).
  // On normalise ici pour toujours obtenir une chaîne affichable,
  // au lieu de planter sur author.charAt(0) quand author est un objet.
  const authorName =
    typeof author === 'string' ? author : author?.full_name || 'Auteur inconnu'

  // Même logique de normalisation pour la catégorie :
  // le backend renvoie un tableau "categories: [{name, slug}, ...]",
  // les données statiques renvoient une simple chaîne "category".
  // On prend la première dispo, sans planter si aucune n'existe.
  const displayCategory =
    category || (Array.isArray(categories) && categories[0]?.name) || ''

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            if (e?.currentTarget?.src !== fallback) e.currentTarget.src = fallback
          }}
        />
        <div className="absolute top-3 left-3">
          {/* On utilise la catégorie normalisée, plus la valeur brute */}
          <CategoryTag category={displayCategory} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-neutral-text mb-2 hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-1">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
              {/* authorName est toujours une string ici, donc charAt() ne plante plus */}
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{authorName}</span>
          </div>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </article>
  )
}

export default PostCard