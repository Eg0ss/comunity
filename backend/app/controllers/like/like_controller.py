from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from fastapi import status
from sqlalchemy.orm import Session
from database import get_db
from app.actions.like.toggle_like_action import ToggleLikeAction
from app.middlewares.auth_middleware import require_auth

router = APIRouter()


@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    try:
        return ToggleLikeAction().execute(db, user.id, post_id)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_404_NOT_FOUND)
