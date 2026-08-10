# AR3AR.ma — Moroccan Real Estate Platform (عقار)

Enterprise-grade real estate marketplace for the Moroccan property market: Residential (Dyor), Land (Aradi), Commercial, and Riads — with legal-status verification, multi-gateway monetization (CMI + Stripe), and an automated WhatsApp Business lead engine.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, SSR/SSG hybrid) |
| Language | TypeScript (strict) |
| Styling / UI | Tailwind CSS, shadcn-style primitives, Framer Motion, Lucide |
| Data fetching / State | TanStack Query, Zustand (persisted filter store) |
| Auth / RBAC | NextAuth.js (JWT) — roles: `ADMIN`, `AGENT`, `BUYER` |
| Database / ORM | PostgreSQL + Prisma (spatial + filtering indexes) |
| Queue / Jobs | Redis + BullMQ (WhatsApp, payments, promotion cron) |
| Messaging | WhatsApp Business Cloud API (Meta Graph) |
| Payments | CMI (MAD, SHA-512 hash) + Stripe (multi-currency, MAD→EUR mapping) |
| Search | Meilisearch with PostgreSQL FTS fallback |
| Maps | Leaflet / OpenStreetMap with marker clustering |
| Media | Cloudinary (automatic WebP conversion) |
| Invoicing | jsPDF (PDF receipts for agents) |

## Quick Start

```bash
# 1. Infrastructure (PostgreSQL, Redis, Meilisearch)
docker compose up -d

# 2. Environment
Copy-Item .env.example .env      # then fill in secrets

# 3. Database
npm install
npx prisma generate
npx prisma db push                # or: npx prisma migrate dev
npx prisma db seed                # regions/cities, amenities, packages, demo users

# 4. Run
npm run dev                       # http://localhost:3000
npm run worker                    # separate terminal: BullMQ workers + cron
```

Demo users (seeded): `admin@ar3ar.ma` / password from `ADMIN_SEED_PASSWORD` (default `ChangeMe!2024`), and `agent.demo@ar3ar.ma` / `Agent@12345`.

## Folder Structure (Clean / Modular Architecture)

```
prisma/
  schema.prisma                   # full data model (see below)
  seed.ts                         # Moroccan geography, amenities, packages, users
src/
  app/
    page.tsx                      # landing (SSR featured listings)
    (dashboard)/                  # route group for RBAC panels
      layout.tsx                  # session guard + sidebar
      agent/                      # overview, listings, leads, promote
      admin/                      # revenue analytics, payment log, moderation
    properties/                   # search page (SSR + client filtering), detail
    api/
      properties/                 # GET dynamic filter engine / POST create listing
      locations/                  # region -> city -> neighborhood tree
      leads/                      # website lead intake -> agent WhatsApp dispatch
      payments/
        checkout/                 # unified CMI/Stripe initiation (RBAC + rate limit)
        cmi/callback/             # CMI server callback (HMAC verify + reconcile)
        stripe/checkout/          # Stripe Checkout session (MAD->EUR)
        stripe/webhook/           # Stripe webhook (signature verify)
      webhooks/whatsapp/          # Meta webhook (verify, ack, enqueue)
      admin/listings/[id]/        # moderation approve/reject (ADMIN)
      auth/[...nextauth]/         # NextAuth credentials provider
  features/                       # domain modules
    properties/
      server/property-queries.ts  # Prisma where-builder + sort + serialize
      api/client.ts               # client fetchers
      hooks/                      # useProperties, useLocations, useFilterStore
      components/property-filters.tsx
    payments/
      server/payment.service.ts   # createCheckout (CMI + Stripe)
      server/promotion.service.ts # applyPromotion, sweepExpiredPromotions, invoicing
      components/promote-dialog.tsx
    whatsapp/
      engine/intent-parser.ts     # budget/city/transaction extraction (Darija/Arabic/French)
      engine/lead-router.ts       # lead creation, routing to agent, bot auto-reply
    scraper/
      avito-parser.ts             # cheerio HTML card extraction (resilient selectors)
      normalizer.ts               # price parsing, category/type mapping, attribute inference
      importer.ts                 # city resolution + upsert/dedup into Property (source+externalId)
      avito-scraper.ts            # HTTP/robots/retry/rate-limit, pagination, proxy support
  scripts/
    scrape-avito.ts               # manual CLI
  workers/                        # BullMQ workers (tsx): whatsapp, payment, promotion, scraper
  lib/                            # db, redis, queues, auth, cmi, stripe, whatsapp, utils, invoice
  types/                          # shared DTOs + next-auth augmentation
middleware.ts                     # route protection (agent/admin)
```

## Core Domain (schema.prisma highlights)

- **User** — `role` (ADMIN/AGENT/BUYER), WhatsApp opt-in, verification, suspension.
- **Property** — transaction (SALE/RENT), rent period, category/type hierarchy, **legal status** (`TITRE_FONCIER`, `MELKIA`, `ADOULAIRE`, `NON_TITRE`), price MAD, plot/built area, density (`R+2`, `R+5`), rooms/bathrooms/parking, GPS `lat/lng` + `mapPolygon`, feature flags, moderation status, and denormalized `isFeatured` / `featuredExpiresAt` / `featuredRank` for fast querying.
- **Region / City / Neighborhood** — Moroccan geography with Arabic names.
- **PackagePlan / Subscription** — featured tiers (7/14/30 days), Top Banner, agent bulk-listing subscriptions.
- **Payment** — agent, property, amount (MAD), provider (`CMI`/`STRIPE`), status machine (PENDING/COMPLETED/FAILED/REFUNDED/CANCELLED), `providerRef`, raw callback payload for audit.
- **Promotion** — tier, duration, `expiresAt`, linked payment; 1:1 with Payment.
- **Lead / WhatsAppLog** — buyer intent from any channel, routing to agent, full message audit.
- **Invoice / AuditLog** — PDF receipts and immutable admin audit trail.

## Filtering Engine

`GET /api/properties` accepts validated (zod) query params — transaction, rent period, category, type, legal status, region/city/neighborhood cascade, `minPrice`/`maxPrice`, `minArea`/`maxArea`/`minBuiltArea`, rooms/bathrooms/parking/floors, density, feature toggles, GPS `bbox`, full-text `q` (Meilisearch or Postgres FTS), and 6 sort modes including `price_per_m2_asc`. Featured listings rank first via `isFeatured DESC, featuredRank DESC`. The client uses React Query + a persisted Zustand filter store, with SSR initial data hydrated into the grid.

## Payments & Promotion Pipeline

1. **Initiate** (`POST /api/payments/checkout`) — RBAC + rate-limited; resolves package price, creates a `Payment` (PENDING), then:
   - **CMI**: builds the signed SHA-512 form (`clientid`, `amount`, `oid`, `currency=504`, `storetype=3d_pay`, `hash`…) and POSTs to the gateway (3-D Secure).
   - **Stripe**: creates a Checkout Session. Stripe does not settle MAD, so the price is mapped to EUR (`STRIPE_MAD_TO_EUR_RATE`) with the original MAD amount kept in metadata.
2. **Confirm** — CMI `callback` verifies the `HASH` over `HASHPARAMS/HASHPARAMSVAL` with timing-safe compare; Stripe `webhook` verifies the `stripe-signature`. Both mark the payment COMPLETED and enqueue `payment.complete`.
3. **Apply** — the payment worker runs `applyPromotion`: sets `isFeatured`, computes `featuredExpiresAt`, creates the `Promotion`, generates a PDF invoice, upserts the Meilisearch index, and writes an audit log.
4. **Expiry** — an hourly BullMQ cron (`promotion.sweep`) demotes any listing whose `featuredExpiresAt` has passed.

## WhatsApp Lead Engine

- Meta webhook (`/api/webhooks/whatsapp`) verifies `X-Hub-Signature-256`, acknowledges instantly, and enqueues `wa.inbound` to avoid Meta retries.
- The worker parses intent (cities in Arabic/French/Darija, budget amounts, `#property-ref`), creates a `Lead`, auto-replies with up to 3 matching properties (deep links `wa.me/?text=…` pre-filled with title/price/URL), and forwards the lead to the target agent's WhatsApp.
- Every message in/out is recorded in `WhatsAppLog` (message id, direction, payload, delivery status).

## Web Scraping (Avito.ma)

A full import pipeline turns Avito.ma listings into your own `Property` rows:

1. **Fetch** — robots.txt aware, retries with backoff on 429/5xx, polite delay between pages.
2. **Parse** — cheerio extracts cards (title, price, location, image) using resilient selectors.
3. **Normalize** — parses prices (`"2 500 000 DH"`), maps Avito categories → your enums, infers rooms/bathrooms/area/furnished from title text.
4. **Import** — resolves the listing city against your `City` table (accent-insensitive), dedups via the `@@unique([source, externalId])` constraint, and upserts under a system owner (`scraper@ar3ar.ma`).

```bash
# Manual run (single page, imports as ACTIVE)
npm run scrape:avito -- --url=https://www.avito.ma/ma/appartements-a-vendre/

# 3 pages, import as PENDING_REVIEW for admin approval
npm run scrape:avito -- --url=https://www.avito.ma/ma/terrains-a-vendre/ --pages=3 --moderate

# Dry-run (parse & normalize only, no DB writes)
npm run scrape:avito -- --url=<url> --dry-run --verbose
```

Scheduled scraping: set `SCRAPER_URL` in `.env` and the `worker` process registers a BullMQ cron (`scraper.avito`, every 6h) that imports as `PENDING_REVIEW`.

> **Note on Avito's bot protection:** `avito.ma` is behind a Cloudflare managed challenge, so a plain HTTP client gets `403`. The scraper detects this and reports it clearly. To actually pull listings, set `SCRAPER_PROXY_URL` to a residential proxy or a scraping-service endpoint (e.g. `http://user:pass@host:port`), which routes the fetches through an IP/network Cloudflare will accept. Selectors may need tuning if Avito's markup changes — use `--verbose` to inspect.

## Security

- PCI-DSS-aware: no raw card data ever touches the server (gateway-hosted payments).
- HMAC/SHA-512 verification on CMI callbacks; `stripe-signature` verification on Stripe webhooks; `X-Hub-Signature-256` on WhatsApp.
- Rate limiting (Redis token bucket) on lead intake and payment endpoints.
- RBAC enforced in `middleware.ts`, route guards (`requireRole`), and server-side ownership checks (agents can only promote their own ACTIVE listings).
