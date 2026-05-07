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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((po: any) => po.status === 'Signed' || po.status === 'Active');
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
