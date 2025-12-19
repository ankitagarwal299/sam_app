'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Calendar,
    Download,
    Upload,
    Lock,
    Unlock,
    Copy,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from 'react';

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label ref={ref} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
));
Label.displayName = "Label";

// --- Types ---
type GranularityType = 'monthly' | 'quarterly' | 'yearly';

interface MonthlyForecast {
    id: string;
    poId: string;
    year: number;
    month: number;
    quarter: number;
    fiscalYear: string;
    period: string;
    periodLabel: string;
    forecastAmount: number;
    actualAmount: number | null;
    commitAmount: number;
    variance: number;
    status: 'draft' | 'locked' | 'submitted';
    basis: 'auto' | 'manual' | 'approved';
    lastModified: string;
    modifiedBy: string;
}

interface ForecastData {
    poNumber: string;
    vendor: string;
    totalAmount: number;
    startDate: string;
    endDate: string;
    termMonths: number;
    currency: string;
    monthlyForecasts: MonthlyForecast[];
}

// --- API Fetchers ---
const fetchForecast = async (poId: string): Promise<ForecastData> => {
    const res = await fetch(`/api/financial-portfolio/${poId}/forecast`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return res.json();
};

// --- Helper Functions ---
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 2) return 'text-green-600 bg-green-50';
    if (Math.abs(variance) < 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
};

const calculateVariance = (forecast: number, actual: number | null) => {
    if (!forecast || forecast === 0) return 0;
    const actualVal = actual || 0;
    return ((forecast - actualVal) / forecast) * 100;
};

const getVarianceIcon = (variance: number) => {
    if (Math.abs(variance) < 2) return <CheckCircle className="w-3 h-3" />;
    if (Math.abs(variance) < 5) return <AlertTriangle className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
};

// --- Components ---
const HeaderCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <th className={`px-3 py-2 bg-[#2563eb] text-white text-xs font-semibold border border-white/20 sticky top-0 z-10 ${className}`}>
        {children}
    </th>
);

const DataCell = ({
    children,
    editable = false,
    variance,
    onClick,
    className = ''
}: {
    children: React.ReactNode;
    editable?: boolean;
    variance?: number;
    onClick?: () => void;
    className?: string;
}) => {
    const baseClass = "px-3 py-2 text-xs border border-gray-200 text-center";
    const editClass = editable ? "cursor-pointer hover:bg-blue-50" : "";
    const varClass = variance !== undefined ? getVarianceColor(variance) : "";

    return (
        <td className={`${baseClass} ${editClass} ${varClass} ${className}`} onClick={onClick}>
            {children}
        </td>
    );
};

// --- Main Component ---
export default function ForecastManagementPage() {
    const params = useParams();
    const router = useRouter();
    const poId = params.poId as string;
    const queryClient = useQueryClient();

    const [granularity, setGranularity] = useState<GranularityType>('quarterly');
    const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());
    // --- State for editing ---
    // storing cell ID as "ID:FIELD" to distinguish between forecast and commit
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // --- State for Uplift ---
    const [upliftOpen, setUpliftOpen] = useState(false);
    // State for temporary form values
    const [upliftFactors, setUpliftFactors] = useState({
        price: { pct: 0, reason: '' },
        volume: { pct: 0, reason: '' },
        expansion: { pct: 0, reason: '' },
    });
    // State for applied values (used in forecast calculation)
    const [appliedUpliftFactors, setAppliedUpliftFactors] = useState({
        price: { pct: 0, reason: '' },
        volume: { pct: 0, reason: '' },
        expansion: { pct: 0, reason: '' },
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['forecast', poId],
        queryFn: () => fetchForecast(poId),
    });

    if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
    if (error || !data) return <div className="p-8 text-red-500">Error loading forecast</div>;

    // Aggregate to quarterly and sort
    const getSortedQuarters = () => {
        const quartersMap: Record<string, {
            label: string;
            amount: number;
            actual: number;
            commit: number;
            months: MonthlyForecast[];
            variance: number;
            status: string;
            sortKey: string; // Helper for sorting
        }> = {};

        data.monthlyForecasts.forEach(m => {
            const key = `${m.fiscalYear}-Q${m.quarter}`;
            if (!quartersMap[key]) {
                quartersMap[key] = {
                    label: key,
                    amount: 0,
                    actual: 0,
                    commit: 0,
                    months: [],
                    variance: 0,
                    status: m.status,
                    sortKey: `${m.fiscalYear}-Q${m.quarter}` // Sort by Fiscal Year and Fiscal Quarter
                };
            }
            quartersMap[key].amount += m.forecastAmount;
            quartersMap[key].actual += m.actualAmount || 0;
            quartersMap[key].commit += m.commitAmount;
            quartersMap[key].months.push(m);
        });

        return Object.values(quartersMap).map(q => ({
            ...q,
            variance: calculateVariance(q.amount, q.actual)
        })).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    };

    const sortedQuarters = getSortedQuarters();

    // Aggregate to yearly
    const aggregateYearly = () => {
        const years: Record<string, { label: string; amount: number; actual: number; commit: number; variance: number }> = {};

        data.monthlyForecasts.forEach(m => {
            const key = m.fiscalYear;
            if (!years[key]) {
                years[key] = { label: key, amount: 0, actual: 0, commit: 0, variance: 0 };
            }
            years[key].amount += m.forecastAmount;
            years[key].actual += m.actualAmount || 0;
            years[key].commit += m.commitAmount;
        });

        return Object.values(years).map(y => ({
            ...y,
            variance: calculateVariance(y.amount, y.actual)
        })).sort((a, b) => a.label.localeCompare(b.label));
    };

    const sortedYears = aggregateYearly();

    const toggleQuarter = (quarterKey: string) => {
        const newExpanded = new Set(expandedQuarters);
        if (newExpanded.has(quarterKey)) {
            newExpanded.delete(quarterKey);
        } else {
            newExpanded.add(quarterKey);
        }
        setExpandedQuarters(newExpanded);
    };

    const handleCellEdit = (id: string, field: 'forecast' | 'commit', currentValue: number) => {
        setEditingCell(`${id}:${field}`);
        setEditValue(currentValue.toString());
    };

    const saveEdit = () => {
        if (!editingCell) return;

        const [id, field] = editingCell.split(':');
        const newValue = parseFloat(editValue);

        if (isNaN(newValue)) {
            setEditingCell(null);
            return;
        }

        // Optimistically update the cache
        queryClient.setQueryData(['forecast', poId], (oldData: ForecastData | undefined) => {
            if (!oldData) return oldData;

            const updatedForecasts = oldData.monthlyForecasts.map(m => {
                if (m.id === id || m.period === id) {
                    return {
                        ...m,
                        [field === 'commit' ? 'commitAmount' : 'forecastAmount']: newValue,
                        modifiedBy: 'User',
                        // Reset variance if forecast changes? Or recalc? keeping simple for now
                        variance: field === 'forecast' ? 0 : m.variance
                    };
                }
                return m;
            });

            return {
                ...oldData,
                monthlyForecasts: updatedForecasts
            };
        });

        setEditingCell(null);
    };

    const handleSaveUplift = () => {
        // Commit the form values to the applied state
        setAppliedUpliftFactors(upliftFactors);
        setUpliftOpen(false);
        toast.success("Forecast uplift applied successfully.");
    };

    const handleOpenUplift = () => {
        // Reset form values to match currently applied values
        setUpliftFactors(appliedUpliftFactors);
        setUpliftOpen(true);
    };

    const getUpliftedAmount = (amount: number) => {
        const totalPct = (appliedUpliftFactors.price.pct || 0) + (appliedUpliftFactors.volume.pct || 0) + (appliedUpliftFactors.expansion.pct || 0);
        return amount * (1 + totalPct / 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">72-Month Forecast Manager</h1>
                        <p className="text-sm text-gray-500">
                            PO: {data.poNumber} | Vendor: {data.vendor} | Total: {formatCurrency(data.totalAmount)} |
                            Term: {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data.monthlyForecasts.reduce((sum, m) => sum + m.forecastAmount, 0))}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Actuals to Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data.monthlyForecasts.reduce((sum, m) => sum + (m.actualAmount || 0), 0))}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Remaining Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(data.monthlyForecasts
                                    .filter(m => !m.actualAmount)
                                    .reduce((sum, m) => sum + m.forecastAmount, 0))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Saving %</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">±2.3%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex gap-2">
                        <Button
                            variant={granularity === 'monthly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGranularity('monthly')}
                        >
                            <Calendar className="w-4 h-4 mr-1" /> Monthly
                        </Button>
                        <Button
                            variant={granularity === 'quarterly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGranularity('quarterly')}
                        >
                            <Calendar className="w-4 h-4 mr-1" /> Quarterly
                        </Button>
                        <Button
                            variant={granularity === 'yearly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGranularity('yearly')}
                        >
                            <Calendar className="w-4 h-4 mr-1" /> Yearly
                        </Button>
                    </div>

                    {granularity === 'monthly' && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleOpenUplift}>
                                <TrendingUp className="w-4 h-4 mr-1" /> Apply Uplift %
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" /> Export
                            </Button>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-1" /> Import
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Forecast Grid */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full border-collapse min-w-[1200px]">
                            {/* Quarterly View */}
                            {granularity === 'quarterly' && (
                                <>
                                    <thead>
                                        <tr>
                                            <HeaderCell className="w-24">Period</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Forecast with uplift</HeaderCell>
                                            <HeaderCell>Variance %</HeaderCell>
                                            <HeaderCell>Status</HeaderCell>
                                            <HeaderCell className="w-16">Actions</HeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedQuarters.map((quarter) => (
                                            <React.Fragment key={quarter.label}>
                                                <tr className="bg-white hover:bg-gray-50">
                                                    <DataCell className="font-semibold bg-blue-50">{quarter.label}</DataCell>
                                                    <DataCell>{formatCurrency(quarter.commit)}</DataCell>
                                                    <DataCell>{quarter.actual > 0 ? formatCurrency(quarter.actual) : '-'}</DataCell>
                                                    <DataCell>{formatCurrency(quarter.amount)}</DataCell>
                                                    <DataCell>{formatCurrency(getUpliftedAmount(quarter.amount))}</DataCell>
                                                    <DataCell variance={quarter.variance}>
                                                        <div className="flex items-center justify-center gap-1">
                                                            {getVarianceIcon(quarter.variance)}
                                                            {quarter.variance.toFixed(1)}%
                                                        </div>
                                                    </DataCell>
                                                    <DataCell>
                                                        {quarter.status === 'locked' ? (
                                                            <Lock className="w-3 h-3 inline text-gray-400" />
                                                        ) : (
                                                            <Unlock className="w-3 h-3 inline text-green-500" />
                                                        )}
                                                    </DataCell>
                                                    <DataCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 w-auto px-2 p-0 text-[10px]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleQuarter(quarter.label);
                                                            }}
                                                        >
                                                            {expandedQuarters.has(quarter.label) ? '▲' : `▼ (${quarter.months.length})`}
                                                        </Button>
                                                    </DataCell>
                                                </tr>
                                                {/* Expanded Monthly Detail */}
                                                {expandedQuarters.has(quarter.label) && quarter.months.sort((a, b) => a.period.localeCompare(b.period)).map(m => (
                                                    <tr key={m.id} className="bg-gray-50 text-xs">
                                                        <DataCell className="pl-8 text-left bg-blue-50/50">{m.periodLabel}</DataCell>
                                                        <DataCell>{formatCurrency(m.commitAmount)}</DataCell>
                                                        <DataCell>{m.actualAmount ? formatCurrency(m.actualAmount) : '-'}</DataCell>
                                                        <DataCell>{formatCurrency(m.forecastAmount)}</DataCell>
                                                        <DataCell>{formatCurrency(getUpliftedAmount(m.forecastAmount))}</DataCell>
                                                        <DataCell variance={calculateVariance(m.forecastAmount, m.actualAmount)}>{calculateVariance(m.forecastAmount, m.actualAmount).toFixed(1)}%</DataCell>
                                                        <DataCell>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] ${m.status === 'locked' ? 'bg-gray-200' : 'bg-green-100'
                                                                }`}>
                                                                {m.status}
                                                            </span>
                                                        </DataCell>
                                                        <DataCell>-</DataCell>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {/* Yearly View */}
                            {granularity === 'yearly' && (
                                <>
                                    <thead>
                                        <tr>
                                            <HeaderCell>Year</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Forecast with uplift</HeaderCell>
                                            <HeaderCell>Variance %</HeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedYears.map((year) => (
                                            <tr key={year.label} className="bg-white hover:bg-gray-50">
                                                <DataCell className="font-semibold bg-blue-50">{year.label}</DataCell>
                                                <DataCell>{formatCurrency(year.commit)}</DataCell>
                                                <DataCell>{year.actual > 0 ? formatCurrency(year.actual) : '-'}</DataCell>
                                                <DataCell>{formatCurrency(year.amount)}</DataCell>
                                                <DataCell>{formatCurrency(getUpliftedAmount(year.amount))}</DataCell>
                                                <DataCell variance={year.variance}>{year.variance.toFixed(1)}%</DataCell>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}

                            {/* Monthly View */}
                            {granularity === 'monthly' && (
                                <>
                                    <thead>
                                        <tr>
                                            <HeaderCell>Month</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Forecast with uplift</HeaderCell>
                                            <HeaderCell>Variance %</HeaderCell>
                                            <HeaderCell>Status</HeaderCell>
                                            <HeaderCell>Basis</HeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.monthlyForecasts.map(m => (
                                            <tr key={m.id} className="bg-white hover:bg-gray-50">
                                                <DataCell className="font-medium bg-blue-50">{m.periodLabel}</DataCell>
                                                {/* COMMIT - Editable */}
                                                <DataCell
                                                    editable={m.status !== 'locked'}
                                                    onClick={() => m.status !== 'locked' && handleCellEdit(m.id, 'commit', m.commitAmount)}
                                                >
                                                    {editingCell === `${m.id}:commit` ? (
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={saveEdit}
                                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                                            className="w-full px-2 py-1 border rounded"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        formatCurrency(m.commitAmount)
                                                    )}
                                                </DataCell>

                                                <DataCell>{m.actualAmount ? formatCurrency(m.actualAmount) : '-'}</DataCell>

                                                {/* FORECAST - Editable */}
                                                <DataCell
                                                    editable={m.status !== 'locked'}
                                                    onClick={() => m.status !== 'locked' && handleCellEdit(m.id, 'forecast', m.forecastAmount)}
                                                >
                                                    {editingCell === `${m.id}:forecast` ? (
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={saveEdit}
                                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                                            className="w-full px-2 py-1 border rounded"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        formatCurrency(m.forecastAmount)
                                                    )}
                                                </DataCell>
                                                <DataCell>{formatCurrency(getUpliftedAmount(m.forecastAmount))}</DataCell>
                                                <DataCell variance={calculateVariance(m.forecastAmount, m.actualAmount)}>{calculateVariance(m.forecastAmount, m.actualAmount).toFixed(1)}%</DataCell>
                                                <DataCell>
                                                    <span className={`px-2 py-1 rounded text-xs ${m.status === 'locked' ? 'bg-gray-200' : 'bg-green-100'
                                                        }`}>
                                                        {m.status}
                                                    </span>
                                                </DataCell>
                                                <DataCell>
                                                    <span className={`text-xs ${m.basis === 'approved' ? 'text-blue-600' :
                                                        m.basis === 'manual' ? 'text-purple-600' : 'text-gray-600'
                                                        }`}>
                                                        {m.basis}
                                                    </span>
                                                </DataCell>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>


            <Dialog open={upliftOpen} onOpenChange={setUpliftOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Apply Forecast Uplift</DialogTitle>
                        <DialogDescription>
                            Enter percentage uplifts and reasons. These will be applied to the current forecast.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Price Uplift */}
                        <div className="grid gap-2">
                            <Label htmlFor="price-pct" className="font-semibold">Price Uplift</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <Label htmlFor="price-pct" className="text-xs text-gray-500">Percentage (%)</Label>
                                    <Input
                                        id="price-pct"
                                        type="number"
                                        value={upliftFactors.price.pct}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, price: { ...upliftFactors.price, pct: parseFloat(e.target.value) || 0 } })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="price-reason" className="text-xs text-gray-500">Reason</Label>
                                    <Input
                                        id="price-reason"
                                        value={upliftFactors.price.reason}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, price: { ...upliftFactors.price, reason: e.target.value } })}
                                        placeholder="e.g. Inflation"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Volume Uplift */}
                        <div className="grid gap-2">
                            <Label htmlFor="volume-pct" className="font-semibold">Volume Uplift</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <Label htmlFor="volume-pct" className="text-xs text-gray-500">Percentage (%)</Label>
                                    <Input
                                        id="volume-pct"
                                        type="number"
                                        value={upliftFactors.volume.pct}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, volume: { ...upliftFactors.volume, pct: parseFloat(e.target.value) || 0 } })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="volume-reason" className="text-xs text-gray-500">Reason</Label>
                                    <Input
                                        id="volume-reason"
                                        value={upliftFactors.volume.reason}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, volume: { ...upliftFactors.volume, reason: e.target.value } })}
                                        placeholder="e.g. Business Growth"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expansion Uplift */}
                        <div className="grid gap-2">
                            <Label htmlFor="expansion-pct" className="font-semibold">Expansion Uplift</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <Label htmlFor="expansion-pct" className="text-xs text-gray-500">Percentage (%)</Label>
                                    <Input
                                        id="expansion-pct"
                                        type="number"
                                        value={upliftFactors.expansion.pct}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, expansion: { ...upliftFactors.expansion, pct: parseFloat(e.target.value) || 0 } })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="expansion-reason" className="text-xs text-gray-500">Reason</Label>
                                    <Input
                                        id="expansion-reason"
                                        value={upliftFactors.expansion.reason}
                                        onChange={(e) => setUpliftFactors({ ...upliftFactors, expansion: { ...upliftFactors.expansion, reason: e.target.value } })}
                                        placeholder="e.g. New Markets"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUpliftOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveUplift}>Save Uplift</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
