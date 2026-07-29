# app/requests/user/login_request.py
# Valide les données envoyées lors de la connexion (email + mot de passe uniquement)

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
