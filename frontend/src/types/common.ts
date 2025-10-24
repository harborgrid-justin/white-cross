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
 * Common types shared across the application
 * These types should be imported by all modules to ensure consistency
 */

// Core API response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
}

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

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * User interface
 * @aligned_with backend/src/database/models/core/User.ts
 *
 * Note: Sensitive fields excluded for security (password, tokens, secrets, failedLoginAttempts)
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // UserRole enum
  isActive: boolean; // Account active status
  lastLogin?: string; // Date from backend
  schoolId?: string; // Associated school UUID
  districtId?: string; // Associated district UUID
  phone?: string; // Phone number
  emailVerified: boolean; // Email verification status
  twoFactorEnabled: boolean; // 2FA enabled status
  lockoutUntil?: string; // Account lockout expiration (Date from backend)
  lastPasswordChange?: string; // Last password change timestamp (Date from backend)
  mustChangePassword: boolean; // Force password change flag
  createdAt: string;
  updatedAt: string;
}

// Define PaginationParams here to avoid circular dependency
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Application-specific common types
// All type unions aligned with backend enums for API compatibility

/**
 * User role enumeration
 * @aligned_with backend/src/database/types/enums.ts:UserRole
 */
export type UserRole = 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'VIEWER' | 'COUNSELOR';

/**
 * Gender enumeration
 * @aligned_with backend/src/database/types/enums.ts:Gender
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
 * Appointment type enumeration
 * @aligned_with backend/src/database/types/enums.ts:AppointmentType
 */
export type AppointmentType = 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';

/**
 * Appointment status enumeration
 * @aligned_with backend/src/database/types/enums.ts:AppointmentStatus
 */
export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

/**
 * Incident type enumeration
 * @aligned_with backend/src/database/types/enums.ts:IncidentType
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
 * @aligned_with backend/src/database/types/enums.ts:MessageType
 */
export type MessageType = 'EMAIL' | 'SMS' | 'PUSH_NOTIFICATION' | 'VOICE';

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

// Base interfaces that can be extended
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BasePersonEntity extends BaseEntity {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface BaseAddressEntity {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface BaseAuditEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

// Utility types for forms and operations
export type CreateRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
export type EntityWithOptionalDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string;
  updatedAt?: string;
};

// Error types for consistent error handling
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

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