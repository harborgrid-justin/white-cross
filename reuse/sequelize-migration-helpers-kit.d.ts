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
import { QueryInterface, Transaction } from 'sequelize';
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
        uniqueKeys?: Record<string, {
            fields: string[];
        }>;
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
    fields: (string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    })[];
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
export declare const createMigrationMetadata: (name: string, description: string, rollbackable?: boolean) => MigrationMetadata;
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
export declare const logMigrationExecution: (queryInterface: QueryInterface, entry: AuditLogEntry, transaction?: Transaction) => Promise<void>;
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
export declare const ensureMigrationAuditTable: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<void>;
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
export declare const createTableWithConventions: (queryInterface: QueryInterface, definition: TableDefinition, transaction?: Transaction) => Promise<void>;
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
export declare const addColumnSafely: (queryInterface: QueryInterface, tableName: string, columnName: string, definition: ColumnDefinition, transaction?: Transaction) => Promise<void>;
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
export declare const removeColumnWithBackup: (queryInterface: QueryInterface, tableName: string, columnName: string, createBackup?: boolean, transaction?: Transaction) => Promise<string | null>;
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
export declare const renameColumnSafely: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, transaction?: Transaction) => Promise<void>;
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
export declare const changeColumnType: (queryInterface: QueryInterface, tableName: string, columnName: string, newType: any, transformFn?: (value: any) => any, transaction?: Transaction) => Promise<void>;
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
export declare const createIndexWithNaming: (queryInterface: QueryInterface, tableName: string, definition: IndexDefinition, transaction?: Transaction) => Promise<void>;
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
export declare const createIndexConcurrently: (queryInterface: QueryInterface, tableName: string, definition: IndexDefinition) => Promise<void>;
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
export declare const removeIndexIfExists: (queryInterface: QueryInterface, tableName: string, indexName: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const listTableIndexes: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<any[]>;
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
export declare const addConstraint: (queryInterface: QueryInterface, tableName: string, definition: ConstraintDefinition, transaction?: Transaction) => Promise<void>;
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
export declare const removeConstraintIfExists: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const addForeignKey: (queryInterface: QueryInterface, tableName: string, columnName: string, referencedTable: string, referencedColumn: string, options?: {
    onUpdate?: string;
    onDelete?: string;
}, transaction?: Transaction) => Promise<void>;
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
export declare const addUniqueConstraint: (queryInterface: QueryInterface, tableName: string, columns: string[], constraintName?: string, transaction?: Transaction) => Promise<void>;
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
export declare const migrateDataInBatches: (queryInterface: QueryInterface, config: DataMigrationConfig, transaction?: Transaction) => Promise<{
    totalProcessed: number;
    totalErrors: number;
}>;
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
export declare const transformColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, transformFn: (value: any, row: any) => any, transaction?: Transaction) => Promise<number>;
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
export declare const copyTableData: (queryInterface: QueryInterface, sourceTable: string, targetTable: string, columnMapping: Record<string, string>, transformFn?: (row: any) => any, transaction?: Transaction) => Promise<number>;
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
export declare const validateMigratedData: (queryInterface: QueryInterface, tableName: string, validationRules: Array<(row: any) => boolean>, transaction?: Transaction) => Promise<{
    valid: number;
    invalid: number;
    invalidRows: any[];
}>;
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
export declare const createBackupTable: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<string>;
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
export declare const restoreFromBackup: (queryInterface: QueryInterface, tableName: string, backupTableName: string, transaction?: Transaction) => Promise<void>;
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
export declare const rollbackToPointInTime: (queryInterface: QueryInterface, tableName: string, pointInTime: Date, transaction?: Transaction) => Promise<number>;
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
export declare const bulkInsertSeed: (queryInterface: QueryInterface, seedConfig: SeedData, transaction?: Transaction) => Promise<number>;
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
export declare const removeSeedData: (queryInterface: QueryInterface, tableName: string, criteria: Record<string, any>, transaction?: Transaction) => Promise<number>;
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
export declare const compareSchemas: (sourceInterface: QueryInterface, targetInterface: QueryInterface) => Promise<SchemaComparison>;
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
export declare const getTableSchema: (queryInterface: QueryInterface, tableName: string) => Promise<Record<string, any>>;
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
export declare const exportSchemaAsMigration: (queryInterface: QueryInterface, tableName: string) => Promise<string>;
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
export declare const testMigration: (queryInterface: QueryInterface, upFn: () => Promise<void>, downFn: () => Promise<void>) => Promise<{
    upSuccess: boolean;
    downSuccess: boolean;
    errors: Error[];
}>;
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
export declare const runMigrationTests: (queryInterface: QueryInterface, testCases: MigrationTestCase[]) => Promise<{
    passed: number;
    failed: number;
    results: any[];
}>;
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
export declare const validateMigrationStructure: (migration: any) => {
    valid: boolean;
    errors: string[];
};
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
export declare const executeZeroDowntimeMigration: (queryInterface: QueryInterface, config: ZeroDowntimeConfig) => Promise<{
    success: boolean;
    completedPhases: number;
    error?: Error;
}>;
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
export declare const addColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, columnName: string, finalDefinition: ColumnDefinition, defaultValue: any, transaction?: Transaction) => Promise<void>;
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
export declare const removeColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<string>;
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
export declare const renameColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, definition: ColumnDefinition, transaction?: Transaction) => Promise<void>;
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
export declare const encryptColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, encryptFn: (data: string) => Promise<string>, transaction?: Transaction) => Promise<number>;
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
export declare const decryptColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, decryptFn: (data: string) => Promise<string>, transaction?: Transaction) => Promise<number>;
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
export declare const createAuditTrailTable: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<void>;
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
export declare const tableExists: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const columnExists: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<boolean>;
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
export declare const getTableRowCount: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<number>;
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
export declare const estimateMigrationTime: (queryInterface: QueryInterface, tableName: string, rowsPerSecond?: number, transaction?: Transaction) => Promise<{
    rowCount: number;
    estimatedSeconds: number;
    estimatedMinutes: number;
}>;
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
export declare const executeRawSQL: (queryInterface: QueryInterface, sql: string, replacements?: Record<string, any>, transaction?: Transaction) => Promise<any>;
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
export declare const createEnumType: (queryInterface: QueryInterface, enumName: string, values: string[], transaction?: Transaction) => Promise<void>;
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
export declare const dropEnumType: (queryInterface: QueryInterface, enumName: string, transaction?: Transaction) => Promise<void>;
declare const _default: {
    createMigrationMetadata: (name: string, description: string, rollbackable?: boolean) => MigrationMetadata;
    logMigrationExecution: (queryInterface: QueryInterface, entry: AuditLogEntry, transaction?: Transaction) => Promise<void>;
    ensureMigrationAuditTable: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<void>;
    createTableWithConventions: (queryInterface: QueryInterface, definition: TableDefinition, transaction?: Transaction) => Promise<void>;
    addColumnSafely: (queryInterface: QueryInterface, tableName: string, columnName: string, definition: ColumnDefinition, transaction?: Transaction) => Promise<void>;
    removeColumnWithBackup: (queryInterface: QueryInterface, tableName: string, columnName: string, createBackup?: boolean, transaction?: Transaction) => Promise<string | null>;
    renameColumnSafely: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, transaction?: Transaction) => Promise<void>;
    changeColumnType: (queryInterface: QueryInterface, tableName: string, columnName: string, newType: any, transformFn?: (value: any) => any, transaction?: Transaction) => Promise<void>;
    createIndexWithNaming: (queryInterface: QueryInterface, tableName: string, definition: IndexDefinition, transaction?: Transaction) => Promise<void>;
    createIndexConcurrently: (queryInterface: QueryInterface, tableName: string, definition: IndexDefinition) => Promise<void>;
    removeIndexIfExists: (queryInterface: QueryInterface, tableName: string, indexName: string, transaction?: Transaction) => Promise<boolean>;
    listTableIndexes: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<any[]>;
    addConstraint: (queryInterface: QueryInterface, tableName: string, definition: ConstraintDefinition, transaction?: Transaction) => Promise<void>;
    removeConstraintIfExists: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<boolean>;
    addForeignKey: (queryInterface: QueryInterface, tableName: string, columnName: string, referencedTable: string, referencedColumn: string, options?: {
        onUpdate?: string;
        onDelete?: string;
    }, transaction?: Transaction) => Promise<void>;
    addUniqueConstraint: (queryInterface: QueryInterface, tableName: string, columns: string[], constraintName?: string, transaction?: Transaction) => Promise<void>;
    migrateDataInBatches: (queryInterface: QueryInterface, config: DataMigrationConfig, transaction?: Transaction) => Promise<{
        totalProcessed: number;
        totalErrors: number;
    }>;
    transformColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, transformFn: (value: any, row: any) => any, transaction?: Transaction) => Promise<number>;
    copyTableData: (queryInterface: QueryInterface, sourceTable: string, targetTable: string, columnMapping: Record<string, string>, transformFn?: (row: any) => any, transaction?: Transaction) => Promise<number>;
    validateMigratedData: (queryInterface: QueryInterface, tableName: string, validationRules: Array<(row: any) => boolean>, transaction?: Transaction) => Promise<{
        valid: number;
        invalid: number;
        invalidRows: any[];
    }>;
    createBackupTable: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<string>;
    restoreFromBackup: (queryInterface: QueryInterface, tableName: string, backupTableName: string, transaction?: Transaction) => Promise<void>;
    rollbackToPointInTime: (queryInterface: QueryInterface, tableName: string, pointInTime: Date, transaction?: Transaction) => Promise<number>;
    bulkInsertSeed: (queryInterface: QueryInterface, seedConfig: SeedData, transaction?: Transaction) => Promise<number>;
    removeSeedData: (queryInterface: QueryInterface, tableName: string, criteria: Record<string, any>, transaction?: Transaction) => Promise<number>;
    compareSchemas: (sourceInterface: QueryInterface, targetInterface: QueryInterface) => Promise<SchemaComparison>;
    getTableSchema: (queryInterface: QueryInterface, tableName: string) => Promise<Record<string, any>>;
    exportSchemaAsMigration: (queryInterface: QueryInterface, tableName: string) => Promise<string>;
    testMigration: (queryInterface: QueryInterface, upFn: () => Promise<void>, downFn: () => Promise<void>) => Promise<{
        upSuccess: boolean;
        downSuccess: boolean;
        errors: Error[];
    }>;
    runMigrationTests: (queryInterface: QueryInterface, testCases: MigrationTestCase[]) => Promise<{
        passed: number;
        failed: number;
        results: any[];
    }>;
    validateMigrationStructure: (migration: any) => {
        valid: boolean;
        errors: string[];
    };
    executeZeroDowntimeMigration: (queryInterface: QueryInterface, config: ZeroDowntimeConfig) => Promise<{
        success: boolean;
        completedPhases: number;
        error?: Error;
    }>;
    addColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, columnName: string, finalDefinition: ColumnDefinition, defaultValue: any, transaction?: Transaction) => Promise<void>;
    removeColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<string>;
    renameColumnZeroDowntime: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, definition: ColumnDefinition, transaction?: Transaction) => Promise<void>;
    encryptColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, encryptFn: (data: string) => Promise<string>, transaction?: Transaction) => Promise<number>;
    decryptColumnData: (queryInterface: QueryInterface, tableName: string, columnName: string, decryptFn: (data: string) => Promise<string>, transaction?: Transaction) => Promise<number>;
    createAuditTrailTable: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<void>;
    tableExists: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<boolean>;
    columnExists: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<boolean>;
    getTableRowCount: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<number>;
    estimateMigrationTime: (queryInterface: QueryInterface, tableName: string, rowsPerSecond?: number, transaction?: Transaction) => Promise<{
        rowCount: number;
        estimatedSeconds: number;
        estimatedMinutes: number;
    }>;
    executeRawSQL: (queryInterface: QueryInterface, sql: string, replacements?: Record<string, any>, transaction?: Transaction) => Promise<any>;
    createEnumType: (queryInterface: QueryInterface, enumName: string, values: string[], transaction?: Transaction) => Promise<void>;
    dropEnumType: (queryInterface: QueryInterface, enumName: string, transaction?: Transaction) => Promise<void>;
};
export default _default;
//# sourceMappingURL=sequelize-migration-helpers-kit.d.ts.map