from sqlalchemy.orm import Session
from app.models.comment import Comment


class DeleteCommentAction:
    def execute(self, db: Session, comment_id: int) -> None:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise ValueError("Commentaire introuvable")
        db.delete(comment)
        db.commit()
