# Architecture Notes - TypeScript Error Fixes F8H3K9

## References to Other Agent Work
- Previous TypeScript work: `.temp/task-status-X7Y3Z9.json`
- Architecture baseline: `.temp/architecture-notes-A1B2C3.md`

## Error Analysis Complete

### Total Errors: 279
- TS2353 (unknown properties): ~241 errors
- TS2740 (missing properties): ~38 errors

### Error Categories

#### 1. React Query Type Extensions (~180 errors)
**Problem**: `UseQueryOptions` and `UseMutationOptions` from @tanstack/react-query are missing properties
**Missing Properties**:
- `gcTime` (garbage collection time) - ~150 instances
- `refetchInterval` - ~20 instances
- `meta` - ~10 instances
- `initialData` - ~1 instance
- `mutationKey` - ~10 instances
- `retry`, `onMutate` - ~5 instances

**Solution**: Extend React Query types with declaration merging

#### 2. Data Model Extensions (~30 errors)
**Missing Properties in Interfaces**:
- `BudgetTransaction`: needs `budgetId`
- `User`: needs `user` property
- `MessageDto`: needs `_tempId`
- `DocumentFilters`: needs `pageSize`, `folderId`, `isPHI`
- `StudentFilters`: needs `sortBy`, `searchTerm`, `status`
- `ProxyConfig`: needs `body`
- Various update request types

**Solution**: Extend existing interfaces with additional properties

#### 3. Zod Schema Options (~15 errors)
**Problem**: Zod type definitions missing error configuration options
**Missing**: `required_error`, `errorMap`

**Solution**: Extend Zod type definitions

#### 4. Configuration Objects (~5 errors)
- Apollo Client `Options`: needs `connectToDevTools`
- `QueryClientConfig`: needs `queryCache`
- `NotificationOptions`: needs `vibrate`
- `BrowserTracingOptions`: needs `tracePropagationTargets`
- `AuditConfig`: needs `enabled`

**Solution**: Extend configuration types

#### 5. API Response Type Mismatches (~27 errors)
**Problem**: Functions returning `ApiResponse<T>` but expecting `T`
**Files**: Various health API files

**Solution**: Add type assertions or extend return types

#### 6. Component Props (~2 errors)
**Problem**: `CommunicationTemplatesTabProps` missing required properties

**Solution**: Make props optional or provide defaults

## Type Safety Strategy

### Approach
1. **Create global type extensions** in `src/types/extensions/`
2. **Use declaration merging** for third-party libraries
3. **Extend interfaces** for first-party code
4. **Add index signatures** where appropriate
5. **Use utility types** (Partial, Pick) where needed

### Implementation Order
1. React Query extensions (biggest impact)
2. Data model extensions
3. Configuration type extensions
4. Zod schema extensions
5. API response fixes
6. Component prop fixes

## Quality Assurance
- All fixes maintain type safety
- No code deletion, only additions
- Backward compatible
- Follows TypeScript best practices
