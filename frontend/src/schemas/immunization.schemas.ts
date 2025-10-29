/**
 * Immunization Zod schemas for form validation
 *
 * @module schemas/immunization
 * @description Zod schemas for immunization/vaccination management forms
 * HIPAA CRITICAL: All immunization records contain PHI
 */

import { z } from 'zod';
// import { VaccinationComplianceStatus } from '@/constants/healthRecords';

/**
 * Immunization/Vaccination creation schema
 */
export const immunizationCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineName: z.string()
    .min(1, 'Vaccine name is required')
    .max(255, 'Vaccine name must be less than 255 characters'),
  vaccineType: z.string().max(100).optional(),
  manufacturer: z.string().max(255).optional(),
  lotNumber: z.string().max(100).optional(),
  cvxCode: z.string()
    .regex(/^\d{1,3}$/, 'CVX code must be 1-3 digits')
    .optional()
    .or(z.literal('')),
  ndcCode: z.string()
    .regex(/^\d{5}-\d{4}-\d{2}$/, 'NDC code format: 12345-1234-12')
    .optional()
    .or(z.literal('')),
  doseNumber: z.number().int().positive().optional(),
  totalDoses: z.number().int().positive().optional(),
  seriesComplete: z.boolean().default(false),
  administrationDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid administration date'),
  administeredBy: z.string()
    .min(1, 'Administrator name is required')
    .max(255, 'Administrator name must be less than 255 characters'),
  administeredByRole: z.string().max(100).optional(),
  facility: z.string().max(255).optional(),
  siteOfAdministration: z.enum([
    'LEFT_ARM',
    'RIGHT_ARM',
    'LEFT_THIGH',
    'RIGHT_THIGH',
    'LEFT_DELTOID',
    'RIGHT_DELTOID',
    'LEFT_VASTUS_LATERALIS',
    'RIGHT_VASTUS_LATERALIS',
    'BUTTOCK',
    'ORAL',
    'NASAL',
    'OTHER'
  ]).optional(),
  routeOfAdministration: z.enum([
    'INTRAMUSCULAR',
    'SUBCUTANEOUS',
    'INTRADERMAL',
    'ORAL',
    'NASAL',
    'TRANSDERMAL',
    'OTHER'
  ]).optional(),
  dosageAmount: z.string().max(50).optional(),
  expirationDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid expiration date'),
  nextDueDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid next due date'),
  reactions: z.string().max(2000).optional(),
  exemptionStatus: z.boolean().default(false),
  exemptionReason: z.enum(['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'OTHER']).optional(),
  exemptionDocument: z.string().optional(),
  complianceStatus: z.nativeEnum(VaccinationComplianceStatus, {
    errorMap: () => ({ message: 'Invalid compliance status' })
  }).default('COMPLIANT'),
  vfcEligibility: z.boolean().default(false),
  visProvided: z.boolean().default(false),
  visDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid VIS date'),
  consentObtained: z.boolean().default(false),
  consentBy: z.string().max(255).optional(),
  notes: z.string().max(5000).optional()
}).refine((data) => {
  // If series is specified, both dose number and total doses should be provided
  if (data.doseNumber && !data.totalDoses) {
    return false;
  }
  if (data.totalDoses && !data.doseNumber) {
    return false;
  }
  return true;
}, {
  message: 'Both dose number and total doses must be provided for series vaccines',
  path: ['doseNumber']
}).refine((data) => {
  // If exemption is granted, reason should be provided
  if (data.exemptionStatus && !data.exemptionReason) {
    return false;
  }
  return true;
}, {
  message: 'Exemption reason is required when exemption status is granted',
  path: ['exemptionReason']
}).refine((data) => {
  // If consent is obtained, consentBy should be provided
  if (data.consentObtained && !data.consentBy) {
    return false;
  }
  return true;
}, {
  message: 'Consent provider name is required when consent is obtained',
  path: ['consentBy']
}).refine((data) => {
  // If VIS is provided, VIS date should be provided
  if (data.visProvided && !data.visDate) {
    return false;
  }
  return true;
}, {
  message: 'VIS date is required when VIS is provided',
  path: ['visDate']
});

export type ImmunizationCreateFormData = z.infer<typeof immunizationCreateSchema>;

/**
 * Immunization update schema
 */
export const immunizationUpdateSchema = z.object({
  vaccineName: z.string()
    .min(1, 'Vaccine name is required')
    .max(255, 'Vaccine name must be less than 255 characters')
    .optional(),
  vaccineType: z.string().max(100).optional(),
  manufacturer: z.string().max(255).optional(),
  lotNumber: z.string().max(100).optional(),
  cvxCode: z.string()
    .regex(/^\d{1,3}$/, 'CVX code must be 1-3 digits')
    .optional()
    .or(z.literal('')),
  ndcCode: z.string()
    .regex(/^\d{5}-\d{4}-\d{2}$/, 'NDC code format: 12345-1234-12')
    .optional()
    .or(z.literal('')),
  doseNumber: z.number().int().positive().optional(),
  totalDoses: z.number().int().positive().optional(),
  seriesComplete: z.boolean().optional(),
  administrationDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid administration date'),
  administeredBy: z.string().max(255).optional(),
  administeredByRole: z.string().max(100).optional(),
  facility: z.string().max(255).optional(),
  siteOfAdministration: z.enum([
    'LEFT_ARM',
    'RIGHT_ARM',
    'LEFT_THIGH',
    'RIGHT_THIGH',
    'LEFT_DELTOID',
    'RIGHT_DELTOID',
    'LEFT_VASTUS_LATERALIS',
    'RIGHT_VASTUS_LATERALIS',
    'BUTTOCK',
    'ORAL',
    'NASAL',
    'OTHER'
  ]).optional(),
  routeOfAdministration: z.enum([
    'INTRAMUSCULAR',
    'SUBCUTANEOUS',
    'INTRADERMAL',
    'ORAL',
    'NASAL',
    'TRANSDERMAL',
    'OTHER'
  ]).optional(),
  dosageAmount: z.string().max(50).optional(),
  expirationDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid expiration date'),
  nextDueDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid next due date'),
  reactions: z.string().max(2000).optional(),
  exemptionStatus: z.boolean().optional(),
  exemptionReason: z.enum(['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'OTHER']).optional(),
  exemptionDocument: z.string().optional(),
  complianceStatus: z.nativeEnum(VaccinationComplianceStatus).optional(),
  vfcEligibility: z.boolean().optional(),
  visProvided: z.boolean().optional(),
  visDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid VIS date'),
  consentObtained: z.boolean().optional(),
  consentBy: z.string().max(255).optional(),
  notes: z.string().max(5000).optional()
});

export type ImmunizationUpdateFormData = z.infer<typeof immunizationUpdateSchema>;

/**
 * Immunization search/filter schema
 */
export const immunizationSearchSchema = z.object({
  studentId: z.string().uuid().optional(),
  vaccineName: z.string().optional(),
  vaccineType: z.string().optional(),
  complianceStatus: z.array(z.nativeEnum(VaccinationComplianceStatus)).optional(),
  exemptionStatus: z.boolean().optional(),
  dateFrom: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid from date'),
  dateTo: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid to date'),
  seriesComplete: z.boolean().optional(),
  nextDueDateFrom: z.string().optional(),
  nextDueDateTo: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['administrationDate', 'vaccineName', 'nextDueDate', 'complianceStatus']).default('administrationDate'),
  sortDirection: z.enum(['asc', 'desc']).default('desc')
});

export type ImmunizationSearchFormData = z.infer<typeof immunizationSearchSchema>;

/**
 * Immunization due date alert schema
 */
export const immunizationDueDateAlertSchema = z.object({
  daysThreshold: z.number().int().positive().max(365).default(30),
  includeOverdue: z.boolean().default(true),
  includeExempt: z.boolean().default(false),
  schoolId: z.string().uuid().optional(),
  gradeLevel: z.string().optional()
});

export type ImmunizationDueDateAlertFormData = z.infer<typeof immunizationDueDateAlertSchema>;
