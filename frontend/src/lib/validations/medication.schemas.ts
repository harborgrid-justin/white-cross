/**
 * @fileoverview Zod Validation Schemas for Medication Management
 * @module lib/validations/medication.schemas
 *
 * Comprehensive validation schemas for medication operations with HIPAA-compliant
 * field validation, error messages, and type safety.
 */

import { z } from 'zod';

// ==========================================
// ENUMS
// ==========================================

export const MedicationRouteEnum = z.enum([
  'oral',
  'sublingual',
  'buccal',
  'inhalation',
  'topical',
  'transdermal',
  'injection_subcutaneous',
  'injection_intramuscular',
  'injection_intravenous',
  'rectal',
  'ophthalmic',
  'otic',
  'nasal',
  'vaginal',
  'other'
]);

export const MedicationFrequencyEnum = z.enum([
  'once_daily',
  'twice_daily',
  'three_times_daily',
  'four_times_daily',
  'every_4_hours',
  'every_6_hours',
  'every_8_hours',
  'every_12_hours',
  'once_weekly',
  'twice_weekly',
  'as_needed',
  'before_meals',
  'after_meals',
  'at_bedtime',
  'custom'
]);

export const MedicationStatusEnum = z.enum([
  'active',
  'discontinued',
  'completed',
  'on_hold',
  'pending_approval'
]);

export const MedicationTypeEnum = z.enum([
  'prescription',
  'over_the_counter',
  'controlled_substance',
  'emergency',
  'as_needed',
  'supplement',
  'homeopathic'
]);

export const SeverityEnum = z.enum([
  'mild',
  'moderate',
  'severe',
  'life-threatening'
]);

// ==========================================
// CORE MEDICATION SCHEMAS
// ==========================================

/**
 * Create Medication Schema
 * Used for adding new medications to student records
 */
export const createMedicationSchema = z.object({
  studentId: z.string().uuid('Invalid student ID format'),

  // Basic Information
  name: z.string()
    .min(2, 'Medication name must be at least 2 characters')
    .max(200, 'Medication name too long'),

  genericName: z.string().max(200).optional(),

  type: MedicationTypeEnum,

  // Dosage Information
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(100, 'Dosage description too long'),

  dosageAmount: z.number().positive('Dosage amount must be positive').optional(),
  dosageUnit: z.string().max(50).optional(),

  route: MedicationRouteEnum,

  frequency: MedicationFrequencyEnum,
  frequencyDetails: z.string().max(500).optional(),

  // Schedule
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format').optional(),

  // Prescription Details
  prescribedBy: z.string()
    .min(2, 'Prescriber name is required')
    .max(200),

  prescriptionNumber: z.string().max(100).optional(),
  prescriptionDate: z.string().datetime().optional(),

  // Instructions & Safety
  instructions: z.string().max(2000).optional(),
  sideEffects: z.array(z.string().max(500)).optional(),
  contraindications: z.array(z.string().max(500)).optional(),
  warnings: z.array(z.string().max(500)).optional(),

  // Storage & Handling
  storage: z.string().max(500).optional(),
  requiresRefrigeration: z.boolean().optional(),

  // Controlled Substance Details
  isControlledSubstance: z.boolean().optional(),
  controlledSubstanceSchedule: z.enum(['I', 'II', 'III', 'IV', 'V']).optional(),
  requiresWitness: z.boolean().optional(),

  // Parent/Guardian Consent
  parentConsentRequired: z.boolean().optional(),
  parentConsentDate: z.string().datetime().optional(),
  parentConsentGivenBy: z.string().max(200).optional(),

  // Additional Information
  notes: z.string().max(2000).optional(),
  allergies: z.array(z.string().max(200)).optional(),

  // Inventory
  quantity: z.number().int().nonnegative().optional(),
  quantityUnit: z.string().max(50).optional(),
  expirationDate: z.string().datetime().optional(),
  lotNumber: z.string().max(100).optional(),

  // Status
  status: MedicationStatusEnum.default('pending_approval')
});

/**
 * Update Medication Schema
 * Partial schema for updating existing medications
 */
export const updateMedicationSchema = createMedicationSchema.partial().extend({
  id: z.string().uuid('Invalid medication ID')
});

/**
 * Discontinue Medication Schema
 */
export const discontinueMedicationSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  reason: z.string()
    .min(5, 'Reason must be at least 5 characters')
    .max(1000, 'Reason too long'),
  discontinuedBy: z.string()
    .min(2, 'Discontinuer name required')
    .max(200),
  discontinuedAt: z.string().datetime().optional()
});

// ==========================================
// MEDICATION ADMINISTRATION SCHEMAS
// ==========================================

/**
 * Administer Medication Schema
 * CRITICAL: Used for recording medication administration with Five Rights
 */
export const administerMedicationSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  studentId: z.string().uuid('Invalid student ID'),

  // Five Rights of Medication Administration
  rightPatient: z.boolean().refine(val => val === true, {
    message: 'Patient verification required (Right Patient)'
  }),
  rightMedication: z.boolean().refine(val => val === true, {
    message: 'Medication verification required (Right Medication)'
  }),
  rightDose: z.boolean().refine(val => val === true, {
    message: 'Dose verification required (Right Dose)'
  }),
  rightRoute: z.boolean().refine(val => val === true, {
    message: 'Route verification required (Right Route)'
  }),
  rightTime: z.boolean().refine(val => val === true, {
    message: 'Time verification required (Right Time)'
  }),

  // Administration Details
  administeredBy: z.string()
    .min(2, 'Administrator name required')
    .max(200),

  administeredAt: z.string().datetime('Invalid administration time'),

  dosageGiven: z.string()
    .min(1, 'Dosage given is required')
    .max(100),

  route: MedicationRouteEnum,

  // Witness (for controlled substances)
  witnessedBy: z.string().max(200).optional(),
  witnessSignature: z.string().optional(),

  // Student Response
  studentAccepted: z.boolean(),
  refusalReason: z.string().max(1000).optional(),

  // Observations
  vitalSignsBefore: z.object({
    temperature: z.number().optional(),
    heartRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    respiratoryRate: z.number().optional()
  }).optional(),

  vitalSignsAfter: z.object({
    temperature: z.number().optional(),
    heartRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    respiratoryRate: z.number().optional()
  }).optional(),

  // Side Effects
  sideEffectsObserved: z.boolean().optional(),
  sideEffectsDescription: z.string().max(2000).optional(),

  // Notes
  notes: z.string().max(2000).optional(),

  // Location
  location: z.string().max(200).optional()
}).refine(
  data => !data.studentAccepted || !data.refusalReason,
  {
    message: 'Cannot have refusal reason if student accepted',
    path: ['refusalReason']
  }
).refine(
  data => data.studentAccepted || data.refusalReason,
  {
    message: 'Refusal reason required if student did not accept',
    path: ['refusalReason']
  }
);

/**
 * Record Missed Dose Schema
 */
export const recordMissedDoseSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  studentId: z.string().uuid('Invalid student ID'),
  scheduledTime: z.string().datetime('Invalid scheduled time'),
  reason: z.string()
    .min(5, 'Reason must be at least 5 characters')
    .max(1000),
  reportedBy: z.string()
    .min(2, 'Reporter name required')
    .max(200),
  reportedAt: z.string().datetime().optional(),
  actionTaken: z.string().max(1000).optional(),
  parentNotified: z.boolean().optional(),
  parentNotifiedAt: z.string().datetime().optional()
});

/**
 * Update Administration Record Schema
 */
export const updateAdministrationRecordSchema = z.object({
  administrationId: z.string().uuid('Invalid administration ID'),
  notes: z.string().max(2000).optional(),
  sideEffectsObserved: z.boolean().optional(),
  sideEffectsDescription: z.string().max(2000).optional(),
  vitalSignsAfter: z.object({
    temperature: z.number().optional(),
    heartRate: z.number().optional(),
    bloodPressure: z.string().optional(),
    respiratoryRate: z.number().optional()
  }).optional()
});

// ==========================================
// ADVERSE REACTION SCHEMAS
// ==========================================

/**
 * Log Adverse Reaction Schema
 */
export const logAdverseReactionSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  studentId: z.string().uuid('Invalid student ID'),

  reactionType: z.string()
    .min(2, 'Reaction type required')
    .max(200),

  severity: SeverityEnum,

  symptoms: z.array(z.string().max(500))
    .min(1, 'At least one symptom required'),

  onset: z.string().datetime('Invalid onset time'),
  duration: z.string().max(200).optional(),

  treatment: z.string().max(2000).optional(),

  reportedBy: z.string()
    .min(2, 'Reporter name required')
    .max(200),

  reportedAt: z.string().datetime(),

  emergencyServicesContacted: z.boolean().optional(),
  emergencyServicesDetails: z.string().max(1000).optional(),

  parentNotified: z.boolean(),
  parentNotifiedAt: z.string().datetime().optional(),

  physicianNotified: z.boolean(),
  physicianNotifiedAt: z.string().datetime().optional(),

  notes: z.string().max(2000).optional()
});

// ==========================================
// PRESCRIPTION SCHEMAS
// ==========================================

/**
 * Create Prescription Schema
 */
export const createPrescriptionSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  medicationId: z.string().uuid('Invalid medication ID').optional(),

  prescribedBy: z.string()
    .min(2, 'Prescriber name required')
    .max(200),

  prescriberNPI: z.string().max(50).optional(),
  prescriberDEA: z.string().max(50).optional(),

  prescriptionNumber: z.string()
    .min(1, 'Prescription number required')
    .max(100),

  prescriptionDate: z.string().datetime('Invalid prescription date'),

  expirationDate: z.string().datetime('Invalid expiration date'),

  refillsAuthorized: z.number().int().nonnegative(),
  refillsRemaining: z.number().int().nonnegative(),

  pharmacyName: z.string().max(200).optional(),
  pharmacyPhone: z.string().max(20).optional(),
  pharmacyAddress: z.string().max(500).optional(),

  notes: z.string().max(2000).optional()
});

/**
 * Request Refill Schema
 */
export const requestRefillSchema = z.object({
  prescriptionId: z.string().uuid('Invalid prescription ID'),
  medicationId: z.string().uuid('Invalid medication ID'),
  quantity: z.number().positive('Quantity must be positive'),
  requestedBy: z.string()
    .min(2, 'Requester name required')
    .max(200),
  requestedAt: z.string().datetime().optional(),
  pharmacyName: z.string().max(200).optional(),
  pharmacyPhone: z.string().max(20).optional(),
  urgency: z.enum(['routine', 'urgent', 'emergency']).optional(),
  notes: z.string().max(1000).optional()
});

// ==========================================
// INVENTORY SCHEMAS
// ==========================================

/**
 * Adjust Medication Inventory Schema
 */
export const adjustInventorySchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),

  adjustmentType: z.enum(['add', 'remove', 'correction', 'waste', 'expired']),

  quantity: z.number().int()
    .refine(val => val !== 0, {
      message: 'Adjustment quantity cannot be zero'
    }),

  reason: z.string()
    .min(5, 'Reason must be at least 5 characters')
    .max(1000),

  adjustedBy: z.string()
    .min(2, 'Adjuster name required')
    .max(200),

  adjustedAt: z.string().datetime().optional(),

  witnessedBy: z.string().max(200).optional(),

  lotNumber: z.string().max(100).optional(),
  expirationDate: z.string().datetime().optional(),

  notes: z.string().max(1000).optional()
});

/**
 * Set Low Stock Alert Schema
 */
export const setLowStockAlertSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),
  threshold: z.number().int().positive('Threshold must be positive'),
  enabled: z.boolean()
});

// ==========================================
// SCHEDULE SCHEMAS
// ==========================================

/**
 * Update Medication Schedule Schema
 */
export const updateScheduleSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),

  times: z.array(z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'))
    .min(1, 'At least one time required'),

  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),

  skipHolidays: z.boolean().optional(),
  skipWeekends: z.boolean().optional(),

  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  notes: z.string().max(1000).optional()
});

/**
 * Set Reminder Schema
 */
export const setReminderSchema = z.object({
  medicationId: z.string().uuid('Invalid medication ID'),

  reminderType: z.enum(['administration', 'refill', 'expiration', 'renewal']),

  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),

  frequency: z.string().max(100),

  enabled: z.boolean(),

  notificationMethods: z.array(z.enum(['email', 'sms', 'push', 'in_app'])).optional(),

  advanceNoticeDays: z.number().int().nonnegative().optional()
});

// ==========================================
// REPORT SCHEMAS
// ==========================================

/**
 * Generate Administration Report Schema
 */
export const generateAdministrationReportSchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  studentId: z.string().uuid().optional(),
  medicationId: z.string().uuid().optional(),
  administeredBy: z.string().max(200).optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf'),
  includeVitalSigns: z.boolean().optional(),
  includeSideEffects: z.boolean().optional()
}).refine(
  data => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate']
  }
);

/**
 * Generate Compliance Report Schema
 */
export const generateComplianceReportSchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  studentId: z.string().uuid().optional(),
  medicationId: z.string().uuid().optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf'),
  includeMissedDoses: z.boolean().optional(),
  includeRefusals: z.boolean().optional(),
  includeAdverseReactions: z.boolean().optional()
});

/**
 * Generate Inventory Report Schema
 */
export const generateInventoryReportSchema = z.object({
  medicationType: MedicationTypeEnum.optional(),
  includeExpired: z.boolean().optional(),
  includeLowStock: z.boolean().optional(),
  format: z.enum(['pdf', 'csv', 'excel']).default('pdf')
});

// ==========================================
// SEARCH & FILTER SCHEMAS
// ==========================================

/**
 * Medication Search Schema
 */
export const medicationSearchSchema = z.object({
  query: z.string().max(200).optional(),
  studentId: z.string().uuid().optional(),
  type: MedicationTypeEnum.optional(),
  status: MedicationStatusEnum.optional(),
  prescribedBy: z.string().max(200).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'startDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
export type DiscontinueMedicationInput = z.infer<typeof discontinueMedicationSchema>;
export type AdministerMedicationInput = z.infer<typeof administerMedicationSchema>;
export type RecordMissedDoseInput = z.infer<typeof recordMissedDoseSchema>;
export type LogAdverseReactionInput = z.infer<typeof logAdverseReactionSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type RequestRefillInput = z.infer<typeof requestRefillSchema>;
export type AdjustInventoryInput = z.infer<typeof adjustInventorySchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type SetReminderInput = z.infer<typeof setReminderSchema>;
export type GenerateAdministrationReportInput = z.infer<typeof generateAdministrationReportSchema>;
export type MedicationSearchInput = z.infer<typeof medicationSearchSchema>;
