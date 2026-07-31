# app/actions/post/list_posts_action.py
# On ajoute deux nouveaux paramètres, tous les deux optionnels pour ne rien casser
# des appels existants (Home.jsx, Feed.jsx continuent de fonctionner sans les fournir) :
#   - search      : recherche texte, sur le titre ET le contenu
#   - category_id : filtre par catégorie précise

from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.post import Post
from app.models.category import Category
from app.resources.post.post_resource import post_resource


class ListPostsAction:
    def execute(
        self,
        db: Session,
        status: str | None = "published",
        search: str | None = None,
        category_id: int | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list:
        query = db.query(Post)

        if status:
            query = query.filter(Post.status == status)

        if search:
            # ilike = "insensitive like", donc insensible à la casse (Django/Postgres)
            # Le %...% autour du terme permet de matcher n'importe où dans le texte.
            like_pattern = f"%{search}%"
            query = query.filter(
                or_(Post.title.ilike(like_pattern), Post.content.ilike(like_pattern))
            )

        if category_id:
            # join() via la relation many-to-many post_categories déjà définie
            # dans app/models/category.py (secondary="post_categories")
            query = query.join(Post.categories).filter(Category.id == category_id)

        posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
        return [post_resource(p, db) for p in posts]