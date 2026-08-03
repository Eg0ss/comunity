# app/actions/post/upload_post_image_action.py
import os
import uuid
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.post_file import PostFile

UPLOAD_DIR = "static/uploads/posts"
MAX_FILE_SIZE_MB = 8

# On accepte tout ce qui se déclare comme une image (Content-Type "image/..."),
# plutôt qu'une liste fermée d'extensions — ça couvre jpg, png, webp, gif, bmp,
# svg, avif, heic, tiff... tout ce que le navigateur peut envoyer.
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


class UploadPostImageAction:
    def execute(self, db: Session, post: Post, file: UploadFile) -> dict:
        content_type = (file.content_type or "").lower()

        if not content_type.startswith("image/"):
            raise ValueError("Le fichier envoyé n'est pas une image")

        # On essaie d'abord l'extension du nom de fichier original (garde le
        # format exact si connu), sinon on la déduit du Content-Type déclaré,
        # sinon on tombe sur ".img" en dernier recours plutôt que de bloquer.
        original_ext = os.path.splitext(file.filename or "")[1].lower()
        ext = original_ext if original_ext else EXTENSION_BY_CONTENT_TYPE.get(content_type, ".img")

        os.makedirs(UPLOAD_DIR, exist_ok=True)
        unique_name = f"{uuid.uuid4().hex}{ext}"
        disk_path = os.path.join(UPLOAD_DIR, unique_name)

        content = file.file.read()
        if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise ValueError(f"Image trop lourde (max {MAX_FILE_SIZE_MB} Mo)")

        with open(disk_path, "wb") as f:
            f.write(content)

        public_url = f"/static/uploads/posts/{unique_name}"

        post_file = PostFile(
            post_id=post.id,
            file_url=public_url,
            file_type="image",
            original_name=file.filename,
            size_kb=len(content) // 1024,
        )
        db.add(post_file)
        db.commit()

        return {"file_url": public_url}