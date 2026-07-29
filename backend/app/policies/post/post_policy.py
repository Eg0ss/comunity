from app.models.user import User
from app.models.post import Post


def can_manage_post(user: User, post: Post) -> bool:
    return user.id == post.user_id
