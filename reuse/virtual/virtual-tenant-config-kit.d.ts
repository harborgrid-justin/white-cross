/**
 * LOC: VTNT9C0D1E2
 * File: /reuse/virtual/virtual-tenant-config-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Multi-tenant configuration modules
 *   - Tenant isolation services
 *   - Quota management systems
 *   - Virtual infrastructure tenant handlers
 */
/**
 * Tenant configuration definition
 */
export interface TenantConfig {
    id: string;
    name: string;
    tier: 'basic' | 'standard' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'trial' | 'churned';
    parentTenantId?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Tenant isolation configuration
 */
export interface TenantIsolation {
    level: 'shared' | 'dedicated' | 'hybrid';
    networkIsolation: boolean;
    storageIsolation: boolean;
    computeIsolation: boolean;
    databaseIsolation: boolean;
    encryptionRequired: boolean;
    customDomain?: string;
}
/**
 * Tenant quota configuration
 */
export interface TenantQuota {
    tenantId: string;
    resources: {
        maxVMs: number;
        maxCPU: number;
        maxMemoryGB: number;
        maxStorageGB: number;
        maxNetworkBandwidthMbps: number;
        maxSnapshots: number;
        maxBackups: number;
    };
    limits: {
        maxAPIRequestsPerHour: number;
        maxConcurrentConnections: number;
        maxUsers: number;
        maxApplications: number;
    };
    usage?: TenantQuotaUsage;
}
/**
 * Tenant quota usage tracking
 */
export interface TenantQuotaUsage {
    currentVMs: number;
    currentCPU: number;
    currentMemoryGB: number;
    currentStorageGB: number;
    currentNetworkBandwidthMbps: number;
    currentSnapshots: number;
    currentBackups: number;
    lastUpdated: Date;
}
/**
 * Tenant-specific settings
 */
export interface TenantSettings {
    tenantId: string;
    environment: Record<string, string>;
    features: Record<string, boolean>;
    integrations: Record<string, any>;
    notifications: TenantNotificationSettings;
    security: TenantSecuritySettings;
    billing: TenantBillingSettings;
}
/**
 * Tenant notification settings
 */
export interface TenantNotificationSettings {
    emailEnabled: boolean;
    smsEnabled: boolean;
    webhookEnabled: boolean;
    alertThresholds: {
        cpuPercentage: number;
        memoryPercentage: number;
        storagePercentage: number;
    };
    recipients: string[];
}
/**
 * Tenant security settings
 */
export interface TenantSecuritySettings {
    mfaRequired: boolean;
    ipWhitelist?: string[];
    sessionTimeoutMinutes: number;
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
    };
    auditLogging: boolean;
}
/**
 * Tenant billing settings
 */
export interface TenantBillingSettings {
    billingMode: 'prepaid' | 'postpaid' | 'credits';
    currency: string;
    paymentMethod?: string;
    billingCycle: 'monthly' | 'quarterly' | 'annually';
    creditBalance?: number;
    autoRecharge?: boolean;
}
/**
 * Tenant SLA configuration
 */
export interface TenantSLA {
    tenantId: string;
    tier: string;
    uptime: number;
    responseTime: {
        p50: number;
        p95: number;
        p99: number;
    };
    support: {
        level: 'basic' | 'business' | 'enterprise' | '24x7';
        responseTimeMinutes: number;
        channels: string[];
    };
    dataRetentionDays: number;
    backupFrequencyHours: number;
}
/**
 * Tenant resource allocation
 */
export interface TenantResourceAllocation {
    tenantId: string;
    allocatedResources: {
        vmIds: string[];
        storageVolumeIds: string[];
        networkIds: string[];
        ipAddresses: string[];
    };
    reservations: {
        guaranteedCPU: number;
        guaranteedMemoryGB: number;
        guaranteedStorageGB: number;
        guaranteedBandwidthMbps: number;
    };
    overcommit: boolean;
}
/**
 * Tenant hierarchy node
 */
export interface TenantHierarchyNode {
    tenantId: string;
    parentId?: string;
    children: string[];
    level: number;
    path: string[];
}
/**
 * Tenant compliance requirements
 */
export interface TenantCompliance {
    tenantId: string;
    frameworks: string[];
    dataResidency: string[];
    encryptionAtRest: boolean;
    encryptionInTransit: boolean;
    auditRetentionDays: number;
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
}
/**
 * Creates tenant configuration with validation.
 *
 * @param {string} name - Tenant name
 * @param {string} tier - Tenant tier
 * @param {Partial<TenantConfig>} [options] - Additional options
 * @returns {TenantConfig} Tenant configuration
 *
 * @example
 * ```typescript
 * const tenant = createTenantConfig('Hospital-A', 'enterprise', {
 *   parentTenantId: 'healthcare-org',
 *   metadata: { region: 'us-east-1', department: 'cardiology' }
 * });
 * ```
 */
export declare const createTenantConfig: (name: string, tier: "basic" | "standard" | "premium" | "enterprise", options?: Partial<TenantConfig>) => TenantConfig;
/**
 * Generates unique tenant identifier.
 *
 * @param {string} [prefix] - Optional prefix
 * @returns {string} Tenant ID
 *
 * @example
 * ```typescript
 * const tenantId = generateTenantId('tenant');
 * // Result: 'tenant-1a2b3c4d5e6f'
 * ```
 */
export declare const generateTenantId: (prefix?: string) => string;
/**
 * Validates tenant configuration.
 *
 * @param {TenantConfig} config - Tenant configuration
 * @returns {string[]} Validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateTenantConfig(tenant);
 * if (errors.length > 0) {
 *   console.error('Tenant config errors:', errors);
 * }
 * ```
 */
export declare const validateTenantConfig: (config: TenantConfig) => string[];
/**
 * Updates tenant configuration.
 *
 * @param {TenantConfig} config - Existing tenant configuration
 * @param {Partial<TenantConfig>} updates - Configuration updates
 * @returns {TenantConfig} Updated tenant configuration
 *
 * @example
 * ```typescript
 * const updated = updateTenantConfig(tenant, {
 *   tier: 'premium',
 *   metadata: { ...tenant.metadata, upgraded: true }
 * });
 * ```
 */
export declare const updateTenantConfig: (config: TenantConfig, updates: Partial<TenantConfig>) => TenantConfig;
/**
 * Creates tenant isolation configuration.
 *
 * @param {string} level - Isolation level
 * @param {Partial<TenantIsolation>} [options] - Additional options
 * @returns {TenantIsolation} Isolation configuration
 *
 * @example
 * ```typescript
 * const isolation = createTenantIsolation('dedicated', {
 *   networkIsolation: true,
 *   storageIsolation: true,
 *   encryptionRequired: true
 * });
 * ```
 */
export declare const createTenantIsolation: (level: "shared" | "dedicated" | "hybrid", options?: Partial<TenantIsolation>) => TenantIsolation;
/**
 * Validates tenant isolation requirements.
 *
 * @param {TenantIsolation} isolation - Isolation configuration
 * @param {TenantCompliance} compliance - Compliance requirements
 * @returns {boolean} True if isolation meets compliance
 *
 * @example
 * ```typescript
 * const meetsRequirements = validateTenantIsolation(isolation, compliance);
 * if (!meetsRequirements) {
 *   console.error('Isolation does not meet compliance requirements');
 * }
 * ```
 */
export declare const validateTenantIsolation: (isolation: TenantIsolation, compliance: TenantCompliance) => boolean;
/**
 * Calculates isolation score for tenant.
 *
 * @param {TenantIsolation} isolation - Isolation configuration
 * @returns {number} Isolation score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateIsolationScore(isolation);
 * console.log(`Isolation score: ${score}/100`);
 * ```
 */
export declare const calculateIsolationScore: (isolation: TenantIsolation) => number;
/**
 * Creates tenant quota configuration.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} tier - Tenant tier
 * @returns {TenantQuota} Quota configuration
 *
 * @example
 * ```typescript
 * const quota = createTenantQuota('tenant-123', 'enterprise');
 * // Returns quota limits based on enterprise tier
 * ```
 */
export declare const createTenantQuota: (tenantId: string, tier: string) => TenantQuota;
/**
 * Gets quota limits based on tenant tier.
 *
 * @param {string} tier - Tenant tier
 * @returns {object} Quota limits
 *
 * @example
 * ```typescript
 * const limits = getTierQuotaLimits('enterprise');
 * ```
 */
export declare const getTierQuotaLimits: (tier: string) => {
    resources: TenantQuota["resources"];
    limits: TenantQuota["limits"];
};
/**
 * Checks if tenant quota is exceeded.
 *
 * @param {TenantQuota} quota - Tenant quota
 * @param {TenantQuotaUsage} usage - Current usage
 * @returns {object} Quota check result
 *
 * @example
 * ```typescript
 * const result = checkTenantQuota(quota, usage);
 * if (result.exceeded) {
 *   console.error('Quota exceeded:', result.violations);
 * }
 * ```
 */
export declare const checkTenantQuota: (quota: TenantQuota, usage: TenantQuotaUsage) => {
    exceeded: boolean;
    violations: string[];
    warnings: string[];
};
/**
 * Updates tenant quota usage.
 *
 * @param {TenantQuota} quota - Tenant quota
 * @param {Partial<TenantQuotaUsage>} usage - Usage updates
 * @returns {TenantQuota} Updated quota with usage
 *
 * @example
 * ```typescript
 * const updated = updateTenantQuotaUsage(quota, {
 *   currentVMs: 15,
 *   currentStorageGB: 750
 * });
 * ```
 */
export declare const updateTenantQuotaUsage: (quota: TenantQuota, usage: Partial<TenantQuotaUsage>) => TenantQuota;
/**
 * Calculates quota utilization percentage.
 *
 * @param {TenantQuota} quota - Tenant quota
 * @returns {Record<string, number>} Utilization percentages
 *
 * @example
 * ```typescript
 * const utilization = calculateQuotaUtilization(quota);
 * console.log(`VM utilization: ${utilization.vms}%`);
 * ```
 */
export declare const calculateQuotaUtilization: (quota: TenantQuota) => Record<string, number>;
/**
 * Creates tenant-specific settings.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Partial<TenantSettings>} [options] - Settings options
 * @returns {TenantSettings} Tenant settings
 *
 * @example
 * ```typescript
 * const settings = createTenantSettings('tenant-123', {
 *   features: { advancedNetworking: true, autoScaling: true },
 *   notifications: { emailEnabled: true, alertThresholds: { cpuPercentage: 80 } }
 * });
 * ```
 */
export declare const createTenantSettings: (tenantId: string, options?: Partial<TenantSettings>) => TenantSettings;
/**
 * Creates default notification settings.
 *
 * @returns {TenantNotificationSettings} Default notification settings
 *
 * @example
 * ```typescript
 * const notifications = createDefaultNotificationSettings();
 * ```
 */
export declare const createDefaultNotificationSettings: () => TenantNotificationSettings;
/**
 * Creates default security settings.
 *
 * @returns {TenantSecuritySettings} Default security settings
 *
 * @example
 * ```typescript
 * const security = createDefaultSecuritySettings();
 * ```
 */
export declare const createDefaultSecuritySettings: () => TenantSecuritySettings;
/**
 * Creates default billing settings.
 *
 * @returns {TenantBillingSettings} Default billing settings
 *
 * @example
 * ```typescript
 * const billing = createDefaultBillingSettings();
 * ```
 */
export declare const createDefaultBillingSettings: () => TenantBillingSettings;
/**
 * Updates tenant-specific settings.
 *
 * @param {TenantSettings} settings - Current settings
 * @param {Partial<TenantSettings>} updates - Settings updates
 * @returns {TenantSettings} Updated settings
 *
 * @example
 * ```typescript
 * const updated = updateTenantSettings(settings, {
 *   features: { ...settings.features, newFeature: true }
 * });
 * ```
 */
export declare const updateTenantSettings: (settings: TenantSettings, updates: Partial<TenantSettings>) => TenantSettings;
/**
 * Merges tenant settings from multiple sources.
 *
 * @param {TenantSettings} base - Base settings
 * @param {Partial<TenantSettings>[]} overrides - Override settings
 * @returns {TenantSettings} Merged settings
 *
 * @example
 * ```typescript
 * const merged = mergeTenantSettings(baseSettings, [tierSettings, customSettings]);
 * ```
 */
export declare const mergeTenantSettings: (base: TenantSettings, overrides: Partial<TenantSettings>[]) => TenantSettings;
/**
 * Creates tenant SLA configuration.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} tier - Tenant tier
 * @returns {TenantSLA} SLA configuration
 *
 * @example
 * ```typescript
 * const sla = createTenantSLA('tenant-123', 'enterprise');
 * ```
 */
export declare const createTenantSLA: (tenantId: string, tier: string) => TenantSLA;
/**
 * Validates tenant SLA compliance.
 *
 * @param {TenantSLA} sla - SLA configuration
 * @param {object} metrics - Actual metrics
 * @returns {object} Compliance result
 *
 * @example
 * ```typescript
 * const result = validateTenantSLA(sla, {
 *   actualUptime: 99.95,
 *   actualResponseTime: { p50: 45, p95: 140, p99: 380 }
 * });
 * ```
 */
export declare const validateTenantSLA: (sla: TenantSLA, metrics: {
    actualUptime: number;
    actualResponseTime: {
        p50: number;
        p95: number;
        p99: number;
    };
}) => {
    compliant: boolean;
    violations: string[];
};
/**
 * Creates tenant resource allocation.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Partial<TenantResourceAllocation>} [options] - Allocation options
 * @returns {TenantResourceAllocation} Resource allocation
 *
 * @example
 * ```typescript
 * const allocation = createTenantResourceAllocation('tenant-123', {
 *   reservations: {
 *     guaranteedCPU: 16,
 *     guaranteedMemoryGB: 64,
 *     guaranteedStorageGB: 1000,
 *     guaranteedBandwidthMbps: 1000
 *   }
 * });
 * ```
 */
export declare const createTenantResourceAllocation: (tenantId: string, options?: Partial<TenantResourceAllocation>) => TenantResourceAllocation;
/**
 * Allocates resources to tenant.
 *
 * @param {TenantResourceAllocation} allocation - Current allocation
 * @param {Partial<TenantResourceAllocation['allocatedResources']>} resources - Resources to allocate
 * @returns {TenantResourceAllocation} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = allocateResourcesToTenant(allocation, {
 *   vmIds: ['vm-001', 'vm-002'],
 *   storageVolumeIds: ['vol-001']
 * });
 * ```
 */
export declare const allocateResourcesToTenant: (allocation: TenantResourceAllocation, resources: Partial<TenantResourceAllocation["allocatedResources"]>) => TenantResourceAllocation;
/**
 * Deallocates resources from tenant.
 *
 * @param {TenantResourceAllocation} allocation - Current allocation
 * @param {Partial<TenantResourceAllocation['allocatedResources']>} resources - Resources to deallocate
 * @returns {TenantResourceAllocation} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = deallocateResourcesFromTenant(allocation, {
 *   vmIds: ['vm-001']
 * });
 * ```
 */
export declare const deallocateResourcesFromTenant: (allocation: TenantResourceAllocation, resources: Partial<TenantResourceAllocation["allocatedResources"]>) => TenantResourceAllocation;
/**
 * Creates tenant hierarchy node.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} [parentId] - Parent tenant ID
 * @returns {TenantHierarchyNode} Hierarchy node
 *
 * @example
 * ```typescript
 * const node = createTenantHierarchyNode('child-tenant', 'parent-tenant');
 * ```
 */
export declare const createTenantHierarchyNode: (tenantId: string, parentId?: string) => TenantHierarchyNode;
/**
 * Builds tenant hierarchy tree.
 *
 * @param {TenantConfig[]} tenants - Array of tenant configurations
 * @returns {TenantHierarchyNode[]} Hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = buildTenantHierarchy(allTenants);
 * ```
 */
export declare const buildTenantHierarchy: (tenants: TenantConfig[]) => TenantHierarchyNode[];
/**
 * Gets all ancestor tenants.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Map<string, TenantHierarchyNode>} hierarchy - Hierarchy map
 * @returns {string[]} Ancestor tenant IDs
 *
 * @example
 * ```typescript
 * const ancestors = getTenantAncestors('child-tenant', hierarchyMap);
 * ```
 */
export declare const getTenantAncestors: (tenantId: string, hierarchy: Map<string, TenantHierarchyNode>) => string[];
/**
 * Gets all descendant tenants.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Map<string, TenantHierarchyNode>} hierarchy - Hierarchy map
 * @returns {string[]} Descendant tenant IDs
 *
 * @example
 * ```typescript
 * const descendants = getTenantDescendants('parent-tenant', hierarchyMap);
 * ```
 */
export declare const getTenantDescendants: (tenantId: string, hierarchy: Map<string, TenantHierarchyNode>) => string[];
/**
 * Creates tenant compliance configuration.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {Partial<TenantCompliance>} [options] - Compliance options
 * @returns {TenantCompliance} Compliance configuration
 *
 * @example
 * ```typescript
 * const compliance = createTenantCompliance('tenant-123', {
 *   frameworks: ['HIPAA', 'SOC2'],
 *   dataResidency: ['US'],
 *   hipaaCompliant: true
 * });
 * ```
 */
export declare const createTenantCompliance: (tenantId: string, options?: Partial<TenantCompliance>) => TenantCompliance;
/**
 * Validates tenant compliance requirements.
 *
 * @param {TenantCompliance} compliance - Compliance configuration
 * @returns {string[]} Compliance violations
 *
 * @example
 * ```typescript
 * const violations = validateTenantCompliance(compliance);
 * if (violations.length > 0) {
 *   console.error('Compliance violations:', violations);
 * }
 * ```
 */
export declare const validateTenantCompliance: (compliance: TenantCompliance) => string[];
/**
 * Calculates tenant usage costs based on resource consumption.
 *
 * @param {TenantQuotaUsage} usage - Current usage
 * @param {Record<string, number>} rates - Pricing rates per resource
 * @returns {object} Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = calculateTenantCosts(usage, {
 *   cpuPerHour: 0.05,
 *   memoryGBPerHour: 0.01,
 *   storageGBPerMonth: 0.10
 * });
 * ```
 */
export declare const calculateTenantCosts: (usage: TenantQuotaUsage, rates: Record<string, number>) => {
    totalCost: number;
    breakdown: Record<string, number>;
};
/**
 * Generates tenant billing report.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {TenantQuotaUsage} usage - Usage data
 * @param {Date} startDate - Billing period start
 * @param {Date} endDate - Billing period end
 * @returns {object} Billing report
 *
 * @example
 * ```typescript
 * const report = generateTenantBillingReport(
 *   'tenant-123',
 *   usage,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * ```
 */
export declare const generateTenantBillingReport: (tenantId: string, usage: TenantQuotaUsage, startDate: Date, endDate: Date) => {
    tenantId: string;
    period: {
        start: Date;
        end: Date;
    };
    usage: TenantQuotaUsage;
    generatedAt: Date;
};
/**
 * Creates tenant access control policy.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string[]} allowedIPs - Allowed IP addresses/ranges
 * @param {string[]} allowedRegions - Allowed regions
 * @returns {object} Access control policy
 *
 * @example
 * ```typescript
 * const policy = createTenantAccessControl('tenant-123', [
 *   '192.168.1.0/24',
 *   '10.0.0.0/8'
 * ], ['us-east-1', 'us-west-2']);
 * ```
 */
export declare const createTenantAccessControl: (tenantId: string, allowedIPs: string[], allowedRegions: string[]) => {
    tenantId: string;
    allowedIPs: string[];
    allowedRegions: string[];
    createdAt: Date;
};
/**
 * Validates tenant access request.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} sourceIP - Request source IP
 * @param {string} region - Request region
 * @param {object} accessControl - Access control policy
 * @returns {boolean} True if access allowed
 *
 * @example
 * ```typescript
 * const allowed = validateTenantAccess(
 *   'tenant-123',
 *   '192.168.1.100',
 *   'us-east-1',
 *   accessControlPolicy
 * );
 * ```
 */
export declare const validateTenantAccess: (tenantId: string, sourceIP: string, region: string, accessControl: {
    allowedIPs: string[];
    allowedRegions: string[];
}) => boolean;
/**
 * Creates tenant onboarding workflow.
 *
 * @param {TenantConfig} tenant - Tenant configuration
 * @returns {object} Onboarding workflow
 *
 * @example
 * ```typescript
 * const workflow = createTenantOnboarding(tenantConfig);
 * ```
 */
export declare const createTenantOnboarding: (tenant: TenantConfig) => {
    tenantId: string;
    steps: Array<{
        name: string;
        status: "pending" | "completed" | "failed";
    }>;
    startedAt: Date;
};
/**
 * Creates tenant offboarding workflow.
 *
 * @param {string} tenantId - Tenant identifier
 * @returns {object} Offboarding workflow
 *
 * @example
 * ```typescript
 * const workflow = createTenantOffboarding('tenant-123');
 * ```
 */
export declare const createTenantOffboarding: (tenantId: string) => {
    tenantId: string;
    steps: Array<{
        name: string;
        status: "pending" | "completed" | "failed";
    }>;
    startedAt: Date;
};
/**
 * Creates tenant migration plan.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {string} targetEnvironment - Target environment
 * @returns {object} Migration plan
 *
 * @example
 * ```typescript
 * const plan = createTenantMigrationPlan('tenant-123', 'us-west-2');
 * ```
 */
export declare const createTenantMigrationPlan: (tenantId: string, targetEnvironment: string) => {
    tenantId: string;
    targetEnvironment: string;
    phases: Array<{
        name: string;
        estimatedDuration: string;
    }>;
    createdAt: Date;
};
/**
 * Validates tenant migration readiness.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {TenantQuota} quota - Tenant quota
 * @returns {object} Readiness check result
 *
 * @example
 * ```typescript
 * const ready = validateTenantMigrationReadiness('tenant-123', quota);
 * ```
 */
export declare const validateTenantMigrationReadiness: (tenantId: string, quota: TenantQuota) => {
    ready: boolean;
    blockers: string[];
    warnings: string[];
};
/**
 * Creates tenant health check configuration.
 *
 * @param {string} tenantId - Tenant identifier
 * @returns {object} Health check configuration
 *
 * @example
 * ```typescript
 * const healthCheck = createTenantHealthCheck('tenant-123');
 * ```
 */
export declare const createTenantHealthCheck: (tenantId: string) => {
    tenantId: string;
    checks: Array<{
        name: string;
        interval: number;
        timeout: number;
    }>;
    enabled: boolean;
};
/**
 * Generates tenant status report.
 *
 * @param {TenantConfig} tenant - Tenant configuration
 * @param {TenantQuota} quota - Tenant quota
 * @param {TenantSLA} sla - Tenant SLA
 * @returns {object} Status report
 *
 * @example
 * ```typescript
 * const report = generateTenantStatusReport(tenant, quota, sla);
 * ```
 */
export declare const generateTenantStatusReport: (tenant: TenantConfig, quota: TenantQuota, sla: TenantSLA) => {
    tenant: TenantConfig;
    quotaUtilization: Record<string, number>;
    sla: TenantSLA;
    generatedAt: Date;
};
/**
 * Creates tenant data retention policy.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {number} retentionDays - Data retention period in days
 * @returns {object} Data retention policy
 *
 * @example
 * ```typescript
 * const policy = createTenantDataRetention('tenant-123', 365);
 * ```
 */
export declare const createTenantDataRetention: (tenantId: string, retentionDays: number) => {
    tenantId: string;
    retentionDays: number;
    dataTypes: Record<string, number>;
    createdAt: Date;
};
/**
 * Exports tenant configuration and data.
 *
 * @param {string} tenantId - Tenant identifier
 * @param {TenantConfig} config - Tenant configuration
 * @param {TenantSettings} settings - Tenant settings
 * @returns {object} Exported tenant data
 *
 * @example
 * ```typescript
 * const exported = exportTenantData('tenant-123', config, settings);
 * ```
 */
export declare const exportTenantData: (tenantId: string, config: TenantConfig, settings: TenantSettings) => {
    tenantId: string;
    config: TenantConfig;
    settings: TenantSettings;
    exportedAt: Date;
    version: string;
};
/**
 * Imports tenant configuration and data.
 *
 * @param {object} exportedData - Exported tenant data
 * @returns {object} Import result
 *
 * @example
 * ```typescript
 * const result = importTenantData(exportedData);
 * ```
 */
export declare const importTenantData: (exportedData: {
    tenantId: string;
    config: TenantConfig;
    settings: TenantSettings;
    version: string;
}) => {
    success: boolean;
    tenantId: string;
    errors: string[];
};
declare const _default: {
    createTenantConfig: (name: string, tier: "basic" | "standard" | "premium" | "enterprise", options?: Partial<TenantConfig>) => TenantConfig;
    generateTenantId: (prefix?: string) => string;
    validateTenantConfig: (config: TenantConfig) => string[];
    updateTenantConfig: (config: TenantConfig, updates: Partial<TenantConfig>) => TenantConfig;
    createTenantIsolation: (level: "shared" | "dedicated" | "hybrid", options?: Partial<TenantIsolation>) => TenantIsolation;
    validateTenantIsolation: (isolation: TenantIsolation, compliance: TenantCompliance) => boolean;
    calculateIsolationScore: (isolation: TenantIsolation) => number;
    createTenantQuota: (tenantId: string, tier: string) => TenantQuota;
    getTierQuotaLimits: (tier: string) => {
        resources: TenantQuota["resources"];
        limits: TenantQuota["limits"];
    };
    checkTenantQuota: (quota: TenantQuota, usage: TenantQuotaUsage) => {
        exceeded: boolean;
        violations: string[];
        warnings: string[];
    };
    updateTenantQuotaUsage: (quota: TenantQuota, usage: Partial<TenantQuotaUsage>) => TenantQuota;
    calculateQuotaUtilization: (quota: TenantQuota) => Record<string, number>;
    createTenantSettings: (tenantId: string, options?: Partial<TenantSettings>) => TenantSettings;
    createDefaultNotificationSettings: () => TenantNotificationSettings;
    createDefaultSecuritySettings: () => TenantSecuritySettings;
    createDefaultBillingSettings: () => TenantBillingSettings;
    updateTenantSettings: (settings: TenantSettings, updates: Partial<TenantSettings>) => TenantSettings;
    mergeTenantSettings: (base: TenantSettings, overrides: Partial<TenantSettings>[]) => TenantSettings;
    createTenantSLA: (tenantId: string, tier: string) => TenantSLA;
    validateTenantSLA: (sla: TenantSLA, metrics: {
        actualUptime: number;
        actualResponseTime: {
            p50: number;
            p95: number;
            p99: number;
        };
    }) => {
        compliant: boolean;
        violations: string[];
    };
    createTenantResourceAllocation: (tenantId: string, options?: Partial<TenantResourceAllocation>) => TenantResourceAllocation;
    allocateResourcesToTenant: (allocation: TenantResourceAllocation, resources: Partial<TenantResourceAllocation["allocatedResources"]>) => TenantResourceAllocation;
    deallocateResourcesFromTenant: (allocation: TenantResourceAllocation, resources: Partial<TenantResourceAllocation["allocatedResources"]>) => TenantResourceAllocation;
    createTenantHierarchyNode: (tenantId: string, parentId?: string) => TenantHierarchyNode;
    buildTenantHierarchy: (tenants: TenantConfig[]) => TenantHierarchyNode[];
    getTenantAncestors: (tenantId: string, hierarchy: Map<string, TenantHierarchyNode>) => string[];
    getTenantDescendants: (tenantId: string, hierarchy: Map<string, TenantHierarchyNode>) => string[];
    createTenantCompliance: (tenantId: string, options?: Partial<TenantCompliance>) => TenantCompliance;
    validateTenantCompliance: (compliance: TenantCompliance) => string[];
    calculateTenantCosts: (usage: TenantQuotaUsage, rates: Record<string, number>) => {
        totalCost: number;
        breakdown: Record<string, number>;
    };
    generateTenantBillingReport: (tenantId: string, usage: TenantQuotaUsage, startDate: Date, endDate: Date) => {
        tenantId: string;
        period: {
            start: Date;
            end: Date;
        };
        usage: TenantQuotaUsage;
        generatedAt: Date;
    };
    createTenantAccessControl: (tenantId: string, allowedIPs: string[], allowedRegions: string[]) => {
        tenantId: string;
        allowedIPs: string[];
        allowedRegions: string[];
        createdAt: Date;
    };
    validateTenantAccess: (tenantId: string, sourceIP: string, region: string, accessControl: {
        allowedIPs: string[];
        allowedRegions: string[];
    }) => boolean;
    createTenantOnboarding: (tenant: TenantConfig) => {
        tenantId: string;
        steps: Array<{
            name: string;
            status: "pending" | "completed" | "failed";
        }>;
        startedAt: Date;
    };
    createTenantOffboarding: (tenantId: string) => {
        tenantId: string;
        steps: Array<{
            name: string;
            status: "pending" | "completed" | "failed";
        }>;
        startedAt: Date;
    };
    createTenantMigrationPlan: (tenantId: string, targetEnvironment: string) => {
        tenantId: string;
        targetEnvironment: string;
        phases: Array<{
            name: string;
            estimatedDuration: string;
        }>;
        createdAt: Date;
    };
    validateTenantMigrationReadiness: (tenantId: string, quota: TenantQuota) => {
        ready: boolean;
        blockers: string[];
        warnings: string[];
    };
    createTenantHealthCheck: (tenantId: string) => {
        tenantId: string;
        checks: Array<{
            name: string;
            interval: number;
            timeout: number;
        }>;
        enabled: boolean;
    };
    generateTenantStatusReport: (tenant: TenantConfig, quota: TenantQuota, sla: TenantSLA) => {
        tenant: TenantConfig;
        quotaUtilization: Record<string, number>;
        sla: TenantSLA;
        generatedAt: Date;
    };
    createTenantDataRetention: (tenantId: string, retentionDays: number) => {
        tenantId: string;
        retentionDays: number;
        dataTypes: Record<string, number>;
        createdAt: Date;
    };
    exportTenantData: (tenantId: string, config: TenantConfig, settings: TenantSettings) => {
        tenantId: string;
        config: TenantConfig;
        settings: TenantSettings;
        exportedAt: Date;
        version: string;
    };
    importTenantData: (exportedData: {
        tenantId: string;
        config: TenantConfig;
        settings: TenantSettings;
        version: string;
    }) => {
        success: boolean;
        tenantId: string;
        errors: string[];
    };
};
export default _default;
//# sourceMappingURL=virtual-tenant-config-kit.d.ts.map