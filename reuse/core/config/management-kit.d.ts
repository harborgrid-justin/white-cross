/**
 * @fileoverview Configuration Management Kit
 * @module core/config/management-kit
 *
 * Complete configuration management solution including hierarchical
 * configuration, file loading, merging, and runtime updates.
 */
/**
 * Configuration source type
 */
export type ConfigSource = 'file' | 'env' | 'default' | 'override';
/**
 * Configuration loader options
 */
export interface ConfigLoaderOptions {
    /** Base directory for config files */
    baseDir?: string;
    /** File extension */
    extension?: '.json' | '.js' | '.ts';
    /** Environment variable prefix */
    envPrefix?: string;
    /** Allow missing files */
    allowMissing?: boolean;
}
/**
 * Configuration with metadata
 */
export interface ConfigWithMetadata<T = any> {
    /** Configuration data */
    data: T;
    /** Configuration source */
    source: ConfigSource;
    /** File path (if loaded from file) */
    filePath?: string;
    /** Load timestamp */
    timestamp: Date;
}
/**
 * Loads configuration from a JSON file
 *
 * @param filePath - Path to configuration file
 * @param allowMissing - Allow missing files
 * @returns Parsed configuration or null if missing
 *
 * @example
 * ```typescript
 * const config = loadConfigFile('./config/production.json');
 * ```
 */
export declare function loadConfigFile<T = any>(filePath: string, allowMissing?: boolean): T | null;
/**
 * Creates a configuration hierarchy by merging multiple config sources
 *
 * @param layers - Array of configuration layer names (in order of precedence)
 * @param options - Loader options
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const config = createConfigHierarchy(
 *   ['default', 'production', 'local'],
 *   { baseDir: './config', extension: '.json' }
 * );
 * // Loads: default.json, production.json, local.json
 * // Later layers override earlier ones
 * ```
 */
export declare function createConfigHierarchy<T = any>(layers: string[], options?: ConfigLoaderOptions): T;
/**
 * Deep merges two objects
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
export declare function deepMerge<T = any>(target: any, source: any): T;
/**
 * Configuration manager class
 */
export declare class ConfigManager<T extends Record<string, any> = any> {
    private config;
    private watchers;
    private metadata;
    constructor(initialConfig?: T);
    /**
     * Gets the entire configuration
     */
    get(): T;
    /**
     * Gets a configuration value by path
     *
     * @param path - Dot-separated path (e.g., 'database.host')
     * @param defaultValue - Default value if path not found
     */
    getValue<V = any>(path: string, defaultValue?: V): V;
    /**
     * Sets a configuration value by path
     *
     * @param path - Dot-separated path
     * @param value - Value to set
     */
    setValue(path: string, value: any): void;
    /**
     * Merges configuration with existing config
     *
     * @param config - Configuration to merge
     * @param source - Configuration source
     */
    merge(config: Partial<T>, source?: ConfigSource): void;
    /**
     * Replaces entire configuration
     *
     * @param config - New configuration
     */
    replace(config: T): void;
    /**
     * Watches for configuration changes
     *
     * @param callback - Callback function
     * @returns Unsubscribe function
     */
    watch(callback: (config: T) => void): () => void;
    /**
     * Notifies all watchers of configuration changes
     */
    private notifyWatchers;
    /**
     * Loads configuration from a file and merges
     *
     * @param filePath - Path to configuration file
     */
    loadFile(filePath: string): void;
    /**
     * Saves configuration to a file
     *
     * @param filePath - Path to save configuration
     * @param pretty - Pretty print JSON
     */
    saveFile(filePath: string, pretty?: boolean): void;
    /**
     * Validates configuration against a schema
     *
     * @param validator - Validation function
     * @returns Validation result
     */
    validate(validator: (config: T) => {
        valid: boolean;
        errors?: string[];
    }): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Gets metadata for a specific source
     *
     * @param source - Configuration source
     */
    getMetadata(source: ConfigSource | string): ConfigWithMetadata | undefined;
    /**
     * Resets configuration to empty state
     */
    reset(): void;
}
/**
 * Creates a configuration manager instance
 *
 * @param initialConfig - Initial configuration
 * @returns Configuration manager instance
 *
 * @example
 * ```typescript
 * const manager = createConfigManager({
 *   database: { host: 'localhost', port: 5432 },
 *   api: { timeout: 5000 }
 * });
 *
 * const host = manager.getValue('database.host');
 * manager.setValue('database.port', 5433);
 *
 * manager.watch((config) => {
 *   console.log('Config changed:', config);
 * });
 * ```
 */
export declare function createConfigManager<T extends Record<string, any> = any>(initialConfig?: T): ConfigManager<T>;
/**
 * Freezes a configuration object (makes it immutable)
 *
 * @param config - Configuration to freeze
 * @returns Frozen configuration
 */
export declare function freezeConfig<T>(config: T): Readonly<T>;
/**
 * Configuration Management Kit - Main export
 */
declare const _default: {
    loadConfigFile: typeof loadConfigFile;
    createConfigHierarchy: typeof createConfigHierarchy;
    deepMerge: typeof deepMerge;
    createConfigManager: typeof createConfigManager;
    freezeConfig: typeof freezeConfig;
    ConfigManager: typeof ConfigManager;
};
export default _default;
//# sourceMappingURL=management-kit.d.ts.map