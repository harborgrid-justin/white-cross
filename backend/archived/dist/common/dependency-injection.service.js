"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderValidator = exports.ProviderCollection = exports.ProviderConfigBuilder = exports.ProviderLifecycleManager = exports.ProviderFactoryRegistry = exports.ProviderDependencyResolver = exports.LazyProvider = exports.ProviderIntrospector = exports.ProviderTokenRegistry = void 0;
exports.registerDynamicProvider = registerDynamicProvider;
exports.registerDynamicProviders = registerDynamicProviders;
exports.createFactoryProvider = createFactoryProvider;
exports.createFactoryProviders = createFactoryProviders;
exports.createAsyncProvider = createAsyncProvider;
exports.createAsyncProviders = createAsyncProviders;
exports.registerConditionalProvider = registerConditionalProvider;
exports.registerConditionalProviders = registerConditionalProviders;
exports.createRequestScopedProvider = createRequestScopedProvider;
exports.createTransientProvider = createTransientProvider;
exports.createSingletonProvider = createSingletonProvider;
exports.configureProviderScope = configureProviderScope;
exports.generateProviderToken = generateProviderToken;
exports.generateProviderTokens = generateProviderTokens;
exports.createProviderToken = createProviderToken;
exports.CustomProvider = CustomProvider;
exports.ScopedProvider = ScopedProvider;
exports.RequestScoped = RequestScoped;
exports.TransientProvider = TransientProvider;
exports.createMultiProvider = createMultiProvider;
exports.registerMultiProviders = registerMultiProviders;
exports.createProviderOverride = createProviderOverride;
exports.createProviderOverrides = createProviderOverrides;
exports.registerModuleProviders = registerModuleProviders;
exports.createDynamicModule = createDynamicModule;
exports.createGlobalProvider = createGlobalProvider;
exports.createGlobalProviders = createGlobalProviders;
exports.createLazyProvider = createLazyProvider;
exports.providerBuilder = providerBuilder;
exports.createProviderCollection = createProviderCollection;
exports.createProviderAlias = createProviderAlias;
exports.createProviderAliases = createProviderAliases;
exports.createEnvironmentProvider = createEnvironmentProvider;
exports.createEnvironmentProviders = createEnvironmentProviders;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const crypto_1 = require("crypto");
function registerDynamicProvider(options) {
    const provider = {
        provide: options.provide,
        scope: options.scope,
    };
    if (options.useClass) {
        provider.useClass = options.useClass;
    }
    else if (options.useValue !== undefined) {
        provider.useValue = options.useValue;
    }
    else if (options.useFactory) {
        provider.useFactory = options.useFactory;
        provider.inject = options.inject || [];
    }
    return provider;
}
function registerDynamicProviders(optionsArray) {
    return optionsArray.map(options => registerDynamicProvider(options));
}
function createFactoryProvider(config) {
    return {
        provide: config.token,
        useFactory: config.factory,
        inject: config.dependencies || [],
        scope: config.scope,
    };
}
function createFactoryProviders(configs) {
    return configs.map(config => createFactoryProvider(config));
}
function createAsyncProvider(config) {
    return {
        provide: config.token,
        useFactory: async (...args) => {
            return await config.asyncFactory(...args);
        },
        inject: config.dependencies || [],
        scope: config.scope,
    };
}
function createAsyncProviders(configs) {
    return configs.map(config => createAsyncProvider(config));
}
function registerConditionalProvider(config) {
    return {
        provide: config.token,
        useFactory: async (...args) => {
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
function registerConditionalProviders(configs) {
    return configs.map(config => registerConditionalProvider(config));
}
function createRequestScopedProvider(token, useClass) {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.REQUEST,
    };
}
function createTransientProvider(token, useClass) {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.TRANSIENT,
    };
}
function createSingletonProvider(token, useClass) {
    return {
        provide: token,
        useClass,
        scope: common_1.Scope.DEFAULT,
    };
}
function configureProviderScope(config) {
    return config.providers.map(provider => ({
        provide: provider.token,
        useClass: provider.useClass,
        scope: config.scope,
    }));
}
function generateProviderToken(prefix = 'PROVIDER') {
    return Symbol(`${prefix}_${(0, crypto_1.randomUUID)()}`);
}
function generateProviderTokens(count, prefix = 'PROVIDER') {
    return Array.from({ length: count }, () => generateProviderToken(prefix));
}
function createProviderToken(name, namespace) {
    return namespace ? `${namespace}:${name}` : name;
}
class ProviderTokenRegistry {
    tokens = new Map();
    register(key, token) {
        if (this.tokens.has(key)) {
            this.logWarning(`Token already registered: ${key}`);
        }
        this.tokens.set(key, token);
        this.logDebug(`Token registered: ${key}`);
    }
    get(key) {
        return this.tokens.get(key);
    }
    has(key) {
        return this.tokens.has(key);
    }
    getAll() {
        return new Map(this.tokens);
    }
    clear() {
        this.tokens.clear();
        this.logDebug('All tokens cleared');
    }
}
exports.ProviderTokenRegistry = ProviderTokenRegistry;
const CUSTOM_PROVIDER_METADATA = 'custom:provider';
function CustomProvider(metadata = {}) {
    return (0, common_1.applyDecorators)((0, common_1.Injectable)(), (0, common_1.SetMetadata)(CUSTOM_PROVIDER_METADATA, metadata));
}
function ScopedProvider(scope, metadata = {}) {
    return (0, common_1.applyDecorators)((0, common_1.Injectable)({ scope }), (0, common_1.SetMetadata)(CUSTOM_PROVIDER_METADATA, { ...metadata, scope }));
}
function RequestScoped(metadata = {}) {
    return ScopedProvider(common_1.Scope.REQUEST, metadata);
}
function TransientProvider(metadata = {}) {
    return ScopedProvider(common_1.Scope.TRANSIENT, metadata);
}
function createMultiProvider(token, providers) {
    return providers.map(provider => ({
        provide: token,
        useClass: typeof provider === 'function' ? provider : undefined,
        useValue: typeof provider !== 'function' ? provider : undefined,
        multi: true,
    }));
}
function registerMultiProviders(configs) {
    return configs.flatMap(config => createMultiProvider(config.token, config.providers));
}
function createProviderOverride(config) {
    return {
        provide: config.original,
        useClass: typeof config.override === 'function' ? config.override : undefined,
        useValue: typeof config.override !== 'function' ? config.override : undefined,
        scope: config.scope,
    };
}
function createProviderOverrides(configs) {
    return configs.map(config => createProviderOverride(config));
}
class ProviderIntrospector {
    moduleRef;
    logger = new common_1.Logger('ProviderIntrospector');
    constructor(moduleRef) {
        this.moduleRef = moduleRef;
    }
    async getProvider(token, options) {
        try {
            return await this.moduleRef.resolve(token, undefined, options);
        }
        catch (error) {
            this.logWarning(`Provider not found: ${String(token)}`);
            return undefined;
        }
    }
    async hasProvider(token) {
        const provider = await this.getProvider(token);
        return provider !== undefined;
    }
    async getProviderInContext(token, contextId) {
        return this.moduleRef.resolve(token, contextId);
    }
    createContext() {
        return core_1.ContextIdFactory.create();
    }
}
exports.ProviderIntrospector = ProviderIntrospector;
function registerModuleProviders(config) {
    return {
        providers: config.providers,
        exports: config.exports,
        imports: config.imports,
    };
}
function createDynamicModule(moduleName, config) {
    return {
        module: class {
        },
        providers: config.providers,
        exports: config.exports,
        imports: config.imports,
        global: false,
    };
}
function createGlobalProvider(config) {
    const provider = {
        provide: config.token,
    };
    if (config.useClass) {
        provider.useClass = config.useClass;
    }
    else if (config.useValue !== undefined) {
        provider.useValue = config.useValue;
    }
    else if (config.useFactory) {
        provider.useFactory = config.useFactory;
        provider.inject = config.inject || [];
    }
    return {
        module: class {
        },
        providers: [provider],
        exports: [config.token],
        global: true,
    };
}
function createGlobalProviders(configs) {
    const providers = configs.map(config => {
        const provider = {
            provide: config.token,
        };
        if (config.useClass) {
            provider.useClass = config.useClass;
        }
        else if (config.useValue !== undefined) {
            provider.useValue = config.useValue;
        }
        else if (config.useFactory) {
            provider.useFactory = config.useFactory;
            provider.inject = config.inject || [];
        }
        return provider;
    });
    return {
        module: class {
        },
        providers,
        exports: configs.map(c => c.token),
        global: true,
    };
}
class LazyProvider {
    factory;
    name;
    instance;
    initializing = false;
    logger = new common_1.Logger('LazyProvider');
    constructor(factory, name = 'LazyProvider') {
        this.factory = factory;
        this.name = name;
    }
    async get() {
        if (this.instance) {
            return this.instance;
        }
        if (this.initializing) {
            while (this.initializing) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            return this.instance;
        }
        this.initializing = true;
        this.logDebug(`Initializing lazy provider: ${this.name}`);
        try {
            this.instance = await this.factory();
            this.logDebug(`Lazy provider initialized: ${this.name}`);
            return this.instance;
        }
        finally {
            this.initializing = false;
        }
    }
    isInitialized() {
        return this.instance !== undefined;
    }
    reset() {
        this.instance = undefined;
        this.initializing = false;
        this.logDebug(`Lazy provider reset: ${this.name}`);
    }
}
exports.LazyProvider = LazyProvider;
function createLazyProvider(token, factory, name) {
    const lazyProvider = new LazyProvider(factory, name);
    return {
        provide: token,
        useFactory: () => lazyProvider,
    };
}
class ProviderDependencyResolver {
    dependencyGraph = new Map();
    logger = new common_1.Logger('ProviderDependencyResolver');
    registerDependencies(provider, dependencies) {
        this.dependencyGraph.set(provider, new Set(dependencies));
        this.logDebug(`Dependencies registered for: ${String(provider)}`);
    }
    getDependencies(provider) {
        return Array.from(this.dependencyGraph.get(provider) || []);
    }
    getAllDependencies(provider) {
        const visited = new Set();
        const result = [];
        const traverse = (current) => {
            if (visited.has(current))
                return;
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
    hasCircularDependency(provider) {
        const visited = new Set();
        const recursionStack = new Set();
        const hasCycle = (current) => {
            if (recursionStack.has(current))
                return true;
            if (visited.has(current))
                return false;
            visited.add(current);
            recursionStack.add(current);
            const deps = this.dependencyGraph.get(current) || new Set();
            for (const dep of deps) {
                if (hasCycle(dep))
                    return true;
            }
            recursionStack.delete(current);
            return false;
        };
        return hasCycle(provider);
    }
    getResolutionOrder() {
        const visited = new Set();
        const result = [];
        const visit = (provider) => {
            if (visited.has(provider))
                return;
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
exports.ProviderDependencyResolver = ProviderDependencyResolver;
class ProviderFactoryRegistry {
    factories = new Map();
    logger = new common_1.Logger('ProviderFactoryRegistry');
    register(token, factory) {
        this.factories.set(token, factory);
        this.logDebug(`Factory registered: ${String(token)}`);
    }
    get(token) {
        return this.factories.get(token);
    }
    execute(token, ...args) {
        const factory = this.factories.get(token);
        if (!factory) {
            throw new Error(`Factory not found: ${String(token)}`);
        }
        return factory(...args);
    }
    has(token) {
        return this.factories.has(token);
    }
    clear() {
        this.factories.clear();
        this.logDebug('All factories cleared');
    }
}
exports.ProviderFactoryRegistry = ProviderFactoryRegistry;
class ProviderLifecycleManager {
    initHooks = new Map();
    destroyHooks = new Map();
    logger = new common_1.Logger('ProviderLifecycleManager');
    onInit(token, hook) {
        this.initHooks.set(token, hook);
        this.logDebug(`Init hook registered: ${String(token)}`);
    }
    onDestroy(token, hook) {
        this.destroyHooks.set(token, hook);
        this.logDebug(`Destroy hook registered: ${String(token)}`);
    }
    async executeInit(token) {
        const hook = this.initHooks.get(token);
        if (hook) {
            this.logDebug(`Executing init hook: ${String(token)}`);
            await hook();
        }
    }
    async executeDestroy(token) {
        const hook = this.destroyHooks.get(token);
        if (hook) {
            this.logDebug(`Executing destroy hook: ${String(token)}`);
            await hook();
        }
    }
    async executeAllInit() {
        for (const [token] of this.initHooks) {
            await this.executeInit(token);
        }
    }
    async executeAllDestroy() {
        for (const [token] of this.destroyHooks) {
            await this.executeDestroy(token);
        }
    }
}
exports.ProviderLifecycleManager = ProviderLifecycleManager;
class ProviderConfigBuilder {
    config = {};
    provide(token) {
        this.config.provide = token;
        return this;
    }
    useClass(useClass) {
        this.config.useClass = useClass;
        return this;
    }
    useValue(useValue) {
        this.config.useValue = useValue;
        return this;
    }
    useFactory(factory, dependencies) {
        this.config.useFactory = factory;
        this.config.inject = dependencies;
        return this;
    }
    scope(scope) {
        this.config.scope = scope;
        return this;
    }
    build() {
        if (!this.config.provide) {
            throw new Error('Provider token is required');
        }
        return registerDynamicProvider(this.config);
    }
}
exports.ProviderConfigBuilder = ProviderConfigBuilder;
function providerBuilder() {
    return new ProviderConfigBuilder();
}
class ProviderCollection {
    providers = [];
    logger = new common_1.Logger('ProviderCollection');
    add(provider) {
        this.providers.push(provider);
        this.logDebug(`Provider added to collection`);
        return this;
    }
    addAll(providers) {
        this.providers.push(...providers);
        this.logDebug(`${providers.length} providers added to collection`);
        return this;
    }
    filter(predicate) {
        const collection = new ProviderCollection();
        collection.addAll(this.providers.filter(predicate));
        return collection;
    }
    map(mapper) {
        return this.providers.map(mapper);
    }
    toArray() {
        return [...this.providers];
    }
    count() {
        return this.providers.length;
    }
    clear() {
        this.providers = [];
        this.logDebug('Collection cleared');
    }
}
exports.ProviderCollection = ProviderCollection;
function createProviderCollection(providers = []) {
    const collection = new ProviderCollection();
    collection.addAll(providers);
    return collection;
}
class ProviderValidator {
    logger = new common_1.Logger('ProviderValidator');
    validate(provider) {
        const errors = [];
        if (!provider.provide) {
            errors.push('Provider token is required');
        }
        const hasImplementation = provider.useClass ||
            provider.useValue !== undefined ||
            provider.useFactory ||
            provider.useExisting;
        if (!hasImplementation) {
            errors.push('Provider must have useClass, useValue, useFactory, or useExisting');
        }
        if (provider.useFactory && !provider.inject) {
            this.logWarning('Factory provider without inject array may cause issues');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    validateAll(providers) {
        return providers.map(provider => ({
            provider,
            ...this.validate(provider),
        }));
    }
    isValid(providers) {
        return this.validateAll(providers).every(result => result.valid);
    }
}
exports.ProviderValidator = ProviderValidator;
function createProviderAlias(originalToken, aliasToken) {
    return {
        provide: aliasToken,
        useExisting: originalToken,
    };
}
function createProviderAliases(aliases) {
    return aliases.map(({ original, alias }) => createProviderAlias(original, alias));
}
function createEnvironmentProvider(config, currentEnv = process.env.NODE_ENV || 'development') {
    const implementation = config.environments[currentEnv] || config.defaultProvider;
    if (!implementation) {
        throw new Error(`No provider implementation found for environment: ${currentEnv}`);
    }
    return {
        provide: config.token,
        useClass: typeof implementation === 'function' ? implementation : undefined,
        useValue: typeof implementation !== 'function' ? implementation : undefined,
    };
}
function createEnvironmentProviders(configs, currentEnv) {
    return configs.map(config => createEnvironmentProvider(config, currentEnv));
}
//# sourceMappingURL=dependency-injection.service.js.map