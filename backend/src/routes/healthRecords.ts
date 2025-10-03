import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { HealthRecordService } from '../services/healthRecordService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// Log access to student records
router.post('/audit/access', [
  auth,
  body('action').isIn(['VIEW_STUDENT_RECORD', 'EDIT_STUDENT_RECORD', 'DELETE_STUDENT_RECORD']),
  body('studentId').notEmpty(),
  body('resourceId').optional(),
  body('details').optional()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const auditLog = {
      userId: req.user?.id,
      action: req.body.action,
      resource: 'STUDENT_HEALTH_RECORD',
      resourceId: req.body.resourceId || req.body.studentId,
      details: req.body.details || {},
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // In a real implementation, this would save to an audit log table
    console.log('Audit Log:', auditLog);

    res.json({
      success: true,
      data: { logged: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get health records for a student
router.get('/student/:studentId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { studentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.dateFrom) filters.dateFrom = new Date(req.query.dateFrom as string);
    if (req.query.dateTo) filters.dateTo = new Date(req.query.dateTo as string);
    if (req.query.provider) filters.provider = req.query.provider;

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

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

// Create new health record
router.post('/', [
  auth,
  body('studentId').notEmpty(),
  body('type').isIn(['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING']),
  body('date').isISO8601(),
  body('description').notEmpty().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const healthRecord = await HealthRecordService.createHealthRecord({
      ...req.body,
      date: new Date(req.body.date)
    });

    res.status(201).json({
      success: true,
      data: { healthRecord }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update health record
router.put('/:id', [
  auth,
  body('type').optional().isIn(['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING']),
  body('date').optional().isISO8601(),
  body('description').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const healthRecord = await HealthRecordService.updateHealthRecord(id, updateData);

    res.json({
      success: true,
      data: { healthRecord }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get student allergies
router.get('/allergies/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    res.json({
      success: true,
      data: { allergies }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Add allergy to student
router.post('/allergies', [
  auth,
  body('studentId').notEmpty(),
  body('allergen').notEmpty().trim(),
  body('severity').isIn(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  body('verified').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const allergy = await HealthRecordService.addAllergy(req.body);

    res.status(201).json({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update allergy
router.put('/allergies/:id', [
  auth,
  body('allergen').optional().trim(),
  body('severity').optional().isIn(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  body('verified').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const allergy = await HealthRecordService.updateAllergy(id, req.body);

    res.json({
      success: true,
      data: { allergy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete allergy
router.delete('/allergies/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HealthRecordService.deleteAllergy(id);

    res.json({
      success: true,
      message: 'Allergy deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get vaccination records
router.get('/vaccinations/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const vaccinations = await HealthRecordService.getVaccinationRecords(studentId);

    res.json({
      success: true,
      data: { vaccinations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get growth chart data
router.get('/growth/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const growthData = await HealthRecordService.getGrowthChartData(studentId);

    res.json({
      success: true,
      data: { growthData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get recent vitals
router.get('/vitals/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const vitals = await HealthRecordService.getRecentVitals(studentId, limit);

    res.json({
      success: true,
      data: { vitals }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get health summary
router.get('/summary/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const summary = await HealthRecordService.getHealthSummary(studentId);

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Search health records
router.get('/search', auth, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const type = req.query.type as any;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search query is required' }
      });
    }

    const result = await HealthRecordService.searchHealthRecords(query, type, page, limit);

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

// Get student chronic conditions
router.get('/chronic-conditions/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    res.json({
      success: true,
      data: { conditions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Add chronic condition to student
router.post('/chronic-conditions', [
  auth,
  body('studentId').notEmpty(),
  body('condition').notEmpty().trim(),
  body('diagnosedDate').isISO8601(),
  body('status').optional().trim(),
  body('severity').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const condition = await HealthRecordService.addChronicCondition({
      ...req.body,
      diagnosedDate: new Date(req.body.diagnosedDate),
      lastReviewDate: req.body.lastReviewDate ? new Date(req.body.lastReviewDate) : undefined,
      nextReviewDate: req.body.nextReviewDate ? new Date(req.body.nextReviewDate) : undefined
    });

    res.status(201).json({
      success: true,
      data: { condition }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update chronic condition
router.put('/chronic-conditions/:id', [
  auth,
  body('condition').optional().trim(),
  body('diagnosedDate').optional().isISO8601(),
  body('status').optional().trim(),
  body('severity').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData: any = { ...req.body };
    
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

    res.json({
      success: true,
      data: { condition }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete chronic condition
router.delete('/chronic-conditions/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HealthRecordService.deleteChronicCondition(id);

    res.json({
      success: true,
      message: 'Chronic condition deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Export health history
router.get('/export/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const exportData = await HealthRecordService.exportHealthHistory(studentId);

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Import health records
router.post('/import/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const importData = req.body;

    if (!importData || typeof importData !== 'object') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid import data' }
      });
    }

    const results = await HealthRecordService.importHealthRecords(studentId, importData);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Bulk delete health records
router.post('/bulk-delete', [
  auth,
  body('recordIds').isArray().notEmpty()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check user permissions - only admin and nurse roles can bulk delete
    if (!req.user || !['ADMIN', 'NURSE'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    const { recordIds } = req.body;
    const results = await HealthRecordService.bulkDeleteHealthRecords(recordIds);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Log security events
router.post('/security/log', [
  auth,
  body('event').notEmpty(),
  body('resourceType').notEmpty(),
  body('studentId').optional(),
  body('details').optional()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const securityEvent = {
      userId: req.user?.id,
      userRole: req.user?.role,
      event: req.body.event,
      resourceType: req.body.resourceType,
      studentId: req.body.studentId,
      details: req.body.details || {},
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // In a real implementation, this would save to a security log table
    console.log('Security Event:', securityEvent);

    res.json({
      success: true,
      data: { logged: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;