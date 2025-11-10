/**
 * LOC: COMPLIANCE_REGULATORY_TRACKING_KIT_001
 * File: /reuse/government/compliance-regulatory-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government compliance services
 *   - Regulatory reporting modules
 *   - Policy management systems
 *   - Compliance dashboard components
 *   - Audit preparation services
 *   - Training tracking systems
 */
/**
 * Regulatory requirement structure
 */
export interface RegulatoryRequirement {
    id: string;
    requirementCode: string;
    title: string;
    description: string;
    regulatoryBody: string;
    regulationType: RegulationType;
    category: ComplianceCategory;
    effectiveDate: Date;
    expirationDate?: Date;
    mandatoryCompliance: boolean;
    applicableAgencies: string[];
    relatedRequirements: string[];
    documentationRequired: string[];
    status: RequirementStatus;
    priority: CompliancePriority;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Regulation types
 */
export declare enum RegulationType {
    FEDERAL_LAW = "FEDERAL_LAW",
    STATE_LAW = "STATE_LAW",
    LOCAL_ORDINANCE = "LOCAL_ORDINANCE",
    AGENCY_REGULATION = "AGENCY_REGULATION",
    EXECUTIVE_ORDER = "EXECUTIVE_ORDER",
    POLICY_DIRECTIVE = "POLICY_DIRECTIVE",
    STANDARD_OPERATING_PROCEDURE = "STANDARD_OPERATING_PROCEDURE",
    INDUSTRY_STANDARD = "INDUSTRY_STANDARD",
    INTERNATIONAL_TREATY = "INTERNATIONAL_TREATY"
}
/**
 * Compliance categories
 */
export declare enum ComplianceCategory {
    DATA_PRIVACY = "DATA_PRIVACY",
    CYBERSECURITY = "CYBERSECURITY",
    FINANCIAL_MANAGEMENT = "FINANCIAL_MANAGEMENT",
    PROCUREMENT = "PROCUREMENT",
    ENVIRONMENTAL = "ENVIRONMENTAL",
    HEALTH_SAFETY = "HEALTH_SAFETY",
    HUMAN_RESOURCES = "HUMAN_RESOURCES",
    RECORDS_MANAGEMENT = "RECORDS_MANAGEMENT",
    ETHICS_CONDUCT = "ETHICS_CONDUCT",
    ACCESSIBILITY = "ACCESSIBILITY",
    CIVIL_RIGHTS = "CIVIL_RIGHTS",
    TRANSPARENCY = "TRANSPARENCY"
}
/**
 * Requirement status
 */
export declare enum RequirementStatus {
    ACTIVE = "ACTIVE",
    DRAFT = "DRAFT",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    SUPERSEDED = "SUPERSEDED",
    REPEALED = "REPEALED",
    SUSPENDED = "SUSPENDED"
}
/**
 * Compliance priority levels
 */
export declare enum CompliancePriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}
/**
 * Compliance certification structure
 */
export interface ComplianceCertification {
    id: string;
    certificationName: string;
    certificationBody: string;
    requirementId: string;
    agencyId: string;
    departmentId?: string;
    certificationLevel: string;
    issueDate: Date;
    expirationDate: Date;
    renewalRequired: boolean;
    renewalPeriodDays: number;
    status: CertificationStatus;
    certificationNumber: string;
    documentPath?: string;
    attestedBy: string;
    attestationDate: Date;
    nextReviewDate?: Date;
    conditions?: string[];
    metadata?: Record<string, any>;
}
/**
 * Certification status
 */
export declare enum CertificationStatus {
    VALID = "VALID",
    EXPIRED = "EXPIRED",
    PENDING_RENEWAL = "PENDING_RENEWAL",
    SUSPENDED = "SUSPENDED",
    REVOKED = "REVOKED",
    UNDER_REVIEW = "UNDER_REVIEW"
}
/**
 * Compliance deadline structure
 */
export interface ComplianceDeadline {
    id: string;
    requirementId: string;
    title: string;
    description: string;
    dueDate: Date;
    reminderDates: Date[];
    assignedTo: string[];
    departmentId: string;
    priority: CompliancePriority;
    status: DeadlineStatus;
    completionDate?: Date;
    completedBy?: string;
    extensions?: DeadlineExtension[];
    dependencies?: string[];
    deliverables: string[];
    notificationsSent: number;
    metadata?: Record<string, any>;
}
/**
 * Deadline status
 */
export declare enum DeadlineStatus {
    UPCOMING = "UPCOMING",
    DUE_SOON = "DUE_SOON",
    OVERDUE = "OVERDUE",
    COMPLETED = "COMPLETED",
    EXTENDED = "EXTENDED",
    WAIVED = "WAIVED",
    CANCELLED = "CANCELLED"
}
/**
 * Deadline extension structure
 */
export interface DeadlineExtension {
    requestedDate: Date;
    requestedBy: string;
    approvedDate?: Date;
    approvedBy?: string;
    newDueDate: Date;
    reason: string;
    status: 'pending' | 'approved' | 'denied';
}
/**
 * Regulatory report submission
 */
export interface RegulatoryReportSubmission {
    id: string;
    reportType: string;
    requirementId: string;
    reportingPeriodStart: Date;
    reportingPeriodEnd: Date;
    submissionDeadline: Date;
    submittedDate?: Date;
    submittedBy?: string;
    recipientAgency: string;
    reportData: any;
    attachments: string[];
    status: SubmissionStatus;
    confirmationNumber?: string;
    acknowledgmentReceived: boolean;
    feedback?: string;
    corrections?: ReportCorrection[];
    metadata?: Record<string, any>;
}
/**
 * Submission status
 */
export declare enum SubmissionStatus {
    DRAFT = "DRAFT",
    PENDING_REVIEW = "PENDING_REVIEW",
    APPROVED = "APPROVED",
    SUBMITTED = "SUBMITTED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    REJECTED = "REJECTED",
    REQUIRES_CORRECTION = "REQUIRES_CORRECTION",
    RESUBMITTED = "RESUBMITTED"
}
/**
 * Report correction structure
 */
export interface ReportCorrection {
    requestedDate: Date;
    requestedBy: string;
    issue: string;
    correctionRequired: string;
    correctedDate?: Date;
    correctedBy?: string;
    notes?: string;
}
/**
 * Policy compliance validation
 */
export interface PolicyComplianceValidation {
    id: string;
    policyId: string;
    policyName: string;
    validationDate: Date;
    validatedBy: string;
    validationType: ValidationType;
    scope: ValidationScope;
    findings: ValidationFinding[];
    overallStatus: ValidationStatus;
    complianceScore: number;
    recommendations: string[];
    followUpRequired: boolean;
    followUpDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Validation type
 */
export declare enum ValidationType {
    SELF_ASSESSMENT = "SELF_ASSESSMENT",
    INTERNAL_AUDIT = "INTERNAL_AUDIT",
    EXTERNAL_AUDIT = "EXTERNAL_AUDIT",
    PEER_REVIEW = "PEER_REVIEW",
    AUTOMATED_SCAN = "AUTOMATED_SCAN",
    MANUAL_REVIEW = "MANUAL_REVIEW"
}
/**
 * Validation scope
 */
export declare enum ValidationScope {
    DEPARTMENT = "DEPARTMENT",
    AGENCY_WIDE = "AGENCY_WIDE",
    PROGRAM_SPECIFIC = "PROGRAM_SPECIFIC",
    SYSTEM_LEVEL = "SYSTEM_LEVEL",
    PROCESS_LEVEL = "PROCESS_LEVEL"
}
/**
 * Validation finding
 */
export interface ValidationFinding {
    findingId: string;
    severity: CompliancePriority;
    category: string;
    description: string;
    evidence?: string;
    recommendation: string;
    status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}
/**
 * Validation status
 */
export declare enum ValidationStatus {
    COMPLIANT = "COMPLIANT",
    PARTIALLY_COMPLIANT = "PARTIALLY_COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    NOT_APPLICABLE = "NOT_APPLICABLE",
    UNDER_REVIEW = "UNDER_REVIEW"
}
/**
 * Compliance training record
 */
export interface ComplianceTrainingRecord {
    id: string;
    trainingName: string;
    requirementId?: string;
    employeeId: string;
    employeeName: string;
    departmentId: string;
    completionDate?: Date;
    expirationDate?: Date;
    score?: number;
    passingScore: number;
    status: TrainingStatus;
    certificateIssued: boolean;
    certificatePath?: string;
    instructorId?: string;
    trainingDurationMinutes: number;
    attestationSigned: boolean;
    renewalRequired: boolean;
    metadata?: Record<string, any>;
}
/**
 * Training status
 */
export declare enum TrainingStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    PASSED = "PASSED",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    WAIVED = "WAIVED"
}
/**
 * Regulatory change management
 */
export interface RegulatoryChange {
    id: string;
    changeType: ChangeType;
    affectedRequirementId?: string;
    title: string;
    description: string;
    changeSource: string;
    effectiveDate: Date;
    impactAssessment: ImpactAssessment;
    affectedDepartments: string[];
    actionItems: ChangeActionItem[];
    implementationPlan?: string;
    status: ChangeStatus;
    approvedBy?: string;
    approvalDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Change type
 */
export declare enum ChangeType {
    NEW_REQUIREMENT = "NEW_REQUIREMENT",
    REQUIREMENT_UPDATE = "REQUIREMENT_UPDATE",
    REQUIREMENT_REPEAL = "REQUIREMENT_REPEAL",
    INTERPRETATION_CHANGE = "INTERPRETATION_CHANGE",
    ENFORCEMENT_CHANGE = "ENFORCEMENT_CHANGE",
    DEADLINE_CHANGE = "DEADLINE_CHANGE"
}
/**
 * Impact assessment
 */
export interface ImpactAssessment {
    overallImpact: 'high' | 'medium' | 'low';
    budgetImpact?: number;
    staffingImpact?: number;
    systemsImpacted: string[];
    processesImpacted: string[];
    trainingRequired: boolean;
    estimatedImplementationDays: number;
}
/**
 * Change action item
 */
export interface ChangeActionItem {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    completionDate?: Date;
}
/**
 * Change status
 */
export declare enum ChangeStatus {
    PROPOSED = "PROPOSED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IMPLEMENTATION_PLANNED = "IMPLEMENTATION_PLANNED",
    IMPLEMENTING = "IMPLEMENTING",
    IMPLEMENTED = "IMPLEMENTED",
    MONITORING = "MONITORING"
}
/**
 * Compliance risk assessment
 */
export interface ComplianceRiskAssessment {
    id: string;
    assessmentDate: Date;
    assessmentPeriod: string;
    performedBy: string;
    scope: string[];
    risks: ComplianceRisk[];
    overallRiskLevel: RiskLevel;
    mitigationPlan?: string;
    nextAssessmentDate: Date;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Compliance risk
 */
export interface ComplianceRisk {
    riskId: string;
    requirementId?: string;
    category: ComplianceCategory;
    description: string;
    likelihood: RiskLevel;
    impact: RiskLevel;
    riskScore: number;
    currentControls: string[];
    additionalControlsNeeded: string[];
    owner: string;
    status: 'identified' | 'analyzing' | 'mitigating' | 'monitoring' | 'resolved';
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
 * Compliance violation
 */
export interface ComplianceViolation {
    id: string;
    violationType: ViolationType;
    requirementId: string;
    discoveryDate: Date;
    discoveredBy: string;
    departmentId: string;
    severity: CompliancePriority;
    description: string;
    rootCause?: string;
    correctiveActions: CorrectiveAction[];
    reportedToRegulator: boolean;
    reportDate?: Date;
    status: ViolationStatus;
    resolvedDate?: Date;
    penalties?: ViolationPenalty[];
    metadata?: Record<string, any>;
}
/**
 * Violation type
 */
export declare enum ViolationType {
    PROCEDURAL = "PROCEDURAL",
    DOCUMENTATION = "DOCUMENTATION",
    DEADLINE_MISSED = "DEADLINE_MISSED",
    REPORTING_FAILURE = "REPORTING_FAILURE",
    TRAINING_GAP = "TRAINING_GAP",
    POLICY_BREACH = "POLICY_BREACH",
    SYSTEM_CONFIGURATION = "SYSTEM_CONFIGURATION",
    ACCESS_CONTROL = "ACCESS_CONTROL"
}
/**
 * Corrective action
 */
export interface CorrectiveAction {
    actionId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    completionDate?: Date;
    status: 'planned' | 'in_progress' | 'completed' | 'verified';
    effectiveness?: 'effective' | 'partially_effective' | 'ineffective';
}
/**
 * Violation status
 */
export declare enum ViolationStatus {
    IDENTIFIED = "IDENTIFIED",
    INVESTIGATING = "INVESTIGATING",
    CORRECTIVE_ACTION_PLANNED = "CORRECTIVE_ACTION_PLANNED",
    CORRECTIVE_ACTION_UNDERWAY = "CORRECTIVE_ACTION_UNDERWAY",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
/**
 * Violation penalty
 */
export interface ViolationPenalty {
    penaltyType: 'fine' | 'warning' | 'suspension' | 'other';
    amount?: number;
    issuedDate: Date;
    issuedBy: string;
    description: string;
    paidDate?: Date;
}
/**
 * Compliance dashboard metrics
 */
export interface ComplianceDashboardMetrics {
    overallComplianceRate: number;
    totalRequirements: number;
    compliantRequirements: number;
    nonCompliantRequirements: number;
    upcomingDeadlines: number;
    overdueDeadlines: number;
    activeCertifications: number;
    expiringCertifications: number;
    openViolations: number;
    criticalRisks: number;
    trainingCompletionRate: number;
    recentSubmissions: number;
    categoryBreakdown: Record<ComplianceCategory, number>;
    trendData?: ComplianceTrend[];
}
/**
 * Compliance trend
 */
export interface ComplianceTrend {
    period: string;
    complianceRate: number;
    violations: number;
    deadlinesMet: number;
}
/**
 * Creates a new regulatory requirement
 */
export declare function createRegulatoryRequirement(params: {
    requirementCode: string;
    title: string;
    description: string;
    regulatoryBody: string;
    regulationType: RegulationType;
    category: ComplianceCategory;
    effectiveDate: Date;
    mandatoryCompliance?: boolean;
    applicableAgencies?: string[];
    priority?: CompliancePriority;
}): RegulatoryRequirement;
/**
 * Updates regulatory requirement status
 */
export declare function updateRequirementStatus(requirement: RegulatoryRequirement, newStatus: RequirementStatus): RegulatoryRequirement;
/**
 * Links related requirements
 */
export declare function linkRelatedRequirements(requirement: RegulatoryRequirement, relatedRequirementIds: string[]): RegulatoryRequirement;
/**
 * Checks if requirement is active and applicable
 */
export declare function isRequirementApplicable(requirement: RegulatoryRequirement, agencyId: string, currentDate?: Date): boolean;
/**
 * Filters requirements by category
 */
export declare function filterRequirementsByCategory(requirements: RegulatoryRequirement[], category: ComplianceCategory): RegulatoryRequirement[];
/**
 * Filters requirements by regulatory body
 */
export declare function filterRequirementsByBody(requirements: RegulatoryRequirement[], regulatoryBody: string): RegulatoryRequirement[];
/**
 * Gets requirements expiring soon
 */
export declare function getExpiringSoonRequirements(requirements: RegulatoryRequirement[], daysThreshold?: number): RegulatoryRequirement[];
/**
 * Creates a compliance certification
 */
export declare function createComplianceCertification(params: {
    certificationName: string;
    certificationBody: string;
    requirementId: string;
    agencyId: string;
    certificationLevel: string;
    issueDate: Date;
    expirationDate: Date;
    renewalPeriodDays: number;
    certificationNumber: string;
    attestedBy: string;
}): ComplianceCertification;
/**
 * Checks certification validity
 */
export declare function isCertificationValid(certification: ComplianceCertification, currentDate?: Date): boolean;
/**
 * Gets certifications expiring soon
 */
export declare function getExpiringCertifications(certifications: ComplianceCertification[], daysThreshold?: number): ComplianceCertification[];
/**
 * Updates certification status
 */
export declare function updateCertificationStatus(certification: ComplianceCertification, newStatus: CertificationStatus): ComplianceCertification;
/**
 * Renews a certification
 */
export declare function renewCertification(certification: ComplianceCertification, newIssueDate: Date, newExpirationDate: Date, attestedBy: string): ComplianceCertification;
/**
 * Calculates days until certification expires
 */
export declare function daysUntilCertificationExpires(certification: ComplianceCertification, currentDate?: Date): number;
/**
 * Creates a compliance deadline
 */
export declare function createComplianceDeadline(params: {
    requirementId: string;
    title: string;
    description: string;
    dueDate: Date;
    assignedTo: string[];
    departmentId: string;
    priority?: CompliancePriority;
    deliverables?: string[];
}): ComplianceDeadline;
/**
 * Generates reminder dates for a deadline
 */
export declare function generateReminderDates(dueDate: Date): Date[];
/**
 * Updates deadline status based on current date
 */
export declare function updateDeadlineStatus(deadline: ComplianceDeadline, currentDate?: Date): ComplianceDeadline;
/**
 * Completes a deadline
 */
export declare function completeDeadline(deadline: ComplianceDeadline, completedBy: string): ComplianceDeadline;
/**
 * Requests deadline extension
 */
export declare function requestDeadlineExtension(deadline: ComplianceDeadline, requestedBy: string, newDueDate: Date, reason: string): ComplianceDeadline;
/**
 * Approves deadline extension
 */
export declare function approveDeadlineExtension(deadline: ComplianceDeadline, extensionIndex: number, approvedBy: string): ComplianceDeadline;
/**
 * Gets overdue deadlines
 */
export declare function getOverdueDeadlines(deadlines: ComplianceDeadline[], currentDate?: Date): ComplianceDeadline[];
/**
 * Gets deadlines due within specified days
 */
export declare function getDeadlinesDueSoon(deadlines: ComplianceDeadline[], daysThreshold?: number): ComplianceDeadline[];
/**
 * Creates a regulatory report submission
 */
export declare function createRegulatoryReportSubmission(params: {
    reportType: string;
    requirementId: string;
    reportingPeriodStart: Date;
    reportingPeriodEnd: Date;
    submissionDeadline: Date;
    recipientAgency: string;
    reportData: any;
}): RegulatoryReportSubmission;
/**
 * Submits a regulatory report
 */
export declare function submitRegulatoryReport(submission: RegulatoryReportSubmission, submittedBy: string): RegulatoryReportSubmission;
/**
 * Generates a confirmation number for submission
 */
export declare function generateConfirmationNumber(): string;
/**
 * Acknowledges report submission
 */
export declare function acknowledgeReportSubmission(submission: RegulatoryReportSubmission, feedback?: string): RegulatoryReportSubmission;
/**
 * Requests report corrections
 */
export declare function requestReportCorrections(submission: RegulatoryReportSubmission, requestedBy: string, issue: string, correctionRequired: string): RegulatoryReportSubmission;
/**
 * Resubmits corrected report
 */
export declare function resubmitCorrectedReport(submission: RegulatoryReportSubmission, correctionIndex: number, correctedBy: string, updatedReportData: any): RegulatoryReportSubmission;
/**
 * Creates a policy compliance validation
 */
export declare function createPolicyComplianceValidation(params: {
    policyId: string;
    policyName: string;
    validatedBy: string;
    validationType: ValidationType;
    scope: ValidationScope;
}): PolicyComplianceValidation;
/**
 * Adds validation finding
 */
export declare function addValidationFinding(validation: PolicyComplianceValidation, finding: ValidationFinding): PolicyComplianceValidation;
/**
 * Calculates compliance score from findings
 */
export declare function calculateComplianceScore(findings: ValidationFinding[]): number;
/**
 * Determines overall validation status
 */
export declare function determineValidationStatus(complianceScore: number): ValidationStatus;
/**
 * Completes validation assessment
 */
export declare function completeValidationAssessment(validation: PolicyComplianceValidation, recommendations: string[]): PolicyComplianceValidation;
/**
 * Creates a compliance training record
 */
export declare function createComplianceTrainingRecord(params: {
    trainingName: string;
    requirementId?: string;
    employeeId: string;
    employeeName: string;
    departmentId: string;
    passingScore: number;
    trainingDurationMinutes: number;
}): ComplianceTrainingRecord;
/**
 * Completes training
 */
export declare function completeTraining(training: ComplianceTrainingRecord, score: number, expirationDate?: Date): ComplianceTrainingRecord;
/**
 * Gets employees with expired training
 */
export declare function getExpiredTraining(trainings: ComplianceTrainingRecord[], currentDate?: Date): ComplianceTrainingRecord[];
/**
 * Calculates training completion rate
 */
export declare function calculateTrainingCompletionRate(trainings: ComplianceTrainingRecord[]): number;
/**
 * Creates a regulatory change
 */
export declare function createRegulatoryChange(params: {
    changeType: ChangeType;
    title: string;
    description: string;
    changeSource: string;
    effectiveDate: Date;
    impactAssessment: ImpactAssessment;
    affectedDepartments: string[];
}): RegulatoryChange;
/**
 * Adds action item to regulatory change
 */
export declare function addChangeActionItem(change: RegulatoryChange, actionItem: ChangeActionItem): RegulatoryChange;
/**
 * Approves regulatory change
 */
export declare function approveRegulatoryChange(change: RegulatoryChange, approvedBy: string): RegulatoryChange;
/**
 * Calculates change implementation progress
 */
export declare function calculateChangeProgress(change: RegulatoryChange): number;
/**
 * Creates a compliance risk assessment
 */
export declare function createComplianceRiskAssessment(params: {
    assessmentPeriod: string;
    performedBy: string;
    scope: string[];
    nextAssessmentDate: Date;
}): ComplianceRiskAssessment;
/**
 * Adds risk to assessment
 */
export declare function addComplianceRisk(assessment: ComplianceRiskAssessment, risk: ComplianceRisk): ComplianceRiskAssessment;
/**
 * Calculates risk score
 */
export declare function calculateRiskScore(likelihood: RiskLevel, impact: RiskLevel): number;
/**
 * Determines overall risk level from risks
 */
export declare function determineOverallRiskLevel(risks: ComplianceRisk[]): RiskLevel;
/**
 * Creates a compliance violation
 */
export declare function createComplianceViolation(params: {
    violationType: ViolationType;
    requirementId: string;
    discoveredBy: string;
    departmentId: string;
    severity: CompliancePriority;
    description: string;
}): ComplianceViolation;
/**
 * Adds corrective action to violation
 */
export declare function addCorrectiveAction(violation: ComplianceViolation, action: CorrectiveAction): ComplianceViolation;
/**
 * Resolves violation
 */
export declare function resolveViolation(violation: ComplianceViolation): ComplianceViolation;
/**
 * Gets open violations by severity
 */
export declare function getOpenViolationsBySeverity(violations: ComplianceViolation[], severity: CompliancePriority): ComplianceViolation[];
/**
 * Generates compliance dashboard metrics
 */
export declare function generateComplianceDashboardMetrics(params: {
    requirements: RegulatoryRequirement[];
    certifications: ComplianceCertification[];
    deadlines: ComplianceDeadline[];
    violations: ComplianceViolation[];
    trainings: ComplianceTrainingRecord[];
    submissions: RegulatoryReportSubmission[];
}): ComplianceDashboardMetrics;
/**
 * Sequelize model decorator for RegulatoryRequirement
 */
export declare const RegulatoryRequirementModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        requirementCode: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        regulatoryBody: {
            type: string;
            allowNull: boolean;
        };
        regulationType: {
            type: string;
            values: RegulationType[];
        };
        category: {
            type: string;
            values: ComplianceCategory[];
        };
        effectiveDate: {
            type: string;
            allowNull: boolean;
        };
        expirationDate: {
            type: string;
            allowNull: boolean;
        };
        mandatoryCompliance: {
            type: string;
            defaultValue: boolean;
        };
        applicableAgencies: {
            type: string;
            defaultValue: never[];
        };
        relatedRequirements: {
            type: string;
            defaultValue: never[];
        };
        documentationRequired: {
            type: string;
            defaultValue: never[];
        };
        status: {
            type: string;
            values: RequirementStatus[];
        };
        priority: {
            type: string;
            values: CompliancePriority[];
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
 * Sequelize model decorator for ComplianceCertification
 */
export declare const ComplianceCertificationModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        certificationName: {
            type: string;
            allowNull: boolean;
        };
        certificationBody: {
            type: string;
            allowNull: boolean;
        };
        requirementId: {
            type: string;
            allowNull: boolean;
        };
        agencyId: {
            type: string;
            allowNull: boolean;
        };
        departmentId: {
            type: string;
            allowNull: boolean;
        };
        certificationLevel: {
            type: string;
            allowNull: boolean;
        };
        issueDate: {
            type: string;
            allowNull: boolean;
        };
        expirationDate: {
            type: string;
            allowNull: boolean;
        };
        renewalRequired: {
            type: string;
            defaultValue: boolean;
        };
        renewalPeriodDays: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: CertificationStatus[];
        };
        certificationNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        documentPath: {
            type: string;
            allowNull: boolean;
        };
        attestedBy: {
            type: string;
            allowNull: boolean;
        };
        attestationDate: {
            type: string;
            allowNull: boolean;
        };
        nextReviewDate: {
            type: string;
            allowNull: boolean;
        };
        conditions: {
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
 * Sequelize model decorator for ComplianceDeadline
 */
export declare const ComplianceDeadlineModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        requirementId: {
            type: string;
            allowNull: boolean;
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        dueDate: {
            type: string;
            allowNull: boolean;
        };
        reminderDates: {
            type: string;
            defaultValue: never[];
        };
        assignedTo: {
            type: string;
            allowNull: boolean;
        };
        departmentId: {
            type: string;
            allowNull: boolean;
        };
        priority: {
            type: string;
            values: CompliancePriority[];
        };
        status: {
            type: string;
            values: DeadlineStatus[];
        };
        completionDate: {
            type: string;
            allowNull: boolean;
        };
        completedBy: {
            type: string;
            allowNull: boolean;
        };
        extensions: {
            type: string;
            defaultValue: never[];
        };
        dependencies: {
            type: string;
            defaultValue: never[];
        };
        deliverables: {
            type: string;
            defaultValue: never[];
        };
        notificationsSent: {
            type: string;
            defaultValue: number;
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
 * Sequelize model decorator for ComplianceViolation
 */
export declare const ComplianceViolationModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        violationType: {
            type: string;
            values: ViolationType[];
        };
        requirementId: {
            type: string;
            allowNull: boolean;
        };
        discoveryDate: {
            type: string;
            allowNull: boolean;
        };
        discoveredBy: {
            type: string;
            allowNull: boolean;
        };
        departmentId: {
            type: string;
            allowNull: boolean;
        };
        severity: {
            type: string;
            values: CompliancePriority[];
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        rootCause: {
            type: string;
            allowNull: boolean;
        };
        correctiveActions: {
            type: string;
            defaultValue: never[];
        };
        reportedToRegulator: {
            type: string;
            defaultValue: boolean;
        };
        reportDate: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: ViolationStatus[];
        };
        resolvedDate: {
            type: string;
            allowNull: boolean;
        };
        penalties: {
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
 * Example NestJS service for compliance tracking
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ComplianceTrackingService {
 *   constructor(
 *     @InjectModel(RegulatoryRequirementModel)
 *     private requirementRepo: Repository<RegulatoryRequirement>,
 *   ) {}
 *
 *   async createRequirement(dto: CreateRequirementDto): Promise<RegulatoryRequirement> {
 *     const requirement = createRegulatoryRequirement(dto);
 *     return this.requirementRepo.save(requirement);
 *   }
 *
 *   async getApplicableRequirements(agencyId: string): Promise<RegulatoryRequirement[]> {
 *     const requirements = await this.requirementRepo.find();
 *     return requirements.filter(req => isRequirementApplicable(req, agencyId));
 *   }
 * }
 * ```
 */
export declare const ComplianceTrackingServiceExample = "\n@Injectable()\nexport class ComplianceTrackingService {\n  constructor(\n    @InjectModel(RegulatoryRequirementModel)\n    private requirementRepo: Repository<RegulatoryRequirement>,\n    @InjectModel(ComplianceCertificationModel)\n    private certificationRepo: Repository<ComplianceCertification>,\n    @InjectModel(ComplianceDeadlineModel)\n    private deadlineRepo: Repository<ComplianceDeadline>,\n  ) {}\n\n  async getDashboardMetrics(agencyId: string): Promise<ComplianceDashboardMetrics> {\n    const requirements = await this.requirementRepo.find();\n    const certifications = await this.certificationRepo.find({ where: { agencyId } });\n    const deadlines = await this.deadlineRepo.find();\n\n    return generateComplianceDashboardMetrics({\n      requirements,\n      certifications,\n      deadlines,\n      violations: [],\n      trainings: [],\n      submissions: [],\n    });\n  }\n}\n";
/**
 * Swagger DTO for creating regulatory requirement
 */
export declare const CreateRegulatoryRequirementDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            requirementCode: {
                type: string;
                example: string;
            };
            title: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            regulatoryBody: {
                type: string;
                example: string;
            };
            regulationType: {
                type: string;
                enum: RegulationType[];
            };
            category: {
                type: string;
                enum: ComplianceCategory[];
            };
            effectiveDate: {
                type: string;
                format: string;
            };
            expirationDate: {
                type: string;
                format: string;
                nullable: boolean;
            };
            mandatoryCompliance: {
                type: string;
                default: boolean;
            };
            applicableAgencies: {
                type: string;
                items: {
                    type: string;
                };
            };
            priority: {
                type: string;
                enum: CompliancePriority[];
            };
        };
    };
};
/**
 * Swagger DTO for compliance deadline
 */
export declare const CreateComplianceDeadlineDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            requirementId: {
                type: string;
                format: string;
            };
            title: {
                type: string;
                example: string;
            };
            description: {
                type: string;
                example: string;
            };
            dueDate: {
                type: string;
                format: string;
            };
            assignedTo: {
                type: string;
                items: {
                    type: string;
                };
            };
            departmentId: {
                type: string;
                format: string;
            };
            priority: {
                type: string;
                enum: CompliancePriority[];
            };
            deliverables: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
};
/**
 * Swagger response schema for dashboard metrics
 */
export declare const ComplianceDashboardMetricsResponse: {
    schema: {
        type: string;
        properties: {
            overallComplianceRate: {
                type: string;
                example: number;
            };
            totalRequirements: {
                type: string;
                example: number;
            };
            compliantRequirements: {
                type: string;
                example: number;
            };
            nonCompliantRequirements: {
                type: string;
                example: number;
            };
            upcomingDeadlines: {
                type: string;
                example: number;
            };
            overdueDeadlines: {
                type: string;
                example: number;
            };
            activeCertifications: {
                type: string;
                example: number;
            };
            expiringCertifications: {
                type: string;
                example: number;
            };
            openViolations: {
                type: string;
                example: number;
            };
            criticalRisks: {
                type: string;
                example: number;
            };
            trainingCompletionRate: {
                type: string;
                example: number;
            };
            recentSubmissions: {
                type: string;
                example: number;
            };
            categoryBreakdown: {
                type: string;
                additionalProperties: {
                    type: string;
                };
            };
        };
    };
};
//# sourceMappingURL=compliance-regulatory-tracking-kit.d.ts.map