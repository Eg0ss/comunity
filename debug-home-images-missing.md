[OPEN] Debug session: home-images-missing

## Symptômes
- Les images des posts et le logo ne s’affichent pas dans le navigateur.

## Hypothèses
- A: Les URLs d’images renvoient du HTML / redirections / 401-403 (hotlink) au lieu d’un contenu image.
- B: Problème de réseau/CORS ou blocage navigateur empêchant le chargement des images externes.
- C: Les requêtes image aboutissent, mais l’UI les masque (CSS/tailles/overflow) ou altère l’affichage.
- D: Les URLs sont correctes mais l’environnement (dev/prod) ou Vite réécrit/empêche certaines sources externes.

## Plan de collecte d’évidence
- Instrumenter les balises `<img>` (logo + images de PostCard) avec des handlers `onLoad`/`onError` qui reportent status + URL au Debug Server.
- Reproduire dans le navigateur et analyser les logs.

