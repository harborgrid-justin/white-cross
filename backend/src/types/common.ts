/**
 * Common Type Definitions
 *
 * Shared type definitions used across the backend application.
 * These types provide consistency and type safety for common patterns.
 *
 * @module types/common
 */

/**
 * ISO 8601 date-time string
 * @example "2025-11-07T12:00:00Z"
 */
export type ISODateString = string;

/**
 * UUID v4 string identifier
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
export type UUID = string;

/**
 * Email address string
 * @example "user@example.com"
 */
export type EmailAddress = string;

/**
 * Phone number string
 * @example "+1-555-123-4567"
 */
export type PhoneNumber = string;

/**
 * URL string
 * @example "https://example.com"
 */
export type URL = string;

/**
 * JSON string
 */
export type JSONString = string;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Maybe type (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type helper
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Require at least one property from a type
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Require exactly one property from a type
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];

/**
 * Make specific properties required
 */
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Generic result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Entity ID type
 */
export type EntityId = string | number;

/**
 * Timestamp type
 */
export type Timestamp = Date | ISODateString;

/**
 * Record with string keys and typed value
 */
export type StringRecord<T = unknown> = Record<string, T>;

/**
 * Branded type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Opaque type helper
 */
export type Opaque<T, K> = T & { readonly __TYPE__: K };

/**
 * Structured error metadata value type (recursive)
 */
export type ErrorMetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ErrorMetadataValue[]
  | { [key: string]: ErrorMetadataValue };

/**
 * Error metadata with structured typing
 */
export interface ErrorMetadata {
  [key: string]: ErrorMetadataValue;
}

/**
 * Type guard for successful Result
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard for failed Result
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Unwrap a Result type, throwing if failed
 */
export function unwrapResult<T, E extends Error>(result: Result<T, E>): T {
  if (isSuccess(result)) {
    return result.data;
  }
  throw result.error;
}
