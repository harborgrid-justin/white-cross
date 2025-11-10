/**
 * LOC: HCM_COMP_001
 * File: /reuse/server/human-capital/compliance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - HR compliance controllers
 *   - Audit & reporting services
 *   - Regulatory filing systems
 *   - Employee self-service portals
 *   - Legal & compliance dashboards
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Regulatory framework enumeration
 */
export declare enum RegulatoryFramework {
    FLSA = "flsa",// Fair Labor Standards Act
    ADA = "ada",// Americans with Disabilities Act
    FMLA = "fmla",// Family and Medical Leave Act
    EEOC = "eeoc",// Equal Employment Opportunity Commission
    OFCCP = "ofccp",// Office of Federal Contract Compliance Programs
    OSHA = "osha",// Occupational Safety and Health Administration
    COBRA = "cobra",// Consolidated Omnibus Budget Reconciliation Act
    HIPAA = "hipaa",// Health Insurance Portability and Accountability Act
    GDPR = "gdpr",// General Data Protection Regulation
    CCPA = "ccpa",// California Consumer Privacy Act
    WARN = "warn",// Worker Adjustment and Retraining Notification Act
    USERRA = "userra",// Uniformed Services Employment and Reemployment Rights Act
    SOX = "sox",// Sarbanes-Oxley Act
    FCRA = "fcra",// Fair Credit Reporting Act
    NLRA = "nlra"
}
/**
 * Compliance status enumeration
 */
export declare enum ComplianceStatus {
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    PENDING_REVIEW = "pending_review",
    UNDER_INVESTIGATION = "under_investigation",
    REMEDIATED = "remediated",
    WAIVED = "waived",
    NOT_APPLICABLE = "not_applicable"
}
/**
 * I-9 verification status
 */
export declare enum I9Status {
    NOT_STARTED = "not_started",
    SECTION1_COMPLETED = "section1_completed",
    SECTION2_PENDING = "section2_pending",
    SECTION2_COMPLETED = "section2_completed",
    SECTION3_PENDING = "section3_pending",
    REVERIFICATION_REQUIRED = "reverification_required",
    EXPIRED = "expired",
    COMPLIANT = "compliant"
}
/**
 * Work authorization type
 */
export declare enum WorkAuthorizationType {
    US_CITIZEN = "us_citizen",
    PERMANENT_RESIDENT = "permanent_resident",
    H1B_VISA = "h1b_visa",
    L1_VISA = "l1_visa",
    F1_OPT = "f1_opt",
    TN_VISA = "tn_visa",
    EAD = "ead",// Employment Authorization Document
    GREEN_CARD = "green_card",
    REFUGEE = "refugee",
    ASYLUM = "asylum"
}
/**
 * Policy acknowledgment status
 */
export declare enum AcknowledgmentStatus {
    PENDING = "pending",
    ACKNOWLEDGED = "acknowledged",
    DECLINED = "declined",
    EXPIRED = "expired",
    OVERDUE = "overdue"
}
/**
 * Compliance training status
 */
export declare enum TrainingStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    EXPIRED = "expired",
    WAIVED = "waived"
}
/**
 * Document retention category
 */
export declare enum RetentionCategory {
    EMPLOYEE_RECORDS = "employee_records",
    PAYROLL = "payroll",
    TAX_RECORDS = "tax_records",
    BENEFITS = "benefits",
    SAFETY_RECORDS = "safety_records",
    MEDICAL_RECORDS = "medical_records",
    EMPLOYMENT_CONTRACTS = "employment_contracts",
    TERMINATION_RECORDS = "termination_records",
    COMPLIANCE_RECORDS = "compliance_records",
    LEGAL_HOLDS = "legal_holds"
}
/**
 * Alert severity
 */
export declare enum AlertSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info"
}
/**
 * Alert status
 */
export declare enum AlertStatus {
    OPEN = "open",
    ACKNOWLEDGED = "acknowledged",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    DISMISSED = "dismissed",
    ESCALATED = "escalated"
}
/**
 * Whistleblower case status
 */
export declare enum WhistleblowerStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    INVESTIGATING = "investigating",
    SUBSTANTIATED = "substantiated",
    UNSUBSTANTIATED = "unsubstantiated",
    CLOSED = "closed"
}
/**
 * EEO category
 */
export declare enum EEOCategory {
    EXECUTIVE_SENIOR_OFFICIALS = "1.1",
    FIRST_MID_OFFICIALS_MANAGERS = "1.2",
    PROFESSIONALS = "2",
    TECHNICIANS = "3",
    SALES_WORKERS = "4",
    ADMINISTRATIVE_SUPPORT = "5",
    CRAFT_WORKERS = "6",
    OPERATIVES = "7",
    LABORERS_HELPERS = "8",
    SERVICE_WORKERS = "9"
}
/**
 * Compliance issue interface
 */
export interface ComplianceIssue {
    id: string;
    framework: RegulatoryFramework;
    issueType: string;
    description: string;
    severity: AlertSeverity;
    status: ComplianceStatus;
    employeeId?: string;
    departmentId?: string;
    identifiedDate: Date;
    dueDate?: Date;
    resolvedDate?: Date;
    identifiedBy: string;
    assignedTo?: string;
    remediationPlan?: string;
    metadata?: Record<string, any>;
}
/**
 * Policy interface
 */
export interface Policy {
    id: string;
    policyNumber: string;
    title: string;
    description: string;
    category: string;
    version: string;
    effectiveDate: Date;
    expiryDate?: Date;
    requiresAcknowledgment: boolean;
    acknowledgmentDeadlineDays?: number;
    content?: string;
    attachments?: string[];
    applicableRoles?: string[];
    applicableDepartments?: string[];
    isActive: boolean;
}
/**
 * I-9 verification record
 */
export interface I9Record {
    id: string;
    employeeId: string;
    status: I9Status;
    section1CompletedDate?: Date;
    section2CompletedDate?: Date;
    section3CompletedDate?: Date;
    verifiedBy?: string;
    documentType?: string;
    documentNumber?: string;
    expirationDate?: Date;
    reverificationDate?: Date;
    notes?: string;
}
/**
 * Work authorization record
 */
export interface WorkAuthorization {
    id: string;
    employeeId: string;
    authorizationType: WorkAuthorizationType;
    documentNumber: string;
    issueDate: Date;
    expirationDate?: Date;
    issuingCountry: string;
    verifiedDate: Date;
    verifiedBy: string;
    status: string;
    notes?: string;
}
/**
 * Compliance training record
 */
export interface ComplianceTraining {
    id: string;
    employeeId: string;
    trainingTitle: string;
    trainingCategory: string;
    framework?: RegulatoryFramework;
    assignedDate: Date;
    dueDate: Date;
    completedDate?: Date;
    score?: number;
    passingScore?: number;
    status: TrainingStatus;
    certificateUrl?: string;
    expiryDate?: Date;
    assignedBy: string;
}
/**
 * Document retention policy
 */
export interface RetentionPolicy {
    id: string;
    category: RetentionCategory;
    description: string;
    retentionPeriodYears: number;
    framework?: RegulatoryFramework;
    disposalMethod: string;
    isActive: boolean;
    notes?: string;
}
/**
 * Compliance alert
 */
export interface ComplianceAlert {
    id: string;
    alertType: string;
    severity: AlertSeverity;
    status: AlertStatus;
    title: string;
    description: string;
    framework?: RegulatoryFramework;
    employeeId?: string;
    departmentId?: string;
    dueDate?: Date;
    createdDate: Date;
    acknowledgedDate?: Date;
    resolvedDate?: Date;
    assignedTo?: string;
    metadata?: Record<string, any>;
}
/**
 * Whistleblower case
 */
export interface WhistleblowerCase {
    id: string;
    caseNumber: string;
    reporterName?: string;
    reporterEmail?: string;
    isAnonymous: boolean;
    category: string;
    description: string;
    allegation: string;
    status: WhistleblowerStatus;
    submittedDate: Date;
    assignedTo?: string;
    investigationNotes?: string;
    finding?: string;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * EEO report data
 */
export interface EEOReportData {
    reportingYear: number;
    totalEmployees: number;
    byJobCategory: Record<EEOCategory, number>;
    byRaceEthnicity: Record<string, number>;
    byGender: Record<string, number>;
    newHires: number;
    terminations: number;
    metadata?: Record<string, any>;
}
/**
 * Compliance issue validation schema
 */
export declare const ComplianceIssueSchema: any;
/**
 * Policy validation schema
 */
export declare const PolicySchema: any;
/**
 * I-9 record validation schema
 */
export declare const I9RecordSchema: any;
/**
 * Work authorization validation schema
 */
export declare const WorkAuthorizationSchema: any;
/**
 * Compliance training validation schema
 */
export declare const ComplianceTrainingSchema: any;
/**
 * Whistleblower case validation schema
 */
export declare const WhistleblowerCaseSchema: any;
/**
 * Compliance Issue Model
 */
export declare class ComplianceIssueModel extends Model {
    id: string;
    framework: RegulatoryFramework;
    issueType: string;
    description: string;
    severity: AlertSeverity;
    status: ComplianceStatus;
    employeeId: string;
    departmentId: string;
    identifiedDate: Date;
    dueDate: Date;
    resolvedDate: Date;
    identifiedBy: string;
    assignedTo: string;
    remediationPlan: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Policy Model
 */
export declare class PolicyModel extends Model {
    id: string;
    policyNumber: string;
    title: string;
    description: string;
    category: string;
    version: string;
    effectiveDate: Date;
    expiryDate: Date;
    requiresAcknowledgment: boolean;
    acknowledgmentDeadlineDays: number;
    content: string;
    attachments: string[];
    applicableRoles: string[];
    applicableDepartments: string[];
    isActive: boolean;
    acknowledgments: PolicyAcknowledgmentModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Policy Acknowledgment Model
 */
export declare class PolicyAcknowledgmentModel extends Model {
    id: string;
    policyId: string;
    employeeId: string;
    status: AcknowledgmentStatus;
    assignedDate: Date;
    dueDate: Date;
    acknowledgedDate: Date;
    ipAddress: string;
    notes: string;
    policy: PolicyModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * I-9 Verification Model
 */
export declare class I9VerificationModel extends Model {
    id: string;
    employeeId: string;
    status: I9Status;
    section1CompletedDate: Date;
    section2CompletedDate: Date;
    section3CompletedDate: Date;
    verifiedBy: string;
    documentType: string;
    documentNumber: string;
    expirationDate: Date;
    reverificationDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Work Authorization Model
 */
export declare class WorkAuthorizationModel extends Model {
    id: string;
    employeeId: string;
    authorizationType: WorkAuthorizationType;
    documentNumber: string;
    issueDate: Date;
    expirationDate: Date;
    issuingCountry: string;
    verifiedDate: Date;
    verifiedBy: string;
    status: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Compliance Training Model
 */
export declare class ComplianceTrainingModel extends Model {
    id: string;
    employeeId: string;
    trainingTitle: string;
    trainingCategory: string;
    framework: RegulatoryFramework;
    assignedDate: Date;
    dueDate: Date;
    completedDate: Date;
    score: number;
    passingScore: number;
    status: TrainingStatus;
    certificateUrl: string;
    expiryDate: Date;
    assignedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document Retention Policy Model
 */
export declare class DocumentRetentionPolicyModel extends Model {
    id: string;
    category: RetentionCategory;
    description: string;
    retentionPeriodYears: number;
    framework: RegulatoryFramework;
    disposalMethod: string;
    isActive: boolean;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance Alert Model
 */
export declare class ComplianceAlertModel extends Model {
    id: string;
    alertType: string;
    severity: AlertSeverity;
    status: AlertStatus;
    title: string;
    description: string;
    framework: RegulatoryFramework;
    employeeId: string;
    departmentId: string;
    dueDate: Date;
    acknowledgedDate: Date;
    resolvedDate: Date;
    assignedTo: string;
    metadata: Record<string, any>;
    createdDate: Date;
    updatedAt: Date;
}
/**
 * Whistleblower Case Model
 */
export declare class WhistleblowerCaseModel extends Model {
    id: string;
    caseNumber: string;
    reporterName: string;
    reporterEmail: string;
    isAnonymous: boolean;
    category: string;
    description: string;
    allegation: string;
    status: WhistleblowerStatus;
    submittedDate: Date;
    assignedTo: string;
    investigationNotes: string;
    finding: string;
    closedDate: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * EEO Report Model
 */
export declare class EEOReportModel extends Model {
    id: string;
    reportingYear: number;
    totalEmployees: number;
    byJobCategory: Record<string, number>;
    byRaceEthnicity: Record<string, number>;
    byGender: Record<string, number>;
    newHires: number;
    terminations: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create compliance issue
 */
export declare function createComplianceIssue(issueData: Omit<ComplianceIssue, 'id'>, transaction?: Transaction): Promise<ComplianceIssueModel>;
/**
 * Update compliance issue
 */
export declare function updateComplianceIssue(issueId: string, updates: Partial<ComplianceIssue>, transaction?: Transaction): Promise<ComplianceIssueModel>;
/**
 * Get compliance issues by framework
 */
export declare function getComplianceIssuesByFramework(framework: RegulatoryFramework, status?: ComplianceStatus): Promise<ComplianceIssueModel[]>;
/**
 * Get compliance issues by employee
 */
export declare function getComplianceIssuesByEmployee(employeeId: string): Promise<ComplianceIssueModel[]>;
/**
 * Resolve compliance issue
 */
export declare function resolveComplianceIssue(issueId: string, resolution: string, resolvedBy: string, transaction?: Transaction): Promise<void>;
/**
 * Get overdue compliance issues
 */
export declare function getOverdueComplianceIssues(): Promise<ComplianceIssueModel[]>;
/**
 * Create policy
 */
export declare function createPolicy(policyData: Omit<Policy, 'id'>, transaction?: Transaction): Promise<PolicyModel>;
/**
 * Update policy
 */
export declare function updatePolicy(policyId: string, updates: Partial<Policy>, transaction?: Transaction): Promise<PolicyModel>;
/**
 * Get active policies
 */
export declare function getActivePolicies(category?: string): Promise<PolicyModel[]>;
/**
 * Assign policy to employee
 */
export declare function assignPolicyToEmployee(policyId: string, employeeId: string, transaction?: Transaction): Promise<PolicyAcknowledgmentModel>;
/**
 * Acknowledge policy
 */
export declare function acknowledgePolicy(acknowledgmentId: string, ipAddress?: string, transaction?: Transaction): Promise<void>;
/**
 * Get pending policy acknowledgments
 */
export declare function getPendingPolicyAcknowledgments(employeeId: string): Promise<PolicyAcknowledgmentModel[]>;
/**
 * Get overdue policy acknowledgments
 */
export declare function getOverduePolicyAcknowledgments(): Promise<PolicyAcknowledgmentModel[]>;
/**
 * Create I-9 record
 */
export declare function createI9Record(recordData: Omit<I9Record, 'id'>, transaction?: Transaction): Promise<I9VerificationModel>;
/**
 * Update I-9 record
 */
export declare function updateI9Record(employeeId: string, updates: Partial<I9Record>, transaction?: Transaction): Promise<I9VerificationModel>;
/**
 * Complete I-9 section 1
 */
export declare function completeI9Section1(employeeId: string, transaction?: Transaction): Promise<void>;
/**
 * Complete I-9 section 2
 */
export declare function completeI9Section2(employeeId: string, verifiedBy: string, documentType: string, documentNumber: string, transaction?: Transaction): Promise<void>;
/**
 * Get I-9 records requiring reverification
 */
export declare function getI9RecordsRequiringReverification(): Promise<I9VerificationModel[]>;
/**
 * Get expiring I-9 records
 */
export declare function getExpiringI9Records(daysAhead?: number): Promise<I9VerificationModel[]>;
/**
 * Create work authorization
 */
export declare function createWorkAuthorization(authData: Omit<WorkAuthorization, 'id'>, transaction?: Transaction): Promise<WorkAuthorizationModel>;
/**
 * Update work authorization
 */
export declare function updateWorkAuthorization(authId: string, updates: Partial<WorkAuthorization>, transaction?: Transaction): Promise<WorkAuthorizationModel>;
/**
 * Get work authorizations by employee
 */
export declare function getWorkAuthorizationsByEmployee(employeeId: string): Promise<WorkAuthorizationModel[]>;
/**
 * Get expiring work authorizations
 */
export declare function getExpiringWorkAuthorizations(daysAhead?: number): Promise<WorkAuthorizationModel[]>;
/**
 * Verify work authorization
 */
export declare function verifyWorkAuthorization(authId: string, verifiedBy: string, transaction?: Transaction): Promise<void>;
/**
 * Assign compliance training
 */
export declare function assignComplianceTraining(trainingData: Omit<ComplianceTraining, 'id'>, transaction?: Transaction): Promise<ComplianceTrainingModel>;
/**
 * Complete compliance training
 */
export declare function completeComplianceTraining(trainingId: string, score: number, certificateUrl?: string, transaction?: Transaction): Promise<void>;
/**
 * Get overdue compliance trainings
 */
export declare function getOverdueComplianceTrainings(): Promise<ComplianceTrainingModel[]>;
/**
 * Get expired compliance trainings
 */
export declare function getExpiredComplianceTrainings(): Promise<ComplianceTrainingModel[]>;
/**
 * Get employee compliance trainings
 */
export declare function getEmployeeComplianceTrainings(employeeId: string, status?: TrainingStatus): Promise<ComplianceTrainingModel[]>;
/**
 * Create retention policy
 */
export declare function createRetentionPolicy(policyData: Omit<RetentionPolicy, 'id'>, transaction?: Transaction): Promise<DocumentRetentionPolicyModel>;
/**
 * Get retention policy by category
 */
export declare function getRetentionPolicyByCategory(category: RetentionCategory): Promise<DocumentRetentionPolicyModel | null>;
/**
 * Get all active retention policies
 */
export declare function getActiveRetentionPolicies(): Promise<DocumentRetentionPolicyModel[]>;
/**
 * Calculate document disposal date
 */
export declare function calculateDisposalDate(documentDate: Date, retentionYears: number): Date;
/**
 * Create compliance alert
 */
export declare function createComplianceAlert(alertData: Omit<ComplianceAlert, 'id' | 'createdDate'>, transaction?: Transaction): Promise<ComplianceAlertModel>;
/**
 * Update alert status
 */
export declare function updateAlertStatus(alertId: string, status: AlertStatus, transaction?: Transaction): Promise<void>;
/**
 * Get open alerts
 */
export declare function getOpenAlerts(severity?: AlertSeverity): Promise<ComplianceAlertModel[]>;
/**
 * Get employee alerts
 */
export declare function getEmployeeAlerts(employeeId: string): Promise<ComplianceAlertModel[]>;
/**
 * Dismiss alert
 */
export declare function dismissAlert(alertId: string, transaction?: Transaction): Promise<void>;
/**
 * Submit whistleblower case
 */
export declare function submitWhistleblowerCase(caseData: Omit<WhistleblowerCase, 'id' | 'submittedDate'>, transaction?: Transaction): Promise<WhistleblowerCaseModel>;
/**
 * Assign whistleblower case
 */
export declare function assignWhistleblowerCase(caseId: string, assignedTo: string, transaction?: Transaction): Promise<void>;
/**
 * Update whistleblower investigation
 */
export declare function updateWhistleblowerInvestigation(caseId: string, investigationNotes: string, status?: WhistleblowerStatus, transaction?: Transaction): Promise<void>;
/**
 * Close whistleblower case
 */
export declare function closeWhistleblowerCase(caseId: string, finding: string, substantiated: boolean, transaction?: Transaction): Promise<void>;
/**
 * Get active whistleblower cases
 */
export declare function getActiveWhistleblowerCases(): Promise<WhistleblowerCaseModel[]>;
/**
 * Create EEO report
 */
export declare function createEEOReport(reportData: Omit<EEOReportData, 'id'>, transaction?: Transaction): Promise<EEOReportModel>;
/**
 * Update EEO report
 */
export declare function updateEEOReport(reportingYear: number, updates: Partial<EEOReportData>, transaction?: Transaction): Promise<EEOReportModel>;
/**
 * Get EEO report by year
 */
export declare function getEEOReportByYear(reportingYear: number): Promise<EEOReportModel | null>;
/**
 * Get all EEO reports
 */
export declare function getAllEEOReports(): Promise<EEOReportModel[]>;
/**
 * Get compliance dashboard metrics
 */
export declare function getComplianceDashboardMetrics(): Promise<{
    openIssues: number;
    overdueIssues: number;
    pendingTrainings: number;
    expiredTrainings: number;
    openAlerts: number;
    criticalAlerts: number;
    pendingAcknowledgments: number;
    activeWhistleblowerCases: number;
}>;
/**
 * Generate compliance report by framework
 */
export declare function generateComplianceReportByFramework(framework: RegulatoryFramework, startDate?: Date, endDate?: Date): Promise<{
    framework: RegulatoryFramework;
    totalIssues: number;
    resolvedIssues: number;
    openIssues: number;
    complianceRate: number;
    issues: ComplianceIssueModel[];
}>;
export declare class ComplianceService {
    createIssue(data: Omit<ComplianceIssue, 'id'>): Promise<ComplianceIssueModel>;
    createPolicy(data: Omit<Policy, 'id'>): Promise<PolicyModel>;
    assignPolicy(policyId: string, employeeId: string): Promise<PolicyAcknowledgmentModel>;
    createI9(data: Omit<I9Record, 'id'>): Promise<I9VerificationModel>;
    assignTraining(data: Omit<ComplianceTraining, 'id'>): Promise<ComplianceTrainingModel>;
    submitWhistleblower(data: Omit<WhistleblowerCase, 'id' | 'submittedDate'>): Promise<WhistleblowerCaseModel>;
    getDashboard(): Promise<{
        openIssues: number;
        overdueIssues: number;
        pendingTrainings: number;
        expiredTrainings: number;
        openAlerts: number;
        criticalAlerts: number;
        pendingAcknowledgments: number;
        activeWhistleblowerCases: number;
    }>;
}
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    getDashboard(): Promise<{
        openIssues: number;
        overdueIssues: number;
        pendingTrainings: number;
        expiredTrainings: number;
        openAlerts: number;
        criticalAlerts: number;
        pendingAcknowledgments: number;
        activeWhistleblowerCases: number;
    }>;
    createIssue(data: Omit<ComplianceIssue, 'id'>): Promise<ComplianceIssueModel>;
    createPolicy(data: Omit<Policy, 'id'>): Promise<PolicyModel>;
    submitWhistleblower(data: Omit<WhistleblowerCase, 'id' | 'submittedDate'>): Promise<WhistleblowerCaseModel>;
}
export { ComplianceIssueModel, PolicyModel, PolicyAcknowledgmentModel, I9VerificationModel, WorkAuthorizationModel, ComplianceTrainingModel, DocumentRetentionPolicyModel, ComplianceAlertModel, WhistleblowerCaseModel, EEOReportModel, ComplianceService, ComplianceController, };
//# sourceMappingURL=compliance-management-kit.d.ts.map