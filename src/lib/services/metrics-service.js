/**
 * Metrics Service
 * Calculates evaluation quality metrics for chat agent responses.
 * All scores are 0-100. Scores start LOW and are EARNED, not given by default.
 */

class MetricsService {
    /**
     * Calculate all enhanced metrics for a response
     * @param {string} response - The agent's response text
     * @param {object} scenario - Scenario with requiredActions, forbiddenActions
     * @param {object} evalResult - Base evaluation result
     * @returns {object} Enhanced metrics
     */
    static calculate(response, scenario, evalResult = {}) {
        const responseText = (response || '').toLowerCase();
        const originalText = response || '';

        // Quick gibberish check — if the text is nonsense, all metrics should be 0
        if (MetricsService.isLowQuality(responseText)) {
            return {
                compliance_score: evalResult.compliance_score || 0,
                coherence_score: 0,
                empathy_score: 0,
                clarity_score: 0,
                professionalism_score: 0,
                keyword_coverage: 0,
                response_length: originalText.length,
                sentiment_score: 0,
                readability_score: 0,
            };
        }

        return {
            compliance_score: evalResult.compliance_score || 0,
            coherence_score: MetricsService.calculateCoherence(responseText),
            empathy_score: MetricsService.calculateEmpathy(responseText),
            clarity_score: MetricsService.calculateClarity(responseText),
            professionalism_score: MetricsService.calculateProfessionalism(responseText, originalText),
            keyword_coverage: MetricsService.calculateKeywordCoverage(responseText, scenario),
            response_length: originalText.length,
            sentiment_score: MetricsService.calculateSentiment(responseText),
            readability_score: MetricsService.calculateReadability(originalText),
        };
    }

    /**
     * Quick check: is this text too low quality to score?
     */
    static isLowQuality(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 5) return true;

        // Check if it has any proper sentence-ending punctuation
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
        if (sentences.length === 0 && words.length > 5) return true;

        // Check vowel ratio (real language has 30-45% vowels)
        const alphaOnly = text.replace(/[^a-z]/g, '');
        if (alphaOnly.length > 5) {
            const vowelRatio = (alphaOnly.match(/[aeiou]/g) || []).length / alphaOnly.length;
            if (vowelRatio < 0.15) return true;
        }

        return false;
    }

    /**
     * Coherence: checks for logical structure markers
     * Starts at 0, earns points for structure
     */
    static calculateCoherence(text) {
        let score = 0;

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);

        // Must have minimum content
        if (words.length < 10 || sentences.length < 1) return 5;

        // Basic sentence structure: +20 for having multiple sentences
        if (sentences.length >= 2) score += 20;
        if (sentences.length >= 3) score += 10;
        if (sentences.length >= 5) score += 5;

        // Transition/structure words: +5 each, max 25
        const structureMarkers = [
            'first', 'second', 'additionally', 'however', 'therefore',
            'because', 'in order to', 'as a result', 'please', 'next',
            'also', 'furthermore', 'meanwhile', 'consequently', 'finally'
        ];
        const found = structureMarkers.filter(m => text.includes(m));
        score += Math.min(found.length * 5, 25);

        // Paragraph structure: +10
        if (text.includes('\n')) score += 10;

        // Reasonable sentence length (not all one giant sentence): +15
        if (sentences.length > 0) {
            const avgWords = words.length / sentences.length;
            if (avgWords >= 5 && avgWords <= 25) score += 15;
        }

        // Word diversity bonus: +15
        const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
        const diversity = uniqueWords.size / words.length;
        if (diversity > 0.5) score += 15;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Empathy: checks for empathetic language patterns
     * Starts at 0, earns points for empathetic language
     */
    static calculateEmpathy(text) {
        let score = 0;

        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 5) return 0;

        const empathyWords = [
            'understand', 'sorry', 'apologize', 'appreciate', 'concern',
            'frustrating', 'inconvenience', 'happy to help', 'certainly',
            'of course', 'absolutely', 'glad', 'here to help', "i'm sorry",
            'thank you', 'valued', 'important to us', 'i can see', 'must be'
        ];
        const found = empathyWords.filter(w => text.includes(w));
        score += Math.min(found.length * 12, 60);

        // Acknowledging the customer's situation: +20
        if (/i understand|i can see|that must|i hear you/i.test(text)) score += 20;

        // Offering help: +20
        if (/let me|i'd like to|i can|we can|happy to|here to help/i.test(text)) score += 20;

        // Penalize cold/robotic language
        const coldWords = ['denied', 'impossible', 'refuse', 'rejected', 'never'];
        const coldFound = coldWords.filter(w => text.includes(w));
        score -= coldFound.length * 10;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Clarity: checks for clear, actionable language
     * Starts at 0, earns points for clarity
     */
    static calculateClarity(text) {
        let score = 0;

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
        if (words.length < 5) return 0;

        // Has action items: +20
        const actionWords = ['please', 'you can', 'steps', 'follow', 'click', 'call', 'email', 'visit', 'contact'];
        const found = actionWords.filter(w => text.includes(w));
        score += Math.min(found.length * 8, 30);

        // Has specifics (numbers, references): +15
        if (/\d+/.test(text)) score += 10;
        if (/\d+\s*(day|hour|minute|business)/i.test(text)) score += 5;

        // Good sentence length (not run-on): +20
        if (sentences.length > 0) {
            const avgWords = words.length / sentences.length;
            if (avgWords <= 20) score += 20;
            else if (avgWords <= 30) score += 10;
        }

        // Has clear structure: +15
        if (sentences.length >= 2) score += 15;

        // Penalize jargon: -10 each
        const jargon = ['per our policy', 'hereunder', 'herein', 'aforementioned', 'notwithstanding'];
        const jargonFound = jargon.filter(w => text.includes(w));
        score -= jargonFound.length * 10;

        // Direct language bonus: +10
        if (/here's what|what you can do|next step/i.test(text)) score += 10;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Professionalism: checks for professional tone markers
     * Starts at 0, earns points for professional language
     */
    static calculateProfessionalism(text, originalText) {
        let score = 0;

        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 5) return 0;

        // Professional markers: +8 each, max 35
        const proMarkers = ['please', 'thank', 'would', 'could', 'happy', 'assist', 'support', 'team', 'sincerely', 'regards'];
        const found = proMarkers.filter(w => text.includes(w));
        score += Math.min(found.length * 8, 35);

        // Has greeting: +15
        if (/\b(hello|hi|dear|good morning|good afternoon|good evening)\b/i.test(text)) score += 15;

        // Has sign-off: +15
        if (/\b(regards|sincerely|best wishes|thank you|thanks for)\b/i.test(text)) score += 15;

        // Proper capitalization (check original, not lowered): +10
        if (originalText) {
            const firstCharUpper = /^[A-Z]/.test(originalText.trim());
            if (firstCharUpper) score += 10;
        }

        // Complete sentences: +10
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
        if (sentences.length >= 2) score += 10;

        // Appropriate length: +15
        if (words.length >= 30) score += 15;

        // Penalize unprofessional language heavily
        const badWords = ['dude', 'bro', 'lol', 'omg', 'whatever', 'idk', 'tbh', 'smh', 'wtf', 'lmao', 'bruh'];
        const badFound = badWords.filter(w => text.includes(w));
        score -= badFound.length * 20;

        // Penalize ALL CAPS
        const capsWords = (originalText || '').match(/\b[A-Z]{4,}\b/g) || [];
        score -= Math.min(capsWords.length * 8, 20);

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Keyword Coverage: what % of required actions are addressed
     */
    static calculateKeywordCoverage(text, scenario) {
        if (!scenario || !scenario.requiredActions || scenario.requiredActions.length === 0) {
            return 0; // No requirements = can't measure coverage, return 0 not 100
        }

        let covered = 0;
        for (const action of scenario.requiredActions) {
            const keywords = action.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            if (keywords.length === 0) continue;
            const matched = keywords.filter(k => text.includes(k));
            if (matched.length >= Math.ceil(keywords.length * 0.4)) {
                covered++;
            }
        }

        return Math.round((covered / scenario.requiredActions.length) * 100);
    }

    /**
     * Sentiment: positive vs negative balance (0-100, 50 = neutral)
     */
    static calculateSentiment(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length < 5) return 0;

        const positiveWords = ['help', 'happy', 'great', 'thank', 'appreciate', 'glad', 'pleased', 'wonderful', 'excellent', 'welcome'];
        const negativeWords = ['unfortunately', 'unable', 'cannot', 'issue', 'problem', 'frustrat', 'complain', 'error', 'fail', 'wrong'];

        const posCount = positiveWords.filter(w => text.includes(w)).length;
        const negCount = negativeWords.filter(w => text.includes(w)).length;

        // In customer service, neutral is fine. Score from 0-100 where 50 is neutral
        const raw = 50 + (posCount * 8) - (negCount * 5);
        return Math.max(0, Math.min(100, raw));
    }

    /**
     * Flesch-Kincaid readability (0-100, higher = easier to read)
     */
    static calculateReadability(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
        const words = text.split(/\s+/).filter(w => w.length > 0);

        if (sentences.length === 0 || words.length < 5) return 0;

        const syllables = words.reduce((count, word) => {
            return count + MetricsService.countSyllables(word);
        }, 0);

        const avgSentenceLen = words.length / sentences.length;
        const avgSyllables = syllables / words.length;

        // Flesch Reading Ease formula
        const score = 206.835 - (1.015 * avgSentenceLen) - (84.6 * avgSyllables);
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    /**
     * Count syllables in a word (heuristic)
     */
    static countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return 1;

        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');

        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }
}

module.exports = MetricsService;
