# app/services/google_oauth_service.py
# Configure le client OAuth Google via Authlib. C'est cet objet "oauth" que
# auth_controller.py utilise pour rediriger vers Google puis récupérer le
# profil de l'utilisateur au retour.

import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth

load_dotenv()  # s'assure que .env est chargé même si ce module est importé en premier

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    # Cette URL "magique" décrit TOUS les endpoints Google (autorisation, jetons,
    # infos utilisateur...) : Authlib la lit une fois et configure tout seul.
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)