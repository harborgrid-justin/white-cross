import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { InventoryService } from '../services/inventoryService';

const router = Router();

// Get inventory items
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.supplier) filters.supplier = req.query.supplier as string;
    if (req.query.location) filters.location = req.query.location as string;
    if (req.query.lowStock !== undefined) filters.lowStock = req.query.lowStock === 'true';
    if (req.query.needsMaintenance !== undefined) filters.needsMaintenance = req.query.needsMaintenance === 'true';
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const result = await InventoryService.getInventoryItems(page, limit, filters);

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

// Create new inventory item
router.post('/', [
  auth,
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('reorderLevel').isInt({ min: 0 }),
  body('reorderQuantity').isInt({ min: 1 }),
  body('unitCost').optional().isNumeric()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const item = await InventoryService.createInventoryItem(req.body);

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

// Update inventory item
router.put('/:id', [
  auth,
  body('name').optional().trim(),
  body('category').optional().trim(),
  body('reorderLevel').optional().isInt({ min: 0 }),
  body('reorderQuantity').optional().isInt({ min: 1 }),
  body('unitCost').optional().isNumeric(),
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
    const item = await InventoryService.updateInventoryItem(id, req.body);

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

// Create inventory transaction
router.post('/transactions', [
  auth,
  body('inventoryItemId').notEmpty(),
  body('type').isIn(['PURCHASE', 'USAGE', 'ADJUSTMENT', 'TRANSFER', 'DISPOSAL']),
  body('quantity').isInt({ min: 1 }),
  body('unitCost').optional().isNumeric(),
  body('expirationDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const performedBy = (req as any).user.userId; // From auth middleware

    const transaction = await InventoryService.createInventoryTransaction({
      ...req.body,
      performedBy,
      expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : undefined
    });

    res.status(201).json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get current stock for an item
router.get('/:id/stock', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentStock = await InventoryService.getCurrentStock(id);

    res.json({
      success: true,
      data: { currentStock }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get inventory alerts
router.get('/alerts', auth, async (_req: Request, res: Response) => {
  try {
    const alerts = await InventoryService.getInventoryAlerts();

    res.json({
      success: true,
      data: { alerts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create maintenance log
router.post('/maintenance', [
  auth,
  body('inventoryItemId').notEmpty(),
  body('type').isIn(['ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING']),
  body('description').notEmpty().trim(),
  body('cost').optional().isNumeric(),
  body('nextMaintenanceDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const performedBy = (req as any).user.userId; // From auth middleware

    const maintenanceLog = await InventoryService.createMaintenanceLog({
      ...req.body,
      performedBy,
      nextMaintenanceDate: req.body.nextMaintenanceDate ? new Date(req.body.nextMaintenanceDate) : undefined
    });

    res.status(201).json({
      success: true,
      data: { maintenanceLog }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get maintenance schedule
router.get('/maintenance/schedule', auth, async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const schedule = await InventoryService.getMaintenanceSchedule(startDate, endDate);

    res.json({
      success: true,
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Generate purchase order
router.post('/purchase-order', [
  auth,
  body('items').isArray({ min: 1 }),
  body('items.*.inventoryItemId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { items } = req.body;
    const purchaseOrder = await InventoryService.generatePurchaseOrder(items);

    res.json({
      success: true,
      data: { purchaseOrder }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get inventory valuation
router.get('/valuation', auth, async (_req: Request, res: Response) => {
  try {
    const valuation = await InventoryService.getInventoryValuation();

    res.json({
      success: true,
      data: { valuation }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get usage analytics
router.get('/analytics/usage', auth, async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const analytics = await InventoryService.getUsageAnalytics(startDate, endDate);

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get supplier performance
router.get('/analytics/suppliers', auth, async (_req: Request, res: Response) => {
  try {
    const performance = await InventoryService.getSupplierPerformance();

    res.json({
      success: true,
      data: { performance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Search inventory items
router.get('/search/:query', auth, async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const items = await InventoryService.searchInventoryItems(query, limit);

    res.json({
      success: true,
      data: { items }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;