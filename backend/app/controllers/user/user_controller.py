from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.requests.user.create_user_request import CreateUserRequest
from app.requests.user.login_request import LoginRequest
from app.requests.user.update_user_request import UpdateUserRequest
from app.actions.user.create_user_action import CreateUserAction
from app.actions.user.login_user_action import LoginUserAction
from app.actions.user.list_users_action import ListUsersAction
from app.actions.user.update_user_action import UpdateUserAction
from app.actions.user.delete_user_action import DeleteUserAction
from app.middlewares.auth_middleware import require_auth
from app.resources.user.user_resource import user_resource
from fastapi import Request

router = APIRouter()


@router.post("/auth/register")
def register(req: CreateUserRequest, db: Session = Depends(get_db)):
    try:
        return CreateUserAction().execute(db, req)
    except ValueError as e:
        from fastapi.responses import JSONResponse
        from fastapi import status
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    try:
        return LoginUserAction().execute(db, req)
    except ValueError as e:
        from fastapi.responses import JSONResponse
        from fastapi import status
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_401_UNAUTHORIZED)


@router.get("/users/me")
def me(request: Request):
    user = require_auth(request)
    return user_resource(user)


@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    return ListUsersAction().execute(db)


@router.put("/users/me")
def update_me(req: UpdateUserRequest, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    try:
        return UpdateUserAction().execute(db, user.id, req)
    except ValueError as e:
        from fastapi.responses import JSONResponse
        from fastapi import status
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_404_NOT_FOUND)


@router.delete("/users/me")
def delete_me(request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    try:
        DeleteUserAction().execute(db, user.id)
        return {"detail": "Compte supprimé"}
    except ValueError as e:
        from fastapi.responses import JSONResponse
        from fastapi import status
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_404_NOT_FOUND)
