/**
 * Health Records Routes
 * HTTP endpoints for comprehensive health record management
 * All routes prefixed with /api/v1/health-records
 */

import { ServerRoute } from '@hapi/hapi';
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
          '200': { description: 'Health records retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Must be assigned nurse or admin' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Health record retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Health record not found' }
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
          '201': { description: 'Health record created successfully' },
          '400': { description: 'Validation error - Invalid record data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Health record updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Health record not found' }
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
          '200': { description: 'Health record deleted successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Health record not found' }
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
    notes: '**CRITICAL PHI ENDPOINT** - Returns all known allergies for a student including severity levels (MILD, MODERATE, SEVERE, LIFE_THREATENING). Critical for medication administration and emergency response. Displayed prominently in student profile.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Allergies retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Allergy retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Allergy not found' }
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
          '201': { description: 'Allergy created successfully' },
          '400': { description: 'Validation error - Invalid allergy data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Allergy updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Allergy not found' }
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
          '200': { description: 'Allergy deleted successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Medical professional authorization required' },
          '404': { description: 'Allergy not found' }
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
          '200': { description: 'Chronic conditions retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Chronic condition retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Chronic condition not found' }
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
          '201': { description: 'Chronic condition created successfully' },
          '400': { description: 'Validation error - Invalid condition data or ICD-10 code' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Chronic condition updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Chronic condition not found' }
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
          '200': { description: 'Chronic condition deleted successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Medical professional authorization required' },
          '404': { description: 'Chronic condition not found' }
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
    notes: '**PHI Protected Endpoint** - Returns immunization history with vaccine names, dates, lot numbers, and dose tracking. Used for compliance verification, school enrollment, and planning boosters. Includes CVX codes for standardized reporting.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Vaccinations retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Vaccination retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Vaccination not found' }
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
          '201': { description: 'Vaccination created successfully' },
          '400': { description: 'Validation error - Invalid vaccination data or date sequence' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Vaccination updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Vaccination not found' }
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
          '200': { description: 'Vaccination deleted successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Medical professional authorization required' },
          '404': { description: 'Vaccination not found' }
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
          '201': { description: 'Vital signs recorded successfully' },
          '400': { description: 'Validation error - Vital signs out of acceptable range' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Latest vital signs retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found or no vitals recorded' }
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
          '200': { description: 'Vital signs history retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Medical summary retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
          '200': { description: 'Immunization status retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
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
