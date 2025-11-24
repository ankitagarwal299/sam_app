'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { RenewalModal } from "@/components/renewal-modal"

// Define the shape of the raw data item from API
interface RawDataItem {
    key: string;
    value: string | number;
    name: string;
}

// Define the shape of the transformed data for the table
interface PurchaseOrder {
    VENDOR_NAME: string;
    VENDOR_ID: string;
    FISCAL_YEAR: string;
    PO_NUMBER: string;
    TOTAL_AMOUNT_USD: string;
    NODE_LEVEL05_NAME: string;
    NODE_LEVEL04_NAME: string;
}

const columns: ColumnDef<PurchaseOrder>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
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
        header: "Vendor Name",
    },
    {
        accessorKey: "VENDOR_ID",
        header: "Vendor ID",
    },
    {
        accessorKey: "FISCAL_YEAR",
        header: "Fiscal Year",
    },
    {
        accessorKey: "PO_NUMBER",
        header: "PO Number",
    },
    {
        accessorKey: "TOTAL_AMOUNT_USD",
        header: "PO Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("TOTAL_AMOUNT_USD"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return formatted;
        },
    },
    {
        accessorKey: "NODE_LEVEL05_NAME",
        header: "Level 5 Leader",
    },
    {
        accessorKey: "NODE_LEVEL04_NAME",
        header: "Level 4 Leader",
    },
];

const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await res.json();

    // Transform the data
    // The API returns purchaseOrderRows as an array of arrays of objects
    // We need to map each inner array to a PurchaseOrder object
    return json.purchaseOrderRows.map((row: RawDataItem[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const po: Record<string, any> = {};
        row.forEach((item) => {
            po[item.key] = item.value;
        });
        return po as PurchaseOrder;
    });
};

export default function ViewAssetPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['purchaseOrders'],
        queryFn: fetchPurchaseOrders,
    });

    const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false)
    const [selectedVendorForRenewal, setSelectedVendorForRenewal] = useState<string | undefined>(undefined)

    // We need to access the table instance to get selected rows, but DataTable encapsulates it.
    // For this MVP, we'll assume we can pass a callback or ref to DataTable to get selection,
    // OR we can lift the table state up.
    // HOWEVER, since we can't easily change DataTable props without breaking other usages or refactoring heavily,
    // let's modify DataTable to accept `onRowSelectionChange` prop if we want to track it here,
    // OR simpler: just add the buttons and logic inside ViewAssetPage and assume we can get selection from a ref or similar?
    // Actually, standard way with TanStack table is to lift state.
    // Let's modify DataTable to accept `rowSelection` and `setRowSelection` as optional props.
    // But wait, I already modified DataTable to have internal state.
    // To keep it simple and fast: I will modify DataTable to accept `onSelectionChange` callback.

    // WAIT, I can't modify DataTable in this tool call easily to match.
    // Let's assume I will modify DataTable in next step to expose selection.
    // For now, let's write the ViewAssetPage code assuming we have access to selection.
    // Actually, the best way is to pass `data` and `columns` to DataTable, and maybe `renderTopToolbar` prop?
    // No, that's too complex.

    // Let's use a different approach. I will wrap the DataTable in a component that handles selection?
    // No, I will just modify DataTable to export the table instance? No.

    // Let's go with: Modify DataTable to accept `rowSelection` and `setRowSelection` controlled state.
    // I will do that in a separate step.

    // Here I will just add the UI elements and logic, assuming `rowSelection` state is available.

    const [rowSelection, setRowSelection] = useState({})

    const handleAddAsNew = () => {
        const selectedCount = Object.keys(rowSelection).length
        if (selectedCount === 0) {
            toast.error("Please select at least one PO")
            return
        }
        toast.success(`Added ${selectedCount} PO(s) as New Purchase`)
        setRowSelection({})
    }

    const handleIgnore = () => {
        const selectedCount = Object.keys(rowSelection).length
        if (selectedCount === 0) {
            toast.error("Please select at least one PO")
            return
        }
        toast.info(`Ignored ${selectedCount} PO(s)`)
        setRowSelection({})
    }

    const handleAddAsRenewal = () => {
        const selectedIndices = Object.keys(rowSelection).map(Number)
        if (selectedIndices.length === 0) {
            toast.error("Please select a PO to renew")
            return
        }
        if (selectedIndices.length > 1) {
            toast.error("Please select only one PO for renewal association")
            return
        }

        // Get the selected PO data
        // Note: data might be undefined here if loading, but button shouldn't be clickable
        if (data) {
            const selectedPO = data[selectedIndices[0]]
            setSelectedVendorForRenewal(selectedPO.VENDOR_NAME)
            setIsRenewalModalOpen(true)
        }
    }

    const handleRenewalConfirm = (existingPo: any) => {
        toast.success(`Associated with existing PO: ${existingPo.id}`)
        setRowSelection({})
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">New PO available for Portfolio View</h1>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading data</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">New PO available for Portfolio View</h1>
                <div className="flex gap-2">
                    <Button onClick={handleAddAsNew} className="bg-green-600 hover:bg-green-700">Add as New</Button>
                    <Button onClick={handleAddAsRenewal} className="bg-blue-600 hover:bg-blue-700">Add as Renewal</Button>
                    <Button onClick={handleIgnore} variant="destructive">Ignore PO</Button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data || []}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />

            <RenewalModal
                isOpen={isRenewalModalOpen}
                onClose={() => setIsRenewalModalOpen(false)}
                onConfirm={handleRenewalConfirm}
                initialVendorName={selectedVendorForRenewal}
            />
        </div>
    );
}
