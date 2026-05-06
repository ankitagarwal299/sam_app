# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (runs on localhost:3000)
- **Build**: `npm run build`
- **Lint**: `npm run lint` (ESLint 9 flat config via `eslint.config.mjs`)
- **Start production**: `npm run start`

No test framework is currently configured.

## Architecture

This is a **Next.js 16 App Router** application (TypeScript) for Software Asset Management (SAM) financial portfolio tracking. It uses **Tailwind CSS v4** and **shadcn/ui** components.

### Key Patterns

- **Path alias**: `@/*` maps to `./src/*`
- **Data fetching**: TanStack Query (React Query) wraps all API calls. The `<Providers>` component in `src/components/providers.tsx` sets up `QueryClientProvider` at the root.
- **Mock APIs**: All data comes from Next.js Route Handlers in `src/app/api/`. No external database — mock data is generated in-route or from `src/lib/mock-financial-data.ts` and `src/lib/publisher-360-data.ts`.
- **UI components**: shadcn/ui primitives live in `src/components/ui/`. Feature-specific components are in `src/components/<feature>/` (e.g., `publisher-360/`, `gl-reconciliation/`).
- **Styling**: Tailwind CSS v4 with `@import "tailwindcss"` syntax in `globals.css`. Uses CSS custom properties for theming (shadcn pattern). Fonts: Geist Sans and Geist Mono via `next/font/google`.
- **Toasts**: Sonner (`<Toaster />` in root layout).

### Route Structure

- `/` — Landing page (module hub), fetches user access levels
- `/home/` — Layout with sticky header and nav
  - `financialAnalystsPortfolio/` — Financial Analyst dashboard
    - `[poId]/` — Single PO detail view
    - `[poId]/forecast/` — 72-month forecast manager
    - `[poId]/renewal/` — Renewal analysis
  - `portfolioViewleaders/` — Leaders executive dashboard
  - `gpsPortfolio/` — GPS Portfolio view
  - `publisher-360/` — Publisher 360° view
  - `gl-reconciliation/` — GL Reconciliation
  - `viewasset/` — Enterprise portfolio view

### API Routes (Mock)

All under `src/app/api/`:
- `account/v1/accounts/accesslevels/[userid]/` — User modules/access
- `datalake/v1/attributes/purchaseorders/` — PO data
- `dataloader/v1/attributes/purchaseorders/aggregatePOWithoutMandatoryFY/` — Renewal candidates
- `financial-portfolio/` — Portfolio data, `[poId]/forecast/`, `[poId]/details/`, `leaders-view/`
- `gl-reconciliation/` — GL reconciliation data
- `publisher-360/` — Publisher 360 data

### Fiscal Year

The business uses an **August-start fiscal year**. This is relevant to the forecast manager and financial data views.
