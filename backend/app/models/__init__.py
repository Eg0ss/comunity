# app/models/__init__.py
from app.models.user import User
from app.models.post import Post
from app.models.post_file import PostFile
from app.models.category import Category, post_categories
from app.models.comment import Comment
from app.models.like import Like

# __all__ = liste explicite de ce que ce package expose publiquement (bonne pratique)
__all__ = ["User", "Post", "PostFile", "Category", "post_categories", "Comment", "Like"]