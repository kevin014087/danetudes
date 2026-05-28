# 🚀 Déploiement DANETUDES sur Namecheap

**Guide complet pour déployer ton site statique sur Namecheap cPanel**

---

## 📋 Prérequis

- ✅ Domaine acheté sur Namecheap (ex: `danetudes.ci`)
- ✅ Shared Hosting Namecheap activé
- ✅ Accès cPanel
- ✅ Credentials FTP/SFTP

---

## 🎯 Étape 1: Accéder à cPanel

1. Va sur **namecheap.com** → **Dashboard**
2. Sélectionne ton domaine
3. Clique **Manage** → **Advanced DNS**
4. Note l'IP (ou utilise **cPanel URL** depuis Namecheap)
5. Accès cPanel direct: `https://tuip:2083` ou `https://danetudes.ci:2083`

**Login cPanel**:
- Username: `cpaneluser` (fourni par Namecheap)
- Password: (le mot de passe Namecheap)

---

## 📁 Étape 2: Préparer tes fichiers

**Structure à uploader sur Namecheap** :

```
public_html/
├── index.html
├── contact.html
├── services.html
├── offres.html
├── about.html
├── .htaccess
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    ├── js/
    └── images/
```

**À NE PAS uploader** :
- ❌ `node_modules/`
- ❌ `.env`
- ❌ `.git/`
- ❌ `package.json` (optionnel)
- ❌ `render.yaml`
- ❌ Les anciens fichiers Node.js

---

## 🔒 Étape 3: Upload via FTP/SFTP

### Option A: FileZilla (Gratuit & Facile) ⭐

**Télécharger**: https://filezilla-project.org/

**Configuration**:
1. Ouvre FileZilla
2. **File** → **Site Manager**
3. Crée un nouveau site:
   ```
   Host: tudomaine.ci (ou FTP host de Namecheap)
   Protocol: SFTP (plus sûr que FTP)
   Username: cpaneluser
   Password: ton_mot_de_passe
   Port: 22 (SFTP) ou 21 (FTP)
   ```
4. Clique **Connect**

**Upload des fichiers**:
1. À gauche: cherche ta folder locale
2. À droite: `public_html/`
3. Drag & drop les fichiers
4. ✅ Attends que tout soit uploadé

### Option B: cPanel File Manager

1. Connecte-toi à cPanel
2. **Files** → **File Manager**
3. Navigue vers `public_html/`
4. **Upload** → sélectionne tes fichiers

---

## 🌐 Étape 4: Vérifier la configuration

### Dans cPanel:

**1. Vérifie le DocumentRoot**
- Doit pointer vers: `public_html/`

**2. Configure le .htaccess**
- Ton fichier `.htaccess` est déjà uploadé ✅
- Il configure:
  - Force HTTPS
  - Protection des fichiers sensibles
  - Headers de sécurité
  - Désactive directory listing

**3. Active SSL (HTTPS)**
- Dans cPanel → **SSL/TLS**
- Clique **Manage SSL Sites**
- Sélectionne ton domaine
- Clique **Auto-Configure**
- Namecheap offre Let's Encrypt gratuit ✅

---

## ✅ Étape 5: Tester le site

1. Va sur `https://danetudes.ci` (ou ton domaine)
2. Vérifie que:
   - ✅ index.html charge
   - ✅ Les assets (CSS/images) s'affichent
   - ✅ Les liens internes marchent
   - ✅ HTTPS fonctionne 🔒
   - ✅ Le formulaire de contact répond

---

## 📧 Étape 6: Configurer Formspree (pour les emails)

Le formulaire utilise **Formspree** (gratuit).

**Action du formulaire** :
```html
<form action="https://formspree.io/f/xdkyqxpq" method="POST">
```

**C'est déjà configuré !** Les emails iront à `dkouassi0805@gmail.com`

**Vérifie**:
1. Va sur https://formspree.io
2. Connexion avec ton email
3. Confirme le formulaire (email de vérification)
4. Envoie un test via contact.html

---

## 🔄 Étape 7: Mise à jour du site

**Quand tu veux ajouter du contenu**:

1. **Localement** → modifie les fichiers HTML/CSS/JS
2. **Git** → commit et push
   ```bash
   git add -A
   git commit -m "Update content"
   git push origin main
   ```
3. **Namecheap** → Upload via FTP les fichiers modifiés
   - Ouvre FileZilla
   - Drag & drop les fichiers modifiés
   - C'est live immédiatement ! 🚀

---

## 🐛 Troubleshooting

### ❌ Erreur 404
**Cause** : Les fichiers ne sont pas dans `public_html/`  
**Solution** : Vérifiez que tout est dans `public_html/` via cPanel File Manager

### ❌ CSS/Images ne s'affichent
**Cause** : Chemins relatifs incorrects  
**Solution** : Assure-toi que les chemins sont relatifs
```html
<!-- ✅ Correct -->
<link rel="stylesheet" href="assets/css/style.css">
<img src="assets/images/logo.webp" alt="">

<!-- ❌ Incorrect -->
<link rel="stylesheet" href="/assets/css/style.css">
```

### ❌ Formulaire ne fonctionne pas
**Cause** : Formspree pas confirmé  
**Solution** : 
1. Va sur https://formspree.io/f/xdkyqxpq
2. Confirme ton email
3. Envoie un test depuis contact.html

### ❌ HTTPS ne fonctionne pas
**Cause** : SSL non activé  
**Solution** : Dans cPanel → SSL/TLS → Auto-Configure SSL

### ❌ Fichiers .htaccess ignorés
**Cause** : mod_rewrite pas activé  
**Solution** : Dans cPanel → **MultiPHP INI Editor** → Active `mod_rewrite`

---

## 📊 Performance

**Optimisations intégrées**:
- ✅ Assets: CSS/JS minifiés (contrôle dans assets/)
- ✅ Images: WebP format (léger & rapide)
- ✅ Compression: gzip automatique via Namecheap
- ✅ Caching: Headers HTTP configurés

---

## 🔐 Sécurité

**Protections actives** (.htaccess):
- ✅ HTTPS forcé
- ✅ Headers de sécurité (X-Frame-Options, etc.)
- ✅ Protection des fichiers sensibles (.env, .htaccess, etc.)
- ✅ Pas de directory listing

---

## 💰 Coûts Namecheap

| Item | Coût | Notes |
|------|------|-------|
| Domaine .ci | $9-15/an | Renouvelable |
| Shared Hosting | $2-5/mois | Dépend du plan |
| SSL (HTTPS) | **GRATUIT** | Let's Encrypt |
| Emails | **GRATUIT** | Formspree |
| **Total** | **$30-75/an** | Très abordable |

---

## 🚀 Déploiement résumé

```
1. Upload fichiers via FTP vers public_html/ (10 min)
2. Active SSL dans cPanel (2 min)
3. Teste le site (5 min)
4. Configure Formspree si nécessaire (2 min)
5. ✅ C'est live !
```

---

## 📚 Ressources

- **Namecheap Help**: https://www.namecheap.com/support/
- **cPanel Docs**: https://docs.cpanel.net/
- **Formspree**: https://formspree.io/docs/
- **Apache .htaccess**: https://httpd.apache.org/docs/current/howto/htaccess.html

---

## ✨ Bon déploiement !

Des questions ? Consulte le chat ou les ressources ci-dessus 🎉

**Prochain pas** : Achète ton domaine sur Namecheap et active l'hébergement !
