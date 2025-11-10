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
import { Model, ModelStatic, Transaction, CreateOptions, UpdateOptions, DestroyOptions, BulkCreateOptions, InstanceUpdateOptions, InstanceDestroyOptions } from 'sequelize';
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
export declare function registerTrigger(trigger: TriggerDefinition): TriggerDefinition;
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
export declare function unregisterTrigger(name: string): boolean;
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
export declare function listTriggers(model?: ModelStatic<any>, event?: TriggerEvent): TriggerDefinition[];
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
export declare function enableTrigger(name: string): boolean;
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
export declare function disableTrigger(name: string): boolean;
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
export declare function clearTriggers(): void;
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
export declare function addBeforeInsertTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: CreateOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function setDefaultsBeforeInsert<T extends Model>(model: ModelStatic<T>, defaults: Record<string, any>): ModelStatic<T>;
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
export declare function validateBeforeInsert<T extends Model>(model: ModelStatic<T>, rules: TriggerValidationRule[]): ModelStatic<T>;
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
export declare function generateIdBeforeInsert<T extends Model>(model: ModelStatic<T>, field?: string, type?: 'uuid' | 'sequence'): ModelStatic<T>;
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
export declare function encryptFieldsBeforeInsert<T extends Model>(model: ModelStatic<T>, fields: string[], algorithm?: string): ModelStatic<T>;
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
export declare function addAfterInsertTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: CreateOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function auditAfterInsert<T extends Model>(model: ModelStatic<T>, auditModel: ModelStatic<any>, userIdGetter?: () => string | undefined): ModelStatic<T>;
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
export declare function notifyAfterInsert<T extends Model>(model: ModelStatic<T>, notificationHandler: (instance: T) => void | Promise<void>): ModelStatic<T>;
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
export declare function updateRelatedAfterInsert<T extends Model>(model: ModelStatic<T>, updateHandler: (instance: T, options: CreateOptions) => void | Promise<void>): ModelStatic<T>;
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
export declare function addBeforeUpdateTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function validateBeforeUpdate<T extends Model>(model: ModelStatic<T>, rules: TriggerValidationRule[]): ModelStatic<T>;
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
export declare function incrementVersionBeforeUpdate<T extends Model>(model: ModelStatic<T>, versionField?: string): ModelStatic<T>;
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
export declare function protectFieldsBeforeUpdate<T extends Model>(model: ModelStatic<T>, protectedFields: string[]): ModelStatic<T>;
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
export declare function trackChangesBeforeUpdate<T extends Model>(model: ModelStatic<T>, changeTrackingField?: string): ModelStatic<T>;
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
export declare function addAfterUpdateTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function auditAfterUpdate<T extends Model>(model: ModelStatic<T>, auditModel: ModelStatic<any>, userIdGetter?: () => string | undefined): ModelStatic<T>;
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
export declare function syncRelatedAfterUpdate<T extends Model>(model: ModelStatic<T>, syncHandler: (instance: T, options: InstanceUpdateOptions) => void | Promise<void>): ModelStatic<T>;
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
export declare function invalidateCacheAfterUpdate<T extends Model>(model: ModelStatic<T>, cacheKeyGetter: (instance: T) => string[]): ModelStatic<T>;
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
export declare function addBeforeDeleteTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: InstanceDestroyOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function preventDeleteWithDependencies<T extends Model>(model: ModelStatic<T>, dependencyChecker: (instance: T) => Promise<boolean>): ModelStatic<T>;
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
export declare function archiveBeforeDelete<T extends Model>(model: ModelStatic<T>, archiveModel: ModelStatic<any>): ModelStatic<T>;
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
export declare function addAfterDeleteTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instance: T, options: InstanceDestroyOptions) => void | Promise<void>, condition?: (instance: T) => boolean | Promise<boolean>): ModelStatic<T>;
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
export declare function auditAfterDelete<T extends Model>(model: ModelStatic<T>, auditModel: ModelStatic<any>, userIdGetter?: () => string | undefined): ModelStatic<T>;
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
export declare function cascadeDeleteAfterDelete<T extends Model>(model: ModelStatic<T>, rules: CascadeRule[]): ModelStatic<T>;
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
export declare function addBulkCreateTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (instances: T[], options: BulkCreateOptions) => void | Promise<void>): ModelStatic<T>;
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
export declare function addBulkUpdateTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (options: UpdateOptions) => void | Promise<void>): ModelStatic<T>;
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
export declare function addBulkDeleteTrigger<T extends Model>(model: ModelStatic<T>, name: string, action: (options: DestroyOptions) => void | Promise<void>): ModelStatic<T>;
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
export declare function recordTriggerExecution(triggerName: string, success: boolean, executionTime: number): void;
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
export declare function getTriggerStats(triggerName: string): TriggerStats | undefined;
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
export declare function getAllTriggerStats(): TriggerStats[];
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
export declare function resetTriggerStats(triggerName?: string): void;
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
export declare function addConditionalTrigger<T extends Model>(model: ModelStatic<T>, name: string, timing: TriggerTiming, event: TriggerEvent, conditions: Record<string, any>, action: (instance: T, options?: any) => void | Promise<void>): ModelStatic<T>;
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
export declare function addCompoundTrigger<T extends Model>(model: ModelStatic<T>, baseName: string, events: TriggerEvent[], action: (instance: T, event: TriggerEvent, options?: any) => void | Promise<void>): ModelStatic<T>;
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
export declare function exportTriggerDefinitions(model?: ModelStatic<any>): TriggerDefinition[];
declare const _default: {
    registerTrigger: typeof registerTrigger;
    unregisterTrigger: typeof unregisterTrigger;
    listTriggers: typeof listTriggers;
    enableTrigger: typeof enableTrigger;
    disableTrigger: typeof disableTrigger;
    clearTriggers: typeof clearTriggers;
    addBeforeInsertTrigger: typeof addBeforeInsertTrigger;
    setDefaultsBeforeInsert: typeof setDefaultsBeforeInsert;
    validateBeforeInsert: typeof validateBeforeInsert;
    generateIdBeforeInsert: typeof generateIdBeforeInsert;
    encryptFieldsBeforeInsert: typeof encryptFieldsBeforeInsert;
    addAfterInsertTrigger: typeof addAfterInsertTrigger;
    auditAfterInsert: typeof auditAfterInsert;
    notifyAfterInsert: typeof notifyAfterInsert;
    updateRelatedAfterInsert: typeof updateRelatedAfterInsert;
    addBeforeUpdateTrigger: typeof addBeforeUpdateTrigger;
    validateBeforeUpdate: typeof validateBeforeUpdate;
    incrementVersionBeforeUpdate: typeof incrementVersionBeforeUpdate;
    protectFieldsBeforeUpdate: typeof protectFieldsBeforeUpdate;
    trackChangesBeforeUpdate: typeof trackChangesBeforeUpdate;
    addAfterUpdateTrigger: typeof addAfterUpdateTrigger;
    auditAfterUpdate: typeof auditAfterUpdate;
    syncRelatedAfterUpdate: typeof syncRelatedAfterUpdate;
    invalidateCacheAfterUpdate: typeof invalidateCacheAfterUpdate;
    addBeforeDeleteTrigger: typeof addBeforeDeleteTrigger;
    preventDeleteWithDependencies: typeof preventDeleteWithDependencies;
    archiveBeforeDelete: typeof archiveBeforeDelete;
    addAfterDeleteTrigger: typeof addAfterDeleteTrigger;
    auditAfterDelete: typeof auditAfterDelete;
    cascadeDeleteAfterDelete: typeof cascadeDeleteAfterDelete;
    addBulkCreateTrigger: typeof addBulkCreateTrigger;
    addBulkUpdateTrigger: typeof addBulkUpdateTrigger;
    addBulkDeleteTrigger: typeof addBulkDeleteTrigger;
    recordTriggerExecution: typeof recordTriggerExecution;
    getTriggerStats: typeof getTriggerStats;
    getAllTriggerStats: typeof getAllTriggerStats;
    resetTriggerStats: typeof resetTriggerStats;
    addConditionalTrigger: typeof addConditionalTrigger;
    addCompoundTrigger: typeof addCompoundTrigger;
    exportTriggerDefinitions: typeof exportTriggerDefinitions;
};
export default _default;
//# sourceMappingURL=sequelize-oracle-triggers-kit.d.ts.map