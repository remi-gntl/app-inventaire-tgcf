# ✅ Application d'Inventaire Rapide TGCF 2025

Une application web **ultra-légère** développée en **PHP 8.3 (Native)** et **JavaScript** pour optimiser la saisie d'inventaire en entrepôt.  
Elle permet aux opérateurs de scanner des articles en rafale via des terminaux mobiles (douchettes), de quantifier les stocks et de sécuriser les données **instantanément**.

---

## ✨ Fonctionnalités principales

📱 **Mode PWA (Progressive Web App)**  
Installation native sur PDT Android, fonctionnement en plein écran (sans barre d’URL).

⚡ **Enregistrement immédiat (Direct Sync)**  
Chaque scan validé est envoyé instantanément en base SQL Server afin d’éviter toute perte de données.

🚀 **Interface "Single Page" ultra-réactive**  
Aucune latence, fonctionnement entièrement en assets locaux (pas de CDN, compatible intranet strict).

⌨️ **Gestion clavier optimisée pour les scans**  
Champs en `readonly` pour empêcher l’ouverture intempestive du clavier virtuel lors de l’utilisation des douchettes.

📜 **Historique visuel en temps réel**  
Affichage immédiat des derniers articles scannés et validés à l’écran.

🆔 **Authentification instantanée**  
Connexion utilisateur via scan de badge personnel (format `U...`).

🌗 **Mode Sombre (Dark Mode)**  
Interface adaptative pour le confort visuel et l’économie de batterie.

---   

## 🛠️ Technologies utilisées

| Technologie            | Usage principal                                              |
|------------------------|--------------------------------------------------------------|
| PHP 8.3 (FPM)          | Backend léger, gestion BDD, drivers ODBC                    |
| Microsoft SQL Server   | Base de données (intégration ERP)                            |
| Bootstrap 5.3          | Interface responsive (CSS uniquement)                       |
| JavaScript             | Logique client, gestion des scans, DOM                      |
| PWA (Manifest + SW)    | Mode application native & plein écran                      |
| Docker                 | Conteneurisation (image custom PHP + drivers Microsoft SQL) |
| Nginx                  | Serveur web et reverse proxy                                |

---

## 🖥️ Accès à l'application

**Environnement entreprise interne**  
📍 `http://appinventaire.web-tgcf.domaine.local`

🔒 Accessible uniquement depuis le réseau interne **TGCF** (WiFi Entrepôt / LAN)

> ⚠️ **Note**  
> Le mode PWA sur réseau local HTTP nécessite l’activation des  
> **Insecure Origins** dans `chrome://flags`.

---

## 📚 Flux d'utilisation

Le processus a été sécurisé pour garantir l’intégrité des données à chaque étape :

1. **Login**  
   Scan du badge personnel utilisateur.

2. **Scan produit**  
   Bip produit → ouverture automatique de la modale.

3. **Saisie**  
   Ajustement de la quantité → validation (bouton ou touche *Entrée*).

4. **Enregistrement**  
   Envoi immédiat des données vers le serveur SQL Server.

5. **Feedback visuel**  
   Ajout instantané à l’historique affiché à l’écran avec confirmation visuelle.

---

## 👨‍💻 Auteur

Développé par **Rémi Gentil**  

🎓 Étudiant en **BUT Informatique – 3ᵉ année**  
📍 IUT de Bayonne – Université de Pau et des Pays de l’Adour  
💼 Alternant **Assistant Développeur d’applications** – The Gill Corporation France

---

## 🗂️ Déploiement

L’application est déployée via **Docker**, intégrée à l’architecture multi-applications :

- Conteneur dédié **PHP-FPM** avec drivers **ODBC 18**
- Base de données **Microsoft SQL Server**
- Accès via URLs internes (intranet)
- Versionnement via **GitHub privé**

---

## 📩 Contact

📧 [rgentil@thegillcorp.fr](mailto:rgentil@thegillcorp.fr)  
🔗 [LinkedIn](https://www.linkedin.com/in/remi-gentil) • [GitHub](https://github.com/remi-gntl)


---

> Ce projet a été conçu dans le cadre de l’alternance au sein de  
> **The Gill Corporation – France** afin de moderniser et d’accélérer  
> les processus logistiques d’inventaire.
