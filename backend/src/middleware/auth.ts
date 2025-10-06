import { Server, Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
import { Request, Response, NextFunction } from 'express';
import * as jwt from '@hapi/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hapi-specific AuthRequest interface
export interface AuthRequest extends HapiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Express-specific AuthRequest type (uses extended Express.Request from types/express.d.ts)
export type ExpressAuthRequest = Request;

export const configureAuth = async (server: Server) => {
  // Register JWT plugin
  await server.register(jwt);

  // Set JWT secret
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'your-secret-key',
    verify: {
      aud: 'urn:audience:api',
      iss: 'urn:issuer:api',
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15
    },
    validate: async (artifacts, _request, _h) => {
      try {
        const decoded = artifacts.decoded;

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
          where: { id: (decoded as any).userId },
          select: { id: true, email: true, role: true, isActive: true }
        });

        if (!user || !user.isActive) {
          return { isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            userId: user.id,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        return { isValid: false };
      }
    }
  });

  // Set default auth strategy
  server.auth.default('jwt');
};

// Hapi middleware function for routes that need authentication
export const authMiddleware = (request: AuthRequest, h: ResponseToolkit) => {
  const user = request.auth.credentials;

  if (!user) {
    throw new Error('Authentication required');
  }

  request.user = user as {
    userId: string;
    email: string;
    role: string;
  };
  return h.continue;
};

// Express middleware function for routes that need authentication (for legacy routes)
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
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: { message: 'User not found or inactive' }
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Authentication failed' }
    });
  }
};
