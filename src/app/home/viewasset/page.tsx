'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { RenewalModal } from "@/components/renewal-modal"
import { ConfirmDialog } from "@/components/confirm-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

// Define the shape of the raw data item from API
interface RawDataItem {
    key: string;
    value: string | number;
    name: string;
}

// Define the shape of the transformed data for the table
interface PurchaseOrder {
    VENDOR_NAME: string;
    PO_DESCRIPTION: string;
    PO_NUMBER: string;
    TOTAL_AMOUNT_USD: string;
    PO_START_DATE: string;
    PO_END_DATE: string;
    NODE_LEVEL02_NAME_HIER: string;
    NODE_LEVEL03_NAME: string;
    FINANCIAL_DEPARTMENT_CODE: string;
    GL_ACCOUNT: string;
    COGS_OR_OPEX: string;
    PRODUCT_OWNER: string;
    PO_STATUS: string;
    FISCAL_YEAR: string;
    FINANCIAL_ANALYST_NAME: string;
}

const columns: ColumnDef<PurchaseOrder>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "VENDOR_NAME",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Vendor Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "PO_DESCRIPTION",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    PO Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "PO_NUMBER",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    PO Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "PO_START_DATE",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Start Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateStr = row.getValue("PO_START_DATE") as string;
            // Expected format "2025/08/01 00:00:00" -> "2025/08/01"
            return dateStr ? dateStr.split(' ')[0] : 'N/A';
        }
    },
    {
        accessorKey: "PO_END_DATE",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    End Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateStr = row.getValue("PO_END_DATE") as string;
            return dateStr ? dateStr.split(' ')[0] : 'N/A';
        }
    },
    {
        accessorKey: "TOTAL_AMOUNT_USD",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    PO Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("TOTAL_AMOUNT_USD"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return formatted;
        },
    },
    {
        accessorKey: "NODE_LEVEL02_NAME_HIER",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Leader 2
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "NODE_LEVEL03_NAME",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Leader 3
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "FINANCIAL_DEPARTMENT_CODE",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Dept Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "GL_ACCOUNT",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    GL Account
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "COGS_OR_OPEX",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Expense Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "PRODUCT_OWNER",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Product Owner
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "FINANCIAL_ANALYST_NAME",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Financial Analyst
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
];

const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
    const res = await fetch('/api/datalake/v1/attributes/purchaseorders', {
        method: 'POST',
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await res.json();

    const allPos = json.purchaseOrderRows.map((row: RawDataItem[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const po: Record<string, any> = {};
        row.forEach((item) => {
            po[item.key] = item.value;
        });

        po['PO_DESCRIPTION'] = po['PO_DESCRIPTION'] || po['VENDOR_NAME'] || 'Unknown';
        po['FISCAL_YEAR'] = po['FISCAL_YEAR'] || 'Unknown';

        return po as PurchaseOrder;
    });

    // Show everything except 'Active' (so we get both pending/null and Ignored)
    return allPos.filter((po: any) => po.PO_STATUS !== 'Active');
};

export default function ViewAssetPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['purchaseOrders'],
        queryFn: fetchPurchaseOrders,
    });

    const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false)
    const [selectedVendorForRenewal, setSelectedVendorForRenewal] = useState<string | undefined>(undefined)
    const [rowSelection, setRowSelection] = useState({})
    const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>("All")
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isIgnoreConfirmOpen, setIsIgnoreConfirmOpen] = useState(false)
    const [isRevertConfirmOpen, setIsRevertConfirmOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<string>("pending")

    const uniqueFiscalYears = Array.from(new Set(data?.map(po => po.FISCAL_YEAR).filter(Boolean))).sort()

    const filteredData = data?.filter(po => {
        // Tab filter
        if (activeTab === "pending" && po.PO_STATUS === 'Ignored') return false;
        if (activeTab === "ignored" && po.PO_STATUS !== 'Ignored') return false;

        // FY filter
        if (selectedFiscalYear === "All") return true;
        return String(po.FISCAL_YEAR) === selectedFiscalYear;
    }) || [];

    const updatePOStatus = async (poNumbers: string[], status: string) => {
        const promises = poNumbers.map(poNumber =>
            fetch('/api/datalake/v1/attributes/purchaseorders', {
                method: 'PATCH',
                body: JSON.stringify({ poNumber, status }),
                headers: { 'Content-Type': 'application/json' }
            })
        );

        try {
            const results = await Promise.all(promises);
            const failures = results.filter(r => !r.ok);
            if (failures.length > 0) {
                toast.error(`Failed to update ${failures.length} PO(s)`);
            } else {
                toast.success(`Successfully updated ${poNumbers.length} PO(s) to ${status}`);
            }
            queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
            setRowSelection({});
        } catch (err) {
            toast.error("An error occurred while updating PO status");
            console.error(err);
        }
    }

    const handleAddAsNew = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) {
            toast.error("Please select at least one PO")
            return
        }
        setIsConfirmDialogOpen(true);
    }

    const confirmAddAsNew = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) return;

        const poNumbers = selectedIndices.map(idx => filteredData[idx].PO_NUMBER);
        await updatePOStatus(poNumbers, 'Active');
    }

    const handleIgnore = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) {
            toast.error("Please select at least one PO")
            return
        }
        setIsIgnoreConfirmOpen(true);
    }

    const confirmIgnore = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) return;

        const poNumbers = selectedIndices.map(idx => filteredData[idx].PO_NUMBER);
        await updatePOStatus(poNumbers, 'Ignored');
    }

    const handleRevert = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) {
            toast.error("Please select at least one PO")
            return
        }
        setIsRevertConfirmOpen(true);
    }

    const confirmRevert = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        if (selectedIndices.length === 0) return;

        const poNumbers = selectedIndices.map(idx => filteredData[idx].PO_NUMBER);
        // Setting status back to null marks it as pending/fresh
        await updatePOStatus(poNumbers, null as any);
    }

    const handleAddAsRenewal = async () => {
        const selectedIndices = Object.keys(rowSelection).map(Number)
        if (selectedIndices.length === 0) {
            toast.error("Please select a PO to renew")
            return
        }
        if (selectedIndices.length > 1) {
            toast.error("Please select only one PO for renewal association")
            return
        }

        const selectedPO = filteredData[selectedIndices[0]]
        if (selectedPO) {
            // Update status to Active first (as per requirement to remove from list)
            await updatePOStatus([selectedPO.PO_NUMBER], 'Active');
            setSelectedVendorForRenewal(selectedPO.VENDOR_NAME)
            setIsRenewalModalOpen(true)
        }
    }

    const handleRenewalConfirm = (existingPo: any) => {
        toast.success(`Associated with existing PO: ${existingPo.id}`)
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">New PO available for Portfolio View</h1>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4">Error loading data. Please try again later.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Purchase Order Inbox</h1>
                    <p className="text-gray-500">Review and process incoming purchase orders to align them with your portfolio.</p>
                </div>
                <div className="flex gap-2 items-center">
                    {activeTab === "pending" ? (
                        <>
                            <Button onClick={handleAddAsNew} className="bg-green-600 hover:bg-green-700">Add as New</Button>
                            <Button onClick={handleAddAsRenewal} className="bg-blue-600 hover:bg-blue-700">Add as Renewal</Button>
                            <Button onClick={handleIgnore} variant="destructive">Ignore PO</Button>
                        </>
                    ) : (
                        <Button onClick={handleRevert} className="bg-orange-600 hover:bg-orange-700">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Revert to Pending Inbox
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setRowSelection({}); }} className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList>
                        <TabsTrigger value="pending" className="px-6">
                            Pending ({data?.filter(po => po.PO_STATUS !== 'Ignored').length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="ignored" className="px-6">
                            Ignored ({data?.filter(po => po.PO_STATUS === 'Ignored').length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">Fiscal Year:</span>
                        <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="All Years" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Fiscal Years</SelectItem>
                                {uniqueFiscalYears.map(fy => (
                                    <SelectItem key={fy} value={String(fy)}>{fy}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <TabsContent value="pending" className="border-none p-0 outline-none">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                </TabsContent>

                <TabsContent value="ignored" className="border-none p-0">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                    />
                </TabsContent>
            </Tabs>

            <RenewalModal
                isOpen={isRenewalModalOpen}
                onClose={() => setIsRenewalModalOpen(false)}
                onConfirm={handleRenewalConfirm}
                initialVendorName={selectedVendorForRenewal}
            />

            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={confirmAddAsNew}
                title="Add as New Purchase"
                description={`Are you sure you want to add ${Object.keys(rowSelection).length} selected PO(s) as New Purchase? This will move them to the Portfolio View.`}
                confirmText="Add POs"
            />

            <ConfirmDialog
                isOpen={isIgnoreConfirmOpen}
                onClose={() => setIsIgnoreConfirmOpen(false)}
                onConfirm={confirmIgnore}
                title="Ignore Purchase Orders"
                description={`Are you sure you want to ignore ${Object.keys(rowSelection).length} selected PO(s)? They will be hidden from this view.`}
                confirmText="Ignore POs"
                variant="destructive"
            />

            <ConfirmDialog
                isOpen={isRevertConfirmOpen}
                onClose={() => setIsRevertConfirmOpen(false)}
                onConfirm={confirmRevert}
                title="Revert to Pending"
                description={`Are you sure you want to revert ${Object.keys(rowSelection).length} selected PO(s) back to the Pending Inbox?`}
                confirmText="Revert POs"
            />
        </div>
    );
}
