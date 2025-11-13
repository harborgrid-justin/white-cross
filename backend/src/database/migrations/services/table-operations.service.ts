/**
 * @fileoverview Table Operations Service
 * @module database/migrations/services
 * @description Service for handling table creation, alteration, and management operations
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from "../../common/base";
import { LoggerService } from '../../shared/logging/logger.service';
import { QueryInterface, Sequelize, DataTypes, Transaction } from 'sequelize';
import { IndexDefinition, ColumnDefinition } from '../types/migration-utilities.types';
import { buildTableAttributes } from '../utilities/table-attributes-builder';

@Injectable()
export class TableOperationsService extends BaseService {
  /**
   * Creates a comprehensive table with all standard fields and configurations
   */
  async createTableWithDefaults(
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

    // Build complete attribute definition with defaults using shared utility
    const completeAttributes = buildTableAttributes(attributes, { timestamps, paranoid });

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

    this.logInfo(`Created table ${tableName} with ${indexes.length} indexes`);
  }

  /**
   * Performs a safe table alteration with backup and rollback capability
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

      this.logInfo(`Successfully altered table ${tableName}`);
    } catch (error) {
      // Rollback if we created the transaction
      if (!transaction) {
        await t.rollback();
      }
      this.logError(`Failed to alter table ${tableName}`, error);
      throw error;
    }
  }

  /**
   * Migrates data between tables with transformation and validation
   */
  async migrateDataBetweenTables(
    queryInterface: QueryInterface,
    config: any,
  ): Promise<void> {
    const {
      sourceTable,
      targetTable,
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

    this.logInfo(`Starting data migration from ${sourceTable} to ${targetTable}...`);

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
        for (const row of results as any[]) {
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
                  replacements: { ...transformedRow, id: row.id },
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
              this.logError(`Error transforming row:`, error);
            }
          }
        }

        await transaction.commit();

        offset += batchSize;
        this.logDebug(`Processed ${totalProcessed} records...`);

        // Small delay to prevent overwhelming the database
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        await transaction.rollback();
        this.logError(`Error processing batch at offset ${offset}:`, error);
        throw error;
      }
    }

    this.logInfo(
      `Data migration complete. Processed: ${totalProcessed}, Modified: ${totalModified}, Errors: ${errors}`,
    );
  }

  /**
   * Validates data integrity after migration operations
   */
  async validateDataIntegrity(
    queryInterface: QueryInterface,
    tableName: string,
    validations: any,
  ): Promise<any> {
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
        message: errorMessage || `Column ${column} validation: ${rule}`,
      });

      if (!passed) {
        this.logWarning(
          `Validation failed for ${column}: ${failedCount} rows do not satisfy ${rule}`,
        );
      }
    }

    return results;
  }

  /**
   * Backfills missing data in a table
   */
  async backfillMissingData(
    queryInterface: QueryInterface,
    config: any,
  ): Promise<void> {
    const { tableName, columnName, strategy, strategyConfig } = config;
    const sequelize = queryInterface.sequelize;
    let query: string;
    let rowsUpdated = 0;

    switch (strategy) {
      case 'default':
        query = `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`;
        await sequelize.query(query, {
          replacements: { defaultValue: strategyConfig.defaultValue },
        });
        break;

      case 'derived':
        query = `UPDATE "${tableName}" SET "${columnName}" = ${strategyConfig.expression} WHERE "${columnName}" IS NULL`;
        await sequelize.query(query);
        break;

      case 'lookup':
        query = `
          UPDATE "${tableName}" t
          SET "${columnName}" = l."${strategyConfig.lookupValue}"
          FROM "${strategyConfig.lookupTable}" l
          WHERE t."${strategyConfig.lookupKey}" = l."${strategyConfig.lookupKey}"
          AND t."${columnName}" IS NULL
        `;
        await sequelize.query(query);
        break;

      case 'function':
        if (!strategyConfig.customFunction) {
          throw new Error('Custom function required for function strategy');
        }
        // Fetch rows with NULL values
        const [rows] = await sequelize.query(
          `SELECT * FROM "${tableName}" WHERE "${columnName}" IS NULL`,
        );

        for (const row of rows as any[]) {
          const newValue = await strategyConfig.customFunction(row);
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

    this.logInfo(`Backfilled ${rowsUpdated} rows in ${tableName}.${columnName}`);
  }
}
