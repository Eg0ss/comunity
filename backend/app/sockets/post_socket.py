# app/sockets/post_socket.py
# Définit la route WebSocket elle-même (/ws/posts) et une fonction utilitaire
# que post_controller.py appelle après chaque création de post.

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.sockets.connection_manager import manager

router = APIRouter()


@router.websocket("/ws/posts")
async def posts_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # On reste en écoute indéfiniment. Le frontend n'envoie rien lui-même ici,
        # il se contente d'écouter — mais il faut quand même "recevoir" en boucle
        # pour détecter la déconnexion du client (fermeture d'onglet, etc.)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


async def broadcast_post_created(post: dict):
    """Appelée par post_controller.py juste après la création d'un post."""
    await manager.broadcast({"type": "post_created", "post": post})