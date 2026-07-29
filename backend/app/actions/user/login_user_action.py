# app/actions/user/login_user_action.py
# Vérifie l'email + le mot de passe, puis génère un token JWT si tout est correct

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.requests.user.login_request import LoginRequest
from app.services.auth_service import verify_password, create_access_token


def login_user_action(db: Session, data: LoginRequest) -> dict:
    user = db.query(User).filter(User.email == data.email).first()

    # Bonne pratique de sécurité : le même message d'erreur, que l'email
    # existe ou non en base. Ça évite qu'un attaquant devine quels emails sont inscrits.
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Email ou mot de passe incorrect"
    )

    if not user or not user.password_hash:
        # "not user.password_hash" = compte créé via Google, pas de mdp local
        raise invalid_credentials

    if not verify_password(data.password, user.password_hash):
        raise invalid_credentials

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ce compte est désactivé"
        )

    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer", "user": user}
