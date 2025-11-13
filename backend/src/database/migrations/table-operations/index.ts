/**
 * Table Operations Service
 *
 * Provides comprehensive table management operations for database migrations
 * in the White Cross healthcare platform.
 *
 * This service handles table creation, alteration, data migration, and constraint management
 * with proper error handling and transaction support.
 */

import { Injectable, Logger } from '@nestjs/common';
import { QueryInterface, Transaction, Sequelize } from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  TableOperationOptions,
  ForeignKeyConstraint,
  DataTransformConfig,
  BackfillConfig,
  ColumnDefinition,
} from '../types';

/**
 * Service for managing table operations during database migrations
 */
@Injectable()
export class TableOperationsService {
  private readonly logger = new Logger(TableOperationsService.name);

  /**
   * Creates a table with default columns and indexes
   */
  async createTableWithDefaults(
    queryInterface: QueryInterface,
    tableName: string,
    attributes: Record<string, any>,
    options: TableOperationOptions = {},
    transaction?: Transaction,
  ): Promise<void> {
    const { indexes = [], paranoid = false, timestamps = true, comment } = options;

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

    this.logger.log(`Created table ${tableName} with ${indexes.length} indexes`);
  }

  /**
   * Performs a safe table alteration with rollback capability
   */
  async safeAlterTable(
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

      this.logger.log(`Successfully altered table ${tableName}`);
    } catch (error) {
      // Rollback if we created the transaction
      if (!transaction) {
        await t.rollback();
      }
      this.logger.error(`Failed to alter table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Drops a table safely with existence check and cascade options
   */
  async dropTableSafely(
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
      const tableExists = await this.checkTableExists(queryInterface, tableName);
      if (!tableExists) {
        this.logger.warn(`Table ${tableName} does not exist, skipping drop`);
        return;
      }
    }

    // Drop table
    await queryInterface.dropTable(tableName, {
      cascade,
      transaction,
    });

    this.logger.log(`Dropped table ${tableName}`);
  }

  /**
   * Renames a table with all dependencies
   */
  async renameTableWithDependencies(
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
        WHERE sequence_name LIKE :pattern
      `,
        {
          replacements: { pattern: `${oldTableName}%` },
          transaction,
        },
      );

      for (const seq of sequences as Array<{ sequence_name: string }>) {
        const newSeqName = seq.sequence_name.replace(oldTableName, newTableName);
        await sequelize.query(
          `ALTER SEQUENCE "${seq.sequence_name}" RENAME TO "${newSeqName}"`,
          { transaction },
        );
      }
    }

    this.logger.log(`Renamed table ${oldTableName} to ${newTableName}`);
  }

  /**
   * Adds a column with validation and default value population
   */
  async addColumnWithDefaults(
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
        throw new Error(`Column ${columnName} has ${count} NULL values but is NOT NULL`);
      }
    }

    this.logger.log(`Added column ${columnName} to table ${tableName}`);
  }

  /**
   * Removes a column safely with data preservation option
   */
  async removeColumnSafely(
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
      const columnExists = await this.checkColumnExists(queryInterface, tableName, columnName);
      if (!columnExists) {
        this.logger.warn(`Column ${columnName} does not exist in ${tableName}, skipping removal`);
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

    this.logger.log(`Removed column ${columnName} from table ${tableName}`);
  }

  /**
   * Modifies a column type with data conversion
   */
  async modifyColumnType(
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
      await sequelize.query(`UPDATE "${tableName}" SET "${tempColumnName}" = ${castExpression}`, {
        transaction,
      });

      // Drop old column
      await queryInterface.removeColumn(tableName, columnName, { transaction });

      // Rename temp column to original name
      await queryInterface.renameColumn(tableName, tempColumnName, columnName, { transaction });
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
      this.logger.log(
        `Column ${columnName} conversion completed. NULL count: ${(results[0] as { count: number }).count}`,
      );
    }

    this.logger.log(`Modified column ${columnName} type in table ${tableName}`);
  }

  /**
   * Renames a column across all database systems
   */
  async renameColumnUniversal(
    queryInterface: QueryInterface,
    tableName: string,
    oldColumnName: string,
    newColumnName: string,
    transaction?: Transaction,
  ): Promise<void> {
    await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });

    this.logger.log(`Renamed column ${oldColumnName} to ${newColumnName} in table ${tableName}`);
  }

  /**
   * Adds a foreign key constraint with cascading options
   */
  async addForeignKeyConstraint(
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

    this.logger.log(`Added foreign key constraint ${constraint.name} to table ${tableName}`);
  }

  /**
   * Adds a check constraint with custom validation
   */
  async addCheckConstraint(
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

    this.logger.log(`Added check constraint ${constraintName} to table ${tableName}`);
  }

  /**
   * Removes a constraint with existence check
   */
  async removeConstraintSafely(
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
      const constraintExists = await this.checkConstraintExists(
        queryInterface,
        tableName,
        constraintName,
      );
      if (!constraintExists) {
        this.logger.warn(
          `Constraint ${constraintName} does not exist in ${tableName}, skipping removal`,
        );
        return;
      }
    }

    const cascadeClause = cascade ? 'CASCADE' : '';
    await sequelize.query(
      `ALTER TABLE "${tableName}" DROP CONSTRAINT "${constraintName}" ${cascadeClause}`,
      { transaction },
    );

    this.logger.log(`Removed constraint ${constraintName} from table ${tableName}`);
  }

  /**
   * Adds a unique constraint on multiple columns
   */
  async addUniqueConstraint(
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

    this.logger.log(`Added unique constraint ${constraintName} to table ${tableName}`);
  }

  /**
   * Replaces a constraint (drops old, creates new)
   */
  async replaceConstraint(
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
      await this.removeConstraintSafely(queryInterface, tableName, oldConstraintName, {}, t);

      // Add new constraint
      if (newConstraint.type === 'foreign key') {
        await this.addForeignKeyConstraint(
          queryInterface,
          tableName,
          newConstraint as ForeignKeyConstraint,
          t,
        );
      } else if (newConstraint.type === 'check') {
        await this.addCheckConstraint(
          queryInterface,
          tableName,
          newConstraint.name,
          newConstraint.checkExpression || '',
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

      this.logger.log(
        `Replaced constraint ${oldConstraintName} with ${newConstraint.name} in table ${tableName}`,
      );
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      this.logger.error(`Failed to replace constraint ${oldConstraintName}:`, error);
      throw error;
    }
  }

  /**
   * Performs batch data transformation with progress tracking
   */
  async batchDataTransform<T = any>(
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

    this.logger.log(`Starting batch data transformation for ${sourceTable}...`);

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
              .map(([key]) => `"${key}" = :${key}`)
              .join(', ');

            if (setClause) {
              await sequelize.query(`UPDATE "${targetTable}" SET ${setClause} WHERE id = :id`, {
                replacements: { ...transformedRow, id: (row as { id: any }).id },
                transaction,
              });
              totalModified++;
            }

            totalProcessed++;
          } catch (error) {
            errors++;
            if (onError) {
              onError(error as Error, row);
            } else {
              this.logger.error(`Error transforming row:`, error);
            }
          }
        }

        await transaction.commit();

        offset += batchSize;
        this.logger.log(`Processed ${totalProcessed} records...`);

        // Small delay to prevent overwhelming the database
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        await transaction.rollback();
        this.logger.error(`Error processing batch at offset ${offset}:`, error);
        throw error;
      }
    }

    this.logger.log(
      `Batch transformation complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`,
    );

    return { totalProcessed, totalModified, errors };
  }

  /**
   * Migrates data from one table to another with mapping
   */
  async migrateDataBetweenTables(
    queryInterface: QueryInterface,
    sourceTable: string,
    targetTable: string,
    columnMapping: Record<string, string>,
    options: {
      batchSize?: number;
      where?: Record<string, any>;
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
          .map(([key, val]) => `"${key}" = '${String(val)}'`)
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
          const values = Object.keys(columnMapping).map((key) => (row as Record<string, any>)[key]);
          const placeholders = targetColumns.map((_, i) => `:val${i}`);

          await sequelize.query(
            `INSERT INTO "${targetTable}" (${targetColumns.join(', ')}) VALUES (${placeholders.join(', ')})`,
            {
              replacements: values.reduce((acc, val, i) => ({ ...acc, [`val${i}`]: val }), {}),
              transaction,
            },
          );
        }

        await transaction.commit();

        offset += batchSize;
        this.logger.log(`Migrated ${offset} records...`);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    // Delete source data if requested
    if (deleteSource) {
      await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
    }

    this.logger.log(`Data migration from ${sourceTable} to ${targetTable} completed`);
  }

  /**
   * Copies table data with optional filtering
   */
  async copyTableData(
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

    this.logger.log(`Copied data from ${sourceTable} to ${targetTable}`);
  }

  /**
   * Validates data integrity after migration
   */
  async validateDataIntegrity(
    queryInterface: QueryInterface,
    tableName: string,
    validations: Array<{
      column: string;
      rule: string;
      errorMessage?: string;
    }>,
  ): Promise<Array<{ column: string; passed: boolean; failedCount: number; message: string }>> {
    const sequelize = queryInterface.sequelize;
    const results: Array<{
      column: string;
      passed: boolean;
      failedCount: number;
      message: string;
    }> = [];

    for (const validation of validations) {
      const { column, rule, errorMessage } = validation;

      const [queryResults] = await sequelize.query(
        `SELECT COUNT(*) as count FROM "${tableName}" WHERE NOT (${rule})`,
      );

      const failedCount = (queryResults[0] as { count: number }).count;
      const passed = failedCount === 0;

      results.push({
        column,
        passed,
        failedCount,
        message: errorMessage || `Column ${column} validation: ${rule}`,
      });

      if (!passed) {
        this.logger.warn(
          `Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`,
        );
      }
    }

    return results;
  }

  /**
   * Backfills missing data using a strategy
   */
  async backfillMissingData(
    queryInterface: QueryInterface,
    tableName: string,
    columnName: string,
    strategy: 'default' | 'derived' | 'lookup' | 'function',
    config: BackfillConfig,
  ): Promise<{ rowsUpdated: number }> {
    const sequelize = queryInterface.sequelize;
    let query: string;
    let rowsUpdated = 0;

    switch (strategy) {
      case 'default': {
        query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
        const [defaultResult] = await sequelize.query(query, {
          replacements: { defaultValue: config.defaultValue },
        });
        rowsUpdated = (defaultResult[0] as { rowCount?: number }).rowCount || 0;
        break;
      }

      case 'derived': {
        query = `UPDATE "${tableName}" SET "${columnName}" = ${config.expression} WHERE "${columnName}" IS NULL`;
        const [derivedResult] = await sequelize.query(query);
        rowsUpdated = (derivedResult[0] as { rowCount?: number }).rowCount || 0;
        break;
      }

      case 'lookup': {
        query = `
          UPDATE "${tableName}" t
          SET "${columnName}" = l."${config.lookupValue}"
          FROM "${config.lookupTable}" l
          WHERE t."${config.lookupKey}" = l."${config.lookupKey}"
          AND t."${columnName}" IS NULL
        `;
        const [lookupResult] = await sequelize.query(query);
        rowsUpdated = (lookupResult[0] as { rowCount?: number }).rowCount || 0;
        break;
      }

      case 'function': {
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
    }

    // Get count of updated rows
    if (strategy !== 'function') {
      const [countResult] = await sequelize.query(
        `SELECT COUNT(*) as count FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`,
      );
      rowsUpdated = (countResult[0] as any).count;
    }

    this.logger.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);

    return { rowsUpdated };
  }

  /**
   * Checks if a table exists in the database
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table to check
   * @returns Promise that resolves with boolean indicating if table exists
   */
  async checkTableExists(
    queryInterface: QueryInterface,
    tableName: string,
  ): Promise<boolean> {
    try {
      await queryInterface.describeTable(tableName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a column exists in a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param columnName - Name of the column to check
   * @returns Promise that resolves with boolean indicating if column exists
   */
  async checkColumnExists(
    queryInterface: QueryInterface,
    tableName: string,
    columnName: string,
  ): Promise<boolean> {
    try {
      const tableDescription = await queryInterface.describeTable(tableName);
      return columnName in tableDescription;
    } catch {
      return false;
    }
  }

  /**
   * Checks if an index exists on a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param indexName - Name of the index to check
   * @returns Promise that resolves with boolean indicating if index exists
   */
  async checkIndexExists(
    queryInterface: QueryInterface,
    tableName: string,
    indexName: string,
  ): Promise<boolean> {
    try {
      const indexes = await queryInterface.showIndex(tableName);
      return indexes.some((index: any) => index.name === indexName);
    } catch {
      return false;
    }
  }

  /**
   * Checks if a constraint exists on a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param constraintName - Name of the constraint to check
   * @returns Promise that resolves with boolean indicating if constraint exists
   */
  async checkConstraintExists(
    queryInterface: QueryInterface,
    tableName: string,
    constraintName: string,
  ): Promise<boolean> {
    const sequelize = queryInterface.sequelize;

    try {
      const [results] = await sequelize.query(
        `
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = :tableName
        AND constraint_name = :constraintName
        AND table_schema = current_schema()
        `,
        {
          replacements: { tableName, constraintName },
        },
      );

      return results.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Gets the row count for a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @returns Promise that resolves with the row count
   */
  async getTableRowCount(
    queryInterface: QueryInterface,
    tableName: string,
  ): Promise<number> {
    const sequelize = queryInterface.sequelize;

    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}"`,
    );

    return (results[0] as any).count;
  }

  /**
   * Ensures the migration history table exists
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @returns Promise that resolves when table is ensured
   */
  async ensureMigrationHistoryTable(
    queryInterface: QueryInterface,
  ): Promise<void> {
    const tableExists = await this.checkTableExists(queryInterface, 'MigrationHistory');

    if (!tableExists) {
      await this.createTableWithDefaults(
        queryInterface,
        'MigrationHistory',
        {
          name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
          executedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
          executionTime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
          rowsAffected: { type: DataTypes.INTEGER, allowNull: true },
          description: { type: DataTypes.TEXT, allowNull: true },
          checksum: { type: DataTypes.STRING(64), allowNull: true },
        },
        {
          indexes: [
            { fields: ['name'], unique: true },
            { fields: ['executedAt'] },
          ],
        },
      );
    }
  }
}
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
    }

    this.logger.log(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);
    return { rowsUpdated };
  }

  /**
   * Checks if a table exists in the database
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table to check
   * @returns Promise that resolves with boolean indicating if table exists
   */
  async checkTableExists(
    queryInterface: QueryInterface,
    tableName: string,
  ): Promise<boolean> {
    try {
      await queryInterface.describeTable(tableName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a column exists in a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param columnName - Name of the column to check
   * @returns Promise that resolves with boolean indicating if column exists
   */
  async checkColumnExists(
    queryInterface: QueryInterface,
    tableName: string,
    columnName: string,
  ): Promise<boolean> {
    try {
      const tableDescription = await queryInterface.describeTable(tableName);
      return columnName in tableDescription;
    } catch {
      return false;
    }
  }

  /**
   * Checks if an index exists on a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param indexName - Name of the index to check
   * @returns Promise that resolves with boolean indicating if index exists
   */
  async checkIndexExists(
    queryInterface: QueryInterface,
    tableName: string,
    indexName: string,
  ): Promise<boolean> {
    try {
      const indexes = await queryInterface.showIndex(tableName);
      return indexes.some((index: any) => index.name === indexName);
    } catch {
      return false;
    }
  }

  /**
   * Checks if a constraint exists on a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @param constraintName - Name of the constraint to check
   * @returns Promise that resolves with boolean indicating if constraint exists
   */
  async checkConstraintExists(
    queryInterface: QueryInterface,
    tableName: string,
    constraintName: string,
  ): Promise<boolean> {
    const sequelize = queryInterface.sequelize;

    try {
      const [results] = await sequelize.query(
        `
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = :tableName
        AND constraint_name = :constraintName
        AND table_schema = current_schema()
        `,
        {
          replacements: { tableName, constraintName },
        },
      );

      return results.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Gets the row count for a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table
   * @returns Promise that resolves with the row count
   */
  async getTableRowCount(
    queryInterface: QueryInterface,
    tableName: string,
  ): Promise<number> {
    const sequelize = queryInterface.sequelize;

    const [results] = await sequelize.query(
      `SELECT COUNT(*) as count FROM "${tableName}"`,
    );

    return (results[0] as any).count;
  }

  /**
   * Ensures the migration history table exists
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @returns Promise that resolves when table is ensured
   */
  async ensureMigrationHistoryTable(
    queryInterface: QueryInterface,
  ): Promise<void> {
    const tableExists = await this.checkTableExists(queryInterface, 'MigrationHistory');

    if (!tableExists) {
      await this.createTableWithDefaults(
        queryInterface,
        'MigrationHistory',
        {
          name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
          executedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
          executionTime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
          rowsAffected: { type: DataTypes.INTEGER, allowNull: true },
          description: { type: DataTypes.TEXT, allowNull: true },
          checksum: { type: DataTypes.STRING(64), allowNull: true },
        },
        {
          indexes: [
            { fields: ['name'], unique: true },
            { fields: ['executedAt'] },
          ],
        },
      );
    }
  }
}
