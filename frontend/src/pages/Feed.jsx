// src/pages/Feed.jsx
// La page "membre" : affichée uniquement aux utilisateurs connectés (via PrivateRoute).
// Contrairement à Home.jsx (page publique), elle personnalise l'accueil avec le nom
// et le rôle de l'utilisateur, et met en avant la création de publication.

import { useState, useEffect } from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import PostCard from '../components/blog/PostCard'
import CreatePostModal from '../components/blog/CreatePostModal'
import { getPosts } from '../api/posts.api'
import { useAuth } from '../hooks/useAuth'

const Feed = () => {
  const { user } = useAuth() // ici "user" est garanti non-null grâce à PrivateRoute
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const loadPosts = () => {
    getPosts()
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text">
      <Navbar onCreatePost={() => setShowCreateModal(true)} />

      {/* Bandeau de bienvenue personnalisé, spécifique à la vue connectée */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Bienvenue, {user.full_name}
            </h1>
            <p className="text-gray-600 mt-1">
              {/* Petit badge visuel si l'utilisateur est admin */}
              {user.role === 'admin' ? (
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full mr-2">
                  Administrateur
                </span>
              ) : null}
              Voici les dernières publications de la communauté.
            </p>
          </div>
        </div>
      </section>

      <main className="py-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune publication pour l'instant. Sois le premier à publier !
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id || post.slug} {...post} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadPosts}
      />
    </div>
  )
}

export default Feed