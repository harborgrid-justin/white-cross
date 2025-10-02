import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { VendorService } from '../services/vendorService';

const router = Router();

// Get all vendors
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const activeOnly = req.query.activeOnly !== 'false';

    const result = await VendorService.getVendors(page, limit, activeOnly);

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

// Get vendor by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await VendorService.getVendorById(id);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create vendor
router.post('/', [
  auth,
  body('name').notEmpty().trim(),
  body('email').optional().isEmail(),
  body('rating').optional().isInt({ min: 1, max: 5 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const vendor = await VendorService.createVendor(req.body);

    res.status(201).json({
      success: true,
      data: { vendor }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update vendor
router.put('/:id', [
  auth,
  body('name').optional().trim(),
  body('email').optional().isEmail(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
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
    const vendor = await VendorService.updateVendor(id, req.body);

    res.json({
      success: true,
      data: { vendor }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Compare vendors for an item
router.get('/compare/:itemName', auth, async (req: Request, res: Response) => {
  try {
    const { itemName } = req.params;
    const comparison = await VendorService.compareVendors(itemName);

    res.json({
      success: true,
      data: { comparison }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Search vendors
router.get('/search/:query', auth, async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    const vendors = await VendorService.searchVendors(query, limit);

    res.json({
      success: true,
      data: { vendors }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;
