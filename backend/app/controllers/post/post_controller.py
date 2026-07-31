from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from fastapi import status
from sqlalchemy.orm import Session
from database import get_db
from app.requests.post.create_post_request import CreatePostRequest
from app.requests.post.update_post_request import UpdatePostRequest
from app.actions.post.create_post_action import CreatePostAction
from app.actions.post.list_posts_action import ListPostsAction
from app.actions.post.show_post_action import ShowPostAction
from app.actions.post.update_post_action import UpdatePostAction
from app.actions.post.delete_post_action import DeletePostAction
from app.middlewares.auth_middleware import require_auth
from app.models.post import Post
from app.policies.post.post_policy import can_manage_post
from fastapi import UploadFile, File
from app.actions.post.upload_post_image_action import UploadPostImageAction

router = APIRouter()


@router.get("/posts")
def list_posts(db: Session = Depends(get_db), status_filter: str | None = "published", skip: int = 0, limit: int = 20):
    return ListPostsAction().execute(db, status=status_filter, skip=skip, limit=limit)


@router.get("/posts/{slug}")
def show_post(slug: str, db: Session = Depends(get_db)):
    result = ShowPostAction().execute(db, slug)
    if not result:
        return JSONResponse({"detail": "Article introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    return result


@router.post("/posts")
def create_post(req: CreatePostRequest, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    try:
        return CreatePostAction().execute(db, user.id, req)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.put("/posts/{post_id}")
def update_post(post_id: int, req: UpdatePostRequest, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return JSONResponse({"detail": "Article introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    if not can_manage_post(user, post):
        return JSONResponse({"detail": "Action non autorisée"}, status_code=status.HTTP_403_FORBIDDEN)
    try:
        return UpdatePostAction().execute(db, post_id, req)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.delete("/posts/{post_id}")
def delete_post(post_id: int, request: Request, db: Session = Depends(get_db)):
    user = require_auth(request)
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return JSONResponse({"detail": "Article introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    if not can_manage_post(user, post):
        return JSONResponse({"detail": "Action non autorisée"}, status_code=status.HTTP_403_FORBIDDEN)
    try:
        DeletePostAction().execute(db, post_id)
        return {"detail": "Article supprimé"}
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)


@router.get("/posts")
def list_posts(
    db: Session = Depends(get_db),
    status_filter: str | None = "published",
    search: str | None = None,
    category_id: int | None = None,
    skip: int = 0,
    limit: int = 20,
):
    return ListPostsAction().execute(
        db, status=status_filter, search=search, category_id=category_id, skip=skip, limit=limit
    )

@router.post("/posts/{post_id}/image")
def upload_post_image(post_id: int, request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = require_auth(request)
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return JSONResponse({"detail": "Article introuvable"}, status_code=status.HTTP_404_NOT_FOUND)
    if not can_manage_post(user, post):
        return JSONResponse({"detail": "Action non autorisée"}, status_code=status.HTTP_403_FORBIDDEN)
    try:
        return UploadPostImageAction().execute(db, post, file)
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)