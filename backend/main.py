# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware  

import app.models

from app.controllers.user.user_controller import router as user_router
from app.controllers.post.post_controller import router as post_router
from app.controllers.comment.comment_controller import router as comment_router
from app.controllers.like.like_controller import router as like_router
from app.controllers.category.category_controller import router as category_router
from app.sockets.post_socket import router as post_socket_router
from app.controllers.upload.upload_controller import router as upload_router
from app.controllers.auth.auth_controller import router as auth_router 

app = FastAPI(title="CommUnity API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):517\d$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# <-- AJOUT : signe le cookie de session avec SESSION_SECRET_KEY (ton .env).
# Nécessaire pour que oauth.google.authorize_redirect() fonctionne.
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(category_router)
app.include_router(post_socket_router)
app.include_router(upload_router)
app.include_router(auth_router)  


@app.get("/")
def read_root():
    return {"message": "CommUnity API is running"}