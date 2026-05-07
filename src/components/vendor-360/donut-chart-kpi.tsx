'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/vendor-360-data';
import { AlertCircle } from 'lucide-react';

interface DonutChartKPIProps {
    total: number;
    invoicesAmount: number;
    vendor: string;
    year: number;
    onInvoicesClick?: () => void;
}

const COLORS = {
    invoices: '#1F77B4', // Blue
    remaining: '#FF7F0E', // Orange
};

export function DonutChartKPI({ total, invoicesAmount, vendor, year, onInvoicesClick }: DonutChartKPIProps) {
    // Edge case: missing total
    if (!total || total <= 0) {
        return (
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {vendor} — {year} Total vs Invoices
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Bind {vendor} forecast to render</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const remaining = Math.max(0, total - invoicesAmount);
    const isOverInvoiced = invoicesAmount > total;
    const overInvoicedAmount = isOverInvoiced ? invoicesAmount - total : 0;

    const data = [
        { name: 'Invoice amount', value: Math.min(invoicesAmount, total), color: COLORS.invoices },
        { name: 'Remaining liabilities', value: remaining, color: COLORS.remaining },
    ];

    // Calculate percentages
    const invoicePercent = ((Math.min(invoicesAmount, total) / total) * 100).toFixed(1);
    const remainingPercent = ((remaining / total) * 100).toFixed(1);

    // Format total for center display
    const formatShort = (value: number): string => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return formatCurrency(value);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percent = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        {formatCurrency(data.value)} ({percent}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCenterLabel = () => {
        return (
            <g>
                <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-900 font-bold text-2xl"
                >
                    {formatShort(total)}
                </text>
                <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-500 text-xs"
                >
                    Total
                </text>
                <text
                    x="50%"
                    y="65%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-400 text-xs"
                >
                    {vendor} • {year}
                </text>
            </g>
        );
    };

    const handleClick = (data: any) => {
        if (data.name === 'Invoice amount' && onInvoicesClick) {
            onInvoicesClick();
        }
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {vendor} — {year} Total vs Invoices
                </CardTitle>
                {isOverInvoiced && (
                    <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                            Over‑invoiced by {formatCurrency(overInvoicedAmount)}
                        </span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            onClick={handleClick}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className={entry.name === 'Invoice amount' ? 'hover:opacity-80' : ''}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {renderCenterLabel()}
                    </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.invoices }} />
                        <span className="text-gray-600">Invoice amount</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.remaining }} />
                        <span className="text-gray-600">Remaining liabilities</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
