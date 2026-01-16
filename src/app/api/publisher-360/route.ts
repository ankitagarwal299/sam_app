import { NextResponse } from 'next/server';
import { publishers, getPublisher360Data } from '@/lib/publisher-360-data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const publisherId = searchParams.get('publisherId');

    // If no publisherId, return list of publishers
    if (!publisherId) {
        return NextResponse.json({ publishers });
    }

    // Get specific publisher data
    const data = getPublisher360Data(publisherId);

    if (!data) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }

    // Simulate network delay for realistic loading states
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(data);
}

// Mock POST endpoint for saving data
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        // In a real app, this would save to a database
        // For now, we just simulate success
        await new Promise(resolve => setTimeout(resolve, 200));

        return NextResponse.json({
            success: true,
            message: `${type} saved successfully`,
            data
        });
    } catch {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
