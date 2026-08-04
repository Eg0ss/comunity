# Intégration d'un éditeur de texte riche (Tiptap) — CommUnity

Ce document résume **tout** ce qui a été mis en place pour remplacer un simple
`<textarea>` par un éditeur de texte riche (gras, titres, listes, liens,
images insérées dans le texte...), en React + FastAPI. Il est pensé pour être
réimplémenté ailleurs sans aide extérieure : chaque fichier est donné en
entier, avec son rôle et sa place exacte dans l'arborescence.

## 1. Vue d'ensemble

```
Utilisateur tape dans l'éditeur (Tiptap, frontend)
        │  produit du HTML : "<h2>Titre</h2><p>Texte <strong>gras</strong></p>"
        ▼
CreatePostModal envoie ce HTML tel quel à l'API (POST /posts)
        ▼
Backend : sanitize_post_content() nettoie le HTML (sécurité XSS)
        ▼
Stocké en base tel quel (colonne "content", type Text)
        ▼
Renvoyé au frontend et affiché avec dangerouslySetInnerHTML
        (sûr uniquement parce qu'il a déjà été nettoyé côté backend)
```

Deux flux d'upload d'image distincts, qui partagent la même logique de
sauvegarde disque :
- **Image de couverture** d'un post → `POST /posts/{id}/image`
- **Image insérée dans le texte** par l'éditeur → `POST /uploads/image`
  (indépendante d'un post précis, car on peut insérer une image avant même
  d'avoir enregistré l'article)

## 2. Dépendances à installer

⚠️ **Piège important** : Tiptap est passé en version 3 récemment, ce qui
change deux choses par rapport à des tutoriels plus anciens :

- `StarterKit` inclut **déjà** `Link` et `Underline` — les importer en plus
  séparément fait planter l'éditeur (`Tiptap does not allow two extensions
  with the same name property`).
- `@tiptap/extension-placeholder` n'existe plus en paquet séparé — il a été
  fusionné dans `@tiptap/extensions`, qui regroupe plusieurs extensions
  utilitaires (Placeholder, Focus, History, Dropcursor, Gapcursor...).

```bash
cd frontend
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extensions

cd ../backend
pip install bleach          # nettoyage du HTML côté serveur
pip freeze > requirements.txt
```

## 3. Backend

### 3.1 Service partagé d'upload d'image

📄 `backend/app/services/image_upload_service.py`

Logique de sauvegarde de fichier **partagée** entre l'image de couverture
d'un post et les images insérées dans le texte — évite de dupliquer deux fois
la même validation/écriture disque.

```python
import os
import uuid
from fastapi import UploadFile

MAX_FILE_SIZE_MB = 8

EXTENSION_BY_CONTENT_TYPE = {
    "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
    "image/gif": ".gif", "image/bmp": ".bmp", "image/svg+xml": ".svg",
    "image/avif": ".avif", "image/heic": ".heic", "image/heif": ".heif",
    "image/tiff": ".tiff", "image/x-icon": ".ico",
}


def save_image_file(file: UploadFile, subdir: str) -> tuple[str, int]:
    """
    Sauvegarde un fichier image sur disque dans static/uploads/<subdir>/.
    Renvoie (url_publique, taille_en_kilo_octets).
    Lève ValueError si le fichier n'est pas une image valide.
    """
    content_type = (file.content_type or "").lower()
    if not content_type.startswith("image/"):
        raise ValueError("Le fichier envoyé n'est pas une image")

    original_ext = os.path.splitext(file.filename or "")[1].lower()
    ext = original_ext if original_ext else EXTENSION_BY_CONTENT_TYPE.get(content_type, ".img")

    upload_dir = os.path.join("static", "uploads", subdir)
    os.makedirs(upload_dir, exist_ok=True)  # crée le dossier s'il n'existe pas

    unique_name = f"{uuid.uuid4().hex}{ext}"
    disk_path = os.path.join(upload_dir, unique_name)

    content = file.file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValueError(f"Image trop lourde (max {MAX_FILE_SIZE_MB} Mo)")

    with open(disk_path, "wb") as f:
        f.write(content)

    public_url = f"/static/uploads/{subdir}/{unique_name}"
    size_kb = len(content) // 1024
    return public_url, size_kb
```

> ⚠️ Ce service appelle `os.makedirs(..., exist_ok=True)`, donc le dossier se
> crée tout seul au premier upload. Mais `main.py` (voir 3.7) monte le dossier
> `static/` au **démarrage** du serveur — s'il n'existe pas encore du tout
> (premier lancement, avant tout upload), l'application peut refuser de
> démarrer. Crée-le à la main une fois : `mkdir -p backend/static/uploads`.

### 3.2 Nettoyage du HTML (sécurité XSS)

📄 `backend/app/services/html_sanitizer.py`

Le frontend envoie du HTML "de confiance" (produit par l'éditeur), mais rien
n'empêche quelqu'un d'appeler l'API directement (Postman, script...) avec un
contenu du style `<script>alert(document.cookie)</script>`. Sans nettoyage,
ce script s'exécuterait dans le navigateur de **chaque** personne qui lit ce
post ("XSS stocké").

```python
import bleach

ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "s",
    "h1", "h2", "h3",
    "ul", "ol", "li",
    "blockquote",
    "a", "img",
    "code", "pre",
]

ALLOWED_ATTRIBUTES = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title", "width", "height"],
}

ALLOWED_PROTOCOLS = ["http", "https"]


def sanitize_post_content(html: str) -> str:
    if not html:
        return html
    return bleach.clean(
        html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS, strip=True,
    )


def html_to_plain_text(html: str) -> str:
    """Convertit du HTML en texte brut lisible, pour construire un extrait
    (excerpt) propre. Insère un espace entre les blocs pour éviter que
    "<h2>Titre</h2><p>Texte</p>" devienne "TitreTexte" collé sans espace."""
    import re
    if not html:
        return ""
    spaced = re.sub(r"</(p|h1|h2|h3|li|blockquote|div|br)>", " ", html, flags=re.IGNORECASE)
    plain = bleach.clean(spaced, tags=[], attributes={}, strip=True)
    return re.sub(r"\s+", " ", plain).strip()
```

**Règle d'or** : `sanitize_post_content()` s'applique à la création ET à la
modification d'un post (voir 3.5) — jamais de HTML non nettoyé stocké en base.

### 3.3 Upload d'image générique (éditeur)

📄 `backend/app/controllers/upload/upload_controller.py`

Indépendant d'un post précis — utilisé pour insérer une image DANS le
contenu, y compris pendant la rédaction d'un nouvel article (qui n'a pas
encore d'id en base).

```python
from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi import status
from app.middlewares.auth_middleware import require_auth
from app.services.image_upload_service import save_image_file

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/image")
def upload_editor_image(request: Request, file: UploadFile = File(...)):
    require_auth(request)
    try:
        public_url, _size_kb = save_image_file(file, subdir="editor")
        return {"url": public_url}
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)
```

### 3.4 Upload d'image de couverture (post existant)

📄 `backend/app/actions/post/upload_post_image_action.py`

```python
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.post_file import PostFile
from app.services.image_upload_service import save_image_file


class UploadPostImageAction:
    def execute(self, db: Session, post: Post, file: UploadFile) -> dict:
        public_url, size_kb = save_image_file(file, subdir="posts")

        post_file = PostFile(
            post_id=post.id,
            file_url=public_url,
            file_type="image",
            original_name=file.filename,
            size_kb=size_kb,
        )
        db.add(post_file)
        db.commit()
        return {"file_url": public_url}
```

### 3.5 Création / modification d'un post

Les deux actions passent le contenu par `sanitize_post_content()` avant de
l'enregistrer.

📄 `backend/app/actions/post/create_post_action.py`

```python
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.category import Category
from app.requests.post.create_post_request import CreatePostRequest
from app.resources.post.post_resource import post_resource
from app.services.html_sanitizer import sanitize_post_content


class CreatePostAction:
    def execute(self, db: Session, user_id: int, req: CreatePostRequest) -> dict:
        import re
        slug = re.sub(r'[^a-z0-9]+', '-', req.title.lower()).strip('-')
        base_slug = slug
        counter = 1
        while db.query(Post).filter(Post.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        post = Post(
            user_id=user_id,
            title=req.title,
            slug=slug,
            content=sanitize_post_content(req.content),
            status=req.status,
        )

        if req.category_ids:
            post.categories = db.query(Category).filter(Category.id.in_(req.category_ids)).all()

        db.add(post)
        db.commit()
        db.refresh(post)
        return post_resource(post, db)
```

📄 `backend/app/actions/post/update_post_action.py`

```python
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.category import Category
from app.requests.post.update_post_request import UpdatePostRequest
from app.resources.post.post_resource import post_resource
from app.services.html_sanitizer import sanitize_post_content


class UpdatePostAction:
    def execute(self, db: Session, post_id: int, req: UpdatePostRequest) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError("Article introuvable")

        if req.title is not None:
            post.title = req.title
        if req.content is not None:
            post.content = sanitize_post_content(req.content)
        if req.status is not None:
            post.status = req.status
        if req.category_ids is not None:
            post.categories = db.query(Category).filter(Category.id.in_(req.category_ids)).all()

        db.commit()
        db.refresh(post)
        return post_resource(post, db, include_content=True)
```

### 3.6 Resource : extrait en texte brut

📄 `backend/app/resources/post/post_resource.py`

L'extrait (`excerpt`) affiché sur les cartes doit être du texte brut, pas du
HTML tronqué au milieu d'une balise — d'où l'appel à `html_to_plain_text()`.

```python
from sqlalchemy.orm import Session
from app.models.post import Post
from app.resources.user.user_resource import user_resource
from app.services.html_sanitizer import html_to_plain_text

EXCERPT_LENGTH = 240


def post_resource(post: Post, db: Session | None = None, include_content: bool = False) -> dict:
    plain_content = html_to_plain_text(post.content)
    excerpt = plain_content if len(plain_content) <= EXCERPT_LENGTH else plain_content[:EXCERPT_LENGTH].rstrip() + "…"
    cover_image = post.files[0].file_url if post.files else None

    data = {
        "id": post.id, "title": post.title, "slug": post.slug,
        "excerpt": excerpt, "cover_image": cover_image, "status": post.status,
        "author": user_resource(post.author) if post.author else None,
        "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in post.categories],
        "likes_count": len(post.likes) if post.likes else 0,
        "comments_count": len(post.comments) if post.comments else 0,
        "created_at": str(post.created_at) if post.created_at else None,
        "updated_at": str(post.updated_at) if post.updated_at else None,
    }
    if include_content:
        data["content"] = post.content  # le HTML complet, pour l'affichage détaillé
        from app.resources.comment.comment_resource import comment_resource
        data["comments"] = [comment_resource(c) for c in (post.comments or [])]
    return data
```

### 3.7 Enregistrer les routes

📄 `backend/main.py` — ajoute ces deux lignes aux imports et à l'enregistrement des routers existants :

```python
from app.controllers.upload.upload_controller import router as upload_router
# ...
app.include_router(upload_router)
```

## 4. Frontend

### 4.1 Client API pour l'upload dans l'éditeur

📄 `frontend/src/api/uploads.api.js`

```javascript
import api from './axios'

export const uploadEditorImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api
    .post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}
```

### 4.2 CSS partagé entre l'éditeur et l'affichage

📄 `frontend/src/index.css` — à ajouter à la fin du fichier.

La classe `.tiptap-content` est utilisée à la fois DANS l'éditeur (zone de
saisie) et SUR l'affichage en lecture (`PostModal`) : ça garantit que ce que
l'auteur voit en écrivant ressemble exactement à ce que les lecteurs verront
("WYSIWYG").

```css
.tiptap-content h1 { font-size: 1.75rem; font-weight: 700; margin: 1.2rem 0 0.6rem; }
.tiptap-content h2 { font-size: 1.4rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.tiptap-content h3 { font-size: 1.15rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
.tiptap-content p { margin: 0.5rem 0; line-height: 1.7; }
.tiptap-content ul { list-style: disc; padding-left: 1.4rem; margin: 0.5rem 0; }
.tiptap-content ol { list-style: decimal; padding-left: 1.4rem; margin: 0.5rem 0; }
.tiptap-content li { margin: 0.2rem 0; }
.tiptap-content blockquote {
  border-left: 3px solid #E8590C;
  padding-left: 1rem;
  margin: 0.8rem 0;
  color: #4b5563;
  font-style: italic;
}
.tiptap-content a { color: #1877F2; text-decoration: underline; }
.tiptap-content img { max-width: 100%; border-radius: 0.5rem; margin: 0.8rem 0; }
.tiptap-content strong { font-weight: 700; }
.tiptap-content em { font-style: italic; }
.tiptap-content u { text-decoration: underline; }
.tiptap-content code {
  background: #f3f4f6;
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  font-size: 0.9em;
}
.tiptap-content.is-editor { min-height: 220px; outline: none; padding: 0.75rem 1rem; }
.tiptap-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}
```

### 4.3 Le composant éditeur

📄 `frontend/src/components/blog/RichTextEditor.jsx`

Composant **contrôlé**, comme un input classique : reçoit `value` (le HTML
actuel) et appelle `onChange(html)` à chaque modification.

```jsx
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
    // citation, code, undo/redo (Tiptap v3) — ne pas les ajouter en double.
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
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Synchronise l'éditeur si "value" change depuis l'extérieur (chargement
  // d'un post à modifier, réinitialisation à l'ouverture). La comparaison
  // avec getHTML() évite une boucle infinie onUpdate <-> useEffect.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL du lien :', previousUrl || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleImageButtonClick = () => fileInputRef.current?.click()

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editor) return
    try {
      const { url } = await uploadEditorImage(file)
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
        <ToolbarButton label="Gras" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FiBold size={16} /></ToolbarButton>
        <ToolbarButton label="Italique" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FiItalic size={16} /></ToolbarButton>
        <ToolbarButton label="Souligné" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><FiUnderline size={16} /></ToolbarButton>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton label="Titre 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><span className="text-xs font-bold">H1</span></ToolbarButton>
        <ToolbarButton label="Titre 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><span className="text-xs font-bold">H2</span></ToolbarButton>
        <ToolbarButton label="Titre 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><span className="text-xs font-bold">H3</span></ToolbarButton>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton label="Liste à puces" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FiList size={16} /></ToolbarButton>
        <ToolbarButton label="Citation" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><span className="text-base leading-none">”</span></ToolbarButton>
        <ToolbarButton label="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><FiCode size={16} /></ToolbarButton>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton label="Lien" active={editor.isActive('link')} onClick={setLink}><FiLink size={16} /></ToolbarButton>
        <ToolbarButton label="Image" onClick={handleImageButtonClick}><FiImage size={16} /></ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelected} className="hidden" />
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton label="Annuler" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><FiRotateCcw size={16} /></ToolbarButton>
        <ToolbarButton label="Rétablir" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><FiRotateCw size={16} /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
```

### 4.4 Intégration dans le formulaire de création/édition

📄 `frontend/src/components/blog/CreatePostModal.jsx` — 3 changements sur un fichier existant :

**a) Import**
```jsx
import RichTextEditor from './RichTextEditor'
```

**b) Le `<textarea>` devient**
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
  <RichTextEditor value={content} onChange={setContent} />
</div>
```

**c) Validation "champ requis"** — un éditeur Tiptap vide renvoie `<p></p>`,
pas une chaîne vide. `!content.trim()` ne le détecte donc jamais :

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const contentIsEmpty = content.replace(/<[^>]*>/g, '').trim() === ''
  if (!title.trim() || contentIsEmpty) {
    toast.error('Titre et contenu requis')
    return
  }
  // ... reste inchangé (createPost / updatePost envoient "content" tel quel)
```

### 4.5 Affichage du contenu riche

📄 `frontend/src/components/blog/PostModal.jsx` — remplace le paragraphe brut :

```jsx
{/* dangerouslySetInnerHTML est sûr ICI uniquement parce que le backend a
    déjà nettoyé ce HTML avec bleach (sanitize_post_content) avant de le
    stocker en base : aucun <script> ne peut y survivre. Ne JAMAIS faire
    ça avec du contenu non passé par le sanitizer backend. */}
<div
  className="tiptap-content text-gray-700 leading-relaxed mb-6"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

## 5. Pièges à connaître (à ne pas reproduire ailleurs)

| Piège | Symptôme | Cause |
|---|---|---|
| Importer `Underline`/`Link` séparément en plus de `StarterKit` | Erreur au montage de l'éditeur : *"does not allow two extensions with the same name"* | StarterKit v3 les inclut déjà |
| Installer `@tiptap/extension-placeholder` seul | Erreurs de schéma incompréhensibles, versions `@tiptap/core` en conflit | Le paquet a été fusionné dans `@tiptap/extensions` en v3 |
| `if (!content.trim())` pour valider un champ obligatoire | On peut publier un article "vide" | Tiptap vide = `<p></p>`, pas `''` |
| Afficher `post.content` avec `{post.content}` (texte) | Les balises HTML s'affichent littéralement à l'écran | Le contenu est du HTML depuis l'intégration Tiptap, plus du texte brut |
| Oublier `sanitize_post_content()` sur `update_post_action.py` | Faille XSS stockée si quelqu'un modifie un post via l'API directement | Le nettoyage doit s'appliquer à CHAQUE écriture, pas juste à la création |
| `static/` absent au premier lancement | Le serveur FastAPI refuse de démarrer (`app.mount` au boot) | Créer le dossier à la main avant le premier `uvicorn main:app` |

## 6. Checklist pour réimplémenter ailleurs

1. `pip install bleach` côté backend, `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extensions` côté frontend.
2. Créer `image_upload_service.py` (sauvegarde disque partagée).
3. Créer `html_sanitizer.py` (`sanitize_post_content` + `html_to_plain_text`).
4. Créer la route `POST /uploads/image` (upload générique pour l'éditeur).
5. Appeler `sanitize_post_content()` dans **toute** action qui écrit du contenu (création ET modification).
6. Utiliser `html_to_plain_text()` pour tout extrait/résumé affiché ailleurs que dans la vue détaillée.
7. Créer `RichTextEditor.jsx` en composant contrôlé (`value` / `onChange`).
8. Remplacer chaque `<textarea>` de contenu par `<RichTextEditor value={...} onChange={...} />`.
9. Corriger la validation "champ requis" pour retirer les balises HTML avant de tester si c'est vide.
10. Remplacer l'affichage texte brut par `dangerouslySetInnerHTML` **uniquement** sur du contenu qui est passé par le sanitizer backend.
11. Ajouter le CSS `.tiptap-content` partagé entre éditeur et lecture.
