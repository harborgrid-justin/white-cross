import { ServerRoute } from '@hapi/hapi';
import { MedicationService } from '../services/medicationService';
import Joi from 'joi';

// Get all medications
const getMedicationsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const search = request.query.search;

    const result = await MedicationService.getMedications(page, limit, search);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new medication
const createMedicationHandler = async (request: any, h: any) => {
  try {
    const medication = await MedicationService.createMedication(request.payload);

    return h.response({
      success: true,
      data: { medication }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Assign medication to student
const assignMedicationHandler = async (request: any, h: any) => {
  try {
    const studentMedication = await MedicationService.assignMedicationToStudent({
      ...request.payload,
      startDate: new Date(request.payload.startDate),
      endDate: request.payload.endDate ? new Date(request.payload.endDate) : undefined
    });

    return h.response({
      success: true,
      data: { studentMedication }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Log medication administration
const logAdministrationHandler = async (request: any, h: any) => {
  try {
    const nurseId = request.auth.credentials?.userId;

    const medicationLog = await MedicationService.logMedicationAdministration({
      ...request.payload,
      nurseId,
      timeGiven: new Date(request.payload.timeGiven)
    });

    return h.response({
      success: true,
      data: { medicationLog }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get medication logs for a student
const getStudentMedicationLogsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await MedicationService.getStudentMedicationLogs(studentId, page, limit);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get inventory with alerts
const getInventoryHandler = async (request: any, h: any) => {
  try {
    const result = await MedicationService.getInventoryWithAlerts();

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Add to inventory
const addToInventoryHandler = async (request: any, h: any) => {
  try {
    const inventory = await MedicationService.addToInventory({
      ...request.payload,
      expirationDate: new Date(request.payload.expirationDate),
      costPerUnit: request.payload.costPerUnit ? parseFloat(request.payload.costPerUnit) : undefined
    });

    return h.response({
      success: true,
      data: { inventory }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get medication schedule
const getMedicationScheduleHandler = async (request: any, h: any) => {
  try {
    const startDate = request.query.startDate ? new Date(request.query.startDate) : new Date();
    const endDate = request.query.endDate ? new Date(request.query.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const nurseId = request.query.nurseId;

    const schedule = await MedicationService.getMedicationSchedule(startDate, endDate, nurseId);

    return h.response({
      success: true,
      data: { schedule }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update inventory quantity
const updateInventoryQuantityHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { quantity, reason } = request.payload;

    const inventory = await MedicationService.updateInventoryQuantity(id, quantity, reason);

    return h.response({
      success: true,
      data: { inventory }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Deactivate student medication
const deactivateStudentMedicationHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { reason } = request.payload;

    const studentMedication = await MedicationService.deactivateStudentMedication(id, reason);

    return h.response({
      success: true,
      data: { studentMedication }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get medication reminders for a date
const getMedicationRemindersHandler = async (request: any, h: any) => {
  try {
    const date = request.query.date ? new Date(request.query.date) : new Date();

    const reminders = await MedicationService.getMedicationReminders(date);

    return h.response({
      success: true,
      data: { reminders }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Report adverse reaction
const reportAdverseReactionHandler = async (request: any, h: any) => {
  try {
    const reportedBy = request.auth.credentials?.userId;

    const report = await MedicationService.reportAdverseReaction({
      ...request.payload,
      reportedBy,
      reportedAt: new Date(request.payload.reportedAt)
    });

    return h.response({
      success: true,
      data: { report }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get adverse reactions
const getAdverseReactionsHandler = async (request: any, h: any) => {
  try {
    const medicationId = request.query.medicationId;
    const studentId = request.query.studentId;

    const reactions = await MedicationService.getAdverseReactions(medicationId, studentId);

    return h.response({
      success: true,
      data: { reactions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define medication routes for Hapi
export const medicationRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/medications',
    handler: getMedicationsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          search: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications',
    handler: createMedicationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required(),
          dosageForm: Joi.string().trim().required(),
          strength: Joi.string().trim().required(),
          isControlled: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/assign',
    handler: assignMedicationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          medicationId: Joi.string().required(),
          dosage: Joi.string().trim().required(),
          frequency: Joi.string().trim().required(),
          route: Joi.string().trim().required(),
          startDate: Joi.date().iso().required(),
          endDate: Joi.date().iso().optional(),
          prescribedBy: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/administration',
    handler: logAdministrationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentMedicationId: Joi.string().required(),
          dosageGiven: Joi.string().trim().required(),
          timeGiven: Joi.date().iso().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/logs/{studentId}',
    handler: getStudentMedicationLogsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/inventory',
    handler: getInventoryHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/medications/inventory',
    handler: addToInventoryHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          medicationId: Joi.string().required(),
          batchNumber: Joi.string().trim().required(),
          expirationDate: Joi.date().iso().required(),
          quantity: Joi.number().integer().min(1).required(),
          reorderLevel: Joi.number().integer().min(0).optional(),
          costPerUnit: Joi.number().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/schedule',
    handler: getMedicationScheduleHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          startDate: Joi.date().iso().optional(),
          endDate: Joi.date().iso().optional(),
          nurseId: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/medications/inventory/{id}',
    handler: updateInventoryQuantityHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          quantity: Joi.number().integer().min(0).required(),
          reason: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/medications/student-medication/{id}/deactivate',
    handler: deactivateStudentMedicationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          reason: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/reminders',
    handler: getMedicationRemindersHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          date: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/adverse-reaction',
    handler: reportAdverseReactionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentMedicationId: Joi.string().required(),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').required(),
          reaction: Joi.string().trim().required(),
          actionTaken: Joi.string().trim().required(),
          reportedAt: Joi.date().iso().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/adverse-reactions',
    handler: getAdverseReactionsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          medicationId: Joi.string().optional(),
          studentId: Joi.string().optional()
        })
      }
    }
  }
];
