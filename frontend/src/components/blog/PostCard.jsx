// src/components/blog/PostCard.jsx
import CategoryTag from './CategoryTag.jsx'
import formatDate from '../../utils/formatDate.js'

const PostCard = ({ title, excerpt, author, date, category, image }) => {
  const fallback =
    'data:image/svg+xml,...' 
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
          <CategoryTag category={category} />
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
              {author.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{author}</span>
          </div>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </article>
  )
}

export default PostCard