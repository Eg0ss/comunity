# app/actions/post/upload_post_image_action.py
# Reçoit un fichier déjà validé par FastAPI (UploadFile), le sauvegarde sur disque
# dans backend/static/uploads/posts/, et enregistre la référence en base (PostFile).

import os
import uuid
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.post_file import PostFile

UPLOAD_DIR = "static/uploads/posts"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB = 5


class UploadPostImageAction:
    def execute(self, db: Session, post: Post, file: UploadFile) -> dict:
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError("Format d'image non supporté (jpg, png, webp, gif uniquement)")

        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Nom de fichier unique pour éviter tout écrasement entre deux images du même nom
        unique_name = f"{uuid.uuid4().hex}{ext}"
        disk_path = os.path.join(UPLOAD_DIR, unique_name)

        content = file.file.read()
        if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise ValueError(f"Image trop lourde (max {MAX_FILE_SIZE_MB} Mo)")

        with open(disk_path, "wb") as f:
            f.write(content)

        # URL publique : servie via app.mount("/static", ...) dans main.py
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