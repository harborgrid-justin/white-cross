/**
 * @fileoverview Risk Analysis Kit - Enterprise Infor SCM competitor
 * @module reuse/threat/risk-analysis-kit
 * @description Comprehensive risk scoring, vulnerability assessment, and risk management for supply
 * chain and enterprise operations, competing with Infor SCM risk management module. Handles risk
 * identification, assessment, scoring, heat mapping, business impact analysis, risk appetite,
 * treatment planning, and continuous monitoring.
 *
 * Key Features:
 * - Advanced risk scoring and prioritization
 * - Comprehensive vulnerability assessment
 * - Dynamic risk heat map generation
 * - Business impact analysis (BIA)
 * - Risk appetite and tolerance configuration
 * - Risk acceptance workflows and tracking
 * - Risk register management and reporting
 * - Risk treatment plan development
 * - Residual risk calculation
 * - Risk monitoring and alerting
 * - Compliance risk assessment
 * - Third-party risk evaluation
 *
 * @target Infor SCM Risk Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for risk data
 * - Audit trails for all risk decisions
 * - Data encryption for sensitive risk assessments
 * - SOC 2 Type II compliance
 * - Multi-tenant data isolation
 * - Risk data anonymization capabilities
 *
 * @example Risk scoring
 * ```typescript
 * import { calculateRiskScore, prioritizeRisks } from './risk-analysis-kit';
 *
 * const riskScore = await calculateRiskScore({
 *   riskId: 'risk-001',
 *   likelihood: 0.7,
 *   impact: 0.9,
 *   controlEffectiveness: 0.6,
 * }, sequelize);
 *
 * const prioritized = await prioritizeRisks(['risk-001', 'risk-002', 'risk-003'], sequelize);
 * ```
 *
 * @example Vulnerability assessment
 * ```typescript
 * import { assessVulnerability, calculateCVSS } from './risk-analysis-kit';
 *
 * const vulnerability = await assessVulnerability({
 *   assetId: 'server-001',
 *   vulnerabilityType: VulnerabilityType.SOFTWARE,
 *   cveId: 'CVE-2024-1234',
 * }, sequelize);
 *
 * const cvss = await calculateCVSS('vuln-123', sequelize);
 * ```
 *
 * @example Risk heat map
 * ```typescript
 * import { generateRiskHeatMap, visualizeRiskMatrix } from './risk-analysis-kit';
 *
 * const heatMap = await generateRiskHeatMap('organization-001', sequelize);
 * const visualization = await visualizeRiskMatrix(heatMap);
 * ```
 *
 * LOC: RISK-ANALYZE-001
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns
 * DOWNSTREAM: security-operations, compliance, audit, risk-committee, executive-dashboard
 *
 * @version 1.0.0
 * @since 2025-01-09
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * @enum RiskLevel
 * @description Risk severity levels
 */
export declare enum RiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    NEGLIGIBLE = "NEGLIGIBLE"
}
/**
 * @enum RiskStatus
 * @description Risk status in workflow
 */
export declare enum RiskStatus {
    IDENTIFIED = "IDENTIFIED",
    UNDER_ASSESSMENT = "UNDER_ASSESSMENT",
    ASSESSED = "ASSESSED",
    TREATMENT_PLANNED = "TREATMENT_PLANNED",
    UNDER_TREATMENT = "UNDER_TREATMENT",
    MITIGATED = "MITIGATED",
    ACCEPTED = "ACCEPTED",
    TRANSFERRED = "TRANSFERRED",
    AVOIDED = "AVOIDED",
    CLOSED = "CLOSED"
}
/**
 * @enum RiskCategory
 * @description Risk categorization
 */
export declare enum RiskCategory {
    STRATEGIC = "STRATEGIC",
    OPERATIONAL = "OPERATIONAL",
    FINANCIAL = "FINANCIAL",
    COMPLIANCE = "COMPLIANCE",
    REPUTATIONAL = "REPUTATIONAL",
    TECHNOLOGY = "TECHNOLOGY",
    SECURITY = "SECURITY",
    SUPPLY_CHAIN = "SUPPLY_CHAIN",
    THIRD_PARTY = "THIRD_PARTY",
    ENVIRONMENTAL = "ENVIRONMENTAL"
}
/**
 * @enum VulnerabilityType
 * @description Types of vulnerabilities
 */
export declare enum VulnerabilityType {
    SOFTWARE = "SOFTWARE",
    HARDWARE = "HARDWARE",
    NETWORK = "NETWORK",
    PHYSICAL = "PHYSICAL",
    PROCEDURAL = "PROCEDURAL",
    HUMAN = "HUMAN",
    CONFIGURATION = "CONFIGURATION",
    ARCHITECTURAL = "ARCHITECTURAL"
}
/**
 * @enum TreatmentStrategy
 * @description Risk treatment strategies
 */
export declare enum TreatmentStrategy {
    MITIGATE = "MITIGATE",
    ACCEPT = "ACCEPT",
    TRANSFER = "TRANSFER",
    AVOID = "AVOID",
    SHARE = "SHARE"
}
/**
 * @enum RiskAppetiteLevel
 * @description Organization's risk appetite levels
 */
export declare enum RiskAppetiteLevel {
    AVERSE = "AVERSE",
    MINIMAL = "MINIMAL",
    CAUTIOUS = "CAUTIOUS",
    OPEN = "OPEN",
    HUNGRY = "HUNGRY"
}
/**
 * @interface RiskScore
 * @description Calculated risk score
 */
export interface RiskScore {
    riskId: string;
    inherentRisk: number;
    residualRisk: number;
    likelihood: number;
    impact: number;
    controlEffectiveness: number;
    riskLevel: RiskLevel;
    confidenceLevel: number;
    calculatedAt: Date;
}
/**
 * @interface VulnerabilityAssessment
 * @description Vulnerability assessment data
 */
export interface VulnerabilityAssessment {
    vulnerabilityId: string;
    assetId: string;
    assetType: string;
    vulnerabilityType: VulnerabilityType;
    cveId?: string;
    cvssScore?: number;
    severity: RiskLevel;
    description: string;
    exploitability: number;
    remediationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
    remediationSteps?: string[];
    discoveredAt: Date;
    patchAvailable: boolean;
}
/**
 * @interface RiskHeatMap
 * @description Risk heat map data structure
 */
export interface RiskHeatMap {
    organizationId: string;
    period: string;
    matrix: Array<{
        likelihood: number;
        impact: number;
        riskCount: number;
        riskIds: string[];
        riskLevel: RiskLevel;
    }>;
    summary: {
        totalRisks: number;
        criticalRisks: number;
        highRisks: number;
        mediumRisks: number;
        lowRisks: number;
    };
    generatedAt: Date;
}
/**
 * @interface BusinessImpactAnalysis
 * @description BIA data structure
 */
export interface BusinessImpactAnalysis {
    processId: string;
    processName: string;
    criticalityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    rto: number;
    rpo: number;
    financialImpact: {
        hourlyLoss: number;
        maximumTolerableloss: number;
        currency: string;
    };
    operationalImpact: string;
    reputationalImpact: string;
    regulatoryImpact: string;
    dependencies: string[];
    alternativeProcedures?: string;
}
/**
 * @interface RiskAppetite
 * @description Risk appetite configuration
 */
export interface RiskAppetite {
    organizationId: string;
    category: RiskCategory;
    appetiteLevel: RiskAppetiteLevel;
    thresholds: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    toleranceRange: {
        min: number;
        max: number;
    };
    effectiveFrom: Date;
    effectiveTo?: Date;
    approvedBy: string;
}
/**
 * @interface RiskAcceptance
 * @description Risk acceptance record
 */
export interface RiskAcceptance {
    acceptanceId: string;
    riskId: string;
    acceptedBy: string;
    acceptedAt: Date;
    justification: string;
    conditions: string[];
    reviewDate: Date;
    expiryDate: Date;
    compensatingControls?: string[];
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}
/**
 * @interface RiskRegister
 * @description Risk register entry
 */
export interface RiskRegister {
    riskId: string;
    riskTitle: string;
    riskDescription: string;
    category: RiskCategory;
    owner: string;
    status: RiskStatus;
    inherentRisk: RiskScore;
    residualRisk: RiskScore;
    controls: string[];
    treatmentPlan?: RiskTreatmentPlan;
    identifiedDate: Date;
    lastReviewDate: Date;
    nextReviewDate: Date;
}
/**
 * @interface RiskTreatmentPlan
 * @description Risk treatment plan
 */
export interface RiskTreatmentPlan {
    planId: string;
    riskId: string;
    strategy: TreatmentStrategy;
    actions: Array<{
        actionId: string;
        description: string;
        owner: string;
        dueDate: Date;
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
        cost?: number;
    }>;
    expectedResidualRisk: number;
    budget: number;
    timeline: {
        startDate: Date;
        endDate: Date;
    };
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * @interface CVSSScore
 * @description CVSS v3 score breakdown
 */
export interface CVSSScore {
    vulnerabilityId: string;
    baseScore: number;
    baseMetrics: {
        attackVector: string;
        attackComplexity: string;
        privilegesRequired: string;
        userInteraction: string;
        scope: string;
        confidentialityImpact: string;
        integrityImpact: string;
        availabilityImpact: string;
    };
    temporalScore?: number;
    environmentalScore?: number;
    overallScore: number;
    severity: RiskLevel;
}
/**
 * @interface ThirdPartyRisk
 * @description Third-party risk assessment
 */
export interface ThirdPartyRisk {
    vendorId: string;
    vendorName: string;
    riskLevel: RiskLevel;
    assessmentDate: Date;
    riskFactors: Array<{
        factor: string;
        score: number;
        weight: number;
    }>;
    criticalityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    dataAccess: boolean;
    complianceStatus: string;
    recommendations: string[];
}
/**
 * Calculates comprehensive risk score
 *
 * @param {Partial<RiskScore>} riskData - Risk scoring data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RiskScore>} Calculated risk score
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const riskScore = await calculateRiskScore({
 *   riskId: 'risk-001',
 *   likelihood: 0.75,
 *   impact: 0.85,
 *   controlEffectiveness: 0.60,
 * }, sequelize);
 * console.log(`Residual risk: ${riskScore.residualRisk}`);
 * ```
 */
export declare const calculateRiskScore: (riskData: Partial<RiskScore>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskScore>;
/**
 * Prioritizes risks based on multiple criteria
 *
 * @param {string[]} riskIds - Risk IDs to prioritize
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{riskId: string, priority: number, riskLevel: RiskLevel}>>} Prioritized risks
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeRisks(['risk-001', 'risk-002', 'risk-003'], sequelize);
 * prioritized.forEach(r => console.log(`${r.riskId}: Priority ${r.priority}`));
 * ```
 */
export declare const prioritizeRisks: (riskIds: string[], sequelize: Sequelize) => Promise<Array<{
    riskId: string;
    priority: number;
    riskLevel: RiskLevel;
}>>;
/**
 * Calculates risk velocity (rate of change)
 *
 * @param {string} riskId - Risk ID
 * @param {number} lookbackDays - Days to analyze
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{velocity: number, trend: 'INCREASING' | 'STABLE' | 'DECREASING'}>} Velocity analysis
 *
 * @example
 * ```typescript
 * const velocity = await calculateRiskVelocity('risk-001', 30, sequelize);
 * console.log(`Risk is ${velocity.trend}, Velocity: ${velocity.velocity}`);
 * ```
 */
export declare const calculateRiskVelocity: (riskId: string, lookbackDays: number, sequelize: Sequelize) => Promise<{
    velocity: number;
    trend: "INCREASING" | "STABLE" | "DECREASING";
}>;
/**
 * Aggregates risk scores by category
 *
 * @param {RiskCategory} category - Risk category
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{category: RiskCategory, totalRisks: number, averageScore: number, distribution: Record<RiskLevel, number>}>} Aggregated scores
 *
 * @example
 * ```typescript
 * const aggregation = await aggregateRiskScoresByCategory(RiskCategory.SECURITY, sequelize);
 * ```
 */
export declare const aggregateRiskScoresByCategory: (category: RiskCategory, sequelize: Sequelize) => Promise<{
    category: RiskCategory;
    totalRisks: number;
    averageScore: number;
    distribution: Record<RiskLevel, number>;
}>;
/**
 * Generates risk scoring report
 *
 * @param {string} organizationId - Organization ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Risk scoring report
 *
 * @example
 * ```typescript
 * const report = await generateRiskScoringReport('org-001', new Date('2025-01-01'), new Date('2025-01-31'), sequelize);
 * ```
 */
export declare const generateRiskScoringReport: (organizationId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Assesses vulnerability for an asset
 *
 * @param {Partial<VulnerabilityAssessment>} vulnData - Vulnerability data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VulnerabilityAssessment>} Vulnerability assessment
 *
 * @example
 * ```typescript
 * const vuln = await assessVulnerability({
 *   assetId: 'server-001',
 *   vulnerabilityType: VulnerabilityType.SOFTWARE,
 *   cveId: 'CVE-2024-1234',
 *   description: 'Critical SQL injection vulnerability',
 * }, sequelize);
 * ```
 */
export declare const assessVulnerability: (vulnData: Partial<VulnerabilityAssessment>, sequelize: Sequelize, transaction?: Transaction) => Promise<VulnerabilityAssessment>;
/**
 * Calculates CVSS v3 score
 *
 * @param {string} vulnerabilityId - Vulnerability ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CVSSScore>} CVSS score breakdown
 *
 * @example
 * ```typescript
 * const cvss = await calculateCVSS('vuln-001', sequelize);
 * console.log(`CVSS Score: ${cvss.overallScore}, Severity: ${cvss.severity}`);
 * ```
 */
export declare const calculateCVSS: (vulnerabilityId: string, sequelize: Sequelize) => Promise<CVSSScore>;
/**
 * Scans assets for vulnerabilities
 *
 * @param {string[]} assetIds - Asset IDs to scan
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<VulnerabilityAssessment>>} Discovered vulnerabilities
 *
 * @example
 * ```typescript
 * const vulnerabilities = await scanAssetsForVulnerabilities(['server-001', 'server-002'], sequelize);
 * ```
 */
export declare const scanAssetsForVulnerabilities: (assetIds: string[], sequelize: Sequelize) => Promise<Array<VulnerabilityAssessment>>;
/**
 * Prioritizes vulnerabilities for remediation
 *
 * @param {string[]} vulnerabilityIds - Vulnerability IDs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{vulnerabilityId: string, priority: number, remediationEffort: string}>>} Prioritized list
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeVulnerabilities(['vuln-001', 'vuln-002', 'vuln-003'], sequelize);
 * ```
 */
export declare const prioritizeVulnerabilities: (vulnerabilityIds: string[], sequelize: Sequelize) => Promise<Array<{
    vulnerabilityId: string;
    priority: number;
    remediationEffort: string;
}>>;
/**
 * Generates vulnerability remediation plan
 *
 * @param {string} vulnerabilityId - Vulnerability ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{steps: string[], timeline: number, cost: number, resources: string[]}>} Remediation plan
 *
 * @example
 * ```typescript
 * const plan = await generateVulnerabilityRemediationPlan('vuln-001', sequelize);
 * ```
 */
export declare const generateVulnerabilityRemediationPlan: (vulnerabilityId: string, sequelize: Sequelize) => Promise<{
    steps: string[];
    timeline: number;
    cost: number;
    resources: string[];
}>;
/**
 * Generates risk heat map for organization
 *
 * @param {string} organizationId - Organization ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RiskHeatMap>} Risk heat map
 *
 * @example
 * ```typescript
 * const heatMap = await generateRiskHeatMap('org-001', sequelize);
 * ```
 */
export declare const generateRiskHeatMap: (organizationId: string, sequelize: Sequelize) => Promise<RiskHeatMap>;
/**
 * Visualizes risk matrix
 *
 * @param {RiskHeatMap} heatMap - Heat map data
 * @returns {Promise<string>} ASCII visualization
 *
 * @example
 * ```typescript
 * const visualization = await visualizeRiskMatrix(heatMap);
 * console.log(visualization);
 * ```
 */
export declare const visualizeRiskMatrix: (heatMap: RiskHeatMap) => Promise<string>;
/**
 * Generates departmental risk heat map
 *
 * @param {string} departmentId - Department ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<RiskHeatMap>} Department heat map
 *
 * @example
 * ```typescript
 * const deptHeatMap = await generateDepartmentRiskHeatMap('dept-IT', sequelize);
 * ```
 */
export declare const generateDepartmentRiskHeatMap: (departmentId: string, sequelize: Sequelize) => Promise<RiskHeatMap>;
/**
 * Compares heat maps across time periods
 *
 * @param {string} organizationId - Organization ID
 * @param {Date[]} periods - Periods to compare
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{period: Date, heatMap: RiskHeatMap}>>} Historical heat maps
 *
 * @example
 * ```typescript
 * const comparison = await compareHeatMapsOverTime('org-001', [
 *   new Date('2024-12-01'),
 *   new Date('2025-01-01'),
 * ], sequelize);
 * ```
 */
export declare const compareHeatMapsOverTime: (organizationId: string, periods: Date[], sequelize: Sequelize) => Promise<Array<{
    period: Date;
    heatMap: RiskHeatMap;
}>>;
/**
 * Exports heat map data in various formats
 *
 * @param {RiskHeatMap} heatMap - Heat map data
 * @param {string} format - Export format ('JSON' | 'CSV' | 'PDF')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportHeatMap(heatMap, 'PDF');
 * ```
 */
export declare const exportHeatMap: (heatMap: RiskHeatMap, format: string) => Promise<Buffer>;
/**
 * Conducts business impact analysis
 *
 * @param {Partial<BusinessImpactAnalysis>} biaData - BIA data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BusinessImpactAnalysis>} Business impact analysis
 *
 * @example
 * ```typescript
 * const bia = await conductBusinessImpactAnalysis({
 *   processName: 'Order Processing',
 *   criticalityLevel: 'CRITICAL',
 *   rto: 4,
 *   rpo: 1,
 *   financialImpact: { hourlyLoss: 50000, maximumTolerableloss: 500000, currency: 'USD' },
 * }, sequelize);
 * ```
 */
export declare const conductBusinessImpactAnalysis: (biaData: Partial<BusinessImpactAnalysis>, sequelize: Sequelize, transaction?: Transaction) => Promise<BusinessImpactAnalysis>;
/**
 * Calculates recovery time objectives
 *
 * @param {string} processId - Process ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{rto: number, rpo: number, mtd: number}>} Recovery objectives
 *
 * @example
 * ```typescript
 * const objectives = await calculateRecoveryObjectives('process-001', sequelize);
 * console.log(`RTO: ${objectives.rto} hours, RPO: ${objectives.rpo} hours`);
 * ```
 */
export declare const calculateRecoveryObjectives: (processId: string, sequelize: Sequelize) => Promise<{
    rto: number;
    rpo: number;
    mtd: number;
}>;
/**
 * Evaluates financial impact
 *
 * @param {string} processId - Process ID
 * @param {number} downtimeHours - Downtime duration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{totalLoss: number, breakdown: Record<string, number>}>} Financial impact
 *
 * @example
 * ```typescript
 * const impact = await evaluateFinancialImpact('process-001', 8, sequelize);
 * console.log(`Total financial loss: $${impact.totalLoss}`);
 * ```
 */
export declare const evaluateFinancialImpact: (processId: string, downtimeHours: number, sequelize: Sequelize) => Promise<{
    totalLoss: number;
    breakdown: Record<string, number>;
}>;
/**
 * Identifies critical business processes
 *
 * @param {string} organizationId - Organization ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<BusinessImpactAnalysis>>} Critical processes
 *
 * @example
 * ```typescript
 * const critical = await identifyCriticalProcesses('org-001', sequelize);
 * ```
 */
export declare const identifyCriticalProcesses: (organizationId: string, sequelize: Sequelize) => Promise<Array<BusinessImpactAnalysis>>;
/**
 * Generates BIA summary report
 *
 * @param {string} organizationId - Organization ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} BIA summary
 *
 * @example
 * ```typescript
 * const summary = await generateBIASummary('org-001', sequelize);
 * ```
 */
export declare const generateBIASummary: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const configureRiskAppetite: (appetite: Partial<RiskAppetite>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskAppetite>;
export declare const validateRiskAgainstAppetite: (riskId: string, sequelize: Sequelize) => Promise<{
    withinAppetite: boolean;
    exceedanceLevel: number;
}>;
export declare const getRiskAppetiteStatement: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const updateRiskToleranceLevels: (organizationId: string, tolerances: Record<RiskCategory, number>, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const generateAppetiteComplianceReport: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const createRiskAcceptance: (acceptance: Partial<RiskAcceptance>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskAcceptance>;
export declare const reviewRiskAcceptance: (acceptanceId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const revokeRiskAcceptance: (acceptanceId: string, reason: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const getAcceptedRisks: (organizationId: string, sequelize: Sequelize) => Promise<Array<RiskAcceptance>>;
export declare const notifyAcceptanceExpiry: (daysBeforeExpiry: number, sequelize: Sequelize) => Promise<string[]>;
export declare const createRiskRegisterEntry: (entry: Partial<RiskRegister>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskRegister>;
export declare const updateRiskRegisterEntry: (riskId: string, updates: Partial<RiskRegister>, sequelize: Sequelize) => Promise<RiskRegister>;
export declare const searchRiskRegister: (criteria: Record<string, any>, sequelize: Sequelize) => Promise<Array<RiskRegister>>;
export declare const exportRiskRegister: (organizationId: string, format: string, sequelize: Sequelize) => Promise<Buffer>;
export declare const archiveClosedRisks: (olderThanDays: number, sequelize: Sequelize) => Promise<number>;
export declare const developRiskTreatmentPlan: (plan: Partial<RiskTreatmentPlan>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskTreatmentPlan>;
export declare const trackTreatmentProgress: (planId: string, sequelize: Sequelize) => Promise<{
    progress: number;
    completedActions: number;
    totalActions: number;
}>;
export declare const calculateTreatmentEffectiveness: (planId: string, sequelize: Sequelize) => Promise<{
    effectiveness: number;
    riskReduction: number;
}>;
export declare const optimizeTreatmentCosts: (planIds: string[], sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const approveTreatmentPlan: (planId: string, approver: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const monitorRiskIndicators: (riskId: string, sequelize: Sequelize) => Promise<Array<{
    indicator: string;
    value: number;
    threshold: number;
    status: string;
}>>;
export declare const generateRiskDashboard: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const createRiskAlert: (alertData: Record<string, any>, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const generateExecutiveRiskReport: (organizationId: string, period: string, sequelize: Sequelize) => Promise<Record<string, any>>;
export declare const assessThirdPartyRisk: (vendorId: string, sequelize: Sequelize) => Promise<ThirdPartyRisk>;
declare const _default: {
    calculateRiskScore: (riskData: Partial<RiskScore>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskScore>;
    prioritizeRisks: (riskIds: string[], sequelize: Sequelize) => Promise<Array<{
        riskId: string;
        priority: number;
        riskLevel: RiskLevel;
    }>>;
    calculateRiskVelocity: (riskId: string, lookbackDays: number, sequelize: Sequelize) => Promise<{
        velocity: number;
        trend: "INCREASING" | "STABLE" | "DECREASING";
    }>;
    aggregateRiskScoresByCategory: (category: RiskCategory, sequelize: Sequelize) => Promise<{
        category: RiskCategory;
        totalRisks: number;
        averageScore: number;
        distribution: Record<RiskLevel, number>;
    }>;
    generateRiskScoringReport: (organizationId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
    assessVulnerability: (vulnData: Partial<VulnerabilityAssessment>, sequelize: Sequelize, transaction?: Transaction) => Promise<VulnerabilityAssessment>;
    calculateCVSS: (vulnerabilityId: string, sequelize: Sequelize) => Promise<CVSSScore>;
    scanAssetsForVulnerabilities: (assetIds: string[], sequelize: Sequelize) => Promise<Array<VulnerabilityAssessment>>;
    prioritizeVulnerabilities: (vulnerabilityIds: string[], sequelize: Sequelize) => Promise<Array<{
        vulnerabilityId: string;
        priority: number;
        remediationEffort: string;
    }>>;
    generateVulnerabilityRemediationPlan: (vulnerabilityId: string, sequelize: Sequelize) => Promise<{
        steps: string[];
        timeline: number;
        cost: number;
        resources: string[];
    }>;
    generateRiskHeatMap: (organizationId: string, sequelize: Sequelize) => Promise<RiskHeatMap>;
    visualizeRiskMatrix: (heatMap: RiskHeatMap) => Promise<string>;
    generateDepartmentRiskHeatMap: (departmentId: string, sequelize: Sequelize) => Promise<RiskHeatMap>;
    compareHeatMapsOverTime: (organizationId: string, periods: Date[], sequelize: Sequelize) => Promise<Array<{
        period: Date;
        heatMap: RiskHeatMap;
    }>>;
    exportHeatMap: (heatMap: RiskHeatMap, format: string) => Promise<Buffer>;
    conductBusinessImpactAnalysis: (biaData: Partial<BusinessImpactAnalysis>, sequelize: Sequelize, transaction?: Transaction) => Promise<BusinessImpactAnalysis>;
    calculateRecoveryObjectives: (processId: string, sequelize: Sequelize) => Promise<{
        rto: number;
        rpo: number;
        mtd: number;
    }>;
    evaluateFinancialImpact: (processId: string, downtimeHours: number, sequelize: Sequelize) => Promise<{
        totalLoss: number;
        breakdown: Record<string, number>;
    }>;
    identifyCriticalProcesses: (organizationId: string, sequelize: Sequelize) => Promise<Array<BusinessImpactAnalysis>>;
    generateBIASummary: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    configureRiskAppetite: (appetite: Partial<RiskAppetite>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskAppetite>;
    validateRiskAgainstAppetite: (riskId: string, sequelize: Sequelize) => Promise<{
        withinAppetite: boolean;
        exceedanceLevel: number;
    }>;
    getRiskAppetiteStatement: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    updateRiskToleranceLevels: (organizationId: string, tolerances: Record<RiskCategory, number>, sequelize: Sequelize) => Promise<Record<string, any>>;
    generateAppetiteComplianceReport: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    createRiskAcceptance: (acceptance: Partial<RiskAcceptance>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskAcceptance>;
    reviewRiskAcceptance: (acceptanceId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    revokeRiskAcceptance: (acceptanceId: string, reason: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    getAcceptedRisks: (organizationId: string, sequelize: Sequelize) => Promise<Array<RiskAcceptance>>;
    notifyAcceptanceExpiry: (daysBeforeExpiry: number, sequelize: Sequelize) => Promise<string[]>;
    createRiskRegisterEntry: (entry: Partial<RiskRegister>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskRegister>;
    updateRiskRegisterEntry: (riskId: string, updates: Partial<RiskRegister>, sequelize: Sequelize) => Promise<RiskRegister>;
    searchRiskRegister: (criteria: Record<string, any>, sequelize: Sequelize) => Promise<Array<RiskRegister>>;
    exportRiskRegister: (organizationId: string, format: string, sequelize: Sequelize) => Promise<Buffer>;
    archiveClosedRisks: (olderThanDays: number, sequelize: Sequelize) => Promise<number>;
    developRiskTreatmentPlan: (plan: Partial<RiskTreatmentPlan>, sequelize: Sequelize, transaction?: Transaction) => Promise<RiskTreatmentPlan>;
    trackTreatmentProgress: (planId: string, sequelize: Sequelize) => Promise<{
        progress: number;
        completedActions: number;
        totalActions: number;
    }>;
    calculateTreatmentEffectiveness: (planId: string, sequelize: Sequelize) => Promise<{
        effectiveness: number;
        riskReduction: number;
    }>;
    optimizeTreatmentCosts: (planIds: string[], sequelize: Sequelize) => Promise<Record<string, any>>;
    approveTreatmentPlan: (planId: string, approver: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    monitorRiskIndicators: (riskId: string, sequelize: Sequelize) => Promise<Array<{
        indicator: string;
        value: number;
        threshold: number;
        status: string;
    }>>;
    generateRiskDashboard: (organizationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    createRiskAlert: (alertData: Record<string, any>, sequelize: Sequelize) => Promise<Record<string, any>>;
    generateExecutiveRiskReport: (organizationId: string, period: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    assessThirdPartyRisk: (vendorId: string, sequelize: Sequelize) => Promise<ThirdPartyRisk>;
};
export default _default;
//# sourceMappingURL=risk-analysis-kit.d.ts.map