'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, X } from 'lucide-react';

interface GPSPortfolioItem {
    "BU Name Software": string;
    "Title": string;
    "Publisher": string;
    "PO Description": string;
    "Biz Owner": string;
    "Opportunity Status": string;
    "Opportunity Category": string;
    "Strategic Intent": string;
    "License Rights": string;
    "Contract URL": string | null;
    "Board Approval Level": string;
    "Deal Status": string;
    "Total Realized Savings": number;
}

const columns: ColumnDef<GPSPortfolioItem>[] = [
    {
        accessorKey: "BU Name Software",
        header: "BU Name Software",
    },
    {
        accessorKey: "Title",
        header: "Title",
    },
    {
        accessorKey: "Publisher",
        header: "Publisher",
    },
    {
        accessorKey: "PO Description",
        header: "PO Description",
    },
    {
        accessorKey: "Biz Owner",
        header: "Biz Owner",
    },
    {
        accessorKey: "Opportunity Status",
        header: "Opportunity Status",
    },
    {
        accessorKey: "Opportunity Category",
        header: "Opportunity Category",
    },
    {
        accessorKey: "Strategic Intent",
        header: "Strategic Intent",
    },
    {
        accessorKey: "License Rights",
        header: "License Rights",
    },
    {
        accessorKey: "Contract URL",
        header: "Contract URL",
        cell: ({ row }) => {
            const url = row.getValue("Contract URL") as string;
            return url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Link
                </a>
            ) : "N/A";
        },
    },
    {
        accessorKey: "Board Approval Level",
        header: "Board Approval Level",
    },
    {
        accessorKey: "Deal Status",
        header: "Deal Status",
    },
    {
        accessorKey: "Total Realized Savings",
        header: "Total Realized Savings",
        cell: ({ row }) => {
            const amount = row.getValue("Total Realized Savings") as number;
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
        },
    },
];

const mockData: GPSPortfolioItem[] = [
    {
        "BU Name Software": "Finance",
        "Title": "Snowflake Enterprise",
        "Publisher": "Snowflake Inc.",
        "PO Description": "Annual subscription specifically for finance analytics.",
        "Biz Owner": "John Doe",
        "Opportunity Status": "Active",
        "Opportunity Category": "Renewal",
        "Strategic Intent": "Cost Optimization",
        "License Rights": "Enterprise",
        "Contract URL": "https://example.com/contract/123",
        "Board Approval Level": "Level 1",
        "Deal Status": "Negotiating",
        "Total Realized Savings": 50000,
    },
    {
        "BU Name Software": "Engineering",
        "Title": "Jira Cloud",
        "Publisher": "Atlassian",
        "PO Description": "Project management tool for 500 users.",
        "Biz Owner": "Jane Smith",
        "Opportunity Status": "Pending",
        "Opportunity Category": "New Purchase",
        "Strategic Intent": "Process Improvement",
        "License Rights": "Standard",
        "Contract URL": null,
        "Board Approval Level": "Level 2",
        "Deal Status": "Draft",
        "Total Realized Savings": 12000,
    },
    {
        "BU Name Software": "HR",
        "Title": "Workday HCM",
        "Publisher": "Workday",
        "PO Description": "Human Capital Management suite renewal.",
        "Biz Owner": "Robert Johnson",
        "Opportunity Status": "Review",
        "Opportunity Category": "Renewal",
        "Strategic Intent": "Compliance",
        "License Rights": "SaaS",
        "Contract URL": "https://example.com/contract/456",
        "Board Approval Level": "Level 1",
        "Deal Status": "Approved",
        "Total Realized Savings": 75000,
    },
];

const fetchGPSPortfolio = async (): Promise<GPSPortfolioItem[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData;
};

export default function RenewalPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['gpsPortfolio'],
        queryFn: fetchGPSPortfolio,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700">GPS Portfolio:</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Monthly reconciled view of General Ledger Actuals with PO Forecasts, compared per Organization Leaders.
                        </p>
                    </div>
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
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-medium text-gray-600">GPS Portfolio:</h2>
                <p className="text-sm text-gray-500 mt-1">
                    SW Purchase and Renewal Forecasts View for Global Purchase Services
                </p>
            </div>
            <DataTable columns={columns} data={data || []} />
        </div>
    );
}
