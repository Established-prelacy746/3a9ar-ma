# 3A9AR.ma

[![CI](https://github.com/soufianeoi/3a9ar-ma/actions/workflows/ci.yml/badge.svg)](https://github.com/soufianeoi/3a9ar-ma/actions)
[![GitHub release](https://img.shields.io/github/v/release/soufianeoi/3a9ar-ma)](https://github.com/soufianeoi/3a9ar-ma/releases)
[![License](https://img.shields.io/github/license/soufianeoi/3a9ar-ma)](https://github.com/soufianeoi/3a9ar-ma/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/soufianeoi/3a9ar-ma/pulls)
[![GitHub stars](https://img.shields.io/github/stars/soufianeoi/3a9ar-ma?style=social)](https://github.com/soufianeoi/3a9ar-ma/stargazers)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

Moroccan real estate platform. 19,718 properties from Mubawab & Avito, covering 159 cities in 12 regions. FR/EN/AR with full RTL Arabic support.

## What it does

Property search and listing platform built for the Moroccan market. Buyers can search, filter, compare, and contact agents. Agents can manage listings, promote properties, and track leads. Admins get moderation tools and revenue analytics.

**Data:** scraped from Mubawab.ma (19,499 listings) and Avito.ma (219 listings). 159 cities, 12 regions, Arabic neighborhood names.

## Features

- Mortgage calculator with real rates from 6 Moroccan banks (Attijariwafa, BMCE, CIH, BCP, Agdir, Banque Populaire)
- Neighborhood scoring (safety, schools, transport, shopping, nightlife, greenery, noise)
- Price history charts
- Saved searches with email/WhatsApp alerts
- Agent reviews and verified badges
- Side-by-side property comparison (up to 3)
- Area price heatmap on the map
- Document checklist per transaction type (with PDF download)
- Legal status explanations (Titre Foncier, Melkia, etc.)
- Notaire directory with fee calculator
- Foncier verification guide
- Property price estimation based on similar listings
- Dynamic OG images for social sharing (WhatsApp, Facebook, Twitter)
- Agent leaderboard by region
- Auto-translate listings between FR/EN/AR
- Mortgage pre-qualification calculator (33% DTI rule)
- 360° virtual tour viewer
- Darija search (~100 Moroccan dialect terms mapped)
- Quick WhatsApp inquiry templates
- AR property preview (concept)

## Payments

CMI (Moroccan gateway, MAD) and Stripe (international, EUR). Featured listings, Top Banner promotions, agent subscriptions. PDF invoices.

## WhatsApp

Business Cloud API for lead routing. Understands Darija/Arabic/French. Auto-replies with matching properties.

## Tech

Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Redis, BullMQ, Meilisearch, Leaflet, Cloudinary, NextAuth, Zustand, React Query, Framer Motion.

## Running it

### Docker

```bash
git clone https://github.com/soufianeoi/3a9ar-ma.git
cd 3a9ar-ma
cp .env.example .env    # fill in your keys
docker compose up -d
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
# http://localhost:3000
```

### Local

```bash
npm install
docker compose up -d postgres redis meilisearch
cp .env.example .env
npx prisma generate && npx prisma db push && npx prisma db seed
npm run dev    # http://localhost:3000
```

Services: app (3000), postgres (5432), redis (6379), meilisearch (7700).

**Demo accounts:**
- admin@3a9ar.ma / ChangeMe!2024
- agent.demo@3a9ar.ma / Agent@12345

## Scraping

```bash
npm run scrape:mubawab
npm run scrape:avito -- --url=<url>
npm run scrape:avito -- --url=<url> --pages=3 --moderate
```

Avito needs a proxy (`SCRAPER_PROXY_URL` in .env) because of Cloudflare. Mubawab works directly.

## Security

No raw card data on server. HMAC verification on CMI/Stripe/WhatsApp webhooks. Rate limiting on leads and payments. RBAC in middleware.

## License

Private.
