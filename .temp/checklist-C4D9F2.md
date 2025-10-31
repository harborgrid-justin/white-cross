# Data Fetching and Caching - Implementation Checklist

**Agent ID**: typescript-architect
**Task ID**: C4D9F2

## Phase 1: Create Next.js Fetch-Based API Client

### Core Client Implementation
- [ ] Create `/lib/api/nextjs-client.ts` file
- [ ] Implement base fetch wrapper with authentication
- [ ] Add type-safe HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Implement error handling with ApiClientError class
- [ ] Add retry logic with exponential backoff
- [ ] Support Next.js cache options (cache, revalidate, tags)
- [ ] Add cacheLife support
- [ ] Implement request ID generation for tracing
- [ ] Add CSRF token support
- [ ] Create convenience methods (serverGet, serverPost, etc.)

### Testing & Validation
- [ ] Verify TypeScript compilation
- [ ] Test authentication token injection
- [ ] Test cache tag application
- [ ] Validate error handling

## Phase 2: Update Server Actions

### Students Actions (`/actions/students.actions.ts`)
- [ ] Replace apiClient.post with serverPost
- [ ] Replace apiClient.put with serverPut
- [ ] Replace apiClient.delete with serverDelete
- [ ] Replace apiClient.get with serverGet
- [ ] Verify cache tags still applied
- [ ] Verify revalidatePath/revalidateTag still called
- [ ] Test TypeScript compilation

### Medications Actions (`/actions/medications.actions.ts`)
- [ ] Replace apiClient.post with serverPost
- [ ] Replace apiClient.put with serverPut
- [ ] Replace apiClient.delete with serverDelete
- [ ] Replace apiClient.get with serverGet
- [ ] Verify cache tags still applied
- [ ] Verify revalidatePath/revalidateTag still called
- [ ] Test TypeScript compilation

### Incidents Actions (`/actions/incidents.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Appointments Actions (`/actions/appointments.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Health Records Actions (`/actions/health-records.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Documents Actions (`/actions/documents.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Forms Actions (`/actions/forms.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Inventory Actions (`/actions/inventory.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Compliance Actions (`/actions/compliance.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

### Settings Actions (`/actions/settings.actions.ts`)
- [ ] Audit current implementation
- [ ] Replace axios calls with Next.js fetch
- [ ] Add cache tags
- [ ] Add revalidation calls

## Phase 3: Add Cache Configuration to Server Components

### Dashboard Pages
- [ ] `/app/(dashboard)/dashboard/page.tsx` - Add data fetching with caching
- [ ] `/app/(dashboard)/students/page.tsx` - Add cache config
- [ ] `/app/(dashboard)/medications/page.tsx` - Add cache config
- [ ] `/app/(dashboard)/appointments/page.tsx` - Add cache config
- [ ] `/app/(dashboard)/incidents/page.tsx` - Add cache config

### Detail Pages
- [ ] Student detail pages - Add cache tags for individual resources
- [ ] Medication detail pages - Add cache tags
- [ ] Appointment detail pages - Add cache tags
- [ ] Incident detail pages - Add cache tags

## Phase 4: Implement cacheLife API

### Cache Profiles
- [ ] Define cacheLife profiles for different data types
- [ ] PHI data profile (30-60s)
- [ ] Static data profile (300s)
- [ ] Real-time data profile (10s)

### Application
- [ ] Apply cacheLife to Server Components
- [ ] Apply cacheLife to fetch calls
- [ ] Document cache strategy

## Phase 5: Update API Routes

### Student API Routes
- [ ] `/app/api/students/route.ts` - Verify cache config
- [ ] `/app/api/students/[id]/route.ts` - Add cache tags

### Medication API Routes
- [ ] `/app/api/medications/route.ts` - Verify cache config
- [ ] `/app/api/medications/[id]/route.ts` - Add cache tags

### Other API Routes
- [ ] Audit remaining API routes
- [ ] Add cache configuration where missing

## Phase 6: Documentation and Testing

### Documentation
- [ ] Create caching strategy guide
- [ ] Document cache tag usage patterns
- [ ] Update CLAUDE.md with best practices
- [ ] Add JSDoc to new API client

### Testing
- [ ] Verify cache invalidation works correctly
- [ ] Test revalidateTag on mutations
- [ ] Test revalidatePath on mutations
- [ ] Performance testing (before/after metrics)

### Final Validation
- [ ] Run TypeScript compilation
- [ ] Verify no breaking changes
- [ ] Check all imports resolved
- [ ] Verify HIPAA audit logging preserved
- [ ] Create completion summary

## Completion Criteria
- [ ] All Server Actions migrated to Next.js fetch
- [ ] All cache tags applied appropriately
- [ ] cacheLife implemented
- [ ] Documentation complete
- [ ] Zero TypeScript errors
- [ ] Performance improvements validated
