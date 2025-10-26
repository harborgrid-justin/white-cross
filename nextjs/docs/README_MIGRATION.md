# Next.js 15 App Router Migration - White Cross Healthcare Platform

## Overview

This directory contains the Next.js 15 App Router implementation of the White Cross Healthcare Platform, migrated from the Vite + React Router codebase in `frontend/`.

## Documentation

📋 **[MIGRATION_REPORT.md](./MIGRATION_REPORT.md)** - Comprehensive migration report with:
- Complete page inventory (100+ routes)
- Migration patterns and examples
- Server vs Client component breakdown
- Performance notes and optimization strategies
- Navigation testing checklist

🌲 **[ROUTE_TREE.txt](./ROUTE_TREE.txt)** - Visual route tree showing:
- Complete directory structure
- All route groups and nested routes
- Migration status for each route
- Module breakdowns

## Migration Status

### ✅ Completed (Foundation)

1. **Root Application Setup**
   - `app/layout.tsx` - Root layout with metadata and fonts
   - `app/page.tsx` - Root page (redirects to dashboard)
   - `app/providers.tsx` - Client-side providers (Redux, TanStack Query, Apollo)
   - `app/globals.css` - Global styles with Tailwind CSS

2. **Authentication Routes** (`app/(auth)/`)
   - Login page with HIPAA compliance notice
   - Access denied page
   - Minimal authentication layout

3. **Dashboard Shell** (`app/(dashboard)/`)
   - Dashboard layout with sidebar and header
   - Loading state with skeleton UI
   - Error boundary with recovery options
   - Dashboard home page

4. **Example Pages**
   - Students list page
   - Student detail page (dynamic route)

### ⏳ Remaining (94+ routes)

All other pages documented in [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) need to be migrated following the established patterns.

## Quick Start

### 1. Install Dependencies

```bash
cd nextjs
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## Migration Patterns

### Basic Page Migration

**Before (React Router):**
```tsx
// frontend/src/pages/students/Students.tsx
import { useNavigate } from 'react-router-dom';

export default function Students() {
  const navigate = useNavigate();
  const handleClick = () => navigate('/students/new');
  return <div>Students List</div>;
}
```

**After (Next.js App Router):**
```tsx
// nextjs/app/(dashboard)/students/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function StudentsPage() {
  const router = useRouter();
  const handleClick = () => router.push('/students/new');
  return <div>Students List</div>;
}
```

### Dynamic Route Migration

**Before:**
```tsx
// Route: /students/:id
import { useParams } from 'react-router-dom';

export default function StudentDetail() {
  const { id } = useParams();
  return <div>Student {id}</div>;
}
```

**After:**
```tsx
// nextjs/app/(dashboard)/students/[id]/page.tsx
'use client';

import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <div>Student {id}</div>;
}
```

### Adding Loading States

Create `loading.tsx` in any route segment:

```tsx
// nextjs/app/(dashboard)/students/loading.tsx
export default function StudentsLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Skeleton UI */}
    </div>
  );
}
```

### Adding Error Boundaries

Create `error.tsx` in any route segment:

```tsx
// nextjs/app/(dashboard)/students/error.tsx
'use client';

export default function StudentsError({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Project Structure

```
nextjs/
├── app/                          # App Router directory
│   ├── (auth)/                   # Public authentication routes
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root page
│   ├── providers.tsx             # Client providers
│   └── globals.css               # Global styles
│
├── src/                          # Shared source code
│   ├── components/               # Reusable components
│   ├── hooks/                    # Custom hooks & Redux store
│   ├── services/                 # API services
│   ├── lib/                      # Utilities & helpers
│   └── types/                    # TypeScript types
│
├── public/                       # Static assets
├── tests/                        # E2E tests (Playwright)
├── MIGRATION_REPORT.md          # Comprehensive migration guide
├── ROUTE_TREE.txt               # Visual route tree
└── README_MIGRATION.md          # This file
```

## Key Features

### Next.js 15 App Router Benefits

1. **Improved Performance**
   - Automatic code splitting per route
   - Server Components (future optimization)
   - Streaming with Suspense boundaries
   - Optimized bundle sizes

2. **Better Developer Experience**
   - File-based routing
   - Co-located loading & error states
   - Type-safe routing with TypeScript
   - Simplified data fetching

3. **Enhanced SEO**
   - Metadata API for all pages
   - Server-side rendering ready
   - Structured data support

4. **Advanced Patterns**
   - Route groups for logical organization
   - Parallel routes for dashboards
   - Intercepting routes for modals
   - Middleware for authentication

### Maintained Features

All features from the Vite + React Router implementation are preserved:

- ✅ Redux state management
- ✅ TanStack Query for server state
- ✅ Apollo GraphQL client
- ✅ Authentication with JWT
- ✅ Role-based access control (RBAC)
- ✅ HIPAA compliance features
- ✅ Audit logging
- ✅ Real-time updates (Socket.io)
- ✅ Toast notifications
- ✅ Error boundaries
- ✅ Loading states
- ✅ Responsive design (Tailwind CSS)

## Authentication Flow

### Middleware-based Auth (Recommended)

Create `middleware.ts` in the root:

```ts
// nextjs/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Testing

### Unit Tests (Vitest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Type Checking

```bash
npm run type-check
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```bash
docker build -t white-cross-nextjs .
docker run -p 3000:3000 white-cross-nextjs
```

### Self-hosted

```bash
npm run build
npm start
```

## Migration Checklist

Use this checklist when migrating a new page:

- [ ] Create page file in correct route segment
- [ ] Add `'use client'` directive if needed (interactivity, hooks)
- [ ] Update routing hooks (`useNavigate` → `useRouter`)
- [ ] Update params access (`useParams` → `use(params)`)
- [ ] Update search params (`useSearchParams` from `next/navigation`)
- [ ] Add loading.tsx for loading state
- [ ] Add error.tsx for error handling
- [ ] Add metadata export for SEO
- [ ] Test navigation to/from the page
- [ ] Test error scenarios
- [ ] Update any route helper functions

## Common Issues & Solutions

### Issue: "use client" missing

**Error:** `You're importing a component that needs useState. It only works in a Client Component`

**Solution:** Add `'use client'` directive at the top of the file

### Issue: Dynamic params not working

**Error:** `params is undefined`

**Solution:** Use `use(params)` hook from React

```tsx
import { use } from 'react';

function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}
```

### Issue: Redirect not working

**Error:** `redirect() can only be called in Server Components`

**Solution:** Use `router.push()` in Client Components

```tsx
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');
```

## Resources

- **Next.js 15 Documentation:** https://nextjs.org/docs
- **App Router Guide:** https://nextjs.org/docs/app
- **Migration Guide:** https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
- **White Cross Documentation:** See `MIGRATION_REPORT.md`

## Support

For questions or issues:

1. Check [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) for detailed guidance
2. Review [ROUTE_TREE.txt](./ROUTE_TREE.txt) for route structure
3. Consult Next.js documentation for App Router specifics
4. Review example pages in `app/(dashboard)/students/`

## License

Copyright © 2025 White Cross Healthcare Platform
