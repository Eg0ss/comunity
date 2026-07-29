from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.services.auth_service import decode_token
from database import SessionLocal
from app.models.user import User


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in ("/", "/docs", "/openapi.json"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            user_id = decode_token(token)
            if user_id is not None:
                db = SessionLocal()
                user = db.query(User).filter(User.id == user_id).first()
                db.close()
                if user:
                    request.state.user = user

        return await call_next(request)


def require_auth(request: Request):
    user = getattr(request.state, "user", None)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentification requise")
    return user


def optional_auth(request: Request):
    return getattr(request.state, "user", None)
