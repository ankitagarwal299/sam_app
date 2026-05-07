'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice, formatCurrency, formatDate } from '@/lib/vendor-360-data';

interface InvoicesTabProps {
    invoices: Invoice[];
}

export function InvoicesTab({ invoices }: InvoicesTabProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800">
                    Invoices
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">PO Number</th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice Date</th>
                                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice Amount</th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoice Period</th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">BU</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!invoices || invoices.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No invoice records found.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 px-3 font-medium text-gray-900">{row.poNumber}</td>
                                        <td className="py-2.5 px-3 text-gray-700">
                                            {formatDate(row.invoiceDate)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                                            {formatCurrency(row.invoiceAmount)}
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-700">
                                            {row.invoicePeriod}
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-700">
                                            {row.bu}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {invoices && invoices.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-50 font-semibold">
                                    <td className="py-2.5 px-3" colSpan={2}>Total Invoiced</td>
                                    <td className="py-2.5 px-3 text-right text-gray-900">
                                        {formatCurrency(invoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0))}
                                    </td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
