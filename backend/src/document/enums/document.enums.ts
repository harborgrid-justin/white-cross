/**
 * Document Module Enums
 * All enum types for document management with HIPAA compliance
 */

/**
 * Document Category Enum
 * Categorizes documents by type with specific retention requirements
 */
export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',           // 7 years retention, auto-PHI
  INCIDENT_REPORT = 'INCIDENT_REPORT',         // 7 years retention, auto-PHI
  CONSENT_FORM = 'CONSENT_FORM',               // 7 years retention, auto-PHI
  POLICY = 'POLICY',                           // 5 years retention
  TRAINING = 'TRAINING',                       // 5 years retention
  ADMINISTRATIVE = 'ADMINISTRATIVE',           // 3 years retention
  STUDENT_FILE = 'STUDENT_FILE',               // 7 years retention
  INSURANCE = 'INSURANCE',                     // 7 years retention, auto-PHI
  OTHER = 'OTHER',                             // 3 years retention
}

/**
 * Document Status Enum
 * Tracks document lifecycle status
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',                             // Initial state, editable
  PENDING_REVIEW = 'PENDING_REVIEW',           // Awaiting review/approval
  APPROVED = 'APPROVED',                       // Approved/signed, locked
  ARCHIVED = 'ARCHIVED',                       // Archived, read-only
  EXPIRED = 'EXPIRED',                         // Retention period expired
}

/**
 * Document Access Level Enum
 * Controls who can access the document
 */
export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',                           // Accessible to all (policies, general info)
  STAFF_ONLY = 'STAFF_ONLY',                   // School staff only (most documents)
  ADMIN_ONLY = 'ADMIN_ONLY',                   // Administrators only (sensitive records)
  RESTRICTED = 'RESTRICTED',                   // Specific authorization required (legal, personnel)
}

/**
 * Document Action Enum
 * All auditable actions on documents for HIPAA compliance
 */
export enum DocumentAction {
  CREATED = 'CREATED',                         // Document created
  VIEWED = 'VIEWED',                           // Document viewed/accessed
  DOWNLOADED = 'DOWNLOADED',                   // Document downloaded
  UPDATED = 'UPDATED',                         // Metadata updated
  DELETED = 'DELETED',                         // Document deleted
  SHARED = 'SHARED',                           // Document shared with users
  SIGNED = 'SIGNED',                           // Document electronically signed
  ARCHIVED = 'ARCHIVED',                       // Document archived
  RESTORED = 'RESTORED',                       // Document restored from archive
}
