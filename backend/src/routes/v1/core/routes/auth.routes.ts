/**
 * Authentication Routes (v1)
 * HTTP route definitions for authentication endpoints
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import { asyncHandler } from '../../../shared/utils';

/**
 * Reusable Swagger schemas for authentication
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
 * Authentication routes
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
  }
];
