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
import { QueryInterface, Transaction } from 'sequelize';
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
    fields: Array<string | {
        name: string;
        order?: 'ASC' | 'DESC';
    }>;
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
    fields: Array<string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    }>;
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
    errors: Array<{
        row: any;
        error: Error;
        batchNumber: number;
    }>;
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
export declare const generateMigrationFile: (config: MigrationFileConfig) => Promise<MigrationFile>;
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
export declare const getMigrationTemplate: (templateType: string, config: MigrationFileConfig) => string;
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
export declare const generateMigrationFilename: (description: string, timestamp?: Date) => string;
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
export declare const captureSchemaSnapshot: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<SchemaSnapshot>;
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
export declare const compareSchemas: (oldSchema: SchemaSnapshot, newSchema: SchemaSnapshot) => SchemaDiff;
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
export declare const safeAddColumn: (queryInterface: QueryInterface, config: SafeColumnAddConfig) => Promise<void>;
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
export declare const safeRemoveColumn: (queryInterface: QueryInterface, config: SafeColumnRemoveConfig) => Promise<void>;
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
export declare const safeRenameColumn: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, transaction?: Transaction) => Promise<void>;
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
export declare const createIndex: (queryInterface: QueryInterface, config: IndexCreationConfig) => Promise<void>;
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
export declare const removeIndex: (queryInterface: QueryInterface, tableName: string, indexName: string, concurrently?: boolean, transaction?: Transaction) => Promise<void>;
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
export declare const indexExists: (queryInterface: QueryInterface, tableName: string, indexName: string, transaction?: Transaction) => Promise<boolean>;
/**
 * 15. Gets all indexes for a table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IndexSchema[]>} Array of indexes
 */
export declare const getTableIndexes: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<IndexSchema[]>;
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
export declare const addForeignKey: (queryInterface: QueryInterface, config: ForeignKeyConfig) => Promise<void>;
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
export declare const removeForeignKey: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<void>;
/**
 * 18. Gets all foreign key constraints for a table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {string} tableName - Table name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConstraintSchema[]>} Array of constraints
 */
export declare const getTableConstraints: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<ConstraintSchema[]>;
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
export declare const executeBatchMigration: (queryInterface: QueryInterface, config: BatchMigrationConfig) => Promise<BatchMigrationResult>;
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
export declare const transformTableData: (queryInterface: QueryInterface, config: TransformationConfig) => Promise<number>;
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
export declare const executeRollback: (queryInterface: QueryInterface, config: RollbackConfig) => Promise<void>;
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
export declare const createBackupTable: (queryInterface: QueryInterface, tableName: string, backupPrefix?: string, transaction?: Transaction) => Promise<string>;
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
export declare const restoreFromBackup: (queryInterface: QueryInterface, tableName: string, backupTableName: string, transaction?: Transaction) => Promise<void>;
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
export declare const validateMigration: (queryInterface: QueryInterface, migrationName: string) => Promise<ValidationResult>;
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
export declare const validateSchemaConsistency: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<ValidationResult>;
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
export declare const recordSchemaVersion: (queryInterface: QueryInterface, version: SchemaVersion, transaction?: Transaction) => Promise<void>;
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
export declare const getCurrentSchemaVersion: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<SchemaVersion | null>;
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
export declare const compareVersions: (version1: string, version2: string) => number;
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
export declare const seedTable: (queryInterface: QueryInterface, config: SeedConfig) => Promise<number>;
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
export declare const generateSeedData: (count: number, generator: (index: number) => any) => any[];
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
export declare const updateMigrationStatus: (queryInterface: QueryInterface, status: MigrationStatus, transaction?: Transaction) => Promise<void>;
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
export declare const getMigrationStatus: (queryInterface: QueryInterface, migrationName: string, transaction?: Transaction) => Promise<MigrationStatus | null>;
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
export declare const getPendingMigrations: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<MigrationStatus[]>;
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
export declare const acquireMigrationLock: (queryInterface: QueryInterface, migrationName: string, timeoutMinutes?: number) => Promise<string>;
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
export declare const releaseMigrationLock: (queryInterface: QueryInterface, lockId: string) => Promise<void>;
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
export declare const hasMigrationLock: (queryInterface: QueryInterface, migrationName: string) => Promise<boolean>;
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
export declare const cleanupExpiredLocks: (queryInterface: QueryInterface) => Promise<number>;
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
export declare const safeRenameTable: (queryInterface: QueryInterface, config: TableRenameConfig) => Promise<void>;
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
export declare const migrateColumnType: (queryInterface: QueryInterface, config: ColumnTypeMigrationConfig) => Promise<void>;
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
export declare const setDefaultValue: (queryInterface: QueryInterface, config: DefaultValueConfig) => Promise<void>;
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
export declare const removeDefaultValue: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<void>;
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
export declare const addConstraint: (queryInterface: QueryInterface, constraint: ConstraintSchema, transaction?: Transaction) => Promise<void>;
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
export declare const removeConstraint: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<void>;
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
export declare const detectMigrationConflicts: (queryInterface: QueryInterface, migrationName: string) => Promise<MigrationConflict[]>;
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
export declare const withMigrationTransaction: (queryInterface: QueryInterface, callback: (transaction: Transaction) => Promise<void>) => Promise<void>;
declare const _default: {
    generateMigrationFile: (config: MigrationFileConfig) => Promise<MigrationFile>;
    getMigrationTemplate: (templateType: string, config: MigrationFileConfig) => string;
    generateMigrationFilename: (description: string, timestamp?: Date) => string;
    captureSchemaSnapshot: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<SchemaSnapshot>;
    compareSchemas: (oldSchema: SchemaSnapshot, newSchema: SchemaSnapshot) => SchemaDiff;
    getTableIndexes: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<IndexSchema[]>;
    getTableConstraints: (queryInterface: QueryInterface, tableName: string, transaction?: Transaction) => Promise<ConstraintSchema[]>;
    safeAddColumn: (queryInterface: QueryInterface, config: SafeColumnAddConfig) => Promise<void>;
    safeRemoveColumn: (queryInterface: QueryInterface, config: SafeColumnRemoveConfig) => Promise<void>;
    safeRenameColumn: (queryInterface: QueryInterface, tableName: string, oldColumnName: string, newColumnName: string, transaction?: Transaction) => Promise<void>;
    createIndex: (queryInterface: QueryInterface, config: IndexCreationConfig) => Promise<void>;
    removeIndex: (queryInterface: QueryInterface, tableName: string, indexName: string, concurrently?: boolean, transaction?: Transaction) => Promise<void>;
    indexExists: (queryInterface: QueryInterface, tableName: string, indexName: string, transaction?: Transaction) => Promise<boolean>;
    addForeignKey: (queryInterface: QueryInterface, config: ForeignKeyConfig) => Promise<void>;
    removeForeignKey: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<void>;
    executeBatchMigration: (queryInterface: QueryInterface, config: BatchMigrationConfig) => Promise<BatchMigrationResult>;
    transformTableData: (queryInterface: QueryInterface, config: TransformationConfig) => Promise<number>;
    executeRollback: (queryInterface: QueryInterface, config: RollbackConfig) => Promise<void>;
    createBackupTable: (queryInterface: QueryInterface, tableName: string, backupPrefix?: string, transaction?: Transaction) => Promise<string>;
    restoreFromBackup: (queryInterface: QueryInterface, tableName: string, backupTableName: string, transaction?: Transaction) => Promise<void>;
    validateMigration: (queryInterface: QueryInterface, migrationName: string) => Promise<ValidationResult>;
    validateSchemaConsistency: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<ValidationResult>;
    recordSchemaVersion: (queryInterface: QueryInterface, version: SchemaVersion, transaction?: Transaction) => Promise<void>;
    getCurrentSchemaVersion: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<SchemaVersion | null>;
    compareVersions: (version1: string, version2: string) => number;
    seedTable: (queryInterface: QueryInterface, config: SeedConfig) => Promise<number>;
    generateSeedData: (count: number, generator: (index: number) => any) => any[];
    updateMigrationStatus: (queryInterface: QueryInterface, status: MigrationStatus, transaction?: Transaction) => Promise<void>;
    getMigrationStatus: (queryInterface: QueryInterface, migrationName: string, transaction?: Transaction) => Promise<MigrationStatus | null>;
    getPendingMigrations: (queryInterface: QueryInterface, transaction?: Transaction) => Promise<MigrationStatus[]>;
    acquireMigrationLock: (queryInterface: QueryInterface, migrationName: string, timeoutMinutes?: number) => Promise<string>;
    releaseMigrationLock: (queryInterface: QueryInterface, lockId: string) => Promise<void>;
    hasMigrationLock: (queryInterface: QueryInterface, migrationName: string) => Promise<boolean>;
    cleanupExpiredLocks: (queryInterface: QueryInterface) => Promise<number>;
    safeRenameTable: (queryInterface: QueryInterface, config: TableRenameConfig) => Promise<void>;
    migrateColumnType: (queryInterface: QueryInterface, config: ColumnTypeMigrationConfig) => Promise<void>;
    setDefaultValue: (queryInterface: QueryInterface, config: DefaultValueConfig) => Promise<void>;
    removeDefaultValue: (queryInterface: QueryInterface, tableName: string, columnName: string, transaction?: Transaction) => Promise<void>;
    addConstraint: (queryInterface: QueryInterface, constraint: ConstraintSchema, transaction?: Transaction) => Promise<void>;
    removeConstraint: (queryInterface: QueryInterface, tableName: string, constraintName: string, transaction?: Transaction) => Promise<void>;
    detectMigrationConflicts: (queryInterface: QueryInterface, migrationName: string) => Promise<MigrationConflict[]>;
    withMigrationTransaction: (queryInterface: QueryInterface, callback: (transaction: Transaction) => Promise<void>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=sequelize-migration-kit.d.ts.map