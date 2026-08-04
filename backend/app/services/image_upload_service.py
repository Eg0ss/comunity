# app/services/image_upload_service.py
# Logique de sauvegarde de fichier PARTAGÉE entre :
#   - l'upload d'image de couverture d'un post (upload_post_image_action.py)
#   - l'upload d'image insérée DANS le texte via l'éditeur Tiptap (nouveau)
# Évite de dupliquer deux fois la même validation/écriture disque.

import os
import uuid
from fastapi import UploadFile

MAX_FILE_SIZE_MB = 8

EXTENSION_BY_CONTENT_TYPE = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/bmp": ".bmp",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "image/tiff": ".tiff",
    "image/x-icon": ".ico",
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
    os.makedirs(upload_dir, exist_ok=True)

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