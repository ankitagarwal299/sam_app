# Executive Memo Snapshots — Design Spec

## Overview

Add an immutable executive memo / snapshot feature to the Portfolio View for Leaders page (`/home/portfolioViewleaders`). Leaders can capture the current dashboard state along with executive commentary as a locked, auditable, versioned record.

## Data Model

```typescript
interface Snapshot {
  id: string;                        // crypto.randomUUID()
  version: number;                   // auto-incrementing (1, 2, 3...)
  author: string;                    // text input, defaults to "Executive User"
  createdAt: string;                 // ISO timestamp
  memo: string;                      // executive commentary text
  filters: Record<string, string>;   // active filter values at time of capture
  data: LeadersViewData;             // frozen copy of the full dashboard data
}
```

## Persistence

In-memory React state (`useState<Snapshot[]>([])`). Resets on page refresh. No API routes needed.

## UI Components

### 1. Header Buttons (added to existing header bar)

Two new buttons next to the existing Filter and MoreHorizontal buttons:

- **"Take Snapshot"** — camera/bookmark icon + text label. Opens the capture modal.
- **"Snapshots (n)"** — history/clock icon with count badge. Opens the history popover.

### 2. Take Snapshot Modal (Dialog)

- Title: "Create Executive Memo"
- Fields:
  - Author name (text input, defaults to "Executive User")
  - Memo text (textarea, required, placeholder: "Record decisions, approvals, or notes...")
  - Read-only summary: current date, auto version number, active filters shown as tags
- Footer: "Cancel" and "Lock & Save Snapshot" buttons
- On save: push new Snapshot into state with frozen copy of current `data`, close modal, show toast via sonner

### 3. Snapshot History Popover

- Anchored to the "Snapshots" button in the header
- Scrollable list of past snapshots, newest first
- Each item shows: version badge (v1, v2...), author, relative date ("2 min ago"), memo text truncated to ~60 chars
- Clicking an item opens the Viewer Modal
- Empty state: "No snapshots yet"

### 4. Snapshot Viewer Modal (read-only, larger dialog)

- Header: "Executive Memo — v{n}" with a "LOCKED" badge
- Metadata bar: Author, date/time, version
- Filters section: filter values displayed as tags
- Memo section: full executive commentary text
- Dashboard data section: read-only summary of key metrics (Total, TCV, ACV), Level 4/5 top spend lists, and funding source totals — numbers/tables only, not interactive charts
- Footer: "Close" button only (no edit — immutable)

## Integration

### Changes to `page.tsx`

- Add `filters` state: `useState<Record<string, string>>({})` to track active filter values
- Wire up existing `FilterSelect` components with `onValueChange` to update filter state
- Import and render `<SnapshotManager data={data} filters={filters} />` in the header area

### New File

`src/app/home/portfolioViewleaders/snapshot-manager.tsx`

Contains:
- `Snapshot` type definition
- `SnapshotManager` component (owns `useState<Snapshot[]>`)
- Take Snapshot modal (using Shadcn `Dialog`)
- Snapshot History popover (using native popover or Radix)
- Snapshot Viewer modal (using Shadcn `Dialog`)

### Dependencies

No new dependencies. Uses existing: Dialog, Button, Input from Shadcn UI, sonner for toasts.

## Flow Summary

1. Leader views dashboard with current data and filters
2. Clicks "Take Snapshot" → modal opens
3. Enters author name + memo text, sees auto-generated metadata
4. Clicks "Lock & Save Snapshot" → snapshot stored in state, toast shown
5. Clicks "Snapshots (2)" → popover shows list of past snapshots
6. Clicks a snapshot → read-only viewer modal opens showing frozen data + memo
7. Snapshots cannot be edited or deleted (immutable)
