from sqlalchemy.orm import Session
from app.models.post import Post


def _author_data(author):
    if not author:
        return None
    return {
        "id": author.id,
        "full_name": author.full_name,
        "avatar_url": author.avatar_url,
    }


def post_resource(post: Post, db: Session | None = None, include_content: bool = False) -> dict:
    data = {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "status": post.status,
        "author": _author_data(post.author),
        "categories": [{"id": c.id, "name": c.name, "slug": c.slug} for c in post.categories],
        "likes_count": len(post.likes) if post.likes else 0,
        "comments_count": len(post.comments) if post.comments else 0,
        "created_at": str(post.created_at) if post.created_at else None,
        "updated_at": str(post.updated_at) if post.updated_at else None,
    }
    if include_content:
        data["content"] = post.content
        from app.resources.comment.comment_resource import comment_resource
        data["comments"] = [comment_resource(c) for c in (post.comments or [])]
    return data