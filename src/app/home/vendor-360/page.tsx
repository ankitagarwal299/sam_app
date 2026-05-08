'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { LayoutDashboard, FileText, Package, Users, UserCheck, PiggyBank, Receipt } from 'lucide-react';

import { PublisherSelector } from '@/components/vendor-360/vendor-selector';
import { OverviewTab } from '@/components/vendor-360/overview-tab';
import { ContractsTab } from '@/components/vendor-360/contracts-tab';
import { ProductsTab } from '@/components/vendor-360/products-tab';
import { PeopleTab } from '@/components/vendor-360/people-tab';
import { StakeholdersTab } from '@/components/vendor-360/stakeholders-tab';
import { SavingsTab } from '@/components/vendor-360/savings-tab';
import { InvoicesTab } from '@/components/vendor-360/invoices-tab';

import { Publisher, Vendor360Data, Contract, Product, PublisherContact, InternalContact, Stakeholder } from '@/lib/vendor-360-data';

// Fetch publishers list
const fetchPublishers = async (): Promise<{ publishers: Publisher[] }> => {
    const res = await fetch('/api/vendor-360');
    if (!res.ok) throw new Error('Failed to fetch publishers');
    return res.json();
};

// Fetch specific publisher data
const fetchPublisherData = async (publisherId: string): Promise<Vendor360Data> => {
    const res = await fetch(`/api/vendor-360?publisherId=${publisherId}`);
    if (!res.ok) throw new Error('Failed to fetch publisher data');
    return res.json();
};

export default function Vendor360Page() {
    const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
    const [localData, setLocalData] = useState<Vendor360Data | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Fetch publishers list
    const { data: publishersData, isLoading: isLoadingPublishers } = useQuery({
        queryKey: ['publishers'],
        queryFn: fetchPublishers,
    });

    // Fetch publisher data when selected
    const { data: publisherData, isLoading: isLoadingData } = useQuery({
        queryKey: ['vendor360', selectedPublisher?.id],
        queryFn: () => fetchPublisherData(selectedPublisher!.id),
        enabled: !!selectedPublisher,
    });

    // Initialize local data when API data loads
    useEffect(() => {
        if (publisherData) {
            setLocalData(publisherData);
        }
    }, [publisherData]);

    // Auto-select first publisher
    useEffect(() => {
        if (publishersData?.publishers && publishersData.publishers.length > 0 && !selectedPublisher) {
            setSelectedPublisher(publishersData.publishers[0]);
        }
    }, [publishersData, selectedPublisher]);

    // Update handlers (update local state for POC)
    const handleContractUpdate = useCallback((updatedContract: Contract) => {
        setLocalData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                contracts: prev.contracts.map(c => c.id === updatedContract.id ? updatedContract : c)
            };
        });
    }, []);

    const handleProductUpdate = useCallback((updatedProduct: Product) => {
        setLocalData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
            };
        });
    }, []);

    const handlePublisherContactUpdate = useCallback((updatedContact: PublisherContact) => {
        setLocalData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                publisherContacts: prev.publisherContacts.map(c => c.id === updatedContact.id ? updatedContact : c)
            };
        });
    }, []);

    const handleInternalContactUpdate = useCallback((updatedContact: InternalContact) => {
        setLocalData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                internalContacts: prev.internalContacts.map(c => c.id === updatedContact.id ? updatedContact : c)
            };
        });
    }, []);

    const handleStakeholderUpdate = useCallback((updatedStakeholder: Stakeholder) => {
        setLocalData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                stakeholders: prev.stakeholders.map(s => s.id === updatedStakeholder.id ? updatedStakeholder : s)
            };
        });
    }, []);

    // Handler to navigate to invoices tab from donut chart
    const handleNavigateToInvoices = useCallback(() => {
        setActiveTab('invoices');
    }, []);

    // Loading state for publishers
    if (isLoadingPublishers) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-6">
                <div className="space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <div className="grid grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Vendor 360° View
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Comprehensive view of purchases, renewals, financials, and relationships
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Year Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Year:</span>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                </select>
                            </div>
                            <PublisherSelector
                                publishers={publishersData?.publishers || []}
                                selectedPublisher={selectedPublisher}
                                onSelect={setSelectedPublisher}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {!selectedPublisher ? (
                    <EmptyState message="Select a publisher to view their 360° profile" />
                ) : isLoadingData || !localData ? (
                    <LoadingSkeleton />
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm mb-6">
                            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <LayoutDashboard className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="contracts" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <FileText className="h-4 w-4" />
                                Contracts
                            </TabsTrigger>
                            <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <Package className="h-4 w-4" />
                                Products
                            </TabsTrigger>
                            <TabsTrigger value="people" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <Users className="h-4 w-4" />
                                People
                            </TabsTrigger>
                            <TabsTrigger value="stakeholders" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <UserCheck className="h-4 w-4" />
                                Stakeholders
                            </TabsTrigger>
                            <TabsTrigger value="savings" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <PiggyBank className="h-4 w-4" />
                                Savings
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                                <Receipt className="h-4 w-4" />
                                Invoices
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-0">
                            <OverviewTab
                                data={localData}
                                selectedYear={selectedYear}
                                onNavigateToInvoices={handleNavigateToInvoices}
                            />
                        </TabsContent>

                        <TabsContent value="contracts" className="mt-0">
                            <ContractsTab
                                contracts={localData.contracts}
                                onContractUpdate={handleContractUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="products" className="mt-0">
                            <ProductsTab
                                products={localData.products}
                                onProductUpdate={handleProductUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="people" className="mt-0">
                            <PeopleTab
                                publisherContacts={localData.publisherContacts}
                                internalContacts={localData.internalContacts}
                                onPublisherContactUpdate={handlePublisherContactUpdate}
                                onInternalContactUpdate={handleInternalContactUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="stakeholders" className="mt-0">
                            <StakeholdersTab
                                stakeholders={localData.stakeholders}
                                onStakeholderUpdate={handleStakeholderUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="savings" className="mt-0">
                            <SavingsTab savings={localData.savings} />
                        </TabsContent>

                        <TabsContent value="invoices" className="mt-0">
                            <InvoicesTab invoices={localData.invoices} />
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
            </div>
            {/* Tabs Skeleton */}
            <Skeleton className="h-10 w-96" />
            {/* Content Skeleton */}
            <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
                <LayoutDashboard className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">{message}</p>
        </div>
    );
}
