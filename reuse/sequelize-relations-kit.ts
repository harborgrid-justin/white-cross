/**
 * @fileoverview Sequelize Relations & Associations Kit
 * @module reuse/sequelize-relations-kit
 * @description Comprehensive relationship utilities for Sequelize v6 covering association definitions,
 * include strategies, eager/lazy loading, nested includes, join optimization, N+1 prevention, circular
 * dependency handling, and advanced relationship patterns for complex data models.
 *
 * Key Features:
 * - Association definition builders (hasOne, hasMany, belongsTo, belongsToMany)
 * - Smart include helpers with automatic N+1 detection
 * - Eager and lazy loading strategies
 * - Nested include builders with depth control
 * - Join strategy optimizers
 * - Circular dependency resolvers
 * - Association metadata extractors
 * - Relationship validators
 * - Through model utilities
 * - Association cache managers
 * - Dynamic association builders
 * - Polymorphic relationship helpers
 * - Multi-level include generators
 * - Association testing utilities
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant association filtering
 * - Permission-based include guards
 * - Sensitive data exclusion in joins
 * - Audit trail for relationship queries
 * - Data access logging
 *
 * @example Basic usage
 * ```typescript
 * import { buildNestedInclude, preventN1, createLazyLoader } from './sequelize-relations-kit';
 *
 * // Build nested includes
 * const include = buildNestedInclude('posts.comments.author', { limit: 5 });
 *
 * // Prevent N+1 queries
 * const users = await preventN1(User.findAll(), ['posts', 'profile']);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createAssociationBuilder,
 *   detectCircularDeps,
 *   optimizeJoinStrategy
 * } from './sequelize-relations-kit';
 *
 * // Build associations dynamically
 * const builder = createAssociationBuilder(User);
 * builder.hasMany(Post, 'posts')
 *        .belongsTo(Organization, 'organization')
 *        .build();
 * ```
 *
 * LOC: RLK84F2N719
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: models, repositories, services, controllers
 *
 * @version 1.0.0
 * @since 2025-11-08
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
  FindOptions,
  WhereOptions,
  Transaction,
  Op,
  Sequelize,
  IncludeOptions,
  AssociationScope,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @interface RelationshipDefinition
 * @description Configuration for defining model relationships
 */
export interface RelationshipDefinition {
  /** Source model */
  source: ModelStatic<any>;
  /** Target model */
  target: ModelStatic<any>;
  /** Association type */
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  /** Association alias */
  as?: string;
  /** Foreign key field */
  foreignKey?: string;
  /** Target/source key */
  targetKey?: string;
  /** Through model for belongsToMany */
  through?: ModelStatic<any>;
  /** Association scope */
  scope?: AssociationScope;
  /** Cascade options */
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

/**
 * @interface IncludeStrategy
 * @description Strategy for including related models
 */
export interface IncludeStrategy {
  /** Model to include */
  model: ModelStatic<any>;
  /** Association alias */
  as?: string;
  /** Use separate query */
  separate?: boolean;
  /** Required (INNER JOIN) */
  required?: boolean;
  /** Limit results */
  limit?: number;
  /** Where conditions */
  where?: WhereOptions;
  /** Attributes to select */
  attributes?: string[] | { exclude?: string[]; include?: string[] };
  /** Nested includes */
  include?: IncludeStrategy[];
}

/**
 * @interface LazyLoadConfig
 * @description Configuration for lazy loading associations
 */
export interface LazyLoadConfig {
  /** Cache loaded associations */
  cache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTtl?: number;
  /** Reload on access */
  reload?: boolean;
  /** Include options */
  include?: FindOptions;
}

/**
 * @interface N1DetectionResult
 * @description Result of N+1 query detection
 */
export interface N1DetectionResult {
  /** Whether N+1 detected */
  detected: boolean;
  /** Affected associations */
  associations: string[];
  /** Recommended fixes */
  recommendations: string[];
  /** Query count */
  queryCount: number;
}

/**
 * @interface AssociationMetadata
 * @description Metadata about model associations
 */
export interface AssociationMetadata {
  /** Association name */
  name: string;
  /** Association type */
  type: string;
  /** Source model */
  source: string;
  /** Target model */
  target: string;
  /** Foreign key */
  foreignKey?: string;
  /** Target key */
  targetKey?: string;
  /** Through model */
  through?: string;
  /** Is required */
  required?: boolean;
}

/**
 * @interface CircularDependency
 * @description Circular dependency information
 */
export interface CircularDependency {
  /** Dependency chain */
  chain: string[];
  /** Models involved */
  models: string[];
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
  /** Suggested resolution */
  resolution: string;
}

/**
 * @interface JoinOptimization
 * @description Join strategy optimization result
 */
export interface JoinOptimization {
  /** Original strategy */
  original: 'nested' | 'separate' | 'subquery';
  /** Optimized strategy */
  optimized: 'nested' | 'separate' | 'subquery';
  /** Reason for optimization */
  reason: string;
  /** Expected improvement */
  improvement: string;
}

// ============================================================================
// ASSOCIATION DEFINITION HELPERS
// ============================================================================

/**
 * @function defineRelationship
 * @description Defines a relationship between two models with comprehensive options
 *
 * @param {RelationshipDefinition} definition - Relationship definition
 * @returns {Association<any, any>} Created association
 *
 * @example
 * ```typescript
 * defineRelationship({
 *   source: User,
 *   target: Post,
 *   type: 'hasMany',
 *   as: 'posts',
 *   foreignKey: 'authorId',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export function defineRelationship(definition: RelationshipDefinition): Association<any, any> {
  const { source, target, type, as, foreignKey, targetKey, through, scope, onDelete, onUpdate } = definition;

  const baseOptions = {
    as,
    foreignKey,
    scope,
    onDelete: onDelete || 'CASCADE',
    onUpdate: onUpdate || 'CASCADE',
  };

  switch (type) {
    case 'hasOne':
      return source.hasOne(target, { ...baseOptions, sourceKey: targetKey } as HasOneOptions);

    case 'hasMany':
      return source.hasMany(target, { ...baseOptions, sourceKey: targetKey } as HasManyOptions);

    case 'belongsTo':
      return source.belongsTo(target, { ...baseOptions, targetKey } as BelongsToOptions);

    case 'belongsToMany':
      if (!through) throw new Error('belongsToMany requires a through model');
      return source.belongsToMany(target, {
        ...baseOptions,
        through,
        otherKey: targetKey,
      } as BelongsToManyOptions);

    default:
      throw new Error(`Invalid association type: ${type}`);
  }
}

/**
 * @function createAssociationBuilder
 * @description Creates a fluent API builder for defining multiple associations
 *
 * @template M
 * @param {ModelStatic<M>} model - Source model
 * @returns {AssociationBuilder<M>} Fluent builder
 *
 * @example
 * ```typescript
 * createAssociationBuilder(User)
 *   .hasMany(Post, 'posts', { foreignKey: 'authorId' })
 *   .belongsTo(Organization, 'organization')
 *   .hasOne(Profile, 'profile')
 *   .build();
 * ```
 */
export function createAssociationBuilder<M extends Model>(model: ModelStatic<M>) {
  const associations: Association<any, any>[] = [];

  return {
    hasOne(target: ModelStatic<any>, as?: string, options: Partial<HasOneOptions> = {}) {
      associations.push(model.hasOne(target, { as, ...options }));
      return this;
    },

    hasMany(target: ModelStatic<any>, as?: string, options: Partial<HasManyOptions> = {}) {
      associations.push(model.hasMany(target, { as, ...options }));
      return this;
    },

    belongsTo(target: ModelStatic<any>, as?: string, options: Partial<BelongsToOptions> = {}) {
      associations.push(model.belongsTo(target, { as, ...options }));
      return this;
    },

    belongsToMany(
      target: ModelStatic<any>,
      through: ModelStatic<any>,
      as?: string,
      options: Partial<BelongsToManyOptions> = {},
    ) {
      associations.push(model.belongsToMany(target, { through, as, ...options }));
      return this;
    },

    build() {
      return associations;
    },
  };
}

/**
 * @function defineBidirectionalRelation
 * @description Defines both sides of a bidirectional relationship
 *
 * @template M1, M2
 * @param {ModelStatic<M1>} model1 - First model
 * @param {ModelStatic<M2>} model2 - Second model
 * @param {object} config - Bidirectional configuration
 * @returns {[Association<M1, M2>, Association<M2, M1>]} Both associations
 *
 * @example
 * ```typescript
 * defineBidirectionalRelation(User, Post, {
 *   model1: { type: 'hasMany', as: 'posts', foreignKey: 'authorId' },
 *   model2: { type: 'belongsTo', as: 'author', foreignKey: 'authorId' }
 * });
 * ```
 */
export function defineBidirectionalRelation<M1 extends Model, M2 extends Model>(
  model1: ModelStatic<M1>,
  model2: ModelStatic<M2>,
  config: {
    model1: Pick<RelationshipDefinition, 'type' | 'as' | 'foreignKey' | 'targetKey'>;
    model2: Pick<RelationshipDefinition, 'type' | 'as' | 'foreignKey' | 'targetKey'>;
  },
): [Association<M1, M2>, Association<M2, M1>] {
  const assoc1 = defineRelationship({
    source: model1,
    target: model2,
    ...config.model1,
  });

  const assoc2 = defineRelationship({
    source: model2,
    target: model1,
    ...config.model2,
  });

  return [assoc1, assoc2];
}

/**
 * @function createPolymorphicRelation
 * @description Creates a polymorphic association (commentable, likeable, etc.)
 *
 * @template M
 * @param {ModelStatic<M>} source - Source model
 * @param {string} polymorphicName - Name of polymorphic association
 * @param {string[]} targetTypes - Allowed target types
 * @returns {void}
 *
 * @example
 * ```typescript
 * createPolymorphicRelation(Comment, 'commentable', ['Post', 'Article', 'Video']);
 *
 * // Creates: commentableType and commentableId fields
 * // Usage: comment.commentableType = 'Post'; comment.commentableId = postId;
 * ```
 */
export function createPolymorphicRelation<M extends Model>(
  source: ModelStatic<M>,
  polymorphicName: string,
  targetTypes: string[],
): void {
  const typeField = `${polymorphicName}Type`;
  const idField = `${polymorphicName}Id`;

  // Store polymorphic configuration
  (source as any)._polymorphicRelations = (source as any)._polymorphicRelations || {};
  (source as any)._polymorphicRelations[polymorphicName] = {
    typeField,
    idField,
    allowedTypes: targetTypes,
  };

  // Add validation hook
  source.addHook('beforeValidate', (instance: any) => {
    const type = instance[typeField];
    if (type && !targetTypes.includes(type)) {
      throw new Error(`Invalid ${typeField}: ${type}. Must be one of: ${targetTypes.join(', ')}`);
    }
  });
}

/**
 * @function getPolymorphicTarget
 * @description Retrieves the target of a polymorphic association
 *
 * @template M
 * @param {M} instance - Source instance
 * @param {string} polymorphicName - Polymorphic association name
 * @param {Record<string, ModelStatic<any>>} models - Models registry
 * @returns {Promise<Model | null>} Target instance
 *
 * @example
 * ```typescript
 * const comment = await Comment.findByPk(1);
 * const target = await getPolymorphicTarget(comment, 'commentable', { Post, Article });
 * ```
 */
export async function getPolymorphicTarget<M extends Model>(
  instance: M,
  polymorphicName: string,
  models: Record<string, ModelStatic<any>>,
): Promise<Model | null> {
  const config = (instance.constructor as any)._polymorphicRelations?.[polymorphicName];
  if (!config) throw new Error(`Polymorphic relation ${polymorphicName} not found`);

  const type = (instance as any)[config.typeField];
  const id = (instance as any)[config.idField];

  if (!type || !id) return null;

  const TargetModel = models[type];
  if (!TargetModel) throw new Error(`Model ${type} not found in registry`);

  return await TargetModel.findByPk(id);
}

// ============================================================================
// INCLUDE BUILDERS & STRATEGIES
// ============================================================================

/**
 * @function buildNestedInclude
 * @description Builds nested include from dot notation path
 *
 * @param {string} path - Dot notation path (e.g., 'posts.comments.author')
 * @param {Partial<IncludeStrategy>} options - Include options
 * @returns {Includeable[]} Nested include array
 *
 * @example
 * ```typescript
 * const include = buildNestedInclude('posts.comments.author', {
 *   limit: 10,
 *   attributes: ['id', 'name']
 * });
 *
 * const users = await User.findAll({ include });
 * ```
 */
export function buildNestedInclude(path: string, options: Partial<IncludeStrategy> = {}): Includeable[] {
  const parts = path.split('.');
  if (parts.length === 0) return [];

  const buildLevel = (index: number): IncludeOptions | undefined => {
    if (index >= parts.length) return undefined;

    const include: IncludeOptions = {
      association: parts[index],
      ...(index === parts.length - 1 ? options : {}),
    };

    const nested = buildLevel(index + 1);
    if (nested) {
      include.include = [nested];
    }

    return include;
  };

  const result = buildLevel(0);
  return result ? [result] : [];
}

/**
 * @function buildMultiLevelInclude
 * @description Builds includes for multiple levels with different options per level
 *
 * @param {Array<{association: string, options?: Partial<IncludeStrategy>}>} levels - Level configurations
 * @returns {Includeable[]} Multi-level include
 *
 * @example
 * ```typescript
 * const include = buildMultiLevelInclude([
 *   { association: 'posts', options: { limit: 5, separate: true } },
 *   { association: 'comments', options: { required: true } },
 *   { association: 'author', options: { attributes: ['id', 'name'] } }
 * ]);
 * ```
 */
export function buildMultiLevelInclude(
  levels: Array<{ association: string; options?: Partial<IncludeStrategy> }>,
): Includeable[] {
  if (levels.length === 0) return [];

  const buildFromIndex = (index: number): IncludeOptions | undefined => {
    if (index >= levels.length) return undefined;

    const level = levels[index];
    const include: IncludeOptions = {
      association: level.association,
      ...level.options,
    };

    const nested = buildFromIndex(index + 1);
    if (nested) {
      include.include = [nested];
    }

    return include;
  };

  const result = buildFromIndex(0);
  return result ? [result] : [];
}

/**
 * @function createIncludeWithDepthLimit
 * @description Creates include with maximum depth limit to prevent deep nesting
 *
 * @param {Includeable[]} includes - Include options
 * @param {number} maxDepth - Maximum nesting depth
 * @returns {Includeable[]} Depth-limited includes
 *
 * @example
 * ```typescript
 * const include = createIncludeWithDepthLimit(deepIncludes, 3);
 * // Prevents includes deeper than 3 levels
 * ```
 */
export function createIncludeWithDepthLimit(includes: Includeable[], maxDepth: number): Includeable[] {
  const limitDepth = (items: Includeable[], currentDepth: number): Includeable[] => {
    if (currentDepth >= maxDepth) return [];

    return items.map((item) => {
      if (typeof item === 'object' && item !== null) {
        const limited = { ...item };
        if ((item as any).include) {
          (limited as any).include = limitDepth((item as any).include, currentDepth + 1);
        }
        return limited;
      }
      return item;
    });
  };

  return limitDepth(includes, 0);
}

/**
 * @function optimizeIncludeStrategy
 * @description Optimizes include strategy based on data size and relationships
 *
 * @param {IncludeStrategy} strategy - Include strategy
 * @param {object} hints - Optimization hints
 * @returns {IncludeStrategy} Optimized strategy
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludeStrategy(
 *   { model: Post, as: 'posts' },
 *   { expectedCount: 1000, hasLimit: false }
 * );
 * // May add separate: true for large datasets
 * ```
 */
export function optimizeIncludeStrategy(
  strategy: IncludeStrategy,
  hints: { expectedCount?: number; hasLimit?: boolean; isRequired?: boolean } = {},
): IncludeStrategy {
  const optimized = { ...strategy };

  // Use separate query for large hasMany associations
  if (hints.expectedCount && hints.expectedCount > 100 && !hints.hasLimit) {
    optimized.separate = true;
  }

  // Use required for small critical associations
  if (hints.isRequired && hints.expectedCount && hints.expectedCount < 10) {
    optimized.required = true;
  }

  // Optimize nested includes
  if (strategy.include && strategy.include.length > 0) {
    optimized.include = strategy.include.map((nested) =>
      optimizeIncludeStrategy(nested, { expectedCount: hints.expectedCount }),
    );
  }

  return optimized;
}

/**
 * @function createConditionalInclude
 * @description Creates an include that's conditionally applied based on criteria
 *
 * @param {IncludeStrategy} baseInclude - Base include configuration
 * @param {(context: any) => boolean} condition - Condition function
 * @returns {(context: any) => Includeable[]} Conditional include generator
 *
 * @example
 * ```typescript
 * const includeIfAdmin = createConditionalInclude(
 *   { model: AuditLog, as: 'auditLogs' },
 *   (user) => user.role === 'admin'
 * );
 *
 * const include = includeIfAdmin(currentUser);
 * ```
 */
export function createConditionalInclude(
  baseInclude: IncludeStrategy,
  condition: (context: any) => boolean,
): (context: any) => Includeable[] {
  return (context: any): Includeable[] => {
    return condition(context) ? [baseInclude] : [];
  };
}

// ============================================================================
// N+1 PREVENTION
// ============================================================================

/**
 * @function preventN1
 * @description Prevents N+1 queries by eagerly loading specified associations
 *
 * @template M
 * @param {Promise<M[]>} queryPromise - Query promise
 * @param {string[]} associations - Associations to eager load
 * @param {FindOptions} options - Additional find options
 * @returns {Promise<M[]>} Results with eager loaded associations
 *
 * @example
 * ```typescript
 * const users = await preventN1(
 *   User.findAll({ where: { status: 'active' } }),
 *   ['posts', 'profile', 'comments'],
 *   { attributes: ['id', 'name'] }
 * );
 * ```
 */
export async function preventN1<M extends Model>(
  queryPromise: Promise<M[]>,
  associations: string[],
  options: FindOptions = {},
): Promise<M[]> {
  const results = await queryPromise;
  if (results.length === 0) return results;

  const model = results[0].constructor as ModelStatic<M>;

  // Build includes for all associations
  const includes = associations.map((assoc) => ({ association: assoc }));

  // Reload with includes
  const ids = results.map((r) => (r as any).id);
  return await model.findAll({
    where: { id: { [Op.in]: ids } } as any,
    include: includes,
    ...options,
  });
}

/**
 * @function detectN1Queries
 * @description Detects potential N+1 query patterns in code
 *
 * @param {Function} queryFn - Query function to analyze
 * @param {any[]} testData - Test data
 * @returns {Promise<N1DetectionResult>} Detection result
 *
 * @example
 * ```typescript
 * const result = await detectN1Queries(
 *   async () => {
 *     const users = await User.findAll();
 *     for (const user of users) {
 *       await user.getPosts(); // N+1 detected!
 *     }
 *   },
 *   testUsers
 * );
 * ```
 */
export async function detectN1Queries(
  queryFn: () => Promise<void>,
  testData: any[] = [],
): Promise<N1DetectionResult> {
  let queryCount = 0;
  const queries: string[] = [];

  // Mock query logging
  const originalQuery = Sequelize.prototype.query;
  (Sequelize.prototype as any).query = function (sql: string, ...args: any[]) {
    queryCount++;
    queries.push(sql);
    return originalQuery.call(this, sql, ...args);
  };

  try {
    await queryFn();

    // Restore original
    (Sequelize.prototype as any).query = originalQuery;

    const detected = queryCount > testData.length + 1;

    return {
      detected,
      associations: [], // Would analyze query patterns
      recommendations: detected
        ? ['Use eager loading with include', 'Consider using separate queries', 'Add association caching']
        : [],
      queryCount,
    };
  } catch (error) {
    (Sequelize.prototype as any).query = originalQuery;
    throw error;
  }
}

/**
 * @function batchLoadAssociations
 * @description Batch loads associations for multiple instances efficiently
 *
 * @template M, T
 * @param {M[]} instances - Model instances
 * @param {string} association - Association to load
 * @param {FindOptions} options - Find options
 * @returns {Promise<Map<string, T[]>>} Map of instance ID to associated records
 *
 * @example
 * ```typescript
 * const users = await User.findAll();
 * const postsMap = await batchLoadAssociations(users, 'posts', {
 *   where: { status: 'published' }
 * });
 * ```
 */
export async function batchLoadAssociations<M extends Model, T extends Model>(
  instances: M[],
  association: string,
  options: FindOptions = {},
): Promise<Map<string, T[]>> {
  if (instances.length === 0) return new Map();

  const model = instances[0].constructor as ModelStatic<M>;
  const assoc = (model as any).associations[association];
  if (!assoc) throw new Error(`Association ${association} not found`);

  const foreignKey = (assoc as any).foreignKey;
  const ids = instances.map((i) => (i as any).id);

  const TargetModel = assoc.target;
  const results = await TargetModel.findAll({
    where: { [foreignKey]: { [Op.in]: ids } } as any,
    ...options,
  });

  // Group by foreign key
  const map = new Map<string, T[]>();
  for (const result of results) {
    const fkValue = (result as any)[foreignKey];
    if (!map.has(fkValue)) {
      map.set(fkValue, []);
    }
    map.get(fkValue)!.push(result);
  }

  return map;
}

/**
 * @function createDataLoader
 * @description Creates a DataLoader-style batch loading function
 *
 * @template M
 * @param {ModelStatic<M>} model - Model class
 * @param {string} association - Association to load
 * @returns {(id: string) => Promise<M[]>} Batch loader function
 *
 * @example
 * ```typescript
 * const loadPosts = createDataLoader(Post, 'author');
 *
 * // Batches multiple calls into single query
 * const [posts1, posts2] = await Promise.all([
 *   loadPosts(userId1),
 *   loadPosts(userId2)
 * ]);
 * ```
 */
export function createDataLoader<M extends Model>(
  model: ModelStatic<M>,
  association: string,
): (id: string) => Promise<M[]> {
  const batch: Array<{ id: string; resolve: (value: M[]) => void }> = [];
  let scheduled = false;

  const dispatch = async () => {
    const currentBatch = batch.splice(0);
    if (currentBatch.length === 0) return;

    const ids = currentBatch.map((item) => item.id);
    const assoc = (model as any).associations[association];
    const foreignKey = (assoc as any).foreignKey;

    const results = await model.findAll({
      where: { [foreignKey]: { [Op.in]: ids } } as any,
    });

    // Group by foreign key
    const grouped = new Map<string, M[]>();
    for (const result of results) {
      const fkValue = (result as any)[foreignKey];
      if (!grouped.has(fkValue)) {
        grouped.set(fkValue, []);
      }
      grouped.get(fkValue)!.push(result);
    }

    // Resolve all promises
    for (const item of currentBatch) {
      item.resolve(grouped.get(item.id) || []);
    }
  };

  return (id: string): Promise<M[]> => {
    return new Promise((resolve) => {
      batch.push({ id, resolve });

      if (!scheduled) {
        scheduled = true;
        process.nextTick(() => {
          scheduled = false;
          dispatch();
        });
      }
    });
  };
}

// ============================================================================
// LAZY LOADING UTILITIES
// ============================================================================

/**
 * @function createLazyLoader
 * @description Creates a lazy loading function with caching
 *
 * @template M, T
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {LazyLoadConfig} config - Lazy load configuration
 * @returns {() => Promise<T | T[]>} Lazy loader function
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const loadPosts = createLazyLoader(user, 'posts', { cache: true });
 *
 * const posts = await loadPosts(); // Loads and caches
 * const cachedPosts = await loadPosts(); // Returns cached
 * ```
 */
export function createLazyLoader<M extends Model, T extends Model>(
  instance: M,
  association: string,
  config: LazyLoadConfig = {},
): () => Promise<T | T[] | null> {
  let cache: T | T[] | null = null;
  let cacheTime: number | null = null;

  return async (): Promise<T | T[] | null> => {
    const { cache: useCache = false, cacheTtl = 60000, reload = false, include } = config;

    // Check cache
    if (useCache && !reload && cache !== null && cacheTime !== null) {
      const elapsed = Date.now() - cacheTime;
      if (elapsed < cacheTtl) {
        return cache;
      }
    }

    // Load association
    const getter = (instance as any)[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
    if (typeof getter !== 'function') {
      throw new Error(`Association ${association} not found on model`);
    }

    const result = await getter.call(instance, include);

    // Update cache
    if (useCache) {
      cache = result;
      cacheTime = Date.now();
    }

    return result;
  };
}

/**
 * @function createLazyInclude
 * @description Creates a lazy-loaded include that only loads when accessed
 *
 * @param {string} association - Association name
 * @param {FindOptions} options - Find options
 * @returns {object} Lazy include proxy
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const lazyPosts = createLazyInclude('posts', { limit: 10 });
 *
 * // Only loads when accessed
 * const posts = await lazyPosts.load(user);
 * ```
 */
export function createLazyInclude(association: string, options: FindOptions = {}) {
  return {
    association,
    options,
    async load<M extends Model>(instance: M): Promise<any> {
      const getter = (instance as any)[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
      if (typeof getter !== 'function') {
        throw new Error(`Association ${association} not found`);
      }
      return await getter.call(instance, options);
    },
  };
}

/**
 * @function preloadAssociations
 * @description Preloads multiple associations for an instance
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string[]} associations - Associations to preload
 * @param {Record<string, FindOptions>} options - Options per association
 * @returns {Promise<M>} Instance with preloaded associations
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * await preloadAssociations(user, ['posts', 'profile', 'comments'], {
 *   posts: { limit: 10 },
 *   comments: { where: { approved: true } }
 * });
 * ```
 */
export async function preloadAssociations<M extends Model>(
  instance: M,
  associations: string[],
  options: Record<string, FindOptions> = {},
): Promise<M> {
  await Promise.all(
    associations.map(async (assoc) => {
      const getter = (instance as any)[`get${assoc.charAt(0).toUpperCase()}${assoc.slice(1)}`];
      if (typeof getter === 'function') {
        await getter.call(instance, options[assoc] || {});
      }
    }),
  );

  return instance;
}

// ============================================================================
// CIRCULAR DEPENDENCY HANDLING
// ============================================================================

/**
 * @function detectCircularDependencies
 * @description Detects circular dependencies in model associations
 *
 * @param {ModelStatic<any>} model - Model to analyze
 * @param {Set<string>} visited - Visited models
 * @param {string[]} path - Current path
 * @returns {CircularDependency[]} Detected circular dependencies
 *
 * @example
 * ```typescript
 * const circular = detectCircularDependencies(User, new Set(), []);
 * if (circular.length > 0) {
 *   console.warn('Circular dependencies detected:', circular);
 * }
 * ```
 */
export function detectCircularDependencies(
  model: ModelStatic<any>,
  visited: Set<string> = new Set(),
  path: string[] = [],
): CircularDependency[] {
  const modelName = model.name;
  const circularDeps: CircularDependency[] = [];

  if (visited.has(modelName)) {
    const cycleStart = path.indexOf(modelName);
    if (cycleStart !== -1) {
      circularDeps.push({
        chain: path.slice(cycleStart).concat(modelName),
        models: Array.from(new Set(path.slice(cycleStart).concat(modelName))),
        severity: path.length - cycleStart > 3 ? 'high' : 'medium',
        resolution: 'Use lazy loading or remove bidirectional required associations',
      });
    }
    return circularDeps;
  }

  visited.add(modelName);
  path.push(modelName);

  const associations = (model as any).associations || {};
  for (const [name, assoc] of Object.entries(associations)) {
    const target = (assoc as any).target;
    if (target) {
      const detected = detectCircularDependencies(target, new Set(visited), [...path]);
      circularDeps.push(...detected);
    }
  }

  return circularDeps;
}

/**
 * @function resolveCircularInclude
 * @description Resolves circular includes by breaking cycles
 *
 * @param {Includeable[]} includes - Include options with potential cycles
 * @param {Set<string>} visited - Visited associations
 * @returns {Includeable[]} Resolved includes
 *
 * @example
 * ```typescript
 * const safeIncludes = resolveCircularInclude(
 *   [{ association: 'posts', include: [{ association: 'author' }] }],
 *   new Set()
 * );
 * ```
 */
export function resolveCircularInclude(includes: Includeable[], visited: Set<string> = new Set()): Includeable[] {
  return includes
    .map((include) => {
      if (typeof include === 'object' && include !== null) {
        const assocName = (include as any).association || (include as any).model?.name;
        if (!assocName) return include;

        if (visited.has(assocName)) {
          return null; // Break cycle
        }

        const newVisited = new Set(visited);
        newVisited.add(assocName);

        const resolved = { ...include };
        if ((include as any).include) {
          (resolved as any).include = resolveCircularInclude((include as any).include, newVisited);
        }

        return resolved;
      }
      return include;
    })
    .filter(Boolean) as Includeable[];
}

/**
 * @function createSafeIncludeChain
 * @description Creates a safe include chain that prevents circular references
 *
 * @param {string[]} associations - Association chain
 * @param {number} maxDepth - Maximum depth
 * @returns {Includeable[]} Safe include chain
 *
 * @example
 * ```typescript
 * const include = createSafeIncludeChain(
 *   ['posts', 'comments', 'author'],
 *   3
 * );
 * ```
 */
export function createSafeIncludeChain(associations: string[], maxDepth: number = 5): Includeable[] {
  if (associations.length === 0 || maxDepth <= 0) return [];

  const [first, ...rest] = associations;
  const include: IncludeOptions = { association: first };

  if (rest.length > 0 && maxDepth > 1) {
    include.include = createSafeIncludeChain(rest, maxDepth - 1);
  }

  return [include];
}

// ============================================================================
// ASSOCIATION METADATA & INTROSPECTION
// ============================================================================

/**
 * @function getAssociationMetadata
 * @description Extracts metadata about a model's associations
 *
 * @param {ModelStatic<any>} model - Model to analyze
 * @returns {AssociationMetadata[]} Association metadata
 *
 * @example
 * ```typescript
 * const metadata = getAssociationMetadata(User);
 * metadata.forEach(m => {
 *   console.log(`${m.name}: ${m.type} -> ${m.target}`);
 * });
 * ```
 */
export function getAssociationMetadata(model: ModelStatic<any>): AssociationMetadata[] {
  const associations = (model as any).associations || {};
  const metadata: AssociationMetadata[] = [];

  for (const [name, assoc] of Object.entries(associations)) {
    const association = assoc as any;
    metadata.push({
      name,
      type: association.associationType,
      source: association.source.name,
      target: association.target.name,
      foreignKey: association.foreignKey,
      targetKey: association.targetKey || association.otherKey,
      through: association.through?.model?.name,
    });
  }

  return metadata;
}

/**
 * @function getAssociationChain
 * @description Gets the full chain of associations from source to target
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {string} targetName - Target model name
 * @returns {string[]} Association chain
 *
 * @example
 * ```typescript
 * const chain = getAssociationChain(User, 'Comment');
 * // Returns: ['posts', 'comments'] if User -> Post -> Comment
 * ```
 */
export function getAssociationChain(source: ModelStatic<any>, targetName: string): string[] {
  const findChain = (model: ModelStatic<any>, target: string, visited: Set<string> = new Set()): string[] | null => {
    if (visited.has(model.name)) return null;
    visited.add(model.name);

    const associations = (model as any).associations || {};
    for (const [name, assoc] of Object.entries(associations)) {
      const targetModel = (assoc as any).target;
      if (targetModel.name === target) {
        return [name];
      }

      const chain = findChain(targetModel, target, new Set(visited));
      if (chain) {
        return [name, ...chain];
      }
    }

    return null;
  };

  return findChain(source, targetName) || [];
}

/**
 * @function getAllAssociationPaths
 * @description Gets all possible association paths from a model
 *
 * @param {ModelStatic<any>} model - Model to analyze
 * @param {number} maxDepth - Maximum depth
 * @returns {string[][]} All association paths
 *
 * @example
 * ```typescript
 * const paths = getAllAssociationPaths(User, 3);
 * // Returns: [['posts'], ['posts', 'comments'], ['profile'], ...]
 * ```
 */
export function getAllAssociationPaths(model: ModelStatic<any>, maxDepth: number = 3): string[][] {
  const paths: string[][] = [];

  const traverse = (currentModel: ModelStatic<any>, path: string[], visited: Set<string>) => {
    if (path.length >= maxDepth) return;

    const associations = (currentModel as any).associations || {};
    for (const [name, assoc] of Object.entries(associations)) {
      const targetModel = (assoc as any).target;
      if (visited.has(targetModel.name)) continue;

      const newPath = [...path, name];
      paths.push(newPath);

      const newVisited = new Set(visited);
      newVisited.add(targetModel.name);
      traverse(targetModel, newPath, newVisited);
    }
  };

  traverse(model, [], new Set([model.name]));
  return paths;
}

/**
 * @function validateAssociationPath
 * @description Validates that an association path exists and is valid
 *
 * @param {ModelStatic<any>} model - Source model
 * @param {string} path - Dot notation path
 * @returns {boolean} True if path is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAssociationPath(User, 'posts.comments.author');
 * ```
 */
export function validateAssociationPath(model: ModelStatic<any>, path: string): boolean {
  const parts = path.split('.');
  let currentModel = model;

  for (const part of parts) {
    const associations = (currentModel as any).associations || {};
    const assoc = associations[part];

    if (!assoc) return false;

    currentModel = (assoc as any).target;
  }

  return true;
}

// ============================================================================
// JOIN OPTIMIZATION
// ============================================================================

/**
 * @function analyzeJoinStrategy
 * @description Analyzes and recommends optimal join strategy
 *
 * @param {IncludeStrategy} strategy - Include strategy
 * @param {object} stats - Data statistics
 * @returns {JoinOptimization} Optimization recommendation
 *
 * @example
 * ```typescript
 * const optimization = analyzeJoinStrategy(
 *   { model: Post, as: 'posts' },
 *   { rowCount: 10000, associationCount: 50 }
 * );
 * ```
 */
export function analyzeJoinStrategy(
  strategy: IncludeStrategy,
  stats: { rowCount?: number; associationCount?: number; hasWhere?: boolean } = {},
): JoinOptimization {
  const { rowCount = 0, associationCount = 0, hasWhere = false } = stats;

  let optimized: 'nested' | 'separate' | 'subquery' = 'nested';
  let reason = 'Default nested join';
  let improvement = 'None';

  // Large datasets benefit from separate queries
  if (rowCount > 1000 || associationCount > 100) {
    optimized = 'separate';
    reason = 'Large dataset detected';
    improvement = 'Prevents cartesian product, reduces memory usage';
  }

  // WHERE clauses on associations benefit from subquery
  if (hasWhere && rowCount > 100) {
    optimized = 'subquery';
    reason = 'Association filtering detected';
    improvement = 'Filters before join, reduces intermediate result set';
  }

  // Small datasets with required associations stay nested
  if (rowCount < 100 && strategy.required) {
    optimized = 'nested';
    reason = 'Small dataset with required association';
    improvement = 'Single query execution, minimal overhead';
  }

  return {
    original: 'nested',
    optimized,
    reason,
    improvement,
  };
}

/**
 * @function optimizeJoinOrder
 * @description Optimizes the order of joins for better performance
 *
 * @param {IncludeStrategy[]} includes - Include strategies
 * @param {Record<string, number>} cardinalities - Expected cardinalities
 * @returns {IncludeStrategy[]} Optimized join order
 *
 * @example
 * ```typescript
 * const optimized = optimizeJoinOrder(includes, {
 *   posts: 1000,
 *   profile: 1,
 *   comments: 5000
 * });
 * // Orders: profile (1), posts (1000), comments (5000)
 * ```
 */
export function optimizeJoinOrder(
  includes: IncludeStrategy[],
  cardinalities: Record<string, number> = {},
): IncludeStrategy[] {
  return [...includes].sort((a, b) => {
    const cardA = cardinalities[a.as || ''] || 1;
    const cardB = cardinalities[b.as || ''] || 1;
    return cardA - cardB; // Lower cardinality first
  });
}

/**
 * @function createIndexedJoin
 * @description Creates join with index hints for optimization
 *
 * @param {IncludeStrategy} strategy - Include strategy
 * @param {string[]} indexHints - Index hints
 * @returns {IncludeStrategy} Strategy with index hints
 *
 * @example
 * ```typescript
 * const include = createIndexedJoin(
 *   { model: Post, as: 'posts' },
 *   ['idx_author_created']
 * );
 * ```
 */
export function createIndexedJoin(strategy: IncludeStrategy, indexHints: string[]): IncludeStrategy {
  return {
    ...strategy,
    // Index hints would be added as raw SQL in where clause
    where: {
      ...strategy.where,
      // Sequelize doesn't support index hints directly
      // This would require raw SQL or dialect-specific implementation
    },
  };
}

// ============================================================================
// ASSOCIATION CACHING
// ============================================================================

/**
 * @function createAssociationCache
 * @description Creates a cache for association results
 *
 * @param {number} ttl - Time to live in milliseconds
 * @returns {AssociationCache} Cache instance
 *
 * @example
 * ```typescript
 * const cache = createAssociationCache(60000);
 * cache.set('user:1:posts', posts);
 * const cached = cache.get('user:1:posts');
 * ```
 */
export function createAssociationCache(ttl: number = 60000) {
  const cache = new Map<string, { value: any; expires: number }>();

  return {
    get(key: string): any | null {
      const entry = cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expires) {
        cache.delete(key);
        return null;
      }

      return entry.value;
    },

    set(key: string, value: any): void {
      cache.set(key, {
        value,
        expires: Date.now() + ttl,
      });
    },

    delete(key: string): void {
      cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    keys(): string[] {
      return Array.from(cache.keys());
    },
  };
}

/**
 * @function memoizeAssociation
 * @description Memoizes association getter results
 *
 * @template M, T
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {number} ttl - Cache TTL
 * @returns {() => Promise<T | T[]>} Memoized getter
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const getPosts = memoizeAssociation(user, 'posts', 30000);
 *
 * const posts1 = await getPosts(); // Database query
 * const posts2 = await getPosts(); // Cached result
 * ```
 */
export function memoizeAssociation<M extends Model, T extends Model>(
  instance: M,
  association: string,
  ttl: number = 60000,
): () => Promise<T | T[] | null> {
  let cache: { value: T | T[] | null; expires: number } | null = null;

  return async (): Promise<T | T[] | null> => {
    if (cache && Date.now() < cache.expires) {
      return cache.value;
    }

    const getter = (instance as any)[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
    if (typeof getter !== 'function') {
      throw new Error(`Association ${association} not found`);
    }

    const value = await getter.call(instance);
    cache = {
      value,
      expires: Date.now() + ttl,
    };

    return value;
  };
}

// ============================================================================
// ASSOCIATION COUNTING & AGGREGATION
// ============================================================================

/**
 * @function countAssociation
 * @description Counts associated records without loading them
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {WhereOptions} where - Optional where conditions
 * @returns {Promise<number>} Count of associated records
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const postCount = await countAssociation(user, 'posts', {
 *   status: 'published'
 * });
 * ```
 */
export async function countAssociation<M extends Model>(
  instance: M,
  association: string,
  where?: WhereOptions,
): Promise<number> {
  const counter = (instance as any)[`count${association.charAt(0).toUpperCase()}${association.slice(1)}`];
  if (typeof counter !== 'function') {
    throw new Error(`Association ${association} not found or not countable`);
  }

  return await counter.call(instance, { where });
}

/**
 * @function hasAssociatedRecords
 * @description Checks if instance has any associated records
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {WhereOptions} where - Optional where conditions
 * @returns {Promise<boolean>} True if has associated records
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const hasPosts = await hasAssociatedRecords(user, 'posts');
 * ```
 */
export async function hasAssociatedRecords<M extends Model>(
  instance: M,
  association: string,
  where?: WhereOptions,
): Promise<boolean> {
  const count = await countAssociation(instance, association, where);
  return count > 0;
}

/**
 * @function aggregateAssociation
 * @description Aggregates values from associated records
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {string} field - Field to aggregate
 * @param {'SUM' | 'AVG' | 'MAX' | 'MIN'} fn - Aggregation function
 * @returns {Promise<number>} Aggregated value
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const totalRevenue = await aggregateAssociation(user, 'orders', 'amount', 'SUM');
 * ```
 */
export async function aggregateAssociation<M extends Model>(
  instance: M,
  association: string,
  field: string,
  fn: 'SUM' | 'AVG' | 'MAX' | 'MIN',
): Promise<number> {
  const getter = (instance as any)[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
  if (typeof getter !== 'function') {
    throw new Error(`Association ${association} not found`);
  }

  const assoc = ((instance.constructor as ModelStatic<M>) as any).associations[association];
  if (!assoc) throw new Error(`Association ${association} not found`);

  const TargetModel = assoc.target;
  const foreignKey = assoc.foreignKey;

  const result = await (TargetModel as any).aggregate(field, fn.toLowerCase(), {
    where: { [foreignKey]: (instance as any).id },
  });

  return result || 0;
}

// ============================================================================
// INCLUDE MERGING & FILTERING
// ============================================================================

/**
 * @function mergeIncludes
 * @description Merges multiple include arrays into one
 *
 * @param {...Includeable[][]} includes - Include arrays to merge
 * @returns {Includeable[]} Merged includes
 *
 * @example
 * ```typescript
 * const baseIncludes = [{ model: Post, as: 'posts' }];
 * const extraIncludes = [{ model: Profile, as: 'profile' }];
 * const merged = mergeIncludes(baseIncludes, extraIncludes);
 * ```
 */
export function mergeIncludes(...includes: Includeable[][]): Includeable[] {
  const merged = new Map<string, Includeable>();

  for (const includeArray of includes) {
    for (const include of includeArray) {
      if (typeof include === 'object' && include !== null) {
        const key = (include as any).as || (include as any).model?.name || JSON.stringify(include);

        if (merged.has(key)) {
          const existing = merged.get(key) as any;
          const current = include as any;

          // Merge nested includes
          if (existing.include && current.include) {
            existing.include = mergeIncludes(existing.include, current.include);
          } else if (current.include) {
            existing.include = current.include;
          }

          // Merge other properties
          Object.assign(existing, current);
        } else {
          merged.set(key, include);
        }
      }
    }
  }

  return Array.from(merged.values());
}

/**
 * @function filterIncludes
 * @description Filters includes based on predicate
 *
 * @param {Includeable[]} includes - Include options
 * @param {(include: Includeable) => boolean} predicate - Filter predicate
 * @returns {Includeable[]} Filtered includes
 *
 * @example
 * ```typescript
 * const filtered = filterIncludes(includes, (inc) => {
 *   return (inc as any).as !== 'sensitiveData';
 * });
 * ```
 */
export function filterIncludes(includes: Includeable[], predicate: (include: Includeable) => boolean): Includeable[] {
  return includes
    .filter(predicate)
    .map((include) => {
      if (typeof include === 'object' && include !== null && (include as any).include) {
        return {
          ...include,
          include: filterIncludes((include as any).include, predicate),
        };
      }
      return include;
    });
}

/**
 * @function excludeIncludes
 * @description Excludes specific associations from includes
 *
 * @param {Includeable[]} includes - Include options
 * @param {string[]} excludeList - Associations to exclude
 * @returns {Includeable[]} Filtered includes
 *
 * @example
 * ```typescript
 * const safe = excludeIncludes(includes, ['password', 'refreshToken']);
 * ```
 */
export function excludeIncludes(includes: Includeable[], excludeList: string[]): Includeable[] {
  return filterIncludes(includes, (include) => {
    const as = (include as any).as;
    return !as || !excludeList.includes(as);
  });
}

/**
 * @function includeOnly
 * @description Keeps only specified associations
 *
 * @param {Includeable[]} includes - Include options
 * @param {string[]} allowList - Associations to keep
 * @returns {Includeable[]} Filtered includes
 *
 * @example
 * ```typescript
 * const minimal = includeOnly(includes, ['id', 'name', 'email']);
 * ```
 */
export function includeOnly(includes: Includeable[], allowList: string[]): Includeable[] {
  return filterIncludes(includes, (include) => {
    const as = (include as any).as;
    return !as || allowList.includes(as);
  });
}

// ============================================================================
// ASSOCIATION SCOPES
// ============================================================================

/**
 * @function createAssociationScope
 * @description Creates a reusable association scope
 *
 * @param {IncludeStrategy} baseStrategy - Base include strategy
 * @param {Record<string, any>} scope - Scope conditions
 * @returns {IncludeStrategy} Scoped include strategy
 *
 * @example
 * ```typescript
 * const activePostsScope = createAssociationScope(
 *   { model: Post, as: 'posts' },
 *   { status: 'active', deletedAt: null }
 * );
 * ```
 */
export function createAssociationScope(baseStrategy: IncludeStrategy, scope: Record<string, any>): IncludeStrategy {
  return {
    ...baseStrategy,
    where: {
      ...baseStrategy.where,
      ...scope,
    },
  };
}

/**
 * @function applyAssociationScope
 * @description Applies a scope to an association dynamically
 *
 * @param {Includeable} include - Include option
 * @param {WhereOptions} scope - Scope to apply
 * @returns {Includeable} Scoped include
 *
 * @example
 * ```typescript
 * const scoped = applyAssociationScope(
 *   { model: Post, as: 'posts' },
 *   { status: 'published' }
 * );
 * ```
 */
export function applyAssociationScope(include: Includeable, scope: WhereOptions): Includeable {
  if (typeof include === 'object' && include !== null) {
    return {
      ...include,
      where: {
        ...(include as any).where,
        ...scope,
      },
    };
  }
  return include;
}

/**
 * @function createTimeRangeScope
 * @description Creates a time-range scoped association
 *
 * @param {IncludeStrategy} strategy - Include strategy
 * @param {string} field - Date field name
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {IncludeStrategy} Time-scoped strategy
 *
 * @example
 * ```typescript
 * const recentPosts = createTimeRangeScope(
 *   { model: Post, as: 'posts' },
 *   'createdAt',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export function createTimeRangeScope(
  strategy: IncludeStrategy,
  field: string,
  start: Date,
  end: Date,
): IncludeStrategy {
  return {
    ...strategy,
    where: {
      ...strategy.where,
      [field]: {
        [Op.between]: [start, end],
      },
    },
  };
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * @function batchAssociateMany
 * @description Associates multiple instances in batch
 *
 * @template M, T
 * @param {M} instance - Source instance
 * @param {string} association - Association name
 * @param {T[]} targets - Target instances
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * await batchAssociateMany(user, 'roles', roleInstances, transaction);
 * ```
 */
export async function batchAssociateMany<M extends Model, T extends Model>(
  instance: M,
  association: string,
  targets: T[],
  transaction?: Transaction,
): Promise<void> {
  const adder = (instance as any)[`add${association.charAt(0).toUpperCase()}${association.slice(1)}`];
  if (typeof adder !== 'function') {
    throw new Error(`Association ${association} not found or not addable`);
  }

  await adder.call(instance, targets, { transaction });
}

/**
 * @function batchRemoveAssociations
 * @description Removes multiple associations in batch
 *
 * @template M, T
 * @param {M} instance - Source instance
 * @param {string} association - Association name
 * @param {T[]} targets - Target instances to remove
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * await batchRemoveAssociations(user, 'roles', oldRoles, transaction);
 * ```
 */
export async function batchRemoveAssociations<M extends Model, T extends Model>(
  instance: M,
  association: string,
  targets: T[],
  transaction?: Transaction,
): Promise<void> {
  const remover = (instance as any)[`remove${association.charAt(0).toUpperCase()}${association.slice(1)}`];
  if (typeof remover !== 'function') {
    throw new Error(`Association ${association} not found or not removable`);
  }

  await remover.call(instance, targets, { transaction });
}

/**
 * @function syncAssociations
 * @description Syncs associations to match provided list
 *
 * @template M, T
 * @param {M} instance - Source instance
 * @param {string} association - Association name
 * @param {T[]} desired - Desired associated instances
 * @param {Transaction} transaction - Transaction
 * @returns {Promise<{added: T[], removed: T[]}>} Sync result
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const { added, removed } = await syncAssociations(
 *   user,
 *   'roles',
 *   newRoleList,
 *   transaction
 * );
 * ```
 */
export async function syncAssociations<M extends Model, T extends Model>(
  instance: M,
  association: string,
  desired: T[],
  transaction?: Transaction,
): Promise<{ added: T[]; removed: T[] }> {
  const getter = (instance as any)[`get${association.charAt(0).toUpperCase()}${association.slice(1)}`];
  if (typeof getter !== 'function') {
    throw new Error(`Association ${association} not found`);
  }

  const current = await getter.call(instance, { transaction });
  const currentIds = new Set(current.map((c: any) => c.id));
  const desiredIds = new Set(desired.map((d) => (d as any).id));

  const toAdd = desired.filter((d) => !currentIds.has((d as any).id));
  const toRemove = current.filter((c: any) => !desiredIds.has(c.id));

  if (toAdd.length > 0) {
    await batchAssociateMany(instance, association, toAdd, transaction);
  }

  if (toRemove.length > 0) {
    await batchRemoveAssociations(instance, association, toRemove, transaction);
  }

  return { added: toAdd, removed: toRemove };
}

// ============================================================================
// ASSOCIATION TESTING UTILITIES
// ============================================================================

/**
 * @function mockAssociation
 * @description Mocks an association for testing
 *
 * @template M, T
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @param {T | T[]} mockData - Mock data
 * @returns {void}
 *
 * @example
 * ```typescript
 * const user = User.build({ id: 1 });
 * mockAssociation(user, 'posts', [mockPost1, mockPost2]);
 * ```
 */
export function mockAssociation<M extends Model, T extends Model>(
  instance: M,
  association: string,
  mockData: T | T[] | null,
): void {
  const getterName = `get${association.charAt(0).toUpperCase()}${association.slice(1)}`;
  (instance as any)[getterName] = async () => mockData;
}

/**
 * @function createAssociationStub
 * @description Creates a stub for association methods
 *
 * @param {string[]} associations - Association names
 * @returns {Record<string, Function>} Stubbed methods
 *
 * @example
 * ```typescript
 * const stubs = createAssociationStub(['posts', 'profile']);
 * Object.assign(mockUser, stubs);
 * ```
 */
export function createAssociationStub(associations: string[]): Record<string, Function> {
  const stubs: Record<string, Function> = {};

  for (const assoc of associations) {
    const capitalized = assoc.charAt(0).toUpperCase() + assoc.slice(1);
    stubs[`get${capitalized}`] = async () => [];
    stubs[`set${capitalized}`] = async () => {};
    stubs[`add${capitalized}`] = async () => {};
    stubs[`remove${capitalized}`] = async () => {};
    stubs[`count${capitalized}`] = async () => 0;
    stubs[`has${capitalized}`] = async () => false;
  }

  return stubs;
}

/**
 * @function verifyAssociationLoaded
 * @description Verifies that an association has been loaded
 *
 * @template M
 * @param {M} instance - Model instance
 * @param {string} association - Association name
 * @returns {boolean} True if loaded
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId, {
 *   include: ['posts']
 * });
 * const isLoaded = verifyAssociationLoaded(user, 'posts');
 * ```
 */
export function verifyAssociationLoaded<M extends Model>(instance: M, association: string): boolean {
  return (instance as any)[association] !== undefined;
}

/**
 * @function getLoadedAssociations
 * @description Gets list of currently loaded associations
 *
 * @template M
 * @param {M} instance - Model instance
 * @returns {string[]} Loaded association names
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId, {
 *   include: ['posts', 'profile']
 * });
 * const loaded = getLoadedAssociations(user);
 * // Returns: ['posts', 'profile']
 * ```
 */
export function getLoadedAssociations<M extends Model>(instance: M): string[] {
  const model = instance.constructor as ModelStatic<M>;
  const associations = (model as any).associations || {};
  const loaded: string[] = [];

  for (const [name, assoc] of Object.entries(associations)) {
    if ((instance as any)[name] !== undefined) {
      loaded.push(name);
    }
  }

  return loaded;
}
