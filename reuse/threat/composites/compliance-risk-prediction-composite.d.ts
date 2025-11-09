/**
 * LOC: CMPLRSKPRD001
 * File: /reuse/threat/composites/compliance-risk-prediction-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../compliance-monitoring-kit
 *   - ../risk-analysis-kit
 *   - ../security-policy-enforcement-kit
 *   - sequelize
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Compliance prediction services
 *   - Risk forecasting modules
 *   - Regulatory monitoring controllers
 *   - Policy enforcement automation
 *   - Audit management systems
 */
/**
 * File: /reuse/threat/composites/compliance-risk-prediction-composite.ts
 * Locator: WC-COMPLIANCE-RISK-COMPOSITE-001
 * Purpose: Enterprise Compliance Risk Prediction Composite - ML-powered compliance forecasting and regulatory monitoring
 *
 * Upstream: Composes functions from compliance-monitoring-kit, risk-analysis-kit, security-policy-enforcement-kit
 * Downstream: ../backend/*, Compliance services, Risk prediction engines, Regulatory dashboards
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 composite functions for compliance risk prediction, regulatory monitoring, policy enforcement automation
 *
 * LLM Context: Enterprise-grade compliance risk prediction composite for White Cross healthcare platform.
 * Provides comprehensive compliance risk forecasting using ML models, regulatory requirement monitoring with
 * automated tracking, policy enforcement automation with real-time validation, control effectiveness prediction,
 * audit preparation automation, compliance gap forecasting, remediation planning with AI recommendations,
 * regulatory change impact analysis, certification readiness scoring, and HIPAA/SOC2/ISO27001 compliance
 * prediction. Competes with enterprise GRC platforms like ServiceNow GRC, RSA Archer, and MetricStream.
 *
 * Key Capabilities:
 * - Predictive compliance risk scoring with ML models
 * - Automated regulatory requirement tracking and monitoring
 * - Real-time policy enforcement and violation detection
 * - Control effectiveness forecasting and optimization
 * - Audit preparation automation with gap analysis
 * - Compliance trend analysis and forecasting
 * - Remediation planning with prioritization
 * - Regulatory change impact prediction
 * - Certification readiness assessment
 * - Executive compliance dashboards and reporting
 */
import { Sequelize, Transaction } from 'sequelize';
import { type ComplianceGap } from '../compliance-monitoring-kit';
import { type RiskHeatMap } from '../risk-analysis-kit';
import { type PolicyViolation, type PolicyException } from '../security-policy-enforcement-kit';
/**
 * Compliance risk prediction result
 */
export interface ComplianceRiskPrediction {
    frameworkId: string;
    frameworkName: string;
    predictionDate: Date;
    forecastPeriod: number;
    currentRiskScore: number;
    predictedRiskScore: number;
    riskTrend: 'improving' | 'stable' | 'worsening';
    confidenceLevel: number;
    contributingFactors: RiskFactor[];
    recommendations: string[];
    urgentActions: string[];
    nextReviewDate: Date;
}
/**
 * Risk factor contributing to compliance risk
 */
export interface RiskFactor {
    factorName: string;
    category: 'control' | 'audit' | 'gap' | 'policy' | 'external';
    impact: number;
    likelihood: number;
    description: string;
    mitigation?: string;
}
/**
 * Regulatory monitoring alert
 */
export interface RegulatoryAlert {
    alertId: string;
    regulatoryBody: string;
    requirementId: string;
    alertType: 'new_regulation' | 'update' | 'deadline' | 'non_compliance' | 'certification_expiry';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    impactedFrameworks: string[];
    impactedControls: string[];
    deadline?: Date;
    actionRequired: string[];
    assignedTo?: string;
    status: 'new' | 'acknowledged' | 'in_progress' | 'resolved';
    createdAt: Date;
}
/**
 * Policy enforcement result
 */
export interface PolicyEnforcementResult {
    policyId: string;
    policyName: string;
    enforcementDate: Date;
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    complianceRate: number;
    violations: PolicyViolation[];
    exceptions: PolicyException[];
    recommendations: string[];
    nextEnforcement: Date;
}
/**
 * Control effectiveness forecast
 */
export interface ControlEffectivenessForecast {
    controlId: string;
    controlName: string;
    currentEffectiveness: number;
    predictedEffectiveness: number;
    forecastPeriod: number;
    degradationRate: number;
    testingRequired: boolean;
    nextTestDate?: Date;
    recommendations: string[];
}
/**
 * Audit preparation checklist
 */
export interface AuditPreparationChecklist {
    auditId: string;
    auditName: string;
    auditDate: Date;
    daysUntilAudit: number;
    readinessScore: number;
    preparationItems: PreparationItem[];
    evidenceGaps: string[];
    controlGaps: string[];
    documentationGaps: string[];
    urgentTasks: string[];
    assignedTeam: string[];
    status: 'not_started' | 'in_progress' | 'review' | 'ready';
}
/**
 * Preparation item for audit
 */
export interface PreparationItem {
    itemId: string;
    category: 'evidence' | 'control' | 'documentation' | 'training' | 'remediation';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    completed: boolean;
    dueDate: Date;
    assignedTo: string;
    dependencies: string[];
}
/**
 * Compliance gap forecast
 */
export interface ComplianceGapForecast {
    frameworkId: string;
    forecastDate: Date;
    currentGaps: number;
    predictedGaps: number;
    emergingGaps: ComplianceGap[];
    closingGaps: ComplianceGap[];
    gapTrend: 'improving' | 'stable' | 'worsening';
    remediationPriority: string[];
    estimatedEffort: string;
    estimatedCost?: number;
}
/**
 * Certification readiness score
 */
export interface CertificationReadiness {
    certificationId: string;
    certificationType: string;
    frameworkId: string;
    assessmentDate: Date;
    readinessScore: number;
    readinessLevel: 'not_ready' | 'partially_ready' | 'mostly_ready' | 'ready';
    completedControls: number;
    totalControls: number;
    gaps: ComplianceGap[];
    evidenceCollected: number;
    evidenceRequired: number;
    estimatedDaysToReady: number;
    certificationDate?: Date;
}
/**
 * Regulatory change impact analysis
 */
export interface RegulatoryChangeImpact {
    changeId: string;
    regulatoryBody: string;
    changeType: 'new_law' | 'amendment' | 'repeal' | 'guideline' | 'interpretation';
    effectiveDate: Date;
    title: string;
    description: string;
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    impactedFrameworks: string[];
    impactedControls: string[];
    requiredChanges: string[];
    estimatedEffort: string;
    estimatedCost?: number;
    implementationPlan?: string;
    complianceDeadline?: Date;
}
/**
 * Predicts compliance risk for a framework using ML-powered analysis
 * Composes: calculateRiskScore, calculateFrameworkMaturity, getControlEffectivenessRate, calculateRiskVelocity
 */
export declare const predictComplianceRisk: (sequelize: Sequelize, frameworkId: string, forecastDays?: number, transaction?: Transaction) => Promise<ComplianceRiskPrediction>;
/**
 * Monitors regulatory requirements and generates alerts
 * Composes: auditSchema validation, searchRiskRegister, createRiskAlert
 */
export declare const monitorRegulatoryRequirements: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<RegulatoryAlert[]>;
/**
 * Enforces security policies across the organization
 * Composes: validateAgainstPolicy, scheduleAutomatedCheck, validateSecurityBaseline
 */
export declare const enforceSecurityPolicies: (sequelize: Sequelize, policyId: string, targetAssets: string[], transaction?: Transaction) => Promise<PolicyEnforcementResult>;
/**
 * Forecasts control effectiveness over time
 * Composes: getControlEffectivenessRate, calculateNextTestDate, prioritizeRisks
 */
export declare const forecastControlEffectiveness: (sequelize: Sequelize, controlId: string, forecastDays?: number, transaction?: Transaction) => Promise<ControlEffectivenessForecast>;
/**
 * Automates audit preparation with intelligent checklist generation
 * Composes: auditSchema, complianceGapSchema, generateRiskScoringReport
 */
export declare const automateAuditPreparation: (sequelize: Sequelize, auditId: string, transaction?: Transaction) => Promise<AuditPreparationChecklist>;
/**
 * Forecasts compliance gaps using trend analysis
 * Composes: complianceGapSchema, calculateRiskVelocity, prioritizeRisks
 */
export declare const forecastComplianceGaps: (sequelize: Sequelize, frameworkId: string, forecastDays?: number, transaction?: Transaction) => Promise<ComplianceGapForecast>;
/**
 * Assesses certification readiness with detailed gap analysis
 * Composes: defineCertificationModel, calculateFrameworkMaturity, complianceGapSchema
 */
export declare const assessCertificationReadiness: (sequelize: Sequelize, certificationId: string, transaction?: Transaction) => Promise<CertificationReadiness>;
/**
 * Analyzes regulatory changes and predicts their impact
 * Composes: complianceFrameworkSchema, calculateRiskScore, evaluateFinancialImpact
 */
export declare const analyzeRegulatoryChangeImpact: (sequelize: Sequelize, changeDescription: {
    regulatoryBody: string;
    changeType: string;
    effectiveDate: Date;
    description: string;
    affectedDomains: string[];
}, transaction?: Transaction) => Promise<RegulatoryChangeImpact>;
/**
 * Generates comprehensive compliance risk dashboard
 * Composes: generateRiskHeatMap, generateRiskDashboard, aggregateRiskScoresByCategory
 */
export declare const generateComplianceRiskDashboard: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    overview: {
        totalControls: number;
        effectiveControls: number;
        failingControls: number;
        overallMaturity: number;
        complianceScore: number;
    };
    riskMetrics: {
        currentRiskScore: number;
        riskTrend: string;
        criticalGaps: number;
        highRisks: number;
    };
    upcomingEvents: {
        nextAudit?: Date;
        certificationExpiry?: Date;
        overdueItems: number;
    };
    recommendations: string[];
}>;
/**
 * Validates compliance against multiple frameworks simultaneously
 * Composes: validateAgainstPolicy, calculateFrameworkMaturity, generateRiskScoringReport
 */
export declare const validateMultiFrameworkCompliance: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<Map<string, {
    score: number;
    gaps: number;
    status: string;
}>>;
/**
 * Creates automated compliance testing workflows
 * Composes: scheduleAutomatedCheck, validateSecurityBaseline, generateConfigurationHardeningGuide
 */
export declare const createAutomatedComplianceTesting: (sequelize: Sequelize, frameworkId: string, testingSchedule: "daily" | "weekly" | "monthly", transaction?: Transaction) => Promise<{
    jobId: string;
    schedule: string;
    controlsInScope: number;
}>;
/**
 * Performs compliance trend analysis over time
 * Composes: compareHeatMapsOverTime, calculateRiskVelocity, generateRiskScoringReport
 */
export declare const analyzeComplianceTrends: (sequelize: Sequelize, frameworkId: string, periodDays?: number, transaction?: Transaction) => Promise<{
    trendDirection: "improving" | "stable" | "declining";
    scoreChange: number;
    velocity: number;
    predictions: {
        date: Date;
        predictedScore: number;
    }[];
}>;
/**
 * Generates executive compliance summary report
 * Composes: generateExecutiveRiskReport, generateBIASummary, generateRiskScoringReport
 */
export declare const generateExecutiveComplianceReport: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<{
    executiveSummary: string;
    overallCompliance: number;
    criticalIssues: number;
    frameworks: {
        id: string;
        name: string;
        score: number;
    }[];
    topRisks: string[];
    recommendations: string[];
}>;
/**
 * Optimizes compliance resource allocation
 * Composes: prioritizeRisks, optimizeTreatmentCosts, calculateRecoveryObjectives
 */
export declare const optimizeComplianceResources: (sequelize: Sequelize, frameworkId: string, budget: number, transaction?: Transaction) => Promise<{
    allocations: {
        controlId: string;
        allocatedBudget: number;
        priority: number;
    }[];
    remainingBudget: number;
    expectedImpact: number;
}>;
/**
 * Tracks compliance remediation progress
 * Composes: trackTreatmentProgress, updateRiskRegisterEntry, monitorRiskIndicators
 */
export declare const trackComplianceRemediation: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    totalGaps: number;
    remediatedGaps: number;
    inProgressGaps: number;
    overdueGaps: number;
    completionRate: number;
    averageRemediationTime: number;
}>;
/**
 * Validates policy exception requests
 * Composes: validateAgainstPolicy, createRiskAcceptance, reviewRiskAcceptance
 */
export declare const validatePolicyException: (sequelize: Sequelize, exceptionRequest: {
    policyId: string;
    resourceId: string;
    justification: string;
    expirationDate: Date;
}, transaction?: Transaction) => Promise<{
    approved: boolean;
    riskScore: number;
    conditions: string[];
    reviewRequired: boolean;
}>;
/**
 * Simulates audit scenarios for preparation
 * Composes: auditSchema, complianceControlSchema, generateRiskScoringReport
 */
export declare const simulateAuditScenario: (sequelize: Sequelize, frameworkId: string, auditType: "internal" | "external" | "certification", transaction?: Transaction) => Promise<{
    simulationId: string;
    likelyFindings: string[];
    preparednessScore: number;
    areasOfConcern: string[];
    strengths: string[];
    recommendations: string[];
}>;
/**
 * Benchmarks compliance performance against industry standards
 * Composes: calculateFrameworkMaturity, getControlEffectivenessRate, generateRiskScoringReport
 */
export declare const benchmarkCompliancePerformance: (sequelize: Sequelize, frameworkId: string, industryBenchmarks: {
    maturity: number;
    effectiveness: number;
    gapAverage: number;
}, transaction?: Transaction) => Promise<{
    organizationScore: number;
    industryAverage: number;
    percentile: number;
    gap: number;
    strengths: string[];
    improvements: string[];
}>;
/**
 * Generates compliance heat map for visual risk representation
 * Composes: generateRiskHeatMap, aggregateRiskScoresByCategory
 */
export declare const generateComplianceHeatMap: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<RiskHeatMap>;
/**
 * Calculates compliance cost optimization opportunities
 * Composes: optimizeTreatmentCosts, evaluateFinancialImpact
 */
export declare const optimizeComplianceCosts: (sequelize: Sequelize, frameworkId: string, currentBudget: number, transaction?: Transaction) => Promise<{
    savings: number;
    optimizedControls: string[];
    roi: number;
}>;
/**
 * Predicts certification audit outcomes
 * Composes: assessCertificationReadiness, simulateAuditScenario
 */
export declare const predictCertificationAuditOutcome: (sequelize: Sequelize, certificationId: string, transaction?: Transaction) => Promise<{
    likelihood: "low" | "medium" | "high";
    expectedFindings: number;
    confidence: number;
}>;
/**
 * Tracks regulatory deadline compliance
 * Composes: monitorRegulatoryRequirements, createRiskAlert
 */
export declare const trackRegulatoryDeadlines: (sequelize: Sequelize, frameworkIds: string[], daysAhead?: number, transaction?: Transaction) => Promise<{
    upcomingDeadlines: number;
    overdueItems: number;
    criticalAlerts: number;
}>;
/**
 * Automates compliance evidence collection
 * Composes: complianceControlSchema, testResultSchema
 */
export declare const automateEvidenceCollection: (sequelize: Sequelize, controlId: string, evidenceSources: string[], transaction?: Transaction) => Promise<{
    collected: number;
    missing: number;
    validationStatus: string;
}>;
/**
 * Generates compliance training recommendations
 * Composes: calculateFrameworkMaturity, getControlEffectivenessRate
 */
export declare const generateComplianceTrainingPlan: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    requiredTraining: string[];
    targetAudiences: string[];
    estimatedHours: number;
}>;
/**
 * Validates third-party compliance certifications
 * Composes: defineCertificationModel, validateAgainstPolicy
 */
export declare const validateThirdPartyCertifications: (sequelize: Sequelize, certificationIds: string[], transaction?: Transaction) => Promise<{
    valid: number;
    expired: number;
    expiringSoon: number;
    recommendations: string[];
}>;
/**
 * Calculates compliance program ROI
 * Composes: evaluateFinancialImpact, calculateTreatmentEffectiveness
 */
export declare const calculateComplianceProgramROI: (sequelize: Sequelize, frameworkId: string, programCosts: number, transaction?: Transaction) => Promise<{
    roi: number;
    riskReduction: number;
    costAvoidance: number;
    paybackPeriodMonths: number;
}>;
/**
 * Monitors control degradation patterns
 * Composes: forecastControlEffectiveness, monitorRiskIndicators
 */
export declare const monitorControlDegradation: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    degradingControls: number;
    averageDegradationRate: number;
    interventionsNeeded: number;
}>;
/**
 * Generates compliance maturity roadmap
 * Composes: calculateFrameworkMaturity, predictComplianceRisk
 */
export declare const generateComplianceMaturityRoadmap: (sequelize: Sequelize, frameworkId: string, targetMaturity: number, transaction?: Transaction) => Promise<{
    currentMaturity: number;
    targetMaturity: number;
    estimatedMonths: number;
    milestones: {
        month: number;
        targetScore: number;
        initiatives: string[];
    }[];
}>;
/**
 * Performs cross-framework compliance mapping
 * Composes: defineComplianceFrameworkModel, calculateFrameworkMaturity
 */
export declare const mapCrossFrameworkCompliance: (sequelize: Sequelize, sourceFrameworkId: string, targetFrameworkId: string, transaction?: Transaction) => Promise<{
    commonControls: number;
    uniqueToSource: number;
    uniqueToTarget: number;
    mappingCoverage: number;
}>;
/**
 * Identifies compliance automation opportunities
 * Composes: scheduleAutomatedCheck, validateSecurityBaseline
 */
export declare const identifyAutomationOpportunities: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    automatable: number;
    effortSavings: number;
    priorityControls: string[];
    recommendations: string[];
}>;
/**
 * Calculates compliance debt and technical debt correlation
 * Composes: aggregateRiskScoresByCategory, calculateRiskVelocity
 */
export declare const calculateComplianceDebt: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    debtScore: number;
    accruingRate: number;
    paydownPlan: {
        quarter: number;
        targetReduction: number;
    }[];
    estimatedCost: number;
}>;
/**
 * Generates compliance metrics for board reporting
 * Composes: generateExecutiveComplianceReport, generateComplianceRiskDashboard
 */
export declare const generateBoardComplianceMetrics: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<{
    overallScore: number;
    trend: "improving" | "stable" | "declining";
    keyRisks: string[];
    certificationStatus: string;
    investmentNeeded: number;
}>;
/**
 * Validates compliance policy consistency across frameworks
 * Composes: validateAgainstPolicy, complianceFrameworkSchema
 */
export declare const validatePolicyConsistency: (sequelize: Sequelize, policyIds: string[], frameworkIds: string[], transaction?: Transaction) => Promise<{
    consistentPolicies: number;
    conflicts: number;
    harmonizationOpportunities: number;
}>;
/**
 * Forecasts compliance resource requirements
 * Composes: optimizeComplianceResources, evaluateFinancialImpact
 */
export declare const forecastComplianceResources: (sequelize: Sequelize, frameworkId: string, forecastMonths?: number, transaction?: Transaction) => Promise<{
    requiredFTE: number;
    budgetNeeded: number;
    toolingCosts: number;
    trainingCosts: number;
}>;
/**
 * Analyzes compliance control overlap and redundancy
 * Composes: defineComplianceControlModel, calculateFrameworkMaturity
 */
export declare const analyzeControlRedundancy: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<{
    totalControls: number;
    uniqueControls: number;
    redundantControls: number;
    optimizationPotential: number;
}>;
/**
 * Generates automated compliance remediation plans
 * Composes: forecastComplianceGaps, developRiskTreatmentPlan, trackTreatmentProgress
 */
export declare const generateAutomatedRemediationPlan: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    planId: string;
    totalTasks: number;
    estimatedDays: number;
    prioritySequence: string[];
    resourceRequirements: {
        role: string;
        hours: number;
    }[];
}>;
/**
 * Monitors real-time compliance posture changes
 * Composes: monitorRiskIndicators, createRiskAlert, calculateRiskVelocity
 */
export declare const monitorCompliancePosture: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    currentPosture: "strong" | "moderate" | "weak" | "critical";
    recentChanges: {
        timestamp: Date;
        change: string;
        impact: number;
    }[];
    alerts: number;
    trendDirection: "improving" | "stable" | "declining";
}>;
/**
 * Calculates compliance framework migration effort
 * Composes: mapCrossFrameworkCompliance, calculateFrameworkMaturity
 */
export declare const calculateFrameworkMigrationEffort: (sequelize: Sequelize, sourceFrameworkId: string, targetFrameworkId: string, transaction?: Transaction) => Promise<{
    mappingCoverage: number;
    newControlsRequired: number;
    estimatedMonths: number;
    migrationCost: number;
}>;
/**
 * Validates compliance evidence quality and completeness
 * Composes: testResultSchema, auditFindingSchema
 */
export declare const validateEvidenceQuality: (sequelize: Sequelize, controlId: string, evidenceItems: any[], transaction?: Transaction) => Promise<{
    qualityScore: number;
    completeness: number;
    deficiencies: string[];
    acceptableForAudit: boolean;
}>;
/**
 * Generates compliance KPI dashboard
 * Composes: generateComplianceRiskDashboard, monitorCompliancePosture
 */
export declare const generateComplianceKPIDashboard: (sequelize: Sequelize, frameworkIds: string[], transaction?: Transaction) => Promise<{
    kpis: {
        name: string;
        value: number;
        trend: string;
        target: number;
    }[];
    alerts: number;
    summary: string;
}>;
/**
 * Predicts compliance budget requirements
 * Composes: forecastComplianceResources, calculateComplianceProgramROI
 */
export declare const predictComplianceBudget: (sequelize: Sequelize, frameworkId: string, fiscalYear: number, transaction?: Transaction) => Promise<{
    baselineBudget: number;
    projectedBudget: number;
    contingencyBudget: number;
    totalBudget: number;
    breakdown: {
        category: string;
        amount: number;
    }[];
}>;
/**
 * Generates compliance workflow automation recommendations
 * Composes: identifyAutomationOpportunities, automateEvidenceCollection
 */
export declare const recommendWorkflowAutomation: (sequelize: Sequelize, frameworkId: string, transaction?: Transaction) => Promise<{
    workflows: {
        name: string;
        automationPotential: number;
        priority: string;
    }[];
    estimatedEffort: number;
    estimatedSavings: number;
}>;
export type { ComplianceRiskPrediction, RiskFactor, RegulatoryAlert, PolicyEnforcementResult, ControlEffectivenessForecast, AuditPreparationChecklist, PreparationItem, ComplianceGapForecast, CertificationReadiness, RegulatoryChangeImpact, };
//# sourceMappingURL=compliance-risk-prediction-composite.d.ts.map