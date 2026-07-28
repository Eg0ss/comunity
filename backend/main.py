# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.user.user_controller import router as user_router

app = FastAPI(title="CommUnity API")

# CORS = autorise ton frontend React (autre port : 5173) à appeler cette API
# Sans ça, le navigateur BLOQUE les requêtes par sécurité (erreur CORS classique)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)


@app.get("/")
def read_root():
    return {"message": "CommUnity API is running"}