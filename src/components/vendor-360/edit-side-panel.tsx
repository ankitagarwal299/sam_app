'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
    isDirty?: boolean;
}

export function EditSidePanel({
    isOpen,
    onClose,
    title,
    children,
    onSave,
    onCancel,
    isSaving = false,
    isDirty = false,
}: EditSidePanelProps) {

    // Handle escape key
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (isDirty) {
                if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                    onClose();
                }
            } else {
                onClose();
            }
        }
    }, [isDirty, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    const handleClose = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                onCancel?.();
                onClose();
            }
        } else {
            onCancel?.();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Side Panel */}
            <div
                className={`fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={isSaving || !isDirty}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </>
    );
}

// Form Field Components
interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    readOnly?: boolean;
    required?: boolean;
}

export function FormField({ label, children, readOnly, required }: FormFieldProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
                {readOnly && <span className="text-gray-400 text-xs ml-2">(Read-only)</span>}
            </label>
            {children}
        </div>
    );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    readOnly?: boolean;
}

export function FormInput({ readOnly, className, ...props }: FormInputProps) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${readOnly
                    ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                } ${className || ''}`}
        />
    );
}

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    readOnly?: boolean;
}

export function FormTextArea({ readOnly, className, ...props }: FormTextAreaProps) {
    return (
        <textarea
            {...props}
            readOnly={readOnly}
            className={`w-full px-3 py-2 border rounded-md text-sm transition-colors resize-none ${readOnly
                    ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                } ${className || ''}`}
        />
    );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}

export function FormSelect({ options, className, ...props }: FormSelectProps) {
    return (
        <select
            {...props}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className || ''}`}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
