from sqlalchemy.orm import Session
from app.models.post import Post


class DeletePostAction:
    def execute(self, db: Session, post_id: int) -> None:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError("Article introuvable")
        db.delete(post)
        db.commit()
