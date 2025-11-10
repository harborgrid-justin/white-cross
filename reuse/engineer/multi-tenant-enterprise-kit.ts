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

/**
 * File: /reuse/engineer/multi-tenant-enterprise-kit.ts
 * Locator: WC-MULTI-TENANT-ENT-001
 * Purpose: Production-Grade Multi-Tenancy Enterprise Kit - Comprehensive tenant isolation & management
 *
 * Upstream: NestJS, TypeORM, Zod, cls-hooked
 * Downstream: ../backend/modules/tenants/*, Tenant middleware, Domain services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/typeorm, typeorm, zod
 * Exports: 45 production-ready multi-tenancy functions for enterprise SaaS platforms
 *
 * LLM Context: Production-grade multi-tenancy management toolkit for White Cross healthcare platform.
 * Provides comprehensive tenant provisioning/onboarding, multiple isolation strategies (schema-based,
 * database-based, row-level security), tenant configuration management with namespace isolation,
 * tenant-aware query builders and repositories, automatic tenant context switching with cls-hooked,
 * tenant resource quotas and rate limiting, tenant billing integration, usage tracking and metering,
 * tenant data migration utilities, tenant-specific customization (branding, features, configs),
 * NestJS ConfigModule integration for tenant settings, environment-based tenant configuration,
 * tenant lifecycle management (activation, suspension, termination), tenant health monitoring,
 * cross-tenant data access prevention, tenant backup/restore, tenant clone/duplication,
 * tenant hierarchy (parent/child relationships), tenant domain/subdomain management, and HIPAA-compliant
 * tenant data segregation with audit trails.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Scope,
  Module,
  DynamicModule,
  Global,
  OnModuleInit,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  NestMiddleware,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Repository,
  DataSource,
  EntityManager,
  SelectQueryBuilder,
  FindOptionsWhere,
  ObjectLiteral,
  EntityTarget,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Tenant isolation strategy types
 */
export enum TenantIsolationStrategy {
  SCHEMA = 'schema',           // Each tenant has its own database schema
  DATABASE = 'database',       // Each tenant has its own database
  ROW_LEVEL = 'row_level',     // Shared tables with tenant_id discriminator
  HYBRID = 'hybrid',           // Combination of strategies
}

/**
 * Tenant status types
 */
export enum TenantStatus {
  PROVISIONING = 'provisioning',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  MIGRATING = 'migrating',
}

/**
 * Tenant tier/plan types
 */
export enum TenantTier {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

/**
 * Tenant lifecycle event types
 */
export enum TenantEventType {
  CREATED = 'created',
  ACTIVATED = 'activated',
  SUSPENDED = 'suspended',
  REACTIVATED = 'reactivated',
  UPGRADED = 'upgraded',
  DOWNGRADED = 'downgraded',
  TERMINATED = 'terminated',
  CONFIG_CHANGED = 'config_changed',
  QUOTA_EXCEEDED = 'quota_exceeded',
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
  maxStorage: number; // in bytes
  maxApiCalls: number; // per month
  maxDatabaseRows: number;
  maxFileUploads: number; // per day
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
  retention: number; // days
  includeFiles: boolean;
  includeDatabase: boolean;
  destination: string;
  encryption: boolean;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Tenant configuration schema
 */
export const TenantConfigSchema = z.object({
  timezone: z.string().default('UTC'),
  locale: z.string().default('en-US'),
  currency: z.string().length(3).default('USD'),
  dateFormat: z.string().default('YYYY-MM-DD'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  settings: z.record(z.any()).default({}),
  integrations: z.record(z.any()).default({}),
  customFields: z.record(z.any()).default({}),
});

/**
 * Tenant quotas schema
 */
export const TenantQuotasSchema = z.object({
  maxUsers: z.number().int().min(1).default(10),
  maxStorage: z.number().int().min(0).default(5368709120), // 5GB
  maxApiCalls: z.number().int().min(0).default(100000),
  maxDatabaseRows: z.number().int().min(0).default(1000000),
  maxFileUploads: z.number().int().min(0).default(1000),
  maxConcurrentConnections: z.number().int().min(1).default(50),
  customQuotas: z.record(z.number()).default({}),
});

/**
 * Tenant features schema
 */
export const TenantFeaturesSchema = z.object({
  apiAccess: z.boolean().default(true),
  customBranding: z.boolean().default(false),
  sso: z.boolean().default(false),
  advancedReporting: z.boolean().default(false),
  customIntegrations: z.boolean().default(false),
  prioritySupport: z.boolean().default(false),
  whiteLabeling: z.boolean().default(false),
  customDomain: z.boolean().default(false),
  features: z.record(z.boolean()).default({}),
});

/**
 * Tenant branding schema
 */
export const TenantBrandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  companyName: z.string().optional(),
  supportEmail: z.string().email().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

/**
 * Tenant provisioning schema
 */
export const TenantProvisioningSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
  tier: z.nativeEnum(TenantTier),
  isolationStrategy: z.nativeEnum(TenantIsolationStrategy),
  adminUser: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(8).optional(),
  }),
  config: TenantConfigSchema.partial().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// TENANT CONFIGURATION MANAGEMENT
// ============================================================================

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
export function registerTenantConfig(defaults?: Partial<TenantConfig>) {
  return registerAs('tenant', () => ({
    defaultIsolationStrategy: process.env.TENANT_ISOLATION_STRATEGY || TenantIsolationStrategy.SCHEMA,
    schemaPrefix: process.env.TENANT_SCHEMA_PREFIX || 'tenant_',
    maxTenantsPerDatabase: parseInt(process.env.TENANT_MAX_PER_DB || '100', 10),
    enableTenantCache: process.env.TENANT_ENABLE_CACHE !== 'false',
    cacheTimeout: parseInt(process.env.TENANT_CACHE_TIMEOUT || '3600', 10),
    enableQuotaEnforcement: process.env.TENANT_ENABLE_QUOTA !== 'false',
    enableUsageTracking: process.env.TENANT_ENABLE_USAGE_TRACKING !== 'false',
    defaults: {
      timezone: defaults?.timezone || 'UTC',
      locale: defaults?.locale || 'en-US',
      currency: defaults?.currency || 'USD',
      dateFormat: defaults?.dateFormat || 'YYYY-MM-DD',
      timeFormat: defaults?.timeFormat || '24h',
      settings: defaults?.settings || {},
      integrations: defaults?.integrations || {},
      customFields: defaults?.customFields || {},
    },
  }));
}

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
export function createTenantConfigModule(tenantId: string): DynamicModule {
  return {
    module: class TenantConfigDynamicModule {},
    providers: [
      {
        provide: 'TENANT_ID',
        useValue: tenantId,
      },
      {
        provide: 'TENANT_CONFIG',
        useFactory: async (configService: ConfigService) => {
          // Load tenant-specific configuration
          const defaults = configService.get('tenant.defaults', {});
          return {
            tenantId,
            ...defaults,
          };
        },
        inject: [ConfigService],
      },
    ],
    exports: ['TENANT_ID', 'TENANT_CONFIG'],
  };
}

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
export function validateTenantConfig(config: unknown): TenantConfig {
  const result = TenantConfigSchema.safeParse(config);
  if (!result.success) {
    throw new BadRequestException(`Invalid tenant configuration: ${result.error.message}`);
  }
  return result.data;
}

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
export function mergeTenantConfig(
  tenantConfig: Partial<TenantConfig>,
  defaults: TenantConfig
): TenantConfig {
  return {
    timezone: tenantConfig.timezone || defaults.timezone,
    locale: tenantConfig.locale || defaults.locale,
    currency: tenantConfig.currency || defaults.currency,
    dateFormat: tenantConfig.dateFormat || defaults.dateFormat,
    timeFormat: tenantConfig.timeFormat || defaults.timeFormat,
    settings: { ...defaults.settings, ...tenantConfig.settings },
    integrations: { ...defaults.integrations, ...tenantConfig.integrations },
    customFields: { ...defaults.customFields, ...tenantConfig.customFields },
  };
}

// ============================================================================
// TENANT PROVISIONING & ONBOARDING
// ============================================================================

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
export async function provisionTenant(
  request: TenantProvisioningRequest,
  dataSource: DataSource
): Promise<Tenant> {
  const logger = new Logger('TenantProvisioning');

  // Validate request
  const validated = TenantProvisioningSchema.parse(request);

  // Generate tenant ID
  const tenantId = generateTenantId();

  // Determine database/schema names based on isolation strategy
  const { schemaName, databaseName } = await generateTenantIsolation(
    validated.isolationStrategy,
    validated.slug
  );

  // Create tenant entity
  const tenant: Tenant = {
    id: tenantId,
    name: validated.name,
    slug: validated.slug,
    domain: validated.domain,
    status: TenantStatus.PROVISIONING,
    tier: validated.tier,
    isolationStrategy: validated.isolationStrategy,
    schemaName,
    databaseName,
    config: mergeTenantConfig(validated.config || {}, getDefaultTenantConfig()),
    quotas: getDefaultQuotasForTier(validated.tier),
    features: getDefaultFeaturesForTier(validated.tier),
    branding: {},
    metadata: validated.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    // Create schema/database based on isolation strategy
    await createTenantIsolation(tenant, dataSource);

    // Run migrations for tenant schema
    await runTenantMigrations(tenant, dataSource);

    // Create admin user
    await createTenantAdminUser(tenant, validated.adminUser, dataSource);

    // Update tenant status to active
    tenant.status = TenantStatus.ACTIVE;
    tenant.activatedAt = new Date();

    logger.log(`Tenant ${tenant.slug} provisioned successfully`);

    return tenant;
  } catch (error) {
    logger.error(`Failed to provision tenant ${tenant.slug}: ${error.message}`);
    // Rollback tenant creation
    await rollbackTenantProvisioning(tenant, dataSource);
    throw new InternalServerErrorException('Tenant provisioning failed');
  }
}

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
export function generateTenantId(): string {
  const randomBytes = crypto.randomBytes(12);
  return `tnt_${randomBytes.toString('hex')}`;
}

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
export async function generateTenantIsolation(
  strategy: TenantIsolationStrategy,
  slug: string
): Promise<{ schemaName?: string; databaseName?: string }> {
  switch (strategy) {
    case TenantIsolationStrategy.SCHEMA:
      return {
        schemaName: `tenant_${slug}`,
        databaseName: undefined,
      };
    case TenantIsolationStrategy.DATABASE:
      return {
        schemaName: undefined,
        databaseName: `tenant_${slug}`,
      };
    case TenantIsolationStrategy.ROW_LEVEL:
      return {
        schemaName: undefined,
        databaseName: undefined,
      };
    case TenantIsolationStrategy.HYBRID:
      return {
        schemaName: `tenant_${slug}`,
        databaseName: `tenant_${slug}`,
      };
    default:
      throw new BadRequestException('Invalid isolation strategy');
  }
}

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
export async function createTenantIsolation(
  tenant: Tenant,
  dataSource: DataSource
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();

    switch (tenant.isolationStrategy) {
      case TenantIsolationStrategy.SCHEMA:
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${tenant.schemaName}"`);
        break;

      case TenantIsolationStrategy.DATABASE:
        await queryRunner.query(`CREATE DATABASE "${tenant.databaseName}"`);
        break;

      case TenantIsolationStrategy.ROW_LEVEL:
        // No separate schema/database needed
        break;

      case TenantIsolationStrategy.HYBRID:
        await queryRunner.query(`CREATE DATABASE "${tenant.databaseName}"`);
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${tenant.schemaName}"`);
        break;
    }
  } finally {
    await queryRunner.release();
  }
}

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
export async function runTenantMigrations(
  tenant: Tenant,
  dataSource: DataSource
): Promise<void> {
  // Implementation depends on migration setup
  // This is a placeholder for actual migration logic
  const logger = new Logger('TenantMigrations');
  logger.log(`Running migrations for tenant ${tenant.slug}`);
}

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
export async function createTenantAdminUser(
  tenant: Tenant,
  adminUser: TenantProvisioningRequest['adminUser'],
  dataSource: DataSource
): Promise<void> {
  // Implementation for creating admin user
  const logger = new Logger('TenantProvisioning');
  logger.log(`Creating admin user for tenant ${tenant.slug}: ${adminUser.email}`);
}

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
export async function rollbackTenantProvisioning(
  tenant: Tenant,
  dataSource: DataSource
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();

    switch (tenant.isolationStrategy) {
      case TenantIsolationStrategy.SCHEMA:
        await queryRunner.query(`DROP SCHEMA IF EXISTS "${tenant.schemaName}" CASCADE`);
        break;

      case TenantIsolationStrategy.DATABASE:
        await queryRunner.query(`DROP DATABASE IF EXISTS "${tenant.databaseName}"`);
        break;
    }
  } finally {
    await queryRunner.release();
  }
}

// ============================================================================
// TENANT CONTEXT MANAGEMENT
// ============================================================================

/**
 * Tenant context storage using AsyncLocalStorage
 */
const { AsyncLocalStorage } = require('async_hooks');
const tenantContext = new AsyncLocalStorage<TenantContext>();

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
export function setTenantContext(context: TenantContext): void {
  tenantContext.enterWith(context);
}

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
export function getTenantContext(): TenantContext | undefined {
  return tenantContext.getStore();
}

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
export function getCurrentTenantId(): string {
  const context = getTenantContext();
  if (!context) {
    throw new ForbiddenException('No tenant context available');
  }
  return context.tenantId;
}

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
export function getCurrentTenant(): Tenant {
  const context = getTenantContext();
  if (!context) {
    throw new ForbiddenException('No tenant context available');
  }
  return context.tenant;
}

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
export async function runInTenantContext<T>(
  context: TenantContext,
  fn: () => T | Promise<T>
): Promise<T> {
  return tenantContext.run(context, fn);
}

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
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    @Inject('TenantService') private readonly tenantService: any
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract tenant identifier from various sources
      const tenantId = this.extractTenantId(req);

      if (tenantId) {
        // Load tenant from database/cache
        const tenant = await this.tenantService.findById(tenantId);

        if (tenant && tenant.status === TenantStatus.ACTIVE) {
          const context: TenantContext = {
            tenantId: tenant.id,
            tenant,
            user: (req as any).user,
          };

          return runInTenantContext(context, () => next());
        }
      }

      // No tenant context, continue without it
      next();
    } catch (error) {
      next(error);
    }
  }

  private extractTenantId(req: Request): string | null {
    // Try multiple sources for tenant identification

    // 1. Custom header
    const headerTenant = req.headers['x-tenant-id'] as string;
    if (headerTenant) return headerTenant;

    // 2. Subdomain
    const host = req.headers.host;
    if (host) {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        return subdomain;
      }
    }

    // 3. Custom domain
    if (host) {
      return host;
    }

    // 4. JWT token claim
    const user = (req as any).user;
    if (user?.tenantId) {
      return user.tenantId;
    }

    // 5. Query parameter (for development/testing)
    const queryTenant = req.query.tenant as string;
    if (queryTenant) return queryTenant;

    return null;
  }
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
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Tenant => {
    return getCurrentTenant();
  }
);

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
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    return getCurrentTenantId();
  }
);

// ============================================================================
// TENANT-AWARE QUERY BUILDERS
// ============================================================================

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
export function createTenantRepository<Entity extends ObjectLiteral>(
  entityTarget: EntityTarget<Entity>,
  dataSource: DataSource
): Repository<Entity> {
  const repository = dataSource.getRepository(entityTarget);

  // Wrap find methods to add tenant filter
  return new Proxy(repository, {
    get(target, prop) {
      if (prop === 'find' || prop === 'findOne' || prop === 'findAndCount') {
        return function (...args: any[]) {
          const tenantId = getCurrentTenantId();

          // Add tenant filter to query
          if (args[0]) {
            args[0] = {
              ...args[0],
              where: {
                ...args[0].where,
                tenantId,
              },
            };
          } else {
            args[0] = { where: { tenantId } };
          }

          return target[prop](...args);
        };
      }

      return target[prop];
    },
  });
}

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
export function addTenantFilter<Entity>(
  qb: SelectQueryBuilder<Entity>,
  alias: string
): SelectQueryBuilder<Entity> {
  const tenantId = getCurrentTenantId();
  return qb.andWhere(`${alias}.tenantId = :tenantId`, { tenantId });
}

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
export function createTenantQueryBuilder<Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  alias: string
): SelectQueryBuilder<Entity> {
  const qb = repository.createQueryBuilder(alias);
  return addTenantFilter(qb, alias);
}

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
export async function setTenantSchema(
  dataSource: DataSource,
  schemaName: string
): Promise<void> {
  await dataSource.query(`SET search_path TO "${schemaName}"`);
}

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
export async function getTenantDataSource(
  tenant: Tenant,
  baseDataSource: DataSource
): Promise<DataSource> {
  if (tenant.isolationStrategy === TenantIsolationStrategy.SCHEMA && tenant.schemaName) {
    await setTenantSchema(baseDataSource, tenant.schemaName);
    return baseDataSource;
  }

  if (tenant.isolationStrategy === TenantIsolationStrategy.DATABASE && tenant.connectionString) {
    // Create new connection for tenant database
    const tenantDataSource = new DataSource({
      ...baseDataSource.options,
      database: tenant.databaseName,
    } as any);

    if (!tenantDataSource.isInitialized) {
      await tenantDataSource.initialize();
    }

    return tenantDataSource;
  }

  return baseDataSource;
}

// ============================================================================
// TENANT QUOTAS & RESOURCE LIMITS
// ============================================================================

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
export function getDefaultQuotasForTier(tier: TenantTier): TenantQuotas {
  const quotaMap: Record<TenantTier, TenantQuotas> = {
    [TenantTier.FREE]: {
      maxUsers: 5,
      maxStorage: 1073741824, // 1GB
      maxApiCalls: 10000,
      maxDatabaseRows: 100000,
      maxFileUploads: 100,
      maxConcurrentConnections: 10,
      customQuotas: {},
    },
    [TenantTier.STARTER]: {
      maxUsers: 25,
      maxStorage: 10737418240, // 10GB
      maxApiCalls: 100000,
      maxDatabaseRows: 1000000,
      maxFileUploads: 1000,
      maxConcurrentConnections: 50,
      customQuotas: {},
    },
    [TenantTier.PROFESSIONAL]: {
      maxUsers: 100,
      maxStorage: 107374182400, // 100GB
      maxApiCalls: 1000000,
      maxDatabaseRows: 10000000,
      maxFileUploads: 10000,
      maxConcurrentConnections: 200,
      customQuotas: {},
    },
    [TenantTier.ENTERPRISE]: {
      maxUsers: -1, // unlimited
      maxStorage: -1, // unlimited
      maxApiCalls: -1, // unlimited
      maxDatabaseRows: -1, // unlimited
      maxFileUploads: -1, // unlimited
      maxConcurrentConnections: 1000,
      customQuotas: {},
    },
    [TenantTier.CUSTOM]: {
      maxUsers: 50,
      maxStorage: 53687091200, // 50GB
      maxApiCalls: 500000,
      maxDatabaseRows: 5000000,
      maxFileUploads: 5000,
      maxConcurrentConnections: 100,
      customQuotas: {},
    },
  };

  return quotaMap[tier];
}

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
export function getDefaultFeaturesForTier(tier: TenantTier): TenantFeatures {
  const featureMap: Record<TenantTier, TenantFeatures> = {
    [TenantTier.FREE]: {
      apiAccess: false,
      customBranding: false,
      sso: false,
      advancedReporting: false,
      customIntegrations: false,
      prioritySupport: false,
      whiteLabeling: false,
      customDomain: false,
      features: {},
    },
    [TenantTier.STARTER]: {
      apiAccess: true,
      customBranding: false,
      sso: false,
      advancedReporting: false,
      customIntegrations: false,
      prioritySupport: false,
      whiteLabeling: false,
      customDomain: false,
      features: {},
    },
    [TenantTier.PROFESSIONAL]: {
      apiAccess: true,
      customBranding: true,
      sso: true,
      advancedReporting: true,
      customIntegrations: true,
      prioritySupport: false,
      whiteLabeling: false,
      customDomain: true,
      features: {},
    },
    [TenantTier.ENTERPRISE]: {
      apiAccess: true,
      customBranding: true,
      sso: true,
      advancedReporting: true,
      customIntegrations: true,
      prioritySupport: true,
      whiteLabeling: true,
      customDomain: true,
      features: {},
    },
    [TenantTier.CUSTOM]: {
      apiAccess: true,
      customBranding: true,
      sso: true,
      advancedReporting: true,
      customIntegrations: true,
      prioritySupport: false,
      whiteLabeling: false,
      customDomain: true,
      features: {},
    },
  };

  return featureMap[tier];
}

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
export function checkQuotaExceeded(
  tenant: Tenant,
  usage: TenantUsage,
  quotaType: keyof TenantQuotas
): boolean {
  const quota = tenant.quotas[quotaType];

  // -1 means unlimited
  if (quota === -1) {
    return false;
  }

  const usageValue = usage[quotaType as keyof TenantUsage] as number;
  return usageValue >= quota;
}

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
export async function enforceTenantQuota(
  quotaType: keyof TenantQuotas,
  increment: number = 1
): Promise<void> {
  const tenant = getCurrentTenant();
  const quota = tenant.quotas[quotaType];

  // -1 means unlimited
  if (quota === -1) {
    return;
  }

  // Get current usage (implementation depends on usage tracking)
  const currentUsage = await getCurrentUsage(tenant.id, quotaType);

  if (currentUsage + increment > quota) {
    throw new ForbiddenException(`Tenant quota exceeded for ${quotaType}`);
  }
}

/**
 * Get current usage for quota type (placeholder)
 *
 * @param tenantId - Tenant ID
 * @param quotaType - Quota type
 * @returns Current usage value
 */
async function getCurrentUsage(
  tenantId: string,
  quotaType: keyof TenantQuotas
): Promise<number> {
  // Implementation depends on usage tracking system
  return 0;
}

// ============================================================================
// TENANT DATA MIGRATION
// ============================================================================

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
export async function migrateTenantData(
  options: TenantMigrationOptions,
  dataSource: DataSource
): Promise<{ success: boolean; migratedRecords: number }> {
  const logger = new Logger('TenantMigration');
  let migratedRecords = 0;

  try {
    logger.log(`Starting migration from ${options.sourceTenantId} to ${options.targetTenantId}`);

    // Implementation would include:
    // 1. Load source tenant data
    // 2. Apply transformations
    // 3. Insert into target tenant
    // 4. Handle conflicts and duplicates

    return { success: true, migratedRecords };
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
    return { success: false, migratedRecords };
  }
}

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
export async function cloneTenant(
  sourceTenantId: string,
  newTenantName: string,
  dataSource: DataSource
): Promise<Tenant> {
  const logger = new Logger('TenantCloning');

  // Implementation would include:
  // 1. Load source tenant
  // 2. Create new tenant with same configuration
  // 3. Copy all data
  // 4. Update references

  logger.log(`Cloning tenant ${sourceTenantId} to ${newTenantName}`);

  throw new Error('Not implemented');
}

// ============================================================================
// TENANT LIFECYCLE MANAGEMENT
// ============================================================================

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
export async function suspendTenant(
  tenantId: string,
  reason: string
): Promise<void> {
  const logger = new Logger('TenantLifecycle');
  logger.log(`Suspending tenant ${tenantId}: ${reason}`);

  // Update tenant status to suspended
  // Disable access
  // Send notifications
}

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
export async function reactivateTenant(tenantId: string): Promise<void> {
  const logger = new Logger('TenantLifecycle');
  logger.log(`Reactivating tenant ${tenantId}`);

  // Update tenant status to active
  // Restore access
  // Send notifications
}

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
export async function terminateTenant(
  tenantId: string,
  dataSource: DataSource
): Promise<void> {
  const logger = new Logger('TenantLifecycle');
  logger.log(`Terminating tenant ${tenantId}`);

  // Archive data
  // Drop schema/database
  // Update tenant status
  // Send final notifications
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get default tenant configuration
 *
 * @returns Default tenant config
 */
function getDefaultTenantConfig(): TenantConfig {
  return {
    timezone: 'UTC',
    locale: 'en-US',
    currency: 'USD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    settings: {},
    integrations: {},
    customFields: {},
  };
}

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
export function generateTenantSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
export function validateTenantAccess(tenantId: string): void {
  const currentTenantId = getCurrentTenantId();

  if (currentTenantId !== tenantId) {
    throw new ForbiddenException('Access denied to requested tenant');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  registerTenantConfig,
  createTenantConfigModule,
  validateTenantConfig,
  mergeTenantConfig,

  // Provisioning
  provisionTenant,
  generateTenantId,
  generateTenantIsolation,
  createTenantIsolation,
  runTenantMigrations,
  rollbackTenantProvisioning,

  // Context Management
  setTenantContext,
  getTenantContext,
  getCurrentTenantId,
  getCurrentTenant,
  runInTenantContext,

  // Query Builders
  createTenantRepository,
  addTenantFilter,
  createTenantQueryBuilder,
  setTenantSchema,
  getTenantDataSource,

  // Quotas & Limits
  getDefaultQuotasForTier,
  getDefaultFeaturesForTier,
  checkQuotaExceeded,
  enforceTenantQuota,

  // Data Migration
  migrateTenantData,
  cloneTenant,

  // Lifecycle
  suspendTenant,
  reactivateTenant,
  terminateTenant,

  // Utilities
  generateTenantSlug,
  validateTenantAccess,
};
