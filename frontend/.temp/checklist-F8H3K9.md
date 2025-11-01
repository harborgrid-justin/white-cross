# TypeScript Error Fixing Checklist - F8H3K9

## Pre-Flight
- [x] Check .temp/ for existing agent work
- [x] Generate unique ID (F8H3K9)
- [x] Create tracking documents
- [ ] Analyze all 279 errors

## Error Analysis
- [ ] Extract complete error list from type-check
- [ ] Categorize errors by file
- [ ] Categorize errors by type (TS2353 vs TS2740)
- [ ] Identify common patterns

## Type Fixes - Query/Mutation Options
- [ ] Fix UseQueryOptions errors (gcTime, refetchInterval, meta, etc.)
- [ ] Fix UseMutationOptions errors (mutationKey, etc.)
- [ ] Create extended type definitions where needed

## Type Fixes - Component Props
- [ ] Fix CommunicationTemplatesTabProps errors
- [ ] Fix component prop interface extensions
- [ ] Add missing required properties

## Type Fixes - Data Models
- [ ] Fix BudgetTransaction interface
- [ ] Fix User interface extensions
- [ ] Fix MessageDto interface
- [ ] Fix DocumentFilters interface
- [ ] Fix other data model interfaces

## Type Fixes - Configuration
- [ ] Fix Apollo Client Options (connectToDevTools)
- [ ] Fix QueryClientConfig (queryCache)
- [ ] Fix Next.js config types
- [ ] Fix NotificationOptions

## Verification
- [ ] Run type-check and verify error count
- [ ] Ensure no TS2353 errors remain
- [ ] Ensure no TS2740 errors remain
- [ ] Update all tracking documents

## Completion
- [ ] Create completion summary
- [ ] Move files to .temp/completed/
