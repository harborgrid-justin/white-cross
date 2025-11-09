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
import { Provider, Type, DynamicModule, ModuleMetadata, Scope } from '@nestjs/common';
import { Sequelize } from 'sequelize';
interface ProviderToken {
    token: string | symbol;
    description?: string;
}
interface FactoryProviderConfig<T> {
    provide: string | symbol | Type<any>;
    useFactory: (...args: any[]) => T | Promise<T>;
    inject?: (string | symbol | Type<any>)[];
    scope?: Scope;
}
interface ClassProviderConfig<T> {
    provide: string | symbol | Type<any>;
    useClass: Type<T>;
    scope?: Scope;
}
interface ValueProviderConfig<T> {
    provide: string | symbol | Type<any>;
    useValue: T;
}
interface ExistingProviderConfig {
    provide: string | symbol | Type<any>;
    useExisting: string | symbol | Type<any>;
}
interface AsyncProviderConfig<T> {
    provide: string | symbol | Type<any>;
    useFactory: (...args: any[]) => Promise<T>;
    inject?: (string | symbol | Type<any>)[];
}
interface DynamicModuleConfig {
    name: string;
    global?: boolean;
    providers?: Provider[];
    exports?: (string | symbol | Type<any> | Provider)[];
    imports?: Type<any>[];
}
interface ConditionalProviderConfig<T> {
    provide: string | symbol | Type<any>;
    condition: () => boolean | Promise<boolean>;
    useClass?: Type<T>;
    useFactory?: (...args: any[]) => T | Promise<T>;
    inject?: (string | symbol | Type<any>)[];
}
interface ScopeConfig {
    scope: Scope;
    durable?: boolean;
}
interface CircularDependencyConfig {
    forwardRef: () => Type<any>;
    optional?: boolean;
}
interface ProviderMetadata {
    token: string | symbol | Type<any>;
    scope: Scope;
    dependencies: (string | symbol | Type<any>)[];
    isAsync: boolean;
    isMulti: boolean;
}
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
export declare const createProviderToken: (name: string) => string;
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
export declare const createSymbolToken: (description: string) => symbol;
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
export declare const createNamespacedToken: (namespace: string, name: string) => string;
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
export declare const createDocumentedToken: (name: string, description: string) => ProviderToken;
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
export declare const isSymbolToken: (token: any) => token is symbol;
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
export declare const createClassProvider: <T>(config: ClassProviderConfig<T>) => Provider;
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
export declare const createValueProvider: <T>(config: ValueProviderConfig<T>) => Provider;
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
export declare const createFactoryProvider: <T>(config: FactoryProviderConfig<T>) => Provider;
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
export declare const createAliasProvider: (config: ExistingProviderConfig) => Provider;
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
export declare const createAsyncProvider: <T>(config: AsyncProviderConfig<T>) => Provider;
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
export declare const createDynamicModule: (config: DynamicModuleConfig) => DynamicModule;
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
export declare const createGlobalModule: (name: string, providers: Provider[], exports: any[]) => DynamicModule;
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
export declare const createFeatureModule: (name: string, providers: Provider[]) => DynamicModule;
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
export declare const createAsyncModule: (name: string, providerFactory: () => Promise<Provider[]>) => Promise<DynamicModule>;
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
export declare const mergeModuleConfigs: (modules: ModuleMetadata[]) => ModuleMetadata;
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
export declare const createRequestScopedProvider: (token: string | symbol | Type<any>, useClass: Type<any>) => Provider;
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
export declare const createTransientProvider: (token: string | symbol | Type<any>, useClass: Type<any>) => Provider;
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
export declare const createScopeConfig: (scope: Scope, durable?: boolean) => ScopeConfig;
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
export declare const determineOptimalScope: (isStateful: boolean, isPerRequest: boolean) => Scope;
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
export declare const createSingletonProvider: (token: string | symbol | Type<any>, useClass: Type<any>) => Provider;
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
export declare const createConditionalProvider: <T>(config: ConditionalProviderConfig<T>) => Promise<Provider | null>;
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
export declare const createEnvBasedProvider: (envVar: string, provider: Provider) => Provider | null;
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
export declare const createEnvironmentProvider: (token: string | symbol | Type<any>, devClass: Type<any>, prodClass: Type<any>) => Provider;
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
export declare const createFallbackProvider: (token: string | symbol | Type<any>, classes: Type<any>[]) => Provider;
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
export declare const createMultiProvider: (token: string | symbol, useClass: Type<any>) => Provider;
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
export declare const createMultiFactoryProvider: (token: string | symbol, factory: (...args: any[]) => any, inject?: any[]) => Provider;
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
export declare const collectMultiProviders: (token: string | symbol, providers: Provider[]) => Provider[];
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
export declare const createPluginRegistry: (registryToken: string, plugins: Type<any>[]) => Provider[];
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
export declare const createForwardRef: (forwardRef: () => Type<any>) => CircularDependencyConfig;
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
export declare const createOptionalForwardRef: (forwardRef: () => Type<any>) => CircularDependencyConfig;
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
export declare const detectCircularDependencies: (providers: Provider[]) => boolean;
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
export declare const createLazyProvider: (lazyClass: () => Type<any>) => Provider;
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
export declare const createSequelizeProvider: (token: string, configFactory: (...args: any[]) => Sequelize, inject?: any[]) => Provider;
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
export declare const createModelProvider: (token: string, model: any) => Provider;
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
export declare const createRepositoryProvider: (repository: Type<any>, modelToken: string) => Provider;
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
export declare const createTransactionProvider: (token: string, sequelizeToken: string) => Provider;
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
export declare const extractProviderMetadata: (provider: Provider) => ProviderMetadata;
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
export declare const validateProvider: (provider: Provider) => boolean;
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
export declare const generateDependencyGraph: (providers: Provider[]) => Map<any, Set<any>>;
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
export declare const findDependentProviders: (providers: Provider[], token: string | symbol | Type<any>) => Provider[];
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
export declare const createMockProvider: <T>(token: string | symbol | Type<any>, mockImplementation: Partial<T>) => Provider;
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
export declare const createSpyProvider: (token: string | symbol | Type<any>, realClass: Type<any>, spyFn: (instance: any) => any) => Provider;
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
export declare const createStubProvider: (token: string | symbol | Type<any>, methods: Record<string, any>) => Provider;
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
export declare const createTestModule: (module: ModuleMetadata, overrides: Provider[]) => ModuleMetadata;
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
export declare const createIntegrationTestProviders: (providers: Provider[], mocks: Map<any, Provider>) => Provider[];
export {};
//# sourceMappingURL=nestjs-dependency-injection-kit.d.ts.map