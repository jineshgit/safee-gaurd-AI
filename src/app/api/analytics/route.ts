import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '@/lib/database';

const db = new DatabaseService();

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const analytics = await db.getAnalytics(userId as any);
        return NextResponse.json(analytics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
