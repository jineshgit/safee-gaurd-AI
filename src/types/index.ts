export interface Scenario {
    id: string;
    name: string;
    userMessage: string;
    policySummary: string;
    requiredActions: string[];
    forbiddenActions: string[];
    riskType: string;
    custom?: boolean;
}

export interface Persona {
    id: number;
    name: string;
    description: string;
    communication_style: string;
    tone?: string;
    emoji?: string;
}

export interface EvaluationResult {
    id: string;
    scenario_id: string;
    scenario_name: string;
    agent_name: string;
    team_org: string;
    timestamp: string;
    raw_response: string;
    intent: string;
    policy: string;
    hallucination: string;
    tone: string;
    escalation: string;
    overall: string;
    reasoning: string;
}
