
# 💑 DuoAccount - Martin & Joséphine

DuoAccount est votre application privée pour gérer vos dépenses communes en toute simplicité.

## 🚀 Guide de mise en ligne (Pour Martin)

### 1. Synchronisation GitHub
Si le bouton "Sync to GitHub" affiche une erreur :
- Fermez la fenêtre de sync et réouvrez-la.
- Cliquez sur **"Connectez-vous à GitHub"**.
- Si rien ne se passe, vérifiez que votre navigateur autorise les **pop-ups**.
- Une fois connecté, choisissez **"Create new repository"** et nommez-le `duo-account`.

### 2. Déploiement Netlify
Une fois le code sur GitHub :
1. Allez sur [Netlify.com](https://app.netlify.com/).
2. **Import from Git** -> Sélectionnez `duo-account`.
3. Laissez les réglages par défaut et cliquez sur **Deploy**.
4. Copiez l'URL (ex: `https://votre-nom.netlify.app`) et envoyez-la à Joséphine !

## 🔐 Configuration pour Joséphine
1. Joséphine ouvre l'URL Netlify sur son téléphone/ordinateur.
2. Elle va dans les **Settings** (roue dentée).
3. Elle remplace son **DuoID** par le vôtre (ex: `martin-josephine-XXXX`).
4. Elle clique sur **Enregistrer**.
5. **C'est fini !** Vous voyez désormais les mêmes dépenses en temps réel.

---
*Note technique : L'app utilise Supabase pour le stockage Cloud. Les clés sont dans `lib/supabase.ts`.*
