/**
 * @fileoverview Column Operations Service
 * @module database/migrations/services
 * @description Service for handling column management operations
 */

import { Injectable, Logger } from '@nestjs/common';
import { QueryInterface, Sequelize, Transaction } from 'sequelize';
import { ColumnDefinition } from '../types/migration-utilities.types';

@Injectable()
export class ColumnOperationsService {
  private readonly logger = new Logger(ColumnOperationsService.name);

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
      const count = (results[0] as any).count;
      if (count > 0 && !definition.allowNull) {
        throw new Error(
          `Column ${columnName} has ${count} NULL values but is NOT NULL`,
        );
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
      const columnExists = await this.checkColumnExists(
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
      this.logger.log(`Column ${columnName} conversion completed. NULL count: ${(results[0] as any).count}`);
    }

    this.logger.log(`Modified column type for ${columnName} in table ${tableName}`);
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
    await queryInterface.renameColumn(
      tableName,
      oldColumnName,
      newColumnName,
      { transaction },
    );

    this.logger.log(`Renamed column ${oldColumnName} to ${newColumnName} in table ${tableName}`);
  }

  /**
   * Checks if a column exists in a table
   */
  private async checkColumnExists(
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
}
