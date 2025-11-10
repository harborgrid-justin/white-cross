"use strict";
/**
 * LOC: AUDCOMP1234567
 * File: /reuse/audit-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS audit services
 *   - Compliance reporting modules
 *   - GDPR compliance services
 *   - HIPAA audit logging
 *   - Activity tracking services
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = exports.AuditService = exports.complianceReportSchema = exports.dataRetentionPolicySchema = exports.consentRecordSchema = exports.gdprRequestSchema = exports.auditLogSchema = void 0;
exports.defineAuditLogModel = defineAuditLogModel;
exports.defineGDPRRequestModel = defineGDPRRequestModel;
exports.defineConsentRecordModel = defineConsentRecordModel;
exports.createAuditLog = createAuditLog;
exports.queryAuditLogs = queryAuditLogs;
exports.trackDataAccess = trackDataAccess;
exports.logSecurityEvent = logSecurityEvent;
exports.generateAuditTrail = generateAuditTrail;
exports.exportAuditLogsToCSV = exportAuditLogsToCSV;
exports.processDataAccessRequest = processDataAccessRequest;
exports.processDataErasureRequest = processDataErasureRequest;
exports.processDataPortabilityRequest = processDataPortabilityRequest;
exports.anonymizeUserData = anonymizeUserData;
exports.checkUserConsent = checkUserConsent;
exports.recordUserConsent = recordUserConsent;
exports.applyRetentionPolicy = applyRetentionPolicy;
exports.createLegalHold = createLegalHold;
exports.isUnderLegalHold = isUnderLegalHold;
exports.archiveOldData = archiveOldData;
exports.purgeExpiredAuditLogs = purgeExpiredAuditLogs;
exports.generateHIPAAReport = generateHIPAAReport;
exports.generateGDPRReport = generateGDPRReport;
exports.generateUserActivityReport = generateUserActivityReport;
exports.detectSuspiciousActivity = detectSuspiciousActivity;
exports.generateBreachAssessment = generateBreachAssessment;
exports.logAccessControl = logAccessControl;
exports.trackPermissionChange = trackPermissionChange;
exports.logRoleChange = logRoleChange;
exports.generateAccessControlReport = generateAccessControlReport;
exports.validateDataMinimization = validateDataMinimization;
exports.trackDataProcessing = trackDataProcessing;
exports.generateDPIA = generateDPIA;
exports.checkPurposeLimitation = checkPurposeLimitation;
exports.trackCrossBorderTransfer = trackCrossBorderTransfer;
exports.verifyDataAccuracy = verifyDataAccuracy;
exports.generatePrivacyNotice = generatePrivacyNotice;
exports.checkStorageLimitation = checkStorageLimitation;
/**
 * File: /reuse/audit-compliance-kit.ts
 * Locator: WC-UTL-AUDCOMP-001
 * Purpose: Comprehensive Audit & Compliance Kit - Complete audit logging and compliance toolkit for NestJS
 *
 * Upstream: Independent utility module for audit and compliance operations
 * Downstream: ../backend/*, Audit services, Compliance modules, Security services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, crypto
 * Exports: 40+ utility functions for activity tracking, data retention, GDPR helpers, audit trails, compliance reports
 *
 * LLM Context: Enterprise-grade audit and compliance utilities for White Cross healthcare platform.
 * Provides comprehensive HIPAA-compliant audit logging, activity tracking, data retention policies,
 * GDPR compliance (right to access, erasure, portability), audit trail generation, compliance reports,
 * consent management, data anonymization, breach detection, access control logging, and regulatory reporting.
 */
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
const zod_1 = require("zod");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Audit Logs with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditLog model
 *
 * @example
 * const AuditLog = defineAuditLogModel(sequelize);
 * await AuditLog.create({
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success'
 * });
 */
function defineAuditLogModel(sequelize) {
    class AuditLog extends sequelize_1.Model {
    }
    AuditLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'user_id',
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            field: 'user_name',
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.',
        },
        resource: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        resourceId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'resource_id',
        },
        resourceType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            field: 'resource_type',
        },
        oldValue: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'old_value',
        },
        newValue: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'new_value',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            field: 'ip_address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'user_agent',
        },
        requestId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'request_id',
        },
        sessionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'session_id',
        },
        outcome: {
            type: sequelize_1.DataTypes.ENUM('success', 'failure', 'partial'),
            allowNull: false,
            defaultValue: 'success',
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'error_message',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'low',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        sequelize,
        tableName: 'audit_logs',
        timestamps: false,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['action'] },
            { fields: ['resource'] },
            { fields: ['resource_id'] },
            { fields: ['created_at'] },
            { fields: ['severity'] },
            { fields: ['outcome'] },
            { fields: ['session_id'] },
        ],
    });
    return AuditLog;
}
/**
 * Sequelize model for GDPR Requests tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GDPRRequest model
 *
 * @example
 * const GDPRRequest = defineGDPRRequestModel(sequelize);
 * await GDPRRequest.create({
 *   type: 'erasure',
 *   userId: 'user-123',
 *   requestedBy: 'user-123',
 *   status: 'pending'
 * });
 */
function defineGDPRRequestModel(sequelize) {
    class GDPRRequest extends sequelize_1.Model {
    }
    GDPRRequest.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('access', 'erasure', 'portability', 'rectification', 'restriction'),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
        },
        requestedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'requested_by',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'completed', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        responseData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: 'response_data',
        },
        completedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: 'completed_by',
        },
        requestedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'requested_at',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'gdpr_requests',
        timestamps: false,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['requested_at'] },
        ],
    });
    return GDPRRequest;
}
/**
 * Sequelize model for Consent Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConsentRecord model
 *
 * @example
 * const ConsentRecord = defineConsentRecordModel(sequelize);
 * await ConsentRecord.create({
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
function defineConsentRecordModel(sequelize) {
    class ConsentRecord extends sequelize_1.Model {
    }
    ConsentRecord.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
        },
        consentType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            field: 'consent_type',
        },
        purpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        granted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        grantedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'granted_at',
        },
        revokedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: 'revoked_at',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            field: 'ip_address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: 'user_agent',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        sequelize,
        tableName: 'consent_records',
        timestamps: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['consent_type'] },
            { fields: ['granted'] },
            { fields: ['granted_at'] },
            { fields: ['revoked_at'] },
        ],
    });
    return ConsentRecord;
}
// ============================================================================
// ZOD SCHEMAS (4-6)
// ============================================================================
/**
 * Zod schema for audit log entry validation.
 */
exports.auditLogSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    action: zod_1.z.string().min(1).max(100),
    resource: zod_1.z.string().min(1).max(100),
    resourceId: zod_1.z.string().max(100).optional(),
    outcome: zod_1.z.enum(['success', 'failure', 'partial']),
    severity: zod_1.z.enum(['low', 'medium', 'high', 'critical']),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Zod schema for GDPR request validation.
 */
exports.gdprRequestSchema = zod_1.z.object({
    type: zod_1.z.enum(['access', 'erasure', 'portability', 'rectification', 'restriction']),
    userId: zod_1.z.string().uuid(),
    requestedBy: zod_1.z.string().uuid(),
    reason: zod_1.z.string().optional(),
});
/**
 * Zod schema for consent record validation.
 */
exports.consentRecordSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    consentType: zod_1.z.string().min(1).max(100),
    purpose: zod_1.z.string().min(1),
    granted: zod_1.z.boolean(),
    version: zod_1.z.string().min(1).max(20),
});
/**
 * Zod schema for data retention policy validation.
 */
exports.dataRetentionPolicySchema = zod_1.z.object({
    resourceType: zod_1.z.string().min(1).max(100),
    retentionPeriodDays: zod_1.z.number().min(1).max(7300),
    archiveBeforeDelete: zod_1.z.boolean(),
    anonymizeBeforeDelete: zod_1.z.boolean(),
    legalHoldExempt: zod_1.z.boolean(),
});
/**
 * Zod schema for compliance report configuration.
 */
exports.complianceReportSchema = zod_1.z.object({
    reportType: zod_1.z.string().min(1).max(100),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date(),
    format: zod_1.z.enum(['json', 'csv', 'pdf']),
});
// ============================================================================
// AUDIT LOGGING UTILITIES (7-12)
// ============================================================================
/**
 * Creates audit log entry with comprehensive tracking.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AuditLogEntry} entry - Audit log entry
 * @returns {Promise<any>} Created audit log
 *
 * @example
 * await createAuditLog(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success',
 *   severity: 'medium',
 *   timestamp: new Date()
 * });
 */
async function createAuditLog(auditModel, entry) {
    return await auditModel.create({
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        resourceType: entry.resourceType,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        requestId: entry.requestId,
        sessionId: entry.sessionId,
        outcome: entry.outcome,
        errorMessage: entry.errorMessage,
        severity: entry.severity,
        metadata: entry.metadata || {},
    });
}
/**
 * Queries audit logs with filtering and pagination.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Audit logs
 *
 * @example
 * const logs = await queryAuditLogs(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 100, 0);
 */
async function queryAuditLogs(auditModel, filters, limit = 100, offset = 0) {
    const where = {};
    if (filters.userId)
        where.userId = filters.userId;
    if (filters.action)
        where.action = filters.action;
    if (filters.resource)
        where.resource = filters.resource;
    if (filters.resourceId)
        where.resourceId = filters.resourceId;
    if (filters.outcome)
        where.outcome = filters.outcome;
    if (filters.severity)
        where.severity = filters.severity;
    if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate)
            where.createdAt[sequelize_1.Sequelize.Op.gte] = filters.startDate;
        if (filters.endDate)
            where.createdAt[sequelize_1.Sequelize.Op.lte] = filters.endDate;
    }
    return await auditModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Tracks data access for HIPAA compliance.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type (patient, medical_record)
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action performed
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackDataAccess(AuditLog, 'user-123', 'patient', 'patient-456', 'READ', {
 *   ipAddress: '192.168.1.1'
 * });
 */
async function trackDataAccess(auditModel, userId, resourceType, resourceId, action, context = {}) {
    return await createAuditLog(auditModel, {
        userId,
        action,
        resource: resourceType,
        resourceId,
        resourceType,
        outcome: 'success',
        severity: action === 'READ' ? 'low' : 'medium',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        requestId: context.requestId,
        sessionId: context.sessionId,
        metadata: context.metadata,
        timestamp: new Date(),
    });
}
/**
 * Logs security events (login, logout, failed attempts).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} event - Security event type
 * @param {boolean} success - Whether event succeeded
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logSecurityEvent(AuditLog, 'user-123', 'LOGIN', true, {
 *   ipAddress: '192.168.1.1'
 * });
 */
async function logSecurityEvent(auditModel, userId, event, success, context = {}) {
    return await createAuditLog(auditModel, {
        userId,
        action: event,
        resource: 'authentication',
        outcome: success ? 'success' : 'failure',
        severity: success ? 'low' : 'high',
        errorMessage: context.errorMessage,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: context.metadata,
        timestamp: new Date(),
    });
}
/**
 * Generates audit trail for a specific resource.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<any[]>} Audit trail
 *
 * @example
 * const trail = await generateAuditTrail(AuditLog, 'patient', 'patient-456');
 */
async function generateAuditTrail(auditModel, resourceType, resourceId) {
    return await auditModel.findAll({
        where: {
            resource: resourceType,
            resourceId,
        },
        order: [['createdAt', 'ASC']],
    });
}
/**
 * Exports audit logs to CSV format.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @returns {Promise<string>} CSV content
 *
 * @example
 * const csv = await exportAuditLogsToCSV(AuditLog, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 */
async function exportAuditLogsToCSV(auditModel, filters) {
    const { rows } = await queryAuditLogs(auditModel, filters, 10000, 0);
    const headers = [
        'ID',
        'User ID',
        'Action',
        'Resource',
        'Resource ID',
        'Outcome',
        'Severity',
        'IP Address',
        'Timestamp',
    ];
    const csvRows = [headers.join(',')];
    for (const log of rows) {
        const row = [
            log.get('id'),
            log.get('userId') || '',
            log.get('action'),
            log.get('resource'),
            log.get('resourceId') || '',
            log.get('outcome'),
            log.get('severity'),
            log.get('ipAddress') || '',
            log.get('createdAt'),
        ];
        csvRows.push(row.map(v => `"${v}"`).join(','));
    }
    return csvRows.join('\n');
}
// ============================================================================
// GDPR COMPLIANCE UTILITIES (13-18)
// ============================================================================
/**
 * Processes GDPR data access request (right to access).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataCollector - Function to collect user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataAccessRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await collectAllUserData('user-123');
 * });
 */
async function processDataAccessRequest(gdprModel, userId, requestedBy, dataCollector) {
    const request = await gdprModel.create({
        type: 'access',
        userId,
        requestedBy,
        status: 'in_progress',
    });
    try {
        const userData = await dataCollector();
        await request.update({
            status: 'completed',
            responseData: userData,
            completedAt: new Date(),
        });
        return request;
    }
    catch (error) {
        await request.update({
            status: 'rejected',
            reason: error.message,
        });
        throw error;
    }
}
/**
 * Processes GDPR data erasure request (right to be forgotten).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<void>} dataEraser - Function to erase user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataErasureRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   await eraseAllUserData('user-123');
 * });
 */
async function processDataErasureRequest(gdprModel, userId, requestedBy, dataEraser) {
    const request = await gdprModel.create({
        type: 'erasure',
        userId,
        requestedBy,
        status: 'in_progress',
    });
    try {
        await dataEraser();
        await request.update({
            status: 'completed',
            completedAt: new Date(),
        });
        return request;
    }
    catch (error) {
        await request.update({
            status: 'rejected',
            reason: error.message,
        });
        throw error;
    }
}
/**
 * Processes GDPR data portability request.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataExporter - Function to export user data
 * @param {string} format - Export format
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataPortabilityRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await exportUserData('user-123');
 * }, 'json');
 */
async function processDataPortabilityRequest(gdprModel, userId, requestedBy, dataExporter, format = 'json') {
    const request = await gdprModel.create({
        type: 'portability',
        userId,
        requestedBy,
        status: 'in_progress',
        metadata: { format },
    });
    try {
        const exportedData = await dataExporter();
        await request.update({
            status: 'completed',
            responseData: exportedData,
            completedAt: new Date(),
        });
        return request;
    }
    catch (error) {
        await request.update({
            status: 'rejected',
            reason: error.message,
        });
        throw error;
    }
}
/**
 * Anonymizes user data while preserving analytics capability.
 *
 * @param {Record<string, any>} userData - User data to anonymize
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {Record<string, any>} Anonymized data
 *
 * @example
 * const anonymized = anonymizeUserData(userData, {
 *   strategy: 'hash',
 *   fields: ['email', 'phone'],
 *   salt: 'random-salt'
 * });
 */
function anonymizeUserData(userData, config) {
    const anonymized = { ...userData };
    for (const field of config.fields) {
        if (anonymized[field] === undefined)
            continue;
        switch (config.strategy) {
            case 'hash':
                const hash = crypto
                    .createHash('sha256')
                    .update(anonymized[field] + (config.salt || ''))
                    .digest('hex');
                anonymized[field] = hash;
                break;
            case 'pseudonymize':
                anonymized[field] = `anonymous_${crypto.randomBytes(8).toString('hex')}`;
                break;
            case 'generalize':
                if (field === 'age') {
                    anonymized[field] = Math.floor(anonymized[field] / 10) * 10;
                }
                else if (field === 'zipCode') {
                    anonymized[field] = anonymized[field].substring(0, 3) + '00';
                }
                break;
            case 'suppress':
                anonymized[field] = '[REDACTED]';
                break;
        }
    }
    return anonymized;
}
/**
 * Checks if user has active consent for specific purpose.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {string} userId - User ID
 * @param {string} consentType - Consent type
 * @returns {Promise<boolean>} Consent status
 *
 * @example
 * const hasConsent = await checkUserConsent(ConsentRecord, 'user-123', 'data_processing');
 */
async function checkUserConsent(consentModel, userId, consentType) {
    const consent = await consentModel.findOne({
        where: {
            userId,
            consentType,
            granted: true,
            revokedAt: null,
        },
        order: [['grantedAt', 'DESC']],
    });
    return !!consent;
}
/**
 * Records user consent with version tracking.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {ConsentRecord} consent - Consent record
 * @returns {Promise<any>} Created consent record
 *
 * @example
 * await recordUserConsent(ConsentRecord, {
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
async function recordUserConsent(consentModel, consent) {
    return await consentModel.create({
        userId: consent.userId,
        consentType: consent.consentType,
        purpose: consent.purpose,
        granted: consent.granted,
        grantedAt: consent.granted ? new Date() : null,
        version: consent.version,
        metadata: consent.metadata || {},
    });
}
// ============================================================================
// DATA RETENTION UTILITIES (19-23)
// ============================================================================
/**
 * Applies data retention policy to resources.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {DataRetentionPolicy} policy - Retention policy
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of processed resources
 *
 * @example
 * const processed = await applyRetentionPolicy(Document, {
 *   resourceType: 'document',
 *   retentionPeriodDays: 365,
 *   archiveBeforeDelete: true,
 *   anonymizeBeforeDelete: false,
 *   legalHoldExempt: false
 * }, archiveDocument);
 */
async function applyRetentionPolicy(resourceModel, policy, archiver) {
    const cutoffDate = new Date(Date.now() - policy.retentionPeriodDays * 86400000);
    const resources = await resourceModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.lte]: cutoffDate,
            },
        },
    });
    let processedCount = 0;
    for (const resource of resources) {
        try {
            if (policy.archiveBeforeDelete && archiver) {
                await archiver(resource);
            }
            if (policy.anonymizeBeforeDelete) {
                const anonymized = anonymizeUserData(resource.toJSON(), {
                    strategy: 'hash',
                    fields: ['email', 'phone', 'ssn'],
                });
                await resource.update(anonymized);
            }
            else {
                await resource.destroy();
            }
            processedCount++;
        }
        catch (error) {
            console.error(`Failed to process resource ${resource.get('id')}:`, error);
        }
    }
    return processedCount;
}
/**
 * Creates legal hold on data to prevent deletion.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} reason - Hold reason
 * @param {string} initiatedBy - User who initiated hold
 * @returns {Promise<any>} Legal hold record
 *
 * @example
 * await createLegalHold(LegalHold, 'patient', 'patient-123', 'Litigation', 'admin-456');
 */
async function createLegalHold(holdModel, resourceType, resourceId, reason, initiatedBy) {
    return await holdModel.create({
        resourceType,
        resourceId,
        reason,
        initiatedBy,
        status: 'active',
    });
}
/**
 * Checks if resource is under legal hold.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<boolean>} Hold status
 *
 * @example
 * const onHold = await isUnderLegalHold(LegalHold, 'patient', 'patient-123');
 */
async function isUnderLegalHold(holdModel, resourceType, resourceId) {
    const hold = await holdModel.findOne({
        where: {
            resourceType,
            resourceId,
            status: 'active',
        },
    });
    return !!hold;
}
/**
 * Archives old data to cold storage.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {number} daysOld - Archive resources older than this
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of archived resources
 *
 * @example
 * const archived = await archiveOldData(Document, 365, async (doc) => {
 *   await uploadToGlacier(doc);
 * });
 */
async function archiveOldData(resourceModel, daysOld, archiver) {
    const cutoffDate = new Date(Date.now() - daysOld * 86400000);
    const resources = await resourceModel.findAll({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.lte]: cutoffDate,
            },
            archived: false,
        },
    });
    let archivedCount = 0;
    for (const resource of resources) {
        try {
            await archiver(resource);
            await resource.update({ archived: true, archivedAt: new Date() });
            archivedCount++;
        }
        catch (error) {
            console.error(`Failed to archive resource ${resource.get('id')}:`, error);
        }
    }
    return archivedCount;
}
/**
 * Purges expired audit logs based on retention policy.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of purged logs
 *
 * @example
 * const purged = await purgeExpiredAuditLogs(AuditLog, 2555); // 7 years HIPAA
 */
async function purgeExpiredAuditLogs(auditModel, retentionDays) {
    const cutoffDate = new Date(Date.now() - retentionDays * 86400000);
    const result = await auditModel.destroy({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.lte]: cutoffDate,
            },
        },
    });
    return result;
}
// ============================================================================
// COMPLIANCE REPORTING UTILITIES (24-28)
// ============================================================================
/**
 * Generates HIPAA compliance report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateHIPAAReport(AuditLog, new Date('2024-01-01'), new Date('2024-12-31'));
 */
async function generateHIPAAReport(auditModel, startDate, endDate) {
    const accessLogs = await auditModel.count({
        where: {
            action: 'READ',
            resource: 'patient',
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    const modifications = await auditModel.count({
        where: {
            action: {
                [sequelize_1.Sequelize.Op.in]: ['CREATE', 'UPDATE', 'DELETE'],
            },
            resource: 'patient',
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    const securityEvents = await auditModel.count({
        where: {
            resource: 'authentication',
            outcome: 'failure',
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        reportType: 'HIPAA',
        startDate,
        endDate,
        generatedAt: new Date(),
        generatedBy: 'system',
        format: 'json',
        data: {
            totalAccessLogs: accessLogs,
            totalModifications: modifications,
            securityIncidents: securityEvents,
            period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        },
    };
}
/**
 * Generates GDPR compliance report.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {typeof Model} consentModel - Consent record model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateGDPRReport(GDPRRequest, ConsentRecord, startDate, endDate);
 */
async function generateGDPRReport(gdprModel, consentModel, startDate, endDate) {
    const requests = await gdprModel.findAll({
        where: {
            requestedAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    const requestsByType = requests.reduce((acc, req) => {
        const type = req.get('type');
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const consents = await consentModel.count({
        where: {
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
            granted: true,
        },
    });
    return {
        reportType: 'GDPR',
        startDate,
        endDate,
        generatedAt: new Date(),
        generatedBy: 'system',
        format: 'json',
        data: {
            totalRequests: requests.length,
            requestsByType,
            consentsGranted: consents,
            period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        },
    };
}
/**
 * Generates user activity report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Activity report
 *
 * @example
 * const report = await generateUserActivityReport(AuditLog, 'user-123', startDate, endDate);
 */
async function generateUserActivityReport(auditModel, userId, startDate, endDate) {
    const activities = await auditModel.findAll({
        where: {
            userId,
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
        order: [['createdAt', 'DESC']],
    });
    const actionCounts = activities.reduce((acc, activity) => {
        const action = activity.get('action');
        acc[action] = (acc[action] || 0) + 1;
        return acc;
    }, {});
    return {
        userId,
        period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        totalActivities: activities.length,
        actionCounts,
        activities: activities.slice(0, 100),
    };
}
/**
 * Detects suspicious activity patterns.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Array<{pattern: string, count: number, severity: string}>>} Detected patterns
 *
 * @example
 * const patterns = await detectSuspiciousActivity(AuditLog, 'user-123', 24);
 */
async function detectSuspiciousActivity(auditModel, userId, hours = 24) {
    const startDate = new Date(Date.now() - hours * 3600000);
    const patterns = [];
    // Failed login attempts
    const failedLogins = await auditModel.count({
        where: {
            userId,
            action: 'LOGIN',
            outcome: 'failure',
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startDate,
            },
        },
    });
    if (failedLogins > 5) {
        patterns.push({
            pattern: 'Multiple failed login attempts',
            count: failedLogins,
            severity: 'high',
        });
    }
    // Excessive data access
    const dataAccess = await auditModel.count({
        where: {
            userId,
            action: 'READ',
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startDate,
            },
        },
    });
    if (dataAccess > 1000) {
        patterns.push({
            pattern: 'Excessive data access',
            count: dataAccess,
            severity: 'medium',
        });
    }
    // After-hours access
    const afterHours = await auditModel.count({
        where: {
            userId,
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: startDate,
            },
        },
    });
    const now = new Date();
    const hour = now.getHours();
    if ((hour < 6 || hour > 22) && afterHours > 10) {
        patterns.push({
            pattern: 'Unusual after-hours access',
            count: afterHours,
            severity: 'medium',
        });
    }
    return patterns;
}
/**
 * Generates data breach impact assessment.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Affected resource type
 * @param {string[]} resourceIds - Affected resource IDs
 * @param {Date} breachDate - Breach date
 * @returns {Promise<Record<string, any>>} Impact assessment
 *
 * @example
 * const assessment = await generateBreachAssessment(AuditLog, 'patient', ['p1', 'p2'], new Date());
 */
async function generateBreachAssessment(auditModel, resourceType, resourceIds, breachDate) {
    const accessLogs = await auditModel.findAll({
        where: {
            resource: resourceType,
            resourceId: {
                [sequelize_1.Sequelize.Op.in]: resourceIds,
            },
            createdAt: {
                [sequelize_1.Sequelize.Op.gte]: breachDate,
            },
        },
    });
    const affectedUsers = new Set(accessLogs.map(log => log.get('userId')));
    return {
        resourceType,
        affectedResourceCount: resourceIds.length,
        affectedUserCount: affectedUsers.size,
        totalAccessAttempts: accessLogs.length,
        breachDate: breachDate.toISOString(),
        assessmentDate: new Date().toISOString(),
        severity: resourceIds.length > 100 ? 'critical' : 'high',
    };
}
// ============================================================================
// ACCESS CONTROL LOGGING (29-32)
// ============================================================================
/**
 * Logs access control decision.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AccessControlLog} accessLog - Access control log
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logAccessControl(AuditLog, {
 *   userId: 'user-123',
 *   resource: 'patient',
 *   action: 'READ',
 *   granted: true,
 *   timestamp: new Date()
 * });
 */
async function logAccessControl(auditModel, accessLog) {
    return await createAuditLog(auditModel, {
        userId: accessLog.userId,
        action: `ACCESS_${accessLog.action}`,
        resource: accessLog.resource,
        outcome: accessLog.granted ? 'success' : 'failure',
        severity: accessLog.granted ? 'low' : 'medium',
        errorMessage: accessLog.granted ? undefined : accessLog.reason,
        metadata: accessLog.context,
        timestamp: accessLog.timestamp,
    });
}
/**
 * Tracks permission changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose permissions changed
 * @param {string} changedBy - User who made the change
 * @param {any} oldPermissions - Old permissions
 * @param {any} newPermissions - New permissions
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackPermissionChange(AuditLog, 'user-123', 'admin-456', oldPerms, newPerms);
 */
async function trackPermissionChange(auditModel, userId, changedBy, oldPermissions, newPermissions) {
    return await createAuditLog(auditModel, {
        userId: changedBy,
        action: 'PERMISSION_CHANGE',
        resource: 'user_permissions',
        resourceId: userId,
        oldValue: oldPermissions,
        newValue: newPermissions,
        outcome: 'success',
        severity: 'high',
        timestamp: new Date(),
    });
}
/**
 * Logs role assignment changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose role changed
 * @param {string} changedBy - User who made the change
 * @param {string[]} oldRoles - Old roles
 * @param {string[]} newRoles - New roles
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logRoleChange(AuditLog, 'user-123', 'admin-456', ['user'], ['user', 'admin']);
 */
async function logRoleChange(auditModel, userId, changedBy, oldRoles, newRoles) {
    return await createAuditLog(auditModel, {
        userId: changedBy,
        action: 'ROLE_CHANGE',
        resource: 'user_roles',
        resourceId: userId,
        oldValue: { roles: oldRoles },
        newValue: { roles: newRoles },
        outcome: 'success',
        severity: 'high',
        timestamp: new Date(),
    });
}
/**
 * Generates access control report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Access control report
 *
 * @example
 * const report = await generateAccessControlReport(AuditLog, startDate, endDate);
 */
async function generateAccessControlReport(auditModel, startDate, endDate) {
    const deniedAccess = await auditModel.count({
        where: {
            action: {
                [sequelize_1.Sequelize.Op.like]: 'ACCESS_%',
            },
            outcome: 'failure',
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    const grantedAccess = await auditModel.count({
        where: {
            action: {
                [sequelize_1.Sequelize.Op.like]: 'ACCESS_%',
            },
            outcome: 'success',
            createdAt: {
                [sequelize_1.Sequelize.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        period: `${startDate.toISOString()} to ${endDate.toISOString()}`,
        grantedAccess,
        deniedAccess,
        totalAttempts: grantedAccess + deniedAccess,
        denialRate: deniedAccess / (grantedAccess + deniedAccess),
    };
}
// ============================================================================
// ADVANCED COMPLIANCE UTILITIES (33-40)
// ============================================================================
/**
 * Validates data minimization compliance.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {string[]} requiredFields - Required fields only
 * @returns {boolean} Validation result
 *
 * @example
 * const compliant = validateDataMinimization(userData, ['id', 'name', 'email']);
 */
function validateDataMinimization(data, requiredFields) {
    const dataFields = Object.keys(data);
    const excessFields = dataFields.filter(field => !requiredFields.includes(field));
    if (excessFields.length > 0) {
        console.warn('Data minimization violation: excess fields', excessFields);
        return false;
    }
    return true;
}
/**
 * Tracks data processing activities (GDPR Article 30).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} processingActivity - Activity description
 * @param {string} purpose - Processing purpose
 * @param {string} legalBasis - Legal basis
 * @param {string[]} dataCategories - Data categories
 * @param {string[]} recipients - Data recipients
 * @returns {Promise<any>} Processing record
 *
 * @example
 * await trackDataProcessing(AuditLog, 'Patient analytics', 'Healthcare improvement', 'Legitimate interest', ['health'], ['analysts']);
 */
async function trackDataProcessing(auditModel, processingActivity, purpose, legalBasis, dataCategories, recipients) {
    return await createAuditLog(auditModel, {
        action: 'DATA_PROCESSING',
        resource: 'processing_activity',
        outcome: 'success',
        severity: 'low',
        metadata: {
            activity: processingActivity,
            purpose,
            legalBasis,
            dataCategories,
            recipients,
        },
        timestamp: new Date(),
    });
}
/**
 * Generates data protection impact assessment (DPIA).
 *
 * @param {string} processingActivity - Processing activity
 * @param {string[]} risks - Identified risks
 * @param {string[]} mitigations - Mitigation measures
 * @returns {Record<string, any>} DPIA report
 *
 * @example
 * const dpia = generateDPIA('AI analytics', ['bias'], ['regular audits']);
 */
function generateDPIA(processingActivity, risks, mitigations) {
    return {
        activity: processingActivity,
        assessmentDate: new Date().toISOString(),
        risks: risks.map(risk => ({
            description: risk,
            likelihood: 'medium',
            impact: 'high',
        })),
        mitigations: mitigations.map(mitigation => ({
            measure: mitigation,
            effectiveness: 'high',
        })),
        conclusion: risks.length <= mitigations.length ? 'acceptable' : 'requires_review',
    };
}
/**
 * Implements purpose limitation checks.
 *
 * @param {string} dataPurpose - Original data collection purpose
 * @param {string} usagePurpose - Current usage purpose
 * @returns {boolean} Compliance status
 *
 * @example
 * const compliant = checkPurposeLimitation('Treatment', 'Research');
 */
function checkPurposeLimitation(dataPurpose, usagePurpose) {
    const compatiblePurposes = {
        treatment: ['treatment', 'care_coordination'],
        research: ['research', 'analytics'],
        billing: ['billing', 'payment'],
    };
    const purpose = dataPurpose.toLowerCase();
    const usage = usagePurpose.toLowerCase();
    if (compatiblePurposes[purpose]?.includes(usage)) {
        return true;
    }
    console.warn(`Purpose limitation violation: ${dataPurpose} -> ${usagePurpose}`);
    return false;
}
/**
 * Tracks cross-border data transfers.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} dataType - Type of data transferred
 * @param {string} sourceCountry - Source country
 * @param {string} destCountry - Destination country
 * @param {string} legalMechanism - Legal mechanism (adequacy, BCR, SCC)
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * await trackCrossBorderTransfer(AuditLog, 'patient_data', 'US', 'EU', 'SCC');
 */
async function trackCrossBorderTransfer(auditModel, dataType, sourceCountry, destCountry, legalMechanism) {
    return await createAuditLog(auditModel, {
        action: 'CROSS_BORDER_TRANSFER',
        resource: 'data_transfer',
        outcome: 'success',
        severity: 'medium',
        metadata: {
            dataType,
            sourceCountry,
            destCountry,
            legalMechanism,
        },
        timestamp: new Date(),
    });
}
/**
 * Implements data accuracy verification.
 *
 * @param {Record<string, any>} data - Data to verify
 * @param {Date} lastUpdated - Last update date
 * @param {number} staleDays - Days before data is stale
 * @returns {boolean} Accuracy status
 *
 * @example
 * const accurate = verifyDataAccuracy(userData, lastUpdated, 90);
 */
function verifyDataAccuracy(data, lastUpdated, staleDays = 90) {
    const daysSinceUpdate = (Date.now() - lastUpdated.getTime()) / 86400000;
    if (daysSinceUpdate > staleDays) {
        console.warn(`Data may be stale: ${daysSinceUpdate} days old`);
        return false;
    }
    return true;
}
/**
 * Generates privacy notice template.
 *
 * @param {string} organization - Organization name
 * @param {string[]} purposes - Data processing purposes
 * @param {string[]} categories - Data categories
 * @returns {Record<string, any>} Privacy notice
 *
 * @example
 * const notice = generatePrivacyNotice('Hospital', ['Treatment'], ['Health data']);
 */
function generatePrivacyNotice(organization, purposes, categories) {
    return {
        organization,
        effectiveDate: new Date().toISOString(),
        purposes,
        dataCategories: categories,
        rights: [
            'Right to access',
            'Right to rectification',
            'Right to erasure',
            'Right to restrict processing',
            'Right to data portability',
            'Right to object',
        ],
        contact: `privacy@${organization.toLowerCase().replace(/\s/g, '')}.com`,
    };
}
/**
 * Implements storage limitation checks.
 *
 * @param {Date} dataCreatedAt - Data creation date
 * @param {number} retentionDays - Retention period
 * @returns {boolean} Should delete
 *
 * @example
 * const shouldDelete = checkStorageLimitation(createdAt, 365);
 */
function checkStorageLimitation(dataCreatedAt, retentionDays) {
    const daysSinceCreation = (Date.now() - dataCreatedAt.getTime()) / 86400000;
    return daysSinceCreation > retentionDays;
}
// ============================================================================
// NESTJS INJECTABLE SERVICE & INTERCEPTOR
// ============================================================================
/**
 * NestJS Injectable Audit Service with comprehensive logging.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private auditService: AuditService) {}
 *
 *   async updateUser(id: string, data: any) {
 *     await this.auditService.log('UPDATE', 'user', id, 'success');
 *     return this.userRepo.update(id, data);
 *   }
 * }
 */
let AuditService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditService = _classThis = class {
        constructor(auditModel) {
            this.auditModel = auditModel;
        }
        async log(action, resource, resourceId, outcome, metadata) {
            return createAuditLog(this.auditModel, {
                action,
                resource,
                resourceId,
                outcome,
                severity: 'low',
                metadata,
                timestamp: new Date(),
            });
        }
        async trackAccess(userId, resource, resourceId, context) {
            return trackDataAccess(this.auditModel, userId, resource, resourceId, 'READ', context);
        }
    };
    __setFunctionName(_classThis, "AuditService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditService = _classThis;
})();
exports.AuditService = AuditService;
/**
 * NestJS Audit Interceptor for automatic request logging.
 *
 * @example
 * @UseInterceptors(AuditInterceptor)
 * @Controller('patients')
 * export class PatientController {
 *   @Get(':id')
 *   getPatient(@Param('id') id: string) {
 *     return this.patientService.findOne(id);
 *   }
 * }
 */
let AuditInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuditInterceptor = _classThis = class {
        constructor(auditService) {
            this.auditService = auditService;
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const { method, url, user, ip } = request;
            return next.handle().pipe((0, operators_1.tap)(async () => {
                await this.auditService.log(method, url, undefined, 'success', { userId: user?.id, ipAddress: ip });
            }));
        }
    };
    __setFunctionName(_classThis, "AuditInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditInterceptor = _classThis;
})();
exports.AuditInterceptor = AuditInterceptor;
//# sourceMappingURL=audit-compliance-kit.js.map