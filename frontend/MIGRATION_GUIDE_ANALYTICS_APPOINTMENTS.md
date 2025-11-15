# Analytics and Appointments API Migration Guide

**Version**: 2.0.0
**Date**: 2025-11-15
**Status**: Deprecation Notice
**Removal Scheduled**: Q2 2025

## Table of Contents

1. [Overview](#overview)
2. [What's Changing](#whats-changing)
3. [Migration Paths](#migration-paths)
4. [Detailed Examples](#detailed-examples)
5. [API Mapping Reference](#api-mapping-reference)
6. [Migration Checklist](#migration-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The legacy service layer modules for Analytics and Appointments are being deprecated in favor of:

1. **Server Actions** (RECOMMENDED) - For Server Components and Server Actions
2. **New API Client** - For client-side components with React Query

### Why This Change?

- **Type Safety**: End-to-end TypeScript inference from server to client
- **Performance**: Reduced bundle size, automatic code splitting
- **Caching**: Better integration with Next.js cache using `React.cache()`
- **Security**: Server-side execution protects sensitive business logic
- **Simplicity**: Eliminates need for separate service layer abstractions
- **Consistency**: Unified pattern across all application domains

---

## What's Changing

### Deprecated Modules

The following modules are deprecated and scheduled for removal:

#### Analytics
- `/services/modules/analyticsApi.ts` - Main wrapper (re-exports only)
- `/services/modules/analytics/index.ts` - Unified analytics API
- `/services/modules/analytics/healthAnalytics.ts` - Health metrics
- `/services/modules/analytics/incidentAnalytics.ts` - Incident analytics
- `/services/modules/analytics/medicationAnalytics.ts` - Medication analytics
- `/services/modules/analytics/appointmentAnalytics.ts` - Appointment analytics
- `/services/modules/analytics/dashboardAnalytics.ts` - Dashboard data
- `/services/modules/analytics/reportsAnalytics.ts` - Report generation
- `/services/modules/analytics/advancedAnalytics.ts` - Advanced features
- `/services/modules/analytics/cacheUtils.ts` - Cache utilities

#### Appointments
- `/services/modules/appointmentsApi.ts` - Main wrapper (re-exports only)
- `/services/modules/appointmentsApi/index.ts` - Unified appointments API
- `/services/modules/appointmentsApi/appointments-core.ts` - Core CRUD
- `/services/modules/appointmentsApi/appointments-scheduling.ts` - Scheduling
- `/services/modules/appointmentsApi/appointments-status.ts` - Status management
- `/services/modules/appointmentsApi/availability.ts` - Availability tracking
- `/services/modules/appointmentsApi/waitlist.ts` - Waitlist management
- `/services/modules/appointmentsApi/reminders.ts` - Reminder system
- `/services/modules/appointmentsApi/validation-*.ts` - Validation schemas

### Replacement Modules

#### New Server Actions (RECOMMENDED)

**Analytics:**
- `/lib/actions/analytics.actions.ts` - Main barrel export
- `/lib/actions/analytics.metrics.ts` - Metrics collection
- `/lib/actions/analytics.reports.ts` - Report management
- `/lib/actions/analytics.export.ts` - Export and scheduling
- `/lib/actions/analytics.dashboards.ts` - Dashboard management
- `/lib/actions/analytics.types.ts` - Type definitions
- `/lib/actions/analytics.utils.ts` - Utility functions

**Appointments:**
- `/lib/actions/appointments.actions.ts` - Main barrel export
- `/lib/actions/appointments.cache.ts` - Cached GET operations
- `/lib/actions/appointments.crud.ts` - CRUD operations
- `/lib/actions/appointments.utils.ts` - Utility functions
- `/lib/actions/appointments.types.ts` - Type definitions

#### New API Client

**Client-side utilities:**
- `/lib/api/client/index.ts` - Client-side API barrel
- `/lib/api/client/queries.ts` - Server-side queries for Server Components
- `/lib/api/client/cache-actions.ts` - Cache invalidation actions

**Server-side utilities:**
- `/lib/api/server/index.ts` - Server-side API barrel
- `/lib/api/server/methods.ts` - HTTP methods (serverGet, serverPost, etc.)
- `/lib/api/server/core.ts` - Core fetch implementation
- `/lib/api/server/types.ts` - Type definitions

---

## Migration Paths

### Path 1: Server Actions (RECOMMENDED)

Use this for:
- Server Components
- Server Actions
- API Route Handlers

**Benefits:**
- Zero client-side JavaScript
- Automatic type inference
- Built-in caching with `React.cache()`
- Server-side execution

#### Analytics Migration

```typescript
// OLD (deprecated)
import { analyticsApi } from '@/services/modules/analyticsApi';

async function AnalyticsDashboard() {
  const metrics = await analyticsApi.getHealthMetrics({ schoolId: '123' });
  const trends = await analyticsApi.getIncidentTrends({ period: 'weekly' });
  return <div>...</div>;
}

// NEW (server actions)
import { getHealthMetrics, getIncidentTrends } from '@/lib/actions/analytics.actions';

async function AnalyticsDashboard() {
  const metrics = await getHealthMetrics({ schoolId: '123' });
  const trends = await getIncidentTrends({ period: 'weekly' });
  return <div>...</div>;
}
```

#### Appointments Migration

```typescript
// OLD (deprecated)
import { appointmentsApi } from '@/services/modules/appointmentsApi';

async function AppointmentsList({ nurseId }: Props) {
  const appointments = await appointmentsApi.getAppointments({
    nurseId,
    status: 'scheduled'
  });
  return <ul>...</ul>;
}

// NEW (server actions)
import { getAppointments } from '@/lib/actions/appointments.actions';

async function AppointmentsList({ nurseId }: Props) {
  const appointments = await getAppointments({
    nurseId,
    status: 'scheduled'
  });
  return <ul>...</ul>;
}
```

### Path 2: Client Components with React Query

Use this for:
- Client Components with user interactions
- Real-time updates
- Optimistic updates
- Complex client-side state management

**Benefits:**
- Automatic caching and revalidation
- Background refetching
- Optimistic updates
- Error boundaries integration

#### Analytics Migration

```typescript
// OLD (deprecated)
import { analyticsApi } from '@/services/modules/analyticsApi';
import { useQuery } from '@tanstack/react-query';

function AnalyticsDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['analytics', 'health'],
    queryFn: () => analyticsApi.getHealthMetrics({ schoolId: '123' })
  });

  return <div>{metrics?.totalStudents}</div>;
}

// NEW (with server actions)
import { getHealthMetrics } from '@/lib/actions/analytics.actions';
import { useQuery } from '@tanstack/react-query';

function AnalyticsDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['analytics', 'health', '123'],
    queryFn: () => getHealthMetrics({ schoolId: '123' })
  });

  return <div>{metrics?.totalStudents}</div>;
}
```

#### Appointments Migration

```typescript
// OLD (deprecated)
import { appointmentsApi } from '@/services/modules/appointmentsApi';
import { useQuery, useMutation } from '@tanstack/react-query';

function AppointmentForm() {
  const createMutation = useMutation({
    mutationFn: (data) => appointmentsApi.createAppointment(data),
    onSuccess: () => queryClient.invalidateQueries(['appointments'])
  });

  return <form>...</form>;
}

// NEW (with server actions)
import { createAppointment } from '@/lib/actions/appointments.actions';
import { useQuery, useMutation } from '@tanstack/react-query';

function AppointmentForm() {
  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  return <form>...</form>;
}
```

### Path 3: Direct API Client (Legacy Support)

Use this ONLY for:
- Gradual migration of large codebases
- Complex integrations that can't be migrated immediately
- Temporary compatibility during migration period

**Note**: This is a temporary solution. Plan to migrate to Server Actions.

```typescript
// OLD
import { apiClient } from '@/services/core/ApiClient';

const data = await apiClient.get('/api/analytics/health');

// NEW
import { apiClient } from '@/lib/api';

const data = await apiClient('/api/analytics/health', { method: 'GET' });

// OR (server-side)
import { serverGet } from '@/lib/api/server';

const data = await serverGet('/api/analytics/health');
```

---

## Detailed Examples

### Example 1: Dashboard Component (Server Component)

```typescript
// Before
import { analyticsApi } from '@/services/modules/analyticsApi';
import { appointmentsApi } from '@/services/modules/appointmentsApi';

async function NurseDashboard({ nurseId }: { nurseId: string }) {
  const dashboard = await analyticsApi.getNurseDashboard(nurseId);
  const upcomingAppts = await appointmentsApi.getAppointments({
    nurseId,
    status: 'scheduled',
    startDate: new Date()
  });

  return (
    <div>
      <DashboardStats data={dashboard} />
      <AppointmentsList appointments={upcomingAppts} />
    </div>
  );
}

// After
import { getDashboardMetrics } from '@/lib/actions/analytics.actions';
import { getAppointments } from '@/lib/actions/appointments.actions';

async function NurseDashboard({ nurseId }: { nurseId: string }) {
  const dashboard = await getDashboardMetrics({ nurseId, type: 'nurse' });
  const upcomingAppts = await getAppointments({
    nurseId,
    status: 'scheduled',
    startDate: new Date()
  });

  return (
    <div>
      <DashboardStats data={dashboard} />
      <AppointmentsList appointments={upcomingAppts} />
    </div>
  );
}
```

### Example 2: Interactive Form (Client Component)

```typescript
// Before
'use client';

import { appointmentsApi } from '@/services/modules/appointmentsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AppointmentScheduler() {
  const queryClient = useQueryClient();

  const scheduleMutation = useMutation({
    mutationFn: (data) => appointmentsApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
    }
  });

  const handleSubmit = (formData: FormData) => {
    scheduleMutation.mutate({
      studentId: formData.get('studentId'),
      nurseId: formData.get('nurseId'),
      scheduledAt: new Date(formData.get('scheduledAt')),
      type: formData.get('type')
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// After
'use client';

import { createAppointment } from '@/lib/actions/appointments.actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AppointmentScheduler() {
  const queryClient = useQueryClient();

  const scheduleMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const handleSubmit = (formData: FormData) => {
    scheduleMutation.mutate({
      studentId: formData.get('studentId') as string,
      nurseId: formData.get('nurseId') as string,
      scheduledAt: new Date(formData.get('scheduledAt') as string),
      type: formData.get('type') as AppointmentType
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 3: Real-time Analytics Chart (Client Component)

```typescript
// Before
'use client';

import { analyticsApi } from '@/services/modules/analyticsApi';
import { useQuery } from '@tanstack/react-query';

function HealthMetricsChart({ schoolId }: { schoolId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'health-trends', schoolId],
    queryFn: () => analyticsApi.getHealthTrends({
      schoolId,
      period: 'monthly',
      metricType: 'vital-signs'
    }),
    refetchInterval: 60000 // Refetch every minute
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return <LineChart data={data} />;
}

// After
'use client';

import { getHealthMetrics } from '@/lib/actions/analytics.actions';
import { useQuery } from '@tanstack/react-query';

function HealthMetricsChart({ schoolId }: { schoolId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'health-trends', schoolId],
    queryFn: () => getHealthMetrics({
      schoolId,
      period: 'monthly',
      metricType: 'vital-signs'
    }),
    refetchInterval: 60000 // Refetch every minute
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return <LineChart data={data} />;
}
```

---

## API Mapping Reference

### Analytics Actions

| Old Method | New Server Action | Location |
|-----------|------------------|----------|
| `analyticsApi.getHealthMetrics()` | `getHealthMetrics()` | `@/lib/actions/analytics.metrics` |
| `analyticsApi.getMedicationCompliance()` | `getMedicationCompliance()` | `@/lib/actions/analytics.metrics` |
| `analyticsApi.getAppointmentAnalytics()` | `getAppointmentAnalytics()` | `@/lib/actions/analytics.metrics` |
| `analyticsApi.getIncidentTrends()` | `getIncidentTrends()` | `@/lib/actions/analytics.metrics` |
| `analyticsApi.getInventoryAnalytics()` | `getInventoryAnalytics()` | `@/lib/actions/analytics.metrics` |
| `analyticsApi.generateReport()` | `generateReport()` | `@/lib/actions/analytics.reports` |
| `analyticsApi.createCustomReport()` | `createCustomReport()` | `@/lib/actions/analytics.reports` |
| `analyticsApi.exportReport()` | `exportReport()` | `@/lib/actions/analytics.export` |
| `analyticsApi.getDashboardMetrics()` | `getDashboardMetrics()` | `@/lib/actions/analytics.dashboards` |

### Appointments Actions

| Old Method | New Server Action | Location |
|-----------|------------------|----------|
| `appointmentsApi.getAppointments()` | `getAppointments()` | `@/lib/actions/appointments.cache` |
| `appointmentsApi.getAppointment()` | `getAppointment()` | `@/lib/actions/appointments.cache` |
| `appointmentsApi.createAppointment()` | `createAppointment()` | `@/lib/actions/appointments.crud` |
| `appointmentsApi.updateAppointment()` | `updateAppointment()` | `@/lib/actions/appointments.crud` |
| `appointmentsApi.deleteAppointment()` | `deleteAppointment()` | `@/lib/actions/appointments.crud` |
| `appointmentsApi.scheduleAppointment()` | `scheduleAppointment()` | `@/lib/actions/appointments.utils` |
| `appointmentsApi.rescheduleAppointment()` | `rescheduleAppointment()` | `@/lib/actions/appointments.utils` |

---

## Migration Checklist

### Phase 1: Preparation (1-2 days)

- [ ] Review all files importing from deprecated modules
- [ ] Identify Server Components vs Client Components
- [ ] Create migration plan with prioritized components
- [ ] Set up testing environment

### Phase 2: Server Components (3-5 days)

- [ ] Update all Server Components to use server actions
- [ ] Replace `analyticsApi` imports with `@/lib/actions/analytics.actions`
- [ ] Replace `appointmentsApi` imports with `@/lib/actions/appointments.actions`
- [ ] Test each migrated component
- [ ] Verify caching behavior

### Phase 3: Client Components (5-7 days)

- [ ] Update Client Components to use server actions with React Query
- [ ] Update mutation patterns to use new actions
- [ ] Update cache invalidation logic
- [ ] Test user interactions and optimistic updates
- [ ] Verify error handling

### Phase 4: Edge Cases (2-3 days)

- [ ] Update any remaining direct API client usage
- [ ] Migrate complex integrations
- [ ] Update tests to use new patterns
- [ ] Review and update documentation

### Phase 5: Verification (2-3 days)

- [ ] Run full test suite
- [ ] Performance testing
- [ ] Bundle size analysis
- [ ] Code review
- [ ] Remove deprecated imports

---

## Troubleshooting

### Common Issues

#### 1. "Cannot use server actions in client components"

**Problem**: Trying to import server actions directly in a 'use client' file.

**Solution**: Wrap server actions in React Query hooks:

```typescript
// DON'T DO THIS in 'use client' files
import { getAppointments } from '@/lib/actions/appointments.actions';

// DO THIS instead
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/actions/appointments.actions';

function MyComponent() {
  const { data } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointments()
  });
}
```

#### 2. "Type inference not working"

**Problem**: TypeScript not inferring types from server actions.

**Solution**: Import and use the type definitions:

```typescript
import { getAppointments } from '@/lib/actions/appointments.actions';
import type { Appointment } from '@/lib/actions/appointments.types';

const appointments: Appointment[] = await getAppointments();
```

#### 3. "Cache not invalidating"

**Problem**: Data not refreshing after mutations.

**Solution**: Use proper cache invalidation:

```typescript
// OLD
queryClient.invalidateQueries(['appointments']);

// NEW (more specific)
queryClient.invalidateQueries({ queryKey: ['appointments'] });

// Or use server action cache invalidation
import { invalidateAppointmentsCacheAction } from '@/lib/api/client';
await invalidateAppointmentsCacheAction();
```

#### 4. "Performance degradation"

**Problem**: Slower performance after migration.

**Solution**: Check caching configuration:

```typescript
// Add proper caching to server actions
const appointments = await getAppointments(filters);
// Server actions use React.cache() automatically

// For client-side, adjust staleTime
const { data } = useQuery({
  queryKey: ['appointments'],
  queryFn: () => getAppointments(),
  staleTime: 5 * 60 * 1000 // 5 minutes
});
```

---

## Support and Resources

### Documentation
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Internal Resources
- Server Actions Guide: `/docs/architecture/server-actions.md`
- API Client Guide: `/docs/architecture/api-client.md`
- Caching Strategy: `/docs/architecture/caching.md`

### Getting Help
- Create an issue in the project repository
- Contact the architecture team
- Review migration examples in `/examples/migrations/`

---

## Timeline

- **2025-11-15**: Deprecation notice added
- **2025-12-01**: Migration guide published
- **2026-01-01**: Warning logs added to deprecated modules
- **2026-03-01**: Deprecated modules marked as errors
- **2026-04-01**: Deprecated modules removed (v2.0.0)

---

**Last Updated**: 2025-11-15
**Maintainer**: Architecture Team
**Questions**: Contact via GitHub Issues
