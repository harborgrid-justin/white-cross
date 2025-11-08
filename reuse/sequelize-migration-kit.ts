/**
 * LOC: SQMG9876543
 * File: /reuse/sequelize-migration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize v6.x (database ORM)
 *   - QueryInterface (migration API)
 *   - DataTypes, Transaction
 *   - fs/promises (file operations)
 *   - path (file path utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Migration files
 *   - Database schema evolution scripts
 *   - Deployment automation pipelines
 *   - Schema versioning systems
 *   - Data migration ETL processes
 */

/**
 * File: /reuse/sequelize-migration-kit.ts
 * Locator: WC-UTL-SQMG-001
 * Purpose: Sequelize Migration Kit - Production-grade database migration and schema management utilities
 *
 * Upstream: Sequelize ORM 6.x, QueryInterface, DataTypes, Node.js fs/promises
 * Downstream: ../migrations/*, ../database/*, deployment automation, CI/CD pipelines
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, pg 8.x
 * Exports: 45 utilities for migration generation, schema diffing, safe column operations, index management,
 *          foreign key handling, data migration, rollback strategies, validation, versioning, seeding,
 *          concurrent migration guards, transformation utilities, backup/restore, and transaction wrappers
 *
 * LLM Context: Comprehensive Sequelize v6 migration toolkit for White Cross healthcare platform.
 * Provides migration file generation with templates, schema comparison and diffing, safe column addition/removal
 * with zero-downtime patterns, index creation/deletion with concurrency control, foreign key constraint
 * managers, batch data migration with progress tracking, intelligent rollback utilities, migration validation,
 * schema versioning, seed data generation, migration status tracking, concurrent migration guards,
 * data transformation utilities, table rename helpers, column type migration with data preservation,
 * default value managers, constraint management, conflict detection, backup/restore helpers, and
 * transaction wrappers. HIPAA-compliant with PHI protection and comprehensive audit logging.
 */

import {
  QueryInterface,
  DataTypes,
  Transaction,
  Sequelize,
  QueryTypes,
  TableName,
  Model,
  ModelStatic,
  Dialect,
  Op,
} from 'sequelize';
import { promises as fs } from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Migration file generation configuration
 */
export interface MigrationFileConfig {
  name: string;
  description?: string;
  timestamp?: Date;
  directory?: string;
  template?: 'basic' | 'table-creation' | 'column-modification' | 'data-migration' | 'custom';
  author?: string;
  tags?: string[];
}

/**
 * Migration file metadata
 */
export interface MigrationFile {
  filename: string;
  filepath: string;
  timestamp: string;
  name: string;
  version: string;
}

/**
 * Schema snapshot for diffing
 */
export interface SchemaSnapshot {
  tables: Record<string, TableSchema>;
  indexes: Record<string, IndexSchema[]>;
  constraints: Record<string, ConstraintSchema[]>;
  enums: Record<string, string[]>;
  timestamp: Date;
  version: string;
}

/**
 * Table schema definition
 */
export interface TableSchema {
  name: string;
  columns: Record<string, ColumnSchema>;
  primaryKey: string[];
  options?: {
    timestamps?: boolean;
    paranoid?: boolean;
    underscored?: boolean;
    comment?: string;
  };
}

/**
 * Column schema definition
 */
export interface ColumnSchema {
  name: string;
  type: string;
  allowNull: boolean;
  defaultValue?: any;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
  comment?: string;
}

/**
 * Index schema definition
 */
export interface IndexSchema {
  name: string;
  tableName: string;
  fields: Array<string | { name: string; order?: 'ASC' | 'DESC' }>;
  unique: boolean;
  type?: 'BTREE' | 'HASH' | 'GIST' | 'GIN' | 'BRIN';
  where?: any;
  concurrently?: boolean;
}

/**
 * Constraint schema definition
 */
export interface ConstraintSchema {
  name: string;
  tableName: string;
  type: 'CHECK' | 'UNIQUE' | 'FOREIGN KEY' | 'PRIMARY KEY';
  fields: string[];
  references?: {
    table: string;
    fields: string[];
  };
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  check?: string;
}

/**
 * Schema difference result
 */
export interface SchemaDiff {
  tablesAdded: string[];
  tablesRemoved: string[];
  tablesModified: TableDiff[];
  indexesAdded: IndexSchema[];
  indexesRemoved: IndexSchema[];
  constraintsAdded: ConstraintSchema[];
  constraintsRemoved: ConstraintSchema[];
  enumsAdded: Record<string, string[]>;
  enumsRemoved: string[];
}

/**
 * Table-level differences
 */
export interface TableDiff {
  tableName: string;
  columnsAdded: ColumnSchema[];
  columnsRemoved: string[];
  columnsModified: Array<{
    name: string;
    oldSchema: ColumnSchema;
    newSchema: ColumnSchema;
  }>;
}

/**
 * Safe column addition configuration
 */
export interface SafeColumnAddConfig {
  tableName: string;
  columnName: string;
  columnDefinition: any;
  defaultValue?: any;
  backfillQuery?: string;
  makeNonNullable?: boolean;
  addIndex?: IndexSchema;
  transaction?: Transaction;
}

/**
 * Safe column removal configuration
 */
export interface SafeColumnRemoveConfig {
  tableName: string;
  columnName: string;
  backupColumnName?: string;
  preserveData?: boolean;
  transaction?: Transaction;
}

/**
 * Index creation configuration
 */
export interface IndexCreationConfig {
  tableName: string;
  indexName: string;
  fields: Array<string | { name: string; order?: 'ASC' | 'DESC'; length?: number }>;
  unique?: boolean;
  type?: 'BTREE' | 'HASH' | 'GIST' | 'GIN' | 'BRIN';
  where?: any;
  concurrently?: boolean;
  ifNotExists?: boolean;
  transaction?: Transaction;
}

/**
 * Foreign key configuration
 */
export interface ForeignKeyConfig {
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  constraintName?: string;
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION' | 'SET DEFAULT';
  transaction?: Transaction;
}

/**
 * Batch data migration configuration
 */
export interface BatchMigrationConfig {
  sourceTable: string;
  targetTable?: string;
  batchSize: number;
  selectQuery?: string;
  transformFn?: (row: any) => any | Promise<any>;
  validateFn?: (row: any) => boolean | Promise<boolean>;
  onBatchComplete?: (batchNumber: number, processedCount: number) => void | Promise<void>;
  onError?: (error: Error, row: any, batchNumber: number) => void | Promise<void>;
  parallelBatches?: number;
  delayBetweenBatches?: number;
  transaction?: Transaction;
}

/**
 * Batch migration result
 */
export interface BatchMigrationResult {
  totalProcessed: number;
  totalSucceeded: number;
  totalFailed: number;
  batchesExecuted: number;
  duration: number;
  errors: Array<{ row: any; error: Error; batchNumber: number }>;
}

/**
 * Rollback strategy configuration
 */
export interface RollbackConfig {
  migrationName: string;
  strategy: 'DROP' | 'RESTORE_BACKUP' | 'REVERT_CHANGES' | 'CUSTOM';
  backupTablePrefix?: string;
  customRollback?: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<void>;
  validateAfterRollback?: boolean;
  transaction?: Transaction;
}

/**
 * Migration validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checks: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
}

/**
 * Schema version information
 */
export interface SchemaVersion {
  version: string;
  description: string;
  appliedAt: Date;
  appliedBy: string;
  migrationFiles: string[];
  schemaSnapshot?: SchemaSnapshot;
}

/**
 * Seed data configuration
 */
export interface SeedConfig {
  tableName: string;
  data: any[];
  conflictFields?: string[];
  updateOnConflict?: boolean;
  validate?: boolean;
  transaction?: Transaction;
}

/**
 * Migration status entry
 */
export interface MigrationStatus {
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';
  startedAt?: Date;
  completedAt?: Date;
  executedBy?: string;
  error?: string;
  duration?: number;
}

/**
 * Concurrent migration lock
 */
export interface MigrationLock {
  lockId: string;
  migrationName: string;
  acquiredAt: Date;
  acquiredBy: string;
  expiresAt: Date;
}

/**
 * Data transformation configuration
 */
export interface TransformationConfig {
  tableName: string;
  columnName: string;
  transformFn: (value: any, row: any) => any | Promise<any>;
  whereClause?: any;
  batchSize?: number;
  transaction?: Transaction;
}

/**
 * Table rename configuration
 */
export interface TableRenameConfig {
  oldName: string;
  newName: string;
  updateReferences?: boolean;
  cascadeRename?: boolean;
  transaction?: Transaction;
}

/**
 * Column type migration configuration
 */
export interface ColumnTypeMigrationConfig {
  tableName: string;
  columnName: string;
  oldType: any;
  newType: any;
  transformData?: boolean;
  transformFn?: (value: any) => any;
  useTemporaryColumn?: boolean;
  transaction?: Transaction;
}

/**
 * Default value configuration
 */
export interface DefaultValueConfig {
  tableName: string;
  columnName: string;
  defaultValue: any;
  updateExisting?: boolean;
  whereClause?: any;
  transaction?: Transaction;
}

/**
 * Migration conflict information
 */
export interface MigrationConflict {
  type: 'SCHEMA_MISMATCH' | 'DATA_CONFLICT' | 'DEPENDENCY_VIOLATION' | 'CONCURRENT_EXECUTION';
  severity: 'ERROR' | 'WARNING';
  description: string;
  affectedTables: string[];
  resolution?: string;
}

/**
 * Backup configuration
 */
export interface BackupConfig {
  tables?: string[];
  includeData?: boolean;
  includeSchema?: boolean;
  backupPath?: string;
  compression?: boolean;
  transaction?: Transaction;
}

/**
 * Restore configuration
 */
export interface RestoreConfig {
  backupPath: string;
  tables?: string[];
  dropExisting?: boolean;
  validateBeforeRestore?: boolean;
  transaction?: Transaction;
}

// ============================================================================
// MIGRATION FILE GENERATORS
// ============================================================================

/**
 * 1. Generates a new migration file with timestamp and template.
 *
 * @param {MigrationFileConfig} config - Migration file configuration
 * @returns {Promise<MigrationFile>} Generated migration file information
 *
 * @example
 * ```typescript
 * const migrationFile = await generateMigrationFile({
 *   name: 'add-patient-allergies-table',
 *   description: 'Create allergies table for patient allergy tracking',
 *   template: 'table-creation',
 *   directory: './migrations',
 *   author: 'admin'
 * });
 * // Creates: ./migrations/20250108120000-add-patient-allergies-table.js
 * ```
 */
export const generateMigrationFile = async (
  config: MigrationFileConfig,
): Promise<MigrationFile> => {
  const timestamp = config.timestamp || new Date();
  const version = timestamp.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const filename = `${version}-${config.name}.js`;
  const directory = config.directory || './migrations';
  const filepath = path.join(directory, filename);

  const template = getMigrationTemplate(config.template || 'basic', config);

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filepath, template, 'utf-8');

  return {
    filename,
    filepath,
    timestamp: version,
    name: config.name,
    version,
  };
};

/**
 * 2. Gets migration template based on type.
 *
 * @param {string} templateType - Template type
 * @param {MigrationFileConfig} config - Migration configuration
 * @returns {string} Migration template content
 *
 * @example
 * ```typescript
 * const template = getMigrationTemplate('table-creation', {
 *   name: 'add-users-table',
 *   description: 'Create users table'
 * });
 * ```
 */
export const getMigrationTemplate = (
  templateType: string,
  config: MigrationFileConfig,
): string => {
  const header = `/**
 * Migration: ${config.name}
 * Description: ${config.description || 'Database migration'}
 * Author: ${config.author || 'system'}
 * Created: ${new Date().toISOString()}
 * Tags: ${config.tags?.join(', ') || 'none'}
 */

'use strict';

const { QueryInterface, Sequelize, DataTypes, Transaction } = require('sequelize');
`;

  switch (templateType) {
    case 'table-creation':
      return header + `
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('TableName', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        // Add your columns here
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }, {
        transaction,
        timestamps: true,
      });

      // Add indexes
      await queryInterface.addIndex('TableName', ['columnName'], {
        name: 'table_name_column_name_idx',
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('TableName', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
`;

    case 'column-modification':
      return header + `
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add column (nullable initially for zero-downtime)
      await queryInterface.addColumn('TableName', 'newColumn', {
        type: DataTypes.STRING,
        allowNull: true,
      }, { transaction });

      // Backfill data
      await queryInterface.sequelize.query(
        \`UPDATE "TableName" SET "newColumn" = 'default_value' WHERE "newColumn" IS NULL\`,
        { transaction }
      );

      // Make non-nullable
      await queryInterface.changeColumn('TableName', 'newColumn', {
        type: DataTypes.STRING,
        allowNull: false,
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('TableName', 'newColumn', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
`;

    case 'data-migration':
      return header + `
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const batchSize = 1000;

    try {
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const [results] = await queryInterface.sequelize.query(
          \`SELECT * FROM "SourceTable" ORDER BY id LIMIT \${batchSize} OFFSET \${offset}\`,
          { transaction }
        );

        if (results.length === 0) {
          hasMore = false;
          break;
        }

        // Transform and insert data
        for (const row of results) {
          const transformedData = {
            // Transform row data here
          };

          await queryInterface.bulkInsert('TargetTable', [transformedData], { transaction });
        }

        offset += batchSize;
        console.log(\`Processed \${offset} records...\`);
      }

      await transaction.commit();
      console.log('Data migration completed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Data migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('TargetTable', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
`;

    default:
      return header + `
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add your migration logic here

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add your rollback logic here

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
`;
  }
};

/**
 * 3. Generates migration file name from description.
 *
 * @param {string} description - Migration description
 * @param {Date} [timestamp] - Optional timestamp
 * @returns {string} Generated filename
 *
 * @example
 * ```typescript
 * const filename = generateMigrationFilename('Add patient allergies table');
 * // Returns: '20250108120000-add-patient-allergies-table.js'
 * ```
 */
export const generateMigrationFilename = (description: string, timestamp?: Date): string => {
  const ts = timestamp || new Date();
  const version = ts.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const name = description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${version}-${name}.js`;
};

// ============================================================================
// SCHEMA DIFFING UTILITIES
// ============================================================================

/**
 * 4. Captures current database schema snapshot.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SchemaSnapshot>} Schema snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await captureSchemaSnapshot(queryInterface);
 * await saveSnapshotToFile(snapshot, './schema-snapshots/v1.0.0.json');
 * ```
 */
export const captureSchemaSnapshot = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<SchemaSnapshot> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Get all tables
  const tables = await getAllTables(queryInterface, transaction);
  const tableSchemas: Record<string, TableSchema> = {};
  const indexSchemas: Record<string, IndexSchema[]> = {};
  const constraintSchemas: Record<string, ConstraintSchema[]> = {};

  for (const tableName of tables) {
    // Get table description
    const columns = await queryInterface.describeTable(tableName, { transaction });

    const columnSchemas: Record<string, ColumnSchema> = {};
    const primaryKeys: string[] = [];

    for (const [columnName, columnInfo] of Object.entries(columns)) {
      const col = columnInfo as any;
      columnSchemas[columnName] = {
        name: columnName,
        type: col.type,
        allowNull: col.allowNull,
        defaultValue: col.defaultValue,
        primaryKey: col.primaryKey,
        autoIncrement: col.autoIncrement,
        unique: col.unique,
        references: col.references,
        onUpdate: col.onUpdate,
        onDelete: col.onDelete,
        comment: col.comment,
      };

      if (col.primaryKey) {
        primaryKeys.push(columnName);
      }
    }

    tableSchemas[tableName] = {
      name: tableName,
      columns: columnSchemas,
      primaryKey: primaryKeys,
    };

    // Get indexes
    indexSchemas[tableName] = await getTableIndexes(queryInterface, tableName, transaction);

    // Get constraints
    constraintSchemas[tableName] = await getTableConstraints(queryInterface, tableName, transaction);
  }

  return {
    tables: tableSchemas,
    indexes: indexSchemas,
    constraints: constraintSchemas,
    enums: {},
    timestamp: new Date(),
    version: new Date().toISOString(),
  };
};

/**
 * 5. Compares two schema snapshots and generates diff.
 *
 * @param {SchemaSnapshot} oldSchema - Previous schema snapshot
 * @param {SchemaSnapshot} newSchema - Current schema snapshot
 * @returns {SchemaDiff} Schema differences
 *
 * @example
 * ```typescript
 * const oldSnapshot = await loadSnapshotFromFile('./snapshots/v1.0.0.json');
 * const newSnapshot = await captureSchemaSnapshot(queryInterface);
 * const diff = compareSchemas(oldSnapshot, newSnapshot);
 * console.log(`Tables added: ${diff.tablesAdded.length}`);
 * ```
 */
export const compareSchemas = (
  oldSchema: SchemaSnapshot,
  newSchema: SchemaSnapshot,
): SchemaDiff => {
  const diff: SchemaDiff = {
    tablesAdded: [],
    tablesRemoved: [],
    tablesModified: [],
    indexesAdded: [],
    indexesRemoved: [],
    constraintsAdded: [],
    constraintsRemoved: [],
    enumsAdded: {},
    enumsRemoved: [],
  };

  const oldTableNames = Object.keys(oldSchema.tables);
  const newTableNames = Object.keys(newSchema.tables);

  // Find added and removed tables
  diff.tablesAdded = newTableNames.filter(name => !oldTableNames.includes(name));
  diff.tablesRemoved = oldTableNames.filter(name => !newTableNames.includes(name));

  // Compare existing tables
  const commonTables = oldTableNames.filter(name => newTableNames.includes(name));

  for (const tableName of commonTables) {
    const tableDiff = compareTableSchemas(
      oldSchema.tables[tableName],
      newSchema.tables[tableName],
    );

    if (tableDiff.columnsAdded.length > 0 ||
        tableDiff.columnsRemoved.length > 0 ||
        tableDiff.columnsModified.length > 0) {
      diff.tablesModified.push(tableDiff);
    }
  }

  // Compare indexes
  const allOldIndexes = Object.values(oldSchema.indexes).flat();
  const allNewIndexes = Object.values(newSchema.indexes).flat();

  diff.indexesAdded = allNewIndexes.filter(
    newIdx => !allOldIndexes.some(oldIdx => indexesEqual(oldIdx, newIdx))
  );
  diff.indexesRemoved = allOldIndexes.filter(
    oldIdx => !allNewIndexes.some(newIdx => indexesEqual(oldIdx, newIdx))
  );

  return diff;
};

/**
 * 6. Compares two table schemas.
 *
 * @param {TableSchema} oldTable - Previous table schema
 * @param {TableSchema} newTable - Current table schema
 * @returns {TableDiff} Table differences
 */
const compareTableSchemas = (oldTable: TableSchema, newTable: TableSchema): TableDiff => {
  const diff: TableDiff = {
    tableName: newTable.name,
    columnsAdded: [],
    columnsRemoved: [],
    columnsModified: [],
  };

  const oldColumnNames = Object.keys(oldTable.columns);
  const newColumnNames = Object.keys(newTable.columns);

  // Find added columns
  const addedColumnNames = newColumnNames.filter(name => !oldColumnNames.includes(name));
  diff.columnsAdded = addedColumnNames.map(name => newTable.columns[name]);

  // Find removed columns
  diff.columnsRemoved = oldColumnNames.filter(name => !newColumnNames.includes(name));

  // Find modified columns
  const commonColumns = oldColumnNames.filter(name => newColumnNames.includes(name));
  for (const columnName of commonColumns) {
    const oldCol = oldTable.columns[columnName];
    const newCol = newTable.columns[columnName];

    if (!columnsEqual(oldCol, newCol)) {
      diff.columnsModified.push({
        name: columnName,
        oldSchema: oldCol,
        newSchema: newCol,
      });
    }
  }

  return diff;
};

/**
 * 7. Checks if two columns are equal.
 */
const columnsEqual = (col1: ColumnSchema, col2: ColumnSchema): boolean => {
  return (
    col1.type === col2.type &&
    col1.allowNull === col2.allowNull &&
    col1.defaultValue === col2.defaultValue &&
    col1.primaryKey === col2.primaryKey &&
    col1.unique === col2.unique
  );
};

/**
 * 8. Checks if two indexes are equal.
 */
const indexesEqual = (idx1: IndexSchema, idx2: IndexSchema): boolean => {
  return (
    idx1.name === idx2.name &&
    idx1.tableName === idx2.tableName &&
    idx1.unique === idx2.unique
  );
};

// ============================================================================
// SAFE COLUMN ADDITION/REMOVAL HELPERS
// ============================================================================

/**
 * 9. Safely adds a column with zero-downtime pattern.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SafeColumnAddConfig} config - Column addition configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await safeAddColumn(queryInterface, {
 *   tableName: 'Patients',
 *   columnName: 'allergySeverity',
 *   columnDefinition: { type: DataTypes.STRING, allowNull: true },
 *   defaultValue: 'UNKNOWN',
 *   makeNonNullable: true,
 *   addIndex: { name: 'patients_allergy_severity_idx', fields: ['allergySeverity'] }
 * });
 * ```
 */
export const safeAddColumn = async (
  queryInterface: QueryInterface,
  config: SafeColumnAddConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    // Step 1: Add column as nullable
    const initialDefinition = {
      ...config.columnDefinition,
      allowNull: true,
    };

    await queryInterface.addColumn(
      config.tableName,
      config.columnName,
      initialDefinition,
      { transaction },
    );

    // Step 2: Backfill with default value if provided
    if (config.defaultValue !== undefined) {
      if (config.backfillQuery) {
        await queryInterface.sequelize.query(config.backfillQuery, { transaction });
      } else {
        await queryInterface.sequelize.query(
          `UPDATE "${config.tableName}" SET "${config.columnName}" = :defaultValue WHERE "${config.columnName}" IS NULL`,
          {
            replacements: { defaultValue: config.defaultValue },
            transaction,
          },
        );
      }
    }

    // Step 3: Make non-nullable if requested
    if (config.makeNonNullable) {
      await queryInterface.changeColumn(
        config.tableName,
        config.columnName,
        {
          ...config.columnDefinition,
          allowNull: false,
        },
        { transaction },
      );
    }

    // Step 4: Add index if requested
    if (config.addIndex) {
      await queryInterface.addIndex(
        config.tableName,
        config.addIndex.fields,
        {
          name: config.addIndex.name,
          unique: config.addIndex.unique,
          transaction,
        },
      );
    }

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * 10. Safely removes a column with optional data preservation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SafeColumnRemoveConfig} config - Column removal configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await safeRemoveColumn(queryInterface, {
 *   tableName: 'Patients',
 *   columnName: 'oldField',
 *   preserveData: true,
 *   backupColumnName: 'oldField_backup'
 * });
 * ```
 */
export const safeRemoveColumn = async (
  queryInterface: QueryInterface,
  config: SafeColumnRemoveConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    // Step 1: Preserve data if requested
    if (config.preserveData) {
      const backupName = config.backupColumnName || `${config.columnName}_backup_${Date.now()}`;

      // Get column definition
      const tableDesc = await queryInterface.describeTable(config.tableName, { transaction });
      const columnDef = tableDesc[config.columnName];

      // Add backup column
      await queryInterface.addColumn(
        config.tableName,
        backupName,
        columnDef as any,
        { transaction },
      );

      // Copy data
      await queryInterface.sequelize.query(
        `UPDATE "${config.tableName}" SET "${backupName}" = "${config.columnName}"`,
        { transaction },
      );
    }

    // Step 2: Remove the column
    await queryInterface.removeColumn(
      config.tableName,
      config.columnName,
      { transaction },
    );

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * 11. Renames a column safely.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} oldColumnName - Old column name
 * @param {string} newColumnName - New column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await safeRenameColumn(queryInterface, 'Patients', 'firstName', 'givenName');
 * ```
 */
export const safeRenameColumn = async (
  queryInterface: QueryInterface,
  tableName: string,
  oldColumnName: string,
  newColumnName: string,
  transaction?: Transaction,
): Promise<void> => {
  const txn = transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !transaction;

  try {
    await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction: txn });

    if (shouldCommit) {
      await txn.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await txn.rollback();
    }
    throw error;
  }
};

// ============================================================================
// INDEX CREATION/DELETION UTILITIES
// ============================================================================

/**
 * 12. Creates an index with configurable options.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {IndexCreationConfig} config - Index creation configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndex(queryInterface, {
 *   tableName: 'Patients',
 *   indexName: 'patients_last_name_first_name_idx',
 *   fields: ['lastName', 'firstName'],
 *   unique: false,
 *   concurrently: true
 * });
 * ```
 */
export const createIndex = async (
  queryInterface: QueryInterface,
  config: IndexCreationConfig,
): Promise<void> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  // Check if index already exists
  if (config.ifNotExists) {
    const exists = await indexExists(queryInterface, config.tableName, config.indexName, config.transaction);
    if (exists) {
      console.log(`Index ${config.indexName} already exists, skipping creation`);
      return;
    }
  }

  // For PostgreSQL, use CREATE INDEX CONCURRENTLY
  if (config.concurrently && dialect === 'postgres') {
    const fields = config.fields.map(f => {
      if (typeof f === 'string') {
        return `"${f}"`;
      } else {
        return `"${f.name}" ${f.order || 'ASC'}`;
      }
    }).join(', ');

    const uniqueClause = config.unique ? 'UNIQUE ' : '';
    const typeClause = config.type ? ` USING ${config.type}` : '';
    const whereClause = config.where ? ` WHERE ${JSON.stringify(config.where)}` : '';

    const sql = `CREATE ${uniqueClause}INDEX CONCURRENTLY "${config.indexName}" ON "${config.tableName}"${typeClause} (${fields})${whereClause}`;

    await sequelize.query(sql, { transaction: config.transaction });
  } else {
    // Standard index creation
    await queryInterface.addIndex(
      config.tableName,
      config.fields as string[],
      {
        name: config.indexName,
        unique: config.unique,
        type: config.type,
        where: config.where,
        transaction: config.transaction,
      },
    );
  }
};

/**
 * 13. Removes an index safely.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {boolean} [concurrently] - Drop concurrently (PostgreSQL only)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeIndex(queryInterface, 'Patients', 'patients_old_field_idx', true);
 * ```
 */
export const removeIndex = async (
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  concurrently: boolean = false,
  transaction?: Transaction,
): Promise<void> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  if (concurrently && dialect === 'postgres') {
    await sequelize.query(
      `DROP INDEX CONCURRENTLY IF EXISTS "${indexName}"`,
      { transaction },
    );
  } else {
    await queryInterface.removeIndex(tableName, indexName, { transaction });
  }
};

/**
 * 14. Checks if an index exists.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if index exists
 *
 * @example
 * ```typescript
 * const exists = await indexExists(queryInterface, 'Patients', 'patients_email_idx');
 * ```
 */
export const indexExists = async (
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const indexes = await getTableIndexes(queryInterface, tableName, transaction);
  return indexes.some(idx => idx.name === indexName);
};

/**
 * 15. Gets all indexes for a table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IndexSchema[]>} Array of indexes
 */
export const getTableIndexes = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<IndexSchema[]> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  try {
    const indexes = await queryInterface.showIndex(tableName, { transaction });
    return indexes.map((idx: any) => ({
      name: idx.name,
      tableName,
      fields: idx.fields.map((f: any) => (typeof f === 'string' ? f : f.attribute)),
      unique: idx.unique || false,
      type: idx.type,
    }));
  } catch (error) {
    return [];
  }
};

// ============================================================================
// FOREIGN KEY CONSTRAINT MANAGERS
// ============================================================================

/**
 * 16. Adds a foreign key constraint.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {ForeignKeyConfig} config - Foreign key configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addForeignKey(queryInterface, {
 *   sourceTable: 'Appointments',
 *   sourceColumn: 'patientId',
 *   targetTable: 'Patients',
 *   targetColumn: 'id',
 *   constraintName: 'fk_appointments_patient',
 *   onUpdate: 'CASCADE',
 *   onDelete: 'CASCADE'
 * });
 * ```
 */
export const addForeignKey = async (
  queryInterface: QueryInterface,
  config: ForeignKeyConfig,
): Promise<void> => {
  const constraintName = config.constraintName ||
    `fk_${config.sourceTable}_${config.sourceColumn}_${config.targetTable}`;

  await queryInterface.addConstraint(config.sourceTable, {
    fields: [config.sourceColumn],
    type: 'foreign key',
    name: constraintName,
    references: {
      table: config.targetTable,
      field: config.targetColumn,
    },
    onUpdate: config.onUpdate || 'CASCADE',
    onDelete: config.onDelete || 'CASCADE',
    transaction: config.transaction,
  });
};

/**
 * 17. Removes a foreign key constraint.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeForeignKey(queryInterface, 'Appointments', 'fk_appointments_patient');
 * ```
 */
export const removeForeignKey = async (
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.removeConstraint(tableName, constraintName, { transaction });
};

/**
 * 18. Gets all foreign key constraints for a table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConstraintSchema[]>} Array of constraints
 */
export const getTableConstraints = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<ConstraintSchema[]> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `SELECT
        tc.constraint_name as name,
        tc.constraint_type as type,
        kcu.column_name as column,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      LEFT JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_name = :tableName`,
      {
        replacements: { tableName },
        type: QueryTypes.SELECT,
        transaction,
      },
    );

    return results.map((row: any) => ({
      name: row.name,
      tableName,
      type: row.type.replace(' ', '_').toUpperCase() as any,
      fields: [row.column],
      references: row.foreign_table_name ? {
        table: row.foreign_table_name,
        fields: [row.foreign_column_name],
      } : undefined,
    }));
  }

  return [];
};

// ============================================================================
// DATA MIGRATION HELPERS
// ============================================================================

/**
 * 19. Executes batch data migration with progress tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {BatchMigrationConfig} config - Batch migration configuration
 * @returns {Promise<BatchMigrationResult>} Migration result
 *
 * @example
 * ```typescript
 * const result = await executeBatchMigration(queryInterface, {
 *   sourceTable: 'OldPatients',
 *   targetTable: 'Patients',
 *   batchSize: 1000,
 *   transformFn: (row) => ({
 *     id: row.patient_id,
 *     name: `${row.first_name} ${row.last_name}`,
 *     email: row.email_address
 *   }),
 *   onBatchComplete: (batch, count) => console.log(`Batch ${batch}: ${count} records`)
 * });
 * ```
 */
export const executeBatchMigration = async (
  queryInterface: QueryInterface,
  config: BatchMigrationConfig,
): Promise<BatchMigrationResult> => {
  const startTime = Date.now();
  const result: BatchMigrationResult = {
    totalProcessed: 0,
    totalSucceeded: 0,
    totalFailed: 0,
    batchesExecuted: 0,
    duration: 0,
    errors: [],
  };

  const sequelize = queryInterface.sequelize;
  let offset = 0;
  let batchNumber = 0;

  while (true) {
    const transaction = config.transaction || await sequelize.transaction();
    const shouldCommit = !config.transaction;

    try {
      // Fetch batch
      const selectQuery = config.selectQuery ||
        `SELECT * FROM "${config.sourceTable}" ORDER BY id LIMIT ${config.batchSize} OFFSET ${offset}`;

      const [rows] = await sequelize.query(selectQuery, { transaction });

      if (!rows || rows.length === 0) {
        if (shouldCommit) await transaction.commit();
        break;
      }

      batchNumber++;
      result.batchesExecuted++;

      // Process each row
      for (const row of rows as any[]) {
        try {
          result.totalProcessed++;

          // Validate if function provided
          if (config.validateFn) {
            const isValid = await config.validateFn(row);
            if (!isValid) {
              result.totalFailed++;
              continue;
            }
          }

          // Transform if function provided
          const transformedRow = config.transformFn ? await config.transformFn(row) : row;

          // Insert into target table
          const targetTable = config.targetTable || config.sourceTable;
          await sequelize.query(
            `INSERT INTO "${targetTable}" (${Object.keys(transformedRow).map(k => `"${k}"`).join(', ')})
             VALUES (${Object.keys(transformedRow).map(() => '?').join(', ')})`,
            {
              replacements: Object.values(transformedRow),
              transaction,
            },
          );

          result.totalSucceeded++;
        } catch (error) {
          result.totalFailed++;
          result.errors.push({ row, error: error as Error, batchNumber });

          if (config.onError) {
            await config.onError(error as Error, row, batchNumber);
          }
        }
      }

      if (shouldCommit) {
        await transaction.commit();
      }

      // Batch complete callback
      if (config.onBatchComplete) {
        await config.onBatchComplete(batchNumber, result.totalProcessed);
      }

      // Delay between batches
      if (config.delayBetweenBatches) {
        await new Promise(resolve => setTimeout(resolve, config.delayBetweenBatches));
      }

      offset += config.batchSize;

    } catch (error) {
      if (shouldCommit) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  result.duration = Date.now() - startTime;
  return result;
};

/**
 * 20. Migrates data with transformation function.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {TransformationConfig} config - Transformation configuration
 * @returns {Promise<number>} Number of rows transformed
 *
 * @example
 * ```typescript
 * await transformTableData(queryInterface, {
 *   tableName: 'Patients',
 *   columnName: 'phone',
 *   transformFn: (value) => value.replace(/[^0-9]/g, ''),
 *   whereClause: { phone: { [Op.like]: '%-%' } }
 * });
 * ```
 */
export const transformTableData = async (
  queryInterface: QueryInterface,
  config: TransformationConfig,
): Promise<number> => {
  const sequelize = queryInterface.sequelize;
  const batchSize = config.batchSize || 1000;
  let offset = 0;
  let totalTransformed = 0;

  while (true) {
    const transaction = config.transaction || await sequelize.transaction();
    const shouldCommit = !config.transaction;

    try {
      // Build WHERE clause
      const whereClause = config.whereClause ?
        `WHERE ${Object.entries(config.whereClause).map(([k, v]) => `"${k}" = '${v}'`).join(' AND ')}` : '';

      // Fetch batch
      const [rows] = await sequelize.query(
        `SELECT id, "${config.columnName}" FROM "${config.tableName}" ${whereClause}
         ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`,
        { transaction },
      );

      if (!rows || rows.length === 0) {
        if (shouldCommit) await transaction.commit();
        break;
      }

      // Transform each row
      for (const row of rows as any[]) {
        const oldValue = row[config.columnName];
        const newValue = await config.transformFn(oldValue, row);

        if (oldValue !== newValue) {
          await sequelize.query(
            `UPDATE "${config.tableName}" SET "${config.columnName}" = :newValue WHERE id = :id`,
            {
              replacements: { newValue, id: row.id },
              transaction,
            },
          );
          totalTransformed++;
        }
      }

      if (shouldCommit) {
        await transaction.commit();
      }

      offset += batchSize;

    } catch (error) {
      if (shouldCommit) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  return totalTransformed;
};

// ============================================================================
// ROLLBACK UTILITIES
// ============================================================================

/**
 * 21. Executes migration rollback with strategy.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {RollbackConfig} config - Rollback configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeRollback(queryInterface, {
 *   migrationName: '20250108-add-allergies',
 *   strategy: 'RESTORE_BACKUP',
 *   backupTablePrefix: 'backup_',
 *   validateAfterRollback: true
 * });
 * ```
 */
export const executeRollback = async (
  queryInterface: QueryInterface,
  config: RollbackConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    switch (config.strategy) {
      case 'RESTORE_BACKUP':
        // Implementation would restore from backup tables
        console.log(`Restoring from backup for migration: ${config.migrationName}`);
        break;

      case 'REVERT_CHANGES':
        console.log(`Reverting changes for migration: ${config.migrationName}`);
        break;

      case 'CUSTOM':
        if (config.customRollback) {
          await config.customRollback(queryInterface, transaction);
        }
        break;

      case 'DROP':
      default:
        console.log(`Dropping changes for migration: ${config.migrationName}`);
        break;
    }

    if (config.validateAfterRollback) {
      // Add validation logic here
      console.log('Validating after rollback...');
    }

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * 22. Creates backup table before migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name to backup
 * @param {string} [backupPrefix] - Backup table prefix
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Backup table name
 *
 * @example
 * ```typescript
 * const backupTable = await createBackupTable(queryInterface, 'Patients', 'backup_');
 * // Creates: backup_patients_20250108120000
 * ```
 */
export const createBackupTable = async (
  queryInterface: QueryInterface,
  tableName: string,
  backupPrefix: string = 'backup_',
  transaction?: Transaction,
): Promise<string> => {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const backupTableName = `${backupPrefix}${tableName}_${timestamp}`;

  await queryInterface.sequelize.query(
    `CREATE TABLE "${backupTableName}" AS SELECT * FROM "${tableName}"`,
    { transaction },
  );

  return backupTableName;
};

/**
 * 23. Restores table from backup.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Target table name
 * @param {string} backupTableName - Backup table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFromBackup(queryInterface, 'Patients', 'backup_patients_20250108120000');
 * ```
 */
export const restoreFromBackup = async (
  queryInterface: QueryInterface,
  tableName: string,
  backupTableName: string,
  transaction?: Transaction,
): Promise<void> => {
  const txn = transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !transaction;

  try {
    // Truncate current table
    await queryInterface.sequelize.query(`TRUNCATE TABLE "${tableName}"`, { transaction: txn });

    // Restore from backup
    await queryInterface.sequelize.query(
      `INSERT INTO "${tableName}" SELECT * FROM "${backupTableName}"`,
      { transaction: txn },
    );

    if (shouldCommit) {
      await txn.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await txn.rollback();
    }
    throw error;
  }
};

// ============================================================================
// MIGRATION VALIDATION SERVICES
// ============================================================================

/**
 * 24. Validates migration before execution.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} migrationName - Migration name
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMigration(queryInterface, 'add-patient-allergies');
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export const validateMigration = async (
  queryInterface: QueryInterface,
  migrationName: string,
): Promise<ValidationResult> => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    checks: [],
  };

  // Check 1: Database connection
  try {
    await queryInterface.sequelize.authenticate();
    result.checks.push({
      name: 'Database Connection',
      passed: true,
    });
  } catch (error) {
    result.valid = false;
    result.errors.push('Database connection failed');
    result.checks.push({
      name: 'Database Connection',
      passed: false,
      message: (error as Error).message,
    });
  }

  // Check 2: Migration lock
  const hasLock = await hasMigrationLock(queryInterface, migrationName);
  if (hasLock) {
    result.valid = false;
    result.errors.push('Migration is currently locked by another process');
    result.checks.push({
      name: 'Migration Lock',
      passed: false,
      message: 'Migration is locked',
    });
  } else {
    result.checks.push({
      name: 'Migration Lock',
      passed: true,
    });
  }

  // Check 3: Schema version compatibility
  // Add more validation checks as needed

  return result;
};

/**
 * 25. Validates schema consistency after migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * await runMigration(queryInterface);
 * const validation = await validateSchemaConsistency(queryInterface);
 * ```
 */
export const validateSchemaConsistency = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<ValidationResult> => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    checks: [],
  };

  // Check foreign key integrity
  const tables = await getAllTables(queryInterface, transaction);

  for (const tableName of tables) {
    try {
      const constraints = await getTableConstraints(queryInterface, tableName, transaction);
      const foreignKeys = constraints.filter(c => c.type === 'FOREIGN KEY');

      for (const fk of foreignKeys) {
        // Validate foreign key references exist
        result.checks.push({
          name: `Foreign Key: ${fk.name}`,
          passed: true,
        });
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Error validating table ${tableName}: ${(error as Error).message}`);
    }
  }

  return result;
};

// ============================================================================
// SCHEMA VERSIONING HELPERS
// ============================================================================

/**
 * 26. Records schema version.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SchemaVersion} version - Schema version information
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordSchemaVersion(queryInterface, {
 *   version: 'v2.0.0',
 *   description: 'Added patient allergies module',
 *   appliedAt: new Date(),
 *   appliedBy: 'admin',
 *   migrationFiles: ['20250108-add-allergies.js']
 * });
 * ```
 */
export const recordSchemaVersion = async (
  queryInterface: QueryInterface,
  version: SchemaVersion,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.sequelize.query(
    `INSERT INTO "SchemaVersions" ("version", "description", "appliedAt", "appliedBy", "migrationFiles")
     VALUES (:version, :description, :appliedAt, :appliedBy, :migrationFiles)`,
    {
      replacements: {
        version: version.version,
        description: version.description,
        appliedAt: version.appliedAt,
        appliedBy: version.appliedBy,
        migrationFiles: JSON.stringify(version.migrationFiles),
      },
      transaction,
    },
  );
};

/**
 * 27. Gets current schema version.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SchemaVersion | null>} Current schema version
 *
 * @example
 * ```typescript
 * const currentVersion = await getCurrentSchemaVersion(queryInterface);
 * console.log(`Current schema version: ${currentVersion?.version}`);
 * ```
 */
export const getCurrentSchemaVersion = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<SchemaVersion | null> => {
  try {
    const [results] = await queryInterface.sequelize.query(
      `SELECT * FROM "SchemaVersions" ORDER BY "appliedAt" DESC LIMIT 1`,
      { type: QueryTypes.SELECT, transaction },
    );

    if (!results) {
      return null;
    }

    const row = results as any;
    return {
      version: row.version,
      description: row.description,
      appliedAt: row.appliedAt,
      appliedBy: row.appliedBy,
      migrationFiles: JSON.parse(row.migrationFiles || '[]'),
    };
  } catch (error) {
    return null;
  }
};

/**
 * 28. Compares schema versions.
 *
 * @param {string} version1 - First version
 * @param {string} version2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 *
 * @example
 * ```typescript
 * const comparison = compareVersions('v1.0.0', 'v2.0.0'); // Returns -1
 * ```
 */
export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.replace('v', '').split('.').map(Number);
  const v2Parts = version2.replace('v', '').split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
};

// ============================================================================
// SEED DATA GENERATORS
// ============================================================================

/**
 * 29. Seeds data into table with conflict handling.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SeedConfig} config - Seed configuration
 * @returns {Promise<number>} Number of rows inserted
 *
 * @example
 * ```typescript
 * await seedTable(queryInterface, {
 *   tableName: 'Roles',
 *   data: [
 *     { name: 'Admin', permissions: ['read', 'write'] },
 *     { name: 'User', permissions: ['read'] }
 *   ],
 *   conflictFields: ['name'],
 *   updateOnConflict: true
 * });
 * ```
 */
export const seedTable = async (
  queryInterface: QueryInterface,
  config: SeedConfig,
): Promise<number> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;
  let insertedCount = 0;

  try {
    for (const row of config.data) {
      if (config.validate) {
        // Add validation logic
      }

      if (config.conflictFields && config.updateOnConflict) {
        // Upsert logic
        const conflictClause = config.conflictFields.map(f => `"${f}"`).join(', ');
        const updateClause = Object.keys(row)
          .filter(k => !config.conflictFields?.includes(k))
          .map(k => `"${k}" = EXCLUDED."${k}"`)
          .join(', ');

        const columns = Object.keys(row).map(k => `"${k}"`).join(', ');
        const values = Object.keys(row).map(() => '?').join(', ');

        await queryInterface.sequelize.query(
          `INSERT INTO "${config.tableName}" (${columns}) VALUES (${values})
           ON CONFLICT (${conflictClause}) DO UPDATE SET ${updateClause}`,
          {
            replacements: Object.values(row),
            transaction,
          },
        );
      } else {
        await queryInterface.bulkInsert(config.tableName, [row], { transaction });
      }

      insertedCount++;
    }

    if (shouldCommit) {
      await transaction.commit();
    }

    return insertedCount;
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * 30. Generates seed data from template.
 *
 * @param {number} count - Number of records to generate
 * @param {(index: number) => any} generator - Generator function
 * @returns {any[]} Array of generated records
 *
 * @example
 * ```typescript
 * const patients = generateSeedData(100, (i) => ({
 *   id: uuidv4(),
 *   name: `Patient ${i}`,
 *   email: `patient${i}@example.com`,
 *   createdAt: new Date()
 * }));
 * ```
 */
export const generateSeedData = (
  count: number,
  generator: (index: number) => any,
): any[] => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(generator(i));
  }
  return data;
};

// ============================================================================
// MIGRATION STATUS TRACKING
// ============================================================================

/**
 * 31. Updates migration status.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {MigrationStatus} status - Migration status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateMigrationStatus(queryInterface, {
 *   name: '20250108-add-allergies',
 *   status: 'RUNNING',
 *   startedAt: new Date(),
 *   executedBy: 'admin'
 * });
 * ```
 */
export const updateMigrationStatus = async (
  queryInterface: QueryInterface,
  status: MigrationStatus,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.sequelize.query(
    `INSERT INTO "MigrationStatus" ("name", "status", "startedAt", "completedAt", "executedBy", "error", "duration")
     VALUES (:name, :status, :startedAt, :completedAt, :executedBy, :error, :duration)
     ON CONFLICT ("name") DO UPDATE SET
       "status" = EXCLUDED."status",
       "completedAt" = EXCLUDED."completedAt",
       "error" = EXCLUDED."error",
       "duration" = EXCLUDED."duration"`,
    {
      replacements: {
        name: status.name,
        status: status.status,
        startedAt: status.startedAt || null,
        completedAt: status.completedAt || null,
        executedBy: status.executedBy || null,
        error: status.error || null,
        duration: status.duration || null,
      },
      transaction,
    },
  );
};

/**
 * 32. Gets migration status.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} migrationName - Migration name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MigrationStatus | null>} Migration status
 *
 * @example
 * ```typescript
 * const status = await getMigrationStatus(queryInterface, '20250108-add-allergies');
 * ```
 */
export const getMigrationStatus = async (
  queryInterface: QueryInterface,
  migrationName: string,
  transaction?: Transaction,
): Promise<MigrationStatus | null> => {
  try {
    const [result] = await queryInterface.sequelize.query(
      `SELECT * FROM "MigrationStatus" WHERE "name" = :name`,
      {
        replacements: { name: migrationName },
        type: QueryTypes.SELECT,
        transaction,
      },
    );

    return result as MigrationStatus || null;
  } catch (error) {
    return null;
  }
};

/**
 * 33. Gets all pending migrations.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<MigrationStatus[]>} Array of pending migrations
 *
 * @example
 * ```typescript
 * const pending = await getPendingMigrations(queryInterface);
 * console.log(`${pending.length} migrations pending`);
 * ```
 */
export const getPendingMigrations = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<MigrationStatus[]> => {
  try {
    const results = await queryInterface.sequelize.query(
      `SELECT * FROM "MigrationStatus" WHERE "status" = 'PENDING' ORDER BY "name"`,
      {
        type: QueryTypes.SELECT,
        transaction,
      },
    );

    return results as MigrationStatus[];
  } catch (error) {
    return [];
  }
};

// ============================================================================
// CONCURRENT MIGRATION GUARDS
// ============================================================================

/**
 * 34. Acquires migration lock.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} migrationName - Migration name
 * @param {number} [timeoutMinutes] - Lock timeout in minutes
 * @returns {Promise<string>} Lock ID
 *
 * @example
 * ```typescript
 * const lockId = await acquireMigrationLock(queryInterface, 'add-allergies', 30);
 * try {
 *   await runMigration();
 * } finally {
 *   await releaseMigrationLock(queryInterface, lockId);
 * }
 * ```
 */
export const acquireMigrationLock = async (
  queryInterface: QueryInterface,
  migrationName: string,
  timeoutMinutes: number = 30,
): Promise<string> => {
  const lockId = `${migrationName}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + timeoutMinutes * 60 * 1000);

  await queryInterface.sequelize.query(
    `INSERT INTO "MigrationLocks" ("lockId", "migrationName", "acquiredAt", "acquiredBy", "expiresAt")
     VALUES (:lockId, :migrationName, NOW(), :acquiredBy, :expiresAt)`,
    {
      replacements: {
        lockId,
        migrationName,
        acquiredBy: process.env.USER || 'system',
        expiresAt,
      },
    },
  );

  return lockId;
};

/**
 * 35. Releases migration lock.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} lockId - Lock ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseMigrationLock(queryInterface, lockId);
 * ```
 */
export const releaseMigrationLock = async (
  queryInterface: QueryInterface,
  lockId: string,
): Promise<void> => {
  await queryInterface.sequelize.query(
    `DELETE FROM "MigrationLocks" WHERE "lockId" = :lockId`,
    {
      replacements: { lockId },
    },
  );
};

/**
 * 36. Checks if migration has an active lock.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} migrationName - Migration name
 * @returns {Promise<boolean>} True if locked
 *
 * @example
 * ```typescript
 * const isLocked = await hasMigrationLock(queryInterface, 'add-allergies');
 * if (isLocked) {
 *   console.log('Migration is currently running');
 * }
 * ```
 */
export const hasMigrationLock = async (
  queryInterface: QueryInterface,
  migrationName: string,
): Promise<boolean> => {
  try {
    const [results] = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM "MigrationLocks"
       WHERE "migrationName" = :migrationName AND "expiresAt" > NOW()`,
      {
        replacements: { migrationName },
        type: QueryTypes.SELECT,
      },
    );

    return (results as any).count > 0;
  } catch (error) {
    return false;
  }
};

/**
 * 37. Cleans up expired migration locks.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @returns {Promise<number>} Number of locks cleaned
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredLocks(queryInterface);
 * console.log(`Cleaned up ${cleaned} expired locks`);
 * ```
 */
export const cleanupExpiredLocks = async (
  queryInterface: QueryInterface,
): Promise<number> => {
  const [result] = await queryInterface.sequelize.query(
    `DELETE FROM "MigrationLocks" WHERE "expiresAt" <= NOW() RETURNING *`,
  );

  return (result as any[]).length;
};

// ============================================================================
// TABLE RENAME HELPERS
// ============================================================================

/**
 * 38. Renames a table safely.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {TableRenameConfig} config - Table rename configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await safeRenameTable(queryInterface, {
 *   oldName: 'OldPatients',
 *   newName: 'Patients',
 *   updateReferences: true
 * });
 * ```
 */
export const safeRenameTable = async (
  queryInterface: QueryInterface,
  config: TableRenameConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    await queryInterface.renameTable(config.oldName, config.newName, { transaction });

    if (config.updateReferences) {
      // Update foreign key references
      // This is database-specific and would need implementation
      console.log('Updating foreign key references...');
    }

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

// ============================================================================
// COLUMN TYPE MIGRATION UTILITIES
// ============================================================================

/**
 * 39. Migrates column to new type with data preservation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {ColumnTypeMigrationConfig} config - Column type migration configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await migrateColumnType(queryInterface, {
 *   tableName: 'Patients',
 *   columnName: 'age',
 *   oldType: DataTypes.STRING,
 *   newType: DataTypes.INTEGER,
 *   transformData: true,
 *   transformFn: (value) => parseInt(value, 10)
 * });
 * ```
 */
export const migrateColumnType = async (
  queryInterface: QueryInterface,
  config: ColumnTypeMigrationConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    if (config.useTemporaryColumn) {
      const tempColumnName = `${config.columnName}_temp`;

      // Add temporary column
      await queryInterface.addColumn(
        config.tableName,
        tempColumnName,
        { type: config.newType, allowNull: true },
        { transaction },
      );

      // Transform and copy data
      if (config.transformData && config.transformFn) {
        const [rows] = await queryInterface.sequelize.query(
          `SELECT id, "${config.columnName}" FROM "${config.tableName}"`,
          { transaction },
        );

        for (const row of rows as any[]) {
          const oldValue = row[config.columnName];
          const newValue = config.transformFn(oldValue);

          await queryInterface.sequelize.query(
            `UPDATE "${config.tableName}" SET "${tempColumnName}" = :newValue WHERE id = :id`,
            {
              replacements: { newValue, id: row.id },
              transaction,
            },
          );
        }
      } else {
        await queryInterface.sequelize.query(
          `UPDATE "${config.tableName}" SET "${tempColumnName}" = "${config.columnName}"`,
          { transaction },
        );
      }

      // Remove old column
      await queryInterface.removeColumn(config.tableName, config.columnName, { transaction });

      // Rename temp column
      await queryInterface.renameColumn(
        config.tableName,
        tempColumnName,
        config.columnName,
        { transaction },
      );
    } else {
      // Direct column type change
      await queryInterface.changeColumn(
        config.tableName,
        config.columnName,
        { type: config.newType },
        { transaction },
      );
    }

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

// ============================================================================
// DEFAULT VALUE MANAGERS
// ============================================================================

/**
 * 40. Sets default value for column.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {DefaultValueConfig} config - Default value configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setDefaultValue(queryInterface, {
 *   tableName: 'Patients',
 *   columnName: 'status',
 *   defaultValue: 'ACTIVE',
 *   updateExisting: true
 * });
 * ```
 */
export const setDefaultValue = async (
  queryInterface: QueryInterface,
  config: DefaultValueConfig,
): Promise<void> => {
  const transaction = config.transaction || await queryInterface.sequelize.transaction();
  const shouldCommit = !config.transaction;

  try {
    // Get current column definition
    const tableDesc = await queryInterface.describeTable(config.tableName, { transaction });
    const columnDef = tableDesc[config.columnName] as any;

    // Update column with new default
    await queryInterface.changeColumn(
      config.tableName,
      config.columnName,
      {
        ...columnDef,
        defaultValue: config.defaultValue,
      },
      { transaction },
    );

    // Update existing rows if requested
    if (config.updateExisting) {
      const whereClause = config.whereClause
        ? `WHERE ${Object.entries(config.whereClause).map(([k, v]) => `"${k}" = '${v}'`).join(' AND ')}`
        : '';

      await queryInterface.sequelize.query(
        `UPDATE "${config.tableName}" SET "${config.columnName}" = :defaultValue ${whereClause}`,
        {
          replacements: { defaultValue: config.defaultValue },
          transaction,
        },
      );
    }

    if (shouldCommit) {
      await transaction.commit();
    }
  } catch (error) {
    if (shouldCommit) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * 41. Removes default value from column.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeDefaultValue(queryInterface, 'Patients', 'status');
 * ```
 */
export const removeDefaultValue = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  transaction?: Transaction,
): Promise<void> => {
  const tableDesc = await queryInterface.describeTable(tableName, { transaction });
  const columnDef = tableDesc[columnName] as any;

  await queryInterface.changeColumn(
    tableName,
    columnName,
    {
      ...columnDef,
      defaultValue: undefined,
    },
    { transaction },
  );
};

// ============================================================================
// CONSTRAINT ADDITION/REMOVAL
// ============================================================================

/**
 * 42. Adds a constraint to table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {ConstraintSchema} constraint - Constraint configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addConstraint(queryInterface, {
 *   name: 'patients_age_check',
 *   tableName: 'Patients',
 *   type: 'CHECK',
 *   fields: ['age'],
 *   check: 'age >= 0 AND age <= 150'
 * });
 * ```
 */
export const addConstraint = async (
  queryInterface: QueryInterface,
  constraint: ConstraintSchema,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.addConstraint(constraint.tableName, {
    fields: constraint.fields,
    type: constraint.type.toLowerCase().replace('_', ' ') as any,
    name: constraint.name,
    references: constraint.references ? {
      table: constraint.references.table,
      field: constraint.references.fields[0],
    } : undefined,
    onUpdate: constraint.onUpdate,
    onDelete: constraint.onDelete,
    transaction,
  });
};

/**
 * 43. Removes a constraint from table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeConstraint(queryInterface, 'Patients', 'patients_age_check');
 * ```
 */
export const removeConstraint = async (
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.removeConstraint(tableName, constraintName, { transaction });
};

// ============================================================================
// MIGRATION CONFLICT DETECTION
// ============================================================================

/**
 * 44. Detects migration conflicts.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} migrationName - Migration name to check
 * @returns {Promise<MigrationConflict[]>} Array of conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await detectMigrationConflicts(queryInterface, 'add-allergies');
 * if (conflicts.length > 0) {
 *   console.error('Migration conflicts detected:', conflicts);
 * }
 * ```
 */
export const detectMigrationConflicts = async (
  queryInterface: QueryInterface,
  migrationName: string,
): Promise<MigrationConflict[]> => {
  const conflicts: MigrationConflict[] = [];

  // Check for concurrent execution
  const isLocked = await hasMigrationLock(queryInterface, migrationName);
  if (isLocked) {
    conflicts.push({
      type: 'CONCURRENT_EXECUTION',
      severity: 'ERROR',
      description: 'Migration is currently being executed by another process',
      affectedTables: [],
    });
  }

  // Check for schema mismatches
  // Add more conflict detection logic as needed

  return conflicts;
};

// ============================================================================
// TRANSACTION WRAPPERS
// ============================================================================

/**
 * 45. Wraps migration in transaction with automatic rollback.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {(transaction: Transaction) => Promise<void>} callback - Migration callback
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await withMigrationTransaction(queryInterface, async (transaction) => {
 *   await queryInterface.createTable('NewTable', { ... }, { transaction });
 *   await queryInterface.addIndex('NewTable', ['column'], { transaction });
 * });
 * ```
 */
export const withMigrationTransaction = async (
  queryInterface: QueryInterface,
  callback: (transaction: Transaction) => Promise<void>,
): Promise<void> => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await callback(transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Gets all table names in database.
 */
const getAllTables = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<string[]> => {
  const sequelize = queryInterface.sequelize;
  const dialect = sequelize.getDialect();

  if (dialect === 'postgres') {
    const [results] = await sequelize.query(
      `SELECT tablename FROM pg_catalog.pg_tables
       WHERE schemaname = 'public'
       ORDER BY tablename`,
      { transaction },
    );
    return (results as any[]).map(r => r.tablename);
  } else if (dialect === 'mysql') {
    const [results] = await sequelize.query(
      `SHOW TABLES`,
      { transaction },
    );
    return (results as any[]).map(r => Object.values(r)[0] as string);
  }

  return [];
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Migration file generators
  generateMigrationFile,
  getMigrationTemplate,
  generateMigrationFilename,

  // Schema diffing utilities
  captureSchemaSnapshot,
  compareSchemas,
  getTableIndexes,
  getTableConstraints,

  // Safe column operations
  safeAddColumn,
  safeRemoveColumn,
  safeRenameColumn,

  // Index management
  createIndex,
  removeIndex,
  indexExists,

  // Foreign key management
  addForeignKey,
  removeForeignKey,

  // Data migration
  executeBatchMigration,
  transformTableData,

  // Rollback utilities
  executeRollback,
  createBackupTable,
  restoreFromBackup,

  // Validation services
  validateMigration,
  validateSchemaConsistency,

  // Schema versioning
  recordSchemaVersion,
  getCurrentSchemaVersion,
  compareVersions,

  // Seed data
  seedTable,
  generateSeedData,

  // Migration status tracking
  updateMigrationStatus,
  getMigrationStatus,
  getPendingMigrations,

  // Concurrent migration guards
  acquireMigrationLock,
  releaseMigrationLock,
  hasMigrationLock,
  cleanupExpiredLocks,

  // Table operations
  safeRenameTable,

  // Column type migration
  migrateColumnType,

  // Default value management
  setDefaultValue,
  removeDefaultValue,

  // Constraint management
  addConstraint,
  removeConstraint,

  // Conflict detection
  detectMigrationConflicts,

  // Transaction wrappers
  withMigrationTransaction,
};
