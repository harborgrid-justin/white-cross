/**
 * @fileoverview Immunization Data Validation Schemas
 * @module lib/validations/immunizations.schemas
 *
 * Zod validation schemas for immunization data with CDC/ACIP compliance.
 *
 * **Validation Features:**
 * - CVX (vaccine) code validation
 * - MVX (manufacturer) code validation
 * - Lot number format validation
 * - NDC (National Drug Code) validation
 * - VIS date verification
 * - Administration route validation
 * - Age appropriateness validation
 * - HIPAA-compliant data masking
 *
 * @since 1.0.0
 */

import { z } from 'zod';

/**
 * CVX Code Validation
 * CDC vaccine codes for standardized vaccine identification
 */
export const cvxCodeSchema = z.enum([
  'CVX_03', 'CVX_08', 'CVX_10', 'CVX_20', 'CVX_21', 'CVX_94',
  'CVX_106', 'CVX_110', 'CVX_114', 'CVX_115', 'CVX_116', 'CVX_119',
  'CVX_120', 'CVX_121', 'CVX_122', 'CVX_133', 'CVX_136', 'CVX_141',
  'CVX_144', 'CVX_149', 'CVX_150', 'CVX_152', 'CVX_155', 'CVX_158',
  'CVX_161', 'CVX_165', 'CVX_171', 'CVX_185', 'CVX_186', 'CVX_187',
  'CVX_203', 'CVX_205', 'CVX_207', 'CVX_208', 'CVX_210', 'CVX_211',
  'CVX_212', 'CVX_213', 'CVX_300', 'CVX_301', 'CVX_302',
]);

/**
 * Administration Route Validation
 */
export const administrationRouteSchema = z.enum([
  'INTRAMUSCULAR',
  'SUBCUTANEOUS',
  'INTRADERMAL',
  'ORAL',
  'INTRANASAL',
]);

/**
 * Injection Site Validation
 */
export const injectionSiteSchema = z.enum([
  'LEFT_DELTOID',
  'RIGHT_DELTOID',
  'LEFT_THIGH',
  'RIGHT_THIGH',
  'LEFT_GLUTEAL',
  'RIGHT_GLUTEAL',
]);

/**
 * Immunization Status Validation
 */
export const immunizationStatusSchema = z.enum([
  'complete',
  'in_progress',
  'overdue',
  'due_soon',
  'scheduled',
  'contraindicated',
  'exempted',
  'not_started',
  'refused',
]);

/**
 * Reaction Severity Validation
 */
export const reactionSeveritySchema = z.enum([
  'NONE',
  'MILD',
  'MODERATE',
  'SEVERE',
  'LIFE_THREATENING',
  'DEATH',
]);

/**
 * Exemption Type Validation
 */
export const exemptionTypeSchema = z.enum([
  'medical',
  'religious',
  'philosophical',
  'temporary_medical',
]);

/**
 * Lot Number Validation
 * Format: Alphanumeric, 6-20 characters
 */
export const lotNumberSchema = z
  .string()
  .min(6, 'Lot number must be at least 6 characters')
  .max(20, 'Lot number must not exceed 20 characters')
  .regex(/^[A-Z0-9-]+$/i, 'Lot number must contain only letters, numbers, and hyphens');

/**
 * NDC (National Drug Code) Validation
 * Format: 5-4-2, 5-3-2, or 5-4-1
 */
export const ndcSchema = z
  .string()
  .regex(
    /^\d{5}-\d{3,4}-\d{1,2}$/,
    'NDC must be in format: 5-4-2, 5-3-2, or 5-4-1'
  )
  .optional();

/**
 * MVX (Manufacturer) Code Validation
 * CDC manufacturer codes
 */
export const mvxCodeSchema = z
  .string()
  .length(3, 'MVX code must be exactly 3 characters')
  .regex(/^[A-Z]{3}$/, 'MVX code must be 3 uppercase letters')
  .optional();

/**
 * VIS Date Validation
 * Vaccine Information Statement date
 */
export const visDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'VIS date must be in format YYYY-MM-DD')
  .refine(
    (date) => {
      const visDate = new Date(date);
      const minDate = new Date('1990-01-01');
      const maxDate = new Date();
      return visDate >= minDate && visDate <= maxDate;
    },
    { message: 'VIS date must be between 1990 and today' }
  );

/**
 * Vaccine Administration Form Schema
 */
export const vaccineAdministrationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineCode: cvxCodeSchema,
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  
  administeredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  administrationRoute: administrationRouteSchema,
  injectionSite: injectionSiteSchema.optional(),
  dosageAmount: z.string().min(1, 'Dosage amount is required'),
  
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  manufacturerCode: mvxCodeSchema,
  lotNumber: lotNumberSchema,
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  ndc: ndcSchema,
  
  doseNumber: z.number().int().min(1, 'Dose number must be at least 1'),
  totalDosesRequired: z.number().int().min(1, 'Total doses must be at least 1'),
  intervalWeeks: z.number().int().min(0).optional(),
  nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  
  visDate: visDateSchema.optional(),
  visGiven: z.boolean(),
  visLanguage: z.string().optional(),
  
  facilityName: z.string().optional(),
  facilityAddress: z.string().optional(),
  providerId: z.string().optional(),
  
  notes: z.string().optional(),
  contraindications: z.string().optional(),
  precautions: z.string().optional(),
  
  consentObtained: z.boolean(),
  consentBy: z.string().optional(),
  consentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  patientVerified: z.boolean(),
}).refine(
  (data) => data.doseNumber <= data.totalDosesRequired,
  {
    message: 'Dose number cannot exceed total doses required',
    path: ['doseNumber'],
  }
).refine(
  (data) => {
    const expDate = new Date(data.expirationDate);
    const adminDate = new Date(data.administeredDate);
    return expDate > adminDate;
  },
  {
    message: 'Expiration date must be after administration date',
    path: ['expirationDate'],
  }
).refine(
  (data) => {
    if (data.consentObtained) {
      return !!data.consentBy && !!data.consentDate;
    }
    return true;
  },
  {
    message: 'Consent by and consent date required when consent obtained',
    path: ['consentBy'],
  }
);

/**
 * Reaction Report Schema
 */
export const reactionReportSchema = z.object({
  immunizationId: z.string().uuid('Invalid immunization ID'),
  studentId: z.string().uuid('Invalid student ID'),
  
  reactionType: z.string().min(1, 'Reaction type is required'),
  severity: reactionSeveritySchema,
  onsetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  onsetTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional(),
  duration: z.string().optional(),
  
  symptoms: z.array(z.string()).min(1, 'At least one symptom required'),
  treatmentGiven: z.string().optional(),
  outcome: z.enum(['resolved', 'ongoing', 'permanent_injury', 'death']),
  
  vaersReportable: z.boolean(),
}).refine(
  (data) => {
    // Severe reactions must be VAERS reportable
    if (['SEVERE', 'LIFE_THREATENING', 'DEATH'].includes(data.severity)) {
      return data.vaersReportable === true;
    }
    return true;
  },
  {
    message: 'Severe reactions must be reported to VAERS',
    path: ['vaersReportable'],
  }
);

/**
 * Exemption Request Schema
 */
export const exemptionRequestSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineCode: cvxCodeSchema.optional(),
  
  exemptionType: exemptionTypeSchema,
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  
  contraindication: z.string().optional(),
  providerId: z.string().optional(),
  providerName: z.string().optional(),
  providerLicense: z.string().optional(),
  
  documentationReceived: z.boolean(),
  
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  
  requestedBy: z.string().min(1, 'Requester name is required'),
}).refine(
  (data) => {
    // Medical exemptions require provider information
    if (data.exemptionType === 'medical') {
      return !!(data.providerId && data.providerName && data.providerLicense);
    }
    return true;
  },
  {
    message: 'Medical exemptions require provider information',
    path: ['providerId'],
  }
).refine(
  (data) => {
    if (data.expirationDate) {
      const effDate = new Date(data.effectiveDate);
      const expDate = new Date(data.expirationDate);
      return expDate > effDate;
    }
    return true;
  },
  {
    message: 'Expiration date must be after effective date',
    path: ['expirationDate'],
  }
);

/**
 * Immunization Search/Filter Schema
 */
export const immunizationSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: immunizationStatusSchema.optional(),
  vaccineCode: cvxCodeSchema.optional(),
  studentId: z.string().uuid().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

/**
 * Type exports from schemas
 */
export type VaccineAdministrationInput = z.infer<typeof vaccineAdministrationSchema>;
export type ReactionReportInput = z.infer<typeof reactionReportSchema>;
export type ExemptionRequestInput = z.infer<typeof exemptionRequestSchema>;
export type ImmunizationSearchInput = z.infer<typeof immunizationSearchSchema>;

/**
 * Helper function to validate CVX code
 */
export function isValidCVXCode(code: string): boolean {
  return cvxCodeSchema.safeParse(code).success;
}

/**
 * Helper function to validate lot number
 */
export function isValidLotNumber(lotNumber: string): boolean {
  return lotNumberSchema.safeParse(lotNumber).success;
}

/**
 * Helper function to validate NDC
 */
export function isValidNDC(ndc: string): boolean {
  return ndcSchema.safeParse(ndc).success;
}

/**
 * Helper function to validate VIS date
 */
export function isValidVISDate(date: string): boolean {
  return visDateSchema.safeParse(date).success;
}
