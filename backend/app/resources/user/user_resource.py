from app.models.user import User


def user_resource(user: User) -> dict:
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "provider": user.provider,
        "is_active": user.is_active,
        "created_at": str(user.created_at) if user.created_at else None,
    }
