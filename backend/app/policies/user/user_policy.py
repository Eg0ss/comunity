# app/policies/user/user_policy.py
# Une Policy répond à : "cet utilisateur a-t-il le droit de faire cette action ?"

from app.models.user import User


def can_update_user(current_user: User, target_user_id: int) -> bool:
    """Un utilisateur ne peut modifier QUE son propre compte."""
    return current_user.id == target_user_id


def can_delete_user(current_user: User, target_user_id: int) -> bool:
    """Idem pour la suppression."""
    return current_user.id == target_user_id