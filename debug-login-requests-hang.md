[OPEN] Debug session: login-requests-hang

## Symptômes
- Chargement infini lors de la connexion et/ou de n’importe quelle requête côté frontend.
- Aucun retour visible (pas d’erreur affichée, pas de réponse).

## Hypothèses (falsifiables)
- A: Le backend n’est pas joignable (URL/port/HTTP vs HTTPS) → requêtes bloquées ou en attente.
- B: Problème CORS / preflight OPTIONS qui échoue → le navigateur bloque la requête.
- C: Le frontend lance bien la requête mais ne “résout” jamais la promesse (pas de return/await, catch sans finally) → loading jamais remis à false.
- D: Intercepteur Axios / couche API avale l’erreur ou pend sur un token refresh → UI reste en loading.
- E: Le backend reçoit la requête mais ne répond pas (handler bloqué, deadlock DB, exception non propagée) → pending côté client.

## Plan d’évidence
- Instrumenter Axios (request/response/error) côté frontend vers le Debug Server.
- Instrumenter l’entrée backend (middleware) pour confirmer réception + temps de réponse.
- Reproduire “Connexion” et comparer logs client vs serveur (pre-fix).

