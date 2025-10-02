import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { EmergencyContactService } from '../services/emergencyContactService';

const router = Router();

// Get emergency contacts for a student
router.get('/student/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const contacts = await EmergencyContactService.getStudentEmergencyContacts(studentId);

    res.json({
      success: true,
      data: { contacts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create new emergency contact
router.post('/', [
  auth,
  body('studentId').notEmpty(),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('relationship').notEmpty().trim(),
  body('phoneNumber').notEmpty().trim(),
  body('priority').isIn(['PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY']),
  body('email').optional().isEmail()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const contact = await EmergencyContactService.createEmergencyContact(req.body);

    res.status(201).json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update emergency contact
router.put('/:id', [
  auth,
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('relationship').optional().trim(),
  body('phoneNumber').optional().trim(),
  body('priority').optional().isIn(['PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY']),
  body('email').optional().isEmail(),
  body('isActive').optional().isBoolean()
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
    const contact = await EmergencyContactService.updateEmergencyContact(id, req.body);

    res.json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete emergency contact
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await EmergencyContactService.deleteEmergencyContact(id);

    res.json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Send emergency notification to all contacts
router.post('/notify/:studentId', [
  auth,
  body('message').notEmpty().trim(),
  body('type').isIn(['emergency', 'health', 'medication', 'general']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('channels').isArray().custom((channels: string[]) => {
    const validChannels = ['sms', 'email', 'voice'];
    return channels.every(channel => validChannels.includes(channel));
  })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { studentId } = req.params;
    const results = await EmergencyContactService.sendEmergencyNotification(studentId, {
      ...req.body,
      studentId
    });

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Send notification to specific contact
router.post('/notify/contact/:contactId', [
  auth,
  body('message').notEmpty().trim(),
  body('type').isIn(['emergency', 'health', 'medication', 'general']),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('channels').isArray().custom((channels: string[]) => {
    const validChannels = ['sms', 'email', 'voice'];
    return channels.every(channel => validChannels.includes(channel));
  })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { contactId } = req.params;
    const result = await EmergencyContactService.sendContactNotification(contactId, {
      ...req.body,
      studentId: '' // Will be fetched from contact
    });

    res.json({
      success: true,
      data: { result }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Verify contact information
router.post('/verify/:contactId', [
  auth,
  body('method').isIn(['sms', 'email', 'voice'])
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { contactId } = req.params;
    const { method } = req.body;
    
    const result = await EmergencyContactService.verifyContact(contactId, method);

    res.json({
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

// Get contact statistics
router.get('/statistics', auth, async (_req: Request, res: Response) => {
  try {
    const stats = await EmergencyContactService.getContactStatistics();

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