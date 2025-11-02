/**
 * Utility Types Module for White Cross Healthcare Platform
 *
 * Advanced TypeScript utility types for type transformations, type guards,
 * and branded types. These utilities enable robust type safety patterns
 * throughout the application.
 *
 * @module types/utility
 * @category Types
 */

// ============================================================================
// NULLABILITY AND OPTIONALITY UTILITIES
// ============================================================================

/**
 * Makes a type nullable (allows null).
 *
 * @template T - The type to make nullable
 *
 * @example
 * ```typescript
 * type MaybeStudent = Nullable<Student>;
 * const student: MaybeStudent = null; // valid
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Makes a type optional (allows undefined).
 *
 * @template T - The type to make optional
 *
 * @example
 * ```typescript
 * type MaybeEmail = Optional<string>;
 * let email: MaybeEmail = undefined; // valid
 * ```
 */
export type Optional<T> = T | undefined;

// ============================================================================
// DEEP TYPE TRANSFORMATIONS
// ============================================================================

/**
 * Makes all properties of a type deeply partial (recursive).
 *
 * Unlike TypeScript's built-in Partial, this recursively applies
 * optionality to nested objects.
 *
 * @template T - The type to make deeply partial
 *
 * @example
 * ```typescript
 * type PartialStudent = DeepPartial<Student>;
 * const update: PartialStudent = {
 *   emergencyContacts: [{ firstName: 'John' }] // other fields optional
 * };
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties of a type deeply required (recursive).
 *
 * Removes optionality from all properties including nested objects.
 * Opposite of DeepPartial.
 *
 * @template T - The type to make deeply required
 *
 * @example
 * ```typescript
 * type FullStudent = DeepRequired<Partial<Student>>;
 * // All fields including nested objects are now required
 * ```
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// ============================================================================
// KEY AND PROPERTY UTILITIES
// ============================================================================

/**
 * Extracts keys from type T that have values of type V.
 *
 * Useful for finding all string properties, date properties, etc.
 *
 * @template T - The object type to extract from
 * @template V - The value type to match
 *
 * @example
 * ```typescript
 * type StringKeys = KeysOfType<Student, string>;
 * // Result: 'id' | 'firstName' | 'lastName' | 'studentNumber' | ...
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Makes specified keys required while keeping others as-is.
 *
 * @template T - The original type
 * @template K - Keys to make required (must be keys of T)
 *
 * @example
 * ```typescript
 * type StudentWithRequiredEmail = RequiredKeys<Student, 'email'>;
 * // email is now required, all other fields unchanged
 * ```
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Makes specified keys optional while keeping others as-is.
 *
 * @template T - The original type
 * @template K - Keys to make optional (must be keys of T)
 *
 * @example
 * ```typescript
 * type StudentWithOptionalGrade = OptionalKeys<Student, 'grade'>;
 * // grade is now optional, all other fields unchanged
 * ```
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// INDEX SIGNATURE AND RECORD TYPES
// ============================================================================

/**
 * Adds an index signature to a type for dynamic property access.
 *
 * Useful when you need to access properties dynamically while preserving
 * type safety for known properties.
 *
 * @template T - The original type
 *
 * @example
 * ```typescript
 * type DynamicStudent = WithIndexSignature<Student>;
 * const student: DynamicStudent = { ... };
 * const value = student['dynamicKey']; // allowed
 * ```
 */
export type WithIndexSignature<T> = T & { [key: string]: unknown };

/**
 * Typed array with explicit element type (no implicit any).
 *
 * @template T - The array element type
 */
export type TypedArray<T> = T[];

/**
 * Object with unknown properties (safer than `any`).
 *
 * Use this instead of `Record<string, any>` for better type safety.
 *
 * @example
 * ```typescript
 * const data: UnknownRecord = { someKey: 'value', otherKey: 123 };
 * ```
 */
export type UnknownRecord = Record<string, unknown>;

// ============================================================================
// ASYNC AND FUNCTION TYPES
// ============================================================================

/**
 * Promise that resolves to type T.
 *
 * @template T - The type the promise resolves to
 *
 * @example
 * ```typescript
 * type StudentPromise = AsyncResult<Student>;
 * async function loadStudent(): StudentPromise { ... }
 * ```
 */
export type AsyncResult<T> = Promise<T>;

/**
 * Strongly-typed function with explicit parameters and return type.
 *
 * @template TParams - Tuple type of function parameters
 * @template TReturn - Function return type
 *
 * @example
 * ```typescript
 * type CreateStudent = TypedFunction<[CreateStudentData], Student>;
 * const create: CreateStudent = (data) => { ... };
 * ```
 */
export type TypedFunction<TParams extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TParams
) => TReturn;

/**
 * Async function with explicit parameters and return type.
 *
 * @template TParams - Tuple type of function parameters
 * @template TReturn - Type the function's promise resolves to
 *
 * @example
 * ```typescript
 * type FetchStudent = AsyncFunction<[string], Student>;
 * const fetch: FetchStudent = async (id) => { ... };
 * ```
 */
export type AsyncFunction<TParams extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TParams
) => Promise<TReturn>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Generic API response wrapper.
 *
 * Alternative response format to the one in common.ts.
 * Includes HTTP status code explicitly.
 *
 * @template T - Response data type
 *
 * @property {T} data - Response payload
 * @property {number} status - HTTP status code (200, 400, 500, etc.)
 * @property {string} [message] - Success/info message
 * @property {string} [error] - Error message (if status indicates failure)
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  error?: string;
}

/**
 * Paginated API response.
 *
 * @template T - Type of items in the paginated list
 *
 * @property {T[]} data - Array of items for current page
 * @property {number} total - Total number of items across all pages
 * @property {number} page - Current page number (1-indexed)
 * @property {number} pageSize - Number of items per page
 * @property {number} totalPages - Total number of pages
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * List response wrapping array in data property.
 *
 * @template T - Type of items in the list
 *
 * @property {T[]} data - Array of items
 */
export interface ListResponse<T> {
  data: T[];
}

/**
 * Error response from API.
 *
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Machine-readable error code
 * @property {UnknownRecord} [details] - Additional error context
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: UnknownRecord;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

/**
 * Type-safe event handler function.
 *
 * @template T - Event type (default: browser Event)
 *
 * @example
 * ```typescript
 * const onClick: EventHandler<MouseEvent> = (e) => {
 *   console.log(e.clientX, e.clientY);
 * };
 * ```
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Async event handler function.
 *
 * @template T - Event type (default: browser Event)
 *
 * @example
 * ```typescript
 * const onSubmit: AsyncEventHandler<FormEvent> = async (e) => {
 *   e.preventDefault();
 *   await saveData();
 * };
 * ```
 */
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// ============================================================================
// TYPE MANIPULATION UTILITIES
// ============================================================================

/**
 * Ensures a value is not null or undefined (TypeScript built-in override).
 *
 * @template T - The type to make non-nullable
 *
 * @example
 * ```typescript
 * type DefiniteString = NonNullable<string | null | undefined>;
 * // Result: string
 * ```
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Extracts the element type from an array type.
 *
 * @template T - Array type to extract from
 *
 * @example
 * ```typescript
 * type Student[] = Student[];
 * type SingleStudent = ArrayElement<Students>;
 * // Result: Student
 * ```
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Merges two types with the second type's properties overriding the first.
 *
 * @template T - Base type
 * @template U - Override type
 *
 * @example
 * ```typescript
 * type ExtendedStudent = Merge<Student, { customField: string }>;
 * // Student properties + customField
 * ```
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Removes readonly modifiers from all properties (makes mutable).
 *
 * @template T - The type to make mutable
 *
 * @example
 * ```typescript
 * type MutableConfig = Mutable<Readonly<Config>>;
 * // All properties are now writable
 * ```
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Adds readonly modifiers to all properties (makes immutable).
 *
 * @template T - The type to make immutable
 *
 * @example
 * ```typescript
 * type ImmutableStudent = Immutable<Student>;
 * // All properties are now readonly
 * ```
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};

// ============================================================================
// TYPE GUARD HELPER
// ============================================================================

/**
 * Type guard function signature.
 *
 * Functions that narrow types at runtime should conform to this signature.
 *
 * @template T - The type being guarded
 *
 * @example
 * ```typescript
 * const isStudent: TypeGuard<Student> = (value): value is Student => {
 *   return value && typeof value === 'object' && 'studentNumber' in value;
 * };
 * ```
 */
export type TypeGuard<T> = (value: unknown) => value is T;

// ============================================================================
// BRANDED TYPES (Nominal Typing)
// ============================================================================

/**
 * Creates a branded type for nominal typing.
 *
 * Branded types prevent accidental mixing of structurally identical
 * but semantically different types (e.g., UserId vs StudentId).
 *
 * @template T - Base type (usually string or number)
 * @template B - Brand identifier (unique string literal)
 *
 * @example
 * ```typescript
 * type UserId = Brand<string, 'UserId'>;
 * type StudentId = Brand<string, 'StudentId'>;
 *
 * const userId: UserId = 'abc123' as UserId;
 * const studentId: StudentId = userId; // ERROR: Type mismatch
 * ```
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * User identifier (branded string).
 *
 * Prevents accidentally using non-user IDs where user IDs are expected.
 */
export type UserId = Brand<string, 'UserId'>;

/**
 * Student identifier (branded string).
 *
 * Ensures type safety when working with student records.
 */
export type StudentId = Brand<string, 'StudentId'>;

/**
 * Appointment identifier (branded string).
 *
 * Distinct from other ID types for type safety.
 */
export type AppointmentId = Brand<string, 'AppointmentId'>;

/**
 * School identifier (branded string).
 *
 * Used for school-level entity references.
 */
export type SchoolId = Brand<string, 'SchoolId'>;

/**
 * District identifier (branded string).
 *
 * Used for district-level entity references.
 */
export type DistrictId = Brand<string, 'DistrictId'>;

/**
 * ISO 8601 timestamp string (branded).
 *
 * Ensures timestamp strings are properly formatted.
 */
export type Timestamp = Brand<string, 'Timestamp'>;

/**
 * Email address (branded string).
 *
 * Indicates string should be a valid email address.
 */
export type Email = Brand<string, 'Email'>;

/**
 * Phone number (branded string).
 *
 * Indicates string should be a valid phone number (E.164 format recommended).
 */
export type PhoneNumber = Brand<string, 'PhoneNumber'>;

/**
 * URL string (branded).
 *
 * Indicates string should be a valid URL.
 */
export type Url = Brand<string, 'Url'>;
