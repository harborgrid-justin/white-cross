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
export declare function isString(value: unknown): value is string;
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
export declare function isNumber(value: unknown): value is number;
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
export declare function isBoolean(value: unknown): value is boolean;
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
export declare function isObject(value: unknown): value is Record<string, unknown>;
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
export declare function isArray<T>(value: unknown, elementGuard?: (item: unknown) => item is T): value is T[];
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
export declare function isFunction(value: unknown): value is Function;
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
export declare function isNull(value: unknown): value is null;
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
export declare function isUndefined(value: unknown): value is undefined;
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
export declare function asConst<T>(value: T): T;
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
export declare function asReadonly<T>(value: T): Readonly<T>;
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
export declare function asMutable<T>(value: Readonly<T>): T;
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
export declare function asNonNullable<T>(value: T): NonNullable<T>;
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
export declare function asPartial<T>(value: T): Partial<T>;
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
export declare function identity<T>(value: T): T;
/**
 * No-operation function - does nothing and returns undefined
 *
 * @example
 * ```ts
 * const callback = shouldLog ? log : noop;
 * callback("message"); // Safe even when shouldLog is false
 * ```
 */
export declare function noop(): void;
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
export declare function constant<T>(value: T): () => T;
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
export declare function tryCatch<T, E = unknown>(fn: () => T, onError: (error: E) => T): T;
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
export declare function memoize<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R;
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
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>;
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
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K>;
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
export declare function merge<T extends object, U extends object>(target: T, source: U): T & U;
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
export declare function clone<T>(value: T): T;
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
export declare function freeze<T extends object>(obj: T): Readonly<T>;
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
export declare function entries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]>;
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
export declare function keys<T extends object>(obj: T): Array<keyof T>;
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
export declare function values<T extends object>(obj: T): Array<T[keyof T]>;
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
export declare function first<T>(arr: readonly T[]): T | undefined;
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
export declare function last<T>(arr: readonly T[]): T | undefined;
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
export declare function chunk<T>(arr: readonly T[], size: number): T[][];
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
export declare function unique<T>(arr: readonly T[], keyFn?: (item: T) => unknown): T[];
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
export declare function flatten<T>(arr: readonly unknown[], depth?: number): T[];
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
export declare function zip<T extends readonly unknown[][]>(...arrays: T): Array<{
    [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never;
}>;
/**
 * Left-to-right function composition (pipe)
 *
 * @param fns - Functions to compose
 * @returns Composed function
 *
 * @example
 * ```ts
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const transform = pipe(addOne, double);
 * transform(5);  // 12 (5 + 1 = 6, 6 * 2 = 12)
 * ```
 */
export declare function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export declare function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export declare function pipe<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export declare function pipe<A, B, C, D, E>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): (a: A) => E;
/**
 * Right-to-left function composition
 *
 * @param fns - Functions to compose
 * @returns Composed function
 *
 * @example
 * ```ts
 * const addOne = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const transform = compose(double, addOne);
 * transform(5);  // 12 (5 + 1 = 6, 6 * 2 = 12)
 * ```
 */
export declare function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export declare function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
export declare function compose<A, B, C, D>(cd: (c: C) => D, bc: (b: B) => C, ab: (a: A) => B): (a: A) => D;
/**
 * Curry a function to allow partial application
 *
 * @param fn - Function to curry
 * @returns Curried function
 *
 * @example
 * ```ts
 * const add = (a: number, b: number) => a + b;
 * const curriedAdd = curry(add);
 * curriedAdd(1)(2);     // 3
 * curriedAdd(1, 2);     // 3
 * const addOne = curriedAdd(1);
 * addOne(5);            // 6
 * ```
 */
export declare function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export declare function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
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
export declare function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number): (...args: Args) => void;
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
export declare function isDefined<T>(value: T): value is NonNullable<T>;
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
export declare function isPresent<T>(value: T): value is NonNullable<T>;
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
export declare function assertNever(value: never): never;
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
export declare function match<T extends Record<string, any>, R>(value: T, patterns: {
    [K in keyof T]?: (val: Extract<T, Record<K, T[K]>>) => R;
} & {
    default?: (val: T) => R;
}): R;
//# sourceMappingURL=typescript-utils.d.ts.map