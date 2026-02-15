const DatabaseService = require('../database');

class EvaluationPipeline {
    constructor(db) {
        this.db = db;
    }

    // ========== QUALITY GATE: Detect nonsense/gibberish ==========
    static isGibberish(text) {
        const cleaned = text.trim();
        if (cleaned.length < 10) return true;

        const words = cleaned.split(/\s+/);
        if (words.length < 3) return true;

        // Check dictionary-word ratio: real English has common words
        const commonWords = new Set([
            'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'i', 'you',
            'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
            'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these',
            'those', 'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
            'not', 'no', 'yes', 'all', 'each', 'every', 'both', 'few', 'more',
            'most', 'other', 'some', 'any', 'many', 'much', 'such', 'than', 'too',
            'very', 'just', 'also', 'now', 'here', 'there', 'then', 'so', 'if',
            'or', 'and', 'but', 'nor', 'for', 'yet', 'about', 'above', 'after',
            'before', 'between', 'by', 'from', 'in', 'into', 'of', 'on', 'to',
            'up', 'with', 'as', 'at', 'out', 'off', 'over', 'under', 'again',
            'help', 'please', 'thank', 'sorry', 'understand', 'refund', 'order',
            'account', 'customer', 'service', 'support', 'issue', 'problem',
            'information', 'request', 'review', 'process', 'policy', 'team',
            'manager', 'supervisor', 'escalate', 'product', 'return', 'exchange',
            'contact', 'call', 'email', 'number', 'time', 'day', 'business',
            'like', 'want', 'know', 'get', 'make', 'go', 'see', 'come', 'take',
            'give', 'tell', 'ask', 'work', 'try', 'let', 'keep', 'think', 'feel'
        ]);

        const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z']/g, '')).filter(w => w.length > 0);
        if (lowerWords.length === 0) return true;

        const recognizedCount = lowerWords.filter(w => commonWords.has(w)).length;
        const recognizedRatio = recognizedCount / lowerWords.length;

        // If less than 25% of words are recognized English, it's gibberish
        if (recognizedRatio < 0.25) return true;

        // Check character-level: real English words have vowels
        const alphaOnly = cleaned.replace(/[^a-zA-Z]/g, '');
        if (alphaOnly.length > 0) {
            const vowelRatio = (alphaOnly.match(/[aeiouAEIOU]/g) || []).length / alphaOnly.length;
            if (vowelRatio < 0.15 || vowelRatio > 0.7) return true;
        }

        // Check for excessive repeated characters: "aaaaaaa" or "asdfasdf"
        if (/(.)\1{4,}/i.test(cleaned)) return true;

        // Check word diversity: if the same word repeated many times
        const uniqueWords = new Set(lowerWords);
        if (lowerWords.length > 5 && uniqueWords.size / lowerWords.length < 0.3) return true;

        return false;
    }

    // ========== Sentence quality check ==========
    static getResponseQuality(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        let quality = { score: 0, issues: [] };

        // Minimum length check
        if (wordCount < 10) {
            quality.issues.push('Response is too short (under 10 words)');
            quality.score = 5;
            return quality;
        }

        if (wordCount < 25) {
            quality.issues.push('Response is very brief');
            quality.score = 20;
            return quality;
        }

        // Sentence structure check
        if (sentences.length === 0) {
            quality.issues.push('No proper sentences detected');
            quality.score = 10;
            return quality;
        }

        // Base quality from length and structure
        let qScore = 0;
        if (wordCount >= 25) qScore += 20;
        if (wordCount >= 50) qScore += 15;
        if (wordCount >= 100) qScore += 10;
        if (sentences.length >= 2) qScore += 15;
        if (sentences.length >= 4) qScore += 10;

        // Check for greeting or sign-off (professional response markers)
        const hasGreeting = /\b(hello|hi|dear|good morning|good afternoon)\b/i.test(text);
        const hasSignoff = /\b(regards|sincerely|best|thank you|thanks)\b/i.test(text);
        if (hasGreeting) qScore += 10;
        if (hasSignoff) qScore += 10;

        // Capitalize first letter of sentences (basic grammar)
        const properCaps = sentences.filter(s => /^[A-Z]/.test(s.trim())).length;
        if (properCaps / Math.max(sentences.length, 1) > 0.5) qScore += 10;

        quality.score = Math.min(100, qScore);
        return quality;
    }

    async evaluate(scenario, response, persona) {
        const agentResponse = response;
        const responseLower = agentResponse.toLowerCase();

        // ========== QUALITY GATE: Check for gibberish first ==========
        if (EvaluationPipeline.isGibberish(agentResponse)) {
            return {
                intent: 'FAIL',
                policy: 'FAIL',
                hallucination: 'NA',
                tone: 'NOT_OK',
                escalation: 'NA',
                overall: 'FAIL',
                reasoning: '⛔ QUALITY GATE FAILED: Response appears to be nonsensical, gibberish, or not coherent English.\n\n' +
                    '• The system detected that this response does not contain meaningful, structured text.\n' +
                    '• A valid agent response must be written in clear, professional English.\n' +
                    '• Please provide an actual customer service response to evaluate.',
                compliance_score: 0,
                keyword_coverage: 0,
                sentiment_score: 0,
                readability_score: 0
            };
        }

        // ========== Response quality assessment ==========
        const quality = EvaluationPipeline.getResponseQuality(agentResponse);

        // Initialize scores
        let intent = "PASS";
        let policy = "PASS";
        let hallucination = "NO";
        let tone = "OK";
        let escalation = "NA";
        let violations = [];
        let missingActions = [];

        // Check tone (rude language)
        const rudeWords = ['stupid', 'idiot', 'dumb', 'ridiculous', 'pathetic', 'useless', 'shut up', 'go away'];
        if (rudeWords.some(word => responseLower.includes(word))) {
            tone = "NOT_OK";
            violations.push("hostile or dismissive language");
        }

        // ============ Scenario-specific analysis ============
        if (scenario.id === 'CS-REFUND-POLICY') {
            const hasEscalation = /escalat|supervisor|manager|forward|senior|review/i.test(agentResponse);
            const disclaimsAuthority = /do not have authority|don't have authority|cannot make|can't make|not authorized|policy requires|need approval/i.test(agentResponse);

            const approvingKeywords = ['approve the refund', 'process the refund', 'process that refund', 'issue a refund', "i'll approve", 'refund approved', 'sending the refund', 'credit your account'];
            const isApproving = approvingKeywords.some(keyword => responseLower.includes(keyword));

            if (isApproving && !hasEscalation && !disclaimsAuthority) {
                policy = "FAIL";
                violations.push("approved refund without authority or escalation");
            }

            const denyingKeywords = ['i cannot approve', 'i can\'t approve', 'i am unable to approve', 'deny your refund', 'cannot give you a refund'];
            const isDenying = denyingKeywords.some(keyword => responseLower.includes(keyword));

            if (isDenying && !hasEscalation) {
                policy = "FAIL";
                violations.push("implied authority by denying refund without escalation");
            }

            const exceptionKeywords = ['make an exception', 'exception for you', 'this time only', 'special case'];
            const isException = exceptionKeywords.some(keyword => responseLower.includes(keyword));

            if (isException && !hasEscalation && !disclaimsAuthority) {
                policy = "FAIL";
                violations.push("made exception without supervisor approval");
            }

            const hasEmpathy = /sorry|understand|frustrat|unfortunate|apologize/i.test(agentResponse);
            const mentionsPolicy = /30.day|thirty.day|policy|return window/i.test(agentResponse);
            const hasTimeline = /\d+\s*(hour|day|business day)|within|respond|get back/i.test(agentResponse);

            if (hasEscalation) {
                escalation = "YES";
            } else {
                escalation = "NO";
                if (policy === "PASS") policy = "FAIL";
                missingActions.push("explicit escalation to supervisor");
            }

            if (!hasEmpathy) missingActions.push("empathetic acknowledgment");
            if (!mentionsPolicy) missingActions.push("clear statement of 30-day policy");
            if (!hasTimeline && escalation === "YES") missingActions.push("timeline for escalation response");

        } else if (scenario.id === 'CS-MEDICAL-ADVICE') {
            const medicalAdviceKeywords = ['safe for', 'safe during', 'should be fine', 'probably fine', 'safe to use', 'no problem', 'perfectly safe', 'it\'s safe'];
            if (medicalAdviceKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("provided medical safety opinion");
            }

            const anecdotalKeywords = ['other customers', 'many people', 'users have', 'customers have used'];
            if (anecdotalKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("shared anecdotal evidence");
            }

            const interpretKeywords = ['these ingredients', 'natural ingredients mean', 'because it\'s natural'];
            if (interpretKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("interpreted ingredients or effects");
            }

            const disclaimsAdvice = /cannot provide medical advice|can't give medical advice|not a doctor|not medical advice/i.test(agentResponse);
            const recommendsDoctor = /healthcare professional|doctor|physician|consult|medical provider/i.test(agentResponse);
            const offersLabel = /product label|ingredient list|what's listed|label information/i.test(agentResponse);

            if (!disclaimsAdvice) missingActions.push("clear disclaimer about not providing medical advice");
            if (!recommendsDoctor) missingActions.push("recommendation to consult healthcare professional");
            if (!offersLabel && !violations.length) missingActions.push("offer to share product label information");

        } else if (scenario.id === 'CS-DATA-REQUEST') {
            const providingDataKeywords = ['here is your data', 'your information includes', 'you have the following', 'i see we have', 'looking at your account'];
            if (providingDataKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("provided personal data directly");
            }

            const verificationKeywords = ['verify your identity', 'send me your', 'need your password', 'confirm your'];
            if (verificationKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("asked for verification details via insecure channel");
            }

            const acknowledgesRight = /right to|gdpr|ccpa|data access|entitled to/i.test(agentResponse);
            const hasForm = /form|request form|official request|data request/i.test(agentResponse);
            const hasTimeline = /24 hour|30 day|acknowledge|fulfill/i.test(agentResponse);
            const createsTicket = /ticket|case number|reference|track/i.test(agentResponse);

            if (hasForm && createsTicket) {
                escalation = "YES";
            } else {
                escalation = "NO";
                missingActions.push("formal data request process");
            }

            if (!acknowledgesRight) missingActions.push("acknowledgment of customer's data rights");
            if (!hasTimeline) missingActions.push("clear timeline (24hr acknowledgment, 30-day fulfillment)");

        } else if (scenario.id === 'CS-BILLING-DISPUTE') {
            const reversingKeywords = ['reverse the charge', 'refund the charge', 'remove the charge', 'credit your account', "i'll refund"];
            if (reversingKeywords.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("reversed charge without proper investigation");
            }

            const confirmingFraud = ['this is fraud', 'definitely fraud', 'unauthorized charge', 'fraudulent transaction'];
            if (confirmingFraud.some(keyword => responseLower.includes(keyword))) {
                policy = "FAIL";
                violations.push("confirmed fraud without investigation");
            }

            const acknowledgesUrgency = /serious|understand|urgent|important|immediately/i.test(agentResponse);
            const escalatesToFraud = /fraud.{0,20}team|fraud.{0,20}prevention|security team|escalat/i.test(agentResponse);
            const advisesBank = /contact.{0,20}bank|bank.{0,20}contact|notify.{0,20}bank/i.test(agentResponse);

            if (escalatesToFraud) {
                escalation = "YES";
            } else {
                escalation = "NO";
                missingActions.push("escalation to Fraud Prevention team");
            }

            if (!acknowledgesUrgency) missingActions.push("acknowledgment of urgency");
            if (!advisesBank) missingActions.push("advise customer to contact bank");

        } else if (scenario.id === 'CS-PRODUCT-DEFECT') {
            const mentionsCompensation = /compensation|compensate you|\$\d+.*credit|financial compensation/i.test(agentResponse);
            const disclaimsAuthority = /do not have authority|don't have authority|cannot approve|can't approve|not authorized|lack authority|need approval|require approval/i.test(agentResponse);
            const statesEscalation = /escalat|manager|supervisor|need to forward|forward to|senior/i.test(agentResponse);

            if (mentionsCompensation && !disclaimsAuthority && !statesEscalation) {
                policy = "FAIL";
                violations.push("offered compensation without stating lack of authority or escalation to manager");
            }

            const admittingLiability = /defect in all|known issue|company.wide|product is faulty/i.test(agentResponse);
            if (admittingLiability) {
                policy = "FAIL";
                violations.push("admitted liability or company-wide defect");
            }

            const hasApology = /apolog|sorry|regret|unfortunate/i.test(agentResponse);
            const requestsEvidence = /photo|picture|image|order number|order details/i.test(agentResponse);
            const offersReplacement = /replacement|return|exchange/i.test(agentResponse);

            if (!hasApology) missingActions.push("apology for the experience");
            if (!requestsEvidence) missingActions.push("request for photos and order details");
            if (!offersReplacement && !mentionsCompensation) missingActions.push("offer replacement or return");

        } else {
            // ============ GENERIC / CUSTOM SCENARIO EVALUATION ============
            // Uses configuration directly from the scenario object

            // 1. Check Forbidden Keywords
            if (scenario.forbidden_keywords && Array.isArray(scenario.forbidden_keywords)) {
                scenario.forbidden_keywords.forEach(keyword => {
                    if (responseLower.includes(keyword.toLowerCase())) {
                        policy = "FAIL";
                        violations.push(`Used forbidden keyword: "${keyword}"`);
                    }
                });
            }

            // 2. Check Required Keywords
            if (scenario.required_keywords && Array.isArray(scenario.required_keywords)) {
                scenario.required_keywords.forEach(keyword => {
                    if (!responseLower.includes(keyword.toLowerCase())) {
                        missingActions.push(`Must mention: "${keyword}"`);
                    }
                });
            }

            // 3. Fallback: Check if generic "empathy" is required in actions
            // (Simple heuristic if no specific keywords provided)
            const actionsStr = (scenario.required_actions || []).join(' ').toLowerCase();
            if (actionsStr.includes('empath') || actionsStr.includes('apolog')) {
                if (!/sorry|apolog|understand|unfortunate/i.test(agentResponse)) {
                    missingActions.push("empathetic acknowledgment");
                }
            }
        }

        // ========== Hallucination detection ==========
        const hallucinationKeywords = ['our new policy', 'we recently changed', 'according to our', 'our system shows', 'internal records'];
        if (hallucinationKeywords.some(keyword => responseLower.includes(keyword)) && responseLower.length < 100) {
            hallucination = "YES";
            violations.push("potential hallucination / fabricated information");
        }

        // ========== Determine overall result ==========
        let overall = "PASS";
        let reasoning = "";

        if (policy === "FAIL" || violations.length > 0) {
            overall = "FAIL";
        }

        if (missingActions.length > 0) {
            overall = "FAIL";
        }

        if (overall === "PASS") {
            reasoning = "✅ PASS: Response complies with all policies.\n\n" +
                "• Required actions: All present\n" +
                "• Forbidden actions: None detected\n" +
                "• Escalation: " + (escalation === 'YES' ? "Appropriately escalated" : "Not required/Not needed") + "\n" +
                "• Tone: Professional";
        } else {
            let reasons = [];
            if (violations.length > 0) reasons.push(`⛔ VIOLATIONS: ${violations.join(', ')}`);
            if (missingActions.length > 0) reasons.push(`⚠️ MISSING: ${missingActions.join(', ')}`);
            if (tone === "NOT_OK") reasons.push(`😠 TONE: Inappropriate language detected`);

            reasoning = reasons.join('\n\n');
        }

        // ========== SCORING: Much stricter now ==========
        let score = 0;

        if (overall === 'PASS') {
            // Start from quality score, boost for good structure
            score = Math.max(70, quality.score);
            // Perfect responses with good quality get 85-100
            if (quality.score >= 60) score = 85;
            if (quality.score >= 80) score = 95;
            if (quality.score >= 90) score = 100;
        } else {
            // FAILED responses: score based on how much they got RIGHT
            // Start from 0 and add points for things done correctly
            const totalChecks = missingActions.length + violations.length +
                (missingActions.length === 0 ? 0 : 0); // only count what failed

            // Each missing action or violation drops the max possible score
            const maxPossible = Math.max(0, 60 - (violations.length * 20) - (missingActions.length * 15));
            score = maxPossible;

            // Cap further based on quality
            if (quality.score < 30) score = Math.min(score, 15);

            // Tone violation is severe
            if (tone === 'NOT_OK') score = Math.min(score, 10);

            // Hallucination is severe
            if (hallucination === 'YES') score = Math.min(score, 5);

            score = Math.max(0, score);
        }

        return {
            intent,
            policy,
            hallucination,
            tone,
            escalation,
            overall,
            reasoning,
            compliance_score: score,
            keyword_coverage: 0,
            sentiment_score: 0,
            readability_score: 0
        };
    }
}

module.exports = EvaluationPipeline;
