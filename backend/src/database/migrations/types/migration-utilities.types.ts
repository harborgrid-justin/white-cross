/**
 * @fileoverview Migration Utilities Types
 * @module database/migrations/types
 * @description Type definitions for database migration utilities
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
  transaction?: any;
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

export interface MigrationExecutionResult {
  name: string;
  status: 'success' | 'failed' | 'skipped';
  executionTime: number;
  error?: Error;
}

export interface PerformanceAnalysis {
  executionTime: number;
  estimatedTime?: number;
  rowCount?: number;
  recommendations: string[];
  queryStats: {
    totalQueries: number;
    slowQueries: number;
  };
}

export interface RollbackPoint {
  name: string;
  tables: Record<string, string>;
  createdAt: Date;
}

export interface MigrationAnalysisOptions {
  sampleSize?: number;
  dryRun?: boolean;
  tableName?: string;
}

export interface BatchMigrationOptions {
  stopOnError?: boolean;
  rollbackOnError?: boolean;
  parallelExecution?: boolean;
}

export interface ZeroDowntimeOptions {
  populateFunction?: (queryInterface: any) => Promise<void>;
  batchSize?: number;
  verifyUnused?: boolean;
  waitPeriod?: number;
  castExpression?: string;
}

export interface RollbackOptions {
  verify?: boolean;
  keepBackup?: boolean;
}

export interface SeedGenerationOptions {
  where?: string;
  limit?: number;
  exclude?: string[];
}

export interface ClearSeedOptions {
  cascade?: boolean;
  where?: Record<string, any>;
}
