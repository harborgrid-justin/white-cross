import { ServerRoute } from '@hapi/hapi';
import { HealthRecordService } from '../services/healthRecordService';
import Joi from 'joi';

// Get health records for a student
const getStudentHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.type) filters.type = request.query.type;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);
    if (request.query.provider) filters.provider = request.query.provider;

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

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

// Create new health record
const createHealthRecordHandler = async (request: any, h: any) => {
  try {
    const healthRecord = await HealthRecordService.createHealthRecord({
      ...request.payload,
      date: new Date(request.payload.date)
    });

    return h.response({
      success: true,
      data: { healthRecord }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update health record
const updateHealthRecordHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.payload };

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const healthRecord = await HealthRecordService.updateHealthRecord(id, updateData);

    return h.response({
      success: true,
      data: { healthRecord }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get student allergies
const getStudentAllergiesHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return h.response({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Add allergy to student
const addAllergyHandler = async (request: any, h: any) => {
  try {
    const allergy = await HealthRecordService.addAllergy(request.payload);

    return h.response({
      success: true,
      data: { allergy }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update allergy
const updateAllergyHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const allergy = await HealthRecordService.updateAllergy(id, request.payload);

    return h.response({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete allergy
const deleteAllergyHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteAllergy(id);

    return h.response({
      success: true,
      message: 'Allergy deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get vaccination records
const getVaccinationRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getVaccinationRecords(studentId);

    return h.response({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get growth chart data
const getGrowthChartDataHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const growthData = await HealthRecordService.getGrowthChartData(studentId);

    return h.response({
      success: true,
      data: { growthData }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get recent vitals
const getRecentVitalsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const limit = parseInt(request.query.limit) || 10;
    const vitals = await HealthRecordService.getRecentVitals(studentId, limit);

    return h.response({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get health summary
const getHealthSummaryHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getHealthSummary(studentId);

    return h.response({
      success: true,
      data: summary
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Search health records
const searchHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const query = request.query.q;
    const type = request.query.type;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    if (!query) {
      return h.response({
        success: false,
        error: { message: 'Search query is required' }
      }).code(400);
    }

    const result = await HealthRecordService.searchHealthRecords(query, type, page, limit);

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

// Get student chronic conditions
const getStudentChronicConditionsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return h.response({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Add chronic condition to student
const addChronicConditionHandler = async (request: any, h: any) => {
  try {
    const condition = await HealthRecordService.addChronicCondition({
      ...request.payload,
      diagnosedDate: new Date(request.payload.diagnosedDate),
      lastReviewDate: request.payload.lastReviewDate ? new Date(request.payload.lastReviewDate) : undefined,
      nextReviewDate: request.payload.nextReviewDate ? new Date(request.payload.nextReviewDate) : undefined
    });

    return h.response({
      success: true,
      data: { condition }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update chronic condition
const updateChronicConditionHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData: any = { ...request.payload };

    if (updateData.diagnosedDate) {
      updateData.diagnosedDate = new Date(updateData.diagnosedDate);
    }
    if (updateData.lastReviewDate) {
      updateData.lastReviewDate = new Date(updateData.lastReviewDate);
    }
    if (updateData.nextReviewDate) {
      updateData.nextReviewDate = new Date(updateData.nextReviewDate);
    }

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return h.response({
      success: true,
      data: { condition }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete chronic condition
const deleteChronicConditionHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await HealthRecordService.deleteChronicCondition(id);

    return h.response({
      success: true,
      message: 'Chronic condition deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Export health history
const exportHealthHistoryHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const exportData = await HealthRecordService.exportHealthHistory(studentId);

    return h.response({
      success: true,
      data: exportData
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Import health records
const importHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const importData = request.payload;

    if (!importData || typeof importData !== 'object') {
      return h.response({
        success: false,
        error: { message: 'Invalid import data' }
      }).code(400);
    }

    const results = await HealthRecordService.importHealthRecords(studentId, importData);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Bulk delete health records
const bulkDeleteHealthRecordsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check user permissions - only admin and nurse roles can bulk delete
    if (!user || !['ADMIN', 'NURSE'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Insufficient permissions'
      }).code(403);
    }

    const { recordIds } = request.payload;
    const results = await HealthRecordService.bulkDeleteHealthRecords(recordIds);

    return h.response({
      success: true,
      data: results
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Log security events
const logSecurityEventHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    const securityEvent = {
      userId: user?.userId,
      userRole: user?.role,
      event: request.payload.event,
      resourceType: request.payload.resourceType,
      studentId: request.payload.studentId,
      details: request.payload.details || {},
      timestamp: new Date(),
      ipAddress: request.info.remoteAddress,
      userAgent: request.headers['user-agent']
    };

    // In a real implementation, this would save to a security log table
    console.log('Security Event:', securityEvent);

    return h.response({
      success: true,
      data: { logged: true }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};





// Admin settings endpoint
const getAdminSettingsHandler2 = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check user permissions - only admin can access settings
    if (!user || user.role !== 'ADMIN') {
      return h.response({
        success: false,
        error: 'Insufficient permissions'
      }).code(403);
    }

    // Return admin settings
    return h.response({
      success: true,
      data: {
        settings: {
          hipaaCompliance: true,
          auditLogging: true,
          dataRetention: '7 years'
        }
      }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define health record routes for Hapi
export const healthRecordRoutes: ServerRoute[] = [

  {
    method: 'GET',
    path: '/api/health-records/student/{studentId}',
    handler: getStudentHealthRecordsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          type: Joi.string().optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional(),
          provider: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records',
    handler: createHealthRecordHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          type: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').required(),
          date: Joi.date().iso().required(),
          description: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/{id}',
    handler: updateHealthRecordHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          type: Joi.string().valid('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING').optional(),
          date: Joi.date().iso().optional(),
          description: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/allergies/{studentId}',
    handler: getStudentAllergiesHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/allergies',
    handler: addAllergyHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          allergen: Joi.string().trim().required(),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').required(),
          verified: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/allergies/{id}',
    handler: updateAllergyHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          allergen: Joi.string().trim().optional(),
          severity: Joi.string().valid('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING').optional(),
          verified: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/allergies/{id}',
    handler: deleteAllergyHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vaccinations/{studentId}',
    handler: getVaccinationRecordsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/growth/{studentId}',
    handler: getGrowthChartDataHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/vitals/{studentId}',
    handler: getRecentVitalsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(10)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/summary/{studentId}',
    handler: getHealthSummaryHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/search',
    handler: searchHealthRecordsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          q: Joi.string().required(),
          type: Joi.string().optional(),
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/chronic-conditions/{studentId}',
    handler: getStudentChronicConditionsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/chronic-conditions',
    handler: addChronicConditionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          condition: Joi.string().trim().required(),
          diagnosedDate: Joi.date().iso().required(),
          status: Joi.string().trim().optional(),
          severity: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: updateChronicConditionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          condition: Joi.string().trim().optional(),
          diagnosedDate: Joi.date().iso().optional(),
          status: Joi.string().trim().optional(),
          severity: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/health-records/chronic-conditions/{id}',
    handler: deleteChronicConditionHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/export/{studentId}',
    handler: exportHealthHistoryHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/import/{studentId}',
    handler: importHealthRecordsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/bulk-delete',
    handler: bulkDeleteHealthRecordsHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          recordIds: Joi.array().items(Joi.string()).min(1).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/health-records/security/log',
    handler: logSecurityEventHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          event: Joi.string().required(),
          resourceType: Joi.string().required(),
          studentId: Joi.string().optional(),
          details: Joi.object().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/health-records/admin/settings',
    handler: getAdminSettingsHandler2,
    options: {
      auth: 'jwt'
    }
  }
];
