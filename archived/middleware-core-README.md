# Core Middleware Module

Enterprise-grade middleware components for NestJS healthcare platform, providing authentication, authorization, validation, and session management with HIPAA compliance.

## Overview

This module provides:

- **Role-Based Access Control (RBAC)**: Hierarchical role and permission-based authorization
- **Healthcare Validation**: OWASP-compliant input validation with healthcare-specific patterns
- **Session Management**: HIPAA-compliant session lifecycle management with automatic timeouts
- **Type Safety**: Comprehensive TypeScript type definitions for all components

## Installation

The module is automatically available after importing `CoreMiddlewareModule`:

```typescript
import { Module } from '@nestjs/common';
import { CoreMiddlewareModule } from './middleware/core';

@Module({
  imports: [CoreMiddlewareModule],
})
export class AppModule {}
```

## Components

### 1. RBAC Guards

#### PermissionsGuard

Fine-grained permission-based authorization:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermissions, Permission } from './middleware/core';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions([Permission.READ_HEALTH_RECORDS])
export class HealthRecordsController {
  // Only users with READ_HEALTH_RECORDS permission can access
}
```

**Features:**
- Fine-grained permission checking
- AND/OR permission logic support
- Hierarchical role inheritance
- HIPAA-compliant audit logging

**Decorators:**
- `@RequirePermissions([...], 'all')` - Require ALL permissions (AND logic)
- `@RequirePermissions([...], 'any')` - Require ANY permission (OR logic)
- `@RequirePermission(...)` - Require single permission

#### RbacGuard

Combined role and permission authorization:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard, UserRole } from './middleware/core';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(UserRole.SCHOOL_NURSE)
@RequirePermissions([Permission.ADMINISTER_MEDICATIONS])
export class MedicationsController {
  // Requires BOTH school nurse role AND administer medications permission
}
```

**Features:**
- Combined role and permission checking
- Hierarchical role support
- Flexible authorization logic
- Comprehensive audit logging

### 2. Validation Pipe

#### HealthcareValidationPipe

HIPAA-compliant input validation:

```typescript
import { Post, Body, UsePipes } from '@nestjs/common';
import { HealthcareValidationPipe } from './middleware/core';

@Post('/students')
@UsePipes(HealthcareValidationPipe)
async createStudent(@Body() dto: CreateStudentDto) {
  // Input is validated and sanitized
}
```

**Features:**
- Healthcare-specific pattern validation (MRN, NPI, ICD-10, etc.)
- XSS and SQL injection prevention
- Field length limits
- HIPAA compliance checks
- Comprehensive error reporting

**Supported Patterns:**
- Medical Record Number (MRN)
- National Provider Identifier (NPI)
- ICD-10 codes
- Phone numbers (US format)
- Medication dosages
- SSN validation

**Factory Functions:**
```typescript
import { createHealthcareValidationPipe, createAdminValidationPipe } from './middleware/core';

// Healthcare validation (default)
const pipe = createHealthcareValidationPipe();

// Admin validation (stricter)
const adminPipe = createAdminValidationPipe();
```

### 3. Session Middleware

#### SessionMiddleware

HIPAA-compliant session management:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SessionMiddleware } from './middleware/core';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes('*');
  }
}
```

**Features:**
- Automatic session timeout
- Concurrent session limits
- Activity tracking
- Session expiration warnings
- HIPAA-compliant audit logging
- Support for Redis or in-memory storage

**Configuration:**
```typescript
import { SESSION_CONFIGS } from './middleware/core';

// Healthcare session (30 min timeout)
new SessionMiddleware(SESSION_CONFIGS.healthcare);

// Admin session (15 min timeout, single session)
new SessionMiddleware(SESSION_CONFIGS.admin);

// Emergency session (60 min timeout)
new SessionMiddleware(SESSION_CONFIGS.emergency);

// Development session (8 hour timeout)
new SessionMiddleware(SESSION_CONFIGS.development);
```

## Usage Examples

### Example 1: Protected Health Records Endpoint

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermissions, Permission } from './middleware/core';

@Controller('health-records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HealthRecordsController {
  @Get()
  @RequirePermissions([Permission.READ_HEALTH_RECORDS])
  async getHealthRecords() {
    // Only users with READ_HEALTH_RECORDS permission
    return this.healthRecordsService.findAll();
  }

  @Post()
  @RequirePermissions([
    Permission.CREATE_HEALTH_RECORDS,
    Permission.UPDATE_HEALTH_RECORDS
  ])
  async createHealthRecord(@Body() dto: CreateHealthRecordDto) {
    // Requires BOTH permissions
    return this.healthRecordsService.create(dto);
  }
}
```

### Example 2: Role-Based Admin Access

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard, UserRole } from './middleware/core';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles(UserRole.DISTRICT_ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
export class AdminController {
  // Only district admins and system admins can access
}
```

### Example 3: Healthcare Data Validation

```typescript
import { Post, Body } from '@nestjs/common';
import { HealthcareValidationPipe } from './middleware/core';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { HEALTHCARE_PATTERNS } from './middleware/core';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @Matches(HEALTHCARE_PATTERNS.MRN)
  medicalRecordNumber: string;

  @Matches(HEALTHCARE_PATTERNS.NPI)
  providerId: string;
}

@Post('/patients')
async createPatient(
  @Body(new HealthcareValidationPipe()) dto: CreatePatientDto
) {
  // Data is validated against healthcare patterns
  return this.patientsService.create(dto);
}
```

### Example 4: Session Management

```typescript
import { Injectable } from '@nestjs/common';
import { SessionMiddleware } from './middleware/core';

@Injectable()
export class AuthService {
  constructor(private sessionMiddleware: SessionMiddleware) {}

  async login(user: User, req: Request) {
    // Create session after successful authentication
    const session = await this.sessionMiddleware.createSession(
      user.id,
      user.email,
      user.role,
      req.ip,
      req.headers['user-agent'],
      user.permissions
    );

    return {
      sessionId: session.sessionId,
      expiresIn: 30 * 60 * 1000 // 30 minutes
    };
  }

  async logout(sessionId: string) {
    // End session
    await this.sessionMiddleware.endSession(sessionId);
  }
}
```

## Type Definitions

### UserRole Enum

```typescript
enum UserRole {
  STUDENT = 'student',
  PARENT_GUARDIAN = 'parent_guardian',
  SCHOOL_NURSE = 'school_nurse',
  SCHOOL_ADMINISTRATOR = 'school_administrator',
  DISTRICT_NURSE = 'district_nurse',
  DISTRICT_ADMINISTRATOR = 'district_administrator',
  SYSTEM_ADMINISTRATOR = 'system_administrator',
  SUPER_ADMIN = 'super_admin'
}
```

### Permission Enum

```typescript
enum Permission {
  // Student data
  READ_STUDENT_BASIC,
  READ_STUDENT_HEALTH,
  UPDATE_STUDENT_BASIC,
  UPDATE_STUDENT_HEALTH,
  DELETE_STUDENT,

  // Health records
  READ_HEALTH_RECORDS,
  CREATE_HEALTH_RECORDS,
  UPDATE_HEALTH_RECORDS,
  DELETE_HEALTH_RECORDS,

  // Medications
  READ_MEDICATIONS,
  ADMINISTER_MEDICATIONS,
  MANAGE_MEDICATIONS,

  // ... and more
}
```

## Configuration

### RBAC Configuration

```typescript
import { RbacConfig } from './middleware/core';

const rbacConfig: RbacConfig = {
  enableHierarchy: true,        // Enable role hierarchy
  enableAuditLogging: true,     // Enable audit logs
  customPermissions: {}         // Custom permission mappings
};
```

### Validation Configuration

```typescript
import { ValidationConfig } from './middleware/core';

const validationConfig: ValidationConfig = {
  enableHipaaCompliance: true,
  enableSecurityValidation: true,
  logValidationErrors: true,
  maxFieldLength: 1000,
  allowedFileTypes: ['pdf', 'jpg', 'png']
};
```

### Session Configuration

```typescript
import { SessionConfig } from './middleware/core';

const sessionConfig: SessionConfig = {
  sessionTimeout: 30 * 60 * 1000,    // 30 minutes
  warningTime: 5 * 60 * 1000,        // 5 minutes
  maxConcurrentSessions: 3,
  requireReauth: true,
  trackActivity: true,
  auditSessions: true
};
```

## Security Features

- **HIPAA Compliance**: Audit logging, session management, access control
- **OWASP Standards**: Input validation, XSS prevention, SQL injection prevention
- **Type Safety**: Comprehensive TypeScript types for all components
- **Role Hierarchy**: Automatic permission inheritance
- **Session Security**: Automatic timeouts, concurrent session limits

## Migration Notes

This module was migrated from `backend/src/middleware/core` with the following changes:

1. **Framework Adaptation**: Converted from framework-agnostic to NestJS-specific patterns
2. **Guards**: Created separate guards for permissions and combined RBAC
3. **Pipes**: Migrated validation to NestJS pipes using class-validator
4. **Middleware**: Converted session management to NestJS middleware
5. **Type Safety**: Enhanced type definitions and added comprehensive interfaces

## Integration with Auth Module

This module integrates seamlessly with the existing `auth` module:

```typescript
// Use together with JWT authentication
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions([Permission.READ_HEALTH_RECORDS])
export class HealthRecordsController {}
```

## Testing

```typescript
import { Test } from '@nestjs/testing';
import { PermissionsGuard, Permission } from './middleware/core';
import { Reflector } from '@nestjs/core';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        Reflector
      ]
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
  });

  it('should allow access with correct permissions', () => {
    // Test implementation
  });
});
```

## License

Proprietary - White Cross Healthcare Platform
