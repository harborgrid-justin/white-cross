import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import * as jwt from '@hapi/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

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

// Middleware function for routes that need authentication
export const authMiddleware = (request: AuthRequest, h: ResponseToolkit) => {
  const user = request.auth.credentials;

  if (!user) {
    throw new Error('Authentication required');
  }

  request.user = user as any;
  return h.continue;
};
