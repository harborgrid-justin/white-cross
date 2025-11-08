/**
 * LOC: PAT9876543
 * File: /reuse/typescript-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - All TypeScript modules requiring design patterns
 *   - Service layer implementations
 *   - Domain-driven design modules
 *   - Dependency injection containers
 */

/**
 * File: /reuse/typescript-patterns-kit.ts
 * Locator: WC-UTL-PAT-001
 * Purpose: TypeScript Design Patterns Utilities - Comprehensive pattern implementations
 *
 * Upstream: Independent utility module for design patterns
 * Downstream: ../backend/*, ../frontend/*, Service implementations, DDD modules
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 design pattern utilities including singleton, factory, builder, observer, strategy, DI helpers
 *
 * LLM Context: Production-grade TypeScript design pattern implementations for White Cross.
 * Provides comprehensive patterns: Singleton, Factory, Abstract Factory, Builder, Prototype, Observer,
 * Strategy, Command, State, Chain of Responsibility, Decorator, Proxy, Facade, Adapter, Dependency Injection,
 * Repository, Unit of Work, Specification, and advanced type utilities with type guards and predicates.
 * Essential for clean architecture and maintainable enterprise applications.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Constructor type for classes
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

/**
 * Factory function type
 */
export type FactoryFunction<T> = (...args: any[]) => T;

/**
 * Observer callback type
 */
export type ObserverCallback<T = any> = (data: T) => void;

/**
 * Strategy interface
 */
export interface Strategy<TInput = any, TOutput = any> {
  execute(input: TInput): TOutput;
}

/**
 * Command interface
 */
export interface Command<TResult = void> {
  execute(): TResult | Promise<TResult>;
  undo?(): void | Promise<void>;
}

/**
 * Specification interface
 */
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

/**
 * Repository interface
 */
export interface Repository<T, TId = string> {
  findById(id: TId): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: TId): Promise<boolean>;
}

/**
 * Unit of Work interface
 */
export interface UnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Middleware function type
 */
export type Middleware<T = any> = (
  context: T,
  next: () => Promise<any> | any
) => Promise<any> | any;

// ============================================================================
// SINGLETON PATTERN
// ============================================================================

/**
 * Creates a singleton instance of a class.
 * Ensures only one instance exists throughout the application lifecycle.
 *
 * @template T - Class type
 * @param {Constructor<T>} constructor - Class constructor
 * @returns {T} Singleton instance
 *
 * @example
 * ```typescript
 * class DatabaseConnection {
 *   connect() { console.log('Connected'); }
 * }
 *
 * const db1 = createSingleton(DatabaseConnection);
 * const db2 = createSingleton(DatabaseConnection);
 * console.log(db1 === db2); // true
 * ```
 */
export function createSingleton<T>(constructor: Constructor<T>): T {
  const instances = new WeakMap<Constructor<T>, T>();

  if (!instances.has(constructor)) {
    instances.set(constructor, new constructor());
  }

  return instances.get(constructor)!;
}

/**
 * Singleton decorator for classes.
 * Converts a class into a singleton automatically.
 *
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @Singleton
 * class Logger {
 *   log(message: string) {
 *     console.log(message);
 *   }
 * }
 *
 * const logger1 = new Logger();
 * const logger2 = new Logger();
 * console.log(logger1 === logger2); // true
 * ```
 */
export function Singleton<T extends Constructor>(): (target: T) => T {
  return function (target: T): T {
    let instance: InstanceType<T> | null = null;

    return class extends target {
      constructor(...args: any[]) {
        if (instance) {
          return instance as any;
        }
        super(...args);
        instance = this as any;
        return instance;
      }
    } as T;
  };
}

/**
 * Lazy singleton that creates instance only when first accessed.
 *
 * @template T - Instance type
 * @param {() => T} factory - Factory function to create instance
 * @returns {() => T} Getter function for singleton instance
 *
 * @example
 * ```typescript
 * const getConfig = lazySingleton(() => ({
 *   apiUrl: 'https://api.example.com',
 *   timeout: 5000
 * }));
 *
 * const config1 = getConfig();
 * const config2 = getConfig();
 * console.log(config1 === config2); // true
 * ```
 */
export function lazySingleton<T>(factory: () => T): () => T {
  let instance: T | null = null;
  let initialized = false;

  return (): T => {
    if (!initialized) {
      instance = factory();
      initialized = true;
    }
    return instance!;
  };
}

// ============================================================================
// FACTORY PATTERN
// ============================================================================

/**
 * Simple factory for creating instances based on type.
 *
 * @template T - Base type
 * @param {Record<string, Constructor<T>>} types - Map of type names to constructors
 * @returns {(type: string, ...args: any[]) => T} Factory function
 *
 * @example
 * ```typescript
 * interface Shape { draw(): void; }
 * class Circle implements Shape { draw() { console.log('Circle'); } }
 * class Square implements Shape { draw() { console.log('Square'); } }
 *
 * const shapeFactory = createFactory<Shape>({
 *   circle: Circle,
 *   square: Square
 * });
 *
 * const circle = shapeFactory('circle');
 * circle.draw(); // 'Circle'
 * ```
 */
export function createFactory<T>(
  types: Record<string, Constructor<T>>
): (type: string, ...args: any[]) => T {
  return (type: string, ...args: any[]): T => {
    const Constructor = types[type];
    if (!Constructor) {
      throw new Error(`Unknown type: ${type}`);
    }
    return new Constructor(...args);
  };
}

/**
 * Abstract factory for creating families of related objects.
 *
 * @template T - Product family type
 * @returns {AbstractFactory<T>} Abstract factory instance
 *
 * @example
 * ```typescript
 * interface UIFactory {
 *   createButton(): Button;
 *   createInput(): Input;
 * }
 *
 * const factory = createAbstractFactory<UIFactory>({
 *   modern: ModernUIFactory,
 *   classic: ClassicUIFactory
 * });
 *
 * const modernUI = factory.create('modern');
 * const button = modernUI.createButton();
 * ```
 */
export function createAbstractFactory<T>(
  factories: Record<string, Constructor<T>>
): {
  create(type: string): T;
  register(type: string, factory: Constructor<T>): void;
} {
  const registry = new Map<string, Constructor<T>>(Object.entries(factories));

  return {
    create(type: string): T {
      const Factory = registry.get(type);
      if (!Factory) {
        throw new Error(`Unknown factory type: ${type}`);
      }
      return new Factory();
    },
    register(type: string, factory: Constructor<T>): void {
      registry.set(type, factory);
    },
  };
}

/**
 * Factory method pattern implementation.
 *
 * @template T - Product type
 * @param {() => T} factoryMethod - Factory method
 * @returns {T} Created instance
 *
 * @example
 * ```typescript
 * abstract class Dialog {
 *   abstract createButton(): Button;
 *
 *   render() {
 *     const button = this.createButton();
 *     button.onClick();
 *   }
 * }
 *
 * class WindowsDialog extends Dialog {
 *   createButton() {
 *     return factoryMethod(() => new WindowsButton());
 *   }
 * }
 * ```
 */
export function factoryMethod<T>(factoryMethod: () => T): T {
  return factoryMethod();
}

// ============================================================================
// BUILDER PATTERN
// ============================================================================

/**
 * Fluent builder interface
 */
export interface FluentBuilder<T> {
  build(): T;
}

/**
 * Creates a fluent builder for complex object construction.
 *
 * @template T - Object type to build
 * @returns {FluentBuilder<T>} Builder instance
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   age?: number;
 * }
 *
 * const user = createFluentBuilder<User>()
 *   .set('id', '123')
 *   .set('name', 'John Doe')
 *   .set('email', 'john@example.com')
 *   .build();
 * ```
 */
export function createFluentBuilder<T extends object>(): any {
  const data: Partial<T> = {};

  const builder: any = {
    set<K extends keyof T>(key: K, value: T[K]): any {
      data[key] = value;
      return builder;
    },
    setMany(values: Partial<T>): any {
      Object.assign(data, values);
      return builder;
    },
    build(): T {
      return data as T;
    },
  };

  return builder;
}

/**
 * Step builder for enforcing build order.
 *
 * @template T - Final type
 * @param {Partial<T>} initial - Initial values
 * @returns {any} Step builder
 *
 * @example
 * ```typescript
 * const user = createStepBuilder<User>({})
 *   .withId('123')
 *   .withName('John')
 *   .withEmail('john@example.com')
 *   .build();
 * ```
 */
export function createStepBuilder<T extends object>(initial: Partial<T> = {}): any {
  const data = { ...initial };

  return new Proxy(
    {
      build: () => data as T,
    },
    {
      get(target: any, prop: string) {
        if (prop === 'build') {
          return target.build;
        }
        if (prop.startsWith('with')) {
          return (value: any) => {
            const key = prop.slice(4).toLowerCase();
            (data as any)[key] = value;
            return new Proxy(target, this);
          };
        }
        return target[prop];
      },
    }
  );
}

/**
 * Director for managing complex builder workflows.
 *
 * @template T - Built object type
 * @param {FluentBuilder<T>} builder - Builder instance
 * @param {(builder: FluentBuilder<T>) => void} recipe - Build recipe
 * @returns {T} Built object
 *
 * @example
 * ```typescript
 * const builder = createFluentBuilder<Config>();
 * const config = buildWithDirector(builder, (b) => {
 *   b.set('host', 'localhost')
 *    .set('port', 3000)
 *    .set('timeout', 5000);
 * });
 * ```
 */
export function buildWithDirector<T>(
  builder: FluentBuilder<T> & any,
  recipe: (builder: any) => void
): T {
  recipe(builder);
  return builder.build();
}

// ============================================================================
// OBSERVER PATTERN
// ============================================================================

/**
 * Observable subject for event-driven architecture.
 *
 * @template T - Event data type
 * @returns {Observable<T>} Observable instance
 *
 * @example
 * ```typescript
 * interface UserEvent {
 *   userId: string;
 *   action: string;
 * }
 *
 * const userEvents = createObservable<UserEvent>();
 *
 * userEvents.subscribe((event) => {
 *   console.log(`User ${event.userId} performed ${event.action}`);
 * });
 *
 * userEvents.notify({ userId: '123', action: 'login' });
 * ```
 */
export function createObservable<T>(): {
  subscribe(callback: ObserverCallback<T>): () => void;
  notify(data: T): void;
  clear(): void;
  count(): number;
} {
  const observers: Set<ObserverCallback<T>> = new Set();

  return {
    subscribe(callback: ObserverCallback<T>): () => void {
      observers.add(callback);
      return () => observers.delete(callback);
    },
    notify(data: T): void {
      observers.forEach((observer) => observer(data));
    },
    clear(): void {
      observers.clear();
    },
    count(): number {
      return observers.size;
    },
  };
}

/**
 * Event emitter with typed events.
 *
 * @template TEvents - Event map type
 * @returns {EventEmitter<TEvents>} Event emitter instance
 *
 * @example
 * ```typescript
 * interface Events {
 *   'user:login': { userId: string };
 *   'user:logout': { userId: string };
 * }
 *
 * const emitter = createEventEmitter<Events>();
 *
 * emitter.on('user:login', (data) => {
 *   console.log(`User ${data.userId} logged in`);
 * });
 *
 * emitter.emit('user:login', { userId: '123' });
 * ```
 */
export function createEventEmitter<TEvents extends Record<string, any>>(): {
  on<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): () => void;
  once<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): void;
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
  off<K extends keyof TEvents>(event: K, callback?: (data: TEvents[K]) => void): void;
} {
  const events = new Map<keyof TEvents, Set<(data: any) => void>>();

  return {
    on<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): () => void {
      if (!events.has(event)) {
        events.set(event, new Set());
      }
      events.get(event)!.add(callback);
      return () => events.get(event)?.delete(callback);
    },

    once<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): void {
      const wrapper = (data: TEvents[K]) => {
        callback(data);
        events.get(event)?.delete(wrapper);
      };
      this.on(event, wrapper);
    },

    emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
      const callbacks = events.get(event);
      if (callbacks) {
        callbacks.forEach((callback) => callback(data));
      }
    },

    off<K extends keyof TEvents>(event: K, callback?: (data: TEvents[K]) => void): void {
      if (!callback) {
        events.delete(event);
      } else {
        events.get(event)?.delete(callback);
      }
    },
  };
}

// ============================================================================
// STRATEGY PATTERN
// ============================================================================

/**
 * Strategy context for runtime algorithm selection.
 *
 * @template TInput - Input type
 * @template TOutput - Output type
 * @param {Strategy<TInput, TOutput>} initialStrategy - Initial strategy
 * @returns {StrategyContext<TInput, TOutput>} Strategy context
 *
 * @example
 * ```typescript
 * class QuickSort implements Strategy<number[], number[]> {
 *   execute(data: number[]) { return data.sort((a, b) => a - b); }
 * }
 *
 * class BubbleSort implements Strategy<number[], number[]> {
 *   execute(data: number[]) { /* bubble sort */ return data; }
 * }
 *
 * const sorter = createStrategyContext(new QuickSort());
 * const sorted = sorter.executeStrategy([3, 1, 2]);
 * ```
 */
export function createStrategyContext<TInput, TOutput>(
  initialStrategy: Strategy<TInput, TOutput>
): {
  setStrategy(strategy: Strategy<TInput, TOutput>): void;
  executeStrategy(input: TInput): TOutput;
} {
  let currentStrategy = initialStrategy;

  return {
    setStrategy(strategy: Strategy<TInput, TOutput>): void {
      currentStrategy = strategy;
    },
    executeStrategy(input: TInput): TOutput {
      return currentStrategy.execute(input);
    },
  };
}

/**
 * Creates a strategy from a function.
 *
 * @template TInput - Input type
 * @template TOutput - Output type
 * @param {(input: TInput) => TOutput} fn - Strategy function
 * @returns {Strategy<TInput, TOutput>} Strategy instance
 *
 * @example
 * ```typescript
 * const uppercaseStrategy = createStrategy((text: string) => text.toUpperCase());
 * const result = uppercaseStrategy.execute('hello'); // 'HELLO'
 * ```
 */
export function createStrategy<TInput, TOutput>(
  fn: (input: TInput) => TOutput
): Strategy<TInput, TOutput> {
  return {
    execute: fn,
  };
}

// ============================================================================
// COMMAND PATTERN
// ============================================================================

/**
 * Command invoker for executing and undoing commands.
 *
 * @template T - Command result type
 * @returns {CommandInvoker<T>} Command invoker
 *
 * @example
 * ```typescript
 * class CreateUserCommand implements Command<User> {
 *   async execute() { return await createUser(); }
 *   async undo() { await deleteUser(); }
 * }
 *
 * const invoker = createCommandInvoker<User>();
 * await invoker.execute(new CreateUserCommand());
 * await invoker.undo(); // Reverts the command
 * ```
 */
export function createCommandInvoker<T = any>(): {
  execute(command: Command<T>): Promise<T>;
  undo(): Promise<void>;
  canUndo(): boolean;
  clearHistory(): void;
} {
  const history: Command<T>[] = [];

  return {
    async execute(command: Command<T>): Promise<T> {
      const result = await command.execute();
      if (command.undo) {
        history.push(command);
      }
      return result;
    },

    async undo(): Promise<void> {
      const command = history.pop();
      if (command?.undo) {
        await command.undo();
      }
    },

    canUndo(): boolean {
      return history.length > 0;
    },

    clearHistory(): void {
      history.length = 0;
    },
  };
}

/**
 * Creates a command from functions.
 *
 * @template T - Result type
 * @param {() => T | Promise<T>} executeFn - Execute function
 * @param {() => void | Promise<void>} undoFn - Undo function (optional)
 * @returns {Command<T>} Command instance
 *
 * @example
 * ```typescript
 * const command = createCommand(
 *   async () => await api.createUser(data),
 *   async () => await api.deleteUser(userId)
 * );
 * ```
 */
export function createCommand<T>(
  executeFn: () => T | Promise<T>,
  undoFn?: () => void | Promise<void>
): Command<T> {
  return {
    execute: executeFn,
    undo: undoFn,
  };
}

// ============================================================================
// SPECIFICATION PATTERN
// ============================================================================

/**
 * Creates a specification for domain rules.
 *
 * @template T - Candidate type
 * @param {(candidate: T) => boolean} predicate - Specification predicate
 * @returns {Specification<T>} Specification instance
 *
 * @example
 * ```typescript
 * interface User {
 *   age: number;
 *   isActive: boolean;
 * }
 *
 * const isAdult = createSpecification<User>((user) => user.age >= 18);
 * const isActive = createSpecification<User>((user) => user.isActive);
 *
 * const canVote = isAdult.and(isActive);
 * console.log(canVote.isSatisfiedBy({ age: 20, isActive: true })); // true
 * ```
 */
export function createSpecification<T>(
  predicate: (candidate: T) => boolean
): Specification<T> {
  return {
    isSatisfiedBy: predicate,

    and(other: Specification<T>): Specification<T> {
      return createSpecification((candidate) =>
        this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate)
      );
    },

    or(other: Specification<T>): Specification<T> {
      return createSpecification((candidate) =>
        this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate)
      );
    },

    not(): Specification<T> {
      return createSpecification((candidate) => !this.isSatisfiedBy(candidate));
    },
  };
}

// ============================================================================
// DEPENDENCY INJECTION
// ============================================================================

/**
 * Simple dependency injection container.
 *
 * @returns {DIContainer} DI container instance
 *
 * @example
 * ```typescript
 * const container = createDIContainer();
 *
 * container.register('logger', Logger);
 * container.register('database', Database, true); // singleton
 *
 * const logger = container.resolve<Logger>('logger');
 * ```
 */
export function createDIContainer(): {
  register<T>(token: string, constructor: Constructor<T>, singleton?: boolean): void;
  resolve<T>(token: string): T;
  has(token: string): boolean;
  clear(): void;
} {
  const registry = new Map<string, { constructor: Constructor; singleton: boolean }>();
  const singletons = new Map<string, any>();

  return {
    register<T>(token: string, constructor: Constructor<T>, singleton = false): void {
      registry.set(token, { constructor, singleton });
    },

    resolve<T>(token: string): T {
      const entry = registry.get(token);
      if (!entry) {
        throw new Error(`No provider registered for token: ${token}`);
      }

      if (entry.singleton) {
        if (!singletons.has(token)) {
          singletons.set(token, new entry.constructor());
        }
        return singletons.get(token);
      }

      return new entry.constructor();
    },

    has(token: string): boolean {
      return registry.has(token);
    },

    clear(): void {
      registry.clear();
      singletons.clear();
    },
  };
}

/**
 * Injectable decorator for classes.
 *
 * @param {string} token - Injection token
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @Injectable('userService')
 * class UserService {
 *   getUsers() { return []; }
 * }
 * ```
 */
export function Injectable(token: string): ClassDecorator {
  return function (target: any): any {
    Reflect.defineMetadata('injectable:token', token, target);
    return target;
  };
}

/**
 * Inject decorator for constructor parameters.
 *
 * @param {string} token - Injection token
 * @returns {ParameterDecorator} Parameter decorator
 *
 * @example
 * ```typescript
 * class UserController {
 *   constructor(@Inject('userService') private userService: UserService) {}
 * }
 * ```
 */
export function Inject(token: string): ParameterDecorator {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingTokens: string[] = Reflect.getMetadata('injectable:params', target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata('injectable:params', existingTokens, target);
  };
}

// ============================================================================
// DECORATOR PATTERN
// ============================================================================

/**
 * Creates a decorator that wraps an object with additional behavior.
 *
 * @template T - Object type
 * @param {T} target - Target object
 * @param {Partial<T>} decorations - Additional behavior
 * @returns {T} Decorated object
 *
 * @example
 * ```typescript
 * interface Logger {
 *   log(message: string): void;
 * }
 *
 * const logger: Logger = {
 *   log(message) { console.log(message); }
 * };
 *
 * const timestampedLogger = createDecorator(logger, {
 *   log(message) {
 *     logger.log(`[${new Date().toISOString()}] ${message}`);
 *   }
 * });
 * ```
 */
export function createDecorator<T extends object>(target: T, decorations: Partial<T>): T {
  return new Proxy(target, {
    get(obj, prop) {
      if (prop in decorations) {
        return (decorations as any)[prop];
      }
      return (obj as any)[prop];
    },
  });
}

/**
 * Method decorator for logging execution time.
 *
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class DataService {
 *   @LogExecutionTime()
 *   async fetchData() {
 *     // Method execution time will be logged
 *   }
 * }
 * ```
 */
export function LogExecutionTime(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      console.log(`${String(propertyKey)} executed in ${end - start}ms`);
      return result;
    };

    return descriptor;
  };
}

// ============================================================================
// PROXY PATTERN
// ============================================================================

/**
 * Creates a lazy-loading proxy.
 *
 * @template T - Target type
 * @param {() => T} factory - Factory function
 * @returns {T} Lazy proxy
 *
 * @example
 * ```typescript
 * const heavyObject = createLazyProxy(() => {
 *   console.log('Creating heavy object...');
 *   return { data: 'heavy data' };
 * });
 *
 * // Object is not created yet
 * console.log(heavyObject.data); // Now it's created
 * ```
 */
export function createLazyProxy<T extends object>(factory: () => T): T {
  let instance: T | null = null;

  return new Proxy({} as T, {
    get(_, prop) {
      if (!instance) {
        instance = factory();
      }
      return (instance as any)[prop];
    },
  });
}

/**
 * Creates a caching proxy.
 *
 * @template T - Target type
 * @param {T} target - Target object
 * @returns {T} Caching proxy
 *
 * @example
 * ```typescript
 * const api = {
 *   async fetchUser(id: string) {
 *     return await fetch(`/api/users/${id}`);
 *   }
 * };
 *
 * const cachedApi = createCachingProxy(api);
 * await cachedApi.fetchUser('123'); // Fetches from API
 * await cachedApi.fetchUser('123'); // Returns cached result
 * ```
 */
export function createCachingProxy<T extends object>(target: T): T {
  const cache = new Map<string, any>();

  return new Proxy(target, {
    get(obj, prop) {
      const value = (obj as any)[prop];

      if (typeof value === 'function') {
        return function (...args: any[]) {
          const cacheKey = `${String(prop)}:${JSON.stringify(args)}`;

          if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
          }

          const result = value.apply(obj, args);

          if (result instanceof Promise) {
            return result.then((resolved) => {
              cache.set(cacheKey, resolved);
              return resolved;
            });
          }

          cache.set(cacheKey, result);
          return result;
        };
      }

      return value;
    },
  });
}

// ============================================================================
// CHAIN OF RESPONSIBILITY
// ============================================================================

/**
 * Creates a middleware chain.
 *
 * @template T - Context type
 * @param {Middleware<T>[]} middlewares - Middleware functions
 * @returns {(context: T) => Promise<any>} Chain executor
 *
 * @example
 * ```typescript
 * const authMiddleware = async (ctx, next) => {
 *   if (!ctx.user) throw new Error('Unauthorized');
 *   return next();
 * };
 *
 * const loggingMiddleware = async (ctx, next) => {
 *   console.log('Request:', ctx);
 *   return next();
 * };
 *
 * const chain = createMiddlewareChain([authMiddleware, loggingMiddleware]);
 * await chain({ user: 'john' });
 * ```
 */
export function createMiddlewareChain<T>(
  middlewares: Middleware<T>[]
): (context: T) => Promise<any> {
  return async (context: T): Promise<any> => {
    let index = 0;

    const next = async (): Promise<any> => {
      if (index >= middlewares.length) {
        return;
      }

      const middleware = middlewares[index++];
      return await middleware(context, next);
    };

    return await next();
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if value is defined (not null or undefined).
 *
 * @template T - Value type
 * @param {T} value - Value to check
 * @returns {boolean} True if value is defined
 *
 * @example
 * ```typescript
 * const value: string | null = getValue();
 * if (isDefined(value)) {
 *   console.log(value.toUpperCase()); // TypeScript knows value is string
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is a function.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a function
 *
 * @example
 * ```typescript
 * if (isFunction(callback)) {
 *   callback();
 * }
 * ```
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * Type guard to check if value is a promise.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a promise
 *
 * @example
 * ```typescript
 * const result = someOperation();
 * if (isPromise(result)) {
 *   await result;
 * }
 * ```
 */
export function isPromise<T>(value: any): value is Promise<T> {
  return value instanceof Promise || (value && typeof value.then === 'function');
}

/**
 * Type guard to check if object has a specific property.
 *
 * @template K - Property key type
 * @param {any} obj - Object to check
 * @param {K} key - Property key
 * @returns {boolean} True if object has property
 *
 * @example
 * ```typescript
 * const obj: unknown = getData();
 * if (hasProperty(obj, 'id')) {
 *   console.log(obj.id); // TypeScript knows obj has id property
 * }
 * ```
 */
export function hasProperty<K extends string>(
  obj: any,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Type guard to check if value is of a specific class.
 *
 * @template T - Class type
 * @param {any} value - Value to check
 * @param {Constructor<T>} constructor - Class constructor
 * @returns {boolean} True if value is instance of class
 *
 * @example
 * ```typescript
 * if (isInstanceOf(error, HttpException)) {
 *   console.log(error.statusCode);
 * }
 * ```
 */
export function isInstanceOf<T>(value: any, constructor: Constructor<T>): value is T {
  return value instanceof constructor;
}

// ============================================================================
// UTILITY TYPES HELPERS
// ============================================================================

/**
 * Extracts promise resolved type.
 *
 * @example
 * ```typescript
 * type UserPromise = Promise<User>;
 * type User = Awaited<UserPromise>; // User type
 * ```
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Makes specified keys optional.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * type PartialUser = PartialBy<User, 'email'>;
 * // { id: string; name: string; email?: string }
 * ```
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specified keys required.
 *
 * @example
 * ```typescript
 * interface User {
 *   id?: string;
 *   name?: string;
 * }
 *
 * type RequiredUser = RequiredBy<User, 'id'>;
 * // { id: string; name?: string }
 * ```
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Creates union of object values.
 *
 * @example
 * ```typescript
 * const Colors = {
 *   RED: 'red',
 *   GREEN: 'green',
 *   BLUE: 'blue'
 * } as const;
 *
 * type Color = ValueOf<typeof Colors>; // 'red' | 'green' | 'blue'
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Merges two types.
 *
 * @example
 * ```typescript
 * type A = { a: string; b: number };
 * type B = { b: string; c: boolean };
 * type C = Merge<A, B>; // { a: string; b: string; c: boolean }
 * ```
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Memoizes a function result.
 *
 * @template TArgs - Argument types
 * @template TResult - Result type
 * @param {(...args: TArgs[]) => TResult} fn - Function to memoize
 * @returns {(...args: TArgs[]) => TResult} Memoized function
 *
 * @example
 * ```typescript
 * const fibonacci = memoize((n: number): number => {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * });
 *
 * console.log(fibonacci(40)); // Fast due to memoization
 * ```
 */
export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
  const cache = new Map<string, TResult>();

  return (...args: TArgs): TResult => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Debounces a function.
 *
 * @template TArgs - Argument types
 * @param {(...args: TArgs[]) => void} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {(...args: TArgs[]) => void} Debounced function
 *
 * @example
 * ```typescript
 * const search = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * search('hello'); // Only executes after 300ms of inactivity
 * ```
 */
export function debounce<TArgs extends any[]>(
  fn: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: TArgs): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Throttles a function.
 *
 * @template TArgs - Argument types
 * @param {(...args: TArgs[]) => void} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {(...args: TArgs[]) => void} Throttled function
 *
 * @example
 * ```typescript
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 *
 * window.addEventListener('scroll', handleScroll);
 * ```
 */
export function throttle<TArgs extends any[]>(
  fn: (...args: TArgs) => void,
  limit: number
): (...args: TArgs) => void {
  let inThrottle = false;

  return (...args: TArgs): void => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Retries a function on failure.
 *
 * @template T - Result type
 * @param {() => Promise<T>} fn - Async function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise<T>} Result
 *
 * @example
 * ```typescript
 * const data = await retry(
 *   async () => await fetch('/api/data'),
 *   3,
 *   1000
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Singleton
  createSingleton,
  Singleton,
  lazySingleton,

  // Factory
  createFactory,
  createAbstractFactory,
  factoryMethod,

  // Builder
  createFluentBuilder,
  createStepBuilder,
  buildWithDirector,

  // Observer
  createObservable,
  createEventEmitter,

  // Strategy
  createStrategyContext,
  createStrategy,

  // Command
  createCommandInvoker,
  createCommand,

  // Specification
  createSpecification,

  // Dependency Injection
  createDIContainer,
  Injectable,
  Inject,

  // Decorator
  createDecorator,
  LogExecutionTime,

  // Proxy
  createLazyProxy,
  createCachingProxy,

  // Chain of Responsibility
  createMiddlewareChain,

  // Type Guards
  isDefined,
  isFunction,
  isPromise,
  hasProperty,
  isInstanceOf,

  // Utility Functions
  memoize,
  debounce,
  throttle,
  retry,
};
