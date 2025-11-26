'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface RenewalRow {
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

const fetchRenewalData = async () => {
    const res = await fetch('/api/dataloader/v1/attributes/purchaseorders/aggregatePOWithoutMandatoryFY', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch renewal data');
    const json = await res.json();
    return json.purchaseOrderRows as RenewalRow[];
};

const columns: ColumnDef<RenewalRow>[] = [
    { accessorKey: 'PO', header: 'PO Number' },
    {
        accessorKey: 'Vendor Name',
        header: 'Vendor',
        cell: ({ row }) => row.original["Vendor Name"].join(', ')
    },
    { accessorKey: 'Software Title', header: 'Software' },
    { accessorKey: 'Known Change', header: 'Change Type' },
    {
        accessorKey: 'PO Amount',
        header: 'Amount',
        cell: ({ row }) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original["PO Amount"])
    },
    {
        accessorKey: 'PO End Date',
        header: 'End Date',
        cell: ({ row }) => new Date(row.original["PO End Date"]).toLocaleDateString()
    },
    { accessorKey: 'Business Owner', header: 'Business Owner' },
];

export default function RenewalPage() {
    const params = useParams();
    const poId = params.poId as string;
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ['renewalData', poId],
        queryFn: fetchRenewalData,
    });

    if (isLoading) return <div className="p-8"><Skeleton className="h-12 w-1/3 mb-4" /><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Renewal Analysis: {poId}</h1>
                    <p className="text-gray-500">Review and process renewal options.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Aggregated Renewal Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                    {data && <DataTable columns={columns} data={data} />}
                </CardContent>
            </Card>
        </div>
    );
}
