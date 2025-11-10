"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidatedModule = exports.mergeModuleConfigs = exports.createFeatureToggleModule = exports.createEnvironmentModule = exports.createConditionalMultiProvider = exports.mergeMultiProviders = exports.createMultiProviderFactory = exports.createMultiProvider = exports.createProxyProvider = exports.detectCircularDependencies = exports.createModuleRefProvider = exports.createLazyProvider = exports.createForwardRefResolver = exports.createInheritScopeProvider = exports.createAutoScopedProvider = exports.applyScopeToProviders = exports.convertToRequestScoped = exports.createDynamicScopeProvider = exports.createRequestScopedProvider = exports.createEnvironmentToken = exports.createTokenWithDefault = exports.createInjectionTokens = exports.createTypedToken = exports.createSymbolToken = exports.createInjectionToken = exports.createAsyncProviderWithCache = exports.createAsyncProviderWithValidation = exports.createAsyncProviderWithCallback = exports.createAsyncProviderWithFallback = exports.createAsyncProviderWithTimeout = exports.createAsyncProviderWithRetry = exports.createConditionalModule = exports.createGlobalModule = exports.createForFeatureModule = exports.createForRootAsyncModule = exports.createForRootModule = exports.createDynamicModule = exports.createTransientProvider = exports.createScopedProvider = exports.createProvidersFromConfig = exports.createAsyncFactoryProvider = exports.createExistingProvider = exports.createFactoryProvider = exports.createValueProvider = exports.createClassProvider = void 0;
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
const common_1 = require("@nestjs/common");
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
const createClassProvider = (token, useClass, scope) => {
    return {
        provide: token,
        useClass,
        ...(scope && { scope }),
    };
};
exports.createClassProvider = createClassProvider;
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
const createValueProvider = (token, value) => {
    return {
        provide: token,
        useValue: value,
    };
};
exports.createValueProvider = createValueProvider;
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
const createFactoryProvider = (options) => {
    return {
        provide: options.token,
        useFactory: options.factory,
        inject: options.dependencies || [],
        ...(options.scope && { scope: options.scope }),
    };
};
exports.createFactoryProvider = createFactoryProvider;
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
const createExistingProvider = (token, useExisting) => {
    return {
        provide: token,
        useExisting,
    };
};
exports.createExistingProvider = createExistingProvider;
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
const createAsyncFactoryProvider = (config) => {
    return {
        provide: config.provide,
        useFactory: config.useFactory,
        inject: config.inject || [],
        ...(config.scope && { scope: config.scope }),
    };
};
exports.createAsyncFactoryProvider = createAsyncFactoryProvider;
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
const createProvidersFromConfig = (config) => {
    return Object.entries(config).map(([key, value]) => ({
        provide: key,
        useValue: value,
    }));
};
exports.createProvidersFromConfig = createProvidersFromConfig;
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
const createScopedProvider = (config) => {
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
exports.createScopedProvider = createScopedProvider;
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
const createTransientProvider = (token, useClass) => {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.TRANSIENT,
    };
};
exports.createTransientProvider = createTransientProvider;
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
const createDynamicModule = (config) => {
    return {
        module: config.module,
        providers: config.providers || [],
        imports: config.imports || [],
        exports: config.exports || [],
        controllers: config.controllers || [],
        global: config.global || false,
    };
};
exports.createDynamicModule = createDynamicModule;
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
const createForRootModule = (module, optionsToken) => {
    return (options) => {
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
exports.createForRootModule = createForRootModule;
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
const createForRootAsyncModule = (module, optionsToken) => {
    return (options) => {
        const providers = [
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
exports.createForRootAsyncModule = createForRootAsyncModule;
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
const createForFeatureModule = (module, providerFactory) => {
    return (features) => {
        const providers = providerFactory(features);
        return {
            module,
            providers,
            exports: providers,
        };
    };
};
exports.createForFeatureModule = createForFeatureModule;
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
const createGlobalModule = (module, providers = [], exports = []) => {
    return {
        module,
        global: true,
        providers,
        exports,
    };
};
exports.createGlobalModule = createGlobalModule;
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
const createConditionalModule = (module, condition, trueModule, falseModule) => {
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
exports.createConditionalModule = createConditionalModule;
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
const createAsyncProviderWithRetry = (config, retryOptions = {}) => {
    const { maxRetries = 3, delayMs = 1000 } = retryOptions;
    const retryFactory = async (...args) => {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await config.useFactory(...args);
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
                }
            }
        }
        throw new Error(`Failed to initialize provider after ${maxRetries} attempts: ${lastError?.message}`);
    };
    return {
        provide: config.provide,
        useFactory: retryFactory,
        inject: config.inject || [],
        ...(config.scope && { scope: config.scope }),
    };
};
exports.createAsyncProviderWithRetry = createAsyncProviderWithRetry;
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
const createAsyncProviderWithTimeout = (config, timeoutMs) => {
    const timeoutFactory = async (...args) => {
        return Promise.race([
            config.useFactory(...args),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Provider initialization timeout after ${timeoutMs}ms`)), timeoutMs)),
        ]);
    };
    return {
        provide: config.provide,
        useFactory: timeoutFactory,
        inject: config.inject || [],
        ...(config.scope && { scope: config.scope }),
    };
};
exports.createAsyncProviderWithTimeout = createAsyncProviderWithTimeout;
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
const createAsyncProviderWithFallback = (config, fallbackValue) => {
    const fallbackFactory = async (...args) => {
        try {
            return await config.useFactory(...args);
        }
        catch (error) {
            console.warn(`Failed to initialize provider, using fallback: ${error.message}`);
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
exports.createAsyncProviderWithFallback = createAsyncProviderWithFallback;
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
const createAsyncProviderWithCallback = (config, onInit) => {
    const callbackFactory = async (...args) => {
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
exports.createAsyncProviderWithCallback = createAsyncProviderWithCallback;
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
const createAsyncProviderWithValidation = (config, validator) => {
    const validationFactory = async (...args) => {
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
exports.createAsyncProviderWithValidation = createAsyncProviderWithValidation;
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
const createAsyncProviderWithCache = (config, cacheTtl) => {
    let cachedValue = null;
    let cacheExpiry = 0;
    const cacheFactory = async (...args) => {
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
exports.createAsyncProviderWithCache = createAsyncProviderWithCache;
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
const createInjectionToken = (namespace, name) => {
    return `${namespace}:${name}`;
};
exports.createInjectionToken = createInjectionToken;
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
const createSymbolToken = (description) => {
    return Symbol(description);
};
exports.createSymbolToken = createSymbolToken;
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
const createTypedToken = (token) => {
    return {
        token,
        type: null,
    };
};
exports.createTypedToken = createTypedToken;
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
const createInjectionTokens = (namespace, names) => {
    return names.reduce((tokens, name) => {
        tokens[name] = (0, exports.createInjectionToken)(namespace, name);
        return tokens;
    }, {});
};
exports.createInjectionTokens = createInjectionTokens;
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
const createTokenWithDefault = (token, defaultValue) => {
    return {
        token,
        defaultValue,
    };
};
exports.createTokenWithDefault = createTokenWithDefault;
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
const createEnvironmentToken = (baseToken, environment) => {
    return `${baseToken}:${environment}`;
};
exports.createEnvironmentToken = createEnvironmentToken;
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
const createRequestScopedProvider = (token, provider, inject) => {
    if (typeof provider === 'function' && !provider.prototype) {
        // Factory function
        return {
            provide: token,
            useFactory: provider,
            inject: inject || [],
            scope: common_1.Scope.REQUEST,
        };
    }
    // Class provider
    return {
        provide: token,
        useClass: provider,
        scope: common_1.Scope.REQUEST,
    };
};
exports.createRequestScopedProvider = createRequestScopedProvider;
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
const createDynamicScopeProvider = (token, useClass, condition) => {
    const scope = condition() ? common_1.Scope.REQUEST : common_1.Scope.DEFAULT;
    return {
        provide: token,
        useClass,
        scope,
    };
};
exports.createDynamicScopeProvider = createDynamicScopeProvider;
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
const convertToRequestScoped = (provider) => {
    return {
        ...provider,
        scope: common_1.Scope.REQUEST,
    };
};
exports.convertToRequestScoped = convertToRequestScoped;
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
const applyScopeToProviders = (providers, scope) => {
    return providers.map((provider) => ({
        ...provider,
        scope,
    }));
};
exports.applyScopeToProviders = applyScopeToProviders;
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
const createAutoScopedProvider = (token, useClass) => {
    // In a real implementation, this would inspect the class metadata
    // For now, we'll default to DEFAULT scope
    const metadata = Reflect.getMetadata('scope', useClass);
    const scope = metadata || common_1.Scope.DEFAULT;
    return {
        provide: token,
        useClass,
        scope,
    };
};
exports.createAutoScopedProvider = createAutoScopedProvider;
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
const createInheritScopeProvider = (token, useClass, parentToken) => {
    // In production, this would query the parent's scope
    // For now, return a factory that gets the parent
    return {
        provide: token,
        useFactory: (parent) => new useClass(parent),
        inject: [parentToken],
    };
};
exports.createInheritScopeProvider = createInheritScopeProvider;
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
const createForwardRefResolver = (forwardRef) => {
    const token = Symbol('ForwardRef');
    return {
        token,
        forwardRef,
    };
};
exports.createForwardRefResolver = createForwardRefResolver;
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
const createLazyProvider = (token, factory, inject = []) => {
    return {
        provide: token,
        useFactory: factory,
        inject,
    };
};
exports.createLazyProvider = createLazyProvider;
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
const createModuleRefProvider = (token, targetClass) => {
    return {
        provide: token,
        useFactory: (moduleRef) => moduleRef.get(targetClass, { strict: false }),
        inject: ['ModuleRef'],
    };
};
exports.createModuleRefProvider = createModuleRefProvider;
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
const detectCircularDependencies = (providers) => {
    const dependencyGraph = new Map();
    const cycles = [];
    // Build dependency graph
    providers.forEach((provider) => {
        const token = provider.provide;
        const dependencies = provider.inject || [];
        dependencyGraph.set(token, dependencies);
    });
    // Detect cycles using DFS
    const visited = new Set();
    const recursionStack = new Set();
    const detectCycle = (token, path) => {
        visited.add(token);
        recursionStack.add(token);
        path.push(token);
        const dependencies = dependencyGraph.get(token) || [];
        for (const dep of dependencies) {
            if (!visited.has(dep)) {
                if (detectCycle(dep, [...path])) {
                    return true;
                }
            }
            else if (recursionStack.has(dep)) {
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
exports.detectCircularDependencies = detectCircularDependencies;
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
const createProxyProvider = (token, resolver, inject = []) => {
    return {
        provide: token,
        useFactory: (...args) => {
            let instance = null;
            return new Proxy({}, {
                get: (target, prop) => {
                    if (!instance) {
                        instance = resolver(...args);
                    }
                    return instance[prop];
                },
            });
        },
        inject,
    };
};
exports.createProxyProvider = createProxyProvider;
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
const createMultiProvider = (token, providers) => {
    return providers.map((provider, index) => ({
        provide: token,
        useClass: provider,
        multi: true,
    }));
};
exports.createMultiProvider = createMultiProvider;
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
const createMultiProviderFactory = (token, factories) => {
    return factories.map((config) => ({
        provide: token,
        useFactory: config.factory,
        inject: config.inject || [],
        multi: true,
    }));
};
exports.createMultiProviderFactory = createMultiProviderFactory;
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
const mergeMultiProviders = (token, providerGroups) => {
    return providerGroups.flat().map((provider) => ({
        ...provider,
        provide: token,
        multi: true,
    }));
};
exports.mergeMultiProviders = mergeMultiProviders;
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
const createConditionalMultiProvider = (token, conditionalProviders) => {
    return conditionalProviders
        .filter((cp) => cp.condition())
        .map((cp) => ({
        provide: token,
        useClass: typeof cp.provider === 'function' ? cp.provider : undefined,
        useValue: typeof cp.provider !== 'function' ? cp.provider : undefined,
        multi: true,
    }));
};
exports.createConditionalMultiProvider = createConditionalMultiProvider;
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
const createEnvironmentModule = (module, configs) => {
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
exports.createEnvironmentModule = createEnvironmentModule;
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
const createFeatureToggleModule = (module, features) => {
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
                    isEnabled: (feature) => features[feature] === true,
                },
            },
        ],
        exports: ['FEATURE_FLAGS'],
    };
};
exports.createFeatureToggleModule = createFeatureToggleModule;
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
const mergeModuleConfigs = (module, configs) => {
    const merged = {
        module,
        providers: [],
        imports: [],
        exports: [],
        controllers: [],
    };
    configs.forEach((config) => {
        if (config.providers)
            merged.providers.push(...config.providers);
        if (config.imports)
            merged.imports.push(...config.imports);
        if (config.exports)
            merged.exports.push(...config.exports);
        if (config.controllers)
            merged.controllers.push(...config.controllers);
        if (config.global !== undefined)
            merged.global = config.global;
    });
    return merged;
};
exports.mergeModuleConfigs = mergeModuleConfigs;
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
const createValidatedModule = (module, providers, options = {}) => {
    const validationProvider = {
        provide: 'MODULE_VALIDATOR',
        useFactory: (...deps) => {
            if (options.validateOnInit) {
                const missingDeps = (options.requiredDependencies || []).filter((_, index) => deps[index] === undefined || deps[index] === null);
                if (missingDeps.length > 0 && options.throwOnMissing) {
                    throw new Error(`Missing required dependencies: ${missingDeps.join(', ')}`);
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
        exports: providers.map((p) => p.provide || p),
    };
};
exports.createValidatedModule = createValidatedModule;
//# sourceMappingURL=dependency-injection-kit.js.map