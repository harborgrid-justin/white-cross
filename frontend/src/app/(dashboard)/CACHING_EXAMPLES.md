# Next.js v16 Caching Examples

This document provides examples of caching strategies implemented in the White Cross Healthcare platform, following Next.js v16 best practices.

## Table of Contents

1. [Route Segment Configuration](#route-segment-configuration)
2. [API Route Caching](#api-route-caching)
3. [generateStaticParams](#generatestaticparams)
4. [On-Demand Revalidation](#on-demand-revalidation)
5. [Cache Tags](#cache-tags)

## Route Segment Configuration

### Dynamic Routes (Force Dynamic)

For pages that require real-time data or authentication, use `force-dynamic`:

```typescript
// app/(dashboard)/dashboard/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch fresh data on every request
  const stats = await getDashboardStats();
  return <DashboardContent stats={stats} />;
}
```

**Use Cases:**
- Dashboard with real-time alerts
- User-specific data (protected routes)
- PHI data requiring audit logging

### Static with ISR (Incremental Static Regeneration)

For pages that can be cached briefly but need periodic updates:

```typescript
// app/(dashboard)/students/[id]/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 15; // Revalidate every 15 seconds

export default async function StudentDetailsPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id);
  return <StudentDetails student={student} />;
}
```

**Use Cases:**
- Student detail pages (PHI - short cache)
- Document listings (medium cache)
- Reference data (long cache)

### Fully Static

For truly static content:

```typescript
// app/about/page.tsx
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate automatically

export default function AboutPage() {
  return <div>About our platform...</div>;
}
```

**Use Cases:**
- Marketing pages
- Documentation
- Legal/compliance pages

## API Route Caching

### PHI Data (Short Cache)

```typescript
// app/api/students/route.ts
import { getCacheConfig, generateCacheTags, getCacheControlHeader } from '@/lib/cache/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = withAuth(async (request: NextRequest, context, auth) => {
  const cacheConfig = getCacheConfig('students');
  const cacheTags = generateCacheTags('students');
  const cacheControl = getCacheControlHeader('students');

  const response = await proxyToBackend(request, '/students', {
    cache: {
      revalidate: 15, // 15 seconds for PHI data
      tags: cacheTags
    },
    cacheControl
  });

  return NextResponse.json(data, { status: response.status });
});
```

### Analytics Data (Medium Cache)

```typescript
// app/api/analytics/route.ts
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  const cacheConfig = getCacheConfig('analytics');
  const cacheTags = generateCacheTags('analytics');

  const response = await proxyToBackend(request, '/analytics', {
    cache: {
      revalidate: 300, // 5 minutes for analytics
      tags: cacheTags
    },
    cacheControl: getCacheControlHeader('analytics')
  });

  return NextResponse.json(data);
});
```

### Reference Data (Long Cache)

```typescript
// app/api/districts/route.ts
export const GET = withAuth(async (request: NextRequest) => {
  const response = await proxyToBackend(request, '/districts', {
    cache: {
      revalidate: 1800, // 30 minutes for reference data
      tags: ['districts', 'reference-data']
    },
    cacheControl: 'private, max-age=1800, s-maxage=1800, stale-while-revalidate=3600'
  });

  return NextResponse.json(data);
});
```

## generateStaticParams

### Important Note for Healthcare Platform

**⚠️ For PHI Data:** We generally **DO NOT** use `generateStaticParams` for patient health information (PHI) routes because:

1. **Security:** Pre-generating pages for all students would expose PHI in the build
2. **Compliance:** HIPAA requires fresh audit logs on each access
3. **Volatility:** Student data changes frequently
4. **Scale:** Thousands of students would create too many static pages

### Appropriate Use Cases

`generateStaticParams` is appropriate for:

- Public documentation pages
- Reference data with known IDs
- Template forms (not filled forms)
- Non-sensitive configuration pages

### Example: Document Templates

For a route with a limited, known set of IDs:

```typescript
// app/documents/templates/[id]/page.tsx

/**
 * Route segment config - Static with ISR
 */
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

/**
 * Generate static params for all known template IDs
 * This pre-renders pages at build time for better performance
 */
export async function generateStaticParams() {
  // Fetch list of template IDs from API or database
  // This runs at build time
  const templates = await getDocumentTemplates();

  return templates.map((template) => ({
    id: template.id,
  }));
}

/**
 * Generate metadata for each template
 */
export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const template = await getDocumentTemplate(params.id);

  return {
    title: `${template.name} | Templates`,
    description: template.description
  };
}

export default async function TemplateDetailPage({
  params
}: {
  params: { id: string };
}) {
  const template = await getDocumentTemplate(params.id);
  return <TemplateViewer template={template} />;
}
```

### Example: Public Forms (Non-PHI)

```typescript
// app/public-forms/[formType]/page.tsx

export async function generateStaticParams() {
  // Pre-generate pages for known public form types
  return [
    { formType: 'visitor-registration' },
    { formType: 'volunteer-application' },
    { formType: 'facility-rental' }
  ];
}

export default async function PublicFormPage({
  params
}: {
  params: { formType: string };
}) {
  const form = await getPublicForm(params.formType);
  return <PublicFormViewer form={form} />;
}
```

### Why NOT to use for PHI Routes

**❌ Bad Example (DO NOT DO THIS):**

```typescript
// app/students/[id]/page.tsx

// ❌ WRONG: Don't pre-generate PHI pages
export async function generateStaticParams() {
  // This would expose all student IDs at build time
  // and create security/compliance issues
  const students = await getAllStudents(); // ❌
  return students.map(s => ({ id: s.id })); // ❌
}
```

**✅ Good Example (Use Dynamic Rendering):**

```typescript
// app/students/[id]/page.tsx

// ✅ CORRECT: Force dynamic rendering for PHI
export const dynamic = 'force-dynamic';
export const revalidate = 15; // Short ISR for fresh data

export default async function StudentPage({
  params
}: {
  params: { id: string };
}) {
  // This runs on every request with proper auth and audit logging
  const student = await getStudent(params.id);
  return <StudentDetails student={student} />;
}
```

## On-Demand Revalidation

### Manual Cache Invalidation

Use the `/api/revalidate` endpoint for manual cache invalidation:

```typescript
// Revalidate a specific path
await fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'path',
    path: '/dashboard'
  })
});

// Revalidate a specific resource
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    type: 'resource',
    resourceType: 'students',
    resourceId: '123'
  })
});

// Revalidate all student-related data
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    type: 'student',
    studentId: '123'
  })
});

// Batch revalidation
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    type: 'batch',
    resources: [
      { type: 'students', id: '123' },
      { type: 'appointments', id: '456' }
    ]
  })
});
```

### Programmatic Revalidation

In server actions or API routes:

```typescript
import { invalidateStudentData } from '@/lib/cache/invalidation';

export async function updateStudent(id: string, data: StudentData) {
  // Update student in database
  await db.student.update({ where: { id }, data });

  // Invalidate all related caches
  await invalidateStudentData(id);

  return { success: true };
}
```

## Cache Tags

### Granular Invalidation

Cache tags enable precise cache invalidation:

```typescript
// Hierarchical tags
generateCacheTags('students', '123')
// Returns: ['students', 'student-123', 'phi-data']

// Cross-resource tags
generateRelatedTags('healthRecords', '789', { studentId: '123' })
// Returns: ['health-records', 'health-record-789', 'student-123', 'student-123-health-records', 'phi-data']
```

### Tag Strategy

```
students              ← Invalidate all students
└─ student-{id}       ← Invalidate specific student
   ├─ student-{id}-health-records
   ├─ student-{id}-medications
   ├─ student-{id}-appointments
   └─ student-{id}-incidents

phi-data              ← Invalidate all PHI (emergency)
reference-data        ← Invalidate all reference data
analytics             ← Invalidate all analytics
```

### Invalidation Examples

```typescript
// Update student → Invalidate student + all related data
await invalidateStudentData(studentId);

// Create health record → Invalidate health records + student
await invalidateHealthRecordData(recordId, studentId);

// Update appointment → Invalidate appointment + student
await invalidateAppointmentData(appointmentId, studentId);
```

## Best Practices

### 1. PHI Data Caching

- **Short cache times:** 15-30 seconds
- **Always tag with:** `phi-data`
- **Always audit log:** Access must be logged
- **Private cache:** Use `private` in Cache-Control
- **Never pre-generate:** Use dynamic rendering

### 2. Cache Invalidation

- **Granular:** Invalidate only what changed
- **Hierarchical:** Invalidate parent when child changes
- **Cross-resource:** Invalidate related resources
- **Batch operations:** Use batch invalidation for efficiency

### 3. Route Configuration

- **Dynamic for auth:** Use `force-dynamic` for protected routes
- **ISR for semi-static:** Use revalidate for data that changes periodically
- **Static for public:** Use `force-static` for truly static content

### 4. Headers

- **PHI:** `private, max-age=15, s-maxage=15, stale-while-revalidate=30`
- **Analytics:** `private, max-age=300, s-maxage=300, stale-while-revalidate=600`
- **Reference:** `private, max-age=1800, s-maxage=1800, stale-while-revalidate=3600`

## Monitoring

Track cache effectiveness:

```typescript
// In API routes
console.log({
  resource: 'students',
  cacheStatus: response.headers.get('x-vercel-cache'), // HIT, MISS, BYPASS
  revalidate: cacheConfig.revalidate,
  tags: cacheTags
});
```

## Testing

Test cache behavior:

```bash
# First request (cache MISS)
curl -i http://localhost:3000/api/students

# Second request within revalidate time (cache HIT)
curl -i http://localhost:3000/api/students

# Force revalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"type":"resource","resourceType":"students"}'

# Verify cache cleared (cache MISS again)
curl -i http://localhost:3000/api/students
```

## References

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
