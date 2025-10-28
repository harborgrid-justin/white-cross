/**
 * @fileoverview Authentication Routes (v1)
 *
 * HTTP route definitions for all authentication endpoints including user registration,
 * login, token verification, token refresh, and profile retrieval. Implements JWT-based
 * authentication with comprehensive Swagger documentation for API consumers.
 *
 * @module routes/v1/core/routes/auth.routes
 * @requires @hapi/hapi
 * @requires joi
 * @see {@link module:routes/v1/core/controllers/auth.controller} for business logic
 * @see {@link module:routes/v1/core/validators/auth.validators} for validation schemas
 * @since 1.0.0
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { asyncHandler } from '../../../shared/utils';

/**
 * User response schema for Swagger documentation.
 *
 * Defines the structure of user objects returned by authentication endpoints.
 * Excludes sensitive fields like password hash.
 *
 * @const {Joi.ObjectSchema}
 * @property {string} id - User UUID
 * @property {string} email - User email address
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} role - User role (ADMIN, NURSE, etc.)
 * @property {boolean} isActive - Account active status
 * @property {string} createdAt - Account creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 */
const UserResponseSchema = Joi.object({
  id: Joi.string().uuid().example('550e8400-e29b-41d4-a716-446655440000').description('User unique identifier (UUID)'),
  email: Joi.string().email().example('nurse@whitecross.health').description('User email address'),
  firstName: Joi.string().example('Sarah').description('User first name'),
  lastName: Joi.string().example('Johnson').description('User last name'),
  role: Joi.string().valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER').example('NURSE').description('User role'),
  isActive: Joi.boolean().example(true).description('Whether the user account is active'),
  createdAt: Joi.string().isoDate().example('2024-01-15T10:30:00.000Z').description('Account creation timestamp'),
  updatedAt: Joi.string().isoDate().example('2024-01-15T10:30:00.000Z').description('Last update timestamp')
}).label('UserObject');

const AuthSuccessResponseSchema = Joi.object({
  success: Joi.boolean().valid(true).example(true).description('Operation success indicator'),
  data: Joi.object({
    token: Joi.string().example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...').description('JWT authentication token (valid for 24 hours)'),
    user: UserResponseSchema
  }).description('Authentication data')
}).label('AuthSuccessResponse');

const RegisterSuccessResponseSchema = Joi.object({
  success: Joi.boolean().valid(true).example(true).description('Operation success indicator'),
  data: Joi.object({
    user: UserResponseSchema
  }).description('Registered user data')
}).label('RegisterSuccessResponse');

const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().valid(false).example(false).description('Operation failure indicator'),
  error: Joi.object({
    message: Joi.string().example('Invalid credentials').description('Error message'),
    code: Joi.string().example('UNAUTHORIZED').description('Error code')
  }).description('Error details')
}).label('ErrorResponse');

/**
 * Authentication route definitions.
 *
 * Complete collection of authentication endpoints for the White Cross platform.
 * All routes return standardized API responses with comprehensive error handling.
 *
 * **Available Endpoints:**
 * - POST /api/v1/auth/register - Create new user account (public)
 * - POST /api/v1/auth/login - Authenticate and receive JWT token (public)
 * - POST /api/v1/auth/verify - Validate JWT token (public)
 * - POST /api/v1/auth/refresh - Refresh JWT token (public)
 * - GET /api/v1/auth/me - Get current user profile (requires auth)
 * - GET /api/v1/auth/test-login - Test login for E2E (dev/test only)
 *
 * **Authentication Strategy:**
 * - JWT tokens with 24-hour expiration
 * - Bearer token format: "Authorization: Bearer <token>"
 * - Passwords hashed with bcrypt (cost factor 10)
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // Register new user
 * POST /api/v1/auth/register
 * Content-Type: application/json
 * {
 *   "email": "nurse@school.edu",
 *   "password": "SecurePass123",
 *   "firstName": "Jane",
 *   "lastName": "Smith",
 *   "role": "NURSE"
 * }
 *
 * // Login and receive token
 * POST /api/v1/auth/login
 * Content-Type: application/json
 * {
 *   "email": "nurse@school.edu",
 *   "password": "SecurePass123"
 * }
 * // Response: { success: true, data: { token: "...", user: {...} } }
 *
 * // Access protected endpoint
 * GET /api/v1/auth/me
 * Authorization: Bearer <token>
 * ```
 */
export const authRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    handler: asyncHandler(AuthController.register),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Register a new user account',
      notes: `Creates a new user account in the White Cross Healthcare Platform.

**Requirements:**
- Unique email address (not already registered)
- Password minimum 8 characters
- Valid role selection
- First name and last name required

**Available Roles:**
- ADMIN: Full system access, user management, system configuration
- DISTRICT_ADMIN: District-wide access, multi-school management
- SCHOOL_ADMIN: School-level administration and reporting
- NURSE: Student health management, medication administration
- COUNSELOR: Student health viewing, limited editing
- VIEWER: Read-only access to assigned students

**Password Requirements:**
- Minimum 8 characters
- Stored using bcrypt hashing (cost factor 10)
- No plaintext storage

**Response:**
Returns the created user object (without password). Does NOT automatically log in - use /login endpoint with credentials.

**Security:**
- Public endpoint (no authentication required)
- Rate limiting applied to prevent abuse
- Email validation and sanitization
- Duplicate email check before creation`,
      validate: {
        payload: registerSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'User registered successfully',
              schema: RegisterSuccessResponseSchema
            },
            '409': {
              description: 'Conflict - User already exists with this email',
              schema: ErrorResponseSchema
            },
            '400': {
              description: 'Validation error - Invalid input data',
              schema: ErrorResponseSchema
            }
          },
          payloadType: 'json',
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    handler: asyncHandler(AuthController.login),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Authenticate user and obtain JWT token',
      notes: `Authenticates user credentials and returns a JWT token for API access.

**Request Body:**
- email: Valid email address
- password: User password

**Authentication Process:**
1. Validates email format and required fields
2. Looks up user by email address
3. Verifies password using bcrypt comparison
4. Checks if user account is active
5. Generates JWT token with 24-hour expiration
6. Returns token and user profile

**JWT Token:**
- Valid for 24 hours from issuance
- Contains user ID and role in payload
- Must be included in Authorization header for protected endpoints
- Format: "Bearer <token>"

**Response:**
Returns authentication token and complete user profile (excluding password).

**Security:**
- Public endpoint (no authentication required)
- Password comparison using bcrypt
- Failed login attempts are logged for security monitoring
- Account lockout after multiple failed attempts (future feature)
- HTTPS required in production

**Error Handling:**
- Returns 401 for invalid credentials (email or password)
- Returns 401 for inactive/disabled accounts
- Returns 400 for validation errors`,
      validate: {
        payload: loginSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Login successful - JWT token generated',
              schema: AuthSuccessResponseSchema
            },
            '401': {
              description: 'Unauthorized - Invalid credentials or inactive account',
              schema: ErrorResponseSchema
            },
            '400': {
              description: 'Bad Request - Validation error',
              schema: ErrorResponseSchema
            }
          },
          payloadType: 'json',
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/verify',
    handler: asyncHandler(AuthController.verify),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Verify JWT token validity',
      notes: `Validates a JWT token and returns decoded user information.

**Use Cases:**
- Frontend token validation on app startup
- Checking if a stored token is still valid
- Verifying token before making authenticated requests
- Session restoration after page reload

**Request:**
Token should be provided in Authorization header as "Bearer <token>"

**Validation Checks:**
1. Token format is valid JWT
2. Token signature is valid (signed with server secret)
3. Token has not expired
4. User account still exists and is active

**Response:**
Returns the user profile associated with the token if valid.

**Security:**
- Does not require authentication (validates token from header)
- Does not generate new token (use /refresh for that)
- Expired tokens return 401 error`,
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token is valid - user profile returned',
              schema: Joi.object({
                success: Joi.boolean().valid(true).example(true),
                data: UserResponseSchema
              }).label('VerifySuccessResponse')
            },
            '401': {
              description: 'Unauthorized - Invalid or expired token',
              schema: ErrorResponseSchema
            }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    handler: asyncHandler(AuthController.refresh),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'v1'],
      description: 'Refresh JWT token',
      notes: `Exchanges an existing valid JWT token for a new one with extended expiration.

**Use Cases:**
- Extending user session before token expires
- Implementing "remember me" functionality
- Maintaining long-running sessions
- Preventing session timeout during active use

**Request:**
Current valid token must be provided in Authorization header as "Bearer <token>"

**Process:**
1. Validates existing token (must be valid, not expired)
2. Verifies user account is still active
3. Generates new JWT token with fresh 24-hour expiration
4. Returns new token and current user profile

**Token Lifecycle:**
- Old token remains valid until its original expiration
- New token has 24-hour expiration from refresh time
- User should update stored token with new value

**Best Practices:**
- Refresh token before it expires (e.g., at 23 hours)
- Implement automatic refresh on client side
- Store refresh timestamp to avoid excessive refreshes

**Security:**
- Requires valid existing token
- Does not allow refresh of expired tokens (must login again)
- Logs token refresh for audit trail`,
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              schema: AuthSuccessResponseSchema
            },
            '401': {
              description: 'Unauthorized - Invalid or expired token',
              schema: ErrorResponseSchema
            }
          },
          security: []
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/auth/me',
    handler: asyncHandler(AuthController.me),
    options: {
      auth: 'jwt',
      tags: ['api', 'Authentication', 'v1'],
      description: 'Get current authenticated user profile',
      notes: `Returns complete profile information for the currently authenticated user.

**Authentication Required:**
This endpoint requires a valid JWT token in the Authorization header.

**Use Cases:**
- Loading user profile on application startup
- Displaying current user information in UI
- Verifying user role and permissions
- Retrieving user preferences and settings

**Response:**
Returns complete user profile including:
- User ID (UUID)
- Email address
- First and last name
- Role and permissions
- Account status (active/inactive)
- Account timestamps (created, updated)

**Security:**
- Requires valid JWT token
- User can only access their own profile
- Password and sensitive data excluded from response

**Error Handling:**
- Returns 401 if no token provided
- Returns 401 if token is invalid or expired
- Returns 404 if user account no longer exists`,
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Current user profile retrieved successfully',
              schema: Joi.object({
                success: Joi.boolean().valid(true).example(true),
                data: UserResponseSchema
              }).label('MeSuccessResponse')
            },
            '401': {
              description: 'Unauthorized - Authentication required or invalid token',
              schema: ErrorResponseSchema
            },
            '404': {
              description: 'Not Found - User account no longer exists',
              schema: ErrorResponseSchema
            }
          },
          security: [{ jwt: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/auth/test-login',
    handler: asyncHandler(AuthController.testLogin),
    options: {
      auth: false,
      tags: ['api', 'Authentication', 'Testing', 'v1'],
      description: 'Test login endpoint for E2E testing (Development/Test only)',
      notes: `Quick login endpoint for E2E testing. Only available in non-production environments.

**Query Parameters:**
- role: User role to login as (admin, nurse, counselor, viewer, doctor)

**Available Test Users:**
- admin: Full system access
- nurse: Student health management
- counselor: School administrator
- viewer: Read-only access
- doctor: Medical professional

**Response:**
Returns JWT token and user profile, same as regular login endpoint.

**Security:**
- Only available when NODE_ENV is not 'production'
- Automatically creates test users if they don't exist
- Uses standard test password for all test users`,
      validate: {
        query: Joi.object({
          role: Joi.string().valid('admin', 'nurse', 'counselor', 'viewer', 'doctor').default('nurse').description('Role to login as')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Test login successful',
              schema: AuthSuccessResponseSchema
            },
            '401': {
              description: 'Not available in production',
              schema: ErrorResponseSchema
            }
          },
          security: []
        }
      }
    }
  }
];
