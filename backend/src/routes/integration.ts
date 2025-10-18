/**
 * LOC: FD5A79F578
 * WC-RTE-INT-037 | integration.ts - Third-Party Integration Management API Routes
 *
 * UPSTREAM (imports from):
 *   - auth.ts (middleware/auth.ts)
 *   - integrationService.ts (services/integrationService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-RTE-INT-037 | integration.ts - Third-Party Integration Management API Routes
 * Purpose: Express.js routes for comprehensive external system integrations including SIS, EHR, pharmacy, laboratory, and government reporting
 * Upstream: ../services/integrationService/IntegrationService, ../middleware/auth/ExpressAuthRequest | Dependencies: express, express-validator
 * Downstream: External health systems, student information systems, pharmacy networks, lab systems, government reporting | Called by: Admin interfaces, automated sync processes
 * Related: ../services/integrationService.ts, ../middleware/auth.ts, healthRecords.ts, students.ts, medications.ts, reports.ts
 * Exports: router | Key Services: Integration CRUD, connection testing, data synchronization, logging, statistics, admin-only access controls
 * Last Updated: 2025-10-18 | File Type: .ts | Lines: ~200
 * Critical Path: Admin authentication → Integration validation → External API communication → Data sync → Audit logging → Response
 * LLM Context: Healthcare integration hub with 12+ endpoints for managing SIS/EHR/pharmacy/lab/government systems, connection testing, sync operations, and audit trails
 */

import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, ExpressAuthRequest as AuthRequest } from '../middleware/auth';
import { IntegrationService } from '../services/integrationService';

const router = Router();

// Middleware to check if user is admin
const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'DISTRICT_ADMIN') {
    res.status(403).json({
      success: false,
      error: { message: 'Access denied. Admin privileges required.' }
    });
    return;
  }
  next();
};

// ==================== Integration Configuration Routes ====================

// Get all integrations
router.get('/', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const integrations = await IntegrationService.getAllIntegrations(type);

    res.json({
      success: true,
      data: { integrations }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get integration by ID
router.get('/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const integration = await IntegrationService.getIntegrationById(req.params.id);

    res.json({
      success: true,
      data: { integration }
    });
  } catch (error) {
    res.status(error instanceof Error && error.message === 'Integration not found' ? 404 : 500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create integration
router.post('/', [
  auth,
  isAdmin,
  body('name').notEmpty().trim(),
  body('type').isIn(['SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const integration = await IntegrationService.createIntegration(req.body);

    res.status(201).json({
      success: true,
      data: { integration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update integration
router.put('/:id', [
  auth,
  isAdmin,
  body('name').optional().notEmpty().trim()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const integration = await IntegrationService.updateIntegration(req.params.id, req.body);

    res.json({
      success: true,
      data: { integration }
    });
  } catch (error) {
    res.status(error instanceof Error && error.message === 'Integration not found' ? 404 : 500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Delete integration
router.delete('/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await IntegrationService.deleteIntegration(req.params.id);

    res.json({
      success: true,
      data: { message: 'Integration deleted successfully' }
    });
  } catch (error) {
    res.status(error instanceof Error && error.message === 'Integration not found' ? 404 : 500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== Integration Operations Routes ====================

// Test integration connection
router.post('/:id/test', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await IntegrationService.testConnection(req.params.id);

    res.json({
      success: true,
      data: { result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Trigger integration sync
router.post('/:id/sync', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await IntegrationService.syncIntegration(req.params.id);

    res.json({
      success: true,
      data: { result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// ==================== Integration Logs Routes ====================

// Get integration logs
router.get('/:id/logs', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await IntegrationService.getIntegrationLogs(req.params.id, undefined, page, limit);

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

// Get all integration logs (with optional type filter)
router.get('/logs/all', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string | undefined;

    const result = await IntegrationService.getIntegrationLogs(undefined, type, page, limit);

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

// ==================== Statistics Routes ====================

// Get integration statistics
router.get('/statistics/overview', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const statistics = await IntegrationService.getIntegrationStatistics();

    res.json({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;
