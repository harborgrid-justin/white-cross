/**
 * @fileoverview Authentication Controller
 *
 * Business logic for user authentication operations including registration,
 * login, token management, and profile retrieval. Implements secure authentication
 * patterns with JWT tokens, bcrypt password hashing, and comprehensive error handling.
 *
 * @module routes/v1/core/controllers/auth.controller
 * @requires User
 * @requires jwtUtils
 * @requires @hapi/hapi
 * @since 1.0.0
 */

import { User } from '../../../../database/models/core/User';
import { hashPassword, comparePassword } from '../../../../shared';
import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../../utils/jwtUtils';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import { ResponseToolkit } from '@hapi/hapi';
import {
  successResponse,
  createdResponse,
  errorResponse,
  unauthorizedResponse,
  conflictResponse
} from '../../../shared/utils';
import { UserRole } from '../../../../database/types/enums';

/**
 * Authentication controller class.
 *
 * Provides static methods for handling authentication operations.
 * All methods are async and return Hapi response objects.
 *
 * @class AuthController
 */
export class AuthController {
  /**
   * Registers a new user account.
   *
   * Creates a new user with hashed password and returns the user object
   * (excluding password). Checks for duplicate email addresses before creation.
   *
   * @route POST /api/v1/auth/register
   * @authentication None - Public endpoint
   *
   * @param {Request} request - Hapi request with registration payload
   * @param {string} request.payload.email - User email address (unique)
   * @param {string} request.payload.password - Password (min 8 chars, will be hashed)
   * @param {string} request.payload.firstName - User first name
   * @param {string} request.payload.lastName - User last name
   * @param {string} request.payload.role - User role (ADMIN, NURSE, etc.)
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 201 with user object or error response
   * @throws {Boom.conflict} When email already exists (409)
   * @throws {Boom.badRequest} When validation fails (400)
   *
   * @example
   * ```typescript
   * // Request payload
   * {
   *   email: "nurse@school.edu",
   *   password: "SecurePass123",
   *   firstName: "Jane",
   *   lastName: "Smith",
   *   role: "NURSE"
   * }
   *
   * // Response (201)
   * {
   *   success: true,
   *   data: {
   *     user: {
   *       id: "uuid",
   *       email: "nurse@school.edu",
   *       firstName: "Jane",
   *       lastName: "Smith",
   *       role: "NURSE",
   *       isActive: true
   *     }
   *   }
   * }
   * ```
   */
  static async register(request: any, h: ResponseToolkit) {
    const { email, password, firstName, lastName, role } = request.payload;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return conflictResponse(h, 'User already exists with this email');
    }

    // Create user (password will be hashed by beforeCreate hook)
    const user = await User.create({
      email,
      password, // Don't hash here - let the User model hook handle it
      firstName,
      lastName,
      role
    });

    // Return safe user object (excludes password)
    return createdResponse(h, { user: user.toSafeObject() });
  }

  /**
   * Authenticates user credentials and generates JWT token.
   *
   * Validates email and password, checks account status, and returns
   * a JWT token valid for 24 hours along with the user profile.
   *
   * @route POST /api/v1/auth/login
   * @authentication None - Public endpoint
   *
   * @param {Request} request - Hapi request with login credentials
   * @param {string} request.payload.email - User email address
   * @param {string} request.payload.password - User password
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 200 with token and user or error response
   * @throws {Boom.unauthorized} When credentials are invalid or account inactive (401)
   * @throws {Boom.badRequest} When validation fails (400)
   *
   * @example
   * ```typescript
   * // Request payload
   * {
   *   email: "nurse@school.edu",
   *   password: "SecurePass123"
   * }
   *
   * // Response (200)
   * {
   *   success: true,
   *   data: {
   *     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *     user: { id: "uuid", email: "...", role: "NURSE", ... }
   *   }
   * }
   * ```
   */
  static async login(request: any, h: ResponseToolkit) {
    const { email, password } = request.payload;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      return unauthorizedResponse(h, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return unauthorizedResponse(h, 'Invalid credentials');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    });

    return successResponse(h, {
      token,
      user: user.toSafeObject()
    });
  }

  /**
   * Verifies JWT token validity and returns associated user.
   *
   * Validates token signature, expiration, and user account status.
   * Does not generate a new token - use refresh endpoint for that.
   *
   * @route POST /api/v1/auth/verify
   * @authentication None - Token validated from Authorization header
   *
   * @param {Request} request - Hapi request with Authorization header
   * @param {string} request.headers.authorization - Bearer token
   * @param {ResponseToolkit} h - Hapi response toolkit
   *
   * @returns {Promise<ResponseObject>} 200 with user object or error response
   * @throws {Boom.unauthorized} When token is invalid, expired, or user inactive (401)
   *
   * @example
   * ```typescript
   * // Request
   * GET /api/v1/auth/verify
   * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *
   * // Response (200)
   * {
   *   success: true,
   *   data: { id: "uuid", email: "...", role: "NURSE", ... }
   * }
   * ```
   */
  static async verify(request: any, h: ResponseToolkit) {
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return unauthorizedResponse(h, 'Access token required');
    }

    try {
      const decoded = verifyAccessToken(token);

      // Verify user still exists and is active
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
      });

      if (!user || !user.isActive) {
        return unauthorizedResponse(h, 'User not found or inactive');
      }

      return successResponse(h, user.toSafeObject());
    } catch (error) {
      return unauthorizedResponse(h, 'Invalid or expired token');
    }
  }

  /**
   * Refresh JWT token
   */
  static async refresh(request: any, h: ResponseToolkit) {
    const authHeader = request.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return unauthorizedResponse(h, 'Refresh token required');
    }

    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(token);

      if (!decoded || !decoded.id) {
        return unauthorizedResponse(h, 'Invalid token format');
      }

      // Verify user still exists and is active
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
      });

      if (!user || !user.isActive) {
        return unauthorizedResponse(h, 'User not found or inactive');
      }

      // Generate new access token
      const newToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      });

      return successResponse(h, {
        token: newToken,
        user: user.toSafeObject()
      });
    } catch (error) {
      return errorResponse(h, 'Failed to refresh token', 500);
    }
  }

  /**
   * Get current authenticated user
   */
  static async me(request: AuthenticatedRequest, h: ResponseToolkit) {
    const user = request.auth.credentials;

    if (user) {
      return successResponse(h, user);
    } else {
      return unauthorizedResponse(h, 'Not authenticated');
    }
  }

  /**
   * Test login endpoint for E2E testing
   * Only available in test/development environments
   * Allows quick login with predefined test users
   */
  static async testLogin(request: any, h: ResponseToolkit) {
    // Only allow in test/development environments
    if (process.env.NODE_ENV === 'production') {
      return unauthorizedResponse(h, 'Test login not available in production');
    }

    const { role } = request.query;

    // Map role to test user email
    const testUserMap: Record<string, string> = {
      'admin': 'admin@school.edu',
      'nurse': 'nurse@school.edu',
      'counselor': 'counselor@school.edu',
      'viewer': 'readonly@school.edu',
      'doctor': 'doctor@school.edu'
    };

    const email = testUserMap[role?.toLowerCase()] || testUserMap['nurse'];

    // Find or create test user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create test user if it doesn't exist
      const roleMap: Record<string, UserRole> = {
        'admin@school.edu': UserRole.ADMIN,
        'nurse@school.edu': UserRole.NURSE,
        'counselor@school.edu': UserRole.SCHOOL_ADMIN,
        'readonly@school.edu': UserRole.NURSE,
        'doctor@school.edu': UserRole.NURSE // DOCTOR is not a valid UserRole, using NURSE
      };

      const nameMap: Record<string, { firstName: string, lastName: string }> = {
        'admin@school.edu': { firstName: 'Test', lastName: 'Administrator' },
        'nurse@school.edu': { firstName: 'Test', lastName: 'Nurse' },
        'counselor@school.edu': { firstName: 'Test', lastName: 'Counselor' },
        'readonly@school.edu': { firstName: 'Test', lastName: 'ReadOnly' },
        'doctor@school.edu': { firstName: 'Test', lastName: 'Johnson' }
      };

      user = await User.create({
        email,
        password: 'TestPassword123!', // Standard test password
        firstName: nameMap[email]?.firstName || 'Test',
        lastName: nameMap[email]?.lastName || 'User',
        role: roleMap[email] || UserRole.NURSE,
        isActive: true
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token
    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'access'
    });

    return successResponse(h, {
      token,
      user: user.toSafeObject()
    });
  }
}
