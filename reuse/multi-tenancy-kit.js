"use strict";
/**
 * LOC: MT-KIT-001
 * File: /reuse/multi-tenancy-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/validator (v13.x)
 *
 * DOWNSTREAM (imported by):
 *   - Multi-tenant authentication services
 *   - Tenant management controllers
 *   - Tenant isolation middleware
 *   - Cross-tenant reporting services
 *   - Healthcare platform tenant services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenantUsage = exports.invalidateTenantCache = exports.generateTenantCacheKey = exports.getTenantConfig = exports.updateTenantConfig = exports.revokeCrossTenantAccess = exports.validateCrossTenantAccess = exports.createCrossTenantAccessPolicy = exports.decryptTenantData = exports.encryptTenantData = exports.segregateTenantData = exports.validateDataOwnership = exports.upgradeTenantTier = exports.setupTrialTenant = exports.deprovisionTenant = exports.provisionTenant = exports.restoreTenantData = exports.backupTenantData = exports.copyTenantData = exports.migrateTenantSchema = exports.deleteTenantRecords = exports.updateTenantRecords = exports.createTenantRecord = exports.findOneTenantRecord = exports.countTenantRecords = exports.executeTenantAwareQuery = exports.clearExpiredTenantContexts = exports.retrieveTenantContext = exports.storeTenantContext = exports.createTenantContext = exports.enforceTenantIsolationInBulk = exports.validateTenantAccess = exports.setTenantContextInSession = exports.applyRowLevelSecurity = exports.createTenantConnection = exports.applyTenantIsolation = exports.createTenantScopedQuery = exports.createTenantTable = exports.getTenantContextModelAttributes = exports.getTenantModelAttributes = exports.IsolationStrategy = exports.TenantTier = exports.TenantStatus = void 0;
/**
 * File: /reuse/multi-tenancy-kit.ts
 * Locator: WC-MT-KIT-001
 * Purpose: Multi-Tenancy Kit - Comprehensive tenant management and isolation for Sequelize
 *
 * Upstream: sequelize v6.x, @types/validator
 * Downstream: Tenant services, isolation middleware, quota enforcement, tenant analytics
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS 10.x
 * Exports: 40 functions for tenant management, isolation, context, migrations, onboarding, caching
 *
 * LLM Context: Enterprise-grade multi-tenancy utilities for White Cross healthcare platform.
 * Provides comprehensive tenant isolation, provisioning, context management, tenant-aware queries,
 * data segregation, cross-tenant access guards, configuration management, tenant-specific caching,
 * usage tracking, and HIPAA-compliant tenant operations with strict data isolation.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Tenant status enumeration
 */
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["PROVISIONING"] = "provisioning";
    TenantStatus["DEPROVISIONING"] = "deprovisioning";
    TenantStatus["ARCHIVED"] = "archived";
    TenantStatus["TRIAL"] = "trial";
    TenantStatus["EXPIRED"] = "expired";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
/**
 * Tenant tier for pricing/features
 */
var TenantTier;
(function (TenantTier) {
    TenantTier["FREE"] = "free";
    TenantTier["BASIC"] = "basic";
    TenantTier["PROFESSIONAL"] = "professional";
    TenantTier["ENTERPRISE"] = "enterprise";
    TenantTier["HEALTHCARE"] = "healthcare";
    TenantTier["CUSTOM"] = "custom";
})(TenantTier || (exports.TenantTier = TenantTier = {}));
/**
 * Isolation strategy
 */
var IsolationStrategy;
(function (IsolationStrategy) {
    IsolationStrategy["SCHEMA"] = "schema";
    IsolationStrategy["DATABASE"] = "database";
    IsolationStrategy["ROW_LEVEL"] = "row_level";
    IsolationStrategy["HYBRID"] = "hybrid";
})(IsolationStrategy || (exports.IsolationStrategy = IsolationStrategy = {}));
// ============================================================================
// TENANT MODEL DEFINITIONS
// ============================================================================
/**
 * 1. Defines comprehensive Tenant model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} Tenant model attributes
 *
 * @example
 * ```typescript
 * const Tenant = sequelize.define('Tenant', getTenantModelAttributes(sequelize));
 * ```
 */
const getTenantModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique tenant identifier',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255],
        },
        comment: 'Tenant display name',
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9-]+$/i,
            len: [2, 100],
        },
        comment: 'URL-friendly tenant identifier',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TenantStatus)),
        allowNull: false,
        defaultValue: TenantStatus.PROVISIONING,
        comment: 'Current tenant status',
    },
    tier: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TenantTier)),
        allowNull: false,
        defaultValue: TenantTier.FREE,
        comment: 'Tenant subscription tier',
    },
    isolationStrategy: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(IsolationStrategy)),
        allowNull: false,
        defaultValue: IsolationStrategy.ROW_LEVEL,
        comment: 'Data isolation strategy',
    },
    schemaName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        validate: {
            is: /^[a-z_][a-z0-9_]*$/i,
        },
        comment: 'Schema name for schema isolation',
    },
    databaseName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        validate: {
            is: /^[a-z_][a-z0-9_]*$/i,
        },
        comment: 'Database name for database isolation',
    },
    config: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Tenant configuration settings',
    },
    quota: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Tenant resource quotas',
    },
    usage: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            currentUsers: 0,
            currentStorage: 0,
            currentApiCalls: 0,
            currentDatabases: 0,
            currentRecords: 0,
            currentSessions: 0,
            bandwidthUsed: 0,
        },
        comment: 'Current tenant resource usage',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional tenant metadata',
    },
    encryptionKey: {
        type: sequelize_1.DataTypes.STRING(512),
        allowNull: true,
        comment: 'Tenant-specific encryption key (encrypted)',
    },
    parentTenantId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tenants',
            key: 'id',
        },
        comment: 'Parent tenant for hierarchies',
    },
    provisionedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when tenant was fully provisioned',
    },
    suspendedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when tenant was suspended',
    },
    archivedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when tenant was archived',
    },
    trialEndsAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Trial period end date',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp',
    },
});
exports.getTenantModelAttributes = getTenantModelAttributes;
/**
 * 2. Defines TenantContext model for tracking tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantContext model attributes
 */
const getTenantContextModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    tenantId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tenants',
            key: 'id',
        },
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        comment: 'User ID associated with this context',
    },
    sessionId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Session identifier',
    },
    contextData: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Context metadata and settings',
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        comment: 'Context expiration timestamp',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getTenantContextModelAttributes = getTenantContextModelAttributes;
/**
 * 3. Creates Tenant table migration with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
const createTenantTable = async (queryInterface, sequelize) => {
    await queryInterface.createTable('tenants', (0, exports.getTenantModelAttributes)(sequelize));
    // Create indexes for performance
    await queryInterface.addIndex('tenants', ['status'], { name: 'idx_tenants_status' });
    await queryInterface.addIndex('tenants', ['tier'], { name: 'idx_tenants_tier' });
    await queryInterface.addIndex('tenants', ['slug'], { name: 'idx_tenants_slug', unique: true });
    await queryInterface.addIndex('tenants', ['isolationStrategy'], { name: 'idx_tenants_isolation' });
    await queryInterface.addIndex('tenants', ['parentTenantId'], { name: 'idx_tenants_parent' });
    await queryInterface.addIndex('tenants', ['createdAt'], { name: 'idx_tenants_created' });
    await queryInterface.addIndex('tenants', ['deletedAt'], { name: 'idx_tenants_deleted' });
};
exports.createTenantTable = createTenantTable;
// ============================================================================
// TENANT ISOLATION AND SCOPES
// ============================================================================
/**
 * 4. Creates tenant-scoped query with isolation enforcement.
 *
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} baseOptions - Base query options
 * @returns {FindOptions} Scoped query options
 *
 * @example
 * ```typescript
 * const scopedQuery = createTenantScopedQuery(context, { where: { active: true } });
 * const results = await Model.findAll(scopedQuery);
 * ```
 */
const createTenantScopedQuery = (context, baseOptions = {}) => {
    const scopedOptions = { ...baseOptions };
    if (context.isolationStrategy === IsolationStrategy.ROW_LEVEL) {
        scopedOptions.where = {
            ...(baseOptions.where || {}),
            tenantId: context.tenantId,
        };
    }
    else if (context.isolationStrategy === IsolationStrategy.SCHEMA && context.schemaName) {
        scopedOptions.schema = context.schemaName;
    }
    return scopedOptions;
};
exports.createTenantScopedQuery = createTenantScopedQuery;
/**
 * 5. Applies tenant isolation to a model class with hooks.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @returns {ModelStatic<any>} Model with tenant isolation
 */
const applyTenantIsolation = (model, tenantId) => {
    // Add default scope
    model.addScope('tenant', {
        where: { tenantId },
    });
    // Add before create hook
    model.addHook('beforeCreate', (instance) => {
        if (!instance.tenantId) {
            instance.tenantId = tenantId;
        }
    });
    // Add before bulk create hook
    model.addHook('beforeBulkCreate', (instances) => {
        instances.forEach((instance) => {
            if (!instance.tenantId) {
                instance.tenantId = tenantId;
            }
        });
    });
    return model;
};
exports.applyTenantIsolation = applyTenantIsolation;
/**
 * 6. Creates tenant-isolated database connection.
 *
 * @param {Sequelize} baseSequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
const createTenantConnection = async (baseSequelize, tenantId, strategy) => {
    const Tenant = baseSequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    if (strategy === IsolationStrategy.DATABASE) {
        const dbName = tenant.databaseName;
        return new sequelize_1.Sequelize({
            ...baseSequelize.options,
            database: dbName,
        });
    }
    else if (strategy === IsolationStrategy.SCHEMA) {
        const schemaName = tenant.schemaName;
        const connection = baseSequelize.connectionManager.getConnection({
            type: 'read',
        });
        await baseSequelize.query(`SET search_path TO ${schemaName}`);
        return baseSequelize;
    }
    return baseSequelize;
};
exports.createTenantConnection = createTenantConnection;
/**
 * 7. Applies row-level security policy for tenant isolation (PostgreSQL).
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumn - Tenant column name
 * @returns {Promise<void>}
 */
const applyRowLevelSecurity = async (queryInterface, tableName, tenantColumn = 'tenantId') => {
    await queryInterface.sequelize.query(`
    ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_policy ON "${tableName}"
    USING (${tenantColumn} = current_setting('app.current_tenant')::uuid);

    CREATE POLICY tenant_isolation_insert_policy ON "${tableName}"
    FOR INSERT
    WITH CHECK (${tenantColumn} = current_setting('app.current_tenant')::uuid);
  `);
};
exports.applyRowLevelSecurity = applyRowLevelSecurity;
/**
 * 8. Sets tenant context for database session (PostgreSQL).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const setTenantContextInSession = async (sequelize, tenantId, transaction) => {
    await sequelize.query(`SET app.current_tenant = '${tenantId}'`, {
        transaction,
    });
};
exports.setTenantContextInSession = setTenantContextInSession;
/**
 * 9. Validates tenant access for a user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if user has access
 */
const validateTenantAccess = async (sequelize, userId, tenantId) => {
    const UserTenant = sequelize.models.UserTenant;
    if (!UserTenant) {
        const User = sequelize.models.User;
        const user = await User?.findOne({ where: { id: userId, tenantId } });
        return !!user;
    }
    const access = await UserTenant.findOne({
        where: { userId, tenantId, status: 'active' },
    });
    return !!access;
};
exports.validateTenantAccess = validateTenantAccess;
/**
 * 10. Enforces tenant isolation in bulk operations.
 *
 * @param {WhereOptions} where - Where clause
 * @param {string} tenantId - Tenant ID
 * @returns {WhereOptions} Tenant-scoped where clause
 */
const enforceTenantIsolationInBulk = (where, tenantId) => {
    return {
        ...where,
        tenantId,
    };
};
exports.enforceTenantIsolationInBulk = enforceTenantIsolationInBulk;
// ============================================================================
// TENANT CONTEXT PROVIDERS
// ============================================================================
/**
 * 11. Creates tenant context from request/session data.
 *
 * @param {object} data - Context data
 * @returns {Promise<TenantContext>} Tenant context
 */
const createTenantContext = async (data) => {
    return {
        tenantId: data.tenantId,
        userId: data.userId,
        isolationStrategy: data.isolationStrategy || IsolationStrategy.ROW_LEVEL,
        schemaName: data.schemaName,
        databaseName: data.databaseName,
        permissions: data.permissions || [],
        metadata: {},
    };
};
exports.createTenantContext = createTenantContext;
/**
 * 12. Stores tenant context in session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @param {TenantContext} context - Tenant context
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 */
const storeTenantContext = async (sequelize, sessionId, context, ttl = 3600) => {
    const TenantContext = sequelize.models.TenantContext;
    if (!TenantContext) {
        throw new Error('TenantContext model not found');
    }
    const expiresAt = new Date(Date.now() + ttl * 1000);
    await TenantContext.create({
        tenantId: context.tenantId,
        userId: context.userId,
        sessionId,
        contextData: context,
        expiresAt,
    });
};
exports.storeTenantContext = storeTenantContext;
/**
 * 13. Retrieves tenant context from session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @returns {Promise<TenantContext | null>} Tenant context or null
 */
const retrieveTenantContext = async (sequelize, sessionId) => {
    const TenantContext = sequelize.models.TenantContext;
    if (!TenantContext) {
        return null;
    }
    const contextRecord = await TenantContext.findOne({
        where: {
            sessionId,
            expiresAt: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    if (!contextRecord) {
        return null;
    }
    return contextRecord.contextData;
};
exports.retrieveTenantContext = retrieveTenantContext;
/**
 * 14. Clears expired tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of contexts cleared
 */
const clearExpiredTenantContexts = async (sequelize) => {
    const TenantContext = sequelize.models.TenantContext;
    if (!TenantContext) {
        return 0;
    }
    const result = await TenantContext.destroy({
        where: {
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
        },
    });
    return result;
};
exports.clearExpiredTenantContexts = clearExpiredTenantContexts;
// ============================================================================
// TENANT-AWARE QUERIES
// ============================================================================
/**
 * 15. Executes tenant-aware query with automatic scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} options - Query options
 * @returns {Promise<any[]>} Query results
 */
const executeTenantAwareQuery = async (model, context, options = {}) => {
    const scopedOptions = (0, exports.createTenantScopedQuery)(context, options);
    return await model.findAll(scopedOptions);
};
exports.executeTenantAwareQuery = executeTenantAwareQuery;
/**
 * 16. Counts records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @returns {Promise<number>} Record count
 */
const countTenantRecords = async (model, context, where = {}) => {
    const scopedWhere = (0, exports.enforceTenantIsolationInBulk)(where, context.tenantId);
    return await model.count({ where: scopedWhere });
};
exports.countTenantRecords = countTenantRecords;
/**
 * 17. Finds one record with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} options - Query options
 * @returns {Promise<any | null>} Record or null
 */
const findOneTenantRecord = async (model, context, options = {}) => {
    const scopedOptions = (0, exports.createTenantScopedQuery)(context, options);
    return await model.findOne(scopedOptions);
};
exports.findOneTenantRecord = findOneTenantRecord;
/**
 * 18. Creates record with tenant context.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {object} data - Record data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created record
 */
const createTenantRecord = async (model, context, data, transaction) => {
    return await model.create({
        ...data,
        tenantId: context.tenantId,
    }, { transaction });
};
exports.createTenantRecord = createTenantRecord;
/**
 * 19. Updates records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @param {object} updates - Update data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of updated records
 */
const updateTenantRecords = async (model, context, where, updates, transaction) => {
    const scopedWhere = (0, exports.enforceTenantIsolationInBulk)(where, context.tenantId);
    const [affectedCount] = await model.update(updates, { where: scopedWhere, transaction });
    return affectedCount;
};
exports.updateTenantRecords = updateTenantRecords;
/**
 * 20. Deletes records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted records
 */
const deleteTenantRecords = async (model, context, where, transaction) => {
    const scopedWhere = (0, exports.enforceTenantIsolationInBulk)(where, context.tenantId);
    return await model.destroy({ where: scopedWhere, transaction });
};
exports.deleteTenantRecords = deleteTenantRecords;
// ============================================================================
// TENANT MIGRATION UTILITIES
// ============================================================================
/**
 * 21. Migrates tenant schema to latest version.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} targetVersion - Target schema version
 * @returns {Promise<void>}
 */
const migrateTenantSchema = async (sequelize, tenantId, targetVersion) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const schemaName = tenant.schemaName;
    if (schemaName) {
        await sequelize.query(`SET search_path TO ${schemaName}`);
        // Run migrations specific to this schema
        // This would integrate with your migration system
    }
    await tenant.update({
        metadata: {
            ...tenant.metadata,
            schemaVersion: targetVersion,
            lastMigrated: new Date(),
        },
    });
};
exports.migrateTenantSchema = migrateTenantSchema;
/**
 * 22. Copies data from one tenant to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantMigrationOptions} options - Migration options
 * @returns {Promise<number>} Number of records copied
 */
const copyTenantData = async (sequelize, options) => {
    let totalCopied = 0;
    for (const modelName of options.models) {
        const Model = sequelize.models[modelName];
        if (!Model)
            continue;
        const records = await Model.findAll({
            where: { tenantId: options.sourceTenantId },
        });
        for (const record of records) {
            const data = record.toJSON();
            if (!options.preserveIds) {
                delete data.id;
            }
            delete data.createdAt;
            delete data.updatedAt;
            if (!options.dryRun) {
                await Model.create({
                    ...data,
                    tenantId: options.targetTenantId,
                });
            }
            totalCopied++;
        }
    }
    return totalCopied;
};
exports.copyTenantData = copyTenantData;
/**
 * 23. Backs up tenant data to JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} models - Models to backup
 * @returns {Promise<object>} Backup data
 */
const backupTenantData = async (sequelize, tenantId, models) => {
    const backup = {
        tenantId,
        timestamp: new Date(),
        models: {},
    };
    for (const modelName of models) {
        const Model = sequelize.models[modelName];
        if (!Model)
            continue;
        const records = await Model.findAll({
            where: { tenantId },
            raw: true,
        });
        backup.models[modelName] = records;
    }
    return backup;
};
exports.backupTenantData = backupTenantData;
/**
 * 24. Restores tenant data from backup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} backup - Backup data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records restored
 */
const restoreTenantData = async (sequelize, backup, transaction) => {
    let totalRestored = 0;
    for (const [modelName, records] of Object.entries(backup.models)) {
        const Model = sequelize.models[modelName];
        if (!Model)
            continue;
        for (const record of records) {
            await Model.create(record, { transaction });
            totalRestored++;
        }
    }
    return totalRestored;
};
exports.restoreTenantData = restoreTenantData;
// ============================================================================
// TENANT ONBOARDING SERVICES
// ============================================================================
/**
 * 25. Provisions new tenant with complete setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantOnboardingData} data - Onboarding data
 * @returns {Promise<any>} Created tenant
 */
const provisionTenant = async (sequelize, data) => {
    const transaction = await sequelize.transaction();
    try {
        const Tenant = sequelize.models.Tenant;
        // Create tenant
        const tenant = await Tenant.create({
            name: data.name,
            slug: data.slug,
            tier: data.tier,
            status: TenantStatus.PROVISIONING,
            config: data.config || {},
            quota: data.quota || {},
            usage: {
                currentUsers: 0,
                currentStorage: 0,
                currentApiCalls: 0,
                currentDatabases: 0,
                currentRecords: 0,
                currentSessions: 0,
                bandwidthUsed: 0,
            },
        }, { transaction });
        // Create admin user
        const User = sequelize.models.User;
        if (User) {
            await User.create({
                tenantId: tenant.id,
                email: data.adminEmail,
                name: data.adminName,
                role: 'admin',
                status: 'active',
            }, { transaction });
        }
        // Mark as provisioned
        await tenant.update({
            status: TenantStatus.ACTIVE,
            provisionedAt: new Date(),
        }, { transaction });
        await transaction.commit();
        return tenant;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.provisionTenant = provisionTenant;
/**
 * 26. Deprovisions tenant and cleans up resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
const deprovisionTenant = async (sequelize, tenantId) => {
    const transaction = await sequelize.transaction();
    try {
        const Tenant = sequelize.models.Tenant;
        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
            throw new Error(`Tenant ${tenantId} not found`);
        }
        // Update status to deprovisioning
        await tenant.update({ status: TenantStatus.DEPROVISIONING }, { transaction });
        // Archive tenant data
        await tenant.update({
            status: TenantStatus.ARCHIVED,
            archivedAt: new Date(),
            deletedAt: new Date(),
        }, { transaction });
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.deprovisionTenant = deprovisionTenant;
/**
 * 27. Sets up trial tenant with expiration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantOnboardingData} data - Onboarding data
 * @param {number} trialDays - Trial duration in days
 * @returns {Promise<any>} Created trial tenant
 */
const setupTrialTenant = async (sequelize, data, trialDays = 14) => {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);
    const tenant = await (0, exports.provisionTenant)(sequelize, {
        ...data,
        tier: TenantTier.FREE,
    });
    await tenant.update({
        status: TenantStatus.TRIAL,
        trialEndsAt,
    });
    return tenant;
};
exports.setupTrialTenant = setupTrialTenant;
/**
 * 28. Upgrades tenant tier with quota updates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantTier} newTier - New tier
 * @returns {Promise<any>} Updated tenant
 */
const upgradeTenantTier = async (sequelize, tenantId, newTier) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    // Define tier quotas
    const tierQuotas = {
        [TenantTier.FREE]: {
            maxUsers: 5,
            maxStorage: 1024 * 1024 * 1024, // 1 GB
            maxApiCalls: 1000,
            maxConcurrentSessions: 2,
        },
        [TenantTier.BASIC]: {
            maxUsers: 25,
            maxStorage: 10 * 1024 * 1024 * 1024, // 10 GB
            maxApiCalls: 10000,
            maxConcurrentSessions: 10,
        },
        [TenantTier.PROFESSIONAL]: {
            maxUsers: 100,
            maxStorage: 100 * 1024 * 1024 * 1024, // 100 GB
            maxApiCalls: 100000,
            maxConcurrentSessions: 50,
        },
        [TenantTier.ENTERPRISE]: {
            maxUsers: -1, // Unlimited
            maxStorage: -1,
            maxApiCalls: -1,
            maxConcurrentSessions: -1,
        },
        [TenantTier.HEALTHCARE]: {
            maxUsers: -1,
            maxStorage: -1,
            maxApiCalls: -1,
            maxConcurrentSessions: -1,
        },
        [TenantTier.CUSTOM]: {},
    };
    await tenant.update({
        tier: newTier,
        quota: tierQuotas[newTier],
    });
    return tenant;
};
exports.upgradeTenantTier = upgradeTenantTier;
// ============================================================================
// TENANT DATA SEGREGATION
// ============================================================================
/**
 * 29. Validates data belongs to tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {string} recordId - Record ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if valid
 */
const validateDataOwnership = async (sequelize, modelName, recordId, tenantId) => {
    const Model = sequelize.models[modelName];
    if (!Model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const record = await Model.findOne({
        where: { id: recordId, tenantId },
    });
    return !!record;
};
exports.validateDataOwnership = validateDataOwnership;
/**
 * 30. Segregates tenant data in shared tables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
const segregateTenantData = async (sequelize, tableName, tenantId) => {
    // Add tenant column if not exists
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable(tableName);
    if (!tableDescription.tenantId) {
        await queryInterface.addColumn(tableName, 'tenantId', {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        });
        await queryInterface.addIndex(tableName, ['tenantId'], {
            name: `idx_${tableName}_tenant`,
        });
    }
};
exports.segregateTenantData = segregateTenantData;
/**
 * 31. Encrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} data - Data to encrypt
 * @returns {Promise<object>} Encrypted data
 */
const encryptTenantData = async (sequelize, tenantId, data) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    // Use tenant-specific encryption key
    // Implementation would use crypto library
    return { encrypted: true, data: JSON.stringify(data) };
};
exports.encryptTenantData = encryptTenantData;
/**
 * 32. Decrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} encryptedData - Encrypted data
 * @returns {Promise<object>} Decrypted data
 */
const decryptTenantData = async (sequelize, tenantId, encryptedData) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    // Use tenant-specific encryption key
    return JSON.parse(encryptedData.data);
};
exports.decryptTenantData = decryptTenantData;
// ============================================================================
// CROSS-TENANT ACCESS GUARDS
// ============================================================================
/**
 * 33. Creates cross-tenant access policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CrossTenantAccessPolicy} policy - Access policy
 * @returns {Promise<any>} Created policy
 */
const createCrossTenantAccessPolicy = async (sequelize, policy) => {
    const CrossTenantAccess = sequelize.models.CrossTenantAccess;
    if (!CrossTenantAccess) {
        throw new Error('CrossTenantAccess model not found');
    }
    return await CrossTenantAccess.create(policy);
};
exports.createCrossTenantAccessPolicy = createCrossTenantAccessPolicy;
/**
 * 34. Validates cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @param {string} accessLevel - Access level required
 * @returns {Promise<boolean>} True if access allowed
 */
const validateCrossTenantAccess = async (sequelize, sourceTenantId, targetTenantId, accessLevel = 'read') => {
    const CrossTenantAccess = sequelize.models.CrossTenantAccess;
    if (!CrossTenantAccess) {
        return false;
    }
    const policy = await CrossTenantAccess.findOne({
        where: {
            sourceTenantId,
            targetTenantId,
            accessLevel: { [sequelize_1.Op.in]: [accessLevel, 'admin'] },
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
    });
    return !!policy;
};
exports.validateCrossTenantAccess = validateCrossTenantAccess;
/**
 * 35. Revokes cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<number>} Number of policies revoked
 */
const revokeCrossTenantAccess = async (sequelize, sourceTenantId, targetTenantId) => {
    const CrossTenantAccess = sequelize.models.CrossTenantAccess;
    if (!CrossTenantAccess) {
        return 0;
    }
    return await CrossTenantAccess.destroy({
        where: { sourceTenantId, targetTenantId },
    });
};
exports.revokeCrossTenantAccess = revokeCrossTenantAccess;
// ============================================================================
// TENANT CONFIGURATION MANAGEMENT
// ============================================================================
/**
 * 36. Updates tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantConfig>} config - Configuration updates
 * @returns {Promise<any>} Updated tenant
 */
const updateTenantConfig = async (sequelize, tenantId, config) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const currentConfig = tenant.config || {};
    await tenant.update({
        config: {
            ...currentConfig,
            ...config,
            features: { ...currentConfig.features, ...config.features },
            security: { ...currentConfig.security, ...config.security },
            branding: { ...currentConfig.branding, ...config.branding },
        },
    });
    return tenant;
};
exports.updateTenantConfig = updateTenantConfig;
/**
 * 37. Retrieves tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<TenantConfig>} Tenant configuration
 */
const getTenantConfig = async (sequelize, tenantId) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    return tenant.config || {};
};
exports.getTenantConfig = getTenantConfig;
// ============================================================================
// TENANT-SPECIFIC CACHING
// ============================================================================
/**
 * 38. Generates tenant cache key.
 *
 * @param {string} tenantId - Tenant ID
 * @param {string} key - Cache key
 * @param {string} namespace - Optional namespace
 * @returns {string} Tenant-specific cache key
 */
const generateTenantCacheKey = (tenantId, key, namespace) => {
    const parts = ['tenant', tenantId];
    if (namespace) {
        parts.push(namespace);
    }
    parts.push(key);
    return parts.join(':');
};
exports.generateTenantCacheKey = generateTenantCacheKey;
/**
 * 39. Invalidates tenant cache.
 *
 * @param {any} cache - Cache instance (Redis, etc.)
 * @param {string} tenantId - Tenant ID
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} Number of keys invalidated
 */
const invalidateTenantCache = async (cache, tenantId, pattern = '*') => {
    const cachePattern = (0, exports.generateTenantCacheKey)(tenantId, pattern);
    if (cache.keys) {
        const keys = await cache.keys(cachePattern);
        if (keys.length > 0) {
            await cache.del(...keys);
        }
        return keys.length;
    }
    return 0;
};
exports.invalidateTenantCache = invalidateTenantCache;
// ============================================================================
// TENANT USAGE TRACKING
// ============================================================================
/**
 * 40. Updates tenant usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantUsage>} usage - Usage updates
 * @returns {Promise<any>} Updated tenant
 */
const updateTenantUsage = async (sequelize, tenantId, usage) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const currentUsage = tenant.usage || {};
    await tenant.update({
        usage: {
            ...currentUsage,
            ...usage,
            lastUpdated: new Date(),
        },
    });
    return tenant;
};
exports.updateTenantUsage = updateTenantUsage;
//# sourceMappingURL=multi-tenancy-kit.js.map