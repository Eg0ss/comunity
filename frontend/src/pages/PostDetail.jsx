import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '../api/posts.api'
import { useAuth } from '../hooks/useAuth'
import LikeButton from '../components/blog/LikeButton'
import CommentSection from '../components/blog/CommentSection'
import CategoryTag from '../components/blog/CategoryTag'
import CreatePostModal from '../components/blog/CreatePostModal'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { FiEdit2, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PostDetail = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const { user } = useAuth()

  const loadPost = () => {
    setLoading(true)
    getPost(slug)
      .then(setPost)
      .catch(() => toast.error('Article introuvable'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-bg">
        <Navbar />
        <div className="text-center py-24">
          <p className="text-gray-500">Article introuvable</p>
          <Link to="/" className="text-secondary hover:underline mt-2 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <article className="max-w-3xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-secondary mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Retour aux articles
          </Link>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 mb-4">
                {post.categories?.map((cat) => (
                  <CategoryTag key={cat.id} category={cat.name} />
                ))}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-text leading-tight">
                  {post.title}
                </h1>
                {user && user.id === post.author?.id && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    title="Modifier"
                  >
                    <FiEdit2 className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
                  {post.author?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="font-medium text-gray-700">
                  {post.author?.full_name || 'Anonyme'}
                </span>
                <span>•</span>
                <span>
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </span>
              </div>

              <div className="mt-8 prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>

              <div className="mt-8 pt-6 border-t flex items-center gap-4">
                <LikeButton
                  postId={post.id}
                  initialCount={post.likes_count || 0}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-md p-8 sm:p-10">
            <CommentSection postId={post.id} />
          </div>
        </article>
      </main>
      <Footer />

      <CreatePostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={loadPost}
        post={post}
      />
    </div>
  )
}

export default PostDetail
