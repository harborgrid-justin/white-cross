/**
 * LOC: COMPLIANCE_AUDIT_KIT_001
 * File: /reuse/engineer/compliance-audit-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/testing
 *   - typeorm
 *   - crypto (Node.js built-in)
 *   - jest
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - Compliance monitoring services
 *   - Regulatory reporting modules
 *   - Change tracking services
 *   - Data retention services
 *   - Access control audit services
 */
/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    userId: string;
    userEmail?: string;
    userRole?: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    resourceType: string;
    changes?: AuditChange[];
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    status: 'success' | 'failure' | 'pending';
    severity: AuditSeverity;
    complianceFlags?: string[];
    encrypted?: boolean;
    hash?: string;
}
/**
 * Audit action types
 */
export declare enum AuditAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    ACCESS_GRANTED = "ACCESS_GRANTED",
    ACCESS_DENIED = "ACCESS_DENIED",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    DOWNLOAD = "DOWNLOAD",
    PRINT = "PRINT",
    SHARE = "SHARE",
    ENCRYPT = "ENCRYPT",
    DECRYPT = "DECRYPT",
    BACKUP = "BACKUP",
    RESTORE = "RESTORE",
    CONSENT_GRANTED = "CONSENT_GRANTED",
    CONSENT_REVOKED = "CONSENT_REVOKED"
}
/**
 * Audit severity levels
 */
export declare enum AuditSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Change tracking structure
 */
export interface AuditChange {
    field: string;
    oldValue: any;
    newValue: any;
    dataType: string;
    encrypted?: boolean;
}
/**
 * Compliance rule definition
 */
export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    category: ComplianceCategory;
    regulation: string;
    severity: AuditSeverity;
    conditions: ComplianceCondition[];
    actions: ComplianceAction[];
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Compliance categories
 */
export declare enum ComplianceCategory {
    DATA_PROTECTION = "DATA_PROTECTION",
    ACCESS_CONTROL = "ACCESS_CONTROL",
    DATA_RETENTION = "DATA_RETENTION",
    ENCRYPTION = "ENCRYPTION",
    AUDIT_LOGGING = "AUDIT_LOGGING",
    CONSENT_MANAGEMENT = "CONSENT_MANAGEMENT",
    BREACH_NOTIFICATION = "BREACH_NOTIFICATION",
    DATA_MINIMIZATION = "DATA_MINIMIZATION",
    RIGHT_TO_ACCESS = "RIGHT_TO_ACCESS",
    RIGHT_TO_ERASURE = "RIGHT_TO_ERASURE"
}
/**
 * Compliance condition structure
 */
export interface ComplianceCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'matches';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
/**
 * Compliance action structure
 */
export interface ComplianceAction {
    type: 'alert' | 'block' | 'log' | 'notify' | 'escalate';
    target?: string;
    message?: string;
    metadata?: Record<string, any>;
}
/**
 * Compliance violation record
 */
export interface ComplianceViolation {
    id: string;
    timestamp: Date;
    ruleId: string;
    ruleName: string;
    severity: AuditSeverity;
    userId?: string;
    resource: string;
    resourceId?: string;
    description: string;
    details: Record<string, any>;
    status: 'open' | 'investigating' | 'resolved' | 'false_positive';
    resolvedAt?: Date;
    resolvedBy?: string;
    resolution?: string;
}
/**
 * Audit trail query parameters
 */
export interface AuditTrailQuery {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    userEmail?: string;
    actions?: AuditAction[];
    resources?: string[];
    resourceIds?: string[];
    severity?: AuditSeverity[];
    status?: ('success' | 'failure' | 'pending')[];
    complianceFlags?: string[];
    ipAddress?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Audit report configuration
 */
export interface AuditReportConfig {
    title: string;
    type: 'access' | 'changes' | 'violations' | 'compliance' | 'custom';
    query: AuditTrailQuery;
    format: 'json' | 'csv' | 'pdf' | 'xlsx';
    includeCharts?: boolean;
    groupBy?: string[];
    aggregations?: ReportAggregation[];
    filters?: Record<string, any>;
}
/**
 * Report aggregation definition
 */
export interface ReportAggregation {
    field: string;
    function: 'count' | 'sum' | 'avg' | 'min' | 'max';
    alias?: string;
}
/**
 * Data retention policy
 */
export interface DataRetentionPolicy {
    id: string;
    name: string;
    resourceType: string;
    retentionPeriodDays: number;
    archiveBeforeDelete: boolean;
    archiveLocation?: string;
    deleteConditions?: Record<string, any>;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Version tracking structure
 */
export interface VersionRecord {
    id: string;
    resourceType: string;
    resourceId: string;
    version: number;
    data: any;
    changes?: AuditChange[];
    createdBy: string;
    createdAt: Date;
    checksum: string;
    metadata?: Record<string, any>;
}
/**
 * Compliance checklist item
 */
export interface ComplianceChecklistItem {
    id: string;
    category: ComplianceCategory;
    regulation: string;
    requirement: string;
    description: string;
    status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
    evidence?: string[];
    lastChecked?: Date;
    checkedBy?: string;
    notes?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Audit encryption configuration
 */
export interface AuditEncryptionConfig {
    algorithm: string;
    keyId: string;
    encryptedFields: string[];
    rotationPeriodDays?: number;
}
/**
 * Creates a new audit log entry
 */
export declare function createAuditLog(params: {
    userId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    resourceType: string;
    changes?: AuditChange[];
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    status?: 'success' | 'failure' | 'pending';
    severity?: AuditSeverity;
}): AuditLogEntry;
/**
 * Creates a batch of audit log entries
 */
export declare function createBatchAuditLogs(entries: Omit<Parameters<typeof createAuditLog>[0], 'userId'>[], userId: string): AuditLogEntry[];
/**
 * Generates a cryptographic hash for audit log integrity
 */
export declare function generateAuditHash(entry: AuditLogEntry): string;
/**
 * Verifies audit log integrity using hash
 */
export declare function verifyAuditLogIntegrity(entry: AuditLogEntry): boolean;
/**
 * Determines compliance flags based on action and resource type
 */
export declare function determineComplianceFlags(action: AuditAction, resourceType: string): string[];
/**
 * Enriches audit log with additional user and session information
 */
export declare function enrichAuditLog(entry: AuditLogEntry, enrichmentData: {
    userEmail?: string;
    userRole?: string;
    additionalMetadata?: Record<string, any>;
}): AuditLogEntry;
/**
 * Masks sensitive data in audit logs
 */
export declare function maskSensitiveAuditData(entry: AuditLogEntry, sensitiveFields?: string[]): AuditLogEntry;
/**
 * Creates a compliance rule
 */
export declare function createComplianceRule(params: {
    name: string;
    description: string;
    category: ComplianceCategory;
    regulation: string;
    severity: AuditSeverity;
    conditions: ComplianceCondition[];
    actions: ComplianceAction[];
}): ComplianceRule;
/**
 * Evaluates compliance rules against an audit log entry
 */
export declare function evaluateComplianceRules(entry: AuditLogEntry, rules: ComplianceRule[]): ComplianceViolation[];
/**
 * Evaluates rule conditions
 */
export declare function evaluateRuleConditions(entry: AuditLogEntry, conditions: ComplianceCondition[]): boolean;
/**
 * Evaluates a single condition
 */
export declare function evaluateCondition(entry: AuditLogEntry, condition: ComplianceCondition): boolean;
/**
 * Gets nested value from object using dot notation
 */
export declare function getNestedValue(obj: any, path: string): any;
/**
 * Executes compliance actions
 */
export declare function executeComplianceActions(actions: ComplianceAction[], entry: AuditLogEntry): void;
/**
 * Builds a query for audit trail search
 */
export declare function buildAuditTrailQuery(params: AuditTrailQuery): any;
/**
 * Filters audit logs based on query parameters
 */
export declare function filterAuditLogs(logs: AuditLogEntry[], query: AuditTrailQuery): AuditLogEntry[];
/**
 * Generates an audit report
 */
export declare function generateAuditReport(logs: AuditLogEntry[], config: AuditReportConfig): any;
/**
 * Groups audit logs by specified fields
 */
export declare function groupAuditLogs(logs: AuditLogEntry[], groupByFields: string[]): Record<string, AuditLogEntry[]>;
/**
 * Performs aggregations on audit logs
 */
export declare function performAggregations(logs: AuditLogEntry[], aggregations: ReportAggregation[]): Record<string, any>;
/**
 * Generates chart data from audit logs
 */
export declare function generateChartData(logs: AuditLogEntry[]): any;
/**
 * Exports audit report to CSV format
 */
export declare function exportAuditReportToCSV(logs: AuditLogEntry[]): string;
/**
 * Tracks changes between two objects
 */
export declare function trackChanges(oldData: any, newData: any, prefix?: string): AuditChange[];
/**
 * Creates a version record
 */
export declare function createVersionRecord(params: {
    resourceType: string;
    resourceId: string;
    version: number;
    data: any;
    changes?: AuditChange[];
    createdBy: string;
}): VersionRecord;
/**
 * Generates checksum for version integrity
 */
export declare function generateVersionChecksum(version: VersionRecord): string;
/**
 * Compares two versions
 */
export declare function compareVersions(version1: VersionRecord, version2: VersionRecord): AuditChange[];
/**
 * Reverts to a previous version
 */
export declare function revertToVersion(currentData: any, targetVersion: VersionRecord): {
    data: any;
    changes: AuditChange[];
};
/**
 * Creates a compliance checklist item
 */
export declare function createComplianceChecklistItem(params: {
    category: ComplianceCategory;
    regulation: string;
    requirement: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
}): ComplianceChecklistItem;
/**
 * Updates compliance checklist item status
 */
export declare function updateComplianceStatus(item: ComplianceChecklistItem, status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable', checkedBy: string, notes?: string, evidence?: string[]): ComplianceChecklistItem;
/**
 * Generates HIPAA compliance checklist
 */
export declare function generateHIPAAChecklist(): ComplianceChecklistItem[];
/**
 * Calculates compliance score
 */
export declare function calculateComplianceScore(items: ComplianceChecklistItem[]): {
    score: number;
    compliantCount: number;
    totalCount: number;
    breakdown: Record<string, number>;
};
/**
 * Creates a data retention policy
 */
export declare function createRetentionPolicy(params: {
    name: string;
    resourceType: string;
    retentionPeriodDays: number;
    archiveBeforeDelete?: boolean;
    archiveLocation?: string;
}): DataRetentionPolicy;
/**
 * Determines if data should be retained or deleted
 */
export declare function shouldRetainData(createdAt: Date, policy: DataRetentionPolicy): {
    retain: boolean;
    daysRemaining: number;
};
/**
 * Identifies records eligible for archival
 */
export declare function identifyRecordsForArchival(records: Array<{
    id: string;
    createdAt: Date;
}>, policy: DataRetentionPolicy): string[];
/**
 * Logs access control event
 */
export declare function logAccessControlEvent(params: {
    userId: string;
    action: 'grant' | 'deny' | 'revoke' | 'modify';
    resource: string;
    resourceId?: string;
    permission?: string;
    reason?: string;
    ipAddress?: string;
}): AuditLogEntry;
/**
 * Analyzes access patterns for anomalies
 */
export declare function analyzeAccessPatterns(logs: AuditLogEntry[]): {
    anomalies: Array<{
        type: string;
        severity: string;
        description: string;
        logs: AuditLogEntry[];
    }>;
    patterns: Record<string, number>;
};
/**
 * Encrypts sensitive audit log fields
 */
export declare function encryptAuditLogFields(entry: AuditLogEntry, fieldsToEncrypt: string[], encryptionKey: string): AuditLogEntry;
/**
 * Encrypts a field value
 */
export declare function encryptField(value: string, key: string): string;
/**
 * Decrypts a field value
 */
export declare function decryptField(encryptedValue: string, key: string): string;
/**
 * Creates a tamper-evident audit log chain
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
 * Creates a mock audit log repository for testing
 */
export declare function createMockAuditLogRepository(): {
    save: any;
    find: any;
    findOne: any;
    count: any;
    clear: any;
    remove: any;
    getLogs: () => AuditLogEntry[];
};
/**
 * Creates mock compliance rules for testing
 */
export declare function createMockComplianceRules(): ComplianceRule[];
/**
 * Generates test audit log data
 */
export declare function generateTestAuditLogs(count: number): AuditLogEntry[];
/**
 * Creates a NestJS test module with audit services
 */
export declare function createAuditTestModule(): {
    module: {
        new (): {};
    };
    providers: ({
        provide: string;
        useValue: {
            save: any;
            find: any;
            findOne: any;
            count: any;
            clear: any;
            remove: any;
            getLogs: () => AuditLogEntry[];
        };
    } | {
        provide: string;
        useValue: ComplianceRule[];
    })[];
};
/**
 * Asserts audit log was created correctly
 */
export declare function assertAuditLogCreated(log: AuditLogEntry, expected: Partial<AuditLogEntry>): void;
/**
 * Mocks compliance rule evaluation
 */
export declare function mockComplianceEvaluation(shouldViolate?: boolean): jest.Mock;
/**
 * Creates test helper for audit log assertions
 */
export declare class AuditLogTestHelper {
    private logs;
    addLog(log: AuditLogEntry): void;
    getLogs(): AuditLogEntry[];
    findByAction(action: AuditAction): AuditLogEntry[];
    findByUserId(userId: string): AuditLogEntry[];
    findByResource(resource: string): AuditLogEntry[];
    assertLogExists(criteria: Partial<AuditLogEntry>): void;
    assertLogCount(expected: number): void;
    clear(): void;
}
/**
 * Export all testing utilities
 */
export declare const AuditTestingUtils: {
    createMockAuditLogRepository: typeof createMockAuditLogRepository;
    createMockComplianceRules: typeof createMockComplianceRules;
    generateTestAuditLogs: typeof generateTestAuditLogs;
    createAuditTestModule: typeof createAuditTestModule;
    assertAuditLogCreated: typeof assertAuditLogCreated;
    mockComplianceEvaluation: typeof mockComplianceEvaluation;
    AuditLogTestHelper: typeof AuditLogTestHelper;
};
//# sourceMappingURL=compliance-audit-kit.d.ts.map