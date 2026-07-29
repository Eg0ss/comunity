# app/resources/user/user_resource.py
# Transforme un objet User (base de données) en dictionnaire JSON "sûr" à exposer.
# RÈGLE D'OR : on ne renvoie JAMAIS password_hash au frontend !

from app.models.user import User


def user_resource(user: User) -> dict:
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "provider": user.provider,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }
