# Metadata Standardization Checklist - R3M8D1

## Phase 1: Audit ✅
- [x] Count total page.tsx files (176)
- [x] Identify existing metadata exports
- [x] Review root layout metadata configuration
- [x] Review existing opengraph-image.tsx
- [x] Categorize routes by priority
- [x] Identify client components needing layout metadata

## Phase 2: High-Priority Routes ✅ COMPLETED
### Dashboard Section
- [x] Add metadata to dashboard/page.tsx
- [x] ~~Add metadata to medications/page.tsx~~ (client component - layout has metadata)
- [ ] ~~Add metadata to appointments layout~~ (no layout file found, client component)
- [ ] ~~Add metadata to students/page.tsx~~ (page file not found)
- [x] Enhance incidents/page.tsx metadata (add openGraph, robots:noindex)
- [x] Enhance inventory/page.tsx metadata (add openGraph, robots:noindex)
- [x] Add metadata to billing/page.tsx
- [x] Enhance analytics/page.tsx metadata (add openGraph, robots:noindex)

### Sub-Routes (Selected High-Traffic)
- [ ] medications/active/page.tsx
- [ ] medications/schedules/page.tsx
- [ ] appointments/calendar/page.tsx
- [ ] appointments/upcoming/page.tsx
- [ ] students/[id]/page.tsx
- [ ] incidents/new/page.tsx
- [ ] inventory/items/page.tsx

## Phase 3: Admin & Auth Routes ✅ COMPLETED
### Admin Routes
- [x] admin/settings/page.tsx (robots:noindex, dynamic)
- [x] ~~admin/monitoring/page.tsx~~ (just redirects, no metadata needed)
- [ ] admin/settings/users/page.tsx (robots:noindex) - can add later
- [ ] admin/settings/security/page.tsx (robots:noindex) - can add later

### Auth Routes
- [x] (auth)/layout.tsx - Already has title template and description
- [x] (auth)/login/page.tsx - Client component, uses layout metadata
- [x] ~~(auth)/register/page.tsx~~ - No file found
- [x] ~~(auth)/forgot-password/page.tsx~~ - No file found
- [x] (auth)/access-denied/page.tsx - Client component, uses layout metadata
- [x] (auth)/session-expired/page.tsx - Client component, uses layout metadata

## Phase 4: Supporting Routes ⏳
- [ ] communications/page.tsx
- [ ] communications/messages/page.tsx
- [ ] documents/page.tsx
- [ ] forms/page.tsx
- [ ] compliance/page.tsx
- [ ] compliance/audits/page.tsx
- [ ] reports/page.tsx
- [ ] immunizations/page.tsx

## Phase 5: OpenGraph Images ⏳
- [ ] Create medications/opengraph-image.tsx
- [ ] Create appointments/opengraph-image.tsx
- [ ] Create students/opengraph-image.tsx
- [ ] Create incidents/opengraph-image.tsx
- [ ] Create inventory/opengraph-image.tsx
- [ ] Create analytics/opengraph-image.tsx

## Phase 6: Validation ⏳
- [ ] Verify Metadata type imports from 'next'
- [ ] Check title templates consistency
- [ ] Validate description format and length
- [ ] Verify robots:noindex on admin pages
- [ ] Check openGraph data structure
- [ ] Test metadata rendering in browser
- [ ] Verify no TypeScript errors

## Quality Checks
- [ ] All metadata follows Next.js conventions
- [ ] Proper TypeScript typing (Metadata type)
- [ ] Consistent title format: "Feature | White Cross"
- [ ] Descriptions are concise and descriptive
- [ ] Admin pages have robots:noindex
- [ ] OpenGraph images use proper dimensions
- [ ] No duplicate metadata exports
