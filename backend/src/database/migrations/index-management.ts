/**
 * Index Management - Database index operations and optimizations
 */

import { QueryInterface, Transaction } from 'sequelize';

export interface IndexDefinition {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: string;
  where?: any;
  concurrently?: boolean;
}

/**
 * Creates an index with optimal settings for the database dialect
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
 * Checks if an index exists
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
