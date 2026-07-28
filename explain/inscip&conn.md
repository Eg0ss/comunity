INSCRIPTION CONNEXION 
BACKEND
Requête HTTP (POST /users/register)
   ↓
Request (CreateUserRequest) → valide les données automatiquement
   ↓
Controller (user_controller.py) → reçoit, appelle l'Action
   ↓
Action (create_user_action.py) → logique métier : vérifie unicité, hash le mdp, sauvegarde
   ↓
Resource (user_resource.py) → formate la réponse (sans données sensibles)
   ↓
Réponse JSON envoyée au frontend


FRONTEND