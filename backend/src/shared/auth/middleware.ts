/**
 * Authentication Middleware
 * Shared authentication utilities and middleware functions
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from '@hapi/jwt';
import { logger } from '../logging/logger';

// Express-specific AuthRequest type
export interface ExpressAuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Express middleware function for routes that need authentication (for legacy routes)
 */
export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    // Verify token (simplified - in production use proper JWT verification)
    const decoded = jwt.token.decode(token);
    
    if (!decoded || !decoded.decoded) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid token' }
      });
      return;
    }

    const payload = decoded.decoded.payload as { userId?: string; email?: string; role?: string };

    // In a real implementation, you would verify user still exists and is active
    if (!payload.userId || !payload.email || !payload.role) {
      res.status(401).json({
        success: false,
        error: { message: 'User not found or inactive' }
      });
      return;
    }

    (req as ExpressAuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
    
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Authentication failed' }
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as ExpressAuthRequest).user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
      return;
    }

    next();
  };
};

export default {
  auth,
  requireRole
};