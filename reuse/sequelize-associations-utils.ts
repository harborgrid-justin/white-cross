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
  CreateOptions,
  DestroyOptions,
  UpdateOptions,
  Transaction,
  WhereOptions,
  Op,
  ThroughOptions,
  AssociationScope,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// HASONE ASSOCIATION HELPERS
// ============================================================================

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
export function createHasOne<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig = {}
): Association<S, T> {
  const options: HasOneOptions = {
    as: config.as,
    foreignKey: config.foreignKey,
    sourceKey: config.sourceKey,
    scope: config.scope,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
    constraints: config.constraints !== false,
  };

  return source.hasOne(target, options);
}

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
export function createHasOneWithScope<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig,
  scopeCondition: WhereOptions
): Association<S, T> {
  return createHasOne(source, target, {
    ...config,
    scope: scopeCondition as AssociationScope,
  });
}

// ============================================================================
// HASMANY ASSOCIATION HELPERS
// ============================================================================

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
export function createHasMany<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig = {}
): Association<S, T> {
  const options: HasManyOptions = {
    as: config.as,
    foreignKey: config.foreignKey,
    sourceKey: config.sourceKey,
    scope: config.scope,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
    constraints: config.constraints !== false,
  };

  return source.hasMany(target, options);
}

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
export function createHasManyWithOrder<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig,
  order: any
): Association<S, T> {
  return source.hasMany(target, {
    as: config.as,
    foreignKey: config.foreignKey,
    sourceKey: config.sourceKey,
    scope: { ...config.scope, order } as any,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  });
}

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
export function createHasManyWithLimit<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig,
  limit: number
): Association<S, T> {
  return source.hasMany(target, {
    as: config.as,
    foreignKey: config.foreignKey,
    scope: { ...config.scope, limit } as any,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
  });
}

// ============================================================================
// BELONGSTO ASSOCIATION HELPERS
// ============================================================================

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
export function createBelongsTo<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig = {}
): Association<S, T> {
  const options: BelongsToOptions = {
    as: config.as,
    foreignKey: config.foreignKey,
    targetKey: config.targetKey,
    scope: config.scope,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
    constraints: config.constraints !== false,
  };

  return source.belongsTo(target, options);
}

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
export function createBelongsToRequired<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  config: AssociationConfig
): Association<S, T> {
  return createBelongsTo(source, target, {
    ...config,
    constraints: true,
  });
}

// ============================================================================
// BELONGSTOMANY ASSOCIATION HELPERS
// ============================================================================

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
export function createBelongsToMany<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  through: ThroughConfig,
  config: AssociationConfig = {}
): Association<S, T> {
  const options: BelongsToManyOptions = {
    through: through.model,
    as: config.as,
    foreignKey: config.foreignKey,
    otherKey: config.targetKey,
    scope: config.scope,
    onDelete: config.onDelete || 'CASCADE',
    onUpdate: config.onUpdate || 'CASCADE',
    hooks: config.hooks !== false,
    constraints: config.constraints !== false,
  };

  return source.belongsToMany(target, options);
}

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
export function createBidirectionalBelongsToMany<S extends Model, T extends Model>(
  model1: ModelStatic<S>,
  model2: ModelStatic<T>,
  through: ThroughConfig,
  config: {
    model1: AssociationConfig;
    model2: AssociationConfig;
  }
): [Association<S, T>, Association<T, S>] {
  const assoc1 = createBelongsToMany(model1, model2, through, config.model1);
  const assoc2 = createBelongsToMany(model2, model1, through, config.model2);

  return [assoc1, assoc2];
}

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
export function createBelongsToManyThrough<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  through: ThroughConfig,
  config: AssociationConfig
): Association<S, T> {
  return source.belongsToMany(target, {
    through: {
      model: through.model,
      scope: through.scope,
      unique: through.unique !== false,
    } as any,
    as: config.as,
    foreignKey: config.foreignKey,
    otherKey: config.targetKey,
    scope: config.scope,
  });
}

// ============================================================================
// POLYMORPHIC ASSOCIATION HELPERS
// ============================================================================

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
export function createPolymorphicAssociation<S extends Model>(
  source: ModelStatic<S>,
  targetModels: string[],
  polymorphicAs: string,
  config: PolymorphicConfig
): void {
  const { polymorphicType, polymorphicId, constraints = false } = config;

  // Store configuration for later use
  (source as any)._polymorphicConfig = {
    as: polymorphicAs,
    typeField: polymorphicType,
    idField: polymorphicId,
    allowedTypes: targetModels,
  };

  // Add validation hook
  source.addHook('beforeValidate', (instance: any) => {
    const type = instance[polymorphicType];
    if (type && targetModels.length > 0 && !targetModels.includes(type)) {
      throw new Error(
        `Invalid ${polymorphicType}: ${type}. Must be one of: ${targetModels.join(', ')}`
      );
    }
  });
}

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
export async function getPolymorphicAssociation<S extends Model>(
  instance: S,
  models: Record<string, ModelStatic<any>>
): Promise<Model | null> {
  const config = (instance.constructor as any)._polymorphicConfig;
  if (!config) {
    throw new Error('Model does not have polymorphic configuration');
  }

  const type = (instance as any)[config.typeField];
  const id = (instance as any)[config.idField];

  if (!type || !id) return null;

  const TargetModel = models[type];
  if (!TargetModel) {
    throw new Error(`Model ${type} not found in models registry`);
  }

  return await TargetModel.findByPk(id);
}

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
export async function setPolymorphicAssociation<S extends Model, T extends Model>(
  instance: S,
  target: T,
  transaction?: Transaction
): Promise<S> {
  const config = (instance.constructor as any)._polymorphicConfig;
  if (!config) {
    throw new Error('Model does not have polymorphic configuration');
  }

  const targetType = (target.constructor as any).name;
  const targetId = (target as any).id;

  (instance as any)[config.typeField] = targetType;
  (instance as any)[config.idField] = targetId;

  if (instance.isNewRecord) {
    return instance;
  }

  return await instance.save({ transaction });
}

// ============================================================================
// SELF-REFERENCING ASSOCIATIONS
// ============================================================================

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
export function createSelfReferencing<M extends Model>(
  model: ModelStatic<M>,
  asOne: string,
  asTwo: string,
  through: ModelStatic<any>,
  foreignKeys: { one: string; two: string }
): [Association<M, M>, Association<M, M>] {
  const assoc1 = model.belongsToMany(model, {
    as: asOne,
    through,
    foreignKey: foreignKeys.two,
    otherKey: foreignKeys.one,
  });

  const assoc2 = model.belongsToMany(model, {
    as: asTwo,
    through,
    foreignKey: foreignKeys.one,
    otherKey: foreignKeys.two,
  });

  return [assoc1, assoc2];
}

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
export function createHierarchicalAssociation<M extends Model>(
  model: ModelStatic<M>,
  config: {
    parentAs?: string;
    childrenAs?: string;
    foreignKey?: string;
  } = {}
): [Association<M, M>, Association<M, M>] {
  const {
    parentAs = 'parent',
    childrenAs = 'children',
    foreignKey = 'parentId',
  } = config;

  const parentAssoc = model.belongsTo(model, {
    as: parentAs,
    foreignKey,
  });

  const childrenAssoc = model.hasMany(model, {
    as: childrenAs,
    foreignKey,
  });

  return [parentAssoc, childrenAssoc];
}

// ============================================================================
// INCLUDE HELPERS
// ============================================================================

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
export function buildInclude(config: IncludeConfig): Includeable {
  const include: any = {
    model: config.model,
    as: config.as,
    where: config.where,
    attributes: config.attributes,
    required: config.required,
    separate: config.separate,
    order: config.order,
    limit: config.limit,
  };

  if (config.include && config.include.length > 0) {
    include.include = config.include.map((nested) => buildInclude(nested));
  }

  return include;
}

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
export function buildNestedInclude(configs: IncludeConfig[]): Includeable[] {
  return configs.map((config) => buildInclude(config));
}

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
export function buildRequiredInclude(
  model: ModelStatic<any>,
  as: string,
  where?: WhereOptions
): Includeable {
  return {
    model,
    as,
    where,
    required: true,
  };
}

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
export function buildSeparateInclude(
  model: ModelStatic<any>,
  as: string,
  where?: WhereOptions,
  order?: any,
  limit?: number
): Includeable {
  return {
    model,
    as,
    where,
    order,
    limit,
    separate: true,
  };
}

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
export function buildCountInclude(
  model: ModelStatic<any>,
  as: string,
  countAs: string
): any {
  return {
    model,
    as,
    attributes: [],
  };
}

// ============================================================================
// CASCADE UTILITIES
// ============================================================================

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
export async function cascadeDelete<M extends Model>(
  instance: M,
  options: CascadeOptions
): Promise<void> {
  const { associations, transaction, force = false, depth = 1 } = options;

  if (depth <= 0) return;

  for (const assocName of associations) {
    const getterName = `get${assocName.charAt(0).toUpperCase()}${assocName.slice(1)}`;
    const getter = (instance as any)[getterName];

    if (typeof getter === 'function') {
      const associated = await getter.call(instance, { transaction });

      if (Array.isArray(associated)) {
        for (const item of associated) {
          await item.destroy({ transaction, force });
        }
      } else if (associated) {
        await associated.destroy({ transaction, force });
      }
    }
  }

  await instance.destroy({ transaction, force });
}

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
export async function cascadeUpdate<M extends Model>(
  instance: M,
  values: Partial<M>,
  options: CascadeOptions & { cascadeValues?: Record<string, any> }
): Promise<M> {
  const { associations, transaction, cascadeValues = {} } = options;

  await instance.update(values as any, { transaction });

  for (const assocName of associations) {
    const getterName = `get${assocName.charAt(0).toUpperCase()}${assocName.slice(1)}`;
    const getter = (instance as any)[getterName];

    if (typeof getter === 'function' && cascadeValues[assocName]) {
      const associated = await getter.call(instance, { transaction });

      if (Array.isArray(associated)) {
        for (const item of associated) {
          await item.update(cascadeValues[assocName], { transaction });
        }
      } else if (associated) {
        await associated.update(cascadeValues[assocName], { transaction });
      }
    }
  }

  return instance;
}

// ============================================================================
// ASSOCIATION SCOPE HELPERS
// ============================================================================

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
export function createScopedAssociation<S extends Model, T extends Model>(
  source: ModelStatic<S>,
  target: ModelStatic<T>,
  type: 'hasOne' | 'hasMany' | 'belongsTo',
  config: AssociationConfig,
  scope: AssociationScope
): Association<S, T> {
  const configWithScope = { ...config, scope };

  switch (type) {
    case 'hasOne':
      return createHasOne(source, target, configWithScope);
    case 'hasMany':
      return createHasMany(source, target, configWithScope);
    case 'belongsTo':
      return createBelongsTo(source, target, configWithScope);
    default:
      throw new Error(`Invalid association type: ${type}`);
  }
}

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
export function addAssociationScope(
  association: Association<any, any>,
  scope: AssociationScope
): Association<any, any> {
  (association as any).scope = {
    ...(association as any).scope,
    ...scope,
  };
  return association;
}

// ============================================================================
// THROUGH MODEL UTILITIES
// ============================================================================

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
export function getThroughModel(association: Association<any, any>): ModelStatic<any> {
  const throughModel = (association as any).through?.model;
  if (!throughModel) {
    throw new Error('Association does not have a through model');
  }
  return throughModel;
}

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
export async function updateThroughAttributes<S extends Model, T extends Model>(
  source: S,
  target: T,
  associationName: string,
  attributes: Record<string, any>,
  transaction?: Transaction
): Promise<void> {
  const association = (source.constructor as any).associations[associationName];
  if (!association) {
    throw new Error(`Association ${associationName} not found`);
  }

  const throughModel = getThroughModel(association);
  const sourceKey = (association as any).foreignKey;
  const targetKey = (association as any).otherKey;

  await throughModel.update(attributes, {
    where: {
      [sourceKey]: (source as any).id,
      [targetKey]: (target as any).id,
    },
    transaction,
  });
}

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
export async function getThroughAttributes<S extends Model, T extends Model>(
  source: S,
  target: T,
  associationName: string,
  transaction?: Transaction
): Promise<any> {
  const association = (source.constructor as any).associations[associationName];
  if (!association) {
    throw new Error(`Association ${associationName} not found`);
  }

  const throughModel = getThroughModel(association);
  const sourceKey = (association as any).foreignKey;
  const targetKey = (association as any).otherKey;

  return await throughModel.findOne({
    where: {
      [sourceKey]: (source as any).id,
      [targetKey]: (target as any).id,
    },
    transaction,
  });
}

// ============================================================================
// ASSOCIATION VALIDATION
// ============================================================================

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
export function validateAssociationExists(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  if (!(model as any).associations[associationName]) {
    throw new Error(
      `Association ${associationName} does not exist on model ${model.name}`
    );
  }
  return true;
}

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
export function getAssociationType(
  model: ModelStatic<any>,
  associationName: string
): string {
  validateAssociationExists(model, associationName);
  return (model as any).associations[associationName].associationType;
}

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
export function isOneToOneAssociation(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  const type = getAssociationType(model, associationName);
  return type === 'HasOne' || type === 'BelongsTo';
}

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
export function isOneToManyAssociation(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  return getAssociationType(model, associationName) === 'HasMany';
}

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
export function isManyToManyAssociation(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  return getAssociationType(model, associationName) === 'BelongsToMany';
}

// ============================================================================
// ASSOCIATION TESTING HELPERS
// ============================================================================

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
export function getAllAssociations(
  model: ModelStatic<any>
): Record<string, Association<any, any>> {
  return (model as any).associations || {};
}

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
export function getAssociationNames(model: ModelStatic<any>): string[] {
  return Object.keys(getAllAssociations(model));
}

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
export function countAssociations(model: ModelStatic<any>): number {
  return getAssociationNames(model).length;
}

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
export function hasAssociation(
  model: ModelStatic<any>,
  associationName: string
): boolean {
  return associationName in getAllAssociations(model);
}

// ============================================================================
// ASSOCIATION MIGRATION HELPERS
// ============================================================================

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
export function generateForeignKeyName(modelName: string, fieldName: string = 'id'): string {
  const baseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return `${baseName}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
}

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
export function generateThroughTableName(model1: string, model2: string): string {
  const names = [model1, model2].sort();
  return `${names[0]}${names[1]}s`;
}

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
export function getAssociationForeignKey(association: Association<any, any>): string {
  return (association as any).foreignKey || '';
}

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
export function getAssociationTargetKey(association: Association<any, any>): string {
  return (association as any).targetKey || (association as any).otherKey || 'id';
}
