"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Search, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface RenewalModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (selectedPo: any) => void
    initialVendorName?: string
}

interface PortfolioPO {
    id: string
    vendor: string
    description: string
    amount: number
    startDate: string
}

export function RenewalModal({
    isOpen,
    onClose,
    onConfirm,
    initialVendorName,
}: RenewalModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPoId, setSelectedPoId] = useState<string | null>(null)
    const [portfolioPOs, setPortfolioPOs] = useState<PortfolioPO[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Fetch InPortfolio POs when modal opens
    useEffect(() => {
        if (!isOpen) return
        setSelectedPoId(null)
        setSearchTerm(initialVendorName || "")
        setIsLoading(true)

        fetch('/api/datalake/v1/attributes/purchaseorders', { method: 'POST' })
            .then(res => res.json())
            .then(json => {
                const pos: PortfolioPO[] = json.purchaseOrderRows
                    .map((row: any[]) => {
                        const get = (key: string) => row.find((f: any) => f.key === key)?.value ?? '';
                        return {
                            id: String(get('PO_NUMBER')),
                            vendor: String(get('VENDOR_NAME')),
                            description: String(get('PO_DESCRIPTION')),
                            amount: parseFloat(String(get('TOTAL_AMOUNT_USD'))) || 0,
                            startDate: String(get('PO_START_DATE')).split(' ')[0] || '',
                            status: String(get('PO_STATUS')),
                        }
                    })
                    .filter((po: any) => po.status === 'InPortfolio')
                setPortfolioPOs(pos)
            })
            .catch(() => setPortfolioPOs([]))
            .finally(() => setIsLoading(false))
    }, [isOpen, initialVendorName])

    const filteredPos = portfolioPOs.filter(
        (po) =>
            po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleConfirm = () => {
        const selectedPo = portfolioPOs.find((po) => po.id === selectedPoId)
        if (selectedPo) {
            onConfirm(selectedPo)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Associate with Existing PO</DialogTitle>
                    <DialogDescription>
                        Select an existing InPortfolio Purchase Order to associate this renewal with.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Vendor or PO Number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="rounded-md border h-[300px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Loading InPortfolio POs...
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>PO Number</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Start Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPos.length > 0 ? (
                                        filteredPos.map((po) => (
                                            <TableRow
                                                key={po.id}
                                                className={`cursor-pointer ${selectedPoId === po.id ? "bg-muted" : ""}`}
                                                onClick={() => setSelectedPoId(po.id)}
                                            >
                                                <TableCell className="font-medium">{po.id}</TableCell>
                                                <TableCell>{po.vendor}</TableCell>
                                                <TableCell className="text-xs text-gray-600">{po.description}</TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format(po.amount)}
                                                </TableCell>
                                                <TableCell>{po.startDate}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                                {portfolioPOs.length === 0
                                                    ? "No InPortfolio POs found. Send POs as New first."
                                                    : "No results match your search."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedPoId}>
                        Confirm Association
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
