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
 * File: /reuse/government/risk-management-internal-controls-kit.ts
 * Locator: WC-GOV-RISK-INTERNAL-CONTROLS-001
 * Purpose: Comprehensive Risk Management and Internal Controls for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Risk services, Internal audit, Control testing, ERM dashboard, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ enterprise risk management and internal control functions
 *
 * LLM Context: Enterprise-grade risk management and internal controls for government agencies.
 * Provides comprehensive risk assessment, risk identification, mitigation planning, control
 * framework implementation, control testing, deficiency tracking, risk registers, heat maps,
 * COSO compliance, fraud risk, whistleblower management, internal audit, business continuity,
 * disaster recovery, incident response, and extensive NestJS/Sequelize integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export enum RiskFramework {
  COSO_ERM = 'COSO_ERM',
  ISO_31000 = 'ISO_31000',
  NIST_RMF = 'NIST_RMF',
  FAIR = 'FAIR',
  OMB_CIRCULAR_A123 = 'OMB_CIRCULAR_A123',
  GAO_GREEN_BOOK = 'GAO_GREEN_BOOK',
  COBIT = 'COBIT',
  CUSTOM = 'CUSTOM',
}

/**
 * Assessment scope
 */
export enum AssessmentScope {
  STRATEGIC = 'STRATEGIC',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  COMPLIANCE = 'COMPLIANCE',
  REPUTATIONAL = 'REPUTATIONAL',
  TECHNOLOGICAL = 'TECHNOLOGICAL',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  LEGAL = 'LEGAL',
  CYBERSECURITY = 'CYBERSECURITY',
  THIRD_PARTY = 'THIRD_PARTY',
}

/**
 * Assessment status
 */
export enum AssessmentStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  UNDER_REVIEW = 'UNDER_REVIEW',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
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
export enum RiskCategory {
  STRATEGIC_RISK = 'STRATEGIC_RISK',
  OPERATIONAL_RISK = 'OPERATIONAL_RISK',
  FINANCIAL_RISK = 'FINANCIAL_RISK',
  COMPLIANCE_RISK = 'COMPLIANCE_RISK',
  FRAUD_RISK = 'FRAUD_RISK',
  REPUTATION_RISK = 'REPUTATION_RISK',
  CYBERSECURITY_RISK = 'CYBERSECURITY_RISK',
  TECHNOLOGY_RISK = 'TECHNOLOGY_RISK',
  HUMAN_CAPITAL_RISK = 'HUMAN_CAPITAL_RISK',
  THIRD_PARTY_RISK = 'THIRD_PARTY_RISK',
  BUSINESS_CONTINUITY_RISK = 'BUSINESS_CONTINUITY_RISK',
  ENVIRONMENTAL_RISK = 'ENVIRONMENTAL_RISK',
}

/**
 * Risk types
 */
export enum RiskType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  EMERGING = 'EMERGING',
  RESIDUAL = 'RESIDUAL',
  INHERENT = 'INHERENT',
}

/**
 * Risk level
 */
export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NEGLIGIBLE = 'NEGLIGIBLE',
}

/**
 * Likelihood level
 */
export enum LikelihoodLevel {
  VERY_LIKELY = 'VERY_LIKELY',
  LIKELY = 'LIKELY',
  POSSIBLE = 'POSSIBLE',
  UNLIKELY = 'UNLIKELY',
  RARE = 'RARE',
}

/**
 * Impact level
 */
export enum ImpactLevel {
  CATASTROPHIC = 'CATASTROPHIC',
  MAJOR = 'MAJOR',
  MODERATE = 'MODERATE',
  MINOR = 'MINOR',
  INSIGNIFICANT = 'INSIGNIFICANT',
}

/**
 * Risk appetite
 */
export enum RiskAppetite {
  ZERO_TOLERANCE = 'ZERO_TOLERANCE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  AGGRESSIVE = 'AGGRESSIVE',
}

/**
 * Risk response strategy
 */
export enum RiskResponse {
  AVOID = 'AVOID',
  MITIGATE = 'MITIGATE',
  TRANSFER = 'TRANSFER',
  ACCEPT = 'ACCEPT',
  MONITOR = 'MONITOR',
}

/**
 * Risk status
 */
export enum RiskStatus {
  ACTIVE = 'ACTIVE',
  MONITORING = 'MONITORING',
  MITIGATING = 'MITIGATING',
  MITIGATED = 'MITIGATED',
  ACCEPTED = 'ACCEPTED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
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
export enum MitigationStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
export enum ControlType {
  PREVENTIVE = 'PREVENTIVE',
  DETECTIVE = 'DETECTIVE',
  CORRECTIVE = 'CORRECTIVE',
  DIRECTIVE = 'DIRECTIVE',
  COMPENSATING = 'COMPENSATING',
}

/**
 * Control category
 */
export enum ControlCategory {
  AUTHORIZATION = 'AUTHORIZATION',
  SEGREGATION_OF_DUTIES = 'SEGREGATION_OF_DUTIES',
  PHYSICAL_CONTROL = 'PHYSICAL_CONTROL',
  RECONCILIATION = 'RECONCILIATION',
  REVIEW = 'REVIEW',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  INFORMATION_PROCESSING = 'INFORMATION_PROCESSING',
  PERFORMANCE_INDICATOR = 'PERFORMANCE_INDICATOR',
  DOCUMENTATION = 'DOCUMENTATION',
}

/**
 * Control frequency
 */
export enum ControlFrequency {
  CONTINUOUS = 'CONTINUOUS',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  EVENT_DRIVEN = 'EVENT_DRIVEN',
}

/**
 * Effectiveness rating
 */
export enum EffectivenessRating {
  EFFECTIVE = 'EFFECTIVE',
  PARTIALLY_EFFECTIVE = 'PARTIALLY_EFFECTIVE',
  INEFFECTIVE = 'INEFFECTIVE',
  NOT_TESTED = 'NOT_TESTED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

/**
 * Automation level
 */
export enum AutomationLevel {
  FULLY_AUTOMATED = 'FULLY_AUTOMATED',
  SEMI_AUTOMATED = 'SEMI_AUTOMATED',
  MANUAL = 'MANUAL',
  MANUAL_WITH_IT = 'MANUAL_WITH_IT',
}

/**
 * Control status
 */
export enum ControlStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  IN_DESIGN = 'IN_DESIGN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  NEEDS_REMEDIATION = 'NEEDS_REMEDIATION',
  RETIRED = 'RETIRED',
}

/**
 * COSO components
 */
export enum COSOComponent {
  CONTROL_ENVIRONMENT = 'CONTROL_ENVIRONMENT',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  CONTROL_ACTIVITIES = 'CONTROL_ACTIVITIES',
  INFORMATION_COMMUNICATION = 'INFORMATION_COMMUNICATION',
  MONITORING_ACTIVITIES = 'MONITORING_ACTIVITIES',
}

/**
 * COSO objectives
 */
export enum COSOObjective {
  OPERATIONS = 'OPERATIONS',
  REPORTING = 'REPORTING',
  COMPLIANCE = 'COMPLIANCE',
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
export enum DeficiencyType {
  DESIGN_DEFICIENCY = 'DESIGN_DEFICIENCY',
  OPERATING_DEFICIENCY = 'OPERATING_DEFICIENCY',
  BOTH = 'BOTH',
}

/**
 * Deficiency severity
 */
export enum DeficiencySeverity {
  MATERIAL_WEAKNESS = 'MATERIAL_WEAKNESS',
  SIGNIFICANT_DEFICIENCY = 'SIGNIFICANT_DEFICIENCY',
  DEFICIENCY = 'DEFICIENCY',
  OBSERVATION = 'OBSERVATION',
}

/**
 * Deficiency status
 */
export enum DeficiencyStatus {
  OPEN = 'OPEN',
  IN_REMEDIATION = 'IN_REMEDIATION',
  REMEDIATED = 'REMEDIATED',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED',
  ACCEPTED = 'ACCEPTED',
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
export enum TestType {
  DESIGN_TESTING = 'DESIGN_TESTING',
  OPERATING_EFFECTIVENESS = 'OPERATING_EFFECTIVENESS',
  WALKTHROUGH = 'WALKTHROUGH',
  INQUIRY = 'INQUIRY',
  OBSERVATION = 'OBSERVATION',
  INSPECTION = 'INSPECTION',
  REPERFORMANCE = 'REPERFORMANCE',
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
export enum TestConclusion {
  NO_EXCEPTIONS = 'NO_EXCEPTIONS',
  MINOR_EXCEPTIONS = 'MINOR_EXCEPTIONS',
  SIGNIFICANT_EXCEPTIONS = 'SIGNIFICANT_EXCEPTIONS',
  CONTROL_NOT_OPERATING = 'CONTROL_NOT_OPERATING',
  INCONCLUSIVE = 'INCONCLUSIVE',
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
export enum RiskTrend {
  INCREASING = 'INCREASING',
  STABLE = 'STABLE',
  DECREASING = 'DECREASING',
  NEW = 'NEW',
  EMERGING = 'EMERGING',
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
export enum FraudRiskScope {
  FINANCIAL_REPORTING = 'FINANCIAL_REPORTING',
  ASSET_MISAPPROPRIATION = 'ASSET_MISAPPROPRIATION',
  CORRUPTION = 'CORRUPTION',
  PROCUREMENT_FRAUD = 'PROCUREMENT_FRAUD',
  PAYROLL_FRAUD = 'PAYROLL_FRAUD',
  GRANT_FRAUD = 'GRANT_FRAUD',
  VENDOR_FRAUD = 'VENDOR_FRAUD',
  CYBERSECURITY_FRAUD = 'CYBERSECURITY_FRAUD',
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
export enum ReportingChannel {
  HOTLINE = 'HOTLINE',
  EMAIL = 'EMAIL',
  WEB_PORTAL = 'WEB_PORTAL',
  IN_PERSON = 'IN_PERSON',
  MAIL = 'MAIL',
  THIRD_PARTY_SERVICE = 'THIRD_PARTY_SERVICE',
}

/**
 * Allegation type
 */
export enum AllegationType {
  FRAUD = 'FRAUD',
  WASTE = 'WASTE',
  ABUSE = 'ABUSE',
  MISCONDUCT = 'MISCONDUCT',
  ETHICS_VIOLATION = 'ETHICS_VIOLATION',
  CONFLICT_OF_INTEREST = 'CONFLICT_OF_INTEREST',
  SAFETY_VIOLATION = 'SAFETY_VIOLATION',
  REGULATORY_VIOLATION = 'REGULATORY_VIOLATION',
  RETALIATION = 'RETALIATION',
}

/**
 * Whistleblower status
 */
export enum WhistleblowerStatus {
  RECEIVED = 'RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INVESTIGATION_ASSIGNED = 'INVESTIGATION_ASSIGNED',
  INVESTIGATING = 'INVESTIGATING',
  INVESTIGATION_COMPLETE = 'INVESTIGATION_COMPLETE',
  CLOSED_SUBSTANTIATED = 'CLOSED_SUBSTANTIATED',
  CLOSED_UNSUBSTANTIATED = 'CLOSED_UNSUBSTANTIATED',
  CLOSED_INSUFFICIENT_EVIDENCE = 'CLOSED_INSUFFICIENT_EVIDENCE',
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
export enum AuditType {
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  COMPLIANCE = 'COMPLIANCE',
  IT = 'IT',
  PERFORMANCE = 'PERFORMANCE',
  FRAUD = 'FRAUD',
  INVESTIGATIVE = 'INVESTIGATIVE',
  FOLLOW_UP = 'FOLLOW_UP',
  ADVISORY = 'ADVISORY',
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
export enum FindingStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  MANAGEMENT_RESPONSE_PENDING = 'MANAGEMENT_RESPONSE_PENDING',
  ACTION_PLAN_APPROVED = 'ACTION_PLAN_APPROVED',
  IN_REMEDIATION = 'IN_REMEDIATION',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  CLOSED = 'CLOSED',
  OVERDUE = 'OVERDUE',
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
export enum ThirdPartyAssessmentType {
  INITIAL = 'INITIAL',
  PERIODIC_REVIEW = 'PERIODIC_REVIEW',
  EVENT_DRIVEN = 'EVENT_DRIVEN',
  CONTRACT_RENEWAL = 'CONTRACT_RENEWAL',
  EXIT_ASSESSMENT = 'EXIT_ASSESSMENT',
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
  rto: number; // Recovery Time Objective in hours
  rpo: number; // Recovery Point Objective in hours
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
export enum IncidentType {
  CYBERSECURITY = 'CYBERSECURITY',
  DATA_BREACH = 'DATA_BREACH',
  SYSTEM_OUTAGE = 'SYSTEM_OUTAGE',
  NATURAL_DISASTER = 'NATURAL_DISASTER',
  OPERATIONAL_FAILURE = 'OPERATIONAL_FAILURE',
  FRAUD = 'FRAUD',
  PHYSICAL_SECURITY = 'PHYSICAL_SECURITY',
  VENDOR_FAILURE = 'VENDOR_FAILURE',
  HUMAN_ERROR = 'HUMAN_ERROR',
}

/**
 * Incident severity
 */
export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Incident status
 */
export enum IncidentStatus {
  REPORTED = 'REPORTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  ERADICATED = 'ERADICATED',
  RECOVERING = 'RECOVERING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
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

// ============================================================================
// ENTERPRISE RISK ASSESSMENT FUNCTIONS
// ============================================================================

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
export function createEnterpriseRiskAssessment(params: {
  assessmentName: string;
  assessmentPeriod: string;
  fiscalYear: number;
  agencyId: string;
  performedBy: string;
  riskFramework: RiskFramework;
  scope: AssessmentScope[];
  nextReviewDate: Date;
}): EnterpriseRiskAssessment {
  return {
    id: crypto.randomUUID(),
    assessmentName: params.assessmentName,
    assessmentPeriod: params.assessmentPeriod,
    fiscalYear: params.fiscalYear,
    agencyId: params.agencyId,
    performedBy: params.performedBy,
    assessmentDate: new Date(),
    riskFramework: params.riskFramework,
    scope: params.scope,
    objectives: [],
    risks: [],
    overallRiskLevel: RiskLevel.MEDIUM,
    overallRiskScore: 0,
    nextReviewDate: params.nextReviewDate,
    status: AssessmentStatus.PLANNING,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Updates assessment status
 */
export function updateAssessmentStatus(
  assessment: EnterpriseRiskAssessment,
  status: AssessmentStatus,
): EnterpriseRiskAssessment {
  return {
    ...assessment,
    status,
    updatedAt: new Date(),
  };
}

/**
 * Approves enterprise risk assessment
 */
export function approveRiskAssessment(
  assessment: EnterpriseRiskAssessment,
  approvedBy: string,
): EnterpriseRiskAssessment {
  return {
    ...assessment,
    approvedBy,
    approvalDate: new Date(),
    status: AssessmentStatus.APPROVED,
    updatedAt: new Date(),
  };
}

/**
 * Calculates overall risk score from identified risks
 */
export function calculateOverallRiskScore(risks: IdentifiedRisk[]): number {
  if (risks.length === 0) return 0;

  const totalScore = risks.reduce((sum, risk) => sum + risk.residualRiskScore, 0);
  return Math.round(totalScore / risks.length);
}

/**
 * Determines overall risk level from score
 */
export function determineOverallRiskLevel(score: number): RiskLevel {
  if (score >= 20) return RiskLevel.CRITICAL;
  if (score >= 15) return RiskLevel.HIGH;
  if (score >= 9) return RiskLevel.MEDIUM;
  if (score >= 4) return RiskLevel.LOW;
  return RiskLevel.NEGLIGIBLE;
}

// ============================================================================
// RISK IDENTIFICATION AND CATEGORIZATION
// ============================================================================

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
export function identifyRisk(params: {
  riskCode: string;
  riskTitle: string;
  riskDescription: string;
  riskCategory: RiskCategory;
  ownerDepartment: string;
  riskOwner: string;
  likelihood: LikelihoodLevel;
  impact: ImpactLevel;
  identifiedBy?: string;
}): IdentifiedRisk {
  const inherentRiskScore = calculateRiskScore(params.likelihood, params.impact);

  return {
    id: crypto.randomUUID(),
    riskCode: params.riskCode,
    riskTitle: params.riskTitle,
    riskDescription: params.riskDescription,
    riskCategory: params.riskCategory,
    riskType: RiskType.INHERENT,
    identifiedDate: new Date(),
    identifiedBy: params.identifiedBy || 'System',
    ownerDepartment: params.ownerDepartment,
    riskOwner: params.riskOwner,
    likelihood: params.likelihood,
    impact: params.impact,
    inherentRiskScore,
    currentControls: [],
    residualLikelihood: params.likelihood,
    residualImpact: params.impact,
    residualRiskScore: inherentRiskScore,
    riskAppetite: RiskAppetite.MODERATE,
    riskResponse: RiskResponse.MONITOR,
    status: RiskStatus.ACTIVE,
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    escalated: false,
    tags: [],
    metadata: {},
  };
}

/**
 * Calculates risk score from likelihood and impact
 */
export function calculateRiskScore(likelihood: LikelihoodLevel, impact: ImpactLevel): number {
  const likelihoodValues: Record<LikelihoodLevel, number> = {
    [LikelihoodLevel.VERY_LIKELY]: 5,
    [LikelihoodLevel.LIKELY]: 4,
    [LikelihoodLevel.POSSIBLE]: 3,
    [LikelihoodLevel.UNLIKELY]: 2,
    [LikelihoodLevel.RARE]: 1,
  };

  const impactValues: Record<ImpactLevel, number> = {
    [ImpactLevel.CATASTROPHIC]: 5,
    [ImpactLevel.MAJOR]: 4,
    [ImpactLevel.MODERATE]: 3,
    [ImpactLevel.MINOR]: 2,
    [ImpactLevel.INSIGNIFICANT]: 1,
  };

  return likelihoodValues[likelihood] * impactValues[impact];
}

/**
 * Categorizes risk level from score
 */
export function categorizeRiskLevel(score: number): RiskLevel {
  if (score >= 20) return RiskLevel.CRITICAL;
  if (score >= 15) return RiskLevel.HIGH;
  if (score >= 9) return RiskLevel.MEDIUM;
  if (score >= 4) return RiskLevel.LOW;
  return RiskLevel.NEGLIGIBLE;
}

/**
 * Updates residual risk after control implementation
 */
export function updateResidualRisk(
  risk: IdentifiedRisk,
  residualLikelihood: LikelihoodLevel,
  residualImpact: ImpactLevel,
  controlsImplemented: string[],
): IdentifiedRisk {
  const residualRiskScore = calculateRiskScore(residualLikelihood, residualImpact);

  return {
    ...risk,
    currentControls: [...new Set([...risk.currentControls, ...controlsImplemented])],
    residualLikelihood,
    residualImpact,
    residualRiskScore,
    lastReviewDate: new Date(),
  };
}

/**
 * Escalates risk to higher management
 */
export function escalateRisk(risk: IdentifiedRisk, reason: string): IdentifiedRisk {
  return {
    ...risk,
    escalated: true,
    status: RiskStatus.ESCALATED,
    metadata: {
      ...risk.metadata,
      escalationReason: reason,
      escalationDate: new Date().toISOString(),
    },
  };
}

/**
 * Filters risks by category
 */
export function filterRisksByCategory(
  risks: IdentifiedRisk[],
  category: RiskCategory,
): IdentifiedRisk[] {
  return risks.filter((risk) => risk.riskCategory === category);
}

/**
 * Gets high-priority risks requiring immediate attention
 */
export function getHighPriorityRisks(risks: IdentifiedRisk[]): IdentifiedRisk[] {
  return risks.filter(
    (risk) =>
      risk.residualRiskScore >= 15 &&
      risk.status !== RiskStatus.CLOSED &&
      risk.status !== RiskStatus.MITIGATED,
  );
}

// ============================================================================
// RISK MITIGATION PLANNING
// ============================================================================

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
export function createRiskMitigationPlan(params: {
  riskId: string;
  planName: string;
  objectives: string[];
  targetRiskLevel: RiskLevel;
  targetCompletionDate: Date;
  assignedTo: string[];
  budget?: number;
}): RiskMitigationPlan {
  return {
    id: crypto.randomUUID(),
    riskId: params.riskId,
    planName: params.planName,
    objectives: params.objectives,
    strategies: [],
    targetRiskLevel: params.targetRiskLevel,
    targetCompletionDate: params.targetCompletionDate,
    budget: params.budget,
    resources: [],
    assignedTo: params.assignedTo,
    progress: 0,
    status: MitigationStatus.NOT_STARTED,
    controlsToImplement: [],
    milestones: [],
    barriers: [],
    metadata: {},
  };
}

/**
 * Adds mitigation strategy to plan
 */
export function addMitigationStrategy(
  plan: RiskMitigationPlan,
  strategy: MitigationStrategy,
): RiskMitigationPlan {
  return {
    ...plan,
    strategies: [...plan.strategies, strategy],
  };
}

/**
 * Updates mitigation plan progress
 */
export function updateMitigationProgress(
  plan: RiskMitigationPlan,
  progress: number,
): RiskMitigationPlan {
  const status =
    progress === 100
      ? MitigationStatus.COMPLETED
      : progress > 0
        ? MitigationStatus.IN_PROGRESS
        : plan.status;

  return {
    ...plan,
    progress: Math.min(100, Math.max(0, progress)),
    status,
  };
}

/**
 * Calculates mitigation plan completion percentage
 */
export function calculateMitigationCompletion(plan: RiskMitigationPlan): number {
  if (plan.strategies.length === 0) return 0;

  const completedStrategies = plan.strategies.filter((s) => s.status === 'completed').length;
  return (completedStrategies / plan.strategies.length) * 100;
}

// ============================================================================
// CONTROL FRAMEWORK IMPLEMENTATION
// ============================================================================

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
export function createInternalControl(params: {
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
}): InternalControl {
  return {
    id: crypto.randomUUID(),
    controlCode: params.controlCode,
    controlName: params.controlName,
    controlDescription: params.controlDescription,
    controlObjective: params.controlObjective,
    controlType: params.controlType,
    controlCategory: params.controlCategory,
    controlFrequency: params.controlFrequency,
    ownerDepartment: params.ownerDepartment,
    controlOwner: params.controlOwner,
    designEffectiveness: EffectivenessRating.NOT_TESTED,
    operatingEffectiveness: EffectivenessRating.NOT_TESTED,
    automationLevel: AutomationLevel.MANUAL,
    relatedRisks: [],
    testingProcedures: [],
    nextTestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    deficiencies: [],
    status: ControlStatus.ACTIVE,
    implementationDate: new Date(),
    cosoComponent: params.cosoComponent,
    cosoObjective: params.cosoObjective,
    metadata: {},
  };
}

/**
 * Links control to risks
 */
export function linkControlToRisks(
  control: InternalControl,
  riskIds: string[],
): InternalControl {
  return {
    ...control,
    relatedRisks: [...new Set([...control.relatedRisks, ...riskIds])],
  };
}

/**
 * Updates control effectiveness rating
 */
export function updateControlEffectiveness(
  control: InternalControl,
  designEffectiveness: EffectivenessRating,
  operatingEffectiveness: EffectivenessRating,
): InternalControl {
  return {
    ...control,
    designEffectiveness,
    operatingEffectiveness,
  };
}

/**
 * Gets controls by COSO component
 */
export function getControlsByCOSOComponent(
  controls: InternalControl[],
  component: COSOComponent,
): InternalControl[] {
  return controls.filter((control) => control.cosoComponent === component);
}

/**
 * Validates COSO framework coverage
 */
export function validateCOSOCoverage(controls: InternalControl[]): {
  covered: COSOComponent[];
  missing: COSOComponent[];
  coveragePercentage: number;
} {
  const allComponents = Object.values(COSOComponent);
  const covered = [...new Set(controls.map((c) => c.cosoComponent).filter(Boolean))] as COSOComponent[];
  const missing = allComponents.filter((comp) => !covered.includes(comp));

  return {
    covered,
    missing,
    coveragePercentage: (covered.length / allComponents.length) * 100,
  };
}

// ============================================================================
// INTERNAL CONTROL TESTING
// ============================================================================

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
export function createControlTestingRecord(params: {
  controlId: string;
  testingPeriod: string;
  testType: TestType;
  testScope: string;
  testerName: string;
  testerRole: string;
  procedures: string[];
  sampleSize?: number;
  populationSize?: number;
}): ControlTestingRecord {
  return {
    id: crypto.randomUUID(),
    controlId: params.controlId,
    testingPeriod: params.testingPeriod,
    testDate: new Date(),
    testType: params.testType,
    testScope: params.testScope,
    sampleSize: params.sampleSize,
    populationSize: params.populationSize,
    testerName: params.testerName,
    testerRole: params.testerRole,
    procedures: params.procedures,
    observations: [],
    exceptions: 0,
    exceptionDetails: [],
    conclusion: TestConclusion.NO_EXCEPTIONS,
    operatingEffectiveness: EffectivenessRating.NOT_TESTED,
    recommendations: [],
    followUpRequired: false,
    metadata: {},
  };
}

/**
 * Adds test observation
 */
export function addTestObservation(
  testRecord: ControlTestingRecord,
  observation: TestObservation,
): ControlTestingRecord {
  return {
    ...testRecord,
    observations: [...testRecord.observations, observation],
  };
}

/**
 * Records test exception
 */
export function recordTestException(
  testRecord: ControlTestingRecord,
  exception: TestException,
): ControlTestingRecord {
  return {
    ...testRecord,
    exceptions: testRecord.exceptions + 1,
    exceptionDetails: [...(testRecord.exceptionDetails || []), exception],
  };
}

/**
 * Concludes control testing
 */
export function concludeControlTesting(
  testRecord: ControlTestingRecord,
  conclusion: TestConclusion,
  effectiveness: EffectivenessRating,
  recommendations: string[],
): ControlTestingRecord {
  return {
    ...testRecord,
    conclusion,
    operatingEffectiveness: effectiveness,
    recommendations,
    followUpRequired: conclusion !== TestConclusion.NO_EXCEPTIONS,
  };
}

/**
 * Calculates control testing exception rate
 */
export function calculateExceptionRate(testRecord: ControlTestingRecord): number {
  if (!testRecord.sampleSize || testRecord.sampleSize === 0) return 0;
  return (testRecord.exceptions / testRecord.sampleSize) * 100;
}

// ============================================================================
// CONTROL DEFICIENCY TRACKING
// ============================================================================

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
export function createControlDeficiency(params: {
  controlId: string;
  deficiencyType: DeficiencyType;
  severity: DeficiencySeverity;
  description: string;
  impact: string;
  identifiedBy: string;
  targetRemediationDate: Date;
}): ControlDeficiency {
  return {
    id: crypto.randomUUID(),
    controlId: params.controlId,
    deficiencyType: params.deficiencyType,
    severity: params.severity,
    description: params.description,
    identifiedDate: new Date(),
    identifiedBy: params.identifiedBy,
    impact: params.impact,
    remediation: {
      planId: crypto.randomUUID(),
      description: '',
      targetDate: params.targetRemediationDate,
      assignedTo: '',
      actions: [],
      progress: 0,
    },
    status: DeficiencyStatus.OPEN,
    relatedFindings: [],
    metadata: {},
  };
}

/**
 * Updates deficiency remediation plan
 */
export function updateDeficiencyRemediation(
  deficiency: ControlDeficiency,
  remediation: RemediationPlan,
): ControlDeficiency {
  return {
    ...deficiency,
    remediation,
    status: DeficiencyStatus.IN_REMEDIATION,
  };
}

/**
 * Closes deficiency after remediation
 */
export function closeDeficiency(
  deficiency: ControlDeficiency,
  verifiedBy: string,
): ControlDeficiency {
  return {
    ...deficiency,
    status: DeficiencyStatus.CLOSED,
    remediation: {
      ...deficiency.remediation,
      completionDate: new Date(),
      verificationDate: new Date(),
      verifiedBy,
      progress: 100,
    },
  };
}

/**
 * Gets open deficiencies by severity
 */
export function getOpenDeficienciesBySeverity(
  deficiencies: ControlDeficiency[],
  severity: DeficiencySeverity,
): ControlDeficiency[] {
  return deficiencies.filter(
    (d) => d.severity === severity && d.status !== DeficiencyStatus.CLOSED,
  );
}

/**
 * Gets material weaknesses requiring immediate attention
 */
export function getMaterialWeaknesses(deficiencies: ControlDeficiency[]): ControlDeficiency[] {
  return deficiencies.filter(
    (d) =>
      d.severity === DeficiencySeverity.MATERIAL_WEAKNESS &&
      d.status !== DeficiencyStatus.CLOSED,
  );
}

// ============================================================================
// RISK REGISTER MANAGEMENT
// ============================================================================

/**
 * Creates risk register entry
 */
export function createRiskRegisterEntry(risk: IdentifiedRisk): RiskRegisterEntry {
  return {
    id: crypto.randomUUID(),
    riskId: risk.id,
    registrationDate: new Date(),
    riskTitle: risk.riskTitle,
    riskCategory: risk.riskCategory,
    inherentRiskScore: risk.inherentRiskScore,
    residualRiskScore: risk.residualRiskScore,
    riskTrend: RiskTrend.NEW,
    controlsInPlace: risk.currentControls,
    riskOwner: risk.riskOwner,
    status: risk.status,
    lastUpdateDate: new Date(),
    lastReviewDate: risk.lastReviewDate,
    nextReviewDate: risk.nextReviewDate,
    escalationRequired: risk.escalated,
    boardReporting: risk.residualRiskScore >= 15,
    metadata: {},
  };
}

/**
 * Updates risk register entry trend
 */
export function updateRiskTrend(
  entry: RiskRegisterEntry,
  previousScore: number,
  currentScore: number,
): RiskRegisterEntry {
  let trend: RiskTrend;
  if (currentScore > previousScore) {
    trend = RiskTrend.INCREASING;
  } else if (currentScore < previousScore) {
    trend = RiskTrend.DECREASING;
  } else {
    trend = RiskTrend.STABLE;
  }

  return {
    ...entry,
    riskTrend: trend,
    residualRiskScore: currentScore,
    lastUpdateDate: new Date(),
  };
}

/**
 * Filters risk register by category
 */
export function filterRiskRegisterByCategory(
  entries: RiskRegisterEntry[],
  category: RiskCategory,
): RiskRegisterEntry[] {
  return entries.filter((entry) => entry.riskCategory === category);
}

/**
 * Gets risks requiring board reporting
 */
export function getBoardReportingRisks(entries: RiskRegisterEntry[]): RiskRegisterEntry[] {
  return entries.filter((entry) => entry.boardReporting);
}

// ============================================================================
// RISK HEAT MAP AND SCORING
// ============================================================================

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
export function generateRiskHeatMap(params: {
  periodCovered: string;
  generatedBy: string;
  risks: IdentifiedRisk[];
}): RiskHeatMap {
  const plotPoints = params.risks.map((risk) => createRiskPlotPoint(risk));
  const riskCounts = categorizeRisksForHeatMap(plotPoints);

  return {
    id: crypto.randomUUID(),
    generatedDate: new Date(),
    generatedBy: params.generatedBy,
    periodCovered: params.periodCovered,
    riskPlotPoints: plotPoints,
    riskZones: generateRiskZones(),
    totalRisks: params.risks.length,
    criticalRisks: riskCounts.critical,
    highRisks: riskCounts.high,
    mediumRisks: riskCounts.medium,
    lowRisks: riskCounts.low,
    metadata: {},
  };
}

/**
 * Creates risk plot point for heat map
 */
export function createRiskPlotPoint(risk: IdentifiedRisk): RiskPlotPoint {
  const likelihoodScore = getLikelihoodScore(risk.residualLikelihood);
  const impactScore = getImpactScore(risk.residualImpact);

  return {
    riskId: risk.id,
    riskTitle: risk.riskTitle,
    likelihoodScore,
    impactScore,
    riskScore: risk.residualRiskScore,
    riskLevel: categorizeRiskLevel(risk.residualRiskScore),
    category: risk.riskCategory,
    owner: risk.riskOwner,
  };
}

/**
 * Gets numeric likelihood score
 */
export function getLikelihoodScore(likelihood: LikelihoodLevel): number {
  const scores: Record<LikelihoodLevel, number> = {
    [LikelihoodLevel.VERY_LIKELY]: 5,
    [LikelihoodLevel.LIKELY]: 4,
    [LikelihoodLevel.POSSIBLE]: 3,
    [LikelihoodLevel.UNLIKELY]: 2,
    [LikelihoodLevel.RARE]: 1,
  };
  return scores[likelihood];
}

/**
 * Gets numeric impact score
 */
export function getImpactScore(impact: ImpactLevel): number {
  const scores: Record<ImpactLevel, number> = {
    [ImpactLevel.CATASTROPHIC]: 5,
    [ImpactLevel.MAJOR]: 4,
    [ImpactLevel.MODERATE]: 3,
    [ImpactLevel.MINOR]: 2,
    [ImpactLevel.INSIGNIFICANT]: 1,
  };
  return scores[impact];
}

/**
 * Generates standard risk zones for heat map
 */
export function generateRiskZones(): RiskZone[] {
  return [
    {
      zoneName: 'Critical Risk',
      riskLevel: RiskLevel.CRITICAL,
      color: '#8B0000',
      minLikelihood: 4,
      maxLikelihood: 5,
      minImpact: 4,
      maxImpact: 5,
      actionRequired: 'Immediate executive attention and mitigation required',
    },
    {
      zoneName: 'High Risk',
      riskLevel: RiskLevel.HIGH,
      color: '#FF4500',
      minLikelihood: 3,
      maxLikelihood: 5,
      minImpact: 3,
      maxImpact: 5,
      actionRequired: 'Senior management attention and mitigation plan required',
    },
    {
      zoneName: 'Medium Risk',
      riskLevel: RiskLevel.MEDIUM,
      color: '#FFD700',
      minLikelihood: 2,
      maxLikelihood: 4,
      minImpact: 2,
      maxImpact: 4,
      actionRequired: 'Management oversight and monitoring required',
    },
    {
      zoneName: 'Low Risk',
      riskLevel: RiskLevel.LOW,
      color: '#32CD32',
      minLikelihood: 1,
      maxLikelihood: 3,
      minImpact: 1,
      maxImpact: 3,
      actionRequired: 'Routine monitoring sufficient',
    },
  ];
}

/**
 * Categorizes risks for heat map summary
 */
export function categorizeRisksForHeatMap(plotPoints: RiskPlotPoint[]): {
  critical: number;
  high: number;
  medium: number;
  low: number;
} {
  return {
    critical: plotPoints.filter((p) => p.riskLevel === RiskLevel.CRITICAL).length,
    high: plotPoints.filter((p) => p.riskLevel === RiskLevel.HIGH).length,
    medium: plotPoints.filter((p) => p.riskLevel === RiskLevel.MEDIUM).length,
    low: plotPoints.filter((p) => p.riskLevel === RiskLevel.LOW).length,
  };
}

// ============================================================================
// SEGREGATION OF DUTIES VALIDATION
// ============================================================================

/**
 * Creates segregation of duties matrix
 */
export function createSODMatrix(params: {
  matrixName: string;
  department: string;
  processArea: string;
  reviewedBy: string;
}): SegregationOfDutiesMatrix {
  return {
    id: crypto.randomUUID(),
    matrixName: params.matrixName,
    department: params.department,
    processArea: params.processArea,
    incompatibleFunctions: [],
    violations: [],
    lastReviewDate: new Date(),
    reviewedBy: params.reviewedBy,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'compliant',
    metadata: {},
  };
}

/**
 * Adds incompatible function pair
 */
export function addIncompatibleFunction(
  matrix: SegregationOfDutiesMatrix,
  incompatibleFunction: IncompatibleFunction,
): SegregationOfDutiesMatrix {
  return {
    ...matrix,
    incompatibleFunctions: [...matrix.incompatibleFunctions, incompatibleFunction],
  };
}

/**
 * Records SOD violation
 */
export function recordSODViolation(
  matrix: SegregationOfDutiesMatrix,
  violation: SODViolation,
): SegregationOfDutiesMatrix {
  return {
    ...matrix,
    violations: [...matrix.violations, violation],
    status: 'violations_identified',
  };
}

/**
 * Validates user access against SOD matrix
 */
export function validateUserSOD(
  matrix: SegregationOfDutiesMatrix,
  userId: string,
  userName: string,
  userRoles: string[],
): SODViolation | null {
  for (const incompatible of matrix.incompatibleFunctions) {
    const conflictingRoles = userRoles.filter((role) => incompatible.functionPair.includes(role));

    if (conflictingRoles.length > 1) {
      return {
        violationId: crypto.randomUUID(),
        userId,
        userName,
        conflictingRoles,
        identifiedDate: new Date(),
        riskLevel: incompatible.riskLevel,
        status: 'open',
      };
    }
  }

  return null;
}

// ============================================================================
// AUTHORIZATION MATRIX MANAGEMENT
// ============================================================================

/**
 * Creates authorization matrix
 */
export function createAuthorizationMatrix(params: {
  matrixName: string;
  processArea: string;
  department: string;
  approvedBy: string;
}): AuthorizationMatrix {
  return {
    id: crypto.randomUUID(),
    matrixName: params.matrixName,
    processArea: params.processArea,
    department: params.department,
    authorizationLevels: [],
    effectiveDate: new Date(),
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    lastReviewDate: new Date(),
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    version: 1,
    status: 'active',
    metadata: {},
  };
}

/**
 * Adds authorization level
 */
export function addAuthorizationLevel(
  matrix: AuthorizationMatrix,
  level: AuthorizationLevel,
): AuthorizationMatrix {
  return {
    ...matrix,
    authorizationLevels: [...matrix.authorizationLevels, level],
  };
}

/**
 * Validates authorization for transaction
 */
export function validateAuthorization(
  matrix: AuthorizationMatrix,
  userRole: string,
  transactionAmount?: number,
): { authorized: boolean; level?: AuthorizationLevel; reason?: string } {
  for (const level of matrix.authorizationLevels) {
    if (!level.authorizedRoles.includes(userRole)) {
      continue;
    }

    if (transactionAmount !== undefined && level.dollarThreshold !== undefined) {
      if (transactionAmount <= level.dollarThreshold) {
        return { authorized: true, level };
      }
    } else {
      return { authorized: true, level };
    }
  }

  return {
    authorized: false,
    reason: 'User role not authorized or amount exceeds threshold',
  };
}

// ============================================================================
// FRAUD RISK ASSESSMENT
// ============================================================================

/**
 * Creates fraud risk assessment
 */
export function createFraudRiskAssessment(params: {
  assessmentPeriod: string;
  performedBy: string;
  scope: FraudRiskScope[];
  nextAssessmentDate: Date;
}): FraudRiskAssessment {
  return {
    id: crypto.randomUUID(),
    assessmentDate: new Date(),
    assessmentPeriod: params.assessmentPeriod,
    performedBy: params.performedBy,
    scope: params.scope,
    fraudSchemes: [],
    overallFraudRisk: RiskLevel.MEDIUM,
    fraudTriangle: {
      pressureFactors: [],
      opportunityFactors: [],
      rationalizationFactors: [],
      overallFraudRisk: RiskLevel.MEDIUM,
    },
    antifraudControls: [],
    controlGaps: [],
    recommendations: [],
    nextAssessmentDate: params.nextAssessmentDate,
    metadata: {},
  };
}

/**
 * Adds fraud scheme to assessment
 */
export function addFraudScheme(
  assessment: FraudRiskAssessment,
  scheme: FraudScheme,
): FraudRiskAssessment {
  return {
    ...assessment,
    fraudSchemes: [...assessment.fraudSchemes, scheme],
  };
}

/**
 * Analyzes fraud triangle
 */
export function analyzeFraudTriangle(
  pressureFactors: string[],
  opportunityFactors: string[],
  rationalizationFactors: string[],
): FraudTriangleAnalysis {
  const totalFactors =
    pressureFactors.length + opportunityFactors.length + rationalizationFactors.length;

  let overallFraudRisk: RiskLevel;
  if (totalFactors >= 9) {
    overallFraudRisk = RiskLevel.CRITICAL;
  } else if (totalFactors >= 6) {
    overallFraudRisk = RiskLevel.HIGH;
  } else if (totalFactors >= 3) {
    overallFraudRisk = RiskLevel.MEDIUM;
  } else {
    overallFraudRisk = RiskLevel.LOW;
  }

  return {
    pressureFactors,
    opportunityFactors,
    rationalizationFactors,
    overallFraudRisk,
  };
}

// ============================================================================
// WHISTLEBLOWER CASE MANAGEMENT
// ============================================================================

/**
 * Creates whistleblower case
 */
export function createWhistleblowerCase(params: {
  reportingChannel: ReportingChannel;
  anonymousReport: boolean;
  allegationType: AllegationType;
  allegationSummary: string;
  departments: string[];
  reporterContact?: string;
}): WhistleblowerCase {
  return {
    id: crypto.randomUUID(),
    caseNumber: generateWhistleblowerCaseNumber(),
    receivedDate: new Date(),
    reportingChannel: params.reportingChannel,
    anonymousReport: params.anonymousReport,
    reporterContact: params.reporterContact,
    allegationType: params.allegationType,
    allegationSummary: params.allegationSummary,
    departments: params.departments,
    individualsInvolved: [],
    priority: determineCasePriority(params.allegationType),
    status: WhistleblowerStatus.RECEIVED,
    substantiated: false,
    correctiveActions: [],
    confidentialityMaintained: true,
    retaliationConcerns: false,
    metadata: {},
  };
}

/**
 * Generates unique case number
 */
export function generateWhistleblowerCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `WB-${year}-${random}`;
}

/**
 * Determines case priority from allegation type
 */
export function determineCasePriority(
  allegationType: AllegationType,
): 'critical' | 'high' | 'medium' | 'low' {
  const criticalTypes = [AllegationType.FRAUD, AllegationType.SAFETY_VIOLATION];
  const highTypes = [
    AllegationType.ABUSE,
    AllegationType.ETHICS_VIOLATION,
    AllegationType.REGULATORY_VIOLATION,
  ];

  if (criticalTypes.includes(allegationType)) return 'critical';
  if (highTypes.includes(allegationType)) return 'high';
  return 'medium';
}

/**
 * Assigns investigator to case
 */
export function assignInvestigator(
  caseRecord: WhistleblowerCase,
  investigatorId: string,
): WhistleblowerCase {
  return {
    ...caseRecord,
    assignedInvestigator: investigatorId,
    investigationStartDate: new Date(),
    status: WhistleblowerStatus.INVESTIGATION_ASSIGNED,
  };
}

/**
 * Closes whistleblower case
 */
export function closeWhistleblowerCase(
  caseRecord: WhistleblowerCase,
  substantiated: boolean,
  findings: string,
): WhistleblowerCase {
  const status = substantiated
    ? WhistleblowerStatus.CLOSED_SUBSTANTIATED
    : WhistleblowerStatus.CLOSED_UNSUBSTANTIATED;

  return {
    ...caseRecord,
    status,
    substantiated,
    findings,
    investigationEndDate: new Date(),
    closedDate: new Date(),
  };
}

// ============================================================================
// INTERNAL AUDIT PLANNING
// ============================================================================

/**
 * Creates internal audit plan
 */
export function createInternalAuditPlan(params: {
  planName: string;
  fiscalYear: number;
  approvedBy: string;
  riskBasedApproach?: boolean;
}): InternalAuditPlan {
  return {
    id: crypto.randomUUID(),
    planName: params.planName,
    fiscalYear: params.fiscalYear,
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    riskBasedApproach: params.riskBasedApproach ?? true,
    auditUniverse: [],
    plannedAudits: [],
    totalAuditHours: 0,
    status: 'draft',
    metadata: {},
  };
}

/**
 * Adds auditable entity to audit universe
 */
export function addAuditableEntity(
  plan: InternalAuditPlan,
  entity: AuditableEntity,
): InternalAuditPlan {
  return {
    ...plan,
    auditUniverse: [...plan.auditUniverse, entity],
  };
}

/**
 * Schedules audit based on risk
 */
export function scheduleAudit(plan: InternalAuditPlan, audit: PlannedAudit): InternalAuditPlan {
  return {
    ...plan,
    plannedAudits: [...plan.plannedAudits, audit],
    totalAuditHours: plan.totalAuditHours + audit.estimatedHours,
  };
}

/**
 * Prioritizes audit universe by risk
 */
export function prioritizeAuditUniverse(entities: AuditableEntity[]): AuditableEntity[] {
  const riskOrder = [
    RiskLevel.CRITICAL,
    RiskLevel.HIGH,
    RiskLevel.MEDIUM,
    RiskLevel.LOW,
    RiskLevel.NEGLIGIBLE,
  ];

  return [...entities].sort((a, b) => {
    const aIndex = riskOrder.indexOf(a.inherentRisk);
    const bIndex = riskOrder.indexOf(b.inherentRisk);
    return aIndex - bIndex;
  });
}

// ============================================================================
// AUDIT FINDING REMEDIATION
// ============================================================================

/**
 * Creates audit finding
 */
export function createAuditFinding(params: {
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
}): AuditFinding {
  return {
    id: crypto.randomUUID(),
    findingNumber: params.findingNumber,
    auditId: params.auditId,
    findingTitle: params.findingTitle,
    condition: params.condition,
    criteria: params.criteria,
    cause: params.cause,
    effect: params.effect,
    recommendation: params.recommendation,
    severity: params.severity,
    riskRating: params.riskRating,
    status: FindingStatus.DRAFT,
    metadata: {},
  };
}

/**
 * Records management response
 */
export function recordManagementResponse(
  finding: AuditFinding,
  managementResponse: string,
  agreedUponAction: string,
  responsibleParty: string,
  targetCompletionDate: Date,
): AuditFinding {
  return {
    ...finding,
    managementResponse,
    agreedUponAction,
    responsibleParty,
    targetCompletionDate,
    status: FindingStatus.ACTION_PLAN_APPROVED,
  };
}

/**
 * Updates finding remediation status
 */
export function updateFindingStatus(
  finding: AuditFinding,
  status: FindingStatus,
): AuditFinding {
  return {
    ...finding,
    status,
  };
}

/**
 * Verifies finding remediation
 */
export function verifyFindingRemediation(
  finding: AuditFinding,
  verificationEvidence: string,
): AuditFinding {
  return {
    ...finding,
    verificationEvidence,
    actualCompletionDate: new Date(),
    status: FindingStatus.CLOSED,
  };
}

/**
 * Gets overdue audit findings
 */
export function getOverdueFindings(
  findings: AuditFinding[],
  currentDate: Date = new Date(),
): AuditFinding[] {
  return findings.filter(
    (f) =>
      f.targetCompletionDate &&
      f.targetCompletionDate < currentDate &&
      f.status !== FindingStatus.CLOSED,
  );
}

// ============================================================================
// BUSINESS CONTINUITY AND DISASTER RECOVERY
// ============================================================================

/**
 * Creates business continuity plan
 */
export function createBusinessContinuityPlan(params: {
  planName: string;
  department: string;
  planOwner: string;
  approvedBy: string;
}): BusinessContinuityPlan {
  return {
    id: crypto.randomUUID(),
    planName: params.planName,
    department: params.department,
    planOwner: params.planOwner,
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    effectiveDate: new Date(),
    lastReviewDate: new Date(),
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    criticalProcesses: [],
    recoveryStrategies: [],
    resourceRequirements: [],
    communicationPlan: {
      stakeholders: [],
      communicationMethods: [],
      escalationProcedure: [],
      emergencyContacts: [],
    },
    testingSchedule: {
      frequency: 'annual',
      testTypes: ['tabletop'],
      nextScheduledTest: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      participantsRequired: [],
    },
    status: 'active',
    metadata: {},
  };
}

/**
 * Creates disaster recovery plan
 */
export function createDisasterRecoveryPlan(params: {
  planName: string;
  systemName: string;
  systemOwner: string;
  approvedBy: string;
  rto: number;
  rpo: number;
}): DisasterRecoveryPlan {
  return {
    id: crypto.randomUUID(),
    planName: params.planName,
    systemName: params.systemName,
    systemOwner: params.systemOwner,
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    effectiveDate: new Date(),
    rto: params.rto,
    rpo: params.rpo,
    recoveryPhases: [],
    backupStrategy: {
      backupType: 'full',
      backupFrequency: ControlFrequency.DAILY,
      backupLocation: [],
      retentionPeriod: 30,
      encryptionUsed: true,
      verificationFrequency: ControlFrequency.WEEKLY,
    },
    alternativeSites: [],
    testingResults: [],
    lastReviewDate: new Date(),
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'active',
    metadata: {},
  };
}

// ============================================================================
// INCIDENT RESPONSE MANAGEMENT
// ============================================================================

/**
 * Creates incident response record
 */
export function createIncidentResponse(params: {
  incidentType: IncidentType;
  severity: IncidentSeverity;
  incidentDescription: string;
  reportedBy: string;
  affectedSystems: string[];
  affectedDepartments: string[];
}): IncidentResponseRecord {
  return {
    id: crypto.randomUUID(),
    incidentNumber: generateIncidentNumber(),
    incidentDate: new Date(),
    detectedDate: new Date(),
    reportedDate: new Date(),
    reportedBy: params.reportedBy,
    incidentType: params.incidentType,
    severity: params.severity,
    affectedSystems: params.affectedSystems,
    affectedDepartments: params.affectedDepartments,
    incidentDescription: params.incidentDescription,
    initialAssessment: '',
    responseTeam: [],
    responsePhases: [],
    containmentActions: [],
    eradicationActions: [],
    recoveryActions: [],
    regulatoryNotificationRequired: params.severity === IncidentSeverity.CRITICAL,
    notificationsSent: [],
    status: IncidentStatus.REPORTED,
    metadata: {},
  };
}

/**
 * Generates unique incident number
 */
export function generateIncidentNumber(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `INC-${year}${month}-${random}`;
}

/**
 * Updates incident status
 */
export function updateIncidentStatus(
  incident: IncidentResponseRecord,
  status: IncidentStatus,
): IncidentResponseRecord {
  return {
    ...incident,
    status,
  };
}

/**
 * Closes incident
 */
export function closeIncident(
  incident: IncidentResponseRecord,
  lessonsLearned: string[],
  preventativeMeasures: string[],
): IncidentResponseRecord {
  return {
    ...incident,
    lessonsLearned,
    preventativeMeasures,
    status: IncidentStatus.CLOSED,
    resolvedDate: new Date(),
    closedDate: new Date(),
  };
}

// ============================================================================
// RISK DASHBOARD METRICS
// ============================================================================

/**
 * Generates risk dashboard metrics
 */
export function generateRiskDashboardMetrics(params: {
  period: string;
  risks: IdentifiedRisk[];
  controls: InternalControl[];
  deficiencies: ControlDeficiency[];
  findings: AuditFinding[];
  testingRecords: ControlTestingRecord[];
  registerEntries: RiskRegisterEntry[];
}): RiskDashboardMetrics {
  const risksByLevel = categorizeRisksByLevel(params.risks);
  const risksByCategory = categorizeRisksByCategory(params.risks);

  const effectiveControls = params.controls.filter(
    (c) => c.operatingEffectiveness === EffectivenessRating.EFFECTIVE,
  ).length;

  const controlEffectivenessRate =
    params.controls.length > 0 ? (effectiveControls / params.controls.length) * 100 : 0;

  const openDeficiencies = params.deficiencies.filter(
    (d) => d.status !== DeficiencyStatus.CLOSED,
  ).length;

  const materialWeaknesses = params.deficiencies.filter(
    (d) =>
      d.severity === DeficiencySeverity.MATERIAL_WEAKNESS &&
      d.status !== DeficiencyStatus.CLOSED,
  ).length;

  const significantDeficiencies = params.deficiencies.filter(
    (d) =>
      d.severity === DeficiencySeverity.SIGNIFICANT_DEFICIENCY &&
      d.status !== DeficiencyStatus.CLOSED,
  ).length;

  const openAuditFindings = params.findings.filter(
    (f) => f.status !== FindingStatus.CLOSED,
  ).length;

  const overdueFindings = getOverdueFindings(params.findings).length;

  const topRisks = [...params.registerEntries]
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 10);

  return {
    generatedDate: new Date(),
    period: params.period,
    totalRisks: params.risks.length,
    risksByLevel,
    risksByCategory,
    riskTrend: 'stable',
    totalControls: params.controls.length,
    effectiveControls,
    controlEffectivenessRate,
    openDeficiencies,
    materialWeaknesses,
    significantDeficiencies,
    openAuditFindings,
    overdueFindings,
    controlTestingCompletionRate: 0,
    riskAppetiteCompliance: 0,
    topRisks,
    recentIncidents: 0,
    openWhistleblowerCases: 0,
    thirdPartyRiskExposure: 0,
  };
}

/**
 * Categorizes risks by level
 */
export function categorizeRisksByLevel(risks: IdentifiedRisk[]): Record<RiskLevel, number> {
  return {
    [RiskLevel.CRITICAL]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.CRITICAL).length,
    [RiskLevel.HIGH]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.HIGH).length,
    [RiskLevel.MEDIUM]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.MEDIUM).length,
    [RiskLevel.LOW]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.LOW).length,
    [RiskLevel.NEGLIGIBLE]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.NEGLIGIBLE).length,
  };
}

/**
 * Categorizes risks by category
 */
export function categorizeRisksByCategory(risks: IdentifiedRisk[]): Record<RiskCategory, number> {
  const result: Record<RiskCategory, number> = {} as Record<RiskCategory, number>;

  Object.values(RiskCategory).forEach((category) => {
    result[category] = risks.filter((r) => r.riskCategory === category).length;
  });

  return result;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model for EnterpriseRiskAssessment
 */
export const EnterpriseRiskAssessmentModel = {
  tableName: 'enterprise_risk_assessments',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    assessmentName: { type: 'STRING', allowNull: false },
    assessmentPeriod: { type: 'STRING', allowNull: false },
    fiscalYear: { type: 'INTEGER', allowNull: false },
    agencyId: { type: 'UUID', allowNull: false },
    performedBy: { type: 'STRING', allowNull: false },
    assessmentDate: { type: 'DATE', allowNull: false },
    approvedBy: { type: 'STRING', allowNull: true },
    approvalDate: { type: 'DATE', allowNull: true },
    riskFramework: { type: 'ENUM', values: Object.values(RiskFramework) },
    scope: { type: 'JSON', defaultValue: [] },
    objectives: { type: 'JSON', defaultValue: [] },
    risks: { type: 'JSON', defaultValue: [] },
    overallRiskLevel: { type: 'ENUM', values: Object.values(RiskLevel) },
    overallRiskScore: { type: 'INTEGER', defaultValue: 0 },
    executiveSummary: { type: 'TEXT', allowNull: true },
    nextReviewDate: { type: 'DATE', allowNull: false },
    status: { type: 'ENUM', values: Object.values(AssessmentStatus) },
    metadata: { type: 'JSON', defaultValue: {} },
    createdAt: { type: 'DATE', allowNull: false },
    updatedAt: { type: 'DATE', allowNull: false },
  },
  indexes: [
    { fields: ['agencyId'] },
    { fields: ['fiscalYear'] },
    { fields: ['status'] },
    { fields: ['assessmentDate'] },
  ],
};

/**
 * Sequelize model for IdentifiedRisk
 */
export const IdentifiedRiskModel = {
  tableName: 'identified_risks',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    riskCode: { type: 'STRING', allowNull: false, unique: true },
    riskTitle: { type: 'STRING', allowNull: false },
    riskDescription: { type: 'TEXT', allowNull: false },
    riskCategory: { type: 'ENUM', values: Object.values(RiskCategory) },
    riskType: { type: 'ENUM', values: Object.values(RiskType) },
    identifiedDate: { type: 'DATE', allowNull: false },
    identifiedBy: { type: 'STRING', allowNull: false },
    ownerDepartment: { type: 'STRING', allowNull: false },
    riskOwner: { type: 'STRING', allowNull: false },
    likelihood: { type: 'ENUM', values: Object.values(LikelihoodLevel) },
    impact: { type: 'ENUM', values: Object.values(ImpactLevel) },
    inherentRiskScore: { type: 'INTEGER', allowNull: false },
    currentControls: { type: 'JSON', defaultValue: [] },
    residualLikelihood: { type: 'ENUM', values: Object.values(LikelihoodLevel) },
    residualImpact: { type: 'ENUM', values: Object.values(ImpactLevel) },
    residualRiskScore: { type: 'INTEGER', allowNull: false },
    riskAppetite: { type: 'ENUM', values: Object.values(RiskAppetite) },
    riskResponse: { type: 'ENUM', values: Object.values(RiskResponse) },
    status: { type: 'ENUM', values: Object.values(RiskStatus) },
    lastReviewDate: { type: 'DATE', allowNull: true },
    nextReviewDate: { type: 'DATE', allowNull: false },
    escalated: { type: 'BOOLEAN', defaultValue: false },
    tags: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['riskCode'] },
    { fields: ['riskCategory'] },
    { fields: ['riskOwner'] },
    { fields: ['status'] },
    { fields: ['residualRiskScore'] },
  ],
};

/**
 * Sequelize model for InternalControl
 */
export const InternalControlModel = {
  tableName: 'internal_controls',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    controlCode: { type: 'STRING', allowNull: false, unique: true },
    controlName: { type: 'STRING', allowNull: false },
    controlDescription: { type: 'TEXT', allowNull: false },
    controlObjective: { type: 'TEXT', allowNull: false },
    controlType: { type: 'ENUM', values: Object.values(ControlType) },
    controlCategory: { type: 'ENUM', values: Object.values(ControlCategory) },
    controlFrequency: { type: 'ENUM', values: Object.values(ControlFrequency) },
    ownerDepartment: { type: 'STRING', allowNull: false },
    controlOwner: { type: 'STRING', allowNull: false },
    designEffectiveness: { type: 'ENUM', values: Object.values(EffectivenessRating) },
    operatingEffectiveness: { type: 'ENUM', values: Object.values(EffectivenessRating) },
    automationLevel: { type: 'ENUM', values: Object.values(AutomationLevel) },
    relatedRisks: { type: 'JSON', defaultValue: [] },
    testingProcedures: { type: 'JSON', defaultValue: [] },
    lastTestDate: { type: 'DATE', allowNull: true },
    nextTestDate: { type: 'DATE', allowNull: false },
    deficiencies: { type: 'JSON', defaultValue: [] },
    compensatingControls: { type: 'JSON', defaultValue: [] },
    status: { type: 'ENUM', values: Object.values(ControlStatus) },
    implementationDate: { type: 'DATE', allowNull: false },
    cosoComponent: { type: 'ENUM', values: Object.values(COSOComponent), allowNull: true },
    cosoObjective: { type: 'ENUM', values: Object.values(COSOObjective), allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['controlCode'] },
    { fields: ['controlType'] },
    { fields: ['controlOwner'] },
    { fields: ['status'] },
    { fields: ['cosoComponent'] },
  ],
};

/**
 * Sequelize model for ControlDeficiency
 */
export const ControlDeficiencyModel = {
  tableName: 'control_deficiencies',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    controlId: { type: 'UUID', allowNull: false },
    deficiencyType: { type: 'ENUM', values: Object.values(DeficiencyType) },
    severity: { type: 'ENUM', values: Object.values(DeficiencySeverity) },
    description: { type: 'TEXT', allowNull: false },
    rootCause: { type: 'TEXT', allowNull: true },
    identifiedDate: { type: 'DATE', allowNull: false },
    identifiedBy: { type: 'STRING', allowNull: false },
    impact: { type: 'TEXT', allowNull: false },
    remediation: { type: 'JSON', allowNull: false },
    status: { type: 'ENUM', values: Object.values(DeficiencyStatus) },
    relatedFindings: { type: 'JSON', defaultValue: [] },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['controlId'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['identifiedDate'] },
  ],
};

/**
 * Sequelize model for WhistleblowerCase
 */
export const WhistleblowerCaseModel = {
  tableName: 'whistleblower_cases',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    caseNumber: { type: 'STRING', allowNull: false, unique: true },
    receivedDate: { type: 'DATE', allowNull: false },
    reportingChannel: { type: 'ENUM', values: Object.values(ReportingChannel) },
    anonymousReport: { type: 'BOOLEAN', defaultValue: false },
    reporterContact: { type: 'STRING', allowNull: true },
    allegationType: { type: 'ENUM', values: Object.values(AllegationType) },
    allegationSummary: { type: 'TEXT', allowNull: false },
    departments: { type: 'JSON', defaultValue: [] },
    individualsInvolved: { type: 'JSON', defaultValue: [] },
    assignedInvestigator: { type: 'STRING', allowNull: true },
    priority: { type: 'STRING', allowNull: false },
    status: { type: 'ENUM', values: Object.values(WhistleblowerStatus) },
    investigationStartDate: { type: 'DATE', allowNull: true },
    investigationEndDate: { type: 'DATE', allowNull: true },
    findings: { type: 'TEXT', allowNull: true },
    substantiated: { type: 'BOOLEAN', defaultValue: false },
    correctiveActions: { type: 'JSON', defaultValue: [] },
    confidentialityMaintained: { type: 'BOOLEAN', defaultValue: true },
    retaliationConcerns: { type: 'BOOLEAN', defaultValue: false },
    closedDate: { type: 'DATE', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['caseNumber'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['receivedDate'] },
  ],
};

/**
 * Sequelize model for IncidentResponseRecord
 */
export const IncidentResponseRecordModel = {
  tableName: 'incident_response_records',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    incidentNumber: { type: 'STRING', allowNull: false, unique: true },
    incidentDate: { type: 'DATE', allowNull: false },
    detectedDate: { type: 'DATE', allowNull: false },
    reportedDate: { type: 'DATE', allowNull: false },
    reportedBy: { type: 'STRING', allowNull: false },
    incidentType: { type: 'ENUM', values: Object.values(IncidentType) },
    severity: { type: 'ENUM', values: Object.values(IncidentSeverity) },
    affectedSystems: { type: 'JSON', defaultValue: [] },
    affectedDepartments: { type: 'JSON', defaultValue: [] },
    incidentDescription: { type: 'TEXT', allowNull: false },
    initialAssessment: { type: 'TEXT', allowNull: true },
    responseTeam: { type: 'JSON', defaultValue: [] },
    responsePhases: { type: 'JSON', defaultValue: [] },
    containmentActions: { type: 'JSON', defaultValue: [] },
    eradicationActions: { type: 'JSON', defaultValue: [] },
    recoveryActions: { type: 'JSON', defaultValue: [] },
    lessonsLearned: { type: 'JSON', defaultValue: [] },
    rootCause: { type: 'TEXT', allowNull: true },
    preventativeMeasures: { type: 'JSON', defaultValue: [] },
    estimatedCost: { type: 'DECIMAL(15,2)', allowNull: true },
    regulatoryNotificationRequired: { type: 'BOOLEAN', defaultValue: false },
    notificationsSent: { type: 'JSON', defaultValue: [] },
    status: { type: 'ENUM', values: Object.values(IncidentStatus) },
    resolvedDate: { type: 'DATE', allowNull: true },
    closedDate: { type: 'DATE', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['incidentNumber'] },
    { fields: ['incidentType'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['incidentDate'] },
  ],
};

// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================

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
export const RiskManagementServiceExample = `
@Injectable()
export class RiskManagementService {
  constructor(
    @InjectModel(IdentifiedRiskModel)
    private riskRepo: Repository<IdentifiedRisk>,
    @InjectModel(InternalControlModel)
    private controlRepo: Repository<InternalControl>,
    @InjectModel(ControlDeficiencyModel)
    private deficiencyRepo: Repository<ControlDeficiency>,
  ) {}

  async createEnterpriseAssessment(dto: CreateAssessmentDto): Promise<EnterpriseRiskAssessment> {
    const assessment = createEnterpriseRiskAssessment(dto);
    return this.assessmentRepo.save(assessment);
  }

  async identifyRisk(dto: CreateRiskDto): Promise<IdentifiedRisk> {
    const risk = identifyRisk(dto);
    const saved = await this.riskRepo.save(risk);

    // Create risk register entry
    const registerEntry = createRiskRegisterEntry(saved);
    await this.registerRepo.save(registerEntry);

    return saved;
  }

  async generateHeatMap(period: string): Promise<RiskHeatMap> {
    const risks = await this.riskRepo.find({ where: { status: RiskStatus.ACTIVE } });
    return generateRiskHeatMap({ periodCovered: period, generatedBy: 'System', risks });
  }

  async getDashboardMetrics(period: string): Promise<RiskDashboardMetrics> {
    const risks = await this.riskRepo.find();
    const controls = await this.controlRepo.find();
    const deficiencies = await this.deficiencyRepo.find();

    return generateRiskDashboardMetrics({
      period,
      risks,
      controls,
      deficiencies,
      findings: [],
      testingRecords: [],
      registerEntries: [],
    });
  }
}
`;

// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================

/**
 * Swagger DTO for creating risk
 */
export const CreateRiskDto = {
  schema: {
    type: 'object',
    required: [
      'riskCode',
      'riskTitle',
      'riskDescription',
      'riskCategory',
      'ownerDepartment',
      'riskOwner',
      'likelihood',
      'impact',
    ],
    properties: {
      riskCode: { type: 'string', example: 'RISK-OPS-001' },
      riskTitle: { type: 'string', example: 'System Downtime Risk' },
      riskDescription: { type: 'string', example: 'Risk of unplanned system outage' },
      riskCategory: { type: 'string', enum: Object.values(RiskCategory) },
      ownerDepartment: { type: 'string', example: 'IT Operations' },
      riskOwner: { type: 'string', example: 'CIO' },
      likelihood: { type: 'string', enum: Object.values(LikelihoodLevel) },
      impact: { type: 'string', enum: Object.values(ImpactLevel) },
      identifiedBy: { type: 'string', example: 'Risk Manager' },
    },
  },
};

/**
 * Swagger DTO for creating internal control
 */
export const CreateInternalControlDto = {
  schema: {
    type: 'object',
    required: [
      'controlCode',
      'controlName',
      'controlDescription',
      'controlObjective',
      'controlType',
      'controlCategory',
      'controlFrequency',
      'ownerDepartment',
      'controlOwner',
    ],
    properties: {
      controlCode: { type: 'string', example: 'CTRL-FIN-001' },
      controlName: { type: 'string', example: 'Budget Approval Authorization' },
      controlDescription: { type: 'string', example: 'All budgets must be approved' },
      controlObjective: { type: 'string', example: 'Ensure proper authorization' },
      controlType: { type: 'string', enum: Object.values(ControlType) },
      controlCategory: { type: 'string', enum: Object.values(ControlCategory) },
      controlFrequency: { type: 'string', enum: Object.values(ControlFrequency) },
      ownerDepartment: { type: 'string', example: 'Finance' },
      controlOwner: { type: 'string', example: 'CFO' },
      cosoComponent: { type: 'string', enum: Object.values(COSOComponent), nullable: true },
      cosoObjective: { type: 'string', enum: Object.values(COSOObjective), nullable: true },
    },
  },
};

/**
 * Swagger response schema for risk heat map
 */
export const RiskHeatMapResponse = {
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      generatedDate: { type: 'string', format: 'date-time' },
      generatedBy: { type: 'string', example: 'Risk Manager' },
      periodCovered: { type: 'string', example: 'Q1 2024' },
      totalRisks: { type: 'number', example: 45 },
      criticalRisks: { type: 'number', example: 3 },
      highRisks: { type: 'number', example: 12 },
      mediumRisks: { type: 'number', example: 20 },
      lowRisks: { type: 'number', example: 10 },
      riskPlotPoints: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            riskId: { type: 'string', format: 'uuid' },
            riskTitle: { type: 'string' },
            likelihoodScore: { type: 'number', minimum: 1, maximum: 5 },
            impactScore: { type: 'number', minimum: 1, maximum: 5 },
            riskScore: { type: 'number' },
            riskLevel: { type: 'string', enum: Object.values(RiskLevel) },
          },
        },
      },
    },
  },
};

/**
 * Swagger response schema for risk dashboard
 */
export const RiskDashboardMetricsResponse = {
  schema: {
    type: 'object',
    properties: {
      generatedDate: { type: 'string', format: 'date-time' },
      period: { type: 'string', example: 'Q1 2024' },
      totalRisks: { type: 'number', example: 45 },
      risksByLevel: {
        type: 'object',
        properties: {
          CRITICAL: { type: 'number', example: 3 },
          HIGH: { type: 'number', example: 12 },
          MEDIUM: { type: 'number', example: 20 },
          LOW: { type: 'number', example: 10 },
        },
      },
      totalControls: { type: 'number', example: 120 },
      effectiveControls: { type: 'number', example: 105 },
      controlEffectivenessRate: { type: 'number', example: 87.5 },
      openDeficiencies: { type: 'number', example: 8 },
      materialWeaknesses: { type: 'number', example: 1 },
      significantDeficiencies: { type: 'number', example: 3 },
      openAuditFindings: { type: 'number', example: 12 },
      overdueFindings: { type: 'number', example: 2 },
    },
  },
};
