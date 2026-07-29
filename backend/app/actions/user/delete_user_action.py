from sqlalchemy.orm import Session
from app.models.user import User


class DeleteUserAction:
    def execute(self, db: Session, user_id: int) -> None:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Utilisateur introuvable")
        db.delete(user)
        db.commit()
