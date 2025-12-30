import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GLReconciliationRecord } from "@/app/home/gl-reconciliation/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

interface GLDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: GLReconciliationRecord | null;
}

export function GLDetailsDialog({ open, onOpenChange, record }: GLDetailsDialogProps) {
    const [txFilters, setTxFilters] = useState<Record<string, string>>({});
    const [assetFilters, setAssetFilters] = useState<Record<string, string>>({});
    const [poFilters, setPoFilters] = useState<Record<string, string>>({});

    const filteredTransactions = useMemo(() => {
        if (!record) return [];
        return record.linkedTransactions.filter(tx => {
            return Object.entries(txFilters).every(([col, val]) => {
                if (!val) return true;
                const cellValue = String((tx as any)[col] || "").toLowerCase();
                return cellValue.includes(val.toLowerCase());
            });
        });
    }, [record, txFilters]);

    const filteredDepreciation = useMemo(() => {
        if (!record) return [];
        return record.assetDepreciations.filter(asset => {
            return Object.entries(assetFilters).every(([col, val]) => {
                if (!val) return true;
                const cellValue = String((asset as any)[col] || "").toLowerCase();
                return cellValue.includes(val.toLowerCase());
            });
        });
    }, [record, assetFilters]);

    const filteredYearlyPo = useMemo(() => {
        if (!record) return [];
        return record.yearlyPoFinancials.filter(po => {
            return Object.entries(poFilters).every(([col, val]) => {
                if (!val) return true;
                const cellValue = String((po as any)[col] || "").toLowerCase();
                return cellValue.includes(val.toLowerCase());
            });
        });
    }, [record, poFilters]);

    const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<Record<string, string>>>, col: string, val: string) => {
        setter(prev => ({ ...prev, [col]: val }));
    };

    if (!record) return null;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[99vw] w-[99vw] h-[98vh] max-h-[98vh] flex flex-col p-0 overflow-hidden bg-white border-none shadow-2xl sm:max-w-none sm:rounded-none">
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shrink-0 shadow-lg">
                    <DialogHeader className="text-left flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-3xl font-extrabold tracking-tight">Reconciliation Mastery: {record.fiscalYear}</DialogTitle>
                            <DialogDescription className="text-blue-100/80 text-lg mt-1">
                                Comprehensive audit of GL Transactions, Depreciation, and Yearly PO performance.
                            </DialogDescription>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Dept Number</span>
                            <div className="text-xl font-mono font-bold">{record.deptNumber}</div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4 bg-gray-50/30">
                    <Tabs defaultValue="linked-gl" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-200/50 p-1 text-gray-500 w-full max-w-2xl shrink-0">
                            <TabsTrigger value="linked-gl" className="rounded-lg px-8 py-2 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm w-full">Linked GL Transactions</TabsTrigger>
                            <TabsTrigger value="yearly-po" className="rounded-lg px-8 py-2 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm w-full">Yearly PO Financials</TabsTrigger>
                        </TabsList>

                        <TabsContent value="linked-gl" className="flex-1 overflow-hidden flex flex-col gap-4 focus-visible:outline-none data-[state=inactive]:hidden mt-2">
                            <Tabs defaultValue="gl-transactions" className="w-full flex-1 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between border-b border-gray-200 shrink-0">
                                    <TabsList className="bg-transparent p-0 h-auto gap-8">
                                        <TabsTrigger value="gl-transactions" className="data-[state=active]:border-b-4 data-[state=active]:border-blue-600 rounded-none bg-transparent shadow-none px-2 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-blue-700">GL Transactions</TabsTrigger>
                                        <TabsTrigger value="asset-depreciation" className="data-[state=active]:border-b-4 data-[state=active]:border-blue-600 rounded-none bg-transparent shadow-none px-2 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 data-[state=active]:text-blue-700">Asset Depreciation</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="gl-transactions" className="flex-1 overflow-hidden flex flex-col gap-2 mt-2 focus-visible:outline-none">
                                    <div className="border rounded-xl overflow-auto flex-1 shadow-sm bg-white">
                                        <Table>
                                            <TableHeader className="sticky top-0 bg-gray-100 z-20 shadow-sm">
                                                <TableRow>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Dept Code</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.deptCode || ""} onChange={e => handleFilterChange(setTxFilters, 'deptCode', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Quarter</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.fiscalQuarter || ""} onChange={e => handleFilterChange(setTxFilters, 'fiscalQuarter', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Period</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.fiscalPeriod || ""} onChange={e => handleFilterChange(setTxFilters, 'fiscalPeriod', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Type</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.transactionType || ""} onChange={e => handleFilterChange(setTxFilters, 'transactionType', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>PO Number</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.poNumber || ""} onChange={e => handleFilterChange(setTxFilters, 'poNumber', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Date</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.date || ""} onChange={e => handleFilterChange(setTxFilters, 'date', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Description</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.description || ""} onChange={e => handleFilterChange(setTxFilters, 'description', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>GL Code</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={txFilters.glCode || ""} onChange={e => handleFilterChange(setTxFilters, 'glCode', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 text-right py-3">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredTransactions.map((tx) => (
                                                    <TableRow key={tx.id} className="hover:bg-blue-50/50 transition-colors">
                                                        <TableCell className="font-mono text-[11px]">{tx.deptCode}</TableCell>
                                                        <TableCell className="text-xs">{tx.fiscalQuarter}</TableCell>
                                                        <TableCell className="text-xs">{tx.fiscalPeriod}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${tx.transactionType === 'Accrual' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {tx.transactionType}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-blue-600 text-xs">{tx.poNumber || '-'}</TableCell>
                                                        <TableCell className="text-gray-500 text-xs">{new Date(tx.date).toLocaleDateString()}</TableCell>
                                                        <TableCell className="max-w-[200px] truncate text-xs">{tx.description}</TableCell>
                                                        <TableCell className="text-gray-500 text-xs">{tx.glCode}</TableCell>
                                                        <TableCell className="text-right font-bold text-gray-900 text-xs">{formatCurrency(tx.amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="asset-depreciation" className="flex-1 overflow-hidden flex flex-col gap-2 mt-2 focus-visible:outline-none">
                                    <div className="border rounded-xl overflow-auto flex-1 shadow-sm bg-white">
                                        <Table>
                                            <TableHeader className="sticky top-0 bg-gray-100 z-20 shadow-sm">
                                                <TableRow>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Asset ID</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={assetFilters.assetId || ""} onChange={e => handleFilterChange(setAssetFilters, 'assetId', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Asset Name</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={assetFilters.assetName || ""} onChange={e => handleFilterChange(setAssetFilters, 'assetName', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <span>Period</span>
                                                            <Input size={1} className="h-7 text-[10px] px-2 font-normal" placeholder="Filter..." value={assetFilters.period || ""} onChange={e => handleFilterChange(setAssetFilters, 'period', e.target.value)} />
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-bold text-gray-700 text-right py-3">Depr. Amount</TableHead>
                                                    <TableHead className="font-bold text-gray-700 text-right py-3">Accumulated</TableHead>
                                                    <TableHead className="font-bold text-gray-700 text-right py-3">Net Book Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredDepreciation.map((asset) => (
                                                    <TableRow key={asset.id} className="hover:bg-blue-50/50 transition-colors">
                                                        <TableCell className="font-mono text-[11px]">{asset.assetId}</TableCell>
                                                        <TableCell className="font-medium text-gray-900 text-xs">{asset.assetName}</TableCell>
                                                        <TableCell className="text-xs">{asset.period}</TableCell>
                                                        <TableCell className="text-right text-gray-900 text-xs">{formatCurrency(asset.depreciationAmount)}</TableCell>
                                                        <TableCell className="text-right text-gray-900 text-xs">{formatCurrency(asset.accumulatedDepreciation)}</TableCell>
                                                        <TableCell className="text-right font-bold text-blue-700 text-xs">{formatCurrency(asset.netBookValue)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        <TabsContent value="yearly-po" className="flex-1 overflow-hidden flex flex-col gap-2 focus-visible:outline-none data-[state=inactive]:hidden mt-2">
                            <div className="border rounded-xl overflow-auto flex-1 shadow-sm bg-white">
                                <Table className="min-w-[1500px]">
                                    <TableHeader className="sticky top-0 bg-gray-100 z-20 shadow-sm">
                                        <TableRow>
                                            <TableHead rowSpan={2} className="w-[150px] border-r font-bold text-gray-700 bg-gray-200 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span>Department</span>
                                                    <Input size={1} className="h-7 text-[10px] px-2 font-normal bg-white" placeholder="Filter..." value={poFilters.department || ""} onChange={e => handleFilterChange(setPoFilters, 'department', e.target.value)} />
                                                </div>
                                            </TableHead>
                                            <TableHead rowSpan={2} className="w-[150px] border-r font-bold text-gray-700 bg-gray-200 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span>Project</span>
                                                    <Input size={1} className="h-7 text-[10px] px-2 font-normal bg-white" placeholder="Filter..." value={poFilters.project || ""} onChange={e => handleFilterChange(setPoFilters, 'project', e.target.value)} />
                                                </div>
                                            </TableHead>
                                            <TableHead rowSpan={2} className="w-[150px] border-r font-bold text-gray-700 bg-gray-200 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span>Vendor</span>
                                                    <Input size={1} className="h-7 text-[10px] px-2 font-normal bg-white" placeholder="Filter..." value={poFilters.vendor || ""} onChange={e => handleFilterChange(setPoFilters, 'vendor', e.target.value)} />
                                                </div>
                                            </TableHead>
                                            <TableHead rowSpan={2} className="w-[150px] border-r font-bold text-gray-700 bg-gray-200 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span>PO Number</span>
                                                    <Input size={1} className="h-7 text-[10px] px-2 font-normal bg-white" placeholder="Filter..." value={poFilters.poNumber || ""} onChange={e => handleFilterChange(setPoFilters, 'poNumber', e.target.value)} />
                                                </div>
                                            </TableHead>
                                            <TableHead colSpan={3} className="text-center border-r bg-blue-100 text-blue-900 font-bold border-b border-blue-200">Q1</TableHead>
                                            <TableHead colSpan={3} className="text-center border-r bg-blue-100 text-blue-900 font-bold border-b border-blue-200">Q2</TableHead>
                                            <TableHead colSpan={3} className="text-center border-r bg-blue-100 text-blue-900 font-bold border-b border-blue-200">Q3</TableHead>
                                            <TableHead colSpan={3} className="text-center bg-blue-100 text-blue-900 font-bold border-b border-blue-200">Q4</TableHead>
                                        </TableRow>
                                        <TableRow className="bg-blue-50/50">
                                            {/* Q1 */}
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Actual</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Commit</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800 border-r border-blue-200">Forecast</TableHead>
                                            {/* Q2 */}
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Actual</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Commit</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800 border-r border-blue-200">Forecast</TableHead>
                                            {/* Q3 */}
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Actual</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Commit</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800 border-r border-blue-200">Forecast</TableHead>
                                            {/* Q4 */}
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Actual</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Commit</TableHead>
                                            <TableHead className="text-right text-[10px] font-bold text-blue-800">Forecast</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredYearlyPo.map((po) => (
                                            <TableRow key={po.poNumber} className="hover:bg-blue-50/50 transition-colors border-b">
                                                <TableCell className="border-r font-medium text-gray-900 text-xs">{po.department}</TableCell>
                                                <TableCell className="border-r text-gray-600 text-xs">{po.project}</TableCell>
                                                <TableCell className="border-r font-medium text-gray-900 text-xs">{po.vendor}</TableCell>
                                                <TableCell className="border-r font-mono text-blue-600 text-xs">{po.poNumber}</TableCell>

                                                {/* Q1 */}
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q1.actual)}</TableCell>
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q1.commit)}</TableCell>
                                                <TableCell className="text-right text-[11px] border-r font-medium text-blue-900">{formatCurrency(po.quarters.Q1.forecast)}</TableCell>

                                                {/* Q2 */}
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q2.actual)}</TableCell>
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q2.commit)}</TableCell>
                                                <TableCell className="text-right text-[11px] border-r font-medium text-blue-900">{formatCurrency(po.quarters.Q2.forecast)}</TableCell>

                                                {/* Q3 */}
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q3.actual)}</TableCell>
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q3.commit)}</TableCell>
                                                <TableCell className="text-right text-[11px] border-r font-medium text-blue-900">{formatCurrency(po.quarters.Q3.forecast)}</TableCell>

                                                {/* Q4 */}
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q4.actual)}</TableCell>
                                                <TableCell className="text-right text-[11px]">{formatCurrency(po.quarters.Q4.commit)}</TableCell>
                                                <TableCell className="text-right text-[11px] font-medium text-blue-900">{formatCurrency(po.quarters.Q4.forecast)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
