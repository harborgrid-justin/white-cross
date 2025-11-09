/**
 * @fileoverview Configuration Management Kit
 * @module core/config/management-kit
 *
 * Complete configuration management solution including hierarchical
 * configuration, file loading, merging, and runtime updates.
 */

import * as fs from 'fs';
import * as path from 'path';

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
export function loadConfigFile<T = any>(
  filePath: string,
  allowMissing: boolean = false
): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      if (allowMissing) {
        return null;
      }
      throw new Error(`Configuration file not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath);

    if (ext === '.json') {
      return JSON.parse(content);
    } else if (ext === '.js' || ext === '.ts') {
      // For JS/TS files, require them
      // Note: This is a simplified implementation
      // In production, you might want to use a proper module loader
      delete require.cache[require.resolve(filePath)];
      return require(filePath);
    } else {
      throw new Error(`Unsupported configuration file type: ${ext}`);
    }
  } catch (error: any) {
    if (allowMissing && error.code === 'ENOENT') {
      return null;
    }
    throw new Error(`Failed to load configuration from ${filePath}: ${error.message}`);
  }
}

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
export function createConfigHierarchy<T = any>(
  layers: string[],
  options: ConfigLoaderOptions = {}
): T {
  const { baseDir = '.', extension = '.json', allowMissing = true } = options;

  let merged = {} as T;

  for (const layer of layers) {
    const filePath = path.join(baseDir, `${layer}${extension}`);
    const config = loadConfigFile<Partial<T>>(filePath, allowMissing);

    if (config) {
      merged = deepMerge(merged, config) as T;
    }
  }

  return merged;
}

/**
 * Deep merges two objects
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 */
export function deepMerge<T = any>(target: any, source: any): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

/**
 * Checks if value is a plain object
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Configuration manager class
 */
export class ConfigManager<T extends Record<string, any> = any> {
  private config: T;
  private watchers: Array<(config: T) => void> = [];
  private metadata: Map<string, ConfigWithMetadata> = new Map();

  constructor(initialConfig: T = {} as T) {
    this.config = initialConfig;
  }

  /**
   * Gets the entire configuration
   */
  get(): T {
    return { ...this.config };
  }

  /**
   * Gets a configuration value by path
   *
   * @param path - Dot-separated path (e.g., 'database.host')
   * @param defaultValue - Default value if path not found
   */
  getValue<V = any>(path: string, defaultValue?: V): V {
    const keys = path.split('.');
    let value: any = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue as V;
      }
    }

    return value as V;
  }

  /**
   * Sets a configuration value by path
   *
   * @param path - Dot-separated path
   * @param value - Value to set
   */
  setValue(path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current: any = this.config;

    // Navigate to the parent object
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
    this.notifyWatchers();
  }

  /**
   * Merges configuration with existing config
   *
   * @param config - Configuration to merge
   * @param source - Configuration source
   */
  merge(config: Partial<T>, source: ConfigSource = 'override'): void {
    this.config = deepMerge(this.config, config);

    this.metadata.set(source, {
      data: config,
      source,
      timestamp: new Date(),
    });

    this.notifyWatchers();
  }

  /**
   * Replaces entire configuration
   *
   * @param config - New configuration
   */
  replace(config: T): void {
    this.config = { ...config };
    this.notifyWatchers();
  }

  /**
   * Watches for configuration changes
   *
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  watch(callback: (config: T) => void): () => void {
    this.watchers.push(callback);

    return () => {
      const index = this.watchers.indexOf(callback);
      if (index > -1) {
        this.watchers.splice(index, 1);
      }
    };
  }

  /**
   * Notifies all watchers of configuration changes
   */
  private notifyWatchers(): void {
    const config = this.get();
    this.watchers.forEach((watcher) => watcher(config));
  }

  /**
   * Loads configuration from a file and merges
   *
   * @param filePath - Path to configuration file
   */
  loadFile(filePath: string): void {
    const config = loadConfigFile<Partial<T>>(filePath);
    if (config) {
      this.merge(config, 'file');
      this.metadata.set(filePath, {
        data: config,
        source: 'file',
        filePath,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Saves configuration to a file
   *
   * @param filePath - Path to save configuration
   * @param pretty - Pretty print JSON
   */
  saveFile(filePath: string, pretty: boolean = true): void {
    const content = pretty
      ? JSON.stringify(this.config, null, 2)
      : JSON.stringify(this.config);

    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Validates configuration against a schema
   *
   * @param validator - Validation function
   * @returns Validation result
   */
  validate(validator: (config: T) => { valid: boolean; errors?: string[] }): {
    valid: boolean;
    errors?: string[];
  } {
    return validator(this.config);
  }

  /**
   * Gets metadata for a specific source
   *
   * @param source - Configuration source
   */
  getMetadata(source: ConfigSource | string): ConfigWithMetadata | undefined {
    return this.metadata.get(source);
  }

  /**
   * Resets configuration to empty state
   */
  reset(): void {
    this.config = {} as T;
    this.metadata.clear();
    this.notifyWatchers();
  }
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
export function createConfigManager<T extends Record<string, any> = any>(
  initialConfig: T = {} as T
): ConfigManager<T> {
  return new ConfigManager(initialConfig);
}

/**
 * Freezes a configuration object (makes it immutable)
 *
 * @param config - Configuration to freeze
 * @returns Frozen configuration
 */
export function freezeConfig<T>(config: T): Readonly<T> {
  return Object.freeze(deepFreeze(config));
}

/**
 * Deep freezes an object
 */
function deepFreeze<T>(obj: T): T {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value &&
      typeof value === 'object' &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}

/**
 * Configuration Management Kit - Main export
 */
export default {
  loadConfigFile,
  createConfigHierarchy,
  deepMerge,
  createConfigManager,
  freezeConfig,
  ConfigManager,
};
