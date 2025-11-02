/**
 * WF-COMP-319 | common.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Common Types Module
 *
 * Centralized type definitions shared across the entire application.
 * These types ensure consistency in API responses, entity structures,
 * and data handling patterns.
 *
 * @module types/common
 * @category Types
 */

/**
 * Generic API response wrapper for all HTTP endpoints.
 *
 * Provides a consistent response structure across all API calls,
 * enabling standardized error handling and data extraction.
 *
 * @template T - The type of data contained in the response
 *
 * @property {T} data - Response payload data
 * @property {boolean} success - Operation success status
 * @property {string} [message] - Optional human-readable message
 * @property {string} [timestamp] - Optional ISO 8601 timestamp of response
 *
 * @example
 * ```typescript
 * const response: ApiResponse<Student> = {
 *   data: { id: '123', firstName: 'John', ... },
 *   success: true,
 *   message: 'Student retrieved successfully',
 *   timestamp: '2025-10-24T00:00:00Z'
 * };
 * ```
 */
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
}

/**
 * Paginated API response for list endpoints.
 *
 * Wraps array data with pagination metadata for implementing
 * efficient list views with page navigation.
 *
 * @template T - The type of items in the data array
 *
 * @property {T[]} data - Array of items for current page
 * @property {Object} pagination - Pagination metadata
 * @property {number} pagination.page - Current page number (1-indexed)
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.total - Total number of items across all pages
 * @property {number} pagination.pages - Total number of pages
 * @property {boolean} success - Operation success status
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   data: [student1, student2, ...],
 *   pagination: { page: 1, limit: 20, total: 150, pages: 8 },
 *   success: true
 * };
 * ```
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
}

/**
 * Pagination metadata for list responses.
 *
 * Standalone pagination information used in various response formats.
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Maximum items per page
 * @property {number} total - Total number of items
 * @property {number} pages - Total number of pages (calculated from total/limit)
 */
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Date range filter for time-based queries.
 *
 * Used to filter records by creation date, modification date,
 * or other timestamp fields.
 *
 * @property {string} [startDate] - ISO 8601 start date (inclusive)
 * @property {string} [endDate] - ISO 8601 end date (inclusive)
 *
 * @example
 * ```typescript
 * const filter: DateRangeFilter = {
 *   startDate: '2025-01-01T00:00:00Z',
 *   endDate: '2025-01-31T23:59:59Z'
 * };
 * ```
 */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

/**
 * Search and filter parameters for query endpoints.
 *
 * Standardized search interface for implementing advanced
 * filtering, sorting, and text search.
 *
 * @property {string} [q] - Full-text search query string
 * @property {Record<string, any>} [filters] - Key-value pairs for filtering
 * @property {string} [sort] - Field name to sort by
 * @property {'asc' | 'desc'} [order] - Sort direction (ascending/descending)
 *
 * @example
 * ```typescript
 * const params: SearchParams = {
 *   q: 'john',
 *   filters: { grade: '10', isActive: true },
 *   sort: 'lastName',
 *   order: 'asc'
 * };
 * ```
 */
export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * User entity representing authenticated system users.
 *
 * Aligned with backend User model. Contains user profile information,
 * authentication status, and organizational relationships.
 *
 * **Security Note**: Sensitive fields (password, tokens, secrets) are
 * excluded from frontend types for security.
 *
 * **PHI Warning**: firstName and lastName may be considered PHI in
 * healthcare context. Handle according to HIPAA requirements.
 *
 * @property {string} id - Unique user identifier (UUID v4)
 * @property {string} email - User email address (unique, used for login)
 * @property {string} firstName - User's first name (1-100 chars)
 * @property {string} lastName - User's last name (1-100 chars)
 * @property {string} role - User role (see UserRole type)
 * @property {boolean} isActive - Account active status (inactive users cannot login)
 * @property {string} [lastLogin] - ISO 8601 timestamp of last successful login
 * @property {string} [schoolId] - Associated school UUID (for school-level users)
 * @property {string} [districtId] - Associated district UUID (for district-level users)
 * @property {string} [phone] - Contact phone number (E.164 format preferred)
 * @property {boolean} emailVerified - Email verification status
 * @property {boolean} twoFactorEnabled - Two-factor authentication enabled status
 * @property {string} [lockoutUntil] - ISO 8601 timestamp until account is locked
 * @property {string} [lastPasswordChange] - ISO 8601 timestamp of last password change
 * @property {boolean} mustChangePassword - Forces password change on next login
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last update timestamp
 *
 * @see {@link backend/src/database/models/core/User.ts} Backend User model
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'a1b2c3d4-...',
 *   email: 'nurse@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   role: 'NURSE',
 *   isActive: true,
 *   emailVerified: true,
 *   twoFactorEnabled: false,
 *   mustChangePassword: false,
 *   createdAt: '2025-01-15T10:00:00Z',
 *   updatedAt: '2025-01-15T10:00:00Z'
 * };
 * ```
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[]; // User permissions for RBAC
  user?: any; // Optional nested user data for complex authentication scenarios
  isActive: boolean;
  lastLogin?: string;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lockoutUntil?: string;
  lastPasswordChange?: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination request parameters for list endpoints.
 *
 * Used to request specific pages of data from paginated endpoints.
 *
 * @property {number} [page] - Page number (1-indexed, default: 1)
 * @property {number} [limit] - Items per page (default varies by endpoint, typically 10-20)
 *
 * @example
 * ```typescript
 * const params: PaginationParams = { page: 2, limit: 25 };
 * ```
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// ENUMERATION TYPES (Aligned with Backend Enums)
// ============================================================================

/**
 * User role enumeration defining system access levels.
 *
 * Determines user permissions, accessible features, and data visibility.
 * Role hierarchy (highest to lowest): ADMIN > DISTRICT_ADMIN > SCHOOL_ADMIN > NURSE > COUNSELOR > VIEWER
 *
 * @typedef {('ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'VIEWER' | 'COUNSELOR')} UserRole
 *
 * Roles:
 * - ADMIN: Full system access, all permissions
 * - DISTRICT_ADMIN: District-wide access and management
 * - SCHOOL_ADMIN: School-level access and management
 * - NURSE: Healthcare provider access (students, medications, health records)
 * - COUNSELOR: Limited access to student health records and incidents
 * - VIEWER: Read-only access to permitted resources
 *
 * @see {@link backend/src/database/types/enums.ts:UserRole} Backend enum definition
 */
export type UserRole = 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'VIEWER' | 'COUNSELOR';

/**
 * Gender enumeration for student and user profiles.
 *
 * Provides inclusive gender options aligned with modern healthcare standards.
 *
 * @typedef {('MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY')} Gender
 *
 * Values:
 * - MALE: Male gender identity
 * - FEMALE: Female gender identity
 * - OTHER: Non-binary or other gender identity
 * - PREFER_NOT_TO_SAY: User chooses not to disclose
 *
 * @see {@link backend/src/database/types/enums.ts:Gender} Backend enum definition
 */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

/**
 * Generic priority type
 * @deprecated Use specific priority types instead: MessagePriority, ActionPriority, WaitlistPriority
 * This generic type doesn't map to a specific backend enum and may cause confusion.
 */
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

/**
 * Generic status type (UI-specific)
 * Note: Not a backend enum. Various models have their own specific status enums.
 */
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED';

/**
 * Contact priority enumeration
 * @aligned_with backend/src/database/types/enums.ts:ContactPriority
 */
export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';

/**
 * Allergy severity enumeration
 * @aligned_with backend/src/database/types/enums.ts:AllergySeverity
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Medication route enumeration (UI-specific detailed list)
 * Note: Backend StudentMedication.route is a free STRING field, not enum-validated.
 * This type provides standardized options for UI dropdowns but backend accepts any string.
 */
export type MedicationRoute = 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'SUBLINGUAL' | 'RECTAL' | 'OTHER';

/**
 * Appointment type enumeration for healthcare visits.
 *
 * NOTE: This type is defined in appointments.ts
 * Import directly from './appointments' or './index' to avoid circular dependencies.
 *
 * @see {@link ./appointments.ts:AppointmentType} for the canonical enum definition
 * @see {@link backend/src/database/types/enums.ts:AppointmentType}
 *
 * @deprecated Import from './appointments' or './index' directly for better type safety
 */
// Removed re-export to break circular dependency: common.ts ↔ appointments.ts
// export type { AppointmentType } from './appointments';

/**
 * Appointment status enumeration tracking appointment lifecycle.
 *
 * NOTE: This type is defined in appointments.ts
 * Import directly from './appointments' or './index' to avoid circular dependencies.
 *
 * @see {@link ./appointments.ts:AppointmentStatus} for the canonical enum definition
 * @see {@link backend/src/database/types/enums.ts:AppointmentStatus}
 *
 * @deprecated Import from './appointments' or './index' directly for better type safety
 */
// Removed re-export to break circular dependency: common.ts ↔ appointments.ts
// export type { AppointmentStatus } from './appointments';

/**
 * Incident type enumeration for health and safety events.
 *
 * @typedef {('INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER')} IncidentType
 *
 * Types:
 * - INJURY: Physical injury incident
 * - ILLNESS: Illness or sickness incident
 * - BEHAVIORAL: Behavioral health incident
 * - MEDICATION_ERROR: Medication administration error
 * - ALLERGIC_REACTION: Allergic reaction event
 * - EMERGENCY: Emergency medical event
 * - OTHER: Other incident type
 *
 * @see {@link backend/src/database/types/enums.ts:IncidentType}
 */
export type IncidentType = 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER';

/**
 * Inventory transaction type enumeration
 * @aligned_with backend/src/database/types/enums.ts:InventoryTransactionType
 */
export type InventoryTransactionType = 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';

/**
 * Purchase order status enumeration
 * @aligned_with backend/src/database/types/enums.ts:PurchaseOrderStatus
 */
export type PurchaseOrderStatus = 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

/**
 * Compliance status enumeration
 * @aligned_with backend/src/database/types/enums.ts:ComplianceStatus
 */
export type ComplianceStatus = 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';

/**
 * Message type enumeration for communication channels
 *
 * NOTE: This type is defined in appointments.ts
 * Import directly from './appointments' or './index' to avoid circular dependencies.
 *
 * @see {@link ./appointments.ts:MessageType} for the canonical enum definition
 * @aligned_with backend/src/database/types/enums.ts:MessageType
 *
 * @deprecated Import from './appointments' or './index' directly for better type safety
 */
// Removed re-export to break circular dependency: common.ts ↔ appointments.ts
// export type { MessageType } from './appointments';

/**
 * Message priority enumeration
 * @aligned_with backend/src/database/types/enums.ts:MessagePriority
 */
export type MessagePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Message category enumeration
 * @aligned_with backend/src/database/types/enums.ts:MessageCategory
 */
export type MessageCategory =
  | 'EMERGENCY'
  | 'HEALTH_UPDATE'
  | 'APPOINTMENT_REMINDER'
  | 'MEDICATION_REMINDER'
  | 'GENERAL'
  | 'INCIDENT_NOTIFICATION'
  | 'COMPLIANCE';

/**
 * Delivery status enumeration for message delivery tracking
 * @aligned_with backend/src/database/types/enums.ts:DeliveryStatus
 */
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';

/**
 * Recipient type enumeration for message recipients
 * @aligned_with backend/src/database/types/enums.ts:RecipientType
 */
export type RecipientType = 'STUDENT' | 'EMERGENCY_CONTACT' | 'PARENT' | 'NURSE' | 'ADMIN';

/**
 * Notification method (UI-specific)
 * @deprecated Consider using MessageType for better backend alignment
 */
export type NotificationMethod = 'SMS' | 'EMAIL' | 'PHONE' | 'PUSH' | 'IN_APP';

// ============================================================================
// BASE ENTITY INTERFACES
// ============================================================================

/**
 * Base entity interface with common database fields.
 *
 * All database entities extend this interface to ensure consistent
 * timestamps and identifier patterns.
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last modification timestamp
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Base interface for person entities (students, contacts, users).
 *
 * Provides common person properties that can be extended by specific
 * person entity types.
 *
 * @extends {BaseEntity}
 * @property {string} firstName - Person's first name
 * @property {string} lastName - Person's last name
 * @property {string} [email] - Email address (optional)
 * @property {string} [phone] - Phone number (optional)
 */
export interface BasePersonEntity extends BaseEntity {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

/**
 * Base interface for entities with physical addresses.
 *
 * @property {string} [address] - Street address line
 * @property {string} [city] - City name
 * @property {string} [state] - State/province code
 * @property {string} [zipCode] - Postal/ZIP code
 * @property {string} [country] - Country name or code
 */
export interface BaseAddressEntity {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * Base interface for auditable entities.
 *
 * Tracks who created and last modified the entity for audit trails.
 *
 * @extends {BaseEntity}
 * @property {string} [createdBy] - UUID of user who created entity
 * @property {string} [updatedBy] - UUID of user who last updated entity
 * @property {number} [version] - Optimistic locking version number
 */
export interface BaseAuditEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

// ============================================================================
// UTILITY TYPES FOR OPERATIONS
// ============================================================================

/**
 * Type helper for create requests that omits auto-generated fields.
 *
 * @template T - The full entity type
 * @example
 * ```typescript
 * type CreateStudentRequest = CreateRequest<Student>;
 * // Omits: id, createdAt, updatedAt
 * ```
 */
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type helper for update requests that makes all fields optional and omits read-only fields.
 *
 * @template T - The full entity type
 * @example
 * ```typescript
 * type UpdateStudentRequest = UpdateRequest<Student>;
 * // All fields optional except: id, createdAt, updatedAt (omitted)
 * ```
 */
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Type helper for entities where timestamp fields are optional.
 *
 * @template T - The full entity type
 */
export type EntityWithOptionalDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Validation error for a specific form field.
 *
 * Used in form validation and API error responses to indicate
 * which field failed validation and why.
 *
 * @property {string} field - Field name that failed validation
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Machine-readable error code
 *
 * @example
 * ```typescript
 * const error: ValidationError = {
 *   field: 'email',
 *   message: 'Email address is invalid',
 *   code: 'INVALID_EMAIL'
 * };
 * ```
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * API error response structure.
 *
 * Standardized error format returned by all API endpoints.
 *
 * @property {string} message - Human-readable error description
 * @property {string} [code] - Machine-readable error code
 * @property {number} [statusCode] - HTTP status code (400, 404, 500, etc.)
 * @property {unknown} [details] - Additional error context
 * @property {ValidationError[]} [validation] - Field-level validation errors
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   message: 'Validation failed',
 *   code: 'VALIDATION_ERROR',
 *   statusCode: 400,
 *   validation: [
 *     { field: 'email', message: 'Email is required' },
 *     { field: 'age', message: 'Age must be a positive number' }
 *   ]
 * };
 * ```
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  validation?: ValidationError[];
}

// Filter and search types
export interface BaseFilters {
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

export interface PersonFilters extends BaseFilters {
  name?: string;
  email?: string;
  role?: UserRole;
}

// Pagination and sorting
export interface SortParams {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface PaginatedRequest extends PaginationParams {
  sort?: SortParams[];
  filters?: Record<string, unknown>;
  search?: string;
}

// Healthcare specific types
export interface HealthcareProvider extends BasePersonEntity {
  npi?: string;
  licenseNumber?: string;
  specialty?: string;
  organization?: string;
}

export interface EmergencyContact extends BasePersonEntity {
  relationship: string;
  phoneNumber: string;
  address?: string;
  priority: ContactPriority;
  isActive: boolean;
}

// File and document types
export interface FileUpload {
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  createdAt: string;
  createdBy?: string;
}

// Notification and communication types
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  emergencyOnly?: boolean;
}

export interface CommunicationLog extends BaseEntity {
  type: NotificationMethod;
  to: string;
  subject?: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING';
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
}

// Student interface for healthcare platform
export interface Student extends BaseEntity {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  gender: Gender;
  photo?: string;
  medicalRecordNum?: string;
  isActive: boolean;
  enrollmentDate: string;
  emergencyContacts?: EmergencyContact[];
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Security and audit types
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, unknown>;
}

// Configuration types
export interface SystemSettings {
  key: string;
  value: string;
  description?: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  isPublic: boolean;
  category?: string;
}

// Integration types
export interface IntegrationStatus {
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSync?: string;
  errorMessage?: string;
  nextSync?: string;
}
