# White Cross Frontend Data Fetching Architecture Analysis

**Generated:** 2025-10-26  
**Environment:** React 19 + Vite (Primary), Next.js (Alternative/Experimental)  
**Current State:** Production React/Vite implementation with underdeveloped Next.js branch

---

## Executive Summary

The White Cross frontend currently uses a **hybrid client-side data fetching architecture** with:
- **TanStack Query (v5.90.5)** for server state management
- **Redux Toolkit** for global and feature state
- **Apollo Client** for GraphQL integration
- **Axios** HTTP client with comprehensive resilience patterns

**Critical Finding:** No Next.js data fetching patterns are implemented. The project is built with Vite (not Next.js) as the primary frontend, with an experimental Next.js branch that only uses client-side rendering (`'use client'` directives).

---

## 1. Current Data Fetching Approach

### Primary Architecture: React + Vite (Production)

The frontend is built with **React 19 + Vite**, NOT Next.js. Data fetching follows a client-centric approach:

```
User Interface (React Components)
    ↓
Custom Hooks (TanStack Query)
    ↓
Service Modules (API abstraction)
    ↓
ApiClient (Axios)
    ↓
Backend REST API + GraphQL
```

#### A. TanStack Query (Server State)
**Location:** `/src/services/core/QueryHooksFactory.ts`, `/src/hooks/domains/*/queries/`

**Characteristics:**
- Server state management for REST API data
- Implements `useQuery`, `useMutation`, `useInfiniteQuery`
- Automatic caching, refetching, and synchronization
- Built-in retry logic with exponential backoff
- Stale time: 5 minutes, GC time: 10 minutes (configurable per query)

**Example Hook Pattern:**
```typescript
export function useMedicationsList(
  filters?: MedicationListFilters,
  options?: UseQueryOptions<PaginatedResponse<Medication>>
) {
  return useQuery({
    queryKey: medicationQueryKeys.lists.all(filters),
    queryFn: async () => {
      await logCompliantAccess('view_medications_list', 'medication', 'phi', { filters });
      return medicationsApi.getAll(filters);
    },
    staleTime: MEDICATION_CACHE_CONFIG.catalog.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.catalog.gcTime,
    retry: 2,
    ...options,
  });
}
```

#### B. Redux Toolkit (Global & Feature State)

**Configuration:**
- Domain-driven architecture with co-located feature stores
- Global stores: Auth, users, settings, dashboard (in `/stores/slices/`)
- Feature stores: Students, medications, appointments (in `/pages/[feature]/store/`)

**State Persistence Strategy:**
```
localStorage     → Settings, UI preferences, filters (non-PHI only)
sessionStorage   → None (reconstructed on load)
Memory only      → ALL PHI data (students, health records, medications)
Cross-tab sync   → BroadcastChannel API for memory-only state
```

**HIPAA Compliance:** PHI explicitly excluded from persistence

#### C. Apollo Client (GraphQL)

**Location:** `/src/config/apolloClient.ts`

**Features:**
- Endpoint: `/graphql` (separate from `/api` REST endpoints)
- Auth link: Adds JWT token to requests
- Retry link: 3 attempts with exponential backoff (300ms initial, 5000ms max)
- InMemoryCache with healthcare-specific policies
- Not heavily used; REST + TanStack Query is primary

---

## 2. Client-Side vs Server-Side Data Fetching

### Current Implementation: Client-Side Dominant

**Client-Side Fetching:**
- ✅ All API calls executed from React components/hooks
- ✅ TanStack Query manages loading/error/success states
- ✅ Optimistic updates for mutations
- ✅ Automatic request deduplication
- ✅ Smart retry with exponential backoff

**Server-Side Fetching:**
- ❌ NO getServerSideProps (Next.js not used)
- ❌ NO getStaticProps (static generation not implemented)
- ❌ NO server actions
- ❌ NO streaming/suspense patterns
- ⚠️ Experimental Next.js branch exists but uses only `'use client'` (client-side only)

### Performance Implications

**Drawbacks of Current Client-Only Approach:**
1. **No SEO optimization** - Content not pre-rendered
2. **Larger initial bundle** - All data fetching logic shipped to browser
3. **Higher time-to-interactive (TTI)** - User waits for JS to hydrate before fetching
4. **No server-side caching** - Every user request hits backend
5. **No incremental static regeneration** - No static content optimization

**Benefits of Current Approach:**
1. **Real-time interactivity** - Data always current
2. **Simpler deployment** - Static HTML, dynamic JS
3. **HIPAA-friendly** - No server-side PHI caching
4. **User-specific data** - Natural fit for per-user health records

---

## 3. Data Caching Strategies

### A. TanStack Query Caching

**Configuration:** `/src/config/queryClient.ts`

```typescript
const defaultQueryOptions: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes
    retry: (failureCount, error) => {
      // Smart retry logic
      if (error?.status >= 400 && error?.status < 500) {
        if (error.status === 408 || error.status === 429) {
          return failureCount < 3;  // Retry 408/429
        }
        return false;  // Don't retry other 4xx
      }
      return failureCount < 3;  // Retry 5xx
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
};
```

**Cache Invalidation:**
- Tag-based: `queryClient.invalidateQueries({ queryKey: ['students'] })`
- Pattern-based: Regex patterns for partial invalidation
- Manual: `queryClient.removeQueries()`
- Automatic on mutation success

### B. Custom Cache Manager

**Location:** `/src/services/cache/CacheManager.ts`

Advanced in-memory cache with:
- **LRU eviction policy** - O(1) get/set, O(1) eviction
- **TTL-based expiration** - Automatic cleanup
- **Tag-based invalidation** - Granular control
- **Memory tracking** - ~200 entry max, configurable
- **Hit/miss statistics** - Performance monitoring
- **PHI flagging** - HIPAA compliance tracking

```typescript
// Cache usage
cacheManager.set('user:123', userData, {
  ttl: 300000,  // 5 minutes
  tags: ['users', 'active'],
  containsPHI: true  // Flag for HIPAA
});

// Tag-based invalidation
cacheManager.invalidate({ tags: ['users'] });
```

### C. TanStack Query Persistence

**What's Persisted:**
- Non-PHI queries only
- Settings, filters, preferences
- Using localStorage via `createSyncStoragePersister`

**What's NOT Persisted:**
- Student data (PHI)
- Health records (PHI)
- Medications (PHI)
- Audit logs (sensitive)

---

## 4. API Integration Patterns

### A. Service Layer Architecture

**Organization:** `/src/services/modules/`

Domain-organized service modules:
```
services/modules/
├── studentsApi.ts
├── medicationsApi.ts
├── appointmentsApi.ts
├── healthRecordsApi.ts/
│   ├── allergiesApi.ts
│   ├── vaccinationsApi.ts
│   └── vitalSignsApi.ts
└── [15+ other domain APIs]
```

**Service Pattern:**
```typescript
// Example: medicationsApi
const medicationsApi = {
  getAll: (filters?: MedicationListFilters) => 
    apiClient.get<PaginatedResponse<Medication>>('/medications', { params: filters }),
  
  getByStudent: (studentId: string) =>
    apiClient.get(`/medications/student/${studentId}`),
  
  create: (data: MedicationCreate) =>
    apiClient.post<Medication>('/medications', data),
  
  bulkCreate: (data: MedicationCreate[]) =>
    apiClient.post<Medication[]>('/medications/bulk', data),
};
```

### B. HTTP Client: ApiClient

**Location:** `/src/services/core/ApiClient.ts`

Enterprise-grade Axios wrapper:

**Features:**
- Type-safe request/response
- Automatic JWT token injection
- CSRF protection
- Request/response interceptors
- Exponential backoff retry (3 attempts, max 30 seconds)
- Error classification (network, validation, server)
- Request cancellation support (AbortController)
- Performance tracking
- Resilience hooks (circuit breaker integration)

**Error Classification:**
```typescript
export class ApiClientError extends Error {
  isNetworkError: boolean;    // Connection failed
  isServerError: boolean;     // 5xx response
  isValidationError: boolean; // 400 with field errors
  status?: number;
  code?: string;
  details?: unknown;
  traceId?: string;
}
```

### C. Query Hooks Factory

**Location:** `/src/services/core/QueryHooksFactory.ts`

Generic factory for creating type-safe hooks:

```typescript
export class QueryHooksFactory<TEntity, TCreateDto, TUpdateDto> {
  // Queries
  useList(options?: ListQueryOptions) // With filtering
  useDetail(options: DetailQueryOptions) // By ID
  useSearch(options: SearchQueryOptions) // Full-text search
  
  // Mutations
  useCreate(options?: CreateMutationOptions)
  useUpdate(options?: UpdateMutationOptions)
  useDelete(options?: DeleteMutationOptions)
  useBulkCreate(options?: BulkMutationOptions)
  useBulkDelete(options?: BulkMutationOptions)
  
  // Optimistic updates
  private handleOptimisticCreate()
  private handleOptimisticUpdate()
  private handleOptimisticDelete()
}
```

**Usage:**
```typescript
const studentHooks = createQueryHooks(studentService, {
  queryKey: ['students'],
  staleTime: 5 * 60 * 1000,
  enableOptimisticUpdates: true
});

export function useStudents(filters?: StudentFilters) {
  return studentHooks.useList({ filters });
}

export function useCreateStudent() {
  return studentHooks.useCreate({
    invalidateList: true,
    onSuccess: (student) => showToast(`Created ${student.name}`)
  });
}
```

---

## 5. Next.js Data Fetching Methods (Missing)

### Current State: NOT IMPLEMENTED

**What's Missing:**

| Pattern | Status | Why Missing |
|---------|--------|------------|
| `getServerSideProps` | ❌ Not applicable | Project uses Vite, not Next.js |
| `getStaticProps` | ❌ Not applicable | Static generation not needed for real-time health data |
| `getStaticPaths` | ❌ Not applicable | Dynamic health records per student |
| `generateStaticParams` | ❌ Not applicable | App Router feature not used |
| Server Components | ❌ Not applicable | Using client components only |
| Server Actions | ❌ Not applicable | REST API instead |
| `revalidatePath` | ❌ Not applicable | No ISR (incremental static regeneration) |
| `revalidateTag` | ❌ Not applicable | No on-demand revalidation |
| Streaming/Suspense | ❌ Not implemented | No server-rendered components |

### Alternative Next.js Branch

**Location:** `/nextjs/` directory

**Current State:**
- ✅ Next.js 14+ app directory structure exists
- ✅ Routes organized by domain (students, medications, appointments, etc.)
- ✅ Uses `'use client'` directive (client-side components only)
- ❌ NO data fetching patterns implemented
- ❌ No getServerSideProps or equivalent
- ❌ No streaming or server components
- ❌ Not integrated into main project

**Example from Next.js branch:**
```typescript
// nextjs/src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ /* ... */ });
  const [loading, setLoading] = useState(true);

  // Traditional client-side data fetching
  // useEffect + fetch/axios pattern
}
```

---

## 6. Streaming and Suspense Usage

### Current Implementation: NONE

**Streaming Features:**
- ❌ No ReadableStream implementation
- ❌ No streaming mutations
- ❌ No server-sent events (SSE) for real-time updates
- ❌ No progressive enhancement

**React Suspense:**
- ❌ Not used with data fetching
- ❌ Code splitting with React.lazy exists (not Suspense data integration)
- ⚠️ Could be added for optimistic updates

**Real-Time Communication:**
- ✅ Socket.io configured in package.json
- ⚠️ Not actively used in current implementation
- 🔮 Potential for real-time health updates (not implemented)

### Suspense-Like Behavior (Current)

TanStack Query provides loading states instead:

```typescript
function StudentList() {
  const { data, isLoading, error } = useStudents();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <StudentTable students={data?.data} />;
}
```

---

## Summary: Missing Next.js Data Fetching Patterns

### What IS Implemented
1. ✅ Client-side REST API fetching (TanStack Query)
2. ✅ GraphQL client fetching (Apollo Client)
3. ✅ Automatic caching and revalidation
4. ✅ Optimistic updates
5. ✅ Resilience patterns (retry, circuit breaker)
6. ✅ HIPAA-compliant state persistence

### What IS NOT Implemented
1. ❌ **Server-side rendering** (no getServerSideProps, no server components)
2. ❌ **Static generation** (no getStaticProps, no ISR)
3. ❌ **Streaming responses** (no server-sent events, no progressive enhancement)
4. ❌ **Suspense boundaries** (no Suspense.lazy + data integration)
5. ❌ **Next.js App Router features** (generateStaticParams, revalidatePath, etc.)
6. ❌ **Server actions** (REST API instead)
7. ❌ **Middleware-level caching** (edge caching, CDN integration)

### Why These Are Missing

| Reason | Explanation |
|--------|-------------|
| **Framework choice** | Built with Vite/React, not Next.js |
| **HIPAA compliance** | Server-side PHI caching violates security model |
| **Real-time requirements** | Health data must reflect current state, ISR doesn't fit |
| **User-specific data** | Each student has unique records; static generation not applicable |
| **Development stage** | Main Vite branch stable; Next.js branch experimental only |

---

## Recommendations for Next.js Data Fetching Implementation (If Needed)

### Option 1: Hybrid Approach (Recommended for Production)

```typescript
// Use server components for public/static content
export async function generateStaticParams() {
  // Pre-render common pages (about, settings, etc.)
  return [{ id: 'public' }];
}

// Use client components for PHI/real-time data
'use client';
function StudentHealthRecords({ studentId }) {
  const { data } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => studentApi.getHealthRecords(studentId)
  });
  return <HealthRecordsView records={data} />;
}
```

### Option 2: Server Actions for Mutations

```typescript
'use server';

export async function createStudent(formData: FormData) {
  const data = Object.fromEntries(formData);
  const student = await db.students.create(data);
  
  // Revalidate student list
  revalidatePath('/students');
  
  return student;
}
```

### Option 3: Streaming Responses

```typescript
// app/health-records/[id]/page.tsx
export default async function HealthRecordsPage({ params }) {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <StudentInfo studentId={params.id} />
      </Suspense>
      
      <Suspense fallback={<Skeleton />}>
        <HealthMetrics studentId={params.id} />
      </Suspense>
    </div>
  );
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
│              (React Components - 'use client')            │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────▼──────────┐          ┌──────────▼────────┐
│  Custom Hooks    │          │  Redux State      │
│  (TanStack Query)│          │  Management       │
└───────┬──────────┘          └───────────────────┘
        │
┌───────▼──────────────────────────────────┐
│        Service Layer                      │
│  (/services/modules/[domain]Api.ts)       │
└───────┬──────────────────────────────────┘
        │
┌───────▼──────────────────────────────────┐
│         HTTP Client (ApiClient)           │
│  - JWT Token Injection                    │
│  - CSRF Protection                        │
│  - Exponential Backoff Retry              │
│  - Error Classification                   │
│  - Request Cancellation                   │
└───────┬──────────────────────────────────┘
        │
┌───────▼──────────────────────────────────┐
│      Backend (Hapi.js + PostgreSQL)       │
│  - REST API (/api/v1/...)                 │
│  - GraphQL (/graphql)                     │
│  - Health endpoint (/health)              │
└───────────────────────────────────────────┘

CACHING LAYERS:
  Memory      → TanStack Query cache (10 minute GC)
            → Custom CacheManager (LRU, tags, TTL)
  localStorage→ Non-PHI data only (settings, filters)
  API         → No caching header strategy
```

---

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Query client config | `/src/config/queryClient.ts` |
| Apollo client config | `/src/config/apolloClient.ts` |
| Service modules | `/src/services/modules/[domain]Api.ts` |
| Query hooks factory | `/src/services/core/QueryHooksFactory.ts` |
| HTTP client | `/src/services/core/ApiClient.ts` |
| Cache manager | `/src/services/cache/CacheManager.ts` |
| Domain hooks | `/src/hooks/domains/[domain]/queries/` |
| Redux store | `/src/stores/reduxStore.ts` |
| Next.js (alt) | `/nextjs/src/app/` |

---

## Conclusion

White Cross uses a **production-ready client-side data fetching architecture** that prioritizes:
1. **HIPAA compliance** (PHI handling)
2. **Real-time accuracy** (no stale cached data)
3. **Offline resilience** (retry logic, error recovery)
4. **Developer experience** (type-safe hooks, consistent patterns)

The **Next.js data fetching patterns are not applicable** to the current architecture because:
- Built with Vite, not Next.js
- Real-time health data doesn't benefit from static generation
- HIPAA requirements favor per-user data fetching
- Current implementation already optimized for healthcare use case

The experimental Next.js branch exists but is **not production-ready** and lacks any server-side data fetching implementation. To migrate to Next.js would require significant architectural changes and may not align with healthcare compliance requirements.
