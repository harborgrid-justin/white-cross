"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuditLogger = setAuditLogger;
exports.createModelAuditHook = createModelAuditHook;
exports.deleteModelAuditHook = deleteModelAuditHook;
exports.bulkOperationAuditHook = bulkOperationAuditHook;
let auditLoggerInstance = null;
async function getAuditLogger() {
    if (!auditLoggerInstance) {
        try {
            auditLoggerInstance = {
                async logCreate(entityType, entityId, context, data, transaction) {
                    console.log(`[AUDIT-CREATE] ${entityType} ${entityId}`, { context, data });
                },
                async logUpdate(entityType, entityId, context, changes, transaction) {
                    console.log(`[AUDIT-UPDATE] ${entityType} ${entityId}`, { context, changes });
                },
                async logDelete(entityType, entityId, context, data, transaction) {
                    console.log(`[AUDIT-DELETE] ${entityType} ${entityId}`, { context, data });
                }
            };
        }
        catch (error) {
            console.warn('[AUDIT] Audit service not available, using console logging:', error);
            auditLoggerInstance = {
                async logCreate(entityType, entityId, context, data) {
                    console.log(`[AUDIT-CREATE] ${entityType} ${entityId}`, { context, data });
                },
                async logUpdate(entityType, entityId, context, changes) {
                    console.log(`[AUDIT-UPDATE] ${entityType} ${entityId}`, { context, changes });
                },
                async logDelete(entityType, entityId, context, data) {
                    console.log(`[AUDIT-DELETE] ${entityType} ${entityId}`, { context, data });
                }
            };
        }
    }
    return auditLoggerInstance;
}
function setAuditLogger(logger) {
    auditLoggerInstance = logger;
}
function getAuditContext() {
    try {
        const asyncLocalStorage = global.__auditContext__;
        if (asyncLocalStorage) {
            const context = asyncLocalStorage.getStore();
            if (context) {
                return {
                    userId: context.userId,
                    ipAddress: context.ipAddress,
                    userAgent: context.userAgent,
                    requestId: context.requestId,
                    sessionId: context.sessionId,
                };
            }
        }
    }
    catch (error) {
    }
    return {
        userId: 'system',
        ipAddress: '127.0.0.1',
        userAgent: 'System',
        requestId: `sys-${Date.now()}`,
    };
}
function sanitizeAuditData(data) {
    const sensitiveFields = [
        'password',
        'passwordHash',
        'token',
        'accessToken',
        'refreshToken',
        'apiKey',
        'secret',
        'privateKey',
        'ssn',
        'creditCard',
    ];
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
        }
        else if (value && typeof value === 'object' && !Array.isArray(value)) {
            sanitized[key] = sanitizeAuditData(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
async function createModelAuditHook(modelName, instance, transaction) {
    try {
        const logger = await getAuditLogger();
        const context = getAuditContext();
        const instanceData = instance.get({ plain: true });
        const entityId = instanceData.id || 'unknown';
        const isNewRecord = instance.isNewRecord;
        const changedFields = instance.changed();
        if (isNewRecord) {
            const sanitizedData = sanitizeAuditData(instanceData);
            await logger.logCreate(modelName, entityId, context, sanitizedData, transaction);
        }
        else if (changedFields && changedFields.length > 0) {
            const changes = {};
            for (const field of changedFields) {
                const previousValue = instance.previous(field);
                const currentValue = instanceData[field];
                changes[field] = {
                    before: previousValue,
                    after: currentValue,
                };
            }
            const sanitizedChanges = sanitizeAuditData(changes);
            await logger.logUpdate(modelName, entityId, context, sanitizedChanges, transaction);
        }
    }
    catch (error) {
        console.error(`[AUDIT ERROR] Failed to audit ${modelName}:`, error);
    }
}
async function deleteModelAuditHook(modelName, instance, transaction) {
    try {
        const logger = await getAuditLogger();
        const context = getAuditContext();
        const instanceData = instance.get({ plain: true });
        const entityId = instanceData.id || 'unknown';
        const sanitizedData = sanitizeAuditData(instanceData);
        await logger.logDelete(modelName, entityId, context, sanitizedData, transaction);
    }
    catch (error) {
        console.error(`[AUDIT ERROR] Failed to audit deletion of ${modelName}:`, error);
    }
}
async function bulkOperationAuditHook(modelName, operation, metadata, transaction) {
    try {
        const logger = await getAuditLogger();
        const context = getAuditContext();
        const sanitizedMetadata = sanitizeAuditData(metadata);
        await logger.logBulkOperation(operation, modelName, context, sanitizedMetadata, transaction);
    }
    catch (error) {
        console.error(`[AUDIT ERROR] Failed to audit bulk operation on ${modelName}:`, error);
    }
}
//# sourceMappingURL=model-audit-hooks.service.js.map