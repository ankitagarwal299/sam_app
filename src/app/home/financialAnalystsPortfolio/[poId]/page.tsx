'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
                                    <th className="px-2 py-1 bg-[#2563eb] text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap">{title} <br /> Q1{year}</th>
                                    <th className="px-2 py-1 bg-[#2563eb] text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap">{title} <br /> Q2{year}</th>
                                    <th className="px-2 py-1 bg-[#2563eb] text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap">{title} <br /> Q3{year}</th>
                                    <th className="px-2 py-1 bg-[#2563eb] text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap">{title} <br /> Q4{year}</th>
                                    <th className="px-2 py-1 bg-[#9ca3af] text-gray-900 text-[10px] font-semibold border border-white/20 whitespace-nowrap">{title} <br /> Total{year}</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {years.map(year => (
                                <React.Fragment key={year}>
                                    <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                                    <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                                    <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                                    <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                                    <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap bg-gray-100 font-semibold">$0</td>
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
                        <th className={`px-2 py-1 ${bgHeader} text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap w-24`}>{type === 'final' ? 'Total Uplift %' : `${type === 'price' ? 'Price' : type === 'volume' ? 'Volume' : 'Expansion'} Change %`}</th>
                        <th className={`px-2 py-1 ${bgHeader} text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap`}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q1FY26</th>
                        <th className={`px-2 py-1 ${bgHeader} text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap`}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q2FY26</th>
                        <th className={`px-2 py-1 ${bgHeader} text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap`}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q3FY26</th>
                        <th className={`px-2 py-1 ${bgHeader} text-white text-[10px] font-semibold border border-white/20 whitespace-nowrap`}>{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> Q4FY26</th>
                        <th className="px-2 py-1 bg-[#9ca3af] text-gray-900 text-[10px] font-semibold border border-white/20 whitespace-nowrap">{type === 'final' ? 'Final Forecasts With Uplift' : `${title}`} <br /> TotalFY26</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">0%</td>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap">$0</td>
                        <td className="px-2 py-2 text-[11px] text-gray-700 border border-gray-200 text-center whitespace-nowrap bg-gray-100 font-semibold">$0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const FieldRow = ({ label, value, onChange, readOnly = false }: { label: string, value: string | number, onChange?: (val: string) => void, readOnly?: boolean }) => (
    <div className="flex flex-col gap-1 mb-3">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        {readOnly ? (
            <div className="text-sm text-gray-800 py-1.5 px-3 bg-gray-50 rounded border border-gray-200">{value || '-'}</div>
        ) : (
            <Input
                value={value || ''}
                onChange={(e) => onChange?.(e.target.value)}
                className="text-sm"
            />
        )}
    </div>
);


export default function SinglePOPage() {
    const params = useParams();
    const poId = params.poId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: poFields, isLoading, error } = useQuery({
        queryKey: ['poDetails', poId],
        queryFn: () => fetchPODetails(poId),
        enabled: !!poId,
    });

    // Editable state
    const [editData, setEditData] = useState<Record<string, string | number>>({});

    useEffect(() => {
        if (poFields) {
            const initialData: Record<string, string | number> = {};
            poFields.forEach(field => {
                initialData[field.key] = field.value;
            });
            setEditData(initialData);
        }
    }, [poFields]);

    const saveMutation = useMutation({
        mutationFn: async (data: Record<string, string | number>) => {
            const res = await fetch('/api/datalake/v1/attributes/purchaseorders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poNumber: poId, updates: data }),
            });
            if (!res.ok) throw new Error('Failed to save changes');
            return res.json();
        },
        onSuccess: () => {
            toast.success('Changes saved successfully!');
            queryClient.invalidateQueries({ queryKey: ['poDetails', poId] });
        },
        onError: () => {
            toast.error('Failed to save changes.');
        },
    });

    const handleSave = () => {
        saveMutation.mutate(editData);
    };

    if (isLoading) return <div className="p-8"><Skeleton className="h-12 w-1/3 mb-4" /><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>;
    if (!poFields) return <div className="p-8">PO not found</div>;

    const getVal = (key: string) => editData[key] || '-';
    const setVal = (key: string, value: string) => setEditData(prev => ({ ...prev, [key]: value }));

    // Helper to format currency
    const fmt = (val: string | number) => {
        if (val === '-' || val === '') return '-';
        const num = Number(val);
        return isNaN(num) ? val : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 text-xs">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-4 bg-white border-b pb-3 pt-2 px-4 rounded-t-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-6 w-6">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-bold text-gray-800">Details of Selected PO: (Fiscal Year : {getVal('FISCAL_YEAR')})</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs flex items-center gap-1"
                        >
                            <Save className="h-3 w-3" />
                            {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href={`/home/financialAnalystsPortfolio/${poId}/forecast`}>
                            <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 font-bold">
                                Manage 72-Month Forecast
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Two-Card Layout for Main PO Data and Renewal PO Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Main PO Data Card */}
                <Card className="shadow-md">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-md font-bold text-blue-900">Main PO Data</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2 max-h-[600px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <FieldRow label="Expense Category" value={getVal('EXPENSE_CATEGORY')} onChange={(val) => setVal('EXPENSE_CATEGORY', val)} />
                            <FieldRow label="Cost Pool" value={getVal('COST_POOL')} onChange={(val) => setVal('COST_POOL', val)} />
                            <FieldRow label="SW Usage Category" value={getVal('SW_USAGE_CATEGORY')} onChange={(val) => setVal('SW_USAGE_CATEGORY', val)} />
                            <FieldRow label="SW Category" value={getVal('SW_CATEGORY')} onChange={(val) => setVal('SW_CATEGORY', val)} />
                            <FieldRow label="Department Number" value={getVal('FINANCIAL_DEPARTMENT_CODE')} onChange={(val) => setVal('FINANCIAL_DEPARTMENT_CODE', val)} />
                            <FieldRow label="PO Number" value={getVal('PO_NUMBER')} readOnly />
                            <FieldRow label="COGS / OPEX" value={getVal('COGS_OR_OPEX')} onChange={(val) => setVal('COGS_OR_OPEX', val)} />
                            <FieldRow label="Level 2 Leader" value={getVal('NODE_LEVEL02_NAME_HIER')} onChange={(val) => setVal('NODE_LEVEL02_NAME_HIER', val)} />
                            <FieldRow label="Level 3 Leader" value={getVal('NODE_LEVEL03_NAME')} onChange={(val) => setVal('NODE_LEVEL03_NAME', val)} />
                            <FieldRow label="Level 4 Leader" value={getVal('NODE_LEVEL04_NAME')} onChange={(val) => setVal('NODE_LEVEL04_NAME', val)} />
                            <FieldRow label="Level 5 Leader" value={getVal('NODE_LEVEL05_NAME')} onChange={(val) => setVal('NODE_LEVEL05_NAME', val)} />
                            <FieldRow label="Business Owner" value={getVal('BUSINESS_OWNER')} onChange={(val) => setVal('BUSINESS_OWNER', val)} />
                            <FieldRow label="Product Owner" value={getVal('PRODUCT_OWNER')} onChange={(val) => setVal('PRODUCT_OWNER', val)} />
                            <FieldRow label="Biz Ops Owner" value={getVal('BIZ_OPS_OWNER')} onChange={(val) => setVal('BIZ_OPS_OWNER', val)} />
                            <FieldRow label="Opportunity Contact" value={getVal('OPPORTUNITY_CONTACT')} onChange={(val) => setVal('OPPORTUNITY_CONTACT', val)} />
                            <FieldRow label="Competitive Software" value={getVal('COMPETITIVE_SOFTWARE')} onChange={(val) => setVal('COMPETITIVE_SOFTWARE', val)} />
                            <FieldRow label="Redundant Software" value={getVal('REDUNDANT_SOFTWARE')} onChange={(val) => setVal('REDUNDANT_SOFTWARE', val)} />
                            <FieldRow label="GL Account" value={getVal('GL_ACCOUNT')} onChange={(val) => setVal('GL_ACCOUNT', val)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Renewal PO Data Card */}
                <Card className="shadow-md">
                    <CardHeader className="bg-indigo-50 border-b">
                        <CardTitle className="text-md font-bold text-indigo-900">Renewal PO Data</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                        <FieldRow label="PO Amount" value={fmt(getVal('TOTAL_AMOUNT_USD'))} readOnly />
                        <FieldRow label="PO Start Date" value={String(getVal('PO_START_DATE')).split(' ')[0]} onChange={(val) => setVal('PO_START_DATE', val)} />
                        <FieldRow label="PO End Date" value={String(getVal('PO_END_DATE')).split(' ')[0]} onChange={(val) => setVal('PO_END_DATE', val)} />
                        <FieldRow label="Deal Status" value={getVal('RENEWAL_COMPLETE')} readOnly />
                        <FieldRow label="Opportunity Status" value={getVal('OPPORTUNITY_STATUS')} readOnly />
                        <FieldRow label="PO Description" value={getVal('PO_DESCRIPTION')} onChange={(val) => setVal('PO_DESCRIPTION', val)} />
                    </CardContent>
                </Card>
            </div>

            {/* Financial Grids Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
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
        </div>
    );
}
