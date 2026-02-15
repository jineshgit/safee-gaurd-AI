import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '@/lib/database';

const db = new DatabaseService();

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        const filters = {
            scenario_id: searchParams.get('scenario_id') || undefined,
            persona_id: searchParams.get('persona_id') ? parseInt(searchParams.get('persona_id')!) : null,
            overall: searchParams.get('overall') || undefined,
            start_date: searchParams.get('start_date') || undefined,
            end_date: searchParams.get('end_date') || undefined,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
        };

        const evaluations = await db.getEvaluations(filters, userId as any);
        return NextResponse.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
    }
}
