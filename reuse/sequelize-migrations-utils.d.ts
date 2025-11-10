/**
 * LOC: M6I7G8R9A0
 * File: /reuse/sequelize-migrations-utils.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - fs (native)
 *   - path (native)
 *
 * DOWNSTREAM (imported by):
 *   - Migration files
 *   - Database setup scripts
 *   - Seed data generators
 */
/**
 * File: /reuse/sequelize-migrations-utils.ts
 * Locator: WC-UTL-SEQ-MIG-001
 * Purpose: Sequelize Migration Utilities - Comprehensive database migration and schema management helpers
 *
 * Upstream: sequelize v6.x, fs, path
 * Downstream: All Sequelize migrations, seeders, schema management scripts
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 40 migration utility functions for schema changes, data migrations, rollbacks, and version management
 *
 * LLM Context: Production-grade Sequelize v6.x migration utilities for White Cross healthcare platform.
 * Provides comprehensive helpers for migration generation, table operations, column modifications, index management,
 * foreign key constraints, data migrations, rollback strategies, validation, seed data, testing, version control,
 * zero-downtime deployments, and documentation. HIPAA-compliant with audit trails and data integrity checks.
 */
import { QueryInterface, ModelAttributes, IndexOptions, Model } from 'sequelize';
/**
 * Migration configuration
 */
export interface MigrationConfig {
    name: string;
    timestamp?: string;
    description?: string;
    author?: string;
    dependencies?: string[];
}
/**
 * Table creation configuration
 */
export interface TableConfig {
    tableName: string;
    schema?: string;
    columns: ModelAttributes<Model<any, any>>;
    options?: {
        charset?: string;
        collate?: string;
        engine?: string;
        comment?: string;
    };
    indexes?: IndexOptions[];
}
/**
 * Column configuration for modifications
 */
export interface ColumnConfig {
    tableName: string;
    columnName: string;
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
}
/**
 * Foreign key configuration
 */
export interface ForeignKeyConfig {
    tableName: string;
    columnName: string;
    references: {
        table: string;
        field: string;
    };
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    name?: string;
}
/**
 * Index configuration for migrations
 */
export interface MigrationIndexConfig {
    tableName: string;
    indexName?: string;
    fields: (string | {
        name: string;
        order?: 'ASC' | 'DESC';
        length?: number;
    })[];
    unique?: boolean;
    type?: string;
    where?: any;
    concurrently?: boolean;
}
/**
 * Data migration configuration
 */
export interface DataMigrationConfig {
    tableName: string;
    batchSize?: number;
    transform: (row: any) => any;
    where?: any;
    order?: any[];
}
/**
 * Rollback configuration
 */
export interface RollbackConfig {
    strategy: 'snapshot' | 'inverse' | 'custom';
    snapshotTable?: string;
    inverseOperations?: Array<() => Promise<void>>;
    customRollback?: () => Promise<void>;
}
/**
 * Seed configuration
 */
export interface SeedConfig {
    tableName: string;
    data: any[];
    updateOnDuplicate?: string[];
    ignoreDuplicates?: boolean;
}
/**
 * Migration version info
 */
export interface MigrationVersion {
    name: string;
    timestamp: Date;
    checksum?: string;
    executionTime?: number;
    status: 'pending' | 'running' | 'completed' | 'failed';
}
/**
 * Zero-downtime migration configuration
 */
export interface ZeroDowntimeConfig {
    oldTable: string;
    newTable: string;
    replicationLag?: number;
    validationQuery?: string;
    cutoverStrategy: 'instant' | 'gradual';
}
/**
 * Generates a new migration file with standardized naming and structure.
 * Creates timestamped migration with up/down methods.
 *
 * @param {string} name - Migration name
 * @param {string} migrationsDir - Migrations directory path
 * @param {string} description - Migration description
 * @returns {Promise<string>} Generated file path
 *
 * @example
 * ```typescript
 * const filePath = await generateMigrationFile(
 *   'create-patients-table',
 *   './migrations',
 *   'Creates patients table with PHI encryption'
 * );
 * ```
 */
export declare function generateMigrationFile(name: string, migrationsDir: string, description?: string): Promise<string>;
/**
 * Generates a migration for creating a new table.
 * Includes all standard columns and configurations.
 *
 * @param {TableConfig} config - Table configuration
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Generated migration code
 *
 * @example
 * ```typescript
 * await generateTableCreationMigration({
 *   tableName: 'patients',
 *   columns: {
 *     id: { type: DataTypes.UUID, primaryKey: true },
 *     firstName: { type: DataTypes.STRING, allowNull: false },
 *     lastName: { type: DataTypes.STRING, allowNull: false }
 *   },
 *   indexes: [{ fields: ['lastName', 'firstName'] }]
 * }, './migrations/create-patients.ts');
 * ```
 */
export declare function generateTableCreationMigration(config: TableConfig, outputPath: string): Promise<string>;
/**
 * Generates a migration for adding a new column.
 * Handles nullable transitions and default values.
 *
 * @param {ColumnConfig} config - Column configuration
 * @returns {string} Migration code
 *
 * @example
 * ```typescript
 * const code = generateAddColumnMigration({
 *   tableName: 'users',
 *   columnName: 'phoneNumber',
 *   type: DataTypes.STRING,
 *   allowNull: true
 * });
 * ```
 */
export declare function generateAddColumnMigration(config: ColumnConfig): string;
/**
 * Generates a migration for modifying an existing column.
 * Preserves data during type changes.
 *
 * @param {ColumnConfig} oldConfig - Current column configuration
 * @param {ColumnConfig} newConfig - New column configuration
 * @returns {string} Migration code
 *
 * @example
 * ```typescript
 * const code = generateModifyColumnMigration(
 *   { tableName: 'users', columnName: 'email', type: DataTypes.STRING(100) },
 *   { tableName: 'users', columnName: 'email', type: DataTypes.STRING(255) }
 * );
 * ```
 */
export declare function generateModifyColumnMigration(oldConfig: ColumnConfig, newConfig: ColumnConfig): string;
/**
 * Generates a data migration script template.
 * Provides batch processing and progress tracking.
 *
 * @param {string} description - Migration description
 * @param {string} tableName - Target table name
 * @returns {string} Migration template
 *
 * @example
 * ```typescript
 * const template = generateDataMigrationTemplate(
 *   'Encrypt existing patient SSNs',
 *   'patients'
 * );
 * ```
 */
export declare function generateDataMigrationTemplate(description: string, tableName: string): string;
/**
 * Creates a table with automatic timestamp columns.
 * Adds createdAt, updatedAt, and deletedAt for paranoid models.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {ModelAttributes<Model<any, any>>} attributes - Table columns
 * @param {boolean} paranoid - Whether to add deletedAt
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTableWithTimestamps(queryInterface, 'medical_records', {
 *   id: { type: DataTypes.UUID, primaryKey: true },
 *   patientId: { type: DataTypes.UUID, allowNull: false },
 *   diagnosis: { type: DataTypes.TEXT }
 * }, true);
 * ```
 */
export declare function createTableWithTimestamps(queryInterface: QueryInterface, tableName: string, attributes: ModelAttributes<Model<any, any>>, paranoid?: boolean): Promise<void>;
/**
 * Renames a table with cascade updates to foreign keys.
 * Preserves all constraints and indexes.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} oldName - Current table name
 * @param {string} newName - New table name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await renameTableSafely(queryInterface, 'old_patients', 'patients');
 * ```
 */
export declare function renameTableSafely(queryInterface: QueryInterface, oldName: string, newName: string): Promise<void>;
/**
 * Adds a column with data backfill.
 * Populates new column with computed or default values.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} columnDef - Column definition
 * @param {Function} backfillFn - Function to compute values
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addColumnWithBackfill(
 *   queryInterface,
 *   'users',
 *   'fullName',
 *   { type: DataTypes.STRING },
 *   (row) => `${row.firstName} ${row.lastName}`
 * );
 * ```
 */
export declare function addColumnWithBackfill(queryInterface: QueryInterface, tableName: string, columnName: string, columnDef: any, backfillFn: (row: any) => any): Promise<void>;
/**
 * Changes column type with safe data conversion.
 * Validates data compatibility before conversion.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {any} newType - New column type
 * @param {Function} converter - Data conversion function
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeColumnTypeSafely(
 *   queryInterface,
 *   'orders',
 *   'price',
 *   DataTypes.DECIMAL(10, 2),
 *   (value) => parseFloat(value)
 * );
 * ```
 */
export declare function changeColumnTypeSafely(queryInterface: QueryInterface, tableName: string, columnName: string, newType: any, converter?: (value: any) => any): Promise<void>;
/**
 * Drops a column with safety checks.
 * Verifies no foreign key dependencies before dropping.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} columnName - Column name
 * @param {boolean} force - Force drop without checks
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropColumnSafely(queryInterface, 'users', 'legacy_field', false);
 * ```
 */
export declare function dropColumnSafely(queryInterface: QueryInterface, tableName: string, columnName: string, force?: boolean): Promise<void>;
/**
 * Creates an index concurrently (PostgreSQL).
 * Avoids table locking during index creation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {MigrationIndexConfig} config - Index configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createIndexConcurrently(queryInterface, {
 *   tableName: 'patients',
 *   indexName: 'idx_patients_last_name',
 *   fields: ['lastName'],
 *   concurrently: true
 * });
 * ```
 */
export declare function createIndexConcurrently(queryInterface: QueryInterface, config: MigrationIndexConfig): Promise<void>;
/**
 * Drops an index concurrently (PostgreSQL).
 * Avoids table locking during index removal.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} indexName - Index name
 * @param {boolean} concurrently - Use concurrent drop
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await dropIndexConcurrently(queryInterface, 'patients', 'idx_patients_old', true);
 * ```
 */
export declare function dropIndexConcurrently(queryInterface: QueryInterface, tableName: string, indexName: string, concurrently?: boolean): Promise<void>;
/**
 * Creates a partial index for specific conditions.
 * Reduces index size by filtering rows.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string[]} fields - Fields to index
 * @param {any} whereClause - Filter condition
 * @param {string} indexName - Index name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createPartialIndex(
 *   queryInterface,
 *   'users',
 *   ['email'],
 *   { active: true },
 *   'idx_active_users_email'
 * );
 * ```
 */
export declare function createPartialIndex(queryInterface: QueryInterface, tableName: string, fields: string[], whereClause: any, indexName?: string): Promise<void>;
/**
 * Creates a full-text search index (PostgreSQL).
 * Enables efficient text searching.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string[]} columns - Columns to include
 * @param {string} indexName - Index name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createFullTextIndex(
 *   queryInterface,
 *   'medical_records',
 *   ['diagnosis', 'symptoms', 'notes'],
 *   'fts_medical_records'
 * );
 * ```
 */
export declare function createFullTextIndex(queryInterface: QueryInterface, tableName: string, columns: string[], indexName: string): Promise<void>;
/**
 * Adds a foreign key constraint with cascade options.
 * Maintains referential integrity between tables.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ForeignKeyConfig} config - Foreign key configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addForeignKeyConstraint(queryInterface, {
 *   tableName: 'appointments',
 *   columnName: 'patientId',
 *   references: { table: 'patients', field: 'id' },
 *   onDelete: 'CASCADE',
 *   onUpdate: 'CASCADE'
 * });
 * ```
 */
export declare function addForeignKeyConstraint(queryInterface: QueryInterface, config: ForeignKeyConfig): Promise<void>;
/**
 * Removes a foreign key constraint safely.
 * Verifies constraint exists before removal.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeForeignKeyConstraint(
 *   queryInterface,
 *   'appointments',
 *   'fk_appointments_patientId'
 * );
 * ```
 */
export declare function removeForeignKeyConstraint(queryInterface: QueryInterface, tableName: string, constraintName: string): Promise<void>;
/**
 * Adds multiple foreign keys in a transaction.
 * Ensures atomicity of constraint creation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ForeignKeyConfig[]} configs - Array of foreign key configs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addMultipleForeignKeys(queryInterface, [
 *   {
 *     tableName: 'appointments',
 *     columnName: 'patientId',
 *     references: { table: 'patients', field: 'id' }
 *   },
 *   {
 *     tableName: 'appointments',
 *     columnName: 'doctorId',
 *     references: { table: 'users', field: 'id' }
 *   }
 * ]);
 * ```
 */
export declare function addMultipleForeignKeys(queryInterface: QueryInterface, configs: ForeignKeyConfig[]): Promise<void>;
/**
 * Recreates foreign key with new cascade options.
 * Updates constraint behavior without data loss.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} oldConstraintName - Current constraint name
 * @param {ForeignKeyConfig} newConfig - New configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recreateForeignKey(
 *   queryInterface,
 *   'appointments',
 *   'fk_appointments_patientId',
 *   {
 *     tableName: 'appointments',
 *     columnName: 'patientId',
 *     references: { table: 'patients', field: 'id' },
 *     onDelete: 'SET NULL'
 *   }
 * );
 * ```
 */
export declare function recreateForeignKey(queryInterface: QueryInterface, tableName: string, oldConstraintName: string, newConfig: ForeignKeyConfig): Promise<void>;
/**
 * Performs batch data migration with progress tracking.
 * Processes large datasets in manageable chunks.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {DataMigrationConfig} config - Migration configuration
 * @param {Function} progressCallback - Progress callback
 * @returns {Promise<number>} Total records processed
 *
 * @example
 * ```typescript
 * await batchDataMigration(queryInterface, {
 *   tableName: 'patients',
 *   batchSize: 500,
 *   transform: (row) => ({
 *     ...row,
 *     fullName: `${row.firstName} ${row.lastName}`
 *   }),
 *   where: { migrated: false }
 * }, (processed, total) => {
 *   console.log(`Processed ${processed}/${total}`);
 * });
 * ```
 */
export declare function batchDataMigration(queryInterface: QueryInterface, config: DataMigrationConfig, progressCallback?: (processed: number, total: number) => void): Promise<number>;
/**
 * Migrates data between tables with validation.
 * Copies and transforms data from source to destination.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} sourceTable - Source table
 * @param {string} destTable - Destination table
 * @param {Function} transformer - Data transformation function
 * @param {Function} validator - Validation function
 * @returns {Promise<number>} Records migrated
 *
 * @example
 * ```typescript
 * await migrateDataBetweenTables(
 *   queryInterface,
 *   'old_patients',
 *   'patients',
 *   (row) => ({ ...row, version: 2 }),
 *   (row) => row.email && row.firstName
 * );
 * ```
 */
export declare function migrateDataBetweenTables(queryInterface: QueryInterface, sourceTable: string, destTable: string, transformer: (row: any) => any, validator?: (row: any) => boolean): Promise<number>;
/**
 * Performs data cleanup migration.
 * Removes or archives obsolete records.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {any} cleanupCondition - Condition for cleanup
 * @param {boolean} archive - Whether to archive before deletion
 * @param {string} archiveTable - Archive table name
 * @returns {Promise<number>} Records cleaned
 *
 * @example
 * ```typescript
 * await cleanupDataMigration(
 *   queryInterface,
 *   'audit_logs',
 *   { createdAt: { [Op.lt]: new Date('2023-01-01') } },
 *   true,
 *   'audit_logs_archive'
 * );
 * ```
 */
export declare function cleanupDataMigration(queryInterface: QueryInterface, tableName: string, cleanupCondition: any, archive?: boolean, archiveTable?: string): Promise<number>;
/**
 * Creates a snapshot table for rollback capability.
 * Copies current table state for safe rollback.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Source table name
 * @param {string} snapshotName - Snapshot table name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createMigrationSnapshot(
 *   queryInterface,
 *   'patients',
 *   'patients_snapshot_20240101'
 * );
 * ```
 */
export declare function createMigrationSnapshot(queryInterface: QueryInterface, tableName: string, snapshotName?: string): Promise<void>;
/**
 * Restores data from a snapshot table.
 * Rolls back to previous table state.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Target table name
 * @param {string} snapshotName - Snapshot table name
 * @param {boolean} dropSnapshot - Drop snapshot after restore
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await restoreFromSnapshot(
 *   queryInterface,
 *   'patients',
 *   'patients_snapshot_20240101',
 *   true
 * );
 * ```
 */
export declare function restoreFromSnapshot(queryInterface: QueryInterface, tableName: string, snapshotName: string, dropSnapshot?: boolean): Promise<void>;
/**
 * Validates migration rollback safety.
 * Checks if rollback can be performed without data loss.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string[]} criticalColumns - Columns that must exist
 * @returns {Promise<boolean>} Whether rollback is safe
 *
 * @example
 * ```typescript
 * const isSafe = await validateRollbackSafety(
 *   queryInterface,
 *   'patients',
 *   ['id', 'firstName', 'lastName', 'email']
 * );
 * ```
 */
export declare function validateRollbackSafety(queryInterface: QueryInterface, tableName: string, criticalColumns: string[]): Promise<boolean>;
/**
 * Creates an inverse migration automatically.
 * Generates rollback code from forward migration.
 *
 * @param {string} migrationCode - Original migration code
 * @returns {string} Inverse migration code
 *
 * @example
 * ```typescript
 * const forward = 'await queryInterface.addColumn("users", "phone", ...)';
 * const backward = generateInverseMigration(forward);
 * ```
 */
export declare function generateInverseMigration(migrationCode: string): string;
/**
 * Seeds data with duplicate handling.
 * Inserts or updates records based on configuration.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {SeedConfig} config - Seed configuration
 * @returns {Promise<number>} Records inserted/updated
 *
 * @example
 * ```typescript
 * await seedData(queryInterface, {
 *   tableName: 'roles',
 *   data: [
 *     { id: 1, name: 'admin', description: 'Administrator' },
 *     { id: 2, name: 'doctor', description: 'Medical Doctor' }
 *   ],
 *   updateOnDuplicate: ['description'],
 *   ignoreDuplicates: false
 * });
 * ```
 */
export declare function seedData(queryInterface: QueryInterface, config: SeedConfig): Promise<number>;
/**
 * Generates seed data from existing records.
 * Creates seed file from current database state.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {any} whereClause - Filter for records
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Generated seed file path
 *
 * @example
 * ```typescript
 * await generateSeedFromTable(
 *   queryInterface,
 *   'roles',
 *   { system: true },
 *   './seeders/system-roles.ts'
 * );
 * ```
 */
export declare function generateSeedFromTable(queryInterface: QueryInterface, tableName: string, whereClause: any | undefined, outputPath: string): Promise<string>;
/**
 * Truncates table with cascade option.
 * Removes all records and optionally resets sequences.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {boolean} cascade - Cascade to dependent tables
 * @param {boolean} restartIdentity - Reset auto-increment
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await truncateTable(queryInterface, 'test_data', true, true);
 * ```
 */
export declare function truncateTable(queryInterface: QueryInterface, tableName: string, cascade?: boolean, restartIdentity?: boolean): Promise<void>;
/**
 * Validates migration before execution.
 * Checks syntax, dependencies, and potential issues.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} migrationName - Migration name
 * @param {Function} upFn - Up migration function
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMigration(
 *   queryInterface,
 *   'add-email-column',
 *   async (qi) => { await qi.addColumn('users', 'email', DataTypes.STRING); }
 * );
 * ```
 */
export declare function validateMigration(queryInterface: QueryInterface, migrationName: string, upFn: (qi: QueryInterface) => Promise<void>): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Checks migration dependencies.
 * Verifies required migrations have been executed.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string[]} requiredMigrations - Required migration names
 * @returns {Promise<{ satisfied: boolean; missing: string[] }>} Dependency check result
 *
 * @example
 * ```typescript
 * const result = await checkMigrationDependencies(
 *   queryInterface,
 *   ['20240101-create-users', '20240102-create-roles']
 * );
 * ```
 */
export declare function checkMigrationDependencies(queryInterface: QueryInterface, requiredMigrations: string[]): Promise<{
    satisfied: boolean;
    missing: string[];
}>;
/**
 * Estimates migration execution time.
 * Analyzes migration complexity and data volume.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Target table name
 * @param {string} operationType - Operation type
 * @returns {Promise<number>} Estimated seconds
 *
 * @example
 * ```typescript
 * const estimatedTime = await estimateMigrationTime(
 *   queryInterface,
 *   'patients',
 *   'addColumn'
 * );
 * console.log(`Estimated time: ${estimatedTime}s`);
 * ```
 */
export declare function estimateMigrationTime(queryInterface: QueryInterface, tableName: string, operationType: 'createTable' | 'addColumn' | 'addIndex' | 'dataTransform'): Promise<number>;
/**
 * Performs zero-downtime table rename with dual writes.
 * Migrates to new table without service interruption.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {ZeroDowntimeConfig} config - Zero-downtime configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await zeroDowntimeTableMigration(queryInterface, {
 *   oldTable: 'patients_v1',
 *   newTable: 'patients_v2',
 *   cutoverStrategy: 'gradual',
 *   replicationLag: 1000
 * });
 * ```
 */
export declare function zeroDowntimeTableMigration(queryInterface: QueryInterface, config: ZeroDowntimeConfig): Promise<void>;
/**
 * Creates a shadow table for testing migrations.
 * Tests migration on copy before applying to production.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Source table name
 * @param {Function} migrationFn - Migration to test
 * @returns {Promise<boolean>} Test success
 *
 * @example
 * ```typescript
 * const success = await testMigrationOnShadowTable(
 *   queryInterface,
 *   'patients',
 *   async (qi, shadowTable) => {
 *     await qi.addColumn(shadowTable, 'newField', DataTypes.STRING);
 *   }
 * );
 * ```
 */
export declare function testMigrationOnShadowTable(queryInterface: QueryInterface, tableName: string, migrationFn: (qi: QueryInterface, shadowTable: string) => Promise<void>): Promise<boolean>;
/**
 * Generates migration documentation.
 * Creates detailed documentation for migration changes.
 *
 * @param {MigrationConfig} config - Migration configuration
 * @param {string[]} affectedTables - Tables affected
 * @param {string} outputPath - Documentation output path
 * @returns {Promise<string>} Documentation file path
 *
 * @example
 * ```typescript
 * await generateMigrationDocumentation(
 *   {
 *     name: 'add-patient-metadata',
 *     description: 'Adds metadata field to patients table',
 *     author: 'dev@whitecross.com'
 *   },
 *   ['patients'],
 *   './docs/migrations/add-patient-metadata.md'
 * );
 * ```
 */
export declare function generateMigrationDocumentation(config: MigrationConfig, affectedTables: string[], outputPath: string): Promise<string>;
/**
 * Exports current database schema as documentation.
 * Generates comprehensive schema documentation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Documentation file path
 *
 * @example
 * ```typescript
 * await exportSchemaDocumentation(
 *   queryInterface,
 *   './docs/database-schema.md'
 * );
 * ```
 */
export declare function exportSchemaDocumentation(queryInterface: QueryInterface, outputPath: string): Promise<string>;
//# sourceMappingURL=sequelize-migrations-utils.d.ts.map