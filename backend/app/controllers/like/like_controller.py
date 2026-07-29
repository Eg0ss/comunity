from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi import status
from sqlalchemy.orm import Session
from database import get_db
from app.actions.like.toggle_like_action import ToggleLikeAction
from pydantic import BaseModel


class LikeRequest(BaseModel):
    user_id: int


router = APIRouter()


@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, req: LikeRequest, db: Session = Depends(get_db)):
    try:
        return ToggleLikeAction().execute(db, req.user_id, post_id)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_404_NOT_FOUND)