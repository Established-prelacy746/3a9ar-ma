# 3A9AR.ma — منصة العقارات المغربية | Moroccan Real Estate Platform

<p align="center">
  <strong>3A9AR.ma</strong> — The most advanced Moroccan real estate platform<br>
  19,718 properties across 159 cities • Full FR/EN/AR i18n with RTL Arabic • 20 unique features • Docker-ready
</p>

---

## Features

### Core Platform
- **19,718 properties** scraped from Mubawab and Avito across all Morocco
- **159 cities** in **12 regions** with Arabic names (RTL support)
- **Full i18n** — French, English, Arabic with proper RTL layout
- **Advanced filtering** — 20+ filter dimensions with Zustand + React Query
- **Interactive map** — Leaflet/OpenStreetMap with marker clustering
- **Property comparison** — side-by-side compare up to 3 listings

### 20 Unique Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Mortgage Calculator** | 6 Moroccan banks (Attijariwafa, BMCE, CIH, BCP, Agdir, Banque Populaire), amortization schedule |
| 2 | **Neighborhood Score** | Radar chart: safety, schools, transport, shopping, nightlife, greenery, noise |
| 3 | **Price History** | Line chart showing price changes over time |
| 4 | **Saved Searches + Alerts** | Save filters, get email/WhatsApp notifications for new matches |
| 5 | **Agent Reputation** | Reviews, verified badge, response time tracking |
| 6 | **Compare Properties** | Side-by-side comparison table (max 3) |
| 7 | **Area Price Heatmap** | Colored map overlay showing avg price/m² by city |
| 8 | **Document Checklist** | Required documents per transaction type, PDF download |
| 9 | **Legal Status Translator** | Color-coded explanations of Titre Foncier, Melkia, etc. |
| 10 | **Notaire Directory** | 17 notaire offices + fee calculator |
| 11 | **Foncier Checker** | Step-by-step guide to verify property titles |
| 12 | **Property Valuation** | AI-powered price estimation based on similar properties |
| 13 | **Social Sharing** | Dynamic OG images + WhatsApp/Facebook/Twitter share buttons |
| 14 | **Agent Leaderboard** | Top agents ranked by listings, rating, response time |
| 15 | **Multi-language Listings** | Auto-translate listings FR/EN/AR with dictionary |
| 16 | **Mortgage Pre-qualification** | 33% DTI rule, approval likelihood calculator |
| 17 | **Virtual Tour** | 360° panoramic image viewer with mouse/touch drag |
| 18 | **Darija Search** | Search in Moroccan dialect (~100 terms mapped) |
| 19 | **WhatsApp Quick Inquiry** | 4 pre-filled message templates |
| 20 | **AR Property Preview** | WebXR concept for augmented reality visualization |

### Monetization
- **CMI** (Moroccan payment gateway) + **Stripe** (international)
- Featured listings, Top Banner promotions, Agent subscriptions
- PDF invoice generation

### WhatsApp Integration
- Business Cloud API for automated lead routing
- Darija/Arabic/French intent parsing
- Auto-reply with matching properties

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, SSR/SSG) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS, Framer Motion, Lucide Icons |
| State | TanStack Query, Zustand |
| Auth | NextAuth.js (JWT) — ADMIN, AGENT, BUYER roles |
| Database | PostgreSQL + Prisma ORM |
| Cache/Queue | Redis + BullMQ |
| Search | Meilisearch + PostgreSQL FTS fallback |
| Maps | Leaflet / OpenStreetMap |
| Payments | CMI (MAD) + Stripe (EUR) |
| Media | Cloudinary |
| Container | Docker + Docker Compose |

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone
git clone https://github.com/soufianeoi/3a9ar-ma.git
cd 3a9ar-ma

# Configure
cp .env.example .env
# Edit .env with your secrets (NEXTAUTH_SECRET, Stripe, WhatsApp, etc.)

# Start all services
docker compose up -d

# Setup database
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed

# App runs at http://localhost:3000
```

### Option 2: Local Development

```bash
# Prerequisites: Node.js 20+, PostgreSQL, Redis, Meilisearch

# Install dependencies
npm install

# Start infrastructure
docker compose up -d postgres redis meilisearch

# Setup database
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed

# Run dev server
npm run dev           # http://localhost:3000
npm run worker        # Background jobs (separate terminal)
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| app | 3000 | Next.js web application |
| postgres | 5432 | PostgreSQL database (19,718 properties) |
| redis | 6379 | Cache + job queue |
| meilisearch | 7700 | Full-text search engine |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@3a9ar.ma | ChangeMe!2024 |
| Agent | agent.demo@3a9ar.ma | Agent@12345 |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── properties/               # Property search + detail
│   ├── (dashboard)/              # Agent & Admin panels
│   ├── agents/                   # Agent leaderboard
│   └── api/                      # API routes (20+ endpoints)
├── components/
│   ├── features/                 # 20 unique feature components
│   ├── properties/               # Property cards, detail, map, grid
│   ├── dashboard/                # Agent & Admin dashboards
│   └── ui/                       # Reusable UI primitives
├── features/
│   ├── properties/               # Domain logic, queries, hooks
│   ├── payments/                 # CMI + Stripe integration
│   ├── whatsapp/                 # Lead engine, intent parsing
│   └── scraper/                  # Avito/Mubawab import pipeline
├── lib/                          # Auth, DB, Redis, i18n, utils
├── scripts/                      # Scraping + DB scripts
└── workers/                      # BullMQ background workers
prisma/
├── schema.prisma                 # Full data model (25+ models)
└── seed.ts                       # Geography, amenities, users
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | - | Property search with 20+ filters |
| POST | `/api/properties` | AGENT | Create new listing |
| GET | `/api/properties/map` | - | Map-optimized property data |
| GET | `/api/locations` | - | Region > City > Neighborhood tree |
| POST | `/api/leads` | - | Submit buyer lead |
| POST | `/api/payments/checkout` | AGENT | CMI/Stripe checkout |
| POST | `/api/reviews` | - | Submit property review |
| GET | `/api/saved-searches` | USER | List saved searches |
| POST | `/api/valuation` | - | Property price estimation |
| GET | `/api/area-prices` | - | Average price/m² by city |
| GET | `/api/agents/leaderboard` | - | Top agents ranking |
| GET | `/api/og` | - | Dynamic OG image generation |

---

## Database Models (25+)

- **User** — roles (ADMIN/AGENT/BUYER), WhatsApp opt-in, verification
- **Property** — 9 types, 4 legal statuses, GPS coords, feature flags
- **Region / City / Neighborhood** — Moroccan geography with Arabic names
- **NeighborhoodScore** — safety, schools, transport ratings
- **PriceHistory** — property price changes over time
- **SavedSearch** — user filters with notification preferences
- **PropertyReview** — star ratings and comments
- **Payment** — CMI/Stripe with full audit trail
- **Promotion** — Featured/Top Banner tiers
- **Lead / WhatsAppLog** — buyer intent + message audit
- **Invoice / AuditLog** — PDF receipts + immutable audit trail

---

## Security

- PCI-DSS compliant: no raw card data on server
- HMAC/SHA-512 on CMI callbacks
- Stripe signature verification on webhooks
- X-Hub-Signature-256 on WhatsApp webhooks
- Rate limiting on lead + payment endpoints
- RBAC enforced in middleware + route guards

---

## License

Private — All rights reserved.

---

<p align="center">
  Built with passion for the Moroccan real estate market<br>
  <strong>3A9AR.ma</strong> — عقار.ma
</p>
