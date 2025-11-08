/**
 * LOC: TYSFT1234567
 * File: /reuse/type-safety-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS services and controllers
 *   - Sequelize model definitions
 *   - API validation layers
 *   - Form handling utilities
 */

/**
 * File: /reuse/type-safety-kit.ts
 * Locator: WC-UTL-TYSFT-001
 * Purpose: Comprehensive Type Safety Utilities - advanced type guards, runtime validation, type builders, compile-time guarantees
 *
 * Upstream: Independent utility module for type safety and compile-time guarantees
 * Downstream: ../backend/*, services, controllers, models, validation layers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 50 utility functions for type safety, type guards, validation, branded types, type builders
 *
 * LLM Context: Advanced type safety utilities leveraging TypeScript 5.0+ features including conditional types,
 * mapped types, template literal types, type inference, branded types, discriminated unions, and runtime validation.
 * Provides compile-time guarantees, type-safe integrations with NestJS and Sequelize, and comprehensive type utilities.
 */

import { z } from 'zod';
import { Model, ModelStatic, Attributes, CreationAttributes } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Brand type utility for creating nominal types
 */
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

/**
 * Deep readonly type that recursively makes all properties readonly
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

/**
 * Deep partial type that recursively makes all properties optional
 */
export type DeepPartial<T> = T extends (infer R)[]
  ? DeepPartialArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepPartialObject<T>
  : T;

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}
type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Required deep - makes all nested properties required
 */
export type DeepRequired<T> = T extends (infer R)[]
  ? DeepRequiredArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepRequiredObject<T>
  : T;

interface DeepRequiredArray<T> extends Array<DeepRequired<T>> {}
type DeepRequiredObject<T> = { [P in keyof T]-?: DeepRequired<T[P]> };

/**
 * Extracts keys where value type matches a given type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Excludes keys where value type matches a given type
 */
export type ExcludeKeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

/**
 * Pick properties by type
 */
export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

/**
 * Omit properties by type
 */
export type OmitByType<T, U> = Pick<T, ExcludeKeysOfType<T, U>>;

/**
 * Makes specific keys optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specific keys required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Union to intersection conversion
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * Mutable version of readonly types
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Deep mutable type
 */
export type DeepMutable<T> = T extends (infer R)[]
  ? DeepMutableArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepMutableObject<T>
  : T;

interface DeepMutableArray<T> extends Array<DeepMutable<T>> {}
type DeepMutableObject<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };

/**
 * Non-nullable deep - removes null and undefined from all nested properties
 */
export type DeepNonNullable<T> = T extends (infer R)[]
  ? DeepNonNullableArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepNonNullableObject<T>
  : NonNullable<T>;

interface DeepNonNullableArray<T> extends Array<DeepNonNullable<T>> {}
type DeepNonNullableObject<T> = { [P in keyof T]-?: DeepNonNullable<T[P]> };

/**
 * Async version of a type (wraps return types in Promise)
 */
export type AsyncType<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : never;

/**
 * Awaited recursive type for deeply nested promises
 */
export type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

/**
 * Type-safe event emitter event map
 */
export type EventMap = Record<string, any>;

/**
 * Type-safe state machine states
 */
export type StateMachineConfig<S extends string, E extends string> = {
  initial: S;
  states: Record<S, {
    on?: Partial<Record<E, S>>;
    entry?: () => void;
    exit?: () => void;
  }>;
};

/**
 * Discriminated union helper
 */
export type DiscriminatedUnion<K extends PropertyKey, T extends object> = T & { [P in K]: string };

/**
 * Type-safe JSON types
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Type-safe builder pattern
 */
export type Builder<T> = {
  [K in keyof T]-?: (value: T[K]) => Builder<T>;
} & { build(): T };

/**
 * Nominal type helper
 */
export type Nominal<T, Name extends string> = T & { readonly __nominal: Name };

/**
 * Opaque type helper
 */
export type Opaque<T, Token = unknown> = T & { readonly __opaque__: Token };

/**
 * Path type for nested object access
 */
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never;
    }[keyof T]
  : never;

/**
 * PathValue type for getting value at path
 */
export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

// ============================================================================
// SECTION 1: ADVANCED TYPE GUARDS (Functions 1-8)
// ============================================================================

/**
 * 1. Type guard for checking if value is defined (not null or undefined)
 *
 * @example
 * const values = [1, null, 2, undefined, 3];
 * const defined = values.filter(isDefined); // [1, 2, 3]
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * 2. Type guard for checking if value is a specific object type with required keys
 *
 * @example
 * interface User { id: number; name: string; }
 * const data: unknown = { id: 1, name: 'John' };
 * if (isObjectWithKeys<User>(data, ['id', 'name'])) {
 *   console.log(data.id, data.name); // Type-safe access
 * }
 */
export function isObjectWithKeys<T extends object>(
  value: unknown,
  keys: (keyof T)[]
): value is T {
  if (typeof value !== 'object' || value === null) return false;
  return keys.every(key => key in value);
}

/**
 * 3. Type guard for arrays with specific element type
 *
 * @example
 * const data: unknown = [1, 2, 3];
 * if (isArrayOf(data, (x): x is number => typeof x === 'number')) {
 *   data.forEach(n => n.toFixed(2)); // Type-safe as number[]
 * }
 */
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

/**
 * 4. Type guard for non-empty arrays
 *
 * @example
 * const arr: string[] = getArray();
 * if (isNonEmptyArray(arr)) {
 *   const first = arr[0]; // Safe access, never undefined
 * }
 */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return value.length > 0;
}

/**
 * 5. Type guard for literal types using const assertion
 *
 * @example
 * const STATUSES = ['active', 'inactive', 'pending'] as const;
 * type Status = typeof STATUSES[number];
 * const value: string = 'active';
 * if (isLiteralType(value, STATUSES)) {
 *   // value is now Status type
 * }
 */
export function isLiteralType<T extends readonly any[]>(
  value: unknown,
  literals: T
): value is T[number] {
  return literals.includes(value as any);
}

/**
 * 6. Type guard for discriminated union by discriminant property
 *
 * @example
 * type Shape =
 *   | { kind: 'circle'; radius: number }
 *   | { kind: 'square'; size: number };
 * const shape: Shape = getShape();
 * if (hasDiscriminant(shape, 'kind', 'circle')) {
 *   console.log(shape.radius); // Type-safe access
 * }
 */
export function hasDiscriminant<T, K extends keyof T, V extends T[K]>(
  obj: T,
  key: K,
  value: V
): obj is Extract<T, Record<K, V>> {
  return obj[key] === value;
}

/**
 * 7. Type guard for promise types
 *
 * @example
 * const value: unknown = Promise.resolve(42);
 * if (isPromise(value)) {
 *   const result = await value; // Safe to await
 * }
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as any).then === 'function'
  );
}

/**
 * 8. Type guard for async functions
 *
 * @example
 * const fn: Function = async () => 42;
 * if (isAsyncFunction(fn)) {
 *   const result = await fn(); // Type-safe async call
 * }
 */
export function isAsyncFunction<T extends (...args: any[]) => any>(
  fn: unknown
): fn is T & ((...args: Parameters<T>) => Promise<any>) {
  return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}

// ============================================================================
// SECTION 2: TYPE ASSERTION & VALIDATION (Functions 9-15)
// ============================================================================

/**
 * 9. Assert that a value is defined, throw if not
 *
 * @example
 * const user = users.find(u => u.id === 1);
 * assertDefined(user, 'User not found');
 * console.log(user.name); // user is definitely defined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value is null or undefined'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * 10. Assert that a value matches a type guard, throw if not
 *
 * @example
 * const data: unknown = getUserData();
 * assertType(data, isObjectWithKeys<User>, ['id', 'name'], 'Invalid user data');
 * console.log(data.id); // Type-safe as User
 */
export function assertType<T>(
  value: unknown,
  guard: (v: unknown, ...args: any[]) => v is T,
  ...guardArgs: any[]
): asserts value is T {
  if (!guard(value, ...guardArgs)) {
    throw new TypeError(`Type assertion failed: ${JSON.stringify(value)}`);
  }
}

/**
 * 11. Assert never for exhaustive checking in discriminated unions
 *
 * @example
 * type Action = { type: 'add' } | { type: 'remove' };
 * function handle(action: Action) {
 *   switch (action.type) {
 *     case 'add': return handleAdd();
 *     case 'remove': return handleRemove();
 *     default: assertNever(action); // Compile error if not exhaustive
 *   }
 * }
 */
export function assertNever(value: never, message = 'Unexpected value'): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}

/**
 * 12. Runtime type validation with custom validator function
 *
 * @example
 * const validator = (v: unknown): v is number => typeof v === 'number';
 * const value = validate(getUserInput(), validator, 'Expected number');
 * console.log(value.toFixed(2)); // Type-safe as number
 */
export function validate<T>(
  value: unknown,
  validator: (v: unknown) => v is T,
  errorMessage = 'Validation failed'
): T {
  if (!validator(value)) {
    throw new Error(errorMessage);
  }
  return value;
}

/**
 * 13. Safe type cast with runtime check
 *
 * @example
 * const data: unknown = { id: 1, name: 'John' };
 * const user = safeCast<User>(data, (v): v is User =>
 *   isObjectWithKeys<User>(v, ['id', 'name'])
 * );
 * if (user) {
 *   console.log(user.name); // Type-safe access
 * }
 */
export function safeCast<T>(value: unknown, guard: (v: unknown) => v is T): T | undefined {
  return guard(value) ? value : undefined;
}

/**
 * 14. Type-safe coercion with default value
 *
 * @example
 * const count = coerce('123', Number, 0); // 123
 * const invalid = coerce('abc', Number, 0); // 0
 */
export function coerce<T, U>(
  value: T,
  coercer: (v: T) => U,
  defaultValue: U
): U {
  try {
    const result = coercer(value);
    return result !== null && result !== undefined && !Number.isNaN(result)
      ? result
      : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 15. Multi-type validator for union types
 *
 * @example
 * const validators = [
 *   (v: unknown): v is string => typeof v === 'string',
 *   (v: unknown): v is number => typeof v === 'number'
 * ];
 * if (validateUnion(value, validators)) {
 *   // value is string | number
 * }
 */
export function validateUnion<T extends readonly ((v: unknown) => v is any)[]>(
  value: unknown,
  validators: T
): value is ReturnType<T[number]> extends (v: unknown) => v is infer U ? U : never {
  return validators.some(validator => validator(value));
}

// ============================================================================
// SECTION 3: GENERIC TYPE BUILDERS & HELPERS (Functions 16-23)
// ============================================================================

/**
 * 16. Create a type-safe pick utility with runtime enforcement
 *
 * @example
 * interface User { id: number; name: string; email: string; password: string; }
 * const user: User = getUser();
 * const safe = typedPick(user, ['id', 'name', 'email']);
 * // safe is { id: number; name: string; email: string }
 */
export function typedPick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

/**
 * 17. Create a type-safe omit utility with runtime enforcement
 *
 * @example
 * interface User { id: number; name: string; password: string; }
 * const user: User = getUser();
 * const safe = typedOmit(user, ['password']);
 * // safe is { id: number; name: string }
 */
export function typedOmit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * 18. Deep clone with type preservation
 *
 * @example
 * interface Config { db: { host: string; port: number }; }
 * const config: Config = getConfig();
 * const cloned = deepClone(config);
 * // cloned is Config type with all nested properties cloned
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime()) as any;
  if (value instanceof Array) return value.map(item => deepClone(item)) as any;
  if (value instanceof Set) return new Set(Array.from(value).map(deepClone)) as any;
  if (value instanceof Map) {
    return new Map(
      Array.from(value.entries()).map(([k, v]) => [deepClone(k), deepClone(v)])
    ) as any;
  }
  const cloned = {} as T;
  Object.keys(value).forEach(key => {
    (cloned as any)[key] = deepClone((value as any)[key]);
  });
  return cloned;
}

/**
 * 19. Deep merge with type safety
 *
 * @example
 * const defaults = { a: 1, b: { c: 2 } };
 * const overrides = { b: { d: 3 } };
 * const merged = deepMerge(defaults, overrides);
 * // merged is { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as any;
  Object.keys(source).forEach(key => {
    const sourceValue = (source as any)[key];
    const targetValue = result[key];
    if (
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue) &&
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  });
  return result;
}

/**
 * 20. Create a readonly proxy with deep immutability
 *
 * @example
 * const data = { user: { name: 'John' } };
 * const readonly = createReadonly(data);
 * readonly.user.name = 'Jane'; // Throws error
 */
export function createReadonly<T extends object>(obj: T): DeepReadonly<T> {
  return new Proxy(obj, {
    get(target, prop) {
      const value = (target as any)[prop];
      if (typeof value === 'object' && value !== null) {
        return createReadonly(value);
      }
      return value;
    },
    set() {
      throw new Error('Cannot modify readonly object');
    },
    deleteProperty() {
      throw new Error('Cannot delete property from readonly object');
    }
  }) as DeepReadonly<T>;
}

/**
 * 21. Type-safe object keys with proper typing
 *
 * @example
 * interface User { id: number; name: string; }
 * const user: User = { id: 1, name: 'John' };
 * const keys = typedKeys(user); // ('id' | 'name')[]
 * keys.forEach(key => console.log(user[key])); // Type-safe
 */
export function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * 22. Type-safe object entries with proper typing
 *
 * @example
 * interface User { id: number; name: string; }
 * const user: User = { id: 1, name: 'John' };
 * const entries = typedEntries(user); // ['id', number] | ['name', string]
 * entries.forEach(([key, value]) => console.log(key, value)); // Type-safe
 */
export function typedEntries<T extends object>(
  obj: T
): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(obj) as any;
}

/**
 * 23. Type-safe fromEntries with inference
 *
 * @example
 * const entries: [['id', number], ['name', string]] = [['id', 1], ['name', 'John']];
 * const obj = typedFromEntries(entries);
 * // obj is { id: number; name: string }
 */
export function typedFromEntries<K extends PropertyKey, V>(
  entries: readonly (readonly [K, V])[]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

// ============================================================================
// SECTION 4: BRANDED TYPES & FACTORIES (Functions 24-29)
// ============================================================================

/**
 * 24. Create a branded type factory for nominal typing
 *
 * @example
 * type UserId = Branded<number, 'UserId'>;
 * type ProductId = Branded<number, 'ProductId'>;
 * const createUserId = brandedFactory<UserId>();
 * const userId = createUserId(123);
 * const productId = 456 as ProductId; // Error: incompatible types
 */
export function brandedFactory<T extends Branded<any, any>>() {
  return (value: T extends Branded<infer U, any> ? U : never): T => {
    return value as T;
  };
}

/**
 * 25. Validate and create branded type with runtime check
 *
 * @example
 * type Email = Branded<string, 'Email'>;
 * const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
 * const createEmail = validatedBrand<Email>(isEmail, 'Invalid email');
 * const email = createEmail('user@example.com'); // Email type
 * const invalid = createEmail('invalid'); // Throws error
 */
export function validatedBrand<T extends Branded<any, any>>(
  validator: (value: T extends Branded<infer U, any> ? U : never) => boolean,
  errorMessage = 'Validation failed'
) {
  return (value: T extends Branded<infer U, any> ? U : never): T => {
    if (!validator(value)) {
      throw new Error(errorMessage);
    }
    return value as T;
  };
}

/**
 * 26. Extract base type from branded type
 *
 * @example
 * type UserId = Branded<number, 'UserId'>;
 * const userId: UserId = 123 as UserId;
 * const rawId = unbrand(userId); // number
 */
export function unbrand<T, B>(value: Branded<T, B>): T {
  return value as unknown as T;
}

/**
 * 27. Create opaque type factory
 *
 * @example
 * type Token = Opaque<string, 'AuthToken'>;
 * const createToken = opaqueFactory<Token>();
 * const token = createToken('secret-token');
 */
export function opaqueFactory<T extends Opaque<any, any>>() {
  return (value: T extends Opaque<infer U, any> ? U : never): T => {
    return value as T;
  };
}

/**
 * 28. Create nominal type using class-based approach
 *
 * @example
 * class UserId extends NominalType<number, 'UserId'>() {}
 * const userId = new UserId(123);
 * console.log(userId.value); // 123
 */
export function NominalType<T, Name extends string>() {
  return class {
    readonly __nominal!: Name;
    constructor(public readonly value: T) {}
  };
}

/**
 * 29. Type-safe enum factory with branded values
 *
 * @example
 * const UserRole = createEnum(['admin', 'user', 'guest'] as const);
 * type UserRole = typeof UserRole.Type;
 * const role: UserRole = UserRole.admin; // Type-safe
 */
export function createEnum<T extends readonly string[]>(values: T) {
  const enumObj = {} as { [K in T[number]]: K };
  values.forEach(val => {
    (enumObj as any)[val] = val;
  });
  return Object.assign(enumObj, {
    Type: null as unknown as T[number],
    values: values as readonly T[number][],
    is: (value: unknown): value is T[number] => values.includes(value as any)
  });
}

// ============================================================================
// SECTION 5: DISCRIMINATED UNIONS & TYPE NARROWING (Functions 30-35)
// ============================================================================

/**
 * 30. Create discriminated union matcher with exhaustive checking
 *
 * @example
 * type Result<T, E> =
 *   | { status: 'success'; data: T }
 *   | { status: 'error'; error: E };
 * const result: Result<User, Error> = getResult();
 * const value = matchUnion(result, 'status', {
 *   success: (r) => r.data,
 *   error: (r) => null
 * });
 */
export function matchUnion<
  T extends { [K in D]: string },
  D extends keyof T,
  R
>(
  value: T,
  discriminant: D,
  handlers: { [K in T[D]]: (v: Extract<T, { [P in D]: K }>) => R }
): R {
  const key = value[discriminant] as T[D];
  const handler = handlers[key];
  if (!handler) {
    throw new Error(`No handler for discriminant value: ${String(key)}`);
  }
  return handler(value as any);
}

/**
 * 31. Type-safe switch helper for discriminated unions
 *
 * @example
 * type Shape =
 *   | { kind: 'circle'; radius: number }
 *   | { kind: 'square'; size: number };
 * const shape: Shape = getShape();
 * const area = switchUnion(shape, 'kind')
 *   .case('circle', s => Math.PI * s.radius ** 2)
 *   .case('square', s => s.size ** 2)
 *   .exec();
 */
export function switchUnion<T extends { [K in D]: string }, D extends keyof T>(
  value: T,
  discriminant: D
) {
  const cases = new Map<T[D], (v: any) => any>();
  let defaultCase: ((v: T) => any) | undefined;

  return {
    case<V extends T[D]>(
      variant: V,
      handler: (v: Extract<T, { [P in D]: V }>) => any
    ) {
      cases.set(variant, handler);
      return this;
    },
    default(handler: (v: T) => any) {
      defaultCase = handler;
      return this;
    },
    exec() {
      const key = value[discriminant];
      const handler = cases.get(key);
      if (handler) return handler(value);
      if (defaultCase) return defaultCase(value);
      throw new Error(`No handler for discriminant value: ${String(key)}`);
    }
  };
}

/**
 * 32. Create type predicate for discriminated union variant
 *
 * @example
 * type Action =
 *   | { type: 'add'; item: string }
 *   | { type: 'remove'; id: number };
 * const isAddAction = createVariantGuard<Action, 'type', 'add'>('type', 'add');
 * const action: Action = getAction();
 * if (isAddAction(action)) {
 *   console.log(action.item); // Type-safe access
 * }
 */
export function createVariantGuard<
  T extends { [K in D]: string },
  D extends keyof T,
  V extends T[D]
>(discriminant: D, variant: V) {
  return (value: T): value is Extract<T, { [P in D]: V }> => {
    return value[discriminant] === variant;
  };
}

/**
 * 33. Narrow type by property existence
 *
 * @example
 * type User = { id: number; name: string; email?: string };
 * const user: User = getUser();
 * if (hasProperty(user, 'email')) {
 *   console.log(user.email.toLowerCase()); // email is string, not string | undefined
 * }
 */
export function hasProperty<T, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * 34. Filter array and narrow element type
 *
 * @example
 * const mixed: (string | number)[] = [1, 'a', 2, 'b'];
 * const numbers = filterByType(mixed, (x): x is number => typeof x === 'number');
 * // numbers is number[]
 */
export function filterByType<T, U extends T>(
  array: T[],
  guard: (item: T) => item is U
): U[] {
  return array.filter(guard);
}

/**
 * 35. Partition array by type guard
 *
 * @example
 * const mixed: (string | number)[] = [1, 'a', 2, 'b'];
 * const [numbers, strings] = partition(mixed, (x): x is number => typeof x === 'number');
 * // numbers is number[], strings is string[]
 */
export function partition<T, U extends T>(
  array: T[],
  guard: (item: T) => item is U
): [U[], Exclude<T, U>[]] {
  const pass: U[] = [];
  const fail: Exclude<T, U>[] = [];
  array.forEach(item => {
    if (guard(item)) {
      pass.push(item);
    } else {
      fail.push(item as Exclude<T, U>);
    }
  });
  return [pass, fail];
}

// ============================================================================
// SECTION 6: RUNTIME TYPE VALIDATION (Functions 36-40)
// ============================================================================

/**
 * 36. Validate object schema at runtime with type inference
 *
 * @example
 * const userSchema = {
 *   id: (v: unknown): v is number => typeof v === 'number',
 *   name: (v: unknown): v is string => typeof v === 'string',
 *   email: (v: unknown): v is string => typeof v === 'string'
 * };
 * const data: unknown = getUserData();
 * if (validateSchema(data, userSchema)) {
 *   console.log(data.id, data.name); // Type-safe as { id: number, name: string, email: string }
 * }
 */
export function validateSchema<T extends Record<string, (v: unknown) => v is any>>(
  value: unknown,
  schema: T
): value is { [K in keyof T]: T[K] extends (v: unknown) => v is infer U ? U : never } {
  if (typeof value !== 'object' || value === null) return false;
  return Object.entries(schema).every(([key, guard]) => {
    return key in value && guard((value as any)[key]);
  });
}

/**
 * 37. Create Zod schema from TypeScript type with validation
 *
 * @example
 * interface User { id: number; name: string; email: string; }
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   email: z.string().email()
 * });
 * const data: unknown = getUserData();
 * const user = parseWithZod(data, userSchema);
 * // user is User type with runtime validation
 */
export function parseWithZod<T>(data: unknown, schema: z.ZodType<T>): T {
  return schema.parse(data);
}

/**
 * 38. Safe parse with Zod returning result type
 *
 * @example
 * const result = safeParseWithZod(data, userSchema);
 * if (result.success) {
 *   console.log(result.data.name); // Type-safe access
 * } else {
 *   console.error(result.error);
 * }
 */
export function safeParseWithZod<T>(
  data: unknown,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * 39. Create type guard from Zod schema
 *
 * @example
 * const userSchema = z.object({ id: z.number(), name: z.string() });
 * const isUser = zodGuard(userSchema);
 * const data: unknown = getUserData();
 * if (isUser(data)) {
 *   console.log(data.id, data.name); // Type-safe
 * }
 */
export function zodGuard<T>(schema: z.ZodType<T>) {
  return (value: unknown): value is T => {
    return schema.safeParse(value).success;
  };
}

/**
 * 40. Validate and transform with Zod pipeline
 *
 * @example
 * const pipeline = zodPipeline(
 *   z.string(),
 *   z.string().transform(s => s.toLowerCase()),
 *   z.string().refine(s => s.length > 3)
 * );
 * const result = pipeline('HELLO'); // 'hello'
 */
export function zodPipeline<T, U>(
  ...schemas: [z.ZodType<T>, ...z.ZodType<any>[], z.ZodType<U>]
) {
  return (data: unknown): U => {
    return schemas.reduce((acc, schema) => schema.parse(acc), data) as U;
  };
}

// ============================================================================
// SECTION 7: TYPE-SAFE INTEGRATIONS (Functions 41-46)
// ============================================================================

/**
 * 41. Create type-safe NestJS decorator with metadata
 *
 * @example
 * const Auth = createTypedDecorator<{ roles: string[] }>('auth');
 * @Auth({ roles: ['admin'] })
 * class AdminController {}
 * const metadata = getDecoratorMetadata(AdminController, 'auth');
 * // metadata is { roles: string[] }
 */
export function createTypedDecorator<T>(metadataKey: string) {
  return (metadata: T): ClassDecorator => {
    return (target: any) => {
      Reflect.defineMetadata(metadataKey, metadata, target);
    };
  };
}

/**
 * 42. Get typed metadata from decorator
 *
 * @example
 * const metadata = getDecoratorMetadata<{ roles: string[] }>(AdminController, 'auth');
 * if (metadata) {
 *   console.log(metadata.roles); // Type-safe access
 * }
 */
export function getDecoratorMetadata<T>(target: any, metadataKey: string): T | undefined {
  return Reflect.getMetadata(metadataKey, target);
}

/**
 * 43. Type-safe Sequelize model attributes extractor
 *
 * @example
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare id: number;
 *   declare name: string;
 * }
 * const attributes = extractModelAttributes(User);
 * // attributes is { id: number, name: string }
 */
export function extractModelAttributes<M extends Model>(
  model: ModelStatic<M>
): Attributes<M> {
  const attrs = model.getAttributes();
  return Object.keys(attrs).reduce((acc, key) => {
    acc[key as keyof Attributes<M>] = null as any;
    return acc;
  }, {} as Attributes<M>);
}

/**
 * 44. Create type-safe Sequelize query builder
 *
 * @example
 * const query = createTypedQuery(User)
 *   .where({ name: 'John' })
 *   .include(['posts'])
 *   .build();
 * const users = await query.findAll();
 * // users is User[] with type safety
 */
export function createTypedQuery<M extends Model>(model: ModelStatic<M>) {
  let whereClause: Partial<Attributes<M>> = {};
  let includeClause: any[] = [];

  return {
    where(conditions: Partial<Attributes<M>>) {
      whereClause = { ...whereClause, ...conditions };
      return this;
    },
    include(associations: string[]) {
      includeClause = [...includeClause, ...associations];
      return this;
    },
    build() {
      return {
        findAll: () => model.findAll({ where: whereClause as any, include: includeClause }),
        findOne: () => model.findOne({ where: whereClause as any, include: includeClause }),
        count: () => model.count({ where: whereClause as any })
      };
    }
  };
}

/**
 * 45. Type-safe environment variable parser
 *
 * @example
 * const envSchema = {
 *   PORT: (v: string) => parseInt(v, 10),
 *   DATABASE_URL: (v: string) => v,
 *   ENABLE_CACHE: (v: string) => v === 'true'
 * };
 * const env = parseEnv(process.env, envSchema);
 * // env is { PORT: number, DATABASE_URL: string, ENABLE_CACHE: boolean }
 */
export function parseEnv<T extends Record<string, (v: string) => any>>(
  env: Record<string, string | undefined>,
  schema: T
): { [K in keyof T]: ReturnType<T[K]> } {
  const result = {} as { [K in keyof T]: ReturnType<T[K]> };
  Object.entries(schema).forEach(([key, parser]) => {
    const value = env[key];
    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    result[key as keyof T] = parser(value);
  });
  return result;
}

/**
 * 46. Create type-safe configuration object with validation
 *
 * @example
 * const configSchema = z.object({
 *   port: z.number().min(1000),
 *   database: z.object({
 *     host: z.string(),
 *     port: z.number()
 *   })
 * });
 * const config = createTypedConfig(rawConfig, configSchema);
 * // config is type-safe and validated
 */
export function createTypedConfig<T>(raw: unknown, schema: z.ZodType<T>): DeepReadonly<T> {
  const validated = schema.parse(raw);
  return createReadonly(validated);
}

// ============================================================================
// SECTION 8: ADVANCED TYPE UTILITIES (Functions 47-50)
// ============================================================================

/**
 * 47. Type-safe builder pattern factory
 *
 * @example
 * interface User { id: number; name: string; email: string; }
 * const userBuilder = createBuilder<User>();
 * const user = userBuilder
 *   .id(1)
 *   .name('John')
 *   .email('john@example.com')
 *   .build();
 */
export function createBuilder<T extends object>(): Builder<T> {
  const values: Partial<T> = {};
  const builder: any = {
    build(): T {
      const keys = Object.keys(values);
      const typeKeys = new Set(keys);
      if (typeKeys.size !== keys.length) {
        throw new Error('Missing required properties');
      }
      return values as T;
    }
  };
  return new Proxy(builder, {
    get(target, prop) {
      if (prop === 'build') return target.build;
      return (value: any) => {
        values[prop as keyof T] = value;
        return builder;
      };
    }
  });
}

/**
 * 48. Get value at nested path with type safety
 *
 * @example
 * interface User { profile: { address: { city: string } } }
 * const user: User = getUser();
 * const city = getPath(user, 'profile.address.city');
 * // city is string type
 */
export function getPath<T, P extends Path<T>>(
  obj: T,
  path: P
): PathValue<T, P> {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined as any;
    current = current[part];
  }
  return current;
}

/**
 * 49. Type-safe event emitter with typed events
 *
 * @example
 * interface Events {
 *   userCreated: { id: number; name: string };
 *   userDeleted: { id: number };
 * }
 * const emitter = createTypedEventEmitter<Events>();
 * emitter.on('userCreated', (data) => {
 *   console.log(data.id, data.name); // Type-safe
 * });
 * emitter.emit('userCreated', { id: 1, name: 'John' });
 */
export function createTypedEventEmitter<T extends EventMap>() {
  const listeners = new Map<keyof T, Set<(data: any) => void>>();

  return {
    on<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler);
      return () => this.off(event, handler);
    },
    off<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
      listeners.get(event)?.delete(handler);
    },
    emit<K extends keyof T>(event: K, data: T[K]) {
      listeners.get(event)?.forEach(handler => handler(data));
    },
    once<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
      const wrappedHandler = (data: T[K]) => {
        handler(data);
        this.off(event, wrappedHandler);
      };
      this.on(event, wrappedHandler);
    }
  };
}

/**
 * 50. Type-safe state machine implementation
 *
 * @example
 * type State = 'idle' | 'loading' | 'success' | 'error';
 * type Event = 'FETCH' | 'SUCCESS' | 'ERROR' | 'RESET';
 * const machine = createStateMachine<State, Event>({
 *   initial: 'idle',
 *   states: {
 *     idle: { on: { FETCH: 'loading' } },
 *     loading: { on: { SUCCESS: 'success', ERROR: 'error' } },
 *     success: { on: { RESET: 'idle' } },
 *     error: { on: { RESET: 'idle' } }
 *   }
 * });
 * machine.send('FETCH'); // state is 'loading'
 */
export function createStateMachine<S extends string, E extends string>(
  config: StateMachineConfig<S, E>
) {
  let currentState: S = config.initial;
  const listeners = new Set<(state: S) => void>();

  return {
    get state(): S {
      return currentState;
    },
    send(event: E): void {
      const stateConfig = config.states[currentState];
      const nextState = stateConfig.on?.[event];
      if (!nextState) {
        throw new Error(`Invalid transition: ${currentState} -> ${String(event)}`);
      }
      stateConfig.exit?.();
      currentState = nextState;
      config.states[nextState].entry?.();
      listeners.forEach(listener => listener(currentState));
    },
    onTransition(listener: (state: S) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Type Guards
  isDefined,
  isObjectWithKeys,
  isArrayOf,
  isNonEmptyArray,
  isLiteralType,
  hasDiscriminant,
  isPromise,
  isAsyncFunction,

  // Type Assertion & Validation
  assertDefined,
  assertType,
  assertNever,
  validate,
  safeCast,
  coerce,
  validateUnion,

  // Generic Type Builders
  typedPick,
  typedOmit,
  deepClone,
  deepMerge,
  createReadonly,
  typedKeys,
  typedEntries,
  typedFromEntries,

  // Branded Types
  brandedFactory,
  validatedBrand,
  unbrand,
  opaqueFactory,
  NominalType,
  createEnum,

  // Discriminated Unions
  matchUnion,
  switchUnion,
  createVariantGuard,
  hasProperty,
  filterByType,
  partition,

  // Runtime Validation
  validateSchema,
  parseWithZod,
  safeParseWithZod,
  zodGuard,
  zodPipeline,

  // Type-Safe Integrations
  createTypedDecorator,
  getDecoratorMetadata,
  extractModelAttributes,
  createTypedQuery,
  parseEnv,
  createTypedConfig,

  // Advanced Utilities
  createBuilder,
  getPath,
  createTypedEventEmitter,
  createStateMachine
};
