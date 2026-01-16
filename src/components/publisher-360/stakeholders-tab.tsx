'use client';

import { useState } from 'react';
import { Plus, Pencil, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Stakeholder } from '@/lib/publisher-360-data';
import { EditSidePanel, FormField, FormInput, FormTextArea, FormSelect } from './edit-side-panel';
import { toast } from 'sonner';

interface StakeholdersTabProps {
    stakeholders: Stakeholder[];
    onStakeholderUpdate: (stakeholder: Stakeholder) => void;
}

export function StakeholdersTab({ stakeholders, onStakeholderUpdate }: StakeholdersTabProps) {
    const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
    const [editFormData, setEditFormData] = useState<Stakeholder | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    const handleEdit = (stakeholder: Stakeholder) => {
        setEditingStakeholder(stakeholder);
        setEditFormData({ ...stakeholder });
    };

    const handleSave = async () => {
        if (!editFormData) return;

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            onStakeholderUpdate(editFormData);
            toast.success('Stakeholder updated successfully');
            setEditingStakeholder(null);
            setEditFormData(null);
        } catch {
            toast.error('Failed to save stakeholder');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleNotes = (id: string) => {
        const newExpanded = new Set(expandedNotes);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedNotes(newExpanded);
    };

    const isDirty = editingStakeholder && editFormData &&
        JSON.stringify(editingStakeholder) !== JSON.stringify(editFormData);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Key Stakeholders</h3>
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stakeholder
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Org / BU</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Influence</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide min-w-[250px]">Notes</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stakeholders.map((stakeholder) => (
                                <tr key={stakeholder.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{stakeholder.name}</div>
                                        {stakeholder.email && (
                                            <div className="text-xs text-blue-600">{stakeholder.email}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{stakeholder.orgBU}</td>
                                    <td className="px-4 py-3 text-gray-700">{stakeholder.role}</td>
                                    <td className="px-4 py-3 text-center">
                                        <InfluenceBadge level={stakeholder.influence} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-start gap-1">
                                            <button
                                                onClick={() => toggleNotes(stakeholder.id)}
                                                className="p-0.5 mt-0.5 shrink-0"
                                            >
                                                {expandedNotes.has(stakeholder.id)
                                                    ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                                    : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                                                }
                                            </button>
                                            <span className={`text-gray-600 ${expandedNotes.has(stakeholder.id) ? '' : 'truncate max-w-[220px]'}`}>
                                                {stakeholder.notes}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleEdit(stakeholder)}
                                                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                                title="More Actions"
                                            >
                                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {stakeholders.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-gray-500 mb-4">No stakeholders have been added yet</p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Stakeholder
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {stakeholders.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <span className="text-sm text-gray-600">
                            Showing 1-{stakeholders.length} of {stakeholders.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm" disabled>Next</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Side Panel */}
            <EditSidePanel
                isOpen={!!editingStakeholder}
                onClose={() => {
                    setEditingStakeholder(null);
                    setEditFormData(null);
                }}
                title="Edit Stakeholder"
                onSave={handleSave}
                isSaving={isSaving}
                isDirty={!!isDirty}
            >
                {editFormData && (
                    <div className="space-y-4">
                        <FormField label="Name" required>
                            <FormInput
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Organization / Business Unit" required>
                            <FormInput
                                value={editFormData.orgBU}
                                onChange={(e) => setEditFormData({ ...editFormData, orgBU: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Role" required>
                            <FormInput
                                value={editFormData.role}
                                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Email">
                            <FormInput
                                type="email"
                                value={editFormData.email || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Influence Level" required>
                            <FormSelect
                                value={editFormData.influence}
                                onChange={(e) => setEditFormData({ ...editFormData, influence: e.target.value as Stakeholder['influence'] })}
                                options={[
                                    { value: 'High', label: 'High' },
                                    { value: 'Medium', label: 'Medium' },
                                    { value: 'Low', label: 'Low' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Notes">
                            <FormTextArea
                                rows={4}
                                value={editFormData.notes}
                                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                placeholder="Add notes about this stakeholder..."
                            />
                        </FormField>
                    </div>
                )}
            </EditSidePanel>
        </div>
    );
}

function InfluenceBadge({ level }: { level: Stakeholder['influence'] }) {
    const styles: Record<Stakeholder['influence'], string> = {
        'High': 'bg-red-100 text-red-700 border-red-200',
        'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Low': 'bg-green-100 text-green-700 border-green-200',
    };

    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[level]}`}>
            {level}
        </span>
    );
}
