# Administration API Migration Guide

## Overview

This document provides a comprehensive guide for migrating from the deprecated class-based Administration Service API to the new Next.js server actions architecture.

## Why Migrate?

The new server actions architecture provides:

- **Better Type Safety**: Automatic TypeScript inference without manual type annotations
- **Next.js Integration**: Built-in cache and revalidation support
- **HIPAA Compliance**: Automatic audit logging for all operations
- **Simplified Code**: No need to manage ApiClient instances
- **Better Performance**: Leverages Next.js 14+ App Router optimizations
- **Server-First**: Secure by default, runs on server side

## Migration Status

| Service Module | Server Action Equivalent | Status | Notes |
|---------------|-------------------------|---------|-------|
| User Management | `admin.users.ts` | ✅ Complete | Full CRUD + utilities |
| District Management | `admin.districts.ts` | ✅ Complete | Read operations |
| School Management | `admin.schools.ts` | ✅ Complete | Read operations |
| System Settings | `admin.settings.ts` | ✅ Complete | Update operations |
| Configuration | `admin.configuration.ts` | ✅ Complete | Full CRUD |
| Monitoring | `admin.monitoring.ts` | ✅ Complete | Health, metrics, logs |
| Audit Logs | `admin.audit-logs.ts` | ✅ Complete | Full query support |
| Cache Management | `admin.cache.ts` | ✅ Complete | Read operations |
| License Management | - | 🚧 Planned | Migration pending |
| Training Management | - | 🚧 Planned | Migration pending |
| Access Control/RBAC | - | 🚧 Planned | Migration pending |

## Quick Reference: API Mapping

### User Management

```typescript
// OLD: Service API
import { administrationApi } from '@/services/modules/administrationApi';

const users = await administrationApi.getUsers({ isActive: true });
const user = await administrationApi.createUser(userData);
await administrationApi.updateUser(userId, updateData);
await administrationApi.deleteUser(userId);

// NEW: Server Actions
import {
  getAdminUsers,
  createAdminUserAction,
  updateAdminUserAction,
  deleteAdminUserAction
} from '@/lib/actions/admin';

const users = await getAdminUsers({ isActive: true });
const user = await createAdminUserAction(userData);
await updateAdminUserAction(userId, updateData);
await deleteAdminUserAction(userId);
```

### District Management

```typescript
// OLD: Service API
const districts = await administrationApi.getDistricts(1, 20);
const district = await administrationApi.getDistrictById(districtId);
const newDistrict = await administrationApi.createDistrict(districtData);
await administrationApi.updateDistrict(districtId, updateData);
await administrationApi.deleteDistrict(districtId);

// NEW: Server Actions
import {
  getAdminDistricts,
  getAdminDistrictById,
  revalidateDistrictsCache
} from '@/lib/actions/admin';

const districts = await getAdminDistricts({ page: 1, limit: 20 });
const district = await getAdminDistrictById(districtId);
// Note: Create/Update/Delete actions are planned
// For now, use the service API for write operations
```

### School Management

```typescript
// OLD: Service API
const schools = await administrationApi.getSchools(1, 20, districtId);
const school = await administrationApi.getSchoolById(schoolId);
const newSchool = await administrationApi.createSchool(schoolData);
await administrationApi.updateSchool(schoolId, updateData);
await administrationApi.deleteSchool(schoolId);

// NEW: Server Actions
import {
  getAdminSchools,
  getAdminSchoolById,
  revalidateSchoolsCache
} from '@/lib/actions/admin';

const schools = await getAdminSchools({ page: 1, limit: 20, districtId });
const school = await getAdminSchoolById(schoolId);
// Note: Create/Update/Delete actions are planned
```

### System Configuration

```typescript
// OLD: Service API
const config = await administrationApi.getConfigurations();
const setting = await administrationApi.getConfigurationByKey('key');
await administrationApi.setConfiguration(configData);
await administrationApi.deleteConfiguration('key');

// NEW: Server Actions
import {
  getSystemConfiguration,
  updateSystemConfiguration,
  getConfigurationAuditTrail,
  resetConfigurationToDefaults
} from '@/lib/actions/admin';

const config = await getSystemConfiguration();
await updateSystemConfiguration(configData);
const auditTrail = await getConfigurationAuditTrail();
await resetConfigurationToDefaults();
```

### System Health & Monitoring

```typescript
// OLD: Service API
const health = await administrationApi.getSystemHealth();
const metrics = await administrationApi.getMetrics();
await administrationApi.recordMetric(metricData);

// NEW: Server Actions
import {
  getSystemHealth,
  getPerformanceMetrics,
  getApiMetrics,
  getErrorLogs,
  getUserActivity,
  getRealTimeMetrics
} from '@/lib/actions/admin';

const health = await getSystemHealth();
const perfMetrics = await getPerformanceMetrics('24h');
const apiMetrics = await getApiMetrics();
const errors = await getErrorLogs({ severity: 'error', limit: 50 });
const activity = await getUserActivity({ userId, days: 7 });
const realtime = await getRealTimeMetrics();
```

### Audit Logs

```typescript
// OLD: Service API
const logs = await administrationApi.getAuditLogs({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});

// NEW: Server Actions
import {
  getAuditLogs,
  getAuditLogStats,
  getAuditLogById,
  exportAuditLogs,
  getAuditLogFilterOptions,
  archiveAuditLogs
} from '@/lib/actions/admin';

const logs = await getAuditLogs({
  startDate: '2025-01-01',
  endDate: '2025-01-31'
});
const stats = await getAuditLogStats();
const log = await getAuditLogById(logId);
const exportData = await exportAuditLogs({ format: 'csv', filters });
const filterOptions = await getAuditLogFilterOptions();
await archiveAuditLogs({ beforeDate: '2024-01-01' });
```

## Step-by-Step Migration Process

### 1. Identify Current Usage

Search your codebase for imports:

```bash
# Find all usage of administrationApi
grep -r "from '@/services/modules/administrationApi'" src/
grep -r "from '@/services/modules/AdministrationService'" src/

# Find all usage of accessControlApi
grep -r "from '@/services/modules/accessControlApi'" src/
```

### 2. Replace Imports

**Before:**
```typescript
import { administrationApi } from '@/services/modules/administrationApi';
import { AdministrationApi } from '@/services/modules/AdministrationService';
```

**After:**
```typescript
import {
  getAdminUsers,
  getAdminDistricts,
  getSystemHealth,
  // ... other actions as needed
} from '@/lib/actions/admin';
```

### 3. Update Function Calls

Replace class method calls with server action calls:

**Before:**
```typescript
async function loadData() {
  const districts = await administrationApi.getDistricts();
  const users = await administrationApi.getUsers();
  return { districts, users };
}
```

**After:**
```typescript
async function loadData() {
  const districts = await getAdminDistricts();
  const users = await getAdminUsers();
  return { districts, users };
}
```

### 4. Handle Client Components

Server actions can be called from client components:

**Client Component Example:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAdminDistricts } from '@/lib/actions/admin';

export function DistrictsList() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await getAdminDistricts();
        setDistricts(data);
      } catch (error) {
        console.error('Failed to load districts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDistricts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {districts.map(d => (
        <li key={d.id}>{d.name}</li>
      ))}
    </ul>
  );
}
```

### 5. Update Forms

For form submissions with server actions:

**Before:**
```typescript
async function handleSubmit(formData: FormData) {
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
  };

  await administrationApi.createUser(userData);
}
```

**After:**
```typescript
import { createAdminUserFromForm } from '@/lib/actions/admin';

async function handleSubmit(formData: FormData) {
  // Server action can handle FormData directly
  await createAdminUserFromForm(formData);
}

// Or in a form component:
<form action={createAdminUserFromForm}>
  <input name="name" />
  <input name="email" />
  <button type="submit">Create User</button>
</form>
```

### 6. Cache Revalidation

Server actions automatically handle cache revalidation:

**Before:**
```typescript
// Manual cache invalidation was complex
await administrationApi.createDistrict(data);
// No automatic cache clearing
```

**After:**
```typescript
import { revalidateDistrictsCache } from '@/lib/actions/admin';

// Actions automatically revalidate
await createDistrictAction(data);

// Or manually revalidate if needed
await revalidateDistrictsCache();
```

## Common Patterns

### Pattern 1: Server Component Data Fetching

```typescript
// app/admin/users/page.tsx
import { getAdminUsers } from '@/lib/actions/admin';

export default async function UsersPage() {
  const users = await getAdminUsers();

  return (
    <div>
      <h1>Users</h1>
      <UsersList users={users} />
    </div>
  );
}
```

### Pattern 2: Client Component with Server Actions

```typescript
// components/CreateUserForm.tsx
'use client';

import { createAdminUserAction } from '@/lib/actions/admin';
import { useState } from 'react';

export function CreateUserForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const result = await createAdminUserAction({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });

    if (!result.success) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Pattern 3: Optimistic Updates

```typescript
'use client';

import { updateAdminUserAction } from '@/lib/actions/admin';
import { useOptimistic } from 'react';

export function UserProfile({ user }) {
  const [optimisticUser, addOptimisticUpdate] = useOptimistic(
    user,
    (state, newData) => ({ ...state, ...newData })
  );

  async function updateName(formData: FormData) {
    const newName = formData.get('name') as string;

    // Show optimistic update immediately
    addOptimisticUpdate({ name: newName });

    // Perform actual update
    await updateAdminUserAction(user.id, { name: newName });
  }

  return (
    <form action={updateName}>
      <input name="name" defaultValue={optimisticUser.name} />
      <button type="submit">Update</button>
    </form>
  );
}
```

## Troubleshooting

### Issue: "Cannot use server actions in client component"

**Solution:** Server actions can be imported and called from client components. Make sure you're not trying to define them in a client component.

### Issue: "Type errors after migration"

**Solution:** Server actions have better type inference. Remove manual type annotations and let TypeScript infer types automatically.

### Issue: "Cache not updating after mutations"

**Solution:** Use the revalidation functions provided:
```typescript
import { revalidateDistrictsCache } from '@/lib/actions/admin';
await revalidateDistrictsCache();
```

## Testing

### Unit Tests

```typescript
// __tests__/admin.test.ts
import { getAdminUsers } from '@/lib/actions/admin';

jest.mock('@/lib/actions/admin', () => ({
  getAdminUsers: jest.fn(),
}));

describe('Admin Users', () => {
  it('should fetch users', async () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    (getAdminUsers as jest.Mock).mockResolvedValue(mockUsers);

    const users = await getAdminUsers();
    expect(users).toEqual(mockUsers);
  });
});
```

## Timeline

- **Phase 1 (Complete)**: Core read operations (users, districts, schools, configuration)
- **Phase 2 (In Progress)**: Write operations (create, update, delete)
- **Phase 3 (Planned)**: Advanced features (license management, training, access control)
- **Phase 4 (Planned)**: Deprecation of old service API

## Support

For questions or issues during migration:

1. Check this document first
2. Review `/lib/actions/admin.actions.ts` for available actions
3. Check individual action files for detailed documentation
4. Contact the development team

## Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [TypeScript Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#typescript)
- Project-specific: `/lib/actions/README.md` (if available)
