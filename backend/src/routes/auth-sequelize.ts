/**
 * LOC: 3315E3BD39
 * WC-RTE-AUTH-028 | Authentication API Routes with Sequelize Integration
 *
 * UPSTREAM (imports from):
 *   - User.ts (database/models/core/User.ts)
 *   - index.ts (constants/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index-sequelize.ts (index-sequelize.ts)
 */

/**
 * WC-RTE-AUTH-028 | Authentication API Routes with Sequelize Integration
 * Purpose: Core authentication system with user registration, login, JWT token management, and role-based access control using Sequelize ORM
 * Upstream: ../database/models/core/User, ../constants, JWT configuration | Dependencies: @hapi/hapi, Sequelize User model, bcryptjs, jsonwebtoken, joi
 * Downstream: All authenticated routes, frontend login/registration, session management | Called by: Login forms, registration components, token verification
 * Related: User management routes, access control, audit logging, session management
 * Exports: authRoutes (3 Hapi route handlers) | Key Services: User registration, authentication, JWT token verification
 * Last Updated: 2025-10-18 | File Type: .ts | Security: Password hashing with bcrypt, JWT tokens, role validation, account status checks
 * Critical Path: Credential validation → Password verification → JWT generation → User session establishment → Role-based authorization
 * LLM Context: Healthcare system authentication with role hierarchy (ADMIN > DISTRICT_ADMIN > SCHOOL_ADMIN > NURSE/COUNSELOR > VIEWER), secure password handling, JWT-based sessions, and account activation status for protecting access to sensitive medical data
 */

import { ServerRoute } from '@hapi/hapi';
import { User } from '../database/models/core/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { ENVIRONMENT, JWT_CONFIG } from '../constants';

const registerHandler = async (request: any, h: any) => {
  try {
    const { email, password, firstName, lastName, role } = request.payload;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return h
        .response({
          success: false,
          error: { message: 'User already exists with this email' },
        })
        .code(409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    const safeUser = user.toSafeObject();

    return h
      .response({
        success: true,
        data: { user: safeUser },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        success: false,
        error: { message: 'Internal server error' },
      })
      .code(500);
  }
};

const loginHandler = async (request: any, h: any) => {
  try {
    const { email, password } = request.payload;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return h
        .response({
          success: false,
          error: { message: 'Invalid credentials' },
        })
        .code(401);
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return h
        .response({
          success: false,
          error: { message: 'Invalid credentials' },
        })
        .code(401);
    }

    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        aud: JWT_CONFIG.AUDIENCE,
        iss: JWT_CONFIG.ISSUER,
      },
      (ENVIRONMENT.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET) as string,
      {
        expiresIn: '24h',
      }
    );

    const safeUser = user.toSafeObject();

    return h.response({
      success: true,
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error) {
    return h
      .response({
        success: false,
        error: { message: 'Internal server error' },
      })
      .code(500);
  }
};

const verifyHandler = async (request: any, h: any) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return h
        .response({
          success: false,
          error: { message: 'Access token required' },
        })
        .code(401);
    }

    const decoded = jwt.verify(token, (ENVIRONMENT.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET) as string) as jwt.JwtPayload & {
      userId: string;
    };

    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive'],
    });

    if (!user || !user.isActive) {
      return h
        .response({
          success: false,
          error: { message: 'User not found or inactive' },
        })
        .code(401);
    }

    return h.response({
      success: true,
      data: user.toSafeObject(),
    });
  } catch (error) {
    return h
      .response({
        success: false,
        error: { message: 'Invalid or expired token' },
      })
      .code(401);
  }
};

export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: registerHandler,
    options: {
      auth: false,
      tags: ['api', 'Authentication'],
      description: 'Register a new user',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          firstName: Joi.string().trim().required(),
          lastName: Joi.string().trim().required(),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').required(),
        }),
      },
    },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: loginHandler,
    options: {
      auth: false,
      tags: ['api', 'Authentication'],
      description: 'User login',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/api/auth/verify',
    handler: verifyHandler,
    options: {
      auth: false,
      tags: ['api', 'Authentication'],
      description: 'Verify JWT token',
    },
  },
];
