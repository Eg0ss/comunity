"""Script d'initialisation : crée les catégories par défaut."""

from database import SessionLocal, engine, Base
from app.models.category import Category


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

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
    db.close()
    print("Catégories initialisées")


if __name__ == "__main__":
    seed()