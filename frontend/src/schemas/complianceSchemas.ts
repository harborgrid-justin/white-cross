/**
 * Compliance Module Validation Schemas
 *
 * Zod schemas for compliance, consent, policy, and audit operations
 * MATCHES backend Sequelize and Joi validations exactly
 *
 * HIPAA/FERPA COMPLIANCE: These validations ensure regulatory compliance
 * for healthcare data handling, consent management, policy acknowledgment,
 * and audit trail integrity.
 */

import { z } from 'zod';
import {
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  ConsentType,
  PolicyCategory,
  PolicyStatus,
  AuditAction,
} from '../types/compliance';

// ============================================================================
// Constants for Validation
// ============================================================================

const VERSION_PATTERN = /^[0-9]+\.[0-9]+(\.[0-9]+)?$/;
const PERIOD_PATTERN = /^[0-9]{4}-(Q[1-4]|[0-9]{2}|[A-Za-z]+)$/;
const IPV4_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_PATTERN = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;

/**
 * Valid relationship types for consent signatures
 */
const VALID_RELATIONSHIPS = [
  'Mother',
  'Father',
  'Parent',
  'Legal Guardian',
  'Foster Parent',
  'Grandparent',
  'Stepparent',
  'Other Authorized Adult',
] as const;

// ============================================================================
// Base Field Schemas
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Version number validation (e.g., 1.0, 2.1.3)
 */
const versionSchema = z
  .string()
  .regex(VERSION_PATTERN, 'Version must be in format: X.Y or X.Y.Z (e.g., 1.0, 2.1.3)')
  .default('1.0');

/**
 * Period format validation (e.g., 2024-Q1, 2024-01, 2024-January)
 */
const periodSchema = z
  .string()
  .regex(
    PERIOD_PATTERN,
    'Period must be in format: YYYY-QN (e.g., 2024-Q1) or YYYY-MM (e.g., 2024-01)'
  );

/**
 * IP Address validation (IPv4 or IPv6)
 */
const ipAddressSchema = z
  .string()
  .refine(
    (val) => IPV4_PATTERN.test(val) || IPV6_PATTERN.test(val),
    'IP address must be in valid IPv4 or IPv6 format'
  )
  .optional();

/**
 * Relationship validation for consent signatures
 */
const relationshipSchema = z.enum(VALID_RELATIONSHIPS, {
  errorMap: () => ({
    message: 'Relationship must be a valid authorized relationship type',
  }),
});

// ============================================================================
// CONSENT FORM VALIDATION
// ============================================================================

/**
 * Create Consent Form Schema
 * LEGAL REQUIREMENT: All fields must be complete for valid consent
 */
export const createConsentFormSchema = z.object({
  type: z.nativeEnum(ConsentType, {
    errorMap: () => ({ message: 'Consent type is required for legal classification' }),
  }),

  title: z
    .string({ required_error: 'Consent form title is required' })
    .min(3, 'Consent form title must be at least 3 characters')
    .max(200, 'Consent form title cannot exceed 200 characters')
    .transform((val) => val.trim()),

  description: z
    .string({ required_error: 'Description is required for clarity' })
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .transform((val) => val.trim()),

  content: z
    .string({ required_error: 'Consent form content is required for legal validity' })
    .min(50, 'Consent form content must be at least 50 characters for legal validity')
    .max(50000, 'Consent form content cannot exceed 50000 characters')
    .transform((val) => val.trim()),

  version: versionSchema.optional(),

  expiresAt: z
    .string()
    .datetime()
    .refine((val) => new Date(val) > new Date(), 'Expiration date must be in the future')
    .optional()
    .nullable(),
});

/**
 * Update Consent Form Schema
 */
export const updateConsentFormSchema = z.object({
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
});

// ============================================================================
// CONSENT SIGNATURE VALIDATION
// ============================================================================

/**
 * Sign Consent Form Schema
 * LEGAL REQUIREMENT: Digital signature with audit trail
 */
export const signConsentFormSchema = z.object({
  consentFormId: uuidSchema,

  studentId: uuidSchema,

  signedBy: z
    .string({ required_error: 'Signatory name is required for legal validity' })
    .min(2, 'Signatory name must be at least 2 characters')
    .max(200, 'Signatory name cannot exceed 200 characters')
    .transform((val) => val.trim()),

  relationship: relationshipSchema,

  signatureData: z
    .string()
    .min(10, 'Digital signature data appears incomplete')
    .max(100000, 'Digital signature data is too large (max 100KB)')
    .optional()
    .nullable(),

  ipAddress: ipAddressSchema.nullable(),
});

/**
 * Withdraw Consent Schema
 */
export const withdrawConsentSchema = z.object({
  withdrawnBy: z
    .string({ required_error: 'Withdrawn by is required for audit trail' })
    .min(2, 'Withdrawn by name must be at least 2 characters')
    .max(200, 'Withdrawn by name cannot exceed 200 characters')
    .transform((val) => val.trim()),
});

// ============================================================================
// POLICY DOCUMENT VALIDATION
// ============================================================================

/**
 * Create Policy Document Schema
 */
export const createPolicySchema = z.object({
  title: z
    .string({ required_error: 'Policy title is required' })
    .min(5, 'Policy title must be at least 5 characters')
    .max(200, 'Policy title cannot exceed 200 characters')
    .transform((val) => val.trim()),

  category: z.nativeEnum(PolicyCategory, {
    errorMap: () => ({ message: 'Policy category is required for compliance classification' }),
  }),

  content: z
    .string({ required_error: 'Policy content is required' })
    .min(100, 'Policy content must be at least 100 characters')
    .max(100000, 'Policy content cannot exceed 100000 characters')
    .transform((val) => val.trim()),

  version: versionSchema.optional(),

  effectiveDate: z
    .string({ required_error: 'Effective date is required for policy compliance' })
    .datetime(),

  reviewDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.reviewDate) {
      return new Date(data.reviewDate) >= new Date(data.effectiveDate);
    }
    return true;
  },
  {
    message: 'Review date must be on or after effective date',
    path: ['reviewDate'],
  }
);

/**
 * Update Policy Document Schema
 */
export const updatePolicySchema = z.object({
  status: z.nativeEnum(PolicyStatus).optional(),
  approvedBy: uuidSchema.optional().nullable(),
  reviewDate: z.string().datetime().optional().nullable(),
});

/**
 * Acknowledge Policy Schema
 */
export const acknowledgePolicySchema = z.object({
  ipAddress: ipAddressSchema.nullable(),
});

// ============================================================================
// COMPLIANCE REPORT VALIDATION
// ============================================================================

/**
 * Create Compliance Report Schema
 */
export const createComplianceReportSchema = z.object({
  reportType: z.nativeEnum(ComplianceReportType, {
    errorMap: () => ({ message: 'Report type is required for compliance tracking' }),
  }),

  title: z
    .string({ required_error: 'Report title is required' })
    .min(5, 'Report title must be at least 5 characters')
    .max(200, 'Report title cannot exceed 200 characters')
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(5000, 'Report description cannot exceed 5000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  period: periodSchema,

  dueDate: z.string().datetime().optional().nullable(),

  createdById: uuidSchema,
});

/**
 * Update Compliance Report Schema
 */
export const updateComplianceReportSchema = z.object({
  status: z.nativeEnum(ComplianceStatus).optional(),

  findings: z.record(z.any()).optional().nullable(),

  recommendations: z.record(z.any()).optional().nullable(),

  submittedBy: uuidSchema.optional().nullable(),

  reviewedBy: uuidSchema.optional().nullable(),
});

/**
 * Generate Compliance Report Schema
 */
export const generateComplianceReportSchema = z.object({
  reportType: z.nativeEnum(ComplianceReportType, {
    errorMap: () => ({ message: 'Report type is required' }),
  }),

  period: periodSchema,

  createdById: uuidSchema,
});

// ============================================================================
// CHECKLIST ITEM VALIDATION
// ============================================================================

/**
 * Create Checklist Item Schema
 */
export const createChecklistItemSchema = z.object({
  requirement: z
    .string({ required_error: 'Requirement description is required' })
    .min(5, 'Requirement must be at least 5 characters')
    .max(500, 'Requirement cannot exceed 500 characters')
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  category: z.nativeEnum(ComplianceCategory, {
    errorMap: () => ({ message: 'Compliance category is required' }),
  }),

  dueDate: z.string().datetime().optional().nullable(),

  reportId: uuidSchema.optional().nullable(),
});

/**
 * Update Checklist Item Schema
 */
export const updateChecklistItemSchema = z.object({
  status: z.nativeEnum(ChecklistItemStatus).optional(),

  evidence: z
    .string()
    .max(2000, 'Evidence description cannot exceed 2000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(5000, 'Notes cannot exceed 5000 characters')
    .transform((val) => val.trim())
    .optional()
    .nullable(),

  completedBy: uuidSchema.optional().nullable(),
});

// ============================================================================
// AUDIT LOG VALIDATION
// ============================================================================

/**
 * Create Audit Log Schema
 * CRITICAL: This is immutable once created
 */
export const createAuditLogSchema = z.object({
  userId: uuidSchema.optional().nullable(),

  action: z.nativeEnum(AuditAction, {
    errorMap: () => ({ message: 'Action is required for audit trail' }),
  }),

  entityType: z
    .string({ required_error: 'Entity type is required for audit trail' })
    .min(2, 'Entity type must be at least 2 characters')
    .max(100, 'Entity type cannot exceed 100 characters')
    .transform((val) => val.trim()),

  entityId: z
    .string()
    .max(100, 'Entity ID cannot exceed 100 characters')
    .optional()
    .nullable(),

  changes: z.record(z.any()).optional().nullable(),

  ipAddress: ipAddressSchema.nullable(),

  userAgent: z
    .string()
    .max(500, 'User agent cannot exceed 500 characters')
    .optional()
    .nullable(),
});

// ============================================================================
// FILTER VALIDATION SCHEMAS
// ============================================================================

/**
 * Compliance Report Filters Schema
 */
export const complianceReportFiltersSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),

  limit: z.number().int().min(1).max(100).default(20).optional(),

  reportType: z.nativeEnum(ComplianceReportType).optional(),

  status: z.nativeEnum(ComplianceStatus).optional(),

  period: z.string().optional(),
});

/**
 * Consent Form Filters Schema
 */
export const consentFormFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  type: z.nativeEnum(ConsentType).optional(),
});

/**
 * Policy Document Filters Schema
 */
export const policyDocumentFiltersSchema = z.object({
  category: z.nativeEnum(PolicyCategory).optional(),
  status: z.nativeEnum(PolicyStatus).optional(),
});

/**
 * Audit Log Filters Schema
 */
export const auditLogFiltersSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),

  limit: z.number().int().min(1).max(100).default(50).optional(),

  userId: uuidSchema.optional(),

  entityType: z.string().optional(),

  action: z.nativeEnum(AuditAction).optional(),

  startDate: z.string().datetime().optional().nullable(),

  endDate: z.string().datetime().optional().nullable(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  }
);

// ============================================================================
// HIPAA/FERPA COMPLIANCE HELPERS
// ============================================================================

/**
 * Check if consent type requires parental signature
 */
export const requiresParentalConsent = (type: ConsentType): boolean => {
  const parentalConsentTypes: ConsentType[] = [
    ConsentType.MEDICAL_TREATMENT,
    ConsentType.MEDICATION_ADMINISTRATION,
    ConsentType.EMERGENCY_CARE,
    ConsentType.PHOTO_RELEASE,
    ConsentType.DATA_SHARING,
    ConsentType.TELEHEALTH,
    ConsentType.RESEARCH,
  ];
  return parentalConsentTypes.includes(type);
};

/**
 * Check if consent form has expired
 */
export const isConsentExpired = (expiresAt: string | null | undefined): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

/**
 * Check if policy requires annual acknowledgment
 */
export const requiresAnnualAcknowledgment = (category: PolicyCategory): boolean => {
  const annualCategories: PolicyCategory[] = [
    PolicyCategory.HIPAA,
    PolicyCategory.FERPA,
    PolicyCategory.DATA_SECURITY,
  ];
  return annualCategories.includes(category);
};

/**
 * Check if policy is past review date
 */
export const isPastReviewDate = (reviewDate: string | null | undefined): boolean => {
  if (!reviewDate) return false;
  return new Date(reviewDate) < new Date();
};

/**
 * Get recommended review period for policy category (in months)
 */
export const getRecommendedReviewPeriod = (category: PolicyCategory): number => {
  const reviewPeriods: Record<PolicyCategory, number> = {
    [PolicyCategory.HIPAA]: 12,
    [PolicyCategory.FERPA]: 12,
    [PolicyCategory.MEDICATION]: 12,
    [PolicyCategory.EMERGENCY]: 6,
    [PolicyCategory.SAFETY]: 12,
    [PolicyCategory.DATA_SECURITY]: 6,
    [PolicyCategory.OPERATIONAL]: 24,
    [PolicyCategory.TRAINING]: 12,
  };
  return reviewPeriods[category];
};

/**
 * Calculate recommended review date
 */
export const calculateRecommendedReviewDate = (
  category: PolicyCategory,
  effectiveDate: Date = new Date()
): Date => {
  const monthsUntilReview = getRecommendedReviewPeriod(category);
  const reviewDate = new Date(effectiveDate);
  reviewDate.setMonth(reviewDate.getMonth() + monthsUntilReview);
  return reviewDate;
};

/**
 * Validate policy status transition
 */
export const validatePolicyStatusTransition = (
  currentStatus: PolicyStatus,
  newStatus: PolicyStatus
): { valid: boolean; message?: string } => {
  const validTransitions: Record<PolicyStatus, PolicyStatus[]> = {
    [PolicyStatus.DRAFT]: [PolicyStatus.UNDER_REVIEW, PolicyStatus.ACTIVE],
    [PolicyStatus.UNDER_REVIEW]: [PolicyStatus.DRAFT, PolicyStatus.ACTIVE],
    [PolicyStatus.ACTIVE]: [PolicyStatus.ARCHIVED, PolicyStatus.SUPERSEDED],
    [PolicyStatus.ARCHIVED]: [],
    [PolicyStatus.SUPERSEDED]: [],
  };

  const isValid = validTransitions[currentStatus]?.includes(newStatus) ?? false;

  if (!isValid) {
    return {
      valid: false,
      message: `Cannot transition from ${currentStatus} to ${newStatus}`,
    };
  }

  return { valid: true };
};

/**
 * Validate consent signature withdrawal
 */
export const canWithdrawConsent = (
  signedAt: string,
  withdrawnAt: string | null
): { valid: boolean; message?: string } => {
  if (withdrawnAt) {
    return {
      valid: false,
      message: 'Consent has already been withdrawn',
    };
  }

  // Consent can always be withdrawn, regardless of when it was signed
  return { valid: true };
};

// ============================================================================
// Type Exports
// ============================================================================

export type CreateConsentFormInput = z.infer<typeof createConsentFormSchema>;
export type UpdateConsentFormInput = z.infer<typeof updateConsentFormSchema>;
export type SignConsentFormInput = z.infer<typeof signConsentFormSchema>;
export type WithdrawConsentInput = z.infer<typeof withdrawConsentSchema>;

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
export type AcknowledgePolicyInput = z.infer<typeof acknowledgePolicySchema>;

export type CreateComplianceReportInput = z.infer<typeof createComplianceReportSchema>;
export type UpdateComplianceReportInput = z.infer<typeof updateComplianceReportSchema>;
export type GenerateComplianceReportInput = z.infer<typeof generateComplianceReportSchema>;

export type CreateChecklistItemInput = z.infer<typeof createChecklistItemSchema>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;

export type ComplianceReportFiltersInput = z.infer<typeof complianceReportFiltersSchema>;
export type ConsentFormFiltersInput = z.infer<typeof consentFormFiltersSchema>;
export type PolicyDocumentFiltersInput = z.infer<typeof policyDocumentFiltersSchema>;
export type AuditLogFiltersInput = z.infer<typeof auditLogFiltersSchema>;
