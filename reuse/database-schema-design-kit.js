"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaVersionHistory = exports.recordSchemaMigration = exports.createSchemaVersionTable = exports.createForeignKey = exports.runDataIntegrityChecks = exports.createCheckConstraint = exports.callStoredProcedure = exports.createStoredProcedure = exports.createTimestampTriggerFunction = exports.createDatabaseTrigger = exports.createMaterializedViewRefreshJob = exports.refreshMaterializedView = exports.createMaterializedView = exports.searchFullText = exports.createFullTextSearchIndex = exports.validateJSONBSchema = exports.queryJSONB = exports.createJSONBIndex = exports.detachPartition = exports.addPartition = exports.createPartitionedTable = exports.createShardLookupTable = exports.getShardConnection = exports.calculateRangeShard = exports.calculateHashShard = exports.createTenantIndex = exports.setTenantContext = exports.createTenantRLSPolicy = exports.createTenantColumn = exports.getRecordVersions = exports.queryAsOf = exports.createTemporalTable = exports.getAuditHistory = exports.createAuditTrigger = exports.createAuditTrailTable = exports.createAuditFields = exports.createCascadeSoftDelete = exports.generateSoftDeleteQuery = exports.createSoftDeleteScope = exports.createSoftDeleteField = exports.createComputedColumn = exports.suggestDenormalization = exports.validate3NF = exports.validate2NF = exports.validate1NF = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// 1. NORMALIZATION HELPERS
// ============================================================================
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
const validate1NF = (attributes) => {
    const issues = [];
    Object.entries(attributes).forEach(([fieldName, field]) => {
        const fieldDef = field;
        // Check for non-atomic types (arrays, JSON)
        if (fieldDef.type === sequelize_1.DataTypes.ARRAY ||
            fieldDef.type === sequelize_1.DataTypes.JSON ||
            fieldDef.type === sequelize_1.DataTypes.JSONB) {
            issues.push({
                type: 'NON_ATOMIC_VALUE',
                description: `Field '${fieldName}' contains non-atomic values (${fieldDef.type.key})`,
                suggestion: `Consider creating a separate table for '${fieldName}' with a one-to-many relationship`,
            });
        }
        // Check for comma-separated values in text fields
        if ((fieldDef.type === sequelize_1.DataTypes.STRING || fieldDef.type === sequelize_1.DataTypes.TEXT) &&
            fieldName.toLowerCase().includes('list')) {
            issues.push({
                type: 'POTENTIAL_CSV_FIELD',
                description: `Field '${fieldName}' might contain comma-separated values`,
                suggestion: `Create a junction table if storing multiple related values`,
            });
        }
    });
    return {
        normalForm: '1NF',
        issues,
        isNormalized: issues.length === 0,
    };
};
exports.validate1NF = validate1NF;
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
const validate2NF = (attributes, primaryKeys) => {
    const issues = [];
    // 2NF only applies to tables with composite keys
    if (primaryKeys.length <= 1) {
        return {
            normalForm: '2NF',
            issues: [],
            isNormalized: true,
        };
    }
    // Check for non-key attributes that might depend on only part of the key
    Object.keys(attributes).forEach((fieldName) => {
        if (!primaryKeys.includes(fieldName)) {
            // Heuristic: fields named after a single primary key component might violate 2NF
            primaryKeys.forEach((pkField) => {
                if (fieldName.toLowerCase().includes(pkField.toLowerCase())) {
                    issues.push({
                        type: 'PARTIAL_DEPENDENCY',
                        description: `Field '${fieldName}' may depend only on '${pkField}' (part of composite key)`,
                        suggestion: `Consider moving '${fieldName}' to a separate table related to '${pkField}'`,
                    });
                }
            });
        }
    });
    return {
        normalForm: '2NF',
        issues,
        isNormalized: issues.length === 0,
    };
};
exports.validate2NF = validate2NF;
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
const validate3NF = (attributes, primaryKeys) => {
    const issues = [];
    const fieldNames = Object.keys(attributes);
    // Look for potential transitive dependencies
    fieldNames.forEach((field1) => {
        if (primaryKeys.includes(field1))
            return;
        fieldNames.forEach((field2) => {
            if (primaryKeys.includes(field2) || field1 === field2)
                return;
            // Heuristic: if field1 name contains field2 name, might indicate dependency
            if (field1.toLowerCase().includes(field2.toLowerCase()) &&
                field1 !== field2) {
                issues.push({
                    type: 'TRANSITIVE_DEPENDENCY',
                    description: `Field '${field1}' may transitively depend on '${field2}'`,
                    suggestion: `Consider creating a separate table with '${field2}' as the key`,
                });
            }
        });
    });
    return {
        normalForm: '3NF',
        issues,
        isNormalized: issues.length === 0,
    };
};
exports.validate3NF = validate3NF;
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
const suggestDenormalization = (attributes, relationships) => {
    const suggestions = [];
    relationships.forEach((rel) => {
        if (rel.type === 'belongsTo' && rel.accessFrequency && rel.accessFrequency > 0.8) {
            suggestions.push({
                field: `${rel.model.toLowerCase()}Name`,
                reason: `${rel.model} is accessed in >80% of queries`,
                impact: 'Reduces JOIN operations, increases read performance, adds update complexity',
            });
        }
        if (rel.type === 'hasMany') {
            suggestions.push({
                field: `${rel.model.toLowerCase()}Count`,
                reason: `Frequently need to count related ${rel.model} records`,
                impact: 'Eliminates COUNT queries, requires trigger to maintain accuracy',
            });
        }
    });
    return suggestions;
};
exports.suggestDenormalization = suggestDenormalization;
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
const createComputedColumn = (columnName, computation) => {
    return `ALTER TABLE {table_name} ADD COLUMN ${columnName} VARCHAR GENERATED ALWAYS AS (${computation}) STORED;`;
};
exports.createComputedColumn = createComputedColumn;
// ============================================================================
// 2. SOFT DELETE PATTERNS
// ============================================================================
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
const createSoftDeleteField = (config) => {
    if (config.type === 'timestamp') {
        return {
            [config.fieldName]: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
        };
    }
    else {
        return {
            [config.fieldName]: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: config.defaultValue ?? false,
            },
        };
    }
};
exports.createSoftDeleteField = createSoftDeleteField;
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
const createSoftDeleteScope = (deletedAtField) => {
    return {
        where: {
            [deletedAtField]: null,
        },
    };
};
exports.createSoftDeleteScope = createSoftDeleteScope;
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
const generateSoftDeleteQuery = (tableName, deletedAtField, deletedByField, userId) => {
    return `UPDATE ${tableName} SET ${deletedAtField} = NOW(), ${deletedByField} = '${userId}' WHERE id = :id AND ${deletedAtField} IS NULL`;
};
exports.generateSoftDeleteQuery = generateSoftDeleteQuery;
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
const createCascadeSoftDelete = (parentTable, childTable, foreignKey) => {
    return `
    CREATE OR REPLACE FUNCTION cascade_soft_delete_${parentTable}_${childTable}()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.deletedAt IS NOT NULL AND OLD.deletedAt IS NULL THEN
        UPDATE ${childTable}
        SET deletedAt = NEW.deletedAt, deletedBy = NEW.deletedBy
        WHERE ${foreignKey} = NEW.id AND deletedAt IS NULL;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER soft_delete_cascade_${parentTable}_${childTable}
    AFTER UPDATE ON ${parentTable}
    FOR EACH ROW
    EXECUTE FUNCTION cascade_soft_delete_${parentTable}_${childTable}();
  `;
};
exports.createCascadeSoftDelete = createCascadeSoftDelete;
// ============================================================================
// 3. AUDIT TRAIL PATTERNS
// ============================================================================
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
const createAuditFields = (config) => {
    const defaults = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        createdBy: 'createdBy',
        updatedBy: 'updatedBy',
        deletedAt: 'deletedAt',
        deletedBy: 'deletedBy',
    };
    const fields = { ...defaults, ...config };
    return {
        [fields.createdAt]: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        [fields.updatedAt]: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        [fields.createdBy]: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        [fields.updatedBy]: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        ...(fields.deletedAt && {
            [fields.deletedAt]: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
        }),
        ...(fields.deletedBy && {
            [fields.deletedBy]: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        }),
    };
};
exports.createAuditFields = createAuditFields;
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
const createAuditTrailTable = (config) => {
    return `
    CREATE TABLE IF NOT EXISTS ${config.tableName}_audit (
      id SERIAL PRIMARY KEY,
      record_id UUID NOT NULL,
      action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
      ${config.captureOldValues ? 'old_values JSONB,' : ''}
      ${config.captureNewValues ? 'new_values JSONB,' : ''}
      changed_fields TEXT[],
      ${config.includeUser ? 'user_id UUID,' : ''}
      ${config.includeTimestamp ? 'changed_at TIMESTAMP DEFAULT NOW(),' : ''}
      ip_address INET,
      user_agent TEXT
    );

    CREATE INDEX idx_${config.tableName}_audit_record_id ON ${config.tableName}_audit(record_id);
    CREATE INDEX idx_${config.tableName}_audit_changed_at ON ${config.tableName}_audit(changed_at);
    ${config.includeUser ? `CREATE INDEX idx_${config.tableName}_audit_user_id ON ${config.tableName}_audit(user_id);` : ''}
  `;
};
exports.createAuditTrailTable = createAuditTrailTable;
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
const createAuditTrigger = (tableName, trackedFields) => {
    return `
    CREATE OR REPLACE FUNCTION audit_${tableName}()
    RETURNS TRIGGER AS $$
    DECLARE
      old_data JSONB;
      new_data JSONB;
      changed_fields TEXT[] := ARRAY[]::TEXT[];
    BEGIN
      IF (TG_OP = 'UPDATE') THEN
        old_data := row_to_json(OLD)::JSONB;
        new_data := row_to_json(NEW)::JSONB;

        -- Detect changed fields
        ${trackedFields.map((field) => `
        IF OLD.${field} IS DISTINCT FROM NEW.${field} THEN
          changed_fields := array_append(changed_fields, '${field}');
        END IF;
        `).join('')}

        INSERT INTO ${tableName}_audit (record_id, action, old_values, new_values, changed_fields)
        VALUES (NEW.id, 'UPDATE', old_data, new_data, changed_fields);

      ELSIF (TG_OP = 'INSERT') THEN
        new_data := row_to_json(NEW)::JSONB;
        INSERT INTO ${tableName}_audit (record_id, action, new_values)
        VALUES (NEW.id, 'INSERT', new_data);

      ELSIF (TG_OP = 'DELETE') THEN
        old_data := row_to_json(OLD)::JSONB;
        INSERT INTO ${tableName}_audit (record_id, action, old_values)
        VALUES (OLD.id, 'DELETE', old_data);
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER ${tableName}_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ${tableName}
    FOR EACH ROW EXECUTE FUNCTION audit_${tableName}();
  `;
};
exports.createAuditTrigger = createAuditTrigger;
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
const getAuditHistory = async (sequelize, tableName, recordId) => {
    return sequelize.query(`SELECT * FROM ${tableName}_audit WHERE record_id = :recordId ORDER BY changed_at DESC`, {
        replacements: { recordId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getAuditHistory = getAuditHistory;
// ============================================================================
// 4. TEMPORAL TABLE PATTERNS
// ============================================================================
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
const createTemporalTable = (config) => {
    const historyTable = `${config.tableName}${config.historyTableSuffix}`;
    if (config.systemVersioned) {
        // PostgreSQL temporal tables
        return `
      -- Add temporal columns to main table
      ALTER TABLE ${config.tableName}
      ADD COLUMN ${config.validFrom} TIMESTAMP NOT NULL DEFAULT NOW(),
      ADD COLUMN ${config.validTo} TIMESTAMP NOT NULL DEFAULT 'infinity';

      -- Create history table (same structure as main table)
      CREATE TABLE ${historyTable} (LIKE ${config.tableName} INCLUDING ALL);

      -- Create trigger to maintain history
      CREATE OR REPLACE FUNCTION ${config.tableName}_temporal_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'UPDATE') THEN
          -- Close the old version
          INSERT INTO ${historyTable} SELECT OLD.*;
          NEW.${config.validFrom} = NOW();
          NEW.${config.validTo} = 'infinity';
        ELSIF (TG_OP = 'DELETE') THEN
          -- Archive the deleted record
          INSERT INTO ${historyTable} SELECT OLD.*;
          RETURN OLD;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER ${config.tableName}_versioning
      BEFORE UPDATE OR DELETE ON ${config.tableName}
      FOR EACH ROW EXECUTE FUNCTION ${config.tableName}_temporal_trigger();

      -- Create indexes for temporal queries
      CREATE INDEX idx_${historyTable}_valid_from ON ${historyTable}(${config.validFrom});
      CREATE INDEX idx_${historyTable}_valid_to ON ${historyTable}(${config.validTo});
    `;
    }
    return '';
};
exports.createTemporalTable = createTemporalTable;
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
const queryAsOf = async (sequelize, tableName, asOfDate, validFromField = 'validFrom', validToField = 'validTo') => {
    return sequelize.query(`
    SELECT * FROM ${tableName}
    WHERE :asOfDate BETWEEN ${validFromField} AND ${validToField}
    UNION ALL
    SELECT * FROM ${tableName}_history
    WHERE :asOfDate BETWEEN ${validFromField} AND ${validToField}
    `, {
        replacements: { asOfDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.queryAsOf = queryAsOf;
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
const getRecordVersions = async (sequelize, tableName, recordId) => {
    return sequelize.query(`
    SELECT *, 'current' as version_type FROM ${tableName} WHERE id = :recordId
    UNION ALL
    SELECT *, 'historical' as version_type FROM ${tableName}_history WHERE id = :recordId
    ORDER BY validFrom DESC
    `, {
        replacements: { recordId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getRecordVersions = getRecordVersions;
// ============================================================================
// 5. MULTI-TENANCY PATTERNS
// ============================================================================
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
const createTenantColumn = (config) => {
    return {
        [config.tenantIdColumn]: {
            type: config.tenantIdType,
            allowNull: false,
            references: {
                model: 'tenants',
                key: 'id',
            },
        },
    };
};
exports.createTenantColumn = createTenantColumn;
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
const createTenantRLSPolicy = (tableName, tenantIdColumn) => {
    return `
    -- Enable RLS on table
    ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

    -- Create policy for tenant isolation
    CREATE POLICY tenant_isolation_policy ON ${tableName}
    FOR ALL
    USING (${tenantIdColumn} = current_setting('app.current_tenant')::UUID)
    WITH CHECK (${tenantIdColumn} = current_setting('app.current_tenant')::UUID);

    -- Create policy for superadmin bypass
    CREATE POLICY tenant_admin_policy ON ${tableName}
    FOR ALL
    TO admin_role
    USING (true)
    WITH CHECK (true);
  `;
};
exports.createTenantRLSPolicy = createTenantRLSPolicy;
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
const setTenantContext = async (sequelize, tenantId) => {
    await sequelize.query(`SET app.current_tenant = '${tenantId}'`);
};
exports.setTenantContext = setTenantContext;
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
const createTenantIndex = (tableName, tenantIdColumn, otherColumns) => {
    const indexName = `idx_${tableName}_${tenantIdColumn}_${otherColumns.join('_')}`;
    const columns = [tenantIdColumn, ...otherColumns].join(', ');
    return `CREATE INDEX ${indexName} ON ${tableName}(${columns});`;
};
exports.createTenantIndex = createTenantIndex;
// ============================================================================
// 6. SHARDING STRATEGIES
// ============================================================================
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
const calculateHashShard = (shardKey, numberOfShards) => {
    let hash = 0;
    for (let i = 0; i < shardKey.length; i++) {
        hash = (hash << 5) - hash + shardKey.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % numberOfShards;
};
exports.calculateHashShard = calculateHashShard;
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
const calculateRangeShard = (value, ranges) => {
    for (const range of ranges) {
        if (value <= range.max) {
            return range.shard;
        }
    }
    return ranges[ranges.length - 1].shard;
};
exports.calculateRangeShard = calculateRangeShard;
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
const getShardConnection = (config, shardKeyValue) => {
    let shardNumber;
    switch (config.strategy) {
        case 'hash':
            shardNumber = (0, exports.calculateHashShard)(shardKeyValue, config.numberOfShards);
            break;
        case 'range':
            // Requires numeric value for range-based sharding
            shardNumber = (0, exports.calculateRangeShard)(parseInt(shardKeyValue), Array.from(config.shardMap.entries()).map(([key], index) => ({
                max: (index + 1) * 1000,
                shard: index,
            })));
            break;
        default:
            shardNumber = 0;
    }
    const shardKey = Array.from(config.shardMap.keys())[shardNumber];
    return config.shardMap.get(shardKey);
};
exports.getShardConnection = getShardConnection;
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
const createShardLookupTable = (tableName) => {
    return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY,
      shard_key VARCHAR(255) NOT NULL,
      shard_number INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(shard_key)
    );

    CREATE INDEX idx_${tableName}_shard_key ON ${tableName}(shard_key);
    CREATE INDEX idx_${tableName}_shard_number ON ${tableName}(shard_number);
  `;
};
exports.createShardLookupTable = createShardLookupTable;
// ============================================================================
// 7. PARTITIONING HELPERS
// ============================================================================
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
const createPartitionedTable = (tableName, config) => {
    let sql = `CREATE TABLE ${tableName} (\n  -- columns defined here\n) PARTITION BY ${config.type.toUpperCase()} (${config.column});\n\n`;
    config.partitions.forEach((partition) => {
        if (config.type === 'range' && partition.condition) {
            sql += `CREATE TABLE ${partition.name} PARTITION OF ${tableName} FOR VALUES FROM ${partition.condition};\n`;
        }
        else if (config.type === 'list' && partition.values) {
            sql += `CREATE TABLE ${partition.name} PARTITION OF ${tableName} FOR VALUES IN (${partition.values.map((v) => `'${v}'`).join(', ')});\n`;
        }
        else if (config.type === 'hash' && partition.modulus && partition.remainder !== undefined) {
            sql += `CREATE TABLE ${partition.name} PARTITION OF ${tableName} FOR VALUES WITH (MODULUS ${partition.modulus}, REMAINDER ${partition.remainder});\n`;
        }
    });
    return sql;
};
exports.createPartitionedTable = createPartitionedTable;
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
const addPartition = (tableName, partitionName, condition) => {
    return `CREATE TABLE ${partitionName} PARTITION OF ${tableName} ${condition};`;
};
exports.addPartition = addPartition;
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
const detachPartition = (tableName, partitionName) => {
    return `ALTER TABLE ${tableName} DETACH PARTITION ${partitionName};`;
};
exports.detachPartition = detachPartition;
// ============================================================================
// 8. JSONB UTILITIES
// ============================================================================
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
const createJSONBIndex = (tableName, jsonbColumn, indexName) => {
    return `CREATE INDEX ${indexName} ON ${tableName} USING GIN (${jsonbColumn});`;
};
exports.createJSONBIndex = createJSONBIndex;
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
const queryJSONB = (tableName, jsonbColumn, path, value) => {
    const pathParts = path.split('.');
    let jsonPath = jsonbColumn;
    for (let i = 0; i < pathParts.length - 1; i++) {
        jsonPath += `->'${pathParts[i]}'`;
    }
    jsonPath += `->>'${pathParts[pathParts.length - 1]}'`;
    return `SELECT * FROM ${tableName} WHERE ${jsonPath} = '${value}'`;
};
exports.queryJSONB = queryJSONB;
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
const validateJSONBSchema = (data, schema) => {
    const errors = [];
    if (schema.type === 'object' && typeof data !== 'object') {
        errors.push('Data must be an object');
    }
    if (schema.required) {
        schema.required.forEach((field) => {
            if (!(field in data)) {
                errors.push(`Required field '${field}' is missing`);
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateJSONBSchema = validateJSONBSchema;
// ============================================================================
// 9. FULL-TEXT SEARCH
// ============================================================================
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
const createFullTextSearchIndex = (config) => {
    return `
    -- Add tsvector column
    ALTER TABLE ${config.tableName}
    ADD COLUMN ${config.vectorColumn} tsvector;

    -- Create trigger to maintain tsvector
    CREATE OR REPLACE FUNCTION ${config.tableName}_search_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.${config.vectorColumn} :=
        ${config.columns.map((col) => `to_tsvector('${config.language}', COALESCE(NEW.${col}, ''))`).join(" || ' ' || ")};
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER ${config.tableName}_search_update
    BEFORE INSERT OR UPDATE ON ${config.tableName}
    FOR EACH ROW EXECUTE FUNCTION ${config.tableName}_search_trigger();

    -- Create GIN index on tsvector
    CREATE INDEX ${config.indexName} ON ${config.tableName} USING GIN (${config.vectorColumn});

    -- Update existing rows
    UPDATE ${config.tableName}
    SET ${config.vectorColumn} = ${config.columns.map((col) => `to_tsvector('${config.language}', COALESCE(${col}, ''))`).join(" || ' ' || ")};
  `;
};
exports.createFullTextSearchIndex = createFullTextSearchIndex;
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
const searchFullText = (tableName, vectorColumn, searchQuery) => {
    return `
    SELECT *,
      ts_rank(${vectorColumn}, to_tsquery('english', '${searchQuery}')) AS rank
    FROM ${tableName}
    WHERE ${vectorColumn} @@ to_tsquery('english', '${searchQuery}')
    ORDER BY rank DESC;
  `;
};
exports.searchFullText = searchFullText;
// ============================================================================
// 10. MATERIALIZED VIEWS
// ============================================================================
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
const createMaterializedView = (config) => {
    let sql = `CREATE MATERIALIZED VIEW ${config.viewName} AS\n${config.query};\n\n`;
    if (config.indexes) {
        config.indexes.forEach((column) => {
            sql += `CREATE INDEX idx_${config.viewName}_${column} ON ${config.viewName}(${column});\n`;
        });
    }
    return sql;
};
exports.createMaterializedView = createMaterializedView;
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
const refreshMaterializedView = async (sequelize, viewName, concurrently = false) => {
    const concurrentlyKeyword = concurrently ? 'CONCURRENTLY' : '';
    await sequelize.query(`REFRESH MATERIALIZED VIEW ${concurrentlyKeyword} ${viewName}`);
};
exports.refreshMaterializedView = refreshMaterializedView;
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
const createMaterializedViewRefreshJob = (viewName, schedule) => {
    return `
    -- Using pg_cron extension
    SELECT cron.schedule('refresh_${viewName}', '${schedule}',
      $$REFRESH MATERIALIZED VIEW CONCURRENTLY ${viewName}$$);
  `;
};
exports.createMaterializedViewRefreshJob = createMaterializedViewRefreshJob;
// ============================================================================
// 11. DATABASE TRIGGERS
// ============================================================================
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
const createDatabaseTrigger = (config) => {
    const condition = config.condition ? `WHEN (${config.condition})` : '';
    return `
    CREATE TRIGGER ${config.name}
    ${config.timing} ${config.event} ON ${config.table}
    FOR EACH ${config.forEach}
    ${condition}
    EXECUTE FUNCTION ${config.function}();
  `;
};
exports.createDatabaseTrigger = createDatabaseTrigger;
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
const createTimestampTriggerFunction = () => {
    return `
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updatedAt = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
};
exports.createTimestampTriggerFunction = createTimestampTriggerFunction;
// ============================================================================
// 12. STORED PROCEDURES
// ============================================================================
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
const createStoredProcedure = (config) => {
    const params = config.parameters
        .map((p) => `${p.mode} ${p.name} ${p.type}`)
        .join(', ');
    const returns = config.returnType ? `RETURNS ${config.returnType}` : '';
    return `
    CREATE OR REPLACE FUNCTION ${config.name}(${params})
    ${returns}
    LANGUAGE ${config.language}
    AS $$
    ${config.body}
    $$;
  `;
};
exports.createStoredProcedure = createStoredProcedure;
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
const callStoredProcedure = async (sequelize, procedureName, parameters) => {
    const placeholders = parameters.map((_, i) => `:param${i}`).join(', ');
    const replacements = parameters.reduce((acc, param, i) => ({ ...acc, [`param${i}`]: param }), {});
    return sequelize.query(`SELECT ${procedureName}(${placeholders})`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.callStoredProcedure = callStoredProcedure;
// ============================================================================
// 13. DATA INTEGRITY AND CONSTRAINTS
// ============================================================================
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
const createCheckConstraint = (tableName, constraintName, condition) => {
    return `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} CHECK (${condition});`;
};
exports.createCheckConstraint = createCheckConstraint;
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
const runDataIntegrityChecks = async (sequelize, checks) => {
    const results = [];
    for (const check of checks) {
        const [result] = await sequelize.query(check.query, { type: sequelize_1.QueryTypes.SELECT });
        const count = Object.values(result)[0];
        const violations = Math.abs(count - check.expectedCount);
        if (violations > 0) {
            results.push({
                check: check.checkName,
                violations,
                severity: check.severity,
            });
        }
    }
    return results;
};
exports.runDataIntegrityChecks = runDataIntegrityChecks;
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
const createForeignKey = (tableName, columnName, referencedTable, referencedColumn, options = {}) => {
    const constraintName = `fk_${tableName}_${columnName}`;
    const onDelete = options.onDelete ? `ON DELETE ${options.onDelete}` : '';
    const onUpdate = options.onUpdate ? `ON UPDATE ${options.onUpdate}` : '';
    return `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(${referencedColumn}) ${onDelete} ${onUpdate};`;
};
exports.createForeignKey = createForeignKey;
// ============================================================================
// 14. SCHEMA VERSIONING
// ============================================================================
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
const createSchemaVersionTable = () => {
    return `
    CREATE TABLE IF NOT EXISTS schema_versions (
      id SERIAL PRIMARY KEY,
      version VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      type VARCHAR(20) CHECK (type IN ('migration', 'seed', 'rollback')),
      checksum VARCHAR(64) NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW(),
      execution_time INTEGER,
      applied_by VARCHAR(100)
    );

    CREATE INDEX idx_schema_versions_version ON schema_versions(version);
    CREATE INDEX idx_schema_versions_applied_at ON schema_versions(applied_at);
  `;
};
exports.createSchemaVersionTable = createSchemaVersionTable;
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
const recordSchemaMigration = async (sequelize, version) => {
    await sequelize.query(`INSERT INTO schema_versions (version, description, checksum, execution_time, type)
     VALUES (:version, :description, :checksum, :executionTime, 'migration')`, {
        replacements: {
            version: version.version,
            description: version.description,
            checksum: version.checksum,
            executionTime: version.executionTime,
        },
    });
};
exports.recordSchemaMigration = recordSchemaMigration;
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
const getSchemaVersionHistory = async (sequelize) => {
    const results = await sequelize.query('SELECT * FROM schema_versions ORDER BY applied_at DESC', { type: sequelize_1.QueryTypes.SELECT });
    return results.map((row) => ({
        version: row.version,
        description: row.description,
        appliedAt: row.applied_at,
        checksum: row.checksum,
        executionTime: row.execution_time,
    }));
};
exports.getSchemaVersionHistory = getSchemaVersionHistory;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Normalization helpers
    validate1NF: exports.validate1NF,
    validate2NF: exports.validate2NF,
    validate3NF: exports.validate3NF,
    suggestDenormalization: exports.suggestDenormalization,
    createComputedColumn: exports.createComputedColumn,
    // Soft delete patterns
    createSoftDeleteField: exports.createSoftDeleteField,
    createSoftDeleteScope: exports.createSoftDeleteScope,
    generateSoftDeleteQuery: exports.generateSoftDeleteQuery,
    createCascadeSoftDelete: exports.createCascadeSoftDelete,
    // Audit trail patterns
    createAuditFields: exports.createAuditFields,
    createAuditTrailTable: exports.createAuditTrailTable,
    createAuditTrigger: exports.createAuditTrigger,
    getAuditHistory: exports.getAuditHistory,
    // Temporal table patterns
    createTemporalTable: exports.createTemporalTable,
    queryAsOf: exports.queryAsOf,
    getRecordVersions: exports.getRecordVersions,
    // Multi-tenancy patterns
    createTenantColumn: exports.createTenantColumn,
    createTenantRLSPolicy: exports.createTenantRLSPolicy,
    setTenantContext: exports.setTenantContext,
    createTenantIndex: exports.createTenantIndex,
    // Sharding strategies
    calculateHashShard: exports.calculateHashShard,
    calculateRangeShard: exports.calculateRangeShard,
    getShardConnection: exports.getShardConnection,
    createShardLookupTable: exports.createShardLookupTable,
    // Partitioning helpers
    createPartitionedTable: exports.createPartitionedTable,
    addPartition: exports.addPartition,
    detachPartition: exports.detachPartition,
    // JSONB utilities
    createJSONBIndex: exports.createJSONBIndex,
    queryJSONB: exports.queryJSONB,
    validateJSONBSchema: exports.validateJSONBSchema,
    // Full-text search
    createFullTextSearchIndex: exports.createFullTextSearchIndex,
    searchFullText: exports.searchFullText,
    // Materialized views
    createMaterializedView: exports.createMaterializedView,
    refreshMaterializedView: exports.refreshMaterializedView,
    createMaterializedViewRefreshJob: exports.createMaterializedViewRefreshJob,
    // Database triggers
    createDatabaseTrigger: exports.createDatabaseTrigger,
    createTimestampTriggerFunction: exports.createTimestampTriggerFunction,
    // Stored procedures
    createStoredProcedure: exports.createStoredProcedure,
    callStoredProcedure: exports.callStoredProcedure,
    // Data integrity
    createCheckConstraint: exports.createCheckConstraint,
    runDataIntegrityChecks: exports.runDataIntegrityChecks,
    createForeignKey: exports.createForeignKey,
    // Schema versioning
    createSchemaVersionTable: exports.createSchemaVersionTable,
    recordSchemaMigration: exports.recordSchemaMigration,
    getSchemaVersionHistory: exports.getSchemaVersionHistory,
};
//# sourceMappingURL=database-schema-design-kit.js.map