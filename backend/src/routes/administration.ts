import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AdministrationService } from '../services/administrationService';
import { auth, AuthRequest } from '../middleware/auth';

// Admin middleware
const isAdmin = async (req: AuthRequest, res: Response, next: any) => {
  if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user?.role || '')) {
    return res.status(403).json({
      success: false,
      error: { message: 'Access denied. Admin privileges required.' }
    });
  }
  next();
};

const router = Router();

// ==================== UNUSED HAPI HANDLERS ====================
// The following handlers are Hapi-style but this file uses Express router
// They are kept for reference but should be converted or removed
// Disabling linting for this entire section as these are not currently used
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// ==================== District Routes ====================

// Get all districts
const getDistrictsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await AdministrationService.getDistricts(page, limit);

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

// Get district by ID
const getDistrictByIdHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const district = await AdministrationService.getDistrictById(request.params.id);

    return h.response({
      success: true,
      data: { district }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error instanceof Error && error.message === 'District not found' ? 404 : 500);
  }
};

// Create district
const createDistrictHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const district = await AdministrationService.createDistrict(request.payload);

    return h.response({
      success: true,
      data: { district }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update district
const updateDistrictHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const district = await AdministrationService.updateDistrict(request.params.id, request.payload);

    return h.response({
      success: true,
      data: { district }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Delete district
const deleteDistrictHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    await AdministrationService.deleteDistrict(request.params.id);

    return h.response({
      success: true,
      data: { message: 'District deleted successfully' }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==================== School Routes ====================

// Get all schools
const getSchoolsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const districtId = request.query.districtId;

    const result = await AdministrationService.getSchools(page, limit, districtId);

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

// Get school by ID
const getSchoolByIdHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const school = await AdministrationService.getSchoolById(request.params.id);

    return h.response({
      success: true,
      data: { school }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error instanceof Error && error.message === 'School not found' ? 404 : 500);
  }
};

// Create school
const createSchoolHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const school = await AdministrationService.createSchool(request.payload);

    return h.response({
      success: true,
      data: { school }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update school
const updateSchoolHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const school = await AdministrationService.updateSchool(request.params.id, request.payload);

    return h.response({
      success: true,
      data: { school }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Delete school
const deleteSchoolHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    await AdministrationService.deleteSchool(request.params.id);

    return h.response({
      success: true,
      data: { message: 'School deleted successfully' }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==================== System Configuration Routes ====================

// Get all configurations
const getAllConfigurationsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const category = request.query.category;
    const configs = await AdministrationService.getAllConfigurations(category);

    return h.response({
      success: true,
      data: { configs }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get configuration by key
const getConfigurationHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;
    const config = await AdministrationService.getConfiguration(request.params.key);

    if (!config) {
      return h.response({
        success: false,
        error: { message: 'Configuration not found' }
      }).code(404);
    }

    // Check if user can view this config
    if (!config.isPublic && !['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: { message: 'Access denied' }
      }).code(403);
    }

    return h.response({
      success: true,
      data: { config }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Set configuration
const setConfigurationHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const config = await AdministrationService.setConfiguration(request.payload);

    return h.response({
      success: true,
      data: { config }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Delete configuration
const deleteConfigurationHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    await AdministrationService.deleteConfiguration(request.params.key);

    return h.response({
      success: true,
      data: { message: 'Configuration deleted successfully' }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==================== Backup Routes ====================

// Create backup
const createBackupHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const backup = await AdministrationService.createBackup({
      type: 'MANUAL',
      triggeredBy: user.userId
    });

    return h.response({
      success: true,
      data: { backup }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get backup logs
const getBackupLogsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await AdministrationService.getBackupLogs(page, limit);

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

// ==================== Performance Monitoring Routes ====================

// Get system health
const getSystemHealthHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const health = await AdministrationService.getSystemHealth();

    return h.response({
      success: true,
      data: health
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get metrics
const getMetricsHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const metricType = request.query.metricType;
    const startDate = request.query.startDate ? new Date(request.query.startDate) : undefined;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : undefined;

    const metrics = await AdministrationService.getMetrics(metricType, startDate, endDate);

    return h.response({
      success: true,
      data: { metrics }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Record metric (internal use)
const recordMetricHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const metric = await AdministrationService.recordMetric(
      request.payload.metricType,
      parseFloat(request.payload.value),
      request.payload.unit,
      request.payload.context
    );

    return h.response({
      success: true,
      data: { metric }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// ==================== License Routes ====================

// Get all licenses
const getLicensesHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await AdministrationService.getLicenses(page, limit);

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

// Get license by ID
const getLicenseByIdHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const license = await AdministrationService.getLicenseById(request.params.id);

    return h.response({
      success: true,
      data: { license }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error instanceof Error && error.message === 'License not found' ? 404 : 500);
  }
};

// Create license
const createLicenseHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const license = await AdministrationService.createLicense(request.payload);

    return h.response({
      success: true,
      data: { license }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update license
const updateLicenseHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const license = await AdministrationService.updateLicense(request.params.id, request.payload);

    return h.response({
      success: true,
      data: { license }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Deactivate license
const deactivateLicenseHandler = async (request: any, h: any) => {
  try {
    const user = request.auth.credentials;

    // Check admin permissions
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(user.role)) {
      return h.response({
        success: false,
        error: 'Access denied. Admin privileges required.'
      }).code(403);
    }

    const license = await AdministrationService.deactivateLicense(request.params.id);

    return h.response({
      success: true,
      data: { license }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable no-unused-vars */
// ==================== END UNUSED HAPI HANDLERS ====================

// ==================== Training Module Routes ====================

// Get all training modules
router.get('/training', auth, async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const modules = await AdministrationService.getTrainingModules(category);

    res.json({
      success: true,
      data: { modules }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get training module by ID
router.get('/training/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const module = await AdministrationService.getTrainingModuleById(req.params.id);

    res.json({
      success: true,
      data: { module }
    });
  } catch (error) {
    res.status(error instanceof Error && error.message === 'Training module not found' ? 404 : 500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create training module
router.post('/training', [
  auth,
  isAdmin,
  body('title').notEmpty().trim(),
  body('content').notEmpty(),
  body('category').isIn(['HIPAA_COMPLIANCE', 'MEDICATION_MANAGEMENT', 'EMERGENCY_PROCEDURES', 'SYSTEM_TRAINING', 'SAFETY_PROTOCOLS', 'DATA_SECURITY'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const module = await AdministrationService.createTrainingModule(req.body);

    res.status(201).json({
      success: true,
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update training module
router.put('/training/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const module = await AdministrationService.updateTrainingModule(req.params.id, req.body);

    res.json({
      success: true,
      data: { module }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete training module
router.delete('/training/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await AdministrationService.deleteTrainingModule(req.params.id);

    res.json({
      success: true,
      data: { message: 'Training module deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Record training completion
router.post('/training/:id/complete', [
  auth,
  body('score').optional().isInt({ min: 0, max: 100 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const completion = await AdministrationService.recordTrainingCompletion(
      req.params.id,
      req.user!.userId,
      req.body.score
    );

    res.status(201).json({
      success: true,
      data: { completion }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get user training progress
router.get('/training-progress/:userId', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Users can only view their own progress unless they're admin
    if (req.params.userId !== req.user!.userId && 
        req.user?.role !== 'ADMIN' && 
        req.user?.role !== 'DISTRICT_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const progress = await AdministrationService.getUserTrainingProgress(req.params.userId);

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== Audit Log Routes ====================

// Get audit logs
router.get('/audit-logs', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const filters = {
      userId: req.query.userId as string,
      entityType: req.query.entityType as string,
      entityId: req.query.entityId as string,
      action: req.query.action as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined
    };

    const result = await AdministrationService.getAuditLogs(page, limit, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;
