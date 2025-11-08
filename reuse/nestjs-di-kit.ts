/**
 * LOC: NEST-DI-001
 * File: /reuse/nestjs-di-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *
 * DOWNSTREAM (imported by):
 *   - Backend modules
 *   - Custom provider implementations
 *   - Dynamic module factories
 */

/**
 * File: /reuse/nestjs-di-kit.ts
 * Locator: WC-UTL-NESTDI-001
 * Purpose: NestJS Dependency Injection - Comprehensive DI utilities and provider helpers
 *
 * Upstream: @nestjs/common, @nestjs/core
 * Downstream: ../backend/*, module configurations, provider factories
 * Dependencies: NestJS 10.x, TypeScript 5.x, Reflect-metadata
 * Exports: 45 utility functions for DI patterns, custom providers, dynamic modules, injection tokens
 *
 * LLM Context: Comprehensive NestJS dependency injection utilities for White Cross healthcare system.
 * Provides injection token generators, custom provider factories, dynamic module builders,
 * circular dependency resolvers, optional dependency handlers, multi-provider patterns, and
 * scope management. Essential for maintainable and testable application architecture.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProviderConfig {
  provide: string | symbol | any;
  useClass?: any;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  useExisting?: any;
  inject?: any[];
  scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
}

interface DynamicModuleConfig {
  module: any;
  providers?: any[];
  imports?: any[];
  exports?: any[];
  controllers?: any[];
  global?: boolean;
}

interface ModuleOptions {
  isGlobal?: boolean;
  providers?: any[];
  imports?: any[];
  exports?: any[];
  controllers?: any[];
}

interface ForwardRefConfig {
  type: any;
  forwardRef: () => any;
}

interface OptionalDependencyConfig {
  token: string | symbol;
  defaultValue?: any;
  required?: boolean;
}

interface MultiProviderConfig {
  provide: string | symbol;
  useClass?: any;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  multi?: boolean;
  inject?: any[];
}

interface CircularRefResolution {
  token: string | symbol;
  resolver: () => any;
}

interface ScopedProviderConfig {
  provide: string | symbol;
  scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
  useClass?: any;
  useFactory?: (...args: any[]) => any;
}

// ============================================================================
// INJECTION TOKEN UTILITIES
// ============================================================================

/**
 * Creates a unique injection token with optional namespace.
 *
 * @param {string} name - Token name
 * @param {string} [namespace] - Optional namespace for organization
 * @returns {symbol} Unique injection token
 *
 * @example
 * ```typescript
 * const DB_CONNECTION = createInjectionToken('DATABASE_CONNECTION', 'database');
 * const CACHE_SERVICE = createInjectionToken('CACHE_SERVICE', 'cache');
 * ```
 */
export const createInjectionToken = (name: string, namespace?: string): symbol => {
  const fullName = namespace ? `${namespace}:${name}` : name;
  return Symbol.for(fullName);
};

/**
 * Creates a string-based injection token for external configuration.
 *
 * @param {string} name - Token name
 * @returns {string} String injection token
 *
 * @example
 * ```typescript
 * const API_KEY = createStringToken('API_KEY');
 * const DB_HOST = createStringToken('DATABASE_HOST');
 * ```
 */
export const createStringToken = (name: string): string => {
  return `__${name.toUpperCase()}__`;
};

/**
 * Creates a typed injection token for better type safety.
 *
 * @param {string} name - Token name
 * @returns {Object} Typed token with metadata
 *
 * @example
 * ```typescript
 * const LOGGER_TOKEN = createTypedToken<Logger>('LOGGER');
 * @Inject(LOGGER_TOKEN.token) private logger: Logger
 * ```
 */
export const createTypedToken = <T>(name: string): { token: symbol; type: T } => {
  return {
    token: Symbol.for(name),
    type: null as any as T,
  };
};

/**
 * Creates a namespaced token family for related services.
 *
 * @param {string} namespace - Namespace for token family
 * @param {string[]} names - Array of token names
 * @returns {Record<string, symbol>} Map of token names to symbols
 *
 * @example
 * ```typescript
 * const DATABASE_TOKENS = createTokenFamily('database', [
 *   'CONNECTION',
 *   'TRANSACTION_MANAGER',
 *   'QUERY_RUNNER'
 * ]);
 * // DATABASE_TOKENS.CONNECTION, DATABASE_TOKENS.TRANSACTION_MANAGER
 * ```
 */
export const createTokenFamily = (
  namespace: string,
  names: string[],
): Record<string, symbol> => {
  return names.reduce((acc, name) => {
    acc[name] = createInjectionToken(name, namespace);
    return acc;
  }, {} as Record<string, symbol>);
};

/**
 * Generates a unique token for each request in request-scoped providers.
 *
 * @param {string} baseName - Base token name
 * @returns {Function} Token generator function
 *
 * @example
 * ```typescript
 * const getRequestToken = createRequestToken('REQUEST_CONTEXT');
 * const token = getRequestToken(); // Unique per request
 * ```
 */
export const createRequestToken = (baseName: string) => {
  let counter = 0;
  return (): symbol => {
    return Symbol.for(`${baseName}:${Date.now()}:${counter++}`);
  };
};

// ============================================================================
// CUSTOM PROVIDER FACTORIES
// ============================================================================

/**
 * Creates a class provider with optional scope configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate
 * @param {string} [scope='DEFAULT'] - Provider scope
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createClassProvider(
 *   'LOGGER',
 *   WinstonLogger,
 *   'TRANSIENT'
 * );
 * ```
 */
export const createClassProvider = (
  token: string | symbol,
  useClass: any,
  scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT' = 'DEFAULT',
): ProviderConfig => {
  return {
    provide: token,
    useClass,
    scope,
  };
};

/**
 * Creates a value provider for constants and configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} value - Value to provide
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createValueProvider('API_VERSION', 'v2');
 * const dbConfig = createValueProvider('DB_CONFIG', {
 *   host: 'localhost',
 *   port: 5432
 * });
 * ```
 */
export const createValueProvider = (
  token: string | symbol,
  value: any,
): ProviderConfig => {
  return {
    provide: token,
    useValue: value,
  };
};

/**
 * Creates a factory provider with dependency injection.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @param {string} [scope='DEFAULT'] - Provider scope
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createFactoryProvider(
 *   'DATABASE',
 *   (config) => new Database(config.get('db')),
 *   [ConfigService]
 * );
 * ```
 */
export const createFactoryProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  inject?: any[],
  scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT' = 'DEFAULT',
): ProviderConfig => {
  return {
    provide: token,
    useFactory: factory,
    inject: inject || [],
    scope,
  };
};

/**
 * Creates an alias provider to reuse existing providers.
 *
 * @param {string | symbol} token - New token
 * @param {string | symbol} existingToken - Existing provider token
 * @returns {ProviderConfig} Provider configuration
 *
 * @example
 * ```typescript
 * const provider = createAliasProvider(
 *   'LEGACY_LOGGER',
 *   'LOGGER'
 * );
 * // Both tokens will inject the same instance
 * ```
 */
export const createAliasProvider = (
  token: string | symbol,
  existingToken: string | symbol,
): ProviderConfig => {
  return {
    provide: token,
    useExisting: existingToken,
  };
};

/**
 * Creates an async factory provider for asynchronous initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} asyncFactory - Async factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ProviderConfig} Async provider configuration
 *
 * @example
 * ```typescript
 * const provider = createAsyncFactoryProvider(
 *   'DATABASE',
 *   async (config) => {
 *     const db = new Database();
 *     await db.connect(config.get('db'));
 *     return db;
 *   },
 *   [ConfigService]
 * );
 * ```
 */
export const createAsyncFactoryProvider = (
  token: string | symbol,
  asyncFactory: (...args: any[]) => Promise<any>,
  inject?: any[],
): ProviderConfig => {
  return {
    provide: token,
    useFactory: asyncFactory,
    inject: inject || [],
  };
};

/**
 * Creates a conditional provider based on environment or configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {Function} condition - Condition function
 * @param {any} [fallback] - Fallback value if condition fails
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ProviderConfig} Conditional provider configuration
 *
 * @example
 * ```typescript
 * const provider = createConditionalProvider(
 *   'CACHE',
 *   (config) => new RedisCache(config),
 *   (config) => config.get('env') === 'production',
 *   new MemoryCache(),
 *   [ConfigService]
 * );
 * ```
 */
export const createConditionalProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  condition: (...args: any[]) => boolean,
  fallback?: any,
  inject?: any[],
): ProviderConfig => {
  return {
    provide: token,
    useFactory: (...args: any[]) => {
      if (condition(...args)) {
        return factory(...args);
      }
      return fallback;
    },
    inject: inject || [],
  };
};

// ============================================================================
// MULTI-PROVIDER PATTERNS
// ============================================================================

/**
 * Creates a multi-provider for collections of services.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to add to collection
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const validators = [
 *   createMultiProvider('VALIDATORS', EmailValidator),
 *   createMultiProvider('VALIDATORS', PhoneValidator),
 *   createMultiProvider('VALIDATORS', AgeValidator)
 * ];
 * // @Inject('VALIDATORS') validators: Validator[]
 * ```
 */
export const createMultiProvider = (
  token: string | symbol,
  useClass: any,
): MultiProviderConfig => {
  return {
    provide: token,
    useClass,
    multi: true,
  };
};

/**
 * Creates a multi-value provider for constants collection.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} value - Value to add to collection
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const plugins = [
 *   createMultiValueProvider('PLUGINS', loggingPlugin),
 *   createMultiValueProvider('PLUGINS', metricsPlugin),
 *   createMultiValueProvider('PLUGINS', tracingPlugin)
 * ];
 * ```
 */
export const createMultiValueProvider = (
  token: string | symbol,
  value: any,
): MultiProviderConfig => {
  return {
    provide: token,
    useValue: value,
    multi: true,
  };
};

/**
 * Creates a multi-factory provider for dynamic collections.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {MultiProviderConfig} Multi-provider configuration
 *
 * @example
 * ```typescript
 * const handlers = [
 *   createMultiFactoryProvider('HANDLERS', () => new HttpHandler()),
 *   createMultiFactoryProvider('HANDLERS', () => new WsHandler())
 * ];
 * ```
 */
export const createMultiFactoryProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  inject?: any[],
): MultiProviderConfig => {
  return {
    provide: token,
    useFactory: factory,
    inject: inject || [],
    multi: true,
  };
};

/**
 * Aggregates multiple providers into a collection provider.
 *
 * @param {string | symbol} collectionToken - Token for the collection
 * @param {any[]} providers - Individual provider classes
 * @returns {MultiProviderConfig[]} Array of multi-provider configurations
 *
 * @example
 * ```typescript
 * const guardProviders = aggregateProviders('GUARDS', [
 *   AuthGuard,
 *   RoleGuard,
 *   ThrottleGuard
 * ]);
 * ```
 */
export const aggregateProviders = (
  collectionToken: string | symbol,
  providers: any[],
): MultiProviderConfig[] => {
  return providers.map((provider) => createMultiProvider(collectionToken, provider));
};

// ============================================================================
// DYNAMIC MODULE BUILDERS
// ============================================================================

/**
 * Creates a dynamic module with configuration support.
 *
 * @param {any} module - Module class
 * @param {Object} options - Module options
 * @returns {DynamicModuleConfig} Dynamic module configuration
 *
 * @example
 * ```typescript
 * const dynamicModule = createDynamicModule(DatabaseModule, {
 *   providers: [DatabaseService],
 *   exports: [DatabaseService],
 *   isGlobal: true
 * });
 * ```
 */
export const createDynamicModule = (
  module: any,
  options: ModuleOptions = {},
): DynamicModuleConfig => {
  return {
    module,
    providers: options.providers || [],
    imports: options.imports || [],
    exports: options.exports || [],
    controllers: options.controllers || [],
    global: options.isGlobal || false,
  };
};

/**
 * Creates a module builder with fluent API.
 *
 * @param {any} moduleClass - Module class
 * @returns {Object} Module builder
 *
 * @example
 * ```typescript
 * const module = createModuleBuilder(AppModule)
 *   .withProviders([ServiceA, ServiceB])
 *   .withExports([ServiceA])
 *   .asGlobal()
 *   .build();
 * ```
 */
export const createModuleBuilder = (moduleClass: any) => {
  const config: DynamicModuleConfig = {
    module: moduleClass,
    providers: [],
    imports: [],
    exports: [],
    controllers: [],
    global: false,
  };

  return {
    withProviders(providers: any[]) {
      config.providers = [...(config.providers || []), ...providers];
      return this;
    },

    withImports(imports: any[]) {
      config.imports = [...(config.imports || []), ...imports];
      return this;
    },

    withExports(exports: any[]) {
      config.exports = [...(config.exports || []), ...exports];
      return this;
    },

    withControllers(controllers: any[]) {
      config.controllers = [...(config.controllers || []), ...controllers];
      return this;
    },

    asGlobal() {
      config.global = true;
      return this;
    },

    build(): DynamicModuleConfig {
      return config;
    },
  };
};

/**
 * Creates a configurable dynamic module with async configuration.
 *
 * @param {any} moduleClass - Module class
 * @param {Function} configFactory - Async configuration factory
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {DynamicModuleConfig} Dynamic module with async config
 *
 * @example
 * ```typescript
 * const module = createConfigurableDynamicModule(
 *   DatabaseModule,
 *   async (config) => ({
 *     host: config.get('db.host'),
 *     port: config.get('db.port')
 *   }),
 *   [ConfigService]
 * );
 * ```
 */
export const createConfigurableDynamicModule = (
  moduleClass: any,
  configFactory: (...args: any[]) => Promise<any>,
  inject?: any[],
): DynamicModuleConfig => {
  const configProvider = {
    provide: 'MODULE_CONFIG',
    useFactory: configFactory,
    inject: inject || [],
  };

  return {
    module: moduleClass,
    providers: [configProvider],
    exports: [configProvider],
  };
};

/**
 * Creates a feature module factory for lazy loading.
 *
 * @param {string} featureName - Feature name
 * @param {Function} moduleFactory - Module factory function
 * @returns {Function} Feature module loader
 *
 * @example
 * ```typescript
 * const loadUserModule = createFeatureModule(
 *   'users',
 *   () => import('./users/users.module').then(m => m.UsersModule)
 * );
 * ```
 */
export const createFeatureModule = (
  featureName: string,
  moduleFactory: () => Promise<any>,
) => {
  return async (): Promise<DynamicModuleConfig> => {
    const loadedModule = await moduleFactory();

    return {
      module: loadedModule,
      providers: [],
      imports: [],
      exports: [],
    };
  };
};

/**
 * Creates a module with optional imports based on configuration.
 *
 * @param {any} moduleClass - Module class
 * @param {any[]} baseImports - Always imported modules
 * @param {Function} conditionalImports - Function returning conditional imports
 * @returns {DynamicModuleConfig} Module with conditional imports
 *
 * @example
 * ```typescript
 * const module = createConditionalModule(
 *   AppModule,
 *   [CoreModule, CommonModule],
 *   (config) => config.get('enableAuth') ? [AuthModule] : []
 * );
 * ```
 */
export const createConditionalModule = (
  moduleClass: any,
  baseImports: any[],
  conditionalImports: (...args: any[]) => any[],
): DynamicModuleConfig => {
  return {
    module: moduleClass,
    imports: baseImports,
    providers: [
      {
        provide: 'CONDITIONAL_IMPORTS',
        useFactory: conditionalImports,
      },
    ],
  };
};

// ============================================================================
// CIRCULAR DEPENDENCY RESOLUTION
// ============================================================================

/**
 * Creates a forward reference for circular dependencies.
 *
 * @param {Function} typeFactory - Function returning the type
 * @returns {Object} Forward reference object
 *
 * @example
 * ```typescript
 * @Injectable()
 * class UserService {
 *   constructor(
 *     @Inject(createForwardRef(() => PostService))
 *     private postService: PostService
 *   ) {}
 * }
 * ```
 */
export const createForwardRef = (typeFactory: () => any) => {
  return {
    forwardRef: typeFactory,
  };
};

/**
 * Creates a lazy injection for breaking circular dependencies.
 *
 * @param {string | symbol} token - Injection token
 * @returns {Function} Lazy getter function
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   private getServiceB = createLazyInjection('SERVICE_B');
 *
 *   useServiceB() {
 *     const serviceB = this.getServiceB();
 *     return serviceB.doSomething();
 *   }
 * }
 * ```
 */
export const createLazyInjection = (token: string | symbol) => {
  let instance: any = null;

  return (injector?: any): any => {
    if (!instance && injector) {
      instance = injector.get(token);
    }
    return instance;
  };
};

/**
 * Creates a circular dependency resolver using ModuleRef.
 *
 * @param {any} moduleRef - NestJS ModuleRef instance
 * @param {string | symbol} token - Token to resolve
 * @returns {Function} Resolver function
 *
 * @example
 * ```typescript
 * const getCircularService = createCircularResolver(
 *   moduleRef,
 *   'CIRCULAR_SERVICE'
 * );
 * const service = await getCircularService();
 * ```
 */
export const createCircularResolver = (moduleRef: any, token: string | symbol) => {
  return async (): Promise<any> => {
    return moduleRef.get(token, { strict: false });
  };
};

/**
 * Creates a proxy for lazy circular dependency resolution.
 *
 * @param {Function} resolver - Function that resolves the dependency
 * @returns {Proxy} Proxy object
 *
 * @example
 * ```typescript
 * const serviceProxy = createCircularProxy(
 *   () => injector.get(ServiceClass)
 * );
 * serviceProxy.method(); // Resolves on first call
 * ```
 */
export const createCircularProxy = (resolver: () => any): any => {
  let resolved: any = null;

  return new Proxy(
    {},
    {
      get(target, prop) {
        if (!resolved) {
          resolved = resolver();
        }
        return resolved[prop];
      },
    },
  );
};

/**
 * Creates a delayed injection wrapper for circular dependencies.
 *
 * @param {any} injector - Dependency injector
 * @param {string | symbol} token - Injection token
 * @returns {Object} Wrapper with delayed resolution
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   private serviceBWrapper = createDelayedInjection(injector, 'SERVICE_B');
 *
 *   useServiceB() {
 *     return this.serviceBWrapper.get().doSomething();
 *   }
 * }
 * ```
 */
export const createDelayedInjection = (injector: any, token: string | symbol) => {
  let instance: any = null;

  return {
    get(): any {
      if (!instance) {
        instance = injector.get(token);
      }
      return instance;
    },

    reset(): void {
      instance = null;
    },
  };
};

// ============================================================================
// OPTIONAL DEPENDENCY HANDLING
// ============================================================================

/**
 * Creates an optional dependency with fallback value.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} [defaultValue] - Default value if not available
 * @returns {ProviderConfig} Optional provider configuration
 *
 * @example
 * ```typescript
 * const provider = createOptionalProvider('CACHE', new MemoryCache());
 * // Will use MemoryCache if CACHE provider not found
 * ```
 */
export const createOptionalProvider = (
  token: string | symbol,
  defaultValue?: any,
): ProviderConfig => {
  return {
    provide: token,
    useFactory: (injector: any) => {
      try {
        return injector.get(token, { optional: true }) || defaultValue;
      } catch {
        return defaultValue;
      }
    },
  };
};

/**
 * Creates a conditional optional dependency based on availability.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} callback - Callback if dependency available
 * @param {Function} [fallback] - Fallback if not available
 * @returns {Function} Conditional executor
 *
 * @example
 * ```typescript
 * const useCache = createConditionalOptional(
 *   'CACHE',
 *   (cache) => cache.get(key),
 *   () => fetchFromDatabase(key)
 * );
 * ```
 */
export const createConditionalOptional = (
  token: string | symbol,
  callback: (dependency: any) => any,
  fallback?: () => any,
) => {
  return (injector: any): any => {
    try {
      const dependency = injector.get(token, { optional: true });
      if (dependency) {
        return callback(dependency);
      }
      return fallback ? fallback() : undefined;
    } catch {
      return fallback ? fallback() : undefined;
    }
  };
};

/**
 * Creates a provider with optional dependencies in factory.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory with optional dependencies
 * @param {OptionalDependencyConfig[]} optionalDeps - Optional dependency configs
 * @returns {ProviderConfig} Provider with optional dependencies
 *
 * @example
 * ```typescript
 * const provider = createProviderWithOptionalDeps(
 *   'SERVICE',
 *   (logger, cache) => new Service(logger, cache),
 *   [
 *     { token: 'LOGGER', defaultValue: console },
 *     { token: 'CACHE', defaultValue: null }
 *   ]
 * );
 * ```
 */
export const createProviderWithOptionalDeps = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  optionalDeps: OptionalDependencyConfig[],
): ProviderConfig => {
  return {
    provide: token,
    useFactory: (injector: any) => {
      const resolvedDeps = optionalDeps.map((dep) => {
        try {
          return injector.get(dep.token, { optional: true }) || dep.defaultValue;
        } catch {
          return dep.defaultValue;
        }
      });
      return factory(...resolvedDeps);
    },
  };
};

/**
 * Creates a null-safe injection wrapper.
 *
 * @param {any} injector - Dependency injector
 * @param {string | symbol} token - Injection token
 * @returns {Object} Null-safe wrapper
 *
 * @example
 * ```typescript
 * const safeDep = createNullSafeInjection(injector, 'OPTIONAL_SERVICE');
 * safeDep.ifPresent((service) => service.doSomething());
 * ```
 */
export const createNullSafeInjection = (injector: any, token: string | symbol) => {
  return {
    get(): any | null {
      try {
        return injector.get(token, { optional: true });
      } catch {
        return null;
      }
    },

    ifPresent(callback: (dependency: any) => void): void {
      const dep = this.get();
      if (dep) {
        callback(dep);
      }
    },

    orElse(fallback: any): any {
      return this.get() || fallback;
    },

    orElseGet(fallbackFn: () => any): any {
      const dep = this.get();
      return dep || fallbackFn();
    },
  };
};

// ============================================================================
// SCOPED PROVIDER UTILITIES
// ============================================================================

/**
 * Creates a request-scoped provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate per request
 * @returns {ScopedProviderConfig} Request-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   RequestContextService
 * );
 * ```
 */
export const createRequestScopedProvider = (
  token: string | symbol,
  useClass: any,
): ScopedProviderConfig => {
  return {
    provide: token,
    useClass,
    scope: 'REQUEST',
  };
};

/**
 * Creates a transient provider (new instance per injection).
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate per injection
 * @returns {ScopedProviderConfig} Transient provider
 *
 * @example
 * ```typescript
 * const provider = createTransientProvider(
 *   'TASK_PROCESSOR',
 *   TaskProcessor
 * );
 * ```
 */
export const createTransientProvider = (
  token: string | symbol,
  useClass: any,
): ScopedProviderConfig => {
  return {
    provide: token,
    useClass,
    scope: 'TRANSIENT',
  };
};

/**
 * Creates a singleton provider (default behavior made explicit).
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate once
 * @returns {ScopedProviderConfig} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonProvider(
 *   'DATABASE',
 *   DatabaseService
 * );
 * ```
 */
export const createSingletonProvider = (
  token: string | symbol,
  useClass: any,
): ScopedProviderConfig => {
  return {
    provide: token,
    useClass,
    scope: 'DEFAULT',
  };
};

/**
 * Creates a scoped factory provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} factory - Factory function
 * @param {string} scope - Provider scope
 * @param {any[]} [inject] - Dependencies to inject
 * @returns {ScopedProviderConfig} Scoped factory provider
 *
 * @example
 * ```typescript
 * const provider = createScopedFactoryProvider(
 *   'LOGGER',
 *   (request) => new RequestLogger(request.id),
 *   'REQUEST',
 *   [REQUEST]
 * );
 * ```
 */
export const createScopedFactoryProvider = (
  token: string | symbol,
  factory: (...args: any[]) => any,
  scope: 'DEFAULT' | 'REQUEST' | 'TRANSIENT',
  inject?: any[],
): ScopedProviderConfig => {
  return {
    provide: token,
    useFactory: factory,
    scope,
  };
};

/**
 * Converts a singleton provider to request-scoped.
 *
 * @param {ProviderConfig} provider - Original provider
 * @returns {ScopedProviderConfig} Request-scoped version
 *
 * @example
 * ```typescript
 * const singletonProvider = { provide: 'SERVICE', useClass: Service };
 * const requestProvider = convertToRequestScoped(singletonProvider);
 * ```
 */
export const convertToRequestScoped = (
  provider: ProviderConfig,
): ScopedProviderConfig => {
  return {
    ...provider,
    scope: 'REQUEST',
  } as ScopedProviderConfig;
};

// ============================================================================
// PROVIDER COMPOSITION & DECORATORS
// ============================================================================

/**
 * Composes multiple providers into a provider array.
 *
 * @param {...ProviderConfig[]} providers - Provider configurations
 * @returns {ProviderConfig[]} Array of providers
 *
 * @example
 * ```typescript
 * const providers = composeProviders(
 *   createClassProvider('SERVICE_A', ServiceA),
 *   createFactoryProvider('SERVICE_B', () => new ServiceB()),
 *   createValueProvider('CONFIG', { key: 'value' })
 * );
 * ```
 */
export const composeProviders = (...providers: ProviderConfig[]): ProviderConfig[] => {
  return providers;
};

/**
 * Creates a provider decorator that wraps another provider.
 *
 * @param {ProviderConfig} provider - Base provider
 * @param {Function} decorator - Decorator function
 * @returns {ProviderConfig} Decorated provider
 *
 * @example
 * ```typescript
 * const loggingProvider = decorateProvider(
 *   serviceProvider,
 *   (instance) => new Proxy(instance, {
 *     get: (target, prop) => {
 *       console.log(`Accessing ${String(prop)}`);
 *       return target[prop];
 *     }
 *   })
 * );
 * ```
 */
export const decorateProvider = (
  provider: ProviderConfig,
  decorator: (instance: any) => any,
): ProviderConfig => {
  const originalFactory = provider.useFactory;

  if (originalFactory) {
    return {
      ...provider,
      useFactory: (...args: any[]) => {
        const instance = originalFactory(...args);
        return decorator(instance);
      },
    };
  }

  return {
    provide: provider.provide,
    useFactory: (injector: any) => {
      const instance = injector.get(provider.provide);
      return decorator(instance);
    },
  };
};

/**
 * Creates a provider interceptor for logging/metrics.
 *
 * @param {ProviderConfig} provider - Base provider
 * @param {Function} interceptor - Interceptor function
 * @returns {ProviderConfig} Intercepted provider
 *
 * @example
 * ```typescript
 * const monitoredProvider = interceptProvider(
 *   serviceProvider,
 *   async (method, args, next) => {
 *     const start = Date.now();
 *     const result = await next();
 *     console.log(`${method} took ${Date.now() - start}ms`);
 *     return result;
 *   }
 * );
 * ```
 */
export const interceptProvider = (
  provider: ProviderConfig,
  interceptor: (method: string, args: any[], next: () => any) => any,
): ProviderConfig => {
  return decorateProvider(provider, (instance) => {
    return new Proxy(instance, {
      get(target, prop: string) {
        const original = target[prop];

        if (typeof original !== 'function') {
          return original;
        }

        return (...args: any[]) => {
          return interceptor(prop, args, () => original.apply(target, args));
        };
      },
    });
  });
};

/**
 * Creates a provider mixin combining multiple behaviors.
 *
 * @param {ProviderConfig} baseProvider - Base provider
 * @param {any[]} mixins - Mixin classes
 * @returns {ProviderConfig} Mixed provider
 *
 * @example
 * ```typescript
 * const enhancedProvider = mixinProvider(
 *   serviceProvider,
 *   [LoggingMixin, CachingMixin, ValidationMixin]
 * );
 * ```
 */
export const mixinProvider = (
  baseProvider: ProviderConfig,
  mixins: any[],
): ProviderConfig => {
  return decorateProvider(baseProvider, (instance) => {
    mixins.forEach((Mixin) => {
      Object.assign(instance, new Mixin());
    });
    return instance;
  });
};

// ============================================================================
// PROVIDER TESTING UTILITIES
// ============================================================================

/**
 * Creates a mock provider for testing.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} mockImplementation - Mock implementation
 * @returns {ProviderConfig} Mock provider
 *
 * @example
 * ```typescript
 * const mockProvider = createMockProvider('USER_SERVICE', {
 *   findById: jest.fn().mockResolvedValue({ id: '123' }),
 *   create: jest.fn().mockResolvedValue({ id: '456' })
 * });
 * ```
 */
export const createMockProvider = (
  token: string | symbol,
  mockImplementation: any,
): ProviderConfig => {
  return {
    provide: token,
    useValue: mockImplementation,
  };
};

/**
 * Creates a spy provider for testing with original implementation.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} originalProvider - Original provider
 * @param {Function} spyFn - Spy function
 * @returns {ProviderConfig} Spy provider
 *
 * @example
 * ```typescript
 * const spyProvider = createSpyProvider(
 *   'SERVICE',
 *   originalService,
 *   (method, args, result) => console.log(method, args, result)
 * );
 * ```
 */
export const createSpyProvider = (
  token: string | symbol,
  originalProvider: any,
  spyFn: (method: string, args: any[], result: any) => void,
): ProviderConfig => {
  return {
    provide: token,
    useValue: new Proxy(originalProvider, {
      get(target, prop: string) {
        const original = target[prop];

        if (typeof original !== 'function') {
          return original;
        }

        return async (...args: any[]) => {
          const result = await original.apply(target, args);
          spyFn(prop, args, result);
          return result;
        };
      },
    }),
  };
};

/**
 * Creates a stub provider for testing with predefined responses.
 *
 * @param {string | symbol} token - Injection token
 * @param {Record<string, any>} stubs - Method stubs
 * @returns {ProviderConfig} Stub provider
 *
 * @example
 * ```typescript
 * const stubProvider = createStubProvider('API_CLIENT', {
 *   get: Promise.resolve({ data: 'test' }),
 *   post: Promise.resolve({ success: true })
 * });
 * ```
 */
export const createStubProvider = (
  token: string | symbol,
  stubs: Record<string, any>,
): ProviderConfig => {
  return {
    provide: token,
    useValue: stubs,
  };
};

/**
 * Creates a provider override for testing modules.
 *
 * @param {string | symbol} originalToken - Original token to override
 * @param {any} testImplementation - Test implementation
 * @returns {Object} Override configuration
 *
 * @example
 * ```typescript
 * const override = createProviderOverride(
 *   'DATABASE',
 *   mockDatabase
 * );
 * const module = await Test.createTestingModule({
 *   providers: [override]
 * });
 * ```
 */
export const createProviderOverride = (
  originalToken: string | symbol,
  testImplementation: any,
) => {
  return {
    token: originalToken,
    provider: {
      provide: originalToken,
      useValue: testImplementation,
    },
  };
};

// ============================================================================
// PROVIDER REGISTRY & MANAGEMENT
// ============================================================================

/**
 * Creates a provider registry for managing dynamic providers.
 *
 * @returns {Object} Provider registry
 *
 * @example
 * ```typescript
 * const registry = createProviderRegistry();
 * registry.register('SERVICE_A', ServiceA);
 * const provider = registry.get('SERVICE_A');
 * ```
 */
export const createProviderRegistry = () => {
  const providers = new Map<string | symbol, ProviderConfig>();

  return {
    register(token: string | symbol, provider: ProviderConfig | any): void {
      if (typeof provider === 'function') {
        providers.set(token, createClassProvider(token, provider));
      } else {
        providers.set(token, provider);
      }
    },

    get(token: string | symbol): ProviderConfig | undefined {
      return providers.get(token);
    },

    has(token: string | symbol): boolean {
      return providers.has(token);
    },

    remove(token: string | symbol): boolean {
      return providers.delete(token);
    },

    getAll(): ProviderConfig[] {
      return Array.from(providers.values());
    },

    clear(): void {
      providers.clear();
    },

    size(): number {
      return providers.size;
    },
  };
};

/**
 * Creates a provider factory registry for plugin systems.
 *
 * @returns {Object} Factory registry
 *
 * @example
 * ```typescript
 * const factoryRegistry = createProviderFactoryRegistry();
 * factoryRegistry.registerFactory('logger', (config) => new Logger(config));
 * const logger = factoryRegistry.create('logger', { level: 'debug' });
 * ```
 */
export const createProviderFactoryRegistry = () => {
  const factories = new Map<string, (...args: any[]) => any>();

  return {
    registerFactory(name: string, factory: (...args: any[]) => any): void {
      factories.set(name, factory);
    },

    create(name: string, ...args: any[]): any {
      const factory = factories.get(name);
      if (!factory) {
        throw new Error(`Factory '${name}' not found`);
      }
      return factory(...args);
    },

    has(name: string): boolean {
      return factories.has(name);
    },

    remove(name: string): boolean {
      return factories.delete(name);
    },

    listFactories(): string[] {
      return Array.from(factories.keys());
    },
  };
};

/**
 * Creates a hierarchical provider registry with parent-child relationships.
 *
 * @param {any} [parent] - Parent registry
 * @returns {Object} Hierarchical registry
 *
 * @example
 * ```typescript
 * const globalRegistry = createHierarchicalRegistry();
 * const moduleRegistry = createHierarchicalRegistry(globalRegistry);
 * moduleRegistry.register('LOCAL', LocalService);
 * // Falls back to parent if not found locally
 * ```
 */
export const createHierarchicalRegistry = (parent?: any) => {
  const localProviders = new Map<string | symbol, ProviderConfig>();

  return {
    register(token: string | symbol, provider: ProviderConfig): void {
      localProviders.set(token, provider);
    },

    get(token: string | symbol): ProviderConfig | undefined {
      const local = localProviders.get(token);
      if (local) return local;

      if (parent) {
        return parent.get(token);
      }

      return undefined;
    },

    has(token: string | symbol): boolean {
      return localProviders.has(token) || (parent ? parent.has(token) : false);
    },

    getLocal(token: string | symbol): ProviderConfig | undefined {
      return localProviders.get(token);
    },

    getAllLocal(): ProviderConfig[] {
      return Array.from(localProviders.values());
    },

    getParent(): any {
      return parent;
    },
  };
};
