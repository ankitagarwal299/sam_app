'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Info, ChevronDown, ChevronUp, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// --- Types ---
interface Tiers {
    mega: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    tail: number;
}

interface Level4Item {
    name: string;
    total: number;
    tiers: Tiers;
}

interface Level5Item {
    name: string;
    amount: number;
}

interface FundingData {
    total: number;
    count: number;
    tiers: Tiers;
}

interface LeadersViewData {
    level4Spend: Level4Item[];
    level5Spend: Level5Item[];
    fundingSource: {
        central: FundingData;
        functional: FundingData;
    };
    metrics: {
        total: number;
        tcv: number;
        acv: number;
    };
}

// --- Fetcher ---
const fetchLeadersData = async (): Promise<LeadersViewData> => {
    const res = await fetch('/api/financial-portfolio/leaders-view');
    if (!res.ok) throw new Error('Failed to fetch leaders data');
    return res.json();
};

// --- Helpers ---
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(value);

const COLORS = {
    mega: 'bg-violet-600',
    platinum: 'bg-violet-400',
    gold: 'bg-blue-500',
    silver: 'bg-blue-300',
    bronze: 'bg-gray-400',
    tail: 'bg-gray-200'
};

const LEGEND = [
    { label: 'Mega', color: 'bg-violet-600' },
    { label: 'Platinum', color: 'bg-violet-400' },
    { label: 'Gold', color: 'bg-blue-500' },
    { label: 'Silver', color: 'bg-blue-300' },
    { label: 'Bronze', color: 'bg-gray-400' },
    { label: 'Tail', color: 'bg-gray-200' },
];

// --- Components ---

const FilterSelect = ({ placeholder }: { placeholder: string }) => (
    <Select>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-white border-gray-200">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
        </SelectContent>
    </Select>
);

const StackedBar = ({ tiers, total, max }: { tiers: Tiers, total: number, max: number }) => {
    const getWidth = (val: number) => `${(val / max) * 100}%`;

    return (
        <div className="flex h-4 rounded-sm overflow-hidden w-full">
            <div style={{ width: getWidth(tiers.mega) }} className={COLORS.mega} title={`Mega: ${formatCurrency(tiers.mega)}`} />
            <div style={{ width: getWidth(tiers.platinum) }} className={COLORS.platinum} title={`Platinum: ${formatCurrency(tiers.platinum)}`} />
            <div style={{ width: getWidth(tiers.gold) }} className={COLORS.gold} title={`Gold: ${formatCurrency(tiers.gold)}`} />
            <div style={{ width: getWidth(tiers.silver) }} className={COLORS.silver} title={`Silver: ${formatCurrency(tiers.silver)}`} />
            <div style={{ width: getWidth(tiers.bronze) }} className={COLORS.bronze} title={`Bronze: ${formatCurrency(tiers.bronze)}`} />
            <div style={{ width: getWidth(tiers.tail) }} className={COLORS.tail} title={`Tail: ${formatCurrency(tiers.tail)}`} />
        </div>
    );
};

const DonutChart = ({ data, title }: { data: FundingData, title: string }) => {
    // Simplified donut using conic gradient for demo
    // In a real app, calculate exact angles
    return (
        <div className="flex flex-col items-center">
            <h4 className="text-sm font-semibold mb-4">{title}</h4>
            <div className="relative w-32 h-32 rounded-full" style={{
                background: `conic-gradient(
          #7c3aed 0% 40%, 
          #a78bfa 40% 70%, 
          #3b82f6 70% 85%, 
          #93c5fd 85% 95%, 
          #d1d5db 95% 100%
        )`
            }}>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                    <span className="text-xs text-gray-500">PO: {data.count}</span>
                    <span className="text-sm font-bold">{formatCurrency(data.total)}</span>
                </div>
            </div>
        </div>
    );
};

const VerticalBarChart = ({ tiers, max }: { tiers: Tiers, max: number }) => {
    const getHeight = (val: number) => `${(val / max) * 100}%`;
    return (
        <div className="flex items-end gap-2 h-32 mt-4 px-4">
            {Object.entries(tiers).map(([key, val], idx) => (
                <div key={key} className="flex-1 flex flex-col items-center group">
                    <div
                        className={`w-full rounded-t-sm ${COLORS[key as keyof Tiers]} transition-all hover:opacity-80`}
                        style={{ height: getHeight(val) }}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1 capitalize">{key}</span>
                    <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 absolute -mt-4 bg-white px-1 shadow-sm border rounded">{formatCurrency(val)}</span>
                </div>
            ))}
        </div>
    );
};

export default function LeadersViewPage() {
    const router = useRouter();
    const [isFundingExpanded, setIsFundingExpanded] = useState(true);

    const { data, isLoading, error } = useQuery({
        queryKey: ['leadersView'],
        queryFn: fetchLeadersData,
    });

    if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
    if (error) return <div className="p-8 text-red-500">Error loading data</div>;
    if (!data) return null;

    const maxLevel4 = Math.max(...data.level4Spend.map(i => i.total));
    const maxLevel5 = Math.max(...data.level5Spend.map(i => i.amount));
    const maxFunding = Math.max(data.fundingSource.central.total, data.fundingSource.functional.total);

    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-900">Portfolio View For Leaders</h1>
                    <Info className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8"><Filter className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-lg shadow-sm border mb-4 flex flex-wrap gap-3 items-center">
                <FilterSelect placeholder="SLT Leader" />
                <FilterSelect placeholder="OneX Level 4" />
                <FilterSelect placeholder="OneX Level 5" />
                <FilterSelect placeholder="Funding Source" />
                <FilterSelect placeholder="COGS Or OPEX" />
                <FilterSelect placeholder="Tier" />
                <FilterSelect placeholder="Quarters" />
            </div>

            {/* Top Section: Spend by Level 4 & 5 */}
            <Card className="shadow-sm border-none mb-4">
                <CardHeader className="pb-2 border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold text-gray-700">In Year Spend By Level 4 and 5 Leaders</CardTitle>
                        <div className="flex gap-4 text-xs text-gray-600">
                            <span>Total: <span className="font-bold text-gray-900">{formatCurrency(data.metrics.total)}</span></span>
                            <span>TCV: <span className="font-bold text-gray-900">{formatCurrency(data.metrics.tcv)}</span></span>
                            <span>ACV: <span className="font-bold text-gray-900">{formatCurrency(data.metrics.acv)}</span></span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Level 4 Chart */}
                        <div className="lg:col-span-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-semibold text-gray-600">Top 10 Level 4 Leaders</h3>
                                <div className="flex gap-2 text-[10px]">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-800"></div> Tiers</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-gray-400"></div> COGS/OPEX</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {data.level4Spend.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <span className="w-24 truncate text-right text-gray-500" title={item.name}>{item.name}</span>
                                        <div className="flex-1">
                                            <StackedBar tiers={item.tiers} total={item.total} max={maxLevel4} />
                                        </div>
                                        <span className="w-12 text-right font-medium">{formatCurrency(item.total)}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 mt-4 justify-center">
                                {LEGEND.map(l => (
                                    <div key={l.label} className="flex items-center gap-1 text-[10px] text-gray-500">
                                        <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
                                        {l.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Level 5 Chart */}
                        <div className="lg:col-span-4 border-l pl-6">
                            <h3 className="text-xs font-semibold text-gray-600 mb-4">Top 10 Level 5 Leaders</h3>
                            <div className="space-y-3">
                                {data.level5Spend.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <span className="w-24 truncate text-right text-gray-500" title={item.name}>{item.name}</span>
                                        <div className="flex-1 bg-gray-100 rounded-sm h-4 overflow-hidden">
                                            <div className="h-full bg-indigo-200" style={{ width: `${(item.amount / maxLevel5) * 100}%` }}></div>
                                        </div>
                                        <span className="w-12 text-right font-medium">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side Panel (Action Items) */}
                        <div className="lg:col-span-3 border-l pl-4">
                            <div className="bg-purple-50 p-3 rounded-lg mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white mb-2">
                                    <MoreHorizontal className="w-5 h-5" />
                                </div>
                                <p className="text-xs text-purple-900 font-medium">Action Items</p>
                            </div>
                            <div className="text-xs text-gray-500">
                                <div className="grid grid-cols-3 gap-2 border-b pb-1 mb-2 font-semibold">
                                    <span>Description</span>
                                    <span>Category</span>
                                    <span>Priority</span>
                                </div>
                                <div className="py-8 text-center text-gray-400 italic">
                                    No active action items
                                </div>
                                <div className="mt-4 pt-2 border-t">
                                    <input type="text" placeholder="Add Mock-up visuals" className="w-full text-xs border rounded p-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Funding Source Section */}
            <Card className="shadow-sm border-none">
                <CardHeader className="py-3 px-4 border-b bg-gray-50/50 cursor-pointer" onClick={() => setIsFundingExpanded(!isFundingExpanded)}>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold text-gray-700">In Year Spend Per Funding Source</CardTitle>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            {isFundingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    </div>
                </CardHeader>
                {isFundingExpanded && (
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Central Funded */}
                            <div>
                                <DonutChart data={data.fundingSource.central} title="Central Funded" />
                                <VerticalBarChart tiers={data.fundingSource.central.tiers} max={data.fundingSource.central.total * 0.5} />
                            </div>
                            {/* Functional Funded */}
                            <div>
                                <DonutChart data={data.fundingSource.functional} title="Functional Funded" />
                                <VerticalBarChart tiers={data.fundingSource.functional.tiers} max={data.fundingSource.functional.total * 0.5} />
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Bottom Placeholder */}
            <Card className="shadow-sm border-none mt-4">
                <CardHeader className="py-3 px-4 border-b bg-gray-50/50">
                    <CardTitle className="text-sm font-bold text-gray-700">In Year Spend vs Contract Renewal Date</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}
