import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ poId: string }> }) {
    const { poId } = await context.params;

    // Mock 72-month forecast data
    const generateForecastData = () => {
        const data = [];
        const startDate = new Date('2025-08-01');
        const monthlyAmount = 3420; // ~$123k / 36 months

        for (let i = 0; i < 72; i++) {
            const currentDate = new Date(startDate);
            currentDate.setMonth(startDate.getMonth() + i);

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            // Calculate Fiscal Year (Starts in August)
            const fiscalYearNum = month >= 8 ? year + 1 : year;
            const fiscalYear = `FY${fiscalYearNum.toString().slice(2)}`;

            // Calculate Fiscal Quarter (Aug-Oct=Q1, Nov-Jan=Q2, Feb-Apr=Q3, May-Jul=Q4)
            // Offset month by -8 (Aug becomes 0)
            const fiscalMonthIndex = (month + 12 - 8) % 12;
            const quarter = Math.floor(fiscalMonthIndex / 3) + 1;

            data.push({
                id: `${poId}-${year}-${month.toString().padStart(2, '0')}`,
                poId,
                year,
                month,
                quarter,
                fiscalYear,
                period: `${year}-${month.toString().padStart(2, '0')}`,
                periodLabel: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
                forecastAmount: monthlyAmount,
                actualAmount: i < 6 ? monthlyAmount + (Math.random() * 500 - 250) : null, // Only past 6 months have actuals
                commitAmount: monthlyAmount,
                variance: i < 6 ? Math.random() * 10 - 5 : 0, // ±5%
                status: i < 6 ? 'locked' : 'draft',
                basis: i < 36 ? 'committed' : 'auto',
                lastModified: new Date().toISOString(),
                modifiedBy: 'steve'
            });
        }

        return data;
    };

    const forecastData = {
        poNumber: poId,
        vendor: 'TECHNOLOGY LLC',
        totalAmount: 123123,
        startDate: '2025-08-01',
        endDate: '2028-07-31',
        termMonths: 36,
        currency: 'USD',
        monthlyForecasts: generateForecastData()
    };

    return NextResponse.json(forecastData);
}

export async function PUT(request: Request, context: { params: Promise<{ poId: string }> }) {
    const { poId } = await context.params;
    const body = await request.json();

    // Mock update - in real app, this would update the database
    console.log('Updating forecast for PO:', poId, body);

    return NextResponse.json({
        success: true,
        message: 'Forecast updated successfully',
        updatedRecords: body.updates?.length || 0
    });
}
