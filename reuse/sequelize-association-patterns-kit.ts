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
  Transaction,
  WhereOptions,
  Op,
  Attributes,
  CreationAttributes,
  ForeignKey,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  attributes?: string[] | { include?: string[]; exclude?: string[] };
  required?: boolean;
  separate?: boolean;
  include?: IncludeBuilderConfig[];
  order?: any[];
  limit?: number;
  offset?: number;
  through?: { attributes?: string[]; where?: WhereOptions };
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
export const buildHasOneAssociation = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions = {},
): Association => {
  const hasOneOptions: HasOneOptions = {
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
export const buildHasOneRequired = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
): Association => {
  return buildHasOneAssociation(source, target, {
    ...options,
    constraints: true,
    onDelete: 'RESTRICT',
  });
};

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
export const buildHasOneScopedAssociation = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
  scopeConditions: WhereOptions,
): Association => {
  return buildHasOneAssociation(source, target, {
    ...options,
    scope: scopeConditions,
  });
};

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
export const buildHasManyAssociation = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions = {},
): Association => {
  const hasManyOptions: HasManyOptions = {
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
export const buildHasManyOrdered = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
  orderClause: any[],
): Association => {
  return buildHasManyAssociation(source, target, {
    ...options,
    scope: { ...options.scope, order: orderClause },
  });
};

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
export const buildHasManyScoped = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
  scopeConditions: WhereOptions,
  limit?: number,
): Association => {
  return buildHasManyAssociation(source, target, {
    ...options,
    scope: { ...scopeConditions, ...(limit ? { limit } : {}) },
  });
};

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
export const buildBelongsToAssociation = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions = {},
): Association => {
  const belongsToOptions: BelongsToOptions = {
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
export const buildBelongsToOptional = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
): Association => {
  return buildBelongsToAssociation(source, target, {
    ...options,
    onDelete: 'SET NULL',
    constraints: true,
  });
};

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
export const buildBelongsToWithTargetKey = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  options: AssociationBuilderOptions,
  targetKey: string,
): Association => {
  return buildBelongsToAssociation(source, target, {
    ...options,
    targetKey,
  });
};

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
export const buildBelongsToManyAssociation = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  through: ModelStatic<any>,
  options: AssociationBuilderOptions = {},
): Association => {
  const belongsToManyOptions: BelongsToManyOptions = {
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
export const buildBidirectionalBelongsToMany = (
  model1: ModelStatic<any>,
  model2: ModelStatic<any>,
  through: ModelStatic<any>,
  config: {
    model1: AssociationBuilderOptions;
    model2: AssociationBuilderOptions;
  },
): [Association, Association] => {
  const assoc1 = buildBelongsToManyAssociation(model1, model2, through, config.model1);
  const assoc2 = buildBelongsToManyAssociation(model2, model1, through, config.model2);
  return [assoc1, assoc2];
};

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
export const buildBelongsToManyWithThroughScope = (
  source: ModelStatic<any>,
  target: ModelStatic<any>,
  through: ModelStatic<any>,
  options: AssociationBuilderOptions,
  throughScope: WhereOptions,
): Association => {
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
export const createJunctionTableDefinition = (
  tableName: string,
  foreignKey1: string,
  foreignKey2: string,
  config: JunctionTableConfig = {},
): object => {
  const definition: any = {
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
export const generateJunctionTableName = (
  model1Name: string,
  model2Name: string,
): string => {
  const [first, second] = [model1Name, model2Name]
    .map(name => name.toLowerCase())
    .sort();
  return `${first}_${second}s`;
};

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
export const createJunctionTableAttributes = (
  foreignKey1: string,
  foreignKey2: string,
  additionalAttributes: Record<string, any> = {},
): object => {
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
export const buildEagerLoadConfig = (
  includes: IncludeBuilderConfig[],
  config: EagerLoadConfig = {},
): Includeable[] => {
  const { maxDepth = 3, strategy = 'nested' } = config;

  const processIncludes = (
    includeList: IncludeBuilderConfig[],
    currentDepth: number = 0,
  ): Includeable[] => {
    if (currentDepth >= maxDepth) {
      return [];
    }

    return includeList.map((inc) => {
      const include: any = {
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
export const buildSeparateQueryInclude = (
  model: ModelStatic<any>,
  as: string,
  where?: WhereOptions,
  order?: any[],
  limit?: number,
): Includeable => {
  return {
    model,
    as,
    where,
    order,
    limit,
    separate: true,
  };
};

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
export const buildSubqueryInclude = (
  model: ModelStatic<any>,
  as: string,
  where?: WhereOptions,
): Includeable => {
  return {
    model,
    as,
    where,
    subQuery: true,
    required: false,
  } as any;
};

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
export const buildIncludeConfig = (config: IncludeBuilderConfig): Includeable => {
  const include: any = {
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
    include.include = config.include.map(buildIncludeConfig);
  }

  return include;
};

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
export const buildNestedIncludes = (
  configs: IncludeBuilderConfig[],
): Includeable[] => {
  return configs.map(buildIncludeConfig);
};

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
export const buildRequiredInclude = (
  model: ModelStatic<any>,
  as: string,
  where?: WhereOptions,
): Includeable => {
  return {
    model,
    as,
    where,
    required: true,
  };
};

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
export const generateAssociationAlias = (
  modelName: string,
  suffix: string,
): string => {
  const baseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return `${baseName}${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
};

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
export const extractAssociationAlias = (association: Association): string => {
  return (association as any).as || (association as any).options?.as || '';
};

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
export const validateAliasUniqueness = (
  model: ModelStatic<any>,
  alias: string,
): boolean => {
  const associations = (model as any).associations || {};
  return !(alias in associations);
};

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
export const extractThroughModel = (association: Association): ModelStatic<any> | null => {
  return (association as any).through?.model || null;
};

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
export const updateThroughTableAttributes = async (
  sourceInstance: Model,
  targetInstance: Model,
  associationName: string,
  attributes: Record<string, any>,
  transaction?: Transaction,
): Promise<void> => {
  const association = (sourceInstance.constructor as any).associations[associationName];
  if (!association) {
    throw new Error(`Association ${associationName} not found`);
  }

  const throughModel = extractThroughModel(association);
  if (!throughModel) {
    throw new Error('Association does not have a through model');
  }

  const foreignKey = (association as any).foreignKey;
  const otherKey = (association as any).otherKey;

  await throughModel.update(attributes, {
    where: {
      [foreignKey]: (sourceInstance as any).id,
      [otherKey]: (targetInstance as any).id,
    },
    transaction,
  });
};

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
export const queryThroughTable = async (
  sourceInstance: Model,
  targetInstance: Model,
  associationName: string,
  transaction?: Transaction,
): Promise<Model | null> => {
  const association = (sourceInstance.constructor as any).associations[associationName];
  if (!association) {
    throw new Error(`Association ${associationName} not found`);
  }

  const throughModel = extractThroughModel(association);
  if (!throughModel) {
    throw new Error('Association does not have a through model');
  }

  const foreignKey = (association as any).foreignKey;
  const otherKey = (association as any).otherKey;

  return await throughModel.findOne({
    where: {
      [foreignKey]: (sourceInstance as any).id,
      [otherKey]: (targetInstance as any).id,
    },
    transaction,
  });
};

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
export const generateForeignKeyName = (
  modelName: string,
  fieldName: string = 'id',
): string => {
  const baseName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return `${baseName}${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
};

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
export const extractForeignKey = (association: Association): string => {
  return (association as any).foreignKey || '';
};

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
export const validateForeignKeyExists = (
  model: ModelStatic<any>,
  foreignKey: string,
): boolean => {
  const attributes = (model as any).rawAttributes || {};
  return foreignKey in attributes;
};

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
export const buildCascadeDeleteConfig = (includeHooks: boolean = true): CascadeConfig => {
  return {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: includeHooks,
  };
};

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
export const buildSoftCascadeConfig = (includeHooks: boolean = true): CascadeConfig => {
  return {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    hooks: includeHooks,
  };
};

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
export const buildRestrictCascadeConfig = (): CascadeConfig => {
  return {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    hooks: true,
  };
};

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
export const buildPolymorphicAssociation = (
  sourceModel: ModelStatic<any>,
  config: PolymorphicConfig,
): void => {
  (sourceModel as any)._polymorphicConfig = {
    typeField: config.polymorphicType,
    idField: config.polymorphicId,
    as: config.as,
  };

  sourceModel.addHook('beforeValidate', (instance: any) => {
    if (!instance[config.polymorphicType] || !instance[config.polymorphicId]) {
      throw new Error(
        `Polymorphic fields ${config.polymorphicType} and ${config.polymorphicId} are required`,
      );
    }
  });
};

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
export const getPolymorphicTarget = async (
  instance: Model,
  models: Record<string, ModelStatic<any>>,
): Promise<Model | null> => {
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
};

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
export const setPolymorphicTarget = async (
  instance: Model,
  target: Model,
  transaction?: Transaction,
): Promise<Model> => {
  const config = (instance.constructor as any)._polymorphicConfig;
  if (!config) {
    throw new Error('Model does not have polymorphic configuration');
  }

  const targetType = (target.constructor as any).name;
  const targetId = (target as any).id;

  (instance as any)[config.typeField] = targetType;
  (instance as any)[config.idField] = targetId;

  if (!instance.isNewRecord) {
    await instance.save({ transaction });
  }

  return instance;
};

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
export const buildSelfReferencingManyToMany = (
  model: ModelStatic<any>,
  throughModel: ModelStatic<any>,
  config: {
    as1: string;
    as2: string;
    foreignKey1: string;
    foreignKey2: string;
  },
): [Association, Association] => {
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
export const buildHierarchicalAssociation = (
  model: ModelStatic<any>,
  config: {
    parentAs?: string;
    childrenAs?: string;
    foreignKey?: string;
  } = {},
): [Association, Association] => {
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
};

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
export const preventCircularReferences = (
  includes: IncludeBuilderConfig[],
  config: CircularRefConfig,
): Includeable[] => {
  const visited = new Set<string>();

  const processIncludes = (
    includeList: IncludeBuilderConfig[],
    depth: number = 0,
    path: string = '',
  ): Includeable[] => {
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

        const include: any = buildIncludeConfig(inc);

        if (inc.include && inc.include.length > 0) {
          include.include = processIncludes(inc.include, depth + 1, currentPath);
        }

        return include;
      })
      .filter((inc) => inc !== null) as Includeable[];
  };

  return processIncludes(includes);
};

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
export const detectCircularDependency = (
  startModel: ModelStatic<any>,
  targetModelName: string,
  maxDepth: number = 5,
): boolean => {
  const visited = new Set<string>();

  const traverse = (model: ModelStatic<any>, depth: number): boolean => {
    if (depth >= maxDepth) return false;

    const modelName = model.name;
    if (visited.has(modelName)) return false;

    visited.add(modelName);

    const associations = (model as any).associations || {};

    for (const [name, assoc] of Object.entries(associations)) {
      const targetModel = (assoc as any).target;
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
export const validateAssociationConfig = (
  options: AssociationBuilderOptions,
  associationType: string,
): boolean => {
  if (!options.as) {
    throw new Error('Association alias (as) is required');
  }

  if (
    ['hasMany', 'hasOne', 'belongsTo'].includes(associationType) &&
    !options.foreignKey
  ) {
    throw new Error(`Foreign key is required for ${associationType} association`);
  }

  if (
    associationType === 'belongsToMany' &&
    (!options.foreignKey || !options.targetKey)
  ) {
    throw new Error('Both foreignKey and targetKey required for belongsToMany');
  }

  return true;
};

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
export const getAssociationNames = (model: ModelStatic<any>): string[] => {
  const associations = (model as any).associations || {};
  return Object.keys(associations);
};

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
export const getAssociationMetadata = (
  association: Association,
): AssociationMetadata => {
  return {
    type: (association as any).associationType,
    foreignKey: (association as any).foreignKey,
    targetKey: (association as any).targetKey,
    sourceKey: (association as any).sourceKey,
    as: (association as any).as,
    through: (association as any).through?.model?.name,
  };
};

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
export const isManyToManyAssociation = (association: Association): boolean => {
  return (association as any).associationType === 'BelongsToMany';
};

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
export const getAssociationType = (association: Association): string => {
  return (association as any).associationType || 'Unknown';
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // HasOne builders
  buildHasOneAssociation,
  buildHasOneRequired,
  buildHasOneScopedAssociation,

  // HasMany builders
  buildHasManyAssociation,
  buildHasManyOrdered,
  buildHasManyScoped,

  // BelongsTo builders
  buildBelongsToAssociation,
  buildBelongsToOptional,
  buildBelongsToWithTargetKey,

  // BelongsToMany builders
  buildBelongsToManyAssociation,
  buildBidirectionalBelongsToMany,
  buildBelongsToManyWithThroughScope,

  // Junction table factories
  createJunctionTableDefinition,
  generateJunctionTableName,
  createJunctionTableAttributes,

  // Eager loading helpers
  buildEagerLoadConfig,
  buildSeparateQueryInclude,
  buildSubqueryInclude,

  // Include builders
  buildIncludeConfig,
  buildNestedIncludes,
  buildRequiredInclude,

  // Association alias management
  generateAssociationAlias,
  extractAssociationAlias,
  validateAliasUniqueness,

  // Through model utilities
  extractThroughModel,
  updateThroughTableAttributes,
  queryThroughTable,

  // Foreign key helpers
  generateForeignKeyName,
  extractForeignKey,
  validateForeignKeyExists,

  // Cascade options
  buildCascadeDeleteConfig,
  buildSoftCascadeConfig,
  buildRestrictCascadeConfig,

  // Polymorphic associations
  buildPolymorphicAssociation,
  getPolymorphicTarget,
  setPolymorphicTarget,

  // Self-referencing associations
  buildSelfReferencingManyToMany,
  buildHierarchicalAssociation,

  // Circular reference handling
  preventCircularReferences,
  detectCircularDependency,

  // Association validation helpers
  validateAssociationConfig,
  getAssociationNames,
  getAssociationMetadata,
  isManyToManyAssociation,
  getAssociationType,
};
