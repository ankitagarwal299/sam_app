# Inbound Purchase Order Enhancement — Design Spec

## Overview

Enhance the Inbound Purchase Order page (`/home/viewasset`) with a proper PO workflow (Draft → Approved → Signed → Active), per-row actions, a Draft PO creation form, cross-screen data integration, and global renames (Publisher → Vendor, Software Purchase → Purchase).

## 1. Page Layout

The page uses a **single table with status filter pills** — no tabs.

**Top to bottom:**
1. **Header row**: "Inbound Purchase Order" title + FY selector dropdown + "+ Add Draft PO" button
2. **Bordered container**:
   - Filter pills bar: All / Draft / Approved / Ignored + search input + Purchase Type filter dropdown
   - Data table with checkbox selection, all existing columns plus new columns (Purchase Type, Status, Actions)
   - Bulk action bar at bottom — appears when rows are selected (Approve Selected / Ignore Selected)
3. **Outside the border** (right-aligned): "Send as New →" and "Send as Renewal →" buttons

## 2. PO Workflow & Statuses

```
Draft → Approved → Signed → Active (disappears from Inbound, appears on GPS + FA)
Draft → Approved → Ignored
Draft → Ignored
Ignored → Draft (revert)
```

POs can arrive from upstream systems in any status (Draft, Approved, etc.).

### Status Definitions

| Status | Meaning | Visible on Inbound? |
|--------|---------|---------------------|
| `Draft` | New or manually created PO awaiting review | Yes |
| `Approved` | Reviewed and approved, awaiting signature | Yes |
| `Signed` | Signed, ready to be sent to downstream screens | Yes (until sent) |
| `Active` | Sent to GPS Portfolio & Financial Analyst Portfolio | No |
| `Ignored` | Excluded from processing | Yes (filtered) |

### Per-Row Actions by Status

| Current Status | Actions Column Shows |
|----------------|---------------------|
| Draft | "Approve" button + "Ignore" button |
| Approved | "Sign" button + "Ignore" button |
| Signed | No per-row actions (use Send buttons below table) |
| Ignored | "Revert to Draft" button |

### Bulk Actions (bottom bar inside bordered container)

- "Approve Selected" — moves selected Draft POs to Approved
- "Ignore Selected" — moves selected Draft or Approved POs to Ignored

Bar only appears when at least one row is selected.

### Send Buttons (outside bordered container)

- "Send as New →" — sets selected Signed POs to `Active`. They disappear from this screen and appear on GPS Portfolio + Financial Analyst Portfolio.
- "Send as Renewal →" — same as Send as New, but also opens the existing RenewalModal to associate with an existing PO.

## 3. New Columns

Add to existing table columns:

| Column | Position | Values |
|--------|----------|--------|
| **Purchase Type** | After PO Number | Software, Hardware (from new `PURCHASE_TYPE` field in mock data) |
| **Status** | After Purchase Type | Draft, Approved, Signed, Ignored — rendered as colored badges |

### Status Badge Colors

- Draft: blue background (`#dbeafe`, text `#1e40af`)
- Approved: green background (`#dcfce7`, text `#166534`)
- Signed: indigo background (`#e0e7ff`, text `#3730a3`)
- Ignored: gray background (`#f1f5f9`, text `#64748b`)

## 4. Add Draft PO Modal

Triggered by "+ Add Draft PO" button. A dialog form with:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Vendor Name | Text input | Yes | |
| PO Description | Text input | Yes | |
| PO Number | Auto-generated | Auto | Format: `PO-XXX` (next sequential number) |
| Purchase Type | Select | Yes | Options: Software, Hardware |
| Total Amount (USD) | Currency input | Yes | |
| Start Date | Date input | Yes | |
| End Date | Date input | Yes | |
| Expense Type | Select | Yes | Options: OPEX, COGS |
| GL Account | Text input | No | |
| Department Code | Text input | No | |
| Product Owner | Text input | No | |
| Financial Analyst | Text input | No | |

On submit:
- POST to `/api/datalake/v1/attributes/purchaseorders` (new endpoint or extend existing)
- PO created with `PO_STATUS: 'Draft'`
- Table refreshes via TanStack Query invalidation
- Toast confirmation shown

## 5. Global Renames

### Text Renames

| From | To |
|------|----|
| "Publisher" (everywhere) | "Vendor" |
| "Publisher 360° View" | "Vendor 360° View" |
| "Software Purchase" | "Purchase" |
| "Software Publisher" (data field) | "Vendor" |

### File/Directory Renames

| From | To |
|------|----|
| `src/components/publisher-360/` | `src/components/vendor-360/` |
| `src/app/home/publisher-360/` | `src/app/home/vendor-360/` |
| `src/app/api/publisher-360/` | `src/app/api/vendor-360/` |
| `src/lib/publisher-360-data.ts` | `src/lib/vendor-360-data.ts` |

All imports, component names, variable names, and internal references updated accordingly.

### Landing Page Module Updates

- Module card "Publisher 360° View" → "Vendor 360° View"
- Module description referencing "software publishers" → "vendors"
- GPS Portfolio description: "SW Purchase and Renewal" → "Purchase and Renewal"

## 6. Cross-Screen PO Data Integration

### Single Source of Truth

All PO data lives in `/api/datalake/v1/attributes/purchaseorders/route.ts` (the existing in-memory mock store).

### Mock Data Changes

Add `PURCHASE_TYPE` field to every PO record in the mock data:
```json
{ "key": "PURCHASE_TYPE", "value": "Software", "name": "Purchase Type", "type": "STRING", "readOnly": false }
```

Assign reasonable values: most existing POs get "Software", a few get "Hardware".

### Default PO_STATUS

Change existing POs with `null` status to `"Draft"` for consistency.

### API Changes

**Existing endpoint** (`POST /api/datalake/v1/attributes/purchaseorders`):
- No change — returns all POs

**Existing endpoint** (`PATCH /api/datalake/v1/attributes/purchaseorders`):
- No change — already handles status updates

**New endpoint** (`PUT /api/datalake/v1/attributes/purchaseorders`):
- Accepts a full PO record (array of key/value fields)
- Appends to the in-memory array
- Returns the created record
- Used by "Add Draft PO" form

### GPS Portfolio Page Changes

File: `src/app/home/gpsPortfolio/page.tsx`

Currently uses hardcoded mock data. Change to:
- Fetch from `/api/datalake/v1/attributes/purchaseorders` (POST)
- Filter to `PO_STATUS === 'Active'`
- Map fields to GPS column names:
  - `VENDOR_NAME` → "Vendor" (was "Publisher")
  - `PO_DESCRIPTION` → "PO Description"
  - `TOTAL_AMOUNT_USD` → derive financial fields
  - Other fields mapped as appropriate
- Remove hardcoded `gpsData` array

### Financial Analyst Portfolio Page Changes

File: `src/app/home/financialAnalystsPortfolio/page.tsx`

- Portfolio PO list: filter from same endpoint where `PO_STATUS === 'Active'`
- Existing forecast/commit/actuals mock generation (`mock-financial-data.ts`) continues unchanged — it's keyed by PO ID
- Single PO detail, forecast, and renewal sub-pages: no changes needed

### Inbound PO Page Changes

File: `src/app/home/viewasset/page.tsx`

- Fetch all POs, show those with status: Draft, Approved, Signed, Ignored
- Filter out `Active` POs (they belong to GPS + FA screens)
- Replace current tab structure with filter pills
- Add per-row action buttons
- Add bulk action bar
- Add "Send as New" / "Send as Renewal" buttons outside bordered container
- Add "+ Add Draft PO" button → opens modal

## 7. Unchanged Areas

- Financial Analyst single PO detail view (`[poId]/page.tsx`)
- 72-month forecast manager (`[poId]/forecast/page.tsx`)
- Renewal analysis page (`[poId]/renewal/page.tsx`)
- Leaders view (`portfolioViewleaders/page.tsx`)
- GL Reconciliation module
- Mock financial data generation (`mock-financial-data.ts`)

## 8. Component Impact Summary

| Component | Change |
|-----------|--------|
| `viewasset/page.tsx` | Major rewrite — new layout, workflow, actions |
| `gpsPortfolio/page.tsx` | Moderate — switch from hardcoded to API data |
| `financialAnalystsPortfolio/page.tsx` | Minor — filter to Active POs |
| `publisher-360/*` → `vendor-360/*` | Rename files + all references |
| `page.tsx` (landing) | Minor — rename module cards |
| `api/datalake/.../route.ts` | Add PUT endpoint, add PURCHASE_TYPE to mock data, default Draft status |
| `api/account/.../route.ts` | Rename module names in mock response |
| `confirm-dialog.tsx` | No change (reused) |
| `renewal-modal.tsx` | No change (reused) |
| `data-table.tsx` | No change (reused) |
