import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET() {
    try {
        // Attempt to connect and fetch a simple count to verify connection + schema
        // We use 'head: true' to just get the count without fetching data
        const { count, error } = await supabase
            .from('personas')
            .select('*', { count: 'exact', head: true });

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: 'Connection failed or schema missing',
                details: error.message,
                hint: error.code === '42P01' ? 'Table "personas" not found. Did you run the schema SQL?' : 'Check your Supabase credentials.'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'ok',
            message: 'Connected to Supabase successfully',
            table_check: 'personas table exists',
            row_count: count
        });

    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Unexpected error testing connection',
            details: e.message
        }, { status: 500 });
    }
}
