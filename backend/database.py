# database.py
# Ce fichier centralise TOUT ce qui concerne la connexion à PostgreSQL.
# C'est l'équivalent de config/database.php en Laravel.

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Charge les variables du fichier .env dans l'environnement Python
load_dotenv()

# Récupère l'URL de connexion depuis .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

connect_args = {}
if DATABASE_URL.startswith("postgresql"):
    connect_args = {"connect_timeout": int(os.getenv("DB_CONNECT_TIMEOUT", "5"))}

# "engine" = l'objet qui gère la connexion physique à PostgreSQL
# C'est comparable à la connexion PDO en PHP
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

# "SessionLocal" = une fabrique de sessions.
# Une "session" = une conversation avec la base (comme une transaction Eloquent)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# "Base" = la classe mère dont TOUS nos modèles (User, Post, Comment...) vont hériter
# C'est ce qui permet à SQLAlchemy de savoir "ça, c'est une table"
Base = declarative_base()


def get_db():
    """
    Fonction utilisée par FastAPI pour injecter une session DB dans chaque route.
    Le 'yield' garantit que la session est bien fermée après chaque requête,
    même en cas d'erreur (équivalent d'un try/finally automatique).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
