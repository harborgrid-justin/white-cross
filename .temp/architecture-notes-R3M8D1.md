# Architecture Notes - Metadata Standardization - R3M8D1

## References to Other Agent Work
- **E2E9C7**: Next.js App Router file conventions and structure
- **M7B2K9**: Frontend architecture and routing patterns
- **MQ7B8C**: Component organization and layout hierarchy

## Metadata Architecture Strategy

### Next.js Metadata API
Using Next.js 14+ Metadata API for type-safe, framework-native SEO:
- `export const metadata: Metadata` for server components
- Layout-level metadata for client component pages
- Dynamic metadata with `generateMetadata()` for dynamic routes
- File-based metadata (opengraph-image.tsx) for social sharing

### Metadata Structure

#### Standard Page Metadata
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feature Name | White Cross',
  description: 'Concise description (155 chars max)',
  openGraph: {
    title: 'Feature Name | White Cross Healthcare',
    description: 'Description for social sharing',
    type: 'website',
  },
};
```

#### Admin/Private Page Metadata
```typescript
export const metadata: Metadata = {
  title: 'Admin Feature | White Cross',
  description: 'Internal admin description',
  robots: {
    index: false,
    follow: false,
  },
};
```

#### Client Component Handling
For client components (marked with 'use client'), metadata must be exported from parent layout:

```typescript
// layout.tsx (parent of client component page)
export const metadata: Metadata = {
  title: 'Feature | White Cross',
  description: 'Feature description',
};
```

### Title Template Strategy
- **Root Layout**: Sets base title "White Cross Healthcare Platform"
- **Feature Pages**: Use format "Feature Name | White Cross"
- **Sub-Pages**: Use format "Sub-Feature - Feature | White Cross"
- **Dynamic Pages**: Use generateMetadata() with data fetching

### OpenGraph Image Strategy
1. **Root Level**: Existing opengraph-image.tsx with brand identity
2. **Section Level**: Create opengraph-image.tsx for major features:
   - Medications section
   - Appointments section
   - Students section
   - Incidents section
   - Analytics section
   - Inventory section

### Robots Configuration

#### Public/Marketing Pages
```typescript
robots: {
  index: true,
  follow: true,
}
```

#### Protected Healthcare Data Pages
```typescript
robots: {
  index: false,
  follow: false,
}
```

Applied to:
- All admin pages
- User management pages
- Patient data pages (students, medications, health records)
- Incident reports
- Billing information

### Description Best Practices
- **Length**: 120-155 characters for optimal display
- **Content**: Clear, action-oriented, keyword-rich
- **Format**: No generic filler, specific to page purpose
- **Tone**: Professional, healthcare-focused

### Integration with Existing Architecture

#### Layout Hierarchy
```
RootLayout (metadata set)
├── AuthLayout (metadata for auth pages)
├── DashboardLayout (metadata for authenticated app)
│   ├── MedicationsLayout (section metadata)
│   ├── AppointmentsLayout (metadata for client component pages)
│   └── [Feature Layouts...] (section-specific metadata)
├── AdminSettingsLayout (metadata with robots:noindex)
└── AdminMonitoringLayout (metadata with robots:noindex)
```

#### Dynamic Route Metadata
For dynamic routes like `/students/[id]`, use generateMetadata:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const student = await fetchStudentData(params.id);

  return {
    title: `${student.name} - Students | White Cross`,
    description: `Health record and information for ${student.name}`,
    robots: { index: false, follow: false },
  };
}
```

### HIPAA Compliance Considerations
1. **No PHI in Metadata**: Never include patient names, medical details, or identifiable information in titles/descriptions
2. **Robots Blocking**: All patient data pages must have robots:noindex
3. **OpenGraph Images**: Generic branding only, no patient-specific images
4. **Social Sharing**: Disabled for authenticated healthcare pages

### Performance Considerations
1. **Server Components**: Metadata exported from server components (no client-side overhead)
2. **Static Metadata**: Pre-generated at build time for static pages
3. **Dynamic Metadata**: Generated at request time only when needed
4. **OpenGraph Images**: Edge runtime for fast generation

### Metadata Testing Strategy
1. Verify correct Metadata type imports
2. Check title/description rendering in browser
3. Validate robots meta tags in HTML
4. Test OpenGraph previews (LinkedIn, Twitter, Slack)
5. Ensure no TypeScript errors
6. Validate character limits for descriptions

### Future Enhancements
1. Structured data (JSON-LD) for search engines
2. Twitter card metadata for better Twitter sharing
3. Custom metadata for mobile app indexing
4. Localization metadata for multi-language support
