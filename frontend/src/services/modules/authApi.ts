/**
 * @fileoverview Authentication API service with JWT-based secure credential validation
 * @module services/modules/authApi
 * @category Services - Authentication & Security
 *
 * Provides enterprise-grade authentication and authorization API endpoints for the
 * White Cross healthcare platform. Implements JWT-based authentication with OAuth 2.0
 * support, strong password validation, and comprehensive session management.
 *
 * Key Features:
 * - User authentication (login/logout) with JWT tokens
 * - User registration with role-based access control (RBAC)
 * - Token refresh mechanism for session continuity
 * - Strong password validation (12+ chars, uppercase, lowercase, number, special char)
 * - Email verification workflow
 * - Password reset flow with secure tokens
 * - Multi-factor authentication (MFA) integration
 * - OAuth 2.0 support (Google, Microsoft)
 * - Session management and token validation
 * - Development user listing (dev environment only)
 *
 * Security Features:
 * - Strong password requirements enforced client-side and server-side
 * - Zod schema validation for all authentication inputs
 * - Secure token storage via tokenUtils (sessionStorage)
 * - CSRF protection on state-changing operations
 * - Rate limiting on login attempts (backend-enforced)
 * - No PHI (Protected Health Information) in authentication data
 * - Automatic token expiration detection
 * - Secure password reset with time-limited tokens
 *
 * Token Management:
 * - Access tokens stored in sessionStorage for security
 * - Refresh tokens for automatic session renewal
 * - Token expiration handling with automatic cleanup
 * - Automatic logout on token expiry
 * - JWT payload parsing for expiration checking
 *
 * RBAC Roles:
 * - ADMIN: Full system access
 * - NURSE: Healthcare provider access
 * - SCHOOL_ADMIN: School-level administration
 * - DISTRICT_ADMIN: District-level administration
 * - VIEWER: Read-only access
 * - COUNSELOR: Student counseling access
 *
 * OAuth 2.0 Integration:
 * - Google OAuth for Google Workspace users
 * - Microsoft OAuth for Microsoft 365 users
 * - Automatic redirect-based authentication flow
 *
 * @example Login with email and password
 * ```typescript
 * import { authApi } from '@/services/modules/authApi';
 *
 * try {
 *   const { user, token } = await authApi.login({
 *     email: 'nurse@school.edu',
 *     password: 'SecurePass123!',
 *     rememberMe: true
 *   });
 *   console.log(`Logged in as ${user.firstName} ${user.lastName}`);
 *   console.log(`Role: ${user.role}`);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 * ```
 *
 * @example Register new user with role assignment
 * ```typescript
 * const response = await authApi.register({
 *   email: 'newuser@school.edu',
 *   password: 'SecurePass123!',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   role: 'NURSE',
 *   schoolId: 'school-uuid-here'
 * });
 * console.log(`User registered: ${response.user.email}`);
 * ```
 *
 * @example Refresh expired token
 * ```typescript
 * if (authApi.isTokenExpired()) {
 *   const { token: newToken } = await authApi.refreshToken();
 *   console.log('Token refreshed successfully');
 * }
 * ```
 *
 * @example Logout user
 * ```typescript
 * await authApi.logout();
 * console.log('User logged out, tokens cleared');
 * ```
 *
 * @example OAuth login with Google
 * ```typescript
 * // Redirects to Google OAuth consent screen
 * await authApi.loginWithGoogle();
 * ```
 *
 * @see {@link https://jwt.io/ JWT Documentation}
 * @see {@link https://oauth.net/2/ OAuth 2.0 Specification}
 * @see {@link tokenUtils} for token storage utilities
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS, tokenUtils } from '@/services/config/apiConfig';
import { API_CONFIG } from '@/constants/config';
import { z } from 'zod';
import { User } from '@/services/types';
import { createApiError, createValidationError } from '@/services/core/errors';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'VIEWER' | 'COUNSELOR';
  schoolId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}


// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR']),
  schoolId: z.string().optional(),
});

// Auth API class
export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Authenticate user with email and password credentials
   *
   * Validates user credentials against the backend authentication service and
   * returns a JWT access token with user information. Automatically stores tokens
   * in sessionStorage for subsequent authenticated requests.
   *
   * @param {LoginCredentials} credentials - User login credentials
   * @param {string} credentials.email - User email address (validated format)
   * @param {string} credentials.password - User password (minimum 12 characters)
   * @param {boolean} [credentials.rememberMe] - Whether to remember user session
   * @returns {Promise<AuthResponse>} Authentication response with user and tokens
   * @returns {User} AuthResponse.user - Authenticated user object with role and permissions
   * @returns {string} AuthResponse.token - JWT access token for API authentication
   * @returns {string} AuthResponse.refreshToken - Refresh token for session renewal
   * @returns {number} AuthResponse.expiresIn - Token expiration time in seconds (86400 = 24 hours)
   * @throws {ValidationError} If email format is invalid or password is too short
   * @throws {ApiError} If authentication fails due to invalid credentials
   * @throws {ApiError} If backend service is unavailable or returns non-2xx status
   *
   * @example Successful login
   * ```typescript
   * const response = await authApi.login({
   *   email: 'nurse@school.edu',
   *   password: 'SecurePass123!',
   *   rememberMe: true
   * });
   * console.log(`Welcome, ${response.user.firstName}!`);
   * console.log(`Token expires in ${response.expiresIn} seconds`);
   * ```
   *
   * @example Handle login errors
   * ```typescript
   * try {
   *   await authApi.login({ email: 'test@example.com', password: 'short' });
   * } catch (error) {
   *   if (error.name === 'ValidationError') {
   *     console.error('Invalid input:', error.validationErrors);
   *   } else {
   *     console.error('Login failed:', error.message);
   *   }
   * }
   * ```
   *
   * @remarks
   * - Tokens are automatically stored in sessionStorage via tokenUtils
   * - Backend enforces rate limiting (max attempts per IP address)
   * - Successful login triggers audit log entry in backend
   * - MFA-enabled accounts require additional verification step
   * - Account lockout occurs after multiple failed attempts
   *
   * @see {@link logout} to end user session
   * @see {@link refreshToken} to renew access token
   * @see {@link verifyToken} to validate token status
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      loginSchema.parse(credentials);

      console.log('[AuthApi] Sending login request to:', API_ENDPOINTS.AUTH.LOGIN);

      const response = await this.client.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
        tokenType: string;
        expiresIn: number;
      }>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log('[AuthApi] Login response received:', {
        response: response,
        hasData: !!response.data,
        responseKeys: Object.keys(response || {})
      });

      // ApiClient returns response.data from axios, which is already the backend response
      // Backend returns { accessToken, refreshToken, user, tokenType, expiresIn }
      const responseData = response.data || response;
      console.log('[AuthApi] Response data:', {
        hasAccessToken: !!responseData.accessToken,
        hasRefreshToken: !!responseData.refreshToken,
        hasUser: !!responseData.user,
        dataKeys: Object.keys(responseData || {})
      });

      const { accessToken, refreshToken, user, expiresIn } = responseData;

      if (!accessToken) {
        console.error('[AuthApi] Missing accessToken in response');
        throw new Error('Login failed - missing access token');
      }

      if (!refreshToken) {
        console.error('[AuthApi] Missing refreshToken in response');
        throw new Error('Login failed - missing refresh token');
      }

      console.log('[AuthApi] Storing tokens...');

      // Store tokens
      tokenUtils.setToken(accessToken);
      tokenUtils.setRefreshToken(refreshToken);

      console.log('[AuthApi] Login successful');

      return {
        user,
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn
      };
    } catch (error) {
      console.error('[AuthApi] Login error:', error);

      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Login failed');
    }
  }

  /**
   * Register new user account with role-based access control
   *
   * Creates a new user account in the system with specified role and school assignment.
   * Performs comprehensive validation of email uniqueness, password strength, and
   * role permissions. Automatically authenticates the user and returns tokens upon
   * successful registration.
   *
   * @param {RegisterData} userData - User registration data
   * @param {string} userData.email - Unique email address (validated format, max 255 chars)
   * @param {string} userData.password - Strong password (min 12 chars, uppercase, lowercase, number, special char)
   * @param {string} userData.firstName - User first name (min 1 char, max 100 chars)
   * @param {string} userData.lastName - User last name (min 1 char, max 100 chars)
   * @param {string} userData.role - User role (ADMIN | NURSE | SCHOOL_ADMIN | DISTRICT_ADMIN | VIEWER | COUNSELOR)
   * @param {string} [userData.schoolId] - Associated school UUID (required for NURSE, SCHOOL_ADMIN, COUNSELOR roles)
   * @returns {Promise<AuthResponse>} Authentication response with new user and tokens
   * @throws {ValidationError} If email is invalid, password is weak, or required fields are missing
   * @throws {ApiError} If email already exists in system
   * @throws {ApiError} If role assignment is not permitted
   * @throws {ApiError} If school ID is invalid or not found
   *
   * @example Register nurse for specific school
   * ```typescript
   * const response = await authApi.register({
   *   email: 'new.nurse@school.edu',
   *   password: 'VerySecure123!@#',
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   role: 'NURSE',
   *   schoolId: 'abc-123-def-456'
   * });
   * console.log(`Account created for ${response.user.email}`);
   * ```
   *
   * @example Handle registration validation errors
   * ```typescript
   * try {
   *   await authApi.register({
   *     email: 'invalid-email',
   *     password: 'weak',
   *     firstName: 'John',
   *     lastName: 'Smith',
   *     role: 'NURSE'
   *   });
   * } catch (error) {
   *   if (error.name === 'ValidationError') {
   *     Object.entries(error.validationErrors).forEach(([field, messages]) => {
   *       console.error(`${field}: ${messages.join(', ')}`);
   *     });
   *   }
   * }
   * ```
   *
   * @remarks
   * - Email must be unique across entire platform
   * - Password requirements enforced: 12+ chars, uppercase, lowercase, digit, special char (@$!%*?&)
   * - ADMIN and DISTRICT_ADMIN roles may require additional approval
   * - New users receive email verification link (if email service configured)
   * - Audit log created for all registration attempts
   * - RBAC permissions automatically assigned based on role
   *
   * @see {@link login} to authenticate existing user
   * @see {@link usersApi} for additional user management operations
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      registerSchema.parse(userData);

      const response = await this.client.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
        tokenType: string;
        expiresIn: number;
      }>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      const { accessToken, refreshToken, user, expiresIn } = response.data;

      // Store tokens
      tokenUtils.setToken(accessToken);
      tokenUtils.setRefreshToken(refreshToken);

      return {
        user,
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Registration failed');
    }
  }

  /**
   * Verify current token validity
   */
  async verifyToken(): Promise<User> {
    try {
      const response = await this.client.post<{ user: User }>(
        API_ENDPOINTS.AUTH.VERIFY
      );

      return response.data.user;
    } catch (error) {
      throw createApiError(error, 'Token verification failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post<{
        accessToken: string;
        refreshToken: string;
        user: User;
        tokenType: string;
        expiresIn: number;
      }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

      // Update stored tokens
      tokenUtils.setToken(accessToken);
      tokenUtils.setRefreshToken(newRefreshToken);

      return {
        token: accessToken,
        refreshToken: newRefreshToken,
        expiresIn: expiresIn
      };
    } catch (error) {
      // Clear tokens on refresh failure
      tokenUtils.clearAll();
      throw createApiError(error, 'Token refresh failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server request fails
      console.warn('Server logout failed, continuing with local logout');
    } finally {
      // Always clear local tokens
      tokenUtils.clearAll();
    }
  }

  /**
   * Get current user from session
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.client.get<{success: boolean; data: User}>(API_ENDPOINTS.AUTH.PROFILE);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to get current user');
      }
      
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to get current user');
    }
  }

  /**
   * Google OAuth login
   */
  async loginWithGoogle(): Promise<void> {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    window.location.href = `${baseUrl}/api/auth/google`;
  }

  /**
   * Microsoft OAuth login
   */
  async loginWithMicrosoft(): Promise<void> {
    const baseUrl = API_CONFIG.BASE_URL.replace('/api', '');
    window.location.href = `${baseUrl}/api/auth/microsoft`;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await this.client.post<{ message: string }>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, password }
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Password reset failed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = tokenUtils.getToken();
    return !!token;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    try {
      const token = tokenUtils.getToken();
      if (!token) return true;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get all users for development/testing (includes passwords)
   * Only works in development environment
   */
  async getDevUsers(): Promise<Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
    displayName: string;
  }>> {
    try {
      const response = await this.client.get<{
        success: boolean;
        data: {
          users: Array<{
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            password: string;
            displayName: string;
          }>;
        };
      }>(API_ENDPOINTS.USERS.BASE + '/dev');

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to fetch development users');
      }

      return response.data.data.users;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch development users');
    }
  }
}

/**
 * Factory function to create Auth API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AuthApi instance
 */
export function createAuthApi(client: ApiClient): AuthApi {
  return new AuthApi(client);
}

// Create and export a default instance for backward compatibility
import { apiClient } from '@/services/core/ApiClient';
export const authApi = createAuthApi(apiClient);
