"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAuditLogsToCSV = exports.generateUserActivityReport = exports.generateAuditSummary = exports.getRetentionRequirement = exports.shouldArchiveAuditLog = exports.createRetentionPolicy = exports.filterAuditLogsByDateRange = exports.paginateAuditLogs = exports.sortAuditLogs = exports.buildAuditQueryFilter = exports.maskPhoneNumber = exports.maskEmail = exports.applyRedactionStrategy = exports.redactSensitiveData = exports.validateComplianceAuditLog = exports.createSoc2AuditLog = exports.createHipaaAuditLog = exports.createFailedActionLog = exports.createExportAuditLog = exports.createLogoutAuditLog = exports.createLoginAuditLog = exports.getChangeSummary = exports.formatChangeTracking = exports.createChangeTracking = exports.extractChangedFields = exports.createPhiAccessLog = exports.createDeleteAuditLog = exports.createUpdateAuditLog = exports.createCreateAuditLog = exports.createAuditLog = exports.ComplianceStandard = exports.AuditCategory = exports.AuditAction = void 0;
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
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["SHARE"] = "SHARE";
    AuditAction["PRINT"] = "PRINT";
    AuditAction["ACCESS"] = "ACCESS";
    AuditAction["MODIFY"] = "MODIFY";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var AuditCategory;
(function (AuditCategory) {
    AuditCategory["AUTHENTICATION"] = "AUTHENTICATION";
    AuditCategory["AUTHORIZATION"] = "AUTHORIZATION";
    AuditCategory["DATA_ACCESS"] = "DATA_ACCESS";
    AuditCategory["DATA_MODIFICATION"] = "DATA_MODIFICATION";
    AuditCategory["SYSTEM_CONFIGURATION"] = "SYSTEM_CONFIGURATION";
    AuditCategory["PHI_ACCESS"] = "PHI_ACCESS";
    AuditCategory["SECURITY"] = "SECURITY";
    AuditCategory["COMPLIANCE"] = "COMPLIANCE";
    AuditCategory["ADMINISTRATIVE"] = "ADMINISTRATIVE";
})(AuditCategory || (exports.AuditCategory = AuditCategory = {}));
var ComplianceStandard;
(function (ComplianceStandard) {
    ComplianceStandard["HIPAA"] = "HIPAA";
    ComplianceStandard["SOC2"] = "SOC2";
    ComplianceStandard["GDPR"] = "GDPR";
    ComplianceStandard["PCI_DSS"] = "PCI_DSS";
    ComplianceStandard["ISO27001"] = "ISO27001";
})(ComplianceStandard || (exports.ComplianceStandard = ComplianceStandard = {}));
// ============================================================================
// AUDIT LOG CREATION
// ============================================================================
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
const createAuditLog = (entry) => {
    return {
        timestamp: new Date(),
        success: true,
        severity: 'MEDIUM',
        ...entry,
    };
};
exports.createAuditLog = createAuditLog;
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
const createCreateAuditLog = (entityType, entityId, userId, data) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.CREATE,
        category: AuditCategory.DATA_MODIFICATION,
        entityType,
        entityId,
        userId,
        changesAfter: data,
    });
};
exports.createCreateAuditLog = createCreateAuditLog;
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
const createUpdateAuditLog = (entityType, entityId, userId, before, after) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.UPDATE,
        category: AuditCategory.DATA_MODIFICATION,
        entityType,
        entityId,
        userId,
        changesBefore: before,
        changesAfter: after,
    });
};
exports.createUpdateAuditLog = createUpdateAuditLog;
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
const createDeleteAuditLog = (entityType, entityId, userId, data) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.DELETE,
        category: AuditCategory.DATA_MODIFICATION,
        entityType,
        entityId,
        userId,
        changesBefore: data,
    });
};
exports.createDeleteAuditLog = createDeleteAuditLog;
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
const createPhiAccessLog = (entityType, entityId, userId, ipAddress) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.ACCESS,
        category: AuditCategory.PHI_ACCESS,
        entityType,
        entityId,
        userId,
        ipAddress,
        complianceStandards: [ComplianceStandard.HIPAA],
        severity: 'HIGH',
    });
};
exports.createPhiAccessLog = createPhiAccessLog;
// ============================================================================
// CHANGE TRACKING
// ============================================================================
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
const extractChangedFields = (oldData, newData) => {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
    allKeys.forEach((key) => {
        const oldValue = oldData[key];
        const newValue = newData[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
                field: key,
                oldValue,
                newValue,
            });
        }
    });
    return changes;
};
exports.extractChangedFields = extractChangedFields;
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
const createChangeTracking = (oldData, newData, userId) => {
    const changes = (0, exports.extractChangedFields)(oldData, newData);
    return changes.map((change) => ({
        ...change,
        changedAt: new Date(),
        changedBy: userId,
    }));
};
exports.createChangeTracking = createChangeTracking;
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
const formatChangeTracking = (changes) => {
    return changes.map((change) => {
        const oldVal = JSON.stringify(change.oldValue);
        const newVal = JSON.stringify(change.newValue);
        return `${change.field}: ${oldVal} → ${newVal}`;
    });
};
exports.formatChangeTracking = formatChangeTracking;
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
const getChangeSummary = (changes) => {
    return {
        totalChanges: changes.length,
        fieldsChanged: changes.map((c) => c.field),
        uniqueChangedBy: [...new Set(changes.map((c) => c.changedBy))],
        firstChange: changes.length > 0 ? changes[0].changedAt : null,
        lastChange: changes.length > 0 ? changes[changes.length - 1].changedAt : null,
    };
};
exports.getChangeSummary = getChangeSummary;
// ============================================================================
// USER ACTION LOGGING
// ============================================================================
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
const createLoginAuditLog = (userId, ipAddress, userAgent, success = true) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.LOGIN,
        category: AuditCategory.AUTHENTICATION,
        entityType: 'User',
        entityId: userId,
        userId,
        ipAddress,
        userAgent,
        success,
        severity: success ? 'LOW' : 'HIGH',
    });
};
exports.createLoginAuditLog = createLoginAuditLog;
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
const createLogoutAuditLog = (userId, sessionDuration) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.LOGOUT,
        category: AuditCategory.AUTHENTICATION,
        entityType: 'User',
        entityId: userId,
        userId,
        metadata: sessionDuration ? { sessionDuration } : undefined,
    });
};
exports.createLogoutAuditLog = createLogoutAuditLog;
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
const createExportAuditLog = (entityType, userId, recordCount, format) => {
    return (0, exports.createAuditLog)({
        action: AuditAction.EXPORT,
        category: AuditCategory.DATA_ACCESS,
        entityType,
        userId,
        metadata: { recordCount, format },
        complianceStandards: [ComplianceStandard.HIPAA, ComplianceStandard.GDPR],
        severity: 'HIGH',
    });
};
exports.createExportAuditLog = createExportAuditLog;
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
const createFailedActionLog = (action, entityType, userId, errorMessage) => {
    return (0, exports.createAuditLog)({
        action,
        category: AuditCategory.SECURITY,
        entityType,
        userId,
        success: false,
        errorMessage,
        severity: 'HIGH',
    });
};
exports.createFailedActionLog = createFailedActionLog;
// ============================================================================
// COMPLIANCE LOGGING
// ============================================================================
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
const createHipaaAuditLog = (entry) => {
    return (0, exports.createAuditLog)({
        ...entry,
        complianceStandards: [
            ComplianceStandard.HIPAA,
            ...(entry.complianceStandards || []),
        ],
        category: entry.category || AuditCategory.PHI_ACCESS,
    });
};
exports.createHipaaAuditLog = createHipaaAuditLog;
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
const createSoc2AuditLog = (entry) => {
    return (0, exports.createAuditLog)({
        ...entry,
        complianceStandards: [
            ComplianceStandard.SOC2,
            ...(entry.complianceStandards || []),
        ],
        category: entry.category || AuditCategory.SYSTEM_CONFIGURATION,
    });
};
exports.createSoc2AuditLog = createSoc2AuditLog;
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
const validateComplianceAuditLog = (entry, standard) => {
    const missingFields = [];
    const warnings = [];
    // Common required fields
    if (!entry.timestamp)
        missingFields.push('timestamp');
    if (!entry.userId)
        missingFields.push('userId');
    if (!entry.action)
        missingFields.push('action');
    if (!entry.entityType)
        missingFields.push('entityType');
    // Standard-specific validation
    if (standard === ComplianceStandard.HIPAA) {
        if (!entry.ipAddress)
            warnings.push('IP address recommended for HIPAA compliance');
        if (entry.category !== AuditCategory.PHI_ACCESS && !entry.category) {
            warnings.push('Category should be specified for HIPAA logs');
        }
    }
    if (standard === ComplianceStandard.SOC2) {
        if (!entry.requestId)
            warnings.push('Request ID recommended for SOC2 compliance');
    }
    return {
        isValid: missingFields.length === 0,
        missingFields,
        warnings,
    };
};
exports.validateComplianceAuditLog = validateComplianceAuditLog;
// ============================================================================
// SENSITIVE DATA REDACTION
// ============================================================================
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
const redactSensitiveData = (entry, sensitiveFields) => {
    const redactedEntry = { ...entry };
    const redactObject = (obj) => {
        const redacted = { ...obj };
        sensitiveFields.forEach((config) => {
            if (redacted[config.fieldName] !== undefined) {
                redacted[config.fieldName] = (0, exports.applyRedactionStrategy)(redacted[config.fieldName], config);
            }
        });
        return redacted;
    };
    if (redactedEntry.changesBefore) {
        redactedEntry.changesBefore = redactObject(redactedEntry.changesBefore);
    }
    if (redactedEntry.changesAfter) {
        redactedEntry.changesAfter = redactObject(redactedEntry.changesAfter);
    }
    if (redactedEntry.metadata) {
        redactedEntry.metadata = redactObject(redactedEntry.metadata);
    }
    return redactedEntry;
};
exports.redactSensitiveData = redactSensitiveData;
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
const applyRedactionStrategy = (value, config) => {
    if (value === null || value === undefined)
        return value;
    const strValue = String(value);
    switch (config.redactionStrategy) {
        case 'MASK':
            const maskChar = config.maskChar || '*';
            const visibleChars = config.visibleChars || 0;
            if (strValue.length <= visibleChars)
                return maskChar.repeat(strValue.length);
            return (maskChar.repeat(strValue.length - visibleChars) +
                strValue.slice(-visibleChars));
        case 'HASH':
            // Simple hash representation (in production, use crypto library)
            return `[HASHED:${strValue.length}]`;
        case 'REMOVE':
            return '[REDACTED]';
        case 'ENCRYPT':
            return '[ENCRYPTED]';
        default:
            return value;
    }
};
exports.applyRedactionStrategy = applyRedactionStrategy;
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
const maskEmail = (email) => {
    const [local, domain] = email.split('@');
    if (!domain)
        return email;
    const maskedLocal = local.length > 2
        ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
        : local;
    return `${maskedLocal}@${domain}`;
};
exports.maskEmail = maskEmail;
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
const maskPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4)
        return phone;
    const lastFour = digits.slice(-4);
    return phone.replace(/\d/g, (digit, index) => {
        const digitPosition = phone.slice(0, index + 1).replace(/\D/g, '').length;
        return digitPosition <= digits.length - 4 ? '*' : digit;
    });
};
exports.maskPhoneNumber = maskPhoneNumber;
// ============================================================================
// AUDIT TRAIL QUERYING
// ============================================================================
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
const buildAuditQueryFilter = (options) => {
    const filter = {};
    if (options.userId)
        filter.userId = options.userId;
    if (options.entityType)
        filter.entityType = options.entityType;
    if (options.entityId)
        filter.entityId = options.entityId;
    if (options.action)
        filter.action = options.action;
    if (options.category)
        filter.category = options.category;
    if (options.startDate || options.endDate) {
        filter.timestamp = {};
        if (options.startDate)
            filter.timestamp.$gte = options.startDate;
        if (options.endDate)
            filter.timestamp.$lte = options.endDate;
    }
    return filter;
};
exports.buildAuditQueryFilter = buildAuditQueryFilter;
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
const sortAuditLogs = (logs, sortBy = 'timestamp', sortOrder = 'DESC') => {
    return [...logs].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal === bVal)
            return 0;
        const comparison = aVal > bVal ? 1 : -1;
        return sortOrder === 'ASC' ? comparison : -comparison;
    });
};
exports.sortAuditLogs = sortAuditLogs;
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
const paginateAuditLogs = (logs, limit = 50, offset = 0) => {
    return {
        data: logs.slice(offset, offset + limit),
        total: logs.length,
        limit,
        offset,
    };
};
exports.paginateAuditLogs = paginateAuditLogs;
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
const filterAuditLogsByDateRange = (logs, startDate, endDate) => {
    return logs.filter((log) => {
        const timestamp = new Date(log.timestamp);
        return timestamp >= startDate && timestamp <= endDate;
    });
};
exports.filterAuditLogsByDateRange = filterAuditLogsByDateRange;
// ============================================================================
// AUDIT LOG RETENTION
// ============================================================================
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
const createRetentionPolicy = (policy) => {
    return {
        retentionDays: 2555, // 7 years default (HIPAA requirement)
        complianceStandard: ComplianceStandard.HIPAA,
        archiveEnabled: false,
        ...policy,
    };
};
exports.createRetentionPolicy = createRetentionPolicy;
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
const shouldArchiveAuditLog = (log, policy) => {
    const logAge = Date.now() - new Date(log.timestamp).getTime();
    const retentionMs = policy.retentionDays * 24 * 60 * 60 * 1000;
    return policy.archiveEnabled && logAge > retentionMs;
};
exports.shouldArchiveAuditLog = shouldArchiveAuditLog;
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
const getRetentionRequirement = (standard) => {
    const requirements = {
        [ComplianceStandard.HIPAA]: 2555, // 7 years
        [ComplianceStandard.SOC2]: 2555, // 7 years
        [ComplianceStandard.GDPR]: 2190, // 6 years
        [ComplianceStandard.PCI_DSS]: 365, // 1 year
        [ComplianceStandard.ISO27001]: 2190, // 6 years
    };
    return requirements[standard] || 2555;
};
exports.getRetentionRequirement = getRetentionRequirement;
// ============================================================================
// AUDIT REPORTING
// ============================================================================
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
const generateAuditSummary = (logs) => {
    const actionBreakdown = {};
    const categoryBreakdown = {};
    const uniqueUsers = new Set();
    const uniqueEntities = new Set();
    let successCount = 0;
    let failureCount = 0;
    logs.forEach((log) => {
        actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
        categoryBreakdown[log.category] = (categoryBreakdown[log.category] || 0) + 1;
        uniqueUsers.add(log.userId);
        if (log.entityId)
            uniqueEntities.add(log.entityId);
        if (log.success)
            successCount++;
        else
            failureCount++;
    });
    return {
        totalLogs: logs.length,
        uniqueUsers: uniqueUsers.size,
        uniqueEntities: uniqueEntities.size,
        successCount,
        failureCount,
        successRate: logs.length > 0 ? (successCount / logs.length) * 100 : 0,
        actionBreakdown,
        categoryBreakdown,
        dateRange: {
            earliest: logs.length > 0 ? logs[0].timestamp : null,
            latest: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
        },
    };
};
exports.generateAuditSummary = generateAuditSummary;
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
const generateUserActivityReport = (logs, userId) => {
    const userLogs = logs.filter((log) => log.userId === userId);
    const actions = userLogs.map((log) => log.action);
    const categories = userLogs.map((log) => log.category);
    return {
        userId,
        totalActions: userLogs.length,
        uniqueActions: new Set(actions).size,
        actionFrequency: actions.reduce((acc, action) => {
            acc[action] = (acc[action] || 0) + 1;
            return acc;
        }, {}),
        categoryFrequency: categories.reduce((acc, category) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {}),
        firstActivity: userLogs.length > 0 ? userLogs[0].timestamp : null,
        lastActivity: userLogs.length > 0 ? userLogs[userLogs.length - 1].timestamp : null,
    };
};
exports.generateUserActivityReport = generateUserActivityReport;
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
const exportAuditLogsToCSV = (logs) => {
    const headers = [
        'Timestamp',
        'Action',
        'Category',
        'Entity Type',
        'Entity ID',
        'User ID',
        'Success',
        'IP Address',
    ];
    const rows = logs.map((log) => [
        log.timestamp.toISOString(),
        log.action,
        log.category,
        log.entityType,
        log.entityId || '',
        log.userId,
        log.success.toString(),
        log.ipAddress || '',
    ]);
    const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    return csvContent;
};
exports.exportAuditLogsToCSV = exportAuditLogsToCSV;
exports.default = {
    // Audit log creation
    createAuditLog: exports.createAuditLog,
    createCreateAuditLog: exports.createCreateAuditLog,
    createUpdateAuditLog: exports.createUpdateAuditLog,
    createDeleteAuditLog: exports.createDeleteAuditLog,
    createPhiAccessLog: exports.createPhiAccessLog,
    // Change tracking
    extractChangedFields: exports.extractChangedFields,
    createChangeTracking: exports.createChangeTracking,
    formatChangeTracking: exports.formatChangeTracking,
    getChangeSummary: exports.getChangeSummary,
    // User action logging
    createLoginAuditLog: exports.createLoginAuditLog,
    createLogoutAuditLog: exports.createLogoutAuditLog,
    createExportAuditLog: exports.createExportAuditLog,
    createFailedActionLog: exports.createFailedActionLog,
    // Compliance logging
    createHipaaAuditLog: exports.createHipaaAuditLog,
    createSoc2AuditLog: exports.createSoc2AuditLog,
    validateComplianceAuditLog: exports.validateComplianceAuditLog,
    // Sensitive data redaction
    redactSensitiveData: exports.redactSensitiveData,
    applyRedactionStrategy: exports.applyRedactionStrategy,
    maskEmail: exports.maskEmail,
    maskPhoneNumber: exports.maskPhoneNumber,
    // Audit trail querying
    buildAuditQueryFilter: exports.buildAuditQueryFilter,
    sortAuditLogs: exports.sortAuditLogs,
    paginateAuditLogs: exports.paginateAuditLogs,
    filterAuditLogsByDateRange: exports.filterAuditLogsByDateRange,
    // Audit log retention
    createRetentionPolicy: exports.createRetentionPolicy,
    shouldArchiveAuditLog: exports.shouldArchiveAuditLog,
    getRetentionRequirement: exports.getRetentionRequirement,
    // Audit reporting
    generateAuditSummary: exports.generateAuditSummary,
    generateUserActivityReport: exports.generateUserActivityReport,
    exportAuditLogsToCSV: exports.exportAuditLogsToCSV,
};
//# sourceMappingURL=auditing-utils.js.map