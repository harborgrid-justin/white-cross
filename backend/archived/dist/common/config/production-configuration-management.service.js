"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FileConfigurationProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationFactory = exports.ProductionConfigurationManagementService = exports.RemoteConfigurationProvider = exports.EnvironmentConfigurationProvider = exports.FileConfigurationProvider = void 0;
exports.Config = Config;
exports.FeatureFlag = FeatureFlag;
const common_1 = require("@nestjs/common");
const events_1 = require("events");
const crypto = __importStar(require("crypto"));
const base_1 = require("../base");
const logger_service_1 = require("../logging/logger.service");
let FileConfigurationProvider = FileConfigurationProvider_1 = class FileConfigurationProvider extends base_1.BaseService {
    filePath;
    name = 'file';
    priority = 1;
    constructor(filePath, logger) {
        super({
            serviceName: 'FileConfigurationProvider',
            logger: logger || new common_1.Logger(FileConfigurationProvider_1.name),
            enableAuditLogging: true,
        });
        this.filePath = filePath;
    }
    async load() {
        try {
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            return new Map(Object.entries(data));
        }
        catch (error) {
            return new Map();
        }
    }
    watch(callback) {
        const fs = require('fs');
        fs.watchFile(this.filePath, async () => {
            const changes = await this.load();
            callback(changes);
        });
    }
};
exports.FileConfigurationProvider = FileConfigurationProvider;
exports.FileConfigurationProvider = FileConfigurationProvider = FileConfigurationProvider_1 = __decorate([
    __param(1, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [String, logger_service_1.LoggerService])
], FileConfigurationProvider);
class EnvironmentConfigurationProvider {
    name = 'environment';
    priority = 2;
    async load() {
        const configs = new Map();
        const prefix = 'APP_CONFIG_';
        for (const [key, value] of Object.entries(process.env)) {
            if (key.startsWith(prefix)) {
                const configKey = key.substring(prefix.length).toLowerCase().replace(/_/g, '.');
                configs.set(configKey, this.parseValue(value));
            }
        }
        return configs;
    }
    parseValue(value) {
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
}
exports.EnvironmentConfigurationProvider = EnvironmentConfigurationProvider;
class RemoteConfigurationProvider {
    apiEndpoint;
    apiKey;
    name = 'remote';
    priority = 3;
    constructor(apiEndpoint, apiKey) {
        this.apiEndpoint = apiEndpoint;
        this.apiKey = apiKey;
    }
    async load() {
        try {
            const configs = new Map();
            configs.set('database.host', 'remote-db.example.com');
            configs.set('api.timeout', 30000);
            configs.set('feature.newUI', true);
            return configs;
        }
        catch (error) {
            return new Map();
        }
    }
    async set(key, value) {
        console.log(`Setting remote config: ${key} = ${value}`);
    }
}
exports.RemoteConfigurationProvider = RemoteConfigurationProvider;
let ProductionConfigurationManagementService = class ProductionConfigurationManagementService extends events_1.EventEmitter {
    environments = new Map();
    providers = [];
    schema = new Map();
    currentEnvironment = 'development';
    configurationChanges = [];
    configurationBackups = [];
    encryptionKey;
    watchTimers = [];
    constructor() {
        super();
        this.encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || this.generateEncryptionKey();
        this.initializeDefaultEnvironments();
        this.setupDefaultProviders();
    }
    createEnvironment(name, displayName, parentEnvironment) {
        const environment = {
            name,
            displayName,
            order: this.environments.size,
            parentEnvironment,
            configurations: new Map(),
            featureFlags: new Map(),
            active: true
        };
        this.environments.set(name, environment);
        this.emit('environmentCreated', environment);
        return environment;
    }
    setCurrentEnvironment(environmentName) {
        if (!this.environments.has(environmentName)) {
            throw new Error(`Environment ${environmentName} does not exist`);
        }
        const oldEnvironment = this.currentEnvironment;
        this.currentEnvironment = environmentName;
        this.emit('environmentChanged', {
            from: oldEnvironment,
            to: environmentName
        });
        this.loadConfigurations();
    }
    defineSchema(schemas) {
        for (const schema of schemas) {
            this.schema.set(schema.key, schema);
        }
        this.emit('schemaUpdated', schemas);
    }
    addProvider(provider) {
        this.providers.push(provider);
        this.providers.sort((a, b) => a.priority - b.priority);
        if (provider.watch) {
            provider.watch((changes) => {
                this.handleProviderChanges(provider.name, changes);
            });
        }
        this.emit('providerAdded', provider);
    }
    async loadConfigurations() {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            throw new Error(`Environment ${this.currentEnvironment} not found`);
        }
        const allConfigs = new Map();
        for (const provider of this.providers) {
            try {
                const providerConfigs = await provider.load();
                for (const [key, value] of providerConfigs) {
                    allConfigs.set(key, value);
                }
                this.logInfo(`Loaded ${providerConfigs.size} configurations from ${provider.name} provider`);
            }
            catch (error) {
                this.logError(`Failed to load configurations from ${provider.name} provider:`, error);
            }
        }
        await this.mergeConfigurations(environment, allConfigs);
        this.emit('configurationsLoaded', {
            environment: this.currentEnvironment,
            count: environment.configurations.size
        });
    }
    async mergeConfigurations(environment, newConfigs) {
        if (environment.parentEnvironment) {
            const parentEnv = this.environments.get(environment.parentEnvironment);
            if (parentEnv) {
                for (const [key, parentConfig] of parentEnv.configurations) {
                    if (!environment.configurations.has(key)) {
                        environment.configurations.set(key, { ...parentConfig });
                    }
                }
            }
        }
        for (const [key, value] of newConfigs) {
            const schema = this.schema.get(key);
            const existingConfig = environment.configurations.get(key);
            if (schema) {
                this.validateConfiguration(key, value, schema);
            }
            const configValue = {
                value,
                type: this.inferType(value),
                encrypted: schema?.sensitive || false,
                sensitive: schema?.sensitive || false,
                lastModified: new Date(),
                modifiedBy: 'system',
                version: (existingConfig?.version || 0) + 1,
                description: schema?.description,
                validationRules: schema?.validationRules
            };
            if (configValue.sensitive) {
                configValue.value = this.encryptValue(value);
                configValue.encrypted = true;
            }
            environment.configurations.set(key, configValue);
        }
    }
    get(key, defaultValue) {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            return defaultValue;
        }
        const config = environment.configurations.get(key);
        if (!config) {
            return defaultValue;
        }
        let value = config.value;
        if (config.encrypted) {
            value = this.decryptValue(value);
        }
        return value;
    }
    set(key, value, changedBy = 'system', reason = '') {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            throw new Error(`Environment ${this.currentEnvironment} not found`);
        }
        const oldConfig = environment.configurations.get(key);
        const oldValue = oldConfig ? oldConfig.value : undefined;
        const schema = this.schema.get(key);
        if (schema) {
            this.validateConfiguration(key, value, schema);
        }
        const configValue = {
            value,
            type: this.inferType(value),
            encrypted: schema?.sensitive || false,
            sensitive: schema?.sensitive || false,
            lastModified: new Date(),
            modifiedBy: changedBy,
            version: (oldConfig?.version || 0) + 1,
            description: schema?.description,
            validationRules: schema?.validationRules
        };
        if (configValue.sensitive) {
            configValue.value = this.encryptValue(value);
            configValue.encrypted = true;
        }
        environment.configurations.set(key, configValue);
        const change = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            environment: this.currentEnvironment,
            configKey: key,
            oldValue,
            newValue: value,
            changedBy,
            reason,
            approved: true
        };
        this.configurationChanges.push(change);
        this.emit('configurationChanged', change);
    }
    createFeatureFlag(flag) {
        const featureFlag = {
            ...flag,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1
        };
        const environment = this.environments.get(this.currentEnvironment);
        if (environment) {
            environment.featureFlags.set(flag.name, featureFlag);
        }
        this.emit('featureFlagCreated', featureFlag);
        return featureFlag;
    }
    updateFeatureFlag(name, updates) {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            throw new Error(`Environment ${this.currentEnvironment} not found`);
        }
        const existingFlag = environment.featureFlags.get(name);
        if (!existingFlag) {
            throw new Error(`Feature flag ${name} not found`);
        }
        const updatedFlag = {
            ...existingFlag,
            ...updates,
            updatedAt: new Date(),
            version: existingFlag.version + 1
        };
        environment.featureFlags.set(name, updatedFlag);
        this.emit('featureFlagUpdated', updatedFlag);
        return updatedFlag;
    }
    isFeatureEnabled(name, context) {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            return false;
        }
        const flag = environment.featureFlags.get(name);
        if (!flag || !flag.enabled) {
            return false;
        }
        if (flag.rolloutPercentage !== undefined) {
            const hash = crypto.createHash('md5').update(`${name}:${context?.userId || 'anonymous'}`).digest('hex');
            const hashValue = parseInt(hash.substring(0, 8), 16);
            const percentage = (hashValue % 100) + 1;
            if (percentage > flag.rolloutPercentage) {
                return false;
            }
        }
        if (flag.conditions && flag.conditions.length > 0) {
            return this.evaluateFeatureFlagConditions(flag.conditions, context);
        }
        return true;
    }
    evaluateFeatureFlagConditions(conditions, context) {
        for (const condition of conditions) {
            if (!this.evaluateCondition(condition, context)) {
                return false;
            }
        }
        return true;
    }
    evaluateCondition(condition, context) {
        const contextValue = context?.[condition.type];
        switch (condition.operator) {
            case 'equals':
                return contextValue === condition.value;
            case 'contains':
                return Array.isArray(contextValue) ?
                    contextValue.includes(condition.value) :
                    String(contextValue).includes(String(condition.value));
            case 'greaterThan':
                return contextValue > condition.value;
            case 'lessThan':
                return contextValue < condition.value;
            case 'between':
                return contextValue >= condition.value.min && contextValue <= condition.value.max;
            default:
                return false;
        }
    }
    validateConfiguration(key, value, schema) {
        if (!this.validateType(value, schema.type)) {
            throw new Error(`Configuration ${key} must be of type ${schema.type}`);
        }
        if (schema.required && (value === null || value === undefined)) {
            throw new Error(`Configuration ${key} is required`);
        }
        if (schema.validationRules) {
            for (const rule of schema.validationRules) {
                if (!this.validateRule(value, rule)) {
                    throw new Error(rule.message);
                }
            }
        }
    }
    validateType(value, expectedType) {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number';
            case 'boolean':
                return typeof value === 'boolean';
            case 'object':
                return typeof value === 'object' && !Array.isArray(value);
            case 'array':
                return Array.isArray(value);
            default:
                return true;
        }
    }
    validateRule(value, rule) {
        switch (rule.type) {
            case 'min':
                return typeof value === 'number' ? value >= rule.value : value.length >= rule.value;
            case 'max':
                return typeof value === 'number' ? value <= rule.value : value.length <= rule.value;
            case 'pattern':
                return new RegExp(rule.value).test(String(value));
            case 'enum':
                return Array.isArray(rule.value) && rule.value.includes(value);
            case 'custom':
                return rule.validator ? rule.validator(value) : true;
            default:
                return true;
        }
    }
    async createBackup(description, createdBy = 'system') {
        const environment = this.environments.get(this.currentEnvironment);
        if (!environment) {
            throw new Error(`Environment ${this.currentEnvironment} not found`);
        }
        const backup = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            environment: this.currentEnvironment,
            configurations: new Map(environment.configurations),
            featureFlags: new Map(environment.featureFlags),
            createdBy,
            description
        };
        this.configurationBackups.push(backup);
        this.emit('backupCreated', backup);
        return backup;
    }
    async restoreBackup(backupId, restoredBy = 'system') {
        const backup = this.configurationBackups.find(b => b.id === backupId);
        if (!backup) {
            throw new Error(`Backup ${backupId} not found`);
        }
        const environment = this.environments.get(backup.environment);
        if (!environment) {
            throw new Error(`Environment ${backup.environment} not found`);
        }
        await this.createBackup(`Pre-restore backup before restoring ${backupId}`, restoredBy);
        environment.configurations = new Map(backup.configurations);
        environment.featureFlags = new Map(backup.featureFlags);
        this.emit('backupRestored', { backupId, environment: backup.environment, restoredBy });
    }
    getConfigurationChanges(environment, configKey, limit = 100) {
        let changes = this.configurationChanges;
        if (environment) {
            changes = changes.filter(c => c.environment === environment);
        }
        if (configKey) {
            changes = changes.filter(c => c.configKey === configKey);
        }
        return changes
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    handleProviderChanges(providerName, changes) {
        this.logInfo(`Configuration changes detected from ${providerName} provider`);
        for (const [key, value] of changes) {
            try {
                this.set(key, value, providerName, 'Provider update');
            }
            catch (error) {
                this.logError(`Failed to update configuration ${key} from provider ${providerName}:`, error);
            }
        }
    }
    inferType(value) {
        if (Array.isArray(value))
            return 'array';
        if (typeof value === 'object')
            return 'object';
        return typeof value;
    }
    encryptValue(value) {
        const stringValue = JSON.stringify(value);
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(stringValue, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    decryptValue(encryptedValue) {
        const [ivHex, encrypted] = encryptedValue.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
    generateEncryptionKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    initializeDefaultEnvironments() {
        this.createEnvironment('development', 'Development');
        this.createEnvironment('staging', 'Staging', 'development');
        this.createEnvironment('production', 'Production', 'staging');
    }
    setupDefaultProviders() {
        this.addProvider(new EnvironmentConfigurationProvider());
        const configFilePath = process.env.CONFIG_FILE_PATH || './config.json';
        this.addProvider(new FileConfigurationProvider(configFilePath));
        if (process.env.REMOTE_CONFIG_ENDPOINT && process.env.REMOTE_CONFIG_API_KEY) {
            this.addProvider(new RemoteConfigurationProvider(process.env.REMOTE_CONFIG_ENDPOINT, process.env.REMOTE_CONFIG_API_KEY));
        }
    }
    async healthCheck() {
        try {
            const environment = this.environments.get(this.currentEnvironment);
            return {
                environments: this.environments.size > 0,
                providers: this.providers.length > 0,
                currentEnvironment: this.currentEnvironment,
                configurationsLoaded: environment ? environment.configurations.size > 0 : false
            };
        }
        catch (error) {
            this.logError('Configuration management health check failed:', error);
            return {
                environments: false,
                providers: false,
                currentEnvironment: this.currentEnvironment,
                configurationsLoaded: false
            };
        }
    }
    cleanup() {
        this.watchTimers.forEach(timer => clearTimeout(timer));
        this.watchTimers = [];
        this.removeAllListeners();
    }
};
exports.ProductionConfigurationManagementService = ProductionConfigurationManagementService;
exports.ProductionConfigurationManagementService = ProductionConfigurationManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductionConfigurationManagementService);
class ConfigurationFactory {
    static createProductionConfigurationManagement() {
        return new ProductionConfigurationManagementService();
    }
}
exports.ConfigurationFactory = ConfigurationFactory;
function Config(key, defaultValue) {
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get() {
                return process.env[key.toUpperCase().replace(/\./g, '_')] || defaultValue;
            }
        });
    };
}
function FeatureFlag(flagName) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const featureEnabled = true;
            if (featureEnabled) {
                return originalMethod.apply(this, args);
            }
            else {
                throw new Error(`Feature ${flagName} is not enabled`);
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=production-configuration-management.service.js.map