"use strict";
/**
 * TypeScript Essential Utilities
 *
 * A comprehensive collection of 40 production-ready TypeScript utility functions
 * for everyday development tasks. Includes type guards, object manipulation,
 * array helpers, and function composition utilities.
 *
 * @module typescript-utils
 * @target TypeScript 5.x, Node 18+
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.asConst = asConst;
exports.asReadonly = asReadonly;
exports.asMutable = asMutable;
exports.asNonNullable = asNonNullable;
exports.asPartial = asPartial;
exports.identity = identity;
exports.noop = noop;
exports.constant = constant;
exports.tryCatch = tryCatch;
exports.memoize = memoize;
exports.pick = pick;
exports.omit = omit;
exports.merge = merge;
exports.clone = clone;
exports.freeze = freeze;
exports.entries = entries;
exports.keys = keys;
exports.values = values;
exports.first = first;
exports.last = last;
exports.chunk = chunk;
exports.unique = unique;
exports.flatten = flatten;
exports.zip = zip;
exports.pipe = pipe;
exports.compose = compose;
exports.curry = curry;
exports.debounce = debounce;
exports.isDefined = isDefined;
exports.isPresent = isPresent;
exports.assertNever = assertNever;
exports.match = match;
// ============================================================================
// Type Guards & Type Checking
// ============================================================================
/**
 * Type guard to check if a value is a string
 *
 * @param value - Value to check
 * @returns True if value is a string
 *
 * @example
 * ```ts
 * const value: unknown = "hello";
 * if (isString(value)) {
 *   console.log(value.toUpperCase()); // TypeScript knows value is string
 * }
 * ```
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * Type guard to check if a value is a number (excluding NaN)
 *
 * @param value - Value to check
 * @returns True if value is a valid number
 *
 * @example
 * ```ts
 * isNumber(42);        // true
 * isNumber(NaN);       // false
 * isNumber("42");      // false
 * ```
 */
function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
/**
 * Type guard to check if a value is a boolean
 *
 * @param value - Value to check
 * @returns True if value is a boolean
 *
 * @example
 * ```ts
 * isBoolean(true);     // true
 * isBoolean(false);    // true
 * isBoolean(1);        // false
 * ```
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Type guard to check if a value is a non-null object
 *
 * @param value - Value to check
 * @returns True if value is an object (not null, not array)
 *
 * @example
 * ```ts
 * isObject({});        // true
 * isObject(null);      // false
 * isObject([]);        // false
 * ```
 */
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Enhanced array type guard with element type checking
 *
 * @param value - Value to check
 * @param elementGuard - Optional guard to check each element
 * @returns True if value is an array (with optional element type validation)
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]);                    // true
 * isArray([1, 2, 3], isNumber);          // true
 * isArray([1, "2", 3], isNumber);        // false
 * ```
 */
function isArray(value, elementGuard) {
    if (!Array.isArray(value)) {
        return false;
    }
    if (elementGuard) {
        return value.every(elementGuard);
    }
    return true;
}
/**
 * Type guard to check if a value is a function
 *
 * @param value - Value to check
 * @returns True if value is a function
 *
 * @example
 * ```ts
 * isFunction(() => {});     // true
 * isFunction(function() {}); // true
 * isFunction({});            // false
 * ```
 */
function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Type guard to check if a value is null
 *
 * @param value - Value to check
 * @returns True if value is null
 *
 * @example
 * ```ts
 * isNull(null);        // true
 * isNull(undefined);   // false
 * isNull(0);           // false
 * ```
 */
function isNull(value) {
    return value === null;
}
/**
 * Type guard to check if a value is undefined
 *
 * @param value - Value to check
 * @returns True if value is undefined
 *
 * @example
 * ```ts
 * isUndefined(undefined);  // true
 * isUndefined(null);       // false
 * isUndefined(0);          // false
 * ```
 */
function isUndefined(value) {
    return value === undefined;
}
// ============================================================================
// Type Transformation Helpers
// ============================================================================
/**
 * Type-level const assertion helper
 * Returns the value with const assertion applied
 *
 * @param value - Value to make const
 * @returns The same value with const assertion
 *
 * @example
 * ```ts
 * const arr = asConst([1, 2, 3]);  // readonly [1, 2, 3]
 * const obj = asConst({ x: 1 });   // { readonly x: 1 }
 * ```
 */
function asConst(value) {
    return value;
}
/**
 * Convert a value to a readonly version
 *
 * @param value - Value to make readonly
 * @returns Readonly version of the value
 *
 * @example
 * ```ts
 * const obj = asReadonly({ x: 1, y: 2 });
 * // obj: Readonly<{ x: number; y: number }>
 * ```
 */
function asReadonly(value) {
    return Object.freeze({ ...value });
}
/**
 * Remove readonly modifiers from a type
 *
 * @param value - Readonly value to make mutable
 * @returns Mutable version of the value
 *
 * @example
 * ```ts
 * const readonlyObj: Readonly<{ x: number }> = { x: 1 };
 * const mutableObj = asMutable(readonlyObj);
 * mutableObj.x = 2; // OK
 * ```
 */
function asMutable(value) {
    return { ...value };
}
/**
 * Remove null and undefined from a type
 *
 * @param value - Value that may be null or undefined
 * @returns Non-nullable version of the value
 * @throws Error if value is null or undefined
 *
 * @example
 * ```ts
 * const x: string | null = "hello";
 * const y = asNonNullable(x);  // string
 * ```
 */
function asNonNullable(value) {
    if (value === null || value === undefined) {
        throw new Error('Value is null or undefined');
    }
    return value;
}
/**
 * Make all properties of a type optional
 *
 * @param value - Value to make partial
 * @returns Partial version of the value
 *
 * @example
 * ```ts
 * interface User { name: string; age: number; }
 * const partial = asPartial({ name: "John" } as User);
 * // partial: Partial<User>
 * ```
 */
function asPartial(value) {
    return { ...value };
}
// ============================================================================
// Generic Type Utilities
// ============================================================================
/**
 * Generic identity function - returns the input unchanged
 *
 * @param value - Value to return
 * @returns The same value
 *
 * @example
 * ```ts
 * identity(42);        // 42
 * identity("hello");   // "hello"
 * identity({ x: 1 });  // { x: 1 }
 * ```
 */
function identity(value) {
    return value;
}
/**
 * No-operation function - does nothing and returns undefined
 *
 * @example
 * ```ts
 * const callback = shouldLog ? log : noop;
 * callback("message"); // Safe even when shouldLog is false
 * ```
 */
function noop() {
    // Intentionally empty
}
/**
 * Creates a function that always returns the given value
 *
 * @param value - Value to return
 * @returns Function that returns the value
 *
 * @example
 * ```ts
 * const getFortyTwo = constant(42);
 * getFortyTwo();  // 42
 * getFortyTwo();  // 42
 * ```
 */
function constant(value) {
    return () => value;
}
/**
 * Type-safe try-catch wrapper
 *
 * @param fn - Function to execute
 * @param onError - Error handler function
 * @returns Result of fn or error handler
 *
 * @example
 * ```ts
 * const result = tryCatch(
 *   () => JSON.parse(input),
 *   (error) => ({ error: error.message })
 * );
 * ```
 */
function tryCatch(fn, onError) {
    try {
        return fn();
    }
    catch (error) {
        return onError(error);
    }
}
/**
 * Generic memoization function with type safety
 *
 * @param fn - Function to memoize
 * @returns Memoized version of the function
 *
 * @example
 * ```ts
 * const expensiveCalc = (n: number) => {
 *   console.log("Computing...");
 *   return n * n;
 * };
 * const memoized = memoize(expensiveCalc);
 * memoized(5);  // "Computing..." then 25
 * memoized(5);  // 25 (cached, no log)
 * ```
 */
function memoize(fn) {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}
// ============================================================================
// Type-Safe Object Manipulation
// ============================================================================
/**
 * Type-safe object property picking
 *
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only the specified keys
 *
 * @example
 * ```ts
 * const user = { id: 1, name: "John", age: 30 };
 * const picked = pick(user, ["name", "age"]);
 * // { name: "John", age: 30 }
 * ```
 */
function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Type-safe object property omission
 *
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without the specified keys
 *
 * @example
 * ```ts
 * const user = { id: 1, name: "John", age: 30 };
 * const omitted = omit(user, ["id"]);
 * // { name: "John", age: 30 }
 * ```
 */
function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
/**
 * Deep merge two objects
 *
 * @param target - Target object
 * @param source - Source object
 * @returns Merged object
 *
 * @example
 * ```ts
 * const a = { x: 1, nested: { a: 1 } };
 * const b = { y: 2, nested: { b: 2 } };
 * const merged = merge(a, b);
 * // { x: 1, y: 2, nested: { a: 1, b: 2 } }
 * ```
 */
function merge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = target[key];
            if (isObject(sourceValue) && isObject(targetValue)) {
                result[key] = merge(targetValue, sourceValue);
            }
            else {
                result[key] = sourceValue;
            }
        }
    }
    return result;
}
/**
 * Deep clone an object or array
 *
 * @param value - Value to clone
 * @returns Cloned value
 *
 * @example
 * ```ts
 * const original = { x: 1, nested: { y: 2 } };
 * const cloned = clone(original);
 * cloned.nested.y = 3;
 * console.log(original.nested.y); // 2
 * ```
 */
function clone(value) {
    if (value === null || typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(item => clone(item));
    }
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags);
    }
    const cloned = {};
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            cloned[key] = clone(value[key]);
        }
    }
    return cloned;
}
/**
 * Deep freeze an object to make it immutable
 *
 * @param obj - Object to freeze
 * @returns Frozen object
 *
 * @example
 * ```ts
 * const obj = freeze({ x: 1, nested: { y: 2 } });
 * obj.x = 2;           // Error in strict mode
 * obj.nested.y = 3;    // Error in strict mode
 * ```
 */
function freeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = obj[prop];
        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
            freeze(value);
        }
    });
    return obj;
}
/**
 * Type-safe Object.entries with preserved key types
 *
 * @param obj - Object to get entries from
 * @returns Array of [key, value] tuples
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * const entries = entries(obj);
 * // Array<["a" | "b", number]>
 * ```
 */
function entries(obj) {
    return Object.entries(obj);
}
/**
 * Type-safe Object.keys with preserved key types
 *
 * @param obj - Object to get keys from
 * @returns Array of keys
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * const keys = keys(obj);
 * // Array<"a" | "b">
 * ```
 */
function keys(obj) {
    return Object.keys(obj);
}
/**
 * Type-safe Object.values with preserved value types
 *
 * @param obj - Object to get values from
 * @returns Array of values
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * const values = values(obj);
 * // Array<number>
 * ```
 */
function values(obj) {
    return Object.values(obj);
}
// ============================================================================
// Array & Tuple Helpers
// ============================================================================
/**
 * Get the first element of an array with type safety
 *
 * @param arr - Array to get first element from
 * @returns First element or undefined
 *
 * @example
 * ```ts
 * first([1, 2, 3]);     // 1
 * first([]);            // undefined
 * first(["a", "b"]);    // "a"
 * ```
 */
function first(arr) {
    return arr[0];
}
/**
 * Get the last element of an array with type safety
 *
 * @param arr - Array to get last element from
 * @returns Last element or undefined
 *
 * @example
 * ```ts
 * last([1, 2, 3]);      // 3
 * last([]);             // undefined
 * last(["a", "b"]);     // "b"
 * ```
 */
function last(arr) {
    return arr[arr.length - 1];
}
/**
 * Split an array into chunks of specified size
 *
 * @param arr - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2);
 * // [[1, 2], [3, 4], [5]]
 * ```
 */
function chunk(arr, size) {
    if (size <= 0) {
        throw new Error('Chunk size must be greater than 0');
    }
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}
/**
 * Remove duplicate values from an array
 *
 * @param arr - Array to remove duplicates from
 * @param keyFn - Optional function to determine uniqueness
 * @returns Array with unique values
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 3]);
 * // [1, 2, 3]
 *
 * unique([{id: 1}, {id: 2}, {id: 1}], x => x.id);
 * // [{id: 1}, {id: 2}]
 * ```
 */
function unique(arr, keyFn) {
    if (!keyFn) {
        return Array.from(new Set(arr));
    }
    const seen = new Set();
    const result = [];
    for (const item of arr) {
        const key = keyFn(item);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }
    return result;
}
/**
 * Flatten a nested array structure
 *
 * @param arr - Array to flatten
 * @param depth - Maximum depth to flatten (default: 1)
 * @returns Flattened array
 *
 * @example
 * ```ts
 * flatten([1, [2, [3, 4]]], 1);
 * // [1, 2, [3, 4]]
 *
 * flatten([1, [2, [3, 4]]], 2);
 * // [1, 2, 3, 4]
 * ```
 */
function flatten(arr, depth = 1) {
    if (depth <= 0) {
        return arr;
    }
    return arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            acc.push(...flatten(val, depth - 1));
        }
        else {
            acc.push(val);
        }
        return acc;
    }, []);
}
/**
 * Zip multiple arrays together
 *
 * @param arrays - Arrays to zip
 * @returns Array of tuples
 *
 * @example
 * ```ts
 * zip([1, 2, 3], ["a", "b", "c"]);
 * // [[1, "a"], [2, "b"], [3, "c"]]
 * ```
 */
function zip(...arrays) {
    const minLength = Math.min(...arrays.map(arr => arr.length));
    const result = [];
    for (let i = 0; i < minLength; i++) {
        result.push(arrays.map(arr => arr[i]));
    }
    return result;
}
function pipe(...fns) {
    return (arg) => fns.reduce((result, fn) => fn(result), arg);
}
function compose(...fns) {
    return (arg) => fns.reduceRight((result, fn) => fn(result), arg);
}
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...nextArgs) => curried(...args, ...nextArgs);
    };
}
/**
 * Debounce a function to limit execution rate
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const handleInput = debounce((value: string) => {
 *   console.log("Searching for:", value);
 * }, 300);
 *
 * handleInput("a");   // Waits 300ms
 * handleInput("ab");  // Cancels previous, waits 300ms
 * handleInput("abc"); // Cancels previous, waits 300ms
 * // Only logs "Searching for: abc" after 300ms
 * ```
 */
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
// ============================================================================
// Type Predicates & Conditional Helpers
// ============================================================================
/**
 * Type predicate to check if a value is defined (not null or undefined)
 *
 * @param value - Value to check
 * @returns True if value is not null or undefined
 *
 * @example
 * ```ts
 * const values = [1, null, 2, undefined, 3];
 * const defined = values.filter(isDefined);
 * // [1, 2, 3]
 * ```
 */
function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Check if a value is present (alias for isDefined for semantic clarity)
 *
 * @param value - Value to check
 * @returns True if value is not null or undefined
 *
 * @example
 * ```ts
 * const user = getUserById(id);
 * if (isPresent(user)) {
 *   console.log(user.name); // TypeScript knows user is not null/undefined
 * }
 * ```
 */
function isPresent(value) {
    return isDefined(value);
}
/**
 * Exhaustiveness checking helper for switch statements
 *
 * @param value - Value that should never be reached
 * @throws Error indicating non-exhaustive switch
 *
 * @example
 * ```ts
 * type Action = { type: "INCREMENT" } | { type: "DECREMENT" };
 *
 * function reducer(action: Action) {
 *   switch (action.type) {
 *     case "INCREMENT": return state + 1;
 *     case "DECREMENT": return state - 1;
 *     default: return assertNever(action);
 *   }
 * }
 * ```
 */
function assertNever(value) {
    throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}
/**
 * Pattern matching helper for discriminated unions
 *
 * @param value - Value to match against
 * @param patterns - Object with pattern handlers
 * @returns Result of the matched pattern
 *
 * @example
 * ```ts
 * type Result<T> = { ok: true; value: T } | { ok: false; error: string };
 *
 * const result: Result<number> = { ok: true, value: 42 };
 * const message = match(result, {
 *   ok: (r) => `Success: ${r.value}`,
 *   default: (r) => `Error: ${r.error}`
 * });
 * ```
 */
function match(value, patterns) {
    for (const key in patterns) {
        if (key === 'default')
            continue;
        if (key in value && patterns[key]) {
            return patterns[key](value);
        }
    }
    if (patterns.default) {
        return patterns.default(value);
    }
    throw new Error('No pattern matched and no default provided');
}
//# sourceMappingURL=typescript-utils.js.map