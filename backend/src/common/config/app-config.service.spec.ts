import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let mockConfigService: Partial<ConfigService>;

  const mockAppConfig = {
    env: 'development' as const,
    port: 3000,
    name: 'Test App',
    version: '1.0.0',
    apiPrefix: '/api',
    logging: { level: 'debug' },
    timeout: { request: 30000, gracefulShutdown: 5000 },
    websocket: {
      enabled: true,
      port: 3001,
      path: '/ws',
      corsOrigin: 'http://localhost:3000',
      pingTimeout: 60000,
      pingInterval: 25000,
    },
    monitoring: {
      sentryDsn: 'https://test@sentry.io/123',
      enableMetrics: true,
      enableTracing: true,
    },
    features: {
      aiSearch: true,
      analytics: true,
      reporting: true,
      dashboard: true,
      advancedFeatures: true,
      enterprise: false,
      discovery: true,
      cliMode: false,
    },
    throttle: {
      short: { ttl: 1000, limit: 10 },
      medium: { ttl: 60000, limit: 100 },
      long: { ttl: 3600000, limit: 1000 },
    },
  };

  const mockDatabaseConfig = {
    host: 'localhost',
    port: 5432,
    database: 'testdb',
    username: 'testuser',
    password: 'testpass',
    ssl: false,
    synchronize: false,
  };

  const mockAuthConfig = {
    jwt: {
      secret: 'test-secret',
      refreshSecret: 'test-refresh-secret',
      expiresIn: '15m',
      refreshExpiresIn: '7d',
      issuer: 'test-issuer',
      audience: 'test-audience',
    },
  };

  const mockSecurityConfig = {
    cors: {
      origin: 'http://localhost:3000,http://localhost:3001',
    },
    csrf: {
      enabled: true,
      secret: 'csrf-secret',
    },
    encryption: {
      algorithm: 'aes-256-gcm' as const,
      configKey: 'encryption-key',
    },
    keyRotation: {
      enabled: true,
    },
  };

  const mockRedisConfig = {
    cache: {
      host: 'localhost',
      port: 6379,
      password: 'redis-password',
      username: 'redis-user',
      db: 0,
    },
    queue: {
      host: 'localhost',
      port: 6379,
      db: 1,
    },
  };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const configs: Record<string, unknown> = {
          app: mockAppConfig,
          database: mockDatabaseConfig,
          auth: mockAuthConfig,
          security: mockSecurityConfig,
          redis: mockRedisConfig,
        };

        if (key.startsWith('features.')) {
          const feature = key.split('.')[1];
          return mockAppConfig.features[feature as keyof typeof mockAppConfig.features] ?? defaultValue;
        }

        return configs[key] ?? defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty cache', () => {
      expect(service['cache'].size).toBe(0);
    });
  });

  describe('Generic Getters', () => {
    it('should get configuration value', () => {
      const value = service.get('app');
      expect(value).toEqual(mockAppConfig);
    });

    it('should return default value when key not found', () => {
      const value = service.get('nonexistent', 'default');
      expect(value).toBe('default');
    });

    it('should cache configuration values', () => {
      service.get('app');
      service.get('app');

      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    });

    it('should throw error when key not found and no default', () => {
      (mockConfigService.get as jest.Mock).mockReturnValue(undefined);

      expect(() => service.get('missing')).toThrow(
        "Configuration key 'missing' not found and no default value provided"
      );
    });

    it('should get required value with getOrThrow', () => {
      (mockConfigService.get as jest.Mock).mockReturnValue('test-value');

      const value = service.getOrThrow('test.key');
      expect(value).toBe('test-value');
    });

    it('should throw error when required value is missing', () => {
      (mockConfigService.get as jest.Mock).mockReturnValue(undefined);

      expect(() => service.getOrThrow('missing')).toThrow(
        'CRITICAL: Required configuration key "missing" is not set'
      );
    });

    it('should throw error when required value is null', () => {
      (mockConfigService.get as jest.Mock).mockReturnValue(null);

      expect(() => service.getOrThrow('null.key')).toThrow();
    });
  });

  describe('Application Config', () => {
    it('should get app config', () => {
      expect(service.app).toEqual(mockAppConfig);
    });

    it('should get environment', () => {
      expect(service.environment).toBe('development');
    });

    it('should get port', () => {
      expect(service.port).toBe(3000);
    });

    it('should get app name', () => {
      expect(service.appName).toBe('Test App');
    });

    it('should get API version', () => {
      expect(service.apiVersion).toBe('1.0.0');
    });

    it('should get API prefix', () => {
      expect(service.apiPrefix).toBe('/api');
    });

    it('should get log level', () => {
      expect(service.logLevel).toBe('debug');
    });

    it('should get request timeout', () => {
      expect(service.requestTimeout).toBe(30000);
    });

    it('should get graceful shutdown timeout', () => {
      expect(service.gracefulShutdownTimeout).toBe(5000);
    });
  });

  describe('Database Config', () => {
    it('should get database config', () => {
      expect(service.database).toEqual(mockDatabaseConfig);
    });

    it('should get database host', () => {
      expect(service.databaseHost).toBe('localhost');
    });

    it('should get database port', () => {
      expect(service.databasePort).toBe(5432);
    });

    it('should get database name', () => {
      expect(service.databaseName).toBe('testdb');
    });

    it('should get database username', () => {
      expect(service.databaseUsername).toBe('testuser');
    });

    it('should get database password', () => {
      expect(service.databasePassword).toBe('testpass');
    });

    it('should check if database SSL is enabled', () => {
      expect(service.isDatabaseSslEnabled).toBe(false);
    });

    it('should check if database sync is enabled', () => {
      expect(service.isDatabaseSyncEnabled).toBe(false);
    });
  });

  describe('Authentication Config', () => {
    it('should get auth config', () => {
      expect(service.auth).toEqual(mockAuthConfig);
    });

    it('should get JWT secret', () => {
      expect(service.jwtSecret).toBe('test-secret');
    });

    it('should get JWT refresh secret', () => {
      expect(service.jwtRefreshSecret).toBe('test-refresh-secret');
    });

    it('should get JWT expiration', () => {
      expect(service.jwtExpiresIn).toBe('15m');
    });

    it('should get JWT refresh expiration', () => {
      expect(service.jwtRefreshExpiresIn).toBe('7d');
    });

    it('should get JWT issuer', () => {
      expect(service.jwtIssuer).toBe('test-issuer');
    });

    it('should get JWT audience', () => {
      expect(service.jwtAudience).toBe('test-audience');
    });
  });

  describe('Security Config', () => {
    it('should get security config', () => {
      expect(service.security).toEqual(mockSecurityConfig);
    });

    it('should get CORS origin', () => {
      expect(service.corsOrigin).toBe('http://localhost:3000,http://localhost:3001');
    });

    it('should parse CORS origins as array', () => {
      const origins = service.corsOrigins;
      expect(origins).toEqual(['http://localhost:3000', 'http://localhost:3001']);
    });

    it('should handle single CORS origin', () => {
      const singleOriginConfig = {
        ...mockSecurityConfig,
        cors: { origin: 'http://localhost:3000' },
      };
      (mockConfigService.get as jest.Mock).mockReturnValue(singleOriginConfig);

      const origins = service.corsOrigins;
      expect(origins).toEqual(['http://localhost:3000']);
    });

    it('should handle array CORS origin', () => {
      const arrayOriginConfig = {
        ...mockSecurityConfig,
        cors: { origin: ['http://localhost:3000', 'http://localhost:3001'] },
      };
      (mockConfigService.get as jest.Mock).mockReturnValue(arrayOriginConfig);

      const origins = service.corsOrigins;
      expect(origins).toEqual(['http://localhost:3000', 'http://localhost:3001']);
    });

    it('should check if CSRF is enabled', () => {
      expect(service.isCsrfEnabled).toBe(true);
    });

    it('should get CSRF secret', () => {
      expect(service.csrfSecret).toBe('csrf-secret');
    });

    it('should get encryption algorithm', () => {
      expect(service.encryptionAlgorithm).toBe('aes-256-gcm');
    });

    it('should check if key rotation is enabled', () => {
      expect(service.isKeyRotationEnabled).toBe(true);
    });
  });

  describe('Redis Config', () => {
    it('should get redis config', () => {
      expect(service.redis).toEqual(mockRedisConfig);
    });

    it('should get redis cache config', () => {
      expect(service.redisCache).toEqual(mockRedisConfig.cache);
    });

    it('should get redis queue config', () => {
      expect(service.redisQueue).toEqual(mockRedisConfig.queue);
    });

    it('should get redis host', () => {
      expect(service.redisHost).toBe('localhost');
    });

    it('should get redis port', () => {
      expect(service.redisPort).toBe(6379);
    });

    it('should get redis password', () => {
      expect(service.redisPassword).toBe('redis-password');
    });

    it('should get redis username', () => {
      expect(service.redisUsername).toBe('redis-user');
    });

    it('should get redis cache database number', () => {
      expect(service.redisCacheDb).toBe(0);
    });

    it('should get redis queue database number', () => {
      expect(service.redisQueueDb).toBe(1);
    });
  });

  describe('WebSocket Config', () => {
    it('should check if WebSocket is enabled', () => {
      expect(service.isWebSocketEnabled).toBe(true);
    });

    it('should get WebSocket port', () => {
      expect(service.webSocketPort).toBe(3001);
    });

    it('should get WebSocket path', () => {
      expect(service.webSocketPath).toBe('/ws');
    });

    it('should get WebSocket CORS origin', () => {
      expect(service.webSocketCorsOrigin).toBe('http://localhost:3000');
    });

    it('should get WebSocket ping timeout', () => {
      expect(service.webSocketPingTimeout).toBe(60000);
    });

    it('should get WebSocket ping interval', () => {
      expect(service.webSocketPingInterval).toBe(25000);
    });
  });

  describe('Monitoring Config', () => {
    it('should get Sentry DSN', () => {
      expect(service.sentryDsn).toBe('https://test@sentry.io/123');
    });

    it('should check if metrics are enabled', () => {
      expect(service.isMetricsEnabled).toBe(true);
    });

    it('should check if tracing is enabled', () => {
      expect(service.isTracingEnabled).toBe(true);
    });
  });

  describe('Feature Flags', () => {
    it('should check if AI search is enabled', () => {
      expect(service.isAiSearchEnabled).toBe(true);
    });

    it('should check if analytics are enabled', () => {
      expect(service.isAnalyticsEnabled).toBe(true);
    });

    it('should check if reporting is enabled', () => {
      expect(service.isReportingEnabled).toBe(true);
    });

    it('should check if dashboard is enabled', () => {
      expect(service.isDashboardEnabled).toBe(true);
    });

    it('should check if advanced features are enabled', () => {
      expect(service.isAdvancedFeaturesEnabled).toBe(true);
    });

    it('should check if enterprise is enabled', () => {
      expect(service.isEnterpriseEnabled).toBe(false);
    });

    it('should check if discovery is enabled', () => {
      expect(service.isDiscoveryEnabled).toBe(true);
    });

    it('should check if CLI mode is enabled', () => {
      expect(service.isCliMode).toBe(false);
    });

    it('should check specific feature', () => {
      expect(service.isFeatureEnabled('aiSearch')).toBe(true);
    });

    it('should return false for non-existent feature', () => {
      expect(service.isFeatureEnabled('nonExistentFeature')).toBe(false);
    });
  });

  describe('Throttle Config', () => {
    it('should get throttle config', () => {
      expect(service.throttle).toEqual(mockAppConfig.throttle);
    });

    it('should get short throttle config', () => {
      expect(service.throttleShort).toEqual(mockAppConfig.throttle.short);
    });

    it('should get medium throttle config', () => {
      expect(service.throttleMedium).toEqual(mockAppConfig.throttle.medium);
    });

    it('should get long throttle config', () => {
      expect(service.throttleLong).toEqual(mockAppConfig.throttle.long);
    });
  });

  describe('Environment Checks', () => {
    it('should check if development environment', () => {
      expect(service.isDevelopment).toBe(true);
    });

    it('should check if production environment', () => {
      expect(service.isProduction).toBe(false);
    });

    it('should check if staging environment', () => {
      expect(service.isStaging).toBe(false);
    });

    it('should check if test environment', () => {
      expect(service.isTest).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should clear cache', () => {
      service.get('app');
      expect(service['cache'].size).toBeGreaterThan(0);

      service.clearCache();
      expect(service['cache'].size).toBe(0);
    });

    it('should get all configuration in non-production', () => {
      const allConfig = service.getAll();

      expect(allConfig.app).toBeDefined();
      expect(allConfig.database).toBeDefined();
      expect(allConfig.database.password).toBe('[REDACTED]');
      expect(allConfig.auth.jwt.secret).toBe('[REDACTED]');
    });

    it('should block getAll in production', () => {
      mockAppConfig.env = 'production';

      const allConfig = service.getAll();

      expect(allConfig).toEqual({});
    });

    it('should redact sensitive values in getAll', () => {
      const allConfig = service.getAll();

      expect(allConfig.database.password).toBe('[REDACTED]');
      expect(allConfig.auth.jwt.secret).toBe('[REDACTED]');
      expect(allConfig.auth.jwt.refreshSecret).toBe('[REDACTED]');
      expect(allConfig.security.csrf.secret).toBe('[REDACTED]');
      expect(allConfig.security.encryption.configKey).toBe('[REDACTED]');
      expect(allConfig.redis.cache.password).toBe('[REDACTED]');
      expect(allConfig.redis.queue.password).toBe('[REDACTED]');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate critical config successfully', () => {
      expect(() => service.validateCriticalConfig()).not.toThrow();
    });

    it('should throw error for missing database host', () => {
      mockDatabaseConfig.host = '';

      expect(() => service.validateCriticalConfig()).toThrow();
    });

    it('should throw error for missing JWT secret', () => {
      mockAuthConfig.jwt.secret = '';

      expect(() => service.validateCriticalConfig()).toThrow();
    });

    it('should throw error for wildcard CORS in production', () => {
      mockAppConfig.env = 'production';
      mockSecurityConfig.cors.origin = '*';

      expect(() => service.validateCriticalConfig()).toThrow(
        'Wildcard CORS origin (*) is not allowed in production'
      );
    });

    it('should throw error if SSL not enabled in production', () => {
      mockAppConfig.env = 'production';
      mockDatabaseConfig.ssl = false;

      expect(() => service.validateCriticalConfig()).toThrow(
        'Database SSL must be enabled in production'
      );
    });

    it('should throw error if database sync enabled in production', () => {
      mockAppConfig.env = 'production';
      mockDatabaseConfig.synchronize = true;

      expect(() => service.validateCriticalConfig()).toThrow(
        'Database sync must be disabled in production'
      );
    });

    it('should throw error if CSRF not enabled in production', () => {
      mockAppConfig.env = 'production';
      mockSecurityConfig.csrf.enabled = false;

      expect(() => service.validateCriticalConfig()).toThrow(
        'CSRF protection must be enabled in production'
      );
    });

    it('should check all required fields', () => {
      mockDatabaseConfig.username = '';
      mockDatabaseConfig.password = '';
      mockDatabaseConfig.database = '';

      expect(() => service.validateCriticalConfig()).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null CSRF secret', () => {
      mockSecurityConfig.csrf.secret = null;
      const secret = service.csrfSecret;

      expect(secret).toBeNull();
    });

    it('should handle undefined Redis password', () => {
      mockRedisConfig.cache.password = undefined;
      const password = service.redisPassword;

      expect(password).toBeUndefined();
    });

    it('should handle undefined Redis username', () => {
      mockRedisConfig.cache.username = undefined;
      const username = service.redisUsername;

      expect(username).toBeUndefined();
    });

    it('should handle empty CORS origin string', () => {
      mockSecurityConfig.cors.origin = '';
      const origins = service.corsOrigins;

      expect(origins).toEqual([]);
    });

    it('should handle CORS origin with spaces', () => {
      mockSecurityConfig.cors.origin = ' http://localhost:3000 , http://localhost:3001 ';
      const origins = service.corsOrigins;

      expect(origins).toEqual(['http://localhost:3000', 'http://localhost:3001']);
    });

    it('should cache values with different default values separately', () => {
      service.get('test.key', 'default1');
      service.get('test.key', 'default2');

      expect(mockConfigService.get).toHaveBeenCalledTimes(2);
    });

    it('should handle Sentry DSN as undefined', () => {
      mockAppConfig.monitoring.sentryDsn = undefined;
      const dsn = service.sentryDsn;

      expect(dsn).toBeUndefined();
    });
  });
});
