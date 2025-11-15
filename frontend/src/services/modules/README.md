# Services to Actions Migration Guide

## Overview

This document provides a comprehensive guide for migrating from the legacy `services/modules` API layer to the modern `lib/actions` server actions architecture. The migration improves type safety, reduces client bundle sizes, and provides better server-side rendering support.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Architecture Overview](#architecture-overview)
- [Migration Timeline](#migration-timeline)
- [Import Path Changes](#import-path-changes)
- [Client vs Server API](#client-vs-server-api)
- [Migration Examples](#migration-examples)
- [Breaking Changes](#breaking-changes)
- [Troubleshooting](#troubleshooting)

## Why Migrate?

### Benefits of Server Actions

1. **Reduced Bundle Size**: Server actions run on the server, eliminating large API client code from the client bundle
2. **Better Type Safety**: End-to-end type safety from server to client with TypeScript
3. **Improved Performance**: Server-side data fetching with automatic caching and revalidation
4. **Simplified Auth**: Authentication handled automatically on the server
5. **Better Error Handling**: Centralized error handling with proper error boundaries
6. **SEO Benefits**: Server-side rendering with fresh data on every request

### What's Changing

- **Old**: Client-side API services (`@/services/modules/*Api`)
- **New**: Server actions (`@/lib/actions/*.actions`)

## Architecture Overview

### Legacy Architecture (services/modules)

```
Component → Service API → ApiClient → Backend
```

**Issues:**
- Large client bundle (includes axios, API client, all services)
- Client-side authentication complexity
- Manual cache management
- No SSR support

### New Architecture (lib/actions)

```
Component → Server Action → Server API Client → Backend
```

**Advantages:**
- Zero client bundle impact (runs on server)
- Automatic auth via cookies
- Built-in caching and revalidation
- Full SSR support

## Migration Timeline

| Phase | Deadline | Status |
|-------|----------|--------|
| **Phase 1: Documentation** | 2025-11-30 | ✅ Complete |
| **Phase 2: Deprecation Warnings** | 2025-12-31 | 🔄 In Progress |
| **Phase 3: Gradual Migration** | 2026-03-31 | 📋 Planned |
| **Phase 4: Legacy Removal** | 2026-06-30 | 📋 Planned |

### Deprecation Schedule

- **2025-12-31**: All service modules marked as deprecated
- **2026-03-31**: Migration to actions required for new features
- **2026-06-30**: Legacy services removed from codebase

## Import Path Changes

### Service to Action Mapping

| Legacy Service | New Server Action | Status |
|----------------|-------------------|--------|
| `auditApi` | `admin.audit-logs.ts` | ✅ Available |
| `authApi` | Auth handled by NextAuth | ✅ Migrated |
| `complianceApi` | `compliance.actions.ts` | ✅ Available |
| `contactsApi` | Not yet migrated | ⚠️ Use service |
| `dashboardApi` | `dashboard.actions.ts` | ✅ Available |
| `incidentsApi` | `incidents.actions.ts` | ✅ Available |
| `integrationApi` | `admin.integrations.ts` | ✅ Available |
| `inventoryApi` | `inventory.actions.ts` | ✅ Available |
| `medicationsApi` | `medications.actions.ts` | ✅ Available |
| `reportsApi` | `reports.actions.ts` + `analytics.actions.ts` | ✅ Available |
| `studentsApi` | `students.actions.ts` | ✅ Available |
| `systemApi` | `admin.monitoring.ts` + `admin.settings.ts` | ✅ Available |
| `usersApi` | `admin.users.ts` | ✅ Available |
| `vendorApi` | `vendors.actions.ts` | ✅ Available |

### Import Examples

**Before (Legacy Service):**
```typescript
import { studentsApi } from '@/services/modules/studentsApi';

const students = await studentsApi.getAll({ page: 1, limit: 20 });
```

**After (Server Action):**
```typescript
import { getStudents } from '@/lib/actions/students.actions';

const students = await getStudents({ page: 1, limit: 20 });
```

## Client vs Server API

### When to Use Server Actions (`@/lib/actions`)

Use server actions for:
- ✅ Server Components (default in Next.js 14+)
- ✅ API Routes
- ✅ Server-side data fetching
- ✅ Form submissions with `useActionState`
- ✅ Mutations from Server Components

**Example:**
```typescript
// app/students/page.tsx (Server Component)
import { getStudents } from '@/lib/actions/students.actions';

export default async function StudentsPage() {
  const students = await getStudents({ page: 1, limit: 20 });

  return <StudentsList students={students} />;
}
```

### When to Use Client API (`@/lib/api/client`)

Use client API for:
- ✅ Client Components with real-time updates
- ✅ Interactive features (search, filters)
- ✅ Optimistic updates
- ✅ Client-side mutations with TanStack Query

**Example:**
```typescript
'use client';

import { apiClient } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

export function StudentSearch() {
  const { data } = useQuery({
    queryKey: ['students', searchQuery],
    queryFn: () => apiClient.get('/students', { params: { search: searchQuery } })
  });

  return <SearchResults data={data} />;
}
```

### When to Use Server API (`@/lib/api/server`)

Use server API for:
- ✅ Server-side data fetching in Server Components
- ✅ API routes that need direct backend access
- ✅ Background jobs and cron tasks
- ✅ Server-side mutations

**Example:**
```typescript
// app/api/students/route.ts
import { apiServer } from '@/lib/api/server';

export async function GET(request: Request) {
  const students = await apiServer.get('/students');
  return Response.json(students);
}
```

## Migration Examples

### Example 1: Simple Data Fetching

**Before:**
```typescript
'use client';

import { studentsApi } from '@/services/modules/studentsApi';
import { useEffect, useState } from 'react';

export function StudentsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    studentsApi.getAll().then(setStudents);
  }, []);

  return <div>{/* render students */}</div>;
}
```

**After:**
```typescript
// app/students/page.tsx (Server Component)
import { getStudents } from '@/lib/actions/students.actions';
import { StudentsList } from './students-list';

export default async function StudentsPage() {
  const students = await getStudents();

  return <StudentsList students={students} />;
}
```

### Example 2: Form Submission

**Before:**
```typescript
'use client';

import { studentsApi } from '@/services/modules/studentsApi';

export function CreateStudentForm() {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    await studentsApi.create(Object.fromEntries(formData));
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

**After:**
```typescript
'use client';

import { createStudent } from '@/lib/actions/students.actions';
import { useActionState } from 'react';

export function CreateStudentForm() {
  const [state, formAction] = useActionState(createStudent, { success: false });

  return (
    <form action={formAction}>
      {/* form fields */}
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

### Example 3: Search with Client-Side Interaction

**Before:**
```typescript
'use client';

import { studentsApi } from '@/services/modules/studentsApi';
import { useState, useEffect } from 'react';

export function StudentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      studentsApi.getAll({ search: query }).then(setResults);
    }
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* render results */}
    </div>
  );
}
```

**After (Option 1: Using TanStack Query with apiClient):**
```typescript
'use client';

import { apiClient } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function StudentSearch() {
  const [query, setQuery] = useState('');

  const { data: results } = useQuery({
    queryKey: ['students', 'search', query],
    queryFn: () => apiClient.get('/students', { params: { search: query } }),
    enabled: query.length > 0
  });

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* render results */}
    </div>
  );
}
```

**After (Option 2: Using Server Action with useTransition):**
```typescript
'use client';

import { searchStudents } from '@/lib/actions/students.actions';
import { useState, useTransition } from 'react';

export function StudentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value);
    startTransition(async () => {
      const data = await searchStudents(value);
      setResults(data);
    });
  }

  return (
    <div>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      {/* render results */}
    </div>
  );
}
```

### Example 4: Dashboard Statistics

**Before:**
```typescript
'use client';

import { dashboardApi } from '@/services/modules/dashboardApi';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.getDashboardStats().then(setStats);
  }, []);

  return stats ? <DashboardStats stats={stats} /> : <Loading />;
}
```

**After:**
```typescript
// app/dashboard/page.tsx (Server Component)
import { getDashboardStats } from '@/lib/actions/dashboard.actions';
import { DashboardStats } from './dashboard-stats';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return <DashboardStats stats={stats} />;
}
```

### Example 5: Medication Administration

**Before:**
```typescript
'use client';

import { medicationsApi } from '@/services/modules/medicationsApi';

export function AdministerMedicationForm({ studentId, medicationId }) {
  async function handleSubmit(e) {
    e.preventDefault();
    await medicationsApi.logAdministration({
      studentMedicationId: medicationId,
      administeredBy: currentUser.id,
      administeredAt: new Date().toISOString(),
      notes: e.target.notes.value
    });
    // Refresh data
  }

  return <form onSubmit={handleSubmit}>{/* form */}</form>;
}
```

**After:**
```typescript
'use client';

import { administerMedication } from '@/lib/actions/medications.actions';
import { useActionState } from 'react';

export function AdministerMedicationForm({ studentId, medicationId }) {
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      return administerMedication({
        studentMedicationId: medicationId,
        notes: formData.get('notes')
      });
    },
    { success: false }
  );

  return (
    <form action={formAction}>
      <textarea name="notes" />
      <button type="submit">Administer</button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Medication administered</p>}
    </form>
  );
}
```

## Breaking Changes

### Authentication

**Before:**
```typescript
import { authApi } from '@/services/modules/authApi';

const response = await authApi.login({ email, password });
if (response.success) {
  // Handle login
}
```

**After:**
```typescript
// Use NextAuth for authentication
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', { email, password, redirect: false });
if (result?.ok) {
  // Handle login
}
```

### Error Handling

**Before:**
```typescript
try {
  await studentsApi.create(data);
} catch (error) {
  console.error('API Error:', error.message);
}
```

**After (Server Action):**
```typescript
const result = await createStudent(data);

if (!result.success) {
  console.error('Error:', result.error);
  return;
}

// Success - result.data contains the student
```

### Pagination

**Before:**
```typescript
const response = await studentsApi.getAll({ page: 1, limit: 20 });
// response.data, response.total, response.page, response.totalPages
```

**After:**
```typescript
const response = await getStudents({ page: 1, limit: 20 });
// Same structure: response.data, response.total, response.page, response.totalPages
```

### File Uploads

**Before:**
```typescript
const formData = new FormData();
formData.append('file', file);
await documentsApi.upload(formData);
```

**After:**
```typescript
// Server Action automatically handles FormData
<form action={uploadDocument}>
  <input type="file" name="file" />
  <button type="submit">Upload</button>
</form>
```

## Troubleshooting

### "Cannot use server actions in client components"

**Problem:** Trying to call a server action directly in a client component.

**Solution:** Wrap in `useTransition` or `useActionState`:

```typescript
'use client';

import { useTransition } from 'react';
import { deleteStudent } from '@/lib/actions/students.actions';

function DeleteButton({ studentId }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => deleteStudent(studentId))}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### "Session undefined in server action"

**Problem:** Can't access user session in server action.

**Solution:** Use `auth()` from NextAuth:

```typescript
'use server';

import { auth } from '@/lib/auth';

export async function createStudent(data) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Proceed with creation
}
```

### "CORS errors with API client"

**Problem:** CORS errors when using `@/lib/api/client`.

**Solution:** Ensure API requests go through Next.js API routes:

```typescript
// Instead of direct backend calls:
// apiClient.get('https://backend.com/api/students')

// Use Next.js API routes:
apiClient.get('/api/students')
```

### "Data not refreshing after mutation"

**Problem:** UI doesn't update after server action completes.

**Solution:** Use `revalidatePath` or `revalidateTag`:

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function createStudent(data) {
  const result = await apiServer.post('/students', data);

  // Revalidate the students page
  revalidatePath('/students');

  return { success: true, data: result };
}
```

## Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [TanStack Query Guide](https://tanstack.com/query/latest/docs/react/overview)
- [White Cross API Documentation](/docs/api)
- [Migration Support](mailto:support@whitecross.dev)

## Getting Help

If you encounter issues during migration:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review the [Breaking Changes](#breaking-changes) section
3. Consult the [DEPRECATED.md](./DEPRECATED.md) file for specific service mappings
4. Open an issue on GitHub
5. Contact the development team

---

**Last Updated:** 2025-11-15
**Version:** 1.0.0
