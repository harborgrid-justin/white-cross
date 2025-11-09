"use strict";
/**
 * LOC: IAM-TNT-001
 * File: /reuse/iam-tenant-kit.ts
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
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantHealthScore = exports.listTenants = exports.getTenantActivitySummary = exports.generateTenantAnalytics = exports.importTenantData = exports.exportTenantData = exports.migrateTenantIsolationStrategy = exports.migrateTenantTier = exports.replicateTenantData = exports.aggregateCrossTenantData = exports.executeCrossTenantOperation = exports.getTenantQuotaReport = exports.incrementTenantUsage = exports.updateTenantUsage = exports.isTenantQuotaExceeded = exports.setTenantQuota = exports.moveTenantInHierarchy = exports.getTenantHierarchyTree = exports.getTenantAncestors = exports.getTenantChildren = exports.createTenantHierarchy = exports.applyRowLevelSecurityPolicy = exports.isCrossTenantAccessAllowed = exports.getAccessibleTenantsForUser = exports.enforceTenantIsolationInBulk = exports.createTenantConnection = exports.validateTenantAccess = exports.applyTenantIsolation = exports.createTenantScopedQuery = exports.archiveTenant = exports.reactivateTenant = exports.suspendTenant = exports.updateTenantConfig = exports.getTenantBySlug = exports.getTenantById = exports.provisionTenant = exports.createTenantHierarchyTable = exports.createTenantTable = exports.getTenantQuotaHistoryModelAttributes = exports.getTenantHierarchyModelAttributes = exports.getTenantModelAttributes = exports.IsolationStrategy = exports.TenantTier = exports.TenantStatus = void 0;
/**
 * File: /reuse/iam-tenant-kit.ts
 * Locator: WC-IAM-TNT-001
 * Purpose: IAM Multi-Tenancy Kit - Comprehensive tenant management with Sequelize
 *
 * Upstream: sequelize v6.x, @types/validator
 * Downstream: Tenant services, isolation middleware, quota enforcement, tenant analytics
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45 functions for tenant management, isolation, hierarchies, quotas, and analytics
 *
 * LLM Context: Enterprise-grade multi-tenancy utilities for White Cross healthcare platform.
 * Provides comprehensive tenant isolation, provisioning, hierarchies, quota management,
 * cross-tenant operations, data migration, and tenant-scoped queries. HIPAA-compliant with
 * strict tenant data isolation and audit trail support for healthcare multi-tenancy.
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
// TENANT MODEL DEFINITIONS AND SCHEMAS
// ============================================================================
/**
 * Defines Tenant model attributes for Sequelize.
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
        },
        comment: 'Current tenant resource usage',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional tenant metadata',
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
 * Defines TenantHierarchy model attributes for parent-child relationships.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantHierarchy model attributes
 *
 * @example
 * ```typescript
 * const TenantHierarchy = sequelize.define('TenantHierarchy', getTenantHierarchyModelAttributes(sequelize));
 * ```
 */
const getTenantHierarchyModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    ancestorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tenants',
            key: 'id',
        },
        comment: 'Ancestor tenant in hierarchy',
    },
    descendantId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tenants',
            key: 'id',
        },
        comment: 'Descendant tenant in hierarchy',
    },
    depth: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
        comment: 'Depth in hierarchy (0 = self)',
    },
    path: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Full path from ancestor to descendant',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getTenantHierarchyModelAttributes = getTenantHierarchyModelAttributes;
/**
 * Defines TenantQuotaHistory model for quota tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantQuotaHistory model attributes
 */
const getTenantQuotaHistoryModelAttributes = (sequelize) => ({
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
    quotaType: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: 'Type of quota (users, storage, etc.)',
    },
    previousLimit: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    newLimit: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    changedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        comment: 'User who changed the quota',
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getTenantQuotaHistoryModelAttributes = getTenantQuotaHistoryModelAttributes;
/**
 * Creates Tenant table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTenantTable(queryInterface, sequelize);
 * ```
 */
const createTenantTable = async (queryInterface, sequelize) => {
    await queryInterface.createTable('tenants', (0, exports.getTenantModelAttributes)(sequelize), {
        uniqueKeys: {
            tenant_slug_unique: {
                fields: ['slug'],
            },
        },
    });
    // Create indexes
    await queryInterface.addIndex('tenants', ['status'], {
        name: 'idx_tenants_status',
    });
    await queryInterface.addIndex('tenants', ['tier'], {
        name: 'idx_tenants_tier',
    });
    await queryInterface.addIndex('tenants', ['parentTenantId'], {
        name: 'idx_tenants_parent',
    });
    await queryInterface.addIndex('tenants', ['slug'], {
        name: 'idx_tenants_slug',
        unique: true,
    });
    await queryInterface.addIndex('tenants', ['createdAt'], {
        name: 'idx_tenants_created_at',
    });
};
exports.createTenantTable = createTenantTable;
/**
 * Creates TenantHierarchy table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
const createTenantHierarchyTable = async (queryInterface, sequelize) => {
    await queryInterface.createTable('tenant_hierarchies', (0, exports.getTenantHierarchyModelAttributes)(sequelize));
    await queryInterface.addIndex('tenant_hierarchies', ['ancestorId'], {
        name: 'idx_tenant_hierarchies_ancestor',
    });
    await queryInterface.addIndex('tenant_hierarchies', ['descendantId'], {
        name: 'idx_tenant_hierarchies_descendant',
    });
    await queryInterface.addIndex('tenant_hierarchies', ['ancestorId', 'descendantId'], {
        name: 'idx_tenant_hierarchies_pair',
        unique: true,
    });
    await queryInterface.addIndex('tenant_hierarchies', ['depth'], {
        name: 'idx_tenant_hierarchies_depth',
    });
};
exports.createTenantHierarchyTable = createTenantHierarchyTable;
// ============================================================================
// TENANT CRUD OPERATIONS
// ============================================================================
/**
 * Provisions a new tenant with complete setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} tenantData - Tenant creation data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created tenant instance
 *
 * @example
 * ```typescript
 * const tenant = await provisionTenant(sequelize, {
 *   name: 'Acme Hospital',
 *   slug: 'acme-hospital',
 *   tier: TenantTier.ENTERPRISE,
 *   isolationStrategy: IsolationStrategy.SCHEMA,
 * });
 * ```
 */
const provisionTenant = async (sequelize, tenantData, transaction) => {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.create({
        ...tenantData,
        status: TenantStatus.PROVISIONING,
        tier: tenantData.tier || TenantTier.FREE,
        isolationStrategy: tenantData.isolationStrategy || IsolationStrategy.ROW_LEVEL,
        config: tenantData.config || {},
        quota: tenantData.quota || {},
        usage: {
            currentUsers: 0,
            currentStorage: 0,
            currentApiCalls: 0,
            currentDatabases: 0,
            currentRecords: 0,
        },
    }, { transaction });
    // Set up schema if using schema isolation
    if (tenantData.isolationStrategy === IsolationStrategy.SCHEMA) {
        const schemaName = `tenant_${tenant.slug}`;
        await sequelize.getQueryInterface().createSchema(schemaName, { transaction });
        await tenant.update({ schemaName }, { transaction });
    }
    // Mark as provisioned
    await tenant.update({
        status: TenantStatus.ACTIVE,
        provisionedAt: new Date(),
    }, { transaction });
    return tenant;
};
exports.provisionTenant = provisionTenant;
/**
 * Retrieves tenant by ID with optional hierarchy data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} options - Retrieval options
 * @returns {Promise<any>} Tenant instance
 */
const getTenantById = async (sequelize, tenantId, options = {}) => {
    const Tenant = sequelize.models.Tenant;
    const include = [];
    if (options.includeParent) {
        include.push({
            model: Tenant,
            as: 'parent',
            required: false,
        });
    }
    if (options.includeChildren) {
        include.push({
            model: Tenant,
            as: 'children',
            required: false,
        });
    }
    const tenant = await Tenant.findByPk(tenantId, { include });
    return tenant;
};
exports.getTenantById = getTenantById;
/**
 * Retrieves tenant by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Tenant slug
 * @returns {Promise<any>} Tenant instance
 */
const getTenantBySlug = async (sequelize, slug) => {
    const Tenant = sequelize.models.Tenant;
    return await Tenant.findOne({ where: { slug } });
};
exports.getTenantBySlug = getTenantBySlug;
/**
 * Updates tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
const updateTenantConfig = async (sequelize, tenantId, config, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const currentConfig = tenant.config || {};
    const mergedConfig = {
        ...currentConfig,
        ...config,
        features: { ...currentConfig.features, ...config.features },
        customization: { ...currentConfig.customization, ...config.customization },
    };
    await tenant.update({ config: mergedConfig }, { transaction });
    return tenant;
};
exports.updateTenantConfig = updateTenantConfig;
/**
 * Suspends a tenant and logs the suspension.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} reason - Suspension reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Suspended tenant
 */
const suspendTenant = async (sequelize, tenantId, reason, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    await tenant.update({
        status: TenantStatus.SUSPENDED,
        suspendedAt: new Date(),
        metadata: {
            ...tenant.metadata,
            suspensionReason: reason,
        },
    }, { transaction });
    return tenant;
};
exports.suspendTenant = suspendTenant;
/**
 * Reactivates a suspended tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Reactivated tenant
 */
const reactivateTenant = async (sequelize, tenantId, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    await tenant.update({
        status: TenantStatus.ACTIVE,
        suspendedAt: null,
    }, { transaction });
    return tenant;
};
exports.reactivateTenant = reactivateTenant;
/**
 * Archives a tenant (soft delete with deprovisioning).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Archived tenant
 */
const archiveTenant = async (sequelize, tenantId, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    await tenant.update({
        status: TenantStatus.ARCHIVED,
        archivedAt: new Date(),
        deletedAt: new Date(),
    }, { transaction });
    return tenant;
};
exports.archiveTenant = archiveTenant;
// ============================================================================
// TENANT ISOLATION AND SCOPING
// ============================================================================
/**
 * Creates a tenant-scoped Sequelize query.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantScopeContext} context - Tenant scope context
 * @param {FindOptions} baseOptions - Base query options
 * @returns {FindOptions} Scoped query options
 *
 * @example
 * ```typescript
 * const scopedOptions = createTenantScopedQuery(sequelize, {
 *   tenantId: 'tenant-123',
 *   isolationStrategy: IsolationStrategy.ROW_LEVEL,
 * }, { where: { status: 'active' } });
 * ```
 */
const createTenantScopedQuery = (sequelize, context, baseOptions = {}) => {
    const scopedOptions = { ...baseOptions };
    if (context.isolationStrategy === IsolationStrategy.ROW_LEVEL) {
        scopedOptions.where = {
            ...(baseOptions.where || {}),
            tenantId: context.tenantId,
        };
    }
    else if (context.isolationStrategy === IsolationStrategy.SCHEMA && context.schemaName) {
        // Schema isolation handled at connection level
        scopedOptions.schema = context.schemaName;
    }
    return scopedOptions;
};
exports.createTenantScopedQuery = createTenantScopedQuery;
/**
 * Applies tenant isolation to a model instance.
 *
 * @param {any} model - Model instance
 * @param {string} tenantId - Tenant ID
 * @returns {any} Model with tenant isolation
 */
const applyTenantIsolation = (model, tenantId) => {
    model.addScope('tenant', {
        where: { tenantId },
    });
    model.addHook('beforeCreate', (instance) => {
        if (!instance.tenantId) {
            instance.tenantId = tenantId;
        }
    });
    return model;
};
exports.applyTenantIsolation = applyTenantIsolation;
/**
 * Validates tenant access for a user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if user has access
 */
const validateTenantAccess = async (sequelize, userId, tenantId) => {
    const UserTenant = sequelize.models.UserTenant;
    if (!UserTenant) {
        // Fallback: check if user record exists with tenantId
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
 * Creates tenant-isolated database connection.
 *
 * @param {Sequelize} sequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
const createTenantConnection = async (sequelize, tenantId, strategy) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    if (strategy === IsolationStrategy.DATABASE) {
        const dbName = tenant.databaseName;
        return new sequelize_1.Sequelize(dbName, sequelize.config.username, sequelize.config.password, {
            ...sequelize.config,
            database: dbName,
        });
    }
    else if (strategy === IsolationStrategy.SCHEMA) {
        const schemaName = tenant.schemaName;
        const connection = sequelize.clone();
        await connection.getQueryInterface().createSchema(schemaName, {});
        return connection;
    }
    return sequelize;
};
exports.createTenantConnection = createTenantConnection;
/**
 * Enforces tenant data isolation in bulk operations.
 *
 * @param {any} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @param {WhereOptions} where - Where clause
 * @returns {WhereOptions} Tenant-scoped where clause
 */
const enforceTenantIsolationInBulk = (model, tenantId, where = {}) => {
    return {
        ...where,
        tenantId,
    };
};
exports.enforceTenantIsolationInBulk = enforceTenantIsolationInBulk;
/**
 * Retrieves all accessible tenants for a user (including hierarchy).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of accessible tenant IDs
 */
const getAccessibleTenantsForUser = async (sequelize, userId) => {
    const UserTenant = sequelize.models.UserTenant;
    if (!UserTenant) {
        return [];
    }
    const userTenants = await UserTenant.findAll({
        where: { userId, status: 'active' },
        attributes: ['tenantId'],
    });
    return userTenants.map((ut) => ut.tenantId);
};
exports.getAccessibleTenantsForUser = getAccessibleTenantsForUser;
/**
 * Checks if cross-tenant access is allowed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<boolean>} True if cross-tenant access allowed
 */
const isCrossTenantAccessAllowed = async (sequelize, sourceTenantId, targetTenantId) => {
    // Check if tenants are in same hierarchy
    const TenantHierarchy = sequelize.models.TenantHierarchy;
    if (!TenantHierarchy) {
        return false;
    }
    const relation = await TenantHierarchy.findOne({
        where: {
            ancestorId: sourceTenantId,
            descendantId: targetTenantId,
        },
    });
    return !!relation;
};
exports.isCrossTenantAccessAllowed = isCrossTenantAccessAllowed;
/**
 * Applies row-level security policy for tenant isolation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumnName - Tenant column name
 * @returns {Promise<void>}
 */
const applyRowLevelSecurityPolicy = async (queryInterface, tableName, tenantColumnName = 'tenantId') => {
    // PostgreSQL Row-Level Security
    await queryInterface.sequelize.query(`
    ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_policy ON "${tableName}"
    USING (${tenantColumnName} = current_setting('app.current_tenant')::uuid);
  `);
};
exports.applyRowLevelSecurityPolicy = applyRowLevelSecurityPolicy;
// ============================================================================
// TENANT HIERARCHIES
// ============================================================================
/**
 * Creates parent-child relationship between tenants.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} parentId - Parent tenant ID
 * @param {string} childId - Child tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const createTenantHierarchy = async (sequelize, parentId, childId, transaction) => {
    const TenantHierarchy = sequelize.models.TenantHierarchy;
    // Create self-reference for child
    await TenantHierarchy.create({
        ancestorId: childId,
        descendantId: childId,
        depth: 0,
        path: [childId],
    }, { transaction });
    // Get all ancestors of parent
    const parentAncestors = await TenantHierarchy.findAll({
        where: { descendantId: parentId },
        transaction,
    });
    // Create relationships for all ancestors to new child
    for (const ancestor of parentAncestors) {
        await TenantHierarchy.create({
            ancestorId: ancestor.ancestorId,
            descendantId: childId,
            depth: ancestor.depth + 1,
            path: [...ancestor.path, childId],
        }, { transaction });
    }
    // Update child's parentTenantId
    await sequelize.models.Tenant.update({ parentTenantId: parentId }, { where: { id: childId }, transaction });
};
exports.createTenantHierarchy = createTenantHierarchy;
/**
 * Retrieves all children of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Parent tenant ID
 * @param {number} maxDepth - Maximum depth to retrieve
 * @returns {Promise<any[]>} Array of child tenants
 */
const getTenantChildren = async (sequelize, tenantId, maxDepth) => {
    const TenantHierarchy = sequelize.models.TenantHierarchy;
    const Tenant = sequelize.models.Tenant;
    const where = {
        ancestorId: tenantId,
        depth: { [sequelize_1.Op.gt]: 0 },
    };
    if (maxDepth !== undefined) {
        where.depth = { [sequelize_1.Op.lte]: maxDepth };
    }
    const hierarchies = await TenantHierarchy.findAll({
        where,
        include: [
            {
                model: Tenant,
                as: 'descendant',
            },
        ],
    });
    return hierarchies.map((h) => h.descendant);
};
exports.getTenantChildren = getTenantChildren;
/**
 * Retrieves all ancestors of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Child tenant ID
 * @returns {Promise<any[]>} Array of ancestor tenants
 */
const getTenantAncestors = async (sequelize, tenantId) => {
    const TenantHierarchy = sequelize.models.TenantHierarchy;
    const Tenant = sequelize.models.Tenant;
    const hierarchies = await TenantHierarchy.findAll({
        where: {
            descendantId: tenantId,
            depth: { [sequelize_1.Op.gt]: 0 },
        },
        include: [
            {
                model: Tenant,
                as: 'ancestor',
            },
        ],
        order: [['depth', 'DESC']],
    });
    return hierarchies.map((h) => h.ancestor);
};
exports.getTenantAncestors = getTenantAncestors;
/**
 * Retrieves the full hierarchy tree for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Root tenant ID
 * @returns {Promise<any>} Hierarchical tree structure
 */
const getTenantHierarchyTree = async (sequelize, tenantId) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const children = await (0, exports.getTenantChildren)(sequelize, tenantId, 1);
    const tree = {
        ...tenant.toJSON(),
        children: [],
    };
    for (const child of children) {
        tree.children.push(await (0, exports.getTenantHierarchyTree)(sequelize, child.id));
    }
    return tree;
};
exports.getTenantHierarchyTree = getTenantHierarchyTree;
/**
 * Moves a tenant to a different parent in hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant to move
 * @param {string} newParentId - New parent tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
const moveTenantInHierarchy = async (sequelize, tenantId, newParentId, transaction) => {
    const TenantHierarchy = sequelize.models.TenantHierarchy;
    // Remove existing hierarchy relationships (except self)
    await TenantHierarchy.destroy({
        where: {
            descendantId: tenantId,
            depth: { [sequelize_1.Op.gt]: 0 },
        },
        transaction,
    });
    // Create new hierarchy
    await (0, exports.createTenantHierarchy)(sequelize, newParentId, tenantId, transaction);
};
exports.moveTenantInHierarchy = moveTenantInHierarchy;
// ============================================================================
// TENANT QUOTAS AND LIMITS
// ============================================================================
/**
 * Sets quota limits for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantQuota} quota - Quota configuration
 * @param {string} changedBy - User ID making the change
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
const setTenantQuota = async (sequelize, tenantId, quota, changedBy, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const previousQuota = tenant.quota;
    // Log quota changes
    const QuotaHistory = sequelize.models.TenantQuotaHistory;
    if (QuotaHistory) {
        for (const [quotaType, newLimit] of Object.entries(quota)) {
            const previousLimit = previousQuota[quotaType];
            if (previousLimit !== newLimit) {
                await QuotaHistory.create({
                    tenantId,
                    quotaType,
                    previousLimit,
                    newLimit,
                    changedBy,
                }, { transaction });
            }
        }
    }
    await tenant.update({
        quota: {
            ...previousQuota,
            ...quota,
        },
    }, { transaction });
    return tenant;
};
exports.setTenantQuota = setTenantQuota;
/**
 * Checks if tenant has exceeded quota.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} quotaType - Type of quota to check
 * @returns {Promise<boolean>} True if quota exceeded
 */
const isTenantQuotaExceeded = async (sequelize, tenantId, quotaType) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const quota = tenant.quota;
    const usage = tenant.usage;
    const limit = quota[quotaType] || quota.customLimits?.[quotaType];
    const current = usage[quotaType] || usage.customUsage?.[quotaType];
    if (limit === undefined || limit === null) {
        return false; // No limit set
    }
    return current >= limit;
};
exports.isTenantQuotaExceeded = isTenantQuotaExceeded;
/**
 * Updates tenant usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantUsage>} usage - Usage updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
const updateTenantUsage = async (sequelize, tenantId, usage, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const currentUsage = tenant.usage;
    await tenant.update({
        usage: {
            ...currentUsage,
            ...usage,
        },
    }, { transaction });
    return tenant;
};
exports.updateTenantUsage = updateTenantUsage;
/**
 * Increments tenant usage counter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} usageType - Type of usage
 * @param {number} increment - Amount to increment (default: 1)
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
const incrementTenantUsage = async (sequelize, tenantId, usageType, increment = 1, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const currentUsage = tenant.usage;
    const currentValue = currentUsage[usageType] || currentUsage.customUsage?.[usageType] || 0;
    const updatedUsage = {
        ...currentUsage,
        [usageType]: currentValue + increment,
    };
    await tenant.update({ usage: updatedUsage }, { transaction });
    // Check if quota exceeded
    const exceeded = await (0, exports.isTenantQuotaExceeded)(sequelize, tenantId, usageType);
    if (exceeded) {
        throw new Error(`Tenant ${tenantId} has exceeded quota for ${usageType}`);
    }
    return tenant;
};
exports.incrementTenantUsage = incrementTenantUsage;
/**
 * Retrieves quota usage report for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Quota usage report
 */
const getTenantQuotaReport = async (sequelize, tenantId) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const quota = tenant.quota;
    const usage = tenant.usage;
    const report = {
        tenantId,
        quotas: [],
        warnings: [],
    };
    for (const [quotaType, limit] of Object.entries(quota)) {
        if (quotaType === 'customLimits')
            continue;
        const current = usage[quotaType] || 0;
        const percentage = limit ? (current / limit) * 100 : 0;
        report.quotas.push({
            type: quotaType,
            limit,
            current,
            percentage: percentage.toFixed(2),
            exceeded: current >= limit,
        });
        if (percentage >= 90) {
            report.warnings.push({
                type: quotaType,
                message: `${quotaType} is at ${percentage.toFixed(2)}% of quota`,
            });
        }
    }
    return report;
};
exports.getTenantQuotaReport = getTenantQuotaReport;
// ============================================================================
// CROSS-TENANT OPERATIONS
// ============================================================================
/**
 * Executes a cross-tenant query with authorization check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CrossTenantRequest} request - Cross-tenant request
 * @param {Function} operation - Operation to execute
 * @returns {Promise<any>} Operation result
 */
const executeCrossTenantOperation = async (sequelize, request, operation) => {
    if (!request.authorized) {
        throw new Error('Cross-tenant operation not authorized');
    }
    // Verify source tenant has access to all target tenants
    for (const targetId of request.targetTenantIds) {
        const allowed = await (0, exports.isCrossTenantAccessAllowed)(sequelize, request.sourceTenantId, targetId);
        if (!allowed) {
            throw new Error(`Cross-tenant access denied from ${request.sourceTenantId} to ${targetId}`);
        }
    }
    // Execute operation
    const result = await operation(request.targetTenantIds);
    // Audit trail
    if (request.auditTrail) {
        const AuditLog = sequelize.models.AuditLog;
        if (AuditLog) {
            await AuditLog.create({
                tenantId: request.sourceTenantId,
                action: 'cross_tenant_operation',
                operation: request.operation,
                targetTenants: request.targetTenantIds,
                timestamp: new Date(),
            });
        }
    }
    return result;
};
exports.executeCrossTenantOperation = executeCrossTenantOperation;
/**
 * Aggregates data across multiple tenants.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tenantIds - Array of tenant IDs
 * @param {string} modelName - Model to aggregate
 * @param {any} aggregation - Aggregation configuration
 * @returns {Promise<any>} Aggregated results
 */
const aggregateCrossTenantData = async (sequelize, tenantIds, modelName, aggregation) => {
    const Model = sequelize.models[modelName];
    if (!Model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const attributes = aggregation.groupBy || [];
    for (const metric of aggregation.metrics) {
        attributes.push([(0, sequelize_1.fn)(metric.operation.toUpperCase(), (0, sequelize_1.col)(metric.field)), metric.field]);
    }
    const results = await Model.findAll({
        where: {
            tenantId: { [sequelize_1.Op.in]: tenantIds },
            ...(aggregation.where || {}),
        },
        attributes,
        group: aggregation.groupBy,
        raw: true,
    });
    return results;
};
exports.aggregateCrossTenantData = aggregateCrossTenantData;
/**
 * Replicates data from one tenant to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @param {string} modelName - Model to replicate
 * @param {WhereOptions} where - Filter for records to replicate
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records replicated
 */
const replicateTenantData = async (sequelize, sourceTenantId, targetTenantId, modelName, where = {}, transaction) => {
    const Model = sequelize.models[modelName];
    if (!Model) {
        throw new Error(`Model ${modelName} not found`);
    }
    const sourceRecords = await Model.findAll({
        where: {
            tenantId: sourceTenantId,
            ...where,
        },
        transaction,
    });
    let replicatedCount = 0;
    for (const record of sourceRecords) {
        const data = record.toJSON();
        delete data.id;
        delete data.createdAt;
        delete data.updatedAt;
        await Model.create({
            ...data,
            tenantId: targetTenantId,
        }, { transaction });
        replicatedCount++;
    }
    return replicatedCount;
};
exports.replicateTenantData = replicateTenantData;
// ============================================================================
// TENANT DATA MIGRATION
// ============================================================================
/**
 * Migrates tenant from one tier to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantTier} toTier - Target tier
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Migration result
 */
const migrateTenantTier = async (sequelize, tenantId, toTier, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const fromTier = tenant.tier;
    // Update tenant tier
    await tenant.update({ tier: toTier }, { transaction });
    // Update quotas based on tier
    const tierQuotas = {
        [TenantTier.FREE]: {
            maxUsers: 5,
            maxStorage: 1024 * 1024 * 1024, // 1 GB
            maxApiCalls: 1000,
        },
        [TenantTier.BASIC]: {
            maxUsers: 25,
            maxStorage: 10 * 1024 * 1024 * 1024, // 10 GB
            maxApiCalls: 10000,
        },
        [TenantTier.PROFESSIONAL]: {
            maxUsers: 100,
            maxStorage: 100 * 1024 * 1024 * 1024, // 100 GB
            maxApiCalls: 100000,
        },
        [TenantTier.ENTERPRISE]: {
            maxUsers: -1, // Unlimited
            maxStorage: -1,
            maxApiCalls: -1,
        },
        [TenantTier.CUSTOM]: {},
    };
    if (toTier !== TenantTier.CUSTOM) {
        await (0, exports.setTenantQuota)(sequelize, tenantId, tierQuotas[toTier], 'system', transaction);
    }
    return {
        tenantId,
        fromTier,
        toTier,
        migratedAt: new Date(),
    };
};
exports.migrateTenantTier = migrateTenantTier;
/**
 * Migrates tenant data to a different isolation strategy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} toStrategy - Target isolation strategy
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Migration result
 */
const migrateTenantIsolationStrategy = async (sequelize, tenantId, toStrategy, transaction) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const fromStrategy = tenant.isolationStrategy;
    if (fromStrategy === toStrategy) {
        return { message: 'No migration needed', tenantId, strategy: toStrategy };
    }
    // Create new schema/database if needed
    if (toStrategy === IsolationStrategy.SCHEMA) {
        const schemaName = `tenant_${tenant.slug}`;
        await sequelize.getQueryInterface().createSchema(schemaName, { transaction });
        await tenant.update({ schemaName, isolationStrategy: toStrategy }, { transaction });
    }
    else if (toStrategy === IsolationStrategy.DATABASE) {
        const dbName = `tenant_${tenant.slug}`;
        // Database creation would be handled externally
        await tenant.update({ databaseName: dbName, isolationStrategy: toStrategy }, { transaction });
    }
    else if (toStrategy === IsolationStrategy.ROW_LEVEL) {
        await tenant.update({ isolationStrategy: toStrategy }, { transaction });
    }
    return {
        tenantId,
        fromStrategy,
        toStrategy,
        migratedAt: new Date(),
    };
};
exports.migrateTenantIsolationStrategy = migrateTenantIsolationStrategy;
/**
 * Exports tenant data for migration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} modelNames - Models to export
 * @returns {Promise<any>} Exported data
 */
const exportTenantData = async (sequelize, tenantId, modelNames) => {
    const exportData = {
        tenantId,
        exportedAt: new Date(),
        models: {},
    };
    for (const modelName of modelNames) {
        const Model = sequelize.models[modelName];
        if (!Model)
            continue;
        const records = await Model.findAll({
            where: { tenantId },
            raw: true,
        });
        exportData.models[modelName] = records;
    }
    return exportData;
};
exports.exportTenantData = exportTenantData;
/**
 * Imports tenant data from export.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Target tenant ID
 * @param {any} exportData - Exported data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records imported
 */
const importTenantData = async (sequelize, tenantId, exportData, transaction) => {
    let importedCount = 0;
    for (const [modelName, records] of Object.entries(exportData.models)) {
        const Model = sequelize.models[modelName];
        if (!Model)
            continue;
        for (const record of records) {
            delete record.id;
            delete record.createdAt;
            delete record.updatedAt;
            await Model.create({
                ...record,
                tenantId,
            }, { transaction });
            importedCount++;
        }
    }
    return importedCount;
};
exports.importTenantData = importTenantData;
// ============================================================================
// TENANT ANALYTICS
// ============================================================================
/**
 * Generates tenant usage analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} period - Time period for analytics
 * @returns {Promise<TenantAnalytics>} Analytics data
 */
const generateTenantAnalytics = async (sequelize, tenantId, period) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const analytics = {
        tenantId,
        metrics: {},
        trends: {},
        alerts: [],
        recommendations: [],
    };
    // Calculate metrics
    const usage = tenant.usage;
    const quota = tenant.quota;
    analytics.metrics = {
        userCount: usage.currentUsers,
        storageUsed: usage.currentStorage,
        apiCalls: usage.currentApiCalls,
        quotaUtilization: Object.keys(quota).reduce((acc, key) => {
            const limit = quota[key];
            const current = usage[key] || 0;
            acc[key] = limit ? (current / limit) * 100 : 0;
            return acc;
        }, {}),
    };
    // Generate alerts
    for (const [quotaType, percentage] of Object.entries(analytics.metrics.quotaUtilization || {})) {
        if (percentage >= 90) {
            analytics.alerts.push({
                type: 'quota_warning',
                message: `${quotaType} usage is at ${percentage.toFixed(2)}%`,
                severity: percentage >= 95 ? 'critical' : 'warning',
            });
        }
    }
    // Generate recommendations
    if (analytics.metrics.quotaUtilization && Object.values(analytics.metrics.quotaUtilization).some((p) => p > 80)) {
        analytics.recommendations.push('Consider upgrading to a higher tier');
    }
    return analytics;
};
exports.generateTenantAnalytics = generateTenantAnalytics;
/**
 * Retrieves tenant activity summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<any>} Activity summary
 */
const getTenantActivitySummary = async (sequelize, tenantId, days = 30) => {
    const AuditLog = sequelize.models.AuditLog;
    if (!AuditLog) {
        return { message: 'Audit logging not enabled' };
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const activities = await AuditLog.findAll({
        where: {
            tenantId,
            createdAt: { [sequelize_1.Op.gte]: startDate },
        },
        attributes: [
            'action',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count'],
            [(0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('createdAt')), 'date'],
        ],
        group: ['action', (0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('createdAt'))],
        raw: true,
    });
    return activities;
};
exports.getTenantActivitySummary = getTenantActivitySummary;
/**
 * Lists all tenants with filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Paginated tenant list
 */
const listTenants = async (sequelize, filters = {}, pagination = {}) => {
    const Tenant = sequelize.models.Tenant;
    const where = {};
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.tier) {
        where.tier = filters.tier;
    }
    if (filters.search) {
        where[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
            { slug: { [sequelize_1.Op.iLike]: `%${filters.search}%` } },
        ];
    }
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;
    const { rows, count } = await Tenant.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
    });
    return {
        tenants: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};
exports.listTenants = listTenants;
/**
 * Generates tenant health score.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Health score and details
 */
const getTenantHealthScore = async (sequelize, tenantId) => {
    const tenant = await sequelize.models.Tenant.findByPk(tenantId);
    if (!tenant) {
        throw new Error(`Tenant ${tenantId} not found`);
    }
    const usage = tenant.usage;
    const quota = tenant.quota;
    const status = tenant.status;
    let score = 100;
    const issues = [];
    // Deduct points for quota issues
    for (const [quotaType, limit] of Object.entries(quota)) {
        if (typeof limit !== 'number')
            continue;
        const current = usage[quotaType] || 0;
        const percentage = (current / limit) * 100;
        if (percentage >= 95) {
            score -= 20;
            issues.push(`${quotaType} critically high (${percentage.toFixed(2)}%)`);
        }
        else if (percentage >= 80) {
            score -= 10;
            issues.push(`${quotaType} high (${percentage.toFixed(2)}%)`);
        }
    }
    // Deduct points for status
    if (status === TenantStatus.SUSPENDED) {
        score -= 50;
        issues.push('Tenant is suspended');
    }
    else if (status === TenantStatus.PROVISIONING) {
        score -= 20;
        issues.push('Tenant is still provisioning');
    }
    return {
        tenantId,
        score: Math.max(0, score),
        status: score >= 80 ? 'healthy' : score >= 60 ? 'warning' : 'critical',
        issues,
    };
};
exports.getTenantHealthScore = getTenantHealthScore;
//# sourceMappingURL=iam-tenant-kit.js.map