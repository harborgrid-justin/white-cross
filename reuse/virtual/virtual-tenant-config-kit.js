"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTenantData = exports.exportTenantData = exports.createTenantDataRetention = exports.generateTenantStatusReport = exports.createTenantHealthCheck = exports.validateTenantMigrationReadiness = exports.createTenantMigrationPlan = exports.createTenantOffboarding = exports.createTenantOnboarding = exports.validateTenantAccess = exports.createTenantAccessControl = exports.generateTenantBillingReport = exports.calculateTenantCosts = exports.validateTenantCompliance = exports.createTenantCompliance = exports.getTenantDescendants = exports.getTenantAncestors = exports.buildTenantHierarchy = exports.createTenantHierarchyNode = exports.deallocateResourcesFromTenant = exports.allocateResourcesToTenant = exports.createTenantResourceAllocation = exports.validateTenantSLA = exports.createTenantSLA = exports.mergeTenantSettings = exports.updateTenantSettings = exports.createDefaultBillingSettings = exports.createDefaultSecuritySettings = exports.createDefaultNotificationSettings = exports.createTenantSettings = exports.calculateQuotaUtilization = exports.updateTenantQuotaUsage = exports.checkTenantQuota = exports.getTierQuotaLimits = exports.createTenantQuota = exports.calculateIsolationScore = exports.validateTenantIsolation = exports.createTenantIsolation = exports.updateTenantConfig = exports.validateTenantConfig = exports.generateTenantId = exports.createTenantConfig = void 0;
/**
 * File: /reuse/virtual/virtual-tenant-config-kit.ts
 * Locator: WC-VIRT-TNT-001
 * Purpose: Multi-Tenant Virtual Configuration Toolkit - Tenant-specific configuration utilities
 *
 * Upstream: Independent utility module for multi-tenant virtual infrastructure
 * Downstream: ../backend/*, Tenant services, Quota modules, Isolation handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, joi, class-validator
 * Exports: 40 utility functions for tenant config, isolation, quotas, tenant-specific settings
 *
 * LLM Context: Enterprise-grade multi-tenant configuration utilities for virtual infrastructure.
 * Provides tenant isolation, quota management, tenant-specific settings, resource allocation,
 * tenant hierarchy, billing configuration, SLA management, compliance controls, and HIPAA-compliant
 * multi-tenancy patterns for healthcare virtual environments.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TENANT CONFIGURATION MANAGEMENT
// ============================================================================
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
const createTenantConfig = (name, tier, options) => {
    return {
        id: options?.id || (0, exports.generateTenantId)(),
        name,
        tier,
        status: options?.status || 'active',
        parentTenantId: options?.parentTenantId,
        metadata: options?.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
exports.createTenantConfig = createTenantConfig;
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
const generateTenantId = (prefix = 'tenant') => {
    const randomPart = crypto.randomBytes(6).toString('hex');
    return `${prefix}-${randomPart}`;
};
exports.generateTenantId = generateTenantId;
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
const validateTenantConfig = (config) => {
    const errors = [];
    if (!config.id) {
        errors.push('Tenant ID is required');
    }
    if (!config.name || config.name.trim().length === 0) {
        errors.push('Tenant name is required');
    }
    if (!['basic', 'standard', 'premium', 'enterprise'].includes(config.tier)) {
        errors.push('Invalid tenant tier');
    }
    if (!['active', 'suspended', 'trial', 'churned'].includes(config.status)) {
        errors.push('Invalid tenant status');
    }
    return errors;
};
exports.validateTenantConfig = validateTenantConfig;
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
const updateTenantConfig = (config, updates) => {
    return {
        ...config,
        ...updates,
        id: config.id, // Prevent ID change
        updatedAt: new Date(),
    };
};
exports.updateTenantConfig = updateTenantConfig;
// ============================================================================
// TENANT ISOLATION
// ============================================================================
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
const createTenantIsolation = (level, options) => {
    return {
        level,
        networkIsolation: options?.networkIsolation ?? (level === 'dedicated'),
        storageIsolation: options?.storageIsolation ?? (level === 'dedicated'),
        computeIsolation: options?.computeIsolation ?? (level === 'dedicated'),
        databaseIsolation: options?.databaseIsolation ?? (level === 'dedicated'),
        encryptionRequired: options?.encryptionRequired ?? true,
        customDomain: options?.customDomain,
    };
};
exports.createTenantIsolation = createTenantIsolation;
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
const validateTenantIsolation = (isolation, compliance) => {
    if (compliance.hipaaCompliant) {
        return isolation.encryptionRequired &&
            isolation.databaseIsolation &&
            isolation.storageIsolation;
    }
    if (compliance.gdprCompliant) {
        return isolation.encryptionRequired;
    }
    return true;
};
exports.validateTenantIsolation = validateTenantIsolation;
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
const calculateIsolationScore = (isolation) => {
    let score = 0;
    if (isolation.level === 'dedicated')
        score += 40;
    else if (isolation.level === 'hybrid')
        score += 20;
    if (isolation.networkIsolation)
        score += 15;
    if (isolation.storageIsolation)
        score += 15;
    if (isolation.computeIsolation)
        score += 10;
    if (isolation.databaseIsolation)
        score += 10;
    if (isolation.encryptionRequired)
        score += 10;
    return Math.min(score, 100);
};
exports.calculateIsolationScore = calculateIsolationScore;
// ============================================================================
// TENANT QUOTA MANAGEMENT
// ============================================================================
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
const createTenantQuota = (tenantId, tier) => {
    const tierLimits = (0, exports.getTierQuotaLimits)(tier);
    return {
        tenantId,
        resources: tierLimits.resources,
        limits: tierLimits.limits,
    };
};
exports.createTenantQuota = createTenantQuota;
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
const getTierQuotaLimits = (tier) => {
    const quotas = {
        basic: {
            resources: {
                maxVMs: 5,
                maxCPU: 8,
                maxMemoryGB: 32,
                maxStorageGB: 500,
                maxNetworkBandwidthMbps: 100,
                maxSnapshots: 10,
                maxBackups: 5,
            },
            limits: {
                maxAPIRequestsPerHour: 1000,
                maxConcurrentConnections: 50,
                maxUsers: 10,
                maxApplications: 5,
            },
        },
        standard: {
            resources: {
                maxVMs: 20,
                maxCPU: 32,
                maxMemoryGB: 128,
                maxStorageGB: 2000,
                maxNetworkBandwidthMbps: 500,
                maxSnapshots: 50,
                maxBackups: 20,
            },
            limits: {
                maxAPIRequestsPerHour: 5000,
                maxConcurrentConnections: 200,
                maxUsers: 50,
                maxApplications: 20,
            },
        },
        premium: {
            resources: {
                maxVMs: 50,
                maxCPU: 128,
                maxMemoryGB: 512,
                maxStorageGB: 10000,
                maxNetworkBandwidthMbps: 2000,
                maxSnapshots: 200,
                maxBackups: 100,
            },
            limits: {
                maxAPIRequestsPerHour: 20000,
                maxConcurrentConnections: 1000,
                maxUsers: 200,
                maxApplications: 100,
            },
        },
        enterprise: {
            resources: {
                maxVMs: -1, // Unlimited
                maxCPU: -1,
                maxMemoryGB: -1,
                maxStorageGB: -1,
                maxNetworkBandwidthMbps: -1,
                maxSnapshots: -1,
                maxBackups: -1,
            },
            limits: {
                maxAPIRequestsPerHour: -1,
                maxConcurrentConnections: -1,
                maxUsers: -1,
                maxApplications: -1,
            },
        },
    };
    return quotas[tier] || quotas.basic;
};
exports.getTierQuotaLimits = getTierQuotaLimits;
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
const checkTenantQuota = (quota, usage) => {
    const violations = [];
    const warnings = [];
    // Check resource quotas
    if (quota.resources.maxVMs !== -1 && usage.currentVMs > quota.resources.maxVMs) {
        violations.push(`VM quota exceeded: ${usage.currentVMs}/${quota.resources.maxVMs}`);
    }
    if (quota.resources.maxCPU !== -1 && usage.currentCPU > quota.resources.maxCPU) {
        violations.push(`CPU quota exceeded: ${usage.currentCPU}/${quota.resources.maxCPU}`);
    }
    if (quota.resources.maxMemoryGB !== -1 && usage.currentMemoryGB > quota.resources.maxMemoryGB) {
        violations.push(`Memory quota exceeded: ${usage.currentMemoryGB}/${quota.resources.maxMemoryGB}GB`);
    }
    if (quota.resources.maxStorageGB !== -1 && usage.currentStorageGB > quota.resources.maxStorageGB) {
        violations.push(`Storage quota exceeded: ${usage.currentStorageGB}/${quota.resources.maxStorageGB}GB`);
    }
    // Check warnings (80% threshold)
    if (quota.resources.maxVMs !== -1 && usage.currentVMs > quota.resources.maxVMs * 0.8) {
        warnings.push('VM quota at 80%');
    }
    if (quota.resources.maxStorageGB !== -1 && usage.currentStorageGB > quota.resources.maxStorageGB * 0.8) {
        warnings.push('Storage quota at 80%');
    }
    return {
        exceeded: violations.length > 0,
        violations,
        warnings,
    };
};
exports.checkTenantQuota = checkTenantQuota;
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
const updateTenantQuotaUsage = (quota, usage) => {
    return {
        ...quota,
        usage: {
            currentVMs: usage.currentVMs ?? 0,
            currentCPU: usage.currentCPU ?? 0,
            currentMemoryGB: usage.currentMemoryGB ?? 0,
            currentStorageGB: usage.currentStorageGB ?? 0,
            currentNetworkBandwidthMbps: usage.currentNetworkBandwidthMbps ?? 0,
            currentSnapshots: usage.currentSnapshots ?? 0,
            currentBackups: usage.currentBackups ?? 0,
            lastUpdated: new Date(),
        },
    };
};
exports.updateTenantQuotaUsage = updateTenantQuotaUsage;
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
const calculateQuotaUtilization = (quota) => {
    if (!quota.usage) {
        return {};
    }
    const calc = (current, max) => {
        if (max === -1)
            return 0; // Unlimited
        return Math.round((current / max) * 100);
    };
    return {
        vms: calc(quota.usage.currentVMs, quota.resources.maxVMs),
        cpu: calc(quota.usage.currentCPU, quota.resources.maxCPU),
        memory: calc(quota.usage.currentMemoryGB, quota.resources.maxMemoryGB),
        storage: calc(quota.usage.currentStorageGB, quota.resources.maxStorageGB),
        bandwidth: calc(quota.usage.currentNetworkBandwidthMbps, quota.resources.maxNetworkBandwidthMbps),
        snapshots: calc(quota.usage.currentSnapshots, quota.resources.maxSnapshots),
        backups: calc(quota.usage.currentBackups, quota.resources.maxBackups),
    };
};
exports.calculateQuotaUtilization = calculateQuotaUtilization;
// ============================================================================
// TENANT-SPECIFIC SETTINGS
// ============================================================================
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
const createTenantSettings = (tenantId, options) => {
    return {
        tenantId,
        environment: options?.environment || {},
        features: options?.features || {},
        integrations: options?.integrations || {},
        notifications: options?.notifications || (0, exports.createDefaultNotificationSettings)(),
        security: options?.security || (0, exports.createDefaultSecuritySettings)(),
        billing: options?.billing || (0, exports.createDefaultBillingSettings)(),
    };
};
exports.createTenantSettings = createTenantSettings;
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
const createDefaultNotificationSettings = () => {
    return {
        emailEnabled: true,
        smsEnabled: false,
        webhookEnabled: false,
        alertThresholds: {
            cpuPercentage: 80,
            memoryPercentage: 85,
            storagePercentage: 90,
        },
        recipients: [],
    };
};
exports.createDefaultNotificationSettings = createDefaultNotificationSettings;
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
const createDefaultSecuritySettings = () => {
    return {
        mfaRequired: false,
        sessionTimeoutMinutes: 30,
        passwordPolicy: {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true,
        },
        auditLogging: true,
    };
};
exports.createDefaultSecuritySettings = createDefaultSecuritySettings;
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
const createDefaultBillingSettings = () => {
    return {
        billingMode: 'postpaid',
        currency: 'USD',
        billingCycle: 'monthly',
    };
};
exports.createDefaultBillingSettings = createDefaultBillingSettings;
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
const updateTenantSettings = (settings, updates) => {
    return {
        ...settings,
        ...updates,
        tenantId: settings.tenantId, // Prevent ID change
    };
};
exports.updateTenantSettings = updateTenantSettings;
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
const mergeTenantSettings = (base, overrides) => {
    let result = { ...base };
    overrides.forEach(override => {
        result = {
            ...result,
            ...override,
            environment: { ...result.environment, ...override.environment },
            features: { ...result.features, ...override.features },
            integrations: { ...result.integrations, ...override.integrations },
        };
    });
    return result;
};
exports.mergeTenantSettings = mergeTenantSettings;
// ============================================================================
// TENANT SLA MANAGEMENT
// ============================================================================
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
const createTenantSLA = (tenantId, tier) => {
    const slaMap = {
        basic: {
            uptime: 99.0,
            responseTime: { p50: 200, p95: 1000, p99: 3000 },
            support: {
                level: 'basic',
                responseTimeMinutes: 240,
                channels: ['email'],
            },
            dataRetentionDays: 30,
            backupFrequencyHours: 24,
        },
        standard: {
            uptime: 99.5,
            responseTime: { p50: 150, p95: 500, p99: 1500 },
            support: {
                level: 'business',
                responseTimeMinutes: 60,
                channels: ['email', 'chat'],
            },
            dataRetentionDays: 90,
            backupFrequencyHours: 12,
        },
        premium: {
            uptime: 99.9,
            responseTime: { p50: 100, p95: 300, p99: 800 },
            support: {
                level: 'enterprise',
                responseTimeMinutes: 30,
                channels: ['email', 'chat', 'phone'],
            },
            dataRetentionDays: 180,
            backupFrequencyHours: 6,
        },
        enterprise: {
            uptime: 99.99,
            responseTime: { p50: 50, p95: 150, p99: 400 },
            support: {
                level: '24x7',
                responseTimeMinutes: 15,
                channels: ['email', 'chat', 'phone', 'dedicated'],
            },
            dataRetentionDays: 365,
            backupFrequencyHours: 1,
        },
    };
    const slaConfig = slaMap[tier] || slaMap.basic;
    return {
        tenantId,
        tier,
        uptime: slaConfig.uptime,
        responseTime: slaConfig.responseTime,
        support: slaConfig.support,
        dataRetentionDays: slaConfig.dataRetentionDays,
        backupFrequencyHours: slaConfig.backupFrequencyHours,
    };
};
exports.createTenantSLA = createTenantSLA;
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
const validateTenantSLA = (sla, metrics) => {
    const violations = [];
    if (metrics.actualUptime < sla.uptime) {
        violations.push(`Uptime SLA violated: ${metrics.actualUptime}% < ${sla.uptime}%`);
    }
    if (metrics.actualResponseTime.p50 > sla.responseTime.p50) {
        violations.push(`P50 response time violated: ${metrics.actualResponseTime.p50}ms > ${sla.responseTime.p50}ms`);
    }
    if (metrics.actualResponseTime.p95 > sla.responseTime.p95) {
        violations.push(`P95 response time violated: ${metrics.actualResponseTime.p95}ms > ${sla.responseTime.p95}ms`);
    }
    if (metrics.actualResponseTime.p99 > sla.responseTime.p99) {
        violations.push(`P99 response time violated: ${metrics.actualResponseTime.p99}ms > ${sla.responseTime.p99}ms`);
    }
    return {
        compliant: violations.length === 0,
        violations,
    };
};
exports.validateTenantSLA = validateTenantSLA;
// ============================================================================
// TENANT RESOURCE ALLOCATION
// ============================================================================
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
const createTenantResourceAllocation = (tenantId, options) => {
    return {
        tenantId,
        allocatedResources: options?.allocatedResources || {
            vmIds: [],
            storageVolumeIds: [],
            networkIds: [],
            ipAddresses: [],
        },
        reservations: options?.reservations || {
            guaranteedCPU: 0,
            guaranteedMemoryGB: 0,
            guaranteedStorageGB: 0,
            guaranteedBandwidthMbps: 0,
        },
        overcommit: options?.overcommit ?? false,
    };
};
exports.createTenantResourceAllocation = createTenantResourceAllocation;
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
const allocateResourcesToTenant = (allocation, resources) => {
    return {
        ...allocation,
        allocatedResources: {
            vmIds: [...allocation.allocatedResources.vmIds, ...(resources.vmIds || [])],
            storageVolumeIds: [...allocation.allocatedResources.storageVolumeIds, ...(resources.storageVolumeIds || [])],
            networkIds: [...allocation.allocatedResources.networkIds, ...(resources.networkIds || [])],
            ipAddresses: [...allocation.allocatedResources.ipAddresses, ...(resources.ipAddresses || [])],
        },
    };
};
exports.allocateResourcesToTenant = allocateResourcesToTenant;
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
const deallocateResourcesFromTenant = (allocation, resources) => {
    return {
        ...allocation,
        allocatedResources: {
            vmIds: allocation.allocatedResources.vmIds.filter(id => !resources.vmIds?.includes(id)),
            storageVolumeIds: allocation.allocatedResources.storageVolumeIds.filter(id => !resources.storageVolumeIds?.includes(id)),
            networkIds: allocation.allocatedResources.networkIds.filter(id => !resources.networkIds?.includes(id)),
            ipAddresses: allocation.allocatedResources.ipAddresses.filter(ip => !resources.ipAddresses?.includes(ip)),
        },
    };
};
exports.deallocateResourcesFromTenant = deallocateResourcesFromTenant;
// ============================================================================
// TENANT HIERARCHY
// ============================================================================
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
const createTenantHierarchyNode = (tenantId, parentId) => {
    return {
        tenantId,
        parentId,
        children: [],
        level: 0,
        path: [tenantId],
    };
};
exports.createTenantHierarchyNode = createTenantHierarchyNode;
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
const buildTenantHierarchy = (tenants) => {
    const nodeMap = new Map();
    // Create nodes
    tenants.forEach(tenant => {
        const node = (0, exports.createTenantHierarchyNode)(tenant.id, tenant.parentTenantId);
        nodeMap.set(tenant.id, node);
    });
    // Build hierarchy
    const roots = [];
    nodeMap.forEach(node => {
        if (node.parentId) {
            const parent = nodeMap.get(node.parentId);
            if (parent) {
                parent.children.push(node.tenantId);
                node.level = parent.level + 1;
                node.path = [...parent.path, node.tenantId];
            }
        }
        else {
            roots.push(node);
        }
    });
    return roots;
};
exports.buildTenantHierarchy = buildTenantHierarchy;
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
const getTenantAncestors = (tenantId, hierarchy) => {
    const node = hierarchy.get(tenantId);
    if (!node)
        return [];
    return node.path.slice(0, -1); // Exclude self
};
exports.getTenantAncestors = getTenantAncestors;
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
const getTenantDescendants = (tenantId, hierarchy) => {
    const node = hierarchy.get(tenantId);
    if (!node)
        return [];
    const descendants = [];
    const traverse = (nodeId) => {
        const currentNode = hierarchy.get(nodeId);
        if (!currentNode)
            return;
        currentNode.children.forEach(childId => {
            descendants.push(childId);
            traverse(childId);
        });
    };
    traverse(tenantId);
    return descendants;
};
exports.getTenantDescendants = getTenantDescendants;
// ============================================================================
// TENANT COMPLIANCE
// ============================================================================
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
const createTenantCompliance = (tenantId, options) => {
    return {
        tenantId,
        frameworks: options?.frameworks || [],
        dataResidency: options?.dataResidency || [],
        encryptionAtRest: options?.encryptionAtRest ?? true,
        encryptionInTransit: options?.encryptionInTransit ?? true,
        auditRetentionDays: options?.auditRetentionDays ?? 365,
        gdprCompliant: options?.gdprCompliant ?? false,
        hipaaCompliant: options?.hipaaCompliant ?? false,
    };
};
exports.createTenantCompliance = createTenantCompliance;
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
const validateTenantCompliance = (compliance) => {
    const violations = [];
    if (compliance.hipaaCompliant) {
        if (!compliance.encryptionAtRest) {
            violations.push('HIPAA requires encryption at rest');
        }
        if (!compliance.encryptionInTransit) {
            violations.push('HIPAA requires encryption in transit');
        }
        if (compliance.auditRetentionDays < 2555) { // 7 years
            violations.push('HIPAA requires 7 years of audit retention');
        }
    }
    if (compliance.gdprCompliant) {
        if (compliance.dataResidency.length === 0) {
            violations.push('GDPR requires data residency specification');
        }
    }
    return violations;
};
exports.validateTenantCompliance = validateTenantCompliance;
// ============================================================================
// TENANT COST MANAGEMENT
// ============================================================================
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
const calculateTenantCosts = (usage, rates) => {
    const hoursInMonth = 730; // Average
    const breakdown = {
        cpu: usage.currentCPU * (rates.cpuPerHour || 0) * hoursInMonth,
        memory: usage.currentMemoryGB * (rates.memoryGBPerHour || 0) * hoursInMonth,
        storage: usage.currentStorageGB * (rates.storageGBPerMonth || 0),
        bandwidth: usage.currentNetworkBandwidthMbps * (rates.bandwidthMbpsPerMonth || 0),
        snapshots: usage.currentSnapshots * (rates.snapshotPerMonth || 0),
        backups: usage.currentBackups * (rates.backupPerMonth || 0),
    };
    const totalCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    return { totalCost, breakdown };
};
exports.calculateTenantCosts = calculateTenantCosts;
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
const generateTenantBillingReport = (tenantId, usage, startDate, endDate) => {
    return {
        tenantId,
        period: { start: startDate, end: endDate },
        usage,
        generatedAt: new Date(),
    };
};
exports.generateTenantBillingReport = generateTenantBillingReport;
// ============================================================================
// TENANT ACCESS CONTROL
// ============================================================================
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
const createTenantAccessControl = (tenantId, allowedIPs, allowedRegions) => {
    return {
        tenantId,
        allowedIPs,
        allowedRegions,
        createdAt: new Date(),
    };
};
exports.createTenantAccessControl = createTenantAccessControl;
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
const validateTenantAccess = (tenantId, sourceIP, region, accessControl) => {
    // Check region
    if (accessControl.allowedRegions.length > 0 &&
        !accessControl.allowedRegions.includes(region)) {
        return false;
    }
    // Check IP (simplified - production should use CIDR matching)
    if (accessControl.allowedIPs.length > 0) {
        const ipAllowed = accessControl.allowedIPs.some(allowedIP => {
            if (allowedIP.includes('/')) {
                // CIDR range - simplified check
                return sourceIP.startsWith(allowedIP.split('/')[0].split('.').slice(0, 3).join('.'));
            }
            return sourceIP === allowedIP;
        });
        if (!ipAllowed)
            return false;
    }
    return true;
};
exports.validateTenantAccess = validateTenantAccess;
// ============================================================================
// TENANT ONBOARDING/OFFBOARDING
// ============================================================================
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
const createTenantOnboarding = (tenant) => {
    return {
        tenantId: tenant.id,
        steps: [
            { name: 'Create tenant configuration', status: 'completed' },
            { name: 'Provision resources', status: 'pending' },
            { name: 'Setup networking', status: 'pending' },
            { name: 'Configure security', status: 'pending' },
            { name: 'Initialize database', status: 'pending' },
            { name: 'Deploy applications', status: 'pending' },
            { name: 'Send welcome email', status: 'pending' },
        ],
        startedAt: new Date(),
    };
};
exports.createTenantOnboarding = createTenantOnboarding;
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
const createTenantOffboarding = (tenantId) => {
    return {
        tenantId,
        steps: [
            { name: 'Backup tenant data', status: 'pending' },
            { name: 'Notify tenant', status: 'pending' },
            { name: 'Archive configurations', status: 'pending' },
            { name: 'Deallocate resources', status: 'pending' },
            { name: 'Clean up networking', status: 'pending' },
            { name: 'Delete databases', status: 'pending' },
            { name: 'Generate final report', status: 'pending' },
        ],
        startedAt: new Date(),
    };
};
exports.createTenantOffboarding = createTenantOffboarding;
// ============================================================================
// TENANT MIGRATION
// ============================================================================
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
const createTenantMigrationPlan = (tenantId, targetEnvironment) => {
    return {
        tenantId,
        targetEnvironment,
        phases: [
            { name: 'Pre-migration assessment', estimatedDuration: '2 hours' },
            { name: 'Data backup', estimatedDuration: '4 hours' },
            { name: 'Resource provisioning', estimatedDuration: '1 hour' },
            { name: 'Data migration', estimatedDuration: '6 hours' },
            { name: 'Configuration sync', estimatedDuration: '1 hour' },
            { name: 'Testing and validation', estimatedDuration: '3 hours' },
            { name: 'Cutover', estimatedDuration: '30 minutes' },
            { name: 'Post-migration verification', estimatedDuration: '2 hours' },
        ],
        createdAt: new Date(),
    };
};
exports.createTenantMigrationPlan = createTenantMigrationPlan;
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
const validateTenantMigrationReadiness = (tenantId, quota) => {
    const blockers = [];
    const warnings = [];
    if (!quota.usage) {
        blockers.push('Usage data not available');
    }
    if (quota.usage && quota.usage.currentVMs === 0) {
        warnings.push('No VMs currently running');
    }
    return {
        ready: blockers.length === 0,
        blockers,
        warnings,
    };
};
exports.validateTenantMigrationReadiness = validateTenantMigrationReadiness;
// ============================================================================
// TENANT MONITORING
// ============================================================================
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
const createTenantHealthCheck = (tenantId) => {
    return {
        tenantId,
        checks: [
            { name: 'API availability', interval: 60, timeout: 5 },
            { name: 'Database connectivity', interval: 120, timeout: 10 },
            { name: 'Resource utilization', interval: 300, timeout: 30 },
            { name: 'Security compliance', interval: 3600, timeout: 60 },
        ],
        enabled: true,
    };
};
exports.createTenantHealthCheck = createTenantHealthCheck;
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
const generateTenantStatusReport = (tenant, quota, sla) => {
    return {
        tenant,
        quotaUtilization: (0, exports.calculateQuotaUtilization)(quota),
        sla,
        generatedAt: new Date(),
    };
};
exports.generateTenantStatusReport = generateTenantStatusReport;
// ============================================================================
// TENANT DATA MANAGEMENT
// ============================================================================
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
const createTenantDataRetention = (tenantId, retentionDays) => {
    return {
        tenantId,
        retentionDays,
        dataTypes: {
            applicationLogs: retentionDays,
            auditLogs: Math.max(retentionDays, 2555), // HIPAA: 7 years minimum
            backups: 90,
            snapshots: 30,
            metrics: 180,
        },
        createdAt: new Date(),
    };
};
exports.createTenantDataRetention = createTenantDataRetention;
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
const exportTenantData = (tenantId, config, settings) => {
    return {
        tenantId,
        config,
        settings,
        exportedAt: new Date(),
        version: '1.0.0',
    };
};
exports.exportTenantData = exportTenantData;
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
const importTenantData = (exportedData) => {
    const errors = [];
    if (!exportedData.tenantId) {
        errors.push('Tenant ID is required');
    }
    if (!exportedData.config) {
        errors.push('Tenant configuration is required');
    }
    if (!exportedData.settings) {
        errors.push('Tenant settings are required');
    }
    return {
        success: errors.length === 0,
        tenantId: exportedData.tenantId,
        errors,
    };
};
exports.importTenantData = importTenantData;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    createTenantConfig: exports.createTenantConfig,
    generateTenantId: exports.generateTenantId,
    validateTenantConfig: exports.validateTenantConfig,
    updateTenantConfig: exports.updateTenantConfig,
    createTenantIsolation: exports.createTenantIsolation,
    validateTenantIsolation: exports.validateTenantIsolation,
    calculateIsolationScore: exports.calculateIsolationScore,
    createTenantQuota: exports.createTenantQuota,
    getTierQuotaLimits: exports.getTierQuotaLimits,
    checkTenantQuota: exports.checkTenantQuota,
    updateTenantQuotaUsage: exports.updateTenantQuotaUsage,
    calculateQuotaUtilization: exports.calculateQuotaUtilization,
    createTenantSettings: exports.createTenantSettings,
    createDefaultNotificationSettings: exports.createDefaultNotificationSettings,
    createDefaultSecuritySettings: exports.createDefaultSecuritySettings,
    createDefaultBillingSettings: exports.createDefaultBillingSettings,
    updateTenantSettings: exports.updateTenantSettings,
    mergeTenantSettings: exports.mergeTenantSettings,
    createTenantSLA: exports.createTenantSLA,
    validateTenantSLA: exports.validateTenantSLA,
    createTenantResourceAllocation: exports.createTenantResourceAllocation,
    allocateResourcesToTenant: exports.allocateResourcesToTenant,
    deallocateResourcesFromTenant: exports.deallocateResourcesFromTenant,
    createTenantHierarchyNode: exports.createTenantHierarchyNode,
    buildTenantHierarchy: exports.buildTenantHierarchy,
    getTenantAncestors: exports.getTenantAncestors,
    getTenantDescendants: exports.getTenantDescendants,
    createTenantCompliance: exports.createTenantCompliance,
    validateTenantCompliance: exports.validateTenantCompliance,
    calculateTenantCosts: exports.calculateTenantCosts,
    generateTenantBillingReport: exports.generateTenantBillingReport,
    createTenantAccessControl: exports.createTenantAccessControl,
    validateTenantAccess: exports.validateTenantAccess,
    createTenantOnboarding: exports.createTenantOnboarding,
    createTenantOffboarding: exports.createTenantOffboarding,
    createTenantMigrationPlan: exports.createTenantMigrationPlan,
    validateTenantMigrationReadiness: exports.validateTenantMigrationReadiness,
    createTenantHealthCheck: exports.createTenantHealthCheck,
    generateTenantStatusReport: exports.generateTenantStatusReport,
    createTenantDataRetention: exports.createTenantDataRetention,
    exportTenantData: exports.exportTenantData,
    importTenantData: exports.importTenantData,
};
//# sourceMappingURL=virtual-tenant-config-kit.js.map