/**
 * LOC: SAPK8765432
 * File: /reuse/sequelize-association-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize ORM v6.x
 *   - TypeScript types
 *   - Model definitions
 *
 * DOWNSTREAM (imported by):
 *   - Model association definitions
 *   - Service layer relationship queries
 *   - Repository pattern implementations
 *   - Data access layer utilities
 */
/**
 * File: /reuse/sequelize-association-patterns-kit.ts
 * Locator: WC-UTL-SAPK-001
 * Purpose: Sequelize Association Patterns Kit - Comprehensive association and relationship management utilities
 *
 * Upstream: Sequelize 6.x, TypeScript 5.x, Model classes
 * Downstream: ../models/*, ../services/*, ../repositories/*, data access layers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45 utility functions for hasOne/hasMany/belongsTo/belongsToMany builders, junction tables, eager loading, includes, aliases, through models, foreign keys, cascades, polymorphic associations, self-referencing, circular references
 *
 * LLM Context: Comprehensive Sequelize association utilities for White Cross healthcare system.
 * Provides association type builders (hasOne, hasMany, belongsTo, belongsToMany), junction table
 * factories, eager loading optimization, include query builders, association alias management,
 * through model utilities, foreign key helpers, cascade operation handlers, polymorphic association
 * patterns, self-referencing associations, circular reference resolution, and association validation.
 * Essential for maintaining complex healthcare data relationships with optimal query performance
 * and HIPAA-compliant data access patterns.
 */
import { Model, ModelStatic, Association, Includeable, Transaction, WhereOptions } from 'sequelize';
interface AssociationBuilderOptions {
    as?: string;
    foreignKey?: string;
    sourceKey?: string;
    targetKey?: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    constraints?: boolean;
    hooks?: boolean;
    scope?: any;
}
interface JunctionTableConfig {
    tableName: string;
    timestamps?: boolean;
    paranoid?: boolean;
    additionalFields?: Record<string, any>;
}
interface PolymorphicConfig {
    polymorphicType: string;
    polymorphicId: string;
    as: string;
    constraints?: boolean;
}
interface IncludeBuilderConfig {
    model: ModelStatic<any>;
    as?: string;
    where?: WhereOptions;
    attributes?: string[] | {
        include?: string[];
        exclude?: string[];
    };
    required?: boolean;
    separate?: boolean;
    include?: IncludeBuilderConfig[];
    order?: any[];
    limit?: number;
    offset?: number;
    through?: {
        attributes?: string[];
        where?: WhereOptions;
    };
}
interface EagerLoadConfig {
    maxDepth?: number;
    strategy?: 'nested' | 'separate' | 'subquery';
    includeDeleted?: boolean;
}
interface CascadeConfig {
    onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    hooks?: boolean;
}
interface CircularRefConfig {
    maxDepth: number;
    preventInfiniteLoop: boolean;
    cacheVisited?: boolean;
}
interface AssociationMetadata {
    type: string;
    foreignKey: string;
    targetKey?: string;
    sourceKey?: string;
    as?: string;
    through?: string;
}
/**
 * 1. Creates a standard hasOne association with common defaults.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * const profileAssoc = buildHasOneAssociation(User, Profile, {
 *   as: 'profile',
 *   foreignKey: 'userId',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export declare const buildHasOneAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
/**
 * 2. Creates a hasOne association with required constraint validation.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildHasOneRequired(User, Profile, {
 *   as: 'profile',
 *   foreignKey: 'userId'
 * });
 * ```
 */
export declare const buildHasOneRequired: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions) => Association;
/**
 * 3. Creates a hasOne association with custom scope filter.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @param {WhereOptions} scopeConditions - Scope conditions
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildHasOneScopedAssociation(User, Profile,
 *   { as: 'activeProfile', foreignKey: 'userId' },
 *   { isActive: true }
 * );
 * ```
 */
export declare const buildHasOneScopedAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, scopeConditions: WhereOptions) => Association;
/**
 * 4. Creates a standard hasMany association with common defaults.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildHasManyAssociation(User, Post, {
 *   as: 'posts',
 *   foreignKey: 'authorId',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export declare const buildHasManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
/**
 * 5. Creates a hasMany association with default ordering.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @param {any[]} orderClause - Order by clause
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildHasManyOrdered(User, Post,
 *   { as: 'posts', foreignKey: 'authorId' },
 *   [['createdAt', 'DESC']]
 * );
 * ```
 */
export declare const buildHasManyOrdered: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, orderClause: any[]) => Association;
/**
 * 6. Creates a hasMany association with scope filter and limit.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @param {WhereOptions} scopeConditions - Scope conditions
 * @param {number} limit - Result limit
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildHasManyScoped(User, Post,
 *   { as: 'recentPublishedPosts', foreignKey: 'authorId' },
 *   { status: 'published' },
 *   10
 * );
 * ```
 */
export declare const buildHasManyScoped: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, scopeConditions: WhereOptions, limit?: number) => Association;
/**
 * 7. Creates a standard belongsTo association with common defaults.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildBelongsToAssociation(Post, User, {
 *   as: 'author',
 *   foreignKey: 'authorId',
 *   targetKey: 'id'
 * });
 * ```
 */
export declare const buildBelongsToAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
/**
 * 8. Creates a belongsTo association with nullable foreign key.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildBelongsToOptional(Post, Category, {
 *   as: 'category',
 *   foreignKey: 'categoryId',
 *   onDelete: 'SET NULL'
 * });
 * ```
 */
export declare const buildBelongsToOptional: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions) => Association;
/**
 * 9. Creates a belongsTo association with custom target key.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderOptions} options - Association options
 * @param {string} targetKey - Custom target key field
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildBelongsToWithTargetKey(Order, User,
 *   { as: 'customer', foreignKey: 'customerEmail' },
 *   'email'
 * );
 * ```
 */
export declare const buildBelongsToWithTargetKey: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, targetKey: string) => Association;
/**
 * 10. Creates a standard belongsToMany association with junction table.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {ModelStatic<any>} through - Through/junction model
 * @param {AssociationBuilderOptions} options - Association options
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildBelongsToManyAssociation(Student, Course, Enrollment, {
 *   as: 'courses',
 *   foreignKey: 'studentId',
 *   targetKey: 'courseId'
 * });
 * ```
 */
export declare const buildBelongsToManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, through: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
/**
 * 11. Creates bidirectional belongsToMany associations.
 *
 * @param {ModelStatic<any>} model1 - First model
 * @param {ModelStatic<any>} model2 - Second model
 * @param {ModelStatic<any>} through - Through model
 * @param {object} config - Configuration for both directions
 * @returns {[Association, Association]} Both associations
 *
 * @example
 * ```typescript
 * const [userRoles, roleUsers] = buildBidirectionalBelongsToMany(
 *   User, Role, UserRole,
 *   {
 *     model1: { as: 'roles', foreignKey: 'userId', targetKey: 'roleId' },
 *     model2: { as: 'users', foreignKey: 'roleId', targetKey: 'userId' }
 *   }
 * );
 * ```
 */
export declare const buildBidirectionalBelongsToMany: (model1: ModelStatic<any>, model2: ModelStatic<any>, through: ModelStatic<any>, config: {
    model1: AssociationBuilderOptions;
    model2: AssociationBuilderOptions;
}) => [Association, Association];
/**
 * 12. Creates a belongsToMany association with scoped through table.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {ModelStatic<any>} through - Through model
 * @param {AssociationBuilderOptions} options - Association options
 * @param {WhereOptions} throughScope - Through table scope
 * @returns {Association} Created association
 *
 * @example
 * ```typescript
 * buildBelongsToManyWithThroughScope(
 *   Student, Course, Enrollment,
 *   { as: 'activeCourses', foreignKey: 'studentId', targetKey: 'courseId' },
 *   { status: 'active' }
 * );
 * ```
 */
export declare const buildBelongsToManyWithThroughScope: (source: ModelStatic<any>, target: ModelStatic<any>, through: ModelStatic<any>, options: AssociationBuilderOptions, throughScope: WhereOptions) => Association;
/**
 * 13. Creates a basic junction table definition for many-to-many relationships.
 *
 * @param {string} tableName - Junction table name
 * @param {string} foreignKey1 - First foreign key
 * @param {string} foreignKey2 - Second foreign key
 * @param {JunctionTableConfig} config - Additional configuration
 * @returns {object} Junction table definition
 *
 * @example
 * ```typescript
 * const junctionDef = createJunctionTableDefinition(
 *   'student_courses',
 *   'studentId',
 *   'courseId',
 *   { timestamps: true, additionalFields: { enrolledAt: 'DATE' } }
 * );
 * ```
 */
export declare const createJunctionTableDefinition: (tableName: string, foreignKey1: string, foreignKey2: string, config?: JunctionTableConfig) => object;
/**
 * 14. Generates standard junction table name from two model names.
 *
 * @param {string} model1Name - First model name
 * @param {string} model2Name - Second model name
 * @returns {string} Generated junction table name
 *
 * @example
 * ```typescript
 * const tableName = generateJunctionTableName('User', 'Role');
 * // Returns: 'user_roles'
 * ```
 */
export declare const generateJunctionTableName: (model1Name: string, model2Name: string) => string;
/**
 * 15. Creates junction table attributes with additional metadata fields.
 *
 * @param {string} foreignKey1 - First foreign key
 * @param {string} foreignKey2 - Second foreign key
 * @param {Record<string, any>} additionalAttributes - Additional attributes
 * @returns {object} Junction table attributes
 *
 * @example
 * ```typescript
 * const attrs = createJunctionTableAttributes(
 *   'doctorId',
 *   'patientId',
 *   {
 *     appointmentDate: { type: DataTypes.DATE, allowNull: false },
 *     status: { type: DataTypes.ENUM('scheduled', 'completed'), defaultValue: 'scheduled' }
 *   }
 * );
 * ```
 */
export declare const createJunctionTableAttributes: (foreignKey1: string, foreignKey2: string, additionalAttributes?: Record<string, any>) => object;
/**
 * 16. Creates eager loading configuration with depth limit.
 *
 * @param {IncludeBuilderConfig[]} includes - Include configurations
 * @param {EagerLoadConfig} config - Eager load configuration
 * @returns {Includeable[]} Processed includes
 *
 * @example
 * ```typescript
 * const includes = buildEagerLoadConfig([
 *   { model: Post, as: 'posts', include: [{ model: Comment, as: 'comments' }] }
 * ], { maxDepth: 2 });
 * ```
 */
export declare const buildEagerLoadConfig: (includes: IncludeBuilderConfig[], config?: EagerLoadConfig) => Includeable[];
/**
 * 17. Creates separate query eager loading to avoid N+1 problems.
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {WhereOptions} where - Where conditions
 * @param {any[]} order - Order clause
 * @param {number} limit - Limit
 * @returns {Includeable} Separate query include
 *
 * @example
 * ```typescript
 * const include = buildSeparateQueryInclude(
 *   Post, 'posts',
 *   { status: 'published' },
 *   [['createdAt', 'DESC']],
 *   10
 * );
 * ```
 */
export declare const buildSeparateQueryInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions, order?: any[], limit?: number) => Includeable;
/**
 * 18. Creates optimized eager loading for large datasets using subquery strategy.
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {WhereOptions} where - Where conditions
 * @returns {Includeable} Subquery include
 *
 * @example
 * ```typescript
 * const include = buildSubqueryInclude(Comment, 'comments', { approved: true });
 * ```
 */
export declare const buildSubqueryInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions) => Includeable;
/**
 * 19. Builds a comprehensive include configuration with all options.
 *
 * @param {IncludeBuilderConfig} config - Include configuration
 * @returns {Includeable} Sequelize include
 *
 * @example
 * ```typescript
 * const include = buildIncludeConfig({
 *   model: User,
 *   as: 'author',
 *   attributes: ['id', 'username'],
 *   where: { active: true },
 *   required: true
 * });
 * ```
 */
export declare const buildIncludeConfig: (config: IncludeBuilderConfig) => Includeable;
/**
 * 20. Builds nested includes for deep relationship queries.
 *
 * @param {IncludeBuilderConfig[]} configs - Array of include configs
 * @returns {Includeable[]} Array of Sequelize includes
 *
 * @example
 * ```typescript
 * const includes = buildNestedIncludes([
 *   { model: Post, as: 'posts', include: [
 *     { model: Comment, as: 'comments' }
 *   ]}
 * ]);
 * ```
 */
export declare const buildNestedIncludes: (configs: IncludeBuilderConfig[]) => Includeable[];
/**
 * 21. Builds required include (INNER JOIN) for filtering parent records.
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {string} as - Association alias
 * @param {WhereOptions} where - Where conditions
 * @returns {Includeable} Required include
 *
 * @example
 * ```typescript
 * const include = buildRequiredInclude(Profile, 'profile', { verified: true });
 * // Only returns users with verified profiles
 * ```
 */
export declare const buildRequiredInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions) => Includeable;
/**
 * 22. Generates association alias from model name with customizable suffix.
 *
 * @param {string} modelName - Model name
 * @param {string} suffix - Alias suffix (singular/plural)
 * @returns {string} Generated alias
 *
 * @example
 * ```typescript
 * const alias = generateAssociationAlias('User', 'posts');
 * // Returns: 'userPosts'
 * ```
 */
export declare const generateAssociationAlias: (modelName: string, suffix: string) => string;
/**
 * 23. Extracts association alias from association metadata.
 *
 * @param {Association} association - Sequelize association
 * @returns {string} Association alias
 *
 * @example
 * ```typescript
 * const alias = extractAssociationAlias(User.associations.posts);
 * // Returns: 'posts'
 * ```
 */
export declare const extractAssociationAlias: (association: Association) => string;
/**
 * 24. Validates association alias uniqueness across model.
 *
 * @param {ModelStatic<any>} model - Model to check
 * @param {string} alias - Alias to validate
 * @returns {boolean} True if alias is unique
 *
 * @example
 * ```typescript
 * if (validateAliasUniqueness(User, 'posts')) {
 *   // Alias is unique
 * }
 * ```
 */
export declare const validateAliasUniqueness: (model: ModelStatic<any>, alias: string) => boolean;
/**
 * 25. Retrieves through model from belongsToMany association.
 *
 * @param {Association} association - BelongsToMany association
 * @returns {ModelStatic<any> | null} Through model
 *
 * @example
 * ```typescript
 * const throughModel = extractThroughModel(Student.associations.courses);
 * ```
 */
export declare const extractThroughModel: (association: Association) => ModelStatic<any> | null;
/**
 * 26. Updates attributes on through table instance.
 *
 * @param {Model} sourceInstance - Source model instance
 * @param {Model} targetInstance - Target model instance
 * @param {string} associationName - Association name
 * @param {Record<string, any>} attributes - Attributes to update
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateThroughTableAttributes(
 *   student, course, 'courses',
 *   { grade: 'A', completedAt: new Date() }
 * );
 * ```
 */
export declare const updateThroughTableAttributes: (sourceInstance: Model, targetInstance: Model, associationName: string, attributes: Record<string, any>, transaction?: Transaction) => Promise<void>;
/**
 * 27. Queries through table for additional attributes.
 *
 * @param {Model} sourceInstance - Source model instance
 * @param {Model} targetInstance - Target model instance
 * @param {string} associationName - Association name
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model | null>} Through table instance
 *
 * @example
 * ```typescript
 * const enrollment = await queryThroughTable(student, course, 'courses');
 * console.log(enrollment.grade);
 * ```
 */
export declare const queryThroughTable: (sourceInstance: Model, targetInstance: Model, associationName: string, transaction?: Transaction) => Promise<Model | null>;
/**
 * 28. Generates foreign key name from model and field.
 *
 * @param {string} modelName - Model name
 * @param {string} fieldName - Field name (default: 'id')
 * @returns {string} Foreign key name
 *
 * @example
 * ```typescript
 * const fk = generateForeignKeyName('User', 'id');
 * // Returns: 'userId'
 * ```
 */
export declare const generateForeignKeyName: (modelName: string, fieldName?: string) => string;
/**
 * 29. Extracts foreign key name from association.
 *
 * @param {Association} association - Sequelize association
 * @returns {string} Foreign key name
 *
 * @example
 * ```typescript
 * const fk = extractForeignKey(Post.associations.author);
 * // Returns: 'authorId'
 * ```
 */
export declare const extractForeignKey: (association: Association) => string;
/**
 * 30. Validates foreign key existence on model.
 *
 * @param {ModelStatic<any>} model - Model to check
 * @param {string} foreignKey - Foreign key name
 * @returns {boolean} True if foreign key exists
 *
 * @example
 * ```typescript
 * if (validateForeignKeyExists(Post, 'authorId')) {
 *   // Foreign key exists
 * }
 * ```
 */
export declare const validateForeignKeyExists: (model: ModelStatic<any>, foreignKey: string) => boolean;
/**
 * 31. Creates cascade delete configuration.
 *
 * @param {boolean} includeHooks - Whether to trigger hooks
 * @returns {CascadeConfig} Cascade configuration
 *
 * @example
 * ```typescript
 * const cascadeConfig = buildCascadeDeleteConfig(true);
 * ```
 */
export declare const buildCascadeDeleteConfig: (includeHooks?: boolean) => CascadeConfig;
/**
 * 32. Creates soft delete cascade configuration (SET NULL).
 *
 * @param {boolean} includeHooks - Whether to trigger hooks
 * @returns {CascadeConfig} Soft cascade configuration
 *
 * @example
 * ```typescript
 * const softCascade = buildSoftCascadeConfig(true);
 * ```
 */
export declare const buildSoftCascadeConfig: (includeHooks?: boolean) => CascadeConfig;
/**
 * 33. Creates restrict cascade configuration to prevent deletion.
 *
 * @returns {CascadeConfig} Restrict configuration
 *
 * @example
 * ```typescript
 * const restrictConfig = buildRestrictCascadeConfig();
 * ```
 */
export declare const buildRestrictCascadeConfig: () => CascadeConfig;
/**
 * 34. Creates polymorphic association setup.
 *
 * @param {ModelStatic<any>} sourceModel - Source model
 * @param {PolymorphicConfig} config - Polymorphic configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * buildPolymorphicAssociation(Comment, {
 *   polymorphicType: 'commentableType',
 *   polymorphicId: 'commentableId',
 *   as: 'commentable'
 * });
 * ```
 */
export declare const buildPolymorphicAssociation: (sourceModel: ModelStatic<any>, config: PolymorphicConfig) => void;
/**
 * 35. Retrieves polymorphic association target from instance.
 *
 * @param {Model} instance - Model instance
 * @param {Record<string, ModelStatic<any>>} models - Models registry
 * @returns {Promise<Model | null>} Target model instance
 *
 * @example
 * ```typescript
 * const comment = await Comment.findByPk(1);
 * const commentable = await getPolymorphicTarget(comment, models);
 * ```
 */
export declare const getPolymorphicTarget: (instance: Model, models: Record<string, ModelStatic<any>>) => Promise<Model | null>;
/**
 * 36. Sets polymorphic association on instance.
 *
 * @param {Model} instance - Source instance
 * @param {Model} target - Target instance
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated instance
 *
 * @example
 * ```typescript
 * const comment = Comment.build({ content: 'Great!' });
 * const post = await Post.findByPk(1);
 * await setPolymorphicTarget(comment, post);
 * ```
 */
export declare const setPolymorphicTarget: (instance: Model, target: Model, transaction?: Transaction) => Promise<Model>;
/**
 * 37. Creates self-referencing many-to-many association (followers/following).
 *
 * @param {ModelStatic<any>} model - Model
 * @param {ModelStatic<any>} throughModel - Through model
 * @param {object} config - Configuration
 * @returns {[Association, Association]} Both associations
 *
 * @example
 * ```typescript
 * const [followers, following] = buildSelfReferencingManyToMany(
 *   User, UserFollower,
 *   {
 *     as1: 'followers',
 *     as2: 'following',
 *     foreignKey1: 'followerId',
 *     foreignKey2: 'followingId'
 *   }
 * );
 * ```
 */
export declare const buildSelfReferencingManyToMany: (model: ModelStatic<any>, throughModel: ModelStatic<any>, config: {
    as1: string;
    as2: string;
    foreignKey1: string;
    foreignKey2: string;
}) => [Association, Association];
/**
 * 38. Creates hierarchical self-referencing association (parent/children).
 *
 * @param {ModelStatic<any>} model - Model
 * @param {object} config - Configuration
 * @returns {[Association, Association]} Parent and children associations
 *
 * @example
 * ```typescript
 * const [parent, children] = buildHierarchicalAssociation(Category, {
 *   parentAs: 'parent',
 *   childrenAs: 'children',
 *   foreignKey: 'parentId'
 * });
 * ```
 */
export declare const buildHierarchicalAssociation: (model: ModelStatic<any>, config?: {
    parentAs?: string;
    childrenAs?: string;
    foreignKey?: string;
}) => [Association, Association];
/**
 * 39. Prevents infinite loops in circular association queries.
 *
 * @param {IncludeBuilderConfig[]} includes - Include configurations
 * @param {CircularRefConfig} config - Circular reference configuration
 * @returns {Includeable[]} Safe includes
 *
 * @example
 * ```typescript
 * const safeIncludes = preventCircularReferences([
 *   { model: User, as: 'user', include: [{ model: Post, as: 'posts' }] }
 * ], { maxDepth: 3, preventInfiniteLoop: true });
 * ```
 */
export declare const preventCircularReferences: (includes: IncludeBuilderConfig[], config: CircularRefConfig) => Includeable[];
/**
 * 40. Detects circular dependencies in association graph.
 *
 * @param {ModelStatic<any>} startModel - Starting model
 * @param {string} targetModelName - Target model name to detect
 * @param {number} maxDepth - Maximum depth to search
 * @returns {boolean} True if circular dependency detected
 *
 * @example
 * ```typescript
 * if (detectCircularDependency(User, 'User', 5)) {
 *   console.warn('Circular dependency detected');
 * }
 * ```
 */
export declare const detectCircularDependency: (startModel: ModelStatic<any>, targetModelName: string, maxDepth?: number) => boolean;
/**
 * 41. Validates association configuration completeness.
 *
 * @param {AssociationBuilderOptions} options - Association options
 * @param {string} associationType - Association type
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateAssociationConfig(
 *   { as: 'posts', foreignKey: 'authorId' },
 *   'hasMany'
 * );
 * ```
 */
export declare const validateAssociationConfig: (options: AssociationBuilderOptions, associationType: string) => boolean;
/**
 * 42. Retrieves all association names from a model.
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
export declare const getAssociationNames: (model: ModelStatic<any>) => string[];
/**
 * 43. Gets association metadata for introspection.
 *
 * @param {Association} association - Sequelize association
 * @returns {AssociationMetadata} Association metadata
 *
 * @example
 * ```typescript
 * const metadata = getAssociationMetadata(User.associations.posts);
 * console.log(metadata.type, metadata.foreignKey);
 * ```
 */
export declare const getAssociationMetadata: (association: Association) => AssociationMetadata;
/**
 * 44. Checks if association is a many-to-many relationship.
 *
 * @param {Association} association - Sequelize association
 * @returns {boolean} True if many-to-many
 *
 * @example
 * ```typescript
 * if (isManyToManyAssociation(Student.associations.courses)) {
 *   // Handle many-to-many
 * }
 * ```
 */
export declare const isManyToManyAssociation: (association: Association) => boolean;
/**
 * 45. Retrieves association type (HasOne, HasMany, BelongsTo, BelongsToMany).
 *
 * @param {Association} association - Sequelize association
 * @returns {string} Association type
 *
 * @example
 * ```typescript
 * const type = getAssociationType(User.associations.posts);
 * // Returns: 'HasMany'
 * ```
 */
export declare const getAssociationType: (association: Association) => string;
declare const _default: {
    buildHasOneAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
    buildHasOneRequired: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions) => Association;
    buildHasOneScopedAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, scopeConditions: WhereOptions) => Association;
    buildHasManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
    buildHasManyOrdered: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, orderClause: any[]) => Association;
    buildHasManyScoped: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, scopeConditions: WhereOptions, limit?: number) => Association;
    buildBelongsToAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
    buildBelongsToOptional: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions) => Association;
    buildBelongsToWithTargetKey: (source: ModelStatic<any>, target: ModelStatic<any>, options: AssociationBuilderOptions, targetKey: string) => Association;
    buildBelongsToManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, through: ModelStatic<any>, options?: AssociationBuilderOptions) => Association;
    buildBidirectionalBelongsToMany: (model1: ModelStatic<any>, model2: ModelStatic<any>, through: ModelStatic<any>, config: {
        model1: AssociationBuilderOptions;
        model2: AssociationBuilderOptions;
    }) => [Association, Association];
    buildBelongsToManyWithThroughScope: (source: ModelStatic<any>, target: ModelStatic<any>, through: ModelStatic<any>, options: AssociationBuilderOptions, throughScope: WhereOptions) => Association;
    createJunctionTableDefinition: (tableName: string, foreignKey1: string, foreignKey2: string, config?: JunctionTableConfig) => object;
    generateJunctionTableName: (model1Name: string, model2Name: string) => string;
    createJunctionTableAttributes: (foreignKey1: string, foreignKey2: string, additionalAttributes?: Record<string, any>) => object;
    buildEagerLoadConfig: (includes: IncludeBuilderConfig[], config?: EagerLoadConfig) => Includeable[];
    buildSeparateQueryInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions, order?: any[], limit?: number) => Includeable;
    buildSubqueryInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions) => Includeable;
    buildIncludeConfig: (config: IncludeBuilderConfig) => Includeable;
    buildNestedIncludes: (configs: IncludeBuilderConfig[]) => Includeable[];
    buildRequiredInclude: (model: ModelStatic<any>, as: string, where?: WhereOptions) => Includeable;
    generateAssociationAlias: (modelName: string, suffix: string) => string;
    extractAssociationAlias: (association: Association) => string;
    validateAliasUniqueness: (model: ModelStatic<any>, alias: string) => boolean;
    extractThroughModel: (association: Association) => ModelStatic<any> | null;
    updateThroughTableAttributes: (sourceInstance: Model, targetInstance: Model, associationName: string, attributes: Record<string, any>, transaction?: Transaction) => Promise<void>;
    queryThroughTable: (sourceInstance: Model, targetInstance: Model, associationName: string, transaction?: Transaction) => Promise<Model | null>;
    generateForeignKeyName: (modelName: string, fieldName?: string) => string;
    extractForeignKey: (association: Association) => string;
    validateForeignKeyExists: (model: ModelStatic<any>, foreignKey: string) => boolean;
    buildCascadeDeleteConfig: (includeHooks?: boolean) => CascadeConfig;
    buildSoftCascadeConfig: (includeHooks?: boolean) => CascadeConfig;
    buildRestrictCascadeConfig: () => CascadeConfig;
    buildPolymorphicAssociation: (sourceModel: ModelStatic<any>, config: PolymorphicConfig) => void;
    getPolymorphicTarget: (instance: Model, models: Record<string, ModelStatic<any>>) => Promise<Model | null>;
    setPolymorphicTarget: (instance: Model, target: Model, transaction?: Transaction) => Promise<Model>;
    buildSelfReferencingManyToMany: (model: ModelStatic<any>, throughModel: ModelStatic<any>, config: {
        as1: string;
        as2: string;
        foreignKey1: string;
        foreignKey2: string;
    }) => [Association, Association];
    buildHierarchicalAssociation: (model: ModelStatic<any>, config?: {
        parentAs?: string;
        childrenAs?: string;
        foreignKey?: string;
    }) => [Association, Association];
    preventCircularReferences: (includes: IncludeBuilderConfig[], config: CircularRefConfig) => Includeable[];
    detectCircularDependency: (startModel: ModelStatic<any>, targetModelName: string, maxDepth?: number) => boolean;
    validateAssociationConfig: (options: AssociationBuilderOptions, associationType: string) => boolean;
    getAssociationNames: (model: ModelStatic<any>) => string[];
    getAssociationMetadata: (association: Association) => AssociationMetadata;
    isManyToManyAssociation: (association: Association) => boolean;
    getAssociationType: (association: Association) => string;
};
export default _default;
//# sourceMappingURL=sequelize-association-patterns-kit.d.ts.map