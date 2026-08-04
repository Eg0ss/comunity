# app/controllers/auth/auth_controller.py
# Deux routes :
#   GET /auth/google/login    -> redirige le navigateur vers l'écran de consentement Google
#   GET /auth/google/callback -> Google revient ici avec un "code", qu'on échange
#                                 contre les infos du profil, puis on redirige
#                                 vers le FRONTEND avec un token JWT dans l'URL

import os
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from database import SessionLocal
from app.services.google_oauth_service import oauth
from app.actions.user.google_login_action import google_login_action

router = APIRouter(prefix="/auth", tags=["auth"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    # authorize_redirect a besoin de la session (request.session) pour stocker
    # un jeton anti-CSRF le temps de l'aller-retour vers Google -> voir étape 3
    # (SessionMiddleware), sans quoi cette ligne plante.
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception:
        # L'utilisateur a peut-être refusé l'accès, ou le "state" a expiré
        return RedirectResponse(f"{FRONTEND_URL}/auth/google/callback?error=google_auth_failed")

    # Avec scope="openid", Authlib remplit généralement token["userinfo"] tout
    # seul. Par sécurité, si jamais ce n'est pas le cas, on le demande explicitement.
    google_user_info = token.get("userinfo") or await oauth.google.userinfo(token=token)

    db = SessionLocal()
    try:
        result = google_login_action(db, google_user_info)
    except ValueError as e:
        return RedirectResponse(f"{FRONTEND_URL}/auth/google/callback?error={str(e)}")
    finally:
        db.close()

    # On ne peut pas déposer directement le token dans le localStorage du
    # frontend depuis le backend (deux origines différentes) : on le passe
    # donc dans l'URL de redirection, et c'est GoogleCallback.jsx qui le récupère.
    return RedirectResponse(f"{FRONTEND_URL}/auth/google/callback?token={result['access_token']}")