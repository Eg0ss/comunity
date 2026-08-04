# app/controllers/upload/upload_controller.py
# Upload d'image générique, indépendant d'un post précis. Utilisé par l'éditeur
# de texte enrichi (Tiptap) pour insérer une image DANS le contenu, y compris
# pendant la RÉDACTION d'un nouvel article (qui n'a pas encore d'id en base).

from fastapi import APIRouter, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi import status
from app.middlewares.auth_middleware import require_auth
from app.services.image_upload_service import save_image_file

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/image")
def upload_editor_image(request: Request, file: UploadFile = File(...)):
    require_auth(request)
    try:
        public_url, _size_kb = save_image_file(file, subdir="editor")
        return {"url": public_url}
    except ValueError as e:
        return JSONResponse({"detail": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)