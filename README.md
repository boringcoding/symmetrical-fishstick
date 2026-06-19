# 🌙 Luna — Personal Lunar Calendar

A personalized lunar calendar web app. It shows the real Moon phase for any day,
moonrise/moonset for your city, the Khmer lunar day (កើត / រោច), your zodiac and
live Moon sign, your biorhythms, and daily guidance tailored to the things you
care about (hair, garden, health, money, love). Interface in **English** and
**ខ្មែរ (Khmer)**.

## Stack

| Part      | Tech                                            |
| --------- | ----------------------------------------------- |
| Frontend  | React 18 + Vite + TypeScript + Tailwind         |
| Backend   | NestJS 10 (+ TypeORM)                            |
| Astronomy | [`astronomy-engine`](https://github.com/cosinekitty/astronomy) (no external API) |
| Database  | PostgreSQL (Neon)                               |
| Hosting   | Render (Blueprint in `render.yaml`)             |

Monorepo via npm workspaces:

```
apps/api   NestJS API  (moon math, profiles, insights)
apps/web   React app   (onboarding, today, calendar, profile)
render.yaml  Render Blueprint (API web service + static site)
```

## API

| Method | Path                          | Purpose                                            |
| ------ | ----------------------------- | -------------------------------------------------- |
| GET    | `/api/health`                 | Health check                                       |
| GET    | `/api/moon/day`               | Moon data for a day (`date,lat,lng,tz`)            |
| GET    | `/api/moon/month`             | Phases for a whole month (`year,month,lat,lng,tz`) |
| POST   | `/api/profiles`               | Create a profile                                   |
| GET    | `/api/profiles/:id`           | Read a profile                                     |
| PATCH  | `/api/profiles/:id`           | Update a profile                                   |
| GET    | `/api/insights/:profileId`    | Personalized day (`?date=YYYY-MM-DD`)              |

`tz` is the user's timezone offset in **minutes east of UTC** (e.g. Phnom Penh = `420`).

## Local development

```bash
npm install

# Terminal 1 — API (needs a Postgres URL)
DATABASE_URL='postgres://…' npm run dev --workspace=apps/api

# Terminal 2 — web (proxies /api to :3001)
npm run dev --workspace=apps/web
# open http://localhost:5173
```

> The Moon endpoints work without a database. Profiles & insights need `DATABASE_URL`.

## Deploy on Render

The repo ships a `render.yaml` Blueprint that creates two services:

- **lunar-api** — Node web service (`/api/*`)
- **lunar-web** — static site (the React build)

`CORS_ORIGIN` and `VITE_API_URL` are wired between the two services automatically.
The only secret you set is the Neon connection string.

**Option A — Dashboard (Blueprint):**

1. Render → **New** → **Blueprint** → connect this repository.
2. When prompted, set the **`DATABASE_URL`** secret on `lunar-api` to your Neon
   connection string (`…?sslmode=require`).
3. Apply. Render builds both services; the API auto-creates its tables on first boot.

**Option B — Render API / CI:** see `render.yaml`; create the Blueprint and set
the `DATABASE_URL` environment variable as a secret.

### Notes

- `synchronize: true` is enabled for the MVP so the schema is created
  automatically. For production, switch to migrations.
- Neon must allow connections with SSL (`sslmode=require`), which is the default.
