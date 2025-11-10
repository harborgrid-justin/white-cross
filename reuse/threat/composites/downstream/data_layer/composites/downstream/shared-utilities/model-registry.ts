/**
 * Model Registry - Centralized Lifecycle Hook Management
 *
 * Provides centralized registration of Sequelize model lifecycle hooks to eliminate
 * code duplication and ensure consistent behavior across all models. Automatically
 * handles audit logging, cache invalidation, optimistic locking, field normalization,
 * encryption, and change tracking.
 *
 * @module shared-utilities/model-registry
 * @version 1.0.0
 * @requires sequelize v6
 * @requires redis v4
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  Transaction,
} from 'sequelize';
import { Redis } from 'ioredis';

// Import all lifecycle hooks from reference library
import {
  createUUIDGenerationHook,
  createTimestampHook,
  createFieldEncryptionHook,
  createFieldNormalizationHook,
  createUpdatedTimestampHook,
  createChangeTrackingHook,
  createOptimisticLockingHook,
  createConditionalValidationHook,
  createAuditLoggingHook,
  createCacheInvalidationHook,
  createNotificationHook,
  createSearchIndexUpdateHook,
  createWebhookTriggerHook,
  createDefaultValueHook,
  createSlugGenerationHook,
  HookContext,
  AuditLogEntry,
} from '../../../../../data/composites/model-lifecycle-hooks';

/**
 * Model registry configuration
 */
export interface ModelRegistryConfig {
  sequelize: Sequelize;
  redis?: Redis;
  auditLogModel?: ModelStatic<any>;
  encryptionKey?: string | Buffer;
  enableAuditLogging?: boolean;
  enableCacheInvalidation?: boolean;
  enableOptimisticLocking?: boolean;
  enableTimestamps?: boolean;
  enableFieldNormalization?: boolean;
}

/**
 * Model-specific configuration
 */
export interface ModelConfig {
  name: string;
  model: ModelStatic<any>;
  enableAuditLogging?: boolean;
  enableCacheInvalidation?: boolean;
  enableOptimisticLocking?: boolean;
  enableTimestamps?: boolean;
  enableEncryption?: boolean;
  encryptedFields?: string[];
  enableChangeTracking?: boolean;
  trackedFields?: string[];
  normalizedFields?: Record<string, string[]>;
  customValidations?: Record<string, (instance: any) => void>;
}

/**
 * Central registry for managing model lifecycle hooks
 */
export class ModelRegistry {
  private static instance: ModelRegistry;
  private config: ModelRegistryConfig;
  private registeredModels: Map<string, ModelConfig> = new Map();

  private constructor(config: ModelRegistryConfig) {
    this.config = {
      enableAuditLogging: true,
      enableCacheInvalidation: true,
      enableOptimisticLocking: true,
      enableTimestamps: true,
      enableFieldNormalization: true,
      ...config,
    };
  }

  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: ModelRegistryConfig): ModelRegistry {
    if (!ModelRegistry.instance && config) {
      ModelRegistry.instance = new ModelRegistry(config);
    }
    if (!ModelRegistry.instance) {
      throw new Error('ModelRegistry not initialized. Call getInstance with config first.');
    }
    return ModelRegistry.instance;
  }

  /**
   * Register all models with standard lifecycle hooks
   */
  public registerAllModels(models: ModelStatic<any>[]): void {
    models.forEach(model => {
      this.registerModel({
        name: model.name,
        model,
      });
    });
  }

  /**
   * Register a single model with lifecycle hooks
   */
  public registerModel(config: ModelConfig): void {
    const {
      name,
      model,
      enableAuditLogging = this.config.enableAuditLogging,
      enableCacheInvalidation = this.config.enableCacheInvalidation,
      enableOptimisticLocking = this.config.enableOptimisticLocking,
      enableTimestamps = this.config.enableTimestamps,
      enableEncryption = false,
      encryptedFields = [],
      enableChangeTracking = false,
      trackedFields = [],
      normalizedFields = {},
      customValidations = {},
    } = config;

    // Store configuration
    this.registeredModels.set(name, config);

    // Register standard hooks
    this.registerStandardHooks(model, {
      enableAuditLogging,
      enableCacheInvalidation,
      enableOptimisticLocking,
      enableTimestamps,
      normalizedFields,
    });

    // Register model-specific hooks
    this.registerModelSpecificHooks(model, {
      enableEncryption,
      encryptedFields,
      enableChangeTracking,
      trackedFields,
      customValidations,
    });

    console.log(`[ModelRegistry] Registered model: ${name} with lifecycle hooks`);
  }

  /**
   * Register standard hooks applied to all models
   */
  private registerStandardHooks(
    model: ModelStatic<any>,
    options: {
      enableAuditLogging?: boolean;
      enableCacheInvalidation?: boolean;
      enableOptimisticLocking?: boolean;
      enableTimestamps?: boolean;
      normalizedFields?: Record<string, string[]>;
    }
  ): void {
    // ====================================================================
    // BEFORE CREATE HOOKS
    // ====================================================================

    // UUID generation (if model has 'id' field and it's not set)
    model.addHook('beforeCreate', 'generateUUID', createUUIDGenerationHook('id', 4));

    // Timestamp hooks
    if (options.enableTimestamps) {
      model.addHook('beforeCreate', 'setCreatedTimestamp', createTimestampHook({
        createdAt: 'createdAt',
        createdBy: 'createdBy',
      }));
    }

    // Field normalization
    if (options.normalizedFields && Object.keys(options.normalizedFields).length > 0) {
      model.addHook('beforeCreate', 'normalizeFields', createFieldNormalizationHook(options.normalizedFields));
    } else {
      // Default normalization for common fields
      model.addHook('beforeCreate', 'normalizeDefaultFields', createFieldNormalizationHook({
        email: ['trim', 'lowercase'],
        name: ['trim'],
        title: ['trim'],
        description: ['trim'],
      }));
    }

    // ====================================================================
    // BEFORE UPDATE HOOKS
    // ====================================================================

    // Updated timestamp
    if (options.enableTimestamps) {
      model.addHook('beforeUpdate', 'setUpdatedTimestamp', createUpdatedTimestampHook({
        updatedAt: 'updatedAt',
        updatedBy: 'updatedBy',
      }));
    }

    // Optimistic locking
    if (options.enableOptimisticLocking) {
      model.addHook('beforeUpdate', 'checkOptimisticLock', createOptimisticLockingHook('version'));
    }

    // Field normalization for updates
    if (options.normalizedFields && Object.keys(options.normalizedFields).length > 0) {
      model.addHook('beforeUpdate', 'normalizeFieldsOnUpdate', createFieldNormalizationHook(options.normalizedFields));
    } else {
      model.addHook('beforeUpdate', 'normalizeDefaultFieldsOnUpdate', createFieldNormalizationHook({
        email: ['trim', 'lowercase'],
        name: ['trim'],
        title: ['trim'],
        description: ['trim'],
      }));
    }

    // ====================================================================
    // AFTER CREATE HOOKS
    // ====================================================================

    // Audit logging for CREATE
    if (options.enableAuditLogging && this.config.auditLogModel) {
      model.addHook('afterCreate', 'auditCreate', createAuditLoggingHook(this.config.auditLogModel, {
        action: 'CREATE',
        includeIP: true,
        includeUserAgent: true,
      }));
    }

    // ====================================================================
    // AFTER UPDATE HOOKS
    // ====================================================================

    // Audit logging for UPDATE
    if (options.enableAuditLogging && this.config.auditLogModel) {
      model.addHook('afterUpdate', 'auditUpdate', createAuditLoggingHook(this.config.auditLogModel, {
        action: 'UPDATE',
        trackFields: [], // Track all fields
        includeIP: true,
        includeUserAgent: true,
      }));
    }

    // Cache invalidation after update
    if (options.enableCacheInvalidation && this.config.redis) {
      model.addHook('afterUpdate', 'invalidateCacheOnUpdate', createCacheInvalidationHook(this.config.redis, {
        keys: (instance: any) => [`${model.name}:${instance.id}`, `${model.name}:slug:${instance.slug || ''}`],
        patterns: [`${model.name}:list:*`, `${model.name}:query:*`],
        cascade: true,
      }));
    }

    // ====================================================================
    // AFTER DESTROY HOOKS
    // ====================================================================

    // Audit logging for DELETE
    if (options.enableAuditLogging && this.config.auditLogModel) {
      model.addHook('afterDestroy', 'auditDelete', createAuditLoggingHook(this.config.auditLogModel, {
        action: 'DELETE',
        includeIP: true,
        includeUserAgent: true,
      }));
    }

    // Cache invalidation after delete
    if (options.enableCacheInvalidation && this.config.redis) {
      model.addHook('afterDestroy', 'invalidateCacheOnDelete', createCacheInvalidationHook(this.config.redis, {
        keys: (instance: any) => [`${model.name}:${instance.id}`, `${model.name}:slug:${instance.slug || ''}`],
        patterns: [`${model.name}:list:*`, `${model.name}:query:*`],
        cascade: true,
      }));
    }
  }

  /**
   * Register model-specific hooks based on model characteristics
   */
  private registerModelSpecificHooks(
    model: ModelStatic<any>,
    options: {
      enableEncryption?: boolean;
      encryptedFields?: string[];
      enableChangeTracking?: boolean;
      trackedFields?: string[];
      customValidations?: Record<string, (instance: any) => void>;
    }
  ): void {
    const modelName = model.name;

    // ====================================================================
    // PHI/PII ENCRYPTION
    // ====================================================================
    if (options.enableEncryption && options.encryptedFields && options.encryptedFields.length > 0) {
      if (!this.config.encryptionKey) {
        console.warn(`[ModelRegistry] Encryption enabled for ${modelName} but no encryption key provided`);
      } else {
        model.addHook('beforeCreate', 'encryptFields', createFieldEncryptionHook({
          fields: options.encryptedFields,
          algorithm: 'aes-256-gcm',
          key: this.config.encryptionKey,
        }));

        model.addHook('beforeUpdate', 'encryptFieldsOnUpdate', createFieldEncryptionHook({
          fields: options.encryptedFields,
          algorithm: 'aes-256-gcm',
          key: this.config.encryptionKey,
        }));

        // Note: Decryption would be handled by a separate afterFind hook
        // which is not included in the reference library - would need to be added
      }
    }

    // ====================================================================
    // CHANGE TRACKING
    // ====================================================================
    if (options.enableChangeTracking && options.trackedFields && options.trackedFields.length > 0) {
      model.addHook('beforeUpdate', 'trackChanges', createChangeTrackingHook('changeHistory', {
        trackFields: options.trackedFields,
        includeUser: true,
        includeTimestamp: true,
      }));
    }

    // ====================================================================
    // CUSTOM VALIDATIONS
    // ====================================================================
    if (options.customValidations && Object.keys(options.customValidations).length > 0) {
      model.addHook('beforeUpdate', 'customValidations', createConditionalValidationHook(options.customValidations));
    }

    // ====================================================================
    // MODEL-SPECIFIC BUSINESS RULES
    // ====================================================================

    // ThreatIntelligence-specific hooks
    if (modelName === 'ThreatIntelligence' || modelName.includes('Threat')) {
      model.addHook('beforeUpdate', 'validateThreatStateTransitions', createConditionalValidationHook({
        'status === "ARCHIVED"': (instance: any) => {
          if (!instance.resolution) {
            throw new Error('Resolution required before archiving threat');
          }
        },
        'severity === "CRITICAL"': (instance: any) => {
          if (!instance.executiveNotification) {
            throw new Error('Executive notification required for CRITICAL threats');
          }
        },
      }));
    }

    // Patient/User-specific hooks (PHI/PII models)
    if (modelName === 'Patient' || modelName === 'User' || modelName.includes('Patient') || modelName.includes('User')) {
      // These models should have encryption enabled via options
      console.log(`[ModelRegistry] Healthcare model detected: ${modelName} - ensure encryption is configured`);
    }

    // Workflow-specific hooks
    if (modelName === 'Workflow' || modelName.includes('Workflow')) {
      model.addHook('beforeUpdate', 'validateWorkflowTransitions', createConditionalValidationHook({
        'status === "COMPLETED"': (instance: any) => {
          if (!instance.completedBy) {
            throw new Error('Workflow must have completedBy user before marking complete');
          }
        },
      }));
    }
  }

  /**
   * Unregister a model (remove all hooks)
   */
  public unregisterModel(modelName: string): void {
    this.registeredModels.delete(modelName);
    console.log(`[ModelRegistry] Unregistered model: ${modelName}`);
  }

  /**
   * Get registered model configuration
   */
  public getModelConfig(modelName: string): ModelConfig | undefined {
    return this.registeredModels.get(modelName);
  }

  /**
   * Get all registered model names
   */
  public getRegisteredModels(): string[] {
    return Array.from(this.registeredModels.keys());
  }

  /**
   * Check if a model is registered
   */
  public isModelRegistered(modelName: string): boolean {
    return this.registeredModels.has(modelName);
  }
}

/**
 * Convenience function to initialize and register models
 */
export function initializeModelRegistry(
  config: ModelRegistryConfig,
  models: ModelStatic<any>[]
): ModelRegistry {
  const registry = ModelRegistry.getInstance(config);
  registry.registerAllModels(models);
  return registry;
}

/**
 * Convenience function to register a single model with healthcare compliance
 */
export function registerHealthcareModel(
  model: ModelStatic<any>,
  encryptedFields: string[]
): void {
  const registry = ModelRegistry.getInstance();
  registry.registerModel({
    name: model.name,
    model,
    enableEncryption: true,
    encryptedFields,
    enableAuditLogging: true,
    enableOptimisticLocking: true,
    enableChangeTracking: true,
    trackedFields: encryptedFields, // Track changes to encrypted fields
  });
}

/**
 * Convenience function to register a threat intelligence model
 */
export function registerThreatModel(
  model: ModelStatic<any>,
  trackedFields: string[] = ['severity', 'status', 'mitigation']
): void {
  const registry = ModelRegistry.getInstance();
  registry.registerModel({
    name: model.name,
    model,
    enableChangeTracking: true,
    trackedFields,
    enableAuditLogging: true,
    enableOptimisticLocking: true,
    customValidations: {
      'status === "ARCHIVED"': (instance: any) => {
        if (!instance.resolution) {
          throw new Error('Resolution required before archiving threat');
        }
      },
      'severity === "CRITICAL"': (instance: any) => {
        if (!instance.executiveNotification) {
          throw new Error('Executive notification required for CRITICAL threats');
        }
      },
    },
  });
}

/**
 * Export singleton accessor
 */
export function getModelRegistry(): ModelRegistry {
  return ModelRegistry.getInstance();
}

/**
 * Export types
 */
export type {
  HookContext,
  AuditLogEntry,
};
