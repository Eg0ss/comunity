from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()


class EnsureUserRequest(BaseModel):
    full_name: str


@router.post("/users/ensure")
def ensure_user(req: EnsureUserRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.full_name == req.full_name).first()
    if not user:
        user = User(full_name=req.full_name)
        db.add(user)
        db.commit()
        db.refresh(user)
    return {
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
        }
    }