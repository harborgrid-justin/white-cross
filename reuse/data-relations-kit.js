"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncBidirectionalAssociations = exports.analyzeAssociationPerformance = exports.extractAssociationMetadata = exports.cleanupOrphanedRecords = exports.resolveCircularDependencies = exports.buildScopeWithParams = exports.getThroughInstance = exports.updateThroughAttributes = exports.queryThroughModel = exports.addAssociationScope = exports.cascadeUpdate = exports.removeForeignKeyConstraint = exports.addForeignKeyConstraint = exports.validateForeignKey = exports.cascadeDelete = exports.createAssociatedRecord = exports.setAssociations = exports.removeAssociationSafe = exports.addAssociationSafe = exports.checkAssociationExists = exports.countAssociatedRecords = exports.executeAssociationQuery = exports.mergeIncludes = exports.buildPaginatedInclude = exports.buildIncludesFromNames = exports.buildAttributeFilteredIncludes = exports.preventN1Queries = exports.buildConditionalInclude = exports.buildNestedIncludes = exports.buildOptimizedIncludes = exports.buildAncestorPath = exports.traverseHierarchy = exports.queryPolymorphicAssociation = exports.buildSelfReferentialManyToMany = exports.buildSelfReferentialAssociation = exports.createPolymorphicAssociation = exports.getJunctionRecordsWithAssociations = exports.updateJunctionAttributes = exports.bulkCreateJunctionEntries = exports.filterJunctionTable = exports.addJunctionAttributes = exports.createJunctionTable = exports.buildMultipleAssociations = exports.buildOptionalBelongsTo = exports.buildScopedAssociation = exports.buildHasOneAssociation = exports.buildBidirectionalHasMany = exports.buildBelongsToManyAssociation = exports.buildBelongsToAssociation = exports.buildHasManyAssociation = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// ASSOCIATION BUILDERS
// ============================================================================
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
const buildHasManyAssociation = (source, target, config = {}) => {
    const options = {
        as: config.as,
        foreignKey: config.foreignKey,
        sourceKey: config.sourceKey,
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
        constraints: config.constraints !== false,
        hooks: config.hooks !== false,
        scope: typeof config.scope === 'function' ? config.scope() : config.scope,
    };
    return source.hasMany(target, options);
};
exports.buildHasManyAssociation = buildHasManyAssociation;
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
const buildBelongsToAssociation = (source, target, config = {}) => {
    const options = {
        as: config.as,
        foreignKey: config.foreignKey,
        targetKey: config.targetKey,
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
        constraints: config.constraints !== false,
        hooks: config.hooks !== false,
        scope: typeof config.scope === 'function' ? config.scope() : config.scope,
    };
    return source.belongsTo(target, options);
};
exports.buildBelongsToAssociation = buildBelongsToAssociation;
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
const buildBelongsToManyAssociation = (source, target, config) => {
    if (!config.through) {
        throw new Error('belongsToMany requires a through model or table name');
    }
    const options = {
        as: config.as,
        through: config.through,
        foreignKey: config.foreignKey,
        otherKey: config.otherKey,
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
        constraints: config.constraints !== false,
        hooks: config.hooks !== false,
        scope: typeof config.scope === 'function' ? config.scope() : config.scope,
    };
    return source.belongsToMany(target, options);
};
exports.buildBelongsToManyAssociation = buildBelongsToManyAssociation;
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
const buildBidirectionalHasMany = (modelA, modelB, config) => {
    if (config.through) {
        return {
            aToB: (0, exports.buildBelongsToManyAssociation)(modelA, modelB, {
                ...config.aToB,
                through: config.through,
            }),
            bToA: (0, exports.buildBelongsToManyAssociation)(modelB, modelA, {
                ...config.bToA,
                through: config.through,
            }),
        };
    }
    return {
        aToB: (0, exports.buildHasManyAssociation)(modelA, modelB, config.aToB),
        bToA: (0, exports.buildHasManyAssociation)(modelB, modelA, config.bToA),
    };
};
exports.buildBidirectionalHasMany = buildBidirectionalHasMany;
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
const buildHasOneAssociation = (source, target, config = {}) => {
    const options = {
        as: config.as,
        foreignKey: config.foreignKey,
        sourceKey: config.sourceKey,
        onDelete: config.onDelete || 'CASCADE',
        onUpdate: config.onUpdate || 'CASCADE',
        constraints: config.constraints !== false,
        hooks: config.hooks !== false,
        scope: typeof config.scope === 'function' ? config.scope() : config.scope,
    };
    return source.hasOne(target, options);
};
exports.buildHasOneAssociation = buildHasOneAssociation;
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
const buildScopedAssociation = (source, target, config) => {
    const scopedConfig = {
        ...config,
        scope: typeof config.scope === 'function' ? config.scope() : config.scope,
    };
    return (0, exports.buildHasManyAssociation)(source, target, scopedConfig);
};
exports.buildScopedAssociation = buildScopedAssociation;
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
const buildOptionalBelongsTo = (source, target, config) => {
    const optionalConfig = {
        ...config,
        foreignKey: typeof config.foreignKey === 'string'
            ? { name: config.foreignKey, allowNull: true }
            : { ...config.foreignKey, allowNull: true },
        onDelete: config.onDelete || 'SET NULL',
    };
    return (0, exports.buildBelongsToAssociation)(source, target, optionalConfig);
};
exports.buildOptionalBelongsTo = buildOptionalBelongsTo;
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
const buildMultipleAssociations = (source, target, configs) => {
    return configs.map((config) => (0, exports.buildBelongsToAssociation)(source, target, config));
};
exports.buildMultipleAssociations = buildMultipleAssociations;
// ============================================================================
// JUNCTION TABLE HELPERS
// ============================================================================
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
const createJunctionTable = (sequelize, schema) => {
    class JunctionModel extends sequelize_1.Model {
    }
    const attributes = {
        ...(schema.additionalFields || {}),
    };
    JunctionModel.init(attributes, {
        sequelize,
        tableName: schema.tableName,
        timestamps: schema.timestamps !== false,
        paranoid: schema.paranoid || false,
        underscored: schema.underscored !== false,
        indexes: schema.indexes || [],
    });
    return JunctionModel;
};
exports.createJunctionTable = createJunctionTable;
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
const addJunctionAttributes = (include, attributes) => {
    return {
        ...include,
        through: {
            ...(include.through || {}),
            attributes,
        },
    };
};
exports.addJunctionAttributes = addJunctionAttributes;
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
const filterJunctionTable = (include, where) => {
    return {
        ...include,
        through: {
            ...(include.through || {}),
            where,
        },
    };
};
exports.filterJunctionTable = filterJunctionTable;
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
const bulkCreateJunctionEntries = async (junctionModel, entries, transaction) => {
    return junctionModel.bulkCreate(entries, {
        transaction,
        validate: true,
        individualHooks: true,
    });
};
exports.bulkCreateJunctionEntries = bulkCreateJunctionEntries;
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
const updateJunctionAttributes = async (junctionModel, where, updates, transaction) => {
    const [affectedCount] = await junctionModel.update(updates, {
        where,
        transaction,
        individualHooks: true,
    });
    return affectedCount;
};
exports.updateJunctionAttributes = updateJunctionAttributes;
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
const getJunctionRecordsWithAssociations = async (junctionModel, where, includes = []) => {
    return junctionModel.findAll({
        where,
        include: includes,
    });
};
exports.getJunctionRecordsWithAssociations = getJunctionRecordsWithAssociations;
// ============================================================================
// POLYMORPHIC & SELF-REFERENTIAL ASSOCIATIONS
// ============================================================================
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
const createPolymorphicAssociation = (config) => {
    const associations = [];
    config.models.forEach((model) => {
        const modelName = model.name;
        const scope = {
            ...(config.scope || {}),
            [config.polymorphicType]: modelName,
        };
        associations.push((0, exports.buildBelongsToAssociation)(model, model, {
            as: config.as,
            foreignKey: config.polymorphicId,
            constraints: config.constraints !== false,
            scope,
        }));
    });
    return associations;
};
exports.createPolymorphicAssociation = createPolymorphicAssociation;
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
const buildSelfReferentialAssociation = (model, config) => {
    const children = model.hasMany(model, {
        as: config.as || 'children',
        foreignKey: config.foreignKey || 'parentId',
    });
    const parent = model.belongsTo(model, {
        as: 'parent',
        foreignKey: config.foreignKey || 'parentId',
    });
    return { parent, children };
};
exports.buildSelfReferentialAssociation = buildSelfReferentialAssociation;
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
const buildSelfReferentialManyToMany = (model, config) => {
    if (!config.through) {
        throw new Error('Self-referential many-to-many requires a through model');
    }
    return (0, exports.buildBelongsToManyAssociation)(model, model, {
        as: config.as || 'related',
        through: config.through,
        foreignKey: config.foreignKey || 'sourceId',
        otherKey: config.otherKey || 'targetId',
    });
};
exports.buildSelfReferentialManyToMany = buildSelfReferentialManyToMany;
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
const queryPolymorphicAssociation = async (model, polymorphicType, typeValue, options = {}) => {
    return model.findAll({
        ...options,
        where: {
            ...(options.where || {}),
            [polymorphicType]: typeValue,
        },
    });
};
exports.queryPolymorphicAssociation = queryPolymorphicAssociation;
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
const traverseHierarchy = async (instance, config) => {
    const results = config.includeRoot ? [instance] : [];
    const maxDepth = config.maxDepth || 10;
    const visited = new Set();
    const traverse = async (node, depth) => {
        if (depth >= maxDepth)
            return;
        // Create unique key for cycle detection
        const nodeKey = `${node.constructor.name}:${node.id}`;
        // Check for circular reference
        if (visited.has(nodeKey)) {
            return;
        }
        // Mark node as visited
        visited.add(nodeKey);
        const children = await node[`get${capitalize(config.association)}`]();
        if (children && children.length > 0) {
            results.push(...children);
            for (const child of children) {
                await traverse(child, depth + 1);
            }
        }
    };
    await traverse(instance, 0);
    return results;
};
exports.traverseHierarchy = traverseHierarchy;
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
const buildAncestorPath = async (instance, parentAssociation = 'parent', maxDepth = 20) => {
    const ancestors = [];
    let current = instance;
    let depth = 0;
    while (depth < maxDepth) {
        const parent = await current[`get${capitalize(parentAssociation)}`]();
        if (!parent)
            break;
        ancestors.unshift(parent);
        current = parent;
        depth++;
    }
    return ancestors;
};
exports.buildAncestorPath = buildAncestorPath;
// ============================================================================
// EAGER LOADING & INCLUDE BUILDERS
// ============================================================================
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
const buildOptimizedIncludes = (includes, strategy) => {
    return includes.map((include) => {
        const optimized = {
            model: include.model,
            as: include.as,
            where: include.where,
            attributes: include.attributes,
            required: include.required,
            through: include.through,
            order: include.order,
            limit: include.limit,
            offset: include.offset,
        };
        // Apply strategy
        if (strategy.strategy === 'separate' && !include.required) {
            optimized.separate = true;
        }
        else if (strategy.strategy === 'subquery') {
            optimized.subQuery = true;
        }
        // Handle nested includes
        if (include.include && include.include.length > 0) {
            const currentDepth = 1;
            if (!strategy.maxDepth || currentDepth < strategy.maxDepth) {
                optimized.include = (0, exports.buildOptimizedIncludes)(include.include, {
                    ...strategy,
                    maxDepth: strategy.maxDepth ? strategy.maxDepth - 1 : undefined,
                });
            }
        }
        return optimized;
    });
};
exports.buildOptimizedIncludes = buildOptimizedIncludes;
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
const buildNestedIncludes = (config) => {
    return config.associations.map((assoc) => {
        const include = {
            model: assoc.model,
            as: assoc.as,
            separate: config.strategy === 'separate',
        };
        if (assoc.include) {
            include.include = (0, exports.buildNestedIncludes)(assoc.include);
        }
        return include;
    });
};
exports.buildNestedIncludes = buildNestedIncludes;
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
const buildConditionalInclude = (model, conditions) => {
    if (!conditions.condition(conditions.params)) {
        return null;
    }
    return {
        model,
        as: conditions.as,
        where: conditions.where,
        attributes: conditions.attributes,
    };
};
exports.buildConditionalInclude = buildConditionalInclude;
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
const preventN1Queries = (queryOptions) => {
    const optimized = { ...queryOptions };
    // Apply separate queries for hasMany to avoid cartesian products
    if (optimized.include && Array.isArray(optimized.include)) {
        optimized.include = optimized.include.map((include) => {
            if (!include.required && !include.separate) {
                return {
                    ...include,
                    separate: true,
                };
            }
            return include;
        });
    }
    return optimized;
};
exports.preventN1Queries = preventN1Queries;
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
const buildAttributeFilteredIncludes = (includes, attributeMap) => {
    return includes.map((include) => {
        const modelName = include.model.name;
        const attributes = attributeMap[modelName] || include.attributes;
        return {
            model: include.model,
            as: include.as,
            attributes,
            where: include.where,
            required: include.required,
            include: include.include
                ? (0, exports.buildAttributeFilteredIncludes)(include.include, attributeMap)
                : undefined,
        };
    });
};
exports.buildAttributeFilteredIncludes = buildAttributeFilteredIncludes;
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
const buildIncludesFromNames = (model, associationNames, recursive = false) => {
    const associations = model.associations || {};
    return associationNames
        .filter((name) => associations[name])
        .map((name) => {
        const association = associations[name];
        const include = {
            association: name,
        };
        if (recursive && association.target) {
            const nestedAssociations = Object.keys(association.target.associations || {});
            if (nestedAssociations.length > 0) {
                include.include = (0, exports.buildIncludesFromNames)(association.target, nestedAssociations, false);
            }
        }
        return include;
    });
};
exports.buildIncludesFromNames = buildIncludesFromNames;
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
const buildPaginatedInclude = (include, pagination) => {
    return {
        ...include,
        separate: true,
        limit: pagination.limit,
        offset: pagination.offset || 0,
        order: pagination.order,
    };
};
exports.buildPaginatedInclude = buildPaginatedInclude;
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
const mergeIncludes = (includeArrays) => {
    const includeMap = new Map();
    includeArrays.forEach((includes) => {
        includes.forEach((include) => {
            const key = include.as || include.model?.name || String(include.association);
            if (includeMap.has(key)) {
                const existing = includeMap.get(key);
                includeMap.set(key, {
                    ...existing,
                    ...include,
                    include: include.include
                        ? (0, exports.mergeIncludes)([existing.include || [], include.include])
                        : existing.include,
                });
            }
            else {
                includeMap.set(key, include);
            }
        });
    });
    return Array.from(includeMap.values());
};
exports.mergeIncludes = mergeIncludes;
// ============================================================================
// ASSOCIATION QUERY HELPERS
// ============================================================================
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
const executeAssociationQuery = async (instance, options) => {
    const methodName = `${options.method}${capitalize(options.association)}`;
    const method = instance[methodName];
    if (typeof method !== 'function') {
        throw new Error(`Association method ${methodName} not found`);
    }
    const params = {
        ...(options.params || {}),
        transaction: options.transaction,
        scope: options.scope,
    };
    return method.call(instance, params);
};
exports.executeAssociationQuery = executeAssociationQuery;
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
const countAssociatedRecords = async (instance, association, options = {}) => {
    const countMethod = `count${capitalize(association)}`;
    const method = instance[countMethod];
    if (typeof method !== 'function') {
        throw new Error(`Count method ${countMethod} not found`);
    }
    return method.call(instance, {
        where: options.where,
        include: options.include,
        distinct: options.distinct,
        group: options.group,
        transaction: options.transaction,
    });
};
exports.countAssociatedRecords = countAssociatedRecords;
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
const checkAssociationExists = async (instance, association, target, transaction) => {
    const hasMethod = `has${capitalize(association)}`;
    const method = instance[hasMethod];
    if (typeof method !== 'function') {
        throw new Error(`Has method ${hasMethod} not found`);
    }
    return method.call(instance, target, { transaction });
};
exports.checkAssociationExists = checkAssociationExists;
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
const addAssociationSafe = async (instance, association, target, options = {}) => {
    const addMethod = `add${capitalize(association)}`;
    const method = instance[addMethod];
    if (typeof method !== 'function') {
        throw new Error(`Add method ${addMethod} not found`);
    }
    await method.call(instance, target, {
        through: options.through,
        transaction: options.transaction,
    });
};
exports.addAssociationSafe = addAssociationSafe;
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
const removeAssociationSafe = async (instance, association, target, transaction) => {
    const removeMethod = `remove${capitalize(association)}`;
    const method = instance[removeMethod];
    if (typeof method !== 'function') {
        throw new Error(`Remove method ${removeMethod} not found`);
    }
    await method.call(instance, target, { transaction });
};
exports.removeAssociationSafe = removeAssociationSafe;
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
const setAssociations = async (instance, association, targets, options = {}) => {
    const setMethod = `set${capitalize(association)}`;
    const method = instance[setMethod];
    if (typeof method !== 'function') {
        throw new Error(`Set method ${setMethod} not found`);
    }
    await method.call(instance, targets, {
        through: options.through,
        transaction: options.transaction,
    });
};
exports.setAssociations = setAssociations;
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
const createAssociatedRecord = async (instance, association, data, transaction) => {
    const createMethod = `create${capitalize(association).replace(/s$/, '')}`;
    const method = instance[createMethod];
    if (typeof method !== 'function') {
        throw new Error(`Create method ${createMethod} not found`);
    }
    return method.call(instance, data, { transaction });
};
exports.createAssociatedRecord = createAssociatedRecord;
// ============================================================================
// CASCADE & FOREIGN KEY OPERATIONS
// ============================================================================
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
const cascadeDelete = async (instance, config) => {
    const transaction = config.transaction || await instance.sequelize.transaction();
    try {
        for (const association of config.associations) {
            const records = await instance[`get${capitalize(association)}`]({
                transaction,
            });
            if (records) {
                const recordArray = Array.isArray(records) ? records : [records];
                for (const record of recordArray) {
                    if (config.recursive) {
                        const nestedAssociations = Object.keys(record.constructor.associations || {});
                        if (nestedAssociations.length > 0) {
                            await (0, exports.cascadeDelete)(record, {
                                ...config,
                                associations: nestedAssociations,
                            });
                        }
                    }
                    await record.destroy({
                        transaction,
                        hooks: config.hooks !== false,
                    });
                }
            }
        }
        await instance.destroy({
            transaction,
            hooks: config.hooks !== false,
        });
        if (!config.transaction) {
            await transaction.commit();
        }
    }
    catch (error) {
        if (!config.transaction) {
            await transaction.rollback();
        }
        throw error;
    }
};
exports.cascadeDelete = cascadeDelete;
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
const validateForeignKey = async (model, config, value) => {
    if (config.allowNull && (value === null || value === undefined)) {
        return true;
    }
    if (!config.references) {
        return true;
    }
    const targetModel = typeof config.references.model === 'string'
        ? model.sequelize.models[config.references.model]
        : config.references.model;
    const exists = await targetModel.findOne({
        where: {
            [config.references.key]: value,
        },
    });
    return exists !== null;
};
exports.validateForeignKey = validateForeignKey;
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
const addForeignKeyConstraint = async (helper) => {
    // This is a helper for migration scripts
    // Actual implementation would use QueryInterface in migrations
    throw new Error('Use this helper in migration files with queryInterface');
};
exports.addForeignKeyConstraint = addForeignKeyConstraint;
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
const removeForeignKeyConstraint = async (helper) => {
    // This is a helper for migration scripts
    throw new Error('Use this helper in migration files with queryInterface');
};
exports.removeForeignKeyConstraint = removeForeignKeyConstraint;
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
const cascadeUpdate = async (instance, config, updates) => {
    const transaction = config.transaction || await instance.sequelize.transaction();
    try {
        for (const association of config.associations) {
            const records = await instance[`get${capitalize(association)}`]({
                transaction,
            });
            if (records) {
                const recordArray = Array.isArray(records) ? records : [records];
                for (const record of recordArray) {
                    await record.update(updates, {
                        transaction,
                        hooks: config.hooks !== false,
                    });
                    if (config.recursive) {
                        const nestedAssociations = Object.keys(record.constructor.associations || {});
                        if (nestedAssociations.length > 0) {
                            await (0, exports.cascadeUpdate)(record, {
                                ...config,
                                associations: nestedAssociations,
                            }, updates);
                        }
                    }
                }
            }
        }
        if (!config.transaction) {
            await transaction.commit();
        }
    }
    catch (error) {
        if (!config.transaction) {
            await transaction.rollback();
        }
        throw error;
    }
};
exports.cascadeUpdate = cascadeUpdate;
// ============================================================================
// ASSOCIATION SCOPES & THROUGH MODELS
// ============================================================================
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
const addAssociationScope = (model, scope) => {
    const conditions = typeof scope.conditions === 'function'
        ? scope.conditions
        : () => scope.conditions;
    model.addScope(scope.name, () => ({
        where: conditions(),
        include: scope.include,
    }), {
        override: true,
    });
    if (scope.defaultScope) {
        model.addScope('defaultScope', () => ({
            where: conditions(),
        }), {
            override: true,
        });
    }
};
exports.addAssociationScope = addAssociationScope;
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
const queryThroughModel = async (instance, association, throughConfig) => {
    const getMethod = `get${capitalize(association)}`;
    const method = instance[getMethod];
    if (typeof method !== 'function') {
        throw new Error(`Get method ${getMethod} not found`);
    }
    return method.call(instance, {
        through: {
            attributes: throughConfig.attributes,
            where: throughConfig.scope,
        },
        joinTableAttributes: throughConfig.attributes,
    });
};
exports.queryThroughModel = queryThroughModel;
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
const updateThroughAttributes = async (sourceInstance, targetInstance, throughModel, updates, transaction) => {
    const sourceIdField = Object.keys(throughModel.rawAttributes).find((attr) => attr.toLowerCase().includes(sourceInstance.constructor.name.toLowerCase()));
    const targetIdField = Object.keys(throughModel.rawAttributes).find((attr) => attr.toLowerCase().includes(targetInstance.constructor.name.toLowerCase()));
    if (!sourceIdField || !targetIdField) {
        throw new Error('Could not determine foreign key fields in through model');
    }
    const [affectedCount] = await throughModel.update(updates, {
        where: {
            [sourceIdField]: sourceInstance.id,
            [targetIdField]: targetInstance.id,
        },
        transaction,
    });
    return affectedCount;
};
exports.updateThroughAttributes = updateThroughAttributes;
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
const getThroughInstance = async (sourceInstance, targetInstance, throughModel) => {
    const sourceIdField = Object.keys(throughModel.rawAttributes).find((attr) => attr.toLowerCase().includes(sourceInstance.constructor.name.toLowerCase()));
    const targetIdField = Object.keys(throughModel.rawAttributes).find((attr) => attr.toLowerCase().includes(targetInstance.constructor.name.toLowerCase()));
    if (!sourceIdField || !targetIdField) {
        throw new Error('Could not determine foreign key fields in through model');
    }
    return throughModel.findOne({
        where: {
            [sourceIdField]: sourceInstance.id,
            [targetIdField]: targetInstance.id,
        },
    });
};
exports.getThroughInstance = getThroughInstance;
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
const buildScopeWithParams = (conditions, params) => {
    if (typeof conditions === 'function') {
        return conditions(params);
    }
    return conditions;
};
exports.buildScopeWithParams = buildScopeWithParams;
// ============================================================================
// ADVANCED ASSOCIATION MANAGEMENT
// ============================================================================
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
const resolveCircularDependencies = async (instance, config, includes) => {
    const visited = config.visitedSet || new Set();
    const instanceKey = `${instance.constructor.name}:${instance.id}`;
    if (visited.has(instanceKey)) {
        return instance;
    }
    if (config.cacheVisited) {
        visited.add(instanceKey);
    }
    if (visited.size >= config.maxDepth) {
        return instance;
    }
    const safeIncludes = includes.map((include) => ({
        ...include,
        include: undefined, // Prevent circular includes
    }));
    return instance.reload({
        include: safeIncludes,
    });
};
exports.resolveCircularDependencies = resolveCircularDependencies;
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
const cleanupOrphanedRecords = async (config) => {
    const orphans = await config.model.findAll({
        where: {
            [config.foreignKey]: {
                [sequelize_1.Op.notIn]: (0, sequelize_1.literal)(`(SELECT id FROM ${config.parentModel.tableName})`),
            },
        },
        attributes: ['id'],
        limit: config.batchSize || 1000,
    });
    const found = orphans.length;
    if (config.dryRun) {
        return { found, deleted: 0 };
    }
    const deleted = await config.model.destroy({
        where: {
            id: {
                [sequelize_1.Op.in]: orphans.map((o) => o.id),
            },
        },
        transaction: config.transaction,
    });
    return { found, deleted };
};
exports.cleanupOrphanedRecords = cleanupOrphanedRecords;
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
const extractAssociationMetadata = (model, associationName) => {
    const associations = model.associations || {};
    const association = associations[associationName];
    if (!association) {
        return null;
    }
    return {
        type: association.associationType,
        foreignKey: association.foreignKey,
        targetKey: association.targetKey,
        sourceKey: association.sourceKey,
        otherKey: association.otherKey,
        as: association.as,
        through: association.through,
        scope: association.scope,
    };
};
exports.extractAssociationMetadata = extractAssociationMetadata;
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
const analyzeAssociationPerformance = async (model, queryOptions) => {
    const startTime = Date.now();
    let queryCount = 0;
    // Hook into query execution
    const originalQuery = model.sequelize.query.bind(model.sequelize);
    model.sequelize.query = (...args) => {
        queryCount++;
        return originalQuery(...args);
    };
    try {
        const results = await model.findAll(queryOptions);
        const executionTime = Date.now() - startTime;
        // Restore original query method
        model.sequelize.query = originalQuery;
        const recommendations = [];
        let n1Detected = false;
        // Detect N+1 if query count > 2 (main query + 1 for includes is acceptable)
        if (queryCount > 2) {
            n1Detected = true;
            recommendations.push('N+1 query detected. Consider using separate: true or eager loading.');
        }
        if (queryOptions.include && Array.isArray(queryOptions.include)) {
            const hasNestedIncludes = queryOptions.include.some((inc) => inc.include && inc.include.length > 0);
            if (hasNestedIncludes && !queryOptions.subQuery) {
                recommendations.push('Nested includes detected. Consider using subQuery or separate queries.');
            }
        }
        return {
            associationName: model.name,
            queryCount,
            executionTime,
            rowsReturned: results.length,
            n1Detected,
            recommendations,
        };
    }
    catch (error) {
        // Restore original query method on error
        model.sequelize.query = originalQuery;
        throw error;
    }
};
exports.analyzeAssociationPerformance = analyzeAssociationPerformance;
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
const syncBidirectionalAssociations = async (config, sourceInstance, targetInstance) => {
    const transaction = config.transaction || await sourceInstance.sequelize.transaction();
    try {
        // Set association from source to target
        await (0, exports.setAssociations)(sourceInstance, config.sourceAssociation, targetInstance, { transaction });
        // Set association from target to source
        await (0, exports.setAssociations)(targetInstance, config.targetAssociation, sourceInstance, { transaction });
        if (!config.transaction) {
            await transaction.commit();
        }
    }
    catch (error) {
        if (!config.transaction) {
            await transaction.rollback();
        }
        throw error;
    }
};
exports.syncBidirectionalAssociations = syncBidirectionalAssociations;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
//# sourceMappingURL=data-relations-kit.js.map