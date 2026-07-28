# app/requests/user/create_user_request.py
# Équivalent d'un Form Request Laravel : Pydantic valide AUTOMATIQUEMENT
# les données envoyées par le frontend avant même d'entrer dans l'Action.

from pydantic import BaseModel, EmailStr, field_validator


class CreateUserRequest(BaseModel):
    full_name: str
    username: str
    email: EmailStr  # Pydantic vérifie tout seul le format "xxx@xxx.xxx"
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, value: str) -> str:
        # Règle manuelle, comme "min:8" dans une règle de validation Laravel
        if len(value) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return value

    @field_validator("username")
    @classmethod
    def username_no_spaces(cls, value: str) -> str:
        if " " in value:
            raise ValueError("Le nom d'utilisateur ne doit pas contenir d'espaces")
        return value
