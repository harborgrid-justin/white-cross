/**
 * LOC: THREATRISK1234567
 * File: /reuse/threat/composites/threat-risk-scoring-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-scoring-kit
 *   - ../threat-prioritization-kit
 *   - ../risk-analysis-kit
 *   - ../threat-assessment-kit
 *   - ../threat-prediction-forecasting-kit
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Risk management services
 *   - Threat prioritization modules
 *   - Security operations centers (SOC)
 *   - Executive dashboards
 *   - Compliance reporting systems
 */

/**
 * File: /reuse/threat/composites/threat-risk-scoring-composite.ts
 * Locator: WC-THREAT-RISK-SCORING-COMPOSITE-001
 * Purpose: Comprehensive Threat Risk Scoring Composite - Risk quantification, prioritization, and impact assessment
 *
 * Upstream: Composes functions from threat-scoring-kit, threat-prioritization-kit, risk-analysis-kit,
 *           threat-assessment-kit, threat-prediction-forecasting-kit
 * Downstream: ../backend/*, Risk management, SOC operations, Executive reporting, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45+ utility functions for risk scoring, prioritization, impact assessment, vulnerability analysis
 *
 * LLM Context: Enterprise-grade threat risk scoring composite for White Cross healthcare platform.
 * Provides comprehensive risk quantification, threat prioritization algorithms, impact assessment,
 * vulnerability scoring, business impact analysis, risk appetite management, treatment planning, and
 * HIPAA-compliant risk analytics for healthcare systems. Includes Sequelize models for risk scores,
 * priority queues, vulnerability assessments, and risk registers.
 */

// ============================================================================
// IMPORTS - Composed from existing threat intelligence kits
// ============================================================================

import {
  // Scoring Functions
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateUrgencyScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,
  calculateResidualRisk,

  // Confidence & Reliability
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,

  // Severity & Impact Assessment
  determineSeverityLevel,
  calculateSeverityTrend,
  assessThreatImpact,
  calculateBusinessImpact,
  estimateFinancialImpact,

  // Likelihood Calculation
  calculateComprehensiveLikelihood,
  calculateAttackProbability,

  // Aggregation & Normalization
  aggregateCompositeScore,
  calculateWeightedAverage,
  normalizeScore,
  normalizeCVSSScore,
  applyMinMaxNormalization,
  applyZScoreNormalization,
} from '../threat-scoring-kit';

import {
  // Priority Queue Management
  createPriorityQueue,
  enqueueThreat,
  dequeueThreat,
  rebalancePriorityQueue,
  getNextThreat,
  calculateQueueStatistics,

  // Business Context Prioritization
  adjustPriorityForBusinessContext,
  calculateStakeholderPriority,
  isInCriticalBusinessPeriod,

  // Asset-Based Prioritization
  calculateAssetPriorityMultiplier,
  calculateDependencyImpact,
  calculateAssetBasedPriority,

  // Time-Based Prioritization
  calculateTimeUrgency,
  adjustPriorityForTimeWindow,
  calculateAgingDecay,

  // SLA Management
  calculateSLAStatus,
  determinePriorityLevel,
  calculateSLADueDate,
  requiresSLAEscalation,

  // Triage & Escalation
  evaluateTriageRule,
  applyTriageRules,
  createAutoAssignmentRule,
  shouldEscalateThreat,
  calculateEscalationLevel,
  executeEscalationPolicy,

  // Comprehensive Prioritization
  calculateComprehensivePriority,
} from '../threat-prioritization-kit';

import {
  // Risk Scoring & Analysis
  calculateRiskScore as calculateRiskScoreAdvanced,
  prioritizeRisks,
  calculateRiskVelocity,
  aggregateRiskScoresByCategory,
  generateRiskScoringReport,

  // Vulnerability Assessment
  assessVulnerability,
  calculateCVSS,
  scanAssetsForVulnerabilities,
  prioritizeVulnerabilities,
  generateVulnerabilityRemediationPlan,

  // Risk Heat Maps
  generateRiskHeatMap,
  visualizeRiskMatrix,
  generateDepartmentRiskHeatMap,
  compareHeatMapsOverTime,
  exportHeatMap,

  // Business Impact Analysis
  conductBusinessImpactAnalysis,
  calculateRecoveryObjectives,
  evaluateFinancialImpact as evaluateFinancialImpactAdvanced,
  identifyCriticalProcesses,
  generateBIASummary,

  // Risk Appetite Management
  configureRiskAppetite,
  validateRiskAgainstAppetite,
  getRiskAppetiteStatement,
  updateRiskToleranceLevels,
  generateAppetiteComplianceReport,

  // Risk Acceptance
  createRiskAcceptance,
  reviewRiskAcceptance,
  revokeRiskAcceptance,
  getAcceptedRisks,
  notifyAcceptanceExpiry,

  // Risk Register Management
  createRiskRegisterEntry,
  updateRiskRegisterEntry,
  searchRiskRegister,
  exportRiskRegister,
  archiveClosedRisks,

  // Risk Treatment Planning
  developRiskTreatmentPlan,
  trackTreatmentProgress,
  calculateTreatmentEffectiveness,
  optimizeTreatmentCosts,
  approveTreatmentPlan,

  // Risk Monitoring & Reporting
  monitorRiskIndicators,
  generateRiskDashboard,
  createRiskAlert,
  generateExecutiveRiskReport,

  // Third-Party Risk
  assessThirdPartyRisk,
} from '../risk-analysis-kit';

import {
  // Threat Identification & Classification
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,
  updateThreatClassification,
  getThreatClassificationHistory,

  // Threat Actor Profiling
  profileThreatActor,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,
  compareThreatActors,

  // Attack Vector Analysis
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,
  generateAttackVectorHeatMap,

  // Severity & Impact Scoring
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,
  prioritizeThreats,
  reevaluateThreatSeverity,

  // Threat Correlation & Patterns
  correlateThreats,
  detectThreatPatterns,
  linkThreatsToCampaign,
  analyzeThreatClustering,
  generateThreatCorrelationGraph,

  // Threat Landscape Analysis
  analyzeThreatLandscape,
  identifyEmergingThreats,
  generateThreatTrendAnalysis,
  compareThreatLandscapeByRegion,
  generateThreatForecast,

  // Threat Intelligence Management
  enrichThreatIntelligence,
  manageIndicatorOfCompromise,
  queryThreatIntelligenceFeeds,
  validateThreatIntelligence,
  shareThreatIntelligence,
  validateThreatData,
} from '../threat-assessment-kit';

import {
  // Additional Risk Scoring
  generateComprehensiveRiskScore,
  calculateThreatVelocity,
} from '../threat-prediction-forecasting-kit';

// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES - Risk Scoring Models
// ============================================================================

/**
 * Comprehensive risk score model for storing calculated risk assessments.
 * Tracks risk scores across multiple dimensions with full audit trail.
 *
 * @example
 * ```typescript
 * class ThreatRiskScore extends Model {}
 * ThreatRiskScore.init(getThreatRiskScoreModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_risk_scores',
 *   timestamps: true,
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['threatId', 'calculatedAt'] },
 *     { fields: ['riskLevel', 'status'] },
 *     { fields: ['assetId', 'businessUnit'] },
 *     { fields: ['compositeScore', 'priorityScore'] }
 *   ]
 * });
 * ```
 */
export const getThreatRiskScoreModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  scoreId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    comment: 'Unique risk score identifier',
  },
  threatId: {
    type: 'UUID',
    allowNull: false,
    comment: 'Reference to threat',
  },
  assetId: {
    type: 'UUID',
    allowNull: true,
    comment: 'Reference to affected asset',
  },
  businessUnit: {
    type: 'STRING',
    allowNull: true,
    comment: 'Business unit affected',
  },
  calculatedAt: {
    type: 'DATE',
    allowNull: false,
  },
  calculationMethod: {
    type: 'STRING',
    allowNull: false,
    comment: 'Method: QUANTITATIVE, QUALITATIVE, HYBRID, ML_BASED',
  },
  // Core Risk Components
  likelihood: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
    comment: 'Likelihood score (0.0-1.0)',
  },
  impact: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
    comment: 'Impact score (0-10)',
  },
  severity: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
    comment: 'Severity score (0-10)',
  },
  urgency: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
    comment: 'Urgency score (0-10)',
  },
  confidence: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 1.0,
    },
    comment: 'Confidence in assessment (0.0-1.0)',
  },
  // Composite Scores
  compositeScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 100.0,
    },
    comment: 'Overall composite risk score (0-100)',
  },
  priorityScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 100.0,
    },
    comment: 'Priority score for ordering (0-100)',
  },
  cvssScore: {
    type: 'FLOAT',
    allowNull: true,
    validate: {
      min: 0.0,
      max: 10.0,
    },
    comment: 'CVSS score if applicable',
  },
  cvssVector: {
    type: 'STRING',
    allowNull: true,
    comment: 'CVSS vector string',
  },
  // Risk Classification
  riskLevel: {
    type: 'STRING',
    allowNull: false,
    comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW, MINIMAL',
  },
  riskCategory: {
    type: 'STRING',
    allowNull: false,
    comment: 'Category: OPERATIONAL, FINANCIAL, REPUTATIONAL, COMPLIANCE, STRATEGIC',
  },
  riskType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: TECHNICAL, PROCESS, PEOPLE, EXTERNAL',
  },
  // Business Impact
  businessImpact: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Business impact assessment',
  },
  financialImpact: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Financial impact estimates',
  },
  operationalImpact: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Operational impact details',
  },
  complianceImpact: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Regulatory/compliance impact',
  },
  reputationalImpact: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Reputational damage estimates',
  },
  // Contextual Factors
  contextualFactors: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Environmental and situational factors',
  },
  assetCriticality: {
    type: 'FLOAT',
    allowNull: true,
    validate: {
      min: 0.0,
      max: 10.0,
    },
  },
  dataClassification: {
    type: 'STRING',
    allowNull: true,
    comment: 'Data sensitivity classification',
  },
  businessPeriodMultiplier: {
    type: 'FLOAT',
    defaultValue: 1.0,
    comment: 'Multiplier for critical business periods',
  },
  // Risk Treatment
  inherentRisk: {
    type: 'FLOAT',
    allowNull: false,
    comment: 'Risk before controls',
  },
  residualRisk: {
    type: 'FLOAT',
    allowNull: false,
    comment: 'Risk after controls',
  },
  controlEffectiveness: {
    type: 'FLOAT',
    allowNull: true,
    validate: {
      min: 0.0,
      max: 1.0,
    },
    comment: 'Effectiveness of controls (0.0-1.0)',
  },
  mitigationStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'UNMITIGATED',
    comment: 'Status: UNMITIGATED, PARTIALLY_MITIGATED, MITIGATED, ACCEPTED',
  },
  // Risk Velocity & Trends
  riskVelocity: {
    type: 'FLOAT',
    allowNull: true,
    comment: 'Rate of risk change',
  },
  trendDirection: {
    type: 'STRING',
    allowNull: true,
    comment: 'Direction: INCREASING, DECREASING, STABLE',
  },
  historicalScores: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Historical score changes',
  },
  // Validation & Confidence
  validationStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'PENDING',
    comment: 'Status: PENDING, VALIDATED, DISPUTED, OVERRIDDEN',
  },
  validatedBy: {
    type: 'UUID',
    allowNull: true,
  },
  validatedAt: {
    type: 'DATE',
    allowNull: true,
  },
  overrideReason: {
    type: 'TEXT',
    allowNull: true,
  },
  // Status & Lifecycle
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'ACTIVE',
    comment: 'Status: ACTIVE, ARCHIVED, SUPERSEDED',
  },
  expiresAt: {
    type: 'DATE',
    allowNull: true,
    comment: 'When score becomes stale',
  },
  nextReviewDate: {
    type: 'DATE',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
  deletedAt: {
    type: 'DATE',
    allowNull: true,
  },
});

/**
 * Threat priority queue model for managing prioritized threat response.
 * Implements dynamic priority queue with SLA tracking and auto-escalation.
 *
 * @example
 * ```typescript
 * class ThreatPriorityQueue extends Model {}
 * ThreatPriorityQueue.init(getThreatPriorityQueueModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_priority_queue',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['priorityScore', 'status'] },
 *     { fields: ['slaStatus', 'slaDueDate'] },
 *     { fields: ['assignedTo', 'status'] },
 *     { fields: ['queuePosition'] }
 *   ]
 * });
 * ```
 */
export const getThreatPriorityQueueModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  queueId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  threatId: {
    type: 'UUID',
    allowNull: false,
  },
  riskScoreId: {
    type: 'UUID',
    allowNull: true,
    comment: 'Reference to risk score',
  },
  enqueuedAt: {
    type: 'DATE',
    allowNull: false,
  },
  queuePosition: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Position in priority queue',
  },
  priorityScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 100.0,
    },
    comment: 'Overall priority score (0-100)',
  },
  priorityLevel: {
    type: 'STRING',
    allowNull: false,
    comment: 'Level: P0_CRITICAL, P1_HIGH, P2_MEDIUM, P3_LOW',
  },
  priorityFactors: {
    type: 'JSONB',
    defaultValue: {},
    comment: 'Factors contributing to priority',
  },
  // SLA Management
  slaStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'ON_TRACK',
    comment: 'Status: ON_TRACK, AT_RISK, BREACHED',
  },
  slaTier: {
    type: 'STRING',
    allowNull: false,
    comment: 'SLA tier: CRITICAL, HIGH, MEDIUM, LOW',
  },
  slaStartDate: {
    type: 'DATE',
    allowNull: false,
  },
  slaDueDate: {
    type: 'DATE',
    allowNull: false,
  },
  slaResponseTime: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Required response time in minutes',
  },
  slaResolutionTime: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Required resolution time in minutes',
  },
  timeInQueue: {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 0,
    comment: 'Time in queue in minutes',
  },
  timeToSLABreach: {
    type: 'INTEGER',
    allowNull: true,
    comment: 'Minutes until SLA breach',
  },
  // Assignment & Routing
  assignedTo: {
    type: 'UUID',
    allowNull: true,
    comment: 'Assigned analyst/team',
  },
  assignedTeam: {
    type: 'STRING',
    allowNull: true,
  },
  assignmentMethod: {
    type: 'STRING',
    allowNull: true,
    comment: 'Method: MANUAL, AUTO_ROUND_ROBIN, AUTO_SKILL_BASED, AUTO_LOAD_BALANCED',
  },
  assignedAt: {
    type: 'DATE',
    allowNull: true,
  },
  // Escalation
  escalationLevel: {
    type: 'INTEGER',
    defaultValue: 0,
    comment: 'Current escalation level',
  },
  escalationHistory: {
    type: 'JSONB',
    defaultValue: [],
  },
  requiresEscalation: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  nextEscalationDate: {
    type: 'DATE',
    allowNull: true,
  },
  // Status & Lifecycle
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'QUEUED',
    comment: 'Status: QUEUED, ASSIGNED, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED',
  },
  lastStatusChange: {
    type: 'DATE',
    allowNull: false,
  },
  resolution: {
    type: 'TEXT',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  resolvedBy: {
    type: 'UUID',
    allowNull: true,
  },
  resolutionTime: {
    type: 'INTEGER',
    allowNull: true,
    comment: 'Total resolution time in minutes',
  },
  // Business Context
  businessImpact: {
    type: 'STRING',
    allowNull: true,
    comment: 'Impact: CRITICAL, HIGH, MEDIUM, LOW',
  },
  affectedSystems: {
    type: 'JSONB',
    defaultValue: [],
  },
  stakeholders: {
    type: 'JSONB',
    defaultValue: [],
  },
  // Aging & Decay
  agingMultiplier: {
    type: 'FLOAT',
    defaultValue: 1.0,
    comment: 'Priority multiplier based on age',
  },
  lastRebalance: {
    type: 'DATE',
    allowNull: true,
  },
  rebalanceCount: {
    type: 'INTEGER',
    defaultValue: 0,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Vulnerability assessment model for tracking vulnerability risk scores.
 * Comprehensive vulnerability management with CVSS scoring and remediation tracking.
 *
 * @example
 * ```typescript
 * class VulnerabilityAssessment extends Model {}
 * VulnerabilityAssessment.init(getVulnerabilityAssessmentModelAttributes(), {
 *   sequelize,
 *   tableName: 'vulnerability_assessments',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['cvssScore', 'exploitability'] },
 *     { fields: ['vulnerabilityType', 'status'] },
 *     { fields: ['remediationStatus', 'priority'] }
 *   ]
 * });
 * ```
 */
export const getVulnerabilityAssessmentModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  assessmentId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  vulnerabilityId: {
    type: 'STRING',
    allowNull: false,
    comment: 'CVE ID or internal vulnerability ID',
  },
  assetId: {
    type: 'UUID',
    allowNull: false,
  },
  discoveredAt: {
    type: 'DATE',
    allowNull: false,
  },
  discoveryMethod: {
    type: 'STRING',
    allowNull: false,
    comment: 'Method: SCAN, MANUAL, INTELLIGENCE, DISCLOSURE',
  },
  vulnerabilityType: {
    type: 'STRING',
    allowNull: false,
    comment: 'Type: INJECTION, XSS, AUTHENTICATION, AUTHORIZATION, etc.',
  },
  description: {
    type: 'TEXT',
    allowNull: false,
  },
  // CVSS Scoring
  cvssScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
  },
  cvssVersion: {
    type: 'STRING',
    allowNull: false,
    comment: 'Version: 2.0, 3.0, 3.1',
  },
  cvssVector: {
    type: 'STRING',
    allowNull: false,
  },
  cvssBaseScore: {
    type: 'FLOAT',
    allowNull: false,
  },
  cvssTemporalScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  cvssEnvironmentalScore: {
    type: 'FLOAT',
    allowNull: true,
  },
  // Exploitability
  exploitability: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 10.0,
    },
  },
  attackComplexity: {
    type: 'STRING',
    allowNull: false,
    comment: 'Complexity: LOW, MEDIUM, HIGH',
  },
  attackVector: {
    type: 'STRING',
    allowNull: false,
    comment: 'Vector: NETWORK, ADJACENT, LOCAL, PHYSICAL',
  },
  privilegesRequired: {
    type: 'STRING',
    allowNull: false,
    comment: 'Privileges: NONE, LOW, HIGH',
  },
  userInteraction: {
    type: 'STRING',
    allowNull: false,
    comment: 'Interaction: NONE, REQUIRED',
  },
  exploitAvailable: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  exploitMaturity: {
    type: 'STRING',
    allowNull: true,
    comment: 'Maturity: UNPROVEN, POC, FUNCTIONAL, HIGH',
  },
  // Impact
  confidentialityImpact: {
    type: 'STRING',
    allowNull: false,
    comment: 'Impact: NONE, LOW, HIGH',
  },
  integrityImpact: {
    type: 'STRING',
    allowNull: false,
    comment: 'Impact: NONE, LOW, HIGH',
  },
  availabilityImpact: {
    type: 'STRING',
    allowNull: false,
    comment: 'Impact: NONE, LOW, HIGH',
  },
  // Risk Assessment
  riskScore: {
    type: 'FLOAT',
    allowNull: false,
    validate: {
      min: 0.0,
      max: 100.0,
    },
  },
  riskLevel: {
    type: 'STRING',
    allowNull: false,
    comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW',
  },
  priority: {
    type: 'INTEGER',
    allowNull: false,
    comment: 'Remediation priority (1=highest)',
  },
  // Remediation
  remediationStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'OPEN',
    comment: 'Status: OPEN, IN_PROGRESS, MITIGATED, RESOLVED, ACCEPTED, FALSE_POSITIVE',
  },
  remediationPlan: {
    type: 'JSONB',
    allowNull: true,
  },
  remediationDueDate: {
    type: 'DATE',
    allowNull: true,
  },
  remediationEffort: {
    type: 'STRING',
    allowNull: true,
    comment: 'Effort: TRIVIAL, MODERATE, SIGNIFICANT, EXTENSIVE',
  },
  remediationCost: {
    type: 'FLOAT',
    allowNull: true,
  },
  patchAvailable: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  patchDetails: {
    type: 'JSONB',
    allowNull: true,
  },
  workaroundAvailable: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  workaroundDetails: {
    type: 'TEXT',
    allowNull: true,
  },
  resolvedAt: {
    type: 'DATE',
    allowNull: true,
  },
  verifiedAt: {
    type: 'DATE',
    allowNull: true,
  },
  // References & Intelligence
  cveReferences: {
    type: 'JSONB',
    defaultValue: [],
  },
  cweReferences: {
    type: 'JSONB',
    defaultValue: [],
  },
  advisories: {
    type: 'JSONB',
    defaultValue: [],
  },
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'ACTIVE',
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

/**
 * Risk register model for comprehensive risk tracking and management.
 * Enterprise risk register with treatment plans and continuous monitoring.
 *
 * @example
 * ```typescript
 * class RiskRegister extends Model {}
 * RiskRegister.init(getRiskRegisterModelAttributes(), {
 *   sequelize,
 *   tableName: 'risk_register',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['riskLevel', 'status'] },
 *     { fields: ['riskCategory', 'owner'] },
 *     { fields: ['reviewDate', 'status'] }
 *   ]
 * });
 * ```
 */
export const getRiskRegisterModelAttributes = () => ({
  id: {
    type: 'UUID',
    defaultValue: 'UUIDV4',
    primaryKey: true,
  },
  registerId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
  },
  riskId: {
    type: 'STRING',
    allowNull: false,
    unique: true,
    comment: 'Business risk identifier',
  },
  riskTitle: {
    type: 'STRING',
    allowNull: false,
  },
  riskDescription: {
    type: 'TEXT',
    allowNull: false,
  },
  riskCategory: {
    type: 'STRING',
    allowNull: false,
    comment: 'Category: OPERATIONAL, FINANCIAL, STRATEGIC, COMPLIANCE, REPUTATIONAL',
  },
  riskType: {
    type: 'STRING',
    allowNull: false,
  },
  identifiedAt: {
    type: 'DATE',
    allowNull: false,
  },
  identifiedBy: {
    type: 'UUID',
    allowNull: false,
  },
  owner: {
    type: 'UUID',
    allowNull: false,
    comment: 'Risk owner responsible for management',
  },
  // Risk Scores
  inherentLikelihood: {
    type: 'FLOAT',
    allowNull: false,
  },
  inherentImpact: {
    type: 'FLOAT',
    allowNull: false,
  },
  inherentRiskScore: {
    type: 'FLOAT',
    allowNull: false,
  },
  residualLikelihood: {
    type: 'FLOAT',
    allowNull: false,
  },
  residualImpact: {
    type: 'FLOAT',
    allowNull: false,
  },
  residualRiskScore: {
    type: 'FLOAT',
    allowNull: false,
  },
  riskLevel: {
    type: 'STRING',
    allowNull: false,
    comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW',
  },
  // Risk Appetite
  riskAppetite: {
    type: 'STRING',
    allowNull: false,
    comment: 'Appetite: AVERSE, MINIMAL, CAUTIOUS, OPEN, SEEKING',
  },
  exceedsAppetite: {
    type: 'BOOLEAN',
    defaultValue: false,
  },
  // Treatment
  treatmentStrategy: {
    type: 'STRING',
    allowNull: false,
    comment: 'Strategy: AVOID, MITIGATE, TRANSFER, ACCEPT',
  },
  treatmentPlan: {
    type: 'JSONB',
    allowNull: true,
  },
  treatmentStatus: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'PLANNED',
    comment: 'Status: PLANNED, IN_PROGRESS, IMPLEMENTED, MONITORING',
  },
  treatmentCost: {
    type: 'FLOAT',
    allowNull: true,
  },
  treatmentEffectiveness: {
    type: 'FLOAT',
    allowNull: true,
  },
  controls: {
    type: 'JSONB',
    defaultValue: [],
  },
  // Monitoring
  reviewFrequency: {
    type: 'STRING',
    allowNull: false,
    comment: 'Frequency: DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY',
  },
  lastReviewDate: {
    type: 'DATE',
    allowNull: true,
  },
  nextReviewDate: {
    type: 'DATE',
    allowNull: false,
  },
  reviewHistory: {
    type: 'JSONB',
    defaultValue: [],
  },
  kris: {
    type: 'JSONB',
    defaultValue: [],
    comment: 'Key Risk Indicators',
  },
  // Status & Lifecycle
  status: {
    type: 'STRING',
    allowNull: false,
    defaultValue: 'ACTIVE',
    comment: 'Status: ACTIVE, MONITORING, CLOSED, ACCEPTED',
  },
  closedAt: {
    type: 'DATE',
    allowNull: true,
  },
  closedBy: {
    type: 'UUID',
    allowNull: true,
  },
  closureReason: {
    type: 'TEXT',
    allowNull: true,
  },
  metadata: {
    type: 'JSONB',
    defaultValue: {},
  },
  createdAt: {
    type: 'DATE',
    allowNull: false,
  },
  updatedAt: {
    type: 'DATE',
    allowNull: false,
  },
});

// ============================================================================
// RE-EXPORTED FUNCTIONS - Composed from source kits
// ============================================================================

// Scoring Functions
export {
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateUrgencyScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,
  calculateResidualRisk,
};

// Confidence & Reliability
export {
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,
};

// Severity & Impact Assessment
export {
  determineSeverityLevel,
  calculateSeverityTrend,
  assessThreatImpact,
  calculateBusinessImpact,
  estimateFinancialImpact,
};

// Likelihood Calculation
export {
  calculateComprehensiveLikelihood,
  calculateAttackProbability,
};

// Aggregation & Normalization
export {
  aggregateCompositeScore,
  calculateWeightedAverage,
  normalizeScore,
  normalizeCVSSScore,
  applyMinMaxNormalization,
  applyZScoreNormalization,
};

// Priority Queue Management
export {
  createPriorityQueue,
  enqueueThreat,
  dequeueThreat,
  rebalancePriorityQueue,
  getNextThreat,
  calculateQueueStatistics,
};

// Business Context Prioritization
export {
  adjustPriorityForBusinessContext,
  calculateStakeholderPriority,
  isInCriticalBusinessPeriod,
};

// Asset-Based Prioritization
export {
  calculateAssetPriorityMultiplier,
  calculateDependencyImpact,
  calculateAssetBasedPriority,
};

// Time-Based Prioritization
export {
  calculateTimeUrgency,
  adjustPriorityForTimeWindow,
  calculateAgingDecay,
};

// SLA Management
export {
  calculateSLAStatus,
  determinePriorityLevel,
  calculateSLADueDate,
  requiresSLAEscalation,
};

// Triage & Escalation
export {
  evaluateTriageRule,
  applyTriageRules,
  createAutoAssignmentRule,
  shouldEscalateThreat,
  calculateEscalationLevel,
  executeEscalationPolicy,
};

// Comprehensive Prioritization
export {
  calculateComprehensivePriority,
};

// Risk Scoring & Analysis
export {
  calculateRiskScoreAdvanced,
  prioritizeRisks,
  calculateRiskVelocity,
  aggregateRiskScoresByCategory,
  generateRiskScoringReport,
};

// Vulnerability Assessment
export {
  assessVulnerability,
  calculateCVSS,
  scanAssetsForVulnerabilities,
  prioritizeVulnerabilities,
  generateVulnerabilityRemediationPlan,
};

// Risk Heat Maps
export {
  generateRiskHeatMap,
  visualizeRiskMatrix,
  generateDepartmentRiskHeatMap,
  compareHeatMapsOverTime,
  exportHeatMap,
};

// Business Impact Analysis
export {
  conductBusinessImpactAnalysis,
  calculateRecoveryObjectives,
  evaluateFinancialImpactAdvanced,
  identifyCriticalProcesses,
  generateBIASummary,
};

// Risk Appetite Management
export {
  configureRiskAppetite,
  validateRiskAgainstAppetite,
  getRiskAppetiteStatement,
  updateRiskToleranceLevels,
  generateAppetiteComplianceReport,
};

// Risk Acceptance
export {
  createRiskAcceptance,
  reviewRiskAcceptance,
  revokeRiskAcceptance,
  getAcceptedRisks,
  notifyAcceptanceExpiry,
};

// Risk Register Management
export {
  createRiskRegisterEntry,
  updateRiskRegisterEntry,
  searchRiskRegister,
  exportRiskRegister,
  archiveClosedRisks,
};

// Risk Treatment Planning
export {
  developRiskTreatmentPlan,
  trackTreatmentProgress,
  calculateTreatmentEffectiveness,
  optimizeTreatmentCosts,
  approveTreatmentPlan,
};

// Risk Monitoring & Reporting
export {
  monitorRiskIndicators,
  generateRiskDashboard,
  createRiskAlert,
  generateExecutiveRiskReport,
};

// Third-Party Risk
export {
  assessThirdPartyRisk,
};

// Threat Identification & Classification
export {
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,
  updateThreatClassification,
  getThreatClassificationHistory,
};

// Threat Actor Profiling
export {
  profileThreatActor,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,
  compareThreatActors,
};

// Attack Vector Analysis
export {
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,
  generateAttackVectorHeatMap,
};

// Threat Severity & Impact Scoring
export {
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,
  prioritizeThreats,
  reevaluateThreatSeverity,
};

// Threat Correlation & Patterns
export {
  correlateThreats,
  detectThreatPatterns,
  linkThreatsToCampaign,
  analyzeThreatClustering,
  generateThreatCorrelationGraph,
};

// Threat Landscape Analysis
export {
  analyzeThreatLandscape,
  identifyEmergingThreats,
  generateThreatTrendAnalysis,
  compareThreatLandscapeByRegion,
  generateThreatForecast,
};

// Threat Intelligence Management
export {
  enrichThreatIntelligence,
  manageIndicatorOfCompromise,
  queryThreatIntelligenceFeeds,
  validateThreatIntelligence,
  shareThreatIntelligence,
  validateThreatData,
};

// Additional Risk Scoring from Prediction Kit
export {
  generateComprehensiveRiskScore,
  calculateThreatVelocity,
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Sequelize Models
  getThreatRiskScoreModelAttributes,
  getThreatPriorityQueueModelAttributes,
  getVulnerabilityAssessmentModelAttributes,
  getRiskRegisterModelAttributes,

  // Scoring Functions (9)
  calculateThreatScore,
  calculateSeverityScore,
  calculateImpactScore,
  calculateLikelihoodScore,
  calculateUrgencyScore,
  calculateConfidenceScore,
  calculateRiskScore,
  calculateContextualRisk,
  calculateResidualRisk,

  // Confidence & Reliability (3)
  computeConfidenceMetrics,
  calculateSourceReliability,
  aggregateIndicatorConfidence,

  // Severity & Impact Assessment (5)
  determineSeverityLevel,
  calculateSeverityTrend,
  assessThreatImpact,
  calculateBusinessImpact,
  estimateFinancialImpact,

  // Likelihood Calculation (2)
  calculateComprehensiveLikelihood,
  calculateAttackProbability,

  // Aggregation & Normalization (6)
  aggregateCompositeScore,
  calculateWeightedAverage,
  normalizeScore,
  normalizeCVSSScore,
  applyMinMaxNormalization,
  applyZScoreNormalization,

  // Priority Queue Management (6)
  createPriorityQueue,
  enqueueThreat,
  dequeueThreat,
  rebalancePriorityQueue,
  getNextThreat,
  calculateQueueStatistics,

  // Business Context Prioritization (3)
  adjustPriorityForBusinessContext,
  calculateStakeholderPriority,
  isInCriticalBusinessPeriod,

  // Asset-Based Prioritization (3)
  calculateAssetPriorityMultiplier,
  calculateDependencyImpact,
  calculateAssetBasedPriority,

  // Time-Based Prioritization (3)
  calculateTimeUrgency,
  adjustPriorityForTimeWindow,
  calculateAgingDecay,

  // SLA Management (4)
  calculateSLAStatus,
  determinePriorityLevel,
  calculateSLADueDate,
  requiresSLAEscalation,

  // Triage & Escalation (6)
  evaluateTriageRule,
  applyTriageRules,
  createAutoAssignmentRule,
  shouldEscalateThreat,
  calculateEscalationLevel,
  executeEscalationPolicy,

  // Comprehensive Prioritization (1)
  calculateComprehensivePriority,

  // Risk Scoring & Analysis (5)
  calculateRiskScoreAdvanced,
  prioritizeRisks,
  calculateRiskVelocity,
  aggregateRiskScoresByCategory,
  generateRiskScoringReport,

  // Vulnerability Assessment (5)
  assessVulnerability,
  calculateCVSS,
  scanAssetsForVulnerabilities,
  prioritizeVulnerabilities,
  generateVulnerabilityRemediationPlan,

  // Risk Heat Maps (5)
  generateRiskHeatMap,
  visualizeRiskMatrix,
  generateDepartmentRiskHeatMap,
  compareHeatMapsOverTime,
  exportHeatMap,

  // Business Impact Analysis (5)
  conductBusinessImpactAnalysis,
  calculateRecoveryObjectives,
  evaluateFinancialImpactAdvanced,
  identifyCriticalProcesses,
  generateBIASummary,

  // Risk Appetite Management (5)
  configureRiskAppetite,
  validateRiskAgainstAppetite,
  getRiskAppetiteStatement,
  updateRiskToleranceLevels,
  generateAppetiteComplianceReport,

  // Risk Acceptance (5)
  createRiskAcceptance,
  reviewRiskAcceptance,
  revokeRiskAcceptance,
  getAcceptedRisks,
  notifyAcceptanceExpiry,

  // Risk Register Management (5)
  createRiskRegisterEntry,
  updateRiskRegisterEntry,
  searchRiskRegister,
  exportRiskRegister,
  archiveClosedRisks,

  // Risk Treatment Planning (5)
  developRiskTreatmentPlan,
  trackTreatmentProgress,
  calculateTreatmentEffectiveness,
  optimizeTreatmentCosts,
  approveTreatmentPlan,

  // Risk Monitoring & Reporting (4)
  monitorRiskIndicators,
  generateRiskDashboard,
  createRiskAlert,
  generateExecutiveRiskReport,

  // Third-Party Risk (1)
  assessThirdPartyRisk,

  // Threat Identification & Classification (5)
  identifyThreat,
  classifyThreat,
  categorizeThreatByFramework,
  updateThreatClassification,
  getThreatClassificationHistory,

  // Threat Actor Profiling (5)
  profileThreatActor,
  analyzeThreatActorMotivation,
  attributeThreatToActor,
  getThreatActorCapabilities,
  compareThreatActors,

  // Attack Vector Analysis (5)
  analyzeAttackVector,
  mapAttackPath,
  identifyEntryPoints,
  analyzeAttackTechniques,
  generateAttackVectorHeatMap,

  // Threat Severity & Impact Scoring (5)
  calculateThreatSeverityScore,
  evaluateThreatImpact,
  calculateExploitabilityScore,
  prioritizeThreats,
  reevaluateThreatSeverity,

  // Threat Correlation & Patterns (5)
  correlateThreats,
  detectThreatPatterns,
  linkThreatsToCampaign,
  analyzeThreatClustering,
  generateThreatCorrelationGraph,

  // Threat Landscape Analysis (5)
  analyzeThreatLandscape,
  identifyEmergingThreats,
  generateThreatTrendAnalysis,
  compareThreatLandscapeByRegion,
  generateThreatForecast,

  // Threat Intelligence Management (6)
  enrichThreatIntelligence,
  manageIndicatorOfCompromise,
  queryThreatIntelligenceFeeds,
  validateThreatIntelligence,
  shareThreatIntelligence,
  validateThreatData,

  // Additional Risk Scoring from Prediction Kit (2)
  generateComprehensiveRiskScore,
  calculateThreatVelocity,
};
