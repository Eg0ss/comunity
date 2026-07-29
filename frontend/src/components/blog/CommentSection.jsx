import { useState, useEffect, useCallback } from 'react'
import { getComments, createComment } from '../../api/comments.api'
import { ensureUser } from '../../api/user.api'
import { getStoredUser, setStoredUser } from '../../utils/user'
import CommentItem from './CommentItem'
import BaseButton from '../ui/BaseButton'
import toast from 'react-hot-toast'
import { FiMessageSquare } from 'react-icons/fi'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [userName, setUserName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const storedUser = getStoredUser()

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(postId)
      setComments(data)
    } catch {
      toast.error('Erreur lors du chargement des commentaires')
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    let user = storedUser
    if (!user) {
      if (!userName.trim()) {
        toast.error('Veuillez entrer votre nom')
        return
      }
      try {
        const data = await ensureUser(userName.trim())
        user = data.user
        setStoredUser(user)
      } catch {
        toast.error("Erreur lors de l'identification")
        return
      }
    }

    setSubmitting(true)
    try {
      await createComment(postId, { user_id: user.id, content })
      setContent('')
      toast.success('Commentaire ajouté')
      loadComments()
    } catch {
      toast.error("Erreur lors de l'ajout du commentaire")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-neutral-text mb-6 flex items-center gap-2">
        <FiMessageSquare className="w-5 h-5" />
        Commentaires ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-8">
        {!storedUser && (
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-4 py-2.5 mb-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            required
          />
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
          rows={3}
          required
        />
        <div className="flex justify-end mt-3">
          <BaseButton variant="primary" type="submit" disabled={submitting}>
            {submitting ? '...' : 'Publier'}
          </BaseButton>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Chargement...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier !
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onRefresh={loadComments}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection