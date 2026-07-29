# app/services/auth_service.py
# Ce service centralise tout ce qui touche à la SÉCURITÉ :
# - le hashage/vérification des mots de passe (via bcrypt directement)
# - la création et la lecture des tokens JWT
#
# NOTE : on n'utilise plus passlib (librairie non maintenue depuis 2020,
# incompatible avec les versions récentes de bcrypt). On appelle bcrypt
# directement, c'est plus simple et plus fiable dans la durée.

import os
import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))

# bcrypt a une limite technique de 72 octets par mot de passe.
# Au-delà, on tronque nous-mêmes plutôt que de laisser bcrypt planter.
MAX_PASSWORD_BYTES = 72


def hash_password(plain_password: str) -> str:
    """Transforme un mot de passe en clair en une empreinte irréversible (bcrypt)."""
    password_bytes = plain_password.encode("utf-8")[:MAX_PASSWORD_BYTES]
    # gensalt() génère un "sel" aléatoire à chaque appel : deux utilisateurs
    # avec le même mot de passe auront des hash différents (sécurité anti-rainbow-table)
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")  # on stocke le hash comme une string en base


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare un mot de passe tapé par l'utilisateur avec le hash stocké en base."""
    password_bytes = plain_password.encode("utf-8")[:MAX_PASSWORD_BYTES]
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(data: dict) -> str:
    """
    Génère un token JWT signé.
    'data' contient {"sub": user.id} -> "sub" (subject) = qui est le propriétaire du token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Décode et vérifie un token. Retourne None s'il est invalide, modifié ou expiré."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None