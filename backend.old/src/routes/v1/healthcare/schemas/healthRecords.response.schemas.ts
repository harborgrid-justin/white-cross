/**
 * Health Records Response Schemas - Comprehensive Swagger/OpenAPI Documentation
 *
 * This file contains all response schemas for health records endpoints (27 routes):
 * - General health records (5 routes)
 * - Allergy management (5 routes)
 * - Chronic conditions (5 routes)
 * - Vaccinations/immunizations (5 routes)
 * - Vital signs & growth (3 routes)
 * - Summary & reports (2 routes)
 *
 * HIPAA Compliance: All schemas marked with PHI protection metadata
 * OpenAPI Version: 2.0/3.0 compatible using Joi schemas
 *
 * @module healthRecords.response.schemas
 */

import Joi from 'joi';

/**
 * PAGINATION METADATA SCHEMA
 * Reused across all paginated responses
 */
export const PaginationObjectSchema = Joi.object({
  page: Joi.number().integer().min(1).example(1).description('Current page number'),
  limit: Joi.number().integer().min(1).max(100).example(20).description('Items per page'),
  total: Joi.number().integer().min(0).example(87).description('Total items'),
  pages: Joi.number().integer().min(0).example(5).description('Total pages')
}).label('PaginationObject');

/**
 * HEALTH RECORD OBJECT SCHEMA
 * Core health record entry (checkups, illnesses, injuries, etc.)
 *
 * @schema HealthRecordObject
 * @hipaa HIGHLY SENSITIVE PHI
 */
export const HealthRecordObjectSchema = Joi.object({
  id: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  recordType: Joi.string()
    .valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING')
    .example('CHECKUP')
    .description('Type of health record'),
  recordDate: Joi.date().iso().example('2025-10-23T00:00:00Z'),
  provider: Joi.string().example('Dr. Jane Smith').description('Healthcare provider name'),
  providerType: Joi.string().example('Nurse Practitioner').allow(null, ''),
  chiefComplaint: Joi.string().allow(null, '').example('Routine annual checkup'),
  diagnosis: Joi.string().allow(null, '').example('Healthy, no concerns noted'),
  treatment: Joi.string().allow(null, '').example('None required'),
  notes: Joi.string().allow(null, '').example('Annual wellness exam completed. All vitals normal.'),
  followUpRequired: Joi.boolean().example(false),
  followUpDate: Joi.date().iso().allow(null).example(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('HealthRecordObject').description('Complete health record entry with medical details');

/**
 * ALLERGY OBJECT SCHEMA
 * Student allergy record with severity and reactions
 *
 * @schema AllergyObject
 * @hipaa CRITICAL PHI - allergy information is life-safety critical
 */
export const AllergyObjectSchema = Joi.object({
  id: Joi.string().uuid().example('850e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  allergen: Joi.string().example('Peanuts').description('Allergen substance'),
  allergyType: Joi.string()
    .valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'OTHER')
    .example('FOOD')
    .description('Category of allergy'),
  severity: Joi.string()
    .valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING')
    .example('SEVERE')
    .description('Severity level (critical for emergency response)'),
  reaction: Joi.string()
    .example('Anaphylaxis, hives, difficulty breathing, swelling')
    .description('Typical reaction symptoms'),
  treatment: Joi.string()
    .allow(null, '')
    .example('EpiPen auto-injector, Benadryl, call 911')
    .description('Emergency treatment protocol'),
  diagnosedDate: Joi.date().iso().allow(null).example('2020-05-15T00:00:00Z'),
  verifiedByMD: Joi.boolean().example(true).description('Verified by medical professional'),
  notes: Joi.string().allow(null, '').example('Carries EpiPen at all times. Avoid all nut products.'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('AllergyObject').description('Allergy record with severity and treatment information');

/**
 * CHRONIC CONDITION OBJECT SCHEMA
 * Long-term health condition tracking
 *
 * @schema ChronicConditionObject
 * @hipaa HIGHLY SENSITIVE PHI
 */
export const ChronicConditionObjectSchema = Joi.object({
  id: Joi.string().uuid().example('950e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  conditionName: Joi.string().example('Asthma').description('Condition name'),
  icdCode: Joi.string().allow(null, '').example('J45.909').description('ICD-10 diagnosis code'),
  diagnosisDate: Joi.date().iso().example('2018-03-20T00:00:00Z'),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').example('MODERATE'),
  status: Joi.string()
    .valid('ACTIVE', 'CONTROLLED', 'IN_REMISSION', 'CURED')
    .example('CONTROLLED')
    .description('Current condition status'),
  carePlan: Joi.string()
    .allow(null, '')
    .example('Use rescue inhaler as needed, avoid cold air triggers')
    .description('Care management plan'),
  medications: Joi.string().allow(null, '').example('Albuterol inhaler'),
  restrictions: Joi.string()
    .allow(null, '')
    .example('May need breaks during intense physical activity'),
  triggers: Joi.string().allow(null, '').example('Cold air, exercise, pollen, pet dander'),
  reviewDate: Joi.date().iso().allow(null).example('2026-03-20T00:00:00Z'),
  notes: Joi.string().allow(null, '').example('Well-controlled with current medication regimen'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('ChronicConditionObject').description('Chronic condition record with care plan');

/**
 * VACCINATION OBJECT SCHEMA
 * Immunization record with lot numbers and dose tracking
 *
 * @schema VaccinationObject
 * @hipaa PHI Protected
 */
export const VaccinationObjectSchema = Joi.object({
  id: Joi.string().uuid().example('a50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  vaccineName: Joi.string().example('DTaP (Diphtheria, Tetanus, Pertussis)'),
  cvxCode: Joi.string().allow(null, '').example('106').description('CVX vaccine code'),
  ndcCode: Joi.string().allow(null, '').example('00006-4898-00').description('NDC product code'),
  lotNumber: Joi.string().allow(null, '').example('12345ABC').description('Vaccine lot number'),
  manufacturer: Joi.string().allow(null, '').example('Sanofi Pasteur'),
  administrationDate: Joi.date().iso().example('2025-10-23T00:00:00Z'),
  doseNumber: Joi.number().integer().allow(null).example(4).description('Dose number in series'),
  totalDosesRequired: Joi.number().integer().allow(null).example(5).description('Total doses needed'),
  route: Joi.string().allow(null, '').example('Intramuscular'),
  site: Joi.string().allow(null, '').example('Left deltoid'),
  administeredBy: Joi.string().example('Nurse Johnson'),
  adverseReaction: Joi.string().allow(null, '').example(null).description('Any adverse reactions noted'),
  nextDueDate: Joi.date().iso().allow(null).example('2030-10-23T00:00:00Z'),
  notes: Joi.string().allow(null, '').example('No adverse reactions observed'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('VaccinationObject').description('Vaccination record with administration details');

/**
 * VITAL SIGNS OBJECT SCHEMA
 * Vital signs measurement record
 *
 * @schema VitalsObject
 * @hipaa PHI Protected
 */
export const VitalsObjectSchema = Joi.object({
  id: Joi.string().uuid().example('b50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  recordDate: Joi.date().iso().example('2025-10-23T10:30:00Z'),
  temperature: Joi.number().allow(null).example(98.6).description('Temperature in Fahrenheit'),
  bloodPressureSystolic: Joi.number().integer().allow(null).example(110).description('Systolic BP (mmHg)'),
  bloodPressureDiastolic: Joi.number().integer().allow(null).example(70).description('Diastolic BP (mmHg)'),
  heartRate: Joi.number().integer().allow(null).example(72).description('Beats per minute'),
  respiratoryRate: Joi.number().integer().allow(null).example(16).description('Breaths per minute'),
  oxygenSaturation: Joi.number().allow(null).example(98).description('O2 saturation percentage'),
  height: Joi.number().allow(null).example(150.5).description('Height in centimeters'),
  weight: Joi.number().allow(null).example(45.2).description('Weight in kilograms'),
  bmi: Joi.number().allow(null).example(20.1).description('Body Mass Index (auto-calculated)'),
  notes: Joi.string().allow(null, '').example('Normal vitals, student feeling well'),
  recordedBy: Joi.string().example('Nurse Williams'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('VitalsObject').description('Vital signs measurement record');

/**
 * MEDICAL SUMMARY OBJECT SCHEMA
 * Comprehensive medical overview for a student
 *
 * @schema MedicalSummaryObject
 * @hipaa HIGHLY SENSITIVE PHI - complete medical overview
 */
export const MedicalSummaryObjectSchema = Joi.object({
  studentId: Joi.string().uuid(),
  studentName: Joi.string().example('John Doe'),
  activeAllergies: Joi.array().items(AllergyObjectSchema).description('All active allergies'),
  chronicConditions: Joi.array().items(ChronicConditionObjectSchema).description('Active chronic conditions'),
  currentMedications: Joi.array().items(Joi.object()).description('Current active medications'),
  recentVitals: VitalsObjectSchema.allow(null).description('Most recent vital signs'),
  immunizationStatus: Joi.string().example('Up to date').description('Overall immunization compliance'),
  lastCheckupDate: Joi.date().iso().allow(null),
  nextScheduledAppointment: Joi.date().iso().allow(null),
  carePlans: Joi.array().items(Joi.string()).example(['Asthma management plan', 'Allergy action plan']),
  emergencyProtocols: Joi.array().items(Joi.string()).example(['EpiPen for peanut allergy', 'Inhaler for asthma'])
}).label('MedicalSummaryObject').description('Comprehensive medical summary for student');

/**
 * IMMUNIZATION STATUS OBJECT SCHEMA
 * Immunization compliance status
 *
 * @schema ImmunizationStatusObject
 */
export const ImmunizationStatusObjectSchema = Joi.object({
  studentId: Joi.string().uuid(),
  overallStatus: Joi.string().valid('COMPLIANT', 'NON_COMPLIANT', 'PENDING_REVIEW').example('COMPLIANT'),
  missingVaccines: Joi.array().items(Joi.string()).example([]).description('List of missing required vaccines'),
  overdueVaccines: Joi.array().items(Joi.string()).example([]).description('List of overdue vaccines'),
  upcomingVaccines: Joi.array().items(
    Joi.object({
      vaccineName: Joi.string().example('Tdap booster'),
      dueDate: Joi.date().iso().example('2026-01-15T00:00:00Z')
    })
  ).description('Upcoming vaccines due'),
  lastUpdated: Joi.date().iso()
}).label('ImmunizationStatusObject').description('Student immunization compliance status');

/**
 * SUCCESS RESPONSE SCHEMAS
 */

// Health Record Responses
export const HealthRecordResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    record: HealthRecordObjectSchema
  })
}).label('HealthRecordResponse');

export const HealthRecordListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    records: Joi.array().items(HealthRecordObjectSchema),
    pagination: PaginationObjectSchema
  })
}).label('HealthRecordListResponse');

// Allergy Responses
export const AllergyResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    allergy: AllergyObjectSchema
  })
}).label('AllergyResponse');

export const AllergyListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    allergies: Joi.array().items(AllergyObjectSchema)
  })
}).label('AllergyListResponse');

// Chronic Condition Responses
export const ChronicConditionResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    condition: ChronicConditionObjectSchema
  })
}).label('ChronicConditionResponse');

export const ChronicConditionListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    conditions: Joi.array().items(ChronicConditionObjectSchema)
  })
}).label('ChronicConditionListResponse');

// Vaccination Responses
export const VaccinationResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    vaccination: VaccinationObjectSchema
  })
}).label('VaccinationResponse');

export const VaccinationListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    vaccinations: Joi.array().items(VaccinationObjectSchema)
  })
}).label('VaccinationListResponse');

// Vitals Responses
export const VitalsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    vitals: VitalsObjectSchema
  })
}).label('VitalsResponse');

export const VitalsHistoryResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    vitals: Joi.array().items(VitalsObjectSchema),
    pagination: PaginationObjectSchema
  })
}).label('VitalsHistoryResponse');

// Summary Responses
export const MedicalSummaryResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    summary: MedicalSummaryObjectSchema
  })
}).label('MedicalSummaryResponse');

export const ImmunizationStatusResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    immunizationStatus: ImmunizationStatusObjectSchema
  })
}).label('ImmunizationStatusResponse');

// Delete Success Response
export const DeleteSuccessResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    message: Joi.string().example('Health record archived successfully')
  })
}).label('DeleteSuccessResponse');

/**
 * ERROR RESPONSE SCHEMAS
 */

export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Health record not found'),
    code: Joi.string().optional().example('HEALTH_RECORD_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation failed'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('recordType'),
        message: Joi.string().example('Record type must be one of: CHECKUP, ILLNESS, INJURY'),
        type: Joi.string().optional().example('any.only')
      })
    )
  })
}).label('ValidationErrorResponse');

export const UnauthorizedResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Missing authentication'),
    code: Joi.string().example('UNAUTHORIZED')
  })
}).label('UnauthorizedResponse');

export const ForbiddenResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Forbidden - Must be assigned nurse or admin'),
    code: Joi.string().example('FORBIDDEN')
  })
}).label('ForbiddenResponse');

export const NotFoundResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Student not found'),
    code: Joi.string().example('STUDENT_NOT_FOUND'),
    resourceId: Joi.string().optional()
  })
}).label('NotFoundResponse');

/**
 * EXPORT ALL SCHEMAS
 */
export default {
  // Object Schemas
  HealthRecordObjectSchema,
  AllergyObjectSchema,
  ChronicConditionObjectSchema,
  VaccinationObjectSchema,
  VitalsObjectSchema,
  MedicalSummaryObjectSchema,
  ImmunizationStatusObjectSchema,
  PaginationObjectSchema,

  // Success Response Schemas
  HealthRecordResponseSchema,
  HealthRecordListResponseSchema,
  AllergyResponseSchema,
  AllergyListResponseSchema,
  ChronicConditionResponseSchema,
  ChronicConditionListResponseSchema,
  VaccinationResponseSchema,
  VaccinationListResponseSchema,
  VitalsResponseSchema,
  VitalsHistoryResponseSchema,
  MedicalSummaryResponseSchema,
  ImmunizationStatusResponseSchema,
  DeleteSuccessResponseSchema,

  // Error Response Schemas
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema
};
