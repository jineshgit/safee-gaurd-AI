import { supabase } from './supabase-client';

class DatabaseService {
    constructor() {
        console.log('[DatabaseService] Initialized with Supabase');
    }

    // No-op for compatibility
    async initialize() {
        return Promise.resolve();
    }

    get initPromise() {
        return Promise.resolve();
    }

    async createEvaluation(data: any) {
        try {
            // Ensure JSON fields are stringified if Supabase expects JSONB but we pass objects? 
            // supabase-js handles objects for JSONB columns automatically.
            const { data: result, error } = await supabase
                .from('evaluations')
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            console.error('createEvaluation error:', error);
            return null;
        }
    }

    async getEvaluation(id: number | string) {
        try {
            const { data, error } = await supabase
                .from('evaluations')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('getEvaluation error:', error);
            return null;
        }
    }

    async getEvaluations(filters: any = {}, userId: string | null = null) {
        try {
            let query = supabase
                .from('evaluations')
                .select('*')
                .order('timestamp', { ascending: false });

            if (userId) {
                query = query.eq('user_id', userId);
            }

            if (filters.scenario_id) {
                query = query.eq('scenario_id', filters.scenario_id);
            }
            if (filters.persona_id) {
                query = query.eq('persona_id', filters.persona_id);
            }
            if (filters.overall) {
                query = query.eq('overall', filters.overall);
            }
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('getEvaluations error:', error);
            return [];
        }
    }

    async deleteEvaluation(id: number | string, userId: string | null = null) {
        try {
            let query = supabase.from('evaluations').delete().eq('id', id);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { error } = await query;
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('deleteEvaluation error:', error);
            return { success: false };
        }
    }

    async getPersonas(userId: string | null = null) {
        try {
            // Get system personas (user_id is null) OR user's personas
            let query = supabase.from('personas').select('*');

            if (userId) {
                query = query.or(`user_id.is.null,user_id.eq.${userId}`);
            } else {
                query = query.is('user_id', null);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('getPersonas error:', error);
            return [];
        }
    }

    // --- Agents ---

    async createAgent(data: any) {
        try {
            const { data: result, error } = await supabase
                .from('agents')
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            console.error("createAgent error:", error);
            throw error;
        }
    }

    async getAgents(userId: string | null = null) {
        try {
            let query = supabase
                .from('agents')
                .select('*')
                .order('created_at', { ascending: false });

            if (userId) {
                query = query.or(`user_id.eq.${userId},user_id.is.null`);
            } else {
                query = query.is('user_id', null);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("getAgents error:", error);
            return [];
        }
    }

    async updateAgentLastTested(agentId: number) {
        try {
            await supabase
                .from('agents')
                .update({ last_tested: new Date().toISOString() })
                .eq('id', agentId);
        } catch (error) {
            console.error("updateAgentLastTested error:", error);
        }
    }

    // --- Scenarios ---

    async createScenario(data: any) {
        try {
            const { data: result, error } = await supabase
                .from('scenarios')
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            console.error("createScenario error:", error);
            throw error;
        }
    }

    async getScenarios(userId: string | null = null) {
        try {
            let query = supabase
                .from('scenarios')
                .select('*')
                .order('created_at', { ascending: false });

            if (userId) {
                query = query.or(`user_id.eq.${userId},user_id.is.null`);
            } else {
                query = query.is('user_id', null);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("getScenarios error:", error);
            return [];
        }
    }

    // Analytics is complex in Supabase without raw SQL or multiple queries.
    // implementing a simplified version that fetches data and aggregates in JS for now to match API usage.
    // For scale, this should be an RPC function in Postgres.
    async getAnalytics(userId: string | null = null) {
        try {
            let query = supabase
                .from('evaluations')
                .select('overall, compliance_score, scenario_name');

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data: evaluations, error } = await query;
            if (error) throw error;

            if (!evaluations) return { total: 0, passed: 0, failed: 0, passRate: 0, averageScore: 0, passFail: {}, byScenario: [], trends: [] };

            const total = evaluations.length;
            const passed = evaluations.filter((e: any) => e.overall === 'PASS').length;
            const failed = evaluations.filter((e: any) => e.overall === 'FAIL').length;

            // Calculate Average Score
            const scores = evaluations.map((e: any) => e.compliance_score || 0);
            const averageScore = scores.length > 0
                ? Math.round((scores.reduce((a: any, b: any) => a + b, 0) / scores.length) * 10) / 10
                : 0;

            // Pass/Fail breakdown
            const passFail = {
                PASS: { count: passed, percentage: total > 0 ? (passed / total * 100).toFixed(2) : 0 },
                FAIL: { count: failed, percentage: total > 0 ? (failed / total * 100).toFixed(2) : 0 }
            };

            // By Scenario
            const scenarioMap: any = {};
            evaluations.forEach((e: any) => {
                const name = e.scenario_name || 'Unknown';
                if (!scenarioMap[name]) {
                    scenarioMap[name] = { total: 0, passed: 0, failed: 0 };
                }
                scenarioMap[name].total++;
                if (e.overall === 'PASS') scenarioMap[name].passed++;
                else scenarioMap[name].failed++;
            });

            const byScenario = Object.keys(scenarioMap).map(name => ({
                scenario_name: name,
                total: scenarioMap[name].total,
                passed: scenarioMap[name].passed,
                failed: scenarioMap[name].failed,
                pass_rate: scenarioMap[name].total > 0 ? (scenarioMap[name].passed / scenarioMap[name].total * 100).toFixed(2) : 0
            }));

            return {
                total,
                passed,
                failed,
                passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
                averageScore,
                passFail,
                byScenario,
                trends: []
            };

        } catch (error) {
            console.error('getAnalytics error:', error);
            // Return empty structure on error
            return {
                total: 0,
                passed: 0,
                failed: 0,
                passRate: 0,
                averageScore: 0,
                passFail: { PASS: { count: 0, percentage: 0 }, FAIL: { count: 0, percentage: 0 } },
                byScenario: [],
                trends: []
            };
        }
    }
}

export default DatabaseService;
