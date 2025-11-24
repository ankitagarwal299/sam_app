'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, X } from 'lucide-react';

interface RenewalPO {
    "Department Number": number;
    "Vendor Name": string[];
    "Vendor ID": number[];
    "PO": string;
    "Funding Source": string | null;
    "Cogs Or Opex": string;
    "Known Change": string;
    "Business Owner": string;
    "Finance Controller": string;
    "Software Title": string;
    "PO Start Date": number;
    "PO End Date": number;
    "PO Amount": number;
}

const columns: ColumnDef<RenewalPO>[] = [
    {
        accessorKey: "Department Number",
        header: "Dept #",
    },
    {
        accessorKey: "Vendor Name",
        header: "Vendor Name",
        cell: ({ row }) => {
            const names = row.getValue("Vendor Name") as string[];
            return names.join(", ");
        },
    },
    {
        accessorKey: "PO",
        header: "PO #",
    },
    {
        accessorKey: "Software Title",
        header: "Software Title",
    },
    {
        accessorKey: "PO Start Date",
        header: "Start Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("PO Start Date"));
            return date.toLocaleDateString();
        },
    },
    {
        accessorKey: "PO End Date",
        header: "End Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("PO End Date"));
            return date.toLocaleDateString();
        },
    },
    {
        accessorKey: "PO Amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = row.getValue("PO Amount") as number;
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => {
            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50" title="Add">
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50" title="Renew">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50" title="Ignore">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];

const fetchRenewalPOs = async (): Promise<RenewalPO[]> => {
    const res = await fetch('/api/dataloader/v1/attributes/purchaseorders/aggregatePOWithoutMandatoryFY', {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await res.json();
    return json.purchaseOrderRows;
};

export default function RenewalPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['renewalPOs'],
        queryFn: fetchRenewalPOs,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Purchase Order Processing</h1>
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
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Purchase Order Processing</h1>
                <p className="text-sm text-gray-500">Available PO data to ADD, RENEW or IGNORE</p>
            </div>
            <DataTable columns={columns} data={data || []} />
        </div>
    );
}
