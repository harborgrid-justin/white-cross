/**
 * LOC: RISK_MANAGEMENT_INTERNAL_CONTROLS_KIT_001
 * File: /reuse/government/risk-management-internal-controls-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Risk management services
 *   - Internal audit modules
 *   - Control testing systems
 *   - Enterprise risk dashboard
 *   - Compliance monitoring services
 *   - Third-party risk management
 */
/**
 * Enterprise risk assessment
 */
export interface EnterpriseRiskAssessment {
    id: string;
    assessmentName: string;
    assessmentPeriod: string;
    fiscalYear: number;
    agencyId: string;
    performedBy: string;
    assessmentDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
    riskFramework: RiskFramework;
    scope: AssessmentScope[];
    objectives: string[];
    risks: IdentifiedRisk[];
    overallRiskLevel: RiskLevel;
    overallRiskScore: number;
    executiveSummary?: string;
    nextReviewDate: Date;
    status: AssessmentStatus;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Risk frameworks
 */
export declare enum RiskFramework {
    COSO_ERM = "COSO_ERM",
    ISO_31000 = "ISO_31000",
    NIST_RMF = "NIST_RMF",
    FAIR = "FAIR",
    OMB_CIRCULAR_A123 = "OMB_CIRCULAR_A123",
    GAO_GREEN_BOOK = "GAO_GREEN_BOOK",
    COBIT = "COBIT",
    CUSTOM = "CUSTOM"
}
/**
 * Assessment scope
 */
export declare enum AssessmentScope {
    STRATEGIC = "STRATEGIC",
    OPERATIONAL = "OPERATIONAL",
    FINANCIAL = "FINANCIAL",
    COMPLIANCE = "COMPLIANCE",
    REPUTATIONAL = "REPUTATIONAL",
    TECHNOLOGICAL = "TECHNOLOGICAL",
    ENVIRONMENTAL = "ENVIRONMENTAL",
    LEGAL = "LEGAL",
    CYBERSECURITY = "CYBERSECURITY",
    THIRD_PARTY = "THIRD_PARTY"
}
/**
 * Assessment status
 */
export declare enum AssessmentStatus {
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN_PROGRESS",
    UNDER_REVIEW = "UNDER_REVIEW",
    COMPLETED = "COMPLETED",
    APPROVED = "APPROVED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Identified risk structure
 */
export interface IdentifiedRisk {
    id: string;
    riskCode: string;
    riskTitle: string;
    riskDescription: string;
    riskCategory: RiskCategory;
    riskType: RiskType;
    identifiedDate: Date;
    identifiedBy: string;
    ownerDepartment: string;
    riskOwner: string;
    likelihood: LikelihoodLevel;
    impact: ImpactLevel;
    inherentRiskScore: number;
    currentControls: string[];
    residualLikelihood: LikelihoodLevel;
    residualImpact: ImpactLevel;
    residualRiskScore: number;
    riskAppetite: RiskAppetite;
    riskResponse: RiskResponse;
    mitigationPlan?: RiskMitigationPlan;
    status: RiskStatus;
    lastReviewDate?: Date;
    nextReviewDate: Date;
    escalated: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * Risk categories
 */
export declare enum RiskCategory {
    STRATEGIC_RISK = "STRATEGIC_RISK",
    OPERATIONAL_RISK = "OPERATIONAL_RISK",
    FINANCIAL_RISK = "FINANCIAL_RISK",
    COMPLIANCE_RISK = "COMPLIANCE_RISK",
    FRAUD_RISK = "FRAUD_RISK",
    REPUTATION_RISK = "REPUTATION_RISK",
    CYBERSECURITY_RISK = "CYBERSECURITY_RISK",
    TECHNOLOGY_RISK = "TECHNOLOGY_RISK",
    HUMAN_CAPITAL_RISK = "HUMAN_CAPITAL_RISK",
    THIRD_PARTY_RISK = "THIRD_PARTY_RISK",
    BUSINESS_CONTINUITY_RISK = "BUSINESS_CONTINUITY_RISK",
    ENVIRONMENTAL_RISK = "ENVIRONMENTAL_RISK"
}
/**
 * Risk types
 */
export declare enum RiskType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
    EMERGING = "EMERGING",
    RESIDUAL = "RESIDUAL",
    INHERENT = "INHERENT"
}
/**
 * Risk level
 */
export declare enum RiskLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    NEGLIGIBLE = "NEGLIGIBLE"
}
/**
 * Likelihood level
 */
export declare enum LikelihoodLevel {
    VERY_LIKELY = "VERY_LIKELY",
    LIKELY = "LIKELY",
    POSSIBLE = "POSSIBLE",
    UNLIKELY = "UNLIKELY",
    RARE = "RARE"
}
/**
 * Impact level
 */
export declare enum ImpactLevel {
    CATASTROPHIC = "CATASTROPHIC",
    MAJOR = "MAJOR",
    MODERATE = "MODERATE",
    MINOR = "MINOR",
    INSIGNIFICANT = "INSIGNIFICANT"
}
/**
 * Risk appetite
 */
export declare enum RiskAppetite {
    ZERO_TOLERANCE = "ZERO_TOLERANCE",
    LOW = "LOW",
    MODERATE = "MODERATE",
    HIGH = "HIGH",
    AGGRESSIVE = "AGGRESSIVE"
}
/**
 * Risk response strategy
 */
export declare enum RiskResponse {
    AVOID = "AVOID",
    MITIGATE = "MITIGATE",
    TRANSFER = "TRANSFER",
    ACCEPT = "ACCEPT",
    MONITOR = "MONITOR"
}
/**
 * Risk status
 */
export declare enum RiskStatus {
    ACTIVE = "ACTIVE",
    MONITORING = "MONITORING",
    MITIGATING = "MITIGATING",
    MITIGATED = "MITIGATED",
    ACCEPTED = "ACCEPTED",
    CLOSED = "CLOSED",
    ESCALATED = "ESCALATED"
}
/**
 * Risk mitigation plan
 */
export interface RiskMitigationPlan {
    id: string;
    riskId: string;
    planName: string;
    objectives: string[];
    strategies: MitigationStrategy[];
    targetRiskLevel: RiskLevel;
    targetCompletionDate: Date;
    budget?: number;
    resources: string[];
    assignedTo: string[];
    progress: number;
    status: MitigationStatus;
    controlsToImplement: string[];
    milestones: MitigationMilestone[];
    barriers?: string[];
    metadata?: Record<string, any>;
}
/**
 * Mitigation strategy
 */
export interface MitigationStrategy {
    strategyId: string;
    description: string;
    strategyType: RiskResponse;
    expectedReduction: number;
    implementationCost?: number;
    implementationTime: number;
    priority: number;
    assignedTo: string;
    status: 'planned' | 'in_progress' | 'completed' | 'deferred';
}
/**
 * Mitigation status
 */
export declare enum MitigationStatus {
    NOT_STARTED = "NOT_STARTED",
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Mitigation milestone
 */
export interface MitigationMilestone {
    milestoneId: string;
    name: string;
    targetDate: Date;
    completionDate?: Date;
    status: 'pending' | 'completed' | 'overdue';
    deliverables: string[];
}
/**
 * Internal control structure
 */
export interface InternalControl {
    id: string;
    controlCode: string;
    controlName: string;
    controlDescription: string;
    controlObjective: string;
    controlType: ControlType;
    controlCategory: ControlCategory;
    controlFrequency: ControlFrequency;
    ownerDepartment: string;
    controlOwner: string;
    designEffectiveness: EffectivenessRating;
    operatingEffectiveness: EffectivenessRating;
    automationLevel: AutomationLevel;
    relatedRisks: string[];
    testingProcedures: string[];
    lastTestDate?: Date;
    nextTestDate: Date;
    deficiencies: ControlDeficiency[];
    compensatingControls?: string[];
    status: ControlStatus;
    implementationDate: Date;
    cosoComponent?: COSOComponent;
    cosoObjective?: COSOObjective;
    metadata?: Record<string, any>;
}
/**
 * Control type
 */
export declare enum ControlType {
    PREVENTIVE = "PREVENTIVE",
    DETECTIVE = "DETECTIVE",
    CORRECTIVE = "CORRECTIVE",
    DIRECTIVE = "DIRECTIVE",
    COMPENSATING = "COMPENSATING"
}
/**
 * Control category
 */
export declare enum ControlCategory {
    AUTHORIZATION = "AUTHORIZATION",
    SEGREGATION_OF_DUTIES = "SEGREGATION_OF_DUTIES",
    PHYSICAL_CONTROL = "PHYSICAL_CONTROL",
    RECONCILIATION = "RECONCILIATION",
    REVIEW = "REVIEW",
    ACCESS_CONTROL = "ACCESS_CONTROL",
    INFORMATION_PROCESSING = "INFORMATION_PROCESSING",
    PERFORMANCE_INDICATOR = "PERFORMANCE_INDICATOR",
    DOCUMENTATION = "DOCUMENTATION"
}
/**
 * Control frequency
 */
export declare enum ControlFrequency {
    CONTINUOUS = "CONTINUOUS",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY",
    EVENT_DRIVEN = "EVENT_DRIVEN"
}
/**
 * Effectiveness rating
 */
export declare enum EffectivenessRating {
    EFFECTIVE = "EFFECTIVE",
    PARTIALLY_EFFECTIVE = "PARTIALLY_EFFECTIVE",
    INEFFECTIVE = "INEFFECTIVE",
    NOT_TESTED = "NOT_TESTED",
    NOT_APPLICABLE = "NOT_APPLICABLE"
}
/**
 * Automation level
 */
export declare enum AutomationLevel {
    FULLY_AUTOMATED = "FULLY_AUTOMATED",
    SEMI_AUTOMATED = "SEMI_AUTOMATED",
    MANUAL = "MANUAL",
    MANUAL_WITH_IT = "MANUAL_WITH_IT"
}
/**
 * Control status
 */
export declare enum ControlStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    IN_DESIGN = "IN_DESIGN",
    UNDER_REVIEW = "UNDER_REVIEW",
    NEEDS_REMEDIATION = "NEEDS_REMEDIATION",
    RETIRED = "RETIRED"
}
/**
 * COSO components
 */
export declare enum COSOComponent {
    CONTROL_ENVIRONMENT = "CONTROL_ENVIRONMENT",
    RISK_ASSESSMENT = "RISK_ASSESSMENT",
    CONTROL_ACTIVITIES = "CONTROL_ACTIVITIES",
    INFORMATION_COMMUNICATION = "INFORMATION_COMMUNICATION",
    MONITORING_ACTIVITIES = "MONITORING_ACTIVITIES"
}
/**
 * COSO objectives
 */
export declare enum COSOObjective {
    OPERATIONS = "OPERATIONS",
    REPORTING = "REPORTING",
    COMPLIANCE = "COMPLIANCE"
}
/**
 * Control deficiency
 */
export interface ControlDeficiency {
    id: string;
    controlId: string;
    deficiencyType: DeficiencyType;
    severity: DeficiencySeverity;
    description: string;
    rootCause?: string;
    identifiedDate: Date;
    identifiedBy: string;
    impact: string;
    remediation: RemediationPlan;
    status: DeficiencyStatus;
    relatedFindings?: string[];
    metadata?: Record<string, any>;
}
/**
 * Deficiency type
 */
export declare enum DeficiencyType {
    DESIGN_DEFICIENCY = "DESIGN_DEFICIENCY",
    OPERATING_DEFICIENCY = "OPERATING_DEFICIENCY",
    BOTH = "BOTH"
}
/**
 * Deficiency severity
 */
export declare enum DeficiencySeverity {
    MATERIAL_WEAKNESS = "MATERIAL_WEAKNESS",
    SIGNIFICANT_DEFICIENCY = "SIGNIFICANT_DEFICIENCY",
    DEFICIENCY = "DEFICIENCY",
    OBSERVATION = "OBSERVATION"
}
/**
 * Deficiency status
 */
export declare enum DeficiencyStatus {
    OPEN = "OPEN",
    IN_REMEDIATION = "IN_REMEDIATION",
    REMEDIATED = "REMEDIATED",
    VERIFIED = "VERIFIED",
    CLOSED = "CLOSED",
    ACCEPTED = "ACCEPTED"
}
/**
 * Remediation plan
 */
export interface RemediationPlan {
    planId: string;
    description: string;
    targetDate: Date;
    assignedTo: string;
    approvedBy?: string;
    actions: RemediationAction[];
    estimatedCost?: number;
    progress: number;
    completionDate?: Date;
    verificationDate?: Date;
    verifiedBy?: string;
}
/**
 * Remediation action
 */
export interface RemediationAction {
    actionId: string;
    description: string;
    dueDate: Date;
    assignedTo: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    completionDate?: Date;
    evidence?: string;
}
/**
 * Control testing record
 */
export interface ControlTestingRecord {
    id: string;
    controlId: string;
    testingPeriod: string;
    testDate: Date;
    testType: TestType;
    testScope: string;
    sampleSize?: number;
    populationSize?: number;
    testerName: string;
    testerRole: string;
    procedures: string[];
    observations: TestObservation[];
    exceptions: number;
    exceptionDetails?: TestException[];
    conclusion: TestConclusion;
    operatingEffectiveness: EffectivenessRating;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    reviewedBy?: string;
    reviewDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Test type
 */
export declare enum TestType {
    DESIGN_TESTING = "DESIGN_TESTING",
    OPERATING_EFFECTIVENESS = "OPERATING_EFFECTIVENESS",
    WALKTHROUGH = "WALKTHROUGH",
    INQUIRY = "INQUIRY",
    OBSERVATION = "OBSERVATION",
    INSPECTION = "INSPECTION",
    REPERFORMANCE = "REPERFORMANCE"
}
/**
 * Test observation
 */
export interface TestObservation {
    observationId: string;
    description: string;
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    evidence?: string;
    recommendation: string;
}
/**
 * Test exception
 */
export interface TestException {
    exceptionId: string;
    description: string;
    impact: string;
    rootCause?: string;
    correctiveAction: string;
    dueDate: Date;
    assignedTo: string;
}
/**
 * Test conclusion
 */
export declare enum TestConclusion {
    NO_EXCEPTIONS = "NO_EXCEPTIONS",
    MINOR_EXCEPTIONS = "MINOR_EXCEPTIONS",
    SIGNIFICANT_EXCEPTIONS = "SIGNIFICANT_EXCEPTIONS",
    CONTROL_NOT_OPERATING = "CONTROL_NOT_OPERATING",
    INCONCLUSIVE = "INCONCLUSIVE"
}
/**
 * Risk register entry
 */
export interface RiskRegisterEntry {
    id: string;
    riskId: string;
    registrationDate: Date;
    riskTitle: string;
    riskCategory: RiskCategory;
    inherentRiskScore: number;
    residualRiskScore: number;
    riskTrend: RiskTrend;
    controlsInPlace: string[];
    riskOwner: string;
    status: RiskStatus;
    lastUpdateDate: Date;
    lastReviewDate?: Date;
    nextReviewDate: Date;
    escalationRequired: boolean;
    boardReporting: boolean;
    metadata?: Record<string, any>;
}
/**
 * Risk trend
 */
export declare enum RiskTrend {
    INCREASING = "INCREASING",
    STABLE = "STABLE",
    DECREASING = "DECREASING",
    NEW = "NEW",
    EMERGING = "EMERGING"
}
/**
 * Risk heat map data
 */
export interface RiskHeatMap {
    id: string;
    generatedDate: Date;
    generatedBy: string;
    periodCovered: string;
    riskPlotPoints: RiskPlotPoint[];
    riskZones: RiskZone[];
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    metadata?: Record<string, any>;
}
/**
 * Risk plot point
 */
export interface RiskPlotPoint {
    riskId: string;
    riskTitle: string;
    likelihoodScore: number;
    impactScore: number;
    riskScore: number;
    riskLevel: RiskLevel;
    category: RiskCategory;
    owner: string;
}
/**
 * Risk zone definition
 */
export interface RiskZone {
    zoneName: string;
    riskLevel: RiskLevel;
    color: string;
    minLikelihood: number;
    maxLikelihood: number;
    minImpact: number;
    maxImpact: number;
    actionRequired: string;
}
/**
 * Segregation of duties matrix
 */
export interface SegregationOfDutiesMatrix {
    id: string;
    matrixName: string;
    department: string;
    processArea: string;
    incompatibleFunctions: IncompatibleFunction[];
    violations: SODViolation[];
    lastReviewDate: Date;
    reviewedBy: string;
    nextReviewDate: Date;
    status: 'compliant' | 'violations_identified' | 'remediation_in_progress';
    metadata?: Record<string, any>;
}
/**
 * Incompatible function
 */
export interface IncompatibleFunction {
    functionPair: string[];
    reason: string;
    riskLevel: RiskLevel;
    mitigatingControls?: string[];
}
/**
 * SOD violation
 */
export interface SODViolation {
    violationId: string;
    userId: string;
    userName: string;
    conflictingRoles: string[];
    identifiedDate: Date;
    riskLevel: RiskLevel;
    businessJustification?: string;
    compensatingControls?: string[];
    approvedBy?: string;
    remediationDueDate?: Date;
    status: 'open' | 'mitigated' | 'remediated' | 'approved_exception';
}
/**
 * Authorization matrix
 */
export interface AuthorizationMatrix {
    id: string;
    matrixName: string;
    processArea: string;
    department: string;
    authorizationLevels: AuthorizationLevel[];
    effectiveDate: Date;
    expirationDate?: Date;
    approvedBy: string;
    approvalDate: Date;
    lastReviewDate: Date;
    nextReviewDate: Date;
    version: number;
    status: 'active' | 'draft' | 'expired' | 'superseded';
    metadata?: Record<string, any>;
}
/**
 * Authorization level
 */
export interface AuthorizationLevel {
    levelId: string;
    levelName: string;
    dollarThreshold?: number;
    authorizedRoles: string[];
    authorizedIndividuals?: string[];
    requiredApprovals: number;
    conditions?: string[];
    delegationAllowed: boolean;
    escalationRequired: boolean;
}
/**
 * Fraud risk assessment
 */
export interface FraudRiskAssessment {
    id: string;
    assessmentDate: Date;
    assessmentPeriod: string;
    performedBy: string;
    scope: FraudRiskScope[];
    fraudSchemes: FraudScheme[];
    overallFraudRisk: RiskLevel;
    fraudTriangle: FraudTriangleAnalysis;
    antifraudControls: string[];
    controlGaps: string[];
    recommendations: string[];
    nextAssessmentDate: Date;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Fraud risk scope
 */
export declare enum FraudRiskScope {
    FINANCIAL_REPORTING = "FINANCIAL_REPORTING",
    ASSET_MISAPPROPRIATION = "ASSET_MISAPPROPRIATION",
    CORRUPTION = "CORRUPTION",
    PROCUREMENT_FRAUD = "PROCUREMENT_FRAUD",
    PAYROLL_FRAUD = "PAYROLL_FRAUD",
    GRANT_FRAUD = "GRANT_FRAUD",
    VENDOR_FRAUD = "VENDOR_FRAUD",
    CYBERSECURITY_FRAUD = "CYBERSECURITY_FRAUD"
}
/**
 * Fraud scheme
 */
export interface FraudScheme {
    schemeId: string;
    schemeType: FraudRiskScope;
    description: string;
    likelihood: LikelihoodLevel;
    potentialImpact: ImpactLevel;
    fraudRiskScore: number;
    vulnerableProcesses: string[];
    detectionMethods: string[];
    preventionControls: string[];
    detectionControls: string[];
    controlEffectiveness: EffectivenessRating;
}
/**
 * Fraud triangle analysis
 */
export interface FraudTriangleAnalysis {
    pressureFactors: string[];
    opportunityFactors: string[];
    rationalizationFactors: string[];
    overallFraudRisk: RiskLevel;
}
/**
 * Whistleblower case
 */
export interface WhistleblowerCase {
    id: string;
    caseNumber: string;
    receivedDate: Date;
    reportingChannel: ReportingChannel;
    anonymousReport: boolean;
    reporterContact?: string;
    allegationType: AllegationType;
    allegationSummary: string;
    departments: string[];
    individualsInvolved?: string[];
    assignedInvestigator?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    status: WhistleblowerStatus;
    investigationStartDate?: Date;
    investigationEndDate?: Date;
    findings?: string;
    substantiated: boolean;
    correctiveActions: CorrectiveAction[];
    confidentialityMaintained: boolean;
    retaliationConcerns: boolean;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Reporting channel
 */
export declare enum ReportingChannel {
    HOTLINE = "HOTLINE",
    EMAIL = "EMAIL",
    WEB_PORTAL = "WEB_PORTAL",
    IN_PERSON = "IN_PERSON",
    MAIL = "MAIL",
    THIRD_PARTY_SERVICE = "THIRD_PARTY_SERVICE"
}
/**
 * Allegation type
 */
export declare enum AllegationType {
    FRAUD = "FRAUD",
    WASTE = "WASTE",
    ABUSE = "ABUSE",
    MISCONDUCT = "MISCONDUCT",
    ETHICS_VIOLATION = "ETHICS_VIOLATION",
    CONFLICT_OF_INTEREST = "CONFLICT_OF_INTEREST",
    SAFETY_VIOLATION = "SAFETY_VIOLATION",
    REGULATORY_VIOLATION = "REGULATORY_VIOLATION",
    RETALIATION = "RETALIATION"
}
/**
 * Whistleblower status
 */
export declare enum WhistleblowerStatus {
    RECEIVED = "RECEIVED",
    UNDER_REVIEW = "UNDER_REVIEW",
    INVESTIGATION_ASSIGNED = "INVESTIGATION_ASSIGNED",
    INVESTIGATING = "INVESTIGATING",
    INVESTIGATION_COMPLETE = "INVESTIGATION_COMPLETE",
    CLOSED_SUBSTANTIATED = "CLOSED_SUBSTANTIATED",
    CLOSED_UNSUBSTANTIATED = "CLOSED_UNSUBSTANTIATED",
    CLOSED_INSUFFICIENT_EVIDENCE = "CLOSED_INSUFFICIENT_EVIDENCE"
}
/**
 * Corrective action
 */
export interface CorrectiveAction {
    actionId: string;
    description: string;
    actionType: 'disciplinary' | 'process_improvement' | 'training' | 'policy_change' | 'control_enhancement';
    assignedTo: string;
    dueDate: Date;
    completionDate?: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'verified';
    verificationEvidence?: string;
}
/**
 * Internal audit plan
 */
export interface InternalAuditPlan {
    id: string;
    planName: string;
    fiscalYear: number;
    approvedBy: string;
    approvalDate: Date;
    riskBasedApproach: boolean;
    auditUniverse: AuditableEntity[];
    plannedAudits: PlannedAudit[];
    totalAuditHours: number;
    budgetAllocated?: number;
    status: 'draft' | 'approved' | 'in_progress' | 'completed';
    metadata?: Record<string, any>;
}
/**
 * Auditable entity
 */
export interface AuditableEntity {
    entityId: string;
    entityName: string;
    entityType: string;
    department: string;
    inherentRisk: RiskLevel;
    lastAuditDate?: Date;
    auditFrequency: number;
    nextAuditDue?: Date;
    priority: number;
}
/**
 * Planned audit
 */
export interface PlannedAudit {
    auditId: string;
    auditName: string;
    auditType: AuditType;
    auditableEntity: string;
    plannedStartDate: Date;
    plannedEndDate: Date;
    estimatedHours: number;
    auditTeam: string[];
    auditObjectives: string[];
    scope: string[];
    riskAreas: string[];
    status: 'scheduled' | 'in_progress' | 'fieldwork_complete' | 'reporting' | 'issued';
}
/**
 * Audit type
 */
export declare enum AuditType {
    FINANCIAL = "FINANCIAL",
    OPERATIONAL = "OPERATIONAL",
    COMPLIANCE = "COMPLIANCE",
    IT = "IT",
    PERFORMANCE = "PERFORMANCE",
    FRAUD = "FRAUD",
    INVESTIGATIVE = "INVESTIGATIVE",
    FOLLOW_UP = "FOLLOW_UP",
    ADVISORY = "ADVISORY"
}
/**
 * Audit finding
 */
export interface AuditFinding {
    id: string;
    findingNumber: string;
    auditId: string;
    findingTitle: string;
    condition: string;
    criteria: string;
    cause: string;
    effect: string;
    recommendation: string;
    severity: DeficiencySeverity;
    riskRating: RiskLevel;
    managementResponse?: string;
    agreedUponAction?: string;
    responsibleParty?: string;
    targetCompletionDate?: Date;
    actualCompletionDate?: Date;
    status: FindingStatus;
    followUpDate?: Date;
    verificationEvidence?: string;
    metadata?: Record<string, any>;
}
/**
 * Finding status
 */
export declare enum FindingStatus {
    DRAFT = "DRAFT",
    ISSUED = "ISSUED",
    MANAGEMENT_RESPONSE_PENDING = "MANAGEMENT_RESPONSE_PENDING",
    ACTION_PLAN_APPROVED = "ACTION_PLAN_APPROVED",
    IN_REMEDIATION = "IN_REMEDIATION",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    CLOSED = "CLOSED",
    OVERDUE = "OVERDUE"
}
/**
 * Control self-assessment
 */
export interface ControlSelfAssessment {
    id: string;
    assessmentName: string;
    department: string;
    processOwner: string;
    assessmentDate: Date;
    period: string;
    controlsAssessed: ControlAssessmentItem[];
    overallRating: EffectivenessRating;
    issuesIdentified: number;
    improvementActions: string[];
    reviewedBy?: string;
    reviewDate?: Date;
    nextAssessmentDate: Date;
    metadata?: Record<string, any>;
}
/**
 * Control assessment item
 */
export interface ControlAssessmentItem {
    controlId: string;
    controlName: string;
    selfAssessmentRating: EffectivenessRating;
    evidenceProvided: string[];
    observations: string[];
    deficienciesNoted?: string[];
    improvementOpportunities?: string[];
}
/**
 * Risk appetite statement
 */
export interface RiskAppetiteStatement {
    id: string;
    statementName: string;
    fiscalYear: number;
    approvedBy: string;
    approvalDate: Date;
    overallRiskAppetite: RiskAppetite;
    categoryAppetites: CategoryRiskAppetite[];
    quantitativeThresholds: QuantitativeThreshold[];
    qualitativeStatements: string[];
    exceptionsAllowed: boolean;
    exceptionApprovalProcess?: string;
    reviewFrequency: number;
    nextReviewDate: Date;
    status: 'draft' | 'approved' | 'active' | 'superseded';
    metadata?: Record<string, any>;
}
/**
 * Category risk appetite
 */
export interface CategoryRiskAppetite {
    category: RiskCategory;
    appetiteLevel: RiskAppetite;
    toleranceLevel: RiskLevel;
    rationale: string;
    keyRiskIndicators?: string[];
    triggerPoints?: string[];
}
/**
 * Quantitative threshold
 */
export interface QuantitativeThreshold {
    metricName: string;
    threshold: number;
    unit: string;
    category: RiskCategory;
    actionRequired: string;
}
/**
 * Third-party risk assessment
 */
export interface ThirdPartyRiskAssessment {
    id: string;
    vendorId: string;
    vendorName: string;
    assessmentDate: Date;
    assessmentType: ThirdPartyAssessmentType;
    serviceProvided: string;
    criticalityRating: 'critical' | 'high' | 'medium' | 'low';
    inherentRisk: RiskLevel;
    riskDomains: ThirdPartyRiskDomain[];
    overallRiskScore: number;
    residualRisk: RiskLevel;
    dueDiligenceCompleted: boolean;
    contractualControls: string[];
    monitoringFrequency: ControlFrequency;
    nextReviewDate: Date;
    status: 'pending' | 'approved' | 'conditional' | 'rejected';
    metadata?: Record<string, any>;
}
/**
 * Third-party assessment type
 */
export declare enum ThirdPartyAssessmentType {
    INITIAL = "INITIAL",
    PERIODIC_REVIEW = "PERIODIC_REVIEW",
    EVENT_DRIVEN = "EVENT_DRIVEN",
    CONTRACT_RENEWAL = "CONTRACT_RENEWAL",
    EXIT_ASSESSMENT = "EXIT_ASSESSMENT"
}
/**
 * Third-party risk domain
 */
export interface ThirdPartyRiskDomain {
    domain: 'financial' | 'operational' | 'compliance' | 'cybersecurity' | 'reputation' | 'strategic';
    riskLevel: RiskLevel;
    riskScore: number;
    findings: string[];
    mitigatingFactors: string[];
}
/**
 * Business continuity plan
 */
export interface BusinessContinuityPlan {
    id: string;
    planName: string;
    department: string;
    planOwner: string;
    approvedBy: string;
    approvalDate: Date;
    effectiveDate: Date;
    lastReviewDate: Date;
    nextReviewDate: Date;
    criticalProcesses: CriticalProcess[];
    recoveryStrategies: RecoveryStrategy[];
    resourceRequirements: ResourceRequirement[];
    communicationPlan: CommunicationPlan;
    testingSchedule: TestingSchedule;
    lastTestDate?: Date;
    lastTestResults?: string;
    status: 'active' | 'draft' | 'under_review' | 'expired';
    metadata?: Record<string, any>;
}
/**
 * Critical process
 */
export interface CriticalProcess {
    processId: string;
    processName: string;
    description: string;
    criticalityLevel: 'tier_1' | 'tier_2' | 'tier_3';
    rto: number;
    rpo: number;
    dependencies: string[];
    alternateProcessing?: string;
    manualWorkarounds?: string[];
}
/**
 * Recovery strategy
 */
export interface RecoveryStrategy {
    strategyId: string;
    strategyName: string;
    applicableProcesses: string[];
    description: string;
    estimatedCost?: number;
    implementationTime: number;
    resourcesRequired: string[];
    priority: number;
}
/**
 * Resource requirement
 */
export interface ResourceRequirement {
    resourceType: 'personnel' | 'technology' | 'facility' | 'vendor' | 'supplies';
    resourceName: string;
    quantity: number;
    criticality: 'essential' | 'important' | 'optional';
    alternativeSources?: string[];
}
/**
 * Communication plan
 */
export interface CommunicationPlan {
    stakeholders: Stakeholder[];
    communicationMethods: string[];
    escalationProcedure: string[];
    emergencyContacts: EmergencyContact[];
}
/**
 * Stakeholder
 */
export interface Stakeholder {
    stakeholderType: string;
    notificationTrigger: string[];
    notificationMethod: string[];
    informationRequired: string[];
}
/**
 * Emergency contact
 */
export interface EmergencyContact {
    name: string;
    role: string;
    phone: string;
    email: string;
    alternateContact?: string;
}
/**
 * Testing schedule
 */
export interface TestingSchedule {
    frequency: 'quarterly' | 'semi_annual' | 'annual';
    testTypes: ('tabletop' | 'walkthrough' | 'simulation' | 'full_interruption')[];
    nextScheduledTest: Date;
    participantsRequired: string[];
}
/**
 * Disaster recovery plan
 */
export interface DisasterRecoveryPlan {
    id: string;
    planName: string;
    systemName: string;
    systemOwner: string;
    approvedBy: string;
    approvalDate: Date;
    effectiveDate: Date;
    rto: number;
    rpo: number;
    recoveryPhases: RecoveryPhase[];
    backupStrategy: BackupStrategy;
    alternativeSites: AlternativeSite[];
    testingResults: DRTestResult[];
    lastReviewDate: Date;
    nextReviewDate: Date;
    status: 'active' | 'draft' | 'under_review' | 'expired';
    metadata?: Record<string, any>;
}
/**
 * Recovery phase
 */
export interface RecoveryPhase {
    phaseNumber: number;
    phaseName: string;
    description: string;
    targetTimeframe: number;
    activities: RecoveryActivity[];
    successCriteria: string[];
    responsibleParty: string;
}
/**
 * Recovery activity
 */
export interface RecoveryActivity {
    activityId: string;
    description: string;
    estimatedDuration: number;
    dependencies?: string[];
    assignedTo: string;
    procedures: string[];
}
/**
 * Backup strategy
 */
export interface BackupStrategy {
    backupType: 'full' | 'incremental' | 'differential' | 'continuous';
    backupFrequency: ControlFrequency;
    backupLocation: string[];
    retentionPeriod: number;
    encryptionUsed: boolean;
    lastSuccessfulBackup?: Date;
    verificationFrequency: ControlFrequency;
    lastVerificationDate?: Date;
}
/**
 * Alternative site
 */
export interface AlternativeSite {
    siteId: string;
    siteType: 'hot' | 'warm' | 'cold' | 'cloud';
    location: string;
    capacity: string;
    activationTime: number;
    monthlyCost?: number;
    contractExpiration?: Date;
    lastTestDate?: Date;
}
/**
 * DR test result
 */
export interface DRTestResult {
    testId: string;
    testDate: Date;
    testType: 'tabletop' | 'simulation' | 'parallel' | 'full_interruption';
    participantsCount: number;
    objectivesMet: boolean;
    rtoAchieved: number;
    issuesIdentified: string[];
    lessonsLearned: string[];
    improvementActions: string[];
}
/**
 * Incident response record
 */
export interface IncidentResponseRecord {
    id: string;
    incidentNumber: string;
    incidentDate: Date;
    detectedDate: Date;
    reportedDate: Date;
    reportedBy: string;
    incidentType: IncidentType;
    severity: IncidentSeverity;
    affectedSystems: string[];
    affectedDepartments: string[];
    incidentDescription: string;
    initialAssessment: string;
    responseTeam: string[];
    responsePhases: IncidentResponsePhase[];
    containmentActions: string[];
    eradicationActions: string[];
    recoveryActions: string[];
    lessonsLearned?: string[];
    rootCause?: string;
    preventativeMeasures?: string[];
    estimatedCost?: number;
    regulatoryNotificationRequired: boolean;
    notificationsSent?: RegulatoryNotification[];
    status: IncidentStatus;
    resolvedDate?: Date;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Incident type
 */
export declare enum IncidentType {
    CYBERSECURITY = "CYBERSECURITY",
    DATA_BREACH = "DATA_BREACH",
    SYSTEM_OUTAGE = "SYSTEM_OUTAGE",
    NATURAL_DISASTER = "NATURAL_DISASTER",
    OPERATIONAL_FAILURE = "OPERATIONAL_FAILURE",
    FRAUD = "FRAUD",
    PHYSICAL_SECURITY = "PHYSICAL_SECURITY",
    VENDOR_FAILURE = "VENDOR_FAILURE",
    HUMAN_ERROR = "HUMAN_ERROR"
}
/**
 * Incident severity
 */
export declare enum IncidentSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Incident status
 */
export declare enum IncidentStatus {
    REPORTED = "REPORTED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    INVESTIGATING = "INVESTIGATING",
    CONTAINED = "CONTAINED",
    ERADICATED = "ERADICATED",
    RECOVERING = "RECOVERING",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
/**
 * Incident response phase
 */
export interface IncidentResponsePhase {
    phaseName: 'preparation' | 'detection' | 'containment' | 'eradication' | 'recovery' | 'post_incident';
    startTime: Date;
    endTime?: Date;
    activitiesPerformed: string[];
    responsibleParty: string;
    status: 'in_progress' | 'completed' | 'skipped';
}
/**
 * Regulatory notification
 */
export interface RegulatoryNotification {
    notificationId: string;
    regulatoryBody: string;
    notificationDate: Date;
    notificationMethod: string;
    acknowledgmentReceived: boolean;
    acknowledgmentDate?: Date;
    followUpRequired: boolean;
}
/**
 * Risk dashboard metrics
 */
export interface RiskDashboardMetrics {
    generatedDate: Date;
    period: string;
    totalRisks: number;
    risksByLevel: Record<RiskLevel, number>;
    risksByCategory: Record<RiskCategory, number>;
    riskTrend: 'improving' | 'stable' | 'deteriorating';
    totalControls: number;
    effectiveControls: number;
    controlEffectivenessRate: number;
    openDeficiencies: number;
    materialWeaknesses: number;
    significantDeficiencies: number;
    openAuditFindings: number;
    overdueFindings: number;
    controlTestingCompletionRate: number;
    riskAppetiteCompliance: number;
    topRisks: RiskRegisterEntry[];
    recentIncidents: number;
    openWhistleblowerCases: number;
    thirdPartyRiskExposure: number;
}
/**
 * Creates an enterprise risk assessment
 *
 * @example
 * ```typescript
 * const assessment = createEnterpriseRiskAssessment({
 *   assessmentName: 'FY2024 Enterprise Risk Assessment',
 *   assessmentPeriod: 'FY2024',
 *   fiscalYear: 2024,
 *   agencyId: 'AGY-001',
 *   performedBy: 'Risk Management Team',
 *   riskFramework: RiskFramework.COSO_ERM,
 *   scope: [AssessmentScope.STRATEGIC, AssessmentScope.OPERATIONAL],
 *   nextReviewDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createEnterpriseRiskAssessment(params: {
    assessmentName: string;
    assessmentPeriod: string;
    fiscalYear: number;
    agencyId: string;
    performedBy: string;
    riskFramework: RiskFramework;
    scope: AssessmentScope[];
    nextReviewDate: Date;
}): EnterpriseRiskAssessment;
/**
 * Updates assessment status
 */
export declare function updateAssessmentStatus(assessment: EnterpriseRiskAssessment, status: AssessmentStatus): EnterpriseRiskAssessment;
/**
 * Approves enterprise risk assessment
 */
export declare function approveRiskAssessment(assessment: EnterpriseRiskAssessment, approvedBy: string): EnterpriseRiskAssessment;
/**
 * Calculates overall risk score from identified risks
 */
export declare function calculateOverallRiskScore(risks: IdentifiedRisk[]): number;
/**
 * Determines overall risk level from score
 */
export declare function determineOverallRiskLevel(score: number): RiskLevel;
/**
 * Creates an identified risk
 *
 * @example
 * ```typescript
 * const risk = identifyRisk({
 *   riskCode: 'RISK-OPS-001',
 *   riskTitle: 'System Downtime Risk',
 *   riskDescription: 'Critical system may experience unplanned downtime',
 *   riskCategory: RiskCategory.OPERATIONAL_RISK,
 *   ownerDepartment: 'IT Operations',
 *   riskOwner: 'CIO',
 *   likelihood: LikelihoodLevel.POSSIBLE,
 *   impact: ImpactLevel.MAJOR,
 * });
 * ```
 */
export declare function identifyRisk(params: {
    riskCode: string;
    riskTitle: string;
    riskDescription: string;
    riskCategory: RiskCategory;
    ownerDepartment: string;
    riskOwner: string;
    likelihood: LikelihoodLevel;
    impact: ImpactLevel;
    identifiedBy?: string;
}): IdentifiedRisk;
/**
 * Calculates risk score from likelihood and impact
 */
export declare function calculateRiskScore(likelihood: LikelihoodLevel, impact: ImpactLevel): number;
/**
 * Categorizes risk level from score
 */
export declare function categorizeRiskLevel(score: number): RiskLevel;
/**
 * Updates residual risk after control implementation
 */
export declare function updateResidualRisk(risk: IdentifiedRisk, residualLikelihood: LikelihoodLevel, residualImpact: ImpactLevel, controlsImplemented: string[]): IdentifiedRisk;
/**
 * Escalates risk to higher management
 */
export declare function escalateRisk(risk: IdentifiedRisk, reason: string): IdentifiedRisk;
/**
 * Filters risks by category
 */
export declare function filterRisksByCategory(risks: IdentifiedRisk[], category: RiskCategory): IdentifiedRisk[];
/**
 * Gets high-priority risks requiring immediate attention
 */
export declare function getHighPriorityRisks(risks: IdentifiedRisk[]): IdentifiedRisk[];
/**
 * Creates a risk mitigation plan
 *
 * @example
 * ```typescript
 * const plan = createRiskMitigationPlan({
 *   riskId: 'risk-123',
 *   planName: 'Cybersecurity Enhancement Plan',
 *   objectives: ['Reduce vulnerability exposure', 'Improve detection capabilities'],
 *   targetRiskLevel: RiskLevel.LOW,
 *   targetCompletionDate: new Date('2024-12-31'),
 *   assignedTo: ['CISO', 'IT Security Manager'],
 * });
 * ```
 */
export declare function createRiskMitigationPlan(params: {
    riskId: string;
    planName: string;
    objectives: string[];
    targetRiskLevel: RiskLevel;
    targetCompletionDate: Date;
    assignedTo: string[];
    budget?: number;
}): RiskMitigationPlan;
/**
 * Adds mitigation strategy to plan
 */
export declare function addMitigationStrategy(plan: RiskMitigationPlan, strategy: MitigationStrategy): RiskMitigationPlan;
/**
 * Updates mitigation plan progress
 */
export declare function updateMitigationProgress(plan: RiskMitigationPlan, progress: number): RiskMitigationPlan;
/**
 * Calculates mitigation plan completion percentage
 */
export declare function calculateMitigationCompletion(plan: RiskMitigationPlan): number;
/**
 * Creates an internal control
 *
 * @example
 * ```typescript
 * const control = createInternalControl({
 *   controlCode: 'CTRL-FIN-001',
 *   controlName: 'Budget Approval Authorization',
 *   controlDescription: 'All budgets must be approved by authorized personnel',
 *   controlObjective: 'Ensure proper authorization of budget allocations',
 *   controlType: ControlType.PREVENTIVE,
 *   controlCategory: ControlCategory.AUTHORIZATION,
 *   controlFrequency: ControlFrequency.EVENT_DRIVEN,
 *   ownerDepartment: 'Finance',
 *   controlOwner: 'CFO',
 * });
 * ```
 */
export declare function createInternalControl(params: {
    controlCode: string;
    controlName: string;
    controlDescription: string;
    controlObjective: string;
    controlType: ControlType;
    controlCategory: ControlCategory;
    controlFrequency: ControlFrequency;
    ownerDepartment: string;
    controlOwner: string;
    cosoComponent?: COSOComponent;
    cosoObjective?: COSOObjective;
}): InternalControl;
/**
 * Links control to risks
 */
export declare function linkControlToRisks(control: InternalControl, riskIds: string[]): InternalControl;
/**
 * Updates control effectiveness rating
 */
export declare function updateControlEffectiveness(control: InternalControl, designEffectiveness: EffectivenessRating, operatingEffectiveness: EffectivenessRating): InternalControl;
/**
 * Gets controls by COSO component
 */
export declare function getControlsByCOSOComponent(controls: InternalControl[], component: COSOComponent): InternalControl[];
/**
 * Validates COSO framework coverage
 */
export declare function validateCOSOCoverage(controls: InternalControl[]): {
    covered: COSOComponent[];
    missing: COSOComponent[];
    coveragePercentage: number;
};
/**
 * Creates a control testing record
 *
 * @example
 * ```typescript
 * const testRecord = createControlTestingRecord({
 *   controlId: 'ctrl-123',
 *   testingPeriod: 'Q1 2024',
 *   testType: TestType.OPERATING_EFFECTIVENESS,
 *   testScope: 'Full population testing',
 *   testerName: 'John Auditor',
 *   testerRole: 'Senior Internal Auditor',
 *   procedures: ['Sample selection', 'Evidence review', 'Conclusion documentation'],
 * });
 * ```
 */
export declare function createControlTestingRecord(params: {
    controlId: string;
    testingPeriod: string;
    testType: TestType;
    testScope: string;
    testerName: string;
    testerRole: string;
    procedures: string[];
    sampleSize?: number;
    populationSize?: number;
}): ControlTestingRecord;
/**
 * Adds test observation
 */
export declare function addTestObservation(testRecord: ControlTestingRecord, observation: TestObservation): ControlTestingRecord;
/**
 * Records test exception
 */
export declare function recordTestException(testRecord: ControlTestingRecord, exception: TestException): ControlTestingRecord;
/**
 * Concludes control testing
 */
export declare function concludeControlTesting(testRecord: ControlTestingRecord, conclusion: TestConclusion, effectiveness: EffectivenessRating, recommendations: string[]): ControlTestingRecord;
/**
 * Calculates control testing exception rate
 */
export declare function calculateExceptionRate(testRecord: ControlTestingRecord): number;
/**
 * Creates a control deficiency
 *
 * @example
 * ```typescript
 * const deficiency = createControlDeficiency({
 *   controlId: 'ctrl-123',
 *   deficiencyType: DeficiencyType.OPERATING_DEFICIENCY,
 *   severity: DeficiencySeverity.SIGNIFICANT_DEFICIENCY,
 *   description: 'Control not performed consistently throughout the period',
 *   impact: 'Potential for unauthorized transactions',
 *   identifiedBy: 'Internal Audit',
 *   targetRemediationDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createControlDeficiency(params: {
    controlId: string;
    deficiencyType: DeficiencyType;
    severity: DeficiencySeverity;
    description: string;
    impact: string;
    identifiedBy: string;
    targetRemediationDate: Date;
}): ControlDeficiency;
/**
 * Updates deficiency remediation plan
 */
export declare function updateDeficiencyRemediation(deficiency: ControlDeficiency, remediation: RemediationPlan): ControlDeficiency;
/**
 * Closes deficiency after remediation
 */
export declare function closeDeficiency(deficiency: ControlDeficiency, verifiedBy: string): ControlDeficiency;
/**
 * Gets open deficiencies by severity
 */
export declare function getOpenDeficienciesBySeverity(deficiencies: ControlDeficiency[], severity: DeficiencySeverity): ControlDeficiency[];
/**
 * Gets material weaknesses requiring immediate attention
 */
export declare function getMaterialWeaknesses(deficiencies: ControlDeficiency[]): ControlDeficiency[];
/**
 * Creates risk register entry
 */
export declare function createRiskRegisterEntry(risk: IdentifiedRisk): RiskRegisterEntry;
/**
 * Updates risk register entry trend
 */
export declare function updateRiskTrend(entry: RiskRegisterEntry, previousScore: number, currentScore: number): RiskRegisterEntry;
/**
 * Filters risk register by category
 */
export declare function filterRiskRegisterByCategory(entries: RiskRegisterEntry[], category: RiskCategory): RiskRegisterEntry[];
/**
 * Gets risks requiring board reporting
 */
export declare function getBoardReportingRisks(entries: RiskRegisterEntry[]): RiskRegisterEntry[];
/**
 * Generates risk heat map
 *
 * @example
 * ```typescript
 * const heatMap = generateRiskHeatMap({
 *   periodCovered: 'Q1 2024',
 *   generatedBy: 'Risk Manager',
 *   risks: identifiedRisks,
 * });
 * ```
 */
export declare function generateRiskHeatMap(params: {
    periodCovered: string;
    generatedBy: string;
    risks: IdentifiedRisk[];
}): RiskHeatMap;
/**
 * Creates risk plot point for heat map
 */
export declare function createRiskPlotPoint(risk: IdentifiedRisk): RiskPlotPoint;
/**
 * Gets numeric likelihood score
 */
export declare function getLikelihoodScore(likelihood: LikelihoodLevel): number;
/**
 * Gets numeric impact score
 */
export declare function getImpactScore(impact: ImpactLevel): number;
/**
 * Generates standard risk zones for heat map
 */
export declare function generateRiskZones(): RiskZone[];
/**
 * Categorizes risks for heat map summary
 */
export declare function categorizeRisksForHeatMap(plotPoints: RiskPlotPoint[]): {
    critical: number;
    high: number;
    medium: number;
    low: number;
};
/**
 * Creates segregation of duties matrix
 */
export declare function createSODMatrix(params: {
    matrixName: string;
    department: string;
    processArea: string;
    reviewedBy: string;
}): SegregationOfDutiesMatrix;
/**
 * Adds incompatible function pair
 */
export declare function addIncompatibleFunction(matrix: SegregationOfDutiesMatrix, incompatibleFunction: IncompatibleFunction): SegregationOfDutiesMatrix;
/**
 * Records SOD violation
 */
export declare function recordSODViolation(matrix: SegregationOfDutiesMatrix, violation: SODViolation): SegregationOfDutiesMatrix;
/**
 * Validates user access against SOD matrix
 */
export declare function validateUserSOD(matrix: SegregationOfDutiesMatrix, userId: string, userName: string, userRoles: string[]): SODViolation | null;
/**
 * Creates authorization matrix
 */
export declare function createAuthorizationMatrix(params: {
    matrixName: string;
    processArea: string;
    department: string;
    approvedBy: string;
}): AuthorizationMatrix;
/**
 * Adds authorization level
 */
export declare function addAuthorizationLevel(matrix: AuthorizationMatrix, level: AuthorizationLevel): AuthorizationMatrix;
/**
 * Validates authorization for transaction
 */
export declare function validateAuthorization(matrix: AuthorizationMatrix, userRole: string, transactionAmount?: number): {
    authorized: boolean;
    level?: AuthorizationLevel;
    reason?: string;
};
/**
 * Creates fraud risk assessment
 */
export declare function createFraudRiskAssessment(params: {
    assessmentPeriod: string;
    performedBy: string;
    scope: FraudRiskScope[];
    nextAssessmentDate: Date;
}): FraudRiskAssessment;
/**
 * Adds fraud scheme to assessment
 */
export declare function addFraudScheme(assessment: FraudRiskAssessment, scheme: FraudScheme): FraudRiskAssessment;
/**
 * Analyzes fraud triangle
 */
export declare function analyzeFraudTriangle(pressureFactors: string[], opportunityFactors: string[], rationalizationFactors: string[]): FraudTriangleAnalysis;
/**
 * Creates whistleblower case
 */
export declare function createWhistleblowerCase(params: {
    reportingChannel: ReportingChannel;
    anonymousReport: boolean;
    allegationType: AllegationType;
    allegationSummary: string;
    departments: string[];
    reporterContact?: string;
}): WhistleblowerCase;
/**
 * Generates unique case number
 */
export declare function generateWhistleblowerCaseNumber(): string;
/**
 * Determines case priority from allegation type
 */
export declare function determineCasePriority(allegationType: AllegationType): 'critical' | 'high' | 'medium' | 'low';
/**
 * Assigns investigator to case
 */
export declare function assignInvestigator(caseRecord: WhistleblowerCase, investigatorId: string): WhistleblowerCase;
/**
 * Closes whistleblower case
 */
export declare function closeWhistleblowerCase(caseRecord: WhistleblowerCase, substantiated: boolean, findings: string): WhistleblowerCase;
/**
 * Creates internal audit plan
 */
export declare function createInternalAuditPlan(params: {
    planName: string;
    fiscalYear: number;
    approvedBy: string;
    riskBasedApproach?: boolean;
}): InternalAuditPlan;
/**
 * Adds auditable entity to audit universe
 */
export declare function addAuditableEntity(plan: InternalAuditPlan, entity: AuditableEntity): InternalAuditPlan;
/**
 * Schedules audit based on risk
 */
export declare function scheduleAudit(plan: InternalAuditPlan, audit: PlannedAudit): InternalAuditPlan;
/**
 * Prioritizes audit universe by risk
 */
export declare function prioritizeAuditUniverse(entities: AuditableEntity[]): AuditableEntity[];
/**
 * Creates audit finding
 */
export declare function createAuditFinding(params: {
    findingNumber: string;
    auditId: string;
    findingTitle: string;
    condition: string;
    criteria: string;
    cause: string;
    effect: string;
    recommendation: string;
    severity: DeficiencySeverity;
    riskRating: RiskLevel;
}): AuditFinding;
/**
 * Records management response
 */
export declare function recordManagementResponse(finding: AuditFinding, managementResponse: string, agreedUponAction: string, responsibleParty: string, targetCompletionDate: Date): AuditFinding;
/**
 * Updates finding remediation status
 */
export declare function updateFindingStatus(finding: AuditFinding, status: FindingStatus): AuditFinding;
/**
 * Verifies finding remediation
 */
export declare function verifyFindingRemediation(finding: AuditFinding, verificationEvidence: string): AuditFinding;
/**
 * Gets overdue audit findings
 */
export declare function getOverdueFindings(findings: AuditFinding[], currentDate?: Date): AuditFinding[];
/**
 * Creates business continuity plan
 */
export declare function createBusinessContinuityPlan(params: {
    planName: string;
    department: string;
    planOwner: string;
    approvedBy: string;
}): BusinessContinuityPlan;
/**
 * Creates disaster recovery plan
 */
export declare function createDisasterRecoveryPlan(params: {
    planName: string;
    systemName: string;
    systemOwner: string;
    approvedBy: string;
    rto: number;
    rpo: number;
}): DisasterRecoveryPlan;
/**
 * Creates incident response record
 */
export declare function createIncidentResponse(params: {
    incidentType: IncidentType;
    severity: IncidentSeverity;
    incidentDescription: string;
    reportedBy: string;
    affectedSystems: string[];
    affectedDepartments: string[];
}): IncidentResponseRecord;
/**
 * Generates unique incident number
 */
export declare function generateIncidentNumber(): string;
/**
 * Updates incident status
 */
export declare function updateIncidentStatus(incident: IncidentResponseRecord, status: IncidentStatus): IncidentResponseRecord;
/**
 * Closes incident
 */
export declare function closeIncident(incident: IncidentResponseRecord, lessonsLearned: string[], preventativeMeasures: string[]): IncidentResponseRecord;
/**
 * Generates risk dashboard metrics
 */
export declare function generateRiskDashboardMetrics(params: {
    period: string;
    risks: IdentifiedRisk[];
    controls: InternalControl[];
    deficiencies: ControlDeficiency[];
    findings: AuditFinding[];
    testingRecords: ControlTestingRecord[];
    registerEntries: RiskRegisterEntry[];
}): RiskDashboardMetrics;
/**
 * Categorizes risks by level
 */
export declare function categorizeRisksByLevel(risks: IdentifiedRisk[]): Record<RiskLevel, number>;
/**
 * Categorizes risks by category
 */
export declare function categorizeRisksByCategory(risks: IdentifiedRisk[]): Record<RiskCategory, number>;
/**
 * Sequelize model for EnterpriseRiskAssessment
 */
export declare const EnterpriseRiskAssessmentModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        assessmentName: {
            type: string;
            allowNull: boolean;
        };
        assessmentPeriod: {
            type: string;
            allowNull: boolean;
        };
        fiscalYear: {
            type: string;
            allowNull: boolean;
        };
        agencyId: {
            type: string;
            allowNull: boolean;
        };
        performedBy: {
            type: string;
            allowNull: boolean;
        };
        assessmentDate: {
            type: string;
            allowNull: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        approvalDate: {
            type: string;
            allowNull: boolean;
        };
        riskFramework: {
            type: string;
            values: RiskFramework[];
        };
        scope: {
            type: string;
            defaultValue: never[];
        };
        objectives: {
            type: string;
            defaultValue: never[];
        };
        risks: {
            type: string;
            defaultValue: never[];
        };
        overallRiskLevel: {
            type: string;
            values: RiskLevel[];
        };
        overallRiskScore: {
            type: string;
            defaultValue: number;
        };
        executiveSummary: {
            type: string;
            allowNull: boolean;
        };
        nextReviewDate: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: AssessmentStatus[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for IdentifiedRisk
 */
export declare const IdentifiedRiskModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        riskCode: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        riskTitle: {
            type: string;
            allowNull: boolean;
        };
        riskDescription: {
            type: string;
            allowNull: boolean;
        };
        riskCategory: {
            type: string;
            values: RiskCategory[];
        };
        riskType: {
            type: string;
            values: RiskType[];
        };
        identifiedDate: {
            type: string;
            allowNull: boolean;
        };
        identifiedBy: {
            type: string;
            allowNull: boolean;
        };
        ownerDepartment: {
            type: string;
            allowNull: boolean;
        };
        riskOwner: {
            type: string;
            allowNull: boolean;
        };
        likelihood: {
            type: string;
            values: LikelihoodLevel[];
        };
        impact: {
            type: string;
            values: ImpactLevel[];
        };
        inherentRiskScore: {
            type: string;
            allowNull: boolean;
        };
        currentControls: {
            type: string;
            defaultValue: never[];
        };
        residualLikelihood: {
            type: string;
            values: LikelihoodLevel[];
        };
        residualImpact: {
            type: string;
            values: ImpactLevel[];
        };
        residualRiskScore: {
            type: string;
            allowNull: boolean;
        };
        riskAppetite: {
            type: string;
            values: RiskAppetite[];
        };
        riskResponse: {
            type: string;
            values: RiskResponse[];
        };
        status: {
            type: string;
            values: RiskStatus[];
        };
        lastReviewDate: {
            type: string;
            allowNull: boolean;
        };
        nextReviewDate: {
            type: string;
            allowNull: boolean;
        };
        escalated: {
            type: string;
            defaultValue: boolean;
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for InternalControl
 */
export declare const InternalControlModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        controlCode: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        controlName: {
            type: string;
            allowNull: boolean;
        };
        controlDescription: {
            type: string;
            allowNull: boolean;
        };
        controlObjective: {
            type: string;
            allowNull: boolean;
        };
        controlType: {
            type: string;
            values: ControlType[];
        };
        controlCategory: {
            type: string;
            values: ControlCategory[];
        };
        controlFrequency: {
            type: string;
            values: ControlFrequency[];
        };
        ownerDepartment: {
            type: string;
            allowNull: boolean;
        };
        controlOwner: {
            type: string;
            allowNull: boolean;
        };
        designEffectiveness: {
            type: string;
            values: EffectivenessRating[];
        };
        operatingEffectiveness: {
            type: string;
            values: EffectivenessRating[];
        };
        automationLevel: {
            type: string;
            values: AutomationLevel[];
        };
        relatedRisks: {
            type: string;
            defaultValue: never[];
        };
        testingProcedures: {
            type: string;
            defaultValue: never[];
        };
        lastTestDate: {
            type: string;
            allowNull: boolean;
        };
        nextTestDate: {
            type: string;
            allowNull: boolean;
        };
        deficiencies: {
            type: string;
            defaultValue: never[];
        };
        compensatingControls: {
            type: string;
            defaultValue: never[];
        };
        status: {
            type: string;
            values: ControlStatus[];
        };
        implementationDate: {
            type: string;
            allowNull: boolean;
        };
        cosoComponent: {
            type: string;
            values: COSOComponent[];
            allowNull: boolean;
        };
        cosoObjective: {
            type: string;
            values: COSOObjective[];
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for ControlDeficiency
 */
export declare const ControlDeficiencyModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        controlId: {
            type: string;
            allowNull: boolean;
        };
        deficiencyType: {
            type: string;
            values: DeficiencyType[];
        };
        severity: {
            type: string;
            values: DeficiencySeverity[];
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        rootCause: {
            type: string;
            allowNull: boolean;
        };
        identifiedDate: {
            type: string;
            allowNull: boolean;
        };
        identifiedBy: {
            type: string;
            allowNull: boolean;
        };
        impact: {
            type: string;
            allowNull: boolean;
        };
        remediation: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: DeficiencyStatus[];
        };
        relatedFindings: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for WhistleblowerCase
 */
export declare const WhistleblowerCaseModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        caseNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        receivedDate: {
            type: string;
            allowNull: boolean;
        };
        reportingChannel: {
            type: string;
            values: ReportingChannel[];
        };
        anonymousReport: {
            type: string;
            defaultValue: boolean;
        };
        reporterContact: {
            type: string;
            allowNull: boolean;
        };
        allegationType: {
            type: string;
            values: AllegationType[];
        };
        allegationSummary: {
            type: string;
            allowNull: boolean;
        };
        departments: {
            type: string;
            defaultValue: never[];
        };
        individualsInvolved: {
            type: string;
            defaultValue: never[];
        };
        assignedInvestigator: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: WhistleblowerStatus[];
        };
        investigationStartDate: {
            type: string;
            allowNull: boolean;
        };
        investigationEndDate: {
            type: string;
            allowNull: boolean;
        };
        findings: {
            type: string;
            allowNull: boolean;
        };
        substantiated: {
            type: string;
            defaultValue: boolean;
        };
        correctiveActions: {
            type: string;
            defaultValue: never[];
        };
        confidentialityMaintained: {
            type: string;
            defaultValue: boolean;
        };
        retaliationConcerns: {
            type: string;
            defaultValue: boolean;
        };
        closedDate: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for IncidentResponseRecord
 */
export declare const IncidentResponseRecordModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        incidentNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        incidentDate: {
            type: string;
            allowNull: boolean;
        };
        detectedDate: {
            type: string;
            allowNull: boolean;
        };
        reportedDate: {
            type: string;
            allowNull: boolean;
        };
        reportedBy: {
            type: string;
            allowNull: boolean;
        };
        incidentType: {
            type: string;
            values: IncidentType[];
        };
        severity: {
            type: string;
            values: IncidentSeverity[];
        };
        affectedSystems: {
            type: string;
            defaultValue: never[];
        };
        affectedDepartments: {
            type: string;
            defaultValue: never[];
        };
        incidentDescription: {
            type: string;
            allowNull: boolean;
        };
        initialAssessment: {
            type: string;
            allowNull: boolean;
        };
        responseTeam: {
            type: string;
            defaultValue: never[];
        };
        responsePhases: {
            type: string;
            defaultValue: never[];
        };
        containmentActions: {
            type: string;
            defaultValue: never[];
        };
        eradicationActions: {
            type: string;
            defaultValue: never[];
        };
        recoveryActions: {
            type: string;
            defaultValue: never[];
        };
        lessonsLearned: {
            type: string;
            defaultValue: never[];
        };
        rootCause: {
            type: string;
            allowNull: boolean;
        };
        preventativeMeasures: {
            type: string;
            defaultValue: never[];
        };
        estimatedCost: {
            type: string;
            allowNull: boolean;
        };
        regulatoryNotificationRequired: {
            type: string;
            defaultValue: boolean;
        };
        notificationsSent: {
            type: string;
            defaultValue: never[];
        };
        status: {
            type: string;
            values: IncidentStatus[];
        };
        resolvedDate: {
            type: string;
            allowNull: boolean;
        };
        closedDate: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Example NestJS service for risk management
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class RiskManagementService {
 *   constructor(
 *     @InjectModel(IdentifiedRiskModel)
 *     private riskRepo: Repository<IdentifiedRisk>,
 *     @InjectModel(InternalControlModel)
 *     private controlRepo: Repository<InternalControl>,
 *   ) {}
 *
 *   async createRisk(dto: CreateRiskDto): Promise<IdentifiedRisk> {
 *     const risk = identifyRisk(dto);
 *     return this.riskRepo.save(risk);
 *   }
 *
 *   async getRiskDashboard(period: string): Promise<RiskDashboardMetrics> {
 *     const risks = await this.riskRepo.find();
 *     const controls = await this.controlRepo.find();
 *     return generateRiskDashboardMetrics({ period, risks, controls, ... });
 *   }
 * }
 * ```
 */
export declare const RiskManagementServiceExample = "\n@Injectable()\nexport class RiskManagementService {\n  constructor(\n    @InjectModel(IdentifiedRiskModel)\n    private riskRepo: Repository<IdentifiedRisk>,\n    @InjectModel(InternalControlModel)\n    private controlRepo: Repository<InternalControl>,\n    @InjectModel(ControlDeficiencyModel)\n    private deficiencyRepo: Repository<ControlDeficiency>,\n  ) {}\n\n  async createEnterpriseAssessment(dto: CreateAssessmentDto): Promise<EnterpriseRiskAssessment> {\n    const assessment = createEnterpriseRiskAssessment(dto);\n    return this.assessmentRepo.save(assessment);\n  }\n\n  async identifyRisk(dto: CreateRiskDto): Promise<IdentifiedRisk> {\n    const risk = identifyRisk(dto);\n    const saved = await this.riskRepo.save(risk);\n\n    // Create risk register entry\n    const registerEntry = createRiskRegisterEntry(saved);\n    await this.registerRepo.save(registerEntry);\n\n    return saved;\n  }\n\n  async generateHeatMap(period: string): Promise<RiskHeatMap> {\n    const risks = await this.riskRepo.find({ where: { status: RiskStatus.ACTIVE } });\n    return generateRiskHeatMap({ periodCovered: period, generatedBy: 'System', risks });\n  }\n\n  async getDashboardMetrics(period: string): Promise<RiskDashboardMetrics> {\n    const risks = await this.riskRepo.find();\n    const controls = await this.controlRepo.find();\n    const deficiencies = await this.deficiencyRepo.find();\n\n    return generateRiskDashboardMetrics({\n      period,\n      risks,\n      controls,\n      deficiencies,\n      findings: [],\n      testingRecords: [],\n      registerEntries: [],\n    });\n  }\n}\n";
/**
 * Swagger DTO for creating risk
 */
export declare const CreateRiskDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            riskCode: {
                type: string;
                example: string;
            };
            riskTitle: {
                type: string;
                example: string;
            };
            riskDescription: {
                type: string;
                example: string;
            };
            riskCategory: {
                type: string;
                enum: RiskCategory[];
            };
            ownerDepartment: {
                type: string;
                example: string;
            };
            riskOwner: {
                type: string;
                example: string;
            };
            likelihood: {
                type: string;
                enum: LikelihoodLevel[];
            };
            impact: {
                type: string;
                enum: ImpactLevel[];
            };
            identifiedBy: {
                type: string;
                example: string;
            };
        };
    };
};
/**
 * Swagger DTO for creating internal control
 */
export declare const CreateInternalControlDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            controlCode: {
                type: string;
                example: string;
            };
            controlName: {
                type: string;
                example: string;
            };
            controlDescription: {
                type: string;
                example: string;
            };
            controlObjective: {
                type: string;
                example: string;
            };
            controlType: {
                type: string;
                enum: ControlType[];
            };
            controlCategory: {
                type: string;
                enum: ControlCategory[];
            };
            controlFrequency: {
                type: string;
                enum: ControlFrequency[];
            };
            ownerDepartment: {
                type: string;
                example: string;
            };
            controlOwner: {
                type: string;
                example: string;
            };
            cosoComponent: {
                type: string;
                enum: COSOComponent[];
                nullable: boolean;
            };
            cosoObjective: {
                type: string;
                enum: COSOObjective[];
                nullable: boolean;
            };
        };
    };
};
/**
 * Swagger response schema for risk heat map
 */
export declare const RiskHeatMapResponse: {
    schema: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            generatedDate: {
                type: string;
                format: string;
            };
            generatedBy: {
                type: string;
                example: string;
            };
            periodCovered: {
                type: string;
                example: string;
            };
            totalRisks: {
                type: string;
                example: number;
            };
            criticalRisks: {
                type: string;
                example: number;
            };
            highRisks: {
                type: string;
                example: number;
            };
            mediumRisks: {
                type: string;
                example: number;
            };
            lowRisks: {
                type: string;
                example: number;
            };
            riskPlotPoints: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        riskId: {
                            type: string;
                            format: string;
                        };
                        riskTitle: {
                            type: string;
                        };
                        likelihoodScore: {
                            type: string;
                            minimum: number;
                            maximum: number;
                        };
                        impactScore: {
                            type: string;
                            minimum: number;
                            maximum: number;
                        };
                        riskScore: {
                            type: string;
                        };
                        riskLevel: {
                            type: string;
                            enum: RiskLevel[];
                        };
                    };
                };
            };
        };
    };
};
/**
 * Swagger response schema for risk dashboard
 */
export declare const RiskDashboardMetricsResponse: {
    schema: {
        type: string;
        properties: {
            generatedDate: {
                type: string;
                format: string;
            };
            period: {
                type: string;
                example: string;
            };
            totalRisks: {
                type: string;
                example: number;
            };
            risksByLevel: {
                type: string;
                properties: {
                    CRITICAL: {
                        type: string;
                        example: number;
                    };
                    HIGH: {
                        type: string;
                        example: number;
                    };
                    MEDIUM: {
                        type: string;
                        example: number;
                    };
                    LOW: {
                        type: string;
                        example: number;
                    };
                };
            };
            totalControls: {
                type: string;
                example: number;
            };
            effectiveControls: {
                type: string;
                example: number;
            };
            controlEffectivenessRate: {
                type: string;
                example: number;
            };
            openDeficiencies: {
                type: string;
                example: number;
            };
            materialWeaknesses: {
                type: string;
                example: number;
            };
            significantDeficiencies: {
                type: string;
                example: number;
            };
            openAuditFindings: {
                type: string;
                example: number;
            };
            overdueFindings: {
                type: string;
                example: number;
            };
        };
    };
};
//# sourceMappingURL=risk-management-internal-controls-kit.d.ts.map