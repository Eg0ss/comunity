// src/components/blog/PostModal.jsx
// Vue complète d'un post, affichée par-dessus la page courante (BaseModal).
// Contient : image, contenu intégral, catégories, LikeButton, CommentSection,
// et — uniquement pour l'auteur — les actions Modifier / Supprimer.

import { useState, useEffect } from 'react'
import BaseModal from '../ui/BaseModal'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'
import CategoryTag from './CategoryTag'
import ConfirmModal from './ConfirmModal'
import CreatePostModal from './CreatePostModal'
import { getPost, deletePost } from '../../api/posts.api'
import { useAuth } from '../../hooks/useAuth'
import formatDate from '../../utils/formatDate'
import toast from 'react-hot-toast'
import { FiTrash2, FiEdit3 } from 'react-icons/fi'

const PostModal = ({ post: postPreview, isOpen, onClose, onDeleted }) => {
  const [post, setPost] = useState(postPreview)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && postPreview?.slug) {
      setPost(postPreview)
      getPost(postPreview.slug)
        .then(setPost)
        .catch(() => toast.error('Erreur lors du chargement de la publication'))
    }
  }, [isOpen, postPreview])

  if (!post) return null

  const isOwner = user && post.author && user.id === post.author.id

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(post.id)
      toast.success('Publication supprimée')
      setShowDeleteConfirm(false)
      onClose()
      onDeleted?.(post.id)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <BaseModal isOpen={isOpen && !showEditModal} onClose={onClose} title={post.title}>
        {post.cover_image && (
          <img
            src={
              post.cover_image.startsWith('http')
                ? post.cover_image
                : `${import.meta.env.VITE_API_URL}${post.cover_image}`
            }
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-5"
          />
        )}

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
              {post.author?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm font-medium text-gray-700">{post.author?.full_name}</span>
            <span className="text-xs text-gray-400">· {formatDate(post.created_at)}</span>
          </div>
          <div className="flex gap-2">
            {post.categories?.map((cat) => <CategoryTag key={cat.id} category={cat.name} />)}
          </div>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">
          {post.content}
        </p>

        <div className="flex items-center justify-between border-t border-b py-3 mb-6">
          <LikeButton postId={post.id} initialCount={post.likes_count} />

          {isOwner && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-secondary transition-colors"
              >
                <FiEdit3 size={16} /> Modifier
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
              >
                <FiTrash2 size={16} /> Supprimer
              </button>
            </div>
          )}
        </div>

        <CommentSection postId={post.id} />
      </BaseModal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Supprimer la publication ?"
        message="Cette action est définitive. La publication, ses commentaires et ses likes seront supprimés."
      />

      <CreatePostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
        onSuccess={() => {
          setShowEditModal(false)
          getPost(post.slug).then(setPost)
        }}
      />
    </>
  )
}

export default PostModal