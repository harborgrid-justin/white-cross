import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import { UserService } from '../services/userService';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Get all users
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: any = {};
    if (req.query.search) filters.search = req.query.search as string;
    if (req.query.role) filters.role = req.query.role as string;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const result = await UserService.getUsers(page, limit, filters);

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

// Get user by ID
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Create new user
router.post('/', [
  auth,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if user has permission to create users (ADMIN or DISTRICT_ADMIN only)
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to create users' }
      });
    }

    const user = await UserService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User already exists with this email') {
      return res.status(409).json({
        success: false,
        error: { message: 'User already exists with this email' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Update user
router.put('/:id', [
  auth,
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('role').optional().isIn(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']),
  body('isActive').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Check if user has permission to update users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role) && req.user!.userId !== id) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to update this user' }
      });
    }

    // Non-admins can only update their own basic info, not role or active status
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role)) {
      delete req.body.role;
      delete req.body.isActive;
    }

    const user = await UserService.updateUser(id, req.body);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    if ((error as Error).message === 'Email address is already in use') {
      return res.status(409).json({
        success: false,
        error: { message: 'Email address is already in use' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Change password
router.post('/:id/change-password', [
  auth,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Users can only change their own password unless they're admin
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role) && req.user!.userId !== id) {
      return res.status(403).json({
        success: false,
        error: { message: 'You can only change your own password' }
      });
    }

    const result = await UserService.changePassword(id, req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    if ((error as Error).message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        error: { message: 'Current password is incorrect' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Reset user password (admin only)
router.post('/:id/reset-password', [
  auth,
  body('newPassword').isLength({ min: 8 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Only admins can reset passwords
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to reset passwords' }
      });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    const result = await UserService.resetUserPassword(id, newPassword);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Deactivate user
router.post('/:id/deactivate', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can deactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to deactivate users' }
      });
    }

    const { id } = req.params;

    // Prevent users from deactivating themselves
    if (req.user!.userId === id) {
      return res.status(400).json({
        success: false,
        error: { message: 'You cannot deactivate your own account' }
      });
    }

    const user = await UserService.deactivateUser(id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Reactivate user
router.post('/:id/reactivate', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can reactivate users
    if (!['ADMIN', 'DISTRICT_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to reactivate users' }
      });
    }

    const { id } = req.params;
    const user = await UserService.reactivateUser(id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if ((error as Error).message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get user statistics
router.get('/statistics/overview', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can view user statistics
    if (!['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions to view user statistics' }
      });
    }

    const stats = await UserService.getUserStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get users by role
router.get('/role/:role', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.params;
    
    if (!['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid role specified' }
      });
    }

    const users = await UserService.getUsersByRole(role as any);

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

// Get available nurses for student assignment
router.get('/nurses/available', auth, async (req: AuthRequest, res: Response) => {
  try {
    const nurses = await UserService.getAvailableNurses();

    res.json({
      success: true,
      data: { nurses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: (error as Error).message }
    });
  }
});

export default router;