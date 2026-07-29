from app.models.user import User
from app.models.comment import Comment


def can_manage_comment(user: User, comment: Comment) -> bool:
    return user.id == comment.user_id
