import { NextResponse } from 'next/server';
import { generatePOFinancials } from '@/lib/mock-financial-data';

export async function GET(request: Request, context: { params: Promise<{ poId: string }> }) {
    const { poId } = await context.params;

    const financials = generatePOFinancials(poId);

    const forecastData = {
        poNumber: poId,
        vendor: 'TECHNOLOGY LLC',
        totalAmount: 123123,
        startDate: '2025-08-01',
        endDate: '2028-07-31',
        termMonths: 36,
        currency: 'USD',
        monthlyForecasts: financials.monthlyData
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
