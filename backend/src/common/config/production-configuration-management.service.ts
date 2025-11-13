/**
 * Production-Grade Configuration Management System
 * 
 * Features:
 * - Environment-based configurations
 * - Feature flags and toggles
 * - Runtime configuration updates
 * - Configuration validation and type safety
 * - Hierarchical configuration merging
 * - Configuration monitoring and change tracking
 * - Secure configuration storage
 * - Configuration versioning and rollback
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
// Configuration Interfaces
export interface ConfigurationValue {
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  encrypted: boolean;
  sensitive: boolean;
  lastModified: Date;
  modifiedBy: string;
  version: number;
  description?: string;
  validationRules?: ValidationRule[];
}

export interface ConfigurationSchema {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  defaultValue?: any;
  description?: string;
  validationRules?: ValidationRule[];
  sensitive?: boolean;
  environments?: string[];
}

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'enum' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  conditions?: FeatureFlagCondition[];
  rolloutPercentage?: number;
  targetAudience?: string[];
  environment?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: number;
}

export interface FeatureFlagCondition {
  type: 'user' | 'group' | 'percentage' | 'date' | 'custom';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
  description?: string;
}

export interface ConfigurationEnvironment {
  name: string;
  displayName: string;
  order: number;
  parentEnvironment?: string;
  configurations: Map<string, ConfigurationValue>;
  featureFlags: Map<string, FeatureFlag>;
  active: boolean;
}

export interface ConfigurationChange {
  id: string;
  timestamp: Date;
  environment: string;
  configKey: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  reason: string;
  approved: boolean;
  approvedBy?: string;
  rollbackId?: string;
}

export interface ConfigurationBackup {
  id: string;
  timestamp: Date;
  environment: string;
  configurations: Map<string, ConfigurationValue>;
  featureFlags: Map<string, FeatureFlag>;
  createdBy: string;
  description: string;
}

// Configuration Provider Interface
export interface ConfigurationProvider {
  name: string;
  priority: number;
  load(): Promise<Map<string, any>>;
  watch?(callback: (changes: Map<string, any>) => void): void;
  set?(key: string, value: any): Promise<void>;
}

// File Configuration Provider
export class FileConfigurationProvider extends BaseService implements ConfigurationProvider {
  name = 'file';
  priority = 1;

  constructor(
    private filePath: string,
    @Inject(LoggerService) logger?: LoggerService
  ) {
    super({
      serviceName: 'FileConfigurationProvider',
      logger: logger || new Logger(FileConfigurationProvider.name),
      enableAuditLogging: true,
    });
  }

  async load(): Promise<Map<string, any>> {
    try {
      const fs = require('fs');
      const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      return new Map(Object.entries(data));
    } catch (error) {
      return new Map();
    }
  }

  watch(callback: (changes: Map<string, any>) => void): void {
    const fs = require('fs');
    fs.watchFile(this.filePath, async () => {
      const changes = await this.load();
      callback(changes);
    });
  }
}

// Environment Configuration Provider
export class EnvironmentConfigurationProvider implements ConfigurationProvider {
  name = 'environment';
  priority = 2;

  async load(): Promise<Map<string, any>> {
    const configs = new Map<string, any>();
    
    // Load all environment variables with a specific prefix
    const prefix = 'APP_CONFIG_';
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(prefix)) {
        const configKey = key.substring(prefix.length).toLowerCase().replace(/_/g, '.');
        configs.set(configKey, this.parseValue(value));
      }
    }

    return configs;
  }

  private parseValue(value: string | undefined): any {
    if (!value) return null;

    // Try to parse as JSON first
    try {
      return JSON.parse(value);
    } catch {
      // Return as string if JSON parsing fails
      return value;
    }
  }
}

// Remote Configuration Provider (Mock implementation)
export class RemoteConfigurationProvider implements ConfigurationProvider {
  name = 'remote';
  priority = 3;

  constructor(private apiEndpoint: string, private apiKey: string) {}

  async load(): Promise<Map<string, any>> {
    try {
      // Mock remote configuration loading
      // In production, this would make HTTP requests to a configuration service
      const configs = new Map<string, any>();
      configs.set('database.host', 'remote-db.example.com');
      configs.set('api.timeout', 30000);
      configs.set('feature.newUI', true);
      return configs;
    } catch (error) {
      return new Map();
    }
  }

  async set(key: string, value: any): Promise<void> {
    // Mock remote configuration update
    // In production, this would make HTTP requests to update remote config
    console.log(`Setting remote config: ${key} = ${value}`);
  }
}

// Main Configuration Management Service
@Injectable()
export class ProductionConfigurationManagementService extends EventEmitter {
  private environments = new Map<string, ConfigurationEnvironment>();
  private providers: ConfigurationProvider[] = [];
  private schema = new Map<string, ConfigurationSchema>();
  private currentEnvironment = 'development';
  private configurationChanges: ConfigurationChange[] = [];
  private configurationBackups: ConfigurationBackup[] = [];
  private encryptionKey: string;
  private watchTimers: NodeJS.Timeout[] = [];

  constructor() {
    super();
    this.encryptionKey = process.env.CONFIG_ENCRYPTION_KEY || this.generateEncryptionKey();
    this.initializeDefaultEnvironments();
    this.setupDefaultProviders();
  }

  // Environment Management
  createEnvironment(
    name: string, 
    displayName: string, 
    parentEnvironment?: string
  ): ConfigurationEnvironment {
    const environment: ConfigurationEnvironment = {
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

  setCurrentEnvironment(environmentName: string): void {
    if (!this.environments.has(environmentName)) {
      throw new Error(`Environment ${environmentName} does not exist`);
    }

    const oldEnvironment = this.currentEnvironment;
    this.currentEnvironment = environmentName;
    
    this.emit('environmentChanged', {
      from: oldEnvironment,
      to: environmentName
    });

    // Reload configurations for the new environment
    this.loadConfigurations();
  }

  // Configuration Schema Management
  defineSchema(schemas: ConfigurationSchema[]): void {
    for (const schema of schemas) {
      this.schema.set(schema.key, schema);
    }
    this.emit('schemaUpdated', schemas);
  }

  // Configuration Providers
  addProvider(provider: ConfigurationProvider): void {
    this.providers.push(provider);
    this.providers.sort((a, b) => a.priority - b.priority);

    // Set up watching if supported
    if (provider.watch) {
      provider.watch((changes) => {
        this.handleProviderChanges(provider.name, changes);
      });
    }

    this.emit('providerAdded', provider);
  }

  // Configuration Loading and Merging
  async loadConfigurations(): Promise<void> {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      throw new Error(`Environment ${this.currentEnvironment} not found`);
    }

    // Load from all providers in priority order
    const allConfigs = new Map<string, any>();

    for (const provider of this.providers) {
      try {
        const providerConfigs = await provider.load();
        for (const [key, value] of providerConfigs) {
          allConfigs.set(key, value);
        }
        this.logInfo(`Loaded ${providerConfigs.size} configurations from ${provider.name} provider`);
      } catch (error) {
        this.logError(`Failed to load configurations from ${provider.name} provider:`, error);
      }
    }

    // Merge with hierarchical inheritance
    await this.mergeConfigurations(environment, allConfigs);

    this.emit('configurationsLoaded', {
      environment: this.currentEnvironment,
      count: environment.configurations.size
    });
  }

  private async mergeConfigurations(
    environment: ConfigurationEnvironment, 
    newConfigs: Map<string, any>
  ): Promise<void> {
    // First, inherit from parent environment if exists
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

    // Then merge new configurations
    for (const [key, value] of newConfigs) {
      const schema = this.schema.get(key);
      const existingConfig = environment.configurations.get(key);

      // Validate against schema if exists
      if (schema) {
        this.validateConfiguration(key, value, schema);
      }

      // Create or update configuration value
      const configValue: ConfigurationValue = {
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

      // Encrypt sensitive values
      if (configValue.sensitive) {
        configValue.value = this.encryptValue(value);
        configValue.encrypted = true;
      }

      environment.configurations.set(key, configValue);
    }
  }

  // Configuration Access
  get<T = any>(key: string, defaultValue?: T): T {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      return defaultValue as T;
    }

    const config = environment.configurations.get(key);
    if (!config) {
      return defaultValue as T;
    }

    let value = config.value;
    if (config.encrypted) {
      value = this.decryptValue(value);
    }

    return value as T;
  }

  set(key: string, value: any, changedBy: string = 'system', reason: string = ''): void {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      throw new Error(`Environment ${this.currentEnvironment} not found`);
    }

    const oldConfig = environment.configurations.get(key);
    const oldValue = oldConfig ? oldConfig.value : undefined;

    // Validate against schema
    const schema = this.schema.get(key);
    if (schema) {
      this.validateConfiguration(key, value, schema);
    }

    const configValue: ConfigurationValue = {
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

    // Encrypt sensitive values
    if (configValue.sensitive) {
      configValue.value = this.encryptValue(value);
      configValue.encrypted = true;
    }

    environment.configurations.set(key, configValue);

    // Record change
    const change: ConfigurationChange = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      environment: this.currentEnvironment,
      configKey: key,
      oldValue,
      newValue: value,
      changedBy,
      reason,
      approved: true // In production, might require approval workflow
    };

    this.configurationChanges.push(change);
    
    this.emit('configurationChanged', change);
  }

  // Feature Flags Management
  createFeatureFlag(flag: Omit<FeatureFlag, 'createdAt' | 'updatedAt' | 'version'>): FeatureFlag {
    const featureFlag: FeatureFlag = {
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

  updateFeatureFlag(name: string, updates: Partial<FeatureFlag>): FeatureFlag {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      throw new Error(`Environment ${this.currentEnvironment} not found`);
    }

    const existingFlag = environment.featureFlags.get(name);
    if (!existingFlag) {
      throw new Error(`Feature flag ${name} not found`);
    }

    const updatedFlag: FeatureFlag = {
      ...existingFlag,
      ...updates,
      updatedAt: new Date(),
      version: existingFlag.version + 1
    };

    environment.featureFlags.set(name, updatedFlag);
    this.emit('featureFlagUpdated', updatedFlag);
    
    return updatedFlag;
  }

  isFeatureEnabled(name: string, context?: any): boolean {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      return false;
    }

    const flag = environment.featureFlags.get(name);
    if (!flag || !flag.enabled) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined) {
      const hash = crypto.createHash('md5').update(`${name}:${context?.userId || 'anonymous'}`).digest('hex');
      const hashValue = parseInt(hash.substring(0, 8), 16);
      const percentage = (hashValue % 100) + 1;
      
      if (percentage > flag.rolloutPercentage) {
        return false;
      }
    }

    // Check conditions
    if (flag.conditions && flag.conditions.length > 0) {
      return this.evaluateFeatureFlagConditions(flag.conditions, context);
    }

    return true;
  }

  private evaluateFeatureFlagConditions(
    conditions: FeatureFlagCondition[], 
    context: any
  ): boolean {
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  private evaluateCondition(condition: FeatureFlagCondition, context: any): boolean {
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

  // Configuration Validation
  private validateConfiguration(key: string, value: any, schema: ConfigurationSchema): void {
    // Type validation
    if (!this.validateType(value, schema.type)) {
      throw new Error(`Configuration ${key} must be of type ${schema.type}`);
    }

    // Required validation
    if (schema.required && (value === null || value === undefined)) {
      throw new Error(`Configuration ${key} is required`);
    }

    // Custom validation rules
    if (schema.validationRules) {
      for (const rule of schema.validationRules) {
        if (!this.validateRule(value, rule)) {
          throw new Error(rule.message);
        }
      }
    }
  }

  private validateType(value: any, expectedType: string): boolean {
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

  private validateRule(value: any, rule: ValidationRule): boolean {
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

  // Configuration Backup and Restore
  async createBackup(description: string, createdBy: string = 'system'): Promise<ConfigurationBackup> {
    const environment = this.environments.get(this.currentEnvironment);
    if (!environment) {
      throw new Error(`Environment ${this.currentEnvironment} not found`);
    }

    const backup: ConfigurationBackup = {
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

  async restoreBackup(backupId: string, restoredBy: string = 'system'): Promise<void> {
    const backup = this.configurationBackups.find(b => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup ${backupId} not found`);
    }

    const environment = this.environments.get(backup.environment);
    if (!environment) {
      throw new Error(`Environment ${backup.environment} not found`);
    }

    // Create a backup of current state before restoring
    await this.createBackup(`Pre-restore backup before restoring ${backupId}`, restoredBy);

    // Restore configurations and feature flags
    environment.configurations = new Map(backup.configurations);
    environment.featureFlags = new Map(backup.featureFlags);

    this.emit('backupRestored', { backupId, environment: backup.environment, restoredBy });
  }

  // Configuration Monitoring
  getConfigurationChanges(
    environment?: string,
    configKey?: string,
    limit: number = 100
  ): ConfigurationChange[] {
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

  // Utility Methods
  private handleProviderChanges(providerName: string, changes: Map<string, any>): void {
    this.logInfo(`Configuration changes detected from ${providerName} provider`);
    
    for (const [key, value] of changes) {
      try {
        this.set(key, value, providerName, 'Provider update');
      } catch (error) {
        this.logError(`Failed to update configuration ${key} from provider ${providerName}:`, error);
      }
    }
  }

  private inferType(value: any): ConfigurationValue['type'] {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value as ConfigurationValue['type'];
  }

  private encryptValue(value: any): string {
    const stringValue = JSON.stringify(value);
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(stringValue, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private decryptValue(encryptedValue: string): any {
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private initializeDefaultEnvironments(): void {
    this.createEnvironment('development', 'Development');
    this.createEnvironment('staging', 'Staging', 'development');
    this.createEnvironment('production', 'Production', 'staging');
  }

  private setupDefaultProviders(): void {
    // Add default providers
    this.addProvider(new EnvironmentConfigurationProvider());
    
    // Add file provider if config file exists
    const configFilePath = process.env.CONFIG_FILE_PATH || './config.json';
    this.addProvider(new FileConfigurationProvider(configFilePath));

    // Add remote provider if configured
    if (process.env.REMOTE_CONFIG_ENDPOINT && process.env.REMOTE_CONFIG_API_KEY) {
      this.addProvider(new RemoteConfigurationProvider(
        process.env.REMOTE_CONFIG_ENDPOINT,
        process.env.REMOTE_CONFIG_API_KEY
      ));
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    environments: boolean;
    providers: boolean;
    currentEnvironment: string;
    configurationsLoaded: boolean;
  }> {
    try {
      const environment = this.environments.get(this.currentEnvironment);
      
      return {
        environments: this.environments.size > 0,
        providers: this.providers.length > 0,
        currentEnvironment: this.currentEnvironment,
        configurationsLoaded: environment ? environment.configurations.size > 0 : false
      };
    } catch (error) {
      this.logError('Configuration management health check failed:', error);
      return {
        environments: false,
        providers: false,
        currentEnvironment: this.currentEnvironment,
        configurationsLoaded: false
      };
    }
  }

  // Cleanup
  cleanup(): void {
    this.watchTimers.forEach(timer => clearTimeout(timer));
    this.watchTimers = [];
    this.removeAllListeners();
  }
}

// Factory for easy instantiation
export class ConfigurationFactory {
  static createProductionConfigurationManagement(): ProductionConfigurationManagementService {
    return new ProductionConfigurationManagementService();
  }
}

// Configuration Decorator
export function Config(key: string, defaultValue?: any) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        // Would need to inject the configuration service
        // For now, return environment variable or default
        return process.env[key.toUpperCase().replace(/\./g, '_')] || defaultValue;
      }
    });
  };
}

// Feature Flag Decorator
export function FeatureFlag(flagName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Would need to inject the configuration service to check feature flag
      // For now, assume feature is enabled
      const featureEnabled = true; // configService.isFeatureEnabled(flagName, context)
      
      if (featureEnabled) {
        return originalMethod.apply(this, args);
      } else {
        throw new Error(`Feature ${flagName} is not enabled`);
      }
    };

    return descriptor;
  };
}
