# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import app.models

from app.controllers.user.user_controller import router as user_router
from app.controllers.post.post_controller import router as post_router
from app.controllers.comment.comment_controller import router as comment_router
from app.controllers.like.like_controller import router as like_router
from app.controllers.category.category_controller import router as category_router
from app.sockets.post_socket import router as post_socket_router
from app.controllers.upload.upload_controller import router as upload_router

app = FastAPI(title="CommUnity API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):517\d$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sert le contenu de backend/static/ sur l'URL http://127.0.0.1:8000/static/...
# C'est ce qui rend les images de post accessibles depuis le navigateur.
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(category_router)
app.include_router(post_socket_router)
app.include_router(upload_router)

@app.get("/")
def read_root():
    return {"message": "CommUnity API is running"}