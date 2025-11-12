/**
 * Constraint Operations for Migration Utilities
 *
 * Comprehensive constraint management functions for database migrations
 * including foreign keys, check constraints, unique constraints, and indexes.
 *
 * @module database/migrations/utilities/constraint-operations
 */

import { QueryInterface, Transaction } from 'sequelize';
import {
  ForeignKeyConstraint,
  ConstraintReplacement,
  IndexDefinition,
} from './types';

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
  constraint: ForeignKeyConstraint,
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
  newConstraint: ConstraintReplacement,
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
        newConstraint as ForeignKeyConstraint,
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
    return (results[0] as { exists: boolean }).exists;
  } else {
    return (results[0] as { count: number }).count > 0;
  }
}

/**
 * Creates an optimized index with performance considerations
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexDefinition - Index configuration
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
  const { name, fields, unique = false, concurrently = false } = indexDefinition;

  // For PostgreSQL, use CONCURRENTLY for large tables
  if (concurrently && queryInterface.sequelize.getDialect() === 'postgres') {
    const uniqueClause = unique ? 'UNIQUE' : '';
    const fieldsClause = fields
      .map((field) => (typeof field === 'string' ? `"${field}"` : `"${field.name}"`))
      .join(', ');

    await queryInterface.sequelize.query(
      `CREATE ${uniqueClause} INDEX CONCURRENTLY "${name}" ON "${tableName}" (${fieldsClause})`,
      { transaction },
    );
  } else {
    // Standard index creation
    await queryInterface.addIndex(tableName, fields, {
      ...indexDefinition,
      transaction,
    });
  }
}

/**
 * Drops an index safely with existence check
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexName - Name of the index to drop
 * @param options - Drop options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when index is dropped
 *
 * @example
 * await dropIndexSafely(queryInterface, 'Users', 'users_email_idx', {
 *   ifExists: true,
 *   concurrently: true
 * });
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

  if (ifExists) {
    const indexExists = await checkIndexExists(queryInterface, tableName, indexName);
    if (!indexExists) {
      return;
    }
  }

  if (concurrently && sequelize.getDialect() === 'postgres') {
    await sequelize.query(`DROP INDEX CONCURRENTLY "${indexName}"`, { transaction });
  } else {
    await queryInterface.removeIndex(tableName, indexName, { transaction });
  }
}

/**
 * Creates a composite index on multiple columns
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columns - Array of column names or column objects
 * @param indexName - Name of the index
 * @param options - Index options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when composite index is created
 *
 * @example
 * await createCompositeIndex(queryInterface, 'Orders', 
 *   [{ name: 'userId', order: 'ASC' }, { name: 'createdAt', order: 'DESC' }],
 *   'orders_user_created_idx'
 * );
 */
export async function createCompositeIndex(
  queryInterface: QueryInterface,
  tableName: string,
  columns: Array<string | { name: string; order?: 'ASC' | 'DESC'; length?: number }>,
  indexName: string,
  options: {
    unique?: boolean;
    where?: unknown;
    concurrently?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  await createOptimizedIndex(
    queryInterface,
    tableName,
    {
      name: indexName,
      fields: columns,
      unique: options.unique,
      where: options.where,
      concurrently: options.concurrently,
    },
    transaction,
  );
}

/**
 * Creates a unique index with conflict handling
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param columns - Array of column names
 * @param indexName - Name of the unique index
 * @param options - Index options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when unique index is created
 *
 * @example
 * await createUniqueIndex(queryInterface, 'Users', ['email'], 'users_email_unique', {
 *   where: { deletedAt: null }
 * });
 */
export async function createUniqueIndex(
  queryInterface: QueryInterface,
  tableName: string,
  columns: string[],
  indexName: string,
  options: {
    where?: unknown;
    concurrently?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  await createOptimizedIndex(
    queryInterface,
    tableName,
    {
      name: indexName,
      fields: columns,
      unique: true,
      where: options.where,
      concurrently: options.concurrently,
    },
    transaction,
  );
}

/**
 * Recreates an index (drops and creates)
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table
 * @param indexName - Name of the index to recreate
 * @param indexDefinition - New index definition
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when index is recreated
 *
 * @example
 * await recreateIndex(queryInterface, 'Users', 'users_name_idx', {
 *   fields: [{ name: 'firstName' }, { name: 'lastName' }],
 *   unique: false
 * });
 */
export async function recreateIndex(
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  indexDefinition: IndexDefinition,
  transaction?: Transaction,
): Promise<void> {
  const sequelize = queryInterface.sequelize;
  const t = transaction || (await sequelize.transaction());

  try {
    // Drop existing index
    await dropIndexSafely(queryInterface, tableName, indexName, { ifExists: true }, t);

    // Create new index
    await createOptimizedIndex(
      queryInterface,
      tableName,
      { ...indexDefinition, name: indexName },
      t,
    );

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
    return (results[0] as { exists: boolean }).exists;
  } else {
    return (results[0] as { count: number }).count > 0;
  }
}

/**
 * Analyzes index usage and provides optimization recommendations
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param tableName - Name of the table to analyze
 * @returns Promise that resolves with index analysis
 *
 * @example
 * const analysis = await analyzeIndexUsage(queryInterface, 'Users');
 * console.log('Unused indexes:', analysis.unusedIndexes);
 */
export async function analyzeIndexUsage(
  queryInterface: QueryInterface,
  tableName: string,
): Promise<{
  indexes: Array<{
    name: string;
    columns: string[];
    unique: boolean;
    size?: string;
    usage?: number;
  }>;
  recommendations: string[];
}> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();
  const recommendations: string[] = [];

  let indexes: Array<{
    name: string;
    columns: string[];
    unique: boolean;
    size?: string;
    usage?: number;
  }> = [];

  if (dialect === 'postgres') {
    // Get PostgreSQL index information
    const [results] = await sequelize.query(`
      SELECT 
        i.indexname as name,
        array_agg(a.attname ORDER BY a.attnum) as columns,
        i.indexdef LIKE '%UNIQUE%' as unique,
        pg_size_pretty(pg_relation_size(i.indexname::regclass)) as size,
        s.idx_scan as usage
      FROM pg_indexes i
      JOIN pg_class c ON c.relname = i.tablename
      JOIN pg_index idx ON idx.indexrelid = (i.schemaname||'.'||i.indexname)::regclass::oid
      JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(idx.indkey)
      LEFT JOIN pg_stat_user_indexes s ON s.indexrelname = i.indexname
      WHERE i.tablename = :tableName
        AND i.schemaname = 'public'
      GROUP BY i.indexname, i.indexdef, s.idx_scan
    `, {
      replacements: { tableName },
    });

    indexes = (results as Array<Record<string, unknown>>).map((row) => ({
      name: row.name as string,
      columns: row.columns as string[],
      unique: row.unique as boolean,
      size: row.size as string,
      usage: row.usage as number,
    }));

    // Generate recommendations for PostgreSQL
    indexes.forEach((index) => {
      if (index.usage === 0) {
        recommendations.push(`Consider dropping unused index: ${index.name}`);
      }
      if (index.columns.length > 4) {
        recommendations.push(`Index ${index.name} has many columns, consider if all are needed`);
      }
    });
  } else {
    // MySQL/MariaDB index information
    const [results] = await sequelize.query(`
      SELECT 
        INDEX_NAME as name,
        GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as columns,
        NON_UNIQUE = 0 as unique
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
      GROUP BY INDEX_NAME, NON_UNIQUE
    `, {
      replacements: { tableName },
    });

    indexes = (results as Array<Record<string, unknown>>).map((row) => ({
      name: row.name as string,
      columns: (row.columns as string).split(','),
      unique: row.unique as boolean,
    }));
  }

  // General recommendations
  if (indexes.length === 0) {
    recommendations.push('No indexes found. Consider adding indexes on frequently queried columns.');
  }

  if (indexes.filter((idx) => idx.unique).length === 0) {
    recommendations.push('No unique indexes found. Consider adding unique constraints where appropriate.');
  }

  return { indexes, recommendations };
}
