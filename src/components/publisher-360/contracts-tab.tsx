'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Eye, Pencil, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contract, formatCurrency, formatDate } from '@/lib/publisher-360-data';
import { EditSidePanel, FormField, FormInput, FormTextArea, FormSelect } from './edit-side-panel';
import { toast } from 'sonner';

interface ContractsTabProps {
    contracts: Contract[];
    onContractUpdate: (contract: Contract) => void;
}

export function ContractsTab({ contracts, onContractUpdate }: ContractsTabProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [editFormData, setEditFormData] = useState<Contract | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [buFilter, setBuFilter] = useState<string>('all');

    const businessUnits = useMemo(() =>
        [...new Set(contracts.map(c => c.businessUnit))],
        [contracts]
    );

    const filteredContracts = useMemo(() => {
        return contracts.filter(c => {
            if (statusFilter !== 'all' && c.status !== statusFilter) return false;
            if (buFilter !== 'all' && c.businessUnit !== buFilter) return false;
            return true;
        });
    }, [contracts, statusFilter, buFilter]);

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const handleEdit = (contract: Contract) => {
        setEditingContract(contract);
        setEditFormData({ ...contract });
    };

    const handleSave = async () => {
        if (!editFormData) return;

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            onContractUpdate(editFormData);
            toast.success('Contract updated successfully');
            setEditingContract(null);
            setEditFormData(null);
        } catch {
            toast.error('Failed to save contract');
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = editingContract && editFormData &&
        JSON.stringify(editingContract) !== JSON.stringify(editFormData);

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px] h-9 text-sm">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={buFilter} onValueChange={setBuFilter}>
                        <SelectTrigger className="w-[160px] h-9 text-sm">
                            <SelectValue placeholder="All Business Units" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Business Units</SelectItem>
                            {businessUnits.map(bu => (
                                <SelectItem key={bu} value={bu}>{bu}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10 px-3 py-3"></th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Contract #</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">PO Number</th>
                                <th className="text-right px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">TCV</th>
                                <th className="text-right px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">ACV</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Renewal Date</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide max-w-[200px]">Description</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">BU</th>
                                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContracts.map((contract) => (
                                <>
                                    <tr
                                        key={contract.id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${expandedRows.has(contract.id) ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <td className="px-3 py-3">
                                            <button
                                                onClick={() => toggleExpand(contract.id)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                            >
                                                {expandedRows.has(contract.id)
                                                    ? <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    : <ChevronRight className="h-4 w-4 text-gray-400" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-3 py-3 font-medium text-blue-600">{contract.contractNumber}</td>
                                        <td className="px-3 py-3 text-gray-700">{contract.poNumber}</td>
                                        <td className="px-3 py-3 text-right font-medium text-gray-900">{formatCurrency(contract.tcv)}</td>
                                        <td className="px-3 py-3 text-right text-gray-700">{formatCurrency(contract.acv)}</td>
                                        <td className="px-3 py-3 text-gray-700">{formatDate(contract.renewalDate)}</td>
                                        <td className="px-3 py-3 text-gray-600 max-w-[200px] truncate" title={contract.description}>
                                            {contract.description}
                                        </td>
                                        <td className="px-3 py-3 text-gray-700">{contract.businessUnit}</td>
                                        <td className="px-3 py-3">
                                            <ContractStatusBadge status={contract.status} />
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => toggleExpand(contract.id)}
                                                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(contract)}
                                                    className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expanded Row */}
                                    {expandedRows.has(contract.id) && (
                                        <tr key={`${contract.id}-expanded`} className="bg-gray-50">
                                            <td colSpan={10} className="px-6 py-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 block text-xs mb-1">Start Date</span>
                                                        <span className="font-medium text-gray-800">{formatDate(contract.startDate)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block text-xs mb-1">End Date</span>
                                                        <span className="font-medium text-gray-800">{formatDate(contract.endDate)}</span>
                                                    </div>
                                                    {contract.contactPerson && (
                                                        <div>
                                                            <span className="text-gray-500 block text-xs mb-1">Contact Person</span>
                                                            <span className="font-medium text-gray-800">{contract.contactPerson}</span>
                                                        </div>
                                                    )}
                                                    {contract.paymentTerms && (
                                                        <div>
                                                            <span className="text-gray-500 block text-xs mb-1">Payment Terms</span>
                                                            <span className="font-medium text-gray-800">{contract.paymentTerms}</span>
                                                        </div>
                                                    )}
                                                    {contract.attachments && contract.attachments.length > 0 && (
                                                        <div className="col-span-2">
                                                            <span className="text-gray-500 block text-xs mb-1">Attachments</span>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {contract.attachments.map((att, idx) => (
                                                                    <span key={idx} className="text-blue-600 text-xs underline cursor-pointer hover:text-blue-800">
                                                                        {att}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {contract.notes && (
                                                        <div className="col-span-4">
                                                            <span className="text-gray-500 block text-xs mb-1">Notes</span>
                                                            <span className="text-gray-700">{contract.notes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-600">
                        Showing 1-{filteredContracts.length} of {filteredContracts.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>

            {/* Edit Side Panel */}
            <EditSidePanel
                isOpen={!!editingContract}
                onClose={() => {
                    setEditingContract(null);
                    setEditFormData(null);
                }}
                title="Edit Contract"
                onSave={handleSave}
                isSaving={isSaving}
                isDirty={!!isDirty}
            >
                {editFormData && (
                    <div className="space-y-4">
                        <FormField label="Contract Number" readOnly>
                            <FormInput value={editFormData.contractNumber} readOnly />
                        </FormField>
                        <FormField label="PO Number" readOnly>
                            <FormInput value={editFormData.poNumber} readOnly />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="TCV" required>
                                <FormInput
                                    type="number"
                                    value={editFormData.tcv}
                                    onChange={(e) => setEditFormData({ ...editFormData, tcv: Number(e.target.value) })}
                                />
                            </FormField>
                            <FormField label="ACV" required>
                                <FormInput
                                    type="number"
                                    value={editFormData.acv}
                                    onChange={(e) => setEditFormData({ ...editFormData, acv: Number(e.target.value) })}
                                />
                            </FormField>
                        </div>
                        <FormField label="Renewal Date" required>
                            <FormInput
                                type="date"
                                value={editFormData.renewalDate}
                                onChange={(e) => setEditFormData({ ...editFormData, renewalDate: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Description">
                            <FormTextArea
                                rows={3}
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Business Unit">
                            <FormSelect
                                value={editFormData.businessUnit}
                                onChange={(e) => setEditFormData({ ...editFormData, businessUnit: e.target.value })}
                                options={[
                                    { value: 'IT Services', label: 'IT Services' },
                                    { value: 'Engineering', label: 'Engineering' },
                                    { value: 'Finance', label: 'Finance' },
                                    { value: 'Marketing', label: 'Marketing' },
                                    { value: 'Sales', label: 'Sales' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Status">
                            <FormSelect
                                value={editFormData.status}
                                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Contract['status'] })}
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Expiring Soon', label: 'Expiring Soon' },
                                    { value: 'Closed', label: 'Closed' },
                                    { value: 'Draft', label: 'Draft' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Notes">
                            <FormTextArea
                                rows={3}
                                value={editFormData.notes || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                placeholder="Add notes..."
                            />
                        </FormField>
                    </div>
                )}
            </EditSidePanel>
        </div>
    );
}

function ContractStatusBadge({ status }: { status: Contract['status'] }) {
    const styles: Record<Contract['status'], string> = {
        'Active': 'bg-green-100 text-green-700 border-green-200',
        'Expiring Soon': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
        'Draft': 'bg-blue-100 text-blue-700 border-blue-200',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${styles[status]}`}>
            {status}
        </span>
    );
}
