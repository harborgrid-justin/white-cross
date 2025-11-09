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
import { Model, ModelStatic, Sequelize, ModelAttributes, QueryInterface, Transaction, WhereOptions, FindOptions } from 'sequelize';
/**
 * Tenant status enumeration
 */
export declare enum TenantStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    PROVISIONING = "provisioning",
    DEPROVISIONING = "deprovisioning",
    ARCHIVED = "archived",
    TRIAL = "trial",
    EXPIRED = "expired"
}
/**
 * Tenant tier for pricing/features
 */
export declare enum TenantTier {
    FREE = "free",
    BASIC = "basic",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise",
    HEALTHCARE = "healthcare",
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
        favicon?: string;
        customCSS?: string;
    };
    notifications?: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
        slack?: boolean;
    };
    security?: {
        mfaRequired?: boolean;
        mfaMethod?: 'totp' | 'sms' | 'email';
        passwordPolicy?: {
            minLength?: number;
            requireUppercase?: boolean;
            requireLowercase?: boolean;
            requireNumbers?: boolean;
            requireSpecialChars?: boolean;
            expirationDays?: number;
        };
        sessionTimeout?: number;
        ipWhitelist?: string[];
        allowedDomains?: string[];
    };
    compliance?: {
        hipaa?: boolean;
        gdpr?: boolean;
        dataRetentionDays?: number;
        auditLevel?: 'minimal' | 'standard' | 'comprehensive';
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
    maxConcurrentSessions?: number;
    maxFileSize?: number;
    maxBandwidth?: number;
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
    currentSessions: number;
    bandwidthUsed: number;
    customUsage?: Record<string, number>;
    lastUpdated?: Date;
}
/**
 * Tenant context for queries
 */
export interface TenantContext {
    tenantId: string;
    userId?: string;
    isolationStrategy: IsolationStrategy;
    schemaName?: string;
    databaseName?: string;
    permissions?: string[];
    metadata?: Record<string, any>;
}
/**
 * Tenant onboarding data
 */
export interface TenantOnboardingData {
    name: string;
    slug: string;
    tier: TenantTier;
    adminEmail: string;
    adminName: string;
    organizationSize?: number;
    industry?: string;
    config?: Partial<TenantConfig>;
    quota?: Partial<TenantQuota>;
}
/**
 * Tenant migration options
 */
export interface TenantMigrationOptions {
    sourceTenantId: string;
    targetTenantId: string;
    models: string[];
    preserveIds?: boolean;
    skipValidation?: boolean;
    batchSize?: number;
    dryRun?: boolean;
}
/**
 * Cross-tenant access policy
 */
export interface CrossTenantAccessPolicy {
    sourceTenantId: string;
    targetTenantId: string;
    accessLevel: 'read' | 'write' | 'admin';
    allowedModels?: string[];
    expiresAt?: Date;
    reason?: string;
}
/**
 * Tenant cache configuration
 */
export interface TenantCacheConfig {
    tenantId: string;
    cacheKeyPrefix: string;
    ttl: number;
    namespace?: string;
}
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
export declare const getTenantModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * 2. Defines TenantContext model for tracking tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantContext model attributes
 */
export declare const getTenantContextModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * 3. Creates Tenant table migration with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export declare const createTenantTable: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
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
export declare const createTenantScopedQuery: (context: TenantContext, baseOptions?: FindOptions) => FindOptions;
/**
 * 5. Applies tenant isolation to a model class with hooks.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @returns {ModelStatic<any>} Model with tenant isolation
 */
export declare const applyTenantIsolation: <T extends Model>(model: ModelStatic<T>, tenantId: string) => ModelStatic<T>;
/**
 * 6. Creates tenant-isolated database connection.
 *
 * @param {Sequelize} baseSequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
export declare const createTenantConnection: (baseSequelize: Sequelize, tenantId: string, strategy: IsolationStrategy) => Promise<Sequelize>;
/**
 * 7. Applies row-level security policy for tenant isolation (PostgreSQL).
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumn - Tenant column name
 * @returns {Promise<void>}
 */
export declare const applyRowLevelSecurity: (queryInterface: QueryInterface, tableName: string, tenantColumn?: string) => Promise<void>;
/**
 * 8. Sets tenant context for database session (PostgreSQL).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export declare const setTenantContextInSession: (sequelize: Sequelize, tenantId: string, transaction?: Transaction) => Promise<void>;
/**
 * 9. Validates tenant access for a user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if user has access
 */
export declare const validateTenantAccess: (sequelize: Sequelize, userId: string, tenantId: string) => Promise<boolean>;
/**
 * 10. Enforces tenant isolation in bulk operations.
 *
 * @param {WhereOptions} where - Where clause
 * @param {string} tenantId - Tenant ID
 * @returns {WhereOptions} Tenant-scoped where clause
 */
export declare const enforceTenantIsolationInBulk: (where: WhereOptions, tenantId: string) => WhereOptions;
/**
 * 11. Creates tenant context from request/session data.
 *
 * @param {object} data - Context data
 * @returns {Promise<TenantContext>} Tenant context
 */
export declare const createTenantContext: (data: {
    tenantId: string;
    userId?: string;
    isolationStrategy?: IsolationStrategy;
    schemaName?: string;
    databaseName?: string;
    permissions?: string[];
}) => Promise<TenantContext>;
/**
 * 12. Stores tenant context in session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @param {TenantContext} context - Tenant context
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 */
export declare const storeTenantContext: (sequelize: Sequelize, sessionId: string, context: TenantContext, ttl?: number) => Promise<void>;
/**
 * 13. Retrieves tenant context from session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @returns {Promise<TenantContext | null>} Tenant context or null
 */
export declare const retrieveTenantContext: (sequelize: Sequelize, sessionId: string) => Promise<TenantContext | null>;
/**
 * 14. Clears expired tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of contexts cleared
 */
export declare const clearExpiredTenantContexts: (sequelize: Sequelize) => Promise<number>;
/**
 * 15. Executes tenant-aware query with automatic scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} options - Query options
 * @returns {Promise<any[]>} Query results
 */
export declare const executeTenantAwareQuery: <T extends Model>(model: ModelStatic<T>, context: TenantContext, options?: FindOptions) => Promise<T[]>;
/**
 * 16. Counts records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @returns {Promise<number>} Record count
 */
export declare const countTenantRecords: <T extends Model>(model: ModelStatic<T>, context: TenantContext, where?: WhereOptions) => Promise<number>;
/**
 * 17. Finds one record with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} options - Query options
 * @returns {Promise<any | null>} Record or null
 */
export declare const findOneTenantRecord: <T extends Model>(model: ModelStatic<T>, context: TenantContext, options?: FindOptions) => Promise<T | null>;
/**
 * 18. Creates record with tenant context.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {object} data - Record data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created record
 */
export declare const createTenantRecord: <T extends Model>(model: ModelStatic<T>, context: TenantContext, data: any, transaction?: Transaction) => Promise<T>;
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
export declare const updateTenantRecords: <T extends Model>(model: ModelStatic<T>, context: TenantContext, where: WhereOptions, updates: any, transaction?: Transaction) => Promise<number>;
/**
 * 20. Deletes records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted records
 */
export declare const deleteTenantRecords: <T extends Model>(model: ModelStatic<T>, context: TenantContext, where: WhereOptions, transaction?: Transaction) => Promise<number>;
/**
 * 21. Migrates tenant schema to latest version.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} targetVersion - Target schema version
 * @returns {Promise<void>}
 */
export declare const migrateTenantSchema: (sequelize: Sequelize, tenantId: string, targetVersion: string) => Promise<void>;
/**
 * 22. Copies data from one tenant to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantMigrationOptions} options - Migration options
 * @returns {Promise<number>} Number of records copied
 */
export declare const copyTenantData: (sequelize: Sequelize, options: TenantMigrationOptions) => Promise<number>;
/**
 * 23. Backs up tenant data to JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} models - Models to backup
 * @returns {Promise<object>} Backup data
 */
export declare const backupTenantData: (sequelize: Sequelize, tenantId: string, models: string[]) => Promise<object>;
/**
 * 24. Restores tenant data from backup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} backup - Backup data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records restored
 */
export declare const restoreTenantData: (sequelize: Sequelize, backup: any, transaction?: Transaction) => Promise<number>;
/**
 * 25. Provisions new tenant with complete setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantOnboardingData} data - Onboarding data
 * @returns {Promise<any>} Created tenant
 */
export declare const provisionTenant: (sequelize: Sequelize, data: TenantOnboardingData) => Promise<any>;
/**
 * 26. Deprovisions tenant and cleans up resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export declare const deprovisionTenant: (sequelize: Sequelize, tenantId: string) => Promise<void>;
/**
 * 27. Sets up trial tenant with expiration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantOnboardingData} data - Onboarding data
 * @param {number} trialDays - Trial duration in days
 * @returns {Promise<any>} Created trial tenant
 */
export declare const setupTrialTenant: (sequelize: Sequelize, data: TenantOnboardingData, trialDays?: number) => Promise<any>;
/**
 * 28. Upgrades tenant tier with quota updates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantTier} newTier - New tier
 * @returns {Promise<any>} Updated tenant
 */
export declare const upgradeTenantTier: (sequelize: Sequelize, tenantId: string, newTier: TenantTier) => Promise<any>;
/**
 * 29. Validates data belongs to tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} modelName - Model name
 * @param {string} recordId - Record ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if valid
 */
export declare const validateDataOwnership: (sequelize: Sequelize, modelName: string, recordId: string, tenantId: string) => Promise<boolean>;
/**
 * 30. Segregates tenant data in shared tables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export declare const segregateTenantData: (sequelize: Sequelize, tableName: string, tenantId: string) => Promise<void>;
/**
 * 31. Encrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} data - Data to encrypt
 * @returns {Promise<object>} Encrypted data
 */
export declare const encryptTenantData: (sequelize: Sequelize, tenantId: string, data: object) => Promise<object>;
/**
 * 32. Decrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} encryptedData - Encrypted data
 * @returns {Promise<object>} Decrypted data
 */
export declare const decryptTenantData: (sequelize: Sequelize, tenantId: string, encryptedData: any) => Promise<object>;
/**
 * 33. Creates cross-tenant access policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CrossTenantAccessPolicy} policy - Access policy
 * @returns {Promise<any>} Created policy
 */
export declare const createCrossTenantAccessPolicy: (sequelize: Sequelize, policy: CrossTenantAccessPolicy) => Promise<any>;
/**
 * 34. Validates cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @param {string} accessLevel - Access level required
 * @returns {Promise<boolean>} True if access allowed
 */
export declare const validateCrossTenantAccess: (sequelize: Sequelize, sourceTenantId: string, targetTenantId: string, accessLevel?: string) => Promise<boolean>;
/**
 * 35. Revokes cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<number>} Number of policies revoked
 */
export declare const revokeCrossTenantAccess: (sequelize: Sequelize, sourceTenantId: string, targetTenantId: string) => Promise<number>;
/**
 * 36. Updates tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantConfig>} config - Configuration updates
 * @returns {Promise<any>} Updated tenant
 */
export declare const updateTenantConfig: (sequelize: Sequelize, tenantId: string, config: Partial<TenantConfig>) => Promise<any>;
/**
 * 37. Retrieves tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<TenantConfig>} Tenant configuration
 */
export declare const getTenantConfig: (sequelize: Sequelize, tenantId: string) => Promise<TenantConfig>;
/**
 * 38. Generates tenant cache key.
 *
 * @param {string} tenantId - Tenant ID
 * @param {string} key - Cache key
 * @param {string} namespace - Optional namespace
 * @returns {string} Tenant-specific cache key
 */
export declare const generateTenantCacheKey: (tenantId: string, key: string, namespace?: string) => string;
/**
 * 39. Invalidates tenant cache.
 *
 * @param {any} cache - Cache instance (Redis, etc.)
 * @param {string} tenantId - Tenant ID
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} Number of keys invalidated
 */
export declare const invalidateTenantCache: (cache: any, tenantId: string, pattern?: string) => Promise<number>;
/**
 * 40. Updates tenant usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantUsage>} usage - Usage updates
 * @returns {Promise<any>} Updated tenant
 */
export declare const updateTenantUsage: (sequelize: Sequelize, tenantId: string, usage: Partial<TenantUsage>) => Promise<any>;
//# sourceMappingURL=multi-tenancy-kit.d.ts.map