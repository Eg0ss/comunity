# app/middlewares/auth_middleware.py
# Cette fonction lit le token JWT envoyé dans le header "Authorization: Bearer xxx",
# le vérifie, et renvoie l'utilisateur correspondant.
# Si le token est absent/invalide/expiré -> erreur 401 automatique.

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from app.models.user import User
from app.services.auth_service import decode_access_token

# Indique à Swagger (/docs) où se trouve la route de login, pour le bouton "Authorize"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user