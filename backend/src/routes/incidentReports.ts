import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { IncidentReportService } from '../services/incidentReportService';

const router = Router();

// Get incident reports
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.studentId) filters.studentId = req.query.studentId as string;
    if (req.query.reportedById) filters.reportedById = req.query.reportedById as string;
    if (req.query.type) filters.type = req.query.type as string;
    if (req.query.severity) filters.severity = req.query.severity as string;
    if (req.query.dateFrom) filters.dateFrom = new Date(req.query.dateFrom as string);
    if (req.query.dateTo) filters.dateTo = new Date(req.query.dateTo as string);
    if (req.query.parentNotified !== undefined) filters.parentNotified = req.query.parentNotified === 'true';
    if (req.query.followUpRequired !== undefined) filters.followUpRequired = req.query.followUpRequired === 'true';

    const result = await IncidentReportService.getIncidentReports(page, limit, filters);

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

// Get incident report by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await IncidentReportService.getIncidentReportById(id);

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    if ((error as Error).message === 'Incident report not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'Incident report not found' }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create new incident report
router.post('/', [
  auth,
  body('studentId').notEmpty(),
  body('type').isIn(['INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER']),
  body('severity').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('description').notEmpty().trim(),
  body('location').notEmpty().trim(),
  body('actionsTaken').notEmpty().trim(),
  body('occurredAt').isISO8601(),
  body('witnesses').optional().isArray(),
  body('parentNotified').optional().isBoolean(),
  body('followUpRequired').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const reportedById = (req as any).user.userId; // From auth middleware

    const report = await IncidentReportService.createIncidentReport({
      ...req.body,
      reportedById,
      occurredAt: new Date(req.body.occurredAt)
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

// Update incident report
router.put('/:id', [
  auth,
  body('type').optional().isIn(['INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER']),
  body('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('description').optional().trim(),
  body('location').optional().trim(),
  body('actionsTaken').optional().trim(),
  body('occurredAt').optional().isISO8601(),
  body('witnesses').optional().isArray(),
  body('parentNotified').optional().isBoolean(),
  body('followUpRequired').optional().isBoolean()
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
    
    if (updateData.occurredAt) {
      updateData.occurredAt = new Date(updateData.occurredAt);
    }

    const report = await IncidentReportService.updateIncidentReport(id, updateData);

    res.json({
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

// Mark parent as notified
router.put('/:id/notify-parent', [
  auth,
  body('notificationMethod').optional().trim(),
  body('notifiedBy').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notificationMethod, notifiedBy } = req.body;
    
    const report = await IncidentReportService.markParentNotified(id, notificationMethod, notifiedBy);

    res.json({
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

// Add follow-up notes
router.put('/:id/follow-up', [
  auth,
  body('notes').notEmpty().trim()
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
    const { notes } = req.body;
    const completedBy = (req as any).user.firstName + ' ' + (req as any).user.lastName;
    
    const report = await IncidentReportService.addFollowUpNotes(id, notes, completedBy);

    res.json({
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

// Get incident statistics
router.get('/statistics/overview', auth, async (req: Request, res: Response) => {
  try {
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;
    const studentId = req.query.studentId as string;

    const stats = await IncidentReportService.getIncidentStatistics(dateFrom, dateTo, studentId);

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

// Search incident reports
router.get('/search/:query', auth, async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await IncidentReportService.searchIncidentReports(query, page, limit);

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

// Get incidents requiring follow-up
router.get('/follow-up/pending', auth, async (_req: Request, res: Response) => {
  try {
    const reports = await IncidentReportService.getIncidentsRequiringFollowUp();

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get recent incidents for a student
router.get('/student/:studentId/recent', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const reports = await IncidentReportService.getStudentRecentIncidents(studentId, limit);

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Generate incident report document
router.get('/:id/document', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const documentData = await IncidentReportService.generateIncidentReportDocument(id);

    res.json({
      success: true,
      data: { document: documentData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;