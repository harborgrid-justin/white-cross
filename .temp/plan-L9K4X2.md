# Implementation Plan - Next.js 15 Link Updates (L9K4X2)

## References to Other Agent Work
- **SF7K3W**: Previous Next.js 15 best practices implementation
- **C4D9F2**: Frontend architecture and component patterns

## Objective
Update all Next.js Link component usage in shared/reusable components to align with Next.js 15 best practices.

## Phase 1: Analysis (30 min)
- Review all 24 components identified using Link
- Categorize by component type (navigation, cards, layouts, etc.)
- Identify specific anti-patterns in each file

## Phase 2: Navigation & Menu Components (45 min)
- Update Breadcrumbs components (2 files)
- Update Navigation component
- Update Sidebar component
- Update SearchBar component

## Phase 3: Card Components (30 min)
- Update StudentCard
- Update IncidentCard
- Update AppointmentCard
- Update StudentInfoCard

## Phase 4: Layout Components (30 min)
- Update Header
- Update Footer
- Update NotificationCenter

## Phase 5: Feature & Page Components (45 min)
- Update remaining page-specific components
- Update feature components

## Phase 6: Validation (30 min)
- Review all changes for consistency
- Ensure TypeScript types are correct
- Verify accessibility attributes preserved
- Check for any remaining Link anti-patterns

## Total Estimated Time: 3.5 hours

## Key Updates to Apply
1. Remove `<a>` child elements inside Link
2. Remove `passHref` prop (deprecated in Next.js 15)
3. Apply className/style directly to Link
4. Set appropriate prefetch settings (default true for production)
5. Ensure proper TypeScript prop typing
6. Preserve accessibility attributes (aria-*, role, etc.)
