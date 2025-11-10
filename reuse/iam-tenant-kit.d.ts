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
import { Sequelize, ModelAttributes, QueryInterface, Transaction, WhereOptions, FindOptions } from 'sequelize';
/**
 * Tenant status enumeration
 */
export declare enum TenantStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    PROVISIONING = "provisioning",
    DEPROVISIONING = "deprovisioning",
    ARCHIVED = "archived"
}
/**
 * Tenant tier for pricing/features
 */
export declare enum TenantTier {
    FREE = "free",
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise",
    CUSTOM = "custom"
}
/**
 * Isolation strategy
 */
export declare enum IsolationStrategy {
    SCHEMA = "schema",
    DATABASE = "database",
    ROW_LEVEL = "row_level",
    HYBRID = "hybrid"
}
/**
 * Tenant configuration interface
 */
export interface TenantConfig {
    features?: Record<string, boolean>;
    customization?: Record<string, any>;
    branding?: {
        logo?: string;
        primaryColor?: string;
        secondaryColor?: string;
    };
    notifications?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
    };
    security?: {
        mfaRequired?: boolean;
        passwordPolicy?: Record<string, any>;
        sessionTimeout?: number;
    };
}
/**
 * Tenant quota configuration
 */
export interface TenantQuota {
    maxUsers?: number;
    maxStorage?: number;
    maxApiCalls?: number;
    maxDatabases?: number;
    maxRecords?: number;
    customLimits?: Record<string, number>;
}
/**
 * Tenant usage metrics
 */
export interface TenantUsage {
    currentUsers: number;
    currentStorage: number;
    currentApiCalls: number;
    currentDatabases: number;
    currentRecords: number;
    customUsage?: Record<string, number>;
}
/**
 * Tenant hierarchy relationship
 */
export interface TenantHierarchyRelation {
    parentId: string;
    childId: string;
    depth: number;
    path: string[];
}
/**
 * Tenant scope context for queries
 */
export interface TenantScopeContext {
    tenantId: string;
    isolationStrategy: IsolationStrategy;
    schemaName?: string;
    databaseName?: string;
    includeChildren?: boolean;
}
/**
 * Tenant migration tracking
 */
export interface TenantMigrationRecord {
    tenantId: string;
    fromTier?: string;
    toTier?: string;
    fromSchema?: string;
    toSchema?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
    startedAt: Date;
    completedAt?: Date;
    errorMessage?: string;
}
/**
 * Cross-tenant operation request
 */
export interface CrossTenantRequest {
    sourceTenantId: string;
    targetTenantIds: string[];
    operation: string;
    authorized: boolean;
    auditTrail?: boolean;
}
/**
 * Tenant analytics result
 */
export interface TenantAnalytics {
    tenantId: string;
    metrics: Record<string, number>;
    trends: Record<string, number[]>;
    alerts: Array<{
        type: string;
        message: string;
        severity: string;
    }>;
    recommendations: string[];
}
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
export declare const getTenantModelAttributes: (sequelize: Sequelize) => ModelAttributes;
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
export declare const getTenantHierarchyModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * Defines TenantQuotaHistory model for quota tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantQuotaHistory model attributes
 */
export declare const getTenantQuotaHistoryModelAttributes: (sequelize: Sequelize) => ModelAttributes;
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
export declare const createTenantTable: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
/**
 * Creates TenantHierarchy table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export declare const createTenantHierarchyTable: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
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
export declare const provisionTenant: (sequelize: Sequelize, tenantData: {
    name: string;
    slug: string;
    tier?: TenantTier;
    isolationStrategy?: IsolationStrategy;
    config?: TenantConfig;
    quota?: TenantQuota;
    parentTenantId?: string;
}, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves tenant by ID with optional hierarchy data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} options - Retrieval options
 * @returns {Promise<any>} Tenant instance
 */
export declare const getTenantById: (sequelize: Sequelize, tenantId: string, options?: {
    includeParent?: boolean;
    includeChildren?: boolean;
    includeAncestors?: boolean;
    includeDescendants?: boolean;
}) => Promise<any>;
/**
 * Retrieves tenant by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Tenant slug
 * @returns {Promise<any>} Tenant instance
 */
export declare const getTenantBySlug: (sequelize: Sequelize, slug: string) => Promise<any>;
/**
 * Updates tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
export declare const updateTenantConfig: (sequelize: Sequelize, tenantId: string, config: Partial<TenantConfig>, transaction?: Transaction) => Promise<any>;
/**
 * Suspends a tenant and logs the suspension.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} reason - Suspension reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Suspended tenant
 */
export declare const suspendTenant: (sequelize: Sequelize, tenantId: string, reason: string, transaction?: Transaction) => Promise<any>;
/**
 * Reactivates a suspended tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Reactivated tenant
 */
export declare const reactivateTenant: (sequelize: Sequelize, tenantId: string, transaction?: Transaction) => Promise<any>;
/**
 * Archives a tenant (soft delete with deprovisioning).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Archived tenant
 */
export declare const archiveTenant: (sequelize: Sequelize, tenantId: string, transaction?: Transaction) => Promise<any>;
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
export declare const createTenantScopedQuery: (sequelize: Sequelize, context: TenantScopeContext, baseOptions?: FindOptions) => FindOptions;
/**
 * Applies tenant isolation to a model instance.
 *
 * @param {any} model - Model instance
 * @param {string} tenantId - Tenant ID
 * @returns {any} Model with tenant isolation
 */
export declare const applyTenantIsolation: (model: any, tenantId: string) => any;
/**
 * Validates tenant access for a user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if user has access
 */
export declare const validateTenantAccess: (sequelize: Sequelize, userId: string, tenantId: string) => Promise<boolean>;
/**
 * Creates tenant-isolated database connection.
 *
 * @param {Sequelize} sequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
export declare const createTenantConnection: (sequelize: Sequelize, tenantId: string, strategy: IsolationStrategy) => Promise<Sequelize>;
/**
 * Enforces tenant data isolation in bulk operations.
 *
 * @param {any} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @param {WhereOptions} where - Where clause
 * @returns {WhereOptions} Tenant-scoped where clause
 */
export declare const enforceTenantIsolationInBulk: (model: any, tenantId: string, where?: WhereOptions) => WhereOptions;
/**
 * Retrieves all accessible tenants for a user (including hierarchy).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of accessible tenant IDs
 */
export declare const getAccessibleTenantsForUser: (sequelize: Sequelize, userId: string) => Promise<string[]>;
/**
 * Checks if cross-tenant access is allowed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<boolean>} True if cross-tenant access allowed
 */
export declare const isCrossTenantAccessAllowed: (sequelize: Sequelize, sourceTenantId: string, targetTenantId: string) => Promise<boolean>;
/**
 * Applies row-level security policy for tenant isolation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumnName - Tenant column name
 * @returns {Promise<void>}
 */
export declare const applyRowLevelSecurityPolicy: (queryInterface: QueryInterface, tableName: string, tenantColumnName?: string) => Promise<void>;
/**
 * Creates parent-child relationship between tenants.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} parentId - Parent tenant ID
 * @param {string} childId - Child tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const createTenantHierarchy: (sequelize: Sequelize, parentId: string, childId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves all children of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Parent tenant ID
 * @param {number} maxDepth - Maximum depth to retrieve
 * @returns {Promise<any[]>} Array of child tenants
 */
export declare const getTenantChildren: (sequelize: Sequelize, tenantId: string, maxDepth?: number) => Promise<any[]>;
/**
 * Retrieves all ancestors of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Child tenant ID
 * @returns {Promise<any[]>} Array of ancestor tenants
 */
export declare const getTenantAncestors: (sequelize: Sequelize, tenantId: string) => Promise<any[]>;
/**
 * Retrieves the full hierarchy tree for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Root tenant ID
 * @returns {Promise<any>} Hierarchical tree structure
 */
export declare const getTenantHierarchyTree: (sequelize: Sequelize, tenantId: string) => Promise<any>;
/**
 * Moves a tenant to a different parent in hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant to move
 * @param {string} newParentId - New parent tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const moveTenantInHierarchy: (sequelize: Sequelize, tenantId: string, newParentId: string, transaction?: Transaction) => Promise<void>;
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
export declare const setTenantQuota: (sequelize: Sequelize, tenantId: string, quota: TenantQuota, changedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Checks if tenant has exceeded quota.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} quotaType - Type of quota to check
 * @returns {Promise<boolean>} True if quota exceeded
 */
export declare const isTenantQuotaExceeded: (sequelize: Sequelize, tenantId: string, quotaType: string) => Promise<boolean>;
/**
 * Updates tenant usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantUsage>} usage - Usage updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
export declare const updateTenantUsage: (sequelize: Sequelize, tenantId: string, usage: Partial<TenantUsage>, transaction?: Transaction) => Promise<any>;
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
export declare const incrementTenantUsage: (sequelize: Sequelize, tenantId: string, usageType: string, increment?: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves quota usage report for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Quota usage report
 */
export declare const getTenantQuotaReport: (sequelize: Sequelize, tenantId: string) => Promise<any>;
/**
 * Executes a cross-tenant query with authorization check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CrossTenantRequest} request - Cross-tenant request
 * @param {Function} operation - Operation to execute
 * @returns {Promise<any>} Operation result
 */
export declare const executeCrossTenantOperation: (sequelize: Sequelize, request: CrossTenantRequest, operation: (tenantIds: string[]) => Promise<any>) => Promise<any>;
/**
 * Aggregates data across multiple tenants.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tenantIds - Array of tenant IDs
 * @param {string} modelName - Model to aggregate
 * @param {any} aggregation - Aggregation configuration
 * @returns {Promise<any>} Aggregated results
 */
export declare const aggregateCrossTenantData: (sequelize: Sequelize, tenantIds: string[], modelName: string, aggregation: {
    groupBy?: string[];
    metrics: {
        field: string;
        operation: "count" | "sum" | "avg" | "min" | "max";
    }[];
    where?: WhereOptions;
}) => Promise<any>;
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
export declare const replicateTenantData: (sequelize: Sequelize, sourceTenantId: string, targetTenantId: string, modelName: string, where?: WhereOptions, transaction?: Transaction) => Promise<number>;
/**
 * Migrates tenant from one tier to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantTier} toTier - Target tier
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Migration result
 */
export declare const migrateTenantTier: (sequelize: Sequelize, tenantId: string, toTier: TenantTier, transaction?: Transaction) => Promise<any>;
/**
 * Migrates tenant data to a different isolation strategy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} toStrategy - Target isolation strategy
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Migration result
 */
export declare const migrateTenantIsolationStrategy: (sequelize: Sequelize, tenantId: string, toStrategy: IsolationStrategy, transaction?: Transaction) => Promise<any>;
/**
 * Exports tenant data for migration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} modelNames - Models to export
 * @returns {Promise<any>} Exported data
 */
export declare const exportTenantData: (sequelize: Sequelize, tenantId: string, modelNames: string[]) => Promise<any>;
/**
 * Imports tenant data from export.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Target tenant ID
 * @param {any} exportData - Exported data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records imported
 */
export declare const importTenantData: (sequelize: Sequelize, tenantId: string, exportData: any, transaction?: Transaction) => Promise<number>;
/**
 * Generates tenant usage analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} period - Time period for analytics
 * @returns {Promise<TenantAnalytics>} Analytics data
 */
export declare const generateTenantAnalytics: (sequelize: Sequelize, tenantId: string, period: {
    startDate: Date;
    endDate: Date;
}) => Promise<TenantAnalytics>;
/**
 * Retrieves tenant activity summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<any>} Activity summary
 */
export declare const getTenantActivitySummary: (sequelize: Sequelize, tenantId: string, days?: number) => Promise<any>;
/**
 * Lists all tenants with filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Paginated tenant list
 */
export declare const listTenants: (sequelize: Sequelize, filters?: {
    status?: TenantStatus;
    tier?: TenantTier;
    search?: string;
}, pagination?: {
    page?: number;
    limit?: number;
}) => Promise<any>;
/**
 * Generates tenant health score.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Health score and details
 */
export declare const getTenantHealthScore: (sequelize: Sequelize, tenantId: string) => Promise<any>;
//# sourceMappingURL=iam-tenant-kit.d.ts.map