// src/components/blog/RichTextEditor.jsx
// Éditeur de texte enrichi basé sur Tiptap. Remplace le <textarea> brut :
// produit du HTML (titres, gras, italique, listes, liens, images) au lieu
// de texte brut.
//
// Composant CONTRÔLÉ, comme un input classique : reçoit "value" (le HTML
// actuel) et appelle "onChange(html)" à chaque modification. L'état réel
// (title, content...) reste dans CreatePostModal — ce composant ne fait
// qu'afficher/éditer.

import { useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import toast from 'react-hot-toast'
import { uploadEditorImage } from '../../api/uploads.api'
import {
  FiBold, FiItalic, FiUnderline, FiLink, FiImage, FiCode,
  FiList, FiRotateCcw, FiRotateCw,
} from 'react-icons/fi'

// Un seul bouton de la barre d'outils : évite de répéter 15 fois le même style
const ToolbarButton = ({ onClick, active, disabled, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`p-2 rounded-md text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed
      ${active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
)

const RichTextEditor = ({ value, onChange, placeholder = 'Écrivez votre article...' }) => {
  const fileInputRef = useRef(null)

  const editor = useEditor({
    // StarterKit inclut déjà Bold, Italic, Underline, Link, listes, titres,
    // citation, code, undo/redo... Pas besoin de les ajouter un par un.
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: 'tiptap-content is-editor' },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Si "value" change DEPUIS L'EXTÉRIEUR (CreatePostModal charge un post
  // existant pour le modifier, ou réinitialise à '' à l'ouverture), on
  // met à jour l'éditeur. La comparaison avec getHTML() évite une boucle
  // infinie : sans elle, onUpdate déclencherait onChange -> re-render ->
  // ce useEffect -> setContent -> onUpdate -> ...
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL du lien :', previousUrl || 'https://')
    if (url === null) return // annulé
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleImageButtonClick = () => fileInputRef.current?.click()

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de re-sélectionner le même fichier plus tard
    if (!file || !editor) return
    try {
      const { url } = await uploadEditorImage(file)
      // Le backend renvoie une URL relative ("/static/..."), on la préfixe
      // par l'origine de l'API pour que l'image s'affiche tout de suite.
      const fullUrl = `${import.meta.env.VITE_API_URL}${url}`
      editor.chain().focus().setImage({ src: fullUrl }).run()
    } catch {
      toast.error("Erreur lors de l'envoi de l'image")
    }
  }

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-1.5">
        <ToolbarButton label="Gras" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FiBold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italique" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FiItalic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Souligné" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FiUnderline size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton label="Titre 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <span className="text-xs font-bold">H1</span>
        </ToolbarButton>
        <ToolbarButton label="Titre 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton label="Titre 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton label="Liste à puces" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FiList size={16} />
        </ToolbarButton>
        <ToolbarButton label="Citation" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <span className="text-base leading-none">”</span>
        </ToolbarButton>
        <ToolbarButton label="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <FiCode size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton label="Lien" active={editor.isActive('link')} onClick={setLink}>
          <FiLink size={16} />
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={handleImageButtonClick}>
          <FiImage size={16} />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />

        <span className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton label="Annuler" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <FiRotateCcw size={16} />
        </ToolbarButton>
        <ToolbarButton label="Rétablir" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <FiRotateCw size={16} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor