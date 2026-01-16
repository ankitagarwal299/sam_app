'use client';

import { useState } from 'react';
import { Eye, Pencil, Plus, Cloud, Server, HardDrive, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/lib/publisher-360-data';
import { EditSidePanel, FormField, FormInput, FormTextArea, FormSelect } from './edit-side-panel';
import { toast } from 'sonner';

interface ProductsTabProps {
    products: Product[];
    onProductUpdate: (product: Product) => void;
}

export function ProductsTab({ products, onProductUpdate }: ProductsTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editFormData, setEditFormData] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSLO, setExpandedSLO] = useState<string | null>(null);

    const filteredProducts = products.filter(p =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.infrastructure.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setEditFormData({ ...product });
    };

    const handleSave = async () => {
        if (!editFormData) return;

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            onProductUpdate(editFormData);
            toast.success('Product updated successfully');
            setEditingProduct(null);
            setEditFormData(null);
        } catch {
            toast.error('Failed to save product');
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = editingProduct && editFormData &&
        JSON.stringify(editingProduct) !== JSON.stringify(editFormData);

    return (
        <div className="space-y-4">
            {/* Search & Actions Bar */}
            <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Product Name</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Infrastructure</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide max-w-[250px]">Service Level Objectives</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Data Classification</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-gray-900">{product.productName}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <InfrastructureIcon type={product.infrastructure} />
                                            <span className="text-gray-700">{product.infrastructure}</span>
                                        </div>
                                        {product.infrastructureDetails && (
                                            <span className="text-xs text-gray-500 block mt-0.5">{product.infrastructureDetails}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 max-w-[250px]">
                                        <div
                                            className={`text-gray-600 ${expandedSLO === product.id ? '' : 'truncate'} cursor-pointer`}
                                            onClick={() => setExpandedSLO(expandedSLO === product.id ? null : product.id)}
                                            title="Click to expand"
                                        >
                                            {product.serviceLevelObjectives}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <DataClassificationBadge classification={product.dataClassification} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <ProductStatusBadge status={product.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <span className="text-sm text-gray-600">
                        Showing 1-{filteredProducts.length} of {filteredProducts.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>

            {/* Edit Side Panel */}
            <EditSidePanel
                isOpen={!!editingProduct}
                onClose={() => {
                    setEditingProduct(null);
                    setEditFormData(null);
                }}
                title="Edit Product"
                onSave={handleSave}
                isSaving={isSaving}
                isDirty={!!isDirty}
            >
                {editFormData && (
                    <div className="space-y-4">
                        <FormField label="Product Name" required>
                            <FormInput
                                value={editFormData.productName}
                                onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Infrastructure" required>
                            <FormSelect
                                value={editFormData.infrastructure}
                                onChange={(e) => setEditFormData({ ...editFormData, infrastructure: e.target.value })}
                                options={[
                                    { value: 'On-Premise', label: 'On-Premise' },
                                    { value: 'Cloud', label: 'Cloud' },
                                    { value: 'Hybrid', label: 'Hybrid' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Infrastructure Details">
                            <FormInput
                                value={editFormData.infrastructureDetails || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, infrastructureDetails: e.target.value })}
                                placeholder="e.g., AWS, Azure, On-Premise Data Center"
                            />
                        </FormField>
                        <FormField label="Service Level Objectives" required>
                            <FormTextArea
                                rows={4}
                                value={editFormData.serviceLevelObjectives}
                                onChange={(e) => setEditFormData({ ...editFormData, serviceLevelObjectives: e.target.value })}
                                placeholder="e.g., 99.9% uptime, 4hr RTO, 1hr RPO..."
                            />
                        </FormField>
                        <FormField label="Data Classification" required>
                            <FormSelect
                                value={editFormData.dataClassification}
                                onChange={(e) => setEditFormData({ ...editFormData, dataClassification: e.target.value as Product['dataClassification'] })}
                                options={[
                                    { value: 'Highly Confidential', label: 'Highly Confidential' },
                                    { value: 'Confidential', label: 'Confidential' },
                                    { value: 'Internal Use', label: 'Internal Use' },
                                    { value: 'Public', label: 'Public' },
                                ]}
                            />
                        </FormField>
                        <FormField label="Status">
                            <FormSelect
                                value={editFormData.status}
                                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Product['status'] })}
                                options={[
                                    { value: 'Active', label: 'Active' },
                                    { value: 'Pending Review', label: 'Pending Review' },
                                    { value: 'Deprecated', label: 'Deprecated' },
                                ]}
                            />
                        </FormField>
                    </div>
                )}
            </EditSidePanel>
        </div>
    );
}

function InfrastructureIcon({ type }: { type: string }) {
    if (type === 'Cloud') return <Cloud className="h-4 w-4 text-blue-500" />;
    if (type === 'On-Premise') return <Server className="h-4 w-4 text-gray-500" />;
    return <HardDrive className="h-4 w-4 text-purple-500" />;
}

function DataClassificationBadge({ classification }: { classification: Product['dataClassification'] }) {
    const styles: Record<Product['dataClassification'], string> = {
        'Highly Confidential': 'bg-red-100 text-red-700 border-red-200',
        'Confidential': 'bg-orange-100 text-orange-700 border-orange-200',
        'Internal Use': 'bg-blue-100 text-blue-700 border-blue-200',
        'Public': 'bg-green-100 text-green-700 border-green-200',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${styles[classification]}`}>
            {classification}
        </span>
    );
}

function ProductStatusBadge({ status }: { status: Product['status'] }) {
    const styles: Record<Product['status'], string> = {
        'Active': 'bg-green-100 text-green-700 border-green-200',
        'Pending Review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Deprecated': 'bg-gray-100 text-gray-600 border-gray-200',
    };

    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${styles[status]}`}>
            {status}
        </span>
    );
}
