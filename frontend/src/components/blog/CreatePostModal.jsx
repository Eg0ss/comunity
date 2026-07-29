import { useState, useEffect } from 'react'
import BaseModal from '../ui/BaseModal'
import BaseInput from '../ui/BaseInput'
import BaseButton from '../ui/BaseButton'
import { createPost, updatePost } from '../../api/posts.api'
import { getCategories } from '../../api/categories.api'
import toast from 'react-hot-toast'

const CreatePostModal = ({ isOpen, onClose, onSuccess, post = null }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const isEditing = !!post

  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then(setCategories)
        .catch(() => toast.error("Erreur chargement catégories"))
        .finally(() => setLoadingCats(false))

      if (post) {
        setTitle(post.title || '')
        setContent(post.content || '')
        setSelectedCategories(post.categories?.map((c) => c.id) || [])
      } else {
        setTitle('')
        setContent('')
        setSelectedCategories([])
      }
    }
  }, [isOpen, post])

  const handleToggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Titre et contenu requis')
      return
    }
    setLoading(true)
    try {
      if (isEditing) {
        await updatePost(post.id, {
          title,
          content,
          category_ids: selectedCategories,
        })
        toast.success('Article mis à jour !')
      } else {
        await createPost({
          title,
          content,
          category_ids: selectedCategories,
        })
        toast.success('Article créé !')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier l\'article' : 'Nouvel article'}
    >
      <form onSubmit={handleSubmit}>
        <BaseInput
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'article"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre article..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
            rows={8}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégories
          </label>
          {loadingCats ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune catégorie disponible</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </button>
          <BaseButton variant="primary" type="submit" disabled={loading}>
            {loading
              ? '...'
              : isEditing
                ? 'Enregistrer'
                : 'Publier'}
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  )
}

export default CreatePostModal
