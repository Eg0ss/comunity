# app/actions/user/create_user_action.py
# Une Action = une seule responsabilité : ici, "créer un utilisateur".
# Le Controller ne fera QUE l'appeler, sans aucune logique dedans.

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.requests.user.create_user_request import CreateUserRequest
from app.services.auth_service import hash_password


def create_user_action(db: Session, data: CreateUserRequest) -> User:
    # 1. Vérifier que l'email n'existe pas déjà
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cet email est déjà utilisé"
        )

    # 2. Vérifier que le username n'est pas déjà pris
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ce nom d'utilisateur est déjà pris"
        )

    # 3. Créer l'utilisateur en base, avec le mot de passe HASHÉ (jamais en clair)
    new_user = User(
        full_name=data.full_name,
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        provider="local",
    )

    db.add(new_user)      # prépare l'insertion
    db.commit()            # exécute réellement le SQL (comme ->save() en Eloquent)
    db.refresh(new_user)   # recharge l'objet pour récupérer l'id généré par PostgreSQL

    return new_user
