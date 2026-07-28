# app/services/auth_service.py
# Ce service centralise tout ce qui touche à la SÉCURITÉ :
# - le hashage/vérification des mots de passe
# - la création et la lecture des tokens JWT
# On le met dans services/ car c'est une logique technique transverse,
# utilisée par plusieurs Actions (create_user_action, login_user_action...).

import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

# CryptContext = objet qui sait hasher et vérifier des mots de passe avec bcrypt
# bcrypt = algorithme de hashage sécurisé à sens unique (impossible à "dé-hasher")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Récupère les infos JWT depuis le fichier .env (déjà configuré à l'étape précédente)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))


def hash_password(plain_password: str) -> str:
    """Transforme un mot de passe en clair en une empreinte irréversible."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare un mot de passe tapé par l'utilisateur avec le hash stocké en base."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """
    Génère un token JWT signé.
    'data' contient {"sub": user.id} -> "sub" (subject) = qui est le propriétaire du token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})  # "exp" = date d'expiration, vérifiée automatiquement
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Décode et vérifie un token. Retourne None s'il est invalide, modifié ou expiré."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None