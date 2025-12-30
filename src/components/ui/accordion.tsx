'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AccordionProps {
    children: React.ReactNode;
    className?: string;
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const Accordion = ({ children, className }: AccordionProps) => {
    return (
        <div className={cn("space-y-4", className)}>
            {children}
        </div>
    );
};

export const AccordionItem = ({ title, children, defaultOpen = false, className }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <div className={cn("border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none"
            >
                <span className="text-lg font-bold text-gray-900">{title}</span>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 text-gray-500 transition-transform duration-200",
                        isOpen && "transform rotate-180"
                    )}
                />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
};
