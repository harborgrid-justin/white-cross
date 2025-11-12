/**
 * WF-COMP-325 | incidents/enums.ts - Incident type enumerations
 * Purpose: Enum definitions for incident reporting system
 * Upstream: Backend enums | Dependencies: Aligned with backend/src/database/types/enums.ts
 * Downstream: All incident-related components | Called by: Incident forms, reports, filters
 * Related: entities.ts, requests.ts, responses.ts
 * Exports: Enums | Key Features: Type-safe incident classifications
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type validation → Form submission → API requests
 * LLM Context: Incident reporting enum definitions, aligned with backend schema
 */

/**
 * Incident Reports Module - Enums and Constants
 * All enumeration types for incident classification and status tracking
 */

/**
 * Incident type classification
 * @aligned_with backend/src/database/types/enums.ts:IncidentType
 */
export enum IncidentType {
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  BEHAVIORAL = 'BEHAVIORAL',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

/**
 * Incident severity levels
 * @aligned_with backend/src/database/types/enums.ts:IncidentSeverity
 */
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Incident status tracking (UI-specific)
 * Note: Used for frontend workflow states. Backend tracks status via other fields.
 */
export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Witness type classification
 * @aligned_with backend/src/database/types/enums.ts:WitnessType
 */
export enum WitnessType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  PARENT = 'PARENT',
  OTHER = 'OTHER',
}

/**
 * Follow-up action priority levels
 * @aligned_with backend/src/database/types/enums.ts:ActionPriority
 */
export enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Follow-up action status
 * @aligned_with backend/src/database/types/enums.ts:ActionStatus
 */
export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Insurance claim status tracking
 * @aligned_with backend/src/database/types/enums.ts:InsuranceClaimStatus
 */
export enum InsuranceClaimStatus {
  NOT_FILED = 'NOT_FILED',
  FILED = 'FILED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  CLOSED = 'CLOSED',
}

/**
 * Legal compliance status
 * @aligned_with backend/src/database/types/enums.ts:ComplianceStatus
 */
export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Parent notification methods (UI-specific)
 * Note: Used for tracking notification methods in UI. Not a backend enum.
 */
export enum ParentNotificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  VOICE = 'voice',
  IN_PERSON = 'in-person',
  AUTO_NOTIFICATION = 'auto-notification',
}

/**
 * Evidence file types (UI-specific)
 * Note: Used for UI file type classification. Not a backend enum.
 */
export enum EvidenceType {
  PHOTO = 'photo',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}
