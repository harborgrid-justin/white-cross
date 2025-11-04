/**
 * Common types shared across the application
 *
 * @module types/common
 * @category Core Types
 */

/**
 * User role hierarchy
 */
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DISTRICT_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'NURSE'
  | 'COUNSELOR'
  | 'VIEWER'
  | 'PARENT'
  | 'STUDENT';

/**
 * Common entity status
 */
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';

/**
 * Timestamp fields
 */
export interface TimestampFields {
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Base entity interface
 */
export interface BaseEntity extends TimestampFields {
  id: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filter operator
 */
export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Filter condition
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

/**
 * API response union type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Request status for UI state management
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Action result for mutations
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * File upload metadata
 */
export interface FileMetadata {
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string | Date;
  uploadedBy: string;
}

/**
 * Address interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

/**
 * Contact information
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: Address;
}

/**
 * Name parts
 */
export interface NameParts {
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  preferredName?: string;
}

/**
 * Full name helper
 */
export function getFullName(name: NameParts): string {
  const parts = [
    name.firstName,
    name.middleName,
    name.lastName,
    name.suffix
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Date range
 */
export interface DateRange {
  start: string | Date;
  end: string | Date;
}

/**
 * Generic ID type for type safety
 */
export type ID = string | number;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper (includes undefined)
 */
export type Optional<T> = T | undefined | null;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specified keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specified keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Audit trail fields
 */
export interface AuditFields {
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string | Date;
}

/**
 * Soft delete fields
 */
export interface SoftDelete {
  isDeleted: boolean;
  deletedAt?: string | Date;
  deletedBy?: string;
}

/**
 * Feature flag interface
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  enabledFor?: string[]; // User IDs or roles
}

/**
 * Environment type
 */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/**
 * Notification severity
 */
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

/**
 * Generic key-value pair
 */
export interface KeyValuePair<V = string> {
  key: string;
  value: V;
}

/**
 * Option for select inputs
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Search parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sort?: string;
  order?: SortDirection;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult<T = unknown> {
  success: number;
  failed: number;
  total: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
  results?: T[];
}
