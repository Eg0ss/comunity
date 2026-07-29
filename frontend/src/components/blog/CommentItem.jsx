import { useState } from 'react'
import { createComment, deleteComment } from '../../api/comments.api'
import { ensureUser } from '../../api/user.api'
import { getStoredUser, setStoredUser } from '../../utils/user'
import BaseButton from '../ui/BaseButton'
import toast from 'react-hot-toast'
import { FiTrash2, FiCornerUpRight } from 'react-icons/fi'

const CommentItem = ({ comment, postId, onRefresh }) => {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replying, setReplying] = useState(false)

  const storedUser = getStoredUser()

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    let user = storedUser
    if (!user) {
      const name = window.prompt('Votre nom :')
      if (!name || !name.trim()) return
      try {
        const data = await ensureUser(name.trim())
        user = data.user
        setStoredUser(user)
      } catch {
        toast.error("Erreur lors de l'identification")
        return
      }
    }

    setReplying(true)
    try {
      await createComment(postId, {
        user_id: user.id,
        content: replyContent,
        parent_comment_id: comment.id,
      })
      setReplyContent('')
      setShowReply(false)
      toast.success('Réponse ajoutée')
      onRefresh?.()
    } catch {
      toast.error("Erreur lors de l'ajout de la réponse")
    } finally {
      setReplying(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce commentaire ?')) return
    try {
      await deleteComment(comment.id)
      toast.success('Commentaire supprimé')
      onRefresh?.()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  const authorInitial = comment.author?.full_name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="pl-4 border-l-2 border-gray-200">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
          {authorInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-neutral-text">
              {comment.author?.full_name || 'Anonyme'}
            </span>
            <span className="text-xs text-gray-400">
              {comment.created_at
                ? new Date(comment.created_at).toLocaleDateString('fr-FR')
                : ''}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-secondary transition-colors"
            >
              <FiCornerUpRight className="w-3 h-3" />
              Répondre
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiTrash2 className="w-3 h-3" />
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {showReply && (
        <form onSubmit={handleReply} className="ml-10 mb-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrire une réponse..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
            rows={2}
            required
          />
          <div className="flex gap-2 mt-2">
            <BaseButton variant="primary" type="submit" disabled={replying}>
              {replying ? '...' : 'Répondre'}
            </BaseButton>
            <button
              type="button"
              onClick={() => { setShowReply(false); setReplyContent('') }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-4 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem