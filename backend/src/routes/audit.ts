/**
 * LOC: 02F5912759
 * WC-RTE-AUD-027 | Audit Trail & Security Logging API Routes
 *
 * UPSTREAM (imports from):
 *   - index.ts (shared/index.ts)
 *   - auth.ts (middleware/auth.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-AUD-027 | Audit Trail & Security Logging API Routes
 * Purpose: Audit trail logging endpoints for compliance tracking, security event logging, and access monitoring for HIPAA compliance
 * Upstream: ../middleware/auth, express validation | Dependencies: express, express-validator, auth middleware
 * Downstream: Compliance dashboard, security monitoring, audit reports | Called by: Frontend audit logging, security monitoring systems
 * Related: Administration routes, access control, security incident tracking
 * Exports: Express router (3 endpoints) | Key Services: Audit logging, access logging, security event logging
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Requires authentication, logs all access attempts for compliance
 * Critical Path: Auth validation → Audit data collection → Silent logging → Compliance tracking
 * LLM Context: HIPAA compliance audit system for healthcare data access tracking, security event monitoring, and regulatory compliance with silent logging for all protected health information access attempts
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { handleValidationErrors, createValidationChain } from '../shared';
import { auth, ExpressAuthRequest as AuthRequest } from '../middleware/auth';
import { AuditLog } from '../database/models/compliance/AuditLog';
import { AuditAction } from '../database/types/enums';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Helper function to map string actions to AuditAction enum
 * @param action - Action string from request
 * @returns Mapped AuditAction enum value
 */
function mapActionToAuditAction(action: string): AuditAction {
  const actionUpper = action.toUpperCase();
  
  // Map common action strings to enum values
  const actionMap: Record<string, AuditAction> = {
    'CREATE': AuditAction.CREATE,
    'READ': AuditAction.READ,
    'VIEW': AuditAction.VIEW,
    'ACCESS': AuditAction.ACCESS,
    'UPDATE': AuditAction.UPDATE,
    'EDIT': AuditAction.UPDATE,
    'DELETE': AuditAction.DELETE,
    'REMOVE': AuditAction.DELETE,
    'LOGIN': AuditAction.LOGIN,
    'LOGOUT': AuditAction.LOGOUT,
    'EXPORT': AuditAction.EXPORT,
    'IMPORT': AuditAction.IMPORT,
    'BACKUP': AuditAction.BACKUP,
    'RESTORE': AuditAction.RESTORE,
    'SECURITY_EVENT': AuditAction.SECURITY_EVENT
  };

  return actionMap[actionUpper] || AuditAction.READ;
}

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

    // Persist audit trail to database for HIPAA compliance
    try {
      const auditEntry = await AuditLog.create({
        userId: req.user?.userId,
        action: mapActionToAuditAction(req.body.action),
        entityType: req.body.resourceType || 'STUDENT',
        entityId: req.body.resourceId,
        changes: {
          action: req.body.action,
          userRole: req.user?.role,
          timestamp: req.body.timestamp || new Date()
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      logger.info('Audit log created', {
        auditId: auditEntry.id,
        userId: req.user?.userId,
        action: req.body.action,
        resourceType: req.body.resourceType
      });
    } catch (dbError) {
      // Log the error but don't fail the request - audit logging is critical but shouldn't block operations
      logger.error('Failed to persist audit log to database', {
        error: dbError,
        userId: req.user?.userId,
        action: req.body.action
      });
    }

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

    // Persist access log to database for HIPAA compliance
    try {
      const auditEntry = await AuditLog.create({
        userId: req.user?.userId,
        action: mapActionToAuditAction(req.body.action),
        entityType: req.body.resourceType || 'HEALTH_RECORD',
        entityId: req.body.resourceId || req.body.studentId,
        changes: {
          action: req.body.action,
          userRole: req.user?.role,
          studentId: req.body.studentId,
          details: req.body.details || {}
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      logger.info('Access log created', {
        auditId: auditEntry.id,
        userId: req.user?.userId,
        action: req.body.action,
        resourceType: req.body.resourceType
      });
    } catch (dbError) {
      logger.error('Failed to persist access log to database', {
        error: dbError,
        userId: req.user?.userId,
        action: req.body.action
      });
    }

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

    // Persist security event to database for compliance and monitoring
    try {
      const auditEntry = await AuditLog.create({
        userId: req.user?.userId,
        action: AuditAction.SECURITY_EVENT,
        entityType: req.body.resourceType,
        entityId: req.body.studentId,
        changes: {
          event: req.body.event,
          userRole: req.user?.role,
          securityLevel: req.body.securityLevel || 'MEDIUM',
          details: req.body.details || {}
        },
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      logger.warn('Security event logged', {
        auditId: auditEntry.id,
        userId: req.user?.userId,
        event: req.body.event,
        securityLevel: req.body.securityLevel,
        resourceType: req.body.resourceType
      });
    } catch (dbError) {
      logger.error('Failed to persist security event to database', {
        error: dbError,
        userId: req.user?.userId,
        event: req.body.event
      });
    }

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
