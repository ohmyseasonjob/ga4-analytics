# OhMySeason Analytics Dashboard

Dashboard Next.js connecté aux vraies APIs : GA4, Google Ads, Meta Ads.

![Dashboard Preview](./preview.png)

## 🚀 Quick Start

```bash
# 1. Cloner le repo
git clone <repo-url>
cd ohmyseason-dashboard

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec tes credentials

# 4. Lancer en dev
npm run dev
```

Ouvre http://localhost:3000

---

## 🔧 Configuration requise

### 1. Google Cloud Console (GA4 + Google Ads)

1. Va sur https://console.cloud.google.com
2. Crée un nouveau projet ou utilise un existant
3. Active les APIs :
   - Google Analytics Data API
   - Google Ads API
4. Configure OAuth 2.0 :
   - Credentials → Create credentials → OAuth client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copie Client ID et Client Secret dans `.env.local`

### 2. Meta for Developers (Meta Ads)

1. Va sur https://developers.facebook.com
2. Crée une app (type: Business)
3. Ajoute le produit "Marketing API"
4. Configure OAuth :
   - Settings → Basic → App ID & App Secret
   - Add Platform → Website → `http://localhost:3000`
5. Permissions nécessaires : `ads_read`, `ads_management`

### 3. Variables d'environnement

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# GA4
GA4_PROPERTY_ID=properties/XXXXXXXXX

# Google Ads
GOOGLE_ADS_CUSTOMER_ID=1784439223
GOOGLE_ADS_DEVELOPER_TOKEN=xxx
GOOGLE_ADS_LOGIN_CUSTOMER_ID=1784439223

# Meta
META_APP_ID=xxx
META_APP_SECRET=xxx
META_AD_ACCOUNT_ID=act_1503737134049222
```

---

## 📊 Features

### Vue Globale
- 4 KPIs principaux (Sessions, Users, CTA Clics, RDV Calendly)
- Taux de conversion global
- Performance par Landing Page
- Funnel de conversion
- Status des sources de tracking

### Vue GA4
- 5 KPIs (Sessions, Users, Pages/Session, Durée moy, Taux rebond)
- CTA Clicks par position
- Section Views
- Scroll Depth
- Time on Page
- FAQ Interactions

### Vue Contentsquare
- 4 KPIs UX (Scroll moyen, Temps engagement, Rage clicks, Dead zones)
- Zones d'attention (heatmaps)
- Insights Session Recordings
- Lien externe vers CS

### Vue Meta Ads
- 5 KPIs (Dépense, Impressions, Reach, Clics, CPC)
- Performance par Campagne
- Performance par Creative
- Performance par Audience
- Performance par Placement

### Vue Google Ads
- Remarketing Audience
- Checklist configurations manquantes
- Guide de setup conversions

---

## 🔌 API Routes

| Route | Description |
|-------|-------------|
| `/api/auth/[...nextauth]` | NextAuth OAuth handlers |
| `/api/ga4?type=overview` | GA4 data (overview, cta-clicks, sections...) |
| `/api/meta-ads?type=campaigns` | Meta Ads data |
| `/api/google-ads?type=keywords` | Google Ads data |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v4
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **APIs**: 
  - Google Analytics Data API
  - Google Ads API
  - Meta Marketing API

---

## 📁 Structure

```
ohmyseason-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── ga4/
│   │   ├── google-ads/
│   │   └── meta-ads/
│   ├── (dashboard)/
│   │   ├── global/
│   │   ├── ga4/
│   │   ├── contentsquare/
│   │   ├── meta/
│   │   └── google-ads/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── charts/
│   └── dashboard/
├── lib/
│   ├── auth.ts
│   ├── ga4.ts
│   ├── google-ads.ts
│   ├── meta.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── .env.example
```

---

## 🎨 Palette de couleurs

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#09090B` | Page background |
| Card | `#18181B` | Card backgrounds |
| Border | `#27272A` | Borders |
| Green | `#50F172` | Success, primary accent |
| Cyan | `#07F0FF` | Links, info |
| Pink | `#FD4BAB` | Highlights |
| Yellow | `#FBBF24` | Warnings, GA4 badge |
| Violet | `#A855F7` | Meta/Contentsquare |

---

## 🚧 Limitations

### Contentsquare
Pas d'API publique. Les données doivent être entrées manuellement ou via export CSV.

### Meta Ads
Nécessite une app validée par Meta pour accéder aux données en production.

### Google Ads
Nécessite un Developer Token validé (Basic ou Standard access).

---

## 📝 TODO

- [ ] Ajouter authentification utilisateur
- [ ] Implémenter refresh automatique des données
- [ ] Ajouter export PDF
- [ ] Créer version mobile responsive
- [ ] Ajouter comparaison de périodes
- [ ] Intégrer webhooks pour alertes

---

---

## 🚀 Déploiement Vercel

### Optimisations configurées

Le projet est optimisé pour Vercel avec les configurations suivantes :

#### Performance
- **Standalone output** : Build optimisé pour Vercel
- **SWC minification** : Compilation ultra-rapide
- **Image optimization** : Formats AVIF/WebP avec cache
- **Compression** : Gzip activé
- **Cache headers** : Configuration optimale pour les assets statiques

#### Sécurité
- Headers de sécurité configurés (HSTS, X-Frame-Options, CSP, etc.)
- Protection XSS et clickjacking
- Referrer Policy configurée

#### API Routes
- Timeout configuré : 30 secondes max
- Memory : 1024 MB pour les routes API
- Cache stratégique : 60s pour les données API avec stale-while-revalidate

#### Configuration Vercel

Le fichier `vercel.json` contient :
- Région : `cdg1` (Paris) pour une latence optimale
- Headers de sécurité et cache
- Configuration des fonctions serverless

### Variables d'environnement requises

Dans Vercel, configurez ces variables dans Settings → Environment Variables :

```env
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-secret-nextauth
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
GA4_PROPERTY_ID=properties/XXXXXXXXX
```

### Déploiement

1. Connectez votre repo GitHub à Vercel
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement
4. Le build se lancera automatiquement

### Monitoring

- Utilisez Vercel Analytics pour suivre les performances
- Les logs sont disponibles dans le dashboard Vercel
- Les erreurs sont automatiquement trackées

---

## 📄 License

MIT
