'use client';

import { useState } from 'react';
import { Mail, Phone, MessageSquare, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublisherContact, InternalContact } from '@/lib/publisher-360-data';
import { EditSidePanel, FormField, FormInput, FormSelect } from './edit-side-panel';
import { toast } from 'sonner';

interface PeopleTabProps {
    publisherContacts: PublisherContact[];
    internalContacts: InternalContact[];
    onPublisherContactUpdate: (contact: PublisherContact) => void;
    onInternalContactUpdate: (contact: InternalContact) => void;
}

export function PeopleTab({
    publisherContacts,
    internalContacts,
    onPublisherContactUpdate,
    onInternalContactUpdate,
}: PeopleTabProps) {
    const [editingPublisherContact, setEditingPublisherContact] = useState<PublisherContact | null>(null);
    const [editFormData, setEditFormData] = useState<PublisherContact | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Group internal contacts by team
    const itContacts = internalContacts.filter(c => c.team === 'IT');
    const gpsContacts = internalContacts.filter(c => c.team === 'GPS');
    const financialContacts = internalContacts.filter(c => c.team === 'Financial Analysts');

    const handleEditPublisherContact = (contact: PublisherContact) => {
        setEditingPublisherContact(contact);
        setEditFormData({ ...contact });
    };

    const handleSave = async () => {
        if (!editFormData) return;

        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            onPublisherContactUpdate(editFormData);
            toast.success('Contact updated successfully');
            setEditingPublisherContact(null);
            setEditFormData(null);
        } catch {
            toast.error('Failed to save contact');
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = editingPublisherContact && editFormData &&
        JSON.stringify(editingPublisherContact) !== JSON.stringify(editFormData);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Publisher Contacts */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-gray-800">
                            Publisher Contacts
                        </CardTitle>
                        <Button variant="outline" size="sm" className="h-8">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Contact
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-gray-100">
                            {publisherContacts.map((contact) => (
                                <div key={contact.id} className="py-3 first:pt-0 last:pb-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{contact.name}</div>
                                            <div className="text-sm text-gray-500">{contact.role}</div>
                                            <div className="text-sm text-blue-600 mt-0.5">{contact.email}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                title="Send Email"
                                                onClick={() => window.location.href = `mailto:${contact.email}`}
                                            >
                                                <Mail className="h-4 w-4 text-gray-500" />
                                            </button>
                                            {contact.phone && (
                                                <button
                                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                    title="Call"
                                                >
                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                </button>
                                            )}
                                            <button
                                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                title="Log Interaction"
                                            >
                                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => handleEditPublisherContact(contact)}
                                                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {publisherContacts.length === 0 && (
                                <div className="py-8 text-center text-gray-500">
                                    <p className="mb-2">No publisher contacts yet</p>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add First Contact
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Internal Contacts */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-800">
                            Internal Contacts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* IT Contacts */}
                        <ContactSection title="IT Contacts / POCs" contacts={itContacts} />

                        {/* GPS Team */}
                        <ContactSection title="GPS Team" contacts={gpsContacts} />

                        {/* Financial Analysts */}
                        <ContactSection title="Financial Analysts" contacts={financialContacts} />
                    </CardContent>
                </Card>
            </div>

            {/* Edit Publisher Contact Side Panel */}
            <EditSidePanel
                isOpen={!!editingPublisherContact}
                onClose={() => {
                    setEditingPublisherContact(null);
                    setEditFormData(null);
                }}
                title="Edit Publisher Contact"
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
                        <FormField label="Role" required>
                            <FormInput
                                value={editFormData.role}
                                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Email" required>
                            <FormInput
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            />
                        </FormField>
                        <FormField label="Phone">
                            <FormInput
                                type="tel"
                                value={editFormData.phone || ''}
                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                placeholder="+1-555-0100"
                            />
                        </FormField>
                    </div>
                )}
            </EditSidePanel>
        </div>
    );
}

function ContactSection({ title, contacts }: { title: string; contacts: InternalContact[] }) {
    if (contacts.length === 0) return null;

    return (
        <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h4>
            <div className="space-y-2">
                {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-50 -mx-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 text-sm">{contact.name}</span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-500 text-sm truncate">{contact.role}</span>
                            </div>
                            <div className="text-xs text-blue-600">{contact.email}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Send Email"
                            >
                                <Mail className="h-3.5 w-3.5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
