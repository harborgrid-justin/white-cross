/**
 * LOC: NETDIJ1234567
 * File: /reuse/san/network-dependency-injection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network module implementations
 *   - NestJS dynamic modules
 *   - Virtual network dependency injection
 */

/**
 * File: /reuse/san/network-dependency-injection-kit.ts
 * Locator: WC-UTL-NETDIJ-001
 * Purpose: Comprehensive Network Dependency Injection Kit - custom providers, module configuration, dynamic registration, scopes, middleware, interceptors, guards, async providers
 *
 * Upstream: Independent utility module for NestJS network dependency injection
 * Downstream: ../backend/*, Network modules, middleware, interceptors, guards
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for network DI patterns, custom providers, dynamic modules, scopes, middleware, interceptors, guards, async providers
 *
 * LLM Context: Comprehensive network dependency injection utilities for implementing production-ready software-defined networking DI patterns.
 * Provides custom network providers, module configuration, dynamic module registration, service scopes, middleware providers, interceptor providers,
 * guard providers, and async providers. Essential for scalable virtual network infrastructure with proper dependency injection in healthcare environments.
 */

import {
  Module,
  DynamicModule,
  Provider,
  Type,
  Injectable,
  Inject,
  Scope,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  CanActivate,
  NestMiddleware,
  MiddlewareConsumer,
  ModuleMetadata,
  ForwardReference,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';
import { Observable } from 'rxjs';
import { tap, catchError, timeout } from 'rxjs/operators';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface NetworkModuleOptions {
  isGlobal?: boolean;
  providers?: Provider[];
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  exports?: Array<string | symbol | Provider | Type<any>>;
  controllers?: Type<any>[];
}

interface NetworkModuleAsyncOptions {
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  useFactory?: (...args: any[]) => Promise<NetworkModuleOptions> | NetworkModuleOptions;
  inject?: any[];
  useClass?: Type<NetworkOptionsFactory>;
  useExisting?: Type<NetworkOptionsFactory>;
}

interface NetworkOptionsFactory {
  createNetworkOptions(): Promise<NetworkModuleOptions> | NetworkModuleOptions;
}

interface CustomProviderConfig {
  token: string | symbol;
  scope?: Scope;
  transient?: boolean;
  lazy?: boolean;
  metadata?: Record<string, any>;
}

interface ProviderMetadata {
  token: string | symbol;
  type: 'class' | 'value' | 'factory' | 'existing' | 'async';
  scope: Scope;
  dependencies: any[];
  metadata: Record<string, any>;
  createdAt: Date;
}

interface NetworkMiddlewareConfig {
  path: string | string[];
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'ALL';
  excludePaths?: string[];
  order?: number;
}

interface NetworkInterceptorConfig {
  timeout?: number;
  cacheKey?: string;
  cacheTTL?: number;
  logRequests?: boolean;
  transformResponse?: boolean;
}

interface NetworkGuardConfig {
  allowAnonymous?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  checkNetworkAccess?: boolean;
}

interface InjectionToken<T = any> {
  token: string | symbol;
  description?: string;
  factory?: () => T;
}

interface ProviderRegistry {
  providers: Map<string | symbol, ProviderMetadata>;
  instances: Map<string | symbol, any>;
  scopes: Map<string | symbol, Scope>;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for Network Module Configuration registry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkModuleConfig model
 *
 * @example
 * ```typescript
 * const NetworkModuleConfig = createNetworkModuleConfigModel(sequelize);
 * const config = await NetworkModuleConfig.create({
 *   moduleName: 'PatientNetworkModule',
 *   moduleId: 'mod_patient_001',
 *   isGlobal: true,
 *   providers: ['PatientService', 'PatientRepository'],
 *   exports: ['PatientService']
 * });
 * ```
 */
export const createNetworkModuleConfigModel = (sequelize: Sequelize) => {
  class NetworkModuleConfig extends Model {
    public id!: number;
    public moduleName!: string;
    public moduleId!: string;
    public isGlobal!: boolean;
    public providers!: string[];
    public imports!: string[];
    public exports!: string[];
    public controllers!: string[];
    public metadata!: Record<string, any>;
    public configHash!: string;
    public version!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  NetworkModuleConfig.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      moduleName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Module class name',
      },
      moduleId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique module identifier',
      },
      isGlobal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether module is globally available',
      },
      providers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of provider tokens',
      },
      imports: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of imported module names',
      },
      exports: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of exported provider tokens',
      },
      controllers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of controller names',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Module metadata',
      },
      configHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: 'Configuration hash for change detection',
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '1.0.0',
        comment: 'Module version',
      },
    },
    {
      sequelize,
      tableName: 'network_module_configs',
      timestamps: true,
      indexes: [
        { fields: ['moduleId'], unique: true },
        { fields: ['moduleName'] },
        { fields: ['isGlobal'] },
      ],
    },
  );

  return NetworkModuleConfig;
};

/**
 * Sequelize model for Provider Registry with scope and dependency tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProviderRegistry model
 *
 * @example
 * ```typescript
 * const ProviderRegistry = createProviderRegistryModel(sequelize);
 * const provider = await ProviderRegistry.create({
 *   token: 'PatientService',
 *   providerType: 'class',
 *   scope: 'DEFAULT',
 *   moduleId: 'mod_patient_001',
 *   dependencies: ['PatientRepository', 'ConfigService']
 * });
 * ```
 */
export const createProviderRegistryModel = (sequelize: Sequelize) => {
  class ProviderRegistry extends Model {
    public id!: number;
    public token!: string;
    public providerType!: string;
    public scope!: string;
    public moduleId!: string;
    public className!: string | null;
    public dependencies!: string[];
    public isExported!: boolean;
    public isLazy!: boolean;
    public metadata!: Record<string, any>;
    public registeredAt!: Date;
    public lastAccessedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProviderRegistry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Provider injection token',
      },
      providerType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Provider type (class, value, factory, existing, async)',
      },
      scope: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'DEFAULT',
        comment: 'Provider scope (DEFAULT, REQUEST, TRANSIENT)',
      },
      moduleId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Associated module identifier',
      },
      className: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Provider class name if applicable',
      },
      dependencies: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of dependency tokens',
      },
      isExported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether provider is exported from module',
      },
      isLazy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether provider is lazily initialized',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Provider metadata',
      },
      registeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Provider registration timestamp',
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last provider access timestamp',
      },
    },
    {
      sequelize,
      tableName: 'provider_registry',
      timestamps: true,
      indexes: [
        { fields: ['token', 'moduleId'], unique: true },
        { fields: ['moduleId'] },
        { fields: ['scope'] },
        { fields: ['providerType'] },
      ],
    },
  );

  return ProviderRegistry;
};

/**
 * Sequelize model for Dependency Injection Events and audit logging.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DIEvent model
 *
 * @example
 * ```typescript
 * const DIEvent = createDIEventModel(sequelize);
 * const event = await DIEvent.create({
 *   eventType: 'provider_registered',
 *   token: 'PatientService',
 *   moduleId: 'mod_patient_001',
 *   details: { scope: 'DEFAULT', dependencies: ['PatientRepository'] }
 * });
 * ```
 */
export const createDIEventModel = (sequelize: Sequelize) => {
  class DIEvent extends Model {
    public id!: number;
    public eventType!: string;
    public token!: string;
    public moduleId!: string | null;
    public scope!: string | null;
    public details!: Record<string, any>;
    public error!: string | null;
    public duration!: number | null;
    public readonly createdAt!: Date;
  }

  DIEvent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Event type (provider_registered, provider_resolved, etc.)',
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Provider token',
      },
      moduleId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Associated module identifier',
      },
      scope: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Provider scope',
      },
      details: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Event details',
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if event failed',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Event duration in milliseconds',
      },
    },
    {
      sequelize,
      tableName: 'di_events',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['eventType'] },
        { fields: ['token'] },
        { fields: ['moduleId'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return DIEvent;
};

// ============================================================================
// CUSTOM NETWORK PROVIDERS (4-8)
// ============================================================================

/**
 * Creates custom class provider with metadata and scope configuration.
 *
 * @param {Type<T>} classType - Provider class
 * @param {CustomProviderConfig} config - Provider configuration
 * @returns {Provider} Class provider
 *
 * @example
 * ```typescript
 * const provider = createCustomClassProvider(PatientNetworkService, {
 *   token: 'PATIENT_NETWORK_SERVICE',
 *   scope: Scope.DEFAULT,
 *   metadata: { region: 'us-east-1' }
 * });
 * ```
 */
export const createCustomClassProvider = <T>(
  classType: Type<T>,
  config: CustomProviderConfig,
): Provider => {
  return {
    provide: config.token,
    useClass: classType,
    scope: config.scope || Scope.DEFAULT,
  };
};

/**
 * Creates custom value provider for static configuration or constants.
 *
 * @param {string | symbol} token - Injection token
 * @param {T} value - Provider value
 * @returns {Provider} Value provider
 *
 * @example
 * ```typescript
 * const provider = createCustomValueProvider('NETWORK_CONFIG', {
 *   maxConnections: 100,
 *   timeout: 5000,
 *   retries: 3
 * });
 * ```
 */
export const createCustomValueProvider = <T>(token: string | symbol, value: T): Provider => {
  return {
    provide: token,
    useValue: value,
  };
};

/**
 * Creates custom factory provider with dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} inject - Dependencies to inject
 * @param {Scope} [scope=Scope.DEFAULT] - Provider scope
 * @returns {Provider} Factory provider
 *
 * @example
 * ```typescript
 * const provider = createCustomFactoryProvider(
 *   'NETWORK_CLIENT',
 *   (config: ConfigService) => {
 *     return new NetworkClient(config.get('network'));
 *   },
 *   [ConfigService],
 *   Scope.DEFAULT
 * );
 * ```
 */
export const createCustomFactoryProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  inject: any[] = [],
  scope: Scope = Scope.DEFAULT,
): Provider => {
  return {
    provide: token,
    useFactory: factory,
    inject,
    scope,
  };
};

/**
 * Creates aliased provider that references another provider.
 *
 * @param {string | symbol} token - New injection token
 * @param {string | symbol} existingToken - Existing provider token
 * @returns {Provider} Existing provider alias
 *
 * @example
 * ```typescript
 * const provider = createAliasedProvider('IPatientService', 'PatientService');
 * ```
 */
export const createAliasedProvider = (
  token: string | symbol,
  existingToken: string | symbol,
): Provider => {
  return {
    provide: token,
    useExisting: existingToken,
  };
};

/**
 * Creates async provider with promise-based initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} asyncFactory - Async factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncProvider(
 *   'DATABASE_CONNECTION',
 *   async (config: ConfigService) => {
 *     const conn = new DatabaseConnection(config.get('db'));
 *     await conn.connect();
 *     return conn;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export const createAsyncProvider = (
  token: string | symbol,
  asyncFactory: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: asyncFactory,
    inject,
  };
};

// ============================================================================
// NETWORK MODULE CONFIGURATION (9-13)
// ============================================================================

/**
 * Creates static network module with providers and exports.
 *
 * @param {string} moduleName - Module name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {Type<any>} Module class
 *
 * @example
 * ```typescript
 * const NetworkModule = createNetworkModule('PatientNetworkModule', {
 *   isGlobal: true,
 *   providers: [PatientService, PatientRepository],
 *   exports: [PatientService]
 * });
 * ```
 */
export const createNetworkModule = (
  moduleName: string,
  options: NetworkModuleOptions,
): Type<any> => {
  @Module({
    imports: options.imports || [],
    providers: options.providers || [],
    exports: options.exports || [],
    controllers: options.controllers || [],
  })
  class NetworkModule {
    static moduleName = moduleName;
  }

  if (options.isGlobal) {
    Reflect.defineMetadata('__module:global__', true, NetworkModule);
  }

  Object.defineProperty(NetworkModule, 'name', { value: moduleName });

  return NetworkModule;
};

/**
 * Creates dynamic network module with runtime configuration.
 *
 * @param {string} moduleName - Module name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Dynamic module
 *
 * @example
 * ```typescript
 * const module = createDynamicNetworkModule('DynamicPatientModule', {
 *   isGlobal: true,
 *   providers: [
 *     {
 *       provide: 'PATIENT_CONFIG',
 *       useValue: { maxPatients: 1000 }
 *     }
 *   ]
 * });
 * ```
 */
export const createDynamicNetworkModule = (
  moduleName: string,
  options: NetworkModuleOptions,
): DynamicModule => {
  return {
    module: class DynamicNetworkModule {},
    global: options.isGlobal || false,
    imports: options.imports || [],
    providers: options.providers || [],
    exports: options.exports || [],
    controllers: options.controllers || [],
  };
};

/**
 * Registers network module for root application context.
 *
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Root module configuration
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerNetworkModuleForRoot({
 *       isGlobal: true,
 *       providers: [NetworkConfigService]
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export const registerNetworkModuleForRoot = (
  options: NetworkModuleOptions,
): DynamicModule => {
  return {
    module: class NetworkRootModule {},
    global: options.isGlobal !== false,
    imports: options.imports || [],
    providers: options.providers || [],
    exports: options.exports || [],
  };
};

/**
 * Registers network module asynchronously with factory configuration.
 *
 * @param {NetworkModuleAsyncOptions} asyncOptions - Async module options
 * @returns {DynamicModule} Async module configuration
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerNetworkModuleAsync({
 *       imports: [ConfigModule],
 *       useFactory: async (config: ConfigService) => ({
 *         providers: [
 *           {
 *             provide: 'NETWORK_CONFIG',
 *             useValue: await config.getNetworkConfig()
 *           }
 *         ]
 *       }),
 *       inject: [ConfigService]
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export const registerNetworkModuleAsync = (
  asyncOptions: NetworkModuleAsyncOptions,
): DynamicModule => {
  const providers: Provider[] = [];

  if (asyncOptions.useFactory) {
    providers.push({
      provide: 'NETWORK_MODULE_OPTIONS',
      useFactory: asyncOptions.useFactory,
      inject: asyncOptions.inject || [],
    });
  } else if (asyncOptions.useClass) {
    providers.push(
      {
        provide: 'NETWORK_OPTIONS_FACTORY',
        useClass: asyncOptions.useClass,
      },
      {
        provide: 'NETWORK_MODULE_OPTIONS',
        useFactory: async (factory: NetworkOptionsFactory) => {
          return await factory.createNetworkOptions();
        },
        inject: ['NETWORK_OPTIONS_FACTORY'],
      },
    );
  } else if (asyncOptions.useExisting) {
    providers.push({
      provide: 'NETWORK_MODULE_OPTIONS',
      useFactory: async (factory: NetworkOptionsFactory) => {
        return await factory.createNetworkOptions();
      },
      inject: [asyncOptions.useExisting],
    });
  }

  return {
    module: class NetworkAsyncModule {},
    imports: asyncOptions.imports || [],
    providers,
    exports: ['NETWORK_MODULE_OPTIONS'],
  };
};

/**
 * Merges multiple module configurations into a single module.
 *
 * @param {string} moduleName - Merged module name
 * @param {NetworkModuleOptions[]} moduleConfigs - Array of module configurations
 * @returns {DynamicModule} Merged module
 *
 * @example
 * ```typescript
 * const merged = mergeNetworkModuleConfigs('MergedNetworkModule', [
 *   { providers: [ServiceA] },
 *   { providers: [ServiceB], exports: [ServiceB] }
 * ]);
 * ```
 */
export const mergeNetworkModuleConfigs = (
  moduleName: string,
  moduleConfigs: NetworkModuleOptions[],
): DynamicModule => {
  const mergedProviders = moduleConfigs.flatMap(config => config.providers || []);
  const mergedImports = moduleConfigs.flatMap(config => config.imports || []);
  const mergedExports = moduleConfigs.flatMap(config => config.exports || []);
  const mergedControllers = moduleConfigs.flatMap(config => config.controllers || []);
  const isGlobal = moduleConfigs.some(config => config.isGlobal);

  return {
    module: class MergedNetworkModule {},
    global: isGlobal,
    imports: mergedImports,
    providers: mergedProviders,
    exports: mergedExports,
    controllers: mergedControllers,
  };
};

// ============================================================================
// DYNAMIC MODULE REGISTRATION (14-18)
// ============================================================================

/**
 * Registers provider dynamically at runtime.
 *
 * @param {ModuleRef} moduleRef - NestJS module reference
 * @param {Provider} provider - Provider to register
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await registerProviderDynamically(moduleRef, {
 *   provide: 'DYNAMIC_SERVICE',
 *   useClass: DynamicNetworkService
 * });
 * ```
 */
export const registerProviderDynamically = async (
  moduleRef: ModuleRef,
  provider: Provider,
): Promise<void> => {
  // Note: In real implementation, this would use NestJS internal APIs
  // This is a simplified conceptual implementation
  console.log('Registering provider dynamically:', provider);
};

/**
 * Creates conditional provider based on runtime conditions.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} condition - Condition function
 * @param {Provider} trueProvider - Provider if condition is true
 * @param {Provider} falseProvider - Provider if condition is false
 * @returns {Provider} Conditional provider
 *
 * @example
 * ```typescript
 * const provider = createConditionalProvider(
 *   'CACHE_SERVICE',
 *   (config) => config.get('cache.enabled'),
 *   { provide: 'CACHE_SERVICE', useClass: RedisCache },
 *   { provide: 'CACHE_SERVICE', useClass: MemoryCache }
 * );
 * ```
 */
export const createConditionalProvider = (
  token: string | symbol,
  condition: (...args: any[]) => boolean,
  trueProvider: Provider,
  falseProvider: Provider,
): Provider => {
  return {
    provide: token,
    useFactory: (...args: any[]) => {
      if (condition(...args)) {
        return (trueProvider as any).useFactory
          ? (trueProvider as any).useFactory(...args)
          : (trueProvider as any).useClass
          ? new (trueProvider as any).useClass(...args)
          : (trueProvider as any).useValue;
      } else {
        return (falseProvider as any).useFactory
          ? (falseProvider as any).useFactory(...args)
          : (falseProvider as any).useClass
          ? new (falseProvider as any).useClass(...args)
          : (falseProvider as any).useValue;
      }
    },
  };
};

/**
 * Creates lazy provider that initializes on first access.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Lazy factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Lazy provider
 *
 * @example
 * ```typescript
 * const provider = createLazyProvider(
 *   'HEAVY_SERVICE',
 *   (config) => {
 *     console.log('Initializing heavy service...');
 *     return new HeavyNetworkService(config);
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export const createLazyProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  inject: any[] = [],
): Provider => {
  let instance: any = null;
  let initialized = false;

  return {
    provide: token,
    useFactory: (...args: any[]) => {
      if (!initialized) {
        instance = factory(...args);
        initialized = true;
      }
      return instance;
    },
    inject,
  };
};

/**
 * Registers module with feature-specific configuration.
 *
 * @param {string} featureName - Feature name
 * @param {NetworkModuleOptions} options - Module options
 * @returns {DynamicModule} Feature module
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     registerFeatureModule('Patients', {
 *       providers: [PatientService, PatientRepository],
 *       exports: [PatientService]
 *     })
 *   ]
 * })
 * export class PatientModule {}
 * ```
 */
export const registerFeatureModule = (
  featureName: string,
  options: NetworkModuleOptions,
): DynamicModule => {
  return {
    module: class FeatureModule {},
    imports: options.imports || [],
    providers: [
      ...(options.providers || []),
      {
        provide: `${featureName}_FEATURE_CONFIG`,
        useValue: {
          featureName,
          timestamp: new Date(),
        },
      },
    ],
    exports: options.exports || [],
    controllers: options.controllers || [],
  };
};

/**
 * Creates multi-provider for array-based dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {any[]} providers - Array of provider values
 * @returns {Provider[]} Multi-providers
 *
 * @example
 * ```typescript
 * const providers = createMultiProvider('NETWORK_INTERCEPTORS', [
 *   LoggingInterceptor,
 *   CachingInterceptor,
 *   TimeoutInterceptor
 * ]);
 * ```
 */
export const createMultiProvider = (
  token: string | symbol,
  providers: any[],
): Provider[] => {
  return providers.map(provider => ({
    provide: token,
    useClass: provider,
    multi: true,
  }));
};

// ============================================================================
// SERVICE SCOPES (19-23)
// ============================================================================

/**
 * Creates singleton-scoped provider (DEFAULT scope).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonProvider(NetworkConfigService);
 * ```
 */
export const createSingletonProvider = <T>(
  classType: Type<T>,
  token?: string | symbol,
): Provider => {
  return {
    provide: token || classType,
    useClass: classType,
    scope: Scope.DEFAULT,
  };
};

/**
 * Creates request-scoped provider (new instance per request).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Request-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createRequestScopedProvider(RequestContextService, 'REQUEST_CONTEXT');
 * ```
 */
export const createRequestScopedProvider = <T>(
  classType: Type<T>,
  token?: string | symbol,
): Provider => {
  return {
    provide: token || classType,
    useClass: classType,
    scope: Scope.REQUEST,
  };
};

/**
 * Creates transient-scoped provider (new instance per injection).
 *
 * @param {Type<T>} classType - Provider class
 * @param {string | symbol} [token] - Optional injection token
 * @returns {Provider} Transient provider
 *
 * @example
 * ```typescript
 * const provider = createTransientProvider(UniqueIdGenerator);
 * ```
 */
export const createTransientProvider = <T>(
  classType: Type<T>,
  token?: string | symbol,
): Provider => {
  return {
    provide: token || classType,
    useClass: classType,
    scope: Scope.TRANSIENT,
  };
};

/**
 * Creates scope-aware factory provider with custom scope logic.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {Scope} scope - Provider scope
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Scoped factory provider
 *
 * @example
 * ```typescript
 * const provider = createScopedFactoryProvider(
 *   'SCOPED_CACHE',
 *   (request) => new RequestCache(request),
 *   Scope.REQUEST,
 *   [REQUEST]
 * );
 * ```
 */
export const createScopedFactoryProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  scope: Scope,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: factory,
    inject,
    scope,
  };
};

/**
 * Decorates provider with scope metadata for introspection.
 *
 * @param {Provider} provider - Provider to decorate
 * @param {Scope} scope - Provider scope
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Provider} Decorated provider
 *
 * @example
 * ```typescript
 * const provider = decorateProviderWithScope(
 *   { provide: 'SERVICE', useClass: MyService },
 *   Scope.REQUEST,
 *   { description: 'Request-scoped service' }
 * );
 * ```
 */
export const decorateProviderWithScope = (
  provider: Provider,
  scope: Scope,
  metadata?: Record<string, any>,
): Provider => {
  const decoratedProvider = { ...provider, scope };

  if (metadata) {
    Reflect.defineMetadata('provider:metadata', metadata, decoratedProvider);
  }

  return decoratedProvider;
};

// ============================================================================
// NETWORK MIDDLEWARE PROVIDERS (24-27)
// ============================================================================

/**
 * Creates network middleware provider for request/response interception.
 *
 * @param {Type<NestMiddleware>} middlewareClass - Middleware class
 * @param {NetworkMiddlewareConfig} config - Middleware configuration
 * @returns {Provider} Middleware provider
 *
 * @example
 * ```typescript
 * const provider = createNetworkMiddlewareProvider(
 *   NetworkLoggingMiddleware,
 *   {
 *     path: '/api/*',
 *     method: 'ALL',
 *     order: 1
 *   }
 * );
 * ```
 */
export const createNetworkMiddlewareProvider = (
  middlewareClass: Type<NestMiddleware>,
  config: NetworkMiddlewareConfig,
): Provider => {
  return {
    provide: middlewareClass,
    useClass: middlewareClass,
  };
};

/**
 * Creates authentication middleware provider for network requests.
 *
 * @param {Function} validateToken - Token validation function
 * @returns {Type<NestMiddleware>} Auth middleware class
 *
 * @example
 * ```typescript
 * const AuthMiddleware = createAuthMiddleware(async (token) => {
 *   return await jwtService.verify(token);
 * });
 * ```
 */
export const createAuthMiddleware = (
  validateToken: (token: string) => Promise<any>,
): Type<NestMiddleware> => {
  @Injectable()
  class NetworkAuthMiddleware implements NestMiddleware {
    async use(req: any, res: any, next: () => void) {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
        const user = await validateToken(token);
        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
  }

  return NetworkAuthMiddleware;
};

/**
 * Creates rate limiting middleware provider for network traffic control.
 *
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Type<NestMiddleware>} Rate limit middleware class
 *
 * @example
 * ```typescript
 * const RateLimitMiddleware = createRateLimitMiddleware(100, 60000);
 * ```
 */
export const createRateLimitMiddleware = (
  maxRequests: number,
  windowMs: number,
): Type<NestMiddleware> => {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  @Injectable()
  class NetworkRateLimitMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
      const key = req.ip || 'unknown';
      const now = Date.now();
      const record = requestCounts.get(key);

      if (!record || now > record.resetTime) {
        requestCounts.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }

      if (record.count >= maxRequests) {
        return res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
      }

      record.count++;
      next();
    }
  }

  return NetworkRateLimitMiddleware;
};

/**
 * Creates logging middleware provider for network request tracking.
 *
 * @param {Function} logger - Logging function
 * @returns {Type<NestMiddleware>} Logging middleware class
 *
 * @example
 * ```typescript
 * const LoggingMiddleware = createLoggingMiddleware((data) => {
 *   console.log('Network request:', data);
 * });
 * ```
 */
export const createLoggingMiddleware = (
  logger: (data: any) => void,
): Type<NestMiddleware> => {
  @Injectable()
  class NetworkLoggingMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
      const startTime = Date.now();

      logger({
        type: 'request',
        method: req.method,
        url: req.url,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      res.on('finish', () => {
        logger({
          type: 'response',
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString(),
        });
      });

      next();
    }
  }

  return NetworkLoggingMiddleware;
};

// ============================================================================
// NETWORK INTERCEPTOR PROVIDERS (28-31)
// ============================================================================

/**
 * Creates network interceptor provider for request/response transformation.
 *
 * @param {NetworkInterceptorConfig} config - Interceptor configuration
 * @returns {Type<NestInterceptor>} Interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createNetworkInterceptor({
 *   timeout: 5000,
 *   logRequests: true,
 *   transformResponse: true
 * });
 * ```
 */
export const createNetworkInterceptor = (
  config: NetworkInterceptorConfig,
): Type<NestInterceptor> => {
  @Injectable()
  class NetworkInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const startTime = Date.now();

      if (config.logRequests) {
        console.log(`[Network] ${request.method} ${request.url}`);
      }

      let stream = next.handle();

      if (config.timeout) {
        stream = stream.pipe(timeout(config.timeout));
      }

      return stream.pipe(
        tap(data => {
          const duration = Date.now() - startTime;
          if (config.logRequests) {
            console.log(`[Network] Completed in ${duration}ms`);
          }
        }),
        catchError(error => {
          console.error('[Network] Error:', error.message);
          throw error;
        }),
      );
    }
  }

  return NetworkInterceptor;
};

/**
 * Creates caching interceptor provider for network response caching.
 *
 * @param {number} ttl - Cache TTL in milliseconds
 * @param {Function} [keyGenerator] - Cache key generator function
 * @returns {Type<NestInterceptor>} Caching interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createCachingInterceptor(60000, (context) => {
 *   const request = context.switchToHttp().getRequest();
 *   return `${request.method}:${request.url}`;
 * });
 * ```
 */
export const createCachingInterceptor = (
  ttl: number,
  keyGenerator?: (context: ExecutionContext) => string,
): Type<NestInterceptor> => {
  const cache = new Map<string, { data: any; expires: number }>();

  @Injectable()
  class NetworkCachingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const cacheKey = keyGenerator
        ? keyGenerator(context)
        : `${request.method}:${request.url}`;

      // Check cache
      const cached = cache.get(cacheKey);
      if (cached && Date.now() < cached.expires) {
        return new Observable(observer => {
          observer.next(cached.data);
          observer.complete();
        });
      }

      return next.handle().pipe(
        tap(data => {
          cache.set(cacheKey, {
            data,
            expires: Date.now() + ttl,
          });
        }),
      );
    }
  }

  return NetworkCachingInterceptor;
};

/**
 * Creates timeout interceptor provider for network request timeouts.
 *
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Type<NestInterceptor>} Timeout interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createTimeoutInterceptor(5000);
 * ```
 */
export const createTimeoutInterceptor = (timeoutMs: number): Type<NestInterceptor> => {
  @Injectable()
  class NetworkTimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(timeoutMs),
        catchError(error => {
          if (error.name === 'TimeoutError') {
            throw new Error(`Request timeout after ${timeoutMs}ms`);
          }
          throw error;
        }),
      );
    }
  }

  return NetworkTimeoutInterceptor;
};

/**
 * Creates transformation interceptor provider for response data mapping.
 *
 * @param {Function} transformFn - Transformation function
 * @returns {Type<NestInterceptor>} Transform interceptor class
 *
 * @example
 * ```typescript
 * const interceptor = createTransformInterceptor((data) => ({
 *   success: true,
 *   data,
 *   timestamp: new Date().toISOString()
 * }));
 * ```
 */
export const createTransformInterceptor = (
  transformFn: (data: any) => any,
): Type<NestInterceptor> => {
  @Injectable()
  class NetworkTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        tap(data => transformFn(data)),
      );
    }
  }

  return NetworkTransformInterceptor;
};

// ============================================================================
// NETWORK GUARD PROVIDERS (32-35)
// ============================================================================

/**
 * Creates network guard provider for request authorization.
 *
 * @param {NetworkGuardConfig} config - Guard configuration
 * @returns {Type<CanActivate>} Guard class
 *
 * @example
 * ```typescript
 * const guard = createNetworkGuard({
 *   allowAnonymous: false,
 *   requiredRoles: ['admin', 'network_admin'],
 *   checkNetworkAccess: true
 * });
 * ```
 */
export const createNetworkGuard = (config: NetworkGuardConfig): Type<CanActivate> => {
  @Injectable()
  class NetworkGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      if (config.allowAnonymous && !request.user) {
        return true;
      }

      if (!request.user) {
        return false;
      }

      if (config.requiredRoles && config.requiredRoles.length > 0) {
        const hasRole = config.requiredRoles.some(role =>
          request.user.roles?.includes(role),
        );
        if (!hasRole) return false;
      }

      if (config.requiredPermissions && config.requiredPermissions.length > 0) {
        const hasPermission = config.requiredPermissions.every(permission =>
          request.user.permissions?.includes(permission),
        );
        if (!hasPermission) return false;
      }

      return true;
    }
  }

  return NetworkGuard;
};

/**
 * Creates role-based guard provider for network access control.
 *
 * @param {string[]} allowedRoles - Allowed user roles
 * @returns {Type<CanActivate>} Role guard class
 *
 * @example
 * ```typescript
 * const guard = createRoleGuard(['admin', 'network_engineer']);
 * ```
 */
export const createRoleGuard = (allowedRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class NetworkRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      if (!request.user) {
        return false;
      }

      return allowedRoles.some(role => request.user.roles?.includes(role));
    }
  }

  return NetworkRoleGuard;
};

/**
 * Creates IP whitelist guard provider for network access restriction.
 *
 * @param {string[]} allowedIPs - Allowed IP addresses or CIDR ranges
 * @returns {Type<CanActivate>} IP guard class
 *
 * @example
 * ```typescript
 * const guard = createIPWhitelistGuard(['10.0.0.0/8', '192.168.1.100']);
 * ```
 */
export const createIPWhitelistGuard = (allowedIPs: string[]): Type<CanActivate> => {
  @Injectable()
  class NetworkIPGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const clientIP = request.ip || request.connection.remoteAddress;

      // Simplified IP matching (production should use proper CIDR matching)
      return allowedIPs.some(ip => {
        if (ip.includes('/')) {
          // CIDR range - simplified check
          const baseIP = ip.split('/')[0];
          return clientIP?.startsWith(baseIP.split('.').slice(0, 2).join('.'));
        }
        return clientIP === ip;
      });
    }
  }

  return NetworkIPGuard;
};

/**
 * Creates throttle guard provider for request rate limiting.
 *
 * @param {number} limit - Maximum requests
 * @param {number} ttl - Time window in milliseconds
 * @returns {Type<CanActivate>} Throttle guard class
 *
 * @example
 * ```typescript
 * const guard = createThrottleGuard(10, 60000); // 10 requests per minute
 * ```
 */
export const createThrottleGuard = (limit: number, ttl: number): Type<CanActivate> => {
  const tracker = new Map<string, { count: number; resetTime: number }>();

  @Injectable()
  class NetworkThrottleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const key = request.ip || 'unknown';
      const now = Date.now();

      const record = tracker.get(key);

      if (!record || now > record.resetTime) {
        tracker.set(key, { count: 1, resetTime: now + ttl });
        return true;
      }

      if (record.count >= limit) {
        return false;
      }

      record.count++;
      return true;
    }
  }

  return NetworkThrottleGuard;
};

// ============================================================================
// ASYNC NETWORK PROVIDERS (36-40)
// ============================================================================

/**
 * Creates async database connection provider with initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} connectionFactory - Async connection factory
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async database provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncDatabaseProvider(
 *   'DATABASE_CONNECTION',
 *   async (config: ConfigService) => {
 *     const conn = new DatabaseConnection(config.get('db'));
 *     await conn.connect();
 *     return conn;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export const createAsyncDatabaseProvider = (
  token: string | symbol,
  connectionFactory: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: connectionFactory,
    inject,
  };
};

/**
 * Creates async configuration provider with external config loading.
 *
 * @param {string} token - Injection token
 * @param {Function} configLoader - Async config loader function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async config provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncConfigProvider(
 *   'NETWORK_CONFIG',
 *   async (httpClient) => {
 *     const response = await httpClient.get('http://config-server/network');
 *     return response.data;
 *   },
 *   [HttpClient]
 * );
 * ```
 */
export const createAsyncConfigProvider = (
  token: string | symbol,
  configLoader: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: configLoader,
    inject,
  };
};

/**
 * Creates async service discovery provider with registry integration.
 *
 * @param {string} token - Injection token
 * @param {string} serviceName - Service name to discover
 * @param {Function} discoveryClient - Discovery client factory
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async discovery provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncDiscoveryProvider(
 *   'PATIENT_SERVICE',
 *   'patient-api',
 *   async (registry) => {
 *     const instances = await registry.discover('patient-api');
 *     return instances[0]; // Return first healthy instance
 *   },
 *   [ServiceRegistry]
 * );
 * ```
 */
export const createAsyncDiscoveryProvider = (
  token: string | symbol,
  serviceName: string,
  discoveryClient: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: discoveryClient,
    inject,
  };
};

/**
 * Creates async health check provider with dependency validation.
 *
 * @param {string} token - Injection token
 * @param {Function} healthCheckFn - Async health check function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async health check provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncHealthCheckProvider(
 *   'NETWORK_HEALTH',
 *   async (db, cache) => {
 *     await Promise.all([db.ping(), cache.ping()]);
 *     return { status: 'healthy' };
 *   },
 *   [DatabaseConnection, CacheService]
 * );
 * ```
 */
export const createAsyncHealthCheckProvider = (
  token: string | symbol,
  healthCheckFn: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: healthCheckFn,
    inject,
  };
};

/**
 * Creates async migration provider for database schema initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} migrationFn - Async migration function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Async migration provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncMigrationProvider(
 *   'DATABASE_MIGRATIONS',
 *   async (sequelize) => {
 *     await sequelize.sync({ alter: true });
 *     console.log('Database migrations complete');
 *     return { migrated: true };
 *   },
 *   [Sequelize]
 * );
 * ```
 */
export const createAsyncMigrationProvider = (
  token: string | symbol,
  migrationFn: (...args: any[]) => Promise<any>,
  inject: any[] = [],
): Provider => {
  return {
    provide: token,
    useFactory: migrationFn,
    inject,
  };
};

export default {
  // Sequelize Models
  createNetworkModuleConfigModel,
  createProviderRegistryModel,
  createDIEventModel,

  // Custom Network Providers
  createCustomClassProvider,
  createCustomValueProvider,
  createCustomFactoryProvider,
  createAliasedProvider,
  createAsyncProvider,

  // Network Module Configuration
  createNetworkModule,
  createDynamicNetworkModule,
  registerNetworkModuleForRoot,
  registerNetworkModuleAsync,
  mergeNetworkModuleConfigs,

  // Dynamic Module Registration
  registerProviderDynamically,
  createConditionalProvider,
  createLazyProvider,
  registerFeatureModule,
  createMultiProvider,

  // Service Scopes
  createSingletonProvider,
  createRequestScopedProvider,
  createTransientProvider,
  createScopedFactoryProvider,
  decorateProviderWithScope,

  // Network Middleware Providers
  createNetworkMiddlewareProvider,
  createAuthMiddleware,
  createRateLimitMiddleware,
  createLoggingMiddleware,

  // Network Interceptor Providers
  createNetworkInterceptor,
  createCachingInterceptor,
  createTimeoutInterceptor,
  createTransformInterceptor,

  // Network Guard Providers
  createNetworkGuard,
  createRoleGuard,
  createIPWhitelistGuard,
  createThrottleGuard,

  // Async Network Providers
  createAsyncDatabaseProvider,
  createAsyncConfigProvider,
  createAsyncDiscoveryProvider,
  createAsyncHealthCheckProvider,
  createAsyncMigrationProvider,
};
