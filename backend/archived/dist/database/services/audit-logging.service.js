"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLoggingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_enums_1 = require("../types/database.enums");
const audit_log_model_1 = require("../models/audit-log.model");
const audit_helper_service_1 = require("./audit-helper.service");
const base_1 = require("../../common/base");
let AuditLoggingService = class AuditLoggingService extends base_1.BaseService {
    auditLogModel;
    auditHelper;
    constructor(auditLogModel, auditHelper) {
        super("AuditLoggingService");
        this.auditLogModel = auditLogModel;
        this.auditHelper = auditHelper;
    }
    async logCreate(entityType, entityId, context, data, transaction) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.CREATE,
            entityType,
            entityId,
            context,
            newValues: data,
            previousValues: null,
            changes: data,
            success: true,
            transaction,
        });
    }
    async logRead(entityType, entityId, context, transaction) {
        if ((0, database_enums_1.isPHIEntity)(entityType)) {
            await this.createAuditEntry({
                action: database_enums_1.AuditAction.READ,
                entityType,
                entityId,
                context,
                changes: null,
                previousValues: null,
                newValues: null,
                success: true,
                transaction,
            });
        }
    }
    async logUpdate(entityType, entityId, context, changes, transaction) {
        const previousValues = {};
        const newValues = {};
        for (const [key, value] of Object.entries(changes)) {
            previousValues[key] = value.before;
            newValues[key] = value.after;
        }
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.UPDATE,
            entityType,
            entityId,
            context,
            changes,
            previousValues: this.auditHelper.sanitizeSensitiveData(previousValues),
            newValues: this.auditHelper.sanitizeSensitiveData(newValues),
            success: true,
            transaction,
        });
    }
    async logDelete(entityType, entityId, context, data, transaction) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.DELETE,
            entityType,
            entityId,
            context,
            previousValues: data,
            newValues: null,
            changes: data,
            success: true,
            transaction,
        });
    }
    async logBulkOperation(operation, entityType, context, metadata, transaction) {
        const action = operation.includes('DELETE')
            ? database_enums_1.AuditAction.BULK_DELETE
            : database_enums_1.AuditAction.BULK_UPDATE;
        await this.createAuditEntry({
            action,
            entityType,
            entityId: null,
            context,
            changes: null,
            previousValues: null,
            newValues: null,
            metadata,
            success: true,
            severity: audit_log_model_1.AuditSeverity.HIGH,
            transaction,
        });
    }
    async logExport(entityType, context, metadata) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.EXPORT,
            entityType,
            entityId: null,
            context,
            changes: null,
            previousValues: null,
            newValues: null,
            metadata,
            success: true,
            severity: (0, database_enums_1.isPHIEntity)(entityType)
                ? audit_log_model_1.AuditSeverity.HIGH
                : audit_log_model_1.AuditSeverity.MEDIUM,
        });
    }
    async logTransaction(operation, context, metadata) {
        const action = operation.includes('COMMIT')
            ? database_enums_1.AuditAction.TRANSACTION_COMMIT
            : database_enums_1.AuditAction.TRANSACTION_ROLLBACK;
        await this.createAuditEntry({
            action,
            entityType: 'Transaction',
            entityId: metadata.transactionId,
            context,
            changes: null,
            previousValues: null,
            newValues: null,
            metadata,
            success: operation.includes('COMMIT'),
        });
    }
    async logCacheAccess(operation, cacheKey, metadata) {
        const action = operation === 'READ'
            ? database_enums_1.AuditAction.CACHE_READ
            : operation === 'WRITE'
                ? database_enums_1.AuditAction.CACHE_WRITE
                : database_enums_1.AuditAction.CACHE_DELETE;
        const isPHICache = cacheKey.toLowerCase().includes('health') ||
            cacheKey.toLowerCase().includes('student') ||
            cacheKey.toLowerCase().includes('medication');
        if (isPHICache) {
            try {
                await this.auditLogModel.create({
                    action,
                    entityType: 'Cache',
                    entityId: null,
                    userId: null,
                    userName: 'SYSTEM',
                    changes: null,
                    previousValues: null,
                    newValues: null,
                    ipAddress: null,
                    userAgent: null,
                    requestId: null,
                    sessionId: null,
                    isPHI: true,
                    complianceType: audit_log_model_1.ComplianceType.HIPAA,
                    severity: audit_log_model_1.AuditSeverity.LOW,
                    success: true,
                    errorMessage: null,
                    metadata: { cacheKey, ...metadata },
                    tags: ['cache', 'system'],
                });
            }
            catch (error) {
                this.logWarning(`Failed to log cache access: ${error.message}`);
            }
        }
        else {
            this.logDebug(`Cache ${action}: ${cacheKey}`);
        }
    }
    async logAuthEvent(action, userId, context, success = true, errorMessage) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.UPDATE,
            entityType: 'User',
            entityId: userId,
            context,
            changes: { action },
            previousValues: null,
            newValues: null,
            success,
            errorMessage: errorMessage || null,
            severity: success ? audit_log_model_1.AuditSeverity.LOW : audit_log_model_1.AuditSeverity.HIGH,
            tags: ['authentication', action.toLowerCase()],
        });
    }
    async logAuthzEvent(action, userId, resource, context, granted, reason) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.UPDATE,
            entityType: 'Authorization',
            entityId: userId,
            context,
            changes: { action, resource, granted, reason },
            previousValues: null,
            newValues: null,
            success: granted,
            errorMessage: granted ? null : reason || 'Access denied',
            severity: granted ? audit_log_model_1.AuditSeverity.LOW : audit_log_model_1.AuditSeverity.MEDIUM,
            tags: ['authorization', granted ? 'granted' : 'denied'],
        });
    }
    async logSecurityEvent(eventType, description, context, severity = audit_log_model_1.AuditSeverity.HIGH, metadata) {
        await this.createAuditEntry({
            action: database_enums_1.AuditAction.UPDATE,
            entityType: 'SecurityEvent',
            entityId: null,
            context,
            changes: { eventType, description },
            previousValues: null,
            newValues: null,
            metadata,
            success: true,
            severity,
            tags: ['security', eventType],
        });
    }
    async logPHIAccess(options, transaction) {
        const action = database_enums_1.AuditAction[options.action];
        const context = {
            userId: options.userId || 'system',
            userName: options.userName || 'SYSTEM',
            userRole: 'SYSTEM',
            ipAddress: options.ipAddress || null,
            userAgent: options.userAgent || null,
            timestamp: new Date(),
        };
        await this.createAuditEntry({
            action,
            entityType: options.entityType,
            entityId: options.entityId,
            context,
            changes: options.changedFields
                ? { changedFields: options.changedFields }
                : null,
            previousValues: null,
            newValues: null,
            metadata: {
                ...options.metadata,
                phiAccess: true,
                changedFields: options.changedFields,
            },
            success: true,
            severity: audit_log_model_1.AuditSeverity.MEDIUM,
            tags: ['phi', 'model-hook', options.entityType.toLowerCase()],
            transaction,
        });
    }
    async logFailure(action, entityType, entityId, context, errorMessage, metadata) {
        await this.createAuditEntry({
            action,
            entityType,
            entityId,
            context,
            changes: null,
            previousValues: null,
            newValues: null,
            success: false,
            errorMessage,
            metadata,
            severity: audit_log_model_1.AuditSeverity.HIGH,
            tags: ['failure', 'error'],
        });
    }
    async createAuditEntry(params) {
        const { action, entityType, entityId, context, changes, previousValues = null, newValues = null, metadata = null, success = true, errorMessage = null, severity, tags = [], transaction = null, } = params;
        try {
            const isPHI = (0, database_enums_1.isPHIEntity)(entityType);
            const complianceType = this.auditHelper.determineComplianceType(entityType, isPHI);
            const auditSeverity = severity || this.auditHelper.determineSeverity(action, entityType, success);
            const sanitizedChanges = changes
                ? this.auditHelper.sanitizeSensitiveData(changes)
                : null;
            const sanitizedPreviousValues = previousValues
                ? this.auditHelper.sanitizeSensitiveData(previousValues)
                : null;
            const sanitizedNewValues = newValues
                ? this.auditHelper.sanitizeSensitiveData(newValues)
                : null;
            const createOptions = {
                action,
                entityType,
                entityId,
                userId: context.userId || null,
                userName: context.userName || null,
                changes: sanitizedChanges,
                previousValues: sanitizedPreviousValues,
                newValues: sanitizedNewValues,
                ipAddress: context.ipAddress || null,
                userAgent: context.userAgent || null,
                requestId: context.transactionId || context.correlationId || null,
                sessionId: context.correlationId || null,
                isPHI,
                complianceType,
                severity: auditSeverity,
                success,
                errorMessage,
                metadata,
                tags: [...tags, entityType.toLowerCase(), action.toLowerCase()],
            };
            if (transaction) {
                await this.auditLogModel.create(createOptions, {
                    transaction,
                });
            }
            else {
                await this.auditLogModel.create(createOptions);
            }
            this.logDebug(`AUDIT [${action}] ${entityType}:${entityId || 'bulk'} by ${context.userId || 'SYSTEM'} - ${success ? 'SUCCESS' : 'FAILED'}${transaction ? ' [IN TRANSACTION]' : ''}`);
        }
        catch (error) {
            this.logError(`Failed to create audit entry: ${error.message}`, error.stack);
        }
    }
};
exports.AuditLoggingService = AuditLoggingService;
exports.AuditLoggingService = AuditLoggingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(audit_log_model_1.AuditLog)),
    __metadata("design:paramtypes", [Object, audit_helper_service_1.AuditHelperService])
], AuditLoggingService);
//# sourceMappingURL=audit-logging.service.js.map