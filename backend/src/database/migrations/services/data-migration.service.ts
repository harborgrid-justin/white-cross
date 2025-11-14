/**
 * @fileoverview Data Migration Service
 * @module database/migrations/services
 * @description Service for handling data migration and transformation operations
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { QueryInterface, Sequelize, Transaction } from 'sequelize';
import { DataTransformConfig, SeedDataConfig } from '../types/migration-utilities.types';

@Injectable()
export class DataMigrationService extends BaseService {
  constructor() {
    super("DataMigrationService");
  }

  /**
   * Performs batch data transformation with progress tracking
   */
  async batchDataTransform(
    queryInterface: QueryInterface,
    config: DataTransformConfig,
  ): Promise<{
    totalProcessed: number;
    totalModified: number;
    errors: number;
  }> {
    const {
      sourceTable,
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

    this.logInfo(`Starting batch data transformation for ${sourceTable}...`);

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

            // Update row in source table
            const setClause = Object.entries(transformedRow)
              .filter(([key]) => key !== 'id')
              .map(([key, val]) => `"${key}" = :${key}`)
              .join(', ');

            if (setClause) {
              await sequelize.query(
                `UPDATE "${sourceTable}" SET ${setClause} WHERE id = :id`,
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
        this.logInfo(`Migrated ${offset} records...`);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

    // Delete source data if requested
    if (deleteSource) {
      await sequelize.query(`DELETE FROM "${sourceTable}" ${whereClause}`);
    }

    this.logInfo(`Data migration from ${sourceTable} to ${targetTable} completed`);
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

    this.logInfo(`Copied data from ${sourceTable} to ${targetTable}`);
  }

  /**
   * Seeds data with upsert capability
   */
  async seedDataWithUpsert(
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

    this.logInfo(`Seeded ${data.length} rows into ${table}`);
  }

  /**
   * Generates seed data from existing data
   */
  async generateSeedFromExisting(
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

    this.logInfo(`Generated ${seeds.length} seed records from ${tableName}`);
    return seeds;
  }

  /**
   * Clears seed data from tables
   */
  async clearSeedData(
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

      this.logInfo(`Cleared seed data from ${table}`);
    }
  }

  /**
   * Creates test fixtures with factories
   */
  async createTestFixtures(
    queryInterface: QueryInterface,
    fixtures: Array<{
      model: string;
      count: number;
      factory: (index: number) => Record<string, any>;
    }>,
  ): Promise<void> {
    for (const fixture of fixtures) {
      const { model, count, factory } = fixture;
      const data = [];

      for (let i = 0; i < count; i++) {
        data.push(factory(i));
      }

      await this.seedDataWithUpsert(queryInterface, {
        table: model,
        data,
      });

      this.logInfo(`Created ${count} fixtures for ${model}`);
    }
  }
}
