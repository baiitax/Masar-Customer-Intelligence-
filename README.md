# MASAR Customer Acquisition OS

AI-powered customer intelligence, outreach, automation, and relationship-management platform for Masar's Saudi–Nigeria commercial corridor.

## Technology

- Next.js 16 App Router
- React and TypeScript
- PostgreSQL-ready Prisma schema
- Zod validation
- Auth.js foundation
- BullMQ and Redis worker dependencies
- Nodemailer provider foundation
- Responsive glassmorphism design system

## Included routes

Dashboard, leads, companies, contacts, intelligence, segments, campaigns, outreach, conversations, follow-ups, opportunities, customers, content studio, AI Copilot, analytics, integrations, automation, settings, team, permissions, audit logs, system health, API management, and billing.

## Core engines

- Weighted lead scoring
- Dynamic segment evaluation
- Campaign eligibility and suppression checks
- Response classification and human-review policy
- Event-driven automation evaluation with idempotency keys

## API routes

- `GET /api/leads`
- `POST /api/leads`
- `POST /api/ai/draft`
- `GET /api/health`
- `POST /api/engine/score`
- `POST /api/engine/classify`
- `POST /api/engine/eligibility`

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production configuration

Create `.env.local` from your deployment secret manager and configure at minimum:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
REDIS_URL=redis://...
```

Provider credentials must remain server-side. Never commit OAuth tokens, SMTP passwords, API keys, or AI-provider secrets.

## Development truth

The responsive pages, seed dataset, API validation, scoring, segmentation, eligibility, response classification, and workflow-evaluation logic are implemented. PostgreSQL persistence, OAuth providers, outbound email/social delivery, Redis workers, and external AI are intentionally reported as unconfigured until real infrastructure and credentials are connected and tested.
