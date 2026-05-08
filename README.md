# SAM — Purchase Order Lifecycle Management Platform

A web-based platform for enterprise IT organizations to manage the full lifecycle of vendor purchase orders — from initial intake through approval, signing, and portfolio management.

## What This Product Does

Enterprise IT teams manage hundreds of purchase orders across software and hardware vendors. Without a centralized system, POs get tracked in spreadsheets, approval chains happen over email, and financial analysts lack real-time visibility into spend, forecasts, and renewals.

SAM solves this by providing:

- **A single intake point** for all incoming purchase orders, with a structured approval workflow
- **Portfolio views** for GPS (Global Purchase Services) and Financial Analysts to manage active POs
- **Forecasting tools** with 72-month planning grids, variance tracking, and fiscal year alignment
- **Leadership dashboards** for executive visibility into spend by organization level and funding source
- **Vendor 360 views** for consolidated vendor relationship management

## Who Uses It

| Role | What They Do |
|------|-------------|
| **PO Intake Manager** | Reviews incoming POs, approves/signs them, sends to portfolio |
| **GPS Team** | Manages active POs, tracks new purchases vs renewals |
| **Financial Analyst** | Owns PO lifecycle — forecasts, commits, actuals, renewals |
| **Leadership** | Reviews spend summaries by org level, tier, and funding source |

## The PO Workflow

Every purchase order follows this lifecycle:

```
Draft → Approved → Signed → InPortfolio
                      ↘ Ignored
```

| Status | Meaning | Where Visible |
|--------|---------|---------------|
| **Draft** | New PO awaiting review (inbound or manually created) | Inbound PO |
| **Approved** | Reviewed and approved, awaiting signature | Inbound PO |
| **Signed** | Signed, ready to be sent to portfolio | Inbound PO |
| **InPortfolio** | Sent via "Send as New" or "Send as Renewal" | Inbound PO + GPS Portfolio + Financial Analyst Portfolio |
| **Ignored** | Excluded from processing (can be reverted) | Inbound PO |

When a PO is sent as **New**, it has no prior association. When sent as **Renewal**, the user selects an existing InPortfolio PO to associate it with, creating a renewal chain.

## Application Modules

### Inbound Purchase Order (`/home/viewasset`)
The starting point for all POs. Single table with status filter pills (Draft / Approved / Signed / InPortfolio / Ignored), per-row action buttons, bulk actions, and a form to manually create Draft POs. "Send as New" and "Send as Renewal" buttons move Signed POs into the portfolio.

### GPS Portfolio (`/home/gpsPortfolio`)
Shows all InPortfolio POs with vendor, amount, dates, purchase type, and association details (New vs Renewal + linked previous PO). This is the GPS team's primary working view.

### Financial Analyst PO Portfolio (`/home/financialAnalystsPortfolio`)
Same InPortfolio POs as GPS but with additional financial attributes — KPIs (annualized spend, forecast, commit, actuals, variance), forecast/commit/actuals matrices, and renewal tracking. Each PO links to a detail page with a 72-month forecast grid.

### 72-Month Forecast Manager (`/home/financialAnalystsPortfolio/[poId]/forecast`)
Interactive monthly/quarterly/yearly planning grid for each PO. Supports inline editing, fiscal year alignment (August start), and version tracking (draft/locked/submitted states).

### Portfolio View for Leaders (`/home/portfolioViewleaders`)
Executive dashboard with spend breakdown by L4/L5 organization levels, funding source analysis (Central vs Functional), and tier-based segmentation (Mega, Platinum, Gold, Silver, Bronze).

### Vendor 360 View (`/home/vendor-360`)
Consolidated view per vendor — overview KPIs, contracts, products, people, stakeholders, savings, and invoices. Supports vendor switching and yearly data filtering.

### GL Reconciliation (`/home/gl-reconciliation`)
Reconciles General Ledger actuals with PO forecasts per fiscal period and organization leader.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone <repository-url>
cd sam_app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs entirely on mock APIs — no database or external services required.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Data Fetching:** TanStack Query (React Query)
- **Tables:** TanStack Table
- **Icons:** Lucide React
- **Toasts:** Sonner

## Data Architecture

All PO data flows through a single in-memory mock API (`/api/datalake/v1/attributes/purchaseorders`). This endpoint supports:

- `POST` — Read all POs
- `PATCH` — Update PO fields and status
- `PUT` — Create new Draft POs

The Inbound PO screen writes to this store. GPS Portfolio and Financial Analyst Portfolio read from it, filtered by `PO_STATUS === 'InPortfolio'`. This ensures a single source of truth — changes on the Inbound screen are immediately reflected downstream.

Financial data (forecasts, commits, actuals) is generated deterministically from PO IDs via `src/lib/mock-financial-data.ts`, ensuring consistent data across page refreshes.

## Key Conventions

- **Fiscal Year:** Starts in August (FY26 = Aug 2025 – Jul 2026)
- **Path alias:** `@/*` maps to `./src/*`
- **Purchase Types:** Software, Hardware
- **Association Types:** New (no prior PO), Renewal (linked to previous PO)
