# Next.js App Router Conventions Guide

**Version:** 1.0.0
**Last Updated:** October 2025
**Framework:** Next.js 14+ with App Router

---

## Table of Contents

1. [File Conventions Reference](#file-conventions-reference)
2. [Component Organization](#component-organization)
3. [Route Groups](#route-groups)
4. [Dynamic Rendering Configuration](#dynamic-rendering-configuration)
5. [Metadata Standards](#metadata-standards)
6. [API Routes](#api-routes)
7. [Server vs Client Components](#server-vs-client-components)
8. [Quick Reference](#quick-reference)

---

## 1. File Conventions Reference

Next.js App Router uses special file names to define UI and behavior for routes. Understanding when and how to use each file type is critical for building well-structured applications.

### 1.1 Core Special Files

#### `page.tsx` - Route Page
- **Purpose**: Defines the unique UI for a route
- **Requirement**: Required for route to be publicly accessible
- **Rendering**: Can be Server or Client Component
- **When to Use**: Every route that users can navigate to

**Example from codebase:**
```tsx
// /src/app/(dashboard)/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <Container>
      <h1>Dashboard</h1>
      {/* Page content */}
    </Container>
  );
}
```

#### `layout.tsx` - Shared Layout
- **Purpose**: Wraps child routes with shared UI (navigation, headers, footers)
- **Behavior**: Preserves state across navigation, does not re-render
- **Hierarchy**: Nested layouts compose from root to leaf
- **When to Use**: Shared navigation, consistent page structure, common providers

**Codebase Examples:**

**Root Layout** (`/src/app/layout.tsx`):
```tsx
// Root layout wraps entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Global accessibility features */}
        <a href="#main-content">Skip to main content</a>
        <PageTitle />
        <RouteAnnouncer />

        <Providers>
          {children}
          <Toaster /> {/* Global notifications */}
        </Providers>
      </body>
    </html>
  );
}
```

**Feature Layout** (`/src/app/(dashboard)/medications/layout.tsx`):
```tsx
// Feature-specific layout with sidebar navigation
export const metadata: Metadata = {
  title: {
    template: '%s | Medications | White Cross',
    default: 'Medications | White Cross'
  }
};

export default function MedicationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r bg-white lg:block">
        <nav>
          {/* Grouped navigation links */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

**When NOT to Use Layout:**
- For components that need to re-render on navigation (use `template.tsx`)
- For route-specific UI that doesn't apply to child routes (use page components)

#### `loading.tsx` - Loading UI
- **Purpose**: Instant loading states during navigation or data fetching
- **Behavior**: Automatically wrapped in React Suspense boundary
- **Scope**: Applies to current route segment and children
- **When to Use**: Routes with async data fetching, slow page loads

**Example from codebase:**
```tsx
// /src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinning animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 mt-4">Loading...</h2>
      </div>
    </div>
  );
}
```

**Best Practices:**
- Create feature-specific loading states (e.g., `/medications/loading.tsx`)
- Match the layout structure of the actual page to prevent layout shift
- Use skeleton screens for better perceived performance

#### `error.tsx` - Error Handling
- **Purpose**: Handles runtime errors in route segment
- **Requirement**: MUST be a Client Component (`'use client'`)
- **Scope**: Catches errors in child segments, not in same-level layout
- **When to Use**: Every feature area should have error boundaries

**Example from codebase:**
```tsx
// /src/app/(dashboard)/analytics/error.tsx
'use client';

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Analytics"
      domainIcon={<BarChart3 className="h-8 w-8" />}
      customMessage="Unable to load analytics data."
      customRecoverySteps={[
        'Click "Try Again" to reload analytics',
        'Check if data is still being processed',
        'Verify your permissions',
        'Contact IT support if error persists',
      ]}
    />
  );
}
```

**Error Hierarchy:**
```
global-error.tsx (catches errors in root layout)
└── error.tsx (catches all other errors)
    ├── (dashboard)/medications/error.tsx (medication-specific)
    ├── (dashboard)/students/error.tsx (student-specific)
    └── [Other feature error boundaries]
```

#### `not-found.tsx` - 404 Handling
- **Purpose**: Renders when route doesn't exist or `notFound()` is called
- **Behavior**: Returns 404 HTTP status
- **When to Use**: Custom 404 pages, programmatic not-found triggers

**Example from codebase:**
```tsx
// /src/app/not-found.tsx
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | White Cross Healthcare',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>

        <div className="space-y-3 mt-6">
          <Link href="/dashboard" className="healthcare-button-primary">
            Go to Dashboard
          </Link>
        </div>

        {/* Quick navigation links */}
      </div>
    </div>
  );
}
```

**Programmatic Usage:**
```tsx
// In a Server Component
import { notFound } from 'next/navigation';

export default async function StudentPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);

  if (!student) {
    notFound(); // Triggers not-found.tsx
  }

  return <div>{/* Student details */}</div>;
}
```

#### `global-error.tsx` - Root Error Boundary
- **Purpose**: Catches errors in root layout (last resort)
- **Requirement**: MUST be Client Component and include `<html>` tags
- **When to Use**: Root-level error recovery

### 1.2 Advanced Special Files

#### `template.tsx` - Re-rendering Layout
- **Purpose**: Like layout but re-renders on navigation
- **Use Case**: Animations, form resets, analytics

#### `route.ts` - API Route Handler
- **Purpose**: Server-side API endpoints
- **See**: [Section 6: API Routes](#6-api-routes)

---

## 2. Component Organization

Our codebase uses a dual-strategy approach for component organization:
1. **Centralized Components** (`/src/components/`) - Shared across features
2. **Route-Scoped Components** (`/src/app/**/_components/`) - Feature-specific

### 2.1 Centralized Components (`/src/components/`)

**Structure:**
```
/src/components/
├── ui/              # Generic UI components (Button, Input, Modal)
├── layouts/         # Layout components (Header, Sidebar, Footer)
├── shared/          # Shared business components
├── features/        # Feature-specific shared components
│   ├── medications/
│   ├── students/
│   └── incidents/
├── forms/           # Form components
├── auth/            # Authentication components
├── errors/          # Error boundary components
└── common/          # Common utilities (LoadingSpinner, etc.)
```

**When to Use Centralized Components:**
- ✅ Component used in 2+ features
- ✅ Generic UI components (buttons, inputs, modals)
- ✅ Core layouts (header, sidebar, footer)
- ✅ Authentication components
- ✅ Shared business logic components
- ✅ Design system components

**Example:**
```tsx
// /src/components/ui/Button.tsx
export function Button({ variant, children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant })} {...props}>
      {children}
    </button>
  );
}
```

### 2.2 Route-Scoped Components (`_components`)

**Convention:** Place in `_components` directory at the route level

**Examples from Codebase:**
```
/src/app/(dashboard)/inventory/
├── items/
│   ├── _components/
│   │   ├── ItemForm.tsx
│   │   ├── ItemFilters.tsx
│   │   └── ItemCard.tsx
│   ├── page.tsx
│   ├── new/
│   │   ├── _components/
│   │   │   └── NewItemWizard.tsx
│   │   └── page.tsx
│   └── [id]/
│       ├── _components/
│       │   └── ItemDetails.tsx
│       └── page.tsx
```

**When to Use Route-Scoped Components:**
- ✅ Component only used within specific route
- ✅ Complex page broken into smaller pieces
- ✅ Feature-specific forms and wizards
- ✅ Route-specific data displays
- ✅ Components unlikely to be reused elsewhere

**Example:**
```tsx
// /src/app/admin/monitoring/health/_components/SystemHealthDisplay.tsx
'use client';

export function SystemHealthDisplay({ metrics }: Props) {
  // Component only used in health monitoring page
  return <div>{/* Health metrics display */}</div>;
}
```

**Why `_components`?**
The underscore prefix (`_`) tells Next.js to exclude this directory from routing. Without it, Next.js would treat it as a route segment.

### 2.3 Decision Tree for Component Placement

```
Is the component used in multiple features?
├─ YES → Centralized (/src/components/features/)
└─ NO
   ├─ Is it a generic UI component?
   │  └─ YES → Centralized (/src/components/ui/)
   └─ NO → Route-Scoped (_components/)

Is it a layout component (Header, Sidebar)?
└─ YES → Centralized (/src/components/layouts/)

Is it business logic that might be reused?
├─ YES → Centralized (/src/components/shared/)
└─ NO → Route-Scoped (_components/)
```

### 2.4 Migration Strategy

**When to Move from Route-Scoped to Centralized:**
- Component is needed in a second feature
- Component contains valuable business logic
- Component would benefit from shared maintenance

**Steps:**
1. Move file to appropriate centralized directory
2. Update imports in all consuming files
3. Add to components barrel export (`/src/components/index.ts`)
4. Update documentation

---

## 3. Route Groups

Route groups organize routes without affecting URL structure. Use parentheses `(name)` to create a route group.

### 3.1 Route Group Structure

**Our Application Route Groups:**
```
/src/app/
├── (auth)/              # Unauthenticated routes
│   ├── layout.tsx       # Auth-specific layout (centered, branded)
│   ├── login/
│   │   └── page.tsx     # /login
│   ├── access-denied/
│   │   └── page.tsx     # /access-denied
│   └── session-expired/
│       └── page.tsx     # /session-expired
│
├── (dashboard)/         # Protected authenticated routes
│   ├── layout.tsx       # Dashboard layout (sidebar, header)
│   ├── dashboard/
│   │   └── page.tsx     # /dashboard
│   ├── medications/
│   │   └── ...          # /medications/*
│   ├── students/
│   │   └── ...          # /students/*
│   └── ...
│
├── admin/               # Admin-only routes (no group)
│   ├── settings/
│   │   └── ...          # /admin/settings/*
│   └── monitoring/
│       └── ...          # /admin/monitoring/*
│
└── ...
```

### 3.2 `(auth)` Route Group

**Purpose:** Unauthenticated public routes with specialized layout

**Characteristics:**
- ✅ Centered content layout
- ✅ Branded authentication UI
- ✅ No sidebar/header navigation
- ✅ HIPAA compliance messaging
- ✅ Accessibility features (skip links)

**Routes:**
- `/login` - User authentication
- `/access-denied` - Authorization failure
- `/session-expired` - Session timeout

**Layout Features:**
```tsx
// Centered card layout
// Gradient background
// Skip-to-content link
// HIPAA compliance footer
// No authentication required
```

**Middleware Behavior:**
- Redirects authenticated users to `/dashboard`
- Allows access for unauthenticated users

### 3.3 `(dashboard)` Route Group

**Purpose:** Main authenticated application routes

**Characteristics:**
- ✅ Requires authentication
- ✅ Full dashboard layout (sidebar, header, breadcrumbs)
- ✅ Role-based access control
- ✅ Audit logging
- ✅ Session management

**Routes Include:**
- `/dashboard` - Main dashboard
- `/medications/*` - Medication management
- `/students/*` - Student records
- `/appointments/*` - Appointments
- `/incidents/*` - Incident reporting
- `/inventory/*` - Inventory management
- `/communications/*` - Communications
- `/documents/*` - Document management
- `/forms/*` - Forms
- `/billing/*` - Billing
- `/compliance/*` - Compliance

**Layout Features:**
```tsx
// Responsive sidebar navigation
// Top header (search, notifications, user menu)
// Breadcrumb navigation
// Sticky header
// Mobile drawer
```

**Middleware Behavior:**
- Redirects unauthenticated users to `/login`
- Validates JWT tokens
- Checks role-based permissions
- Logs route access

### 3.4 `admin` Routes (No Group)

**Purpose:** Admin-specific routes that appear under `/admin` URL path

**Why Not a Route Group?**
Admin routes intentionally include `/admin` in the URL for:
- Clear indication of privileged access
- Easier monitoring and logging
- Security audit trails
- User awareness of admin context

**Routes:**
- `/admin/settings/*` - System configuration
- `/admin/monitoring/*` - System health monitoring
- `/admin/users/*` - User management

**Access Control:**
- Requires `ADMIN` role
- Additional permission checks
- Enhanced audit logging

### 3.5 Naming Conventions

**Route Group Naming:**
- Use lowercase
- Use descriptive names
- Prefix with purpose: `(auth)`, `(dashboard)`, `(public)`

**Examples:**
```
✅ (auth)         - Clear authentication context
✅ (dashboard)    - Clear protected area
✅ (public)       - Clear public access
✅ (admin)        - Clear admin context

❌ (routes)       - Too generic
❌ (main)         - Unclear purpose
❌ (app)          - Redundant
```

### 3.6 When to Use Route Groups

**Use Route Groups When:**
- Multiple routes share the same layout
- You want to organize routes logically
- Routes share authentication requirements
- You need different error/loading states
- You want to apply middleware selectively

**Don't Use Route Groups When:**
- You want the group name in the URL (use regular folders)
- Only one route exists in the group
- Routes have significantly different layouts

---

## 4. Dynamic Rendering Configuration

Next.js defaults to static rendering. Use `export const dynamic` to control rendering behavior.

### 4.1 When to Use `force-dynamic`

**Common Use Cases:**
```tsx
// Authentication required (cookies/headers)
export const dynamic = 'force-dynamic';

// Real-time data
export const dynamic = 'force-dynamic';

// User-specific content
export const dynamic = 'force-dynamic';

// Request-time data (search params, headers)
export const dynamic = 'force-dynamic';
```

**Examples from Codebase:**

**Authentication Pages:**
```tsx
// /src/app/(dashboard)/dashboard/page.tsx
/**
 * Force dynamic rendering to allow authentication checks at request time.
 * This page requires access to headers/cookies for user authentication.
 */
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  // User-specific dashboard content
}
```

**Real-Time Data:**
```tsx
// /src/app/(dashboard)/medications/administration-due/page.tsx
/**
 * Dynamic rendering for real-time medication administration status
 */
export const dynamic = 'force-dynamic';

export default function MedicationsDuePage() {
  // Real-time medication list
}
```

### 4.2 When to Use Static Rendering (Default)

**Use Static Rendering When:**
- ✅ Content is same for all users
- ✅ Data doesn't change frequently
- ✅ No authentication required
- ✅ Performance is critical

**Examples:**
```tsx
// Marketing pages
// Documentation
// Public blog posts
// Static product catalogs
```

### 4.3 Dynamic Configuration Options

```tsx
// Force dynamic rendering (per-request)
export const dynamic = 'force-dynamic';

// Force static rendering (build-time)
export const dynamic = 'force-static';

// Error if dynamic functions used
export const dynamic = 'error';

// Allow dynamic or static (default)
export const dynamic = 'auto';
```

### 4.4 Revalidation Strategies

**Time-Based Revalidation:**
```tsx
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  });
  return <div>{/* Content */}</div>;
}
```

**On-Demand Revalidation:**
```tsx
// API route for on-demand revalidation
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  revalidatePath('/medications');
  return Response.json({ revalidated: true });
}
```

**Per-Request Revalidation:**
```tsx
// Example from medications detail page
async function getMedication(id: string) {
  const response = await fetchWithAuth(
    API_ENDPOINTS.MEDICATIONS.DETAIL(id),
    { next: { revalidate: 60 } } // 1 minute cache
  );
  return response.json();
}

async function getRecentAdministrations(medicationId: string) {
  const response = await fetchWithAuth(
    API_ENDPOINTS.ADMINISTRATION_LOG.BY_MEDICATION(medicationId),
    { next: { revalidate: 30 } } // 30 second cache (more frequent)
  );
  return response.json();
}
```

### 4.5 Best Practices

**Authentication + Dynamic:**
```tsx
// Always force-dynamic for authenticated routes
export const dynamic = 'force-dynamic';

export default function ProtectedPage() {
  // Access cookies, headers, or session
}
```

**Public + Static with Revalidation:**
```tsx
// Static with periodic revalidation
export const revalidate = 3600; // 1 hour

export default async function PublicPage() {
  // Fetch data, cache for 1 hour
}
```

**Hybrid Approach:**
```tsx
// Page is dynamic but data is cached
export const dynamic = 'force-dynamic';

export default async function HybridPage() {
  // Auth check (dynamic)
  const session = await getSession();

  // Data fetch with caching
  const data = await fetch('...', {
    next: { revalidate: 300 } // 5 min cache
  });

  return <div>{/* Content */}</div>;
}
```

---

## 5. Metadata Standards

Metadata configures page SEO, social sharing, and browser display.

### 5.1 Static Metadata

**Root Layout (Application-Wide):**
```tsx
// /src/app/layout.tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "White Cross Healthcare Platform",
  description: "Enterprise healthcare platform for school nurses",
  keywords: ["healthcare", "school nursing", "medication management"],
  authors: [{ name: "White Cross Healthcare" }],
  robots: {
    index: false, // Prevent indexing (HIPAA PHI protection)
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No maximumScale for WCAG 2.1 AA compliance
};
```

**Feature Layout (Template Pattern):**
```tsx
// /src/app/(dashboard)/medications/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Medications | White Cross',
    default: 'Medications | White Cross'
  },
  description: 'Medication management and administration tracking'
};
```

**How Templates Work:**
```tsx
// Layout: template: '%s | Medications | White Cross'

// Child page: title: "Albuterol HFA"
// Result: "Albuterol HFA | Medications | White Cross"

// Child without title:
// Result: "Medications | White Cross" (default)
```

**Route Group Layout:**
```tsx
// /src/app/(auth)/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'Authentication | White Cross Healthcare',
  },
  description: 'Secure authentication for White Cross Healthcare Platform',
};
```

### 5.2 Dynamic Metadata

**Generate Metadata Function:**
```tsx
// /src/app/(dashboard)/medications/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  // Fetch data for metadata
  const medication = await getMedication(params.id);

  if (!medication) {
    return {
      title: 'Medication Not Found'
    };
  }

  return {
    title: medication.name,
    description: `${medication.name} medication details and administration history`
  };
}

export default async function MedicationDetailPage({ params }) {
  // Page implementation
}
```

### 5.3 Required Metadata Fields

**Every Page Should Have:**
```tsx
{
  title: string | { template: string, default: string },
  description: string,
}
```

**Feature Pages Should Add:**
```tsx
{
  title: "Page Title",
  description: "Clear description of page content",
  // Optional but recommended:
  keywords: ["relevant", "keywords"],
}
```

### 5.4 SEO Best Practices

**Title Guidelines:**
- Keep under 60 characters
- Include brand name
- Be descriptive and unique
- Use template pattern for consistency

**Description Guidelines:**
- Keep under 160 characters
- Summarize page content
- Include relevant keywords naturally
- Call-to-action when appropriate

**HIPAA Compliance:**
```tsx
// ✅ GOOD - Generic, no PHI
title: "Medication Details"
description: "View medication information and administration history"

// ❌ BAD - Contains PHI
title: "John Smith's Albuterol Prescription"
description: "Albuterol HFA 90mcg for John Smith, DOB 01/15/2010"
```

### 5.5 Open Graph & Social Sharing

**When to Include:**
- Public marketing pages
- Blog posts
- Public documentation

**When to Exclude:**
- Authenticated pages (all dashboard routes)
- Pages with PHI
- Admin interfaces

**Example (Public Page):**
```tsx
export const metadata: Metadata = {
  title: "White Cross Healthcare",
  description: "School health management platform",
  openGraph: {
    title: "White Cross Healthcare",
    description: "School health management platform",
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "White Cross Healthcare",
    description: "School health management platform",
  },
};
```

---

## 6. API Routes

API routes provide server-side endpoints within your Next.js application.

### 6.1 API Route Structure

**File Convention:**
```
/src/app/api/
├── auth/
│   ├── login/
│   │   ├── route.ts         # POST /api/auth/login
│   │   └── __tests__/
│   │       └── route.test.ts
│   ├── logout/
│   │   └── route.ts         # POST /api/auth/logout
│   ├── refresh/
│   │   └── route.ts         # POST /api/auth/refresh
│   └── verify/
│       └── route.ts         # GET /api/auth/verify
│
├── medications/
│   ├── route.ts             # GET /api/medications, POST /api/medications
│   ├── [id]/
│   │   ├── route.ts         # GET/PUT/DELETE /api/medications/:id
│   │   └── administer/
│   │       └── route.ts     # POST /api/medications/:id/administer
│   └── __tests__/
│       └── route.test.ts
│
├── appointments/
│   ├── route.ts
│   ├── [id]/
│   │   └── route.ts
│   └── availability/
│       └── route.ts
│
└── health/
    └── route.ts             # GET /api/health
```

### 6.2 Route Handler Example

**Basic Route:**
```tsx
// /src/app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
```

**Full CRUD Example:**
```tsx
// /src/app/api/medications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

// GET /api/medications
export async function GET(request: NextRequest) {
  const response = await proxyToBackend(request, '/medications');
  return response;
}

// POST /api/medications
export async function POST(request: NextRequest) {
  const response = await proxyToBackend(request, '/medications');
  return response;
}
```

**Dynamic Route:**
```tsx
// /src/app/api/medications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/medications/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const medicationId = params.id;

  const response = await proxyToBackend(
    request,
    `/medications/${medicationId}`
  );

  return response;
}

// PUT /api/medications/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const medicationId = params.id;

  const response = await proxyToBackend(
    request,
    `/medications/${medicationId}`
  );

  return response;
}

// DELETE /api/medications/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const medicationId = params.id;

  const response = await proxyToBackend(
    request,
    `/medications/${medicationId}`
  );

  return response;
}
```

### 6.3 Authentication Example

**Login Route with Audit Logging:**
```tsx
// /src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { RATE_LIMITS } from '@/lib/rateLimit';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

async function loginHandler(request: NextRequest) {
  try {
    // Proxy to backend
    const response = await proxyToBackend(request, '/auth/login', {
      forwardAuth: false
    });

    const data = await response.json();

    // Audit logging
    const auditContext = createAuditContext(request);
    if (response.status === 200 && data.data?.user) {
      await auditLog({
        ...auditContext,
        userId: data.data.user.id,
        action: AUDIT_ACTIONS.LOGIN,
        success: true
      });
    } else {
      await auditLog({
        ...auditContext,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        success: false
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Error handling with audit log
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// Apply rate limiting: 5 requests per 15 minutes
export const POST = withRateLimit(RATE_LIMITS.AUTH, loginHandler);
```

### 6.4 Error Handling Standards

**Standard Error Response Format:**
```tsx
// Success
{
  "data": { /* response data */ },
  "message": "Optional success message"
}

// Error
{
  "error": "Error type",
  "message": "User-friendly error message",
  "details": { /* Optional error details */ }
}
```

**Error Status Codes:**
```tsx
200 - Success
201 - Created
400 - Bad Request (validation error)
401 - Unauthorized (authentication required)
403 - Forbidden (insufficient permissions)
404 - Not Found
409 - Conflict (duplicate resource)
429 - Too Many Requests (rate limit)
500 - Internal Server Error
```

**Error Handling Example:**
```tsx
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'Name is required' },
        { status: 400 }
      );
    }

    // Process request
    const response = await processRequest(body);

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('API Error:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Internal Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### 6.5 Middleware Integration

**Rate Limiting:**
```tsx
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { RATE_LIMITS } from '@/lib/rateLimit';

export const POST = withRateLimit(
  RATE_LIMITS.AUTH, // 5 requests per 15 minutes
  async (request: NextRequest) => {
    // Handler implementation
  }
);
```

**Authentication:**
```tsx
import { withAuth } from '@/lib/middleware/withAuth';

export const GET = withAuth(
  async (request: NextRequest) => {
    // User is authenticated, proceed
    const user = request.user; // Added by middleware
  }
);
```

### 6.6 Testing API Routes

**Test Structure:**
```tsx
// /src/app/api/auth/login/__tests__/route.test.ts
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('POST /api/auth/login', () => {
  it('should authenticate valid credentials', async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('data.token');
  });

  it('should reject invalid credentials', async () => {
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
```

---

## 7. Server vs Client Components

Next.js 14+ defaults to Server Components. Use `'use client'` sparingly.

### 7.1 Server Components (Default)

**Characteristics:**
- ✅ Rendered on server
- ✅ Zero JavaScript sent to client
- ✅ Can directly access backend resources
- ✅ Better performance
- ✅ Better SEO

**When to Use Server Components:**
- Fetching data
- Accessing backend resources directly
- Protecting sensitive information (API keys)
- Keeping large dependencies on server
- Static content rendering

**Examples from Codebase:**

**Layout (Server Component):**
```tsx
// /src/app/(dashboard)/layout.tsx
// No 'use client' directive = Server Component
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
```

**Data Fetching (Server Component):**
```tsx
// /src/app/(dashboard)/medications/[id]/page.tsx
// Server Component with async data fetching
export default async function MedicationDetailPage({ params }: Props) {
  // Direct server-side data fetching
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound();
  }

  return (
    <div>
      <h1>{medication.name}</h1>
      {/* Static content */}
    </div>
  );
}
```

### 7.2 Client Components

**Characteristics:**
- ✅ Rendered on client
- ✅ Can use React hooks
- ✅ Can handle browser events
- ✅ Can access browser APIs
- ⚠️ JavaScript bundled to client

**When to Use Client Components:**
- Using React hooks (useState, useEffect, etc.)
- Handling browser events (onClick, onChange)
- Using browser APIs (localStorage, window)
- Third-party libraries requiring browser
- Interactive UI components

**Examples from Codebase:**

**Error Boundary (Must be Client):**
```tsx
// /src/app/error.tsx
'use client'; // REQUIRED for error boundaries

import { useEffect } from 'react';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div>
      <h1>Something went wrong</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Interactive Form (Client Component):**
```tsx
// /src/app/(dashboard)/medications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';

export default function MedicationsPage() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/medications');
        const data = await response.json();
        setMedications(data);
      } catch (error) {
        showError('Failed to load medications');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? <LoadingSkeleton /> : <MedicationList medications={medications} />}
    </div>
  );
}
```

### 7.3 Component Patterns

**Server Component Wrapper with Client Children:**
```tsx
// /src/app/(dashboard)/medications/[id]/page.tsx
// Server Component
export default async function MedicationPage({ params }: Props) {
  const medication = await getMedication(params.id); // Server-side fetch

  return (
    <div>
      {/* Server-rendered content */}
      <h1>{medication.name}</h1>

      {/* Client component for interactivity */}
      <MedicationActions medicationId={params.id} />
    </div>
  );
}
```

```tsx
// /src/components/medications/MedicationActions.tsx
'use client';

export function MedicationActions({ medicationId }: Props) {
  const handleAdminister = () => {
    // Client-side interaction
  };

  return (
    <button onClick={handleAdminister}>
      Record Administration
    </button>
  );
}
```

**Separate Data Layer:**
```tsx
// /src/app/(dashboard)/medications/data.ts
// Server-only data fetching
export async function fetchMedicationsDashboardData({ page, limit }) {
  const response = await fetchWithAuth('/api/medications', {
    params: { page, limit }
  });

  return response.json();
}
```

```tsx
// /src/app/(dashboard)/medications/page.tsx
'use client';

import { fetchMedicationsDashboardData } from './data';

export default function MedicationsPage() {
  // Use data layer function from client
  const { data } = useSWR('medications', fetchMedicationsDashboardData);

  return <div>{/* Render data */}</div>;
}
```

### 7.4 Migration Patterns

**From Client to Server Component:**

❌ **Before (Client):**
```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

✅ **After (Server):**
```tsx
// No 'use client'

async function getData() {
  const response = await fetch('/api/data');
  return response.json();
}

export default async function Page() {
  const data = await getData();

  return <div>{data.title}</div>;
}
```

**Hybrid Approach:**
```tsx
// Server Component (page.tsx)
export default async function Page() {
  const staticData = await getStaticData(); // Server

  return (
    <div>
      <StaticContent data={staticData} />
      <InteractiveWidget /> {/* Client component */}
    </div>
  );
}
```

### 7.5 Best Practices

**Server Component Best Practices:**
```tsx
// ✅ Use async/await for data fetching
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Parallel data fetching
export default async function Page() {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);
  return <div>{/* ... */}</div>;
}

// ✅ Pass data to Client Components as props
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}
```

**Client Component Best Practices:**
```tsx
// ✅ Mark as client only when necessary
'use client';

// ✅ Extract client logic to separate component
function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Use React Query for client-side data
'use client';
import { useQuery } from '@tanstack/react-query';

function DataComponent() {
  const { data } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  });
  return <div>{data}</div>;
}
```

**Common Mistakes:**
```tsx
// ❌ Don't use 'use client' everywhere
'use client'; // Only needed if using hooks/events

export default function StaticPage() {
  return <div>Static content</div>; // No hooks = should be Server Component
}

// ❌ Don't fetch data client-side if possible
'use client';
useEffect(() => {
  fetch('/api/data'); // Should be Server Component with async fetch
}, []);

// ❌ Don't import Server Components into Client
'use client';
import ServerComponent from './ServerComponent'; // Won't work
```

---

## 8. Quick Reference

### 8.1 Common Patterns

**Authenticated Page with Data:**
```tsx
// /src/app/(dashboard)/feature/page.tsx
export const dynamic = 'force-dynamic';

export default async function FeaturePage() {
  const data = await fetchWithAuth('/api/feature');

  return (
    <Container>
      <PageHeader title="Feature" />
      <FeatureContent data={data} />
    </Container>
  );
}
```

**Dynamic Route with Metadata:**
```tsx
// /src/app/(dashboard)/items/[id]/page.tsx
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }): Promise<Metadata> {
  const item = await getItem(params.id);

  return {
    title: item?.name || 'Item Not Found',
    description: `Details for ${item?.name}`
  };
}

export default async function ItemPage({ params }) {
  const item = await getItem(params.id);

  if (!item) {
    notFound();
  }

  return <div>{/* Item details */}</div>;
}
```

**Error Boundary:**
```tsx
// /src/app/(dashboard)/feature/error.tsx
'use client';

export default function FeatureError({ error, reset }) {
  return (
    <div>
      <h1>Error in Feature</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
```

**Loading State:**
```tsx
// /src/app/(dashboard)/feature/loading.tsx
export default function FeatureLoading() {
  return (
    <div className="space-y-4">
      {/* Skeleton matching actual layout */}
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-64 bg-gray-100 rounded mt-4" />
      </div>
    </div>
  );
}
```

### 8.2 Code Snippets

**New Page Template:**
```tsx
// /src/app/(dashboard)/[feature]/page.tsx
import { Container } from '@/components/layouts/Container';
import { PageHeader } from '@/components/layouts/PageHeader';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Feature Name',
  description: 'Feature description'
};

export default async function FeaturePage() {
  return (
    <Container>
      <PageHeader
        title="Feature Name"
        description="Feature description"
      />

      <div className="space-y-6">
        {/* Page content */}
      </div>
    </Container>
  );
}
```

**New API Route Template:**
```tsx
// /src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: NextRequest) {
  try {
    const response = await proxyToBackend(request, '/resource');
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await proxyToBackend(request, '/resource');
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
```

**New Layout Template:**
```tsx
// /src/app/(dashboard)/[feature]/layout.tsx
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Feature | White Cross',
    default: 'Feature | White Cross'
  },
  description: 'Feature area description'
};

export default function FeatureLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Optional sidebar */}
      <aside className="hidden w-64 border-r lg:block">
        {/* Navigation */}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 8.3 File Templates

**Complete Page with All Features:**
```tsx
// /src/app/(dashboard)/feature/page.tsx

// 1. Imports
import { Suspense } from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/layouts/Container';
import { PageHeader } from '@/components/layouts/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';

// 2. Dynamic rendering config
export const dynamic = 'force-dynamic';

// 3. Metadata
export const metadata: Metadata = {
  title: 'Feature Name',
  description: 'Feature description for SEO'
};

// 4. Data fetching functions
async function getData() {
  const response = await fetchWithAuth('/api/data', {
    next: { revalidate: 60 }
  });
  return response.json();
}

// 5. Main component
export default async function FeaturePage() {
  const data = await getData();

  return (
    <Container>
      <PageHeader
        title="Feature Name"
        description="Description visible to users"
        actions={
          <Link href="/feature/new">
            <Button>New Item</Button>
          </Link>
        }
      />

      <div className="space-y-6">
        <Suspense fallback={<LoadingSkeleton />}>
          <FeatureContent data={data} />
        </Suspense>
      </div>
    </Container>
  );
}

// 6. Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>
  );
}
```

### 8.4 Cheat Sheet

| Task | File | Example |
|------|------|---------|
| Create route | `page.tsx` | `/app/about/page.tsx` → `/about` |
| Add layout | `layout.tsx` | `/app/dashboard/layout.tsx` |
| Loading state | `loading.tsx` | `/app/dashboard/loading.tsx` |
| Error boundary | `error.tsx` | `/app/dashboard/error.tsx` |
| 404 page | `not-found.tsx` | `/app/not-found.tsx` |
| API endpoint | `route.ts` | `/app/api/users/route.ts` |
| Dynamic route | `[param]/page.tsx` | `/app/posts/[id]/page.tsx` |
| Catch-all route | `[...slug]/page.tsx` | `/app/docs/[...slug]/page.tsx` |
| Route group | `(group)/page.tsx` | `/app/(auth)/login/page.tsx` |
| Private folder | `_folder` | `/app/_components` (not routed) |

**Dynamic Rendering:**
```tsx
export const dynamic = 'force-dynamic' // Always dynamic
export const dynamic = 'force-static'  // Always static
export const revalidate = 60           // Revalidate every 60s
export const revalidate = 0            // Never cache
```

**Metadata:**
```tsx
// Static
export const metadata = { title: 'Page' }

// Dynamic
export async function generateMetadata({ params }) {
  return { title: 'Page' }
}
```

**Client vs Server:**
```tsx
// Server (default)
export default async function Page() { }

// Client
'use client'
export default function Page() { }
```

---

## Appendix A: Glossary

**App Router** - Next.js routing system using `/app` directory

**Server Component** - React component rendered on server (default in Next.js 14+)

**Client Component** - React component rendered on client (requires `'use client'`)

**Route Group** - Folder with `(name)` that doesn't affect URL structure

**Dynamic Route** - Route with `[param]` for dynamic segments

**Metadata** - Page information for SEO, browser, social sharing

**Suspense Boundary** - React feature for showing fallback during async operations

**Revalidation** - Strategy for updating cached data

**PHI (Protected Health Information)** - Sensitive healthcare data requiring HIPAA protection

---

## Appendix B: Additional Resources

**Official Next.js Documentation:**
- [App Router Documentation](https://nextjs.org/docs/app)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

**Internal Documentation:**
- `/frontend/docs/ARCHITECTURE.md` - Overall architecture
- `/frontend/docs/CLIENT_COMPONENT_GUIDE.md` - Client component patterns
- `/frontend/docs/DATA_FETCHING_STRATEGY.md` - Data fetching approaches
- `/frontend/docs/API_ROUTES_DOCUMENTATION.md` - API route details

---

**Questions or Issues?**
Contact the development team or open an issue in the repository.
