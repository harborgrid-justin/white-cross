/**
 * LOC: PRIVILEGE_REVIEW_KIT_001
 * File: /reuse/legal/privilege-review-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal privilege modules
 *   - Document review controllers
 *   - Privilege logging services
 *   - Clawback management services
 *   - Quality control services
 */
import { DynamicModule } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Types of legal privilege
 */
export declare enum PrivilegeType {
    ATTORNEY_CLIENT = "attorney_client",
    WORK_PRODUCT = "work_product",
    COMMON_INTEREST = "common_interest",
    SETTLEMENT_NEGOTIATION = "settlement_negotiation",
    JOINT_DEFENSE = "joint_defense",
    MEDIATION = "mediation",
    ATTORNEY_WORK_PRODUCT = "attorney_work_product",
    SELF_CRITICAL_ANALYSIS = "self_critical_analysis",
    PEER_REVIEW = "peer_review",
    PATIENT_SAFETY_WORK_PRODUCT = "patient_safety_work_product",
    QUALITY_IMPROVEMENT = "quality_improvement",
    CREDENTIALING_PEER_REVIEW = "credentialing_peer_review",
    EXECUTIVE_PRIVILEGE = "executive_privilege",
    DELIBERATIVE_PROCESS = "deliberative_process",
    OTHER = "other"
}
/**
 * Privilege assertion status
 */
export declare enum PrivilegeAssertionStatus {
    PENDING_REVIEW = "pending_review",
    UNDER_REVIEW = "under_review",
    ASSERTED = "asserted",
    CHALLENGED = "challenged",
    DISPUTED = "disputed",
    UPHELD = "upheld",
    OVERRULED = "overruled",
    WAIVED = "waived",
    PARTIALLY_WAIVED = "partially_waived",
    WITHDRAWN = "withdrawn",
    RESOLVED = "resolved"
}
/**
 * Legal basis for privilege claim
 */
export declare enum PrivilegeBasis {
    FEDERAL_RULE_EVIDENCE_501 = "fre_501",
    STATE_ATTORNEY_CLIENT = "state_attorney_client",
    FEDERAL_WORK_PRODUCT = "federal_work_product",
    COMMON_LAW = "common_law",
    STATUTORY = "statutory",
    HIPAA_PATIENT_SAFETY = "hipaa_patient_safety",
    PEER_REVIEW_STATUTE = "peer_review_statute",
    CONTRACTUAL = "contractual",
    PROTECTIVE_ORDER = "protective_order",
    OTHER = "other"
}
/**
 * Clawback request status
 */
export declare enum ClawbackStatus {
    DISCLOSED = "disclosed",
    DETECTED = "detected",
    REQUEST_INITIATED = "request_initiated",
    NOTICE_SENT = "notice_sent",
    RECIPIENT_ACKNOWLEDGED = "recipient_acknowledged",
    DOCUMENTS_RETURNED = "documents_returned",
    DOCUMENTS_DESTROYED = "documents_destroyed",
    REFUSED = "refused",
    LITIGATED = "litigated",
    WAIVED = "waived",
    RESOLVED = "resolved"
}
/**
 * Inadvertent disclosure severity
 */
export declare enum DisclosureSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Quality control review status
 */
export declare enum QCReviewStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    PASSED = "passed",
    FAILED = "failed",
    NEEDS_REMEDIATION = "needs_remediation",
    COMPLETED = "completed"
}
/**
 * Privilege log format types
 */
export declare enum PrivilegeLogFormat {
    STANDARD = "standard",
    DETAILED = "detailed",
    SUMMARY = "summary",
    EXCEL = "excel",
    PDF = "pdf",
    HTML = "html"
}
/**
 * Document confidentiality level
 */
export declare enum ConfidentialityLevel {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    HIGHLY_CONFIDENTIAL = "highly_confidential",
    PRIVILEGED = "privileged",
    ATTORNEYS_EYES_ONLY = "attorneys_eyes_only"
}
export declare const PrivilegeTagSchema: any;
export declare const PrivilegeLogEntrySchema: any;
export declare const ClawbackRequestSchema: any;
export declare const PrivilegeAssertionSchema: any;
export declare const QualityControlSchema: any;
/**
 * Privilege Tag Model - Stores privilege designations for documents
 */
export declare class PrivilegeTag extends Model {
    id: string;
    documentId: string;
    privilegeType: PrivilegeType;
    privilegeBasis: PrivilegeBasis;
    assertionReason: string;
    confidentialityLevel: ConfidentialityLevel;
    reviewerId: string;
    dateAsserted?: Date;
    assertionStatus: PrivilegeAssertionStatus;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    assertions?: PrivilegeAssertion[];
}
/**
 * Privilege Log Model - Formal privilege log entries
 */
export declare class PrivilegeLog extends Model {
    id: string;
    matterId: string;
    documentIdentifier: string;
    documentDate: Date;
    author: string;
    recipients: string[];
    ccRecipients?: string[];
    privilegeType: PrivilegeType;
    description: string;
    basisForClaim: string;
    subjectMatter?: string;
    pageCount?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Privilege Assertion Model - Tracks privilege assertion workflow
 */
export declare class PrivilegeAssertion extends Model {
    id: string;
    privilegeTagId: string;
    assertedBy: string;
    assertionDate: Date;
    rationale: string;
    supportingAuthority?: string;
    status: PrivilegeAssertionStatus;
    challengedBy?: string;
    challengeReason?: string;
    challengeDate?: Date;
    resolvedBy?: string;
    resolution?: string;
    resolutionDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    privilegeTag?: PrivilegeTag;
}
/**
 * Clawback Request Model - Tracks inadvertent disclosure and clawback
 */
export declare class ClawbackRequest extends Model {
    id: string;
    documentId: string;
    disclosureDate: Date;
    detectionDate: Date;
    recipientParty: string;
    severity: DisclosureSeverity;
    status: ClawbackStatus;
    requestedAction: 'return' | 'destroy' | 'both';
    legalBasis: string;
    noticeSentDate?: Date;
    deadlineDate?: Date;
    recipientResponse?: string;
    responseDate?: Date;
    complianceDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export interface PrivilegeTagData {
    documentId: string;
    privilegeType: PrivilegeType;
    privilegeBasis: PrivilegeBasis;
    assertionReason: string;
    confidentialityLevel: ConfidentialityLevel;
    reviewerId: string;
    dateAsserted?: Date;
    notes?: string;
    metadata?: Record<string, any>;
}
export interface PrivilegeLogEntryData {
    matterId: string;
    documentIdentifier: string;
    documentDate: Date;
    author: string;
    recipients: string[];
    ccRecipients?: string[];
    privilegeType: PrivilegeType;
    description: string;
    basisForClaim: string;
    subjectMatter?: string;
    pageCount?: number;
    metadata?: Record<string, any>;
}
export interface ClawbackRequestData {
    documentId: string;
    disclosureDate: Date;
    detectionDate: Date;
    recipientParty: string;
    severity: DisclosureSeverity;
    requestedAction: 'return' | 'destroy' | 'both';
    legalBasis: string;
    deadlineDate?: Date;
    notes?: string;
}
export interface PrivilegeAssertionData {
    privilegeTagId: string;
    assertedBy: string;
    assertionDate: Date;
    rationale: string;
    supportingAuthority?: string;
    metadata?: Record<string, any>;
}
export interface QualityControlMetrics {
    totalReviewed: number;
    accuracyRate: number;
    consistencyRate: number;
    errorsFound: number;
    missingTags: number;
    inconsistentTags: number;
    recommendationsCount: number;
}
export interface PrivilegeLogExportOptions {
    format: PrivilegeLogFormat;
    includeMetadata: boolean;
    redactSensitiveInfo: boolean;
    groupByPrivilegeType: boolean;
    sortBy: 'date' | 'type' | 'identifier';
}
/**
 * Function 1: Create Privilege Tag
 * Tags a document with privilege designation
 */
export declare function createPrivilegeTag(data: PrivilegeTagData, transaction?: Transaction): Promise<PrivilegeTag>;
/**
 * Function 2: Update Privilege Tag
 * Modifies an existing privilege classification
 */
export declare function updatePrivilegeTag(tagId: string, updates: Partial<PrivilegeTagData>, transaction?: Transaction): Promise<PrivilegeTag>;
/**
 * Function 3: Batch Tag Documents
 * Applies privilege tags to multiple documents at once
 */
export declare function batchTagDocuments(documentIds: string[], privilegeData: Omit<PrivilegeTagData, 'documentId'>, transaction?: Transaction): Promise<PrivilegeTag[]>;
/**
 * Function 4: Validate Privilege Claim
 * Validates whether a privilege claim is legally sound
 */
export declare function validatePrivilegeClaim(tagId: string): Promise<{
    valid: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Function 5: Get Privilege Tags by Document
 * Retrieves all privilege tags for a specific document
 */
export declare function getPrivilegeTagsByDocument(documentId: string, includeDeleted?: boolean): Promise<PrivilegeTag[]>;
/**
 * Function 6: Search Privileged Documents
 * Searches for documents by privilege criteria
 */
export declare function searchPrivilegedDocuments(criteria: {
    privilegeType?: PrivilegeType;
    privilegeBasis?: PrivilegeBasis;
    assertionStatus?: PrivilegeAssertionStatus;
    reviewerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}, limit?: number, offset?: number): Promise<{
    tags: PrivilegeTag[];
    total: number;
}>;
/**
 * Function 7: Remove Privilege Tag
 * Removes privilege designation from a document
 */
export declare function removePrivilegeTag(tagId: string, reason: string, removedBy: string, transaction?: Transaction): Promise<void>;
/**
 * Function 8: Bulk Privilege Review
 * Performs mass privilege review with status updates
 */
export declare function bulkPrivilegeReview(tagIds: string[], newStatus: PrivilegeAssertionStatus, reviewerId: string, notes?: string, transaction?: Transaction): Promise<{
    updated: number;
    failed: string[];
}>;
/**
 * Function 9: Generate Privilege Log
 * Creates comprehensive privilege log for matter
 */
export declare function generatePrivilegeLog(matterId: string, options?: Partial<PrivilegeLogExportOptions>): Promise<PrivilegeLog[]>;
/**
 * Function 10: Add Privilege Log Entry
 * Adds a single entry to the privilege log
 */
export declare function addPrivilegeLogEntry(data: PrivilegeLogEntryData, transaction?: Transaction): Promise<PrivilegeLog>;
/**
 * Function 11: Format Privilege Log Export
 * Formats privilege log for export in various formats
 */
export declare function formatPrivilegeLogExport(matterId: string, format?: PrivilegeLogFormat, options?: Partial<PrivilegeLogExportOptions>): Promise<string | Buffer>;
/**
 * Function 12: Validate Privilege Log Completeness
 * Checks privilege log for missing or incomplete entries
 */
export declare function validatePrivilegeLogCompleteness(matterId: string): Promise<{
    complete: boolean;
    issues: string[];
    missingFields: Array<{
        entryId: string;
        fields: string[];
    }>;
}>;
/**
 * Function 13: Group Privilege Log by Type
 * Organizes privilege log entries by privilege type
 */
export declare function groupPrivilegeLogByType(matterId: string): Promise<Map<PrivilegeType, PrivilegeLog[]>>;
/**
 * Function 14: Redact Privilege Log Information
 * Redacts sensitive information from privilege log
 */
export declare function redactPrivilegeLogInfo(logId: string, redactionLevel: 'minimal' | 'moderate' | 'full'): Promise<Partial<PrivilegeLog>>;
/**
 * Function 15: Update Privilege Log Entry
 * Modifies an existing privilege log entry
 */
export declare function updatePrivilegeLogEntry(logId: string, updates: Partial<PrivilegeLogEntryData>, transaction?: Transaction): Promise<PrivilegeLog>;
/**
 * Function 16: Create Clawback Request
 * Initiates a clawback request for inadvertently disclosed document
 */
export declare function createClawbackRequest(data: ClawbackRequestData, transaction?: Transaction): Promise<ClawbackRequest>;
/**
 * Function 17: Process Inadvertent Disclosure
 * Handles discovery of inadvertent privileged disclosure
 */
export declare function processInadvertentDisclosure(documentId: string, disclosureDetails: {
    disclosureDate: Date;
    recipientParty: string;
    disclosureMethod: string;
    discoveredBy: string;
}, transaction?: Transaction): Promise<{
    clawbackRequest: ClawbackRequest;
    severity: DisclosureSeverity;
    recommendedActions: string[];
}>;
/**
 * Function 18: Validate Clawback Timeliness
 * Checks if clawback request was made within reasonable time
 */
export declare function validateClawbackTimeliness(requestId: string): Promise<{
    timely: boolean;
    daysElapsed: number;
    assessment: string;
}>;
/**
 * Function 19: Generate Clawback Notice
 * Creates formal clawback notice letter
 */
export declare function generateClawbackNotice(requestId: string, additionalTerms?: string[]): Promise<string>;
/**
 * Function 20: Track Clawback Compliance
 * Monitors recipient compliance with clawback request
 */
export declare function trackClawbackCompliance(requestId: string, transaction?: Transaction): Promise<{
    status: ClawbackStatus;
    compliant: boolean;
    overdue: boolean;
    daysUntilDeadline: number;
    followUpActions: string[];
}>;
/**
 * Function 21: Close Clawback Request
 * Finalizes clawback request after resolution
 */
export declare function closeClawbackRequest(requestId: string, resolution: {
    status: ClawbackStatus;
    recipientResponse?: string;
    complianceDate?: Date;
    notes?: string;
}, transaction?: Transaction): Promise<ClawbackRequest>;
/**
 * Function 22: Initiate Privilege Assertion
 * Starts formal privilege assertion process
 */
export declare function initiatePrivilegeAssertion(data: PrivilegeAssertionData, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 23: Assign Privilege Reviewer
 * Assigns reviewer to privilege assertion
 */
export declare function assignPrivilegeReviewer(assertionId: string, reviewerId: string, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 24: Submit Privilege Challenge
 * Challenges an asserted privilege claim
 */
export declare function submitPrivilegeChallenge(assertionId: string, challengeData: {
    challengedBy: string;
    challengeReason: string;
    supportingArguments?: string;
}, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 25: Resolve Privilege Dispute
 * Resolves disputed privilege assertion
 */
export declare function resolvePrivilegeDispute(assertionId: string, resolution: {
    resolvedBy: string;
    decision: 'upheld' | 'overruled' | 'modified';
    resolutionDetails: string;
    modifiedPrivilegeType?: PrivilegeType;
}, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 26: Escalate Privilege Issue
 * Escalates privilege assertion to senior counsel
 */
export declare function escalatePrivilegeIssue(assertionId: string, escalationData: {
    escalatedBy: string;
    escalatedTo: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
}, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 27: Document Assertion Rationale
 * Adds detailed rationale to privilege assertion
 */
export declare function documentAssertionRationale(assertionId: string, additionalRationale: {
    legalAnalysis: string;
    factualBasis: string;
    caseAuthority?: string[];
    riskAssessment?: string;
}, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 28: Track Assertion Status
 * Monitors privilege assertion workflow status
 */
export declare function trackAssertionStatus(assertionId: string): Promise<{
    assertion: PrivilegeAssertion;
    timeline: Array<{
        event: string;
        date: Date;
        actor?: string;
    }>;
    nextSteps: string[];
}>;
/**
 * Function 29: Finalize Privilege Assertion
 * Completes privilege assertion workflow
 */
export declare function finalizePrivilegeAssertion(assertionId: string, finalDecision: {
    status: PrivilegeAssertionStatus;
    finalNotes?: string;
}, transaction?: Transaction): Promise<PrivilegeAssertion>;
/**
 * Function 30: Perform Quality Control Sample
 * Conducts QC sampling of privilege review
 */
export declare function performQualityControlSample(reviewBatchId: string, sampleSize: number, reviewerId: string): Promise<{
    sampleTags: PrivilegeTag[];
    reviewInstructions: string[];
}>;
/**
 * Function 31: Validate Privilege Consistency
 * Checks for consistent privilege tagging across similar documents
 */
export declare function validatePrivilegeConsistency(documentIds: string[]): Promise<{
    consistent: boolean;
    inconsistencies: Array<{
        documentId: string;
        issue: string;
        recommendation: string;
    }>;
    consistencyScore: number;
}>;
/**
 * Function 32: Identify Privilege Gaps
 * Finds documents that may be missing privilege tags
 */
export declare function identifyPrivilegeGaps(documentIds: string[], criteria: {
    authorPattern?: RegExp;
    recipientPattern?: RegExp;
    subjectPattern?: RegExp;
    dateRange?: {
        from: Date;
        to: Date;
    };
}): Promise<{
    potentialGaps: Array<{
        documentId: string;
        reason: string;
        confidence: number;
    }>;
    reviewRecommendations: string[];
}>;
/**
 * Function 33: Generate QC Metrics
 * Creates quality control metrics report
 */
export declare function generateQCMetrics(reviewBatchId: string, qcResults: {
    reviewedTags: string[];
    errors: Array<{
        tagId: string;
        errorType: string;
        severity: 'low' | 'medium' | 'high';
    }>;
    corrections: number;
}): Promise<QualityControlMetrics>;
/**
 * Function 34: Flag Inconsistent Privilege
 * Flags privilege tags that appear inconsistent
 */
export declare function flagInconsistentPrivilege(tagId: string, inconsistencyDetails: {
    flaggedBy: string;
    issueType: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestedCorrection?: string;
}, transaction?: Transaction): Promise<PrivilegeTag>;
/**
 * Function 35: Review Privilege Accuracy
 * Conducts accuracy review of privilege determinations
 */
export declare function reviewPrivilegeAccuracy(tagIds: string[], reviewerId: string): Promise<{
    accurate: number;
    inaccurate: number;
    needsReview: number;
    accuracyRate: number;
    issues: Array<{
        tagId: string;
        issue: string;
        recommendation: string;
    }>;
}>;
/**
 * Function 36: Generate Privilege Statistics
 * Creates statistical overview of privilege review
 */
export declare function generatePrivilegeStatistics(matterId?: string, dateRange?: {
    from: Date;
    to: Date;
}): Promise<{
    totalPrivilegedDocuments: number;
    byPrivilegeType: Record<PrivilegeType, number>;
    byConfidentialityLevel: Record<ConfidentialityLevel, number>;
    byStatus: Record<PrivilegeAssertionStatus, number>;
    totalClawbacks: number;
    activeClawbacks: number;
}>;
/**
 * Function 37: Export Privilege Review Data
 * Exports comprehensive privilege review data
 */
export declare function exportPrivilegeReviewData(matterId: string, format?: 'json' | 'csv' | 'excel'): Promise<string | Buffer>;
/**
 * Function 38: Calculate Privilege Review Progress
 * Calculates review completion percentage
 */
export declare function calculatePrivilegeReviewProgress(reviewBatchId: string): Promise<{
    totalDocuments: number;
    reviewedDocuments: number;
    privilegedDocuments: number;
    nonPrivilegedDocuments: number;
    pendingReview: number;
    completionPercentage: number;
}>;
/**
 * Function 39: Detect Privilege Waiver Risks
 * Identifies potential privilege waiver scenarios
 */
export declare function detectPrivilegeWaiverRisks(documentId: string): Promise<{
    waiverRisks: Array<{
        risk: string;
        severity: 'low' | 'medium' | 'high';
        mitigation: string;
    }>;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
}>;
/**
 * Function 40: Generate Privilege Review Report
 * Creates comprehensive privilege review report
 */
export declare function generatePrivilegeReviewReport(matterId: string, includeDetails?: boolean): Promise<{
    summary: {
        totalDocuments: number;
        privilegedCount: number;
        privilegeRate: number;
        assertionsPending: number;
        assertionsChallenged: number;
        clawbackRequests: number;
    };
    details?: {
        privilegeBreakdown: Record<PrivilegeType, number>;
        qualityMetrics: QualityControlMetrics | null;
        topIssues: string[];
    };
    recommendations: string[];
}>;
/**
 * Function 41: Validate FRE 502 Compliance
 * Validates compliance with Federal Rule of Evidence 502
 */
export declare function validateFRE502Compliance(clawbackRequestId: string): Promise<{
    compliant: boolean;
    factors: Array<{
        factor: string;
        satisfied: boolean;
        notes: string;
    }>;
    recommendation: string;
}>;
/**
 * Function 42: Archive Completed Privilege Review
 * Archives completed privilege review with full audit trail
 */
export declare function archiveCompletedPrivilegeReview(reviewBatchId: string, archiveMetadata: {
    completedBy: string;
    finalReport?: string;
    retentionPeriod?: number;
}, transaction?: Transaction): Promise<{
    archived: boolean;
    archiveId: string;
    archiveSummary: {
        totalDocuments: number;
        privilegedDocuments: number;
        assertions: number;
        clawbacks: number;
        archiveDate: Date;
    };
}>;
/**
 * Privilege Review Service
 * Main service for privilege review operations
 */
export declare class PrivilegeReviewService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: typeof Model);
    /**
     * Create privilege tag with validation
     */
    createTag(data: PrivilegeTagData): Promise<PrivilegeTag>;
    /**
     * Batch tag multiple documents
     */
    batchTag(documentIds: string[], privilegeData: Omit<PrivilegeTagData, 'documentId'>): Promise<PrivilegeTag[]>;
    /**
     * Generate privilege log for matter
     */
    generateLog(matterId: string): Promise<PrivilegeLog[]>;
    /**
     * Process inadvertent disclosure
     */
    handleDisclosure(documentId: string, disclosureDetails: any): Promise<any>;
}
/**
 * Clawback Management Service
 * Service for clawback request operations
 */
export declare class ClawbackManagementService {
    private readonly logger;
    /**
     * Create clawback request
     */
    createRequest(data: ClawbackRequestData): Promise<ClawbackRequest>;
    /**
     * Generate clawback notice
     */
    generateNotice(requestId: string): Promise<string>;
    /**
     * Track compliance
     */
    trackCompliance(requestId: string): Promise<any>;
}
/**
 * Privilege Log Service
 * Service for privilege log operations
 */
export declare class PrivilegeLogService {
    private readonly logger;
    /**
     * Add log entry
     */
    addEntry(data: PrivilegeLogEntryData): Promise<PrivilegeLog>;
    /**
     * Export privilege log
     */
    exportLog(matterId: string, format: PrivilegeLogFormat): Promise<string | Buffer>;
    /**
     * Validate completeness
     */
    validateCompleteness(matterId: string): Promise<any>;
}
export declare class PrivilegeReviewModule {
    static forRoot(): DynamicModule;
}
declare const _default: {
    PrivilegeTag: typeof PrivilegeTag;
    PrivilegeLog: typeof PrivilegeLog;
    PrivilegeAssertion: typeof PrivilegeAssertion;
    ClawbackRequest: typeof ClawbackRequest;
    PrivilegeReviewService: typeof PrivilegeReviewService;
    ClawbackManagementService: typeof ClawbackManagementService;
    PrivilegeLogService: typeof PrivilegeLogService;
    createPrivilegeTag: typeof createPrivilegeTag;
    updatePrivilegeTag: typeof updatePrivilegeTag;
    batchTagDocuments: typeof batchTagDocuments;
    validatePrivilegeClaim: typeof validatePrivilegeClaim;
    getPrivilegeTagsByDocument: typeof getPrivilegeTagsByDocument;
    searchPrivilegedDocuments: typeof searchPrivilegedDocuments;
    removePrivilegeTag: typeof removePrivilegeTag;
    bulkPrivilegeReview: typeof bulkPrivilegeReview;
    generatePrivilegeLog: typeof generatePrivilegeLog;
    addPrivilegeLogEntry: typeof addPrivilegeLogEntry;
    formatPrivilegeLogExport: typeof formatPrivilegeLogExport;
    validatePrivilegeLogCompleteness: typeof validatePrivilegeLogCompleteness;
    groupPrivilegeLogByType: typeof groupPrivilegeLogByType;
    redactPrivilegeLogInfo: typeof redactPrivilegeLogInfo;
    updatePrivilegeLogEntry: typeof updatePrivilegeLogEntry;
    createClawbackRequest: typeof createClawbackRequest;
    processInadvertentDisclosure: typeof processInadvertentDisclosure;
    validateClawbackTimeliness: typeof validateClawbackTimeliness;
    generateClawbackNotice: typeof generateClawbackNotice;
    trackClawbackCompliance: typeof trackClawbackCompliance;
    closeClawbackRequest: typeof closeClawbackRequest;
    initiatePrivilegeAssertion: typeof initiatePrivilegeAssertion;
    assignPrivilegeReviewer: typeof assignPrivilegeReviewer;
    submitPrivilegeChallenge: typeof submitPrivilegeChallenge;
    resolvePrivilegeDispute: typeof resolvePrivilegeDispute;
    escalatePrivilegeIssue: typeof escalatePrivilegeIssue;
    documentAssertionRationale: typeof documentAssertionRationale;
    trackAssertionStatus: typeof trackAssertionStatus;
    finalizePrivilegeAssertion: typeof finalizePrivilegeAssertion;
    performQualityControlSample: typeof performQualityControlSample;
    validatePrivilegeConsistency: typeof validatePrivilegeConsistency;
    identifyPrivilegeGaps: typeof identifyPrivilegeGaps;
    generateQCMetrics: typeof generateQCMetrics;
    flagInconsistentPrivilege: typeof flagInconsistentPrivilege;
    reviewPrivilegeAccuracy: typeof reviewPrivilegeAccuracy;
    generatePrivilegeStatistics: typeof generatePrivilegeStatistics;
    exportPrivilegeReviewData: typeof exportPrivilegeReviewData;
    calculatePrivilegeReviewProgress: typeof calculatePrivilegeReviewProgress;
    detectPrivilegeWaiverRisks: typeof detectPrivilegeWaiverRisks;
    generatePrivilegeReviewReport: typeof generatePrivilegeReviewReport;
    validateFRE502Compliance: typeof validateFRE502Compliance;
    archiveCompletedPrivilegeReview: typeof archiveCompletedPrivilegeReview;
    PrivilegeReviewModule: typeof PrivilegeReviewModule;
};
export default _default;
//# sourceMappingURL=privilege-review-kit.d.ts.map