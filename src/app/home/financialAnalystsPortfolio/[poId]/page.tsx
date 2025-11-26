'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// --- Interfaces ---
interface POField {
    key: string;
    value: string | number;
    name: string;
    type: string;
    readOnly: boolean;
}

// --- Fetcher ---
const fetchPODetails = async (poId: string) => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch POs');
    const json = await res.json();

    const rows: POField[][] = json.purchaseOrderRows;
    const matchedRow = rows.find(row => {
        const poNum = row.find(f => f.key === 'PO_NUMBER')?.value;
        return String(poNum) === poId;
    });

    if (!matchedRow) throw new Error('PO not found');
    return matchedRow;
};

// --- Helper Components ---

const HeaderCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <th className={`px-2 py-1 bg-[#3b82f6] text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap ${className}`}>
        <div className="flex items-center justify-center gap-1">
            {children}
            {/* Add info icon if needed, logic can be extended */}
        </div>
    </th>
);

const DataCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <td className={`px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap ${className}`}>
        {children}
    </td>
);

const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-sm font-bold text-gray-800 mb-1 mt-4">{title}</h3>
);

const FinancialGrid = ({ title, years = ['FY26', 'FY27'], data }: { title: string, years?: string[], data?: any }) => {
    return (
        <div className="mb-4">
            <SectionTitle title={title} />
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {years.map(year => (
                                <React.Fragment key={year}>
                                    <HeaderCell className="bg-[#2563eb]">{title} <br /> Q1{year}</HeaderCell>
                                    <HeaderCell className="bg-[#2563eb]">{title} <br /> Q2{year}</HeaderCell>
                                    <HeaderCell className="bg-[#2563eb]">{title} <br /> Q3{year}</HeaderCell>
                                    <HeaderCell className="bg-[#2563eb]">{title} <br /> Q4{year}</HeaderCell>
                                    <HeaderCell className="bg-[#9ca3af] text-gray-900">{title} <br /> Total{year}</HeaderCell>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {years.map(year => (
                                <React.Fragment key={year}>
                                    <DataCell>$0</DataCell>
                                    <DataCell>$0</DataCell>
                                    <DataCell>$0</DataCell>
                                    <DataCell>$0</DataCell>
                                    <DataCell className="bg-gray-100 font-semibold">$0</DataCell>
                                </React.Fragment>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UpliftGrid = ({ title, type }: { title: string, type: 'price' | 'volume' | 'expansion' | 'final' }) => {
    const bgHeader = type === 'final' ? 'bg-[#4b5563]' : 'bg-[#2563eb]';
    return (
        <div className="mb-4">
            <SectionTitle title={title} />
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <HeaderCell className={`${bgHeader} w-24`}>{type === 'final' ? 'Total Uplift %' : `${type === 'price' ? 'Price' : type === 'volume' ? 'Volume' : 'Expansion'} Change %`}</HeaderCell>
                        <HeaderCell className={bgHeader}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q1FY26</HeaderCell>
                        <HeaderCell className={bgHeader}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q2FY26</HeaderCell>
                        <HeaderCell className={bgHeader}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q3FY26</HeaderCell>
                        <HeaderCell className={bgHeader}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q4FY26</HeaderCell>
                        <HeaderCell className="bg-[#9ca3af] text-gray-900">{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> TotalFY26</HeaderCell>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <DataCell>0%</DataCell>
                        <DataCell>$0</DataCell>
                        <DataCell>$0</DataCell>
                        <DataCell>$0</DataCell>
                        <DataCell>$0</DataCell>
                        <DataCell className="bg-gray-100 font-semibold">$0</DataCell>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default function SinglePOPage() {
    const params = useParams();
    const poId = params.poId as string;
    const router = useRouter();

    const { data: poFields, isLoading, error } = useQuery({
        queryKey: ['poDetails', poId],
        queryFn: () => fetchPODetails(poId),
        enabled: !!poId,
    });

    if (isLoading) return <div className="p-8"><Skeleton className="h-12 w-1/3 mb-4" /><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>;
    if (!poFields) return <div className="p-8">PO not found</div>;

    const getVal = (key: string) => poFields.find(f => f.key === key)?.value || '-';

    // Helper to format currency
    const fmt = (val: string | number) => {
        if (val === '-' || val === '') return '-';
        const num = Number(val);
        return isNaN(num) ? val : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="min-h-screen bg-white p-4 text-xs">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-6 w-6">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-bold text-gray-800">Details of Selected PO: (Fiscal Year : {getVal('FISCAL_YEAR')})</h1>
                    <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-7 px-3 text-xs">EDIT</Button>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#1e40af]"></div> Main/Signed PO Fields</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#93c5fd]"></div> Renewal Period Fields</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#6b7280]"></div> Common Financial Fields</div>
                </div>
            </div>

            {/* Main PO Data */}
            <SectionTitle title="Main PO Data" />
            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <HeaderCell>Expense Category <Info className="w-3 h-3 ml-1 inline" /></HeaderCell>
                            <HeaderCell>Cost Pool</HeaderCell>
                            <HeaderCell>SW Usage Category <Info className="w-3 h-3 ml-1 inline" /></HeaderCell>
                            <HeaderCell>SW Category</HeaderCell>
                            <HeaderCell>Department Number</HeaderCell>
                            <HeaderCell>PO#</HeaderCell>
                            <HeaderCell className="bg-[#9ca3af] text-gray-900">COGS / OPEX</HeaderCell>
                            <HeaderCell>Level 2 Leader <Info className="w-3 h-3 ml-1 inline" /></HeaderCell>
                            <HeaderCell>Level 3 Leader</HeaderCell>
                            <HeaderCell>Level 4 Leader</HeaderCell>
                            <HeaderCell>Level 5 Leader</HeaderCell>
                            <HeaderCell>Business Owner</HeaderCell>
                            <HeaderCell>Product Owner <Info className="w-3 h-3 ml-1 inline" /></HeaderCell>
                            <HeaderCell>Biz Ops Owner</HeaderCell>
                            <HeaderCell>Opportunity Contact</HeaderCell>
                            <HeaderCell>Competitive Software</HeaderCell>
                            <HeaderCell>Redundant Software</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <DataCell>-</DataCell>
                            <DataCell>-</DataCell>
                            <DataCell>-</DataCell>
                            <DataCell>Below 300K</DataCell>
                            <DataCell>{getVal('FINANCIAL_DEPARTMENT_CODE')}</DataCell>
                            <DataCell>{getVal('PO_NUMBER')}</DataCell>
                            <DataCell className="bg-gray-100">{getVal('COGS_OR_OPEX')}</DataCell>
                            <DataCell>{getVal('NODE_LEVEL02_NAME_HIER')}</DataCell>
                            <DataCell>{getVal('NODE_LEVEL03_NAME')}</DataCell>
                            <DataCell>{getVal('NODE_LEVEL04_NAME')}</DataCell>
                            <DataCell>{getVal('NODE_LEVEL05_NAME')}</DataCell>
                            <DataCell>{getVal('NODE_LEVEL05_NAME')}</DataCell>
                            <DataCell>{getVal('PRODUCT_OWNER')}</DataCell>
                            <DataCell>-</DataCell>
                            <DataCell>-</DataCell>
                            <DataCell>-</DataCell>
                            <DataCell>-</DataCell>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Renewal PO Data */}
            <SectionTitle title="Renewal PO Data" />
            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">Department Number</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">PO#</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">PO Amount</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">PO Start Date</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">PO End Date</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">PO Term (Months)</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">Renewal Qtr</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">Deal Status</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">Opportunity Status</HeaderCell>
                            <HeaderCell className="bg-[#93c5fd] text-gray-900">Internal SSM Comments</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <DataCell>{getVal('FINANCIAL_DEPARTMENT_CODE')}</DataCell>
                            <DataCell>{getVal('PO_NUMBER')}</DataCell>
                            <DataCell>{fmt(getVal('TOTAL_AMOUNT_USD'))}</DataCell>
                            <DataCell>{getVal('PO_START_DATE')?.toString().split(' ')[0]}</DataCell>
                            <DataCell>{getVal('PO_END_DATE')?.toString().split(' ')[0]}</DataCell>
                            <DataCell>12</DataCell>
                            <DataCell>Q1 FY27</DataCell>
                            <DataCell>{getVal('RENEWAL_COMPLETE')}</DataCell>
                            <DataCell>{getVal('OPPORTUNITY_STATUS')}</DataCell>
                            <DataCell>-</DataCell>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Financial Grids Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                    <FinancialGrid title="Commit Amount" />
                    <FinancialGrid title="Actuals Amount" />
                    <FinancialGrid title="Forecast Amount" />
                    <FinancialGrid title="Potential Liability Amount" />
                </div>

                {/* Right Column - Uplifts */}
                <div>
                    <div className="text-right mb-2">
                        <h2 className="text-lg font-bold text-[#2563eb]">Uplifts for Renewal</h2>
                    </div>
                    <UpliftGrid title="Price Change" type="price" />
                    <UpliftGrid title="Volume Change" type="volume" />
                    <UpliftGrid title="Expansion" type="expansion" />
                    <UpliftGrid title="Final Forecasts" type="final" />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-2">
                <Link href={`/home/financialAnalystsPortfolio/${poId}/forecast`}>
                    <Button variant="outline">Manage 72-Month Forecast</Button>
                </Link>
                <Link href={`/home/financialAnalystsPortfolio/${poId}/renewal`}>
                    <Button>Go to Renewal Analysis</Button>
                </Link>
            </div>
        </div>
    );
}
