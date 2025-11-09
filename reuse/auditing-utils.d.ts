/**
 * LOC: AUD1234567
 * File: /reuse/auditing-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - HIPAA compliance modules
 *   - Entity change tracking
 *   - Sequelize audit hooks
 */
/**
 * File: /reuse/auditing-utils.ts
 * Locator: WC-UTL-AUD-001
 * Purpose: Comprehensive Auditing Utilities - HIPAA-compliant audit logging and change tracking
 *
 * Upstream: Independent utility module for audit operations
 * Downstream: ../backend/*, audit services, compliance modules, entity trackers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize compatible
 * Exports: 40 utility functions for audit logging, change tracking, compliance, and reporting
 *
 * LLM Context: Comprehensive auditing utilities for White Cross healthcare platform.
 * Provides HIPAA-compliant audit logging, entity change tracking, user action logging,
 * sensitive data redaction, audit trail querying, and compliance reporting. Essential
 * for healthcare applications requiring complete audit trails and regulatory compliance.
 */
export declare enum AuditAction {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    EXPORT = "EXPORT",
    IMPORT = "IMPORT",
    SHARE = "SHARE",
    PRINT = "PRINT",
    ACCESS = "ACCESS",
    MODIFY = "MODIFY"
}
export declare enum AuditCategory {
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION",
    DATA_ACCESS = "DATA_ACCESS",
    DATA_MODIFICATION = "DATA_MODIFICATION",
    SYSTEM_CONFIGURATION = "SYSTEM_CONFIGURATION",
    PHI_ACCESS = "PHI_ACCESS",
    SECURITY = "SECURITY",
    COMPLIANCE = "COMPLIANCE",
    ADMINISTRATIVE = "ADMINISTRATIVE"
}
export declare enum ComplianceStandard {
    HIPAA = "HIPAA",
    SOC2 = "SOC2",
    GDPR = "GDPR",
    PCI_DSS = "PCI_DSS",
    ISO27001 = "ISO27001"
}
export interface AuditLogEntry {
    id?: string;
    timestamp: Date;
    action: AuditAction;
    category: AuditCategory;
    entityType: string;
    entityId?: string;
    userId: string;
    userName?: string;
    userRole?: string;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    changesBefore?: Record<string, any>;
    changesAfter?: Record<string, any>;
    metadata?: Record<string, any>;
    complianceStandards?: ComplianceStandard[];
    success: boolean;
    errorMessage?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
export interface AuditQueryOptions {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditAction;
    category?: AuditCategory;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface AuditRetentionPolicy {
    retentionDays: number;
    complianceStandard: ComplianceStandard;
    archiveEnabled: boolean;
    archiveLocation?: string;
}
export interface ChangeTracking {
    field: string;
    oldValue: any;
    newValue: any;
    changedAt: Date;
    changedBy: string;
}
export interface SensitiveFieldConfig {
    fieldName: string;
    redactionStrategy: 'MASK' | 'HASH' | 'REMOVE' | 'ENCRYPT';
    maskChar?: string;
    visibleChars?: number;
}
/**
 * Creates a standardized audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} Complete audit log entry
 *
 * @example
 * ```typescript
 * const auditLog = createAuditLog({
 *   action: AuditAction.UPDATE,
 *   category: AuditCategory.PHI_ACCESS,
 *   entityType: 'Patient',
 *   entityId: '12345',
 *   userId: 'user123',
 *   success: true
 * });
 * ```
 */
export declare const createAuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
/**
 * Creates an audit log for entity creation.
 *
 * @param {string} entityType - Type of entity created
 * @param {string} entityId - ID of created entity
 * @param {string} userId - User who created the entity
 * @param {Record<string, any>} data - Entity data
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createCreateAuditLog('Patient', '12345', 'user123', {
 *   name: 'John Doe',
 *   dateOfBirth: '1980-01-01'
 * });
 * ```
 */
export declare const createCreateAuditLog: (entityType: string, entityId: string, userId: string, data: Record<string, any>) => AuditLogEntry;
/**
 * Creates an audit log for entity update with change tracking.
 *
 * @param {string} entityType - Type of entity updated
 * @param {string} entityId - ID of updated entity
 * @param {string} userId - User who updated the entity
 * @param {Record<string, any>} before - Data before update
 * @param {Record<string, any>} after - Data after update
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createUpdateAuditLog('Patient', '12345', 'user123',
 *   { status: 'active', lastVisit: '2024-01-01' },
 *   { status: 'inactive', lastVisit: '2024-01-15' }
 * );
 * ```
 */
export declare const createUpdateAuditLog: (entityType: string, entityId: string, userId: string, before: Record<string, any>, after: Record<string, any>) => AuditLogEntry;
/**
 * Creates an audit log for entity deletion.
 *
 * @param {string} entityType - Type of entity deleted
 * @param {string} entityId - ID of deleted entity
 * @param {string} userId - User who deleted the entity
 * @param {Record<string, any>} data - Deleted entity data
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createDeleteAuditLog('Patient', '12345', 'user123', {
 *   name: 'John Doe',
 *   dateOfBirth: '1980-01-01'
 * });
 * ```
 */
export declare const createDeleteAuditLog: (entityType: string, entityId: string, userId: string, data: Record<string, any>) => AuditLogEntry;
/**
 * Creates an audit log for PHI (Protected Health Information) access.
 *
 * @param {string} entityType - Type of PHI entity accessed
 * @param {string} entityId - ID of PHI entity
 * @param {string} userId - User who accessed the PHI
 * @param {string} [ipAddress] - IP address of the user
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createPhiAccessLog('Patient', '12345', 'doctor123', '192.168.1.1');
 * ```
 */
export declare const createPhiAccessLog: (entityType: string, entityId: string, userId: string, ipAddress?: string) => AuditLogEntry;
/**
 * Compares two objects and extracts changed fields.
 *
 * @param {Record<string, any>} oldData - Original data
 * @param {Record<string, any>} newData - Updated data
 * @returns {ChangeTracking[]} Array of changed fields
 *
 * @example
 * ```typescript
 * const changes = extractChangedFields(
 *   { name: 'John', age: 30, status: 'active' },
 *   { name: 'John', age: 31, status: 'inactive' }
 * );
 * // Result: [{ field: 'age', oldValue: 30, newValue: 31 }, ...]
 * ```
 */
export declare const extractChangedFields: (oldData: Record<string, any>, newData: Record<string, any>) => Omit<ChangeTracking, "changedAt" | "changedBy">[];
/**
 * Creates a detailed change tracking record.
 *
 * @param {Record<string, any>} oldData - Original data
 * @param {Record<string, any>} newData - Updated data
 * @param {string} userId - User who made the change
 * @returns {ChangeTracking[]} Array of change tracking records
 *
 * @example
 * ```typescript
 * const tracking = createChangeTracking(
 *   { status: 'pending' },
 *   { status: 'approved' },
 *   'user123'
 * );
 * ```
 */
export declare const createChangeTracking: (oldData: Record<string, any>, newData: Record<string, any>, userId: string) => ChangeTracking[];
/**
 * Formats change tracking for human-readable display.
 *
 * @param {ChangeTracking[]} changes - Array of change tracking records
 * @returns {string[]} Array of formatted change descriptions
 *
 * @example
 * ```typescript
 * const formatted = formatChangeTracking([
 *   { field: 'status', oldValue: 'pending', newValue: 'approved', ... }
 * ]);
 * // Result: ['status: "pending" → "approved"']
 * ```
 */
export declare const formatChangeTracking: (changes: ChangeTracking[]) => string[];
/**
 * Calculates change summary statistics.
 *
 * @param {ChangeTracking[]} changes - Array of change tracking records
 * @returns {object} Change summary
 *
 * @example
 * ```typescript
 * const summary = getChangeSummary(changeRecords);
 * // Result: { totalChanges: 5, fieldsChanged: ['name', 'email', 'status'], ... }
 * ```
 */
export declare const getChangeSummary: (changes: ChangeTracking[]) => {
    totalChanges: number;
    fieldsChanged: string[];
    uniqueChangedBy: string[];
    firstChange: Date | null;
    lastChange: Date | null;
};
/**
 * Creates an audit log for user login.
 *
 * @param {string} userId - User ID
 * @param {string} ipAddress - IP address
 * @param {string} [userAgent] - User agent string
 * @param {boolean} success - Login success status
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createLoginAuditLog('user123', '192.168.1.1', 'Mozilla/5.0...', true);
 * ```
 */
export declare const createLoginAuditLog: (userId: string, ipAddress: string, userAgent?: string, success?: boolean) => AuditLogEntry;
/**
 * Creates an audit log for user logout.
 *
 * @param {string} userId - User ID
 * @param {string} [sessionDuration] - Session duration in seconds
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createLogoutAuditLog('user123', '3600');
 * ```
 */
export declare const createLogoutAuditLog: (userId: string, sessionDuration?: string) => AuditLogEntry;
/**
 * Creates an audit log for data export.
 *
 * @param {string} entityType - Type of data exported
 * @param {string} userId - User who exported the data
 * @param {number} recordCount - Number of records exported
 * @param {string} format - Export format (CSV, PDF, etc.)
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createExportAuditLog('Patient', 'user123', 150, 'CSV');
 * ```
 */
export declare const createExportAuditLog: (entityType: string, userId: string, recordCount: number, format: string) => AuditLogEntry;
/**
 * Creates an audit log for failed action attempts.
 *
 * @param {AuditAction} action - Action that failed
 * @param {string} entityType - Type of entity
 * @param {string} userId - User who attempted the action
 * @param {string} errorMessage - Error message
 * @returns {AuditLogEntry} Audit log entry
 *
 * @example
 * ```typescript
 * const log = createFailedActionLog(
 *   AuditAction.UPDATE,
 *   'Patient',
 *   'user123',
 *   'Insufficient permissions'
 * );
 * ```
 */
export declare const createFailedActionLog: (action: AuditAction, entityType: string, userId: string, errorMessage: string) => AuditLogEntry;
/**
 * Creates a HIPAA-compliant audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} HIPAA-compliant audit log entry
 *
 * @example
 * ```typescript
 * const log = createHipaaAuditLog({
 *   action: AuditAction.ACCESS,
 *   entityType: 'Patient',
 *   entityId: '12345',
 *   userId: 'doctor123'
 * });
 * ```
 */
export declare const createHipaaAuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
/**
 * Creates a SOC2-compliant audit log entry.
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry data
 * @returns {AuditLogEntry} SOC2-compliant audit log entry
 *
 * @example
 * ```typescript
 * const log = createSoc2AuditLog({
 *   action: AuditAction.MODIFY,
 *   entityType: 'SystemConfiguration',
 *   userId: 'admin123'
 * });
 * ```
 */
export declare const createSoc2AuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
/**
 * Validates audit log entry for compliance standards.
 *
 * @param {AuditLogEntry} entry - Audit log entry to validate
 * @param {ComplianceStandard} standard - Compliance standard to validate against
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateComplianceAuditLog(auditLog, ComplianceStandard.HIPAA);
 * // Result: { isValid: true, missingFields: [], warnings: [] }
 * ```
 */
export declare const validateComplianceAuditLog: (entry: AuditLogEntry, standard: ComplianceStandard) => {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
};
/**
 * Redacts sensitive data from audit log entry.
 *
 * @param {AuditLogEntry} entry - Audit log entry
 * @param {SensitiveFieldConfig[]} sensitiveFields - Configuration for sensitive fields
 * @returns {AuditLogEntry} Redacted audit log entry
 *
 * @example
 * ```typescript
 * const redacted = redactSensitiveData(auditLog, [
 *   { fieldName: 'ssn', redactionStrategy: 'MASK', maskChar: '*', visibleChars: 4 },
 *   { fieldName: 'password', redactionStrategy: 'REMOVE' }
 * ]);
 * ```
 */
export declare const redactSensitiveData: (entry: AuditLogEntry, sensitiveFields: SensitiveFieldConfig[]) => AuditLogEntry;
/**
 * Applies redaction strategy to a field value.
 *
 * @param {any} value - Field value to redact
 * @param {SensitiveFieldConfig} config - Redaction configuration
 * @returns {any} Redacted value
 *
 * @example
 * ```typescript
 * const masked = applyRedactionStrategy('123-45-6789', {
 *   fieldName: 'ssn',
 *   redactionStrategy: 'MASK',
 *   maskChar: '*',
 *   visibleChars: 4
 * });
 * // Result: '*****6789'
 * ```
 */
export declare const applyRedactionStrategy: (value: any, config: SensitiveFieldConfig) => any;
/**
 * Masks email addresses for audit logs.
 *
 * @param {string} email - Email address to mask
 * @returns {string} Masked email address
 *
 * @example
 * ```typescript
 * const masked = maskEmail('john.doe@example.com');
 * // Result: 'j***e@example.com'
 * ```
 */
export declare const maskEmail: (email: string) => string;
/**
 * Masks phone numbers for audit logs.
 *
 * @param {string} phone - Phone number to mask
 * @returns {string} Masked phone number
 *
 * @example
 * ```typescript
 * const masked = maskPhoneNumber('(555) 123-4567');
 * // Result: '(***) ***-4567'
 * ```
 */
export declare const maskPhoneNumber: (phone: string) => string;
/**
 * Builds query filter for audit log search.
 *
 * @param {AuditQueryOptions} options - Query options
 * @returns {Record<string, any>} Query filter object
 *
 * @example
 * ```typescript
 * const filter = buildAuditQueryFilter({
 *   userId: 'user123',
 *   action: AuditAction.UPDATE,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31')
 * });
 * ```
 */
export declare const buildAuditQueryFilter: (options: AuditQueryOptions) => Record<string, any>;
/**
 * Sorts audit logs by specified field and order.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {string} sortBy - Field to sort by
 * @param {'ASC' | 'DESC'} sortOrder - Sort order
 * @returns {AuditLogEntry[]} Sorted audit logs
 *
 * @example
 * ```typescript
 * const sorted = sortAuditLogs(auditLogs, 'timestamp', 'DESC');
 * ```
 */
export declare const sortAuditLogs: (logs: AuditLogEntry[], sortBy?: string, sortOrder?: "ASC" | "DESC") => AuditLogEntry[];
/**
 * Paginates audit log results.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {number} limit - Number of records per page
 * @param {number} offset - Number of records to skip
 * @returns {object} Paginated results
 *
 * @example
 * ```typescript
 * const page = paginateAuditLogs(auditLogs, 20, 40);
 * // Returns records 41-60
 * ```
 */
export declare const paginateAuditLogs: (logs: AuditLogEntry[], limit?: number, offset?: number) => {
    data: AuditLogEntry[];
    total: number;
    limit: number;
    offset: number;
};
/**
 * Filters audit logs by date range.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {AuditLogEntry[]} Filtered audit logs
 *
 * @example
 * ```typescript
 * const filtered = filterAuditLogsByDateRange(
 *   auditLogs,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const filterAuditLogsByDateRange: (logs: AuditLogEntry[], startDate: Date, endDate: Date) => AuditLogEntry[];
/**
 * Creates an audit retention policy.
 *
 * @param {Partial<AuditRetentionPolicy>} policy - Retention policy configuration
 * @returns {AuditRetentionPolicy} Complete retention policy
 *
 * @example
 * ```typescript
 * const policy = createRetentionPolicy({
 *   retentionDays: 2555, // 7 years for HIPAA
 *   complianceStandard: ComplianceStandard.HIPAA,
 *   archiveEnabled: true,
 *   archiveLocation: 's3://audit-archives'
 * });
 * ```
 */
export declare const createRetentionPolicy: (policy: Partial<AuditRetentionPolicy>) => AuditRetentionPolicy;
/**
 * Checks if audit log should be archived based on retention policy.
 *
 * @param {AuditLogEntry} log - Audit log entry
 * @param {AuditRetentionPolicy} policy - Retention policy
 * @returns {boolean} True if log should be archived
 *
 * @example
 * ```typescript
 * const shouldArchive = shouldArchiveAuditLog(auditLog, retentionPolicy);
 * ```
 */
export declare const shouldArchiveAuditLog: (log: AuditLogEntry, policy: AuditRetentionPolicy) => boolean;
/**
 * Gets retention requirements for compliance standard.
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @returns {number} Required retention days
 *
 * @example
 * ```typescript
 * const days = getRetentionRequirement(ComplianceStandard.HIPAA);
 * // Result: 2555 (7 years)
 * ```
 */
export declare const getRetentionRequirement: (standard: ComplianceStandard) => number;
/**
 * Generates audit summary report.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @returns {object} Audit summary report
 *
 * @example
 * ```typescript
 * const report = generateAuditSummary(auditLogs);
 * // Result: { totalLogs: 1500, uniqueUsers: 45, actionBreakdown: {...}, ... }
 * ```
 */
export declare const generateAuditSummary: (logs: AuditLogEntry[]) => {
    totalLogs: number;
    uniqueUsers: number;
    uniqueEntities: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    actionBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
    dateRange: {
        earliest: Date | null;
        latest: Date | null;
    };
};
/**
 * Generates user activity report.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @param {string} userId - User ID to generate report for
 * @returns {object} User activity report
 *
 * @example
 * ```typescript
 * const report = generateUserActivityReport(auditLogs, 'user123');
 * ```
 */
export declare const generateUserActivityReport: (logs: AuditLogEntry[], userId: string) => {
    userId: string;
    totalActions: number;
    uniqueActions: number;
    actionFrequency: Record<string, number>;
    categoryFrequency: Record<string, number>;
    firstActivity: Date | null;
    lastActivity: Date | null;
};
/**
 * Exports audit logs to CSV format.
 *
 * @param {AuditLogEntry[]} logs - Array of audit log entries
 * @returns {string} CSV formatted audit logs
 *
 * @example
 * ```typescript
 * const csv = exportAuditLogsToCSV(auditLogs);
 * // Save to file or send as download
 * ```
 */
export declare const exportAuditLogsToCSV: (logs: AuditLogEntry[]) => string;
declare const _default: {
    createAuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
    createCreateAuditLog: (entityType: string, entityId: string, userId: string, data: Record<string, any>) => AuditLogEntry;
    createUpdateAuditLog: (entityType: string, entityId: string, userId: string, before: Record<string, any>, after: Record<string, any>) => AuditLogEntry;
    createDeleteAuditLog: (entityType: string, entityId: string, userId: string, data: Record<string, any>) => AuditLogEntry;
    createPhiAccessLog: (entityType: string, entityId: string, userId: string, ipAddress?: string) => AuditLogEntry;
    extractChangedFields: (oldData: Record<string, any>, newData: Record<string, any>) => Omit<ChangeTracking, "changedAt" | "changedBy">[];
    createChangeTracking: (oldData: Record<string, any>, newData: Record<string, any>, userId: string) => ChangeTracking[];
    formatChangeTracking: (changes: ChangeTracking[]) => string[];
    getChangeSummary: (changes: ChangeTracking[]) => {
        totalChanges: number;
        fieldsChanged: string[];
        uniqueChangedBy: string[];
        firstChange: Date | null;
        lastChange: Date | null;
    };
    createLoginAuditLog: (userId: string, ipAddress: string, userAgent?: string, success?: boolean) => AuditLogEntry;
    createLogoutAuditLog: (userId: string, sessionDuration?: string) => AuditLogEntry;
    createExportAuditLog: (entityType: string, userId: string, recordCount: number, format: string) => AuditLogEntry;
    createFailedActionLog: (action: AuditAction, entityType: string, userId: string, errorMessage: string) => AuditLogEntry;
    createHipaaAuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
    createSoc2AuditLog: (entry: Partial<AuditLogEntry>) => AuditLogEntry;
    validateComplianceAuditLog: (entry: AuditLogEntry, standard: ComplianceStandard) => {
        isValid: boolean;
        missingFields: string[];
        warnings: string[];
    };
    redactSensitiveData: (entry: AuditLogEntry, sensitiveFields: SensitiveFieldConfig[]) => AuditLogEntry;
    applyRedactionStrategy: (value: any, config: SensitiveFieldConfig) => any;
    maskEmail: (email: string) => string;
    maskPhoneNumber: (phone: string) => string;
    buildAuditQueryFilter: (options: AuditQueryOptions) => Record<string, any>;
    sortAuditLogs: (logs: AuditLogEntry[], sortBy?: string, sortOrder?: "ASC" | "DESC") => AuditLogEntry[];
    paginateAuditLogs: (logs: AuditLogEntry[], limit?: number, offset?: number) => {
        data: AuditLogEntry[];
        total: number;
        limit: number;
        offset: number;
    };
    filterAuditLogsByDateRange: (logs: AuditLogEntry[], startDate: Date, endDate: Date) => AuditLogEntry[];
    createRetentionPolicy: (policy: Partial<AuditRetentionPolicy>) => AuditRetentionPolicy;
    shouldArchiveAuditLog: (log: AuditLogEntry, policy: AuditRetentionPolicy) => boolean;
    getRetentionRequirement: (standard: ComplianceStandard) => number;
    generateAuditSummary: (logs: AuditLogEntry[]) => {
        totalLogs: number;
        uniqueUsers: number;
        uniqueEntities: number;
        successCount: number;
        failureCount: number;
        successRate: number;
        actionBreakdown: Record<string, number>;
        categoryBreakdown: Record<string, number>;
        dateRange: {
            earliest: Date | null;
            latest: Date | null;
        };
    };
    generateUserActivityReport: (logs: AuditLogEntry[], userId: string) => {
        userId: string;
        totalActions: number;
        uniqueActions: number;
        actionFrequency: Record<string, number>;
        categoryFrequency: Record<string, number>;
        firstActivity: Date | null;
        lastActivity: Date | null;
    };
    exportAuditLogsToCSV: (logs: AuditLogEntry[]) => string;
};
export default _default;
//# sourceMappingURL=auditing-utils.d.ts.map