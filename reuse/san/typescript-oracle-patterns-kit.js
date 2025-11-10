"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProtectionProxy = exports.createLoggingProxy = exports.createVirtualProxy = exports.createCachingDecorator = exports.createTimingDecorator = exports.createMethodDecorator = exports.createBidirectionalAdapter = exports.createAdapter = exports.Singleton = exports.createSingleton = exports.createEventEmitter = exports.createObserver = exports.createSubject = exports.createMacroCommand = exports.createCommandInvoker = exports.createCommand = exports.buildHandlerChain = exports.createChainHandler = exports.selectBestStrategy = exports.createStrategy = exports.deepClone = exports.createPrototype = exports.createBuilder = exports.createFactoryMethod = exports.createAbstractFactory = exports.constructorInject = exports.createDIContainer = exports.resolveDependencies = exports.Inject = exports.createScopedServiceLocator = exports.validateServiceDependencies = exports.createServiceLocator = void 0;
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
const createServiceLocator = (config) => {
    const cfg = {
        enableCaching: true,
        enableLazyInit: true,
        strictMode: false,
        ...config,
    };
    const services = new Map();
    const instances = new Map();
    const register = (id, factoryOrInstance, singleton = true, dependencies = []) => {
        const isFactory = typeof factoryOrInstance === 'function';
        services.set(id, {
            id,
            ...(isFactory ? { factory: factoryOrInstance } : { instance: factoryOrInstance }),
            singleton,
            dependencies,
        });
    };
    const resolve = (id) => {
        if (cfg.enableCaching && instances.has(id)) {
            return instances.get(id);
        }
        const descriptor = services.get(id);
        if (!descriptor) {
            if (cfg.strictMode) {
                throw new Error(`Service not found: ${String(id)}`);
            }
            return null;
        }
        let instance;
        if (descriptor.instance !== undefined) {
            instance = descriptor.instance;
        }
        else if (descriptor.factory) {
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
    const has = (id) => {
        return services.has(id);
    };
    const unregister = (id) => {
        instances.delete(id);
        return services.delete(id);
    };
    return { register, resolve, clear, has, unregister };
};
exports.createServiceLocator = createServiceLocator;
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
const validateServiceDependencies = (services, serviceId, visited = new Set()) => {
    if (visited.has(serviceId)) {
        return false; // Circular dependency detected
    }
    const descriptor = services.get(serviceId);
    if (!descriptor || !descriptor.dependencies) {
        return true;
    }
    visited.add(serviceId);
    for (const depId of descriptor.dependencies) {
        if (!(0, exports.validateServiceDependencies)(services, depId, new Set(visited))) {
            return false;
        }
    }
    return true;
};
exports.validateServiceDependencies = validateServiceDependencies;
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
const createScopedServiceLocator = (parentLocator) => {
    const scopedServices = new Map();
    const scopedInstances = new Map();
    const resolve = (id) => {
        if (scopedInstances.has(id)) {
            return scopedInstances.get(id);
        }
        if (scopedServices.has(id)) {
            const descriptor = scopedServices.get(id);
            const instance = descriptor.factory ? descriptor.factory() : descriptor.instance;
            if (descriptor.singleton) {
                scopedInstances.set(id, instance);
            }
            return instance;
        }
        return parentLocator.resolve(id);
    };
    const register = (id, factoryOrInstance, singleton = false) => {
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
exports.createScopedServiceLocator = createScopedServiceLocator;
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
const Inject = (serviceId) => {
    return (target, propertyKey) => {
        const dependencies = Reflect.getMetadata('dependencies', target.constructor) || [];
        dependencies.push({ propertyKey, serviceId, required: true });
        Reflect.defineMetadata('dependencies', dependencies, target.constructor);
    };
};
exports.Inject = Inject;
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
const resolveDependencies = (target, locator) => {
    const dependencies = Reflect.getMetadata('dependencies', target.constructor) || [];
    for (const dep of dependencies) {
        const service = locator.resolve(dep.serviceId);
        if (!service && dep.required) {
            throw new Error(`Required dependency not found: ${String(dep.serviceId)}`);
        }
        if (service) {
            target[dep.propertyKey] = service;
        }
    }
    return target;
};
exports.resolveDependencies = resolveDependencies;
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
const createDIContainer = () => {
    const locator = (0, exports.createServiceLocator)({ strictMode: true, enableCaching: true });
    const autowire = (constructor, ...additionalDeps) => {
        const dependencies = Reflect.getMetadata('dependencies', constructor) || [];
        const resolvedDeps = dependencies.map(dep => locator.resolve(dep.serviceId));
        const instance = new constructor(...resolvedDeps, ...additionalDeps);
        return (0, exports.resolveDependencies)(instance, locator);
    };
    return {
        ...locator,
        autowire,
    };
};
exports.createDIContainer = createDIContainer;
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
const constructorInject = (constructor, dependencies) => {
    return new constructor(...dependencies);
};
exports.constructorInject = constructorInject;
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
const createAbstractFactory = (factories) => {
    const create = (type, config) => {
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
    const register = (type, config) => {
        factories.set(type, config);
    };
    const has = (type) => {
        return factories.has(type);
    };
    return { create, register, has };
};
exports.createAbstractFactory = createAbstractFactory;
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
const createFactoryMethod = (factoryFn) => {
    return factoryFn;
};
exports.createFactoryMethod = createFactoryMethod;
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
const createBuilder = (steps) => {
    let context = {};
    const step = async (stepName, ...args) => {
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
    const build = () => {
        const requiredSteps = steps.filter(s => !s.optional);
        for (const step of requiredSteps) {
            if (step.validate && !step.validate(context)) {
                throw new Error(`Required step not completed: ${step.name}`);
            }
        }
        return context;
    };
    const reset = () => {
        context = {};
        return api;
    };
    const api = { step, build, reset };
    return api;
};
exports.createBuilder = createBuilder;
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
const createPrototype = (prototype) => {
    return () => {
        if (typeof prototype !== 'object' || prototype === null) {
            return prototype;
        }
        return JSON.parse(JSON.stringify(prototype));
    };
};
exports.createPrototype = createPrototype;
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
const deepClone = (obj, cloneMap = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (cloneMap.has(obj)) {
        return cloneMap.get(obj);
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        const arrCopy = [];
        cloneMap.set(obj, arrCopy);
        obj.forEach((item, index) => {
            arrCopy[index] = (0, exports.deepClone)(item, cloneMap);
        });
        return arrCopy;
    }
    if (obj instanceof Object) {
        const objCopy = {};
        cloneMap.set(obj, objCopy);
        Object.keys(obj).forEach(key => {
            objCopy[key] = (0, exports.deepClone)(obj[key], cloneMap);
        });
        return objCopy;
    }
    return obj;
};
exports.deepClone = deepClone;
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
const createStrategy = (strategies = new Map(), defaultStrategy) => {
    const execute = async (strategyName, input) => {
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
    const register = (name, strategy) => {
        strategies.set(name, strategy);
    };
    const selectStrategy = (input) => {
        const prioritized = Array.from(strategies.entries())
            .filter(([_, strategy]) => !strategy.canHandle || strategy.canHandle(input))
            .sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0));
        return prioritized.length > 0 ? prioritized[0][0] : null;
    };
    const has = (name) => {
        return strategies.has(name);
    };
    return { execute, register, selectStrategy, has };
};
exports.createStrategy = createStrategy;
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
const selectBestStrategy = (input, strategies) => {
    const applicable = Array.from(strategies.entries())
        .filter(([_, strategy]) => !strategy.canHandle || strategy.canHandle(input))
        .sort((a, b) => (b[1].priority || 0) - (a[1].priority || 0));
    return applicable.length > 0 ? applicable[0][0] : null;
};
exports.selectBestStrategy = selectBestStrategy;
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
const createChainHandler = (handleFn) => {
    let nextHandler = null;
    const handle = async (request) => {
        const result = await Promise.resolve(handleFn(request));
        if (result === null) {
            return null;
        }
        if (nextHandler) {
            return nextHandler.handle(result);
        }
        return result;
    };
    const setNext = (handler) => {
        nextHandler = handler;
        return handler;
    };
    const getNext = () => {
        return nextHandler;
    };
    return { handle, setNext, getNext };
};
exports.createChainHandler = createChainHandler;
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
const buildHandlerChain = (handlers) => {
    if (handlers.length === 0) {
        throw new Error('At least one handler is required');
    }
    const chainHandlers = handlers.map(fn => (0, exports.createChainHandler)(fn));
    for (let i = 0; i < chainHandlers.length - 1; i++) {
        chainHandlers[i].setNext(chainHandlers[i + 1]);
    }
    return chainHandlers[0];
};
exports.buildHandlerChain = buildHandlerChain;
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
const createCommand = (executeFn, undoFn, metadata) => {
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
exports.createCommand = createCommand;
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
const createCommandInvoker = () => {
    const history = [];
    let currentIndex = -1;
    const execute = async (command) => {
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
    const undo = async () => {
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
    const redo = async () => {
        if (currentIndex >= history.length - 1) {
            throw new Error('No commands to redo');
        }
        currentIndex++;
        const command = history[currentIndex];
        await Promise.resolve(command.execute());
    };
    const getHistory = () => {
        return history.map(cmd => cmd.metadata);
    };
    const clear = () => {
        history.length = 0;
        currentIndex = -1;
    };
    const canUndo = () => currentIndex >= 0;
    const canRedo = () => currentIndex < history.length - 1;
    return { execute, undo, redo, getHistory, clear, canUndo, canRedo };
};
exports.createCommandInvoker = createCommandInvoker;
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
const createMacroCommand = (commands, metadata) => {
    const execute = async () => {
        const results = [];
        for (const cmd of commands) {
            results.push(await Promise.resolve(cmd.execute()));
        }
        return results;
    };
    const undo = async () => {
        // Undo in reverse order
        for (let i = commands.length - 1; i >= 0; i--) {
            if (commands[i].undo) {
                await Promise.resolve(commands[i].undo());
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
exports.createMacroCommand = createMacroCommand;
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
const createSubject = () => {
    const observers = [];
    const attach = (observer) => {
        if (!observers.find(o => o.id === observer.id)) {
            observers.push(observer);
            observers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        }
    };
    const detach = (observer) => {
        const index = observers.findIndex(o => o.id === observer.id);
        if (index !== -1) {
            observers.splice(index, 1);
        }
    };
    const notify = async (data) => {
        for (const observer of observers) {
            await Promise.resolve(observer.update(data));
        }
    };
    return { attach, detach, notify };
};
exports.createSubject = createSubject;
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
const createObserver = (updateFn, id, priority) => {
    return {
        update: updateFn,
        id: id || `observer-${Math.random().toString(36).substr(2, 9)}`,
        priority,
    };
};
exports.createObserver = createObserver;
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
const createEventEmitter = () => {
    const subjects = new Map();
    const on = (event, callback, priority) => {
        if (!subjects.has(event)) {
            subjects.set(event, (0, exports.createSubject)());
        }
        const observer = (0, exports.createObserver)(callback, undefined, priority);
        subjects.get(event).attach(observer);
        return () => subjects.get(event).detach(observer);
    };
    const off = (event, observer) => {
        const subject = subjects.get(event);
        if (subject) {
            subject.detach(observer);
        }
    };
    const emit = async (event, data) => {
        const subject = subjects.get(event);
        if (subject) {
            await subject.notify(data);
        }
    };
    const removeAllListeners = (event) => {
        if (event) {
            subjects.delete(event);
        }
        else {
            subjects.clear();
        }
    };
    return { on, off, emit, removeAllListeners };
};
exports.createEventEmitter = createEventEmitter;
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
const createSingleton = (factory) => {
    let instance = null;
    return () => {
        if (instance === null) {
            instance = factory();
        }
        return instance;
    };
};
exports.createSingleton = createSingleton;
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
const Singleton = (constructor) => {
    let instance = null;
    return class extends constructor {
        constructor(...args) {
            if (instance) {
                return instance;
            }
            super(...args);
            instance = this;
        }
    };
};
exports.Singleton = Singleton;
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
const createAdapter = (adaptee, adaptFn) => {
    return adaptFn(adaptee);
};
exports.createAdapter = createAdapter;
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
const createBidirectionalAdapter = (toTarget, toSource) => {
    return {
        convert: toTarget,
        reverse: toSource,
    };
};
exports.createBidirectionalAdapter = createBidirectionalAdapter;
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
const createMethodDecorator = (decoratorFn) => {
    return (target, propertyKey, descriptor) => {
        decoratorFn({
            target,
            propertyKey: String(propertyKey),
            descriptor,
            metadata: {},
        });
    };
};
exports.createMethodDecorator = createMethodDecorator;
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
const createTimingDecorator = (callback) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
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
exports.createTimingDecorator = createTimingDecorator;
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
const createCachingDecorator = (ttl) => {
    const cache = new Map();
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
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
exports.createCachingDecorator = createCachingDecorator;
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
const createVirtualProxy = (factory) => {
    let realObject = null;
    return new Proxy({}, {
        get(target, prop) {
            if (realObject === null) {
                realObject = factory();
            }
            return realObject[prop];
        },
    });
};
exports.createVirtualProxy = createVirtualProxy;
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
const createLoggingProxy = (target, logger) => {
    return new Proxy(target, {
        get(obj, prop) {
            const value = obj[prop];
            if (typeof value === 'function') {
                return (...args) => {
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
exports.createLoggingProxy = createLoggingProxy;
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
const createProtectionProxy = (target, accessControl) => {
    return new Proxy(target, {
        get(obj, prop) {
            const value = obj[prop];
            if (typeof value === 'function') {
                return (...args) => {
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
exports.createProtectionProxy = createProtectionProxy;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Service Locator
    createServiceLocator: exports.createServiceLocator,
    validateServiceDependencies: exports.validateServiceDependencies,
    createScopedServiceLocator: exports.createScopedServiceLocator,
    // Dependency Injection
    Inject: exports.Inject,
    resolveDependencies: exports.resolveDependencies,
    createDIContainer: exports.createDIContainer,
    constructorInject: exports.constructorInject,
    // Factory Patterns
    createAbstractFactory: exports.createAbstractFactory,
    createFactoryMethod: exports.createFactoryMethod,
    createBuilder: exports.createBuilder,
    createPrototype: exports.createPrototype,
    deepClone: exports.deepClone,
    // Strategy Pattern
    createStrategy: exports.createStrategy,
    selectBestStrategy: exports.selectBestStrategy,
    // Chain of Responsibility
    createChainHandler: exports.createChainHandler,
    buildHandlerChain: exports.buildHandlerChain,
    // Command Pattern
    createCommand: exports.createCommand,
    createCommandInvoker: exports.createCommandInvoker,
    createMacroCommand: exports.createMacroCommand,
    // Observer Pattern
    createSubject: exports.createSubject,
    createObserver: exports.createObserver,
    createEventEmitter: exports.createEventEmitter,
    // Singleton Pattern
    createSingleton: exports.createSingleton,
    Singleton: exports.Singleton,
    // Adapter Pattern
    createAdapter: exports.createAdapter,
    createBidirectionalAdapter: exports.createBidirectionalAdapter,
    // Decorator Pattern
    createMethodDecorator: exports.createMethodDecorator,
    createTimingDecorator: exports.createTimingDecorator,
    createCachingDecorator: exports.createCachingDecorator,
    // Proxy Pattern
    createVirtualProxy: exports.createVirtualProxy,
    createLoggingProxy: exports.createLoggingProxy,
    createProtectionProxy: exports.createProtectionProxy,
};
//# sourceMappingURL=typescript-oracle-patterns-kit.js.map