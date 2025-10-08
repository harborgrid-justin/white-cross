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
        role: user.role,
        aud: 'urn:audience:api',
        iss: 'urn:issuer:api'
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { userId: string };

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
      auth: false,
      tags: ['api', 'Authentication'],
      description: 'Register a new user',
      notes: 'Creates a new user account with the specified role. Password must be at least 8 characters.',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('User email address'),
          password: Joi.string().min(8).required().description('Password (min 8 characters)'),
          firstName: Joi.string().trim().required().description('User first name'),
          lastName: Joi.string().trim().required().description('User last name'),
          role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN').required().description('User role')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User successfully created',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  user: Joi.object({
                    id: Joi.string().example('user-123'),
                    email: Joi.string().email().example('nurse@school.edu'),
                    firstName: Joi.string().example('Jane'),
                    lastName: Joi.string().example('Smith'),
                    role: Joi.string().example('NURSE'),
                    createdAt: Joi.string().isoDate()
                  })
                })
              })
            },
            '409': {
              description: 'User already exists'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: loginHandler,
    options: {
      auth: false, // Disable auth for login
      tags: ['api', 'Authentication'],
      description: 'User login',
      notes: 'Authenticates a user and returns a JWT token valid for 24 hours. Use this token in the Authorization header for subsequent requests.',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('User email address'),
          password: Joi.string().required().description('User password')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Login successful',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'),
                  user: Joi.object({
                    id: Joi.string().example('user-123'),
                    email: Joi.string().email().example('nurse@school.edu'),
                    firstName: Joi.string().example('Jane'),
                    lastName: Joi.string().example('Smith'),
                    role: Joi.string().example('NURSE')
                  })
                })
              })
            },
            '401': {
              description: 'Invalid credentials or user inactive'
            },
            '500': {
              description: 'Internal server error'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/verify',
    handler: verifyHandler,
    options: {
      auth: false, // Disable auth for token verification
      tags: ['api', 'Authentication'],
      description: 'Verify JWT token',
      notes: 'Validates a JWT token and returns the associated user information. Pass the token in the Authorization header.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token is valid',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  id: Joi.string().example('user-123'),
                  email: Joi.string().email().example('nurse@school.edu'),
                  firstName: Joi.string().example('Jane'),
                  lastName: Joi.string().example('Smith'),
                  role: Joi.string().example('NURSE'),
                  isActive: Joi.boolean().example(true)
                })
              })
            },
            '401': {
              description: 'Invalid, expired, or missing token'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    handler: meHandler,
    options: {
      auth: 'jwt', // Require authentication
      tags: ['api', 'Authentication'],
      description: 'Get current user',
      notes: 'Returns the authenticated user\'s profile information. Requires valid JWT token in Authorization header.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Current user information',
              schema: Joi.object({
                success: Joi.boolean().example(true),
                data: Joi.object({
                  id: Joi.string().example('user-123'),
                  email: Joi.string().email().example('nurse@school.edu'),
                  firstName: Joi.string().example('Jane'),
                  lastName: Joi.string().example('Smith'),
                  role: Joi.string().example('NURSE')
                })
              })
            },
            '401': {
              description: 'Not authenticated or invalid token'
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  }
];
