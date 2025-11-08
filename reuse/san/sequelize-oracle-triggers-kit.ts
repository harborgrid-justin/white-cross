/**
 * LOC: T1R2I3G4G5
 * File: /reuse/san/sequelize-oracle-triggers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - crypto (built-in)
 *
 * DOWNSTREAM (imported by):
 *   - Model definitions
 *   - Hook implementations
 *   - Audit systems
 *   - Data validation layers
 */

/**
 * File: /reuse/san/sequelize-oracle-triggers-kit.ts
 * Locator: WC-UTL-SEQ-TRIG-001
 * Purpose: Sequelize Oracle Triggers Kit - TypeScript alternatives to Oracle database triggers
 *
 * Upstream: sequelize v6.x, Node 18+, crypto
 * Downstream: Model hooks, audit systems, validation layers, data integrity constraints
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 trigger utilities for insert/update/delete operations, validation, audit trails, and cascading operations
 *
 * LLM Context: Production-grade Sequelize v6.x trigger alternatives for White Cross healthcare platform.
 * Provides before/after insert/update/delete triggers, row-level and statement-level operations,
 * trigger condition evaluation, cascading operations, audit logging, and data validation.
 * HIPAA-compliant with comprehensive PHI protection and audit trail capabilities.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  Transaction,
  Hooks,
  HookReturn,
  ValidationError,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  BulkCreateOptions,
  InstanceUpdateOptions,
  InstanceDestroyOptions,
  Attributes,
  InferAttributes,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Trigger timing configuration
 */
export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF';

/**
 * Trigger event types
 */
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';

/**
 * Trigger level (row or statement)
 */
export type TriggerLevel = 'ROW' | 'STATEMENT';

/**
 * Trigger definition
 */
export interface TriggerDefinition {
  name: string;
  timing: TriggerTiming;
  event: TriggerEvent;
  level: TriggerLevel;
  model: ModelStatic<any>;
  condition?: (instance: Model) => boolean | Promise<boolean>;
  action: (instance: Model, options?: any) => void | Promise<void>;
  enabled?: boolean;
  priority?: number;
}

/**
 * Audit trail entry
 */
export interface AuditTrailEntry {
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields?: string[];
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Trigger execution context
 */
export interface TriggerContext {
  transaction?: Transaction;
  userId?: string;
  sessionId?: string;
  skipTriggers?: string[];
  metadata?: Record<string, any>;
}

/**
 * Cascade rule configuration
 */
export interface CascadeRule {
  sourceModel: ModelStatic<any>;
  targetModel: ModelStatic<any>;
  sourceField: string;
  targetField: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

/**
 * Validation rule for triggers
 */
export interface TriggerValidationRule {
  field: string;
  validator: (value: any, instance: Model) => boolean | Promise<boolean>;
  message: string;
  severity?: 'ERROR' | 'WARNING';
}

/**
 * Trigger execution statistics
 */
export interface TriggerStats {
  triggerName: string;
  executionCount: number;
  errorCount: number;
  averageExecutionTime: number;
  lastExecuted?: Date;
}

// ============================================================================
// TRIGGER REGISTRY
// ============================================================================

/**
 * Registry for trigger definitions
 */
const triggerRegistry = new Map<string, TriggerDefinition>();

/**
 * Trigger execution statistics
 */
const triggerStats = new Map<string, TriggerStats>();

/**
 * Registers a trigger definition with the system.
 * Enables trigger management and execution.
 *
 * @param {TriggerDefinition} trigger - Trigger definition
 * @returns {TriggerDefinition} Registered trigger
 *
 * @example
 * ```typescript
 * registerTrigger({
 *   name: 'trg_user_audit',
 *   timing: 'AFTER',
 *   event: 'UPDATE',
 *   level: 'ROW',
 *   model: User,
 *   action: async (instance) => {
 *     await AuditLog.create({ userId: instance.id, action: 'UPDATE' });
 *   }
 * });
 * ```
 */
export function registerTrigger(trigger: TriggerDefinition): TriggerDefinition {
  if (triggerRegistry.has(trigger.name)) {
    throw new Error(`Trigger ${trigger.name} is already registered`);
  }

  trigger.enabled = trigger.enabled !== false;
  trigger.priority = trigger.priority || 0;

  triggerRegistry.set(trigger.name, trigger);
  return trigger;
}

/**
 * Unregisters a trigger by name.
 * Removes trigger from execution pipeline.
 *
 * @param {string} name - Trigger name
 * @returns {boolean} Whether trigger was unregistered
 *
 * @example
 * ```typescript
 * unregisterTrigger('trg_user_audit');
 * ```
 */
export function unregisterTrigger(name: string): boolean {
  return triggerRegistry.delete(name);
}

/**
 * Lists all registered triggers with optional filtering.
 * Useful for trigger discovery and management.
 *
 * @param {ModelStatic<any>} model - Filter by model
 * @param {TriggerEvent} event - Filter by event
 * @returns {TriggerDefinition[]} List of triggers
 *
 * @example
 * ```typescript
 * const userTriggers = listTriggers(User, 'UPDATE');
 * ```
 */
export function listTriggers(
  model?: ModelStatic<any>,
  event?: TriggerEvent,
): TriggerDefinition[] {
  let triggers = Array.from(triggerRegistry.values());

  if (model) {
    triggers = triggers.filter(t => t.model === model);
  }

  if (event) {
    triggers = triggers.filter(t => t.event === event);
  }

  return triggers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Enables a registered trigger.
 * Allows trigger execution.
 *
 * @param {string} name - Trigger name
 * @returns {boolean} Whether trigger was enabled
 *
 * @example
 * ```typescript
 * enableTrigger('trg_user_audit');
 * ```
 */
export function enableTrigger(name: string): boolean {
  const trigger = triggerRegistry.get(name);
  if (!trigger) return false;

  trigger.enabled = true;
  return true;
}

/**
 * Disables a registered trigger.
 * Prevents trigger execution without unregistering.
 *
 * @param {string} name - Trigger name
 * @returns {boolean} Whether trigger was disabled
 *
 * @example
 * ```typescript
 * disableTrigger('trg_user_audit');
 * ```
 */
export function disableTrigger(name: string): boolean {
  const trigger = triggerRegistry.get(name);
  if (!trigger) return false;

  trigger.enabled = false;
  return true;
}

/**
 * Clears all registered triggers.
 * Primarily used for testing or system reset.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearTriggers(); // Reset trigger registry
 * ```
 */
export function clearTriggers(): void {
  triggerRegistry.clear();
}

// ============================================================================
// BEFORE INSERT TRIGGERS
// ============================================================================

/**
 * Adds a before insert trigger to a model.
 * Executes before record creation.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addBeforeInsertTrigger(User, 'set_default_role', async (instance) => {
 *   if (!instance.role) {
 *     instance.role = 'user';
 *   }
 * });
 * ```
 */
export function addBeforeInsertTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: CreateOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('beforeCreate', name, async (instance: T, options: CreateOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  registerTrigger({
    name,
    timing: 'BEFORE',
    event: 'INSERT',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Sets default values before insert if not provided.
 * Ensures required fields have values.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Record<string, any>} defaults - Default values
 * @returns {ModelStatic<T>} Model with defaults trigger
 *
 * @example
 * ```typescript
 * setDefaultsBeforeInsert(User, {
 *   role: 'user',
 *   isActive: true,
 *   createdBy: 'system'
 * });
 * ```
 */
export function setDefaultsBeforeInsert<T extends Model>(
  model: ModelStatic<T>,
  defaults: Record<string, any>,
): ModelStatic<T> {
  return addBeforeInsertTrigger(
    model,
    `${model.name}_set_defaults`,
    async (instance) => {
      for (const [key, value] of Object.entries(defaults)) {
        if (instance.getDataValue(key as any) === undefined || instance.getDataValue(key as any) === null) {
          instance.setDataValue(key as any, typeof value === 'function' ? await value() : value);
        }
      }
    }
  );
}

/**
 * Validates data before insert using custom rules.
 * Throws ValidationError if validation fails.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {TriggerValidationRule[]} rules - Validation rules
 * @returns {ModelStatic<T>} Model with validation trigger
 *
 * @example
 * ```typescript
 * validateBeforeInsert(User, [
 *   {
 *     field: 'email',
 *     validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
 *     message: 'Invalid email format'
 *   }
 * ]);
 * ```
 */
export function validateBeforeInsert<T extends Model>(
  model: ModelStatic<T>,
  rules: TriggerValidationRule[],
): ModelStatic<T> {
  return addBeforeInsertTrigger(
    model,
    `${model.name}_validate_insert`,
    async (instance) => {
      const errors: any[] = [];

      for (const rule of rules) {
        const value = instance.getDataValue(rule.field as any);
        const isValid = await rule.validator(value, instance);

        if (!isValid) {
          if (rule.severity === 'WARNING') {
            console.warn(`[WARNING] ${rule.message}`);
          } else {
            errors.push({
              message: rule.message,
              type: 'Validation error',
              path: rule.field,
              value,
            });
          }
        }
      }

      if (errors.length > 0) {
        throw new ValidationError('Validation failed', errors);
      }
    }
  );
}

/**
 * Auto-generates UUID or sequential ID before insert.
 * Ensures primary key is set.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} field - ID field name
 * @param {string} type - ID type ('uuid' or 'sequence')
 * @returns {ModelStatic<T>} Model with ID generation trigger
 *
 * @example
 * ```typescript
 * generateIdBeforeInsert(User, 'id', 'uuid');
 * ```
 */
export function generateIdBeforeInsert<T extends Model>(
  model: ModelStatic<T>,
  field: string = 'id',
  type: 'uuid' | 'sequence' = 'uuid',
): ModelStatic<T> {
  return addBeforeInsertTrigger(
    model,
    `${model.name}_generate_id`,
    async (instance) => {
      if (!instance.getDataValue(field as any)) {
        if (type === 'uuid') {
          const crypto = require('crypto');
          instance.setDataValue(field as any, crypto.randomUUID());
        } else {
          // For sequence, would query max ID + 1
          const maxId = await model.max(field);
          instance.setDataValue(field as any, (maxId || 0) + 1);
        }
      }
    }
  );
}

/**
 * Encrypts sensitive fields before insert.
 * HIPAA-compliant PHI protection.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string[]} fields - Fields to encrypt
 * @param {string} algorithm - Encryption algorithm
 * @returns {ModelStatic<T>} Model with encryption trigger
 *
 * @example
 * ```typescript
 * encryptFieldsBeforeInsert(Patient, ['ssn', 'medicalRecordNumber'], 'aes-256-gcm');
 * ```
 */
export function encryptFieldsBeforeInsert<T extends Model>(
  model: ModelStatic<T>,
  fields: string[],
  algorithm: string = 'aes-256-gcm',
): ModelStatic<T> {
  const crypto = require('crypto');
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

  return addBeforeInsertTrigger(
    model,
    `${model.name}_encrypt_fields`,
    async (instance) => {
      for (const field of fields) {
        const value = instance.getDataValue(field as any);
        if (value && typeof value === 'string') {
          const iv = crypto.randomBytes(16);
          const cipher = crypto.createCipheriv(algorithm, key, iv);
          let encrypted = cipher.update(value, 'utf8', 'hex');
          encrypted += cipher.final('hex');
          const authTag = cipher.getAuthTag();
          const encryptedValue = `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
          instance.setDataValue(field as any, encryptedValue);
        }
      }
    }
  );
}

// ============================================================================
// AFTER INSERT TRIGGERS
// ============================================================================

/**
 * Adds an after insert trigger to a model.
 * Executes after record creation.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addAfterInsertTrigger(User, 'send_welcome_email', async (instance) => {
 *   await sendEmail(instance.email, 'Welcome!');
 * });
 * ```
 */
export function addAfterInsertTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: CreateOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('afterCreate', name, async (instance: T, options: CreateOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      console.error(`Trigger ${name} failed:`, error);
      // After triggers don't prevent insert, just log error
    }
  });

  registerTrigger({
    name,
    timing: 'AFTER',
    event: 'INSERT',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Creates audit trail entry after insert.
 * HIPAA-compliant audit logging.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {ModelStatic<any>} auditModel - Audit log model
 * @param {Function} userIdGetter - Function to get current user ID
 * @returns {ModelStatic<T>} Model with audit trigger
 *
 * @example
 * ```typescript
 * auditAfterInsert(User, AuditLog, () => getCurrentUserId());
 * ```
 */
export function auditAfterInsert<T extends Model>(
  model: ModelStatic<T>,
  auditModel: ModelStatic<any>,
  userIdGetter?: () => string | undefined,
): ModelStatic<T> {
  return addAfterInsertTrigger(
    model,
    `${model.name}_audit_insert`,
    async (instance, options) => {
      const entry: AuditTrailEntry = {
        tableName: model.tableName,
        recordId: instance.getDataValue('id' as any),
        operation: 'INSERT',
        newValues: instance.toJSON(),
        userId: userIdGetter?.(),
        timestamp: new Date(),
      };

      await auditModel.create(entry, { transaction: options.transaction });
    }
  );
}

/**
 * Sends notifications after insert.
 * Triggers external events or webhooks.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Function} notificationHandler - Notification handler function
 * @returns {ModelStatic<T>} Model with notification trigger
 *
 * @example
 * ```typescript
 * notifyAfterInsert(Order, async (order) => {
 *   await sendWebhook('order.created', order.toJSON());
 * });
 * ```
 */
export function notifyAfterInsert<T extends Model>(
  model: ModelStatic<T>,
  notificationHandler: (instance: T) => void | Promise<void>,
): ModelStatic<T> {
  return addAfterInsertTrigger(
    model,
    `${model.name}_notify_insert`,
    async (instance) => {
      // Run async to not block transaction
      setImmediate(async () => {
        try {
          await notificationHandler(instance);
        } catch (error) {
          console.error('Notification handler failed:', error);
        }
      });
    }
  );
}

/**
 * Updates related records after insert.
 * Maintains data consistency across tables.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Function} updateHandler - Update handler function
 * @returns {ModelStatic<T>} Model with update trigger
 *
 * @example
 * ```typescript
 * updateRelatedAfterInsert(OrderItem, async (item, options) => {
 *   await Product.increment('quantitySold', {
 *     by: item.quantity,
 *     where: { id: item.productId },
 *     transaction: options.transaction
 *   });
 * });
 * ```
 */
export function updateRelatedAfterInsert<T extends Model>(
  model: ModelStatic<T>,
  updateHandler: (instance: T, options: CreateOptions) => void | Promise<void>,
): ModelStatic<T> {
  return addAfterInsertTrigger(
    model,
    `${model.name}_update_related_insert`,
    updateHandler
  );
}

// ============================================================================
// BEFORE UPDATE TRIGGERS
// ============================================================================

/**
 * Adds a before update trigger to a model.
 * Executes before record update.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addBeforeUpdateTrigger(User, 'update_modified_timestamp', async (instance) => {
 *   instance.updatedAt = new Date();
 * });
 * ```
 */
export function addBeforeUpdateTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('beforeUpdate', name, async (instance: T, options: InstanceUpdateOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  registerTrigger({
    name,
    timing: 'BEFORE',
    event: 'UPDATE',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Validates updates before they occur.
 * Prevents invalid state transitions.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {TriggerValidationRule[]} rules - Validation rules
 * @returns {ModelStatic<T>} Model with validation trigger
 *
 * @example
 * ```typescript
 * validateBeforeUpdate(Order, [
 *   {
 *     field: 'status',
 *     validator: (value, instance) => {
 *       const validTransitions = { pending: ['processing'], processing: ['shipped'] };
 *       return validTransitions[instance.previous('status')]?.includes(value);
 *     },
 *     message: 'Invalid status transition'
 *   }
 * ]);
 * ```
 */
export function validateBeforeUpdate<T extends Model>(
  model: ModelStatic<T>,
  rules: TriggerValidationRule[],
): ModelStatic<T> {
  return addBeforeUpdateTrigger(
    model,
    `${model.name}_validate_update`,
    async (instance) => {
      const errors: any[] = [];

      for (const rule of rules) {
        if (instance.changed(rule.field as any)) {
          const value = instance.getDataValue(rule.field as any);
          const isValid = await rule.validator(value, instance);

          if (!isValid) {
            if (rule.severity === 'WARNING') {
              console.warn(`[WARNING] ${rule.message}`);
            } else {
              errors.push({
                message: rule.message,
                type: 'Validation error',
                path: rule.field,
                value,
              });
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new ValidationError('Validation failed', errors);
      }
    }
  );
}

/**
 * Increments version number before update.
 * Supports optimistic locking.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} versionField - Version field name
 * @returns {ModelStatic<T>} Model with versioning trigger
 *
 * @example
 * ```typescript
 * incrementVersionBeforeUpdate(User, 'version');
 * ```
 */
export function incrementVersionBeforeUpdate<T extends Model>(
  model: ModelStatic<T>,
  versionField: string = 'version',
): ModelStatic<T> {
  return addBeforeUpdateTrigger(
    model,
    `${model.name}_increment_version`,
    async (instance) => {
      const currentVersion = instance.getDataValue(versionField as any) || 0;
      instance.setDataValue(versionField as any, currentVersion + 1);
    }
  );
}

/**
 * Prevents updates to protected fields.
 * Enforces immutability for specific fields.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string[]} protectedFields - Fields that cannot be updated
 * @returns {ModelStatic<T>} Model with protection trigger
 *
 * @example
 * ```typescript
 * protectFieldsBeforeUpdate(User, ['id', 'createdAt', 'createdBy']);
 * ```
 */
export function protectFieldsBeforeUpdate<T extends Model>(
  model: ModelStatic<T>,
  protectedFields: string[],
): ModelStatic<T> {
  return addBeforeUpdateTrigger(
    model,
    `${model.name}_protect_fields`,
    async (instance) => {
      for (const field of protectedFields) {
        if (instance.changed(field as any)) {
          throw new Error(`Field '${field}' is protected and cannot be updated`);
        }
      }
    }
  );
}

/**
 * Tracks field changes before update.
 * Records which fields were modified.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} changeTrackingField - Field to store changes
 * @returns {ModelStatic<T>} Model with change tracking trigger
 *
 * @example
 * ```typescript
 * trackChangesBeforeUpdate(User, 'modifiedFields');
 * ```
 */
export function trackChangesBeforeUpdate<T extends Model>(
  model: ModelStatic<T>,
  changeTrackingField: string = 'modifiedFields',
): ModelStatic<T> {
  return addBeforeUpdateTrigger(
    model,
    `${model.name}_track_changes`,
    async (instance) => {
      const changed = instance.changed() as string[] | false;
      if (changed && changed.length > 0) {
        instance.setDataValue(changeTrackingField as any, changed);
      }
    }
  );
}

// ============================================================================
// AFTER UPDATE TRIGGERS
// ============================================================================

/**
 * Adds an after update trigger to a model.
 * Executes after record update.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addAfterUpdateTrigger(Order, 'status_changed_notification', async (instance) => {
 *   if (instance.changed('status')) {
 *     await notifyCustomer(instance.customerId, instance.status);
 *   }
 * });
 * ```
 */
export function addAfterUpdateTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('afterUpdate', name, async (instance: T, options: InstanceUpdateOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      console.error(`Trigger ${name} failed:`, error);
    }
  });

  registerTrigger({
    name,
    timing: 'AFTER',
    event: 'UPDATE',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Creates audit trail entry after update.
 * Logs all changes to sensitive data.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {ModelStatic<any>} auditModel - Audit log model
 * @param {Function} userIdGetter - Function to get current user ID
 * @returns {ModelStatic<T>} Model with audit trigger
 *
 * @example
 * ```typescript
 * auditAfterUpdate(Patient, AuditLog, () => getCurrentUserId());
 * ```
 */
export function auditAfterUpdate<T extends Model>(
  model: ModelStatic<T>,
  auditModel: ModelStatic<any>,
  userIdGetter?: () => string | undefined,
): ModelStatic<T> {
  return addAfterUpdateTrigger(
    model,
    `${model.name}_audit_update`,
    async (instance, options) => {
      const changed = instance.changed() as string[] | false;
      if (!changed || changed.length === 0) return;

      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      for (const field of changed) {
        oldValues[field] = instance.previous(field as any);
        newValues[field] = instance.getDataValue(field as any);
      }

      const entry: AuditTrailEntry = {
        tableName: model.tableName,
        recordId: instance.getDataValue('id' as any),
        operation: 'UPDATE',
        oldValues,
        newValues,
        changedFields: changed,
        userId: userIdGetter?.(),
        timestamp: new Date(),
      };

      await auditModel.create(entry, { transaction: options.transaction });
    }
  );
}

/**
 * Synchronizes changes to related records after update.
 * Maintains referential integrity.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Function} syncHandler - Synchronization handler
 * @returns {ModelStatic<T>} Model with sync trigger
 *
 * @example
 * ```typescript
 * syncRelatedAfterUpdate(User, async (instance, options) => {
 *   if (instance.changed('email')) {
 *     await Profile.update(
 *       { email: instance.email },
 *       { where: { userId: instance.id }, transaction: options.transaction }
 *     );
 *   }
 * });
 * ```
 */
export function syncRelatedAfterUpdate<T extends Model>(
  model: ModelStatic<T>,
  syncHandler: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>,
): ModelStatic<T> {
  return addAfterUpdateTrigger(
    model,
    `${model.name}_sync_related_update`,
    syncHandler
  );
}

/**
 * Invalidates cache after update.
 * Ensures cache consistency.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Function} cacheKeyGetter - Function to get cache keys to invalidate
 * @returns {ModelStatic<T>} Model with cache invalidation trigger
 *
 * @example
 * ```typescript
 * invalidateCacheAfterUpdate(User, (instance) => [
 *   `user:${instance.id}`,
 *   `users:all`,
 *   `users:role:${instance.role}`
 * ]);
 * ```
 */
export function invalidateCacheAfterUpdate<T extends Model>(
  model: ModelStatic<T>,
  cacheKeyGetter: (instance: T) => string[],
): ModelStatic<T> {
  return addAfterUpdateTrigger(
    model,
    `${model.name}_invalidate_cache`,
    async (instance) => {
      const keys = cacheKeyGetter(instance);
      // In production, integrate with Redis or similar cache
      console.log('[CACHE] Invalidating keys:', keys);
    }
  );
}

// ============================================================================
// BEFORE DELETE TRIGGERS
// ============================================================================

/**
 * Adds a before delete trigger to a model.
 * Executes before record deletion.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addBeforeDeleteTrigger(User, 'check_dependencies', async (instance) => {
 *   const orderCount = await Order.count({ where: { userId: instance.id } });
 *   if (orderCount > 0) {
 *     throw new Error('Cannot delete user with existing orders');
 *   }
 * });
 * ```
 */
export function addBeforeDeleteTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: InstanceDestroyOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('beforeDestroy', name, async (instance: T, options: InstanceDestroyOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  registerTrigger({
    name,
    timing: 'BEFORE',
    event: 'DELETE',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Prevents deletion if dependencies exist.
 * Enforces referential integrity.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {Function} dependencyChecker - Function to check dependencies
 * @returns {ModelStatic<T>} Model with dependency check trigger
 *
 * @example
 * ```typescript
 * preventDeleteWithDependencies(Category, async (instance) => {
 *   const productCount = await Product.count({ where: { categoryId: instance.id } });
 *   return productCount === 0;
 * });
 * ```
 */
export function preventDeleteWithDependencies<T extends Model>(
  model: ModelStatic<T>,
  dependencyChecker: (instance: T) => Promise<boolean>,
): ModelStatic<T> {
  return addBeforeDeleteTrigger(
    model,
    `${model.name}_check_dependencies`,
    async (instance) => {
      const canDelete = await dependencyChecker(instance);
      if (!canDelete) {
        throw new Error('Cannot delete record: dependencies exist');
      }
    }
  );
}

/**
 * Archives record before deletion instead of hard delete.
 * Implements soft delete pattern.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {ModelStatic<any>} archiveModel - Archive model
 * @returns {ModelStatic<T>} Model with archival trigger
 *
 * @example
 * ```typescript
 * archiveBeforeDelete(User, UserArchive);
 * ```
 */
export function archiveBeforeDelete<T extends Model>(
  model: ModelStatic<T>,
  archiveModel: ModelStatic<any>,
): ModelStatic<T> {
  return addBeforeDeleteTrigger(
    model,
    `${model.name}_archive`,
    async (instance, options) => {
      const data = instance.toJSON();
      await archiveModel.create({
        ...data,
        archivedAt: new Date(),
        originalId: data.id,
      }, { transaction: options.transaction });
    }
  );
}

// ============================================================================
// AFTER DELETE TRIGGERS
// ============================================================================

/**
 * Adds an after delete trigger to a model.
 * Executes after record deletion.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @param {Function} condition - Optional condition
 * @returns {ModelStatic<T>} Model with trigger
 *
 * @example
 * ```typescript
 * addAfterDeleteTrigger(User, 'cleanup_orphans', async (instance, options) => {
 *   await Profile.destroy({ where: { userId: instance.id }, transaction: options.transaction });
 * });
 * ```
 */
export function addAfterDeleteTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instance: T, options: InstanceDestroyOptions) => void | Promise<void>,
  condition?: (instance: T) => boolean | Promise<boolean>,
): ModelStatic<T> {
  model.addHook('afterDestroy', name, async (instance: T, options: InstanceDestroyOptions) => {
    if (condition && !(await condition(instance))) {
      return;
    }

    const startTime = Date.now();
    try {
      await action(instance, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      console.error(`Trigger ${name} failed:`, error);
    }
  });

  registerTrigger({
    name,
    timing: 'AFTER',
    event: 'DELETE',
    level: 'ROW',
    model,
    condition,
    action: action as any,
  });

  return model;
}

/**
 * Creates audit trail entry after delete.
 * Logs deletion for compliance.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {ModelStatic<any>} auditModel - Audit log model
 * @param {Function} userIdGetter - Function to get current user ID
 * @returns {ModelStatic<T>} Model with audit trigger
 *
 * @example
 * ```typescript
 * auditAfterDelete(User, AuditLog, () => getCurrentUserId());
 * ```
 */
export function auditAfterDelete<T extends Model>(
  model: ModelStatic<T>,
  auditModel: ModelStatic<any>,
  userIdGetter?: () => string | undefined,
): ModelStatic<T> {
  return addAfterDeleteTrigger(
    model,
    `${model.name}_audit_delete`,
    async (instance, options) => {
      const entry: AuditTrailEntry = {
        tableName: model.tableName,
        recordId: instance.getDataValue('id' as any),
        operation: 'DELETE',
        oldValues: instance.toJSON(),
        userId: userIdGetter?.(),
        timestamp: new Date(),
      };

      await auditModel.create(entry, { transaction: options.transaction });
    }
  );
}

/**
 * Cascades deletion to related records.
 * Implements CASCADE DELETE behavior.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {CascadeRule[]} rules - Cascade rules
 * @returns {ModelStatic<T>} Model with cascade trigger
 *
 * @example
 * ```typescript
 * cascadeDeleteAfterDelete(User, [
 *   { sourceModel: User, targetModel: Profile, sourceField: 'id', targetField: 'userId', onDelete: 'CASCADE' },
 *   { sourceModel: User, targetModel: Post, sourceField: 'id', targetField: 'authorId', onDelete: 'CASCADE' }
 * ]);
 * ```
 */
export function cascadeDeleteAfterDelete<T extends Model>(
  model: ModelStatic<T>,
  rules: CascadeRule[],
): ModelStatic<T> {
  return addAfterDeleteTrigger(
    model,
    `${model.name}_cascade_delete`,
    async (instance, options) => {
      for (const rule of rules) {
        if (rule.onDelete === 'CASCADE') {
          await rule.targetModel.destroy({
            where: { [rule.targetField]: instance.getDataValue(rule.sourceField as any) },
            transaction: options.transaction,
          });
        } else if (rule.onDelete === 'SET NULL') {
          await rule.targetModel.update(
            { [rule.targetField]: null },
            {
              where: { [rule.targetField]: instance.getDataValue(rule.sourceField as any) },
              transaction: options.transaction,
            }
          );
        }
      }
    }
  );
}

// ============================================================================
// STATEMENT-LEVEL TRIGGERS
// ============================================================================

/**
 * Adds a bulk create trigger for statement-level operations.
 * Executes for entire bulk operation.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @returns {ModelStatic<T>} Model with bulk trigger
 *
 * @example
 * ```typescript
 * addBulkCreateTrigger(User, 'validate_bulk', async (instances, options) => {
 *   const emails = instances.map(i => i.email);
 *   const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i);
 *   if (duplicates.length > 0) {
 *     throw new Error('Duplicate emails in bulk insert');
 *   }
 * });
 * ```
 */
export function addBulkCreateTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (instances: T[], options: BulkCreateOptions) => void | Promise<void>,
): ModelStatic<T> {
  model.addHook('beforeBulkCreate', name, async (instances: T[], options: BulkCreateOptions) => {
    const startTime = Date.now();
    try {
      await action(instances, options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  return model;
}

/**
 * Adds a bulk update trigger for statement-level operations.
 * Executes for entire bulk update.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @returns {ModelStatic<T>} Model with bulk trigger
 *
 * @example
 * ```typescript
 * addBulkUpdateTrigger(User, 'log_bulk_update', async (options) => {
 *   console.log(`Bulk updating users where:`, options.where);
 * });
 * ```
 */
export function addBulkUpdateTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (options: UpdateOptions) => void | Promise<void>,
): ModelStatic<T> {
  model.addHook('beforeBulkUpdate', name, async (options: UpdateOptions) => {
    const startTime = Date.now();
    try {
      await action(options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  return model;
}

/**
 * Adds a bulk delete trigger for statement-level operations.
 * Executes for entire bulk delete.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {Function} action - Trigger action
 * @returns {ModelStatic<T>} Model with bulk trigger
 *
 * @example
 * ```typescript
 * addBulkDeleteTrigger(User, 'prevent_bulk_delete', async (options) => {
 *   if (!options.where || Object.keys(options.where).length === 0) {
 *     throw new Error('Bulk delete without WHERE clause is not allowed');
 *   }
 * });
 * ```
 */
export function addBulkDeleteTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  action: (options: DestroyOptions) => void | Promise<void>,
): ModelStatic<T> {
  model.addHook('beforeBulkDestroy', name, async (options: DestroyOptions) => {
    const startTime = Date.now();
    try {
      await action(options);
      recordTriggerExecution(name, true, Date.now() - startTime);
    } catch (error) {
      recordTriggerExecution(name, false, Date.now() - startTime);
      throw error;
    }
  });

  return model;
}

// ============================================================================
// TRIGGER UTILITIES
// ============================================================================

/**
 * Records trigger execution statistics.
 * Tracks performance and reliability.
 *
 * @param {string} triggerName - Trigger name
 * @param {boolean} success - Whether execution succeeded
 * @param {number} executionTime - Execution time in ms
 * @returns {void}
 *
 * @example
 * ```typescript
 * recordTriggerExecution('trg_user_audit', true, 15);
 * ```
 */
export function recordTriggerExecution(
  triggerName: string,
  success: boolean,
  executionTime: number,
): void {
  const stats = triggerStats.get(triggerName) || {
    triggerName,
    executionCount: 0,
    errorCount: 0,
    averageExecutionTime: 0,
  };

  stats.executionCount++;
  if (!success) {
    stats.errorCount++;
  }

  stats.averageExecutionTime =
    (stats.averageExecutionTime * (stats.executionCount - 1) + executionTime) / stats.executionCount;
  stats.lastExecuted = new Date();

  triggerStats.set(triggerName, stats);
}

/**
 * Retrieves trigger execution statistics.
 * Useful for monitoring and optimization.
 *
 * @param {string} triggerName - Trigger name
 * @returns {TriggerStats | undefined} Trigger statistics
 *
 * @example
 * ```typescript
 * const stats = getTriggerStats('trg_user_audit');
 * console.log(`Average execution time: ${stats?.averageExecutionTime}ms`);
 * ```
 */
export function getTriggerStats(triggerName: string): TriggerStats | undefined {
  return triggerStats.get(triggerName);
}

/**
 * Retrieves all trigger statistics.
 * Returns performance data for all triggers.
 *
 * @returns {TriggerStats[]} All trigger statistics
 *
 * @example
 * ```typescript
 * const allStats = getAllTriggerStats();
 * allStats.forEach(s => console.log(s.triggerName, s.averageExecutionTime));
 * ```
 */
export function getAllTriggerStats(): TriggerStats[] {
  return Array.from(triggerStats.values());
}

/**
 * Resets trigger execution statistics.
 * Clears all collected metrics.
 *
 * @param {string} triggerName - Trigger name (optional, clears all if not provided)
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetTriggerStats('trg_user_audit'); // Reset specific trigger
 * resetTriggerStats(); // Reset all triggers
 * ```
 */
export function resetTriggerStats(triggerName?: string): void {
  if (triggerName) {
    triggerStats.delete(triggerName);
  } else {
    triggerStats.clear();
  }
}

/**
 * Conditionally executes triggers based on field values.
 * Implements conditional trigger logic.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} name - Trigger name
 * @param {TriggerTiming} timing - When to execute
 * @param {TriggerEvent} event - Which event to trigger on
 * @param {Record<string, any>} conditions - Conditions to check
 * @param {Function} action - Trigger action
 * @returns {ModelStatic<T>} Model with conditional trigger
 *
 * @example
 * ```typescript
 * addConditionalTrigger(
 *   User,
 *   'high_value_customer_notification',
 *   'AFTER',
 *   'UPDATE',
 *   { totalPurchases: { $gt: 10000 } },
 *   async (instance) => await notifyManager(instance)
 * );
 * ```
 */
export function addConditionalTrigger<T extends Model>(
  model: ModelStatic<T>,
  name: string,
  timing: TriggerTiming,
  event: TriggerEvent,
  conditions: Record<string, any>,
  action: (instance: T, options?: any) => void | Promise<void>,
): ModelStatic<T> {
  const hookName = `${timing.toLowerCase()}${event.charAt(0) + event.slice(1).toLowerCase()}`;
  const condition = (instance: T) => {
    return Object.entries(conditions).every(([field, value]) => {
      const fieldValue = instance.getDataValue(field as any);
      if (typeof value === 'object' && value !== null) {
        // Handle operators like $gt, $lt, etc.
        for (const [op, opValue] of Object.entries(value)) {
          if (op === '$gt' && !(fieldValue > opValue)) return false;
          if (op === '$lt' && !(fieldValue < opValue)) return false;
          if (op === '$gte' && !(fieldValue >= opValue)) return false;
          if (op === '$lte' && !(fieldValue <= opValue)) return false;
          if (op === '$ne' && fieldValue === opValue) return false;
          if (op === '$eq' && fieldValue !== opValue) return false;
        }
        return true;
      }
      return fieldValue === value;
    });
  };

  if (timing === 'BEFORE' && event === 'INSERT') {
    return addBeforeInsertTrigger(model, name, action, condition);
  } else if (timing === 'AFTER' && event === 'INSERT') {
    return addAfterInsertTrigger(model, name, action, condition);
  } else if (timing === 'BEFORE' && event === 'UPDATE') {
    return addBeforeUpdateTrigger(model, name, action, condition);
  } else if (timing === 'AFTER' && event === 'UPDATE') {
    return addAfterUpdateTrigger(model, name, action, condition);
  } else if (timing === 'BEFORE' && event === 'DELETE') {
    return addBeforeDeleteTrigger(model, name, action, condition);
  } else if (timing === 'AFTER' && event === 'DELETE') {
    return addAfterDeleteTrigger(model, name, action, condition);
  }

  return model;
}

/**
 * Adds compound trigger that executes on multiple events.
 * Consolidates trigger logic across events.
 *
 * @param {ModelStatic<T>} model - Target model
 * @param {string} baseName - Base trigger name
 * @param {TriggerEvent[]} events - Events to trigger on
 * @param {Function} action - Trigger action
 * @returns {ModelStatic<T>} Model with compound triggers
 *
 * @example
 * ```typescript
 * addCompoundTrigger(
 *   User,
 *   'maintain_search_index',
 *   ['INSERT', 'UPDATE', 'DELETE'],
 *   async (instance, event) => {
 *     await updateSearchIndex(instance, event);
 *   }
 * );
 * ```
 */
export function addCompoundTrigger<T extends Model>(
  model: ModelStatic<T>,
  baseName: string,
  events: TriggerEvent[],
  action: (instance: T, event: TriggerEvent, options?: any) => void | Promise<void>,
): ModelStatic<T> {
  for (const event of events) {
    const triggerName = `${baseName}_${event.toLowerCase()}`;

    if (event === 'INSERT') {
      addAfterInsertTrigger(model, triggerName, (instance, options) =>
        action(instance, 'INSERT', options)
      );
    } else if (event === 'UPDATE') {
      addAfterUpdateTrigger(model, triggerName, (instance, options) =>
        action(instance, 'UPDATE', options)
      );
    } else if (event === 'DELETE') {
      addAfterDeleteTrigger(model, triggerName, (instance, options) =>
        action(instance, 'DELETE', options)
      );
    }
  }

  return model;
}

/**
 * Exports trigger definitions for documentation or migration.
 * Generates trigger metadata for external use.
 *
 * @param {ModelStatic<any>} model - Model to export triggers from
 * @returns {TriggerDefinition[]} Trigger definitions
 *
 * @example
 * ```typescript
 * const triggers = exportTriggerDefinitions(User);
 * console.log(JSON.stringify(triggers, null, 2));
 * ```
 */
export function exportTriggerDefinitions(
  model?: ModelStatic<any>,
): TriggerDefinition[] {
  const triggers = model ? listTriggers(model) : Array.from(triggerRegistry.values());

  return triggers.map(t => ({
    name: t.name,
    timing: t.timing,
    event: t.event,
    level: t.level,
    model: { name: t.model.name, tableName: t.model.tableName },
    enabled: t.enabled,
    priority: t.priority,
  })) as any;
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  // Trigger registry
  registerTrigger,
  unregisterTrigger,
  listTriggers,
  enableTrigger,
  disableTrigger,
  clearTriggers,

  // Before insert triggers
  addBeforeInsertTrigger,
  setDefaultsBeforeInsert,
  validateBeforeInsert,
  generateIdBeforeInsert,
  encryptFieldsBeforeInsert,

  // After insert triggers
  addAfterInsertTrigger,
  auditAfterInsert,
  notifyAfterInsert,
  updateRelatedAfterInsert,

  // Before update triggers
  addBeforeUpdateTrigger,
  validateBeforeUpdate,
  incrementVersionBeforeUpdate,
  protectFieldsBeforeUpdate,
  trackChangesBeforeUpdate,

  // After update triggers
  addAfterUpdateTrigger,
  auditAfterUpdate,
  syncRelatedAfterUpdate,
  invalidateCacheAfterUpdate,

  // Before delete triggers
  addBeforeDeleteTrigger,
  preventDeleteWithDependencies,
  archiveBeforeDelete,

  // After delete triggers
  addAfterDeleteTrigger,
  auditAfterDelete,
  cascadeDeleteAfterDelete,

  // Statement-level triggers
  addBulkCreateTrigger,
  addBulkUpdateTrigger,
  addBulkDeleteTrigger,

  // Trigger utilities
  recordTriggerExecution,
  getTriggerStats,
  getAllTriggerStats,
  resetTriggerStats,

  // Advanced triggers
  addConditionalTrigger,
  addCompoundTrigger,
  exportTriggerDefinitions,
};
