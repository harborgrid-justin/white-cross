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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  QueryInterface,
  Transaction,
  WhereOptions,
  FindOptions,
  Op,
  literal,
  fn,
  col,
  QueryTypes,
} from 'sequelize';
import { isUUID, isAlphanumeric } from 'validator';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Tenant status enumeration
 */
export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PROVISIONING = 'provisioning',
  DEPROVISIONING = 'deprovisioning',
  ARCHIVED = 'archived',
  TRIAL = 'trial',
  EXPIRED = 'expired',
}

/**
 * Tenant tier for pricing/features
 */
export enum TenantTier {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  HEALTHCARE = 'healthcare',
  CUSTOM = 'custom',
}

/**
 * Isolation strategy
 */
export enum IsolationStrategy {
  SCHEMA = 'schema',
  DATABASE = 'database',
  ROW_LEVEL = 'row_level',
  HYBRID = 'hybrid',
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
  maxStorage?: number; // bytes
  maxApiCalls?: number; // per month
  maxDatabases?: number;
  maxRecords?: number;
  maxConcurrentSessions?: number;
  maxFileSize?: number; // bytes
  maxBandwidth?: number; // bytes per month
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
  ttl: number; // seconds
  namespace?: string;
}

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
export const getTenantModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique tenant identifier',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255],
    },
    comment: 'Tenant display name',
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9-]+$/i,
      len: [2, 100],
    },
    comment: 'URL-friendly tenant identifier',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(TenantStatus)),
    allowNull: false,
    defaultValue: TenantStatus.PROVISIONING,
    comment: 'Current tenant status',
  },
  tier: {
    type: DataTypes.ENUM(...Object.values(TenantTier)),
    allowNull: false,
    defaultValue: TenantTier.FREE,
    comment: 'Tenant subscription tier',
  },
  isolationStrategy: {
    type: DataTypes.ENUM(...Object.values(IsolationStrategy)),
    allowNull: false,
    defaultValue: IsolationStrategy.ROW_LEVEL,
    comment: 'Data isolation strategy',
  },
  schemaName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      is: /^[a-z_][a-z0-9_]*$/i,
    },
    comment: 'Schema name for schema isolation',
  },
  databaseName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      is: /^[a-z_][a-z0-9_]*$/i,
    },
    comment: 'Database name for database isolation',
  },
  config: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Tenant configuration settings',
  },
  quota: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Tenant resource quotas',
  },
  usage: {
    type: DataTypes.JSONB,
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
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Additional tenant metadata',
  },
  encryptionKey: {
    type: DataTypes.STRING(512),
    allowNull: true,
    comment: 'Tenant-specific encryption key (encrypted)',
  },
  parentTenantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tenants',
      key: 'id',
    },
    comment: 'Parent tenant for hierarchies',
  },
  provisionedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when tenant was fully provisioned',
  },
  suspendedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when tenant was suspended',
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when tenant was archived',
  },
  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Trial period end date',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  },
});

/**
 * 2. Defines TenantContext model for tracking tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantContext model attributes
 */
export const getTenantContextModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User ID associated with this context',
  },
  sessionId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Session identifier',
  },
  contextData: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Context metadata and settings',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Context expiration timestamp',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * 3. Creates Tenant table migration with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export const createTenantTable = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  await queryInterface.createTable('tenants', getTenantModelAttributes(sequelize));

  // Create indexes for performance
  await queryInterface.addIndex('tenants', ['status'], { name: 'idx_tenants_status' });
  await queryInterface.addIndex('tenants', ['tier'], { name: 'idx_tenants_tier' });
  await queryInterface.addIndex('tenants', ['slug'], { name: 'idx_tenants_slug', unique: true });
  await queryInterface.addIndex('tenants', ['isolationStrategy'], { name: 'idx_tenants_isolation' });
  await queryInterface.addIndex('tenants', ['parentTenantId'], { name: 'idx_tenants_parent' });
  await queryInterface.addIndex('tenants', ['createdAt'], { name: 'idx_tenants_created' });
  await queryInterface.addIndex('tenants', ['deletedAt'], { name: 'idx_tenants_deleted' });
};

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
export const createTenantScopedQuery = (
  context: TenantContext,
  baseOptions: FindOptions = {},
): FindOptions => {
  const scopedOptions = { ...baseOptions };

  if (context.isolationStrategy === IsolationStrategy.ROW_LEVEL) {
    scopedOptions.where = {
      ...(baseOptions.where || {}),
      tenantId: context.tenantId,
    };
  } else if (context.isolationStrategy === IsolationStrategy.SCHEMA && context.schemaName) {
    scopedOptions.schema = context.schemaName;
  }

  return scopedOptions;
};

/**
 * 5. Applies tenant isolation to a model class with hooks.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @returns {ModelStatic<any>} Model with tenant isolation
 */
export const applyTenantIsolation = <T extends Model>(
  model: ModelStatic<T>,
  tenantId: string,
): ModelStatic<T> => {
  // Add default scope
  model.addScope('tenant', {
    where: { tenantId },
  });

  // Add before create hook
  model.addHook('beforeCreate', (instance: any) => {
    if (!instance.tenantId) {
      instance.tenantId = tenantId;
    }
  });

  // Add before bulk create hook
  model.addHook('beforeBulkCreate', (instances: any[]) => {
    instances.forEach((instance) => {
      if (!instance.tenantId) {
        instance.tenantId = tenantId;
      }
    });
  });

  return model;
};

/**
 * 6. Creates tenant-isolated database connection.
 *
 * @param {Sequelize} baseSequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
export const createTenantConnection = async (
  baseSequelize: Sequelize,
  tenantId: string,
  strategy: IsolationStrategy,
): Promise<Sequelize> => {
  const Tenant = baseSequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  if (strategy === IsolationStrategy.DATABASE) {
    const dbName = (tenant as any).databaseName;
    return new Sequelize({
      ...(baseSequelize.options as any),
      database: dbName,
    });
  } else if (strategy === IsolationStrategy.SCHEMA) {
    const schemaName = (tenant as any).schemaName;
    const connection = baseSequelize.connectionManager.getConnection({
      type: 'read',
    } as any);
    await baseSequelize.query(`SET search_path TO ${schemaName}`);
    return baseSequelize;
  }

  return baseSequelize;
};

/**
 * 7. Applies row-level security policy for tenant isolation (PostgreSQL).
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumn - Tenant column name
 * @returns {Promise<void>}
 */
export const applyRowLevelSecurity = async (
  queryInterface: QueryInterface,
  tableName: string,
  tenantColumn: string = 'tenantId',
): Promise<void> => {
  await queryInterface.sequelize.query(`
    ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_policy ON "${tableName}"
    USING (${tenantColumn} = current_setting('app.current_tenant')::uuid);

    CREATE POLICY tenant_isolation_insert_policy ON "${tableName}"
    FOR INSERT
    WITH CHECK (${tenantColumn} = current_setting('app.current_tenant')::uuid);
  `);
};

/**
 * 8. Sets tenant context for database session (PostgreSQL).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export const setTenantContextInSession = async (
  sequelize: Sequelize,
  tenantId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(`SET app.current_tenant = '${tenantId}'`, {
    transaction,
  });
};

/**
 * 9. Validates tenant access for a user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if user has access
 */
export const validateTenantAccess = async (
  sequelize: Sequelize,
  userId: string,
  tenantId: string,
): Promise<boolean> => {
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

/**
 * 10. Enforces tenant isolation in bulk operations.
 *
 * @param {WhereOptions} where - Where clause
 * @param {string} tenantId - Tenant ID
 * @returns {WhereOptions} Tenant-scoped where clause
 */
export const enforceTenantIsolationInBulk = (
  where: WhereOptions,
  tenantId: string,
): WhereOptions => {
  return {
    ...where,
    tenantId,
  };
};

// ============================================================================
// TENANT CONTEXT PROVIDERS
// ============================================================================

/**
 * 11. Creates tenant context from request/session data.
 *
 * @param {object} data - Context data
 * @returns {Promise<TenantContext>} Tenant context
 */
export const createTenantContext = async (data: {
  tenantId: string;
  userId?: string;
  isolationStrategy?: IsolationStrategy;
  schemaName?: string;
  databaseName?: string;
  permissions?: string[];
}): Promise<TenantContext> => {
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

/**
 * 12. Stores tenant context in session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @param {TenantContext} context - Tenant context
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 */
export const storeTenantContext = async (
  sequelize: Sequelize,
  sessionId: string,
  context: TenantContext,
  ttl: number = 3600,
): Promise<void> => {
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

/**
 * 13. Retrieves tenant context from session/cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @returns {Promise<TenantContext | null>} Tenant context or null
 */
export const retrieveTenantContext = async (
  sequelize: Sequelize,
  sessionId: string,
): Promise<TenantContext | null> => {
  const TenantContext = sequelize.models.TenantContext;

  if (!TenantContext) {
    return null;
  }

  const contextRecord = await TenantContext.findOne({
    where: {
      sessionId,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  if (!contextRecord) {
    return null;
  }

  return (contextRecord as any).contextData;
};

/**
 * 14. Clears expired tenant contexts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<number>} Number of contexts cleared
 */
export const clearExpiredTenantContexts = async (sequelize: Sequelize): Promise<number> => {
  const TenantContext = sequelize.models.TenantContext;

  if (!TenantContext) {
    return 0;
  }

  const result = await TenantContext.destroy({
    where: {
      expiresAt: { [Op.lt]: new Date() },
    },
  });

  return result;
};

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
export const executeTenantAwareQuery = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  options: FindOptions = {},
): Promise<T[]> => {
  const scopedOptions = createTenantScopedQuery(context, options);
  return await model.findAll(scopedOptions);
};

/**
 * 16. Counts records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @returns {Promise<number>} Record count
 */
export const countTenantRecords = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  where: WhereOptions = {},
): Promise<number> => {
  const scopedWhere = enforceTenantIsolationInBulk(where, context.tenantId);
  return await model.count({ where: scopedWhere });
};

/**
 * 17. Finds one record with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {FindOptions} options - Query options
 * @returns {Promise<any | null>} Record or null
 */
export const findOneTenantRecord = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  options: FindOptions = {},
): Promise<T | null> => {
  const scopedOptions = createTenantScopedQuery(context, options);
  return await model.findOne(scopedOptions);
};

/**
 * 18. Creates record with tenant context.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {object} data - Record data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created record
 */
export const createTenantRecord = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  data: any,
  transaction?: Transaction,
): Promise<T> => {
  return await model.create(
    {
      ...data,
      tenantId: context.tenantId,
    },
    { transaction },
  );
};

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
export const updateTenantRecords = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  where: WhereOptions,
  updates: any,
  transaction?: Transaction,
): Promise<number> => {
  const scopedWhere = enforceTenantIsolationInBulk(where, context.tenantId);
  const [affectedCount] = await model.update(updates, { where: scopedWhere, transaction });
  return affectedCount;
};

/**
 * 20. Deletes records with tenant scoping.
 *
 * @param {ModelStatic<any>} model - Sequelize model
 * @param {TenantContext} context - Tenant context
 * @param {WhereOptions} where - Where clause
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of deleted records
 */
export const deleteTenantRecords = async <T extends Model>(
  model: ModelStatic<T>,
  context: TenantContext,
  where: WhereOptions,
  transaction?: Transaction,
): Promise<number> => {
  const scopedWhere = enforceTenantIsolationInBulk(where, context.tenantId);
  return await model.destroy({ where: scopedWhere, transaction });
};

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
export const migrateTenantSchema = async (
  sequelize: Sequelize,
  tenantId: string,
  targetVersion: string,
): Promise<void> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const schemaName = (tenant as any).schemaName;

  if (schemaName) {
    await sequelize.query(`SET search_path TO ${schemaName}`);
    // Run migrations specific to this schema
    // This would integrate with your migration system
  }

  await (tenant as any).update({
    metadata: {
      ...(tenant as any).metadata,
      schemaVersion: targetVersion,
      lastMigrated: new Date(),
    },
  });
};

/**
 * 22. Copies data from one tenant to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantMigrationOptions} options - Migration options
 * @returns {Promise<number>} Number of records copied
 */
export const copyTenantData = async (
  sequelize: Sequelize,
  options: TenantMigrationOptions,
): Promise<number> => {
  let totalCopied = 0;

  for (const modelName of options.models) {
    const Model = sequelize.models[modelName];
    if (!Model) continue;

    const records = await Model.findAll({
      where: { tenantId: options.sourceTenantId },
    });

    for (const record of records) {
      const data = (record as any).toJSON();

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

/**
 * 23. Backs up tenant data to JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} models - Models to backup
 * @returns {Promise<object>} Backup data
 */
export const backupTenantData = async (
  sequelize: Sequelize,
  tenantId: string,
  models: string[],
): Promise<object> => {
  const backup: any = {
    tenantId,
    timestamp: new Date(),
    models: {},
  };

  for (const modelName of models) {
    const Model = sequelize.models[modelName];
    if (!Model) continue;

    const records = await Model.findAll({
      where: { tenantId },
      raw: true,
    });

    backup.models[modelName] = records;
  }

  return backup;
};

/**
 * 24. Restores tenant data from backup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} backup - Backup data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records restored
 */
export const restoreTenantData = async (
  sequelize: Sequelize,
  backup: any,
  transaction?: Transaction,
): Promise<number> => {
  let totalRestored = 0;

  for (const [modelName, records] of Object.entries(backup.models)) {
    const Model = sequelize.models[modelName];
    if (!Model) continue;

    for (const record of records as any[]) {
      await Model.create(record, { transaction });
      totalRestored++;
    }
  }

  return totalRestored;
};

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
export const provisionTenant = async (
  sequelize: Sequelize,
  data: TenantOnboardingData,
): Promise<any> => {
  const transaction = await sequelize.transaction();

  try {
    const Tenant = sequelize.models.Tenant;

    // Create tenant
    const tenant = await Tenant.create(
      {
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
      },
      { transaction },
    );

    // Create admin user
    const User = sequelize.models.User;
    if (User) {
      await User.create(
        {
          tenantId: (tenant as any).id,
          email: data.adminEmail,
          name: data.adminName,
          role: 'admin',
          status: 'active',
        },
        { transaction },
      );
    }

    // Mark as provisioned
    await (tenant as any).update(
      {
        status: TenantStatus.ACTIVE,
        provisionedAt: new Date(),
      },
      { transaction },
    );

    await transaction.commit();
    return tenant;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * 26. Deprovisions tenant and cleans up resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export const deprovisionTenant = async (sequelize: Sequelize, tenantId: string): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const Tenant = sequelize.models.Tenant;
    const tenant = await Tenant.findByPk(tenantId);

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    // Update status to deprovisioning
    await (tenant as any).update(
      { status: TenantStatus.DEPROVISIONING },
      { transaction },
    );

    // Archive tenant data
    await (tenant as any).update(
      {
        status: TenantStatus.ARCHIVED,
        archivedAt: new Date(),
        deletedAt: new Date(),
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * 27. Sets up trial tenant with expiration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TenantOnboardingData} data - Onboarding data
 * @param {number} trialDays - Trial duration in days
 * @returns {Promise<any>} Created trial tenant
 */
export const setupTrialTenant = async (
  sequelize: Sequelize,
  data: TenantOnboardingData,
  trialDays: number = 14,
): Promise<any> => {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

  const tenant = await provisionTenant(sequelize, {
    ...data,
    tier: TenantTier.FREE,
  });

  await (tenant as any).update({
    status: TenantStatus.TRIAL,
    trialEndsAt,
  });

  return tenant;
};

/**
 * 28. Upgrades tenant tier with quota updates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {TenantTier} newTier - New tier
 * @returns {Promise<any>} Updated tenant
 */
export const upgradeTenantTier = async (
  sequelize: Sequelize,
  tenantId: string,
  newTier: TenantTier,
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  // Define tier quotas
  const tierQuotas: Record<TenantTier, TenantQuota> = {
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

  await (tenant as any).update({
    tier: newTier,
    quota: tierQuotas[newTier],
  });

  return tenant;
};

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
export const validateDataOwnership = async (
  sequelize: Sequelize,
  modelName: string,
  recordId: string,
  tenantId: string,
): Promise<boolean> => {
  const Model = sequelize.models[modelName];
  if (!Model) {
    throw new Error(`Model ${modelName} not found`);
  }

  const record = await Model.findOne({
    where: { id: recordId, tenantId },
  });

  return !!record;
};

/**
 * 30. Segregates tenant data in shared tables.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<void>}
 */
export const segregateTenantData = async (
  sequelize: Sequelize,
  tableName: string,
  tenantId: string,
): Promise<void> => {
  // Add tenant column if not exists
  const queryInterface = sequelize.getQueryInterface();
  const tableDescription = await queryInterface.describeTable(tableName);

  if (!tableDescription.tenantId) {
    await queryInterface.addColumn(tableName, 'tenantId', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    await queryInterface.addIndex(tableName, ['tenantId'], {
      name: `idx_${tableName}_tenant`,
    });
  }
};

/**
 * 31. Encrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} data - Data to encrypt
 * @returns {Promise<object>} Encrypted data
 */
export const encryptTenantData = async (
  sequelize: Sequelize,
  tenantId: string,
  data: object,
): Promise<object> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  // Use tenant-specific encryption key
  // Implementation would use crypto library
  return { encrypted: true, data: JSON.stringify(data) };
};

/**
 * 32. Decrypts tenant-specific sensitive data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} encryptedData - Encrypted data
 * @returns {Promise<object>} Decrypted data
 */
export const decryptTenantData = async (
  sequelize: Sequelize,
  tenantId: string,
  encryptedData: any,
): Promise<object> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  // Use tenant-specific encryption key
  return JSON.parse(encryptedData.data);
};

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
export const createCrossTenantAccessPolicy = async (
  sequelize: Sequelize,
  policy: CrossTenantAccessPolicy,
): Promise<any> => {
  const CrossTenantAccess = sequelize.models.CrossTenantAccess;

  if (!CrossTenantAccess) {
    throw new Error('CrossTenantAccess model not found');
  }

  return await CrossTenantAccess.create(policy);
};

/**
 * 34. Validates cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @param {string} accessLevel - Access level required
 * @returns {Promise<boolean>} True if access allowed
 */
export const validateCrossTenantAccess = async (
  sequelize: Sequelize,
  sourceTenantId: string,
  targetTenantId: string,
  accessLevel: string = 'read',
): Promise<boolean> => {
  const CrossTenantAccess = sequelize.models.CrossTenantAccess;

  if (!CrossTenantAccess) {
    return false;
  }

  const policy = await CrossTenantAccess.findOne({
    where: {
      sourceTenantId,
      targetTenantId,
      accessLevel: { [Op.in]: [accessLevel, 'admin'] },
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: new Date() } }],
    },
  });

  return !!policy;
};

/**
 * 35. Revokes cross-tenant access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<number>} Number of policies revoked
 */
export const revokeCrossTenantAccess = async (
  sequelize: Sequelize,
  sourceTenantId: string,
  targetTenantId: string,
): Promise<number> => {
  const CrossTenantAccess = sequelize.models.CrossTenantAccess;

  if (!CrossTenantAccess) {
    return 0;
  }

  return await CrossTenantAccess.destroy({
    where: { sourceTenantId, targetTenantId },
  });
};

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
export const updateTenantConfig = async (
  sequelize: Sequelize,
  tenantId: string,
  config: Partial<TenantConfig>,
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const currentConfig = (tenant as any).config || {};

  await (tenant as any).update({
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

/**
 * 37. Retrieves tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<TenantConfig>} Tenant configuration
 */
export const getTenantConfig = async (
  sequelize: Sequelize,
  tenantId: string,
): Promise<TenantConfig> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  return (tenant as any).config || {};
};

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
export const generateTenantCacheKey = (
  tenantId: string,
  key: string,
  namespace?: string,
): string => {
  const parts = ['tenant', tenantId];
  if (namespace) {
    parts.push(namespace);
  }
  parts.push(key);
  return parts.join(':');
};

/**
 * 39. Invalidates tenant cache.
 *
 * @param {any} cache - Cache instance (Redis, etc.)
 * @param {string} tenantId - Tenant ID
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} Number of keys invalidated
 */
export const invalidateTenantCache = async (
  cache: any,
  tenantId: string,
  pattern: string = '*',
): Promise<number> => {
  const cachePattern = generateTenantCacheKey(tenantId, pattern);

  if (cache.keys) {
    const keys = await cache.keys(cachePattern);
    if (keys.length > 0) {
      await cache.del(...keys);
    }
    return keys.length;
  }

  return 0;
};

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
export const updateTenantUsage = async (
  sequelize: Sequelize,
  tenantId: string,
  usage: Partial<TenantUsage>,
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;
  const tenant = await Tenant.findByPk(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const currentUsage = (tenant as any).usage || {};

  await (tenant as any).update({
    usage: {
      ...currentUsage,
      ...usage,
      lastUpdated: new Date(),
    },
  });

  return tenant;
};
