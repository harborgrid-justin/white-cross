/**
 * LOC: DRK9876543
 * File: /reuse/data-relations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize ORM v6.x
 *   - TypeScript type system
 *   - Model definitions and schemas
 *
 * DOWNSTREAM (imported by):
 *   - Model association definitions
 *   - Service layer relationship queries
 *   - Repository pattern implementations
 *   - Data access layer utilities
 *   - Migration and seeding scripts
 */
/**
 * File: /reuse/data-relations-kit.ts
 * Locator: WC-UTL-DRK-001
 * Purpose: Data Relations Kit - Comprehensive Sequelize association and relationship management utilities
 *
 * Upstream: Sequelize 6.x, TypeScript 5.x, Model classes, Transaction handlers
 * Downstream: ../models/*, ../services/*, ../repositories/*, data access layers, migration scripts
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 50 utility functions for association builders, junction tables, polymorphic associations,
 *          self-referential relationships, eager loading optimization, include builders, association
 *          queries, cascade operations, foreign key management, association scopes, through models,
 *          circular dependency resolution, multi-level includes, validation, orphan cleanup, count helpers,
 *          existence checks, nested queries, caching strategies, transaction helpers, bidirectional sync,
 *          event hooks, migration helpers, many-to-many with attributes, metadata extraction, dynamic
 *          association building, performance analysis, cross-database associations, and testing utilities
 *
 * LLM Context: Comprehensive Sequelize association utilities for White Cross healthcare system.
 * Provides complete relationship management including hasMany, belongsTo, belongsToMany builders,
 * junction table factories, polymorphic associations, self-referential relationships, eager loading
 * optimization, include query builders with type safety, association-based queries, cascade operation
 * utilities, foreign key constraint management, association scopes, through model helpers, alias
 * management, circular dependency resolvers, multi-level include builders, association validation,
 * orphan record cleanup, count/existence helpers, nested association queries, caching strategies,
 * transaction coordination, bidirectional sync, event hooks, migration helpers, many-to-many with
 * additional attributes, metadata extraction, dynamic association building, performance analyzers,
 * cross-database association support, and comprehensive testing utilities. Essential for maintaining
 * complex healthcare data relationships with optimal query performance, data integrity, and
 * HIPAA-compliant data access patterns.
 */
import { Model, ModelStatic, Association, Includeable, FindOptions, Transaction, WhereOptions, Sequelize, Order } from 'sequelize';
interface AssociationBuilderConfig {
    as?: string;
    foreignKey?: string | {
        name?: string;
        allowNull?: boolean;
    };
    sourceKey?: string;
    targetKey?: string;
    otherKey?: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    constraints?: boolean;
    hooks?: boolean;
    scope?: WhereOptions | ((model?: any) => WhereOptions);
    through?: ModelStatic<any> | string | ThroughOptions;
}
interface ThroughOptions {
    model: ModelStatic<any>;
    unique?: boolean;
    scope?: WhereOptions;
    attributes?: string[];
}
interface JunctionTableSchema {
    tableName: string;
    timestamps?: boolean;
    paranoid?: boolean;
    underscored?: boolean;
    additionalFields?: Record<string, any>;
    indexes?: Array<{
        fields: string[];
        unique?: boolean;
        name?: string;
    }>;
}
interface PolymorphicAssociationConfig {
    polymorphicType: string;
    polymorphicId: string;
    as: string;
    models: ModelStatic<any>[];
    constraints?: boolean;
    scope?: WhereOptions;
}
interface SelfReferentialConfig {
    as?: string;
    foreignKey?: string;
    otherKey?: string;
    through?: ModelStatic<any>;
    hierarchy?: boolean;
    maxDepth?: number;
}
interface EagerLoadStrategy {
    strategy: 'nested' | 'separate' | 'subquery';
    maxDepth?: number;
    includeDeleted?: boolean;
    optimizeN1?: boolean;
}
interface IncludeBuilderOptions {
    model: ModelStatic<any>;
    as?: string;
    where?: WhereOptions;
    attributes?: string[] | {
        include?: string[];
        exclude?: string[];
    };
    required?: boolean;
    separate?: boolean;
    include?: IncludeBuilderOptions[];
    order?: Order;
    limit?: number;
    offset?: number;
    through?: {
        attributes?: string[];
        where?: WhereOptions;
    };
    duplicating?: boolean;
    subQuery?: boolean;
}
interface AssociationQueryOptions {
    method: 'get' | 'count' | 'has' | 'add' | 'set' | 'remove' | 'create';
    association: string;
    params?: any;
    transaction?: Transaction;
    scope?: WhereOptions;
}
interface CascadeOperationConfig {
    operation: 'delete' | 'update' | 'nullify';
    associations: string[];
    recursive?: boolean;
    transaction?: Transaction;
    hooks?: boolean;
}
interface ForeignKeyConfig {
    name: string;
    allowNull?: boolean;
    unique?: boolean;
    references?: {
        model: string | ModelStatic<any>;
        key: string;
    };
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
}
interface AssociationScope {
    name: string;
    conditions: WhereOptions | ((params?: any) => WhereOptions);
    include?: IncludeBuilderOptions[];
    defaultScope?: boolean;
}
interface ThroughModelHelper {
    model: ModelStatic<any>;
    attributes?: string[];
    additionalAttributes?: Record<string, any>;
    scope?: WhereOptions;
}
interface CircularDependencyConfig {
    maxDepth: number;
    preventInfiniteLoop: boolean;
    cacheVisited?: boolean;
    visitedSet?: Set<string>;
}
interface MultiLevelInclude {
    depth: number;
    associations: Array<{
        model: ModelStatic<any>;
        as?: string;
        include?: MultiLevelInclude;
    }>;
    strategy?: 'nested' | 'separate';
}
interface OrphanCleanupConfig {
    model: ModelStatic<any>;
    parentModel: ModelStatic<any>;
    foreignKey: string;
    dryRun?: boolean;
    transaction?: Transaction;
    batchSize?: number;
}
interface AssociationCountOptions {
    where?: WhereOptions;
    include?: IncludeBuilderOptions[];
    distinct?: boolean;
    group?: string[];
    transaction?: Transaction;
}
interface BidirectionalSyncConfig {
    sourceModel: ModelStatic<any>;
    targetModel: ModelStatic<any>;
    sourceAssociation: string;
    targetAssociation: string;
    transaction?: Transaction;
}
interface AssociationMigrationHelper {
    tableName: string;
    foreignKey: ForeignKeyConfig;
    indexName?: string;
    up: boolean;
}
interface AssociationMetadata {
    type: 'HasOne' | 'HasMany' | 'BelongsTo' | 'BelongsToMany';
    foreignKey: string;
    targetKey?: string;
    sourceKey?: string;
    otherKey?: string;
    as?: string;
    through?: string | ModelStatic<any>;
    scope?: WhereOptions;
}
interface AssociationPerformanceMetrics {
    associationName: string;
    queryCount: number;
    executionTime: number;
    rowsReturned: number;
    n1Detected: boolean;
    recommendations: string[];
}
/**
 * 1. Builds a hasMany association with optimized defaults and type safety.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration
 * @returns {Association} Created hasMany association
 *
 * @example
 * ```typescript
 * const postsAssoc = buildHasManyAssociation(User, Post, {
 *   as: 'posts',
 *   foreignKey: 'authorId',
 *   onDelete: 'CASCADE',
 *   hooks: true
 * });
 * ```
 */
export declare const buildHasManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config?: AssociationBuilderConfig) => Association;
/**
 * 2. Builds a belongsTo association with proper foreign key constraints.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration
 * @returns {Association} Created belongsTo association
 *
 * @example
 * ```typescript
 * const authorAssoc = buildBelongsToAssociation(Post, User, {
 *   as: 'author',
 *   foreignKey: 'authorId',
 *   targetKey: 'id',
 *   onDelete: 'RESTRICT'
 * });
 * ```
 */
export declare const buildBelongsToAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config?: AssociationBuilderConfig) => Association;
/**
 * 3. Builds a belongsToMany association with through model configuration.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration with through model
 * @returns {Association} Created belongsToMany association
 *
 * @example
 * ```typescript
 * const rolesAssoc = buildBelongsToManyAssociation(User, Role, {
 *   as: 'roles',
 *   through: UserRole,
 *   foreignKey: 'userId',
 *   otherKey: 'roleId',
 *   timestamps: true
 * });
 * ```
 */
export declare const buildBelongsToManyAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config: AssociationBuilderConfig) => Association;
/**
 * 4. Creates bidirectional hasMany associations between two models.
 *
 * @param {ModelStatic<any>} modelA - First model
 * @param {ModelStatic<any>} modelB - Second model
 * @param {object} config - Configuration for both directions
 * @returns {object} Both created associations
 *
 * @example
 * ```typescript
 * const { aToB, bToA } = buildBidirectionalHasMany(Doctor, Patient, {
 *   aToB: { as: 'patients', foreignKey: 'doctorId' },
 *   bToA: { as: 'doctors', foreignKey: 'patientId' },
 *   through: Appointment
 * });
 * ```
 */
export declare const buildBidirectionalHasMany: (modelA: ModelStatic<any>, modelB: ModelStatic<any>, config: {
    aToB: AssociationBuilderConfig;
    bToA: AssociationBuilderConfig;
    through?: ModelStatic<any>;
}) => {
    aToB: Association;
    bToA: Association;
};
/**
 * 5. Builds a hasOne association with strict validation.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration
 * @returns {Association} Created hasOne association
 *
 * @example
 * ```typescript
 * const profileAssoc = buildHasOneAssociation(User, Profile, {
 *   as: 'profile',
 *   foreignKey: { name: 'userId', allowNull: false },
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export declare const buildHasOneAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config?: AssociationBuilderConfig) => Association;
/**
 * 6. Creates a scoped association with dynamic filtering.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration with scope
 * @returns {Association} Created scoped association
 *
 * @example
 * ```typescript
 * const activePostsAssoc = buildScopedAssociation(User, Post, {
 *   as: 'activePosts',
 *   foreignKey: 'authorId',
 *   scope: { status: 'published', deletedAt: null }
 * });
 * ```
 */
export declare const buildScopedAssociation: (source: ModelStatic<any>, target: ModelStatic<any>, config: AssociationBuilderConfig) => Association;
/**
 * 7. Builds an optional belongsTo association (nullable foreign key).
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {AssociationBuilderConfig} config - Association configuration
 * @returns {Association} Created optional association
 *
 * @example
 * ```typescript
 * const managerAssoc = buildOptionalBelongsTo(Employee, Manager, {
 *   as: 'manager',
 *   foreignKey: { name: 'managerId', allowNull: true },
 *   onDelete: 'SET NULL'
 * });
 * ```
 */
export declare const buildOptionalBelongsTo: (source: ModelStatic<any>, target: ModelStatic<any>, config: AssociationBuilderConfig) => Association;
/**
 * 8. Creates multiple associations from one model to another with different aliases.
 *
 * @param {ModelStatic<any>} source - Source model
 * @param {ModelStatic<any>} target - Target model
 * @param {Array} configs - Array of association configurations
 * @returns {Association[]} Array of created associations
 *
 * @example
 * ```typescript
 * const assocs = buildMultipleAssociations(Message, User, [
 *   { as: 'sender', foreignKey: 'senderId' },
 *   { as: 'recipient', foreignKey: 'recipientId' }
 * ]);
 * ```
 */
export declare const buildMultipleAssociations: (source: ModelStatic<any>, target: ModelStatic<any>, configs: AssociationBuilderConfig[]) => Association[];
/**
 * 9. Creates a junction table model for many-to-many relationships.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JunctionTableSchema} schema - Junction table schema
 * @returns {ModelStatic<any>} Created junction table model
 *
 * @example
 * ```typescript
 * const UserRole = createJunctionTable(sequelize, {
 *   tableName: 'user_roles',
 *   timestamps: true,
 *   additionalFields: {
 *     assignedAt: DataTypes.DATE,
 *     assignedBy: DataTypes.UUID
 *   }
 * });
 * ```
 */
export declare const createJunctionTable: (sequelize: Sequelize, schema: JunctionTableSchema) => ModelStatic<any>;
/**
 * 10. Adds custom attributes to a junction table query.
 *
 * @param {IncludeBuilderOptions} include - Include configuration
 * @param {string[]} attributes - Attributes to include from junction table
 * @returns {IncludeBuilderOptions} Modified include configuration
 *
 * @example
 * ```typescript
 * const include = addJunctionAttributes(
 *   { model: Role, as: 'roles', through: UserRole },
 *   ['assignedAt', 'assignedBy']
 * );
 * ```
 */
export declare const addJunctionAttributes: (include: IncludeBuilderOptions, attributes: string[]) => IncludeBuilderOptions;
/**
 * 11. Filters junction table records with where conditions.
 *
 * @param {IncludeBuilderOptions} include - Include configuration
 * @param {WhereOptions} where - Where conditions for junction table
 * @returns {IncludeBuilderOptions} Modified include configuration
 *
 * @example
 * ```typescript
 * const include = filterJunctionTable(
 *   { model: Role, as: 'roles', through: UserRole },
 *   { assignedAt: { [Op.gte]: new Date('2024-01-01') } }
 * );
 * ```
 */
export declare const filterJunctionTable: (include: IncludeBuilderOptions, where: WhereOptions) => IncludeBuilderOptions;
/**
 * 12. Bulk creates junction table entries with additional attributes.
 *
 * @param {ModelStatic<any>} junctionModel - Junction table model
 * @param {Array} entries - Array of junction entries
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model[]>} Created junction records
 *
 * @example
 * ```typescript
 * await bulkCreateJunctionEntries(UserRole, [
 *   { userId: 1, roleId: 2, assignedBy: 'admin' },
 *   { userId: 1, roleId: 3, assignedBy: 'admin' }
 * ], transaction);
 * ```
 */
export declare const bulkCreateJunctionEntries: (junctionModel: ModelStatic<any>, entries: Array<Record<string, any>>, transaction?: Transaction) => Promise<Model[]>;
/**
 * 13. Updates junction table attributes for existing relationships.
 *
 * @param {ModelStatic<any>} junctionModel - Junction table model
 * @param {WhereOptions} where - Conditions to find junction records
 * @param {object} updates - Attributes to update
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of updated records
 *
 * @example
 * ```typescript
 * await updateJunctionAttributes(UserRole,
 *   { userId: 1, roleId: 2 },
 *   { assignedBy: 'new-admin', updatedAt: new Date() },
 *   transaction
 * );
 * ```
 */
export declare const updateJunctionAttributes: (junctionModel: ModelStatic<any>, where: WhereOptions, updates: Record<string, any>, transaction?: Transaction) => Promise<number>;
/**
 * 14. Retrieves junction table records with full association data.
 *
 * @param {ModelStatic<any>} junctionModel - Junction table model
 * @param {WhereOptions} where - Query conditions
 * @param {IncludeBuilderOptions[]} includes - Associated models to include
 * @returns {Promise<Model[]>} Junction records with associations
 *
 * @example
 * ```typescript
 * const records = await getJunctionRecordsWithAssociations(UserRole,
 *   { assignedAt: { [Op.gte]: new Date('2024-01-01') } },
 *   [
 *     { model: User, as: 'user', attributes: ['id', 'username'] },
 *     { model: Role, as: 'role', attributes: ['id', 'name'] }
 *   ]
 * );
 * ```
 */
export declare const getJunctionRecordsWithAssociations: (junctionModel: ModelStatic<any>, where: WhereOptions, includes?: IncludeBuilderOptions[]) => Promise<Model[]>;
/**
 * 15. Creates polymorphic associations for flexible relationships.
 *
 * @param {PolymorphicAssociationConfig} config - Polymorphic configuration
 * @returns {Association[]} Array of created associations
 *
 * @example
 * ```typescript
 * const assocs = createPolymorphicAssociation({
 *   polymorphicType: 'commentableType',
 *   polymorphicId: 'commentableId',
 *   as: 'commentable',
 *   models: [Post, Video, Image],
 *   constraints: false
 * });
 * ```
 */
export declare const createPolymorphicAssociation: (config: PolymorphicAssociationConfig) => Association[];
/**
 * 16. Builds a self-referential parent-child association.
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {SelfReferentialConfig} config - Self-referential configuration
 * @returns {object} Parent and children associations
 *
 * @example
 * ```typescript
 * const { parent, children } = buildSelfReferentialAssociation(Category, {
 *   as: 'subcategories',
 *   foreignKey: 'parentId',
 *   hierarchy: true
 * });
 * ```
 */
export declare const buildSelfReferentialAssociation: (model: ModelStatic<any>, config: SelfReferentialConfig) => {
    parent: Association;
    children: Association;
};
/**
 * 17. Creates a self-referential many-to-many association.
 *
 * @param {ModelStatic<any>} model - Model with self-reference
 * @param {SelfReferentialConfig} config - Configuration with through model
 * @returns {Association} Created self-referential association
 *
 * @example
 * ```typescript
 * const friendsAssoc = buildSelfReferentialManyToMany(User, {
 *   as: 'friends',
 *   through: Friendship,
 *   foreignKey: 'userId',
 *   otherKey: 'friendId'
 * });
 * ```
 */
export declare const buildSelfReferentialManyToMany: (model: ModelStatic<any>, config: SelfReferentialConfig) => Association;
/**
 * 18. Queries polymorphic associations with type filtering.
 *
 * @param {ModelStatic<any>} model - Base model
 * @param {string} polymorphicType - Type field name
 * @param {string} typeValue - Type value to filter
 * @param {FindOptions} options - Additional query options
 * @returns {Promise<Model[]>} Filtered polymorphic records
 *
 * @example
 * ```typescript
 * const postComments = await queryPolymorphicAssociation(
 *   Comment,
 *   'commentableType',
 *   'Post',
 *   { include: [{ model: User, as: 'author' }] }
 * );
 * ```
 */
export declare const queryPolymorphicAssociation: (model: ModelStatic<any>, polymorphicType: string, typeValue: string, options?: FindOptions) => Promise<Model[]>;
/**
 * 19. Traverses a hierarchical self-referential tree structure.
 *
 * @param {Model} instance - Starting node
 * @param {object} config - Traversal configuration
 * @returns {Promise<Model[]>} All descendants
 *
 * @example
 * ```typescript
 * const allSubcategories = await traverseHierarchy(rootCategory, {
 *   association: 'children',
 *   maxDepth: 5,
 *   includeRoot: false
 * });
 * ```
 */
export declare const traverseHierarchy: (instance: Model, config: {
    association: string;
    maxDepth?: number;
    includeRoot?: boolean;
}) => Promise<Model[]>;
/**
 * 20. Builds ancestor path for hierarchical records.
 *
 * @param {Model} instance - Child node
 * @param {string} parentAssociation - Name of parent association
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Promise<Model[]>} Array of ancestors from root to parent
 *
 * @example
 * ```typescript
 * const path = await buildAncestorPath(category, 'parent', 10);
 * // Returns [root, ..., grandparent, parent]
 * ```
 */
export declare const buildAncestorPath: (instance: Model, parentAssociation?: string, maxDepth?: number) => Promise<Model[]>;
/**
 * 21. Builds optimized include configuration for eager loading.
 *
 * @param {IncludeBuilderOptions[]} includes - Array of include configurations
 * @param {EagerLoadStrategy} strategy - Loading strategy
 * @returns {Includeable[]} Optimized include array
 *
 * @example
 * ```typescript
 * const includes = buildOptimizedIncludes([
 *   { model: Profile, as: 'profile', attributes: ['avatar'] },
 *   { model: Post, as: 'posts', separate: true }
 * ], { strategy: 'separate', optimizeN1: true });
 * ```
 */
export declare const buildOptimizedIncludes: (includes: IncludeBuilderOptions[], strategy: EagerLoadStrategy) => Includeable[];
/**
 * 22. Creates a nested include builder for multi-level associations.
 *
 * @param {MultiLevelInclude} config - Multi-level include configuration
 * @returns {Includeable[]} Nested include structure
 *
 * @example
 * ```typescript
 * const includes = buildNestedIncludes({
 *   depth: 3,
 *   associations: [
 *     {
 *       model: Post,
 *       as: 'posts',
 *       include: {
 *         depth: 2,
 *         associations: [{ model: Comment, as: 'comments' }]
 *       }
 *     }
 *   ]
 * });
 * ```
 */
export declare const buildNestedIncludes: (config: MultiLevelInclude) => Includeable[];
/**
 * 23. Builds a conditional include based on runtime parameters.
 *
 * @param {ModelStatic<any>} model - Model to include
 * @param {object} conditions - Conditional configuration
 * @returns {Includeable | null} Include configuration or null
 *
 * @example
 * ```typescript
 * const include = buildConditionalInclude(Post, {
 *   as: 'posts',
 *   condition: (params) => params.includePosts === true,
 *   where: { status: 'published' },
 *   params: { includePosts: true }
 * });
 * ```
 */
export declare const buildConditionalInclude: (model: ModelStatic<any>, conditions: {
    as?: string;
    condition: (params: any) => boolean;
    where?: WhereOptions;
    params: any;
    attributes?: string[];
}) => Includeable | null;
/**
 * 24. Optimizes includes to prevent N+1 queries.
 *
 * @param {FindOptions} queryOptions - Original query options
 * @returns {FindOptions} Optimized query options
 *
 * @example
 * ```typescript
 * const optimized = preventN1Queries({
 *   include: [
 *     { model: Post, as: 'posts', include: [{ model: Comment }] }
 *   ],
 *   limit: 20
 * });
 * ```
 */
export declare const preventN1Queries: (queryOptions: FindOptions) => FindOptions;
/**
 * 25. Builds includes with attribute filtering for performance.
 *
 * @param {IncludeBuilderOptions[]} includes - Include configurations
 * @param {Record<string, string[]>} attributeMap - Map of model to attributes
 * @returns {Includeable[]} Includes with filtered attributes
 *
 * @example
 * ```typescript
 * const includes = buildAttributeFilteredIncludes(
 *   [{ model: User, as: 'author' }, { model: Post, as: 'posts' }],
 *   { User: ['id', 'username'], Post: ['id', 'title'] }
 * );
 * ```
 */
export declare const buildAttributeFilteredIncludes: (includes: IncludeBuilderOptions[], attributeMap: Record<string, string[]>) => Includeable[];
/**
 * 26. Dynamically builds includes from association names.
 *
 * @param {ModelStatic<any>} model - Base model
 * @param {string[]} associationNames - Names of associations to include
 * @param {boolean} recursive - Whether to recursively include nested associations
 * @returns {Includeable[]} Built include array
 *
 * @example
 * ```typescript
 * const includes = buildIncludesFromNames(User, ['posts', 'profile', 'roles'], false);
 * ```
 */
export declare const buildIncludesFromNames: (model: ModelStatic<any>, associationNames: string[], recursive?: boolean) => Includeable[];
/**
 * 27. Builds a paginated include for large associations.
 *
 * @param {IncludeBuilderOptions} include - Base include configuration
 * @param {object} pagination - Pagination parameters
 * @returns {IncludeBuilderOptions} Paginated include
 *
 * @example
 * ```typescript
 * const include = buildPaginatedInclude(
 *   { model: Post, as: 'posts' },
 *   { limit: 10, offset: 20, order: [['createdAt', 'DESC']] }
 * );
 * ```
 */
export declare const buildPaginatedInclude: (include: IncludeBuilderOptions, pagination: {
    limit: number;
    offset?: number;
    order?: Order;
}) => IncludeBuilderOptions;
/**
 * 28. Merges multiple include configurations intelligently.
 *
 * @param {Includeable[][]} includeArrays - Multiple include arrays to merge
 * @returns {Includeable[]} Merged includes without duplicates
 *
 * @example
 * ```typescript
 * const merged = mergeIncludes([
 *   [{ model: User, as: 'author' }],
 *   [{ model: User, as: 'author' }, { model: Post }]
 * ]);
 * ```
 */
export declare const mergeIncludes: (includeArrays: Includeable[][]) => Includeable[];
/**
 * 29. Executes association method dynamically with type safety.
 *
 * @param {Model} instance - Model instance
 * @param {AssociationQueryOptions} options - Association query options
 * @returns {Promise<any>} Result of association method
 *
 * @example
 * ```typescript
 * const posts = await executeAssociationQuery(user, {
 *   method: 'get',
 *   association: 'posts',
 *   params: { where: { status: 'published' } }
 * });
 * ```
 */
export declare const executeAssociationQuery: (instance: Model, options: AssociationQueryOptions) => Promise<any>;
/**
 * 30. Counts associated records with filtering.
 *
 * @param {Model} instance - Model instance
 * @param {string} association - Association name
 * @param {AssociationCountOptions} options - Count options
 * @returns {Promise<number>} Count of associated records
 *
 * @example
 * ```typescript
 * const activePostCount = await countAssociatedRecords(user, 'posts', {
 *   where: { status: 'published' },
 *   distinct: true
 * });
 * ```
 */
export declare const countAssociatedRecords: (instance: Model, association: string, options?: AssociationCountOptions) => Promise<number>;
/**
 * 31. Checks if association exists between two instances.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {Model | Model[]} target - Target instance(s)
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} Whether association exists
 *
 * @example
 * ```typescript
 * const hasRole = await checkAssociationExists(user, 'roles', adminRole);
 * ```
 */
export declare const checkAssociationExists: (instance: Model, association: string, target: Model | Model[], transaction?: Transaction) => Promise<boolean>;
/**
 * 32. Adds association with transaction support and validation.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {Model | Model[]} target - Target instance(s) to add
 * @param {object} options - Add options with through attributes
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await addAssociationSafe(user, 'roles', adminRole, {
 *   through: { assignedBy: 'system', assignedAt: new Date() },
 *   transaction
 * });
 * ```
 */
export declare const addAssociationSafe: (instance: Model, association: string, target: Model | Model[], options?: {
    through?: Record<string, any>;
    transaction?: Transaction;
    validate?: boolean;
}) => Promise<void>;
/**
 * 33. Removes association with cascade handling.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {Model | Model[]} target - Target instance(s) to remove
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await removeAssociationSafe(user, 'roles', adminRole, transaction);
 * ```
 */
export declare const removeAssociationSafe: (instance: Model, association: string, target: Model | Model[], transaction?: Transaction) => Promise<void>;
/**
 * 34. Sets associations replacing all existing ones.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {Model | Model[] | null} targets - New target instance(s)
 * @param {object} options - Set options
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await setAssociations(user, 'roles', [editorRole, viewerRole], {
 *   transaction,
 *   through: { assignedBy: 'admin' }
 * });
 * ```
 */
export declare const setAssociations: (instance: Model, association: string, targets: Model | Model[] | null, options?: {
    through?: Record<string, any>;
    transaction?: Transaction;
}) => Promise<void>;
/**
 * 35. Creates and associates a new record in one operation.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {object} data - Data for new associated record
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created associated record
 *
 * @example
 * ```typescript
 * const newPost = await createAssociatedRecord(user, 'posts', {
 *   title: 'New Post',
 *   content: 'Content here'
 * }, transaction);
 * ```
 */
export declare const createAssociatedRecord: (instance: Model, association: string, data: Record<string, any>, transaction?: Transaction) => Promise<Model>;
/**
 * 36. Executes cascade delete on associated records.
 *
 * @param {Model} instance - Source instance to delete
 * @param {CascadeOperationConfig} config - Cascade configuration
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await cascadeDelete(user, {
 *   operation: 'delete',
 *   associations: ['posts', 'comments', 'profile'],
 *   recursive: true,
 *   transaction
 * });
 * ```
 */
export declare const cascadeDelete: (instance: Model, config: CascadeOperationConfig) => Promise<void>;
/**
 * 37. Validates foreign key constraints before operations.
 *
 * @param {ModelStatic<any>} model - Model to validate
 * @param {ForeignKeyConfig} config - Foreign key configuration
 * @param {any} value - Value to validate
 * @returns {Promise<boolean>} Whether foreign key is valid
 *
 * @example
 * ```typescript
 * const isValid = await validateForeignKey(Post, {
 *   name: 'authorId',
 *   references: { model: User, key: 'id' }
 * }, userId);
 * ```
 */
export declare const validateForeignKey: (model: ModelStatic<any>, config: ForeignKeyConfig, value: any) => Promise<boolean>;
/**
 * 38. Adds foreign key constraint to existing table.
 *
 * @param {AssociationMigrationHelper} helper - Migration helper configuration
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await addForeignKeyConstraint({
 *   tableName: 'posts',
 *   foreignKey: {
 *     name: 'authorId',
 *     references: { model: 'users', key: 'id' },
 *     onDelete: 'CASCADE'
 *   },
 *   up: true
 * });
 * ```
 */
export declare const addForeignKeyConstraint: (helper: AssociationMigrationHelper) => Promise<void>;
/**
 * 39. Removes foreign key constraint from table.
 *
 * @param {AssociationMigrationHelper} helper - Migration helper configuration
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await removeForeignKeyConstraint({
 *   tableName: 'posts',
 *   foreignKey: { name: 'authorId' },
 *   indexName: 'posts_authorId_fkey',
 *   up: false
 * });
 * ```
 */
export declare const removeForeignKeyConstraint: (helper: AssociationMigrationHelper) => Promise<void>;
/**
 * 40. Handles cascade update operations across associations.
 *
 * @param {Model} instance - Instance to update
 * @param {CascadeOperationConfig} config - Cascade configuration
 * @param {object} updates - Updates to apply
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await cascadeUpdate(user, {
 *   operation: 'update',
 *   associations: ['posts', 'comments'],
 *   transaction
 * }, { updatedBy: 'admin', updatedAt: new Date() });
 * ```
 */
export declare const cascadeUpdate: (instance: Model, config: CascadeOperationConfig, updates: Record<string, any>) => Promise<void>;
/**
 * 41. Creates a scoped association with dynamic conditions.
 *
 * @param {ModelStatic<any>} model - Model to add scope to
 * @param {AssociationScope} scope - Scope configuration
 * @returns {void} Void
 *
 * @example
 * ```typescript
 * addAssociationScope(User, {
 *   name: 'publishedPosts',
 *   conditions: { status: 'published' },
 *   include: [{ model: Post, as: 'posts' }],
 *   defaultScope: false
 * });
 * ```
 */
export declare const addAssociationScope: (model: ModelStatic<any>, scope: AssociationScope) => void;
/**
 * 42. Queries through model with additional filtering.
 *
 * @param {Model} instance - Source instance
 * @param {string} association - Association name
 * @param {ThroughModelHelper} throughConfig - Through model configuration
 * @returns {Promise<Model[]>} Associated records with through data
 *
 * @example
 * ```typescript
 * const roles = await queryThroughModel(user, 'roles', {
 *   model: UserRole,
 *   attributes: ['assignedAt', 'assignedBy'],
 *   scope: { assignedAt: { [Op.gte]: new Date('2024-01-01') } }
 * });
 * ```
 */
export declare const queryThroughModel: (instance: Model, association: string, throughConfig: ThroughModelHelper) => Promise<Model[]>;
/**
 * 43. Updates through model attributes for existing association.
 *
 * @param {Model} sourceInstance - Source instance
 * @param {Model} targetInstance - Target instance
 * @param {ModelStatic<any>} throughModel - Through model
 * @param {object} updates - Attributes to update
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of updated records
 *
 * @example
 * ```typescript
 * await updateThroughAttributes(user, role, UserRole, {
 *   assignedBy: 'new-admin',
 *   updatedAt: new Date()
 * }, transaction);
 * ```
 */
export declare const updateThroughAttributes: (sourceInstance: Model, targetInstance: Model, throughModel: ModelStatic<any>, updates: Record<string, any>, transaction?: Transaction) => Promise<number>;
/**
 * 44. Retrieves through model instance for a relationship.
 *
 * @param {Model} sourceInstance - Source instance
 * @param {Model} targetInstance - Target instance
 * @param {ModelStatic<any>} throughModel - Through model
 * @returns {Promise<Model | null>} Through model instance
 *
 * @example
 * ```typescript
 * const userRole = await getThroughInstance(user, role, UserRole);
 * console.log(userRole.assignedAt, userRole.assignedBy);
 * ```
 */
export declare const getThroughInstance: (sourceInstance: Model, targetInstance: Model, throughModel: ModelStatic<any>) => Promise<Model | null>;
/**
 * 45. Builds association scope with parameter injection.
 *
 * @param {WhereOptions | Function} conditions - Base conditions or function
 * @param {object} params - Parameters to inject
 * @returns {WhereOptions} Resolved where conditions
 *
 * @example
 * ```typescript
 * const scope = buildScopeWithParams(
 *   (params) => ({ status: params.status, userId: params.userId }),
 *   { status: 'active', userId: 123 }
 * );
 * ```
 */
export declare const buildScopeWithParams: (conditions: WhereOptions | ((params: any) => WhereOptions), params: Record<string, any>) => WhereOptions;
/**
 * 46. Resolves circular dependencies in association loading.
 *
 * @param {Model} instance - Starting instance
 * @param {CircularDependencyConfig} config - Circular dependency configuration
 * @param {IncludeBuilderOptions[]} includes - Includes to load
 * @returns {Promise<Model>} Instance with loaded associations
 *
 * @example
 * ```typescript
 * const user = await resolveCircularDependencies(userInstance, {
 *   maxDepth: 3,
 *   preventInfiniteLoop: true,
 *   cacheVisited: true
 * }, [{ model: Post, include: [{ model: User }] }]);
 * ```
 */
export declare const resolveCircularDependencies: (instance: Model, config: CircularDependencyConfig, includes: IncludeBuilderOptions[]) => Promise<Model>;
/**
 * 47. Finds and cleans up orphaned records missing parent associations.
 *
 * @param {OrphanCleanupConfig} config - Cleanup configuration
 * @returns {Promise<{ found: number; deleted: number }>} Cleanup results
 *
 * @example
 * ```typescript
 * const result = await cleanupOrphanedRecords({
 *   model: Post,
 *   parentModel: User,
 *   foreignKey: 'authorId',
 *   dryRun: false,
 *   transaction,
 *   batchSize: 1000
 * });
 * ```
 */
export declare const cleanupOrphanedRecords: (config: OrphanCleanupConfig) => Promise<{
    found: number;
    deleted: number;
}>;
/**
 * 48. Extracts association metadata from model.
 *
 * @param {ModelStatic<any>} model - Model to extract metadata from
 * @param {string} associationName - Name of association
 * @returns {AssociationMetadata | null} Association metadata
 *
 * @example
 * ```typescript
 * const metadata = extractAssociationMetadata(User, 'posts');
 * console.log(metadata.type, metadata.foreignKey, metadata.as);
 * ```
 */
export declare const extractAssociationMetadata: (model: ModelStatic<any>, associationName: string) => AssociationMetadata | null;
/**
 * 49. Analyzes association query performance and detects N+1 issues.
 *
 * @param {ModelStatic<any>} model - Model to analyze
 * @param {FindOptions} queryOptions - Query options to analyze
 * @returns {Promise<AssociationPerformanceMetrics>} Performance analysis
 *
 * @example
 * ```typescript
 * const metrics = await analyzeAssociationPerformance(User, {
 *   include: [{ model: Post, include: [{ model: Comment }] }],
 *   limit: 100
 * });
 * console.log(metrics.n1Detected, metrics.recommendations);
 * ```
 */
export declare const analyzeAssociationPerformance: (model: ModelStatic<any>, queryOptions: FindOptions) => Promise<AssociationPerformanceMetrics>;
/**
 * 50. Synchronizes bidirectional associations in transaction.
 *
 * @param {BidirectionalSyncConfig} config - Sync configuration
 * @param {Model} sourceInstance - Source instance
 * @param {Model} targetInstance - Target instance
 * @returns {Promise<void>} Void
 *
 * @example
 * ```typescript
 * await syncBidirectionalAssociations({
 *   sourceModel: User,
 *   targetModel: Profile,
 *   sourceAssociation: 'profile',
 *   targetAssociation: 'user',
 *   transaction
 * }, userInstance, profileInstance);
 * ```
 */
export declare const syncBidirectionalAssociations: (config: BidirectionalSyncConfig, sourceInstance: Model, targetInstance: Model) => Promise<void>;
export {};
//# sourceMappingURL=data-relations-kit.d.ts.map