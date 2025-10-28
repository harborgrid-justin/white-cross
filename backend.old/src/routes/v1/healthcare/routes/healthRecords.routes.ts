/**
 * @fileoverview Health Records Management Routes (v1)
 *
 * HTTP route definitions for comprehensive health record management including general
 * health records, allergies, chronic conditions, vaccinations/immunizations, vital signs,
 * and medical summaries. Implements secure healthcare data management with role-based
 * access control and HIPAA-compliant audit logging.
 *
 * **Available Endpoints (27 routes):**
 *
 * **General Health Records (5 routes):**
 * - GET /api/v1/health-records/student/{studentId} - List all health records for student
 * - GET /api/v1/health-records/{id} - Get health record by ID
 * - POST /api/v1/health-records - Create new health record
 * - PUT /api/v1/health-records/{id} - Update health record
 * - DELETE /api/v1/health-records/{id} - Delete health record (soft delete)
 *
 * **Allergy Management (5 routes):**
 * - GET /api/v1/health-records/student/{studentId}/allergies - List all allergies for student
 * - GET /api/v1/health-records/allergies/{id} - Get allergy by ID
 * - POST /api/v1/health-records/allergies - Add new allergy
 * - PUT /api/v1/health-records/allergies/{id} - Update allergy information
 * - DELETE /api/v1/health-records/allergies/{id} - Remove allergy record
 *
 * **Chronic Conditions (5 routes):**
 * - GET /api/v1/health-records/student/{studentId}/conditions - List chronic conditions
 * - GET /api/v1/health-records/conditions/{id} - Get chronic condition by ID
 * - POST /api/v1/health-records/conditions - Add new chronic condition
 * - PUT /api/v1/health-records/conditions/{id} - Update chronic condition
 * - DELETE /api/v1/health-records/conditions/{id} - Remove chronic condition
 *
 * **Vaccinations/Immunizations (5 routes):**
 * - GET /api/v1/health-records/student/{studentId}/vaccinations - List vaccinations
 * - GET /api/v1/health-records/vaccinations/{id} - Get vaccination by ID
 * - POST /api/v1/health-records/vaccinations - Add new vaccination record
 * - PUT /api/v1/health-records/vaccinations/{id} - Update vaccination record
 * - DELETE /api/v1/health-records/vaccinations/{id} - Remove vaccination record
 *
 * **Vital Signs & Growth (3 routes):**
 * - POST /api/v1/health-records/vitals - Record vital signs
 * - GET /api/v1/health-records/student/{studentId}/vitals/latest - Get latest vital signs
 * - GET /api/v1/health-records/student/{studentId}/vitals/history - Get vitals history
 *
 * **Summary & Reports (2 routes):**
 * - GET /api/v1/health-records/student/{studentId}/summary - Get comprehensive medical summary
 * - GET /api/v1/health-records/student/{studentId}/immunization-status - Check immunization compliance
 *
 * **Security Features:**
 * - All routes require JWT authentication
 * - HIGHLY SENSITIVE PHI-protected endpoints with comprehensive audit logging
 * - NURSE or ADMIN role required for create/update/delete operations
 * - Medical professional authorization required for allergy/condition changes
 * - Soft deletion preserves historical records for compliance
 * - Student-specific data restricted by nurse assignment and role
 *
 * **HIPAA Compliance:**
 * - All health record access is logged with timestamp and user for complete audit trail
 * - PHI protection on all endpoints returning medical information
 * - Deletion maintains archived records for legal and medical reference
 * - Critical safety data (allergies, chronic conditions) prominently marked
 * - Emergency access protocols for life-threatening situations
 *
 * **Record Types:**
 * - CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM
 * - MENTAL_HEALTH, DENTAL, VISION, HEARING
 *
 * **Allergy Severity Levels:**
 * - MILD, MODERATE, SEVERE, LIFE_THREATENING
 * - Types: FOOD, MEDICATION, ENVIRONMENTAL, INSECT, OTHER
 *
 * **Chronic Condition Status:**
 * - ACTIVE, CONTROLLED, IN_REMISSION, CURED
 *
 * @module routes/v1/healthcare/routes/healthRecords.routes
 * @requires @hapi/hapi
 * @requires joi
 * @requires ../controllers/healthRecords.controller
 * @requires ../validators/healthRecords.validators
 * @requires ../schemas/healthRecords.response.schemas
 * @see {@link module:routes/v1/healthcare/controllers/healthRecords.controller} for business logic
 * @see {@link module:routes/v1/healthcare/validators/healthRecords.validators} for validation schemas
 * @see {@link module:routes/v1/healthcare/schemas/healthRecords.response.schemas} for response schemas
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Get comprehensive medical summary (Emergency reference)
 * GET /api/v1/health-records/student/{studentId}/summary
 * Authorization: Bearer <token>
 * // Response: { allergies, conditions, medications, vitals, immunizations }
 *
 * // Create new health record
 * POST /api/v1/health-records
 * Authorization: Bearer <nurse-token>
 * {
 *   "studentId": "660e8400-e29b-41d4-a716-446655440000",
 *   "recordType": "CHECKUP",
 *   "recordDate": "2025-10-23",
 *   "provider": "Dr. Jane Smith",
 *   "diagnosis": "Healthy - routine annual exam",
 *   "followUpRequired": false
 * }
 *
 * // Add critical allergy (LIFE_THREATENING)
 * POST /api/v1/health-records/allergies
 * Authorization: Bearer <nurse-token>
 * {
 *   "studentId": "660e8400-e29b-41d4-a716-446655440000",
 *   "allergen": "Peanuts",
 *   "allergyType": "FOOD",
 *   "severity": "LIFE_THREATENING",
 *   "reaction": "Anaphylaxis, difficulty breathing",
 *   "treatment": "EpiPen auto-injector",
 *   "verifiedByMD": true,
 *   "notes": "Carries EpiPen at all times"
 * }
 *
 * // Record vital signs with growth tracking
 * POST /api/v1/health-records/vitals
 * Authorization: Bearer <nurse-token>
 * {
 *   "studentId": "660e8400-e29b-41d4-a716-446655440000",
 *   "recordDate": "2025-10-23T10:30:00Z",
 *   "temperature": 98.6,
 *   "bloodPressureSystolic": 110,
 *   "bloodPressureDiastolic": 70,
 *   "heartRate": 72,
 *   "height": 150.5,
 *   "weight": 45.2,
 *   "notes": "Normal vitals, healthy growth"
 * }
 *
 * // Add vaccination with dose tracking
 * POST /api/v1/health-records/vaccinations
 * Authorization: Bearer <nurse-token>
 * {
 *   "studentId": "660e8400-e29b-41d4-a716-446655440000",
 *   "vaccineName": "DTaP (Diphtheria, Tetanus, Pertussis)",
 *   "cvxCode": "106",
 *   "lotNumber": "12345ABC",
 *   "administrationDate": "2025-10-23",
 *   "doseNumber": 4,
 *   "totalDosesRequired": 5,
 *   "administeredBy": "Nurse Johnson",
 *   "nextDueDate": "2030-10-23"
 * }
 *
 * // Check immunization compliance status
 * GET /api/v1/health-records/student/{studentId}/immunization-status
 * Authorization: Bearer <token>
 * // Response: { compliant: true/false, missing: [], overdue: [], upcoming: [] }
 * ```
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { asyncHandler } from '../../../shared/utils';
import { HealthRecordsController } from '../controllers/healthRecords.controller';
import {
  healthRecordQuerySchema,
  createHealthRecordSchema,
  updateHealthRecordSchema,
  createAllergySchema,
  updateAllergySchema,
  createChronicConditionSchema,
  updateChronicConditionSchema,
  createVaccinationSchema,
  updateVaccinationSchema,
  recordVitalsSchema,
  studentIdParamSchema,
  recordIdParamSchema
} from '../validators/healthRecords.validators';
import {
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
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema
} from '../schemas/healthRecords.response.schemas';

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for comprehensive health records documentation
 */

const healthRecordObjectSchema = Joi.object({
  id: Joi.string().uuid().example('750e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  recordType: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').example('CHECKUP'),
  recordDate: Joi.date().iso().example('2025-10-23'),
  provider: Joi.string().example('Dr. Jane Smith'),
  providerType: Joi.string().example('Nurse Practitioner'),
  chiefComplaint: Joi.string().allow(null, '').example('Routine checkup'),
  diagnosis: Joi.string().allow(null, '').example('Healthy'),
  treatment: Joi.string().allow(null, '').example('None required'),
  notes: Joi.string().allow(null, '').example('Annual wellness exam completed'),
  followUpRequired: Joi.boolean().example(false),
  followUpDate: Joi.date().iso().allow(null).example(null),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('HealthRecordObject');

const allergyObjectSchema = Joi.object({
  id: Joi.string().uuid().example('850e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  allergen: Joi.string().example('Peanuts'),
  allergyType: Joi.string().valid('FOOD', 'MEDICATION', 'ENVIRONMENTAL', 'INSECT', 'OTHER').example('FOOD'),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').example('SEVERE'),
  reaction: Joi.string().example('Anaphylaxis, hives, difficulty breathing'),
  treatment: Joi.string().allow(null, '').example('EpiPen auto-injector, Benadryl'),
  diagnosedDate: Joi.date().iso().allow(null).example('2020-05-15'),
  verifiedByMD: Joi.boolean().example(true),
  notes: Joi.string().allow(null, '').example('Carries EpiPen at all times'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('AllergyObject');

const chronicConditionObjectSchema = Joi.object({
  id: Joi.string().uuid().example('950e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  conditionName: Joi.string().example('Asthma'),
  icdCode: Joi.string().allow(null, '').example('J45.909'),
  diagnosisDate: Joi.date().iso().example('2018-03-20'),
  severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE').example('MODERATE'),
  status: Joi.string().valid('ACTIVE', 'CONTROLLED', 'IN_REMISSION', 'CURED').example('CONTROLLED'),
  carePlan: Joi.string().allow(null, '').example('Inhaler as needed, avoid cold air triggers'),
  medications: Joi.string().allow(null, '').example('Albuterol inhaler'),
  restrictions: Joi.string().allow(null, '').example('May need breaks during intense physical activity'),
  triggers: Joi.string().allow(null, '').example('Cold air, exercise, allergens'),
  reviewDate: Joi.date().iso().allow(null).example('2026-03-20'),
  notes: Joi.string().allow(null, '').example('Well-controlled with medication'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('ChronicConditionObject');

const vaccinationObjectSchema = Joi.object({
  id: Joi.string().uuid().example('a50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  vaccineName: Joi.string().example('DTaP (Diphtheria, Tetanus, Pertussis)'),
  cvxCode: Joi.string().allow(null, '').example('106'),
  ndcCode: Joi.string().allow(null, '').example('00006-4898-00'),
  lotNumber: Joi.string().allow(null, '').example('12345ABC'),
  manufacturer: Joi.string().allow(null, '').example('Sanofi Pasteur'),
  administrationDate: Joi.date().iso().example('2025-10-23'),
  doseNumber: Joi.number().integer().allow(null).example(4),
  totalDosesRequired: Joi.number().integer().allow(null).example(5),
  route: Joi.string().allow(null, '').example('Intramuscular'),
  site: Joi.string().allow(null, '').example('Left deltoid'),
  administeredBy: Joi.string().example('Nurse Johnson'),
  adverseReaction: Joi.string().allow(null, '').example(null),
  nextDueDate: Joi.date().iso().allow(null).example('2030-10-23'),
  notes: Joi.string().allow(null, '').example('No adverse reactions observed'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('VaccinationObject');

const vitalsObjectSchema = Joi.object({
  id: Joi.string().uuid().example('b50e8400-e29b-41d4-a716-446655440000'),
  studentId: Joi.string().uuid().example('660e8400-e29b-41d4-a716-446655440000'),
  recordDate: Joi.date().iso().example('2025-10-23T10:30:00Z'),
  temperature: Joi.number().allow(null).example(98.6).description('Temperature in Fahrenheit'),
  bloodPressureSystolic: Joi.number().integer().allow(null).example(110),
  bloodPressureDiastolic: Joi.number().integer().allow(null).example(70),
  heartRate: Joi.number().integer().allow(null).example(72).description('Beats per minute'),
  respiratoryRate: Joi.number().integer().allow(null).example(16).description('Breaths per minute'),
  oxygenSaturation: Joi.number().allow(null).example(98).description('Percentage'),
  height: Joi.number().allow(null).example(150.5).description('Height in cm'),
  weight: Joi.number().allow(null).example(45.2).description('Weight in kg'),
  bmi: Joi.number().allow(null).example(20.1).description('Body Mass Index (auto-calculated)'),
  notes: Joi.string().allow(null, '').example('Normal vitals'),
  recordedBy: Joi.string().example('Nurse Williams'),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso()
}).label('VitalsObject');

const paginationObjectSchema = Joi.object({
  page: Joi.number().integer().example(1),
  limit: Joi.number().integer().example(20),
  total: Joi.number().integer().example(87),
  pages: Joi.number().integer().example(5)
}).label('PaginationObject');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Health record not found'),
    code: Joi.string().optional().example('HEALTH_RECORD_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

/**
 * GENERAL HEALTH RECORDS ROUTES
 */

const listStudentRecordsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}',
  handler: asyncHandler(HealthRecordsController.listStudentRecords),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'v1'],
    description: 'Get all health records for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns comprehensive paginated health records for a student. Includes all medical history: checkups, illnesses, injuries, screenings, exams. Supports filtering by type, date range, and provider. All access is logged for HIPAA compliance.',
    validate: {
      params: studentIdParamSchema,
      query: healthRecordQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Health records retrieved successfully with pagination',
            schema: HealthRecordListResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Must be assigned nurse or admin for this student',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found - Invalid student ID',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const getRecordByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/{id}',
  handler: asyncHandler(HealthRecordsController.getRecordById),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'v1'],
    description: 'Get health record by ID',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns detailed health record including medical information, provider details, vitals, and associated notes. Access is logged.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Health record retrieved successfully',
            schema: HealthRecordResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Health record not found - Invalid record ID',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const createRecordRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-records',
  handler: asyncHandler(HealthRecordsController.createRecord),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'v1'],
    description: 'Create new health record',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Creates new health record entry. Record types: CHECKUP, VACCINATION, ILLNESS, INJURY, SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING. Date cannot be future. All creation is logged for audit trail.',
    validate: {
      payload: createHealthRecordSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Health record created successfully',
            schema: HealthRecordResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid record data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const updateRecordRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/health-records/{id}',
  handler: asyncHandler(HealthRecordsController.updateRecord),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'v1'],
    description: 'Update health record',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Updates existing health record. All updates are logged with timestamp and user for complete audit trail. Cannot modify archived records.',
    validate: {
      params: recordIdParamSchema,
      payload: updateHealthRecordSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Health record updated successfully',
            schema: HealthRecordResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid update data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Health record not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const deleteRecordRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/health-records/{id}',
  handler: asyncHandler(HealthRecordsController.deleteRecord),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'v1'],
    description: 'Delete health record',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Soft-deletes health record (archives it). Does not permanently delete - maintains for compliance and historical reference. Deletion is logged. Admin only.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': {
            description: 'Health record deleted successfully (no content)',
            schema: DeleteSuccessResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Admin only',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Health record not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * ALLERGY MANAGEMENT ROUTES
 */

const listAllergiesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/allergies',
  handler: asyncHandler(HealthRecordsController.listAllergies),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Allergies', 'Healthcare', 'v1'],
    description: 'Get all allergies for a student',
    notes: '**CRITICAL PHI ENDPOINT** - Returns all known allergies for a student including severity levels (MILD, MODERATE, SEVERE, LIFE_THREATENING). Critical for medication administration and emergency response. Displayed prominently in student profile. HIPAA Compliance: All access is logged.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Allergies retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                allergies: Joi.array().items(allergyObjectSchema).description('Array of allergy records with severity levels')
              })
            }).label('ListAllergiesResponse')
          },
          '401': { description: 'Unauthorized', schema: errorResponseSchema },
          '404': { description: 'Student not found', schema: errorResponseSchema }
        }
      }
    }
  }
};

const getAllergyByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/allergies/{id}',
  handler: asyncHandler(HealthRecordsController.getAllergyById),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Allergies', 'Healthcare', 'v1'],
    description: 'Get allergy by ID',
    notes: '**CRITICAL PHI ENDPOINT** - Returns detailed allergy information including allergen, severity, typical reactions, and recommended treatment.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Allergy retrieved successfully',
            schema: AllergyResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Allergy not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const createAllergyRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-records/allergies',
  handler: asyncHandler(HealthRecordsController.createAllergy),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Allergies', 'Healthcare', 'v1'],
    description: 'Add new allergy',
    notes: '**CRITICAL PHI ENDPOINT** - Records new allergy for a student. Severity levels: MILD, MODERATE, SEVERE, LIFE_THREATENING. Can be verified by medical professional. Triggers safety alerts in medication system.',
    validate: {
      payload: createAllergySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Allergy created successfully',
            schema: AllergyResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid allergy data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const updateAllergyRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/health-records/allergies/{id}',
  handler: asyncHandler(HealthRecordsController.updateAllergy),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Allergies', 'Healthcare', 'v1'],
    description: 'Update allergy information',
    notes: '**CRITICAL PHI ENDPOINT** - Updates allergy details including severity changes, new reactions, or treatment protocols. All updates logged for safety audit trail.',
    validate: {
      params: recordIdParamSchema,
      payload: updateAllergySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Allergy updated successfully',
            schema: AllergyResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid update data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Allergy not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const deleteAllergyRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/health-records/allergies/{id}',
  handler: asyncHandler(HealthRecordsController.deleteAllergy),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Allergies', 'Healthcare', 'v1'],
    description: 'Remove allergy record',
    notes: '**CRITICAL PHI ENDPOINT** - Removes allergy from active list (soft delete - archives for historical reference). Used when allergy is outgrown or misdiagnosed. Requires medical professional authorization. Logged for safety audit.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': {
            description: 'Allergy deleted successfully (no content)',
            schema: DeleteSuccessResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Medical professional authorization required',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Allergy not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * CHRONIC CONDITION ROUTES
 */

const listConditionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/conditions',
  handler: asyncHandler(HealthRecordsController.listConditions),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'ChronicConditions', 'Healthcare', 'v1'],
    description: 'Get all chronic conditions for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns chronic/ongoing medical conditions (asthma, diabetes, epilepsy, etc.) with status (ACTIVE, CONTROLLED, IN_REMISSION, CURED), severity, care plans, and management protocols. Critical for daily care and emergency response.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Chronic conditions retrieved successfully',
            schema: ChronicConditionListResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const getConditionByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/conditions/{id}',
  handler: asyncHandler(HealthRecordsController.getConditionById),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'ChronicConditions', 'Healthcare', 'v1'],
    description: 'Get chronic condition by ID',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns detailed chronic condition information including diagnosis date, severity, care plan, medications, restrictions, triggers, and review schedule.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Chronic condition retrieved successfully',
            schema: ChronicConditionResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Chronic condition not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const createConditionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-records/conditions',
  handler: asyncHandler(HealthRecordsController.createCondition),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'ChronicConditions', 'Healthcare', 'v1'],
    description: 'Add new chronic condition',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Records new chronic condition diagnosis. Includes ICD-10 code, care plan, medications, activity restrictions, condition triggers, and review schedule. Used for ongoing care management and emergency preparedness.',
    validate: {
      payload: createChronicConditionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Chronic condition created successfully',
            schema: ChronicConditionResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid condition data or ICD-10 code',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const updateConditionRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/health-records/conditions/{id}',
  handler: asyncHandler(HealthRecordsController.updateCondition),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'ChronicConditions', 'Healthcare', 'v1'],
    description: 'Update chronic condition',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Updates condition status, severity, care plan, or management protocols. Used for periodic reviews and status changes (e.g., ACTIVE → CONTROLLED). All updates logged with medical professional authorization.',
    validate: {
      params: recordIdParamSchema,
      payload: updateChronicConditionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Chronic condition updated successfully',
            schema: ChronicConditionResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid update data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Chronic condition not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const deleteConditionRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/health-records/conditions/{id}',
  handler: asyncHandler(HealthRecordsController.deleteCondition),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'ChronicConditions', 'Healthcare', 'v1'],
    description: 'Remove chronic condition',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Archives chronic condition (soft delete). Used when condition is cured or resolved. Historical record maintained for medical reference. Requires medical professional authorization.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': {
            description: 'Chronic condition deleted successfully (no content)',
            schema: DeleteSuccessResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Medical professional authorization required',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Chronic condition not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * VACCINATION/IMMUNIZATION ROUTES
 */

const listVaccinationsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/vaccinations',
  handler: asyncHandler(HealthRecordsController.listVaccinations),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Get all vaccinations for a student',
    notes: '**PHI Protected Endpoint** - Returns immunization history with vaccine names, dates, lot numbers, and dose tracking. Used for compliance verification, school enrollment, and planning boosters. Includes CVX codes for standardized reporting. HIPAA Compliance: All access is logged.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Vaccinations retrieved successfully',
            schema: Joi.object({
              success: Joi.boolean().example(true),
              data: Joi.object({
                vaccinations: Joi.array().items(vaccinationObjectSchema).description('Array of vaccination/immunization records')
              })
            }).label('ListVaccinationsResponse')
          },
          '401': { description: 'Unauthorized', schema: errorResponseSchema },
          '404': { description: 'Student not found', schema: errorResponseSchema }
        }
      }
    }
  }
};

const getVaccinationByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/vaccinations/{id}',
  handler: asyncHandler(HealthRecordsController.getVaccinationById),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Get vaccination by ID',
    notes: '**PHI Protected Endpoint** - Returns detailed vaccination record including administration details, lot number, manufacturer, dose sequence, and any reactions. Used for vaccine safety tracking and compliance documentation.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Vaccination retrieved successfully',
            schema: VaccinationResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Vaccination not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const createVaccinationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-records/vaccinations',
  handler: asyncHandler(HealthRecordsController.createVaccination),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Add new vaccination record',
    notes: '**PHI Protected Endpoint** - Records new vaccination/immunization. Includes CVX code, NDC code, lot number, manufacturer, dose tracking, administration route/site, and any adverse reactions. Used for immunization compliance and public health reporting.',
    validate: {
      payload: createVaccinationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Vaccination created successfully',
            schema: VaccinationResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid vaccination data or date sequence',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const updateVaccinationRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/health-records/vaccinations/{id}',
  handler: asyncHandler(HealthRecordsController.updateVaccination),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Update vaccination record',
    notes: '**PHI Protected Endpoint** - Updates vaccination details such as dose completion, next due date, or adverse reactions. All updates logged for vaccine safety monitoring.',
    validate: {
      params: recordIdParamSchema,
      payload: updateVaccinationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Vaccination updated successfully',
            schema: VaccinationResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid update data',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Vaccination not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const deleteVaccinationRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/health-records/vaccinations/{id}',
  handler: asyncHandler(HealthRecordsController.deleteVaccination),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Remove vaccination record',
    notes: '**PHI Protected Endpoint** - Archives vaccination record (soft delete). Used for data correction only. Historical record maintained for compliance. Requires medical professional authorization.',
    validate: {
      params: recordIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': {
            description: 'Vaccination deleted successfully (no content)',
            schema: DeleteSuccessResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Medical professional authorization required',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Vaccination not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * VITAL SIGNS & GROWTH ROUTES
 */

const recordVitalsRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/health-records/vitals',
  handler: asyncHandler(HealthRecordsController.recordVitals),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vitals', 'Healthcare', 'v1'],
    description: 'Record vital signs',
    notes: '**PHI Protected Endpoint** - Records vital signs: temperature (90-115°F), blood pressure, heart rate (30-250 bpm), respiratory rate (5-60/min), oxygen saturation (70-100%), height (30-250 cm), weight (5-500 kg), BMI (auto-calculated). Used for health monitoring, screening, and trend analysis.',
    validate: {
      payload: recordVitalsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Vital signs recorded successfully',
            schema: VitalsResponseSchema
          },
          '400': {
            description: 'Validation error - Vital signs out of acceptable range',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const getLatestVitalsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/vitals/latest',
  handler: asyncHandler(HealthRecordsController.getLatestVitals),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vitals', 'Healthcare', 'v1'],
    description: 'Get latest vital signs',
    notes: '**PHI Protected Endpoint** - Returns most recent vital signs for a student. Used for quick health status check and baseline comparison.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Latest vital signs retrieved successfully',
            schema: VitalsResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Student not found or no vitals recorded',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const getVitalsHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/vitals/history',
  handler: asyncHandler(HealthRecordsController.getVitalsHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vitals', 'Healthcare', 'v1'],
    description: 'Get vital signs history',
    notes: '**PHI Protected Endpoint** - Returns paginated history of vital sign measurements. Used for growth tracking, trend analysis, and identifying health concerns. Supports charting and visualization.',
    validate: {
      params: studentIdParamSchema,
      query: healthRecordQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Vital signs history retrieved successfully with pagination',
            schema: VitalsHistoryResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * SUMMARY & REPORT ROUTES
 */

const getMedicalSummaryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/summary',
  handler: asyncHandler(HealthRecordsController.getMedicalSummary),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Healthcare', 'Reports', 'v1'],
    description: 'Get comprehensive medical summary',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns complete medical overview: active allergies, chronic conditions, current medications, immunization status, recent vitals, and care plans. Used for dashboard display, emergency reference, and care coordination. Critical for emergency responders.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medical summary retrieved successfully',
            schema: MedicalSummaryResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

const getImmunizationStatusRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/health-records/student/{studentId}/immunization-status',
  handler: asyncHandler(HealthRecordsController.getImmunizationStatus),
  options: {
    auth: 'jwt',
    tags: ['api', 'HealthRecords', 'Vaccinations', 'Healthcare', 'v1'],
    description: 'Check immunization compliance status',
    notes: 'Returns immunization compliance check against state/district requirements. Identifies missing or overdue vaccines, upcoming boosters, and overall compliance status. Used for school enrollment verification and public health reporting. No detailed PHI - just compliance status.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Immunization status retrieved successfully',
            schema: ImmunizationStatusResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Student not found',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error',
            schema: ErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * Health records management route collection.
 *
 * Complete set of 27 routes for comprehensive health record management organized
 * into 6 functional categories. All routes are HIGHLY SENSITIVE PHI-protected with
 * HIPAA-compliant audit logging and role-based access control.
 *
 * **Route Categories:**
 * - General Health Records: CRUD operations for medical visits and exams (5 routes)
 * - Allergy Management: Critical safety data tracking with severity levels (5 routes)
 * - Chronic Conditions: Ongoing condition management with care plans (5 routes)
 * - Vaccinations: Immunization tracking with CDC compliance (5 routes)
 * - Vital Signs: Growth tracking and health monitoring (3 routes)
 * - Summary & Reports: Comprehensive medical overview and compliance (2 routes)
 *
 * **Permission Model:**
 * - NURSE/ADMIN: Full access to create, update, delete health records
 * - Medical Professional: Required for allergy/condition modifications
 * - All authenticated users: Can view records (with scope restrictions)
 * - Student-specific queries: Restricted by nurse assignment and role
 *
 * **Key Features:**
 * - Comprehensive medical history tracking across multiple categories
 * - Critical safety alerts for life-threatening allergies
 * - Growth percentile tracking and trend analysis
 * - Immunization compliance checking against state/CDC requirements
 * - Emergency medical summary for first responders
 * - Soft deletion with historical record preservation
 * - Complete Swagger/OpenAPI documentation for all endpoints
 *
 * **HIPAA Compliance:**
 * Every health record operation creates audit trail entries including:
 * - User who accessed/modified the record
 * - Timestamp of access/modification
 * - Type of operation (create, read, update, delete)
 * - Student identifier and record type
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // Import and register routes in Hapi server
 * import { healthRecordsRoutes } from './routes/healthRecords.routes';
 * server.route(healthRecordsRoutes);
 * ```
 */
export const healthRecordsRoutes: ServerRoute[] = [
  // General health records
  listStudentRecordsRoute,
  getRecordByIdRoute,
  createRecordRoute,
  updateRecordRoute,
  deleteRecordRoute,

  // Allergies
  listAllergiesRoute,
  getAllergyByIdRoute,
  createAllergyRoute,
  updateAllergyRoute,
  deleteAllergyRoute,

  // Chronic conditions
  listConditionsRoute,
  getConditionByIdRoute,
  createConditionRoute,
  updateConditionRoute,
  deleteConditionRoute,

  // Vaccinations
  listVaccinationsRoute,
  getVaccinationByIdRoute,
  createVaccinationRoute,
  updateVaccinationRoute,
  deleteVaccinationRoute,

  // Vitals & growth
  recordVitalsRoute,
  getLatestVitalsRoute,
  getVitalsHistoryRoute,

  // Summary & reports
  getMedicalSummaryRoute,
  getImmunizationStatusRoute
];
