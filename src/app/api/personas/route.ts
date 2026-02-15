import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '@/lib/database';

const db = new DatabaseService();

export async function GET() {
    try {
        const { userId } = await auth();
        const personas = await db.getPersonas(userId);

        // Enrich with emoji and description if missing
        const enriched = personas.map((p: any) => {
            let emoji = p.emoji;
            if (!emoji) {
                const lowerTone = (p.tone || '').toLowerCase();
                const lowerStyle = (p.communication_style || '').toLowerCase();

                if (lowerTone.includes('angry') || lowerTone.includes('frustrat')) emoji = '😤';
                else if (lowerTone.includes('uncertain') || lowerTone.includes('confus')) emoji = '🤔';
                else if (lowerTone.includes('friendly') || lowerTone.includes('polite') || lowerTone.includes('happy')) emoji = '😊';
                else if (lowerStyle.includes('formal') || lowerStyle.includes('direct')) emoji = '💼';
                else emoji = '👤';
            }

            let desc = p.description;
            if (!desc) {
                desc = `${p.communication_style} style, ${p.tone} tone`;
            }

            return { ...p, emoji, description: desc };
        });

        return NextResponse.json(enriched);
    } catch (error) {
        console.error('Error fetching personas:', error);
        return NextResponse.json({ error: 'Failed to fetch personas' }, { status: 500 });
    }
}
