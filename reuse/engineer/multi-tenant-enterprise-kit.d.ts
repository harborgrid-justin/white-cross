/**
 * LOC: MULTI_TENANT_ENT_001
 * File: /reuse/engineer/multi-tenant-enterprise-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - @nestjs/typeorm
 *   - typeorm
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - cls-hooked
 *
 * DOWNSTREAM (imported by):
 *   - Tenant management modules
 *   - Multi-tenant middleware
 *   - Tenant-aware repositories
 *   - Tenant provisioning services
 *   - Billing and quota services
 */
import { DynamicModule, NestMiddleware } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder, ObjectLiteral, EntityTarget } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
/**
 * Tenant isolation strategy types
 */
export declare enum TenantIsolationStrategy {
    SCHEMA = "schema",// Each tenant has its own database schema
    DATABASE = "database",// Each tenant has its own database
    ROW_LEVEL = "row_level",// Shared tables with tenant_id discriminator
    HYBRID = "hybrid"
}
/**
 * Tenant status types
 */
export declare enum TenantStatus {
    PROVISIONING = "provisioning",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    TRIAL = "trial",
    EXPIRED = "expired",
    TERMINATED = "terminated",
    MIGRATING = "migrating"
}
/**
 * Tenant tier/plan types
 */
export declare enum TenantTier {
    FREE = "free",
    STARTER = "starter",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise",
    CUSTOM = "custom"
}
/**
 * Tenant lifecycle event types
 */
export declare enum TenantEventType {
    CREATED = "created",
    ACTIVATED = "activated",
    SUSPENDED = "suspended",
    REACTIVATED = "reactivated",
    UPGRADED = "upgraded",
    DOWNGRADED = "downgraded",
    TERMINATED = "terminated",
    CONFIG_CHANGED = "config_changed",
    QUOTA_EXCEEDED = "quota_exceeded"
}
/**
 * Base tenant entity interface
 */
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    subdomain?: string;
    status: TenantStatus;
    tier: TenantTier;
    isolationStrategy: TenantIsolationStrategy;
    schemaName?: string;
    databaseName?: string;
    connectionString?: string;
    config: TenantConfig;
    quotas: TenantQuotas;
    features: TenantFeatures;
    branding: TenantBranding;
    metadata: Record<string, any>;
    parentTenantId?: string;
    createdAt: Date;
    updatedAt: Date;
    activatedAt?: Date;
    suspendedAt?: Date;
    expiresAt?: Date;
}
/**
 * Tenant configuration
 */
export interface TenantConfig {
    timezone: string;
    locale: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    settings: Record<string, any>;
    integrations: Record<string, any>;
    customFields: Record<string, any>;
}
/**
 * Tenant resource quotas
 */
export interface TenantQuotas {
    maxUsers: number;
    maxStorage: number;
    maxApiCalls: number;
    maxDatabaseRows: number;
    maxFileUploads: number;
    maxConcurrentConnections: number;
    customQuotas: Record<string, number>;
}
/**
 * Tenant feature flags
 */
export interface TenantFeatures {
    apiAccess: boolean;
    customBranding: boolean;
    sso: boolean;
    advancedReporting: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    whiteLabeling: boolean;
    customDomain: boolean;
    features: Record<string, boolean>;
}
/**
 * Tenant branding configuration
 */
export interface TenantBranding {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    faviconUrl?: string;
    companyName?: string;
    supportEmail?: string;
    customCss?: string;
    customJs?: string;
}
/**
 * Tenant usage metrics
 */
export interface TenantUsage {
    tenantId: string;
    period: Date;
    userCount: number;
    storageUsed: number;
    apiCalls: number;
    databaseRows: number;
    fileUploads: number;
    concurrentConnections: number;
    customMetrics: Record<string, number>;
}
/**
 * Tenant billing information
 */
export interface TenantBilling {
    tenantId: string;
    tier: TenantTier;
    billingCycle: 'monthly' | 'yearly';
    amount: number;
    currency: string;
    paymentMethod?: string;
    nextBillingDate?: Date;
    billingContact?: {
        name: string;
        email: string;
        phone?: string;
    };
}
/**
 * Tenant provisioning request
 */
export interface TenantProvisioningRequest {
    name: string;
    slug: string;
    domain?: string;
    tier: TenantTier;
    isolationStrategy: TenantIsolationStrategy;
    adminUser: {
        email: string;
        firstName: string;
        lastName: string;
        password?: string;
    };
    config?: Partial<TenantConfig>;
    metadata?: Record<string, any>;
}
/**
 * Tenant context for request scope
 */
export interface TenantContext {
    tenantId: string;
    tenant: Tenant;
    user?: any;
    permissions?: string[];
    metadata?: Record<string, any>;
}
/**
 * Tenant migration options
 */
export interface TenantMigrationOptions {
    sourceTenantId: string;
    targetTenantId: string;
    includeUsers: boolean;
    includeData: boolean;
    includeConfig: boolean;
    dataMappings?: Record<string, string>;
    transformations?: Array<(data: any) => any>;
}
/**
 * Tenant backup configuration
 */
export interface TenantBackupConfig {
    tenantId: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    includeFiles: boolean;
    includeDatabase: boolean;
    destination: string;
    encryption: boolean;
}
/**
 * Tenant configuration schema
 */
export declare const TenantConfigSchema: any;
/**
 * Tenant quotas schema
 */
export declare const TenantQuotasSchema: any;
/**
 * Tenant features schema
 */
export declare const TenantFeaturesSchema: any;
/**
 * Tenant branding schema
 */
export declare const TenantBrandingSchema: any;
/**
 * Tenant provisioning schema
 */
export declare const TenantProvisioningSchema: any;
/**
 * Register tenant configuration namespace
 *
 * @param defaults - Default tenant configuration values
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerTenantConfig({ timezone: 'UTC', locale: 'en-US' })],
 * })
 * ```
 */
export declare function registerTenantConfig(defaults?: Partial<TenantConfig>): any;
/**
 * Create tenant-specific configuration module
 *
 * @param tenantId - Tenant identifier
 * @returns DynamicModule for tenant config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createTenantConfigModule('tenant-123')],
 * })
 * export class TenantModule {}
 * ```
 */
export declare function createTenantConfigModule(tenantId: string): DynamicModule;
/**
 * Validate tenant configuration against schema
 *
 * @param config - Tenant configuration to validate
 * @returns Validated and typed configuration
 *
 * @example
 * ```typescript
 * const validated = validateTenantConfig(tenantConfig);
 * ```
 */
export declare function validateTenantConfig(config: unknown): TenantConfig;
/**
 * Merge tenant configuration with defaults
 *
 * @param tenantConfig - Tenant-specific configuration
 * @param defaults - Default configuration values
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const config = mergeTenantConfig(tenant.config, defaultConfig);
 * ```
 */
export declare function mergeTenantConfig(tenantConfig: Partial<TenantConfig>, defaults: TenantConfig): TenantConfig;
/**
 * Provision new tenant with complete setup
 *
 * @param request - Tenant provisioning request
 * @param dataSource - TypeORM data source
 * @returns Provisioned tenant entity
 *
 * @example
 * ```typescript
 * const tenant = await provisionTenant({
 *   name: 'Acme Corp',
 *   slug: 'acme',
 *   tier: TenantTier.ENTERPRISE,
 *   isolationStrategy: TenantIsolationStrategy.SCHEMA,
 *   adminUser: { email: 'admin@acme.com', ... },
 * }, dataSource);
 * ```
 */
export declare function provisionTenant(request: TenantProvisioningRequest, dataSource: DataSource): Promise<Tenant>;
/**
 * Generate unique tenant identifier
 *
 * @returns Unique tenant ID
 *
 * @example
 * ```typescript
 * const tenantId = generateTenantId(); // 'tnt_a1b2c3d4e5f6'
 * ```
 */
export declare function generateTenantId(): string;
/**
 * Generate tenant isolation resources (schema/database names)
 *
 * @param strategy - Isolation strategy
 * @param slug - Tenant slug
 * @returns Schema and database names
 *
 * @example
 * ```typescript
 * const { schemaName, databaseName } = await generateTenantIsolation(
 *   TenantIsolationStrategy.SCHEMA,
 *   'acme'
 * );
 * ```
 */
export declare function generateTenantIsolation(strategy: TenantIsolationStrategy, slug: string): Promise<{
    schemaName?: string;
    databaseName?: string;
}>;
/**
 * Create tenant database or schema based on isolation strategy
 *
 * @param tenant - Tenant entity
 * @param dataSource - TypeORM data source
 *
 * @example
 * ```typescript
 * await createTenantIsolation(tenant, dataSource);
 * ```
 */
export declare function createTenantIsolation(tenant: Tenant, dataSource: DataSource): Promise<void>;
/**
 * Run database migrations for tenant schema
 *
 * @param tenant - Tenant entity
 * @param dataSource - TypeORM data source
 *
 * @example
 * ```typescript
 * await runTenantMigrations(tenant, dataSource);
 * ```
 */
export declare function runTenantMigrations(tenant: Tenant, dataSource: DataSource): Promise<void>;
/**
 * Create tenant admin user during provisioning
 *
 * @param tenant - Tenant entity
 * @param adminUser - Admin user details
 * @param dataSource - TypeORM data source
 *
 * @example
 * ```typescript
 * await createTenantAdminUser(tenant, adminUserData, dataSource);
 * ```
 */
export declare function createTenantAdminUser(tenant: Tenant, adminUser: TenantProvisioningRequest['adminUser'], dataSource: DataSource): Promise<void>;
/**
 * Rollback tenant provisioning on failure
 *
 * @param tenant - Tenant entity
 * @param dataSource - TypeORM data source
 *
 * @example
 * ```typescript
 * await rollbackTenantProvisioning(tenant, dataSource);
 * ```
 */
export declare function rollbackTenantProvisioning(tenant: Tenant, dataSource: DataSource): Promise<void>;
/**
 * Set current tenant context
 *
 * @param context - Tenant context
 *
 * @example
 * ```typescript
 * setTenantContext({ tenantId: 'tnt_123', tenant });
 * ```
 */
export declare function setTenantContext(context: TenantContext): void;
/**
 * Get current tenant context
 *
 * @returns Current tenant context or undefined
 *
 * @example
 * ```typescript
 * const context = getTenantContext();
 * if (context) {
 *   console.log(`Current tenant: ${context.tenant.name}`);
 * }
 * ```
 */
export declare function getTenantContext(): TenantContext | undefined;
/**
 * Get current tenant ID from context
 *
 * @returns Current tenant ID
 * @throws ForbiddenException if no tenant context
 *
 * @example
 * ```typescript
 * const tenantId = getCurrentTenantId();
 * ```
 */
export declare function getCurrentTenantId(): string;
/**
 * Get current tenant from context
 *
 * @returns Current tenant entity
 * @throws ForbiddenException if no tenant context
 *
 * @example
 * ```typescript
 * const tenant = getCurrentTenant();
 * console.log(tenant.name);
 * ```
 */
export declare function getCurrentTenant(): Tenant;
/**
 * Execute function within tenant context
 *
 * @param context - Tenant context
 * @param fn - Function to execute
 * @returns Function result
 *
 * @example
 * ```typescript
 * const result = await runInTenantContext(
 *   { tenantId: 'tnt_123', tenant },
 *   async () => {
 *     return await someService.doWork();
 *   }
 * );
 * ```
 */
export declare function runInTenantContext<T>(context: TenantContext, fn: () => T | Promise<T>): Promise<T>;
/**
 * Middleware to extract and set tenant context from request
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(TenantContextMiddleware).forRoutes('*');
 *   }
 * }
 * ```
 */
export declare class TenantContextMiddleware implements NestMiddleware {
    private readonly tenantService;
    constructor(tenantService: any);
    use(req: Request, res: Response, next: NextFunction): Promise<any>;
    private extractTenantId;
}
/**
 * Decorator to inject current tenant into controller/resolver
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentTenant() tenant: Tenant) {
 *   return { tenant: tenant.name };
 * }
 * ```
 */
export declare const CurrentTenant: any;
/**
 * Decorator to inject current tenant ID
 *
 * @example
 * ```typescript
 * @Get('data')
 * getData(@TenantId() tenantId: string) {
 *   return this.service.findByTenant(tenantId);
 * }
 * ```
 */
export declare const TenantId: any;
/**
 * Create tenant-aware repository
 *
 * @param entityTarget - Entity class or name
 * @param dataSource - TypeORM data source
 * @returns Tenant-aware repository
 *
 * @example
 * ```typescript
 * const userRepo = createTenantRepository(User, dataSource);
 * const users = await userRepo.find(); // Automatically filtered by tenant
 * ```
 */
export declare function createTenantRepository<Entity extends ObjectLiteral>(entityTarget: EntityTarget<Entity>, dataSource: DataSource): Repository<Entity>;
/**
 * Add tenant filter to query builder
 *
 * @param qb - TypeORM query builder
 * @param alias - Entity alias
 * @returns Query builder with tenant filter
 *
 * @example
 * ```typescript
 * const qb = repository.createQueryBuilder('user');
 * const tenantQb = addTenantFilter(qb, 'user');
 * const users = await tenantQb.getMany();
 * ```
 */
export declare function addTenantFilter<Entity>(qb: SelectQueryBuilder<Entity>, alias: string): SelectQueryBuilder<Entity>;
/**
 * Create tenant-scoped query builder
 *
 * @param repository - Entity repository
 * @param alias - Entity alias
 * @returns Tenant-scoped query builder
 *
 * @example
 * ```typescript
 * const qb = createTenantQueryBuilder(userRepository, 'user');
 * const users = await qb.where('user.active = :active', { active: true }).getMany();
 * ```
 */
export declare function createTenantQueryBuilder<Entity extends ObjectLiteral>(repository: Repository<Entity>, alias: string): SelectQueryBuilder<Entity>;
/**
 * Set tenant schema for database connection
 *
 * @param dataSource - TypeORM data source
 * @param schemaName - Schema name
 *
 * @example
 * ```typescript
 * await setTenantSchema(dataSource, 'tenant_acme');
 * ```
 */
export declare function setTenantSchema(dataSource: DataSource, schemaName: string): Promise<void>;
/**
 * Get tenant-specific data source connection
 *
 * @param tenant - Tenant entity
 * @param baseDataSource - Base data source
 * @returns Tenant-specific data source
 *
 * @example
 * ```typescript
 * const tenantDs = await getTenantDataSource(tenant, dataSource);
 * const userRepo = tenantDs.getRepository(User);
 * ```
 */
export declare function getTenantDataSource(tenant: Tenant, baseDataSource: DataSource): Promise<DataSource>;
/**
 * Get default quotas for tenant tier
 *
 * @param tier - Tenant tier
 * @returns Default quota configuration
 *
 * @example
 * ```typescript
 * const quotas = getDefaultQuotasForTier(TenantTier.ENTERPRISE);
 * ```
 */
export declare function getDefaultQuotasForTier(tier: TenantTier): TenantQuotas;
/**
 * Get default features for tenant tier
 *
 * @param tier - Tenant tier
 * @returns Default feature configuration
 *
 * @example
 * ```typescript
 * const features = getDefaultFeaturesForTier(TenantTier.PROFESSIONAL);
 * ```
 */
export declare function getDefaultFeaturesForTier(tier: TenantTier): TenantFeatures;
/**
 * Check if tenant has exceeded quota
 *
 * @param tenant - Tenant entity
 * @param usage - Current usage metrics
 * @param quotaType - Quota type to check
 * @returns Whether quota is exceeded
 *
 * @example
 * ```typescript
 * const exceeded = checkQuotaExceeded(tenant, usage, 'maxUsers');
 * if (exceeded) {
 *   throw new ForbiddenException('User quota exceeded');
 * }
 * ```
 */
export declare function checkQuotaExceeded(tenant: Tenant, usage: TenantUsage, quotaType: keyof TenantQuotas): boolean;
/**
 * Enforce tenant quota before operation
 *
 * @param quotaType - Quota type to check
 * @param increment - Amount to increment usage by
 * @throws ForbiddenException if quota would be exceeded
 *
 * @example
 * ```typescript
 * await enforceTenantQuota('maxUsers', 1);
 * // Create user if quota not exceeded
 * ```
 */
export declare function enforceTenantQuota(quotaType: keyof TenantQuotas, increment?: number): Promise<void>;
/**
 * Migrate data between tenants
 *
 * @param options - Migration options
 * @param dataSource - TypeORM data source
 * @returns Migration result
 *
 * @example
 * ```typescript
 * await migrateTenantData({
 *   sourceTenantId: 'tnt_old',
 *   targetTenantId: 'tnt_new',
 *   includeUsers: true,
 *   includeData: true,
 * }, dataSource);
 * ```
 */
export declare function migrateTenantData(options: TenantMigrationOptions, dataSource: DataSource): Promise<{
    success: boolean;
    migratedRecords: number;
}>;
/**
 * Clone tenant with all data
 *
 * @param sourceTenantId - Source tenant ID
 * @param newTenantName - New tenant name
 * @param dataSource - TypeORM data source
 * @returns Cloned tenant
 *
 * @example
 * ```typescript
 * const cloned = await cloneTenant('tnt_template', 'New Customer', dataSource);
 * ```
 */
export declare function cloneTenant(sourceTenantId: string, newTenantName: string, dataSource: DataSource): Promise<Tenant>;
/**
 * Suspend tenant access
 *
 * @param tenantId - Tenant ID
 * @param reason - Suspension reason
 *
 * @example
 * ```typescript
 * await suspendTenant('tnt_123', 'Payment overdue');
 * ```
 */
export declare function suspendTenant(tenantId: string, reason: string): Promise<void>;
/**
 * Reactivate suspended tenant
 *
 * @param tenantId - Tenant ID
 *
 * @example
 * ```typescript
 * await reactivateTenant('tnt_123');
 * ```
 */
export declare function reactivateTenant(tenantId: string): Promise<void>;
/**
 * Terminate tenant and cleanup resources
 *
 * @param tenantId - Tenant ID
 * @param dataSource - TypeORM data source
 *
 * @example
 * ```typescript
 * await terminateTenant('tnt_123', dataSource);
 * ```
 */
export declare function terminateTenant(tenantId: string, dataSource: DataSource): Promise<void>;
/**
 * Generate tenant slug from name
 *
 * @param name - Tenant name
 * @returns URL-safe slug
 *
 * @example
 * ```typescript
 * const slug = generateTenantSlug('Acme Corporation'); // 'acme-corporation'
 * ```
 */
export declare function generateTenantSlug(name: string): string;
/**
 * Validate tenant access for current user
 *
 * @param tenantId - Tenant ID to validate
 * @throws ForbiddenException if access denied
 *
 * @example
 * ```typescript
 * validateTenantAccess(requestedTenantId);
 * ```
 */
export declare function validateTenantAccess(tenantId: string): void;
declare const _default: {
    registerTenantConfig: typeof registerTenantConfig;
    createTenantConfigModule: typeof createTenantConfigModule;
    validateTenantConfig: typeof validateTenantConfig;
    mergeTenantConfig: typeof mergeTenantConfig;
    provisionTenant: typeof provisionTenant;
    generateTenantId: typeof generateTenantId;
    generateTenantIsolation: typeof generateTenantIsolation;
    createTenantIsolation: typeof createTenantIsolation;
    runTenantMigrations: typeof runTenantMigrations;
    rollbackTenantProvisioning: typeof rollbackTenantProvisioning;
    setTenantContext: typeof setTenantContext;
    getTenantContext: typeof getTenantContext;
    getCurrentTenantId: typeof getCurrentTenantId;
    getCurrentTenant: typeof getCurrentTenant;
    runInTenantContext: typeof runInTenantContext;
    createTenantRepository: typeof createTenantRepository;
    addTenantFilter: typeof addTenantFilter;
    createTenantQueryBuilder: typeof createTenantQueryBuilder;
    setTenantSchema: typeof setTenantSchema;
    getTenantDataSource: typeof getTenantDataSource;
    getDefaultQuotasForTier: typeof getDefaultQuotasForTier;
    getDefaultFeaturesForTier: typeof getDefaultFeaturesForTier;
    checkQuotaExceeded: typeof checkQuotaExceeded;
    enforceTenantQuota: typeof enforceTenantQuota;
    migrateTenantData: typeof migrateTenantData;
    cloneTenant: typeof cloneTenant;
    suspendTenant: typeof suspendTenant;
    reactivateTenant: typeof reactivateTenant;
    terminateTenant: typeof terminateTenant;
    generateTenantSlug: typeof generateTenantSlug;
    validateTenantAccess: typeof validateTenantAccess;
};
export default _default;
//# sourceMappingURL=multi-tenant-enterprise-kit.d.ts.map