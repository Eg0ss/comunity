"""Script d'initialisation : crée les catégories par défaut, un admin et un utilisateur de test."""

from database import SessionLocal, engine, Base
from app.models.user import User
from app.models.category import Category, post_categories
from app.models.post import Post
from app.models.post_file import PostFile
from app.models.comment import Comment
from app.models.like import Like
from app.services.auth_service import hash_password


def seed():
    # Crée les tables si elles n'existent pas encore (ne casse rien si elles existent déjà)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # --- Catégories (inchangé) ---
    existing_cats = {c.name for c in db.query(Category).all()}
    categories = [
        "Technologie", "Voyage", "Cuisine", "Santé",
        "Culture", "Lifestyle", "Sport", "Finance",
    ]
    for name in categories:
        if name not in existing_cats:
            from re import sub
            slug = sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            db.add(Category(name=name, slug=slug))
    db.commit()

    # --- Fonction utilitaire : crée un compte seulement s'il n'existe pas déjà ---
    # Évite l'erreur "email déjà utilisé" si tu relances le script plusieurs fois.
    def create_account_if_missing(full_name, username, email, password, role):
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"ℹ️  Compte déjà présent : {email}")
            return existing

        user = User(
            full_name=full_name,
            username=username,
            email=email,
            # Le mot de passe n'est JAMAIS stocké en clair, toujours hashé via bcrypt
            password_hash=hash_password(password),
            provider="local",
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)  # récupère l'id généré par PostgreSQL
        print(f"✅ Compte {role} créé : {email} / {password}")
        return user

    # --- Compte ADMIN ---
    create_account_if_missing(
        full_name="Admin CommUnity",
        username="admin",
        email="admin@community.app",
        password="Admin@123",
        role="admin",
    )

    # --- Compte UTILISATEUR normal ---
    create_account_if_missing(
        full_name="Démo CommUnity",
        username="demo",
        email="demo@community.app",
        password="password123",
        role="user",
    )

    db.close()
    print("✅ Seed terminé")


if __name__ == "__main__":
    seed()