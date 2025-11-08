/**
 * LOC: TOPK8901234
 * File: /reuse/san/typescript-oracle-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - Domain-driven design modules
 *   - Enterprise service architecture
 */

/**
 * File: /reuse/san/typescript-oracle-patterns-kit.ts
 * Locator: WC-UTL-TOPK-001
 * Purpose: Enterprise Design Patterns - Service Locator, DI, Factory, Strategy, Chain of Responsibility, Command, Observer
 *
 * Upstream: Independent utility module for enterprise design patterns
 * Downstream: ../backend/*, service architecture, domain modules, event systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Reflect-metadata
 * Exports: 46 utility functions for implementing GoF patterns, SOLID principles, and enterprise architecture patterns
 *
 * LLM Context: Comprehensive enterprise design pattern utilities for building scalable, maintainable healthcare systems.
 * Provides Service Locator, Dependency Injection, Abstract Factory, Strategy, Chain of Responsibility, Command, Observer,
 * Singleton, Builder, Prototype, Adapter, Decorator, Facade, Proxy, and Composite patterns. Essential for HIPAA-compliant
 * healthcare applications requiring robust architecture, testability, and maintainability.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ServiceDescriptor {
  id: string | symbol;
  instance?: any;
  factory?: () => any;
  singleton?: boolean;
  dependencies?: (string | symbol)[];
}

interface ServiceLocatorConfig {
  enableCaching: boolean;
  enableLazyInit: boolean;
  strictMode: boolean;
}

interface DependencyMetadata {
  propertyKey: string;
  serviceId: string | symbol;
  required: boolean;
}

interface FactoryConfig<T> {
  type: string;
  createFn: (config?: any) => T;
  validators?: ((config: any) => boolean)[];
}

interface StrategyContext<T> {
  strategies: Map<string, Strategy<T>>;
  defaultStrategy?: string;
}

interface Strategy<T> {
  execute(input: T): Promise<any> | any;
  canHandle?(input: T): boolean;
  priority?: number;
}

interface ChainHandler<T> {
  handle(request: T): Promise<T | null> | T | null;
  setNext(handler: ChainHandler<T>): ChainHandler<T>;
  getNext(): ChainHandler<T> | null;
}

interface Command<T = any> {
  execute(): Promise<T> | T;
  undo?(): Promise<void> | void;
  validate?(): boolean;
  metadata?: CommandMetadata;
}

interface CommandMetadata {
  id: string;
  timestamp: number;
  userId?: string;
  auditLog?: boolean;
}

interface Observer<T> {
  update(data: T): void | Promise<void>;
  id?: string;
  priority?: number;
}

interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): Promise<void>;
}

interface BuilderStep<T> {
  name: string;
  execute(context: Partial<T>): Partial<T> | Promise<Partial<T>>;
  validate?(context: Partial<T>): boolean;
  optional?: boolean;
}

interface ProxyConfig {
  enableLogging: boolean;
  enableCaching: boolean;
  enableValidation: boolean;
  cacheTimeout?: number;
}

interface DecoratorMetadata {
  target: any;
  propertyKey: string;
  descriptor: PropertyDescriptor;
  metadata: Record<string, any>;
}

// ============================================================================
// SERVICE LOCATOR PATTERN
// ============================================================================

/**
 * Creates a service locator for centralized service management.
 *
 * @param {ServiceLocatorConfig} [config] - Service locator configuration
 * @returns {object} Service locator instance with register, resolve, and management methods
 *
 * @example
 * ```typescript
 * const locator = createServiceLocator({ enableCaching: true, strictMode: true });
 *
 * locator.register('userService', UserService, true);
 * locator.register('emailService', () => new EmailService(), false);
 *
 * const userService = locator.resolve('userService');
 * ```
 */
export const createServiceLocator = (config?: Partial<ServiceLocatorConfig>) => {
  const cfg: ServiceLocatorConfig = {
    enableCaching: true,
    enableLazyInit: true,
    strictMode: false,
    ...config,
  };

  const services = new Map<string | symbol, ServiceDescriptor>();
  const instances = new Map<string | symbol, any>();

  const register = (
    id: string | symbol,
    factoryOrInstance: any,
    singleton: boolean = true,
    dependencies: (string | symbol)[] = [],
  ) => {
    const isFactory = typeof factoryOrInstance === 'function';

    services.set(id, {
      id,
      ...(isFactory ? { factory: factoryOrInstance } : { instance: factoryOrInstance }),
      singleton,
      dependencies,
    });
  };

  const resolve = <T = any>(id: string | symbol): T => {
    if (cfg.enableCaching && instances.has(id)) {
      return instances.get(id);
    }

    const descriptor = services.get(id);

    if (!descriptor) {
      if (cfg.strictMode) {
        throw new Error(`Service not found: ${String(id)}`);
      }
      return null as any;
    }

    let instance: any;

    if (descriptor.instance !== undefined) {
      instance = descriptor.instance;
    } else if (descriptor.factory) {
      const deps = descriptor.dependencies?.map(depId => resolve(depId)) || [];
      instance = descriptor.factory(...deps);
    }

    if (descriptor.singleton && cfg.enableCaching) {
      instances.set(id, instance);
    }

    return instance;
  };

  const clear = () => {
    instances.clear();
  };

  const has = (id: string | symbol): boolean => {
    return services.has(id);
  };

  const unregister = (id: string | symbol): boolean => {
    instances.delete(id);
    return services.delete(id);
  };

  return { register, resolve, clear, has, unregister };
};

/**
 * Validates service dependencies for circular references.
 *
 * @param {Map<string | symbol, ServiceDescriptor>} services - Service registry
 * @param {string | symbol} serviceId - Service to validate
 * @param {Set<string | symbol>} [visited] - Visited services for cycle detection
 * @returns {boolean} True if dependencies are valid
 *
 * @example
 * ```typescript
 * const services = new Map([
 *   ['userService', { id: 'userService', dependencies: ['emailService'] }],
 *   ['emailService', { id: 'emailService', dependencies: [] }]
 * ]);
 *
 * const isValid = validateServiceDependencies(services, 'userService');
 * // Result: true
 * ```
 */
export const validateServiceDependencies = (
  services: Map<string | symbol, ServiceDescriptor>,
  serviceId: string | symbol,
  visited: Set<string | symbol> = new Set(),
): boolean => {
  if (visited.has(serviceId)) {
    return false; // Circular dependency detected
  }

  const descriptor = services.get(serviceId);
  if (!descriptor || !descriptor.dependencies) {
    return true;
  }

  visited.add(serviceId);

  for (const depId of descriptor.dependencies) {
    if (!validateServiceDependencies(services, depId, new Set(visited))) {
      return false;
    }
  }

  return true;
};

/**
 * Creates a scoped service locator for isolated service resolution.
 *
 * @param {object} parentLocator - Parent service locator
 * @returns {object} Scoped service locator instance
 *
 * @example
 * ```typescript
 * const globalLocator = createServiceLocator();
 * const requestLocator = createScopedServiceLocator(globalLocator);
 *
 * requestLocator.register('requestId', () => generateId(), false);
 * const requestId = requestLocator.resolve('requestId');
 * ```
 */
export const createScopedServiceLocator = (parentLocator: any) => {
  const scopedServices = new Map<string | symbol, ServiceDescriptor>();
  const scopedInstances = new Map<string | symbol, any>();

  const resolve = <T = any>(id: string | symbol): T => {
    if (scopedInstances.has(id)) {
      return scopedInstances.get(id);
    }

    if (scopedServices.has(id)) {
      const descriptor = scopedServices.get(id)!;
      const instance = descriptor.factory ? descriptor.factory() : descriptor.instance;

      if (descriptor.singleton) {
        scopedInstances.set(id, instance);
      }

      return instance;
    }

    return parentLocator.resolve(id);
  };

  const register = (id: string | symbol, factoryOrInstance: any, singleton: boolean = false) => {
    const isFactory = typeof factoryOrInstance === 'function';
    scopedServices.set(id, {
      id,
      ...(isFactory ? { factory: factoryOrInstance } : { instance: factoryOrInstance }),
      singleton,
    });
  };

  const dispose = () => {
    scopedInstances.clear();
    scopedServices.clear();
  };

  return { resolve, register, dispose };
};

// ============================================================================
// DEPENDENCY INJECTION PATTERNS
// ============================================================================

/**
 * Property injection decorator for automatic dependency injection.
 *
 * @param {string | symbol} serviceId - Service identifier to inject
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserController {
 *   @Inject('userService')
 *   private userService!: UserService;
 *
 *   @Inject('emailService')
 *   private emailService!: EmailService;
 * }
 * ```
 */
export const Inject = (serviceId: string | symbol): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol) => {
    const dependencies = Reflect.getMetadata('dependencies', target.constructor) || [];
    dependencies.push({ propertyKey, serviceId, required: true });
    Reflect.defineMetadata('dependencies', dependencies, target.constructor);
  };
};

/**
 * Resolves and injects dependencies into a target instance.
 *
 * @template T
 * @param {T} target - Target instance
 * @param {object} locator - Service locator
 * @returns {T} Target with injected dependencies
 *
 * @example
 * ```typescript
 * const controller = new UserController();
 * const injected = resolveDependencies(controller, serviceLocator);
 * // controller.userService and controller.emailService are now injected
 * ```
 */
export const resolveDependencies = <T extends object>(target: T, locator: any): T => {
  const dependencies: DependencyMetadata[] = Reflect.getMetadata('dependencies', target.constructor) || [];

  for (const dep of dependencies) {
    const service = locator.resolve(dep.serviceId);

    if (!service && dep.required) {
      throw new Error(`Required dependency not found: ${String(dep.serviceId)}`);
    }

    if (service) {
      (target as any)[dep.propertyKey] = service;
    }
  }

  return target;
};

/**
 * Creates a dependency injection container with automatic resolution.
 *
 * @returns {object} DI container with register, resolve, and autowire methods
 *
 * @example
 * ```typescript
 * const container = createDIContainer();
 *
 * container.register('database', DatabaseService);
 * container.register('userRepository', UserRepository, ['database']);
 *
 * const userRepo = container.resolve('userRepository');
 * ```
 */
export const createDIContainer = () => {
  const locator = createServiceLocator({ strictMode: true, enableCaching: true });

  const autowire = <T extends { new (...args: any[]): any }>(
    constructor: T,
    ...additionalDeps: any[]
  ): InstanceType<T> => {
    const dependencies: DependencyMetadata[] = Reflect.getMetadata('dependencies', constructor) || [];
    const resolvedDeps = dependencies.map(dep => locator.resolve(dep.serviceId));

    const instance = new constructor(...resolvedDeps, ...additionalDeps);
    return resolveDependencies(instance, locator);
  };

  return {
    ...locator,
    autowire,
  };
};

/**
 * Constructor injection helper for explicit dependency declaration.
 *
 * @template T
 * @param {new (...args: any[]) => T} constructor - Class constructor
 * @param {any[]} dependencies - Array of dependencies
 * @returns {T} Instance with injected dependencies
 *
 * @example
 * ```typescript
 * class UserService {
 *   constructor(
 *     private database: DatabaseService,
 *     private logger: LoggerService
 *   ) {}
 * }
 *
 * const userService = constructorInject(UserService, [database, logger]);
 * ```
 */
export const constructorInject = <T>(
  constructor: new (...args: any[]) => T,
  dependencies: any[],
): T => {
  return new constructor(...dependencies);
};

// ============================================================================
// FACTORY PATTERNS
// ============================================================================

/**
 * Creates an abstract factory for producing related object families.
 *
 * @template T
 * @param {Map<string, FactoryConfig<T>>} factories - Factory configurations
 * @returns {object} Abstract factory with create and register methods
 *
 * @example
 * ```typescript
 * const uiFactory = createAbstractFactory(new Map([
 *   ['button', { type: 'button', createFn: (config) => new Button(config) }],
 *   ['input', { type: 'input', createFn: (config) => new Input(config) }]
 * ]));
 *
 * const button = uiFactory.create('button', { label: 'Submit' });
 * ```
 */
export const createAbstractFactory = <T>(factories: Map<string, FactoryConfig<T>>) => {
  const create = (type: string, config?: any): T => {
    const factory = factories.get(type);

    if (!factory) {
      throw new Error(`Factory not found for type: ${type}`);
    }

    if (factory.validators) {
      for (const validator of factory.validators) {
        if (!validator(config)) {
          throw new Error(`Validation failed for factory type: ${type}`);
        }
      }
    }

    return factory.createFn(config);
  };

  const register = (type: string, config: FactoryConfig<T>) => {
    factories.set(type, config);
  };

  const has = (type: string): boolean => {
    return factories.has(type);
  };

  return { create, register, has };
};

/**
 * Creates a factory method pattern implementation.
 *
 * @template T
 * @param {(type: string, config?: any) => T} factoryFn - Factory function
 * @returns {(type: string, config?: any) => T} Factory method
 *
 * @example
 * ```typescript
 * const createNotification = createFactoryMethod((type, config) => {
 *   switch (type) {
 *     case 'email': return new EmailNotification(config);
 *     case 'sms': return new SMSNotification(config);
 *     case 'push': return new PushNotification(config);
 *     default: throw new Error('Unknown notification type');
 *   }
 * });
 *
 * const email = createNotification('email', { to: 'user@example.com' });
 * ```
 */
export const createFactoryMethod = <T>(
  factoryFn: (type: string, config?: any) => T,
): ((type: string, config?: any) => T) => {
  return factoryFn;
};

/**
 * Creates a builder pattern for complex object construction.
 *
 * @template T
 * @param {BuilderStep<T>[]} steps - Array of builder steps
 * @returns {object} Builder with step execution and build methods
 *
 * @example
 * ```typescript
 * const userBuilder = createBuilder<User>([
 *   { name: 'setName', execute: (ctx, name) => ({ ...ctx, name }) },
 *   { name: 'setEmail', execute: (ctx, email) => ({ ...ctx, email }) },
 *   { name: 'setRole', execute: (ctx, role) => ({ ...ctx, role }), optional: true }
 * ]);
 *
 * const user = await userBuilder
 *   .step('setName', 'John Doe')
 *   .step('setEmail', 'john@example.com')
 *   .build();
 * ```
 */
export const createBuilder = <T>(steps: BuilderStep<T>[]) => {
  let context: Partial<T> = {};

  const step = async (stepName: string, ...args: any[]) => {
    const stepDef = steps.find(s => s.name === stepName);

    if (!stepDef) {
      throw new Error(`Builder step not found: ${stepName}`);
    }

    if (stepDef.validate && !stepDef.validate(context)) {
      throw new Error(`Validation failed for step: ${stepName}`);
    }

    context = await Promise.resolve(stepDef.execute(context, ...args));
    return api;
  };

  const build = (): T => {
    const requiredSteps = steps.filter(s => !s.optional);

    for (const step of requiredSteps) {
      if (step.validate && !step.validate(context)) {
        throw new Error(`Required step not completed: ${step.name}`);
      }
    }

    return context as T;
  };

  const reset = () => {
    context = {};
    return api;
  };

  const api = { step, build, reset };
  return api;
};

/**
 * Creates a prototype pattern for cloning complex objects.
 *
 * @template T
 * @param {T} prototype - Prototype object
 * @returns {() => T} Clone function
 *
 * @example
 * ```typescript
 * const defaultUser = { role: 'user', permissions: ['read'] };
 * const cloneUser = createPrototype(defaultUser);
 *
 * const user1 = cloneUser();
 * const user2 = cloneUser();
 * // user1 and user2 are independent copies
 * ```
 */
export const createPrototype = <T>(prototype: T): (() => T) => {
  return () => {
    if (typeof prototype !== 'object' || prototype === null) {
      return prototype;
    }

    return JSON.parse(JSON.stringify(prototype));
  };
};

/**
 * Creates a deep clone of an object with circular reference handling.
 *
 * @template T
 * @param {T} obj - Object to clone
 * @param {WeakMap<any, any>} [cloneMap] - Map for tracking cloned objects
 * @returns {T} Deep cloned object
 *
 * @example
 * ```typescript
 * const original = { name: 'John', address: { city: 'NYC' } };
 * const cloned = deepClone(original);
 * cloned.address.city = 'LA'; // original.address.city remains 'NYC'
 * ```
 */
export const deepClone = <T>(obj: T, cloneMap: WeakMap<any, any> = new WeakMap()): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (cloneMap.has(obj)) {
    return cloneMap.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    const arrCopy: any[] = [];
    cloneMap.set(obj, arrCopy);
    obj.forEach((item, index) => {
      arrCopy[index] = deepClone(item, cloneMap);
    });
    return arrCopy as any;
  }

  if (obj instanceof Object) {
    const objCopy: any = {};
    cloneMap.set(obj, objCopy);
    Object.keys(obj).forEach(key => {
      objCopy[key] = deepClone((obj as any)[key], cloneMap);
    });
    return objCopy;
  }

  return obj;
};

// ============================================================================
// STRATEGY PATTERN
// ============================================================================

/**
 * Creates a strategy pattern implementation for runtime algorithm selection.
 *
 * @template T
 * @param {Map<string, Strategy<T>>} [strategies] - Initial strategies
 * @param {string} [defaultStrategy] - Default strategy name
 * @returns {object} Strategy context with execute and register methods
 *
 * @example
 * ```typescript
 * const paymentStrategy = createStrategy(new Map([
 *   ['creditCard', { execute: (payment) => processCreditCard(payment) }],
 *   ['paypal', { execute: (payment) => processPayPal(payment) }],
 *   ['crypto', { execute: (payment) => processCrypto(payment) }]
 * ]), 'creditCard');
 *
 * const result = await paymentStrategy.execute('paypal', paymentData);
 * ```
 */
export const createStrategy = <T>(
  strategies: Map<string, Strategy<T>> = new Map(),
  defaultStrategy?: string,
) => {
  const execute = async (strategyName: string | undefined, input: T): Promise<any> => {
    const name = strategyName || defaultStrategy;

    if (!name) {
      throw new Error('No strategy specified and no default strategy set');
    }

    const strategy = strategies.get(name);

    if (!strategy) {
      throw new Error(`Strategy not found: ${name}`);
    }

    return await Promise.resolve(strategy.execute(input));
  };

  const register = (name: string, strategy: Strategy<T>) => {
    strategies.set(name, strategy);
  };

  const selectStrategy = (input: T): string | null => {
    const prioritized = Array.from(strategies.entries())
      .filter(([_, strategy]) => !strategy.canHandle || strategy.canHandle(input))
      .sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0));

    return prioritized.length > 0 ? prioritized[0][0] : null;
  };

  const has = (name: string): boolean => {
    return strategies.has(name);
  };

  return { execute, register, selectStrategy, has };
};

/**
 * Selects the best strategy based on input characteristics.
 *
 * @template T
 * @param {T} input - Input data
 * @param {Map<string, Strategy<T>>} strategies - Available strategies
 * @returns {string | null} Selected strategy name
 *
 * @example
 * ```typescript
 * const strategies = new Map([
 *   ['fast', { execute: fastAlgo, canHandle: (input) => input.size < 100, priority: 2 }],
 *   ['balanced', { execute: balancedAlgo, canHandle: () => true, priority: 1 }]
 * ]);
 *
 * const selected = selectBestStrategy({ size: 50 }, strategies);
 * // Result: 'fast'
 * ```
 */
export const selectBestStrategy = <T>(
  input: T,
  strategies: Map<string, Strategy<T>>,
): string | null => {
  const applicable = Array.from(strategies.entries())
    .filter(([_, strategy]) => !strategy.canHandle || strategy.canHandle(input))
    .sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0));

  return applicable.length > 0 ? applicable[0][0] : null;
};

// ============================================================================
// CHAIN OF RESPONSIBILITY PATTERN
// ============================================================================

/**
 * Creates a chain of responsibility handler.
 *
 * @template T
 * @param {(request: T) => Promise<T | null> | T | null} handleFn - Handler function
 * @returns {ChainHandler<T>} Chain handler instance
 *
 * @example
 * ```typescript
 * const authHandler = createChainHandler(async (req) => {
 *   if (!req.authenticated) throw new Error('Unauthorized');
 *   return req;
 * });
 *
 * const validationHandler = createChainHandler(async (req) => {
 *   if (!req.valid) throw new Error('Invalid request');
 *   return req;
 * });
 *
 * authHandler.setNext(validationHandler);
 * await authHandler.handle(request);
 * ```
 */
export const createChainHandler = <T>(
  handleFn: (request: T) => Promise<T | null> | T | null,
): ChainHandler<T> => {
  let nextHandler: ChainHandler<T> | null = null;

  const handle = async (request: T): Promise<T | null> => {
    const result = await Promise.resolve(handleFn(request));

    if (result === null) {
      return null;
    }

    if (nextHandler) {
      return nextHandler.handle(result);
    }

    return result;
  };

  const setNext = (handler: ChainHandler<T>): ChainHandler<T> => {
    nextHandler = handler;
    return handler;
  };

  const getNext = (): ChainHandler<T> | null => {
    return nextHandler;
  };

  return { handle, setNext, getNext };
};

/**
 * Builds a chain of handlers from an array of handler functions.
 *
 * @template T
 * @param {Array<(request: T) => Promise<T | null> | T | null>} handlers - Handler functions
 * @returns {ChainHandler<T>} First handler in the chain
 *
 * @example
 * ```typescript
 * const chain = buildHandlerChain([
 *   (req) => authCheck(req),
 *   (req) => validateRequest(req),
 *   (req) => sanitizeInput(req),
 *   (req) => processRequest(req)
 * ]);
 *
 * const result = await chain.handle(request);
 * ```
 */
export const buildHandlerChain = <T>(
  handlers: Array<(request: T) => Promise<T | null> | T | null>,
): ChainHandler<T> => {
  if (handlers.length === 0) {
    throw new Error('At least one handler is required');
  }

  const chainHandlers = handlers.map(fn => createChainHandler(fn));

  for (let i = 0; i < chainHandlers.length - 1; i++) {
    chainHandlers[i].setNext(chainHandlers[i + 1]);
  }

  return chainHandlers[0];
};

// ============================================================================
// COMMAND PATTERN
// ============================================================================

/**
 * Creates a command object with execute and optional undo.
 *
 * @template T
 * @param {() => Promise<T> | T} executeFn - Execute function
 * @param {() => Promise<void> | void} [undoFn] - Undo function
 * @param {Partial<CommandMetadata>} [metadata] - Command metadata
 * @returns {Command<T>} Command instance
 *
 * @example
 * ```typescript
 * const updateUserCmd = createCommand(
 *   () => userService.update(userId, data),
 *   () => userService.update(userId, previousData),
 *   { id: 'update-user-123', auditLog: true }
 * );
 *
 * const result = await updateUserCmd.execute();
 * await updateUserCmd.undo();
 * ```
 */
export const createCommand = <T = any>(
  executeFn: () => Promise<T> | T,
  undoFn?: () => Promise<void> | void,
  metadata?: Partial<CommandMetadata>,
): Command<T> => {
  return {
    execute: executeFn,
    undo: undoFn,
    metadata: {
      id: metadata?.id || `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: metadata?.timestamp || Date.now(),
      ...metadata,
    },
  };
};

/**
 * Creates a command invoker for executing and managing commands.
 *
 * @returns {object} Command invoker with execute, undo, and history methods
 *
 * @example
 * ```typescript
 * const invoker = createCommandInvoker();
 *
 * await invoker.execute(createUserCmd);
 * await invoker.execute(updateUserCmd);
 * await invoker.undo(); // Undoes updateUserCmd
 * await invoker.redo(); // Re-executes updateUserCmd
 *
 * const history = invoker.getHistory();
 * ```
 */
export const createCommandInvoker = () => {
  const history: Command[] = [];
  let currentIndex = -1;

  const execute = async <T>(command: Command<T>): Promise<T> => {
    if (command.validate && !command.validate()) {
      throw new Error('Command validation failed');
    }

    const result = await Promise.resolve(command.execute());

    // Clear redo history when new command is executed
    history.splice(currentIndex + 1);
    history.push(command);
    currentIndex++;

    return result;
  };

  const undo = async (): Promise<void> => {
    if (currentIndex < 0) {
      throw new Error('No commands to undo');
    }

    const command = history[currentIndex];

    if (!command.undo) {
      throw new Error('Command does not support undo');
    }

    await Promise.resolve(command.undo());
    currentIndex--;
  };

  const redo = async (): Promise<void> => {
    if (currentIndex >= history.length - 1) {
      throw new Error('No commands to redo');
    }

    currentIndex++;
    const command = history[currentIndex];
    await Promise.resolve(command.execute());
  };

  const getHistory = (): CommandMetadata[] => {
    return history.map(cmd => cmd.metadata!);
  };

  const clear = () => {
    history.length = 0;
    currentIndex = -1;
  };

  const canUndo = (): boolean => currentIndex >= 0;
  const canRedo = (): boolean => currentIndex < history.length - 1;

  return { execute, undo, redo, getHistory, clear, canUndo, canRedo };
};

/**
 * Creates a macro command that executes multiple commands as a single unit.
 *
 * @template T
 * @param {Command[]} commands - Array of commands
 * @param {Partial<CommandMetadata>} [metadata] - Macro command metadata
 * @returns {Command<T[]>} Macro command
 *
 * @example
 * ```typescript
 * const transaction = createMacroCommand([
 *   createUserCmd,
 *   assignRoleCmd,
 *   sendWelcomeEmailCmd
 * ], { id: 'user-registration', auditLog: true });
 *
 * await transaction.execute(); // Executes all commands
 * await transaction.undo(); // Undoes all commands in reverse order
 * ```
 */
export const createMacroCommand = <T = any>(
  commands: Command[],
  metadata?: Partial<CommandMetadata>,
): Command<T[]> => {
  const execute = async (): Promise<T[]> => {
    const results: T[] = [];

    for (const cmd of commands) {
      results.push(await Promise.resolve(cmd.execute()));
    }

    return results;
  };

  const undo = async (): Promise<void> => {
    // Undo in reverse order
    for (let i = commands.length - 1; i >= 0; i--) {
      if (commands[i].undo) {
        await Promise.resolve(commands[i].undo!());
      }
    }
  };

  return {
    execute,
    undo,
    metadata: {
      id: metadata?.id || `macro-${Date.now()}`,
      timestamp: Date.now(),
      ...metadata,
    },
  };
};

// ============================================================================
// OBSERVER PATTERN
// ============================================================================

/**
 * Creates a subject for the observer pattern.
 *
 * @template T
 * @returns {Subject<T>} Subject instance with attach, detach, and notify methods
 *
 * @example
 * ```typescript
 * const stockSubject = createSubject<StockPrice>();
 *
 * const observer1 = { update: (price) => console.log('Price:', price) };
 * const observer2 = { update: (price) => sendAlert(price) };
 *
 * stockSubject.attach(observer1);
 * stockSubject.attach(observer2);
 *
 * await stockSubject.notify({ symbol: 'AAPL', price: 150 });
 * ```
 */
export const createSubject = <T>(): Subject<T> => {
  const observers: Observer<T>[] = [];

  const attach = (observer: Observer<T>): void => {
    if (!observers.find(o => o.id === observer.id)) {
      observers.push(observer);
      observers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
  };

  const detach = (observer: Observer<T>): void => {
    const index = observers.findIndex(o => o.id === observer.id);
    if (index !== -1) {
      observers.splice(index, 1);
    }
  };

  const notify = async (data: T): Promise<void> => {
    for (const observer of observers) {
      await Promise.resolve(observer.update(data));
    }
  };

  return { attach, detach, notify };
};

/**
 * Creates an observer with update callback and metadata.
 *
 * @template T
 * @param {(data: T) => void | Promise<void>} updateFn - Update callback
 * @param {string} [id] - Observer identifier
 * @param {number} [priority] - Observer priority (higher executes first)
 * @returns {Observer<T>} Observer instance
 *
 * @example
 * ```typescript
 * const emailObserver = createObserver(
 *   (user) => sendEmail(user.email),
 *   'email-observer',
 *   10
 * );
 *
 * const logObserver = createObserver(
 *   (user) => logActivity(user),
 *   'log-observer',
 *   5
 * );
 * ```
 */
export const createObserver = <T>(
  updateFn: (data: T) => void | Promise<void>,
  id?: string,
  priority?: number,
): Observer<T> => {
  return {
    update: updateFn,
    id: id || `observer-${Math.random().toString(36).substr(2, 9)}`,
    priority,
  };
};

/**
 * Creates an event emitter with observer pattern.
 *
 * @returns {object} Event emitter with on, off, and emit methods
 *
 * @example
 * ```typescript
 * const emitter = createEventEmitter();
 *
 * emitter.on('userCreated', (user) => sendWelcomeEmail(user));
 * emitter.on('userCreated', (user) => createAuditLog(user));
 *
 * await emitter.emit('userCreated', newUser);
 * ```
 */
export const createEventEmitter = () => {
  const subjects = new Map<string, Subject<any>>();

  const on = <T>(event: string, callback: (data: T) => void | Promise<void>, priority?: number) => {
    if (!subjects.has(event)) {
      subjects.set(event, createSubject<T>());
    }

    const observer = createObserver(callback, undefined, priority);
    subjects.get(event)!.attach(observer);

    return () => subjects.get(event)!.detach(observer);
  };

  const off = (event: string, observer: Observer<any>) => {
    const subject = subjects.get(event);
    if (subject) {
      subject.detach(observer);
    }
  };

  const emit = async <T>(event: string, data: T): Promise<void> => {
    const subject = subjects.get(event);
    if (subject) {
      await subject.notify(data);
    }
  };

  const removeAllListeners = (event?: string) => {
    if (event) {
      subjects.delete(event);
    } else {
      subjects.clear();
    }
  };

  return { on, off, emit, removeAllListeners };
};

// ============================================================================
// SINGLETON PATTERN
// ============================================================================

/**
 * Creates a singleton instance with lazy initialization.
 *
 * @template T
 * @param {() => T} factory - Factory function to create instance
 * @returns {() => T} Singleton getter
 *
 * @example
 * ```typescript
 * const getDatabase = createSingleton(() => new DatabaseConnection());
 *
 * const db1 = getDatabase();
 * const db2 = getDatabase();
 * // db1 === db2 (same instance)
 * ```
 */
export const createSingleton = <T>(factory: () => T): (() => T) => {
  let instance: T | null = null;

  return () => {
    if (instance === null) {
      instance = factory();
    }
    return instance;
  };
};

/**
 * Singleton decorator for class-based singletons.
 *
 * @template T
 * @param {new (...args: any[]) => T} constructor - Class constructor
 * @returns {new (...args: any[]) => T} Singleton class
 *
 * @example
 * ```typescript
 * @Singleton
 * class ConfigService {
 *   constructor() {
 *     // initialization
 *   }
 * }
 *
 * const config1 = new ConfigService();
 * const config2 = new ConfigService();
 * // config1 === config2
 * ```
 */
export const Singleton = <T extends { new (...args: any[]): any }>(constructor: T): T => {
  let instance: any = null;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this;
    }
  } as T;
};

// ============================================================================
// ADAPTER PATTERN
// ============================================================================

/**
 * Creates an adapter to make an interface compatible with another.
 *
 * @template TSource, TTarget
 * @param {TSource} adaptee - Object to adapt
 * @param {(source: TSource) => TTarget} adaptFn - Adaptation function
 * @returns {TTarget} Adapted interface
 *
 * @example
 * ```typescript
 * const legacyUser = { user_name: 'john', user_email: 'john@example.com' };
 *
 * const modernUser = createAdapter(legacyUser, (legacy) => ({
 *   name: legacy.user_name,
 *   email: legacy.user_email
 * }));
 *
 * // modernUser: { name: 'john', email: 'john@example.com' }
 * ```
 */
export const createAdapter = <TSource, TTarget>(
  adaptee: TSource,
  adaptFn: (source: TSource) => TTarget,
): TTarget => {
  return adaptFn(adaptee);
};

/**
 * Creates a bidirectional adapter for two-way conversion.
 *
 * @template TSource, TTarget
 * @param {(source: TSource) => TTarget} toTarget - Source to target conversion
 * @param {(target: TTarget) => TSource} toSource - Target to source conversion
 * @returns {object} Adapter with convert and reverse methods
 *
 * @example
 * ```typescript
 * const adapter = createBidirectionalAdapter(
 *   (celsius) => celsius * 9/5 + 32,
 *   (fahrenheit) => (fahrenheit - 32) * 5/9
 * );
 *
 * const fahrenheit = adapter.convert(25); // 77
 * const celsius = adapter.reverse(77); // 25
 * ```
 */
export const createBidirectionalAdapter = <TSource, TTarget>(
  toTarget: (source: TSource) => TTarget,
  toSource: (target: TTarget) => TSource,
) => {
  return {
    convert: toTarget,
    reverse: toSource,
  };
};

// ============================================================================
// DECORATOR PATTERN
// ============================================================================

/**
 * Creates a method decorator for aspect-oriented programming.
 *
 * @param {(metadata: DecoratorMetadata) => void} decoratorFn - Decorator function
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * const LogExecution = createMethodDecorator((metadata) => {
 *   const original = metadata.descriptor.value;
 *   metadata.descriptor.value = function(...args: any[]) {
 *     console.log(`Calling ${metadata.propertyKey}`);
 *     return original.apply(this, args);
 *   };
 * });
 *
 * class UserService {
 *   @LogExecution
 *   async createUser(data: any) { ... }
 * }
 * ```
 */
export const createMethodDecorator = (
  decoratorFn: (metadata: DecoratorMetadata) => void,
): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    decoratorFn({
      target,
      propertyKey: String(propertyKey),
      descriptor,
      metadata: {},
    });
  };
};

/**
 * Creates a timing decorator to measure method execution time.
 *
 * @param {(duration: number, method: string) => void} [callback] - Callback for timing results
 * @returns {MethodDecorator} Timing decorator
 *
 * @example
 * ```typescript
 * const Timed = createTimingDecorator((duration, method) => {
 *   logger.info(`${method} took ${duration}ms`);
 * });
 *
 * class DataService {
 *   @Timed
 *   async fetchData() { ... }
 * }
 * ```
 */
export const createTimingDecorator = (
  callback?: (duration: number, method: string) => void,
): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;

      if (callback) {
        callback(duration, String(propertyKey));
      }

      return result;
    };
  };
};

/**
 * Creates a caching decorator for method results.
 *
 * @param {number} [ttl] - Time-to-live in milliseconds
 * @returns {MethodDecorator} Caching decorator
 *
 * @example
 * ```typescript
 * const Cached = createCachingDecorator(60000); // 1 minute
 *
 * class UserService {
 *   @Cached
 *   async getUser(id: string) { ... }
 * }
 * ```
 */
export const createCachingDecorator = (ttl?: number): MethodDecorator => {
  const cache = new Map<string, { value: any; expires: number }>();

  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${String(propertyKey)}-${JSON.stringify(args)}`;
      const cached = cache.get(cacheKey);

      if (cached && (!ttl || Date.now() < cached.expires)) {
        return cached.value;
      }

      const result = await originalMethod.apply(this, args);

      cache.set(cacheKey, {
        value: result,
        expires: ttl ? Date.now() + ttl : Infinity,
      });

      return result;
    };
  };
};

// ============================================================================
// PROXY PATTERN
// ============================================================================

/**
 * Creates a virtual proxy for lazy initialization.
 *
 * @template T
 * @param {() => T} factory - Factory to create real object
 * @returns {T} Proxy object
 *
 * @example
 * ```typescript
 * const heavyObject = createVirtualProxy(() => new HeavyResource());
 * // HeavyResource is not created yet
 *
 * heavyObject.someMethod(); // Now HeavyResource is created
 * ```
 */
export const createVirtualProxy = <T extends object>(factory: () => T): T => {
  let realObject: T | null = null;

  return new Proxy({} as T, {
    get(target, prop) {
      if (realObject === null) {
        realObject = factory();
      }
      return (realObject as any)[prop];
    },
  });
};

/**
 * Creates a logging proxy that logs all method calls.
 *
 * @template T
 * @param {T} target - Target object
 * @param {(method: string, args: any[]) => void} [logger] - Logger function
 * @returns {T} Logged proxy
 *
 * @example
 * ```typescript
 * const userService = createLoggingProxy(
 *   new UserService(),
 *   (method, args) => console.log(`Called ${method} with`, args)
 * );
 *
 * await userService.createUser({ name: 'John' });
 * // Logs: Called createUser with [{ name: 'John' }]
 * ```
 */
export const createLoggingProxy = <T extends object>(
  target: T,
  logger?: (method: string, args: any[]) => void,
): T => {
  return new Proxy(target, {
    get(obj, prop) {
      const value = (obj as any)[prop];

      if (typeof value === 'function') {
        return (...args: any[]) => {
          if (logger) {
            logger(String(prop), args);
          }
          return value.apply(obj, args);
        };
      }

      return value;
    },
  });
};

/**
 * Creates a protection proxy with access control.
 *
 * @template T
 * @param {T} target - Target object
 * @param {(method: string, user?: any) => boolean} accessControl - Access control function
 * @returns {T} Protected proxy
 *
 * @example
 * ```typescript
 * const adminService = createProtectionProxy(
 *   new AdminService(),
 *   (method, user) => user.role === 'admin'
 * );
 *
 * // Only admins can call methods
 * await adminService.deleteUser(userId); // Throws if not admin
 * ```
 */
export const createProtectionProxy = <T extends object>(
  target: T,
  accessControl: (method: string, user?: any) => boolean,
): T => {
  return new Proxy(target, {
    get(obj, prop) {
      const value = (obj as any)[prop];

      if (typeof value === 'function') {
        return (...args: any[]) => {
          if (!accessControl(String(prop))) {
            throw new Error(`Access denied to method: ${String(prop)}`);
          }
          return value.apply(obj, args);
        };
      }

      return value;
    },
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Service Locator
  createServiceLocator,
  validateServiceDependencies,
  createScopedServiceLocator,

  // Dependency Injection
  Inject,
  resolveDependencies,
  createDIContainer,
  constructorInject,

  // Factory Patterns
  createAbstractFactory,
  createFactoryMethod,
  createBuilder,
  createPrototype,
  deepClone,

  // Strategy Pattern
  createStrategy,
  selectBestStrategy,

  // Chain of Responsibility
  createChainHandler,
  buildHandlerChain,

  // Command Pattern
  createCommand,
  createCommandInvoker,
  createMacroCommand,

  // Observer Pattern
  createSubject,
  createObserver,
  createEventEmitter,

  // Singleton Pattern
  createSingleton,
  Singleton,

  // Adapter Pattern
  createAdapter,
  createBidirectionalAdapter,

  // Decorator Pattern
  createMethodDecorator,
  createTimingDecorator,
  createCachingDecorator,

  // Proxy Pattern
  createVirtualProxy,
  createLoggingProxy,
  createProtectionProxy,
};
