from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.resources.comment.comment_resource import comment_resource


class ListCommentsAction:
    def execute(self, db: Session, post_id: int) -> list:
        comments = db.query(Comment).filter(
            Comment.post_id == post_id,
            Comment.parent_comment_id.is_(None)
        ).order_by(Comment.created_at.asc()).all()
        return [comment_resource(c) for c in comments]
