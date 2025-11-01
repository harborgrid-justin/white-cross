# Plan: Fix TS2305 Module Export Errors - Agent 6

## Agent ID: M7N5Q8
## Related Work:
- `.temp/typescript-errors-T5E8R2.txt` - Error catalog from Agent T5E8R2
- `.temp/typescript-errors-K9M3P6.txt` - Error catalog from Agent K9M3P6

## Objective
Fix all TS2305 (Module has no exported member) errors by adding missing exports, creating barrel exports, and adding proper type declarations.

## Phases

### Phase 1: Analysis (15 min)
- Parse error logs to identify all TS2305 errors
- Categorize errors by module type
- Prioritize fixes by impact

### Phase 2: Type Definition Fixes (30 min)
- Fix `@/types/budget` - add BudgetVariance export
- Fix `@/types/documents` - add DocumentMetadata export
- Fix `@/stores/reduxStore` - add RootState and getStorageStats exports

### Phase 3: Schema Export Fixes (20 min)
- Fix `@/schemas/settings.schemas` - add all missing schema exports

### Phase 4: Component Export Fixes (30 min)
- Fix health-records modal components - add default exports
- Fix UI components (Badge, Checkbox, SearchInput, Switch) - add default exports

### Phase 5: Action Export Fixes (20 min)
- Fix `@/lib/actions/communications.actions` - add missing action exports

### Phase 6: Third-Party Type Declarations (30 min)
- Add type declarations for @tanstack/react-query exports
- Add type declarations for @apollo/client exports
- Handle React Suspense issue

## Deliverables
- All TS2305 errors resolved
- Proper export statements added
- Type declarations created where needed
- Summary report of fixes

## Timeline
Estimated completion: 2.5 hours
