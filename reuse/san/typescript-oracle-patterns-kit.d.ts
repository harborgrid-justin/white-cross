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
interface FactoryConfig<T> {
    type: string;
    createFn: (config?: any) => T;
    validators?: ((config: any) => boolean)[];
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
interface DecoratorMetadata {
    target: any;
    propertyKey: string;
    descriptor: PropertyDescriptor;
    metadata: Record<string, any>;
}
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
export declare const createServiceLocator: (config?: Partial<ServiceLocatorConfig>) => {
    register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean, dependencies?: (string | symbol)[]) => void;
    resolve: <T = any>(id: string | symbol) => T;
    clear: () => void;
    has: (id: string | symbol) => boolean;
    unregister: (id: string | symbol) => boolean;
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
export declare const validateServiceDependencies: (services: Map<string | symbol, ServiceDescriptor>, serviceId: string | symbol, visited?: Set<string | symbol>) => boolean;
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
export declare const createScopedServiceLocator: (parentLocator: any) => {
    resolve: <T = any>(id: string | symbol) => T;
    register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean) => void;
    dispose: () => void;
};
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
export declare const Inject: (serviceId: string | symbol) => PropertyDecorator;
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
export declare const resolveDependencies: <T extends object>(target: T, locator: any) => T;
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
export declare const createDIContainer: () => {
    autowire: <T extends {
        new (...args: any[]): any;
    }>(constructor: T, ...additionalDeps: any[]) => InstanceType<T>;
    register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean, dependencies?: (string | symbol)[]) => void;
    resolve: <T = any>(id: string | symbol) => T;
    clear: () => void;
    has: (id: string | symbol) => boolean;
    unregister: (id: string | symbol) => boolean;
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
export declare const constructorInject: <T>(constructor: new (...args: any[]) => T, dependencies: any[]) => T;
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
export declare const createAbstractFactory: <T>(factories: Map<string, FactoryConfig<T>>) => {
    create: (type: string, config?: any) => T;
    register: (type: string, config: FactoryConfig<T>) => void;
    has: (type: string) => boolean;
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
export declare const createFactoryMethod: <T>(factoryFn: (type: string, config?: any) => T) => ((type: string, config?: any) => T);
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
export declare const createBuilder: <T>(steps: BuilderStep<T>[]) => {
    step: (stepName: string, ...args: any[]) => Promise</*elided*/ any>;
    build: () => T;
    reset: () => /*elided*/ any;
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
export declare const createPrototype: <T>(prototype: T) => (() => T);
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
export declare const deepClone: <T>(obj: T, cloneMap?: WeakMap<any, any>) => T;
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
export declare const createStrategy: <T>(strategies?: Map<string, Strategy<T>>, defaultStrategy?: string) => {
    execute: (strategyName: string | undefined, input: T) => Promise<any>;
    register: (name: string, strategy: Strategy<T>) => void;
    selectStrategy: (input: T) => string | null;
    has: (name: string) => boolean;
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
export declare const selectBestStrategy: <T>(input: T, strategies: Map<string, Strategy<T>>) => string | null;
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
export declare const createChainHandler: <T>(handleFn: (request: T) => Promise<T | null> | T | null) => ChainHandler<T>;
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
export declare const buildHandlerChain: <T>(handlers: Array<(request: T) => Promise<T | null> | T | null>) => ChainHandler<T>;
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
export declare const createCommand: <T = any>(executeFn: () => Promise<T> | T, undoFn?: () => Promise<void> | void, metadata?: Partial<CommandMetadata>) => Command<T>;
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
export declare const createCommandInvoker: () => {
    execute: <T>(command: Command<T>) => Promise<T>;
    undo: () => Promise<void>;
    redo: () => Promise<void>;
    getHistory: () => CommandMetadata[];
    clear: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
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
export declare const createMacroCommand: <T = any>(commands: Command[], metadata?: Partial<CommandMetadata>) => Command<T[]>;
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
export declare const createSubject: <T>() => Subject<T>;
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
export declare const createObserver: <T>(updateFn: (data: T) => void | Promise<void>, id?: string, priority?: number) => Observer<T>;
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
export declare const createEventEmitter: () => {
    on: <T>(event: string, callback: (data: T) => void | Promise<void>, priority?: number) => () => void;
    off: (event: string, observer: Observer<any>) => void;
    emit: <T>(event: string, data: T) => Promise<void>;
    removeAllListeners: (event?: string) => void;
};
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
export declare const createSingleton: <T>(factory: () => T) => (() => T);
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
export declare const Singleton: <T extends {
    new (...args: any[]): any;
}>(constructor: T) => T;
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
export declare const createAdapter: <TSource, TTarget>(adaptee: TSource, adaptFn: (source: TSource) => TTarget) => TTarget;
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
export declare const createBidirectionalAdapter: <TSource, TTarget>(toTarget: (source: TSource) => TTarget, toSource: (target: TTarget) => TSource) => {
    convert: (source: TSource) => TTarget;
    reverse: (target: TTarget) => TSource;
};
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
export declare const createMethodDecorator: (decoratorFn: (metadata: DecoratorMetadata) => void) => MethodDecorator;
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
export declare const createTimingDecorator: (callback?: (duration: number, method: string) => void) => MethodDecorator;
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
export declare const createCachingDecorator: (ttl?: number) => MethodDecorator;
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
export declare const createVirtualProxy: <T extends object>(factory: () => T) => T;
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
export declare const createLoggingProxy: <T extends object>(target: T, logger?: (method: string, args: any[]) => void) => T;
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
export declare const createProtectionProxy: <T extends object>(target: T, accessControl: (method: string, user?: any) => boolean) => T;
declare const _default: {
    createServiceLocator: (config?: Partial<ServiceLocatorConfig>) => {
        register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean, dependencies?: (string | symbol)[]) => void;
        resolve: <T = any>(id: string | symbol) => T;
        clear: () => void;
        has: (id: string | symbol) => boolean;
        unregister: (id: string | symbol) => boolean;
    };
    validateServiceDependencies: (services: Map<string | symbol, ServiceDescriptor>, serviceId: string | symbol, visited?: Set<string | symbol>) => boolean;
    createScopedServiceLocator: (parentLocator: any) => {
        resolve: <T = any>(id: string | symbol) => T;
        register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean) => void;
        dispose: () => void;
    };
    Inject: (serviceId: string | symbol) => PropertyDecorator;
    resolveDependencies: <T extends object>(target: T, locator: any) => T;
    createDIContainer: () => {
        autowire: <T extends {
            new (...args: any[]): any;
        }>(constructor: T, ...additionalDeps: any[]) => InstanceType<T>;
        register: (id: string | symbol, factoryOrInstance: any, singleton?: boolean, dependencies?: (string | symbol)[]) => void;
        resolve: <T = any>(id: string | symbol) => T;
        clear: () => void;
        has: (id: string | symbol) => boolean;
        unregister: (id: string | symbol) => boolean;
    };
    constructorInject: <T>(constructor: new (...args: any[]) => T, dependencies: any[]) => T;
    createAbstractFactory: <T>(factories: Map<string, FactoryConfig<T>>) => {
        create: (type: string, config?: any) => T;
        register: (type: string, config: FactoryConfig<T>) => void;
        has: (type: string) => boolean;
    };
    createFactoryMethod: <T>(factoryFn: (type: string, config?: any) => T) => ((type: string, config?: any) => T);
    createBuilder: <T>(steps: BuilderStep<T>[]) => {
        step: (stepName: string, ...args: any[]) => Promise</*elided*/ any>;
        build: () => T;
        reset: () => /*elided*/ any;
    };
    createPrototype: <T>(prototype: T) => (() => T);
    deepClone: <T>(obj: T, cloneMap?: WeakMap<any, any>) => T;
    createStrategy: <T>(strategies?: Map<string, Strategy<T>>, defaultStrategy?: string) => {
        execute: (strategyName: string | undefined, input: T) => Promise<any>;
        register: (name: string, strategy: Strategy<T>) => void;
        selectStrategy: (input: T) => string | null;
        has: (name: string) => boolean;
    };
    selectBestStrategy: <T>(input: T, strategies: Map<string, Strategy<T>>) => string | null;
    createChainHandler: <T>(handleFn: (request: T) => Promise<T | null> | T | null) => ChainHandler<T>;
    buildHandlerChain: <T>(handlers: Array<(request: T) => Promise<T | null> | T | null>) => ChainHandler<T>;
    createCommand: <T = any>(executeFn: () => Promise<T> | T, undoFn?: () => Promise<void> | void, metadata?: Partial<CommandMetadata>) => Command<T>;
    createCommandInvoker: () => {
        execute: <T>(command: Command<T>) => Promise<T>;
        undo: () => Promise<void>;
        redo: () => Promise<void>;
        getHistory: () => CommandMetadata[];
        clear: () => void;
        canUndo: () => boolean;
        canRedo: () => boolean;
    };
    createMacroCommand: <T = any>(commands: Command[], metadata?: Partial<CommandMetadata>) => Command<T[]>;
    createSubject: <T>() => Subject<T>;
    createObserver: <T>(updateFn: (data: T) => void | Promise<void>, id?: string, priority?: number) => Observer<T>;
    createEventEmitter: () => {
        on: <T>(event: string, callback: (data: T) => void | Promise<void>, priority?: number) => () => void;
        off: (event: string, observer: Observer<any>) => void;
        emit: <T>(event: string, data: T) => Promise<void>;
        removeAllListeners: (event?: string) => void;
    };
    createSingleton: <T>(factory: () => T) => (() => T);
    Singleton: <T extends {
        new (...args: any[]): any;
    }>(constructor: T) => T;
    createAdapter: <TSource, TTarget>(adaptee: TSource, adaptFn: (source: TSource) => TTarget) => TTarget;
    createBidirectionalAdapter: <TSource, TTarget>(toTarget: (source: TSource) => TTarget, toSource: (target: TTarget) => TSource) => {
        convert: (source: TSource) => TTarget;
        reverse: (target: TTarget) => TSource;
    };
    createMethodDecorator: (decoratorFn: (metadata: DecoratorMetadata) => void) => MethodDecorator;
    createTimingDecorator: (callback?: (duration: number, method: string) => void) => MethodDecorator;
    createCachingDecorator: (ttl?: number) => MethodDecorator;
    createVirtualProxy: <T extends object>(factory: () => T) => T;
    createLoggingProxy: <T extends object>(target: T, logger?: (method: string, args: any[]) => void) => T;
    createProtectionProxy: <T extends object>(target: T, accessControl: (method: string, user?: any) => boolean) => T;
};
export default _default;
//# sourceMappingURL=typescript-oracle-patterns-kit.d.ts.map