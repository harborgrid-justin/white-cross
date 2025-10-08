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
      tags: ['api', 'Medications'],
      description: 'Get all medications with pagination',
      notes: 'Returns a paginated list of medications in the system. Supports search functionality. **PHI Protected Endpoint** - Access is audited.',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number for pagination'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Number of items per page (max 100)'),
          search: Joi.string().optional().description('Search term for medication name')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Medications retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications',
    handler: createMedicationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Create a new medication',
      notes: 'Adds a new medication to the system formulary. Requires NURSE or ADMIN role. **PHI Protected Endpoint**',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required().description('Medication name'),
          dosageForm: Joi.string().trim().required().description('Dosage form (e.g., tablet, liquid, injection)'),
          strength: Joi.string().trim().required().description('Medication strength (e.g., "500mg", "10ml")'),
          isControlled: Joi.boolean().optional().description('Whether this is a controlled substance requiring special handling')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Medication created successfully'
            },
            '400': {
              description: 'Invalid input data'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/assign',
    handler: assignMedicationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Assign medication to a student',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Assigns a prescribed medication to a student. Requires valid prescription. All assignments are audited.',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required().description('Student ID'),
          medicationId: Joi.string().required().description('Medication ID from formulary'),
          dosage: Joi.string().trim().required().description('Dosage to be administered (e.g., "500mg")'),
          frequency: Joi.string().trim().required().description('Administration frequency (e.g., "twice daily", "as needed")'),
          route: Joi.string().trim().required().description('Route of administration (e.g., "oral", "topical", "inhaled")'),
          startDate: Joi.date().iso().required().description('Date to begin medication (ISO 8601 format)'),
          endDate: Joi.date().iso().optional().description('Date to end medication (ISO 8601 format)'),
          prescribedBy: Joi.string().trim().required().description('Prescribing physician name')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Medication assigned successfully'
            },
            '400': {
              description: 'Invalid input data or student/medication not found'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/administration',
    handler: logAdministrationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Log medication administration',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Records that a medication was administered to a student. Creates permanent audit trail. Requires NURSE role.',
      validate: {
        payload: Joi.object({
          studentMedicationId: Joi.string().required().description('Student medication assignment ID'),
          dosageGiven: Joi.string().trim().required().description('Actual dosage administered'),
          timeGiven: Joi.date().iso().required().description('Timestamp when medication was administered (ISO 8601 format)')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Administration logged successfully'
            },
            '400': {
              description: 'Invalid input data'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/logs/{studentId}',
    handler: getStudentMedicationLogsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Get medication administration logs for a student',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Returns complete medication administration history for a student. All access is audited.',
      validate: {
        params: Joi.object({
          studentId: Joi.string().required().description('Student ID')
        }),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number for pagination'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Number of items per page (max 100)')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Medication logs retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/inventory',
    handler: getInventoryHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Get medication inventory with low stock alerts',
      notes: 'Returns current medication inventory levels with alerts for low stock, expiring medications, and reorder recommendations.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Inventory retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/inventory',
    handler: addToInventoryHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Add medication to inventory',
      notes: 'Adds new medication stock to inventory. Tracks batch number, expiration date, and cost. Requires NURSE or ADMIN role.',
      validate: {
        payload: Joi.object({
          medicationId: Joi.string().required().description('Medication ID'),
          batchNumber: Joi.string().trim().required().description('Batch/lot number from manufacturer'),
          expirationDate: Joi.date().iso().required().description('Expiration date (ISO 8601 format)'),
          quantity: Joi.number().integer().min(1).required().description('Quantity to add to inventory'),
          reorderLevel: Joi.number().integer().min(0).optional().description('Minimum quantity threshold for reorder alerts'),
          costPerUnit: Joi.number().optional().description('Cost per unit for budget tracking')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Inventory updated successfully'
            },
            '400': {
              description: 'Invalid input data'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/schedule',
    handler: getMedicationScheduleHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Get medication administration schedule',
      notes: '**PHI Protected Endpoint** - Returns scheduled medication administrations for a date range. Helps nurses plan their day.',
      validate: {
        query: Joi.object({
          startDate: Joi.date().iso().optional().description('Schedule start date (ISO 8601 format)'),
          endDate: Joi.date().iso().optional().description('Schedule end date (ISO 8601 format)'),
          nurseId: Joi.string().optional().description('Filter by specific nurse ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Schedule retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/medications/inventory/{id}',
    handler: updateInventoryQuantityHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Update medication inventory quantity',
      notes: 'Adjusts inventory quantity for corrections, transfers, or disposal. Creates audit trail for all changes.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Inventory item ID')
        }),
        payload: Joi.object({
          quantity: Joi.number().integer().min(0).required().description('New quantity'),
          reason: Joi.string().trim().optional().description('Reason for quantity adjustment')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Inventory updated successfully'
            },
            '400': {
              description: 'Invalid input data or inventory item not found'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/medications/student-medication/{id}/deactivate',
    handler: deactivateStudentMedicationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Deactivate student medication assignment',
      notes: '**PHI Protected Endpoint** - Discontinues a medication for a student. Does not delete historical records.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Student medication ID')
        }),
        payload: Joi.object({
          reason: Joi.string().trim().optional().description('Reason for discontinuation')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Medication deactivated successfully'
            },
            '400': {
              description: 'Failed to deactivate medication'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/reminders',
    handler: getMedicationRemindersHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Get medication reminders for a specific date',
      notes: '**PHI Protected Endpoint** - Returns list of students who need medication at specific times for the specified date.',
      validate: {
        query: Joi.object({
          date: Joi.date().iso().optional().description('Date for reminders (ISO 8601 format, defaults to today)')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Reminders retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/medications/adverse-reaction',
    handler: reportAdverseReactionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Report an adverse medication reaction',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Documents adverse reactions to medications. Critical for student safety. All reports are reviewed by medical staff.',
      validate: {
        payload: Joi.object({
          studentMedicationId: Joi.string().required().description('Student medication ID'),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').required().description('Severity level of the reaction'),
          reaction: Joi.string().trim().required().description('Description of the adverse reaction'),
          actionTaken: Joi.string().trim().required().description('Actions taken in response to the reaction'),
          reportedAt: Joi.date().iso().required().description('Timestamp of the reaction (ISO 8601 format)')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Adverse reaction reported successfully'
            },
            '400': {
              description: 'Invalid input data'
            },
            '401': {
              description: 'Authentication required'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/medications/adverse-reactions',
    handler: getAdverseReactionsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'Medications'],
      description: 'Get adverse reaction reports',
      notes: '**HIGHLY SENSITIVE PHI ENDPOINT** - Retrieves adverse reaction history. Can filter by medication or student.',
      validate: {
        query: Joi.object({
          medicationId: Joi.string().optional().description('Filter by medication ID'),
          studentId: Joi.string().optional().description('Filter by student ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Adverse reactions retrieved successfully'
            },
            '401': {
              description: 'Authentication required'
            },
            '500': {
              description: 'Internal server error'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
