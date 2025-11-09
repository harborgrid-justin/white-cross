/**
 * LOC: AUDIT_TRANSPARENCY_TRAIL_KIT_001
 * File: /reuse/government/audit-transparency-trail-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - Transparency portal services
 *   - Public records management
 *   - FOIA request processing
 *   - Change tracking services
 *   - Data access monitoring
 */
/**
 * Comprehensive audit log entry
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    eventType: AuditEventType;
    userId: string;
    userName?: string;
    userRole?: string;
    departmentId?: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    resourceType: string;
    changes?: ChangeRecord[];
    beforeState?: any;
    afterState?: any;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    status: AuditStatus;
    severity: AuditSeverity;
    category: AuditCategory;
    tags?: string[];
    publiclyVisible: boolean;
    retentionYears: number;
    hash: string;
    chainHash?: string;
}
/**
 * Audit event types
 */
export declare enum AuditEventType {
    USER_ACTION = "USER_ACTION",
    SYSTEM_EVENT = "SYSTEM_EVENT",
    DATA_ACCESS = "DATA_ACCESS",
    DATA_MODIFICATION = "DATA_MODIFICATION",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    SECURITY = "SECURITY",
    COMPLIANCE = "COMPLIANCE",
    FINANCIAL = "FINANCIAL",
    PUBLIC_REQUEST = "PUBLIC_REQUEST"
}
/**
 * Audit actions
 */
export declare enum AuditAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    SEARCH = "SEARCH",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    DOWNLOAD = "DOWNLOAD",
    PRINT = "PRINT",
    SHARE = "SHARE",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    SUBMIT = "SUBMIT",
    REVIEW = "REVIEW",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ACCESS_GRANTED = "ACCESS_GRANTED",
    ACCESS_DENIED = "ACCESS_DENIED",
    PERMISSION_CHANGED = "PERMISSION_CHANGED",
    CONFIG_CHANGED = "CONFIG_CHANGED"
}
/**
 * Audit status
 */
export declare enum AuditStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    PARTIAL = "PARTIAL",
    PENDING = "PENDING",
    ERROR = "ERROR"
}
/**
 * Audit severity levels
 */
export declare enum AuditSeverity {
    INFO = "INFO",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Audit categories
 */
export declare enum AuditCategory {
    ACCESS_CONTROL = "ACCESS_CONTROL",
    DATA_MANAGEMENT = "DATA_MANAGEMENT",
    FINANCIAL_TRANSACTION = "FINANCIAL_TRANSACTION",
    SYSTEM_ADMINISTRATION = "SYSTEM_ADMINISTRATION",
    SECURITY_INCIDENT = "SECURITY_INCIDENT",
    POLICY_COMPLIANCE = "POLICY_COMPLIANCE",
    PUBLIC_DISCLOSURE = "PUBLIC_DISCLOSURE",
    RECORDS_MANAGEMENT = "RECORDS_MANAGEMENT"
}
/**
 * Change record structure
 */
export interface ChangeRecord {
    field: string;
    fieldLabel?: string;
    oldValue: any;
    newValue: any;
    dataType: string;
    timestamp: Date;
    changeReason?: string;
    approvedBy?: string;
}
/**
 * Change history tracking
 */
export interface ChangeHistoryEntry {
    id: string;
    entityType: string;
    entityId: string;
    version: number;
    changeDate: Date;
    changedBy: string;
    changeType: ChangeType;
    changes: ChangeRecord[];
    snapshot?: any;
    comment?: string;
    reviewedBy?: string;
    reviewDate?: Date;
    publiclyVisible: boolean;
    metadata?: Record<string, any>;
}
/**
 * Change types
 */
export declare enum ChangeType {
    CREATED = "CREATED",
    MODIFIED = "MODIFIED",
    DELETED = "DELETED",
    RESTORED = "RESTORED",
    ARCHIVED = "ARCHIVED",
    MERGED = "MERGED",
    SPLIT = "SPLIT"
}
/**
 * User activity monitoring
 */
export interface UserActivityLog {
    id: string;
    userId: string;
    userName: string;
    sessionId: string;
    activityType: ActivityType;
    activityDescription: string;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    resourcesAccessed: string[];
    actionsPerformed: number;
    ipAddress: string;
    deviceInfo?: string;
    location?: string;
    anomalyScore?: number;
    flaggedForReview: boolean;
    metadata?: Record<string, any>;
}
/**
 * Activity types
 */
export declare enum ActivityType {
    SESSION = "SESSION",
    TRANSACTION = "TRANSACTION",
    QUERY = "QUERY",
    REPORT_GENERATION = "REPORT_GENERATION",
    DATA_ENTRY = "DATA_ENTRY",
    WORKFLOW = "WORKFLOW",
    ADMINISTRATION = "ADMINISTRATION"
}
/**
 * Transaction audit trail
 */
export interface TransactionAuditTrail {
    id: string;
    transactionId: string;
    transactionType: string;
    initiatedBy: string;
    initiatedAt: Date;
    completedAt?: Date;
    status: TransactionStatus;
    steps: TransactionStep[];
    totalAmount?: number;
    currency?: string;
    approvers?: string[];
    approvalChain?: ApprovalRecord[];
    relatedTransactions?: string[];
    reversalOf?: string;
    publicRecord: boolean;
    metadata?: Record<string, any>;
}
/**
 * Transaction status
 */
export declare enum TransactionStatus {
    INITIATED = "INITIATED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REVERSED = "REVERSED",
    CANCELLED = "CANCELLED"
}
/**
 * Transaction step
 */
export interface TransactionStep {
    stepNumber: number;
    stepName: string;
    timestamp: Date;
    performedBy: string;
    status: 'pending' | 'completed' | 'failed' | 'skipped';
    details?: any;
    duration?: number;
}
/**
 * Approval record
 */
export interface ApprovalRecord {
    approverLevel: number;
    approverId: string;
    approverName: string;
    decision: 'approved' | 'rejected' | 'pending';
    timestamp?: Date;
    comments?: string;
    delegatedFrom?: string;
}
/**
 * Data access logging
 */
export interface DataAccessLog {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    accessType: AccessType;
    dataCategory: string;
    dataClassification: DataClassification;
    recordsAccessed: number;
    specificRecordIds?: string[];
    accessPurpose?: string;
    legalBasis?: string;
    approved: boolean;
    approvedBy?: string;
    accessDuration?: number;
    dataExported: boolean;
    exportFormat?: string;
    sensitivityScore: number;
    metadata?: Record<string, any>;
}
/**
 * Access types
 */
export declare enum AccessType {
    VIEW = "VIEW",
    DOWNLOAD = "DOWNLOAD",
    MODIFY = "MODIFY",
    DELETE = "DELETE",
    BULK_ACCESS = "BULK_ACCESS",
    QUERY = "QUERY",
    EXPORT = "EXPORT",
    SHARE = "SHARE"
}
/**
 * Data classification levels
 */
export declare enum DataClassification {
    PUBLIC = "PUBLIC",
    INTERNAL = "INTERNAL",
    CONFIDENTIAL = "CONFIDENTIAL",
    RESTRICTED = "RESTRICTED",
    SECRET = "SECRET"
}
/**
 * Transparency portal record
 */
export interface TransparencyRecord {
    id: string;
    recordType: TransparencyRecordType;
    title: string;
    description: string;
    publishDate: Date;
    lastUpdated: Date;
    fiscalYear?: string;
    department: string;
    category: string;
    data: any;
    attachments?: string[];
    format: RecordFormat;
    accessLevel: AccessLevel;
    downloadCount: number;
    viewCount: number;
    tags: string[];
    relatedRecords?: string[];
    dataQualityScore?: number;
    metadata?: Record<string, any>;
}
/**
 * Transparency record types
 */
export declare enum TransparencyRecordType {
    BUDGET = "BUDGET",
    EXPENDITURE = "EXPENDITURE",
    CONTRACT = "CONTRACT",
    GRANT = "GRANT",
    SALARY = "SALARY",
    MEETING_MINUTES = "MEETING_MINUTES",
    DECISION = "DECISION",
    POLICY = "POLICY",
    PERFORMANCE_METRIC = "PERFORMANCE_METRIC",
    STATISTICAL_REPORT = "STATISTICAL_REPORT"
}
/**
 * Record formats
 */
export declare enum RecordFormat {
    JSON = "JSON",
    XML = "XML",
    CSV = "CSV",
    PDF = "PDF",
    HTML = "HTML",
    EXCEL = "EXCEL"
}
/**
 * Access levels
 */
export declare enum AccessLevel {
    PUBLIC = "PUBLIC",
    REGISTERED_USERS = "REGISTERED_USERS",
    GOVERNMENT_ONLY = "GOVERNMENT_ONLY",
    RESTRICTED = "RESTRICTED"
}
/**
 * Public records management
 */
export interface PublicRecord {
    id: string;
    recordNumber: string;
    title: string;
    description: string;
    recordType: string;
    createdDate: Date;
    modifiedDate: Date;
    retentionSchedule: string;
    retentionYears: number;
    dispositionDate?: Date;
    legalHold: boolean;
    archiveStatus: ArchiveStatus;
    archiveLocation?: string;
    format: RecordFormat;
    sizeBytes: number;
    checksum: string;
    relatedRecords?: string[];
    accessRestrictions?: string;
    publiclyAvailable: boolean;
    redactionRequired: boolean;
    metadata?: Record<string, any>;
}
/**
 * Archive status
 */
export declare enum ArchiveStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
    SCHEDULED_FOR_DISPOSAL = "SCHEDULED_FOR_DISPOSAL",
    PERMANENTLY_RETAINED = "PERMANENTLY_RETAINED",
    DISPOSED = "DISPOSED"
}
/**
 * FOIA request tracking
 */
export interface FOIARequest {
    id: string;
    requestNumber: string;
    requestDate: Date;
    requesterName: string;
    requesterEmail: string;
    requesterOrganization?: string;
    requestDescription: string;
    requestCategory: FOIACategory;
    priority: RequestPriority;
    status: FOIAStatus;
    assignedTo?: string;
    dueDate: Date;
    extensions?: RequestExtension[];
    estimatedPages?: number;
    estimatedCost?: number;
    feesPaid?: number;
    processingTrack: ProcessingTrack;
    recordsIdentified?: number;
    recordsProvided?: number;
    exemptionsApplied?: FOIAExemption[];
    response?: string;
    responseDate?: Date;
    closedDate?: Date;
    appealFiled: boolean;
    appealDate?: Date;
    publicationRequired: boolean;
    metadata?: Record<string, any>;
}
/**
 * FOIA categories
 */
export declare enum FOIACategory {
    COMMERCIAL = "COMMERCIAL",
    EDUCATIONAL = "EDUCATIONAL",
    MEDIA = "MEDIA",
    PUBLIC_INTEREST = "PUBLIC_INTEREST",
    OTHER = "OTHER"
}
/**
 * Request priority
 */
export declare enum RequestPriority {
    EXPEDITED = "EXPEDITED",
    STANDARD = "STANDARD",
    COMPLEX = "COMPLEX"
}
/**
 * FOIA status
 */
export declare enum FOIAStatus {
    RECEIVED = "RECEIVED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    IN_REVIEW = "IN_REVIEW",
    PROCESSING = "PROCESSING",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    AWAITING_PAYMENT = "AWAITING_PAYMENT",
    READY_FOR_RELEASE = "READY_FOR_RELEASE",
    PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
    FULFILLED = "FULFILLED",
    DENIED = "DENIED",
    NO_RECORDS = "NO_RECORDS",
    WITHDRAWN = "WITHDRAWN"
}
/**
 * Processing track
 */
export declare enum ProcessingTrack {
    SIMPLE = "SIMPLE",
    COMPLEX = "COMPLEX",
    EXPEDITED = "EXPEDITED"
}
/**
 * Request extension
 */
export interface RequestExtension {
    requestedDate: Date;
    approvedDate?: Date;
    additionalDays: number;
    reason: string;
    newDueDate: Date;
}
/**
 * FOIA exemptions
 */
export declare enum FOIAExemption {
    EXEMPTION_1 = "EXEMPTION_1",// National security
    EXEMPTION_2 = "EXEMPTION_2",// Internal personnel rules
    EXEMPTION_3 = "EXEMPTION_3",// Statutory exemption
    EXEMPTION_4 = "EXEMPTION_4",// Trade secrets
    EXEMPTION_5 = "EXEMPTION_5",// Deliberative process
    EXEMPTION_6 = "EXEMPTION_6",// Personal privacy
    EXEMPTION_7 = "EXEMPTION_7",// Law enforcement
    EXEMPTION_8 = "EXEMPTION_8",// Financial institutions
    EXEMPTION_9 = "EXEMPTION_9"
}
/**
 * Audit report generation
 */
export interface AuditReport {
    id: string;
    reportType: AuditReportType;
    title: string;
    reportPeriodStart: Date;
    reportPeriodEnd: Date;
    generatedDate: Date;
    generatedBy: string;
    scope: string[];
    filters: AuditReportFilters;
    summary: AuditReportSummary;
    findings: AuditFinding[];
    recommendations: string[];
    data: any;
    format: RecordFormat;
    confidentialityLevel: DataClassification;
    distributionList?: string[];
    metadata?: Record<string, any>;
}
/**
 * Audit report types
 */
export declare enum AuditReportType {
    ACCESS_AUDIT = "ACCESS_AUDIT",
    CHANGE_AUDIT = "CHANGE_AUDIT",
    TRANSACTION_AUDIT = "TRANSACTION_AUDIT",
    SECURITY_AUDIT = "SECURITY_AUDIT",
    COMPLIANCE_AUDIT = "COMPLIANCE_AUDIT",
    USER_ACTIVITY = "USER_ACTIVITY",
    DATA_ACCESS = "DATA_ACCESS",
    CUSTOM = "CUSTOM"
}
/**
 * Audit report filters
 */
export interface AuditReportFilters {
    userIds?: string[];
    departments?: string[];
    eventTypes?: AuditEventType[];
    actions?: AuditAction[];
    severities?: AuditSeverity[];
    categories?: AuditCategory[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    resourceTypes?: string[];
    tags?: string[];
}
/**
 * Audit report summary
 */
export interface AuditReportSummary {
    totalEvents: number;
    uniqueUsers: number;
    successfulEvents: number;
    failedEvents: number;
    criticalEvents: number;
    topUsers: Array<{
        userId: string;
        eventCount: number;
    }>;
    topActions: Array<{
        action: string;
        count: number;
    }>;
    timeDistribution: Record<string, number>;
}
/**
 * Audit finding
 */
export interface AuditFinding {
    findingId: string;
    severity: AuditSeverity;
    category: string;
    title: string;
    description: string;
    evidence: string[];
    affectedResources: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
    status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}
/**
 * Audit evidence collection
 */
export interface AuditEvidence {
    id: string;
    evidenceType: EvidenceType;
    collectionDate: Date;
    collectedBy: string;
    relatedAuditId?: string;
    relatedFindingId?: string;
    description: string;
    source: string;
    dataSnapshot: any;
    attachments?: string[];
    hash: string;
    chainOfCustody: CustodyRecord[];
    verified: boolean;
    verifiedBy?: string;
    verificationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Evidence types
 */
export declare enum EvidenceType {
    LOG_ENTRY = "LOG_ENTRY",
    SCREENSHOT = "SCREENSHOT",
    DOCUMENT = "DOCUMENT",
    DATABASE_RECORD = "DATABASE_RECORD",
    SYSTEM_OUTPUT = "SYSTEM_OUTPUT",
    USER_STATEMENT = "USER_STATEMENT",
    CONFIGURATION = "CONFIGURATION",
    EMAIL = "EMAIL"
}
/**
 * Chain of custody record
 */
export interface CustodyRecord {
    timestamp: Date;
    custodian: string;
    action: 'collected' | 'transferred' | 'accessed' | 'analyzed' | 'stored';
    location?: string;
    notes?: string;
}
/**
 * Transparency reporting metrics
 */
export interface TransparencyMetrics {
    totalPublicRecords: number;
    recordsPublishedThisMonth: number;
    totalDownloads: number;
    totalViews: number;
    openFOIARequests: number;
    averageFOIAResponseDays: number;
    foiaFulfillmentRate: number;
    mostAccessedRecords: Array<{
        recordId: string;
        title: string;
        accessCount: number;
    }>;
    categoryBreakdown: Record<string, number>;
    monthlyTrends?: TransparencyTrend[];
}
/**
 * Transparency trend
 */
export interface TransparencyTrend {
    period: string;
    recordsPublished: number;
    foiaRequests: number;
    averageResponseDays: number;
    publicEngagement: number;
}
/**
 * Creates a comprehensive audit log entry
 */
export declare function createAuditLogEntry(params: {
    eventType: AuditEventType;
    userId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    resourceType: string;
    changes?: ChangeRecord[];
    beforeState?: any;
    afterState?: any;
    ipAddress?: string;
    sessionId?: string;
    status?: AuditStatus;
    severity?: AuditSeverity;
    category?: AuditCategory;
    publiclyVisible?: boolean;
}): AuditLogEntry;
/**
 * Generates cryptographic hash for audit log integrity
 */
export declare function generateAuditHash(entry: AuditLogEntry): string;
/**
 * Verifies audit log integrity
 */
export declare function verifyAuditLogIntegrity(entry: AuditLogEntry): boolean;
/**
 * Determines retention period based on event type
 */
export declare function determineRetentionPeriod(eventType: AuditEventType, category?: AuditCategory): number;
/**
 * Creates an audit log chain for tamper detection
 */
export declare function createAuditLogChain(entries: AuditLogEntry[], previousHash?: string): Array<AuditLogEntry & {
    chainHash: string;
}>;
/**
 * Verifies audit log chain integrity
 */
export declare function verifyAuditLogChain(chain: Array<AuditLogEntry & {
    chainHash: string;
}>, expectedFirstHash?: string): {
    valid: boolean;
    brokenAt?: number;
};
/**
 * Filters audit logs by criteria
 */
export declare function filterAuditLogs(logs: AuditLogEntry[], filters: Partial<AuditReportFilters>): AuditLogEntry[];
/**
 * Redacts sensitive information from audit logs
 */
export declare function redactSensitiveAuditData(entry: AuditLogEntry, fieldsToRedact?: string[]): AuditLogEntry;
/**
 * Redacts sensitive fields from an object
 */
export declare function redactObject(obj: any, fieldsToRedact: string[]): any;
/**
 * Creates a change history entry
 */
export declare function createChangeHistoryEntry(params: {
    entityType: string;
    entityId: string;
    version: number;
    changedBy: string;
    changeType: ChangeType;
    changes: ChangeRecord[];
    snapshot?: any;
    comment?: string;
    publiclyVisible?: boolean;
}): ChangeHistoryEntry;
/**
 * Tracks changes between two objects
 */
export declare function trackObjectChanges(oldObject: any, newObject: any, prefix?: string): ChangeRecord[];
/**
 * Gets change history for an entity
 */
export declare function getEntityChangeHistory(allChanges: ChangeHistoryEntry[], entityType: string, entityId: string): ChangeHistoryEntry[];
/**
 * Reverts to a previous version
 */
export declare function revertToVersion(history: ChangeHistoryEntry[], targetVersion: number): {
    snapshot: any;
    changes: ChangeRecord[];
} | null;
/**
 * Compares two versions
 */
export declare function compareVersions(version1: ChangeHistoryEntry, version2: ChangeHistoryEntry): ChangeRecord[];
/**
 * Creates a user activity log
 */
export declare function createUserActivityLog(params: {
    userId: string;
    userName: string;
    sessionId: string;
    activityType: ActivityType;
    activityDescription: string;
    ipAddress: string;
    resourcesAccessed?: string[];
}): UserActivityLog;
/**
 * Completes a user activity log
 */
export declare function completeUserActivityLog(activity: UserActivityLog, actionsPerformed: number): UserActivityLog;
/**
 * Calculates anomaly score for user activity
 */
export declare function calculateActivityAnomalyScore(activity: UserActivityLog): number;
/**
 * Flags suspicious user activity
 */
export declare function flagSuspiciousActivity(activity: UserActivityLog): UserActivityLog;
/**
 * Gets activities by user
 */
export declare function getUserActivities(activities: UserActivityLog[], userId: string, dateRange?: {
    start: Date;
    end: Date;
}): UserActivityLog[];
/**
 * Creates a transaction audit trail
 */
export declare function createTransactionAuditTrail(params: {
    transactionId: string;
    transactionType: string;
    initiatedBy: string;
    totalAmount?: number;
    currency?: string;
    publicRecord?: boolean;
}): TransactionAuditTrail;
/**
 * Adds a step to transaction trail
 */
export declare function addTransactionStep(trail: TransactionAuditTrail, step: TransactionStep): TransactionAuditTrail;
/**
 * Adds approval to transaction
 */
export declare function addTransactionApproval(trail: TransactionAuditTrail, approval: ApprovalRecord): TransactionAuditTrail;
/**
 * Completes a transaction
 */
export declare function completeTransaction(trail: TransactionAuditTrail, success: boolean): TransactionAuditTrail;
/**
 * Checks if transaction requires approval
 */
export declare function requiresApproval(trail: TransactionAuditTrail, approvalThreshold: number): boolean;
/**
 * Gets pending approvals
 */
export declare function getPendingApprovals(trail: TransactionAuditTrail): ApprovalRecord[];
/**
 * Creates a data access log
 */
export declare function createDataAccessLog(params: {
    userId: string;
    userName: string;
    accessType: AccessType;
    dataCategory: string;
    dataClassification: DataClassification;
    recordsAccessed: number;
    specificRecordIds?: string[];
    accessPurpose?: string;
    approved?: boolean;
}): DataAccessLog;
/**
 * Calculates sensitivity score for data access
 */
export declare function calculateSensitivityScore(classification: DataClassification, recordsAccessed: number): number;
/**
 * Marks data as exported
 */
export declare function markDataExported(log: DataAccessLog, exportFormat: string): DataAccessLog;
/**
 * Gets high-sensitivity access logs
 */
export declare function getHighSensitivityAccess(logs: DataAccessLog[], threshold?: number): DataAccessLog[];
/**
 * Creates a transparency record
 */
export declare function createTransparencyRecord(params: {
    recordType: TransparencyRecordType;
    title: string;
    description: string;
    fiscalYear?: string;
    department: string;
    category: string;
    data: any;
    format?: RecordFormat;
    accessLevel?: AccessLevel;
}): TransparencyRecord;
/**
 * Increments record view count
 */
export declare function incrementViewCount(record: TransparencyRecord): TransparencyRecord;
/**
 * Increments record download count
 */
export declare function incrementDownloadCount(record: TransparencyRecord): TransparencyRecord;
/**
 * Adds tags to transparency record
 */
export declare function addRecordTags(record: TransparencyRecord, tags: string[]): TransparencyRecord;
/**
 * Filters transparency records by access level
 */
export declare function filterByAccessLevel(records: TransparencyRecord[], userAccessLevel: AccessLevel): TransparencyRecord[];
/**
 * Creates a public record
 */
export declare function createPublicRecord(params: {
    recordNumber: string;
    title: string;
    description: string;
    recordType: string;
    retentionSchedule: string;
    retentionYears: number;
    format: RecordFormat;
    sizeBytes: number;
    publiclyAvailable?: boolean;
    redactionRequired?: boolean;
}): PublicRecord;
/**
 * Applies legal hold to record
 */
export declare function applyLegalHold(record: PublicRecord): PublicRecord;
/**
 * Releases legal hold from record
 */
export declare function releaseLegalHold(record: PublicRecord): PublicRecord;
/**
 * Archives a public record
 */
export declare function archivePublicRecord(record: PublicRecord, archiveLocation: string): PublicRecord;
/**
 * Checks if record is eligible for disposal
 */
export declare function isEligibleForDisposal(record: PublicRecord, currentDate?: Date): boolean;
/**
 * Creates a FOIA request
 */
export declare function createFOIARequest(params: {
    requesterName: string;
    requesterEmail: string;
    requestDescription: string;
    requestCategory: FOIACategory;
    priority?: RequestPriority;
}): FOIARequest;
/**
 * Generates a FOIA request number
 */
export declare function generateFOIARequestNumber(): string;
/**
 * Calculates FOIA due date based on priority
 */
export declare function calculateFOIADueDate(priority?: RequestPriority): Date;
/**
 * Assigns FOIA request to processor
 */
export declare function assignFOIARequest(request: FOIARequest, assignedTo: string): FOIARequest;
/**
 * Requests FOIA extension
 */
export declare function requestFOIAExtension(request: FOIARequest, additionalDays: number, reason: string): FOIARequest;
/**
 * Approves FOIA extension
 */
export declare function approveFOIAExtension(request: FOIARequest, extensionIndex: number): FOIARequest;
/**
 * Fulfills FOIA request
 */
export declare function fulfillFOIARequest(request: FOIARequest, recordsProvided: number, response: string): FOIARequest;
/**
 * Applies FOIA exemptions
 */
export declare function applyFOIAExemptions(request: FOIARequest, exemptions: FOIAExemption[]): FOIARequest;
/**
 * Gets overdue FOIA requests
 */
export declare function getOverdueFOIARequests(requests: FOIARequest[], currentDate?: Date): FOIARequest[];
/**
 * Creates an audit report
 */
export declare function createAuditReport(params: {
    reportType: AuditReportType;
    title: string;
    reportPeriodStart: Date;
    reportPeriodEnd: Date;
    generatedBy: string;
    scope: string[];
    filters: AuditReportFilters;
}): AuditReport;
/**
 * Generates audit report summary
 */
export declare function generateAuditReportSummary(logs: AuditLogEntry[]): AuditReportSummary;
/**
 * Adds finding to audit report
 */
export declare function addAuditFinding(report: AuditReport, finding: AuditFinding): AuditReport;
/**
 * Creates audit evidence
 */
export declare function createAuditEvidence(params: {
    evidenceType: EvidenceType;
    collectedBy: string;
    description: string;
    source: string;
    dataSnapshot: any;
    relatedAuditId?: string;
    relatedFindingId?: string;
}): AuditEvidence;
/**
 * Adds custody record to evidence
 */
export declare function addCustodyRecord(evidence: AuditEvidence, custodyRecord: CustodyRecord): AuditEvidence;
/**
 * Verifies audit evidence
 */
export declare function verifyAuditEvidence(evidence: AuditEvidence, verifiedBy: string): AuditEvidence;
/**
 * Generates transparency metrics
 */
export declare function generateTransparencyMetrics(params: {
    transparencyRecords: TransparencyRecord[];
    foiaRequests: FOIARequest[];
}): TransparencyMetrics;
/**
 * Sequelize model for AuditLogEntry
 */
export declare const AuditLogEntryModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        timestamp: {
            type: string;
            allowNull: boolean;
        };
        eventType: {
            type: string;
            values: AuditEventType[];
        };
        userId: {
            type: string;
            allowNull: boolean;
        };
        userName: {
            type: string;
            allowNull: boolean;
        };
        userRole: {
            type: string;
            allowNull: boolean;
        };
        departmentId: {
            type: string;
            allowNull: boolean;
        };
        action: {
            type: string;
            values: AuditAction[];
        };
        resource: {
            type: string;
            allowNull: boolean;
        };
        resourceId: {
            type: string;
            allowNull: boolean;
        };
        resourceType: {
            type: string;
            allowNull: boolean;
        };
        changes: {
            type: string;
            defaultValue: never[];
        };
        beforeState: {
            type: string;
            allowNull: boolean;
        };
        afterState: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
        ipAddress: {
            type: string;
            allowNull: boolean;
        };
        userAgent: {
            type: string;
            allowNull: boolean;
        };
        sessionId: {
            type: string;
            allowNull: boolean;
        };
        requestId: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: AuditStatus[];
        };
        severity: {
            type: string;
            values: AuditSeverity[];
        };
        category: {
            type: string;
            values: AuditCategory[];
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        publiclyVisible: {
            type: string;
            defaultValue: boolean;
        };
        retentionYears: {
            type: string;
            allowNull: boolean;
        };
        hash: {
            type: string;
            allowNull: boolean;
        };
        chainHash: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for TransparencyRecord
 */
export declare const TransparencyRecordModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        recordType: {
            type: string;
            values: TransparencyRecordType[];
        };
        title: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        publishDate: {
            type: string;
            allowNull: boolean;
        };
        lastUpdated: {
            type: string;
            allowNull: boolean;
        };
        fiscalYear: {
            type: string;
            allowNull: boolean;
        };
        department: {
            type: string;
            allowNull: boolean;
        };
        category: {
            type: string;
            allowNull: boolean;
        };
        data: {
            type: string;
            allowNull: boolean;
        };
        attachments: {
            type: string;
            defaultValue: never[];
        };
        format: {
            type: string;
            values: RecordFormat[];
        };
        accessLevel: {
            type: string;
            values: AccessLevel[];
        };
        downloadCount: {
            type: string;
            defaultValue: number;
        };
        viewCount: {
            type: string;
            defaultValue: number;
        };
        tags: {
            type: string;
            defaultValue: never[];
        };
        relatedRecords: {
            type: string;
            defaultValue: never[];
        };
        dataQualityScore: {
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
 * Sequelize model for FOIARequest
 */
export declare const FOIARequestModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        requestNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        requestDate: {
            type: string;
            allowNull: boolean;
        };
        requesterName: {
            type: string;
            allowNull: boolean;
        };
        requesterEmail: {
            type: string;
            allowNull: boolean;
        };
        requesterOrganization: {
            type: string;
            allowNull: boolean;
        };
        requestDescription: {
            type: string;
            allowNull: boolean;
        };
        requestCategory: {
            type: string;
            values: FOIACategory[];
        };
        priority: {
            type: string;
            values: RequestPriority[];
        };
        status: {
            type: string;
            values: FOIAStatus[];
        };
        assignedTo: {
            type: string;
            allowNull: boolean;
        };
        dueDate: {
            type: string;
            allowNull: boolean;
        };
        extensions: {
            type: string;
            defaultValue: never[];
        };
        estimatedPages: {
            type: string;
            allowNull: boolean;
        };
        estimatedCost: {
            type: string;
            allowNull: boolean;
        };
        feesPaid: {
            type: string;
            allowNull: boolean;
        };
        processingTrack: {
            type: string;
            values: ProcessingTrack[];
        };
        recordsIdentified: {
            type: string;
            allowNull: boolean;
        };
        recordsProvided: {
            type: string;
            allowNull: boolean;
        };
        exemptionsApplied: {
            type: string;
            defaultValue: never[];
        };
        response: {
            type: string;
            allowNull: boolean;
        };
        responseDate: {
            type: string;
            allowNull: boolean;
        };
        closedDate: {
            type: string;
            allowNull: boolean;
        };
        appealFiled: {
            type: string;
            defaultValue: boolean;
        };
        appealDate: {
            type: string;
            allowNull: boolean;
        };
        publicationRequired: {
            type: string;
            defaultValue: boolean;
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
 * Example NestJS service for audit and transparency
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class AuditTransparencyService {
 *   async logAuditEvent(dto: CreateAuditLogDto): Promise<AuditLogEntry> {
 *     const entry = createAuditLogEntry(dto);
 *     return this.auditRepo.save(entry);
 *   }
 *
 *   async getTransparencyMetrics(): Promise<TransparencyMetrics> {
 *     const records = await this.transparencyRepo.find();
 *     const requests = await this.foiaRepo.find();
 *     return generateTransparencyMetrics({ transparencyRecords: records, foiaRequests: requests });
 *   }
 * }
 * ```
 */
export declare const AuditTransparencyServiceExample = "\n@Injectable()\nexport class AuditTransparencyService {\n  constructor(\n    @InjectModel(AuditLogEntryModel)\n    private auditRepo: Repository<AuditLogEntry>,\n    @InjectModel(TransparencyRecordModel)\n    private transparencyRepo: Repository<TransparencyRecord>,\n    @InjectModel(FOIARequestModel)\n    private foiaRepo: Repository<FOIARequest>,\n  ) {}\n\n  async createAuditChain(entries: AuditLogEntry[]): Promise<AuditLogEntry[]> {\n    const chain = createAuditLogChain(entries);\n    return this.auditRepo.save(chain);\n  }\n\n  async verifyAuditIntegrity(entryId: string): Promise<boolean> {\n    const entry = await this.auditRepo.findOne({ where: { id: entryId } });\n    return verifyAuditLogIntegrity(entry);\n  }\n}\n";
/**
 * Swagger DTO for creating audit log
 */
export declare const CreateAuditLogDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            eventType: {
                type: string;
                enum: AuditEventType[];
            };
            userId: {
                type: string;
                example: string;
            };
            action: {
                type: string;
                enum: AuditAction[];
            };
            resource: {
                type: string;
                example: string;
            };
            resourceId: {
                type: string;
                example: string;
            };
            resourceType: {
                type: string;
                example: string;
            };
            ipAddress: {
                type: string;
                example: string;
            };
            sessionId: {
                type: string;
                example: string;
            };
            publiclyVisible: {
                type: string;
                default: boolean;
            };
        };
    };
};
/**
 * Swagger DTO for creating FOIA request
 */
export declare const CreateFOIARequestDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            requesterName: {
                type: string;
                example: string;
            };
            requesterEmail: {
                type: string;
                format: string;
                example: string;
            };
            requesterOrganization: {
                type: string;
                example: string;
            };
            requestDescription: {
                type: string;
                example: string;
            };
            requestCategory: {
                type: string;
                enum: FOIACategory[];
            };
            priority: {
                type: string;
                enum: RequestPriority[];
            };
        };
    };
};
/**
 * Swagger response for transparency metrics
 */
export declare const TransparencyMetricsResponse: {
    schema: {
        type: string;
        properties: {
            totalPublicRecords: {
                type: string;
                example: number;
            };
            recordsPublishedThisMonth: {
                type: string;
                example: number;
            };
            totalDownloads: {
                type: string;
                example: number;
            };
            totalViews: {
                type: string;
                example: number;
            };
            openFOIARequests: {
                type: string;
                example: number;
            };
            averageFOIAResponseDays: {
                type: string;
                example: number;
            };
            foiaFulfillmentRate: {
                type: string;
                example: number;
            };
            mostAccessedRecords: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        recordId: {
                            type: string;
                        };
                        title: {
                            type: string;
                        };
                        accessCount: {
                            type: string;
                        };
                    };
                };
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
//# sourceMappingURL=audit-transparency-trail-kit.d.ts.map