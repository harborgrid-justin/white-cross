/**
 * Medications Routes - Legacy Schema with Enhanced Swagger Documentation
 * HTTP endpoints for medication management using the legacy database schema
 * All routes prefixed with /api/v1/medications
 *
 * ⚠️ IMPORTANT: This file has been updated to work with the LEGACY database schema
 * Database table: medications (single table with medicationName, dosage, frequency, route, prescribedBy)
 * Migration: 20251011221125-create-complete-healthcare-schema.js
 *
 * Swagger/OpenAPI Documentation:
 * - Complete request/response schemas for all medication endpoints
 * - HIPAA compliance notes for PHI-protected endpoints
 * - Comprehensive error responses and status codes
 * - Request body examples and validation rules
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { asyncHandler } from '../../../shared/utils';
import { MedicationsController } from '../controllers/medications.controller';
import {
  createMedicationSchema,
  updateMedicationSchema,
  deactivateMedicationSchema,
  listMedicationsQuerySchema,
  medicationIdParamSchema,
  studentIdParamSchema,
} from '../validators/medications.validators';
import {
  MedicationResponseSchema,
  MedicationListResponseSchema,
  MedicationDeactivatedResponseSchema,
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema,
  InternalErrorResponseSchema
} from '../schemas/medications.response.schemas';

/**
 * SWAGGER SCHEMA COMPONENTS
 * Reusable response schemas for documentation
 */

const medicationObjectSchema = Joi.object({
  id: Joi.string().uuid().description('Medication unique identifier').example('550e8400-e29b-41d4-a716-446655440000'),
  medicationName: Joi.string().description('Name of the medication').example('Ibuprofen 200mg'),
  dosage: Joi.string().description('Dosage amount and unit').example('200mg'),
  frequency: Joi.string().description('How often to administer').example('Every 6 hours as needed'),
  route: Joi.string().description('Administration route').example('Oral'),
  prescribedBy: Joi.string().description('Prescribing physician name').example('Dr. Smith'),
  startDate: Joi.date().iso().description('Medication start date').example('2025-10-01'),
  endDate: Joi.date().iso().allow(null).description('Medication end date (null if ongoing)').example('2025-10-15'),
  instructions: Joi.string().allow(null, '').description('Special instructions for administration').example('Take with food'),
  sideEffects: Joi.string().allow(null, '').description('Known side effects').example('May cause drowsiness'),
  isActive: Joi.boolean().description('Whether medication is currently active').example(true),
  studentId: Joi.string().uuid().description('Student UUID').example('660e8400-e29b-41d4-a716-446655440000'),
  studentName: Joi.string().optional().description('Student full name (if included)').example('John Doe'),
  createdAt: Joi.date().iso().example('2025-10-01T08:00:00Z'),
  updatedAt: Joi.date().iso().example('2025-10-01T08:00:00Z')
}).label('MedicationObject');

const paginationObjectSchema = Joi.object({
  page: Joi.number().integer().description('Current page number').example(1),
  limit: Joi.number().integer().description('Items per page').example(10),
  total: Joi.number().integer().description('Total number of items').example(45),
  pages: Joi.number().integer().description('Total number of pages').example(5)
}).label('PaginationObject');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Medication not found'),
    code: Joi.string().optional().example('MEDICATION_NOT_FOUND'),
    details: Joi.any().optional()
  })
}).label('ErrorResponse');

// The following schemas are NOT available in legacy validators
// because they require tables that don't exist in the legacy schema:
// - assignMedicationToStudentSchema (requires student_medications table)
// - logMedicationAdministrationSchema (requires medication_logs table)
// - addToInventorySchema (requires medication_inventory table)
// - updateInventoryQuantitySchema (requires medication_inventory table)
// - reportAdverseReactionSchema (requires adverse_reactions table)
// - studentLogsQuerySchema (requires medication_logs table)
// - scheduleQuerySchema (requires student_medications table)
// - remindersQuerySchema (requires student_medications table)
// - adverseReactionsQuerySchema (requires adverse_reactions table)
// - inventoryIdParamSchema (requires medication_inventory table)
// - studentMedicationIdParamSchema (requires student_medications table)

/**
 * MEDICATION CRUD ROUTES
 */

const listMedicationsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications',
  handler: asyncHandler(MedicationsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1'],
    description: 'Get all medications with pagination',
    notes: [
      '**PHI Protected Endpoint** - Returns a paginated list of medications in the system.',
      '',
      'Supports filtering by:',
      '- `search`: Search medication names',
      '- `studentId`: Filter by student UUID',
      '- `isActive`: Filter by active status (true/false)',
      '',
      'HIPAA Compliance: All access is logged for audit trail.',
      '',
      '**Example Request:**',
      '```',
      'GET /api/v1/medications?page=1&limit=20&isActive=true&search=ibuprofen',
      '```'
    ].join('\n'),
    validate: {
      query: listMedicationsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medications retrieved successfully with pagination',
            schema: MedicationListResponseSchema
          },
          '401': {
            description: 'Authentication required - Missing or invalid JWT token',
            schema: UnauthorizedResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

const createMedicationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications',
  handler: asyncHandler(MedicationsController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Create a new medication (Legacy Schema)',
    notes: [
      '**PHI Protected Endpoint** - Creates a medication record in the legacy medications table.',
      '',
      'Required fields: medicationName, dosage, frequency, route, prescribedBy, startDate, studentId',
      'Optional fields: endDate, instructions, sideEffects, isActive',
      '',
      'Authorization: Requires NURSE or ADMIN role',
      'HIPAA Compliance: All creations are logged for audit trail',
      '',
      '**Example Request:**',
      '```json',
      '{',
      '  "medicationName": "Ibuprofen 200mg",',
      '  "dosage": "200mg",',
      '  "frequency": "Every 6 hours as needed",',
      '  "route": "Oral",',
      '  "prescribedBy": "Dr. Smith",',
      '  "startDate": "2025-10-23",',
      '  "instructions": "Take with food",',
      '  "studentId": "660e8400-e29b-41d4-a716-446655440000"',
      '}',
      '```'
    ].join('\n'),
    validate: {
      payload: createMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Medication created successfully',
            schema: MedicationResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid medication data (missing required fields or invalid format)',
            schema: ValidationErrorResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required (missing or invalid JWT token)',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Requires NURSE or ADMIN role',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found - Cannot create medication for non-existent student',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

const updateMedicationRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/medications/{id}',
  handler: asyncHandler(MedicationsController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Update a medication (Legacy Schema)',
    notes: '**PHI Protected Endpoint** - Updates a medication record. At least one field must be provided. Requires NURSE or ADMIN role. HIPAA Compliance: All updates are logged.',
    validate: {
      params: medicationIdParamSchema,
      payload: updateMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medication updated successfully',
            schema: MedicationResponseSchema
          },
          '400': {
            description: 'Validation error - Invalid update data or at least one field must be provided',
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
            description: 'Medication not found - Cannot update non-existent medication',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

const deactivateMedicationRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/medications/{id}/deactivate',
  handler: asyncHandler(MedicationsController.deactivate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Deactivate a medication (Legacy Schema)',
    notes: '**PHI Protected Endpoint** - Deactivates a medication. Requires detailed reason and deactivation type for audit trail. Does not delete historical records. HIPAA Compliance: All deactivations are logged.',
    validate: {
      params: medicationIdParamSchema,
      payload: deactivateMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medication deactivated successfully - Historical record preserved',
            schema: MedicationDeactivatedResponseSchema
          },
          '400': {
            description: 'Validation error - Deactivation reason and type required',
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
            description: 'Medication not found - Cannot deactivate non-existent medication',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

const getMedicationByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/{id}',
  handler: asyncHandler(MedicationsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Get medication by ID (Legacy Schema)',
    notes: '**PHI Protected Endpoint** - Returns a single medication record by ID. HIPAA Compliance: Access is logged.',
    validate: {
      params: medicationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medication retrieved successfully',
            schema: MedicationResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '404': {
            description: 'Medication not found - Invalid medication ID',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

const getMedicationsByStudentRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/student/{studentId}',
  handler: asyncHandler(MedicationsController.getByStudent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Get all medications for a student (Legacy Schema)',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all medication records for a specific student. HIPAA Compliance: All access is logged for audit trail.',
    validate: {
      params: studentIdParamSchema,
      query: listMedicationsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Student medications retrieved successfully with pagination',
            schema: MedicationListResponseSchema
          },
          '401': {
            description: 'Unauthorized - Authentication required',
            schema: UnauthorizedResponseSchema
          },
          '403': {
            description: 'Forbidden - Cannot view medications for students outside your scope',
            schema: ForbiddenResponseSchema
          },
          '404': {
            description: 'Student not found - Invalid student ID',
            schema: NotFoundResponseSchema
          },
          '500': {
            description: 'Internal server error - Database or system failure',
            schema: InternalErrorResponseSchema
          }
        }
      }
    }
  }
};

/**
 * @deprecated The following routes are from the NEW schema and require tables
 * that don't exist in the legacy database schema. They have been commented out.
 *
 * To enable these routes, you need to:
 * 1. Run the new migration (00004-create-medications-extended.ts)
 * 2. Migrate data from legacy medications table to new schema
 * 3. Switch imports in medications.validators.ts to use new schema validators
 * 4. Uncomment these routes
 */

/**
 * EXPORT ROUTES FOR LEGACY SCHEMA
 */

export const medicationsRoutes: ServerRoute[] = [
  // Medication CRUD (5 routes) - Works with legacy schema
  listMedicationsRoute,
  createMedicationRoute,
  getMedicationByIdRoute,
  updateMedicationRoute,
  deactivateMedicationRoute,
  getMedicationsByStudentRoute,

  // The following routes from the NEW schema have been disabled:
  // - assignMedicationRoute (requires student_medications table)
  // - deactivateStudentMedicationRoute (requires student_medications table)
  // - logAdministrationRoute (requires medication_logs table)
  // - getStudentLogsRoute (requires medication_logs table)
  // - getInventoryRoute (requires medication_inventory table)
  // - addToInventoryRoute (requires medication_inventory table)
  // - updateInventoryQuantityRoute (requires medication_inventory table)
  // - getScheduleRoute (requires student_medications table)
  // - getRemindersRoute (requires student_medications table)
  // - reportAdverseReactionRoute (requires adverse_reactions table)
  // - getAdverseReactionsRoute (requires adverse_reactions table)
  // - getStatisticsRoute (may require multiple new tables)
  // - getAlertsRoute (may require multiple new tables)
  // - getFormOptionsRoute (may work but references new schema concepts)
];
