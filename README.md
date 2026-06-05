# Sky Shamba

> **Weather that speaks farmer.** Real-time conditions, 7-day forecasts, and AI-powered agronomic advice. Built for farmers across Africa.

**Live demo:** https://sky-shamba.vercel.app/

---

## Features

| Feature                | Description                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Location search        | Debounced autocomplete via OpenStreetMap Nominatim — no extra API key needed                                            |
| Current conditions     | Temperature, humidity, UV index, wind speed and gusts, with a contextual farming tip                                    |
| 12-hour strip          | Hour-by-hour conditions for the rest of the day                                                                         |
| 7-day forecast chart   | Recharts composed chart showing high/low temps and rain probability                                                     |
| AI agronomic insight   | Gemini-powered summary with farming context from WeatherAI                                                              |
| Tree & canopy analysis | Upload a drone or satellite image. WeatherAI counts trees, grades canopy health, and returns actionable recommendations |

---

## Project structure

```
sky-shamba/
├── app/
│   ├── api/
│   │   ├── weather/route.ts        # Proxy → WeatherAI /v1/weather
│   │   ├── forecast/route.ts       # Proxy → WeatherAI /v1/daily
│   │   ├── geocode/route.ts        # Proxy → Nominatim
│   │   └── trees/route.ts          # Proxy → WeatherAI /v1/trees/analyze
│   ├── dashboard/
│   │   ├── page.tsx                # Suspense boundary for useSearchParams
│   │   └── dashboard-client.tsx    # Client component. All weather UI lives here
│   ├── layout.tsx
│   └── page.tsx                    # Landing page with search and quick picks
├── components/
│   └── dashboard/
│       ├── current-weather.tsx     # Temperature card, stats grid, farming tip
│       ├── hourly-strip.tsx        # Scrollable 12-hour view
│       ├── forecast-chart.tsx      # Recharts ComposedChart
│       ├── daily-strip.tsx         # 7-day emoji tile row
│       ├── ai-insight.tsx          # Gemini summary card
│       ├── tree-analyzer.tsx       # Drag-and-drop uploader + analysis results
│       ├── dashboard-shell.tsx     # Layout wrapper used by the Suspense fallback
│       └── skeleton-dashboard.tsx  # Loading skeleton
├── lib/
│   ├── api.ts                      # Typed fetch wrappers (queryFn for TanStack Query)
│   ├── constants.ts                # API base URL, quick-pick locations
│   ├── hooks.ts                    # useDebounce
│   ├── providers.tsx               # TanStack Query client provider
│   └── utils.ts                    # cn(), condition labels, UV index, farming tips
└── types/
    └── weather.ts                  # TypeScript interfaces for all API shapes
```

---

## Architecture decisions

**API key never reaches the browser**. Every call to WeatherAI goes through a Next.js route handler that attaches the secret key server-side. The browser only ever talks to `/api/*`.

**TanStack Query for all data fetching**. No `useEffect` + `useState` for async data. `useQuery` handles loading/error states, deduplication, and a 10-minute stale window so switching tabs doesn't trigger unnecessary refetches.

**`useDebounce` hook drives search**. A single `useDebounce(inputValue, 350)` call produces the debounced query that gates the TanStack Query `enabled` flag, keeping Nominatim requests within fair-use limits.

**Suspense boundary pattern**. `useSearchParams()` must be inside a `<Suspense>` boundary in Next.js. `page.tsx` is a Server Component that owns the boundary; `dashboard-client.tsx` is the Client Component that calls the hook inside it.

**`cache: "no-store"` on route handlers**. TanStack Query owns client-side caching via `staleTime`. The Next.js data cache is disabled on the proxy routes so TanStack Query always gets a fresh response when it decides to refetch.

---

## Local setup

**1. Clone and install**

```bash
git clone https://github.com/amomutai/sky-shamba.git
cd sky-shamba
pnpm install
```

**2. Add your API key**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Get your API key from https://weather-ai.co (free tier — 1,000 req/month)
WEATHER_AI_API_KEY=wai_key_here

# Used in the Nominatim User-Agent header (required by their usage policy)
NOMINATIM_CONTACT_EMAIL=email@example.com
```

Get a free WeatherAI key at [weather-ai.co](https://weather-ai.co) — free tier includes 1,000 requests/month, 7-day forecasts, AI summaries, and tree analysis.

`NOMINATIM_CONTACT_EMAIL` is required by [Nominatim's usage policy](https://operations.osmfoundation.org/policies/nominatim/). Set it to your own email address.

**3. Run**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), search for a city, or click one of the East Africa quick picks.

---

## Deploy to Vercel

```bash
pnpm dlx vercel --prod
```

Set both variables under **Project → Settings → Environment Variables** in the Vercel dashboard before deploying:

- `WEATHER_AI_API_KEY`
- `NOMINATIM_CONTACT_EMAIL`

---

## Tech stack

|                                                 |                                                         |
| ----------------------------------------------- | ------------------------------------------------------- |
| [Next.js 16](https://nextjs.org)                | App Router, server-side API proxying, Suspense          |
| [React 19](https://react.dev)                   |                                                         |
| [TypeScript](https://typescriptlang.org)        |                                                         |
| [Tailwind CSS v4](https://tailwindcss.com)      |                                                         |
| [shadcn/ui](https://ui.shadcn.com)              | Card, Button, Input, Badge, Skeleton                    |
| [TanStack Query v5](https://tanstack.com/query) | Data fetching, caching, loading/error states            |
| [Recharts 3](https://recharts.org)              | ComposedChart for the forecast visualisation            |
| [WeatherAI](https://weather-ai.co)              | Weather data, Gemini AI summaries, tree/canopy analysis |
| [Nominatim](https://nominatim.org)              | Free geocoding — no API key required                    |
