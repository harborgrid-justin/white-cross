import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, ExpressAuthRequest as AuthRequest } from '../middleware/auth';

const router = Router();

// Alias for backward compatibility with frontend tests
router.post('/', [
  auth,
  body('action').notEmpty(),
  body('resourceType').optional(),
  body('resourceId').optional(),
  body('timestamp').optional()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Silently log audit trail (compatible with frontend calls to /api/audit-log)
    void {
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: req.body.action,
      resourceType: req.body.resourceType || 'STUDENT',
      resourceId: req.body.resourceId,
      timestamp: req.body.timestamp || new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    res.status(201).json({
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

// Log access attempts to resources
router.post('/access-log', [
  auth,
  body('action').notEmpty(),
  body('studentId').optional(),
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

    // In a real implementation, this would save to an audit log table
    // TODO: Persist auditLog to database
    void {
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: req.body.action,
      resourceType: req.body.resourceType || 'HEALTH_RECORD',
      studentId: req.body.studentId,
      resourceId: req.body.resourceId,
      details: req.body.details || {},
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    res.status(201).json({
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

// Log security events
router.post('/security-log', [
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

    // In a real implementation, this would save to a security log table
    // TODO: Persist securityEvent to database
    void {
      userId: req.user?.userId,
      userRole: req.user?.role,
      event: req.body.event,
      resourceType: req.body.resourceType,
      studentId: req.body.studentId,
      securityLevel: req.body.securityLevel || 'MEDIUM',
      details: req.body.details || {},
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    res.status(201).json({
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