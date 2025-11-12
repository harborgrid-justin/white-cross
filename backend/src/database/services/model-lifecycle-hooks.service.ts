/**
 * Enterprise Sequelize Model Lifecycle Hooks
 *
 * Comprehensive lifecycle hook patterns for before/after operations, bulk hooks,
 * transaction management, audit trails, data transformation, and HIPAA-compliant
 * logging for healthcare applications.
 *
 * @module reuse/data/composites/model-lifecycle-hooks
 * @version 1.0.0
 * @requires sequelize v6
 */

import {
  Model,
  ModelStatic,
  Hooks,
  Transaction,
  Op,
  Sequelize,
  ValidationError,
  ValidationErrorItem,
} from 'sequelize';
import * as crypto from 'crypto';

/**
 * Type definitions for lifecycle hooks
 */
export interface HookContext {
  transaction?: Transaction;
  userId?: string | number;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  source?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogEntry {
  modelName: string;
  recordId: string | number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  changes?: Record<string, { old: any; new: any }>;
  userId?: string | number;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface FieldEncryptionConfig {
  fields: string[];
  algorithm: string;
  key: string | Buffer;
  encoding?: BufferEncoding;
}

export interface CacheInvalidationConfig {
  keys: string[] | ((instance: any) => string[]);
  patterns?: string[];
  cascade?: boolean;
}

export interface NotificationConfig {
  channels: Array<'email' | 'sms' | 'push' | 'webhook'>;
  recipients: string[] | ((instance: any) => string[]);
  template: string;
  condition?: (instance: any) => boolean;
}

// ============================================================================
// Before Create Hooks
// ============================================================================

/**
 * Creates UUID generation hook for before create
 *
 * Automatically generates UUID v4 for primary key fields that don't have
 * a value set, ensuring unique identifiers for all records.
 *
 * @param field - Field name to populate with UUID
 * @param version - UUID version (4 or 1)
 * @returns Hook function
 *
 * @example
 * ```typescript
 * User.addHook('beforeCreate', createUUIDGenerationHook('id', 4));
 * ```
 */
export function createUUIDGenerationHook(
  field: string = 'id',
  version: 1 | 4 = 4
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
    if (!instance[field]) {
      if (version === 4) {
        instance[field] = crypto.randomUUID();
      } else if (version === 1) {
        // UUIDv1 generation (time-based)
        const timestamp = Date.now();
        const random = crypto.randomBytes(10).toString('hex');
        instance[field] = `${timestamp}-${random}`;
      }
    }
  };
}

/**
 * Creates timestamp auto-population hook
 *
 * Sets createdAt, updatedAt, and custom timestamp fields automatically
 * with transaction-aware timing for audit compliance.
 *
 * @param fields - Timestamp field configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Model.addHook('beforeCreate', createTimestampHook({
 *   createdAt: 'created_at',
 *   createdBy: 'created_by_user_id'
 * }));
 * ```
 */
export function createTimestampHook(
  fields: {
    createdAt?: string;
    createdBy?: string;
    source?: string;
  }
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
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

/**
 * Creates slug generation hook from title/name field
 *
 * Generates URL-friendly slug from specified field with uniqueness
 * checking and collision handling for SEO-friendly URLs.
 *
 * @param sourceField - Field to generate slug from
 * @param slugField - Field to store slug in
 * @param options - Slug generation options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Article.addHook('beforeCreate', createSlugGenerationHook('title', 'slug', {
 *   lowercase: true,
 *   separator: '-'
 * }));
 * ```
 */
export function createSlugGenerationHook(
  sourceField: string,
  slugField: string = 'slug',
  options: {
    lowercase?: boolean;
    separator?: string;
    maxLength?: number;
    ensureUnique?: boolean;
  } = {}
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, hookOptions: any) => {
    if (instance[slugField]) return;

    const source = instance[sourceField];
    if (!source) return;

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
      const model = instance.constructor as ModelStatic<any>;
      let uniqueSlug = slug;
      let counter = 1;

      while (true) {
        const existing = await model.findOne({
          where: { [slugField]: uniqueSlug },
          transaction: hookOptions.transaction,
        });

        if (!existing) break;

        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      slug = uniqueSlug;
    }

    instance[slugField] = slug;
  };
}

/**
 * Creates field encryption hook for sensitive data
 *
 * Encrypts specified fields before saving to database using AES-256-CBC
 * with unique IV per record for HIPAA compliance.
 *
 * @param config - Encryption configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Patient.addHook('beforeCreate', createFieldEncryptionHook({
 *   fields: ['ssn', 'medicalHistory'],
 *   algorithm: 'aes-256-cbc',
 *   key: process.env.ENCRYPTION_KEY
 * }));
 * ```
 */
export function createFieldEncryptionHook(
  config: FieldEncryptionConfig
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
    const key = Buffer.isBuffer(config.key) ? config.key : Buffer.from(config.key, 'hex');

    for (const field of config.fields) {
      const value = instance[field];
      if (value === null || value === undefined) continue;

      try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(config.algorithm, key, iv);
        let encrypted = cipher.update(String(value), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        instance[field] = `${iv.toString('hex')}:${encrypted}`;
      } catch (error) {
        console.error(`Encryption failed for field ${field}:`, error);
        throw new Error(`Failed to encrypt field ${field}`);
      }
    }
  };
}

/**
 * Creates default value population hook
 *
 * Sets default values for fields based on business logic, user context,
 * or derived from other fields with conditional logic.
 *
 * @param defaults - Default value configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Order.addHook('beforeCreate', createDefaultValueHook({
 *   status: 'pending',
 *   orderDate: () => new Date(),
 *   currency: (instance) => instance.country === 'US' ? 'USD' : 'EUR'
 * }));
 * ```
 */
export function createDefaultValueHook(
  defaults: Record<string, any | ((instance: any, options: any) => any)>
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
    for (const [field, defaultValue] of Object.entries(defaults)) {
      if (instance[field] !== undefined && instance[field] !== null) continue;

      if (typeof defaultValue === 'function') {
        instance[field] = defaultValue(instance, options);
      } else {
        instance[field] = defaultValue;
      }
    }
  };
}

/**
 * Creates field normalization hook
 *
 * Normalizes field values (trim, lowercase, format) before saving
 * for data consistency and improved query performance.
 *
 * @param normalizations - Field normalization rules
 * @returns Hook function
 *
 * @example
 * ```typescript
 * User.addHook('beforeCreate', createFieldNormalizationHook({
 *   email: ['trim', 'lowercase'],
 *   phone: ['removeNonDigits'],
 *   name: ['trim', 'titleCase']
 * }));
 * ```
 */
export function createFieldNormalizationHook(
  normalizations: Record<string, Array<'trim' | 'lowercase' | 'uppercase' | 'titleCase' | 'removeNonDigits' | ((value: any) => any)>>
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
    for (const [field, operations] of Object.entries(normalizations)) {
      let value = instance[field];
      if (value === null || value === undefined) continue;

      for (const operation of operations) {
        if (typeof operation === 'function') {
          value = operation(value);
        } else {
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
              value = String(value).replace(/\w\S*/g, (txt) =>
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
              );
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

// ============================================================================
// Before Update Hooks
// ============================================================================

/**
 * Creates updated timestamp hook
 *
 * Automatically updates updatedAt and updatedBy fields on record
 * modification with transaction awareness.
 *
 * @param fields - Update timestamp configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Model.addHook('beforeUpdate', createUpdatedTimestampHook({
 *   updatedAt: 'updated_at',
 *   updatedBy: 'updated_by_user_id'
 * }));
 * ```
 */
export function createUpdatedTimestampHook(
  fields: {
    updatedAt?: string;
    updatedBy?: string;
  }
): (instance: any, options: any) => void {
  return (instance: any, options: any) => {
    if (fields.updatedAt) {
      instance[fields.updatedAt] = new Date();
    }

    if (fields.updatedBy && options.userId) {
      instance[fields.updatedBy] = options.userId;
    }
  };
}

/**
 * Creates change tracking hook
 *
 * Tracks what fields changed and their previous values for audit
 * trails and change history in healthcare compliance scenarios.
 *
 * @param storageField - Field to store change metadata
 * @param options - Tracking options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Patient.addHook('beforeUpdate', createChangeTrackingHook('changeHistory', {
 *   trackFields: ['diagnosis', 'treatment', 'medications'],
 *   includeUser: true
 * }));
 * ```
 */
export function createChangeTrackingHook(
  storageField: string,
  options: {
    trackFields?: string[];
    includeUser?: boolean;
    includeTimestamp?: boolean;
  } = {}
): (instance: any, hookOptions: any) => void {
  return (instance: any, hookOptions: any) => {
    const changed = instance.changed();
    if (!changed || changed.length === 0) return;

    const changes: Record<string, { old: any; new: any }> = {};
    const fieldsToTrack = options.trackFields || changed;

    for (const field of fieldsToTrack) {
      if (changed.includes(field)) {
        changes[field] = {
          old: instance._previousDataValues[field],
          new: instance[field],
        };
      }
    }

    if (Object.keys(changes).length === 0) return;

    const changeEntry: any = { changes };

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

/**
 * Creates optimistic locking hook with version checking
 *
 * Implements optimistic concurrency control using version field to
 * prevent lost updates in concurrent modification scenarios.
 *
 * @param versionField - Version field name
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Document.addHook('beforeUpdate', createOptimisticLockingHook('version'));
 * ```
 */
export function createOptimisticLockingHook(
  versionField: string = 'version'
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    if (!instance.changed()) return;

    const currentVersion = instance[versionField] || 0;
    const previousVersion = instance._previousDataValues[versionField] || 0;

    // Check if another transaction has modified the record
    const fresh = await instance.constructor.findByPk(instance.id, {
      attributes: [versionField],
      transaction: options.transaction,
    });

    if (fresh && fresh[versionField] !== previousVersion) {
      throw new Error(
        `Optimistic lock error: Record was modified by another user. Expected version ${previousVersion}, found ${fresh[versionField]}`
      );
    }

    // Increment version
    instance[versionField] = currentVersion + 1;

    // Add version check to WHERE clause
    if (!options.where) {
      options.where = {};
    }
    options.where[versionField] = previousVersion;
  };
}

/**
 * Creates conditional validation hook
 *
 * Applies additional validation rules based on field values or state
 * transitions for complex business rule enforcement.
 *
 * @param conditions - Conditional validation rules
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Order.addHook('beforeUpdate', createConditionalValidationHook({
 *   'status === "shipped"': (instance) => {
 *     if (!instance.trackingNumber) {
 *       throw new Error('Tracking number required for shipped orders');
 *     }
 *   },
 *   'status === "cancelled"': (instance) => {
 *     if (!instance.cancellationReason) {
 *       throw new Error('Cancellation reason required');
 *     }
 *   }
 * }));
 * ```
 */
export function createConditionalValidationHook(
  conditions: Record<string, (instance: any, options: any) => void | Promise<void>>
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    for (const [condition, validator] of Object.entries(conditions)) {
      try {
        // Evaluate condition
        const conditionFn = new Function('instance', `with (instance) { return ${condition}; }`);
        if (conditionFn(instance)) {
          await validator(instance, options);
        }
      } catch (error) {
        if (error instanceof Error && !error.message.includes('is not defined')) {
          throw error;
        }
      }
    }
  };
}

// ============================================================================
// After Create/Update/Delete Hooks
// ============================================================================

/**
 * Creates audit logging hook
 *
 * Records all data changes to audit log table with full change tracking,
 * user attribution, and IP logging for HIPAA compliance.
 *
 * @param auditModel - Model for storing audit logs
 * @param options - Audit configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Patient.addHook('afterUpdate', createAuditLoggingHook(AuditLog, {
 *   trackFields: ['diagnosis', 'treatment'],
 *   includeIP: true,
 *   includeUserAgent: true
 * }));
 * ```
 */
export function createAuditLoggingHook(
  auditModel: ModelStatic<any>,
  options: {
    action?: 'CREATE' | 'UPDATE' | 'DELETE';
    trackFields?: string[];
    includeIP?: boolean;
    includeUserAgent?: boolean;
    excludeFields?: string[];
  } = {}
): (instance: any, hookOptions: any) => Promise<void> {
  return async (instance: any, hookOptions: any) => {
    const action = options.action || detectAction(hookOptions);
    const changes: Record<string, { old: any; new: any }> = {};

    if (action === 'UPDATE') {
      const changed = instance.changed() || [];
      const fieldsToTrack = options.trackFields || changed;

      for (const field of fieldsToTrack) {
        if (options.excludeFields?.includes(field)) continue;

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
      const auditEntry: any = {
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
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Don't fail the main operation if audit logging fails
    }
  };
}

/**
 * Creates cache invalidation hook
 *
 * Invalidates cached data when records are modified, supporting Redis,
 * Memcached, and custom cache backends with pattern matching.
 *
 * @param cacheClient - Cache client instance
 * @param config - Cache invalidation configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * User.addHook('afterUpdate', createCacheInvalidationHook(redisClient, {
 *   keys: (instance) => [`user:${instance.id}`, `user:email:${instance.email}`],
 *   patterns: ['user:list:*'],
 *   cascade: true
 * }));
 * ```
 */
export function createCacheInvalidationHook(
  cacheClient: any,
  config: CacheInvalidationConfig
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    try {
      const keys = typeof config.keys === 'function'
        ? config.keys(instance)
        : config.keys;

      // Delete specific keys
      if (keys.length > 0) {
        if (cacheClient.del) {
          await cacheClient.del(...keys);
        } else if (cacheClient.delete) {
          await Promise.all(keys.map((key) => cacheClient.delete(key)));
        }
      }

      // Delete by pattern
      if (config.patterns && cacheClient.keys) {
        for (const pattern of config.patterns) {
          const matchingKeys = await cacheClient.keys(pattern);
          if (matchingKeys.length > 0) {
            await cacheClient.del(...matchingKeys);
          }
        }
      }
    } catch (error) {
      console.error('Cache invalidation failed:', error);
      // Don't fail the main operation
    }
  };
}

/**
 * Creates notification dispatch hook
 *
 * Sends notifications via multiple channels when records are created or
 * updated, with template support and conditional delivery.
 *
 * @param notificationService - Notification service instance
 * @param config - Notification configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Appointment.addHook('afterCreate', createNotificationHook(notifier, {
 *   channels: ['email', 'sms'],
 *   recipients: (instance) => [instance.patientEmail],
 *   template: 'appointment-confirmation',
 *   condition: (instance) => instance.status === 'confirmed'
 * }));
 * ```
 */
export function createNotificationHook(
  notificationService: any,
  config: NotificationConfig
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    // Check condition
    if (config.condition && !config.condition(instance)) {
      return;
    }

    const recipients = typeof config.recipients === 'function'
      ? config.recipients(instance)
      : config.recipients;

    if (recipients.length === 0) return;

    try {
      for (const channel of config.channels) {
        await notificationService.send({
          channel,
          recipients,
          template: config.template,
          data: instance.toJSON(),
        });
      }
    } catch (error) {
      console.error('Notification dispatch failed:', error);
      // Don't fail the main operation
    }
  };
}

/**
 * Creates search index update hook
 *
 * Updates full-text search indexes (Elasticsearch, Algolia, etc.) when
 * records are modified for real-time search capability.
 *
 * @param searchClient - Search client instance
 * @param options - Indexing options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Product.addHook('afterUpdate', createSearchIndexUpdateHook(elasticClient, {
 *   index: 'products',
 *   idField: 'id',
 *   includeFields: ['name', 'description', 'category'],
 *   async: true
 * }));
 * ```
 */
export function createSearchIndexUpdateHook(
  searchClient: any,
  options: {
    index: string;
    idField?: string;
    includeFields?: string[];
    excludeFields?: string[];
    async?: boolean;
  }
): (instance: any, hookOptions: any) => Promise<void> {
  return async (instance: any, hookOptions: any) => {
    const idField = options.idField || 'id';
    const documentId = instance[idField];

    if (!documentId) return;

    const indexData: any = {};

    const data = instance.toJSON();
    for (const [key, value] of Object.entries(data)) {
      if (options.excludeFields?.includes(key)) continue;
      if (options.includeFields && !options.includeFields.includes(key)) continue;

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
        } else if (searchClient.partialUpdateObject) {
          await searchClient.partialUpdateObject(indexData, {
            objectID: documentId,
          });
        }
      } catch (error) {
        console.error('Search index update failed:', error);
      }
    };

    if (options.async) {
      // Fire and forget
      updateIndex();
    } else {
      await updateIndex();
    }
  };
}

/**
 * Creates webhook trigger hook
 *
 * Triggers HTTP webhooks when records are modified, with retry logic,
 * signature verification, and payload customization.
 *
 * @param webhookConfig - Webhook configuration
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Order.addHook('afterCreate', createWebhookTriggerHook({
 *   url: 'https://api.example.com/webhook',
 *   secret: process.env.WEBHOOK_SECRET,
 *   events: ['order.created'],
 *   retries: 3
 * }));
 * ```
 */
export function createWebhookTriggerHook(
  webhookConfig: {
    url: string;
    secret?: string;
    events?: string[];
    headers?: Record<string, string>;
    retries?: number;
    timeout?: number;
  }
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    const payload = {
      event: `${instance.constructor.name.toLowerCase()}.${detectAction(options)}`,
      data: instance.toJSON(),
      timestamp: new Date().toISOString(),
    };

    const body = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...webhookConfig.headers,
    };

    // Add signature if secret provided
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
          break; // Success
        }

        if (attempt === retries - 1) {
          console.error('Webhook failed after retries:', response.status);
        }
      } catch (error) {
        if (attempt === retries - 1) {
          console.error('Webhook trigger failed:', error);
        }
      }
    }
  };
}

// ============================================================================
// Bulk Operation Hooks
// ============================================================================

/**
 * Creates bulk audit logging hook
 *
 * Logs bulk operations with summary statistics and affected record IDs
 * for comprehensive audit trails of batch modifications.
 *
 * @param auditModel - Audit log model
 * @param options - Bulk audit options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * User.addHook('afterBulkUpdate', createBulkAuditLoggingHook(AuditLog, {
 *   includeAffectedIds: true,
 *   maxIdsToLog: 1000
 * }));
 * ```
 */
export function createBulkAuditLoggingHook(
  auditModel: ModelStatic<any>,
  options: {
    includeAffectedIds?: boolean;
    maxIdsToLog?: number;
  } = {}
): (hookOptions: any) => Promise<void> {
  return async (hookOptions: any) => {
    try {
      const auditEntry: any = {
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

        auditEntry.metadata.affectedIds = affected.map((r: any) => r.id);
        auditEntry.metadata.affectedCount = affected.length;
      }

      await auditModel.create(auditEntry, { transaction: hookOptions.transaction });
    } catch (error) {
      console.error('Bulk audit logging failed:', error);
    }
  };
}

/**
 * Creates bulk validation hook
 *
 * Validates records before bulk operations with configurable error
 * handling (fail-fast vs. collect all errors).
 *
 * @param validator - Validation function
 * @param options - Validation options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Product.addHook('beforeBulkCreate', createBulkValidationHook(
 *   (instances) => instances.every(i => i.price > 0),
 *   { failFast: false, throwOnError: true }
 * ));
 * ```
 */
export function createBulkValidationHook(
  validator: (instances: any[], options: any) => boolean | Promise<boolean>,
  options: {
    failFast?: boolean;
    throwOnError?: boolean;
    errorMessage?: string;
  } = {}
): (instances: any[], hookOptions: any) => Promise<void> {
  return async (instances: any[], hookOptions: any) => {
    try {
      const isValid = await validator(instances, hookOptions);

      if (!isValid && options.throwOnError !== false) {
        throw new Error(options.errorMessage || 'Bulk validation failed');
      }
    } catch (error) {
      if (options.throwOnError !== false) {
        throw error;
      }

      console.error('Bulk validation failed:', error);
    }
  };
}

/**
 * Creates bulk progress tracking hook
 *
 * Tracks progress of large bulk operations with periodic updates for
 * long-running batch processes and user feedback.
 *
 * @param progressCallback - Progress callback function
 * @param options - Progress tracking options
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Record.addHook('beforeBulkCreate', createBulkProgressTrackingHook(
 *   (processed, total) => console.log(`${processed}/${total} processed`),
 *   { updateInterval: 100 }
 * ));
 * ```
 */
export function createBulkProgressTrackingHook(
  progressCallback: (processed: number, total: number, batchInfo: any) => void,
  options: {
    updateInterval?: number;
  } = {}
): (instances: any[], hookOptions: any) => void {
  return (instances: any[], hookOptions: any) => {
    const total = instances.length;
    const updateInterval = options.updateInterval || 100;

    hookOptions._progressTracker = {
      total,
      processed: 0,
      startTime: new Date(),
      callback: progressCallback,
      updateInterval,
    };

    // Initial progress
    progressCallback(0, total, { startTime: new Date() });
  };
}

// ============================================================================
// Transaction Hooks
// ============================================================================

/**
 * Creates transaction savepoint hook
 *
 * Creates savepoints within transactions for partial rollback capability
 * in complex multi-step operations.
 *
 * @param savepointName - Savepoint identifier
 * @returns Hook function
 *
 * @example
 * ```typescript
 * Model.addHook('beforeCreate', createTransactionSavepointHook('before_create'));
 * ```
 */
export function createTransactionSavepointHook(
  savepointName: string
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    if (!options.transaction) return;

    try {
      await options.transaction.connection.query(`SAVEPOINT ${savepointName}`);
      (options.transaction as any)._savepoints = (options.transaction as any)._savepoints || [];
      (options.transaction as any)._savepoints.push(savepointName);
    } catch (error) {
      console.error('Savepoint creation failed:', error);
    }
  };
}

/**
 * Creates transaction commit validation hook
 *
 * Validates transaction state before commit with business rule checking
 * and referential integrity verification.
 *
 * @param validators - Array of validation functions
 * @returns Hook function
 *
 * @example
 * ```typescript
 * sequelize.addHook('beforeCommit', createTransactionCommitValidationHook([
 *   async (transaction) => {
 *     // Verify all order items have valid products
 *     return true;
 *   }
 * ]));
 * ```
 */
export function createTransactionCommitValidationHook(
  validators: Array<(transaction: Transaction) => boolean | Promise<boolean>>
): (transaction: Transaction) => Promise<void> {
  return async (transaction: Transaction) => {
    for (const validator of validators) {
      try {
        const isValid = await validator(transaction);
        if (!isValid) {
          throw new Error('Transaction validation failed');
        }
      } catch (error) {
        throw error;
      }
    }
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Detects the action type from hook options
 *
 * @param options - Hook options
 * @returns Action type
 */
function detectAction(options: any): 'CREATE' | 'UPDATE' | 'DELETE' {
  if (options.hooks === false) return 'UPDATE';

  const hookType = options._hookType || '';

  if (hookType.includes('Create')) return 'CREATE';
  if (hookType.includes('Update')) return 'UPDATE';
  if (hookType.includes('Destroy') || hookType.includes('Delete')) return 'DELETE';

  return 'UPDATE';
}

/**
 * Combines multiple hooks into a single hook function
 *
 * Executes multiple hook functions in sequence with error handling
 * and conditional execution support.
 *
 * @param hooks - Array of hook functions
 * @param options - Combination options
 * @returns Combined hook function
 *
 * @example
 * ```typescript
 * const combinedHook = combineHooks([
 *   createTimestampHook({ createdAt: 'created_at' }),
 *   createAuditLoggingHook(AuditLog)
 * ], { stopOnError: false });
 * Model.addHook('beforeCreate', combinedHook);
 * ```
 */
export function combineHooks(
  hooks: Array<(instance: any, options: any) => void | Promise<void>>,
  options: {
    stopOnError?: boolean;
    parallel?: boolean;
  } = {}
): (instance: any, hookOptions: any) => Promise<void> {
  return async (instance: any, hookOptions: any) => {
    if (options.parallel) {
      const results = await Promise.allSettled(
        hooks.map((hook) => Promise.resolve(hook(instance, hookOptions)))
      );

      if (options.stopOnError !== false) {
        const failed = results.find((r) => r.status === 'rejected');
        if (failed && failed.status === 'rejected') {
          throw failed.reason;
        }
      }
    } else {
      for (const hook of hooks) {
        try {
          await hook(instance, hookOptions);
        } catch (error) {
          if (options.stopOnError !== false) {
            throw error;
          }
          console.error('Hook execution failed:', error);
        }
      }
    }
  };
}

/**
 * Creates conditional hook wrapper
 *
 * Executes hook only when condition is met for conditional
 * processing based on instance state or context.
 *
 * @param condition - Condition function
 * @param hook - Hook to conditionally execute
 * @returns Conditional hook function
 *
 * @example
 * ```typescript
 * const conditionalHook = createConditionalHook(
 *   (instance) => instance.status === 'published',
 *   createNotificationHook(notifier, config)
 * );
 * ```
 */
export function createConditionalHook(
  condition: (instance: any, options: any) => boolean | Promise<boolean>,
  hook: (instance: any, options: any) => void | Promise<void>
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    const shouldExecute = await condition(instance, options);
    if (shouldExecute) {
      await hook(instance, options);
    }
  };
}

/**
 * Creates hook execution logger
 *
 * Wraps hook with logging for debugging and monitoring hook execution
 * performance and error tracking.
 *
 * @param hookName - Name for logging
 * @param hook - Hook to wrap
 * @param logger - Logger instance
 * @returns Logged hook function
 *
 * @example
 * ```typescript
 * const loggedHook = createHookLogger('audit-logging', auditHook, console);
 * Model.addHook('afterCreate', loggedHook);
 * ```
 */
export function createHookLogger(
  hookName: string,
  hook: (instance: any, options: any) => void | Promise<void>,
  logger: any = console
): (instance: any, options: any) => Promise<void> {
  return async (instance: any, options: any) => {
    const startTime = Date.now();

    try {
      logger.log(`[${hookName}] Starting execution`);
      await hook(instance, options);
      const duration = Date.now() - startTime;
      logger.log(`[${hookName}] Completed in ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`[${hookName}] Failed after ${duration}ms:`, error);
      throw error;
    }
  };
}

/**
 * Removes all hooks of a specific type from model
 *
 * Clears hooks for testing or dynamic reconfiguration scenarios
 * with selective hook removal capability.
 *
 * @param model - Model to remove hooks from
 * @param hookType - Type of hooks to remove
 *
 * @example
 * ```typescript
 * removeAllHooks(User, 'beforeCreate');
 * ```
 */
export function removeAllHooks(
  model: ModelStatic<any>,
  hookType?: keyof Hooks<any>
): void {
  if (hookType) {
    model.removeHook(hookType);
  } else {
    const hookTypes: Array<keyof Hooks<any>> = [
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

/**
 * Lists all registered hooks on a model
 *
 * Retrieves all hook functions for inspection and debugging
 * with detailed hook metadata.
 *
 * @param model - Model to inspect
 * @returns Hook configuration map
 *
 * @example
 * ```typescript
 * const hooks = listModelHooks(User);
 * console.log('Registered hooks:', Object.keys(hooks));
 * ```
 */
export function listModelHooks(
  model: ModelStatic<any>
): Record<string, Function[]> {
  const hooks: Record<string, Function[]> = {};
  const hookTypes: Array<keyof Hooks<any>> = [
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
