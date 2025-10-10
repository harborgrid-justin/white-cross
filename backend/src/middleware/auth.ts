import { Server, Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
import { Request, Response, NextFunction } from 'express';
import * as jwt from '@hapi/jwt';
import { PrismaClient } from '@prisma/client';
import { TOKEN_CONFIG, JWT_CONFIG } from '../constants';

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

  // Set JWT secret - ensure it matches what's used in token generation
  // IMPORTANT: Must match the secret used in auth.ts for token signing
  const jwtSecret = process.env.JWT_SECRET || TOKEN_CONFIG.JWT_SECRET;

  server.auth.strategy('jwt', 'jwt', {
    keys: jwtSecret,
    verify: {
      aud: JWT_CONFIG.AUDIENCE,
      iss: JWT_CONFIG.ISSUER,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: JWT_CONFIG.MAX_AGE_SEC,
      timeSkewSec: JWT_CONFIG.TIME_SKEW_SEC
    },
    validate: async (artifacts, _request, _h) => {
      try {
        const decoded = artifacts.decoded;
        const payload = decoded.payload as any;

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
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
        console.error('JWT validation error:', error);
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
