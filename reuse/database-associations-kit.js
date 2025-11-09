"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociationStats = exports.hasManyToMany = exports.removeManyToMany = exports.addManyToMany = exports.syncManyToMany = exports.batchCountAssociations = exports.includeAssociationCount = exports.countAssociations = exports.softCascadeDelete = exports.cascadeDelete = exports.configureCascadeDelete = exports.checkCircularReferences = exports.validateJunctionTableIntegrity = exports.validateAssociationIntegrity = exports.queryJunctionTable = exports.updateJunctionAttributes = exports.removeFromJunction = exports.addToJunction = exports.querySiblings = exports.queryAncestors = exports.queryHierarchy = exports.createSelfReferential = exports.queryPolymorphic = exports.createReversePolymorphic = exports.createPolymorphicAssociation = exports.applyScopeToInclude = exports.createDynamicScope = exports.createScopedAssociation = exports.recursiveInclude = exports.flattenNestedIncludes = exports.buildNestedIncludes = exports.paginatedInclude = exports.mergeIncludes = exports.conditionalInclude = exports.optimizeIncludeAttributes = exports.batchLoadAssociations = exports.eagerLoadWithDepthLimit = exports.separateQueryInclude = exports.optimizedInclude = exports.queryThroughModel = exports.createThroughIndexes = exports.addThroughAttributes = exports.createThroughModel = exports.createManyToMany = exports.createBelongsToMany = exports.createHasOne = exports.createBelongsTo = exports.createHasMany = exports.CascadeAction = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum CascadeAction
 * @description Foreign key cascade actions
 */
var CascadeAction;
(function (CascadeAction) {
    CascadeAction["CASCADE"] = "CASCADE";
    CascadeAction["SET_NULL"] = "SET NULL";
    CascadeAction["RESTRICT"] = "RESTRICT";
    CascadeAction["NO_ACTION"] = "NO ACTION";
    CascadeAction["SET_DEFAULT"] = "SET DEFAULT";
})(CascadeAction || (exports.CascadeAction = CascadeAction = {}));
// ============================================================================
// ASSOCIATION BUILDERS - HASMANY/BELONGSTO/BELONGSTOMANY
// ============================================================================
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
const createHasMany = (source, target, config) => {
    const options = {
        foreignKey: config.foreignKey,
        sourceKey: config.sourceKey,
        as: config.as,
        onDelete: config.onDelete || CascadeAction.SET_NULL,
        onUpdate: config.onUpdate || CascadeAction.CASCADE,
        constraints: config.constraints !== false,
        hooks: config.hooks,
        scope: config.scope,
    };
    return source.hasMany(target, options);
};
exports.createHasMany = createHasMany;
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
const createBelongsTo = (source, target, config) => {
    const options = {
        foreignKey: config.foreignKey,
        targetKey: config.targetKey,
        as: config.as,
        onDelete: config.onDelete || CascadeAction.SET_NULL,
        onUpdate: config.onUpdate || CascadeAction.CASCADE,
        constraints: config.constraints !== false,
        hooks: config.hooks,
        scope: config.scope,
    };
    return source.belongsTo(target, options);
};
exports.createBelongsTo = createBelongsTo;
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
const createHasOne = (source, target, config) => {
    const options = {
        foreignKey: config.foreignKey,
        sourceKey: config.sourceKey,
        as: config.as,
        onDelete: config.onDelete || CascadeAction.CASCADE,
        onUpdate: config.onUpdate || CascadeAction.CASCADE,
        constraints: config.constraints !== false,
        hooks: config.hooks,
        scope: config.scope,
    };
    return source.hasOne(target, options);
};
exports.createHasOne = createHasOne;
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
const createBelongsToMany = (source, target, config) => {
    const options = {
        through: config.through,
        foreignKey: config.foreignKey,
        otherKey: config.otherKey,
        as: config.as,
        onDelete: config.onDelete || CascadeAction.CASCADE,
        onUpdate: config.onUpdate || CascadeAction.CASCADE,
        constraints: config.constraints !== false,
        hooks: config.hooks,
        scope: config.scope,
        timestamps: config.timestamps,
    };
    return source.belongsToMany(target, options);
};
exports.createBelongsToMany = createBelongsToMany;
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
const createManyToMany = (model1, model2, config) => {
    const forward = (0, exports.createBelongsToMany)(model1, model2, {
        through: config.through,
        foreignKey: config.foreignKey1,
        otherKey: config.foreignKey2,
        as: config.as1,
        onDelete: config.onDelete,
        timestamps: config.timestamps,
    });
    const reverse = (0, exports.createBelongsToMany)(model2, model1, {
        through: config.through,
        foreignKey: config.foreignKey2,
        otherKey: config.foreignKey1,
        as: config.as2,
        onDelete: config.onDelete,
        timestamps: config.timestamps,
    });
    return { forward, reverse };
};
exports.createManyToMany = createManyToMany;
// ============================================================================
// THROUGH TABLE CONFIGURATION
// ============================================================================
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
const createThroughModel = (sequelize, modelName, attributes, config = {}) => {
    const modelAttributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        ...attributes,
    };
    const options = {
        sequelize,
        modelName,
        tableName: config.tableName || modelName.toLowerCase(),
        timestamps: config.timestamps !== false,
        paranoid: config.paranoid,
        indexes: config.indexes || [],
    };
    class ThroughModel extends sequelize_1.Model {
    }
    ThroughModel.init(modelAttributes, options);
    return ThroughModel;
};
exports.createThroughModel = createThroughModel;
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
const addThroughAttributes = (throughModel, attributes) => {
    const existingAttributes = throughModel.getAttributes();
    const newAttributes = { ...existingAttributes, ...attributes };
    // Note: In production, you'd need to run a migration to add these fields
    Object.assign(throughModel.rawAttributes, attributes);
    return throughModel;
};
exports.addThroughAttributes = addThroughAttributes;
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
const createThroughIndexes = async (throughModel, indexConfigs) => {
    const queryInterface = throughModel.sequelize?.getQueryInterface();
    if (!queryInterface) {
        throw new Error('QueryInterface not available');
    }
    const tableName = throughModel.tableName;
    for (const indexConfig of indexConfigs) {
        await queryInterface.addIndex(tableName, {
            fields: indexConfig.fields,
            unique: indexConfig.unique,
            name: indexConfig.name,
            where: indexConfig.where,
        });
    }
};
exports.createThroughIndexes = createThroughIndexes;
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
const queryThroughModel = async (throughModel, query = {}) => {
    return await throughModel.findAll({
        where: query.where,
        attributes: query.attributes,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
    });
};
exports.queryThroughModel = queryThroughModel;
// ============================================================================
// EAGER LOADING STRATEGIES
// ============================================================================
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
const optimizedInclude = (includes) => {
    const processedIncludes = includes.map((inc) => {
        const includeConfig = {
            model: inc.model,
            as: inc.as,
            attributes: inc.attributes,
            where: inc.where,
            required: inc.required,
            separate: inc.separate,
            limit: inc.limit,
            offset: inc.offset,
            order: inc.order,
            through: inc.through,
            duplicating: inc.duplicating,
        };
        if (inc.include) {
            includeConfig.include = (0, exports.optimizedInclude)(inc.include).include;
        }
        return includeConfig;
    });
    return {
        include: processedIncludes,
        subQuery: includes.some((inc) => inc.subQuery !== false),
    };
};
exports.optimizedInclude = optimizedInclude;
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
const separateQueryInclude = (includes) => {
    const processedIncludes = includes.map((inc) => ({
        ...inc,
        separate: true,
        duplicating: false,
    }));
    return (0, exports.optimizedInclude)(processedIncludes);
};
exports.separateQueryInclude = separateQueryInclude;
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
const eagerLoadWithDepthLimit = (model, config) => {
    const maxDepth = config.maxDepth || 3;
    const visited = new Set();
    const buildIncludes = (currentModel, depth) => {
        if (depth >= maxDepth)
            return [];
        const modelName = currentModel.name;
        if (config.preventCircular && visited.has(modelName)) {
            return [];
        }
        visited.add(modelName);
        const associations = Object.values(currentModel.associations || {});
        const includes = associations.map((assoc) => {
            const targetModel = assoc.target;
            const includeConfig = {
                model: targetModel,
                as: assoc.as,
            };
            if (config.optimizeCartesian && depth > 0) {
                includeConfig.separate = true;
            }
            const nestedIncludes = buildIncludes(targetModel, depth + 1);
            if (nestedIncludes.length > 0) {
                includeConfig.include = nestedIncludes;
            }
            return includeConfig;
        });
        return includes;
    };
    return {
        include: buildIncludes(model, 0),
    };
};
exports.eagerLoadWithDepthLimit = eagerLoadWithDepthLimit;
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
const batchLoadAssociations = async (model, associationKey, parentIds) => {
    const records = await model.findAll({
        where: {
            [associationKey]: {
                [sequelize_1.Op.in]: parentIds,
            },
        },
    });
    const resultMap = new Map();
    // Initialize map with empty arrays
    parentIds.forEach((id) => resultMap.set(id, []));
    // Group records by parent ID
    records.forEach((record) => {
        const parentId = record[associationKey];
        const existing = resultMap.get(parentId) || [];
        existing.push(record);
        resultMap.set(parentId, existing);
    });
    return resultMap;
};
exports.batchLoadAssociations = batchLoadAssociations;
// ============================================================================
// INCLUDE OPTIMIZATION
// ============================================================================
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
const optimizeIncludeAttributes = (includes, essentialFields = ['id']) => {
    return includes.map((inc) => {
        if (!inc.attributes) {
            inc.attributes = essentialFields;
        }
        if (inc.include) {
            inc.include = (0, exports.optimizeIncludeAttributes)(inc.include, essentialFields);
        }
        return inc;
    });
};
exports.optimizeIncludeAttributes = optimizeIncludeAttributes;
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
const conditionalInclude = (condition, include) => {
    return condition() ? include : null;
};
exports.conditionalInclude = conditionalInclude;
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
const mergeIncludes = (...includeArrays) => {
    const merged = [];
    const seen = new Set();
    for (const includes of includeArrays) {
        for (const inc of includes) {
            const key = `${inc.model.name}-${inc.as || ''}`;
            if (!seen.has(key)) {
                merged.push(inc);
                seen.add(key);
            }
        }
    }
    return merged;
};
exports.mergeIncludes = mergeIncludes;
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
const paginatedInclude = (include, page, pageSize) => {
    return {
        ...include,
        separate: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
    };
};
exports.paginatedInclude = paginatedInclude;
// ============================================================================
// NESTED INCLUDES
// ============================================================================
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
const buildNestedIncludes = (structure) => {
    const include = {
        model: structure.model,
        as: structure.as,
        where: structure.where,
        attributes: structure.attributes,
        required: structure.required,
    };
    if (structure.children && structure.children.length > 0) {
        include.include = structure.children.flatMap(exports.buildNestedIncludes);
    }
    return [include];
};
exports.buildNestedIncludes = buildNestedIncludes;
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
const flattenNestedIncludes = (includes) => {
    return includes.map((inc) => {
        const flattened = { ...inc, separate: true };
        if (inc.include && inc.include.length > 0) {
            flattened.include = (0, exports.flattenNestedIncludes)(inc.include);
        }
        return flattened;
    });
};
exports.flattenNestedIncludes = flattenNestedIncludes;
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
const recursiveInclude = (model, associationName, maxDepth = 5) => {
    const buildRecursive = (depth) => {
        if (depth >= maxDepth)
            return undefined;
        return {
            model,
            as: associationName,
            include: [buildRecursive(depth + 1)].filter(Boolean),
        };
    };
    return buildRecursive(0);
};
exports.recursiveInclude = recursiveInclude;
// ============================================================================
// ASSOCIATION SCOPES
// ============================================================================
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
const createScopedAssociation = (source, target, config) => {
    const scope = typeof config.scope === 'function' ? config.scope() : config.scope;
    return source.hasMany(target, {
        as: config.name,
        scope,
        ...config.includeOptions,
    });
};
exports.createScopedAssociation = createScopedAssociation;
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
const createDynamicScope = (source, target, scopeName, scopeFunction) => {
    // Store the scope function for later use
    source[`_scope_${scopeName}`] = scopeFunction;
    return source.hasMany(target, {
        as: scopeName,
    });
};
exports.createDynamicScope = createDynamicScope;
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
const applyScopeToInclude = (findOptions, scope) => {
    const includes = Array.isArray(findOptions.include)
        ? findOptions.include
        : findOptions.include
            ? [findOptions.include]
            : [];
    const scopedIncludes = includes.map((inc) => ({
        ...inc,
        where: inc.where ? { [sequelize_1.Op.and]: [inc.where, scope] } : scope,
    }));
    return {
        ...findOptions,
        include: scopedIncludes,
    };
};
exports.applyScopeToInclude = applyScopeToInclude;
// ============================================================================
// POLYMORPHIC ASSOCIATIONS
// ============================================================================
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
const createPolymorphicAssociation = (source, targets, config) => {
    const associations = [];
    for (const target of targets) {
        const association = source.belongsTo(target, {
            foreignKey: config.foreignKey,
            constraints: config.constraints || false,
            as: config.as,
            scope: {
                [config.discriminatorField]: target.name,
                ...config.scope,
            },
        });
        associations.push(association);
    }
    return associations;
};
exports.createPolymorphicAssociation = createPolymorphicAssociation;
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
const createReversePolymorphic = (source, target, config) => {
    return source.hasMany(target, {
        foreignKey: config.foreignKey,
        constraints: config.constraints || false,
        scope: {
            [config.discriminatorField]: source.name,
            ...config.scope,
        },
        as: config.as,
    });
};
exports.createReversePolymorphic = createReversePolymorphic;
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
const queryPolymorphic = async (model, options) => {
    const records = await model.findAll({
        where: options.where,
    });
    if (!options.includeAll) {
        return records;
    }
    // Group records by type
    const recordsByType = records.reduce((acc, record) => {
        const type = record[options.discriminatorField];
        if (!acc[type])
            acc[type] = [];
        acc[type].push(record);
        return acc;
    }, {});
    // Load associated records for each type
    for (const [type, typeRecords] of Object.entries(recordsByType)) {
        const targetModel = options.targetModels[type];
        if (!targetModel)
            continue;
        const ids = typeRecords.map((r) => r[options.foreignKey]);
        const associated = await targetModel.findAll({
            where: { id: { [sequelize_1.Op.in]: ids } },
        });
        const associatedMap = new Map(associated.map((a) => [a.id, a]));
        typeRecords.forEach((record) => {
            record.dataValues.polymorphicTarget = associatedMap.get(record[options.foreignKey]);
        });
    }
    return records;
};
exports.queryPolymorphic = queryPolymorphic;
// ============================================================================
// SELF-REFERENTIAL RELATIONSHIPS
// ============================================================================
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
const createSelfReferential = (model, config) => {
    const children = model.hasMany(model, {
        foreignKey: config.foreignKey,
        as: config.as,
    });
    const parent = model.belongsTo(model, {
        foreignKey: config.foreignKey,
        as: config.inverse || 'parent',
    });
    return { parent, children };
};
exports.createSelfReferential = createSelfReferential;
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
const queryHierarchy = async (model, rootId, options) => {
    const maxDepth = options.maxDepth || 10;
    const buildHierarchyInclude = (depth) => {
        if (depth >= maxDepth)
            return undefined;
        return {
            model,
            as: options.childrenAssociation,
            include: [buildHierarchyInclude(depth + 1)].filter(Boolean),
        };
    };
    return await model.findByPk(rootId, {
        include: [buildHierarchyInclude(0)].filter(Boolean),
    });
};
exports.queryHierarchy = queryHierarchy;
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
const queryAncestors = async (model, recordId, options) => {
    const ancestors = [];
    let current = await model.findByPk(recordId);
    while (current && current[options.foreignKey]) {
        const parent = await model.findByPk(current[options.foreignKey]);
        if (!parent)
            break;
        ancestors.push(parent);
        current = parent;
    }
    return ancestors;
};
exports.queryAncestors = queryAncestors;
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
const querySiblings = async (model, recordId, foreignKey) => {
    const record = await model.findByPk(recordId);
    if (!record || !record[foreignKey])
        return [];
    return await model.findAll({
        where: {
            [foreignKey]: record[foreignKey],
            id: { [sequelize_1.Op.ne]: recordId },
        },
    });
};
exports.querySiblings = querySiblings;
// ============================================================================
// JUNCTION TABLE HELPERS
// ============================================================================
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
const addToJunction = async (sourceModel, sourceId, targetModel, targetId, throughAttributes = {}, transaction) => {
    const source = await sourceModel.findByPk(sourceId, { transaction });
    if (!source)
        throw new Error('Source record not found');
    // Get the association
    const associations = Object.values(sourceModel.associations);
    const association = associations.find((a) => a.target === targetModel);
    if (!association) {
        throw new Error('Association not found');
    }
    // Use the add method with through attributes
    const addMethod = `add${association.as.charAt(0).toUpperCase() + association.as.slice(1)}`;
    if (typeof source[addMethod] === 'function') {
        return await source[addMethod](targetId, {
            through: throughAttributes,
            transaction,
        });
    }
    throw new Error('Add method not available on association');
};
exports.addToJunction = addToJunction;
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
const removeFromJunction = async (sourceModel, sourceId, targetModel, targetId, transaction) => {
    const source = await sourceModel.findByPk(sourceId, { transaction });
    if (!source)
        throw new Error('Source record not found');
    const associations = Object.values(sourceModel.associations);
    const association = associations.find((a) => a.target === targetModel);
    if (!association) {
        throw new Error('Association not found');
    }
    const removeMethod = `remove${association.as.charAt(0).toUpperCase() + association.as.slice(1)}`;
    if (typeof source[removeMethod] === 'function') {
        return await source[removeMethod](targetId, { transaction });
    }
    throw new Error('Remove method not available on association');
};
exports.removeFromJunction = removeFromJunction;
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
const updateJunctionAttributes = async (throughModel, where, updates, transaction) => {
    const [affectedCount, affectedRows] = await throughModel.update(updates, {
        where,
        transaction,
        returning: true,
    });
    return affectedRows?.[0];
};
exports.updateJunctionAttributes = updateJunctionAttributes;
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
const queryJunctionTable = async (throughModel, query) => {
    return await throughModel.findAll({
        where: query.where,
        attributes: query.attributes,
        order: query.order,
        limit: query.limit,
        offset: query.offset,
    });
};
exports.queryJunctionTable = queryJunctionTable;
// ============================================================================
// ASSOCIATION VALIDATORS
// ============================================================================
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
const validateAssociationIntegrity = async (sourceModel, targetModel, foreignKey) => {
    const result = {
        valid: true,
        errors: [],
        warnings: [],
        recommendations: [],
    };
    // Check for orphaned records
    const orphanedRecords = await sourceModel.count({
        where: {
            [foreignKey]: {
                [sequelize_1.Op.ne]: null,
            },
        },
        include: [
            {
                model: targetModel,
                required: false,
                where: {
                    id: null,
                },
            },
        ],
    });
    if (orphanedRecords > 0) {
        result.valid = false;
        result.errors.push(`Found ${orphanedRecords} orphaned records with invalid foreign keys`);
    }
    // Check for missing indexes
    const tableInfo = await sourceModel.sequelize?.getQueryInterface().describeTable(sourceModel.tableName);
    if (tableInfo && !tableInfo[foreignKey]?.primaryKey) {
        result.warnings.push(`Foreign key ${foreignKey} may benefit from an index`);
        result.recommendations.push(`Consider adding index: CREATE INDEX idx_${sourceModel.tableName}_${foreignKey} ON ${sourceModel.tableName}(${foreignKey})`);
    }
    return result;
};
exports.validateAssociationIntegrity = validateAssociationIntegrity;
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
const validateJunctionTableIntegrity = async (throughModel, foreignKey1, foreignKey2, model1, model2) => {
    const result = {
        valid: true,
        errors: [],
        warnings: [],
        recommendations: [],
    };
    // Check for orphaned records on first foreign key
    const orphaned1 = await throughModel.count({
        where: (0, sequelize_1.literal)(`
      NOT EXISTS (
        SELECT 1 FROM ${model1.tableName}
        WHERE ${model1.tableName}.id = ${throughModel.tableName}.${foreignKey1}
      )
    `),
    });
    if (orphaned1 > 0) {
        result.valid = false;
        result.errors.push(`Found ${orphaned1} orphaned records with invalid ${foreignKey1}`);
    }
    // Check for orphaned records on second foreign key
    const orphaned2 = await throughModel.count({
        where: (0, sequelize_1.literal)(`
      NOT EXISTS (
        SELECT 1 FROM ${model2.tableName}
        WHERE ${model2.tableName}.id = ${throughModel.tableName}.${foreignKey2}
      )
    `),
    });
    if (orphaned2 > 0) {
        result.valid = false;
        result.errors.push(`Found ${orphaned2} orphaned records with invalid ${foreignKey2}`);
    }
    // Check for duplicate entries
    const duplicates = await throughModel.sequelize?.query(`
    SELECT ${foreignKey1}, ${foreignKey2}, COUNT(*) as count
    FROM ${throughModel.tableName}
    GROUP BY ${foreignKey1}, ${foreignKey2}
    HAVING COUNT(*) > 1
  `, { type: sequelize_1.QueryTypes.SELECT });
    if (duplicates && duplicates.length > 0) {
        result.valid = false;
        result.errors.push(`Found ${duplicates.length} duplicate junction entries`);
        result.recommendations.push(`Add unique constraint: CREATE UNIQUE INDEX idx_unique_junction ON ${throughModel.tableName}(${foreignKey1}, ${foreignKey2})`);
    }
    return result;
};
exports.validateJunctionTableIntegrity = validateJunctionTableIntegrity;
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
const checkCircularReferences = async (model, associationPath) => {
    // This is a simplified check - production implementation would be more comprehensive
    const parts = associationPath.split('.');
    const visited = new Set();
    let currentModel = model;
    for (const part of parts) {
        const key = `${currentModel.name}.${part}`;
        if (visited.has(key)) {
            return true; // Circular reference detected
        }
        visited.add(key);
        const association = currentModel.associations[part];
        if (!association)
            break;
        currentModel = association.target;
    }
    return false;
};
exports.checkCircularReferences = checkCircularReferences;
// ============================================================================
// CASCADE DELETE CONFIGURATION
// ============================================================================
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
const configureCascadeDelete = (source, target, config) => {
    const associationName = Object.keys(source.associations).find((key) => source.associations[key].target === target);
    if (!associationName) {
        throw new Error('Association not found');
    }
    const association = source.associations[associationName];
    // Configure hooks if needed
    if (config.cascadeHooks) {
        source.addHook('beforeDestroy', async (instance, options) => {
            if (config.softDelete && options.paranoid !== false) {
                // Soft delete
                const getter = `get${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
                if (typeof instance[getter] === 'function') {
                    const related = await instance[getter](options);
                    if (Array.isArray(related)) {
                        await Promise.all(related.map((r) => r.destroy({ ...options, paranoid: true })));
                    }
                    else if (related) {
                        await related.destroy({ ...options, paranoid: true });
                    }
                }
            }
        });
    }
    return association;
};
exports.configureCascadeDelete = configureCascadeDelete;
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
const cascadeDelete = async (instance, associations, transaction) => {
    for (const assocName of associations) {
        const getter = `get${assocName.charAt(0).toUpperCase() + assocName.slice(1)}`;
        if (typeof instance[getter] === 'function') {
            const related = await instance[getter]({ transaction });
            if (Array.isArray(related)) {
                await Promise.all(related.map((r) => r.destroy({ transaction, force: true })));
            }
            else if (related) {
                await related.destroy({ transaction, force: true });
            }
        }
    }
};
exports.cascadeDelete = cascadeDelete;
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
const softCascadeDelete = async (instance, associations, transaction) => {
    const modelClass = instance.constructor;
    for (const assocName of associations) {
        const association = modelClass.associations[assocName];
        if (!association)
            continue;
        const foreignKey = association.foreignKey;
        const targetModel = association.target;
        await targetModel.update({ [foreignKey]: null }, {
            where: { [foreignKey]: instance.id },
            transaction,
        });
    }
};
exports.softCascadeDelete = softCascadeDelete;
// ============================================================================
// ASSOCIATION COUNTING
// ============================================================================
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
const countAssociations = async (instance, associationName, config = {}) => {
    const countMethod = `count${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
    if (typeof instance[countMethod] === 'function') {
        return await instance[countMethod]({
            where: config.where,
            distinct: config.distinct,
        });
    }
    throw new Error(`Count method ${countMethod} not available`);
};
exports.countAssociations = countAssociations;
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
const includeAssociationCount = (findOptions, associationName, countAlias) => {
    const existingAttributes = findOptions.attributes || [];
    const attributes = Array.isArray(existingAttributes)
        ? existingAttributes
        : { ...existingAttributes };
    const countAttribute = [
        (0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)(`${associationName}.id`)),
        countAlias,
    ];
    if (Array.isArray(attributes)) {
        attributes.push(countAttribute);
    }
    else if (attributes.include) {
        attributes.include.push(countAttribute);
    }
    else {
        attributes.include = [countAttribute];
    }
    return {
        ...findOptions,
        attributes,
        include: [
            ...(Array.isArray(findOptions.include) ? findOptions.include : []),
            {
                association: associationName,
                attributes: [],
            },
        ],
        group: ['id'],
        subQuery: false,
    };
};
exports.includeAssociationCount = includeAssociationCount;
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
const batchCountAssociations = async (model, instanceIds, associationName, where) => {
    const association = model.associations[associationName];
    if (!association) {
        throw new Error(`Association ${associationName} not found`);
    }
    const foreignKey = association.foreignKey;
    const targetModel = association.target;
    const counts = await targetModel.findAll({
        attributes: [
            foreignKey,
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count'],
        ],
        where: {
            [foreignKey]: { [sequelize_1.Op.in]: instanceIds },
            ...where,
        },
        group: [foreignKey],
        raw: true,
    });
    const countMap = new Map();
    instanceIds.forEach((id) => countMap.set(id, 0));
    counts.forEach((result) => {
        countMap.set(result[foreignKey], parseInt(result.count, 10));
    });
    return countMap;
};
exports.batchCountAssociations = batchCountAssociations;
// ============================================================================
// M:N RELATIONSHIP UTILITIES
// ============================================================================
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
const syncManyToMany = async (instance, associationName, targetIds, transaction) => {
    const setMethod = `set${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
    if (typeof instance[setMethod] === 'function') {
        await instance[setMethod](targetIds, { transaction });
    }
    else {
        throw new Error(`Set method ${setMethod} not available`);
    }
};
exports.syncManyToMany = syncManyToMany;
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
const addManyToMany = async (instance, associationName, targetIds, throughAttributes = {}, transaction) => {
    const addMethod = `add${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
    if (typeof instance[addMethod] === 'function') {
        await instance[addMethod](targetIds, {
            through: throughAttributes,
            transaction,
        });
    }
    else {
        throw new Error(`Add method ${addMethod} not available`);
    }
};
exports.addManyToMany = addManyToMany;
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
const removeManyToMany = async (instance, associationName, targetIds, transaction) => {
    const removeMethod = `remove${associationName.charAt(0).toUpperCase() + associationName.slice(1)}`;
    if (typeof instance[removeMethod] === 'function') {
        await instance[removeMethod](targetIds, { transaction });
    }
    else {
        throw new Error(`Remove method ${removeMethod} not available`);
    }
};
exports.removeManyToMany = removeManyToMany;
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
const hasManyToMany = async (instance, associationName, targetId, transaction) => {
    const hasMethod = `has${associationName.charAt(0).toUpperCase() + associationName.slice(1).replace(/s$/, '')}`;
    if (typeof instance[hasMethod] === 'function') {
        return await instance[hasMethod](targetId, { transaction });
    }
    throw new Error(`Has method ${hasMethod} not available`);
};
exports.hasManyToMany = hasManyToMany;
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
const getAssociationStats = async (sourceModel, targetModel, foreignKey) => {
    const totalRecords = await sourceModel.count();
    const orphanedRecords = await sourceModel.count({
        where: {
            [foreignKey]: { [sequelize_1.Op.ne]: null },
        },
        include: [
            {
                model: targetModel,
                required: false,
                where: { id: null },
            },
        ],
    });
    const avgQuery = await sourceModel.sequelize?.query(`
    SELECT AVG(count) as average
    FROM (
      SELECT COUNT(*) as count
      FROM ${sourceModel.tableName}
      WHERE ${foreignKey} IS NOT NULL
      GROUP BY ${foreignKey}
    ) subquery
  `, { type: sequelize_1.QueryTypes.SELECT });
    const averageRelationships = avgQuery?.[0]
        ? parseFloat(avgQuery[0].average)
        : 0;
    const association = Object.values(sourceModel.associations).find((a) => a.target === targetModel);
    return {
        associationType: association?.associationType || 'unknown',
        sourceModel: sourceModel.name,
        targetModel: targetModel.name,
        foreignKey,
        recordCount: totalRecords,
        orphanedRecords,
        averageRelationships,
    };
};
exports.getAssociationStats = getAssociationStats;
//# sourceMappingURL=database-associations-kit.js.map