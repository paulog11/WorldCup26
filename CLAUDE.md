# World Cup 2026

2026 FIFA World Cup companion app built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS.

## Quick Reference

- **Dev server:** `npm run dev` (runs on http://localhost:3000)
- **Build:** `npm run build`
- **Preview prod:** `npm run preview`

## Tech Stack

- **Nuxt 4.4.2** — full-stack Vue framework (file-based routing, auto-imports, Nitro server)
- **Vue 3** — Composition API (`<script setup>`)
- **Tailwind CSS** — utility-first styling via `@nuxtjs/tailwindcss`
- **Pinia** — state management (available but not yet used)
- **VueUse** — composition utilities (e.g. `useNow` for countdown)
- **TypeScript** — strict types throughout

## Architecture

### Data flow

```
seed.json → server/utils/api-client.ts → server/api/*.ts → app/composables/*.ts → pages/components
```

All data lives in `data/seed.json` (48 teams, 16 venues, 104 matches). No database. The server reads it once, caches in memory, and exposes it via API routes. Frontend composables wrap `useFetch()` calls to these endpoints.

### Key directories

| Path | Purpose |
|------|---------|
| `data/seed.json` | All tournament data (single source of truth) |
| `server/utils/api-client.ts` | Loads seed data, helper functions for lookups |
| `server/api/` | HTTP API routes: matches, teams, venues, standings |
| `app/composables/` | `useMatches`, `useTeams`, `useVenues`, `useStandings` |
| `app/components/` | `MatchCard`, `StandingsTable`, `TeamBadge`, `CountdownTimer`, `layout/Navbar` |
| `app/pages/` | File-based routes: `/`, `/schedule`, `/match/:id`, `/groups`, `/teams(/:id)`, `/venues(/:id)` |
| `app/layouts/default.vue` | Page shell (navbar + footer) |
| `types/index.ts` | Shared TS interfaces: Team, Match, Standing, Group, Venue, Player |
| `assets/css/main.css` | Tailwind config + custom theme colors |
| `public/flags/` | 48 country flag SVGs |

### Theme colors (defined in `assets/css/main.css`)

- `wc-dark` (#1a0a2e) — page background
- `wc-purple` (#3d1d72) — cards, borders
- `wc-magenta` (#c2185b) — primary actions, live badge
- `wc-gold` (#ffc107) — headings, scores, highlights
- `wc-teal` (#00bcd4) — links, section headers
- `wc-light` (#f5f0ff) — body text

## Conventions

- All Vue components use `<script setup lang="ts">` (Composition API)
- Composables and components are auto-imported by Nuxt (no manual imports needed)
- Pages use file-based routing — `[id].vue` for dynamic segments
- Server API handlers use h3's `defineEventHandler` and `getQuery`
- Tailwind classes use the `wc-*` custom color palette
