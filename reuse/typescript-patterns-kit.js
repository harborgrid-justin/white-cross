"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.brand = brand;
exports.unbrand = unbrand;
exports.createBrandValidator = createBrandValidator;
exports.createSingleton = createSingleton;
exports.Singleton = Singleton;
exports.lazySingleton = lazySingleton;
exports.createFactory = createFactory;
exports.createAbstractFactory = createAbstractFactory;
exports.factoryMethod = factoryMethod;
exports.createFluentBuilder = createFluentBuilder;
exports.createStepBuilder = createStepBuilder;
exports.buildWithDirector = buildWithDirector;
exports.createObservable = createObservable;
exports.createEventEmitter = createEventEmitter;
/**
 * Creates a branded value
 *
 * @template T - Value type
 * @template K - Brand key
 * @param {T} value - Value to brand
 * @returns {Branded<T, K>} Branded value
 *
 * @example
 * ```typescript
 * type Email = Branded<string, 'Email'>;
 *
 * const email = brand<string, 'Email'>('user@example.com');
 * ```
 */
function brand(value) {
    return value;
}
/**
 * Extracts the underlying value from a branded type
 *
 * @template T - Branded type
 * @param {T} branded - Branded value
 * @returns {any} Underlying value
 *
 * @example
 * ```typescript
 * type UserId = Branded<string, 'UserId'>;
 * const userId: UserId = brand('123');
 * const rawValue = unbrand(userId); // '123'
 * ```
 */
function unbrand(branded) {
    return branded;
}
/**
 * Creates a validator for branded types
 *
 * @template T - Base type
 * @template K - Brand key
 * @param {(value: T) => boolean} validator - Validation function
 * @returns {(value: T) => Branded<T, K> | null} Branded value validator
 *
 * @example
 * ```typescript
 * type PositiveNumber = Branded<number, 'PositiveNumber'>;
 *
 * const createPositive = createBrandValidator<number, 'PositiveNumber'>(
 *   (n) => n > 0
 * );
 *
 * const positive = createPositive(5); // PositiveNumber
 * const invalid = createPositive(-5); // null
 * ```
 */
function createBrandValidator(validator) {
    return (value) => {
        return validator(value) ? brand(value) : null;
    };
}
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
function createSingleton(constructor) {
    const instances = new WeakMap();
    if (!instances.has(constructor)) {
        instances.set(constructor, new constructor());
    }
    return instances.get(constructor);
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
function Singleton() {
    return function (target) {
        let instance = null;
        return class extends target {
            constructor(...args) {
                if (instance) {
                    return instance;
                }
                super(...args);
                instance = this;
                return instance;
            }
        };
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
function lazySingleton(factory) {
    let instance = null;
    let initialized = false;
    return () => {
        if (!initialized) {
            instance = factory();
            initialized = true;
        }
        return instance;
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
function createFactory(types) {
    return (type, ...args) => {
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
 * @param {Record<string, Constructor<T>>} factories - Map of factory names to constructors
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
function createAbstractFactory(factories) {
    const registry = new Map(Object.entries(factories));
    return {
        create(type) {
            const Factory = registry.get(type);
            if (!Factory) {
                throw new Error(`Unknown factory type: ${type}`);
            }
            return new Factory();
        },
        register(type, factory) {
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
function factoryMethod(factoryMethod) {
    return factoryMethod();
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
function createFluentBuilder() {
    const data = {};
    const builder = {
        set(key, value) {
            data[key] = value;
            return builder;
        },
        setMany(values) {
            Object.assign(data, values);
            return builder;
        },
        build() {
            return data;
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
function createStepBuilder(initial = {}) {
    const data = { ...initial };
    return new Proxy({
        build: () => data,
    }, {
        get(target, prop) {
            if (prop === 'build') {
                return target.build;
            }
            if (prop.startsWith('with')) {
                return (value) => {
                    const key = prop.slice(4).toLowerCase();
                    data[key] = value;
                    return new Proxy(target, this);
                };
            }
            return target[prop];
        },
    });
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
function buildWithDirector(builder, recipe) {
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
function createObservable() {
    const observers = new Set();
    return {
        subscribe(callback) {
            observers.add(callback);
            return () => observers.delete(callback);
        },
        notify(data) {
            observers.forEach((observer) => observer(data));
        },
        clear() {
            observers.clear();
        },
        count() {
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
function createEventEmitter() {
    const events = new Map();
    return {
        on(event, callback) {
            if (!events.has(event)) {
                events.set(event, new Set());
            }
            events.get(event).add(callback);
            return () => events.get(event)?.delete(callback);
        },
        once(event, callback) {
            const wrapper = (data) => {
                callback(data);
                events.get(event)?.delete(wrapper);
            };
            this.on(event, wrapper);
        },
        emit(event, data) {
            const callbacks = events.get(event);
            if (callbacks) {
                callbacks.forEach((callback) => callback(data));
            }
        },
        off(event, callback) {
            if (!callback) {
                events.delete(event);
            }
            else {
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
 *   execute(data: number[]) { /* bubble sort */ return data;
    * ;
    *
    * ;
const sorter = createStrategyContext(new QuickSort());
    * ;
const sorted = sorter.executeStrategy([3, 1, 2]);
    * `` `
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
 * ` ``;
typescript
    * ;
const uppercaseStrategy = createStrategy((text) => text.toUpperCase());
    * ;
const result = uppercaseStrategy.execute('hello'); // 'HELLO'
    * `` `
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
 * ` ``;
typescript
    * class CreateUserCommand {
        *async() { }
        execute() { return await createUser(); }
        *async() { }
        undo() { await deleteUser(); }
    }
    *
    * ;
const invoker = createCommandInvoker();
    * await invoker.execute(new CreateUserCommand());
    * await invoker.undo(); // Reverts the command
    * `` `
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
 * ` ``;
typescript
    * ;
const command = createCommand(
    * async());
await api.createUser(data),
        * async();
await api.deleteUser(userId)
    * ;
;
    * `` `
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
 * ` ``;
typescript
    * interface;
User;
{
        * age;
    number;
        * isActive;
    boolean;
        * ;
}
    *
    * ;
const isAdult = createSpecification((user) => user.age >= 18);
    * ;
const isActive = createSpecification((user) => user.isActive);
    *
    * ;
const canVote = isAdult.and(isActive);
    * console.log(canVote.isSatisfiedBy({ age: 20, isActive: true })); // true
    * `` `
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
 * ` ``;
typescript
    * ;
const container = createDIContainer();
    *
    * container.register('logger', Logger);
    * container.register('database', Database, true); // singleton
    *
    * ;
const logger = container.resolve('logger');
    * `` `
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
        throw new Error(`;
No;
provider;
registered;
for (token; ; )
    : $;
{
    token;
}
`);
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

// ============================================================================
// DECORATOR PATTERN & DECORATOR FACTORIES
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
 * ` ``;
typescript
    * interface;
Logger;
{
        * log(message, string);
    void ;
        * ;
}
    *
    * ;
const logger = {
    *log(message) { console.log(message); }
};
    *
    * ;
const timestampedLogger = createDecorator(logger, {
    *log(message) {
            * logger.log(`[${new Date().toISOString()}] ${message}`);
            * ;
    }
});
    * `` `
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
 * ` ``;
typescript
    * class DataService {
        *() { }
        fetchData() {
                *
            // Method execution time will be logged
                * ;
        }
    }
    * `` `
 */
export function LogExecutionTime(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      console.log(`;
$;
{
    String(propertyKey);
}
executed in $;
{
    end - start;
}
ms `);
      return result;
    };

    return descriptor;
  };
}

/**
 * Method decorator for caching results.
 *
 * @param {number} ttl - Time to live in milliseconds
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ` ``;
typescript
    * class DataService {
        *() { }
        fetchUser(id) {
                * ;
            return await api.getUser(id);
                * ;
        }
    }
    * `` `
 */
export function Cached(ttl: number = 60000): MethodDecorator {
  const cache = new Map<string, { value: any; expiry: number }>();

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `;
$;
{
    String(propertyKey);
}
$;
{
    JSON.stringify(args);
}
`;
      const now = Date.now();

      const cached = cache.get(cacheKey);
      if (cached && cached.expiry > now) {
        return cached.value;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, { value: result, expiry: now + ttl });
      return result;
    };

    return descriptor;
  };
}

/**
 * Method decorator for retry logic.
 *
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ` ``;
typescript
    * class ApiService {
        *() { }
        fetchData() {
                * ;
            return await fetch('/api/data');
                * ;
        }
    }
    * `` `
 */
export function Retry(maxAttempts: number = 3, delay: number = 1000): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
          }
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

/**
 * Method decorator for rate limiting.
 *
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ` ``;
typescript
    * class ApiService {
        *() { }
        fetchData() {
                * ;
            return await fetch('/api/data');
                * ;
        }
    }
    * `` `
 */
export function RateLimit(maxCalls: number, windowMs: number): MethodDecorator {
  const calls: number[] = [];

  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Remove calls outside the window
      while (calls.length > 0 && calls[0] < windowStart) {
        calls.shift();
      }

      if (calls.length >= maxCalls) {
        throw new Error(`;
Rate;
limit;
exceeded;
for ($; {} `);
      }

      calls.push(now);
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Property decorator for readonly enforcement.
 *
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ` ``; typescript
    * class User {
        *() { }
    }
    * `` `
 */
export function Readonly(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      writable: false,
      configurable: false,
    });
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
 * ` ``)
    typescript
        * ;
const heavyObject = createLazyProxy(() => {
        * console.log('Creating heavy object...');
        * ;
    return { data: 'heavy data' };
        * ;
});
    *
    *
// Object is not created yet
    * console.log(heavyObject.data); // Now it's created
    * `` `
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
 * ` ``;
typescript
    * ;
const api = {
    *async() { }, fetchUser(id) {
            * ;
        return await fetch(`/api/users/${id}`);
            * ;
    }
};
    *
    * ;
const cachedApi = createCachingProxy(api);
    * await cachedApi.fetchUser('123'); // Fetches from API
    * await cachedApi.fetchUser('123'); // Returns cached result
    * `` `
 */
export function createCachingProxy<T extends object>(target: T): T {
  const cache = new Map<string, any>();

  return new Proxy(target, {
    get(obj, prop) {
      const value = (obj as any)[prop];

      if (typeof value === 'function') {
        return function (...args: any[]) {
          const cacheKey = `;
$;
{
    String(prop);
}
$;
{
    JSON.stringify(args);
}
`;

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

/**
 * Creates a validation proxy that validates property assignments.
 *
 * @template T - Target type
 * @param {T} target - Target object
 * @param {(prop: string, value: any) => boolean} validator - Validation function
 * @returns {T} Validation proxy
 *
 * @example
 * ` ``;
typescript
    * ;
const user = createValidationProxy(
    * { age: 0 }, 
    * (prop, value));
{
        * ;
    if (prop === 'age')
        return value >= 0 && value <= 150;
        * ;
    return true;
        * ;
}
    * ;
;
    *
    * user.age;
25; // OK
    * user.age;
-5; // Throws error
    * `` `
 */
export function createValidationProxy<T extends object>(
  target: T,
  validator: (prop: string, value: any) => boolean
): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (!validator(String(prop), value)) {
        throw new Error(`;
Invalid;
value;
for (property; $; {})
    : $;
{
    value;
}
`);
      }
      (obj as any)[prop] = value;
      return true;
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
 * ` ``;
typescript
    * ;
const authMiddleware = async (ctx, next) => {
        * ;
    if (!ctx.user)
        throw new Error('Unauthorized');
        * ;
    return next();
        * ;
};
    *
    * ;
const loggingMiddleware = async (ctx, next) => {
        * console.log('Request:', ctx);
        * ;
    return next();
        * ;
};
    *
    * ;
const chain = createMiddlewareChain([authMiddleware, loggingMiddleware]);
    * await chain({ user: 'john' });
    * `` `
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
// TYPE GUARDS & NARROWING
// ============================================================================

/**
 * Type guard to check if value is defined (not null or undefined).
 *
 * @template T - Value type
 * @param {T} value - Value to check
 * @returns {boolean} True if value is defined
 *
 * @example
 * ` ``;
typescript
    * ;
const value = getValue();
    * ;
if (isDefined(value)) {
        * console.log(value.toUpperCase()); // TypeScript knows value is string
        * ;
}
    * `` `
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
 * ` ``;
typescript
    * ;
if (isFunction(callback)) {
        * callback();
        * ;
}
    * `` `
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
 * ` ``;
typescript
    * ;
const result = someOperation();
    * ;
if (isPromise(result)) {
        * await result;
        * ;
}
    * `` `
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
 * ` ``;
typescript
    * ;
const obj = getData();
    * ;
if (hasProperty(obj, 'id')) {
        * console.log(obj.id); // TypeScript knows obj has id property
        * ;
}
    * `` `
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
 * ` ``;
typescript
    * ;
if (isInstanceOf(error, HttpException)) {
        * console.log(error.statusCode);
        * ;
}
    * `` `
 */
export function isInstanceOf<T>(value: any, constructor: Constructor<T>): value is T {
  return value instanceof constructor;
}

/**
 * Type guard to check if value is a string.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a string
 *
 * @example
 * ` ``;
typescript
    * ;
if (isString(value)) {
        * console.log(value.toUpperCase());
        * ;
}
    * `` `
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if value is a number.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a number
 *
 * @example
 * ` ``;
typescript
    * ;
if (isNumber(value)) {
        * console.log(value.toFixed(2));
        * ;
}
    * `` `
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if value is a boolean.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a boolean
 *
 * @example
 * ` ``;
typescript
    * ;
if (isBoolean(value)) {
        * console.log(value ? 'yes' : 'no');
        * ;
}
    * `` `
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if value is an array.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is an array
 *
 * @example
 * ` ``;
typescript
    * ;
if (isArray(value)) {
        * console.log(value.length);
        * ;
}
    * `` `
 */
export function isArray<T = any>(value: any): value is T[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if value is an object.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is an object
 *
 * @example
 * ` ``;
typescript
    * ;
if (isObject(value)) {
        * console.log(Object.keys(value));
        * ;
}
    * `` `
 */
export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is null.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is null
 *
 * @example
 * ` ``;
typescript
    * ;
if (isNull(value)) {
        * console.log('Value is null');
        * ;
}
    * `` `
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * Type guard to check if value is undefined.
 *
 * @param {any} value - Value to check
 * @returns {boolean} True if value is undefined
 *
 * @example
 * ` ``;
typescript
    * ;
if (isUndefined(value)) {
        * console.log('Value is undefined');
        * ;
}
    * `` `
 */
export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

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
 * ` ``;
typescript
    * ;
const fibonacci = memoize((n) => {
        * ;
    if (n <= 1)
        return n;
        * ;
    return fibonacci(n - 1) + fibonacci(n - 2);
        * ;
});
    *
    * console.log(fibonacci(40)); // Fast due to memoization
    * `` `
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
 * ` ``;
typescript
    * ;
const search = debounce((query) => {
        * console.log('Searching for:', query);
        * ;
}, 300);
    *
    * search('hello'); // Only executes after 300ms of inactivity
    * `` `
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
 * ` ``;
typescript
    * ;
const handleScroll = throttle(() => {
        * console.log('Scroll event');
        * ;
}, 100);
    *
    * window.addEventListener('scroll', handleScroll);
    * `` `
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
 * ` ``;
typescript
    * ;
const data = await retry(
    * async());
await fetch('/api/data'),
        * 3,
        * 1000
        * ;
;
    * `` `
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

/**
 * Creates a deep clone of an object.
 *
 * @template T - Object type
 * @param {T} obj - Object to clone
 * @returns {T} Cloned object
 *
 * @example
 * ` ``;
typescript
    * ;
const original = { user: { name: 'John', age: 30 } };
    * ;
const cloned = deepClone(original);
    * cloned.user.name;
'Jane';
    * console.log(original.user.name); // 'John'
    * `` `
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone((obj as any)[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Deep freezes an object making it immutable.
 *
 * @template T - Object type
 * @param {T} obj - Object to freeze
 * @returns {DeepReadonly<T>} Frozen object
 *
 * @example
 * ` ``;
typescript
    * ;
const config = deepFreeze({ api: { url: 'https://api.example.com' } });
    * config.api.url;
'https://hack.com'; // Throws error in strict mode
    * `` `
 */
export function deepFreeze<T extends object>(obj: T): DeepReadonly<T> {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });

  return obj as DeepReadonly<T>;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Branded Types
  brand,
  unbrand,
  createBrandValidator,

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

  // Decorator
  createDecorator,
  LogExecutionTime,
  Cached,
  Retry,
  RateLimit,
  Readonly,

  // Proxy
  createLazyProxy,
  createCachingProxy,
  createValidationProxy,

  // Chain of Responsibility
  createMiddlewareChain,

  // Type Guards
  isDefined,
  isFunction,
  isPromise,
  hasProperty,
  isInstanceOf,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isNull,
  isUndefined,

  // Utility Functions
  memoize,
  debounce,
  throttle,
  retry,
  deepClone,
  deepFreeze,
};
;
//# sourceMappingURL=typescript-patterns-kit.js.map