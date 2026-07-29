# app/controllers/user/user_controller.py
# Le Controller ne fait QUE : recevoir → appeler l'Action → formater avec la Resource.
# Zéro logique métier ici, c'est la règle stricte de ton architecture.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

from app.requests.user.create_user_request import CreateUserRequest
from app.requests.user.login_request import LoginRequest
from app.actions.user.create_user_action import create_user_action
from app.actions.user.login_user_action import login_user_action
from app.resources.user.user_resource import user_resource
from app.middlewares.auth_middleware import get_current_user
from app.models.user import User

# prefix = préfixe commun à toutes les routes ("/users/register", "/users/login"...)
# tags = regroupe ces routes dans la doc Swagger (/docs) sous une section "users"
router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", status_code=201)
def register(data: CreateUserRequest, db: Session = Depends(get_db)):
    new_user = create_user_action(db, data)
    return user_resource(new_user)


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user_action(db, data)
    return {
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": user_resource(result["user"]),
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    # Route PROTÉGÉE : nécessite un token JWT valide dans le header Authorization
    return user_resource(current_user)
