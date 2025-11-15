/**
 * MIGRATION STATUS: DEPRECATED
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.utils
 * @see {@link /lib/actions/health-records.utils.ts}
 * @module services/modules/healthRecordsApi/validation
 */

import { z } from 'zod';
import {
  AllergyType,
  AllergySeverity,
  ConditionStatus,
  ConditionSeverity,
  VaccinationStatus,
  ScreeningType,
  ScreeningOutcome
} from './types';

// ==========================================
// COMMON VALIDATORS
// ==========================================

const uuidValidator = z.string().uuid('Invalid UUID format');
const npiValidator = z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional().or(z.literal(''));
const icdCodeValidator = z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format').optional().or(z.literal(''));
const phoneValidator = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional();
const dateValidator = z.string().min(1, 'Date is required');
const optionalDateValidator = z.string().optional();

// ==========================================
// HEALTH RECORD VALIDATION
// ==========================================

export const healthRecordCreateSchema = z.object({
  studentId: uuidValidator,
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]),
  date: dateValidator,
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  diagnosis: z.string().max(2000, 'Diagnosis too long').optional(),
  treatment: z.string().max(2000, 'Treatment description too long').optional(),
  provider: z.string().max(255, 'Provider name too long').optional(),
  providerNPI: npiValidator,
  location: z.string().max(255, 'Location too long').optional(),
  notes: z.string().max(10000, 'Notes too long').optional(),
  attachments: z.array(z.string().url('Invalid attachment URL')).optional(),
  isConfidential: z.boolean().optional().default(false),
  followUpRequired: z.boolean().optional().default(false),
  followUpDate: optionalDateValidator,
}).refine(
  (data) => !data.followUpRequired || data.followUpDate,
  {
    message: 'Follow-up date is required when follow-up is needed',
    path: ['followUpDate'],
  }
);

export const healthRecordUpdateSchema = healthRecordCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// ALLERGY VALIDATION
// ==========================================

export const allergyCreateSchema = z.object({
  studentId: uuidValidator,
  allergen: z.string().min(1, 'Allergen is required').max(255, 'Allergen name too long'),
  allergyType: z.nativeEnum(AllergyType),
  severity: z.nativeEnum(AllergySeverity),
  reaction: z.string().max(1000, 'Reaction description too long').optional(),
  symptoms: z.array(z.string().max(100, 'Symptom description too long')).optional(),
  treatment: z.string().max(1000, 'Treatment description too long').optional(),
  onsetDate: optionalDateValidator,
  diagnosedBy: z.string().max(255, 'Diagnosed by field too long').optional(),
  verified: z.boolean().optional().default(false),
  isCritical: z.boolean().optional().default(false),
  notes: z.string().max(2000, 'Notes too long').optional(),
}).refine(
  (data) => data.severity !== AllergySeverity.LIFE_THREATENING || data.isCritical,
  {
    message: 'Life-threatening allergies must be marked as critical',
    path: ['isCritical'],
  }
);

export const allergyUpdateSchema = allergyCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// CHRONIC CONDITION VALIDATION
// ==========================================

export const chronicConditionCreateSchema = z.object({
  studentId: uuidValidator,
  condition: z.string().min(1, 'Condition is required').max(255, 'Condition name too long'),
  icdCode: icdCodeValidator,
  diagnosedDate: dateValidator,
  status: z.nativeEnum(ConditionStatus),
  severity: z.nativeEnum(ConditionSeverity),
  notes: z.string().max(2000, 'Notes too long').optional(),
  carePlan: z.string().max(10000, 'Care plan too long').optional(),
  medications: z.array(z.string().max(200, 'Medication name too long')).optional(),
  restrictions: z.array(z.string().max(200, 'Restriction too long')).optional(),
  triggers: z.array(z.string().max(200, 'Trigger description too long')).optional(),
  diagnosedBy: z.string().max(255, 'Diagnosed by field too long').optional(),
  nextReviewDate: optionalDateValidator,
  emergencyProtocol: z.string().max(5000, 'Emergency protocol too long').optional(),
}).refine(
  (data) => data.severity !== ConditionSeverity.CRITICAL || data.emergencyProtocol,
  {
    message: 'Critical conditions must have an emergency protocol',
    path: ['emergencyProtocol'],
  }
);

export const chronicConditionUpdateSchema = chronicConditionCreateSchema
  .partial()
  .omit({ studentId: true })
  .extend({
    isActive: z.boolean().optional(),
  });

export const carePlanUpdateSchema = z.object({
  carePlan: z.string().min(1, 'Care plan is required').max(10000, 'Care plan too long'),
  medications: z.array(z.string().max(200, 'Medication name too long')).optional(),
  restrictions: z.array(z.string().max(200, 'Restriction too long')).optional(),
  triggers: z.array(z.string().max(200, 'Trigger description too long')).optional(),
  emergencyProtocol: z.string().max(5000, 'Emergency protocol too long').optional(),
  nextReviewDate: optionalDateValidator,
});

// ==========================================
// VACCINATION VALIDATION
// ==========================================

export const vaccinationCreateSchema = z.object({
  studentId: uuidValidator,
  vaccineName: z.string().min(1, 'Vaccine name is required').max(255, 'Vaccine name too long'),
  vaccineType: z.string().min(1, 'Vaccine type is required').max(100, 'Vaccine type too long'),
  cvxCode: z.string().max(10, 'CVX code too long').optional(),
  doseNumber: z.number().int().min(1, 'Dose number must be positive').optional(),
  totalDoses: z.number().int().min(1, 'Total doses must be positive').optional(),
  administeredDate: dateValidator,
  expirationDate: optionalDateValidator,
  lotNumber: z.string().max(50, 'Lot number too long').optional(),
  manufacturer: z.string().max(255, 'Manufacturer name too long').optional(),
  administeredBy: z.string().max(255, 'Administered by field too long').optional(),
  administeredByNPI: npiValidator,
  site: z.string().max(50, 'Administration site too long').optional(),
  route: z.string().max(50, 'Administration route too long').optional(),
  dosage: z.string().max(50, 'Dosage description too long').optional(),
  status: z.nativeEnum(VaccinationStatus).optional().default(VaccinationStatus.COMPLETED),
  reactions: z.array(z.string().max(200, 'Reaction description too long')).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  nextDueDate: optionalDateValidator,
}).refine(
  (data) => {
    if (data.doseNumber && data.totalDoses) {
      return data.doseNumber <= data.totalDoses;
    }
    return true;
  },
  {
    message: 'Dose number cannot exceed total doses',
    path: ['doseNumber'],
  }
).refine(
  (data) => {
    if (data.expirationDate && data.administeredDate) {
      return new Date(data.expirationDate) > new Date(data.administeredDate);
    }
    return true;
  },
  {
    message: 'Expiration date must be after administration date',
    path: ['expirationDate'],
  }
);

export const vaccinationUpdateSchema = vaccinationCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// SCREENING VALIDATION
// ==========================================

export const screeningCreateSchema = z.object({
  studentId: uuidValidator,
  screeningType: z.nativeEnum(ScreeningType),
  screeningDate: dateValidator,
  performedBy: z.string().min(1, 'Performed by is required').max(255, 'Performed by field too long'),
  outcome: z.nativeEnum(ScreeningOutcome),
  results: z.string().max(5000, 'Results description too long').optional(),
  measurements: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  referralRequired: z.boolean().optional().default(false),
  referralTo: z.string().max(255, 'Referral to field too long').optional(),
  followUpRequired: z.boolean().optional().default(false),
  followUpDate: optionalDateValidator,
  notes: z.string().max(2000, 'Notes too long').optional(),
}).refine(
  (data) => data.outcome !== ScreeningOutcome.REFER || data.referralTo,
  {
    message: 'Referral destination is required when outcome is REFER',
    path: ['referralTo'],
  }
).refine(
  (data) => !data.followUpRequired || data.followUpDate,
  {
    message: 'Follow-up date is required when follow-up is needed',
    path: ['followUpDate'],
  }
);

export const screeningUpdateSchema = screeningCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// GROWTH MEASUREMENT VALIDATION
// ==========================================

export const growthMeasurementCreateSchema = z.object({
  studentId: uuidValidator,
  measurementDate: dateValidator,
  height: z.number()
    .positive('Height must be positive')
    .min(20, 'Height seems too low')
    .max(300, 'Height seems unrealistic')
    .optional(),
  weight: z.number()
    .positive('Weight must be positive')
    .min(0.5, 'Weight seems too low')
    .max(500, 'Weight seems unrealistic')
    .optional(),
  headCircumference: z.number()
    .positive('Head circumference must be positive')
    .min(10, 'Head circumference seems too low')
    .max(100, 'Head circumference seems unrealistic')
    .optional(),
  measuredBy: z.string().min(1, 'Measured by is required').max(255, 'Measured by field too long'),
  notes: z.string().max(2000, 'Notes too long').optional(),
}).refine(
  (data) => data.height || data.weight || data.headCircumference,
  {
    message: 'At least one measurement (height, weight, or head circumference) is required',
    path: ['height'],
  }
);

export const growthMeasurementUpdateSchema = growthMeasurementCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// VITAL SIGNS VALIDATION
// ==========================================

export const vitalSignsCreateSchema = z.object({
  studentId: uuidValidator,
  recordDate: dateValidator,
  temperature: z.number()
    .min(32, 'Temperature too low (32°C minimum)')
    .max(45, 'Temperature too high (45°C maximum)')
    .optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().int()
    .min(40, 'Systolic BP too low')
    .max(300, 'Systolic BP too high')
    .optional(),
  bloodPressureDiastolic: z.number().int()
    .min(20, 'Diastolic BP too low')
    .max(200, 'Diastolic BP too high')
    .optional(),
  heartRate: z.number().int()
    .min(20, 'Heart rate too low')
    .max(300, 'Heart rate too high')
    .optional(),
  respiratoryRate: z.number().int()
    .min(5, 'Respiratory rate too low')
    .max(80, 'Respiratory rate too high')
    .optional(),
  oxygenSaturation: z.number()
    .min(0, 'Oxygen saturation cannot be negative')
    .max(100, 'Oxygen saturation cannot exceed 100%')
    .optional(),
  pain: z.number().int()
    .min(0, 'Pain scale minimum is 0')
    .max(10, 'Pain scale maximum is 10')
    .optional(),
  glucose: z.number()
    .min(0, 'Glucose cannot be negative')
    .max(1000, 'Glucose level seems unrealistic')
    .optional(),
  weight: z.number()
    .positive('Weight must be positive')
    .max(500, 'Weight seems unrealistic')
    .optional(),
  height: z.number()
    .positive('Height must be positive')
    .max(300, 'Height seems unrealistic')
    .optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  recordedBy: z.string().min(1, 'Recorded by is required').max(255, 'Recorded by field too long'),
}).refine(
  (data) => {
    if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
      return data.bloodPressureSystolic > data.bloodPressureDiastolic;
    }
    return true;
  },
  {
    message: 'Systolic blood pressure must be higher than diastolic',
    path: ['bloodPressureSystolic'],
  }
).refine(
  (data) => !data.temperature || !data.temperatureMethod || data.temperatureMethod,
  {
    message: 'Temperature method is required when temperature is recorded',
    path: ['temperatureMethod'],
  }
);

export const vitalSignsUpdateSchema = vitalSignsCreateSchema
  .partial()
  .omit({ studentId: true });

// ==========================================
// BULK IMPORT VALIDATION
// ==========================================

export const bulkImportSchema = z.object({
  records: z.array(healthRecordCreateSchema)
    .min(1, 'At least one record is required')
    .max(1000, 'Maximum 1000 records per bulk import'),
  validateOnly: z.boolean().optional().default(false),
  continueOnError: z.boolean().optional().default(false),
}).refine(
  (data) => {
    // Check for duplicate records within the same import
    const studentDateCombos = data.records.map(r => `${r.studentId}-${r.date}-${r.type}`);
    const uniqueCombos = new Set(studentDateCombos);
    return studentDateCombos.length === uniqueCombos.size;
  },
  {
    message: 'Duplicate records found in import (same student, date, and type)',
    path: ['records'],
  }
);

// ==========================================
// FILTER VALIDATION
// ==========================================

export const healthRecordFiltersSchema = z.object({
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  provider: z.string().max(255).optional(),
  followUpRequired: z.boolean().optional(),
  isConfidential: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  {
    message: 'Date from must be before or equal to date to',
    path: ['dateFrom'],
  }
);

export const vitalSignsFiltersSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.number().int().min(1).max(1000).optional(),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  {
    message: 'Date from must be before or equal to date to',
    path: ['dateFrom'],
  }
);

// ==========================================
// SEARCH VALIDATION
// ==========================================

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(1000, 'Search query too long'),
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// ==========================================
// EXPORT VALIDATION
// ==========================================

export const exportSchema = z.object({
  studentId: uuidValidator,
  format: z.enum(['pdf', 'json', 'csv']).default('pdf'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  includeConfidential: z.boolean().optional().default(false),
  includeAttachments: z.boolean().optional().default(false),
});

// ==========================================
// VALIDATION HELPER FUNCTIONS
// ==========================================

/**
 * Validate age-appropriate measurements
 */
export function validateAgeAppropriateMeasurements(
  birthDate: string,
  measurements: {
    height?: number;
    weight?: number;
    headCircumference?: number;
  }
): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const age = calculateAge(birthDate);
  
  // Age-specific validation rules
  if (age < 2 && !measurements.headCircumference) {
    warnings.push('Head circumference is typically measured for children under 2 years');
  }
  
  if (age >= 18 && measurements.headCircumference) {
    warnings.push('Head circumference is not typically measured for adults');
  }
  
  if (measurements.height && age > 0) {
    const expectedHeight = estimateHeightForAge(age);
    if (measurements.height < expectedHeight * 0.7 || measurements.height > expectedHeight * 1.3) {
      warnings.push('Height measurement seems unusual for age');
    }
  }
  
  if (measurements.weight && age > 0) {
    const expectedWeight = estimateWeightForAge(age);
    if (measurements.weight < expectedWeight * 0.5 || measurements.weight > expectedWeight * 2) {
      warnings.push('Weight measurement seems unusual for age');
    }
  }
  
  return {
    isValid: true, // Warnings don't invalidate, just inform
    warnings
  };
}

/**
 * Validate vital signs for age
 */
export function validateVitalSignsForAge(
  birthDate: string,
  vitals: {
    heartRate?: number;
    respiratoryRate?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
  }
): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const age = calculateAge(birthDate);
  
  // Age-specific vital sign ranges
  const ranges = getVitalSignRangesForAge(age);
  
  if (vitals.heartRate) {
    if (vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max) {
      warnings.push(`Heart rate (${vitals.heartRate}) outside normal range for age (${ranges.heartRate.min}-${ranges.heartRate.max})`);
    }
  }
  
  if (vitals.respiratoryRate) {
    if (vitals.respiratoryRate < ranges.respiratoryRate.min || vitals.respiratoryRate > ranges.respiratoryRate.max) {
      warnings.push(`Respiratory rate (${vitals.respiratoryRate}) outside normal range for age (${ranges.respiratoryRate.min}-${ranges.respiratoryRate.max})`);
    }
  }
  
  return {
    isValid: true,
    warnings
  };
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function estimateHeightForAge(age: number): number {
  // Rough estimates - in practice, would use growth charts
  if (age < 1) return 75; // ~75cm for 1 year old
  if (age < 5) return 75 + (age * 10); // Rapid growth
  if (age < 18) return 115 + (age * 5); // Steady growth
  return 170; // Average adult height
}

function estimateWeightForAge(age: number): number {
  // Rough estimates - in practice, would use growth charts
  if (age < 1) return 10; // ~10kg for 1 year old
  if (age < 5) return 10 + (age * 3); // Rapid growth
  if (age < 18) return 22 + (age * 3); // Steady growth
  return 70; // Average adult weight
}

function getVitalSignRangesForAge(age: number) {
  // Simplified ranges - in practice, would use detailed pediatric guidelines
  if (age < 1) {
    return {
      heartRate: { min: 100, max: 160 },
      respiratoryRate: { min: 30, max: 60 },
    };
  } else if (age < 5) {
    return {
      heartRate: { min: 90, max: 140 },
      respiratoryRate: { min: 20, max: 40 },
    };
  } else if (age < 12) {
    return {
      heartRate: { min: 80, max: 120 },
      respiratoryRate: { min: 15, max: 30 },
    };
  } else {
    return {
      heartRate: { min: 60, max: 100 },
      respiratoryRate: { min: 12, max: 20 },
    };
  }
}
