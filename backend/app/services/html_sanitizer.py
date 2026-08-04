# app/services/html_sanitizer.py
# Nettoie le HTML produit par l'éditeur Tiptap avant de le stocker en base.
#
# POURQUOI C'EST NÉCESSAIRE : le frontend envoie du HTML "de confiance" (produit
# par notre éditeur), mais rien n'empêche quelqu'un d'appeler directement l'API
# (Postman, script...) avec un contenu du style <script>alert(document.cookie)</script>.
# Sans nettoyage, ce script s'exécuterait dans le navigateur de CHAQUE personne
# qui lit ce post ("XSS stocké") -> on retire tout ce qui n'est pas une balise
# de mise en forme explicitement autorisée.

import bleach

ALLOWED_TAGS = [
    "p", "br", "strong", "em", "u", "s",
    "h1", "h2", "h3",
    "ul", "ol", "li",
    "blockquote",
    "a", "img",
    "code", "pre",
]

ALLOWED_ATTRIBUTES = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title", "width", "height"],
}

ALLOWED_PROTOCOLS = ["http", "https"]


def sanitize_post_content(html: str) -> str:
    if not html:
        return html
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=ALLOWED_PROTOCOLS,
        strip=True,
    )


def html_to_plain_text(html: str) -> str:
    """
    Convertit du HTML (ex: contenu Tiptap) en texte brut lisible, pour construire
    un extrait (excerpt) propre. Insère un espace entre les blocs (paragraphes,
    titres...) pour éviter que "<h2>Titre</h2><p>Texte</p>" devienne "TitreTexte"
    collé sans espace une fois les balises retirées.
    """
    import re
    if not html:
        return ""
    spaced = re.sub(r"</(p|h1|h2|h3|li|blockquote|div|br)>", " ", html, flags=re.IGNORECASE)
    plain = bleach.clean(spaced, tags=[], attributes={}, strip=True)
    return re.sub(r"\s+", " ", plain).strip()