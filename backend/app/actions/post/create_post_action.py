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
            categories = db.query(Category).filter(Category.id.in_(req.category_ids)).all()
            post.categories = categories

        db.add(post)
        db.commit()
        db.refresh(post)
        return post_resource(post, db)