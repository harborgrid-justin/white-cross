/**
 * Core Authentication Controller (v1)
 *
 * Provides v1 API routes for authentication, maintaining backward compatibility
 * with the legacy Hapi.js backend. Routes follow the /api/v1/auth/* pattern.
 */

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../../auth/auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../../../auth/dto';
import { Public } from '../../shared/decorators';

@ApiTags('Authentication v1')
@Controller('api/v1/auth')
export class AuthV1Controller {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user account',
    description: `Creates a new user account in the White Cross Healthcare Platform.

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

**Response:**
Returns the created user object (without password). Does NOT automatically log in - use /login endpoint with credentials.`,
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Resource created successfully' },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                email: { type: 'string', format: 'email' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists with this email',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - Invalid input data',
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Resource created successfully',
      data: {
        user: result.user,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user and obtain JWT token',
    description: `Authenticates user credentials and returns a JWT token for API access.

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
- Format: "Bearer <token>"`,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful - JWT token generated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials or inactive account',
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: {
        token: result.accessToken,
        user: result.user,
      },
    };
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify JWT token validity',
    description: `Validates a JWT token and returns decoded user information.

**Use Cases:**
- Frontend token validation on app startup
- Checking if a stored token is still valid
- Verifying token before making authenticated requests
- Session restoration after page reload

**Validation Checks:**
1. Token format is valid JWT
2. Token signature is valid (signed with server secret)
3. Token has not expired
4. User account still exists and is active`,
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid - user profile returned',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async verify(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Access token required');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    try {
      const user = await this.authService.verifyToken(token);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh JWT token',
    description: `Exchanges an existing valid JWT token for a new one with extended expiration.

**Token Lifecycle:**
- Old token remains valid until its original expiration
- New token has 24-hour expiration from refresh time
- User should update stored token with new value`,
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async refresh(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Refresh token required');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      const result = await this.authService.refreshToken(token);
      return {
        success: true,
        data: {
          token: result.accessToken,
          user: result.user,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user profile',
    description: `Returns complete profile information for the currently authenticated user.

**Authentication Required:**
This endpoint requires a valid JWT token in the Authorization header.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required or invalid token',
  })
  async me(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const user = await this.authService.verifyToken(token);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Public()
  @Get('test-login')
  @ApiOperation({
    summary: 'Test login endpoint for E2E testing',
    description: `Quick login endpoint for E2E testing. Only available in non-production environments.

**Available Test Users:**
- admin: Full system access
- nurse: Student health management
- counselor: School administrator
- viewer: Read-only access
- doctor: Medical professional`,
  })
  @ApiResponse({
    status: 200,
    description: 'Test login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Not available in production',
  })
  async testLogin(@Query('role') role: string = 'nurse') {
    // Only allow in test/development environments
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Test login not available in production');
    }

    // Map role to test user email
    const testUserMap: Record<string, string> = {
      admin: 'admin@school.edu',
      nurse: 'nurse@school.edu',
      counselor: 'counselor@school.edu',
      viewer: 'readonly@school.edu',
      doctor: 'doctor@school.edu',
    };

    const email = testUserMap[role?.toLowerCase()] || testUserMap['nurse'];

    try {
      // Try to login with test credentials
      const result = await this.authService.login({
        email,
        password: 'TestPassword123!',
      });

      return {
        success: true,
        data: {
          token: result.accessToken,
          user: result.user,
        },
      };
    } catch (error) {
      // If test user doesn't exist, suggest creating it
      throw new UnauthorizedException(
        'Test user not found. Please create test users first.',
      );
    }
  }
}
