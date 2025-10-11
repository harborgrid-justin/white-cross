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

/**
 * Compliance Module Validation Schemas
 *
 * HIPAA/FERPA COMPLIANCE: These validations ensure regulatory compliance
 * for healthcare data handling, consent management, policy acknowledgment,
 * and audit trail integrity.
 *
 * Key Compliance Areas:
 * - Consent form validation (legal requirements)
 * - Digital signature validation
 * - Audit log integrity (immutability)
 * - Policy version control
 * - Compliance reporting standards
 */

// ============================================================================
// CONSENT FORM VALIDATION
// ============================================================================

/**
 * Version number pattern: X.Y or X.Y.Z
 * Examples: 1.0, 2.1, 3.2.1
 */
const versionPattern = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;

/**
 * Period format validation
 * Supports: YYYY-Q1, YYYY-01, YYYY-January
 */
const periodPattern = /^[0-9]{4}-(Q[1-4]|[0-9]{2}|[A-Za-z]+)$/;

/**
 * IP Address validation (IPv4 and IPv6)
 */
const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;

/**
 * Valid relationship types for consent signatures
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

/**
 * Schema for creating a consent form
 * LEGAL REQUIREMENT: All fields must be complete for valid consent
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
 * Schema for signing a consent form
 * LEGAL REQUIREMENT: Digital signature with audit trail
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
 * Schema for creating an audit log entry
 * CRITICAL: This is immutable once created
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
