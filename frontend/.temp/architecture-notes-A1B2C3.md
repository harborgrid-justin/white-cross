# API Architecture Analysis - White Cross Healthcare Platform

**Agent**: api-architect (A1B2C3)
**Date**: 2025-10-29
**Status**: Analysis Complete

## High-Level Architecture Issues

### 1. **Duplicate API Endpoint Definitions**

**Problem**: API endpoints are defined in TWO separate locations:
- `src/lib/api-client.ts` - Minimal set (~15 endpoints)
- `src/constants/api.ts` - Comprehensive set (~150 endpoints)

**Impact**:
- Developer confusion about which file to import from
- Inconsistent endpoint usage across pages
- Maintenance nightmare when endpoints change
- Some pages use api-client.ts exports, others use constants/api.ts

**Recommendation**:
- Consolidate ALL endpoint definitions into `src/constants/api.ts`
- Update `src/lib/api-client.ts` to re-export from constants
- Create migration guide for developers

### 2. **Response Structure Inconsistency**

**Observed Patterns**:
```typescript
// Pattern 1: NestJS standard (backend uses this)
{ data: [], meta: { page, limit, total, pages } }

// Pattern 2: Legacy format (some endpoints still return this)
{ students: [], pagination: { ... } }
{ appointments: [], pagination: { ... } }

// Pattern 3: Direct array (error handling fallback)
[]
```

**Pages Handling Multiple Formats**:
- `students/page.tsx` - Checks for both `response.data` and `response.students`
- `health-records/page.tsx` - Checks for `response.data` and direct array
- `appointments/page.tsx` - Uses `response.data || response.appointments`
- `medications/page.tsx` - Checks for `response.data` and direct array

**Root Cause**: Backend migration from custom format to standardized NestJS format incomplete

**Recommendation**:
- Standardize backend to ALWAYS return `{ data: [], meta: {} }`
- Create response normalization utility in apiClient
- Update all pages to use normalized responses

### 3. **Server Actions Coverage Gap**

**Current State**:
- ✅ `students/actions.ts` - Complete with Next.js 15 async API support
- ❌ No actions files for: health records, appointments, medications, forms, communications

**Issues**:
- Client components calling API directly instead of using server actions
- No consistent error handling across pages
- Missing revalidation strategies for data updates
- Auth token handling duplicated in client-side code

**Recommendation**:
- Create server actions for ALL major entities
- Follow students/actions.ts pattern consistently
- Implement proper revalidation tags

### 4. **Authentication Token Handling Inconsistency**

**Client-Side Approach** (api-client.ts):
```typescript
// Gets token from localStorage - only works client-side
const token = localStorage.getItem('authToken');
```

**Server-Side Approach** (students/actions.ts):
```typescript
// Gets token from cookies - only works server-side
const cookieStore = await cookies();
const token = cookieStore.get('authToken')?.value;
```

**Issue**:
- Client components can't use server actions that need auth
- Inconsistent token storage strategy
- Security risk with localStorage for auth tokens

**Recommendation**:
- Use httpOnly cookies for auth tokens
- Server actions for authenticated requests
- Client-side uses API proxy route that handles auth

## API Design Patterns Analysis

### ✅ Good Patterns Found

1. **apiClient abstraction** - Single point of control for API calls
2. **API_ENDPOINTS constants** - No hardcoded URLs
3. **TypeScript types** - Strong typing for requests/responses
4. **Error handling structure** - Consistent ApiError interface
5. **Next.js 15 async APIs** - Properly used in students/actions.ts

### ❌ Anti-Patterns Found

1. **Duplicate endpoint definitions** - Two sources of truth
2. **Inconsistent imports** - Some pages import from api-client, others from constants
3. **Mixed response formats** - Backend hasn't fully migrated
4. **Client-side auth** - localStorage for tokens is security risk
5. **Missing server actions** - Most entities don't have server actions
6. **Hardcoded endpoints** - Some pages construct URLs manually instead of using constants

## Integration Patterns

### Current Client → Backend Flow

```
Client Component
  ↓
  Uses apiClient.get()
  ↓
  Calls /api/proxy/:path (Next.js API route)
  ↓
  Proxy adds auth from cookies
  ↓
  Backend API (NestJS)
  ↓
  Returns { data: [], meta: {} }
  ↓
  Client handles multiple response formats
```

### Recommended Flow

```
Client Component
  ↓
  Calls Server Action
  ↓
  Server Action uses apiRequest helper
  ↓
  Gets auth token from cookies (httpOnly)
  ↓
  Direct backend API call (no proxy needed)
  ↓
  Backend returns standardized response
  ↓
  Response normalization helper
  ↓
  Returns typed, consistent data to client
```

## Security Considerations

### Current Issues
1. **Auth tokens in localStorage** - Vulnerable to XSS
2. **Client-side token handling** - Exposed in browser
3. **Missing CSRF protection** - No tokens on state-changing operations
4. **PHI exposure** - Health data fetched client-side instead of server-side

### Recommendations
1. Move to httpOnly cookies for auth
2. Use server actions for all authenticated requests
3. Implement CSRF tokens for POST/PUT/DELETE
4. Minimize PHI exposure on client

## Performance Considerations

### Current Optimizations
- ✅ Next.js caching with revalidate tags
- ✅ Pagination support in API
- ✅ Query parameter filtering

### Missing Optimizations
- ❌ No request deduplication
- ❌ No optimistic updates
- ❌ No response caching strategy
- ❌ No loading state coordination

### Recommendations
1. Implement SWR or React Query for client-side caching
2. Add optimistic updates for common operations
3. Coordinate loading states across components
4. Add request deduplication at apiClient level

## Next Steps

1. **Critical**: Consolidate API endpoint definitions
2. **Critical**: Standardize backend response format
3. **High**: Create server actions for all entities
4. **High**: Migrate auth to httpOnly cookies
5. **Medium**: Implement response normalization utility
6. **Medium**: Add missing endpoints to constants
7. **Low**: Document API patterns for developers
