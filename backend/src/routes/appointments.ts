import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { AppointmentService } from '../services/appointmentService';

const router = Router();

// Get appointments
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.nurseId) filters.nurseId = req.query.nurseId as string;
    if (req.query.studentId) filters.studentId = req.query.studentId as string;
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.type) filters.type = req.query.type as string;
    if (req.query.dateFrom) filters.dateFrom = new Date(req.query.dateFrom as string);
    if (req.query.dateTo) filters.dateTo = new Date(req.query.dateTo as string);

    const result = await AppointmentService.getAppointments(page, limit, filters);

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

// Create new appointment
router.post('/', [
  auth,
  body('studentId').notEmpty(),
  body('nurseId').notEmpty(),
  body('type').isIn(['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY']),
  body('scheduledAt').isISO8601(),
  body('reason').notEmpty().trim(),
  body('duration').optional().isInt({ min: 15, max: 180 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const appointment = await AppointmentService.createAppointment({
      ...req.body,
      scheduledAt: new Date(req.body.scheduledAt)
    });

    res.status(201).json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update appointment
router.put('/:id', [
  auth,
  body('type').optional().isIn(['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY']),
  body('scheduledAt').optional().isISO8601(),
  body('reason').optional().trim(),
  body('duration').optional().isInt({ min: 15, max: 180 }),
  body('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
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
    
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    const appointment = await AppointmentService.updateAppointment(id, updateData);

    res.json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', [
  auth,
  body('reason').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const appointment = await AppointmentService.cancelAppointment(id, reason);

    res.json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Mark as no-show
router.put('/:id/no-show', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentService.markNoShow(id);

    res.json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Check availability
router.get('/availability/:nurseId', auth, async (req: Request, res: Response) => {
  try {
    const { nurseId } = req.params;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const duration = parseInt(req.query.duration as string) || 30;

    const slots = await AppointmentService.getAvailableSlots(nurseId, date, duration);

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get upcoming appointments for a nurse
router.get('/upcoming/:nurseId', auth, async (req: Request, res: Response) => {
  try {
    const { nurseId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const appointments = await AppointmentService.getUpcomingAppointments(nurseId, limit);

    res.json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get appointment statistics
router.get('/statistics', auth, async (req: Request, res: Response) => {
  try {
    const nurseId = req.query.nurseId as string;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

    const stats = await AppointmentService.getAppointmentStatistics(nurseId, dateFrom, dateTo);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create recurring appointments
router.post('/recurring', [
  auth,
  body('studentId').notEmpty(),
  body('nurseId').notEmpty(),
  body('type').isIn(['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY']),
  body('scheduledAt').isISO8601(),
  body('reason').notEmpty().trim(),
  body('recurrence.frequency').isIn(['daily', 'weekly', 'monthly']),
  body('recurrence.interval').isInt({ min: 1 }),
  body('recurrence.endDate').isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { recurrence, ...appointmentData } = req.body;

    const appointments = await AppointmentService.createRecurringAppointments(
      {
        ...appointmentData,
        scheduledAt: new Date(appointmentData.scheduledAt)
      },
      {
        ...recurrence,
        endDate: new Date(recurrence.endDate)
      }
    );

    res.status(201).json({
      success: true,
      data: { 
        appointments,
        count: appointments.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;