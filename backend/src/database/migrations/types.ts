/**
 * Migration Utilities Types
 *
 * Type definitions for database migration utilities
 * in the White Cross healthcare platform.
 */

/**
 * Migration table definition
 */
export interface MigrationTableDefinition {
  tableName: string;
  attributes: Record<string, any>;
  options?: Record<string, any>;
}

/**
 * Column definition for migrations
 */
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

/**
 * Foreign key constraint definition
 */
export interface ForeignKeyDefinition {
  name: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  onUpdate?: string;
  onDelete?: string;
}

/**
 * Check constraint definition
 */
export interface CheckConstraintDefinition {
  name: string;
  tableName: string;
  condition: string;
}

/**
 * Unique constraint definition
 */
export interface UniqueConstraintDefinition {
  name: string;
  tableName: string;
  columns: string[];
}

/**
 * Data transformation options
 */
export interface DataTransformationOptions<T = any> {
  batchSize?: number;
  concurrency?: number;
  validateResults?: boolean;
  transformFunction: (data: T) => T | Promise<T>;
  filterCondition?: (data: T) => boolean;
}

/**
 * Migration execution record
 */
export interface MigrationExecutionRecord {
  id: string;
  name: string;
  executedAt: Date;
  duration: number;
  success: boolean;
  error?: string;
  checksum: string;
}

/**
 * Schema version information
 */
export interface SchemaVersion {
  version: string;
  appliedAt: Date;
  description: string;
}

/**
 * Migration context
 */
export interface MigrationContext {
  queryInterface: any;
  sequelize: any;
  transaction?: any;
  logger?: any;
}

/**
 * Data integrity validation result
 */
export interface DataIntegrityResult {
  tableName: string;
  totalRows: number;
  invalidRows: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Table operation options
 */
export interface TableOperationOptions {
  indexes?: IndexDefinition[];
  paranoid?: boolean;
  timestamps?: boolean;
  underscored?: boolean;
  comment?: string;
}

/**
 * Index definition for table creation
 */
export interface IndexDefinition {
  fields: string[];
  name?: string;
  unique?: boolean;
  concurrently?: boolean;
  where?: string;
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
 * Data transformation configuration
 */
export interface DataTransformConfig<T = any> {
  sourceTable: string;
  targetTable?: string;
  batchSize?: number;
  where?: Record<string, any>;
  transform: (row: T) => Promise<T> | T;
  validate?: (row: T) => Promise<boolean> | boolean;
  onError?: (error: Error, row: T) => void;
}

/**
 * Backfill configuration
 */
export interface BackfillConfig {
  defaultValue?: any;
  expression?: string;
  lookupTable?: string;
  lookupKey?: string;
  lookupValue?: string;
  customFunction?: (row: any) => any;
}
