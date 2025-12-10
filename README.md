# ✅ Application d'Inventaire Rapide TGCF 2025

Une application web ultra-légère développée en **PHP 8.3 (Native)** et **JavaScript** pour optimiser la saisie d'inventaire en entrepôt. Elle permet aux opérateurs de scanner des articles en rafale via des terminaux mobiles (douchettes), de quantifier rapidement les stocks et de centraliser les données en temps réel.

---

## ✨ Fonctionnalités principales

🚀 **Interface "Single Page" ultra-rapide sans rechargement de page**  
🆔 **Authentification instantanée par scan de badge utilisateur (Format U...)**  
📦 **Saisie "Scan & Pick" : détection automatique et ouverture de modale**  
🔢 **Saisie des quantités optimisée (Clavier ou boutons tactiles +/-)**  
❌ **Gestion des erreurs : annulation de scan et suppression de lignes**  
🌗 **Mode Sombre (Dark Mode) pour économie de batterie et confort visuel**   
✅ **Validation par lots vers SQL Server (Transactions sécurisées)**  
🔔 **Notifications visuelles et sonores claires (SweetAlert2)**  

---

## 🛠️ Technologies utilisées

| Technologie         | Usage principal                                 |
|---------------------|--------------------------------------------------|
| PHP 8.3 (FPM)       | Backend léger, gestion BDD, Drivers ODBC        |
| Microsoft SQL Server| Base de données                                 |
| Bootstrap 5.3       | Interface moderne et rapide                     |
| JavaScript          | Logique client, gestion des scans, DOM          |
| SweetAlert2         | Gestion des alertes et pop-ups esthétiques      |
| Docker              | Conteneurisation (Image custom PHP + Drivers MS)|
| Nginx               | Serveur web et Reverse Proxy                    |

---

## 🖥️ Accès à l'application

**Environnement entreprise interne**  
📍 `http://appinventaire.web-tgcf.domaine.local`

*Accessible uniquement depuis le réseau interne TGCF (WiFi Entrepôt / LAN)*

---

## 📚 Flux d'utilisation

Le processus est simplifié pour une efficacité maximale :
- **Login** : Scan du badge personnel.
- **Scan** : Bip produit → Modale quantité → Validation.
- **Review** : Vérification visuelle de la liste temporaire.
- **Validation** : Envoi global vers le serveur et retour à l'écran de login.


---

## 👨‍💻 Auteur

Développé par **Rémi Gentil**  
🎓 Étudiant en **BUT Informatique – 3ᵉ année**  
📍 IUT de Bayonne – Université de Pau et des Pays de l’Adour  
💼 Alternant Assistant Développeur d’applications – The Gill Corporation France

---

## 🗂️ Déploiement

L’application est déployée via Docker, avec :
- Conteneur dédié **PHP-FPM** avec drivers **ODBC 18**
- SQL Server comme base de données
- Accès via URL internes (intranet)
- Versionné avec GitHub privé

---

## 📩 Contact

📧 [rgentil@thegillcorp.fr](mailto:rgentil@thegillcorp.fr)  
🔗 [LinkedIn](https://www.linkedin.com/in/remi-gentil) • [GitHub](https://github.com/remi-gntl)

---

> Ce projet a été conçu dans le cadre de l'alternance au sein de The Gill Corporation – France pour moderniser et accélérer les processus logistiques d'inventaire.
