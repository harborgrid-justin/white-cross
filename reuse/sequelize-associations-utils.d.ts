/**
 * @fileoverview Sequelize Association Utilities
 * @module reuse/sequelize-associations-utils
 * @description Comprehensive association utilities for Sequelize v6 covering hasOne, hasMany,
 * belongsTo, belongsToMany, through models, polymorphic associations, and relationship management.
 *
 * Key Features:
 * - HasOne/HasMany relationship helpers
 * - BelongsTo association utilities
 * - BelongsToMany (junction table) helpers
 * - Through model utilities
 * - Association alias management
 * - Include and join query builders
 * - Cascade operation utilities
 * - Association scope helpers
 * - Polymorphic association patterns
 * - Self-referencing associations
 * - Circular association handlers
 * - Association validation
 * - Association testing helpers
 * - Association migration utilities
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Access control through association scopes
 * - HIPAA-compliant relationship filtering
 * - Audit trail for association changes
 * - Soft delete cascade support
 * - Permission-based association loading
 *
 * @example Basic usage
 * ```typescript
 * import { createHasMany, createBelongsTo, setupAssociations } from './sequelize-associations-utils';
 *
 * // Define associations
 * createHasMany(User, Post, { as: 'posts', foreignKey: 'authorId' });
 * createBelongsTo(Post, User, { as: 'author', foreignKey: 'authorId' });
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createPolymorphicAssociation,
 *   createSelfReferencing,
 *   createBelongsToManyThrough
 * } from './sequelize-associations-utils';
 *
 * // Polymorphic association
 * createPolymorphicAssociation(Comment, ['Post', 'Article'], 'commentable');
 *
 * // Self-referencing
 * createSelfReferencing(User, 'followers', 'following');
 * ```
 *
 * LOC: AS92P4N156
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: models, services, repositories
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Association, Includeable, Transaction, WhereOptions, AssociationScope } from 'sequelize';
/**
 * @interface AssociationConfig
 * @description Configuration for creating associations
 */
export interface AssociationConfig {
    /** Association alias */
    as?: string;
    /** Foreign key field */
    foreignKey?: string;
    /** Target key field */
    targetKey?: string;
    /** Source key field */
    sourceKey?: string;
    /** Association scope */
    scope?: AssociationScope;
    /** Cascade on delete */
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    /** Cascade on update */
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    /** Association hooks */
    hooks?: boolean;
    /** Constraints */
    constraints?: boolean;
}
/**
 * @interface ThroughConfig
 * @description Configuration for through/junction tables
 */
export interface ThroughConfig {
    /** Through model */
    model: ModelStatic<any>;
    /** Unique constraint */
    unique?: boolean;
    /** Scope on through table */
    scope?: AssociationScope;
    /** Additional attributes */
    attributes?: string[];
}
/**
 * @interface PolymorphicConfig
 * @description Configuration for polymorphic associations
 */
export interface PolymorphicConfig {
    /** Polymorphic field name */
    polymorphicType: string;
    /** Polymorphic ID field */
    polymorphicId: string;
    /** Allowed types */
    allowedTypes?: string[];
    /** Constraints */
    constraints?: boolean;
}
/**
 * @interface IncludeConfig
 * @description Advanced include configuration
 */
export interface IncludeConfig {
    /** Model to include */
    model: ModelStatic<any>;
    /** Association alias */
    as?: string;
    /** Where conditions */
    where?: WhereOptions;
    /** Attributes to select */
    attributes?: string[];
    /** Required (INNER JOIN) */
    required?: boolean;
    /** Separate query */
    separate?: boolean;
    /** Nested includes */
    include?: IncludeConfig[];
    /** Order */
    order?: any;
    /** Limit */
    limit?: number;
}
/**
 * @interface CascadeOptions
 * @description Options for cascade operations
 */
export interface CascadeOptions {
    /** Include associations to cascade */
    associations: string[];
    /** Transaction */
    transaction?: Transaction;
    /** Force delete (hard delete) */
    force?: boolean;
    /** Cascade depth limit */
    depth?: number;
}
/**
 * @function createHasOne
 * @description Creates a hasOne association between models
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createHasOne(User, Profile, {
 *   as: 'profile',
 *   foreignKey: 'userId',
 *   onDelete: 'CASCADE'
 * });
 *
 * // Usage
 * const user = await User.findOne({
 *   include: [{ model: Profile, as: 'profile' }]
 * });
 * ```
 */
export declare function createHasOne<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config?: AssociationConfig): Association<S, T>;
/**
 * @function createHasOneWithScope
 * @description Creates a hasOne association with a predefined scope
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @param {WhereOptions} scopeCondition - Scope conditions
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createHasOneWithScope(
 *   User,
 *   Profile,
 *   { as: 'activeProfile', foreignKey: 'userId' },
 *   { status: 'active' }
 * );
 * ```
 */
export declare function createHasOneWithScope<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: AssociationConfig, scopeCondition: WhereOptions): Association<S, T>;
/**
 * @function createHasMany
 * @description Creates a hasMany association between models
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createHasMany(User, Post, {
 *   as: 'posts',
 *   foreignKey: 'authorId',
 *   onDelete: 'CASCADE'
 * });
 *
 * // Usage
 * const user = await User.findOne({
 *   include: [{ model: Post, as: 'posts' }]
 * });
 * ```
 */
export declare function createHasMany<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config?: AssociationConfig): Association<S, T>;
/**
 * @function createHasManyWithOrder
 * @description Creates a hasMany association with default ordering
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @param {any} order - Default order
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createHasManyWithOrder(
 *   User,
 *   Post,
 *   { as: 'posts', foreignKey: 'authorId' },
 *   [['createdAt', 'DESC']]
 * );
 * ```
 */
export declare function createHasManyWithOrder<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: AssociationConfig, order: any): Association<S, T>;
/**
 * @function createHasManyWithLimit
 * @description Creates a hasMany association with default limit
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @param {number} limit - Default limit
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * // Get only 5 most recent posts
 * createHasManyWithLimit(
 *   User,
 *   Post,
 *   { as: 'recentPosts', foreignKey: 'authorId' },
 *   5
 * );
 * ```
 */
export declare function createHasManyWithLimit<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: AssociationConfig, limit: number): Association<S, T>;
/**
 * @function createBelongsTo
 * @description Creates a belongsTo association between models
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createBelongsTo(Post, User, {
 *   as: 'author',
 *   foreignKey: 'authorId',
 *   targetKey: 'id'
 * });
 *
 * // Usage
 * const post = await Post.findOne({
 *   include: [{ model: User, as: 'author' }]
 * });
 * ```
 */
export declare function createBelongsTo<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config?: AssociationConfig): Association<S, T>;
/**
 * @function createBelongsToRequired
 * @description Creates a belongsTo association that's always required in queries
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createBelongsToRequired(Post, User, {
 *   as: 'author',
 *   foreignKey: 'authorId'
 * });
 * ```
 */
export declare function createBelongsToRequired<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, config: AssociationConfig): Association<S, T>;
/**
 * @function createBelongsToMany
 * @description Creates a belongsToMany association with junction table
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {ThroughConfig} through - Through table configuration
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createBelongsToMany(
 *   Student,
 *   Course,
 *   { model: StudentCourse, unique: true },
 *   { as: 'courses', foreignKey: 'studentId' }
 * );
 *
 * // Usage
 * const student = await Student.findOne({
 *   include: [{ model: Course, as: 'courses' }]
 * });
 * ```
 */
export declare function createBelongsToMany<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, through: ThroughConfig, config?: AssociationConfig): Association<S, T>;
/**
 * @function createBidirectionalBelongsToMany
 * @description Creates bidirectional belongsToMany associations
 *
 * @template S, T
 * @param {ModelStatic<S>} model1 - First model
 * @param {ModelStatic<T>} model2 - Second model
 * @param {ThroughConfig} through - Through table configuration
 * @param {object} config - Association configuration for both sides
 * @returns {[Association<S, T>, Association<T, S>]} Both associations
 *
 * @example
 * ```typescript
 * createBidirectionalBelongsToMany(
 *   User,
 *   Role,
 *   { model: UserRole },
 *   {
 *     model1: { as: 'roles', foreignKey: 'userId' },
 *     model2: { as: 'users', foreignKey: 'roleId' }
 *   }
 * );
 * ```
 */
export declare function createBidirectionalBelongsToMany<S extends Model, T extends Model>(model1: ModelStatic<S>, model2: ModelStatic<T>, through: ThroughConfig, config: {
    model1: AssociationConfig;
    model2: AssociationConfig;
}): [Association<S, T>, Association<T, S>];
/**
 * @function createBelongsToManyThrough
 * @description Creates belongsToMany with additional through table attributes
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {ThroughConfig} through - Through configuration with attributes
 * @param {AssociationConfig} config - Association configuration
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createBelongsToManyThrough(
 *   Student,
 *   Course,
 *   {
 *     model: Enrollment,
 *     attributes: ['enrolledAt', 'grade', 'status']
 *   },
 *   { as: 'courses', foreignKey: 'studentId' }
 * );
 * ```
 */
export declare function createBelongsToManyThrough<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, through: ThroughConfig, config: AssociationConfig): Association<S, T>;
/**
 * @function createPolymorphicAssociation
 * @description Creates a polymorphic association (commentable, likeable, etc)
 *
 * @template S
 * @param {ModelStatic<S>} source - Source model
 * @param {string[]} targetModels - Array of target model names
 * @param {string} polymorphicAs - Polymorphic field name
 * @param {PolymorphicConfig} config - Polymorphic configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Comment can belong to Post or Article
 * createPolymorphicAssociation(
 *   Comment,
 *   ['Post', 'Article'],
 *   'commentable',
 *   { polymorphicType: 'commentableType', polymorphicId: 'commentableId' }
 * );
 *
 * // Usage
 * await Comment.create({
 *   commentableType: 'Post',
 *   commentableId: postId,
 *   content: 'Great post!'
 * });
 * ```
 */
export declare function createPolymorphicAssociation<S extends Model>(source: ModelStatic<S>, targetModels: string[], polymorphicAs: string, config: PolymorphicConfig): void;
/**
 * @function getPolymorphicAssociation
 * @description Gets the polymorphic association for an instance
 *
 * @template S
 * @param {S} instance - Model instance
 * @param {Record<string, ModelStatic<any>>} models - Models registry
 * @returns {Promise<Model | null>} Associated model or null
 *
 * @example
 * ```typescript
 * const comment = await Comment.findByPk(1);
 * const commentable = await getPolymorphicAssociation(comment, models);
 * // Returns Post or Article instance
 * ```
 */
export declare function getPolymorphicAssociation<S extends Model>(instance: S, models: Record<string, ModelStatic<any>>): Promise<Model | null>;
/**
 * @function setPolymorphicAssociation
 * @description Sets the polymorphic association for an instance
 *
 * @template S, T
 * @param {S} instance - Model instance
 * @param {T} target - Target model instance
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<S>} Updated instance
 *
 * @example
 * ```typescript
 * const comment = Comment.build({ content: 'Nice!' });
 * const post = await Post.findByPk(1);
 * await setPolymorphicAssociation(comment, post);
 * await comment.save();
 * ```
 */
export declare function setPolymorphicAssociation<S extends Model, T extends Model>(instance: S, target: T, transaction?: Transaction): Promise<S>;
/**
 * @function createSelfReferencing
 * @description Creates self-referencing associations (followers/following)
 *
 * @template M
 * @param {ModelStatic<M>} model - Model
 * @param {string} asOne - First association alias
 * @param {string} asTwo - Second association alias
 * @param {ModelStatic<any>} through - Through model
 * @param {object} foreignKeys - Foreign key names
 * @returns {[Association<M, M>, Association<M, M>]} Both associations
 *
 * @example
 * ```typescript
 * createSelfReferencing(
 *   User,
 *   'followers',
 *   'following',
 *   UserFollower,
 *   { one: 'followerId', two: 'followingId' }
 * );
 *
 * // Usage
 * const user = await User.findOne({
 *   include: [
 *     { model: User, as: 'followers' },
 *     { model: User, as: 'following' }
 *   ]
 * });
 * ```
 */
export declare function createSelfReferencing<M extends Model>(model: ModelStatic<M>, asOne: string, asTwo: string, through: ModelStatic<any>, foreignKeys: {
    one: string;
    two: string;
}): [Association<M, M>, Association<M, M>];
/**
 * @function createHierarchicalAssociation
 * @description Creates hierarchical self-referencing association (parent/children)
 *
 * @template M
 * @param {ModelStatic<M>} model - Model
 * @param {object} config - Configuration
 * @returns {[Association<M, M>, Association<M, M>]} Parent and children associations
 *
 * @example
 * ```typescript
 * createHierarchicalAssociation(Category, {
 *   parentAs: 'parent',
 *   childrenAs: 'children',
 *   foreignKey: 'parentId'
 * });
 *
 * // Usage
 * const category = await Category.findOne({
 *   include: [
 *     { model: Category, as: 'parent' },
 *     { model: Category, as: 'children' }
 *   ]
 * });
 * ```
 */
export declare function createHierarchicalAssociation<M extends Model>(model: ModelStatic<M>, config?: {
    parentAs?: string;
    childrenAs?: string;
    foreignKey?: string;
}): [Association<M, M>, Association<M, M>];
/**
 * @function buildInclude
 * @description Builds a comprehensive include configuration
 *
 * @param {IncludeConfig} config - Include configuration
 * @returns {Includeable} Sequelize include option
 *
 * @example
 * ```typescript
 * const include = buildInclude({
 *   model: Post,
 *   as: 'posts',
 *   where: { status: 'published' },
 *   attributes: ['id', 'title'],
 *   required: true,
 *   include: [
 *     { model: Comment, as: 'comments', limit: 5 }
 *   ]
 * });
 *
 * const users = await User.findAll({ include: [include] });
 * ```
 */
export declare function buildInclude(config: IncludeConfig): Includeable;
/**
 * @function buildNestedInclude
 * @description Builds deeply nested include configurations
 *
 * @param {IncludeConfig[]} configs - Array of include configurations
 * @returns {Includeable[]} Array of Sequelize include options
 *
 * @example
 * ```typescript
 * const includes = buildNestedInclude([
 *   {
 *     model: Post,
 *     as: 'posts',
 *     include: [
 *       {
 *         model: Comment,
 *         as: 'comments',
 *         include: [{ model: User, as: 'author' }]
 *       }
 *     ]
 *   }
 * ]);
 * ```
 */
export declare function buildNestedInclude(configs: IncludeConfig[]): Includeable[];
/**
 * @function buildRequiredInclude
 * @description Builds an INNER JOIN include (required)
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {WhereOptions} where - Where conditions
 * @returns {Includeable} Required include option
 *
 * @example
 * ```typescript
 * const include = buildRequiredInclude(
 *   Profile,
 *   'profile',
 *   { verified: true }
 * );
 *
 * // Only returns users with verified profiles
 * const users = await User.findAll({ include: [include] });
 * ```
 */
export declare function buildRequiredInclude(model: ModelStatic<any>, as: string, where?: WhereOptions): Includeable;
/**
 * @function buildSeparateInclude
 * @description Builds a separate query include to avoid N+1
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {WhereOptions} where - Where conditions
 * @param {any} order - Order clause
 * @param {number} limit - Limit
 * @returns {Includeable} Separate include option
 *
 * @example
 * ```typescript
 * const include = buildSeparateInclude(
 *   Post,
 *   'posts',
 *   { status: 'published' },
 *   [['createdAt', 'DESC']],
 *   5
 * );
 * ```
 */
export declare function buildSeparateInclude(model: ModelStatic<any>, as: string, where?: WhereOptions, order?: any, limit?: number): Includeable;
/**
 * @function buildCountInclude
 * @description Builds an include that only counts associations
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {string} countAs - Alias for count
 * @returns {any} Include with count
 *
 * @example
 * ```typescript
 * const include = buildCountInclude(Post, 'posts', 'postCount');
 *
 * const users = await User.findAll({
 *   attributes: {
 *     include: [
 *       [sequelize.fn('COUNT', sequelize.col('posts.id')), 'postCount']
 *     ]
 *   },
 *   include: [{ model: Post, as: 'posts', attributes: [] }],
 *   group: ['User.id']
 * });
 * ```
 */
export declare function buildCountInclude(model: ModelStatic<any>, as: string, countAs: string): any;
/**
 * @function cascadeDelete
 * @description Performs a cascade delete including associations
 *
 * @template M
 * @param {M} instance - Model instance to delete
 * @param {CascadeOptions} options - Cascade options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * await cascadeDelete(user, {
 *   associations: ['posts', 'comments', 'profile'],
 *   force: true
 * });
 * ```
 */
export declare function cascadeDelete<M extends Model>(instance: M, options: CascadeOptions): Promise<void>;
/**
 * @function cascadeUpdate
 * @description Performs a cascade update including associations
 *
 * @template M
 * @param {M} instance - Model instance to update
 * @param {Partial<M>} values - Values to update
 * @param {CascadeOptions} options - Cascade options
 * @returns {Promise<M>} Updated instance
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * await cascadeUpdate(
 *   user,
 *   { status: 'inactive' },
 *   { associations: ['posts'], transaction: t }
 * );
 * ```
 */
export declare function cascadeUpdate<M extends Model>(instance: M, values: Partial<M>, options: CascadeOptions & {
    cascadeValues?: Record<string, any>;
}): Promise<M>;
/**
 * @function createScopedAssociation
 * @description Creates an association with a predefined scope
 *
 * @template S, T
 * @param {ModelStatic<S>} source - Source model
 * @param {ModelStatic<T>} target - Target model
 * @param {'hasOne' | 'hasMany' | 'belongsTo'} type - Association type
 * @param {AssociationConfig} config - Association configuration
 * @param {AssociationScope} scope - Association scope
 * @returns {Association<S, T>} Created association
 *
 * @example
 * ```typescript
 * createScopedAssociation(
 *   User,
 *   Post,
 *   'hasMany',
 *   { as: 'publishedPosts', foreignKey: 'authorId' },
 *   { status: 'published' }
 * );
 * ```
 */
export declare function createScopedAssociation<S extends Model, T extends Model>(source: ModelStatic<S>, target: ModelStatic<T>, type: 'hasOne' | 'hasMany' | 'belongsTo', config: AssociationConfig, scope: AssociationScope): Association<S, T>;
/**
 * @function addAssociationScope
 * @description Adds a scope to an existing association
 *
 * @param {Association<any, any>} association - Association to modify
 * @param {AssociationScope} scope - Scope to add
 * @returns {Association<any, any>} Modified association
 *
 * @example
 * ```typescript
 * const assoc = User.associations.posts;
 * addAssociationScope(assoc, { status: 'published' });
 * ```
 */
export declare function addAssociationScope(association: Association<any, any>, scope: AssociationScope): Association<any, any>;
/**
 * @function getThroughModel
 * @description Gets the through model from a belongsToMany association
 *
 * @param {Association<any, any>} association - BelongsToMany association
 * @returns {ModelStatic<any>} Through model
 *
 * @example
 * ```typescript
 * const assoc = Student.associations.courses;
 * const StudentCourse = getThroughModel(assoc);
 * ```
 */
export declare function getThroughModel(association: Association<any, any>): ModelStatic<any>;
/**
 * @function updateThroughAttributes
 * @description Updates attributes on a through table
 *
 * @template S, T
 * @param {S} source - Source instance
 * @param {T} target - Target instance
 * @param {string} associationName - Association name
 * @param {Record<string, any>} attributes - Attributes to update
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(1);
 * const course = await Course.findByPk(101);
 *
 * await updateThroughAttributes(
 *   student,
 *   course,
 *   'courses',
 *   { grade: 'A', completedAt: new Date() }
 * );
 * ```
 */
export declare function updateThroughAttributes<S extends Model, T extends Model>(source: S, target: T, associationName: string, attributes: Record<string, any>, transaction?: Transaction): Promise<void>;
/**
 * @function getThroughAttributes
 * @description Gets attributes from a through table
 *
 * @template S, T
 * @param {S} source - Source instance
 * @param {T} target - Target instance
 * @param {string} associationName - Association name
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Through attributes
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(1);
 * const course = await Course.findByPk(101);
 *
 * const enrollment = await getThroughAttributes(student, course, 'courses');
 * console.log(enrollment.grade, enrollment.enrolledAt);
 * ```
 */
export declare function getThroughAttributes<S extends Model, T extends Model>(source: S, target: T, associationName: string, transaction?: Transaction): Promise<any>;
/**
 * @function validateAssociationExists
 * @description Validates that an association exists on a model
 *
 * @param {ModelStatic<any>} model - Model to check
 * @param {string} associationName - Association name
 * @returns {boolean} True if association exists
 * @throws {Error} If association doesn't exist
 *
 * @example
 * ```typescript
 * validateAssociationExists(User, 'posts');
 * validateAssociationExists(User, 'invalidAssoc'); // throws
 * ```
 */
export declare function validateAssociationExists(model: ModelStatic<any>, associationName: string): boolean;
/**
 * @function getAssociationType
 * @description Gets the type of an association
 *
 * @param {ModelStatic<any>} model - Model
 * @param {string} associationName - Association name
 * @returns {string} Association type
 *
 * @example
 * ```typescript
 * const type = getAssociationType(User, 'posts');
 * // Returns: 'HasMany'
 * ```
 */
export declare function getAssociationType(model: ModelStatic<any>, associationName: string): string;
/**
 * @function isOneToOneAssociation
 * @description Checks if association is one-to-one
 *
 * @param {ModelStatic<any>} model - Model
 * @param {string} associationName - Association name
 * @returns {boolean} True if one-to-one
 *
 * @example
 * ```typescript
 * if (isOneToOneAssociation(User, 'profile')) {
 *   // Handle one-to-one
 * }
 * ```
 */
export declare function isOneToOneAssociation(model: ModelStatic<any>, associationName: string): boolean;
/**
 * @function isOneToManyAssociation
 * @description Checks if association is one-to-many
 *
 * @param {ModelStatic<any>} model - Model
 * @param {string} associationName - Association name
 * @returns {boolean} True if one-to-many
 *
 * @example
 * ```typescript
 * if (isOneToManyAssociation(User, 'posts')) {
 *   // Handle one-to-many
 * }
 * ```
 */
export declare function isOneToManyAssociation(model: ModelStatic<any>, associationName: string): boolean;
/**
 * @function isManyToManyAssociation
 * @description Checks if association is many-to-many
 *
 * @param {ModelStatic<any>} model - Model
 * @param {string} associationName - Association name
 * @returns {boolean} True if many-to-many
 *
 * @example
 * ```typescript
 * if (isManyToManyAssociation(Student, 'courses')) {
 *   // Handle many-to-many
 * }
 * ```
 */
export declare function isManyToManyAssociation(model: ModelStatic<any>, associationName: string): boolean;
/**
 * @function getAllAssociations
 * @description Gets all associations for a model
 *
 * @param {ModelStatic<any>} model - Model
 * @returns {Record<string, Association<any, any>>} All associations
 *
 * @example
 * ```typescript
 * const associations = getAllAssociations(User);
 * for (const [name, assoc] of Object.entries(associations)) {
 *   console.log(name, assoc.associationType);
 * }
 * ```
 */
export declare function getAllAssociations(model: ModelStatic<any>): Record<string, Association<any, any>>;
/**
 * @function getAssociationNames
 * @description Gets all association names for a model
 *
 * @param {ModelStatic<any>} model - Model
 * @returns {string[]} Association names
 *
 * @example
 * ```typescript
 * const names = getAssociationNames(User);
 * // Returns: ['posts', 'profile', 'comments']
 * ```
 */
export declare function getAssociationNames(model: ModelStatic<any>): string[];
/**
 * @function countAssociations
 * @description Counts the number of associations on a model
 *
 * @param {ModelStatic<any>} model - Model
 * @returns {number} Association count
 *
 * @example
 * ```typescript
 * const count = countAssociations(User);
 * console.log(`User has ${count} associations`);
 * ```
 */
export declare function countAssociations(model: ModelStatic<any>): number;
/**
 * @function hasAssociation
 * @description Checks if a model has a specific association
 *
 * @param {ModelStatic<any>} model - Model
 * @param {string} associationName - Association name
 * @returns {boolean} True if association exists
 *
 * @example
 * ```typescript
 * if (hasAssociation(User, 'posts')) {
 *   // Association exists
 * }
 * ```
 */
export declare function hasAssociation(model: ModelStatic<any>, associationName: string): boolean;
/**
 * @function generateForeignKeyName
 * @description Generates a foreign key name from model and field
 *
 * @param {string} modelName - Model name
 * @param {string} fieldName - Field name
 * @returns {string} Foreign key name
 *
 * @example
 * ```typescript
 * const fk = generateForeignKeyName('User', 'id');
 * // Returns: 'userId'
 * ```
 */
export declare function generateForeignKeyName(modelName: string, fieldName?: string): string;
/**
 * @function generateThroughTableName
 * @description Generates a through table name from two model names
 *
 * @param {string} model1 - First model name
 * @param {string} model2 - Second model name
 * @returns {string} Through table name
 *
 * @example
 * ```typescript
 * const tableName = generateThroughTableName('Student', 'Course');
 * // Returns: 'StudentCourses' (alphabetically sorted)
 * ```
 */
export declare function generateThroughTableName(model1: string, model2: string): string;
/**
 * @function getAssociationForeignKey
 * @description Gets the foreign key for an association
 *
 * @param {Association<any, any>} association - Association
 * @returns {string} Foreign key name
 *
 * @example
 * ```typescript
 * const assoc = User.associations.posts;
 * const fk = getAssociationForeignKey(assoc);
 * // Returns: 'authorId'
 * ```
 */
export declare function getAssociationForeignKey(association: Association<any, any>): string;
/**
 * @function getAssociationTargetKey
 * @description Gets the target key for an association
 *
 * @param {Association<any, any>} association - Association
 * @returns {string} Target key name
 *
 * @example
 * ```typescript
 * const assoc = Post.associations.author;
 * const tk = getAssociationTargetKey(assoc);
 * // Returns: 'id'
 * ```
 */
export declare function getAssociationTargetKey(association: Association<any, any>): string;
//# sourceMappingURL=sequelize-associations-utils.d.ts.map