import { Router, Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { AccessControlService } from '../services/accessControlService';
import { auth } from '../middleware/auth';

const router = Router();

// Roles management
router.get('/roles', auth, async (req: Request, res: Response) => {
  try {
    const roles = await AccessControlService.getRoles();
    res.json({ success: true, data: { roles } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.get('/roles/:id', auth, async (req: Request, res: Response) => {
  try {
    const role = await AccessControlService.getRoleById(req.params.id);
    res.json({ success: true, data: { role } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.post('/roles', auth, [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const role = await AccessControlService.createRole(req.body);
    res.status(201).json({ success: true, data: { role } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.put('/roles/:id', auth, async (req: Request, res: Response) => {
  try {
    const role = await AccessControlService.updateRole(req.params.id, req.body);
    res.json({ success: true, data: { role } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.delete('/roles/:id', auth, async (req: Request, res: Response) => {
  try {
    await AccessControlService.deleteRole(req.params.id);
    res.json({ success: true, data: { message: 'Role deleted successfully' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Permissions management
router.get('/permissions', auth, async (req: Request, res: Response) => {
  try {
    const permissions = await AccessControlService.getPermissions();
    res.json({ success: true, data: { permissions } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

router.post('/permissions', auth, [
  body('resource').isString().notEmpty(),
  body('action').isString().notEmpty(),
  body('description').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

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

router.post('/security-incidents', auth, [
  body('type').isString().notEmpty(),
  body('severity').isString().notEmpty(),
  body('description').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const detectedBy = (req as any).user.id;
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

router.post('/ip-restrictions', auth, [
  body('ipAddress').isString().notEmpty(),
  body('type').isString().notEmpty(),
  body('reason').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const createdBy = (req as any).user.id;
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
