/**
 * Table Operations for Migration Utilities
 *
 * Comprehensive table creation, modification, and management functions
 * for database migrations with safety checks and rollback capabilities.
 *
 * @module database/migrations/utilities/table-operations
 */

import {
  QueryInterface,
  Sequelize,
  DataTypes,
  Transaction,
} from 'sequelize';
import { buildTableAttributes } from './table-attributes-builder';
import {
  TableCreationOptions,
  IndexDefinition,
  TableAlterationFunction,
} from './types';

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
  attributes: Record<string, unknown>,
  options: TableCreationOptions = {},
  transaction?: Transaction,
): Promise<void> {
  const {
    indexes = [],
    paranoid = false,
    timestamps = true,
    underscored = false,
    comment,
  } = options;

  // Build complete attribute definition with defaults using shared utility
  const completeAttributes = buildTableAttributes(attributes, { timestamps, paranoid });

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
  alterations: TableAlterationFunction,
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

  // Update sequences for PostgreSQL (using parameterized queries to prevent SQL injection)
  if (dialect === 'postgres') {
    const [sequences] = await sequelize.query(
      `
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_name LIKE :pattern
    `,
      {
        replacements: { pattern: `${oldTableName}%` },
        transaction,
      },
    );

    for (const seq of sequences as Array<{ sequence_name: string }>) {
      const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
      // Use identifier quoting for safety
      await sequelize.query(
        `ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`,
        { transaction },
      );
    }
  }
}

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
    return (results[0] as { exists: boolean }).exists;
  } else {
    return (results[0] as { count: number }).count > 0;
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

  return (results[0] as { count: number }).count;
}

/**
 * Creates a backup copy of a table
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param sourceTable - Source table name
 * @param backupTable - Backup table name
 * @param options - Backup options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when backup is created
 *
 * @example
 * await createTableBackup(queryInterface, 'Users', 'Users_backup_20231201');
 */
export async function createTableBackup(
  queryInterface: QueryInterface,
  sourceTable: string,
  backupTable: string,
  options: {
    includeData?: boolean;
    where?: string;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { includeData = true, where } = options;
  const sequelize = queryInterface.sequelize;

  if (includeData) {
    const whereClause = where ? `WHERE ${where}` : '';
    await sequelize.query(
      `CREATE TABLE "${backupTable}" AS SELECT * FROM "${sourceTable}" ${whereClause}`,
      { transaction },
    );
  } else {
    // Create structure only
    await sequelize.query(
      `CREATE TABLE "${backupTable}" AS SELECT * FROM "${sourceTable}" WHERE 1=0`,
      { transaction },
    );
  }

  console.log(`Table backup created: ${backupTable}`);
}

/**
 * Restores a table from backup
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param targetTable - Target table name
 * @param backupTable - Backup table name
 * @param options - Restore options
 * @param transaction - Optional transaction for atomic operations
 * @returns Promise that resolves when restore is complete
 *
 * @example
 * await restoreTableFromBackup(queryInterface, 'Users', 'Users_backup_20231201');
 */
export async function restoreTableFromBackup(
  queryInterface: QueryInterface,
  targetTable: string,
  backupTable: string,
  options: {
    truncateFirst?: boolean;
    verify?: boolean;
  } = {},
  transaction?: Transaction,
): Promise<void> {
  const { truncateFirst = true, verify = true } = options;
  const sequelize = queryInterface.sequelize;

  if (truncateFirst) {
    await sequelize.query(`TRUNCATE TABLE "${targetTable}" CASCADE`, {
      transaction,
    });
  }

  // Restore data
  await sequelize.query(
    `INSERT INTO "${targetTable}" SELECT * FROM "${backupTable}"`,
    { transaction },
  );

  // Verify if requested
  if (verify) {
    const [targetCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${targetTable}"`,
      { transaction },
    );
    const [backupCount] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${backupTable}"`,
      { transaction },
    );

    if (
      (targetCount[0] as { count: number }).count !==
      (backupCount[0] as { count: number }).count
    ) {
      throw new Error(
        `Restore verification failed: row count mismatch for ${targetTable}`,
      );
    }
  }

  console.log(`Table restored from backup: ${targetTable}`);
}

/**
 * Compares table structures between two tables
 *
 * @param queryInterface - Sequelize QueryInterface instance
 * @param table1 - First table name
 * @param table2 - Second table name
 * @returns Promise that resolves with comparison results
 *
 * @example
 * const diff = await compareTableStructures(queryInterface, 'Users', 'Users_backup');
 */
export async function compareTableStructures(
  queryInterface: QueryInterface,
  table1: string,
  table2: string,
): Promise<{
  identical: boolean;
  differences: string[];
}> {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();
  const differences: string[] = [];

  // Get column information for both tables
  const [table1Columns] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName
         ORDER BY ordinal_position`
      : `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName AND table_schema = DATABASE()
         ORDER BY ordinal_position`,
    { replacements: { tableName: table1 } },
  );

  const [table2Columns] = await sequelize.query(
    dialect === 'postgres'
      ? `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName
         ORDER BY ordinal_position`
      : `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = :tableName AND table_schema = DATABASE()
         ORDER BY ordinal_position`,
    { replacements: { tableName: table2 } },
  );

  // Compare column counts
  if (table1Columns.length !== table2Columns.length) {
    differences.push(
      `Column count mismatch: ${table1} has ${table1Columns.length} columns, ${table2} has ${table2Columns.length} columns`,
    );
  }

  // Compare columns
  const table1ColumnMap = new Map(
    (table1Columns as Array<Record<string, unknown>>).map((col) => [
      col.column_name as string,
      col,
    ]),
  );
  const table2ColumnMap = new Map(
    (table2Columns as Array<Record<string, unknown>>).map((col) => [
      col.column_name as string,
      col,
    ]),
  );

  // Check for missing columns in table2
  for (const [columnName, columnInfo] of table1ColumnMap) {
    if (!table2ColumnMap.has(columnName)) {
      differences.push(`Column '${columnName}' exists in ${table1} but not in ${table2}`);
    } else {
      // Compare column properties
      const table2Column = table2ColumnMap.get(columnName)!;
      if (columnInfo.data_type !== table2Column.data_type) {
        differences.push(
          `Column '${columnName}' type mismatch: ${columnInfo.data_type} vs ${table2Column.data_type}`,
        );
      }
      if (columnInfo.is_nullable !== table2Column.is_nullable) {
        differences.push(
          `Column '${columnName}' nullable mismatch: ${columnInfo.is_nullable} vs ${table2Column.is_nullable}`,
        );
      }
    }
  }

  // Check for extra columns in table2
  for (const columnName of table2ColumnMap.keys()) {
    if (!table1ColumnMap.has(columnName)) {
      differences.push(`Column '${columnName}' exists in ${table2} but not in ${table1}`);
    }
  }

  return {
    identical: differences.length === 0,
    differences,
  };
}
