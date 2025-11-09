/**
 * @fileoverview IAM Audit Kit - Comprehensive Sequelize-based audit logging and compliance
 * @module reuse/iam-audit-kit
 * @description Complete audit logging solution with Sequelize queries for HIPAA compliance,
 * security event tracking, access log analysis, and compliance reporting.
 *
 * Key Features:
 * - HIPAA-compliant audit logging with Sequelize
 * - Advanced compliance reporting queries
 * - Access log analysis and aggregation
 * - Security event detection and tracking
 * - Comprehensive audit trail queries
 * - Entity change tracking with diff generation
 * - Suspicious activity detection algorithms
 * - Audit data retention management
 * - Log aggregation and search optimization
 * - Multiple compliance export formats (HIPAA, SOC2, GDPR)
 * - Real-time audit streaming
 * - Audit log integrity verification
 * - Performance-optimized bulk logging
 * - Advanced filtering and correlation
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Tamper-proof audit logs with checksums
 * - HIPAA audit trail requirements (45 CFR § 164.312)
 * - SOC2 audit logging compliance
 * - GDPR data access audit requirements
 * - Encrypted audit log storage
 * - Retention policy enforcement
 * - Audit log integrity verification
 * - Role-based audit access control
 *
 * @example Basic audit logging
 * ```typescript
 * import { logAuditEvent, queryAuditTrail } from './iam-audit-kit';
 *
 * // Log user access
 * await logAuditEvent(sequelize, {
 *   action: 'READ',
 *   userId: 'user-123',
 *   entityType: 'Patient',
 *   entityId: 'patient-456',
 *   category: 'PHI_ACCESS',
 *   ipAddress: '192.168.1.1'
 * });
 *
 * // Query audit trail
 * const events = await queryAuditTrail(sequelize, {
 *   startDate: new Date('2025-01-01'),
 *   entityType: 'Patient',
 *   action: 'READ'
 * });
 * ```
 *
 * @example Compliance reporting
 * ```typescript
 * import { generateComplianceReport, exportAuditLogs } from './iam-audit-kit';
 *
 * // Generate HIPAA compliance report
 * const report = await generateComplianceReport(sequelize, {
 *   standard: 'HIPAA',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31')
 * });
 *
 * // Export for auditors
 * const exportData = await exportAuditLogs(sequelize, {
 *   format: 'JSON',
 *   filters: { category: 'PHI_ACCESS' }
 * });
 * ```
 *
 * LOC: IAM-AUD-001
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: audit services, compliance modules, security monitoring
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * @enum AuditAction
 * @description Standard audit action types
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
    MODIFY = "MODIFY",
    DOWNLOAD = "DOWNLOAD",
    UPLOAD = "UPLOAD",
    SEARCH = "SEARCH",
    VIEW = "VIEW"
}
/**
 * @enum AuditCategory
 * @description Audit event categories for classification
 */
export declare enum AuditCategory {
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION",
    DATA_ACCESS = "DATA_ACCESS",
    DATA_MODIFICATION = "DATA_MODIFICATION",
    SYSTEM_CONFIGURATION = "SYSTEM_CONFIGURATION",
    PHI_ACCESS = "PHI_ACCESS",
    SECURITY = "SECURITY",
    COMPLIANCE = "COMPLIANCE",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    USER_MANAGEMENT = "USER_MANAGEMENT",
    REPORT_GENERATION = "REPORT_GENERATION"
}
/**
 * @enum ComplianceStandard
 * @description Supported compliance standards
 */
export declare enum ComplianceStandard {
    HIPAA = "HIPAA",
    SOC2 = "SOC2",
    GDPR = "GDPR",
    PCI_DSS = "PCI_DSS",
    ISO27001 = "ISO27001",
    HITRUST = "HITRUST",
    NIST = "NIST"
}
/**
 * @enum AuditSeverity
 * @description Severity levels for audit events
 */
export declare enum AuditSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * @interface AuditLogEntry
 * @description Comprehensive audit log entry structure
 */
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
    sessionId?: string;
    changesBefore?: Record<string, any>;
    changesAfter?: Record<string, any>;
    metadata?: Record<string, any>;
    complianceStandards?: ComplianceStandard[];
    success: boolean;
    errorMessage?: string;
    severity?: AuditSeverity;
    checksum?: string;
    location?: string;
    deviceId?: string;
}
/**
 * @interface AuditQueryOptions
 * @description Options for querying audit logs
 */
export interface AuditQueryOptions {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditAction | AuditAction[];
    category?: AuditCategory | AuditCategory[];
    severity?: AuditSeverity | AuditSeverity[];
    success?: boolean;
    ipAddress?: string;
    sessionId?: string;
    complianceStandard?: ComplianceStandard;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}
/**
 * @interface ComplianceReportOptions
 * @description Options for compliance report generation
 */
export interface ComplianceReportOptions {
    standard: ComplianceStandard;
    startDate: Date;
    endDate: Date;
    includeDetails?: boolean;
    groupBy?: 'user' | 'entity' | 'action' | 'day';
    entityTypes?: string[];
}
/**
 * @interface ComplianceReport
 * @description Compliance report structure
 */
export interface ComplianceReport {
    standard: ComplianceStandard;
    period: {
        start: Date;
        end: Date;
    };
    totalEvents: number;
    eventsByCategory: Record<AuditCategory, number>;
    eventsByAction: Record<AuditAction, number>;
    uniqueUsers: number;
    uniqueEntities: number;
    phiAccessCount: number;
    failedAccessAttempts: number;
    suspiciousActivities: number;
    complianceScore: number;
    violations: any[];
    recommendations: string[];
}
/**
 * @interface SuspiciousActivityPattern
 * @description Pattern for detecting suspicious activity
 */
export interface SuspiciousActivityPattern {
    type: string;
    description: string;
    threshold: number;
    timeWindow: number;
    severity: AuditSeverity;
}
/**
 * @interface AuditRetentionPolicy
 * @description Audit log retention policy configuration
 */
export interface AuditRetentionPolicy {
    retentionDays: number;
    archiveBeforeDelete: boolean;
    archiveLocation?: string;
    complianceStandards: ComplianceStandard[];
    applyToCategories?: AuditCategory[];
}
/**
 * @interface AuditExportOptions
 * @description Options for exporting audit logs
 */
export interface AuditExportOptions {
    format: 'JSON' | 'CSV' | 'XML' | 'PDF';
    filters?: AuditQueryOptions;
    includeChecksum?: boolean;
    encrypt?: boolean;
    compression?: boolean;
}
/**
 * Logs a single audit event to the database with checksum
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditLogEntry} entry - Audit log entry data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created audit log record
 *
 * @example
 * ```typescript
 * await logAuditEvent(sequelize, {
 *   action: 'READ',
 *   userId: 'user-123',
 *   entityType: 'Patient',
 *   entityId: 'patient-456',
 *   category: 'PHI_ACCESS',
 *   success: true
 * });
 * ```
 */
export declare const logAuditEvent: (sequelize: Sequelize, entry: AuditLogEntry, transaction?: Transaction) => Promise<any>;
/**
 * Logs multiple audit events in bulk with optimized performance
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditLogEntry[]} entries - Array of audit log entries
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records inserted
 *
 * @example
 * ```typescript
 * await bulkLogAuditEvents(sequelize, [
 *   { action: 'READ', userId: 'user-1', entityType: 'Patient', ... },
 *   { action: 'UPDATE', userId: 'user-2', entityType: 'Medication', ... }
 * ]);
 * ```
 */
export declare const bulkLogAuditEvents: (sequelize: Sequelize, entries: AuditLogEntry[], transaction?: Transaction) => Promise<number>;
/**
 * Queries audit trail with advanced filtering and pagination
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditQueryOptions} options - Query options
 * @returns {Promise<any[]>} Audit log records
 *
 * @example
 * ```typescript
 * const logs = await queryAuditTrail(sequelize, {
 *   startDate: new Date('2025-01-01'),
 *   userId: 'user-123',
 *   category: 'PHI_ACCESS',
 *   limit: 50
 * });
 * ```
 */
export declare const queryAuditTrail: (sequelize: Sequelize, options: AuditQueryOptions) => Promise<any[]>;
/**
 * Retrieves audit trail for a specific entity with full history
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @param {number} [limit=100] - Maximum records to return
 * @returns {Promise<any[]>} Audit records for entity
 *
 * @example
 * ```typescript
 * const history = await getEntityAuditHistory(sequelize, 'Patient', 'patient-123');
 * ```
 */
export declare const getEntityAuditHistory: (sequelize: Sequelize, entityType: string, entityId: string, limit?: number) => Promise<any[]>;
/**
 * Retrieves audit trail for a specific user with all activities
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @param {number} [limit=100] - Maximum records to return
 * @returns {Promise<any[]>} Audit records for user
 *
 * @example
 * ```typescript
 * const userActivity = await getUserAuditHistory(sequelize, 'user-123', new Date('2025-01-01'));
 * ```
 */
export declare const getUserAuditHistory: (sequelize: Sequelize, userId: string, startDate?: Date, endDate?: Date, limit?: number) => Promise<any[]>;
/**
 * Generates comprehensive compliance report for specified standard
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportOptions} options - Report options
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(sequelize, {
 *   standard: ComplianceStandard.HIPAA,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31')
 * });
 * ```
 */
export declare const generateComplianceReport: (sequelize: Sequelize, options: ComplianceReportOptions) => Promise<ComplianceReport>;
/**
 * Exports audit logs in specified format with optional encryption
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditExportOptions} options - Export options
 * @returns {Promise<string | Buffer>} Exported audit data
 *
 * @example
 * ```typescript
 * const data = await exportAuditLogs(sequelize, {
 *   format: 'JSON',
 *   filters: { category: 'PHI_ACCESS' },
 *   includeChecksum: true
 * });
 * ```
 */
export declare const exportAuditLogs: (sequelize: Sequelize, options: AuditExportOptions) => Promise<string | Buffer>;
/**
 * Retrieves PHI access logs for HIPAA compliance auditing
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} [patientId] - Optional patient ID filter
 * @returns {Promise<any[]>} PHI access records
 *
 * @example
 * ```typescript
 * const phiAccess = await getPHIAccessLogs(sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const getPHIAccessLogs: (sequelize: Sequelize, startDate: Date, endDate: Date, patientId?: string) => Promise<any[]>;
/**
 * Generates audit summary by user with activity statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} User audit summaries
 *
 * @example
 * ```typescript
 * const summary = await getAuditSummaryByUser(sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const getAuditSummaryByUser: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Generates audit summary by entity type with access patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Entity audit summaries
 *
 * @example
 * ```typescript
 * const summary = await getAuditSummaryByEntity(sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const getAuditSummaryByEntity: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Detects suspicious activities based on configurable patterns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SuspiciousActivityPattern[]} patterns - Detection patterns
 * @param {Date} [startDate] - Optional start date
 * @returns {Promise<any[]>} Detected suspicious activities
 *
 * @example
 * ```typescript
 * const suspicious = await detectSuspiciousActivity(sequelize, [
 *   {
 *     type: 'EXCESSIVE_FAILED_LOGINS',
 *     threshold: 5,
 *     timeWindow: 15,
 *     severity: AuditSeverity.HIGH
 *   }
 * ]);
 * ```
 */
export declare const detectSuspiciousActivity: (sequelize: Sequelize, patterns: SuspiciousActivityPattern[], startDate?: Date) => Promise<any[]>;
/**
 * Detects excessive failed login attempts by user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} threshold - Failed attempts threshold
 * @returns {Promise<any[]>} Users with excessive failed logins
 */
export declare const detectExcessiveFailedLogins: (sequelize: Sequelize, startDate: Date, threshold?: number) => Promise<any[]>;
/**
 * Detects unusual access patterns (e.g., accessing many records quickly)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Unusual access pattern detections
 */
export declare const detectUnusualAccessPatterns: (sequelize: Sequelize, startDate: Date) => Promise<any[]>;
/**
 * Detects bulk data export attempts
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} threshold - Export count threshold
 * @returns {Promise<any[]>} Bulk export detections
 */
export declare const detectBulkDataExports: (sequelize: Sequelize, startDate: Date, threshold?: number) => Promise<any[]>;
/**
 * Detects access during off-hours (nights/weekends)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Off-hours access detections
 */
export declare const detectOffHoursAccess: (sequelize: Sequelize, startDate: Date) => Promise<any[]>;
/**
 * Tracks entity changes with before/after diff
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @param {Record<string, any>} beforeState - State before change
 * @param {Record<string, any>} afterState - State after change
 * @param {string} userId - User making the change
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created audit record
 */
export declare const trackEntityChange: (sequelize: Sequelize, entityType: string, entityId: string, beforeState: Record<string, any>, afterState: Record<string, any>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves all changes for an entity with diffs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @returns {Promise<any[]>} Change history with diffs
 */
export declare const getEntityChangeHistory: (sequelize: Sequelize, entityType: string, entityId: string) => Promise<any[]>;
/**
 * Compares entity state across two time points
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @param {Date} timepoint1 - First time point
 * @param {Date} timepoint2 - Second time point
 * @returns {Promise<any>} State comparison
 */
export declare const compareEntityStateAtTimes: (sequelize: Sequelize, entityType: string, entityId: string, timepoint1: Date, timepoint2: Date) => Promise<any>;
/**
 * Archives old audit logs based on retention policy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditRetentionPolicy} policy - Retention policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records archived
 */
export declare const archiveOldAuditLogs: (sequelize: Sequelize, policy: AuditRetentionPolicy, transaction?: Transaction) => Promise<number>;
/**
 * Retrieves audit retention statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Retention statistics
 */
export declare const getAuditRetentionStats: (sequelize: Sequelize) => Promise<any>;
/**
 * Aggregates audit logs by time period
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {'hour' | 'day' | 'week' | 'month'} period - Aggregation period
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Aggregated audit data
 */
export declare const aggregateAuditLogsByPeriod: (sequelize: Sequelize, period: "hour" | "day" | "week" | "month", startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Performs full-text search across audit logs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} searchTerm - Search term
 * @param {AuditQueryOptions} [filters] - Additional filters
 * @returns {Promise<any[]>} Matching audit records
 */
export declare const searchAuditLogs: (sequelize: Sequelize, searchTerm: string, filters?: AuditQueryOptions) => Promise<any[]>;
/**
 * Correlates audit events across multiple entities/users
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} correlationKey - Key to correlate by (sessionId, requestId, etc)
 * @param {string} correlationValue - Value to match
 * @returns {Promise<any[]>} Correlated audit events
 */
export declare const correlateAuditEvents: (sequelize: Sequelize, correlationKey: "sessionId" | "requestId" | "deviceId", correlationValue: string) => Promise<any[]>;
/**
 * Verifies audit log integrity using checksums
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [logIds] - Optional specific log IDs to verify
 * @returns {Promise<{ valid: number; invalid: number; invalidLogs: any[] }>} Verification results
 */
export declare const verifyAuditLogIntegrity: (sequelize: Sequelize, logIds?: string[]) => Promise<{
    valid: number;
    invalid: number;
    invalidLogs: any[];
}>;
/**
 * Generates checksum for audit log entry
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry
 * @returns {string} SHA-256 checksum
 */
export declare const generateAuditChecksum: (entry: Partial<AuditLogEntry>) => string;
/**
 * Generates diff between two objects
 *
 * @param {Record<string, any>} before - Before state
 * @param {Record<string, any>} after - After state
 * @returns {Record<string, any>} Diff object
 */
export declare const generateDiff: (before: Record<string, any>, after: Record<string, any>) => Record<string, any>;
/**
 * Converts audit logs to CSV format
 *
 * @param {any[]} logs - Audit log records
 * @returns {string} CSV formatted string
 */
export declare const convertToCSV: (logs: any[]) => string;
/**
 * Converts audit logs to XML format
 *
 * @param {any[]} logs - Audit log records
 * @returns {string} XML formatted string
 */
export declare const convertToXML: (logs: any[]) => string;
/**
 * Calculates compliance score based on audit metrics
 *
 * @param {object} metrics - Audit metrics
 * @returns {number} Compliance score (0-100)
 */
export declare const calculateComplianceScore: (metrics: {
    totalEvents: number;
    failedAccessAttempts: number;
    phiAccessCount: number;
}) => number;
/**
 * Generates compliance recommendations based on score
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {number} score - Compliance score
 * @returns {string[]} Recommendations
 */
export declare const generateComplianceRecommendations: (standard: ComplianceStandard, score: number) => string[];
/**
 * Gets failed login attempts for a specific user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Failed login attempts
 */
export declare const getUserFailedLogins: (sequelize: Sequelize, userId: string, startDate: Date) => Promise<any[]>;
/**
 * Gets audit logs for data exports
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Export audit logs
 */
export declare const getDataExportAuditLogs: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Gets audit logs by IP address
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ipAddress - IP address
 * @param {number} [limit=100] - Result limit
 * @returns {Promise<any[]>} Audit logs from IP
 */
export declare const getAuditLogsByIP: (sequelize: Sequelize, ipAddress: string, limit?: number) => Promise<any[]>;
/**
 * Gets most active users by audit activity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} [limit=10] - Number of users to return
 * @returns {Promise<any[]>} Most active users
 */
export declare const getMostActiveUsers: (sequelize: Sequelize, startDate: Date, endDate: Date, limit?: number) => Promise<any[]>;
/**
 * Gets most accessed entities
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} [limit=10] - Number of entities to return
 * @returns {Promise<any[]>} Most accessed entities
 */
export declare const getMostAccessedEntities: (sequelize: Sequelize, startDate: Date, endDate: Date, limit?: number) => Promise<any[]>;
/**
 * Generates hourly activity report
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} date - Date to analyze
 * @returns {Promise<any[]>} Hourly activity breakdown
 */
export declare const getHourlyActivityReport: (sequelize: Sequelize, date: Date) => Promise<any[]>;
/**
 * Gets critical security events
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} [limit=50] - Result limit
 * @returns {Promise<any[]>} Critical security events
 */
export declare const getCriticalSecurityEvents: (sequelize: Sequelize, startDate: Date, limit?: number) => Promise<any[]>;
/**
 * Gets audit logs for configuration changes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Configuration change logs
 */
export declare const getConfigurationChangeLogs: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Validates audit log completeness (no gaps)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ complete: boolean; gaps: any[] }>} Validation result
 */
export declare const validateAuditLogCompleteness: (sequelize: Sequelize, startDate: Date, endDate: Date) => Promise<{
    complete: boolean;
    gaps: any[];
}>;
/**
 * Gets audit log volume statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Volume statistics
 */
export declare const getAuditLogVolumeStats: (sequelize: Sequelize) => Promise<any>;
/**
 * Archives audit logs to archive table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} beforeDate - Archive logs before this date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of logs archived
 */
export declare const archiveAuditLogsToTable: (sequelize: Sequelize, beforeDate: Date, transaction?: Transaction) => Promise<number>;
/**
 * Gets duplicate audit log entries (potential issues)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Duplicate entries
 */
export declare const findDuplicateAuditLogs: (sequelize: Sequelize, startDate: Date) => Promise<any[]>;
/**
 * Gets audit logs with missing required fields
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Incomplete audit logs
 */
export declare const findIncompleteAuditLogs: (sequelize: Sequelize) => Promise<any[]>;
/**
 * Gets top error messages from audit logs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} [limit=10] - Number of errors to return
 * @returns {Promise<any[]>} Top error messages
 */
export declare const getTopErrorMessages: (sequelize: Sequelize, startDate: Date, limit?: number) => Promise<any[]>;
//# sourceMappingURL=iam-audit-kit.d.ts.map