"""Script d'initialisation : crée les catégories par défaut et un utilisateur de test."""

from database import SessionLocal, engine, Base
from app.models.user import User
from app.models.category import Category, post_categories
from app.models.post import Post
from app.models.post_file import PostFile
from app.models.comment import Comment
from app.models.like import Like
from app.services.auth_service import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Catégories
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

    # Utilisateur de test
    test_user = db.query(User).filter(User.email == "demo@community.app").first()
    if not test_user:
        test_user = User(
            full_name="Démo CommUnity",
            username="demo",
            email="demo@community.app",
            password_hash=hash_password("password123"),
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print("✅ Utilisateur de test créé : demo@community.app / password123")

    db.commit()
    db.close()
    print("✅ Catégories initialisées")


if __name__ == "__main__":
    seed()
