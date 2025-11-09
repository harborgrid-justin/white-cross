/**
 * LOC: DATA-MIG-PROD-001
 * File: /reuse/data-migration-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize / sequelize-typescript
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - zod
 *   - node-pg-migrate (optional)
 *   - umzug
 *
 * DOWNSTREAM (imported by):
 *   - Database migration services
 *   - ETL pipeline modules
 *   - Data transformation services
 *   - Schema evolution managers
 *   - Multi-database sync systems
 */
/**
 * Zod schema for migration configuration validation.
 */
export declare const MigrationConfigSchema: any;
/**
 * Zod schema for schema diff configuration.
 */
export declare const SchemaDiffConfigSchema: any;
/**
 * Zod schema for ETL pipeline configuration.
 */
export declare const ETLPipelineConfigSchema: any;
/**
 * Zod schema for batch processing configuration.
 */
export declare const BatchProcessConfigSchema: any;
/**
 * Zod schema for rollback configuration.
 */
export declare const RollbackConfigSchema: any;
/**
 * Zod schema for data validation rules.
 */
export declare const DataValidationRuleSchema: any;
/**
 * Zod schema for conflict resolution configuration.
 */
export declare const ConflictResolutionConfigSchema: any;
/**
 * Zod schema for zero-downtime migration configuration.
 */
export declare const ZeroDowntimeMigrationConfigSchema: any;
/**
 * Zod schema for multi-database sync configuration.
 */
export declare const MultiDatabaseSyncConfigSchema: any;
export interface MigrationConfig {
    migrationName: string;
    version: string;
    description?: string;
    strategy: 'standard' | 'zero-downtime' | 'dual-write' | 'shadow-table' | 'expand-contract';
    batchSize?: number;
    parallelism?: number;
    timeout?: number;
    rollbackEnabled?: boolean;
    dryRun?: boolean;
    validateBeforeApply?: boolean;
    validateAfterApply?: boolean;
}
export interface SchemaDiff {
    tables: {
        added: string[];
        removed: string[];
        modified: Array<{
            tableName: string;
            changes: SchemaChange[];
        }>;
    };
    indexes: {
        added: IndexDefinition[];
        removed: IndexDefinition[];
    };
    constraints: {
        added: ConstraintDefinition[];
        removed: ConstraintDefinition[];
    };
    sequences: {
        added: SequenceDefinition[];
        removed: SequenceDefinition[];
    };
}
export interface SchemaChange {
    type: 'add-column' | 'remove-column' | 'modify-column' | 'rename-column';
    columnName: string;
    oldDefinition?: ColumnDefinition;
    newDefinition?: ColumnDefinition;
}
export interface ColumnDefinition {
    name: string;
    type: string;
    allowNull: boolean;
    defaultValue?: any;
    primaryKey?: boolean;
    unique?: boolean;
    references?: {
        table: string;
        column: string;
    };
}
export interface IndexDefinition {
    name: string;
    tableName: string;
    columns: string[];
    unique: boolean;
    type?: string;
}
export interface ConstraintDefinition {
    name: string;
    tableName: string;
    type: 'primary' | 'foreign' | 'unique' | 'check';
    definition: string;
}
export interface SequenceDefinition {
    name: string;
    startValue: number;
    increment: number;
}
export interface MigrationProgress {
    migrationId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled-back';
    totalSteps: number;
    completedSteps: number;
    currentStep?: string;
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    errors: Array<{
        step: string;
        error: string;
        timestamp: Date;
    }>;
    checkpoints: Array<{
        step: string;
        timestamp: Date;
        state: Record<string, any>;
    }>;
}
export interface BatchProcessResult {
    totalRecords: number;
    processedRecords: number;
    successfulRecords: number;
    failedRecords: number;
    skippedRecords: number;
    errors: Array<{
        recordId: any;
        error: string;
    }>;
    duration: number;
    throughput: number;
}
export interface ValidationResult {
    isValid: boolean;
    errors: Array<{
        rule: string;
        field: string;
        value: any;
        message: string;
        level: 'error' | 'warning' | 'info';
    }>;
    warnings: Array<{
        rule: string;
        message: string;
    }>;
    statistics: {
        totalRecords: number;
        validRecords: number;
        invalidRecords: number;
        warningRecords: number;
    };
}
export interface ConflictResolutionResult {
    totalConflicts: number;
    resolvedConflicts: number;
    unresolvedConflicts: number;
    resolutions: Array<{
        recordId: any;
        strategy: string;
        sourceValue: any;
        targetValue: any;
        resolvedValue: any;
    }>;
    manualReviewRequired: Array<{
        recordId: any;
        reason: string;
        sourceValue: any;
        targetValue: any;
    }>;
}
/**
 * 1. Creates production-grade Sequelize model for migration history tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} MigrationHistory model
 *
 * @example
 * ```typescript
 * const MigrationHistory = createMigrationHistoryModel(sequelize, DataTypes);
 * const migration = await MigrationHistory.create({
 *   migrationName: 'add-patient-medications-table',
 *   version: '1.2.3',
 *   strategy: 'zero-downtime',
 *   status: 'running'
 * });
 * ```
 */
export declare const createMigrationHistoryModel: (sequelize: any, DataTypes: any) => any;
/**
 * 2. Creates production-grade Sequelize model for ETL pipeline execution tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} ETLPipelineExecution model
 *
 * @example
 * ```typescript
 * const ETLPipelineExecution = createETLPipelineExecutionModel(sequelize, DataTypes);
 * const execution = await ETLPipelineExecution.create({
 *   pipelineName: 'patient-data-sync',
 *   sourceType: 'database',
 *   targetType: 'database',
 *   status: 'running'
 * });
 * ```
 */
export declare const createETLPipelineExecutionModel: (sequelize: any, DataTypes: any) => any;
/**
 * 3. Creates production-grade Sequelize model for data validation results.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} DataValidationResult model
 *
 * @example
 * ```typescript
 * const DataValidationResult = createDataValidationResultModel(sequelize, DataTypes);
 * const validation = await DataValidationResult.create({
 *   validationName: 'patient-data-integrity-check',
 *   tableName: 'patients',
 *   totalRecords: 10000,
 *   validRecords: 9950,
 *   invalidRecords: 50
 * });
 * ```
 */
export declare const createDataValidationResultModel: (sequelize: any, DataTypes: any) => any;
/**
 * 4. Creates production-grade Sequelize model for schema change tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} DataTypes - Sequelize DataTypes
 * @returns {any} SchemaChangeLog model
 *
 * @example
 * ```typescript
 * const SchemaChangeLog = createSchemaChangeLogModel(sequelize, DataTypes);
 * const change = await SchemaChangeLog.create({
 *   tableName: 'medications',
 *   changeType: 'add-column',
 *   columnName: 'ndc_code',
 *   definition: { type: 'STRING', allowNull: true }
 * });
 * ```
 */
export declare const createSchemaChangeLogModel: (sequelize: any, DataTypes: any) => any;
/**
 * 5. Plans a database migration by analyzing schema changes and generating execution steps.
 *
 * @param {any} sourceSchema - Source database schema definition
 * @param {any} targetSchema - Target database schema definition
 * @param {MigrationConfig} config - Migration configuration
 * @returns {Promise<any>} Migration execution plan
 *
 * @example
 * ```typescript
 * const plan = await planMigration(
 *   currentSchema,
 *   desiredSchema,
 *   {
 *     migrationName: 'add-medications-features',
 *     version: '1.3.0',
 *     strategy: 'zero-downtime',
 *     batchSize: 1000
 *   }
 * );
 * console.log('Migration steps:', plan.steps.length);
 * ```
 */
export declare const planMigration: (sourceSchema: any, targetSchema: any, config: MigrationConfig) => Promise<any>;
/**
 * 6. Executes a planned database migration with progress tracking.
 *
 * @param {any} migrationPlan - Migration plan from planMigration
 * @param {any} sequelize - Sequelize instance
 * @param {any} MigrationHistoryModel - MigrationHistory Sequelize model
 * @param {Function} [progressCallback] - Progress callback function
 * @returns {Promise<MigrationProgress>} Migration execution result
 *
 * @example
 * ```typescript
 * const result = await executeMigration(
 *   migrationPlan,
 *   sequelize,
 *   MigrationHistoryModel,
 *   (progress) => {
 *     console.log(`Progress: ${progress.progress}%`);
 *   }
 * );
 * ```
 */
export declare const executeMigration: (migrationPlan: any, sequelize: any, MigrationHistoryModel: any, progressCallback?: (progress: MigrationProgress) => void) => Promise<MigrationProgress>;
/**
 * 7. Executes a single migration step.
 *
 * @param {any} step - Migration step
 * @param {any} sequelize - Sequelize instance
 * @param {any} transaction - Transaction instance
 * @returns {Promise<{ddl: string[], rollbackDdl: string[]}>} DDL statements
 *
 * @example
 * ```typescript
 * const { ddl, rollbackDdl } = await executeStep(
 *   { operation: 'create-table', tableName: 'medications' },
 *   sequelize,
 *   transaction
 * );
 * ```
 */
export declare const executeStep: (step: any, sequelize: any, transaction: any) => Promise<{
    ddl: string[];
    rollbackDdl: string[];
}>;
/**
 * 8. Generates a comprehensive schema diff between two database schemas.
 *
 * @param {any} sourceSchema - Source database schema
 * @param {any} targetSchema - Target database schema
 * @returns {Promise<SchemaDiff>} Schema differences
 *
 * @example
 * ```typescript
 * const diff = await generateSchemaDiff(currentSchema, desiredSchema);
 * console.log('Tables to add:', diff.tables.added);
 * console.log('Tables to remove:', diff.tables.removed);
 * console.log('Tables to modify:', diff.tables.modified.length);
 * ```
 */
export declare const generateSchemaDiff: (sourceSchema: any, targetSchema: any) => Promise<SchemaDiff>;
/**
 * 9. Compares two table schemas and identifies changes.
 *
 * @param {any} sourceTable - Source table schema
 * @param {any} targetTable - Target table schema
 * @returns {Promise<SchemaChange[]>} List of schema changes
 *
 * @example
 * ```typescript
 * const changes = await compareTableSchemas(
 *   currentPatientTable,
 *   newPatientTable
 * );
 * changes.forEach(change => {
 *   console.log(`${change.type}: ${change.columnName}`);
 * });
 * ```
 */
export declare const compareTableSchemas: (sourceTable: any, targetTable: any) => Promise<SchemaChange[]>;
/**
 * 10. Analyzes migration impact and generates risk assessment.
 *
 * @param {any} migrationPlan - Migration plan
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<any>} Impact analysis and risk assessment
 *
 * @example
 * ```typescript
 * const impact = await analyzeMigrationImpact(plan, sequelize);
 * console.log('Risk level:', impact.riskLevel);
 * console.log('Estimated downtime:', impact.estimatedDowntime);
 * console.log('Affected tables:', impact.affectedTables);
 * ```
 */
export declare const analyzeMigrationImpact: (migrationPlan: any, sequelize: any) => Promise<any>;
/**
 * 11. Creates and executes an ETL pipeline with transformation rules.
 *
 * @param {any} config - ETL pipeline configuration
 * @param {any} ETLExecutionModel - ETL execution tracking model
 * @param {Function} [progressCallback] - Progress callback
 * @returns {Promise<BatchProcessResult>} ETL execution result
 *
 * @example
 * ```typescript
 * const result = await executeETLPipeline({
 *   pipelineName: 'patient-data-migration',
 *   source: { type: 'database', connection: sourceDb, query: 'SELECT * FROM patients' },
 *   target: { type: 'database', connection: targetDb, table: 'patients_v2' },
 *   transformations: [
 *     { type: 'map', config: { field: 'phone', transform: normalizePhone } },
 *     { type: 'validate', config: { schema: PatientSchema } }
 *   ]
 * }, ETLExecutionModel);
 * ```
 */
export declare const executeETLPipeline: (config: any, ETLExecutionModel: any, progressCallback?: (stats: any) => void) => Promise<BatchProcessResult>;
/**
 * 12. Extracts data from various source types.
 *
 * @param {any} sourceConfig - Source configuration
 * @returns {Promise<any[]>} Extracted data
 *
 * @example
 * ```typescript
 * const data = await extractData({
 *   type: 'database',
 *   connection: sequelize,
 *   query: 'SELECT * FROM patients WHERE active = true'
 * });
 * ```
 */
export declare const extractData: (sourceConfig: any) => Promise<any[]>;
/**
 * 13. Loads transformed data to target destination.
 *
 * @param {any} targetConfig - Target configuration
 * @param {any[]} data - Data to load
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await loadData({
 *   type: 'database',
 *   connection: sequelize,
 *   table: 'patients_v2'
 * }, transformedPatients);
 * ```
 */
export declare const loadData: (targetConfig: any, data: any[]) => Promise<void>;
/**
 * 14. Applies a transformation to a data record.
 *
 * @param {any} record - Data record
 * @param {any} transformation - Transformation configuration
 * @returns {Promise<any>} Transformed record
 *
 * @example
 * ```typescript
 * const transformed = await applyTransformation(
 *   { phone: '1234567890' },
 *   { type: 'map', config: { field: 'phone', transform: (v) => `+1-${v}` } }
 * );
 * ```
 */
export declare const applyTransformation: (record: any, transformation: any) => Promise<any>;
/**
 * 15. Processes large datasets in batches with progress tracking.
 *
 * @param {any[]} data - Data to process
 * @param {Function} processor - Batch processor function
 * @param {any} config - Batch processing configuration
 * @param {Function} [progressCallback] - Progress callback
 * @returns {Promise<BatchProcessResult>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processBatch(
 *   largeDataset,
 *   async (batch) => await Patient.bulkCreate(batch),
 *   { batchSize: 1000, parallelism: 5 },
 *   (progress) => console.log(`${progress.progress}% complete`)
 * );
 * ```
 */
export declare const processBatch: (data: any[], processor: (batch: any[]) => Promise<void>, config: any, progressCallback?: (progress: any) => void) => Promise<BatchProcessResult>;
/**
 * 16. Processes data with automatic retry logic for failed batches.
 *
 * @param {any[]} data - Data to process
 * @param {Function} processor - Processor function
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} retryDelay - Delay between retries in ms
 * @returns {Promise<BatchProcessResult>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processBatchWithRetry(
 *   failedRecords,
 *   async (batch) => await saveToDatabase(batch),
 *   3,
 *   1000
 * );
 * ```
 */
export declare const processBatchWithRetry: (data: any[], processor: (batch: any[]) => Promise<void>, maxRetries?: number, retryDelay?: number) => Promise<BatchProcessResult>;
/**
 * 17. Resumes batch processing from a checkpoint.
 *
 * @param {any[]} data - Full dataset
 * @param {Function} processor - Processor function
 * @param {any} checkpoint - Last checkpoint
 * @param {any} config - Batch configuration
 * @returns {Promise<BatchProcessResult>} Processing result
 *
 * @example
 * ```typescript
 * const result = await resumeBatchProcessing(
 *   allRecords,
 *   processorFunc,
 *   lastCheckpoint,
 *   { batchSize: 1000 }
 * );
 * ```
 */
export declare const resumeBatchProcessing: (data: any[], processor: (batch: any[]) => Promise<void>, checkpoint: any, config: any) => Promise<BatchProcessResult>;
/**
 * 18. Rolls back a migration to a previous state.
 *
 * @param {string} migrationId - Migration ID to rollback
 * @param {any} MigrationHistoryModel - Migration history model
 * @param {any} sequelize - Sequelize instance
 * @param {any} config - Rollback configuration
 * @returns {Promise<any>} Rollback result
 *
 * @example
 * ```typescript
 * const result = await rollbackMigration(
 *   'migration-uuid',
 *   MigrationHistoryModel,
 *   sequelize,
 *   { strategy: 'full', createBackup: true }
 * );
 * ```
 */
export declare const rollbackMigration: (migrationId: string, MigrationHistoryModel: any, sequelize: any, config: any) => Promise<any>;
/**
 * 19. Creates a rollback plan for a migration.
 *
 * @param {any} migrationPlan - Migration plan
 * @returns {Promise<any>} Rollback plan
 *
 * @example
 * ```typescript
 * const rollbackPlan = await createRollbackPlan(migrationPlan);
 * console.log('Rollback steps:', rollbackPlan.steps.length);
 * ```
 */
export declare const createRollbackPlan: (migrationPlan: any) => Promise<any>;
/**
 * 20. Creates a database backup before migration.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} [backupPath] - Optional backup file path
 * @returns {Promise<string>} Backup file path
 *
 * @example
 * ```typescript
 * const backupPath = await createDatabaseBackup(sequelize);
 * console.log('Backup created at:', backupPath);
 * ```
 */
export declare const createDatabaseBackup: (sequelize: any, backupPath?: string) => Promise<string>;
/**
 * 21. Validates data against a set of validation rules.
 *
 * @param {any[]} data - Data to validate
 * @param {any[]} rules - Validation rules
 * @param {any} ValidationResultModel - Validation result model
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const rules = [
 *   { ruleName: 'email-format', ruleType: 'format', field: 'email', condition: { pattern: /^.+@.+$/ } },
 *   { ruleName: 'age-range', ruleType: 'range', field: 'age', condition: { min: 0, max: 120 } }
 * ];
 * const result = await validateData(patients, rules, ValidationResultModel);
 * ```
 */
export declare const validateData: (data: any[], rules: any[], ValidationResultModel?: any) => Promise<ValidationResult>;
/**
 * 22. Validates a single record against a validation rule.
 *
 * @param {any} record - Record to validate
 * @param {any} rule - Validation rule
 * @returns {Promise<any>} Validation error or null if valid
 *
 * @example
 * ```typescript
 * const error = await validateRule(
 *   { email: 'invalid-email' },
 *   { ruleName: 'email-format', ruleType: 'format', field: 'email', condition: { pattern: /^.+@.+$/ } }
 * );
 * ```
 */
export declare const validateRule: (record: any, rule: any) => Promise<any>;
/**
 * 23. Validates referential integrity between tables.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} sourceTable - Source table name
 * @param {string} targetTable - Target table name
 * @param {string} foreignKey - Foreign key column
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateReferentialIntegrity(
 *   sequelize,
 *   'medications',
 *   'patients',
 *   'patient_id'
 * );
 * ```
 */
export declare const validateReferentialIntegrity: (sequelize: any, sourceTable: string, targetTable: string, foreignKey: string) => Promise<ValidationResult>;
/**
 * 24. Validates schema integrity and structure.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {any} expectedSchema - Expected schema definition
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateSchemaIntegrity(sequelize, expectedSchema);
 * console.log('Schema valid:', result.isValid);
 * ```
 */
export declare const validateSchemaIntegrity: (sequelize: any, expectedSchema: any) => Promise<ValidationResult>;
/**
 * 25. Resolves conflicts between source and target data during synchronization.
 *
 * @param {any[]} sourceData - Source data
 * @param {any[]} targetData - Target data
 * @param {any} config - Conflict resolution configuration
 * @returns {Promise<ConflictResolutionResult>} Resolution result
 *
 * @example
 * ```typescript
 * const result = await resolveConflicts(
 *   sourceRecords,
 *   targetRecords,
 *   {
 *     strategy: 'newest-wins',
 *     conflictDetection: { keyFields: ['id'], timestampField: 'updated_at' }
 *   }
 * );
 * ```
 */
export declare const resolveConflicts: (sourceData: any[], targetData: any[], config: any) => Promise<ConflictResolutionResult>;
/**
 * 26. Detects if two records are in conflict.
 *
 * @param {any} sourceRecord - Source record
 * @param {any} targetRecord - Target record
 * @param {any} conflictDetection - Conflict detection configuration
 * @returns {Promise<boolean>} True if conflict detected
 *
 * @example
 * ```typescript
 * const hasConflict = await detectConflict(
 *   sourceRecord,
 *   targetRecord,
 *   { keyFields: ['id'], compareFields: ['name', 'email'] }
 * );
 * ```
 */
export declare const detectConflict: (sourceRecord: any, targetRecord: any, conflictDetection: any) => Promise<boolean>;
/**
 * 27. Resolves a single conflict between two records.
 *
 * @param {any} sourceRecord - Source record
 * @param {any} targetRecord - Target record
 * @param {any} config - Resolution configuration
 * @returns {Promise<any>} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = await resolveConflict(
 *   sourceRecord,
 *   targetRecord,
 *   { strategy: 'newest-wins', conflictDetection: { timestampField: 'updated_at' } }
 * );
 * ```
 */
export declare const resolveConflict: (sourceRecord: any, targetRecord: any, config: any) => Promise<any>;
/**
 * 28. Executes a zero-downtime migration using expand-contract pattern.
 *
 * @param {any} config - Zero-downtime migration configuration
 * @param {any} sequelize - Sequelize instance
 * @param {any} MigrationHistoryModel - Migration history model
 * @returns {Promise<any>} Migration result
 *
 * @example
 * ```typescript
 * const result = await executeZeroDowntimeMigration({
 *   migrationName: 'rename-patient-column',
 *   strategy: 'expand-contract',
 *   phases: [
 *     { name: 'expand', operations: ['add-new-column'] },
 *     { name: 'dual-write', operations: ['copy-data'] },
 *     { name: 'contract', operations: ['remove-old-column'] }
 *   ]
 * }, sequelize, MigrationHistoryModel);
 * ```
 */
export declare const executeZeroDowntimeMigration: (config: any, sequelize: any, MigrationHistoryModel: any) => Promise<any>;
/**
 * 29. Creates shadow tables for zero-downtime schema changes.
 *
 * @param {string} sourceTable - Source table name
 * @param {any} newSchema - New schema definition
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<string>} Shadow table name
 *
 * @example
 * ```typescript
 * const shadowTable = await createShadowTable(
 *   'patients',
 *   { columns: { id: { type: 'UUID' }, name: { type: 'STRING' } } },
 *   sequelize
 * );
 * ```
 */
export declare const createShadowTable: (sourceTable: string, newSchema: any, sequelize: any) => Promise<string>;
/**
 * 30. Performs cutover from old table to new table.
 *
 * @param {string} oldTable - Old table name
 * @param {string} newTable - New table name
 * @param {any} sequelize - Sequelize instance
 * @param {string} strategy - Cutover strategy
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await performCutover('patients_old', 'patients_new', sequelize, 'immediate');
 * ```
 */
export declare const performCutover: (oldTable: string, newTable: string, sequelize: any, strategy?: "immediate" | "gradual" | "canary") => Promise<void>;
/**
 * 31. Synchronizes data across multiple databases.
 *
 * @param {any} config - Multi-database sync configuration
 * @returns {Promise<any>} Synchronization result
 *
 * @example
 * ```typescript
 * const result = await synchronizeMultipleDatabases({
 *   syncName: 'patient-data-sync',
 *   databases: [
 *     { name: 'db1', connection: sequelize1, role: 'source' },
 *     { name: 'db2', connection: sequelize2, role: 'target' }
 *   ],
 *   syncMode: 'incremental',
 *   conflictResolution: { strategy: 'newest-wins' }
 * });
 * ```
 */
export declare const synchronizeMultipleDatabases: (config: any) => Promise<any>;
/**
 * 32. Implements Change Data Capture (CDC) for incremental synchronization.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} tableName - Table name to track
 * @param {Date} since - Track changes since this timestamp
 * @returns {Promise<any[]>} Changed records
 *
 * @example
 * ```typescript
 * const changes = await captureDataChanges(
 *   sequelize,
 *   'patients',
 *   new Date('2024-01-01')
 * );
 * ```
 */
export declare const captureDataChanges: (sequelize: any, tableName: string, since: Date) => Promise<any[]>;
/**
 * 33. Sets up database triggers for automatic change tracking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} changeLogTable - Change log table name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupChangeDataCapture(sequelize, 'patients', 'patient_change_log');
 * ```
 */
export declare const setupChangeDataCapture: (sequelize: any, tableName: string, changeLogTable: string) => Promise<void>;
/**
 * 34. Chunks an array into smaller batches.
 *
 * @param {any[]} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {any[][]} Chunked array
 *
 * @example
 * ```typescript
 * const batches = chunkArray([1,2,3,4,5], 2);
 * // [[1,2], [3,4], [5]]
 * ```
 */
export declare const chunkArray: (array: any[], size: number) => any[][];
/**
 * 35. Sleeps for specified milliseconds.
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * 36. Generates CREATE TABLE DDL statement.
 *
 * @param {any} step - Migration step with table definition
 * @returns {string} DDL statement
 *
 * @example
 * ```typescript
 * const ddl = generateCreateTableDdl({
 *   tableName: 'medications',
 *   schema: { columns: { id: { type: 'UUID' }, name: { type: 'STRING' } } }
 * });
 * ```
 */
export declare const generateCreateTableDdl: (step: any) => string;
/**
 * 37. Generates ADD COLUMN DDL statement.
 *
 * @param {any} step - Migration step with column definition
 * @returns {string} DDL statement
 *
 * @example
 * ```typescript
 * const ddl = generateAddColumnDdl({
 *   tableName: 'patients',
 *   columnName: 'email',
 *   definition: { type: 'STRING', allowNull: true }
 * });
 * ```
 */
export declare const generateAddColumnDdl: (step: any) => string;
/**
 * 38. Generates CREATE INDEX DDL statement.
 *
 * @param {any} step - Migration step with index definition
 * @returns {string} DDL statement
 *
 * @example
 * ```typescript
 * const ddl = generateCreateIndexDdl({
 *   indexName: 'idx_patients_email',
 *   tableName: 'patients',
 *   columns: ['email'],
 *   unique: true
 * });
 * ```
 */
export declare const generateCreateIndexDdl: (step: any) => string;
/**
 * 39. Estimates migration duration based on steps and configuration.
 *
 * @param {any[]} steps - Migration steps
 * @param {MigrationConfig} config - Migration configuration
 * @returns {number} Estimated duration in milliseconds
 *
 * @example
 * ```typescript
 * const duration = estimateMigrationDuration(migrationSteps, config);
 * console.log(`Estimated duration: ${duration}ms`);
 * ```
 */
export declare const estimateMigrationDuration: (steps: any[], config: MigrationConfig) => number;
/**
 * 40. Builds a unique key for a record based on key fields.
 *
 * @param {any} record - Data record
 * @param {string[]} keyFields - Key field names
 * @returns {string} Composite key
 *
 * @example
 * ```typescript
 * const key = buildRecordKey({ id: '123', type: 'patient' }, ['id', 'type']);
 * // '123|patient'
 * ```
 */
export declare const buildRecordKey: (record: any, keyFields: string[]) => string;
/**
 * 41. Gets the rollback operation for a given migration operation.
 *
 * @param {string} operation - Migration operation
 * @returns {string} Rollback operation
 *
 * @example
 * ```typescript
 * const rollback = getRollbackOperation('create-table');
 * // 'drop-table'
 * ```
 */
export declare const getRollbackOperation: (operation: string) => string;
/**
 * 42. Introspects database schema and returns structure.
 *
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<any>} Database schema structure
 *
 * @example
 * ```typescript
 * const schema = await introspectDatabaseSchema(sequelize);
 * console.log('Tables:', Object.keys(schema.tables));
 * ```
 */
export declare const introspectDatabaseSchema: (sequelize: any) => Promise<any>;
/**
 * 43. Extracts data from a database based on sync configuration.
 *
 * @param {any} database - Database configuration
 * @param {any} config - Sync configuration
 * @returns {Promise<any[]>} Extracted data
 *
 * @example
 * ```typescript
 * const data = await extractDataFromDatabase(
 *   { name: 'db1', connection: sequelize },
 *   { syncMode: 'full', filterConditions: { active: true } }
 * );
 * ```
 */
export declare const extractDataFromDatabase: (database: any, config: any) => Promise<any[]>;
/**
 * 44. Loads data to a database.
 *
 * @param {any} database - Database configuration
 * @param {any[]} data - Data to load
 * @param {any} config - Load configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await loadDataToDatabase(
 *   { name: 'db2', connection: sequelize },
 *   transformedData,
 *   { batchSize: 1000 }
 * );
 * ```
 */
export declare const loadDataToDatabase: (database: any, data: any[], config: any) => Promise<void>;
/**
 * 45. Applies transformation to entire dataset.
 *
 * @param {any[]} data - Dataset
 * @param {any} transformation - Transformation configuration
 * @returns {Promise<any[]>} Transformed dataset
 *
 * @example
 * ```typescript
 * const transformed = await applyTransformationToDataset(
 *   patients,
 *   { type: 'map', config: { field: 'phone', transform: normalizePhone } }
 * );
 * ```
 */
export declare const applyTransformationToDataset: (data: any[], transformation: any) => Promise<any[]>;
/**
 * 46. Validates migration prerequisites before execution.
 *
 * @param {any} migrationPlan - Migration plan
 * @param {any} sequelize - Sequelize instance
 * @returns {Promise<ValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMigrationPrerequisites(plan, sequelize);
 * if (!validation.isValid) {
 *   console.error('Prerequisites not met:', validation.errors);
 * }
 * ```
 */
export declare const validateMigrationPrerequisites: (migrationPlan: any, sequelize: any) => Promise<ValidationResult>;
/**
 * 47. Generates migration documentation and changelog.
 *
 * @param {any} migrationPlan - Migration plan
 * @param {MigrationProgress} progress - Migration execution progress
 * @returns {string} Markdown documentation
 *
 * @example
 * ```typescript
 * const docs = generateMigrationDocumentation(plan, executionProgress);
 * fs.writeFileSync('MIGRATION.md', docs);
 * ```
 */
export declare const generateMigrationDocumentation: (migrationPlan: any, progress: MigrationProgress) => string;
/**
 * NestJS Service for managing database migrations.
 * Provides enterprise-grade migration planning, execution, and rollback capabilities.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class MigrationService {
 *   constructor(
 *     @InjectModel(MigrationHistory) private migrationHistoryModel: typeof MigrationHistory,
 *     private sequelize: Sequelize,
 *   ) {}
 *
 *   async executeMigration(plan: any) {
 *     return executeMigration(plan, this.sequelize, this.migrationHistoryModel);
 *   }
 * }
 * ```
 */
export declare const MigrationServiceProvider: {
    provide: string;
    useFactory: (sequelize: any, migrationHistoryModel: any) => {
        planMigration: (sourceSchema: any, targetSchema: any, config: MigrationConfig) => Promise<any>;
        executeMigration: (plan: any, progressCallback?: any) => Promise<MigrationProgress>;
        rollbackMigration: (migrationId: string, config: any) => Promise<any>;
        analyzeMigrationImpact: (plan: any) => Promise<any>;
        validateMigrationPrerequisites: (plan: any) => Promise<ValidationResult>;
    };
    inject: string[];
};
/**
 * NestJS Service for ETL pipeline management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ETLService {
 *   async runPipeline(config: any) {
 *     return executeETLPipeline(config, this.etlExecutionModel);
 *   }
 * }
 * ```
 */
export declare const ETLServiceProvider: {
    provide: string;
    useFactory: (etlExecutionModel: any) => {
        executeETLPipeline: (config: any, progressCallback?: any) => Promise<BatchProcessResult>;
        extractData: (sourceConfig: any) => Promise<any[]>;
        loadData: (targetConfig: any, data: any[]) => Promise<void>;
        applyTransformation: (record: any, transformation: any) => Promise<any>;
    };
    inject: string[];
};
//# sourceMappingURL=data-migration-kit.prod.d.ts.map