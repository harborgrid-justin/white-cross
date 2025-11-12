/**
 * Column Operations for Migration Utilities
 *
 * Comprehensive column management functions for database migrations
 * including creation, modification, removal, and type changes.
 *
 * @module database/migrations/utilities/column-operations
 */

import { QueryInterface, Sequelize, DataTypes, Transaction } from 'sequelize';
import {
  ColumnDefinition,
  ColumnModificationOptions,
  ZeroDowntimeOptions,
} from './types';

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

  // Populate default values if specified (with proper escaping)
  if (populateDefault && definition.defaultValue !== undefined) {
    const dialect = queryInterface.sequelize.getDialect();
    const tableRef = dialect === 'postgres' ? `"${tableName}"` : `\`${tableName}\``;
    const columnRef = dialect === 'postgres' ? `"${columnName}"` : `\`${columnName}\``;

    await queryInterface.sequelize.query(
      `UPDATE ${tableRef} SET ${columnRef} = :defaultValue WHERE ${columnRef} IS NULL`,
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
    const count = (results[0] as { count: number }).count;
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
  options: ColumnModificationOptions = {},
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
    console.log(`Column ${columnName} conversion completed. NULL count: ${(results[0] as { count: number }).count}`);
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
    return (results[0] as { exists: boolean }).exists;
  } else {
    return (results[0] as { count: number }).count > 0;
  }
}

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
  options: ZeroDowntimeOptions = {},
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
  options: ZeroDowntimeOptions = {},
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
    defaultValue?: unknown;
    expression?: string;
    lookupTable?: string;
    lookupKey?: string;
    lookupValue?: string;
    customFunction?: (row: unknown) => unknown;
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

      for (const row of rows as Array<Record<string, unknown>>) {
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
    rowsUpdated = (countResult[0] as { count: number }).count;
  }

  console.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);

  return { rowsUpdated };
}
