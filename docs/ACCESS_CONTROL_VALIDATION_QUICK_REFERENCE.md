# Access Control Validation - Quick Reference Guide

## For Developers

This guide provides quick reference for using the enhanced Access Control & Security validation features.

---

## Backend Usage

### Creating a Role

```typescript
import { AccessControlService } from './services/accessControlService';

// In your controller
const newRole = await AccessControlService.createRole(
  {
    name: 'School Nurse',
    description: 'Full access to student health records'
  },
  req.user.id // Pass authenticated user ID for audit logging
);
```

**Validation:**
- Name: 2-100 characters, alphanumeric + spaces/hyphens/underscores
- No reserved names (SYSTEM, ROOT, SUPERADMIN, SUPERUSER)
- Case-insensitive uniqueness

---

### Updating a Role

```typescript
const updatedRole = await AccessControlService.updateRole(
  roleId,
  {
    name: 'Updated Name',
    description: 'Updated description'
  },
  req.user.id
);
```

**Validation:**
- Cannot modify system roles
- Same name validation as creation
- Case-insensitive uniqueness check (excluding current role)

---

### Deleting a Role

```typescript
const result = await AccessControlService.deleteRole(
  roleId,
  req.user.id
);
```

**Validation:**
- Cannot delete system roles
- Cannot delete roles assigned to users
- Returns error with user count if assigned

---

### Assigning Permission to Role

```typescript
const assignment = await AccessControlService.assignPermissionToRole(
  roleId,
  permissionId,
  req.user.id
);
```

**Validation:**
- Cannot modify system role permissions
- Both role and permission must exist
- Prevents duplicate assignments

---

### Assigning Role to User (with privilege escalation prevention)

```typescript
const userRole = await AccessControlService.assignRoleToUser(
  userId,
  roleId,
  req.user.id, // Assigning user ID
  false // bypassPrivilegeCheck - use true only for system initialization
);
```

**Validation:**
- Assigning user must have `users.manage` permission
- Assigning security/system roles requires `security.manage` permission
- Creates security incident for high-privilege role assignments
- Prevents privilege escalation attacks

---

## Frontend Usage

### Import Validation Schemas

```typescript
import {
  createRoleSchema,
  updateRoleSchema,
  createPermissionSchema,
  assignRoleToUserSchema,
  // ... other schemas
} from '@/validation';
```

---

### Validating Role Creation Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoleSchema } from '@/validation';

const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: zodResolver(createRoleSchema)
});

const onSubmit = async (data) => {
  try {
    await accessControlApi.createRole(data);
  } catch (error) {
    // Handle API errors
  }
};
```

---

### Validating Permission Creation

```typescript
import { createPermissionSchema } from '@/validation';

// Validate before API call
const result = createPermissionSchema.safeParse({
  resource: 'students',
  action: 'read',
  description: 'View student information'
});

if (!result.success) {
  console.error(result.error.errors);
  return;
}

await accessControlApi.createPermission(result.data);
```

---

### Validating IP Restrictions

```typescript
import { addIpRestrictionSchema } from '@/validation';

const result = addIpRestrictionSchema.safeParse({
  ipAddress: '192.168.1.100',
  type: 'WHITELIST',
  reason: 'Office network',
  createdBy: currentUser.id
});

if (result.success) {
  await accessControlApi.addIpRestriction(result.data);
}
```

---

## Validation Error Handling

### Backend Error Response

```typescript
// In your controller
try {
  const role = await AccessControlService.createRole(data, req.user.id);
  res.json({ role });
} catch (error) {
  if (error instanceof Error) {
    // Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    // Business logic errors
    return res.status(400).json({
      error: error.message
    });
  }

  res.status(500).json({ error: 'Internal server error' });
}
```

---

### Frontend Error Display

```typescript
const onSubmit = async (data) => {
  try {
    await accessControlApi.createRole(data);
    toast.success('Role created successfully');
  } catch (error) {
    if (error.response?.data?.details) {
      // Display field-specific errors
      error.response.data.details.forEach(detail => {
        setError(detail.field, { message: detail.message });
      });
    } else {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  }
};
```

---

## Common Validation Rules

### Role Names
- ✅ "School Nurse"
- ✅ "District_Administrator"
- ✅ "Health-Office-Manager"
- ❌ "SYSTEM" (reserved)
- ❌ "Admin@User" (invalid characters)
- ❌ "A" (too short)

### Permission Resources
- ✅ "students", "medications", "health_records"
- ✅ "security", "system", "compliance"
- ❌ "STUDENTS" (must be lowercase)
- ❌ "custom_resource" (not in valid list)

### Permission Actions
- ✅ "read", "create", "update", "delete"
- ✅ "manage", "administer", "configure"
- ❌ "READ" (must be lowercase)
- ❌ "custom_action" (not in valid list)

### IP Addresses
- ✅ "192.168.1.100"
- ✅ "192.168.1.0/24" (CIDR)
- ✅ "2001:0db8:85a3::8a2e:0370:7334" (IPv6)
- ❌ "127.0.0.1" (localhost blocked)
- ❌ "999.999.999.999" (invalid octets)

### Session Tokens
- ✅ Any string 32-512 characters
- ❌ "short" (too short)
- ❌ Very long strings > 512 chars

---

## Audit Logging

All security-critical operations are automatically logged. Access audit logs:

```typescript
import { auditService } from './services/auditService';

// Get audit logs for a specific user
const logs = await auditService.getUserAuditHistory(userId);

// Get audit logs for an entity
const entityLogs = await auditService.getEntityAuditHistory('Role', roleId);

// Search audit logs
const searchResults = await auditService.searchAuditLogs('role assignment');
```

---

## Security Best Practices

### 1. Always Pass User Context
```typescript
// ✅ Good - includes user for audit trail
await AccessControlService.createRole(data, req.user.id);

// ❌ Bad - no audit trail
await AccessControlService.createRole(data);
```

### 2. Validate Before Database Operations
```typescript
// ✅ Good - validate with Zod first
const result = createRoleSchema.safeParse(data);
if (result.success) {
  await api.createRole(result.data);
}

// ❌ Bad - let API handle all validation
await api.createRole(data);
```

### 3. Handle Privilege Escalation
```typescript
// ✅ Good - let service handle privilege checks
await AccessControlService.assignRoleToUser(userId, roleId, currentUserId);

// ❌ Bad - bypassing checks without reason
await AccessControlService.assignRoleToUser(userId, roleId, currentUserId, true);
```

### 4. Check Permissions Before UI Display
```typescript
// ✅ Good - check permissions before showing action
const userPerms = await accessControlApi.getUserPermissions(userId);
const canManageRoles = userPerms.permissions.some(
  p => p.resource === 'security' && p.action === 'manage'
);

if (canManageRoles) {
  // Show role management UI
}
```

---

## Testing

### Unit Test Example

```typescript
import { createRoleSchema } from '@/validation';

describe('Role Validation', () => {
  it('should validate correct role data', () => {
    const result = createRoleSchema.safeParse({
      name: 'Test Role',
      description: 'Test description'
    });

    expect(result.success).toBe(true);
  });

  it('should reject reserved role names', () => {
    const result = createRoleSchema.safeParse({
      name: 'SYSTEM'
    });

    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toContain('reserved');
  });

  it('should reject invalid characters', () => {
    const result = createRoleSchema.safeParse({
      name: 'Invalid@Role'
    });

    expect(result.success).toBe(false);
  });
});
```

---

## Environment-Specific Configuration

### Development
```typescript
// More verbose error messages
process.env.NODE_ENV === 'development' && console.log(validationError);
```

### Production
```typescript
// Generic error messages, detailed logging
logger.error('Validation failed', { error: validationError, userId });
res.status(400).json({ error: 'Validation failed' });
```

---

## Common Issues and Solutions

### Issue: "Role with name 'X' already exists"
**Solution:** Role names must be unique (case-insensitive). Choose a different name.

### Issue: "Cannot delete role: It is assigned to 3 user(s)"
**Solution:** Remove all user assignments first, then delete the role.

### Issue: "Cannot modify system roles"
**Solution:** System roles are protected. Create a new custom role instead.

### Issue: "You do not have permission to assign roles to users"
**Solution:** You need `users.manage` permission. Contact an administrator.

### Issue: "You do not have sufficient privileges to assign this role"
**Solution:** The role contains security/system permissions. You need `security.manage` permission.

---

## Additional Resources

- Full Documentation: `docs/ACCESS_CONTROL_VALIDATION_SUMMARY.md`
- API Documentation: `/api-docs`
- Type Definitions: `frontend/src/types/accessControl.ts`
- Backend Models: `backend/src/database/models/security/`
- Frontend Schemas: `frontend/src/validation/accessControlSchemas.ts`

---

**Last Updated:** 2025-10-11
