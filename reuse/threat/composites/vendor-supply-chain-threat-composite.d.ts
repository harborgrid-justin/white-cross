/**
 * LOC: VNDSCTHRT001
 * File: /reuse/threat/composites/vendor-supply-chain-threat-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../vendor-risk-management-kit
 *   - ../supply-chain-security-kit
 *   - ../risk-analysis-kit
 *   - ../compliance-monitoring-kit
 *   - sequelize
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - Vendor risk assessment services
 *   - Supply chain monitoring controllers
 *   - Third-party threat detection engines
 *   - SBOM management modules
 *   - Vendor security dashboards
 */
/**
 * File: /reuse/threat/composites/vendor-supply-chain-threat-composite.ts
 * Locator: WC-VENDOR-SUPPLY-CHAIN-COMPOSITE-001
 * Purpose: Enterprise Vendor & Supply Chain Threat Composite - AI-powered vendor risk and supply chain security
 *
 * Upstream: Composes functions from vendor-risk-management-kit, supply-chain-security-kit, risk-analysis-kit, compliance-monitoring-kit
 * Downstream: ../backend/*, Vendor services, Supply chain monitoring, SBOM processors, Third-party risk dashboards
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for vendor risk assessment, supply chain threat detection, SBOM analysis, third-party monitoring
 *
 * LLM Context: Enterprise-grade vendor and supply chain threat management composite for White Cross healthcare platform.
 * Provides comprehensive vendor security assessment with continuous monitoring, supply chain attack detection using ML models,
 * Software Bill of Materials (SBOM) vulnerability analysis, third-party risk scoring with real-time updates, vendor incident
 * tracking and response, dependency vulnerability scanning, counterfeit detection, supplier security ratings, vendor onboarding
 * automation, contract security compliance validation, and vendor portfolio risk optimization. Competes with enterprise
 * platforms like Infor SCM, BitSight, SecurityScorecard, and RiskRecon.
 *
 * Key Capabilities:
 * - AI-powered vendor security assessment and continuous monitoring
 * - Real-time supply chain attack detection and threat intelligence
 * - Comprehensive SBOM management and vulnerability tracking
 * - Third-party risk scoring with predictive analytics
 * - Automated vendor onboarding with security validation
 * - Vendor incident management and response coordination
 * - Dependency vulnerability analysis and remediation planning
 * - Counterfeit and tampering detection in supply chain
 * - Supplier security rating aggregation and benchmarking
 * - Contract security compliance monitoring and enforcement
 * - Vendor portfolio optimization and risk concentration analysis
 */
import { Sequelize, Transaction } from 'sequelize';
import { type VendorIncident, type VendorScorecard } from '../vendor-risk-management-kit';
import { type SBOMComponent, type SBOMVulnerability } from '../supply-chain-security-kit';
/**
 * Comprehensive vendor threat profile
 */
export interface VendorThreatProfile {
    vendorId: string;
    vendorName: string;
    assessmentDate: Date;
    overallThreatLevel: 'low' | 'medium' | 'high' | 'critical';
    threatScore: number;
    securityRating: 'A' | 'B' | 'C' | 'D' | 'F';
    activeThreats: VendorThreat[];
    vulnerabilities: SBOMVulnerability[];
    incidents: VendorIncident[];
    riskFactors: VendorRiskFactor[];
    recommendations: string[];
    monitoringStatus: 'active' | 'suspended' | 'terminated';
    nextAssessment: Date;
}
/**
 * Vendor-specific threat indicator
 */
export interface VendorThreat {
    threatId: string;
    threatType: 'data_breach' | 'ransomware' | 'insider_threat' | 'supply_chain_attack' | 'service_disruption';
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: Date;
    description: string;
    affectedServices: string[];
    mitigationStatus: 'identified' | 'investigating' | 'mitigating' | 'mitigated';
    estimatedImpact: string;
}
/**
 * Vendor risk factor
 */
export interface VendorRiskFactor {
    factorType: 'security' | 'financial' | 'operational' | 'compliance' | 'reputational';
    factorName: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impact: number;
    likelihood: number;
    description: string;
    mitigation?: string;
}
/**
 * Supply chain attack detection result
 */
export interface SupplyChainAttackDetection {
    detectionId: string;
    detectedAt: Date;
    attackType: 'backdoor' | 'malicious_update' | 'dependency_confusion' | 'typosquatting' | 'compromised_build';
    confidence: number;
    affectedVendors: string[];
    affectedComponents: SBOMComponent[];
    indicators: AttackIndicator[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'investigating' | 'confirmed' | 'mitigated' | 'false_positive';
    responseActions: string[];
    estimatedImpact: string;
}
/**
 * Attack indicator for supply chain threats
 */
export interface AttackIndicator {
    indicatorType: 'behavioral' | 'signature' | 'anomaly' | 'intelligence';
    description: string;
    confidence: number;
    evidence: string[];
}
/**
 * SBOM vulnerability analysis result
 */
export interface SBOMVulnerabilityAnalysis {
    sbomId: string;
    analysisDate: Date;
    totalComponents: number;
    vulnerableComponents: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    lowVulnerabilities: number;
    riskScore: number;
    patchAvailable: number;
    remediationPlan: RemediationAction[];
    complianceIssues: string[];
    licensingConcerns: string[];
}
/**
 * Remediation action for vulnerabilities
 */
export interface RemediationAction {
    actionId: string;
    actionType: 'patch' | 'upgrade' | 'replace' | 'isolate' | 'accept_risk';
    component: string;
    vulnerability: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    effort: 'low' | 'medium' | 'high';
    dueDate: Date;
    assignedTo?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}
/**
 * Third-party continuous monitoring result
 */
export interface ThirdPartyMonitoringResult {
    vendorId: string;
    monitoringPeriod: {
        start: Date;
        end: Date;
    };
    eventsDetected: number;
    securityIncidents: number;
    complianceViolations: number;
    performanceIssues: number;
    scoreChange: number;
    currentScore: number;
    alerts: MonitoringAlert[];
    trends: MonitoringTrend[];
    recommendations: string[];
}
/**
 * Monitoring alert for vendor activity
 */
export interface MonitoringAlert {
    alertId: string;
    alertType: 'security' | 'compliance' | 'performance' | 'availability' | 'data_breach';
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    description: string;
    affectedSystems: string[];
    actionRequired: string;
    acknowledgedBy?: string;
}
/**
 * Monitoring trend analysis
 */
export interface MonitoringTrend {
    metric: string;
    direction: 'improving' | 'stable' | 'degrading';
    changePercent: number;
    significance: 'low' | 'medium' | 'high';
}
/**
 * Vendor onboarding automation result
 */
export interface VendorOnboardingResult {
    vendorId: string;
    onboardingId: string;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'on_hold';
    completionPercent: number;
    stagesCompleted: OnboardingStage[];
    currentStage: string;
    blockers: string[];
    securityClearance: boolean;
    complianceClearance: boolean;
    financialClearance: boolean;
    estimatedCompletionDate?: Date;
    approvers: string[];
}
/**
 * Vendor onboarding stage
 */
export interface OnboardingStage {
    stageName: string;
    stageType: 'security' | 'compliance' | 'financial' | 'legal' | 'operational';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    completedDate?: Date;
    findings: string[];
    approvedBy?: string;
}
/**
 * Vendor portfolio risk analysis
 */
export interface VendorPortfolioRiskAnalysis {
    portfolioId: string;
    analysisDate: Date;
    totalVendors: number;
    criticalVendors: number;
    highRiskVendors: number;
    concentrationRisk: number;
    diversificationScore: number;
    aggregateRiskScore: number;
    topRisks: VendorRiskFactor[];
    vendorsByRiskLevel: Map<string, number>;
    recommendations: string[];
}
/**
 * Vendor incident response coordination
 */
export interface VendorIncidentResponse {
    incidentId: string;
    vendorId: string;
    incidentType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: Date;
    responseStatus: 'detecting' | 'containing' | 'eradicating' | 'recovering' | 'resolved';
    responseTeam: string[];
    coordinationActions: ResponseAction[];
    vendorCommunications: Communication[];
    impactAssessment: ImpactAssessment;
    lessonsLearned?: string[];
    closedAt?: Date;
}
/**
 * Incident response action
 */
export interface ResponseAction {
    actionId: string;
    actionType: 'communication' | 'investigation' | 'containment' | 'remediation' | 'recovery';
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}
/**
 * Vendor communication record
 */
export interface Communication {
    timestamp: Date;
    direction: 'inbound' | 'outbound';
    channel: 'email' | 'phone' | 'ticket' | 'meeting';
    participants: string[];
    summary: string;
    actionItems: string[];
}
/**
 * Incident impact assessment
 */
export interface ImpactAssessment {
    businessImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
    affectedSystems: string[];
    affectedUsers: number;
    dataCompromised: boolean;
    financialImpact?: number;
    reputationalImpact: 'low' | 'medium' | 'high';
    regulatoryImpact: boolean;
}
/**
 * Generates comprehensive vendor threat profile with ML-powered analysis
 * Composes: calculateOverallRiskScore, calculateSecurityRating, assessThirdPartyRisk, prioritizeVulnerabilities
 */
export declare const generateVendorThreatProfile: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<VendorThreatProfile>;
/**
 * Detects supply chain attacks using ML anomaly detection
 * Composes: compareSBOMs, calculateCVSSScore, prioritizeVulnerabilities, generateSecurityRecommendations
 */
export declare const detectSupplyChainAttack: (sequelize: Sequelize, sbomId: string, previousSBOMId?: string, transaction?: Transaction) => Promise<SupplyChainAttackDetection>;
/**
 * Analyzes SBOM for vulnerabilities and compliance issues
 * Composes: calculateCVSSScore, calculateDependencyRiskScore, prioritizeVulnerabilities, generateVulnerabilityReport
 */
export declare const analyzeSBOMVulnerabilities: (sequelize: Sequelize, sbomId: string, transaction?: Transaction) => Promise<SBOMVulnerabilityAnalysis>;
/**
 * Continuously monitors third-party vendors for security events
 * Composes: calculateScorecardMetrics, determineTrend, monitorRiskIndicators
 */
export declare const monitorThirdPartyVendor: (sequelize: Sequelize, vendorId: string, monitoringPeriodDays?: number, transaction?: Transaction) => Promise<ThirdPartyMonitoringResult>;
/**
 * Automates vendor onboarding with security validation
 * Composes: scoreQuestionnaire, identifyQuestionnaireGaps, validateContractSecurity, calculateOverallRiskScore
 */
export declare const automateVendorOnboarding: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<VendorOnboardingResult>;
/**
 * Analyzes vendor portfolio risk concentration
 * Composes: calculateOverallRiskScore, aggregateRiskScoresByCategory, generateRiskHeatMap
 */
export declare const analyzeVendorPortfolioRisk: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<VendorPortfolioRiskAnalysis>;
/**
 * Coordinates vendor incident response
 * Composes: assessVulnerability, conductBusinessImpactAnalysis, evaluateFinancialImpact
 */
export declare const coordinateVendorIncidentResponse: (sequelize: Sequelize, incidentId: string, transaction?: Transaction) => Promise<VendorIncidentResponse>;
/**
 * Validates vendor security questionnaire responses
 * Composes: scoreQuestionnaire, identifyQuestionnaireGaps, calculateOverallRiskScore
 */
export declare const validateVendorSecurityQuestionnaire: (sequelize: Sequelize, questionnaireId: string, transaction?: Transaction) => Promise<{
    valid: boolean;
    score: number;
    gaps: string[];
    recommendations: string[];
}>;
/**
 * Generates vendor security scorecard with benchmarking
 * Composes: calculateScorecardMetrics, compareToBenchmark, determineTrend
 */
export declare const generateVendorSecurityScorecard: (sequelize: Sequelize, vendorId: string, peerBenchmarks: number[], transaction?: Transaction) => Promise<{
    scorecard: VendorScorecard;
    percentileRank: number;
    trend: "improving" | "stable" | "declining";
    recommendations: string[];
}>;
/**
 * Tracks vendor compliance with contract security requirements
 * Composes: validateContractSecurity, calculateFrameworkMaturity
 */
export declare const trackVendorContractCompliance: (sequelize: Sequelize, vendorId: string, contractRequirements: string[], transaction?: Transaction) => Promise<{
    complianceRate: number;
    compliantRequirements: string[];
    nonCompliantRequirements: string[];
    remediationRequired: boolean;
}>;
/**
 * Performs vendor risk re-assessment with ML predictions
 * Composes: calculateOverallRiskScore, calculateRiskVelocity, assessThirdPartyRisk
 */
export declare const performVendorRiskReassessment: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    currentRisk: number;
    predictedRisk: number;
    riskTrend: "improving" | "stable" | "worsening";
    reassessmentRequired: boolean;
}>;
/**
 * Generates vendor risk dashboard for executives
 * Composes: generateExecutiveRiskReport, generateRiskHeatMap, aggregateRiskScoresByCategory
 */
export declare const generateVendorRiskDashboard: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    summary: {
        totalVendors: number;
        criticalRisk: number;
        highRisk: number;
        averageRisk: number;
    };
    topRisks: string[];
    recentIncidents: number;
    recommendations: string[];
}>;
/**
 * Optimizes vendor selection based on risk and cost
 * Composes: calculateOverallRiskScore, evaluateFinancialImpact, prioritizeRisks
 */
export declare const optimizeVendorSelection: (sequelize: Sequelize, candidateVendorIds: string[], selectionCriteria: {
    riskWeight: number;
    costWeight: number;
    performanceWeight: number;
}, transaction?: Transaction) => Promise<{
    rankedVendors: {
        vendorId: string;
        score: number;
        rank: number;
    }[];
    recommendedVendor: string;
    justification: string;
}>;
/**
 * Predicts vendor security posture degradation
 * Composes: calculateRiskVelocity, determineTrend, monitorRiskIndicators
 */
export declare const predictVendorSecurityDegradation: (sequelize: Sequelize, vendorId: string, forecastDays?: number, transaction?: Transaction) => Promise<{
    currentScore: number;
    predictedScore: number;
    degradationRate: number;
    interventionRequired: boolean;
    recommendations: string[];
}>;
/**
 * Aggregates supply chain intelligence from multiple sources
 * Composes: generateSecurityRecommendations, calculateDependencyRiskScore
 */
export declare const aggregateSupplyChainIntelligence: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    totalVulnerabilities: number;
    criticalComponents: string[];
    riskHotspots: string[];
    recommendations: string[];
}>;
/**
 * Generates SBOM compliance report
 * Composes: analyzeSBOMVulnerabilities, exportSBOM
 */
export declare const generateSBOMComplianceReport: (sequelize: Sequelize, sbomIds: string[], transaction?: Transaction) => Promise<{
    totalComponents: number;
    compliantComponents: number;
    vulnerableComponents: number;
    complianceRate: number;
    recommendations: string[];
}>;
/**
 * Tracks vendor SLA compliance
 * Composes: monitorThirdPartyVendor, calculateScorecardMetrics
 */
export declare const trackVendorSLACompliance: (sequelize: Sequelize, vendorId: string, slaRequirements: {
    metric: string;
    threshold: number;
}[], transaction?: Transaction) => Promise<{
    slaComplianceRate: number;
    metricsMet: number;
    metricsMissed: number;
    breaches: string[];
}>;
/**
 * Generates vendor concentration risk analysis
 * Composes: analyzeVendorPortfolioRisk, aggregateRiskScoresByCategory
 */
export declare const analyzeVendorConcentrationRisk: (sequelize: Sequelize, serviceCategory: string, transaction?: Transaction) => Promise<{
    concentrationScore: number;
    criticalDependencies: number;
    alternativeVendors: number;
    riskMitigation: string[];
}>;
/**
 * Automates vendor risk reassessment scheduling
 * Composes: calculateNextReviewDate, performVendorRiskReassessment
 */
export declare const scheduleVendorReassessments: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    scheduledAssessments: {
        vendorId: string;
        dueDate: Date;
        priority: string;
    }[];
    overdueAssessments: number;
}>;
/**
 * Validates vendor insurance and liability coverage
 * Composes: validateContractSecurity, evaluateFinancialImpact
 */
export declare const validateVendorInsuranceCoverage: (sequelize: Sequelize, vendorId: string, requiredCoverage: number, transaction?: Transaction) => Promise<{
    hasAdequateCoverage: boolean;
    currentCoverage: number;
    gap: number;
    recommendations: string[];
}>;
/**
 * Performs vendor financial health assessment
 * Composes: evaluateFinancialImpact, assessThirdPartyRisk
 */
export declare const assessVendorFinancialHealth: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    financialScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    indicators: string[];
    contingencyPlan: string[];
}>;
/**
 * Generates vendor exit strategy and migration plan
 * Composes: assessVendorFinancialHealth, conductBusinessImpactAnalysis
 */
export declare const generateVendorExitStrategy: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    exitReadiness: number;
    migrationSteps: string[];
    estimatedDays: number;
    estimatedCost: number;
    alternativeVendors: string[];
}>;
/**
 * Tracks vendor security improvements over time
 * Composes: generateVendorSecurityScorecard, determineTrend
 */
export declare const trackVendorSecurityImprovements: (sequelize: Sequelize, vendorId: string, periodMonths?: number, transaction?: Transaction) => Promise<{
    initialScore: number;
    currentScore: number;
    improvement: number;
    trend: "improving" | "stable" | "declining";
    milestones: {
        date: Date;
        score: number;
        event: string;
    }[];
}>;
/**
 * Calculates vendor total cost of ownership (TCO)
 * Composes: evaluateFinancialImpact, assessVendorFinancialHealth
 */
export declare const calculateVendorTCO: (sequelize: Sequelize, vendorId: string, periodMonths?: number, transaction?: Transaction) => Promise<{
    directCosts: number;
    indirectCosts: number;
    riskCosts: number;
    totalTCO: number;
    recommendations: string[];
}>;
/**
 * Generates vendor scorecard comparison matrix
 * Composes: calculateScorecardMetrics, compareToBenchmark
 */
export declare const compareVendorScorecards: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    rankings: {
        vendorId: string;
        rank: number;
        score: number;
    }[];
    leader: string;
    laggard: string;
    averageScore: number;
}>;
/**
 * Validates vendor data privacy compliance
 * Composes: validateContractSecurity, validateAgainstPolicy
 */
export declare const validateVendorDataPrivacy: (sequelize: Sequelize, vendorId: string, privacyRequirements: string[], transaction?: Transaction) => Promise<{
    compliant: boolean;
    metRequirements: string[];
    unmetRequirements: string[];
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
}>;
/**
 * Generates supply chain resilience score
 * Composes: analyzeVendorPortfolioRisk, conductBusinessImpactAnalysis
 */
export declare const calculateSupplyChainResilience: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    resilienceScore: number;
    vulnerabilities: string[];
    strengths: string[];
    improvementPlan: string[];
}>;
/**
 * Monitors vendor geopolitical risk
 * Composes: assessThirdPartyRisk, evaluateFinancialImpact
 */
export declare const assessVendorGeopoliticalRisk: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    riskScore: number;
    riskFactors: string[];
    impactedServices: string[];
    mitigationStrategy: string[];
}>;
/**
 * Generates vendor relationship health metrics
 * Composes: monitorThirdPartyVendor, trackVendorContractCompliance
 */
export declare const assessVendorRelationshipHealth: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    healthScore: number;
    communicationQuality: number;
    responsiveness: number;
    issueResolution: number;
    recommendations: string[];
}>;
/**
 * Performs automated vendor due diligence
 * Composes: scoreQuestionnaire, identifyQuestionnaireGaps, calculateOverallRiskScore
 */
export declare const performAutomatedDueDiligence: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    dueDiligenceScore: number;
    passed: boolean;
    findings: string[];
    nextSteps: string[];
    approvalRequired: boolean;
}>;
/**
 * Calculates vendor dependency impact score
 * Composes: conductBusinessImpactAnalysis, assessThirdPartyRisk
 */
export declare const calculateVendorDependencyImpact: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    impactScore: number;
    criticality: "low" | "medium" | "high" | "critical";
    affectedProcesses: number;
    replacementDifficulty: number;
    recommendations: string[];
}>;
/**
 * Generates vendor cyber insurance assessment
 * Composes: calculateOverallRiskScore, evaluateFinancialImpact
 */
export declare const assessVendorCyberInsuranceNeeds: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    recommendedCoverage: number;
    currentCoverage: number;
    gap: number;
    premiumEstimate: number;
    requirements: string[];
}>;
/**
 * Tracks vendor innovation and technology adoption
 * Composes: trackVendorSecurityImprovements, monitorThirdPartyVendor
 */
export declare const trackVendorInnovation: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    innovationScore: number;
    technologyStack: string[];
    modernizationLevel: "legacy" | "transitional" | "modern" | "cutting_edge";
    recommendations: string[];
}>;
/**
 * Generates comprehensive vendor executive summary
 * Composes: generateVendorRiskDashboard, generateVendorThreatProfile
 */
export declare const generateVendorExecutiveSummary: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    totalVendors: number;
    highRiskVendors: number;
    activeIncidents: number;
    complianceRate: number;
    topRecommendations: string[];
    executiveSummary: string;
}>;
/**
 * Automates vendor security questionnaire generation
 * Composes: securityQuestionnaireSchema, scoreQuestionnaire
 */
export declare const generateVendorSecurityQuestionnaire: (sequelize: Sequelize, vendorId: string, questionnaireType: "soc2" | "iso27001" | "hipaa" | "custom", transaction?: Transaction) => Promise<{
    questionnaireId: string;
    totalQuestions: number;
    estimatedCompletionTime: number;
    dueDate: Date;
}>;
/**
 * Calculates vendor risk-adjusted pricing
 * Composes: calculateOverallRiskScore, evaluateFinancialImpact
 */
export declare const calculateRiskAdjustedPricing: (sequelize: Sequelize, vendorId: string, basePrice: number, transaction?: Transaction) => Promise<{
    basePrice: number;
    riskPremium: number;
    adjustedPrice: number;
    justification: string;
}>;
/**
 * Monitors vendor regulatory compliance changes
 * Composes: validateVendorDataPrivacy, trackVendorContractCompliance
 */
export declare const monitorVendorRegulatoryCompliance: (sequelize: Sequelize, vendorId: string, regulatoryFrameworks: string[], transaction?: Transaction) => Promise<{
    compliantFrameworks: string[];
    nonCompliantFrameworks: string[];
    pendingCertifications: string[];
    expiringCertifications: string[];
}>;
/**
 * Generates vendor performance benchmarking report
 * Composes: compareVendorScorecards, trackVendorSecurityImprovements
 */
export declare const benchmarkVendorPerformance: (sequelize: Sequelize, vendorIds: string[], industryBenchmarks: {
    metric: string;
    value: number;
}[], transaction?: Transaction) => Promise<{
    aboveBenchmark: number;
    belowBenchmark: number;
    averagePerformance: number;
    topPerformers: string[];
    underperformers: string[];
}>;
/**
 * Calculates vendor ecosystem health score
 * Composes: calculateSupplyChainResilience, analyzeVendorPortfolioRisk
 */
export declare const calculateVendorEcosystemHealth: (sequelize: Sequelize, vendorIds: string[], transaction?: Transaction) => Promise<{
    ecosystemHealthScore: number;
    resilience: number;
    diversity: number;
    maturity: number;
    recommendations: string[];
}>;
/**
 * Tracks vendor compliance certification status
 * Composes: validateVendorDataPrivacy, monitorVendorRegulatoryCompliance
 */
export declare const trackVendorCertificationStatus: (sequelize: Sequelize, vendorIds: string[], requiredCertifications: string[], transaction?: Transaction) => Promise<{
    fullyCompliant: number;
    partiallyCompliant: number;
    nonCompliant: number;
    expiringCertifications: number;
    urgentActions: string[];
}>;
/**
 * Generates vendor risk mitigation playbook
 * Composes: generateVendorThreatProfile, coordinateVendorIncidentResponse
 */
export declare const generateVendorRiskPlaybook: (sequelize: Sequelize, vendorId: string, transaction?: Transaction) => Promise<{
    playbookId: string;
    riskScenarios: {
        scenario: string;
        likelihood: string;
        response: string;
    }[];
    escalationMatrix: {
        level: number;
        trigger: string;
        contacts: string[];
    }[];
    communicationPlan: string[];
}>;
/**
 * Automates vendor compliance attestation collection
 * Composes: validateVendorDataPrivacy, generateVendorSecurityQuestionnaire
 */
export declare const automateComplianceAttestations: (sequelize: Sequelize, vendorIds: string[], attestationPeriod: "quarterly" | "annual", transaction?: Transaction) => Promise<{
    totalVendors: number;
    attestationsCollected: number;
    attestationsPending: number;
    overdueAttestations: number;
    completionRate: number;
}>;
export type { VendorThreatProfile, VendorThreat, VendorRiskFactor, SupplyChainAttackDetection, AttackIndicator, SBOMVulnerabilityAnalysis, RemediationAction, ThirdPartyMonitoringResult, MonitoringAlert, MonitoringTrend, VendorOnboardingResult, OnboardingStage, VendorPortfolioRiskAnalysis, VendorIncidentResponse, ResponseAction, Communication, ImpactAssessment, };
//# sourceMappingURL=vendor-supply-chain-threat-composite.d.ts.map