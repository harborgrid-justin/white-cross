import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { BudgetService } from '../services/budgetService';

const router = Router();

// Get budget categories
router.get('/categories', auth, async (req: Request, res: Response) => {
  try {
    const fiscalYear = req.query.fiscalYear ? parseInt(req.query.fiscalYear as string) : undefined;
    const activeOnly = req.query.activeOnly !== 'false';

    const categories = await BudgetService.getBudgetCategories(fiscalYear, activeOnly);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get budget category by ID
router.get('/categories/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await BudgetService.getBudgetCategoryById(id);

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create budget category
router.post('/categories', [
  auth,
  body('name').notEmpty().trim(),
  body('fiscalYear').isInt({ min: 2000, max: 2100 }),
  body('allocatedAmount').isNumeric()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const category = await BudgetService.createBudgetCategory(req.body);

    res.status(201).json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update budget category
router.put('/categories/:id', [
  auth,
  body('name').optional().trim(),
  body('allocatedAmount').optional().isNumeric(),
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
    const category = await BudgetService.updateBudgetCategory(id, req.body);

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get budget summary
router.get('/summary', auth, async (req: Request, res: Response) => {
  try {
    const fiscalYear = req.query.fiscalYear ? parseInt(req.query.fiscalYear as string) : undefined;
    const summary = await BudgetService.getBudgetSummary(fiscalYear);

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get budget transactions
router.get('/transactions', auth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.categoryId) filters.categoryId = req.query.categoryId as string;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const result = await BudgetService.getBudgetTransactions(page, limit, filters);

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

// Create budget transaction
router.post('/transactions', [
  auth,
  body('categoryId').notEmpty(),
  body('amount').isNumeric(),
  body('description').notEmpty().trim()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const transaction = await BudgetService.createBudgetTransaction(req.body);

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

// Get spending trends
router.get('/trends', auth, async (req: Request, res: Response) => {
  try {
    const fiscalYear = req.query.fiscalYear ? parseInt(req.query.fiscalYear as string) : undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const trends = await BudgetService.getSpendingTrends(fiscalYear, categoryId);

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;
