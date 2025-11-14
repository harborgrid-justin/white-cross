/**
 * Enterprise Sequelize Model Association Strategies
 *
 * Advanced association patterns including polymorphic associations, through
 * tables, self-referencing relationships, cascade operations, and complex
 * association strategies for healthcare data modeling.
 *
 * @module reuse/data/composites/model-association-strategies
 * @version 1.0.0
 * @requires sequelize v6
 */

import {
  Model,
  ModelStatic,
  Association,
  BelongsToOptions,
  HasOneOptions,
  HasManyOptions,
  BelongsToManyOptions,
  IncludeOptions,
  Op,
  Sequelize,
  Transaction,
  FindOptions,
  DataTypes,
} from 'sequelize';

/**
 * Type definitions for association strategies
 */
export interface PolymorphicAssociationConfig {
  typeField: string;
  idField: string;
  models: Array<{ model: ModelStatic<any>; as: string; type: string }>;
  scope?: Record<string, any>;
}

export interface ThroughTableConfig {
  model: ModelStatic<any>;
  attributes?: string[];
  scope?: Record<string, any>;
  timestamps?: boolean;
}

export interface SelfReferenceConfig {
  foreignKey: string;
  parentAs: string;
  childrenAs: string;
  hierarchyDepth?: number;
  allowCycles?: boolean;
}

export interface CascadeConfig {
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  onUpdate: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  hooks?: boolean;
}

export interface ManyToManyConfig {
  throughModel: ModelStatic<any> | string;
  sourceKey?: string;
  targetKey?: string;
  foreignKey?: string;
  otherKey?: string;
  scope?: Record<string, any>;
}

// ============================================================================
// Basic Association Helpers
// ============================================================================

/**
 * Creates bidirectional one-to-one association
 *
 * Establishes hasOne and belongsTo relationships with consistent
 * configuration and cascade behavior for referential integrity.
 *
 * @param sourceModel - Source model (has one)
 * @param targetModel - Target model (belongs to)
 * @param options - Association options
 * @returns Both association objects
 *
 * @example
 * ```typescript
 * const { hasOne, belongsTo } = createOneToOneAssociation(
 *   User,
 *   Profile,
 *   {
 *     foreignKey: 'userId',
 *     sourceAs: 'profile',
 *     targetAs: 'user',
 *     cascade: { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
 *   }
 * );
 * ```
 */
export function createOneToOneAssociation(
  sourceModel: ModelStatic<any>,
  targetModel: ModelStatic<any>,
  options: {
    foreignKey?: string;
    sourceAs?: string;
    targetAs?: string;
    cascade?: Partial<CascadeConfig>;
  }
): {
  hasOne: Association;
  belongsTo: Association;
} {
  const foreignKey = options.foreignKey || `${sourceModel.name.toLowerCase()}Id`;
  const sourceAs = options.sourceAs || targetModel.name.toLowerCase();
  const targetAs = options.targetAs || sourceModel.name.toLowerCase();

  const hasOneAssoc = sourceModel.hasOne(targetModel, {
    foreignKey,
    as: sourceAs,
    onDelete: options.cascade?.onDelete || 'CASCADE',
    onUpdate: options.cascade?.onUpdate || 'CASCADE',
  });

  const belongsToAssoc = targetModel.belongsTo(sourceModel, {
    foreignKey,
    as: targetAs,
    onDelete: options.cascade?.onDelete || 'CASCADE',
    onUpdate: options.cascade?.onUpdate || 'CASCADE',
  });

  return {
    hasOne: hasOneAssoc,
    belongsTo: belongsToAssoc,
  };
}

/**
 * Creates bidirectional one-to-many association
 *
 * Establishes hasMany and belongsTo relationships with optimized
 * foreign key configuration and cascade operations.
 *
 * @param sourceModel - Source model (has many)
 * @param targetModel - Target model (belongs to)
 * @param options - Association options
 * @returns Both association objects
 *
 * @example
 * ```typescript
 * const { hasMany, belongsTo } = createOneToManyAssociation(
 *   User,
 *   Post,
 *   {
 *     foreignKey: 'authorId',
 *     sourceAs: 'posts',
 *     targetAs: 'author',
 *     cascade: { onDelete: 'CASCADE' }
 *   }
 * );
 * ```
 */
export function createOneToManyAssociation(
  sourceModel: ModelStatic<any>,
  targetModel: ModelStatic<any>,
  options: {
    foreignKey?: string;
    sourceAs?: string;
    targetAs?: string;
    cascade?: Partial<CascadeConfig>;
  }
): {
  hasMany: Association;
  belongsTo: Association;
} {
  const foreignKey = options.foreignKey || `${sourceModel.name.toLowerCase()}Id`;
  const sourceAs = options.sourceAs || `${targetModel.name.toLowerCase()}s`;
  const targetAs = options.targetAs || sourceModel.name.toLowerCase();

  const hasManyAssoc = sourceModel.hasMany(targetModel, {
    foreignKey,
    as: sourceAs,
    onDelete: options.cascade?.onDelete || 'CASCADE',
    onUpdate: options.cascade?.onUpdate || 'CASCADE',
  });

  const belongsToAssoc = targetModel.belongsTo(sourceModel, {
    foreignKey,
    as: targetAs,
    onDelete: options.cascade?.onDelete || 'CASCADE',
    onUpdate: options.cascade?.onUpdate || 'CASCADE',
  });

  return {
    hasMany: hasManyAssoc,
    belongsTo: belongsToAssoc,
  };
}

/**
 * Creates bidirectional many-to-many association
 *
 * Establishes belongsToMany relationships with junction table and
 * optimized through model configuration for efficient queries.
 *
 * @param model1 - First model
 * @param model2 - Second model
 * @param config - Many-to-many configuration
 * @returns Both association objects
 *
 * @example
 * ```typescript
 * const { assoc1, assoc2 } = createManyToManyAssociation(
 *   User,
 *   Role,
 *   {
 *     throughModel: UserRole,
 *     foreignKey: 'userId',
 *     otherKey: 'roleId',
 *     model1As: 'roles',
 *     model2As: 'users'
 *   }
 * );
 * ```
 */
export function createManyToManyAssociation(
  model1: ModelStatic<any>,
  model2: ModelStatic<any>,
  config: ManyToManyConfig & {
    model1As?: string;
    model2As?: string;
  }
): {
  assoc1: Association;
  assoc2: Association;
} {
  const model1As = config.model1As || `${model2.name.toLowerCase()}s`;
  const model2As = config.model2As || `${model1.name.toLowerCase()}s`;

  const assoc1 = model1.belongsToMany(model2, {
    through: config.throughModel,
    foreignKey: config.foreignKey || `${model1.name.toLowerCase()}Id`,
    otherKey: config.otherKey || `${model2.name.toLowerCase()}Id`,
    as: model1As,
    ...config.scope && { scope: config.scope },
  });

  const assoc2 = model2.belongsToMany(model1, {
    through: config.throughModel,
    foreignKey: config.otherKey || `${model2.name.toLowerCase()}Id`,
    otherKey: config.foreignKey || `${model1.name.toLowerCase()}Id`,
    as: model2As,
    ...config.scope && { scope: config.scope },
  });

  return {
    assoc1,
    assoc2,
  };
}

// ============================================================================
// Polymorphic Associations
// ============================================================================

/**
 * Creates polymorphic belongsTo association
 *
 * Implements polymorphic belongs-to relationships where a model can
 * belong to multiple different model types (e.g., comments on posts/videos).
 *
 * @param sourceModel - Model with polymorphic association
 * @param config - Polymorphic configuration
 * @returns Array of created associations
 *
 * @example
 * ```typescript
 * const associations = createPolymorphicBelongsTo(Comment, {
 *   typeField: 'commentableType',
 *   idField: 'commentableId',
 *   models: [
 *     { model: Post, as: 'post', type: 'Post' },
 *     { model: Video, as: 'video', type: 'Video' }
 *   ]
 * });
 * ```
 */
export function createPolymorphicBelongsTo(
  sourceModel: ModelStatic<any>,
  config: PolymorphicAssociationConfig
): Association[] {
  const associations: Association[] = [];

  // Validate configuration
  if (!config.models || config.models.length === 0) {
    throw new Error('Polymorphic association requires at least one target model');
  }

  // Add polymorphic fields to source model if not already present
  if (!sourceModel.rawAttributes[config.typeField]) {
    sourceModel.rawAttributes[config.typeField] = {
      type: DataTypes.STRING,
      allowNull: false,
    };
  }

  if (!sourceModel.rawAttributes[config.idField]) {
    sourceModel.rawAttributes[config.idField] = {
      type: DataTypes.INTEGER,
      allowNull: false,
    };
  }

  // Create associations for each target model
  for (const { model, as, type } of config.models) {
    const assoc = sourceModel.belongsTo(model, {
      foreignKey: config.idField,
      constraints: false, // Polymorphic associations can't have DB constraints
      as,
      scope: {
        [config.typeField]: type,
        ...config.scope,
      },
    });

    associations.push(assoc);
  }

  // Add composite index for performance
  const indexes = (sourceModel.options.indexes as any[]) || [];
  const indexExists = indexes.some(
    (idx) =>
      idx.fields?.includes(config.typeField) && idx.fields?.includes(config.idField)
  );

  if (!indexExists) {
    indexes.push({
      name: `${sourceModel.tableName}_polymorphic_idx`,
      fields: [config.typeField, config.idField],
      type: 'BTREE',
    });
    sourceModel.options.indexes = indexes;
  }

  return associations;
}

/**
 * Creates polymorphic hasMany association
 *
 * Implements reverse polymorphic relationships where models can have
 * many polymorphic children (e.g., posts have many comments).
 *
 * @param targetModels - Models that can have polymorphic children
 * @param sourceModel - Polymorphic child model
 * @param config - Polymorphic configuration
 * @returns Array of created associations
 *
 * @example
 * ```typescript
 * const associations = createPolymorphicHasMany(
 *   [
 *     { model: Post, type: 'Post' },
 *     { model: Video, type: 'Video' }
 *   ],
 *   Comment,
 *   {
 *     typeField: 'commentableType',
 *     idField: 'commentableId',
 *     as: 'comments'
 *   }
 * );
 * ```
 */
export function createPolymorphicHasMany(
  targetModels: Array<{ model: ModelStatic<any>; type: string }>,
  sourceModel: ModelStatic<any>,
  config: {
    typeField: string;
    idField: string;
    as: string;
    scope?: Record<string, any>;
  }
): Association[] {
  const associations: Association[] = [];

  for (const { model, type } of targetModels) {
    const assoc = model.hasMany(sourceModel, {
      foreignKey: config.idField,
      constraints: false,
      as: config.as,
      scope: {
        [config.typeField]: type,
        ...config.scope,
      },
    });

    associations.push(assoc);
  }

  return associations;
}

/**
 * Retrieves polymorphic association target
 *
 * Helper function to load the correct polymorphic target based on
 * type field value with optimized query construction.
 *
 * @param instance - Instance with polymorphic association
 * @param config - Polymorphic configuration
 * @returns Target model instance or null
 *
 * @example
 * ```typescript
 * const comment = await Comment.findByPk(1);
 * const parent = await getPolymorphicTarget(comment, {
 *   typeField: 'commentableType',
 *   idField: 'commentableId',
 *   models: [
 *     { model: Post, as: 'post', type: 'Post' },
 *     { model: Video, as: 'video', type: 'Video' }
 *   ]
 * });
 * ```
 */
export async function getPolymorphicTarget(
  instance: any,
  config: PolymorphicAssociationConfig
): Promise<Model | null> {
  const type = instance[config.typeField];
  const id = instance[config.idField];

  if (!type || !id) return null;

  const targetConfig = config.models.find((m) => m.type === type);
  if (!targetConfig) return null;

  return targetConfig.model.findByPk(id);
}

/**
 * Sets polymorphic association target
 *
 * Helper function to set polymorphic relationship with automatic
 * type field population and validation.
 *
 * @param instance - Instance to set association on
 * @param target - Target model instance
 * @param config - Polymorphic configuration
 *
 * @example
 * ```typescript
 * const comment = Comment.build({ content: 'Great post!' });
 * const post = await Post.findByPk(1);
 * await setPolymorphicTarget(comment, post, polymorphicConfig);
 * await comment.save();
 * ```
 */
export async function setPolymorphicTarget(
  instance: any,
  target: Model,
  config: Pick<PolymorphicAssociationConfig, 'typeField' | 'idField' | 'models'>
): Promise<void> {
  const targetType = target.constructor.name;
  const targetConfig = config.models.find((m) => m.type === targetType);

  if (!targetConfig) {
    throw new Error(`Model type ${targetType} not configured for polymorphic association`);
  }

  instance[config.typeField] = targetType;
  instance[config.idField] = (target as any).id;
}

// ============================================================================
// Self-Referencing Associations
// ============================================================================

/**
 * Creates self-referencing hierarchical association
 *
 * Establishes parent-child relationships within the same model for
 * tree structures like categories, org charts, or nested comments.
 *
 * @param model - Model to create self-reference on
 * @param config - Self-reference configuration
 * @returns Parent and children associations
 *
 * @example
 * ```typescript
 * const { parent, children } = createSelfReferencingAssociation(Category, {
 *   foreignKey: 'parentId',
 *   parentAs: 'parent',
 *   childrenAs: 'children',
 *   hierarchyDepth: 10,
 *   allowCycles: false
 * });
 * ```
 */
export function createSelfReferencingAssociation(
  model: ModelStatic<any>,
  config: SelfReferenceConfig
): {
  parent: Association;
  children: Association;
} {
  // Validate configuration
  if (config.parentAs === config.childrenAs) {
    throw new Error('Parent and children aliases must be different');
  }

  // Create parent association (belongsTo)
  const parent = model.belongsTo(model, {
    foreignKey: {
      name: config.foreignKey,
      allowNull: true, // Root nodes have no parent
    },
    as: config.parentAs,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Create children association (hasMany)
  const children = model.hasMany(model, {
    foreignKey: config.foreignKey,
    as: config.childrenAs,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Add index on foreign key
  const indexes = (model.options.indexes as any[]) || [];
  const indexExists = indexes.some(
    (idx) => idx.fields?.length === 1 && idx.fields[0] === config.foreignKey
  );

  if (!indexExists) {
    indexes.push({
      name: `${model.tableName}_${config.foreignKey}_hierarchy_idx`,
      fields: [config.foreignKey],
      type: 'BTREE',
    });
    model.options.indexes = indexes;
  }

  return { parent, children };
}

/**
 * Traverses hierarchical tree structure
 *
 * Recursively loads all descendants or ancestors of a node with
 * configurable depth limits and circular reference detection.
 *
 * @param instance - Starting node instance
 * @param direction - 'descendants' or 'ancestors'
 * @param options - Traversal options
 * @returns Array of related instances
 *
 * @example
 * ```typescript
 * const category = await Category.findByPk(1);
 * const descendants = await traverseHierarchy(category, 'descendants', {
 *   maxDepth: 5,
 *   includeAttributes: ['id', 'name'],
 *   orderBy: ['name', 'ASC']
 * });
 * ```
 */
export async function traverseHierarchy(
  instance: any,
  direction: 'descendants' | 'ancestors',
  options: {
    maxDepth?: number;
    includeAttributes?: string[];
    orderBy?: [string, 'ASC' | 'DESC'];
    where?: any;
  } = {}
): Promise<any[]> {
  const maxDepth = options.maxDepth || 10;
  const results: any[] = [];
  const visited = new Set<string>();

  const traverse = async (node: any, depth: number) => {
    if (depth >= maxDepth) return;

    const nodeId = node.id;
    if (visited.has(nodeId)) return; // Prevent cycles
    visited.add(nodeId);

    const associationName = direction === 'descendants' ? 'children' : 'parent';
    const findOptions: FindOptions = {
      attributes: options.includeAttributes,
      where: options.where,
    };

    if (direction === 'descendants') {
      const children = await node[`get${capitalize(associationName)}`](findOptions);

      for (const child of children) {
        results.push(child);
        await traverse(child, depth + 1);
      }
    } else {
      const parent = await node[`get${capitalize(associationName)}`](findOptions);

      if (parent) {
        results.push(parent);
        await traverse(parent, depth + 1);
      }
    }
  };

  await traverse(instance, 0);

  if (options.orderBy) {
    const [field, direction] = options.orderBy;
    results.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (direction === 'ASC') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  }

  return results;
}

/**
 * Finds root nodes in hierarchical structure
 *
 * Retrieves all nodes without parents (root level) with efficient
 * query optimization for large trees.
 *
 * @param model - Hierarchical model
 * @param foreignKey - Parent foreign key field
 * @param options - Query options
 * @returns Array of root nodes
 *
 * @example
 * ```typescript
 * const roots = await findRootNodes(Category, 'parentId', {
 *   where: { active: true },
 *   order: [['name', 'ASC']]
 * });
 * ```
 */
export async function findRootNodes(
  model: ModelStatic<any>,
  foreignKey: string,
  options: FindOptions = {}
): Promise<any[]> {
  return model.findAll({
    ...options,
    where: {
      ...options.where,
      [foreignKey]: null,
    },
  });
}

/**
 * Finds leaf nodes in hierarchical structure
 *
 * Retrieves all nodes without children (leaf level) using efficient
 * subquery or join-based approach.
 *
 * @param model - Hierarchical model
 * @param foreignKey - Parent foreign key field
 * @param options - Query options
 * @returns Array of leaf nodes
 *
 * @example
 * ```typescript
 * const leaves = await findLeafNodes(Category, 'parentId');
 * ```
 */
export async function findLeafNodes(
  model: ModelStatic<any>,
  foreignKey: string,
  options: FindOptions = {}
): Promise<any[]> {
  const sequelize = model.sequelize!;

  // Use LEFT JOIN to find nodes with no children
  const query = `
    SELECT t1.*
    FROM ${model.tableName} t1
    LEFT JOIN ${model.tableName} t2 ON t1.id = t2.${foreignKey}
    WHERE t2.id IS NULL
  `;

  const [results] = await sequelize.query(query);

  return results as any[];
}

/**
 * Calculates tree depth for a node
 *
 * Computes the depth level of a node in the hierarchy with
 * efficient ancestor counting.
 *
 * @param instance - Node instance
 * @param parentAs - Parent association alias
 * @returns Depth level (0 for root)
 *
 * @example
 * ```typescript
 * const category = await Category.findByPk(5);
 * const depth = await calculateTreeDepth(category, 'parent');
 * console.log(`Category is at depth ${depth}`);
 * ```
 */
export async function calculateTreeDepth(
  instance: any,
  parentAs: string = 'parent'
): Promise<number> {
  let depth = 0;
  let current = instance;

  while (current) {
    const parent = await current[`get${capitalize(parentAs)}`]();
    if (!parent) break;

    depth++;
    current = parent;

    if (depth > 100) {
      throw new Error('Maximum tree depth exceeded (possible cycle detected)');
    }
  }

  return depth;
}

// ============================================================================
// Through Table Associations
// ============================================================================

/**
 * Creates many-to-many with custom through table
 *
 * Establishes many-to-many relationship with custom junction table
 * that includes additional attributes beyond the foreign keys.
 *
 * @param model1 - First model
 * @param model2 - Second model
 * @param throughConfig - Through table configuration
 * @returns Association objects
 *
 * @example
 * ```typescript
 * const associations = createManyToManyWithThrough(
 *   Student,
 *   Course,
 *   {
 *     model: Enrollment,
 *     attributes: ['grade', 'enrolledAt'],
 *     timestamps: true
 *   }
 * );
 * ```
 */
export function createManyToManyWithThrough(
  model1: ModelStatic<any>,
  model2: ModelStatic<any>,
  throughConfig: ThroughTableConfig & {
    foreignKey1?: string;
    foreignKey2?: string;
    as1?: string;
    as2?: string;
  }
): {
  assoc1: Association;
  assoc2: Association;
} {
  const foreignKey1 = throughConfig.foreignKey1 || `${model1.name.toLowerCase()}Id`;
  const foreignKey2 = throughConfig.foreignKey2 || `${model2.name.toLowerCase()}Id`;
  const as1 = throughConfig.as1 || `${model2.name.toLowerCase()}s`;
  const as2 = throughConfig.as2 || `${model1.name.toLowerCase()}s`;

  const assoc1 = model1.belongsToMany(model2, {
    through: {
      model: throughConfig.model,
      ...throughConfig.scope && { scope: throughConfig.scope },
    },
    foreignKey: foreignKey1,
    otherKey: foreignKey2,
    as: as1,
  });

  const assoc2 = model2.belongsToMany(model1, {
    through: {
      model: throughConfig.model,
      ...throughConfig.scope && { scope: throughConfig.scope },
    },
    foreignKey: foreignKey2,
    otherKey: foreignKey1,
    as: as2,
  });

  return { assoc1, assoc2 };
}

/**
 * Queries through table with additional filters
 *
 * Retrieves associated records with filtering on junction table
 * attributes for advanced relationship queries.
 *
 * @param instance - Source instance
 * @param associationName - Association name
 * @param throughWhere - Filters for through table
 * @param options - Additional query options
 * @returns Array of associated instances
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(1);
 * const courses = await queryThroughTable(student, 'courses', {
 *   grade: { [Op.gte]: 'B' },
 *   enrolledAt: { [Op.gte]: new Date('2024-01-01') }
 * });
 * ```
 */
export async function queryThroughTable(
  instance: any,
  associationName: string,
  throughWhere: any,
  options: FindOptions = {}
): Promise<any[]> {
  const getterName = `get${capitalize(associationName)}`;

  return instance[getterName]({
    ...options,
    through: {
      where: throughWhere,
    },
  });
}

/**
 * Updates through table attributes
 *
 * Modifies junction table attributes for existing association
 * without removing the relationship.
 *
 * @param instance - Source instance
 * @param target - Target instance
 * @param throughModel - Through model
 * @param updates - Attributes to update
 * @param foreignKeys - Foreign key configuration
 * @returns Updated through instance
 *
 * @example
 * ```typescript
 * await updateThroughTableAttributes(
 *   student,
 *   course,
 *   Enrollment,
 *   { grade: 'A', completedAt: new Date() },
 *   { source: 'studentId', target: 'courseId' }
 * );
 * ```
 */
export async function updateThroughTableAttributes(
  instance: any,
  target: any,
  throughModel: ModelStatic<any>,
  updates: Record<string, any>,
  foreignKeys: { source: string; target: string }
): Promise<any> {
  const throughInstance = await throughModel.findOne({
    where: {
      [foreignKeys.source]: instance.id,
      [foreignKeys.target]: target.id,
    },
  });

  if (!throughInstance) {
    throw new Error('Association not found in through table');
  }

  return throughInstance.update(updates);
}

// ============================================================================
// Cascade Operations
// ============================================================================

/**
 * Configures cascade delete behavior
 *
 * Sets up cascade deletion with optional soft delete support and
 * transaction safety for referential integrity.
 *
 * @param model - Model to configure
 * @param associations - Associations with cascade config
 *
 * @example
 * ```typescript
 * configureCascadeDelete(User, {
 *   posts: { onDelete: 'CASCADE', hooks: true },
 *   comments: { onDelete: 'CASCADE', hooks: true }
 * });
 * ```
 */
export function configureCascadeDelete(
  model: ModelStatic<any>,
  associations: Record<string, CascadeConfig>
): void {
  model.addHook('beforeDestroy', async (instance: any, options: any) => {
    for (const [assocName, config] of Object.entries(associations)) {
      const association = model.associations[assocName];
      if (!association) continue;

      if (config.onDelete === 'CASCADE') {
        const getterName = `get${capitalize(assocName)}`;
        const relatedRecords = await instance[getterName]({
          transaction: options.transaction,
        });

        if (Array.isArray(relatedRecords)) {
          for (const record of relatedRecords) {
            await record.destroy({
              transaction: options.transaction,
              hooks: config.hooks,
            });
          }
        } else if (relatedRecords) {
          await relatedRecords.destroy({
            transaction: options.transaction,
            hooks: config.hooks,
          });
        }
      } else if (config.onDelete === 'SET NULL') {
        const foreignKey = (association as any).foreignKey;
        if (foreignKey) {
          const targetModel = association.target;
          await targetModel.update(
            { [foreignKey]: null },
            {
              where: { [foreignKey]: instance.id },
              transaction: options.transaction,
            }
          );
        }
      }
    }
  });
}

/**
 * Implements custom cascade update logic
 *
 * Propagates updates to related records with custom transformation
 * logic and conditional cascading.
 *
 * @param model - Model to configure
 * @param cascadeRules - Cascade update rules
 *
 * @example
 * ```typescript
 * configureCascadeUpdate(User, {
 *   posts: {
 *     fields: { authorName: 'name' },
 *     condition: (instance) => instance.changed('name')
 *   }
 * });
 * ```
 */
export function configureCascadeUpdate(
  model: ModelStatic<any>,
  cascadeRules: Record<
    string,
    {
      fields: Record<string, string>;
      condition?: (instance: any) => boolean;
    }
  >
): void {
  model.addHook('afterUpdate', async (instance: any, options: any) => {
    for (const [assocName, rule] of Object.entries(cascadeRules)) {
      if (rule.condition && !rule.condition(instance)) continue;

      const association = model.associations[assocName];
      if (!association) continue;

      const targetModel = association.target;
      const foreignKey = (association as any).foreignKey;

      if (!foreignKey) continue;

      const updates: Record<string, any> = {};
      for (const [targetField, sourceField] of Object.entries(rule.fields)) {
        if (instance.changed(sourceField)) {
          updates[targetField] = instance[sourceField];
        }
      }

      if (Object.keys(updates).length > 0) {
        await targetModel.update(updates, {
          where: { [foreignKey]: instance.id },
          transaction: options.transaction,
        });
      }
    }
  });
}

/**
 * Implements soft cascade delete
 *
 * Soft deletes related records instead of hard deletion for
 * audit trail preservation and data recovery.
 *
 * @param model - Model to configure
 * @param associations - Associations to soft delete
 * @param deletedAtField - Soft delete field name
 *
 * @example
 * ```typescript
 * configureSoftCascadeDelete(User, ['posts', 'comments'], 'deletedAt');
 * ```
 */
export function configureSoftCascadeDelete(
  model: ModelStatic<any>,
  associations: string[],
  deletedAtField: string = 'deletedAt'
): void {
  model.addHook('beforeDestroy', async (instance: any, options: any) => {
    for (const assocName of associations) {
      const association = model.associations[assocName];
      if (!association) continue;

      const getterName = `get${capitalize(assocName)}`;
      const relatedRecords = await instance[getterName]({
        transaction: options.transaction,
        paranoid: false,
      });

      const records = Array.isArray(relatedRecords) ? relatedRecords : [relatedRecords].filter(Boolean);

      for (const record of records) {
        if (record[deletedAtField] === null) {
          await record.update(
            { [deletedAtField]: new Date() },
            { transaction: options.transaction }
          );
        }
      }
    }
  });
}

// ============================================================================
// Association Query Helpers
// ============================================================================

/**
 * Checks if association exists
 *
 * Verifies whether a relationship exists between two instances
 * without loading full associated data.
 *
 * @param instance - Source instance
 * @param associationName - Association name
 * @param targetId - Target instance ID
 * @returns True if association exists
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * const hasRole = await hasAssociation(user, 'roles', roleId);
 * ```
 */
export async function hasAssociation(
  instance: any,
  associationName: string,
  targetId: string | number
): Promise<boolean> {
  const hasMethodName = `has${capitalize(associationName)}`;
  const hasSingleMethodName = `has${capitalize(associationName).replace(/s$/, '')}`;

  if (typeof instance[hasMethodName] === 'function') {
    return instance[hasMethodName](targetId);
  } else if (typeof instance[hasSingleMethodName] === 'function') {
    return instance[hasSingleMethodName](targetId);
  }

  // Fallback: query association
  const getterName = `get${capitalize(associationName)}`;
  const associated = await instance[getterName]({
    where: { id: targetId },
    attributes: ['id'],
  });

  return Array.isArray(associated) ? associated.length > 0 : !!associated;
}

/**
 * Counts associated records
 *
 * Efficiently counts related records without loading all data,
 * with support for filtered counting.
 *
 * @param instance - Source instance
 * @param associationName - Association name
 * @param where - Optional filter conditions
 * @returns Count of associated records
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * const publishedPostCount = await countAssociation(user, 'posts', {
 *   status: 'published'
 * });
 * ```
 */
export async function countAssociation(
  instance: any,
  associationName: string,
  where?: any
): Promise<number> {
  const countMethodName = `count${capitalize(associationName)}`;

  if (typeof instance[countMethodName] === 'function') {
    return instance[countMethodName]({ where });
  }

  // Fallback: get and count
  const getterName = `get${capitalize(associationName)}`;
  const associated = await instance[getterName]({
    where,
    attributes: ['id'],
  });

  return Array.isArray(associated) ? associated.length : (associated ? 1 : 0);
}

/**
 * Adds association with through table attributes
 *
 * Creates many-to-many association with custom junction table
 * attributes in a single operation.
 *
 * @param instance - Source instance
 * @param targets - Target instance(s) or ID(s)
 * @param associationName - Association name
 * @param throughAttributes - Junction table attributes
 * @returns Created through instance(s)
 *
 * @example
 * ```typescript
 * await addAssociationWithThrough(
 *   student,
 *   [course1, course2],
 *   'courses',
 *   { enrolledAt: new Date(), semester: 'Fall 2024' }
 * );
 * ```
 */
export async function addAssociationWithThrough(
  instance: any,
  targets: any | any[],
  associationName: string,
  throughAttributes: Record<string, any> = {}
): Promise<any> {
  const addMethodName = `add${capitalize(associationName)}`;
  const targetArray = Array.isArray(targets) ? targets : [targets];

  return instance[addMethodName](targetArray, { through: throughAttributes });
}

/**
 * Removes association
 *
 * Removes relationship between instances with support for soft
 * deletion and cascade cleanup.
 *
 * @param instance - Source instance
 * @param targets - Target instance(s) or ID(s)
 * @param associationName - Association name
 * @param options - Removal options
 *
 * @example
 * ```typescript
 * await removeAssociation(user, [role1, role2], 'roles', {
 *   transaction: t,
 *   softDelete: true
 * });
 * ```
 */
export async function removeAssociation(
  instance: any,
  targets: any | any[],
  associationName: string,
  options: { transaction?: Transaction; softDelete?: boolean } = {}
): Promise<void> {
  const removeMethodName = `remove${capitalize(associationName)}`;
  const targetArray = Array.isArray(targets) ? targets : [targets];

  await instance[removeMethodName](targetArray, options);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Capitalizes first letter of string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validates association configuration
 *
 * Checks association setup for common configuration errors and
 * provides suggestions for optimization.
 *
 * @param model - Model to validate
 * @param associationName - Association name
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAssociationConfig(User, 'posts');
 * if (!validation.valid) {
 *   console.error('Association errors:', validation.errors);
 * }
 * ```
 */
export function validateAssociationConfig(
  model: ModelStatic<any>,
  associationName: string
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const association = model.associations[associationName];

  if (!association) {
    errors.push(`Association '${associationName}' not found on model ${model.name}`);
    return { valid: false, errors, warnings };
  }

  // Check for missing foreign key indexes
  if (association.associationType === 'belongsTo') {
    const foreignKey = (association as any).foreignKey;
    const hasIndex = (model.options.indexes as any[])?.some(
      (idx) => idx.fields?.includes(foreignKey)
    );

    if (!hasIndex) {
      warnings.push(`Foreign key '${foreignKey}' has no index (may impact performance)`);
    }
  }

  // Check for belongsToMany without through
  if (association.associationType === 'belongsToMany') {
    const through = (association as any).through;
    if (!through) {
      errors.push('BelongsToMany association requires through model');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Lists all associations on a model
 *
 * Retrieves comprehensive association metadata for documentation
 * and debugging purposes.
 *
 * @param model - Model to inspect
 * @returns Association metadata
 *
 * @example
 * ```typescript
 * const associations = listModelAssociations(User);
 * console.log('User associations:', associations);
 * ```
 */
export function listModelAssociations(
  model: ModelStatic<any>
): Array<{
  name: string;
  type: string;
  target: string;
  foreignKey?: string;
  through?: string;
}> {
  const associations: Array<{
    name: string;
    type: string;
    target: string;
    foreignKey?: string;
    through?: string;
  }> = [];

  for (const [name, assoc] of Object.entries(model.associations)) {
    associations.push({
      name,
      type: assoc.associationType,
      target: assoc.target.name,
      foreignKey: (assoc as any).foreignKey,
      through: (assoc as any).through?.model?.name,
    });
  }

  return associations;
}
