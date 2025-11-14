import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import {
  ProductionConfigurationManagementService,
  FileConfigurationProvider,
  EnvironmentConfigurationProvider,
  RemoteConfigurationProvider,
  ConfigurationFactory,
  ConfigurationValue,
  ConfigurationSchema,
  FeatureFlag,
  ConfigurationEnvironment,
  ValidationRule,
} from './production-configuration-management.service';
import { LoggerService } from '@/common/logging/logger.service';

describe('ProductionConfigurationManagementService', () => {
  let service: ProductionConfigurationManagementService;

  beforeEach(() => {
    service = new ProductionConfigurationManagementService();
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('Environment Management', () => {
    it('should create default environments on initialization', () => {
      const environments = ['development', 'staging', 'production'];
      environments.forEach(envName => {
        const env = service['environments'].get(envName);
        expect(env).toBeDefined();
        expect(env?.name).toBe(envName);
      });
    });

    it('should create a new environment', () => {
      const environment = service.createEnvironment('testing', 'Testing Environment');

      expect(environment.name).toBe('testing');
      expect(environment.displayName).toBe('Testing Environment');
      expect(environment.active).toBe(true);
      expect(environment.configurations.size).toBe(0);
      expect(environment.featureFlags.size).toBe(0);
    });

    it('should create environment with parent', () => {
      const childEnv = service.createEnvironment('test', 'Test', 'development');

      expect(childEnv.parentEnvironment).toBe('development');
    });

    it('should set current environment', () => {
      const spy = jest.spyOn(service, 'emit');
      service.setCurrentEnvironment('staging');

      expect(service['currentEnvironment']).toBe('staging');
      expect(spy).toHaveBeenCalledWith('environmentChanged', {
        from: 'development',
        to: 'staging'
      });
    });

    it('should throw error when setting non-existent environment', () => {
      expect(() => {
        service.setCurrentEnvironment('nonexistent');
      }).toThrow('Environment nonexistent does not exist');
    });

    it('should emit event when environment is created', () => {
      const spy = jest.spyOn(service, 'emit');
      const environment = service.createEnvironment('custom', 'Custom');

      expect(spy).toHaveBeenCalledWith('environmentCreated', environment);
    });
  });

  describe('Configuration Schema Management', () => {
    it('should define configuration schemas', () => {
      const schemas: ConfigurationSchema[] = [
        {
          key: 'database.host',
          type: 'string',
          required: true,
          defaultValue: 'localhost'
        },
        {
          key: 'server.port',
          type: 'number',
          required: false,
          defaultValue: 3000
        }
      ];

      service.defineSchema(schemas);

      expect(service['schema'].size).toBe(2);
      expect(service['schema'].get('database.host')).toEqual(schemas[0]);
    });

    it('should emit schemaUpdated event', () => {
      const spy = jest.spyOn(service, 'emit');
      const schemas: ConfigurationSchema[] = [
        { key: 'test.key', type: 'string', required: true }
      ];

      service.defineSchema(schemas);

      expect(spy).toHaveBeenCalledWith('schemaUpdated', schemas);
    });
  });

  describe('Configuration Access', () => {
    beforeEach(() => {
      service.set('testKey', 'testValue');
    });

    it('should get configuration value', () => {
      const value = service.get<string>('testKey');
      expect(value).toBe('testValue');
    });

    it('should return default value when key not found', () => {
      const value = service.get<string>('nonexistent', 'default');
      expect(value).toBe('default');
    });

    it('should set configuration value', () => {
      service.set('newKey', 'newValue');
      const value = service.get<string>('newKey');
      expect(value).toBe('newValue');
    });

    it('should record configuration change', () => {
      const initialChanges = service['configurationChanges'].length;
      service.set('key', 'value', 'admin', 'Testing');

      expect(service['configurationChanges'].length).toBe(initialChanges + 1);
      const lastChange = service['configurationChanges'][service['configurationChanges'].length - 1];
      expect(lastChange.configKey).toBe('key');
      expect(lastChange.changedBy).toBe('admin');
      expect(lastChange.reason).toBe('Testing');
    });

    it('should emit configurationChanged event', () => {
      const spy = jest.spyOn(service, 'emit');
      service.set('key', 'value');

      expect(spy).toHaveBeenCalledWith('configurationChanged', expect.objectContaining({
        configKey: 'key',
        newValue: 'value'
      }));
    });

    it('should increment version on update', () => {
      service.set('versionTest', 'v1');
      service.set('versionTest', 'v2');

      const env = service['environments'].get('development');
      const config = env?.configurations.get('versionTest');
      expect(config?.version).toBe(2);
    });

    it('should encrypt sensitive values', () => {
      const schema: ConfigurationSchema = {
        key: 'sensitive.key',
        type: 'string',
        required: true,
        sensitive: true
      };
      service.defineSchema([schema]);

      service.set('sensitive.key', 'secret-password');

      const env = service['environments'].get('development');
      const config = env?.configurations.get('sensitive.key');
      expect(config?.encrypted).toBe(true);
      expect(config?.value).not.toBe('secret-password');
    });

    it('should decrypt sensitive values on get', () => {
      const schema: ConfigurationSchema = {
        key: 'password',
        type: 'string',
        required: true,
        sensitive: true
      };
      service.defineSchema([schema]);

      service.set('password', 'my-secret');
      const value = service.get<string>('password');

      expect(value).toBe('my-secret');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate type: string', () => {
      const schema: ConfigurationSchema = {
        key: 'string.value',
        type: 'string',
        required: true
      };
      service.defineSchema([schema]);

      expect(() => service.set('string.value', 'valid')).not.toThrow();
      expect(() => service.set('string.value', 123)).toThrow();
    });

    it('should validate type: number', () => {
      const schema: ConfigurationSchema = {
        key: 'number.value',
        type: 'number',
        required: true
      };
      service.defineSchema([schema]);

      expect(() => service.set('number.value', 42)).not.toThrow();
      expect(() => service.set('number.value', 'not-a-number')).toThrow();
    });

    it('should validate type: boolean', () => {
      const schema: ConfigurationSchema = {
        key: 'bool.value',
        type: 'boolean',
        required: true
      };
      service.defineSchema([schema]);

      expect(() => service.set('bool.value', true)).not.toThrow();
      expect(() => service.set('bool.value', 'true')).toThrow();
    });

    it('should validate required fields', () => {
      const schema: ConfigurationSchema = {
        key: 'required.value',
        type: 'string',
        required: true
      };
      service.defineSchema([schema]);

      expect(() => service.set('required.value', null)).toThrow('Configuration required.value is required');
    });

    it('should validate min rule for numbers', () => {
      const schema: ConfigurationSchema = {
        key: 'min.number',
        type: 'number',
        required: true,
        validationRules: [{ type: 'min', value: 10, message: 'Must be at least 10' }]
      };
      service.defineSchema([schema]);

      expect(() => service.set('min.number', 15)).not.toThrow();
      expect(() => service.set('min.number', 5)).toThrow('Must be at least 10');
    });

    it('should validate max rule for numbers', () => {
      const schema: ConfigurationSchema = {
        key: 'max.number',
        type: 'number',
        required: true,
        validationRules: [{ type: 'max', value: 100, message: 'Must be at most 100' }]
      };
      service.defineSchema([schema]);

      expect(() => service.set('max.number', 50)).not.toThrow();
      expect(() => service.set('max.number', 150)).toThrow('Must be at most 100');
    });

    it('should validate pattern rule', () => {
      const schema: ConfigurationSchema = {
        key: 'email',
        type: 'string',
        required: true,
        validationRules: [{ type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email' }]
      };
      service.defineSchema([schema]);

      expect(() => service.set('email', 'test@example.com')).not.toThrow();
      expect(() => service.set('email', 'invalid-email')).toThrow('Invalid email');
    });

    it('should validate enum rule', () => {
      const schema: ConfigurationSchema = {
        key: 'env',
        type: 'string',
        required: true,
        validationRules: [{
          type: 'enum',
          value: ['development', 'staging', 'production'],
          message: 'Invalid environment'
        }]
      };
      service.defineSchema([schema]);

      expect(() => service.set('env', 'development')).not.toThrow();
      expect(() => service.set('env', 'invalid')).toThrow('Invalid environment');
    });

    it('should validate custom rule', () => {
      const schema: ConfigurationSchema = {
        key: 'custom',
        type: 'string',
        required: true,
        validationRules: [{
          type: 'custom',
          message: 'Must start with "test-"',
          validator: (value: string) => value.startsWith('test-')
        }]
      };
      service.defineSchema([schema]);

      expect(() => service.set('custom', 'test-value')).not.toThrow();
      expect(() => service.set('custom', 'invalid')).toThrow('Must start with "test-"');
    });
  });

  describe('Feature Flags', () => {
    it('should create feature flag', () => {
      const flag = service.createFeatureFlag({
        name: 'newFeature',
        enabled: true,
        description: 'A new feature',
        createdBy: 'admin'
      });

      expect(flag.name).toBe('newFeature');
      expect(flag.enabled).toBe(true);
      expect(flag.version).toBe(1);
      expect(flag.createdAt).toBeInstanceOf(Date);
    });

    it('should update feature flag', () => {
      service.createFeatureFlag({
        name: 'testFlag',
        enabled: false,
        description: 'Test',
        createdBy: 'admin'
      });

      const updated = service.updateFeatureFlag('testFlag', { enabled: true });

      expect(updated.enabled).toBe(true);
      expect(updated.version).toBe(2);
    });

    it('should throw error when updating non-existent flag', () => {
      expect(() => {
        service.updateFeatureFlag('nonexistent', { enabled: true });
      }).toThrow('Feature flag nonexistent not found');
    });

    it('should check if feature is enabled', () => {
      service.createFeatureFlag({
        name: 'enabledFeature',
        enabled: true,
        description: 'Enabled',
        createdBy: 'admin'
      });

      expect(service.isFeatureEnabled('enabledFeature')).toBe(true);
    });

    it('should return false for disabled feature', () => {
      service.createFeatureFlag({
        name: 'disabledFeature',
        enabled: false,
        description: 'Disabled',
        createdBy: 'admin'
      });

      expect(service.isFeatureEnabled('disabledFeature')).toBe(false);
    });

    it('should return false for non-existent feature', () => {
      expect(service.isFeatureEnabled('nonexistent')).toBe(false);
    });

    it('should respect rollout percentage', () => {
      service.createFeatureFlag({
        name: 'partialRollout',
        enabled: true,
        description: 'Partial rollout',
        rolloutPercentage: 50,
        createdBy: 'admin'
      });

      // Test with different user IDs to get different hash values
      const results = new Set<boolean>();
      for (let i = 0; i < 100; i++) {
        results.add(service.isFeatureEnabled('partialRollout', { userId: `user-${i}` }));
      }

      // Should have both true and false values
      expect(results.size).toBe(2);
    });

    it('should evaluate conditions with equals operator', () => {
      service.createFeatureFlag({
        name: 'conditionalFeature',
        enabled: true,
        description: 'Conditional',
        conditions: [{ type: 'user', operator: 'equals', value: 'admin' }],
        createdBy: 'admin'
      });

      expect(service.isFeatureEnabled('conditionalFeature', { user: 'admin' })).toBe(true);
      expect(service.isFeatureEnabled('conditionalFeature', { user: 'guest' })).toBe(false);
    });

    it('should evaluate conditions with greaterThan operator', () => {
      service.createFeatureFlag({
        name: 'ageRestricted',
        enabled: true,
        description: 'Age restricted',
        conditions: [{ type: 'user', operator: 'greaterThan', value: 18 }],
        createdBy: 'admin'
      });

      expect(service.isFeatureEnabled('ageRestricted', { user: 21 })).toBe(true);
      expect(service.isFeatureEnabled('ageRestricted', { user: 16 })).toBe(false);
    });
  });

  describe('Backup and Restore', () => {
    beforeEach(() => {
      service.set('backup.test', 'original');
    });

    it('should create backup', async () => {
      const backup = await service.createBackup('Test backup', 'admin');

      expect(backup.id).toBeDefined();
      expect(backup.description).toBe('Test backup');
      expect(backup.createdBy).toBe('admin');
      expect(backup.environment).toBe('development');
      expect(backup.configurations.size).toBeGreaterThan(0);
    });

    it('should restore backup', async () => {
      const backup = await service.createBackup('Before change', 'admin');
      service.set('backup.test', 'modified');

      await service.restoreBackup(backup.id, 'admin');

      const value = service.get<string>('backup.test');
      expect(value).toBe('original');
    });

    it('should throw error when restoring non-existent backup', async () => {
      await expect(service.restoreBackup('nonexistent', 'admin'))
        .rejects.toThrow('Backup nonexistent not found');
    });

    it('should create backup before restore', async () => {
      const backup = await service.createBackup('Test', 'admin');
      const initialCount = service['configurationBackups'].length;

      await service.restoreBackup(backup.id, 'admin');

      expect(service['configurationBackups'].length).toBe(initialCount + 1);
    });
  });

  describe('Configuration History', () => {
    it('should get configuration changes', () => {
      service.set('key1', 'value1', 'user1', 'reason1');
      service.set('key2', 'value2', 'user2', 'reason2');

      const changes = service.getConfigurationChanges();

      expect(changes.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter changes by environment', () => {
      service.set('key', 'value');
      const changes = service.getConfigurationChanges('development');

      expect(changes.every(c => c.environment === 'development')).toBe(true);
    });

    it('should filter changes by config key', () => {
      service.set('specific.key', 'value1');
      service.set('other.key', 'value2');

      const changes = service.getConfigurationChanges(undefined, 'specific.key');

      expect(changes.every(c => c.configKey === 'specific.key')).toBe(true);
    });

    it('should limit number of changes', () => {
      for (let i = 0; i < 20; i++) {
        service.set(`key${i}`, `value${i}`);
      }

      const changes = service.getConfigurationChanges(undefined, undefined, 5);
      expect(changes.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const health = await service.healthCheck();

      expect(health.environments).toBe(true);
      expect(health.providers).toBe(true);
      expect(health.currentEnvironment).toBe('development');
    });

    it('should handle errors gracefully', async () => {
      // Force an error by clearing environments
      service['environments'].clear();

      const health = await service.healthCheck();

      expect(health.configurationsLoaded).toBe(false);
    });
  });

  describe('Provider Management', () => {
    it('should add provider', () => {
      const provider = new EnvironmentConfigurationProvider();
      const initialCount = service['providers'].length;

      service.addProvider(provider);

      expect(service['providers'].length).toBe(initialCount + 1);
    });

    it('should sort providers by priority', () => {
      const lowPriority = new FileConfigurationProvider('/test.json');
      const highPriority = new RemoteConfigurationProvider('http://test', 'key');

      service['providers'] = [];
      service.addProvider(lowPriority);
      service.addProvider(highPriority);

      expect(service['providers'][0].priority).toBeLessThan(service['providers'][1].priority);
    });

    it('should emit providerAdded event', () => {
      const spy = jest.spyOn(service, 'emit');
      const provider = new EnvironmentConfigurationProvider();

      service.addProvider(provider);

      expect(spy).toHaveBeenCalledWith('providerAdded', provider);
    });
  });

  describe('Encryption', () => {
    it('should encrypt and decrypt values', () => {
      const original = { sensitive: 'data', password: 'secret' };
      const encrypted = service['encryptValue'](original);
      const decrypted = service['decryptValue'](encrypted);

      expect(decrypted).toEqual(original);
    });

    it('should produce different encrypted values', () => {
      const value = 'test';
      const encrypted1 = service['encryptValue'](value);
      const encrypted2 = service['encryptValue'](value);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle different data types', () => {
      const testCases = [
        'string',
        123,
        true,
        { key: 'value' },
        ['array', 'of', 'items']
      ];

      testCases.forEach(testCase => {
        const encrypted = service['encryptValue'](testCase);
        const decrypted = service['decryptValue'](encrypted);
        expect(decrypted).toEqual(testCase);
      });
    });
  });

  describe('Configuration Providers', () => {
    describe('EnvironmentConfigurationProvider', () => {
      let provider: EnvironmentConfigurationProvider;

      beforeEach(() => {
        provider = new EnvironmentConfigurationProvider();
      });

      it('should load environment variables', async () => {
        process.env.APP_CONFIG_TEST_KEY = 'test-value';

        const configs = await provider.load();

        expect(configs.get('test.key')).toBe('test-value');

        delete process.env.APP_CONFIG_TEST_KEY;
      });

      it('should parse JSON values', async () => {
        process.env.APP_CONFIG_JSON_VALUE = '{"key":"value"}';

        const configs = await provider.load();
        const value = configs.get('json.value');

        expect(value).toEqual({ key: 'value' });

        delete process.env.APP_CONFIG_JSON_VALUE;
      });

      it('should handle non-JSON values as strings', async () => {
        process.env.APP_CONFIG_STRING_VALUE = 'plain-string';

        const configs = await provider.load();

        expect(configs.get('string.value')).toBe('plain-string');

        delete process.env.APP_CONFIG_STRING_VALUE;
      });
    });

    describe('RemoteConfigurationProvider', () => {
      let provider: RemoteConfigurationProvider;

      beforeEach(() => {
        provider = new RemoteConfigurationProvider('http://config-server', 'api-key');
      });

      it('should have correct name and priority', () => {
        expect(provider.name).toBe('remote');
        expect(provider.priority).toBe(3);
      });

      it('should load remote configurations', async () => {
        const configs = await provider.load();

        expect(configs.size).toBeGreaterThan(0);
      });

      it('should set remote configuration', async () => {
        await expect(provider.set('key', 'value')).resolves.not.toThrow();
      });
    });
  });

  describe('Factory', () => {
    it('should create service instance', () => {
      const instance = ConfigurationFactory.createProductionConfigurationManagement();

      expect(instance).toBeInstanceOf(ProductionConfigurationManagementService);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty configuration get', () => {
      const value = service.get('nonexistent.key', undefined);
      expect(value).toBeUndefined();
    });

    it('should handle null values', () => {
      service.set('null.value', null);
      const value = service.get('null.value');
      expect(value).toBeNull();
    });

    it('should handle array configurations', () => {
      const array = ['item1', 'item2', 'item3'];
      service.set('array.config', array);
      const retrieved = service.get<string[]>('array.config');

      expect(retrieved).toEqual(array);
    });

    it('should handle object configurations', () => {
      const obj = { nested: { key: 'value' } };
      service.set('object.config', obj);
      const retrieved = service.get<typeof obj>('object.config');

      expect(retrieved).toEqual(obj);
    });

    it('should handle large configuration values', () => {
      const largeString = 'x'.repeat(10000);
      service.set('large.value', largeString);
      const retrieved = service.get<string>('large.value');

      expect(retrieved).toBe(largeString);
    });

    it('should cleanup resources', () => {
      const initialListeners = service.listenerCount('configurationChanged');
      service.cleanup();
      const afterListeners = service.listenerCount('configurationChanged');

      expect(afterListeners).toBeLessThanOrEqual(initialListeners);
    });
  });
});
