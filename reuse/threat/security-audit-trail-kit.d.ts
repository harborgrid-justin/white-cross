/**
 * @fileoverview Security Audit Trail Kit - Enterprise Audit Logging and Compliance
 * @module reuse/threat/security-audit-trail-kit
 * @description Comprehensive security audit trail management for enterprise security operations,
 * providing tamper-proof logging, compliance auditing, forensic analysis, and chain of custody
 * tracking. Designed to compete with enterprise audit solutions from Infor SCM and similar platforms.
 *
 * Key Features:
 * - Comprehensive audit log generation and management
 * - Real-time security event tracking and correlation
 * - Access audit trails with user activity monitoring
 * - Change tracking with versioning and rollback support
 * - Multi-framework compliance audit support (SOC 2, HIPAA, GDPR, PCI-DSS)
 * - Advanced forensic log analysis and investigation
 * - Intelligent log retention and archival policies
 * - Automated audit report generation
 * - Chain of custody tracking for evidence management
 * - Tamper detection and log integrity verification
 * - Audit data anonymization and redaction
 * - Real-time audit alerting and notifications
 *
 * @target Enterprise Audit Management alternative
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Tamper-proof audit log storage with cryptographic hashing
 * - Role-based access control for audit data
 * - Audit log encryption at rest and in transit
 * - Write-once read-many (WORM) storage compliance
 * - SOC 2 Type II, HIPAA, GDPR, PCI-DSS compliance
 * - Multi-tenant audit data isolation
 * - Secure audit data retention and destruction
 *
 * @example Audit log generation
 * ```typescript
 * import { generateAuditLog, trackSecurityEvent } from './security-audit-trail-kit';
 *
 * const auditLog = await generateAuditLog({
 *   eventType: AuditEventType.USER_LOGIN,
 *   userId: 'user-123',
 *   action: 'LOGIN_SUCCESS',
 *   resourceType: 'AUTHENTICATION',
 *   ipAddress: '192.168.1.100',
 * }, sequelize);
 *
 * const event = await trackSecurityEvent({
 *   eventType: SecurityEventType.FAILED_LOGIN_ATTEMPT,
 *   severity: AuditSeverity.HIGH,
 *   userId: 'user-456',
 *   metadata: { attempts: 5 },
 * }, sequelize);
 * ```
 *
 * @example Compliance auditing
 * ```typescript
 * import { generateComplianceAuditReport, validateComplianceRequirements } from './security-audit-trail-kit';
 *
 * const report = await generateComplianceAuditReport({
 *   standard: ComplianceStandard.SOC2_TYPE_II,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   scope: ['authentication', 'data-access', 'change-management'],
 * }, sequelize);
 *
 * const validation = await validateComplianceRequirements('SOC2_TYPE_II', sequelize);
 * ```
 *
 * LOC: THREAT-AUDIT-013
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns, crypto
 * DOWNSTREAM: security-operations, compliance, incident-response, risk-management
 *
 * @version 1.0.0
 * @since 2025-01-09
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * @enum AuditEventType
 * @description Types of audit events
 */
export declare enum AuditEventType {
    USER_LOGIN = "USER_LOGIN",
    USER_LOGOUT = "USER_LOGOUT",
    USER_CREATION = "USER_CREATION",
    USER_DELETION = "USER_DELETION",
    USER_MODIFICATION = "USER_MODIFICATION",
    ROLE_ASSIGNMENT = "ROLE_ASSIGNMENT",
    PERMISSION_CHANGE = "PERMISSION_CHANGE",
    DATA_ACCESS = "DATA_ACCESS",
    DATA_MODIFICATION = "DATA_MODIFICATION",
    DATA_DELETION = "DATA_DELETION",
    DATA_EXPORT = "DATA_EXPORT",
    CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
    SECURITY_POLICY_UPDATE = "SECURITY_POLICY_UPDATE",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    PASSWORD_RESET = "PASSWORD_RESET",
    MFA_ENABLED = "MFA_ENABLED",
    MFA_DISABLED = "MFA_DISABLED",
    API_ACCESS = "API_ACCESS",
    FILE_UPLOAD = "FILE_UPLOAD",
    FILE_DOWNLOAD = "FILE_DOWNLOAD",
    SYSTEM_CONFIGURATION = "SYSTEM_CONFIGURATION"
}
/**
 * @enum AuditSeverity
 * @description Severity levels for audit events
 */
export declare enum AuditSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * @enum SecurityEventType
 * @description Security-specific event types
 */
export declare enum SecurityEventType {
    FAILED_LOGIN_ATTEMPT = "FAILED_LOGIN_ATTEMPT",
    BRUTE_FORCE_DETECTED = "BRUTE_FORCE_DETECTED",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    PRIVILEGE_ESCALATION = "PRIVILEGE_ESCALATION",
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
    DATA_EXFILTRATION_ATTEMPT = "DATA_EXFILTRATION_ATTEMPT",
    MALWARE_DETECTED = "MALWARE_DETECTED",
    INTRUSION_ATTEMPT = "INTRUSION_ATTEMPT",
    POLICY_VIOLATION = "POLICY_VIOLATION",
    ANOMALOUS_BEHAVIOR = "ANOMALOUS_BEHAVIOR"
}
/**
 * @enum ComplianceStandard
 * @description Compliance framework standards
 */
export declare enum ComplianceStandard {
    SOC2_TYPE_I = "SOC2_TYPE_I",
    SOC2_TYPE_II = "SOC2_TYPE_II",
    HIPAA = "HIPAA",
    GDPR = "GDPR",
    PCI_DSS = "PCI_DSS",
    ISO_27001 = "ISO_27001",
    NIST_800_53 = "NIST_800_53",
    FISMA = "FISMA",
    CCPA = "CCPA",
    FedRAMP = "FedRAMP"
}
/**
 * @enum AuditLogStatus
 * @description Status of audit log entry
 */
export declare enum AuditLogStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    PENDING_REVIEW = "PENDING_REVIEW",
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION",
    REVIEWED = "REVIEWED",
    FLAGGED = "FLAGGED"
}
/**
 * @enum RetentionPeriod
 * @description Log retention period options
 */
export declare enum RetentionPeriod {
    DAYS_30 = "30_DAYS",
    DAYS_90 = "90_DAYS",
    DAYS_180 = "180_DAYS",
    YEAR_1 = "1_YEAR",
    YEARS_3 = "3_YEARS",
    YEARS_7 = "7_YEARS",
    YEARS_10 = "10_YEARS",
    PERMANENT = "PERMANENT"
}
/**
 * @interface AuditLogData
 * @description Core audit log entry data
 */
export interface AuditLogData {
    eventType: AuditEventType;
    userId?: string;
    userName?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    severity: AuditSeverity;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    success: boolean;
    details?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * @interface SecurityEvent
 * @description Security event tracking data
 */
export interface SecurityEvent {
    eventType: SecurityEventType;
    severity: AuditSeverity;
    userId?: string;
    ipAddress?: string;
    description: string;
    affectedResources?: string[];
    indicators?: string[];
    responseAction?: string;
    resolved: boolean;
    metadata?: Record<string, any>;
}
/**
 * @interface AccessAudit
 * @description Access audit trail entry
 */
export interface AccessAudit {
    userId: string;
    resourceType: string;
    resourceId: string;
    accessType: 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE';
    accessGranted: boolean;
    denialReason?: string;
    timestamp: Date;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
/**
 * @interface ChangeRecord
 * @description Change tracking record
 */
export interface ChangeRecord {
    entityType: string;
    entityId: string;
    changeType: 'CREATE' | 'UPDATE' | 'DELETE';
    userId: string;
    fieldName?: string;
    oldValue?: any;
    newValue?: any;
    version: number;
    changeReason?: string;
    approvedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * @interface ComplianceAuditData
 * @description Compliance audit data structure
 */
export interface ComplianceAuditData {
    standard: ComplianceStandard;
    controlId: string;
    controlName: string;
    auditDate: Date;
    auditorId: string;
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT';
    findings: string[];
    recommendations: string[];
    evidenceIds: string[];
    nextAuditDate?: Date;
}
/**
 * @interface ForensicAnalysis
 * @description Forensic log analysis data
 */
export interface ForensicAnalysis {
    analysisId: string;
    incidentId?: string;
    analysisType: string;
    timeRange: {
        startDate: Date;
        endDate: Date;
    };
    scope: string[];
    findings: Array<{
        severity: AuditSeverity;
        description: string;
        evidence: string[];
    }>;
    timeline: Array<{
        timestamp: Date;
        event: string;
    }>;
    recommendations: string[];
}
/**
 * @interface LogRetentionPolicy
 * @description Log retention policy configuration
 */
export interface LogRetentionPolicy {
    policyId: string;
    policyName: string;
    eventTypes: AuditEventType[];
    retentionPeriod: RetentionPeriod;
    archivalEnabled: boolean;
    archivalDestination?: string;
    complianceStandards: ComplianceStandard[];
    autoDeleteEnabled: boolean;
}
/**
 * @interface AuditReport
 * @description Audit report structure
 */
export interface AuditReport {
    reportId: string;
    reportType: string;
    generatedBy: string;
    timeRange: {
        startDate: Date;
        endDate: Date;
    };
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topUsers: Array<{
        userId: string;
        eventCount: number;
    }>;
    anomalies: string[];
    complianceFindings?: string[];
}
/**
 * @interface ChainOfCustody
 * @description Evidence chain of custody tracking
 */
export interface ChainOfCustody {
    evidenceId: string;
    evidenceType: string;
    description: string;
    collectedBy: string;
    collectionDate: Date;
    custodyTransfers: Array<{
        fromUser: string;
        toUser: string;
        transferDate: Date;
        reason: string;
        hash: string;
    }>;
    integrityChecks: Array<{
        timestamp: Date;
        performedBy: string;
        hashValue: string;
        valid: boolean;
    }>;
    currentCustodian: string;
}
/**
 * @interface TamperDetection
 * @description Tamper detection result
 */
export interface TamperDetection {
    auditLogId: string;
    originalHash: string;
    currentHash: string;
    tampered: boolean;
    detectionDate: Date;
    tamperIndicators: string[];
    affectedRecords: string[];
}
/**
 * @class AuditLogDto
 * @description DTO for audit log entry
 */
export declare class AuditLogDto {
    id: string;
    eventType: AuditEventType;
    userId?: string;
    userName?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    severity: AuditSeverity;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    success: boolean;
    timestamp: Date;
    hash: string;
    details?: Record<string, any>;
    metadata?: Record<string, any>;
    status: AuditLogStatus;
}
/**
 * @class SecurityEventDto
 * @description DTO for security event
 */
export declare class SecurityEventDto {
    id: string;
    eventType: SecurityEventType;
    severity: AuditSeverity;
    userId?: string;
    ipAddress?: string;
    description: string;
    affectedResources?: string[];
    indicators?: string[];
    responseAction?: string;
    resolved: boolean;
    detectedAt: Date;
    resolvedAt?: Date;
}
/**
 * @class ComplianceAuditDto
 * @description DTO for compliance audit
 */
export declare class ComplianceAuditDto {
    id: string;
    standard: ComplianceStandard;
    controlId: string;
    controlName: string;
    auditDate: Date;
    auditorId: string;
    complianceStatus: string;
    findings: string[];
    recommendations: string[];
    evidenceIds: string[];
    nextAuditDate?: Date;
}
/**
 * @class ChainOfCustodyDto
 * @description DTO for chain of custody
 */
export declare class ChainOfCustodyDto {
    evidenceId: string;
    evidenceType: string;
    description: string;
    collectedBy: string;
    collectionDate: Date;
    custodyTransfers: Array<{
        fromUser: string;
        toUser: string;
        transferDate: Date;
        reason: string;
        hash: string;
    }>;
    currentCustodian: string;
    currentHash: string;
}
/**
 * Generates a tamper-proof audit log entry with cryptographic hash
 *
 * @param {AuditLogData} data - Audit log data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created audit log record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const auditLog = await generateAuditLog({
 *   eventType: AuditEventType.USER_LOGIN,
 *   userId: 'user-123',
 *   action: 'LOGIN_SUCCESS',
 *   resourceType: 'AUTHENTICATION',
 *   severity: AuditSeverity.INFORMATIONAL,
 *   ipAddress: '192.168.1.100',
 *   success: true,
 * }, sequelize);
 * ```
 */
export declare const generateAuditLog: (data: AuditLogData, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Retrieves audit logs with advanced filtering and pagination
 *
 * @param {Object} filters - Filter criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{logs: Model[], total: number}>} Audit logs and total count
 *
 * @example
 * ```typescript
 * const result = await getAuditLogs({
 *   userId: 'user-123',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   severity: [AuditSeverity.HIGH, AuditSeverity.CRITICAL],
 *   limit: 100,
 *   offset: 0,
 * }, sequelize);
 * ```
 */
export declare const getAuditLogs: (filters: {
    userId?: string;
    eventType?: AuditEventType;
    severity?: AuditSeverity[];
    startDate?: Date;
    endDate?: Date;
    resourceType?: string;
    success?: boolean;
    limit?: number;
    offset?: number;
}, sequelize: Sequelize) => Promise<{
    logs: Model[];
    total: number;
}>;
/**
 * Searches audit logs using full-text search
 *
 * @param {string} searchQuery - Search query string
 * @param {Object} options - Search options
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Matching audit logs
 *
 * @example
 * ```typescript
 * const results = await searchAuditLogs('failed login', {
 *   severity: AuditSeverity.HIGH,
 *   limit: 50,
 * }, sequelize);
 * ```
 */
export declare const searchAuditLogs: (searchQuery: string, options: {
    severity?: AuditSeverity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}, sequelize: Sequelize) => Promise<Model[]>;
/**
 * Updates audit log status (for review/investigation workflows)
 *
 * @param {string} auditLogId - Audit log ID
 * @param {AuditLogStatus} newStatus - New status
 * @param {string} reviewedBy - User ID performing the update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated audit log
 *
 * @example
 * ```typescript
 * const updated = await updateAuditLogStatus(
 *   'audit-123',
 *   AuditLogStatus.REVIEWED,
 *   'admin-456',
 *   sequelize
 * );
 * ```
 */
export declare const updateAuditLogStatus: (auditLogId: string, newStatus: AuditLogStatus, reviewedBy: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Archives old audit logs based on retention policy
 *
 * @param {Date} archiveBeforeDate - Archive logs before this date
 * @param {string} archivalDestination - Destination for archived logs
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{archivedCount: number}>} Number of logs archived
 *
 * @example
 * ```typescript
 * const result = await archiveAuditLogs(
 *   new Date('2024-01-01'),
 *   's3://audit-archive/',
 *   sequelize
 * );
 * console.log(`Archived ${result.archivedCount} logs`);
 * ```
 */
export declare const archiveAuditLogs: (archiveBeforeDate: Date, archivalDestination: string, sequelize: Sequelize) => Promise<{
    archivedCount: number;
}>;
/**
 * Exports audit logs to external format (JSON, CSV, PDF)
 *
 * @param {Object} filters - Export filters
 * @param {string} format - Export format ('JSON' | 'CSV' | 'PDF')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, recordCount: number, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportAuditLogs({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   userId: 'user-123',
 * }, 'JSON', sequelize);
 * ```
 */
export declare const exportAuditLogs: (filters: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    eventType?: AuditEventType;
}, format: "JSON" | "CSV" | "PDF", sequelize: Sequelize) => Promise<{
    exportId: string;
    recordCount: number;
    exportPath: string;
}>;
/**
 * Purges audit logs permanently (after retention period)
 *
 * @param {Date} purgeBeforeDate - Purge logs before this date
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{purgedCount: number}>} Number of logs purged
 *
 * @example
 * ```typescript
 * const result = await purgeAuditLogs(new Date('2020-01-01'), sequelize);
 * console.log(`Purged ${result.purgedCount} old logs`);
 * ```
 */
export declare const purgeAuditLogs: (purgeBeforeDate: Date, sequelize: Sequelize, transaction?: Transaction) => Promise<{
    purgedCount: number;
}>;
/**
 * Aggregates audit log statistics by time period
 *
 * @param {Object} params - Aggregation parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Aggregated statistics
 *
 * @example
 * ```typescript
 * const stats = await aggregateAuditLogStatistics({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   groupBy: 'day',
 * }, sequelize);
 * ```
 */
export declare const aggregateAuditLogStatistics: (params: {
    startDate: Date;
    endDate: Date;
    groupBy: "hour" | "day" | "week" | "month";
}, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Tracks a security event with automatic correlation
 *
 * @param {SecurityEvent} event - Security event data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created security event record
 *
 * @example
 * ```typescript
 * const event = await trackSecurityEvent({
 *   eventType: SecurityEventType.FAILED_LOGIN_ATTEMPT,
 *   severity: AuditSeverity.MEDIUM,
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.50',
 *   description: 'Multiple failed login attempts detected',
 *   resolved: false,
 * }, sequelize);
 * ```
 */
export declare const trackSecurityEvent: (event: SecurityEvent, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Correlates related security events to identify patterns
 *
 * @param {string} eventId - Primary security event ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{correlatedEvents: Model[], patterns: string[]}>} Correlated events and patterns
 *
 * @example
 * ```typescript
 * const correlation = await correlateSecurityEvents('sec-event-123', sequelize);
 * console.log(`Found ${correlation.correlatedEvents.length} related events`);
 * ```
 */
export declare const correlateSecurityEvents: (eventId: string, sequelize: Sequelize) => Promise<{
    correlatedEvents: Model[];
    patterns: string[];
}>;
/**
 * Resolves a security event with resolution details
 *
 * @param {string} eventId - Security event ID
 * @param {string} resolvedBy - User ID resolving the event
 * @param {string} resolution - Resolution description
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated security event
 *
 * @example
 * ```typescript
 * const resolved = await resolveSecurityEvent(
 *   'sec-event-123',
 *   'admin-456',
 *   'False positive - legitimate user behavior',
 *   sequelize
 * );
 * ```
 */
export declare const resolveSecurityEvent: (eventId: string, resolvedBy: string, resolution: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Gets security event summary by type and severity
 *
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Security event summary
 *
 * @example
 * ```typescript
 * const summary = await getSecurityEventSummary(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const getSecurityEventSummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Escalates security event to incident response team
 *
 * @param {string} eventId - Security event ID
 * @param {string} escalatedBy - User ID escalating the event
 * @param {string} reason - Escalation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{incidentId: string}>} Created incident ID
 *
 * @example
 * ```typescript
 * const incident = await escalateSecurityEvent(
 *   'sec-event-123',
 *   'analyst-789',
 *   'Potential data breach detected',
 *   sequelize
 * );
 * ```
 */
export declare const escalateSecurityEvent: (eventId: string, escalatedBy: string, reason: string, sequelize: Sequelize) => Promise<{
    incidentId: string;
}>;
/**
 * Generates real-time security event alerts
 *
 * @param {Object} alertConfig - Alert configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{alertsTriggered: number}>} Number of alerts triggered
 *
 * @example
 * ```typescript
 * const result = await generateSecurityEventAlerts({
 *   severityThreshold: AuditSeverity.HIGH,
 *   eventTypes: [SecurityEventType.BRUTE_FORCE_DETECTED],
 *   recipients: ['security-team@company.com'],
 * }, sequelize);
 * ```
 */
export declare const generateSecurityEventAlerts: (alertConfig: {
    severityThreshold: AuditSeverity;
    eventTypes?: SecurityEventType[];
    recipients: string[];
    timeWindow?: number;
}, sequelize: Sequelize) => Promise<{
    alertsTriggered: number;
}>;
/**
 * Records user access to resources with full audit trail
 *
 * @param {AccessAudit} accessData - Access audit data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created access audit record
 *
 * @example
 * ```typescript
 * const accessLog = await recordAccessAudit({
 *   userId: 'user-123',
 *   resourceType: 'PATIENT_RECORD',
 *   resourceId: 'patient-456',
 *   accessType: 'READ',
 *   accessGranted: true,
 *   timestamp: new Date(),
 *   ipAddress: '192.168.1.100',
 * }, sequelize);
 * ```
 */
export declare const recordAccessAudit: (accessData: AccessAudit, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Gets user access history for specific resource
 *
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Access history records
 *
 * @example
 * ```typescript
 * const history = await getUserAccessHistory(
 *   'user-123',
 *   'PATIENT_RECORD',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const getUserAccessHistory: (userId: string, resourceType: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Model[]>;
/**
 * Gets resource access history (who accessed specific resource)
 *
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Access history for resource
 *
 * @example
 * ```typescript
 * const accessors = await getResourceAccessHistory(
 *   'FINANCIAL_RECORD',
 *   'record-789',
 *   sequelize
 * );
 * ```
 */
export declare const getResourceAccessHistory: (resourceType: string, resourceId: string, sequelize: Sequelize) => Promise<Model[]>;
/**
 * Detects unusual access patterns for anomaly detection
 *
 * @param {string} userId - User ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{anomalies: Array<Record<string, any>>}>} Detected anomalies
 *
 * @example
 * ```typescript
 * const result = await detectUnusualAccessPatterns('user-123', sequelize);
 * console.log(`Found ${result.anomalies.length} unusual patterns`);
 * ```
 */
export declare const detectUnusualAccessPatterns: (userId: string, sequelize: Sequelize) => Promise<{
    anomalies: Array<Record<string, any>>;
}>;
/**
 * Generates access control effectiveness report
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Access control report
 *
 * @example
 * ```typescript
 * const report = await generateAccessControlReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const generateAccessControlReport: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Tracks privileged access (admin/elevated permissions)
 *
 * @param {Object} privilegedAccessData - Privileged access data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created privileged access record
 *
 * @example
 * ```typescript
 * const privilegedAccess = await trackPrivilegedAccess({
 *   userId: 'admin-123',
 *   privilegeLevel: 'SUPERUSER',
 *   action: 'DATABASE_MODIFICATION',
 *   justification: 'Emergency data correction',
 * }, sequelize);
 * ```
 */
export declare const trackPrivilegedAccess: (privilegedAccessData: {
    userId: string;
    privilegeLevel: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    justification: string;
    approvedBy?: string;
}, sequelize: Sequelize) => Promise<Model>;
/**
 * Records data change with full versioning support
 *
 * @param {ChangeRecord} changeData - Change record data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created change record
 *
 * @example
 * ```typescript
 * const changeRecord = await recordDataChange({
 *   entityType: 'USER',
 *   entityId: 'user-123',
 *   changeType: 'UPDATE',
 *   userId: 'admin-456',
 *   fieldName: 'email',
 *   oldValue: 'old@example.com',
 *   newValue: 'new@example.com',
 *   version: 5,
 *   changeReason: 'User request',
 * }, sequelize);
 * ```
 */
export declare const recordDataChange: (changeData: ChangeRecord, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Gets complete change history for an entity
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model[]>} Change history records
 *
 * @example
 * ```typescript
 * const history = await getEntityChangeHistory('CUSTOMER', 'customer-789', sequelize);
 * console.log(`Entity has ${history.length} change records`);
 * ```
 */
export declare const getEntityChangeHistory: (entityType: string, entityId: string, sequelize: Sequelize) => Promise<Model[]>;
/**
 * Compares two versions of an entity
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Version comparison
 *
 * @example
 * ```typescript
 * const diff = await compareEntityVersions('PRODUCT', 'product-123', 1, 5, sequelize);
 * console.log('Changes:', diff.differences);
 * ```
 */
export declare const compareEntityVersions: (entityType: string, entityId: string, version1: number, version2: number, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Rolls back entity to previous version
 *
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} targetVersion - Version to rollback to
 * @param {string} rolledBackBy - User ID performing rollback
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{rollbackId: string, changesReverted: number}>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackToVersion(
 *   'CONFIGURATION',
 *   'config-123',
 *   3,
 *   'admin-456',
 *   sequelize
 * );
 * ```
 */
export declare const rollbackToVersion: (entityType: string, entityId: string, targetVersion: number, rolledBackBy: string, sequelize: Sequelize) => Promise<{
    rollbackId: string;
    changesReverted: number;
}>;
/**
 * Generates change tracking report
 *
 * @param {Object} params - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Change tracking report
 *
 * @example
 * ```typescript
 * const report = await generateChangeTrackingReport({
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   entityType: 'CUSTOMER',
 * }, sequelize);
 * ```
 */
export declare const generateChangeTrackingReport: (params: {
    startDate: Date;
    endDate: Date;
    entityType?: string;
    userId?: string;
}, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Creates compliance audit entry
 *
 * @param {ComplianceAuditData} auditData - Compliance audit data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created compliance audit record
 *
 * @example
 * ```typescript
 * const audit = await createComplianceAudit({
 *   standard: ComplianceStandard.HIPAA,
 *   controlId: 'HIPAA-164.308(a)(1)',
 *   controlName: 'Security Management Process',
 *   auditDate: new Date(),
 *   auditorId: 'auditor-123',
 *   complianceStatus: 'COMPLIANT',
 *   findings: [],
 *   recommendations: [],
 *   evidenceIds: ['evidence-1', 'evidence-2'],
 * }, sequelize);
 * ```
 */
export declare const createComplianceAudit: (auditData: ComplianceAuditData, sequelize: Sequelize) => Promise<Model>;
/**
 * Validates compliance requirements for a standard
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateComplianceRequirements(
 *   ComplianceStandard.SOC2_TYPE_II,
 *   sequelize
 * );
 * console.log('Compliance score:', validation.complianceScore);
 * ```
 */
export declare const validateComplianceRequirements: (standard: ComplianceStandard, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Generates compliance audit report
 *
 * @param {Object} params - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceAuditReport({
 *   standard: ComplianceStandard.GDPR,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   scope: ['data-protection', 'privacy'],
 * }, sequelize);
 * ```
 */
export declare const generateComplianceAuditReport: (params: {
    standard: ComplianceStandard;
    startDate: Date;
    endDate: Date;
    scope?: string[];
}, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Maps audit logs to compliance controls
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Mapping results
 *
 * @example
 * ```typescript
 * const mapping = await mapAuditLogsToCompliance(
 *   ComplianceStandard.PCI_DSS,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const mapAuditLogsToCompliance: (standard: ComplianceStandard, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Tracks compliance evidence and artifacts
 *
 * @param {Object} evidenceData - Evidence data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created evidence record
 *
 * @example
 * ```typescript
 * const evidence = await trackComplianceEvidence({
 *   standard: ComplianceStandard.ISO_27001,
 *   controlId: 'A.9.2.1',
 *   evidenceType: 'ACCESS_LOG',
 *   description: 'User access logs for Q1 2025',
 *   filePath: '/evidence/access-logs-q1-2025.pdf',
 *   collectedBy: 'auditor-123',
 * }, sequelize);
 * ```
 */
export declare const trackComplianceEvidence: (evidenceData: {
    standard: ComplianceStandard;
    controlId: string;
    evidenceType: string;
    description: string;
    filePath?: string;
    collectedBy: string;
    metadata?: Record<string, any>;
}, sequelize: Sequelize) => Promise<Model>;
/**
 * Performs forensic analysis on audit logs
 *
 * @param {Object} analysisParams - Analysis parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ForensicAnalysis>} Forensic analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performForensicAnalysis({
 *   incidentId: 'incident-123',
 *   analysisType: 'DATA_BREACH_INVESTIGATION',
 *   timeRange: {
 *     startDate: new Date('2025-01-15'),
 *     endDate: new Date('2025-01-20'),
 *   },
 *   scope: ['user-123', '192.168.1.50'],
 * }, sequelize);
 * ```
 */
export declare const performForensicAnalysis: (analysisParams: {
    incidentId?: string;
    analysisType: string;
    timeRange: {
        startDate: Date;
        endDate: Date;
    };
    scope: string[];
}, sequelize: Sequelize) => Promise<ForensicAnalysis>;
/**
 * Reconstructs timeline of events for investigation
 *
 * @param {Object} params - Timeline reconstruction parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Reconstructed timeline
 *
 * @example
 * ```typescript
 * const timeline = await reconstructEventTimeline({
 *   userId: 'user-123',
 *   startDate: new Date('2025-01-15T14:00:00Z'),
 *   endDate: new Date('2025-01-15T16:00:00Z'),
 * }, sequelize);
 * ```
 */
export declare const reconstructEventTimeline: (params: {
    userId?: string;
    ipAddress?: string;
    resourceId?: string;
    startDate: Date;
    endDate: Date;
}, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Analyzes log patterns for anomaly detection
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{anomalies: Array<Record<string, any>>}>} Detected anomalies
 *
 * @example
 * ```typescript
 * const result = await analyzeLogPatterns(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * console.log(`Detected ${result.anomalies.length} anomalies`);
 * ```
 */
export declare const analyzeLogPatterns: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
    anomalies: Array<Record<string, any>>;
}>;
/**
 * Generates forensic investigation report
 *
 * @param {string} analysisId - Forensic analysis ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Investigation report
 *
 * @example
 * ```typescript
 * const report = await generateForensicReport('forensic-123', sequelize);
 * ```
 */
export declare const generateForensicReport: (analysisId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Creates log retention policy
 *
 * @param {LogRetentionPolicy} policy - Retention policy data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created retention policy
 *
 * @example
 * ```typescript
 * const policy = await createLogRetentionPolicy({
 *   policyId: 'policy-001',
 *   policyName: 'HIPAA Audit Log Retention',
 *   eventTypes: [AuditEventType.DATA_ACCESS, AuditEventType.DATA_MODIFICATION],
 *   retentionPeriod: RetentionPeriod.YEARS_7,
 *   archivalEnabled: true,
 *   archivalDestination: 's3://audit-archive/',
 *   complianceStandards: [ComplianceStandard.HIPAA],
 *   autoDeleteEnabled: false,
 * }, sequelize);
 * ```
 */
export declare const createLogRetentionPolicy: (policy: LogRetentionPolicy, sequelize: Sequelize) => Promise<Model>;
/**
 * Applies retention policies to audit logs
 *
 * @param {string} policyId - Retention policy ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{processed: number, archived: number, deleted: number}>} Application results
 *
 * @example
 * ```typescript
 * const result = await applyRetentionPolicy('policy-001', sequelize);
 * console.log(`Archived ${result.archived} logs, deleted ${result.deleted} logs`);
 * ```
 */
export declare const applyRetentionPolicy: (policyId: string, sequelize: Sequelize) => Promise<{
    processed: number;
    archived: number;
    deleted: number;
}>;
/**
 * Generates comprehensive audit report
 *
 * @param {Object} reportParams - Report parameters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AuditReport>} Generated audit report
 *
 * @example
 * ```typescript
 * const report = await generateAuditReport({
 *   reportType: 'MONTHLY_SECURITY_AUDIT',
 *   generatedBy: 'admin-123',
 *   timeRange: {
 *     startDate: new Date('2025-01-01'),
 *     endDate: new Date('2025-01-31'),
 *   },
 * }, sequelize);
 * ```
 */
export declare const generateAuditReport: (reportParams: {
    reportType: string;
    generatedBy: string;
    timeRange: {
        startDate: Date;
        endDate: Date;
    };
    filters?: {
        userId?: string;
        severity?: AuditSeverity[];
        eventTypes?: AuditEventType[];
    };
}, sequelize: Sequelize) => Promise<AuditReport>;
/**
 * Schedules automated audit report generation
 *
 * @param {Object} scheduleConfig - Schedule configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{scheduleId: string}>} Created schedule ID
 *
 * @example
 * ```typescript
 * const schedule = await scheduleAuditReport({
 *   reportType: 'WEEKLY_SECURITY_SUMMARY',
 *   frequency: 'WEEKLY',
 *   recipients: ['security-team@company.com'],
 *   generatedBy: 'system',
 * }, sequelize);
 * ```
 */
export declare const scheduleAuditReport: (scheduleConfig: {
    reportType: string;
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
    recipients: string[];
    generatedBy: string;
    filters?: Record<string, any>;
}, sequelize: Sequelize) => Promise<{
    scheduleId: string;
}>;
/**
 * Tracks chain of custody for evidence
 *
 * @param {ChainOfCustody} custodyData - Chain of custody data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created chain of custody record
 *
 * @example
 * ```typescript
 * const custody = await trackChainOfCustody({
 *   evidenceId: 'evidence-123',
 *   evidenceType: 'AUDIT_LOG',
 *   description: 'Audit logs for security incident #456',
 *   collectedBy: 'investigator-789',
 *   collectionDate: new Date(),
 *   custodyTransfers: [],
 *   integrityChecks: [],
 *   currentCustodian: 'investigator-789',
 * }, sequelize);
 * ```
 */
export declare const trackChainOfCustody: (custodyData: ChainOfCustody, sequelize: Sequelize) => Promise<Model>;
/**
 * Detects tampering in audit logs using cryptographic verification
 *
 * @param {string} auditLogId - Audit log ID to verify
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TamperDetection>} Tamper detection results
 *
 * @example
 * ```typescript
 * const detection = await detectLogTampering('audit-123', sequelize);
 * if (detection.tampered) {
 *   console.log('ALERT: Audit log tampering detected!');
 * }
 * ```
 */
export declare const detectLogTampering: (auditLogId: string, sequelize: Sequelize) => Promise<TamperDetection>;
declare const _default: {
    generateAuditLog: (data: AuditLogData, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    getAuditLogs: (filters: {
        userId?: string;
        eventType?: AuditEventType;
        severity?: AuditSeverity[];
        startDate?: Date;
        endDate?: Date;
        resourceType?: string;
        success?: boolean;
        limit?: number;
        offset?: number;
    }, sequelize: Sequelize) => Promise<{
        logs: Model[];
        total: number;
    }>;
    searchAuditLogs: (searchQuery: string, options: {
        severity?: AuditSeverity;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }, sequelize: Sequelize) => Promise<Model[]>;
    updateAuditLogStatus: (auditLogId: string, newStatus: AuditLogStatus, reviewedBy: string, sequelize: Sequelize) => Promise<Model>;
    archiveAuditLogs: (archiveBeforeDate: Date, archivalDestination: string, sequelize: Sequelize) => Promise<{
        archivedCount: number;
    }>;
    exportAuditLogs: (filters: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
        eventType?: AuditEventType;
    }, format: "JSON" | "CSV" | "PDF", sequelize: Sequelize) => Promise<{
        exportId: string;
        recordCount: number;
        exportPath: string;
    }>;
    purgeAuditLogs: (purgeBeforeDate: Date, sequelize: Sequelize, transaction?: Transaction) => Promise<{
        purgedCount: number;
    }>;
    aggregateAuditLogStatistics: (params: {
        startDate: Date;
        endDate: Date;
        groupBy: "hour" | "day" | "week" | "month";
    }, sequelize: Sequelize) => Promise<Record<string, any>>;
    trackSecurityEvent: (event: SecurityEvent, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    correlateSecurityEvents: (eventId: string, sequelize: Sequelize) => Promise<{
        correlatedEvents: Model[];
        patterns: string[];
    }>;
    resolveSecurityEvent: (eventId: string, resolvedBy: string, resolution: string, sequelize: Sequelize) => Promise<Model>;
    getSecurityEventSummary: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
    escalateSecurityEvent: (eventId: string, escalatedBy: string, reason: string, sequelize: Sequelize) => Promise<{
        incidentId: string;
    }>;
    generateSecurityEventAlerts: (alertConfig: {
        severityThreshold: AuditSeverity;
        eventTypes?: SecurityEventType[];
        recipients: string[];
        timeWindow?: number;
    }, sequelize: Sequelize) => Promise<{
        alertsTriggered: number;
    }>;
    recordAccessAudit: (accessData: AccessAudit, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    getUserAccessHistory: (userId: string, resourceType: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Model[]>;
    getResourceAccessHistory: (resourceType: string, resourceId: string, sequelize: Sequelize) => Promise<Model[]>;
    detectUnusualAccessPatterns: (userId: string, sequelize: Sequelize) => Promise<{
        anomalies: Array<Record<string, any>>;
    }>;
    generateAccessControlReport: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
    trackPrivilegedAccess: (privilegedAccessData: {
        userId: string;
        privilegeLevel: string;
        action: string;
        resourceType?: string;
        resourceId?: string;
        justification: string;
        approvedBy?: string;
    }, sequelize: Sequelize) => Promise<Model>;
    recordDataChange: (changeData: ChangeRecord, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    getEntityChangeHistory: (entityType: string, entityId: string, sequelize: Sequelize) => Promise<Model[]>;
    compareEntityVersions: (entityType: string, entityId: string, version1: number, version2: number, sequelize: Sequelize) => Promise<Record<string, any>>;
    rollbackToVersion: (entityType: string, entityId: string, targetVersion: number, rolledBackBy: string, sequelize: Sequelize) => Promise<{
        rollbackId: string;
        changesReverted: number;
    }>;
    generateChangeTrackingReport: (params: {
        startDate: Date;
        endDate: Date;
        entityType?: string;
        userId?: string;
    }, sequelize: Sequelize) => Promise<Record<string, any>>;
    createComplianceAudit: (auditData: ComplianceAuditData, sequelize: Sequelize) => Promise<Model>;
    validateComplianceRequirements: (standard: ComplianceStandard, sequelize: Sequelize) => Promise<Record<string, any>>;
    generateComplianceAuditReport: (params: {
        standard: ComplianceStandard;
        startDate: Date;
        endDate: Date;
        scope?: string[];
    }, sequelize: Sequelize) => Promise<Record<string, any>>;
    mapAuditLogsToCompliance: (standard: ComplianceStandard, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Record<string, any>>;
    trackComplianceEvidence: (evidenceData: {
        standard: ComplianceStandard;
        controlId: string;
        evidenceType: string;
        description: string;
        filePath?: string;
        collectedBy: string;
        metadata?: Record<string, any>;
    }, sequelize: Sequelize) => Promise<Model>;
    performForensicAnalysis: (analysisParams: {
        incidentId?: string;
        analysisType: string;
        timeRange: {
            startDate: Date;
            endDate: Date;
        };
        scope: string[];
    }, sequelize: Sequelize) => Promise<ForensicAnalysis>;
    reconstructEventTimeline: (params: {
        userId?: string;
        ipAddress?: string;
        resourceId?: string;
        startDate: Date;
        endDate: Date;
    }, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    analyzeLogPatterns: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
        anomalies: Array<Record<string, any>>;
    }>;
    generateForensicReport: (analysisId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    createLogRetentionPolicy: (policy: LogRetentionPolicy, sequelize: Sequelize) => Promise<Model>;
    applyRetentionPolicy: (policyId: string, sequelize: Sequelize) => Promise<{
        processed: number;
        archived: number;
        deleted: number;
    }>;
    generateAuditReport: (reportParams: {
        reportType: string;
        generatedBy: string;
        timeRange: {
            startDate: Date;
            endDate: Date;
        };
        filters?: {
            userId?: string;
            severity?: AuditSeverity[];
            eventTypes?: AuditEventType[];
        };
    }, sequelize: Sequelize) => Promise<AuditReport>;
    scheduleAuditReport: (scheduleConfig: {
        reportType: string;
        frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
        recipients: string[];
        generatedBy: string;
        filters?: Record<string, any>;
    }, sequelize: Sequelize) => Promise<{
        scheduleId: string;
    }>;
    trackChainOfCustody: (custodyData: ChainOfCustody, sequelize: Sequelize) => Promise<Model>;
    detectLogTampering: (auditLogId: string, sequelize: Sequelize) => Promise<TamperDetection>;
};
export default _default;
//# sourceMappingURL=security-audit-trail-kit.d.ts.map