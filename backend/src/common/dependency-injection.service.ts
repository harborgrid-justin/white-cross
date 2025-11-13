/**
 * @fileoverview Enterprise-ready NestJS Dependency Injection Utilities
 * @module reuse/data/dependency-injection
 * @description Production-grade DI patterns, dynamic providers, factory patterns,
 * scope management, and advanced IoC container utilities for scalable NestJS applications
 *
 * ## Provider Scopes - When to Use What
 *
 * ### Singleton (Scope.DEFAULT)
 * - **Use for**: Services, repositories, configurations, database connections
 * - **Lifecycle**: One instance per application
 * - **Performance**: Best (lowest memory, fastest)
 * - **Thread Safety**: Must handle concurrent access
 *
 * ### Request-Scoped (Scope.REQUEST)
 * - **Use for**: Request context, user sessions, per-request caching
 * - **Lifecycle**: One instance per HTTP request
 * - **Performance**: Moderate (new instance per request)
 * - **Thread Safety**: Isolated per request
 *
 * ### Transient (Scope.TRANSIENT)
 * - **Use for**: Unique instances, stateless utilities, task processors
 * - **Lifecycle**: New instance every injection
 * - **Performance**: Slowest (highest memory usage)
 * - **Thread Safety**: Each injection is isolated
 *
 * ## Circular Dependency Prevention
 *
 * ### Best Practices
 * 1. **Use forwardRef()** for unavoidable circular dependencies
 * 2. **Prefer interface-based dependencies** over concrete classes
 * 3. **Extract shared logic** into a third service
 * 4. **Use events** instead of direct service calls
 * 5. **Validate dependency graph** in unit tests
 *
 * ### Example: Breaking Circular Dependencies
 * ```typescript
 * // BAD - Circular dependency
 * @Injectable()
 * class UserService {
 *   constructor(private authService: AuthService) {}
 * }
 *
 * @Injectable()
 * class AuthService {
 *   constructor(private userService: UserService) {} // CIRCULAR!
 * }
 *
 * // GOOD - Using forwardRef
 * @Injectable()
 * class UserService {
 *   constructor(
 *     @Inject(forwardRef(() => AuthService))
 *     private authService: AuthService
 *   ) {}
 * }
 *
 * // BETTER - Extract to third service
 * @Injectable()
 * class UserAuthService {
 *   constructor(
 *     private userRepo: UserRepository,
 *     private authRepo: AuthRepository
 *   ) {}
 * }
 * ```
 *
 * ## Module Organization Best Practices
 *
 * 1. **Feature Modules**: Group related providers
 * 2. **Shared Modules**: Export common providers as Global
 * 3. **Core Module**: Singleton services, imported once
 * 4. **Dynamic Modules**: Configuration-based providers
 * 5. **Testing Modules**: Override providers for testing
 */

import {
  Provider,
  Type,
  DynamicModule,
  Scope,
  Injectable,
  Inject,
  Optional,
  SetMetadata,
  applyDecorators,
  Logger,
} from '@nestjs/common';
import {
  ModuleRef,
  ContextIdFactory,
  ModuleMetadata,
} from '@nestjs/core';
import { randomUUID } from 'crypto';

import { BaseService } from '@/common/base';
/**
 * Provider token type for injection
 */
export type ProviderToken = string | symbol | Type<any>;

/**
 * Dynamic provider registration options
 */
export interface DynamicProviderOptions {
  provide: ProviderToken;
  scope?: Scope;
  useClass?: Type<any>;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  inject?: ProviderToken[];
}

/**
 * Registers a dynamic provider with the IoC container
 * @param options Provider configuration options
 * @returns Provider object ready for module registration
 * @description Creates a provider configuration for dynamic module registration.
 * Supports class, value, and factory-based providers with configurable scope.
 *
 * @remarks
 * - **Scope**: Configurable via options.scope (DEFAULT, REQUEST, TRANSIENT)
 * - **Use Case**: Dynamic provider registration in configurable modules
 * - **Circular Dependencies**: Use inject array with forwardRef for circular deps
 *
 * @example
 * ```typescript
 * // Class provider
 * const userServiceProvider = registerDynamicProvider({
 *   provide: 'USER_SERVICE',
 *   useClass: UserService,
 *   scope: Scope.DEFAULT
 * });
 *
 * // Value provider
 * const configProvider = registerDynamicProvider({
 *   provide: 'CONFIG',
 *   useValue: { apiUrl: 'https://api.example.com' }
 * });
 *
 * // Factory provider with dependencies
 * const dbProvider = registerDynamicProvider({
 *   provide: 'DATABASE',
 *   useFactory: (config: ConfigService) => createConnection(config),
 *   inject: [ConfigService]
 * });
 * ```
 */
export function registerDynamicProvider(options: DynamicProviderOptions): Provider {
  const provider: Provider = {
    provide: options.provide,
    scope: options.scope,
  } as any;

  if (options.useClass) {
    (provider as any).useClass = options.useClass;
  } else if (options.useValue !== undefined) {
    (provider as any).useValue = options.useValue;
  } else if (options.useFactory) {
    (provider as any).useFactory = options.useFactory;
    (provider as any).inject = options.inject || [];
  }

  return provider;
}

/**
 * Creates a dynamic provider array from options
 * @param optionsArray Array of provider options
 * @returns Array of Provider objects
 */
export function registerDynamicProviders(
  optionsArray: DynamicProviderOptions[],
): Provider[] {
  return optionsArray.map(options => registerDynamicProvider(options));
}

/**
 * Factory provider configuration
 */
export interface FactoryProviderConfig<T = any> {
  token: ProviderToken;
  factory: (...args: any[]) => T | Promise<T>;
  dependencies?: ProviderToken[];
  scope?: Scope;
}

/**
 * Creates a factory provider
 * @template T Return type of the factory function
 * @param config Factory provider configuration
 * @returns Provider object ready for module registration
 * @description Simplifies creation of factory-based providers.
 * Use factories when provider instantiation requires custom logic or async operations.
 *
 * @remarks
 * - **Scope**: Configurable via config.scope
 * - **Dependencies**: Automatically injected into factory function
 * - **Use Case**: Complex initialization, async setup, configuration-based creation
 *
 * @example
 * ```typescript
 * // Database connection factory
 * const dbProvider = createFactoryProvider({
 *   token: 'DATABASE',
 *   factory: async (config: ConfigService) => {
 *     const connection = await createConnection({
 *       host: config.get('DB_HOST'),
 *       port: config.get('DB_PORT'),
 *     });
 *     await connection.connect();
 *     return connection;
 *   },
 *   dependencies: [ConfigService],
 *   scope: Scope.DEFAULT
 * });
 *
 * // API client factory with authentication
 * const apiClientProvider = createFactoryProvider({
 *   token: 'API_CLIENT',
 *   factory: (config: ConfigService, http: HttpService) => {
 *     return http.create({
 *       baseURL: config.get('API_URL'),
 *       headers: { 'X-API-Key': config.get('API_KEY') }
 *     });
 *   },
 *   dependencies: [ConfigService, HttpService]
 * });
 * ```
 */
export function createFactoryProvider<T>(config: FactoryProviderConfig<T>): Provider {
  return {
    provide: config.token,
    useFactory: config.factory,
    inject: config.dependencies || [],
    scope: config.scope,
  };
}

/**
 * Creates multiple factory providers
 * @param configs Array of factory provider configurations
 * @returns Array of Provider objects
 */
export function createFactoryProviders(
  configs: FactoryProviderConfig[],
): Provider[] {
  return configs.map(config => createFactoryProvider(config));
}

/**
 * Async provider configuration
 */
export interface AsyncProviderConfig<T = any> {
  token: ProviderToken;
  asyncFactory: (...args: any[]) => Promise<T>;
  dependencies?: ProviderToken[];
  scope?: Scope;
}

/**
 * Creates an async factory provider
 * @param config Async provider configuration
 * @returns Provider object
 * @description Creates providers that initialize asynchronously
 */
export function createAsyncProvider<T>(config: AsyncProviderConfig<T>): Provider {
  return {
    provide: config.token,
    useFactory: async (...args: any[]) => {
      return await config.asyncFactory(...args);
    },
    inject: config.dependencies || [],
    scope: config.scope,
  };
}

/**
 * Creates multiple async providers
 * @param configs Array of async provider configurations
 * @returns Array of Provider objects
 */
export function createAsyncProviders(
  configs: AsyncProviderConfig[],
): Provider[] {
  return configs.map(config => createAsyncProvider(config));
}

/**
 * Conditional provider configuration
 */
export interface ConditionalProviderConfig {
  token: ProviderToken;
  condition: () => boolean | Promise<boolean>;
  trueProvider: Type<any> | any;
  falseProvider?: Type<any> | any;
  dependencies?: ProviderToken[];
}

/**
 * Registers a provider conditionally based on runtime evaluation
 * @param config Conditional provider configuration
 * @returns Provider object
 * @description Creates providers that are selected based on conditions
 */
export function registerConditionalProvider(
  config: ConditionalProviderConfig,
): Provider {
  return {
    provide: config.token,
    useFactory: async (...args: any[]) => {
      const condition = await Promise.resolve(config.condition());

      if (condition) {
        return typeof config.trueProvider === 'function'
          ? new config.trueProvider(...args)
          : config.trueProvider;
      }

      if (config.falseProvider) {
        return typeof config.falseProvider === 'function'
          ? new config.falseProvider(...args)
          : config.falseProvider;
      }

      return null;
    },
    inject: config.dependencies || [],
  };
}

/**
 * Creates multiple conditional providers
 * @param configs Array of conditional provider configurations
 * @returns Array of Provider objects
 */
export function registerConditionalProviders(
  configs: ConditionalProviderConfig[],
): Provider[] {
  return configs.map(config => registerConditionalProvider(config));
}

/**
 * Creates a request-scoped provider
 * @param token Provider token
 * @param useClass Provider class
 * @returns Provider object configured with REQUEST scope
 * @description Simplifies creation of REQUEST-scoped providers.
 * A new instance is created for each incoming HTTP request.
 *
 * @remarks
 * - **Scope**: REQUEST - new instance per HTTP request
 * - **Lifecycle**: Created on request start, destroyed on request end
 * - **Use Case**: Request context, user-specific state, per-request caching
 * - **Performance**: Higher memory usage, slower than singleton
 * - **Thread Safety**: Each request gets isolated instance
 *
 * @example
 * ```typescript
 * // Request context service
 * const requestContextProvider = createRequestScopedProvider(
 *   'REQUEST_CONTEXT',
 *   RequestContextService
 * );
 *
 * // Usage in module
 * @Module({
 *   providers: [requestContextProvider],
 *   exports: ['REQUEST_CONTEXT']
 * })
 * export class CoreModule {}
 *
 * // Inject in service
 * @Injectable()
 * export class AuditService extends BaseService {
 *   constructor(
 *     @Inject('REQUEST_CONTEXT') private context: RequestContextService
 *   ) {}
 * }
 * ```
 */
export function createRequestScopedProvider(
  token: ProviderToken,
  useClass: Type<any>,
): Provider {
  return {
    provide: token,
    useClass,
    scope: Scope.REQUEST,
  };
}

/**
 * Creates a transient-scoped provider
 * @param token Provider token
 * @param useClass Provider class
 * @returns Provider object configured with TRANSIENT scope
 * @description Simplifies creation of TRANSIENT-scoped providers.
 * A new instance is created each time the provider is injected.
 *
 * @remarks
 * - **Scope**: TRANSIENT - new instance per injection
 * - **Lifecycle**: Created on injection, no shared state
 * - **Use Case**: Unique instances, stateless utilities, task processors
 * - **Performance**: Highest memory usage, slowest initialization
 * - **Thread Safety**: Each injection gets isolated instance
 *
 * @example
 * ```typescript
 * // Task processor with unique ID per instance
 * const taskProcessorProvider = createTransientProvider(
 *   'TASK_PROCESSOR',
 *   TaskProcessor
 * );
 *
 * // Usage in service
 * @Injectable()
 * export class JobQueue {
 *   constructor(
 *     @Inject('TASK_PROCESSOR') private processor1: TaskProcessor,
 *     @Inject('TASK_PROCESSOR') private processor2: TaskProcessor
 *   ) {
 *     // processor1 and processor2 are different instances
 *   }
 * }
 * ```
 */
export function createTransientProvider(
  token: ProviderToken,
  useClass: Type<any>,
): Provider {
  return {
    provide: token,
    useClass,
    scope: Scope.TRANSIENT,
  };
}

/**
 * Creates a singleton provider (default scope)
 * @param token Provider token
 * @param useClass Provider class
 * @returns Provider object configured with DEFAULT (singleton) scope
 * @description Explicitly creates DEFAULT-scoped providers.
 * A single instance is created and shared across the entire application.
 *
 * @remarks
 * - **Scope**: DEFAULT (Singleton) - one instance per application
 * - **Lifecycle**: Created on first injection, reused throughout app lifetime
 * - **Use Case**: Services, repositories, configurations, caches
 * - **Performance**: Best performance, lowest memory usage
 * - **Thread Safety**: Must be designed for concurrent access
 * - **Circular Dependencies**: Use forwardRef() to resolve circular deps
 *
 * @example
 * ```typescript
 * // Database connection pool (singleton)
 * const dbProvider = createSingletonProvider(
 *   'DATABASE',
 *   DatabaseService
 * );
 *
 * // Configuration service (singleton)
 * const configProvider = createSingletonProvider(
 *   'CONFIG',
 *   ConfigService
 * );
 *
 * // Usage in module
 * @Module({
 *   providers: [dbProvider, configProvider],
 *   exports: ['DATABASE', 'CONFIG']
 * })
 * export class DatabaseModule {}
 * ```
 */
export function createSingletonProvider(
  token: ProviderToken,
  useClass: Type<any>,
): Provider {
  return {
    provide: token,
    useClass,
    scope: Scope.DEFAULT,
  };
}

/**
 * Provider scope configuration
 */
export interface ScopeConfig {
  providers: Array<{ token: ProviderToken; useClass: Type<any> }>;
  scope: Scope;
}

/**
 * Configures multiple providers with the same scope
 * @param config Scope configuration
 * @returns Array of Provider objects
 */
export function configureProviderScope(config: ScopeConfig): Provider[] {
  return config.providers.map(provider => ({
    provide: provider.token,
    useClass: provider.useClass,
    scope: config.scope,
  }));
}

/**
 * Provider token generator for creating unique injection tokens
 * @param prefix Optional prefix for the token
 * @returns Symbol token
 * @description Generates unique symbols for provider injection
 */
export function generateProviderToken(prefix: string = 'PROVIDER'): symbol {
  return Symbol(`${prefix}_${randomUUID()}`);
}

/**
 * Generates multiple provider tokens
 * @param count Number of tokens to generate
 * @param prefix Optional prefix for tokens
 * @returns Array of symbol tokens
 */
export function generateProviderTokens(
  count: number,
  prefix: string = 'PROVIDER',
): symbol[] {
  return Array.from({ length: count }, () => generateProviderToken(prefix));
}

/**
 * Creates a string-based provider token
 * @param name Token name
 * @param namespace Optional namespace
 * @returns String token
 */
export function createProviderToken(name: string, namespace?: string): string {
  return namespace ? `${namespace}:${name}` : name;
}

/**
 * Token registry for managing provider tokens
 */
export class ProviderTokenRegistry {
  private tokens = new Map<string, ProviderToken>();
  register(key: string, token: ProviderToken): void {
    if (this.tokens.has(key)) {
      this.logWarning(`Token already registered: ${key}`);
    }

    this.tokens.set(key, token);
    this.logDebug(`Token registered: ${key}`);
  }

  get(key: string): ProviderToken | undefined {
    return this.tokens.get(key);
  }

  has(key: string): boolean {
    return this.tokens.has(key);
  }

  getAll(): Map<string, ProviderToken> {
    return new Map(this.tokens);
  }

  clear(): void {
    this.tokens.clear();
    this.logDebug('All tokens cleared');
  }
}

/**
 * Custom provider decorator metadata key
 */
const CUSTOM_PROVIDER_METADATA = 'custom:provider';

/**
 * Creates a custom provider decorator with metadata
 * @param metadata Metadata to attach
 * @returns Class decorator
 * @description Allows creation of custom decorators for providers
 */
export function CustomProvider(metadata: Record<string, any> = {}) {
  return applyDecorators(
    Injectable(),
    SetMetadata(CUSTOM_PROVIDER_METADATA, metadata),
  );
}

/**
 * Creates a scoped custom provider decorator
 * @param scope Provider scope
 * @param metadata Additional metadata
 * @returns Class decorator
 */
export function ScopedProvider(
  scope: Scope,
  metadata: Record<string, any> = {},
) {
  return applyDecorators(
    Injectable({ scope }),
    SetMetadata(CUSTOM_PROVIDER_METADATA, { ...metadata, scope }),
  );
}

/**
 * Request-scoped provider decorator
 */
export function RequestScoped(metadata: Record<string, any> = {}) {
  return ScopedProvider(Scope.REQUEST, metadata);
}

/**
 * Transient provider decorator
 */
export function TransientProvider(metadata: Record<string, any> = {}) {
  return ScopedProvider(Scope.TRANSIENT, metadata);
}

/**
 * Multi-provider configuration
 */
export interface MultiProviderConfig {
  token: ProviderToken;
  providers: Array<Type<any> | any>;
  multi: true;
}

/**
 * Creates a multi-provider (multiple instances for same token)
 * @param token Provider token
 * @param providers Array of provider implementations
 * @returns Provider object
 * @description Enables multiple providers for the same injection token
 */
export function createMultiProvider(
  token: ProviderToken,
  providers: Array<Type<any> | any>,
): Provider[] {
  return providers.map(provider => ({
    provide: token,
    useClass: typeof provider === 'function' ? provider : undefined,
    useValue: typeof provider !== 'function' ? provider : undefined,
    multi: true,
  } as any));
}

/**
 * Registers multiple multi-providers
 * @param configs Array of multi-provider configurations
 * @returns Array of Provider objects
 */
export function registerMultiProviders(
  configs: Array<{ token: ProviderToken; providers: Array<Type<any> | any> }>,
): Provider[] {
  return configs.flatMap(config => createMultiProvider(config.token, config.providers));
}

/**
 * Provider override configuration
 */
export interface ProviderOverride {
  original: ProviderToken;
  override: Type<any> | any;
  scope?: Scope;
}

/**
 * Creates a provider override for testing or customization
 * @param config Override configuration
 * @returns Provider object
 * @description Allows replacing existing providers
 */
export function createProviderOverride(config: ProviderOverride): Provider {
  return {
    provide: config.original,
    useClass: typeof config.override === 'function' ? config.override : undefined,
    useValue: typeof config.override !== 'function' ? config.override : undefined,
    scope: config.scope,
  } as any;
}

/**
 * Creates multiple provider overrides
 * @param configs Array of override configurations
 * @returns Array of Provider objects
 */
export function createProviderOverrides(configs: ProviderOverride[]): Provider[] {
  return configs.map(config => createProviderOverride(config));
}

/**
 * Provider introspection utilities
 */
export class ProviderIntrospector {
  private readonly logger = new Logger('ProviderIntrospector');

  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Gets a provider instance by token
   * @param token Provider token
   * @param options Resolution options
   * @returns Provider instance or undefined
   */
  async getProvider<T>(
    token: ProviderToken,
    options?: { strict?: boolean },
  ): Promise<T | undefined> {
    try {
      return await this.moduleRef.resolve<T>(token, undefined, options);
    } catch (error) {
      this.logWarning(`Provider not found: ${String(token)}`);
      return undefined;
    }
  }

  /**
   * Checks if a provider exists
   * @param token Provider token
   * @returns True if provider exists
   */
  async hasProvider(token: ProviderToken): Promise<boolean> {
    const provider = await this.getProvider(token);
    return provider !== undefined;
  }

  /**
   * Gets provider instance with context
   * @param token Provider token
   * @param contextId Context identifier
   * @returns Provider instance
   */
  async getProviderInContext<T>(
    token: ProviderToken,
    contextId: any,
  ): Promise<T> {
    return this.moduleRef.resolve<T>(token, contextId);
  }

  /**
   * Creates a new context for request-scoped providers
   * @returns Context ID
   */
  createContext(): any {
    return ContextIdFactory.create();
  }
}

/**
 * Module-level provider registration helper
 */
export interface ModuleProviderConfig {
  providers: Provider[];
  exports?: ProviderToken[];
  imports?: Type<any>[];
}

/**
 * Registers providers at module level
 * @param config Module provider configuration
 * @returns Partial module metadata
 * @description Simplifies module provider registration
 */
export function registerModuleProviders(
  config: ModuleProviderConfig,
): Pick<ModuleMetadata, 'providers' | 'exports' | 'imports'> {
  return {
    providers: config.providers,
    exports: config.exports,
    imports: config.imports,
  };
}

/**
 * Creates a dynamic module with providers
 * @param moduleName Module name
 * @param config Module provider configuration
 * @returns DynamicModule
 */
export function createDynamicModule(
  moduleName: string,
  config: ModuleProviderConfig,
): DynamicModule {
  return {
    module: class {},
    providers: config.providers,
    exports: config.exports,
    imports: config.imports,
    global: false,
  };
}

/**
 * Global provider configuration
 */
export interface GlobalProviderConfig {
  token: ProviderToken;
  useClass?: Type<any>;
  useValue?: any;
  useFactory?: (...args: any[]) => any;
  inject?: ProviderToken[];
}

/**
 * Creates a global provider accessible across all modules
 * @param config Global provider configuration
 * @returns DynamicModule with global provider
 * @description Registers providers globally without explicit imports
 */
export function createGlobalProvider(config: GlobalProviderConfig): DynamicModule {
  const provider: Provider = {
    provide: config.token,
  } as any;

  if (config.useClass) {
    (provider as any).useClass = config.useClass;
  } else if (config.useValue !== undefined) {
    (provider as any).useValue = config.useValue;
  } else if (config.useFactory) {
    (provider as any).useFactory = config.useFactory;
    (provider as any).inject = config.inject || [];
  }

  return {
    module: class {},
    providers: [provider],
    exports: [config.token],
    global: true,
  };
}

/**
 * Creates multiple global providers
 * @param configs Array of global provider configurations
 * @returns DynamicModule with all global providers
 */
export function createGlobalProviders(
  configs: GlobalProviderConfig[],
): DynamicModule {
  const providers: Provider[] = configs.map(config => {
    const provider: Provider = {
      provide: config.token,
    } as any;

    if (config.useClass) {
      (provider as any).useClass = config.useClass;
    } else if (config.useValue !== undefined) {
      (provider as any).useValue = config.useValue;
    } else if (config.useFactory) {
      (provider as any).useFactory = config.useFactory;
      (provider as any).inject = config.inject || [];
    }

    return provider;
  });

  return {
    module: class {},
    providers,
    exports: configs.map(c => c.token),
    global: true,
  };
}

/**
 * Lazy provider initialization helper
 */
export class LazyProvider<T> {
  private instance?: T;
  private initializing = false;
  private readonly logger = new Logger('LazyProvider');

  constructor(
    private readonly factory: () => Promise<T>,
    private readonly name: string = 'LazyProvider',
  ) {}

  async get(): Promise<T> {
    if (this.instance) {
      return this.instance;
    }

    if (this.initializing) {
      // Wait for initialization to complete
      while (this.initializing) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return this.instance!;
    }

    this.initializing = true;
    this.logDebug(`Initializing lazy provider: ${this.name}`);

    try {
      this.instance = await this.factory();
      this.logDebug(`Lazy provider initialized: ${this.name}`);
      return this.instance;
    } finally {
      this.initializing = false;
    }
  }

  isInitialized(): boolean {
    return this.instance !== undefined;
  }

  reset(): void {
    this.instance = undefined;
    this.initializing = false;
    this.logDebug(`Lazy provider reset: ${this.name}`);
  }
}

/**
 * Creates a lazy-initialized provider
 * @param token Provider token
 * @param factory Factory function for lazy initialization
 * @param name Optional name for logging
 * @returns Provider object
 */
export function createLazyProvider<T>(
  token: ProviderToken,
  factory: () => Promise<T>,
  name?: string,
): Provider {
  const lazyProvider = new LazyProvider(factory, name);

  return {
    provide: token,
    useFactory: () => lazyProvider,
  };
}

/**
 * Provider dependency resolver for analyzing and preventing circular dependencies
 * @description Tracks provider dependencies and detects circular references.
 * Critical for maintaining healthy dependency injection architecture.
 *
 * @remarks
 * - **Use Case**: Detect circular dependencies at build/test time
 * - **Prevention**: Use forwardRef() in NestJS to break circular deps
 * - **Best Practice**: Keep dependency graphs acyclic
 * - **Testing**: Validate dependency graph in unit tests
 *
 * @example
 * ```typescript
 * // Setup resolver
 * const resolver = new ProviderDependencyResolver();
 *
 * // Register dependencies
 * resolver.registerDependencies('UserService', ['UserRepository', 'EmailService']);
 * resolver.registerDependencies('EmailService', ['ConfigService']);
 * resolver.registerDependencies('UserRepository', ['Database']);
 *
 * // Check for circular dependencies
 * if (resolver.hasCircularDependency('UserService')) {
 *   throw new Error('Circular dependency detected!');
 * }
 *
 * // Get resolution order
 * const order = resolver.getResolutionOrder();
 * // ['Database', 'UserRepository', 'ConfigService', 'EmailService', 'UserService']
 *
 * // Breaking circular deps with forwardRef
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     private userRepo: UserRepository,
 *     @Inject(forwardRef(() => EmailService))
 *     private emailService: EmailService
 *   ) {}
 * }
 * ```
 */
export class ProviderDependencyResolver {
  private dependencyGraph = new Map<ProviderToken, Set<ProviderToken>>();
  private readonly logger = new Logger('ProviderDependencyResolver');

  /**
   * Registers a provider's dependencies
   * @param provider Provider token
   * @param dependencies Array of dependency tokens
   *
   * @example
   * ```typescript
   * resolver.registerDependencies(
   *   PatientService,
   *   [PatientRepository, AuditService, EmailService]
   * );
   * ```
   */
  registerDependencies(
    provider: ProviderToken,
    dependencies: ProviderToken[],
  ): void {
    this.dependencyGraph.set(provider, new Set(dependencies));
    this.logDebug(`Dependencies registered for: ${String(provider)}`);
  }

  /**
   * Gets direct dependencies of a provider
   * @param provider Provider token
   * @returns Array of direct dependency tokens
   */
  getDependencies(provider: ProviderToken): ProviderToken[] {
    return Array.from(this.dependencyGraph.get(provider) || []);
  }

  /**
   * Gets all transitive dependencies of a provider
   * @param provider Provider token
   * @returns Array of all dependency tokens (direct and indirect)
   *
   * @example
   * ```typescript
   * // If A depends on B, and B depends on C
   * // getAllDependencies(A) returns [B, C]
   * const allDeps = resolver.getAllDependencies('UserService');
   * ```
   */
  getAllDependencies(provider: ProviderToken): ProviderToken[] {
    const visited = new Set<ProviderToken>();
    const result: ProviderToken[] = [];

    const traverse = (current: ProviderToken) => {
      if (visited.has(current)) return;
      visited.add(current);

      const deps = this.dependencyGraph.get(current) || new Set();
      for (const dep of deps) {
        result.push(dep);
        traverse(dep);
      }
    };

    traverse(provider);
    return result;
  }

  /**
   * Checks for circular dependencies
   * @param provider Provider token to check
   * @returns True if circular dependency exists
   *
   * @remarks
   * Circular dependencies should be avoided or resolved with forwardRef().
   *
   * @example
   * ```typescript
   * // Detect circular dependency
   * if (resolver.hasCircularDependency('UserService')) {
   *   console.error('Circular dependency detected in UserService');
   *   // Solution: Use forwardRef()
   * }
   * ```
   */
  hasCircularDependency(provider: ProviderToken): boolean {
    const visited = new Set<ProviderToken>();
    const recursionStack = new Set<ProviderToken>();

    const hasCycle = (current: ProviderToken): boolean => {
      if (recursionStack.has(current)) return true;
      if (visited.has(current)) return false;

      visited.add(current);
      recursionStack.add(current);

      const deps = this.dependencyGraph.get(current) || new Set();
      for (const dep of deps) {
        if (hasCycle(dep)) return true;
      }

      recursionStack.delete(current);
      return false;
    };

    return hasCycle(provider);
  }

  /**
   * Gets providers in topological dependency order
   * @returns Array of provider tokens sorted by dependency order
   *
   * @remarks
   * Dependencies appear before dependents in the returned array.
   * Useful for determining initialization order.
   *
   * @example
   * ```typescript
   * const order = resolver.getResolutionOrder();
   * // Initialize providers in this order
   * for (const token of order) {
   *   await initializeProvider(token);
   * }
   * ```
   */
  getResolutionOrder(): ProviderToken[] {
    const visited = new Set<ProviderToken>();
    const result: ProviderToken[] = [];

    const visit = (provider: ProviderToken) => {
      if (visited.has(provider)) return;
      visited.add(provider);

      const deps = this.dependencyGraph.get(provider) || new Set();
      for (const dep of deps) {
        visit(dep);
      }

      result.push(provider);
    };

    for (const provider of this.dependencyGraph.keys()) {
      visit(provider);
    }

    return result;
  }
}

/**
 * Provider factory registry for managing factory functions
 */
export class ProviderFactoryRegistry {
  private factories = new Map<ProviderToken, (...args: any[]) => any>();
  private readonly logger = new Logger('ProviderFactoryRegistry');

  /**
   * Registers a factory function
   * @param token Provider token
   * @param factory Factory function
   */
  register(token: ProviderToken, factory: (...args: any[]) => any): void {
    this.factories.set(token, factory);
    this.logDebug(`Factory registered: ${String(token)}`);
  }

  /**
   * Gets a factory function
   * @param token Provider token
   * @returns Factory function or undefined
   */
  get(token: ProviderToken): ((...args: any[]) => any) | undefined {
    return this.factories.get(token);
  }

  /**
   * Executes a factory function
   * @param token Provider token
   * @param args Factory arguments
   * @returns Factory result
   */
  execute<T>(token: ProviderToken, ...args: any[]): T {
    const factory = this.factories.get(token);

    if (!factory) {
      throw new Error(`Factory not found: ${String(token)}`);
    }

    return factory(...args) as T;
  }

  /**
   * Checks if a factory exists
   * @param token Provider token
   * @returns True if factory exists
   */
  has(token: ProviderToken): boolean {
    return this.factories.has(token);
  }

  /**
   * Clears all factories
   */
  clear(): void {
    this.factories.clear();
    this.logDebug('All factories cleared');
  }
}

/**
 * Provider lifecycle hooks manager
 */
export class ProviderLifecycleManager {
  private initHooks = new Map<ProviderToken, () => Promise<void>>();
  private destroyHooks = new Map<ProviderToken, () => Promise<void>>();
  private readonly logger = new Logger('ProviderLifecycleManager');

  /**
   * Registers initialization hook
   * @param token Provider token
   * @param hook Initialization function
   */
  onInit(token: ProviderToken, hook: () => Promise<void>): void {
    this.initHooks.set(token, hook);
    this.logDebug(`Init hook registered: ${String(token)}`);
  }

  /**
   * Registers destruction hook
   * @param token Provider token
   * @param hook Destruction function
   */
  onDestroy(token: ProviderToken, hook: () => Promise<void>): void {
    this.destroyHooks.set(token, hook);
    this.logDebug(`Destroy hook registered: ${String(token)}`);
  }

  /**
   * Executes initialization hook
   * @param token Provider token
   */
  async executeInit(token: ProviderToken): Promise<void> {
    const hook = this.initHooks.get(token);

    if (hook) {
      this.logDebug(`Executing init hook: ${String(token)}`);
      await hook();
    }
  }

  /**
   * Executes destruction hook
   * @param token Provider token
   */
  async executeDestroy(token: ProviderToken): Promise<void> {
    const hook = this.destroyHooks.get(token);

    if (hook) {
      this.logDebug(`Executing destroy hook: ${String(token)}`);
      await hook();
    }
  }

  /**
   * Executes all initialization hooks
   */
  async executeAllInit(): Promise<void> {
    for (const [token] of this.initHooks) {
      await this.executeInit(token);
    }
  }

  /**
   * Executes all destruction hooks
   */
  async executeAllDestroy(): Promise<void> {
    for (const [token] of this.destroyHooks) {
      await this.executeDestroy(token);
    }
  }
}

/**
 * Provider configuration builder for fluent API
 */
export class ProviderConfigBuilder {
  private config: Partial<DynamicProviderOptions> = {};

  /**
   * Sets the provider token
   * @param token Provider token
   * @returns Builder instance
   */
  provide(token: ProviderToken): this {
    this.config.provide = token;
    return this;
  }

  /**
   * Sets the provider class
   * @param useClass Provider class
   * @returns Builder instance
   */
  useClass(useClass: Type<any>): this {
    this.config.useClass = useClass;
    return this;
  }

  /**
   * Sets the provider value
   * @param useValue Provider value
   * @returns Builder instance
   */
  useValue(useValue: any): this {
    this.config.useValue = useValue;
    return this;
  }

  /**
   * Sets the provider factory
   * @param factory Factory function
   * @param dependencies Dependencies array
   * @returns Builder instance
   */
  useFactory(factory: (...args: any[]) => any, dependencies?: ProviderToken[]): this {
    this.config.useFactory = factory;
    this.config.inject = dependencies;
    return this;
  }

  /**
   * Sets the provider scope
   * @param scope Provider scope
   * @returns Builder instance
   */
  scope(scope: Scope): this {
    this.config.scope = scope;
    return this;
  }

  /**
   * Builds the provider configuration
   * @returns Provider object
   */
  build(): Provider {
    if (!this.config.provide) {
      throw new Error('Provider token is required');
    }

    return registerDynamicProvider(this.config as DynamicProviderOptions);
  }
}

/**
 * Creates a provider configuration builder
 * @returns ProviderConfigBuilder instance
 */
export function providerBuilder(): ProviderConfigBuilder {
  return new ProviderConfigBuilder();
}

/**
 * Provider collection for managing groups of providers
 */
export class ProviderCollection {
  private providers: Provider[] = [];
  private readonly logger = new Logger('ProviderCollection');

  /**
   * Adds a provider to the collection
   * @param provider Provider object
   */
  add(provider: Provider): this {
    this.providers.push(provider);
    this.logDebug(`Provider added to collection`);
    return this;
  }

  /**
   * Adds multiple providers to the collection
   * @param providers Array of provider objects
   */
  addAll(providers: Provider[]): this {
    this.providers.push(...providers);
    this.logDebug(`${providers.length} providers added to collection`);
    return this;
  }

  /**
   * Filters providers by condition
   * @param predicate Filter function
   * @returns New ProviderCollection with filtered providers
   */
  filter(predicate: (provider: Provider) => boolean): ProviderCollection {
    const collection = new ProviderCollection();
    collection.addAll(this.providers.filter(predicate));
    return collection;
  }

  /**
   * Maps providers to new values
   * @param mapper Mapping function
   * @returns Array of mapped values
   */
  map<T>(mapper: (provider: Provider) => T): T[] {
    return this.providers.map(mapper);
  }

  /**
   * Gets all providers in the collection
   * @returns Array of providers
   */
  toArray(): Provider[] {
    return [...this.providers];
  }

  /**
   * Gets the count of providers
   * @returns Number of providers
   */
  count(): number {
    return this.providers.length;
  }

  /**
   * Clears all providers from the collection
   */
  clear(): void {
    this.providers = [];
    this.logDebug('Collection cleared');
  }
}

/**
 * Creates a provider collection from an array
 * @param providers Array of providers
 * @returns ProviderCollection instance
 */
export function createProviderCollection(providers: Provider[] = []): ProviderCollection {
  const collection = new ProviderCollection();
  collection.addAll(providers);
  return collection;
}

/**
 * Provider validation utilities
 */
export class ProviderValidator {
  private readonly logger = new Logger('ProviderValidator');

  /**
   * Validates a provider configuration
   * @param provider Provider object
   * @returns Validation result
   */
  validate(provider: Provider): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!(provider as any).provide) {
      errors.push('Provider token is required');
    }

    const hasImplementation =
      (provider as any).useClass ||
      (provider as any).useValue !== undefined ||
      (provider as any).useFactory ||
      (provider as any).useExisting;

    if (!hasImplementation) {
      errors.push('Provider must have useClass, useValue, useFactory, or useExisting');
    }

    if ((provider as any).useFactory && !(provider as any).inject) {
      this.logWarning('Factory provider without inject array may cause issues');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates multiple providers
   * @param providers Array of providers
   * @returns Validation results
   */
  validateAll(providers: Provider[]): Array<{
    provider: Provider;
    valid: boolean;
    errors: string[];
  }> {
    return providers.map(provider => ({
      provider,
      ...this.validate(provider),
    }));
  }

  /**
   * Checks if all providers are valid
   * @param providers Array of providers
   * @returns True if all valid
   */
  isValid(providers: Provider[]): boolean {
    return this.validateAll(providers).every(result => result.valid);
  }
}

/**
 * Provider alias helper for creating alternative tokens
 */
export function createProviderAlias(
  originalToken: ProviderToken,
  aliasToken: ProviderToken,
): Provider {
  return {
    provide: aliasToken,
    useExisting: originalToken,
  };
}

/**
 * Creates multiple provider aliases
 * @param aliases Array of alias configurations
 * @returns Array of providers
 */
export function createProviderAliases(
  aliases: Array<{ original: ProviderToken; alias: ProviderToken }>,
): Provider[] {
  return aliases.map(({ original, alias }) => createProviderAlias(original, alias));
}

/**
 * Environment-based provider configuration
 */
export interface EnvironmentProviderConfig {
  token: ProviderToken;
  environments: Record<string, Type<any> | any>;
  defaultProvider?: Type<any> | any;
}

/**
 * Creates a provider based on environment
 * @param config Environment provider configuration
 * @param currentEnv Current environment name
 * @returns Provider object
 */
export function createEnvironmentProvider(
  config: EnvironmentProviderConfig,
  currentEnv: string = process.env.NODE_ENV || 'development',
): Provider {
  const implementation = config.environments[currentEnv] || config.defaultProvider;

  if (!implementation) {
    throw new Error(
      `No provider implementation found for environment: ${currentEnv}`,
    );
  }

  return {
    provide: config.token,
    useClass: typeof implementation === 'function' ? implementation : undefined,
    useValue: typeof implementation !== 'function' ? implementation : undefined,
  } as any;
}

/**
 * Creates multiple environment-based providers
 * @param configs Array of environment provider configurations
 * @param currentEnv Current environment name
 * @returns Array of providers
 */
export function createEnvironmentProviders(
  configs: EnvironmentProviderConfig[],
  currentEnv?: string,
): Provider[] {
  return configs.map(config => createEnvironmentProvider(config, currentEnv));
}
