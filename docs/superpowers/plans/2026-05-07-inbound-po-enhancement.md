# Inbound Purchase Order Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PO workflow (Draft → Approved → Signed → Active), per-row actions, draft PO creation, cross-screen data integration, and rename Publisher → Vendor across the app.

**Architecture:** Single source of truth for PO data via the existing in-memory mock store in the purchaseorders API route. The Inbound PO page gets a full rewrite with filter pills instead of tabs, per-row action buttons, and a draft PO form modal. GPS Portfolio and Financial Analyst pages switch from hardcoded data to fetching Active POs from the shared API. Global renames (Publisher → Vendor, Software Purchase → Purchase) are applied via file/directory renames and text find-replace.

**Tech Stack:** Next.js 16 App Router, TypeScript, TanStack Query, TanStack Table, shadcn/ui (Radix), Tailwind CSS, Sonner toasts.

---

## File Structure

**Modified files:**
- `src/app/api/datalake/v1/attributes/purchaseorders/route.ts` — add PURCHASE_TYPE field, default Draft status, add PUT endpoint
- `src/app/api/account/v1/accounts/accesslevels/[userid]/route.ts` — rename module descriptions
- `src/app/home/viewasset/page.tsx` — full rewrite with new layout and workflow
- `src/app/home/gpsPortfolio/page.tsx` — switch from hardcoded to API data
- `src/app/home/financialAnalystsPortfolio/page.tsx` — filter to Active POs
- `src/app/page.tsx` — rename module cards on landing page

**Renamed files (Publisher → Vendor):**
- `src/components/publisher-360/` → `src/components/vendor-360/` (all files inside)
- `src/app/home/publisher-360/` → `src/app/home/vendor-360/`
- `src/app/api/publisher-360/` → `src/app/api/vendor-360/`
- `src/lib/publisher-360-data.ts` → `src/lib/vendor-360-data.ts`

**New files:**
- `src/components/add-draft-po-modal.tsx` — form modal for creating draft POs

---

### Task 1: Update Mock API — Add PURCHASE_TYPE, Default Draft Status, PUT Endpoint

**Files:**
- Modify: `src/app/api/datalake/v1/attributes/purchaseorders/route.ts`

- [ ] **Step 1: Add PURCHASE_TYPE field to every PO record**

In every PO array in `purchaseOrderRows`, add a `PURCHASE_TYPE` field. Most POs get "Software", PO-005 (Oracle Database Support) and PO-014 (UI Components) get "Hardware".

Add this field to each PO row array (after the last field in each row):
```typescript
{ "key": "PURCHASE_TYPE", "value": "Software", "name": "Purchase Type", "type": "STRING", "readOnly": false }
```

For PO-005 and PO-014, use `"value": "Hardware"` instead.

- [ ] **Step 2: Change all null PO_STATUS to "Draft"**

Find every `{ "key": "PO_STATUS", "value": null, ...}` entry and change to `"value": "Draft"`. This applies to PO-001 through PO-015 (except PO-016 which is "Ignored", PO-017 which is "Ignored", and PO-018/019/020 which are "Active").

- [ ] **Step 3: Add PUT handler for creating new POs**

Add after the existing PATCH handler:

```typescript
export async function PUT(request: Request) {
    const { fields } = await request.json();

    if (!fields || !Array.isArray(fields)) {
        return NextResponse.json({ success: false, message: 'Invalid payload: fields array required' }, { status: 400 });
    }

    // Auto-generate PO number
    const maxPoNum = purchaseOrderRows.reduce((max, row) => {
        const poField = row.find(f => f.key === 'PO_NUMBER');
        if (poField) {
            const num = parseInt(String(poField.value).replace('PO-', ''), 10);
            return num > max ? num : max;
        }
        return max;
    }, 0);

    const newPoNumber = `PO-${String(maxPoNum + 1).padStart(3, '0')}`;

    // Ensure PO_NUMBER is set
    const poNumField = fields.find((f: any) => f.key === 'PO_NUMBER');
    if (poNumField) {
        poNumField.value = newPoNumber;
    } else {
        fields.push({ key: 'PO_NUMBER', value: newPoNumber, name: 'PO Number', type: 'STRING', readOnly: true });
    }

    // Ensure PO_STATUS is Draft
    const statusField = fields.find((f: any) => f.key === 'PO_STATUS');
    if (statusField) {
        statusField.value = 'Draft';
    } else {
        fields.push({ key: 'PO_STATUS', value: 'Draft', name: 'PO Status', type: 'STRING', readOnly: true });
    }

    purchaseOrderRows.push(fields);

    return NextResponse.json({ success: true, poNumber: newPoNumber });
}
```

- [ ] **Step 4: Verify the API works**

Run: `npm run dev` (if not already running)

Test in browser console:
```javascript
// Test POST (read all)
fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' }).then(r => r.json()).then(d => console.log('PO count:', d.purchaseOrderRows.length))

// Test PUT (create)
fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ fields: [{ key: 'VENDOR_NAME', value: 'TEST VENDOR', name: 'Vendor Name', type: 'STRING', readOnly: true }, { key: 'PO_DESCRIPTION', value: 'Test PO', name: 'PO Description', type: 'STRING', readOnly: false }, { key: 'TOTAL_AMOUNT_USD', value: '99999', name: 'PO Amount', type: 'CURRENCY', readOnly: true }, { key: 'PURCHASE_TYPE', value: 'Software', name: 'Purchase Type', type: 'STRING', readOnly: false }]})}).then(r => r.json()).then(d => console.log('Created:', d))
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/datalake/v1/attributes/purchaseorders/route.ts
git commit -m "feat: add PURCHASE_TYPE field, default Draft status, PUT endpoint for PO creation"
```

---

### Task 2: Create Add Draft PO Modal Component

**Files:**
- Create: `src/components/add-draft-po-modal.tsx`

- [ ] **Step 1: Create the modal component**

```typescript
'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddDraftPOModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddDraftPOModal({ isOpen, onClose, onSuccess }: AddDraftPOModalProps) {
    const [vendorName, setVendorName] = useState('');
    const [poDescription, setPODescription] = useState('');
    const [purchaseType, setPurchaseType] = useState('Software');
    const [totalAmount, setTotalAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expenseType, setExpenseType] = useState('OPEX');
    const [glAccount, setGlAccount] = useState('');
    const [deptCode, setDeptCode] = useState('');
    const [productOwner, setProductOwner] = useState('');
    const [financialAnalyst, setFinancialAnalyst] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setVendorName('');
        setPODescription('');
        setPurchaseType('Software');
        setTotalAmount('');
        setStartDate('');
        setEndDate('');
        setExpenseType('OPEX');
        setGlAccount('');
        setDeptCode('');
        setProductOwner('');
        setFinancialAnalyst('');
    };

    const handleSubmit = async () => {
        if (!vendorName || !poDescription || !totalAmount || !startDate || !endDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const fields = [
                { key: 'VENDOR_NAME', value: vendorName.toUpperCase(), name: 'Vendor Name', type: 'STRING', readOnly: true },
                { key: 'PO_DESCRIPTION', value: poDescription, name: 'PO Description', type: 'STRING', readOnly: false },
                { key: 'PURCHASE_TYPE', value: purchaseType, name: 'Purchase Type', type: 'STRING', readOnly: false },
                { key: 'TOTAL_AMOUNT_USD', value: totalAmount, name: 'PO Amount', type: 'CURRENCY', readOnly: true },
                { key: 'PO_START_DATE', value: startDate.replace(/-/g, '/') + ' 00:00:00', name: 'Start Date', type: 'DATETIME', readOnly: false },
                { key: 'PO_END_DATE', value: endDate.replace(/-/g, '/') + ' 00:00:00', name: 'End Date', type: 'DATETIME', readOnly: false },
                { key: 'COGS_OR_OPEX', value: expenseType, name: 'Expense Type', type: 'STRING', readOnly: false },
                { key: 'GL_ACCOUNT', value: glAccount || '', name: 'GL Account', type: 'STRING', readOnly: false },
                { key: 'FINANCIAL_DEPARTMENT_CODE', value: deptCode || '', name: 'Department Number', type: 'STRING', readOnly: false },
                { key: 'PRODUCT_OWNER', value: productOwner || '', name: 'Product Owner', type: 'STRING', readOnly: false },
                { key: 'FINANCIAL_ANALYST_NAME', value: financialAnalyst || '', name: 'Financial Analyst', type: 'STRING', readOnly: false },
                { key: 'NODE_LEVEL02_NAME_HIER', value: '', name: 'Level 2 Leader', type: 'STRING', readOnly: false },
                { key: 'NODE_LEVEL03_NAME', value: '', name: 'Level 3 Leader', type: 'STRING', readOnly: false },
            ];

            const res = await fetch('/api/datalake/v1/attributes/purchaseorders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields }),
            });

            if (!res.ok) throw new Error('Failed to create PO');

            const data = await res.json();
            toast.success(`Draft PO ${data.poNumber} created successfully`);
            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to create draft PO');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Draft Purchase Order</DialogTitle>
                    <DialogDescription>Create a new PO manually. It will start in Draft status.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Vendor Name *</label>
                            <Input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g., MICROSOFT" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">PO Description *</label>
                            <Input value={poDescription} onChange={e => setPODescription(e.target.value)} placeholder="e.g., Azure Enterprise Agreement" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Purchase Type *</label>
                            <Select value={purchaseType} onValueChange={setPurchaseType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Software">Software</SelectItem>
                                    <SelectItem value="Hardware">Hardware</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Total Amount (USD) *</label>
                            <Input value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="500000" type="number" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Expense Type *</label>
                            <Select value={expenseType} onValueChange={setExpenseType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEX">OPEX</SelectItem>
                                    <SelectItem value="COGS">COGS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Start Date *</label>
                            <Input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">End Date *</label>
                            <Input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">GL Account</label>
                            <Input value={glAccount} onChange={e => setGlAccount(e.target.value)} placeholder="GL-XXX-XX" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Department Code</label>
                            <Input value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="D-XXXX" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Product Owner</label>
                            <Input value={productOwner} onChange={e => setProductOwner(e.target.value)} placeholder="Name" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Financial Analyst</label>
                            <Input value={financialAnalyst} onChange={e => setFinancialAnalyst(e.target.value)} placeholder="Name" />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Draft PO'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npm run build` — should compile with no errors for this file (it won't be imported yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/add-draft-po-modal.tsx
git commit -m "feat: add Draft PO creation modal component"
```

---

### Task 3: Rewrite Inbound PO Page (viewasset)

**Files:**
- Modify: `src/app/home/viewasset/page.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `src/app/home/viewasset/page.tsx`**

```typescript
'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, RotateCcw, Plus } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RenewalModal } from "@/components/renewal-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AddDraftPOModal } from "@/components/add-draft-po-modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface RawDataItem {
    key: string;
    value: string | number;
    name: string;
}

interface PurchaseOrder {
    VENDOR_NAME: string;
    PO_DESCRIPTION: string;
    PO_NUMBER: string;
    TOTAL_AMOUNT_USD: string;
    PO_START_DATE: string;
    PO_END_DATE: string;
    NODE_LEVEL02_NAME_HIER: string;
    NODE_LEVEL03_NAME: string;
    FINANCIAL_DEPARTMENT_CODE: string;
    GL_ACCOUNT: string;
    COGS_OR_OPEX: string;
    PRODUCT_OWNER: string;
    PO_STATUS: string;
    FISCAL_YEAR: string;
    FINANCIAL_ANALYST_NAME: string;
    PURCHASE_TYPE: string;
}

const STATUS_COLORS: Record<string, string> = {
    Draft: 'text-blue-800 bg-blue-100',
    Approved: 'text-green-800 bg-green-100',
    Signed: 'text-indigo-800 bg-indigo-100',
    Ignored: 'text-gray-600 bg-gray-100',
};

const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' });
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();

    return json.purchaseOrderRows.map((row: RawDataItem[]) => {
        const po: Record<string, any> = {};
        row.forEach((item) => { po[item.key] = item.value; });
        po['PO_DESCRIPTION'] = po['PO_DESCRIPTION'] || po['VENDOR_NAME'] || 'Unknown';
        po['FISCAL_YEAR'] = po['FISCAL_YEAR'] || 'Unknown';
        po['PURCHASE_TYPE'] = po['PURCHASE_TYPE'] || 'Software';
        po['PO_STATUS'] = po['PO_STATUS'] || 'Draft';
        return po as PurchaseOrder;
    }).filter((po: PurchaseOrder) => po.PO_STATUS !== 'Active');
};

export default function ViewAssetPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({ queryKey: ['purchaseOrders'], queryFn: fetchPurchaseOrders });

    const [rowSelection, setRowSelection] = useState({});
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('All');
    const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<string>('All');

    const [isAddDraftOpen, setIsAddDraftOpen] = useState(false);
    const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
    const [selectedVendorForRenewal, setSelectedVendorForRenewal] = useState<string | undefined>(undefined);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ title: '', description: '', confirmText: '', variant: 'default' as 'default' | 'destructive', action: '' });

    const uniqueFiscalYears = Array.from(new Set(data?.map(po => po.FISCAL_YEAR).filter(Boolean))).sort();

    const filteredData = data?.filter(po => {
        if (statusFilter !== 'All' && po.PO_STATUS !== statusFilter) return false;
        if (selectedFiscalYear !== 'All' && String(po.FISCAL_YEAR) !== selectedFiscalYear) return false;
        if (purchaseTypeFilter !== 'All' && po.PURCHASE_TYPE !== purchaseTypeFilter) return false;
        return true;
    }) || [];

    const statusCounts = {
        All: data?.length || 0,
        Draft: data?.filter(po => po.PO_STATUS === 'Draft').length || 0,
        Approved: data?.filter(po => po.PO_STATUS === 'Approved').length || 0,
        Signed: data?.filter(po => po.PO_STATUS === 'Signed').length || 0,
        Ignored: data?.filter(po => po.PO_STATUS === 'Ignored').length || 0,
    };

    const updatePOStatus = async (poNumbers: string[], status: string) => {
        const promises = poNumbers.map(poNumber =>
            fetch('/api/datalake/v1/attributes/purchaseorders', {
                method: 'PATCH',
                body: JSON.stringify({ poNumber, status }),
                headers: { 'Content-Type': 'application/json' }
            })
        );
        try {
            const results = await Promise.all(promises);
            const failures = results.filter(r => !r.ok);
            if (failures.length > 0) {
                toast.error(`Failed to update ${failures.length} PO(s)`);
            } else {
                toast.success(`Successfully updated ${poNumbers.length} PO(s) to ${status}`);
            }
            queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
            queryClient.invalidateQueries({ queryKey: ['gpsPortfolio'] });
            queryClient.invalidateQueries({ queryKey: ['financial-portfolio'] });
            setRowSelection({});
        } catch (err) {
            toast.error("An error occurred while updating PO status");
            console.error(err);
        }
    };

    const getSelectedPOs = () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        return selectedIndices.map(idx => filteredData[idx]).filter(Boolean);
    };

    const openConfirm = (title: string, description: string, confirmText: string, action: string, variant: 'default' | 'destructive' = 'default') => {
        setConfirmConfig({ title, description, confirmText, variant, action });
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        const selected = getSelectedPOs();
        if (selected.length === 0) return;
        const poNumbers = selected.map(po => po.PO_NUMBER);

        switch (confirmConfig.action) {
            case 'approve':
                await updatePOStatus(poNumbers, 'Approved');
                break;
            case 'sign':
                await updatePOStatus(poNumbers, 'Signed');
                break;
            case 'ignore':
                await updatePOStatus(poNumbers, 'Ignored');
                break;
            case 'revert':
                await updatePOStatus(poNumbers, 'Draft');
                break;
            case 'send-new':
                await updatePOStatus(poNumbers, 'Active');
                break;
        }
    };

    const handleSendAsRenewal = () => {
        const selected = getSelectedPOs();
        if (selected.length === 0) { toast.error("Select at least one signed PO"); return; }
        if (selected.some(po => po.PO_STATUS !== 'Signed')) { toast.error("Only signed POs can be sent"); return; }
        if (selected.length > 1) { toast.error("Select only one PO for renewal"); return; }
        updatePOStatus([selected[0].PO_NUMBER], 'Active').then(() => {
            setSelectedVendorForRenewal(selected[0].VENDOR_NAME);
            setIsRenewalModalOpen(true);
        });
    };

    const handleRenewalConfirm = (existingPo: any) => {
        toast.success(`Associated with existing PO: ${existingPo.id}`);
    };

    const columns: ColumnDef<PurchaseOrder>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "VENDOR_NAME",
            header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Vendor Name<ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
        },
        {
            accessorKey: "PO_DESCRIPTION",
            header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>PO Description<ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
        },
        {
            accessorKey: "PO_NUMBER",
            header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>PO Number<ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
        },
        {
            accessorKey: "PURCHASE_TYPE",
            header: "Purchase Type",
            cell: ({ row }) => {
                const type = row.getValue("PURCHASE_TYPE") as string;
                const color = type === 'Hardware' ? 'text-amber-800 bg-amber-100' : 'text-sky-800 bg-sky-100';
                return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{type}</span>;
            },
        },
        {
            accessorKey: "PO_STATUS",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("PO_STATUS") as string;
                const color = STATUS_COLORS[status] || 'text-gray-600 bg-gray-100';
                return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
            },
        },
        {
            accessorKey: "TOTAL_AMOUNT_USD",
            header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>PO Amount<ArrowUpDown className="ml-2 h-4 w-4" /></Button>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("TOTAL_AMOUNT_USD"));
                return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
            },
        },
        {
            accessorKey: "PO_START_DATE",
            header: "Start Date",
            cell: ({ row }) => {
                const dateStr = row.getValue("PO_START_DATE") as string;
                return dateStr ? dateStr.split(' ')[0] : 'N/A';
            },
        },
        {
            accessorKey: "PO_END_DATE",
            header: "End Date",
            cell: ({ row }) => {
                const dateStr = row.getValue("PO_END_DATE") as string;
                return dateStr ? dateStr.split(' ')[0] : 'N/A';
            },
        },
        {
            accessorKey: "COGS_OR_OPEX",
            header: "Expense Type",
        },
        {
            accessorKey: "PRODUCT_OWNER",
            header: "Product Owner",
        },
        {
            accessorKey: "FINANCIAL_ANALYST_NAME",
            header: "Financial Analyst",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const status = row.original.PO_STATUS;
                const poNumber = row.original.PO_NUMBER;

                if (status === 'Draft') {
                    return (
                        <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-green-700 hover:bg-green-50" onClick={() => updatePOStatus([poNumber], 'Approved')}>✓ Approve</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-700 hover:bg-red-50" onClick={() => updatePOStatus([poNumber], 'Ignored')}>✗</Button>
                        </div>
                    );
                }
                if (status === 'Approved') {
                    return (
                        <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-700 hover:bg-indigo-50" onClick={() => updatePOStatus([poNumber], 'Signed')}>✍ Sign</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-700 hover:bg-red-50" onClick={() => updatePOStatus([poNumber], 'Ignored')}>✗</Button>
                        </div>
                    );
                }
                if (status === 'Ignored') {
                    return <Button size="sm" variant="ghost" className="h-7 text-xs text-orange-700 hover:bg-orange-50" onClick={() => updatePOStatus([poNumber], 'Draft')}><RotateCcw className="mr-1 h-3 w-3" />Revert</Button>;
                }
                return null;
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inbound Purchase Order</h1>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading data. Please try again later.</div>;
    }

    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inbound Purchase Order</h1>
                    <p className="text-sm text-gray-500 mt-1">Review, approve, and sign incoming purchase orders.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Fiscal Year" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Fiscal Years</SelectItem>
                            {uniqueFiscalYears.map(fy => <SelectItem key={fy} value={String(fy)}>FY {fy}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddDraftOpen(true)} className="gap-1">
                        <Plus className="h-4 w-4" /> Add Draft PO
                    </Button>
                </div>
            </div>

            {/* Bordered container */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Filter pills + search */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex gap-1.5">
                        {(['All', 'Draft', 'Approved', 'Signed', 'Ignored'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => { setStatusFilter(status); setRowSelection({}); }}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    statusFilter === status
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {status} ({statusCounts[status]})
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Select value={purchaseTypeFilter} onValueChange={setPurchaseTypeFilter}>
                            <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Hardware">Hardware</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={filteredData}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                />

                {/* Bulk actions bar */}
                {selectedCount > 0 && (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-200">
                        <span className="text-xs text-gray-600">{selectedCount} selected</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                                onClick={() => openConfirm('Approve Purchase Orders', `Approve ${selectedCount} selected PO(s)?`, 'Approve', 'approve')}>
                                ✓ Approve Selected
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-50"
                                onClick={() => openConfirm('Ignore Purchase Orders', `Ignore ${selectedCount} selected PO(s)?`, 'Ignore', 'ignore', 'destructive')}>
                                ✗ Ignore Selected
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Send buttons outside bordered container */}
            <div className="flex justify-end gap-2">
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                        const selected = getSelectedPOs();
                        if (selected.length === 0) { toast.error("Select at least one signed PO"); return; }
                        if (selected.some(po => po.PO_STATUS !== 'Signed')) { toast.error("Only signed POs can be sent"); return; }
                        openConfirm('Send as New', `Send ${selected.length} PO(s) to GPS Portfolio & Financial Analyst Portfolio?`, 'Send', 'send-new');
                    }}
                >
                    Send as New →
                </Button>
                <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleSendAsRenewal}>
                    Send as Renewal →
                </Button>
            </div>
            <p className="text-xs text-gray-400 text-right -mt-2">Sends selected Signed POs to GPS Portfolio & Financial Analyst Portfolio</p>

            {/* Modals */}
            <AddDraftPOModal isOpen={isAddDraftOpen} onClose={() => setIsAddDraftOpen(false)} onSuccess={() => queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] })} />

            <RenewalModal isOpen={isRenewalModalOpen} onClose={() => setIsRenewalModalOpen(false)} onConfirm={handleRenewalConfirm} initialVendorName={selectedVendorForRenewal} />

            <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)} onConfirm={handleConfirm} title={confirmConfig.title} description={confirmConfig.description} confirmText={confirmConfig.confirmText} variant={confirmConfig.variant} />
        </div>
    );
}
```

- [ ] **Step 2: Verify the page loads**

Open http://localhost:3001/home/viewasset — should see the new layout with filter pills, status badges, per-row actions, and the "+ Add Draft PO" button.

- [ ] **Step 3: Test the workflow**

1. Click "Approve" on a Draft PO → status changes to Approved
2. Click "Sign" on an Approved PO → status changes to Signed
3. Select a Signed PO, click "Send as New →" → PO disappears from the list
4. Click "+ Add Draft PO" → form modal opens, fill and submit → new PO appears in table
5. Click filter pills → table filters correctly

- [ ] **Step 4: Commit**

```bash
git add src/app/home/viewasset/page.tsx
git commit -m "feat: rewrite Inbound PO page with workflow, filter pills, per-row actions"
```

---

### Task 4: Update GPS Portfolio to Use Shared API Data

**Files:**
- Modify: `src/app/home/gpsPortfolio/page.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `gpsPortfolio/page.tsx`**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

interface RawDataItem {
    key: string;
    value: string | number;
    name: string;
}

interface GPSPortfolioItem {
    vendor: string;
    poDescription: string;
    poNumber: string;
    purchaseType: string;
    amount: number;
    startDate: string;
    endDate: string;
    expenseType: string;
    productOwner: string;
    financialAnalyst: string;
    glAccount: string;
    deptCode: string;
}

const columns: ColumnDef<GPSPortfolioItem>[] = [
    { accessorKey: "vendor", header: "Vendor" },
    { accessorKey: "poDescription", header: "PO Description" },
    { accessorKey: "poNumber", header: "PO Number" },
    { accessorKey: "purchaseType", header: "Purchase Type" },
    {
        accessorKey: "amount",
        header: "PO Amount",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
        },
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => { const d = row.getValue("startDate") as string; return d ? d.split(' ')[0] : 'N/A'; },
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => { const d = row.getValue("endDate") as string; return d ? d.split(' ')[0] : 'N/A'; },
    },
    { accessorKey: "expenseType", header: "Expense Type" },
    { accessorKey: "productOwner", header: "Product Owner" },
    { accessorKey: "financialAnalyst", header: "Financial Analyst" },
    { accessorKey: "glAccount", header: "GL Account" },
    { accessorKey: "deptCode", header: "Dept Number" },
];

const fetchGPSPortfolio = async (): Promise<GPSPortfolioItem[]> => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();

    return json.purchaseOrderRows
        .map((row: RawDataItem[]) => {
            const get = (key: string) => row.find(f => f.key === key)?.value ?? '';
            return {
                vendor: get('VENDOR_NAME'),
                poDescription: get('PO_DESCRIPTION'),
                poNumber: get('PO_NUMBER'),
                purchaseType: get('PURCHASE_TYPE') || 'Software',
                amount: parseFloat(String(get('TOTAL_AMOUNT_USD'))) || 0,
                startDate: get('PO_START_DATE'),
                endDate: get('PO_END_DATE'),
                expenseType: get('COGS_OR_OPEX'),
                productOwner: get('PRODUCT_OWNER'),
                financialAnalyst: get('FINANCIAL_ANALYST_NAME'),
                glAccount: get('GL_ACCOUNT'),
                deptCode: get('FINANCIAL_DEPARTMENT_CODE'),
                status: get('PO_STATUS'),
            };
        })
        .filter((po: any) => po.status === 'Active');
};

export default function GPSPortfolioPage() {
    const { data, isLoading, error } = useQuery({ queryKey: ['gpsPortfolio'], queryFn: fetchGPSPortfolio });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">GPS Portfolio</h2>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) return <div className="text-red-500">Error loading data</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-medium text-gray-600">GPS Portfolio</h2>
                <p className="text-sm text-gray-500 mt-1">Purchase and Renewal Forecasts View for Global Purchase Services</p>
            </div>
            {data && data.length > 0 ? (
                <DataTable columns={columns} data={data} />
            ) : (
                <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-xl">
                    <p className="text-sm">No active purchase orders yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Sign and send POs from the Inbound Purchase Order screen to see them here.</p>
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Verify the page loads**

Open http://localhost:3001/home/gpsPortfolio — should show empty state (no Active POs yet) or Active POs if you already sent some in Task 3 testing.

- [ ] **Step 3: Commit**

```bash
git add src/app/home/gpsPortfolio/page.tsx
git commit -m "feat: GPS Portfolio now fetches Active POs from shared API"
```

---

### Task 5: Update Financial Analyst Portfolio to Filter Active POs

**Files:**
- Modify: `src/app/home/financialAnalystsPortfolio/page.tsx`

- [ ] **Step 1: Update the fetch function to filter Active POs**

Find the `fetchPOs` or equivalent function that fetches from `/api/datalake/v1/attributes/purchaseorders`. In the current code (around line 110-130), the filter is:

```typescript
return allPos.filter((po: any) => po.status === 'Active' || po.status === 'In Progress' || po.status === 'Completed');
```

Change it to filter only `Active` status POs:

```typescript
return allPos.filter((po: any) => po.PO_STATUS === 'Active' || po.status === 'Active');
```

This is in the `fetchPortfolioData` function. The key insight: this page already fetches POs and shows them in a table. Just ensure it only shows POs with `Active` status (which are POs that have been signed and sent from the Inbound screen).

- [ ] **Step 2: Verify the page loads**

Open http://localhost:3001/home/financialAnalystsPortfolio — should show Active POs only (same ones that appear on GPS Portfolio).

- [ ] **Step 3: Commit**

```bash
git add src/app/home/financialAnalystsPortfolio/page.tsx
git commit -m "feat: Financial Analyst Portfolio filters to Active POs only"
```

---

### Task 6: Global Renames — Publisher to Vendor, Software Purchase to Purchase

**Files:**
- Rename: `src/components/publisher-360/` → `src/components/vendor-360/`
- Rename: `src/app/home/publisher-360/` → `src/app/home/vendor-360/`
- Rename: `src/app/api/publisher-360/` → `src/app/api/vendor-360/`
- Rename: `src/lib/publisher-360-data.ts` → `src/lib/vendor-360-data.ts`
- Modify: All files with "publisher" or "Publisher" references
- Modify: `src/app/api/account/v1/accounts/accesslevels/[userid]/route.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rename directories and files**

```bash
cd /Users/ankitagarawal/Downloads/capgemini/Project/SAM-gravity/umg

# Rename component directory
mv src/components/publisher-360 src/components/vendor-360

# Rename app route directory
mv src/app/home/publisher-360 src/app/home/vendor-360

# Rename API route directory
mv src/app/api/publisher-360 src/app/api/vendor-360

# Rename data file
mv src/lib/publisher-360-data.ts src/lib/vendor-360-data.ts
```

- [ ] **Step 2: Find and replace all import paths and references**

In every `.tsx` and `.ts` file under `src/`, replace:
- `publisher-360` → `vendor-360`
- `Publisher` → `Vendor` (in UI strings, variable names, component names)
- `publisher` → `vendor` (in variable names, function names)
- `"Software Purchase"` → `"Purchase"`
- `"SW Purchase"` → `"Purchase"`
- `"software publishers"` → `"vendors"`

Key files to update:
- `src/app/home/vendor-360/page.tsx` — update all `publisher` imports to `vendor`
- `src/components/vendor-360/*.tsx` — update all internal references
- `src/lib/vendor-360-data.ts` — update function/variable names
- `src/app/page.tsx` — update module card names ("Publisher 360° View" → "Vendor 360° View")
- `src/app/home/gpsPortfolio/page.tsx` — already handled in Task 4 ("Publisher" column → "Vendor")

- [ ] **Step 3: Update the access levels API mock**

In `src/app/api/account/v1/accounts/accesslevels/[userid]/route.ts`, update:
- GPS Portfolio description: `"GPS Portfolio : SW Purchase and Renewal Forecasts View for Global Purchase Services"` → `"GPS Portfolio : Purchase and Renewal Forecasts View for Global Purchase Services"`

- [ ] **Step 4: Update landing page module injection**

In `src/app/page.tsx`, update the Publisher 360 module injection (around line 75-88):
- `moduleName: 'Publisher 360° View'` → `moduleName: 'Vendor 360° View'`
- `moduleDescription`: replace "software publishers" → "vendors"
- `moduleUri: '/home/publisher-360'` → `moduleUri: '/home/vendor-360'`
- Update the `modules.find()` check to look for `'Vendor 360° View'`
- Update the `getIcon` function: `name.includes('Publisher 360')` → `name.includes('Vendor 360')`

- [ ] **Step 5: Verify the app builds and all renamed pages load**

Run: `npm run build`

Then test:
- http://localhost:3001 — landing page should show "Vendor 360° View" card
- http://localhost:3001/home/vendor-360 — should load the renamed page
- http://localhost:3001/home/gpsPortfolio — should show "Vendor" column header

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename Publisher to Vendor and Software Purchase to Purchase across app"
```

---

### Task 7: End-to-End Integration Test

**Files:** None (manual testing)

- [ ] **Step 1: Test the full PO workflow**

1. Go to http://localhost:3001/home/viewasset
2. Click "+ Add Draft PO" → fill form → submit → verify new PO appears with "Draft" status
3. Click "Approve" on a Draft PO → verify status changes to "Approved"
4. Click "Sign" on an Approved PO → verify status changes to "Signed"
5. Select a Signed PO → click "Send as New →" → confirm → verify PO disappears from table
6. Go to http://localhost:3001/home/gpsPortfolio → verify the sent PO appears here
7. Go to http://localhost:3001/home/financialAnalystsPortfolio → verify the sent PO appears here too

- [ ] **Step 2: Test filter pills**

1. Click "Draft" pill → only Draft POs shown
2. Click "Approved" pill → only Approved POs shown
3. Click "Ignored" pill → only Ignored POs shown
4. Click "All" pill → all POs shown
5. Use Purchase Type dropdown → filters correctly

- [ ] **Step 3: Test bulk actions**

1. Select multiple Draft POs → click "Approve Selected" → all move to Approved
2. Select multiple POs → click "Ignore Selected" → all move to Ignored
3. Go to Ignored filter → select POs → click Revert on each → they return to Draft

- [ ] **Step 4: Test Send as Renewal**

1. Sign a PO → select it → click "Send as Renewal →"
2. Verify Renewal Modal opens with vendor pre-filled
3. Confirm → verify PO moves to Active and appears on GPS & FA pages

- [ ] **Step 5: Test renames**

1. http://localhost:3001 → verify "Vendor 360° View" card (not "Publisher")
2. http://localhost:3001/home/vendor-360 → page loads
3. http://localhost:3001/home/gpsPortfolio → "Vendor" column header, description says "Purchase" not "SW Purchase"

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address integration test findings"
```
