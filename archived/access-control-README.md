# Access Control Module

Comprehensive Role-Based Access Control (RBAC) implementation for the White Cross School Health Management System NestJS backend.

## Overview

The Access Control Module provides a complete RBAC solution with:
- **Role Management**: Create, update, and delete roles with system role protection
- **Permission Management**: Fine-grained resource-action based permissions
- **User Role Assignments**: Assign roles to users with privilege escalation prevention
- **Authorization Guards**: Declarative access control using decorators
- **Session Management**: Track and manage user sessions
- **Security Monitoring**: Security incident tracking and IP restriction management

## Features

### 🔐 Role-Based Access Control
- Hierarchical role system
- System roles (cannot be modified/deleted)
- Custom role creation with validation
- Case-insensitive duplicate checking

### 🎫 Permission System
- Resource-action based permissions (e.g., `students.read`, `medications.administer`)
- Dynamic permission assignment to roles
- Permission aggregation across multiple roles
- Efficient permission checking

### 🛡️ Security Features
- **Privilege Escalation Prevention**: Users cannot assign roles with higher privileges than they possess
- **System Role Protection**: System roles cannot be modified or deleted
- **Audit Logging**: All security-critical operations are logged (TODO: integrate with audit module)
- **Security Incident Tracking**: Track and manage security incidents
- **IP Restriction Management**: Blacklist/whitelist IP addresses

### 🔒 Authorization Guards
- `@Roles(...roles)` - Require specific roles
- `@Permissions(resource, action)` - Require specific permissions
- `@Public()` - Mark routes as public (skip authorization)

## Installation & Setup

### 1. Module Registration

The Access Control Module is already registered in `AppModule`:

```typescript
import { AccessControlModule } from './access-control/access-control.module';

@Module({
  imports: [
    // ... other modules
    AccessControlModule,
  ],
})
export class AppModule {}
```

### 2. Database Models

**IMPORTANT**: This module requires the following Sequelize models to be registered in the DatabaseModule:

**Security Models** (from `backend/src/database/models/security/`):
- `Role` - User roles
- `Permission` - System permissions
- `RolePermission` - Many-to-many relationship between roles and permissions
- `UserRoleAssignment` - Many-to-many relationship between users and roles
- `Session` - User sessions
- `LoginAttempt` - Login attempt tracking
- `IpRestriction` - IP blacklist/whitelist
- `SecurityIncident` - Security incident records

**Core Models**:
- `User` - User accounts (from `backend/src/database/models/core/User.ts`)

### 3. Initialize Default Roles

After setup, initialize default roles and permissions:

```bash
POST /access-control/initialize
```

This creates:
- **Nurse** role with permissions for students, medications, health records, and reports
- **Administrator** role with full system access

## Usage Examples

### Using Guards and Decorators

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionsGuard, RolesGuard } from '../access-control/guards';
import { Permissions, Roles, Public } from '../access-control/decorators';

@Controller('students')
@UseGuards(PermissionsGuard, RolesGuard)
export class StudentsController {
  // Require 'students.read' permission
  @Get()
  @Permissions('students', 'read')
  async getStudents() {
    // ...
  }

  // Require Administrator role
  @Post()
  @Roles('Administrator')
  async createStudent() {
    // ...
  }

  // Public route (no authentication required)
  @Get('public-info')
  @Public()
  async getPublicInfo() {
    // ...
  }
}
```

### Programmatic Permission Checking

```typescript
import { Injectable } from '@nestjs/common';
import { AccessControlService } from '../access-control/access-control.service';

@Injectable()
export class MyService {
  constructor(
    private readonly accessControl: AccessControlService,
  ) {}

  async doSomething(userId: string) {
    // Check if user has permission
    const canManageUsers = await this.accessControl.checkPermission(
      userId,
      'users',
      'manage',
    );

    if (!canManageUsers) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Get all user permissions
    const userPermissions = await this.accessControl.getUserPermissions(userId);
    console.log('User roles:', userPermissions.roles);
    console.log('User permissions:', userPermissions.permissions);
  }
}
```

### Creating Custom Roles

```typescript
// Create a new role
const role = await accessControlService.createRole({
  name: 'Teacher',
  description: 'Teacher with limited access to student information',
}, currentUserId);

// Assign permissions to the role
await accessControlService.assignPermissionToRole(
  role.id,
  studentReadPermissionId,
  currentUserId,
);

// Assign role to user
await accessControlService.assignRoleToUser(
  userId,
  role.id,
  currentUserId,
);
```

## API Endpoints

### Role Management
- `GET /access-control/roles` - Get all roles
- `GET /access-control/roles/:id` - Get role by ID
- `POST /access-control/roles` - Create new role
- `PATCH /access-control/roles/:id` - Update role
- `DELETE /access-control/roles/:id` - Delete role

### Permission Management
- `GET /access-control/permissions` - Get all permissions
- `POST /access-control/permissions` - Create new permission
- `POST /access-control/roles/:roleId/permissions` - Assign permission to role
- `DELETE /access-control/roles/:roleId/permissions/:permissionId` - Remove permission from role

### RBAC Operations
- `POST /access-control/users/:userId/roles` - Assign role to user
- `DELETE /access-control/users/:userId/roles/:roleId` - Remove role from user
- `GET /access-control/users/:userId/permissions` - Get user permissions
- `POST /access-control/check-permission` - Check if user has permission

### Session Management
- `GET /access-control/sessions/user/:userId` - Get user sessions
- `DELETE /access-control/sessions/:token` - Delete session
- `DELETE /access-control/sessions/user/:userId/all` - Delete all user sessions

### Security Management
- `GET /access-control/security/incidents` - Get security incidents (with pagination)
- `POST /access-control/security/incidents` - Create security incident
- `GET /access-control/security/statistics` - Get security statistics
- `GET /access-control/security/ip-restrictions` - Get IP restrictions
- `POST /access-control/security/ip-restrictions` - Add IP restriction
- `DELETE /access-control/security/ip-restrictions/:id` - Remove IP restriction

### System
- `POST /access-control/initialize` - Initialize default roles and permissions

## Default Permissions

The system includes the following default permissions:

### Student Permissions
- `students.read` - View students
- `students.create` - Create students
- `students.update` - Update students
- `students.delete` - Delete students

### Medication Permissions
- `medications.read` - View medications
- `medications.administer` - Administer medications
- `medications.manage` - Manage medication inventory

### Health Records Permissions
- `health_records.read` - View health records
- `health_records.create` - Create health records
- `health_records.update` - Update health records

### Reports Permissions
- `reports.read` - View reports
- `reports.create` - Create reports

### Admin Permissions
- `users.manage` - Manage users
- `system.configure` - Configure system
- `security.manage` - Manage security settings

## Security Considerations

### Privilege Escalation Prevention

The module implements privilege escalation prevention:
- Users can only assign roles they themselves possess or have lower privileges
- Assigning security-sensitive roles (with `security.manage` or `system.configure` permissions) requires the assigner to have `security.manage` permission
- System roles cannot be modified or deleted

### System Role Protection

Roles marked as `isSystem: true` are protected:
- Cannot be updated
- Cannot be deleted
- Cannot have permissions modified

This ensures default roles (Nurse, Administrator) remain intact.

### Audit Logging

All security-critical operations should be logged (integration with audit module pending):
- Role assignments
- Permission changes
- Role modifications
- Failed authorization attempts

## Dependencies

### Required NestJS Packages
- `@nestjs/common` - Core NestJS functionality
- `@nestjs/sequelize` - Sequelize integration
- `@nestjs/swagger` - API documentation
- `sequelize` - ORM
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation

### Database Requirements
- PostgreSQL database
- Sequelize models registered in DatabaseModule

## Testing

### Unit Tests
```bash
# Run unit tests for the service
npm test -- access-control.service.spec.ts
```

### Integration Tests
```bash
# Run integration tests
npm test -- access-control.controller.spec.ts
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

## Migration Notes

### Migrated from Legacy Backend

This module was migrated from `backend/src/services/accessControl/` with the following changes:
- Converted class-based service to NestJS injectable service
- Created comprehensive DTOs with validation
- Implemented NestJS guards and decorators
- Added Swagger API documentation
- Improved error handling with NestJS exceptions
- Maintained all security features (privilege escalation prevention, system role protection)

### Breaking Changes
- None - API remains compatible with legacy implementation

## Future Enhancements

- [ ] Integrate with audit module for comprehensive logging
- [ ] Add caching for permission checks (Redis)
- [ ] Implement permission inheritance/hierarchies
- [ ] Add bulk role assignment operations
- [ ] Create admin UI for role/permission management
- [ ] Add role templates for quick setup
- [ ] Implement time-based role assignments (temporary elevated access)
- [ ] Add permission usage analytics

## Troubleshooting

### Models Not Found
**Error**: `Cannot read property 'findAll' of undefined`

**Solution**: Ensure all required Sequelize models are registered in the DatabaseModule. The models should be imported and added to the SequelizeModule.forRoot() configuration with `autoLoadModels: true`.

### Guard Not Working
**Error**: Guards not enforcing authorization

**Solution**:
1. Ensure guards are registered in the module providers
2. Check that `@UseGuards()` decorator is applied to the controller or route
3. Verify the user object is available in the request (set by authentication guard)

### Permission Check Returns False
**Issue**: User should have permission but check returns false

**Solution**:
1. Verify user has the role assigned: `GET /access-control/users/:userId/permissions`
2. Check that the role has the permission assigned
3. Ensure permission resource and action names match exactly (case-sensitive)

## License

Proprietary - White Cross School Health Management System

## Support

For issues or questions, contact the development team.
