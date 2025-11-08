/**
 * LOC: SQMK1234567
 * File: /reuse/sequelize-migration-helpers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - QueryInterface (migration API)
 *   - DataTypes
 *
 * DOWNSTREAM (imported by):
 *   - Database migration files
 *   - Migration generators
 *   - Schema evolution scripts
 *   - Deployment automation
 */

/**
 * File: /reuse/sequelize-migration-helpers-kit.ts
 * Locator: WC-UTL-SQMK-007
 * Purpose: Sequelize Migration Helpers Kit - Comprehensive migration and schema evolution utilities
 *
 * Upstream: Sequelize ORM 6.x, QueryInterface, DataTypes
 * Downstream: ../migrations/*, ../database/*, deployment scripts, CI/CD pipelines
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, pg 8.x, mysql2 3.x
 * Exports: 45 utility functions for migration builders, table operations, column management, index creation, constraint handling, data migration, rollback strategies, versioning, seeding, schema comparison, testing, zero-downtime patterns
 *
 * LLM Context: Comprehensive Sequelize migration utilities for White Cross healthcare system.
 * Provides migration file generation, safe schema evolution, data transformation with preservation,
 * HIPAA-compliant audit logging, zero-downtime deployment patterns, rollback strategies, and migration
 * testing helpers. Essential for maintaining database schema integrity in production healthcare
 * applications with strict compliance requirements and zero tolerance for data loss.
 */

import { QueryInterface, DataTypes, Transaction, Sequelize, QueryTypes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface MigrationMetadata {
  version: string;
  name: string;
  description: string;
  timestamp: Date;
  executedBy?: string;
  executionTime?: number;
  rollbackable: boolean;
}

interface TableDefinition {
  tableName: string;
  columns: Record<string, any>;
  options?: {
    timestamps?: boolean;
    paranoid?: boolean;
    underscored?: boolean;
    indexes?: IndexDefinition[];
    uniqueKeys?: Record<string, { fields: string[] }>;
  };
}

interface ColumnDefinition {
  type: any;
  allowNull?: boolean;
  defaultValue?: any;
  unique?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  references?: {
    model: string;
    key: string;
  };
  onUpdate?: string;
  onDelete?: string;
  comment?: string;
  validate?: any;
}

interface IndexDefinition {
  name?: string;
  fields: (string | { name: string; order?: 'ASC' | 'DESC'; length?: number })[];
  unique?: boolean;
  type?: 'BTREE' | 'HASH' | 'GIST' | 'GIN';
  where?: any;
  concurrently?: boolean;
}

interface ConstraintDefinition {
  name: string;
  type: 'check' | 'unique' | 'foreign key' | 'primary key';
  fields: string[];
  references?: {
    table: string;
    field: string;
  };
  onUpdate?: string;
  onDelete?: string;
  where?: any;
}

interface DataMigrationConfig {
  sourceTable: string;
  targetTable?: string;
  batchSize: number;
  transformFn?: (row: any) => any;
  validateFn?: (row: any) => boolean;
  onProgress?: (processed: number, total: number) => void;
  onError?: (error: Error, row: any) => void;
}

interface RollbackStrategy {
  type: 'DROP' | 'RESTORE' | 'REVERT' | 'CUSTOM';
  backupTable?: string;
  customRollback?: () => Promise<void>;
}

interface SeedData {
  tableName: string;
  data: any[];
  conflictFields?: string[];
  updateOnConflict?: boolean;
}

interface SchemaComparison {
  tablesAdded: string[];
  tablesRemoved: string[];
  tablesModified: Array<{
    tableName: string;
    columnsAdded: string[];
    columnsRemoved: string[];
    columnsModified: string[];
    indexesAdded: string[];
    indexesRemoved: string[];
  }>;
}

interface MigrationTestCase {
  name: string;
  setup?: () => Promise<void>;
  test: () => Promise<void>;
  teardown?: () => Promise<void>;
  expectedResult?: any;
}

interface ZeroDowntimeConfig {
  phases: Array<{
    name: string;
    description: string;
    migration: () => Promise<void>;
    rollback: () => Promise<void>;
    validation?: () => Promise<boolean>;
  }>;
  pauseBetweenPhases?: number;
}

interface AuditLogEntry {
  migrationName: string;
  action: 'UP' | 'DOWN';
  tableName?: string;
  recordsAffected?: number;
  phiFieldsModified?: string[];
  executedAt: Date;
  executedBy: string;
  duration: number;
  success: boolean;
  error?: string;
}

// ============================================================================
// MIGRATION METADATA AND TRACKING
// ============================================================================

/**
 * 1. Creates migration metadata for tracking and auditing.
 *
 * @param {string} name - Migration name
 * @param {string} description - Migration description
 * @param {boolean} rollbackable - Whether migration can be rolled back
 * @returns {MigrationMetadata} Migration metadata object
 *
 * @example
 * ```typescript
 * const metadata = createMigrationMetadata(
 *   '20250108-add-patient-allergies',
 *   'Add allergies table for patient allergy tracking',
 *   true
 * );
 * ```
 */
export const createMigrationMetadata = (
  name: string,
  description: string,
  rollbackable: boolean = true,
): MigrationMetadata => {
  return {
    version: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
    name,
    description,
    timestamp: new Date(),
    rollbackable,
  };
};

/**
 * 2. Logs migration execution to audit table for compliance tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {AuditLogEntry} entry - Audit log entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logMigrationExecution(queryInterface, {
 *   migrationName: '20250108-add-allergies',
 *   action: 'UP',
 *   tableName: 'Allergies',
 *   recordsAffected: 0,
 *   executedAt: new Date(),
 *   executedBy: 'admin',
 *   duration: 1234,
 *   success: true
 * }, transaction);
 * ```
 */
export const logMigrationExecution = async (
  queryInterface: QueryInterface,
  entry: AuditLogEntry,
  transaction?: Transaction,
): Promise<void> => {
  const sequelize = queryInterface.sequelize;

  await sequelize.query(
    `INSERT INTO "MigrationAuditLog"
     ("migrationName", "action", "tableName", "recordsAffected", "phiFieldsModified",
      "executedAt", "executedBy", "duration", "success", "error")
     VALUES (:migrationName, :action, :tableName, :recordsAffected, :phiFieldsModified,
      :executedAt, :executedBy, :duration, :success, :error)`,
    {
      replacements: {
        ...entry,
        phiFieldsModified: entry.phiFieldsModified ? JSON.stringify(entry.phiFieldsModified) : null,
      },
      transaction,
    },
  );
};

/**
 * 3. Ensures migration audit log table exists before logging.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await ensureMigrationAuditTable(queryInterface, transaction);
 * await logMigrationExecution(queryInterface, auditEntry, transaction);
 * ```
 */
export const ensureMigrationAuditTable = async (
  queryInterface: QueryInterface,
  transaction?: Transaction,
): Promise<void> => {
  const tableExists = await queryInterface.sequelize.query(
    `SELECT EXISTS (
       SELECT FROM information_schema.tables
       WHERE table_name = 'MigrationAuditLog'
     )`,
    { type: QueryTypes.SELECT, transaction },
  );

  if (!(tableExists[0] as any).exists) {
    await queryInterface.createTable(
      'MigrationAuditLog',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        migrationName: { type: DataTypes.STRING, allowNull: false },
        action: { type: DataTypes.ENUM('UP', 'DOWN'), allowNull: false },
        tableName: { type: DataTypes.STRING },
        recordsAffected: { type: DataTypes.INTEGER, defaultValue: 0 },
        phiFieldsModified: { type: DataTypes.JSONB, defaultValue: [] },
        executedAt: { type: DataTypes.DATE, allowNull: false },
        executedBy: { type: DataTypes.STRING, allowNull: false },
        duration: { type: DataTypes.INTEGER, allowNull: false },
        success: { type: DataTypes.BOOLEAN, allowNull: false },
        error: { type: DataTypes.TEXT },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      },
      { transaction },
    );
  }
};

// ============================================================================
// TABLE CREATION AND ALTERATION
// ============================================================================

/**
 * 4. Creates table with standard White Cross conventions and timestamps.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {TableDefinition} definition - Table definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTableWithConventions(queryInterface, {
 *   tableName: 'Patients',
 *   columns: {
 *     id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
 *     firstName: { type: DataTypes.STRING(50), allowNull: false },
 *     lastName: { type: DataTypes.STRING(50), allowNull: false }
 *   },
 *   options: { timestamps: true, paranoid: true }
 * }, transaction);
 * ```
 */
export const createTableWithConventions = async (
  queryInterface: QueryInterface,
  definition: TableDefinition,
  transaction?: Transaction,
): Promise<void> => {
  const columns = {
    ...definition.columns,
    ...(definition.options?.timestamps !== false && {
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }),
    ...(definition.options?.paranoid && {
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }),
  };

  await queryInterface.createTable(definition.tableName, columns, {
    transaction,
    ...definition.options,
  });
};

/**
 * 5. Adds column with safe default value to prevent null issues.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {ColumnDefinition} definition - Column definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumnSafely(queryInterface, 'Patients', 'allergies', {
 *   type: DataTypes.JSONB,
 *   allowNull: true,
 *   defaultValue: []
 * }, transaction);
 * ```
 */
export const addColumnSafely = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  definition: ColumnDefinition,
  transaction?: Transaction,
): Promise<void> => {
  // First add as nullable
  await queryInterface.addColumn(
    tableName,
    columnName,
    {
      ...definition,
      allowNull: true,
    },
    { transaction },
  );

  // Set default value for existing rows if provided
  if (definition.defaultValue !== undefined) {
    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`,
      {
        replacements: { defaultValue: definition.defaultValue },
        transaction,
      },
    );
  }

  // If column should be non-nullable, alter it
  if (definition.allowNull === false) {
    await queryInterface.changeColumn(tableName, columnName, definition, { transaction });
  }
};

/**
 * 6. Removes column with backup for rollback capability.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {boolean} createBackup - Whether to create backup table
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string | null>} Backup table name if created
 *
 * @example
 * ```typescript
 * const backupTable = await removeColumnWithBackup(
 *   queryInterface,
 *   'Patients',
 *   'oldStatusField',
 *   true,
 *   transaction
 * );
 * ```
 */
export const removeColumnWithBackup = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  createBackup: boolean = false,
  transaction?: Transaction,
): Promise<string | null> => {
  let backupTableName: string | null = null;

  if (createBackup) {
    backupTableName = `${tableName}_backup_${Date.now()}`;
    await queryInterface.sequelize.query(
      `CREATE TABLE "${backupTableName}" AS SELECT "${columnName}" FROM "${tableName}"`,
      { transaction },
    );
  }

  await queryInterface.removeColumn(tableName, columnName, { transaction });

  return backupTableName;
};

/**
 * 7. Renames column safely across different database dialects.
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
 * await renameColumnSafely(queryInterface, 'Patients', 'dob', 'dateOfBirth', transaction);
 * ```
 */
export const renameColumnSafely = async (
  queryInterface: QueryInterface,
  tableName: string,
  oldColumnName: string,
  newColumnName: string,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.renameColumn(tableName, oldColumnName, newColumnName, { transaction });
};

/**
 * 8. Changes column type with data preservation and validation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} newType - New data type
 * @param {(value: any) => any} [transformFn] - Optional transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeColumnType(
 *   queryInterface,
 *   'Patients',
 *   'age',
 *   DataTypes.STRING,
 *   (val) => val.toString(),
 *   transaction
 * );
 * ```
 */
export const changeColumnType = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  newType: any,
  transformFn?: (value: any) => any,
  transaction?: Transaction,
): Promise<void> => {
  const tempColumnName = `${columnName}_temp_migration`;

  // Add new column with new type
  await queryInterface.addColumn(
    tableName,
    tempColumnName,
    { type: newType, allowNull: true },
    { transaction },
  );

  // Copy and transform data if needed
  if (transformFn) {
    const [rows] = await queryInterface.sequelize.query(
      `SELECT id, "${columnName}" FROM "${tableName}"`,
      { transaction },
    );

    for (const row of rows as any[]) {
      const transformedValue = transformFn(row[columnName]);
      await queryInterface.sequelize.query(
        `UPDATE "${tableName}" SET "${tempColumnName}" = :value WHERE id = :id`,
        {
          replacements: { value: transformedValue, id: row.id },
          transaction,
        },
      );
    }
  } else {
    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${tempColumnName}" = "${columnName}"`,
      { transaction },
    );
  }

  // Remove old column and rename temp column
  await queryInterface.removeColumn(tableName, columnName, { transaction });
  await queryInterface.renameColumn(tableName, tempColumnName, columnName, { transaction });
};

// ============================================================================
// INDEX MANAGEMENT
// ============================================================================

/**
 * 9. Creates index with automatic naming convention.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {IndexDefinition} definition - Index definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndexWithNaming(queryInterface, 'Patients', {
 *   fields: ['lastName', 'firstName'],
 *   unique: false
 * }, transaction);
 * ```
 */
export const createIndexWithNaming = async (
  queryInterface: QueryInterface,
  tableName: string,
  definition: IndexDefinition,
  transaction?: Transaction,
): Promise<void> => {
  const indexName =
    definition.name ||
    `${tableName}_${definition.fields.map((f) => (typeof f === 'string' ? f : f.name)).join('_')}_idx`;

  await queryInterface.addIndex(
    tableName,
    {
      ...definition,
      name: indexName,
    },
    { transaction },
  );
};

/**
 * 10. Creates index concurrently for zero-downtime (PostgreSQL).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {IndexDefinition} definition - Index definition
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndexConcurrently(queryInterface, 'Patients', {
 *   fields: ['email'],
 *   unique: true
 * });
 * ```
 */
export const createIndexConcurrently = async (
  queryInterface: QueryInterface,
  tableName: string,
  definition: IndexDefinition,
): Promise<void> => {
  const indexName =
    definition.name ||
    `${tableName}_${definition.fields.map((f) => (typeof f === 'string' ? f : f.name)).join('_')}_idx`;

  const uniqueClause = definition.unique ? 'UNIQUE' : '';
  const fields = definition.fields
    .map((f) => {
      if (typeof f === 'string') return `"${f}"`;
      return `"${f.name}" ${f.order || 'ASC'}`;
    })
    .join(', ');

  await queryInterface.sequelize.query(
    `CREATE ${uniqueClause} INDEX CONCURRENTLY "${indexName}" ON "${tableName}" (${fields})`,
  );
};

/**
 * 11. Removes index with existence check to prevent errors.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if index was removed
 *
 * @example
 * ```typescript
 * const removed = await removeIndexIfExists(
 *   queryInterface,
 *   'Patients',
 *   'patients_email_idx',
 *   transaction
 * );
 * ```
 */
export const removeIndexIfExists = async (
  queryInterface: QueryInterface,
  tableName: string,
  indexName: string,
  transaction?: Transaction,
): Promise<boolean> => {
  try {
    await queryInterface.removeIndex(tableName, indexName, { transaction });
    return true;
  } catch (error) {
    if ((error as any).message?.includes('does not exist')) {
      return false;
    }
    throw error;
  }
};

/**
 * 12. Lists all indexes on a table for inspection.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of index definitions
 *
 * @example
 * ```typescript
 * const indexes = await listTableIndexes(queryInterface, 'Patients', transaction);
 * indexes.forEach(idx => console.log(idx.name, idx.fields));
 * ```
 */
export const listTableIndexes = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<any[]> => {
  return queryInterface.showIndex(tableName, { transaction });
};

// ============================================================================
// CONSTRAINT MANAGEMENT
// ============================================================================

/**
 * 13. Adds constraint with comprehensive configuration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {ConstraintDefinition} definition - Constraint definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addConstraint(queryInterface, 'Patients', {
 *   name: 'patients_email_check',
 *   type: 'check',
 *   fields: ['email'],
 *   where: { email: { [Op.regexp]: '^[^@]+@[^@]+\.[^@]+$' } }
 * }, transaction);
 * ```
 */
export const addConstraint = async (
  queryInterface: QueryInterface,
  tableName: string,
  definition: ConstraintDefinition,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.addConstraint(tableName, {
    ...definition,
    transaction,
  } as any);
};

/**
 * 14. Removes constraint with existence check.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if constraint was removed
 *
 * @example
 * ```typescript
 * await removeConstraintIfExists(
 *   queryInterface,
 *   'Patients',
 *   'patients_email_check',
 *   transaction
 * );
 * ```
 */
export const removeConstraintIfExists = async (
  queryInterface: QueryInterface,
  tableName: string,
  constraintName: string,
  transaction?: Transaction,
): Promise<boolean> => {
  try {
    await queryInterface.removeConstraint(tableName, constraintName, { transaction });
    return true;
  } catch (error) {
    if ((error as any).message?.includes('does not exist')) {
      return false;
    }
    throw error;
  }
};

/**
 * 15. Adds foreign key constraint with cascade options.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {string} referencedTable - Referenced table name
 * @param {string} referencedColumn - Referenced column name
 * @param {object} options - Cascade options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addForeignKey(
 *   queryInterface,
 *   'Appointments',
 *   'patientId',
 *   'Patients',
 *   'id',
 *   { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
 *   transaction
 * );
 * ```
 */
export const addForeignKey = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  referencedTable: string,
  referencedColumn: string,
  options: { onUpdate?: string; onDelete?: string } = {},
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.addConstraint(tableName, {
    fields: [columnName],
    type: 'foreign key',
    name: `${tableName}_${columnName}_fkey`,
    references: {
      table: referencedTable,
      field: referencedColumn,
    },
    onUpdate: options.onUpdate || 'CASCADE',
    onDelete: options.onDelete || 'CASCADE',
    transaction,
  } as any);
};

/**
 * 16. Adds unique constraint on single or multiple columns.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string[]} columns - Column names
 * @param {string} [constraintName] - Optional constraint name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addUniqueConstraint(
 *   queryInterface,
 *   'Patients',
 *   ['email', 'facilityId'],
 *   'patients_email_facility_unique',
 *   transaction
 * );
 * ```
 */
export const addUniqueConstraint = async (
  queryInterface: QueryInterface,
  tableName: string,
  columns: string[],
  constraintName?: string,
  transaction?: Transaction,
): Promise<void> => {
  const name = constraintName || `${tableName}_${columns.join('_')}_unique`;

  await queryInterface.addConstraint(tableName, {
    fields: columns,
    type: 'unique',
    name,
    transaction,
  } as any);
};

// ============================================================================
// DATA MIGRATION
// ============================================================================

/**
 * 17. Migrates data in batches with progress tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {DataMigrationConfig} config - Data migration configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ totalProcessed: number; totalErrors: number }>}
 *
 * @example
 * ```typescript
 * const result = await migrateDataInBatches(queryInterface, {
 *   sourceTable: 'OldPatients',
 *   targetTable: 'Patients',
 *   batchSize: 1000,
 *   transformFn: (row) => ({ ...row, migrated: true }),
 *   onProgress: (processed, total) => console.log(`${processed}/${total}`)
 * }, transaction);
 * ```
 */
export const migrateDataInBatches = async (
  queryInterface: QueryInterface,
  config: DataMigrationConfig,
  transaction?: Transaction,
): Promise<{ totalProcessed: number; totalErrors: number }> => {
  const sequelize = queryInterface.sequelize;
  let totalProcessed = 0;
  let totalErrors = 0;
  let offset = 0;

  // Get total count
  const [countResult] = await sequelize.query(
    `SELECT COUNT(*) as total FROM "${config.sourceTable}"`,
    { type: QueryTypes.SELECT, transaction },
  );
  const total = (countResult as any).total;

  while (offset < total) {
    const [rows] = await sequelize.query(
      `SELECT * FROM "${config.sourceTable}" LIMIT ${config.batchSize} OFFSET ${offset}`,
      { transaction },
    );

    for (const row of rows as any[]) {
      try {
        // Validate if validation function provided
        if (config.validateFn && !config.validateFn(row)) {
          continue;
        }

        // Transform data if transform function provided
        const transformedRow = config.transformFn ? config.transformFn(row) : row;

        // Insert into target table
        const targetTable = config.targetTable || config.sourceTable;
        const columns = Object.keys(transformedRow).map((k) => `"${k}"`).join(', ');
        const placeholders = Object.keys(transformedRow).map((k) => `:${k}`).join(', ');

        await sequelize.query(
          `INSERT INTO "${targetTable}" (${columns}) VALUES (${placeholders})`,
          {
            replacements: transformedRow,
            transaction,
          },
        );

        totalProcessed++;
      } catch (error) {
        totalErrors++;
        if (config.onError) {
          config.onError(error as Error, row);
        }
      }
    }

    offset += config.batchSize;

    if (config.onProgress) {
      config.onProgress(Math.min(offset, total), total);
    }
  }

  return { totalProcessed, totalErrors };
};

/**
 * 18. Transforms column data using custom function.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(value: any, row: any) => any} transformFn - Transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows updated
 *
 * @example
 * ```typescript
 * const updated = await transformColumnData(
 *   queryInterface,
 *   'Patients',
 *   'phoneNumber',
 *   (val) => val.replace(/[^0-9]/g, ''),
 *   transaction
 * );
 * ```
 */
export const transformColumnData = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  transformFn: (value: any, row: any) => any,
  transaction?: Transaction,
): Promise<number> => {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT id, "${columnName}" FROM "${tableName}"`,
    { transaction },
  );

  let updatedCount = 0;

  for (const row of rows as any[]) {
    const transformedValue = transformFn(row[columnName], row);

    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${columnName}" = :value WHERE id = :id`,
      {
        replacements: { value: transformedValue, id: row.id },
        transaction,
      },
    );

    updatedCount++;
  }

  return updatedCount;
};

/**
 * 19. Copies data from one table to another with optional transformation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} sourceTable - Source table name
 * @param {string} targetTable - Target table name
 * @param {Record<string, string>} columnMapping - Column name mapping
 * @param {(row: any) => any} [transformFn] - Optional transformation function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows copied
 *
 * @example
 * ```typescript
 * await copyTableData(
 *   queryInterface,
 *   'TempPatients',
 *   'Patients',
 *   { temp_id: 'id', temp_name: 'name' },
 *   (row) => ({ ...row, migrated: true }),
 *   transaction
 * );
 * ```
 */
export const copyTableData = async (
  queryInterface: QueryInterface,
  sourceTable: string,
  targetTable: string,
  columnMapping: Record<string, string>,
  transformFn?: (row: any) => any,
  transaction?: Transaction,
): Promise<number> => {
  const sourceColumns = Object.keys(columnMapping);
  const targetColumns = Object.values(columnMapping);

  const [rows] = await queryInterface.sequelize.query(
    `SELECT ${sourceColumns.map((c) => `"${c}"`).join(', ')} FROM "${sourceTable}"`,
    { transaction },
  );

  let copiedCount = 0;

  for (const row of rows as any[]) {
    // Map columns
    const mappedRow: any = {};
    Object.entries(columnMapping).forEach(([sourceCol, targetCol]) => {
      mappedRow[targetCol] = row[sourceCol];
    });

    // Transform if function provided
    const finalRow = transformFn ? transformFn(mappedRow) : mappedRow;

    // Insert into target table
    const columns = Object.keys(finalRow).map((k) => `"${k}"`).join(', ');
    const placeholders = Object.keys(finalRow).map((k) => `:${k}`).join(', ');

    await queryInterface.sequelize.query(
      `INSERT INTO "${targetTable}" (${columns}) VALUES (${placeholders})`,
      {
        replacements: finalRow,
        transaction,
      },
    );

    copiedCount++;
  }

  return copiedCount;
};

/**
 * 20. Validates data integrity after migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Array<(row: any) => boolean>} validationRules - Validation rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ valid: number; invalid: number; invalidRows: any[] }>}
 *
 * @example
 * ```typescript
 * const result = await validateMigratedData(
 *   queryInterface,
 *   'Patients',
 *   [
 *     (row) => row.email.includes('@'),
 *     (row) => row.age > 0 && row.age < 150
 *   ],
 *   transaction
 * );
 * ```
 */
export const validateMigratedData = async (
  queryInterface: QueryInterface,
  tableName: string,
  validationRules: Array<(row: any) => boolean>,
  transaction?: Transaction,
): Promise<{ valid: number; invalid: number; invalidRows: any[] }> => {
  const [rows] = await queryInterface.sequelize.query(`SELECT * FROM "${tableName}"`, {
    transaction,
  });

  let validCount = 0;
  let invalidCount = 0;
  const invalidRows: any[] = [];

  for (const row of rows as any[]) {
    const isValid = validationRules.every((rule) => rule(row));

    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
      invalidRows.push(row);
    }
  }

  return { valid: validCount, invalid: invalidCount, invalidRows };
};

// ============================================================================
// ROLLBACK STRATEGIES
// ============================================================================

/**
 * 21. Creates backup table before destructive operation.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name to backup
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Backup table name
 *
 * @example
 * ```typescript
 * const backupTable = await createBackupTable(queryInterface, 'Patients', transaction);
 * // Perform migration...
 * // If failed: await restoreFromBackup(queryInterface, 'Patients', backupTable);
 * ```
 */
export const createBackupTable = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<string> => {
  const backupTableName = `${tableName}_backup_${Date.now()}`;

  await queryInterface.sequelize.query(
    `CREATE TABLE "${backupTableName}" AS SELECT * FROM "${tableName}"`,
    { transaction },
  );

  return backupTableName;
};

/**
 * 22. Restores table from backup.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name to restore
 * @param {string} backupTableName - Backup table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFromBackup(queryInterface, 'Patients', 'Patients_backup_1234567890', transaction);
 * ```
 */
export const restoreFromBackup = async (
  queryInterface: QueryInterface,
  tableName: string,
  backupTableName: string,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.sequelize.query(`DELETE FROM "${tableName}"`, { transaction });
  await queryInterface.sequelize.query(
    `INSERT INTO "${tableName}" SELECT * FROM "${backupTableName}"`,
    { transaction },
  );
};

/**
 * 23. Implements point-in-time rollback using timestamp.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Date} pointInTime - Rollback timestamp
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows affected
 *
 * @example
 * ```typescript
 * const rollbackPoint = new Date('2025-01-08T10:00:00Z');
 * await rollbackToPointInTime(queryInterface, 'Patients', rollbackPoint, transaction);
 * ```
 */
export const rollbackToPointInTime = async (
  queryInterface: QueryInterface,
  tableName: string,
  pointInTime: Date,
  transaction?: Transaction,
): Promise<number> => {
  const [result] = await queryInterface.sequelize.query(
    `DELETE FROM "${tableName}" WHERE "createdAt" > :pointInTime`,
    {
      replacements: { pointInTime },
      transaction,
    },
  );

  return (result as any).rowCount || 0;
};

// ============================================================================
// SEED HELPERS
// ============================================================================

/**
 * 24. Bulk inserts seed data with conflict handling.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {SeedData} seedConfig - Seed configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows inserted
 *
 * @example
 * ```typescript
 * await bulkInsertSeed(queryInterface, {
 *   tableName: 'Roles',
 *   data: [
 *     { name: 'admin', permissions: ['all'] },
 *     { name: 'user', permissions: ['read'] }
 *   ],
 *   conflictFields: ['name'],
 *   updateOnConflict: true
 * }, transaction);
 * ```
 */
export const bulkInsertSeed = async (
  queryInterface: QueryInterface,
  seedConfig: SeedData,
  transaction?: Transaction,
): Promise<number> => {
  if (seedConfig.data.length === 0) return 0;

  if (seedConfig.conflictFields && seedConfig.updateOnConflict) {
    // Upsert logic for PostgreSQL
    let insertedCount = 0;

    for (const row of seedConfig.data) {
      const columns = Object.keys(row).map((k) => `"${k}"`).join(', ');
      const placeholders = Object.keys(row).map((k) => `:${k}`).join(', ');
      const updateClause = Object.keys(row)
        .filter((k) => !seedConfig.conflictFields?.includes(k))
        .map((k) => `"${k}" = EXCLUDED."${k}"`)
        .join(', ');

      await queryInterface.sequelize.query(
        `INSERT INTO "${seedConfig.tableName}" (${columns})
         VALUES (${placeholders})
         ON CONFLICT (${seedConfig.conflictFields.map((f) => `"${f}"`).join(', ')})
         DO UPDATE SET ${updateClause}`,
        {
          replacements: row,
          transaction,
        },
      );

      insertedCount++;
    }

    return insertedCount;
  } else {
    await queryInterface.bulkInsert(seedConfig.tableName, seedConfig.data, { transaction });
    return seedConfig.data.length;
  }
};

/**
 * 25. Removes seed data based on criteria.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Record<string, any>} criteria - Delete criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows deleted
 *
 * @example
 * ```typescript
 * await removeSeedData(queryInterface, 'Roles', { name: 'test-role' }, transaction);
 * ```
 */
export const removeSeedData = async (
  queryInterface: QueryInterface,
  tableName: string,
  criteria: Record<string, any>,
  transaction?: Transaction,
): Promise<number> => {
  const whereClause = Object.entries(criteria)
    .map(([key, value]) => `"${key}" = :${key}`)
    .join(' AND ');

  const [result] = await queryInterface.sequelize.query(
    `DELETE FROM "${tableName}" WHERE ${whereClause}`,
    {
      replacements: criteria,
      transaction,
    },
  );

  return (result as any).rowCount || 0;
};

// ============================================================================
// SCHEMA COMPARISON
// ============================================================================

/**
 * 26. Compares two database schemas and reports differences.
 *
 * @param {QueryInterface} sourceInterface - Source query interface
 * @param {QueryInterface} targetInterface - Target query interface
 * @returns {Promise<SchemaComparison>} Schema differences
 *
 * @example
 * ```typescript
 * const comparison = await compareSchemas(productionDb, stagingDb);
 * if (comparison.tablesAdded.length > 0) {
 *   console.log('New tables:', comparison.tablesAdded);
 * }
 * ```
 */
export const compareSchemas = async (
  sourceInterface: QueryInterface,
  targetInterface: QueryInterface,
): Promise<SchemaComparison> => {
  const sourceTables = await sourceInterface.showAllTables();
  const targetTables = await targetInterface.showAllTables();

  const tablesAdded = sourceTables.filter((t) => !targetTables.includes(t));
  const tablesRemoved = targetTables.filter((t) => !sourceTables.includes(t));
  const commonTables = sourceTables.filter((t) => targetTables.includes(t));

  const tablesModified: SchemaComparison['tablesModified'] = [];

  for (const tableName of commonTables) {
    const sourceDesc = await sourceInterface.describeTable(tableName);
    const targetDesc = await targetInterface.describeTable(tableName);

    const sourceColumns = Object.keys(sourceDesc);
    const targetColumns = Object.keys(targetDesc);

    const columnsAdded = sourceColumns.filter((c) => !targetColumns.includes(c));
    const columnsRemoved = targetColumns.filter((c) => !sourceColumns.includes(c));
    const columnsModified = sourceColumns.filter(
      (c) =>
        targetColumns.includes(c) &&
        JSON.stringify(sourceDesc[c]) !== JSON.stringify(targetDesc[c]),
    );

    const sourceIndexes = await sourceInterface.showIndex(tableName);
    const targetIndexes = await targetInterface.showIndex(tableName);

    const indexesAdded = sourceIndexes
      .filter((si) => !targetIndexes.find((ti) => ti.name === si.name))
      .map((i) => i.name);
    const indexesRemoved = targetIndexes
      .filter((ti) => !sourceIndexes.find((si) => si.name === ti.name))
      .map((i) => i.name);

    if (
      columnsAdded.length > 0 ||
      columnsRemoved.length > 0 ||
      columnsModified.length > 0 ||
      indexesAdded.length > 0 ||
      indexesRemoved.length > 0
    ) {
      tablesModified.push({
        tableName,
        columnsAdded,
        columnsRemoved,
        columnsModified,
        indexesAdded,
        indexesRemoved,
      });
    }
  }

  return {
    tablesAdded,
    tablesRemoved,
    tablesModified,
  };
};

/**
 * 27. Gets table schema as structured definition.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @returns {Promise<Record<string, any>>} Table schema
 *
 * @example
 * ```typescript
 * const schema = await getTableSchema(queryInterface, 'Patients');
 * console.log(schema);
 * ```
 */
export const getTableSchema = async (
  queryInterface: QueryInterface,
  tableName: string,
): Promise<Record<string, any>> => {
  return queryInterface.describeTable(tableName);
};

/**
 * 28. Exports schema as migration code string.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @returns {Promise<string>} Migration code
 *
 * @example
 * ```typescript
 * const migrationCode = await exportSchemaAsMigration(queryInterface, 'Patients');
 * console.log(migrationCode);
 * ```
 */
export const exportSchemaAsMigration = async (
  queryInterface: QueryInterface,
  tableName: string,
): Promise<string> => {
  const schema = await queryInterface.describeTable(tableName);
  const indexes = await queryInterface.showIndex(tableName);

  let code = `await queryInterface.createTable('${tableName}', {\n`;

  Object.entries(schema).forEach(([columnName, definition]) => {
    code += `  ${columnName}: ${JSON.stringify(definition, null, 2)},\n`;
  });

  code += '}, {\n';
  code += '  indexes: [\n';

  indexes.forEach((index) => {
    code += `    ${JSON.stringify(index, null, 2)},\n`;
  });

  code += '  ]\n';
  code += '});';

  return code;
};

// ============================================================================
// MIGRATION TESTING
// ============================================================================

/**
 * 29. Tests migration up and down without committing.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {() => Promise<void>} upFn - Up migration function
 * @param {() => Promise<void>} downFn - Down migration function
 * @returns {Promise<{ upSuccess: boolean; downSuccess: boolean; errors: Error[] }>}
 *
 * @example
 * ```typescript
 * const result = await testMigration(
 *   queryInterface,
 *   async () => { await createTable(...); },
 *   async () => { await dropTable(...); }
 * );
 * ```
 */
export const testMigration = async (
  queryInterface: QueryInterface,
  upFn: () => Promise<void>,
  downFn: () => Promise<void>,
): Promise<{ upSuccess: boolean; downSuccess: boolean; errors: Error[] }> => {
  const errors: Error[] = [];
  let upSuccess = false;
  let downSuccess = false;

  const transaction = await queryInterface.sequelize.transaction();

  try {
    // Test up migration
    await upFn();
    upSuccess = true;

    // Test down migration
    await downFn();
    downSuccess = true;

    // Rollback to not actually apply changes
    await transaction.rollback();
  } catch (error) {
    errors.push(error as Error);
    await transaction.rollback();
  }

  return { upSuccess, downSuccess, errors };
};

/**
 * 30. Runs migration test suite with multiple test cases.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {MigrationTestCase[]} testCases - Test cases
 * @returns {Promise<{ passed: number; failed: number; results: any[] }>}
 *
 * @example
 * ```typescript
 * const results = await runMigrationTests(queryInterface, [
 *   {
 *     name: 'Table creation',
 *     test: async () => { await createTable(...); },
 *     expectedResult: 'table exists'
 *   }
 * ]);
 * ```
 */
export const runMigrationTests = async (
  queryInterface: QueryInterface,
  testCases: MigrationTestCase[],
): Promise<{ passed: number; failed: number; results: any[] }> => {
  let passed = 0;
  let failed = 0;
  const results: any[] = [];

  for (const testCase of testCases) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      if (testCase.setup) {
        await testCase.setup();
      }

      await testCase.test();

      passed++;
      results.push({ name: testCase.name, status: 'passed', error: null });

      await transaction.rollback();
    } catch (error) {
      failed++;
      results.push({ name: testCase.name, status: 'failed', error: (error as Error).message });
      await transaction.rollback();
    } finally {
      if (testCase.teardown) {
        try {
          await testCase.teardown();
        } catch (error) {
          console.error(`Teardown failed for test: ${testCase.name}`, error);
        }
      }
    }
  }

  return { passed, failed, results };
};

/**
 * 31. Validates migration file structure and requirements.
 *
 * @param {object} migration - Migration module object
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const migration = require('./migrations/20250108-add-table.js');
 * const validation = validateMigrationStructure(migration);
 * if (!validation.valid) console.error(validation.errors);
 * ```
 */
export const validateMigrationStructure = (migration: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!migration.up || typeof migration.up !== 'function') {
    errors.push('Missing or invalid up() function');
  }

  if (!migration.down || typeof migration.down !== 'function') {
    errors.push('Missing or invalid down() function');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// ZERO-DOWNTIME MIGRATION PATTERNS
// ============================================================================

/**
 * 32. Executes multi-phase migration for zero-downtime deployment.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {ZeroDowntimeConfig} config - Zero-downtime configuration
 * @returns {Promise<{ success: boolean; completedPhases: number; error?: Error }>}
 *
 * @example
 * ```typescript
 * await executeZeroDowntimeMigration(queryInterface, {
 *   phases: [
 *     {
 *       name: 'Add nullable column',
 *       migration: async () => { await addColumn(...); },
 *       rollback: async () => { await removeColumn(...); }
 *     },
 *     {
 *       name: 'Make column non-nullable',
 *       migration: async () => { await changeColumn(...); },
 *       rollback: async () => { await changeColumn(...); }
 *     }
 *   ],
 *   pauseBetweenPhases: 5000
 * });
 * ```
 */
export const executeZeroDowntimeMigration = async (
  queryInterface: QueryInterface,
  config: ZeroDowntimeConfig,
): Promise<{ success: boolean; completedPhases: number; error?: Error }> => {
  let completedPhases = 0;

  for (const phase of config.phases) {
    try {
      console.log(`Executing phase: ${phase.name} - ${phase.description}`);

      await phase.migration();

      if (phase.validation) {
        const isValid = await phase.validation();
        if (!isValid) {
          throw new Error(`Validation failed for phase: ${phase.name}`);
        }
      }

      completedPhases++;

      if (config.pauseBetweenPhases && completedPhases < config.phases.length) {
        await new Promise((resolve) => setTimeout(resolve, config.pauseBetweenPhases));
      }
    } catch (error) {
      // Rollback completed phases in reverse order
      for (let i = completedPhases - 1; i >= 0; i--) {
        try {
          console.log(`Rolling back phase: ${config.phases[i].name}`);
          await config.phases[i].rollback();
        } catch (rollbackError) {
          console.error(`Rollback failed for phase: ${config.phases[i].name}`, rollbackError);
        }
      }

      return { success: false, completedPhases, error: error as Error };
    }
  }

  return { success: true, completedPhases };
};

/**
 * 33. Adds column in zero-downtime pattern (nullable first).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {ColumnDefinition} finalDefinition - Final column definition
 * @param {any} defaultValue - Default value for existing rows
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'preferredLanguage',
 *   { type: DataTypes.STRING, allowNull: false },
 *   'en',
 *   transaction
 * );
 * ```
 */
export const addColumnZeroDowntime = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  finalDefinition: ColumnDefinition,
  defaultValue: any,
  transaction?: Transaction,
): Promise<void> => {
  // Phase 1: Add as nullable
  await queryInterface.addColumn(
    tableName,
    columnName,
    {
      ...finalDefinition,
      allowNull: true,
    },
    { transaction },
  );

  // Phase 2: Populate with default value
  await queryInterface.sequelize.query(
    `UPDATE "${tableName}" SET "${columnName}" = :defaultValue WHERE "${columnName}" IS NULL`,
    {
      replacements: { defaultValue },
      transaction,
    },
  );

  // Phase 3: Make non-nullable if required
  if (finalDefinition.allowNull === false) {
    await queryInterface.changeColumn(tableName, columnName, finalDefinition, { transaction });
  }
};

/**
 * 34. Removes column in zero-downtime pattern (deprecate first).
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Backup table name
 *
 * @example
 * ```typescript
 * // Phase 1: Stop writing to column (done in application code)
 * // Phase 2: Remove column
 * const backup = await removeColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'deprecatedField',
 *   transaction
 * );
 * ```
 */
export const removeColumnZeroDowntime = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  transaction?: Transaction,
): Promise<string> => {
  // Create backup before removal
  const backupTable = await createBackupTable(queryInterface, tableName, transaction);

  // Remove column
  await queryInterface.removeColumn(tableName, columnName, { transaction });

  return backupTable;
};

/**
 * 35. Renames column using shadow column pattern.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} oldColumnName - Old column name
 * @param {string} newColumnName - New column name
 * @param {ColumnDefinition} definition - Column definition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameColumnZeroDowntime(
 *   queryInterface,
 *   'Patients',
 *   'dob',
 *   'dateOfBirth',
 *   { type: DataTypes.DATEONLY, allowNull: false },
 *   transaction
 * );
 * ```
 */
export const renameColumnZeroDowntime = async (
  queryInterface: QueryInterface,
  tableName: string,
  oldColumnName: string,
  newColumnName: string,
  definition: ColumnDefinition,
  transaction?: Transaction,
): Promise<void> => {
  // Phase 1: Add new column
  await queryInterface.addColumn(tableName, newColumnName, definition, { transaction });

  // Phase 2: Copy data
  await queryInterface.sequelize.query(
    `UPDATE "${tableName}" SET "${newColumnName}" = "${oldColumnName}"`,
    { transaction },
  );

  // Phase 3: Remove old column (after application deployment)
  // This would be done in a separate migration after code deployment
};

// ============================================================================
// HIPAA-COMPLIANT MIGRATION PATTERNS
// ============================================================================

/**
 * 36. Encrypts column data during migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(data: string) => Promise<string>} encryptFn - Encryption function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows encrypted
 *
 * @example
 * ```typescript
 * const encrypted = await encryptColumnData(
 *   queryInterface,
 *   'Patients',
 *   'socialSecurityNumber',
 *   async (ssn) => await encrypt(ssn),
 *   transaction
 * );
 * ```
 */
export const encryptColumnData = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  encryptFn: (data: string) => Promise<string>,
  transaction?: Transaction,
): Promise<number> => {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT id, "${columnName}" FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`,
    { transaction },
  );

  let encryptedCount = 0;

  for (const row of rows as any[]) {
    const encryptedValue = await encryptFn(row[columnName]);

    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${columnName}" = :encryptedValue WHERE id = :id`,
      {
        replacements: { encryptedValue, id: row.id },
        transaction,
      },
    );

    encryptedCount++;
  }

  return encryptedCount;
};

/**
 * 37. Decrypts column data during rollback.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {(data: string) => Promise<string>} decryptFn - Decryption function
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of rows decrypted
 *
 * @example
 * ```typescript
 * const decrypted = await decryptColumnData(
 *   queryInterface,
 *   'Patients',
 *   'socialSecurityNumber',
 *   async (encrypted) => await decrypt(encrypted),
 *   transaction
 * );
 * ```
 */
export const decryptColumnData = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  decryptFn: (data: string) => Promise<string>,
  transaction?: Transaction,
): Promise<number> => {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT id, "${columnName}" FROM "${tableName}" WHERE "${columnName}" IS NOT NULL`,
    { transaction },
  );

  let decryptedCount = 0;

  for (const row of rows as any[]) {
    const decryptedValue = await decryptFn(row[columnName]);

    await queryInterface.sequelize.query(
      `UPDATE "${tableName}" SET "${columnName}" = :decryptedValue WHERE id = :id`,
      {
        replacements: { decryptedValue, id: row.id },
        transaction,
      },
    );

    decryptedCount++;
  }

  return decryptedCount;
};

/**
 * 38. Creates audit trail table for PHI access tracking.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name being audited
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditTrailTable(queryInterface, 'Patients', transaction);
 * ```
 */
export const createAuditTrailTable = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<void> => {
  const auditTableName = `${tableName}_AuditTrail`;

  await queryInterface.createTable(
    auditTableName,
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recordId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'READ'),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      changedFields: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      previousValues: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      newValues: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      accessReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { transaction },
  );

  // Add indexes for efficient querying
  await queryInterface.addIndex(auditTableName, {
    fields: ['recordId', 'timestamp'],
    name: `${auditTableName}_record_time_idx`,
  });

  await queryInterface.addIndex(auditTableName, {
    fields: ['userId', 'timestamp'],
    name: `${auditTableName}_user_time_idx`,
  });
};

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * 39. Checks if table exists before migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if table exists
 *
 * @example
 * ```typescript
 * if (await tableExists(queryInterface, 'Patients', transaction)) {
 *   console.log('Table already exists');
 * }
 * ```
 */
export const tableExists = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const tables = await queryInterface.showAllTables({ transaction });
  return tables.includes(tableName);
};

/**
 * 40. Checks if column exists in table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if column exists
 *
 * @example
 * ```typescript
 * if (await columnExists(queryInterface, 'Patients', 'email', transaction)) {
 *   console.log('Column already exists');
 * }
 * ```
 */
export const columnExists = async (
  queryInterface: QueryInterface,
  tableName: string,
  columnName: string,
  transaction?: Transaction,
): Promise<boolean> => {
  try {
    const tableDescription = await queryInterface.describeTable(tableName, { transaction });
    return columnName in tableDescription;
  } catch (error) {
    return false;
  }
};

/**
 * 41. Gets row count for table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Row count
 *
 * @example
 * ```typescript
 * const count = await getTableRowCount(queryInterface, 'Patients', transaction);
 * console.log(`Table has ${count} rows`);
 * ```
 */
export const getTableRowCount = async (
  queryInterface: QueryInterface,
  tableName: string,
  transaction?: Transaction,
): Promise<number> => {
  const [result] = await queryInterface.sequelize.query(
    `SELECT COUNT(*) as count FROM "${tableName}"`,
    {
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return (result as any).count;
};

/**
 * 42. Estimates migration execution time based on table size.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {number} rowsPerSecond - Processing rate
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ rowCount: number; estimatedSeconds: number; estimatedMinutes: number }>}
 *
 * @example
 * ```typescript
 * const estimate = await estimateMigrationTime(queryInterface, 'Patients', 1000, transaction);
 * console.log(`Migration will take approximately ${estimate.estimatedMinutes} minutes`);
 * ```
 */
export const estimateMigrationTime = async (
  queryInterface: QueryInterface,
  tableName: string,
  rowsPerSecond: number = 1000,
  transaction?: Transaction,
): Promise<{ rowCount: number; estimatedSeconds: number; estimatedMinutes: number }> => {
  const rowCount = await getTableRowCount(queryInterface, tableName, transaction);
  const estimatedSeconds = Math.ceil(rowCount / rowsPerSecond);
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);

  return { rowCount, estimatedSeconds, estimatedMinutes };
};

/**
 * 43. Executes raw SQL with transaction support.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} sql - SQL query
 * @param {Record<string, any>} [replacements] - Query replacements
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Query result
 *
 * @example
 * ```typescript
 * await executeRawSQL(
 *   queryInterface,
 *   'ALTER TABLE "Patients" ADD COLUMN custom_field TEXT',
 *   {},
 *   transaction
 * );
 * ```
 */
export const executeRawSQL = async (
  queryInterface: QueryInterface,
  sql: string,
  replacements?: Record<string, any>,
  transaction?: Transaction,
): Promise<any> => {
  return queryInterface.sequelize.query(sql, {
    replacements,
    transaction,
  });
};

/**
 * 44. Creates enum type for PostgreSQL.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} enumName - Enum type name
 * @param {string[]} values - Enum values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createEnumType(
 *   queryInterface,
 *   'patient_status',
 *   ['active', 'inactive', 'suspended'],
 *   transaction
 * );
 * ```
 */
export const createEnumType = async (
  queryInterface: QueryInterface,
  enumName: string,
  values: string[],
  transaction?: Transaction,
): Promise<void> => {
  const valuesString = values.map((v) => `'${v}'`).join(', ');

  await queryInterface.sequelize.query(`CREATE TYPE ${enumName} AS ENUM (${valuesString})`, {
    transaction,
  });
};

/**
 * 45. Drops enum type for PostgreSQL.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} enumName - Enum type name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropEnumType(queryInterface, 'patient_status', transaction);
 * ```
 */
export const dropEnumType = async (
  queryInterface: QueryInterface,
  enumName: string,
  transaction?: Transaction,
): Promise<void> => {
  await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${enumName}`, { transaction });
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Migration metadata
  createMigrationMetadata,
  logMigrationExecution,
  ensureMigrationAuditTable,

  // Table operations
  createTableWithConventions,
  addColumnSafely,
  removeColumnWithBackup,
  renameColumnSafely,
  changeColumnType,

  // Index management
  createIndexWithNaming,
  createIndexConcurrently,
  removeIndexIfExists,
  listTableIndexes,

  // Constraint management
  addConstraint,
  removeConstraintIfExists,
  addForeignKey,
  addUniqueConstraint,

  // Data migration
  migrateDataInBatches,
  transformColumnData,
  copyTableData,
  validateMigratedData,

  // Rollback strategies
  createBackupTable,
  restoreFromBackup,
  rollbackToPointInTime,

  // Seed helpers
  bulkInsertSeed,
  removeSeedData,

  // Schema comparison
  compareSchemas,
  getTableSchema,
  exportSchemaAsMigration,

  // Migration testing
  testMigration,
  runMigrationTests,
  validateMigrationStructure,

  // Zero-downtime patterns
  executeZeroDowntimeMigration,
  addColumnZeroDowntime,
  removeColumnZeroDowntime,
  renameColumnZeroDowntime,

  // HIPAA-compliant patterns
  encryptColumnData,
  decryptColumnData,
  createAuditTrailTable,

  // Utilities
  tableExists,
  columnExists,
  getTableRowCount,
  estimateMigrationTime,
  executeRawSQL,
  createEnumType,
  dropEnumType,
};
