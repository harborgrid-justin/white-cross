import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { CommunicationService } from '../services/communicationService';

const router = Router();

// Get message templates
router.get('/templates', auth, async (req: Request, res: Response) => {
  try {
    const type = req.query.type as any;
    const category = req.query.category as string;
    const isActive = req.query.isActive !== 'false';

    const templates = await CommunicationService.getMessageTemplates(type, category, isActive);

    res.json({
      success: true,
      data: { templates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create message template
router.post('/templates', [
  auth,
  body('name').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('type').isIn(['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE']),
  body('category').isIn(['EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE']),
  body('variables').optional().isArray()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const createdBy = (req as any).user.userId; // From auth middleware

    const template = await CommunicationService.createMessageTemplate({
      ...req.body,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: { template }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Send message to specific recipients
router.post('/send', [
  auth,
  body('recipients').isArray({ min: 1 }),
  body('recipients.*.type').isIn(['STUDENT', 'EMERGENCY_CONTACT', 'PARENT', 'NURSE', 'ADMIN']),
  body('recipients.*.id').notEmpty(),
  body('channels').isArray({ min: 1 }),
  body('channels.*').isIn(['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE']),
  body('content').notEmpty().trim(),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('category').isIn(['EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE']),
  body('scheduledAt').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const senderId = (req as any).user.userId; // From auth middleware

    const result = await CommunicationService.sendMessage({
      ...req.body,
      senderId,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Send broadcast message
router.post('/broadcast', [
  auth,
  body('audience').isObject(),
  body('channels').isArray({ min: 1 }),
  body('channels.*').isIn(['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE']),
  body('content').notEmpty().trim(),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('category').isIn(['EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE']),
  body('scheduledAt').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const senderId = (req as any).user.userId; // From auth middleware

    const result = await CommunicationService.sendBroadcastMessage({
      ...req.body,
      senderId,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get messages
router.get('/messages', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.senderId) filters.senderId = req.query.senderId as string;
    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.priority) filters.priority = req.query.priority as string;
    if (req.query.dateFrom) filters.dateFrom = new Date(req.query.dateFrom as string);
    if (req.query.dateTo) filters.dateTo = new Date(req.query.dateTo as string);

    const result = await CommunicationService.getMessages(page, limit, filters);

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

// Get message delivery status
router.get('/messages/:messageId/delivery', auth, async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const result = await CommunicationService.getMessageDeliveryStatus(messageId);

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

// Send emergency alert
router.post('/emergency-alert', [
  auth,
  body('title').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('severity').isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('audience').isIn(['ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS']),
  body('channels').isArray({ min: 1 }),
  body('channels.*').isIn(['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'])
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const senderId = (req as any).user.userId; // From auth middleware

    const result = await CommunicationService.sendEmergencyAlert({
      ...req.body,
      senderId
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Process scheduled messages (for cron job)
router.post('/process-scheduled', auth, async (_req: Request, res: Response) => {
  try {
    const processedCount = await CommunicationService.processScheduledMessages();

    res.json({
      success: true,
      data: { processedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get communication statistics
router.get('/statistics', auth, async (req: Request, res: Response) => {
  try {
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

    const stats = await CommunicationService.getCommunicationStatistics(dateFrom, dateTo);

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

export default router;