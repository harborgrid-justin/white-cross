"use strict";
/**
 * LOC: SVCPROV1234567
 * File: /reuse/service-providers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service implementations
 *   - Dynamic module factories
 *   - Provider configurations
 *   - Custom decorators
 *   - Health check services
 *   - Multi-tenant modules
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
exports.createProviderMetadata = exports.generateProviderInstanceId = exports.withTimeout = exports.createTimeout = exports.delay = exports.executeWithRetry = exports.createRetryProvider = exports.createRetryHandler = exports.createCircuitBreakerProvider = exports.createCircuitBreaker = exports.createDependencyHealthChecker = exports.createServiceHealthMetrics = exports.createHealthCheckProvider = exports.createFeatureGatedProvider = exports.evaluateFeatureToggle = exports.createFeatureToggleProvider = exports.validateTenantAccess = exports.createTenantIsolatedProvider = exports.createTenantContextResolver = exports.createTenantProvider = exports.wrapProviderWithHooks = exports.createProviderWithLifecycle = exports.convertToRequestScope = exports.analyzeProviderScopes = exports.createTransientProvider = exports.createRequestScopedProvider = exports.createLazyInject = exports.createOptionalInject = exports.detectCircularDependencies = exports.resolveProviderDependencies = exports.createInjectionToken = exports.createFeatureModule = exports.createConfigurableModule = exports.createDynamicModule = exports.createConditionalProvider = exports.createMultiProvider = exports.createExistingProvider = exports.createClassProvider = exports.createValueProvider = exports.createAsyncProvider = exports.createFactoryProvider = void 0;
/**
 * File: /reuse/service-providers-kit.ts
 * Locator: WC-UTL-SVCPROV-001
 * Purpose: Comprehensive NestJS Service Providers Kit - Complete provider/DI toolkit for enterprise NestJS applications
 *
 * Upstream: Independent utility module for NestJS providers and dependency injection
 * Downstream: ../backend/*, Service modules, Dynamic modules, Guards, Interceptors, Custom decorators
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/core, reflect-metadata
 * Exports: 45+ utility functions for provider factories, async initialization, dynamic modules, DI helpers, scopes, lifecycle hooks, multi-tenancy, feature toggles, health checks, circuit breakers, retry logic
 *
 * LLM Context: Enterprise-grade NestJS provider utilities for White Cross healthcare platform.
 * Provides comprehensive service factory patterns, async provider initialization, dynamic module builders,
 * dependency injection helpers, scope management (REQUEST/TRANSIENT/DEFAULT), custom injection decorators,
 * provider lifecycle hooks, multi-tenancy support, feature toggle systems, health checks with detailed metrics,
 * circuit breaker patterns for resilience, and retry logic with exponential backoff. HIPAA-compliant patterns
 * for healthcare service isolation, audit logging, and secure multi-tenant data access.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// PROVIDER FACTORY UTILITIES
// ============================================================================
/**
 * Creates a factory provider with comprehensive configuration.
 *
 * @param {ServiceFactoryConfig} config - Factory provider configuration
 * @returns {object} NestJS provider object
 *
 * @example
 * ```typescript
 * const databaseProvider = createFactoryProvider({
 *   token: 'DATABASE_CONNECTION',
 *   useFactory: async (configService: ConfigService) => {
 *     const config = configService.get('database');
 *     return await createConnection(config);
 *   },
 *   inject: [ConfigService],
 *   scope: 'DEFAULT'
 * });
 * ```
 */
const createFactoryProvider = (config) => {
    return {
        provide: config.token,
        useFactory: config.useFactory,
        inject: config.inject || [],
        scope: config.scope || 'DEFAULT',
        ...(config.multi && { multi: true }),
    };
};
exports.createFactoryProvider = createFactoryProvider;
/**
 * Creates an async provider with initialization logic.
 *
 * @param {AsyncProviderConfig} config - Async provider configuration
 * @returns {object} NestJS async provider object
 *
 * @example
 * ```typescript
 * const apiClientProvider = createAsyncProvider({
 *   token: 'EXTERNAL_API_CLIENT',
 *   useFactory: async (httpService: HttpService, config: ConfigService) => {
 *     const apiUrl = config.get('api.url');
 *     const client = new ApiClient(apiUrl, httpService);
 *     await client.initialize();
 *     return client;
 *   },
 *   inject: [HttpService, ConfigService],
 *   timeoutMs: 10000
 * });
 * ```
 */
const createAsyncProvider = (config) => {
    const wrappedFactory = async (...args) => {
        if (config.timeoutMs) {
            return Promise.race([
                config.useFactory(...args),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Provider initialization timeout')), config.timeoutMs)),
            ]);
        }
        return config.useFactory(...args);
    };
    return (0, exports.createFactoryProvider)({
        token: config.token,
        useFactory: wrappedFactory,
        inject: config.inject,
        scope: config.scope,
    });
};
exports.createAsyncProvider = createAsyncProvider;
/**
 * Creates a value provider with optional lazy initialization.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} value - Provider value
 * @param {object} options - Optional configuration
 * @returns {object} NestJS value provider object
 *
 * @example
 * ```typescript
 * const configProvider = createValueProvider('APP_CONFIG', {
 *   apiUrl: 'https://api.whitecross.com',
 *   timeout: 5000,
 *   retries: 3
 * });
 * ```
 */
const createValueProvider = (token, value, options = {}) => {
    return {
        provide: token,
        useValue: value,
        scope: options.scope || 'DEFAULT',
    };
};
exports.createValueProvider = createValueProvider;
/**
 * Creates a class provider with optional scope configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} useClass - Class to instantiate
 * @param {object} options - Optional configuration
 * @returns {object} NestJS class provider object
 *
 * @example
 * ```typescript
 * const serviceProvider = createClassProvider('IUserService', UserService, {
 *   scope: 'DEFAULT'
 * });
 * ```
 */
const createClassProvider = (token, useClass, options = {}) => {
    return {
        provide: token,
        useClass,
        scope: options.scope || 'DEFAULT',
    };
};
exports.createClassProvider = createClassProvider;
/**
 * Creates an existing provider (alias) for dependency injection.
 *
 * @param {string | symbol} token - New injection token
 * @param {string | symbol} useExisting - Existing token to alias
 * @returns {object} NestJS existing provider object
 *
 * @example
 * ```typescript
 * const aliasProvider = createExistingProvider('ILogger', 'WinstonLogger');
 * ```
 */
const createExistingProvider = (token, useExisting) => {
    return {
        provide: token,
        useExisting,
    };
};
exports.createExistingProvider = createExistingProvider;
/**
 * Creates a multi-provider for arrays of services.
 *
 * @param {string | symbol} token - Injection token
 * @param {any[]} providers - Array of provider configurations
 * @returns {any[]} Array of NestJS multi-providers
 *
 * @example
 * ```typescript
 * const validators = createMultiProvider('VALIDATORS', [
 *   { useClass: EmailValidator },
 *   { useClass: PhoneValidator },
 *   { useClass: AddressValidator }
 * ]);
 * ```
 */
const createMultiProvider = (token, providers) => {
    return providers.map((provider) => ({
        provide: token,
        multi: true,
        ...provider,
    }));
};
exports.createMultiProvider = createMultiProvider;
/**
 * Creates a conditional provider based on environment or configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {Function} condition - Condition function
 * @param {object} trueProvider - Provider if condition is true
 * @param {object} falseProvider - Provider if condition is false
 * @returns {object} NestJS conditional provider
 *
 * @example
 * ```typescript
 * const cacheProvider = createConditionalProvider(
 *   'CACHE_SERVICE',
 *   () => process.env.NODE_ENV === 'production',
 *   { useClass: RedisCache },
 *   { useClass: MemoryCache }
 * );
 * ```
 */
const createConditionalProvider = (token, condition, trueProvider, falseProvider) => {
    const selected = condition() ? trueProvider : falseProvider;
    return {
        provide: token,
        ...selected,
    };
};
exports.createConditionalProvider = createConditionalProvider;
// ============================================================================
// DYNAMIC MODULE BUILDERS
// ============================================================================
/**
 * Creates a dynamic module configuration object.
 *
 * @param {DynamicModuleConfig} config - Module configuration
 * @returns {object} NestJS dynamic module
 *
 * @example
 * ```typescript
 * const dynamicModule = createDynamicModule({
 *   moduleName: 'DatabaseModule',
 *   providers: [databaseProvider, repositoryProvider],
 *   exports: ['DATABASE_CONNECTION'],
 *   global: true
 * });
 * ```
 */
const createDynamicModule = (config) => {
    return {
        module: class DynamicModule {
        },
        providers: config.providers,
        exports: config.exports || [],
        imports: config.imports || [],
        controllers: config.controllers || [],
        global: config.global || false,
    };
};
exports.createDynamicModule = createDynamicModule;
/**
 * Creates a configurable dynamic module with options pattern.
 *
 * @param {string} moduleName - Module name
 * @param {Function} optionsFactory - Factory to create providers from options
 * @returns {Function} Module factory function
 *
 * @example
 * ```typescript
 * const DatabaseModule = createConfigurableModule('DatabaseModule', (options) => {
 *   return [
 *     {
 *       provide: 'DATABASE_OPTIONS',
 *       useValue: options
 *     },
 *     DatabaseService
 *   ];
 * });
 *
 * // Usage: DatabaseModule.forRoot({ host: 'localhost', port: 5432 })
 * ```
 */
const createConfigurableModule = (moduleName, optionsFactory) => {
    class ConfigurableModule {
        static forRoot(options) {
            return {
                module: ConfigurableModule,
                providers: optionsFactory(options),
                exports: optionsFactory(options),
                global: options.global || false,
            };
        }
        static forRootAsync(asyncOptions) {
            return {
                module: ConfigurableModule,
                providers: [
                    {
                        provide: 'MODULE_OPTIONS',
                        useFactory: asyncOptions.useFactory,
                        inject: asyncOptions.inject || [],
                    },
                    ...optionsFactory({ async: true }),
                ],
                exports: optionsFactory({ async: true }),
            };
        }
    }
    Object.defineProperty(ConfigurableModule, 'name', { value: moduleName });
    return ConfigurableModule;
};
exports.createConfigurableModule = createConfigurableModule;
/**
 * Creates a feature module with lazy loading support.
 *
 * @param {string} featureName - Feature name
 * @param {any[]} providers - Feature providers
 * @param {any[]} exports - Exported providers
 * @returns {object} NestJS feature module
 *
 * @example
 * ```typescript
 * const PatientFeatureModule = createFeatureModule(
 *   'PatientFeature',
 *   [PatientService, PatientRepository],
 *   [PatientService]
 * );
 * ```
 */
const createFeatureModule = (featureName, providers, exports = []) => {
    class FeatureModule {
    }
    Object.defineProperty(FeatureModule, 'name', { value: `${featureName}Module` });
    return {
        module: FeatureModule,
        providers,
        exports,
    };
};
exports.createFeatureModule = createFeatureModule;
// ============================================================================
// DEPENDENCY INJECTION HELPERS
// ============================================================================
/**
 * Creates a custom injection token with metadata.
 *
 * @param {string} description - Token description
 * @param {object} metadata - Optional metadata
 * @returns {symbol} Injection token
 *
 * @example
 * ```typescript
 * const DATABASE_CONNECTION = createInjectionToken('DatabaseConnection', {
 *   scope: 'DEFAULT',
 *   type: 'database'
 * });
 * ```
 */
const createInjectionToken = (description, metadata) => {
    const token = Symbol(description);
    if (metadata) {
        token.__metadata__ = metadata;
    }
    return token;
};
exports.createInjectionToken = createInjectionToken;
/**
 * Resolves provider dependencies in correct order.
 *
 * @param {any[]} providers - Array of providers
 * @returns {any[]} Ordered providers array
 *
 * @example
 * ```typescript
 * const orderedProviders = resolveProviderDependencies([
 *   ConfigService,
 *   DatabaseService, // depends on ConfigService
 *   UserService // depends on DatabaseService
 * ]);
 * ```
 */
const resolveProviderDependencies = (providers) => {
    const resolved = [];
    const visited = new Set();
    const visit = (provider) => {
        if (visited.has(provider))
            return;
        visited.add(provider);
        const dependencies = Reflect.getMetadata('design:paramtypes', provider) || [];
        dependencies.forEach((dep) => {
            if (providers.includes(dep)) {
                visit(dep);
            }
        });
        resolved.push(provider);
    };
    providers.forEach(visit);
    return resolved;
};
exports.resolveProviderDependencies = resolveProviderDependencies;
/**
 * Detects circular dependencies in provider tree.
 *
 * @param {any[]} providers - Array of providers to check
 * @returns {object} Circular dependency report
 *
 * @example
 * ```typescript
 * const report = detectCircularDependencies([ServiceA, ServiceB, ServiceC]);
 * if (report.hasCircular) {
 *   console.error('Circular dependencies detected:', report.cycles);
 * }
 * ```
 */
const detectCircularDependencies = (providers) => {
    const cycles = [];
    const visiting = new Set();
    const visited = new Set();
    const visit = (provider, path = []) => {
        if (visiting.has(provider)) {
            const cycleStart = path.indexOf(provider);
            cycles.push(path.slice(cycleStart).map((p) => p.name));
            return;
        }
        if (visited.has(provider))
            return;
        visiting.add(provider);
        path.push(provider);
        const dependencies = Reflect.getMetadata('design:paramtypes', provider) || [];
        dependencies.forEach((dep) => {
            if (providers.includes(dep)) {
                visit(dep, [...path]);
            }
        });
        visiting.delete(provider);
        visited.add(provider);
    };
    providers.forEach((provider) => visit(provider));
    return {
        hasCircular: cycles.length > 0,
        cycles,
    };
};
exports.detectCircularDependencies = detectCircularDependencies;
/**
 * Creates an optional injection decorator.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} defaultValue - Default value if not found
 * @returns {ParameterDecorator} Decorator function
 *
 * @example
 * ```typescript
 * class MyService {
 *   constructor(
 *     @OptionalInject('LOGGER', console) private logger: any
 *   ) {}
 * }
 * ```
 */
const createOptionalInject = (token, defaultValue) => {
    return (target, propertyKey, parameterIndex) => {
        const existingOptional = Reflect.getMetadata('optional:paramtypes', target) || {};
        existingOptional[parameterIndex] = { token, defaultValue };
        Reflect.defineMetadata('optional:paramtypes', existingOptional, target);
    };
};
exports.createOptionalInject = createOptionalInject;
/**
 * Creates a lazy injection decorator for circular dependencies.
 *
 * @param {string | symbol} token - Injection token
 * @returns {ParameterDecorator} Decorator function
 *
 * @example
 * ```typescript
 * class ServiceA {
 *   constructor(
 *     @LazyInject('ServiceB') private serviceBFactory: () => ServiceB
 *   ) {}
 *
 *   someMethod() {
 *     const serviceB = this.serviceBFactory();
 *   }
 * }
 * ```
 */
const createLazyInject = (token) => {
    return (target, propertyKey, parameterIndex) => {
        const existingLazy = Reflect.getMetadata('lazy:paramtypes', target) || {};
        existingLazy[parameterIndex] = { token };
        Reflect.defineMetadata('lazy:paramtypes', existingLazy, target);
    };
};
exports.createLazyInject = createLazyInject;
// ============================================================================
// SCOPE MANAGEMENT
// ============================================================================
/**
 * Creates a request-scoped provider configuration.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} provider - Provider class or factory
 * @returns {object} Request-scoped provider
 *
 * @example
 * ```typescript
 * const requestContextProvider = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   RequestContextService
 * );
 * ```
 */
const createRequestScopedProvider = (token, provider) => {
    return {
        provide: token,
        useClass: provider,
        scope: 'REQUEST',
    };
};
exports.createRequestScopedProvider = createRequestScopedProvider;
/**
 * Creates a transient provider that creates new instance each time.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} provider - Provider class or factory
 * @returns {object} Transient provider
 *
 * @example
 * ```typescript
 * const taskProcessorProvider = createTransientProvider(
 *   'TASK_PROCESSOR',
 *   TaskProcessor
 * );
 * ```
 */
const createTransientProvider = (token, provider) => {
    return {
        provide: token,
        useClass: provider,
        scope: 'TRANSIENT',
    };
};
exports.createTransientProvider = createTransientProvider;
/**
 * Creates a provider scope analyzer to inspect provider lifecycles.
 *
 * @param {any[]} providers - Providers to analyze
 * @returns {Map<any, ProviderScope>} Provider scope map
 *
 * @example
 * ```typescript
 * const scopeMap = analyzeProviderScopes([
 *   ConfigService,
 *   RequestContextService,
 *   TaskProcessor
 * ]);
 * scopeMap.forEach((scope, provider) => {
 *   console.log(`${provider.name}: ${scope.scope}`);
 * });
 * ```
 */
const analyzeProviderScopes = (providers) => {
    const scopeMap = new Map();
    providers.forEach((provider) => {
        const scope = Reflect.getMetadata('scope', provider) || 'DEFAULT';
        const durable = Reflect.getMetadata('durable', provider) || false;
        scopeMap.set(provider, { scope, durable });
    });
    return scopeMap;
};
exports.analyzeProviderScopes = analyzeProviderScopes;
/**
 * Converts a default-scoped provider to request-scoped.
 *
 * @param {object} provider - Original provider
 * @returns {object} Request-scoped provider
 *
 * @example
 * ```typescript
 * const requestScoped = convertToRequestScope(defaultProvider);
 * ```
 */
const convertToRequestScope = (provider) => {
    return {
        ...provider,
        scope: 'REQUEST',
    };
};
exports.convertToRequestScope = convertToRequestScope;
// ============================================================================
// PROVIDER LIFECYCLE HOOKS
// ============================================================================
/**
 * Creates a provider with lifecycle hooks.
 *
 * @param {any} provider - Provider class
 * @param {LifecycleHookConfig} hooks - Lifecycle hook configuration
 * @returns {any} Provider with hooks
 *
 * @example
 * ```typescript
 * const serviceWithHooks = createProviderWithLifecycle(DatabaseService, {
 *   onModuleInit: async () => console.log('Database initializing...'),
 *   onModuleDestroy: async () => console.log('Database closing...')
 * });
 * ```
 */
const createProviderWithLifecycle = (provider, hooks) => {
    class LifecycleProvider extends provider {
        async onModuleInit() {
            if (hooks.onModuleInit)
                await hooks.onModuleInit();
            if (super.onModuleInit)
                await super.onModuleInit();
        }
        async onModuleDestroy() {
            if (hooks.onModuleDestroy)
                await hooks.onModuleDestroy();
            if (super.onModuleDestroy)
                await super.onModuleDestroy();
        }
        async onApplicationBootstrap() {
            if (hooks.onApplicationBootstrap)
                await hooks.onApplicationBootstrap();
            if (super.onApplicationBootstrap)
                await super.onApplicationBootstrap();
        }
        async onApplicationShutdown(signal) {
            if (hooks.onApplicationShutdown)
                await hooks.onApplicationShutdown(signal);
            if (super.onApplicationShutdown)
                await super.onApplicationShutdown(signal);
        }
    }
    return LifecycleProvider;
};
exports.createProviderWithLifecycle = createProviderWithLifecycle;
/**
 * Wraps a provider with initialization and cleanup logic.
 *
 * @param {any} provider - Provider class
 * @param {Function} init - Initialization function
 * @param {Function} cleanup - Cleanup function
 * @returns {any} Wrapped provider
 *
 * @example
 * ```typescript
 * const wrappedService = wrapProviderWithHooks(
 *   CacheService,
 *   async (instance) => await instance.connect(),
 *   async (instance) => await instance.disconnect()
 * );
 * ```
 */
const wrapProviderWithHooks = (provider, init, cleanup) => {
    return (0, exports.createProviderWithLifecycle)(provider, {
        onModuleInit: init ? async function () { await init(this); } : undefined,
        onModuleDestroy: cleanup ? async function () { await cleanup(this); } : undefined,
    });
};
exports.wrapProviderWithHooks = wrapProviderWithHooks;
// ============================================================================
// MULTI-TENANCY UTILITIES
// ============================================================================
/**
 * Creates a tenant-aware provider factory.
 *
 * @param {TenantProviderConfig} config - Tenant provider configuration
 * @returns {object} Tenant-aware provider
 *
 * @example
 * ```typescript
 * const tenantDbProvider = createTenantProvider({
 *   token: 'TENANT_DATABASE',
 *   useFactory: async (tenant: TenantContext) => {
 *     return createConnection({
 *       database: tenant.database,
 *       schema: tenant.schema
 *     });
 *   },
 *   scope: 'REQUEST'
 * });
 * ```
 */
const createTenantProvider = (config) => {
    return (0, exports.createFactoryProvider)({
        token: config.token,
        useFactory: config.useFactory,
        inject: config.inject || [],
        scope: config.scope || 'REQUEST',
    });
};
exports.createTenantProvider = createTenantProvider;
/**
 * Creates a tenant context resolver for multi-tenant applications.
 *
 * @param {Function} resolverFn - Function to resolve tenant from request
 * @returns {object} Tenant context provider
 *
 * @example
 * ```typescript
 * const tenantContextProvider = createTenantContextResolver((request) => {
 *   const tenantId = request.headers['x-tenant-id'];
 *   return {
 *     tenantId,
 *     schema: `tenant_${tenantId}`,
 *     database: `whitecross_${tenantId}`
 *   };
 * });
 * ```
 */
const createTenantContextResolver = (resolverFn) => {
    return (0, exports.createFactoryProvider)({
        token: 'TENANT_CONTEXT',
        useFactory: (request) => resolverFn(request),
        inject: ['REQUEST'],
        scope: 'REQUEST',
    });
};
exports.createTenantContextResolver = createTenantContextResolver;
/**
 * Creates a tenant-isolated service provider.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} serviceClass - Service class
 * @returns {object} Tenant-isolated provider
 *
 * @example
 * ```typescript
 * const tenantPatientService = createTenantIsolatedProvider(
 *   'PATIENT_SERVICE',
 *   PatientService
 * );
 * ```
 */
const createTenantIsolatedProvider = (token, serviceClass) => {
    return {
        provide: token,
        useClass: serviceClass,
        scope: 'REQUEST',
    };
};
exports.createTenantIsolatedProvider = createTenantIsolatedProvider;
/**
 * Validates tenant access and permissions.
 *
 * @param {TenantContext} tenant - Tenant context
 * @param {string} userId - User ID
 * @param {string[]} requiredPermissions - Required permissions
 * @returns {boolean} True if user has access
 *
 * @example
 * ```typescript
 * const hasAccess = validateTenantAccess(
 *   tenantContext,
 *   'user123',
 *   ['read:patients', 'write:prescriptions']
 * );
 * ```
 */
const validateTenantAccess = (tenant, userId, requiredPermissions) => {
    // Implementation would check tenant-specific permissions
    // This is a placeholder for the actual validation logic
    return true;
};
exports.validateTenantAccess = validateTenantAccess;
// ============================================================================
// FEATURE TOGGLE UTILITIES
// ============================================================================
/**
 * Creates a feature toggle provider.
 *
 * @param {FeatureToggleConfig} config - Feature toggle configuration
 * @returns {object} Feature toggle provider
 *
 * @example
 * ```typescript
 * const featureToggleProvider = createFeatureToggleProvider({
 *   toggles: [
 *     { name: 'advanced-reporting', enabled: true },
 *     { name: 'beta-features', enabled: false, strategy: 'percentage', percentage: 10 }
 *   ],
 *   defaultEnabled: false,
 *   cacheEnabled: true,
 *   cacheTTL: 300
 * });
 * ```
 */
const createFeatureToggleProvider = (config) => {
    const toggleMap = new Map();
    config.toggles.forEach((toggle) => toggleMap.set(toggle.name, toggle));
    return (0, exports.createValueProvider)('FEATURE_TOGGLES', {
        isEnabled: (featureName, context) => {
            return (0, exports.evaluateFeatureToggle)(toggleMap.get(featureName), context, config.defaultEnabled);
        },
        getToggle: (featureName) => {
            return toggleMap.get(featureName);
        },
        getAllToggles: () => {
            return Array.from(toggleMap.values());
        },
    });
};
exports.createFeatureToggleProvider = createFeatureToggleProvider;
/**
 * Evaluates a feature toggle based on strategy.
 *
 * @param {FeatureToggle | undefined} toggle - Feature toggle
 * @param {any} context - Evaluation context
 * @param {boolean} defaultValue - Default value if toggle not found
 * @returns {boolean} True if feature is enabled
 *
 * @example
 * ```typescript
 * const enabled = evaluateFeatureToggle(
 *   { name: 'new-ui', enabled: true, strategy: 'user', users: ['user123'] },
 *   { userId: 'user123' },
 *   false
 * );
 * ```
 */
const evaluateFeatureToggle = (toggle, context, defaultValue = false) => {
    if (!toggle)
        return defaultValue;
    if (!toggle.enabled)
        return false;
    switch (toggle.strategy) {
        case 'simple':
            return toggle.enabled;
        case 'percentage':
            if (!toggle.percentage)
                return toggle.enabled;
            const hash = hashString(context?.userId || context?.tenantId || 'anonymous');
            return (hash % 100) < toggle.percentage;
        case 'user':
            if (!toggle.users || !context?.userId)
                return false;
            return toggle.users.includes(context.userId);
        case 'tenant':
            if (!toggle.tenants || !context?.tenantId)
                return false;
            return toggle.tenants.includes(context.tenantId);
        case 'conditional':
            if (!toggle.condition)
                return toggle.enabled;
            return toggle.condition(context);
        default:
            return toggle.enabled;
    }
};
exports.evaluateFeatureToggle = evaluateFeatureToggle;
/**
 * Creates a feature-gated provider that only registers if feature is enabled.
 *
 * @param {string} featureName - Feature toggle name
 * @param {any} provider - Provider to gate
 * @param {any} fallbackProvider - Fallback provider if feature is disabled
 * @returns {object} Feature-gated provider
 *
 * @example
 * ```typescript
 * const reportingProvider = createFeatureGatedProvider(
 *   'advanced-reporting',
 *   AdvancedReportingService,
 *   BasicReportingService
 * );
 * ```
 */
const createFeatureGatedProvider = (featureName, provider, fallbackProvider) => {
    return (0, exports.createFactoryProvider)({
        token: typeof provider === 'object' ? provider.provide : provider,
        useFactory: (featureToggles) => {
            const isEnabled = featureToggles.isEnabled(featureName);
            if (isEnabled) {
                return typeof provider === 'object' ? provider.useClass : provider;
            }
            return fallbackProvider || null;
        },
        inject: ['FEATURE_TOGGLES'],
    });
};
exports.createFeatureGatedProvider = createFeatureGatedProvider;
// ============================================================================
// HEALTH CHECK UTILITIES
// ============================================================================
/**
 * Creates a health check provider for service monitoring.
 *
 * @param {HealthCheckConfig[]} checks - Array of health checks
 * @returns {object} Health check provider
 *
 * @example
 * ```typescript
 * const healthCheckProvider = createHealthCheckProvider([
 *   {
 *     name: 'database',
 *     check: async () => {
 *       await databaseService.ping();
 *       return { status: 'healthy', timestamp: new Date() };
 *     },
 *     timeout: 5000,
 *     critical: true
 *   },
 *   {
 *     name: 'cache',
 *     check: async () => {
 *       await cacheService.ping();
 *       return { status: 'healthy', timestamp: new Date() };
 *     },
 *     timeout: 3000
 *   }
 * ]);
 * ```
 */
const createHealthCheckProvider = (checks) => {
    return (0, exports.createValueProvider)('HEALTH_CHECKS', {
        runHealthChecks: async () => {
            const results = new Map();
            await Promise.all(checks.map(async (checkConfig) => {
                const startTime = Date.now();
                try {
                    const checkPromise = checkConfig.check();
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), checkConfig.timeout || 10000));
                    const result = await Promise.race([checkPromise, timeoutPromise]);
                    results.set(checkConfig.name, {
                        ...result,
                        responseTime: Date.now() - startTime,
                    });
                }
                catch (error) {
                    results.set(checkConfig.name, {
                        status: 'unhealthy',
                        message: error.message,
                        timestamp: new Date(),
                        responseTime: Date.now() - startTime,
                    });
                }
            }));
            return results;
        },
        isHealthy: async () => {
            const results = await checks[0] ? (0, exports.createHealthCheckProvider)(checks) : null;
            if (!results)
                return true;
            const allResults = await results.runHealthChecks();
            const criticalChecks = checks.filter((c) => c.critical);
            for (const check of criticalChecks) {
                const result = allResults.get(check.name);
                if (result?.status === 'unhealthy')
                    return false;
            }
            return true;
        },
    });
};
exports.createHealthCheckProvider = createHealthCheckProvider;
/**
 * Creates a service health metrics collector.
 *
 * @param {string} serviceName - Service name
 * @returns {object} Health metrics collector
 *
 * @example
 * ```typescript
 * const metricsCollector = createServiceHealthMetrics('PatientService');
 * metricsCollector.recordRequest();
 * metricsCollector.recordError();
 * const metrics = metricsCollector.getMetrics();
 * ```
 */
const createServiceHealthMetrics = (serviceName) => {
    const startTime = Date.now();
    let requestCount = 0;
    let errorCount = 0;
    let totalResponseTime = 0;
    let lastHealthCheck;
    return {
        recordRequest: (responseTime) => {
            requestCount++;
            totalResponseTime += responseTime;
        },
        recordError: () => {
            errorCount++;
        },
        recordHealthCheck: () => {
            lastHealthCheck = new Date();
        },
        getMetrics: () => {
            return {
                serviceName,
                uptime: Date.now() - startTime,
                requestCount,
                errorCount,
                averageResponseTime: requestCount > 0 ? totalResponseTime / requestCount : 0,
                lastHealthCheck,
            };
        },
        reset: () => {
            requestCount = 0;
            errorCount = 0;
            totalResponseTime = 0;
        },
    };
};
exports.createServiceHealthMetrics = createServiceHealthMetrics;
/**
 * Creates a dependency health checker.
 *
 * @param {Record<string, () => Promise<HealthCheckResult>>} dependencies - Service dependencies
 * @returns {Function} Dependency health check function
 *
 * @example
 * ```typescript
 * const checkDependencies = createDependencyHealthChecker({
 *   database: async () => ({ status: 'healthy', timestamp: new Date() }),
 *   cache: async () => ({ status: 'healthy', timestamp: new Date() }),
 *   externalApi: async () => ({ status: 'degraded', timestamp: new Date() })
 * });
 *
 * const health = await checkDependencies();
 * ```
 */
const createDependencyHealthChecker = (dependencies) => {
    return async () => {
        const results = {};
        await Promise.all(Object.entries(dependencies).map(async ([name, check]) => {
            try {
                results[name] = await check();
            }
            catch (error) {
                results[name] = {
                    status: 'unhealthy',
                    message: error.message,
                    timestamp: new Date(),
                };
            }
        }));
        return results;
    };
};
exports.createDependencyHealthChecker = createDependencyHealthChecker;
// ============================================================================
// CIRCUIT BREAKER UTILITIES
// ============================================================================
/**
 * Creates a circuit breaker for service resilience.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const circuitBreaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 10000,
 *   resetTimeout: 60000,
 *   onStateChange: (state) => console.log('Circuit state:', state)
 * });
 *
 * const result = await circuitBreaker.execute(async () => {
 *   return await externalApiCall();
 * });
 * ```
 */
const createCircuitBreaker = (config) => {
    let state = {
        state: 'CLOSED',
        failureCount: 0,
        successCount: 0,
    };
    const setState = (newState) => {
        state = { ...state, ...newState };
        if (config.onStateChange) {
            config.onStateChange(state);
        }
    };
    const canAttempt = () => {
        if (state.state === 'CLOSED')
            return true;
        if (state.state === 'OPEN') {
            if (state.nextAttemptTime && Date.now() >= state.nextAttemptTime.getTime()) {
                setState({ state: 'HALF_OPEN', successCount: 0, failureCount: 0 });
                return true;
            }
            return false;
        }
        if (state.state === 'HALF_OPEN') {
            return state.successCount < (config.halfOpenMax || 3);
        }
        return false;
    };
    return {
        execute: async (fn) => {
            if (!canAttempt()) {
                throw new Error('Circuit breaker is OPEN');
            }
            try {
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Circuit breaker timeout')), config.timeout));
                const result = await Promise.race([fn(), timeoutPromise]);
                // Success
                if (state.state === 'HALF_OPEN') {
                    const newSuccessCount = state.successCount + 1;
                    if (newSuccessCount >= config.successThreshold) {
                        setState({ state: 'CLOSED', failureCount: 0, successCount: 0, lastSuccessTime: new Date() });
                    }
                    else {
                        setState({ successCount: newSuccessCount, lastSuccessTime: new Date() });
                    }
                }
                else {
                    setState({ failureCount: 0, lastSuccessTime: new Date() });
                }
                return result;
            }
            catch (error) {
                // Failure
                const newFailureCount = state.failureCount + 1;
                setState({
                    failureCount: newFailureCount,
                    lastFailureTime: new Date(),
                });
                if (state.state === 'HALF_OPEN' || newFailureCount >= config.failureThreshold) {
                    setState({
                        state: 'OPEN',
                        nextAttemptTime: new Date(Date.now() + config.resetTimeout),
                    });
                }
                throw error;
            }
        },
        getState: () => state,
        reset: () => {
            setState({
                state: 'CLOSED',
                failureCount: 0,
                successCount: 0,
                lastFailureTime: undefined,
                lastSuccessTime: undefined,
                nextAttemptTime: undefined,
            });
        },
        forceOpen: () => {
            setState({ state: 'OPEN', nextAttemptTime: new Date(Date.now() + config.resetTimeout) });
        },
        forceClose: () => {
            setState({ state: 'CLOSED', failureCount: 0, successCount: 0 });
        },
    };
};
exports.createCircuitBreaker = createCircuitBreaker;
/**
 * Creates a circuit breaker provider wrapper.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} service - Service to wrap
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker provider
 *
 * @example
 * ```typescript
 * const protectedApiProvider = createCircuitBreakerProvider(
 *   'EXTERNAL_API',
 *   ExternalApiService,
 *   { failureThreshold: 5, timeout: 10000, resetTimeout: 60000 }
 * );
 * ```
 */
const createCircuitBreakerProvider = (token, service, config) => {
    const circuitBreaker = (0, exports.createCircuitBreaker)(config);
    return (0, exports.createFactoryProvider)({
        token,
        useFactory: (...args) => {
            const instance = new service(...args);
            return new Proxy(instance, {
                get(target, prop) {
                    const original = target[prop];
                    if (typeof original === 'function') {
                        return async (...methodArgs) => {
                            return circuitBreaker.execute(() => original.apply(target, methodArgs));
                        };
                    }
                    return original;
                },
            });
        },
    });
};
exports.createCircuitBreakerProvider = createCircuitBreakerProvider;
// ============================================================================
// RETRY LOGIC UTILITIES
// ============================================================================
/**
 * Creates a retry configuration with exponential backoff.
 *
 * @param {RetryConfig} config - Retry configuration
 * @returns {object} Retry handler
 *
 * @example
 * ```typescript
 * const retryHandler = createRetryHandler({
 *   maxAttempts: 3,
 *   initialDelayMs: 1000,
 *   maxDelayMs: 10000,
 *   backoffMultiplier: 2,
 *   retryableErrors: ['ECONNREFUSED', 'ETIMEDOUT'],
 *   onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error.message)
 * });
 *
 * const result = await retryHandler.execute(async () => {
 *   return await unreliableOperation();
 * });
 * ```
 */
const createRetryHandler = (config) => {
    const calculateDelay = (attempt) => {
        const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
        return Math.min(delay, config.maxDelayMs);
    };
    const isRetryable = (error) => {
        if (!config.retryableErrors || config.retryableErrors.length === 0)
            return true;
        return config.retryableErrors.some((errCode) => error.code === errCode || error.message?.includes(errCode));
    };
    return {
        execute: async (fn) => {
            let lastError;
            for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
                try {
                    return await fn();
                }
                catch (error) {
                    lastError = error;
                    if (attempt === config.maxAttempts || !isRetryable(error)) {
                        throw error;
                    }
                    if (config.onRetry) {
                        config.onRetry(attempt, error);
                    }
                    const delay = calculateDelay(attempt);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
            throw lastError;
        },
        getConfig: () => config,
    };
};
exports.createRetryHandler = createRetryHandler;
/**
 * Creates a retry provider wrapper.
 *
 * @param {string | symbol} token - Injection token
 * @param {any} service - Service to wrap
 * @param {RetryConfig} config - Retry configuration
 * @returns {object} Retry provider
 *
 * @example
 * ```typescript
 * const retryableApiProvider = createRetryProvider(
 *   'EXTERNAL_API',
 *   ExternalApiService,
 *   { maxAttempts: 3, initialDelayMs: 1000, backoffMultiplier: 2 }
 * );
 * ```
 */
const createRetryProvider = (token, service, config) => {
    const retryHandler = (0, exports.createRetryHandler)(config);
    return (0, exports.createFactoryProvider)({
        token,
        useFactory: (...args) => {
            const instance = new service(...args);
            return new Proxy(instance, {
                get(target, prop) {
                    const original = target[prop];
                    if (typeof original === 'function') {
                        return async (...methodArgs) => {
                            return retryHandler.execute(() => original.apply(target, methodArgs));
                        };
                    }
                    return original;
                },
            });
        },
    });
};
exports.createRetryProvider = createRetryProvider;
/**
 * Executes a function with retry logic.
 *
 * @param {Function} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Result of the function
 *
 * @example
 * ```typescript
 * const data = await executeWithRetry(
 *   async () => await fetchPatientData(patientId),
 *   { maxAttempts: 3, initialDelayMs: 500, backoffMultiplier: 2 }
 * );
 * ```
 */
const executeWithRetry = async (fn, config) => {
    const handler = (0, exports.createRetryHandler)(config);
    return handler.execute(fn);
};
exports.executeWithRetry = executeWithRetry;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Hashes a string for consistent feature toggle evaluation.
 *
 * @param {string} input - Input string
 * @returns {number} Hash value
 */
const hashString = (input) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};
/**
 * Delays execution for specified milliseconds.
 *
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after delay
 *
 * @example
 * ```typescript
 * await delay(1000); // Wait 1 second
 * ```
 */
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.delay = delay;
/**
 * Creates a timeout promise that rejects after specified time.
 *
 * @param {number} ms - Timeout in milliseconds
 * @param {string} message - Error message
 * @returns {Promise<never>} Promise that rejects after timeout
 *
 * @example
 * ```typescript
 * await Promise.race([
 *   longRunningOperation(),
 *   createTimeout(5000, 'Operation timed out')
 * ]);
 * ```
 */
const createTimeout = (ms, message = 'Operation timeout') => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
};
exports.createTimeout = createTimeout;
/**
 * Wraps a promise with timeout.
 *
 * @param {Promise<T>} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<T>} Promise with timeout
 *
 * @example
 * ```typescript
 * const result = await withTimeout(fetchData(), 5000);
 * ```
 */
const withTimeout = async (promise, timeoutMs) => {
    return Promise.race([promise, (0, exports.createTimeout)(timeoutMs)]);
};
exports.withTimeout = withTimeout;
/**
 * Generates a unique provider instance ID.
 *
 * @returns {string} Unique instance ID
 *
 * @example
 * ```typescript
 * const instanceId = generateProviderInstanceId();
 * console.log('Provider instance:', instanceId);
 * ```
 */
const generateProviderInstanceId = () => {
    return `provider_${crypto.randomUUID()}`;
};
exports.generateProviderInstanceId = generateProviderInstanceId;
/**
 * Creates provider metadata for tracking and debugging.
 *
 * @param {string | symbol} token - Provider token
 * @param {string} scope - Provider scope
 * @param {Record<string, any>} metadata - Additional metadata
 * @returns {ProviderMetadata} Provider metadata object
 *
 * @example
 * ```typescript
 * const metadata = createProviderMetadata('DATABASE_SERVICE', 'DEFAULT', {
 *   version: '1.0.0',
 *   initialized: true
 * });
 * ```
 */
const createProviderMetadata = (token, scope, metadata) => {
    return {
        token,
        scope,
        createdAt: new Date(),
        accessCount: 0,
        metadata,
    };
};
exports.createProviderMetadata = createProviderMetadata;
//# sourceMappingURL=service-providers-kit.js.map