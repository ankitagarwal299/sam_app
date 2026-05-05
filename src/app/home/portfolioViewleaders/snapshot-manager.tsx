'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Camera, History, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { LeadersViewData } from './page';

export interface Snapshot {
    id: string;
    version: number;
    author: string;
    createdAt: string;
    memo: string;
    filters: Record<string, string>;
    data: LeadersViewData;
}

interface SnapshotManagerProps {
    data: LeadersViewData;
    filters: Record<string, string>;
}

export function SnapshotManager({ data, filters }: SnapshotManagerProps) {
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [viewingSnapshot, setViewingSnapshot] = useState<Snapshot | null>(null);
    const [author, setAuthor] = useState('Executive User');
    const [memo, setMemo] = useState('');
    const historyRef = useRef<HTMLDivElement>(null);

    // Close history popover on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
                setIsHistoryOpen(false);
            }
        }
        if (isHistoryOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isHistoryOpen]);

    const nextVersion = snapshots.length + 1;

    const handleSave = () => {
        if (!memo.trim()) return;

        const snapshot: Snapshot = {
            id: crypto.randomUUID(),
            version: nextVersion,
            author: author.trim() || 'Executive User',
            createdAt: new Date().toISOString(),
            memo: memo.trim(),
            filters: { ...filters },
            data: structuredClone(data),
        };

        setSnapshots(prev => [snapshot, ...prev]);
        setIsCreateOpen(false);
        setMemo('');
        toast.success(`Executive Memo v${snapshot.version} locked and saved`);
    };

    const formatSnapshotDate = (iso: string) => {
        return new Date(iso).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(value);

    const activeFilters = Object.entries(filters).filter(([, v]) => v && v !== 'all');

    return (
        <>
            {/* Header Buttons */}
            <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setIsCreateOpen(true)}
            >
                <Camera className="w-3.5 h-3.5" />
                Take Snapshot
            </Button>

            <div className="relative" ref={historyRef}>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                    <History className="w-3.5 h-3.5" />
                    Snapshots{snapshots.length > 0 && ` (${snapshots.length})`}
                </Button>

                {/* History Popover */}
                {isHistoryOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                        <div className="p-3 border-b">
                            <h4 className="text-sm font-semibold text-gray-900">Snapshot History</h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {snapshots.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-400 italic">
                                    No snapshots yet
                                </div>
                            ) : (
                                snapshots.map(s => (
                                    <button
                                        key={s.id}
                                        className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                                        onClick={() => {
                                            setViewingSnapshot(s);
                                            setIsHistoryOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">
                                                v{s.version}
                                            </span>
                                            <span className="text-xs text-gray-500">{s.author}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{formatSnapshotDate(s.createdAt)}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">{s.memo}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Snapshot Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Executive Memo</DialogTitle>
                        <DialogDescription>
                            Capture the current dashboard state with your executive commentary. This memo will be locked and immutable once saved.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Author</label>
                            <Input
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="Your name"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">Memo <span className="text-red-500">*</span></label>
                            <textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="Record decisions, approvals, or notes..."
                                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-md p-3 space-y-2">
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                                <span>Version: <span className="font-semibold text-gray-900">v{nextVersion}</span></span>
                                <span>Date: <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span></span>
                            </div>
                            {activeFilters.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="text-xs text-gray-500">Filters:</span>
                                    {activeFilters.map(([key, val]) => (
                                        <span key={key} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                            {key}: {val}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {activeFilters.length === 0 && (
                                <span className="text-xs text-gray-400">No active filters</span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={!memo.trim()} className="gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Lock & Save Snapshot
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Viewer Modal */}
            <Dialog open={!!viewingSnapshot} onOpenChange={() => setViewingSnapshot(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    {viewingSnapshot && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    <DialogTitle>Executive Memo — v{viewingSnapshot.version}</DialogTitle>
                                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        LOCKED
                                    </span>
                                </div>
                                <DialogDescription>
                                    Immutable record — this memo cannot be edited or deleted.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 border-b pb-3">
                                <span>Author: <span className="font-semibold text-gray-900">{viewingSnapshot.author}</span></span>
                                <span>Date: <span className="font-semibold text-gray-900">{new Date(viewingSnapshot.createdAt).toLocaleString()}</span></span>
                                <span>Version: <span className="font-semibold text-gray-900">v{viewingSnapshot.version}</span></span>
                            </div>

                            {/* Filters */}
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-700">Active Filters</h4>
                                {Object.entries(viewingSnapshot.filters).filter(([, v]) => v && v !== 'all').length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(viewingSnapshot.filters)
                                            .filter(([, v]) => v && v !== 'all')
                                            .map(([key, val]) => (
                                                <span key={key} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                    {key}: {val}
                                                </span>
                                            ))}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">No active filters</span>
                                )}
                            </div>

                            {/* Memo */}
                            <div className="space-y-1">
                                <h4 className="text-xs font-semibold text-gray-700">Executive Commentary</h4>
                                <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800 whitespace-pre-wrap">
                                    {viewingSnapshot.memo}
                                </div>
                            </div>

                            {/* Frozen Dashboard Data */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold text-gray-700">Dashboard Data (Frozen)</h4>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-gray-50 rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">Total Spend</div>
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(viewingSnapshot.data.metrics.total)}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">TCV</div>
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(viewingSnapshot.data.metrics.tcv)}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3 text-center">
                                        <div className="text-xs text-gray-500">ACV</div>
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(viewingSnapshot.data.metrics.acv)}</div>
                                    </div>
                                </div>

                                {/* Level 4 Spend */}
                                <div>
                                    <h5 className="text-xs font-medium text-gray-600 mb-2">Top Level 4 Leaders</h5>
                                    <div className="space-y-1">
                                        {viewingSnapshot.data.level4Spend.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">
                                                <span>{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.total)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Level 5 Spend */}
                                <div>
                                    <h5 className="text-xs font-medium text-gray-600 mb-2">Top Level 5 Leaders</h5>
                                    <div className="space-y-1">
                                        {viewingSnapshot.data.level5Spend.slice(0, 5).map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs text-gray-700 bg-gray-50 rounded px-2 py-1">
                                                <span>{item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Funding Sources */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-md p-3">
                                        <div className="text-xs text-gray-500 mb-1">Enterprise Funded</div>
                                        <div className="text-sm font-bold">{formatCurrency(viewingSnapshot.data.fundingSource.central.total)}</div>
                                        <div className="text-xs text-gray-400">POs: {viewingSnapshot.data.fundingSource.central.count}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-md p-3">
                                        <div className="text-xs text-gray-500 mb-1">Functional Funded</div>
                                        <div className="text-sm font-bold">{formatCurrency(viewingSnapshot.data.fundingSource.functional.total)}</div>
                                        <div className="text-xs text-gray-400">POs: {viewingSnapshot.data.fundingSource.functional.count}</div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" size="sm" onClick={() => setViewingSnapshot(null)}>Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
