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
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

interface RenewalModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (selectedPo: any) => void
    initialVendorName?: string
}

// Mock data for existing POs
const EXISTING_POS = [
    { id: "PO-001", vendor: "TECHNOLOGY LLC", amount: 50000, date: "2024-01-15" },
    { id: "PO-002", vendor: "MICROSOFT", amount: 120000, date: "2024-02-20" },
    { id: "PO-003", vendor: "TECHNOLOGY LLC", amount: 75000, date: "2024-03-10" },
    { id: "PO-004", vendor: "ADOBE", amount: 30000, date: "2024-04-05" },
    { id: "PO-005", vendor: "SALESFORCE", amount: 200000, date: "2024-05-12" },
]

export function RenewalModal({
    isOpen,
    onClose,
    onConfirm,
    initialVendorName,
}: RenewalModalProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPoId, setSelectedPoId] = useState<string | null>(null)

    // Auto-filter by vendor name when modal opens
    useEffect(() => {
        if (isOpen && initialVendorName) {
            setSearchTerm(initialVendorName)
        } else if (isOpen) {
            setSearchTerm("")
        }
    }, [isOpen, initialVendorName])

    const filteredPos = EXISTING_POS.filter(
        (po) =>
            po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleConfirm = () => {
        const selectedPo = EXISTING_POS.find((po) => po.id === selectedPoId)
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
                        Select an existing Purchase Order to associate this renewal with.
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PO Number</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPos.length > 0 ? (
                                    filteredPos.map((po) => (
                                        <TableRow
                                            key={po.id}
                                            className={`cursor-pointer ${selectedPoId === po.id ? "bg-muted" : ""
                                                }`}
                                            onClick={() => setSelectedPoId(po.id)}
                                        >
                                            <TableCell className="font-medium">{po.id}</TableCell>
                                            <TableCell>{po.vendor}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(po.amount)}
                                            </TableCell>
                                            <TableCell>{po.date}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
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
