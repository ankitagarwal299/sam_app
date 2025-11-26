'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpRight, ArrowDownRight, DollarSign, Calendar, AlertCircle, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link'; // Added Link import
import { Button } from '@/components/ui/button';

// --- Interfaces ---
interface FinancialPortfolioData {
    kpis: {
        totalAnnualizedSpend: number;
        forecast: { cy: number; fy: number };
        commit: { cy: number; fy: number };
        actuals: { mtd: number; qtd: number; ytd: number };
        variance: number;
    };
    // pos: PO[]; // Removed, fetched separately
    forecastMatrix: ForecastRow[];
    actuals: ActualRow[];
    renewals: RenewalRow[];
}

interface POField {
    key: string;
    value: string | number;
    name: string;
    type: string;
    readOnly: boolean;
}

interface PO {
    id: string; // Derived from PO_NUMBER or VENDOR_ID
    poNumber: string;
    vendor: string;
    amount: number;
    fiscalYear: string;
    status: string;
    startDate: string;
    endDate: string;
    owner: string;
    // Add other fields as needed for display
    raw: POField[]; // Store raw fields for details
}

interface ForecastRow {
    poNumber: string;
    buckets: Record<string, number>;
}

interface ActualRow {
    date: string;
    poNumber: string;
    amount: number;
    account: string;
}

interface RenewalRow {
    poNumber: string;
    nextRenewalDate: string;
    expectedQuantity: number;
    unitPrice: number;
    term: string;
    risk: string;
    notes: string;
}

// --- API Fetchers ---
const fetchPortfolioData = async (): Promise<FinancialPortfolioData> => {
    const res = await fetch('/api/financial-portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
};

const fetchPOs = async (): Promise<PO[]> => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch POs');
    const json = await res.json();

    // Parse the Array of Arrays of Fields
    return json.purchaseOrderRows.map((row: POField[]) => {
        const getVal = (key: string) => row.find(f => f.key === key)?.value;

        return {
            id: String(getVal('PO_NUMBER') || getVal('VENDOR_ID') || Math.random()),
            poNumber: String(getVal('PO_NUMBER') || 'N/A'),
            vendor: String(getVal('VENDOR_NAME') || 'Unknown'),
            amount: Number(getVal('TOTAL_AMOUNT_USD') || 0),
            fiscalYear: String(getVal('FISCAL_YEAR') || ''),
            status: String(getVal('RENEWAL_COMPLETE') || 'Active'),
            startDate: String(getVal('PO_START_DATE') || ''),
            endDate: String(getVal('PO_END_DATE') || ''),
            owner: String(getVal('FINANCIAL_ANALYST_NAME') || ''),
            raw: row
        };
    });
};

// --- Column Definitions ---
const poColumns: ColumnDef<PO>[] = [
    {
        accessorKey: 'poNumber',
        header: 'PO Number',
        cell: ({ row }) => (
            <Link href={`/home/financialAnalystsPortfolio/${row.original.poNumber}`} className="text-blue-600 hover:underline">
                {row.getValue('poNumber')}
            </Link>
        )
    },
    { accessorKey: 'vendor', header: 'Vendor' },
    { accessorKey: 'fiscalYear', header: 'FY' },
    { accessorKey: 'startDate', header: 'Start Date' },
    { accessorKey: 'endDate', header: 'End Date' },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        }
    },
    { accessorKey: 'owner', header: 'Owner' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            let colorClass = 'text-gray-600 bg-gray-100';
            if (status === 'Completed') colorClass = 'text-green-600 bg-green-100';
            if (status === 'In Progress') colorClass = 'text-blue-600 bg-blue-100';
            return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{status}</span>;
        }
    },
];

const actualColumns: ColumnDef<ActualRow>[] = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'poNumber', header: 'PO Number' },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        }
    },
    { accessorKey: 'account', header: 'Account' },
];

const renewalColumns: ColumnDef<RenewalRow>[] = [
    { accessorKey: 'poNumber', header: 'PO Number' },
    { accessorKey: 'nextRenewalDate', header: 'Next Renewal' },
    { accessorKey: 'expectedQuantity', header: 'Exp. Qty' },
    {
        accessorKey: 'unitPrice',
        header: 'Unit Price',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('unitPrice'));
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        }
    },
    { accessorKey: 'term', header: 'Term' },
    {
        accessorKey: 'risk',
        header: 'Risk',
        cell: ({ row }) => {
            const risk = row.getValue('risk') as string;
            let color = 'text-gray-500';
            if (risk === 'High') color = 'text-red-500 font-bold';
            if (risk === 'Med') color = 'text-yellow-500 font-medium';
            if (risk === 'Low') color = 'text-green-500';
            return <span className={color}>{risk}</span>;
        }
    },
    { accessorKey: 'notes', header: 'Notes' },
];

// --- Main Component ---
export default function FinancialAnalystPortfolio() {
    const { data: portfolioData, isLoading: isPortfolioLoading, error: portfolioError } = useQuery({
        queryKey: ['financialPortfolio'],
        queryFn: fetchPortfolioData,
    });

    const { data: posData, isLoading: isPosLoading, error: posError } = useQuery({
        queryKey: ['portfolioPos'],
        queryFn: fetchPOs,
    });

    const isLoading = isPortfolioLoading || isPosLoading;
    const error = portfolioError || posError;

    if (isLoading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
    if (error) return <div className="p-8 text-red-500">Error loading portfolio data</div>;
    if (!portfolioData || !posData) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Financial Analyst Portfolio</h1>
                    <p className="text-gray-500 mt-1">Manage lifecycle of owned POs, forecasts, and renewals.</p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="2024">
                        <SelectTrigger className="w-[120px] bg-white">
                            <SelectValue placeholder="Fiscal Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">FY 2024</SelectItem>
                            <SelectItem value="2025">FY 2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[150px] bg-white">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Depts</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard title="Total Annualized Spend" value={portfolioData.kpis.totalAnnualizedSpend} icon={<DollarSign className="h-4 w-4 text-blue-500" />} />
                <KpiCard title="Forecast (FY)" value={portfolioData.kpis.forecast.fy} subValue={`CY: ${formatCurrency(portfolioData.kpis.forecast.cy)}`} icon={<Calendar className="h-4 w-4 text-purple-500" />} />
                <KpiCard title="Commit (FY)" value={portfolioData.kpis.commit.fy} subValue={`CY: ${formatCurrency(portfolioData.kpis.commit.cy)}`} icon={<ArrowUpRight className="h-4 w-4 text-green-500" />} />
                <KpiCard title="Actuals (YTD)" value={portfolioData.kpis.actuals.ytd} subValue={`MTD: ${formatCurrency(portfolioData.kpis.actuals.mtd)}`} icon={<ArrowDownRight className="h-4 w-4 text-orange-500" />} />
                <KpiCard title="Variance" value={portfolioData.kpis.variance} icon={<AlertCircle className="h-4 w-4 text-red-500" />} trend={portfolioData.kpis.variance > 0 ? 'negative' : 'positive'} />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="pos" className="w-full">
                <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
                    <TabsTrigger value="pos">POs</TabsTrigger>
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
                    <TabsTrigger value="commit">Commit</TabsTrigger>
                    <TabsTrigger value="actuals">Actuals</TabsTrigger>
                    <TabsTrigger value="renewals">Renewals</TabsTrigger>
                    <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>

                <TabsContent value="pos" className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Purchase Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={poColumns} data={posData} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="forecast" className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader><CardTitle>Forecast Matrix (72 Months)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">PO Number</th>
                                            {/* Simplified headers for demo */}
                                            <th className="px-6 py-3">2024-Q1</th>
                                            <th className="px-6 py-3">2024-Q2</th>
                                            <th className="px-6 py-3">2024-Q3</th>
                                            <th className="px-6 py-3">2024-Q4</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolioData.forecastMatrix.map((row) => (
                                            <tr key={row.poNumber} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{row.poNumber}</td>
                                                <td className="px-6 py-4">{formatCurrency(row.buckets['2024-Q1'] || 0)}</td>
                                                <td className="px-6 py-4">{formatCurrency(row.buckets['2024-Q2'] || 0)}</td>
                                                <td className="px-6 py-4">{formatCurrency(row.buckets['2024-Q3'] || 0)}</td>
                                                <td className="px-6 py-4">{formatCurrency(row.buckets['2024-Q4'] || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="commit" className="mt-6">
                    <div className="p-4 text-center text-gray-500">Commit functionality coming soon.</div>
                </TabsContent>

                <TabsContent value="actuals" className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader><CardTitle>Actuals Feed</CardTitle></CardHeader>
                        <CardContent>
                            <DataTable columns={actualColumns} data={portfolioData.actuals} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="renewals" className="mt-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader><CardTitle>Renewal Planning</CardTitle></CardHeader>
                        <CardContent>
                            <DataTable columns={renewalColumns} data={portfolioData.renewals} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="charts" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader><CardTitle>Forecast vs Actuals (Burn-up)</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-l border-gray-200 relative">
                                    {/* Simple CSS Bar Chart */}
                                    {[40, 55, 65, 80, 95, 100].map((h, i) => (
                                        <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                                            <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500 px-4">
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader><CardTitle>Variance Waterfall</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <div className="flex items-end gap-4 h-40">
                                            <div className="w-16 bg-green-500 h-32 rounded-t"></div>
                                            <div className="w-16 bg-red-400 h-12 rounded-t mb-20"></div>
                                            <div className="w-16 bg-blue-500 h-24 rounded-t"></div>
                                        </div>
                                        <p className="mt-4">Budget vs Spend vs Forecast</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- Helper Components & Functions ---

function KpiCard({ title, value, subValue, icon, trend }: { title: string, value: number, subValue?: string, icon: React.ReactNode, trend?: 'positive' | 'negative' }) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(value)}</div>
                {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
                {trend && (
                    <p className={`text-xs mt-1 ${trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'positive' ? '▼' : '▲'} {trend === 'positive' ? 'Under Budget' : 'Over Budget'}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
