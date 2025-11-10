"use strict";
/**
 * LOC: NDIK1234567
 * File: /reuse/nestjs-dependency-injection-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS modules and providers
 *   - Dynamic module factories
 *   - Custom provider configurations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIntegrationTestProviders = exports.createTestModule = exports.createStubProvider = exports.createSpyProvider = exports.createMockProvider = exports.findDependentProviders = exports.generateDependencyGraph = exports.validateProvider = exports.extractProviderMetadata = exports.createTransactionProvider = exports.createRepositoryProvider = exports.createModelProvider = exports.createSequelizeProvider = exports.createLazyProvider = exports.detectCircularDependencies = exports.createOptionalForwardRef = exports.createForwardRef = exports.createPluginRegistry = exports.collectMultiProviders = exports.createMultiFactoryProvider = exports.createMultiProvider = exports.createFallbackProvider = exports.createEnvironmentProvider = exports.createEnvBasedProvider = exports.createConditionalProvider = exports.createSingletonProvider = exports.determineOptimalScope = exports.createScopeConfig = exports.createTransientProvider = exports.createRequestScopedProvider = exports.mergeModuleConfigs = exports.createAsyncModule = exports.createFeatureModule = exports.createGlobalModule = exports.createDynamicModule = exports.createAsyncProvider = exports.createAliasProvider = exports.createFactoryProvider = exports.createValueProvider = exports.createClassProvider = exports.isSymbolToken = exports.createDocumentedToken = exports.createNamespacedToken = exports.createSymbolToken = exports.createProviderToken = void 0;
/**
 * File: /reuse/nestjs-dependency-injection-kit.ts
 * Locator: WC-UTL-NDIK-001
 * Purpose: Comprehensive NestJS Dependency Injection Utilities - Custom providers, factories, dynamic modules, scopes
 *
 * Upstream: Independent utility module for NestJS dependency injection patterns
 * Downstream: ../backend/*, NestJS modules, services, providers, dynamic configurations
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/common, Sequelize
 * Exports: 45 utility functions for DI patterns, custom providers, factories, scopes, dynamic modules, tokens
 *
 * LLM Context: Comprehensive dependency injection utilities for implementing advanced DI patterns in White Cross NestJS.
 * Provides custom provider factories, injection tokens, dynamic modules, scope management, circular dependency resolution,
 * conditional providers, multi-providers, and testing utilities. Essential for building modular, testable healthcare services.
 */
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
// ============================================================================
// PROVIDER TOKEN UTILITIES
// ============================================================================
/**
 * 1. Creates a unique string token for dependency injection.
 *
 * @param {string} name - Base name for the token
 * @returns {string} Unique injection token
 *
 * @example
 * ```typescript
 * const DB_CONFIG = createProviderToken('DATABASE_CONFIG');
 * // Result: 'DATABASE_CONFIG_a1b2c3d4'
 * ```
 */
const createProviderToken = (name) => {
    return `${name}_${(0, crypto_1.randomUUID)().substring(0, 8)}`;
};
exports.createProviderToken = createProviderToken;
/**
 * 2. Creates a symbol-based injection token for type-safe DI.
 *
 * @param {string} description - Description of the token
 * @returns {symbol} Symbol injection token
 *
 * @example
 * ```typescript
 * const DB_CONNECTION = createSymbolToken('Database Connection');
 * ```
 */
const createSymbolToken = (description) => {
    return Symbol.for(description);
};
exports.createSymbolToken = createSymbolToken;
/**
 * 3. Creates a namespaced token to prevent naming collisions.
 *
 * @param {string} namespace - Namespace for the token
 * @param {string} name - Token name
 * @returns {string} Namespaced token
 *
 * @example
 * ```typescript
 * const token = createNamespacedToken('patients', 'REPOSITORY');
 * // Result: 'patients:REPOSITORY'
 * ```
 */
const createNamespacedToken = (namespace, name) => {
    return `${namespace}:${name}`;
};
exports.createNamespacedToken = createNamespacedToken;
/**
 * 4. Creates a token with metadata for documentation.
 *
 * @param {string} name - Token name
 * @param {string} description - Token description
 * @returns {ProviderToken} Token with metadata
 *
 * @example
 * ```typescript
 * const token = createDocumentedToken('CACHE_SERVICE', 'Redis cache implementation');
 * ```
 */
const createDocumentedToken = (name, description) => {
    return {
        token: (0, exports.createSymbolToken)(name),
        description,
    };
};
exports.createDocumentedToken = createDocumentedToken;
/**
 * 5. Checks if a token is a symbol.
 *
 * @param {any} token - Token to check
 * @returns {boolean} True if symbol token
 *
 * @example
 * ```typescript
 * const isSymbol = isSymbolToken(Symbol.for('test')); // true
 * ```
 */
const isSymbolToken = (token) => {
    return typeof token === 'symbol';
};
exports.isSymbolToken = isSymbolToken;
// ============================================================================
// CUSTOM PROVIDER FACTORIES
// ============================================================================
/**
 * 6. Creates a class provider with custom configuration.
 *
 * @param {ClassProviderConfig<T>} config - Provider configuration
 * @returns {Provider} Class provider
 *
 * @example
 * ```typescript
 * const provider = createClassProvider({
 *   provide: 'USERS_SERVICE',
 *   useClass: UsersService,
 *   scope: Scope.REQUEST
 * });
 * ```
 */
const createClassProvider = (config) => {
    return {
        provide: config.provide,
        useClass: config.useClass,
        scope: config.scope || common_1.Scope.DEFAULT,
    };
};
exports.createClassProvider = createClassProvider;
/**
 * 7. Creates a value provider for static values.
 *
 * @param {ValueProviderConfig<T>} config - Provider configuration
 * @returns {Provider} Value provider
 *
 * @example
 * ```typescript
 * const provider = createValueProvider({
 *   provide: 'API_CONFIG',
 *   useValue: { baseUrl: 'https://api.example.com' }
 * });
 * ```
 */
const createValueProvider = (config) => {
    return {
        provide: config.provide,
        useValue: config.useValue,
    };
};
exports.createValueProvider = createValueProvider;
/**
 * 8. Creates a factory provider for dynamic value creation.
 *
 * @param {FactoryProviderConfig<T>} config - Factory configuration
 * @returns {Provider} Factory provider
 *
 * @example
 * ```typescript
 * const provider = createFactoryProvider({
 *   provide: 'DATABASE_CONNECTION',
 *   useFactory: (config) => createConnection(config),
 *   inject: [ConfigService]
 * });
 * ```
 */
const createFactoryProvider = (config) => {
    return {
        provide: config.provide,
        useFactory: config.useFactory,
        inject: config.inject || [],
        scope: config.scope || common_1.Scope.DEFAULT,
    };
};
exports.createFactoryProvider = createFactoryProvider;
/**
 * 9. Creates an alias provider that references an existing provider.
 *
 * @param {ExistingProviderConfig} config - Alias configuration
 * @returns {Provider} Existing provider
 *
 * @example
 * ```typescript
 * const provider = createAliasProvider({
 *   provide: 'LOGGER',
 *   useExisting: 'APP_LOGGER'
 * });
 * ```
 */
const createAliasProvider = (config) => {
    return {
        provide: config.provide,
        useExisting: config.useExisting,
    };
};
exports.createAliasProvider = createAliasProvider;
/**
 * 10. Creates an async factory provider for asynchronous initialization.
 *
 * @param {AsyncProviderConfig<T>} config - Async provider configuration
 * @returns {Provider} Async factory provider
 *
 * @example
 * ```typescript
 * const provider = createAsyncProvider({
 *   provide: 'VAULT_SECRET',
 *   useFactory: async (vault) => await vault.getSecret('db-password'),
 *   inject: [VaultService]
 * });
 * ```
 */
const createAsyncProvider = (config) => {
    return {
        provide: config.provide,
        useFactory: config.useFactory,
        inject: config.inject || [],
    };
};
exports.createAsyncProvider = createAsyncProvider;
// ============================================================================
// DYNAMIC MODULE UTILITIES
// ============================================================================
/**
 * 11. Creates a dynamic module with custom configuration.
 *
 * @param {DynamicModuleConfig} config - Module configuration
 * @returns {DynamicModule} Dynamic module
 *
 * @example
 * ```typescript
 * const module = createDynamicModule({
 *   name: 'CacheModule',
 *   providers: [CacheService],
 *   exports: [CacheService],
 *   global: true
 * });
 * ```
 */
const createDynamicModule = (config) => {
    return {
        module: class DynamicModule {
        },
        global: config.global || false,
        providers: config.providers || [],
        exports: config.exports || [],
        imports: config.imports || [],
    };
};
exports.createDynamicModule = createDynamicModule;
/**
 * 12. Creates a global dynamic module for app-wide availability.
 *
 * @param {string} name - Module name
 * @param {Provider[]} providers - Module providers
 * @param {any[]} exports - Exported providers
 * @returns {DynamicModule} Global dynamic module
 *
 * @example
 * ```typescript
 * const module = createGlobalModule('LoggerModule', [LoggerService], [LoggerService]);
 * ```
 */
const createGlobalModule = (name, providers, exports) => {
    return {
        module: class GlobalModule {
        },
        global: true,
        providers,
        exports,
    };
};
exports.createGlobalModule = createGlobalModule;
/**
 * 13. Creates a feature module with optional configuration.
 *
 * @param {string} name - Feature name
 * @param {Provider[]} providers - Feature providers
 * @returns {DynamicModule} Feature module
 *
 * @example
 * ```typescript
 * const module = createFeatureModule('Patients', [PatientsService, PatientsRepository]);
 * ```
 */
const createFeatureModule = (name, providers) => {
    return {
        module: class FeatureModule {
        },
        providers,
        exports: providers,
    };
};
exports.createFeatureModule = createFeatureModule;
/**
 * 14. Creates a dynamic module with async configuration.
 *
 * @param {string} name - Module name
 * @param {() => Promise<Provider[]>} providerFactory - Async provider factory
 * @returns {Promise<DynamicModule>} Dynamic module promise
 *
 * @example
 * ```typescript
 * const module = await createAsyncModule('DatabaseModule', async () => {
 *   const config = await loadConfig();
 *   return [createConnectionProvider(config)];
 * });
 * ```
 */
const createAsyncModule = async (name, providerFactory) => {
    const providers = await providerFactory();
    return {
        module: class AsyncModule {
        },
        providers,
        exports: providers,
    };
};
exports.createAsyncModule = createAsyncModule;
/**
 * 15. Merges multiple module configurations into one.
 *
 * @param {ModuleMetadata[]} modules - Module configurations to merge
 * @returns {ModuleMetadata} Merged module configuration
 *
 * @example
 * ```typescript
 * const merged = mergeModuleConfigs([moduleA, moduleB]);
 * ```
 */
const mergeModuleConfigs = (modules) => {
    return modules.reduce((acc, module) => ({
        imports: [...(acc.imports || []), ...(module.imports || [])],
        providers: [...(acc.providers || []), ...(module.providers || [])],
        exports: [...(acc.exports || []), ...(module.exports || [])],
        controllers: [...(acc.controllers || []), ...(module.controllers || [])],
    }), { imports: [], providers: [], exports: [], controllers: [] });
};
exports.mergeModuleConfigs = mergeModuleConfigs;
// ============================================================================
// SCOPE MANAGEMENT UTILITIES
// ============================================================================
/**
 * 16. Creates a request-scoped provider for per-request instances.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>} useClass - Class to instantiate
 * @returns {Provider} Request-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createRequestScopedProvider('REQUEST_CONTEXT', RequestContextService);
 * ```
 */
const createRequestScopedProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.REQUEST,
    };
};
exports.createRequestScopedProvider = createRequestScopedProvider;
/**
 * 17. Creates a transient provider for unique instances per injection.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>} useClass - Class to instantiate
 * @returns {Provider} Transient-scoped provider
 *
 * @example
 * ```typescript
 * const provider = createTransientProvider('TASK_PROCESSOR', TaskProcessor);
 * ```
 */
const createTransientProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.TRANSIENT,
    };
};
exports.createTransientProvider = createTransientProvider;
/**
 * 18. Configures provider scope with durable flag.
 *
 * @param {Scope} scope - Provider scope
 * @param {boolean} durable - Whether provider survives request lifecycle
 * @returns {ScopeConfig} Scope configuration
 *
 * @example
 * ```typescript
 * const config = createScopeConfig(Scope.REQUEST, true);
 * ```
 */
const createScopeConfig = (scope, durable = false) => {
    return { scope, durable };
};
exports.createScopeConfig = createScopeConfig;
/**
 * 19. Determines optimal scope based on provider characteristics.
 *
 * @param {boolean} isStateful - Whether provider maintains state
 * @param {boolean} isPerRequest - Whether provider is request-specific
 * @returns {Scope} Recommended scope
 *
 * @example
 * ```typescript
 * const scope = determineOptimalScope(true, true); // Scope.REQUEST
 * ```
 */
const determineOptimalScope = (isStateful, isPerRequest) => {
    if (isPerRequest)
        return common_1.Scope.REQUEST;
    if (isStateful)
        return common_1.Scope.TRANSIENT;
    return common_1.Scope.DEFAULT;
};
exports.determineOptimalScope = determineOptimalScope;
/**
 * 20. Creates a singleton provider explicitly (default scope).
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>} useClass - Class to instantiate
 * @returns {Provider} Singleton provider
 *
 * @example
 * ```typescript
 * const provider = createSingletonProvider('CONFIG_SERVICE', ConfigService);
 * ```
 */
const createSingletonProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.DEFAULT,
    };
};
exports.createSingletonProvider = createSingletonProvider;
// ============================================================================
// CONDITIONAL PROVIDER UTILITIES
// ============================================================================
/**
 * 21. Creates a provider that is conditionally registered.
 *
 * @param {ConditionalProviderConfig<T>} config - Conditional configuration
 * @returns {Promise<Provider | null>} Provider if condition met, null otherwise
 *
 * @example
 * ```typescript
 * const provider = await createConditionalProvider({
 *   provide: 'CACHE_SERVICE',
 *   condition: () => process.env.ENABLE_CACHE === 'true',
 *   useClass: RedisCacheService
 * });
 * ```
 */
const createConditionalProvider = async (config) => {
    const shouldCreate = await config.condition();
    if (!shouldCreate) {
        return null;
    }
    if (config.useClass) {
        return {
            provide: config.provide,
            useClass: config.useClass,
        };
    }
    if (config.useFactory) {
        return {
            provide: config.provide,
            useFactory: config.useFactory,
            inject: config.inject || [],
        };
    }
    return null;
};
exports.createConditionalProvider = createConditionalProvider;
/**
 * 22. Creates a provider based on environment variable.
 *
 * @param {string} envVar - Environment variable name
 * @param {Provider} provider - Provider to conditionally create
 * @returns {Provider | null} Provider if env var is truthy
 *
 * @example
 * ```typescript
 * const provider = createEnvBasedProvider('ENABLE_FEATURE_X', featureProvider);
 * ```
 */
const createEnvBasedProvider = (envVar, provider) => {
    const isEnabled = process.env[envVar] === 'true' || process.env[envVar] === '1';
    return isEnabled ? provider : null;
};
exports.createEnvBasedProvider = createEnvBasedProvider;
/**
 * 23. Creates a provider that switches based on environment.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>} devClass - Development implementation
 * @param {Type<any>} prodClass - Production implementation
 * @returns {Provider} Environment-specific provider
 *
 * @example
 * ```typescript
 * const provider = createEnvironmentProvider('EMAIL_SERVICE', MockEmailService, SendGridService);
 * ```
 */
const createEnvironmentProvider = (token, devClass, prodClass) => {
    const useClass = process.env.NODE_ENV === 'production' ? prodClass : devClass;
    return {
        provide: token,
        useClass,
    };
};
exports.createEnvironmentProvider = createEnvironmentProvider;
/**
 * 24. Creates a fallback provider chain with multiple options.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>[]} classes - Classes in priority order
 * @returns {Provider} Provider using first available class
 *
 * @example
 * ```typescript
 * const provider = createFallbackProvider('CACHE', [RedisCache, MemcachedCache, MemoryCache]);
 * ```
 */
const createFallbackProvider = (token, classes) => {
    return {
        provide: token,
        useFactory: (...deps) => {
            for (const cls of classes) {
                try {
                    return new cls(...deps);
                }
                catch (error) {
                    continue;
                }
            }
            throw new Error(`No fallback available for ${String(token)}`);
        },
    };
};
exports.createFallbackProvider = createFallbackProvider;
// ============================================================================
// MULTI-PROVIDER UTILITIES
// ============================================================================
/**
 * 25. Creates a multi-provider for collecting multiple implementations.
 *
 * @param {string | symbol} token - Provider token
 * @param {Type<any>} useClass - Class implementation
 * @returns {Provider} Multi-provider
 *
 * @example
 * ```typescript
 * const provider = createMultiProvider('VALIDATORS', EmailValidator);
 * // Can register multiple validators under same token
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
 * 26. Creates a multi-factory provider.
 *
 * @param {string | symbol} token - Provider token
 * @param {Function} factory - Factory function
 * @param {any[]} inject - Dependencies to inject
 * @returns {Provider} Multi-factory provider
 *
 * @example
 * ```typescript
 * const provider = createMultiFactoryProvider('INTERCEPTORS', () => new LoggingInterceptor(), []);
 * ```
 */
const createMultiFactoryProvider = (token, factory, inject = []) => {
    return {
        provide: token,
        useFactory: factory,
        inject,
        multi: true,
    };
};
exports.createMultiFactoryProvider = createMultiFactoryProvider;
/**
 * 27. Collects all multi-providers into an array provider.
 *
 * @param {string | symbol} token - Token to collect
 * @param {Provider[]} providers - Individual providers
 * @returns {Provider[]} Array of multi-providers
 *
 * @example
 * ```typescript
 * const providers = collectMultiProviders('PLUGINS', [plugin1, plugin2, plugin3]);
 * ```
 */
const collectMultiProviders = (token, providers) => {
    return providers.map(provider => ({
        ...provider,
        multi: true,
    }));
};
exports.collectMultiProviders = collectMultiProviders;
/**
 * 28. Creates a plugin registry using multi-providers.
 *
 * @param {string} registryToken - Token for the plugin registry
 * @param {Type<any>[]} plugins - Plugin classes
 * @returns {Provider[]} Plugin registry providers
 *
 * @example
 * ```typescript
 * const providers = createPluginRegistry('APP_PLUGINS', [AuthPlugin, LoggingPlugin]);
 * ```
 */
const createPluginRegistry = (registryToken, plugins) => {
    return plugins.map(plugin => ({
        provide: registryToken,
        useClass: plugin,
        multi: true,
    }));
};
exports.createPluginRegistry = createPluginRegistry;
// ============================================================================
// CIRCULAR DEPENDENCY RESOLUTION
// ============================================================================
/**
 * 29. Creates a forward reference for circular dependencies.
 *
 * @param {() => Type<any>} forwardRef - Function returning the type
 * @returns {CircularDependencyConfig} Forward ref configuration
 *
 * @example
 * ```typescript
 * const ref = createForwardRef(() => UsersService);
 * ```
 */
const createForwardRef = (forwardRef) => {
    return { forwardRef };
};
exports.createForwardRef = createForwardRef;
/**
 * 30. Creates an optional forward reference.
 *
 * @param {() => Type<any>} forwardRef - Function returning the type
 * @returns {CircularDependencyConfig} Optional forward ref
 *
 * @example
 * ```typescript
 * const ref = createOptionalForwardRef(() => OptionalService);
 * ```
 */
const createOptionalForwardRef = (forwardRef) => {
    return { forwardRef, optional: true };
};
exports.createOptionalForwardRef = createOptionalForwardRef;
/**
 * 31. Detects potential circular dependencies in provider graph.
 *
 * @param {Provider[]} providers - Providers to analyze
 * @returns {boolean} True if circular dependency detected
 *
 * @example
 * ```typescript
 * const hasCircular = detectCircularDependencies([serviceA, serviceB]);
 * ```
 */
const detectCircularDependencies = (providers) => {
    const dependencyGraph = new Map();
    providers.forEach(provider => {
        if ('inject' in provider && provider.inject) {
            dependencyGraph.set(provider.provide, new Set(provider.inject));
        }
    });
    const visited = new Set();
    const recursionStack = new Set();
    const hasCycle = (node) => {
        if (recursionStack.has(node))
            return true;
        if (visited.has(node))
            return false;
        visited.add(node);
        recursionStack.add(node);
        const dependencies = dependencyGraph.get(node);
        if (dependencies) {
            for (const dep of dependencies) {
                if (hasCycle(dep))
                    return true;
            }
        }
        recursionStack.delete(node);
        return false;
    };
    for (const [node] of dependencyGraph) {
        if (hasCycle(node))
            return true;
    }
    return false;
};
exports.detectCircularDependencies = detectCircularDependencies;
/**
 * 32. Breaks circular dependency using lazy loading.
 *
 * @param {() => Type<any>} lazyClass - Lazy-loaded class
 * @returns {Provider} Lazy-loaded provider
 *
 * @example
 * ```typescript
 * const provider = createLazyProvider(() => require('./circular-service').CircularService);
 * ```
 */
const createLazyProvider = (lazyClass) => {
    return {
        provide: lazyClass,
        useFactory: () => {
            const cls = lazyClass();
            return new cls();
        },
    };
};
exports.createLazyProvider = createLazyProvider;
// ============================================================================
// DATABASE-SPECIFIC PROVIDERS
// ============================================================================
/**
 * 33. Creates a Sequelize connection provider.
 *
 * @param {string} token - Connection token
 * @param {Function} configFactory - Configuration factory
 * @param {any[]} inject - Injected dependencies
 * @returns {Provider} Sequelize connection provider
 *
 * @example
 * ```typescript
 * const provider = createSequelizeProvider(
 *   'DB_CONNECTION',
 *   (config) => new Sequelize(config.database),
 *   [ConfigService]
 * );
 * ```
 */
const createSequelizeProvider = (token, configFactory, inject = []) => {
    return {
        provide: token,
        useFactory: configFactory,
        inject,
    };
};
exports.createSequelizeProvider = createSequelizeProvider;
/**
 * 34. Creates a model provider for Sequelize models.
 *
 * @param {string} token - Model token
 * @param {any} model - Sequelize model
 * @returns {Provider} Model provider
 *
 * @example
 * ```typescript
 * const provider = createModelProvider('USER_MODEL', UserModel);
 * ```
 */
const createModelProvider = (token, model) => {
    return {
        provide: token,
        useValue: model,
    };
};
exports.createModelProvider = createModelProvider;
/**
 * 35. Creates a repository provider with model injection.
 *
 * @param {Type<any>} repository - Repository class
 * @param {string} modelToken - Model token to inject
 * @returns {Provider} Repository provider
 *
 * @example
 * ```typescript
 * const provider = createRepositoryProvider(UserRepository, 'USER_MODEL');
 * ```
 */
const createRepositoryProvider = (repository, modelToken) => {
    return {
        provide: repository,
        useFactory: (model) => new repository(model),
        inject: [modelToken],
    };
};
exports.createRepositoryProvider = createRepositoryProvider;
/**
 * 36. Creates a transaction manager provider.
 *
 * @param {string} token - Transaction token
 * @param {string} sequelizeToken - Sequelize connection token
 * @returns {Provider} Transaction manager provider
 *
 * @example
 * ```typescript
 * const provider = createTransactionProvider('TX_MANAGER', 'DB_CONNECTION');
 * ```
 */
const createTransactionProvider = (token, sequelizeToken) => {
    return {
        provide: token,
        useFactory: (sequelize) => ({
            async execute(work) {
                return sequelize.transaction(work);
            },
        }),
        inject: [sequelizeToken],
    };
};
exports.createTransactionProvider = createTransactionProvider;
// ============================================================================
// PROVIDER METADATA AND INTROSPECTION
// ============================================================================
/**
 * 37. Extracts metadata from a provider configuration.
 *
 * @param {Provider} provider - Provider to analyze
 * @returns {ProviderMetadata} Provider metadata
 *
 * @example
 * ```typescript
 * const metadata = extractProviderMetadata(myProvider);
 * // { token: 'SERVICE', scope: Scope.DEFAULT, dependencies: [...], ... }
 * ```
 */
const extractProviderMetadata = (provider) => {
    const metadata = {
        token: provider.provide,
        scope: provider.scope || common_1.Scope.DEFAULT,
        dependencies: [],
        isAsync: false,
        isMulti: !!provider.multi,
    };
    if ('inject' in provider && provider.inject) {
        metadata.dependencies = provider.inject;
    }
    if ('useFactory' in provider && provider.useFactory) {
        const factoryStr = provider.useFactory.toString();
        metadata.isAsync = factoryStr.includes('async') || factoryStr.includes('Promise');
    }
    return metadata;
};
exports.extractProviderMetadata = extractProviderMetadata;
/**
 * 38. Validates provider configuration for completeness.
 *
 * @param {Provider} provider - Provider to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateProvider(myProvider); // true/false
 * ```
 */
const validateProvider = (provider) => {
    if (!provider.provide)
        return false;
    const hasImplementation = 'useClass' in provider ||
        'useValue' in provider ||
        'useFactory' in provider ||
        'useExisting' in provider;
    return hasImplementation;
};
exports.validateProvider = validateProvider;
/**
 * 39. Generates a dependency graph from providers.
 *
 * @param {Provider[]} providers - Providers to graph
 * @returns {Map<any, Set<any>>} Dependency graph
 *
 * @example
 * ```typescript
 * const graph = generateDependencyGraph([serviceA, serviceB]);
 * ```
 */
const generateDependencyGraph = (providers) => {
    const graph = new Map();
    providers.forEach(provider => {
        if (!graph.has(provider.provide)) {
            graph.set(provider.provide, new Set());
        }
        if ('inject' in provider && provider.inject) {
            const dependencies = graph.get(provider.provide);
            provider.inject.forEach(dep => dependencies.add(dep));
        }
    });
    return graph;
};
exports.generateDependencyGraph = generateDependencyGraph;
/**
 * 40. Finds all providers that depend on a specific token.
 *
 * @param {Provider[]} providers - All providers
 * @param {string | symbol | Type<any>} token - Token to find dependents of
 * @returns {Provider[]} Dependent providers
 *
 * @example
 * ```typescript
 * const dependents = findDependentProviders(allProviders, 'CONFIG_SERVICE');
 * ```
 */
const findDependentProviders = (providers, token) => {
    return providers.filter(provider => {
        if ('inject' in provider && provider.inject) {
            return provider.inject.includes(token);
        }
        return false;
    });
};
exports.findDependentProviders = findDependentProviders;
// ============================================================================
// TESTING UTILITIES
// ============================================================================
/**
 * 41. Creates a mock provider for testing.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Partial<T>} mockImplementation - Mock implementation
 * @returns {Provider} Mock provider
 *
 * @example
 * ```typescript
 * const mock = createMockProvider('USERS_SERVICE', {
 *   findById: jest.fn().mockResolvedValue(user)
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
 * 42. Creates a spy provider that wraps real implementation.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Type<any>} realClass - Real class to wrap
 * @param {Function} spyFn - Spy function wrapper
 * @returns {Provider} Spy provider
 *
 * @example
 * ```typescript
 * const spy = createSpyProvider('SERVICE', RealService, (instance) => jest.spyOn(instance));
 * ```
 */
const createSpyProvider = (token, realClass, spyFn) => {
    return {
        provide: token,
        useFactory: (...deps) => {
            const instance = new realClass(...deps);
            return spyFn(instance);
        },
    };
};
exports.createSpyProvider = createSpyProvider;
/**
 * 43. Creates a stub provider with predefined responses.
 *
 * @param {string | symbol | Type<any>} token - Provider token
 * @param {Record<string, any>} methods - Method stubs
 * @returns {Provider} Stub provider
 *
 * @example
 * ```typescript
 * const stub = createStubProvider('API_CLIENT', {
 *   get: () => Promise.resolve({ data: [] }),
 *   post: () => Promise.resolve({ success: true })
 * });
 * ```
 */
const createStubProvider = (token, methods) => {
    return {
        provide: token,
        useValue: methods,
    };
};
exports.createStubProvider = createStubProvider;
/**
 * 44. Creates a test module with overridden providers.
 *
 * @param {ModuleMetadata} module - Original module
 * @param {Provider[]} overrides - Provider overrides
 * @returns {ModuleMetadata} Test module configuration
 *
 * @example
 * ```typescript
 * const testModule = createTestModule(AppModule, [
 *   createMockProvider('DB_CONNECTION', mockDb)
 * ]);
 * ```
 */
const createTestModule = (module, overrides) => {
    const overrideTokens = new Set(overrides.map(p => p.provide));
    const filteredProviders = (module.providers || []).filter(provider => !overrideTokens.has(provider.provide));
    return {
        ...module,
        providers: [...filteredProviders, ...overrides],
    };
};
exports.createTestModule = createTestModule;
/**
 * 45. Creates a provider collection for integration tests.
 *
 * @param {Provider[]} providers - Real providers
 * @param {Map<any, Provider>} mocks - Mock overrides map
 * @returns {Provider[]} Combined provider set
 *
 * @example
 * ```typescript
 * const providers = createIntegrationTestProviders(
 *   [ServiceA, ServiceB],
 *   new Map([['EXTERNAL_API', mockApiProvider]])
 * );
 * ```
 */
const createIntegrationTestProviders = (providers, mocks) => {
    return providers.map(provider => {
        const mockOverride = mocks.get(provider.provide);
        return mockOverride || provider;
    });
};
exports.createIntegrationTestProviders = createIntegrationTestProviders;
//# sourceMappingURL=nestjs-dependency-injection-kit.js.map