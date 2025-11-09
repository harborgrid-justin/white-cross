/**
 * LOC: THSC1234567
 * File: /reuse/threat/threat-scoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Security analysis modules
 *   - Risk assessment engines
 */
/**
 * File: /reuse/threat/threat-scoring-kit.ts
 * Locator: WC-UTL-THSC-001
 * Purpose: Comprehensive Threat Scoring Utilities - Multi-factor scoring, risk calculation, confidence metrics
 *
 * Upstream: Independent utility module for threat intelligence scoring
 * Downstream: ../backend/*, threat services, security analysis, risk assessment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 40 utility functions for threat scoring, risk assessment, confidence computation, severity analysis
 *
 * LLM Context: Comprehensive threat scoring utilities for implementing production-ready threat intelligence
 * scoring systems in White Cross platform. Provides multi-factor scoring algorithms, risk score calculation,
 * confidence metrics, severity assessment, impact scoring, likelihood analysis, composite score aggregation,
 * score normalization, NestJS services, Sequelize models, and OpenAPI specifications.
 */
interface ThreatScore {
    overall: number;
    severity: number;
    confidence: number;
    impact: number;
    likelihood: number;
    urgency: number;
    timestamp: Date;
}
interface ScoringFactors {
    cvssScore?: number;
    attackComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
    exploitability: 'PROOF_OF_CONCEPT' | 'FUNCTIONAL' | 'HIGH' | 'NOT_DEFINED';
    targetedAssets: string[];
    affectedSystems: number;
    dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
    businessImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
interface ConfidenceMetrics {
    sourceReliability: number;
    dataQuality: number;
    corroboration: number;
    recency: number;
    overall: number;
}
interface SeverityLevel {
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    score: number;
    description: string;
    recommendedAction: string;
}
interface ImpactAssessment {
    confidentiality: number;
    integrity: number;
    availability: number;
    financial: number;
    reputational: number;
    composite: number;
}
interface LikelihoodScore {
    probability: number;
    timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
    trendAnalysis: 'INCREASING' | 'STABLE' | 'DECREASING';
    score: number;
}
interface CompositeScore {
    weightedScore: number;
    normalizedScore: number;
    components: Record<string, number>;
    weights: Record<string, number>;
    metadata: Record<string, unknown>;
}
interface ScoreNormalization {
    rawScore: number;
    normalizedScore: number;
    scale: {
        min: number;
        max: number;
    };
    method: 'LINEAR' | 'LOGARITHMIC' | 'EXPONENTIAL' | 'PERCENTILE';
}
interface RiskMatrix {
    likelihood: number;
    impact: number;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    riskScore: number;
    mitigationPriority: number;
}
interface ThreatIndicator {
    type: string;
    value: string;
    confidence: number;
    weight: number;
    lastSeen: Date;
}
interface ScoringWeights {
    severity: number;
    impact: number;
    likelihood: number;
    urgency: number;
    confidence: number;
}
interface ThreatContext {
    industry: string;
    organizationSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
    complianceRequirements: string[];
    criticalAssets: string[];
}
/**
 * Calculates comprehensive threat score using multiple factors.
 *
 * @param {ScoringFactors} factors - Scoring factors for threat assessment
 * @param {ScoringWeights} [weights] - Custom weights for score components
 * @returns {ThreatScore} Comprehensive threat score
 *
 * @example
 * ```typescript
 * const score = calculateThreatScore({
 *   cvssScore: 8.5,
 *   attackComplexity: 'LOW',
 *   exploitability: 'FUNCTIONAL',
 *   targetedAssets: ['web-server', 'database'],
 *   affectedSystems: 15,
 *   dataClassification: 'CONFIDENTIAL',
 *   businessImpact: 'HIGH'
 * });
 * // Result: { overall: 82.5, severity: 85, confidence: 80, impact: 85, likelihood: 75, urgency: 90, ... }
 * ```
 */
export declare const calculateThreatScore: (factors: ScoringFactors, weights?: ScoringWeights) => ThreatScore;
/**
 * Calculates CVSS-based severity score with contextual adjustments.
 *
 * @param {ScoringFactors} factors - Threat scoring factors
 * @returns {number} Severity score (0-100)
 *
 * @example
 * ```typescript
 * const severity = calculateSeverityScore({
 *   cvssScore: 7.8,
 *   attackComplexity: 'LOW',
 *   dataClassification: 'CONFIDENTIAL'
 * });
 * // Result: 82
 * ```
 */
export declare const calculateSeverityScore: (factors: ScoringFactors) => number;
/**
 * Calculates impact score based on affected systems and business impact.
 *
 * @param {ScoringFactors} factors - Threat scoring factors
 * @returns {number} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = calculateImpactScore({
 *   affectedSystems: 25,
 *   businessImpact: 'CRITICAL',
 *   targetedAssets: ['core-database', 'payment-system']
 * });
 * // Result: 92
 * ```
 */
export declare const calculateImpactScore: (factors: ScoringFactors) => number;
/**
 * Calculates likelihood score based on exploitability and threat trends.
 *
 * @param {ScoringFactors} factors - Threat scoring factors
 * @returns {number} Likelihood score (0-100)
 *
 * @example
 * ```typescript
 * const likelihood = calculateLikelihoodScore({
 *   exploitability: 'HIGH',
 *   attackComplexity: 'LOW'
 * });
 * // Result: 85
 * ```
 */
export declare const calculateLikelihoodScore: (factors: ScoringFactors) => number;
/**
 * Calculates urgency score based on time-sensitive factors.
 *
 * @param {ScoringFactors} factors - Threat scoring factors
 * @returns {number} Urgency score (0-100)
 *
 * @example
 * ```typescript
 * const urgency = calculateUrgencyScore({
 *   exploitability: 'HIGH',
 *   affectedSystems: 30,
 *   businessImpact: 'CRITICAL'
 * });
 * // Result: 88
 * ```
 */
export declare const calculateUrgencyScore: (factors: ScoringFactors) => number;
/**
 * Calculates confidence score for threat assessment accuracy.
 *
 * @param {ScoringFactors} factors - Threat scoring factors
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateConfidenceScore({
 *   cvssScore: 8.5,
 *   exploitability: 'FUNCTIONAL'
 * });
 * // Result: 75
 * ```
 */
export declare const calculateConfidenceScore: (factors: ScoringFactors) => number;
/**
 * Calculates risk score using likelihood and impact matrix.
 *
 * @param {number} likelihood - Likelihood score (0-100)
 * @param {number} impact - Impact score (0-100)
 * @returns {RiskMatrix} Risk assessment with level and score
 *
 * @example
 * ```typescript
 * const risk = calculateRiskScore(85, 90);
 * // Result: { likelihood: 85, impact: 90, riskLevel: 'CRITICAL', riskScore: 88, mitigationPriority: 95 }
 * ```
 */
export declare const calculateRiskScore: (likelihood: number, impact: number) => RiskMatrix;
/**
 * Calculates contextual risk score with organizational factors.
 *
 * @param {number} baseRiskScore - Base risk score
 * @param {ThreatContext} context - Organizational context
 * @returns {number} Adjusted risk score
 *
 * @example
 * ```typescript
 * const adjustedRisk = calculateContextualRisk(75, {
 *   industry: 'healthcare',
 *   organizationSize: 'ENTERPRISE',
 *   riskTolerance: 'LOW',
 *   complianceRequirements: ['HIPAA', 'SOC2'],
 *   criticalAssets: ['patient-db', 'ehr-system']
 * });
 * // Result: 88
 * ```
 */
export declare const calculateContextualRisk: (baseRiskScore: number, context: ThreatContext) => number;
/**
 * Calculates residual risk after mitigation measures.
 *
 * @param {number} inherentRisk - Initial risk score
 * @param {number} controlEffectiveness - Effectiveness of controls (0-100)
 * @returns {number} Residual risk score
 *
 * @example
 * ```typescript
 * const residualRisk = calculateResidualRisk(85, 70);
 * // Result: 26 (risk reduced by 70%)
 * ```
 */
export declare const calculateResidualRisk: (inherentRisk: number, controlEffectiveness: number) => number;
/**
 * Computes comprehensive confidence metrics for threat intelligence.
 *
 * @param {object} params - Confidence calculation parameters
 * @param {number} params.sourceReliability - Source reliability (0-100)
 * @param {number} params.dataQuality - Data quality score (0-100)
 * @param {number} params.corroboratingReports - Number of corroborating reports
 * @param {Date} params.lastUpdated - Last update timestamp
 * @returns {ConfidenceMetrics} Comprehensive confidence metrics
 *
 * @example
 * ```typescript
 * const confidence = computeConfidenceMetrics({
 *   sourceReliability: 85,
 *   dataQuality: 90,
 *   corroboratingReports: 5,
 *   lastUpdated: new Date('2025-11-08')
 * });
 * // Result: { sourceReliability: 85, dataQuality: 90, corroboration: 83, recency: 95, overall: 88 }
 * ```
 */
export declare const computeConfidenceMetrics: (params: {
    sourceReliability: number;
    dataQuality: number;
    corroboratingReports: number;
    lastUpdated: Date;
}) => ConfidenceMetrics;
/**
 * Calculates source reliability score based on historical accuracy.
 *
 * @param {object} sourceHistory - Source historical performance
 * @param {number} sourceHistory.totalReports - Total reports from source
 * @param {number} sourceHistory.confirmedReports - Confirmed accurate reports
 * @param {number} sourceHistory.falsePositives - False positive count
 * @returns {number} Source reliability score (0-100)
 *
 * @example
 * ```typescript
 * const reliability = calculateSourceReliability({
 *   totalReports: 100,
 *   confirmedReports: 85,
 *   falsePositives: 5
 * });
 * // Result: 80
 * ```
 */
export declare const calculateSourceReliability: (sourceHistory: {
    totalReports: number;
    confirmedReports: number;
    falsePositives: number;
}) => number;
/**
 * Aggregates confidence scores from multiple threat indicators.
 *
 * @param {ThreatIndicator[]} indicators - Array of threat indicators
 * @returns {number} Aggregated confidence score
 *
 * @example
 * ```typescript
 * const confidence = aggregateIndicatorConfidence([
 *   { type: 'ip', value: '192.168.1.1', confidence: 85, weight: 1.0, lastSeen: new Date() },
 *   { type: 'domain', value: 'malicious.com', confidence: 90, weight: 1.2, lastSeen: new Date() },
 *   { type: 'hash', value: 'abc123', confidence: 95, weight: 1.5, lastSeen: new Date() }
 * ]);
 * // Result: 91
 * ```
 */
export declare const aggregateIndicatorConfidence: (indicators: ThreatIndicator[]) => number;
/**
 * Determines severity level from numerical score.
 *
 * @param {number} score - Numerical severity score (0-100)
 * @returns {SeverityLevel} Severity level with description and recommended action
 *
 * @example
 * ```typescript
 * const severity = determineSeverityLevel(88);
 * // Result: {
 * //   level: 'CRITICAL',
 * //   score: 88,
 * //   description: 'Critical threat requiring immediate action',
 * //   recommendedAction: 'Immediate response required - activate incident response team'
 * // }
 * ```
 */
export declare const determineSeverityLevel: (score: number) => SeverityLevel;
/**
 * Calculates severity trend over time.
 *
 * @param {number[]} historicalScores - Array of historical severity scores
 * @param {number} currentScore - Current severity score
 * @returns {object} Severity trend analysis
 *
 * @example
 * ```typescript
 * const trend = calculateSeverityTrend([60, 65, 70, 75], 80);
 * // Result: { trend: 'INCREASING', rate: 5, prediction: 85 }
 * ```
 */
export declare const calculateSeverityTrend: (historicalScores: number[], currentScore: number) => {
    trend: "INCREASING" | "STABLE" | "DECREASING";
    rate: number;
    prediction: number;
};
/**
 * Performs comprehensive impact assessment across multiple dimensions.
 *
 * @param {object} params - Impact assessment parameters
 * @param {number} params.confidentialityImpact - Impact on confidentiality (0-100)
 * @param {number} params.integrityImpact - Impact on integrity (0-100)
 * @param {number} params.availabilityImpact - Impact on availability (0-100)
 * @param {number} params.financialImpact - Financial impact estimate (0-100)
 * @param {number} params.reputationalImpact - Reputational damage (0-100)
 * @returns {ImpactAssessment} Comprehensive impact assessment
 *
 * @example
 * ```typescript
 * const impact = assessThreatImpact({
 *   confidentialityImpact: 90,
 *   integrityImpact: 85,
 *   availabilityImpact: 70,
 *   financialImpact: 80,
 *   reputationalImpact: 95
 * });
 * // Result: { confidentiality: 90, integrity: 85, availability: 70, financial: 80, reputational: 95, composite: 84 }
 * ```
 */
export declare const assessThreatImpact: (params: {
    confidentialityImpact: number;
    integrityImpact: number;
    availabilityImpact: number;
    financialImpact: number;
    reputationalImpact: number;
}) => ImpactAssessment;
/**
 * Calculates business impact score based on affected business processes.
 *
 * @param {string[]} affectedProcesses - List of affected business processes
 * @param {Record<string, number>} processCriticality - Criticality scores for each process
 * @returns {number} Business impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = calculateBusinessImpact(
 *   ['payment-processing', 'order-fulfillment', 'customer-support'],
 *   { 'payment-processing': 95, 'order-fulfillment': 85, 'customer-support': 60 }
 * );
 * // Result: 80
 * ```
 */
export declare const calculateBusinessImpact: (affectedProcesses: string[], processCriticality: Record<string, number>) => number;
/**
 * Estimates financial impact of a threat.
 *
 * @param {object} params - Financial impact parameters
 * @param {number} params.affectedRecords - Number of affected records
 * @param {number} params.costPerRecord - Estimated cost per record
 * @param {number} params.downtimeHours - Estimated downtime in hours
 * @param {number} params.hourlyRevenue - Hourly revenue loss
 * @returns {object} Financial impact estimation
 *
 * @example
 * ```typescript
 * const financial = estimateFinancialImpact({
 *   affectedRecords: 10000,
 *   costPerRecord: 250,
 *   downtimeHours: 8,
 *   hourlyRevenue: 50000
 * });
 * // Result: { recordCost: 2500000, revenueLoss: 400000, totalEstimate: 2900000, impactScore: 95 }
 * ```
 */
export declare const estimateFinancialImpact: (params: {
    affectedRecords: number;
    costPerRecord: number;
    downtimeHours: number;
    hourlyRevenue: number;
}) => {
    recordCost: number;
    revenueLoss: number;
    totalEstimate: number;
    impactScore: number;
};
/**
 * Calculates comprehensive likelihood score with timeframe analysis.
 *
 * @param {object} params - Likelihood calculation parameters
 * @param {number} params.threatActorCapability - Threat actor capability (0-100)
 * @param {number} params.targetVulnerability - Target vulnerability level (0-100)
 * @param {number} params.historicalFrequency - Historical attack frequency
 * @param {string} params.threatIntelligence - Latest threat intelligence
 * @returns {LikelihoodScore} Comprehensive likelihood assessment
 *
 * @example
 * ```typescript
 * const likelihood = calculateComprehensiveLikelihood({
 *   threatActorCapability: 85,
 *   targetVulnerability: 70,
 *   historicalFrequency: 12,
 *   threatIntelligence: 'active-campaigns'
 * });
 * // Result: { probability: 78, timeframe: 'SHORT_TERM', trendAnalysis: 'INCREASING', score: 82 }
 * ```
 */
export declare const calculateComprehensiveLikelihood: (params: {
    threatActorCapability: number;
    targetVulnerability: number;
    historicalFrequency: number;
    threatIntelligence: string;
}) => LikelihoodScore;
/**
 * Calculates attack probability based on threat intelligence feeds.
 *
 * @param {object} params - Attack probability parameters
 * @param {number} params.activeThreats - Number of active threats in sector
 * @param {number} params.exploitAvailability - Exploit availability (0-100)
 * @param {boolean} params.publicDisclosure - Whether vulnerability is publicly disclosed
 * @returns {number} Attack probability score (0-100)
 *
 * @example
 * ```typescript
 * const probability = calculateAttackProbability({
 *   activeThreats: 15,
 *   exploitAvailability: 85,
 *   publicDisclosure: true
 * });
 * // Result: 87
 * ```
 */
export declare const calculateAttackProbability: (params: {
    activeThreats: number;
    exploitAvailability: number;
    publicDisclosure: boolean;
}) => number;
/**
 * Aggregates multiple score components into weighted composite score.
 *
 * @param {Record<string, number>} components - Score components
 * @param {Record<string, number>} weights - Component weights (must sum to 1)
 * @param {Record<string, unknown>} [metadata] - Additional metadata
 * @returns {CompositeScore} Composite score with normalization
 *
 * @example
 * ```typescript
 * const composite = aggregateCompositeScore(
 *   { threat: 85, vulnerability: 70, exposure: 60 },
 *   { threat: 0.5, vulnerability: 0.3, exposure: 0.2 }
 * );
 * // Result: { weightedScore: 75.5, normalizedScore: 76, components: {...}, weights: {...}, metadata: {} }
 * ```
 */
export declare const aggregateCompositeScore: (components: Record<string, number>, weights: Record<string, number>, metadata?: Record<string, unknown>) => CompositeScore;
/**
 * Calculates weighted average of multiple threat scores.
 *
 * @param {ThreatScore[]} scores - Array of threat scores
 * @param {number[]} [weights] - Optional weights for each score
 * @returns {ThreatScore} Aggregated threat score
 *
 * @example
 * ```typescript
 * const avgScore = calculateWeightedAverage(
 *   [score1, score2, score3],
 *   [0.5, 0.3, 0.2]
 * );
 * ```
 */
export declare const calculateWeightedAverage: (scores: ThreatScore[], weights?: number[]) => ThreatScore;
/**
 * Normalizes score to 0-100 scale using specified method.
 *
 * @param {number} rawScore - Raw score to normalize
 * @param {number} minValue - Minimum value in raw scale
 * @param {number} maxValue - Maximum value in raw scale
 * @param {'LINEAR' | 'LOGARITHMIC' | 'EXPONENTIAL' | 'PERCENTILE'} [method='LINEAR'] - Normalization method
 * @returns {ScoreNormalization} Normalized score with metadata
 *
 * @example
 * ```typescript
 * const normalized = normalizeScore(7.5, 0, 10, 'LINEAR');
 * // Result: { rawScore: 7.5, normalizedScore: 75, scale: { min: 0, max: 10 }, method: 'LINEAR' }
 * ```
 */
export declare const normalizeScore: (rawScore: number, minValue: number, maxValue: number, method?: "LINEAR" | "LOGARITHMIC" | "EXPONENTIAL" | "PERCENTILE") => ScoreNormalization;
/**
 * Normalizes CVSS score to 0-100 scale.
 *
 * @param {number} cvssScore - CVSS score (0-10)
 * @returns {number} Normalized score (0-100)
 *
 * @example
 * ```typescript
 * const normalized = normalizeCVSSScore(8.5);
 * // Result: 85
 * ```
 */
export declare const normalizeCVSSScore: (cvssScore: number) => number;
/**
 * Applies min-max normalization to score array.
 *
 * @param {number[]} scores - Array of scores to normalize
 * @returns {number[]} Normalized scores (0-100)
 *
 * @example
 * ```typescript
 * const normalized = applyMinMaxNormalization([45, 67, 89, 23, 56]);
 * // Result: [33, 67, 100, 0, 50]
 * ```
 */
export declare const applyMinMaxNormalization: (scores: number[]) => number[];
/**
 * Applies z-score normalization and scales to 0-100.
 *
 * @param {number[]} scores - Array of scores to normalize
 * @returns {number[]} Normalized scores (0-100)
 *
 * @example
 * ```typescript
 * const normalized = applyZScoreNormalization([45, 67, 89, 23, 56]);
 * // Result: [39, 61, 83, 17, 50]
 * ```
 */
export declare const applyZScoreNormalization: (scores: number[]) => number[];
/**
 * Creates NestJS injectable threat scoring service.
 *
 * @returns {string} NestJS service class template
 *
 * @example
 * ```typescript
 * const serviceCode = createThreatScoringService();
 * // Returns: Full NestJS @Injectable() service class
 * ```
 */
export declare const createThreatScoringService: () => string;
/**
 * Creates TypeScript interface definitions for scoring models.
 *
 * @returns {string} TypeScript interface definitions
 *
 * @example
 * ```typescript
 * const types = createScoringTypeDefinitions();
 * ```
 */
export declare const createScoringTypeDefinitions: () => string;
/**
 * Creates Sequelize model for threat scores storage.
 *
 * @returns {string} Sequelize model class definition
 *
 * @example
 * ```typescript
 * const model = createThreatScoreModel();
 * ```
 */
export declare const createThreatScoreModel: () => string;
/**
 * Creates Swagger/OpenAPI decorator for threat scoring endpoint.
 *
 * @returns {string} Swagger decorator code
 *
 * @example
 * ```typescript
 * const swagger = createThreatScoringSwagger();
 * ```
 */
export declare const createThreatScoringSwagger: () => string;
declare const _default: {
    calculateThreatScore: (factors: ScoringFactors, weights?: ScoringWeights) => ThreatScore;
    calculateSeverityScore: (factors: ScoringFactors) => number;
    calculateImpactScore: (factors: ScoringFactors) => number;
    calculateLikelihoodScore: (factors: ScoringFactors) => number;
    calculateUrgencyScore: (factors: ScoringFactors) => number;
    calculateConfidenceScore: (factors: ScoringFactors) => number;
    calculateRiskScore: (likelihood: number, impact: number) => RiskMatrix;
    calculateContextualRisk: (baseRiskScore: number, context: ThreatContext) => number;
    calculateResidualRisk: (inherentRisk: number, controlEffectiveness: number) => number;
    computeConfidenceMetrics: (params: {
        sourceReliability: number;
        dataQuality: number;
        corroboratingReports: number;
        lastUpdated: Date;
    }) => ConfidenceMetrics;
    calculateSourceReliability: (sourceHistory: {
        totalReports: number;
        confirmedReports: number;
        falsePositives: number;
    }) => number;
    aggregateIndicatorConfidence: (indicators: ThreatIndicator[]) => number;
    determineSeverityLevel: (score: number) => SeverityLevel;
    calculateSeverityTrend: (historicalScores: number[], currentScore: number) => {
        trend: "INCREASING" | "STABLE" | "DECREASING";
        rate: number;
        prediction: number;
    };
    assessThreatImpact: (params: {
        confidentialityImpact: number;
        integrityImpact: number;
        availabilityImpact: number;
        financialImpact: number;
        reputationalImpact: number;
    }) => ImpactAssessment;
    calculateBusinessImpact: (affectedProcesses: string[], processCriticality: Record<string, number>) => number;
    estimateFinancialImpact: (params: {
        affectedRecords: number;
        costPerRecord: number;
        downtimeHours: number;
        hourlyRevenue: number;
    }) => {
        recordCost: number;
        revenueLoss: number;
        totalEstimate: number;
        impactScore: number;
    };
    calculateComprehensiveLikelihood: (params: {
        threatActorCapability: number;
        targetVulnerability: number;
        historicalFrequency: number;
        threatIntelligence: string;
    }) => LikelihoodScore;
    calculateAttackProbability: (params: {
        activeThreats: number;
        exploitAvailability: number;
        publicDisclosure: boolean;
    }) => number;
    aggregateCompositeScore: (components: Record<string, number>, weights: Record<string, number>, metadata?: Record<string, unknown>) => CompositeScore;
    calculateWeightedAverage: (scores: ThreatScore[], weights?: number[]) => ThreatScore;
    normalizeScore: (rawScore: number, minValue: number, maxValue: number, method?: "LINEAR" | "LOGARITHMIC" | "EXPONENTIAL" | "PERCENTILE") => ScoreNormalization;
    normalizeCVSSScore: (cvssScore: number) => number;
    applyMinMaxNormalization: (scores: number[]) => number[];
    applyZScoreNormalization: (scores: number[]) => number[];
    createThreatScoringService: () => string;
    createScoringTypeDefinitions: () => string;
    createThreatScoreModel: () => string;
    createThreatScoringSwagger: () => string;
};
export default _default;
//# sourceMappingURL=threat-scoring-kit.d.ts.map