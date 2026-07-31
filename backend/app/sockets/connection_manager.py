# app/sockets/connection_manager.py
# Garde la liste de tous les clients actuellement connectés en WebSocket,
# et sait comment leur diffuser un message à tous en même temps ("broadcast").

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        # Liste simple des connexions actives. En mémoire uniquement :
        # si le serveur redémarre, tout le monde doit se reconnecter (normal en dev).
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # On envoie le message à TOUS les clients connectés.
        # Si un envoi échoue (client déjà déconnecté sans qu'on le sache encore),
        # on le retire silencieusement au lieu de faire planter tout le broadcast.
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)
        for dead in dead_connections:
            self.disconnect(dead)


# Une SEULE instance partagée par toute l'application (singleton),
# importée à la fois par le controller WebSocket et par post_controller.py
manager = ConnectionManager()