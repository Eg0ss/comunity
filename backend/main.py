from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.post.post_controller import router as post_router
from app.controllers.comment.comment_controller import router as comment_router
from app.controllers.like.like_controller import router as like_router
from app.controllers.category.category_controller import router as category_router
from app.controllers.ensure_controller import router as ensure_router

app = FastAPI(title="CommUnity API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(category_router)
app.include_router(ensure_router)


@app.get("/")
def read_root():
    return {"message": "CommUnity API is running"}