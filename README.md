# StableNet Training Feedback — client

React 19 + TypeScript + Vite + Ant Design 6 + Tailwind CSS 4 + TanStack Query.
Talks to the NestJS API in `../server`.

```bash
npm install
npm run dev          # http://localhost:5173 — /api is proxied to http://localhost:4000
npm run typecheck
npm run lint
npm run build
```

Set `VITE_API_PROXY_TARGET` if the API runs elsewhere. In production, serve `dist/` and the API
from the same origin (reverse proxy `/api` to the server) so the session cookie works.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Feedback form → certificate (PDF) |
| `/admin/login` | public | Email + password sign-in |
| `/admin/dashboard` | admin | KPIs, responses per day, by OpCo, answer distributions, latest |
| `/admin/responses` | admin | Server-paginated table; filters/sort/search live in the URL |
| `/admin/responses/:certId` | admin | Answers, certificate, download history, delete |
| `/admin/certificates` | admin | Issued certificates, downloaded / not downloaded |
| `/admin/verify` | admin | Check a certificate ID or verification code |
| `/admin/settings` | admin | Trainer name, dates, signature, preview |
| `/admin/account` | admin | Profile, change password |

## Structure

```
public/            favicon + logos (zoracom, stablenet, "ra" mark)
src/
├─ api/            fetch wrapper (CSRF header, typed errors), endpoints, typed calls
├─ hooks/queries/  React Query hooks (public, auth, admin) + cache keys
├─ types/          API types (mirror the server DTOs)
├─ config/         routes, nav, constants, antd theme
├─ lib/certificate canvas certificate renderer + PDF export
├─ components/     layouts (hero, admin shell, footer), certificate viewer/modal, shared UI
├─ features/
│  ├─ feedback/    participant form (rendered from GET /api/form-config)
│  ├─ admin/       table columns, URL query state, detail cards, settings, password
│  └─ dashboard/   stat tiles and charts (accessible table view on every chart)
├─ pages/          route components
├─ providers/      Query client, antd theme, light/dark/system theme
└─ router/         route tree + RequireAdmin guard (checks /api/auth/me)
```
