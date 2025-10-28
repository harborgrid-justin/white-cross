/**
 * LOC: 153F4D6759
 * WC-VAL-CPL-058 | complianceValidators.ts - HIPAA/FERPA Compliance Validation Schemas
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-VAL-CPL-058 | complianceValidators.ts - HIPAA/FERPA Compliance Validation Schemas
 * Purpose: Joi validation schemas for regulatory compliance, consent management, policy enforcement
 * Upstream: ../database/types/enums, joi | Dependencies: joi, compliance enums, audit types
 * Downstream: ../routes/compliance.ts, ../services/complianceService.ts | Called by: compliance endpoints
 * Related: ../middleware/auditLogging.ts, ../routes/audit.ts, ../services/auditService.ts
 * Exports: createConsentFormSchema, signConsentFormSchema, createPolicySchema, auditLogFiltersSchema | Key Services: HIPAA compliance validation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Validation Layer
 * Critical Path: Request validation → Compliance check → Data sanitization → Audit logging
 * LLM Context: Healthcare compliance validators with HIPAA/FERPA requirements, digital signatures, consent management, policy enforcement, audit trail validation
 */

/**
 * @fileoverview Compliance Validation Schemas
 * @module validators/complianceValidators
 * @description HIPAA/FERPA compliance validation for consent forms, policies, audit logs, and regulatory reporting
 * @requires joi - Validation library
 * @requires ../database/types/enums - Compliance enums
 * @compliance HIPAA Privacy Rule, FERPA regulations, digital signature requirements, audit trail standards
 * @security Digital signatures, IP address tracking, consent withdrawal, policy acknowledgment
 */

import Joi from 'joi';
import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  ConsentType,
  PolicyCategory,
  PolicyStatus,
  AuditAction
} from '../database/types/enums';

// ============================================================================
// VALIDATION PATTERNS AND CONSTANTS
// ============================================================================

/**
 * @constant {RegExp} versionPattern
 * @description Semantic version number pattern (major.minor or major.minor.patch)
 * @validation Format: X.Y or X.Y.Z where X, Y, Z are integers
 * @example
 * // Valid versions
 * '1.0', '2.1', '3.2.1', '10.5.23'
 *
 * // Invalid
 * '1', 'v1.0', '1.0.0.0', '1.a'
 */
const versionPattern = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;

/**
 * @constant {RegExp} periodPattern
 * @description Reporting period format validation
 * @validation Supports formats:
 * - Quarterly: YYYY-Q1, YYYY-Q2, YYYY-Q3, YYYY-Q4
 * - Monthly: YYYY-01 through YYYY-12
 * - Named months: YYYY-January, YYYY-February, etc.
 * @example
 * // Valid periods
 * '2024-Q1', '2024-Q4', '2024-01', '2024-12', '2024-January', '2024-December'
 *
 * // Invalid
 * '2024', 'Q1-2024', '2024-13', '2024-Q5'
 */
const periodPattern = /^[0-9]{4}-(Q[1-4]|[0-9]{2}|[A-Za-z]+)$/;

/**
 * @constant {RegExp} ipv4Pattern
 * @description IPv4 address validation pattern
 * @validation Format: XXX.XXX.XXX.XXX where XXX is 1-3 digits
 * @security Used for audit trails and digital signature validation
 * @example '192.168.1.1', '10.0.0.1', '172.16.0.1'
 */
const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;

/**
 * @constant {RegExp} ipv6Pattern
 * @description IPv6 address validation pattern
 * @validation Format: Eight groups of 4 hexadecimal digits separated by colons
 * @security Used for audit trails and digital signature validation
 * @example '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
 */
const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;

/**
 * @constant {Array<string>} validRelationships
 * @description Valid relationship types for consent form signatures
 * @compliance Legal guardian verification for healthcare consent
 * @security Ensures only authorized adults can provide consent
 * @example ['Mother', 'Father', 'Legal Guardian', 'Foster Parent', etc.]
 */
const validRelationships = [
  'Mother',
  'Father',
  'Parent',
  'Legal Guardian',
  'Foster Parent',
  'Grandparent',
  'Stepparent',
  'Other Authorized Adult'
];

// ============================================================================
// CONSENT FORM VALIDATION
// ============================================================================

/**
 * @constant {Object} createConsentFormSchema
 * @description Joi validation schema for creating HIPAA/FERPA consent forms
 * @type {Joi.ObjectSchema}
 * @property {string} type - Required, ConsentType enum (HIPAA_AUTHORIZATION, PHOTO_RELEASE, etc.)
 * @property {string} title - Required, trimmed, min 3 chars, max 200 chars
 * @property {string} description - Required, trimmed, min 10 chars, max 5000 chars
 * @property {string} content - Required, trimmed, min 50 chars, max 50000 chars (legal text)
 * @property {string} [version='1.0'] - Optional, semantic version format (X.Y or X.Y.Z)
 * @property {Date} [expiresAt] - Optional, must be in future if provided
 * @compliance
 * - HIPAA Privacy Rule: Requires specific consent for PHI disclosure
 * - FERPA: Requires parental consent for educational records
 * - Minimum lengths ensure legal validity and clarity
 * @security
 * - Content min 50 chars ensures meaningful legal text
 * - Version tracking for audit trail
 * - Expiration date for time-limited consents
 * @example
 * // Valid consent form
 * {
 *   type: 'HIPAA_AUTHORIZATION',
 *   title: 'Authorization for Release of Health Information',
 *   description: 'This form authorizes the school nurse to access and share student health records',
 *   content: 'I hereby authorize Lincoln Elementary School to access, use, and disclose...',
 *   version: '2.1',
 *   expiresAt: '2025-12-31T23:59:59Z'
 * }
 *
 * @example
 * // Invalid - content too short
 * {
 *   type: 'PHOTO_RELEASE',
 *   title: 'Photo Release Form',
 *   description: 'Permission to use photos',
 *   content: 'I agree'  // Less than 50 chars - will fail
 * }
 */
export const createConsentFormSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ConsentType))
    .required()
    .messages({
      'any.only': 'Consent type must be valid',
      'any.required': 'Consent type is required for legal classification'
    }),

  title: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Consent form title must be at least 3 characters',
      'string.max': 'Consent form title cannot exceed 200 characters',
      'any.required': 'Consent form title is required'
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(5000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 5000 characters',
      'any.required': 'Description is required for clarity'
    }),

  content: Joi.string()
    .trim()
    .min(50)
    .max(50000)
    .required()
    .messages({
      'string.min': 'Consent form content must be at least 50 characters for legal validity',
      'string.max': 'Consent form content cannot exceed 50000 characters',
      'any.required': 'Consent form content is required for legal validity'
    }),

  version: Joi.string()
    .trim()
    .pattern(versionPattern)
    .default('1.0')
    .messages({
      'string.pattern.base': 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)'
    }),

  expiresAt: Joi.date()
    .iso()
    .min('now')
    .allow(null)
    .messages({
      'date.min': 'Expiration date must be in the future'
    })
});

/**
 * Schema for updating a consent form
 */
export const updateConsentFormSchema = Joi.object({
  isActive: Joi.boolean()
    .messages({
      'boolean.base': 'isActive must be a boolean value'
    }),

  expiresAt: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Expiration date must be a valid date'
    })
}).min(1);

// ============================================================================
// CONSENT SIGNATURE VALIDATION
// ============================================================================

/**
 * @constant {Object} signConsentFormSchema
 * @description Joi validation schema for digital consent form signatures with legal requirements
 * @type {Joi.ObjectSchema}
 * @property {string} consentFormId - Required UUID of consent form
 * @property {string} studentId - Required UUID of student (subject of consent)
 * @property {string} signedBy - Required, trimmed, min 2 chars, max 200 chars, signatory full name
 * @property {string} relationship - Required, must be valid authorized relationship
 * @property {string} [signatureData] - Optional, min 10 chars, max 100KB, base64 digital signature image
 * @property {string} [ipAddress] - Optional, IPv4 or IPv6 format for audit trail
 * @compliance
 * - Electronic Signatures in Global and National Commerce Act (ESIGN)
 * - Uniform Electronic Transactions Act (UETA)
 * - HIPAA requirement for consent documentation
 * - Legal guardian verification
 * @security
 * - Relationship validation ensures only authorized adults can sign
 * - IP address tracking for non-repudiation
 * - Signature data captures digital signature (optional but recommended)
 * - Audit trail with timestamp and signatory information
 * @example
 * // Valid digital signature
 * {
 *   consentFormId: '123e4567-e89b-12d3-a456-426614174000',
 *   studentId: '987e6543-e21b-43d2-b654-426614174999',
 *   signedBy: 'Sarah Johnson',
 *   relationship: 'Mother',
 *   signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
 *   ipAddress: '192.168.1.100'
 * }
 *
 * @example
 * // Invalid - unauthorized relationship
 * {
 *   consentFormId: '123e4567-e89b-12d3-a456-426614174000',
 *   studentId: '987e6543-e21b-43d2-b654-426614174999',
 *   signedBy: 'John Friend',
 *   relationship: 'Family Friend'  // Not in validRelationships - will fail
 * }
 */
export const signConsentFormSchema = Joi.object({
  consentFormId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Consent form ID must be a valid UUID',
      'any.required': 'Consent form ID is required'
    }),

  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Student ID must be a valid UUID',
      'any.required': 'Student ID is required for consent signature'
    }),

  signedBy: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Signatory name must be at least 2 characters',
      'string.max': 'Signatory name cannot exceed 200 characters',
      'any.required': 'Signatory name is required for legal validity'
    }),

  relationship: Joi.string()
    .valid(...validRelationships)
    .required()
    .messages({
      'any.only': 'Relationship must be a valid authorized relationship type',
      'any.required': 'Relationship to student is required for legal validity'
    }),

  signatureData: Joi.string()
    .min(10)
    .max(100000)
    .allow('', null)
    .messages({
      'string.min': 'Digital signature data appears incomplete',
      'string.max': 'Digital signature data is too large (max 100KB)'
    }),

  ipAddress: Joi.string()
    .pattern(new RegExp(`(${ipv4Pattern.source})|(${ipv6Pattern.source})`))
    .allow('', null)
    .messages({
      'string.pattern.base': 'IP address must be in valid IPv4 or IPv6 format'
    })
});

/**
 * Schema for withdrawing consent
 */
export const withdrawConsentSchema = Joi.object({
  withdrawnBy: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Withdrawn by name must be at least 2 characters',
      'string.max': 'Withdrawn by name cannot exceed 200 characters',
      'any.required': 'Withdrawn by is required for audit trail'
    })
});

// ============================================================================
// POLICY DOCUMENT VALIDATION
// ============================================================================

/**
 * Schema for creating a policy document
 */
export const createPolicySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Policy title must be at least 5 characters',
      'string.max': 'Policy title cannot exceed 200 characters',
      'any.required': 'Policy title is required'
    }),

  category: Joi.string()
    .valid(...Object.values(PolicyCategory))
    .required()
    .messages({
      'any.only': 'Policy category must be valid',
      'any.required': 'Policy category is required for compliance classification'
    }),

  content: Joi.string()
    .trim()
    .min(100)
    .max(100000)
    .required()
    .messages({
      'string.min': 'Policy content must be at least 100 characters',
      'string.max': 'Policy content cannot exceed 100000 characters',
      'any.required': 'Policy content is required'
    }),

  version: Joi.string()
    .trim()
    .pattern(versionPattern)
    .default('1.0')
    .messages({
      'string.pattern.base': 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)'
    }),

  effectiveDate: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'Effective date is required for policy compliance'
    }),

  reviewDate: Joi.date()
    .iso()
    .min(Joi.ref('effectiveDate'))
    .allow(null)
    .messages({
      'date.min': 'Review date must be on or after effective date'
    })
});

/**
 * Schema for updating a policy document
 */
export const updatePolicySchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(PolicyStatus))
    .messages({
      'any.only': 'Policy status must be valid'
    }),

  approvedBy: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Approved by must be a valid UUID'
    }),

  reviewDate: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Review date must be a valid date'
    })
}).min(1);

/**
 * Schema for acknowledging a policy
 */
export const acknowledgePolicySchema = Joi.object({
  ipAddress: Joi.string()
    .pattern(new RegExp(`(${ipv4Pattern.source})|(${ipv6Pattern.source})`))
    .allow('', null)
    .messages({
      'string.pattern.base': 'IP address must be in valid IPv4 or IPv6 format'
    })
});

// ============================================================================
// COMPLIANCE REPORT VALIDATION
// ============================================================================

/**
 * Schema for creating a compliance report
 */
export const createComplianceReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(...Object.values(ComplianceReportType))
    .required()
    .messages({
      'any.only': 'Report type must be valid',
      'any.required': 'Report type is required for compliance tracking'
    }),

  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Report title must be at least 5 characters',
      'string.max': 'Report title cannot exceed 200 characters',
      'any.required': 'Report title is required'
    }),

  description: Joi.string()
    .trim()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Report description cannot exceed 5000 characters'
    }),

  period: Joi.string()
    .trim()
    .pattern(periodPattern)
    .required()
    .messages({
      'string.pattern.base': 'Period must be in format: YYYY-QN (e.g., 2024-Q1) or YYYY-MM (e.g., 2024-01)',
      'any.required': 'Reporting period is required'
    }),

  dueDate: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Due date must be a valid date'
    }),

  createdById: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Created by ID must be a valid UUID',
      'any.required': 'Created by ID is required for audit trail'
    })
});

/**
 * Schema for updating a compliance report
 */
export const updateComplianceReportSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ComplianceStatus))
    .messages({
      'any.only': 'Compliance status must be valid'
    }),

  findings: Joi.object()
    .unknown(true)
    .allow(null)
    .messages({
      'object.base': 'Findings must be a valid object'
    }),

  recommendations: Joi.object()
    .unknown(true)
    .allow(null)
    .messages({
      'object.base': 'Recommendations must be a valid object'
    }),

  submittedBy: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Submitted by must be a valid UUID'
    }),

  reviewedBy: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Reviewed by must be a valid UUID'
    })
}).min(1);

/**
 * Schema for generating a compliance report
 */
export const generateComplianceReportSchema = Joi.object({
  reportType: Joi.string()
    .valid(...Object.values(ComplianceReportType))
    .required()
    .messages({
      'any.only': 'Report type must be valid',
      'any.required': 'Report type is required'
    }),

  period: Joi.string()
    .trim()
    .pattern(periodPattern)
    .required()
    .messages({
      'string.pattern.base': 'Period must be in format: YYYY-QN or YYYY-MM',
      'any.required': 'Period is required'
    }),

  createdById: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Created by ID must be a valid UUID',
      'any.required': 'Created by ID is required'
    })
});

// ============================================================================
// CHECKLIST ITEM VALIDATION
// ============================================================================

/**
 * Schema for creating a checklist item
 */
export const createChecklistItemSchema = Joi.object({
  requirement: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.min': 'Requirement must be at least 5 characters',
      'string.max': 'Requirement cannot exceed 500 characters',
      'any.required': 'Requirement description is required'
    }),

  description: Joi.string()
    .trim()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Description cannot exceed 5000 characters'
    }),

  category: Joi.string()
    .valid(...Object.values(ComplianceCategory))
    .required()
    .messages({
      'any.only': 'Compliance category must be valid',
      'any.required': 'Compliance category is required'
    }),

  dueDate: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Due date must be a valid date'
    }),

  reportId: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Report ID must be a valid UUID'
    })
});

/**
 * Schema for updating a checklist item
 */
export const updateChecklistItemSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ChecklistItemStatus))
    .messages({
      'any.only': 'Checklist item status must be valid'
    }),

  evidence: Joi.string()
    .trim()
    .max(2000)
    .allow('', null)
    .messages({
      'string.max': 'Evidence description cannot exceed 2000 characters'
    }),

  notes: Joi.string()
    .trim()
    .max(5000)
    .allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 5000 characters'
    }),

  completedBy: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'Completed by must be a valid UUID'
    })
}).min(1);

// ============================================================================
// AUDIT LOG VALIDATION
// ============================================================================

/**
 * @constant {Object} createAuditLogSchema
 * @description Joi validation schema for creating immutable audit log entries
 * @type {Joi.ObjectSchema}
 * @property {string} [userId] - Optional UUID, null for system-generated events
 * @property {string} action - Required, AuditAction enum (CREATE, READ, UPDATE, DELETE, LOGIN, etc.)
 * @property {string} entityType - Required, trimmed, min 2 chars, max 100 chars (e.g., 'Student', 'Medication')
 * @property {string} [entityId] - Optional, max 100 chars, ID of affected entity
 * @property {Object} [changes] - Optional JSON object, before/after values for updates
 * @property {string} [ipAddress] - Optional, IPv4 or IPv6 format
 * @property {string} [userAgent] - Optional, max 500 chars, browser/client identification
 * @compliance
 * - HIPAA Security Rule: Audit controls requirement (§164.312(b))
 * - HIPAA Privacy Rule: Accounting of disclosures (§164.528)
 * - FERPA: Record of access to education records (§99.32)
 * - Immutability: Records cannot be modified once created
 * @security
 * - Complete audit trail for all data access and modifications
 * - IP address and user agent for forensic analysis
 * - Changes object captures before/after state
 * - Entity type and ID for granular tracking
 * - Immutable once created (no update schema exists)
 * @example
 * // Valid audit log - user action
 * {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   action: 'UPDATE',
 *   entityType: 'Student',
 *   entityId: '987e6543-e21b-43d2-b654-426614174999',
 *   changes: {
 *     before: { allergyStatus: 'None' },
 *     after: { allergyStatus: 'Peanut allergy' }
 *   },
 *   ipAddress: '192.168.1.50',
 *   userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...'
 * }
 *
 * @example
 * // Valid audit log - system action
 * {
 *   userId: null,  // System-generated
 *   action: 'SYSTEM',
 *   entityType: 'MedicationInventory',
 *   entityId: 'batch-abc123',
 *   changes: {
 *     before: { quantity: 100 },
 *     after: { quantity: 99 }
 *   },
 *   ipAddress: '10.0.0.1'
 * }
 *
 * @example
 * // Invalid - action not in enum
 * {
 *   action: 'MODIFY',  // Not valid AuditAction - will fail
 *   entityType: 'Student',
 *   entityId: '123'
 * }
 */
export const createAuditLogSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.guid': 'User ID must be a valid UUID when provided'
    }),

  action: Joi.string()
    .valid(...Object.values(AuditAction))
    .required()
    .messages({
      'any.only': 'Action must be valid',
      'any.required': 'Action is required for audit trail'
    }),

  entityType: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Entity type must be at least 2 characters',
      'string.max': 'Entity type cannot exceed 100 characters',
      'any.required': 'Entity type is required for audit trail'
    }),

  entityId: Joi.string()
    .max(100)
    .allow('', null)
    .messages({
      'string.max': 'Entity ID cannot exceed 100 characters'
    }),

  changes: Joi.object()
    .unknown(true)
    .allow(null)
    .messages({
      'object.base': 'Changes must be a valid JSON object'
    }),

  ipAddress: Joi.string()
    .pattern(new RegExp(`(${ipv4Pattern.source})|(${ipv6Pattern.source})`))
    .allow('', null)
    .messages({
      'string.pattern.base': 'IP address must be in valid IPv4 or IPv6 format'
    }),

  userAgent: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      'string.max': 'User agent cannot exceed 500 characters'
    })
});

// ============================================================================
// FILTER VALIDATION SCHEMAS
// ============================================================================

/**
 * Schema for compliance report filters
 */
export const complianceReportFiltersSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  reportType: Joi.string()
    .valid(...Object.values(ComplianceReportType))
    .allow('')
    .messages({
      'any.only': 'Report type must be valid'
    }),

  status: Joi.string()
    .valid(...Object.values(ComplianceStatus))
    .allow('')
    .messages({
      'any.only': 'Status must be valid'
    }),

  period: Joi.string()
    .trim()
    .allow('')
    .messages({
      'string.base': 'Period must be a string'
    })
});

/**
 * Schema for audit log filters
 */
export const auditLogFiltersSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50),

  userId: Joi.string()
    .uuid()
    .allow('')
    .messages({
      'string.guid': 'User ID must be a valid UUID'
    }),

  entityType: Joi.string()
    .trim()
    .allow(''),

  action: Joi.string()
    .valid(...Object.values(AuditAction))
    .allow('')
    .messages({
      'any.only': 'Action must be valid'
    }),

  startDate: Joi.date()
    .iso()
    .allow(null),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .allow(null)
    .messages({
      'date.min': 'End date must be on or after start date'
    })
});
