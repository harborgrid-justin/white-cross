/**
 * WC-RTE-ADM-026 | System Administration & Management API Routes
 * Purpose: Comprehensive administration API for system settings, user management, district/school management, configuration, backups, performance monitoring, licensing, training modules, and audit logging
 * Upstream: ../services/administration, ../middleware/auth, express validation | Dependencies: express, express-validator, auth middleware
 * Downstream: Admin dashboard, system configuration UI, training portal, audit interface | Called by: Admin management components, monitoring systems
 * Related: User management routes, access control, audit services, backup systems
 * Exports: Express router (40+ endpoints) | Key Services: System administration, organizational management, configuration, monitoring, training
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Admin/District Admin privileges required for most operations
 * Critical Path: Auth validation → Admin permission check → Administration service operations → Audit logging → Response
 * LLM Context: Enterprise administration system for healthcare management platform with multi-tenant district/school hierarchy, comprehensive system configuration, backup management, performance monitoring, license management, training modules, and detailed audit logging for compliance
 */

import { Router, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { handleValidationErrors, createValidationChain } from '../shared';
import { AdministrationService } from '../services/administration';
import { auth, ExpressAuthRequest as AuthRequest } from '../middleware/auth';

// Admin middleware
const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user?.role || '')) {
    res.status(403).json({
      success: false,
      error: { message: 'Access denied. Admin privileges required.' }
    });
    return;
  }
  next();
};

const router = Router();

// ==================== System Settings Routes ====================

// Get system settings
router.get('/settings', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const settings = await AdministrationService.getSystemSettings();

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update system settings
router.put('/settings', [
  auth,
  isAdmin,
  body('settings').isArray().notEmpty()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const settings = await AdministrationService.updateSystemSettings(req.body.settings);

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== User Management Routes ====================

// Get all users
router.get('/users', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString(),
  query('role').optional().isString(),
  query('isActive').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      search: req.query.search as string,
      role: req.query.role as string,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
    };

    const result = await AdministrationService.getUsers(filters);

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

// Create user
router.post('/users', [
  auth,
  isAdmin,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await AdministrationService.createUser(req.body);

    // Don't send password in response
    const { password, ...userWithoutPassword } = user as any;

    res.status(201).json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    res.status(400).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Update user
router.put('/users/:id', [
  auth,
  isAdmin,
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('role').optional().isIn(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER']),
  body('isActive').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await AdministrationService.updateUser(req.params.id, req.body);

    // Don't send password in response
    const { password, ...userWithoutPassword } = user as any;

    res.json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    if (errorMessage.includes('already in use')) {
      return res.status(409).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    res.status(400).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Delete user (deactivate)
router.delete('/users/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await AdministrationService.deleteUser(req.params.id);

    res.json({
      success: true,
      data: { message: 'User deactivated successfully' }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: errorMessage }
      });
    }
    res.status(400).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// ==================== District Routes ====================

// Get all districts
router.get('/districts', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AdministrationService.getDistricts(page, limit);

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

// Get district by ID
router.get('/districts/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const district = await AdministrationService.getDistrictById(req.params.id);

    res.json({
      success: true,
      data: { district }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(errorMessage === 'District not found' ? 404 : 500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Create district
router.post('/districts', [
  auth,
  isAdmin,
  body('name').notEmpty().trim(),
  body('code').notEmpty().trim()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const district = await AdministrationService.createDistrict(req.body);

    res.status(201).json({
      success: true,
      data: { district }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update district
router.put('/districts/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const district = await AdministrationService.updateDistrict(req.params.id, req.body);

    res.json({
      success: true,
      data: { district }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete district
router.delete('/districts/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await AdministrationService.deleteDistrict(req.params.id);

    res.json({
      success: true,
      data: { message: 'District deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== School Routes ====================

// Get all schools
router.get('/schools', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('districtId').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const districtId = req.query.districtId as string;

    const result = await AdministrationService.getSchools(page, limit, districtId);

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

// Get school by ID
router.get('/schools/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const school = await AdministrationService.getSchoolById(req.params.id);

    res.json({
      success: true,
      data: { school }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(errorMessage === 'School not found' ? 404 : 500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Create school
router.post('/schools', [
  auth,
  isAdmin,
  body('name').notEmpty().trim(),
  body('code').notEmpty().trim(),
  body('districtId').notEmpty()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const school = await AdministrationService.createSchool(req.body);

    res.status(201).json({
      success: true,
      data: { school }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update school
router.put('/schools/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const school = await AdministrationService.updateSchool(req.params.id, req.body);

    res.json({
      success: true,
      data: { school }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete school
router.delete('/schools/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await AdministrationService.deleteSchool(req.params.id);

    res.json({
      success: true,
      data: { message: 'School deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== System Configuration Routes ====================

// Get all configurations
router.get('/configurations', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string;
    const configs = await AdministrationService.getAllConfigurations(category);

    res.json({
      success: true,
      data: { configurations: configs }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get configuration by key
router.get('/configurations/:key', auth, async (req: AuthRequest, res: Response) => {
  try {
    const config = await AdministrationService.getConfiguration(req.params.key);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: { message: 'Configuration not found' }
      });
    }

    // Check if user can view this config
    if (!config.isPublic && !['ADMIN', 'DISTRICT_ADMIN'].includes(req.user?.role || '')) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    res.json({
      success: true,
      data: { config }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Set configuration
router.post('/configurations', [
  auth,
  isAdmin,
  body('key').notEmpty(),
  body('value').notEmpty(),
  body('category').isIn(['GENERAL', 'SECURITY', 'NOTIFICATION', 'INTEGRATION', 'BACKUP', 'PERFORMANCE'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const config = await AdministrationService.setConfiguration(req.body);

    res.json({
      success: true,
      data: { config }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete configuration
router.delete('/configurations/:key', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await AdministrationService.deleteConfiguration(req.params.key);

    res.json({
      success: true,
      data: { message: 'Configuration deleted successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== Backup Routes ====================

// Create backup
router.post('/backups', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const backup = await AdministrationService.createBackup({
      type: 'MANUAL',
      triggeredBy: req.user!.userId
    });

    res.status(201).json({
      success: true,
      data: { backup }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get backup logs
router.get('/backups', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AdministrationService.getBackupLogs(page, limit);

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

// ==================== Performance Monitoring Routes ====================

// Get system health
router.get('/system-health', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const health = await AdministrationService.getSystemHealth();

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get metrics
router.get('/metrics', [
  auth,
  isAdmin,
  query('metricType').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req: AuthRequest, res: Response) => {
  try {
    const metricType = req.query.metricType as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const metrics = await AdministrationService.getMetrics(metricType, startDate, endDate);

    res.json({
      success: true,
      data: { metrics }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Record metric (internal use)
router.post('/metrics', [
  auth,
  isAdmin,
  body('metricType').notEmpty(),
  body('value').isFloat(),
  body('unit').optional().isString()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const metric = await AdministrationService.recordMetric(
      req.body.metricType,
      parseFloat(req.body.value),
      req.body.unit,
      req.body.context
    );

    res.status(201).json({
      success: true,
      data: { metric }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== License Routes ====================

// Get all licenses
router.get('/licenses', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AdministrationService.getLicenses(page, limit);

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

// Get license by ID
router.get('/licenses/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const license = await AdministrationService.getLicenseById(req.params.id);

    res.json({
      success: true,
      data: { license }
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(errorMessage === 'License not found' ? 404 : 500).json({
      success: false,
      error: { message: errorMessage }
    });
  }
});

// Create license
router.post('/licenses', [
  auth,
  isAdmin,
  body('licenseKey').notEmpty(),
  body('type').isIn(['TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  body('features').isArray()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const license = await AdministrationService.createLicense(req.body);

    res.status(201).json({
      success: true,
      data: { license }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update license
router.put('/licenses/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const license = await AdministrationService.updateLicense(req.params.id, req.body);

    res.json({
      success: true,
      data: { license }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Deactivate license
router.post('/licenses/:id/deactivate', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const license = await AdministrationService.deactivateLicense(req.params.id);

    res.json({
      success: true,
      data: { license }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

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
router.get('/audit-logs', [
  auth,
  isAdmin,
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('userId').optional().isString(),
  query('entityType').optional().isString(),
  query('entityId').optional().isString(),
  query('action').optional().isString(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req: AuthRequest, res: Response) => {
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
