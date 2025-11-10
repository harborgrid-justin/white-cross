/**
 * LOC: DBSD8901234
 * File: /reuse/database-schema-design-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize (database ORM)
 *   - @nestjs/common (logging, exceptions)
 *   - Database design patterns
 *
 * DOWNSTREAM (imported by):
 *   - Database migration files
 *   - Model definition modules
 *   - Schema versioning services
 *   - Multi-tenancy implementations
 */
/**
 * File: /reuse/database-schema-design-kit.ts
 * Locator: WC-UTL-DBSD-007
 * Purpose: Database Schema Design Kit - Comprehensive schema design patterns and utilities
 *
 * Upstream: Sequelize ORM, database design patterns, normalization theory
 * Downstream: ../backend/*, ../migrations/*, model definitions, schema versioning
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 utility functions for schema design, normalization, temporal tables, soft deletes,
 *          audit trails, multi-tenancy, sharding, partitioning, JSONB, full-text search,
 *          materialized views, triggers, stored procedures, and data integrity
 *
 * LLM Context: Comprehensive database schema design utilities for White Cross healthcare system.
 * Provides normalization helpers, denormalization strategies, temporal data patterns, soft delete
 * implementations, audit trail builders, multi-tenancy patterns, sharding strategies, partitioning
 * helpers, JSONB utilities, full-text search setup, materialized views, database triggers,
 * stored procedure helpers, and data integrity checks. Essential for building scalable, maintainable,
 * and HIPAA-compliant database schemas for healthcare applications with complex data requirements.
 */
import { Sequelize, DataTypes, ModelAttributes } from 'sequelize';
interface NormalizationResult {
    normalForm: '1NF' | '2NF' | '3NF' | 'BCNF';
    issues: Array<{
        type: string;
        description: string;
        suggestion: string;
    }>;
    isNormalized: boolean;
}
interface SoftDeleteConfig {
    fieldName: string;
    type: 'timestamp' | 'boolean';
    defaultValue?: any;
}
interface AuditFieldsConfig {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    deletedAt?: string;
    deletedBy?: string;
}
interface AuditTrailConfig {
    tableName: string;
    fields: string[];
    captureOldValues: boolean;
    captureNewValues: boolean;
    includeUser: boolean;
    includeTimestamp: boolean;
}
interface TemporalTableConfig {
    tableName: string;
    historyTableSuffix: string;
    validFrom: string;
    validTo: string;
    systemVersioned: boolean;
}
interface MultiTenancyConfig {
    strategy: 'shared-schema' | 'shared-database' | 'isolated-database';
    tenantIdColumn: string;
    tenantIdType: typeof DataTypes.UUID | typeof DataTypes.INTEGER;
    enforceRowLevelSecurity: boolean;
}
interface ShardingConfig {
    shardKey: string;
    numberOfShards: number;
    strategy: 'hash' | 'range' | 'geo' | 'composite';
    shardMap: Map<string, Sequelize>;
}
interface PartitionConfig {
    type: 'range' | 'list' | 'hash';
    column: string;
    partitions: Array<{
        name: string;
        condition?: string;
        values?: any[];
        modulus?: number;
        remainder?: number;
    }>;
}
interface MaterializedViewConfig {
    viewName: string;
    query: string;
    refreshStrategy: 'manual' | 'scheduled' | 'on-commit';
    refreshInterval?: number;
    indexes?: string[];
}
interface FullTextSearchConfig {
    tableName: string;
    columns: string[];
    language: string;
    indexName: string;
    vectorColumn: string;
}
interface TriggerConfig {
    name: string;
    table: string;
    timing: 'BEFORE' | 'AFTER';
    event: 'INSERT' | 'UPDATE' | 'DELETE';
    forEach: 'ROW' | 'STATEMENT';
    condition?: string;
    function: string;
}
interface StoredProcedureConfig {
    name: string;
    parameters: Array<{
        name: string;
        type: string;
        mode: 'IN' | 'OUT' | 'INOUT';
    }>;
    returnType?: string;
    language: 'plpgsql' | 'sql';
    body: string;
}
interface DataIntegrityCheck {
    checkName: string;
    query: string;
    expectedCount: number;
    severity: 'critical' | 'warning' | 'info';
}
interface SchemaVersion {
    version: string;
    description: string;
    appliedAt: Date;
    checksum: string;
    executionTime: number;
}
/**
 * 1. Validates table structure against 1NF (First Normal Form).
 * Checks for atomic values and no repeating groups.
 *
 * @param {ModelAttributes} attributes - Model attribute definitions
 * @returns {NormalizationResult} Validation result with issues
 *
 * @example
 * ```typescript
 * const result = validate1NF({
 *   name: { type: DataTypes.STRING },
 *   phoneNumbers: { type: DataTypes.JSON } // Violation: repeating group
 * });
 * ```
 */
export declare const validate1NF: (attributes: ModelAttributes) => NormalizationResult;
/**
 * 2. Validates table structure against 2NF (Second Normal Form).
 * Checks for partial dependencies on composite keys.
 *
 * @param {ModelAttributes} attributes - Model attribute definitions
 * @param {string[]} primaryKeys - Array of primary key field names
 * @returns {NormalizationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validate2NF(attributes, ['studentId', 'courseId']);
 * ```
 */
export declare const validate2NF: (attributes: ModelAttributes, primaryKeys: string[]) => NormalizationResult;
/**
 * 3. Validates table structure against 3NF (Third Normal Form).
 * Checks for transitive dependencies.
 *
 * @param {ModelAttributes} attributes - Model attribute definitions
 * @param {string[]} primaryKeys - Array of primary key field names
 * @returns {NormalizationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validate3NF(attributes, ['patientId']);
 * ```
 */
export declare const validate3NF: (attributes: ModelAttributes, primaryKeys: string[]) => NormalizationResult;
/**
 * 4. Analyzes schema and suggests denormalization opportunities for performance.
 *
 * @param {ModelAttributes} attributes - Model attribute definitions
 * @param {Array<{ model: string; type: string }>} relationships - Model relationships
 * @returns {Array<{ field: string; reason: string; impact: string }>} Denormalization suggestions
 *
 * @example
 * ```typescript
 * const suggestions = suggestDenormalization(orderAttributes, [
 *   { model: 'Customer', type: 'belongsTo' },
 *   { model: 'OrderItems', type: 'hasMany' }
 * ]);
 * ```
 */
export declare const suggestDenormalization: (attributes: ModelAttributes, relationships: Array<{
    model: string;
    type: string;
    accessFrequency?: number;
}>) => Array<{
    field: string;
    reason: string;
    impact: string;
}>;
/**
 * 5. Creates computed/derived column definitions for denormalized data.
 *
 * @param {string} columnName - Name of the computed column
 * @param {string} computation - SQL expression for computing the value
 * @returns {string} SQL for creating computed column
 *
 * @example
 * ```typescript
 * const sql = createComputedColumn('fullName', "CONCAT(firstName, ' ', lastName)");
 * ```
 */
export declare const createComputedColumn: (columnName: string, computation: string) => string;
/**
 * 6. Generates soft delete field definition for models.
 *
 * @param {SoftDeleteConfig} config - Soft delete configuration
 * @returns {object} Sequelize field definition
 *
 * @example
 * ```typescript
 * const softDeleteField = createSoftDeleteField({
 *   fieldName: 'deletedAt',
 *   type: 'timestamp'
 * });
 * ```
 */
export declare const createSoftDeleteField: (config: SoftDeleteConfig) => any;
/**
 * 7. Creates default scope for soft delete filtering.
 *
 * @param {string} deletedAtField - Name of the soft delete field
 * @returns {object} Sequelize default scope
 *
 * @example
 * ```typescript
 * const scope = createSoftDeleteScope('deletedAt');
 * // In model: defaultScope: createSoftDeleteScope('deletedAt')
 * ```
 */
export declare const createSoftDeleteScope: (deletedAtField: string) => any;
/**
 * 8. Generates soft delete query with user tracking.
 *
 * @param {string} tableName - Table name
 * @param {string} deletedAtField - Deleted at field name
 * @param {string} deletedByField - Deleted by field name
 * @param {string} userId - User performing the delete
 * @returns {string} SQL query for soft delete
 *
 * @example
 * ```typescript
 * const sql = generateSoftDeleteQuery('patients', 'deletedAt', 'deletedBy', 'user-123');
 * ```
 */
export declare const generateSoftDeleteQuery: (tableName: string, deletedAtField: string, deletedByField: string, userId: string) => string;
/**
 * 9. Creates cascade soft delete trigger for related records.
 *
 * @param {string} parentTable - Parent table name
 * @param {string} childTable - Child table name
 * @param {string} foreignKey - Foreign key column
 * @returns {string} SQL for creating cascade soft delete trigger
 *
 * @example
 * ```typescript
 * const trigger = createCascadeSoftDelete('orders', 'order_items', 'orderId');
 * ```
 */
export declare const createCascadeSoftDelete: (parentTable: string, childTable: string, foreignKey: string) => string;
/**
 * 10. Generates standard audit fields for a model.
 *
 * @param {Partial<AuditFieldsConfig>} config - Audit fields configuration
 * @returns {object} Sequelize field definitions
 *
 * @example
 * ```typescript
 * const auditFields = createAuditFields({
 *   createdBy: 'createdById',
 *   updatedBy: 'updatedById'
 * });
 * ```
 */
export declare const createAuditFields: (config?: Partial<AuditFieldsConfig>) => any;
/**
 * 11. Creates audit trail table for tracking all changes.
 *
 * @param {AuditTrailConfig} config - Audit trail configuration
 * @returns {string} SQL for creating audit trail table
 *
 * @example
 * ```typescript
 * const sql = createAuditTrailTable({
 *   tableName: 'patients',
 *   fields: ['name', 'email', 'dateOfBirth'],
 *   captureOldValues: true,
 *   captureNewValues: true,
 *   includeUser: true,
 *   includeTimestamp: true
 * });
 * ```
 */
export declare const createAuditTrailTable: (config: AuditTrailConfig) => string;
/**
 * 12. Generates trigger function for automatic audit logging.
 *
 * @param {string} tableName - Table name to audit
 * @param {string[]} trackedFields - Fields to track changes for
 * @returns {string} SQL for audit trigger
 *
 * @example
 * ```typescript
 * const trigger = createAuditTrigger('patients', ['name', 'email', 'phone']);
 * ```
 */
export declare const createAuditTrigger: (tableName: string, trackedFields: string[]) => string;
/**
 * 13. Retrieves audit history for a specific record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @returns {Promise<any[]>} Audit history
 *
 * @example
 * ```typescript
 * const history = await getAuditHistory(sequelize, 'patients', 'patient-id-123');
 * ```
 */
export declare const getAuditHistory: (sequelize: Sequelize, tableName: string, recordId: string) => Promise<any[]>;
/**
 * 14. Creates system-versioned temporal table for history tracking.
 *
 * @param {TemporalTableConfig} config - Temporal table configuration
 * @returns {string} SQL for creating temporal table
 *
 * @example
 * ```typescript
 * const sql = createTemporalTable({
 *   tableName: 'patients',
 *   historyTableSuffix: '_history',
 *   validFrom: 'validFrom',
 *   validTo: 'validTo',
 *   systemVersioned: true
 * });
 * ```
 */
export declare const createTemporalTable: (config: TemporalTableConfig) => string;
/**
 * 15. Queries temporal table for point-in-time data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {Date} asOfDate - Point in time
 * @returns {Promise<any[]>} Records as of the specified date
 *
 * @example
 * ```typescript
 * const historicalData = await queryAsOf(sequelize, 'patients', new Date('2023-01-01'));
 * ```
 */
export declare const queryAsOf: (sequelize: Sequelize, tableName: string, asOfDate: Date, validFromField?: string, validToField?: string) => Promise<any[]>;
/**
 * 16. Retrieves all versions of a record across time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} recordId - Record ID
 * @returns {Promise<any[]>} All versions of the record
 *
 * @example
 * ```typescript
 * const versions = await getRecordVersions(sequelize, 'patients', 'patient-123');
 * ```
 */
export declare const getRecordVersions: (sequelize: Sequelize, tableName: string, recordId: string) => Promise<any[]>;
/**
 * 17. Adds tenant isolation column to table definition.
 *
 * @param {MultiTenancyConfig} config - Multi-tenancy configuration
 * @returns {object} Sequelize field definition
 *
 * @example
 * ```typescript
 * const tenantField = createTenantColumn({
 *   strategy: 'shared-schema',
 *   tenantIdColumn: 'tenantId',
 *   tenantIdType: DataTypes.UUID,
 *   enforceRowLevelSecurity: true
 * });
 * ```
 */
export declare const createTenantColumn: (config: MultiTenancyConfig) => any;
/**
 * 18. Creates row-level security policy for tenant isolation.
 *
 * @param {string} tableName - Table name
 * @param {string} tenantIdColumn - Tenant ID column name
 * @returns {string} SQL for RLS policy
 *
 * @example
 * ```typescript
 * const policy = createTenantRLSPolicy('patients', 'tenantId');
 * ```
 */
export declare const createTenantRLSPolicy: (tableName: string, tenantIdColumn: string) => string;
/**
 * 19. Sets tenant context for current session.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setTenantContext(sequelize, 'tenant-abc-123');
 * // All subsequent queries will be scoped to this tenant
 * ```
 */
export declare const setTenantContext: (sequelize: Sequelize, tenantId: string) => Promise<void>;
/**
 * 20. Creates composite index including tenant ID for query performance.
 *
 * @param {string} tableName - Table name
 * @param {string} tenantIdColumn - Tenant ID column
 * @param {string[]} otherColumns - Other columns in the index
 * @returns {string} SQL for creating composite index
 *
 * @example
 * ```typescript
 * const index = createTenantIndex('orders', 'tenantId', ['customerId', 'createdAt']);
 * ```
 */
export declare const createTenantIndex: (tableName: string, tenantIdColumn: string, otherColumns: string[]) => string;
/**
 * 21. Calculates shard for a given key using hash-based sharding.
 *
 * @param {string} shardKey - Value to shard on
 * @param {number} numberOfShards - Total number of shards
 * @returns {number} Shard number (0-based)
 *
 * @example
 * ```typescript
 * const shard = calculateHashShard('user-123', 8);
 * // Returns: 3 (example)
 * ```
 */
export declare const calculateHashShard: (shardKey: string, numberOfShards: number) => number;
/**
 * 22. Determines shard based on range partitioning.
 *
 * @param {number} value - Value to shard on
 * @param {Array<{ max: number; shard: number }>} ranges - Range definitions
 * @returns {number} Shard number
 *
 * @example
 * ```typescript
 * const shard = calculateRangeShard(150, [
 *   { max: 100, shard: 0 },
 *   { max: 200, shard: 1 },
 *   { max: Infinity, shard: 2 }
 * ]);
 * ```
 */
export declare const calculateRangeShard: (value: number, ranges: Array<{
    max: number;
    shard: number;
}>) => number;
/**
 * 23. Routes query to appropriate shard based on shard key.
 *
 * @param {ShardingConfig} config - Sharding configuration
 * @param {string} shardKeyValue - Value of the shard key
 * @returns {Sequelize} Sequelize instance for the appropriate shard
 *
 * @example
 * ```typescript
 * const db = getShardConnection(shardConfig, 'user-456');
 * const user = await db.models.User.findOne({ where: { id: 'user-456' } });
 * ```
 */
export declare const getShardConnection: (config: ShardingConfig, shardKeyValue: string) => Sequelize;
/**
 * 24. Creates lookup table for shard routing.
 *
 * @param {string} tableName - Name of the shard lookup table
 * @returns {string} SQL for creating shard lookup table
 *
 * @example
 * ```typescript
 * const sql = createShardLookupTable('user_shards');
 * ```
 */
export declare const createShardLookupTable: (tableName: string) => string;
/**
 * 25. Creates range-partitioned table.
 *
 * @param {string} tableName - Table name
 * @param {PartitionConfig} config - Partition configuration
 * @returns {string} SQL for creating partitioned table
 *
 * @example
 * ```typescript
 * const sql = createPartitionedTable('measurements', {
 *   type: 'range',
 *   column: 'measured_at',
 *   partitions: [
 *     { name: 'measurements_2023', condition: "measured_at >= '2023-01-01' AND measured_at < '2024-01-01'" },
 *     { name: 'measurements_2024', condition: "measured_at >= '2024-01-01' AND measured_at < '2025-01-01'" }
 *   ]
 * });
 * ```
 */
export declare const createPartitionedTable: (tableName: string, config: PartitionConfig) => string;
/**
 * 26. Generates SQL to add new partition to existing partitioned table.
 *
 * @param {string} tableName - Parent table name
 * @param {string} partitionName - New partition name
 * @param {string} condition - Partition condition
 * @returns {string} SQL for adding partition
 *
 * @example
 * ```typescript
 * const sql = addPartition('measurements', 'measurements_2025',
 *   "FOR VALUES FROM ('2025-01-01') TO ('2026-01-01')");
 * ```
 */
export declare const addPartition: (tableName: string, partitionName: string, condition: string) => string;
/**
 * 27. Detaches partition for archival or maintenance.
 *
 * @param {string} tableName - Parent table name
 * @param {string} partitionName - Partition to detach
 * @returns {string} SQL for detaching partition
 *
 * @example
 * ```typescript
 * const sql = detachPartition('measurements', 'measurements_2020');
 * ```
 */
export declare const detachPartition: (tableName: string, partitionName: string) => string;
/**
 * 28. Creates GIN index on JSONB column for fast queries.
 *
 * @param {string} tableName - Table name
 * @param {string} jsonbColumn - JSONB column name
 * @param {string} indexName - Index name
 * @returns {string} SQL for creating GIN index
 *
 * @example
 * ```typescript
 * const sql = createJSONBIndex('patients', 'metadata', 'idx_patients_metadata_gin');
 * ```
 */
export declare const createJSONBIndex: (tableName: string, jsonbColumn: string, indexName: string) => string;
/**
 * 29. Generates query to search JSONB data.
 *
 * @param {string} tableName - Table name
 * @param {string} jsonbColumn - JSONB column name
 * @param {string} path - JSON path
 * @param {any} value - Value to search for
 * @returns {string} SQL query
 *
 * @example
 * ```typescript
 * const sql = queryJSONB('patients', 'metadata', 'address.city', 'Boston');
 * // Generates: SELECT * FROM patients WHERE metadata->'address'->>'city' = 'Boston'
 * ```
 */
export declare const queryJSONB: (tableName: string, jsonbColumn: string, path: string, value: any) => string;
/**
 * 30. Validates JSONB data against schema.
 *
 * @param {any} data - JSONB data to validate
 * @param {object} schema - JSON schema
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateJSONBSchema(
 *   { name: 'John', age: 30 },
 *   { type: 'object', required: ['name', 'age'] }
 * );
 * ```
 */
export declare const validateJSONBSchema: (data: any, schema: {
    type: string;
    required?: string[];
    properties?: any;
}) => {
    valid: boolean;
    errors: string[];
};
/**
 * 31. Creates full-text search index with tsvector.
 *
 * @param {FullTextSearchConfig} config - Full-text search configuration
 * @returns {string} SQL for creating FTS index
 *
 * @example
 * ```typescript
 * const sql = createFullTextSearchIndex({
 *   tableName: 'articles',
 *   columns: ['title', 'body'],
 *   language: 'english',
 *   indexName: 'idx_articles_fts',
 *   vectorColumn: 'search_vector'
 * });
 * ```
 */
export declare const createFullTextSearchIndex: (config: FullTextSearchConfig) => string;
/**
 * 32. Generates full-text search query with ranking.
 *
 * @param {string} tableName - Table name
 * @param {string} vectorColumn - TSVector column name
 * @param {string} searchQuery - Search query
 * @returns {string} SQL query with ranking
 *
 * @example
 * ```typescript
 * const sql = searchFullText('articles', 'search_vector', 'diabetes treatment');
 * ```
 */
export declare const searchFullText: (tableName: string, vectorColumn: string, searchQuery: string) => string;
/**
 * 33. Creates materialized view for performance optimization.
 *
 * @param {MaterializedViewConfig} config - Materialized view configuration
 * @returns {string} SQL for creating materialized view
 *
 * @example
 * ```typescript
 * const sql = createMaterializedView({
 *   viewName: 'patient_summary',
 *   query: 'SELECT patient_id, COUNT(*) as visit_count FROM visits GROUP BY patient_id',
 *   refreshStrategy: 'scheduled',
 *   indexes: ['patient_id']
 * });
 * ```
 */
export declare const createMaterializedView: (config: MaterializedViewConfig) => string;
/**
 * 34. Refreshes materialized view data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} viewName - Materialized view name
 * @param {boolean} concurrently - Refresh concurrently (allows queries during refresh)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await refreshMaterializedView(sequelize, 'patient_summary', true);
 * ```
 */
export declare const refreshMaterializedView: (sequelize: Sequelize, viewName: string, concurrently?: boolean) => Promise<void>;
/**
 * 35. Creates automatic refresh job for materialized view.
 *
 * @param {string} viewName - Materialized view name
 * @param {string} schedule - Cron schedule
 * @returns {string} SQL for creating refresh job
 *
 * @example
 * ```typescript
 * const sql = createMaterializedViewRefreshJob('patient_summary', '0 2 * * *');
 * ```
 */
export declare const createMaterializedViewRefreshJob: (viewName: string, schedule: string) => string;
/**
 * 36. Creates database trigger with configuration.
 *
 * @param {TriggerConfig} config - Trigger configuration
 * @returns {string} SQL for creating trigger
 *
 * @example
 * ```typescript
 * const sql = createDatabaseTrigger({
 *   name: 'update_modified_timestamp',
 *   table: 'patients',
 *   timing: 'BEFORE',
 *   event: 'UPDATE',
 *   forEach: 'ROW',
 *   function: 'update_modified_column'
 * });
 * ```
 */
export declare const createDatabaseTrigger: (config: TriggerConfig) => string;
/**
 * 37. Creates updated_at timestamp trigger function.
 *
 * @returns {string} SQL for timestamp trigger function
 *
 * @example
 * ```typescript
 * const sql = createTimestampTriggerFunction();
 * ```
 */
export declare const createTimestampTriggerFunction: () => string;
/**
 * 38. Creates stored procedure for complex operations.
 *
 * @param {StoredProcedureConfig} config - Stored procedure configuration
 * @returns {string} SQL for creating stored procedure
 *
 * @example
 * ```typescript
 * const sql = createStoredProcedure({
 *   name: 'calculate_patient_risk',
 *   parameters: [
 *     { name: 'patient_id', type: 'UUID', mode: 'IN' },
 *     { name: 'risk_score', type: 'NUMERIC', mode: 'OUT' }
 *   ],
 *   language: 'plpgsql',
 *   body: 'BEGIN SELECT calculate_risk(patient_id) INTO risk_score; END;'
 * });
 * ```
 */
export declare const createStoredProcedure: (config: StoredProcedureConfig) => string;
/**
 * 39. Calls stored procedure with parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} procedureName - Procedure name
 * @param {any[]} parameters - Procedure parameters
 * @returns {Promise<any>} Procedure result
 *
 * @example
 * ```typescript
 * const result = await callStoredProcedure(sequelize, 'calculate_patient_risk',
 *   ['patient-123']);
 * ```
 */
export declare const callStoredProcedure: (sequelize: Sequelize, procedureName: string, parameters: any[]) => Promise<any>;
/**
 * 40. Creates check constraint for data validation.
 *
 * @param {string} tableName - Table name
 * @param {string} constraintName - Constraint name
 * @param {string} condition - Check condition
 * @returns {string} SQL for creating check constraint
 *
 * @example
 * ```typescript
 * const sql = createCheckConstraint('patients', 'age_range',
 *   'age >= 0 AND age <= 150');
 * ```
 */
export declare const createCheckConstraint: (tableName: string, constraintName: string, condition: string) => string;
/**
 * 41. Runs data integrity checks and returns violations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DataIntegrityCheck[]} checks - Array of integrity checks
 * @returns {Promise<Array<{ check: string; violations: number; severity: string }>>}
 *
 * @example
 * ```typescript
 * const violations = await runDataIntegrityChecks(sequelize, [
 *   {
 *     checkName: 'orphaned_records',
 *     query: 'SELECT COUNT(*) FROM orders WHERE customer_id NOT IN (SELECT id FROM customers)',
 *     expectedCount: 0,
 *     severity: 'critical'
 *   }
 * ]);
 * ```
 */
export declare const runDataIntegrityChecks: (sequelize: Sequelize, checks: DataIntegrityCheck[]) => Promise<Array<{
    check: string;
    violations: number;
    severity: string;
}>>;
/**
 * 42. Creates foreign key constraint with cascade options.
 *
 * @param {string} tableName - Table name
 * @param {string} columnName - Foreign key column
 * @param {string} referencedTable - Referenced table
 * @param {string} referencedColumn - Referenced column
 * @param {object} options - Cascade options
 * @returns {string} SQL for creating foreign key
 *
 * @example
 * ```typescript
 * const sql = createForeignKey('orders', 'customerId', 'customers', 'id',
 *   { onDelete: 'CASCADE', onUpdate: 'RESTRICT' });
 * ```
 */
export declare const createForeignKey: (tableName: string, columnName: string, referencedTable: string, referencedColumn: string, options?: {
    onDelete?: string;
    onUpdate?: string;
}) => string;
/**
 * 43. Creates schema version tracking table.
 *
 * @returns {string} SQL for creating schema versions table
 *
 * @example
 * ```typescript
 * const sql = createSchemaVersionTable();
 * ```
 */
export declare const createSchemaVersionTable: () => string;
/**
 * 44. Records schema migration execution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SchemaVersion} version - Version information
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordSchemaMigration(sequelize, {
 *   version: '2024-01-15-add-patient-table',
 *   description: 'Add patients table with audit fields',
 *   appliedAt: new Date(),
 *   checksum: 'abc123',
 *   executionTime: 450
 * });
 * ```
 */
export declare const recordSchemaMigration: (sequelize: Sequelize, version: SchemaVersion) => Promise<void>;
/**
 * 45. Gets current schema version and migration history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SchemaVersion[]>} Migration history
 *
 * @example
 * ```typescript
 * const history = await getSchemaVersionHistory(sequelize);
 * console.log(`Current version: ${history[0].version}`);
 * ```
 */
export declare const getSchemaVersionHistory: (sequelize: Sequelize) => Promise<SchemaVersion[]>;
declare const _default: {
    validate1NF: (attributes: ModelAttributes) => NormalizationResult;
    validate2NF: (attributes: ModelAttributes, primaryKeys: string[]) => NormalizationResult;
    validate3NF: (attributes: ModelAttributes, primaryKeys: string[]) => NormalizationResult;
    suggestDenormalization: (attributes: ModelAttributes, relationships: Array<{
        model: string;
        type: string;
        accessFrequency?: number;
    }>) => Array<{
        field: string;
        reason: string;
        impact: string;
    }>;
    createComputedColumn: (columnName: string, computation: string) => string;
    createSoftDeleteField: (config: SoftDeleteConfig) => any;
    createSoftDeleteScope: (deletedAtField: string) => any;
    generateSoftDeleteQuery: (tableName: string, deletedAtField: string, deletedByField: string, userId: string) => string;
    createCascadeSoftDelete: (parentTable: string, childTable: string, foreignKey: string) => string;
    createAuditFields: (config?: Partial<AuditFieldsConfig>) => any;
    createAuditTrailTable: (config: AuditTrailConfig) => string;
    createAuditTrigger: (tableName: string, trackedFields: string[]) => string;
    getAuditHistory: (sequelize: Sequelize, tableName: string, recordId: string) => Promise<any[]>;
    createTemporalTable: (config: TemporalTableConfig) => string;
    queryAsOf: (sequelize: Sequelize, tableName: string, asOfDate: Date, validFromField?: string, validToField?: string) => Promise<any[]>;
    getRecordVersions: (sequelize: Sequelize, tableName: string, recordId: string) => Promise<any[]>;
    createTenantColumn: (config: MultiTenancyConfig) => any;
    createTenantRLSPolicy: (tableName: string, tenantIdColumn: string) => string;
    setTenantContext: (sequelize: Sequelize, tenantId: string) => Promise<void>;
    createTenantIndex: (tableName: string, tenantIdColumn: string, otherColumns: string[]) => string;
    calculateHashShard: (shardKey: string, numberOfShards: number) => number;
    calculateRangeShard: (value: number, ranges: Array<{
        max: number;
        shard: number;
    }>) => number;
    getShardConnection: (config: ShardingConfig, shardKeyValue: string) => Sequelize;
    createShardLookupTable: (tableName: string) => string;
    createPartitionedTable: (tableName: string, config: PartitionConfig) => string;
    addPartition: (tableName: string, partitionName: string, condition: string) => string;
    detachPartition: (tableName: string, partitionName: string) => string;
    createJSONBIndex: (tableName: string, jsonbColumn: string, indexName: string) => string;
    queryJSONB: (tableName: string, jsonbColumn: string, path: string, value: any) => string;
    validateJSONBSchema: (data: any, schema: {
        type: string;
        required?: string[];
        properties?: any;
    }) => {
        valid: boolean;
        errors: string[];
    };
    createFullTextSearchIndex: (config: FullTextSearchConfig) => string;
    searchFullText: (tableName: string, vectorColumn: string, searchQuery: string) => string;
    createMaterializedView: (config: MaterializedViewConfig) => string;
    refreshMaterializedView: (sequelize: Sequelize, viewName: string, concurrently?: boolean) => Promise<void>;
    createMaterializedViewRefreshJob: (viewName: string, schedule: string) => string;
    createDatabaseTrigger: (config: TriggerConfig) => string;
    createTimestampTriggerFunction: () => string;
    createStoredProcedure: (config: StoredProcedureConfig) => string;
    callStoredProcedure: (sequelize: Sequelize, procedureName: string, parameters: any[]) => Promise<any>;
    createCheckConstraint: (tableName: string, constraintName: string, condition: string) => string;
    runDataIntegrityChecks: (sequelize: Sequelize, checks: DataIntegrityCheck[]) => Promise<Array<{
        check: string;
        violations: number;
        severity: string;
    }>>;
    createForeignKey: (tableName: string, columnName: string, referencedTable: string, referencedColumn: string, options?: {
        onDelete?: string;
        onUpdate?: string;
    }) => string;
    createSchemaVersionTable: () => string;
    recordSchemaMigration: (sequelize: Sequelize, version: SchemaVersion) => Promise<void>;
    getSchemaVersionHistory: (sequelize: Sequelize) => Promise<SchemaVersion[]>;
};
export default _default;
//# sourceMappingURL=database-schema-design-kit.d.ts.map