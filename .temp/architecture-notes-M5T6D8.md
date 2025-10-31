# Architecture Notes - Metadata and SEO Functions
**Agent ID:** M5T6D8
**Task:** Next.js Metadata and SEO Implementation
**Date:** 2025-10-31

## References to Other Agent Work
- Previous Next.js App Router conventions work: `.temp/architecture-notes-AP9E2X.md`
- TypeScript improvements: `.temp/architecture-notes-N4W8Q2.md`
- Component architecture: `.temp/architecture-notes-R3M8D1.md`

## Executive Summary

Audited 176 page.tsx files across the frontend codebase. Found:
- **Strong foundation**: Root layout has proper metadata and viewport configuration
- **Excellent example**: students/[id]/page.tsx demonstrates perfect generateMetadata implementation
- **Gaps identified**: Many dynamic routes use static metadata instead of generateMetadata
- **SEO opportunity**: Dynamic metadata will improve search discoverability and user experience

## Current State Analysis

### ✅ Properly Implemented

1. **Root Layout** (`/frontend/src/app/layout.tsx`)
   - Static metadata export with comprehensive SEO configuration
   - Viewport configuration (removed maximumScale for WCAG compliance)
   - Proper robots: noindex (correct for healthcare PHI protection)
   - Self-hosted fonts for HIPAA compliance
   - Excellent documentation

2. **Student Detail Page** (`students/[id]/page.tsx`)
   - **GOLD STANDARD** implementation of generateMetadata
   - Async function fetching student data
   - Dynamic title based on student name
   - Proper error handling (not found case)
   - TypeScript types with Promise<Metadata>
   - Uses Next.js 15 async params pattern

3. **Dashboard Page** (`(dashboard)/dashboard/page.tsx`)
   - Static metadata export (appropriate for static page)
   - Proper title structure
   - Dynamic rendering configured

### ⚠️ Needs Improvement

1. **Incident Detail Page** (`incidents/[id]/page.tsx`)
   - Has static metadata only
   - **Should use generateMetadata** to include incident number in title
   - Already fetches incident data, just needs metadata function

2. **Message Detail Page** (`communications/messages/[id]/page.tsx`)
   - Has static metadata only
   - **Should use generateMetadata** for message subject/sender in title

3. **Client Components** (correct as-is)
   - Many pages are client components ('use client')
   - Correctly do NOT export metadata (client components can't)
   - Examples: students/page.tsx, billing/invoices/[id]/page.tsx

## High-Level Design Decisions

### 1. Metadata Strategy

**Static Metadata** - Use for:
- Pages with fixed content (dashboard, list pages)
- Client components (they can't export metadata)
- Pages where dynamic content doesn't improve SEO

**generateMetadata** - Use for:
- Dynamic [id] routes with unique content
- Pages where title/description should reflect loaded data
- Detail pages (students, incidents, messages, invoices, etc.)

### 2. SEO Configuration

**Healthcare App Considerations:**
- `robots: { index: false, follow: false }` - All pages (PHI protection)
- No Open Graph for detail pages (prevent social sharing of PHI)
- Focus on browser tab UX rather than search engine ranking

### 3. TypeScript Pattern

```typescript
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params; // Next.js 15 async params
  const result = await fetchData(id);

  if (!result.success || !result.data) {
    return {
      title: 'Not Found | White Cross Healthcare'
    };
  }

  return {
    title: `${result.data.name} | White Cross Healthcare`,
    description: result.data.description,
    robots: { index: false, follow: false }
  };
}
```

## Implementation Patterns

### Pattern 1: Entity Detail Pages
- **Use Case**: Student, Incident, Invoice, Message detail pages
- **Implementation**: generateMetadata with entity-specific data
- **Title Format**: `{Entity Name} | {Section} | White Cross`
- **Description**: Entity-specific summary

### Pattern 2: List/Index Pages
- **Use Case**: Students list, Incidents list, Dashboard
- **Implementation**: Static metadata export
- **Title Format**: `{Section Name} | White Cross`
- **Description**: Section description

### Pattern 3: Client Components
- **Use Case**: Interactive forms, real-time data, client state
- **Implementation**: No metadata export (handled by parent layout)
- **Note**: Layout above provides metadata

## Performance Considerations

### Metadata Caching
- Static metadata: Cached at build time
- generateMetadata: Cached per request (with revalidation)
- Server actions: Already implement caching

### Page Load Performance
- generateMetadata runs in parallel with page component
- Both can use same data fetching function (deduplication)
- Next.js 15 Request Memoization prevents duplicate fetches

### Revalidation Strategy
- Detail pages: `force-dynamic` (real-time data requirements)
- List pages: Consider ISR with revalidation
- Metadata follows page revalidation strategy

## Type Safety

### Metadata Types from 'next'
```typescript
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { ... };
export const viewport: Viewport = { ... };

export async function generateMetadata(): Promise<Metadata> { ... }
export async function generateViewport(): Promise<Viewport> { ... }
```

### Params Typing (Next.js 15)
```typescript
// Correct pattern for Next.js 15
params: Promise<{ id: string }>

// Inside function
const { id } = await params;
```

## Integration with Existing Architecture

### Server Actions
- Reuse existing getStudentById, getIncident, etc.
- No new data fetching needed
- Leverage existing error handling

### TypeScript Types
- Import existing entity types (Student, Incident, etc.)
- Use existing Result<T> pattern for error handling

### File Conventions
- Keep metadata exports at top of page.tsx files
- Follow existing documentation patterns
- Maintain consistency with codebase style

## Recommendations

### High Priority
1. Implement generateMetadata for all dynamic [id] routes
2. Add generateStaticParams for frequently accessed entities
3. Ensure consistent title format across all pages

### Medium Priority
1. Consider viewport configuration for specific pages
2. Implement proper metadata merging strategy
3. Document metadata patterns in codebase guidelines

### Low Priority
1. OG image generation (limited value for healthcare app)
2. Sitemap generation (noindex makes this less valuable)
3. JSON-LD structured data (minimal SEO benefit for authenticated app)

## Security and Compliance

### HIPAA Considerations
- No PHI in metadata (titles should use IDs or generic names)
- Robots meta prevents search engine indexing
- No social sharing metadata (prevents accidental PHI exposure)

### Example - Compliant Metadata
```typescript
// ✅ GOOD - No PHI in title
title: `Incident #${incidentNumber} | White Cross`

// ❌ BAD - PHI exposure
title: `John Doe's Medical Incident | White Cross`
```

## Next Steps

1. Implement generateMetadata for high-value dynamic routes
2. Test metadata rendering across all pages
3. Validate SEO meta tags in browser
4. Document patterns for future development
