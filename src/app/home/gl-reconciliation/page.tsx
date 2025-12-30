"use client";

import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/gl-reconciliation/data-table';
import { GLDetailsDialog } from '@/components/gl-reconciliation/GLDetailsDialog';
import { GLReconciliationRecord } from '@/app/home/gl-reconciliation/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

// --- API Fetcher ---
const fetchGLData = async (): Promise<GLReconciliationRecord[]> => {
    const res = await fetch('/api/gl-reconciliation');
    if (!res.ok) throw new Error('Failed to fetch GL data');
    return res.json();
};

// --- Columns Definition ---
const columns: ColumnDef<GLReconciliationRecord>[] = [
    {
        accessorKey: "deptNumber",
        header: "Dept Number",
    },
    {
        accessorKey: "deptLevel2",
        header: "Department Level 2",
    },
    {
        accessorKey: "deptLevel3",
        header: "Department Level 3",
    },
    {
        accessorKey: "deptLevel4",
        header: "Department Level 4",
    },
    {
        accessorKey: "deptLevel5",
        header: "Department Level 5",
    },
    {
        accessorKey: "fiscalQuarter",
        header: "Fiscal Quarter",
    },
    {
        accessorKey: "fiscalMonth",
        header: "Fiscal Month",
    },
    {
        accessorKey: "actualAmount",
        header: "Actual Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("actualAmount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
];


// ... (existing code)

export default function GLReconciliationPage() {
    const [selectedRecord, setSelectedRecord] = useState<GLReconciliationRecord | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState("2024");

    const { data, isLoading, error } = useQuery({
        queryKey: ['gl-reconciliation'],
        queryFn: fetchGLData,
    });

    const handleRowDoubleClick = (record: GLReconciliationRecord) => {
        setSelectedRecord(record);
        setDialogOpen(true);
    };

    const filteredData = data ? data.filter(record => record.fiscalYear.toString() === selectedYear) : [];

    if (isLoading) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-500">Error loading data.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col gap-6 mb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Calendar className="h-4 w-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select Fiscal Year</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[180px] rounded-full bg-white border-blue-200 text-blue-600 font-bold focus:ring-blue-100">
                                <SelectValue placeholder="Fiscal Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">FY 2024</SelectItem>
                                <SelectItem value="2025">FY 2025</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reconciled General Ledger Transactions</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Monthly reconciled view of General Ledger Actuals with PO Forecasts, compared per Organization Leaders.
                        </p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>GL Reconciliation Data</CardTitle>
                    <CardDescription>Double-click a row to view detailed transactions regarding the GL Actuals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredData || []}
                        onRowDoubleClick={handleRowDoubleClick}
                    />
                </CardContent>
            </Card>

            <GLDetailsDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                record={selectedRecord}
            />
        </div>
    );
}
