/**
 * Vital Signs Zod schemas for form validation
 *
 * @module schemas/vital-signs
 * @description Zod schemas for vital signs measurement forms
 * HIPAA CRITICAL: All vital signs contain PHI
 */

import { z } from 'zod';

/**
 * Temperature site enum
 */
export const TemperatureSiteEnum = z.enum([
  'ORAL',
  'AXILLARY',
  'TYMPANIC',
  'TEMPORAL',
  'RECTAL'
]);

/**
 * Blood pressure position enum
 */
export const BloodPressurePositionEnum = z.enum([
  'SITTING',
  'STANDING',
  'LYING',
  'SUPINE'
]);

/**
 * Consciousness level enum
 */
export const ConsciousnessLevelEnum = z.enum([
  'ALERT',
  'VERBAL',
  'PAIN',
  'UNRESPONSIVE',
  'CONFUSED',
  'DROWSY'
]);

/**
 * Vital signs creation schema
 */
export const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  healthRecordId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  measurementDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid measurement date'),
  measuredBy: z.string()
    .min(1, 'Measurer name is required')
    .max(255, 'Measurer name must be less than 255 characters'),
  measuredByRole: z.string().max(100).optional(),

  // Temperature
  temperature: z.number()
    .min(85, 'Temperature too low (minimum 85°F)')
    .max(115, 'Temperature too high (maximum 115°F)')
    .optional(),
  temperatureUnit: z.enum(['F', 'C']).default('F'),
  temperatureSite: TemperatureSiteEnum.optional(),

  // Blood Pressure
  bloodPressureSystolic: z.number()
    .int()
    .min(50, 'Systolic BP too low (minimum 50 mmHg)')
    .max(250, 'Systolic BP too high (maximum 250 mmHg)')
    .optional(),
  bloodPressureDiastolic: z.number()
    .int()
    .min(30, 'Diastolic BP too low (minimum 30 mmHg)')
    .max(150, 'Diastolic BP too high (maximum 150 mmHg)')
    .optional(),
  bloodPressurePosition: BloodPressurePositionEnum.optional(),

  // Heart Rate
  heartRate: z.number()
    .int()
    .min(30, 'Heart rate too low (minimum 30 bpm)')
    .max(250, 'Heart rate too high (maximum 250 bpm)')
    .optional(),
  heartRhythm: z.enum(['REGULAR', 'IRREGULAR', 'TACHYCARDIC', 'BRADYCARDIC']).optional(),

  // Respiratory Rate
  respiratoryRate: z.number()
    .int()
    .min(5, 'Respiratory rate too low (minimum 5 breaths/min)')
    .max(60, 'Respiratory rate too high (maximum 60 breaths/min)')
    .optional(),

  // Oxygen Saturation
  oxygenSaturation: z.number()
    .int()
    .min(70, 'Oxygen saturation too low (minimum 70%)')
    .max(100, 'Oxygen saturation too high (maximum 100%)')
    .optional(),
  oxygenSupplemental: z.boolean().default(false),

  // Pain Assessment
  painLevel: z.number()
    .int()
    .min(0, 'Pain level minimum is 0')
    .max(10, 'Pain level maximum is 10')
    .optional(),
  painLocation: z.string().max(255).optional(),

  // Consciousness
  consciousness: ConsciousnessLevelEnum.optional(),

  // Glucose Level
  glucoseLevel: z.number()
    .int()
    .min(20, 'Glucose level too low (minimum 20 mg/dL)')
    .max(600, 'Glucose level too high (maximum 600 mg/dL)')
    .optional(),

  // Peak Flow (for asthma patients)
  peakFlow: z.number()
    .int()
    .min(50, 'Peak flow too low (minimum 50 L/min)')
    .max(800, 'Peak flow too high (maximum 800 L/min)')
    .optional(),

  // Notes
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
}).refine((data) => {
  // If temperature is provided, site should be specified
  if (data.temperature && !data.temperatureSite) {
    return false;
  }
  return true;
}, {
  message: 'Temperature site is required when temperature is recorded',
  path: ['temperatureSite']
}).refine((data) => {
  // If systolic BP is provided, diastolic should also be provided
  if (data.bloodPressureSystolic && !data.bloodPressureDiastolic) {
    return false;
  }
  if (data.bloodPressureDiastolic && !data.bloodPressureSystolic) {
    return false;
  }
  return true;
}, {
  message: 'Both systolic and diastolic blood pressure must be provided',
  path: ['bloodPressureSystolic']
}).refine((data) => {
  // Systolic should be higher than diastolic
  if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
    return data.bloodPressureSystolic > data.bloodPressureDiastolic;
  }
  return true;
}, {
  message: 'Systolic blood pressure must be higher than diastolic',
  path: ['bloodPressureSystolic']
}).refine((data) => {
  // If blood pressure is taken, position should be specified
  if ((data.bloodPressureSystolic || data.bloodPressureDiastolic) && !data.bloodPressurePosition) {
    return false;
  }
  return true;
}, {
  message: 'Blood pressure position is required when BP is recorded',
  path: ['bloodPressurePosition']
}).refine((data) => {
  // If pain level is provided, location should be specified
  if (data.painLevel && data.painLevel > 0 && !data.painLocation) {
    return false;
  }
  return true;
}, {
  message: 'Pain location is required when pain level is greater than 0',
  path: ['painLocation']
}).refine((data) => {
  // At least one vital sign should be recorded
  const hasAnyVital =
    data.temperature !== undefined ||
    data.bloodPressureSystolic !== undefined ||
    data.heartRate !== undefined ||
    data.respiratoryRate !== undefined ||
    data.oxygenSaturation !== undefined ||
    data.painLevel !== undefined ||
    data.glucoseLevel !== undefined ||
    data.peakFlow !== undefined;

  return hasAnyVital;
}, {
  message: 'At least one vital sign measurement is required',
  path: ['temperature']
});

export type VitalSignsCreateFormData = z.infer<typeof vitalSignsCreateSchema>;

/**
 * Vital signs update schema
 */
export const vitalSignsUpdateSchema = z.object({
  measurementDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid measurement date'),
  measuredBy: z.string().max(255).optional(),
  measuredByRole: z.string().max(100).optional(),
  temperature: z.number().min(85).max(115).optional(),
  temperatureUnit: z.enum(['F', 'C']).optional(),
  temperatureSite: TemperatureSiteEnum.optional(),
  bloodPressureSystolic: z.number().int().min(50).max(250).optional(),
  bloodPressureDiastolic: z.number().int().min(30).max(150).optional(),
  bloodPressurePosition: BloodPressurePositionEnum.optional(),
  heartRate: z.number().int().min(30).max(250).optional(),
  heartRhythm: z.enum(['REGULAR', 'IRREGULAR', 'TACHYCARDIC', 'BRADYCARDIC']).optional(),
  respiratoryRate: z.number().int().min(5).max(60).optional(),
  oxygenSaturation: z.number().int().min(70).max(100).optional(),
  oxygenSupplemental: z.boolean().optional(),
  painLevel: z.number().int().min(0).max(10).optional(),
  painLocation: z.string().max(255).optional(),
  consciousness: ConsciousnessLevelEnum.optional(),
  glucoseLevel: z.number().int().min(20).max(600).optional(),
  peakFlow: z.number().int().min(50).max(800).optional(),
  notes: z.string().max(2000).optional()
});

export type VitalSignsUpdateFormData = z.infer<typeof vitalSignsUpdateSchema>;

/**
 * Vital signs search/filter schema
 */
export const vitalSignsSearchSchema = z.object({
  studentId: z.string().uuid().optional(),
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
  hasTemperature: z.boolean().optional(),
  hasBloodPressure: z.boolean().optional(),
  hasHeartRate: z.boolean().optional(),
  hasRespiratoryRate: z.boolean().optional(),
  hasOxygenSaturation: z.boolean().optional(),
  hasPainLevel: z.boolean().optional(),
  hasGlucoseLevel: z.boolean().optional(),
  hasPeakFlow: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['measurementDate', 'temperature', 'bloodPressureSystolic', 'heartRate']).default('measurementDate'),
  sortDirection: z.enum(['asc', 'desc']).default('desc')
});

export type VitalSignsSearchFormData = z.infer<typeof vitalSignsSearchSchema>;

/**
 * Vital signs trend analysis schema
 */
export const vitalSignsTrendSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vitalType: z.enum([
    'TEMPERATURE',
    'BLOOD_PRESSURE',
    'HEART_RATE',
    'RESPIRATORY_RATE',
    'OXYGEN_SATURATION',
    'PAIN_LEVEL',
    'GLUCOSE_LEVEL',
    'PEAK_FLOW'
  ]),
  dateFrom: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid from date'),
  dateTo: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid to date'),
  aggregation: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).default('DAILY')
});

export type VitalSignsTrendFormData = z.infer<typeof vitalSignsTrendSchema>;
