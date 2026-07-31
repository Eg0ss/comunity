# app/resources/post/post_resource.py
# On ajoute deux champs utiles pour la carte (PostCard) côté frontend :
#   - excerpt      : un extrait du contenu, tronqué côté serveur (évite d'envoyer
#                     tout le "content" complet dans la liste, inutilement lourd)
#   - cover_image  : l'URL de la première image liée au post, ou None s'il n'y en a pas

from sqlalchemy.orm import Session
from app.models.post import Post
from app.resources.user.user_resource import user_resource

EXCERPT_LENGTH = 240


def post_resource(post: Post, db: Session | None = None, include_content: bool = False) -> dict:
    # post.content[:240] + "…" si plus long, sinon tel quel
    excerpt = post.content if len(post.content) <= EXCERPT_LENGTH else post.content[:EXCERPT_LENGTH].rstrip() + "…"

    # post.files est déjà chargé par la relation SQLAlchemy (pas besoin d'une requête en plus)
    cover_image = post.files[0].file_url if post.files else None

    data = {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "excerpt": excerpt,
        "cover_image": cover_image,
        "status": post.status,
        "author": user_resource(post.author) if post.author else None,
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