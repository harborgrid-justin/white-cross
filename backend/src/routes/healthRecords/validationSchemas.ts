/**
 * Health Records Module - Joi Validation Schemas
 * Purpose: Centralized validation schemas for all health records API endpoints
 * Note: All schemas enforce HIPAA compliance and data integrity requirements
 */

import Joi from 'joi';

// Common field validation patterns
export const healthRecordTypes = ['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING'];
export const allergySeverities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'];
export const conditionStatuses = ['ACTIVE', 'MANAGED', 'RESOLVED', 'INACTIVE'];
export const conditionSeverities = ['MILD', 'MODERATE', 'SEVERE'];
export const screeningTypes = ['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'MENTAL_HEALTH'];
export const screeningResults = ['PASS', 'FAIL', 'REFER', 'INCOMPLETE'];

// ==========================================
// MAIN HEALTH RECORDS VALIDATION SCHEMAS
// ==========================================

export const studentIdParam = Joi.object({
  studentId: Joi.string().required().description('Student ID')
});

export const recordIdParam = Joi.object({
  id: Joi.string().required().description('Health record ID')
});

export const healthRecordsQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1).description('Page number'),
  limit: Joi.number().integer().min(1).max(100).default(20).description('Records per page'),
  type: Joi.string().valid(...healthRecordTypes).optional().description('Filter by record type'),
  dateFrom: Joi.date().iso().optional().description('Filter from date (ISO 8601)'),
  dateTo: Joi.date().iso().optional().description('Filter to date (ISO 8601)'),
  provider: Joi.string().optional().description('Filter by healthcare provider')
});

export const createHealthRecordPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  type: Joi.string().valid(...healthRecordTypes).required().description('Type of health record'),
  date: Joi.date().iso().required().description('Date of record (ISO 8601)'),
  description: Joi.string().trim().required().description('Record description'),
  provider: Joi.string().trim().optional().description('Healthcare provider name'),
  notes: Joi.string().optional().description('Additional notes'),
  attachments: Joi.array().items(Joi.string()).optional().description('Attachment IDs')
});

export const updateHealthRecordPayload = Joi.object({
  type: Joi.string().valid(...healthRecordTypes).optional(),
  date: Joi.date().iso().optional(),
  description: Joi.string().trim().optional(),
  provider: Joi.string().trim().optional(),
  notes: Joi.string().optional(),
  attachments: Joi.array().items(Joi.string()).optional()
});

export const healthTimelineQuery = Joi.object({
  startDate: Joi.date().iso().optional().description('Timeline start date'),
  endDate: Joi.date().iso().optional().description('Timeline end date')
});

export const exportHealthRecordsQuery = Joi.object({
  format: Joi.string().valid('json', 'pdf', 'csv').default('json').description('Export format')
});

// ==========================================
// ALLERGIES VALIDATION SCHEMAS
// ==========================================

export const addAllergyPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  allergen: Joi.string().trim().required().description('Allergen name'),
  severity: Joi.string().valid(...allergySeverities).required().description('Allergy severity'),
  reaction: Joi.string().trim().required().description('Allergic reaction description'),
  treatment: Joi.string().trim().optional().description('Treatment protocol'),
  verified: Joi.boolean().default(false).description('Verified by healthcare provider'),
  verifiedBy: Joi.string().optional().description('Name of verifying provider'),
  notes: Joi.string().optional().description('Additional notes')
});

export const updateAllergyPayload = Joi.object({
  allergen: Joi.string().trim().optional(),
  severity: Joi.string().valid(...allergySeverities).optional(),
  reaction: Joi.string().trim().optional(),
  treatment: Joi.string().trim().optional(),
  verified: Joi.boolean().optional(),
  verifiedBy: Joi.string().optional(),
  notes: Joi.string().optional()
});

export const contraindicationsPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  medicationId: Joi.string().required().description('Medication ID to check')
});

// ==========================================
// CHRONIC CONDITIONS VALIDATION SCHEMAS
// ==========================================

export const addChronicConditionPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  condition: Joi.string().trim().required().description('Condition name'),
  diagnosedDate: Joi.date().iso().required().description('Date of diagnosis'),
  status: Joi.string().valid(...conditionStatuses).required().description('Condition status'),
  severity: Joi.string().valid(...conditionSeverities).optional().description('Condition severity'),
  notes: Joi.string().optional().description('Clinical notes'),
  managementPlan: Joi.string().optional().description('Care/management plan'),
  medications: Joi.array().items(Joi.string()).optional().description('Related medications'),
  restrictions: Joi.array().items(Joi.string()).optional().description('Activity restrictions'),
  triggers: Joi.array().items(Joi.string()).optional().description('Known triggers'),
  diagnosedBy: Joi.string().optional().description('Diagnosing physician'),
  lastReviewDate: Joi.date().iso().optional().description('Last review date'),
  nextReviewDate: Joi.date().iso().optional().description('Next scheduled review'),
  icdCode: Joi.string().optional().description('ICD-10 code')
});

export const updateChronicConditionPayload = Joi.object({
  condition: Joi.string().trim().optional(),
  diagnosedDate: Joi.date().iso().optional(),
  status: Joi.string().valid(...conditionStatuses).optional(),
  severity: Joi.string().valid(...conditionSeverities).optional(),
  notes: Joi.string().optional(),
  managementPlan: Joi.string().optional(),
  medications: Joi.array().items(Joi.string()).optional(),
  restrictions: Joi.array().items(Joi.string()).optional(),
  triggers: Joi.array().items(Joi.string()).optional(),
  diagnosedBy: Joi.string().optional(),
  lastReviewDate: Joi.date().iso().optional(),
  nextReviewDate: Joi.date().iso().optional(),
  icdCode: Joi.string().optional()
});

export const updateConditionStatusPayload = Joi.object({
  status: Joi.string().valid(...conditionStatuses).required().description('New status')
});

export const conditionsDueQuery = Joi.object({
  daysAhead: Joi.number().integer().min(1).max(365).default(30).description('Days ahead to check'),
  schoolId: Joi.string().optional().description('Filter by school')
});

export const schoolIdQuery = Joi.object({
  schoolId: Joi.string().optional().description('School ID for filtering')
});

// ==========================================
// VACCINATIONS VALIDATION SCHEMAS
// ==========================================

export const createVaccinationPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  vaccineName: Joi.string().trim().required().description('Vaccine name'),
  administeredDate: Joi.date().iso().required().description('Administration date'),
  administeredBy: Joi.string().trim().optional().description('Administered by'),
  cvxCode: Joi.string().optional().description('CVX code'),
  ndcCode: Joi.string().optional().description('NDC code'),
  lotNumber: Joi.string().optional().description('Lot number'),
  manufacturer: Joi.string().optional().description('Manufacturer'),
  doseNumber: Joi.number().integer().min(1).optional().description('Dose number in series'),
  totalDoses: Joi.number().integer().min(1).optional().description('Total doses in series'),
  expirationDate: Joi.date().iso().optional().description('Vaccine expiration date'),
  nextDueDate: Joi.date().iso().optional().description('Next dose due date'),
  site: Joi.string().optional().description('Administration site'),
  route: Joi.string().optional().description('Administration route'),
  dosageAmount: Joi.string().optional().description('Dosage amount'),
  reactions: Joi.string().optional().description('Any adverse reactions'),
  notes: Joi.string().optional().description('Additional notes')
});

export const updateVaccinationPayload = Joi.object({
  vaccineName: Joi.string().trim().optional(),
  administeredDate: Joi.date().iso().optional(),
  administeredBy: Joi.string().trim().optional(),
  cvxCode: Joi.string().optional(),
  ndcCode: Joi.string().optional(),
  lotNumber: Joi.string().optional(),
  manufacturer: Joi.string().optional(),
  doseNumber: Joi.number().integer().min(1).optional(),
  totalDoses: Joi.number().integer().min(1).optional(),
  expirationDate: Joi.date().iso().optional(),
  nextDueDate: Joi.date().iso().optional(),
  site: Joi.string().optional(),
  route: Joi.string().optional(),
  dosageAmount: Joi.string().optional(),
  reactions: Joi.string().optional(),
  notes: Joi.string().optional()
});

export const upcomingVaccinationsQuery = Joi.object({
  daysAhead: Joi.number().integer().min(1).max(365).default(90).description('Days ahead to check')
});

export const schoolIdParam = Joi.object({
  schoolId: Joi.string().required().description('School ID')
});

// ==========================================
// SCREENINGS VALIDATION SCHEMAS
// ==========================================

export const screeningsQuery = Joi.object({
  type: Joi.string().valid(...screeningTypes).optional().description('Filter by screening type')
});

export const createScreeningPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  screeningType: Joi.string().valid(...screeningTypes).required().description('Type of screening'),
  screeningDate: Joi.date().iso().required().description('Date of screening'),
  result: Joi.string().valid(...screeningResults).required().description('Screening result'),
  performedBy: Joi.string().trim().optional().description('Performed by'),
  notes: Joi.string().optional().description('Additional notes'),
  followUpRequired: Joi.boolean().default(false).description('Follow-up required'),
  followUpDate: Joi.date().iso().optional().description('Follow-up date')
});

export const updateScreeningPayload = Joi.object({
  screeningType: Joi.string().valid(...screeningTypes).optional(),
  screeningDate: Joi.date().iso().optional(),
  result: Joi.string().valid(...screeningResults).optional(),
  performedBy: Joi.string().trim().optional(),
  notes: Joi.string().optional(),
  followUpRequired: Joi.boolean().optional(),
  followUpDate: Joi.date().iso().optional()
});

// ==========================================
// GROWTH MEASUREMENTS VALIDATION SCHEMAS
// ==========================================

export const createGrowthMeasurementPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  measurementDate: Joi.date().iso().required().description('Measurement date'),
  height: Joi.number().positive().optional().description('Height in cm'),
  weight: Joi.number().positive().optional().description('Weight in kg'),
  bmi: Joi.number().positive().optional().description('BMI value'),
  headCircumference: Joi.number().positive().optional().description('Head circumference in cm'),
  notes: Joi.string().optional().description('Additional notes')
});

export const updateGrowthMeasurementPayload = Joi.object({
  measurementDate: Joi.date().iso().optional(),
  height: Joi.number().positive().optional(),
  weight: Joi.number().positive().optional(),
  bmi: Joi.number().positive().optional(),
  headCircumference: Joi.number().positive().optional(),
  notes: Joi.string().optional()
});

export const growthTrendsQuery = Joi.object({
  startDate: Joi.date().iso().optional().description('Start date for trends'),
  endDate: Joi.date().iso().optional().description('End date for trends')
});

// ==========================================
// VITAL SIGNS VALIDATION SCHEMAS
// ==========================================

export const vitalSignsQuery = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10).description('Number of records')
});

export const createVitalSignsPayload = Joi.object({
  studentId: Joi.string().required().description('Student ID'),
  recordedAt: Joi.date().iso().required().description('Recording timestamp'),
  bloodPressureSystolic: Joi.number().integer().min(50).max(250).optional().description('Systolic BP'),
  bloodPressureDiastolic: Joi.number().integer().min(30).max(150).optional().description('Diastolic BP'),
  heartRate: Joi.number().integer().min(30).max(220).optional().description('Heart rate (bpm)'),
  temperature: Joi.number().min(32).max(43).optional().description('Temperature in Celsius'),
  respiratoryRate: Joi.number().integer().min(8).max(60).optional().description('Respiratory rate'),
  oxygenSaturation: Joi.number().min(0).max(100).optional().description('O2 saturation (%)'),
  notes: Joi.string().optional().description('Additional notes')
});

export const vitalTrendsQuery = Joi.object({
  startDate: Joi.date().iso().optional().description('Start date for trends'),
  endDate: Joi.date().iso().optional().description('End date for trends')
});

// ==========================================
// SEARCH AND UTILITY VALIDATION SCHEMAS
// ==========================================

export const searchQuery = Joi.object({
  q: Joi.string().required().min(2).description('Search query'),
  type: Joi.string().valid(...healthRecordTypes).optional().description('Filter by type'),
  page: Joi.number().integer().min(1).default(1).description('Page number'),
  limit: Joi.number().integer().min(1).max(100).default(20).description('Records per page')
});

export const bulkDeletePayload = Joi.object({
  recordIds: Joi.array().items(Joi.string()).min(1).required().description('Array of record IDs to delete')
});

export const importHealthRecordsPayload = Joi.object({
  records: Joi.array().items(Joi.object()).required().description('Health records to import'),
  overwrite: Joi.boolean().default(false).description('Overwrite existing records')
});
