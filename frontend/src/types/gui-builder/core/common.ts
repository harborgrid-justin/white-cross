/**
 * Common Utility Types for GUI Builder
 *
 * This module provides foundational utility types used throughout the GUI builder.
 * These types enhance type safety and provide better developer experience.
 *
 * @module gui-builder/core/common
 */

/**
 * Makes specified keys of an object required while keeping others optional.
 *
 * @template T - The object type
 * @template K - Keys to make required
 *
 * @example
 * ```typescript
 * interface User {
 *   id?: string;
 *   name?: string;
 *   email?: string;
 * }
 * type RequiredUser = RequireKeys<User, 'id' | 'email'>;
 * // Result: { id: string; name?: string; email: string }
 * ```
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specified keys of an object optional while keeping others required.
 *
 * @template T - The object type
 * @template K - Keys to make optional
 *
 * @example
 * ```typescript
 * interface Config {
 *   host: string;
 *   port: number;
 *   timeout: number;
 * }
 * type PartialConfig = OptionalKeys<Config, 'port' | 'timeout'>;
 * // Result: { host: string; port?: number; timeout?: number }
 * ```
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes all properties deeply readonly, including nested objects and arrays.
 *
 * @template T - The type to make deeply readonly
 *
 * @example
 * ```typescript
 * interface Config {
 *   server: {
 *     host: string;
 *     ports: number[];
 *   };
 * }
 * type ImmutableConfig = DeepReadonly<Config>;
 * // All nested properties are readonly
 * ```
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * Makes all properties deeply partial, including nested objects and arrays.
 *
 * @template T - The type to make deeply partial
 *
 * @example
 * ```typescript
 * interface Config {
 *   server: {
 *     host: string;
 *     port: number;
 *   };
 * }
 * type PartialConfig = DeepPartial<Config>;
 * // All nested properties are optional
 * ```
 */
export type DeepPartial<T> = T extends (infer R)[]
  ? DeepPartialArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepPartialObject<T>
      : T;

interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}

type DeepPartialObject<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Extract keys from T where the value type extends V.
 *
 * @template T - The object type
 * @template V - The value type to filter by
 *
 * @example
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 *   active: boolean;
 * }
 * type StringKeys = KeysOfType<Person, string>; // 'name'
 * type NumberKeys = KeysOfType<Person, number>; // 'age'
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Create a type that requires at least one of the specified keys.
 *
 * @template T - The object type
 * @template K - Keys where at least one must be present
 *
 * @example
 * ```typescript
 * interface Contact {
 *   email?: string;
 *   phone?: string;
 *   address?: string;
 * }
 * type ValidContact = RequireAtLeastOne<Contact, 'email' | 'phone'>;
 * // Must have email or phone (or both), address is still optional
 * ```
 */
export type RequireAtLeastOne<T, K extends keyof T = keyof T> = Omit<T, K> &
  {
    [P in K]: Required<Pick<T, P>> & Partial<Omit<T, P>>;
  }[K];

/**
 * Create a type that allows exactly one of the specified keys.
 *
 * @template T - The object type
 * @template K - Keys where exactly one must be present
 *
 * @example
 * ```typescript
 * interface AuthMethod {
 *   password?: string;
 *   apiKey?: string;
 *   oauth?: OAuthConfig;
 * }
 * type SingleAuthMethod = RequireExactlyOne<AuthMethod>;
 * // Must have exactly one: password, apiKey, or oauth
 * ```
 */
export type RequireExactlyOne<T, K extends keyof T = keyof T> = {
  [P in K]: Required<Pick<T, P>> & Partial<Record<Exclude<K, P>, never>>;
}[K] &
  Omit<T, K>;

/**
 * Extracts the value type from a promise.
 *
 * @template T - The promise type
 *
 * @example
 * ```typescript
 * type Result = Awaited<Promise<string>>; // string
 * type NestedResult = Awaited<Promise<Promise<number>>>; // number
 * ```
 */
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

/**
 * Creates a union type from an array of string literals.
 *
 * @template T - Array of readonly string literals
 *
 * @example
 * ```typescript
 * const colors = ['red', 'green', 'blue'] as const;
 * type Color = ValueOf<typeof colors>; // 'red' | 'green' | 'blue'
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Represents a value that might not exist yet (lazy initialization).
 *
 * @template T - The value type
 *
 * @example
 * ```typescript
 * type Config = Nullable<AppConfig>;
 * // Config can be AppConfig | null | undefined
 * ```
 */
export type Nullable<T> = T | null | undefined;

/**
 * Removes null and undefined from a type.
 *
 * @template T - The type to make non-nullable
 *
 * @example
 * ```typescript
 * type MaybeString = string | null | undefined;
 * type DefiniteString = NonNullable<MaybeString>; // string
 * ```
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Represents a JSON-serializable value.
 * Useful for ensuring data can be safely serialized/deserialized.
 *
 * @example
 * ```typescript
 * const config: JsonValue = {
 *   host: 'localhost',
 *   port: 3000,
 *   features: ['auth', 'api'],
 * };
 * ```
 */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

/**
 * Metadata that can be attached to any entity.
 * Provides common fields for tracking creation, modification, and ownership.
 *
 * @example
 * ```typescript
 * interface Component extends Metadata {
 *   id: ComponentId;
 *   name: string;
 * }
 * ```
 */
export interface Metadata {
  /**
   * ISO 8601 timestamp of when the entity was created.
   */
  readonly createdAt: string;

  /**
   * ISO 8601 timestamp of when the entity was last updated.
   */
  readonly updatedAt: string;

  /**
   * User ID of the creator.
   */
  readonly createdBy?: string;

  /**
   * User ID of the last modifier.
   */
  readonly updatedBy?: string;

  /**
   * Optional tags for categorization and filtering.
   */
  readonly tags?: readonly string[];

  /**
   * Optional description for documentation.
   */
  readonly description?: string;
}

/**
 * Represents a point in 2D space.
 *
 * @example
 * ```typescript
 * const position: Point = { x: 100, y: 200 };
 * ```
 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/**
 * Represents dimensions in 2D space.
 *
 * @example
 * ```typescript
 * const size: Size = { width: 300, height: 200 };
 * ```
 */
export interface Size {
  readonly width: number;
  readonly height: number;
}

/**
 * Represents a rectangle defined by position and size.
 *
 * @example
 * ```typescript
 * const bounds: Rectangle = {
 *   x: 10,
 *   y: 20,
 *   width: 100,
 *   height: 50,
 * };
 * ```
 */
export interface Rectangle extends Point, Size {}

/**
 * Generic result type for operations that can succeed or fail.
 * Provides type-safe error handling without exceptions.
 *
 * @template T - The success value type
 * @template E - The error type
 *
 * @example
 * ```typescript
 * function parseConfig(input: string): Result<Config, ParseError> {
 *   try {
 *     const config = JSON.parse(input);
 *     return { success: true, data: config };
 *   } catch (error) {
 *     return { success: false, error: new ParseError(error) };
 *   }
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Utility function to create a success result.
 *
 * @template T - The success value type
 * @param data - The success data
 * @returns A success result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Utility function to create an error result.
 *
 * @template E - The error type
 * @param error - The error
 * @returns An error result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}
