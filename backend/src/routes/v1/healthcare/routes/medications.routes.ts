/**
 * Medications Routes
 * HTTP endpoints for medication management, administration logging, and inventory
 * All routes prefixed with /api/v1/medications
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { MedicationsController } from '../controllers/medications.controller';
import {
  createMedicationSchema,
  assignMedicationToStudentSchema,
  logMedicationAdministrationSchema,
  addToInventorySchema,
  updateInventoryQuantitySchema,
  reportAdverseReactionSchema,
  deactivateStudentMedicationSchema,
  listMedicationsQuerySchema,
  studentLogsQuerySchema,
  scheduleQuerySchema,
  remindersQuerySchema,
  adverseReactionsQuerySchema,
  studentIdParamSchema,
  inventoryIdParamSchema,
  studentMedicationIdParamSchema
} from '../validators/medications.validators';

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
    tags: ['api', 'Medications', 'Healthcare', 'v1'],
    description: 'Create a new medication',
    notes: 'Adds a new medication to the system formulary. Requires NURSE or ADMIN role. **PHI Protected Endpoint**. Includes NDC validation, DEA schedule for controlled substances, and witness requirements.',
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

/**
 * PRESCRIPTION (STUDENT MEDICATION) ROUTES
 */

const assignMedicationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications/assign',
  handler: asyncHandler(MedicationsController.assignToStudent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Prescriptions', 'Healthcare', 'v1'],
    description: 'Assign medication to a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Assigns a prescribed medication to a student. Implements Five Rights validation (Right Patient, Medication, Dose, Route, Time). Includes dosage format validation, frequency validation, and prescription number tracking. All assignments are audited.',
    validate: {
      payload: assignMedicationToStudentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Medication assigned to student successfully' },
          '400': { description: 'Validation error or student/medication not found' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' }
        }
      }
    }
  }
};

const deactivateStudentMedicationRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/medications/student-medication/{id}/deactivate',
  handler: asyncHandler(MedicationsController.deactivateStudentMedication),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Prescriptions', 'Healthcare', 'v1'],
    description: 'Deactivate student medication assignment',
    notes: '**PHI Protected Endpoint** - Discontinues a medication for a student. Requires detailed reason and deactivation type for audit trail. Does not delete historical records - maintains complete medication history for safety.',
    validate: {
      params: studentMedicationIdParamSchema,
      payload: deactivateStudentMedicationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student medication deactivated successfully' },
          '400': { description: 'Validation error or medication assignment not found' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' },
          '404': { description: 'Student medication assignment not found' }
        }
      }
    }
  }
};

/**
 * ADMINISTRATION LOGGING ROUTES
 */

const logAdministrationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications/administration',
  handler: asyncHandler(MedicationsController.logAdministration),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Administration', 'Healthcare', 'v1'],
    description: 'Log medication administration',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Records that a medication was administered to a student. Implements Five Rights validation including patient verification and allergy checking. Supports witness requirement for controlled substances (DEA Schedule I-II). Creates permanent audit trail for compliance. Requires NURSE role.',
    validate: {
      payload: logMedicationAdministrationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Medication administration logged successfully' },
          '400': { description: 'Validation error or Five Rights check failed' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' }
        }
      }
    }
  }
};

const getStudentLogsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/logs/{studentId}',
  handler: asyncHandler(MedicationsController.getStudentLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Administration', 'Healthcare', 'v1'],
    description: 'Get medication administration logs for a student',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns complete medication administration history for a student. Includes all doses given, who administered them, witnesses for controlled substances, and any adverse reactions. All access is audited.',
    validate: {
      params: studentIdParamSchema,
      query: studentLogsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Medication logs retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Can only view own patient logs unless admin' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * INVENTORY MANAGEMENT ROUTES
 */

const getInventoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/inventory',
  handler: asyncHandler(MedicationsController.getInventory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Inventory', 'Healthcare', 'v1'],
    description: 'Get medication inventory with low stock alerts',
    notes: 'Returns current medication inventory levels with alerts for low stock, expiring medications (within 30 days), and reorder recommendations. Includes batch tracking and cost information.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Inventory retrieved successfully with alerts' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const addToInventoryRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications/inventory',
  handler: asyncHandler(MedicationsController.addToInventory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Inventory', 'Healthcare', 'v1'],
    description: 'Add medication to inventory',
    notes: 'Adds new medication stock to inventory. Validates batch number format and prevents addition of expired medications. Tracks batch number, expiration date, quantity, and cost per unit. Requires NURSE or ADMIN role.',
    validate: {
      payload: addToInventorySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Medication added to inventory successfully' },
          '400': { description: 'Validation error - Expired medication or invalid data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' }
        }
      }
    }
  }
};

const updateInventoryQuantityRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/medications/inventory/{id}',
  handler: asyncHandler(MedicationsController.updateInventoryQuantity),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Inventory', 'Healthcare', 'v1'],
    description: 'Update medication inventory quantity',
    notes: 'Adjusts inventory quantity for corrections, transfers, or disposal. Requires reason and adjustment type (correction, waste, transfer, expired) for complete audit trail. Prevents negative quantities.',
    validate: {
      params: inventoryIdParamSchema,
      payload: updateInventoryQuantitySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Inventory quantity updated successfully' },
          '400': { description: 'Validation error or would result in negative quantity' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' },
          '404': { description: 'Inventory item not found' }
        }
      }
    }
  }
};

/**
 * SCHEDULING & REMINDERS ROUTES
 */

const getScheduleRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/schedule',
  handler: asyncHandler(MedicationsController.getSchedule),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Scheduling', 'Healthcare', 'v1'],
    description: 'Get medication administration schedule',
    notes: '**PHI Protected Endpoint** - Returns scheduled medication administrations for a date range. Shows all students who need medications at specific times. Helps nurses plan their day and ensures no doses are missed. Default: today to 7 days ahead.',
    validate: {
      query: scheduleQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Schedule retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getRemindersRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/reminders',
  handler: asyncHandler(MedicationsController.getReminders),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Scheduling', 'Healthcare', 'v1'],
    description: 'Get medication reminders for a specific date',
    notes: '**PHI Protected Endpoint** - Returns list of students who need medication at specific times for the specified date. Groups by administration time for efficient workflow. Defaults to today.',
    validate: {
      query: remindersQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Reminders retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * ADVERSE REACTIONS ROUTES
 */

const reportAdverseReactionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/medications/adverse-reaction',
  handler: asyncHandler(MedicationsController.reportAdverseReaction),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Safety', 'Healthcare', 'v1'],
    description: 'Report an adverse medication reaction',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Documents adverse reactions to medications. Requires parent notification flag for moderate or higher severity (moderate, severe, life-threatening). Includes severity classification, symptoms description, and actions taken. Critical for student safety. All reports are reviewed by medical staff.',
    validate: {
      payload: reportAdverseReactionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Adverse reaction reported successfully' },
          '400': { description: 'Validation error' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE role' }
        }
      }
    }
  }
};

const getAdverseReactionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/adverse-reactions',
  handler: asyncHandler(MedicationsController.getAdverseReactions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Safety', 'Healthcare', 'v1'],
    description: 'Get adverse reaction reports',
    notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Retrieves adverse reaction history. Can filter by medication (to check safety profile) or by student (to check patient history). Used for drug safety monitoring and clinical decision making.',
    validate: {
      query: adverseReactionsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Adverse reactions retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * STATISTICS & UTILITIES ROUTES
 */

const getStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/stats',
  handler: asyncHandler(MedicationsController.getStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Statistics', 'Healthcare', 'v1'],
    description: 'Get medication statistics',
    notes: 'Returns medication statistics including total medications in formulary, active prescriptions, medications administered today, adverse reactions reported, and inventory alerts. **PHI Protected Endpoint**',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Statistics retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getAlertsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/alerts',
  handler: asyncHandler(MedicationsController.getAlerts),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Alerts', 'Healthcare', 'v1'],
    description: 'Get medication alerts',
    notes: 'Returns alerts for low stock (below reorder level), expiring medications (within 30 days), missed doses (scheduled but not administered), and controlled substance discrepancies. **PHI Protected Endpoint**',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Alerts retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getFormOptionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/medications/form-options',
  handler: asyncHandler(MedicationsController.getFormOptions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Medications', 'Utilities', 'Healthcare', 'v1'],
    description: 'Get medication form options',
    notes: 'Returns available options for medication forms: dosage forms (Tablet, Capsule, Liquid, etc.), medication categories, strength units (mg, mcg, ml, etc.), routes of administration (oral, topical, injection, etc.), and frequency patterns. Used to populate form dropdowns.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Form options retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const medicationsRoutes: ServerRoute[] = [
  // Medication CRUD (2 routes)
  listMedicationsRoute,
  createMedicationRoute,

  // Prescription management (2 routes)
  assignMedicationRoute,
  deactivateStudentMedicationRoute,

  // Administration logging (2 routes)
  logAdministrationRoute,
  getStudentLogsRoute,

  // Inventory management (3 routes)
  getInventoryRoute,
  addToInventoryRoute,
  updateInventoryQuantityRoute,

  // Scheduling & reminders (2 routes)
  getScheduleRoute,
  getRemindersRoute,

  // Adverse reactions (2 routes)
  reportAdverseReactionRoute,
  getAdverseReactionsRoute,

  // Statistics & utilities (3 routes)
  getStatisticsRoute,
  getAlertsRoute,
  getFormOptionsRoute
];
