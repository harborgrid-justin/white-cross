/**
 * Utility Types for White Cross Healthcare Platform
 *
 * Common type patterns used throughout the application to ensure
 * type safety and reduce repetition.
 */

/**
 * Makes a type nullable
 */
export type Nullable<T> = T | null;

/**
 * Makes a type optional (undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Makes all properties of a type deeply partial
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties of a type deeply required
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Extracts keys from T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Makes specified keys required
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Makes specified keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Ensures an object has an index signature for dynamic access
 */
export type WithIndexSignature<T> = T & { [key: string]: unknown };

/**
 * Array with explicit type (no implicit any)
 */
export type TypedArray<T> = T[];

/**
 * Object with unknown properties (safer than any)
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * Promise that resolves to type T
 */
export type AsyncResult<T> = Promise<T>;

/**
 * Function type with explicit parameters and return type
 */
export type TypedFunction<TParams extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TParams
) => TReturn;

/**
 * Async function type
 */
export type AsyncFunction<TParams extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TParams
) => Promise<TReturn>;

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * List response (array wrapped in data property)
 */
export interface ListResponse<T> {
  data: T[];
}

/**
 * Error response
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: UnknownRecord;
}

/**
 * Type-safe event handler
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Async event handler
 */
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

/**
 * Ensures a value is not null or undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Extract array element type
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Merge two types with the second overriding the first
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Make all properties mutable (remove readonly)
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Make all properties immutable (add readonly)
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Type guard helper
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Branded type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * ID types for type safety
 */
export type UserId = Brand<string, 'UserId'>;
export type StudentId = Brand<string, 'StudentId'>;
export type AppointmentId = Brand<string, 'AppointmentId'>;
export type SchoolId = Brand<string, 'SchoolId'>;
export type DistrictId = Brand<string, 'DistrictId'>;

/**
 * Timestamp type (ISO 8601 string)
 */
export type Timestamp = Brand<string, 'Timestamp'>;

/**
 * Email type
 */
export type Email = Brand<string, 'Email'>;

/**
 * Phone number type
 */
export type PhoneNumber = Brand<string, 'PhoneNumber'>;

/**
 * URL type
 */
export type Url = Brand<string, 'Url'>;
