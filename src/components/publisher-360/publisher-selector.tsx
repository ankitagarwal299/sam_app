'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Publisher } from '@/lib/publisher-360-data';

interface PublisherSelectorProps {
    publishers: Publisher[];
    selectedPublisher: Publisher | null;
    onSelect: (publisher: Publisher) => void;
}

export function PublisherSelector({ publishers, selectedPublisher, onSelect }: PublisherSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPublishers = useMemo(() => {
        if (!searchQuery) return publishers;
        return publishers.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [publishers, searchQuery]);

    return (
        <div className="relative">
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="w-[220px] justify-between bg-white hover:bg-gray-50 border-gray-200"
            >
                <span className="truncate">
                    {selectedPublisher ? selectedPublisher.name : 'Select Publisher...'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-[260px] z-50 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search publishers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-9 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Publisher List */}
                        <div className="max-h-[240px] overflow-y-auto py-1">
                            {filteredPublishers.length === 0 ? (
                                <div className="px-3 py-6 text-center text-sm text-gray-500">
                                    No publishers found
                                </div>
                            ) : (
                                filteredPublishers.map((publisher) => (
                                    <button
                                        key={publisher.id}
                                        onClick={() => {
                                            onSelect(publisher);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${selectedPublisher?.id === publisher.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                    >
                                        <Check
                                            className={`h-4 w-4 ${selectedPublisher?.id === publisher.id ? 'opacity-100' : 'opacity-0'
                                                }`}
                                        />
                                        <span className="font-medium">{publisher.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
