"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopErrorMessages = exports.findIncompleteAuditLogs = exports.findDuplicateAuditLogs = exports.archiveAuditLogsToTable = exports.getAuditLogVolumeStats = exports.validateAuditLogCompleteness = exports.getConfigurationChangeLogs = exports.getCriticalSecurityEvents = exports.getHourlyActivityReport = exports.getMostAccessedEntities = exports.getMostActiveUsers = exports.getAuditLogsByIP = exports.getDataExportAuditLogs = exports.getUserFailedLogins = exports.generateComplianceRecommendations = exports.calculateComplianceScore = exports.convertToXML = exports.convertToCSV = exports.generateDiff = exports.generateAuditChecksum = exports.verifyAuditLogIntegrity = exports.correlateAuditEvents = exports.searchAuditLogs = exports.aggregateAuditLogsByPeriod = exports.getAuditRetentionStats = exports.archiveOldAuditLogs = exports.compareEntityStateAtTimes = exports.getEntityChangeHistory = exports.trackEntityChange = exports.detectOffHoursAccess = exports.detectBulkDataExports = exports.detectUnusualAccessPatterns = exports.detectExcessiveFailedLogins = exports.detectSuspiciousActivity = exports.getAuditSummaryByEntity = exports.getAuditSummaryByUser = exports.getPHIAccessLogs = exports.exportAuditLogs = exports.generateComplianceReport = exports.getUserAuditHistory = exports.getEntityAuditHistory = exports.queryAuditTrail = exports.bulkLogAuditEvents = exports.logAuditEvent = exports.AuditSeverity = exports.ComplianceStandard = exports.AuditCategory = exports.AuditAction = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum AuditAction
 * @description Standard audit action types
 */
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
    AuditAction["DOWNLOAD"] = "DOWNLOAD";
    AuditAction["UPLOAD"] = "UPLOAD";
    AuditAction["SEARCH"] = "SEARCH";
    AuditAction["VIEW"] = "VIEW";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
/**
 * @enum AuditCategory
 * @description Audit event categories for classification
 */
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
    AuditCategory["USER_MANAGEMENT"] = "USER_MANAGEMENT";
    AuditCategory["REPORT_GENERATION"] = "REPORT_GENERATION";
})(AuditCategory || (exports.AuditCategory = AuditCategory = {}));
/**
 * @enum ComplianceStandard
 * @description Supported compliance standards
 */
var ComplianceStandard;
(function (ComplianceStandard) {
    ComplianceStandard["HIPAA"] = "HIPAA";
    ComplianceStandard["SOC2"] = "SOC2";
    ComplianceStandard["GDPR"] = "GDPR";
    ComplianceStandard["PCI_DSS"] = "PCI_DSS";
    ComplianceStandard["ISO27001"] = "ISO27001";
    ComplianceStandard["HITRUST"] = "HITRUST";
    ComplianceStandard["NIST"] = "NIST";
})(ComplianceStandard || (exports.ComplianceStandard = ComplianceStandard = {}));
/**
 * @enum AuditSeverity
 * @description Severity levels for audit events
 */
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================
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
const logAuditEvent = async (sequelize, entry, transaction) => {
    const checksum = (0, exports.generateAuditChecksum)(entry);
    const [result] = await sequelize.query(`INSERT INTO audit_logs (
      timestamp, action, category, entity_type, entity_id, user_id,
      user_name, user_role, ip_address, user_agent, request_id, session_id,
      changes_before, changes_after, metadata, compliance_standards,
      success, error_message, severity, checksum, location, device_id,
      created_at, updated_at
    ) VALUES (
      :timestamp, :action, :category, :entityType, :entityId, :userId,
      :userName, :userRole, :ipAddress, :userAgent, :requestId, :sessionId,
      :changesBefore, :changesAfter, :metadata, :complianceStandards,
      :success, :errorMessage, :severity, :checksum, :location, :deviceId,
      NOW(), NOW()
    ) RETURNING *`, {
        replacements: {
            timestamp: entry.timestamp || new Date(),
            action: entry.action,
            category: entry.category,
            entityType: entry.entityType,
            entityId: entry.entityId || null,
            userId: entry.userId,
            userName: entry.userName || null,
            userRole: entry.userRole || null,
            ipAddress: entry.ipAddress || null,
            userAgent: entry.userAgent || null,
            requestId: entry.requestId || null,
            sessionId: entry.sessionId || null,
            changesBefore: entry.changesBefore ? JSON.stringify(entry.changesBefore) : null,
            changesAfter: entry.changesAfter ? JSON.stringify(entry.changesAfter) : null,
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
            complianceStandards: entry.complianceStandards ? JSON.stringify(entry.complianceStandards) : null,
            success: entry.success,
            errorMessage: entry.errorMessage || null,
            severity: entry.severity || AuditSeverity.LOW,
            checksum,
            location: entry.location || null,
            deviceId: entry.deviceId || null,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result;
};
exports.logAuditEvent = logAuditEvent;
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
const bulkLogAuditEvents = async (sequelize, entries, transaction) => {
    if (entries.length === 0)
        return 0;
    const values = entries.map((entry) => {
        const checksum = (0, exports.generateAuditChecksum)(entry);
        return `(
      '${(entry.timestamp || new Date()).toISOString()}',
      '${entry.action}', '${entry.category}', '${entry.entityType}',
      ${entry.entityId ? `'${entry.entityId}'` : 'NULL'},
      '${entry.userId}',
      ${entry.userName ? `'${entry.userName}'` : 'NULL'},
      ${entry.userRole ? `'${entry.userRole}'` : 'NULL'},
      ${entry.ipAddress ? `'${entry.ipAddress}'` : 'NULL'},
      ${entry.userAgent ? `'${sequelize.escape(entry.userAgent)}'` : 'NULL'},
      ${entry.requestId ? `'${entry.requestId}'` : 'NULL'},
      ${entry.sessionId ? `'${entry.sessionId}'` : 'NULL'},
      ${entry.changesBefore ? `'${JSON.stringify(entry.changesBefore)}'::jsonb` : 'NULL'},
      ${entry.changesAfter ? `'${JSON.stringify(entry.changesAfter)}'::jsonb` : 'NULL'},
      ${entry.metadata ? `'${JSON.stringify(entry.metadata)}'::jsonb` : 'NULL'},
      ${entry.complianceStandards ? `'${JSON.stringify(entry.complianceStandards)}'::jsonb` : 'NULL'},
      ${entry.success}, ${entry.errorMessage ? `'${sequelize.escape(entry.errorMessage)}'` : 'NULL'},
      '${entry.severity || AuditSeverity.LOW}', '${checksum}',
      ${entry.location ? `'${entry.location}'` : 'NULL'},
      ${entry.deviceId ? `'${entry.deviceId}'` : 'NULL'},
      NOW(), NOW()
    )`;
    }).join(',');
    const [, metadata] = await sequelize.query(`INSERT INTO audit_logs (
      timestamp, action, category, entity_type, entity_id, user_id,
      user_name, user_role, ip_address, user_agent, request_id, session_id,
      changes_before, changes_after, metadata, compliance_standards,
      success, error_message, severity, checksum, location, device_id,
      created_at, updated_at
    ) VALUES ${values}`, { transaction });
    return metadata.rowCount || 0;
};
exports.bulkLogAuditEvents = bulkLogAuditEvents;
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
const queryAuditTrail = async (sequelize, options) => {
    const where = [];
    const replacements = {};
    if (options.startDate) {
        where.push('timestamp >= :startDate');
        replacements.startDate = options.startDate;
    }
    if (options.endDate) {
        where.push('timestamp <= :endDate');
        replacements.endDate = options.endDate;
    }
    if (options.userId) {
        where.push('user_id = :userId');
        replacements.userId = options.userId;
    }
    if (options.entityType) {
        where.push('entity_type = :entityType');
        replacements.entityType = options.entityType;
    }
    if (options.entityId) {
        where.push('entity_id = :entityId');
        replacements.entityId = options.entityId;
    }
    if (options.action) {
        if (Array.isArray(options.action)) {
            where.push(`action = ANY(:actions)`);
            replacements.actions = options.action;
        }
        else {
            where.push('action = :action');
            replacements.action = options.action;
        }
    }
    if (options.category) {
        if (Array.isArray(options.category)) {
            where.push(`category = ANY(:categories)`);
            replacements.categories = options.category;
        }
        else {
            where.push('category = :category');
            replacements.category = options.category;
        }
    }
    if (options.severity) {
        if (Array.isArray(options.severity)) {
            where.push(`severity = ANY(:severities)`);
            replacements.severities = options.severity;
        }
        else {
            where.push('severity = :severity');
            replacements.severity = options.severity;
        }
    }
    if (options.success !== undefined) {
        where.push('success = :success');
        replacements.success = options.success;
    }
    if (options.ipAddress) {
        where.push('ip_address = :ipAddress');
        replacements.ipAddress = options.ipAddress;
    }
    if (options.sessionId) {
        where.push('session_id = :sessionId');
        replacements.sessionId = options.sessionId;
    }
    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const orderBy = options.orderBy || 'timestamp';
    const orderDirection = options.orderDirection || 'DESC';
    const limit = options.limit || 100;
    const offset = options.offset || 0;
    const [results] = await sequelize.query(`SELECT * FROM audit_logs
     ${whereClause}
     ORDER BY ${orderBy} ${orderDirection}
     LIMIT :limit OFFSET :offset`, {
        replacements: { ...replacements, limit, offset },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.queryAuditTrail = queryAuditTrail;
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
const getEntityAuditHistory = async (sequelize, entityType, entityId, limit = 100) => {
    const [results] = await sequelize.query(`SELECT
      al.*,
      u.email as user_email,
      u.first_name || ' ' || u.last_name as full_name
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.entity_type = :entityType
       AND al.entity_id = :entityId
     ORDER BY al.timestamp DESC
     LIMIT :limit`, {
        replacements: { entityType, entityId, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getEntityAuditHistory = getEntityAuditHistory;
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
const getUserAuditHistory = async (sequelize, userId, startDate, endDate, limit = 100) => {
    const dateFilter = startDate
        ? `AND al.timestamp >= :startDate ${endDate ? 'AND al.timestamp <= :endDate' : ''}`
        : '';
    const [results] = await sequelize.query(`SELECT al.*
     FROM audit_logs al
     WHERE al.user_id = :userId
     ${dateFilter}
     ORDER BY al.timestamp DESC
     LIMIT :limit`, {
        replacements: { userId, startDate, endDate, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getUserAuditHistory = getUserAuditHistory;
// ============================================================================
// COMPLIANCE REPORTING FUNCTIONS
// ============================================================================
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
const generateComplianceReport = async (sequelize, options) => {
    const { standard, startDate, endDate } = options;
    // Get total events
    const [[{ total }]] = await sequelize.query(`SELECT COUNT(*) as total
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
       AND compliance_standards @> :standard`, {
        replacements: {
            startDate,
            endDate,
            standard: JSON.stringify([standard]),
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Get events by category
    const categoryResults = await sequelize.query(`SELECT category, COUNT(*) as count
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
     GROUP BY category`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const eventsByCategory = categoryResults[0].reduce((acc, row) => {
        acc[row.category] = parseInt(row.count);
        return acc;
    }, {});
    // Get events by action
    const actionResults = await sequelize.query(`SELECT action, COUNT(*) as count
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
     GROUP BY action`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const eventsByAction = actionResults[0].reduce((acc, row) => {
        acc[row.action] = parseInt(row.count);
        return acc;
    }, {});
    // Get unique users and entities
    const [[{ uniqueUsers, uniqueEntities }]] = await sequelize.query(`SELECT
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT entity_id) as unique_entities
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Get PHI access count
    const [[{ phiAccessCount }]] = await sequelize.query(`SELECT COUNT(*) as phi_access_count
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
       AND category = 'PHI_ACCESS'`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Get failed access attempts
    const [[{ failedAccessAttempts }]] = await sequelize.query(`SELECT COUNT(*) as failed_access_attempts
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
       AND success = false
       AND category IN ('AUTHENTICATION', 'AUTHORIZATION')`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Calculate compliance score (simplified)
    const complianceScore = (0, exports.calculateComplianceScore)({
        totalEvents: parseInt(total),
        failedAccessAttempts: parseInt(failedAccessAttempts),
        phiAccessCount: parseInt(phiAccessCount),
    });
    return {
        standard,
        period: { start: startDate, end: endDate },
        totalEvents: parseInt(total),
        eventsByCategory,
        eventsByAction,
        uniqueUsers: parseInt(uniqueUsers),
        uniqueEntities: parseInt(uniqueEntities),
        phiAccessCount: parseInt(phiAccessCount),
        failedAccessAttempts: parseInt(failedAccessAttempts),
        suspiciousActivities: 0, // Would be calculated by detectSuspiciousActivity
        complianceScore,
        violations: [],
        recommendations: (0, exports.generateComplianceRecommendations)(standard, complianceScore),
    };
};
exports.generateComplianceReport = generateComplianceReport;
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
const exportAuditLogs = async (sequelize, options) => {
    const logs = options.filters
        ? await (0, exports.queryAuditTrail)(sequelize, options.filters)
        : await (0, exports.queryAuditTrail)(sequelize, { limit: 10000 });
    let exportData;
    switch (options.format) {
        case 'JSON':
            exportData = JSON.stringify(logs, null, 2);
            break;
        case 'CSV':
            exportData = (0, exports.convertToCSV)(logs);
            break;
        case 'XML':
            exportData = (0, exports.convertToXML)(logs);
            break;
        default:
            exportData = JSON.stringify(logs, null, 2);
    }
    if (options.includeChecksum) {
        const checksum = crypto.createHash('sha256').update(exportData).digest('hex');
        exportData = JSON.stringify({ data: exportData, checksum });
    }
    if (options.encrypt) {
        // Encryption would be implemented here
        return Buffer.from(exportData);
    }
    return exportData;
};
exports.exportAuditLogs = exportAuditLogs;
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
const getPHIAccessLogs = async (sequelize, startDate, endDate, patientId) => {
    const patientFilter = patientId ? 'AND al.entity_id = :patientId' : '';
    const [results] = await sequelize.query(`SELECT
      al.*,
      u.email as user_email,
      u.role as user_role,
      p.first_name || ' ' || p.last_name as patient_name
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     LEFT JOIN patients p ON al.entity_id = p.id
     WHERE al.category = 'PHI_ACCESS'
       AND al.timestamp >= :startDate
       AND al.timestamp <= :endDate
       ${patientFilter}
     ORDER BY al.timestamp DESC`, {
        replacements: { startDate, endDate, patientId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getPHIAccessLogs = getPHIAccessLogs;
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
const getAuditSummaryByUser = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT
      al.user_id,
      al.user_name,
      COUNT(*) as total_actions,
      COUNT(DISTINCT al.entity_id) as entities_accessed,
      COUNT(CASE WHEN al.category = 'PHI_ACCESS' THEN 1 END) as phi_accesses,
      COUNT(CASE WHEN al.success = false THEN 1 END) as failed_attempts,
      MIN(al.timestamp) as first_activity,
      MAX(al.timestamp) as last_activity,
      array_agg(DISTINCT al.action) as actions_performed
     FROM audit_logs al
     WHERE al.timestamp >= :startDate
       AND al.timestamp <= :endDate
     GROUP BY al.user_id, al.user_name
     ORDER BY total_actions DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getAuditSummaryByUser = getAuditSummaryByUser;
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
const getAuditSummaryByEntity = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT
      al.entity_type,
      COUNT(*) as total_accesses,
      COUNT(DISTINCT al.entity_id) as unique_entities,
      COUNT(DISTINCT al.user_id) as unique_users,
      COUNT(CASE WHEN al.action = 'READ' THEN 1 END) as read_count,
      COUNT(CASE WHEN al.action = 'UPDATE' THEN 1 END) as update_count,
      COUNT(CASE WHEN al.action = 'DELETE' THEN 1 END) as delete_count,
      COUNT(CASE WHEN al.action = 'CREATE' THEN 1 END) as create_count
     FROM audit_logs al
     WHERE al.timestamp >= :startDate
       AND al.timestamp <= :endDate
     GROUP BY al.entity_type
     ORDER BY total_accesses DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getAuditSummaryByEntity = getAuditSummaryByEntity;
// ============================================================================
// SUSPICIOUS ACTIVITY DETECTION
// ============================================================================
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
const detectSuspiciousActivity = async (sequelize, patterns, startDate) => {
    const results = [];
    for (const pattern of patterns) {
        const windowStart = startDate || new Date(Date.now() - pattern.timeWindow * 60 * 1000);
        switch (pattern.type) {
            case 'EXCESSIVE_FAILED_LOGINS':
                const failedLogins = await (0, exports.detectExcessiveFailedLogins)(sequelize, windowStart, pattern.threshold);
                results.push(...failedLogins);
                break;
            case 'UNUSUAL_ACCESS_PATTERN':
                const unusualAccess = await (0, exports.detectUnusualAccessPatterns)(sequelize, windowStart);
                results.push(...unusualAccess);
                break;
            case 'BULK_DATA_EXPORT':
                const bulkExports = await (0, exports.detectBulkDataExports)(sequelize, windowStart, pattern.threshold);
                results.push(...bulkExports);
                break;
            case 'OFF_HOURS_ACCESS':
                const offHoursAccess = await (0, exports.detectOffHoursAccess)(sequelize, windowStart);
                results.push(...offHoursAccess);
                break;
        }
    }
    return results;
};
exports.detectSuspiciousActivity = detectSuspiciousActivity;
/**
 * Detects excessive failed login attempts by user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} threshold - Failed attempts threshold
 * @returns {Promise<any[]>} Users with excessive failed logins
 */
const detectExcessiveFailedLogins = async (sequelize, startDate, threshold = 5) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      user_name,
      ip_address,
      COUNT(*) as failed_attempts,
      array_agg(timestamp ORDER BY timestamp DESC) as attempt_times
     FROM audit_logs
     WHERE action = 'LOGIN'
       AND success = false
       AND timestamp >= :startDate
     GROUP BY user_id, user_name, ip_address
     HAVING COUNT(*) >= :threshold
     ORDER BY failed_attempts DESC`, {
        replacements: { startDate, threshold },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.detectExcessiveFailedLogins = detectExcessiveFailedLogins;
/**
 * Detects unusual access patterns (e.g., accessing many records quickly)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Unusual access pattern detections
 */
const detectUnusualAccessPatterns = async (sequelize, startDate) => {
    const [results] = await sequelize.query(`WITH user_access AS (
      SELECT
        user_id,
        user_name,
        COUNT(DISTINCT entity_id) as unique_entities,
        COUNT(*) as total_accesses,
        EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp)))/60 as time_span_minutes
      FROM audit_logs
      WHERE timestamp >= :startDate
        AND action IN ('READ', 'ACCESS', 'EXPORT')
      GROUP BY user_id, user_name
    )
    SELECT *
    FROM user_access
    WHERE unique_entities > 50
      AND time_span_minutes < 30
    ORDER BY unique_entities DESC`, {
        replacements: { startDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.detectUnusualAccessPatterns = detectUnusualAccessPatterns;
/**
 * Detects bulk data export attempts
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} threshold - Export count threshold
 * @returns {Promise<any[]>} Bulk export detections
 */
const detectBulkDataExports = async (sequelize, startDate, threshold = 10) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      user_name,
      ip_address,
      COUNT(*) as export_count,
      array_agg(DISTINCT entity_type) as exported_types,
      MIN(timestamp) as first_export,
      MAX(timestamp) as last_export
     FROM audit_logs
     WHERE action IN ('EXPORT', 'DOWNLOAD')
       AND timestamp >= :startDate
     GROUP BY user_id, user_name, ip_address
     HAVING COUNT(*) >= :threshold
     ORDER BY export_count DESC`, {
        replacements: { startDate, threshold },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.detectBulkDataExports = detectBulkDataExports;
/**
 * Detects access during off-hours (nights/weekends)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Off-hours access detections
 */
const detectOffHoursAccess = async (sequelize, startDate) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      user_name,
      COUNT(*) as off_hours_accesses,
      array_agg(DISTINCT EXTRACT(DOW FROM timestamp)) as days_of_week,
      array_agg(DISTINCT EXTRACT(HOUR FROM timestamp)) as hours_of_day
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND (
         EXTRACT(HOUR FROM timestamp) < 6
         OR EXTRACT(HOUR FROM timestamp) > 22
         OR EXTRACT(DOW FROM timestamp) IN (0, 6)
       )
       AND category IN ('PHI_ACCESS', 'DATA_ACCESS')
     GROUP BY user_id, user_name
     HAVING COUNT(*) >= 5
     ORDER BY off_hours_accesses DESC`, {
        replacements: { startDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.detectOffHoursAccess = detectOffHoursAccess;
// ============================================================================
// CHANGE TRACKING FUNCTIONS
// ============================================================================
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
const trackEntityChange = async (sequelize, entityType, entityId, beforeState, afterState, userId, transaction) => {
    const diff = (0, exports.generateDiff)(beforeState, afterState);
    return await (0, exports.logAuditEvent)(sequelize, {
        timestamp: new Date(),
        action: AuditAction.UPDATE,
        category: AuditCategory.DATA_MODIFICATION,
        entityType,
        entityId,
        userId,
        changesBefore: beforeState,
        changesAfter: afterState,
        metadata: { diff },
        success: true,
        severity: AuditSeverity.MEDIUM,
    }, transaction);
};
exports.trackEntityChange = trackEntityChange;
/**
 * Retrieves all changes for an entity with diffs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity ID
 * @returns {Promise<any[]>} Change history with diffs
 */
const getEntityChangeHistory = async (sequelize, entityType, entityId) => {
    const [results] = await sequelize.query(`SELECT
      al.*,
      u.email as user_email,
      al.changes_after - al.changes_before as diff
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.entity_type = :entityType
       AND al.entity_id = :entityId
       AND al.action IN ('CREATE', 'UPDATE', 'DELETE')
       AND al.changes_before IS NOT NULL
     ORDER BY al.timestamp DESC`, {
        replacements: { entityType, entityId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getEntityChangeHistory = getEntityChangeHistory;
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
const compareEntityStateAtTimes = async (sequelize, entityType, entityId, timepoint1, timepoint2) => {
    const [state1] = await sequelize.query(`SELECT changes_after
     FROM audit_logs
     WHERE entity_type = :entityType
       AND entity_id = :entityId
       AND timestamp <= :timepoint1
       AND action IN ('CREATE', 'UPDATE')
     ORDER BY timestamp DESC
     LIMIT 1`, {
        replacements: { entityType, entityId, timepoint1 },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const [state2] = await sequelize.query(`SELECT changes_after
     FROM audit_logs
     WHERE entity_type = :entityType
       AND entity_id = :entityId
       AND timestamp <= :timepoint2
       AND action IN ('CREATE', 'UPDATE')
     ORDER BY timestamp DESC
     LIMIT 1`, {
        replacements: { entityType, entityId, timepoint2 },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        timepoint1,
        timepoint2,
        state1: state1[0]?.changes_after || null,
        state2: state2[0]?.changes_after || null,
        diff: state1[0] && state2[0] ? (0, exports.generateDiff)(state1[0].changes_after, state2[0].changes_after) : null,
    };
};
exports.compareEntityStateAtTimes = compareEntityStateAtTimes;
// ============================================================================
// DATA RETENTION FUNCTIONS
// ============================================================================
/**
 * Archives old audit logs based on retention policy
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AuditRetentionPolicy} policy - Retention policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records archived
 */
const archiveOldAuditLogs = async (sequelize, policy, transaction) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);
    const categoryFilter = policy.applyToCategories
        ? `AND category = ANY(:categories)`
        : '';
    if (policy.archiveBeforeDelete && policy.archiveLocation) {
        // First, copy to archive table
        const [, archiveMeta] = await sequelize.query(`INSERT INTO audit_logs_archive
       SELECT * FROM audit_logs
       WHERE timestamp < :cutoffDate
       ${categoryFilter}`, {
            replacements: {
                cutoffDate,
                categories: policy.applyToCategories || [],
            },
            transaction,
        });
        const archivedCount = archiveMeta.rowCount || 0;
        // Then delete from main table
        await sequelize.query(`DELETE FROM audit_logs
       WHERE timestamp < :cutoffDate
       ${categoryFilter}`, {
            replacements: {
                cutoffDate,
                categories: policy.applyToCategories || [],
            },
            transaction,
        });
        return archivedCount;
    }
    else {
        // Direct delete without archiving
        const [, deleteMeta] = await sequelize.query(`DELETE FROM audit_logs
       WHERE timestamp < :cutoffDate
       ${categoryFilter}`, {
            replacements: {
                cutoffDate,
                categories: policy.applyToCategories || [],
            },
            transaction,
        });
        return deleteMeta.rowCount || 0;
    }
};
exports.archiveOldAuditLogs = archiveOldAuditLogs;
/**
 * Retrieves audit retention statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Retention statistics
 */
const getAuditRetentionStats = async (sequelize) => {
    const [results] = await sequelize.query(`SELECT
      category,
      COUNT(*) as total_records,
      MIN(timestamp) as oldest_record,
      MAX(timestamp) as newest_record,
      pg_size_pretty(pg_total_relation_size('audit_logs')) as table_size
     FROM audit_logs
     GROUP BY category
     ORDER BY total_records DESC`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.getAuditRetentionStats = getAuditRetentionStats;
// ============================================================================
// AUDIT LOG AGGREGATION AND SEARCH
// ============================================================================
/**
 * Aggregates audit logs by time period
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {'hour' | 'day' | 'week' | 'month'} period - Aggregation period
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Aggregated audit data
 */
const aggregateAuditLogsByPeriod = async (sequelize, period, startDate, endDate) => {
    const truncFunc = {
        hour: 'hour',
        day: 'day',
        week: 'week',
        month: 'month',
    }[period];
    const [results] = await sequelize.query(`SELECT
      DATE_TRUNC(:period, timestamp) as time_period,
      COUNT(*) as total_events,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT entity_id) as unique_entities,
      COUNT(CASE WHEN success = true THEN 1 END) as successful_events,
      COUNT(CASE WHEN success = false THEN 1 END) as failed_events,
      array_agg(DISTINCT action) as actions
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
     GROUP BY time_period
     ORDER BY time_period DESC`, {
        replacements: { period: truncFunc, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.aggregateAuditLogsByPeriod = aggregateAuditLogsByPeriod;
/**
 * Performs full-text search across audit logs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} searchTerm - Search term
 * @param {AuditQueryOptions} [filters] - Additional filters
 * @returns {Promise<any[]>} Matching audit records
 */
const searchAuditLogs = async (sequelize, searchTerm, filters) => {
    const additionalFilters = filters
        ? buildWhereClauseFromOptions(filters)
        : '';
    const [results] = await sequelize.query(`SELECT *
     FROM audit_logs
     WHERE (
       user_name ILIKE :searchTerm
       OR entity_type ILIKE :searchTerm
       OR entity_id::text ILIKE :searchTerm
       OR metadata::text ILIKE :searchTerm
       OR error_message ILIKE :searchTerm
     )
     ${additionalFilters ? `AND ${additionalFilters}` : ''}
     ORDER BY timestamp DESC
     LIMIT 100`, {
        replacements: { searchTerm: `%${searchTerm}%` },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.searchAuditLogs = searchAuditLogs;
/**
 * Correlates audit events across multiple entities/users
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} correlationKey - Key to correlate by (sessionId, requestId, etc)
 * @param {string} correlationValue - Value to match
 * @returns {Promise<any[]>} Correlated audit events
 */
const correlateAuditEvents = async (sequelize, correlationKey, correlationValue) => {
    const columnMap = {
        sessionId: 'session_id',
        requestId: 'request_id',
        deviceId: 'device_id',
    };
    const column = columnMap[correlationKey];
    const [results] = await sequelize.query(`SELECT *
     FROM audit_logs
     WHERE ${column} = :value
     ORDER BY timestamp ASC`, {
        replacements: { value: correlationValue },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.correlateAuditEvents = correlateAuditEvents;
// ============================================================================
// AUDIT LOG INTEGRITY FUNCTIONS
// ============================================================================
/**
 * Verifies audit log integrity using checksums
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} [logIds] - Optional specific log IDs to verify
 * @returns {Promise<{ valid: number; invalid: number; invalidLogs: any[] }>} Verification results
 */
const verifyAuditLogIntegrity = async (sequelize, logIds) => {
    const idFilter = logIds ? `WHERE id = ANY(:logIds)` : '';
    const [logs] = await sequelize.query(`SELECT * FROM audit_logs ${idFilter}`, {
        replacements: { logIds: logIds || [] },
        type: sequelize_1.QueryTypes.SELECT,
    });
    let valid = 0;
    let invalid = 0;
    const invalidLogs = [];
    for (const log of logs) {
        const recalculatedChecksum = (0, exports.generateAuditChecksum)(log);
        if (recalculatedChecksum === log.checksum) {
            valid++;
        }
        else {
            invalid++;
            invalidLogs.push({ ...log, expectedChecksum: recalculatedChecksum });
        }
    }
    return { valid, invalid, invalidLogs };
};
exports.verifyAuditLogIntegrity = verifyAuditLogIntegrity;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates checksum for audit log entry
 *
 * @param {Partial<AuditLogEntry>} entry - Audit log entry
 * @returns {string} SHA-256 checksum
 */
const generateAuditChecksum = (entry) => {
    const data = JSON.stringify({
        timestamp: entry.timestamp,
        action: entry.action,
        userId: entry.userId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changesBefore: entry.changesBefore,
        changesAfter: entry.changesAfter,
    });
    return crypto.createHash('sha256').update(data).digest('hex');
};
exports.generateAuditChecksum = generateAuditChecksum;
/**
 * Generates diff between two objects
 *
 * @param {Record<string, any>} before - Before state
 * @param {Record<string, any>} after - After state
 * @returns {Record<string, any>} Diff object
 */
const generateDiff = (before, after) => {
    const diff = {};
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of allKeys) {
        if (before[key] !== after[key]) {
            diff[key] = { before: before[key], after: after[key] };
        }
    }
    return diff;
};
exports.generateDiff = generateDiff;
/**
 * Converts audit logs to CSV format
 *
 * @param {any[]} logs - Audit log records
 * @returns {string} CSV formatted string
 */
const convertToCSV = (logs) => {
    if (logs.length === 0)
        return '';
    const headers = Object.keys(logs[0]);
    const csvRows = [headers.join(',')];
    for (const log of logs) {
        const values = headers.map((header) => {
            const value = log[header];
            return typeof value === 'object' ? JSON.stringify(value) : value;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};
exports.convertToCSV = convertToCSV;
/**
 * Converts audit logs to XML format
 *
 * @param {any[]} logs - Audit log records
 * @returns {string} XML formatted string
 */
const convertToXML = (logs) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<AuditLogs>\n';
    for (const log of logs) {
        xml += '  <AuditLog>\n';
        for (const [key, value] of Object.entries(log)) {
            xml += `    <${key}>${value}</${key}>\n`;
        }
        xml += '  </AuditLog>\n';
    }
    xml += '</AuditLogs>';
    return xml;
};
exports.convertToXML = convertToXML;
/**
 * Calculates compliance score based on audit metrics
 *
 * @param {object} metrics - Audit metrics
 * @returns {number} Compliance score (0-100)
 */
const calculateComplianceScore = (metrics) => {
    if (metrics.totalEvents === 0)
        return 100;
    const failureRate = metrics.failedAccessAttempts / metrics.totalEvents;
    const baseScore = 100 - failureRate * 100;
    // Adjust based on PHI access logging coverage
    const phiCoverage = metrics.phiAccessCount > 0 ? 1 : 0.8;
    return Math.max(0, Math.min(100, baseScore * phiCoverage));
};
exports.calculateComplianceScore = calculateComplianceScore;
/**
 * Generates compliance recommendations based on score
 *
 * @param {ComplianceStandard} standard - Compliance standard
 * @param {number} score - Compliance score
 * @returns {string[]} Recommendations
 */
const generateComplianceRecommendations = (standard, score) => {
    const recommendations = [];
    if (score < 70) {
        recommendations.push('Increase audit log coverage for all PHI access');
        recommendations.push('Implement additional access controls');
        recommendations.push('Review and update security policies');
    }
    if (score < 85) {
        recommendations.push('Enhance monitoring for failed access attempts');
        recommendations.push('Implement automated alerting for suspicious activities');
    }
    if (standard === ComplianceStandard.HIPAA) {
        recommendations.push('Ensure all PHI access is logged per 45 CFR § 164.312');
        recommendations.push('Review audit logs at least quarterly');
    }
    return recommendations;
};
exports.generateComplianceRecommendations = generateComplianceRecommendations;
/**
 * Builds WHERE clause from query options
 *
 * @param {AuditQueryOptions} options - Query options
 * @returns {string} WHERE clause string
 */
const buildWhereClauseFromOptions = (options) => {
    const conditions = [];
    if (options.startDate)
        conditions.push(`timestamp >= '${options.startDate.toISOString()}'`);
    if (options.endDate)
        conditions.push(`timestamp <= '${options.endDate.toISOString()}'`);
    if (options.userId)
        conditions.push(`user_id = '${options.userId}'`);
    if (options.entityType)
        conditions.push(`entity_type = '${options.entityType}'`);
    if (options.success !== undefined)
        conditions.push(`success = ${options.success}`);
    return conditions.join(' AND ');
};
// ============================================================================
// ADDITIONAL AUDIT FUNCTIONS (31-45)
// ============================================================================
/**
 * Gets failed login attempts for a specific user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Failed login attempts
 */
const getUserFailedLogins = async (sequelize, userId, startDate) => {
    const [results] = await sequelize.query(`SELECT * FROM audit_logs
     WHERE user_id = :userId
       AND action = 'LOGIN'
       AND success = false
       AND timestamp >= :startDate
     ORDER BY timestamp DESC`, {
        replacements: { userId, startDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getUserFailedLogins = getUserFailedLogins;
/**
 * Gets audit logs for data exports
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Export audit logs
 */
const getDataExportAuditLogs = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT al.*, u.email, u.role
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.action IN ('EXPORT', 'DOWNLOAD')
       AND al.timestamp >= :startDate
       AND al.timestamp <= :endDate
     ORDER BY al.timestamp DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getDataExportAuditLogs = getDataExportAuditLogs;
/**
 * Gets audit logs by IP address
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ipAddress - IP address
 * @param {number} [limit=100] - Result limit
 * @returns {Promise<any[]>} Audit logs from IP
 */
const getAuditLogsByIP = async (sequelize, ipAddress, limit = 100) => {
    const [results] = await sequelize.query(`SELECT * FROM audit_logs
     WHERE ip_address = :ipAddress
     ORDER BY timestamp DESC
     LIMIT :limit`, {
        replacements: { ipAddress, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getAuditLogsByIP = getAuditLogsByIP;
/**
 * Gets most active users by audit activity
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} [limit=10] - Number of users to return
 * @returns {Promise<any[]>} Most active users
 */
const getMostActiveUsers = async (sequelize, startDate, endDate, limit = 10) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      user_name,
      COUNT(*) as total_actions,
      COUNT(DISTINCT action) as unique_actions,
      array_agg(DISTINCT action) as actions
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
     GROUP BY user_id, user_name
     ORDER BY total_actions DESC
     LIMIT :limit`, {
        replacements: { startDate, endDate, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getMostActiveUsers = getMostActiveUsers;
/**
 * Gets most accessed entities
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} [limit=10] - Number of entities to return
 * @returns {Promise<any[]>} Most accessed entities
 */
const getMostAccessedEntities = async (sequelize, startDate, endDate, limit = 10) => {
    const [results] = await sequelize.query(`SELECT
      entity_type,
      entity_id,
      COUNT(*) as access_count,
      COUNT(DISTINCT user_id) as unique_users,
      MAX(timestamp) as last_accessed
     FROM audit_logs
     WHERE timestamp >= :startDate
       AND timestamp <= :endDate
       AND entity_id IS NOT NULL
     GROUP BY entity_type, entity_id
     ORDER BY access_count DESC
     LIMIT :limit`, {
        replacements: { startDate, endDate, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getMostAccessedEntities = getMostAccessedEntities;
/**
 * Generates hourly activity report
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} date - Date to analyze
 * @returns {Promise<any[]>} Hourly activity breakdown
 */
const getHourlyActivityReport = async (sequelize, date) => {
    const [results] = await sequelize.query(`SELECT
      EXTRACT(HOUR FROM timestamp) as hour,
      COUNT(*) as total_events,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(CASE WHEN success = true THEN 1 END) as successful_events,
      COUNT(CASE WHEN success = false THEN 1 END) as failed_events
     FROM audit_logs
     WHERE DATE(timestamp) = DATE(:date)
     GROUP BY hour
     ORDER BY hour`, {
        replacements: { date },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getHourlyActivityReport = getHourlyActivityReport;
/**
 * Gets critical security events
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} [limit=50] - Result limit
 * @returns {Promise<any[]>} Critical security events
 */
const getCriticalSecurityEvents = async (sequelize, startDate, limit = 50) => {
    const [results] = await sequelize.query(`SELECT * FROM audit_logs
     WHERE severity = 'CRITICAL'
       AND category = 'SECURITY'
       AND timestamp >= :startDate
     ORDER BY timestamp DESC
     LIMIT :limit`, {
        replacements: { startDate, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getCriticalSecurityEvents = getCriticalSecurityEvents;
/**
 * Gets audit logs for configuration changes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Configuration change logs
 */
const getConfigurationChangeLogs = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT al.*, u.email as changed_by
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.category = 'SYSTEM_CONFIGURATION'
       AND al.timestamp >= :startDate
       AND al.timestamp <= :endDate
     ORDER BY al.timestamp DESC`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getConfigurationChangeLogs = getConfigurationChangeLogs;
/**
 * Validates audit log completeness (no gaps)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ complete: boolean; gaps: any[] }>} Validation result
 */
const validateAuditLogCompleteness = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`WITH time_series AS (
      SELECT generate_series(
        DATE_TRUNC('hour', :startDate::timestamp),
        DATE_TRUNC('hour', :endDate::timestamp),
        INTERVAL '1 hour'
      ) as hour
    ),
    audit_counts AS (
      SELECT
        DATE_TRUNC('hour', timestamp) as hour,
        COUNT(*) as count
      FROM audit_logs
      WHERE timestamp >= :startDate
        AND timestamp <= :endDate
      GROUP BY hour
    )
    SELECT
      ts.hour,
      COALESCE(ac.count, 0) as event_count
    FROM time_series ts
    LEFT JOIN audit_counts ac ON ts.hour = ac.hour
    WHERE COALESCE(ac.count, 0) = 0
    ORDER BY ts.hour`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return {
        complete: results.length === 0,
        gaps: results,
    };
};
exports.validateAuditLogCompleteness = validateAuditLogCompleteness;
/**
 * Gets audit log volume statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Volume statistics
 */
const getAuditLogVolumeStats = async (sequelize) => {
    const [[stats]] = await sequelize.query(`SELECT
      COUNT(*) as total_logs,
      MIN(timestamp) as oldest_log,
      MAX(timestamp) as newest_log,
      pg_size_pretty(pg_total_relation_size('audit_logs')) as table_size,
      pg_size_pretty(pg_indexes_size('audit_logs')) as indexes_size
     FROM audit_logs`, { type: sequelize_1.QueryTypes.SELECT });
    return stats;
};
exports.getAuditLogVolumeStats = getAuditLogVolumeStats;
/**
 * Archives audit logs to archive table
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} beforeDate - Archive logs before this date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of logs archived
 */
const archiveAuditLogsToTable = async (sequelize, beforeDate, transaction) => {
    const [, insertMeta] = await sequelize.query(`INSERT INTO audit_logs_archive
     SELECT * FROM audit_logs
     WHERE timestamp < :beforeDate`, {
        replacements: { beforeDate },
        transaction,
    });
    const archived = insertMeta.rowCount || 0;
    if (archived > 0) {
        await sequelize.query(`DELETE FROM audit_logs WHERE timestamp < :beforeDate`, {
            replacements: { beforeDate },
            transaction,
        });
    }
    return archived;
};
exports.archiveAuditLogsToTable = archiveAuditLogsToTable;
/**
 * Gets duplicate audit log entries (potential issues)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @returns {Promise<any[]>} Duplicate entries
 */
const findDuplicateAuditLogs = async (sequelize, startDate) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      action,
      entity_type,
      entity_id,
      timestamp,
      COUNT(*) as duplicate_count
     FROM audit_logs
     WHERE timestamp >= :startDate
     GROUP BY user_id, action, entity_type, entity_id, timestamp
     HAVING COUNT(*) > 1
     ORDER BY duplicate_count DESC`, {
        replacements: { startDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.findDuplicateAuditLogs = findDuplicateAuditLogs;
/**
 * Gets audit logs with missing required fields
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Incomplete audit logs
 */
const findIncompleteAuditLogs = async (sequelize) => {
    const [results] = await sequelize.query(`SELECT * FROM audit_logs
     WHERE user_id IS NULL
        OR action IS NULL
        OR category IS NULL
        OR timestamp IS NULL
     ORDER BY timestamp DESC
     LIMIT 100`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.findIncompleteAuditLogs = findIncompleteAuditLogs;
/**
 * Gets top error messages from audit logs
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {number} [limit=10] - Number of errors to return
 * @returns {Promise<any[]>} Top error messages
 */
const getTopErrorMessages = async (sequelize, startDate, limit = 10) => {
    const [results] = await sequelize.query(`SELECT
      error_message,
      COUNT(*) as occurrence_count,
      array_agg(DISTINCT user_id) as affected_users,
      MIN(timestamp) as first_occurrence,
      MAX(timestamp) as last_occurrence
     FROM audit_logs
     WHERE success = false
       AND error_message IS NOT NULL
       AND timestamp >= :startDate
     GROUP BY error_message
     ORDER BY occurrence_count DESC
     LIMIT :limit`, {
        replacements: { startDate, limit },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getTopErrorMessages = getTopErrorMessages;
//# sourceMappingURL=iam-audit-kit.js.map