/**
 * @fileoverview Medication Management Routes (v1) - Legacy Schema
 *
 * HTTP route definitions for comprehensive medication management including CRUD operations,
 * student medication tracking, and medication lifecycle management. Implements secure
 * medication administration with role-based access control and HIPAA compliance.
 *
 * **Available Endpoints (7 routes):**
 * - GET /api/v1/medications - List all medications with pagination and filters
 * - POST /api/v1/medications - Create new medication record
 * - GET /api/v1/medications/{id} - Get medication details by ID
 * - PUT /api/v1/medications/{id} - Update medication information
 * - POST /api/v1/medications/{id}/deactivate - Deactivate medication (soft delete)
 * - POST /api/v1/medications/{id}/activate - Reactivate medication
 * - GET /api/v1/medications/student/{studentId} - Get all medications for a student
 *
 * **Legacy Schema Notice:**
 * This file currently works with the legacy database schema using a single medications table.
 * Database table: medications (medicationName, dosage, frequency, route, prescribedBy)
 * Migration: 20251011221125-create-complete-healthcare-schema.js
 *
 * To enable extended features (inventory, administration logs, interactions), you need to:
 * 1. Run migration: 00004-create-medications-extended.ts
 * 2. Migrate data from legacy to new schema
 * 3. Switch to new schema validators
 * 4. Uncomment disabled routes (10 additional routes available)
 *
 * **Security Features:**
 * - All routes require JWT authentication
 * - PHI-protected endpoints with audit logging
 * - NURSE or ADMIN role required for create/update/delete operations
 * - Soft deletion preserves historical records for compliance
 * - Deactivation requires detailed reason and type for audit trail
 *
 * **HIPAA Compliance:**
 * - All medication access is logged for audit trail
 * - PHI protection on all endpoints returning medication data
 * - Deactivation/deletion maintains historical records
 * - Student medication access restricted by role and assignment
 *
 * **Medication Lifecycle:**
 * 1. Create: Add new medication with prescription details
 * 2. Update: Modify dosage, frequency, or instructions
 * 3. Deactivate: Soft delete with reason (discontinued, completed, error)
 * 4. Activate: Restore previously deactivated medication
 * 5. Track: Filter active/inactive medications by student or system-wide
 *
 * @module routes/v1/healthcare/routes/medications.routes
 * @requires @hapi/hapi
 * @requires joi
 * @requires ../controllers/medications.controller
 * @requires ../validators/medications.validators
 * @requires ../schemas/medications.response.schemas
 * @see {@link module:routes/v1/healthcare/controllers/medications.controller} for business logic
 * @see {@link module:routes/v1/healthcare/validators/medications.validators} for validation schemas
 * @see {@link module:routes/v1/healthcare/schemas/medications.response.schemas} for response schemas
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // List all active medications with pagination
 * GET /api/v1/medications?page=1&limit=20&isActive=true
 * Authorization: Bearer <token>
 * // Response: { success: true, data: { medications: [...], pagination: {...} } }
 *
 * // Create new medication (Nurse or Admin only)
 * POST /api/v1/medications
 * Authorization: Bearer <nurse-token>
 * {
 *   "medicationName": "Ibuprofen 200mg",
 *   "dosage": "200mg",
 *   "frequency": "Every 6 hours as needed",
 *   "route": "Oral",
 *   "prescribedBy": "Dr. Smith",
 *   "startDate": "2025-10-23",
 *   "instructions": "Take with food",
 *   "studentId": "660e8400-e29b-41d4-a716-446655440000"
 * }
 *
 * // Get all medications for a student (PHI Protected)
 * GET /api/v1/medications/student/{studentId}?isActive=true
 * Authorization: Bearer <token>
 * // Response: { success: true, data: { medications: [...], pagination: {...} } }
 *
 * // Deactivate medication with audit trail
 * POST /api/v1/medications/{id}/deactivate
 * Authorization: Bearer <nurse-token>
 * {
 *   "reason": "Treatment completed successfully",
 *   "deactivationType": "COMPLETED"
 * }
 *
 * // Update medication dosage
 * PUT /api/v1/medications/{id}
 * Authorization: Bearer <nurse-token>
 * {
 *   "dosage": "400mg",
 *   "frequency": "Every 8 hours as needed",
 *   "instructions": "Take with food and full glass of water"
 * }
 * ```
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
  method: 'POST',
  path: '/api/v1/medications/{id}/deactivate',
  handler: asyncHandler(MedicationsController.deactivate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Deactivate a medication (soft delete)',
    notes: '**PHI Protected Endpoint** - Deactivates a medication. Requires detailed reason and deactivation type for audit trail. Does not delete historical records. HIPAA Compliance: All deactivations are logged. Sets isActive = false, deletedAt = NOW(), deletedBy = current user.',
    validate: {
      params: medicationIdParamSchema,
      payload: deactivateMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': {
            description: 'Medication deactivated successfully - Historical record preserved (no content)',
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

const activateMedicationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications/{id}/activate',
  handler: asyncHandler(MedicationsController.activate),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Healthcare', 'v1', 'Legacy-Schema'],
    description: 'Activate a medication (restore from soft delete)',
    notes: '**PHI Protected Endpoint** - Reactivates a previously deactivated medication. Sets isActive = true, clears deletedAt and deletedBy. Requires NURSE or ADMIN role. HIPAA Compliance: All activations are logged.',
    validate: {
      params: medicationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Medication activated successfully',
            schema: MedicationResponseSchema
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
            description: 'Medication not found - Cannot activate non-existent medication',
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
 * Medication management route collection for legacy schema.
 *
 * Complete set of 7 routes for medication CRUD operations and student medication
 * tracking using the legacy single-table schema. All routes are PHI-protected and
 * require JWT authentication with HIPAA-compliant audit logging.
 *
 * **Route Categories:**
 * - Medication CRUD: List, create, get, update (4 routes)
 * - Lifecycle Management: Activate, deactivate (2 routes)
 * - Student Tracking: Get medications by student (1 route)
 *
 * **Permission Model:**
 * - NURSE/ADMIN: Full access to create, update, activate, deactivate
 * - All authenticated users: Can view medications (with scope restrictions)
 * - Student-specific queries: Restricted by student assignment
 *
 * **Key Features:**
 * - Soft deletion with audit trail (deactivate/activate)
 * - Pagination support on list and student queries
 * - Search and filter by medication name, student, active status
 * - Complete Swagger/OpenAPI documentation for all endpoints
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // Import and register routes in Hapi server
 * import { medicationsRoutes } from './routes/medications.routes';
 * server.route(medicationsRoutes);
 * ```
 */
export const medicationsRoutes: ServerRoute[] = [
  // Medication CRUD (7 routes) - Works with legacy schema
  listMedicationsRoute,
  createMedicationRoute,
  getMedicationByIdRoute,
  updateMedicationRoute,
  deactivateMedicationRoute,
  activateMedicationRoute,
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
