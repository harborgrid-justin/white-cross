/**
 * @fileoverview Migration Utilities Service
 * @module database/migrations
 * @description Main service orchestrating all database migration utilities
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { QueryInterface, Transaction } from 'sequelize';
import {
  MigrationTableDefinition,
  ColumnDefinition,
  IndexDefinition,
  ConstraintDefinition,
  MigrationStatus,
  MigrationLock,
  SchemaComparison,
  SeedDataConfig,
  DataTransformConfig,
  MigrationDependency,
  FixtureDefinition,
} from './types/migration-utilities.types';
import { TableOperationsService } from '@/services/table-operations.service';
import { ColumnOperationsService } from '@/services/column-operations.service';
import { DataMigrationService } from '@/services/data-migration.service';

@Injectable()
export class MigrationUtilitiesService extends BaseService {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly tableOperations: TableOperationsService,
    private readonly columnOperations: ColumnOperationsService,
    private readonly dataMigration: DataMigrationService,
  ) {
    super({
      serviceName: 'MigrationUtilitiesService',
      logger,
      enableAuditLogging: true,
    });
  }

  // Table Operations

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
    return this.tableOperations.createTableWithDefaults(
      queryInterface,
      tableName,
      attributes,
      options,
      transaction,
    );
  }

  /**
   * Safely alters a table with comprehensive validation and rollback support
   */
  async safeAlterTable(
    queryInterface: QueryInterface,
    tableName: string,
    alterations: (qi: QueryInterface, transaction: Transaction) => Promise<void>,
    transaction?: Transaction,
  ): Promise<void> {
    return this.tableOperations.safeAlterTable(
      queryInterface,
      tableName,
      alterations,
      transaction,
    );
  }

  // Column Operations

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
    return this.columnOperations.addColumnWithDefaults(
      queryInterface,
      tableName,
      columnName,
      definition,
      options,
      transaction,
    );
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
    return this.columnOperations.removeColumnSafely(
      queryInterface,
      tableName,
      columnName,
      options,
      transaction,
    );
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
    return this.columnOperations.modifyColumnType(
      queryInterface,
      tableName,
      columnName,
      newDefinition,
      options,
      transaction,
    );
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
    return this.columnOperations.renameColumnUniversal(
      queryInterface,
      tableName,
      oldColumnName,
      newColumnName,
      transaction,
    );
  }

  // Data Migration Operations

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
    return this.dataMigration.batchDataTransform(queryInterface, config);
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
    return this.dataMigration.migrateDataBetweenTables(
      queryInterface,
      sourceTable,
      targetTable,
      columnMapping,
      options,
    );
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
    return this.dataMigration.copyTableData(
      queryInterface,
      sourceTable,
      targetTable,
      options,
      transaction,
    );
  }

  /**
   * Seeds data with upsert capability
   */
  async seedDataWithUpsert(
    queryInterface: QueryInterface,
    config: SeedDataConfig,
  ): Promise<void> {
    return this.dataMigration.seedDataWithUpsert(queryInterface, config);
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
    return this.dataMigration.generateSeedFromExisting(
      queryInterface,
      tableName,
      options,
    );
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
    return this.dataMigration.clearSeedData(queryInterface, tables, options);
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
    return this.dataMigration.createTestFixtures(queryInterface, fixtures);
  }

  // Validation Operations

  /**
   * Validates data integrity after migration operations
   */
  async validateDataIntegrity(
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
    return this.tableOperations.validateDataIntegrity(
      queryInterface,
      tableName,
      validations,
    );
  }

  /**
   * Backfills missing data in a table
   */
  async backfillMissingData(
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
    return this.tableOperations.backfillMissingData(
      queryInterface,
      { tableName, columnName, strategy, strategyConfig: config },
    );
  }
}
