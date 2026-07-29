from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.requests.comment.update_comment_request import UpdateCommentRequest
from app.resources.comment.comment_resource import comment_resource


class UpdateCommentAction:
    def execute(self, db: Session, comment_id: int, req: UpdateCommentRequest) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise ValueError("Commentaire introuvable")
        comment.content = req.content
        db.commit()
        db.refresh(comment)
        return comment_resource(comment)