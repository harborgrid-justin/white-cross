/**
 * Medications Routes - Legacy Schema
 * HTTP endpoints for medication management using the legacy database schema
 * All routes prefixed with /api/v1/medications
 *
 * ⚠️ IMPORTANT: This file has been updated to work with the LEGACY database schema
 * Database table: medications (single table with medicationName, dosage, frequency, route, prescribedBy)
 * Migration: 20251011221125-create-complete-healthcare-schema.js
 *
 * Many routes from the NEW schema have been disabled because they require tables
 * that don't exist in the legacy schema (medication_inventory, medication_logs,
 * student_medications, adverse_reactions, etc.)
 */

import { ServerRoute } from '@hapi/hapi';
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
    notes: 'Returns a paginated list of medications in the system. Supports search functionality. **PHI Protected Endpoint** - Access is audited.',
    validate: {
      query: listMedicationsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medications retrieved successfully with pagination' },
          '401': { description: 'Authentication required' },
          '500': { description: 'Internal server error' }
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
    notes: 'Creates a medication record in the legacy medications table. **PHI Protected Endpoint**. Fields: medicationName, dosage, frequency, route, prescribedBy, startDate, endDate, instructions, sideEffects, isActive, studentId. Requires NURSE or ADMIN role. This uses the legacy single-table schema.',
    validate: {
      payload: createMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Medication created successfully' },
          '400': { description: 'Validation error - Invalid medication data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' }
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
    notes: '**PHI Protected Endpoint** - Updates a medication record. At least one field must be provided. Requires NURSE or ADMIN role.',
    validate: {
      params: medicationIdParamSchema,
      payload: updateMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication updated successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '404': { description: 'Medication not found' }
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
    notes: '**PHI Protected Endpoint** - Deactivates a medication. Requires detailed reason and deactivation type for audit trail. Does not delete historical records.',
    validate: {
      params: medicationIdParamSchema,
      payload: deactivateMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication deactivated successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '404': { description: 'Medication not found' }
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
    notes: '**PHI Protected Endpoint** - Returns a single medication record by ID.',
    validate: {
      params: medicationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Medication not found' }
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
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns all medication records for a specific student.',
    validate: {
      params: studentIdParamSchema,
      query: listMedicationsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medications retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
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
