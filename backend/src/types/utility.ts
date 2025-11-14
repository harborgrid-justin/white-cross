/**
 * Utility Type Definitions
 *
 * Advanced TypeScript utility types for enhanced type safety and expressiveness.
 * These types provide common patterns for type transformations and constraints.
 *
 * @module types/utility
 */

/**
 * Make all properties of T mutable (remove readonly)
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Make nested properties mutable
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

/**
 * Extract keys from T where the value is of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Extract keys from T where the value is required (not optional)
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Extract keys from T where the value is optional
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Make specified keys nullable
 * Renamed from Nullable to avoid conflict with types/common.ts
 */
export type NullableKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};

/**
 * Make all properties nullable
 */
export type AllNullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Non-nullable version of T (remove null and undefined)
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * Extract function parameter types as a tuple
 */
export type ParameterTypes<T extends (...args: never[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

/**
 * Extract function return type
 */
export type ReturnType<T extends (...args: never[]) => unknown> = T extends (
  ...args: never[]
) => infer R
  ? R
  : never;

/**
 * Extract promise resolution type
 */
export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U>
  ? U
  : never;

/**
 * Extract array element type
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer E)[]
  ? E
  : never;

/**
 * Create a union of all values in T
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a union of all values in nested object T
 */
export type DeepValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: DeepValueOf<T[K]> }>
  : T;

/**
 * Merge two types with B taking precedence over A
 */
export type Merge<A, B> = Omit<A, keyof B> & B;

/**
 * Deep merge two types
 */
export type DeepMerge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never;
};

/**
 * Flatten a nested type into a single level
 */
export type Flatten<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : T;

/**
 * Make a type JSON-serializable
 */
export type JSONSerializable<T> = T extends string | number | boolean | null
  ? T
  : T extends object
    ? { [K in keyof T]: JSONSerializable<T[K]> }
    : never;

/**
 * Constructor type
 */
export type Constructor<T = object> = new (...args: never[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = object> = abstract new (...args: never[]) => T;

/**
 * Function type with any signature
 * @deprecated Consider using more specific function types
 */
export type AnyFunction = (...args: never[]) => unknown;

/**
 * Async function type
 */
export type AsyncFunction<T = unknown> = (...args: never[]) => Promise<T>;

/**
 * Predicate function type
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparator function type
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Transformer function type
 */
export type Transformer<T, U> = (value: T) => U;

/**
 * Type that is either T or a Promise of T
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Type that is either T or an array of T
 */
export type OneOrMany<T> = T | T[];

/**
 * Ensure a type is serializable to JSON
 */
export type Serializable =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Serializable }
  | Serializable[];

/**
 * Deep partial excluding specified keys
 */
export type DeepPartialExcept<T, K extends keyof T> = Omit<T, K> &
  Pick<T, K> & {
    [P in Exclude<keyof T, K>]?: T[P] extends object
      ? DeepPartialExcept<T[P], never>
      : T[P];
  };

/**
 * Type-safe string enum
 */
export type StringEnum<T extends string> = T;

/**
 * Type-safe number enum
 */
export type NumberEnum<T extends number> = T;

/**
 * Unwrap a type from an array
 */
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: never[]) => infer U
    ? U
    : T extends Promise<infer U>
      ? U
      : T;
