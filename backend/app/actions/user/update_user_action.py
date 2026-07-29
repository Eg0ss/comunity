from sqlalchemy.orm import Session
from app.models.user import User
from app.requests.user.update_user_request import UpdateUserRequest
from app.resources.user.user_resource import user_resource


class UpdateUserAction:
    def execute(self, db: Session, user_id: int, req: UpdateUserRequest) -> dict:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Utilisateur introuvable")

        if req.full_name is not None:
            user.full_name = req.full_name
        if req.username is not None:
            user.username = req.username
        if req.avatar_url is not None:
            user.avatar_url = req.avatar_url

        db.commit()
        db.refresh(user)
        return user_resource(user)
