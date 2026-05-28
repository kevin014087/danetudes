# 🚀 Guide de Déploiement sur Render

## Prérequis
- Compte Render.com
- Repository GitHub connecté
- Fichier `render.yaml` à la racine

## 📋 Étapes de déploiement

### 1. Connecter le repository à Render
1. Allez sur [render.com](https://render.com)
2. Cliquez sur **New +** → **Web Service**
3. Sélectionnez **Build and deploy from a Git repository**
4. Connectez votre compte GitHub
5. Cherchez et sélectionnez `artisanci917-create/danetudes`

### 2. Configuration dans Render
- **Name**: `danetudes-web` (auto-rempli)
- **Environment**: Node (auto-détecté)
- **Branch**: `main`
- **Build Command**: `npm install` (auto-détecté)
- **Start Command**: `npm start` (auto-détecté)

### 3. Variables d'environnement
Après création du service, allez dans **Environment** et ajoutez :

```
NODE_ENV=production
PORT=3000
RECIPIENT_EMAIL=dkouassi0805@gmail.com
RECIPIENT_NAME=DANETUDES
SITE_NAME=DANETUDES
SITE_URL=https://votre-app.onrender.com
ALLOWED_ORIGINS=https://votre-app.onrender.com,https://danetudes.ci

# Configuration SMTP (Mailtrap, Gmail, etc.)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=votre_username
SMTP_PASS=votre_password

# Rate limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=3600

# Debug
DEBUG_MODE=false
```

### 4. Disque persistant (optionnel mais recommandé)
Render offre un disque pour les données persistantes :
- **Disk Name**: `data`
- **Mount Path**: `/opt/render/data`
- **Size**: 1 GB (minimum gratuit)

Le fichier `render.yaml` est déjà configuré pour cela.

## 🔧 Configuration render.yaml

Le fichier `render.yaml` définit :
- ✅ Web service Node.js
- ✅ Variables d'environnement
- ✅ Auto-déploiement sur push
- ✅ Disque persistant pour les données JSON

## 📊 Structure des données

Les fichiers JSON sont stockés dans :
- **Local**: `./data/`
- **Render**: `/opt/render/data/data/` (via le disque monté)

Fichiers :
- `offres.json` - Catalogue des offres
- `planning.json` - Calendrier des événements
- `testimonials.json` - Témoignages clients
- `contacts.json` - Messages de contact

## 🌐 URL de production

Votre app sera accessible sur :
```
https://votre-app-name.onrender.com
```

## ⚠️ Limitations gratuites Render

| Feature | Limite |
|---------|--------|
| Uptime | 99.5% |
| Inactivité | 15 min → sleep |
| Disque | 1 GB |
| RAM | 512 MB |
| Bandwidth | Illimité |

**Note**: Les services gratuits s'endorment après 15 min d'inactivité. Upgrade pour l'uptime 24/7.

## ✅ Vérification du déploiement

1. Rendez-vous sur votre app Render
2. Testez les endpoints :
   ```bash
   curl https://votre-app.onrender.com/api/offres
   curl https://votre-app.onrender.com/api/planning
   ```
3. Consultez les logs dans **Logs** de Render
4. Vérifiez les variables d'env dans **Environment**

## 🔐 Sécurité

- ✅ HTTPS automatique (certificat SSL gratuit)
- ✅ Variables d'env sécurisées
- ✅ Rate limiting activé
- ✅ CORS configuré
- ✅ Headers de sécurité

## 📞 Support

- Docs Render : https://render.com/docs
- Statut : https://status.render.com
- Contact : support@render.com

## 🎯 Prochaines étapes

1. ✅ Commit les changements
2. ✅ Push sur GitHub
3. ✅ Créer le service sur Render
4. ✅ Configurer les variables d'env
5. ✅ Tester les endpoints
6. ✅ Mettre à jour SITE_URL en production

---

**Besoin d'aide ?** Consultez les logs Render pour les erreurs de déploiement.
