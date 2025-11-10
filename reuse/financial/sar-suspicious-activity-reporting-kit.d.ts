/**
 * LOC: FINSAR1234567
 * File: /reuse/financial/sar-suspicious-activity-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - AML/BSA compliance controllers
 *   - Suspicious activity monitoring services
 *   - FinCEN reporting modules
 *   - Investigation and case management systems
 */
/**
 * File: /reuse/financial/sar-suspicious-activity-reporting-kit.ts
 * Locator: WC-FIN-SAR-001
 * Purpose: USACE CEFMS-Level Suspicious Activity Reporting - SAR detection, classification, FinCEN filing, BSA/AML compliance
 *
 * Upstream: Independent SAR utility module
 * Downstream: ../backend/*, Compliance controllers, AML services, Investigation systems, Regulatory reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 48 utility functions for SAR detection, classification, narrative generation, FinCEN filing, workflow management, analytics
 *
 * LLM Context: Enterprise-grade Suspicious Activity Reporting (SAR) system for BSA/AML compliance.
 * Provides comprehensive SAR triggering conditions detection, suspicious activity classification,
 * narrative generation, FinCEN SAR form completion (FinCEN Form 111), supporting documentation management,
 * multi-level review and approval workflows, continuing activity SAR tracking, filing deadline monitoring,
 * BSA/AML officer notifications, strict confidentiality enforcement (Section 21 USC 5318(g)(2)),
 * SAR metrics and analytics, trend analysis, pattern detection, quality assurance reviews,
 * regulatory submission to FinCEN BSA E-Filing System, investigation case linking, and integrated
 * compliance reporting competing with USACE CEFMS and enterprise AML solutions.
 */
import { Sequelize, Transaction } from 'sequelize';
interface SuspiciousActivityReport {
    id: string;
    sarNumber: string;
    reportingInstitution: string;
    filingDeadline: Date;
    filingDate?: Date;
    status: 'draft' | 'pending-review' | 'approved' | 'filed' | 'rejected' | 'amended';
    priorSarNumber?: string;
    isContinuingActivity: boolean;
    activityBeginDate: Date;
    activityEndDate?: Date;
    detectionDate: Date;
    subjectType: 'individual' | 'entity' | 'multiple';
    subjects: SARSubject[];
    suspiciousActivityTypes: SuspiciousActivityType[];
    totalAmount?: number;
    currency: string;
    narrative: string;
    supportingDocuments: SupportingDocument[];
    transactionIds: string[];
    accountIds: string[];
    reviewWorkflow: ReviewWorkflowStep[];
    preparedBy: string;
    reviewedBy?: string;
    approvedBy?: string;
    bsaOfficerNotified: boolean;
    confidentialityAcknowledged: boolean;
    fincenSubmissionId?: string;
    fincenAcknowledgment?: string;
    linkedInvestigationId?: string;
}
interface SARSubject {
    subjectId: string;
    subjectType: 'individual' | 'entity';
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: Date;
    ssn?: string;
    ein?: string;
    entityName?: string;
    address: Address;
    phoneNumbers: string[];
    emailAddresses: string[];
    identificationDocuments: IdentificationDocument[];
    accountNumbers: string[];
    relationship: 'account-holder' | 'authorized-signer' | 'beneficiary' | 'introducer' | 'other';
    roleInActivity: string;
}
interface Address {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    addressType: 'residential' | 'business' | 'mailing';
}
interface IdentificationDocument {
    documentType: 'drivers-license' | 'passport' | 'state-id' | 'military-id' | 'other';
    documentNumber: string;
    issuingCountry: string;
    issuingState?: string;
    expirationDate?: Date;
}
interface SuspiciousActivityType {
    activityCode: string;
    activityCategory: string;
    description: string;
    amount?: number;
    occurrences: number;
    indicators: string[];
}
interface SupportingDocument {
    documentId: string;
    documentType: string;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    uploadedBy: string;
    description: string;
    confidential: boolean;
}
interface ReviewWorkflowStep {
    stepNumber: number;
    stepType: 'prepare' | 'review' | 'approve' | 'file';
    assignedTo: string;
    assignedRole: string;
    status: 'pending' | 'in-progress' | 'completed' | 'rejected';
    startDate: Date;
    completionDate?: Date;
    comments?: string;
    decision?: 'approve' | 'reject' | 'request-changes';
}
interface SARTriggeringCondition {
    conditionId: string;
    conditionType: string;
    conditionName: string;
    description: string;
    thresholds: Record<string, number>;
    detectionRules: DetectionRule[];
    severityLevel: 'low' | 'medium' | 'high' | 'critical';
    autoGenerateSAR: boolean;
    requiresManualReview: boolean;
}
interface DetectionRule {
    ruleId: string;
    ruleName: string;
    ruleLogic: string;
    parameters: Record<string, any>;
    enabled: boolean;
    priority: number;
}
interface SARAlert {
    alertId: string;
    alertDate: Date;
    triggeredConditions: SARTriggeringCondition[];
    entityId: string;
    entityType: 'customer' | 'account' | 'transaction';
    riskScore: number;
    alertStatus: 'new' | 'under-review' | 'escalated' | 'sar-filed' | 'closed-no-sar' | 'false-positive';
    assignedTo?: string;
    reviewNotes?: string;
    disposition: string;
    dispositionDate?: Date;
    escalationLevel: number;
}
interface SARNarrative {
    sarId: string;
    narrativeType: 'complete' | 'supplemental' | 'correction';
    sections: NarrativeSection[];
    wordCount: number;
    generatedDate: Date;
    lastEditedDate: Date;
    editedBy: string;
    qualityScore: number;
    complianceChecks: ComplianceCheck[];
}
interface NarrativeSection {
    sectionTitle: string;
    sectionNumber: number;
    content: string;
    requiredElements: string[];
    completenessScore: number;
}
interface ComplianceCheck {
    checkType: string;
    checkName: string;
    passed: boolean;
    details: string;
    recommendation?: string;
}
interface FinCENSARForm {
    formType: 'FinCEN-SAR' | 'FinCEN-111';
    formVersion: string;
    formData: Record<string, any>;
    xmlData?: string;
    validationStatus: 'valid' | 'invalid' | 'warnings';
    validationErrors: ValidationError[];
    submissionReady: boolean;
}
interface ValidationError {
    fieldName: string;
    errorType: string;
    errorMessage: string;
    severity: 'error' | 'warning' | 'info';
}
interface SARFilingDeadline {
    sarId: string;
    detectionDate: Date;
    statutoryDeadline: Date;
    internalDeadline: Date;
    filingDate?: Date;
    daysRemaining: number;
    deadlineStatus: 'on-time' | 'approaching' | 'overdue' | 'filed';
    extensionRequested: boolean;
    extensionApproved: boolean;
    escalationRequired: boolean;
}
interface ContinuingActivitySAR {
    originalSarId: string;
    originalSarNumber: string;
    originalFilingDate: Date;
    continuingSarId: string;
    continuingSarNumber: string;
    continuationNumber: number;
    activityContinuedSince: Date;
    newActivityDetected: Date;
    updateReason: string;
    addedTransactions: string[];
    addedAmount: number;
    cumulativeAmount: number;
    narrativeUpdate: string;
}
interface BSAOfficerNotification {
    notificationId: string;
    sarId: string;
    officerId: string;
    officerName: string;
    notificationDate: Date;
    notificationMethod: 'email' | 'system-alert' | 'phone' | 'meeting';
    notificationType: 'new-sar' | 'deadline-approaching' | 'review-required' | 'escalation';
    urgencyLevel: 'normal' | 'high' | 'critical';
    acknowledged: boolean;
    acknowledgmentDate?: Date;
    response?: string;
}
interface AccessLogEntry {
    accessId: string;
    userId: string;
    userName: string;
    accessDate: Date;
    accessType: 'view' | 'edit' | 'print' | 'export';
    ipAddress: string;
    purpose: string;
    authorized: boolean;
}
interface SharingAuthorization {
    authorizationId: string;
    recipientAgency: string;
    recipientType: 'law-enforcement' | 'regulator' | 'fiu' | 'internal';
    authorizedBy: string;
    authorizationDate: Date;
    legalBasis: string;
    expirationDate?: Date;
    documentsShared: string[];
}
interface SARMetrics {
    periodStart: Date;
    periodEnd: Date;
    totalSARsFiled: number;
    sarsByType: Record<string, number>;
    sarsByStatus: Record<string, number>;
    averageFilingTime: number;
    deadlineComplianceRate: number;
    falsePositiveRate: number;
    escalationRate: number;
    qualityScoreAverage: number;
    topSuspiciousActivities: ActivityMetric[];
    filingTrends: TrendData[];
}
interface ActivityMetric {
    activityType: string;
    count: number;
    totalAmount: number;
    percentageOfTotal: number;
    averageRiskScore: number;
}
interface TrendData {
    period: string;
    count: number;
    amount: number;
    changePercentage: number;
}
interface SARTrendAnalysis {
    analysisId: string;
    analysisDate: Date;
    analysisPeriod: string;
    trendType: 'increasing' | 'decreasing' | 'stable' | 'seasonal';
    trendIndicators: string[];
    patterns: PatternDetection[];
    riskAssessment: string;
    recommendations: string[];
    alertLevel: 'normal' | 'elevated' | 'high';
}
interface PatternDetection {
    patternId: string;
    patternType: string;
    patternDescription: string;
    confidence: number;
    occurrences: number;
    relatedSARs: string[];
    relatedEntities: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
interface SARQualityReview {
    reviewId: string;
    sarId: string;
    reviewDate: Date;
    reviewedBy: string;
    reviewType: 'pre-filing' | 'post-filing' | 'periodic' | 'audit';
    qualityCriteria: QualityCriterion[];
    overallScore: number;
    deficiencies: Deficiency[];
    correctionRequired: boolean;
    reviewStatus: 'passed' | 'passed-with-comments' | 'failed';
    recommendations: string[];
}
interface QualityCriterion {
    criterionName: string;
    criterionDescription: string;
    weight: number;
    score: number;
    passed: boolean;
    comments?: string;
}
interface Deficiency {
    deficiencyType: string;
    description: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    correctiveAction: string;
    responsibleParty: string;
    dueDate: Date;
    status: 'open' | 'in-progress' | 'resolved';
}
interface RegulatorySubmission {
    submissionId: string;
    sarId: string;
    submissionDate: Date;
    submissionMethod: 'bsa-e-filing' | 'fincen-gateway' | 'manual';
    submissionStatus: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'needs-correction';
    batchNumber?: string;
    acknowledgmentNumber?: string;
    acknowledgmentDate?: Date;
    rejectionReasons?: string[];
    resubmissionRequired: boolean;
    confirmationDocument?: string;
}
/**
 * Sequelize model for Suspicious Activity Reports with comprehensive SAR lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SuspiciousActivityReport model
 *
 * @example
 * ```typescript
 * const SAR = createSuspiciousActivityReportModel(sequelize);
 * const sar = await SAR.create({
 *   sarNumber: 'SAR-2025-001234',
 *   reportingInstitution: 'First National Bank',
 *   detectionDate: new Date('2025-01-15'),
 *   filingDeadline: new Date('2025-02-14'),
 *   status: 'draft',
 *   subjects: [{ firstName: 'John', lastName: 'Doe', relationship: 'account-holder' }],
 *   suspiciousActivityTypes: [{ activityCode: 'BSA-2', description: 'Structuring' }]
 * });
 * ```
 */
export declare const createSuspiciousActivityReportModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        sarId: string;
        sarNumber: string;
        reportingInstitution: string;
        filingDeadline: Date;
        filingDate: Date | null;
        status: string;
        priorSarNumber: string | null;
        isContinuingActivity: boolean;
        activityBeginDate: Date;
        activityEndDate: Date | null;
        detectionDate: Date;
        subjectType: string;
        subjects: SARSubject[];
        suspiciousActivityTypes: SuspiciousActivityType[];
        totalAmount: number | null;
        currency: string;
        narrative: string;
        supportingDocuments: SupportingDocument[];
        transactionIds: string[];
        accountIds: string[];
        reviewWorkflow: ReviewWorkflowStep[];
        preparedBy: string;
        reviewedBy: string | null;
        approvedBy: string | null;
        bsaOfficerNotified: boolean;
        confidentialityAcknowledged: boolean;
        fincenSubmissionId: string | null;
        fincenAcknowledgment: string | null;
        linkedInvestigationId: string | null;
        riskScore: number;
        qualityScore: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for SAR Alerts with detection and triage tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SARAlert model
 *
 * @example
 * ```typescript
 * const Alert = createSARAlertModel(sequelize);
 * const alert = await Alert.create({
 *   alertId: 'ALERT-2025-5678',
 *   entityId: 'ACCT-123456',
 *   entityType: 'account',
 *   riskScore: 87.5,
 *   alertStatus: 'new',
 *   triggeredConditions: [{ conditionType: 'structuring', severityLevel: 'high' }]
 * });
 * ```
 */
export declare const createSARAlertModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        alertId: string;
        alertDate: Date;
        triggeredConditions: SARTriggeringCondition[];
        entityId: string;
        entityType: string;
        riskScore: number;
        alertStatus: string;
        assignedTo: string | null;
        reviewNotes: string | null;
        disposition: string;
        dispositionDate: Date | null;
        escalationLevel: number;
        sarGenerated: boolean;
        sarId: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Investigation Cases linking to SARs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvestigationCase model
 */
export declare const createInvestigationCaseModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        caseId: string;
        caseNumber: string;
        caseTitle: string;
        caseType: string;
        caseStatus: string;
        openDate: Date;
        closeDate: Date | null;
        assignedInvestigators: string[];
        linkedSARs: string[];
        linkedAlerts: string[];
        subjects: string[];
        accounts: string[];
        transactions: string[];
        findings: string;
        outcome: string;
        actionTaken: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for SAR Confidentiality Tracking with strict access control.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SARConfidentiality model
 */
export declare const createSARConfidentialityModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        sarId: string;
        confidentialityLevel: string;
        accessLog: AccessLogEntry[];
        disclosureProhibited: boolean;
        legalExceptions: string[];
        tipoffProhibition: boolean;
        sharingAuthorizations: SharingAuthorization[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Detects structuring (BSA-2) patterns in transactions.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} threshold - Threshold amount (default: 10000)
 * @param {number} periodDays - Period to analyze in days
 * @returns {SARAlert | null} Alert if structuring detected
 *
 * @example
 * ```typescript
 * const alert = await detectStructuring(recentTransactions, 10000, 7);
 * if (alert) {
 *   console.log(`Structuring detected: ${alert.riskScore}`);
 * }
 * ```
 */
export declare function detectStructuring(transactions: any[], threshold?: number, periodDays?: number): Promise<SARAlert | null>;
/**
 * Detects unusual cash transaction patterns.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} baselineAverage - Normal cash transaction average
 * @returns {SARAlert | null} Alert if unusual pattern detected
 */
export declare function detectUnusualCashActivity(transactions: any[], baselineAverage: number): Promise<SARAlert | null>;
/**
 * Detects rapid movement of funds (layering).
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {number} hourThreshold - Hours to consider rapid
 * @returns {SARAlert | null} Alert if layering detected
 */
export declare function detectRapidFundMovement(transactions: any[], hourThreshold?: number): Promise<SARAlert | null>;
/**
 * Detects transactions with high-risk jurisdictions.
 *
 * @param {any[]} transactions - Transactions to analyze
 * @param {string[]} highRiskCountries - List of high-risk country codes
 * @returns {SARAlert | null} Alert if high-risk jurisdiction activity detected
 */
export declare function detectHighRiskJurisdiction(transactions: any[], highRiskCountries: string[]): Promise<SARAlert | null>;
/**
 * Detects transactions inconsistent with customer profile.
 *
 * @param {any} customer - Customer profile
 * @param {any[]} transactions - Recent transactions
 * @returns {SARAlert | null} Alert if inconsistency detected
 */
export declare function detectInconsistentActivity(customer: any, transactions: any[]): Promise<SARAlert | null>;
/**
 * Aggregates and evaluates multiple triggering conditions.
 *
 * @param {SARAlert[]} alerts - Multiple alerts for same entity
 * @returns {SARAlert} Consolidated alert with combined risk score
 */
export declare function aggregateTriggeringConditions(alerts: SARAlert[]): Promise<SARAlert>;
/**
 * Classifies suspicious activity using FinCEN SAR activity codes.
 *
 * @param {string} activityDescription - Description of activity
 * @param {any} context - Additional context data
 * @returns {SuspiciousActivityType[]} Array of classified activity types
 */
export declare function classifySuspiciousActivity(activityDescription: string, context: any): Promise<SuspiciousActivityType[]>;
/**
 * Determines severity level of suspicious activity.
 *
 * @param {number} riskScore - Risk score from detection
 * @param {number} amount - Total amount involved
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {string} Severity level
 */
export declare function determineSeverityLevel(riskScore: number, amount: number, activityTypes: SuspiciousActivityType[]): string;
/**
 * Maps activity to appropriate investigation category.
 *
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {string} Investigation category
 */
export declare function mapToInvestigationCategory(activityTypes: SuspiciousActivityType[]): string;
/**
 * Generates activity indicators summary for classification.
 *
 * @param {any[]} transactions - Transactions involved
 * @param {any} customer - Customer data
 * @returns {string[]} List of indicators
 */
export declare function generateActivityIndicators(transactions: any[], customer: any): string[];
/**
 * Generates comprehensive SAR narrative with all required elements.
 *
 * @param {SARAlert} alert - Alert triggering SAR
 * @param {any} customer - Customer data
 * @param {any[]} transactions - Related transactions
 * @param {SuspiciousActivityType[]} activityTypes - Classified activities
 * @returns {SARNarrative} Complete narrative
 */
export declare function generateSARNarrative(alert: SARAlert, customer: any, transactions: any[], activityTypes: SuspiciousActivityType[]): Promise<SARNarrative>;
/**
 * Populates FinCEN SAR form (Form 111) with data.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @param {any} institution - Financial institution data
 * @returns {FinCENSARForm} Populated form
 */
export declare function populateFinCENForm(sar: SuspiciousActivityReport, institution: any): Promise<FinCENSARForm>;
/**
 * Validates FinCEN SAR form data for completeness and accuracy.
 *
 * @param {Record<string, any>} formData - Form data to validate
 * @returns {ValidationError[]} Array of validation errors
 */
export declare function validateFinCENForm(formData: Record<string, any>): ValidationError[];
/**
 * Converts SAR data to FinCEN BSA E-Filing XML format.
 *
 * @param {FinCENSARForm} form - Validated form data
 * @returns {string} XML string for submission
 */
export declare function generateFinCENXML(form: FinCENSARForm): string;
/**
 * Validates XML structure before submission.
 *
 * @param {string} xml - XML string
 * @returns {boolean} Whether XML is valid
 */
export declare function validateFinCENXML(xml: string): boolean;
/**
 * Attaches supporting documents to SAR.
 *
 * @param {string} sarId - SAR identifier
 * @param {SupportingDocument[]} documents - Documents to attach
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<number>} Number of documents attached
 */
export declare function attachSupportingDocuments(sarId: string, documents: SupportingDocument[], transaction?: Transaction): Promise<number>;
/**
 * Generates document checklist for SAR review.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @returns {Record<string, boolean>} Checklist of required documents
 */
export declare function generateDocumentChecklist(sar: SuspiciousActivityReport): Record<string, boolean>;
/**
 * Packages all SAR materials for submission.
 *
 * @param {SuspiciousActivityReport} sar - SAR data
 * @param {FinCENSARForm} form - Completed form
 * @returns {Promise<string>} Package reference ID
 */
export declare function packageSARSubmission(sar: SuspiciousActivityReport, form: FinCENSARForm): Promise<string>;
/**
 * Initiates multi-level SAR review workflow.
 *
 * @param {string} sarId - SAR identifier
 * @param {string[]} reviewers - List of reviewers
 * @returns {Promise<ReviewWorkflowStep[]>} Workflow steps
 */
export declare function initiateSARReviewWorkflow(sarId: string, reviewers: string[]): Promise<ReviewWorkflowStep[]>;
/**
 * Advances SAR to next review step.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} reviewerId - Current reviewer
 * @param {string} decision - Review decision
 * @param {string} comments - Review comments
 * @returns {Promise<ReviewWorkflowStep>} Next workflow step
 */
export declare function advanceSARWorkflow(sarId: string, reviewerId: string, decision: 'approve' | 'reject' | 'request-changes', comments?: string): Promise<ReviewWorkflowStep>;
/**
 * Performs quality assurance review of SAR.
 *
 * @param {SuspiciousActivityReport} sar - SAR to review
 * @param {string} reviewerId - Reviewer ID
 * @returns {Promise<SARQualityReview>} Quality review results
 */
export declare function performQualityReview(sar: SuspiciousActivityReport, reviewerId: string): Promise<SARQualityReview>;
/**
 * Approves SAR for filing after all reviews complete.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} approverId - BSA Officer ID
 * @returns {Promise<boolean>} Approval status
 */
export declare function approveSARForFiling(sarId: string, approverId: string): Promise<boolean>;
/**
 * Determines if new SAR should be continuing activity report.
 *
 * @param {string} subjectId - Subject identifier
 * @param {Date} activityDate - New activity date
 * @returns {Promise<SuspiciousActivityReport | null>} Prior SAR if exists
 */
export declare function checkForContinuingActivity(subjectId: string, activityDate: Date): Promise<SuspiciousActivityReport | null>;
/**
 * Creates continuing activity SAR linked to prior SAR.
 *
 * @param {SuspiciousActivityReport} priorSAR - Previous SAR
 * @param {any} newActivity - New suspicious activity data
 * @returns {Promise<ContinuingActivitySAR>} Continuing SAR record
 */
export declare function createContinuingSAR(priorSAR: SuspiciousActivityReport, newActivity: any): Promise<ContinuingActivitySAR>;
/**
 * Tracks continuing activity SAR timeline and updates.
 *
 * @param {string} originalSarId - Original SAR ID
 * @returns {Promise<ContinuingActivitySAR[]>} All continuing SARs
 */
export declare function trackContinuingActivityTimeline(originalSarId: string): Promise<ContinuingActivitySAR[]>;
/**
 * Calculates SAR filing deadlines based on detection date.
 *
 * @param {Date} detectionDate - Date suspicious activity was detected
 * @returns {SARFilingDeadline} Deadline information
 */
export declare function calculateSARDeadline(detectionDate: Date): SARFilingDeadline;
/**
 * Monitors approaching SAR filing deadlines.
 *
 * @param {number} daysThreshold - Number of days to trigger alert
 * @returns {Promise<SARFilingDeadline[]>} SARs with approaching deadlines
 */
export declare function monitorSARDeadlines(daysThreshold?: number): Promise<SARFilingDeadline[]>;
/**
 * Generates deadline compliance report.
 *
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @returns {Promise<any>} Deadline compliance metrics
 */
export declare function generateDeadlineComplianceReport(periodStart: Date, periodEnd: Date): Promise<any>;
/**
 * Notifies BSA Officer of new SAR or critical alert.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} officerId - BSA Officer ID
 * @param {string} notificationType - Type of notification
 * @param {string} urgencyLevel - Urgency level
 * @returns {Promise<BSAOfficerNotification>} Notification record
 */
export declare function notifyBSAOfficer(sarId: string, officerId: string, notificationType: 'new-sar' | 'deadline-approaching' | 'review-required' | 'escalation', urgencyLevel?: 'normal' | 'high' | 'critical'): Promise<BSAOfficerNotification>;
/**
 * Tracks BSA Officer notification acknowledgments.
 *
 * @param {string} notificationId - Notification ID
 * @param {string} response - Officer response
 * @returns {Promise<boolean>} Acknowledgment status
 */
export declare function acknowledgeBSANotification(notificationId: string, response?: string): Promise<boolean>;
/**
 * Generates BSA Officer activity dashboard data.
 *
 * @param {string} officerId - BSA Officer ID
 * @param {Date} periodStart - Dashboard period start
 * @returns {Promise<any>} Dashboard metrics
 */
export declare function generateBSAOfficerDashboard(officerId: string, periodStart: Date): Promise<any>;
/**
 * Logs SAR access with confidentiality tracking.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} userId - User accessing SAR
 * @param {string} accessType - Type of access
 * @param {string} purpose - Purpose of access
 * @returns {Promise<AccessLogEntry>} Access log entry
 */
export declare function logSARAccess(sarId: string, userId: string, accessType: 'view' | 'edit' | 'print' | 'export', purpose: string): Promise<AccessLogEntry>;
/**
 * Enforces SAR confidentiality and tip-off prohibition.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} requestedAction - Action being requested
 * @param {string} userId - User requesting action
 * @returns {Promise<boolean>} Whether action is permitted
 */
export declare function enforceSARConfidentiality(sarId: string, requestedAction: string, userId: string): Promise<boolean>;
/**
 * Manages authorized SAR information sharing.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} recipientAgency - Recipient agency
 * @param {string} legalBasis - Legal basis for sharing
 * @param {string} authorizedBy - User authorizing sharing
 * @returns {Promise<SharingAuthorization>} Sharing authorization
 */
export declare function authorizeSARSharing(sarId: string, recipientAgency: string, legalBasis: string, authorizedBy: string): Promise<SharingAuthorization>;
/**
 * Generates comprehensive SAR metrics for reporting period.
 *
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @returns {Promise<SARMetrics>} SAR metrics
 */
export declare function generateSARMetrics(periodStart: Date, periodEnd: Date): Promise<SARMetrics>;
/**
 * Analyzes SAR filing trends over time.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @param {string} groupBy - Grouping interval (day, week, month)
 * @returns {Promise<TrendData[]>} Trend analysis data
 */
export declare function analyzeSARTrends(periodStart: Date, periodEnd: Date, groupBy?: 'day' | 'week' | 'month'): Promise<TrendData[]>;
/**
 * Calculates SAR quality score metrics.
 *
 * @param {string[]} sarIds - SAR identifiers to analyze
 * @returns {Promise<any>} Quality metrics
 */
export declare function calculateSARQualityMetrics(sarIds: string[]): Promise<any>;
/**
 * Identifies high-risk patterns across multiple SARs.
 *
 * @param {Date} periodStart - Analysis period start
 * @returns {Promise<PatternDetection[]>} Detected patterns
 */
export declare function identifyHighRiskPatterns(periodStart: Date): Promise<PatternDetection[]>;
/**
 * Performs advanced SAR trend analysis with pattern detection.
 *
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {Promise<SARTrendAnalysis>} Trend analysis results
 */
export declare function performSARTrendAnalysis(periodStart: Date, periodEnd: Date): Promise<SARTrendAnalysis>;
/**
 * Detects emerging suspicious activity patterns.
 *
 * @param {SuspiciousActivityReport[]} sars - Recent SARs
 * @returns {Promise<PatternDetection[]>} Detected patterns
 */
export declare function detectEmergingPatterns(sars: SuspiciousActivityReport[]): Promise<PatternDetection[]>;
/**
 * Generates predictive risk alerts based on trends.
 *
 * @param {SARTrendAnalysis} trendAnalysis - Trend analysis results
 * @returns {Promise<SARAlert[]>} Predictive alerts
 */
export declare function generatePredictiveAlerts(trendAnalysis: SARTrendAnalysis): Promise<SARAlert[]>;
/**
 * Submits SAR to FinCEN BSA E-Filing System.
 *
 * @param {string} sarId - SAR identifier
 * @param {FinCENSARForm} form - Validated form
 * @returns {Promise<RegulatorySubmission>} Submission record
 */
export declare function submitToFinCEN(sarId: string, form: FinCENSARForm): Promise<RegulatorySubmission>;
/**
 * Tracks regulatory submission status and acknowledgments.
 *
 * @param {string} submissionId - Submission identifier
 * @returns {Promise<RegulatorySubmission>} Updated submission status
 */
export declare function trackSubmissionStatus(submissionId: string): Promise<RegulatorySubmission>;
/**
 * Handles rejected SAR submissions and resubmission.
 *
 * @param {string} submissionId - Submission identifier
 * @param {string[]} rejectionReasons - Reasons for rejection
 * @returns {Promise<RegulatorySubmission>} Resubmission record
 */
export declare function handleRejectedSubmission(submissionId: string, rejectionReasons: string[]): Promise<RegulatorySubmission>;
/**
 * Links SAR to investigation case for case management.
 *
 * @param {string} sarId - SAR identifier
 * @param {string} caseId - Investigation case ID
 * @returns {Promise<boolean>} Link status
 *
 * @example
 * ```typescript
 * await linkSARToInvestigation('SAR-2025-001', 'CASE-ML-2025-456');
 * ```
 */
export declare function linkSARToInvestigation(sarId: string, caseId: string): Promise<boolean>;
/**
 * NestJS Service example for SAR management.
 *
 * @example
 * ```typescript
 * import { Injectable } from '@nestjs/common';
 * import { InjectModel } from '@nestjs/sequelize';
 * import * as SARKit from './sar-suspicious-activity-reporting-kit';
 *
 * @Injectable()
 * export class SARService {
 *   constructor(
 *     @InjectModel('SuspiciousActivityReport')
 *     private sarModel: typeof SARKit.createSuspiciousActivityReportModel,
 *   ) {}
 *
 *   async createSAR(alertId: string): Promise<any> {
 *     const alert = await this.getAlert(alertId);
 *     const customer = await this.getCustomer(alert.entityId);
 *     const transactions = await this.getTransactions(alert);
 *
 *     const activityTypes = await SARKit.classifySuspiciousActivity(
 *       alert.disposition,
 *       { totalAmount: alert.totalAmount, transactionCount: transactions.length }
 *     );
 *
 *     const narrative = await SARKit.generateSARNarrative(
 *       alert,
 *       customer,
 *       transactions,
 *       activityTypes
 *     );
 *
 *     const sar = await this.sarModel.create({
 *       sarId: `SAR-${Date.now()}`,
 *       sarNumber: `SAR-2025-${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
 *       reportingInstitution: 'First National Bank',
 *       detectionDate: alert.alertDate,
 *       filingDeadline: SARKit.calculateSARDeadline(alert.alertDate).statutoryDeadline,
 *       status: 'draft',
 *       subjects: [customer],
 *       suspiciousActivityTypes: activityTypes,
 *       narrative: narrative.sections.map(s => s.content).join('\n\n'),
 *       transactionIds: transactions.map(t => t.id),
 *       accountIds: [alert.entityId],
 *       preparedBy: 'system'
 *     });
 *
 *     await SARKit.notifyBSAOfficer(sar.sarId, 'bsa-officer-001', 'new-sar', 'high');
 *
 *     return sar;
 *   }
 *
 *   async reviewSAR(sarId: string, reviewerId: string): Promise<any> {
 *     const sar = await this.sarModel.findOne({ where: { sarId } });
 *     const qualityReview = await SARKit.performQualityReview(sar, reviewerId);
 *
 *     if (qualityReview.reviewStatus === 'passed') {
 *       await SARKit.advanceSARWorkflow(sarId, reviewerId, 'approve');
 *     } else {
 *       await SARKit.advanceSARWorkflow(sarId, reviewerId, 'request-changes',
 *         qualityReview.recommendations.join('; ')
 *       );
 *     }
 *
 *     return qualityReview;
 *   }
 *
 *   async fileSAR(sarId: string): Promise<any> {
 *     const sar = await this.sarModel.findOne({ where: { sarId } });
 *     const institution = await this.getInstitution();
 *
 *     const form = await SARKit.populateFinCENForm(sar, institution);
 *
 *     if (form.submissionReady) {
 *       const submission = await SARKit.submitToFinCEN(sarId, form);
 *       await sar.update({
 *         status: 'filed',
 *         filingDate: new Date(),
 *         fincenSubmissionId: submission.submissionId,
 *         fincenAcknowledgment: submission.acknowledgmentNumber
 *       });
 *       return submission;
 *     }
 *
 *     throw new Error('SAR form validation failed');
 *   }
 * }
 * ```
 */
/**
 * NestJS Controller example for SAR endpoints.
 *
 * @example
 * ```typescript
 * import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
 * import { SARService } from './sar.service';
 * import { JwtAuthGuard } from '../auth/jwt-auth.guard';
 * import { RolesGuard } from '../auth/roles.guard';
 * import { Roles } from '../auth/roles.decorator';
 *
 * @Controller('sar')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class SARController {
 *   constructor(private sarService: SARService) {}
 *
 *   @Post('create')
 *   @Roles('aml-analyst', 'bsa-officer')
 *   async createSAR(@Body() data: { alertId: string }) {
 *     return this.sarService.createSAR(data.alertId);
 *   }
 *
 *   @Post(':id/review')
 *   @Roles('senior-analyst', 'bsa-officer')
 *   async reviewSAR(@Param('id') sarId: string, @Body() data: { reviewerId: string }) {
 *     return this.sarService.reviewSAR(sarId, data.reviewerId);
 *   }
 *
 *   @Post(':id/file')
 *   @Roles('bsa-officer')
 *   async fileSAR(@Param('id') sarId: string) {
 *     return this.sarService.fileSAR(sarId);
 *   }
 *
 *   @Get('metrics')
 *   @Roles('bsa-officer', 'compliance-manager')
 *   async getMetrics(@Body() data: { periodStart: Date, periodEnd: Date }) {
 *     const metrics = await SARKit.generateSARMetrics(data.periodStart, data.periodEnd);
 *     return metrics;
 *   }
 *
 *   @Get('deadlines')
 *   @Roles('aml-analyst', 'bsa-officer')
 *   async getDeadlines() {
 *     return this.sarService.monitorDeadlines();
 *   }
 * }
 * ```
 */
declare const _default: {
    createSuspiciousActivityReportModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            sarId: string;
            sarNumber: string;
            reportingInstitution: string;
            filingDeadline: Date;
            filingDate: Date | null;
            status: string;
            priorSarNumber: string | null;
            isContinuingActivity: boolean;
            activityBeginDate: Date;
            activityEndDate: Date | null;
            detectionDate: Date;
            subjectType: string;
            subjects: SARSubject[];
            suspiciousActivityTypes: SuspiciousActivityType[];
            totalAmount: number | null;
            currency: string;
            narrative: string;
            supportingDocuments: SupportingDocument[];
            transactionIds: string[];
            accountIds: string[];
            reviewWorkflow: ReviewWorkflowStep[];
            preparedBy: string;
            reviewedBy: string | null;
            approvedBy: string | null;
            bsaOfficerNotified: boolean;
            confidentialityAcknowledged: boolean;
            fincenSubmissionId: string | null;
            fincenAcknowledgment: string | null;
            linkedInvestigationId: string | null;
            riskScore: number;
            qualityScore: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSARAlertModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            alertId: string;
            alertDate: Date;
            triggeredConditions: SARTriggeringCondition[];
            entityId: string;
            entityType: string;
            riskScore: number;
            alertStatus: string;
            assignedTo: string | null;
            reviewNotes: string | null;
            disposition: string;
            dispositionDate: Date | null;
            escalationLevel: number;
            sarGenerated: boolean;
            sarId: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createInvestigationCaseModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            caseId: string;
            caseNumber: string;
            caseTitle: string;
            caseType: string;
            caseStatus: string;
            openDate: Date;
            closeDate: Date | null;
            assignedInvestigators: string[];
            linkedSARs: string[];
            linkedAlerts: string[];
            subjects: string[];
            accounts: string[];
            transactions: string[];
            findings: string;
            outcome: string;
            actionTaken: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSARConfidentialityModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            sarId: string;
            confidentialityLevel: string;
            accessLog: AccessLogEntry[];
            disclosureProhibited: boolean;
            legalExceptions: string[];
            tipoffProhibition: boolean;
            sharingAuthorizations: SharingAuthorization[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    detectStructuring: typeof detectStructuring;
    detectUnusualCashActivity: typeof detectUnusualCashActivity;
    detectRapidFundMovement: typeof detectRapidFundMovement;
    detectHighRiskJurisdiction: typeof detectHighRiskJurisdiction;
    detectInconsistentActivity: typeof detectInconsistentActivity;
    aggregateTriggeringConditions: typeof aggregateTriggeringConditions;
    classifySuspiciousActivity: typeof classifySuspiciousActivity;
    determineSeverityLevel: typeof determineSeverityLevel;
    mapToInvestigationCategory: typeof mapToInvestigationCategory;
    generateActivityIndicators: typeof generateActivityIndicators;
    generateSARNarrative: typeof generateSARNarrative;
    populateFinCENForm: typeof populateFinCENForm;
    validateFinCENForm: typeof validateFinCENForm;
    generateFinCENXML: typeof generateFinCENXML;
    validateFinCENXML: typeof validateFinCENXML;
    attachSupportingDocuments: typeof attachSupportingDocuments;
    generateDocumentChecklist: typeof generateDocumentChecklist;
    packageSARSubmission: typeof packageSARSubmission;
    initiateSARReviewWorkflow: typeof initiateSARReviewWorkflow;
    advanceSARWorkflow: typeof advanceSARWorkflow;
    performQualityReview: typeof performQualityReview;
    approveSARForFiling: typeof approveSARForFiling;
    checkForContinuingActivity: typeof checkForContinuingActivity;
    createContinuingSAR: typeof createContinuingSAR;
    trackContinuingActivityTimeline: typeof trackContinuingActivityTimeline;
    calculateSARDeadline: typeof calculateSARDeadline;
    monitorSARDeadlines: typeof monitorSARDeadlines;
    generateDeadlineComplianceReport: typeof generateDeadlineComplianceReport;
    notifyBSAOfficer: typeof notifyBSAOfficer;
    acknowledgeBSANotification: typeof acknowledgeBSANotification;
    generateBSAOfficerDashboard: typeof generateBSAOfficerDashboard;
    logSARAccess: typeof logSARAccess;
    enforceSARConfidentiality: typeof enforceSARConfidentiality;
    authorizeSARSharing: typeof authorizeSARSharing;
    generateSARMetrics: typeof generateSARMetrics;
    analyzeSARTrends: typeof analyzeSARTrends;
    calculateSARQualityMetrics: typeof calculateSARQualityMetrics;
    identifyHighRiskPatterns: typeof identifyHighRiskPatterns;
    performSARTrendAnalysis: typeof performSARTrendAnalysis;
    detectEmergingPatterns: typeof detectEmergingPatterns;
    generatePredictiveAlerts: typeof generatePredictiveAlerts;
    submitToFinCEN: typeof submitToFinCEN;
    trackSubmissionStatus: typeof trackSubmissionStatus;
    handleRejectedSubmission: typeof handleRejectedSubmission;
    linkSARToInvestigation: typeof linkSARToInvestigation;
};
export default _default;
//# sourceMappingURL=sar-suspicious-activity-reporting-kit.d.ts.map