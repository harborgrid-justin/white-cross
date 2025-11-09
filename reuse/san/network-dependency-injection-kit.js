"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncMigrationProvider = exports.createAsyncHealthCheckProvider = exports.createAsyncDiscoveryProvider = exports.createAsyncConfigProvider = exports.createAsyncDatabaseProvider = exports.createThrottleGuard = exports.createIPWhitelistGuard = exports.createRoleGuard = exports.createNetworkGuard = exports.createTransformInterceptor = exports.createTimeoutInterceptor = exports.createCachingInterceptor = exports.createNetworkInterceptor = exports.createLoggingMiddleware = exports.createRateLimitMiddleware = exports.createAuthMiddleware = exports.createNetworkMiddlewareProvider = exports.decorateProviderWithScope = exports.createScopedFactoryProvider = exports.createTransientProvider = exports.createRequestScopedProvider = exports.createSingletonProvider = exports.createMultiProvider = exports.registerFeatureModule = exports.createLazyProvider = exports.createConditionalProvider = exports.registerProviderDynamically = exports.mergeNetworkModuleConfigs = exports.registerNetworkModuleAsync = exports.registerNetworkModuleForRoot = exports.createDynamicNetworkModule = exports.createNetworkModule = exports.createAsyncProvider = exports.createAliasedProvider = exports.createCustomFactoryProvider = exports.createCustomValueProvider = exports.createCustomClassProvider = exports.createDIEventModel = exports.createProviderRegistryModel = exports.createNetworkModuleConfigModel = void 0;
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
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
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
const createNetworkModuleConfigModel = (sequelize) => {
    class NetworkModuleConfig extends sequelize_1.Model {
    }
    NetworkModuleConfig.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        moduleName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Module class name',
        },
        moduleId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique module identifier',
        },
        isGlobal: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether module is globally available',
        },
        providers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of provider tokens',
        },
        imports: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of imported module names',
        },
        exports: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of exported provider tokens',
        },
        controllers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of controller names',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Module metadata',
        },
        configHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            comment: 'Configuration hash for change detection',
        },
        version: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: '1.0.0',
            comment: 'Module version',
        },
    }, {
        sequelize,
        tableName: 'network_module_configs',
        timestamps: true,
        indexes: [
            { fields: ['moduleId'], unique: true },
            { fields: ['moduleName'] },
            { fields: ['isGlobal'] },
        ],
    });
    return NetworkModuleConfig;
};
exports.createNetworkModuleConfigModel = createNetworkModuleConfigModel;
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
const createProviderRegistryModel = (sequelize) => {
    class ProviderRegistry extends sequelize_1.Model {
    }
    ProviderRegistry.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Provider injection token',
        },
        providerType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Provider type (class, value, factory, existing, async)',
        },
        scope: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'DEFAULT',
            comment: 'Provider scope (DEFAULT, REQUEST, TRANSIENT)',
        },
        moduleId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Associated module identifier',
        },
        className: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Provider class name if applicable',
        },
        dependencies: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Array of dependency tokens',
        },
        isExported: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether provider is exported from module',
        },
        isLazy: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether provider is lazily initialized',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Provider metadata',
        },
        registeredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Provider registration timestamp',
        },
        lastAccessedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last provider access timestamp',
        },
    }, {
        sequelize,
        tableName: 'provider_registry',
        timestamps: true,
        indexes: [
            { fields: ['token', 'moduleId'], unique: true },
            { fields: ['moduleId'] },
            { fields: ['scope'] },
            { fields: ['providerType'] },
        ],
    });
    return ProviderRegistry;
};
exports.createProviderRegistryModel = createProviderRegistryModel;
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
const createDIEventModel = (sequelize) => {
    class DIEvent extends sequelize_1.Model {
    }
    DIEvent.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Event type (provider_registered, provider_resolved, etc.)',
        },
        token: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Provider token',
        },
        moduleId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Associated module identifier',
        },
        scope: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Provider scope',
        },
        details: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Event details',
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if event failed',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Event duration in milliseconds',
        },
    }, {
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
    });
    return DIEvent;
};
exports.createDIEventModel = createDIEventModel;
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
const createCustomClassProvider = (classType, config) => {
    return {
        provide: config.token,
        useClass: classType,
        scope: config.scope || common_1.Scope.DEFAULT,
    };
};
exports.createCustomClassProvider = createCustomClassProvider;
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
const createCustomValueProvider = (token, value) => {
    return {
        provide: token,
        useValue: value,
    };
};
exports.createCustomValueProvider = createCustomValueProvider;
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
const createCustomFactoryProvider = (token, factory, inject = [], scope = common_1.Scope.DEFAULT) => {
    return {
        provide: token,
        useFactory: factory,
        inject,
        scope,
    };
};
exports.createCustomFactoryProvider = createCustomFactoryProvider;
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
const createAliasedProvider = (token, existingToken) => {
    return {
        provide: token,
        useExisting: existingToken,
    };
};
exports.createAliasedProvider = createAliasedProvider;
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
const createAsyncProvider = (token, asyncFactory, inject = []) => {
    return {
        provide: token,
        useFactory: asyncFactory,
        inject,
    };
};
exports.createAsyncProvider = createAsyncProvider;
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
const createNetworkModule = (moduleName, options) => {
    let NetworkModule = (() => {
        let _classDecorators = [(0, common_1.Module)({
                imports: options.imports || [],
                providers: options.providers || [],
                exports: options.exports || [],
                controllers: options.controllers || [],
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkModule = _classThis = class {
        };
        __setFunctionName(_classThis, "NetworkModule");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })();
        _classThis.moduleName = moduleName;
        (() => {
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkModule = _classThis;
    })();
    if (options.isGlobal) {
        Reflect.defineMetadata('__module:global__', true, NetworkModule);
    }
    Object.defineProperty(NetworkModule, 'name', { value: moduleName });
    return NetworkModule;
};
exports.createNetworkModule = createNetworkModule;
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
const createDynamicNetworkModule = (moduleName, options) => {
    return {
        module: class DynamicNetworkModule {
        },
        global: options.isGlobal || false,
        imports: options.imports || [],
        providers: options.providers || [],
        exports: options.exports || [],
        controllers: options.controllers || [],
    };
};
exports.createDynamicNetworkModule = createDynamicNetworkModule;
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
const registerNetworkModuleForRoot = (options) => {
    return {
        module: class NetworkRootModule {
        },
        global: options.isGlobal !== false,
        imports: options.imports || [],
        providers: options.providers || [],
        exports: options.exports || [],
    };
};
exports.registerNetworkModuleForRoot = registerNetworkModuleForRoot;
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
const registerNetworkModuleAsync = (asyncOptions) => {
    const providers = [];
    if (asyncOptions.useFactory) {
        providers.push({
            provide: 'NETWORK_MODULE_OPTIONS',
            useFactory: asyncOptions.useFactory,
            inject: asyncOptions.inject || [],
        });
    }
    else if (asyncOptions.useClass) {
        providers.push({
            provide: 'NETWORK_OPTIONS_FACTORY',
            useClass: asyncOptions.useClass,
        }, {
            provide: 'NETWORK_MODULE_OPTIONS',
            useFactory: async (factory) => {
                return await factory.createNetworkOptions();
            },
            inject: ['NETWORK_OPTIONS_FACTORY'],
        });
    }
    else if (asyncOptions.useExisting) {
        providers.push({
            provide: 'NETWORK_MODULE_OPTIONS',
            useFactory: async (factory) => {
                return await factory.createNetworkOptions();
            },
            inject: [asyncOptions.useExisting],
        });
    }
    return {
        module: class NetworkAsyncModule {
        },
        imports: asyncOptions.imports || [],
        providers,
        exports: ['NETWORK_MODULE_OPTIONS'],
    };
};
exports.registerNetworkModuleAsync = registerNetworkModuleAsync;
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
const mergeNetworkModuleConfigs = (moduleName, moduleConfigs) => {
    const mergedProviders = moduleConfigs.flatMap(config => config.providers || []);
    const mergedImports = moduleConfigs.flatMap(config => config.imports || []);
    const mergedExports = moduleConfigs.flatMap(config => config.exports || []);
    const mergedControllers = moduleConfigs.flatMap(config => config.controllers || []);
    const isGlobal = moduleConfigs.some(config => config.isGlobal);
    return {
        module: class MergedNetworkModule {
        },
        global: isGlobal,
        imports: mergedImports,
        providers: mergedProviders,
        exports: mergedExports,
        controllers: mergedControllers,
    };
};
exports.mergeNetworkModuleConfigs = mergeNetworkModuleConfigs;
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
const registerProviderDynamically = async (moduleRef, provider) => {
    // Note: In real implementation, this would use NestJS internal APIs
    // This is a simplified conceptual implementation
    console.log('Registering provider dynamically:', provider);
};
exports.registerProviderDynamically = registerProviderDynamically;
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
const createConditionalProvider = (token, condition, trueProvider, falseProvider) => {
    return {
        provide: token,
        useFactory: (...args) => {
            if (condition(...args)) {
                return trueProvider.useFactory
                    ? trueProvider.useFactory(...args)
                    : trueProvider.useClass
                        ? new trueProvider.useClass(...args)
                        : trueProvider.useValue;
            }
            else {
                return falseProvider.useFactory
                    ? falseProvider.useFactory(...args)
                    : falseProvider.useClass
                        ? new falseProvider.useClass(...args)
                        : falseProvider.useValue;
            }
        },
    };
};
exports.createConditionalProvider = createConditionalProvider;
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
const createLazyProvider = (token, factory, inject = []) => {
    let instance = null;
    let initialized = false;
    return {
        provide: token,
        useFactory: (...args) => {
            if (!initialized) {
                instance = factory(...args);
                initialized = true;
            }
            return instance;
        },
        inject,
    };
};
exports.createLazyProvider = createLazyProvider;
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
const registerFeatureModule = (featureName, options) => {
    return {
        module: class FeatureModule {
        },
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
exports.registerFeatureModule = registerFeatureModule;
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
const createMultiProvider = (token, providers) => {
    return providers.map(provider => ({
        provide: token,
        useClass: provider,
        multi: true,
    }));
};
exports.createMultiProvider = createMultiProvider;
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
const createSingletonProvider = (classType, token) => {
    return {
        provide: token || classType,
        useClass: classType,
        scope: common_1.Scope.DEFAULT,
    };
};
exports.createSingletonProvider = createSingletonProvider;
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
const createRequestScopedProvider = (classType, token) => {
    return {
        provide: token || classType,
        useClass: classType,
        scope: common_1.Scope.REQUEST,
    };
};
exports.createRequestScopedProvider = createRequestScopedProvider;
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
const createTransientProvider = (classType, token) => {
    return {
        provide: token || classType,
        useClass: classType,
        scope: common_1.Scope.TRANSIENT,
    };
};
exports.createTransientProvider = createTransientProvider;
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
const createScopedFactoryProvider = (token, factory, scope, inject = []) => {
    return {
        provide: token,
        useFactory: factory,
        inject,
        scope,
    };
};
exports.createScopedFactoryProvider = createScopedFactoryProvider;
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
const decorateProviderWithScope = (provider, scope, metadata) => {
    const decoratedProvider = { ...provider, scope };
    if (metadata) {
        Reflect.defineMetadata('provider:metadata', metadata, decoratedProvider);
    }
    return decoratedProvider;
};
exports.decorateProviderWithScope = decorateProviderWithScope;
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
const createNetworkMiddlewareProvider = (middlewareClass, config) => {
    return {
        provide: middlewareClass,
        useClass: middlewareClass,
    };
};
exports.createNetworkMiddlewareProvider = createNetworkMiddlewareProvider;
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
const createAuthMiddleware = (validateToken) => {
    let NetworkAuthMiddleware = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkAuthMiddleware = _classThis = class {
            async use(req, res, next) {
                const token = req.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                try {
                    const user = await validateToken(token);
                    req.user = user;
                    next();
                }
                catch (error) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
            }
        };
        __setFunctionName(_classThis, "NetworkAuthMiddleware");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkAuthMiddleware = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkAuthMiddleware = _classThis;
    })();
    return NetworkAuthMiddleware;
};
exports.createAuthMiddleware = createAuthMiddleware;
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
const createRateLimitMiddleware = (maxRequests, windowMs) => {
    const requestCounts = new Map();
    let NetworkRateLimitMiddleware = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkRateLimitMiddleware = _classThis = class {
            use(req, res, next) {
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
        };
        __setFunctionName(_classThis, "NetworkRateLimitMiddleware");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkRateLimitMiddleware = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkRateLimitMiddleware = _classThis;
    })();
    return NetworkRateLimitMiddleware;
};
exports.createRateLimitMiddleware = createRateLimitMiddleware;
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
const createLoggingMiddleware = (logger) => {
    let NetworkLoggingMiddleware = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkLoggingMiddleware = _classThis = class {
            use(req, res, next) {
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
        };
        __setFunctionName(_classThis, "NetworkLoggingMiddleware");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkLoggingMiddleware = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkLoggingMiddleware = _classThis;
    })();
    return NetworkLoggingMiddleware;
};
exports.createLoggingMiddleware = createLoggingMiddleware;
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
const createNetworkInterceptor = (config) => {
    let NetworkInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const startTime = Date.now();
                if (config.logRequests) {
                    console.log(`[Network] ${request.method} ${request.url}`);
                }
                let stream = next.handle();
                if (config.timeout) {
                    stream = stream.pipe((0, operators_1.timeout)(config.timeout));
                }
                return stream.pipe((0, operators_1.tap)(data => {
                    const duration = Date.now() - startTime;
                    if (config.logRequests) {
                        console.log(`[Network] Completed in ${duration}ms`);
                    }
                }), (0, operators_1.catchError)(error => {
                    console.error('[Network] Error:', error.message);
                    throw error;
                }));
            }
        };
        __setFunctionName(_classThis, "NetworkInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkInterceptor = _classThis;
    })();
    return NetworkInterceptor;
};
exports.createNetworkInterceptor = createNetworkInterceptor;
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
const createCachingInterceptor = (ttl, keyGenerator) => {
    const cache = new Map();
    let NetworkCachingInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkCachingInterceptor = _classThis = class {
            intercept(context, next) {
                const request = context.switchToHttp().getRequest();
                const cacheKey = keyGenerator
                    ? keyGenerator(context)
                    : `${request.method}:${request.url}`;
                // Check cache
                const cached = cache.get(cacheKey);
                if (cached && Date.now() < cached.expires) {
                    return new rxjs_1.Observable(observer => {
                        observer.next(cached.data);
                        observer.complete();
                    });
                }
                return next.handle().pipe((0, operators_1.tap)(data => {
                    cache.set(cacheKey, {
                        data,
                        expires: Date.now() + ttl,
                    });
                }));
            }
        };
        __setFunctionName(_classThis, "NetworkCachingInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkCachingInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkCachingInterceptor = _classThis;
    })();
    return NetworkCachingInterceptor;
};
exports.createCachingInterceptor = createCachingInterceptor;
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
const createTimeoutInterceptor = (timeoutMs) => {
    let NetworkTimeoutInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkTimeoutInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.timeout)(timeoutMs), (0, operators_1.catchError)(error => {
                    if (error.name === 'TimeoutError') {
                        throw new Error(`Request timeout after ${timeoutMs}ms`);
                    }
                    throw error;
                }));
            }
        };
        __setFunctionName(_classThis, "NetworkTimeoutInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkTimeoutInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkTimeoutInterceptor = _classThis;
    })();
    return NetworkTimeoutInterceptor;
};
exports.createTimeoutInterceptor = createTimeoutInterceptor;
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
const createTransformInterceptor = (transformFn) => {
    let NetworkTransformInterceptor = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkTransformInterceptor = _classThis = class {
            intercept(context, next) {
                return next.handle().pipe((0, operators_1.tap)(data => transformFn(data)));
            }
        };
        __setFunctionName(_classThis, "NetworkTransformInterceptor");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkTransformInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkTransformInterceptor = _classThis;
    })();
    return NetworkTransformInterceptor;
};
exports.createTransformInterceptor = createTransformInterceptor;
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
const createNetworkGuard = (config) => {
    let NetworkGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                if (config.allowAnonymous && !request.user) {
                    return true;
                }
                if (!request.user) {
                    return false;
                }
                if (config.requiredRoles && config.requiredRoles.length > 0) {
                    const hasRole = config.requiredRoles.some(role => request.user.roles?.includes(role));
                    if (!hasRole)
                        return false;
                }
                if (config.requiredPermissions && config.requiredPermissions.length > 0) {
                    const hasPermission = config.requiredPermissions.every(permission => request.user.permissions?.includes(permission));
                    if (!hasPermission)
                        return false;
                }
                return true;
            }
        };
        __setFunctionName(_classThis, "NetworkGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkGuard = _classThis;
    })();
    return NetworkGuard;
};
exports.createNetworkGuard = createNetworkGuard;
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
const createRoleGuard = (allowedRoles) => {
    let NetworkRoleGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkRoleGuard = _classThis = class {
            canActivate(context) {
                const request = context.switchToHttp().getRequest();
                if (!request.user) {
                    return false;
                }
                return allowedRoles.some(role => request.user.roles?.includes(role));
            }
        };
        __setFunctionName(_classThis, "NetworkRoleGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkRoleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkRoleGuard = _classThis;
    })();
    return NetworkRoleGuard;
};
exports.createRoleGuard = createRoleGuard;
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
const createIPWhitelistGuard = (allowedIPs) => {
    let NetworkIPGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkIPGuard = _classThis = class {
            canActivate(context) {
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
        };
        __setFunctionName(_classThis, "NetworkIPGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkIPGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkIPGuard = _classThis;
    })();
    return NetworkIPGuard;
};
exports.createIPWhitelistGuard = createIPWhitelistGuard;
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
const createThrottleGuard = (limit, ttl) => {
    const tracker = new Map();
    let NetworkThrottleGuard = (() => {
        let _classDecorators = [(0, common_1.Injectable)()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var NetworkThrottleGuard = _classThis = class {
            canActivate(context) {
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
        };
        __setFunctionName(_classThis, "NetworkThrottleGuard");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            NetworkThrottleGuard = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return NetworkThrottleGuard = _classThis;
    })();
    return NetworkThrottleGuard;
};
exports.createThrottleGuard = createThrottleGuard;
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
const createAsyncDatabaseProvider = (token, connectionFactory, inject = []) => {
    return {
        provide: token,
        useFactory: connectionFactory,
        inject,
    };
};
exports.createAsyncDatabaseProvider = createAsyncDatabaseProvider;
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
const createAsyncConfigProvider = (token, configLoader, inject = []) => {
    return {
        provide: token,
        useFactory: configLoader,
        inject,
    };
};
exports.createAsyncConfigProvider = createAsyncConfigProvider;
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
const createAsyncDiscoveryProvider = (token, serviceName, discoveryClient, inject = []) => {
    return {
        provide: token,
        useFactory: discoveryClient,
        inject,
    };
};
exports.createAsyncDiscoveryProvider = createAsyncDiscoveryProvider;
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
const createAsyncHealthCheckProvider = (token, healthCheckFn, inject = []) => {
    return {
        provide: token,
        useFactory: healthCheckFn,
        inject,
    };
};
exports.createAsyncHealthCheckProvider = createAsyncHealthCheckProvider;
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
const createAsyncMigrationProvider = (token, migrationFn, inject = []) => {
    return {
        provide: token,
        useFactory: migrationFn,
        inject,
    };
};
exports.createAsyncMigrationProvider = createAsyncMigrationProvider;
exports.default = {
    // Sequelize Models
    createNetworkModuleConfigModel: exports.createNetworkModuleConfigModel,
    createProviderRegistryModel: exports.createProviderRegistryModel,
    createDIEventModel: exports.createDIEventModel,
    // Custom Network Providers
    createCustomClassProvider: exports.createCustomClassProvider,
    createCustomValueProvider: exports.createCustomValueProvider,
    createCustomFactoryProvider: exports.createCustomFactoryProvider,
    createAliasedProvider: exports.createAliasedProvider,
    createAsyncProvider: exports.createAsyncProvider,
    // Network Module Configuration
    createNetworkModule: exports.createNetworkModule,
    createDynamicNetworkModule: exports.createDynamicNetworkModule,
    registerNetworkModuleForRoot: exports.registerNetworkModuleForRoot,
    registerNetworkModuleAsync: exports.registerNetworkModuleAsync,
    mergeNetworkModuleConfigs: exports.mergeNetworkModuleConfigs,
    // Dynamic Module Registration
    registerProviderDynamically: exports.registerProviderDynamically,
    createConditionalProvider: exports.createConditionalProvider,
    createLazyProvider: exports.createLazyProvider,
    registerFeatureModule: exports.registerFeatureModule,
    createMultiProvider: exports.createMultiProvider,
    // Service Scopes
    createSingletonProvider: exports.createSingletonProvider,
    createRequestScopedProvider: exports.createRequestScopedProvider,
    createTransientProvider: exports.createTransientProvider,
    createScopedFactoryProvider: exports.createScopedFactoryProvider,
    decorateProviderWithScope: exports.decorateProviderWithScope,
    // Network Middleware Providers
    createNetworkMiddlewareProvider: exports.createNetworkMiddlewareProvider,
    createAuthMiddleware: exports.createAuthMiddleware,
    createRateLimitMiddleware: exports.createRateLimitMiddleware,
    createLoggingMiddleware: exports.createLoggingMiddleware,
    // Network Interceptor Providers
    createNetworkInterceptor: exports.createNetworkInterceptor,
    createCachingInterceptor: exports.createCachingInterceptor,
    createTimeoutInterceptor: exports.createTimeoutInterceptor,
    createTransformInterceptor: exports.createTransformInterceptor,
    // Network Guard Providers
    createNetworkGuard: exports.createNetworkGuard,
    createRoleGuard: exports.createRoleGuard,
    createIPWhitelistGuard: exports.createIPWhitelistGuard,
    createThrottleGuard: exports.createThrottleGuard,
    // Async Network Providers
    createAsyncDatabaseProvider: exports.createAsyncDatabaseProvider,
    createAsyncConfigProvider: exports.createAsyncConfigProvider,
    createAsyncDiscoveryProvider: exports.createAsyncDiscoveryProvider,
    createAsyncHealthCheckProvider: exports.createAsyncHealthCheckProvider,
    createAsyncMigrationProvider: exports.createAsyncMigrationProvider,
};
//# sourceMappingURL=network-dependency-injection-kit.js.map