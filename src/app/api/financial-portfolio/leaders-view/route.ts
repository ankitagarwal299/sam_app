import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Data for Leaders View

    // Helper to generate tier breakdown
    const getTiers = (total: number) => ({
        mega: Math.round(total * 0.4),
        platinum: Math.round(total * 0.3),
        gold: Math.round(total * 0.15),
        silver: Math.round(total * 0.1),
        bronze: Math.round(total * 0.04),
        tail: Math.round(total * 0.01),
    });

    const level4Spend = [
        { name: 'Engineering', total: 152000000 },
        { name: 'Marketing', total: 82000000 },
        { name: 'Sales Ops', total: 65000000 },
        { name: 'IT Infrastructure', total: 59000000 },
        { name: 'Product Design', total: 42000000 },
        { name: 'Data Science', total: 38000000 },
        { name: 'Customer Support', total: 31000000 },
        { name: 'HR Technology', total: 24000000 },
        { name: 'Legal', total: 18000000 },
        { name: 'Finance', total: 12000000 },
    ].map(item => ({ ...item, tiers: getTiers(item.total) }));

    const level5Spend = [
        { name: 'Cloud Services', amount: 45000000 },
        { name: 'Digital Ad Tech', amount: 32000000 },
        { name: 'CRM Systems', amount: 28000000 },
        { name: 'DevOps Tools', amount: 21000000 },
        { name: 'Security Ops', amount: 19000000 },
        { name: 'User Research', amount: 15000000 },
        { name: 'Content Mgmt', amount: 12000000 },
        { name: 'Analytics Platform', amount: 11000000 },
        { name: 'Collab Tools', amount: 9500000 },
        { name: 'Learning Mgmt', amount: 8000000 },
    ];

    const fundingSource = {
        central: {
            total: 238000000,
            tiers: getTiers(238000000),
            count: 238
        },
        functional: {
            total: 127000000,
            tiers: getTiers(127000000),
            count: 127
        }
    };

    const metrics = {
        total: 365000000,
        tcv: 450000000,
        acv: 365000000
    };

    return NextResponse.json({
        level4Spend,
        level5Spend,
        fundingSource,
        metrics
    });
}
