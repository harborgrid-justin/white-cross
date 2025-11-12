# Authentication Module

This module provides comprehensive authentication and authorization for the White Cross Healthcare platform using NestJS, JWT, and Passport.

## Features

- User registration with validation
- Email/password authentication
- JWT-based access and refresh tokens
- Password strength validation
- Account lockout after failed login attempts
- Password change functionality
- Role-based access control (RBAC)
- Custom decorators for easy authorization
- Swagger/OpenAPI documentation

## Architecture

### Structure

```
auth/
├── auth.module.ts           # Module configuration
├── auth.service.ts          # Authentication business logic
├── auth.controller.ts       # REST API endpoints
├── dto/                     # Data Transfer Objects
│   ├── register.dto.ts
│   ├── login.dto.ts
│   ├── auth-response.dto.ts
│   ├── change-password.dto.ts
│   └── refresh-token.dto.ts
├── strategies/              # Passport strategies
│   └── jwt.strategy.ts
├── guards/                  # Authorization guards
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
└── decorators/              # Custom decorators
    ├── current-user.decorator.ts
    ├── public.decorator.ts
    └── roles.decorator.ts
```

### Key Components

#### AuthService
Core authentication logic including:
- User registration
- Login/logout
- Token generation and validation
- Password management
- Account security

#### JWT Strategy
Validates JWT tokens and loads user data for each authenticated request.

#### Guards
- `JwtAuthGuard`: Protects routes requiring authentication
- `RolesGuard`: Enforces role-based access control

#### Decorators
- `@Public()`: Makes routes publicly accessible
- `@CurrentUser()`: Injects the authenticated user into route handlers
- `@Roles()`: Specifies required roles for a route

## API Endpoints

### Public Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "nurse@school.edu",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "NURSE"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "nurse@school.edu",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "NURSE",
    "isActive": true,
    "emailVerified": false
  },
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

#### POST /auth/login
Authenticate with email and password.

**Request Body:**
```json
{
  "email": "nurse@school.edu",
  "password": "SecurePass123!"
}
```

**Response:**
Same as registration response.

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response:**
Same as registration response with new tokens.

### Protected Endpoints

#### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "nurse@school.edu",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "NURSE",
    "isActive": true,
    "emailVerified": false
  }
}
```

#### POST /auth/change-password
Change user password (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### POST /auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully. Please discard your tokens."
}
```

## Usage Examples

### Protecting Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProtectedResource(@CurrentUser() user: any) {
    return {
      message: 'This is a protected resource',
      userId: user.id,
      userRole: user.role,
    };
  }
}
```

### Role-Based Authorization

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from './database/models/user.model';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SCHOOL_ADMIN)
  async getAdminData() {
    return { message: 'Admin-only data' };
  }
}
```

### Public Routes

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller('public')
export class PublicController {
  @Get()
  @Public()
  async getPublicData() {
    return { message: 'Public data accessible without authentication' };
  }
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Account Lockout
- Account locks after 5 failed login attempts
- Lockout duration: 30 minutes
- Automatic unlock after lockout period

### Token Security
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days
- Tokens include user ID, email, and role
- Password change invalidates all existing tokens

### Password Management
- Passwords hashed with bcrypt (10 salt rounds)
- Password change requires current password verification
- Admin password reset forces user to change password on next login
- 90-day password expiration for compliance

## Environment Variables

Required environment variables:

```env
# JWT Secret Keys
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=whitecross

# Application
NODE_ENV=development
PORT=3001
```

## Integration with Other Modules

The auth module exports:
- `AuthService` - For programmatic authentication operations
- `JwtAuthGuard` - For protecting routes
- `RolesGuard` - For role-based authorization
- `PassportModule` - For Passport integration
- `JwtModule` - For JWT operations

Other modules can import `AuthModule` and use these exported components.

## Database Model

The User model includes:
- Basic info: email, name, role
- Security: password hash, failed attempts, lockout
- Verification: email verification status and tokens
- Password reset: reset tokens with expiration
- 2FA: optional two-factor authentication
- Audit: last login, password change timestamps

## Error Handling

The module throws appropriate HTTP exceptions:
- `400 Bad Request`: Invalid input data, weak password
- `401 Unauthorized`: Invalid credentials, expired token, account locked
- `403 Forbidden`: Insufficient permissions
- `409 Conflict`: Email already exists

## Future Enhancements

- Email verification workflow
- Password reset via email
- Two-factor authentication (TOTP)
- OAuth2 integration
- Session management with Redis
- Token blacklisting
- Audit logging for all auth events
- Rate limiting for login attempts
