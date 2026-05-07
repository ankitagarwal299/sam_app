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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const [confirmConfig, setConfirmConfig] = useState({ title: '', description: '', confirmText: '', variant: 'default' as 'default' | 'destructive', action: '', poNumbers: [] as string[] });

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

    const openConfirm = (title: string, description: string, confirmText: string, action: string, variant: 'default' | 'destructive' = 'default', poNumbers?: string[]) => {
        setConfirmConfig({ title, description, confirmText, variant, action, poNumbers: poNumbers || [] });
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = async () => {
        const poNumbers = confirmConfig.poNumbers && confirmConfig.poNumbers.length > 0
            ? confirmConfig.poNumbers
            : getSelectedPOs().map(po => po.PO_NUMBER);
        if (poNumbers.length === 0) return;

        const statusMap: Record<string, string> = {
            approve: 'Approved',
            sign: 'Signed',
            ignore: 'Ignored',
            revert: 'Draft',
            'send-new': 'Active',
        };
        const newStatus = statusMap[confirmConfig.action];
        if (newStatus) await updatePOStatus(poNumbers, newStatus);
    };

    const confirmSinglePO = (po: PurchaseOrder, action: string, newStatus: string) => {
        const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(po.TOTAL_AMOUNT_USD));
        const details = `PO: ${po.PO_NUMBER} · ${po.VENDOR_NAME}\nDescription: ${po.PO_DESCRIPTION}\nAmount: ${amount}\nCurrent Status: ${po.PO_STATUS} → ${newStatus}`;

        const titles: Record<string, string> = {
            approve: 'Approve Purchase Order',
            sign: 'Sign Purchase Order',
            ignore: 'Ignore Purchase Order',
            revert: 'Revert to Draft',
        };
        const variant = action === 'ignore' ? 'destructive' as const : 'default' as const;
        openConfirm(titles[action] || 'Confirm', details, newStatus === 'Ignored' ? 'Ignore' : newStatus === 'Draft' ? 'Revert' : newStatus, action, variant, [po.PO_NUMBER]);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-green-700 hover:bg-green-50" onClick={() => confirmSinglePO(row.original, 'approve', 'Approved')}>✓ Approve</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-700 hover:bg-red-50" onClick={() => confirmSinglePO(row.original, 'ignore', 'Ignored')}>✗</Button>
                        </div>
                    );
                }
                if (status === 'Approved') {
                    return (
                        <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-700 hover:bg-indigo-50" onClick={() => confirmSinglePO(row.original, 'sign', 'Signed')}>✍ Sign</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-700 hover:bg-red-50" onClick={() => confirmSinglePO(row.original, 'ignore', 'Ignored')}>✗</Button>
                        </div>
                    );
                }
                if (status === 'Ignored') {
                    return <Button size="sm" variant="ghost" className="h-7 text-xs text-orange-700 hover:bg-orange-50" onClick={() => confirmSinglePO(row.original, 'revert', 'Draft')}><RotateCcw className="mr-1 h-3 w-3" />Revert</Button>;
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
                                onClick={() => {
                                    const selected = getSelectedPOs();
                                    const details = selected.map(po => `• ${po.PO_NUMBER} — ${po.VENDOR_NAME} (${po.PO_STATUS} → Approved)`).join('\n');
                                    openConfirm('Approve Purchase Orders', `Approve ${selectedCount} selected PO(s)?\n\n${details}`, 'Approve', 'approve');
                                }}>
                                ✓ Approve Selected
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                    const selected = getSelectedPOs();
                                    const details = selected.map(po => `• ${po.PO_NUMBER} — ${po.VENDOR_NAME} (${po.PO_STATUS} → Ignored)`).join('\n');
                                    openConfirm('Ignore Purchase Orders', `Ignore ${selectedCount} selected PO(s)?\n\n${details}`, 'Ignore', 'ignore', 'destructive');
                                }}>
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
                        const details = selected.map(po => `• ${po.PO_NUMBER} — ${po.VENDOR_NAME}`).join('\n');
                        openConfirm('Send as New', `Send ${selected.length} PO(s) to GPS Portfolio & Financial Analyst Portfolio?\n\n${details}`, 'Send', 'send-new');
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
