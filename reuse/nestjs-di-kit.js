"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHierarchicalRegistry = exports.createProviderFactoryRegistry = exports.createProviderRegistry = exports.createProviderOverride = exports.createStubProvider = exports.createSpyProvider = exports.createMockProvider = exports.mixinProvider = exports.interceptProvider = exports.decorateProvider = exports.composeProviders = exports.convertToRequestScoped = exports.createScopedFactoryProvider = exports.createSingletonProvider = exports.createTransientProvider = exports.createRequestScopedProvider = exports.createNullSafeInjection = exports.createProviderWithOptionalDeps = exports.createConditionalOptional = exports.createOptionalProvider = exports.createDelayedInjection = exports.createCircularProxy = exports.createCircularResolver = exports.createLazyInjection = exports.createForwardRef = exports.createConditionalModule = exports.createFeatureModule = exports.createConfigurableDynamicModule = exports.createModuleBuilder = exports.createDynamicModule = exports.aggregateProviders = exports.createMultiFactoryProvider = exports.createMultiValueProvider = exports.createMultiProvider = exports.createConditionalProvider = exports.createAsyncFactoryProvider = exports.createAliasProvider = exports.createFactoryProvider = exports.createValueProvider = exports.createClassProvider = exports.createRequestToken = exports.createTokenFamily = exports.createTypedToken = exports.createStringToken = exports.createInjectionToken = void 0;
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
const createInjectionToken = (name, namespace) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Token name must be a non-empty string');
    }
    if (namespace !== undefined && (typeof namespace !== 'string' || namespace.trim().length === 0)) {
        throw new Error('Namespace must be undefined or a non-empty string');
    }
    const sanitizedName = name.trim();
    const fullName = namespace ? `${namespace.trim()}:${sanitizedName}` : sanitizedName;
    return Symbol.for(fullName);
};
exports.createInjectionToken = createInjectionToken;
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
const createStringToken = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Token name must be a non-empty string');
    }
    return `__${name.trim().toUpperCase()}__`;
};
exports.createStringToken = createStringToken;
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
const createTypedToken = (name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('Token name must be a non-empty string');
    }
    return {
        token: Symbol.for(name.trim()),
        type: undefined,
    };
};
exports.createTypedToken = createTypedToken;
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
const createTokenFamily = (namespace, names) => {
    if (!namespace || typeof namespace !== 'string' || namespace.trim().length === 0) {
        throw new Error('Namespace must be a non-empty string');
    }
    if (!Array.isArray(names) || names.length === 0) {
        throw new Error('Names must be a non-empty array');
    }
    return names.reduce((acc, name) => {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Each name in the array must be a non-empty string');
        }
        acc[name] = (0, exports.createInjectionToken)(name, namespace);
        return acc;
    }, {});
};
exports.createTokenFamily = createTokenFamily;
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
const createRequestToken = (baseName) => {
    if (!baseName || typeof baseName !== 'string' || baseName.trim().length === 0) {
        throw new Error('Base name must be a non-empty string');
    }
    const sanitizedBaseName = baseName.trim();
    let counter = 0;
    return () => {
        return Symbol.for(`${sanitizedBaseName}:${Date.now()}:${counter++}`);
    };
};
exports.createRequestToken = createRequestToken;
// ============================================================================
// CUSTOM PROVIDER FACTORIES
// ============================================================================
/**
 * Creates a class provider with optional scope configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} useClass - Class to instantiate
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
const createClassProvider = (token, useClass, scope = 'DEFAULT') => {
    if (!token || (typeof token !== 'string' && typeof token !== 'symbol')) {
        throw new Error('Token must be a non-empty string or symbol');
    }
    if (typeof useClass !== 'function') {
        throw new Error('useClass must be a constructor function');
    }
    return {
        provide: token,
        useClass,
        scope,
    };
};
exports.createClassProvider = createClassProvider;
/**
 * Creates a value provider for constants and configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {T} value - Value to provide
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
const createValueProvider = (token, value) => {
    if (!token || (typeof token !== 'string' && typeof token !== 'symbol')) {
        throw new Error('Token must be a non-empty string or symbol');
    }
    if (value === undefined) {
        throw new Error('Value cannot be undefined (use null if needed)');
    }
    return {
        provide: token,
        useValue: value,
    };
};
exports.createValueProvider = createValueProvider;
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
const createFactoryProvider = (token, factory, inject, scope = 'DEFAULT') => {
    return {
        provide: token,
        useFactory: factory,
        inject: inject || [],
        scope,
    };
};
exports.createFactoryProvider = createFactoryProvider;
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
const createAliasProvider = (token, existingToken) => {
    return {
        provide: token,
        useExisting: existingToken,
    };
};
exports.createAliasProvider = createAliasProvider;
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
const createAsyncFactoryProvider = (token, asyncFactory, inject) => {
    return {
        provide: token,
        useFactory: asyncFactory,
        inject: inject || [],
    };
};
exports.createAsyncFactoryProvider = createAsyncFactoryProvider;
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
const createConditionalProvider = (token, factory, condition, fallback, inject) => {
    return {
        provide: token,
        useFactory: (...args) => {
            if (condition(...args)) {
                return factory(...args);
            }
            return fallback;
        },
        inject: inject || [],
    };
};
exports.createConditionalProvider = createConditionalProvider;
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
const createMultiProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        multi: true,
    };
};
exports.createMultiProvider = createMultiProvider;
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
const createMultiValueProvider = (token, value) => {
    return {
        provide: token,
        useValue: value,
        multi: true,
    };
};
exports.createMultiValueProvider = createMultiValueProvider;
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
const createMultiFactoryProvider = (token, factory, inject) => {
    return {
        provide: token,
        useFactory: factory,
        inject: inject || [],
        multi: true,
    };
};
exports.createMultiFactoryProvider = createMultiFactoryProvider;
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
const aggregateProviders = (collectionToken, providers) => {
    return providers.map((provider) => (0, exports.createMultiProvider)(collectionToken, provider));
};
exports.aggregateProviders = aggregateProviders;
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
const createDynamicModule = (module, options = {}) => {
    return {
        module,
        providers: options.providers || [],
        imports: options.imports || [],
        exports: options.exports || [],
        controllers: options.controllers || [],
        global: options.isGlobal || false,
    };
};
exports.createDynamicModule = createDynamicModule;
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
const createModuleBuilder = (moduleClass) => {
    const config = {
        module: moduleClass,
        providers: [],
        imports: [],
        exports: [],
        controllers: [],
        global: false,
    };
    return {
        withProviders(providers) {
            config.providers = [...(config.providers || []), ...providers];
            return this;
        },
        withImports(imports) {
            config.imports = [...(config.imports || []), ...imports];
            return this;
        },
        withExports(exports) {
            config.exports = [...(config.exports || []), ...exports];
            return this;
        },
        withControllers(controllers) {
            config.controllers = [...(config.controllers || []), ...controllers];
            return this;
        },
        asGlobal() {
            config.global = true;
            return this;
        },
        build() {
            return config;
        },
    };
};
exports.createModuleBuilder = createModuleBuilder;
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
const createConfigurableDynamicModule = (moduleClass, configFactory, inject) => {
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
exports.createConfigurableDynamicModule = createConfigurableDynamicModule;
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
const createFeatureModule = (featureName, moduleFactory) => {
    return async () => {
        const loadedModule = await moduleFactory();
        return {
            module: loadedModule,
            providers: [],
            imports: [],
            exports: [],
        };
    };
};
exports.createFeatureModule = createFeatureModule;
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
const createConditionalModule = (moduleClass, baseImports, conditionalImports) => {
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
exports.createConditionalModule = createConditionalModule;
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
const createForwardRef = (typeFactory) => {
    return {
        forwardRef: typeFactory,
    };
};
exports.createForwardRef = createForwardRef;
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
const createLazyInjection = (token) => {
    let instance = null;
    return (injector) => {
        if (!instance && injector) {
            instance = injector.get(token);
        }
        return instance;
    };
};
exports.createLazyInjection = createLazyInjection;
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
const createCircularResolver = (moduleRef, token) => {
    return async () => {
        return moduleRef.get(token, { strict: false });
    };
};
exports.createCircularResolver = createCircularResolver;
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
const createCircularProxy = (resolver) => {
    let resolved = null;
    return new Proxy({}, {
        get(target, prop) {
            if (!resolved) {
                resolved = resolver();
            }
            return resolved[prop];
        },
    });
};
exports.createCircularProxy = createCircularProxy;
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
const createDelayedInjection = (injector, token) => {
    let instance = null;
    return {
        get() {
            if (!instance) {
                instance = injector.get(token);
            }
            return instance;
        },
        reset() {
            instance = null;
        },
    };
};
exports.createDelayedInjection = createDelayedInjection;
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
const createOptionalProvider = (token, defaultValue) => {
    return {
        provide: token,
        useFactory: (injector) => {
            try {
                return injector.get(token, { optional: true }) || defaultValue;
            }
            catch {
                return defaultValue;
            }
        },
    };
};
exports.createOptionalProvider = createOptionalProvider;
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
const createConditionalOptional = (token, callback, fallback) => {
    return (injector) => {
        try {
            const dependency = injector.get(token, { optional: true });
            if (dependency) {
                return callback(dependency);
            }
            return fallback ? fallback() : undefined;
        }
        catch {
            return fallback ? fallback() : undefined;
        }
    };
};
exports.createConditionalOptional = createConditionalOptional;
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
const createProviderWithOptionalDeps = (token, factory, optionalDeps) => {
    return {
        provide: token,
        useFactory: (injector) => {
            const resolvedDeps = optionalDeps.map((dep) => {
                try {
                    return injector.get(dep.token, { optional: true }) || dep.defaultValue;
                }
                catch {
                    return dep.defaultValue;
                }
            });
            return factory(...resolvedDeps);
        },
    };
};
exports.createProviderWithOptionalDeps = createProviderWithOptionalDeps;
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
const createNullSafeInjection = (injector, token) => {
    return {
        get() {
            try {
                return injector.get(token, { optional: true });
            }
            catch {
                return null;
            }
        },
        ifPresent(callback) {
            const dep = this.get();
            if (dep) {
                callback(dep);
            }
        },
        orElse(fallback) {
            return this.get() || fallback;
        },
        orElseGet(fallbackFn) {
            const dep = this.get();
            return dep || fallbackFn();
        },
    };
};
exports.createNullSafeInjection = createNullSafeInjection;
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
const createRequestScopedProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: 'REQUEST',
    };
};
exports.createRequestScopedProvider = createRequestScopedProvider;
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
const createTransientProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: 'TRANSIENT',
    };
};
exports.createTransientProvider = createTransientProvider;
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
const createSingletonProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: 'DEFAULT',
    };
};
exports.createSingletonProvider = createSingletonProvider;
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
const createScopedFactoryProvider = (token, factory, scope, inject) => {
    return {
        provide: token,
        useFactory: factory,
        scope,
    };
};
exports.createScopedFactoryProvider = createScopedFactoryProvider;
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
const convertToRequestScoped = (provider) => {
    return {
        ...provider,
        scope: 'REQUEST',
    };
};
exports.convertToRequestScoped = convertToRequestScoped;
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
const composeProviders = (...providers) => {
    return providers;
};
exports.composeProviders = composeProviders;
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
const decorateProvider = (provider, decorator) => {
    const originalFactory = provider.useFactory;
    if (originalFactory) {
        return {
            ...provider,
            useFactory: (...args) => {
                const instance = originalFactory(...args);
                return decorator(instance);
            },
        };
    }
    return {
        provide: provider.provide,
        useFactory: (injector) => {
            const instance = injector.get(provider.provide);
            return decorator(instance);
        },
    };
};
exports.decorateProvider = decorateProvider;
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
const interceptProvider = (provider, interceptor) => {
    return (0, exports.decorateProvider)(provider, (instance) => {
        return new Proxy(instance, {
            get(target, prop) {
                const original = target[prop];
                if (typeof original !== 'function') {
                    return original;
                }
                return (...args) => {
                    return interceptor(prop, args, () => original.apply(target, args));
                };
            },
        });
    });
};
exports.interceptProvider = interceptProvider;
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
const mixinProvider = (baseProvider, mixins) => {
    return (0, exports.decorateProvider)(baseProvider, (instance) => {
        mixins.forEach((Mixin) => {
            Object.assign(instance, new Mixin());
        });
        return instance;
    });
};
exports.mixinProvider = mixinProvider;
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
const createMockProvider = (token, mockImplementation) => {
    return {
        provide: token,
        useValue: mockImplementation,
    };
};
exports.createMockProvider = createMockProvider;
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
const createSpyProvider = (token, originalProvider, spyFn) => {
    return {
        provide: token,
        useValue: new Proxy(originalProvider, {
            get(target, prop) {
                const original = target[prop];
                if (typeof original !== 'function') {
                    return original;
                }
                return async (...args) => {
                    const result = await original.apply(target, args);
                    spyFn(prop, args, result);
                    return result;
                };
            },
        }),
    };
};
exports.createSpyProvider = createSpyProvider;
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
const createStubProvider = (token, stubs) => {
    return {
        provide: token,
        useValue: stubs,
    };
};
exports.createStubProvider = createStubProvider;
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
const createProviderOverride = (originalToken, testImplementation) => {
    return {
        token: originalToken,
        provider: {
            provide: originalToken,
            useValue: testImplementation,
        },
    };
};
exports.createProviderOverride = createProviderOverride;
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
const createProviderRegistry = () => {
    const providers = new Map();
    return {
        register(token, provider) {
            if (typeof provider === 'function') {
                providers.set(token, (0, exports.createClassProvider)(token, provider));
            }
            else {
                providers.set(token, provider);
            }
        },
        get(token) {
            return providers.get(token);
        },
        has(token) {
            return providers.has(token);
        },
        remove(token) {
            return providers.delete(token);
        },
        getAll() {
            return Array.from(providers.values());
        },
        clear() {
            providers.clear();
        },
        size() {
            return providers.size;
        },
    };
};
exports.createProviderRegistry = createProviderRegistry;
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
const createProviderFactoryRegistry = () => {
    const factories = new Map();
    return {
        registerFactory(name, factory) {
            factories.set(name, factory);
        },
        create(name, ...args) {
            const factory = factories.get(name);
            if (!factory) {
                throw new Error(`Factory '${name}' not found`);
            }
            return factory(...args);
        },
        has(name) {
            return factories.has(name);
        },
        remove(name) {
            return factories.delete(name);
        },
        listFactories() {
            return Array.from(factories.keys());
        },
    };
};
exports.createProviderFactoryRegistry = createProviderFactoryRegistry;
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
const createHierarchicalRegistry = (parent) => {
    const localProviders = new Map();
    return {
        register(token, provider) {
            localProviders.set(token, provider);
        },
        get(token) {
            const local = localProviders.get(token);
            if (local)
                return local;
            if (parent) {
                return parent.get(token);
            }
            return undefined;
        },
        has(token) {
            return localProviders.has(token) || (parent ? parent.has(token) : false);
        },
        getLocal(token) {
            return localProviders.get(token);
        },
        getAllLocal() {
            return Array.from(localProviders.values());
        },
        getParent() {
            return parent;
        },
    };
};
exports.createHierarchicalRegistry = createHierarchicalRegistry;
//# sourceMappingURL=nestjs-di-kit.js.map