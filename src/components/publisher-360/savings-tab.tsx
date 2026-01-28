'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Saving, formatCurrency } from '@/lib/publisher-360-data';

interface SavingsTabProps {
    savings: Saving[];
}

export function SavingsTab({ savings }: SavingsTabProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-800">
                    Savings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">PO Number</th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Saving Type</th>
                                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Saving Amount</th>
                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Saving Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!savings || savings.length === 0) ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                        No savings records found.
                                    </td>
                                </tr>
                            ) : (
                                savings.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2.5 px-3 font-medium text-gray-900">{row.poNumber}</td>
                                        <td className="py-2.5 px-3 text-gray-700 capitalize">
                                            {row.savingType}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-medium text-green-700">
                                            {formatCurrency(row.savingAmount)}
                                        </td>
                                        <td className="py-2.5 px-3 text-gray-700">
                                            {row.savingPeriod}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {savings && savings.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-50 font-semibold">
                                    <td className="py-2.5 px-3" colSpan={2}>Total Savings</td>
                                    <td className="py-2.5 px-3 text-right text-green-700">
                                        {formatCurrency(savings.reduce((sum, s) => sum + s.savingAmount, 0))}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
