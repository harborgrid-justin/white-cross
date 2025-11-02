/**
 * Health Records Constants
 *
 * Constants related to health records management.
 */

/**
 * Health record types
 */
export const HEALTH_RECORD_TYPES = {
  ALLERGY: 'allergy',
  IMMUNIZATION: 'immunization',
  MEDICATION: 'medication',
  VITAL: 'vital',
  SCREENING: 'screening',
  CONDITION: 'condition',
  PROCEDURE: 'procedure',
  VISIT: 'visit'
} as const

export type HealthRecordType = typeof HEALTH_RECORD_TYPES[keyof typeof HEALTH_RECORD_TYPES]

/**
 * Health record status options
 */
export const HEALTH_RECORD_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  RESOLVED: 'resolved',
  PENDING: 'pending'
} as const

export type HealthRecordStatus = typeof HEALTH_RECORD_STATUS[keyof typeof HEALTH_RECORD_STATUS]

/**
 * Vital sign types
 */
export const VITAL_TYPES = {
  TEMPERATURE: 'temperature',
  BLOOD_PRESSURE: 'blood_pressure',
  HEART_RATE: 'heart_rate',
  RESPIRATORY_RATE: 'respiratory_rate',
  OXYGEN_SATURATION: 'oxygen_saturation',
  HEIGHT: 'height',
  WEIGHT: 'weight',
  BMI: 'bmi'
} as const

export type VitalType = typeof VITAL_TYPES[keyof typeof VITAL_TYPES]

/**
 * Allergy types (object)
 */
export const ALLERGY_TYPES = {
  FOOD: 'food',
  MEDICATION: 'medication',
  ENVIRONMENTAL: 'environmental',
  INSECT: 'insect',
  OTHER: 'other'
} as const

export type AllergyType = typeof ALLERGY_TYPES[keyof typeof ALLERGY_TYPES]

/**
 * Allergy types (array format for UI components)
 */
export const ALLERGY_TYPE_OPTIONS = [
  { value: 'food', label: 'Food' },
  { value: 'medication', label: 'Medication' },
  { value: 'environmental', label: 'Environmental' },
  { value: 'insect', label: 'Insect' },
  { value: 'other', label: 'Other' }
] as const

/**
 * Allergy severity levels
 */
export const ALLERGY_SEVERITY = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
  LIFE_THREATENING: 'life_threatening'
} as const

export type AllergySeverity = typeof ALLERGY_SEVERITY[keyof typeof ALLERGY_SEVERITY]

/**
 * Severity levels (array format for UI components)
 */
export const SEVERITY_LEVELS = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
  { value: 'life_threatening', label: 'Life Threatening' }
] as const

/**
 * Immunization status
 */
export const IMMUNIZATION_STATUS = {
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  UPCOMING: 'upcoming',
  EXEMPTED: 'exempted'
} as const

export type ImmunizationStatus = typeof IMMUNIZATION_STATUS[keyof typeof IMMUNIZATION_STATUS]

/**
 * Common vaccines
 */
export const COMMON_VACCINES = [
  'MMR (Measles, Mumps, Rubella)',
  'DTaP (Diphtheria, Tetanus, Pertussis)',
  'Polio (IPV)',
  'Hepatitis B',
  'Hepatitis A',
  'Varicella (Chickenpox)',
  'Meningococcal',
  'HPV (Human Papillomavirus)',
  'Flu (Influenza)',
  'COVID-19',
  'Tdap (Tetanus, Diphtheria, Pertussis booster)'
] as const

/**
 * Growth chart percentiles
 */
export const GROWTH_PERCENTILES = [
  5, 10, 25, 50, 75, 90, 95
] as const

/**
 * Screening types
 */
export const SCREENING_TYPES = {
  VISION: 'vision',
  HEARING: 'hearing',
  SCOLIOSIS: 'scoliosis',
  DENTAL: 'dental',
  BMI: 'bmi',
  MENTAL_HEALTH: 'mental_health'
} as const

export type ScreeningType = typeof SCREENING_TYPES[keyof typeof SCREENING_TYPES]

/**
 * Condition status options
 */
export const CONDITION_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'monitoring', label: 'Under Monitoring' }
] as const

/**
 * Vaccination compliance status
 */
export const VaccinationComplianceStatus = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non_compliant',
  PARTIALLY_COMPLIANT: 'partially_compliant',
  PENDING: 'pending'
} as const
