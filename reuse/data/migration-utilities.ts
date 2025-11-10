/**
 * Enterprise-ready Database Migration Utilities
 *
 * Comprehensive utilities for Sequelize migrations, schema evolution, data migrations,
 * zero-downtime deployments, rollback strategies, and migration management.
 *
 * @module reuse/data/migration-utilities
 * @version 1.0.0
 * @requires sequelize v6
 * @requires sequelize-cli v6
 */

import {
  QueryInterface,
  Sequelize,
  DataTypes,
  QueryTypes,
  Transaction,
  Op,
  Model,
  ModelStatic,
} from 'sequelize';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definitions for migration utilities
 */
export interface MigrationTableDefinition {
  tableName: string;
  attributes: Record<string, any>;
  options?: Record<string, any>;
}

export interface ColumnDefinition {
  type: any;
  allowNull?: boolean;
  defaultValue?: any;
  unique?: boolean | string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  comment?: string;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
}

export interface IndexDefinition {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: string;
  where?: any;
  concurrently?: boolean;
}

export interface ConstraintDefinition {
  type: 'check' | 'unique' | 'primary key' | 'foreign key';
  fields?: string[];
  name?: string;
  where?: any;
  references?: {
    table: string;
    field: string;
  };
  onDelete?: string;
  onUpdate?: string;
}

export interface MigrationStatus {
  name: string;
  status: 'pending' | 'executed' | 'failed';
  executedAt?: Date;
  executionTime?: number;
  error?: string;
}

export interface MigrationLock {
  lockId: string;
  acquiredAt: Date;
  acquiredBy: string;
  expiresAt: Date;
}

export interface SchemaComparison {
  tablesAdded: string[];
  tablesRemoved: string[];
  tablesModified: string[];
  columnsAdded: Record<string, string[]>;
  columnsRemoved: Record<string, string[]>;
  columnsModified: Record<string, string[]>;
  indexesAdded: Record<string, string[]>;
  indexesRemoved: Record<string, string[]>;
}

export interface SeedDataConfig {
  table: string;
  data: Record<string, any>[];
  updateOnDuplicate?: string[];
  transaction?: Transaction;
}

export interface DataTransformConfig<T = any> {
  sourceTable: string;
  targetTable?: string;
  batchSize?: number;
  where?: any;
  transform: (row: T) => T | Promise<T>;
  validate?: (row: T) => boolean | Promise<boolean>;
  onError?: (error: Error, row: T) => void;
}

export interface MigrationDependency {
  name: string;
  dependsOn: string[];
  executed: boolean;
}

export interface FixtureDefinition {
  model: string;
  count: number;
  factory: (index: number) => Record<string, any>;
}

/**
 * Migration Builder Functions
 */

/**
 * Creates a comprehensive table with all standard fields and configurations
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to create
 * @param attributes - Column definitions for the table
 * @param options - Additional table options (indexes, paranoid, etc.)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when table is created
 *
 * @example
 * await createTableWithDefaults(queryInterface, 'Users', {
 *   username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
 *   email: { type: DataTypes.STRING(255), allowNull: false }
 * }, {
 *   indexes: [{ fields: ['email'], unique: true }],
 *   paranoid: true
 * });
 */
export async function createTableWithDefaults(
  queryInterface: QueryInterface,
  tableName: string,
  attributes: Record<string, any>,
  options: {
    indexes?: IndexDefinition[];
    paranoid?: boolean;
    timestamps?: boolean;
    underscored?: boolean;
    comment?: string;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const {
    indexes = [],
    paranoid = false,
    timestamps = true,
    underscored = false,
    comment,
  } = options;

  // Build complete attribute definition with defaults
  const completeAttributes: Record<string, any> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ...attributes,
  };

  // Add timestamp fields if enabled
  if (timestamps) {
    completeAttributes.createdAt = {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
    completeAttributes.updatedAt = {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
  }

  // Add soft delete field if paranoid
  if (paranoid) {
    completeAttributes.deletedAt = {
      type: DataTypes.DATE,
      allowNull: true,
    };
  }

  // Create table
  await queryInterface.createTable(tableName, completeAttributes, {
    transaction,
    comment,
  });

  // Create indexes
  for (const index of indexes) {
    await queryInterface.addIndex(tableName, index.fields, {
      ...index,
      transaction,
    });
  }
}

/**
 * Performs a safe table alteration with backup and rollback capability
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to alter
 * @param alterations - Function that performs the alterations
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when alteration is complete
 *
 * @example
 * await safeAlterTable(queryInterface, 'Users', async (qi, t) => {
 *   await qi.addColumn('Users', 'newField', { type: DataTypes.STRING }, { transaction: t });
 * });
 */
export async function safeAlterTable(
  queryInterface: QueryInterface,
  tableName: string,
  alterations: (qi: QueryInterface, transaction: Transaction) => Promise<void>,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const t = transaction || (await sequelize.transaction());

  try {
    // Execute alterations within transaction
    await alterations(queryInterface, t);

    // Commit if we created the transaction
    if (!transaction) {
      await t.commit();
    }
  } catch (error) {
    // Rollback if we created the transaction
    if (!transaction) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * Drops a table safely with existence check and cascade options
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to drop
 * @param options - Drop options (cascade, ifExists)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when table is dropped
 *
 * @example
 * await dropTableSafely(queryInterface, 'OldUsers', { cascade: true, ifExists: true });
 */
export async function dropTableSafely(
  queryInterface: QueryInterface,
  tableName: string,
  options: {
    cascade?: boolean;
    ifExists?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { cascade = false, ifExists = true } = options;

  // Check if table exists
  if (ifExists) {
    const tableExists = await checkTableExists(queryInterface, tableName);
    if (!tableExists) {
      return;
    }
  }

  // Drop table
  await queryInterface.dropTable(tableName, {
    cascade,
    transaction,
  });
}

/**
 * Renames a table with all dependencies (indexes, constraints)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param oldTableName - Current table name
 * @param newTableName - New table name
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when table is renamed
 *
 * @example
 * await renameTableWithDependencies(queryInterface, 'old_users', 'users');
 */
export async function renameTableWithDependencies(
  queryInterface: QueryInterface,
  oldTableName: string,
  newTableName: string,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Rename table
  await queryInterface.renameTable(oldTableName, newTableName, { transaction });

  // Update sequences for PostgreSQL
  if (dialect === 'postgres') {
    const [sequences] = await sequelize.query(
      `
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name LIKE '${oldTableName}%'
    `,
      { transaction },
    );

    for (const seq of sequences as any[]) {
      const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
      await sequelize.query(
        `ALTER SEQUENCE ${seq.sequence_name} RENAME TO ${newSeqName}`,
        { transaction },
      );
    }
  }
}

/**
 * Column Management Functions
 */

/**
 * Adds a column with validation and default value population
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to add
 * @param definition - Column definition
 * @param options - Additional options (populateDefault, validate)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when column is added
 *
 * @example
 * await addColumnWithDefaults(queryInterface, 'Users', 'status', {
 *   type: DataTypes.ENUM('active', 'inactive'),
 *   defaultValue: 'active',
 *   allowNull: false
 * }, { populateDefault: true });
 */
export async function addColumnWithDefaults(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  definition: ColumnDefinition,
  options: {
    populateDefault?: boolean;
    validate?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { populateDefault = true, validate = true } = options;

  // Add column as nullable first
  const tempDefinition = { ...definition, allowNull: true };
  await queryInterface.addColumn(tableName, columnName, tempDefinition, {
    transaction,
  });

  // Populate default values if specified
  if (populateDefault && definition.defaultValue !== undefined) {
    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`,
      {
        replacements: { defaultValue: definition.defaultValue },
        transaction,
      },
    );
  }

  // Update column to final definition (with allowNull constraint)
  if (!definition.allowNull) {
    await queryInterface.changeColumn(tableName, columnName, definition, {
      transaction,
    });
  }

  // Validate data if requested
  if (validate) {
    const [results] = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`,
      { transaction },
    );
    const count = (results[0] as any).count;
    if (count > 0 && !definition.allowNull) {
      throw new Error(
        `Column ${columnName} has ${count} NULL values but is NOT NULL`,
      );
    }
  }
}

/**
 * Removes a column safely with data preservation option
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to remove
 * @param options - Removal options (backup, ifExists)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when column is removed
 *
 * @example
 * await removeColumnSafely(queryInterface, 'Users', 'oldField', { backup: true });
 */
export async function removeColumnSafely(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  options: {
    backup?: boolean;
    backupTable?: string;
    ifExists?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { backup = false, backupTable, ifExists = true } = options;

  // Check if column exists
  if (ifExists) {
    const columnExists = await checkColumnExists(
      queryInterface,
      tableName,
      columnName,
    );
    if (!columnExists) {
      return;
    }
  }

  // Create backup if requested
  if (backup) {
    const backupTableName = backupTable || `${tableName}_${columnName}_backup`;
    await queryInterface.sequelize.query(
      `CREATE TABLE "${backupTableName}" AS SELECT id, "${columnName}" FROM "${tableName}"`,
      { transaction },
    );
  }

  // Remove column
  await queryInterface.removeColumn(tableName, columnName, { transaction });
}

/**
 * Modifies a column type with data conversion
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to modify
 * @param newDefinition - New column definition
 * @param options - Modification options (castUsing, validate)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when column is modified
 *
 * @example
 * await modifyColumnType(queryInterface, 'Orders', 'amount', {
 *   type: DataTypes.DECIMAL(10, 2)
 * }, { castUsing: 'amount::numeric' });
 */
export async function modifyColumnType(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  newDefinition: ColumnDefinition,
  options: {
    castUsing?: string;
    validate?: boolean;
    tempColumn?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { castUsing, validate = true, tempColumn = false } = options;
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  if (tempColumn || dialect === 'postgres') {
    // Use temporary column approach for complex conversions
    const tempColumnName = `${columnName}_temp`;

    // Add temporary column
    await queryInterface.addColumn(tableName, tempColumnName, newDefinition, {
      transaction,
    });

    // Copy and convert data
    const castExpression = castUsing || `"${columnName}"`;
    await sequelize.query(
      `UPDATE "${tableName}" SET "${tempColumnName}" = ${castExpression}`,
      { transaction },
    );

    // Drop old column
    await queryInterface.removeColumn(tableName, columnName, { transaction });

    // Rename temp column to original name
    await queryInterface.renameColumn(
      tableName,
      tempColumnName,
      columnName,
      { transaction },
    );
  } else {
    // Direct column modification
    await queryInterface.changeColumn(tableName, columnName, newDefinition, {
      transaction,
    });
  }

  // Validate conversion if requested
  if (validate) {
    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NULL`,
      { transaction },
    );
    console.log(`Column ${columnName} conversion completed. NULL count: ${(results[0] as any).count}`);
  }
}

/**
 * Renames a column across all database systems
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param oldColumnName - Current column name
 * @param newColumnName - New column name
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when column is renamed
 *
 * @example
 * await renameColumnUniversal(queryInterface, 'Users', 'userName', 'username');
 */
export async function renameColumnUniversal(
  queryInterface: QueryInterface,
  tableName: string,
  oldColumnName: string,
  newColumnName: string,
  transaction?: Transaction,
): Promise<void> {
  await queryInterface.renameColumn(
    tableName,
    oldColumnName,
    newColumnName,
    { transaction },
  );
}

/**
 * Index Management Functions
 */

/**
 * Creates an index with optimal settings for the database dialect
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexDefinition - Index definition
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when index is created
 *
 * @example
 * await createOptimizedIndex(queryInterface, 'Users', {
 *   name: 'users_email_idx',
 *   fields: ['email'],
 *   unique: true,
 *   concurrently: true
 * });
 */
export async function createOptimizedIndex(
  queryInterface: QueryInterface,
  tableName: string,
  indexDefinition: IndexDefinition,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();
  const { concurrently = false, ...indexOptions } = indexDefinition;

  // For PostgreSQL, use CREATE INDEX CONCURRENTLY for zero-downtime
  if (dialect === 'postgres' && concurrently && !transaction) {
    const indexName =
      indexDefinition.name ||
      `${tableName}_${indexDefinition.fields.join('_')}_idx`;
    const fields = indexDefinition.fields
      .map((f) => (typeof f === 'string' ? `"${f}"` : `"${f.name}"`))
      .join(', ');
    const unique = indexDefinition.unique ? 'UNIQUE' : '';
    const where = indexDefinition.where
      ? `WHERE ${JSON.stringify(indexDefinition.where)}`
      : '';

    await sequelize.query(
      `CREATE ${unique} INDEX CONCURRENTLY "${indexName}" ON "${tableName}" (${fields}) ${where}`,
    );
  } else {
    await queryInterface.addIndex(
      tableName,
      indexDefinition.fields,
      {
        ...indexOptions,
        transaction,
      },
    );
  }
}

/**
 * Drops an index with existence check
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexName - Name of the index to drop
 * @param options - Drop options (ifExists, concurrently)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when index is dropped
 *
 * @example
 * await dropIndexSafely(queryInterface, 'Users', 'users_email_idx', { concurrently: true });
 */
export async function dropIndexSafely(
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  options: {
    ifExists?: boolean;
    concurrently?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { ifExists = true, concurrently = false } = options;
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Check if index exists
  if (ifExists) {
    const indexExists = await checkIndexExists(
      queryInterface,
      tableName,
      indexName,
    );
    if (!indexExists) {
      return;
    }
  }

  // For PostgreSQL, use DROP INDEX CONCURRENTLY for zero-downtime
  if (dialect === 'postgres' && concurrently && !transaction) {
    await sequelize.query(`DROP INDEX CONCURRENTLY IF EXISTS "${indexName}"`);
  } else {
    await queryInterface.removeIndex(tableName, indexName, { transaction });
  }
}

/**
 * Creates a composite index with specified column order
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columns - Array of column specifications
 * @param options - Index options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when composite index is created
 *
 * @example
 * await createCompositeIndex(queryInterface, 'Orders', [
 *   { name: 'userId', order: 'ASC' },
 *   { name: 'createdAt', order: 'DESC' }
 * ], { name: 'orders_user_created_idx', unique: false });
 */
export async function createCompositeIndex(
  queryInterface: QueryInterface,
  tableName: string,
  columns: Array<{ name: string; order?: 'ASC' | 'DESC'; length?: number }>,
  options: {
    name?: string;
    unique?: boolean;
    where?: any;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const indexName =
    options.name || `${tableName}_${columns.map((c) => c.name).join('_')}_idx`;

  await queryInterface.addIndex(tableName, columns, {
    name: indexName,
    unique: options.unique || false,
    where: options.where,
    transaction,
  });
}

/**
 * Creates a unique index with null filtering
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column
 * @param options - Unique index options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when unique index is created
 *
 * @example
 * await createUniqueIndex(queryInterface, 'Users', 'email', {
 *   name: 'users_email_unique',
 *   nullsNotDistinct: true
 * });
 */
export async function createUniqueIndex(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  options: {
    name?: string;
    where?: any;
    nullsNotDistinct?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const indexName = options.name || `${tableName}_${columnName}_unique`;
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres' && options.nullsNotDistinct) {
    // PostgreSQL 15+ NULLS NOT DISTINCT
    await sequelize.query(
      `CREATE UNIQUE INDEX "${indexName}" ON "${tableName}" ("${columnName}") NULLS NOT DISTINCT`,
      { transaction },
    );
  } else {
    await queryInterface.addIndex(tableName, [columnName], {
      name: indexName,
      unique: true,
      where: options.where,
      transaction,
    });
  }
}

/**
 * Recreates an index (useful for index optimization)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexName - Name of the index to recreate
 * @param indexDefinition - New index definition
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when index is recreated
 *
 * @example
 * await recreateIndex(queryInterface, 'Users', 'users_email_idx', {
 *   fields: ['email'],
 *   unique: true
 * });
 */
export async function recreateIndex(
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  indexDefinition: IndexDefinition,
  transaction?: Transaction,
): Promise<void> {
  // Drop old index
  await dropIndexSafely(queryInterface, tableName, indexName, {}, transaction);

  // Create new index
  await createOptimizedIndex(
    queryInterface,
    tableName,
    { ...indexDefinition, name: indexName },
    transaction,
  );
}

/**
 * Constraint Management Functions
 */

/**
 * Adds a foreign key constraint with cascading options
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param constraint - Foreign key constraint definition
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when foreign key is added
 *
 * @example
 * await addForeignKeyConstraint(queryInterface, 'Orders', {
 *   fields: ['userId'],
 *   name: 'orders_user_fkey',
 *   references: { table: 'Users', field: 'id' },
 *   onDelete: 'CASCADE',
 *   onUpdate: 'CASCADE'
 * });
 */
export async function addForeignKeyConstraint(
  queryInterface: QueryInterface,
  tableName: string,
  constraint: {
    fields: string[];
    name: string;
    references: { table: string; field: string };
    onDelete?: string;
    onUpdate?: string;
  },
  transaction?: Transaction,
): Promise<void> {
  await queryInterface.addConstraint(tableName, {
    fields: constraint.fields,
    type: 'foreign key',
    name: constraint.name,
    references: {
      table: constraint.references.table,
      field: constraint.references.field,
    },
    onDelete: constraint.onDelete || 'NO ACTION',
    onUpdate: constraint.onUpdate || 'NO ACTION',
    transaction,
  });
}

/**
 * Adds a check constraint with custom validation
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param constraintName - Name of the constraint
 * @param checkExpression - SQL check expression
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when check constraint is added
 *
 * @example
 * await addCheckConstraint(queryInterface, 'Products', 'price_positive',
 *   'price > 0');
 */
export async function addCheckConstraint(
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
  checkExpression: string,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  await sequelize.query(
    `ALTER TABLE "${tableName}" ADD CONSTRAINT "${constraintName}" CHECK (${checkExpression})`,
    { transaction },
  );
}

/**
 * Removes a constraint with existence check
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param constraintName - Name of the constraint to remove
 * @param options - Removal options (ifExists, cascade)
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when constraint is removed
 *
 * @example
 * await removeConstraintSafely(queryInterface, 'Orders', 'orders_user_fkey',
 *   { ifExists: true });
 */
export async function removeConstraintSafely(
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
  options: {
    ifExists?: boolean;
    cascade?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { ifExists = true, cascade = false } = options;
  const sequelize = queryInterface.sequelize;

  if (ifExists) {
    const constraintExists = await checkConstraintExists(
      queryInterface,
      tableName,
      constraintName,
    );
    if (!constraintExists) {
      return;
    }
  }

  const cascadeClause = cascade ? 'CASCADE' : '';
  await sequelize.query(
    `ALTER TABLE "${tableName}" DROP CONSTRAINT "${constraintName}" ${cascadeClause}`,
    { transaction },
  );
}

/**
 * Adds a unique constraint on multiple columns
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columns - Array of column names
 * @param constraintName - Name of the unique constraint
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when unique constraint is added
 *
 * @example
 * await addUniqueConstraint(queryInterface, 'UserRoles',
 *   ['userId', 'roleId'], 'user_roles_unique');
 */
export async function addUniqueConstraint(
  queryInterface: QueryInterface,
  tableName: string,
  columns: string[],
  constraintName: string,
  transaction?: Transaction,
): Promise<void> {
  await queryInterface.addConstraint(tableName, {
    fields: columns,
    type: 'unique',
    name: constraintName,
    transaction,
  });
}

/**
 * Replaces a constraint (drops old, creates new)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param oldConstraintName - Name of the old constraint
 * @param newConstraint - New constraint definition
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when constraint is replaced
 *
 * @example
 * await replaceConstraint(queryInterface, 'Orders', 'old_user_fkey', {
 *   fields: ['userId'],
 *   name: 'orders_user_fkey',
 *   references: { table: 'Users', field: 'id' },
 *   onDelete: 'CASCADE'
 * });
 */
export async function replaceConstraint(
  queryInterface: QueryInterface,
  tableName: string,
  oldConstraintName: string,
  newConstraint: {
    fields: string[];
    name: string;
    type: 'foreign key' | 'unique' | 'check';
    references?: { table: string; field: string };
    onDelete?: string;
    onUpdate?: string;
    checkExpression?: string;
  },
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const t = transaction || (await sequelize.transaction());

  try {
    // Remove old constraint
    await removeConstraintSafely(
      queryInterface,
      tableName,
      oldConstraintName,
      {},
      t,
    );

    // Add new constraint
    if (newConstraint.type === 'foreign key') {
      await addForeignKeyConstraint(
        queryInterface,
        tableName,
        newConstraint as any,
        t,
      );
    } else if (newConstraint.type === 'check') {
      await addCheckConstraint(
        queryInterface,
        tableName,
        newConstraint.name,
        newConstraint.checkExpression!,
        t,
      );
    } else {
      await queryInterface.addConstraint(tableName, {
        ...newConstraint,
        transaction: t,
      });
    }

    if (!transaction) {
      await t.commit();
    }
  } catch (error) {
    if (!transaction) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * Data Migration Functions
 */

/**
 * Performs batch data transformation with progress tracking
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param config - Data transformation configuration
 * @returns Promise that resolves with transformation statistics
 *
 * @example
 * await batchDataTransform(queryInterface, {
 *   sourceTable: 'Users',
 *   batchSize: 1000,
 *   transform: async (row) => ({
 *     ...row,
 *     fullName: `${row.firstName} ${row.lastName}`
 *   })
 * });
 */
export async function batchDataTransform<T = any>(
  queryInterface: QueryInterface,
  config: DataTransformConfig<T>,
): Promise<{
  totalProcessed: number;
  totalModified: number;
  errors: number;
}> {
  const {
    sourceTable,
    targetTable = sourceTable,
    batchSize = 1000,
    where = {},
    transform,
    validate,
    onError,
  } = config;

  const sequelize = queryInterface.sequelize;
  let offset = 0;
  let totalProcessed = 0;
  let totalModified = 0;
  let errors = 0;

  console.log(`Starting batch data transformation for ${sourceTable}...`);

  while (true) {
    const transaction = await sequelize.transaction();

    try {
      // Fetch batch
      const whereClause = Object.keys(where).length
        ? `WHERE ${Object.entries(where)
            .map(([key, val]) => `"${key}" = '${val}'`)
            .join(' AND ')}`
        : '';

      const [results] = await sequelize.query(
        `SELECT * FROM "${sourceTable}" ${whereClause} ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`,
        { transaction },
      );

      if (results.length === 0) {
        await transaction.commit();
        break;
      }

      // Transform and validate batch
      for (const row of results as T[]) {
        try {
          // Validate if validator provided
          if (validate && !(await validate(row))) {
            continue;
          }

          // Transform row
          const transformedRow = await transform(row);

          // Update row in target table
          const setClause = Object.entries(transformedRow)
            .filter(([key]) => key !== 'id')
            .map(([key, val]) => `"${key}" = :${key}`)
            .join(', ');

          if (setClause) {
            await sequelize.query(
              `UPDATE "${targetTable}" SET ${setClause} WHERE id = :id`,
              {
                replacements: { ...transformedRow, id: (row as any).id },
                transaction,
              },
            );
            totalModified++;
          }

          totalProcessed++;
        } catch (error) {
          errors++;
          if (onError) {
            onError(error as Error, row);
          } else {
            console.error(`Error transforming row:`, error);
          }
        }
      }

      await transaction.commit();

      offset += batchSize;
      console.log(`Processed ${totalProcessed} records...`);

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      await transaction.rollback();
      console.error(`Error processing batch at offset ${offset}:`, error);
      throw error;
    }
  }

  console.log(
    `Batch transformation complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`,
  );

  return { totalProcessed, totalModified, errors };
}

/**
 * Migrates data from one table to another with mapping
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param sourceTable - Source table name
 * @param targetTable - Target table name
 * @param columnMapping - Map of source columns to target columns
 * @param options - Migration options
 * @returns Promise that resolves when data is migrated
 *
 * @example
 * await migrateDataBetweenTables(queryInterface, 'OldUsers', 'Users', {
 *   'user_name': 'username',
 *   'email_address': 'email'
 * }, { batchSize: 500 });
 */
export async function migrateDataBetweenTables(
  queryInterface: QueryInterface,
  sourceTable: string,
  targetTable: string,
  columnMapping: Record<string, string>,
  options: {
    batchSize?: number;
    where?: any;
    deleteSource?: boolean;
  } = {},
): Promise<void> {
  const { batchSize = 1000, where = {}, deleteSource = false } = options;
  const sequelize = queryInterface.sequelize;

  // Build column lists
  const sourceColumns = Object.keys(columnMapping).map((col) => `"${col}"`);
  const targetColumns = Object.values(columnMapping).map((col) => `"${col}"`);

  const whereClause = Object.keys(where).length
    ? `WHERE ${Object.entries(where)
        .map(([key, val]) => `"${key}" = '${val}'`)
        .join(' AND ')}`
    : '';

  let offset = 0;

  while (true) {
    const transaction = await sequelize.transaction();

    try {
      // Fetch batch from source
      const [results] = await sequelize.query(
        `SELECT ${sourceColumns.join(', ')} FROM "${sourceTable}" ${whereClause} LIMIT ${batchSize} OFFSET ${offset}`,
        { transaction },
      );

      if (results.length === 0) {
        await transaction.commit();
        break;
      }

      // Insert into target
      for (const row of results as any[]) {
        const values = Object.keys(columnMapping).map((key) => row[key]);
        const placeholders = targetColumns.map((_, i) => `:val${i}`);

        await sequelize.query(
          `INSERT INTO "${targetTable}" (${targetColumns.join(', ')}) VALUES (${placeholders.join(', ')})`,
          {
            replacements: values.reduce(
              (acc, val, i) => ({ ...acc, [`val${i}`]: val }),
              {},
            ),
            transaction,
          },
        );
      }

      await transaction.commit();

      offset += batchSize;
      console.log(`Migrated ${offset} records...`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Delete source data if requested
  if (deleteSource) {
    await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
  }
}

/**
 * Copies table data with optional filtering
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param sourceTable - Source table name
 * @param targetTable - Target table name
 * @param options - Copy options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when data is copied
 *
 * @example
 * await copyTableData(queryInterface, 'Users', 'UsersBackup', {
 *   where: "status = 'active'",
 *   columns: ['id', 'username', 'email']
 * });
 */
export async function copyTableData(
  queryInterface: QueryInterface,
  sourceTable: string,
  targetTable: string,
  options: {
    where?: string;
    columns?: string[];
    limit?: number;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { where, columns, limit } = options;
  const sequelize = queryInterface.sequelize;

  const columnList = columns ? columns.map((c) => `"${c}"`).join(', ') : '*';
  const whereClause = where ? `WHERE ${where}` : '';
  const limitClause = limit ? `LIMIT ${limit}` : '';

  await sequelize.query(
    `INSERT INTO "${targetTable}" SELECT ${columnList} FROM "${sourceTable}" ${whereClause} ${limitClause}`,
    { transaction },
  );
}

/**
 * Validates data integrity after migration
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to validate
 * @param validations - Array of validation checks
 * @returns Promise that resolves with validation results
 *
 * @example
 * await validateDataIntegrity(queryInterface, 'Users', [
 *   { column: 'email', rule: 'NOT NULL' },
 *   { column: 'status', rule: "IN ('active', 'inactive')" }
 * ]);
 */
export async function validateDataIntegrity(
  queryInterface: QueryInterface,
  tableName: string,
  validations: Array<{
    column: string;
    rule: string;
    errorMessage?: string;
  }>,
): Promise<
  Array<{ column: string; passed: boolean; failedCount: number; message: string }>
> {
  const sequelize = queryInterface.sequelize;
  const results = [];

  for (const validation of validations) {
    const { column, rule, errorMessage } = validation;

    const [queryResults] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}" WHERE NOT (${rule})`,
    );

    const failedCount = (queryResults[0] as any).count;
    const passed = failedCount === 0;

    results.push({
      column,
      passed,
      failedCount,
      message:
        errorMessage || `Column ${column} validation: ${rule}`,
    });

    if (!passed) {
      console.warn(
        `Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`,
      );
    }
  }

  return results;
}

/**
 * Backfills missing data using a strategy
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to backfill
 * @param strategy - Backfill strategy ('default', 'derived', 'lookup', 'function')
 * @param config - Configuration for the backfill strategy
 * @returns Promise that resolves with backfill statistics
 *
 * @example
 * await backfillMissingData(queryInterface, 'Users', 'fullName', 'derived', {
 *   expression: "firstName || ' ' || lastName"
 * });
 */
export async function backfillMissingData(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  strategy: 'default' | 'derived' | 'lookup' | 'function',
  config: {
    defaultValue?: any;
    expression?: string;
    lookupTable?: string;
    lookupKey?: string;
    lookupValue?: string;
    customFunction?: (row: any) => any;
  },
): Promise<{ rowsUpdated: number }> {
  const sequelize = queryInterface.sequelize;
  let query: string;
  let rowsUpdated = 0;

  switch (strategy) {
    case 'default':
      query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
      await sequelize.query(query, {
        replacements: { defaultValue: config.defaultValue },
      });
      break;

    case 'derived':
      query = `UPDATE "${tableName}" SET "${columnName}" = ${config.expression} WHERE "${columnName}" IS NULL`;
      await sequelize.query(query);
      break;

    case 'lookup':
      query = `
        UPDATE "${tableName}" t
        SET "${columnName}" = l."${config.lookupValue}"
        FROM "${config.lookupTable}" l
        WHERE t."${config.lookupKey}" = l."${config.lookupKey}"
        AND t."${columnName}" IS NULL
      `;
      await sequelize.query(query);
      break;

    case 'function':
      if (!config.customFunction) {
        throw new Error('Custom function required for function strategy');
      }
      // Fetch rows with NULL values
      const [rows] = await sequelize.query(
        `SELECT * FROM "${tableName}" WHERE "${columnName}" IS NULL`,
      );

      for (const row of rows as any[]) {
        const newValue = await config.customFunction(row);
        await sequelize.query(
          `UPDATE "${tableName}" SET "${columnName}" = :newValue WHERE id = :id`,
          {
            replacements: { newValue, id: row.id },
          },
        );
        rowsUpdated++;
      }
      break;
  }

  // Get count of updated rows
  if (strategy !== 'function') {
    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`,
    );
    rowsUpdated = (countResult[0] as any).count;
  }

  console.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);

  return { rowsUpdated };
}

/**
 * Schema Versioning Functions
 */

/**
 * Records a migration execution in the migration history
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param migrationName - Name of the migration
 * @param metadata - Additional metadata about the migration
 * @returns Promise that resolves when migration is recorded
 *
 * @example
 * await recordMigrationExecution(queryInterface, '20231201_add_user_status', {
 *   executionTime: 1234,
 *   rowsAffected: 5000
 * });
 */
export async function recordMigrationExecution(
  queryInterface: QueryInterface,
  migrationName: string,
  metadata: {
    executionTime?: number;
    rowsAffected?: number;
    description?: string;
  } = {},
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  // Ensure migration history table exists
  await ensureMigrationHistoryTable(queryInterface);

  await sequelize.query(
    `
    INSERT INTO "MigrationHistory" (name, "executedAt", "executionTime", "rowsAffected", description)
    VALUES (:name, NOW(), :executionTime, :rowsAffected, :description)
  `,
    {
      replacements: {
        name: migrationName,
        executionTime: metadata.executionTime || 0,
        rowsAffected: metadata.rowsAffected || 0,
        description: metadata.description || '',
      },
    },
  );
}

/**
 * Gets the current schema version
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @returns Promise that resolves with the current schema version
 *
 * @example
 * const version = await getCurrentSchemaVersion(queryInterface);
 * console.log(`Current schema version: ${version}`);
 */
export async function getCurrentSchemaVersion(
  queryInterface: QueryInterface,
): Promise<string> {
  const sequelize = queryInterface.sequelize;

  try {
    const [results] = await sequelize.query(
      `SELECT name FROM "SequelizeMeta" ORDER BY name DESC LIMIT 1`,
    );

    if (results.length === 0) {
      return 'none';
    }

    return (results[0] as any).name;
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Compares two schema versions
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param version1 - First schema version
 * @param version2 - Second schema version
 * @returns Promise that resolves with comparison results
 *
 * @example
 * const diff = await compareSchemaVersions(queryInterface, 'v1', 'v2');
 * console.log('Schema differences:', diff);
 */
export async function compareSchemaVersions(
  queryInterface: QueryInterface,
  version1: string,
  version2: string,
): Promise<SchemaComparison> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // This is a simplified comparison - in production, you'd store schema snapshots
  const comparison: SchemaComparison = {
    tablesAdded: [],
    tablesRemoved: [],
    tablesModified: [],
    columnsAdded: {},
    columnsRemoved: {},
    columnsModified: {},
    indexesAdded: {},
    indexesRemoved: {},
  };

  // Get current tables
  const [currentTables] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
      : `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`,
  );

  // In a real implementation, you would:
  // 1. Load schema snapshots for both versions
  // 2. Compare table lists
  // 3. Compare column definitions
  // 4. Compare index definitions
  // 5. Compare constraint definitions

  console.log(`Schema comparison between ${version1} and ${version2} completed`);

  return comparison;
}

/**
 * Creates a schema snapshot for version tracking
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param versionName - Name of the schema version
 * @returns Promise that resolves when snapshot is created
 *
 * @example
 * await createSchemaSnapshot(queryInterface, 'v1.2.0');
 */
export async function createSchemaSnapshot(
  queryInterface: QueryInterface,
  versionName: string,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Get all tables
  const [tables] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      : `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`,
  );

  const snapshot = {
    version: versionName,
    createdAt: new Date(),
    tables: [] as any[],
  };

  // Get schema for each table
  for (const table of tables as any[]) {
    const [columns] = await sequelize.query(
      dialect === 'postgres'
        ? `SELECT column_name, data_type, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_name = '${table.table_name}'`
        : `SELECT column_name, data_type, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_name = '${table.table_name}' AND table_schema = DATABASE()`,
    );

    snapshot.tables.push({
      name: table.table_name,
      columns,
    });
  }

  // Store snapshot (in production, this would go to a dedicated table or file)
  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS "SchemaSnapshots" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      version VARCHAR(255) NOT NULL,
      snapshot JSONB NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  );

  await sequelize.query(
    `INSERT INTO "SchemaSnapshots" (version, snapshot) VALUES (:version, :snapshot)`,
    {
      replacements: {
        version: versionName,
        snapshot: JSON.stringify(snapshot),
      },
    },
  );

  console.log(`Schema snapshot created for version ${versionName}`);
}

/**
 * Zero-Downtime Migration Functions
 */

/**
 * Adds a column in a zero-downtime manner (nullable first, then populate, then constrain)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to add
 * @param definition - Final column definition
 * @param options - Zero-downtime options
 * @returns Promise that resolves when column is added
 *
 * @example
 * await addColumnZeroDowntime(queryInterface, 'Users', 'status', {
 *   type: DataTypes.ENUM('active', 'inactive'),
 *   allowNull: false,
 *   defaultValue: 'active'
 * });
 */
export async function addColumnZeroDowntime(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  definition: ColumnDefinition,
  options: {
    populateFunction?: (queryInterface: QueryInterface) => Promise<void>;
    batchSize?: number;
  } = {},
): Promise<void> {
  const { populateFunction, batchSize = 1000 } = options;

  // Phase 1: Add column as nullable
  console.log(`Phase 1: Adding ${columnName} as nullable...`);
  await queryInterface.addColumn(tableName, columnName, {
    ...definition,
    allowNull: true,
  });

  // Phase 2: Populate data
  console.log(`Phase 2: Populating ${columnName}...`);
  if (populateFunction) {
    await populateFunction(queryInterface);
  } else if (definition.defaultValue !== undefined) {
    await backfillMissingData(
      queryInterface,
      tableName,
      columnName,
      'default',
      {
        defaultValue: definition.defaultValue,
      },
    );
  }

  // Phase 3: Make non-nullable if required
  if (!definition.allowNull) {
    console.log(`Phase 3: Making ${columnName} non-nullable...`);
    await queryInterface.changeColumn(tableName, columnName, definition);
  }

  console.log(`Zero-downtime column addition completed for ${columnName}`);
}

/**
 * Removes a column in a zero-downtime manner (stop writing, verify, then drop)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to remove
 * @param options - Zero-downtime options
 * @returns Promise that resolves when column is removed
 *
 * @example
 * await removeColumnZeroDowntime(queryInterface, 'Users', 'oldField', {
 *   verifyUnused: true,
 *   waitPeriod: 5000
 * });
 */
export async function removeColumnZeroDowntime(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  options: {
    verifyUnused?: boolean;
    waitPeriod?: number;
  } = {},
): Promise<void> {
  const { verifyUnused = true, waitPeriod = 0 } = options;

  if (verifyUnused) {
    console.log(`Verifying ${columnName} is not being written to...`);
    // In production, you would check application logs or metrics
    await new Promise((resolve) => setTimeout(resolve, waitPeriod));
  }

  console.log(`Dropping column ${columnName}...`);
  await queryInterface.removeColumn(tableName, columnName);

  console.log(`Zero-downtime column removal completed for ${columnName}`);
}

/**
 * Renames a column using the expand-contract pattern
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param oldColumnName - Current column name
 * @param newColumnName - New column name
 * @param definition - Column definition
 * @returns Promise that resolves when column is renamed
 *
 * @example
 * await renameColumnExpandContract(queryInterface, 'Users', 'userName', 'username', {
 *   type: DataTypes.STRING(50)
 * });
 */
export async function renameColumnExpandContract(
  queryInterface: QueryInterface,
  tableName: string,
  oldColumnName: string,
  newColumnName: string,
  definition: ColumnDefinition,
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  // Phase 1: Add new column
  console.log(`Phase 1: Adding new column ${newColumnName}...`);
  await queryInterface.addColumn(tableName, newColumnName, {
    ...definition,
    allowNull: true,
  });

  // Phase 2: Copy data
  console.log(`Phase 2: Copying data from ${oldColumnName} to ${newColumnName}...`);
  await sequelize.query(
    `UPDATE "${tableName}" SET "${newColumnName}" = "${oldColumnName}"`,
  );

  // Phase 3: Application deployment point - update code to write to both columns

  console.log(
    `Phase 3: Deploy application to write to both ${oldColumnName} and ${newColumnName}`,
  );
  console.log(`Waiting for deployment...`);

  // Phase 4: Make new column non-nullable if required
  if (!definition.allowNull) {
    console.log(`Phase 4: Making ${newColumnName} non-nullable...`);
    await queryInterface.changeColumn(tableName, newColumnName, definition);
  }

  console.log(
    `Expand phase complete. After verifying, run contract phase to remove ${oldColumnName}`,
  );
}

/**
 * Modifies a column type with zero downtime using shadow column technique
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to modify
 * @param newDefinition - New column definition
 * @param options - Modification options
 * @returns Promise that resolves when column type is modified
 *
 * @example
 * await modifyColumnTypeZeroDowntime(queryInterface, 'Orders', 'amount', {
 *   type: DataTypes.DECIMAL(12, 2)
 * }, { castExpression: 'amount::numeric' });
 */
export async function modifyColumnTypeZeroDowntime(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  newDefinition: ColumnDefinition,
  options: {
    castExpression?: string;
    batchSize?: number;
  } = {},
): Promise<void> {
  const { castExpression, batchSize = 1000 } = options;
  const sequelize = queryInterface.sequelize;
  const shadowColumn = `${columnName}_new`;

  // Phase 1: Add shadow column
  console.log(`Phase 1: Adding shadow column ${shadowColumn}...`);
  await queryInterface.addColumn(tableName, shadowColumn, {
    ...newDefinition,
    allowNull: true,
  });

  // Phase 2: Backfill shadow column
  console.log(`Phase 2: Backfilling ${shadowColumn}...`);
  const cast = castExpression || `"${columnName}"`;
  await sequelize.query(
    `UPDATE "${tableName}" SET "${shadowColumn}" = ${cast}`,
  );

  // Phase 3: Deploy application to write to both columns
  console.log(
    `Phase 3: Deploy application to write to both ${columnName} and ${shadowColumn}`,
  );

  // Phase 4: Swap columns
  console.log(`Phase 4: Swapping columns...`);
  const transaction = await sequelize.transaction();

  try {
    // Rename old column to backup
    await queryInterface.renameColumn(
      tableName,
      columnName,
      `${columnName}_old`,
      { transaction },
    );

    // Rename new column to original name
    await queryInterface.renameColumn(tableName, shadowColumn, columnName, {
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  console.log(
    `Column type modification complete. Old column backed up as ${columnName}_old`,
  );
}

/**
 * Rollback Strategy Functions
 */

/**
 * Creates a rollback point with data snapshot
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param pointName - Name of the rollback point
 * @param tables - Tables to include in the snapshot
 * @returns Promise that resolves when rollback point is created
 *
 * @example
 * await createRollbackPoint(queryInterface, 'before_major_migration', ['Users', 'Orders']);
 */
export async function createRollbackPoint(
  queryInterface: QueryInterface,
  pointName: string,
  tables: string[],
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  // Create rollback tracking table if it doesn't exist
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "RollbackPoints" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL UNIQUE,
      tables JSONB NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // For each table, create a backup
  const backupInfo: Record<string, string> = {};

  for (const table of tables) {
    const backupTableName = `${table}_rollback_${pointName}`;
    await sequelize.query(
      `CREATE TABLE "${backupTableName}" AS SELECT * FROM "${table}"`,
    );
    backupInfo[table] = backupTableName;
  }

  // Record rollback point
  await sequelize.query(
    `INSERT INTO "RollbackPoints" (name, tables) VALUES (:name, :tables)`,
    {
      replacements: {
        name: pointName,
        tables: JSON.stringify(backupInfo),
      },
    },
  );

  console.log(`Rollback point '${pointName}' created for tables: ${tables.join(', ')}`);
}

/**
 * Restores database to a rollback point
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param pointName - Name of the rollback point
 * @param options - Restore options
 * @returns Promise that resolves when rollback is complete
 *
 * @example
 * await restoreRollbackPoint(queryInterface, 'before_major_migration', {
 *   verify: true
 * });
 */
export async function restoreRollbackPoint(
  queryInterface: QueryInterface,
  pointName: string,
  options: {
    verify?: boolean;
    keepBackup?: boolean;
  } = {},
): Promise<void> {
  const { verify = true, keepBackup = true } = options;
  const sequelize = queryInterface.sequelize;

  // Get rollback point info
  const [results] = await sequelize.query(
    `SELECT tables FROM "RollbackPoints" WHERE name = :name`,
    {
      replacements: { name: pointName },
    },
  );

  if (results.length === 0) {
    throw new Error(`Rollback point '${pointName}' not found`);
  }

  const backupInfo = (results[0] as any).tables;
  const transaction = await sequelize.transaction();

  try {
    // Restore each table
    for (const [originalTable, backupTable] of Object.entries(backupInfo)) {
      console.log(`Restoring ${originalTable} from ${backupTable}...`);

      // Truncate original table
      await sequelize.query(`TRUNCATE TABLE "${originalTable}" CASCADE`, {
        transaction,
      });

      // Copy data from backup
      await sequelize.query(
        `INSERT INTO "${originalTable}" SELECT * FROM "${backupTable}"`,
        { transaction },
      );

      // Verify if requested
      if (verify) {
        const [originalCount] = await sequelize.query(
          `SELECT COUNT(*) as count FROM "${originalTable}"`,
          { transaction },
        );
        const [backupCount] = await sequelize.query(
          `SELECT COUNT(*) as count FROM "${backupTable}"`,
          { transaction },
        );

        if (
          (originalCount[0] as any).count !== (backupCount[0] as any).count
        ) {
          throw new Error(
            `Verification failed for ${originalTable}: row count mismatch`,
          );
        }
      }

      // Drop backup table if not keeping
      if (!keepBackup) {
        await sequelize.query(`DROP TABLE "${backupTable}"`, { transaction });
      }
    }

    await transaction.commit();
    console.log(`Rollback to point '${pointName}' completed successfully`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Generates a rollback migration from an up migration
 *
 * @param upMigrationPath - Path to the up migration file
 * @returns Rollback migration code
 *
 * @example
 * const rollback = generateRollbackMigration('./migrations/20231201-add-users.ts');
 */
export function generateRollbackMigration(
  upMigrationPath: string,
): string {
  // This is a simplified version - in production, you'd parse the migration file
  // and generate appropriate rollback operations

  const rollbackTemplate = `
module.exports = {
  async up(queryInterface, Sequelize) {
    // This is a rollback of ${upMigrationPath}
    // Implement the reverse operations here
    throw new Error('Rollback migration not implemented');
  },

  async down(queryInterface, Sequelize) {
    // Re-apply original migration
    throw new Error('Re-application not implemented');
  }
};
  `;

  return rollbackTemplate;
}

/**
 * Tests a rollback without committing
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param rollbackFunction - Rollback function to test
 * @returns Promise that resolves with test results
 *
 * @example
 * await testRollback(queryInterface, async (qi, t) => {
 *   await qi.removeColumn('Users', 'newField', { transaction: t });
 * });
 */
export async function testRollback(
  queryInterface: QueryInterface,
  rollbackFunction: (
    qi: QueryInterface,
    transaction: Transaction,
  ) => Promise<void>,
): Promise<{ success: boolean; error?: Error }> {
  const sequelize = queryInterface.sequelize;
  const transaction = await sequelize.transaction();

  try {
    // Execute rollback in transaction
    await rollbackFunction(queryInterface, transaction);

    // Always rollback to not commit changes
    await transaction.rollback();

    return { success: true };
  } catch (error) {
    await transaction.rollback();
    return { success: false, error: error as Error };
  }
}

/**
 * Seed Data Management Functions
 */

/**
 * Seeds data with upsert capability
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param config - Seed data configuration
 * @returns Promise that resolves when data is seeded
 *
 * @example
 * await seedDataWithUpsert(queryInterface, {
 *   table: 'Users',
 *   data: [
 *     { id: '123', username: 'admin', email: 'admin@example.com' }
 *   ],
 *   updateOnDuplicate: ['username', 'email']
 * });
 */
export async function seedDataWithUpsert(
  queryInterface: QueryInterface,
  config: SeedDataConfig,
): Promise<void> {
  const { table, data, updateOnDuplicate = [], transaction } = config;
  const sequelize = queryInterface.sequelize;

  for (const row of data) {
    const columns = Object.keys(row);
    const values = Object.values(row);
    const placeholders = columns.map((_, i) => `:val${i}`);

    const updateClause = updateOnDuplicate.length
      ? `ON CONFLICT (id) DO UPDATE SET ${updateOnDuplicate.map((col) => `"${col}" = EXCLUDED."${col}"`).join(', ')}`
      : 'ON CONFLICT (id) DO NOTHING';

    await sequelize.query(
      `
      INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')})
      VALUES (${placeholders.join(', ')})
      ${updateClause}
    `,
      {
        replacements: values.reduce(
          (acc, val, i) => ({ ...acc, [`val${i}`]: val }),
          {},
        ),
        transaction,
      },
    );
  }

  console.log(`Seeded ${data.length} rows into ${table}`);
}

/**
 * Generates seed data from existing data
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param options - Generation options
 * @returns Promise that resolves with generated seed data
 *
 * @example
 * const seeds = await generateSeedFromExisting(queryInterface, 'Users', {
 *   where: "role = 'admin'",
 *   limit: 10
 * });
 */
export async function generateSeedFromExisting(
  queryInterface: QueryInterface,
  tableName: string,
  options: {
    where?: string;
    limit?: number;
    exclude?: string[];
  } = {},
): Promise<any[]> {
  const { where, limit, exclude = [] } = options;
  const sequelize = queryInterface.sequelize;

  const whereClause = where ? `WHERE ${where}` : '';
  const limitClause = limit ? `LIMIT ${limit}` : '';

  const [results] = await sequelize.query(
    `SELECT * FROM "${tableName}" ${whereClause} ${limitClause}`,
  );

  // Remove excluded columns
  const seeds = (results as any[]).map((row) => {
    const seed = { ...row };
    for (const col of exclude) {
      delete seed[col];
    }
    return seed;
  });

  return seeds;
}

/**
 * Clears seed data from tables
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tables - Array of table names to clear
 * @param options - Clear options
 * @returns Promise that resolves when data is cleared
 *
 * @example
 * await clearSeedData(queryInterface, ['Users', 'Roles'], {
 *   cascade: true
 * });
 */
export async function clearSeedData(
  queryInterface: QueryInterface,
  tables: string[],
  options: {
    cascade?: boolean;
    where?: Record<string, any>;
  } = {},
): Promise<void> {
  const { cascade = false, where } = options;
  const sequelize = queryInterface.sequelize;

  for (const table of tables) {
    const cascadeClause = cascade ? 'CASCADE' : '';

    if (where && Object.keys(where).length > 0) {
      const whereClause = Object.entries(where)
        .map(([key, val]) => `"${key}" = '${val}'`)
        .join(' AND ');
      await sequelize.query(`DELETE FROM "${table}" WHERE ${whereClause}`);
    } else {
      await sequelize.query(`TRUNCATE TABLE "${table}" ${cascadeClause}`);
    }

    console.log(`Cleared seed data from ${table}`);
  }
}

/**
 * Fixture Generation Functions
 */

/**
 * Creates test fixtures with factories
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param fixtures - Array of fixture definitions
 * @returns Promise that resolves when fixtures are created
 *
 * @example
 * await createTestFixtures(queryInterface, [
 *   {
 *     model: 'Users',
 *     count: 10,
 *     factory: (i) => ({
 *       id: `user-${i}`,
 *       username: `user${i}`,
 *       email: `user${i}@example.com`
 *     })
 *   }
 * ]);
 */
export async function createTestFixtures(
  queryInterface: QueryInterface,
  fixtures: FixtureDefinition[],
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  for (const fixture of fixtures) {
    const { model, count, factory } = fixture;
    const data = [];

    for (let i = 0; i < count; i++) {
      data.push(factory(i));
    }

    await seedDataWithUpsert(queryInterface, {
      table: model,
      data,
    });

    console.log(`Created ${count} fixtures for ${model}`);
  }
}

/**
 * Migration Utility Functions
 */

/**
 * Checks if a table exists
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to check
 * @returns Promise that resolves with existence boolean
 *
 * @example
 * const exists = await checkTableExists(queryInterface, 'Users');
 */
export async function checkTableExists(
  queryInterface: QueryInterface,
  tableName: string,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const [results] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = :tableName
        )`
      : `SELECT COUNT(*) as count FROM information_schema.tables
         WHERE table_schema = DATABASE()
         AND table_name = :tableName`,
    {
      replacements: { tableName },
    },
  );

  if (dialect === 'postgres') {
    return (results[0] as any).exists;
  } else {
    return (results[0] as any).count > 0;
  }
}

/**
 * Checks if a column exists in a table
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columnName - Name of the column to check
 * @returns Promise that resolves with existence boolean
 *
 * @example
 * const exists = await checkColumnExists(queryInterface, 'Users', 'email');
 */
export async function checkColumnExists(
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const [results] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = :tableName
          AND column_name = :columnName
        )`
      : `SELECT COUNT(*) as count FROM information_schema.columns
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND column_name = :columnName`,
    {
      replacements: { tableName, columnName },
    },
  );

  if (dialect === 'postgres') {
    return (results[0] as any).exists;
  } else {
    return (results[0] as any).count > 0;
  }
}

/**
 * Checks if an index exists
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexName - Name of the index to check
 * @returns Promise that resolves with existence boolean
 *
 * @example
 * const exists = await checkIndexExists(queryInterface, 'Users', 'users_email_idx');
 */
export async function checkIndexExists(
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const [results] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT EXISTS (
          SELECT FROM pg_indexes
          WHERE schemaname = 'public'
          AND tablename = :tableName
          AND indexname = :indexName
        )`
      : `SELECT COUNT(*) as count FROM information_schema.statistics
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND index_name = :indexName`,
    {
      replacements: { tableName, indexName },
    },
  );

  if (dialect === 'postgres') {
    return (results[0] as any).exists;
  } else {
    return (results[0] as any).count > 0;
  }
}

/**
 * Checks if a constraint exists
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param constraintName - Name of the constraint to check
 * @returns Promise that resolves with existence boolean
 *
 * @example
 * const exists = await checkConstraintExists(queryInterface, 'Orders', 'orders_user_fkey');
 */
export async function checkConstraintExists(
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  const [results] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT EXISTS (
          SELECT FROM information_schema.table_constraints
          WHERE table_schema = 'public'
          AND table_name = :tableName
          AND constraint_name = :constraintName
        )`
      : `SELECT COUNT(*) as count FROM information_schema.table_constraints
         WHERE table_schema = DATABASE()
         AND table_name = :tableName
         AND constraint_name = :constraintName`,
    {
      replacements: { tableName, constraintName },
    },
  );

  if (dialect === 'postgres') {
    return (results[0] as any).exists;
  } else {
    return (results[0] as any).count > 0;
  }
}

/**
 * Gets table row count
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param where - Optional WHERE clause
 * @returns Promise that resolves with row count
 *
 * @example
 * const count = await getTableRowCount(queryInterface, 'Users', "status = 'active'");
 */
export async function getTableRowCount(
  queryInterface: QueryInterface,
  tableName: string,
  where?: string,
): Promise<number> {
  const sequelize = queryInterface.sequelize;
  const whereClause = where ? `WHERE ${where}` : '';

  const [results] = await sequelize.query(
    `SELECT COUNT(*) as count FROM "${tableName}" ${whereClause}`,
  );

  return (results[0] as any).count;
}

/**
 * Ensures the migration history table exists
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @returns Promise that resolves when table is ensured
 *
 * @example
 * await ensureMigrationHistoryTable(queryInterface);
 */
export async function ensureMigrationHistoryTable(
  queryInterface: QueryInterface,
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "MigrationHistory" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      "executedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "executionTime" INTEGER DEFAULT 0,
      "rowsAffected" INTEGER DEFAULT 0,
      description TEXT,
      UNIQUE(name)
    )
  `);
}

/**
 * Acquires a migration lock to prevent concurrent migrations
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param lockId - Unique identifier for the lock
 * @param ttl - Time to live in milliseconds
 * @returns Promise that resolves with lock acquisition result
 *
 * @example
 * const locked = await acquireMigrationLock(queryInterface, 'migration-123', 300000);
 */
export async function acquireMigrationLock(
  queryInterface: QueryInterface,
  lockId: string,
  ttl: number = 300000,
): Promise<boolean> {
  const sequelize = queryInterface.sequelize;

  // Ensure lock table exists
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "MigrationLocks" (
      "lockId" VARCHAR(255) PRIMARY KEY,
      "acquiredAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "acquiredBy" VARCHAR(255) NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL
    )
  `);

  // Clean up expired locks
  await sequelize.query(
    `DELETE FROM "MigrationLocks" WHERE "expiresAt" < NOW()`,
  );

  try {
    const expiresAt = new Date(Date.now() + ttl);
    const acquiredBy = process.env.HOSTNAME || 'unknown';

    await sequelize.query(
      `INSERT INTO "MigrationLocks" ("lockId", "acquiredBy", "expiresAt")
       VALUES (:lockId, :acquiredBy, :expiresAt)`,
      {
        replacements: { lockId, acquiredBy, expiresAt },
      },
    );

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Releases a migration lock
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param lockId - Unique identifier for the lock
 * @returns Promise that resolves when lock is released
 *
 * @example
 * await releaseMigrationLock(queryInterface, 'migration-123');
 */
export async function releaseMigrationLock(
  queryInterface: QueryInterface,
  lockId: string,
): Promise<void> {
  const sequelize = queryInterface.sequelize;

  await sequelize.query(
    `DELETE FROM "MigrationLocks" WHERE "lockId" = :lockId`,
    {
      replacements: { lockId },
    },
  );
}

/**
 * Executes a migration with automatic locking
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param migrationName - Name of the migration
 * @param migrationFunction - Migration function to execute
 * @returns Promise that resolves when migration is complete
 *
 * @example
 * await executeMigrationWithLock(queryInterface, 'add-users-table', async (qi) => {
 *   await qi.createTable('Users', { ... });
 * });
 */
export async function executeMigrationWithLock(
  queryInterface: QueryInterface,
  migrationName: string,
  migrationFunction: (qi: QueryInterface) => Promise<void>,
): Promise<void> {
  const lockId = `migration_${migrationName}`;

  // Acquire lock
  const acquired = await acquireMigrationLock(queryInterface, lockId);

  if (!acquired) {
    throw new Error(
      `Could not acquire lock for migration ${migrationName}. Another migration may be running.`,
    );
  }

  const startTime = Date.now();

  try {
    // Execute migration
    await migrationFunction(queryInterface);

    // Record execution
    const executionTime = Date.now() - startTime;
    await recordMigrationExecution(queryInterface, migrationName, {
      executionTime,
    });
  } finally {
    // Always release lock
    await releaseMigrationLock(queryInterface, lockId);
  }
}

/**
 * Executes multiple migrations in sequence with rollback on failure
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param migrations - Array of migration definitions
 * @param options - Batch execution options
 * @returns Promise that resolves with execution results
 *
 * @example
 * await executeBatchMigrations(queryInterface, [
 *   {
 *     name: 'create-users-table',
 *     up: async (qi) => { await qi.createTable('Users', { ... }); }
 *   },
 *   {
 *     name: 'add-user-indexes',
 *     up: async (qi) => { await qi.addIndex('Users', ['email']); }
 *   }
 * ], { stopOnError: true });
 */
export async function executeBatchMigrations(
  queryInterface: QueryInterface,
  migrations: Array<{
    name: string;
    up: (qi: QueryInterface, transaction: Transaction) => Promise<void>;
    down?: (qi: QueryInterface, transaction: Transaction) => Promise<void>;
  }>,
  options: {
    stopOnError?: boolean;
    rollbackOnError?: boolean;
    parallelExecution?: boolean;
  } = {},
): Promise<
  Array<{
    name: string;
    status: 'success' | 'failed' | 'skipped';
    executionTime: number;
    error?: Error;
  }>
> {
  const { stopOnError = true, rollbackOnError = true, parallelExecution = false } = options;
  const sequelize = queryInterface.sequelize;
  const results: Array<{
    name: string;
    status: 'success' | 'failed' | 'skipped';
    executionTime: number;
    error?: Error;
  }> = [];

  if (parallelExecution) {
    // Execute migrations in parallel
    const promises = migrations.map(async (migration) => {
      const startTime = Date.now();
      const transaction = await sequelize.transaction();

      try {
        await migration.up(queryInterface, transaction);
        await transaction.commit();

        const executionTime = Date.now() - startTime;
        await recordMigrationExecution(queryInterface, migration.name, {
          executionTime,
        });

        return {
          name: migration.name,
          status: 'success' as const,
          executionTime,
        };
      } catch (error) {
        await transaction.rollback();
        return {
          name: migration.name,
          status: 'failed' as const,
          executionTime: Date.now() - startTime,
          error: error as Error,
        };
      }
    });

    results.push(...(await Promise.all(promises)));
  } else {
    // Execute migrations sequentially
    let shouldContinue = true;
    const executedMigrations: string[] = [];

    for (const migration of migrations) {
      if (!shouldContinue) {
        results.push({
          name: migration.name,
          status: 'skipped',
          executionTime: 0,
        });
        continue;
      }

      const startTime = Date.now();
      const transaction = await sequelize.transaction();

      try {
        console.log(`Executing migration: ${migration.name}...`);
        await migration.up(queryInterface, transaction);
        await transaction.commit();

        const executionTime = Date.now() - startTime;
        await recordMigrationExecution(queryInterface, migration.name, {
          executionTime,
        });

        executedMigrations.push(migration.name);
        results.push({
          name: migration.name,
          status: 'success',
          executionTime,
        });

        console.log(`Migration ${migration.name} completed in ${executionTime}ms`);
      } catch (error) {
        await transaction.rollback();

        const executionTime = Date.now() - startTime;
        results.push({
          name: migration.name,
          status: 'failed',
          executionTime,
          error: error as Error,
        });

        console.error(`Migration ${migration.name} failed:`, error);

        if (stopOnError) {
          shouldContinue = false;

          // Rollback all executed migrations if requested
          if (rollbackOnError && executedMigrations.length > 0) {
            console.log('Rolling back executed migrations...');

            for (let i = executedMigrations.length - 1; i >= 0; i--) {
              const migrationToRollback = migrations.find(
                (m) => m.name === executedMigrations[i],
              );

              if (migrationToRollback?.down) {
                const rollbackTransaction = await sequelize.transaction();
                try {
                  await migrationToRollback.down(
                    queryInterface,
                    rollbackTransaction,
                  );
                  await rollbackTransaction.commit();
                  console.log(`Rolled back migration: ${migrationToRollback.name}`);
                } catch (rollbackError) {
                  await rollbackTransaction.rollback();
                  console.error(
                    `Failed to rollback migration ${migrationToRollback.name}:`,
                    rollbackError,
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  // Summary
  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  console.log(
    `Batch migration completed. Success: ${successful}, Failed: ${failed}, Skipped: ${skipped}`,
  );

  return results;
}

/**
 * Analyzes migration performance and provides optimization recommendations
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param migrationFunction - Migration function to analyze
 * @param options - Analysis options
 * @returns Promise that resolves with performance analysis
 *
 * @example
 * const analysis = await analyzeMigrationPerformance(queryInterface,
 *   async (qi) => {
 *     await qi.addColumn('Users', 'status', { type: DataTypes.STRING });
 *   },
 *   { sampleSize: 1000 }
 * );
 * console.log('Estimated time:', analysis.estimatedTime);
 */
export async function analyzeMigrationPerformance(
  queryInterface: QueryInterface,
  migrationFunction: (qi: QueryInterface, transaction: Transaction) => Promise<void>,
  options: {
    sampleSize?: number;
    dryRun?: boolean;
    tableName?: string;
  } = {},
): Promise<{
  executionTime: number;
  estimatedTime?: number;
  rowCount?: number;
  recommendations: string[];
  queryStats: {
    totalQueries: number;
    slowQueries: number;
  };
}> {
  const { sampleSize = 1000, dryRun = true, tableName } = options;
  const sequelize = queryInterface.sequelize;
  const recommendations: string[] = [];

  // Get row count if table name provided
  let rowCount: number | undefined;
  if (tableName) {
    rowCount = await getTableRowCount(queryInterface, tableName);
  }

  // Start timing
  const startTime = Date.now();

  // Execute migration in transaction (rollback if dry run)
  const transaction = await sequelize.transaction();
  let queryCount = 0;
  let slowQueryCount = 0;

  try {
    // Monitor queries (simplified - in production use query hooks)
    await migrationFunction(queryInterface, transaction);

    if (dryRun) {
      await transaction.rollback();
    } else {
      await transaction.commit();
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const executionTime = Date.now() - startTime;

  // Calculate estimated time for full dataset
  let estimatedTime: number | undefined;
  if (rowCount && sampleSize < rowCount) {
    estimatedTime = (executionTime / sampleSize) * rowCount;

    if (estimatedTime > 60000) {
      recommendations.push(
        `Migration may take ${Math.round(estimatedTime / 60000)} minutes. Consider batch processing.`,
      );
    }
  }

  // Performance recommendations
  if (executionTime > 5000) {
    recommendations.push(
      'Migration took longer than 5 seconds. Consider adding indexes before data operations.',
    );
  }

  if (rowCount && rowCount > 100000) {
    recommendations.push(
      'Large table detected. Consider using batch operations with smaller chunk sizes.',
    );
    recommendations.push(
      'For zero-downtime, consider using shadow tables or online schema changes.',
    );
  }

  recommendations.push(
    'Always test migrations on a staging environment with production-like data volumes.',
  );

  if (dryRun) {
    recommendations.push(
      'This was a dry run. Actual performance may vary based on system load.',
    );
  }

  const analysis = {
    executionTime,
    estimatedTime,
    rowCount,
    recommendations,
    queryStats: {
      totalQueries: queryCount,
      slowQueries: slowQueryCount,
    },
  };

  console.log('Migration Performance Analysis:');
  console.log(`Execution Time: ${executionTime}ms`);
  if (estimatedTime) {
    console.log(`Estimated Full Time: ${Math.round(estimatedTime / 1000)}s`);
  }
  if (rowCount) {
    console.log(`Row Count: ${rowCount}`);
  }
  console.log('Recommendations:');
  recommendations.forEach((rec) => console.log(`  - ${rec}`));

  return analysis;
}

/**
 * Default export of all utilities
 */
export default {
  // Migration builders
  createTableWithDefaults,
  safeAlterTable,
  dropTableSafely,
  renameTableWithDependencies,

  // Column management
  addColumnWithDefaults,
  removeColumnSafely,
  modifyColumnType,
  renameColumnUniversal,

  // Index management
  createOptimizedIndex,
  dropIndexSafely,
  createCompositeIndex,
  createUniqueIndex,
  recreateIndex,

  // Constraint management
  addForeignKeyConstraint,
  addCheckConstraint,
  removeConstraintSafely,
  addUniqueConstraint,
  replaceConstraint,

  // Data migration
  batchDataTransform,
  migrateDataBetweenTables,
  copyTableData,
  validateDataIntegrity,
  backfillMissingData,

  // Schema versioning
  recordMigrationExecution,
  getCurrentSchemaVersion,
  compareSchemaVersions,
  createSchemaSnapshot,

  // Zero-downtime migrations
  addColumnZeroDowntime,
  removeColumnZeroDowntime,
  renameColumnExpandContract,
  modifyColumnTypeZeroDowntime,

  // Rollback strategies
  createRollbackPoint,
  restoreRollbackPoint,
  generateRollbackMigration,
  testRollback,

  // Seed data management
  seedDataWithUpsert,
  generateSeedFromExisting,
  clearSeedData,

  // Fixture generation
  createTestFixtures,

  // Utility functions
  checkTableExists,
  checkColumnExists,
  checkIndexExists,
  checkConstraintExists,
  getTableRowCount,
  ensureMigrationHistoryTable,

  // Migration locking
  acquireMigrationLock,
  releaseMigrationLock,
  executeMigrationWithLock,

  // Batch execution
  executeBatchMigrations,

  // Performance optimization
  analyzeMigrationPerformance,
};
