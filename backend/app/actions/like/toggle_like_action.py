from sqlalchemy.orm import Session
from app.models.like import Like
from app.models.post import Post


class ToggleLikeAction:
    def execute(self, db: Session, user_id: int, post_id: int) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError("Article introuvable")

        existing = db.query(Like).filter(
            Like.post_id == post_id,
            Like.user_id == user_id,
        ).first()

        if existing:
            db.delete(existing)
            db.commit()
            return {"liked": False, "likes_count": len(post.likes) - 1}
        else:
            like = Like(post_id=post_id, user_id=user_id)
            db.add(like)
            db.commit()
            return {"liked": True, "likes_count": len(post.likes) + 1}
