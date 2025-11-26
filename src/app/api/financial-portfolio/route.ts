import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        kpis: {
            totalAnnualizedSpend: 12500000,
            forecast: { cy: 12000000, fy: 13000000 },
            commit: { cy: 11500000, fy: 12500000 },
            actuals: { mtd: 1000000, qtd: 3000000, ytd: 9000000 },
            variance: 500000,
        },
        pos: [
            {
                poNumber: "PO-2024-001",
                vendor: "Microsoft",
                application: "Azure",
                term: "36 Months",
                startDate: "2024-01-01",
                endDate: "2026-12-31",
                amount: 3600000,
                ownership: "John Doe",
                status: "Active",
            },
            {
                poNumber: "PO-2024-002",
                vendor: "Salesforce",
                application: "Sales Cloud",
                term: "12 Months",
                startDate: "2024-04-01",
                endDate: "2025-03-31",
                amount: 1200000,
                ownership: "Jane Smith",
                status: "Active",
            },
            {
                poNumber: "PO-2024-003",
                vendor: "Adobe",
                application: "Creative Cloud",
                term: "24 Months",
                startDate: "2023-06-01",
                endDate: "2025-05-31",
                amount: 500000,
                ownership: "John Doe",
                status: "Review",
            },
            {
                poNumber: "PO-2024-004",
                vendor: "Slack",
                application: "Enterprise Grid",
                term: "12 Months",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                amount: 800000,
                ownership: "Mike Johnson",
                status: "Active",
            },
            {
                poNumber: "PO-2024-005",
                vendor: "Zoom",
                application: "Zoom Meetings",
                term: "12 Months",
                startDate: "2024-02-01",
                endDate: "2025-01-31",
                amount: 200000,
                ownership: "Jane Smith",
                status: "Pending Renewal",
            }
        ],
        forecastMatrix: [
            { poNumber: "PO-2024-001", buckets: { "2024-Q1": 300000, "2024-Q2": 300000, "2024-Q3": 300000, "2024-Q4": 300000 } },
            { poNumber: "PO-2024-002", buckets: { "2024-Q1": 0, "2024-Q2": 300000, "2024-Q3": 300000, "2024-Q4": 300000 } }
        ],
        actuals: [
            { date: "2024-01-15", poNumber: "PO-2024-001", amount: 100000, account: "Software-Licensing" },
            { date: "2024-02-15", poNumber: "PO-2024-001", amount: 100000, account: "Software-Licensing" }
        ],
        renewals: [
            { poNumber: "PO-2024-005", nextRenewalDate: "2025-01-31", expectedQuantity: 500, unitPrice: 400, term: "12 Months", risk: "Low", notes: "Standard renewal" }
        ]
    };

    return NextResponse.json(data);
}
