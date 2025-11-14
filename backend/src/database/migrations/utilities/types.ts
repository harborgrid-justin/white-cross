/**
 * Type definitions for migration utilities
 *
 * Comprehensive type definitions for database migrations, schema operations,
 * data transformations, and migration management.
 *
 * @module database/migrations/utilities/types
 */

import { QueryInterface, Transaction } from 'sequelize';

/**
 * Migration table definition interface
 */
export interface MigrationTableDefinition {
  tableName: string;
  attributes: Record<string, unknown>;
  options?: Record<string, unknown>;
}

/**
 * Column definition interface for migrations
 */
export interface ColumnDefinition {
  type: unknown;
  allowNull?: boolean;
  defaultValue?: unknown;
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

/**
 * Index definition interface
 */
export interface IndexDefinition {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: string;
  where?: unknown;
  concurrently?: boolean;
}

/**
 * Constraint definition interface
 */
export interface ConstraintDefinition {
  type: 'check' | 'unique' | 'primary key' | 'foreign key';
  fields?: string[];
  name?: string;
  where?: unknown;
  references?: {
    table: string;
    field: string;
  };
  onDelete?: string;
  onUpdate?: string;
}

/**
 * Migration status tracking
 */
export interface MigrationStatus {
  name: string;
  status: 'pending' | 'executed' | 'failed';
  executedAt?: Date;
  executionTime?: number;
  error?: string;
}

/**
 * Migration lock interface
 */
export interface MigrationLock {
  lockId: string;
  acquiredAt: Date;
  acquiredBy: string;
  expiresAt: Date;
}

/**
 * Schema comparison results
 */
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

/**
 * Seed data configuration
 */
export interface SeedDataConfig {
  table: string;
  data: Record<string, unknown>[];
  updateOnDuplicate?: string[];
  transaction?: Transaction;
}

/**
 * Data transformation configuration
 */
export interface DataTransformConfig<T = unknown> {
  sourceTable: string;
  targetTable?: string;
  batchSize?: number;
  where?: unknown;
  transform: (row: T) => T | Promise<T>;
  validate?: (row: T) => boolean | Promise<boolean>;
  onError?: (error: Error, row: T) => void;
}

/**
 * Migration dependency tracking
 */
export interface MigrationDependency {
  name: string;
  dependsOn: string[];
  executed: boolean;
}

/**
 * Test fixture definition
 */
export interface FixtureDefinition {
  model: string;
  count: number;
  factory: (index: number) => Record<string, unknown>;
}

/**
 * Migration execution statistics
 */
export interface MigrationExecutionResult {
  name: string;
  status: 'success' | 'failed' | 'skipped';
  executionTime: number;
  error?: Error;
}

/**
 * Data transformation statistics
 */
export interface DataTransformResult {
  totalProcessed: number;
  totalModified: number;
  errors: number;
}

/**
 * Migration performance analysis
 */
export interface MigrationPerformanceAnalysis {
  executionTime: number;
  estimatedTime?: number;
  rowCount?: number;
  recommendations: string[];
  queryStats: {
    totalQueries: number;
    slowQueries: number;
  };
}

/**
 * Rollback point configuration
 */
export interface RollbackPointConfig {
  name: string;
  tables: string[];
  createdAt: Date;
  backupInfo: Record<string, string>;
}

/**
 * Schema snapshot structure
 */
export interface SchemaSnapshot {
  version: string;
  createdAt: Date;
  tables: Array<{
    name: string;
    columns: unknown[];
  }>;
}

/**
 * Migration validation result
 */
export interface ValidationResult {
  column: string;
  passed: boolean;
  failedCount: number;
  message: string;
}

/**
 * Backfill configuration
 */
export interface BackfillConfig {
  defaultValue?: unknown;
  expression?: string;
  lookupTable?: string;
  lookupKey?: string;
  lookupValue?: string;
  customFunction?: (row: unknown) => unknown;
}

/**
 * Migration batch execution options
 */
export interface BatchMigrationOptions {
  stopOnError?: boolean;
  rollbackOnError?: boolean;
  parallelExecution?: boolean;
}

/**
 * Migration function definition
 */
export interface MigrationFunction {
  name: string;
  up: (qi: QueryInterface, transaction: Transaction) => Promise<void>;
  down?: (qi: QueryInterface, transaction: Transaction) => Promise<void>;
}

/**
 * Zero-downtime migration options
 */
export interface ZeroDowntimeOptions {
  populateFunction?: (queryInterface: QueryInterface) => Promise<void>;
  batchSize?: number;
  verifyUnused?: boolean;
  waitPeriod?: number;
}

/**
 * Column modification options
 */
export interface ColumnModificationOptions {
  castUsing?: string;
  validate?: boolean;
  tempColumn?: boolean;
  castExpression?: string;
}

/**
 * Table creation options
 */
export interface TableCreationOptions {
  indexes?: IndexDefinition[];
  paranoid?: boolean;
  timestamps?: boolean;
  underscored?: boolean;
  comment?: string;
}

/**
 * Safe table alteration function type
 */
export type TableAlterationFunction = (
  qi: QueryInterface,
  transaction: Transaction
) => Promise<void>;

/**
 * Migration analysis options
 */
export interface MigrationAnalysisOptions {
  sampleSize?: number;
  dryRun?: boolean;
  tableName?: string;
}

/**
 * Rollback test result
 */
export interface RollbackTestResult {
  success: boolean;
  error?: Error;
}

/**
 * Foreign key constraint definition
 */
export interface ForeignKeyConstraint {
  fields: string[];
  name: string;
  references: { table: string; field: string };
  onDelete?: string;
  onUpdate?: string;
}

/**
 * Constraint replacement definition
 */
export interface ConstraintReplacement {
  fields: string[];
  name: string;
  type: 'foreign key' | 'unique' | 'check';
  references?: { table: string; field: string };
  onDelete?: string;
  onUpdate?: string;
  checkExpression?: string;
}

/**
 * Data migration options
 */
export interface DataMigrationOptions {
  batchSize?: number;
  where?: unknown;
  deleteSource?: boolean;
}

/**
 * Table copy options
 */
export interface TableCopyOptions {
  where?: string;
  columns?: string[];
  limit?: number;
}

/**
 * Seed data clear options
 */
export interface SeedClearOptions {
  cascade?: boolean;
  where?: Record<string, unknown>;
}

/**
 * Rollback restore options
 */
export interface RollbackRestoreOptions {
  verify?: boolean;
  keepBackup?: boolean;
}
