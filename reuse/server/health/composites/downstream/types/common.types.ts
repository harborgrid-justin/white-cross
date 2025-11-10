/**
 * Common Types and Utilities
 *
 * Shared type definitions used across all healthcare downstream composites.
 * Provides base interfaces, generic types, error types, and utility types.
 *
 * @module common.types
 * @since 1.0.0
 */

/**
 * Standard operation result wrapper
 *
 * @template T - The type of data returned on success
 *
 * @example
 * ```typescript
 * const result: OperationResult<Patient> = {
 *   success: true,
 *   data: patientRecord,
 *   message: 'Patient retrieved successfully'
 * };
 * ```
 */
export interface OperationResult<T> {
  /** Whether the operation succeeded */
  success: boolean;

  /** The data returned (present if success is true) */
  data?: T;

  /** Error details (present if success is false) */
  error?: OperationError;

  /** Human-readable message */
  message?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Standard error structure for operation failures
 *
 * @example
 * ```typescript
 * const error: OperationError = {
 *   code: 'PATIENT_NOT_FOUND',
 *   message: 'Patient with ID PAT-123 not found',
 *   details: { patientId: 'PAT-123' },
 *   timestamp: new Date()
 * };
 * ```
 */
export interface OperationError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Additional error details */
  details?: Record<string, unknown>;

  /** Stack trace (for development/debugging) */
  stack?: string;

  /** When the error occurred */
  timestamp: Date;
}

/**
 * Pagination parameters for list operations
 *
 * @example
 * ```typescript
 * const pagination: PaginationParams = {
 *   page: 1,
 *   pageSize: 25,
 *   sortBy: 'lastName',
 *   sortOrder: 'asc'
 * };
 * ```
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number;

  /** Number of items per page */
  pageSize: number;

  /** Field to sort by */
  sortBy?: string;

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 *
 * @template T - The type of items in the page
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Patient> = {
 *   items: [patient1, patient2, patient3],
 *   totalItems: 150,
 *   totalPages: 6,
 *   currentPage: 1,
 *   pageSize: 25
 * };
 * ```
 */
export interface PaginatedResponse<T> {
  /** Items in the current page */
  items: T[];

  /** Total number of items across all pages */
  totalItems: number;

  /** Total number of pages */
  totalPages: number;

  /** Current page number (1-indexed) */
  currentPage: number;

  /** Number of items per page */
  pageSize: number;

  /** Whether there is a next page */
  hasNextPage?: boolean;

  /** Whether there is a previous page */
  hasPreviousPage?: boolean;
}

/**
 * Identifier types used across the system
 */
export type IdentifierType =
  | 'MRN'           // Medical Record Number
  | 'SSN'           // Social Security Number
  | 'DL'            // Driver's License
  | 'PASSPORT'      // Passport Number
  | 'UUID'          // System UUID
  | 'FACILITY_ID'   // Facility Identifier
  | 'PROVIDER_NPI'  // Provider NPI
  | 'TAX_ID'        // Tax ID
  | 'DEA'           // DEA Number
  | 'STATE_LICENSE' // State Medical License
  | 'CUSTOM';       // Custom identifier

/**
 * Standard identifier structure
 *
 * @example
 * ```typescript
 * const mrn: Identifier = {
 *   type: 'MRN',
 *   value: 'MRN-123456',
 *   system: 'EPIC',
 *   assignedDate: new Date('2020-01-15')
 * };
 * ```
 */
export interface Identifier {
  /** Type of identifier */
  type: IdentifierType;

  /** The identifier value */
  value: string;

  /** System that assigned the identifier */
  system?: string;

  /** When the identifier was assigned */
  assignedDate?: Date;

  /** Whether the identifier is currently active */
  isActive?: boolean;
}

/**
 * Address structure following USPS standards
 *
 * @example
 * ```typescript
 * const address: Address = {
 *   line1: '123 Main Street',
 *   line2: 'Apt 4B',
 *   city: 'Boston',
 *   state: 'MA',
 *   postalCode: '02101',
 *   country: 'USA',
 *   type: 'home'
 * };
 * ```
 */
export interface Address {
  /** Street address line 1 */
  line1: string;

  /** Street address line 2 (apartment, suite, etc.) */
  line2?: string;

  /** City */
  city: string;

  /** State/Province (2-letter code for US) */
  state: string;

  /** Postal/ZIP code */
  postalCode: string;

  /** Country code (ISO 3166-1 alpha-3) */
  country: string;

  /** Address type */
  type?: 'home' | 'work' | 'billing' | 'temporary' | 'other';

  /** Whether this is the primary address */
  isPrimary?: boolean;

  /** Effective date range */
  effectiveDate?: Date;
  expirationDate?: Date;
}

/**
 * Phone number structure
 *
 * @example
 * ```typescript
 * const phone: PhoneNumber = {
 *   number: '+1-617-555-0123',
 *   type: 'mobile',
 *   isPrimary: true,
 *   canReceiveSMS: true
 * };
 * ```
 */
export interface PhoneNumber {
  /** Phone number in E.164 format (+1-XXX-XXX-XXXX) */
  number: string;

  /** Phone type */
  type: 'home' | 'work' | 'mobile' | 'fax' | 'other';

  /** Whether this is the primary phone */
  isPrimary?: boolean;

  /** Whether this number can receive SMS */
  canReceiveSMS?: boolean;

  /** Extension (for work phones) */
  extension?: string;
}

/**
 * Email structure
 *
 * @example
 * ```typescript
 * const email: Email = {
 *   address: 'patient@example.com',
 *   type: 'personal',
 *   isVerified: true,
 *   isPrimary: true
 * };
 * ```
 */
export interface Email {
  /** Email address */
  address: string;

  /** Email type */
  type: 'personal' | 'work' | 'other';

  /** Whether the email has been verified */
  isVerified?: boolean;

  /** Whether this is the primary email */
  isPrimary?: boolean;
}

/**
 * Communication preferences
 *
 * @example
 * ```typescript
 * const preferences: CommunicationPreferences = {
 *   preferredMethod: 'email',
 *   smsEnabled: true,
 *   emailEnabled: true,
 *   phoneEnabled: false,
 *   portalEnabled: true,
 *   language: 'en',
 *   optOutMarketing: false
 * };
 * ```
 */
export interface CommunicationPreferences {
  /** Preferred communication method */
  preferredMethod: 'email' | 'sms' | 'phone' | 'portal' | 'mail';

  /** Whether SMS notifications are enabled */
  smsEnabled: boolean;

  /** Whether email notifications are enabled */
  emailEnabled: boolean;

  /** Whether phone calls are enabled */
  phoneEnabled: boolean;

  /** Whether portal notifications are enabled */
  portalEnabled: boolean;

  /** Whether push notifications are enabled */
  pushEnabled?: boolean;

  /** Preferred language (ISO 639-1 code) */
  language: string;

  /** Whether opted out of marketing communications */
  optOutMarketing?: boolean;

  /** Best time to contact */
  bestTimeToContact?: 'morning' | 'afternoon' | 'evening' | 'any';
}

/**
 * Audit trail entry for HIPAA compliance
 *
 * @example
 * ```typescript
 * const audit: AuditEntry = {
 *   action: 'PATIENT_RECORD_VIEWED',
 *   userId: 'USER-123',
 *   userName: 'Dr. Smith',
 *   timestamp: new Date(),
 *   resourceType: 'Patient',
 *   resourceId: 'PAT-456',
 *   ipAddress: '192.168.1.100',
 *   success: true
 * };
 * ```
 */
export interface AuditEntry {
  /** Action performed */
  action: string;

  /** User who performed the action */
  userId: string;

  /** User's full name */
  userName: string;

  /** When the action occurred */
  timestamp: Date;

  /** Type of resource accessed */
  resourceType: string;

  /** ID of resource accessed */
  resourceId: string;

  /** IP address of the request */
  ipAddress?: string;

  /** User agent string */
  userAgent?: string;

  /** Whether the action succeeded */
  success: boolean;

  /** Error message if action failed */
  errorMessage?: string;

  /** Additional context */
  metadata?: Record<string, unknown>;

  /** Session ID */
  sessionId?: string;
}

/**
 * Status types used across various entities
 */
export type EntityStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'cancelled'
  | 'completed'
  | 'in_progress'
  | 'failed'
  | 'archived';

/**
 * Priority levels
 */
export type PriorityLevel =
  | 'routine'
  | 'urgent'
  | 'stat'
  | 'asap'
  | 'callback';

/**
 * Gender types following HL7 standards
 */
export type Gender =
  | 'male'
  | 'female'
  | 'other'
  | 'unknown';

/**
 * Ethnicity types following CDC standards
 */
export type Ethnicity =
  | 'hispanic_latino'
  | 'not_hispanic_latino'
  | 'unknown'
  | 'declined';

/**
 * Race types following CDC standards
 */
export type Race =
  | 'american_indian_alaska_native'
  | 'asian'
  | 'black_african_american'
  | 'native_hawaiian_pacific_islander'
  | 'white'
  | 'other'
  | 'unknown'
  | 'declined';

/**
 * Marital status types
 */
export type MaritalStatus =
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed'
  | 'separated'
  | 'domestic_partner'
  | 'unknown';

/**
 * Date range filter
 *
 * @example
 * ```typescript
 * const dateRange: DateRange = {
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * };
 * ```
 */
export interface DateRange {
  /** Start date (inclusive) */
  startDate: Date;

  /** End date (inclusive) */
  endDate: Date;
}

/**
 * Type guard to check if an error is an OperationError
 *
 * @param error - The error to check
 * @returns True if the error is an OperationError
 *
 * @example
 * ```typescript
 * try {
 *   // operation
 * } catch (error: unknown) {
 *   if (isOperationError(error)) {
 *     console.log(error.code, error.message);
 *   }
 * }
 * ```
 */
export function isOperationError(error: unknown): error is OperationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error
  );
}

/**
 * Type guard to check if a value is a valid date
 *
 * @param value - The value to check
 * @returns True if the value is a valid Date
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard to check if a string is a valid email
 *
 * @param value - The string to check
 * @returns True if the string is a valid email format
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Type guard to check if a string is a valid phone number
 *
 * @param value - The string to check
 * @returns True if the string is a valid E.164 phone format
 */
export function isValidPhoneNumber(value: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value.replace(/[-\s()]/g, ''));
}
