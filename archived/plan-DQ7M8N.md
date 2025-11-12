# Document Queries Breakdown Plan - DQ7M8N

## Task Overview
Break down the large `useDocumentQueries.ts` file (729 lines) into smaller, focused modules with max 300 LOC each.

## File Structure Analysis
Current file contains:
- Mock API functions (lines 58-176): ~119 LOC
- Document core queries (lines 216-523): ~308 LOC
- Category queries (lines 525-562): ~38 LOC
- Template queries (lines 564-600): ~37 LOC
- Share queries (lines 602-638): ~37 LOC
- Activity/Comments queries (lines 641-667): ~27 LOC
- Analytics queries (lines 669-695): ~27 LOC
- Bulk/Dashboard queries (lines 697-729): ~33 LOC

## Breakdown Strategy

### 1. documentQueryAPI.ts (~120 LOC)
- Extract all mock API functions
- Single source of truth for API calls
- Easy to replace with real API later

### 2. useDocumentCoreQueries.ts (~220 LOC)
- useDocuments
- useDocumentDetails
- useDocumentVersions
- useSearchDocuments
- useRecentDocuments
- useFavoriteDocuments
- useSharedWithMe

### 3. useDocumentCategoryQueries.ts (~100 LOC)
- useCategories
- useCategoryDetails
- useCategoryDocuments
- useTemplates
- useTemplateDetails
- usePopularTemplates

### 4. useDocumentShareQueries.ts (~100 LOC)
- useDocumentShares
- useShareDetails
- useShareByToken
- useDocumentActivity
- useDocumentComments

### 5. useDocumentAnalyticsQueries.ts (~100 LOC)
- useDocumentAnalytics
- useDocumentsDashboard
- useDocumentOverview

### 6. index.ts (~50 LOC)
- Re-export all hooks
- Backward compatibility
- Clean public API

## Timeline
1. Create API utilities file
2. Create core queries file
3. Create category queries file
4. Create share queries file
5. Create analytics queries file
6. Create index file
7. Verify LOC counts and functionality

## Success Criteria
- All files under 300 LOC
- All original exports maintained
- All functionality preserved
- Clean imports/exports
- Proper TypeScript types
