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

// Nurse Availability Endpoints

// Set nurse availability
router.post('/availability', [
  auth,
  body('nurseId').notEmpty(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('dayOfWeek').optional().isInt({ min: 0, max: 6 }),
  body('isRecurring').optional().isBoolean(),
  body('specificDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const availability = await AppointmentService.setNurseAvailability(req.body);

    res.status(201).json({
      success: true,
      data: { availability }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get nurse availability
router.get('/availability/nurse/:nurseId', auth, async (req: Request, res: Response) => {
  try {
    const { nurseId } = req.params;
    const date = req.query.date ? new Date(req.query.date as string) : undefined;

    const availability = await AppointmentService.getNurseAvailability(nurseId, date);

    res.json({
      success: true,
      data: { availability }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update nurse availability
router.put('/availability/:id', [
  auth,
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('isAvailable').optional().isBoolean()
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
    const availability = await AppointmentService.updateNurseAvailability(id, req.body);

    res.json({
      success: true,
      data: { availability }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete nurse availability
router.delete('/availability/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await AppointmentService.deleteNurseAvailability(id);

    res.json({
      success: true,
      message: 'Availability schedule deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Waitlist Endpoints

// Add to waitlist
router.post('/waitlist', [
  auth,
  body('studentId').notEmpty(),
  body('type').isIn(['ROUTINE_CHECKUP', 'MEDICATION_ADMINISTRATION', 'INJURY_ASSESSMENT', 'ILLNESS_EVALUATION', 'FOLLOW_UP', 'SCREENING', 'EMERGENCY']),
  body('reason').notEmpty().trim(),
  body('priority').optional().isIn(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  body('preferredDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const data = { ...req.body };
    if (data.preferredDate) {
      data.preferredDate = new Date(data.preferredDate);
    }

    const entry = await AppointmentService.addToWaitlist(data);

    res.status(201).json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get waitlist
router.get('/waitlist', auth, async (req: Request, res: Response) => {
  try {
    const filters: any = {};
    if (req.query.nurseId) filters.nurseId = req.query.nurseId as string;
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.priority) filters.priority = req.query.priority as string;

    const waitlist = await AppointmentService.getWaitlist(filters);

    res.json({
      success: true,
      data: { waitlist }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Remove from waitlist
router.delete('/waitlist/:id', [
  auth,
  body('reason').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const entry = await AppointmentService.removeFromWaitlist(id, reason);

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Reminder Endpoints

// Process pending reminders (typically called by a cron job)
router.post('/reminders/process', auth, async (req: Request, res: Response) => {
  try {
    const result = await AppointmentService.processPendingReminders();

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

// Calendar Export

// Generate calendar export
router.get('/calendar/:nurseId', auth, async (req: Request, res: Response) => {
  try {
    const { nurseId } = req.params;
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

    const ical = await AppointmentService.generateCalendarExport(nurseId, dateFrom, dateTo);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="appointments-${nurseId}.ics"`);
    res.send(ical);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;