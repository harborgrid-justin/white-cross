/**
 * @fileoverview Database Associations Kit - Comprehensive Sequelize association management
 * @module reuse/database-associations-kit
 * @description Complete association management solution for Sequelize v6 with advanced
 * relationship builders, eager loading optimization, include strategies, polymorphic
 * associations, and N+1 query prevention for healthcare data relationships.
 *
 * Key Features:
 * - HasMany/BelongsTo/BelongsToMany association builders
 * - Through table configuration and management
 * - Eager loading optimization strategies
 * - Include query optimization and nested includes
 * - Association scope management
 * - Polymorphic association patterns
 * - Self-referential relationship handling
 * - Junction table utilities
 * - Association validators and integrity checks
 * - Cascade delete configuration
 * - Association counting and aggregation
 * - Many-to-Many relationship utilities
 * - N+1 query prevention
 * - Performance optimization for complex associations
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA-compliant association design
 * - Access control through scoped associations
 * - Audit trail for relationship changes
 * - Data integrity validation
 * - Foreign key constraint enforcement
 * - Transaction safety for complex associations
 * - Sensitive data filtering in includes
 *
 * @example Basic association setup
 * ```typescript
 * import { createHasMany, createBelongsTo, optimizedInclude } from './database-associations-kit';
 *
 * // Define one-to-many association
 * createHasMany(User, Post, {
 *   foreignKey: 'authorId',
 *   as: 'posts',
 *   onDelete: 'CASCADE'
 * });
 *
 * // Define belongs-to association
 * createBelongsTo(Post, User, {
 *   foreignKey: 'authorId',
 *   as: 'author'
 * });
 *
 * // Optimized include query
 * const users = await User.findAll(
 *   optimizedInclude([
 *     { model: Post, as: 'posts', limit: 10 }
 *   ])
 * );
 * ```
 *
 * @example Advanced many-to-many relationships
 * ```typescript
 * import { createManyToMany, createThroughModel, queryWithThrough } from './database-associations-kit';
 *
 * // Create through model
 * const Enrollment = createThroughModel(sequelize, 'Enrollment', {
 *   status: DataTypes.ENUM('active', 'completed', 'dropped'),
 *   enrolledAt: DataTypes.DATE,
 *   grade: DataTypes.DECIMAL(3, 2)
 * });
 *
 * // Define many-to-many with through model
 * createManyToMany(Student, Course, {
 *   through: Enrollment,
 *   foreignKey: 'studentId',
 *   otherKey: 'courseId',
 *   as: 'courses'
 * });
 *
 * // Query with through attributes
 * const students = await queryWithThrough(Student, {
 *   include: [{
 *     model: Course,
 *     as: 'courses',
 *     through: {
 *       attributes: ['status', 'enrolledAt', 'grade'],
 *       where: { status: 'active' }
 *     }
 *   }]
 * });
 * ```
 *
 * @example Polymorphic associations
 * ```typescript
 * import { createPolymorphicAssociation, queryPolymorphic } from './database-associations-kit';
 *
 * // Create polymorphic comments (belongs to Post or Video)
 * createPolymorphicAssociation(Comment, [Post, Video], {
 *   foreignKey: 'commentableId',
 *   discriminatorField: 'commentableType',
 *   as: 'commentable'
 * });
 *
 * // Query polymorphic relationships
 * const comments = await queryPolymorphic(Comment, {
 *   includeAll: true
 * });
 * ```
 *
 * LOC: DAK-001
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: models/*, services/*, repositories/*, data access layers
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Association, Includeable, FindOptions, Transaction, WhereOptions, ForeignKey, Sequelize, ModelAttributes } from 'sequelize';
/**
 * @enum CascadeAction
 * @description Foreign key cascade actions
 */
export declare enum CascadeAction {
    CASCADE = "CASCADE",
    SET_NULL = "SET NULL",
    RESTRICT = "RESTRICT",
    NO_ACTION = "NO ACTION",
    SET_DEFAULT = "SET DEFAULT"
}
/**
 * @interface AssociationConfig
 * @description Base configuration for associations
 */
export interface AssociationConfig {
    foreignKey?: string | ForeignKey;
    sourceKey?: string;
    targetKey?: string;
    as?: string;
    onDelete?: CascadeAction | string;
    onUpdate?: CascadeAction | string;
    constraints?: boolean;
    hooks?: boolean;
    scope?: WhereOptions;
}
/**
 * @interface HasManyConfig
 * @description Configuration for hasMany associations
 */
export interface HasManyConfig extends AssociationConfig {
    inverse?: string;
    scope?: WhereOptions;
}
/**
 * @interface BelongsToConfig
 * @description Configuration for belongsTo associations
 */
export interface BelongsToConfig extends AssociationConfig {
    inverse?: string;
}
/**
 * @interface BelongsToManyConfig
 * @description Configuration for belongsToMany associations
 */
export interface BelongsToManyConfig extends AssociationConfig {
    through: string | ModelStatic<any>;
    otherKey?: string | ForeignKey;
    timestamps?: boolean;
    paranoid?: boolean;
    throughScope?: WhereOptions;
}
/**
 * @interface ThroughModelConfig
 * @description Configuration for through/junction models
 */
export interface ThroughModelConfig {
    tableName?: string;
    timestamps?: boolean;
    paranoid?: boolean;
    indexes?: Array<{
        fields: string[];
        unique?: boolean;
        name?: string;
    }>;
    additionalAttributes?: ModelAttributes;
}
/**
 * @interface PolymorphicConfig
 * @description Configuration for polymorphic associations
 */
export interface PolymorphicConfig {
    foreignKey: string;
    discriminatorField: string;
    as: string;
    constraints?: boolean;
    scope?: WhereOptions;
}
/**
 * @interface IncludeOptimizationConfig
 * @description Configuration for optimized includes
 */
export interface IncludeOptimizationConfig {
    model: ModelStatic<any>;
    as?: string;
    attributes?: string[] | {
        include?: string[];
        exclude?: string[];
    };
    where?: WhereOptions;
    required?: boolean;
    separate?: boolean;
    limit?: number;
    offset?: number;
    order?: any[];
    include?: IncludeOptimizationConfig[];
    through?: {
        attributes?: string[];
        where?: WhereOptions;
    };
    duplicating?: boolean;
    subQuery?: boolean;
}
/**
 * @interface NestedIncludeConfig
 * @description Configuration for nested include queries
 */
export interface NestedIncludeConfig {
    maxDepth?: number;
    preventCircular?: boolean;
    optimizeCartesian?: boolean;
    useSeparateQueries?: boolean;
}
/**
 * @interface AssociationScopeConfig
 * @description Configuration for association scopes
 */
export interface AssociationScopeConfig {
    name: string;
    scope: WhereOptions | ((args?: any) => WhereOptions);
    includeOptions?: Partial<Includeable>;
}
/**
 * @interface SelfReferentialConfig
 * @description Configuration for self-referential associations
 */
export interface SelfReferentialConfig {
    foreignKey: string;
    as: string;
    inverse?: string;
    hierarchyType?: 'tree' | 'graph' | 'adjacency';
    maxDepth?: number;
}
/**
 * @interface AssociationValidationResult
 * @description Result of association validation
 */
export interface AssociationValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}
/**
 * @interface AssociationStats
 * @description Statistics for associations
 */
export interface AssociationStats {
    associationType: string;
    sourceModel: string;
    targetModel: string;
    foreignKey: string;
    recordCount: number;
    orphanedRecords: number;
    averageRelationships: number;
}
/**
 * @interface JunctionTableQuery
 * @description Query configuration for junction tables
 */
export interface JunctionTableQuery {
    where?: WhereOptions;
    attributes?: string[];
    order?: any[];
    limit?: number;
    offset?: number;
    includeThrough?: boolean;
}
/**
 * @interface CascadeConfig
 * @description Configuration for cascade operations
 */
export interface CascadeConfig {
    onDelete: CascadeAction;
    onUpdate: CascadeAction;
    softDelete?: boolean;
    cascadeHooks?: boolean;
}
/**
 * @interface AssociationCountConfig
 * @description Configuration for association counting
 */
export interface AssociationCountConfig {
    as?: string;
    where?: WhereOptions;
    distinct?: boolean;
    includeIgnoreAttributes?: boolean;
}
/**
 * Creates a hasMany association with optimal configuration
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {HasManyConfig} config - Association configuration
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * const association = createHasMany(User, Post, {
 *   foreignKey: 'authorId',
 *   as: 'posts',
 *   onDelete: CascadeAction.CASCADE,
 *   hooks: true
 * });
 * ```
 */
export declare const createHasMany: <S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: HasManyConfig) => Association;
/**
 * Creates a belongsTo association with optimal configuration
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {BelongsToConfig} config - Association configuration
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * const association = createBelongsTo(Post, User, {
 *   foreignKey: 'authorId',
 *   as: 'author',
 *   targetKey: 'id'
 * });
 * ```
 */
export declare const createBelongsTo: <S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: BelongsToConfig) => Association;
/**
 * Creates a hasOne association with optimal configuration
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * const association = createHasOne(User, Profile, {
 *   foreignKey: 'userId',
 *   as: 'profile',
 *   onDelete: CascadeAction.CASCADE
 * });
 * ```
 */
export declare const createHasOne: <S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: AssociationConfig) => Association;
/**
 * Creates a belongsToMany association with through model
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {BelongsToManyConfig} config - Association configuration
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * const association = createBelongsToMany(Student, Course, {
 *   through: 'Enrollment',
 *   foreignKey: 'studentId',
 *   otherKey: 'courseId',
 *   as: 'courses'
 * });
 * ```
 */
export declare const createBelongsToMany: <S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: BelongsToManyConfig) => Association;
/**
 * Creates bidirectional many-to-many associations
 *
 * @param {ModelStatic<any>} model1 - First model
 * @param {ModelStatic<any>} model2 - Second model
 * @param {Object} config - Configuration object
 * @returns {Object} Object containing both associations
 *
 * @example
 * ```typescript
 * const { forward, reverse } = createManyToMany(Doctor, Patient, {
 *   through: 'Appointment',
 *   foreignKey1: 'doctorId',
 *   foreignKey2: 'patientId',
 *   as1: 'patients',
 *   as2: 'doctors'
 * });
 * ```
 */
export declare const createManyToMany: <M1 extends Model, M2 extends Model>(model1: ModelStatic<M1>, model2: ModelStatic<M2>, config: {
    through: string | ModelStatic<any>;
    foreignKey1: string;
    foreignKey2: string;
    as1: string;
    as2: string;
    onDelete?: CascadeAction;
    timestamps?: boolean;
}) => {
    forward: Association;
    reverse: Association;
};
/**
 * Creates a through/junction model with proper configuration
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Name of the through model
 * @param {ModelAttributes} attributes - Additional attributes for through model
 * @param {ThroughModelConfig} config - Through model configuration
 * @returns {ModelStatic<any>} Created through model
 *
 * @example
 * ```typescript
 * const Enrollment = createThroughModel(sequelize, 'Enrollment', {
 *   status: {
 *     type: DataTypes.ENUM('active', 'completed', 'dropped'),
 *     defaultValue: 'active'
 *   },
 *   enrolledAt: {
 *     type: DataTypes.DATE,
 *     defaultValue: DataTypes.NOW
 *   },
 *   grade: DataTypes.DECIMAL(3, 2)
 * }, {
 *   tableName: 'enrollments',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['studentId', 'courseId'], unique: true }
 *   ]
 * });
 * ```
 */
export declare const createThroughModel: (sequelize: Sequelize, modelName: string, attributes: ModelAttributes, config?: ThroughModelConfig) => ModelStatic<any>;
/**
 * Configures additional attributes for existing through model
 *
 * @param {ModelStatic<any>} throughModel - Through model to configure
 * @param {ModelAttributes} attributes - Additional attributes
 * @returns {ModelStatic<any>} Updated through model
 *
 * @example
 * ```typescript
 * const updatedModel = addThroughAttributes(Enrollment, {
 *   completedAt: DataTypes.DATE,
 *   certificateUrl: DataTypes.STRING
 * });
 * ```
 */
export declare const addThroughAttributes: (throughModel: ModelStatic<any>, attributes: ModelAttributes) => ModelStatic<any>;
/**
 * Creates optimized indexes for through table
 *
 * @param {ModelStatic<any>} throughModel - Through model
 * @param {Array} indexConfigs - Array of index configurations
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createThroughIndexes(Enrollment, [
 *   { fields: ['studentId'], name: 'idx_student' },
 *   { fields: ['courseId'], name: 'idx_course' },
 *   { fields: ['studentId', 'courseId'], unique: true, name: 'idx_unique_enrollment' },
 *   { fields: ['status', 'enrolledAt'], name: 'idx_status_date' }
 * ]);
 * ```
 */
export declare const createThroughIndexes: (throughModel: ModelStatic<any>, indexConfigs: Array<{
    fields: string[];
    unique?: boolean;
    name?: string;
    where?: WhereOptions;
}>) => Promise<void>;
/**
 * Queries through model with additional filtering
 *
 * @param {ModelStatic<any>} throughModel - Through model
 * @param {JunctionTableQuery} query - Query configuration
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const activeEnrollments = await queryThroughModel(Enrollment, {
 *   where: { status: 'active' },
 *   attributes: ['studentId', 'courseId', 'enrolledAt'],
 *   order: [['enrolledAt', 'DESC']],
 *   limit: 100
 * });
 * ```
 */
export declare const queryThroughModel: (throughModel: ModelStatic<any>, query?: JunctionTableQuery) => Promise<any[]>;
/**
 * Creates optimized include configuration to prevent N+1 queries
 *
 * @param {IncludeOptimizationConfig[]} includes - Array of include configurations
 * @returns {FindOptions} Optimized find options
 *
 * @example
 * ```typescript
 * const users = await User.findAll(
 *   optimizedInclude([
 *     {
 *       model: Post,
 *       as: 'posts',
 *       attributes: ['id', 'title', 'createdAt'],
 *       separate: true,
 *       limit: 10
 *     },
 *     {
 *       model: Profile,
 *       as: 'profile',
 *       attributes: { exclude: ['sensitiveData'] }
 *     }
 *   ])
 * );
 * ```
 */
export declare const optimizedInclude: (includes: IncludeOptimizationConfig[]) => FindOptions;
/**
 * Creates separate query strategy for avoiding cartesian products
 *
 * @param {IncludeOptimizationConfig[]} includes - Array of include configurations
 * @returns {FindOptions} Find options with separate queries
 *
 * @example
 * ```typescript
 * const users = await User.findAll(
 *   separateQueryInclude([
 *     { model: Post, as: 'posts', limit: 5 },
 *     { model: Comment, as: 'comments', limit: 10 }
 *   ])
 * );
 * ```
 */
export declare const separateQueryInclude: (includes: IncludeOptimizationConfig[]) => FindOptions;
/**
 * Creates eager loading strategy with depth limiting
 *
 * @param {ModelStatic<any>} model - Base model
 * @param {NestedIncludeConfig} config - Nested include configuration
 * @returns {FindOptions} Find options with depth-limited includes
 *
 * @example
 * ```typescript
 * const comments = await Comment.findAll(
 *   eagerLoadWithDepthLimit(Comment, {
 *     maxDepth: 3,
 *     preventCircular: true,
 *     optimizeCartesian: true
 *   })
 * );
 * ```
 */
export declare const eagerLoadWithDepthLimit: (model: ModelStatic<any>, config: NestedIncludeConfig) => FindOptions;
/**
 * Implements dataloader pattern for batched association loading
 *
 * @param {ModelStatic<any>} model - Model to load
 * @param {string} associationKey - Association name
 * @param {any[]} parentIds - Array of parent IDs
 * @returns {Promise<Map<any, any[]>>} Map of parent ID to associated records
 *
 * @example
 * ```typescript
 * const userIds = [1, 2, 3, 4, 5];
 * const postsMap = await batchLoadAssociations(Post, 'authorId', userIds);
 *
 * // postsMap.get(1) returns all posts for user 1
 * // postsMap.get(2) returns all posts for user 2, etc.
 * ```
 */
export declare const batchLoadAssociations: <T extends Model>(model: ModelStatic<T>, associationKey: string, parentIds: any[]) => Promise<Map<any, T[]>>;
/**
 * Optimizes include attributes to reduce data transfer
 *
 * @param {IncludeOptimizationConfig[]} includes - Include configurations
 * @param {string[]} essentialFields - Essential fields to always include
 * @returns {IncludeOptimizationConfig[]} Optimized includes
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludeAttributes([
 *   { model: User, as: 'author' },
 *   { model: Category, as: 'category' }
 * ], ['id', 'name', 'email']);
 * ```
 */
export declare const optimizeIncludeAttributes: (includes: IncludeOptimizationConfig[], essentialFields?: string[]) => IncludeOptimizationConfig[];
/**
 * Creates conditional include based on runtime criteria
 *
 * @param {Function} condition - Condition function
 * @param {IncludeOptimizationConfig} include - Include configuration
 * @returns {IncludeOptimizationConfig | null} Include config or null
 *
 * @example
 * ```typescript
 * const includes = [
 *   conditionalInclude(
 *     () => userHasPermission('view_posts'),
 *     { model: Post, as: 'posts' }
 *   ),
 *   conditionalInclude(
 *     () => isAdmin,
 *     { model: AuditLog, as: 'auditLogs' }
 *   )
 * ].filter(Boolean);
 * ```
 */
export declare const conditionalInclude: (condition: () => boolean, include: IncludeOptimizationConfig) => IncludeOptimizationConfig | null;
/**
 * Merges multiple include configurations intelligently
 *
 * @param {IncludeOptimizationConfig[][]} includeArrays - Arrays of includes to merge
 * @returns {IncludeOptimizationConfig[]} Merged includes
 *
 * @example
 * ```typescript
 * const baseIncludes = [{ model: User, as: 'author' }];
 * const adminIncludes = [{ model: AuditLog, as: 'logs' }];
 * const merged = mergeIncludes([baseIncludes, adminIncludes]);
 * ```
 */
export declare const mergeIncludes: (...includeArrays: IncludeOptimizationConfig[][]) => IncludeOptimizationConfig[];
/**
 * Creates paginated include with limit and offset
 *
 * @param {IncludeOptimizationConfig} include - Include configuration
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of records per page
 * @returns {IncludeOptimizationConfig} Paginated include
 *
 * @example
 * ```typescript
 * const users = await User.findAll({
 *   include: [
 *     paginatedInclude(
 *       { model: Post, as: 'posts', order: [['createdAt', 'DESC']] },
 *       1,
 *       10
 *     )
 *   ]
 * });
 * ```
 */
export declare const paginatedInclude: (include: IncludeOptimizationConfig, page: number, pageSize: number) => IncludeOptimizationConfig;
/**
 * Builds deeply nested include structure
 *
 * @param {Object} structure - Nested structure definition
 * @returns {Includeable[]} Nested includes
 *
 * @example
 * ```typescript
 * const includes = buildNestedIncludes({
 *   model: Post,
 *   as: 'posts',
 *   children: [
 *     {
 *       model: Comment,
 *       as: 'comments',
 *       children: [
 *         { model: User, as: 'commenter' }
 *       ]
 *     },
 *     { model: User, as: 'author' }
 *   ]
 * });
 * ```
 */
export declare const buildNestedIncludes: (structure: {
    model: ModelStatic<any>;
    as?: string;
    where?: WhereOptions;
    attributes?: any;
    required?: boolean;
    children?: any[];
}) => Includeable[];
/**
 * Flattens nested associations into separate queries
 *
 * @param {IncludeOptimizationConfig[]} includes - Nested includes
 * @returns {IncludeOptimizationConfig[]} Flattened includes with separate queries
 *
 * @example
 * ```typescript
 * const flattened = flattenNestedIncludes([
 *   {
 *     model: Post,
 *     as: 'posts',
 *     include: [
 *       { model: Comment, as: 'comments' }
 *     ]
 *   }
 * ]);
 * ```
 */
export declare const flattenNestedIncludes: (includes: IncludeOptimizationConfig[]) => IncludeOptimizationConfig[];
/**
 * Creates recursive include for tree structures
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {string} associationName - Name of the recursive association
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {Includeable} Recursive include configuration
 *
 * @example
 * ```typescript
 * const categories = await Category.findAll({
 *   include: [recursiveInclude(Category, 'children', 5)]
 * });
 * ```
 */
export declare const recursiveInclude: (model: ModelStatic<any>, associationName: string, maxDepth?: number) => Includeable;
/**
 * Creates scoped association with predefined filters
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationScopeConfig} config - Scope configuration
 * @returns {Association} Scoped association
 *
 * @example
 * ```typescript
 * createScopedAssociation(User, Post, {
 *   name: 'publishedPosts',
 *   scope: { status: 'published' },
 *   includeOptions: {
 *     as: 'publishedPosts',
 *     foreignKey: 'authorId'
 *   }
 * });
 *
 * // Usage
 * const user = await User.findByPk(1);
 * const publishedPosts = await user.getPublishedPosts();
 * ```
 */
export declare const createScopedAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config: AssociationScopeConfig) => Association;
/**
 * Creates dynamic scope for associations
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {string} scopeName - Name of the scope
 * @param {Function} scopeFunction - Function that returns scope
 * @returns {Association} Association with dynamic scope
 *
 * @example
 * ```typescript
 * createDynamicScope(User, Post, 'postsByStatus', (status: string) => ({
 *   status
 * }));
 *
 * // Usage (requires custom getter implementation)
 * const draftPosts = await user.getPostsByStatus('draft');
 * ```
 */
export declare const createDynamicScope: (source: ModelStatic<any>, target: ModelStatic<any>, scopeName: string, scopeFunction: (args?: any) => WhereOptions) => Association;
/**
 * Applies scope to existing association query
 *
 * @param {FindOptions} findOptions - Base find options
 * @param {WhereOptions} scope - Scope to apply
 * @returns {FindOptions} Find options with applied scope
 *
 * @example
 * ```typescript
 * const options = applyScopeToInclude(
 *   { include: [{ model: Post, as: 'posts' }] },
 *   { status: 'published', publishedAt: { [Op.lte]: new Date() } }
 * );
 * ```
 */
export declare const applyScopeToInclude: (findOptions: FindOptions, scope: WhereOptions) => FindOptions;
/**
 * Creates polymorphic belongsTo association
 *
 * @param {ModelStatic<any>} source - Source model (e.g., Comment)
 * @param {ModelStatic<any>[]} targets - Target models (e.g., [Post, Video])
 * @param {PolymorphicConfig} config - Polymorphic configuration
 * @returns {Association[]} Array of associations
 *
 * @example
 * ```typescript
 * createPolymorphicAssociation(Comment, [Post, Video], {
 *   foreignKey: 'commentableId',
 *   discriminatorField: 'commentableType',
 *   as: 'commentable',
 *   constraints: false
 * });
 * ```
 */
export declare const createPolymorphicAssociation: (source: ModelStatic<any>, targets: ModelStatic<any>[], config: PolymorphicConfig) => Association[];
/**
 * Creates reverse polymorphic hasMany association
 *
 * @param {ModelStatic<any>} source - Source model (e.g., Post)
 * @param {ModelStatic<any>} target - Target model (e.g., Comment)
 * @param {PolymorphicConfig} config - Polymorphic configuration
 * @returns {Association} Polymorphic association
 *
 * @example
 * ```typescript
 * createReversePolymorphic(Post, Comment, {
 *   foreignKey: 'commentableId',
 *   discriminatorField: 'commentableType',
 *   as: 'comments',
 *   constraints: false
 * });
 * ```
 */
export declare const createReversePolymorphic: (source: ModelStatic<any>, target: ModelStatic<any>, config: PolymorphicConfig) => Association;
/**
 * Queries polymorphic associations with type resolution
 *
 * @param {ModelStatic<any>} model - Model with polymorphic associations
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Records with resolved polymorphic associations
 *
 * @example
 * ```typescript
 * const comments = await queryPolymorphic(Comment, {
 *   discriminatorField: 'commentableType',
 *   foreignKey: 'commentableId',
 *   targetModels: { Post, Video },
 *   includeAll: true
 * });
 * ```
 */
export declare const queryPolymorphic: (model: ModelStatic<any>, options: {
    discriminatorField: string;
    foreignKey: string;
    targetModels: Record<string, ModelStatic<any>>;
    where?: WhereOptions;
    includeAll?: boolean;
}) => Promise<any[]>;
/**
 * Creates self-referential association (e.g., tree structure)
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {SelfReferentialConfig} config - Self-referential configuration
 * @returns {Object} Object containing parent and children associations
 *
 * @example
 * ```typescript
 * const { parent, children } = createSelfReferential(Category, {
 *   foreignKey: 'parentId',
 *   as: 'children',
 *   inverse: 'parent',
 *   hierarchyType: 'tree'
 * });
 * ```
 */
export declare const createSelfReferential: (model: ModelStatic<any>, config: SelfReferentialConfig) => {
    parent: Association;
    children: Association;
};
/**
 * Queries hierarchical data with all descendants
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {any} rootId - Root record ID
 * @param {Object} options - Query options
 * @returns {Promise<any>} Root record with all descendants
 *
 * @example
 * ```typescript
 * const rootCategory = await queryHierarchy(Category, rootId, {
 *   childrenAssociation: 'children',
 *   maxDepth: 10,
 *   includeRoot: true
 * });
 * ```
 */
export declare const queryHierarchy: (model: ModelStatic<any>, rootId: any, options: {
    childrenAssociation: string;
    maxDepth?: number;
    includeRoot?: boolean;
}) => Promise<any>;
/**
 * Queries all ancestors of a record (path to root)
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {any} recordId - Record ID
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Array of ancestors from child to root
 *
 * @example
 * ```typescript
 * const ancestors = await queryAncestors(Category, childId, {
 *   parentAssociation: 'parent',
 *   includeRoot: true
 * });
 * ```
 */
export declare const queryAncestors: (model: ModelStatic<any>, recordId: any, options: {
    parentAssociation: string;
    foreignKey: string;
    includeRoot?: boolean;
}) => Promise<any[]>;
/**
 * Queries siblings of a record in hierarchy
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {any} recordId - Record ID
 * @param {string} foreignKey - Foreign key field name
 * @returns {Promise<any[]>} Array of sibling records
 *
 * @example
 * ```typescript
 * const siblings = await querySiblings(Category, categoryId, 'parentId');
 * ```
 */
export declare const querySiblings: (model: ModelStatic<any>, recordId: any, foreignKey: string) => Promise<any[]>;
/**
 * Adds record to junction table with additional attributes
 *
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {any} sourceId - Source record ID
 * @param {ModelStatic<any>} targetModel - Target model
 * @param {any} targetId - Target record ID
 * @param {Object} throughAttributes - Additional junction table attributes
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created junction record
 *
 * @example
 * ```typescript
 * const enrollment = await addToJunction(
 *   Student,
 *   studentId,
 *   Course,
 *   courseId,
 *   { status: 'active', enrolledAt: new Date(), grade: null },
 *   transaction
 * );
 * ```
 */
export declare const addToJunction: (sourceModel: ModelStatic<any>, sourceId: any, targetModel: ModelStatic<any>, targetId: any, throughAttributes?: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * Removes record from junction table
 *
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {any} sourceId - Source record ID
 * @param {ModelStatic<any>} targetModel - Target model
 * @param {any} targetId - Target record ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of removed records
 *
 * @example
 * ```typescript
 * await removeFromJunction(Student, studentId, Course, courseId, transaction);
 * ```
 */
export declare const removeFromJunction: (sourceModel: ModelStatic<any>, sourceId: any, targetModel: ModelStatic<any>, targetId: any, transaction?: Transaction) => Promise<number>;
/**
 * Updates junction table attributes
 *
 * @param {ModelStatic<any>} throughModel - Through/junction model
 * @param {Object} where - Where clause to find junction record
 * @param {Object} updates - Attributes to update
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated junction record
 *
 * @example
 * ```typescript
 * await updateJunctionAttributes(
 *   Enrollment,
 *   { studentId, courseId },
 *   { status: 'completed', grade: 3.8, completedAt: new Date() },
 *   transaction
 * );
 * ```
 */
export declare const updateJunctionAttributes: (throughModel: ModelStatic<any>, where: WhereOptions, updates: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * Queries junction table with filters
 *
 * @param {ModelStatic<any>} throughModel - Through/junction model
 * @param {JunctionTableQuery} query - Query configuration
 * @returns {Promise<any[]>} Junction table records
 *
 * @example
 * ```typescript
 * const activeEnrollments = await queryJunctionTable(Enrollment, {
 *   where: { status: 'active' },
 *   attributes: ['studentId', 'courseId', 'enrolledAt', 'grade'],
 *   order: [['enrolledAt', 'DESC']],
 *   limit: 50
 * });
 * ```
 */
export declare const queryJunctionTable: (throughModel: ModelStatic<any>, query: JunctionTableQuery) => Promise<any[]>;
/**
 * Validates association integrity
 *
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {ModelStatic<any>} targetModel - Target model
 * @param {string} foreignKey - Foreign key field
 * @returns {Promise<AssociationValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAssociationIntegrity(Post, User, 'authorId');
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateAssociationIntegrity: (sourceModel: ModelStatic<any>, targetModel: ModelStatic<any>, foreignKey: string) => Promise<AssociationValidationResult>;
/**
 * Validates many-to-many junction table integrity
 *
 * @param {ModelStatic<any>} throughModel - Through/junction model
 * @param {string} foreignKey1 - First foreign key
 * @param {string} foreignKey2 - Second foreign key
 * @param {ModelStatic<any>} model1 - First model
 * @param {ModelStatic<any>} model2 - Second model
 * @returns {Promise<AssociationValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateJunctionTableIntegrity(
 *   Enrollment,
 *   'studentId',
 *   'courseId',
 *   Student,
 *   Course
 * );
 * ```
 */
export declare const validateJunctionTableIntegrity: (throughModel: ModelStatic<any>, foreignKey1: string, foreignKey2: string, model1: ModelStatic<any>, model2: ModelStatic<any>) => Promise<AssociationValidationResult>;
/**
 * Checks for circular references in associations
 *
 * @param {ModelStatic<any>} model - Model to check
 * @param {string} associationPath - Path of associations to check
 * @returns {Promise<boolean>} True if circular reference exists
 *
 * @example
 * ```typescript
 * const hasCircular = await checkCircularReferences(Category, 'parent.parent.parent');
 * ```
 */
export declare const checkCircularReferences: (model: ModelStatic<any>, associationPath: string) => Promise<boolean>;
/**
 * Configures cascade delete for association
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {CascadeConfig} config - Cascade configuration
 * @returns {Association} Configured association
 *
 * @example
 * ```typescript
 * configureCascadeDelete(User, Post, {
 *   onDelete: CascadeAction.CASCADE,
 *   onUpdate: CascadeAction.CASCADE,
 *   softDelete: true,
 *   cascadeHooks: true
 * });
 * ```
 */
export declare const configureCascadeDelete: (source: ModelStatic<any>, target: ModelStatic<any>, config: CascadeConfig) => Association;
/**
 * Performs cascade delete operation manually
 *
 * @param {Model} instance - Instance to delete
 * @param {string[]} associations - Association names to cascade
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * await cascadeDelete(user, ['posts', 'comments', 'profile'], transaction);
 * await user.destroy({ transaction });
 * ```
 */
export declare const cascadeDelete: (instance: Model, associations: string[], transaction?: Transaction) => Promise<void>;
/**
 * Performs soft cascade delete (sets foreign keys to null)
 *
 * @param {Model} instance - Instance to delete
 * @param {string[]} associations - Association names to cascade
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const category = await Category.findByPk(categoryId);
 * await softCascadeDelete(category, ['subcategories', 'products'], transaction);
 * ```
 */
export declare const softCascadeDelete: (instance: Model, associations: string[], transaction?: Transaction) => Promise<void>;
/**
 * Counts associated records efficiently
 *
 * @param {Model} instance - Model instance
 * @param {string} associationName - Name of association
 * @param {AssociationCountConfig} config - Count configuration
 * @returns {Promise<number>} Count of associated records
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(userId);
 * const postCount = await countAssociations(user, 'posts', {
 *   where: { status: 'published' }
 * });
 * ```
 */
export declare const countAssociations: (instance: Model, associationName: string, config?: AssociationCountConfig) => Promise<number>;
/**
 * Adds association count as virtual attribute
 *
 * @param {FindOptions} findOptions - Base find options
 * @param {string} associationName - Name of association to count
 * @param {string} countAlias - Alias for count column
 * @returns {FindOptions} Find options with count attribute
 *
 * @example
 * ```typescript
 * const users = await User.findAll(
 *   includeAssociationCount({}, 'posts', 'postCount')
 * );
 * // users[0].dataValues.postCount will contain the count
 * ```
 */
export declare const includeAssociationCount: (findOptions: FindOptions, associationName: string, countAlias: string) => FindOptions;
/**
 * Batch counts associations for multiple instances
 *
 * @param {ModelStatic<any>} model - Model class
 * @param {any[]} instanceIds - Array of instance IDs
 * @param {string} associationName - Name of association
 * @param {WhereOptions} where - Optional where clause for association
 * @returns {Promise<Map<any, number>>} Map of instance ID to count
 *
 * @example
 * ```typescript
 * const userIds = [1, 2, 3, 4, 5];
 * const postCounts = await batchCountAssociations(
 *   User,
 *   userIds,
 *   'posts',
 *   { status: 'published' }
 * );
 * // postCounts.get(1) returns post count for user 1
 * ```
 */
export declare const batchCountAssociations: (model: ModelStatic<any>, instanceIds: any[], associationName: string, where?: WhereOptions) => Promise<Map<any, number>>;
/**
 * Syncs many-to-many relationships (replaces all associations)
 *
 * @param {Model} instance - Source instance
 * @param {string} associationName - Association name
 * @param {any[]} targetIds - Array of target IDs
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(studentId);
 * await syncManyToMany(student, 'courses', [courseId1, courseId2, courseId3], transaction);
 * ```
 */
export declare const syncManyToMany: (instance: Model, associationName: string, targetIds: any[], transaction?: Transaction) => Promise<void>;
/**
 * Adds multiple records to many-to-many relationship
 *
 * @param {Model} instance - Source instance
 * @param {string} associationName - Association name
 * @param {any[]} targetIds - Array of target IDs to add
 * @param {Record<string, any>} throughAttributes - Attributes for junction table
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(studentId);
 * await addManyToMany(
 *   student,
 *   'courses',
 *   [courseId1, courseId2],
 *   { enrolledAt: new Date(), status: 'active' },
 *   transaction
 * );
 * ```
 */
export declare const addManyToMany: (instance: Model, associationName: string, targetIds: any[], throughAttributes?: Record<string, any>, transaction?: Transaction) => Promise<void>;
/**
 * Removes multiple records from many-to-many relationship
 *
 * @param {Model} instance - Source instance
 * @param {string} associationName - Association name
 * @param {any[]} targetIds - Array of target IDs to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(studentId);
 * await removeManyToMany(student, 'courses', [courseId1, courseId2], transaction);
 * ```
 */
export declare const removeManyToMany: (instance: Model, associationName: string, targetIds: any[], transaction?: Transaction) => Promise<void>;
/**
 * Checks if many-to-many relationship exists
 *
 * @param {Model} instance - Source instance
 * @param {string} associationName - Association name
 * @param {any} targetId - Target ID to check
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} True if relationship exists
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(studentId);
 * const isEnrolled = await hasManyToMany(student, 'courses', courseId);
 * ```
 */
export declare const hasManyToMany: (instance: Model, associationName: string, targetId: any, transaction?: Transaction) => Promise<boolean>;
/**
 * Gets association statistics
 *
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {ModelStatic<any>} targetModel - Target model
 * @param {string} foreignKey - Foreign key field
 * @returns {Promise<AssociationStats>} Association statistics
 *
 * @example
 * ```typescript
 * const stats = await getAssociationStats(Post, User, 'authorId');
 * console.log(`Average posts per user: ${stats.averageRelationships}`);
 * ```
 */
export declare const getAssociationStats: (sourceModel: ModelStatic<any>, targetModel: ModelStatic<any>, foreignKey: string) => Promise<AssociationStats>;
//# sourceMappingURL=database-associations-kit.d.ts.map