import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import DatabaseService from '@/lib/database';
import EvaluationPipeline from '@/lib/pipeline/evaluator';
import MetricsService from '@/lib/services/metrics-service';
import fs from 'fs';
import path from 'path';

const db = new DatabaseService();
const pipeline = new EvaluationPipeline(db);

// Load scenarios
let scenarios: any[] = [];
try {
    const scenariosPath = path.join(process.cwd(), 'scenarios.json');
    if (fs.existsSync(scenariosPath)) {
        scenarios = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
    }
} catch (error) {
    console.error('Error loading scenarios:', error);
    scenarios = [];
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { scenario_id, response, agent_name, team_org, persona_id } = await request.json();

        // Validate request
        if (!scenario_id || !response) {
            return NextResponse.json({ error: 'scenario_id and response are required' }, { status: 400 });
        }

        // Find scenario
        const scenario = scenarios.find(s => s.id === scenario_id);
        if (!scenario) {
            return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
        }

        // Get persona if specified
        let persona = null;
        if (persona_id) {
            const personas = await db.getPersonas();
            persona = personas.find((p: any) => p.id === parseInt(persona_id));
            if (!persona) {
                return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
            }
        }

        // Run evaluation through pipeline with enhanced metrics
        const result = await pipeline.evaluate(scenario, response, persona);

        // Calculate enhanced metrics
        let enhancedMetrics: any = {};
        try {
            enhancedMetrics = MetricsService.calculate(response, scenario, result);
        } catch (error: any) {
            console.log('⚠️  Enhanced metrics failed:', error.message);
        }

        // Merge enhanced metrics with existing result
        const wordCount = response.split(/\s+/).length;
        const finalResult = {
            ...result,
            scenario_id: scenario.id,
            scenario_name: scenario.name || scenario.id,
            agent_name: agent_name || 'Unknown Agent',
            team_org: team_org || 'Unknown Team',
            persona_id: persona_id ? parseInt(persona_id) : null,
            raw_response: response,
            user_message: scenario.userMessage || '',
            response_length: wordCount,
            keyword_coverage: enhancedMetrics.keyword_coverage || result.keyword_coverage || 0,
            sentiment_score: enhancedMetrics.sentiment_score || result.sentiment_score || 0,
            readability_score: enhancedMetrics.readability_score || result.readability_score || 0,
            compliance_score: result.compliance_score != null ? result.compliance_score : (result.overall === 'PASS' ? 100 : 0),
            duration_ms: 0,
            user_id: userId, // Add user_id
            ...enhancedMetrics,
        };

        // Save to database (filter out extra metrics not in schema)
        const dbPayload: any = { ...finalResult };
        delete dbPayload.coherence_score;
        delete dbPayload.empathy_score;
        delete dbPayload.clarity_score;
        delete dbPayload.professionalism_score;

        const saved = await db.createEvaluation(dbPayload) || { ...dbPayload, id: 0, timestamp: new Date().toISOString() };

        // Return the fully enriched result
        const enrichedResponse = {
            ...saved,
            coherence_score: enhancedMetrics.coherence_score || 0,
            empathy_score: enhancedMetrics.empathy_score || 0,
            clarity_score: enhancedMetrics.clarity_score || 0,
            professionalism_score: enhancedMetrics.professionalism_score || 0,
            keyword_coverage: enhancedMetrics.keyword_coverage || saved.keyword_coverage || 0,
            sentiment_score: enhancedMetrics.sentiment_score || saved.sentiment_score || 0,
            readability_score: enhancedMetrics.readability_score || saved.readability_score || 0,
        };

        if (Object.keys(enhancedMetrics).length > 0) {
            console.log(`✅ Evaluation completed with ${Object.keys(enhancedMetrics).length} enhanced metrics`);
        }

        return NextResponse.json(enrichedResponse);
    } catch (error: any) {
        console.error('Evaluation error:', error);
        return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 });
    }
}
