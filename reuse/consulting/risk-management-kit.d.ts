/**
 * LOC: CONSRISK89012
 * File: /reuse/consulting/risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Consulting engagement services
 *   - Risk advisory controllers
 *   - ERM and compliance modules
 *   - Governance services
 */
/**
 * File: /reuse/consulting/risk-management-kit.ts
 * Locator: WC-CONS-RISKMGMT-001
 * Purpose: McKinsey/BCG-Level Risk Management - COSO framework, ISO 31000, risk matrices, Monte Carlo, ERM
 *
 * Upstream: Independent risk management utility module
 * Downstream: ../backend/*, Consulting controllers, Risk advisory services, ERM modules, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js, mathjs
 * Exports: 50+ utility functions for COSO implementation, ISO 31000 compliance, risk assessment, risk matrices, heat maps, Monte Carlo simulation
 *
 * LLM Context: Enterprise-grade risk management competing with McKinsey and BCG ERM capabilities.
 * Provides comprehensive COSO framework implementation, ISO 31000 risk management standards, enterprise risk management (ERM),
 * risk identification and assessment, risk scoring and rating methodologies, risk matrices and heat maps, Monte Carlo simulation,
 * operational risk management, strategic risk assessment, compliance risk frameworks, financial risk management, risk mitigation strategies,
 * risk monitoring and reporting, key risk indicators (KRIs), risk appetite and tolerance frameworks, risk control assessment,
 * three lines of defense model, bow-tie analysis, failure mode analysis (FMEA), root cause analysis, scenario-based risk assessment,
 * and integrated risk governance with audit trails and regulatory compliance.
 */
import { Sequelize } from 'sequelize';
export declare enum RiskFramework {
    COSO_ERM = "coso-erm",
    ISO_31000 = "iso-31000",
    NIST = "nist",
    BASEL_III = "basel-iii",
    SOX = "sox",
    COBIT = "cobit"
}
export declare enum RiskCategory {
    STRATEGIC = "strategic",
    OPERATIONAL = "operational",
    FINANCIAL = "financial",
    COMPLIANCE = "compliance",
    REPUTATIONAL = "reputational",
    TECHNOLOGY = "technology",
    ENVIRONMENTAL = "environmental",
    MARKET = "market"
}
export declare enum RiskLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NEGLIGIBLE = "negligible"
}
export declare enum RiskStatus {
    IDENTIFIED = "identified",
    ASSESSED = "assessed",
    MITIGATED = "mitigated",
    MONITORED = "monitored",
    CLOSED = "closed",
    ESCALATED = "escalated"
}
export declare enum RiskTreatment {
    AVOID = "avoid",
    MITIGATE = "mitigate",
    TRANSFER = "transfer",
    ACCEPT = "accept"
}
export declare enum ControlType {
    PREVENTIVE = "preventive",
    DETECTIVE = "detective",
    CORRECTIVE = "corrective",
    DIRECTIVE = "directive"
}
export declare enum ControlEffectiveness {
    EFFECTIVE = "effective",
    PARTIALLY_EFFECTIVE = "partially-effective",
    INEFFECTIVE = "ineffective",
    NOT_TESTED = "not-tested"
}
export declare enum COSOComponent {
    GOVERNANCE_CULTURE = "governance-culture",
    STRATEGY_OBJECTIVE = "strategy-objective",
    PERFORMANCE = "performance",
    REVIEW_REVISION = "review-revision",
    INFORMATION_COMMUNICATION = "information-communication"
}
export declare enum COSOPrinciple {
    OVERSIGHT = "oversight",
    INDEPENDENCE = "independence",
    COMPETENCE = "competence",
    ACCOUNTABILITY = "accountability",
    INTEGRITY = "integrity"
}
export declare enum ISO31000Process {
    COMMUNICATION = "communication",
    SCOPE_CONTEXT = "scope-context",
    RISK_ASSESSMENT = "risk-assessment",
    RISK_TREATMENT = "risk-treatment",
    MONITORING_REVIEW = "monitoring-review",
    RECORDING_REPORTING = "recording-reporting"
}
export interface RiskRegister {
    id: string;
    organizationId: string;
    framework: RiskFramework;
    risks: Risk[];
    lastReviewDate: Date;
    nextReviewDate: Date;
    status: string;
    metadata: Record<string, any>;
}
export interface Risk {
    riskId: string;
    riskTitle: string;
    riskDescription: string;
    category: RiskCategory;
    subCategory: string;
    owner: string;
    identifiedDate: Date;
    identifiedBy: string;
    inherentRiskScore: RiskScore;
    controls: RiskControl[];
    residualRiskScore: RiskScore;
    treatment: RiskTreatment;
    mitigationPlan: MitigationPlan;
    status: RiskStatus;
    reviewFrequency: string;
    lastReviewDate: Date;
    nextReviewDate: Date;
    kris: KeyRiskIndicator[];
    relatedRisks: string[];
    metadata: Record<string, any>;
}
export interface RiskScore {
    likelihood: number;
    impact: number;
    riskLevel: RiskLevel;
    score: number;
    methodology: string;
    assessmentDate: Date;
    assessedBy: string;
    confidenceLevel?: number;
}
export interface RiskControl {
    controlId: string;
    controlName: string;
    controlDescription: string;
    controlType: ControlType;
    controlOwner: string;
    implementationStatus: string;
    effectiveness: ControlEffectiveness;
    testingFrequency: string;
    lastTestDate: Date;
    nextTestDate: Date;
    automationLevel: number;
    cost: number;
    riskReduction: number;
    evidenceDocumentation: string[];
    deficiencies: ControlDeficiency[];
}
export interface ControlDeficiency {
    deficiencyId: string;
    severity: string;
    description: string;
    identifiedDate: Date;
    remediationPlan: string;
    targetDate: Date;
    status: string;
}
export interface MitigationPlan {
    planId: string;
    objective: string;
    actions: MitigationAction[];
    totalCost: number;
    expectedRiskReduction: number;
    timeline: number;
    status: string;
    progress: number;
}
export interface MitigationAction {
    actionId: string;
    description: string;
    owner: string;
    startDate: Date;
    targetDate: Date;
    actualCompletionDate?: Date;
    cost: number;
    status: string;
    dependencies: string[];
}
export interface KeyRiskIndicator {
    kriId: string;
    kriName: string;
    description: string;
    metric: string;
    currentValue: number;
    threshold: number;
    tolerance: number;
    trend: 'improving' | 'stable' | 'deteriorating';
    frequency: string;
    dataSource: string;
    lastUpdated: Date;
    alertStatus: 'green' | 'yellow' | 'red';
}
export interface RiskMatrix {
    matrixId: string;
    name: string;
    dimensions: number;
    likelihoodScale: RiskScale;
    impactScale: RiskScale;
    cells: RiskMatrixCell[][];
    colorCoding: Record<string, string>;
}
export interface RiskScale {
    levels: number;
    descriptors: string[];
    definitions: string[];
    numericValues: number[];
}
export interface RiskMatrixCell {
    likelihood: number;
    impact: number;
    riskLevel: RiskLevel;
    color: string;
    score: number;
}
export interface RiskHeatMap {
    heatMapId: string;
    name: string;
    risks: RiskPlotPoint[];
    quadrants: HeatMapQuadrant[];
    concentrationAnalysis: ConcentrationAnalysis;
}
export interface RiskPlotPoint {
    riskId: string;
    riskName: string;
    x: number;
    y: number;
    size: number;
    category: RiskCategory;
    riskLevel: RiskLevel;
}
export interface HeatMapQuadrant {
    name: string;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    riskLevel: RiskLevel;
    recommendedAction: string;
}
export interface ConcentrationAnalysis {
    topRisks: Risk[];
    risksByCategory: Record<RiskCategory, number>;
    risksByLevel: Record<RiskLevel, number>;
    concentrationScore: number;
    diversificationRecommendations: string[];
}
export interface RiskAppetite {
    organizationId: string;
    framework: RiskFramework;
    overallAppetite: string;
    appetiteByCategory: Record<RiskCategory, AppetiteStatement>;
    toleranceLimits: ToleranceLimit[];
    approvedBy: string;
    approvedDate: Date;
    reviewDate: Date;
}
export interface AppetiteStatement {
    category: RiskCategory;
    statement: string;
    quantitativeMetrics: QuantitativeMetric[];
    qualitativeDescriptors: string[];
}
export interface QuantitativeMetric {
    metricName: string;
    currentValue: number;
    appetiteLimit: number;
    toleranceLimit: number;
    unit: string;
}
export interface ToleranceLimit {
    limitId: string;
    riskType: string;
    metric: string;
    appetiteThreshold: number;
    toleranceThreshold: number;
    currentValue: number;
    status: 'within-appetite' | 'within-tolerance' | 'exceeded';
}
export interface COSOAssessment {
    assessmentId: string;
    organizationId: string;
    assessmentDate: Date;
    components: COSOComponentAssessment[];
    principles: COSOPrincipleAssessment[];
    overallMaturity: number;
    gaps: string[];
    recommendations: string[];
    status: string;
}
export interface COSOComponentAssessment {
    component: COSOComponent;
    maturityLevel: number;
    strengths: string[];
    weaknesses: string[];
    evidence: string[];
    score: number;
}
export interface COSOPrincipleAssessment {
    principle: COSOPrinciple;
    present: boolean;
    functioning: boolean;
    evidence: string[];
    deficiencies: string[];
}
export interface ISO31000Assessment {
    assessmentId: string;
    organizationId: string;
    assessmentDate: Date;
    processes: ISO31000ProcessAssessment[];
    framework: FrameworkAssessment;
    overallCompliance: number;
    gaps: string[];
    recommendations: string[];
}
export interface ISO31000ProcessAssessment {
    process: ISO31000Process;
    implemented: boolean;
    effectiveness: number;
    evidence: string[];
    improvements: string[];
}
export interface FrameworkAssessment {
    leadership: number;
    integration: number;
    design: number;
    implementation: number;
    evaluation: number;
    improvement: number;
}
export interface MonteCarloRiskSimulation {
    simulationId: string;
    riskScenario: string;
    iterations: number;
    variables: SimulationVariable[];
    results: SimulationResults;
    sensitivityAnalysis: Record<string, number>;
}
export interface SimulationVariable {
    variableName: string;
    distribution: 'normal' | 'uniform' | 'triangular' | 'lognormal' | 'beta';
    parameters: Record<string, number>;
    correlation?: Record<string, number>;
}
export interface SimulationResults {
    mean: number;
    median: number;
    stdDev: number;
    variance: number;
    min: number;
    max: number;
    p5: number;
    p10: number;
    p25: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
    confidenceIntervals: ConfidenceInterval[];
    histogram: HistogramBin[];
}
export interface ConfidenceInterval {
    confidence: number;
    lowerBound: number;
    upperBound: number;
}
export interface HistogramBin {
    binStart: number;
    binEnd: number;
    frequency: number;
    probability: number;
}
export interface BowTieAnalysis {
    bowTieId: string;
    hazard: string;
    topEvent: string;
    threats: Threat[];
    preventiveControls: RiskControl[];
    consequences: Consequence[];
    mitigatingControls: RiskControl[];
    escalationFactors: string[];
    recoveryMeasures: string[];
}
export interface Threat {
    threatId: string;
    description: string;
    likelihood: number;
    controls: string[];
}
export interface Consequence {
    consequenceId: string;
    description: string;
    severity: number;
    controls: string[];
}
export interface FMEAAnalysis {
    fmeaId: string;
    process: string;
    failureModes: FailureMode[];
    priorityActions: string[];
    overallRPN: number;
}
export interface FailureMode {
    failureModeId: string;
    description: string;
    effects: string[];
    severity: number;
    causes: string[];
    occurrence: number;
    currentControls: string[];
    detection: number;
    rpn: number;
    recommendedActions: string[];
}
export interface RootCauseAnalysis {
    rcaId: string;
    incident: string;
    methodology: '5-whys' | 'fishbone' | 'fault-tree';
    rootCauses: RootCause[];
    contributingFactors: string[];
    correctiveActions: CorrectiveAction[];
    preventiveActions: PreventiveAction[];
}
export interface RootCause {
    causeId: string;
    description: string;
    category: string;
    evidenceSupporting: string[];
    likelihood: number;
}
export interface CorrectiveAction {
    actionId: string;
    description: string;
    owner: string;
    targetDate: Date;
    status: string;
    effectiveness: number;
}
export interface PreventiveAction {
    actionId: string;
    description: string;
    scope: string;
    implementation: string;
    monitoring: string;
}
export interface ThreeLinesModel {
    organizationId: string;
    firstLine: DefenseLineDescription;
    secondLine: DefenseLineDescription;
    thirdLine: DefenseLineDescription;
    governanceStructure: GovernanceStructure;
    effectivenessRating: number;
}
export interface DefenseLineDescription {
    line: number;
    roles: string[];
    responsibilities: string[];
    functions: string[];
    resources: ResourceAllocation[];
    independence: number;
    effectiveness: number;
}
export interface ResourceAllocation {
    resourceType: string;
    allocation: number;
    adequacy: 'adequate' | 'marginal' | 'inadequate';
}
export interface GovernanceStructure {
    board: BoardOversight;
    committees: CommitteeStructure[];
    reportingLines: ReportingLine[];
    escalationProcess: string;
}
export interface BoardOversight {
    riskOversight: boolean;
    frequency: string;
    expertise: number;
    independence: number;
}
export interface CommitteeStructure {
    committeeName: string;
    charter: string;
    members: string[];
    meetingFrequency: string;
    responsibilities: string[];
}
export interface ReportingLine {
    from: string;
    to: string;
    frequency: string;
    content: string[];
}
/**
 * Sequelize model for Risk Register with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskRegister model
 *
 * @example
 * ```typescript
 * const RiskRegister = createRiskRegisterModel(sequelize);
 * const register = await RiskRegister.create({
 *   organizationId: 'ORG_001',
 *   framework: 'coso-erm',
 *   risks: []
 * });
 * ```
 */
export declare const createRiskRegisterModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        registerId: string;
        organizationId: string;
        organizationName: string;
        framework: string;
        risks: Record<string, any>[];
        totalRisks: number;
        criticalRisks: number;
        highRisks: number;
        mediumRisks: number;
        lowRisks: number;
        lastReviewDate: Date;
        nextReviewDate: Date;
        reviewedBy: string;
        status: string;
        metadata: Record<string, any>;
        createdBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskAssessment model
 */
export declare const createRiskAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assessmentId: string;
        riskId: string;
        registerId: string;
        riskTitle: string;
        riskDescription: string;
        category: string;
        subCategory: string;
        owner: string;
        assessmentDate: Date;
        assessedBy: string;
        likelihoodScore: number;
        impactScore: number;
        inherentRiskScore: number;
        inherentRiskLevel: string;
        controlEffectiveness: number;
        residualRiskScore: number;
        residualRiskLevel: string;
        treatment: string;
        status: string;
        methodology: string;
        confidenceLevel: number;
        reviewFrequency: string;
        nextReviewDate: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Risk Controls.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RiskControl model
 */
export declare const createRiskControlModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        controlId: string;
        riskId: string;
        controlName: string;
        controlDescription: string;
        controlType: string;
        controlOwner: string;
        implementationStatus: string;
        effectiveness: string;
        testingFrequency: string;
        lastTestDate: Date;
        nextTestDate: Date;
        testResults: string;
        automationLevel: number;
        cost: number;
        riskReduction: number;
        evidenceDocumentation: string[];
        deficiencies: Record<string, any>[];
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for COSO Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} COSOAssessment model
 */
export declare const createCOSOAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        assessmentId: string;
        organizationId: string;
        assessmentDate: Date;
        assessmentPeriod: string;
        components: Record<string, any>[];
        principles: Record<string, any>[];
        overallMaturity: number;
        maturityLevel: string;
        gaps: string[];
        strengths: string[];
        recommendations: string[];
        actionPlan: Record<string, any>[];
        status: string;
        assessedBy: string;
        reviewedBy: string;
        approvedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
export declare class CreateRiskDto {
    riskTitle: string;
    riskDescription: string;
    category: RiskCategory;
    subCategory: string;
    owner: string;
    likelihood: number;
    impact: number;
    treatment: RiskTreatment;
    identifiedBy: string;
}
export declare class AssessRiskDto {
    riskId: string;
    likelihood: number;
    impact: number;
    methodology: string;
    confidenceLevel?: number;
    assessedBy: string;
}
export declare class CreateControlDto {
    riskId: string;
    controlName: string;
    controlDescription: string;
    controlType: ControlType;
    controlOwner: string;
    riskReduction?: number;
    cost?: number;
}
export declare class CreateRiskMatrixDto {
    name: string;
    dimensions: number;
    organizationId: string;
}
export declare class RunMonteCarloDto {
    riskScenario: string;
    iterations: number;
    variables: SimulationVariable[];
}
export declare class CreateCOSOAssessmentDto {
    organizationId: string;
    assessmentPeriod: string;
    assessedBy: string;
}
export declare class UpdateRiskAppetiteDto {
    organizationId: string;
    overallAppetite: string;
    appetiteByCategory: Record<RiskCategory, AppetiteStatement>;
    approvedBy: string;
}
/**
 * Calculate inherent risk score.
 *
 * @param {number} likelihood - Likelihood score (1-5)
 * @param {number} impact - Impact score (1-5)
 * @returns {RiskScore} Risk score details
 *
 * @example
 * ```typescript
 * const inherentRisk = calculateInherentRiskScore(4, 5);
 * console.log(`Risk Level: ${inherentRisk.riskLevel}`);
 * console.log(`Risk Score: ${inherentRisk.score}`);
 * ```
 */
export declare function calculateInherentRiskScore(likelihood: number, impact: number): Partial<RiskScore>;
/**
 * Calculate residual risk score after controls.
 *
 * @param {RiskScore} inherentRisk - Inherent risk score
 * @param {RiskControl[]} controls - Risk controls
 * @returns {RiskScore} Residual risk score
 *
 * @example
 * ```typescript
 * const residualRisk = calculateResidualRiskScore(inherentRisk, controls);
 * console.log(`Residual Risk Level: ${residualRisk.riskLevel}`);
 * console.log(`Risk Reduction: ${((1 - residualRisk.score / inherentRisk.score) * 100).toFixed(2)}%`);
 * ```
 */
export declare function calculateResidualRiskScore(inherentRisk: Partial<RiskScore>, controls: RiskControl[]): Partial<RiskScore>;
/**
 * Generate risk matrix.
 *
 * @param {number} dimensions - Matrix dimensions (e.g., 5 for 5x5)
 * @param {string} name - Matrix name
 * @returns {RiskMatrix} Risk matrix
 *
 * @example
 * ```typescript
 * const matrix = generateRiskMatrix(5, 'Standard 5x5 Risk Matrix');
 * console.log(`Matrix has ${matrix.cells.length}x${matrix.cells[0].length} cells`);
 * ```
 */
export declare function generateRiskMatrix(dimensions: number, name: string): RiskMatrix;
/**
 * Generate risk heat map.
 *
 * @param {Risk[]} risks - Array of risks
 * @param {string} name - Heat map name
 * @returns {RiskHeatMap} Risk heat map
 *
 * @example
 * ```typescript
 * const heatMap = generateRiskHeatMap(risks, 'Q4 2024 Risk Heat Map');
 * console.log(`Total risks plotted: ${heatMap.risks.length}`);
 * console.log(`Critical risks: ${heatMap.concentrationAnalysis.risksByLevel.critical}`);
 * ```
 */
export declare function generateRiskHeatMap(risks: Risk[], name: string): RiskHeatMap;
/**
 * Assess COSO ERM framework compliance.
 *
 * @param {string} organizationId - Organization identifier
 * @param {COSOComponentAssessment[]} componentAssessments - Component assessments
 * @param {COSOPrincipleAssessment[]} principleAssessments - Principle assessments
 * @returns {COSOAssessment} COSO assessment results
 *
 * @example
 * ```typescript
 * const cosoAssessment = assessCOSOCompliance(
 *   'ORG_001',
 *   componentAssessments,
 *   principleAssessments
 * );
 * console.log(`Overall Maturity: ${cosoAssessment.overallMaturity}%`);
 * ```
 */
export declare function assessCOSOCompliance(organizationId: string, componentAssessments: COSOComponentAssessment[], principleAssessments: COSOPrincipleAssessment[]): Partial<COSOAssessment>;
/**
 * Assess COSO component maturity.
 *
 * @param {COSOComponent} component - COSO component
 * @param {string[]} strengths - Identified strengths
 * @param {string[]} weaknesses - Identified weaknesses
 * @param {string[]} evidence - Supporting evidence
 * @returns {COSOComponentAssessment} Component assessment
 *
 * @example
 * ```typescript
 * const componentAssessment = assessCOSOComponent(
 *   COSOComponent.GOVERNANCE_CULTURE,
 *   ['Strong board oversight', 'Clear risk appetite'],
 *   ['Limited risk training', 'Inconsistent tone from top'],
 *   ['Board minutes', 'Risk appetite statement']
 * );
 * ```
 */
export declare function assessCOSOComponent(component: COSOComponent, strengths: string[], weaknesses: string[], evidence: string[]): COSOComponentAssessment;
/**
 * Assess ISO 31000 compliance.
 *
 * @param {string} organizationId - Organization identifier
 * @param {ISO31000ProcessAssessment[]} processAssessments - Process assessments
 * @param {FrameworkAssessment} frameworkAssessment - Framework assessment
 * @returns {ISO31000Assessment} ISO 31000 assessment results
 *
 * @example
 * ```typescript
 * const iso31000Assessment = assessISO31000Compliance(
 *   'ORG_001',
 *   processAssessments,
 *   frameworkAssessment
 * );
 * console.log(`Overall Compliance: ${iso31000Assessment.overallCompliance}%`);
 * ```
 */
export declare function assessISO31000Compliance(organizationId: string, processAssessments: ISO31000ProcessAssessment[], frameworkAssessment: FrameworkAssessment): Partial<ISO31000Assessment>;
/**
 * Perform Monte Carlo risk simulation.
 *
 * @param {string} riskScenario - Risk scenario description
 * @param {SimulationVariable[]} variables - Simulation variables
 * @param {number} iterations - Number of iterations
 * @returns {Promise<MonteCarloRiskSimulation>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await performMonteCarloRiskSimulation(
 *   'Revenue Loss Scenario',
 *   [
 *     { variableName: 'demandReduction', distribution: 'normal', parameters: { mean: 0.15, stdDev: 0.05 } },
 *     { variableName: 'priceImpact', distribution: 'triangular', parameters: { min: -0.20, mode: -0.10, max: 0 } }
 *   ],
 *   10000
 * );
 * console.log(`Expected Loss: $${simulation.results.mean.toLocaleString()}`);
 * console.log(`95% VaR: $${simulation.results.p95.toLocaleString()}`);
 * ```
 */
export declare function performMonteCarloRiskSimulation(riskScenario: string, variables: SimulationVariable[], iterations: number): Promise<MonteCarloRiskSimulation>;
/**
 * Perform bow-tie risk analysis.
 *
 * @param {string} hazard - Hazard description
 * @param {string} topEvent - Top event (unwanted outcome)
 * @param {Threat[]} threats - Threats leading to top event
 * @param {Consequence[]} consequences - Consequences of top event
 * @param {RiskControl[]} controls - Risk controls
 * @returns {BowTieAnalysis} Bow-tie analysis
 *
 * @example
 * ```typescript
 * const bowTie = performBowTieAnalysis(
 *   'Cybersecurity Breach',
 *   'Data Breach',
 *   threats,
 *   consequences,
 *   controls
 * );
 * console.log(`Total threats: ${bowTie.threats.length}`);
 * console.log(`Total consequences: ${bowTie.consequences.length}`);
 * ```
 */
export declare function performBowTieAnalysis(hazard: string, topEvent: string, threats: Threat[], consequences: Consequence[], controls: RiskControl[]): BowTieAnalysis;
/**
 * Perform Failure Mode and Effects Analysis (FMEA).
 *
 * @param {string} process - Process name
 * @param {FailureMode[]} failureModes - Failure modes
 * @returns {FMEAAnalysis} FMEA analysis
 *
 * @example
 * ```typescript
 * const fmea = performFMEA('Order Processing', failureModes);
 * console.log(`Overall RPN: ${fmea.overallRPN}`);
 * console.log(`High priority actions: ${fmea.priorityActions.length}`);
 * ```
 */
export declare function performFMEA(process: string, failureModes: FailureMode[]): FMEAAnalysis;
/**
 * Calculate FMEA Risk Priority Number (RPN).
 *
 * @param {number} severity - Severity rating (1-10)
 * @param {number} occurrence - Occurrence rating (1-10)
 * @param {number} detection - Detection rating (1-10)
 * @returns {number} RPN value
 *
 * @example
 * ```typescript
 * const rpn = calculateRPN(8, 6, 4);
 * console.log(`RPN: ${rpn}`); // 192
 * ```
 */
export declare function calculateRPN(severity: number, occurrence: number, detection: number): number;
/**
 * Perform root cause analysis.
 *
 * @param {string} incident - Incident description
 * @param {string} methodology - RCA methodology
 * @param {RootCause[]} rootCauses - Identified root causes
 * @param {string[]} contributingFactors - Contributing factors
 * @returns {RootCauseAnalysis} Root cause analysis
 *
 * @example
 * ```typescript
 * const rca = performRootCauseAnalysis(
 *   'System Outage - March 2024',
 *   '5-whys',
 *   rootCauses,
 *   contributingFactors
 * );
 * ```
 */
export declare function performRootCauseAnalysis(incident: string, methodology: '5-whys' | 'fishbone' | 'fault-tree', rootCauses: RootCause[], contributingFactors: string[]): Partial<RootCauseAnalysis>;
/**
 * Assess three lines of defense model effectiveness.
 *
 * @param {string} organizationId - Organization identifier
 * @param {DefenseLineDescription} firstLine - First line of defense
 * @param {DefenseLineDescription} secondLine - Second line of defense
 * @param {DefenseLineDescription} thirdLine - Third line of defense
 * @param {GovernanceStructure} governance - Governance structure
 * @returns {ThreeLinesModel} Three lines assessment
 *
 * @example
 * ```typescript
 * const threeLinesAssessment = assessThreeLinesOfDefense(
 *   'ORG_001',
 *   firstLine,
 *   secondLine,
 *   thirdLine,
 *   governance
 * );
 * console.log(`Overall Effectiveness: ${threeLinesAssessment.effectivenessRating}%`);
 * ```
 */
export declare function assessThreeLinesOfDefense(organizationId: string, firstLine: DefenseLineDescription, secondLine: DefenseLineDescription, thirdLine: DefenseLineDescription, governance: GovernanceStructure): ThreeLinesModel;
/**
 * Define organizational risk appetite.
 *
 * @param {string} organizationId - Organization identifier
 * @param {RiskFramework} framework - Risk framework
 * @param {string} overallAppetite - Overall appetite statement
 * @param {Record<RiskCategory, AppetiteStatement>} appetiteByCategory - Category-specific appetite
 * @param {string} approvedBy - Approver identifier
 * @returns {RiskAppetite} Risk appetite
 *
 * @example
 * ```typescript
 * const riskAppetite = defineRiskAppetite(
 *   'ORG_001',
 *   RiskFramework.COSO_ERM,
 *   'Moderate risk appetite for growth',
 *   appetiteStatements,
 *   'CEO_001'
 * );
 * ```
 */
export declare function defineRiskAppetite(organizationId: string, framework: RiskFramework, overallAppetite: string, appetiteByCategory: Record<RiskCategory, AppetiteStatement>, approvedBy: string): RiskAppetite;
declare const _default: {
    createRiskRegisterModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            registerId: string;
            organizationId: string;
            organizationName: string;
            framework: string;
            risks: Record<string, any>[];
            totalRisks: number;
            criticalRisks: number;
            highRisks: number;
            mediumRisks: number;
            lowRisks: number;
            lastReviewDate: Date;
            nextReviewDate: Date;
            reviewedBy: string;
            status: string;
            metadata: Record<string, any>;
            createdBy: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRiskAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            assessmentId: string;
            riskId: string;
            registerId: string;
            riskTitle: string;
            riskDescription: string;
            category: string;
            subCategory: string;
            owner: string;
            assessmentDate: Date;
            assessedBy: string;
            likelihoodScore: number;
            impactScore: number;
            inherentRiskScore: number;
            inherentRiskLevel: string;
            controlEffectiveness: number;
            residualRiskScore: number;
            residualRiskLevel: string;
            treatment: string;
            status: string;
            methodology: string;
            confidenceLevel: number;
            reviewFrequency: string;
            nextReviewDate: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRiskControlModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            controlId: string;
            riskId: string;
            controlName: string;
            controlDescription: string;
            controlType: string;
            controlOwner: string;
            implementationStatus: string;
            effectiveness: string;
            testingFrequency: string;
            lastTestDate: Date;
            nextTestDate: Date;
            testResults: string;
            automationLevel: number;
            cost: number;
            riskReduction: number;
            evidenceDocumentation: string[];
            deficiencies: Record<string, any>[];
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCOSOAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            assessmentId: string;
            organizationId: string;
            assessmentDate: Date;
            assessmentPeriod: string;
            components: Record<string, any>[];
            principles: Record<string, any>[];
            overallMaturity: number;
            maturityLevel: string;
            gaps: string[];
            strengths: string[];
            recommendations: string[];
            actionPlan: Record<string, any>[];
            status: string;
            assessedBy: string;
            reviewedBy: string;
            approvedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    calculateInherentRiskScore: typeof calculateInherentRiskScore;
    calculateResidualRiskScore: typeof calculateResidualRiskScore;
    generateRiskMatrix: typeof generateRiskMatrix;
    generateRiskHeatMap: typeof generateRiskHeatMap;
    assessCOSOCompliance: typeof assessCOSOCompliance;
    assessCOSOComponent: typeof assessCOSOComponent;
    assessISO31000Compliance: typeof assessISO31000Compliance;
    performMonteCarloRiskSimulation: typeof performMonteCarloRiskSimulation;
    performBowTieAnalysis: typeof performBowTieAnalysis;
    performFMEA: typeof performFMEA;
    calculateRPN: typeof calculateRPN;
    performRootCauseAnalysis: typeof performRootCauseAnalysis;
    assessThreeLinesOfDefense: typeof assessThreeLinesOfDefense;
    defineRiskAppetite: typeof defineRiskAppetite;
};
export default _default;
//# sourceMappingURL=risk-management-kit.d.ts.map