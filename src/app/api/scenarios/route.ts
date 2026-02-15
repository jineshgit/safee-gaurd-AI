import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '@/lib/database';

const db = new DatabaseService();

export async function GET() {
    try {
        const { userId } = await auth();
        // Return built-in (no userId) + user's custom scenarios
        const scenarios = await db.getScenarios(userId);
        return NextResponse.json(scenarios);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.title || !body.user_message) {
            return NextResponse.json({ error: 'Title and User Message are required' }, { status: 400 });
        }

        const newScenario = {
            id: 'CUSTOM-' + Date.now(),
            user_id: userId,
            name: body.title,
            user_message: body.user_message,
            policy_summary: body.description || '',
            required_actions: (body.required_keywords || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
            forbidden_actions: (body.forbidden_keywords || '').split(',').map((s: string) => s.trim()).filter((s: string) => s),
            risk_type: 'custom'
        };

        const created = await db.createScenario(newScenario);
        return NextResponse.json(created);
    } catch (error) {
        console.error('Error creating scenario:', error);
        return NextResponse.json({ error: 'Failed to create scenario' }, { status: 500 });
    }
}
