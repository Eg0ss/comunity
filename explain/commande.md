SE CONNECTER A LA BASE DE DONNEES
psql -U postgres -h 127.0.0.1 -d community_db


-- Lister toutes les tables de la base
\dt

-- Voir la structure d'une table (colonnes, types, contraintes)
\d users

-- Voir TOUTES les colonnes de tous les utilisateurs
SELECT * FROM users;

-- Voir seulement certaines colonnes (plus lisible, sans le password_hash)
SELECT id, full_name, username, email, provider, created_at FROM users;

-- Compter combien d'utilisateurs existent
SELECT COUNT(*) FROM users;

-- Voir le dernier utilisateur inscrit
SELECT * FROM users ORDER BY created_at DESC LIMIT 1;

-- Chercher un utilisateur précis par email
SELECT * FROM users WHERE email = 'ton.email@exemple.com';