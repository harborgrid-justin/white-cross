"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRollbackOperation = exports.buildRecordKey = exports.estimateMigrationDuration = exports.generateCreateIndexDdl = exports.generateAddColumnDdl = exports.generateCreateTableDdl = exports.sleep = exports.chunkArray = exports.setupChangeDataCapture = exports.captureDataChanges = exports.synchronizeMultipleDatabases = exports.performCutover = exports.createShadowTable = exports.executeZeroDowntimeMigration = exports.resolveConflict = exports.detectConflict = exports.resolveConflicts = exports.validateSchemaIntegrity = exports.validateReferentialIntegrity = exports.validateRule = exports.validateData = exports.createDatabaseBackup = exports.createRollbackPlan = exports.rollbackMigration = exports.resumeBatchProcessing = exports.processBatchWithRetry = exports.processBatch = exports.applyTransformation = exports.loadData = exports.extractData = exports.executeETLPipeline = exports.analyzeMigrationImpact = exports.compareTableSchemas = exports.generateSchemaDiff = exports.executeStep = exports.executeMigration = exports.planMigration = exports.createSchemaChangeLogModel = exports.createDataValidationResultModel = exports.createETLPipelineExecutionModel = exports.createMigrationHistoryModel = exports.MultiDatabaseSyncConfigSchema = exports.ZeroDowntimeMigrationConfigSchema = exports.ConflictResolutionConfigSchema = exports.DataValidationRuleSchema = exports.RollbackConfigSchema = exports.BatchProcessConfigSchema = exports.ETLPipelineConfigSchema = exports.SchemaDiffConfigSchema = exports.MigrationConfigSchema = void 0;
exports.ETLServiceProvider = exports.MigrationServiceProvider = exports.generateMigrationDocumentation = exports.validateMigrationPrerequisites = exports.applyTransformationToDataset = exports.loadDataToDatabase = exports.extractDataFromDatabase = exports.introspectDatabaseSchema = void 0;
/**
 * File: /reuse/data-migration-kit.prod.ts
 * Locator: WC-UTL-DATAMIG-PROD-001
 * Purpose: Production-Grade Data Migration and ETL Utilities - Enterprise-ready database migration, ETL pipelines, and data transformation with NestJS + Sequelize
 *
 * Upstream: sequelize, sequelize-typescript, @nestjs/common, @nestjs/swagger, zod, umzug, node-pg-migrate
 * Downstream: ../backend/*, migration services, ETL modules, data sync systems, schema evolution managers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Zod 3.x, PostgreSQL 14+, Umzug 3.x
 * Exports: 47 production-grade utility functions for migrations, ETL, schema diffing, batch processing, rollback, validation, zero-downtime migrations
 *
 * LLM Context: Enterprise-grade data migration and ETL utilities for White Cross healthcare platform.
 * Provides comprehensive migration planning/execution, schema diffing and evolution, data transformation pipelines,
 * batch processing with progress tracking, sophisticated rollback strategies, multi-phase validation,
 * conflict resolution, zero-downtime migration techniques, multi-database synchronization, change data capture,
 * incremental migration, data quality checks, referential integrity validation, parallel processing,
 * and Sequelize models with full audit trails. Optimized for HIPAA-compliant healthcare data migrations.
 *
 * Features:
 * - Automated schema diffing and change detection
 * - Zero-downtime migration strategies (expand/contract, dual writes, shadow tables)
 * - Advanced ETL pipelines with transformation rules
 * - Batch processing with configurable chunk sizes
 * - Multi-phase rollback with savepoints
 * - Data validation and quality checks
 * - Conflict resolution strategies
 * - Progress tracking and resume capability
 * - Multi-database synchronization
 * - HIPAA-compliant audit logging
 * - Referential integrity validation
 * - Performance monitoring and optimization
 */
const zod_1 = require("zod");
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for migration configuration validation.
 */
exports.MigrationConfigSchema = zod_1.z.object({
    migrationName: zod_1.z.string().min(1),
    version: zod_1.z.string().regex(/^\d+\.\d+\.\d+$/),
    description: zod_1.z.string().optional(),
    strategy: zod_1.z.enum(['standard', 'zero-downtime', 'dual-write', 'shadow-table', 'expand-contract']),
    batchSize: zod_1.z.number().int().min(1).max(100000).default(1000),
    parallelism: zod_1.z.number().int().min(1).max(20).default(1),
    timeout: zod_1.z.number().int().min(0).optional(),
    rollbackEnabled: zod_1.z.boolean().default(true),
    dryRun: zod_1.z.boolean().default(false),
    validateBeforeApply: zod_1.z.boolean().default(true),
    validateAfterApply: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for schema diff configuration.
 */
exports.SchemaDiffConfigSchema = zod_1.z.object({
    sourceDatabase: zod_1.z.string().min(1),
    targetDatabase: zod_1.z.string().min(1),
    includeData: zod_1.z.boolean().default(false),
    includeTables: zod_1.z.array(zod_1.z.string()).optional(),
    excludeTables: zod_1.z.array(zod_1.z.string()).optional(),
    includeIndexes: zod_1.z.boolean().default(true),
    includeConstraints: zod_1.z.boolean().default(true),
    includeSequences: zod_1.z.boolean().default(true),
    includeTriggers: zod_1.z.boolean().default(true),
});
/**
 * Zod schema for ETL pipeline configuration.
 */
exports.ETLPipelineConfigSchema = zod_1.z.object({
    pipelineName: zod_1.z.string().min(1),
    source: zod_1.z.object({
        type: zod_1.z.enum(['database', 'file', 'api', 'stream']),
        connection: zod_1.z.record(zod_1.z.any()),
        query: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
    }),
    target: zod_1.z.object({
        type: zod_1.z.enum(['database', 'file', 'api', 'stream']),
        connection: zod_1.z.record(zod_1.z.any()),
        table: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
    }),
    transformations: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['map', 'filter', 'aggregate', 'join', 'validate', 'enrich']),
        config: zod_1.z.record(zod_1.z.any()),
    })),
    batchSize: zod_1.z.number().int().min(1).default(1000),
    parallelWorkers: zod_1.z.number().int().min(1).max(10).default(1),
    errorHandling: zod_1.z.enum(['skip', 'retry', 'abort', 'quarantine']).default('retry'),
    retryAttempts: zod_1.z.number().int().min(0).max(10).default(3),
});
/**
 * Zod schema for batch processing configuration.
 */
exports.BatchProcessConfigSchema = zod_1.z.object({
    batchSize: zod_1.z.number().int().min(1).max(100000),
    chunkSize: zod_1.z.number().int().min(1).optional(),
    parallelism: zod_1.z.number().int().min(1).max(50).default(1),
    progressInterval: zod_1.z.number().int().min(100).default(1000),
    errorThreshold: zod_1.z.number().min(0).max(1).default(0.05),
    resumable: zod_1.z.boolean().default(true),
    saveCheckpoints: zod_1.z.boolean().default(true),
    checkpointInterval: zod_1.z.number().int().min(1).default(10000),
});
/**
 * Zod schema for rollback configuration.
 */
exports.RollbackConfigSchema = zod_1.z.object({
    migrationId: zod_1.z.string().min(1),
    strategy: zod_1.z.enum(['full', 'partial', 'savepoint', 'compensating']),
    targetVersion: zod_1.z.string().optional(),
    validateBeforeRollback: zod_1.z.boolean().default(true),
    createBackup: zod_1.z.boolean().default(true),
    dryRun: zod_1.z.boolean().default(false),
    timeout: zod_1.z.number().int().min(0).optional(),
});
/**
 * Zod schema for data validation rules.
 */
exports.DataValidationRuleSchema = zod_1.z.object({
    ruleName: zod_1.z.string().min(1),
    ruleType: zod_1.z.enum(['required', 'format', 'range', 'unique', 'reference', 'custom']),
    field: zod_1.z.string().min(1),
    condition: zod_1.z.record(zod_1.z.any()),
    errorLevel: zod_1.z.enum(['error', 'warning', 'info']).default('error'),
    errorMessage: zod_1.z.string().optional(),
});
/**
 * Zod schema for conflict resolution configuration.
 */
exports.ConflictResolutionConfigSchema = zod_1.z.object({
    strategy: zod_1.z.enum(['source-wins', 'target-wins', 'newest-wins', 'manual', 'merge', 'custom']),
    conflictDetection: zod_1.z.object({
        keyFields: zod_1.z.array(zod_1.z.string()),
        compareFields: zod_1.z.array(zod_1.z.string()).optional(),
        timestampField: zod_1.z.string().optional(),
    }),
    mergeRules: zod_1.z.array(zod_1.z.object({
        field: zod_1.z.string(),
        strategy: zod_1.z.enum(['source', 'target', 'concat', 'sum', 'max', 'min', 'custom']),
        customHandler: zod_1.z.string().optional(),
    })).optional(),
});
/**
 * Zod schema for zero-downtime migration configuration.
 */
exports.ZeroDowntimeMigrationConfigSchema = zod_1.z.object({
    migrationName: zod_1.z.string().min(1),
    strategy: zod_1.z.enum(['expand-contract', 'dual-write', 'shadow-table', 'blue-green']),
    phases: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        operations: zod_1.z.array(zod_1.z.string()),
        rollbackOperations: zod_1.z.array(zod_1.z.string()).optional(),
        validations: zod_1.z.array(zod_1.z.string()).optional(),
    })),
    dualWritePeriod: zod_1.z.number().int().min(0).optional(),
    verificationQueries: zod_1.z.array(zod_1.z.string()).optional(),
    cutoverStrategy: zod_1.z.enum(['immediate', 'gradual', 'canary']).default('gradual'),
});
/**
 * Zod schema for multi-database sync configuration.
 */
exports.MultiDatabaseSyncConfigSchema = zod_1.z.object({
    syncName: zod_1.z.string().min(1),
    databases: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        connection: zod_1.z.record(zod_1.z.any()),
        role: zod_1.z.enum(['source', 'target', 'bidirectional']),
    })),
    syncMode: zod_1.z.enum(['full', 'incremental', 'delta', 'cdc']),
    conflictResolution: exports.ConflictResolutionConfigSchema,
    syncInterval: zod_1.z.number().int().min(0).optional(),
    filterConditions: zod_1.z.record(zod_1.z.any()).optional(),
    transformations: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
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
const createMigrationHistoryModel = (sequelize, DataTypes) => {
    return sequelize.define('MigrationHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        migrationName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'migration_name',
            index: true,
            comment: 'Unique migration identifier',
        },
        version: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Semantic version number',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        strategy: {
            type: DataTypes.ENUM('standard', 'zero-downtime', 'dual-write', 'shadow-table', 'expand-contract'),
            allowNull: false,
            defaultValue: 'standard',
        },
        status: {
            type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'rolled-back', 'partially-completed'),
            allowNull: false,
            defaultValue: 'pending',
            index: true,
        },
        executionPlan: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'execution_plan',
            comment: 'Detailed migration execution plan',
        },
        appliedStatements: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: [],
            field: 'applied_statements',
            comment: 'SQL statements that were executed',
        },
        rollbackStatements: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: [],
            field: 'rollback_statements',
            comment: 'SQL statements for rollback',
        },
        checksum: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Migration file checksum for integrity verification',
        },
        progress: {
            type: DataTypes.JSONB,
            defaultValue: {
                totalSteps: 0,
                completedSteps: 0,
                progress: 0,
                errors: [],
                checkpoints: [],
            },
            comment: 'Migration progress tracking',
        },
        affectedTables: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
            field: 'affected_tables',
        },
        affectedRows: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'affected_rows',
        },
        executionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'execution_time',
            comment: 'Execution duration in milliseconds',
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if migration failed',
        },
        executedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'executed_by',
            comment: 'User or system that executed migration',
        },
        environmentInfo: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'environment_info',
            comment: 'Database version, Node version, etc.',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
            comment: 'Additional migration metadata',
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'started_at',
            index: true,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
            index: true,
        },
        rolledBackAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'rolled_back_at',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'migration_history',
        timestamps: true,
        indexes: [
            { fields: ['migration_name'], unique: true },
            { fields: ['status'] },
            { fields: ['version'] },
            { fields: ['started_at'] },
            { fields: ['completed_at'] },
            { fields: ['strategy'] },
            { fields: ['progress'], using: 'gin' },
        ],
    });
};
exports.createMigrationHistoryModel = createMigrationHistoryModel;
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
const createETLPipelineExecutionModel = (sequelize, DataTypes) => {
    return sequelize.define('ETLPipelineExecution', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        pipelineName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'pipeline_name',
            index: true,
        },
        pipelineVersion: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'pipeline_version',
        },
        sourceType: {
            type: DataTypes.ENUM('database', 'file', 'api', 'stream'),
            allowNull: false,
            field: 'source_type',
        },
        targetType: {
            type: DataTypes.ENUM('database', 'file', 'api', 'stream'),
            allowNull: false,
            field: 'target_type',
        },
        status: {
            type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            index: true,
        },
        configuration: {
            type: DataTypes.JSONB,
            allowNull: false,
            comment: 'Pipeline configuration including transformations',
        },
        statistics: {
            type: DataTypes.JSONB,
            defaultValue: {
                totalRecords: 0,
                extractedRecords: 0,
                transformedRecords: 0,
                loadedRecords: 0,
                failedRecords: 0,
                skippedRecords: 0,
            },
            comment: 'Execution statistics',
        },
        errors: {
            type: DataTypes.JSONB,
            defaultValue: [],
            comment: 'Error records during execution',
        },
        performanceMetrics: {
            type: DataTypes.JSONB,
            defaultValue: {},
            field: 'performance_metrics',
            comment: 'Throughput, latency, resource usage',
        },
        checkpoints: {
            type: DataTypes.JSONB,
            defaultValue: [],
            comment: 'Execution checkpoints for resumability',
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'started_at',
            index: true,
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'completed_at',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        tableName: 'etl_pipeline_executions',
        timestamps: true,
        indexes: [
            { fields: ['pipeline_name'] },
            { fields: ['status'] },
            { fields: ['started_at'] },
            { fields: ['statistics'], using: 'gin' },
            { fields: ['performance_metrics'], using: 'gin' },
        ],
    });
};
exports.createETLPipelineExecutionModel = createETLPipelineExecutionModel;
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
const createDataValidationResultModel = (sequelize, DataTypes) => {
    return sequelize.define('DataValidationResult', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        validationName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'validation_name',
            index: true,
        },
        tableName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'table_name',
            index: true,
        },
        validationType: {
            type: DataTypes.ENUM('schema', 'data', 'referential-integrity', 'business-rules', 'quality'),
            allowNull: false,
            field: 'validation_type',
            defaultValue: 'data',
        },
        rules: {
            type: DataTypes.JSONB,
            defaultValue: [],
            comment: 'Validation rules applied',
        },
        totalRecords: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'total_records',
        },
        validRecords: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'valid_records',
        },
        invalidRecords: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'invalid_records',
        },
        warningRecords: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            field: 'warning_records',
        },
        errors: {
            type: DataTypes.JSONB,
            defaultValue: [],
            comment: 'Validation errors with details',
        },
        warnings: {
            type: DataTypes.JSONB,
            defaultValue: [],
            comment: 'Validation warnings',
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_valid',
            index: true,
        },
        executionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'execution_time',
            comment: 'Validation execution time in milliseconds',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        executedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'executed_at',
            index: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'data_validation_results',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['validation_name'] },
            { fields: ['table_name'] },
            { fields: ['validation_type'] },
            { fields: ['is_valid'] },
            { fields: ['executed_at'] },
            { fields: ['errors'], using: 'gin' },
        ],
    });
};
exports.createDataValidationResultModel = createDataValidationResultModel;
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
const createSchemaChangeLogModel = (sequelize, DataTypes) => {
    return sequelize.define('SchemaChangeLog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        migrationId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: 'migration_id',
            index: true,
            references: {
                model: 'migration_history',
                key: 'id',
            },
        },
        tableName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'table_name',
            index: true,
        },
        changeType: {
            type: DataTypes.ENUM('create-table', 'drop-table', 'rename-table', 'add-column', 'remove-column', 'modify-column', 'rename-column', 'add-index', 'remove-index', 'add-constraint', 'remove-constraint', 'add-trigger', 'remove-trigger'),
            allowNull: false,
            field: 'change_type',
            index: true,
        },
        columnName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'column_name',
        },
        oldDefinition: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'old_definition',
        },
        newDefinition: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'new_definition',
        },
        ddlStatement: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'ddl_statement',
            comment: 'The actual DDL statement executed',
        },
        rollbackDdl: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'rollback_ddl',
            comment: 'DDL statement to rollback this change',
        },
        appliedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'applied_at',
            index: true,
        },
        appliedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'applied_by',
        },
        metadata: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
    }, {
        tableName: 'schema_change_log',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['migration_id'] },
            { fields: ['table_name'] },
            { fields: ['change_type'] },
            { fields: ['applied_at'] },
            { fields: ['table_name', 'change_type'] },
        ],
    });
};
exports.createSchemaChangeLogModel = createSchemaChangeLogModel;
// ============================================================================
// MIGRATION PLANNING AND EXECUTION FUNCTIONS
// ============================================================================
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
const planMigration = async (sourceSchema, targetSchema, config) => {
    exports.MigrationConfigSchema.parse(config);
    const diff = await (0, exports.generateSchemaDiff)(sourceSchema, targetSchema);
    const steps = [];
    let stepOrder = 0;
    // Phase 1: Pre-migration validations
    steps.push({
        order: stepOrder++,
        phase: 'pre-validation',
        operation: 'validate-schema-integrity',
        description: 'Validate current schema integrity',
        rollbackable: false,
    });
    // Phase 2: Expand phase (for zero-downtime migrations)
    if (config.strategy === 'zero-downtime' || config.strategy === 'expand-contract') {
        // Add new tables
        for (const table of diff.tables.added) {
            steps.push({
                order: stepOrder++,
                phase: 'expand',
                operation: 'create-table',
                tableName: table,
                rollbackable: true,
            });
        }
        // Add new columns
        for (const modified of diff.tables.modified) {
            for (const change of modified.changes.filter(c => c.type === 'add-column')) {
                steps.push({
                    order: stepOrder++,
                    phase: 'expand',
                    operation: 'add-column',
                    tableName: modified.tableName,
                    columnName: change.columnName,
                    definition: change.newDefinition,
                    rollbackable: true,
                });
            }
        }
        // Add new indexes
        for (const index of diff.indexes.added) {
            steps.push({
                order: stepOrder++,
                phase: 'expand',
                operation: 'create-index',
                indexName: index.name,
                tableName: index.tableName,
                columns: index.columns,
                rollbackable: true,
            });
        }
    }
    // Phase 3: Data migration
    steps.push({
        order: stepOrder++,
        phase: 'data-migration',
        operation: 'migrate-data',
        description: 'Migrate data with transformations',
        batchSize: config.batchSize,
        rollbackable: true,
    });
    // Phase 4: Contract phase (for zero-downtime migrations)
    if (config.strategy === 'zero-downtime' || config.strategy === 'expand-contract') {
        // Remove old columns
        for (const modified of diff.tables.modified) {
            for (const change of modified.changes.filter(c => c.type === 'remove-column')) {
                steps.push({
                    order: stepOrder++,
                    phase: 'contract',
                    operation: 'drop-column',
                    tableName: modified.tableName,
                    columnName: change.columnName,
                    rollbackable: false, // Data loss
                });
            }
        }
        // Remove old indexes
        for (const index of diff.indexes.removed) {
            steps.push({
                order: stepOrder++,
                phase: 'contract',
                operation: 'drop-index',
                indexName: index.name,
                rollbackable: true,
            });
        }
        // Remove old tables
        for (const table of diff.tables.removed) {
            steps.push({
                order: stepOrder++,
                phase: 'contract',
                operation: 'drop-table',
                tableName: table,
                rollbackable: false, // Data loss
            });
        }
    }
    // Phase 5: Post-migration validations
    if (config.validateAfterApply) {
        steps.push({
            order: stepOrder++,
            phase: 'post-validation',
            operation: 'validate-migration-success',
            description: 'Validate migration completed successfully',
            rollbackable: false,
        });
    }
    return {
        migrationName: config.migrationName,
        version: config.version,
        strategy: config.strategy,
        totalSteps: steps.length,
        estimatedDuration: (0, exports.estimateMigrationDuration)(steps, config),
        steps,
        diff,
        rollbackable: steps.every(s => s.rollbackable),
        createdAt: new Date(),
    };
};
exports.planMigration = planMigration;
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
const executeMigration = async (migrationPlan, sequelize, MigrationHistoryModel, progressCallback) => {
    const transaction = await sequelize.transaction();
    const migrationRecord = await MigrationHistoryModel.create({
        migrationName: migrationPlan.migrationName,
        version: migrationPlan.version,
        strategy: migrationPlan.strategy,
        status: 'running',
        executionPlan: migrationPlan,
        startedAt: new Date(),
    }, { transaction });
    const progress = {
        migrationId: migrationRecord.id,
        status: 'running',
        totalSteps: migrationPlan.totalSteps,
        completedSteps: 0,
        progress: 0,
        startedAt: new Date(),
        errors: [],
        checkpoints: [],
    };
    try {
        const appliedStatements = [];
        const rollbackStatements = [];
        for (const step of migrationPlan.steps) {
            progress.currentStep = step.operation;
            try {
                const { ddl, rollbackDdl } = await (0, exports.executeStep)(step, sequelize, transaction);
                if (ddl) {
                    appliedStatements.push(...ddl);
                }
                if (rollbackDdl) {
                    rollbackStatements.unshift(...rollbackDdl); // Reverse order for rollback
                }
                progress.completedSteps++;
                progress.progress = (progress.completedSteps / progress.totalSteps) * 100;
                // Create checkpoint every 10 steps
                if (progress.completedSteps % 10 === 0) {
                    progress.checkpoints.push({
                        step: step.operation,
                        timestamp: new Date(),
                        state: { completedSteps: progress.completedSteps },
                    });
                }
                if (progressCallback) {
                    progressCallback(progress);
                }
            }
            catch (error) {
                progress.errors.push({
                    step: step.operation,
                    error: error.message,
                    timestamp: new Date(),
                });
                throw error;
            }
        }
        await migrationRecord.update({
            status: 'completed',
            appliedStatements,
            rollbackStatements,
            progress,
            completedAt: new Date(),
            executionTime: Date.now() - progress.startedAt.getTime(),
        }, { transaction });
        await transaction.commit();
        progress.status = 'completed';
        progress.completedAt = new Date();
        return progress;
    }
    catch (error) {
        await transaction.rollback();
        await MigrationHistoryModel.update({
            status: 'failed',
            error: error.message,
            progress,
            completedAt: new Date(),
        }, {
            where: { id: migrationRecord.id },
        });
        progress.status = 'failed';
        throw error;
    }
};
exports.executeMigration = executeMigration;
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
const executeStep = async (step, sequelize, transaction) => {
    const ddl = [];
    const rollbackDdl = [];
    switch (step.operation) {
        case 'create-table':
            const createTableDdl = (0, exports.generateCreateTableDdl)(step);
            await sequelize.query(createTableDdl, { transaction });
            ddl.push(createTableDdl);
            rollbackDdl.push(`DROP TABLE IF EXISTS ${step.tableName};`);
            break;
        case 'add-column':
            const addColumnDdl = (0, exports.generateAddColumnDdl)(step);
            await sequelize.query(addColumnDdl, { transaction });
            ddl.push(addColumnDdl);
            rollbackDdl.push(`ALTER TABLE ${step.tableName} DROP COLUMN ${step.columnName};`);
            break;
        case 'create-index':
            const createIndexDdl = (0, exports.generateCreateIndexDdl)(step);
            await sequelize.query(createIndexDdl, { transaction });
            ddl.push(createIndexDdl);
            rollbackDdl.push(`DROP INDEX IF EXISTS ${step.indexName};`);
            break;
        case 'migrate-data':
            // Data migration is handled by batch processing
            break;
        case 'drop-column':
            const dropColumnDdl = `ALTER TABLE ${step.tableName} DROP COLUMN ${step.columnName};`;
            await sequelize.query(dropColumnDdl, { transaction });
            ddl.push(dropColumnDdl);
            // Cannot rollback column drop - data loss
            break;
        case 'drop-table':
            const dropTableDdl = `DROP TABLE IF EXISTS ${step.tableName};`;
            await sequelize.query(dropTableDdl, { transaction });
            ddl.push(dropTableDdl);
            // Cannot rollback table drop - data loss
            break;
        case 'drop-index':
            const dropIndexDdl = `DROP INDEX IF EXISTS ${step.indexName};`;
            await sequelize.query(dropIndexDdl, { transaction });
            ddl.push(dropIndexDdl);
            // Can recreate index from step definition
            if (step.columns) {
                rollbackDdl.push((0, exports.generateCreateIndexDdl)(step));
            }
            break;
        default:
            throw new Error(`Unknown migration operation: ${step.operation}`);
    }
    return { ddl, rollbackDdl };
};
exports.executeStep = executeStep;
// ============================================================================
// SCHEMA DIFFING AND ANALYSIS FUNCTIONS
// ============================================================================
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
const generateSchemaDiff = async (sourceSchema, targetSchema) => {
    const diff = {
        tables: {
            added: [],
            removed: [],
            modified: [],
        },
        indexes: {
            added: [],
            removed: [],
        },
        constraints: {
            added: [],
            removed: [],
        },
        sequences: {
            added: [],
            removed: [],
        },
    };
    const sourceTables = Object.keys(sourceSchema.tables || {});
    const targetTables = Object.keys(targetSchema.tables || {});
    // Find added and removed tables
    diff.tables.added = targetTables.filter(t => !sourceTables.includes(t));
    diff.tables.removed = sourceTables.filter(t => !targetTables.includes(t));
    // Find modified tables
    const commonTables = sourceTables.filter(t => targetTables.includes(t));
    for (const tableName of commonTables) {
        const changes = await (0, exports.compareTableSchemas)(sourceSchema.tables[tableName], targetSchema.tables[tableName]);
        if (changes.length > 0) {
            diff.tables.modified.push({
                tableName,
                changes,
            });
        }
    }
    // Compare indexes
    const sourceIndexes = sourceSchema.indexes || [];
    const targetIndexes = targetSchema.indexes || [];
    diff.indexes.added = targetIndexes.filter((ti) => !sourceIndexes.some((si) => si.name === ti.name));
    diff.indexes.removed = sourceIndexes.filter((si) => !targetIndexes.some((ti) => ti.name === si.name));
    // Compare constraints
    const sourceConstraints = sourceSchema.constraints || [];
    const targetConstraints = targetSchema.constraints || [];
    diff.constraints.added = targetConstraints.filter((tc) => !sourceConstraints.some((sc) => sc.name === tc.name));
    diff.constraints.removed = sourceConstraints.filter((sc) => !targetConstraints.some((tc) => tc.name === sc.name));
    return diff;
};
exports.generateSchemaDiff = generateSchemaDiff;
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
const compareTableSchemas = async (sourceTable, targetTable) => {
    const changes = [];
    const sourceColumns = Object.keys(sourceTable.columns || {});
    const targetColumns = Object.keys(targetTable.columns || {});
    // Find added columns
    for (const columnName of targetColumns.filter(c => !sourceColumns.includes(c))) {
        changes.push({
            type: 'add-column',
            columnName,
            newDefinition: targetTable.columns[columnName],
        });
    }
    // Find removed columns
    for (const columnName of sourceColumns.filter(c => !targetColumns.includes(c))) {
        changes.push({
            type: 'remove-column',
            columnName,
            oldDefinition: sourceTable.columns[columnName],
        });
    }
    // Find modified columns
    const commonColumns = sourceColumns.filter(c => targetColumns.includes(c));
    for (const columnName of commonColumns) {
        const sourceCol = sourceTable.columns[columnName];
        const targetCol = targetTable.columns[columnName];
        if (JSON.stringify(sourceCol) !== JSON.stringify(targetCol)) {
            changes.push({
                type: 'modify-column',
                columnName,
                oldDefinition: sourceCol,
                newDefinition: targetCol,
            });
        }
    }
    return changes;
};
exports.compareTableSchemas = compareTableSchemas;
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
const analyzeMigrationImpact = async (migrationPlan, sequelize) => {
    const analysis = {
        migrationName: migrationPlan.migrationName,
        riskLevel: 'low',
        estimatedDowntime: 0,
        affectedTables: [],
        dataLossRisk: false,
        performanceImpact: 'minimal',
        rollbackComplexity: 'simple',
        recommendations: [],
        affectedRowEstimates: {},
    };
    // Collect affected tables
    for (const step of migrationPlan.steps) {
        if (step.tableName && !analysis.affectedTables.includes(step.tableName)) {
            analysis.affectedTables.push(step.tableName);
        }
    }
    // Get row counts for affected tables
    for (const tableName of analysis.affectedTables) {
        try {
            const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName};`);
            analysis.affectedRowEstimates[tableName] = parseInt(result[0].count, 10);
        }
        catch (error) {
            analysis.affectedRowEstimates[tableName] = 0;
        }
    }
    // Assess data loss risk
    const dataLossOps = ['drop-table', 'drop-column', 'truncate-table'];
    analysis.dataLossRisk = migrationPlan.steps.some((s) => dataLossOps.includes(s.operation));
    // Assess rollback complexity
    const nonRollbackableSteps = migrationPlan.steps.filter((s) => !s.rollbackable);
    if (nonRollbackableSteps.length > 0) {
        analysis.rollbackComplexity = 'impossible';
    }
    else if (migrationPlan.steps.length > 20) {
        analysis.rollbackComplexity = 'complex';
    }
    else if (migrationPlan.steps.length > 5) {
        analysis.rollbackComplexity = 'moderate';
    }
    // Calculate risk level
    if (analysis.dataLossRisk || analysis.rollbackComplexity === 'impossible') {
        analysis.riskLevel = 'critical';
    }
    else if (Object.values(analysis.affectedRowEstimates).some(count => count > 1000000)) {
        analysis.riskLevel = 'high';
    }
    else if (migrationPlan.steps.length > 10) {
        analysis.riskLevel = 'medium';
    }
    // Generate recommendations
    if (analysis.riskLevel === 'critical') {
        analysis.recommendations.push('Create full database backup before migration');
        analysis.recommendations.push('Perform migration during maintenance window');
    }
    if (migrationPlan.strategy !== 'zero-downtime' && analysis.riskLevel !== 'low') {
        analysis.recommendations.push('Consider using zero-downtime migration strategy');
    }
    if (Object.values(analysis.affectedRowEstimates).some(count => count > 100000)) {
        analysis.recommendations.push('Use batch processing for data migration');
        analysis.recommendations.push('Monitor database performance during migration');
    }
    if (analysis.dataLossRisk) {
        analysis.recommendations.push('CRITICAL: Data loss operations detected - verify intentional');
        analysis.recommendations.push('Export affected data before proceeding');
    }
    return analysis;
};
exports.analyzeMigrationImpact = analyzeMigrationImpact;
// ============================================================================
// ETL PIPELINE FUNCTIONS
// ============================================================================
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
const executeETLPipeline = async (config, ETLExecutionModel, progressCallback) => {
    exports.ETLPipelineConfigSchema.parse(config);
    const execution = await ETLExecutionModel.create({
        pipelineName: config.pipelineName,
        sourceType: config.source.type,
        targetType: config.target.type,
        configuration: config,
        status: 'running',
        startedAt: new Date(),
    });
    const result = {
        totalRecords: 0,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        skippedRecords: 0,
        errors: [],
        duration: 0,
        throughput: 0,
    };
    const startTime = Date.now();
    try {
        // Extract phase
        const sourceData = await (0, exports.extractData)(config.source);
        result.totalRecords = sourceData.length;
        // Transform and Load phase
        const batches = (0, exports.chunkArray)(sourceData, config.batchSize);
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const transformedBatch = [];
            for (const record of batch) {
                try {
                    let transformedRecord = { ...record };
                    // Apply transformations
                    for (const transformation of config.transformations) {
                        transformedRecord = await (0, exports.applyTransformation)(transformedRecord, transformation);
                    }
                    transformedBatch.push(transformedRecord);
                    result.processedRecords++;
                }
                catch (error) {
                    result.failedRecords++;
                    result.errors.push({
                        recordId: record.id || `batch-${i}-index-${batch.indexOf(record)}`,
                        error: error.message,
                    });
                    if (config.errorHandling === 'abort') {
                        throw error;
                    }
                }
            }
            // Load batch to target
            if (transformedBatch.length > 0) {
                await (0, exports.loadData)(config.target, transformedBatch);
                result.successfulRecords += transformedBatch.length;
            }
            if (progressCallback) {
                progressCallback({
                    processed: result.processedRecords,
                    total: result.totalRecords,
                    progress: (result.processedRecords / result.totalRecords) * 100,
                });
            }
        }
        result.duration = Date.now() - startTime;
        result.throughput = result.successfulRecords / (result.duration / 1000);
        await execution.update({
            status: 'completed',
            statistics: {
                totalRecords: result.totalRecords,
                extractedRecords: result.totalRecords,
                transformedRecords: result.processedRecords,
                loadedRecords: result.successfulRecords,
                failedRecords: result.failedRecords,
                skippedRecords: result.skippedRecords,
            },
            errors: result.errors,
            performanceMetrics: {
                duration: result.duration,
                throughput: result.throughput,
            },
            completedAt: new Date(),
        });
        return result;
    }
    catch (error) {
        await execution.update({
            status: 'failed',
            errors: [...result.errors, { error: error.message }],
            completedAt: new Date(),
        });
        throw error;
    }
};
exports.executeETLPipeline = executeETLPipeline;
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
const extractData = async (sourceConfig) => {
    switch (sourceConfig.type) {
        case 'database':
            const [results] = await sourceConfig.connection.query(sourceConfig.query);
            return results;
        case 'file':
            // File extraction logic would go here
            throw new Error('File extraction not yet implemented');
        case 'api':
            // API extraction logic would go here
            throw new Error('API extraction not yet implemented');
        case 'stream':
            // Stream extraction logic would go here
            throw new Error('Stream extraction not yet implemented');
        default:
            throw new Error(`Unsupported source type: ${sourceConfig.type}`);
    }
};
exports.extractData = extractData;
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
const loadData = async (targetConfig, data) => {
    switch (targetConfig.type) {
        case 'database':
            const model = targetConfig.connection.models[targetConfig.table];
            if (model) {
                await model.bulkCreate(data, { validate: true });
            }
            else {
                throw new Error(`Model not found: ${targetConfig.table}`);
            }
            break;
        case 'file':
            // File loading logic would go here
            throw new Error('File loading not yet implemented');
        case 'api':
            // API loading logic would go here
            throw new Error('API loading not yet implemented');
        case 'stream':
            // Stream loading logic would go here
            throw new Error('Stream loading not yet implemented');
        default:
            throw new Error(`Unsupported target type: ${targetConfig.type}`);
    }
};
exports.loadData = loadData;
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
const applyTransformation = async (record, transformation) => {
    switch (transformation.type) {
        case 'map':
            const { field, transform } = transformation.config;
            if (field && transform && typeof transform === 'function') {
                record[field] = await transform(record[field], record);
            }
            break;
        case 'filter':
            const { condition } = transformation.config;
            if (condition && typeof condition === 'function') {
                const shouldInclude = await condition(record);
                if (!shouldInclude) {
                    throw new Error('Record filtered out');
                }
            }
            break;
        case 'validate':
            const { schema } = transformation.config;
            if (schema) {
                schema.parse(record);
            }
            break;
        case 'enrich':
            const { enricher } = transformation.config;
            if (enricher && typeof enricher === 'function') {
                const enrichedData = await enricher(record);
                Object.assign(record, enrichedData);
            }
            break;
        default:
            throw new Error(`Unsupported transformation type: ${transformation.type}`);
    }
    return record;
};
exports.applyTransformation = applyTransformation;
// ============================================================================
// BATCH PROCESSING FUNCTIONS
// ============================================================================
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
const processBatch = async (data, processor, config, progressCallback) => {
    exports.BatchProcessConfigSchema.parse(config);
    const result = {
        totalRecords: data.length,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        skippedRecords: 0,
        errors: [],
        duration: 0,
        throughput: 0,
    };
    const startTime = Date.now();
    const batches = (0, exports.chunkArray)(data, config.batchSize);
    const checkpoints = [];
    try {
        if (config.parallelism === 1) {
            // Sequential processing
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                try {
                    await processor(batch);
                    result.successfulRecords += batch.length;
                }
                catch (error) {
                    result.failedRecords += batch.length;
                    result.errors.push({
                        recordId: `batch-${i}`,
                        error: error.message,
                    });
                }
                result.processedRecords += batch.length;
                // Save checkpoint
                if (config.saveCheckpoints && result.processedRecords % config.checkpointInterval === 0) {
                    checkpoints.push({
                        processedRecords: result.processedRecords,
                        timestamp: new Date(),
                    });
                }
                // Report progress
                if (progressCallback && result.processedRecords % config.progressInterval === 0) {
                    progressCallback({
                        processed: result.processedRecords,
                        total: result.totalRecords,
                        progress: (result.processedRecords / result.totalRecords) * 100,
                        successful: result.successfulRecords,
                        failed: result.failedRecords,
                    });
                }
            }
        }
        else {
            // Parallel processing
            const batchGroups = (0, exports.chunkArray)(batches, config.parallelism);
            for (const group of batchGroups) {
                const promises = group.map(async (batch, idx) => {
                    try {
                        await processor(batch);
                        return { success: true, count: batch.length };
                    }
                    catch (error) {
                        return {
                            success: false,
                            count: batch.length,
                            error: error.message,
                            batchIndex: idx,
                        };
                    }
                });
                const results = await Promise.all(promises);
                for (const res of results) {
                    if (res.success) {
                        result.successfulRecords += res.count;
                    }
                    else {
                        result.failedRecords += res.count;
                        result.errors.push({
                            recordId: `batch-${res.batchIndex}`,
                            error: res.error || 'Unknown error',
                        });
                    }
                    result.processedRecords += res.count;
                }
                if (progressCallback) {
                    progressCallback({
                        processed: result.processedRecords,
                        total: result.totalRecords,
                        progress: (result.processedRecords / result.totalRecords) * 100,
                        successful: result.successfulRecords,
                        failed: result.failedRecords,
                    });
                }
            }
        }
        result.duration = Date.now() - startTime;
        result.throughput = result.successfulRecords / (result.duration / 1000);
        return result;
    }
    catch (error) {
        result.duration = Date.now() - startTime;
        throw error;
    }
};
exports.processBatch = processBatch;
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
const processBatchWithRetry = async (data, processor, maxRetries = 3, retryDelay = 1000) => {
    const result = {
        totalRecords: data.length,
        processedRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        skippedRecords: 0,
        errors: [],
        duration: 0,
        throughput: 0,
    };
    const startTime = Date.now();
    for (const record of data) {
        let attempt = 0;
        let success = false;
        while (attempt < maxRetries && !success) {
            try {
                await processor([record]);
                result.successfulRecords++;
                success = true;
            }
            catch (error) {
                attempt++;
                if (attempt >= maxRetries) {
                    result.failedRecords++;
                    result.errors.push({
                        recordId: record.id || record,
                        error: `Failed after ${maxRetries} attempts: ${error.message}`,
                    });
                }
                else {
                    await (0, exports.sleep)(retryDelay * attempt); // Exponential backoff
                }
            }
        }
        result.processedRecords++;
    }
    result.duration = Date.now() - startTime;
    result.throughput = result.successfulRecords / (result.duration / 1000);
    return result;
};
exports.processBatchWithRetry = processBatchWithRetry;
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
const resumeBatchProcessing = async (data, processor, checkpoint, config) => {
    const startIndex = checkpoint.processedRecords || 0;
    const remainingData = data.slice(startIndex);
    return (0, exports.processBatch)(remainingData, processor, config);
};
exports.resumeBatchProcessing = resumeBatchProcessing;
// ============================================================================
// ROLLBACK FUNCTIONS
// ============================================================================
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
const rollbackMigration = async (migrationId, MigrationHistoryModel, sequelize, config) => {
    exports.RollbackConfigSchema.parse({ ...config, migrationId });
    const migration = await MigrationHistoryModel.findByPk(migrationId);
    if (!migration) {
        throw new Error(`Migration not found: ${migrationId}`);
    }
    if (migration.status !== 'completed') {
        throw new Error(`Cannot rollback migration with status: ${migration.status}`);
    }
    if (config.createBackup) {
        await (0, exports.createDatabaseBackup)(sequelize);
    }
    const transaction = await sequelize.transaction();
    try {
        const rollbackStatements = migration.rollbackStatements || [];
        if (rollbackStatements.length === 0) {
            throw new Error('No rollback statements available for this migration');
        }
        for (const statement of rollbackStatements) {
            if (!config.dryRun) {
                await sequelize.query(statement, { transaction });
            }
        }
        if (!config.dryRun) {
            await migration.update({
                status: 'rolled-back',
                rolledBackAt: new Date(),
            }, { transaction });
            await transaction.commit();
        }
        else {
            await transaction.rollback();
        }
        return {
            migrationId,
            status: 'rolled-back',
            statementsExecuted: rollbackStatements.length,
            dryRun: config.dryRun,
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.rollbackMigration = rollbackMigration;
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
const createRollbackPlan = async (migrationPlan) => {
    const rollbackSteps = [];
    for (const step of [...migrationPlan.steps].reverse()) {
        if (step.rollbackable) {
            rollbackSteps.push({
                operation: (0, exports.getRollbackOperation)(step.operation),
                tableName: step.tableName,
                columnName: step.columnName,
                indexName: step.indexName,
                originalDefinition: step.definition,
            });
        }
        else {
            rollbackSteps.push({
                operation: 'manual-intervention-required',
                reason: `Operation ${step.operation} is not automatically rollbackable`,
                tableName: step.tableName,
            });
        }
    }
    return {
        migrationName: migrationPlan.migrationName,
        rollbackable: rollbackSteps.every((s) => s.operation !== 'manual-intervention-required'),
        steps: rollbackSteps,
        warnings: rollbackSteps
            .filter((s) => s.operation === 'manual-intervention-required')
            .map((s) => s.reason),
    };
};
exports.createRollbackPlan = createRollbackPlan;
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
const createDatabaseBackup = async (sequelize, backupPath) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = backupPath || `/backups/db-backup-${timestamp}.sql`;
    // This is a simplified example - actual implementation would depend on database type
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        // Use pg_dump for PostgreSQL
        const { execSync } = require('child_process');
        const config = sequelize.config;
        execSync(`pg_dump -h ${config.host} -p ${config.port} -U ${config.username} -d ${config.database} -f ${path}`, { env: { ...process.env, PGPASSWORD: config.password } });
    }
    else {
        throw new Error(`Backup not implemented for dialect: ${dialect}`);
    }
    return path;
};
exports.createDatabaseBackup = createDatabaseBackup;
// ============================================================================
// DATA VALIDATION FUNCTIONS
// ============================================================================
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
const validateData = async (data, rules, ValidationResultModel) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
            totalRecords: data.length,
            validRecords: 0,
            invalidRecords: 0,
            warningRecords: 0,
        },
    };
    const recordValidationStatus = new Set();
    for (let i = 0; i < data.length; i++) {
        const record = data[i];
        let recordValid = true;
        for (const rule of rules) {
            const validationError = await (0, exports.validateRule)(record, rule);
            if (validationError) {
                if (rule.errorLevel === 'error') {
                    result.errors.push(validationError);
                    recordValid = false;
                }
                else if (rule.errorLevel === 'warning') {
                    result.warnings.push({
                        rule: rule.ruleName,
                        message: validationError.message,
                    });
                }
            }
        }
        if (recordValid) {
            result.statistics.validRecords++;
        }
        else {
            result.statistics.invalidRecords++;
            recordValidationStatus.add(i);
        }
    }
    result.isValid = result.errors.length === 0;
    result.statistics.warningRecords = result.warnings.length;
    if (ValidationResultModel) {
        await ValidationResultModel.create({
            validationName: 'data-validation',
            tableName: 'unknown',
            validationType: 'data',
            rules,
            totalRecords: result.statistics.totalRecords,
            validRecords: result.statistics.validRecords,
            invalidRecords: result.statistics.invalidRecords,
            warningRecords: result.statistics.warningRecords,
            errors: result.errors,
            warnings: result.warnings,
            isValid: result.isValid,
            executedAt: new Date(),
        });
    }
    return result;
};
exports.validateData = validateData;
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
const validateRule = async (record, rule) => {
    exports.DataValidationRuleSchema.parse(rule);
    const value = record[rule.field];
    switch (rule.ruleType) {
        case 'required':
            if (value === null || value === undefined || value === '') {
                return {
                    rule: rule.ruleName,
                    field: rule.field,
                    value,
                    message: rule.errorMessage || `Field ${rule.field} is required`,
                    level: rule.errorLevel,
                };
            }
            break;
        case 'format':
            if (rule.condition.pattern && !rule.condition.pattern.test(value)) {
                return {
                    rule: rule.ruleName,
                    field: rule.field,
                    value,
                    message: rule.errorMessage || `Field ${rule.field} does not match required format`,
                    level: rule.errorLevel,
                };
            }
            break;
        case 'range':
            if (rule.condition.min !== undefined && value < rule.condition.min) {
                return {
                    rule: rule.ruleName,
                    field: rule.field,
                    value,
                    message: rule.errorMessage || `Field ${rule.field} is below minimum value ${rule.condition.min}`,
                    level: rule.errorLevel,
                };
            }
            if (rule.condition.max !== undefined && value > rule.condition.max) {
                return {
                    rule: rule.ruleName,
                    field: rule.field,
                    value,
                    message: rule.errorMessage || `Field ${rule.field} exceeds maximum value ${rule.condition.max}`,
                    level: rule.errorLevel,
                };
            }
            break;
        case 'custom':
            if (rule.condition.validator && typeof rule.condition.validator === 'function') {
                const isValid = await rule.condition.validator(value, record);
                if (!isValid) {
                    return {
                        rule: rule.ruleName,
                        field: rule.field,
                        value,
                        message: rule.errorMessage || `Field ${rule.field} failed custom validation`,
                        level: rule.errorLevel,
                    };
                }
            }
            break;
    }
    return null;
};
exports.validateRule = validateRule;
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
const validateReferentialIntegrity = async (sequelize, sourceTable, targetTable, foreignKey) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
            totalRecords: 0,
            validRecords: 0,
            invalidRecords: 0,
            warningRecords: 0,
        },
    };
    const query = `
    SELECT COUNT(*) as total_orphans
    FROM ${sourceTable}
    WHERE ${foreignKey} IS NOT NULL
    AND ${foreignKey} NOT IN (SELECT id FROM ${targetTable})
  `;
    const [rows] = await sequelize.query(query);
    const orphanCount = parseInt(rows[0].total_orphans, 10);
    if (orphanCount > 0) {
        result.isValid = false;
        result.errors.push({
            rule: 'referential-integrity',
            field: foreignKey,
            value: orphanCount,
            message: `Found ${orphanCount} orphaned records in ${sourceTable}.${foreignKey}`,
            level: 'error',
        });
        result.statistics.invalidRecords = orphanCount;
    }
    return result;
};
exports.validateReferentialIntegrity = validateReferentialIntegrity;
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
const validateSchemaIntegrity = async (sequelize, expectedSchema) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
            totalRecords: 0,
            validRecords: 0,
            invalidRecords: 0,
            warningRecords: 0,
        },
    };
    // Get actual schema from database
    const actualSchema = await (0, exports.introspectDatabaseSchema)(sequelize);
    // Validate tables exist
    for (const tableName of Object.keys(expectedSchema.tables || {})) {
        if (!actualSchema.tables[tableName]) {
            result.isValid = false;
            result.errors.push({
                rule: 'table-exists',
                field: 'tables',
                value: tableName,
                message: `Expected table ${tableName} not found in database`,
                level: 'error',
            });
        }
    }
    // Validate columns exist and have correct types
    for (const [tableName, tableSchema] of Object.entries(expectedSchema.tables || {})) {
        if (actualSchema.tables[tableName]) {
            for (const [columnName, columnDef] of Object.entries(tableSchema.columns || {})) {
                const actualColumn = actualSchema.tables[tableName].columns[columnName];
                if (!actualColumn) {
                    result.isValid = false;
                    result.errors.push({
                        rule: 'column-exists',
                        field: 'columns',
                        value: `${tableName}.${columnName}`,
                        message: `Expected column ${tableName}.${columnName} not found`,
                        level: 'error',
                    });
                }
                else if (actualColumn.type !== columnDef.type) {
                    result.warnings.push({
                        rule: 'column-type-mismatch',
                        message: `Column ${tableName}.${columnName} type mismatch: expected ${columnDef.type}, got ${actualColumn.type}`,
                    });
                }
            }
        }
    }
    return result;
};
exports.validateSchemaIntegrity = validateSchemaIntegrity;
// ============================================================================
// CONFLICT RESOLUTION FUNCTIONS
// ============================================================================
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
const resolveConflicts = async (sourceData, targetData, config) => {
    exports.ConflictResolutionConfigSchema.parse(config);
    const result = {
        totalConflicts: 0,
        resolvedConflicts: 0,
        unresolvedConflicts: 0,
        resolutions: [],
        manualReviewRequired: [],
    };
    // Build index of target data by key fields
    const targetIndex = new Map();
    for (const targetRecord of targetData) {
        const key = (0, exports.buildRecordKey)(targetRecord, config.conflictDetection.keyFields);
        targetIndex.set(key, targetRecord);
    }
    for (const sourceRecord of sourceData) {
        const key = (0, exports.buildRecordKey)(sourceRecord, config.conflictDetection.keyFields);
        const targetRecord = targetIndex.get(key);
        if (!targetRecord) {
            continue; // No conflict, source record is new
        }
        // Check if records differ
        const hasConflict = await (0, exports.detectConflict)(sourceRecord, targetRecord, config.conflictDetection);
        if (hasConflict) {
            result.totalConflicts++;
            const resolution = await (0, exports.resolveConflict)(sourceRecord, targetRecord, config);
            if (resolution.requiresManualReview) {
                result.unresolvedConflicts++;
                result.manualReviewRequired.push({
                    recordId: key,
                    reason: resolution.reason || 'Unable to auto-resolve',
                    sourceValue: sourceRecord,
                    targetValue: targetRecord,
                });
            }
            else {
                result.resolvedConflicts++;
                result.resolutions.push({
                    recordId: key,
                    strategy: config.strategy,
                    sourceValue: sourceRecord,
                    targetValue: targetRecord,
                    resolvedValue: resolution.resolvedValue,
                });
            }
        }
    }
    return result;
};
exports.resolveConflicts = resolveConflicts;
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
const detectConflict = async (sourceRecord, targetRecord, conflictDetection) => {
    const compareFields = conflictDetection.compareFields || Object.keys(sourceRecord);
    for (const field of compareFields) {
        if (sourceRecord[field] !== targetRecord[field]) {
            return true;
        }
    }
    return false;
};
exports.detectConflict = detectConflict;
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
const resolveConflict = async (sourceRecord, targetRecord, config) => {
    switch (config.strategy) {
        case 'source-wins':
            return {
                requiresManualReview: false,
                resolvedValue: sourceRecord,
            };
        case 'target-wins':
            return {
                requiresManualReview: false,
                resolvedValue: targetRecord,
            };
        case 'newest-wins':
            if (!config.conflictDetection.timestampField) {
                return {
                    requiresManualReview: true,
                    reason: 'No timestamp field configured for newest-wins strategy',
                };
            }
            const sourceTime = new Date(sourceRecord[config.conflictDetection.timestampField]).getTime();
            const targetTime = new Date(targetRecord[config.conflictDetection.timestampField]).getTime();
            return {
                requiresManualReview: false,
                resolvedValue: sourceTime > targetTime ? sourceRecord : targetRecord,
            };
        case 'merge':
            const merged = { ...targetRecord };
            for (const mergeRule of config.mergeRules || []) {
                const sourceValue = sourceRecord[mergeRule.field];
                const targetValue = targetRecord[mergeRule.field];
                switch (mergeRule.strategy) {
                    case 'source':
                        merged[mergeRule.field] = sourceValue;
                        break;
                    case 'target':
                        merged[mergeRule.field] = targetValue;
                        break;
                    case 'concat':
                        merged[mergeRule.field] = `${targetValue} ${sourceValue}`;
                        break;
                    case 'sum':
                        merged[mergeRule.field] = (targetValue || 0) + (sourceValue || 0);
                        break;
                    case 'max':
                        merged[mergeRule.field] = Math.max(targetValue || 0, sourceValue || 0);
                        break;
                    case 'min':
                        merged[mergeRule.field] = Math.min(targetValue || 0, sourceValue || 0);
                        break;
                }
            }
            return {
                requiresManualReview: false,
                resolvedValue: merged,
            };
        case 'manual':
            return {
                requiresManualReview: true,
                reason: 'Manual resolution strategy configured',
            };
        default:
            return {
                requiresManualReview: true,
                reason: `Unknown resolution strategy: ${config.strategy}`,
            };
    }
};
exports.resolveConflict = resolveConflict;
// ============================================================================
// ZERO-DOWNTIME MIGRATION FUNCTIONS
// ============================================================================
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
const executeZeroDowntimeMigration = async (config, sequelize, MigrationHistoryModel) => {
    exports.ZeroDowntimeMigrationConfigSchema.parse(config);
    const migrationRecord = await MigrationHistoryModel.create({
        migrationName: config.migrationName,
        version: '1.0.0',
        strategy: config.strategy,
        status: 'running',
        executionPlan: config,
        startedAt: new Date(),
    });
    try {
        const results = [];
        for (const phase of config.phases) {
            console.log(`Executing phase: ${phase.name}`);
            const phaseResult = {
                phaseName: phase.name,
                operations: [],
                validations: [],
            };
            // Execute phase operations
            for (const operation of phase.operations) {
                await sequelize.query(operation);
                phaseResult.operations.push({
                    operation,
                    status: 'completed',
                });
            }
            // Run phase validations
            if (phase.validations) {
                for (const validation of phase.validations) {
                    const [validationResult] = await sequelize.query(validation);
                    phaseResult.validations.push({
                        validation,
                        result: validationResult,
                    });
                }
            }
            results.push(phaseResult);
            // Wait between phases if dual-write period configured
            if (phase.name === 'expand' && config.dualWritePeriod) {
                console.log(`Waiting ${config.dualWritePeriod}ms for dual-write period...`);
                await (0, exports.sleep)(config.dualWritePeriod);
            }
        }
        await migrationRecord.update({
            status: 'completed',
            progress: { phases: results },
            completedAt: new Date(),
            executionTime: Date.now() - migrationRecord.startedAt.getTime(),
        });
        return {
            migrationId: migrationRecord.id,
            status: 'completed',
            phases: results,
        };
    }
    catch (error) {
        await migrationRecord.update({
            status: 'failed',
            error: error.message,
            completedAt: new Date(),
        });
        throw error;
    }
};
exports.executeZeroDowntimeMigration = executeZeroDowntimeMigration;
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
const createShadowTable = async (sourceTable, newSchema, sequelize) => {
    const shadowTableName = `${sourceTable}_shadow_${Date.now()}`;
    // Generate CREATE TABLE statement for shadow table
    const createTableDdl = (0, exports.generateCreateTableDdl)({
        tableName: shadowTableName,
        schema: newSchema,
    });
    await sequelize.query(createTableDdl);
    // Copy data from source to shadow table
    const copyDataQuery = `
    INSERT INTO ${shadowTableName}
    SELECT * FROM ${sourceTable}
  `;
    await sequelize.query(copyDataQuery);
    return shadowTableName;
};
exports.createShadowTable = createShadowTable;
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
const performCutover = async (oldTable, newTable, sequelize, strategy = 'immediate') => {
    const transaction = await sequelize.transaction();
    try {
        if (strategy === 'immediate') {
            // Rename old table
            await sequelize.query(`ALTER TABLE ${oldTable} RENAME TO ${oldTable}_backup;`, { transaction });
            // Rename new table to production name
            const productionName = oldTable.replace('_old', '');
            await sequelize.query(`ALTER TABLE ${newTable} RENAME TO ${productionName};`, { transaction });
            await transaction.commit();
        }
        else {
            throw new Error(`Cutover strategy ${strategy} not yet implemented`);
        }
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.performCutover = performCutover;
// ============================================================================
// MULTI-DATABASE SYNC FUNCTIONS
// ============================================================================
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
const synchronizeMultipleDatabases = async (config) => {
    exports.MultiDatabaseSyncConfigSchema.parse(config);
    const result = {
        syncName: config.syncName,
        databases: [],
        totalRecordsSynced: 0,
        conflicts: 0,
        errors: [],
        startedAt: new Date(),
        completedAt: null,
    };
    const sourceDb = config.databases.find((db) => db.role === 'source');
    const targetDbs = config.databases.filter((db) => db.role === 'target' || db.role === 'bidirectional');
    if (!sourceDb) {
        throw new Error('No source database configured');
    }
    try {
        // Extract data from source
        const sourceData = await (0, exports.extractDataFromDatabase)(sourceDb, config);
        // Sync to each target
        for (const targetDb of targetDbs) {
            const targetData = await (0, exports.extractDataFromDatabase)(targetDb, config);
            // Resolve conflicts if bidirectional
            let dataToSync = sourceData;
            if (targetDb.role === 'bidirectional') {
                const conflictResult = await (0, exports.resolveConflicts)(sourceData, targetData, config.conflictResolution);
                result.conflicts += conflictResult.totalConflicts;
                dataToSync = conflictResult.resolutions.map((r) => r.resolvedValue);
            }
            // Apply transformations if configured
            if (config.transformations) {
                for (const transformation of config.transformations) {
                    dataToSync = await (0, exports.applyTransformationToDataset)(dataToSync, transformation);
                }
            }
            // Load data to target
            await (0, exports.loadDataToDatabase)(targetDb, dataToSync, config);
            result.databases.push({
                name: targetDb.name,
                role: targetDb.role,
                recordsSynced: dataToSync.length,
            });
            result.totalRecordsSynced += dataToSync.length;
        }
        result.completedAt = new Date();
        return result;
    }
    catch (error) {
        result.errors.push(error.message);
        throw error;
    }
};
exports.synchronizeMultipleDatabases = synchronizeMultipleDatabases;
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
const captureDataChanges = async (sequelize, tableName, since) => {
    // This assumes tables have updated_at or similar timestamp columns
    const query = `
    SELECT *
    FROM ${tableName}
    WHERE updated_at > :since
    ORDER BY updated_at ASC
  `;
    const [results] = await sequelize.query(query, {
        replacements: { since },
    });
    return results;
};
exports.captureDataChanges = captureDataChanges;
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
const setupChangeDataCapture = async (sequelize, tableName, changeLogTable) => {
    const dialect = sequelize.getDialect();
    if (dialect === 'postgres') {
        // Create change log table
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ${changeLogTable} (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(255) NOT NULL,
        operation VARCHAR(10) NOT NULL,
        record_id VARCHAR(255),
        old_data JSONB,
        new_data JSONB,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Create trigger function
        await sequelize.query(`
      CREATE OR REPLACE FUNCTION track_${tableName}_changes()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO ${changeLogTable} (table_name, operation, record_id, old_data, new_data)
        VALUES (
          '${tableName}',
          TG_OP,
          COALESCE(NEW.id::text, OLD.id::text),
          CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
          CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
        // Create triggers
        await sequelize.query(`
      DROP TRIGGER IF EXISTS ${tableName}_change_trigger ON ${tableName};
      CREATE TRIGGER ${tableName}_change_trigger
      AFTER INSERT OR UPDATE OR DELETE ON ${tableName}
      FOR EACH ROW EXECUTE FUNCTION track_${tableName}_changes();
    `);
    }
    else {
        throw new Error(`CDC not implemented for dialect: ${dialect}`);
    }
};
exports.setupChangeDataCapture = setupChangeDataCapture;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
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
const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};
exports.chunkArray = chunkArray;
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
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
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
const generateCreateTableDdl = (step) => {
    // Simplified implementation - would need full schema definition
    return `CREATE TABLE ${step.tableName} (id UUID PRIMARY KEY);`;
};
exports.generateCreateTableDdl = generateCreateTableDdl;
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
const generateAddColumnDdl = (step) => {
    const { tableName, columnName, definition } = step;
    let ddl = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition.type}`;
    if (definition.allowNull === false) {
        ddl += ' NOT NULL';
    }
    if (definition.defaultValue !== undefined) {
        ddl += ` DEFAULT ${definition.defaultValue}`;
    }
    return ddl + ';';
};
exports.generateAddColumnDdl = generateAddColumnDdl;
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
const generateCreateIndexDdl = (step) => {
    const { indexName, tableName, columns, unique } = step;
    const uniqueKeyword = unique ? 'UNIQUE ' : '';
    return `CREATE ${uniqueKeyword}INDEX ${indexName} ON ${tableName} (${columns.join(', ')});`;
};
exports.generateCreateIndexDdl = generateCreateIndexDdl;
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
const estimateMigrationDuration = (steps, config) => {
    let estimatedMs = 0;
    for (const step of steps) {
        switch (step.operation) {
            case 'create-table':
                estimatedMs += 1000;
                break;
            case 'add-column':
                estimatedMs += 500;
                break;
            case 'create-index':
                estimatedMs += 2000;
                break;
            case 'migrate-data':
                // Estimate based on batch size
                estimatedMs += 10000; // Base estimate
                break;
            default:
                estimatedMs += 500;
        }
    }
    return estimatedMs;
};
exports.estimateMigrationDuration = estimateMigrationDuration;
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
const buildRecordKey = (record, keyFields) => {
    return keyFields.map(field => record[field]).join('|');
};
exports.buildRecordKey = buildRecordKey;
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
const getRollbackOperation = (operation) => {
    const rollbackMap = {
        'create-table': 'drop-table',
        'add-column': 'drop-column',
        'create-index': 'drop-index',
        'add-constraint': 'drop-constraint',
    };
    return rollbackMap[operation] || 'unknown';
};
exports.getRollbackOperation = getRollbackOperation;
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
const introspectDatabaseSchema = async (sequelize) => {
    const dialect = sequelize.getDialect();
    const schema = {
        tables: {},
        indexes: [],
        constraints: [],
    };
    if (dialect === 'postgres') {
        // Get tables
        const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `);
        for (const table of tables) {
            const tableName = table.table_name;
            // Get columns
            const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = :tableName
      `, {
                replacements: { tableName },
            });
            schema.tables[tableName] = {
                columns: {},
            };
            for (const column of columns) {
                schema.tables[tableName].columns[column.column_name] = {
                    type: column.data_type,
                    allowNull: column.is_nullable === 'YES',
                    defaultValue: column.column_default,
                };
            }
        }
    }
    return schema;
};
exports.introspectDatabaseSchema = introspectDatabaseSchema;
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
const extractDataFromDatabase = async (database, config) => {
    let query = 'SELECT * FROM sync_table';
    if (config.filterConditions) {
        const conditions = Object.entries(config.filterConditions)
            .map(([key, value]) => `${key} = '${value}'`)
            .join(' AND ');
        query += ` WHERE ${conditions}`;
    }
    const [results] = await database.connection.query(query);
    return results;
};
exports.extractDataFromDatabase = extractDataFromDatabase;
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
const loadDataToDatabase = async (database, data, config) => {
    const batchSize = config.batchSize || 1000;
    const batches = (0, exports.chunkArray)(data, batchSize);
    for (const batch of batches) {
        // Assuming a default table name - would need to be configurable
        await database.connection.query('INSERT INTO sync_table VALUES ?', { replacements: [batch] });
    }
};
exports.loadDataToDatabase = loadDataToDatabase;
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
const applyTransformationToDataset = async (data, transformation) => {
    const transformed = [];
    for (const record of data) {
        const transformedRecord = await (0, exports.applyTransformation)(record, transformation);
        transformed.push(transformedRecord);
    }
    return transformed;
};
exports.applyTransformationToDataset = applyTransformationToDataset;
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
const validateMigrationPrerequisites = async (migrationPlan, sequelize) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        statistics: {
            totalRecords: 0,
            validRecords: 0,
            invalidRecords: 0,
            warningRecords: 0,
        },
    };
    // Check database connection
    try {
        await sequelize.authenticate();
    }
    catch (error) {
        result.isValid = false;
        result.errors.push({
            rule: 'database-connection',
            field: 'connection',
            value: null,
            message: `Cannot connect to database: ${error.message}`,
            level: 'error',
        });
    }
    // Check if tables exist
    for (const step of migrationPlan.steps) {
        if (step.tableName && step.operation !== 'create-table') {
            try {
                await sequelize.query(`SELECT 1 FROM ${step.tableName} LIMIT 1`);
            }
            catch (error) {
                result.warnings.push({
                    rule: 'table-exists',
                    message: `Table ${step.tableName} may not exist: ${error.message}`,
                });
            }
        }
    }
    // Check for sufficient disk space
    // This would require system-level checks
    // Check for locks or active transactions
    // This would be database-specific
    return result;
};
exports.validateMigrationPrerequisites = validateMigrationPrerequisites;
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
const generateMigrationDocumentation = (migrationPlan, progress) => {
    const doc = [];
    doc.push(`# Migration: ${migrationPlan.migrationName}`);
    doc.push(`\n**Version:** ${migrationPlan.version}`);
    doc.push(`**Strategy:** ${migrationPlan.strategy}`);
    doc.push(`**Status:** ${progress.status}`);
    doc.push(`\n## Overview`);
    doc.push(`\n${migrationPlan.description || 'No description provided'}`);
    doc.push(`\n## Execution Summary`);
    doc.push(`\n- **Total Steps:** ${progress.totalSteps}`);
    doc.push(`- **Completed Steps:** ${progress.completedSteps}`);
    doc.push(`- **Progress:** ${progress.progress.toFixed(2)}%`);
    doc.push(`- **Started At:** ${progress.startedAt?.toISOString()}`);
    if (progress.completedAt) {
        doc.push(`- **Completed At:** ${progress.completedAt.toISOString()}`);
        const duration = progress.completedAt.getTime() - (progress.startedAt?.getTime() || 0);
        doc.push(`- **Duration:** ${duration}ms`);
    }
    if (progress.errors.length > 0) {
        doc.push(`\n## Errors`);
        for (const error of progress.errors) {
            doc.push(`\n- **${error.step}:** ${error.error}`);
        }
    }
    doc.push(`\n## Migration Steps`);
    for (const step of migrationPlan.steps) {
        doc.push(`\n### ${step.order + 1}. ${step.operation}`);
        doc.push(`- **Phase:** ${step.phase}`);
        if (step.tableName)
            doc.push(`- **Table:** ${step.tableName}`);
        if (step.columnName)
            doc.push(`- **Column:** ${step.columnName}`);
        if (step.description)
            doc.push(`- **Description:** ${step.description}`);
        doc.push(`- **Rollbackable:** ${step.rollbackable ? 'Yes' : 'No'}`);
    }
    if (progress.checkpoints.length > 0) {
        doc.push(`\n## Checkpoints`);
        for (const checkpoint of progress.checkpoints) {
            doc.push(`\n- **${checkpoint.step}** at ${checkpoint.timestamp.toISOString()}`);
        }
    }
    return doc.join('\n');
};
exports.generateMigrationDocumentation = generateMigrationDocumentation;
// ============================================================================
// NESTJS SERVICE EXPORTS
// ============================================================================
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
exports.MigrationServiceProvider = {
    provide: 'MIGRATION_SERVICE',
    useFactory: (sequelize, migrationHistoryModel) => ({
        planMigration: exports.planMigration,
        executeMigration: (plan, progressCallback) => (0, exports.executeMigration)(plan, sequelize, migrationHistoryModel, progressCallback),
        rollbackMigration: (migrationId, config) => (0, exports.rollbackMigration)(migrationId, migrationHistoryModel, sequelize, config),
        analyzeMigrationImpact: (plan) => (0, exports.analyzeMigrationImpact)(plan, sequelize),
        validateMigrationPrerequisites: (plan) => (0, exports.validateMigrationPrerequisites)(plan, sequelize),
    }),
    inject: ['SEQUELIZE_INSTANCE', 'MIGRATION_HISTORY_MODEL'],
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
exports.ETLServiceProvider = {
    provide: 'ETL_SERVICE',
    useFactory: (etlExecutionModel) => ({
        executeETLPipeline: (config, progressCallback) => (0, exports.executeETLPipeline)(config, etlExecutionModel, progressCallback),
        extractData: exports.extractData,
        loadData: exports.loadData,
        applyTransformation: exports.applyTransformation,
    }),
    inject: ['ETL_EXECUTION_MODEL'],
};
//# sourceMappingURL=data-migration-kit.prod.js.map