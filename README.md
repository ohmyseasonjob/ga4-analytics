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
   

### 1. Variables d'environnement

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# GA4
GA4_PROPERTY_ID=properties/XXXXXXXXX
```

---

## 📊 Features

### Vue GA4
- 5 KPIs (Sessions, Users, Pages/Session, Durée moy, Taux rebond)
- CTA Clicks par position
- Section Views
- Scroll Depth
- Time on Page
- FAQ Interactions
---

## 🔌 API Routes

| Route | Description |
|-------|-------------|
| `/api/auth/[...nextauth]` | NextAuth OAuth handlers |
| `/api/ga4?type=overview` | GA4 data (overview, cta-clicks, sections...) |

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
│   ├── (dashboard)/
│   │   ├── ga4/
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

## 📄 License

MIT
