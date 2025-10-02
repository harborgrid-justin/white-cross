import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { MedicationService } from '../services/medicationService';

const router = Router();

// Get all medications
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await MedicationService.getMedications(page, limit, search);

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

// Create new medication
router.post('/', [
  auth,
  body('name').notEmpty().trim(),
  body('dosageForm').notEmpty().trim(),
  body('strength').notEmpty().trim(),
  body('isControlled').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const medication = await MedicationService.createMedication(req.body);

    res.status(201).json({
      success: true,
      data: { medication }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Assign medication to student
router.post('/assign', [
  auth,
  body('studentId').notEmpty(),
  body('medicationId').notEmpty(),
  body('dosage').notEmpty().trim(),
  body('frequency').notEmpty().trim(),
  body('route').notEmpty().trim(),
  body('startDate').isISO8601(),
  body('prescribedBy').notEmpty().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const studentMedication = await MedicationService.assignMedicationToStudent({
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    });

    res.status(201).json({
      success: true,
      data: { studentMedication }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Log medication administration
router.post('/administration', [
  auth,
  body('studentMedicationId').notEmpty(),
  body('dosageGiven').notEmpty().trim(),
  body('timeGiven').isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const nurseId = (req as any).user.userId; // From auth middleware

    const medicationLog = await MedicationService.logMedicationAdministration({
      ...req.body,
      nurseId,
      timeGiven: new Date(req.body.timeGiven)
    });

    res.status(201).json({
      success: true,
      data: { medicationLog }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get medication logs for a student
router.get('/logs/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await MedicationService.getStudentMedicationLogs(studentId, page, limit);

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

// Get inventory with alerts
router.get('/inventory', auth, async (_req: Request, res: Response) => {
  try {
    const result = await MedicationService.getInventoryWithAlerts();

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

// Add to inventory
router.post('/inventory', [
  auth,
  body('medicationId').notEmpty(),
  body('batchNumber').notEmpty().trim(),
  body('expirationDate').isISO8601(),
  body('quantity').isInt({ min: 1 }),
  body('reorderLevel').optional().isInt({ min: 0 }),
  body('costPerUnit').optional().isNumeric()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const inventory = await MedicationService.addToInventory({
      ...req.body,
      expirationDate: new Date(req.body.expirationDate),
      costPerUnit: req.body.costPerUnit ? parseFloat(req.body.costPerUnit) : undefined
    });

    res.status(201).json({
      success: true,
      data: { inventory }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get medication schedule
router.get('/schedule', auth, async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const nurseId = req.query.nurseId as string;

    const schedule = await MedicationService.getMedicationSchedule(startDate, endDate, nurseId);

    res.json({
      success: true,
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update inventory quantity
router.put('/inventory/:id', [
  auth,
  body('quantity').isInt({ min: 0 }),
  body('reason').optional().trim()
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
    const { quantity, reason } = req.body;

    const inventory = await MedicationService.updateInventoryQuantity(id, quantity, reason);

    res.json({
      success: true,
      data: { inventory }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Deactivate student medication
router.put('/student-medication/:id/deactivate', [
  auth,
  body('reason').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const studentMedication = await MedicationService.deactivateStudentMedication(id, reason);

    res.json({
      success: true,
      data: { studentMedication }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get medication reminders for a date
router.get('/reminders', auth, async (req: Request, res: Response) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    
    const reminders = await MedicationService.getMedicationReminders(date);

    res.json({
      success: true,
      data: { reminders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Report adverse reaction
router.post('/adverse-reaction', [
  auth,
  body('studentMedicationId').notEmpty(),
  body('severity').isIn(['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']),
  body('reaction').notEmpty().trim(),
  body('actionTaken').notEmpty().trim(),
  body('reportedAt').isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const reportedBy = (req as any).user.userId;

    const report = await MedicationService.reportAdverseReaction({
      ...req.body,
      reportedBy,
      reportedAt: new Date(req.body.reportedAt)
    });

    res.status(201).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get adverse reactions
router.get('/adverse-reactions', auth, async (req: Request, res: Response) => {
  try {
    const medicationId = req.query.medicationId as string;
    const studentId = req.query.studentId as string;

    const reactions = await MedicationService.getAdverseReactions(medicationId, studentId);

    res.json({
      success: true,
      data: { reactions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;