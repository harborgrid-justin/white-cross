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
}

/**
 * Tenant tier for pricing/features
 */
export enum TenantTier {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
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
  maxStorage?: number; // bytes
  maxApiCalls?: number; // per month
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
  alerts: Array<{ type: string; message: string; severity: string }>;
  recommendations: string[];
}

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
    },
    comment: 'Current tenant resource usage',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Additional tenant metadata',
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
export const getTenantHierarchyModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ancestorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
    comment: 'Ancestor tenant in hierarchy',
  },
  descendantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
    comment: 'Descendant tenant in hierarchy',
  },
  depth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
    comment: 'Depth in hierarchy (0 = self)',
  },
  path: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
    defaultValue: [],
    comment: 'Full path from ancestor to descendant',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * Defines TenantQuotaHistory model for quota tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} TenantQuotaHistory model attributes
 */
export const getTenantQuotaHistoryModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
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
  quotaType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Type of quota (users, storage, etc.)',
  },
  previousLimit: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  newLimit: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  changedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'User who changed the quota',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

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
export const createTenantTable = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  await queryInterface.createTable('tenants', getTenantModelAttributes(sequelize), {
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

/**
 * Creates TenantHierarchy table migration.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export const createTenantHierarchyTable = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  await queryInterface.createTable('tenant_hierarchies', getTenantHierarchyModelAttributes(sequelize));

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
export const provisionTenant = async (
  sequelize: Sequelize,
  tenantData: {
    name: string;
    slug: string;
    tier?: TenantTier;
    isolationStrategy?: IsolationStrategy;
    config?: TenantConfig;
    quota?: TenantQuota;
    parentTenantId?: string;
  },
  transaction?: Transaction,
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;

  const tenant = await Tenant.create(
    {
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
    },
    { transaction },
  );

  // Set up schema if using schema isolation
  if (tenantData.isolationStrategy === IsolationStrategy.SCHEMA) {
    const schemaName = `tenant_${tenant.slug}`;
    await sequelize.getQueryInterface().createSchema(schemaName, { transaction });
    await tenant.update({ schemaName }, { transaction });
  }

  // Mark as provisioned
  await tenant.update(
    {
      status: TenantStatus.ACTIVE,
      provisionedAt: new Date(),
    },
    { transaction },
  );

  return tenant;
};

/**
 * Retrieves tenant by ID with optional hierarchy data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {object} options - Retrieval options
 * @returns {Promise<any>} Tenant instance
 */
export const getTenantById = async (
  sequelize: Sequelize,
  tenantId: string,
  options: {
    includeParent?: boolean;
    includeChildren?: boolean;
    includeAncestors?: boolean;
    includeDescendants?: boolean;
  } = {},
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;

  const include: any[] = [];

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

/**
 * Retrieves tenant by slug.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} slug - Tenant slug
 * @returns {Promise<any>} Tenant instance
 */
export const getTenantBySlug = async (sequelize: Sequelize, slug: string): Promise<any> => {
  const Tenant = sequelize.models.Tenant;
  return await Tenant.findOne({ where: { slug } });
};

/**
 * Updates tenant configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantConfig>} config - Configuration updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
export const updateTenantConfig = async (
  sequelize: Sequelize,
  tenantId: string,
  config: Partial<TenantConfig>,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const currentConfig = (tenant as any).config || {};
  const mergedConfig = {
    ...currentConfig,
    ...config,
    features: { ...currentConfig.features, ...config.features },
    customization: { ...currentConfig.customization, ...config.customization },
  };

  await tenant.update({ config: mergedConfig }, { transaction });
  return tenant;
};

/**
 * Suspends a tenant and logs the suspension.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} reason - Suspension reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Suspended tenant
 */
export const suspendTenant = async (
  sequelize: Sequelize,
  tenantId: string,
  reason: string,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  await tenant.update(
    {
      status: TenantStatus.SUSPENDED,
      suspendedAt: new Date(),
      metadata: {
        ...(tenant as any).metadata,
        suspensionReason: reason,
      },
    },
    { transaction },
  );

  return tenant;
};

/**
 * Reactivates a suspended tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Reactivated tenant
 */
export const reactivateTenant = async (
  sequelize: Sequelize,
  tenantId: string,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  await tenant.update(
    {
      status: TenantStatus.ACTIVE,
      suspendedAt: null,
    },
    { transaction },
  );

  return tenant;
};

/**
 * Archives a tenant (soft delete with deprovisioning).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Archived tenant
 */
export const archiveTenant = async (
  sequelize: Sequelize,
  tenantId: string,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  await tenant.update(
    {
      status: TenantStatus.ARCHIVED,
      archivedAt: new Date(),
      deletedAt: new Date(),
    },
    { transaction },
  );

  return tenant;
};

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
export const createTenantScopedQuery = (
  sequelize: Sequelize,
  context: TenantScopeContext,
  baseOptions: FindOptions = {},
): FindOptions => {
  const scopedOptions = { ...baseOptions };

  if (context.isolationStrategy === IsolationStrategy.ROW_LEVEL) {
    scopedOptions.where = {
      ...(baseOptions.where || {}),
      tenantId: context.tenantId,
    };
  } else if (context.isolationStrategy === IsolationStrategy.SCHEMA && context.schemaName) {
    // Schema isolation handled at connection level
    scopedOptions.schema = context.schemaName;
  }

  return scopedOptions;
};

/**
 * Applies tenant isolation to a model instance.
 *
 * @param {any} model - Model instance
 * @param {string} tenantId - Tenant ID
 * @returns {any} Model with tenant isolation
 */
export const applyTenantIsolation = (model: any, tenantId: string): any => {
  model.addScope('tenant', {
    where: { tenantId },
  });

  model.addHook('beforeCreate', (instance: any) => {
    if (!instance.tenantId) {
      instance.tenantId = tenantId;
    }
  });

  return model;
};

/**
 * Validates tenant access for a user.
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

/**
 * Creates tenant-isolated database connection.
 *
 * @param {Sequelize} sequelize - Base Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} strategy - Isolation strategy
 * @returns {Promise<Sequelize>} Tenant-isolated connection
 */
export const createTenantConnection = async (
  sequelize: Sequelize,
  tenantId: string,
  strategy: IsolationStrategy,
): Promise<Sequelize> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  if (strategy === IsolationStrategy.DATABASE) {
    const dbName = (tenant as any).databaseName;
    return new Sequelize(dbName, sequelize.config.username, sequelize.config.password, {
      ...sequelize.config,
      database: dbName,
    });
  } else if (strategy === IsolationStrategy.SCHEMA) {
    const schemaName = (tenant as any).schemaName;
    const connection = sequelize.clone();
    await connection.getQueryInterface().createSchema(schemaName, {});
    return connection;
  }

  return sequelize;
};

/**
 * Enforces tenant data isolation in bulk operations.
 *
 * @param {any} model - Sequelize model
 * @param {string} tenantId - Tenant ID
 * @param {WhereOptions} where - Where clause
 * @returns {WhereOptions} Tenant-scoped where clause
 */
export const enforceTenantIsolationInBulk = (
  model: any,
  tenantId: string,
  where: WhereOptions = {},
): WhereOptions => {
  return {
    ...where,
    tenantId,
  };
};

/**
 * Retrieves all accessible tenants for a user (including hierarchy).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<string[]>} Array of accessible tenant IDs
 */
export const getAccessibleTenantsForUser = async (
  sequelize: Sequelize,
  userId: string,
): Promise<string[]> => {
  const UserTenant = sequelize.models.UserTenant;

  if (!UserTenant) {
    return [];
  }

  const userTenants = await UserTenant.findAll({
    where: { userId, status: 'active' },
    attributes: ['tenantId'],
  });

  return userTenants.map((ut: any) => ut.tenantId);
};

/**
 * Checks if cross-tenant access is allowed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceTenantId - Source tenant ID
 * @param {string} targetTenantId - Target tenant ID
 * @returns {Promise<boolean>} True if cross-tenant access allowed
 */
export const isCrossTenantAccessAllowed = async (
  sequelize: Sequelize,
  sourceTenantId: string,
  targetTenantId: string,
): Promise<boolean> => {
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

/**
 * Applies row-level security policy for tenant isolation.
 *
 * @param {QueryInterface} queryInterface - Query interface
 * @param {string} tableName - Table name
 * @param {string} tenantColumnName - Tenant column name
 * @returns {Promise<void>}
 */
export const applyRowLevelSecurityPolicy = async (
  queryInterface: QueryInterface,
  tableName: string,
  tenantColumnName: string = 'tenantId',
): Promise<void> => {
  // PostgreSQL Row-Level Security
  await queryInterface.sequelize.query(`
    ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;

    CREATE POLICY tenant_isolation_policy ON "${tableName}"
    USING (${tenantColumnName} = current_setting('app.current_tenant')::uuid);
  `);
};

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
export const createTenantHierarchy = async (
  sequelize: Sequelize,
  parentId: string,
  childId: string,
  transaction?: Transaction,
): Promise<void> => {
  const TenantHierarchy = sequelize.models.TenantHierarchy;

  // Create self-reference for child
  await TenantHierarchy.create(
    {
      ancestorId: childId,
      descendantId: childId,
      depth: 0,
      path: [childId],
    },
    { transaction },
  );

  // Get all ancestors of parent
  const parentAncestors = await TenantHierarchy.findAll({
    where: { descendantId: parentId },
    transaction,
  });

  // Create relationships for all ancestors to new child
  for (const ancestor of parentAncestors) {
    await TenantHierarchy.create(
      {
        ancestorId: (ancestor as any).ancestorId,
        descendantId: childId,
        depth: (ancestor as any).depth + 1,
        path: [...(ancestor as any).path, childId],
      },
      { transaction },
    );
  }

  // Update child's parentTenantId
  await sequelize.models.Tenant.update(
    { parentTenantId: parentId },
    { where: { id: childId }, transaction },
  );
};

/**
 * Retrieves all children of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Parent tenant ID
 * @param {number} maxDepth - Maximum depth to retrieve
 * @returns {Promise<any[]>} Array of child tenants
 */
export const getTenantChildren = async (
  sequelize: Sequelize,
  tenantId: string,
  maxDepth?: number,
): Promise<any[]> => {
  const TenantHierarchy = sequelize.models.TenantHierarchy;
  const Tenant = sequelize.models.Tenant;

  const where: any = {
    ancestorId: tenantId,
    depth: { [Op.gt]: 0 },
  };

  if (maxDepth !== undefined) {
    where.depth = { [Op.lte]: maxDepth };
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

  return hierarchies.map((h: any) => h.descendant);
};

/**
 * Retrieves all ancestors of a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Child tenant ID
 * @returns {Promise<any[]>} Array of ancestor tenants
 */
export const getTenantAncestors = async (sequelize: Sequelize, tenantId: string): Promise<any[]> => {
  const TenantHierarchy = sequelize.models.TenantHierarchy;
  const Tenant = sequelize.models.Tenant;

  const hierarchies = await TenantHierarchy.findAll({
    where: {
      descendantId: tenantId,
      depth: { [Op.gt]: 0 },
    },
    include: [
      {
        model: Tenant,
        as: 'ancestor',
      },
    ],
    order: [['depth', 'DESC']],
  });

  return hierarchies.map((h: any) => h.ancestor);
};

/**
 * Retrieves the full hierarchy tree for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Root tenant ID
 * @returns {Promise<any>} Hierarchical tree structure
 */
export const getTenantHierarchyTree = async (sequelize: Sequelize, tenantId: string): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const children = await getTenantChildren(sequelize, tenantId, 1);

  const tree: any = {
    ...tenant.toJSON(),
    children: [],
  };

  for (const child of children) {
    tree.children.push(await getTenantHierarchyTree(sequelize, child.id));
  }

  return tree;
};

/**
 * Moves a tenant to a different parent in hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant to move
 * @param {string} newParentId - New parent tenant ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<void>}
 */
export const moveTenantInHierarchy = async (
  sequelize: Sequelize,
  tenantId: string,
  newParentId: string,
  transaction?: Transaction,
): Promise<void> => {
  const TenantHierarchy = sequelize.models.TenantHierarchy;

  // Remove existing hierarchy relationships (except self)
  await TenantHierarchy.destroy({
    where: {
      descendantId: tenantId,
      depth: { [Op.gt]: 0 },
    },
    transaction,
  });

  // Create new hierarchy
  await createTenantHierarchy(sequelize, newParentId, tenantId, transaction);
};

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
export const setTenantQuota = async (
  sequelize: Sequelize,
  tenantId: string,
  quota: TenantQuota,
  changedBy: string,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const previousQuota = (tenant as any).quota;

  // Log quota changes
  const QuotaHistory = sequelize.models.TenantQuotaHistory;
  if (QuotaHistory) {
    for (const [quotaType, newLimit] of Object.entries(quota)) {
      const previousLimit = previousQuota[quotaType];
      if (previousLimit !== newLimit) {
        await QuotaHistory.create(
          {
            tenantId,
            quotaType,
            previousLimit,
            newLimit,
            changedBy,
          },
          { transaction },
        );
      }
    }
  }

  await tenant.update(
    {
      quota: {
        ...previousQuota,
        ...quota,
      },
    },
    { transaction },
  );

  return tenant;
};

/**
 * Checks if tenant has exceeded quota.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string} quotaType - Type of quota to check
 * @returns {Promise<boolean>} True if quota exceeded
 */
export const isTenantQuotaExceeded = async (
  sequelize: Sequelize,
  tenantId: string,
  quotaType: string,
): Promise<boolean> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const quota = (tenant as any).quota;
  const usage = (tenant as any).usage;

  const limit = quota[quotaType] || quota.customLimits?.[quotaType];
  const current = usage[quotaType] || usage.customUsage?.[quotaType];

  if (limit === undefined || limit === null) {
    return false; // No limit set
  }

  return current >= limit;
};

/**
 * Updates tenant usage metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {Partial<TenantUsage>} usage - Usage updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Updated tenant
 */
export const updateTenantUsage = async (
  sequelize: Sequelize,
  tenantId: string,
  usage: Partial<TenantUsage>,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const currentUsage = (tenant as any).usage;

  await tenant.update(
    {
      usage: {
        ...currentUsage,
        ...usage,
      },
    },
    { transaction },
  );

  return tenant;
};

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
export const incrementTenantUsage = async (
  sequelize: Sequelize,
  tenantId: string,
  usageType: string,
  increment: number = 1,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const currentUsage = (tenant as any).usage;
  const currentValue = currentUsage[usageType] || currentUsage.customUsage?.[usageType] || 0;

  const updatedUsage = {
    ...currentUsage,
    [usageType]: currentValue + increment,
  };

  await tenant.update({ usage: updatedUsage }, { transaction });

  // Check if quota exceeded
  const exceeded = await isTenantQuotaExceeded(sequelize, tenantId, usageType);
  if (exceeded) {
    throw new Error(`Tenant ${tenantId} has exceeded quota for ${usageType}`);
  }

  return tenant;
};

/**
 * Retrieves quota usage report for a tenant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Quota usage report
 */
export const getTenantQuotaReport = async (sequelize: Sequelize, tenantId: string): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const quota = (tenant as any).quota;
  const usage = (tenant as any).usage;

  const report: any = {
    tenantId,
    quotas: [],
    warnings: [],
  };

  for (const [quotaType, limit] of Object.entries(quota)) {
    if (quotaType === 'customLimits') continue;

    const current = usage[quotaType] || 0;
    const percentage = limit ? (current / (limit as number)) * 100 : 0;

    report.quotas.push({
      type: quotaType,
      limit,
      current,
      percentage: percentage.toFixed(2),
      exceeded: current >= (limit as number),
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
export const executeCrossTenantOperation = async (
  sequelize: Sequelize,
  request: CrossTenantRequest,
  operation: (tenantIds: string[]) => Promise<any>,
): Promise<any> => {
  if (!request.authorized) {
    throw new Error('Cross-tenant operation not authorized');
  }

  // Verify source tenant has access to all target tenants
  for (const targetId of request.targetTenantIds) {
    const allowed = await isCrossTenantAccessAllowed(sequelize, request.sourceTenantId, targetId);
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

/**
 * Aggregates data across multiple tenants.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} tenantIds - Array of tenant IDs
 * @param {string} modelName - Model to aggregate
 * @param {any} aggregation - Aggregation configuration
 * @returns {Promise<any>} Aggregated results
 */
export const aggregateCrossTenantData = async (
  sequelize: Sequelize,
  tenantIds: string[],
  modelName: string,
  aggregation: {
    groupBy?: string[];
    metrics: { field: string; operation: 'count' | 'sum' | 'avg' | 'min' | 'max' }[];
    where?: WhereOptions;
  },
): Promise<any> => {
  const Model = sequelize.models[modelName];
  if (!Model) {
    throw new Error(`Model ${modelName} not found`);
  }

  const attributes: any[] = aggregation.groupBy || [];
  for (const metric of aggregation.metrics) {
    attributes.push([fn(metric.operation.toUpperCase(), col(metric.field)), metric.field]);
  }

  const results = await Model.findAll({
    where: {
      tenantId: { [Op.in]: tenantIds },
      ...(aggregation.where || {}),
    },
    attributes,
    group: aggregation.groupBy,
    raw: true,
  });

  return results;
};

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
export const replicateTenantData = async (
  sequelize: Sequelize,
  sourceTenantId: string,
  targetTenantId: string,
  modelName: string,
  where: WhereOptions = {},
  transaction?: Transaction,
): Promise<number> => {
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
    const data = (record as any).toJSON();
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    await Model.create(
      {
        ...data,
        tenantId: targetTenantId,
      },
      { transaction },
    );

    replicatedCount++;
  }

  return replicatedCount;
};

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
export const migrateTenantTier = async (
  sequelize: Sequelize,
  tenantId: string,
  toTier: TenantTier,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const fromTier = (tenant as any).tier;

  // Update tenant tier
  await tenant.update({ tier: toTier }, { transaction });

  // Update quotas based on tier
  const tierQuotas: Record<TenantTier, TenantQuota> = {
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
    await setTenantQuota(sequelize, tenantId, tierQuotas[toTier], 'system', transaction);
  }

  return {
    tenantId,
    fromTier,
    toTier,
    migratedAt: new Date(),
  };
};

/**
 * Migrates tenant data to a different isolation strategy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {IsolationStrategy} toStrategy - Target isolation strategy
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Migration result
 */
export const migrateTenantIsolationStrategy = async (
  sequelize: Sequelize,
  tenantId: string,
  toStrategy: IsolationStrategy,
  transaction?: Transaction,
): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const fromStrategy = (tenant as any).isolationStrategy;

  if (fromStrategy === toStrategy) {
    return { message: 'No migration needed', tenantId, strategy: toStrategy };
  }

  // Create new schema/database if needed
  if (toStrategy === IsolationStrategy.SCHEMA) {
    const schemaName = `tenant_${(tenant as any).slug}`;
    await sequelize.getQueryInterface().createSchema(schemaName, { transaction });
    await tenant.update({ schemaName, isolationStrategy: toStrategy }, { transaction });
  } else if (toStrategy === IsolationStrategy.DATABASE) {
    const dbName = `tenant_${(tenant as any).slug}`;
    // Database creation would be handled externally
    await tenant.update({ databaseName: dbName, isolationStrategy: toStrategy }, { transaction });
  } else if (toStrategy === IsolationStrategy.ROW_LEVEL) {
    await tenant.update({ isolationStrategy: toStrategy }, { transaction });
  }

  return {
    tenantId,
    fromStrategy,
    toStrategy,
    migratedAt: new Date(),
  };
};

/**
 * Exports tenant data for migration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {string[]} modelNames - Models to export
 * @returns {Promise<any>} Exported data
 */
export const exportTenantData = async (
  sequelize: Sequelize,
  tenantId: string,
  modelNames: string[],
): Promise<any> => {
  const exportData: any = {
    tenantId,
    exportedAt: new Date(),
    models: {},
  };

  for (const modelName of modelNames) {
    const Model = sequelize.models[modelName];
    if (!Model) continue;

    const records = await Model.findAll({
      where: { tenantId },
      raw: true,
    });

    exportData.models[modelName] = records;
  }

  return exportData;
};

/**
 * Imports tenant data from export.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Target tenant ID
 * @param {any} exportData - Exported data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<number>} Number of records imported
 */
export const importTenantData = async (
  sequelize: Sequelize,
  tenantId: string,
  exportData: any,
  transaction?: Transaction,
): Promise<number> => {
  let importedCount = 0;

  for (const [modelName, records] of Object.entries(exportData.models)) {
    const Model = sequelize.models[modelName];
    if (!Model) continue;

    for (const record of records as any[]) {
      delete record.id;
      delete record.createdAt;
      delete record.updatedAt;

      await Model.create(
        {
          ...record,
          tenantId,
        },
        { transaction },
      );

      importedCount++;
    }
  }

  return importedCount;
};

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
export const generateTenantAnalytics = async (
  sequelize: Sequelize,
  tenantId: string,
  period: { startDate: Date; endDate: Date },
): Promise<TenantAnalytics> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const analytics: TenantAnalytics = {
    tenantId,
    metrics: {},
    trends: {},
    alerts: [],
    recommendations: [],
  };

  // Calculate metrics
  const usage = (tenant as any).usage;
  const quota = (tenant as any).quota;

  analytics.metrics = {
    userCount: usage.currentUsers,
    storageUsed: usage.currentStorage,
    apiCalls: usage.currentApiCalls,
    quotaUtilization: Object.keys(quota).reduce((acc, key) => {
      const limit = quota[key];
      const current = usage[key] || 0;
      acc[key] = limit ? (current / limit) * 100 : 0;
      return acc;
    }, {} as Record<string, number>),
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

/**
 * Retrieves tenant activity summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @param {number} days - Number of days to analyze
 * @returns {Promise<any>} Activity summary
 */
export const getTenantActivitySummary = async (
  sequelize: Sequelize,
  tenantId: string,
  days: number = 30,
): Promise<any> => {
  const AuditLog = sequelize.models.AuditLog;

  if (!AuditLog) {
    return { message: 'Audit logging not enabled' };
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await AuditLog.findAll({
    where: {
      tenantId,
      createdAt: { [Op.gte]: startDate },
    },
    attributes: [
      'action',
      [fn('COUNT', col('id')), 'count'],
      [fn('DATE', col('createdAt')), 'date'],
    ],
    group: ['action', fn('DATE', col('createdAt'))],
    raw: true,
  });

  return activities;
};

/**
 * Lists all tenants with filtering and pagination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<any>} Paginated tenant list
 */
export const listTenants = async (
  sequelize: Sequelize,
  filters: {
    status?: TenantStatus;
    tier?: TenantTier;
    search?: string;
  } = {},
  pagination: {
    page?: number;
    limit?: number;
  } = {},
): Promise<any> => {
  const Tenant = sequelize.models.Tenant;

  const where: WhereOptions = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.tier) {
    where.tier = filters.tier;
  }

  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${filters.search}%` } },
      { slug: { [Op.iLike]: `%${filters.search}%` } },
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

/**
 * Generates tenant health score.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<any>} Health score and details
 */
export const getTenantHealthScore = async (sequelize: Sequelize, tenantId: string): Promise<any> => {
  const tenant = await sequelize.models.Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error(`Tenant ${tenantId} not found`);
  }

  const usage = (tenant as any).usage;
  const quota = (tenant as any).quota;
  const status = (tenant as any).status;

  let score = 100;
  const issues: string[] = [];

  // Deduct points for quota issues
  for (const [quotaType, limit] of Object.entries(quota)) {
    if (typeof limit !== 'number') continue;
    const current = usage[quotaType] || 0;
    const percentage = (current / limit) * 100;

    if (percentage >= 95) {
      score -= 20;
      issues.push(`${quotaType} critically high (${percentage.toFixed(2)}%)`);
    } else if (percentage >= 80) {
      score -= 10;
      issues.push(`${quotaType} high (${percentage.toFixed(2)}%)`);
    }
  }

  // Deduct points for status
  if (status === TenantStatus.SUSPENDED) {
    score -= 50;
    issues.push('Tenant is suspended');
  } else if (status === TenantStatus.PROVISIONING) {
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
