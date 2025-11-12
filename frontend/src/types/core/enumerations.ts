/**
 * WF-COMP-319 | enumerations.ts - Type Enumeration Definitions
 * Purpose: Centralized enumeration type aliases aligned with backend enums
 * Upstream: Backend enum definitions | Dependencies: None
 * Downstream: All entities, forms, components | Called by: Application-wide
 * Related: Entity types, validation schemas
 * Exports: UserRole, Gender, Status types, etc. | Key Features: Backend-aligned enums
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type validation → Business logic → Data persistence
 * LLM Context: Enumeration types for domain entities, part of type system refactoring
 */

/**
 * Enumeration Types Module
 *
 * Centralized type aliases for enumeration values used throughout the application.
 * These types are aligned with backend enum definitions to ensure consistency
 * across the full stack.
 *
 * @module types/core/enumerations
 * @category Types
 */

// ============================================================================
// USER AND ACCESS CONTROL ENUMERATIONS
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

// ============================================================================
// PERSON AND DEMOGRAPHIC ENUMERATIONS
// ============================================================================

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
 * Contact priority enumeration
 *
 * Defines the priority level for emergency contacts.
 *
 * @typedef {('PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY')} ContactPriority
 *
 * Values:
 * - PRIMARY: Primary contact, should be contacted first
 * - SECONDARY: Secondary contact, contacted if primary unavailable
 * - EMERGENCY_ONLY: Only contact in emergency situations
 *
 * @aligned_with backend/src/database/types/enums.ts:ContactPriority
 */
export type ContactPriority = 'PRIMARY' | 'SECONDARY' | 'EMERGENCY_ONLY';

// ============================================================================
// HEALTHCARE ENUMERATIONS
// ============================================================================

/**
 * Allergy severity enumeration
 *
 * Indicates the severity level of an allergic reaction.
 *
 * @typedef {('MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING')} AllergySeverity
 *
 * Values:
 * - MILD: Minor symptoms, no intervention typically required
 * - MODERATE: Noticeable symptoms, may require intervention
 * - SEVERE: Serious symptoms, intervention required
 * - LIFE_THREATENING: Anaphylaxis or similar, immediate emergency intervention required
 *
 * @aligned_with backend/src/database/types/enums.ts:AllergySeverity
 */
export type AllergySeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

/**
 * Medication route enumeration (UI-specific detailed list)
 *
 * **Note**: Backend StudentMedication.route is a free STRING field, not enum-validated.
 * This type provides standardized options for UI dropdowns but backend accepts any string.
 *
 * @typedef {('ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'SUBLINGUAL' | 'RECTAL' | 'OTHER')} MedicationRoute
 *
 * Routes:
 * - ORAL: Taken by mouth
 * - TOPICAL: Applied to skin
 * - INJECTION: Injected (IM, IV, SC)
 * - INHALATION: Inhaled (nebulizer, inhaler)
 * - SUBLINGUAL: Under the tongue
 * - RECTAL: Rectal administration
 * - OTHER: Other administration route
 */
export type MedicationRoute = 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'SUBLINGUAL' | 'RECTAL' | 'OTHER';

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
// INVENTORY AND SUPPLY ENUMERATIONS
// ============================================================================

/**
 * Inventory transaction type enumeration
 *
 * Tracks different types of inventory movements.
 *
 * @typedef {('PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL')} InventoryTransactionType
 *
 * Types:
 * - PURCHASE: New inventory purchased
 * - USAGE: Inventory used/consumed
 * - ADJUSTMENT: Manual inventory adjustment (count correction)
 * - TRANSFER: Inventory transferred between locations
 * - DISPOSAL: Inventory disposed/discarded
 *
 * @aligned_with backend/src/database/types/enums.ts:InventoryTransactionType
 */
export type InventoryTransactionType = 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';

/**
 * Purchase order status enumeration
 *
 * Tracks the lifecycle of a purchase order.
 *
 * @typedef {('PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED')} PurchaseOrderStatus
 *
 * Statuses:
 * - PENDING: Awaiting approval
 * - APPROVED: Approved but not yet ordered
 * - ORDERED: Order placed with vendor
 * - PARTIALLY_RECEIVED: Some items received
 * - RECEIVED: All items received
 * - CANCELLED: Order cancelled
 *
 * @aligned_with backend/src/database/types/enums.ts:PurchaseOrderStatus
 */
export type PurchaseOrderStatus = 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

// ============================================================================
// COMPLIANCE AND MESSAGING ENUMERATIONS
// ============================================================================

/**
 * Compliance status enumeration
 *
 * Indicates compliance state for various requirements.
 *
 * @typedef {('PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW')} ComplianceStatus
 *
 * Statuses:
 * - PENDING: Compliance check pending
 * - COMPLIANT: Meets compliance requirements
 * - NON_COMPLIANT: Does not meet requirements
 * - UNDER_REVIEW: Currently being reviewed
 *
 * @aligned_with backend/src/database/types/enums.ts:ComplianceStatus
 */
export type ComplianceStatus = 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';

/**
 * Message priority enumeration
 *
 * Indicates urgency level of a message.
 *
 * @typedef {('LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')} MessagePriority
 *
 * Priorities:
 * - LOW: Low priority, no rush
 * - MEDIUM: Normal priority
 * - HIGH: High priority, timely response needed
 * - URGENT: Urgent, immediate attention required
 *
 * @aligned_with backend/src/database/types/enums.ts:MessagePriority
 */
export type MessagePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Message category enumeration
 *
 * Categorizes messages by purpose/content type.
 *
 * @typedef {('EMERGENCY' | 'HEALTH_UPDATE' | 'APPOINTMENT_REMINDER' | 'MEDICATION_REMINDER' | 'GENERAL' | 'INCIDENT_NOTIFICATION' | 'COMPLIANCE')} MessageCategory
 *
 * Categories:
 * - EMERGENCY: Emergency notification
 * - HEALTH_UPDATE: Health status update
 * - APPOINTMENT_REMINDER: Appointment reminder
 * - MEDICATION_REMINDER: Medication reminder
 * - GENERAL: General message
 * - INCIDENT_NOTIFICATION: Incident notification
 * - COMPLIANCE: Compliance-related message
 *
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
 *
 * Tracks the delivery state of a message.
 *
 * @typedef {('PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED')} DeliveryStatus
 *
 * Statuses:
 * - PENDING: Queued for delivery
 * - SENT: Sent to recipient's server
 * - DELIVERED: Successfully delivered
 * - FAILED: Delivery failed
 * - BOUNCED: Message bounced back
 *
 * @aligned_with backend/src/database/types/enums.ts:DeliveryStatus
 */
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';

/**
 * Recipient type enumeration for message recipients
 *
 * Identifies the type of message recipient.
 *
 * @typedef {('STUDENT' | 'EMERGENCY_CONTACT' | 'PARENT' | 'NURSE' | 'ADMIN')} RecipientType
 *
 * Types:
 * - STUDENT: Student recipient
 * - EMERGENCY_CONTACT: Emergency contact
 * - PARENT: Parent/guardian
 * - NURSE: School nurse
 * - ADMIN: School administrator
 *
 * @aligned_with backend/src/database/types/enums.ts:RecipientType
 */
export type RecipientType = 'STUDENT' | 'EMERGENCY_CONTACT' | 'PARENT' | 'NURSE' | 'ADMIN';

/**
 * Notification method (UI-specific)
 *
 * **Deprecated**: Consider using MessageType for better backend alignment
 *
 * @typedef {('SMS' | 'EMAIL' | 'PHONE' | 'PUSH' | 'IN_APP')} NotificationMethod
 *
 * Methods:
 * - SMS: Text message
 * - EMAIL: Email message
 * - PHONE: Phone call
 * - PUSH: Push notification
 * - IN_APP: In-app notification
 *
 * @deprecated Consider using MessageType for better backend alignment
 */
export type NotificationMethod = 'SMS' | 'EMAIL' | 'PHONE' | 'PUSH' | 'IN_APP';

// ============================================================================
// GENERIC STATUS AND PRIORITY TYPES (UI-SPECIFIC)
// ============================================================================

/**
 * Generic priority type
 *
 * **Deprecated**: Use specific priority types instead: MessagePriority, ActionPriority, WaitlistPriority
 * This generic type doesn't map to a specific backend enum and may cause confusion.
 *
 * @typedef {('LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL')} Priority
 *
 * @deprecated Use specific priority types instead
 */
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

/**
 * Generic status type (UI-specific)
 *
 * **Note**: Not a backend enum. Various models have their own specific status enums.
 * Use model-specific status types when available.
 *
 * @typedef {('ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED')} Status
 *
 * Statuses:
 * - ACTIVE: Currently active
 * - INACTIVE: Currently inactive
 * - PENDING: Pending activation
 * - SUSPENDED: Temporarily suspended
 * - ARCHIVED: Archived/historical
 */
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'ARCHIVED';
