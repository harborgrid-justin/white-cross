/**
 * Allergy Zod schemas for form validation
 *
 * @module schemas/allergy
 * @description Zod schemas for allergy management forms
 * HIPAA CRITICAL: All allergy records contain PHI and are EMERGENCY-CRITICAL
 */

import { z } from 'zod';
// import { AllergyType } from '@/constants/healthRecords';

/**
 * AllergySeverity enum for validation
 */
export const AllergySeverityEnum = z.enum([
  'MILD',
  'MODERATE',
  'SEVERE',
  'LIFE_THREATENING'
], {
  errorMap: () => ({ message: 'Invalid allergy severity level' })
});

/**
 * Allergy creation schema
 */
export const allergyCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  allergen: z.string()
    .min(1, 'Allergen name is required')
    .max(255, 'Allergen name must be less than 255 characters'),
  allergyType: z.nativeEnum(AllergyType, {
    errorMap: () => ({ message: 'Invalid allergy type' })
  }),
  severity: AllergySeverityEnum,
  symptoms: z.string()
    .max(2000, 'Symptoms description must be less than 2000 characters')
    .optional(),
  treatment: z.string()
    .max(2000, 'Treatment description must be less than 2000 characters')
    .optional(),
  emergencyProtocol: z.string()
    .max(5000, 'Emergency protocol must be less than 5000 characters')
    .optional(),
  onsetDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid onset date'),
  diagnosedDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid diagnosis date'),
  diagnosedBy: z.string()
    .max(255, 'Diagnosed by must be less than 255 characters')
    .optional(),
  verified: z.boolean().default(false),
  verifiedBy: z.string().optional(),
  verificationDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid verification date'),
  active: z.boolean().default(true),
  epiPenRequired: z.boolean().default(false),
  epiPenLocation: z.string()
    .max(255, 'EpiPen location must be less than 255 characters')
    .optional(),
  epiPenExpiration: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid EpiPen expiration date'),
  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional()
}).refine((data) => {
  // If EpiPen is required, location and expiration should be provided
  if (data.epiPenRequired && !data.epiPenLocation) {
    return false;
  }
  return true;
}, {
  message: 'EpiPen location is required when EpiPen is needed',
  path: ['epiPenLocation']
}).refine((data) => {
  // If EpiPen is required, expiration date should be provided
  if (data.epiPenRequired && !data.epiPenExpiration) {
    return false;
  }
  return true;
}, {
  message: 'EpiPen expiration date is required when EpiPen is needed',
  path: ['epiPenExpiration']
}).refine((data) => {
  // For SEVERE or LIFE_THREATENING allergies, emergency protocol should be provided
  if ((data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING') && !data.emergencyProtocol) {
    return false;
  }
  return true;
}, {
  message: 'Emergency protocol is required for severe or life-threatening allergies',
  path: ['emergencyProtocol']
}).refine((data) => {
  // If verified, verifiedBy and verificationDate should be provided
  if (data.verified && !data.verifiedBy) {
    return false;
  }
  return true;
}, {
  message: 'Verifier information is required when allergy is verified',
  path: ['verifiedBy']
});

export type AllergyCreateFormData = z.infer<typeof allergyCreateSchema>;

/**
 * Allergy update schema
 */
export const allergyUpdateSchema = z.object({
  allergen: z.string()
    .min(1, 'Allergen name is required')
    .max(255, 'Allergen name must be less than 255 characters')
    .optional(),
  allergyType: z.nativeEnum(AllergyType).optional(),
  severity: AllergySeverityEnum.optional(),
  symptoms: z.string().max(2000).optional(),
  treatment: z.string().max(2000).optional(),
  emergencyProtocol: z.string().max(5000).optional(),
  onsetDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid onset date'),
  diagnosedDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid diagnosis date'),
  diagnosedBy: z.string().max(255).optional(),
  verified: z.boolean().optional(),
  verifiedBy: z.string().optional(),
  verificationDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid verification date'),
  active: z.boolean().optional(),
  epiPenRequired: z.boolean().optional(),
  epiPenLocation: z.string().max(255).optional(),
  epiPenExpiration: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid EpiPen expiration date'),
  notes: z.string().max(5000).optional()
});

export type AllergyUpdateFormData = z.infer<typeof allergyUpdateSchema>;

/**
 * Allergy search/filter schema
 */
export const allergySearchSchema = z.object({
  studentId: z.string().uuid().optional(),
  allergyType: z.array(z.nativeEnum(AllergyType)).optional(),
  severity: z.array(AllergySeverityEnum).optional(),
  active: z.boolean().optional(),
  verified: z.boolean().optional(),
  epiPenRequired: z.boolean().optional(),
  allergen: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['allergen', 'severity', 'diagnosedDate', 'allergyType']).default('severity'),
  sortDirection: z.enum(['asc', 'desc']).default('desc')
});

export type AllergySearchFormData = z.infer<typeof allergySearchSchema>;

/**
 * Allergy reaction incident schema
 * For documenting allergic reactions when they occur
 */
export const allergyReactionSchema = z.object({
  allergyId: z.string().uuid('Invalid allergy ID'),
  studentId: z.string().uuid('Invalid student ID'),
  incidentDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid incident date'),
  symptoms: z.string()
    .min(1, 'Symptoms description is required')
    .max(2000, 'Symptoms must be less than 2000 characters'),
  severity: AllergySeverityEnum,
  triggerExposure: z.string()
    .min(1, 'Trigger/exposure description is required')
    .max(1000, 'Trigger description must be less than 1000 characters'),
  treatmentGiven: z.string()
    .min(1, 'Treatment description is required')
    .max(2000, 'Treatment description must be less than 2000 characters'),
  epiPenAdministered: z.boolean().default(false),
  epiPenAdministeredBy: z.string().max(255).optional(),
  emergencyServicesContacted: z.boolean().default(false),
  parentNotified: z.boolean().default(false),
  parentNotifiedAt: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid notification time'),
  outcome: z.enum([
    'RESOLVED_AT_SCHOOL',
    'SENT_HOME',
    'EMERGENCY_TRANSPORT',
    'HOSPITAL_ADMISSION',
    'OTHER'
  ]),
  followUpRequired: z.boolean().default(false),
  notes: z.string().max(5000).optional(),
  witnesses: z.array(z.string()).default([]),
  documentedBy: z.string()
    .min(1, 'Documenter name is required')
    .max(255, 'Documenter name must be less than 255 characters')
}).refine((data) => {
  // If EpiPen was administered, administrator should be documented
  if (data.epiPenAdministered && !data.epiPenAdministeredBy) {
    return false;
  }
  return true;
}, {
  message: 'EpiPen administrator name is required when EpiPen was administered',
  path: ['epiPenAdministeredBy']
}).refine((data) => {
  // If parent was notified, notification time should be documented
  if (data.parentNotified && !data.parentNotifiedAt) {
    return false;
  }
  return true;
}, {
  message: 'Parent notification time is required when parent was notified',
  path: ['parentNotifiedAt']
});

export type AllergyReactionFormData = z.infer<typeof allergyReactionSchema>;

/**
 * EpiPen expiration check schema
 */
export const epiPenExpirationCheckSchema = z.object({
  daysThreshold: z.number().int().positive().max(365).default(30),
  schoolId: z.string().uuid().optional(),
  includeExpired: z.boolean().default(true)
});

export type EpiPenExpirationCheckFormData = z.infer<typeof epiPenExpirationCheckSchema>;
