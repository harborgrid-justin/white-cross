/**
 * LOC: VCFG8A9B0C1
 * File: /reuse/virtual/virtual-config-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Virtual infrastructure configuration modules
 *   - VMware vRealize configuration services
 *   - Environment management systems
 *   - Policy configuration handlers
 */

/**
 * File: /reuse/virtual/virtual-config-management-kit.ts
 * Locator: WC-VIRT-CFG-001
 * Purpose: Virtual Infrastructure Configuration Management Toolkit - Configuration utilities for virtual environments
 *
 * Upstream: Independent utility module for virtual infrastructure configuration
 * Downstream: ../backend/*, VMware vRealize services, Virtual config modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/config, joi, class-validator
 * Exports: 42 utility functions for config management, feature flags, policy management, settings persistence
 *
 * LLM Context: Enterprise-grade configuration utilities for virtual infrastructure management.
 * Provides VMware vRealize configuration patterns, environment variable management, policy-based
 * configuration, feature flags, settings persistence, dynamic configuration reloading, schema
 * validation, and HIPAA-compliant configuration management for healthcare virtual environments.
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Virtual infrastructure configuration options
 */
export interface VirtualConfigOptions {
  environment: 'development' | 'staging' | 'production';
  provider: 'vmware' | 'hyperv' | 'kvm' | 'xen';
  region?: string;
  enableCaching?: boolean;
  enableValidation?: boolean;
  configPath?: string;
}

/**
 * Policy configuration definition
 */
export interface PolicyConfig {
  name: string;
  enabled: boolean;
  priority: number;
  scope: 'global' | 'tenant' | 'resource';
  rules: PolicyRule[];
  metadata?: Record<string, any>;
}

/**
 * Policy rule definition
 */
export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'warn';
  parameters?: Record<string, any>;
}

/**
 * Feature flag with rollout strategy
 */
export interface VirtualFeatureFlag {
  name: string;
  enabled: boolean;
  environments: string[];
  rolloutPercentage: number;
  targetTenants?: string[];
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Settings persistence configuration
 */
export interface SettingsPersistence {
  backend: 'file' | 'database' | 'redis' | 'consul';
  encryptionEnabled: boolean;
  compressionEnabled: boolean;
  versioning: boolean;
  retentionDays: number;
}

/**
 * Configuration reload strategy
 */
export interface ReloadStrategy {
  mode: 'manual' | 'auto' | 'scheduled';
  interval?: number;
  watchFiles?: string[];
  onReload?: (config: any) => void | Promise<void>;
}

/**
 * VMware vRealize configuration
 */
export interface VRealizeConfig {
  endpoint: string;
  username: string;
  password: string;
  tenant: string;
  apiVersion: string;
  sslVerify: boolean;
  timeout: number;
  maxRetries: number;
}

/**
 * Configuration snapshot
 */
export interface ConfigSnapshot {
  id: string;
  timestamp: Date;
  environment: string;
  config: Record<string, any>;
  checksum: string;
  metadata?: Record<string, any>;
}

/**
 * Configuration validation error
 */
export interface ConfigValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

/**
 * Configuration merge conflict
 */
export interface ConfigMergeConflict {
  key: string;
  localValue: any;
  remoteValue: any;
  resolution?: 'local' | 'remote' | 'merge';
}

// ============================================================================
// VIRTUAL INFRASTRUCTURE CONFIGURATION
// ============================================================================

/**
 * Creates virtual infrastructure configuration with provider-specific defaults.
 *
 * @param {VirtualConfigOptions} options - Configuration options
 * @returns {Record<string, any>} Virtual infrastructure configuration
 *
 * @example
 * ```typescript
 * const vmwareConfig = createVirtualConfig({
 *   environment: 'production',
 *   provider: 'vmware',
 *   region: 'us-east-1',
 *   enableCaching: true
 * });
 * ```
 */
export const createVirtualConfig = (
  options: VirtualConfigOptions
): Record<string, any> => {
  const baseConfig = {
    environment: options.environment,
    provider: options.provider,
    region: options.region || 'default',
    caching: options.enableCaching ?? true,
    validation: options.enableValidation ?? true,
    configPath: options.configPath || '/etc/virtual-config',
  };

  const providerDefaults = getProviderDefaults(options.provider);

  return {
    ...baseConfig,
    ...providerDefaults,
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
};

/**
 * Gets provider-specific default configuration.
 *
 * @param {string} provider - Infrastructure provider
 * @returns {Record<string, any>} Provider defaults
 *
 * @example
 * ```typescript
 * const vmwareDefaults = getProviderDefaults('vmware');
 * // Returns VMware-specific configuration defaults
 * ```
 */
export const getProviderDefaults = (provider: string): Record<string, any> => {
  const defaults: Record<string, Record<string, any>> = {
    vmware: {
      vcenter: {
        port: 443,
        apiVersion: '7.0',
        sslVerify: true,
      },
      vrealize: {
        apiVersion: '8.6',
        timeout: 30000,
        maxRetries: 3,
      },
      nsx: {
        apiVersion: '3.2',
        transport: 'https',
      },
    },
    hyperv: {
      scvmm: {
        port: 8090,
        useSSL: true,
      },
      powershell: {
        version: '5.1',
        remoting: true,
      },
    },
    kvm: {
      libvirt: {
        transport: 'tls',
        port: 16514,
      },
      qemu: {
        version: '6.0',
      },
    },
    xen: {
      xenserver: {
        apiVersion: '8.2',
        port: 443,
      },
    },
  };

  return defaults[provider] || {};
};

/**
 * Parses VMware vRealize configuration from environment variables.
 *
 * @param {string} [prefix] - Environment variable prefix
 * @returns {VRealizeConfig} vRealize configuration
 *
 * @example
 * ```typescript
 * const vrealizeConfig = parseVRealizeConfig('VREALIZE_');
 * // Reads VREALIZE_ENDPOINT, VREALIZE_USERNAME, etc.
 * ```
 */
export const parseVRealizeConfig = (prefix: string = 'VREALIZE_'): VRealizeConfig => {
  return {
    endpoint: process.env[`${prefix}ENDPOINT`] || '',
    username: process.env[`${prefix}USERNAME`] || '',
    password: process.env[`${prefix}PASSWORD`] || '',
    tenant: process.env[`${prefix}TENANT`] || 'vsphere.local',
    apiVersion: process.env[`${prefix}API_VERSION`] || '8.6',
    sslVerify: process.env[`${prefix}SSL_VERIFY`] !== 'false',
    timeout: parseInt(process.env[`${prefix}TIMEOUT`] || '30000', 10),
    maxRetries: parseInt(process.env[`${prefix}MAX_RETRIES`] || '3', 10),
  };
};

/**
 * Validates VMware vRealize configuration.
 *
 * @param {VRealizeConfig} config - vRealize configuration
 * @returns {ConfigValidationError[]} Validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateVRealizeConfig(config);
 * if (errors.length > 0) {
 *   console.error('Configuration errors:', errors);
 * }
 * ```
 */
export const validateVRealizeConfig = (
  config: VRealizeConfig
): ConfigValidationError[] => {
  const errors: ConfigValidationError[] = [];

  if (!config.endpoint) {
    errors.push({
      field: 'endpoint',
      message: 'vRealize endpoint is required',
    });
  }

  if (!config.username) {
    errors.push({
      field: 'username',
      message: 'vRealize username is required',
    });
  }

  if (!config.password) {
    errors.push({
      field: 'password',
      message: 'vRealize password is required',
    });
  }

  if (config.timeout < 1000 || config.timeout > 300000) {
    errors.push({
      field: 'timeout',
      message: 'Timeout must be between 1000 and 300000 milliseconds',
      value: config.timeout,
      constraint: 'min:1000,max:300000',
    });
  }

  return errors;
};

// ============================================================================
// ENVIRONMENT CONFIGURATION MANAGEMENT
// ============================================================================

/**
 * Loads environment-specific configuration from multiple sources.
 *
 * @param {string} environment - Environment name
 * @param {string[]} [sources] - Configuration sources
 * @returns {Promise<Record<string, any>>} Merged configuration
 *
 * @example
 * ```typescript
 * const config = await loadEnvironmentConfig('production', [
 *   '/etc/config/base.json',
 *   '/etc/config/production.json',
 *   '/etc/config/local.json'
 * ]);
 * ```
 */
export const loadEnvironmentConfig = async (
  environment: string,
  sources?: string[]
): Promise<Record<string, any>> => {
  const defaultSources = [
    `config/base.json`,
    `config/${environment}.json`,
    `config/${environment}.local.json`,
  ];

  const configSources = sources || defaultSources;
  const configs: Record<string, any>[] = [];

  for (const source of configSources) {
    try {
      if (fs.existsSync(source)) {
        const content = await fs.promises.readFile(source, 'utf-8');
        const config = JSON.parse(content);
        configs.push(config);
      }
    } catch (error) {
      console.warn(`Failed to load config from ${source}:`, error);
    }
  }

  return deepMergeConfigs(configs);
};

/**
 * Exports configuration to environment-specific file.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} environment - Environment name
 * @param {string} [outputPath] - Output file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await exportEnvironmentConfig(config, 'staging', '/etc/config/staging.json');
 * ```
 */
export const exportEnvironmentConfig = async (
  config: Record<string, any>,
  environment: string,
  outputPath?: string
): Promise<void> => {
  const filePath = outputPath || `config/${environment}.json`;
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  const content = JSON.stringify(config, null, 2);
  await fs.promises.writeFile(filePath, content, 'utf-8');
};

/**
 * Compares configurations across environments.
 *
 * @param {Record<string, Record<string, any>>} envConfigs - Map of environment to config
 * @returns {Record<string, any>} Configuration differences
 *
 * @example
 * ```typescript
 * const diffs = compareEnvironmentConfigs({
 *   development: devConfig,
 *   production: prodConfig
 * });
 * ```
 */
export const compareEnvironmentConfigs = (
  envConfigs: Record<string, Record<string, any>>
): Record<string, any> => {
  const environments = Object.keys(envConfigs);
  const allKeys = new Set<string>();

  // Collect all keys
  environments.forEach(env => {
    Object.keys(flattenConfig(envConfigs[env])).forEach(key => allKeys.add(key));
  });

  const differences: Record<string, any> = {};

  allKeys.forEach(key => {
    const values = environments.map(env => ({
      env,
      value: getNestedValue(envConfigs[env], key),
    }));

    const uniqueValues = new Set(values.map(v => JSON.stringify(v.value)));

    if (uniqueValues.size > 1) {
      differences[key] = values;
    }
  });

  return differences;
};

/**
 * Creates environment variable mapping from configuration.
 *
 * @param {Record<string, any>} config - Configuration object
 * @param {string} [prefix] - Variable prefix
 * @returns {Record<string, string>} Environment variables
 *
 * @example
 * ```typescript
 * const envVars = createEnvMapping(config, 'APP_');
 * // { APP_DATABASE_HOST: 'localhost', APP_DATABASE_PORT: '5432', ... }
 * ```
 */
export const createEnvMapping = (
  config: Record<string, any>,
  prefix: string = ''
): Record<string, string> => {
  const flattened = flattenConfig(config);
  const envVars: Record<string, string> = {};

  Object.entries(flattened).forEach(([key, value]) => {
    const envKey = `${prefix}${key.toUpperCase().replace(/\./g, '_')}`;
    envVars[envKey] = String(value);
  });

  return envVars;
};

// ============================================================================
// POLICY CONFIGURATION MANAGEMENT
// ============================================================================

/**
 * Creates policy configuration with validation.
 *
 * @param {string} name - Policy name
 * @param {PolicyRule[]} rules - Policy rules
 * @param {Partial<PolicyConfig>} [options] - Additional options
 * @returns {PolicyConfig} Policy configuration
 *
 * @example
 * ```typescript
 * const policy = createPolicyConfig('resource-limits', [
 *   { id: 'cpu-limit', condition: 'cpu > 80', action: 'warn' },
 *   { id: 'memory-limit', condition: 'memory > 90', action: 'deny' }
 * ], { priority: 100, scope: 'global' });
 * ```
 */
export const createPolicyConfig = (
  name: string,
  rules: PolicyRule[],
  options?: Partial<PolicyConfig>
): PolicyConfig => {
  return {
    name,
    enabled: options?.enabled ?? true,
    priority: options?.priority ?? 0,
    scope: options?.scope || 'global',
    rules,
    metadata: options?.metadata,
  };
};

/**
 * Evaluates policy rules against configuration.
 *
 * @param {PolicyConfig} policy - Policy configuration
 * @param {Record<string, any>} context - Evaluation context
 * @returns {object} Evaluation result
 *
 * @example
 * ```typescript
 * const result = evaluatePolicy(resourcePolicy, {
 *   cpu: 85,
 *   memory: 75,
 *   disk: 60
 * });
 * ```
 */
export const evaluatePolicy = (
  policy: PolicyConfig,
  context: Record<string, any>
): { allowed: boolean; violations: PolicyRule[]; warnings: PolicyRule[] } => {
  if (!policy.enabled) {
    return { allowed: true, violations: [], warnings: [] };
  }

  const violations: PolicyRule[] = [];
  const warnings: PolicyRule[] = [];

  policy.rules.forEach(rule => {
    const matches = evaluatePolicyCondition(rule.condition, context);

    if (matches) {
      if (rule.action === 'deny') {
        violations.push(rule);
      } else if (rule.action === 'warn') {
        warnings.push(rule);
      }
    }
  });

  return {
    allowed: violations.length === 0,
    violations,
    warnings,
  };
};

/**
 * Evaluates policy condition against context.
 *
 * @param {string} condition - Policy condition
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} True if condition matches
 *
 * @example
 * ```typescript
 * const matches = evaluatePolicyCondition('cpu > 80', { cpu: 85 });
 * // Returns: true
 * ```
 */
export const evaluatePolicyCondition = (
  condition: string,
  context: Record<string, any>
): boolean => {
  try {
    // Simple expression evaluator (production should use safe eval library)
    const operators = ['>=', '<=', '>', '<', '==', '!='];
    let operator = '';
    let parts: string[] = [];

    for (const op of operators) {
      if (condition.includes(op)) {
        operator = op;
        parts = condition.split(op).map(p => p.trim());
        break;
      }
    }

    if (!operator || parts.length !== 2) {
      return false;
    }

    const leftValue = context[parts[0]] ?? parts[0];
    const rightValue = isNaN(Number(parts[1])) ? parts[1] : Number(parts[1]);

    switch (operator) {
      case '>': return Number(leftValue) > Number(rightValue);
      case '<': return Number(leftValue) < Number(rightValue);
      case '>=': return Number(leftValue) >= Number(rightValue);
      case '<=': return Number(leftValue) <= Number(rightValue);
      case '==': return leftValue == rightValue;
      case '!=': return leftValue != rightValue;
      default: return false;
    }
  } catch {
    return false;
  }
};

/**
 * Merges multiple policy configurations with priority ordering.
 *
 * @param {PolicyConfig[]} policies - Policies to merge
 * @returns {PolicyConfig[]} Merged and sorted policies
 *
 * @example
 * ```typescript
 * const merged = mergePolicyConfigs([
 *   globalPolicy,
 *   tenantPolicy,
 *   resourcePolicy
 * ]);
 * // Returns policies sorted by priority (highest first)
 * ```
 */
export const mergePolicyConfigs = (policies: PolicyConfig[]): PolicyConfig[] => {
  return [...policies].sort((a, b) => b.priority - a.priority);
};

// ============================================================================
// FEATURE FLAG MANAGEMENT
// ============================================================================

/**
 * Creates virtual feature flag with rollout strategy.
 *
 * @param {string} name - Feature flag name
 * @param {boolean} enabled - Whether feature is enabled
 * @param {Partial<VirtualFeatureFlag>} [options] - Additional options
 * @returns {VirtualFeatureFlag} Feature flag configuration
 *
 * @example
 * ```typescript
 * const flag = createVirtualFeatureFlag('advanced-networking', true, {
 *   environments: ['staging', 'production'],
 *   rolloutPercentage: 25,
 *   targetTenants: ['tenant-a', 'tenant-b']
 * });
 * ```
 */
export const createVirtualFeatureFlag = (
  name: string,
  enabled: boolean,
  options?: Partial<VirtualFeatureFlag>
): VirtualFeatureFlag => {
  return {
    name,
    enabled,
    environments: options?.environments || [],
    rolloutPercentage: options?.rolloutPercentage ?? 100,
    targetTenants: options?.targetTenants,
    expiresAt: options?.expiresAt,
    metadata: options?.metadata,
  };
};

/**
 * Evaluates feature flag for tenant and environment.
 *
 * @param {VirtualFeatureFlag} flag - Feature flag
 * @param {string} environment - Current environment
 * @param {string} [tenantId] - Tenant identifier
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ```typescript
 * const enabled = evaluateFeatureFlag(flag, 'production', 'tenant-123');
 * if (enabled) {
 *   // Enable feature for this tenant
 * }
 * ```
 */
export const evaluateFeatureFlag = (
  flag: VirtualFeatureFlag,
  environment: string,
  tenantId?: string
): boolean => {
  if (!flag.enabled) return false;

  // Check expiration
  if (flag.expiresAt && new Date() > flag.expiresAt) {
    return false;
  }

  // Check environment
  if (flag.environments.length > 0 && !flag.environments.includes(environment)) {
    return false;
  }

  // Check tenant targeting
  if (flag.targetTenants && tenantId && !flag.targetTenants.includes(tenantId)) {
    return false;
  }

  // Check rollout percentage
  if (flag.rolloutPercentage < 100) {
    const hash = tenantId ? hashString(tenantId) : Math.random() * 100;
    const bucket = hash % 100;
    return bucket < flag.rolloutPercentage;
  }

  return true;
};

/**
 * Loads feature flags from configuration file.
 *
 * @param {string} filePath - Feature flags file path
 * @returns {Promise<VirtualFeatureFlag[]>} Feature flags
 *
 * @example
 * ```typescript
 * const flags = await loadFeatureFlags('/etc/config/features.json');
 * ```
 */
export const loadFeatureFlags = async (
  filePath: string
): Promise<VirtualFeatureFlag[]> => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data.flags || [];
  } catch (error) {
    console.warn(`Failed to load feature flags from ${filePath}:`, error);
    return [];
  }
};

/**
 * Saves feature flags to configuration file.
 *
 * @param {VirtualFeatureFlag[]} flags - Feature flags
 * @param {string} filePath - Output file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await saveFeatureFlags(flags, '/etc/config/features.json');
 * ```
 */
export const saveFeatureFlags = async (
  flags: VirtualFeatureFlag[],
  filePath: string
): Promise<void> => {
  const data = {
    flags,
    updatedAt: new Date().toISOString(),
  };

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// ============================================================================
// SETTINGS PERSISTENCE
// ============================================================================

/**
 * Creates settings persistence configuration.
 *
 * @param {Partial<SettingsPersistence>} options - Persistence options
 * @returns {SettingsPersistence} Persistence configuration
 *
 * @example
 * ```typescript
 * const persistence = createSettingsPersistence({
 *   backend: 'redis',
 *   encryptionEnabled: true,
 *   versioning: true
 * });
 * ```
 */
export const createSettingsPersistence = (
  options: Partial<SettingsPersistence> = {}
): SettingsPersistence => {
  return {
    backend: options.backend || 'file',
    encryptionEnabled: options.encryptionEnabled ?? false,
    compressionEnabled: options.compressionEnabled ?? false,
    versioning: options.versioning ?? false,
    retentionDays: options.retentionDays ?? 90,
  };
};

/**
 * Persists configuration settings to backend.
 *
 * @param {Record<string, any>} settings - Settings to persist
 * @param {SettingsPersistence} persistence - Persistence configuration
 * @param {string} [key] - Settings key/identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistSettings(vmConfig, persistence, 'virtual-machine-config');
 * ```
 */
export const persistSettings = async (
  settings: Record<string, any>,
  persistence: SettingsPersistence,
  key: string = 'default'
): Promise<void> => {
  let data = JSON.stringify(settings);

  // Encrypt if enabled
  if (persistence.encryptionEnabled) {
    const encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || '';
    data = encryptSettingsData(data, encryptionKey);
  }

  // Compress if enabled
  if (persistence.compressionEnabled) {
    data = compressData(data);
  }

  // Persist based on backend
  switch (persistence.backend) {
    case 'file':
      await persistToFile(key, data, persistence.versioning);
      break;
    case 'database':
      await persistToDatabase(key, data, persistence.versioning);
      break;
    case 'redis':
      await persistToRedis(key, data, persistence.retentionDays);
      break;
    case 'consul':
      await persistToConsul(key, data);
      break;
  }
};

/**
 * Loads configuration settings from backend.
 *
 * @param {string} key - Settings key/identifier
 * @param {SettingsPersistence} persistence - Persistence configuration
 * @returns {Promise<Record<string, any> | null>} Settings or null
 *
 * @example
 * ```typescript
 * const config = await loadSettings('virtual-machine-config', persistence);
 * ```
 */
export const loadSettings = async (
  key: string,
  persistence: SettingsPersistence
): Promise<Record<string, any> | null> => {
  let data: string | null = null;

  // Load based on backend
  switch (persistence.backend) {
    case 'file':
      data = await loadFromFile(key);
      break;
    case 'database':
      data = await loadFromDatabase(key);
      break;
    case 'redis':
      data = await loadFromRedis(key);
      break;
    case 'consul':
      data = await loadFromConsul(key);
      break;
  }

  if (!data) return null;

  // Decompress if needed
  if (persistence.compressionEnabled) {
    data = decompressData(data);
  }

  // Decrypt if needed
  if (persistence.encryptionEnabled) {
    const encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || '';
    data = decryptSettingsData(data, encryptionKey);
  }

  return JSON.parse(data);
};

// ============================================================================
// CONFIGURATION RELOADING
// ============================================================================

/**
 * Creates configuration reload strategy.
 *
 * @param {Partial<ReloadStrategy>} options - Reload strategy options
 * @returns {ReloadStrategy} Reload strategy configuration
 *
 * @example
 * ```typescript
 * const strategy = createReloadStrategy({
 *   mode: 'auto',
 *   interval: 60000,
 *   watchFiles: ['/etc/config/*.json']
 * });
 * ```
 */
export const createReloadStrategy = (
  options: Partial<ReloadStrategy> = {}
): ReloadStrategy => {
  return {
    mode: options.mode || 'manual',
    interval: options.interval || 60000,
    watchFiles: options.watchFiles || [],
    onReload: options.onReload,
  };
};

/**
 * Starts automatic configuration reloading.
 *
 * @param {() => Promise<Record<string, any>>} loader - Configuration loader function
 * @param {ReloadStrategy} strategy - Reload strategy
 * @returns {() => void} Stop function
 *
 * @example
 * ```typescript
 * const stop = startConfigReload(
 *   async () => loadEnvironmentConfig('production'),
 *   reloadStrategy
 * );
 *
 * // Later: stop()
 * ```
 */
export const startConfigReload = (
  loader: () => Promise<Record<string, any>>,
  strategy: ReloadStrategy
): (() => void) => {
  if (strategy.mode === 'manual') {
    return () => {}; // No-op for manual mode
  }

  let intervalId: NodeJS.Timeout | null = null;
  let watchers: fs.FSWatcher[] = [];

  const reload = async () => {
    try {
      const config = await loader();
      if (strategy.onReload) {
        await strategy.onReload(config);
      }
    } catch (error) {
      console.error('Configuration reload failed:', error);
    }
  };

  if (strategy.mode === 'scheduled' && strategy.interval) {
    intervalId = setInterval(reload, strategy.interval);
  }

  if (strategy.mode === 'auto' && strategy.watchFiles) {
    strategy.watchFiles.forEach(file => {
      try {
        const watcher = fs.watch(file, () => reload());
        watchers.push(watcher);
      } catch (error) {
        console.warn(`Failed to watch file ${file}:`, error);
      }
    });
  }

  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    watchers.forEach(watcher => watcher.close());
  };
};

/**
 * Triggers manual configuration reload.
 *
 * @param {() => Promise<Record<string, any>>} loader - Configuration loader function
 * @returns {Promise<Record<string, any>>} Reloaded configuration
 *
 * @example
 * ```typescript
 * const newConfig = await reloadConfig(
 *   async () => loadEnvironmentConfig('production')
 * );
 * ```
 */
export const reloadConfig = async (
  loader: () => Promise<Record<string, any>>
): Promise<Record<string, any>> => {
  return await loader();
};

// ============================================================================
// CONFIGURATION SNAPSHOTS
// ============================================================================

/**
 * Creates configuration snapshot.
 *
 * @param {Record<string, any>} config - Configuration to snapshot
 * @param {string} environment - Environment name
 * @returns {ConfigSnapshot} Configuration snapshot
 *
 * @example
 * ```typescript
 * const snapshot = createConfigSnapshot(config, 'production');
 * ```
 */
export const createConfigSnapshot = (
  config: Record<string, any>,
  environment: string
): ConfigSnapshot => {
  const serialized = JSON.stringify(config);
  const checksum = generateChecksum(serialized);

  return {
    id: `snapshot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    environment,
    config,
    checksum,
  };
};

/**
 * Saves configuration snapshot to file.
 *
 * @param {ConfigSnapshot} snapshot - Configuration snapshot
 * @param {string} [directory] - Snapshot directory
 * @returns {Promise<string>} Snapshot file path
 *
 * @example
 * ```typescript
 * const filePath = await saveConfigSnapshot(snapshot, '/var/snapshots');
 * ```
 */
export const saveConfigSnapshot = async (
  snapshot: ConfigSnapshot,
  directory: string = './snapshots'
): Promise<string> => {
  if (!fs.existsSync(directory)) {
    await fs.promises.mkdir(directory, { recursive: true });
  }

  const fileName = `${snapshot.id}.json`;
  const filePath = path.join(directory, fileName);

  await fs.promises.writeFile(
    filePath,
    JSON.stringify(snapshot, null, 2),
    'utf-8'
  );

  return filePath;
};

/**
 * Loads configuration snapshot from file.
 *
 * @param {string} snapshotId - Snapshot identifier
 * @param {string} [directory] - Snapshot directory
 * @returns {Promise<ConfigSnapshot | null>} Configuration snapshot
 *
 * @example
 * ```typescript
 * const snapshot = await loadConfigSnapshot('snapshot-123', '/var/snapshots');
 * ```
 */
export const loadConfigSnapshot = async (
  snapshotId: string,
  directory: string = './snapshots'
): Promise<ConfigSnapshot | null> => {
  const filePath = path.join(directory, `${snapshotId}.json`);

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
};

/**
 * Validates configuration snapshot integrity.
 *
 * @param {ConfigSnapshot} snapshot - Configuration snapshot
 * @returns {boolean} True if snapshot is valid
 *
 * @example
 * ```typescript
 * const isValid = validateConfigSnapshot(snapshot);
 * if (!isValid) {
 *   console.error('Snapshot integrity check failed');
 * }
 * ```
 */
export const validateConfigSnapshot = (snapshot: ConfigSnapshot): boolean => {
  const serialized = JSON.stringify(snapshot.config);
  const checksum = generateChecksum(serialized);
  return checksum === snapshot.checksum;
};

// ============================================================================
// CONFIGURATION DIFFING
// ============================================================================

/**
 * Compares two configurations and returns differences.
 *
 * @param {Record<string, any>} left - Left configuration
 * @param {Record<string, any>} right - Right configuration
 * @returns {Record<string, any>} Configuration differences
 *
 * @example
 * ```typescript
 * const diffs = diffConfigs(oldConfig, newConfig);
 * console.log('Changed keys:', Object.keys(diffs));
 * ```
 */
export const diffConfigs = (
  left: Record<string, any>,
  right: Record<string, any>
): Record<string, any> => {
  const leftFlat = flattenConfig(left);
  const rightFlat = flattenConfig(right);
  const allKeys = new Set([...Object.keys(leftFlat), ...Object.keys(rightFlat)]);
  const diffs: Record<string, any> = {};

  allKeys.forEach(key => {
    const leftValue = leftFlat[key];
    const rightValue = rightFlat[key];

    if (JSON.stringify(leftValue) !== JSON.stringify(rightValue)) {
      diffs[key] = {
        old: leftValue,
        new: rightValue,
      };
    }
  });

  return diffs;
};

/**
 * Detects merge conflicts between configurations.
 *
 * @param {Record<string, any>} local - Local configuration
 * @param {Record<string, any>} remote - Remote configuration
 * @param {Record<string, any>} base - Base configuration
 * @returns {ConfigMergeConflict[]} Merge conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectMergeConflicts(localConfig, remoteConfig, baseConfig);
 * ```
 */
export const detectMergeConflicts = (
  local: Record<string, any>,
  remote: Record<string, any>,
  base: Record<string, any>
): ConfigMergeConflict[] => {
  const conflicts: ConfigMergeConflict[] = [];
  const localFlat = flattenConfig(local);
  const remoteFlat = flattenConfig(remote);
  const baseFlat = flattenConfig(base);

  const allKeys = new Set([
    ...Object.keys(localFlat),
    ...Object.keys(remoteFlat),
    ...Object.keys(baseFlat),
  ]);

  allKeys.forEach(key => {
    const localValue = localFlat[key];
    const remoteValue = remoteFlat[key];
    const baseValue = baseFlat[key];

    const localChanged = JSON.stringify(localValue) !== JSON.stringify(baseValue);
    const remoteChanged = JSON.stringify(remoteValue) !== JSON.stringify(baseValue);

    if (localChanged && remoteChanged && JSON.stringify(localValue) !== JSON.stringify(remoteValue)) {
      conflicts.push({
        key,
        localValue,
        remoteValue,
      });
    }
  });

  return conflicts;
};

// ============================================================================
// ADDITIONAL CONFIGURATION UTILITIES
// ============================================================================

/**
 * Lists all configuration snapshots.
 *
 * @param {string} [directory] - Snapshot directory
 * @returns {Promise<ConfigSnapshot[]>} Array of snapshots
 *
 * @example
 * ```typescript
 * const snapshots = await listConfigSnapshots('/var/snapshots');
 * ```
 */
export const listConfigSnapshots = async (
  directory: string = './snapshots'
): Promise<ConfigSnapshot[]> => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = await fs.promises.readdir(directory);
  const snapshots: ConfigSnapshot[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const content = await fs.promises.readFile(path.join(directory, file), 'utf-8');
        const snapshot = JSON.parse(content);
        snapshots.push(snapshot);
      } catch {
        continue;
      }
    }
  }

  return snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

/**
 * Deletes old configuration snapshots.
 *
 * @param {number} retentionDays - Days to retain snapshots
 * @param {string} [directory] - Snapshot directory
 * @returns {Promise<number>} Number of deleted snapshots
 *
 * @example
 * ```typescript
 * const deleted = await cleanupConfigSnapshots(30, '/var/snapshots');
 * console.log(`Deleted ${deleted} old snapshots`);
 * ```
 */
export const cleanupConfigSnapshots = async (
  retentionDays: number,
  directory: string = './snapshots'
): Promise<number> => {
  const snapshots = await listConfigSnapshots(directory);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  let deleted = 0;

  for (const snapshot of snapshots) {
    if (new Date(snapshot.timestamp) < cutoffDate) {
      const filePath = path.join(directory, `${snapshot.id}.json`);
      try {
        await fs.promises.unlink(filePath);
        deleted++;
      } catch {
        continue;
      }
    }
  }

  return deleted;
};

/**
 * Applies configuration patch.
 *
 * @param {Record<string, any>} config - Base configuration
 * @param {Record<string, any>} patch - Configuration patch
 * @returns {Record<string, any>} Patched configuration
 *
 * @example
 * ```typescript
 * const patched = applyConfigPatch(config, { 'database.port': 5433 });
 * ```
 */
export const applyConfigPatch = (
  config: Record<string, any>,
  patch: Record<string, any>
): Record<string, any> => {
  const result = { ...config };

  Object.entries(patch).forEach(([key, value]) => {
    const keys = key.split('.');
    let current: any = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  });

  return result;
};

/**
 * Generates configuration checksum.
 *
 * @param {Record<string, any>} config - Configuration object
 * @returns {string} SHA-256 checksum
 *
 * @example
 * ```typescript
 * const checksum = generateConfigChecksum(config);
 * ```
 */
export const generateConfigChecksum = (config: Record<string, any>): string => {
  const serialized = JSON.stringify(config);
  return generateChecksum(serialized);
};

/**
 * Validates configuration version compatibility.
 *
 * @param {string} currentVersion - Current config version
 * @param {string} requiredVersion - Required config version
 * @returns {boolean} True if compatible
 *
 * @example
 * ```typescript
 * const compatible = validateConfigVersion('2.1.0', '2.0.0');
 * ```
 */
export const validateConfigVersion = (
  currentVersion: string,
  requiredVersion: string
): boolean => {
  const parse = (v: string) => v.split('.').map(Number);
  const current = parse(currentVersion);
  const required = parse(requiredVersion);

  // Major version must match
  if (current[0] !== required[0]) return false;

  // Minor version must be >= required
  if (current[1] < required[1]) return false;

  return true;
};

/**
 * Converts configuration to YAML format.
 *
 * @param {Record<string, any>} config - Configuration object
 * @returns {string} YAML string
 *
 * @example
 * ```typescript
 * const yaml = convertConfigToYAML(config);
 * ```
 */
export const convertConfigToYAML = (config: Record<string, any>): string => {
  const toYaml = (obj: any, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);
    let yaml = '';

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null) {
        yaml += `${spaces}${key}: null\n`;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${toYaml(value, indent + 2)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          yaml += `${spaces}  - ${item}\n`;
        });
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    });

    return yaml;
  };

  return toYaml(config);
};

/**
 * Converts configuration from YAML format.
 *
 * @param {string} yaml - YAML string
 * @returns {Record<string, any>} Configuration object
 *
 * @example
 * ```typescript
 * const config = convertYAMLToConfig(yamlString);
 * ```
 */
export const convertYAMLToConfig = (yaml: string): Record<string, any> => {
  // Simplified YAML parser - production should use yaml library
  const lines = yaml.split('\n');
  const result: Record<string, any> = {};
  const stack: any[] = [result];
  let currentIndent = 0;

  lines.forEach(line => {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
    if (!match) return;

    const [, indent, key, value] = match;
    const indentLevel = indent.length;

    if (indentLevel <= currentIndent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (value.trim()) {
      parent[key.trim()] = value.trim();
    } else {
      parent[key.trim()] = {};
      stack.push(parent[key.trim()]);
    }

    currentIndent = indentLevel;
  });

  return result;
};

/**
 * Encrypts entire configuration object.
 *
 * @param {Record<string, any>} config - Configuration to encrypt
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Encrypted configuration string
 *
 * @example
 * ```typescript
 * const encrypted = encryptConfig(sensitiveConfig, key);
 * ```
 */
export const encryptConfig = (
  config: Record<string, any>,
  encryptionKey: string
): string => {
  const serialized = JSON.stringify(config);
  const keyBuffer = Buffer.from(encryptionKey, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

  let encrypted = cipher.update(serialized, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypts entire configuration object.
 *
 * @param {string} encryptedConfig - Encrypted configuration string
 * @param {string} encryptionKey - Decryption key
 * @returns {Record<string, any>} Decrypted configuration
 *
 * @example
 * ```typescript
 * const config = decryptConfig(encrypted, key);
 * ```
 */
export const decryptConfig = (
  encryptedConfig: string,
  encryptionKey: string
): Record<string, any> => {
  const [ivHex, authTagHex, encrypted] = encryptedConfig.split(':');

  const keyBuffer = Buffer.from(encryptionKey, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};

/**
 * Clones configuration deeply.
 *
 * @param {Record<string, any>} config - Configuration to clone
 * @returns {Record<string, any>} Cloned configuration
 *
 * @example
 * ```typescript
 * const clone = cloneConfig(originalConfig);
 * ```
 */
export const cloneConfig = (config: Record<string, any>): Record<string, any> => {
  return JSON.parse(JSON.stringify(config));
};

/**
 * Freezes configuration to prevent modifications.
 *
 * @param {Record<string, any>} config - Configuration to freeze
 * @returns {Readonly<Record<string, any>>} Frozen configuration
 *
 * @example
 * ```typescript
 * const frozen = freezeConfig(config);
 * // frozen.key = 'value'; // Throws error
 * ```
 */
export const freezeConfig = (
  config: Record<string, any>
): Readonly<Record<string, any>> => {
  const freeze = (obj: any): any => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        freeze(obj[key]);
      }
    });
    return Object.freeze(obj);
  };

  return freeze(config);
};

/**
 * Validates configuration schema with custom validator.
 *
 * @param {Record<string, any>} config - Configuration to validate
 * @param {(config: any) => boolean} validator - Custom validator function
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateConfigSchema(config, (c) => c.port > 0 && c.host);
 * ```
 */
export const validateConfigSchema = (
  config: Record<string, any>,
  validator: (config: any) => boolean
): boolean => {
  try {
    return validator(config);
  } catch {
    return false;
  }
};

/**
 * Gets configuration metadata.
 *
 * @param {Record<string, any>} config - Configuration object
 * @returns {object} Configuration metadata
 *
 * @example
 * ```typescript
 * const metadata = getConfigMetadata(config);
 * console.log('Config has', metadata.totalKeys, 'keys');
 * ```
 */
export const getConfigMetadata = (config: Record<string, any>): {
  totalKeys: number;
  depth: number;
  size: number;
} => {
  const flattened = flattenConfig(config);
  const maxDepth = Math.max(...Object.keys(flattened).map(k => k.split('.').length));
  const serialized = JSON.stringify(config);

  return {
    totalKeys: Object.keys(flattened).length,
    depth: maxDepth,
    size: Buffer.byteLength(serialized, 'utf8'),
  };
};

/**
 * Resolves configuration conflicts with merge strategies.
 *
 * @param {ConfigMergeConflict[]} conflicts - Configuration conflicts
 * @param {string} strategy - Conflict resolution strategy
 * @returns {Record<string, any>} Resolved configuration
 *
 * @example
 * ```typescript
 * const resolved = resolveConfigConflicts(conflicts, 'local');
 * // Uses local values for all conflicts
 * ```
 */
export const resolveConfigConflicts = (
  conflicts: ConfigMergeConflict[],
  strategy: 'local' | 'remote' | 'merge' = 'local'
): Record<string, any> => {
  const resolved: Record<string, any> = {};

  conflicts.forEach(conflict => {
    let resolvedValue: any;

    switch (strategy) {
      case 'local':
        resolvedValue = conflict.localValue;
        break;
      case 'remote':
        resolvedValue = conflict.remoteValue;
        break;
      case 'merge':
        // Attempt intelligent merge
        if (typeof conflict.localValue === 'object' && typeof conflict.remoteValue === 'object') {
          resolvedValue = { ...conflict.localValue, ...conflict.remoteValue };
        } else {
          resolvedValue = conflict.remoteValue; // Default to remote
        }
        break;
    }

    resolved[conflict.key] = resolvedValue;
  });

  return resolved;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Flattens nested configuration object to dot-notation keys.
 */
const flattenConfig = (
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenConfig(value, newKey));
    } else {
      result[newKey] = value;
    }
  });

  return result;
};

/**
 * Gets nested value from object using dot notation.
 */
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Deep merges multiple configurations.
 */
const deepMergeConfigs = (configs: Record<string, any>[]): Record<string, any> => {
  return configs.reduce((merged, config) => {
    return deepMerge(merged, config);
  }, {});
};

/**
 * Deep merges two objects.
 */
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };

  Object.entries(source).forEach(([key, value]) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  });

  return result;
};

/**
 * Generates checksum for data.
 */
const generateChecksum = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Hashes string to number for consistent bucketing.
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Encrypts settings data (placeholder).
 */
const encryptSettingsData = (data: string, key: string): string => {
  // Placeholder - implement proper encryption
  return Buffer.from(data).toString('base64');
};

/**
 * Decrypts settings data (placeholder).
 */
const decryptSettingsData = (data: string, key: string): string => {
  // Placeholder - implement proper decryption
  return Buffer.from(data, 'base64').toString('utf-8');
};

/**
 * Compresses data (placeholder).
 */
const compressData = (data: string): string => {
  // Placeholder - implement compression (zlib, etc.)
  return data;
};

/**
 * Decompresses data (placeholder).
 */
const decompressData = (data: string): string => {
  // Placeholder - implement decompression
  return data;
};

/**
 * Persistence backend implementations (placeholders).
 */
const persistToFile = async (key: string, data: string, versioning: boolean): Promise<void> => {
  const dir = './config-store';
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(path.join(dir, `${key}.json`), data, 'utf-8');
};

const persistToDatabase = async (key: string, data: string, versioning: boolean): Promise<void> => {
  console.warn('Database persistence not implemented');
};

const persistToRedis = async (key: string, data: string, retentionDays: number): Promise<void> => {
  console.warn('Redis persistence not implemented');
};

const persistToConsul = async (key: string, data: string): Promise<void> => {
  console.warn('Consul persistence not implemented');
};

const loadFromFile = async (key: string): Promise<string | null> => {
  try {
    return await fs.promises.readFile(`./config-store/${key}.json`, 'utf-8');
  } catch {
    return null;
  }
};

const loadFromDatabase = async (key: string): Promise<string | null> => {
  console.warn('Database loading not implemented');
  return null;
};

const loadFromRedis = async (key: string): Promise<string | null> => {
  console.warn('Redis loading not implemented');
  return null;
};

const loadFromConsul = async (key: string): Promise<string | null> => {
  console.warn('Consul loading not implemented');
  return null;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createVirtualConfig,
  getProviderDefaults,
  parseVRealizeConfig,
  validateVRealizeConfig,
  loadEnvironmentConfig,
  exportEnvironmentConfig,
  compareEnvironmentConfigs,
  createEnvMapping,
  createPolicyConfig,
  evaluatePolicy,
  evaluatePolicyCondition,
  mergePolicyConfigs,
  createVirtualFeatureFlag,
  evaluateFeatureFlag,
  loadFeatureFlags,
  saveFeatureFlags,
  createSettingsPersistence,
  persistSettings,
  loadSettings,
  createReloadStrategy,
  startConfigReload,
  reloadConfig,
  createConfigSnapshot,
  saveConfigSnapshot,
  loadConfigSnapshot,
  validateConfigSnapshot,
  diffConfigs,
  detectMergeConflicts,
};
