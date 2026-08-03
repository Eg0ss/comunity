// src/pages/Publications.jsx
// Remplace le bouton "Catégories" de la navbar. Page publique listant TOUTES
// les publications, avec :
//   - filtre par catégorie (boutons)
//   - recherche texte : une requête API à chaque frappe, mais "debounced"
//     (attend une pause de 400ms avant d'interroger le backend, pour ne pas
//     spammer une requête à chaque lettre tapée)

import { useState, useEffect, useCallback } from 'react'
import { FiSearch } from 'react-icons/fi'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import PostCard from '../components/blog/PostCard'
import PostModal from '../components/blog/PostModal'
import CreatePostModal from '../components/blog/CreatePostModal'
import { getPosts } from '../api/posts.api'
import { getCategories } from '../api/categories.api'
import { useAuth } from '../hooks/useAuth'
import { useDebounce } from '../hooks/useDebounce'
import { usePostsSocket } from '../hooks/usePostsSocket'

const Publications = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activePost, setActivePost] = useState(null)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    getPosts({
      search: debouncedSearch || undefined,
      category_id: activeCategoryId || undefined,
    })
      .then((data) => setPosts(data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [debouncedSearch, activeCategoryId])

  const handlePostCreated = useCallback((newPost) => {
    setPosts((prev) => {
      const matchesSearch =
        !debouncedSearch ||
        newPost.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory =
        !activeCategoryId || newPost.categories?.some((c) => c.id === activeCategoryId)
      return matchesSearch && matchesCategory ? [newPost, ...prev] : prev
    })
  }, [debouncedSearch, activeCategoryId])
  usePostsSocket(handlePostCreated)

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId))
  }

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text">
      <Navbar onCreatePost={user ? () => setShowCreateModal(true) : null} />

      <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Toutes les publications</h1>

          <div className="relative max-w-md mb-5">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un titre ou un contenu..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryId(null)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                activeCategoryId === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
              }`}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  activeCategoryId === cat.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="py-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune publication ne correspond à ta recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id || post.slug} post={post} onOpen={setActivePost} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <PostModal
        post={activePost}
        isOpen={!!activePost}
        onClose={() => setActivePost(null)}
        onDeleted={handlePostDeleted}
      />

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {}}
      />
    </div>
  )
}

export default Publications