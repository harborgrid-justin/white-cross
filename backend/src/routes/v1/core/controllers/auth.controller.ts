/**
 * Authentication Controller
 * Business logic for user authentication operations
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

export class AuthController {
  /**
   * Register a new user
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
   * Login user and generate JWT token
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
   * Verify JWT token validity
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
      const roleMap: Record<string, string> = {
        'admin@school.edu': 'ADMIN',
        'nurse@school.edu': 'NURSE',
        'counselor@school.edu': 'SCHOOL_ADMIN',
        'readonly@school.edu': 'NURSE',
        'doctor@school.edu': 'DOCTOR'
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
        role: roleMap[email] || 'NURSE',
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
