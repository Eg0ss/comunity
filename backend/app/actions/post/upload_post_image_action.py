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