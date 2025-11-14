import {
  Provider,
  Scope,
  DynamicModule,
  Type,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  registerDynamicProvider,
  registerDynamicProviders,
  createFactoryProvider,
  createFactoryProviders,
  createAsyncProvider,
  createAsyncProviders,
  registerConditionalProvider,
  registerConditionalProviders,
  createRequestScopedProvider,
  createTransientProvider,
  createSingletonProvider,
  configureProviderScope,
  generateProviderToken,
  generateProviderTokens,
  createProviderToken,
  ProviderTokenRegistry,
  CustomProvider,
  ScopedProvider,
  RequestScoped,
  TransientProvider as TransientProviderDecorator,
  createMultiProvider,
  registerMultiProviders,
  createProviderOverride,
  createProviderOverrides,
  ProviderIntrospector,
  registerModuleProviders,
  createDynamicModule,
  createGlobalProvider,
  createGlobalProviders,
  LazyProvider,
  createLazyProvider,
  ProviderDependencyResolver,
  ProviderFactoryRegistry,
  ProviderLifecycleManager,
  ProviderConfigBuilder,
  providerBuilder,
  ProviderCollection,
  createProviderCollection,
  ProviderValidator,
  createProviderAlias,
  createProviderAliases,
  createEnvironmentProvider,
  createEnvironmentProviders,
  DynamicProviderOptions,
  ProviderToken,
} from './dependency-injection.service';

describe('Dependency Injection Service', () => {
  describe('Dynamic Provider Registration', () => {
    it('should register provider with class', () => {
      class TestService {}
      const provider = registerDynamicProvider({
        provide: 'TEST_SERVICE',
        useClass: TestService,
        scope: Scope.DEFAULT,
      });

      expect(provider).toBeDefined();
      expect((provider as any).provide).toBe('TEST_SERVICE');
      expect((provider as any).useClass).toBe(TestService);
      expect((provider as any).scope).toBe(Scope.DEFAULT);
    });

    it('should register provider with value', () => {
      const value = { config: 'test' };
      const provider = registerDynamicProvider({
        provide: 'CONFIG',
        useValue: value,
      });

      expect((provider as any).provide).toBe('CONFIG');
      expect((provider as any).useValue).toEqual(value);
    });

    it('should register provider with factory', () => {
      const factory = (dep: string) => ({ result: dep });
      const provider = registerDynamicProvider({
        provide: 'FACTORY_SERVICE',
        useFactory: factory,
        inject: ['DEPENDENCY'],
      });

      expect((provider as any).provide).toBe('FACTORY_SERVICE');
      expect((provider as any).useFactory).toBe(factory);
      expect((provider as any).inject).toEqual(['DEPENDENCY']);
    });

    it('should register multiple dynamic providers', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = registerDynamicProviders([
        { provide: 'SERVICE_A', useClass: ServiceA },
        { provide: 'SERVICE_B', useClass: ServiceB },
      ]);

      expect(providers).toHaveLength(2);
      expect((providers[0] as any).provide).toBe('SERVICE_A');
      expect((providers[1] as any).provide).toBe('SERVICE_B');
    });

    it('should register provider with undefined value', () => {
      const provider = registerDynamicProvider({
        provide: 'UNDEFINED_VALUE',
        useValue: undefined,
      });

      expect((provider as any).provide).toBe('UNDEFINED_VALUE');
      expect((provider as any).useValue).toBeUndefined();
    });
  });

  describe('Factory Provider Creation', () => {
    it('should create factory provider', () => {
      const factory = (config: { url: string }) => ({ client: config.url });
      const provider = createFactoryProvider({
        token: 'HTTP_CLIENT',
        factory,
        dependencies: ['CONFIG'],
        scope: Scope.DEFAULT,
      });

      expect((provider as any).provide).toBe('HTTP_CLIENT');
      expect((provider as any).useFactory).toBe(factory);
      expect((provider as any).inject).toEqual(['CONFIG']);
      expect((provider as any).scope).toBe(Scope.DEFAULT);
    });

    it('should create factory provider without dependencies', () => {
      const factory = () => ({ value: 'static' });
      const provider = createFactoryProvider({
        token: 'STATIC_FACTORY',
        factory,
      });

      expect((provider as any).inject).toEqual([]);
    });

    it('should create multiple factory providers', () => {
      const providers = createFactoryProviders([
        {
          token: 'FACTORY_1',
          factory: () => 'value1',
        },
        {
          token: 'FACTORY_2',
          factory: () => 'value2',
        },
      ]);

      expect(providers).toHaveLength(2);
      expect((providers[0] as any).provide).toBe('FACTORY_1');
      expect((providers[1] as any).provide).toBe('FACTORY_2');
    });
  });

  describe('Async Provider Creation', () => {
    it('should create async provider', async () => {
      const asyncFactory = async (config: { delay: number }) => {
        await new Promise(resolve => setTimeout(resolve, config.delay));
        return { initialized: true };
      };

      const provider = createAsyncProvider({
        token: 'ASYNC_SERVICE',
        asyncFactory,
        dependencies: ['CONFIG'],
      });

      expect((provider as any).provide).toBe('ASYNC_SERVICE');
      expect((provider as any).useFactory).toBeDefined();
      expect((provider as any).inject).toEqual(['CONFIG']);
    });

    it('should execute async factory correctly', async () => {
      const asyncFactory = async () => {
        return { result: 'async-data' };
      };

      const provider = createAsyncProvider({
        token: 'ASYNC_DATA',
        asyncFactory,
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toEqual({ result: 'async-data' });
    });

    it('should create multiple async providers', () => {
      const providers = createAsyncProviders([
        {
          token: 'ASYNC_1',
          asyncFactory: async () => 'value1',
        },
        {
          token: 'ASYNC_2',
          asyncFactory: async () => 'value2',
        },
      ]);

      expect(providers).toHaveLength(2);
    });
  });

  describe('Conditional Provider Registration', () => {
    it('should use true provider when condition is true', async () => {
      class TrueService {}
      class FalseService {}

      const provider = registerConditionalProvider({
        token: 'CONDITIONAL_SERVICE',
        condition: () => true,
        trueProvider: TrueService,
        falseProvider: FalseService,
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toBeInstanceOf(TrueService);
    });

    it('should use false provider when condition is false', async () => {
      class TrueService {}
      class FalseService {}

      const provider = registerConditionalProvider({
        token: 'CONDITIONAL_SERVICE',
        condition: () => false,
        trueProvider: TrueService,
        falseProvider: FalseService,
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toBeInstanceOf(FalseService);
    });

    it('should return null when condition is false and no false provider', async () => {
      class TrueService {}

      const provider = registerConditionalProvider({
        token: 'CONDITIONAL_SERVICE',
        condition: () => false,
        trueProvider: TrueService,
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toBeNull();
    });

    it('should handle async condition', async () => {
      class TrueService {}

      const provider = registerConditionalProvider({
        token: 'ASYNC_CONDITIONAL',
        condition: async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return true;
        },
        trueProvider: TrueService,
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toBeInstanceOf(TrueService);
    });

    it('should use value providers in conditional', async () => {
      const provider = registerConditionalProvider({
        token: 'VALUE_CONDITIONAL',
        condition: () => true,
        trueProvider: { value: 'true-config' },
        falseProvider: { value: 'false-config' },
      });

      const factory = (provider as any).useFactory;
      const result = await factory();

      expect(result).toEqual({ value: 'true-config' });
    });

    it('should register multiple conditional providers', () => {
      const providers = registerConditionalProviders([
        {
          token: 'COND_1',
          condition: () => true,
          trueProvider: 'value1',
        },
        {
          token: 'COND_2',
          condition: () => false,
          trueProvider: 'value2',
          falseProvider: 'fallback',
        },
      ]);

      expect(providers).toHaveLength(2);
    });
  });

  describe('Scoped Provider Creation', () => {
    it('should create request-scoped provider', () => {
      class RequestService {}
      const provider = createRequestScopedProvider('REQUEST_SERVICE', RequestService);

      expect((provider as any).provide).toBe('REQUEST_SERVICE');
      expect((provider as any).useClass).toBe(RequestService);
      expect((provider as any).scope).toBe(Scope.REQUEST);
    });

    it('should create transient provider', () => {
      class TransientService {}
      const provider = createTransientProvider('TRANSIENT_SERVICE', TransientService);

      expect((provider as any).provide).toBe('TRANSIENT_SERVICE');
      expect((provider as any).useClass).toBe(TransientService);
      expect((provider as any).scope).toBe(Scope.TRANSIENT);
    });

    it('should create singleton provider', () => {
      class SingletonService {}
      const provider = createSingletonProvider('SINGLETON_SERVICE', SingletonService);

      expect((provider as any).provide).toBe('SINGLETON_SERVICE');
      expect((provider as any).useClass).toBe(SingletonService);
      expect((provider as any).scope).toBe(Scope.DEFAULT);
    });

    it('should configure multiple providers with same scope', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = configureProviderScope({
        providers: [
          { token: 'SERVICE_A', useClass: ServiceA },
          { token: 'SERVICE_B', useClass: ServiceB },
        ],
        scope: Scope.REQUEST,
      });

      expect(providers).toHaveLength(2);
      expect((providers[0] as any).scope).toBe(Scope.REQUEST);
      expect((providers[1] as any).scope).toBe(Scope.REQUEST);
    });
  });

  describe('Provider Token Generation', () => {
    it('should generate unique provider token', () => {
      const token1 = generateProviderToken();
      const token2 = generateProviderToken();

      expect(typeof token1).toBe('symbol');
      expect(typeof token2).toBe('symbol');
      expect(token1).not.toBe(token2);
    });

    it('should generate token with custom prefix', () => {
      const token = generateProviderToken('CUSTOM');
      const tokenString = token.toString();

      expect(tokenString).toContain('CUSTOM');
    });

    it('should generate multiple tokens', () => {
      const tokens = generateProviderTokens(5, 'SERVICE');

      expect(tokens).toHaveLength(5);
      tokens.forEach(token => {
        expect(typeof token).toBe('symbol');
        expect(token.toString()).toContain('SERVICE');
      });
    });

    it('should create string-based provider token', () => {
      const token = createProviderToken('CONFIG');

      expect(token).toBe('CONFIG');
    });

    it('should create namespaced provider token', () => {
      const token = createProviderToken('CONFIG', 'database');

      expect(token).toBe('database:CONFIG');
    });
  });

  describe('ProviderTokenRegistry', () => {
    let registry: ProviderTokenRegistry;

    beforeEach(() => {
      registry = new ProviderTokenRegistry();
    });

    it('should register and retrieve token', () => {
      const token = Symbol('TEST');
      registry.register('test', token);

      expect(registry.get('test')).toBe(token);
    });

    it('should check if token exists', () => {
      const token = Symbol('TEST');
      registry.register('test', token);

      expect(registry.has('test')).toBe(true);
      expect(registry.has('nonexistent')).toBe(false);
    });

    it('should get all tokens', () => {
      const token1 = Symbol('TEST1');
      const token2 = Symbol('TEST2');

      registry.register('test1', token1);
      registry.register('test2', token2);

      const allTokens = registry.getAll();

      expect(allTokens.size).toBe(2);
      expect(allTokens.get('test1')).toBe(token1);
      expect(allTokens.get('test2')).toBe(token2);
    });

    it('should clear all tokens', () => {
      registry.register('test1', Symbol('TEST1'));
      registry.register('test2', Symbol('TEST2'));

      registry.clear();

      expect(registry.getAll().size).toBe(0);
    });

    it('should handle duplicate registration', () => {
      const token1 = Symbol('TEST1');
      const token2 = Symbol('TEST2');

      registry.register('test', token1);
      registry.register('test', token2);

      expect(registry.get('test')).toBe(token2);
    });
  });

  describe('Multi-Provider Creation', () => {
    it('should create multi-providers with classes', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = createMultiProvider('MULTI_SERVICE', [ServiceA, ServiceB]);

      expect(providers).toHaveLength(2);
      expect((providers[0] as any).provide).toBe('MULTI_SERVICE');
      expect((providers[0] as any).multi).toBe(true);
      expect((providers[0] as any).useClass).toBe(ServiceA);
      expect((providers[1] as any).useClass).toBe(ServiceB);
    });

    it('should create multi-providers with values', () => {
      const providers = createMultiProvider('MULTI_VALUE', ['value1', 'value2']);

      expect(providers).toHaveLength(2);
      expect((providers[0] as any).useValue).toBe('value1');
      expect((providers[1] as any).useValue).toBe('value2');
    });

    it('should register multiple multi-provider configs', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = registerMultiProviders([
        { token: 'MULTI_A', providers: [ServiceA] },
        { token: 'MULTI_B', providers: [ServiceB] },
      ]);

      expect(providers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Provider Override', () => {
    it('should create provider override with class', () => {
      class OriginalService {}
      class OverrideService {}

      const provider = createProviderOverride({
        original: 'SERVICE',
        override: OverrideService,
      });

      expect((provider as any).provide).toBe('SERVICE');
      expect((provider as any).useClass).toBe(OverrideService);
    });

    it('should create provider override with value', () => {
      const provider = createProviderOverride({
        original: 'CONFIG',
        override: { overridden: true },
      });

      expect((provider as any).useValue).toEqual({ overridden: true });
    });

    it('should create provider override with custom scope', () => {
      class OverrideService {}

      const provider = createProviderOverride({
        original: 'SERVICE',
        override: OverrideService,
        scope: Scope.TRANSIENT,
      });

      expect((provider as any).scope).toBe(Scope.TRANSIENT);
    });

    it('should create multiple provider overrides', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = createProviderOverrides([
        { original: 'SERVICE_A', override: ServiceA },
        { original: 'SERVICE_B', override: ServiceB },
      ]);

      expect(providers).toHaveLength(2);
    });
  });

  describe('ProviderIntrospector', () => {
    let introspector: ProviderIntrospector;
    let mockModuleRef: Partial<ModuleRef>;

    beforeEach(() => {
      mockModuleRef = {
        resolve: jest.fn(),
      };
      introspector = new ProviderIntrospector(mockModuleRef as ModuleRef);
    });

    it('should get provider instance', async () => {
      const mockService = { value: 'test' };
      (mockModuleRef.resolve as jest.Mock).mockResolvedValue(mockService);

      const result = await introspector.getProvider('TEST_SERVICE');

      expect(result).toBe(mockService);
      expect(mockModuleRef.resolve).toHaveBeenCalledWith('TEST_SERVICE', undefined, undefined);
    });

    it('should return undefined for non-existent provider', async () => {
      (mockModuleRef.resolve as jest.Mock).mockRejectedValue(new Error('Not found'));

      const result = await introspector.getProvider('NONEXISTENT');

      expect(result).toBeUndefined();
    });

    it('should check if provider exists', async () => {
      (mockModuleRef.resolve as jest.Mock).mockResolvedValue({ value: 'test' });

      const exists = await introspector.hasProvider('TEST_SERVICE');

      expect(exists).toBe(true);
    });

    it('should return false for non-existent provider', async () => {
      (mockModuleRef.resolve as jest.Mock).mockResolvedValue(undefined);

      const exists = await introspector.hasProvider('NONEXISTENT');

      expect(exists).toBe(false);
    });

    it('should create context for request-scoped providers', () => {
      const context = introspector.createContext();

      expect(context).toBeDefined();
    });

    it('should get provider with context', async () => {
      const mockService = { value: 'test' };
      const mockContext = { id: 'context-123' };
      (mockModuleRef.resolve as jest.Mock).mockResolvedValue(mockService);

      const result = await introspector.getProviderInContext('TEST_SERVICE', mockContext);

      expect(result).toBe(mockService);
      expect(mockModuleRef.resolve).toHaveBeenCalledWith('TEST_SERVICE', mockContext);
    });
  });

  describe('Module Provider Registration', () => {
    it('should register module providers', () => {
      class ServiceA {}
      const providerA: Provider = { provide: 'SERVICE_A', useClass: ServiceA };

      const metadata = registerModuleProviders({
        providers: [providerA],
        exports: ['SERVICE_A'],
        imports: [],
      });

      expect(metadata.providers).toEqual([providerA]);
      expect(metadata.exports).toEqual(['SERVICE_A']);
      expect(metadata.imports).toEqual([]);
    });

    it('should create dynamic module', () => {
      class ServiceA {}
      const providerA: Provider = { provide: 'SERVICE_A', useClass: ServiceA };

      const dynamicModule = createDynamicModule('TestModule', {
        providers: [providerA],
        exports: ['SERVICE_A'],
      });

      expect(dynamicModule.providers).toEqual([providerA]);
      expect(dynamicModule.exports).toEqual(['SERVICE_A']);
      expect(dynamicModule.global).toBe(false);
    });
  });

  describe('Global Provider Creation', () => {
    it('should create global provider with class', () => {
      class GlobalService {}

      const module = createGlobalProvider({
        token: 'GLOBAL_SERVICE',
        useClass: GlobalService,
      });

      expect(module.global).toBe(true);
      expect(module.exports).toEqual(['GLOBAL_SERVICE']);
      expect((module.providers?.[0] as any).provide).toBe('GLOBAL_SERVICE');
    });

    it('should create global provider with value', () => {
      const module = createGlobalProvider({
        token: 'GLOBAL_CONFIG',
        useValue: { setting: 'value' },
      });

      expect(module.global).toBe(true);
      expect((module.providers?.[0] as any).useValue).toEqual({ setting: 'value' });
    });

    it('should create global provider with factory', () => {
      const factory = () => ({ initialized: true });

      const module = createGlobalProvider({
        token: 'GLOBAL_FACTORY',
        useFactory: factory,
        inject: ['DEPENDENCY'],
      });

      expect((module.providers?.[0] as any).useFactory).toBe(factory);
      expect((module.providers?.[0] as any).inject).toEqual(['DEPENDENCY']);
    });

    it('should create multiple global providers', () => {
      class ServiceA {}
      class ServiceB {}

      const module = createGlobalProviders([
        { token: 'SERVICE_A', useClass: ServiceA },
        { token: 'SERVICE_B', useClass: ServiceB },
      ]);

      expect(module.global).toBe(true);
      expect(module.providers).toHaveLength(2);
      expect(module.exports).toEqual(['SERVICE_A', 'SERVICE_B']);
    });
  });

  describe('LazyProvider', () => {
    it('should initialize lazily', async () => {
      let initialized = false;
      const factory = async () => {
        initialized = true;
        return { value: 'lazy' };
      };

      const lazyProvider = new LazyProvider(factory, 'TestLazy');

      expect(initialized).toBe(false);
      expect(lazyProvider.isInitialized()).toBe(false);

      const result = await lazyProvider.get();

      expect(initialized).toBe(true);
      expect(lazyProvider.isInitialized()).toBe(true);
      expect(result).toEqual({ value: 'lazy' });
    });

    it('should return same instance on multiple calls', async () => {
      const factory = async () => ({ value: Math.random() });
      const lazyProvider = new LazyProvider(factory);

      const result1 = await lazyProvider.get();
      const result2 = await lazyProvider.get();

      expect(result1).toBe(result2);
    });

    it('should reset instance', async () => {
      const factory = async () => ({ value: Math.random() });
      const lazyProvider = new LazyProvider(factory);

      const result1 = await lazyProvider.get();
      lazyProvider.reset();

      expect(lazyProvider.isInitialized()).toBe(false);

      const result2 = await lazyProvider.get();

      expect(result1).not.toBe(result2);
    });

    it('should handle concurrent initialization', async () => {
      let callCount = 0;
      const factory = async () => {
        callCount++;
        await new Promise(resolve => setTimeout(resolve, 50));
        return { value: 'concurrent' };
      };

      const lazyProvider = new LazyProvider(factory);

      const [result1, result2, result3] = await Promise.all([
        lazyProvider.get(),
        lazyProvider.get(),
        lazyProvider.get(),
      ]);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(callCount).toBe(1);
    });

    it('should create lazy provider', () => {
      const factory = async () => ({ data: 'lazy' });
      const provider = createLazyProvider('LAZY_SERVICE', factory, 'LazyService');

      expect((provider as any).provide).toBe('LAZY_SERVICE');
      expect((provider as any).useFactory).toBeDefined();
    });
  });

  describe('ProviderDependencyResolver', () => {
    let resolver: ProviderDependencyResolver;

    beforeEach(() => {
      resolver = new ProviderDependencyResolver();
    });

    it('should register dependencies', () => {
      resolver.registerDependencies('ServiceA', ['ServiceB', 'ServiceC']);

      const deps = resolver.getDependencies('ServiceA');

      expect(deps).toEqual(['ServiceB', 'ServiceC']);
    });

    it('should get all transitive dependencies', () => {
      resolver.registerDependencies('ServiceA', ['ServiceB']);
      resolver.registerDependencies('ServiceB', ['ServiceC']);
      resolver.registerDependencies('ServiceC', []);

      const allDeps = resolver.getAllDependencies('ServiceA');

      expect(allDeps).toContain('ServiceB');
      expect(allDeps).toContain('ServiceC');
    });

    it('should detect circular dependencies', () => {
      resolver.registerDependencies('ServiceA', ['ServiceB']);
      resolver.registerDependencies('ServiceB', ['ServiceA']);

      const hasCircular = resolver.hasCircularDependency('ServiceA');

      expect(hasCircular).toBe(true);
    });

    it('should not detect circular dependency when none exists', () => {
      resolver.registerDependencies('ServiceA', ['ServiceB']);
      resolver.registerDependencies('ServiceB', ['ServiceC']);

      const hasCircular = resolver.hasCircularDependency('ServiceA');

      expect(hasCircular).toBe(false);
    });

    it('should get resolution order', () => {
      resolver.registerDependencies('ServiceA', ['ServiceB', 'ServiceC']);
      resolver.registerDependencies('ServiceB', ['ServiceD']);
      resolver.registerDependencies('ServiceC', []);
      resolver.registerDependencies('ServiceD', []);

      const order = resolver.getResolutionOrder();

      const indexA = order.indexOf('ServiceA');
      const indexB = order.indexOf('ServiceB');
      const indexC = order.indexOf('ServiceC');
      const indexD = order.indexOf('ServiceD');

      expect(indexB).toBeGreaterThan(indexD);
      expect(indexA).toBeGreaterThan(indexB);
      expect(indexA).toBeGreaterThan(indexC);
    });
  });

  describe('ProviderFactoryRegistry', () => {
    let registry: ProviderFactoryRegistry;

    beforeEach(() => {
      registry = new ProviderFactoryRegistry();
    });

    it('should register and retrieve factory', () => {
      const factory = () => ({ value: 'test' });
      registry.register('TEST_FACTORY', factory);

      const retrieved = registry.get('TEST_FACTORY');

      expect(retrieved).toBe(factory);
    });

    it('should execute factory', () => {
      const factory = (arg: string) => ({ result: arg });
      registry.register('TEST_FACTORY', factory);

      const result = registry.execute('TEST_FACTORY', 'input');

      expect(result).toEqual({ result: 'input' });
    });

    it('should throw error when executing non-existent factory', () => {
      expect(() => {
        registry.execute('NONEXISTENT');
      }).toThrow('Factory not found: NONEXISTENT');
    });

    it('should check if factory exists', () => {
      registry.register('TEST_FACTORY', () => ({}));

      expect(registry.has('TEST_FACTORY')).toBe(true);
      expect(registry.has('NONEXISTENT')).toBe(false);
    });

    it('should clear all factories', () => {
      registry.register('FACTORY_1', () => ({}));
      registry.register('FACTORY_2', () => ({}));

      registry.clear();

      expect(registry.has('FACTORY_1')).toBe(false);
      expect(registry.has('FACTORY_2')).toBe(false);
    });
  });

  describe('ProviderLifecycleManager', () => {
    let manager: ProviderLifecycleManager;

    beforeEach(() => {
      manager = new ProviderLifecycleManager();
    });

    it('should register and execute init hook', async () => {
      let initialized = false;
      manager.onInit('TEST_SERVICE', async () => {
        initialized = true;
      });

      await manager.executeInit('TEST_SERVICE');

      expect(initialized).toBe(true);
    });

    it('should register and execute destroy hook', async () => {
      let destroyed = false;
      manager.onDestroy('TEST_SERVICE', async () => {
        destroyed = true;
      });

      await manager.executeDestroy('TEST_SERVICE');

      expect(destroyed).toBe(true);
    });

    it('should execute all init hooks', async () => {
      const initResults: string[] = [];

      manager.onInit('SERVICE_A', async () => {
        initResults.push('A');
      });
      manager.onInit('SERVICE_B', async () => {
        initResults.push('B');
      });

      await manager.executeAllInit();

      expect(initResults).toContain('A');
      expect(initResults).toContain('B');
    });

    it('should execute all destroy hooks', async () => {
      const destroyResults: string[] = [];

      manager.onDestroy('SERVICE_A', async () => {
        destroyResults.push('A');
      });
      manager.onDestroy('SERVICE_B', async () => {
        destroyResults.push('B');
      });

      await manager.executeAllDestroy();

      expect(destroyResults).toContain('A');
      expect(destroyResults).toContain('B');
    });

    it('should handle missing hooks gracefully', async () => {
      await expect(manager.executeInit('NONEXISTENT')).resolves.not.toThrow();
      await expect(manager.executeDestroy('NONEXISTENT')).resolves.not.toThrow();
    });
  });

  describe('ProviderConfigBuilder', () => {
    it('should build provider with class', () => {
      class TestService {}

      const provider = providerBuilder()
        .provide('TEST_SERVICE')
        .useClass(TestService)
        .scope(Scope.DEFAULT)
        .build();

      expect((provider as any).provide).toBe('TEST_SERVICE');
      expect((provider as any).useClass).toBe(TestService);
      expect((provider as any).scope).toBe(Scope.DEFAULT);
    });

    it('should build provider with value', () => {
      const provider = providerBuilder()
        .provide('CONFIG')
        .useValue({ setting: 'value' })
        .build();

      expect((provider as any).useValue).toEqual({ setting: 'value' });
    });

    it('should build provider with factory', () => {
      const factory = () => ({ result: 'data' });

      const provider = providerBuilder()
        .provide('FACTORY_SERVICE')
        .useFactory(factory, ['DEPENDENCY'])
        .build();

      expect((provider as any).useFactory).toBe(factory);
      expect((provider as any).inject).toEqual(['DEPENDENCY']);
    });

    it('should throw error when token is missing', () => {
      expect(() => {
        providerBuilder().useValue('value').build();
      }).toThrow('Provider token is required');
    });
  });

  describe('ProviderCollection', () => {
    let collection: ProviderCollection;

    beforeEach(() => {
      collection = new ProviderCollection();
    });

    it('should add provider to collection', () => {
      const provider: Provider = { provide: 'TEST', useValue: 'value' };
      collection.add(provider);

      expect(collection.count()).toBe(1);
    });

    it('should add multiple providers', () => {
      const providers: Provider[] = [
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ];

      collection.addAll(providers);

      expect(collection.count()).toBe(2);
    });

    it('should filter providers', () => {
      collection.addAll([
        { provide: 'SERVICE_A', useValue: 'A', scope: Scope.REQUEST },
        { provide: 'SERVICE_B', useValue: 'B', scope: Scope.DEFAULT },
        { provide: 'SERVICE_C', useValue: 'C', scope: Scope.REQUEST },
      ]);

      const filtered = collection.filter(p => (p as any).scope === Scope.REQUEST);

      expect(filtered.count()).toBe(2);
    });

    it('should map providers', () => {
      collection.addAll([
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ]);

      const tokens = collection.map(p => (p as any).provide);

      expect(tokens).toEqual(['SERVICE_A', 'SERVICE_B']);
    });

    it('should convert to array', () => {
      const providers: Provider[] = [
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ];

      collection.addAll(providers);
      const array = collection.toArray();

      expect(array).toHaveLength(2);
      expect(array).toEqual(providers);
    });

    it('should clear collection', () => {
      collection.addAll([
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ]);

      collection.clear();

      expect(collection.count()).toBe(0);
    });

    it('should create provider collection from array', () => {
      const providers: Provider[] = [
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ];

      const collection = createProviderCollection(providers);

      expect(collection.count()).toBe(2);
    });
  });

  describe('ProviderValidator', () => {
    let validator: ProviderValidator;

    beforeEach(() => {
      validator = new ProviderValidator();
    });

    it('should validate valid provider', () => {
      const provider: Provider = {
        provide: 'TEST_SERVICE',
        useValue: 'value',
      };

      const result = validator.validate(provider);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate provider without token', () => {
      const provider = {
        useValue: 'value',
      } as Provider;

      const result = validator.validate(provider);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider token is required');
    });

    it('should invalidate provider without implementation', () => {
      const provider = {
        provide: 'TEST_SERVICE',
      } as Provider;

      const result = validator.validate(provider);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate all providers', () => {
      const providers: Provider[] = [
        { provide: 'VALID', useValue: 'value' },
        { useValue: 'invalid' } as Provider,
      ];

      const results = validator.validateAll(providers);

      expect(results).toHaveLength(2);
      expect(results[0].valid).toBe(true);
      expect(results[1].valid).toBe(false);
    });

    it('should check if all providers are valid', () => {
      const validProviders: Provider[] = [
        { provide: 'SERVICE_A', useValue: 'A' },
        { provide: 'SERVICE_B', useValue: 'B' },
      ];

      expect(validator.isValid(validProviders)).toBe(true);
    });
  });

  describe('Provider Alias Creation', () => {
    it('should create provider alias', () => {
      const alias = createProviderAlias('ORIGINAL_SERVICE', 'ALIAS_SERVICE');

      expect((alias as any).provide).toBe('ALIAS_SERVICE');
      expect((alias as any).useExisting).toBe('ORIGINAL_SERVICE');
    });

    it('should create multiple provider aliases', () => {
      const aliases = createProviderAliases([
        { original: 'SERVICE_A', alias: 'ALIAS_A' },
        { original: 'SERVICE_B', alias: 'ALIAS_B' },
      ]);

      expect(aliases).toHaveLength(2);
      expect((aliases[0] as any).provide).toBe('ALIAS_A');
      expect((aliases[1] as any).provide).toBe('ALIAS_B');
    });
  });

  describe('Environment-Based Provider Creation', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should create provider based on current environment', () => {
      class ProdService {}
      class DevService {}

      process.env.NODE_ENV = 'production';

      const provider = createEnvironmentProvider({
        token: 'ENV_SERVICE',
        environments: {
          production: ProdService,
          development: DevService,
        },
      });

      expect((provider as any).useClass).toBe(ProdService);
    });

    it('should use default provider when environment not found', () => {
      class DefaultService {}

      process.env.NODE_ENV = 'test';

      const provider = createEnvironmentProvider(
        {
          token: 'ENV_SERVICE',
          environments: {
            production: {},
          },
          defaultProvider: DefaultService,
        },
        'test',
      );

      expect((provider as any).useClass).toBe(DefaultService);
    });

    it('should throw error when no matching environment and no default', () => {
      process.env.NODE_ENV = 'unknown';

      expect(() => {
        createEnvironmentProvider({
          token: 'ENV_SERVICE',
          environments: {
            production: {},
          },
        });
      }).toThrow('No provider implementation found for environment');
    });

    it('should create multiple environment-based providers', () => {
      class ServiceA {}
      class ServiceB {}

      const providers = createEnvironmentProviders(
        [
          {
            token: 'SERVICE_A',
            environments: { production: ServiceA },
            defaultProvider: ServiceA,
          },
          {
            token: 'SERVICE_B',
            environments: { development: ServiceB },
            defaultProvider: ServiceB,
          },
        ],
        'development',
      );

      expect(providers).toHaveLength(2);
    });
  });
});
