from app.models.comment import Comment


def _author_data(author):
    if not author:
        return None
    return {
        "id": author.id,
        "full_name": author.full_name,
        "avatar_url": author.avatar_url,
    }


def comment_resource(comment: Comment) -> dict:
    replies = []
    if comment.replies:
        replies = [comment_resource(r) for r in comment.replies]

    return {
        "id": comment.id,
        "content": comment.content,
        "author": _author_data(comment.author),
        "parent_comment_id": comment.parent_comment_id,
        "replies": replies,
        "created_at": str(comment.created_at) if comment.created_at else None,
        "updated_at": str(comment.updated_at) if comment.updated_at else None,
    }