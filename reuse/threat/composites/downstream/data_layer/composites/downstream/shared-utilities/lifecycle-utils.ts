/**
 * Lifecycle Utilities - Model Lifecycle Hook Convenience Functions
 *
 * Re-exports all lifecycle hooks from reference composite library and provides
 * convenient registration functions for common model patterns (threat intelligence,
 * healthcare/HIPAA, workflow state management).
 *
 * @module shared-utilities/lifecycle-utils
 * @version 1.0.0
 * @requires reuse/data/composites/model-lifecycle-hooks (1,334 lines - 25+ hooks)
 */

import { ModelStatic } from 'sequelize';
import { Redis } from 'ioredis';

// ============================================================================
// RE-EXPORT ALL LIFECYCLE HOOKS (1,334 lines - 25+ hooks)
// ============================================================================

export * from '../../../../../data/composites/model-lifecycle-hooks';

// Import specific hooks for convenience function composition
import {
  createTimestampHook,
  createUpdatedTimestampHook,
  createAuditLoggingHook,
  createCacheInvalidationHook,
  createOptimisticLockingHook,
  createFieldNormalizationHook,
  createChangeTrackingHook,
  createFieldEncryptionHook,
  createFieldDecryptionHook,
  createConditionalValidationHook,
} from '../../../../../data/composites/model-lifecycle-hooks';

// ============================================================================
// CONVENIENCE HOOK REGISTRATION FUNCTIONS
// ============================================================================

/**
 * Register standard lifecycle hooks for threat intelligence models
 *
 * Includes:
 * - Automatic timestamps (createdAt, updatedAt)
 * - Audit logging (CREATE, UPDATE, DELETE)
 * - Optimistic locking (version field)
 * - Cache invalidation (afterUpdate, afterDestroy)
 * - Change tracking (severity, status, mitigation)
 *
 * @param model - The Sequelize model to register hooks on
 * @param redis - Redis instance for cache invalidation
 * @param auditLogModel - Model to use for audit logging
 * @param options - Additional options
 */
export function registerThreatLifecycleHooks(
  model: ModelStatic<any>,
  redis: Redis,
  auditLogModel: ModelStatic<any>,
  options: {
    enableChangeTracking?: boolean;
    trackedFields?: string[];
    customValidations?: Record<string, (instance: any) => void>;
  } = {}
): void {
  const {
    enableChangeTracking = true,
    trackedFields = ['severity', 'status', 'mitigation', 'resolution'],
    customValidations = {},
  } = options;

  // ====================================================================
  // BEFORE CREATE HOOKS
  // ====================================================================

  model.addHook('beforeCreate', 'setCreatedTimestamp', createTimestampHook({
    createdAt: 'createdAt',
    createdBy: 'createdBy',
  }));

  model.addHook('beforeCreate', 'normalizeFields', createFieldNormalizationHook({
    title: ['trim'],
    description: ['trim'],
    type: ['trim', 'uppercase'],
  }));

  // ====================================================================
  // BEFORE UPDATE HOOKS
  // ====================================================================

  model.addHook('beforeUpdate', 'setUpdatedTimestamp', createUpdatedTimestampHook({
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
  }));

  model.addHook('beforeUpdate', 'checkOptimisticLock', createOptimisticLockingHook('version'));

  if (enableChangeTracking) {
    model.addHook('beforeUpdate', 'trackChanges', createChangeTrackingHook('changeHistory', {
      trackFields: trackedFields,
      includeUser: true,
      includeTimestamp: true,
    }));
  }

  // Threat-specific validations
  model.addHook('beforeUpdate', 'validateThreatStateTransitions', createConditionalValidationHook({
    'status === "ARCHIVED"': (instance: any) => {
      if (!instance.resolution) {
        throw new Error('Resolution required before archiving threat');
      }
    },
    'status === "RESOLVED"': (instance: any) => {
      if (!instance.resolution) {
        throw new Error('Resolution required before resolving threat');
      }
    },
    'severity === "CRITICAL"': (instance: any) => {
      if (!instance.executiveNotification) {
        console.warn(`[${model.name}] Executive notification should be set for CRITICAL threats`);
      }
    },
    ...customValidations,
  }));

  // ====================================================================
  // AFTER CREATE HOOKS
  // ====================================================================

  model.addHook('afterCreate', 'auditCreate', createAuditLoggingHook(auditLogModel, {
    action: 'CREATE',
    includeIP: true,
    includeUserAgent: true,
  }));

  // ====================================================================
  // AFTER UPDATE HOOKS
  // ====================================================================

  model.addHook('afterUpdate', 'auditUpdate', createAuditLoggingHook(auditLogModel, {
    action: 'UPDATE',
    trackFields: trackedFields,
    includeIP: true,
    includeUserAgent: true,
  }));

  model.addHook('afterUpdate', 'invalidateCacheOnUpdate', createCacheInvalidationHook(redis, {
    keys: (instance: any) => [
      `${model.name}:${instance.id}`,
      `threats:critical:active`,
      `threats:statistics`,
    ],
    patterns: [`${model.name}:*`, 'threats:filter:*', 'threats:recent:*'],
    cascade: true,
  }));

  // ====================================================================
  // AFTER DESTROY HOOKS
  // ====================================================================

  model.addHook('afterDestroy', 'auditDelete', createAuditLoggingHook(auditLogModel, {
    action: 'DELETE',
    includeIP: true,
    includeUserAgent: true,
  }));

  model.addHook('afterDestroy', 'invalidateCacheOnDelete', createCacheInvalidationHook(redis, {
    keys: (instance: any) => [
      `${model.name}:${instance.id}`,
      `threats:critical:active`,
      `threats:statistics`,
    ],
    patterns: [`${model.name}:*`, 'threats:filter:*', 'threats:recent:*'],
    cascade: true,
  }));

  console.log(`[LifecycleUtils] Registered threat lifecycle hooks for ${model.name}`);
}

/**
 * Register HIPAA-compliant lifecycle hooks for healthcare models
 *
 * Includes:
 * - All standard hooks (timestamps, audit logging, optimistic locking)
 * - PHI field encryption (beforeCreate, beforeUpdate)
 * - PHI field decryption (afterFind)
 * - Enhanced audit logging for PHI access
 * - NO CACHING of PHI data (HIPAA compliance)
 *
 * @param model - The Sequelize model to register hooks on
 * @param encryptionKey - Encryption key for PHI fields
 * @param auditLogModel - Model to use for audit logging
 * @param options - Additional options including PHI fields to encrypt
 */
export function registerHealthcareLifecycleHooks(
  model: ModelStatic<any>,
  encryptionKey: string | Buffer,
  auditLogModel: ModelStatic<any>,
  options: {
    phiFields?: string[];
    enableChangeTracking?: boolean;
  } = {}
): void {
  const {
    phiFields = ['ssn', 'mrn', 'email', 'phone', 'address', 'dateOfBirth'],
    enableChangeTracking = true,
  } = options;

  // ====================================================================
  // BEFORE CREATE HOOKS
  // ====================================================================

  model.addHook('beforeCreate', 'setCreatedTimestamp', createTimestampHook({
    createdAt: 'createdAt',
    createdBy: 'createdBy',
  }));

  // Encrypt PHI fields before storing
  model.addHook('beforeCreate', 'encryptPHI', createFieldEncryptionHook({
    fields: phiFields,
    algorithm: 'aes-256-gcm',
    key: encryptionKey,
  }));

  model.addHook('beforeCreate', 'normalizeFields', createFieldNormalizationHook({
    email: ['trim', 'lowercase'],
    name: ['trim'],
  }));

  // ====================================================================
  // BEFORE UPDATE HOOKS
  // ====================================================================

  model.addHook('beforeUpdate', 'setUpdatedTimestamp', createUpdatedTimestampHook({
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
  }));

  model.addHook('beforeUpdate', 'checkOptimisticLock', createOptimisticLockingHook('version'));

  // Encrypt PHI fields before updating
  model.addHook('beforeUpdate', 'encryptPHIOnUpdate', createFieldEncryptionHook({
    fields: phiFields,
    algorithm: 'aes-256-gcm',
    key: encryptionKey,
  }));

  if (enableChangeTracking) {
    model.addHook('beforeUpdate', 'trackPHIChanges', createChangeTrackingHook('changeHistory', {
      trackFields: phiFields,
      includeUser: true,
      includeTimestamp: true,
      maskSensitiveData: true, // Mask PHI in change history
    }));
  }

  // ====================================================================
  // AFTER FIND HOOKS
  // ====================================================================

  // Decrypt PHI fields after retrieval
  model.addHook('afterFind', 'decryptPHI', createFieldDecryptionHook({
    fields: phiFields,
    algorithm: 'aes-256-gcm',
    key: encryptionKey,
  }));

  // ====================================================================
  // AFTER CREATE HOOKS
  // ====================================================================

  model.addHook('afterCreate', 'auditPHICreate', createAuditLoggingHook(auditLogModel, {
    action: 'CREATE',
    includeIP: true,
    includeUserAgent: true,
    sensitiveData: true, // Flag as PHI access
    hipaaCompliant: true,
  }));

  // ====================================================================
  // AFTER UPDATE HOOKS
  // ====================================================================

  model.addHook('afterUpdate', 'auditPHIUpdate', createAuditLoggingHook(auditLogModel, {
    action: 'UPDATE',
    trackFields: phiFields,
    includeIP: true,
    includeUserAgent: true,
    sensitiveData: true,
    hipaaCompliant: true,
  }));

  // NOTE: No cache invalidation hooks - PHI data should NOT be cached

  // ====================================================================
  // AFTER DESTROY HOOKS
  // ====================================================================

  model.addHook('afterDestroy', 'auditPHIDelete', createAuditLoggingHook(auditLogModel, {
    action: 'DELETE',
    includeIP: true,
    includeUserAgent: true,
    sensitiveData: true,
    hipaaCompliant: true,
  }));

  console.log(`[LifecycleUtils] Registered HIPAA-compliant lifecycle hooks for ${model.name}`);
}

/**
 * Register workflow state management lifecycle hooks
 *
 * Includes:
 * - State transition tracking
 * - Automatic state snapshots
 * - State validation rules
 * - Audit logging of state changes
 *
 * @param model - The Sequelize model to register hooks on
 * @param redis - Redis instance for cache invalidation
 * @param auditLogModel - Model to use for audit logging
 * @param options - Additional options
 */
export function registerWorkflowLifecycleHooks(
  model: ModelStatic<any>,
  redis: Redis,
  auditLogModel: ModelStatic<any>,
  options: {
    stateField?: string;
    stateTransitions?: Record<string, string[]>;
  } = {}
): void {
  const {
    stateField = 'status',
    stateTransitions = {
      NEW: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'BLOCKED', 'CANCELLED'],
      BLOCKED: ['IN_PROGRESS', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    },
  } = options;

  // ====================================================================
  // BEFORE CREATE HOOKS
  // ====================================================================

  model.addHook('beforeCreate', 'setCreatedTimestamp', createTimestampHook({
    createdAt: 'createdAt',
    createdBy: 'createdBy',
  }));

  // ====================================================================
  // BEFORE UPDATE HOOKS
  // ====================================================================

  model.addHook('beforeUpdate', 'setUpdatedTimestamp', createUpdatedTimestampHook({
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
  }));

  model.addHook('beforeUpdate', 'checkOptimisticLock', createOptimisticLockingHook('version'));

  // Track state transitions
  model.addHook('beforeUpdate', 'trackStateTransitions', createChangeTrackingHook('stateHistory', {
    trackFields: [stateField, 'stage', 'assignedTo'],
    includeUser: true,
    includeTimestamp: true,
  }));

  // Validate state transitions
  model.addHook('beforeUpdate', 'validateStateTransitions', (instance: any) => {
    if (instance.changed(stateField)) {
      const oldState = instance._previousDataValues[stateField];
      const newState = instance[stateField];

      const allowedTransitions = stateTransitions[oldState] || [];
      if (!allowedTransitions.includes(newState)) {
        throw new Error(
          `Invalid state transition: ${oldState} -> ${newState}. Allowed: ${allowedTransitions.join(', ')}`
        );
      }
    }
  });

  // Validate completion requirements
  model.addHook('beforeUpdate', 'validateCompletion', createConditionalValidationHook({
    'status === "COMPLETED"': (instance: any) => {
      if (!instance.completedBy) {
        throw new Error('Workflow must have completedBy user before marking complete');
      }
      if (!instance.completedAt) {
        instance.completedAt = new Date();
      }
    },
  }));

  // ====================================================================
  // AFTER CREATE HOOKS
  // ====================================================================

  model.addHook('afterCreate', 'auditCreate', createAuditLoggingHook(auditLogModel, {
    action: 'CREATE',
    includeIP: true,
    includeUserAgent: true,
  }));

  // ====================================================================
  // AFTER UPDATE HOOKS
  // ====================================================================

  model.addHook('afterUpdate', 'auditStateChange', createAuditLoggingHook(auditLogModel, {
    action: 'UPDATE',
    trackFields: [stateField, 'stage', 'assignedTo'],
    includeIP: true,
    includeUserAgent: true,
  }));

  model.addHook('afterUpdate', 'invalidateCacheOnUpdate', createCacheInvalidationHook(redis, {
    keys: (instance: any) => [`${model.name}:${instance.id}`, 'workflows:active'],
    patterns: [`${model.name}:*`, 'workflows:*'],
    cascade: true,
  }));

  // ====================================================================
  // AFTER DESTROY HOOKS
  // ====================================================================

  model.addHook('afterDestroy', 'auditDelete', createAuditLoggingHook(auditLogModel, {
    action: 'DELETE',
    includeIP: true,
    includeUserAgent: true,
  }));

  model.addHook('afterDestroy', 'invalidateCacheOnDelete', createCacheInvalidationHook(redis, {
    keys: (instance: any) => [`${model.name}:${instance.id}`, 'workflows:active'],
    patterns: [`${model.name}:*`, 'workflows:*'],
    cascade: true,
  }));

  console.log(`[LifecycleUtils] Registered workflow lifecycle hooks for ${model.name}`);
}

/**
 * Register minimal lifecycle hooks (timestamps and audit logging only)
 *
 * Use for simple models that don't need caching, change tracking, etc.
 *
 * @param model - The Sequelize model to register hooks on
 * @param auditLogModel - Model to use for audit logging
 */
export function registerMinimalLifecycleHooks(
  model: ModelStatic<any>,
  auditLogModel: ModelStatic<any>
): void {
  model.addHook('beforeCreate', 'setCreatedTimestamp', createTimestampHook({
    createdAt: 'createdAt',
    createdBy: 'createdBy',
  }));

  model.addHook('beforeUpdate', 'setUpdatedTimestamp', createUpdatedTimestampHook({
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
  }));

  model.addHook('afterCreate', 'auditCreate', createAuditLoggingHook(auditLogModel, {
    action: 'CREATE',
  }));

  model.addHook('afterUpdate', 'auditUpdate', createAuditLoggingHook(auditLogModel, {
    action: 'UPDATE',
  }));

  model.addHook('afterDestroy', 'auditDelete', createAuditLoggingHook(auditLogModel, {
    action: 'DELETE',
  }));

  console.log(`[LifecycleUtils] Registered minimal lifecycle hooks for ${model.name}`);
}
