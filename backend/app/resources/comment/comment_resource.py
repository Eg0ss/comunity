from app.models.comment import Comment
from app.resources.user.user_resource import user_resource


def comment_resource(comment: Comment) -> dict:
    replies = []
    if comment.replies:
        replies = [comment_resource(r) for r in comment.replies]

    return {
        "id": comment.id,
        "content": comment.content,
        "author": user_resource(comment.author) if comment.author else None,
        "parent_comment_id": comment.parent_comment_id,
        "replies": replies,
        "created_at": str(comment.created_at) if comment.created_at else None,
        "updated_at": str(comment.updated_at) if comment.updated_at else None,
    }
