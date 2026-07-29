from sqlalchemy.orm import Session
from app.models.user import User
from app.requests.user.login_request import LoginRequest
from app.resources.user.user_resource import user_resource
from app.services.auth_service import verify_password, create_token


class LoginUserAction:
    def execute(self, db: Session, req: LoginRequest) -> dict:
        user = db.query(User).filter(User.email == req.email).first()
        if not user or not user.password_hash:
            raise ValueError("Email ou mot de passe incorrect")

        if not verify_password(req.password, user.password_hash):
            raise ValueError("Email ou mot de passe incorrect")

        token = create_token(user.id)
        return {"user": user_resource(user), "token": token}
