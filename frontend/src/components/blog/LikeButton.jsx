import { useState } from 'react'
import { FiHeart } from 'react-icons/fi'
import { toggleLike } from '../../api/likes.api'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const LikeButton = ({ postId, initialCount = 0, initialLiked = false }) => {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleClick = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setLoading(true)
    try {
      const data = await toggleLike(postId)
      setLiked(data.liked)
      setCount(data.likes_count)
    } catch (err) {
      toast.error("Erreur lors du like")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        liked
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span className="font-medium">{count}</span>
    </button>
  )
}

export default LikeButton
