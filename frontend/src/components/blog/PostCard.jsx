import { Link } from 'react-router-dom'
import CategoryTag from './CategoryTag'
import formatDate from '../../utils/formatDate'

const PostCard = ({ id, title, slug, excerpt, author, date, created_at, category, categories, image }) => {
  const fallback =
    'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22800%22%20height=%22450%22%20viewBox=%220%200%20800%20450%22%3E%3Cdefs%3E%3ClinearGradient%20id=%22g%22%20x1=%220%22%20y1=%220%22%20x2=%221%22%20y2=%221%22%3E%3Cstop%20offset=%220%25%22%20stop-color=%22%23E8590C%22%20stop-opacity=%220.22%22/%3E%3Cstop%20offset=%22100%25%22%20stop-color=%22%231877F2%22%20stop-opacity=%220.22%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%22800%22%20height=%22450%22%20fill=%22url(%23g)%22/%3E%3Ctext%20x=%2240%22%20y=%22235%22%20font-family=%22Arial%2C%20sans-serif%22%20font-size=%2242%22%20fill=%22%231E1E1E%22%20font-weight=%22700%22%3ECommUnity%3C/text%3E%3C/svg%3E'

  const displayCategory = category || (categories && categories[0]?.name) || ''
  const authorName = typeof author === 'object' ? author?.full_name || 'Anonyme' : author
  const displayDate = date || created_at
  const postSlug = slug || id

  return (
    <Link to={`/posts/${postSlug}`}>
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
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
          <p className="text-sm text-gray-600 mb-4 flex-1">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">{authorName}</span>
            </div>
            <span>{displayDate ? formatDate(displayDate) : ''}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard
