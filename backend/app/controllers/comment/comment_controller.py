from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from fastapi import status
from sqlalchemy.orm import Session
from database import get_db
from app.requests.comment.create_comment_request import CreateCommentRequest
from app.requests.comment.update_comment_request import UpdateCommentRequest
from app.actions.comment.create_comment_action import CreateCommentAction
from app.actions.comment.list_comments_action import ListCommentsAction
from app.actions.comment.update_comment_action import UpdateCommentAction
from app.actions.comment.delete_comment_action import DeleteCommentAction
from app.middlewares.auth_middleware import require_auth
from app.models.comment import Comment
from app.policies.comment.comment_policy import can_manage_comment

router = APIRouter()


@router.get("/posts/{post_id}/comments")
def list_comments(post_id: int, db: Session = Depends(get_db)):
    return ListCommentsAction().execute(db, post_id)


@router.post("/posts/{post_id}/comments")
def create_comment(post_id: int, req: CreateCommentRequest, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    try:
        return CreateCommentAction().execute(db, user.id, post_id, req)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.put("/comments/{comment_id}")
def update_comment(comment_id: int, req: UpdateCommentRequest, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        return JSONResponse({"detail": "Commentaire introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    if not can_manage_comment(user, comment):
        return JSONResponse({"detail": "Action non autorisée"}, status_code=status.HTTP_403_FORBIDDEN)
    try:
        return UpdateCommentAction().execute(db, comment_id, req)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        return JSONResponse({"detail": "Commentaire introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    if not can_manage_comment(user, comment):
        return JSONResponse({"detail": "Action non autorisée"}, status_code=status.HTTP_403_FORBIDDEN)
    try:
        DeleteCommentAction().execute(db, comment_id)
        return {"detail": "Commentaire supprimé"}
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)
