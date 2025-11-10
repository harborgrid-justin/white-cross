/**
 * Enterprise-ready Sequelize Model Factory Utilities
 *
 * Comprehensive utilities for dynamic model creation, registration, inheritance,
 * polymorphic associations, lifecycle management, and advanced model patterns.
 *
 * @module reuse/data/model-factory
 * @version 1.0.0
 * @requires sequelize v6
 */

import {
  Sequelize,
  Model,
  ModelStatic,
  ModelAttributes,
  ModelOptions,
  DataTypes,
  InitOptions,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  Hooks,
  Association,
  AssociationOptions,
  BelongsToOptions,
  HasManyOptions,
  HasOneOptions,
  BelongsToManyOptions,
  Op,
  ValidationError,
  ValidationErrorItem,
} from 'sequelize';

/**
 * Type definitions for model factory utilities
 */
export interface ModelRegistryEntry {
  name: string;
  model: ModelStatic<any>;
  metadata: ModelMetadata;
  registeredAt: Date;
}

export interface ModelMetadata {
  tableName: string;
  attributes: string[];
  associations: string[];
  hooks: string[];
  scopes: string[];
  timestamps: boolean;
  paranoid: boolean;
  version: string;
  discriminator?: string;
}

export interface DiscriminatorConfig {
  field: string;
  values: Record<string, ModelStatic<any>>;
  defaultValue?: string;
}

export interface PolymorphicConfig {
  typeField: string;
  idField: string;
  models: Record<string, ModelStatic<any>>;
}

export interface ModelCloneOptions {
  includeHooks?: boolean;
  includeScopes?: boolean;
  includeValidations?: boolean;
  newTableName?: string;
  newModelName?: string;
}

export interface VersioningConfig {
  versionField: string;
  trackChanges: boolean;
  historyTable?: string;
  compareFields?: string[];
}

export interface SoftDeleteConfig {
  field: string;
  defaultValue: Date | null;
  type: typeof DataTypes.DATE;
  allowNull: boolean;
}

/**
 * Global model registry for tracking all registered models
 */
const modelRegistry: Map<string, ModelRegistryEntry> = new Map();

// ============================================================================
// Model Creation & Registration
// ============================================================================

/**
 * Creates a dynamic Sequelize model with specified attributes and options
 *
 * @param modelName - Name of the model to create
 * @param attributes - Model attributes definition
 * @param options - Model configuration options
 * @param sequelize - Sequelize instance
 * @returns Created model class
 *
 * @example
 * ```typescript
 * const User = createDynamicModel('User', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true },
 *   name: { type: DataTypes.STRING, allowNull: false }
 * }, {}, sequelize);
 * ```
 */
export function createDynamicModel<T extends Model>(
  modelName: string,
  attributes: ModelAttributes<T>,
  options: ModelOptions<T>,
  sequelize: Sequelize
): ModelStatic<T> {
  class DynamicModel extends Model<T> {}

  DynamicModel.init(attributes, {
    ...options,
    sequelize,
    modelName,
    tableName: options.tableName || modelName.toLowerCase() + 's',
  });

  return DynamicModel as ModelStatic<T>;
}

/**
 * Registers a model in the global model registry with metadata
 *
 * @param model - Model to register
 * @param metadata - Optional metadata override
 * @returns Registry entry
 *
 * @example
 * ```typescript
 * const entry = registerModel(User, {
 *   version: '1.0.0',
 *   tableName: 'users'
 * });
 * ```
 */
export function registerModel<T extends Model>(
  model: ModelStatic<T>,
  metadata?: Partial<ModelMetadata>
): ModelRegistryEntry {
  const modelName = model.name;
  const extractedMetadata = extractModelMetadata(model);

  const entry: ModelRegistryEntry = {
    name: modelName,
    model,
    metadata: { ...extractedMetadata, ...metadata },
    registeredAt: new Date(),
  };

  modelRegistry.set(modelName, entry);
  return entry;
}

/**
 * Retrieves a registered model by name from the registry
 *
 * @param modelName - Name of the model to retrieve
 * @returns Model class or undefined if not found
 *
 * @example
 * ```typescript
 * const User = getRegisteredModel('User');
 * if (User) {
 *   const users = await User.findAll();
 * }
 * ```
 */
export function getRegisteredModel<T extends Model>(
  modelName: string
): ModelStatic<T> | undefined {
  const entry = modelRegistry.get(modelName);
  return entry?.model as ModelStatic<T> | undefined;
}

/**
 * Lists all registered models in the registry
 *
 * @returns Array of all registry entries
 *
 * @example
 * ```typescript
 * const allModels = listRegisteredModels();
 * allModels.forEach(entry => {
 *   console.log(`Model: ${entry.name}, Table: ${entry.metadata.tableName}`);
 * });
 * ```
 */
export function listRegisteredModels(): ModelRegistryEntry[] {
  return Array.from(modelRegistry.values());
}

/**
 * Unregisters a model from the global registry
 *
 * @param modelName - Name of the model to unregister
 * @returns True if model was unregistered, false if not found
 *
 * @example
 * ```typescript
 * const removed = unregisterModel('TempModel');
 * console.log(removed ? 'Model removed' : 'Model not found');
 * ```
 */
export function unregisterModel(modelName: string): boolean {
  return modelRegistry.delete(modelName);
}

/**
 * Clears all models from the registry
 *
 * @example
 * ```typescript
 * clearModelRegistry(); // Remove all registered models
 * ```
 */
export function clearModelRegistry(): void {
  modelRegistry.clear();
}

// ============================================================================
// Model Inheritance & Discriminator Support
// ============================================================================

/**
 * Creates a base model class for inheritance patterns
 *
 * @param modelName - Name of the base model
 * @param attributes - Base model attributes
 * @param options - Model options
 * @param sequelize - Sequelize instance
 * @returns Base model class
 *
 * @example
 * ```typescript
 * const BaseEntity = createBaseModel('BaseEntity', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true },
 *   createdAt: DataTypes.DATE
 * }, {}, sequelize);
 * ```
 */
export function createBaseModel<T extends Model>(
  modelName: string,
  attributes: ModelAttributes<T>,
  options: ModelOptions<T>,
  sequelize: Sequelize
): ModelStatic<T> {
  return createDynamicModel(modelName, attributes, {
    ...options,
    timestamps: true,
    underscored: true,
  }, sequelize);
}

/**
 * Creates a child model that inherits from a base model
 *
 * @param parentModel - Parent model class
 * @param childName - Name of the child model
 * @param additionalAttributes - Additional attributes for child
 * @param options - Child model options
 * @param sequelize - Sequelize instance
 * @returns Child model class
 *
 * @example
 * ```typescript
 * const Employee = createInheritedModel(Person, 'Employee', {
 *   employeeId: { type: DataTypes.STRING, unique: true },
 *   department: DataTypes.STRING
 * }, {}, sequelize);
 * ```
 */
export function createInheritedModel<T extends Model, P extends Model>(
  parentModel: ModelStatic<P>,
  childName: string,
  additionalAttributes: ModelAttributes<T>,
  options: ModelOptions<T>,
  sequelize: Sequelize
): ModelStatic<T> {
  const parentAttributes = parentModel.getAttributes();

  const combinedAttributes: ModelAttributes<T> = {
    ...Object.fromEntries(
      Object.entries(parentAttributes).map(([key, value]) => [
        key,
        {
          type: value.type,
          allowNull: value.allowNull,
          defaultValue: value.defaultValue,
        },
      ])
    ),
    ...additionalAttributes,
  } as ModelAttributes<T>;

  return createDynamicModel(childName, combinedAttributes, options, sequelize);
}

/**
 * Adds a discriminator column to enable Single Table Inheritance
 *
 * @param model - Model to add discriminator to
 * @param config - Discriminator configuration
 * @returns Modified model
 *
 * @example
 * ```typescript
 * const config: DiscriminatorConfig = {
 *   field: 'type',
 *   values: { user: User, admin: Admin },
 *   defaultValue: 'user'
 * };
 * addDiscriminatorColumn(Person, config);
 * ```
 */
export function addDiscriminatorColumn<T extends Model>(
  model: ModelStatic<T>,
  config: DiscriminatorConfig
): ModelStatic<T> {
  const { field, defaultValue } = config;

  // Add discriminator field to model attributes
  model.rawAttributes[field] = {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: defaultValue || Object.keys(config.values)[0],
  };

  // Add hook to automatically set discriminator
  model.addHook('beforeCreate', (instance: any) => {
    if (!instance[field]) {
      instance[field] = defaultValue || Object.keys(config.values)[0];
    }
  });

  return model;
}

/**
 * Creates scopes for each discriminator value
 *
 * @param model - Model with discriminator
 * @param discriminatorField - Name of discriminator field
 * @param values - Discriminator values
 * @returns Model with added scopes
 *
 * @example
 * ```typescript
 * createDiscriminatorScopes(Person, 'type', ['user', 'admin', 'guest']);
 * // Now you can: Person.scope('user').findAll()
 * ```
 */
export function createDiscriminatorScopes<T extends Model>(
  model: ModelStatic<T>,
  discriminatorField: string,
  values: string[]
): ModelStatic<T> {
  values.forEach((value) => {
    model.addScope(value, {
      where: { [discriminatorField]: value },
    });
  });

  return model;
}

/**
 * Retrieves all models that share the same discriminator configuration
 *
 * @param baseModel - Base model with discriminator
 * @param discriminatorField - Discriminator field name
 * @returns Array of discriminated models
 *
 * @example
 * ```typescript
 * const relatedModels = getDiscriminatedModels(Person, 'type');
 * relatedModels.forEach(model => console.log(model.name));
 * ```
 */
export function getDiscriminatedModels<T extends Model>(
  baseModel: ModelStatic<T>,
  discriminatorField: string
): ModelStatic<any>[] {
  const models: ModelStatic<any>[] = [];

  for (const entry of modelRegistry.values()) {
    const attrs = entry.model.rawAttributes;
    if (attrs[discriminatorField] && entry.model.tableName === baseModel.tableName) {
      models.push(entry.model);
    }
  }

  return models;
}

// ============================================================================
// Polymorphic Associations
// ============================================================================

/**
 * Sets up polymorphic belongsTo association
 *
 * @param model - Model to add polymorphic association to
 * @param config - Polymorphic configuration
 * @param associationName - Name of the association
 * @returns Model with polymorphic association
 *
 * @example
 * ```typescript
 * setupPolymorphicBelongsTo(Comment, {
 *   typeField: 'commentableType',
 *   idField: 'commentableId',
 *   models: { Post, Video }
 * }, 'commentable');
 * ```
 */
export function setupPolymorphicBelongsTo<T extends Model>(
  model: ModelStatic<T>,
  config: PolymorphicConfig,
  associationName: string
): ModelStatic<T> {
  const { typeField, idField, models } = config;

  // Add polymorphic fields
  model.rawAttributes[typeField] = {
    type: DataTypes.STRING,
    allowNull: false,
  };

  model.rawAttributes[idField] = {
    type: DataTypes.INTEGER,
    allowNull: false,
  };

  // Create associations for each model type
  Object.entries(models).forEach(([type, targetModel]) => {
    model.belongsTo(targetModel, {
      foreignKey: idField,
      constraints: false,
      as: `${associationName}_${type}`,
    });
  });

  return model;
}

/**
 * Sets up polymorphic hasMany association
 *
 * @param model - Model to add polymorphic hasMany to
 * @param targetModel - Target model with polymorphic fields
 * @param config - Polymorphic configuration
 * @param associationName - Name of the association
 * @returns Model with polymorphic hasMany
 *
 * @example
 * ```typescript
 * setupPolymorphicHasMany(Post, Comment, {
 *   typeField: 'commentableType',
 *   idField: 'commentableId',
 *   models: {}
 * }, 'comments');
 * ```
 */
export function setupPolymorphicHasMany<T extends Model, U extends Model>(
  model: ModelStatic<T>,
  targetModel: ModelStatic<U>,
  config: PolymorphicConfig,
  associationName: string
): ModelStatic<T> {
  const { typeField, idField } = config;

  model.hasMany(targetModel, {
    foreignKey: idField,
    constraints: false,
    scope: {
      [typeField]: model.name,
    },
    as: associationName,
  });

  return model;
}

/**
 * Retrieves the correct model for a polymorphic association
 *
 * @param config - Polymorphic configuration
 * @param typeName - Type name from the polymorphic field
 * @returns Corresponding model or undefined
 *
 * @example
 * ```typescript
 * const model = getPolymorphicModel(config, 'Post');
 * if (model) {
 *   const instance = await model.findByPk(id);
 * }
 * ```
 */
export function getPolymorphicModel(
  config: PolymorphicConfig,
  typeName: string
): ModelStatic<any> | undefined {
  return config.models[typeName];
}

/**
 * Creates a polymorphic query helper for fetching associated records
 *
 * @param instance - Model instance with polymorphic association
 * @param config - Polymorphic configuration
 * @returns Associated model instance or null
 *
 * @example
 * ```typescript
 * const comment = await Comment.findByPk(1);
 * const parent = await fetchPolymorphicAssociation(comment, polymorphicConfig);
 * ```
 */
export async function fetchPolymorphicAssociation<T extends Model>(
  instance: T,
  config: PolymorphicConfig
): Promise<Model | null> {
  const { typeField, idField, models } = config;
  const typeName = (instance as any)[typeField];
  const id = (instance as any)[idField];

  const targetModel = models[typeName];
  if (!targetModel) {
    return null;
  }

  return targetModel.findByPk(id);
}

// ============================================================================
// Lifecycle Hooks Registration
// ============================================================================

/**
 * Registers multiple lifecycle hooks on a model
 *
 * @param model - Model to add hooks to
 * @param hooks - Hooks configuration object
 * @returns Model with registered hooks
 *
 * @example
 * ```typescript
 * registerLifecycleHooks(User, {
 *   beforeCreate: async (instance) => { instance.uuid = generateUuid(); },
 *   afterCreate: async (instance) => { await sendWelcomeEmail(instance); }
 * });
 * ```
 */
export function registerLifecycleHooks<T extends Model>(
  model: ModelStatic<T>,
  hooks: Partial<Hooks<T>>
): ModelStatic<T> {
  Object.entries(hooks).forEach(([hookName, hookFn]) => {
    if (hookFn) {
      model.addHook(hookName as keyof Hooks<T>, hookFn);
    }
  });

  return model;
}

/**
 * Adds an audit logging hook that tracks all model changes
 *
 * @param model - Model to add audit logging to
 * @param auditModel - Model for storing audit logs
 * @param options - Audit configuration options
 * @returns Model with audit hooks
 *
 * @example
 * ```typescript
 * addAuditLoggingHook(User, AuditLog, {
 *   trackFields: ['email', 'status'],
 *   userId: () => getCurrentUserId()
 * });
 * ```
 */
export function addAuditLoggingHook<T extends Model>(
  model: ModelStatic<T>,
  auditModel: ModelStatic<any>,
  options: {
    trackFields?: string[];
    userId?: () => string | number;
    includeOldValues?: boolean;
  } = {}
): ModelStatic<T> {
  const { trackFields, userId, includeOldValues = true } = options;

  const createAuditLog = async (
    instance: T,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    changes?: any
  ) => {
    await auditModel.create({
      modelName: model.name,
      recordId: (instance as any).id,
      action,
      changes: changes || instance.toJSON(),
      userId: userId ? userId() : null,
      timestamp: new Date(),
    });
  };

  model.addHook('afterCreate', async (instance) => {
    await createAuditLog(instance, 'CREATE');
  });

  model.addHook('afterUpdate', async (instance) => {
    const changes: any = {};
    const changedFields = instance.changed() as string[] || [];

    changedFields.forEach((field) => {
      if (!trackFields || trackFields.includes(field)) {
        changes[field] = {
          new: (instance as any)[field],
          old: includeOldValues ? (instance as any)._previousDataValues?.[field] : undefined,
        };
      }
    });

    if (Object.keys(changes).length > 0) {
      await createAuditLog(instance, 'UPDATE', changes);
    }
  });

  model.addHook('afterDestroy', async (instance) => {
    await createAuditLog(instance, 'DELETE');
  });

  return model;
}

/**
 * Adds validation hooks with custom error handling
 *
 * @param model - Model to add validation hooks to
 * @param validators - Custom validation functions
 * @returns Model with validation hooks
 *
 * @example
 * ```typescript
 * addValidationHooks(User, {
 *   email: async (value) => {
 *     if (!value.includes('@')) throw new Error('Invalid email');
 *   }
 * });
 * ```
 */
export function addValidationHooks<T extends Model>(
  model: ModelStatic<T>,
  validators: Record<string, (value: any, instance: T) => Promise<void> | void>
): ModelStatic<T> {
  model.addHook('beforeValidate', async (instance) => {
    const errors: ValidationErrorItem[] = [];

    for (const [field, validator] of Object.entries(validators)) {
      try {
        await validator((instance as any)[field], instance);
      } catch (error) {
        errors.push(
          new ValidationErrorItem(
            (error as Error).message,
            'Validation error',
            field,
            (instance as any)[field],
            instance,
            'function',
            field,
            []
          )
        );
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
  });

  return model;
}

/**
 * Removes all hooks of a specific type from a model
 *
 * @param model - Model to remove hooks from
 * @param hookName - Name of the hook type to remove
 * @returns Model with hooks removed
 *
 * @example
 * ```typescript
 * removeHooks(User, 'beforeCreate');
 * ```
 */
export function removeHooks<T extends Model>(
  model: ModelStatic<T>,
  hookName: keyof Hooks<T>
): ModelStatic<T> {
  model.removeHook(hookName);
  return model;
}

/**
 * Lists all registered hooks on a model
 *
 * @param model - Model to inspect
 * @returns Array of hook names
 *
 * @example
 * ```typescript
 * const hooks = listModelHooks(User);
 * console.log('Registered hooks:', hooks);
 * ```
 */
export function listModelHooks<T extends Model>(
  model: ModelStatic<T>
): string[] {
  const hooks: string[] = [];
  const hookNames: (keyof Hooks<T>)[] = [
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

  hookNames.forEach((hookName) => {
    if (model.options.hooks?.[hookName]) {
      hooks.push(hookName as string);
    }
  });

  return hooks;
}

// ============================================================================
// Timestamp & Soft Delete Management
// ============================================================================

/**
 * Configures automatic timestamp management for a model
 *
 * @param model - Model to configure timestamps for
 * @param options - Timestamp configuration options
 * @returns Model with timestamp configuration
 *
 * @example
 * ```typescript
 * configureTimestamps(User, {
 *   createdAt: 'created_at',
 *   updatedAt: 'updated_at',
 *   timestamps: true
 * });
 * ```
 */
export function configureTimestamps<T extends Model>(
  model: ModelStatic<T>,
  options: {
    timestamps?: boolean;
    createdAt?: string | boolean;
    updatedAt?: string | boolean;
    deletedAt?: string | boolean;
  }
): ModelStatic<T> {
  model.options.timestamps = options.timestamps !== false;

  if (options.createdAt !== undefined) {
    model.options.createdAt = options.createdAt;
  }

  if (options.updatedAt !== undefined) {
    model.options.updatedAt = options.updatedAt;
  }

  if (options.deletedAt !== undefined) {
    model.options.deletedAt = options.deletedAt;
  }

  return model;
}

/**
 * Enables soft delete (paranoid mode) on a model
 *
 * @param model - Model to enable soft delete on
 * @param config - Soft delete configuration
 * @returns Model with soft delete enabled
 *
 * @example
 * ```typescript
 * enableSoftDelete(User, {
 *   field: 'deletedAt',
 *   defaultValue: null,
 *   type: DataTypes.DATE,
 *   allowNull: true
 * });
 * ```
 */
export function enableSoftDelete<T extends Model>(
  model: ModelStatic<T>,
  config: SoftDeleteConfig
): ModelStatic<T> {
  model.options.paranoid = true;
  model.options.deletedAt = config.field;

  model.rawAttributes[config.field] = {
    type: config.type,
    allowNull: config.allowNull,
    defaultValue: config.defaultValue,
  };

  return model;
}

/**
 * Disables soft delete (paranoid mode) on a model
 *
 * @param model - Model to disable soft delete on
 * @returns Model with soft delete disabled
 *
 * @example
 * ```typescript
 * disableSoftDelete(User);
 * ```
 */
export function disableSoftDelete<T extends Model>(
  model: ModelStatic<T>
): ModelStatic<T> {
  model.options.paranoid = false;
  return model;
}

/**
 * Restores a soft-deleted record
 *
 * @param model - Model class
 * @param id - ID of the record to restore
 * @param options - Restore options
 * @returns Restored instance or null
 *
 * @example
 * ```typescript
 * const restored = await restoreSoftDeleted(User, 123);
 * console.log('User restored:', restored.name);
 * ```
 */
export async function restoreSoftDeleted<T extends Model>(
  model: ModelStatic<T>,
  id: number | string,
  options: { transaction?: any } = {}
): Promise<T | null> {
  const instance = await model.findByPk(id, {
    paranoid: false,
    ...options,
  });

  if (instance && (instance as any).deletedAt) {
    await instance.restore(options);
    return instance;
  }

  return null;
}

/**
 * Permanently deletes a soft-deleted record
 *
 * @param model - Model class
 * @param id - ID of the record to permanently delete
 * @param options - Destroy options
 * @returns Number of destroyed records
 *
 * @example
 * ```typescript
 * await permanentlyDelete(User, 123);
 * console.log('User permanently deleted');
 * ```
 */
export async function permanentlyDelete<T extends Model>(
  model: ModelStatic<T>,
  id: number | string,
  options: { transaction?: any } = {}
): Promise<number> {
  return model.destroy({
    where: { id } as any,
    force: true,
    ...options,
  });
}

/**
 * Finds all soft-deleted records
 *
 * @param model - Model class
 * @param options - Find options
 * @returns Array of soft-deleted instances
 *
 * @example
 * ```typescript
 * const deleted = await findSoftDeleted(User);
 * console.log(`Found ${deleted.length} deleted users`);
 * ```
 */
export async function findSoftDeleted<T extends Model>(
  model: ModelStatic<T>,
  options: FindOptions<T> = {}
): Promise<T[]> {
  return model.findAll({
    ...options,
    paranoid: false,
    where: {
      ...options.where,
      deletedAt: { [Op.ne]: null },
    } as any,
  });
}

// ============================================================================
// Schema Validation & Metadata
// ============================================================================

/**
 * Validates model schema against a JSON schema definition
 *
 * @param model - Model to validate
 * @param schema - JSON schema object
 * @returns Validation result with errors if any
 *
 * @example
 * ```typescript
 * const result = validateModelSchema(User, {
 *   type: 'object',
 *   required: ['email', 'name'],
 *   properties: { email: { type: 'string' } }
 * });
 * ```
 */
export function validateModelSchema<T extends Model>(
  model: ModelStatic<T>,
  schema: {
    type: string;
    required?: string[];
    properties?: Record<string, any>;
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const attributes = model.getAttributes();

  if (schema.required) {
    schema.required.forEach((field) => {
      if (!attributes[field]) {
        errors.push(`Required field '${field}' is missing from model`);
      } else if (!attributes[field].allowNull) {
        // Field exists and is non-nullable, which is correct
      } else if (attributes[field].allowNull) {
        errors.push(`Required field '${field}' allows null values`);
      }
    });
  }

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([field, fieldSchema]) => {
      if (!attributes[field]) {
        errors.push(`Schema defines field '${field}' but it's missing from model`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extracts comprehensive metadata from a model
 *
 * @param model - Model to extract metadata from
 * @returns Model metadata object
 *
 * @example
 * ```typescript
 * const metadata = extractModelMetadata(User);
 * console.log('Table:', metadata.tableName);
 * console.log('Attributes:', metadata.attributes);
 * ```
 */
export function extractModelMetadata<T extends Model>(
  model: ModelStatic<T>
): ModelMetadata {
  const attributes = model.getAttributes();
  const associations = Object.keys(model.associations);

  return {
    tableName: model.tableName,
    attributes: Object.keys(attributes),
    associations,
    hooks: listModelHooks(model),
    scopes: Object.keys((model as any).options.scopes || {}),
    timestamps: model.options.timestamps !== false,
    paranoid: model.options.paranoid === true,
    version: '1.0.0',
  };
}

/**
 * Compares two model schemas for differences
 *
 * @param model1 - First model to compare
 * @param model2 - Second model to compare
 * @returns Differences between models
 *
 * @example
 * ```typescript
 * const diff = compareModelSchemas(UserV1, UserV2);
 * console.log('Added fields:', diff.addedAttributes);
 * console.log('Removed fields:', diff.removedAttributes);
 * ```
 */
export function compareModelSchemas<T extends Model, U extends Model>(
  model1: ModelStatic<T>,
  model2: ModelStatic<U>
): {
  addedAttributes: string[];
  removedAttributes: string[];
  modifiedAttributes: string[];
  addedAssociations: string[];
  removedAssociations: string[];
} {
  const attrs1 = Object.keys(model1.getAttributes());
  const attrs2 = Object.keys(model2.getAttributes());
  const assocs1 = Object.keys(model1.associations);
  const assocs2 = Object.keys(model2.associations);

  return {
    addedAttributes: attrs2.filter((a) => !attrs1.includes(a)),
    removedAttributes: attrs1.filter((a) => !attrs2.includes(a)),
    modifiedAttributes: attrs1.filter((a) => {
      if (!attrs2.includes(a)) return false;
      const attr1 = model1.getAttributes()[a];
      const attr2 = model2.getAttributes()[a];
      return JSON.stringify(attr1) !== JSON.stringify(attr2);
    }),
    addedAssociations: assocs2.filter((a) => !assocs1.includes(a)),
    removedAssociations: assocs1.filter((a) => !assocs2.includes(a)),
  };
}

/**
 * Extracts all foreign key relationships from a model
 *
 * @param model - Model to extract foreign keys from
 * @returns Array of foreign key definitions
 *
 * @example
 * ```typescript
 * const fks = extractForeignKeys(Order);
 * fks.forEach(fk => console.log(`${fk.field} -> ${fk.references.table}`));
 * ```
 */
export function extractForeignKeys<T extends Model>(
  model: ModelStatic<T>
): Array<{
  field: string;
  references: { table: string; key: string };
}> {
  const attributes = model.getAttributes();
  const foreignKeys: Array<{
    field: string;
    references: { table: string; key: string };
  }> = [];

  Object.entries(attributes).forEach(([field, attr]) => {
    if (attr.references) {
      foreignKeys.push({
        field,
        references: {
          table: (attr.references as any).model || '',
          key: (attr.references as any).key || 'id',
        },
      });
    }
  });

  return foreignKeys;
}

// ============================================================================
// Model Cloning & Comparison
// ============================================================================

/**
 * Creates a deep clone of a model with optional modifications
 *
 * @param model - Model to clone
 * @param options - Clone configuration options
 * @param sequelize - Sequelize instance
 * @returns Cloned model
 *
 * @example
 * ```typescript
 * const UserBackup = cloneModel(User, {
 *   newModelName: 'UserBackup',
 *   newTableName: 'users_backup',
 *   includeHooks: false
 * }, sequelize);
 * ```
 */
export function cloneModel<T extends Model>(
  model: ModelStatic<T>,
  options: ModelCloneOptions,
  sequelize: Sequelize
): ModelStatic<T> {
  const {
    includeHooks = true,
    includeScopes = true,
    includeValidations = true,
    newTableName,
    newModelName,
  } = options;

  const attributes = { ...model.getAttributes() };

  // Clone attributes, optionally excluding validations
  const clonedAttributes: ModelAttributes<T> = Object.fromEntries(
    Object.entries(attributes).map(([key, attr]) => [
      key,
      {
        ...attr,
        validate: includeValidations ? attr.validate : undefined,
      },
    ])
  ) as ModelAttributes<T>;

  const modelOptions: ModelOptions<T> = {
    ...model.options,
    tableName: newTableName || model.tableName,
    modelName: newModelName || model.name,
    hooks: includeHooks ? model.options.hooks : undefined,
    scopes: includeScopes ? (model as any).options.scopes : undefined,
  };

  return createDynamicModel(
    newModelName || model.name,
    clonedAttributes,
    modelOptions,
    sequelize
  );
}

/**
 * Compares two model instances field by field
 *
 * @param instance1 - First instance to compare
 * @param instance2 - Second instance to compare
 * @param fields - Optional array of fields to compare
 * @returns Object with differences
 *
 * @example
 * ```typescript
 * const user1 = await User.findByPk(1);
 * const user2 = await User.findByPk(2);
 * const diff = compareInstances(user1, user2, ['email', 'name']);
 * ```
 */
export function compareInstances<T extends Model>(
  instance1: T,
  instance2: T,
  fields?: string[]
): Record<string, { value1: any; value2: any; different: boolean }> {
  const comparison: Record<string, { value1: any; value2: any; different: boolean }> = {};
  const data1 = instance1.toJSON();
  const data2 = instance2.toJSON();

  const fieldsToCompare = fields || Object.keys(data1);

  fieldsToCompare.forEach((field) => {
    const value1 = data1[field];
    const value2 = data2[field];
    comparison[field] = {
      value1,
      value2,
      different: JSON.stringify(value1) !== JSON.stringify(value2),
    };
  });

  return comparison;
}

/**
 * Checks if two instances are deeply equal
 *
 * @param instance1 - First instance
 * @param instance2 - Second instance
 * @param excludeFields - Fields to exclude from comparison
 * @returns True if instances are equal
 *
 * @example
 * ```typescript
 * const equal = areInstancesEqual(user1, user2, ['createdAt', 'updatedAt']);
 * console.log(equal ? 'Instances are equal' : 'Instances differ');
 * ```
 */
export function areInstancesEqual<T extends Model>(
  instance1: T,
  instance2: T,
  excludeFields: string[] = []
): boolean {
  const data1 = instance1.toJSON();
  const data2 = instance2.toJSON();

  const fields1 = Object.keys(data1).filter((f) => !excludeFields.includes(f));
  const fields2 = Object.keys(data2).filter((f) => !excludeFields.includes(f));

  if (fields1.length !== fields2.length) {
    return false;
  }

  return fields1.every((field) => {
    return JSON.stringify(data1[field]) === JSON.stringify(data2[field]);
  });
}

// ============================================================================
// Model Versioning
// ============================================================================

/**
 * Enables versioning on a model with automatic version incrementation
 *
 * @param model - Model to enable versioning on
 * @param config - Versioning configuration
 * @returns Model with versioning enabled
 *
 * @example
 * ```typescript
 * enableVersioning(Document, {
 *   versionField: 'version',
 *   trackChanges: true,
 *   historyTable: 'document_history',
 *   compareFields: ['title', 'content']
 * });
 * ```
 */
export function enableVersioning<T extends Model>(
  model: ModelStatic<T>,
  config: VersioningConfig
): ModelStatic<T> {
  const { versionField, trackChanges, historyTable, compareFields } = config;

  // Add version field to model
  model.rawAttributes[versionField] = {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  };

  // Add beforeUpdate hook to increment version
  model.addHook('beforeUpdate', (instance: any) => {
    if (instance.changed()) {
      instance[versionField] = (instance[versionField] || 0) + 1;
    }
  });

  // Optionally track changes in history table
  if (trackChanges && historyTable) {
    model.addHook('afterUpdate', async (instance: any, options) => {
      const changes: any = {};
      const changedFields = instance.changed() as string[] || [];

      changedFields.forEach((field) => {
        if (!compareFields || compareFields.includes(field)) {
          changes[field] = {
            old: instance._previousDataValues?.[field],
            new: (instance as any)[field],
          };
        }
      });

      if (Object.keys(changes).length > 0) {
        await model.sequelize?.query(
          `INSERT INTO ${historyTable} (record_id, version, changes, created_at) VALUES (?, ?, ?, ?)`,
          {
            replacements: [
              instance.id,
              instance[versionField],
              JSON.stringify(changes),
              new Date(),
            ],
          }
        );
      }
    });
  }

  return model;
}

/**
 * Retrieves version history for a specific record
 *
 * @param model - Model class
 * @param recordId - ID of the record
 * @param historyTable - Name of the history table
 * @returns Array of version history entries
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory(Document, 123, 'document_history');
 * history.forEach(entry => console.log(`Version ${entry.version}:`, entry.changes));
 * ```
 */
export async function getVersionHistory<T extends Model>(
  model: ModelStatic<T>,
  recordId: number | string,
  historyTable: string
): Promise<Array<{ version: number; changes: any; createdAt: Date }>> {
  const [results] = await model.sequelize!.query(
    `SELECT version, changes, created_at FROM ${historyTable} WHERE record_id = ? ORDER BY version DESC`,
    { replacements: [recordId] }
  );

  return (results as any[]).map((row: any) => ({
    version: row.version,
    changes: typeof row.changes === 'string' ? JSON.parse(row.changes) : row.changes,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Reverts a record to a specific version
 *
 * @param model - Model class
 * @param recordId - ID of the record to revert
 * @param targetVersion - Version number to revert to
 * @param historyTable - Name of the history table
 * @param versionField - Name of the version field
 * @returns Reverted instance
 *
 * @example
 * ```typescript
 * const reverted = await revertToVersion(Document, 123, 5, 'document_history', 'version');
 * console.log('Reverted to version:', reverted.version);
 * ```
 */
export async function revertToVersion<T extends Model>(
  model: ModelStatic<T>,
  recordId: number | string,
  targetVersion: number,
  historyTable: string,
  versionField: string
): Promise<T> {
  const instance = await model.findByPk(recordId);
  if (!instance) {
    throw new Error(`Record with ID ${recordId} not found`);
  }

  const history = await getVersionHistory(model, recordId, historyTable);
  const targetHistory = history.find((h) => h.version === targetVersion);

  if (!targetHistory) {
    throw new Error(`Version ${targetVersion} not found in history`);
  }

  // Apply historical changes in reverse
  const currentVersion = (instance as any)[versionField];
  for (let v = currentVersion; v > targetVersion; v--) {
    const versionHistory = history.find((h) => h.version === v);
    if (versionHistory) {
      Object.entries(versionHistory.changes).forEach(([field, change]: [string, any]) => {
        (instance as any)[field] = change.old;
      });
    }
  }

  (instance as any)[versionField] = targetVersion;
  await instance.save();

  return instance;
}

/**
 * Creates a snapshot of the current model state for versioning
 *
 * @param instance - Instance to create snapshot of
 * @param versionField - Name of the version field
 * @returns Snapshot object
 *
 * @example
 * ```typescript
 * const snapshot = createVersionSnapshot(document, 'version');
 * console.log('Snapshot:', snapshot);
 * ```
 */
export function createVersionSnapshot<T extends Model>(
  instance: T,
  versionField: string
): { version: number; data: any; timestamp: Date } {
  return {
    version: (instance as any)[versionField] || 1,
    data: instance.toJSON(),
    timestamp: new Date(),
  };
}

/**
 * Exports the complete model factory configuration for documentation
 *
 * @returns Model factory configuration object
 *
 * @example
 * ```typescript
 * const config = exportModelFactoryConfig();
 * console.log('Registered models:', config.models);
 * ```
 */
export function exportModelFactoryConfig(): {
  models: ModelRegistryEntry[];
  totalModels: number;
  timestamp: Date;
} {
  return {
    models: listRegisteredModels(),
    totalModels: modelRegistry.size,
    timestamp: new Date(),
  };
}
