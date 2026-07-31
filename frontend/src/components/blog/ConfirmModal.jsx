// src/components/blog/ConfirmModal.jsx
// Remplace window.confirm() (interdit par tes règles : "pas d'alerte native").
// Réutilise BaseModal existant, pour rester cohérent avec le reste de l'app.
// Générique : peut servir pour supprimer un post, un commentaire, etc.

import BaseModal from '../ui/BaseModal'
import BaseButton from '../ui/BaseButton'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Annuler
        </button>
        {/* variant="secondary" (bleu) réservé aux actions neutres ; ici on force
            un style rouge inline pour bien signaler le caractère destructeur */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </BaseModal>
  )
}

export default ConfirmModal