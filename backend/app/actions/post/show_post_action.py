from sqlalchemy.orm import Session
from app.models.post import Post
from app.resources.post.post_resource import post_resource


class ShowPostAction:
    def execute(self, db: Session, slug: str) -> dict | None:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            return None
        return post_resource(post, db, include_content=True)
