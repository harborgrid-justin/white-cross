"use strict";
/**
 * @fileoverview Configuration Management Kit
 * @module core/config/management-kit
 *
 * Complete configuration management solution including hierarchical
 * configuration, file loading, merging, and runtime updates.
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
exports.ConfigManager = void 0;
exports.loadConfigFile = loadConfigFile;
exports.createConfigHierarchy = createConfigHierarchy;
exports.deepMerge = deepMerge;
exports.createConfigManager = createConfigManager;
exports.freezeConfig = freezeConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
function loadConfigFile(filePath, allowMissing = false) {
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
        }
        else if (ext === '.js' || ext === '.ts') {
            // For JS/TS files, require them
            // Note: This is a simplified implementation
            // In production, you might want to use a proper module loader
            delete require.cache[require.resolve(filePath)];
            return require(filePath);
        }
        else {
            throw new Error(`Unsupported configuration file type: ${ext}`);
        }
    }
    catch (error) {
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
function createConfigHierarchy(layers, options = {}) {
    const { baseDir = '.', extension = '.json', allowMissing = true } = options;
    let merged = {};
    for (const layer of layers) {
        const filePath = path.join(baseDir, `${layer}${extension}`);
        const config = loadConfigFile(filePath, allowMissing);
        if (config) {
            merged = deepMerge(merged, config);
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
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                }
                else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            }
            else {
                output[key] = source[key];
            }
        });
    }
    return output;
}
/**
 * Checks if value is a plain object
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Configuration manager class
 */
class ConfigManager {
    constructor(initialConfig = {}) {
        this.watchers = [];
        this.metadata = new Map();
        this.config = initialConfig;
    }
    /**
     * Gets the entire configuration
     */
    get() {
        return { ...this.config };
    }
    /**
     * Gets a configuration value by path
     *
     * @param path - Dot-separated path (e.g., 'database.host')
     * @param defaultValue - Default value if path not found
     */
    getValue(path, defaultValue) {
        const keys = path.split('.');
        let value = this.config;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            }
            else {
                return defaultValue;
            }
        }
        return value;
    }
    /**
     * Sets a configuration value by path
     *
     * @param path - Dot-separated path
     * @param value - Value to set
     */
    setValue(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = this.config;
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
    merge(config, source = 'override') {
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
    replace(config) {
        this.config = { ...config };
        this.notifyWatchers();
    }
    /**
     * Watches for configuration changes
     *
     * @param callback - Callback function
     * @returns Unsubscribe function
     */
    watch(callback) {
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
    notifyWatchers() {
        const config = this.get();
        this.watchers.forEach((watcher) => watcher(config));
    }
    /**
     * Loads configuration from a file and merges
     *
     * @param filePath - Path to configuration file
     */
    loadFile(filePath) {
        const config = loadConfigFile(filePath);
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
    saveFile(filePath, pretty = true) {
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
    validate(validator) {
        return validator(this.config);
    }
    /**
     * Gets metadata for a specific source
     *
     * @param source - Configuration source
     */
    getMetadata(source) {
        return this.metadata.get(source);
    }
    /**
     * Resets configuration to empty state
     */
    reset() {
        this.config = {};
        this.metadata.clear();
        this.notifyWatchers();
    }
}
exports.ConfigManager = ConfigManager;
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
function createConfigManager(initialConfig = {}) {
    return new ConfigManager(initialConfig);
}
/**
 * Freezes a configuration object (makes it immutable)
 *
 * @param config - Configuration to freeze
 * @returns Frozen configuration
 */
function freezeConfig(config) {
    return Object.freeze(deepFreeze(config));
}
/**
 * Deep freezes an object
 */
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = obj[prop];
        if (value &&
            typeof value === 'object' &&
            !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return obj;
}
/**
 * Configuration Management Kit - Main export
 */
exports.default = {
    loadConfigFile,
    createConfigHierarchy,
    deepMerge,
    createConfigManager,
    freezeConfig,
    ConfigManager,
};
//# sourceMappingURL=management-kit.js.map