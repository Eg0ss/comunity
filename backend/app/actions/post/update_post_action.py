from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.category import Category
from app.requests.post.update_post_request import UpdatePostRequest
from app.resources.post.post_resource import post_resource


class UpdatePostAction:
    def execute(self, db: Session, post_id: int, req: UpdatePostRequest) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise ValueError("Article introuvable")

        if req.title is not None:
            post.title = req.title
        if req.content is not None:
            post.content = req.content
        if req.status is not None:
            post.status = req.status
        if req.category_ids is not None:
            categories = db.query(Category).filter(Category.id.in_(req.category_ids)).all()
            post.categories = categories

        db.commit()
        db.refresh(post)
        return post_resource(post, db, include_content=True)