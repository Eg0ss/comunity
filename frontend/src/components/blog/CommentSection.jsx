import { useState, useEffect, useCallback } from 'react'
import { getComments, createComment } from '../../api/comments.api'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import CommentItem from './CommentItem'
import BaseButton from '../ui/BaseButton'
import toast from 'react-hot-toast'
import { FiMessageSquare } from 'react-icons/fi'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

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
    if (!user) {
      navigate('/login')
      return
    }
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await createComment(postId, { content })
      setContent('')
      toast.success('Commentaire ajouté')
      loadComments()
    } catch (err) {
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

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
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
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-600">
            <button
              onClick={() => navigate('/login')}
              className="text-secondary hover:underline font-medium"
            >
              Connectez-vous
            </button>{' '}
            pour laisser un commentaire
          </p>
        </div>
      )}

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
