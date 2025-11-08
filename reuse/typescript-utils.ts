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
export function isString(value: unknown): value is string {
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
export function isNumber(value: unknown): value is number {
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
export function isBoolean(value: unknown): value is boolean {
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
export function isObject(value: unknown): value is Record<string, unknown> {
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
export function isArray<T>(
  value: unknown,
  elementGuard?: (item: unknown) => item is T
): value is T[] {
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
export function isFunction(value: unknown): value is Function {
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
export function isNull(value: unknown): value is null {
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
export function isUndefined(value: unknown): value is undefined {
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
export function asConst<T>(value: T): T {
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
export function asReadonly<T>(value: T): Readonly<T> {
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
export function asMutable<T>(value: Readonly<T>): T {
  return { ...value } as T;
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
export function asNonNullable<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined');
  }
  return value as NonNullable<T>;
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
export function asPartial<T>(value: T): Partial<T> {
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
export function identity<T>(value: T): T {
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
export function noop(): void {
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
export function constant<T>(value: T): () => T {
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
export function tryCatch<T, E = unknown>(
  fn: () => T,
  onError: (error: E) => T
): T {
  try {
    return fn();
  } catch (error) {
    return onError(error as E);
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
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
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
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
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
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
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
export function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as T & U;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = (target as any)[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        (result as any)[key] = merge(targetValue, sourceValue);
      } else {
        (result as any)[key] = sourceValue;
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
export function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => clone(item)) as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }

  const cloned = {} as T;
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
export function freeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
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
export function entries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
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
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
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
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
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
export function first<T>(arr: readonly T[]): T | undefined {
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
export function last<T>(arr: readonly T[]): T | undefined {
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
export function chunk<T>(arr: readonly T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size) as T[]);
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
export function unique<T>(
  arr: readonly T[],
  keyFn?: (item: T) => unknown
): T[] {
  if (!keyFn) {
    return Array.from(new Set(arr));
  }

  const seen = new Set<unknown>();
  const result: T[] = [];

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
export function flatten<T>(arr: readonly unknown[], depth = 1): T[] {
  if (depth <= 0) {
    return arr as T[];
  }

  return arr.reduce<T[]>((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten<T>(val, depth - 1));
    } else {
      acc.push(val as T);
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
export function zip<T extends readonly unknown[][]>(
  ...arrays: T
): Array<{ [K in keyof T]: T[K] extends readonly (infer U)[] ? U : never }> {
  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result: any[] = [];

  for (let i = 0; i < minLength; i++) {
    result.push(arrays.map(arr => arr[i]));
  }

  return result;
}

// ============================================================================
// Function Composition
// ============================================================================

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
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D
): (a: A) => D;
export function pipe<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E
): (a: A) => E;
export function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any) => fns.reduce((result, fn) => fn(result), arg);
}

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
export function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
export function compose<A, B, C, D>(
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B
): (a: A) => D;
export function compose(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any) => fns.reduceRight((result, fn) => fn(result), arg);
}

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
export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R
): (a: A) => (b: B) => (c: C) => R;
export function curry(fn: (...args: any[]) => any): any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
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
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args): void => {
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
export function isDefined<T>(value: T): value is NonNullable<T> {
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
export function isPresent<T>(value: T): value is NonNullable<T> {
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
export function assertNever(value: never): never {
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
export function match<T extends Record<string, any>, R>(
  value: T,
  patterns: { [K in keyof T]?: (val: Extract<T, Record<K, T[K]>>) => R } & {
    default?: (val: T) => R;
  }
): R {
  for (const key in patterns) {
    if (key === 'default') continue;
    if (key in value && patterns[key]) {
      return patterns[key]!(value as any);
    }
  }

  if (patterns.default) {
    return patterns.default(value);
  }

  throw new Error('No pattern matched and no default provided');
}
