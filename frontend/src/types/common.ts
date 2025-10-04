/**
 * Common types shared across the application
 * These types should be imported by all modules to ensure consistency
 */

// Re-export core types from services
export type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  PaginationResponse,
  DateRangeFilter,
  SearchParams,
  User
} from '../services/types';

// Application-specific common types
export type UserRole = 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED';

export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';

export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

export type MedicationRoute = 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'SUBLINGUAL' | 'RECTAL' | 'OTHER';

export type AppointmentType = 'ROUTINE_CHECKUP' | 'MEDICATION_ADMINISTRATION' | 'INJURY_ASSESSMENT' | 'ILLNESS_EVALUATION' | 'FOLLOW_UP' | 'SCREENING' | 'EMERGENCY';

export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type IncidentType = 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'OTHER';

export type InventoryTransactionType = 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';

export type PurchaseOrderStatus = 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

export type ComplianceStatus = 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';

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