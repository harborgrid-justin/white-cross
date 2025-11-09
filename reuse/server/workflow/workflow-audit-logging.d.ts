/**
 * LOC: WF-AUDIT-LOG-001
 * File: /reuse/server/workflow/workflow-audit-logging.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM)
 *   - @nestjs/common (framework)
 *   - zod (validation)
 *   - crypto (hashing for integrity)
 *   - ../../error-handling-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend workflow services
 *   - Compliance monitoring services
 *   - Security audit systems
 *   - Regulatory reporting engines
 *   - Forensic analysis tools
 */
/**
 * File: /reuse/server/workflow/workflow-audit-logging.ts
 * Locator: WC-WF-AUDIT-LOG-001
 * Purpose: Comprehensive Workflow Audit and Compliance Logging - Enterprise-grade audit trail management
 *
 * Upstream: Sequelize, NestJS, Zod, Crypto, Error handling utilities, Auditing utilities
 * Downstream: ../backend/*, Compliance services, audit systems, reporting engines, forensic tools
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 45 utility functions for activity logging, state tracking, user auditing, data change logging,
 *          performance metrics logging, error logging, audit queries, compliance reporting, retention policies,
 *          log archiving, audit trail verification, tamper detection, regulatory export
 *
 * LLM Context: Enterprise-grade workflow audit logging system for HIPAA, SOC2, GDPR, and SOX compliance.
 * Provides comprehensive activity logging with immutable audit trails, state change tracking with
 * before/after snapshots, user action auditing with role-based filtering, detailed data change logging,
 * performance metrics capture, comprehensive error logging with stack traces, advanced audit query interface
 * with temporal queries, automated compliance report generation (HIPAA/SOC2/GDPR/SOX), configurable log
 * retention policies, automated log archiving with compression, cryptographic audit trail verification,
 * tamper detection with hash chains, log anonymization for GDPR, log enrichment with contextual data,
 * real-time audit event streaming, and forensic analysis support.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Audit event types representing different categories of auditable actions
 *
 * @enum {string}
 * @property {string} PROCESS_START - Process instance started
 * @property {string} PROCESS_COMPLETE - Process instance completed successfully
 * @property {string} PROCESS_FAIL - Process instance failed
 * @property {string} PROCESS_CANCEL - Process instance cancelled by user
 * @property {string} PROCESS_SUSPEND - Process instance suspended
 * @property {string} PROCESS_RESUME - Process instance resumed
 * @property {string} ACTIVITY_START - Activity/task started
 * @property {string} ACTIVITY_COMPLETE - Activity/task completed
 * @property {string} USER_CLAIM - User claimed a task
 * @property {string} USER_UNCLAIM - User unclaimed a task
 * @property {string} USER_DELEGATE - Task delegated to another user
 * @property {string} VARIABLE_CREATE - Process variable created
 * @property {string} VARIABLE_UPDATE - Process variable updated
 * @property {string} VARIABLE_DELETE - Process variable deleted
 * @property {string} DECISION_EVALUATE - Gateway or decision evaluated
 * @property {string} ERROR_BOUNDARY - Error boundary triggered
 * @property {string} COMPENSATION - Compensation activity executed
 * @property {string} ESCALATION - Task escalated due to timeout/SLA
 * @property {string} MESSAGE_SEND - Message sent to external system
 * @property {string} MESSAGE_RECEIVE - Message received from external system
 * @property {string} TIMER_TRIGGER - Timer event triggered
 * @property {string} SIGNAL_TRIGGER - Signal event triggered
 * @property {string} API_CALL - External API called
 * @property {string} DATA_ACCESS - Sensitive data accessed
 * @property {string} PERMISSION_CHECK - Permission/authorization check
 * @property {string} ADMIN_ACTION - Administrative action performed
 */
export declare enum AuditEventType {
    PROCESS_START = "process_start",
    PROCESS_COMPLETE = "process_complete",
    PROCESS_FAIL = "process_fail",
    PROCESS_CANCEL = "process_cancel",
    PROCESS_SUSPEND = "process_suspend",
    PROCESS_RESUME = "process_resume",
    ACTIVITY_START = "activity_start",
    ACTIVITY_COMPLETE = "activity_complete",
    USER_CLAIM = "user_claim",
    USER_UNCLAIM = "user_unclaim",
    USER_DELEGATE = "user_delegate",
    VARIABLE_CREATE = "variable_create",
    VARIABLE_UPDATE = "variable_update",
    VARIABLE_DELETE = "variable_delete",
    DECISION_EVALUATE = "decision_evaluate",
    ERROR_BOUNDARY = "error_boundary",
    COMPENSATION = "compensation",
    ESCALATION = "escalation",
    MESSAGE_SEND = "message_send",
    MESSAGE_RECEIVE = "message_receive",
    TIMER_TRIGGER = "timer_trigger",
    SIGNAL_TRIGGER = "signal_trigger",
    API_CALL = "api_call",
    DATA_ACCESS = "data_access",
    PERMISSION_CHECK = "permission_check",
    ADMIN_ACTION = "admin_action"
}
/**
 * Audit severity levels for filtering and alerting
 *
 * @enum {string}
 */
export declare enum AuditSeverity {
    DEBUG = "debug",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical",
    SECURITY = "security"
}
/**
 * Compliance standards supported for reporting
 *
 * @enum {string}
 */
export declare enum ComplianceStandard {
    HIPAA = "hipaa",
    SOC2 = "soc2",
    GDPR = "gdpr",
    SOX = "sox",
    PCI_DSS = "pci_dss",
    ISO27001 = "iso27001",
    NIST = "nist"
}
/**
 * Log retention policy types
 *
 * @enum {string}
 */
export declare enum RetentionPolicy {
    SHORT_TERM = "short_term",// 30 days
    MEDIUM_TERM = "medium_term",// 1 year
    LONG_TERM = "long_term",// 7 years (regulatory)
    PERMANENT = "permanent",// Never delete
    CUSTOM = "custom"
}
/**
 * Archive status for audit logs
 *
 * @enum {string}
 */
export declare enum ArchiveStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    COMPRESSED = "compressed",
    COLD_STORAGE = "cold_storage",
    DELETED = "deleted"
}
/**
 * Audit log entry interface
 *
 * @interface AuditLog
 * @property {string} id - Unique audit log entry ID
 * @property {AuditEventType} eventType - Type of audited event
 * @property {AuditSeverity} severity - Event severity level
 * @property {Date} timestamp - When the event occurred
 * @property {string} [userId] - User who performed the action
 * @property {string} [processInstanceId] - Related process instance
 * @property {string} [activityId] - Related activity ID
 * @property {string} entityType - Type of entity affected (process, task, variable)
 * @property {string} [entityId] - ID of affected entity
 * @property {string} action - Action performed (create, update, delete, execute)
 * @property {Record<string, any>} [beforeState] - Entity state before action
 * @property {Record<string, any>} [afterState] - Entity state after action
 * @property {Record<string, any>} metadata - Additional contextual information
 * @property {string} [ipAddress] - IP address of request origin
 * @property {string} [userAgent] - User agent string
 * @property {number} [duration] - Action duration in milliseconds
 * @property {boolean} success - Whether action succeeded
 * @property {string} [errorMessage] - Error message if action failed
 * @property {string} [stackTrace] - Stack trace for errors
 * @property {string} hash - Cryptographic hash for integrity verification
 * @property {string} [previousHash] - Hash of previous log entry (chain)
 * @property {ArchiveStatus} archiveStatus - Current archive status
 * @property {Date} [archivedAt] - When log was archived
 * @property {Date} expiresAt - When log should be deleted per retention policy
 */
export interface AuditLog {
    id: string;
    eventType: AuditEventType;
    severity: AuditSeverity;
    timestamp: Date;
    userId?: string;
    processInstanceId?: string;
    activityId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    success: boolean;
    errorMessage?: string;
    stackTrace?: string;
    hash: string;
    previousHash?: string;
    archiveStatus: ArchiveStatus;
    archivedAt?: Date;
    expiresAt: Date;
}
/**
 * Audit query parameters for advanced filtering
 *
 * @interface AuditQuery
 * @property {AuditEventType[]} [eventTypes] - Filter by event types
 * @property {AuditSeverity[]} [severities] - Filter by severity levels
 * @property {Date} [startDate] - Start of date range
 * @property {Date} [endDate] - End of date range
 * @property {string[]} [userIds] - Filter by user IDs
 * @property {string[]} [processInstanceIds] - Filter by process instances
 * @property {string} [entityType] - Filter by entity type
 * @property {boolean} [successOnly] - Only successful actions
 * @property {boolean} [errorsOnly] - Only failed actions
 * @property {number} [limit] - Maximum number of results
 * @property {number} [offset] - Pagination offset
 * @property {string} [sortBy] - Field to sort by
 * @property {'ASC'|'DESC'} [sortOrder] - Sort direction
 */
export interface AuditQuery {
    eventTypes?: AuditEventType[];
    severities?: AuditSeverity[];
    startDate?: Date;
    endDate?: Date;
    userIds?: string[];
    processInstanceIds?: string[];
    entityType?: string;
    successOnly?: boolean;
    errorsOnly?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Compliance report interface
 *
 * @interface ComplianceReport
 * @property {string} id - Report ID
 * @property {ComplianceStandard} standard - Compliance standard
 * @property {Date} startDate - Report period start
 * @property {Date} endDate - Report period end
 * @property {Date} generatedAt - When report was generated
 * @property {string} generatedBy - User who generated report
 * @property {number} totalEvents - Total audit events in period
 * @property {number} securityEvents - Number of security-related events
 * @property {number} failedActions - Number of failed actions
 * @property {number} dataAccessEvents - Number of data access events
 * @property {Record<string, number>} eventTypeCounts - Counts by event type
 * @property {Record<string, number>} userActivityCounts - Activity counts by user
 * @property {any[]} violations - Potential compliance violations
 * @property {Record<string, any>} summary - Executive summary
 */
export interface ComplianceReport {
    id: string;
    standard: ComplianceStandard;
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    generatedBy: string;
    totalEvents: number;
    securityEvents: number;
    failedActions: number;
    dataAccessEvents: number;
    eventTypeCounts: Record<string, number>;
    userActivityCounts: Record<string, number>;
    violations: any[];
    summary: Record<string, any>;
}
/**
 * Retention policy configuration
 *
 * @interface RetentionPolicyConfig
 * @property {string} id - Policy ID
 * @property {string} name - Policy name
 * @property {RetentionPolicy} type - Policy type
 * @property {number} retentionDays - Number of days to retain
 * @property {AuditEventType[]} [appliesTo] - Event types this policy applies to
 * @property {boolean} autoArchive - Automatically archive before deletion
 * @property {boolean} enabled - Whether policy is active
 */
export interface RetentionPolicyConfig {
    id: string;
    name: string;
    type: RetentionPolicy;
    retentionDays: number;
    appliesTo?: AuditEventType[];
    autoArchive: boolean;
    enabled: boolean;
}
/**
 * Zod schema for audit log creation
 */
export declare const CreateAuditLogSchema: any;
/**
 * Zod schema for audit query validation
 */
export declare const AuditQuerySchema: any;
/**
 * Zod schema for retention policy validation
 */
export declare const RetentionPolicySchema: any;
/**
 * Sequelize model for AuditLog table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} AuditLog model
 */
export declare function createAuditLogModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for ComplianceReport table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceReport model
 */
export declare function createComplianceReportModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Sequelize model for RetentionPolicy table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RetentionPolicy model
 */
export declare function createRetentionPolicyModel(sequelize: Sequelize): {
    new (): {};
};
/**
 * Creates a comprehensive audit log entry with integrity verification
 *
 * @async
 * @param {Object} params - Audit log parameters
 * @param {typeof Model} params.model - Sequelize AuditLog model
 * @param {AuditEventType} params.eventType - Type of audit event
 * @param {AuditSeverity} [params.severity=AuditSeverity.INFO] - Event severity
 * @param {string} [params.userId] - User performing the action
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {string} [params.activityId] - Related activity ID
 * @param {string} params.entityType - Type of entity (process, task, variable)
 * @param {string} [params.entityId] - Entity ID
 * @param {string} params.action - Action performed
 * @param {Record<string, any>} [params.beforeState] - State before action
 * @param {Record<string, any>} [params.afterState] - State after action
 * @param {Record<string, any>} [params.metadata={}] - Additional metadata
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - Client user agent
 * @param {number} [params.duration] - Action duration in ms
 * @param {boolean} [params.success=true] - Whether action succeeded
 * @param {string} [params.errorMessage] - Error message if failed
 * @param {string} [params.stackTrace] - Stack trace if error
 * @param {number} [params.retentionDays=365] - Days to retain log
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log entry
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * const auditLog = await createAuditLog({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.PROCESS_START,
 *   severity: AuditSeverity.INFO,
 *   userId: 'user-123',
 *   processInstanceId: 'proc-456',
 *   entityType: 'process',
 *   entityId: 'proc-456',
 *   action: 'start',
 *   afterState: { status: 'running' },
 *   metadata: { initiator: 'api', source: 'rest' },
 *   ipAddress: '192.168.1.1',
 *   success: true,
 * });
 * ```
 *
 * @remarks
 * - Automatically creates hash chain for tamper detection
 * - Links to previous audit log entry via previousHash
 * - Immutable once created (no updates allowed)
 * - Includes cryptographic integrity verification
 * - Supports HIPAA, SOC2, GDPR compliance requirements
 */
export declare function createAuditLog(params: {
    model: typeof Model;
    eventType: AuditEventType;
    severity?: AuditSeverity;
    userId?: string;
    processInstanceId?: string;
    activityId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    duration?: number;
    success?: boolean;
    errorMessage?: string;
    stackTrace?: string;
    retentionDays?: number;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs a process lifecycle event (start, complete, fail, cancel)
 *
 * @async
 * @param {Object} params - Process event parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Process event type
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} [params.userId] - User who triggered event
 * @param {Record<string, any>} [params.processState] - Current process state
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logProcessEvent({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.PROCESS_START,
 *   processInstanceId: 'proc-123',
 *   userId: 'user-456',
 *   processState: { status: 'running', priority: 'high' },
 * });
 * ```
 */
export declare function logProcessEvent(params: {
    model: typeof Model;
    eventType: AuditEventType;
    processInstanceId: string;
    userId?: string;
    processState?: Record<string, any>;
    metadata?: Record<string, any>;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs an activity/task lifecycle event
 *
 * @async
 * @param {Object} params - Activity event parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Activity event type
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Activity ID
 * @param {string} [params.userId] - User performing action
 * @param {Record<string, any>} [params.activityState] - Activity state
 * @param {number} [params.duration] - Activity duration
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logActivityEvent({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.ACTIVITY_COMPLETE,
 *   processInstanceId: 'proc-123',
 *   activityId: 'task-456',
 *   userId: 'user-789',
 *   activityState: { status: 'completed', outcome: 'approved' },
 *   duration: 12500,
 * });
 * ```
 */
export declare function logActivityEvent(params: {
    model: typeof Model;
    eventType: AuditEventType;
    processInstanceId: string;
    activityId: string;
    userId?: string;
    activityState?: Record<string, any>;
    duration?: number;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs a user action on a task (claim, unclaim, delegate)
 *
 * @async
 * @param {Object} params - User action parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - User action event type
 * @param {string} params.userId - User performing action
 * @param {string} params.processInstanceId - Process instance ID
 * @param {string} params.activityId - Activity/task ID
 * @param {string} [params.delegateToUserId] - Target user for delegation
 * @param {Record<string, any>} [params.metadata] - Additional metadata
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logUserAction({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.USER_DELEGATE,
 *   userId: 'user-123',
 *   processInstanceId: 'proc-456',
 *   activityId: 'task-789',
 *   delegateToUserId: 'user-999',
 *   metadata: { reason: 'vacation' },
 * });
 * ```
 */
export declare function logUserAction(params: {
    model: typeof Model;
    eventType: AuditEventType;
    userId: string;
    processInstanceId: string;
    activityId: string;
    delegateToUserId?: string;
    metadata?: Record<string, any>;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs a state change with before/after snapshots
 *
 * @async
 * @param {Object} params - State change parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Event type
 * @param {string} params.entityType - Entity type being changed
 * @param {string} params.entityId - Entity ID
 * @param {string} params.action - Action causing state change
 * @param {Record<string, any>} params.beforeState - State before change
 * @param {Record<string, any>} params.afterState - State after change
 * @param {string} [params.userId] - User making change
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logStateChange({
 *   model: AuditLogModel,
 *   eventType: AuditEventType.VARIABLE_UPDATE,
 *   entityType: 'variable',
 *   entityId: 'var-123',
 *   action: 'update',
 *   beforeState: { value: 100, type: 'number' },
 *   afterState: { value: 200, type: 'number' },
 *   userId: 'admin',
 *   processInstanceId: 'proc-456',
 * });
 * ```
 *
 * @remarks
 * - Captures complete before/after snapshots for rollback
 * - Useful for compliance audits requiring change history
 * - Supports GDPR right-to-be-forgotten by tracking data changes
 */
export declare function logStateChange(params: {
    model: typeof Model;
    eventType: AuditEventType;
    entityType: string;
    entityId: string;
    action: string;
    beforeState: Record<string, any>;
    afterState: Record<string, any>;
    userId?: string;
    processInstanceId?: string;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs a variable change with value tracking
 *
 * @async
 * @param {Object} params - Variable change parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.variableId - Variable ID
 * @param {string} params.variableName - Variable name
 * @param {any} params.oldValue - Previous value
 * @param {any} params.newValue - New value
 * @param {string} params.action - Action (create, update, delete)
 * @param {string} [params.userId] - User making change
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logVariableChange({
 *   model: AuditLogModel,
 *   variableId: 'var-123',
 *   variableName: 'approvalAmount',
 *   oldValue: 1000,
 *   newValue: 1500,
 *   action: 'update',
 *   userId: 'approver@company.com',
 *   processInstanceId: 'proc-456',
 * });
 * ```
 */
export declare function logVariableChange(params: {
    model: typeof Model;
    variableId: string;
    variableName: string;
    oldValue: any;
    newValue: any;
    action: string;
    userId?: string;
    processInstanceId?: string;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs sensitive data access for compliance (HIPAA PHI, GDPR PII)
 *
 * @async
 * @param {Object} params - Data access parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User accessing data
 * @param {string} params.dataType - Type of sensitive data (PHI, PII, etc.)
 * @param {string} params.dataId - Data record ID
 * @param {string} params.action - Action performed (read, export, print)
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {string} [params.ipAddress] - Client IP address
 * @param {Record<string, any>} [params.metadata] - Additional context
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logDataAccess({
 *   model: AuditLogModel,
 *   userId: 'doctor@hospital.com',
 *   dataType: 'PHI',
 *   dataId: 'patient-record-123',
 *   action: 'read',
 *   ipAddress: '10.0.1.50',
 *   metadata: { patientId: 'pat-456', reason: 'treatment' },
 * });
 * ```
 *
 * @remarks
 * - Critical for HIPAA compliance (PHI access tracking)
 * - Required for GDPR right-to-access audits
 * - High severity for security monitoring
 */
export declare function logDataAccess(params: {
    model: typeof Model;
    userId: string;
    dataType: string;
    dataId: string;
    action: string;
    processInstanceId?: string;
    ipAddress?: string;
    metadata?: Record<string, any>;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs permission/authorization checks
 *
 * @async
 * @param {Object} params - Permission check parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User being checked
 * @param {string} params.resource - Resource being accessed
 * @param {string} params.permission - Permission being checked
 * @param {boolean} params.granted - Whether permission was granted
 * @param {string} [params.processInstanceId] - Related process instance
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logPermissionCheck({
 *   model: AuditLogModel,
 *   userId: 'user-123',
 *   resource: 'sensitive-document-456',
 *   permission: 'write',
 *   granted: false, // Access denied
 * });
 * ```
 */
export declare function logPermissionCheck(params: {
    model: typeof Model;
    userId: string;
    resource: string;
    permission: string;
    granted: boolean;
    processInstanceId?: string;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs an error with full stack trace and context
 *
 * @async
 * @param {Object} params - Error logging parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditEventType} params.eventType - Event type where error occurred
 * @param {Error} params.error - Error object
 * @param {string} [params.userId] - User when error occurred
 * @param {string} [params.processInstanceId] - Process instance ID
 * @param {string} [params.activityId] - Activity ID where error occurred
 * @param {string} params.entityType - Entity type
 * @param {string} [params.entityId] - Entity ID
 * @param {Record<string, any>} [params.context] - Additional error context
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * try {
 *   await executeTask();
 * } catch (error) {
 *   await logError({
 *     model: AuditLogModel,
 *     eventType: AuditEventType.ACTIVITY_COMPLETE,
 *     error,
 *     userId: 'user-123',
 *     processInstanceId: 'proc-456',
 *     activityId: 'task-789',
 *     entityType: 'task',
 *     entityId: 'task-789',
 *     context: { attemptNumber: 3 },
 *   });
 * }
 * ```
 *
 * @remarks
 * - Captures full stack trace for debugging
 * - Includes contextual information for root cause analysis
 * - High severity for alerting and monitoring
 */
export declare function logError(params: {
    model: typeof Model;
    eventType: AuditEventType;
    error: Error;
    userId?: string;
    processInstanceId?: string;
    activityId?: string;
    entityType: string;
    entityId?: string;
    context?: Record<string, any>;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Logs a critical system error
 *
 * @async
 * @param {Object} params - Critical error parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.errorMessage - Critical error message
 * @param {string} [params.stackTrace] - Stack trace
 * @param {Record<string, any>} [params.systemState] - System state at error
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog>} Created audit log
 *
 * @example
 * ```typescript
 * await logCriticalError({
 *   model: AuditLogModel,
 *   errorMessage: 'Database connection pool exhausted',
 *   stackTrace: error.stack,
 *   systemState: { activeConnections: 100, queuedRequests: 500 },
 * });
 * ```
 */
export declare function logCriticalError(params: {
    model: typeof Model;
    errorMessage: string;
    stackTrace?: string;
    systemState?: Record<string, any>;
    transaction?: Transaction;
}): Promise<AuditLog>;
/**
 * Queries audit logs with advanced filtering and pagination
 *
 * @async
 * @param {Object} params - Query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {AuditQuery} params.query - Query filters
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{logs: AuditLog[], total: number}>} Query results
 *
 * @example
 * ```typescript
 * const { logs, total } = await queryAuditLogs({
 *   model: AuditLogModel,
 *   query: {
 *     eventTypes: [AuditEventType.DATA_ACCESS],
 *     severities: [AuditSeverity.SECURITY],
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-01-31'),
 *     userIds: ['user-123', 'user-456'],
 *     limit: 100,
 *     offset: 0,
 *   },
 * });
 * ```
 *
 * @remarks
 * - Supports complex filtering with multiple criteria
 * - Efficient pagination for large result sets
 * - Optimized with database indexes
 */
export declare function queryAuditLogs(params: {
    model: typeof Model;
    query: AuditQuery;
    transaction?: Transaction;
}): Promise<{
    logs: AuditLog[];
    total: number;
}>;
/**
 * Retrieves audit logs for a specific process instance
 *
 * @async
 * @param {Object} params - Process audit query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.processInstanceId - Process instance ID
 * @param {AuditEventType[]} [params.eventTypes] - Filter by event types
 * @param {number} [params.limit=1000] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog[]>} Audit logs for process
 *
 * @example
 * ```typescript
 * const processAudit = await getProcessAuditTrail({
 *   model: AuditLogModel,
 *   processInstanceId: 'proc-123',
 *   eventTypes: [
 *     AuditEventType.PROCESS_START,
 *     AuditEventType.ACTIVITY_COMPLETE,
 *     AuditEventType.PROCESS_COMPLETE,
 *   ],
 * });
 * ```
 */
export declare function getProcessAuditTrail(params: {
    model: typeof Model;
    processInstanceId: string;
    eventTypes?: AuditEventType[];
    limit?: number;
    transaction?: Transaction;
}): Promise<AuditLog[]>;
/**
 * Retrieves audit logs for a specific user
 *
 * @async
 * @param {Object} params - User audit query parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.userId - User ID
 * @param {Date} [params.startDate] - Start date
 * @param {Date} [params.endDate] - End date
 * @param {number} [params.limit=100] - Maximum results
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<AuditLog[]>} User's audit logs
 *
 * @example
 * ```typescript
 * const userActivity = await getUserAuditLogs({
 *   model: AuditLogModel,
 *   userId: 'user-123',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * });
 * ```
 */
export declare function getUserAuditLogs(params: {
    model: typeof Model;
    userId: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
}): Promise<AuditLog[]>;
/**
 * Generates a comprehensive compliance report
 *
 * @async
 * @param {Object} params - Report generation parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {typeof Model} params.reportModel - ComplianceReport model
 * @param {ComplianceStandard} params.standard - Compliance standard
 * @param {Date} params.startDate - Report period start
 * @param {Date} params.endDate - Report period end
 * @param {string} params.generatedBy - User generating report
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<ComplianceReport>} Generated compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport({
 *   auditModel: AuditLogModel,
 *   reportModel: ComplianceReportModel,
 *   standard: ComplianceStandard.HIPAA,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   generatedBy: 'compliance-officer@company.com',
 * });
 * ```
 *
 * @remarks
 * - Analyzes all audit logs in date range
 * - Identifies potential compliance violations
 * - Generates summary statistics
 * - Exports to PDF/CSV for regulatory submission
 */
export declare function generateComplianceReport(params: {
    auditModel: typeof Model;
    reportModel: typeof Model;
    standard: ComplianceStandard;
    startDate: Date;
    endDate: Date;
    generatedBy: string;
    transaction?: Transaction;
}): Promise<ComplianceReport>;
/**
 * Exports compliance report to JSON format
 *
 * @async
 * @param {Object} params - Export parameters
 * @param {typeof Model} params.reportModel - ComplianceReport model
 * @param {string} params.reportId - Report ID to export
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Record<string, any>>} Exported report data
 *
 * @example
 * ```typescript
 * const reportData = await exportComplianceReport({
 *   reportModel: ComplianceReportModel,
 *   reportId: 'report-123',
 * });
 * fs.writeFileSync('hipaa-report-2024.json', JSON.stringify(reportData, null, 2));
 * ```
 */
export declare function exportComplianceReport(params: {
    reportModel: typeof Model;
    reportId: string;
    transaction?: Transaction;
}): Promise<Record<string, any>>;
/**
 * Creates a log retention policy
 *
 * @async
 * @param {Object} params - Retention policy parameters
 * @param {typeof Model} params.model - RetentionPolicy model
 * @param {string} params.name - Policy name
 * @param {RetentionPolicy} params.type - Policy type
 * @param {number} params.retentionDays - Days to retain
 * @param {AuditEventType[]} [params.appliesTo] - Event types to apply to
 * @param {boolean} [params.autoArchive=true] - Auto-archive before deletion
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<RetentionPolicyConfig>} Created retention policy
 *
 * @example
 * ```typescript
 * const policy = await createRetentionPolicy({
 *   model: RetentionPolicyModel,
 *   name: 'HIPAA PHI Access Logs',
 *   type: RetentionPolicy.LONG_TERM,
 *   retentionDays: 2555, // 7 years
 *   appliesTo: [AuditEventType.DATA_ACCESS],
 *   autoArchive: true,
 * });
 * ```
 */
export declare function createRetentionPolicy(params: {
    model: typeof Model;
    name: string;
    type: RetentionPolicy;
    retentionDays: number;
    appliesTo?: AuditEventType[];
    autoArchive?: boolean;
    transaction?: Transaction;
}): Promise<RetentionPolicyConfig>;
/**
 * Archives audit logs based on retention policies
 *
 * @async
 * @param {Object} params - Archive parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {typeof Model} params.policyModel - RetentionPolicy model
 * @param {Date} [params.archiveBeforeDate] - Archive logs before this date
 * @param {boolean} [params.compress=true] - Compress archived logs
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of logs archived
 *
 * @example
 * ```typescript
 * const archived = await archiveAuditLogs({
 *   auditModel: AuditLogModel,
 *   policyModel: RetentionPolicyModel,
 *   archiveBeforeDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
 *   compress: true,
 * });
 * console.log(`Archived ${archived} audit logs`);
 * ```
 *
 * @remarks
 * - Automatically applies retention policies
 * - Compresses logs to save storage
 * - Maintains audit trail integrity
 */
export declare function archiveAuditLogs(params: {
    auditModel: typeof Model;
    policyModel: typeof Model;
    archiveBeforeDate?: Date;
    compress?: boolean;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Deletes expired audit logs based on retention policies
 *
 * @async
 * @param {Object} params - Deletion parameters
 * @param {typeof Model} params.auditModel - AuditLog model
 * @param {boolean} [params.dryRun=false] - Preview without deleting
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<number>} Number of logs deleted (or would be deleted)
 *
 * @example
 * ```typescript
 * // Dry run first to preview
 * const wouldDelete = await deleteExpiredAuditLogs({
 *   auditModel: AuditLogModel,
 *   dryRun: true,
 * });
 * console.log(`Would delete ${wouldDelete} logs`);
 *
 * // Actually delete
 * const deleted = await deleteExpiredAuditLogs({
 *   auditModel: AuditLogModel,
 *   dryRun: false,
 * });
 * ```
 */
export declare function deleteExpiredAuditLogs(params: {
    auditModel: typeof Model;
    dryRun?: boolean;
    transaction?: Transaction;
}): Promise<number>;
/**
 * Verifies the integrity of the audit log chain
 *
 * @async
 * @param {Object} params - Verification parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {Date} [params.startDate] - Start of verification range
 * @param {Date} [params.endDate] - End of verification range
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{valid: boolean, tamperedEntries: string[], totalVerified: number}>} Verification results
 *
 * @example
 * ```typescript
 * const verification = await verifyAuditLogChain({
 *   model: AuditLogModel,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 *
 * if (!verification.valid) {
 *   console.error(`Tampered entries detected: ${verification.tamperedEntries.join(', ')}`);
 * }
 * ```
 *
 * @remarks
 * - Verifies cryptographic hash chain
 * - Detects any tampering or modification
 * - Critical for regulatory compliance and forensic analysis
 */
export declare function verifyAuditLogChain(params: {
    model: typeof Model;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<{
    valid: boolean;
    tamperedEntries: string[];
    totalVerified: number;
}>;
/**
 * Detects potential audit log tampering
 *
 * @async
 * @param {Object} params - Tamper detection parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {string} params.logId - Specific log ID to verify
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<{tampered: boolean, reason?: string}>} Tamper detection result
 *
 * @example
 * ```typescript
 * const result = await detectAuditLogTampering({
 *   model: AuditLogModel,
 *   logId: 'audit-123',
 * });
 *
 * if (result.tampered) {
 *   console.error(`Tampering detected: ${result.reason}`);
 * }
 * ```
 */
export declare function detectAuditLogTampering(params: {
    model: typeof Model;
    logId: string;
    transaction?: Transaction;
}): Promise<{
    tampered: boolean;
    reason?: string;
}>;
/**
 * Retrieves aggregate statistics for audit logs
 *
 * @async
 * @param {Object} params - Statistics parameters
 * @param {typeof Model} params.model - AuditLog model
 * @param {Date} [params.startDate] - Start date
 * @param {Date} [params.endDate] - End date
 * @param {Transaction} [params.transaction] - Database transaction
 * @returns {Promise<Record<string, any>>} Aggregate statistics
 *
 * @example
 * ```typescript
 * const stats = await getAuditLogStatistics({
 *   model: AuditLogModel,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function getAuditLogStatistics(params: {
    model: typeof Model;
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<Record<string, any>>;
//# sourceMappingURL=workflow-audit-logging.d.ts.map