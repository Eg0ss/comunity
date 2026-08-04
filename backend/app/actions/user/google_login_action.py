# app/actions/user/google_login_action.py
# Reçoit les infos du profil Google (email, nom, photo, identifiant Google unique),
# et applique cette logique :
#   1. Un utilisateur avec ce google_id existe déjà -> on le connecte directement
#   2. Sinon, un compte "local" existe déjà avec cet email -> on RELIE ce compte
#      à Google (permet à quelqu'un de se connecter soit par mdp, soit par Google)
#   3. Sinon -> on crée un nouveau compte

from sqlalchemy.orm import Session
from app.models.user import User
from app.services.auth_service import create_access_token


def _generate_unique_username(db: Session, base: str) -> str:
    """Ajoute un suffixe numérique si le nom d'utilisateur dérivé de l'email est déjà pris."""
    username = base
    suffix = 1
    while db.query(User).filter(User.username == username).first():
        suffix += 1
        username = f"{base}{suffix}"
    return username


def google_login_action(db: Session, google_user_info: dict) -> dict:
    email = google_user_info.get("email")
    google_id = google_user_info.get("sub")  # "sub" = identifiant unique Google (standard OpenID)
    full_name = google_user_info.get("name") or (email.split("@")[0] if email else "Utilisateur")
    avatar_url = google_user_info.get("picture")

    if not email or not google_id:
        raise ValueError("Google n'a pas renvoyé les informations nécessaires")

    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # Peut-être qu'un compte local existe déjà avec cet email
        user = db.query(User).filter(User.email == email).first()

        if user:
            # On relie ce compte existant à Google, sans écraser son mot de passe
            user.google_id = google_id
            if not user.avatar_url:
                user.avatar_url = avatar_url
        else:
            username = _generate_unique_username(db, email.split("@")[0])
            user = User(
                full_name=full_name,
                username=username,
                email=email,
                password_hash=None,  # aucun mot de passe local pour un compte 100% Google
                avatar_url=avatar_url,
                provider="google",
                google_id=google_id,
            )
            db.add(user)

        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise ValueError("Ce compte est désactivé")

    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "user": user}