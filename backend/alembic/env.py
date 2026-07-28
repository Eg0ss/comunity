# alembic/env.py
import os
import sys
from logging.config import fileConfig
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context

# Permet à Alembic de trouver le dossier "app/" et "database.py"
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Charge les variables du .env (dont DATABASE_URL)
load_dotenv()

# Importe la Base et TOUS les modèles pour qu'Alembic les "voie"
from database import Base
from app.models.user import User
from app.models.post import Post
from app.models.post_file import PostFile
from app.models.category import Category, post_categories
from app.models.comment import Comment
from app.models.like import Like

config = context.config

# Injecte dynamiquement l'URL de connexion depuis .env dans la config Alembic
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata = LA info clé : ça dit à Alembic "voici à quoi les tables DOIVENT ressembler"
# Il va comparer ça avec l'état actuel de la base pour générer la migration automatiquement
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()