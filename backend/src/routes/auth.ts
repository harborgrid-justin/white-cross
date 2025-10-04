import { ServerRoute } from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const prisma = new PrismaClient();

// Register endpoint
const registerHandler = async (request: any, h: any) => {
  try {
    const { email, password, firstName, lastName, role } = request.payload;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return h.response({
        success: false,
        error: { message: 'User already exists with this email' }
      }).code(409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    return h.response({
      success: true,
      data: { user }
    }).code(201);

  } catch (error) {
    return h.response({
      success: false,
      error: { message: 'Internal server error' }
    }).code(500);
  }
};

// Login endpoint
const loginHandler = async (request: any, h: any) => {
  try {
    const { email, password } = request.payload;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      return h.response({
        success: false,
        error: { message: 'Invalid credentials' }
      }).code(401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return h.response({
        success: false,
        error: { message: 'Invalid credentials' }
      }).code(401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT for API access
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h'
      }
    );

    return h.response({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });

  } catch (error) {
    return h.response({
      success: false,
      error: { message: 'Internal server error' }
    }).code(500);
  }
};

// Verify token endpoint
const verifyHandler = async (request: any, h: any) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return h.response({
        success: false,
        error: { message: 'Access token required' }
      }).code(401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return h.response({
        success: false,
        error: { message: 'User not found or inactive' }
      }).code(401);
    }

    return h.response({
      success: true,
      data: user
    });

  } catch (error) {
    return h.response({
      success: false,
      error: { message: 'Invalid or expired token' }
    }).code(401);
  }
};

// Get current user endpoint
const meHandler = async (request: any, h: any) => {
  const user = request.auth.credentials;

  if (user) {
    return h.response({
      success: true,
      data: user
    });
  } else {
    return h.response({
      success: false,
      error: { message: 'Not authenticated' }
    }).code(401);
  }
};

// Define auth routes for Hapi
export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: registerHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          firstName: Joi.string().trim().required(),
          lastName: Joi.string().trim().required(),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN').required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: loginHandler,
    options: {
      auth: false, // Disable auth for login
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/verify',
    handler: verifyHandler,
    options: {
      auth: false // Disable auth for token verification
    }
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    handler: meHandler,
    options: {
      auth: 'jwt' // Require authentication
    }
  }
];
