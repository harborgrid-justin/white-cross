/**
 * Model Audit Hooks Service
 *
 * Centralized service for Sequelize model lifecycle hooks that integrate with
 * the White Cross audit logging system. Provides HIPAA-compliant audit trails
 * for all PHI entity modifications.
 *
 * Usage in models:
 * ```typescript
 * import { createModelAuditHook } from '@/database/services/model-audit-hooks.service';
 *
 * @BeforeCreate
 * @BeforeUpdate
 * static async auditPHIAccess(instance: YourModel) {
 *   await createModelAuditHook('YourModel', instance);
 * }
 * ```
 */

import { Model } from 'sequelize-typescript';
import { AuditAction } from '../types/database.enums';

/**
 * Audit context information
 */
interface AuditContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  sessionId?: string;
}

/**
 * Singleton audit logger instance
 * Lazy-loaded to avoid circular dependencies
 */
let auditLoggerInstance: any = null;

/**
 * Get or initialize the audit logger instance
 * Uses lazy loading to avoid circular dependencies during module initialization
 *
 * @returns {Promise<any>} Audit logger instance
 */
async function getAuditLogger(): Promise<any> {
  if (!auditLoggerInstance) {
    try {
      // Dynamic import to avoid circular dependencies
      // Note: This uses a fallback console logger to avoid circular dependency issues
      // In production, the proper AuditService will be injected via setAuditLogger()
      auditLoggerInstance = {
        async logCreate(entityType: string, entityId: string, context: any, data: any, transaction?: any) {
          console.log(`[AUDIT-CREATE] ${entityType} ${entityId}`, { context, data });
        },
        async logUpdate(entityType: string, entityId: string, context: any, changes: any, transaction?: any) {
          console.log(`[AUDIT-UPDATE] ${entityType} ${entityId}`, { context, changes });
        },
        async logDelete(entityType: string, entityId: string, context: any, data: any, transaction?: any) {
          console.log(`[AUDIT-DELETE] ${entityType} ${entityId}`, { context, data });
        }
      };
    } catch (error) {
      // Fallback to console logging if audit service is not available
      console.warn('[AUDIT] Audit service not available, using console logging:', error);
      auditLoggerInstance = {
        async logCreate(entityType: string, entityId: string, context: any, data: any) {
          console.log(`[AUDIT-CREATE] ${entityType} ${entityId}`, { context, data });
        },
        async logUpdate(entityType: string, entityId: string, context: any, changes: any) {
          console.log(`[AUDIT-UPDATE] ${entityType} ${entityId}`, { context, changes });
        },
        async logDelete(entityType: string, entityId: string, context: any, data: any) {
          console.log(`[AUDIT-DELETE] ${entityType} ${entityId}`, { context, data });
        }
      };
    }
  }
  return auditLoggerInstance;
}

/**
 * Set the audit logger instance
 * Should be called during application initialization with the proper AuditService
 *
 * @param {any} logger - Audit logger instance implementing IAuditLogger interface
 */
export function setAuditLogger(logger: any): void {
  auditLoggerInstance = logger;
}

/**
 * Extract audit context from AsyncLocalStorage or request context
 * Falls back to system context if no user context is available
 *
 * @returns {AuditContext} Audit context information
 */
function getAuditContext(): AuditContext {
  try {
    // Try to get context from AsyncLocalStorage if available
    // This would be set by a middleware in the application
    const asyncLocalStorage = (global as any).__auditContext__;
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
  } catch (error) {
    // Context not available, use system context
  }

  // Default system context
  return {
    userId: 'system',
    ipAddress: '127.0.0.1',
    userAgent: 'System',
    requestId: `sys-${Date.now()}`,
  };
}

/**
 * Sanitize sensitive data before logging
 * Removes passwords, tokens, and other sensitive fields
 *
 * @param {Record<string, unknown>} data - Data to sanitize
 * @returns {Record<string, unknown>} Sanitized data
 */
function sanitizeAuditData(data: Record<string, unknown>): Record<string, unknown> {
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

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeAuditData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Main audit hook function for Sequelize model lifecycle events
 * Automatically detects create vs update operations and logs appropriate audit entries
 *
 * @param {string} modelName - Name of the model being audited
 * @param {Model} instance - Sequelize model instance
 * @param {any} [transaction] - Optional transaction context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * @BeforeCreate
 * @BeforeUpdate
 * static async auditPHIAccess(instance: Student) {
 *   await createModelAuditHook('Student', instance);
 * }
 * ```
 */
export async function createModelAuditHook(
  modelName: string,
  instance: Model,
  transaction?: any
): Promise<void> {
  try {
    const logger = await getAuditLogger();
    const context = getAuditContext();
    const instanceData = instance.get({ plain: true });
    const entityId = instanceData.id as string || 'unknown';

    // Determine if this is a create or update operation
    const isNewRecord = instance.isNewRecord;
    const changedFields = instance.changed();

    if (isNewRecord) {
      // CREATE operation
      const sanitizedData = sanitizeAuditData(instanceData);
      await logger.logCreate(
        modelName,
        entityId,
        context,
        sanitizedData,
        transaction
      );
    } else if (changedFields && (changedFields as string[]).length > 0) {
      // UPDATE operation - build changes object with before/after values
      const changes: Record<string, { before: unknown; after: unknown }> = {};

      for (const field of changedFields as string[]) {
        const previousValue = instance.previous(field);
        const currentValue = (instanceData as any)[field];

        changes[field] = {
          before: previousValue,
          after: currentValue,
        };
      }

      const sanitizedChanges = sanitizeAuditData(changes as any) as Record<string, { before: unknown; after: unknown }>;

      await logger.logUpdate(
        modelName,
        entityId,
        context,
        sanitizedChanges,
        transaction
      );
    }
  } catch (error) {
    // Never throw errors from audit hooks to prevent disrupting model operations
    // Log the error and continue
    console.error(`[AUDIT ERROR] Failed to audit ${modelName}:`, error);
  }
}

/**
 * Audit hook for delete operations
 * Should be used with @BeforeDestroy hook
 *
 * @param {string} modelName - Name of the model being audited
 * @param {Model} instance - Sequelize model instance
 * @param {any} [transaction] - Optional transaction context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * @BeforeDestroy
 * static async auditDeletion(instance: Student) {
 *   await deleteModelAuditHook('Student', instance);
 * }
 * ```
 */
export async function deleteModelAuditHook(
  modelName: string,
  instance: Model,
  transaction?: any
): Promise<void> {
  try {
    const logger = await getAuditLogger();
    const context = getAuditContext();
    const instanceData = instance.get({ plain: true });
    const entityId = instanceData.id as string || 'unknown';
    const sanitizedData = sanitizeAuditData(instanceData);

    await logger.logDelete(
      modelName,
      entityId,
      context,
      sanitizedData,
      transaction
    );
  } catch (error) {
    // Never throw errors from audit hooks
    console.error(`[AUDIT ERROR] Failed to audit deletion of ${modelName}:`, error);
  }
}

/**
 * Bulk operation audit hook
 * Use for operations that affect multiple records
 *
 * @param {string} modelName - Name of the model being audited
 * @param {string} operation - Operation being performed (e.g., 'BULK_DELETE', 'BULK_UPDATE')
 * @param {Record<string, unknown>} metadata - Additional operation metadata
 * @param {any} [transaction] - Optional transaction context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await bulkOperationAuditHook('Student', 'BULK_UPDATE', {
 *   affectedCount: 50,
 *   criteria: { schoolId: 'school-123' }
 * });
 * ```
 */
export async function bulkOperationAuditHook(
  modelName: string,
  operation: string,
  metadata: Record<string, unknown>,
  transaction?: any
): Promise<void> {
  try {
    const logger = await getAuditLogger();
    const context = getAuditContext();
    const sanitizedMetadata = sanitizeAuditData(metadata);

    await logger.logBulkOperation(
      operation,
      modelName,
      context,
      sanitizedMetadata,
      transaction
    );
  } catch (error) {
    // Never throw errors from audit hooks
    console.error(`[AUDIT ERROR] Failed to audit bulk operation on ${modelName}:`, error);
  }
}
