/**
 * WC-RTE-CMP-032 | HIPAA Compliance & Regulatory Management API Routes
 * Purpose: Comprehensive compliance management system with reporting, consent forms, policy management, audit logging, and regulatory compliance tracking
 * Upstream: ../services/complianceService, ../middleware/auth, express validation | Dependencies: express, express-validator, compliance service
 * Downstream: Compliance dashboard, audit interface, policy management, consent tracking | Called by: Compliance management components, audit systems
 * Related: Audit routes, administration routes, policy management, consent tracking
 * Exports: Express router (20+ endpoints) | Key Services: Compliance reporting, consent management, policy tracking, audit logging, statistics
 * Last Updated: 2025-10-18 | File Type: .ts | Security: HIPAA compliance tracking, audit trails, consent management, policy acknowledgments
 * Critical Path: Auth validation → Compliance service operations → Regulatory tracking → Audit logging → Response
 * LLM Context: Healthcare regulatory compliance system with comprehensive HIPAA compliance reporting, digital consent management, policy tracking with acknowledgments, detailed audit logging, and automated compliance report generation for healthcare data protection regulations
 */

import { Router, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { ComplianceService } from '../services/complianceService';
import { auth, ExpressAuthRequest as Request } from '../middleware/auth';
import {
  createValidationChain,
  successResponse,
  paginatedResponse,
  asyncHandler
} from '../shared';

const router = Router();

// Get all compliance reports
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('reportType').optional().isString(),
  query('status').optional().isString(),
  query('period').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      reportType: req.query.reportType as any,
      status: req.query.status as any,
      period: req.query.period as any,
    };

    const result = await ComplianceService.getComplianceReports(page, limit, filters);

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

// Get compliance report by ID
router.get('/:id', auth, [
  param('id').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const report = await ComplianceService.getComplianceReportById(req.params.id);

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

// Create compliance report
router.post('/', auth, [
  body('reportType').isString().notEmpty(),
  body('title').isString().notEmpty(),
  body('description').optional().isString(),
  body('period').isString().notEmpty(),
  body('dueDate').optional().isISO8601().toDate(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const createdById = (req).user?.userId;

    const report = await ComplianceService.createComplianceReport({
      ...req.body,
      createdById,
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

// Update compliance report
router.put('/:id', auth, [
  param('id').isString(),
  body('status').optional().isString(),
  body('findings').optional(),
  body('recommendations').optional(),
  body('submittedBy').optional().isString(),
  body('reviewedBy').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const report = await ComplianceService.updateComplianceReport(
      req.params.id,
      req.body
    );

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

// Delete compliance report
router.delete('/:id', auth, [
  param('id').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    await ComplianceService.deleteComplianceReport(req.params.id);

    res.json({
      success: true,
      data: { message: 'Compliance report deleted successfully' }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Add checklist item
router.post('/checklist-items', auth, [
  body('requirement').isString().notEmpty(),
  body('description').optional().isString(),
  body('category').isString().notEmpty(),
  body('dueDate').optional().isISO8601().toDate(),
  body('reportId').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await ComplianceService.addChecklistItem(req.body);

    res.status(201).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update checklist item
router.put('/checklist-items/:id', auth, [
  param('id').isString(),
  body('status').optional().isString(),
  body('evidence').optional().isString(),
  body('notes').optional().isString(),
  body('completedBy').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await ComplianceService.updateChecklistItem(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get consent forms
router.get('/consent/forms', auth, [
  query('isActive').optional().isBoolean().toBoolean(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const filters = {
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
    };

    const forms = await ComplianceService.getConsentForms(filters);

    res.json({
      success: true,
      data: { forms }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create consent form
router.post('/consent/forms', auth, [
  body('type').isString().notEmpty(),
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('version').optional().isString(),
  body('expiresAt').optional().isISO8601().toDate(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const form = await ComplianceService.createConsentForm(req.body);

    res.status(201).json({
      success: true,
      data: { form }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Sign consent form
router.post('/consent/sign', auth, [
  body('consentFormId').isString().notEmpty(),
  body('studentId').isString().notEmpty(),
  body('signedBy').isString().notEmpty(),
  body('relationship').isString().notEmpty(),
  body('signatureData').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const ipAddress = req.ip || req.socket.remoteAddress;

    const signature = await ComplianceService.signConsentForm({
      ...req.body,
      ipAddress,
    });

    res.status(201).json({
      success: true,
      data: { signature }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get student consents
router.get('/consent/student/:studentId', auth, [
  param('studentId').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const consents = await ComplianceService.getStudentConsents(req.params.studentId);

    res.json({
      success: true,
      data: { consents }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Withdraw consent
router.put('/consent/:signatureId/withdraw', auth, [
  param('signatureId').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const withdrawnBy = (req).user?.userId;

    if (!withdrawnBy) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const signature = await ComplianceService.withdrawConsent(
      req.params.signatureId,
      withdrawnBy
    );

    res.json({
      success: true,
      data: { signature }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get policies
router.get('/policies', auth, [
  query('category').optional().isString(),
  query('status').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const filters = {
      category: req.query.category as any,
      status: req.query.status as any,
    };

    const policies = await ComplianceService.getPolicies(filters);

    res.json({
      success: true,
      data: { policies }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create policy
router.post('/policies', auth, [
  body('title').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('content').isString().notEmpty(),
  body('version').optional().isString(),
  body('effectiveDate').isISO8601().toDate(),
  body('reviewDate').optional().isISO8601().toDate(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const policy = await ComplianceService.createPolicy(req.body);

    res.status(201).json({
      success: true,
      data: { policy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update policy
router.put('/policies/:id', auth, [
  param('id').isString(),
  body('status').optional().isString(),
  body('approvedBy').optional().isString(),
  body('reviewDate').optional().isISO8601().toDate(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const policy = await ComplianceService.updatePolicy(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: { policy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Acknowledge policy
router.post('/policies/:policyId/acknowledge', auth, [
  param('policyId').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = (req).user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const acknowledgment = await ComplianceService.acknowledgePolicy(
      req.params.policyId,
      userId,
      ipAddress
    );

    res.status(201).json({
      success: true,
      data: { acknowledgment }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get compliance statistics
router.get('/statistics/overview', auth, [
  query('period').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const period = req.query.period as string;

    const statistics = await ComplianceService.getComplianceStatistics(period);

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get audit logs
router.get('/audit-logs', auth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('userId').optional().isString(),
  query('entityType').optional().isString(),
  query('action').optional().isString(),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const filters = {
      userId: req.query.userId as string,
      entityType: req.query.entityType as string,
      action: req.query.action as any,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };

    const result = await ComplianceService.getAuditLogs(page, limit, filters);

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

// Generate compliance report
router.post('/generate', auth, [
  body('reportType').isString().notEmpty(),
  body('period').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const createdById = (req).user?.userId;

    if (!createdById) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const report = await ComplianceService.generateComplianceReport(
      req.body.reportType,
      req.body.period,
      createdById
    );

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

export default router;
