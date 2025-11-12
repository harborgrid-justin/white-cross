/**
 * Document Enums Module
 * All enum types for the document management system
 * No external dependencies - base layer module
 */

/**
 * Document Category Enum
 * Defines all supported document categories in the healthcare system
 */
export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  CONSENT_FORM = 'CONSENT_FORM',
  POLICY = 'POLICY',
  TRAINING = 'TRAINING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  STUDENT_FILE = 'STUDENT_FILE',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

/**
 * Document Status Enum
 * Represents the lifecycle status of a document
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

/**
 * Document Access Level Enum
 * Controls who can access the document based on role and permissions
 */
export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',
  STAFF_ONLY = 'STAFF_ONLY',
  ADMIN_ONLY = 'ADMIN_ONLY',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Document Action Enum
 * All possible actions that can be performed on documents for audit trail
 */
export enum DocumentAction {
  CREATED = 'CREATED',
  VIEWED = 'VIEWED',
  DOWNLOADED = 'DOWNLOADED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  SHARED = 'SHARED',
  SIGNED = 'SIGNED',
}

/**
 * Template Field Type Enum
 * Field types for document templates
 */
export enum TemplateFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}

/**
 * Template Status Enum
 * Status of document templates
 */
export enum TemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Signature Status Enum
 * Status of a signature
 */
export enum SignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Workflow Status Enum
 * Status of a document workflow
 */
export enum WorkflowStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Signature Type Enum
 * Types of signatures supported in the system
 */
export enum SignatureType {
  DIGITAL = 'DIGITAL',
  ELECTRONIC = 'ELECTRONIC',
  BIOMETRIC = 'BIOMETRIC',
  PIN = 'PIN',
  HAND_SIGNATURE = 'HAND_SIGNATURE',
}
