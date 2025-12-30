import { NextResponse } from 'next/server';
import { generatePOFinancials } from '@/lib/mock-financial-data';

export async function GET() {
    // In a real app, we'd fetch these from a database
    const poIds = ["PO-001", "PO-002", "PO-003", "PO-004", "PO-005", "PO-2024-001", "PO-2024-002"];

    const financialData = poIds.map(id => generatePOFinancials(id));

    const data = {
        kpis: {
            totalAnnualizedSpend: 12500000,
            forecast: { cy: 12000000, fy: 13000000 },
            commit: { cy: 11500000, fy: 12500000 },
            actuals: { mtd: 1000000, qtd: 3000000, ytd: 9000000 },
            variance: 500000,
        },
        forecastMatrix: financialData.map(f => ({
            poNumber: f.poNumber,
            buckets: {
                "2025-Q1": f.forecast['FY26'].q1,
                "2025-Q2": f.forecast['FY26'].q2,
                "2025-Q3": f.forecast['FY26'].q3,
                "2025-Q4": f.forecast['FY26'].q4,
                "2026-Q1": f.forecast['FY27'].q1,
                "2026-Q2": f.forecast['FY27'].q2,
                "2026-Q3": f.forecast['FY27'].q3,
                "2026-Q4": f.forecast['FY27'].q4,
            }
        })),
        commitMatrix: financialData.map(f => ({
            poNumber: f.poNumber,
            buckets: {
                "2025-Q1": f.commit['FY26'].q1,
                "2025-Q2": f.commit['FY26'].q2,
                "2025-Q3": f.commit['FY26'].q3,
                "2025-Q4": f.commit['FY26'].q4,
                "2026-Q1": f.commit['FY27'].q1,
                "2026-Q2": f.commit['FY27'].q2,
                "2026-Q3": f.commit['FY27'].q3,
                "2026-Q4": f.commit['FY27'].q4,
            }
        })),
        actualsMatrix: financialData.map(f => ({
            poNumber: f.poNumber,
            buckets: {
                "2025-Q1": f.actuals['FY26'].q1,
                "2025-Q2": f.actuals['FY26'].q2,
                "2025-Q3": f.actuals['FY26'].q3,
                "2025-Q4": f.actuals['FY26'].q4,
                "2026-Q1": f.actuals['FY27'].q1,
                "2026-Q2": f.actuals['FY27'].q2,
                "2026-Q3": f.actuals['FY27'].q3,
                "2026-Q4": f.actuals['FY27'].q4,
            }
        })),
        // Keep these for the data tables that expect a flat list
        actuals: [
            { date: "2024-01-15", poNumber: "PO-2024-001", amount: 100000, account: "Software-Licensing" },
            { date: "2024-02-15", poNumber: "PO-2024-001", amount: 100000, account: "Software-Licensing" }
        ],
        renewals: [
            { poNumber: "PO-005", nextRenewalDate: "2025-01-31", expectedQuantity: 500, unitPrice: 400, term: "12 Months", risk: "Low", notes: "Standard renewal" }
        ]
    };

    return NextResponse.json(data);
}
