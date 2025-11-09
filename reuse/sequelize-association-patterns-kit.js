"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociationType = exports.isManyToManyAssociation = exports.getAssociationMetadata = exports.getAssociationNames = exports.validateAssociationConfig = exports.detectCircularDependency = exports.preventCircularReferences = exports.buildHierarchicalAssociation = exports.buildSelfReferencingManyToMany = exports.setPolymorphicTarget = exports.getPolymorphicTarget = exports.buildPolymorphicAssociation = exports.buildRestrictCascadeConfig = exports.buildSoftCascadeConfig = exports.buildCascadeDeleteConfig = exports.validateForeignKeyExists = exports.extractForeignKey = exports.generateForeignKeyName = exports.queryThroughTable = exports.updateThroughTableAttributes = exports.extractThroughModel = exports.validateAliasUniqueness = exports.extractAssociationAlias = exports.generateAssociationAlias = exports.buildRequiredInclude = exports.buildNestedIncludes = exports.buildIncludeConfig = exports.buildSubqueryInclude = exports.buildSeparateQueryInclude = exports.buildEagerLoadConfig = exports.createJunctionTableAttributes = exports.generateJunctionTableName = exports.createJunctionTableDefinition = exports.buildBelongsToManyWithThroughScope = exports.buildBidirectionalBelongsToMany = exports.buildBelongsToManyAssociation = exports.buildBelongsToWithTargetKey = exports.buildBelongsToOptional = exports.buildBelongsToAssociation = exports.buildHasManyScoped = exports.buildHasManyOrdered = exports.buildHasManyAssociation = exports.buildHasOneScopedAssociation = exports.buildHasOneRequired = exports.buildHasOneAssociation = void 0;
// ============================================================================
// HASONE ASSOCIATION BUILDERS
// ============================================================================
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
const buildHasOneAssociation = (source, target, options = {}) => {
    const hasOneOptions = {
        as: options.as,
        foreignKey: options.foreignKey,
        sourceKey: options.sourceKey,
        onDelete: options.onDelete || 'CASCADE',
        onUpdate: options.onUpdate || 'CASCADE',
        constraints: options.constraints !== false,
        hooks: options.hooks !== false,
        scope: options.scope,
    };
    return source.hasOne(target, hasOneOptions);
};
exports.buildHasOneAssociation = buildHasOneAssociation;
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
const buildHasOneRequired = (source, target, options) => {
    return (0, exports.buildHasOneAssociation)(source, target, {
        ...options,
        constraints: true,
        onDelete: 'RESTRICT',
    });
};
exports.buildHasOneRequired = buildHasOneRequired;
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
const buildHasOneScopedAssociation = (source, target, options, scopeConditions) => {
    return (0, exports.buildHasOneAssociation)(source, target, {
        ...options,
        scope: scopeConditions,
    });
};
exports.buildHasOneScopedAssociation = buildHasOneScopedAssociation;
// ============================================================================
// HASMANY ASSOCIATION BUILDERS
// ============================================================================
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
const buildHasManyAssociation = (source, target, options = {}) => {
    const hasManyOptions = {
        as: options.as,
        foreignKey: options.foreignKey,
        sourceKey: options.sourceKey,
        onDelete: options.onDelete || 'CASCADE',
        onUpdate: options.onUpdate || 'CASCADE',
        constraints: options.constraints !== false,
        hooks: options.hooks !== false,
        scope: options.scope,
    };
    return source.hasMany(target, hasManyOptions);
};
exports.buildHasManyAssociation = buildHasManyAssociation;
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
const buildHasManyOrdered = (source, target, options, orderClause) => {
    return (0, exports.buildHasManyAssociation)(source, target, {
        ...options,
        scope: { ...options.scope, order: orderClause },
    });
};
exports.buildHasManyOrdered = buildHasManyOrdered;
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
const buildHasManyScoped = (source, target, options, scopeConditions, limit) => {
    return (0, exports.buildHasManyAssociation)(source, target, {
        ...options,
        scope: { ...scopeConditions, ...(limit ? { limit } : {}) },
    });
};
exports.buildHasManyScoped = buildHasManyScoped;
// ============================================================================
// BELONGSTO ASSOCIATION BUILDERS
// ============================================================================
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
const buildBelongsToAssociation = (source, target, options = {}) => {
    const belongsToOptions = {
        as: options.as,
        foreignKey: options.foreignKey,
        targetKey: options.targetKey,
        onDelete: options.onDelete || 'CASCADE',
        onUpdate: options.onUpdate || 'CASCADE',
        constraints: options.constraints !== false,
        hooks: options.hooks !== false,
        scope: options.scope,
    };
    return source.belongsTo(target, belongsToOptions);
};
exports.buildBelongsToAssociation = buildBelongsToAssociation;
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
const buildBelongsToOptional = (source, target, options) => {
    return (0, exports.buildBelongsToAssociation)(source, target, {
        ...options,
        onDelete: 'SET NULL',
        constraints: true,
    });
};
exports.buildBelongsToOptional = buildBelongsToOptional;
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
const buildBelongsToWithTargetKey = (source, target, options, targetKey) => {
    return (0, exports.buildBelongsToAssociation)(source, target, {
        ...options,
        targetKey,
    });
};
exports.buildBelongsToWithTargetKey = buildBelongsToWithTargetKey;
// ============================================================================
// BELONGSTOMANY ASSOCIATION BUILDERS
// ============================================================================
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
const buildBelongsToManyAssociation = (source, target, through, options = {}) => {
    const belongsToManyOptions = {
        through,
        as: options.as,
        foreignKey: options.foreignKey,
        otherKey: options.targetKey,
        onDelete: options.onDelete || 'CASCADE',
        onUpdate: options.onUpdate || 'CASCADE',
        constraints: options.constraints !== false,
        hooks: options.hooks !== false,
        scope: options.scope,
    };
    return source.belongsToMany(target, belongsToManyOptions);
};
exports.buildBelongsToManyAssociation = buildBelongsToManyAssociation;
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
const buildBidirectionalBelongsToMany = (model1, model2, through, config) => {
    const assoc1 = (0, exports.buildBelongsToManyAssociation)(model1, model2, through, config.model1);
    const assoc2 = (0, exports.buildBelongsToManyAssociation)(model2, model1, through, config.model2);
    return [assoc1, assoc2];
};
exports.buildBidirectionalBelongsToMany = buildBidirectionalBelongsToMany;
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
const buildBelongsToManyWithThroughScope = (source, target, through, options, throughScope) => {
    return source.belongsToMany(target, {
        through: {
            model: through,
            scope: throughScope,
        },
        as: options.as,
        foreignKey: options.foreignKey,
        otherKey: options.targetKey,
    });
};
exports.buildBelongsToManyWithThroughScope = buildBelongsToManyWithThroughScope;
// ============================================================================
// JUNCTION TABLE FACTORIES
// ============================================================================
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
const createJunctionTableDefinition = (tableName, foreignKey1, foreignKey2, config = {}) => {
    const definition = {
        tableName,
        timestamps: config.timestamps !== false,
        paranoid: config.paranoid || false,
        indexes: [
            {
                unique: true,
                fields: [foreignKey1, foreignKey2],
            },
            {
                fields: [foreignKey1],
            },
            {
                fields: [foreignKey2],
            },
        ],
    };
    if (config.additionalFields) {
        definition.additionalFields = config.additionalFields;
    }
    return definition;
};
exports.createJunctionTableDefinition = createJunctionTableDefinition;
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
const generateJunctionTableName = (model1Name, model2Name) => {
    const [first, second] = [model1Name, model2Name]
        .map(name => name.toLowerCase())
        .sort();
    return `${first}_${second}s`;
};
exports.generateJunctionTableName = generateJunctionTableName;
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
const createJunctionTableAttributes = (foreignKey1, foreignKey2, additionalAttributes = {}) => {
    return {
        [foreignKey1]: {
            type: 'UUID',
            allowNull: false,
            references: true,
        },
        [foreignKey2]: {
            type: 'UUID',
            allowNull: false,
            references: true,
        },
        ...additionalAttributes,
    };
};
exports.createJunctionTableAttributes = createJunctionTableAttributes;
// ============================================================================
// EAGER LOADING HELPERS
// ============================================================================
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
const buildEagerLoadConfig = (includes, config = {}) => {
    const { maxDepth = 3, strategy = 'nested' } = config;
    const processIncludes = (includeList, currentDepth = 0) => {
        if (currentDepth >= maxDepth) {
            return [];
        }
        return includeList.map((inc) => {
            const include = {
                model: inc.model,
                as: inc.as,
                where: inc.where,
                attributes: inc.attributes,
                required: inc.required,
                separate: strategy === 'separate' || inc.separate,
                order: inc.order,
                limit: inc.limit,
                offset: inc.offset,
                through: inc.through,
            };
            if (inc.include && inc.include.length > 0) {
                include.include = processIncludes(inc.include, currentDepth + 1);
            }
            return include;
        });
    };
    return processIncludes(includes);
};
exports.buildEagerLoadConfig = buildEagerLoadConfig;
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
const buildSeparateQueryInclude = (model, as, where, order, limit) => {
    return {
        model,
        as,
        where,
        order,
        limit,
        separate: true,
    };
};
exports.buildSeparateQueryInclude = buildSeparateQueryInclude;
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
const buildSubqueryInclude = (model, as, where) => {
    return {
        model,
        as,
        where,
        subQuery: true,
        required: false,
    };
};
exports.buildSubqueryInclude = buildSubqueryInclude;
// ============================================================================
// INCLUDE BUILDERS
// ============================================================================
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
const buildIncludeConfig = (config) => {
    const include = {
        model: config.model,
        as: config.as,
        where: config.where,
        attributes: config.attributes,
        required: config.required,
        separate: config.separate,
        order: config.order,
        limit: config.limit,
        offset: config.offset,
    };
    if (config.through) {
        include.through = config.through;
    }
    if (config.include && config.include.length > 0) {
        include.include = config.include.map(exports.buildIncludeConfig);
    }
    return include;
};
exports.buildIncludeConfig = buildIncludeConfig;
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
const buildNestedIncludes = (configs) => {
    return configs.map(exports.buildIncludeConfig);
};
exports.buildNestedIncludes = buildNestedIncludes;
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
const buildRequiredInclude = (model, as, where) => {
    return {
        model,
        as,
        where,
        required: true,
    };
};
exports.buildRequiredInclude = buildRequiredInclude;
// ============================================================================
// ASSOCIATION ALIAS MANAGEMENT
// ============================================================================
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
const generateAssociationAlias = (modelName, suffix) => {
    const baseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    return `${baseName}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
};
exports.generateAssociationAlias = generateAssociationAlias;
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
const extractAssociationAlias = (association) => {
    return association.as || association.options?.as || '';
};
exports.extractAssociationAlias = extractAssociationAlias;
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
const validateAliasUniqueness = (model, alias) => {
    const associations = model.associations || {};
    return !(alias in associations);
};
exports.validateAliasUniqueness = validateAliasUniqueness;
// ============================================================================
// THROUGH MODEL UTILITIES
// ============================================================================
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
const extractThroughModel = (association) => {
    return association.through?.model || null;
};
exports.extractThroughModel = extractThroughModel;
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
const updateThroughTableAttributes = async (sourceInstance, targetInstance, associationName, attributes, transaction) => {
    const association = sourceInstance.constructor.associations[associationName];
    if (!association) {
        throw new Error(`Association ${associationName} not found`);
    }
    const throughModel = (0, exports.extractThroughModel)(association);
    if (!throughModel) {
        throw new Error('Association does not have a through model');
    }
    const foreignKey = association.foreignKey;
    const otherKey = association.otherKey;
    await throughModel.update(attributes, {
        where: {
            [foreignKey]: sourceInstance.id,
            [otherKey]: targetInstance.id,
        },
        transaction,
    });
};
exports.updateThroughTableAttributes = updateThroughTableAttributes;
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
const queryThroughTable = async (sourceInstance, targetInstance, associationName, transaction) => {
    const association = sourceInstance.constructor.associations[associationName];
    if (!association) {
        throw new Error(`Association ${associationName} not found`);
    }
    const throughModel = (0, exports.extractThroughModel)(association);
    if (!throughModel) {
        throw new Error('Association does not have a through model');
    }
    const foreignKey = association.foreignKey;
    const otherKey = association.otherKey;
    return await throughModel.findOne({
        where: {
            [foreignKey]: sourceInstance.id,
            [otherKey]: targetInstance.id,
        },
        transaction,
    });
};
exports.queryThroughTable = queryThroughTable;
// ============================================================================
// FOREIGN KEY HELPERS
// ============================================================================
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
const generateForeignKeyName = (modelName, fieldName = 'id') => {
    const baseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    return `${baseName}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
};
exports.generateForeignKeyName = generateForeignKeyName;
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
const extractForeignKey = (association) => {
    return association.foreignKey || '';
};
exports.extractForeignKey = extractForeignKey;
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
const validateForeignKeyExists = (model, foreignKey) => {
    const attributes = model.rawAttributes || {};
    return foreignKey in attributes;
};
exports.validateForeignKeyExists = validateForeignKeyExists;
// ============================================================================
// CASCADE OPTIONS
// ============================================================================
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
const buildCascadeDeleteConfig = (includeHooks = true) => {
    return {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        hooks: includeHooks,
    };
};
exports.buildCascadeDeleteConfig = buildCascadeDeleteConfig;
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
const buildSoftCascadeConfig = (includeHooks = true) => {
    return {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        hooks: includeHooks,
    };
};
exports.buildSoftCascadeConfig = buildSoftCascadeConfig;
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
const buildRestrictCascadeConfig = () => {
    return {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
        hooks: true,
    };
};
exports.buildRestrictCascadeConfig = buildRestrictCascadeConfig;
// ============================================================================
// POLYMORPHIC ASSOCIATIONS
// ============================================================================
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
const buildPolymorphicAssociation = (sourceModel, config) => {
    sourceModel._polymorphicConfig = {
        typeField: config.polymorphicType,
        idField: config.polymorphicId,
        as: config.as,
    };
    sourceModel.addHook('beforeValidate', (instance) => {
        if (!instance[config.polymorphicType] || !instance[config.polymorphicId]) {
            throw new Error(`Polymorphic fields ${config.polymorphicType} and ${config.polymorphicId} are required`);
        }
    });
};
exports.buildPolymorphicAssociation = buildPolymorphicAssociation;
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
const getPolymorphicTarget = async (instance, models) => {
    const config = instance.constructor._polymorphicConfig;
    if (!config) {
        throw new Error('Model does not have polymorphic configuration');
    }
    const type = instance[config.typeField];
    const id = instance[config.idField];
    if (!type || !id)
        return null;
    const TargetModel = models[type];
    if (!TargetModel) {
        throw new Error(`Model ${type} not found in models registry`);
    }
    return await TargetModel.findByPk(id);
};
exports.getPolymorphicTarget = getPolymorphicTarget;
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
const setPolymorphicTarget = async (instance, target, transaction) => {
    const config = instance.constructor._polymorphicConfig;
    if (!config) {
        throw new Error('Model does not have polymorphic configuration');
    }
    const targetType = target.constructor.name;
    const targetId = target.id;
    instance[config.typeField] = targetType;
    instance[config.idField] = targetId;
    if (!instance.isNewRecord) {
        await instance.save({ transaction });
    }
    return instance;
};
exports.setPolymorphicTarget = setPolymorphicTarget;
// ============================================================================
// SELF-REFERENCING ASSOCIATIONS
// ============================================================================
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
const buildSelfReferencingManyToMany = (model, throughModel, config) => {
    const assoc1 = model.belongsToMany(model, {
        as: config.as1,
        through: throughModel,
        foreignKey: config.foreignKey2,
        otherKey: config.foreignKey1,
    });
    const assoc2 = model.belongsToMany(model, {
        as: config.as2,
        through: throughModel,
        foreignKey: config.foreignKey1,
        otherKey: config.foreignKey2,
    });
    return [assoc1, assoc2];
};
exports.buildSelfReferencingManyToMany = buildSelfReferencingManyToMany;
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
const buildHierarchicalAssociation = (model, config = {}) => {
    const { parentAs = 'parent', childrenAs = 'children', foreignKey = 'parentId', } = config;
    const parentAssoc = model.belongsTo(model, {
        as: parentAs,
        foreignKey,
    });
    const childrenAssoc = model.hasMany(model, {
        as: childrenAs,
        foreignKey,
    });
    return [parentAssoc, childrenAssoc];
};
exports.buildHierarchicalAssociation = buildHierarchicalAssociation;
// ============================================================================
// CIRCULAR REFERENCE HANDLING
// ============================================================================
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
const preventCircularReferences = (includes, config) => {
    const visited = new Set();
    const processIncludes = (includeList, depth = 0, path = '') => {
        if (depth >= config.maxDepth) {
            return [];
        }
        return includeList
            .map((inc) => {
            const currentPath = `${path}/${inc.model.name}:${inc.as || ''}`;
            if (config.preventInfiniteLoop && visited.has(currentPath)) {
                return null;
            }
            if (config.cacheVisited) {
                visited.add(currentPath);
            }
            const include = (0, exports.buildIncludeConfig)(inc);
            if (inc.include && inc.include.length > 0) {
                include.include = processIncludes(inc.include, depth + 1, currentPath);
            }
            return include;
        })
            .filter((inc) => inc !== null);
    };
    return processIncludes(includes);
};
exports.preventCircularReferences = preventCircularReferences;
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
const detectCircularDependency = (startModel, targetModelName, maxDepth = 5) => {
    const visited = new Set();
    const traverse = (model, depth) => {
        if (depth >= maxDepth)
            return false;
        const modelName = model.name;
        if (visited.has(modelName))
            return false;
        visited.add(modelName);
        const associations = model.associations || {};
        for (const [name, assoc] of Object.entries(associations)) {
            const targetModel = assoc.target;
            if (targetModel && targetModel.name === targetModelName && depth > 0) {
                return true;
            }
            if (targetModel && traverse(targetModel, depth + 1)) {
                return true;
            }
        }
        return false;
    };
    return traverse(startModel, 0);
};
exports.detectCircularDependency = detectCircularDependency;
// ============================================================================
// ASSOCIATION VALIDATION HELPERS
// ============================================================================
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
const validateAssociationConfig = (options, associationType) => {
    if (!options.as) {
        throw new Error('Association alias (as) is required');
    }
    if (['hasMany', 'hasOne', 'belongsTo'].includes(associationType) &&
        !options.foreignKey) {
        throw new Error(`Foreign key is required for ${associationType} association`);
    }
    if (associationType === 'belongsToMany' &&
        (!options.foreignKey || !options.targetKey)) {
        throw new Error('Both foreignKey and targetKey required for belongsToMany');
    }
    return true;
};
exports.validateAssociationConfig = validateAssociationConfig;
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
const getAssociationNames = (model) => {
    const associations = model.associations || {};
    return Object.keys(associations);
};
exports.getAssociationNames = getAssociationNames;
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
const getAssociationMetadata = (association) => {
    return {
        type: association.associationType,
        foreignKey: association.foreignKey,
        targetKey: association.targetKey,
        sourceKey: association.sourceKey,
        as: association.as,
        through: association.through?.model?.name,
    };
};
exports.getAssociationMetadata = getAssociationMetadata;
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
const isManyToManyAssociation = (association) => {
    return association.associationType === 'BelongsToMany';
};
exports.isManyToManyAssociation = isManyToManyAssociation;
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
const getAssociationType = (association) => {
    return association.associationType || 'Unknown';
};
exports.getAssociationType = getAssociationType;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // HasOne builders
    buildHasOneAssociation: exports.buildHasOneAssociation,
    buildHasOneRequired: exports.buildHasOneRequired,
    buildHasOneScopedAssociation: exports.buildHasOneScopedAssociation,
    // HasMany builders
    buildHasManyAssociation: exports.buildHasManyAssociation,
    buildHasManyOrdered: exports.buildHasManyOrdered,
    buildHasManyScoped: exports.buildHasManyScoped,
    // BelongsTo builders
    buildBelongsToAssociation: exports.buildBelongsToAssociation,
    buildBelongsToOptional: exports.buildBelongsToOptional,
    buildBelongsToWithTargetKey: exports.buildBelongsToWithTargetKey,
    // BelongsToMany builders
    buildBelongsToManyAssociation: exports.buildBelongsToManyAssociation,
    buildBidirectionalBelongsToMany: exports.buildBidirectionalBelongsToMany,
    buildBelongsToManyWithThroughScope: exports.buildBelongsToManyWithThroughScope,
    // Junction table factories
    createJunctionTableDefinition: exports.createJunctionTableDefinition,
    generateJunctionTableName: exports.generateJunctionTableName,
    createJunctionTableAttributes: exports.createJunctionTableAttributes,
    // Eager loading helpers
    buildEagerLoadConfig: exports.buildEagerLoadConfig,
    buildSeparateQueryInclude: exports.buildSeparateQueryInclude,
    buildSubqueryInclude: exports.buildSubqueryInclude,
    // Include builders
    buildIncludeConfig: exports.buildIncludeConfig,
    buildNestedIncludes: exports.buildNestedIncludes,
    buildRequiredInclude: exports.buildRequiredInclude,
    // Association alias management
    generateAssociationAlias: exports.generateAssociationAlias,
    extractAssociationAlias: exports.extractAssociationAlias,
    validateAliasUniqueness: exports.validateAliasUniqueness,
    // Through model utilities
    extractThroughModel: exports.extractThroughModel,
    updateThroughTableAttributes: exports.updateThroughTableAttributes,
    queryThroughTable: exports.queryThroughTable,
    // Foreign key helpers
    generateForeignKeyName: exports.generateForeignKeyName,
    extractForeignKey: exports.extractForeignKey,
    validateForeignKeyExists: exports.validateForeignKeyExists,
    // Cascade options
    buildCascadeDeleteConfig: exports.buildCascadeDeleteConfig,
    buildSoftCascadeConfig: exports.buildSoftCascadeConfig,
    buildRestrictCascadeConfig: exports.buildRestrictCascadeConfig,
    // Polymorphic associations
    buildPolymorphicAssociation: exports.buildPolymorphicAssociation,
    getPolymorphicTarget: exports.getPolymorphicTarget,
    setPolymorphicTarget: exports.setPolymorphicTarget,
    // Self-referencing associations
    buildSelfReferencingManyToMany: exports.buildSelfReferencingManyToMany,
    buildHierarchicalAssociation: exports.buildHierarchicalAssociation,
    // Circular reference handling
    preventCircularReferences: exports.preventCircularReferences,
    detectCircularDependency: exports.detectCircularDependency,
    // Association validation helpers
    validateAssociationConfig: exports.validateAssociationConfig,
    getAssociationNames: exports.getAssociationNames,
    getAssociationMetadata: exports.getAssociationMetadata,
    isManyToManyAssociation: exports.isManyToManyAssociation,
    getAssociationType: exports.getAssociationType,
};
//# sourceMappingURL=sequelize-association-patterns-kit.js.map