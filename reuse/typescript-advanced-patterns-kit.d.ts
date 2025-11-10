/**
 * LOC: TSAP1234567
 * File: /reuse/typescript-advanced-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - All backend services and modules
 *   - Type-safe domain models
 *   - Advanced functional programming patterns
 */
/**
 * File: /reuse/typescript-advanced-patterns-kit.ts
 * Locator: WC-UTL-TSAP-001
 * Purpose: Advanced TypeScript Patterns & Utilities - Type guards, branded types, functional patterns, builders
 *
 * Upstream: Independent utility module for advanced TypeScript patterns
 * Downstream: ../backend/*, domain models, functional programming modules
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45 utility functions for advanced TypeScript patterns, type safety, functional programming
 *
 * LLM Context: Comprehensive advanced TypeScript patterns for enterprise applications. Provides type guards,
 * type predicates, branded types, phantom types, builder patterns, fluent interfaces, proxy patterns,
 * memoization, currying, composition, monads, and functional utilities. Essential for type-safe, maintainable
 * enterprise code with advanced compile-time guarantees.
 */
export type Brand<K, T> = K & {
    __brand: T;
};
export type Nominal<T, Name extends string> = T & {
    readonly __nominal: Name;
};
export type Phantom<T, P extends string> = T & {
    readonly __phantom: P;
};
export interface Builder<T> {
    build(): T;
}
export type FluentMethod<T, R> = (value: R) => T;
export interface Monad<T> {
    flatMap<U>(fn: (value: T) => Monad<U>): Monad<U>;
    map<U>(fn: (value: T) => U): Monad<U>;
}
export interface Maybe<T> extends Monad<T> {
    isPresent(): boolean;
    getOrElse(defaultValue: T): T;
}
export interface Either<L, R> {
    isLeft(): boolean;
    isRight(): boolean;
    fold<T>(onLeft: (left: L) => T, onRight: (right: R) => T): T;
}
export type TypeGuard<T> = (value: unknown) => value is T;
export type TypePredicate<T, S extends T> = (value: T) => value is S;
export interface MemoizeOptions {
    maxSize?: number;
    ttl?: number;
    keyGenerator?: (...args: any[]) => string;
}
export type Curried<A extends any[], R> = A extends [infer First, ...infer Rest] ? (arg: First) => Curried<Rest, R> : R;
export type Fn<A, B> = (a: A) => B;
export interface MetadataMap {
    [key: string]: any;
}
export interface ProxyOptions<T extends object> {
    get?: (target: T, property: string | symbol) => any;
    set?: (target: T, property: string | symbol, value: any) => boolean;
    deleteProperty?: (target: T, property: string | symbol) => boolean;
}
/**
 * Creates a type guard that checks if a value is defined (not null or undefined).
 *
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is defined
 *
 * @example
 * ```typescript
 * const value: string | undefined = "hello";
 * if (isDefined(value)) {
 *   console.log(value.toUpperCase()); // Type-safe: string
 * }
 * ```
 */
export declare const isDefined: <T>(value: T | null | undefined) => value is T;
/**
 * Creates a type guard that checks if a value is a specific type using a discriminator field.
 *
 * @param {string} discriminator - The discriminator field name
 * @param {V} value - The discriminator value to check
 * @returns {TypeGuard<T>} Type guard function
 *
 * @example
 * ```typescript
 * type Cat = { type: 'cat'; meow: () => void };
 * type Dog = { type: 'dog'; bark: () => void };
 * const isCat = createDiscriminatorGuard<Cat, 'type', 'cat'>('type', 'cat');
 * const animal: Cat | Dog = { type: 'cat', meow: () => {} };
 * if (isCat(animal)) {
 *   animal.meow(); // Type-safe
 * }
 * ```
 */
export declare const createDiscriminatorGuard: <T extends Record<K, V>, K extends keyof T, V extends T[K]>(discriminator: K, value: V) => TypeGuard<T>;
/**
 * Creates a type guard that checks if a value has all required properties.
 *
 * @param {K[]} keys - Array of required property keys
 * @returns {TypeGuard<T>} Type guard function
 *
 * @example
 * ```typescript
 * interface User { id: number; name: string; email: string }
 * const isUser = hasProperties<User>(['id', 'name', 'email']);
 * const obj: unknown = { id: 1, name: 'John', email: 'john@example.com' };
 * if (isUser(obj)) {
 *   console.log(obj.name); // Type-safe: User
 * }
 * ```
 */
export declare const hasProperties: <T extends object, K extends keyof T>(keys: K[]) => TypeGuard<T>;
/**
 * Creates a type guard that checks if a value is an array of a specific type.
 *
 * @param {TypeGuard<T>} guard - Type guard for array elements
 * @returns {TypeGuard<T[]>} Array type guard function
 *
 * @example
 * ```typescript
 * const isString = (val: unknown): val is string => typeof val === 'string';
 * const isStringArray = isArrayOf(isString);
 * const arr: unknown = ['a', 'b', 'c'];
 * if (isStringArray(arr)) {
 *   arr.forEach(s => console.log(s.toUpperCase())); // Type-safe: string[]
 * }
 * ```
 */
export declare const isArrayOf: <T>(guard: TypeGuard<T>) => TypeGuard<T[]>;
/**
 * Creates a composite type guard using logical AND.
 *
 * @param {TypeGuard<T>[]} guards - Array of type guards
 * @returns {TypeGuard<T>} Combined type guard
 *
 * @example
 * ```typescript
 * const hasId = hasProperties<{ id: number }>(['id']);
 * const hasName = hasProperties<{ name: string }>(['name']);
 * const isEntity = andGuards([hasId, hasName]);
 * const obj: unknown = { id: 1, name: 'John' };
 * if (isEntity(obj)) {
 *   console.log(obj.id, obj.name); // Type-safe
 * }
 * ```
 */
export declare const andGuards: <T>(guards: TypeGuard<T>[]) => TypeGuard<T>;
/**
 * Creates a branded type value with compile-time type checking.
 *
 * @param {K} value - The value to brand
 * @returns {Brand<K, T>} Branded value
 *
 * @example
 * ```typescript
 * type UserId = Brand<number, 'UserId'>;
 * type ProductId = Brand<number, 'ProductId'>;
 * const userId = brand<number, 'UserId'>(123);
 * const productId = brand<number, 'ProductId'>(456);
 * // userId and productId are not assignable to each other
 * ```
 */
export declare const brand: <K, T extends string>(value: K) => Brand<K, T>;
/**
 * Unwraps a branded type to its underlying value.
 *
 * @param {Brand<K, T>} branded - The branded value
 * @returns {K} Underlying value
 *
 * @example
 * ```typescript
 * type UserId = Brand<number, 'UserId'>;
 * const userId = brand<number, 'UserId'>(123);
 * const rawId = unbrand(userId); // number
 * ```
 */
export declare const unbrand: <K, T>(branded: Brand<K, T>) => K;
/**
 * Creates a nominal type constructor function.
 *
 * @param {(value: T) => boolean} validator - Validation function
 * @returns {(value: T) => Nominal<T, Name>} Constructor function
 *
 * @example
 * ```typescript
 * type PositiveNumber = Nominal<number, 'PositiveNumber'>;
 * const createPositive = createNominal<number, 'PositiveNumber'>(n => n > 0);
 * const positive = createPositive(5); // PositiveNumber
 * // createPositive(-5) would throw
 * ```
 */
export declare const createNominal: <T, Name extends string>(validator: (value: T) => boolean) => ((value: T) => Nominal<T, Name>);
/**
 * Creates a phantom type value (compile-time only marker).
 *
 * @param {T} value - The value to mark with phantom type
 * @returns {Phantom<T, P>} Phantom typed value
 *
 * @example
 * ```typescript
 * type Meters = Phantom<number, 'Meters'>;
 * type Feet = Phantom<number, 'Feet'>;
 * const meters = phantom<number, 'Meters'>(100);
 * const feet = phantom<number, 'Feet'>(328);
 * // meters and feet are not assignable to each other
 * ```
 */
export declare const phantom: <T, P extends string>(value: T) => Phantom<T, P>;
/**
 * Creates a type-safe validator for branded types.
 *
 * @param {(value: K) => boolean} validator - Validation function
 * @returns {(value: K) => Brand<K, T>} Validator function
 *
 * @example
 * ```typescript
 * type Email = Brand<string, 'Email'>;
 * const createEmail = createBrandedValidator<string, 'Email'>(
 *   s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
 * );
 * const email = createEmail('user@example.com'); // Email
 * ```
 */
export declare const createBrandedValidator: <K, T extends string>(validator: (value: K) => boolean) => ((value: K) => Brand<K, T>);
/**
 * Extracts only the required keys from a type.
 *
 * @param {T} obj - Object to extract required properties from
 * @returns {Pick<T, RequiredKeys<T>>} Object with only required properties
 *
 * @example
 * ```typescript
 * type User = { id: number; name: string; email?: string };
 * const user: User = { id: 1, name: 'John', email: 'john@example.com' };
 * const required = extractRequired(user); // { id: number; name: string }
 * ```
 */
export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
export declare const extractRequired: <T extends object>(obj: T) => Pick<T, RequiredKeys<T>>;
/**
 * Creates a deep partial version of a type recursively.
 *
 * @param {T} obj - Object to make deeply partial
 * @returns {DeepPartial<T>} Deeply partial object
 *
 * @example
 * ```typescript
 * type Config = { db: { host: string; port: number }; cache: { ttl: number } };
 * const partial = createDeepPartial<Config>({ db: { host: 'localhost' } });
 * // Type-safe: all properties are optional at all levels
 * ```
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export declare const createDeepPartial: <T>(obj: DeepPartial<T>) => DeepPartial<T>;
/**
 * Makes specific properties of a type readonly.
 *
 * @param {T} obj - Object to make properties readonly
 * @param {K[]} keys - Keys to make readonly
 * @returns {ReadonlyProps<T, K>} Object with readonly properties
 *
 * @example
 * ```typescript
 * type User = { id: number; name: string; email: string };
 * const user = { id: 1, name: 'John', email: 'john@example.com' };
 * const frozen = freezeProps(user, ['id']);
 * // frozen.id is readonly, frozen.name and frozen.email are mutable
 * ```
 */
export type ReadonlyProps<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
export declare const freezeProps: <T extends object, K extends keyof T>(obj: T, keys: K[]) => ReadonlyProps<T, K>;
/**
 * Creates a type with all function properties extracted.
 *
 * @param {T} obj - Object to extract functions from
 * @returns {FunctionProps<T>} Object with only function properties
 *
 * @example
 * ```typescript
 * const obj = { name: 'test', run: () => 'running', count: 42, exec: () => 'done' };
 * const fns = extractFunctions(obj); // { run: () => string; exec: () => string }
 * ```
 */
export type FunctionProps<T> = {
    [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
export declare const extractFunctions: <T extends object>(obj: T) => FunctionProps<T>;
/**
 * Creates a union type of all property value types.
 *
 * @param {T} obj - Object to extract value types from
 * @returns {ValueOf<T>} Union of all value types
 *
 * @example
 * ```typescript
 * type User = { id: number; name: string; active: boolean };
 * type UserValue = ValueOf<User>; // number | string | boolean
 * const getValue = <T extends object>(obj: T, key: keyof T): ValueOf<T> => obj[key];
 * ```
 */
export type ValueOf<T> = T[keyof T];
export declare const getAnyValue: <T extends object>(obj: T, key: keyof T) => ValueOf<T>;
/**
 * Converts a string literal type to camelCase.
 *
 * @param {string} str - String to convert
 * @returns {string} CamelCase string
 *
 * @example
 * ```typescript
 * type EventName = 'user_created' | 'order_updated';
 * type CamelEvent = CamelCase<EventName>; // 'userCreated' | 'orderUpdated'
 * const event = toCamelCase('user_created'); // 'userCreated'
 * ```
 */
export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}` ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}` : Lowercase<S>;
export declare const toCamelCase: (str: string) => string;
/**
 * Creates event handler type names from event names.
 *
 * @param {string} eventName - Event name
 * @returns {string} Handler function name
 *
 * @example
 * ```typescript
 * type Event = 'click' | 'hover' | 'focus';
 * type Handler = EventHandler<Event>; // 'onClick' | 'onHover' | 'onFocus'
 * const handlerName = createEventHandler('click'); // 'onClick'
 * ```
 */
export type EventHandler<T extends string> = `on${Capitalize<T>}`;
export declare const createEventHandler: <T extends string>(eventName: T) => EventHandler<T>;
/**
 * Creates getter/setter method names from property names.
 *
 * @param {string} propName - Property name
 * @param {'get' | 'set'} type - Getter or setter
 * @returns {string} Method name
 *
 * @example
 * ```typescript
 * type Props = 'name' | 'email';
 * type Getter = Getter<Props>; // 'getName' | 'getEmail'
 * type Setter = Setter<Props>; // 'setName' | 'setEmail'
 * const getter = createAccessor('name', 'get'); // 'getName'
 * ```
 */
export type Getter<T extends string> = `get${Capitalize<T>}`;
export type Setter<T extends string> = `set${Capitalize<T>}`;
export declare const createAccessor: <T extends string>(propName: T, type: "get" | "set") => Getter<T> | Setter<T>;
/**
 * Creates a fluent builder for constructing objects step by step.
 *
 * @returns {FluentBuilder<T>} Builder instance
 *
 * @example
 * ```typescript
 * interface User { id: number; name: string; email: string }
 * const user = createBuilder<User>()
 *   .with('id', 1)
 *   .with('name', 'John')
 *   .with('email', 'john@example.com')
 *   .build();
 * ```
 */
export interface FluentBuilder<T> {
    with<K extends keyof T>(key: K, value: T[K]): FluentBuilder<T>;
    build(): T;
}
export declare const createBuilder: <T extends object>() => FluentBuilder<T>;
/**
 * Creates a builder with required fields validation.
 *
 * @param {K[]} requiredKeys - Required field keys
 * @returns {ValidatedBuilder<T, K>} Validated builder instance
 *
 * @example
 * ```typescript
 * interface User { id: number; name: string; email?: string }
 * const user = createValidatedBuilder<User, 'id' | 'name'>(['id', 'name'])
 *   .with('id', 1)
 *   .with('name', 'John')
 *   .build(); // Ensures id and name are set
 * ```
 */
export interface ValidatedBuilder<T, K extends keyof T> {
    with<P extends keyof T>(key: P, value: T[P]): ValidatedBuilder<T, K>;
    build(): T;
}
export declare const createValidatedBuilder: <T extends object, K extends keyof T>(requiredKeys: K[]) => ValidatedBuilder<T, K>;
/**
 * Creates a builder with method chaining for nested objects.
 *
 * @returns {NestedBuilder<T>} Nested builder instance
 *
 * @example
 * ```typescript
 * interface Address { street: string; city: string }
 * interface User { name: string; address: Address }
 * const user = createNestedBuilder<User>()
 *   .set('name', 'John')
 *   .nest('address', addr => addr.set('street', '123 Main').set('city', 'NYC'))
 *   .build();
 * ```
 */
export interface NestedBuilder<T> {
    set<K extends keyof T>(key: K, value: T[K]): NestedBuilder<T>;
    nest<K extends keyof T>(key: K, builderFn: (builder: NestedBuilder<T[K]>) => NestedBuilder<T[K]>): NestedBuilder<T>;
    build(): T;
}
export declare const createNestedBuilder: <T extends object>() => NestedBuilder<T>;
/**
 * Creates a copy-on-write builder from an existing object.
 *
 * @param {T} initial - Initial object to clone
 * @returns {CopyBuilder<T>} Copy builder instance
 *
 * @example
 * ```typescript
 * const original = { id: 1, name: 'John', email: 'john@example.com' };
 * const updated = createCopyBuilder(original)
 *   .update('name', 'Jane')
 *   .update('email', 'jane@example.com')
 *   .build();
 * ```
 */
export interface CopyBuilder<T> {
    update<K extends keyof T>(key: K, value: T[K]): CopyBuilder<T>;
    build(): T;
}
export declare const createCopyBuilder: <T extends object>(initial: T) => CopyBuilder<T>;
/**
 * Creates a fluent interface wrapper around any object.
 *
 * @param {T} target - Target object to wrap
 * @returns {Fluent<T>} Fluent interface wrapper
 *
 * @example
 * ```typescript
 * const calculator = { value: 0 };
 * const fluent = createFluent(calculator)
 *   .do(c => c.value += 5)
 *   .do(c => c.value *= 2)
 *   .unwrap(); // { value: 10 }
 * ```
 */
export interface Fluent<T> {
    do(fn: (target: T) => void): Fluent<T>;
    map<R>(fn: (target: T) => R): Fluent<R>;
    unwrap(): T;
}
export declare const createFluent: <T>(target: T) => Fluent<T>;
/**
 * Creates a chainable API for method invocations.
 *
 * @param {T} obj - Object with methods to chain
 * @returns {Chainable<T>} Chainable interface
 *
 * @example
 * ```typescript
 * class Logger {
 *   log(msg: string) { console.log(msg); }
 *   error(msg: string) { console.error(msg); }
 * }
 * const logger = createChain(new Logger())
 *   .call('log', 'Info message')
 *   .call('error', 'Error message')
 *   .end();
 * ```
 */
export interface Chainable<T> {
    call<K extends keyof T>(method: K, ...args: T[K] extends (...args: any[]) => any ? Parameters<T[K]> : never): Chainable<T>;
    end(): T;
}
export declare const createChain: <T extends object>(obj: T) => Chainable<T>;
/**
 * Creates a pipeline for function composition with fluent API.
 *
 * @param {T} initial - Initial value
 * @returns {Pipeline<T>} Pipeline instance
 *
 * @example
 * ```typescript
 * const result = createPipeline(5)
 *   .pipe(x => x * 2)
 *   .pipe(x => x + 3)
 *   .pipe(x => x.toString())
 *   .execute(); // '13'
 * ```
 */
export interface Pipeline<T> {
    pipe<R>(fn: (value: T) => R): Pipeline<R>;
    execute(): T;
}
export declare const createPipeline: <T>(initial: T) => Pipeline<T>;
/**
 * Creates a logging proxy that logs all property accesses.
 *
 * @param {T} target - Target object to proxy
 * @param {(prop: string, value: any) => void} logger - Logger function
 * @returns {T} Proxied object
 *
 * @example
 * ```typescript
 * const user = { name: 'John', age: 30 };
 * const logged = createLoggingProxy(user, (prop, val) => console.log(`${prop}: ${val}`));
 * const name = logged.name; // Logs: "name: John"
 * ```
 */
export declare const createLoggingProxy: <T extends object>(target: T, logger: (prop: string, value: any) => void) => T;
/**
 * Creates a validation proxy that validates property assignments.
 *
 * @param {T} target - Target object to proxy
 * @param {Record<keyof T, (value: any) => boolean>} validators - Validators per property
 * @returns {T} Validated proxy
 *
 * @example
 * ```typescript
 * const user = { name: '', age: 0 };
 * const validated = createValidationProxy(user, {
 *   name: (v) => typeof v === 'string' && v.length > 0,
 *   age: (v) => typeof v === 'number' && v >= 0
 * });
 * validated.age = 25; // OK
 * validated.age = -5; // Throws error
 * ```
 */
export declare const createValidationProxy: <T extends object>(target: T, validators: Partial<Record<keyof T, (value: any) => boolean>>) => T;
/**
 * Creates a lazy-loading proxy that initializes properties on first access.
 *
 * @param {Record<keyof T, () => T[keyof T]>} factories - Factory functions per property
 * @returns {T} Lazy-loading proxy
 *
 * @example
 * ```typescript
 * interface Config { db: Database; cache: Cache }
 * const config = createLazyProxy<Config>({
 *   db: () => new Database(),
 *   cache: () => new Cache()
 * });
 * const db = config.db; // Database initialized only when accessed
 * ```
 */
export declare const createLazyProxy: <T extends object>(factories: Record<keyof T, () => T[keyof T]>) => T;
/**
 * Memoizes a function with configurable cache.
 *
 * @param {F} fn - Function to memoize
 * @param {MemoizeOptions} options - Memoization options
 * @returns {F} Memoized function
 *
 * @example
 * ```typescript
 * const fibonacci = memoize((n: number): number => {
 *   if (n <= 1) return n;
 *   return fibonacci(n - 1) + fibonacci(n - 2);
 * }, { maxSize: 100 });
 * const result = fibonacci(40); // Cached for performance
 * ```
 */
export declare const memoize: <F extends (...args: any[]) => any>(fn: F, options?: MemoizeOptions) => F;
/**
 * Memoizes a single-argument function with WeakMap for automatic garbage collection.
 *
 * @param {(arg: T) => R} fn - Function to memoize
 * @returns {(arg: T) => R} Memoized function
 *
 * @example
 * ```typescript
 * const processUser = memoizeWeak((user: User) => {
 *   return expensiveTransformation(user);
 * });
 * const result = processUser(user); // Cached per user object
 * ```
 */
export declare const memoizeWeak: <T extends object, R>(fn: (arg: T) => R) => ((arg: T) => R);
/**
 * Creates a memoized async function with promise caching.
 *
 * @param {(...args: A) => Promise<R>} fn - Async function to memoize
 * @returns {(...args: A) => Promise<R>} Memoized async function
 *
 * @example
 * ```typescript
 * const fetchUser = memoizeAsync(async (id: number) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * });
 * const user = await fetchUser(1); // Cached promise
 * ```
 */
export declare const memoizeAsync: <A extends any[], R>(fn: (...args: A) => Promise<R>) => ((...args: A) => Promise<R>);
/**
 * Curries a function of any arity.
 *
 * @param {F} fn - Function to curry
 * @returns {Curried} Curried function
 *
 * @example
 * ```typescript
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * const result = curriedAdd(1)(2)(3); // 6
 * const addFive = curriedAdd(5);
 * const addFiveAndThree = addFive(3);
 * ```
 */
export declare const curry: <F extends (...args: any[]) => any>(fn: F) => any;
/**
 * Composes functions from right to left.
 *
 * @param {...Array<Function>} fns - Functions to compose
 * @returns {Function} Composed function
 *
 * @example
 * ```typescript
 * const add5 = (x: number) => x + 5;
 * const multiply2 = (x: number) => x * 2;
 * const subtract3 = (x: number) => x - 3;
 * const composed = compose(subtract3, multiply2, add5);
 * const result = composed(10); // ((10 + 5) * 2) - 3 = 27
 * ```
 */
export declare const compose: <R>(...fns: Array<(arg: any) => any>) => ((arg: any) => R);
/**
 * Pipes functions from left to right.
 *
 * @param {...Array<Function>} fns - Functions to pipe
 * @returns {Function} Piped function
 *
 * @example
 * ```typescript
 * const add5 = (x: number) => x + 5;
 * const multiply2 = (x: number) => x * 2;
 * const subtract3 = (x: number) => x - 3;
 * const piped = pipe(add5, multiply2, subtract3);
 * const result = piped(10); // ((10 + 5) * 2) - 3 = 27
 * ```
 */
export declare const pipe: <T, R>(...fns: Array<(arg: any) => any>) => ((arg: T) => R);
/**
 * Creates a partial application of a function.
 *
 * @param {F} fn - Function to partially apply
 * @param {...Partial<Parameters<F>>} args - Partial arguments
 * @returns {Function} Partially applied function
 *
 * @example
 * ```typescript
 * const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
 * const sayHello = partial(greet, 'Hello');
 * const message = sayHello('John'); // "Hello, John!"
 * ```
 */
export declare const partial: <F extends (...args: any[]) => any>(fn: F, ...args: Partial<Parameters<F>>) => ((...remainingArgs: any[]) => ReturnType<F>);
/**
 * Creates a Maybe monad for handling nullable values.
 *
 * @param {T | null | undefined} value - Value to wrap
 * @returns {Maybe<T>} Maybe monad
 *
 * @example
 * ```typescript
 * const maybeUser = createMaybe<User>(getUser());
 * const userName = maybeUser
 *   .map(user => user.name)
 *   .map(name => name.toUpperCase())
 *   .getOrElse('Unknown');
 * ```
 */
export declare const createMaybe: <T>(value: T | null | undefined) => Maybe<T>;
/**
 * Creates an Either monad for error handling.
 *
 * @param {L | null} left - Left value (error)
 * @param {R | null} right - Right value (success)
 * @returns {Either<L, R>} Either monad
 *
 * @example
 * ```typescript
 * const parseNumber = (str: string): Either<Error, number> => {
 *   const num = parseInt(str);
 *   return isNaN(num)
 *     ? createEither(new Error('Invalid number'), null)
 *     : createEither(null, num);
 * };
 * const result = parseNumber('42').fold(
 *   err => `Error: ${err.message}`,
 *   num => `Success: ${num}`
 * );
 * ```
 */
export declare const createEither: <L, R>(left: L | null, right: R | null) => Either<L, R>;
/**
 * Creates a Result monad for operations that can fail.
 *
 * @param {boolean} success - Whether operation succeeded
 * @param {T | E} value - Success value or error
 * @returns {Result<T, E>} Result monad
 *
 * @example
 * ```typescript
 * const divide = (a: number, b: number): Result<number, string> => {
 *   return b === 0
 *     ? createResult(false, 'Division by zero')
 *     : createResult(true, a / b);
 * };
 * const result = divide(10, 2).match(
 *   value => `Result: ${value}`,
 *   error => `Error: ${error}`
 * );
 * ```
 */
export interface Result<T, E> {
    isSuccess(): boolean;
    isFailure(): boolean;
    match<R>(onSuccess: (value: T) => R, onFailure: (error: E) => R): R;
}
export declare const createResult: <T, E>(success: boolean, value: T | E) => Result<T, E>;
/**
 * Creates a Task monad for lazy async computations.
 *
 * @param {() => Promise<T>} computation - Lazy computation
 * @returns {Task<T>} Task monad
 *
 * @example
 * ```typescript
 * const fetchData = createTask(() => fetch('/api/data').then(r => r.json()));
 * const result = await fetchData
 *   .map(data => data.items)
 *   .map(items => items.length)
 *   .run();
 * ```
 */
export interface Task<T> {
    map<U>(fn: (value: T) => U): Task<U>;
    flatMap<U>(fn: (value: T) => Task<U>): Task<U>;
    run(): Promise<T>;
}
export declare const createTask: <T>(computation: () => Promise<T>) => Task<T>;
export declare const createSymbolWithMetadata: <M>(description: string, metadata: M) => symbol;
export declare const getSymbolMetadata: <M>(sym: symbol) => M | undefined;
export declare const createMetadataDecorator: (key: string, value: any) => (target: any, propertyKey?: string | symbol) => void;
export declare const getMetadata: (target: any, propertyKey: string | symbol, key: string) => any;
/**
 * Creates a reflection utility for runtime type information.
 *
 * @param {T} obj - Object to reflect
 * @returns {Reflection<T>} Reflection utility
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'John', email: 'john@example.com' };
 * const reflection = createReflection(user);
 * const keys = reflection.getKeys(); // ['id', 'name', 'email']
 * const types = reflection.getTypes(); // { id: 'number', name: 'string', email: 'string' }
 * ```
 */
export interface Reflection<T> {
    getKeys(): Array<keyof T>;
    getTypes(): Record<keyof T, string>;
    hasProperty(key: keyof T): boolean;
    getPropertyValue<K extends keyof T>(key: K): T[K];
}
export declare const createReflection: <T extends object>(obj: T) => Reflection<T>;
/**
 * Creates a trampolined function for stack-safe recursion.
 *
 * @param {(...args: A) => Trampoline<R>} fn - Trampolined function
 * @returns {(...args: A) => R} Stack-safe function
 *
 * @example
 * ```typescript
 * const factorial = trampoline((n: number, acc = 1): any => {
 *   if (n <= 1) return acc;
 *   return () => factorial(n - 1, n * acc);
 * });
 * const result = factorial(10000); // No stack overflow
 * ```
 */
export type Trampoline<T> = T | (() => Trampoline<T>);
export declare const trampoline: <A extends any[], R>(fn: (...args: A) => Trampoline<R>) => ((...args: A) => R);
/**
 * Creates a lens for immutable nested property access and updates.
 *
 * @param {(obj: S) => A} getter - Property getter function
 * @param {(val: A, obj: S) => S} setter - Property setter function
 * @returns {Lens<S, A>} Lens object
 *
 * @example
 * ```typescript
 * interface User { name: string; address: { city: string } }
 * const cityLens = createLens<User, string>(
 *   user => user.address.city,
 *   (city, user) => ({ ...user, address: { ...user.address, city } })
 * );
 * const user = { name: 'John', address: { city: 'NYC' } };
 * const updated = cityLens.set('LA', user);
 * ```
 */
export interface Lens<S, A> {
    get(obj: S): A;
    set(val: A, obj: S): S;
    modify(fn: (val: A) => A, obj: S): S;
}
export declare const createLens: <S, A>(getter: (obj: S) => A, setter: (val: A, obj: S) => S) => Lens<S, A>;
/**
 * Creates a transducer for efficient data transformations.
 *
 * @param {(value: T) => U} mapper - Transformation function
 * @returns {Transducer<T, U>} Transducer function
 *
 * @example
 * ```typescript
 * const doubleTransducer = createTransducer((x: number) => x * 2);
 * const filterEvenTransducer = createTransducer((x: number) => x % 2 === 0 ? x : null);
 * const data = [1, 2, 3, 4, 5];
 * const result = transduce(compose(doubleTransducer, filterEvenTransducer), data);
 * ```
 */
export type Transducer<T, U> = (reducer: (acc: U[], val: U) => U[]) => (acc: U[], val: T) => U[];
export declare const createTransducer: <T, U>(mapper: (value: T) => U | null) => Transducer<T, U>;
export declare const transduce: <T, U>(transducer: Transducer<T, U>, data: T[]) => U[];
//# sourceMappingURL=typescript-advanced-patterns-kit.d.ts.map