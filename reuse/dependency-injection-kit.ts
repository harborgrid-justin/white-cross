/**
 * LOC: DINJ1234567
 * File: /reuse/dependency-injection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS modules and providers
 *   - Dynamic module configurations
 *   - Custom provider factories
 */

/**
 * File: /reuse/dependency-injection-kit.ts
 * Locator: WC-UTL-DINJ-001
 * Purpose: NestJS Dependency Injection Utilities - Providers, dynamic modules, injection tokens, scope management
 *
 * NOTE: This kit is specifically for NestJS-based microservices. The main White Cross backend uses Hapi.js,
 * which has a different dependency injection pattern. Use this kit only for NestJS microservices components.
 *
 * Upstream: Independent utility module for NestJS dependency injection patterns
 * Downstream: NestJS microservices modules, providers, dynamic modules, custom factories
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x
 * Exports: 45 utility functions for provider factories, dynamic modules, injection tokens, scope management, circular dependencies
 *
 * LLM Context: Comprehensive dependency injection utilities for implementing production-ready NestJS providers.
 * Provides provider factories, dynamic module builders, async provider helpers, custom injection token creators, scope management,
 * circular dependency resolvers, multi-provider patterns, factory providers, value providers, class provider wrappers,
 * conditional provider registration, and module configuration helpers. Essential for building scalable, maintainable NestJS microservices.
 */

import {
  DynamicModule,
  Provider,
  Type,
  Inject,
  Injectable,
  Scope,
  ModuleMetadata,
  ForwardReference,
  Abstract,
  FactoryProvider,
  ValueProvider,
  ClassProvider,
  ExistingProvider,
} from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProviderConfig {
  provide: any;
  useClass?: Type<any>;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  useExisting?: any;
  inject?: any[];
  scope?: Scope;
}

interface DynamicModuleConfig {
  module: Type<any>;
  providers?: Provider[];
  imports?: any[];
  exports?: any[];
  controllers?: Type<any>[];
  global?: boolean;
}

interface AsyncProviderConfig<T = any> {
  provide: string | symbol | Type<T>;
  useFactory: (...args: any[]) => Promise<T>;
  inject?: any[];
  scope?: Scope;
}

interface ConditionalProviderConfig {
  provide: any;
  condition: () => boolean | Promise<boolean>;
  trueProvider: Provider;
  falseProvider?: Provider;
}

interface MultiProviderConfig {
  provide: any;
  multi: true;
  providers: Array<{
    useClass?: Type<any>;
    useValue?: any;
    useFactory?: (...args: any[]) => any;
    inject?: any[];
  }>;
}

interface ScopedProviderConfig {
  provide: any;
  scope: Scope;
  useClass?: Type<any>;
  useFactory?: (...args: any[]) => any;
  inject?: any[];
}

interface ModuleOptions {
  isGlobal?: boolean;
  imports?: any[];
  controllers?: Type<any>[];
  providers?: Provider[];
  exports?: any[];
}

interface AsyncModuleOptions<T = any> {
  useFactory: (...args: any[]) => Promise<T> | T;
  inject?: any[];
  imports?: any[];
}

interface FactoryProviderOptions<T = any> {
  token: string | symbol | Type<T>;
  factory: (...args: any[]) => T | Promise<T>;
  dependencies?: any[];
  scope?: Scope;
}

interface CircularDependencyResolver {
  token: any;
  forwardRef: () => Type<any>;
}

interface ProviderMetadata {
  token: any;
  type: 'class' | 'value' | 'factory' | 'existing';
  scope?: Scope;
  dependencies?: any[];
}

// ============================================================================
// SECTION 1: PROVIDER FACTORIES (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a class provider with optional scope configuration.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} useClass - Class to instantiate
 * @param {Scope} scope - Provider scope
 * @returns {ClassProvider} Class provider configuration
 *
 * @example
 * ```typescript
 * const userServiceProvider = createClassProvider(
 *   'USER_SERVICE',
 *   UserService,
 *   Scope.REQUEST
 * );
 *
 * @Module({
 *   providers: [userServiceProvider]
 * })
 * export class AppModule {}
 * ```
 */
export const createClassProvider = (
  token: any,
  useClass: Type<any>,
  scope?: Scope,
): ClassProvider => {
  return {
    provide: token,
    useClass,
    ...(scope && { scope }),
  };
};

/**
 * 2. Creates a value provider for constant values or configurations.
 *
 * @param {any} token - Injection token
 * @param {any} value - Value to provide
 * @returns {ValueProvider} Value provider configuration
 *
 * @example
 * ```typescript
 * const configProvider = createValueProvider('APP_CONFIG', {
 *   apiUrl: 'https://api.example.com',
 *   timeout: 5000
 * });
 *
 * @Injectable()
 * class ApiService {
 *   constructor(@Inject('APP_CONFIG') private config: AppConfig) {}
 * }
 * ```
 */
export const createValueProvider = (token: any, value: any): ValueProvider => {
  return {
    provide: token,
    useValue: value,
  };
};

/**
 * 3. Creates a factory provider with dependency injection.
 *
 * @param {FactoryProviderOptions} options - Factory provider options
 * @returns {FactoryProvider} Factory provider configuration
 *
 * @example
 * ```typescript
 * const databaseProvider = createFactoryProvider({
 *   token: 'DATABASE_CONNECTION',
 *   factory: (configService: ConfigService) => {
 *     return new DatabaseConnection({
 *       host: configService.get('DB_HOST'),
 *       port: configService.get('DB_PORT')
 *     });
 *   },
 *   dependencies: [ConfigService],
 *   scope: Scope.DEFAULT
 * });
 * ```
 */
export const createFactoryProvider = <T = any>(
  options: FactoryProviderOptions<T>,
): FactoryProvider<T> => {
  return {
    provide: options.token,
    useFactory: options.factory,
    inject: options.dependencies || [],
    ...(options.scope && { scope: options.scope }),
  };
};

/**
 * 4. Creates an existing (alias) provider that references another provider.
 *
 * @param {any} token - New injection token
 * @param {any} useExisting - Existing token to reference
 * @returns {ExistingProvider} Existing provider configuration
 *
 * @example
 * ```typescript
 * // Create an alias for a service
 * const loggerAlias = createExistingProvider('Logger', WinstonLogger);
 *
 * @Injectable()
 * class MyService {
 *   constructor(@Inject('Logger') private logger: Logger) {
 *     // Receives WinstonLogger instance
 *   }
 * }
 * ```
 */
export const createExistingProvider = (
  token: any,
  useExisting: any,
): ExistingProvider => {
  return {
    provide: token,
    useExisting,
  };
};

/**
 * 5. Creates an async factory provider for asynchronous initialization.
 *
 * @param {AsyncProviderConfig} config - Async provider configuration
 * @returns {FactoryProvider} Async factory provider
 *
 * @example
 * ```typescript
 * const asyncDbProvider = createAsyncFactoryProvider({
 *   provide: 'DATABASE_CONNECTION',
 *   useFactory: async (configService: ConfigService) => {
 *     const connection = new Connection(configService.get('DB_CONFIG'));
 *     await connection.connect();
 *     return connection;
 *   },
 *   inject: [ConfigService]
 * });
 * ```
 */
export const createAsyncFactoryProvider = <T = any>(
  config: AsyncProviderConfig<T>,
): FactoryProvider<Promise<T>> => {
  return {
    provide: config.provide,
    useFactory: config.useFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 6. Creates multiple providers from a configuration object.
 *
 * @param {Record<string, any>} config - Configuration object
 * @returns {Provider[]} Array of value providers
 *
 * @example
 * ```typescript
 * const configProviders = createProvidersFromConfig({
 *   'API_URL': 'https://api.example.com',
 *   'API_TIMEOUT': 5000,
 *   'API_KEY': 'secret-key'
 * });
 *
 * @Module({
 *   providers: [...configProviders]
 * })
 * export class AppModule {}
 * ```
 */
export const createProvidersFromConfig = (
  config: Record<string, any>,
): ValueProvider[] => {
  return Object.entries(config).map(([key, value]) => ({
    provide: key,
    useValue: value,
  }));
};

/**
 * 7. Creates a scoped provider with explicit scope configuration.
 *
 * @param {ScopedProviderConfig} config - Scoped provider configuration
 * @returns {Provider} Scoped provider
 *
 * @example
 * ```typescript
 * const requestScopedProvider = createScopedProvider({
 *   provide: 'REQUEST_CONTEXT',
 *   scope: Scope.REQUEST,
 *   useFactory: (req) => ({ userId: req.user?.id, requestId: req.id }),
 *   inject: [REQUEST]
 * });
 * ```
 */
export const createScopedProvider = (config: ScopedProviderConfig): Provider => {
  if (config.useClass) {
    return {
      provide: config.provide,
      useClass: config.useClass,
      scope: config.scope,
    };
  }

  if (config.useFactory) {
    return {
      provide: config.provide,
      useFactory: config.useFactory,
      inject: config.inject || [],
      scope: config.scope,
    };
  }

  throw new Error('Scoped provider must have either useClass or useFactory');
};

/**
 * 8. Creates a transient provider that creates new instance for each injection.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} useClass - Class to instantiate
 * @returns {ClassProvider} Transient class provider
 *
 * @example
 * ```typescript
 * const transientLogger = createTransientProvider('LOGGER', Logger);
 *
 * @Injectable()
 * class ServiceA {
 *   constructor(@Inject('LOGGER') private logger: Logger) {
 *     // Gets unique Logger instance
 *   }
 * }
 *
 * @Injectable()
 * class ServiceB {
 *   constructor(@Inject('LOGGER') private logger: Logger) {
 *     // Gets different Logger instance than ServiceA
 *   }
 * }
 * ```
 */
export const createTransientProvider = (
  token: any,
  useClass: Type<any>,
): ClassProvider => {
  return {
    provide: token,
    useClass,
    scope: Scope.TRANSIENT,
  };
};

// ============================================================================
// SECTION 2: DYNAMIC MODULE BUILDERS (Functions 9-14)
// ============================================================================

/**
 * 9. Creates a dynamic module with configuration options.
 *
 * @param {DynamicModuleConfig} config - Dynamic module configuration
 * @returns {DynamicModule} Dynamic module
 *
 * @example
 * ```typescript
 * const dynamicModule = createDynamicModule({
 *   module: DatabaseModule,
 *   providers: [DatabaseService],
 *   exports: [DatabaseService],
 *   global: true
 * });
 * ```
 */
export const createDynamicModule = (config: DynamicModuleConfig): DynamicModule => {
  return {
    module: config.module,
    providers: config.providers || [],
    imports: config.imports || [],
    exports: config.exports || [],
    controllers: config.controllers || [],
    global: config.global || false,
  };
};

/**
 * 10. Creates a forRoot pattern for synchronous module configuration.
 *
 * @param {Type<any>} module - Module class
 * @param {any} options - Module options
 * @returns {Function} forRoot factory function
 *
 * @example
 * ```typescript
 * @Module({})
 * export class ConfigModule {
 *   static forRoot = createForRootModule(ConfigModule, {
 *     provide: 'CONFIG_OPTIONS',
 *     useValue: options
 *   });
 * }
 *
 * // Usage
 * @Module({
 *   imports: [ConfigModule.forRoot({ isGlobal: true, ... })]
 * })
 * export class AppModule {}
 * ```
 */
export const createForRootModule = (module: Type<any>, optionsToken: any) => {
  return (options: any): DynamicModule => {
    return {
      module,
      providers: [
        {
          provide: optionsToken,
          useValue: options,
        },
      ],
      exports: [optionsToken],
      global: options.isGlobal || false,
    };
  };
};

/**
 * 11. Creates a forRootAsync pattern for asynchronous module configuration.
 *
 * @param {Type<any>} module - Module class
 * @param {any} optionsToken - Options injection token
 * @returns {Function} forRootAsync factory function
 *
 * @example
 * ```typescript
 * @Module({})
 * export class DatabaseModule {
 *   static forRootAsync = createForRootAsyncModule(DatabaseModule, 'DATABASE_OPTIONS');
 * }
 *
 * // Usage
 * @Module({
 *   imports: [
 *     DatabaseModule.forRootAsync({
 *       useFactory: async (configService: ConfigService) => ({
 *         host: configService.get('DB_HOST'),
 *         port: configService.get('DB_PORT')
 *       }),
 *       inject: [ConfigService]
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export const createForRootAsyncModule = (module: Type<any>, optionsToken: any) => {
  return (options: AsyncModuleOptions): DynamicModule => {
    const providers: Provider[] = [
      {
        provide: optionsToken,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];

    return {
      module,
      imports: options.imports || [],
      providers,
      exports: [optionsToken],
    };
  };
};

/**
 * 12. Creates a forFeature pattern for feature-specific configuration.
 *
 * @param {Type<any>} module - Module class
 * @param {Function} providerFactory - Factory to create feature providers
 * @returns {Function} forFeature factory function
 *
 * @example
 * ```typescript
 * @Module({})
 * export class TypeOrmModule {
 *   static forFeature = createForFeatureModule(
 *     TypeOrmModule,
 *     (entities) => entities.map(entity => createEntityProvider(entity))
 *   );
 * }
 *
 * // Usage
 * @Module({
 *   imports: [TypeOrmModule.forFeature([User, Patient, Appointment])]
 * })
 * export class UsersModule {}
 * ```
 */
export const createForFeatureModule = (
  module: Type<any>,
  providerFactory: (features: any[]) => Provider[],
) => {
  return (features: any[]): DynamicModule => {
    const providers = providerFactory(features);

    return {
      module,
      providers,
      exports: providers,
    };
  };
};

/**
 * 13. Creates a global dynamic module.
 *
 * @param {Type<any>} module - Module class
 * @param {Provider[]} providers - Module providers
 * @param {any[]} exports - Module exports
 * @returns {DynamicModule} Global dynamic module
 *
 * @example
 * ```typescript
 * const globalCacheModule = createGlobalModule(
 *   CacheModule,
 *   [CacheService, CacheInterceptor],
 *   [CacheService]
 * );
 *
 * @Module({
 *   imports: [globalCacheModule]
 * })
 * export class AppModule {}
 * ```
 */
export const createGlobalModule = (
  module: Type<any>,
  providers: Provider[] = [],
  exports: any[] = [],
): DynamicModule => {
  return {
    module,
    global: true,
    providers,
    exports,
  };
};

/**
 * 14. Creates a conditional dynamic module based on environment.
 *
 * @param {Type<any>} module - Module class
 * @param {Function} condition - Condition function
 * @param {DynamicModule} trueModule - Module when condition is true
 * @param {DynamicModule} falseModule - Module when condition is false
 * @returns {DynamicModule} Conditional module
 *
 * @example
 * ```typescript
 * const conditionalModule = createConditionalModule(
 *   LoggerModule,
 *   () => process.env.NODE_ENV === 'production',
 *   ProductionLoggerModule.forRoot(),
 *   DevelopmentLoggerModule.forRoot()
 * );
 * ```
 */
export const createConditionalModule = (
  module: Type<any>,
  condition: () => boolean,
  trueModule: Partial<DynamicModule>,
  falseModule?: Partial<DynamicModule>,
): DynamicModule => {
  const selected = condition() ? trueModule : (falseModule || {});

  return {
    module,
    providers: selected.providers || [],
    imports: selected.imports || [],
    exports: selected.exports || [],
    controllers: selected.controllers || [],
    global: selected.global || false,
  };
};

// ============================================================================
// SECTION 3: ASYNC PROVIDER HELPERS (Functions 15-20)
// ============================================================================

/**
 * 15. Creates an async provider with retry logic.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {object} retryOptions - Retry options
 * @returns {FactoryProvider} Async provider with retry
 *
 * @example
 * ```typescript
 * const dbProvider = createAsyncProviderWithRetry(
 *   {
 *     provide: 'DATABASE',
 *     useFactory: async (config) => await connectToDatabase(config),
 *     inject: [ConfigService]
 *   },
 *   { maxRetries: 3, delayMs: 1000 }
 * );
 * ```
 */
export const createAsyncProviderWithRetry = <T = any>(
  config: AsyncProviderConfig<T>,
  retryOptions: { maxRetries?: number; delayMs?: number } = {},
): FactoryProvider => {
  const { maxRetries = 3, delayMs = 1000 } = retryOptions;

  const retryFactory = async (...args: any[]): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await config.useFactory(...args);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw new Error(
      `Failed to initialize provider after ${maxRetries} attempts: ${lastError?.message}`,
    );
  };

  return {
    provide: config.provide,
    useFactory: retryFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 16. Creates an async provider with timeout.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {FactoryProvider} Async provider with timeout
 *
 * @example
 * ```typescript
 * const apiProvider = createAsyncProviderWithTimeout(
 *   {
 *     provide: 'EXTERNAL_API',
 *     useFactory: async (http) => await initializeApi(http),
 *     inject: [HttpService]
 *   },
 *   5000
 * );
 * ```
 */
export const createAsyncProviderWithTimeout = <T = any>(
  config: AsyncProviderConfig<T>,
  timeoutMs: number,
): FactoryProvider => {
  const timeoutFactory = async (...args: any[]): Promise<T> => {
    return Promise.race([
      config.useFactory(...args),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Provider initialization timeout after ${timeoutMs}ms`)),
          timeoutMs,
        ),
      ),
    ]);
  };

  return {
    provide: config.provide,
    useFactory: timeoutFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 17. Creates an async provider with fallback value on error.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {any} fallbackValue - Fallback value
 * @returns {FactoryProvider} Async provider with fallback
 *
 * @example
 * ```typescript
 * const featureFlagsProvider = createAsyncProviderWithFallback(
 *   {
 *     provide: 'FEATURE_FLAGS',
 *     useFactory: async (http) => await fetchFeatureFlags(http),
 *     inject: [HttpService]
 *   },
 *   { enableBetaFeatures: false, enableAdvancedReporting: false }
 * );
 * ```
 */
export const createAsyncProviderWithFallback = <T = any>(
  config: AsyncProviderConfig<T>,
  fallbackValue: T,
): FactoryProvider => {
  const fallbackFactory = async (...args: any[]): Promise<T> => {
    try {
      return await config.useFactory(...args);
    } catch (error) {
      console.warn(
        `Failed to initialize provider, using fallback: ${(error as Error).message}`,
      );
      return fallbackValue;
    }
  };

  return {
    provide: config.provide,
    useFactory: fallbackFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 18. Creates an async provider with initialization callback.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {Function} onInit - Callback after initialization
 * @returns {FactoryProvider} Async provider with callback
 *
 * @example
 * ```typescript
 * const dbProvider = createAsyncProviderWithCallback(
 *   {
 *     provide: 'DATABASE',
 *     useFactory: async (config) => await createConnection(config),
 *     inject: [ConfigService]
 *   },
 *   (connection) => console.log('Database connected:', connection.isConnected)
 * );
 * ```
 */
export const createAsyncProviderWithCallback = <T = any>(
  config: AsyncProviderConfig<T>,
  onInit: (value: T) => void | Promise<void>,
): FactoryProvider => {
  const callbackFactory = async (...args: any[]): Promise<T> => {
    const value = await config.useFactory(...args);
    await onInit(value);
    return value;
  };

  return {
    provide: config.provide,
    useFactory: callbackFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 19. Creates an async provider with validation.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {Function} validator - Validation function
 * @returns {FactoryProvider} Async provider with validation
 *
 * @example
 * ```typescript
 * const configProvider = createAsyncProviderWithValidation(
 *   {
 *     provide: 'APP_CONFIG',
 *     useFactory: async (env) => await loadConfig(env),
 *     inject: [EnvironmentService]
 *   },
 *   (config) => {
 *     if (!config.apiUrl) throw new Error('apiUrl is required');
 *     if (!config.apiKey) throw new Error('apiKey is required');
 *     return true;
 *   }
 * );
 * ```
 */
export const createAsyncProviderWithValidation = <T = any>(
  config: AsyncProviderConfig<T>,
  validator: (value: T) => boolean | Promise<boolean>,
): FactoryProvider => {
  const validationFactory = async (...args: any[]): Promise<T> => {
    const value = await config.useFactory(...args);
    const isValid = await validator(value);

    if (!isValid) {
      throw new Error('Provider value validation failed');
    }

    return value;
  };

  return {
    provide: config.provide,
    useFactory: validationFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

/**
 * 20. Creates an async provider with caching.
 *
 * @param {AsyncProviderConfig} config - Async provider config
 * @param {number} cacheTtl - Cache TTL in milliseconds
 * @returns {FactoryProvider} Async provider with caching
 *
 * @example
 * ```typescript
 * const heavyResourceProvider = createAsyncProviderWithCache(
 *   {
 *     provide: 'HEAVY_RESOURCE',
 *     useFactory: async (loader) => await loadHeavyResource(loader),
 *     inject: [ResourceLoader]
 *   },
 *   60000 // 1 minute cache
 * );
 * ```
 */
export const createAsyncProviderWithCache = <T = any>(
  config: AsyncProviderConfig<T>,
  cacheTtl: number,
): FactoryProvider => {
  let cachedValue: T | null = null;
  let cacheExpiry = 0;

  const cacheFactory = async (...args: any[]): Promise<T> => {
    const now = Date.now();

    if (cachedValue && now < cacheExpiry) {
      return cachedValue;
    }

    cachedValue = await config.useFactory(...args);
    cacheExpiry = now + cacheTtl;

    return cachedValue;
  };

  return {
    provide: config.provide,
    useFactory: cacheFactory,
    inject: config.inject || [],
    ...(config.scope && { scope: config.scope }),
  };
};

// ============================================================================
// SECTION 4: CUSTOM INJECTION TOKEN CREATORS (Functions 21-26)
// ============================================================================

/**
 * 21. Creates a unique string injection token with namespace.
 *
 * @param {string} namespace - Token namespace
 * @param {string} name - Token name
 * @returns {string} Namespaced injection token
 *
 * @example
 * ```typescript
 * const USER_REPOSITORY = createInjectionToken('REPOSITORIES', 'USER');
 * // Result: 'REPOSITORIES:USER'
 *
 * @Injectable()
 * class UserService {
 *   constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}
 * }
 * ```
 */
export const createInjectionToken = (namespace: string, name: string): string => {
  return `${namespace}:${name}`;
};

/**
 * 22. Creates a symbol injection token for unique identification.
 *
 * @param {string} description - Symbol description
 * @returns {symbol} Symbol injection token
 *
 * @example
 * ```typescript
 * const DATABASE_CONNECTION = createSymbolToken('DatabaseConnection');
 *
 * @Injectable()
 * class DatabaseService {
 *   constructor(@Inject(DATABASE_CONNECTION) private connection: Connection) {}
 * }
 * ```
 */
export const createSymbolToken = (description: string): symbol => {
  return Symbol(description);
};

/**
 * 23. Creates a typed injection token with type safety.
 *
 * @param {string} token - Token identifier
 * @returns {object} Typed injection token
 *
 * @example
 * ```typescript
 * interface DatabaseConfig {
 *   host: string;
 *   port: number;
 * }
 *
 * const DATABASE_CONFIG = createTypedToken<DatabaseConfig>('DATABASE_CONFIG');
 *
 * @Injectable()
 * class DatabaseService {
 *   constructor(@Inject(DATABASE_CONFIG.token) private config: DatabaseConfig) {}
 * }
 * ```
 */
export const createTypedToken = <T>(token: string) => {
  return {
    token,
    type: null as unknown as T,
  };
};

/**
 * 24. Creates multiple related injection tokens from a configuration.
 *
 * @param {string} namespace - Namespace for tokens
 * @param {string[]} names - Token names
 * @returns {Record<string, string>} Map of token names to tokens
 *
 * @example
 * ```typescript
 * const TOKENS = createInjectionTokens('SERVICES', ['USER', 'PATIENT', 'APPOINTMENT']);
 * // Result: {
 * //   USER: 'SERVICES:USER',
 * //   PATIENT: 'SERVICES:PATIENT',
 * //   APPOINTMENT: 'SERVICES:APPOINTMENT'
 * // }
 *
 * @Injectable()
 * class AppService {
 *   constructor(
 *     @Inject(TOKENS.USER) private userService,
 *     @Inject(TOKENS.PATIENT) private patientService
 *   ) {}
 * }
 * ```
 */
export const createInjectionTokens = (
  namespace: string,
  names: string[],
): Record<string, string> => {
  return names.reduce((tokens, name) => {
    tokens[name] = createInjectionToken(namespace, name);
    return tokens;
  }, {} as Record<string, string>);
};

/**
 * 25. Creates an injection token with default value.
 *
 * @param {string} token - Token identifier
 * @param {any} defaultValue - Default value
 * @returns {object} Token with default value
 *
 * @example
 * ```typescript
 * const CONFIG_TOKEN = createTokenWithDefault('CONFIG', {
 *   timeout: 5000,
 *   retries: 3
 * });
 *
 * @Module({
 *   providers: [
 *     { provide: CONFIG_TOKEN.token, useValue: CONFIG_TOKEN.defaultValue }
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export const createTokenWithDefault = <T>(token: string, defaultValue: T) => {
  return {
    token,
    defaultValue,
  };
};

/**
 * 26. Creates environment-specific injection tokens.
 *
 * @param {string} baseToken - Base token name
 * @param {string} environment - Environment name
 * @returns {string} Environment-specific token
 *
 * @example
 * ```typescript
 * const API_URL = createEnvironmentToken('API_URL', process.env.NODE_ENV);
 * // Development: 'API_URL:development'
 * // Production: 'API_URL:production'
 *
 * @Module({
 *   providers: [
 *     {
 *       provide: API_URL,
 *       useValue: process.env.NODE_ENV === 'production'
 *         ? 'https://api.example.com'
 *         : 'http://localhost:3000'
 *     }
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export const createEnvironmentToken = (baseToken: string, environment: string): string => {
  return `${baseToken}:${environment}`;
};

// ============================================================================
// SECTION 5: SCOPE MANAGEMENT UTILITIES (Functions 27-32)
// ============================================================================

/**
 * 27. Creates a request-scoped provider.
 *
 * @param {any} token - Injection token
 * @param {Type<any> | Function} provider - Provider class or factory
 * @param {any[]} inject - Dependencies
 * @returns {Provider} Request-scoped provider
 *
 * @example
 * ```typescript
 * const requestContext = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   (req) => ({
 *     userId: req.user?.id,
 *     requestId: req.id,
 *     timestamp: Date.now()
 *   }),
 *   [REQUEST]
 * );
 * ```
 */
export const createRequestScopedProvider = (
  token: any,
  provider: Type<any> | ((...args: any[]) => any),
  inject?: any[],
): Provider => {
  if (typeof provider === 'function' && !provider.prototype) {
    // Factory function
    return {
      provide: token,
      useFactory: provider,
      inject: inject || [],
      scope: Scope.REQUEST,
    };
  }

  // Class provider
  return {
    provide: token,
    useClass: provider as Type<any>,
    scope: Scope.REQUEST,
  };
};

/**
 * 28. Creates a provider that switches between singleton and request scope.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} useClass - Provider class
 * @param {Function} condition - Condition to determine scope
 * @returns {Provider} Dynamic scoped provider
 *
 * @example
 * ```typescript
 * const dynamicLogger = createDynamicScopeProvider(
 *   'LOGGER',
 *   Logger,
 *   () => process.env.LOG_SCOPE === 'request'
 * );
 * ```
 */
export const createDynamicScopeProvider = (
  token: any,
  useClass: Type<any>,
  condition: () => boolean,
): Provider => {
  const scope = condition() ? Scope.REQUEST : Scope.DEFAULT;

  return {
    provide: token,
    useClass,
    scope,
  };
};

/**
 * 29. Converts a singleton provider to request-scoped.
 *
 * @param {Provider} provider - Singleton provider
 * @returns {Provider} Request-scoped version
 *
 * @example
 * ```typescript
 * const singletonService = { provide: MyService, useClass: MyService };
 * const requestService = convertToRequestScoped(singletonService);
 * ```
 */
export const convertToRequestScoped = (provider: Provider): Provider => {
  return {
    ...provider,
    scope: Scope.REQUEST,
  };
};

/**
 * 30. Creates a scope hierarchy for nested providers.
 *
 * @param {Provider[]} providers - Array of providers
 * @param {Scope} scope - Target scope
 * @returns {Provider[]} Providers with applied scope
 *
 * @example
 * ```typescript
 * const requestProviders = applyScopeToProviders(
 *   [UserService, PatientService, AppointmentService],
 *   Scope.REQUEST
 * );
 * ```
 */
export const applyScopeToProviders = (
  providers: Provider[],
  scope: Scope,
): Provider[] => {
  return providers.map((provider) => ({
    ...provider,
    scope,
  }));
};

/**
 * 31. Creates a provider with automatic scope detection.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} useClass - Provider class
 * @returns {Provider} Provider with detected scope
 *
 * @example
 * ```typescript
 * @Injectable({ scope: Scope.REQUEST })
 * class RequestScopedService {}
 *
 * const provider = createAutoScopedProvider('SERVICE', RequestScopedService);
 * // Automatically detects and applies Scope.REQUEST
 * ```
 */
export const createAutoScopedProvider = (token: any, useClass: Type<any>): Provider => {
  // In a real implementation, this would inspect the class metadata
  // For now, we'll default to DEFAULT scope
  const metadata = Reflect.getMetadata('scope', useClass);
  const scope = metadata || Scope.DEFAULT;

  return {
    provide: token,
    useClass,
    scope,
  };
};

/**
 * 32. Creates a provider that inherits scope from parent.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} useClass - Provider class
 * @param {any} parentToken - Parent provider token
 * @returns {Provider} Provider inheriting parent scope
 *
 * @example
 * ```typescript
 * const childProvider = createInheritScopeProvider(
 *   'CHILD_SERVICE',
 *   ChildService,
 *   'PARENT_SERVICE'
 * );
 * ```
 */
export const createInheritScopeProvider = (
  token: any,
  useClass: Type<any>,
  parentToken: any,
): Provider => {
  // In production, this would query the parent's scope
  // For now, return a factory that gets the parent
  return {
    provide: token,
    useFactory: (parent: any) => new useClass(parent),
    inject: [parentToken],
  };
};

// ============================================================================
// SECTION 6: CIRCULAR DEPENDENCY RESOLVERS (Functions 33-37)
// ============================================================================

/**
 * 33. Creates a forward reference resolver for circular dependencies.
 *
 * @param {Function} forwardRef - Forward reference function
 * @returns {CircularDependencyResolver} Resolver configuration
 *
 * @example
 * ```typescript
 * @Injectable()
 * class ServiceA {
 *   constructor(@Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB) {}
 * }
 *
 * @Injectable()
 * class ServiceB {
 *   constructor(@Inject(forwardRef(() => ServiceA)) private serviceA: ServiceA) {}
 * }
 *
 * const resolver = createForwardRefResolver(() => ServiceB);
 * ```
 */
export const createForwardRefResolver = (
  forwardRef: () => Type<any>,
): CircularDependencyResolver => {
  const token = Symbol('ForwardRef');

  return {
    token,
    forwardRef,
  };
};

/**
 * 34. Creates a lazy-loaded provider to break circular dependencies.
 *
 * @param {any} token - Injection token
 * @param {Function} factory - Lazy factory function
 * @param {any[]} inject - Dependencies
 * @returns {FactoryProvider} Lazy provider
 *
 * @example
 * ```typescript
 * const lazyService = createLazyProvider(
 *   'LAZY_SERVICE',
 *   (injector) => () => injector.get(HeavyService),
 *   [ModuleRef]
 * );
 *
 * @Injectable()
 * class MyService {
 *   constructor(@Inject('LAZY_SERVICE') private getLazyService: () => HeavyService) {}
 *
 *   doSomething() {
 *     const service = this.getLazyService();
 *     service.execute();
 *   }
 * }
 * ```
 */
export const createLazyProvider = (
  token: any,
  factory: (...args: any[]) => () => any,
  inject: any[] = [],
): FactoryProvider => {
  return {
    provide: token,
    useFactory: factory,
    inject,
  };
};

/**
 * 35. Creates a provider that uses ModuleRef to resolve circular deps.
 *
 * @param {any} token - Injection token
 * @param {Type<any>} targetClass - Target class to resolve
 * @returns {FactoryProvider} ModuleRef-based provider
 *
 * @example
 * ```typescript
 * const circularProvider = createModuleRefProvider('CIRCULAR_SERVICE', CircularService);
 *
 * @Injectable()
 * class MyService {
 *   constructor(@Inject('CIRCULAR_SERVICE') private service: CircularService) {}
 * }
 * ```
 */
export const createModuleRefProvider = (
  token: any,
  targetClass: Type<any>,
): FactoryProvider => {
  return {
    provide: token,
    useFactory: (moduleRef: any) => moduleRef.get(targetClass, { strict: false }),
    inject: ['ModuleRef'],
  };
};

/**
 * 36. Detects circular dependencies in provider configuration.
 *
 * @param {Provider[]} providers - Array of providers
 * @returns {object} Circular dependency report
 *
 * @example
 * ```typescript
 * const report = detectCircularDependencies([
 *   { provide: ServiceA, useClass: ServiceA, inject: [ServiceB] },
 *   { provide: ServiceB, useClass: ServiceB, inject: [ServiceA] }
 * ]);
 * // Result: { hasCircular: true, cycles: [['ServiceA', 'ServiceB', 'ServiceA']] }
 * ```
 */
export const detectCircularDependencies = (
  providers: Provider[],
): { hasCircular: boolean; cycles: string[][] } => {
  const dependencyGraph = new Map<any, any[]>();
  const cycles: string[][] = [];

  // Build dependency graph
  providers.forEach((provider: any) => {
    const token = provider.provide;
    const dependencies = provider.inject || [];
    dependencyGraph.set(token, dependencies);
  });

  // Detect cycles using DFS
  const visited = new Set<any>();
  const recursionStack = new Set<any>();

  const detectCycle = (token: any, path: any[]): boolean => {
    visited.add(token);
    recursionStack.add(token);
    path.push(token);

    const dependencies = dependencyGraph.get(token) || [];

    for (const dep of dependencies) {
      if (!visited.has(dep)) {
        if (detectCycle(dep, [...path])) {
          return true;
        }
      } else if (recursionStack.has(dep)) {
        cycles.push([...path, dep]);
        return true;
      }
    }

    recursionStack.delete(token);
    return false;
  };

  dependencyGraph.forEach((_, token) => {
    if (!visited.has(token)) {
      detectCycle(token, []);
    }
  });

  return {
    hasCircular: cycles.length > 0,
    cycles,
  };
};

/**
 * 37. Creates a proxy provider to defer circular dependency resolution.
 *
 * @param {any} token - Injection token
 * @param {Function} resolver - Resolution function
 * @returns {FactoryProvider} Proxy provider
 *
 * @example
 * ```typescript
 * const proxyProvider = createProxyProvider(
 *   'DEFERRED_SERVICE',
 *   (moduleRef) => new Proxy({}, {
 *     get: (target, prop) => moduleRef.get(DeferredService)[prop]
 *   })
 * );
 * ```
 */
export const createProxyProvider = (
  token: any,
  resolver: (...args: any[]) => any,
  inject: any[] = [],
): FactoryProvider => {
  return {
    provide: token,
    useFactory: (...args: any[]) => {
      let instance: any = null;

      return new Proxy(
        {},
        {
          get: (target, prop) => {
            if (!instance) {
              instance = resolver(...args);
            }
            return instance[prop];
          },
        },
      );
    },
    inject,
  };
};

// ============================================================================
// SECTION 7: MULTI-PROVIDER PATTERNS (Functions 38-41)
// ============================================================================

/**
 * 38. Creates a multi-provider for aggregating multiple implementations.
 *
 * @param {any} token - Injection token
 * @param {any[]} providers - Array of provider values
 * @returns {Provider[]} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const VALIDATORS = createMultiProvider('VALIDATORS', [
 *   EmailValidator,
 *   PhoneValidator,
 *   DateValidator
 * ]);
 *
 * @Injectable()
 * class ValidationService {
 *   constructor(@Inject('VALIDATORS') private validators: Validator[]) {}
 *
 *   validateAll(value: any) {
 *     return this.validators.every(v => v.validate(value));
 *   }
 * }
 * ```
 */
export const createMultiProvider = (token: any, providers: any[]): Provider[] => {
  return providers.map((provider, index) => ({
    provide: token,
    useClass: provider,
    multi: true,
  }));
};

/**
 * 39. Creates a multi-provider with factory functions.
 *
 * @param {any} token - Injection token
 * @param {Function[]} factories - Factory functions
 * @returns {Provider[]} Multi-provider factories
 *
 * @example
 * ```typescript
 * const INTERCEPTORS = createMultiProviderFactory('HTTP_INTERCEPTORS', [
 *   (logger) => new LoggingInterceptor(logger),
 *   (cache) => new CacheInterceptor(cache),
 *   (auth) => new AuthInterceptor(auth)
 * ]);
 * ```
 */
export const createMultiProviderFactory = (
  token: any,
  factories: Array<{ factory: (...args: any[]) => any; inject?: any[] }>,
): Provider[] => {
  return factories.map((config) => ({
    provide: token,
    useFactory: config.factory,
    inject: config.inject || [],
    multi: true,
  }));
};

/**
 * 40. Merges multiple multi-providers into single token.
 *
 * @param {any} token - Injection token
 * @param {Provider[][]} providerGroups - Groups of providers
 * @returns {Provider[]} Merged multi-providers
 *
 * @example
 * ```typescript
 * const allGuards = mergeMultiProviders('GUARDS', [
 *   authGuards,
 *   roleGuards,
 *   permissionGuards
 * ]);
 * ```
 */
export const mergeMultiProviders = (
  token: any,
  providerGroups: Provider[][],
): Provider[] => {
  return providerGroups.flat().map((provider) => ({
    ...provider,
    provide: token,
    multi: true,
  }));
};

/**
 * 41. Creates conditional multi-provider based on feature flags.
 *
 * @param {any} token - Injection token
 * @param {object[]} conditionalProviders - Providers with conditions
 * @returns {Provider[]} Conditional multi-providers
 *
 * @example
 * ```typescript
 * const plugins = createConditionalMultiProvider('PLUGINS', [
 *   { provider: AnalyticsPlugin, condition: () => env.ENABLE_ANALYTICS },
 *   { provider: MonitoringPlugin, condition: () => env.ENABLE_MONITORING }
 * ]);
 * ```
 */
export const createConditionalMultiProvider = (
  token: any,
  conditionalProviders: Array<{
    provider: Type<any> | any;
    condition: () => boolean;
  }>,
): Provider[] => {
  return conditionalProviders
    .filter((cp) => cp.condition())
    .map((cp) => ({
      provide: token,
      useClass: typeof cp.provider === 'function' ? cp.provider : undefined,
      useValue: typeof cp.provider !== 'function' ? cp.provider : undefined,
      multi: true,
    }));
};

// ============================================================================
// SECTION 8: MODULE CONFIGURATION HELPERS (Functions 42-45)
// ============================================================================

/**
 * 42. Creates a module configuration with environment-based settings.
 *
 * @param {Type<any>} module - Module class
 * @param {object} configs - Environment-specific configs
 * @returns {DynamicModule} Configured module
 *
 * @example
 * ```typescript
 * const dbModule = createEnvironmentModule(DatabaseModule, {
 *   development: { host: 'localhost', port: 5432 },
 *   production: { host: 'db.example.com', port: 5432, ssl: true }
 * });
 * ```
 */
export const createEnvironmentModule = (
  module: Type<any>,
  configs: Record<string, any>,
): DynamicModule => {
  const env = process.env.NODE_ENV || 'development';
  const config = configs[env] || configs['development'];

  return {
    module,
    providers: [
      {
        provide: 'MODULE_CONFIG',
        useValue: config,
      },
    ],
    exports: ['MODULE_CONFIG'],
  };
};

/**
 * 43. Creates a module with feature toggles.
 *
 * @param {Type<any>} module - Module class
 * @param {object} features - Feature toggle configuration
 * @returns {DynamicModule} Module with feature toggles
 *
 * @example
 * ```typescript
 * const appModule = createFeatureToggleModule(AppModule, {
 *   enableCaching: true,
 *   enableMetrics: process.env.NODE_ENV === 'production',
 *   enableDebugLogging: process.env.NODE_ENV === 'development'
 * });
 * ```
 */
export const createFeatureToggleModule = (
  module: Type<any>,
  features: Record<string, boolean>,
): DynamicModule => {
  const enabledFeatures = Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name);

  return {
    module,
    providers: [
      {
        provide: 'FEATURE_FLAGS',
        useValue: {
          ...features,
          enabled: enabledFeatures,
          isEnabled: (feature: string) => features[feature] === true,
        },
      },
    ],
    exports: ['FEATURE_FLAGS'],
  };
};

/**
 * 44. Merges multiple module configurations.
 *
 * @param {Type<any>} module - Module class
 * @param {Partial<DynamicModule>[]} configs - Module configs to merge
 * @returns {DynamicModule} Merged module configuration
 *
 * @example
 * ```typescript
 * const mergedModule = mergeModuleConfigs(AppModule, [
 *   { providers: [ServiceA, ServiceB] },
 *   { imports: [ConfigModule] },
 *   { exports: [ServiceA] }
 * ]);
 * ```
 */
export const mergeModuleConfigs = (
  module: Type<any>,
  configs: Partial<DynamicModule>[],
): DynamicModule => {
  const merged: DynamicModule = {
    module,
    providers: [],
    imports: [],
    exports: [],
    controllers: [],
  };

  configs.forEach((config) => {
    if (config.providers) merged.providers!.push(...config.providers);
    if (config.imports) merged.imports!.push(...config.imports);
    if (config.exports) merged.exports!.push(...config.exports);
    if (config.controllers) merged.controllers!.push(...config.controllers);
    if (config.global !== undefined) merged.global = config.global;
  });

  return merged;
};

/**
 * 45. Creates a module with dependency validation.
 *
 * @param {Type<any>} module - Module class
 * @param {Provider[]} providers - Module providers
 * @param {object} options - Validation options
 * @returns {DynamicModule} Validated module
 *
 * @example
 * ```typescript
 * const validatedModule = createValidatedModule(
 *   AppModule,
 *   [DatabaseService, CacheService],
 *   {
 *     requiredDependencies: ['DATABASE_CONFIG', 'CACHE_CONFIG'],
 *     validateOnInit: true
 *   }
 * );
 * ```
 */
export const createValidatedModule = (
  module: Type<any>,
  providers: Provider[],
  options: {
    requiredDependencies?: any[];
    validateOnInit?: boolean;
    throwOnMissing?: boolean;
  } = {},
): DynamicModule => {
  const validationProvider: Provider = {
    provide: 'MODULE_VALIDATOR',
    useFactory: (...deps: any[]) => {
      if (options.validateOnInit) {
        const missingDeps = (options.requiredDependencies || []).filter(
          (_, index) => deps[index] === undefined || deps[index] === null,
        );

        if (missingDeps.length > 0 && options.throwOnMissing) {
          throw new Error(
            `Missing required dependencies: ${missingDeps.join(', ')}`,
          );
        }

        return {
          validated: true,
          missingDependencies: missingDeps,
        };
      }

      return { validated: false };
    },
    inject: options.requiredDependencies || [],
  };

  return {
    module,
    providers: [...providers, validationProvider],
    exports: providers.map((p: any) => p.provide || p),
  };
};
