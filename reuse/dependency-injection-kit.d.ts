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
import { DynamicModule, Provider, Type, Scope, FactoryProvider, ValueProvider, ClassProvider, ExistingProvider } from '@nestjs/common';
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
interface ScopedProviderConfig {
    provide: any;
    scope: Scope;
    useClass?: Type<any>;
    useFactory?: (...args: any[]) => any;
    inject?: any[];
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
export declare const createClassProvider: (token: any, useClass: Type<any>, scope?: Scope) => ClassProvider;
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
export declare const createValueProvider: (token: any, value: any) => ValueProvider;
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
export declare const createFactoryProvider: <T = any>(options: FactoryProviderOptions<T>) => FactoryProvider<T>;
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
export declare const createExistingProvider: (token: any, useExisting: any) => ExistingProvider;
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
export declare const createAsyncFactoryProvider: <T = any>(config: AsyncProviderConfig<T>) => FactoryProvider<Promise<T>>;
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
export declare const createProvidersFromConfig: (config: Record<string, any>) => ValueProvider[];
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
export declare const createScopedProvider: (config: ScopedProviderConfig) => Provider;
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
export declare const createTransientProvider: (token: any, useClass: Type<any>) => ClassProvider;
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
export declare const createDynamicModule: (config: DynamicModuleConfig) => DynamicModule;
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
export declare const createForRootModule: (module: Type<any>, optionsToken: any) => (options: any) => DynamicModule;
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
export declare const createForRootAsyncModule: (module: Type<any>, optionsToken: any) => (options: AsyncModuleOptions) => DynamicModule;
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
export declare const createForFeatureModule: (module: Type<any>, providerFactory: (features: any[]) => Provider[]) => (features: any[]) => DynamicModule;
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
export declare const createGlobalModule: (module: Type<any>, providers?: Provider[], exports?: any[]) => DynamicModule;
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
export declare const createConditionalModule: (module: Type<any>, condition: () => boolean, trueModule: Partial<DynamicModule>, falseModule?: Partial<DynamicModule>) => DynamicModule;
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
export declare const createAsyncProviderWithRetry: <T = any>(config: AsyncProviderConfig<T>, retryOptions?: {
    maxRetries?: number;
    delayMs?: number;
}) => FactoryProvider;
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
export declare const createAsyncProviderWithTimeout: <T = any>(config: AsyncProviderConfig<T>, timeoutMs: number) => FactoryProvider;
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
export declare const createAsyncProviderWithFallback: <T = any>(config: AsyncProviderConfig<T>, fallbackValue: T) => FactoryProvider;
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
export declare const createAsyncProviderWithCallback: <T = any>(config: AsyncProviderConfig<T>, onInit: (value: T) => void | Promise<void>) => FactoryProvider;
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
export declare const createAsyncProviderWithValidation: <T = any>(config: AsyncProviderConfig<T>, validator: (value: T) => boolean | Promise<boolean>) => FactoryProvider;
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
export declare const createAsyncProviderWithCache: <T = any>(config: AsyncProviderConfig<T>, cacheTtl: number) => FactoryProvider;
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
export declare const createInjectionToken: (namespace: string, name: string) => string;
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
export declare const createSymbolToken: (description: string) => symbol;
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
export declare const createTypedToken: <T>(token: string) => {
    token: string;
    type: T;
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
export declare const createInjectionTokens: (namespace: string, names: string[]) => Record<string, string>;
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
export declare const createTokenWithDefault: <T>(token: string, defaultValue: T) => {
    token: string;
    defaultValue: T;
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
export declare const createEnvironmentToken: (baseToken: string, environment: string) => string;
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
export declare const createRequestScopedProvider: (token: any, provider: Type<any> | ((...args: any[]) => any), inject?: any[]) => Provider;
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
export declare const createDynamicScopeProvider: (token: any, useClass: Type<any>, condition: () => boolean) => Provider;
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
export declare const convertToRequestScoped: (provider: Provider) => Provider;
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
export declare const applyScopeToProviders: (providers: Provider[], scope: Scope) => Provider[];
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
export declare const createAutoScopedProvider: (token: any, useClass: Type<any>) => Provider;
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
export declare const createInheritScopeProvider: (token: any, useClass: Type<any>, parentToken: any) => Provider;
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
export declare const createForwardRefResolver: (forwardRef: () => Type<any>) => CircularDependencyResolver;
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
export declare const createLazyProvider: (token: any, factory: (...args: any[]) => () => any, inject?: any[]) => FactoryProvider;
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
export declare const createModuleRefProvider: (token: any, targetClass: Type<any>) => FactoryProvider;
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
export declare const detectCircularDependencies: (providers: Provider[]) => {
    hasCircular: boolean;
    cycles: string[][];
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
export declare const createProxyProvider: (token: any, resolver: (...args: any[]) => any, inject?: any[]) => FactoryProvider;
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
export declare const createMultiProvider: (token: any, providers: any[]) => Provider[];
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
export declare const createMultiProviderFactory: (token: any, factories: Array<{
    factory: (...args: any[]) => any;
    inject?: any[];
}>) => Provider[];
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
export declare const mergeMultiProviders: (token: any, providerGroups: Provider[][]) => Provider[];
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
export declare const createConditionalMultiProvider: (token: any, conditionalProviders: Array<{
    provider: Type<any> | any;
    condition: () => boolean;
}>) => Provider[];
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
export declare const createEnvironmentModule: (module: Type<any>, configs: Record<string, any>) => DynamicModule;
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
export declare const createFeatureToggleModule: (module: Type<any>, features: Record<string, boolean>) => DynamicModule;
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
export declare const mergeModuleConfigs: (module: Type<any>, configs: Partial<DynamicModule>[]) => DynamicModule;
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
export declare const createValidatedModule: (module: Type<any>, providers: Provider[], options?: {
    requiredDependencies?: any[];
    validateOnInit?: boolean;
    throwOnMissing?: boolean;
}) => DynamicModule;
export {};
//# sourceMappingURL=dependency-injection-kit.d.ts.map