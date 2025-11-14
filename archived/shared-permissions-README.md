# Permission System Documentation

## Overview

HIPAA-compliant Role-Based Access Control (RBAC) system inspired by Berty's permission framework. Provides declarative permission management with role-based authorization, resource-level access control, and audit trail integration.

## Features

- ✅ **Role-Based Access Control (RBAC)** - 12 predefined roles
- ✅ **Resource-Level Permissions** - 28 protected resource types
- ✅ **Action-Based Authorization** - 16 action types
- ✅ **Conditional Access** - Context-based permission rules
- ✅ **HIPAA Compliance** - Healthcare-specific access controls
- ✅ **Audit Trail Ready** - Track all permission checks
- ✅ **Middleware Integration** - Easy Hapi route protection
- ✅ **Type-Safe** - Full TypeScript support

## Roles

### Administrative Roles
- `SuperAdmin` - Full system access
- `Admin` - Administrative access to most resources

### Healthcare Provider Roles
- `Nurse` - Medication administration, student care
- `Doctor` - Medical oversight, prescriptions
- `Pharmacist` - Medication management, inventory

### Staff Roles
- `Staff` - Limited student and contact access
- `Teacher` - Student info, activities
- `Counselor` - Student support

### Limited Access Roles
- `Guardian` - Own student only
- `Viewer` - Read-only access

### System Roles
- `System` - Internal system operations
- `ApiClient` - Programmatic API access

## Resources

### Student Resources
- `Student` - Student records
- `StudentProfile` - Student profile information
- `StudentMedical` - Medical information
- `StudentConsent` - Consent forms

### Medication Resources
- `Medication` - Medication records
- `MedicationLog` - Administration logs
- `MedicationSchedule` - Schedules
- `MedicationInventory` - Inventory

### Health Record Resources
- `HealthRecord` - Health records
- `HealthRecordMedical` - Medical records
- `HealthRecordAllergy` - Allergy information
- `HealthRecordCondition` - Conditions

### Contact Resources
- `Contact` - Contact records
- `ContactGuardian` - Guardian contacts
- `ContactEmergency` - Emergency contacts
- `ContactStaff` - Staff contacts

### Activity Resources
- `Activity` - Activity records
- `ActivityLog` - Activity logs
- `ActivityTimeline` - Timeline

### System Resources
- `User`, `Settings`, `Audit`, `Report`, `Webhook`

## Actions

### Read Operations
- `Read` - Read single resource
- `List` - List multiple resources
- `View` - View resource details

### Write Operations
- `Create` - Create new resource
- `Update` - Update existing resource
- `Delete` - Delete resource

### Special Operations
- `Administer` - Administrative actions
- `Approve` - Approve actions
- `Override` - Override rules
- `Export` - Export data
- `Import` - Import data

### Medication-Specific
- `AdministerMedication` - Administer medication
- `ScheduleMedication` - Schedule medication
- `VerifyMedication` - Verify medication

### Audit Operations
- `ViewAudit` - View audit logs
- `ManageAudit` - Manage audit logs

## Usage

### Basic Permission Check

```typescript
import { can, Role, Action, Resource } from '../shared/permissions';

// Check if nurse can administer medication
const canAdminister = can(Role.Nurse, Action.AdministerMedication, Resource.Medication);
console.log(canAdminister); // true

// Check if viewer can delete students
const canDelete = can(Role.Viewer, Action.Delete, Resource.Student);
console.log(canDelete); // false
```

### Route Protection

```typescript
import { requirePermission, Resource, Action } from '../shared/permissions';

server.route({
  method: 'POST',
  path: '/api/medications/{id}/administer',
  options: {
    pre: [
      requirePermission({
        resource: Resource.Medication,
        action: Action.AdministerMedication,
        extractResourceId: (request) => request.params.id
      })
    ]
  },
  handler: async (request, h) => {
    // Permission already checked
    return administerMedication(request.params.id);
  }
});
```

### Role-Based Route Protection

```typescript
import { requireRole, Role } from '../shared/permissions';

server.route({
  method: 'GET',
  path: '/api/admin/settings',
  options: {
    pre: [requireRole([Role.Admin, Role.SuperAdmin])]
  },
  handler: async (request, h) => {
    return getSettings();
  }
});
```

### Manual Permission Check

```typescript
import { checkUserPermission, Resource, Action } from '../shared/permissions';

async function handler(request: Request, h: ResponseToolkit) {
  const canUpdate = await checkUserPermission(request, {
    resource: Resource.Student,
    action: Action.Update,
    resourceId: studentId
  });
  
  if (!canUpdate) {
    throw Boom.forbidden('Cannot update student');
  }
  
  // Proceed with update
}
```

### Assert Permission (Throws if Denied)

```typescript
import { assertUserPermission, Resource, Action } from '../shared/permissions';

async function handler(request: Request, h: ResponseToolkit) {
  // Throws AppError if permission denied
  await assertUserPermission(request, {
    resource: Resource.Medication,
    action: Action.AdministerMedication,
    resourceId: medicationId
  });
  
  // Continue with operation
  return administerMedication(medicationId);
}
```

### Conditional Permissions

```typescript
import { checkPermission, Role, Resource, Action } from '../shared/permissions';

// Guardian can only access their own student's data
const result = checkPermission({
  userId: guardianId,
  userRole: Role.Guardian,
  resource: Resource.Student,
  action: Action.Read,
  resourceId: studentId,
  metadata: {
    guardianId: guardianId  // Condition: guardianId must match userId
  }
});

console.log(result.allowed); // true if guardian owns student, false otherwise
```

### Get Allowed Actions

```typescript
import { getAllowedActions, Role, Resource } from '../shared/permissions';

// Get all actions a nurse can perform on medications
const actions = getAllowedActions(Role.Nurse, Resource.Medication);
console.log(actions);
// Output: ['read', 'list', 'administer_medication', 'verify_medication']
```

### Get Allowed Resources

```typescript
import { getAllowedResources, Role } from '../shared/permissions';

// Get all resources a teacher can access
const resources = getAllowedResources(Role.Teacher);
console.log(resources);
// Output: ['student', 'student:profile', 'contact', 'activity']
```

## Permission Matrix Examples

### Nurse Permissions

| Resource | Actions |
|----------|---------|
| Student | Read, List |
| StudentMedical | Read |
| Medication | Read, List, AdministerMedication, VerifyMedication |
| MedicationLog | Read, List, Create, Update |
| HealthRecord | Read, List, Create |
| Contact | Read, List |
| Activity | Read, List, Create |

### Guardian Permissions

| Resource | Actions | Conditions |
|----------|---------|------------|
| Student | Read | Own student only |
| StudentProfile | Read | Own student only |
| MedicationLog | Read, List | Own student only |
| Activity | Read, List | Own student only |

### Doctor Permissions

| Resource | Actions |
|----------|---------|
| Student | Read, List |
| StudentMedical | Read, Update |
| Medication | Read, List, Create, Update, ScheduleMedication |
| HealthRecord | Read, List, Create, Update |
| Contact | Read, List |

## Integration with Error Codes

```typescript
import { assertUserPermission, Resource, Action } from '../shared/permissions';
import { ErrorFactory } from '../shared/errors';

async function administerMedication(request: Request, h: ResponseToolkit) {
  try {
    // Check permission
    await assertUserPermission(request, {
      resource: Resource.Medication,
      action: Action.AdministerMedication,
      resourceId: request.params.id
    });
    
    // Administer medication
    const result = await MedicationService.administer(request.params.id);
    return { success: true, result };
    
  } catch (error) {
    if (error.code === ErrorCode.ErrPermissionDenied) {
      // Log permission denial for audit
      logger.warn('Permission denied', {
        userId: getUserId(request),
        action: Action.AdministerMedication,
        resource: Resource.Medication,
        resourceId: request.params.id
      });
    }
    throw error;
  }
}
```

## HIPAA Compliance

### Access Control
```typescript
// All medication administration requires permission check
await assertUserPermission(request, {
  resource: Resource.Medication,
  action: Action.AdministerMedication
});
```

### Audit Trail
```typescript
// Log all permission checks
import { checkPermission } from '../shared/permissions';
import { logger } from '../utils/logger';

function checkAndLog(context: PermissionContext) {
  const result = checkPermission(context);
  
  logger.info('Permission check', {
    userId: context.userId,
    userRole: context.userRole,
    resource: context.resource,
    action: context.action,
    allowed: result.allowed,
    reason: result.reason,
    timestamp: new Date().toISOString()
  });
  
  return result;
}
```

### Data Access Restrictions
```typescript
// Guardians can only access their own student's data
const result = checkPermission({
  userId: guardianId,
  userRole: Role.Guardian,
  resource: Resource.StudentMedical,
  action: Action.Read,
  metadata: { guardianId }
});

if (!result.allowed) {
  throw ErrorFactory.permissionDenied(
    Action.Read,
    Resource.StudentMedical,
    { reason: 'Guardian can only access own student data' }
  );
}
```

## Testing

```typescript
import { can, Role, Action, Resource, checkPermission } from '../shared/permissions';

describe('Permission System', () => {
  describe('Nurse permissions', () => {
    it('should allow medication administration', () => {
      expect(can(Role.Nurse, Action.AdministerMedication, Resource.Medication)).toBe(true);
    });
    
    it('should not allow student deletion', () => {
      expect(can(Role.Nurse, Action.Delete, Resource.Student)).toBe(false);
    });
  });
  
  describe('Guardian permissions', () => {
    it('should allow reading own student data', () => {
      const result = checkPermission({
        userId: 'guardian-123',
        userRole: Role.Guardian,
        resource: Resource.Student,
        action: Action.Read,
        metadata: { guardianId: 'guardian-123' }
      });
      
      expect(result.allowed).toBe(true);
    });
    
    it('should not allow reading other student data', () => {
      const result = checkPermission({
        userId: 'guardian-123',
        userRole: Role.Guardian,
        resource: Resource.Student,
        action: Action.Read,
        metadata: { guardianId: 'guardian-456' }
      });
      
      expect(result.allowed).toBe(false);
    });
  });
  
  describe('Admin permissions', () => {
    it('should allow creating students', () => {
      expect(can(Role.Admin, Action.Create, Resource.Student)).toBe(true);
    });
    
    it('should allow viewing audit logs', () => {
      expect(can(Role.Admin, Action.ViewAudit, Resource.Audit)).toBe(true);
    });
  });
});
```

## Custom Permission Rules

### Add Custom Permissions

```typescript
import { PERMISSION_MATRIX, Permission, Role, Resource, Action } from '../shared/permissions';

// Add custom permission
const customPermission: Permission = {
  role: Role.Counselor,
  resource: Resource.StudentProfile,
  actions: [Action.Read, Action.Update],
  conditions: [
    { field: 'counselorId', operator: 'eq', value: '{{userId}}' }
  ]
};

PERMISSION_MATRIX.push(customPermission);
```

### Create Custom Checker

```typescript
import { PermissionChecker } from '../shared/permissions';

const customChecker = new PermissionChecker([
  // Your custom permission matrix
  {
    role: Role.Teacher,
    resource: Resource.Student,
    actions: [Action.Read, Action.Update]
  }
]);

const result = customChecker.check({
  userId: 'teacher-123',
  userRole: Role.Teacher,
  resource: Resource.Student,
  action: Action.Update
});
```

## Best Practices

### 1. Always Check Permissions at Route Level

```typescript
// ✅ Good - Permission checked at route
server.route({
  method: 'POST',
  path: '/api/medications/{id}/administer',
  options: {
    pre: [requirePermission({
      resource: Resource.Medication,
      action: Action.AdministerMedication
    })]
  },
  handler: async (request, h) => {
    return administerMedication(request.params.id);
  }
});

// ❌ Avoid - Permission checked in handler (easy to forget)
server.route({
  method: 'POST',
  path: '/api/medications/{id}/administer',
  handler: async (request, h) => {
    await assertUserPermission(request, {...});
    return administerMedication(request.params.id);
  }
});
```

### 2. Use Role-Based Protection for Simple Cases

```typescript
// ✅ Good - Simple role check
server.route({
  method: 'GET',
  path: '/api/admin/settings',
  options: {
    pre: [requireRole([Role.Admin, Role.SuperAdmin])]
  },
  handler: getSettings
});
```

### 3. Use Resource-Level Permissions for Complex Cases

```typescript
// ✅ Good - Full permission check with resource
server.route({
  method: 'POST',
  path: '/api/students/{id}/medical',
  options: {
    pre: [requirePermission({
      resource: Resource.StudentMedical,
      action: Action.Update,
      extractResourceId: (req) => req.params.id
    })]
  },
  handler: updateMedicalRecord
});
```

### 4. Log Permission Denials

```typescript
// ✅ Good - Log for audit trail
try {
  await assertUserPermission(request, {...});
} catch (error) {
  if (hasErrorCode(error, ErrorCode.ErrPermissionDenied)) {
    logger.warn('Permission denied', {
      userId: getUserId(request),
      resource: Resource.Medication,
      action: Action.AdministerMedication,
      timestamp: new Date().toISOString()
    });
  }
  throw error;
}
```

## Migration Guide

### From Existing Authorization

**Before:**
```typescript
server.route({
  method: 'POST',
  path: '/api/medications/{id}/administer',
  handler: async (request, h) => {
    const user = request.auth.credentials;
    
    if (user.role !== 'nurse' && user.role !== 'admin') {
      throw Boom.forbidden('Insufficient permissions');
    }
    
    return administerMedication(request.params.id);
  }
});
```

**After:**
```typescript
import { requirePermission, Resource, Action } from '../shared/permissions';

server.route({
  method: 'POST',
  path: '/api/medications/{id}/administer',
  options: {
    pre: [requirePermission({
      resource: Resource.Medication,
      action: Action.AdministerMedication
    })]
  },
  handler: async (request, h) => {
    return administerMedication(request.params.id);
  }
});
```

## See Also

- [Error Code System](../errors/README.md)
- [Type Guards](../types/README.md)
- [Implementation Plan](../../../../IMPLEMENTATION_PLAN.md)
- [Berty Permission System](https://github.com/berty/berty/tree/master/go/pkg/bertyauth)
