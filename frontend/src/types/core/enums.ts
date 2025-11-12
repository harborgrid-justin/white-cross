/**
 * WF-COMP-319 | enums.ts - Type Enumeration Definitions
 * Purpose: Centralized enumeration types aligned with backend enum definitions
 * Upstream: Backend enums.ts | Dependencies: None
 * Downstream: All domain types, UI components | Called by: Type consumers
 * Related: All type modules
 * Exports: String literal union types for type-safe enumerations
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type validation → Business logic → Data persistence
 * LLM Context: Enumeration types extracted from common.ts, aligned with backend enums
 */

/**
 * Enumeration Types Module
 *
 * Type enumerations aligned with backend enum definitions. These types ensure
 * type safety and consistency across frontend-backend communication.
 *
 * @module types/core/enums
 * @category Types
 */

// ============================================================================
// USER AND AUTHENTICATION ENUMS
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

// ============================================================================
// GENERIC STATUS AND PRIORITY TYPES (UI-SPECIFIC)
// ============================================================================

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

// ============================================================================
// CONTACT AND RELATIONSHIP ENUMS
// ============================================================================

/**
 * Contact priority enumeration
 * @aligned_with backend/src/database/types/enums.ts:ContactPriority
 */
export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';

// ============================================================================
// HEALTHCARE AND MEDICAL ENUMS
// ============================================================================

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

// ============================================================================
// INCIDENT AND SAFETY ENUMS
// ============================================================================

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

// ============================================================================
// INVENTORY AND SUPPLY MANAGEMENT ENUMS
// ============================================================================

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

// ============================================================================
// COMPLIANCE AND REGULATORY ENUMS
// ============================================================================

/**
 * Compliance status enumeration
 * @aligned_with backend/src/database/types/enums.ts:ComplianceStatus
 */
export type ComplianceStatus = 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';

// ============================================================================
// MESSAGING AND COMMUNICATION ENUMS
// ============================================================================

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
// APPOINTMENT TYPES (DEFINED IN APPOINTMENTS.TS)
// ============================================================================

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
