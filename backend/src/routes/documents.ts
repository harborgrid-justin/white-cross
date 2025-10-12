import { Router, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { DocumentService } from '../services/documentService';
import { auth, ExpressAuthRequest as Request } from '../middleware/auth';

const router = Router();

// Get all documents
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().isString(),
  query('status').optional().isString(),
  query('studentId').optional().isString(),
  query('searchTerm').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      category: req.query.category as any,
      status: req.query.status as any,
      studentId: req.query.studentId as string,
      uploadedBy: req.query.uploadedBy as string,
      searchTerm: req.query.searchTerm as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
    };

    const result = await DocumentService.getDocuments(page, limit, filters);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get document by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const document = await DocumentService.viewDocument(req.params.id, userId);
    res.json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Create document
router.post('/', auth, [
  body('title').isString().notEmpty(),
  body('category').isString().notEmpty(),
  body('fileType').isString().notEmpty(),
  body('fileName').isString().notEmpty(),
  body('fileSize').isInt({ min: 0 }),
  body('fileUrl').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const uploadedBy = (req).user?.userId;
    const document = await DocumentService.createDocument({ ...req.body, uploadedBy });
    res.status(201).json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Update document
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const updatedBy = (req).user?.userId;
    if (!updatedBy) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const document = await DocumentService.updateDocument(req.params.id, req.body, updatedBy);
    res.json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Delete document
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const deletedBy = (req).user?.userId;
    if (!deletedBy) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    await DocumentService.deleteDocument(req.params.id, deletedBy);
    res.json({ success: true, data: { message: 'Document deleted successfully' } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Create document version
router.post('/:parentId/version', auth, [
  param('parentId').isString(),
  body('fileType').isString().notEmpty(),
  body('fileName').isString().notEmpty(),
  body('fileSize').isInt({ min: 0 }),
  body('fileUrl').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const uploadedBy = (req).user?.userId;
    const document = await DocumentService.createDocumentVersion(req.params.parentId, {
      ...req.body,
      uploadedBy,
    });
    res.status(201).json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Sign document
router.post('/:id/sign', auth, [
  param('id').isString(),
  body('signatureData').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = (req).user;
    const ipAddress = req.ip || req.socket.remoteAddress;

    if (!user || !user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const signature = await DocumentService.signDocument({
      documentId: req.params.id,
      signedBy: user.userId,
      signedByRole: user.role,
      signatureData: req.body.signatureData,
      ipAddress,
    });

    res.status(201).json({ success: true, data: { signature } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Download document
router.get('/:id/download', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const document = await DocumentService.downloadDocument(req.params.id, userId);
    res.json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get templates
router.get('/templates/list', auth, [
  query('category').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const category = req.query.category as any;
    const templates = await DocumentService.getTemplates(category);
    res.json({ success: true, data: { templates } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Create from template
router.post('/templates/:templateId/create', auth, [
  param('templateId').isString(),
  body('title').isString().notEmpty(),
  body('studentId').optional().isString(),
  body('templateData').optional(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const uploadedBy = (req).user?.userId;
    const document = await DocumentService.createFromTemplate(req.params.templateId, {
      ...req.body,
      uploadedBy,
    });

    res.status(201).json({ success: true, data: { document } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get student documents
router.get('/student/:studentId', auth, async (req: Request, res: Response) => {
  try {
    const documents = await DocumentService.getStudentDocuments(req.params.studentId);
    res.json({ success: true, data: { documents } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Search documents
router.get('/search/query', auth, [
  query('q').isString().notEmpty(),
], async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const documents = await DocumentService.searchDocuments(query);
    res.json({ success: true, data: { documents } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get expiring documents
router.get('/expiring/list', auth, [
  query('days').optional().isInt({ min: 1 }).toInt(),
], async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const documents = await DocumentService.getExpiringDocuments(days);
    res.json({ success: true, data: { documents } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get statistics
router.get('/statistics/overview', auth, async (req: Request, res: Response) => {
  try {
    const statistics = await DocumentService.getDocumentStatistics();
    res.json({ success: true, data: statistics });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get document categories
router.get('/categories', auth, async (req: Request, res: Response) => {
  try {
    const categories = await DocumentService.getDocumentCategories();
    res.json({ success: true, data: { categories } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Bulk delete documents
router.post('/bulk-delete', auth, [
  body('documentIds').isArray({ min: 1 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const deletedBy = (req).user?.userId;
    if (!deletedBy) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await DocumentService.bulkDeleteDocuments(req.body.documentIds, deletedBy);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Share document
router.post('/:id/share', auth, [
  param('id').isString(),
  body('sharedWith').isArray({ min: 1 }),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const sharedBy = (req).user?.userId;
    if (!sharedBy) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await DocumentService.shareDocument(
      req.params.id,
      sharedBy,
      req.body.sharedWith
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Archive expired documents
router.post('/archive-expired', auth, async (req: Request, res: Response) => {
  try {
    const result = await DocumentService.archiveExpiredDocuments();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get document audit trail
router.get('/:id/audit-trail', auth, [
  param('id').isString(),
  query('limit').optional().isInt({ min: 1, max: 500 }).toInt(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const limit = parseInt(req.query.limit as string) || 100;
    const auditTrail = await DocumentService.getDocumentAuditTrail(req.params.id, limit);
    res.json({ success: true, data: { auditTrail } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

// Get document signatures
router.get('/:id/signatures', auth, [
  param('id').isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const signatures = await DocumentService.getDocumentSignatures(req.params.id);
    res.json({ success: true, data: { signatures } });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
});

export default router;
