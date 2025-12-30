import { NextResponse } from 'next/server';
import { generatePOFinancials } from '@/lib/mock-financial-data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ poId: string }> }
) {
    const { poId } = await params;
    if (!poId) {
        return NextResponse.json({ error: 'PO ID is required' }, { status: 400 });
    }

    const financials = generatePOFinancials(poId);

    return NextResponse.json(financials);
}
