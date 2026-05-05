# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start Next.js dev server (Turbopack, Next.js 16)
- `npm run build` — Production build
- `npm start` — Start production server
- `npm run lint` — Run ESLint

No test framework is currently configured.

## Architecture

**Next.js 16 App Router** application (React 19) for enterprise software asset management (SAM). All data is currently mock-generated — no database or external APIs.

### Key Stack
- **UI**: Shadcn UI (Radix primitives) + Tailwind CSS v4 + Lucide icons
- **Data fetching**: TanStack Query (React Query) for server state
- **Tables**: TanStack React Table with custom `DataTable` wrapper
- **Charts**: Recharts
- **Theming**: next-themes (dark mode support)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

### Source Layout

- `src/app/page.tsx` — Landing page / module hub
- `src/app/home/` — Feature pages (each module is a subdirectory)
  - `financialAnalystsPortfolio/` — FA dashboard + PO detail/forecast/renewal views
  - `portfolioViewleaders/` — Executive leadership dashboard
  - `publisher-360/` — Publisher 360° multi-tab analysis
  - `gl-reconciliation/` — GL reconciliation
  - `gpsPortfolio/` — GPS portfolio
  - `viewasset/` — Asset view
- `src/app/api/` — Mock API route handlers with versioned paths (`/account/v1/`, `/datalake/v1/`, etc.)
- `src/components/ui/` — Shadcn UI primitives (button, card, dialog, table, etc.)
- `src/components/publisher-360/` — Publisher 360° feature components
- `src/components/gl-reconciliation/` — GL reconciliation components
- `src/components/providers.tsx` — React Query provider setup
- `src/lib/mock-financial-data.ts` — Deterministic mock data generators (PO, forecast, financials)
- `src/lib/publisher-360-data.ts` — Publisher 360° types and data generators
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)

### Patterns

- Pages needing interactivity use `'use client'` directive
- Data fetching uses `useQuery` from TanStack Query with `queryKey`/`queryFn` pattern
- API routes return `NextResponse.json(data)` with mock data generated server-side
- Mock data generators use deterministic seeding based on PO ID for consistency
- Financial data follows quarter-based matrices (forecast, commit, actuals, liability)
- Shadcn component config in `components.json` (style: new-york, base color: neutral)

### Data Models

Core entities: Purchase Orders (PO) with vendor/amount/fiscal year/status, 72-month forecast data (monthly/quarterly/yearly granularity), leader hierarchy (L2-L5), publisher 360° data (contracts, products, people, stakeholders, savings, invoices), GL reconciliation records.
