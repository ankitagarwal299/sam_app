'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddDraftPOModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddDraftPOModal({ isOpen, onClose, onSuccess }: AddDraftPOModalProps) {
    const [vendorName, setVendorName] = useState('');
    const [poDescription, setPODescription] = useState('');
    const [purchaseType, setPurchaseType] = useState('Software');
    const [totalAmount, setTotalAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expenseType, setExpenseType] = useState('OPEX');
    const [glAccount, setGlAccount] = useState('');
    const [deptCode, setDeptCode] = useState('');
    const [productOwner, setProductOwner] = useState('');
    const [financialAnalyst, setFinancialAnalyst] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setVendorName('');
        setPODescription('');
        setPurchaseType('Software');
        setTotalAmount('');
        setStartDate('');
        setEndDate('');
        setExpenseType('OPEX');
        setGlAccount('');
        setDeptCode('');
        setProductOwner('');
        setFinancialAnalyst('');
    };

    const handleSubmit = async () => {
        if (!vendorName || !poDescription || !totalAmount || !startDate || !endDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const fields = [
                { key: 'VENDOR_NAME', value: vendorName.toUpperCase(), name: 'Vendor Name', type: 'STRING', readOnly: true },
                { key: 'PO_DESCRIPTION', value: poDescription, name: 'PO Description', type: 'STRING', readOnly: false },
                { key: 'PURCHASE_TYPE', value: purchaseType, name: 'Purchase Type', type: 'STRING', readOnly: false },
                { key: 'TOTAL_AMOUNT_USD', value: totalAmount, name: 'PO Amount', type: 'CURRENCY', readOnly: true },
                { key: 'PO_START_DATE', value: startDate.replace(/-/g, '/') + ' 00:00:00', name: 'Start Date', type: 'DATETIME', readOnly: false },
                { key: 'PO_END_DATE', value: endDate.replace(/-/g, '/') + ' 00:00:00', name: 'End Date', type: 'DATETIME', readOnly: false },
                { key: 'COGS_OR_OPEX', value: expenseType, name: 'Expense Type', type: 'STRING', readOnly: false },
                { key: 'GL_ACCOUNT', value: glAccount || '', name: 'GL Account', type: 'STRING', readOnly: false },
                { key: 'FINANCIAL_DEPARTMENT_CODE', value: deptCode || '', name: 'Department Number', type: 'STRING', readOnly: false },
                { key: 'PRODUCT_OWNER', value: productOwner || '', name: 'Product Owner', type: 'STRING', readOnly: false },
                { key: 'FINANCIAL_ANALYST_NAME', value: financialAnalyst || '', name: 'Financial Analyst', type: 'STRING', readOnly: false },
                { key: 'NODE_LEVEL02_NAME_HIER', value: '', name: 'Level 2 Leader', type: 'STRING', readOnly: false },
                { key: 'NODE_LEVEL03_NAME', value: '', name: 'Level 3 Leader', type: 'STRING', readOnly: false },
            ];

            const res = await fetch('/api/datalake/v1/attributes/purchaseorders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields }),
            });

            if (!res.ok) throw new Error('Failed to create PO');

            const data = await res.json();
            toast.success(`Draft PO ${data.poNumber} created successfully`);
            resetForm();
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to create draft PO');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Draft Purchase Order</DialogTitle>
                    <DialogDescription>Create a new PO manually. It will start in Draft status.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Vendor Name *</label>
                            <Input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g., MICROSOFT" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">PO Description *</label>
                            <Input value={poDescription} onChange={e => setPODescription(e.target.value)} placeholder="e.g., Azure Enterprise Agreement" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Purchase Type *</label>
                            <Select value={purchaseType} onValueChange={setPurchaseType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Software">Software</SelectItem>
                                    <SelectItem value="Hardware">Hardware</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Total Amount (USD) *</label>
                            <Input value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="500000" type="number" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Expense Type *</label>
                            <Select value={expenseType} onValueChange={setExpenseType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEX">OPEX</SelectItem>
                                    <SelectItem value="COGS">COGS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Start Date *</label>
                            <Input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">End Date *</label>
                            <Input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">GL Account</label>
                            <Input value={glAccount} onChange={e => setGlAccount(e.target.value)} placeholder="GL-XXX-XX" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Department Code</label>
                            <Input value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="D-XXXX" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Product Owner</label>
                            <Input value={productOwner} onChange={e => setProductOwner(e.target.value)} placeholder="Name" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">Financial Analyst</label>
                            <Input value={financialAnalyst} onChange={e => setFinancialAnalyst(e.target.value)} placeholder="Name" />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Draft PO'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
