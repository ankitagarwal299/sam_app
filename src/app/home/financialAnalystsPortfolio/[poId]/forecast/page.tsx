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
import React from 'react';

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
    basis: 'auto' | 'manual' | 'committed';
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
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

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
            quartersMap[key].variance += m.variance;
        });

        return Object.values(quartersMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
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
            years[key].variance += m.variance;
        });

        return Object.values(years).sort((a, b) => a.label.localeCompare(b.label));
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

    const handleCellEdit = (cellId: string, currentValue: number) => {
        setEditingCell(cellId);
        setEditValue(currentValue.toString());
    };

    const saveEdit = () => {
        if (!editingCell) return;

        const newValue = parseFloat(editValue);
        if (isNaN(newValue)) {
            setEditingCell(null);
            return;
        }

        // Optimistically update the cache
        queryClient.setQueryData(['forecast', poId], (oldData: ForecastData | undefined) => {
            if (!oldData) return oldData;

            const newForecasts = oldData.monthlyForecasts.map(m => {
                // Check if we are editing a quarter aggregation or a specific month
                // For simplicity in this mock, if we edit a quarter, we distribute to months?
                // Or if we edit a month, we update just that month.
                // The current UI ID structure for quarter rows is just the quarter key (e.g. FY26-Q1)
                // But the monthly rows have specific IDs.

                // Case 1: Editing a specific month (Monthly view or expanded quarter)
                // The ID passed for monthly view is m.id (e.g. PO-2025-08)
                // The ID passed for quarterly view is the quarter key (e.g. FY26-Q1)

                // If editing a quarter, we need to distribute the change.
                // For now, let's support monthly editing primarily.
                // If the user edits a quarter cell, we'll just update the first month of that quarter
                // or split it evenly? Let's assume we split evenly for now if it matches a quarter key.

                // Actually, let's look at how the grid calls handleCellEdit.
                // For Quarter row: handleCellEdit(key, quarter.amount) -> key is "FY26-Q1"
                // For Month row: handleCellEdit does not seem to be called in the expanded view?
                // Wait, looking at the code:
                // Expanded Monthly Detail: <DataCell editable={m.status !== 'locked'}> ... </DataCell>
                // It doesn't have an onClick handler! That's why monthly editing inside expanded view wasn't working.

                // Let's fix the onClick in the JSX first.
                // This block is now mostly handled by the logic below.
                return m;
            });

            // If we edited a quarter, we need a second pass or a different logic.
            // For this fix, let's enable Monthly editing in the expanded view and Monthly view.
            // And for the Quarterly view, if they edit the total, we'll distribute it evenly across the months in that quarter.

            let updatedForecasts = [...oldData.monthlyForecasts];

            // Check if it's a quarter key
            const isQuarterKey = editingCell && editingCell.includes('-Q');
            if (isQuarterKey && editingCell) {
                const [fy, q] = editingCell.split('-Q');
                const quarterNum = parseInt(q);

                // Find months in this quarter
                const monthsInQuarter = updatedForecasts.filter(m => m.fiscalYear === fy && m.quarter === quarterNum);
                if (monthsInQuarter.length > 0) {
                    const diff = newValue - monthsInQuarter.reduce((sum, m) => sum + m.forecastAmount, 0);
                    const splitDiff = diff / monthsInQuarter.length;

                    updatedForecasts = updatedForecasts.map(m => {
                        if (m.fiscalYear === fy && m.quarter === quarterNum) {
                            return { ...m, forecastAmount: m.forecastAmount + splitDiff, variance: 0, modifiedBy: 'User' };
                        }
                        return m;
                    });
                }
            } else {
                // Assume it's a month ID
                updatedForecasts = updatedForecasts.map(m => {
                    if (m.id === editingCell || m.period === editingCell) { // Check both ID formats just in case
                        return { ...m, forecastAmount: newValue, variance: 0, modifiedBy: 'User' };
                    }
                    return m;
                });
            }

            return {
                ...oldData,
                monthlyForecasts: updatedForecasts
            };
        });

        setEditingCell(null);
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

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" /> Copy Prior Period
                        </Button>
                        <Button variant="outline" size="sm">
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
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
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
                                                    <DataCell
                                                        editable={quarter.status !== 'locked'}
                                                        onClick={() => quarter.status !== 'locked' && handleCellEdit(quarter.label, quarter.amount)}
                                                    >
                                                        {editingCell === quarter.label ? (
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
                                                            formatCurrency(quarter.amount)
                                                        )}
                                                    </DataCell>
                                                    <DataCell>{quarter.actual > 0 ? formatCurrency(quarter.actual) : '-'}</DataCell>
                                                    <DataCell>{formatCurrency(quarter.commit)}</DataCell>
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
                                                        <DataCell
                                                            editable={m.status !== 'locked'}
                                                            onClick={() => m.status !== 'locked' && handleCellEdit(m.id, m.forecastAmount)}
                                                        >
                                                            {editingCell === m.id ? (
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
                                                        <DataCell>{m.actualAmount ? formatCurrency(m.actualAmount) : '-'}</DataCell>
                                                        <DataCell>{formatCurrency(m.commitAmount)}</DataCell>
                                                        <DataCell variance={m.variance}>{m.variance.toFixed(1)}%</DataCell>
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
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
                                            <HeaderCell>Variance %</HeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedYears.map((year) => (
                                            <tr key={year.label} className="bg-white hover:bg-gray-50">
                                                <DataCell className="font-semibold bg-blue-50">{year.label}</DataCell>
                                                <DataCell>{formatCurrency(year.amount)}</DataCell>
                                                <DataCell>{year.actual > 0 ? formatCurrency(year.actual) : '-'}</DataCell>
                                                <DataCell>{formatCurrency(year.commit)}</DataCell>
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
                                            <HeaderCell>Forecast</HeaderCell>
                                            <HeaderCell>Actual</HeaderCell>
                                            <HeaderCell>Commit</HeaderCell>
                                            <HeaderCell>Variance %</HeaderCell>
                                            <HeaderCell>Status</HeaderCell>
                                            <HeaderCell>Basis</HeaderCell>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.monthlyForecasts.map(m => (
                                            <tr key={m.id} className="bg-white hover:bg-gray-50">
                                                <DataCell className="font-medium bg-blue-50">{m.periodLabel}</DataCell>
                                                <DataCell
                                                    editable={m.status !== 'locked'}
                                                    onClick={() => m.status !== 'locked' && handleCellEdit(m.id, m.forecastAmount)}
                                                >
                                                    {editingCell === m.id ? (
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
                                                <DataCell>{m.actualAmount ? formatCurrency(m.actualAmount) : '-'}</DataCell>
                                                <DataCell>{formatCurrency(m.commitAmount)}</DataCell>
                                                <DataCell variance={m.variance}>{m.variance.toFixed(1)}%</DataCell>
                                                <DataCell>
                                                    <span className={`px-2 py-1 rounded text-xs ${m.status === 'locked' ? 'bg-gray-200' : 'bg-green-100'
                                                        }`}>
                                                        {m.status}
                                                    </span>
                                                </DataCell>
                                                <DataCell>
                                                    <span className={`text-xs ${m.basis === 'committed' ? 'text-blue-600' :
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Variance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">±2.3%</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
