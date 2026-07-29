from sqlalchemy.orm import Session
from app.models.post import Post
from app.resources.post.post_resource import post_resource


class ListPostsAction:
    def execute(self, db: Session, status: str | None = "published", skip: int = 0, limit: int = 20) -> list:
        query = db.query(Post)
        if status:
            query = query.filter(Post.status == status)
        posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        return [post_resource(p, db) for p in posts]
