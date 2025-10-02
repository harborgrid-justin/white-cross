import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { PurchaseOrderService } from '../services/purchaseOrderService';

const router = Router();

// Get purchase orders
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.vendorId) filters.vendorId = req.query.vendorId as string;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const result = await PurchaseOrderService.getPurchaseOrders(page, limit, filters);

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

// Get purchase order by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrderService.getPurchaseOrderById(id);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create purchase order
router.post('/', [
  auth,
  body('vendorId').notEmpty(),
  body('items').isArray({ min: 1 }),
  body('items.*.inventoryItemId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unitCost').isNumeric(),
  body('expectedDate').optional().isISO8601(),
  body('tax').optional().isNumeric(),
  body('shipping').optional().isNumeric()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const orderData = {
      ...req.body,
      expectedDate: req.body.expectedDate ? new Date(req.body.expectedDate) : undefined
    };

    const order = await PurchaseOrderService.createPurchaseOrder(orderData);

    res.status(201).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update purchase order
router.put('/:id', [
  auth,
  body('status').optional().isIn(['PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED']),
  body('expectedDate').optional().isISO8601(),
  body('receivedDate').optional().isISO8601()
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
    const updateData = {
      ...req.body,
      expectedDate: req.body.expectedDate ? new Date(req.body.expectedDate) : undefined,
      receivedDate: req.body.receivedDate ? new Date(req.body.receivedDate) : undefined
    };

    const order = await PurchaseOrderService.updatePurchaseOrder(id, updateData);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Approve purchase order
router.post('/:id/approve', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const approvedBy = (req as any).user.userId; // From auth middleware

    const order = await PurchaseOrderService.approvePurchaseOrder(id, approvedBy);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Receive items
router.post('/:id/receive', [
  auth,
  body('items').isArray({ min: 1 }),
  body('items.*.purchaseOrderItemId').notEmpty(),
  body('items.*.receivedQty').isInt({ min: 1 })
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
    const performedBy = (req as any).user.userId;

    const order = await PurchaseOrderService.receiveItems(id, req.body, performedBy);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Cancel purchase order
router.post('/:id/cancel', [
  auth,
  body('reason').optional().trim()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await PurchaseOrderService.cancelPurchaseOrder(id, reason);

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get items needing reorder
router.get('/reorder/needed', auth, async (_req: Request, res: Response) => {
  try {
    const items = await PurchaseOrderService.getItemsNeedingReorder();

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
