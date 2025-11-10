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
import { Model, ModelStatic, Association, HasOneOptions, HasManyOptions, BelongsToOptions, BelongsToManyOptions, Includeable, FindOptions, WhereOptions, Transaction, AssociationScope } from 'sequelize';
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
    attributes?: string[] | {
        exclude?: string[];
        include?: string[];
    };
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
export declare function defineRelationship(definition: RelationshipDefinition): Association<any, any>;
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
export declare function createAssociationBuilder<M extends Model>(model: ModelStatic<M>): {
    hasOne(target: ModelStatic<any>, as?: string, options?: Partial<HasOneOptions>): /*elided*/ any;
    hasMany(target: ModelStatic<any>, as?: string, options?: Partial<HasManyOptions>): /*elided*/ any;
    belongsTo(target: ModelStatic<any>, as?: string, options?: Partial<BelongsToOptions>): /*elided*/ any;
    belongsToMany(target: ModelStatic<any>, through: ModelStatic<any>, as?: string, options?: Partial<BelongsToManyOptions>): /*elided*/ any;
    build(): Association<any, any>[];
};
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
export declare function defineBidirectionalRelation<M1 extends Model, M2 extends Model>(model1: ModelStatic<M1>, model2: ModelStatic<M2>, config: {
    model1: Pick<RelationshipDefinition, 'type' | 'as' | 'foreignKey' | 'targetKey'>;
    model2: Pick<RelationshipDefinition, 'type' | 'as' | 'foreignKey' | 'targetKey'>;
}): [Association<M1, M2>, Association<M2, M1>];
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
export declare function createPolymorphicRelation<M extends Model>(source: ModelStatic<M>, polymorphicName: string, targetTypes: string[]): void;
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
export declare function getPolymorphicTarget<M extends Model>(instance: M, polymorphicName: string, models: Record<string, ModelStatic<any>>): Promise<Model | null>;
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
export declare function buildNestedInclude(path: string, options?: Partial<IncludeStrategy>): Includeable[];
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
export declare function buildMultiLevelInclude(levels: Array<{
    association: string;
    options?: Partial<IncludeStrategy>;
}>): Includeable[];
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
export declare function createIncludeWithDepthLimit(includes: Includeable[], maxDepth: number): Includeable[];
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
export declare function optimizeIncludeStrategy(strategy: IncludeStrategy, hints?: {
    expectedCount?: number;
    hasLimit?: boolean;
    isRequired?: boolean;
}): IncludeStrategy;
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
export declare function createConditionalInclude(baseInclude: IncludeStrategy, condition: (context: any) => boolean): (context: any) => Includeable[];
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
export declare function preventN1<M extends Model>(queryPromise: Promise<M[]>, associations: string[], options?: FindOptions): Promise<M[]>;
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
export declare function detectN1Queries(queryFn: () => Promise<void>, testData?: any[]): Promise<N1DetectionResult>;
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
export declare function batchLoadAssociations<M extends Model, T extends Model>(instances: M[], association: string, options?: FindOptions): Promise<Map<string, T[]>>;
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
export declare function createDataLoader<M extends Model>(model: ModelStatic<M>, association: string): (id: string) => Promise<M[]>;
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
export declare function createLazyLoader<M extends Model, T extends Model>(instance: M, association: string, config?: LazyLoadConfig): () => Promise<T | T[] | null>;
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
export declare function createLazyInclude(association: string, options?: FindOptions): {
    association: string;
    options: FindOptions;
    load<M extends Model>(instance: M): Promise<any>;
};
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
export declare function preloadAssociations<M extends Model>(instance: M, associations: string[], options?: Record<string, FindOptions>): Promise<M>;
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
export declare function detectCircularDependencies(model: ModelStatic<any>, visited?: Set<string>, path?: string[]): CircularDependency[];
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
export declare function resolveCircularInclude(includes: Includeable[], visited?: Set<string>): Includeable[];
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
export declare function createSafeIncludeChain(associations: string[], maxDepth?: number): Includeable[];
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
export declare function getAssociationMetadata(model: ModelStatic<any>): AssociationMetadata[];
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
export declare function getAssociationChain(source: ModelStatic<any>, targetName: string): string[];
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
export declare function getAllAssociationPaths(model: ModelStatic<any>, maxDepth?: number): string[][];
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
export declare function validateAssociationPath(model: ModelStatic<any>, path: string): boolean;
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
export declare function analyzeJoinStrategy(strategy: IncludeStrategy, stats?: {
    rowCount?: number;
    associationCount?: number;
    hasWhere?: boolean;
}): JoinOptimization;
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
export declare function optimizeJoinOrder(includes: IncludeStrategy[], cardinalities?: Record<string, number>): IncludeStrategy[];
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
export declare function createIndexedJoin(strategy: IncludeStrategy, indexHints: string[]): IncludeStrategy;
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
export declare function createAssociationCache(ttl?: number): {
    get(key: string): any | null;
    set(key: string, value: any): void;
    delete(key: string): void;
    clear(): void;
    keys(): string[];
};
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
export declare function memoizeAssociation<M extends Model, T extends Model>(instance: M, association: string, ttl?: number): () => Promise<T | T[] | null>;
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
export declare function countAssociation<M extends Model>(instance: M, association: string, where?: WhereOptions): Promise<number>;
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
export declare function hasAssociatedRecords<M extends Model>(instance: M, association: string, where?: WhereOptions): Promise<boolean>;
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
export declare function aggregateAssociation<M extends Model>(instance: M, association: string, field: string, fn: 'SUM' | 'AVG' | 'MAX' | 'MIN'): Promise<number>;
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
export declare function mergeIncludes(...includes: Includeable[][]): Includeable[];
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
export declare function filterIncludes(includes: Includeable[], predicate: (include: Includeable) => boolean): Includeable[];
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
export declare function excludeIncludes(includes: Includeable[], excludeList: string[]): Includeable[];
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
export declare function includeOnly(includes: Includeable[], allowList: string[]): Includeable[];
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
export declare function createAssociationScope(baseStrategy: IncludeStrategy, scope: Record<string, any>): IncludeStrategy;
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
export declare function applyAssociationScope(include: Includeable, scope: WhereOptions): Includeable;
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
export declare function createTimeRangeScope(strategy: IncludeStrategy, field: string, start: Date, end: Date): IncludeStrategy;
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
export declare function batchAssociateMany<M extends Model, T extends Model>(instance: M, association: string, targets: T[], transaction?: Transaction): Promise<void>;
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
export declare function batchRemoveAssociations<M extends Model, T extends Model>(instance: M, association: string, targets: T[], transaction?: Transaction): Promise<void>;
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
export declare function syncAssociations<M extends Model, T extends Model>(instance: M, association: string, desired: T[], transaction?: Transaction): Promise<{
    added: T[];
    removed: T[];
}>;
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
export declare function mockAssociation<M extends Model, T extends Model>(instance: M, association: string, mockData: T | T[] | null): void;
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
export declare function createAssociationStub(associations: string[]): Record<string, Function>;
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
export declare function verifyAssociationLoaded<M extends Model>(instance: M, association: string): boolean;
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
export declare function getLoadedAssociations<M extends Model>(instance: M): string[];
//# sourceMappingURL=sequelize-relations-kit.d.ts.map