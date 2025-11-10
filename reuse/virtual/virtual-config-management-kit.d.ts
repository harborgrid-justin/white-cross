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
export declare const createVirtualConfig: (options: VirtualConfigOptions) => Record<string, any>;
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
export declare const getProviderDefaults: (provider: string) => Record<string, any>;
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
export declare const parseVRealizeConfig: (prefix?: string) => VRealizeConfig;
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
export declare const validateVRealizeConfig: (config: VRealizeConfig) => ConfigValidationError[];
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
export declare const loadEnvironmentConfig: (environment: string, sources?: string[]) => Promise<Record<string, any>>;
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
export declare const exportEnvironmentConfig: (config: Record<string, any>, environment: string, outputPath?: string) => Promise<void>;
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
export declare const compareEnvironmentConfigs: (envConfigs: Record<string, Record<string, any>>) => Record<string, any>;
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
export declare const createEnvMapping: (config: Record<string, any>, prefix?: string) => Record<string, string>;
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
export declare const createPolicyConfig: (name: string, rules: PolicyRule[], options?: Partial<PolicyConfig>) => PolicyConfig;
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
export declare const evaluatePolicy: (policy: PolicyConfig, context: Record<string, any>) => {
    allowed: boolean;
    violations: PolicyRule[];
    warnings: PolicyRule[];
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
export declare const evaluatePolicyCondition: (condition: string, context: Record<string, any>) => boolean;
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
export declare const mergePolicyConfigs: (policies: PolicyConfig[]) => PolicyConfig[];
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
export declare const createVirtualFeatureFlag: (name: string, enabled: boolean, options?: Partial<VirtualFeatureFlag>) => VirtualFeatureFlag;
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
export declare const evaluateFeatureFlag: (flag: VirtualFeatureFlag, environment: string, tenantId?: string) => boolean;
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
export declare const loadFeatureFlags: (filePath: string) => Promise<VirtualFeatureFlag[]>;
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
export declare const saveFeatureFlags: (flags: VirtualFeatureFlag[], filePath: string) => Promise<void>;
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
export declare const createSettingsPersistence: (options?: Partial<SettingsPersistence>) => SettingsPersistence;
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
export declare const persistSettings: (settings: Record<string, any>, persistence: SettingsPersistence, key?: string) => Promise<void>;
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
export declare const loadSettings: (key: string, persistence: SettingsPersistence) => Promise<Record<string, any> | null>;
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
export declare const createReloadStrategy: (options?: Partial<ReloadStrategy>) => ReloadStrategy;
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
export declare const startConfigReload: (loader: () => Promise<Record<string, any>>, strategy: ReloadStrategy) => (() => void);
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
export declare const reloadConfig: (loader: () => Promise<Record<string, any>>) => Promise<Record<string, any>>;
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
export declare const createConfigSnapshot: (config: Record<string, any>, environment: string) => ConfigSnapshot;
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
export declare const saveConfigSnapshot: (snapshot: ConfigSnapshot, directory?: string) => Promise<string>;
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
export declare const loadConfigSnapshot: (snapshotId: string, directory?: string) => Promise<ConfigSnapshot | null>;
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
export declare const validateConfigSnapshot: (snapshot: ConfigSnapshot) => boolean;
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
export declare const diffConfigs: (left: Record<string, any>, right: Record<string, any>) => Record<string, any>;
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
export declare const detectMergeConflicts: (local: Record<string, any>, remote: Record<string, any>, base: Record<string, any>) => ConfigMergeConflict[];
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
export declare const listConfigSnapshots: (directory?: string) => Promise<ConfigSnapshot[]>;
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
export declare const cleanupConfigSnapshots: (retentionDays: number, directory?: string) => Promise<number>;
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
export declare const applyConfigPatch: (config: Record<string, any>, patch: Record<string, any>) => Record<string, any>;
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
export declare const generateConfigChecksum: (config: Record<string, any>) => string;
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
export declare const validateConfigVersion: (currentVersion: string, requiredVersion: string) => boolean;
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
export declare const convertConfigToYAML: (config: Record<string, any>) => string;
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
export declare const convertYAMLToConfig: (yaml: string) => Record<string, any>;
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
export declare const encryptConfig: (config: Record<string, any>, encryptionKey: string) => string;
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
export declare const decryptConfig: (encryptedConfig: string, encryptionKey: string) => Record<string, any>;
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
export declare const cloneConfig: (config: Record<string, any>) => Record<string, any>;
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
export declare const freezeConfig: (config: Record<string, any>) => Readonly<Record<string, any>>;
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
export declare const validateConfigSchema: (config: Record<string, any>, validator: (config: any) => boolean) => boolean;
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
export declare const getConfigMetadata: (config: Record<string, any>) => {
    totalKeys: number;
    depth: number;
    size: number;
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
export declare const resolveConfigConflicts: (conflicts: ConfigMergeConflict[], strategy?: "local" | "remote" | "merge") => Record<string, any>;
declare const _default: {
    createVirtualConfig: (options: VirtualConfigOptions) => Record<string, any>;
    getProviderDefaults: (provider: string) => Record<string, any>;
    parseVRealizeConfig: (prefix?: string) => VRealizeConfig;
    validateVRealizeConfig: (config: VRealizeConfig) => ConfigValidationError[];
    loadEnvironmentConfig: (environment: string, sources?: string[]) => Promise<Record<string, any>>;
    exportEnvironmentConfig: (config: Record<string, any>, environment: string, outputPath?: string) => Promise<void>;
    compareEnvironmentConfigs: (envConfigs: Record<string, Record<string, any>>) => Record<string, any>;
    createEnvMapping: (config: Record<string, any>, prefix?: string) => Record<string, string>;
    createPolicyConfig: (name: string, rules: PolicyRule[], options?: Partial<PolicyConfig>) => PolicyConfig;
    evaluatePolicy: (policy: PolicyConfig, context: Record<string, any>) => {
        allowed: boolean;
        violations: PolicyRule[];
        warnings: PolicyRule[];
    };
    evaluatePolicyCondition: (condition: string, context: Record<string, any>) => boolean;
    mergePolicyConfigs: (policies: PolicyConfig[]) => PolicyConfig[];
    createVirtualFeatureFlag: (name: string, enabled: boolean, options?: Partial<VirtualFeatureFlag>) => VirtualFeatureFlag;
    evaluateFeatureFlag: (flag: VirtualFeatureFlag, environment: string, tenantId?: string) => boolean;
    loadFeatureFlags: (filePath: string) => Promise<VirtualFeatureFlag[]>;
    saveFeatureFlags: (flags: VirtualFeatureFlag[], filePath: string) => Promise<void>;
    createSettingsPersistence: (options?: Partial<SettingsPersistence>) => SettingsPersistence;
    persistSettings: (settings: Record<string, any>, persistence: SettingsPersistence, key?: string) => Promise<void>;
    loadSettings: (key: string, persistence: SettingsPersistence) => Promise<Record<string, any> | null>;
    createReloadStrategy: (options?: Partial<ReloadStrategy>) => ReloadStrategy;
    startConfigReload: (loader: () => Promise<Record<string, any>>, strategy: ReloadStrategy) => (() => void);
    reloadConfig: (loader: () => Promise<Record<string, any>>) => Promise<Record<string, any>>;
    createConfigSnapshot: (config: Record<string, any>, environment: string) => ConfigSnapshot;
    saveConfigSnapshot: (snapshot: ConfigSnapshot, directory?: string) => Promise<string>;
    loadConfigSnapshot: (snapshotId: string, directory?: string) => Promise<ConfigSnapshot | null>;
    validateConfigSnapshot: (snapshot: ConfigSnapshot) => boolean;
    diffConfigs: (left: Record<string, any>, right: Record<string, any>) => Record<string, any>;
    detectMergeConflicts: (local: Record<string, any>, remote: Record<string, any>, base: Record<string, any>) => ConfigMergeConflict[];
};
export default _default;
//# sourceMappingURL=virtual-config-management-kit.d.ts.map