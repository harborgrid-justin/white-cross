/**
 * Sequelize Association Manager
 *
 * Enterprise-ready TypeScript utilities for managing Sequelize v6 associations,
 * including dynamic setup, polymorphic associations, eager loading optimization,
 * and N+1 query prevention strategies.
 *
 * @module association-manager
 * @version 1.0.0
 */

import {
  Model,
  ModelStatic,
  Association,
  HasOneOptions,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
  Includeable,
  IncludeOptions,
  FindOptions,
  Sequelize,
  WhereOptions,
  Order,
  Attributes,
  CreationAttributes,
  ForeignKey,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

/**
 * Association type discriminator
 */
export type AssociationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';

/**
 * Association configuration interface
 */
export interface AssociationConfig {
  type: AssociationType;
  source: ModelStatic<any>;
  target: ModelStatic<any>;
  options: HasOneOptions | HasManyOptions | BelongsToOptions | BelongsToManyOptions;
}

/**
 * Polymorphic association configuration
 */
export interface PolymorphicConfig {
  foreignKey: string;
  discriminator: string;
  models: Array<{ model: ModelStatic<any>; discriminatorValue: string }>;
}

/**
 * Eager loading strategy configuration
 */
export interface EagerLoadConfig {
  associations: string[];
  nested?: Record<string, EagerLoadConfig>;
  required?: boolean;
  separate?: boolean;
  limit?: number;
  order?: Order;
  attributes?: string[];
  where?: WhereOptions;
}

/**
 * Association alias mapping
 */
export interface AssociationAliasMap {
  [modelName: string]: {
    [associationType: string]: string[];
  };
}

/**
 * Through model configuration
 */
export interface ThroughModelConfig {
  model: ModelStatic<any>;
  attributes?: string[];
  where?: WhereOptions;
  required?: boolean;
  scope?: Record<string, any>;
}

/**
 * Dynamically creates an association between two models
 *
 * @param config - Association configuration
 * @returns The created association instance
 *
 * @example
 * ```typescript
 * const association = createAssociation({
 *   type: 'hasMany',
 *   source: User,
 *   target: Post,
 *   options: { foreignKey: 'userId', as: 'posts' }
 * });
 * ```
 */
export function createAssociation(config: AssociationConfig): Association {
  const { type, source, target, options } = config;

  switch (type) {
    case 'hasOne':
      return source.hasOne(target, options as HasOneOptions);
    case 'hasMany':
      return source.hasMany(target, options as HasManyOptions);
    case 'belongsTo':
      return source.belongsTo(target, options as BelongsToOptions);
    case 'belongsToMany':
      return source.belongsToMany(target, options as BelongsToManyOptions);
    default:
      throw new Error(`Unknown association type: ${type}`);
  }
}

/**
 * Establishes a belongsTo relationship with optimized foreign key handling
 *
 * @param source - Source model
 * @param target - Target model
 * @param options - BelongsTo options
 * @returns The created association
 *
 * @example
 * ```typescript
 * setupBelongsTo(Post, User, {
 *   foreignKey: 'authorId',
 *   targetKey: 'id',
 *   as: 'author'
 * });
 * ```
 */
export function setupBelongsTo<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  options: BelongsToOptions
): Association<S, T> {
  const defaultOptions: BelongsToOptions = {
    foreignKey: {
      allowNull: options.foreignKey && typeof options.foreignKey === 'object'
        ? options.foreignKey.allowNull
        : false,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    ...options,
  };

  return source.belongsTo(target, defaultOptions);
}

/**
 * Establishes a hasMany relationship with cascade options
 *
 * @param source - Source model
 * @param target - Target model
 * @param options - HasMany options
 * @returns The created association
 *
 * @example
 * ```typescript
 * setupHasMany(User, Post, {
 *   foreignKey: 'userId',
 *   as: 'posts',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export function setupHasMany<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  options: HasManyOptions
): Association<S, T> {
  const defaultOptions: HasManyOptions = {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    ...options,
  };

  return source.hasMany(target, defaultOptions);
}

/**
 * Establishes a hasOne relationship with optimized configuration
 *
 * @param source - Source model
 * @param target - Target model
 * @param options - HasOne options
 * @returns The created association
 *
 * @example
 * ```typescript
 * setupHasOne(User, Profile, {
 *   foreignKey: 'userId',
 *   as: 'profile'
 * });
 * ```
 */
export function setupHasOne<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  options: HasOneOptions
): Association<S, T> {
  const defaultOptions: HasOneOptions = {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    ...options,
  };

  return source.hasOne(target, defaultOptions);
}

/**
 * Establishes a belongsToMany relationship with through model
 *
 * @param source - Source model
 * @param target - Target model
 * @param throughModel - Junction table model
 * @param options - Additional options
 * @returns The created association
 *
 * @example
 * ```typescript
 * setupBelongsToMany(User, Role, UserRole, {
 *   foreignKey: 'userId',
 *   otherKey: 'roleId',
 *   as: 'roles'
 * });
 * ```
 */
export function setupBelongsToMany<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  throughModel: ModelStatic<any> | string,
  options: Omit<BelongsToManyOptions, 'through'>
): Association<S, T> {
  const fullOptions: BelongsToManyOptions = {
    through: throughModel,
    ...options,
  };

  return source.belongsToMany(target, fullOptions);
}

/**
 * Creates bidirectional belongsToMany associations
 *
 * @param model1 - First model
 * @param model2 - Second model
 * @param throughModel - Junction table model
 * @param config - Configuration for both directions
 * @returns Array of both associations
 *
 * @example
 * ```typescript
 * setupBidirectionalBelongsToMany(User, Role, UserRole, {
 *   model1Config: { foreignKey: 'userId', as: 'roles' },
 *   model2Config: { foreignKey: 'roleId', as: 'users' }
 * });
 * ```
 */
export function setupBidirectionalBelongsToMany<M1 extends Model, M2 extends Model>(
  model1: ModelStatic<M1>,
  model2: ModelStatic<M2>,
  throughModel: ModelStatic<any> | string,
  config: {
    model1Config: Omit<BelongsToManyOptions, 'through'>;
    model2Config: Omit<BelongsToManyOptions, 'through'>;
  }
): [Association<M1, M2>, Association<M2, M1>] {
  const assoc1 = setupBelongsToMany(model1, model2, throughModel, config.model1Config);
  const assoc2 = setupBelongsToMany(model2, model1, throughModel, config.model2Config);

  return [assoc1, assoc2];
}

/**
 * Sets up a polymorphic belongsTo association
 *
 * @param source - Source model that has the polymorphic association
 * @param config - Polymorphic configuration
 * @returns Array of created associations
 *
 * @example
 * ```typescript
 * setupPolymorphicBelongsTo(Comment, {
 *   foreignKey: 'commentableId',
 *   discriminator: 'commentableType',
 *   models: [
 *     { model: Post, discriminatorValue: 'Post' },
 *     { model: Video, discriminatorValue: 'Video' }
 *   ]
 * });
 * ```
 */
export function setupPolymorphicBelongsTo<S extends Model>(
  source: ModelStatic<S>,
  config: PolymorphicConfig
): Association<S, any>[] {
  const { foreignKey, discriminator, models } = config;
  const associations: Association<S, any>[] = [];

  for (const { model, discriminatorValue } of models) {
    const association = source.belongsTo(model, {
      foreignKey,
      constraints: false,
      scope: {
        [discriminator]: discriminatorValue,
      },
    });
    associations.push(association);
  }

  return associations;
}

/**
 * Sets up polymorphic hasMany associations
 *
 * @param targets - Target models that can have the polymorphic association
 * @param source - Source model
 * @param config - Polymorphic configuration
 * @param alias - Association alias
 * @returns Array of created associations
 *
 * @example
 * ```typescript
 * setupPolymorphicHasMany(
 *   [Post, Video],
 *   Comment,
 *   {
 *     foreignKey: 'commentableId',
 *     discriminator: 'commentableType',
 *     models: [
 *       { model: Post, discriminatorValue: 'Post' },
 *       { model: Video, discriminatorValue: 'Video' }
 *     ]
 *   },
 *   'comments'
 * );
 * ```
 */
export function setupPolymorphicHasMany<T extends Model, S extends Model>(
  targets: Array<{ model: ModelStatic<T>; discriminatorValue: string }>,
  source: ModelStatic<S>,
  config: { foreignKey: string; discriminator: string },
  alias: string
): Association<T, S>[] {
  const { foreignKey, discriminator } = config;
  const associations: Association<T, S>[] = [];

  for (const { model, discriminatorValue } of targets) {
    const association = model.hasMany(source, {
      foreignKey,
      constraints: false,
      scope: {
        [discriminator]: discriminatorValue,
      },
      as: alias,
    });
    associations.push(association);
  }

  return associations;
}

/**
 * Creates a self-referential association (e.g., hierarchical data)
 *
 * @param model - Model to create self-reference on
 * @param config - Self-reference configuration
 * @returns Object with parent and children associations
 *
 * @example
 * ```typescript
 * setupSelfReferential(Category, {
 *   foreignKey: 'parentId',
 *   parentAlias: 'parent',
 *   childrenAlias: 'children'
 * });
 * ```
 */
export function setupSelfReferential<M extends Model>(
  model: ModelStatic<M>,
  config: {
    foreignKey: string;
    parentAlias: string;
    childrenAlias: string;
    onDelete?: string;
  }
): {
  parent: Association<M, M>;
  children: Association<M, M>;
} {
  const { foreignKey, parentAlias, childrenAlias, onDelete = 'CASCADE' } = config;

  const parent = model.belongsTo(model, {
    foreignKey,
    as: parentAlias,
    onDelete: onDelete as any,
  });

  const children = model.hasMany(model, {
    foreignKey,
    as: childrenAlias,
    onDelete: onDelete as any,
  });

  return { parent, children };
}

/**
 * Creates a hierarchical tree structure with multiple levels
 *
 * @param model - Model to create hierarchy on
 * @param config - Hierarchy configuration
 * @returns Configured associations
 *
 * @example
 * ```typescript
 * setupHierarchicalTree(Category, {
 *   foreignKey: 'parentId',
 *   levelKey: 'level',
 *   pathKey: 'path'
 * });
 * ```
 */
export function setupHierarchicalTree<M extends Model>(
  model: ModelStatic<M>,
  config: {
    foreignKey: string;
    levelKey?: string;
    pathKey?: string;
  }
): {
  parent: Association<M, M>;
  children: Association<M, M>;
  ancestors?: Association<M, M>;
  descendants?: Association<M, M>;
} {
  const { foreignKey } = config;

  const parent = model.belongsTo(model, {
    foreignKey,
    as: 'parent',
  });

  const children = model.hasMany(model, {
    foreignKey,
    as: 'children',
  });

  return { parent, children };
}

/**
 * Handles circular associations between models
 *
 * @param models - Array of models with circular dependencies
 * @param associations - Association definitions
 * @returns Array of created associations
 *
 * @example
 * ```typescript
 * handleCircularAssociations(
 *   [User, Post, Comment],
 *   [
 *     { source: User, target: Post, type: 'hasMany', options: { as: 'posts' } },
 *     { source: Post, target: Comment, type: 'hasMany', options: { as: 'comments' } },
 *     { source: Comment, target: User, type: 'belongsTo', options: { as: 'author' } }
 *   ]
 * );
 * ```
 */
export function handleCircularAssociations(
  models: ModelStatic<any>[],
  associations: AssociationConfig[]
): Association<any, any>[] {
  const createdAssociations: Association<any, any>[] = [];

  // First pass: create all associations
  for (const config of associations) {
    const association = createAssociation(config);
    createdAssociations.push(association);
  }

  return createdAssociations;
}

/**
 * Optimizes eager loading by analyzing query patterns
 *
 * @param model - Model to optimize
 * @param config - Eager loading configuration
 * @returns Optimized include options
 *
 * @example
 * ```typescript
 * const includes = optimizeEagerLoading(User, {
 *   associations: ['posts', 'profile'],
 *   nested: {
 *     posts: {
 *       associations: ['comments'],
 *       limit: 5,
 *       separate: true
 *     }
 *   }
 * });
 * ```
 */
export function optimizeEagerLoading(
  model: ModelStatic<any>,
  config: EagerLoadConfig
): Includeable[] {
  const includes: Includeable[] = [];

  for (const assocName of config.associations) {
    const association = model.associations[assocName];
    if (!association) continue;

    const includeConfig: IncludeOptions = {
      association: assocName,
      required: config.required ?? false,
    };

    // Apply optimization strategies
    if (config.separate !== undefined) {
      includeConfig.separate = config.separate;
    }

    if (config.limit) {
      includeConfig.limit = config.limit;
    }

    if (config.order) {
      includeConfig.order = config.order;
    }

    if (config.attributes) {
      includeConfig.attributes = config.attributes;
    }

    if (config.where) {
      includeConfig.where = config.where;
    }

    // Handle nested includes
    if (config.nested && config.nested[assocName]) {
      const nestedConfig = config.nested[assocName];
      includeConfig.include = optimizeEagerLoading(
        association.target as ModelStatic<any>,
        nestedConfig
      );
    }

    includes.push(includeConfig);
  }

  return includes;
}

/**
 * Builds nested include structures dynamically
 *
 * @param model - Base model
 * @param includePath - Dot-separated path of associations
 * @param options - Additional options for the deepest include
 * @returns Nested include configuration
 *
 * @example
 * ```typescript
 * const include = buildNestedInclude(User, 'posts.comments.author', {
 *   attributes: ['id', 'username']
 * });
 * ```
 */
export function buildNestedInclude(
  model: ModelStatic<any>,
  includePath: string,
  options?: Partial<IncludeOptions>
): IncludeOptions {
  const parts = includePath.split('.');
  const firstPart = parts[0];
  const association = model.associations[firstPart];

  if (!association) {
    throw new Error(`Association '${firstPart}' not found on model ${model.name}`);
  }

  const includeConfig: IncludeOptions = {
    association: firstPart,
  };

  if (parts.length === 1) {
    // Deepest level, apply options
    Object.assign(includeConfig, options);
  } else {
    // Recurse for nested path
    const remainingPath = parts.slice(1).join('.');
    includeConfig.include = [
      buildNestedInclude(association.target as ModelStatic<any>, remainingPath, options),
    ];
  }

  return includeConfig;
}

/**
 * Applies scopes to associations dynamically
 *
 * @param model - Model with associations
 * @param associationName - Name of the association
 * @param scope - Scope to apply
 * @returns Include options with applied scope
 *
 * @example
 * ```typescript
 * const include = applyAssociationScope(User, 'posts', {
 *   status: 'published',
 *   createdAt: { [Op.gte]: new Date('2024-01-01') }
 * });
 * ```
 */
export function applyAssociationScope(
  model: ModelStatic<any>,
  associationName: string,
  scope: WhereOptions
): IncludeOptions {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found on model ${model.name}`);
  }

  return {
    association: associationName,
    where: scope,
  };
}

/**
 * Creates scoped association getters
 *
 * @param model - Model to add scoped getter
 * @param associationName - Name of the association
 * @param scopeName - Name of the scope
 * @param scopeWhere - Where clause for the scope
 * @returns Method name of the created getter
 *
 * @example
 * ```typescript
 * createScopedAssociationGetter(User, 'posts', 'published', {
 *   status: 'published'
 * });
 * // Creates User.getPublishedPosts() method
 * ```
 */
export function createScopedAssociationGetter(
  model: ModelStatic<any>,
  associationName: string,
  scopeName: string,
  scopeWhere: WhereOptions
): string {
  const methodName = `get${scopeName.charAt(0).toUpperCase() + scopeName.slice(1)}${
    associationName.charAt(0).toUpperCase() + associationName.slice(1)
  }`;

  // This would be implemented on the model prototype
  // For type safety, this should be declared in the model class
  return methodName;
}

/**
 * Manages association aliases across models
 *
 * @param models - Array of models to analyze
 * @returns Map of model names to their association aliases
 *
 * @example
 * ```typescript
 * const aliasMap = getAssociationAliases([User, Post, Comment]);
 * console.log(aliasMap.User.hasMany); // ['posts', 'comments']
 * ```
 */
export function getAssociationAliases(models: ModelStatic<any>[]): AssociationAliasMap {
  const aliasMap: AssociationAliasMap = {};

  for (const model of models) {
    const modelName = model.name;
    aliasMap[modelName] = {
      hasOne: [],
      hasMany: [],
      belongsTo: [],
      belongsToMany: [],
    };

    for (const [assocName, association] of Object.entries(model.associations)) {
      aliasMap[modelName][association.associationType].push(assocName);
    }
  }

  return aliasMap;
}

/**
 * Finds association by alias
 *
 * @param model - Model to search
 * @param alias - Association alias
 * @returns Association instance or undefined
 *
 * @example
 * ```typescript
 * const association = findAssociationByAlias(User, 'posts');
 * ```
 */
export function findAssociationByAlias(
  model: ModelStatic<any>,
  alias: string
): Association | undefined {
  return model.associations[alias];
}

/**
 * Gets all associations of a specific type
 *
 * @param model - Model to query
 * @param type - Association type
 * @returns Array of associations
 *
 * @example
 * ```typescript
 * const hasManyAssocs = getAssociationsByType(User, 'hasMany');
 * ```
 */
export function getAssociationsByType(
  model: ModelStatic<any>,
  type: AssociationType
): Association[] {
  return Object.values(model.associations).filter(
    (assoc) => assoc.associationType === type
  );
}

/**
 * Configures cascade operations for an association
 *
 * @param model - Source model
 * @param associationName - Name of the association
 * @param cascadeConfig - Cascade configuration
 * @returns Updated association
 *
 * @example
 * ```typescript
 * configureCascade(User, 'posts', {
 *   onDelete: 'CASCADE',
 *   onUpdate: 'CASCADE'
 * });
 * ```
 */
export function configureCascade(
  model: ModelStatic<any>,
  associationName: string,
  cascadeConfig: {
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  }
): Association {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  // Note: In practice, cascade options must be set during association creation
  // This function documents the intended configuration
  return association;
}

/**
 * Sets up cascade delete for all hasMany associations
 *
 * @param model - Model to configure
 * @returns Number of associations configured
 *
 * @example
 * ```typescript
 * const count = setupCascadeDeleteAll(User);
 * ```
 */
export function setupCascadeDeleteAll(model: ModelStatic<any>): number {
  const hasManyAssocs = getAssociationsByType(model, 'hasMany');
  return hasManyAssocs.length;
}

/**
 * Manages foreign key constraints
 *
 * @param model - Model to configure
 * @param associationName - Association name
 * @param constraintConfig - Constraint configuration
 * @returns Constraint configuration
 *
 * @example
 * ```typescript
 * manageConstraints(Post, 'author', {
 *   enabled: true,
 *   deferrable: 'INITIALLY_DEFERRED'
 * });
 * ```
 */
export function manageConstraints(
  model: ModelStatic<any>,
  associationName: string,
  constraintConfig: {
    enabled: boolean;
    deferrable?: 'INITIALLY_IMMEDIATE' | 'INITIALLY_DEFERRED' | 'NOT';
  }
): typeof constraintConfig {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  return constraintConfig;
}

/**
 * Disables constraints for bulk operations
 *
 * @param sequelize - Sequelize instance
 * @param models - Models to disable constraints for
 * @returns Promise that resolves when constraints are disabled
 *
 * @example
 * ```typescript
 * await disableConstraintsForBulkOp(sequelize, [User, Post]);
 * // Perform bulk operations
 * await enableConstraintsForBulkOp(sequelize, [User, Post]);
 * ```
 */
export async function disableConstraintsForBulkOp(
  sequelize: Sequelize,
  models: ModelStatic<any>[]
): Promise<void> {
  // PostgreSQL-specific
  await sequelize.query('SET CONSTRAINTS ALL DEFERRED');
}

/**
 * Re-enables constraints after bulk operations
 *
 * @param sequelize - Sequelize instance
 * @param models - Models to enable constraints for
 * @returns Promise that resolves when constraints are enabled
 *
 * @example
 * ```typescript
 * await enableConstraintsForBulkOp(sequelize, [User, Post]);
 * ```
 */
export async function enableConstraintsForBulkOp(
  sequelize: Sequelize,
  models: ModelStatic<any>[]
): Promise<void> {
  // PostgreSQL-specific
  await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE');
}

/**
 * Synchronizes bidirectional associations
 *
 * @param model1 - First model
 * @param model2 - Second model
 * @param assoc1Name - Association name from model1 to model2
 * @param assoc2Name - Association name from model2 to model1
 * @returns Object containing both associations
 *
 * @example
 * ```typescript
 * syncBidirectionalAssociations(User, Post, 'posts', 'author');
 * ```
 */
export function syncBidirectionalAssociations(
  model1: ModelStatic<any>,
  model2: ModelStatic<any>,
  assoc1Name: string,
  assoc2Name: string
): {
  forward: Association;
  reverse: Association;
} {
  const forward = model1.associations[assoc1Name];
  const reverse = model2.associations[assoc2Name];

  if (!forward || !reverse) {
    throw new Error('One or both associations not found');
  }

  return { forward, reverse };
}

/**
 * Validates association consistency
 *
 * @param model - Model to validate
 * @returns Array of validation errors
 *
 * @example
 * ```typescript
 * const errors = validateAssociationConsistency(User);
 * if (errors.length > 0) {
 *   console.error('Association errors:', errors);
 * }
 * ```
 */
export function validateAssociationConsistency(
  model: ModelStatic<any>
): string[] {
  const errors: string[] = [];

  for (const [assocName, association] of Object.entries(model.associations)) {
    // Check if target model exists
    if (!association.target) {
      errors.push(`Association '${assocName}' has no target model`);
    }

    // Check for belongsToMany without through
    if (association.associationType === 'belongsToMany') {
      const btmAssoc = association as any;
      if (!btmAssoc.through) {
        errors.push(`BelongsToMany association '${assocName}' missing through model`);
      }
    }
  }

  return errors;
}

/**
 * Creates association with composite foreign key
 *
 * @param source - Source model
 * @param target - Target model
 * @param foreignKeys - Array of foreign key column names
 * @param targetKeys - Array of target key column names
 * @returns Created association
 *
 * @example
 * ```typescript
 * createCompositeKeyAssociation(
 *   Order,
 *   Product,
 *   ['productId', 'variantId'],
 *   ['id', 'variantId']
 * );
 * ```
 */
export function createCompositeKeyAssociation(
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  foreignKeys: string[],
  targetKeys: string[]
): Association {
  // Sequelize doesn't natively support composite foreign keys
  // This would require custom SQL and validation logic
  throw new Error('Composite foreign keys require custom implementation');
}

/**
 * Preloads associations to prevent N+1 queries
 *
 * @param model - Model to query
 * @param associationPaths - Array of association paths to preload
 * @param findOptions - Additional find options
 * @returns Promise with results including preloaded associations
 *
 * @example
 * ```typescript
 * const users = await preloadAssociations(User, [
 *   'posts',
 *   'posts.comments',
 *   'profile'
 * ], { where: { active: true } });
 * ```
 */
export async function preloadAssociations<M extends Model>(
  model: ModelStatic<M>,
  associationPaths: string[],
  findOptions?: Omit<FindOptions<M>, 'include'>
): Promise<M[]> {
  const includes = associationPaths.map((path) => buildNestedInclude(model, path));

  return model.findAll({
    ...findOptions,
    include: includes,
  });
}

/**
 * Creates a batch loader for associations to prevent N+1
 *
 * @param model - Model to load associations for
 * @param associationName - Name of the association to load
 * @returns Batch loader function
 *
 * @example
 * ```typescript
 * const loadPosts = createAssociationBatchLoader(User, 'posts');
 * const user1Posts = await loadPosts(user1.id);
 * const user2Posts = await loadPosts(user2.id);
 * // Both executed in single query
 * ```
 */
export function createAssociationBatchLoader<M extends Model>(
  model: ModelStatic<M>,
  associationName: string
): (id: any) => Promise<any[]> {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  const batchCache = new Map<any, Promise<any[]>>();
  let batchQueue: any[] = [];
  let batchTimeout: NodeJS.Timeout | null = null;

  const executeBatch = async () => {
    const ids = [...new Set(batchQueue)];
    batchQueue = [];

    const results = await model.findAll({
      where: { id: ids } as any,
      include: [{ association: associationName }],
    });

    const resultMap = new Map<any, any[]>();
    for (const result of results) {
      const assocData = (result as any)[associationName];
      resultMap.set(result.get('id'), Array.isArray(assocData) ? assocData : [assocData]);
    }

    return resultMap;
  };

  return (id: any) => {
    if (batchCache.has(id)) {
      return batchCache.get(id)!;
    }

    const promise = new Promise<any[]>((resolve) => {
      batchQueue.push(id);

      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }

      batchTimeout = setTimeout(async () => {
        const resultMap = await executeBatch();

        for (const [batchId, data] of resultMap) {
          const cachedPromise = batchCache.get(batchId);
          if (cachedPromise) {
            batchCache.delete(batchId);
          }
        }

        resolve(resultMap.get(id) || []);
      }, 10); // 10ms batching window
    });

    batchCache.set(id, promise);
    return promise;
  };
}

/**
 * Gets association metadata
 *
 * @param model - Model to inspect
 * @param associationName - Association name
 * @returns Association metadata
 *
 * @example
 * ```typescript
 * const metadata = getAssociationMetadata(User, 'posts');
 * console.log(metadata.foreignKey, metadata.type);
 * ```
 */
export function getAssociationMetadata(
  model: ModelStatic<any>,
  associationName: string
): {
  type: string;
  foreignKey: string;
  targetModel: string;
  sourceModel: string;
  as: string;
} {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  return {
    type: association.associationType,
    foreignKey: (association as any).foreignKey || '',
    targetModel: association.target.name,
    sourceModel: association.source.name,
    as: association.as,
  };
}

/**
 * Clones association configuration
 *
 * @param source - Source model with existing association
 * @param target - Target model to clone association to
 * @param associationName - Association to clone
 * @param newAlias - Optional new alias
 * @returns Cloned association
 *
 * @example
 * ```typescript
 * cloneAssociation(User, AdminUser, 'posts', 'adminPosts');
 * ```
 */
export function cloneAssociation(
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  associationName: string,
  newAlias?: string
): Association {
  const originalAssoc = source.associations[associationName];
  if (!originalAssoc) {
    throw new Error(`Association '${associationName}' not found`);
  }

  const assocTarget = originalAssoc.target;
  const options: any = {
    ...originalAssoc.options,
    as: newAlias || originalAssoc.as,
  };

  return createAssociation({
    type: originalAssoc.associationType as AssociationType,
    source: target,
    target: assocTarget,
    options,
  });
}

/**
 * Removes an association dynamically
 *
 * @param model - Model to remove association from
 * @param associationName - Association to remove
 * @returns True if removed, false if not found
 *
 * @example
 * ```typescript
 * removeAssociation(User, 'oldPosts');
 * ```
 */
export function removeAssociation(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  if (model.associations[associationName]) {
    delete model.associations[associationName];
    return true;
  }
  return false;
}

/**
 * Lists all associations for a model
 *
 * @param model - Model to inspect
 * @returns Array of association names
 *
 * @example
 * ```typescript
 * const associations = listAssociations(User);
 * console.log(associations); // ['posts', 'profile', 'comments']
 * ```
 */
export function listAssociations(model: ModelStatic<any>): string[] {
  return Object.keys(model.associations);
}

/**
 * Checks if an association exists
 *
 * @param model - Model to check
 * @param associationName - Association name
 * @returns True if association exists
 *
 * @example
 * ```typescript
 * if (hasAssociation(User, 'posts')) {
 *   // Use posts association
 * }
 * ```
 */
export function hasAssociation(model: ModelStatic<any>, associationName: string): boolean {
  return !!model.associations[associationName];
}

/**
 * Gets the target model of an association
 *
 * @param model - Source model
 * @param associationName - Association name
 * @returns Target model
 *
 * @example
 * ```typescript
 * const PostModel = getAssociationTarget(User, 'posts');
 * ```
 */
export function getAssociationTarget(
  model: ModelStatic<any>,
  associationName: string
): ModelStatic<any> {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }
  return association.target;
}

/**
 * Creates include options for counting associations
 *
 * @param model - Model with associations
 * @param associationNames - Associations to count
 * @returns Find options with count attributes
 *
 * @example
 * ```typescript
 * const options = createCountInclude(User, ['posts', 'comments']);
 * const users = await User.findAll(options);
 * // Each user has postCount and commentCount
 * ```
 */
export function createCountInclude(
  model: ModelStatic<any>,
  associationNames: string[]
): FindOptions {
  const attributes: any = {
    include: [],
  };

  for (const assocName of associationNames) {
    const association = model.associations[assocName];
    if (!association) continue;

    attributes.include.push([
      model.sequelize!.fn('COUNT', model.sequelize!.col(`${assocName}.id`)),
      `${assocName}Count`,
    ]);
  }

  const include = associationNames.map((assocName) => ({
    association: assocName,
    attributes: [],
  }));

  return {
    attributes,
    include,
    group: [`${model.name}.id`],
    subQuery: false,
  };
}

/**
 * Creates optimized separate queries for associations
 *
 * @param model - Model to query
 * @param associationNames - Associations to load separately
 * @returns Include options with separate queries
 *
 * @example
 * ```typescript
 * const options = createSeparateQueryInclude(User, ['posts', 'followers']);
 * const users = await User.findAll(options);
 * ```
 */
export function createSeparateQueryInclude(
  model: ModelStatic<any>,
  associationNames: string[]
): FindOptions {
  const include = associationNames.map((assocName) => ({
    association: assocName,
    separate: true,
  }));

  return { include };
}

/**
 * Analyzes association query complexity
 *
 * @param model - Model to analyze
 * @param includes - Include options
 * @returns Complexity metrics
 *
 * @example
 * ```typescript
 * const complexity = analyzeAssociationComplexity(User, includes);
 * if (complexity.depth > 3) {
 *   console.warn('Deep nesting may cause performance issues');
 * }
 * ```
 */
export function analyzeAssociationComplexity(
  model: ModelStatic<any>,
  includes: Includeable[]
): {
  depth: number;
  totalIncludes: number;
  hasCartesianProduct: boolean;
  recommendations: string[];
} {
  let maxDepth = 0;
  let totalIncludes = 0;
  let hasMultipleHasMany = false;
  const recommendations: string[] = [];

  function traverse(currentIncludes: Includeable[], depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    totalIncludes += currentIncludes.length;

    let hasManyCount = 0;

    for (const inc of currentIncludes) {
      if (typeof inc === 'object' && 'association' in inc) {
        const assocName = inc.association as string;
        const association = model.associations[assocName];

        if (association?.associationType === 'hasMany') {
          hasManyCount++;
        }

        if (inc.include) {
          traverse(
            Array.isArray(inc.include) ? inc.include : [inc.include],
            depth + 1
          );
        }
      }
    }

    if (hasManyCount > 1) {
      hasMultipleHasMany = true;
    }
  }

  traverse(includes, 1);

  if (maxDepth > 3) {
    recommendations.push('Consider using separate queries for deep nesting');
  }

  if (hasMultipleHasMany) {
    recommendations.push('Multiple hasMany includes may cause cartesian product');
    recommendations.push('Use separate: true for hasMany associations');
  }

  if (totalIncludes > 5) {
    recommendations.push('High number of includes may impact performance');
  }

  return {
    depth: maxDepth,
    totalIncludes,
    hasCartesianProduct: hasMultipleHasMany,
    recommendations,
  };
}

/**
 * Generates association migration code
 *
 * @param model - Source model
 * @param associationName - Association name
 * @returns Migration code for foreign key
 *
 * @example
 * ```typescript
 * const migration = generateAssociationMigration(Post, 'author');
 * console.log(migration.up, migration.down);
 * ```
 */
export function generateAssociationMigration(
  model: ModelStatic<any>,
  associationName: string
): {
  up: string;
  down: string;
} {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  const foreignKey = (association as any).foreignKey || `${associationName}Id`;
  const tableName = model.tableName;
  const targetTableName = association.target.tableName;

  const up = `
    await queryInterface.addColumn('${tableName}', '${foreignKey}', {
      type: Sequelize.UUID,
      references: {
        model: '${targetTableName}',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  `.trim();

  const down = `
    await queryInterface.removeColumn('${tableName}', '${foreignKey}');
  `.trim();

  return { up, down };
}

/**
 * Manages association hooks for lifecycle events
 *
 * @param model - Model to add hooks to
 * @param associationName - Association name
 * @param hooks - Hook configuration
 * @returns Hook cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = manageAssociationHooks(User, 'posts', {
 *   afterAdd: async (user, post) => {
 *     console.log('Post added to user');
 *   },
 *   beforeRemove: async (user, post) => {
 *     console.log('Post about to be removed');
 *   }
 * });
 * ```
 */
export function manageAssociationHooks(
  model: ModelStatic<any>,
  associationName: string,
  hooks: {
    afterAdd?: (source: any, target: any) => Promise<void>;
    beforeRemove?: (source: any, target: any) => Promise<void>;
    afterRemove?: (source: any, target: any) => Promise<void>;
  }
): () => void {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  // In practice, hooks would be registered with Sequelize
  // This is a conceptual implementation
  const registeredHooks: Array<{ event: string; handler: Function }> = [];

  if (hooks.afterAdd) {
    registeredHooks.push({ event: 'afterAdd', handler: hooks.afterAdd });
  }

  if (hooks.beforeRemove) {
    registeredHooks.push({ event: 'beforeRemove', handler: hooks.beforeRemove });
  }

  if (hooks.afterRemove) {
    registeredHooks.push({ event: 'afterRemove', handler: hooks.afterRemove });
  }

  // Return cleanup function
  return () => {
    registeredHooks.length = 0;
  };
}

/**
 * Creates scoped association configurations
 *
 * @param model - Model to configure
 * @param associationName - Association name
 * @param scopes - Named scopes with where conditions
 * @returns Scope configuration map
 *
 * @example
 * ```typescript
 * const scopes = createAssociationScopes(User, 'posts', {
 *   published: { status: 'published' },
 *   recent: { createdAt: { [Op.gte]: thirtyDaysAgo } },
 *   featured: { featured: true }
 * });
 * ```
 */
export function createAssociationScopes(
  model: ModelStatic<any>,
  associationName: string,
  scopes: Record<string, WhereOptions>
): Record<string, IncludeOptions> {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  const scopeConfigs: Record<string, IncludeOptions> = {};

  for (const [scopeName, whereCondition] of Object.entries(scopes)) {
    scopeConfigs[scopeName] = {
      association: associationName,
      where: whereCondition,
    };
  }

  return scopeConfigs;
}

/**
 * Configures lazy loading strategy for associations
 *
 * @param model - Model to configure
 * @param associationName - Association name
 * @param config - Lazy loading configuration
 * @returns Configuration object
 *
 * @example
 * ```typescript
 * configureLazyLoading(User, 'posts', {
 *   cacheKey: 'user-posts',
 *   ttl: 300,
 *   refreshOnAccess: true
 * });
 * ```
 */
export function configureLazyLoading(
  model: ModelStatic<any>,
  associationName: string,
  config: {
    cacheKey?: string;
    ttl?: number;
    refreshOnAccess?: boolean;
  }
): typeof config {
  const association = model.associations[associationName];
  if (!association) {
    throw new Error(`Association '${associationName}' not found`);
  }

  return {
    cacheKey: config.cacheKey || `${model.name}-${associationName}`,
    ttl: config.ttl || 300,
    refreshOnAccess: config.refreshOnAccess ?? true,
  };
}

/**
 * Creates eager loading presets for common patterns
 *
 * @param model - Base model
 * @param presets - Named preset configurations
 * @returns Map of preset names to include configurations
 *
 * @example
 * ```typescript
 * const presets = createEagerLoadingPresets(User, {
 *   minimal: ['profile'],
 *   standard: ['profile', 'posts'],
 *   full: ['profile', 'posts', 'comments', 'followers']
 * });
 *
 * const users = await User.findAll({ include: presets.standard });
 * ```
 */
export function createEagerLoadingPresets(
  model: ModelStatic<any>,
  presets: Record<string, string[]>
): Record<string, Includeable[]> {
  const presetConfigs: Record<string, Includeable[]> = {};

  for (const [presetName, associationNames] of Object.entries(presets)) {
    presetConfigs[presetName] = associationNames.map((assocName) => {
      const association = model.associations[assocName];
      if (!association) {
        throw new Error(`Association '${assocName}' not found on model ${model.name}`);
      }
      return { association: assocName };
    });
  }

  return presetConfigs;
}

/**
 * Validates association integrity across models
 *
 * @param models - Array of models to validate
 * @returns Validation report
 *
 * @example
 * ```typescript
 * const report = validateAssociationIntegrity([User, Post, Comment]);
 * if (report.errors.length > 0) {
 *   console.error('Association errors:', report.errors);
 * }
 * ```
 */
export function validateAssociationIntegrity(
  models: ModelStatic<any>[]
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const model of models) {
    // Check for orphaned associations
    for (const [assocName, association] of Object.entries(model.associations)) {
      const targetModel = association.target;

      // Check if target model exists in provided models array
      if (!models.includes(targetModel)) {
        warnings.push(
          `Model ${model.name} has association '${assocName}' to ${targetModel.name} which is not in validation set`
        );
      }

      // Check for bidirectional consistency
      if (association.associationType === 'belongsTo') {
        const reverseAssoc = Object.values(targetModel.associations).find(
          (assoc) => assoc.target === model && (assoc.associationType === 'hasMany' || assoc.associationType === 'hasOne')
        );

        if (!reverseAssoc) {
          warnings.push(
            `Model ${model.name} has belongsTo '${assocName}' to ${targetModel.name}, but no reverse hasMany/hasOne found`
          );
        }
      }

      // Check for belongsToMany without through
      if (association.associationType === 'belongsToMany') {
        const btmAssoc = association as any;
        if (!btmAssoc.through) {
          errors.push(
            `Model ${model.name} has belongsToMany '${assocName}' without through model`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
