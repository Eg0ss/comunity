from sqlalchemy.orm import Session
from app.models.user import User
from app.requests.user.create_user_request import CreateUserRequest
from app.resources.user.user_resource import user_resource
from app.services.auth_service import hash_password, create_token


class CreateUserAction:
    def execute(self, db: Session, req: CreateUserRequest) -> dict:
        existing = db.query(User).filter(
            (User.email == req.email) | (User.username == req.username)
        ).first()
        if existing:
            raise ValueError("Email ou nom d'utilisateur déjà utilisé")

        user = User(
            full_name=req.full_name,
            username=req.username,
            email=req.email,
            password_hash=hash_password(req.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_token(user.id)
        return {"user": user_resource(user), "token": token}
