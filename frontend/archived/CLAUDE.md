# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

White Cross is an enterprise-grade healthcare platform built with Next.js 16 for managing student health records, medications, appointments, incidents, and compliance in educational environments. The application is HIPAA-compliant and designed for school nurses and healthcare administrators.

**📚 State Management Guide**: For comprehensive state management patterns, boundaries, and best practices, see [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md).

**Tech Stack:**
- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript 5.9.3
- TanStack Query (React Query) for server state
- Redux Toolkit for client state
- Apollo Client for GraphQL
- Tailwind CSS for styling
- Radix UI + Headless UI for components

## Development Commands

### Build & Development
```bash
npm run dev              # Start dev server on port 3000
npm run build            # Production build (requires NEXT_PUBLIC_API_BASE_URL)
npm start                # Start production server
npm run type-check       # Run TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
```

### Testing
```bash
npm test                 # Run Jest unit tests
npm run test:watch       # Run Jest in watch mode
npm run test:coverage    # Generate coverage report

# Playwright E2E Tests
npm run test:e2e         # Run Playwright tests
npm run playwright       # Same as test:e2e
npm run playwright:headed    # Run with browser visible
npm run playwright:ui    # Open Playwright UI
npm run playwright:debug # Debug mode
npm run playwright:report # View test results

# Cypress E2E Tests
npm run cypress          # Open Cypress UI
npm run cypress:run      # Run Cypress headless
npm run cypress:login    # Run login tests specifically
```

### GraphQL Code Generation
```bash
npm run graphql:codegen  # Generate TypeScript types from GraphQL schema
npm run graphql:watch    # Watch mode for GraphQL codegen
```

### Component Development
```bash
npm run storybook        # Start Storybook on port 6006
npm run build-storybook  # Build static Storybook
```

### Bundle Analysis
```bash
ANALYZE=true npm run build  # Generate bundle analysis report
# Open .next/analyze/client.html to view
```

## Architecture Overview

### App Router Structure
The application uses Next.js 16 App Router with a domain-driven route organization:

```
src/app/
├── (dashboard)/          # Protected routes with dashboard layout
│   ├── students/         # Student management
│   ├── medications/      # Medication administration
│   ├── health-records/   # Health records (PHI)
│   ├── appointments/     # Appointment scheduling
│   ├── incidents/        # Incident reporting
│   ├── communications/   # Messaging & broadcasts
│   ├── documents/        # Document management
│   ├── inventory/        # Medical inventory
│   ├── analytics/        # Reporting & analytics
│   ├── compliance/       # HIPAA compliance
│   └── admin/           # System administration
├── api/                 # Next.js API routes (proxies to backend)
└── providers.tsx        # Client-side providers wrapper
```

Routes use parallel routes (`@modal`, `@sidebar`) and intercepting routes for advanced UX patterns.

### State Management Architecture

**Three-layer state management:** (See [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) for complete guide)

1. **Server State (TanStack Query)** - Primary data fetching
   - Located in `src/hooks/domains/*/queries/`
   - Used for all backend data (students, medications, health records)
   - Configured with HIPAA-compliant caching in `src/config/queryClient.ts`
   - PHI data marked with `containsPHI: true` metadata (never persisted)

2. **Client State (Redux Toolkit)** - UI state and offline support
   - Store: `src/stores/store.ts`
   - Slices: `src/stores/slices/`
   - Domain-organized: auth, students, healthRecords, medications, etc.
   - **Critical:** PHI excluded from localStorage persistence (HIPAA)
   - Uses custom persistence middleware (non-PHI only)

3. **Local State (React useState/Context)** - Component and feature-scoped state
   - Form state: React Hook Form + Zod (`src/lib/validations/`)
   - Component state: useState, useReducer
   - Feature contexts: `src/contexts/` (e.g., FollowUpActionContext)
   - Schemas: `src/lib/validations/`

### Data Fetching Patterns

**Always use TanStack Query for server data:**
```typescript
// src/hooks/domains/students/queries/useStudentQueries.ts
const { data, isLoading } = useQuery({
  queryKey: ['students', id],
  queryFn: () => fetchStudent(id),
  meta: {
    containsPHI: true,  // CRITICAL: Mark PHI data
    errorMessage: 'Failed to load student'
  }
});
```

**Use domain hooks, not direct API calls:**
- ✅ `import { useStudents } from '@/hooks/domains/students'`
- ❌ Don't import API clients directly in components

### API Client Architecture

**Two API clients for different contexts:**

1. **Client Components** (`src/lib/api/client.ts`)
   ```typescript
   import { clientGet, clientPost } from '@/lib/api/client';
   const data = await clientGet<Student[]>('/api/v1/students');
   ```

2. **Server Components/Actions** (`src/lib/server/api-client.ts`)
   ```typescript
   import { serverGet, serverPost } from '@/lib/server/api-client';
   const data = await serverGet<Student[]>('/students');
   ```

**Backend URL Proxying:**
- Frontend routes: `/api/v1/*` → Backend: `http://localhost:3001/*`
- GraphQL: `/graphql` → `http://localhost:3001/graphql`
- Uploads: `/uploads/*` → `http://localhost:3001/uploads/*`
- Configured in `next.config.ts` rewrites

### Authentication & Security

**Session Management:**
- Context: `src/contexts/AuthContext.tsx`
- Redux slice: `src/stores/slices/authSlice.ts`
- JWT tokens in HTTP-only cookies (not accessible via JavaScript)
- HIPAA-compliant 15-minute idle timeout
- Multi-tab session sync via BroadcastChannel
- Automatic token refresh (50-minute interval)

**Security Headers (HIPAA-compliant):**
- CSP, HSTS, X-Frame-Options configured in `next.config.ts`
- All PHI data transmitted over HTTPS in production
- No PHI cached in browser storage

**CSRF Protection:**
- Enabled for all mutations (POST/PUT/PATCH/DELETE)
- Token from `csrf-token` cookie added to request headers

### Component Organization

**UI Components:**
- Radix UI primitives: `src/components/ui/`
- Custom components: `src/components/`
- Feature components: `src/components/features/`
- Page-specific: `src/app/*/\_components/`

**Component Standards:**
- Use `'use client'` directive for client components
- Server components by default in `app/` directory
- Prefer composition over prop drilling
- Use TypeScript interfaces for all props

### Hooks Architecture

**Domain-Driven Hooks:**
```
src/hooks/
├── domains/              # Business domain hooks
│   ├── students/        # Student management
│   │   ├── queries/     # Data fetching (TanStack Query)
│   │   ├── mutations/   # Data mutations
│   │   └── composites/  # Complex workflows
│   ├── medications/
│   ├── health-records/
│   └── ...
├── core/                # Core application hooks
│   ├── useAuth.ts
│   ├── useWebSocket.ts
│   └── usePHIAudit.ts
└── ui/                  # UI-specific hooks
    └── useToast.ts
```

**Hook naming convention:**
- Queries: `useStudents()`, `useStudentById(id)`
- Mutations: `useCreateStudent()`, `useUpdateStudent()`
- Composites: `useStudentWorkflow()`

### Type Safety

**Path Aliases:**
- `@/*` → `src/*`
- `@tests/*` → `tests/*`

**Type Locations:**
- Domain types: `src/types/*.ts`
- API types: `src/types/api/`
- Component props: Define inline or in same file
- GraphQL types: Auto-generated in `src/types/graphql/` (run codegen)

**Important Type Files:**
- `src/types/index.ts` - Core types (User, Student, etc.)
- `src/types/api/responses.ts` - API response types
- `src/types/state.ts` - Redux state types

### Environment Variables

**Required for Production:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

**Optional (Monitoring):**
```env
NEXT_PUBLIC_SENTRY_DSN=...
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=...
NEXT_PUBLIC_DATADOG_APPLICATION_ID=...
```

**Build-time:**
```env
ANALYZE=true              # Enable bundle analysis
NEXT_PUBLIC_SOURCE_MAPS=true  # Enable production source maps
```

### Testing Strategy

**Unit Tests (Jest):**
- Test files: `*.test.ts` or `*.test.tsx`
- Located next to source files or in `tests/unit/`
- Use `@testing-library/react` for component tests

**E2E Tests (Playwright preferred):**
- Location: `tests/e2e/`
- Run across Chrome, Firefox, Safari, Mobile
- Healthcare workflow testing (login, medications, incidents)

**Cypress (Alternative E2E):**
- Location: `cypress/e2e/`
- Component tests: `cypress/component/`
- Focused on login and critical paths

### HIPAA Compliance Requirements

**Critical Rules:**

1. **PHI Data Handling:**
   - Mark all PHI queries with `containsPHI: true` in meta
   - Never persist PHI to localStorage
   - Use sessionStorage only for auth tokens
   - Clear all storage on logout

2. **Audit Logging:**
   - All PHI access logged via `usePHIAudit()` hook
   - Medication safety logging in `src/lib/audit/medication-safety-logger.ts`
   - Auth events logged in `AuthContext`

3. **Session Management:**
   - 15-minute idle timeout enforced
   - 2-minute warning before timeout
   - Auto-logout on inactivity

4. **Data Encryption:**
   - Client-side encryption utilities: `src/lib/security/encryption.ts`
   - Form encryption: `src/lib/security/encryption-forms.ts`

### Performance Optimizations

**Bundle Splitting (next.config.ts):**
- Vendor chunk: All node_modules
- React chunk: React, ReactDOM, Redux
- Data fetching: TanStack Query, Apollo, Axios
- UI libraries: Headless UI, Lucide icons
- Charts: Recharts (async loaded)
- Forms: React Hook Form, Zod

**Image Optimization:**
- Use Next.js `<Image>` component
- Formats: AVIF → WebP → JPEG/PNG
- Remote patterns configured for S3 and local backend

**Query Optimization:**
- 5-minute stale time for healthcare data
- 30-minute garbage collection
- Automatic refetch on window focus
- Smart retry logic (no retry on 4xx except 408, 429)

### Common Patterns

**Loading States:**
```typescript
import { LoadingSkeleton } from '@/components/common/LoadingStates';
// Use in loading.tsx files for route segments
```

**Error Handling:**
```typescript
import { ErrorFallback } from '@/components/common/ErrorStates';
// Use in error.tsx files for route segments
```

**Protected Routes:**
- All `/dashboard/*` routes require authentication
- Middleware passthrough (auth handled by backend)
- Role-based access: `useAuth().hasRole('NURSE')`

**Forms with Validation:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '@/lib/validations/student.schema';

const form = useForm({
  resolver: zodResolver(studentSchema),
});
```

### Debugging Tips

**Enable Debug Logging:**
```typescript
// TanStack Query DevTools (dev only)
// Already enabled in src/app/providers.tsx

// Redux DevTools
// Already enabled in src/stores/store.ts

// GraphQL Playground
// Visit http://localhost:3001/graphql
```

**Common Issues:**

1. **Hydration Mismatch:** Ensure server/client render same content. Use `useState(false)` and `useEffect` to set to true for client-only features.

2. **"Cannot read properties of undefined":** Check if data is loaded before accessing:
   ```typescript
   if (!data) return <LoadingSkeleton />;
   ```

3. **CORS Errors:** Use `/api/v1/*` routes (proxied) instead of direct backend calls from client.

4. **Build Fails:** Run `npm run type-check` to see TypeScript errors. Note: `ignoreBuildErrors: true` is set for deployment.

### Backend Integration

**Backend Repository:** Separate Hapi.js server (not in this repo)
- REST API: `http://localhost:3001/*`
- GraphQL: `http://localhost:3001/graphql`
- WebSocket: `ws://localhost:3001` (Socket.IO)

**API Versioning:**
- Frontend uses `/api/v1/*` prefix
- Backend doesn't use prefix (Next.js rewrites handle it)

**WebSocket (Real-time):**
- Context: `src/lib/socket/SocketContext.tsx`
- Client: `src/lib/socket/client.ts`
- Used for: notifications, medication reminders, emergency alerts

### Code Style & Conventions

**Naming:**
- Components: PascalCase (`StudentCard.tsx`)
- Hooks: camelCase with `use` prefix (`useStudents.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`Student`, `MedicationRecord`)
- Constants: SCREAMING_SNAKE_CASE (`HIPAA_IDLE_TIMEOUT`)

**File Organization:**
- One component per file
- Colocate tests with source (`StudentCard.tsx` + `StudentCard.test.tsx`)
- Group related components in directories
- Use barrel exports (`index.ts`) for cleaner imports

**Comments:**
- JSDoc for all exported functions
- Inline comments for complex business logic
- HIPAA compliance notes where applicable

### GraphQL

**Schema Location:** Backend repository
**Generated Types:** `src/types/graphql/`
**Code Generation:** `npm run graphql:codegen`

**Apollo Client Setup:**
- Config: `src/config/apolloClient.ts`
- Provider: Wrapped in `src/app/providers.tsx`
- Use TanStack Query hooks that wrap Apollo internally

### Accessibility

**Standards:** WCAG 2.1 AA compliance target
**Testing:**
- Axe-core integration (devDependencies)
- Storybook addon-a11y
- Manual testing with screen readers

**Best Practices:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios

### Deployment

**Production Build:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com npm run build
```

**Docker:**
- Output: `standalone` (configured in next.config.ts)
- Optimized for containerization

**Environment Detection:**
- Development: `npm run dev`
- Production: `npm run build && npm start`

**Build ID:** Git commit SHA (Vercel) or timestamp (local)

## Key Files Reference

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration, security headers, rewrites |
| `src/app/providers.tsx` | Client-side providers (Query, Redux, Apollo, Auth) |
| `src/stores/store.ts` | Redux store configuration with persistence |
| `src/config/queryClient.ts` | TanStack Query configuration |
| `src/contexts/AuthContext.tsx` | Authentication context and session management |
| `src/lib/api/client.ts` | Client-side API client (browser) |
| `src/lib/server/api-client.ts` | Server-side API client (SSR/Actions) |
| `middleware.ts` | Next.js middleware (currently passthrough) |
| `tsconfig.json` | TypeScript configuration with path aliases |

## Node Version

- **Required:** Node.js >= 20.0.0
- **NPM:** >= 8.0.0
- Check `.nvmrc` or `package.json` engines field
