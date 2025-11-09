"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transduce = exports.createTransducer = exports.createLens = exports.trampoline = exports.createReflection = exports.getMetadata = exports.createMetadataDecorator = exports.getSymbolMetadata = exports.createSymbolWithMetadata = exports.createTask = exports.createResult = exports.createEither = exports.createMaybe = exports.partial = exports.pipe = exports.compose = exports.curry = exports.memoizeAsync = exports.memoizeWeak = exports.memoize = exports.createLazyProxy = exports.createValidationProxy = exports.createLoggingProxy = exports.createPipeline = exports.createChain = exports.createFluent = exports.createCopyBuilder = exports.createNestedBuilder = exports.createValidatedBuilder = exports.createBuilder = exports.createAccessor = exports.createEventHandler = exports.toCamelCase = exports.getAnyValue = exports.extractFunctions = exports.freezeProps = exports.createDeepPartial = exports.extractRequired = exports.createBrandedValidator = exports.phantom = exports.createNominal = exports.unbrand = exports.brand = exports.andGuards = exports.isArrayOf = exports.hasProperties = exports.createDiscriminatorGuard = exports.isDefined = void 0;
// ============================================================================
// SECTION 1: TYPE GUARDS & PREDICATES (Functions 1-5)
// ============================================================================
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
const isDefined = (value) => {
    return value !== null && value !== undefined;
};
exports.isDefined = isDefined;
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
const createDiscriminatorGuard = (discriminator, value) => {
    return (obj) => {
        return (typeof obj === 'object' &&
            obj !== null &&
            discriminator in obj &&
            obj[discriminator] === value);
    };
};
exports.createDiscriminatorGuard = createDiscriminatorGuard;
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
const hasProperties = (keys) => {
    return (obj) => {
        if (typeof obj !== 'object' || obj === null)
            return false;
        return keys.every((key) => key in obj);
    };
};
exports.hasProperties = hasProperties;
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
const isArrayOf = (guard) => {
    return (arr) => {
        return Array.isArray(arr) && arr.every(guard);
    };
};
exports.isArrayOf = isArrayOf;
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
const andGuards = (guards) => {
    return (value) => {
        return guards.every((guard) => guard(value));
    };
};
exports.andGuards = andGuards;
// ============================================================================
// SECTION 2: BRANDED & PHANTOM TYPES (Functions 6-10)
// ============================================================================
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
const brand = (value) => {
    return value;
};
exports.brand = brand;
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
const unbrand = (branded) => {
    return branded;
};
exports.unbrand = unbrand;
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
const createNominal = (validator) => {
    return (value) => {
        if (!validator(value)) {
            throw new Error('Invalid value for nominal type');
        }
        return value;
    };
};
exports.createNominal = createNominal;
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
const phantom = (value) => {
    return value;
};
exports.phantom = phantom;
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
const createBrandedValidator = (validator) => {
    return (value) => {
        if (!validator(value)) {
            throw new Error('Validation failed for branded type');
        }
        return (0, exports.brand)(value);
    };
};
exports.createBrandedValidator = createBrandedValidator;
const extractRequired = (obj) => {
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
};
exports.extractRequired = extractRequired;
const createDeepPartial = (obj) => {
    return obj;
};
exports.createDeepPartial = createDeepPartial;
const freezeProps = (obj, keys) => {
    const frozen = { ...obj };
    keys.forEach((key) => {
        Object.defineProperty(frozen, key, {
            writable: false,
            configurable: false,
        });
    });
    return frozen;
};
exports.freezeProps = freezeProps;
const extractFunctions = (obj) => {
    const result = {};
    for (const key in obj) {
        if (typeof obj[key] === 'function') {
            result[key] = obj[key];
        }
    }
    return result;
};
exports.extractFunctions = extractFunctions;
const getAnyValue = (obj, key) => {
    return obj[key];
};
exports.getAnyValue = getAnyValue;
const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
exports.toCamelCase = toCamelCase;
const createEventHandler = (eventName) => {
    return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
};
exports.createEventHandler = createEventHandler;
const createAccessor = (propName, type) => {
    const capitalized = propName.charAt(0).toUpperCase() + propName.slice(1);
    return `${type}${capitalized}`;
};
exports.createAccessor = createAccessor;
const createBuilder = () => {
    const data = {};
    const builder = {
        with(key, value) {
            data[key] = value;
            return builder;
        },
        build() {
            return data;
        },
    };
    return builder;
};
exports.createBuilder = createBuilder;
const createValidatedBuilder = (requiredKeys) => {
    const data = {};
    const builder = {
        with(key, value) {
            data[key] = value;
            return builder;
        },
        build() {
            for (const key of requiredKeys) {
                if (!(key in data)) {
                    throw new Error(`Required field '${String(key)}' is missing`);
                }
            }
            return data;
        },
    };
    return builder;
};
exports.createValidatedBuilder = createValidatedBuilder;
const createNestedBuilder = () => {
    const data = {};
    const builder = {
        set(key, value) {
            data[key] = value;
            return builder;
        },
        nest(key, builderFn) {
            const nestedBuilder = (0, exports.createNestedBuilder)();
            data[key] = builderFn(nestedBuilder).build();
            return builder;
        },
        build() {
            return data;
        },
    };
    return builder;
};
exports.createNestedBuilder = createNestedBuilder;
const createCopyBuilder = (initial) => {
    const data = { ...initial };
    const builder = {
        update(key, value) {
            data[key] = value;
            return builder;
        },
        build() {
            return { ...data };
        },
    };
    return builder;
};
exports.createCopyBuilder = createCopyBuilder;
const createFluent = (target) => {
    return {
        do(fn) {
            fn(target);
            return (0, exports.createFluent)(target);
        },
        map(fn) {
            return (0, exports.createFluent)(fn(target));
        },
        unwrap() {
            return target;
        },
    };
};
exports.createFluent = createFluent;
const createChain = (obj) => {
    return {
        call(method, ...args) {
            if (typeof obj[method] === 'function') {
                obj[method](...args);
            }
            return (0, exports.createChain)(obj);
        },
        end() {
            return obj;
        },
    };
};
exports.createChain = createChain;
const createPipeline = (initial) => {
    return {
        pipe(fn) {
            return (0, exports.createPipeline)(fn(initial));
        },
        execute() {
            return initial;
        },
    };
};
exports.createPipeline = createPipeline;
// ============================================================================
// SECTION 7: PROXY PATTERN UTILITIES (Functions 26-28)
// ============================================================================
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
const createLoggingProxy = (target, logger) => {
    return new Proxy(target, {
        get(obj, prop) {
            const value = obj[prop];
            logger(String(prop), value);
            return value;
        },
    });
};
exports.createLoggingProxy = createLoggingProxy;
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
const createValidationProxy = (target, validators) => {
    return new Proxy(target, {
        set(obj, prop, value) {
            const validator = validators[prop];
            if (validator && !validator(value)) {
                throw new Error(`Validation failed for property '${String(prop)}'`);
            }
            obj[prop] = value;
            return true;
        },
    });
};
exports.createValidationProxy = createValidationProxy;
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
const createLazyProxy = (factories) => {
    const cache = {};
    return new Proxy({}, {
        get(_, prop) {
            const key = prop;
            if (!(key in cache)) {
                cache[key] = factories[key]();
            }
            return cache[key];
        },
    });
};
exports.createLazyProxy = createLazyProxy;
// ============================================================================
// SECTION 8: MEMOIZATION UTILITIES (Functions 29-31)
// ============================================================================
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
const memoize = (fn, options = {}) => {
    const maxSize = Math.min(options.maxSize || 1000, 10000); // Cap at 10k entries
    const { ttl, keyGenerator = JSON.stringify } = options;
    const cache = new Map();
    return ((...args) => {
        const key = keyGenerator(...args);
        const cached = cache.get(key);
        if (cached) {
            if (!ttl || Date.now() - cached.timestamp < ttl) {
                return cached.value;
            }
            cache.delete(key);
        }
        const value = fn(...args);
        cache.set(key, { value, timestamp: Date.now() });
        // Use LRU eviction when cache is full
        if (cache.size > maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
                cache.delete(firstKey);
            }
        }
        return value;
    });
};
exports.memoize = memoize;
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
const memoizeWeak = (fn) => {
    const cache = new WeakMap();
    return (arg) => {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
};
exports.memoizeWeak = memoizeWeak;
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
const memoizeAsync = (fn) => {
    const cache = new Map();
    return async (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const promise = fn(...args);
        cache.set(key, promise);
        return promise;
    };
};
exports.memoizeAsync = memoizeAsync;
// ============================================================================
// SECTION 9: CURRYING & COMPOSITION (Functions 32-35)
// ============================================================================
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
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...nextArgs) => curried(...args, ...nextArgs);
    };
};
exports.curry = curry;
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
const compose = (...fns) => {
    return (arg) => {
        return fns.reduceRight((acc, fn) => fn(acc), arg);
    };
};
exports.compose = compose;
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
const pipe = (...fns) => {
    return (arg) => {
        return fns.reduce((acc, fn) => fn(acc), arg);
    };
};
exports.pipe = pipe;
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
const partial = (fn, ...args) => {
    return (...remainingArgs) => {
        return fn(...args, ...remainingArgs);
    };
};
exports.partial = partial;
// ============================================================================
// SECTION 10: MONAD UTILITIES (Functions 36-39)
// ============================================================================
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
const createMaybe = (value) => {
    const isPresent = value !== null && value !== undefined;
    return {
        isPresent: () => isPresent,
        getOrElse: (defaultValue) => (isPresent ? value : defaultValue),
        map: (fn) => {
            return isPresent ? (0, exports.createMaybe)(fn(value)) : (0, exports.createMaybe)(null);
        },
        flatMap: (fn) => {
            return isPresent ? fn(value) : (0, exports.createMaybe)(null);
        },
    };
};
exports.createMaybe = createMaybe;
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
const createEither = (left, right) => {
    return {
        isLeft: () => left !== null,
        isRight: () => right !== null,
        fold: (onLeft, onRight) => {
            return left !== null ? onLeft(left) : onRight(right);
        },
    };
};
exports.createEither = createEither;
const createResult = (success, value) => {
    return {
        isSuccess: () => success,
        isFailure: () => !success,
        match: (onSuccess, onFailure) => {
            return success ? onSuccess(value) : onFailure(value);
        },
    };
};
exports.createResult = createResult;
const createTask = (computation) => {
    return {
        map: (fn) => {
            return (0, exports.createTask)(() => computation().then(fn));
        },
        flatMap: (fn) => {
            return (0, exports.createTask)(() => computation().then((value) => fn(value).run()));
        },
        run: () => computation(),
    };
};
exports.createTask = createTask;
// ============================================================================
// SECTION 11: SYMBOL & METADATA UTILITIES (Functions 40-42)
// ============================================================================
/**
 * Creates a unique symbol with metadata.
 *
 * @param {string} description - Symbol description
 * @param {M} metadata - Attached metadata
 * @returns {symbol} Symbol with metadata
 *
 * @example
 * ```typescript
 * const USER_ID = createSymbolWithMetadata('userId', { type: 'identifier', version: 1 });
 * const metadata = getSymbolMetadata(USER_ID);
 * ```
 */
const symbolMetadataMap = new Map();
const createSymbolWithMetadata = (description, metadata) => {
    const sym = Symbol(description);
    symbolMetadataMap.set(sym, metadata);
    return sym;
};
exports.createSymbolWithMetadata = createSymbolWithMetadata;
const getSymbolMetadata = (sym) => {
    return symbolMetadataMap.get(sym);
};
exports.getSymbolMetadata = getSymbolMetadata;
/**
 * Creates a metadata decorator for classes and properties.
 *
 * @param {string} key - Metadata key
 * @param {any} value - Metadata value
 * @returns {Function} Decorator function
 *
 * @example
 * ```typescript
 * const Serializable = createMetadataDecorator('serializable', true);
 * class User {
 *   @Serializable
 *   name: string;
 * }
 * const metadata = getMetadata(User.prototype, 'name', 'serializable');
 * ```
 */
const metadataStore = new WeakMap();
const createMetadataDecorator = (key, value) => {
    return (target, propertyKey) => {
        if (!metadataStore.has(target)) {
            metadataStore.set(target, new Map());
        }
        const targetMetadata = metadataStore.get(target);
        const propKey = propertyKey || '__class__';
        if (!targetMetadata.has(propKey)) {
            targetMetadata.set(propKey, new Map());
        }
        targetMetadata.get(propKey).set(key, value);
    };
};
exports.createMetadataDecorator = createMetadataDecorator;
const getMetadata = (target, propertyKey, key) => {
    return metadataStore.get(target)?.get(propertyKey)?.get(key);
};
exports.getMetadata = getMetadata;
const createReflection = (obj) => {
    return {
        getKeys: () => {
            return Object.keys(obj);
        },
        getTypes: () => {
            const types = {};
            for (const key in obj) {
                types[key] = typeof obj[key];
            }
            return types;
        },
        hasProperty: (key) => {
            return key in obj;
        },
        getPropertyValue: (key) => {
            return obj[key];
        },
    };
};
exports.createReflection = createReflection;
const trampoline = (fn) => {
    return (...args) => {
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
};
exports.trampoline = trampoline;
const createLens = (getter, setter) => {
    return {
        get: (obj) => getter(obj),
        set: (val, obj) => setter(val, obj),
        modify: (fn, obj) => setter(fn(getter(obj)), obj),
    };
};
exports.createLens = createLens;
const createTransducer = (mapper) => {
    return (reducer) => {
        return (acc, val) => {
            const mapped = mapper(val);
            return mapped !== null ? reducer(acc, mapped) : acc;
        };
    };
};
exports.createTransducer = createTransducer;
const transduce = (transducer, data) => {
    const reducer = (acc, val) => [...acc, val];
    const xform = transducer(reducer);
    return data.reduce((acc, val) => xform(acc, val), []);
};
exports.transduce = transduce;
//# sourceMappingURL=typescript-advanced-patterns-kit.js.map