/**
 * WC-MID-AUS-044 | Sequelize-Based Authentication Middleware & JWT Token Management
 * Purpose: JWT authentication for Hapi.js and Express, Sequelize user validation
 * Upstream: database/models/core/User, constants/JWT_CONFIG, constants/ENVIRONMENT
 * Downstream: routes/auth-sequelize.ts, index-sequelize.ts | Called by: Hapi auth strategy
 * Related: middleware/auth.ts, routes/auth.ts, database/models/core/User.ts
 * Exports: configureAuth, authMiddleware, auth, AuthRequest, ExpressAuthRequest
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, @hapi/jwt, express, sequelize
 * Critical Path: JWT decode → User lookup → Role validation → Request authorization
 * LLM Context: Alternative auth implementation using Sequelize ORM for user validation
 */

import { Server, Request as HapiRequest, ResponseToolkit } from '@hapi/hapi';
import { Request, Response, NextFunction } from 'express';
import * as jwt from '@hapi/jwt';
import { User } from '../database/models/core/User';
import { ENVIRONMENT, JWT_CONFIG } from '../constants';

export interface AuthRequest extends HapiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export type ExpressAuthRequest = Request;

export const configureAuth = async (server: Server) => {
  await server.register(jwt);

  const jwtSecret = ENVIRONMENT.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET;

  server.auth.strategy('jwt', 'jwt', {
    keys: jwtSecret,
    verify: {
      aud: JWT_CONFIG.AUDIENCE,
      iss: JWT_CONFIG.ISSUER,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: JWT_CONFIG.MAX_AGE_SEC,
      timeSkewSec: JWT_CONFIG.TIME_SKEW_SEC,
    },
    validate: async (artifacts, _request, _h) => {
      try {
        const decoded = artifacts.decoded;
        const payload = decoded.payload as any;

        // Verify user still exists and is active using Sequelize
        const user = await User.findByPk(payload.userId, {
          attributes: ['id', 'email', 'role', 'isActive'],
        });

        if (!user || !user.isActive) {
          return { isValid: false };
        }

        return {
          isValid: true,
          credentials: {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        console.error('JWT validation error:', error);
        return { isValid: false };
      }
    },
  });

  server.auth.default('jwt');
};

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

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
      return;
    }

    const decoded = jwt.token.decode(token);

    if (!decoded || !decoded.decoded) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid token' },
      });
      return;
    }

    const payload = decoded.decoded.payload as { userId?: string; email?: string; role?: string };

    // Verify user still exists and is active using Sequelize
    const user = await User.findByPk(payload.userId!, {
      attributes: ['id', 'email', 'role', 'isActive'],
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: { message: 'User not found or inactive' },
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Authentication failed' },
    });
  }
};
