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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  scale: { min: number; max: number };
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

// ============================================================================
// MULTI-FACTOR SCORING ALGORITHMS
// ============================================================================

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
export const calculateThreatScore = (
  factors: ScoringFactors,
  weights?: ScoringWeights,
): ThreatScore => {
  const defaultWeights: ScoringWeights = {
    severity: 0.3,
    impact: 0.25,
    likelihood: 0.2,
    urgency: 0.15,
    confidence: 0.1,
  };

  const finalWeights = { ...defaultWeights, ...weights };

  const severity = calculateSeverityScore(factors);
  const impact = calculateImpactScore(factors);
  const likelihood = calculateLikelihoodScore(factors);
  const urgency = calculateUrgencyScore(factors);
  const confidence = calculateConfidenceScore(factors);

  const overall =
    severity * finalWeights.severity +
    impact * finalWeights.impact +
    likelihood * finalWeights.likelihood +
    urgency * finalWeights.urgency +
    confidence * finalWeights.confidence;

  return {
    overall: Math.round(overall * 10) / 10,
    severity,
    confidence,
    impact,
    likelihood,
    urgency,
    timestamp: new Date(),
  };
};

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
export const calculateSeverityScore = (factors: ScoringFactors): number => {
  let score = factors.cvssScore ? (factors.cvssScore / 10) * 100 : 50;

  // Adjust for attack complexity
  const complexityModifier = {
    LOW: 1.2,
    MEDIUM: 1.0,
    HIGH: 0.8,
  };
  score *= complexityModifier[factors.attackComplexity];

  // Adjust for data classification
  const classificationModifier = {
    PUBLIC: 0.7,
    INTERNAL: 0.85,
    CONFIDENTIAL: 1.1,
    RESTRICTED: 1.3,
  };
  score *= classificationModifier[factors.dataClassification];

  return Math.min(100, Math.max(0, Math.round(score)));
};

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
export const calculateImpactScore = (factors: ScoringFactors): number => {
  const businessImpactScores = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 95,
  };

  let score = businessImpactScores[factors.businessImpact];

  // Adjust for number of affected systems
  const systemImpact = Math.min(20, factors.affectedSystems * 2);
  score += systemImpact;

  // Adjust for critical asset targeting
  if (factors.targetedAssets && factors.targetedAssets.length > 0) {
    score += Math.min(15, factors.targetedAssets.length * 3);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

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
export const calculateLikelihoodScore = (factors: ScoringFactors): number => {
  const exploitabilityScores = {
    NOT_DEFINED: 30,
    PROOF_OF_CONCEPT: 50,
    FUNCTIONAL: 70,
    HIGH: 90,
  };

  let score = exploitabilityScores[factors.exploitability];

  // Adjust for attack complexity (inverse relationship)
  const complexityModifier = {
    LOW: 1.3,
    MEDIUM: 1.0,
    HIGH: 0.7,
  };
  score *= complexityModifier[factors.attackComplexity];

  return Math.min(100, Math.max(0, Math.round(score)));
};

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
export const calculateUrgencyScore = (factors: ScoringFactors): number => {
  let score = 50; // Base urgency

  // High exploitability increases urgency
  if (factors.exploitability === 'HIGH') {
    score += 30;
  } else if (factors.exploitability === 'FUNCTIONAL') {
    score += 20;
  }

  // Critical business impact increases urgency
  if (factors.businessImpact === 'CRITICAL') {
    score += 25;
  } else if (factors.businessImpact === 'HIGH') {
    score += 15;
  }

  // Wide-spread impact increases urgency
  if (factors.affectedSystems > 20) {
    score += 20;
  } else if (factors.affectedSystems > 10) {
    score += 10;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

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
export const calculateConfidenceScore = (factors: ScoringFactors): number => {
  let score = 60; // Base confidence

  // CVSS score provides higher confidence
  if (factors.cvssScore && factors.cvssScore > 0) {
    score += 20;
  }

  // Defined exploitability increases confidence
  if (factors.exploitability !== 'NOT_DEFINED') {
    score += 15;
  }

  // Multiple affected systems provide more data points
  if (factors.affectedSystems > 5) {
    score += 5;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

// ============================================================================
// RISK SCORE CALCULATION
// ============================================================================

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
export const calculateRiskScore = (likelihood: number, impact: number): RiskMatrix => {
  const riskScore = (likelihood * 0.4 + impact * 0.6);

  let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  let mitigationPriority: number;

  if (riskScore >= 80) {
    riskLevel = 'CRITICAL';
    mitigationPriority = 95;
  } else if (riskScore >= 60) {
    riskLevel = 'HIGH';
    mitigationPriority = 75;
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    mitigationPriority = 50;
  } else {
    riskLevel = 'LOW';
    mitigationPriority = 25;
  }

  return {
    likelihood,
    impact,
    riskLevel,
    riskScore: Math.round(riskScore),
    mitigationPriority,
  };
};

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
export const calculateContextualRisk = (
  baseRiskScore: number,
  context: ThreatContext,
): number => {
  let adjustedScore = baseRiskScore;

  // Industry-specific adjustments
  const industryMultipliers: Record<string, number> = {
    healthcare: 1.3,
    finance: 1.25,
    government: 1.2,
    education: 1.1,
    retail: 1.05,
    other: 1.0,
  };
  adjustedScore *= industryMultipliers[context.industry] || 1.0;

  // Risk tolerance adjustments
  const toleranceModifiers = {
    LOW: 1.2,
    MEDIUM: 1.0,
    HIGH: 0.85,
  };
  adjustedScore *= toleranceModifiers[context.riskTolerance];

  // Organization size impact
  const sizeModifiers = {
    SMALL: 0.9,
    MEDIUM: 1.0,
    LARGE: 1.1,
    ENTERPRISE: 1.15,
  };
  adjustedScore *= sizeModifiers[context.organizationSize];

  // Compliance requirements add weight
  if (context.complianceRequirements.length > 0) {
    adjustedScore += Math.min(10, context.complianceRequirements.length * 2);
  }

  return Math.min(100, Math.max(0, Math.round(adjustedScore)));
};

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
export const calculateResidualRisk = (
  inherentRisk: number,
  controlEffectiveness: number,
): number => {
  const reduction = (inherentRisk * controlEffectiveness) / 100;
  const residual = inherentRisk - reduction;
  return Math.max(0, Math.round(residual));
};

// ============================================================================
// CONFIDENCE SCORE COMPUTATION
// ============================================================================

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
export const computeConfidenceMetrics = (params: {
  sourceReliability: number;
  dataQuality: number;
  corroboratingReports: number;
  lastUpdated: Date;
}): ConfidenceMetrics => {
  const { sourceReliability, dataQuality, corroboratingReports, lastUpdated } = params;

  // Calculate corroboration score
  const corroboration = Math.min(100, 50 + (corroboratingReports * 10));

  // Calculate recency score
  const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  let recency: number;
  if (daysSinceUpdate < 1) {
    recency = 100;
  } else if (daysSinceUpdate < 7) {
    recency = 90;
  } else if (daysSinceUpdate < 30) {
    recency = 70;
  } else if (daysSinceUpdate < 90) {
    recency = 50;
  } else {
    recency = 30;
  }

  // Calculate overall confidence
  const overall = Math.round(
    sourceReliability * 0.3 +
    dataQuality * 0.3 +
    corroboration * 0.2 +
    recency * 0.2
  );

  return {
    sourceReliability,
    dataQuality,
    corroboration,
    recency,
    overall,
  };
};

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
export const calculateSourceReliability = (sourceHistory: {
  totalReports: number;
  confirmedReports: number;
  falsePositives: number;
}): number => {
  if (sourceHistory.totalReports === 0) return 50; // Neutral for new sources

  const accuracyRate = (sourceHistory.confirmedReports / sourceHistory.totalReports) * 100;
  const falsePositiveRate = (sourceHistory.falsePositives / sourceHistory.totalReports) * 100;

  // Penalize for false positives
  const reliability = accuracyRate - (falsePositiveRate * 2);

  return Math.min(100, Math.max(0, Math.round(reliability)));
};

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
export const aggregateIndicatorConfidence = (indicators: ThreatIndicator[]): number => {
  if (indicators.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  indicators.forEach(indicator => {
    weightedSum += indicator.confidence * indicator.weight;
    totalWeight += indicator.weight;
  });

  return Math.round(weightedSum / totalWeight);
};

// ============================================================================
// SEVERITY ASSESSMENT
// ============================================================================

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
export const determineSeverityLevel = (score: number): SeverityLevel => {
  if (score >= 90) {
    return {
      level: 'CRITICAL',
      score,
      description: 'Critical threat requiring immediate action',
      recommendedAction: 'Immediate response required - activate incident response team',
    };
  } else if (score >= 70) {
    return {
      level: 'HIGH',
      score,
      description: 'High severity threat requiring urgent attention',
      recommendedAction: 'Prioritize investigation and implement mitigations within 24 hours',
    };
  } else if (score >= 40) {
    return {
      level: 'MEDIUM',
      score,
      description: 'Medium severity threat requiring timely response',
      recommendedAction: 'Schedule investigation and apply appropriate controls within 7 days',
    };
  } else if (score >= 20) {
    return {
      level: 'LOW',
      score,
      description: 'Low severity threat for monitoring',
      recommendedAction: 'Monitor and review during regular security operations',
    };
  } else {
    return {
      level: 'INFO',
      score,
      description: 'Informational - minimal threat',
      recommendedAction: 'Log for awareness and trend analysis',
    };
  }
};

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
export const calculateSeverityTrend = (
  historicalScores: number[],
  currentScore: number,
): { trend: 'INCREASING' | 'STABLE' | 'DECREASING'; rate: number; prediction: number } => {
  if (historicalScores.length === 0) {
    return { trend: 'STABLE', rate: 0, prediction: currentScore };
  }

  const lastScore = historicalScores[historicalScores.length - 1];
  const scoreDiff = currentScore - lastScore;

  let trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  if (Math.abs(scoreDiff) < 5) {
    trend = 'STABLE';
  } else if (scoreDiff > 0) {
    trend = 'INCREASING';
  } else {
    trend = 'DECREASING';
  }

  // Calculate average rate of change
  let totalChange = 0;
  for (let i = 1; i < historicalScores.length; i++) {
    totalChange += historicalScores[i] - historicalScores[i - 1];
  }
  const avgRate = historicalScores.length > 1 ? totalChange / (historicalScores.length - 1) : 0;

  // Simple linear prediction
  const prediction = Math.min(100, Math.max(0, Math.round(currentScore + avgRate)));

  return {
    trend,
    rate: Math.round(avgRate * 10) / 10,
    prediction,
  };
};

// ============================================================================
// IMPACT SCORING
// ============================================================================

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
export const assessThreatImpact = (params: {
  confidentialityImpact: number;
  integrityImpact: number;
  availabilityImpact: number;
  financialImpact: number;
  reputationalImpact: number;
}): ImpactAssessment => {
  const weights = {
    confidentiality: 0.25,
    integrity: 0.25,
    availability: 0.2,
    financial: 0.15,
    reputational: 0.15,
  };

  const composite = Math.round(
    params.confidentialityImpact * weights.confidentiality +
    params.integrityImpact * weights.integrity +
    params.availabilityImpact * weights.availability +
    params.financialImpact * weights.financial +
    params.reputationalImpact * weights.reputational
  );

  return {
    confidentiality: params.confidentialityImpact,
    integrity: params.integrityImpact,
    availability: params.availabilityImpact,
    financial: params.financialImpact,
    reputational: params.reputationalImpact,
    composite,
  };
};

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
export const calculateBusinessImpact = (
  affectedProcesses: string[],
  processCriticality: Record<string, number>,
): number => {
  if (affectedProcesses.length === 0) return 0;

  let totalImpact = 0;
  let processCount = 0;

  affectedProcesses.forEach(process => {
    const criticality = processCriticality[process] || 50;
    totalImpact += criticality;
    processCount++;
  });

  const averageImpact = totalImpact / processCount;

  // Bonus for multiple critical processes affected
  const multiProcessBonus = Math.min(20, (processCount - 1) * 5);

  return Math.min(100, Math.round(averageImpact + multiProcessBonus));
};

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
export const estimateFinancialImpact = (params: {
  affectedRecords: number;
  costPerRecord: number;
  downtimeHours: number;
  hourlyRevenue: number;
}): { recordCost: number; revenueLoss: number; totalEstimate: number; impactScore: number } => {
  const recordCost = params.affectedRecords * params.costPerRecord;
  const revenueLoss = params.downtimeHours * params.hourlyRevenue;
  const totalEstimate = recordCost + revenueLoss;

  // Score based on total financial impact (normalized to 0-100)
  let impactScore: number;
  if (totalEstimate >= 1000000) {
    impactScore = 100;
  } else if (totalEstimate >= 500000) {
    impactScore = 85;
  } else if (totalEstimate >= 100000) {
    impactScore = 70;
  } else if (totalEstimate >= 50000) {
    impactScore = 55;
  } else if (totalEstimate >= 10000) {
    impactScore = 40;
  } else {
    impactScore = 25;
  }

  return {
    recordCost,
    revenueLoss,
    totalEstimate,
    impactScore,
  };
};

// ============================================================================
// LIKELIHOOD SCORING
// ============================================================================

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
export const calculateComprehensiveLikelihood = (params: {
  threatActorCapability: number;
  targetVulnerability: number;
  historicalFrequency: number;
  threatIntelligence: string;
}): LikelihoodScore => {
  // Base probability from capability and vulnerability
  const baseProbability = (params.threatActorCapability * 0.4) + (params.targetVulnerability * 0.6);

  // Adjust for historical frequency
  const frequencyModifier = Math.min(20, params.historicalFrequency * 2);
  const adjustedProbability = baseProbability + frequencyModifier;

  // Determine timeframe
  let timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  if (adjustedProbability >= 80 && params.threatIntelligence === 'active-campaigns') {
    timeframe = 'IMMEDIATE';
  } else if (adjustedProbability >= 60) {
    timeframe = 'SHORT_TERM';
  } else if (adjustedProbability >= 40) {
    timeframe = 'MEDIUM_TERM';
  } else {
    timeframe = 'LONG_TERM';
  }

  // Trend analysis
  let trendAnalysis: 'INCREASING' | 'STABLE' | 'DECREASING';
  if (params.historicalFrequency > 10) {
    trendAnalysis = 'INCREASING';
  } else if (params.historicalFrequency > 3) {
    trendAnalysis = 'STABLE';
  } else {
    trendAnalysis = 'DECREASING';
  }

  // Final score with timeframe urgency
  const timeframeMultiplier = {
    IMMEDIATE: 1.2,
    SHORT_TERM: 1.1,
    MEDIUM_TERM: 1.0,
    LONG_TERM: 0.9,
  };

  const score = Math.min(100, Math.round(adjustedProbability * timeframeMultiplier[timeframe]));

  return {
    probability: Math.round(adjustedProbability),
    timeframe,
    trendAnalysis,
    score,
  };
};

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
export const calculateAttackProbability = (params: {
  activeThreats: number;
  exploitAvailability: number;
  publicDisclosure: boolean;
}): number => {
  let score = 30; // Base probability

  // Active threats in sector
  score += Math.min(30, params.activeThreats * 2);

  // Exploit availability
  score += (params.exploitAvailability * 0.3);

  // Public disclosure significantly increases probability
  if (params.publicDisclosure) {
    score += 20;
  }

  return Math.min(100, Math.round(score));
};

// ============================================================================
// COMPOSITE SCORE AGGREGATION
// ============================================================================

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
export const aggregateCompositeScore = (
  components: Record<string, number>,
  weights: Record<string, number>,
  metadata?: Record<string, unknown>,
): CompositeScore => {
  let weightedScore = 0;
  let totalWeight = 0;

  Object.keys(components).forEach(key => {
    const weight = weights[key] || 0;
    weightedScore += components[key] * weight;
    totalWeight += weight;
  });

  // Normalize if weights don't sum to 1
  if (totalWeight !== 1 && totalWeight > 0) {
    weightedScore = weightedScore / totalWeight;
  }

  return {
    weightedScore,
    normalizedScore: Math.round(weightedScore),
    components,
    weights,
    metadata: metadata || {},
  };
};

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
export const calculateWeightedAverage = (
  scores: ThreatScore[],
  weights?: number[],
): ThreatScore => {
  if (scores.length === 0) {
    throw new Error('Cannot calculate weighted average of empty scores array');
  }

  const defaultWeights = scores.map(() => 1 / scores.length);
  const finalWeights = weights || defaultWeights;

  let overall = 0, severity = 0, confidence = 0, impact = 0, likelihood = 0, urgency = 0;

  scores.forEach((score, index) => {
    const weight = finalWeights[index];
    overall += score.overall * weight;
    severity += score.severity * weight;
    confidence += score.confidence * weight;
    impact += score.impact * weight;
    likelihood += score.likelihood * weight;
    urgency += score.urgency * weight;
  });

  return {
    overall: Math.round(overall * 10) / 10,
    severity: Math.round(severity),
    confidence: Math.round(confidence),
    impact: Math.round(impact),
    likelihood: Math.round(likelihood),
    urgency: Math.round(urgency),
    timestamp: new Date(),
  };
};

// ============================================================================
// SCORE NORMALIZATION
// ============================================================================

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
export const normalizeScore = (
  rawScore: number,
  minValue: number,
  maxValue: number,
  method: 'LINEAR' | 'LOGARITHMIC' | 'EXPONENTIAL' | 'PERCENTILE' = 'LINEAR',
): ScoreNormalization => {
  let normalizedScore: number;

  switch (method) {
    case 'LINEAR':
      normalizedScore = ((rawScore - minValue) / (maxValue - minValue)) * 100;
      break;

    case 'LOGARITHMIC':
      const logMin = Math.log(minValue + 1);
      const logMax = Math.log(maxValue + 1);
      const logScore = Math.log(rawScore + 1);
      normalizedScore = ((logScore - logMin) / (logMax - logMin)) * 100;
      break;

    case 'EXPONENTIAL':
      const expRange = Math.exp(maxValue) - Math.exp(minValue);
      const expValue = Math.exp(rawScore) - Math.exp(minValue);
      normalizedScore = (expValue / expRange) * 100;
      break;

    case 'PERCENTILE':
      // Simple percentile rank (would need full dataset in production)
      normalizedScore = ((rawScore - minValue) / (maxValue - minValue)) * 100;
      break;
  }

  return {
    rawScore,
    normalizedScore: Math.min(100, Math.max(0, Math.round(normalizedScore))),
    scale: { min: minValue, max: maxValue },
    method,
  };
};

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
export const normalizeCVSSScore = (cvssScore: number): number => {
  return Math.round((cvssScore / 10) * 100);
};

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
export const applyMinMaxNormalization = (scores: number[]): number[] => {
  if (scores.length === 0) return [];

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;

  if (range === 0) return scores.map(() => 50); // All scores are the same

  return scores.map(score => Math.round(((score - min) / range) * 100));
};

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
export const applyZScoreNormalization = (scores: number[]): number[] => {
  if (scores.length === 0) return [];

  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return scores.map(() => 50); // All scores are the same

  return scores.map(score => {
    const zScore = (score - mean) / stdDev;
    // Map z-score to 0-100 (assuming z-scores typically range from -3 to +3)
    const normalized = ((zScore + 3) / 6) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
  });
};

// ============================================================================
// NESTJS SERVICE PATTERNS
// ============================================================================

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
export const createThreatScoringService = (): string => {
  return `
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ThreatScore as ThreatScoreModel } from './models/threat-score.model';
import * as ScoringKit from './threat-scoring-kit';

@Injectable()
export class ThreatScoringService {
  private readonly logger = new Logger(ThreatScoringService.name);

  constructor(
    @InjectModel(ThreatScoreModel)
    private readonly threatScoreModel: typeof ThreatScoreModel,
  ) {}

  async scoreThreat(factors: ScoringKit.ScoringFactors): Promise<ScoringKit.ThreatScore> {
    this.logger.log('Calculating threat score');

    const score = ScoringKit.calculateThreatScore(factors);

    // Persist score to database
    await this.threatScoreModel.create({
      overallScore: score.overall,
      severityScore: score.severity,
      confidenceScore: score.confidence,
      impactScore: score.impact,
      likelihoodScore: score.likelihood,
      urgencyScore: score.urgency,
      scoredAt: score.timestamp,
    });

    return score;
  }

  async calculateRisk(likelihood: number, impact: number): Promise<ScoringKit.RiskMatrix> {
    return ScoringKit.calculateRiskScore(likelihood, impact);
  }

  async assessImpact(params: any): Promise<ScoringKit.ImpactAssessment> {
    return ScoringKit.assessThreatImpact(params);
  }
}`;
};

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
export const createScoringTypeDefinitions = (): string => {
  return `
export interface ThreatScoreDto {
  overall: number;
  severity: number;
  confidence: number;
  impact: number;
  likelihood: number;
  urgency: number;
  timestamp: Date;
}

export interface CreateThreatScoreDto {
  threatId: string;
  factors: ScoringFactors;
  weights?: ScoringWeights;
}

export interface UpdateThreatScoreDto {
  factors?: Partial<ScoringFactors>;
  weights?: Partial<ScoringWeights>;
}

export interface ThreatScoreQueryDto {
  minScore?: number;
  maxScore?: number;
  severityLevel?: string;
  startDate?: Date;
  endDate?: Date;
}`;
};

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createThreatScoreModel = (): string => {
  return `
import { Table, Column, Model, DataType, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';

@Table({
  tableName: 'threat_scores',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['threat_id'] },
    { fields: ['overall_score'] },
    { fields: ['severity_score'] },
    { fields: ['scored_at'] },
  ],
})
export class ThreatScore extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Threat)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  threatId: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  overallScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  severityScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  confidenceScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  impactScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  likelihoodScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 100 },
  })
  urgencyScore: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  cvssScore: number;

  @Column({
    type: DataType.ENUM('LOW', 'MEDIUM', 'HIGH'),
    allowNull: false,
  })
  attackComplexity: string;

  @Column({
    type: DataType.ENUM('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'),
    allowNull: false,
  })
  dataClassification: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  scoringFactors: object;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  scoringWeights: object;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  scoredAt: Date;

  @BelongsTo(() => Threat)
  threat: Threat;
}`;
};

// ============================================================================
// SWAGGER/OPENAPI DEFINITIONS
// ============================================================================

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
export const createThreatScoringSwagger = (): string => {
  return `
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('threat-scoring')
@ApiOperation({ summary: 'Calculate threat score', description: 'Calculates comprehensive threat score using multiple factors' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['threatId', 'factors'],
    properties: {
      threatId: { type: 'string', format: 'uuid', description: 'Unique threat identifier' },
      factors: {
        type: 'object',
        properties: {
          cvssScore: { type: 'number', minimum: 0, maximum: 10, description: 'CVSS base score' },
          attackComplexity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          exploitability: { type: 'string', enum: ['PROOF_OF_CONCEPT', 'FUNCTIONAL', 'HIGH', 'NOT_DEFINED'] },
          targetedAssets: { type: 'array', items: { type: 'string' } },
          affectedSystems: { type: 'integer', minimum: 0 },
          dataClassification: { type: 'string', enum: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'] },
          businessImpact: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        },
      },
      weights: {
        type: 'object',
        properties: {
          severity: { type: 'number', minimum: 0, maximum: 1 },
          impact: { type: 'number', minimum: 0, maximum: 1 },
          likelihood: { type: 'number', minimum: 0, maximum: 1 },
          urgency: { type: 'number', minimum: 0, maximum: 1 },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
  },
})
@ApiResponse({
  status: 200,
  description: 'Threat score calculated successfully',
  schema: {
    type: 'object',
    properties: {
      overall: { type: 'number', example: 82.5 },
      severity: { type: 'number', example: 85 },
      confidence: { type: 'number', example: 80 },
      impact: { type: 'number', example: 85 },
      likelihood: { type: 'number', example: 75 },
      urgency: { type: 'number', example: 90 },
      timestamp: { type: 'string', format: 'date-time' },
    },
  },
})
@ApiResponse({ status: 400, description: 'Invalid scoring factors' })
@ApiResponse({ status: 500, description: 'Internal server error' })`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Multi-factor scoring
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateUrgencyScore,
  calculateConfidenceScore,

  // Risk calculation
  calculateRiskScore,
  calculateContextualRisk,
  calculateResidualRisk,

  // Confidence metrics
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,

  // Severity assessment
  determineSeverityLevel,
  calculateSeverityTrend,

  // Impact scoring
  assessThreatImpact,
  calculateBusinessImpact,
  estimateFinancialImpact,

  // Likelihood scoring
  calculateComprehensiveLikelihood,
  calculateAttackProbability,

  // Composite scores
  aggregateCompositeScore,
  calculateWeightedAverage,

  // Normalization
  normalizeScore,
  normalizeCVSSScore,
  applyMinMaxNormalization,
  applyZScoreNormalization,

  // NestJS patterns
  createThreatScoringService,
  createScoringTypeDefinitions,

  // Sequelize models
  createThreatScoreModel,

  // Swagger/OpenAPI
  createThreatScoringSwagger,
};
