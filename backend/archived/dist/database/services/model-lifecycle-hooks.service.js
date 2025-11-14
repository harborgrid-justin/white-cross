"use strict";
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
exports.createUUIDGenerationHook = createUUIDGenerationHook;
exports.createTimestampHook = createTimestampHook;
exports.createSlugGenerationHook = createSlugGenerationHook;
exports.createFieldEncryptionHook = createFieldEncryptionHook;
exports.createDefaultValueHook = createDefaultValueHook;
exports.createFieldNormalizationHook = createFieldNormalizationHook;
exports.createUpdatedTimestampHook = createUpdatedTimestampHook;
exports.createChangeTrackingHook = createChangeTrackingHook;
exports.createOptimisticLockingHook = createOptimisticLockingHook;
exports.createConditionalValidationHook = createConditionalValidationHook;
exports.createAuditLoggingHook = createAuditLoggingHook;
exports.createCacheInvalidationHook = createCacheInvalidationHook;
exports.createNotificationHook = createNotificationHook;
exports.createSearchIndexUpdateHook = createSearchIndexUpdateHook;
exports.createWebhookTriggerHook = createWebhookTriggerHook;
exports.createBulkAuditLoggingHook = createBulkAuditLoggingHook;
exports.createBulkValidationHook = createBulkValidationHook;
exports.createBulkProgressTrackingHook = createBulkProgressTrackingHook;
exports.createTransactionSavepointHook = createTransactionSavepointHook;
exports.createTransactionCommitValidationHook = createTransactionCommitValidationHook;
exports.combineHooks = combineHooks;
exports.createConditionalHook = createConditionalHook;
exports.createHookLogger = createHookLogger;
exports.removeAllHooks = removeAllHooks;
exports.listModelHooks = listModelHooks;
const crypto = __importStar(require("crypto"));
function createUUIDGenerationHook(field = 'id', version = 4) {
    return (instance, options) => {
        if (!instance[field]) {
            if (version === 4) {
                instance[field] = crypto.randomUUID();
            }
            else if (version === 1) {
                const timestamp = Date.now();
                const random = crypto.randomBytes(10).toString('hex');
                instance[field] = `${timestamp}-${random}`;
            }
        }
    };
}
function createTimestampHook(fields) {
    return (instance, options) => {
        const now = new Date();
        if (fields.createdAt && !instance[fields.createdAt]) {
            instance[fields.createdAt] = now;
        }
        if (fields.createdBy && options.userId && !instance[fields.createdBy]) {
            instance[fields.createdBy] = options.userId;
        }
        if (fields.source && options.source && !instance[fields.source]) {
            instance[fields.source] = options.source;
        }
    };
}
function createSlugGenerationHook(sourceField, slugField = 'slug', options = {}) {
    return async (instance, hookOptions) => {
        if (instance[slugField])
            return;
        const source = instance[sourceField];
        if (!source)
            return;
        let slug = String(source)
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[\s_-]+/g, options.separator || '-');
        if (options.lowercase !== false) {
            slug = slug.toLowerCase();
        }
        if (options.maxLength) {
            slug = slug.substring(0, options.maxLength);
        }
        if (options.ensureUnique) {
            const model = instance.constructor;
            let uniqueSlug = slug;
            let counter = 1;
            while (true) {
                const existing = await model.findOne({
                    where: { [slugField]: uniqueSlug },
                    transaction: hookOptions.transaction,
                });
                if (!existing)
                    break;
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
            slug = uniqueSlug;
        }
        instance[slugField] = slug;
    };
}
function createFieldEncryptionHook(config) {
    return (instance, options) => {
        const key = Buffer.isBuffer(config.key) ? config.key : Buffer.from(config.key, 'hex');
        for (const field of config.fields) {
            const value = instance[field];
            if (value === null || value === undefined)
                continue;
            try {
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(config.algorithm, key, iv);
                let encrypted = cipher.update(String(value), 'utf8', 'hex');
                encrypted += cipher.final('hex');
                instance[field] = `${iv.toString('hex')}:${encrypted}`;
            }
            catch (error) {
                console.error(`Encryption failed for field ${field}:`, error);
                throw new Error(`Failed to encrypt field ${field}`);
            }
        }
    };
}
function createDefaultValueHook(defaults) {
    return (instance, options) => {
        for (const [field, defaultValue] of Object.entries(defaults)) {
            if (instance[field] !== undefined && instance[field] !== null)
                continue;
            if (typeof defaultValue === 'function') {
                instance[field] = defaultValue(instance, options);
            }
            else {
                instance[field] = defaultValue;
            }
        }
    };
}
function createFieldNormalizationHook(normalizations) {
    return (instance, options) => {
        for (const [field, operations] of Object.entries(normalizations)) {
            let value = instance[field];
            if (value === null || value === undefined)
                continue;
            for (const operation of operations) {
                if (typeof operation === 'function') {
                    value = operation(value);
                }
                else {
                    switch (operation) {
                        case 'trim':
                            value = String(value).trim();
                            break;
                        case 'lowercase':
                            value = String(value).toLowerCase();
                            break;
                        case 'uppercase':
                            value = String(value).toUpperCase();
                            break;
                        case 'titleCase':
                            value = String(value).replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                            break;
                        case 'removeNonDigits':
                            value = String(value).replace(/\D/g, '');
                            break;
                    }
                }
            }
            instance[field] = value;
        }
    };
}
function createUpdatedTimestampHook(fields) {
    return (instance, options) => {
        if (fields.updatedAt) {
            instance[fields.updatedAt] = new Date();
        }
        if (fields.updatedBy && options.userId) {
            instance[fields.updatedBy] = options.userId;
        }
    };
}
function createChangeTrackingHook(storageField, options = {}) {
    return (instance, hookOptions) => {
        const changed = instance.changed();
        if (!changed || changed.length === 0)
            return;
        const changes = {};
        const fieldsToTrack = options.trackFields || changed;
        for (const field of fieldsToTrack) {
            if (changed.includes(field)) {
                changes[field] = {
                    old: instance._previousDataValues[field],
                    new: instance[field],
                };
            }
        }
        if (Object.keys(changes).length === 0)
            return;
        const changeEntry = { changes };
        if (options.includeUser && hookOptions.userId) {
            changeEntry.userId = hookOptions.userId;
        }
        if (options.includeTimestamp !== false) {
            changeEntry.timestamp = new Date();
        }
        const history = instance[storageField] || [];
        history.push(changeEntry);
        instance[storageField] = history;
    };
}
function createOptimisticLockingHook(versionField = 'version') {
    return async (instance, options) => {
        if (!instance.changed())
            return;
        const currentVersion = instance[versionField] || 0;
        const previousVersion = instance._previousDataValues[versionField] || 0;
        const fresh = await instance.constructor.findByPk(instance.id, {
            attributes: [versionField],
            transaction: options.transaction,
        });
        if (fresh && fresh[versionField] !== previousVersion) {
            throw new Error(`Optimistic lock error: Record was modified by another user. Expected version ${previousVersion}, found ${fresh[versionField]}`);
        }
        instance[versionField] = currentVersion + 1;
        if (!options.where) {
            options.where = {};
        }
        options.where[versionField] = previousVersion;
    };
}
function createConditionalValidationHook(conditions) {
    return async (instance, options) => {
        for (const [condition, validator] of Object.entries(conditions)) {
            try {
                const conditionFn = new Function('instance', `with (instance) { return ${condition}; }`);
                if (conditionFn(instance)) {
                    await validator(instance, options);
                }
            }
            catch (error) {
                if (error instanceof Error && !error.message.includes('is not defined')) {
                    throw error;
                }
            }
        }
    };
}
function createAuditLoggingHook(auditModel, options = {}) {
    return async (instance, hookOptions) => {
        const action = options.action || detectAction(hookOptions);
        const changes = {};
        if (action === 'UPDATE') {
            const changed = instance.changed() || [];
            const fieldsToTrack = options.trackFields || changed;
            for (const field of fieldsToTrack) {
                if (options.excludeFields?.includes(field))
                    continue;
                if (changed.includes(field)) {
                    const oldValue = instance._previousDataValues[field];
                    const newValue = instance[field];
                    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                        changes[field] = { old: oldValue, new: newValue };
                    }
                }
            }
        }
        try {
            const auditEntry = {
                modelName: instance.constructor.name,
                recordId: instance.id,
                action,
                changes: Object.keys(changes).length > 0 ? changes : null,
                userId: hookOptions.userId || null,
                timestamp: new Date(),
            };
            if (options.includeIP && hookOptions.ipAddress) {
                auditEntry.ipAddress = hookOptions.ipAddress;
            }
            if (options.includeUserAgent && hookOptions.userAgent) {
                auditEntry.userAgent = hookOptions.userAgent;
            }
            await auditModel.create(auditEntry, { transaction: hookOptions.transaction });
        }
        catch (error) {
            console.error('Audit logging failed:', error);
        }
    };
}
function createCacheInvalidationHook(cacheClient, config) {
    return async (instance, options) => {
        try {
            const keys = typeof config.keys === 'function'
                ? config.keys(instance)
                : config.keys;
            if (keys.length > 0) {
                if (cacheClient.del) {
                    await cacheClient.del(...keys);
                }
                else if (cacheClient.delete) {
                    await Promise.all(keys.map((key) => cacheClient.delete(key)));
                }
            }
            if (config.patterns && cacheClient.keys) {
                for (const pattern of config.patterns) {
                    const matchingKeys = await cacheClient.keys(pattern);
                    if (matchingKeys.length > 0) {
                        await cacheClient.del(...matchingKeys);
                    }
                }
            }
        }
        catch (error) {
            console.error('Cache invalidation failed:', error);
        }
    };
}
function createNotificationHook(notificationService, config) {
    return async (instance, options) => {
        if (config.condition && !config.condition(instance)) {
            return;
        }
        const recipients = typeof config.recipients === 'function'
            ? config.recipients(instance)
            : config.recipients;
        if (recipients.length === 0)
            return;
        try {
            for (const channel of config.channels) {
                await notificationService.send({
                    channel,
                    recipients,
                    template: config.template,
                    data: instance.toJSON(),
                });
            }
        }
        catch (error) {
            console.error('Notification dispatch failed:', error);
        }
    };
}
function createSearchIndexUpdateHook(searchClient, options) {
    return async (instance, hookOptions) => {
        const idField = options.idField || 'id';
        const documentId = instance[idField];
        if (!documentId)
            return;
        const indexData = {};
        const data = instance.toJSON();
        for (const [key, value] of Object.entries(data)) {
            if (options.excludeFields?.includes(key))
                continue;
            if (options.includeFields && !options.includeFields.includes(key))
                continue;
            indexData[key] = value;
        }
        const updateIndex = async () => {
            try {
                if (searchClient.index) {
                    await searchClient.index({
                        index: options.index,
                        id: documentId,
                        body: indexData,
                    });
                }
                else if (searchClient.partialUpdateObject) {
                    await searchClient.partialUpdateObject(indexData, {
                        objectID: documentId,
                    });
                }
            }
            catch (error) {
                console.error('Search index update failed:', error);
            }
        };
        if (options.async) {
            updateIndex();
        }
        else {
            await updateIndex();
        }
    };
}
function createWebhookTriggerHook(webhookConfig) {
    return async (instance, options) => {
        const payload = {
            event: `${instance.constructor.name.toLowerCase()}.${detectAction(options)}`,
            data: instance.toJSON(),
            timestamp: new Date().toISOString(),
        };
        const body = JSON.stringify(payload);
        const headers = {
            'Content-Type': 'application/json',
            ...webhookConfig.headers,
        };
        if (webhookConfig.secret) {
            const signature = crypto
                .createHmac('sha256', webhookConfig.secret)
                .update(body)
                .digest('hex');
            headers['X-Webhook-Signature'] = signature;
        }
        const retries = webhookConfig.retries || 1;
        const timeout = webhookConfig.timeout || 5000;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(webhookConfig.url, {
                    method: 'POST',
                    headers,
                    body,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (response.ok) {
                    break;
                }
                if (attempt === retries - 1) {
                    console.error('Webhook failed after retries:', response.status);
                }
            }
            catch (error) {
                if (attempt === retries - 1) {
                    console.error('Webhook trigger failed:', error);
                }
            }
        }
    };
}
function createBulkAuditLoggingHook(auditModel, options = {}) {
    return async (hookOptions) => {
        try {
            const auditEntry = {
                modelName: hookOptions.model?.name || 'Unknown',
                action: 'BULK_UPDATE',
                timestamp: new Date(),
                userId: hookOptions.userId || null,
                metadata: {
                    where: hookOptions.where,
                    attributes: hookOptions.attributes,
                },
            };
            if (options.includeAffectedIds && hookOptions.where) {
                const maxIds = options.maxIdsToLog || 1000;
                const affected = await hookOptions.model.findAll({
                    where: hookOptions.where,
                    attributes: ['id'],
                    limit: maxIds,
                    transaction: hookOptions.transaction,
                });
                auditEntry.metadata.affectedIds = affected.map((r) => r.id);
                auditEntry.metadata.affectedCount = affected.length;
            }
            await auditModel.create(auditEntry, { transaction: hookOptions.transaction });
        }
        catch (error) {
            console.error('Bulk audit logging failed:', error);
        }
    };
}
function createBulkValidationHook(validator, options = {}) {
    return async (instances, hookOptions) => {
        try {
            const isValid = await validator(instances, hookOptions);
            if (!isValid && options.throwOnError !== false) {
                throw new Error(options.errorMessage || 'Bulk validation failed');
            }
        }
        catch (error) {
            if (options.throwOnError !== false) {
                throw error;
            }
            console.error('Bulk validation failed:', error);
        }
    };
}
function createBulkProgressTrackingHook(progressCallback, options = {}) {
    return (instances, hookOptions) => {
        const total = instances.length;
        const updateInterval = options.updateInterval || 100;
        hookOptions._progressTracker = {
            total,
            processed: 0,
            startTime: new Date(),
            callback: progressCallback,
            updateInterval,
        };
        progressCallback(0, total, { startTime: new Date() });
    };
}
function createTransactionSavepointHook(savepointName) {
    return async (instance, options) => {
        if (!options.transaction)
            return;
        try {
            await options.transaction.connection.query(`SAVEPOINT ${savepointName}`);
            options.transaction._savepoints = options.transaction._savepoints || [];
            options.transaction._savepoints.push(savepointName);
        }
        catch (error) {
            console.error('Savepoint creation failed:', error);
        }
    };
}
function createTransactionCommitValidationHook(validators) {
    return async (transaction) => {
        for (const validator of validators) {
            try {
                const isValid = await validator(transaction);
                if (!isValid) {
                    throw new Error('Transaction validation failed');
                }
            }
            catch (error) {
                throw error;
            }
        }
    };
}
function detectAction(options) {
    if (options.hooks === false)
        return 'UPDATE';
    const hookType = options._hookType || '';
    if (hookType.includes('Create'))
        return 'CREATE';
    if (hookType.includes('Update'))
        return 'UPDATE';
    if (hookType.includes('Destroy') || hookType.includes('Delete'))
        return 'DELETE';
    return 'UPDATE';
}
function combineHooks(hooks, options = {}) {
    return async (instance, hookOptions) => {
        if (options.parallel) {
            const results = await Promise.allSettled(hooks.map((hook) => Promise.resolve(hook(instance, hookOptions))));
            if (options.stopOnError !== false) {
                const failed = results.find((r) => r.status === 'rejected');
                if (failed && failed.status === 'rejected') {
                    throw failed.reason;
                }
            }
        }
        else {
            for (const hook of hooks) {
                try {
                    await hook(instance, hookOptions);
                }
                catch (error) {
                    if (options.stopOnError !== false) {
                        throw error;
                    }
                    console.error('Hook execution failed:', error);
                }
            }
        }
    };
}
function createConditionalHook(condition, hook) {
    return async (instance, options) => {
        const shouldExecute = await condition(instance, options);
        if (shouldExecute) {
            await hook(instance, options);
        }
    };
}
function createHookLogger(hookName, hook, logger = console) {
    return async (instance, options) => {
        const startTime = Date.now();
        try {
            logger.log(`[${hookName}] Starting execution`);
            await hook(instance, options);
            const duration = Date.now() - startTime;
            logger.log(`[${hookName}] Completed in ${duration}ms`);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger.error(`[${hookName}] Failed after ${duration}ms:`, error);
            throw error;
        }
    };
}
function removeAllHooks(model, hookType) {
    if (hookType) {
        model.removeHook(hookType);
    }
    else {
        const hookTypes = [
            'beforeValidate',
            'afterValidate',
            'beforeCreate',
            'afterCreate',
            'beforeUpdate',
            'afterUpdate',
            'beforeDestroy',
            'afterDestroy',
            'beforeSave',
            'afterSave',
        ];
        for (const type of hookTypes) {
            model.removeHook(type);
        }
    }
}
function listModelHooks(model) {
    const hooks = {};
    const hookTypes = [
        'beforeValidate',
        'afterValidate',
        'beforeCreate',
        'afterCreate',
        'beforeUpdate',
        'afterUpdate',
        'beforeDestroy',
        'afterDestroy',
        'beforeSave',
        'afterSave',
        'beforeBulkCreate',
        'afterBulkCreate',
        'beforeBulkUpdate',
        'afterBulkUpdate',
        'beforeBulkDestroy',
        'afterBulkDestroy',
    ];
    for (const hookType of hookTypes) {
        const modelHooks = model.options.hooks?.[hookType];
        if (modelHooks) {
            hooks[hookType] = Array.isArray(modelHooks) ? modelHooks : [modelHooks];
        }
    }
    return hooks;
}
//# sourceMappingURL=model-lifecycle-hooks.service.js.map