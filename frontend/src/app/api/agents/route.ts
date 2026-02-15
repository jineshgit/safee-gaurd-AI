import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '../../../lib/database';

const db = new DatabaseService();

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const agents = await db.getAgents(userId);
        return NextResponse.json(agents);
    } catch (error) {
        console.error("Error fetching agents:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.endpoint) {
            return NextResponse.json({ error: "Name and Endpoint are required" }, { status: 400 });
        }

        const newAgent = await db.createAgent({
            ...body,
            user_id: userId,
            status: 'active',
            last_tested: null
        });

        return NextResponse.json(newAgent);
    } catch (error) {
        console.error("Error creating agent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
