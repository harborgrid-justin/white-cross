# Document Queries Breakdown Checklist - DQ7M8N

## Phase 1: Setup & API Utilities
- [ ] Create documentQueryAPI.ts with mock API functions
- [ ] Verify LOC count under 300

## Phase 2: Core Queries
- [ ] Create useDocumentCoreQueries.ts
- [ ] Migrate useDocuments hook
- [ ] Migrate useDocumentDetails hook
- [ ] Migrate useDocumentVersions hook
- [ ] Migrate useSearchDocuments hook
- [ ] Migrate useRecentDocuments hook
- [ ] Migrate useFavoriteDocuments hook
- [ ] Migrate useSharedWithMe hook
- [ ] Verify LOC count under 300

## Phase 3: Category & Template Queries
- [ ] Create useDocumentCategoryQueries.ts
- [ ] Migrate category query hooks
- [ ] Migrate template query hooks
- [ ] Verify LOC count under 300

## Phase 4: Share & Activity Queries
- [ ] Create useDocumentShareQueries.ts
- [ ] Migrate share query hooks
- [ ] Migrate activity/comment hooks
- [ ] Verify LOC count under 300

## Phase 5: Analytics Queries
- [ ] Create useDocumentAnalyticsQueries.ts
- [ ] Migrate analytics hooks
- [ ] Migrate dashboard hooks
- [ ] Verify LOC count under 300

## Phase 6: Index & Re-exports
- [ ] Create index.ts
- [ ] Re-export all hooks for backward compatibility
- [ ] Verify LOC count under 300

## Phase 7: Verification
- [ ] Verify all files under 300 LOC
- [ ] Verify all original exports maintained
- [ ] Verify imports are correct
- [ ] Verify TypeScript types
- [ ] Check for any breaking changes
