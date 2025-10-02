import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { HealthRecordService } from '../services/healthRecordService';

const router = Router();

// Get health records for a student
router.get('/student/:studentId', auth, async (req: Request, res: Response) => {
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

export default router;