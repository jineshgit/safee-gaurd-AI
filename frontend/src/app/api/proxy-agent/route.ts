import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { endpoint, method, headers, body } = await request.json();

        if (!endpoint) {
            return NextResponse.json({ error: 'endpoint is required' }, { status: 400 });
        }

        const fetchOptions: RequestInit = {
            method: method || 'POST',
            headers: headers || { 'Content-Type': 'application/json' },
        };

        if (body && (method || 'POST') === 'POST') {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const agentRes = await fetch(endpoint, fetchOptions);
        const contentType = agentRes.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
            data = await agentRes.json();
        } else {
            data = { text: await agentRes.text() };
        }

        return NextResponse.json({ status: agentRes.status, data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Proxy error:', message);
        return NextResponse.json({ error: 'Failed to reach agent API', details: message }, { status: 502 });
    }
}
