'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/publisher-360-data';

interface KpiCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    trend?: number; // percentage
    icon?: React.ReactNode;
    format?: 'currency' | 'number' | 'text' | 'date';
}

export function KpiCard({ title, value, subtitle, trend, icon, format = 'currency' }: KpiCardProps) {
    const displayValue = format === 'currency' && typeof value === 'number'
        ? formatCurrency(value)
        : value;

    const getTrendIcon = () => {
        if (trend === undefined) return null;
        if (trend > 0) return <TrendingUp className="h-3 w-3" />;
        if (trend < 0) return <TrendingDown className="h-3 w-3" />;
        return <Minus className="h-3 w-3" />;
    };

    const getTrendColor = () => {
        if (trend === undefined) return '';
        if (trend > 0) return 'text-green-600 bg-green-50';
        if (trend < 0) return 'text-red-600 bg-red-50';
        return 'text-gray-500 bg-gray-50';
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {title}
                </CardTitle>
                {icon && (
                    <div className="text-gray-400">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {displayValue}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    {trend !== undefined && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${getTrendColor()}`}>
                            {getTrendIcon()}
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                    {subtitle && (
                        <span className="text-xs text-gray-500">{subtitle}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
