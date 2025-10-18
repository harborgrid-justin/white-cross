/**
 * LOC: 99DD84467C
 * WC-RTE-ACL-025 | Access Control & Security Management API Routes
 *
 * UPSTREAM (imports from):
 *   - index.ts (services/accessControl/index.ts)
 *   - auth.ts (middleware/auth.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-ACL-025 | Access Control & Security Management API Routes
 * Purpose: Comprehensive RBAC system with role/permission management, session control, security incident tracking, and IP restrictions
 * Upstream: ../services/accessControl, ../middleware/auth, express validation | Dependencies: express, express-validator, auth middleware
 * Downstream: Admin security dashboard, user management interface, security monitoring | Called by: Security admin components, audit systems
 * Related: Authentication routes, user management, audit logging, security monitoring
 * Exports: Express router (20+ endpoints) | Key Services: RBAC management, session control, security incident handling, IP filtering
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Admin-level access control for security configuration
 * Critical Path: Auth validation → Permission check → Security service operations → Audit logging → Response
 * LLM Context: Enterprise security management system with role-based access control, real-time session management, security incident tracking, IP-based access restrictions, and comprehensive security statistics for healthcare data protection compliance
 */

import { Router, Response } from 'express';
import { body, query } from 'express-validator';
import { AccessControlService } from '../services/accessControl';
import { auth, ExpressAuthRequest as Request } from '../middleware/auth';
import { 
  handleValidationErrors, 
  createValidationChain,
  successResponse,
  errorResponse,
  createdResponse,
  asyncHandler
} from '../shared';

const router = Router();

// Roles management
router.get('/roles', auth, asyncHandler(async (req: Request, res: Response) => {
  const roles = await AccessControlService.getRoles();
  return successResponse(res, { roles });
}));

router.get('/roles/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const role = await AccessControlService.getRoleById(req.params.id);
  return successResponse(res, { role });
}));

router.post('/roles', auth, createValidationChain([
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
]), asyncHandler(async (req: Request, res: Response) => {
  const role = await AccessControlService.createRole(req.body);
  return createdResponse(res, { role });
}));

router.put('/roles/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  const role = await AccessControlService.updateRole(req.params.id, req.body);
  return successResponse(res, { role });
}));

router.delete('/roles/:id', auth, asyncHandler(async (req: Request, res: Response) => {
  await AccessControlService.deleteRole(req.params.id);
  return successResponse(res, { message: 'Role deleted successfully' });
}));

// Permissions management
router.get('/permissions', auth, async (req: Request, res: Response) => {
  try {
    const permissions = await AccessControlService.getPermissions();
    res.json({ success: true, data: { permissions } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.post('/permissions', auth, createValidationChain([
  body('resource').isString().notEmpty(),
  body('action').isString().notEmpty(),
  body('description').optional().isString(),
]), async (req: Request, res: Response) => {
  try {
    const permission = await AccessControlService.createPermission(req.body);
    res.status(201).json({ success: true, data: { permission } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Role-Permission assignments
router.post('/roles/:roleId/permissions/:permissionId', auth, async (req: Request, res: Response) => {
  try {
    const rolePermission = await AccessControlService.assignPermissionToRole(
      req.params.roleId,
      req.params.permissionId
    );
    res.status(201).json({ success: true, data: { rolePermission } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/roles/:roleId/permissions/:permissionId', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.removePermissionFromRole(req.params.roleId, req.params.permissionId);
    res.json({ success: true, data: { message: 'Permission removed from role' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// User-Role assignments
router.post('/users/:userId/roles/:roleId', auth, async (req: Request, res: Response) => {
  try {
    const userRole = await AccessControlService.assignRoleToUser(req.params.userId, req.params.roleId);
    res.status(201).json({ success: true, data: { userRole } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/users/:userId/roles/:roleId', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.removeRoleFromUser(req.params.userId, req.params.roleId);
    res.json({ success: true, data: { message: 'Role removed from user' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get user permissions
router.get('/users/:userId/permissions', auth, async (req: Request, res: Response) => {
  try {
    const permissions = await AccessControlService.getUserPermissions(req.params.userId);
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Check permission
router.get('/users/:userId/check', auth, [
  query('resource').isString().notEmpty(),
  query('action').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const hasPermission = await AccessControlService.checkPermission(
      req.params.userId,
      req.query.resource as string,
      req.query.action as string
    );
    res.json({ success: true, data: { hasPermission } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Session management
router.get('/users/:userId/sessions', auth, async (req: Request, res: Response) => {
  try {
    const sessions = await AccessControlService.getUserSessions(req.params.userId);
    res.json({ success: true, data: { sessions } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/sessions/:token', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.deleteSession(req.params.token);
    res.json({ success: true, data: { message: 'Session deleted' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/users/:userId/sessions', auth, async (req: Request, res: Response) => {
  try {
    const result = await AccessControlService.deleteAllUserSessions(req.params.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Security incidents
router.get('/security-incidents', auth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
], async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      type: req.query.type as string,
      severity: req.query.severity as string,
      status: req.query.status as string,
    };

    const result = await AccessControlService.getSecurityIncidents(page, limit, filters);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.post('/security-incidents', auth, createValidationChain([
  body('type').isString().notEmpty(),
  body('severity').isString().notEmpty(),
  body('description').isString().notEmpty(),
]), async (req: Request, res: Response) => {
  try {
    const detectedBy = (req).user?.userId;
    const incident = await AccessControlService.createSecurityIncident({
      ...req.body,
      detectedBy,
    });
    res.status(201).json({ success: true, data: { incident } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.put('/security-incidents/:id', auth, async (req: Request, res: Response) => {
  try {
    const incident = await AccessControlService.updateSecurityIncident(req.params.id, req.body);
    res.json({ success: true, data: { incident } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// IP restrictions
router.get('/ip-restrictions', auth, async (req: Request, res: Response) => {
  try {
    const restrictions = await AccessControlService.getIpRestrictions();
    res.json({ success: true, data: { restrictions } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.post('/ip-restrictions', auth, createValidationChain([
  body('ipAddress').isString().notEmpty(),
  body('type').isString().notEmpty(),
  body('reason').optional().isString(),
]), async (req: Request, res: Response) => {
  try {
    const createdBy = (req).user?.userId;
    const restriction = await AccessControlService.addIpRestriction({
      ...req.body,
      createdBy,
    });
    res.status(201).json({ success: true, data: { restriction } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/ip-restrictions/:id', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.removeIpRestriction(req.params.id);
    res.json({ success: true, data: { message: 'IP restriction removed' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Statistics
router.get('/statistics', auth, async (req: Request, res: Response) => {
  try {
    const statistics = await AccessControlService.getSecurityStatistics();
    res.json({ success: true, data: statistics });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Initialize default roles (admin only)
router.post('/initialize-roles', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.initializeDefaultRoles();
    res.json({ success: true, data: { message: 'Default roles initialized' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

export default router;
