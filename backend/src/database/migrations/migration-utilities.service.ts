/**
 * Enterprise-ready Database Migration Utilities Service
 *
 * Comprehensive service for Sequelize migrations, schema evolution, data migrations,
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
import { Injectable, Logger } from '@nestjs/common';
import { TableOperationsService } from './table-operations/index';

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
 * Migration Utilities Service
 *
 * Provides comprehensive database migration utilities with proper dependency injection
 * and integration with modular table operations service.
 */
@Injectable()
export class MigrationUtilitiesService {
  private readonly logger = new Logger(MigrationUtilitiesService.name);

  constructor(
    private readonly tableOperationsService: TableOperationsService,
  ) {}

  /**
   * Creates a comprehensive table with all standard fields and configurations
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table to create
   * @param attributes - Column definitions for the table
   * @param options - Additional table options (indexes, paranoid, etc.)
   * @param transaction - Optional transaction for atomic operations
   * @returns Promise that resolves when table is created
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
    return this.tableOperationsService.createTableWithDefaults(
      queryInterface,
      tableName,
      attributes,
      options,
      transaction,
    );
  }

  /**
   * Safely alters a table with comprehensive validation and rollback support
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table to alter
   * @param alterations - Alteration operations to perform
   * @param transaction - Optional transaction for atomic operations
   * @returns Promise that resolves when table is altered
   */
  async safeAlterTable(
    queryInterface: QueryInterface,
    tableName: string,
    alterations: any,
    transaction?: Transaction,
  ): Promise<void> {
    return this.tableOperationsService.safeAlterTable(
      queryInterface,
      tableName,
      alterations,
      transaction,
    );
  }

  /**
   * Migrates data between tables with transformation and validation
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param config - Data migration configuration
   * @returns Promise that resolves when data migration is complete
   */
  async migrateDataBetweenTables(
    queryInterface: QueryInterface,
    config: DataTransformConfig,
  ): Promise<void> {
    return this.tableOperationsService.migrateDataBetweenTables(
      queryInterface,
      config,
    );
  }

  /**
   * Validates data integrity after migration operations
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param tableName - Name of the table to validate
   * @param validations - Validation rules to apply
   * @returns Promise that resolves with validation results
   */
  async validateDataIntegrity(
    queryInterface: QueryInterface,
    tableName: string,
    validations: any,
  ): Promise<any> {
    return this.tableOperationsService.validateDataIntegrity(
      queryInterface,
      tableName,
      validations,
    );
  }

  /**
   * Backfills missing data in a table
   *
   * @param queryInterface - Sequelize QueryInterface instance
   * @param config - Backfill configuration
   * @returns Promise that resolves when backfill is complete
   */
  async backfillMissingData(
    queryInterface: QueryInterface,
    config: any,
  ): Promise<void> {
    return this.tableOperationsService.backfillMissingData(
      queryInterface,
      config,
    );
  }

  // Additional methods will be added here as we extract more functionality
  // from the utility functions file
}