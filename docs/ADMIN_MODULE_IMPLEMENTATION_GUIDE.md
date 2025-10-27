# Admin Module Implementation Guide

## Overview

This document provides a comprehensive guide to completing the admin module migration for White Cross healthcare platform. The foundation has been laid with production-grade validation schemas, architecture documentation, and coordination files.

## Completed Work (Phase 1-2)

### 1. Validation Schemas (100% Complete)
All Zod validation schemas have been created with comprehensive type safety:

- **user.schemas.ts** (434 lines) - User CRUD, MFA, roles, permissions, sessions
- **role.schemas.ts** (428 lines) - Role management, permissions, hierarchy
- **settings.schemas.ts** (402 lines) - System, school, and integration settings
- **admin.schemas.ts** (481 lines) - API keys, webhooks, system health, logs

Total: **1,745 lines of type-safe validation schemas**

### 2. Architecture Documentation
- **architecture-notes-ADM2X9.md** - Complete security architecture, data flows, HIPAA compliance
- **plan-ADM2X9.md** - 6-phase implementation plan with timelines
- **checklist-ADM2X9.md** - 180+ granular checklist items
- **integration-map-ADM2X9.json** - Complete API surface mapping
- **progress-ADM2X9.md** - Progress tracking
- **task-status-ADM2X9.json** - Agent coordination

## Remaining Work (Phase 3-6)

### Phase 3: Server Actions (PRIORITY)

Create **2 server action files** with **29 total actions**:

#### File 1: `nextjs/src/actions/admin.actions.ts`

**User Management Actions** (8 actions):
```typescript
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  resetUserPasswordSchema,
  toggleUserStatusSchema,
  assignRoleSchema,
  removeRoleSchema,
  updateUserPermissionsSchema
} from '@/schemas/user.schemas';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';

// Helper: Get auth token from cookies
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// Helper: Verify MFA (required for ALL admin actions)
async function verifyMFA(code: string, action: string) {
  const token = await getAuthToken();
  const response = await fetch(`${BACKEND_URL}/auth/verify-mfa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code, action })
  });

  if (!response.ok) {
    throw new Error('MFA verification failed');
  }

  return await response.json();
}

// Helper: Check IP restrictions
async function checkIPRestriction(userId?: string) {
  // Implementation would check user's IP whitelist
  return true;
}

export async function createUser(data: z.infer<typeof createUserSchema>, mfaCode: string) {
  try {
    // 1. Validate input
    const validated = createUserSchema.parse(data);

    // 2. Verify MFA
    await verifyMFA(mfaCode, 'CREATE_USER');

    // 3. Check IP restriction
    await checkIPRestriction();

    // 4. Call backend API
    const token = await getAuthToken();
    const response = await fetch(`${BACKEND_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validated)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    const user = await response.json();

    // 5. Audit log
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_USER,
      resource: 'User',
      resourceId: user.id,
      details: `Created user ${user.email}`,
      success: true,
      metadata: {
        userEmail: user.email,
        role: user.role,
        mfaVerified: true
      }
    });

    // 6. Revalidate cache
    revalidateTag('users');

    return { success: true, data: user };
  } catch (error) {
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_USER,
      resource: 'User',
      resourceId: null,
      details: `Failed to create user: ${error.message}`,
      success: false,
      metadata: { error: error.message }
    });

    return { success: false, error: error.message };
  }
}

// Additional actions follow same pattern:
// - updateUser
// - deleteUser
// - resetUserPassword
// - toggleUserStatus
// - assignRole
// - removeRole
// - updateUserPermissions
```

**Role Management Actions** (5 actions):
- createRole
- updateRole
- deleteRole
- assignPermissions
- cloneRole

**API Key Management Actions** (4 actions):
- createAPIKey
- revokeAPIKey
- rotateAPIKey
- listAPIKeys

**Webhook Management Actions** (4 actions):
- createWebhook
- updateWebhook
- deleteWebhook
- testWebhook

**System Management Actions** (4 actions):
- getSystemHealth
- getSystemLogs
- clearCache
- runMaintenance

**Total for admin.actions.ts**: ~800-1000 lines

#### File 2: `nextjs/src/actions/system.actions.ts`

**Settings Management Actions** (4 actions):
- updateSystemSettings
- updateSchoolSettings
- updateIntegrationSettings
- testIntegration

**Total for system.actions.ts**: ~300-400 lines

### Phase 4: Core Components (12 Components)

All components should follow Next.js 15 + React 19 patterns:

#### Server Components (Default)
Use for data fetching and initial rendering:
- UserManagement.tsx (list view)
- RoleManagement.tsx (list view)

#### Client Components ('use client')
Use for interactivity:
- UserForm.tsx
- UserPermissions.tsx
- RoleForm.tsx
- PermissionMatrix.tsx (interactive grid)
- SchoolSettings.tsx
- IntegrationSettings.tsx
- SystemHealthMonitor.tsx (real-time metrics)
- SystemLogs.tsx (real-time streaming)
- APIKeyManager.tsx
- WebhookManager.tsx

**Component Pattern Example**:

```typescript
// UserForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/schemas/user.schemas';
import { createUser } from '@/actions/admin.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UserForm({ onSuccess }: { onSuccess?: () => void }) {
  const [mfaCode, setMfaCode] = useState('');
  const [showMFAPrompt, setShowMFAPrompt] = useState(false);

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'nurse',
      mfaRequired: false,
      sendWelcomeEmail: true
    }
  });

  const onSubmit = async (data) => {
    if (!showMFAPrompt) {
      // First submission - show MFA prompt
      setShowMFAPrompt(true);
      return;
    }

    // Second submission with MFA code
    const result = await createUser(data, mfaCode);

    if (result.success) {
      toast.success('User created successfully');
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}

      {showMFAPrompt && (
        <div className="mfa-prompt">
          <Input
            type="text"
            maxLength={6}
            placeholder="Enter MFA code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
          />
        </div>
      )}

      <Button type="submit">
        {showMFAPrompt ? 'Confirm with MFA' : 'Create User'}
      </Button>
    </form>
  );
}
```

### Phase 5: Route Implementation (16 Routes)

#### Route Structure

```
nextjs/src/app/(dashboard)/admin/
├── page.tsx                           # Admin dashboard
├── users/
│   ├── page.tsx                       # User list
│   ├── new/page.tsx                   # Create user
│   ├── [id]/
│   │   ├── page.tsx                   # User details
│   │   └── permissions/page.tsx       # User permissions
├── roles/
│   ├── page.tsx                       # Role list
│   ├── new/page.tsx                   # Create role
│   └── [id]/page.tsx                  # Role details
├── permissions/page.tsx               # Permission matrix
├── settings/page.tsx                  # System settings
├── school/page.tsx                    # School settings
├── integrations/page.tsx              # Integrations
├── api-keys/page.tsx                  # API keys
├── webhooks/page.tsx                  # Webhooks
├── health/page.tsx                    # System health
└── logs/page.tsx                      # Audit logs
```

#### Route Pattern Example

```typescript
// app/(dashboard)/admin/users/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import { UserManagement } from '@/components/admin/UserManagement';
import { Loading } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'User Management | Admin',
  description: 'Manage system users, roles, and permissions'
};

export default async function UsersPage({
  searchParams
}: {
  searchParams: { page?: string; role?: string; status?: string }
}) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link href="/admin/users/new">
          <Button>Create User</Button>
        </Link>
      </div>

      <Suspense fallback={<Loading />}>
        <UserManagement searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
```

### Phase 6: Testing and HIPAA Validation

#### Unit Tests
Create tests for:
- All validation schemas
- Server action logic
- Permission calculations
- MFA verification

#### Integration Tests
Test complete flows:
- User creation with MFA
- Role assignment with permission validation
- System settings update with audit logging
- API key generation and usage

#### HIPAA Compliance Checklist
- [ ] All admin operations have audit logs
- [ ] MFA enforced for all admin actions
- [ ] IP restrictions validated
- [ ] No PHI in error messages
- [ ] Session timeout enforced (15 minutes for admin)
- [ ] Password policy enforced
- [ ] Concurrent session limiting
- [ ] Audit log retention (7 years)

## Implementation Priority

### Week 1: Core Functionality
1. Create admin.actions.ts (user and role management)
2. Create system.actions.ts (settings)
3. Build UserForm and RoleForm components
4. Implement /admin/users routes (list, new, [id])
5. Implement /admin/roles routes (list, new, [id])

### Week 2: Advanced Features
6. Build PermissionMatrix component
7. Build APIKeyManager and WebhookManager
8. Implement /admin/api-keys route
9. Implement /admin/webhooks route
10. Implement /admin/settings and /admin/school routes

### Week 3: Monitoring and Testing
11. Build SystemHealthMonitor component
12. Build SystemLogs component
13. Implement /admin/health and /admin/logs routes
14. Write comprehensive tests
15. Complete HIPAA validation

## Key Patterns to Follow

### 1. MFA Enforcement
**EVERY admin action must**:
```typescript
// 1. Require MFA code as parameter
async function adminAction(data, mfaCode: string) {
  // 2. Verify MFA before proceeding
  await verifyMFA(mfaCode, 'ACTION_NAME');

  // 3. Proceed with action
  // ...
}
```

### 2. Audit Logging
**EVERY admin action must**:
```typescript
// Log before action
await auditLog({
  action: AUDIT_ACTIONS.ACTION_NAME,
  resource: 'ResourceType',
  resourceId: id,
  details: 'Description of action',
  success: true/false,
  metadata: { /* relevant data */ }
});
```

### 3. IP Restriction Validation
**Check IP restrictions** for admin users:
```typescript
await checkIPRestriction(userId);
```

### 4. Cache Invalidation
**Revalidate cache** after mutations:
```typescript
revalidateTag('users');
revalidateTag(`user-${id}`);
```

### 5. Error Handling
**Consistent error handling**:
```typescript
try {
  // Action logic
  return { success: true, data };
} catch (error) {
  await auditLog({ /* failure log */ });
  return { success: false, error: error.message };
}
```

## Security Considerations

1. **No PHI in URLs** - Use UUIDs only, never names or personal data
2. **No PHI in Logs** - Audit logs should reference IDs, not actual PHI
3. **No PHI in Error Messages** - Generic errors only, details in audit logs
4. **Rate Limiting** - Implement on all admin endpoints
5. **Session Management** - 15-minute timeout for admin users
6. **IP Whitelisting** - Optional but recommended for production

## Performance Optimizations

1. **Pagination** - All list views use cursor-based pagination (50 items/page)
2. **Caching** - Server components cache data, revalidate on mutations
3. **Lazy Loading** - Components load on demand
4. **Real-time** - Use WebSockets for health monitoring and logs (optional)

## Testing Strategy

### Unit Tests (Vitest)
```typescript
// user.schemas.test.ts
import { createUserSchema } from '@/schemas/user.schemas';

describe('createUserSchema', () => {
  it('should validate correct user data', () => {
    const data = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'nurse'
    };

    expect(() => createUserSchema.parse(data)).not.toThrow();
  });

  it('should reject weak passwords', () => {
    const data = { /* ... */ password: 'weak' };
    expect(() => createUserSchema.parse(data)).toThrow();
  });
});
```

### Integration Tests (Playwright)
```typescript
// admin-user-management.spec.ts
import { test, expect } from '@playwright/test';

test('create user with MFA', async ({ page }) => {
  await page.goto('/admin/users/new');

  // Fill form
  await page.fill('[name="email"]', 'newuser@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  // ... fill other fields

  await page.click('button[type="submit"]');

  // Expect MFA prompt
  await expect(page.locator('.mfa-prompt')).toBeVisible();

  // Enter MFA code
  await page.fill('[name="mfaCode"]', '123456');
  await page.click('button:has-text("Confirm with MFA")');

  // Expect success
  await expect(page.locator('.toast-success')).toBeVisible();
});
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database indexes created for admin tables
- [ ] Audit log retention policy configured
- [ ] MFA enforcement enabled in production
- [ ] IP whitelist configured for admin access
- [ ] Session timeout configured (15 min for admin)
- [ ] Rate limiting enabled on all admin endpoints
- [ ] Backup and restore procedures tested
- [ ] Webhook delivery monitoring enabled
- [ ] System health alerts configured

## Support and Maintenance

### Monitoring
- Track admin action metrics (create/update/delete rates)
- Monitor MFA failures
- Track failed login attempts
- Monitor API key usage
- Track webhook delivery success rates

### Alerts
- Critical system health issues
- Failed admin operations
- Suspicious admin activity
- MFA bypass attempts
- IP restriction violations

## Estimated Completion Time

Based on the work remaining:

- **Phase 3** (Server Actions): 3-4 hours
- **Phase 4** (Components): 4-5 hours
- **Phase 5** (Routes): 6-8 hours
- **Phase 6** (Testing): 3-4 hours

**Total**: 16-21 hours of focused development

## Next Steps

1. **Immediate**: Create `nextjs/src/actions/admin.actions.ts` following the pattern above
2. **Short-term**: Implement user and role management routes
3. **Medium-term**: Build system settings and monitoring features
4. **Long-term**: Complete testing and HIPAA validation

---

**Agent ID**: ADM2X9
**Status**: Phase 2 Complete, Ready for Phase 3
**Last Updated**: 2025-10-26
