import { NextResponse } from 'next/server';

export async function GET() {
    const data = Array.from({ length: 50 }).map((_, i) => {
        const quarter = (i % 4) + 1;
        const baseAmount = Math.floor(Math.random() * 50000) + 10000;
        const deptNum = `D-${1000 + (i % 10)}`;

        return {
            id: `GL-REC-${2025001 + i}`,
            deptLevel2: 'Technology & Digital',
            deptLevel3: i % 2 === 0 ? 'Software Engineering' : 'Infrastructure & Ops',
            deptLevel4: i % 3 === 0 ? 'Cloud Services' : 'Enterprise Applications',
            deptLevel5: `Team ${['Alpha', 'Beta', 'Gamma'][i % 3]}`,
            deptNumber: deptNum,
            fiscalYear: i % 2 === 0 ? '2024' : '2025',
            fiscalQuarter: `Q${quarter}`,
            fiscalMonth: `M${(i % 12) + 1}`,
            actualAmount: baseAmount,
            linkedTransactions: [
                {
                    id: `TX-${i}-1`,
                    date: '2024-09-15',
                    description: 'Cloud Compute Instance Usage',
                    amount: baseAmount * 0.6,
                    glCode: '5001-COMPUTE',
                    postedBy: 'SYSTEM_AUTO',
                    deptCode: deptNum,
                    fiscalQuarter: `Q${quarter}`,
                    fiscalPeriod: `P${(i % 12) + 1}`,
                    transactionType: 'Accrual',
                    poNumber: `PO-${3000 + i}`
                },
                {
                    id: `TX-${i}-2`,
                    date: '2024-09-20',
                    description: 'Storage Allocations',
                    amount: baseAmount * 0.4,
                    glCode: '5002-STORAGE',
                    postedBy: 'SYSTEM_AUTO',
                    deptCode: deptNum,
                    fiscalQuarter: `Q${quarter}`,
                    fiscalPeriod: `P${(i % 12) + 1}`,
                    transactionType: 'Journal Entry',
                    poNumber: `PO-${3000 + i}`
                }
            ],
            assetDepreciations: [
                {
                    id: `AST-${i}-1`,
                    assetId: `A-${5000 + i}`,
                    assetName: 'Server Rack X1',
                    depreciationAmount: 1200,
                    period: `P${(i % 12) + 1}`,
                    accumulatedDepreciation: 1200 * ((i % 12) + 1),
                    netBookValue: 50000 - (1200 * ((i % 12) + 1))
                }
            ],
            yearlyPoFinancials: [
                {
                    poNumber: `PO-${3000 + i}`,
                    vendor: 'AMAZON WEB SERVICES',
                    project: 'Cloud Migration',
                    department: deptNum,
                    totalAmount: 1200000,
                    quarters: {
                        Q1: { actual: 25000, commit: 30000, forecast: 30000 },
                        Q2: { actual: 28000, commit: 30000, forecast: 32000 },
                        Q3: { actual: 0, commit: 35000, forecast: 35000 },
                        Q4: { actual: 0, commit: 40000, forecast: 40000 }
                    }
                },
                {
                    poNumber: `PO-${4000 + i}`,
                    vendor: 'ORACLE CORPORATION',
                    project: 'ERP Upgrade',
                    department: deptNum,
                    totalAmount: 500000,
                    quarters: {
                        Q1: { actual: 12000, commit: 12000, forecast: 12000 },
                        Q2: { actual: 15000, commit: 15000, forecast: 15000 },
                        Q3: { actual: 0, commit: 18000, forecast: 18000 },
                        Q4: { actual: 0, commit: 18000, forecast: 18000 }
                    }
                }
            ]
        };
    });

    return NextResponse.json(data);
}
