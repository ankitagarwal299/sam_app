'use client';

import { DollarSign, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from './kpi-card';
import { Publisher360Data, formatCurrency, formatDate } from '@/lib/publisher-360-data';

interface OverviewTabProps {
    data: Publisher360Data;
}

export function OverviewTab({ data }: OverviewTabProps) {
    const { kpis, keyDates, licensesByBU, entitlements } = data;

    return (
        <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Total Contract Value"
                    value={kpis.tcv}
                    trend={kpis.tcvTrend}
                    icon={<DollarSign className="h-4 w-4" />}
                />
                <KpiCard
                    title="Annual Contract Value"
                    value={kpis.acv}
                    trend={kpis.acvTrend}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
                <KpiCard
                    title="Next Renewal"
                    value={formatDate(keyDates.nextRenewalDate)}
                    subtitle={`${keyDates.daysUntilRenewal} days`}
                    format="text"
                    icon={<Calendar className="h-4 w-4" />}
                />
                <KpiCard
                    title="Renewal PO Amount"
                    value={keyDates.renewalPOAmount}
                    icon={<DollarSign className="h-4 w-4" />}
                />
                <KpiCard
                    title="Vendor FY End"
                    value={formatDate(keyDates.vendorFiscalYearEnd)}
                    format="text"
                    icon={<Clock className="h-4 w-4" />}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Licenses by Business Unit */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-800">
                            Licenses by Business Unit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">BU Name</th>
                                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Active</th>
                                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Inactive</th>
                                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licensesByBU.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-2.5 px-3 font-medium text-gray-900">{row.buName}</td>
                                            <td className="py-2.5 px-3 text-right">
                                                <span className="text-green-600 font-medium">{row.activeCount}</span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right">
                                                <span className="text-gray-500">{row.inactiveCount}</span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-medium text-gray-700">
                                                {row.activeCount + row.inactiveCount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td className="py-2.5 px-3 font-semibold text-gray-900">Total</td>
                                        <td className="py-2.5 px-3 text-right font-semibold text-green-600">
                                            {licensesByBU.reduce((sum, r) => sum + r.activeCount, 0)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-semibold text-gray-500">
                                            {licensesByBU.reduce((sum, r) => sum + r.inactiveCount, 0)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-semibold text-gray-700">
                                            {licensesByBU.reduce((sum, r) => sum + r.activeCount + r.inactiveCount, 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Entitlements */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-800">
                            Entitlements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {entitlements.map((ent) => (
                                <div key={ent.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                                            {ent.productName}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {ent.consumed}/{ent.quantity}
                                            </span>
                                            <StatusBadge status={ent.status} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressBarColor(ent.consumedPercent, ent.status)}`}
                                                style={{ width: `${Math.min(ent.consumedPercent, 100)}%` }}
                                            />
                                        </div>
                                        <span className="absolute right-0 -top-5 text-xs font-medium text-gray-600">
                                            {ent.consumedPercent}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: 'Active' | 'Expiring' | 'Overage' }) {
    const styles = {
        Active: 'bg-green-100 text-green-700 border-green-200',
        Expiring: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        Overage: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
}

function getProgressBarColor(percent: number, status: string): string {
    if (status === 'Overage') return 'bg-red-500';
    if (status === 'Expiring') return 'bg-yellow-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 75) return 'bg-blue-500';
    return 'bg-green-500';
}
