# Implementation Plan - TS2345 Error Fixes (F6G8H2)

## References to Other Agent Work
- Architecture notes: `.temp/architecture-notes-A1B2C3.md`
- Previous type system work: `.temp/task-status-X7Y3Z9.json`

## Overview
Fix all 276 TS2345 "Argument not assignable to parameter" errors using ONLY additive solutions - no code deletion.

## Error Categories and Solutions

### Phase 1: Utility Functions (30 min)
Create type-safe utility functions for common patterns:
- `cn()` wrapper to handle `false | string` className patterns
- `ensureString()` for `string | undefined` to `string` conversions
- `ensureArray()` for array type conversions
- Type guards for narrowing types

### Phase 2: Conditional ClassName Fixes (~20 errors)
Files affected:
- src/app/(dashboard)/communications/_tabs/*.tsx
- src/components/features/shared/*.tsx
- src/components/ui/*/*.tsx

Solution: Add inline conversions or ternary operators to ensure only string values

### Phase 3: API Call Object Fixes (~5 errors)
Files affected:
- src/app/(dashboard)/communications/_components/InboxContent.tsx
- src/app/(dashboard)/communications/broadcasts/_components/BroadcastsContent.tsx
- src/app/(dashboard)/communications/templates/_components/TemplatesContent.tsx

Solution: Add missing required properties (offset, grouped) with default values

### Phase 4: React Hook Form Fixes (~6 errors)
Files affected:
- src/components/analytics/CustomReportBuilder.tsx
- src/components/communications/BroadcastForm.tsx
- src/components/incidents/*.tsx

Solution: Add type assertion wrapper functions or extend form type definitions

### Phase 5: QueryClient Updater Functions (~12 errors)
Files affected:
- src/features/notifications/hooks/*.ts
- src/components/communications/MessageInbox.tsx
- src/components/communications/NotificationBell.tsx

Solution: Ensure updater functions always return non-undefined values

### Phase 6: UseQueryOptions Fixes (~15 errors)
Files affected:
- src/hooks/domains/compliance/composites/*.ts
- src/hooks/domains/documents/composites/*.ts
- src/hooks/domains/emergency/composites/*.ts

Solution: Extend option objects with proper typing or use type assertions

### Phase 7: Literal Type Mismatches (~20 errors)
Files affected:
- src/hooks/domains/appointments/**/*.ts
- src/hooks/domains/medications/**/*.ts
- src/constants/errors.ts

Solution: Add type conversion functions and type guards

### Phase 8: Remaining Errors (~188 errors)
Process all remaining errors systematically by file

## Deliverables
1. Type utility functions in new file or existing utils
2. All 276 errors resolved
3. No code deletions
4. Verification via type-check

## Timeline
- Phase 1-2: 45 min
- Phase 3-5: 60 min
- Phase 6-8: 90 min
- Testing & verification: 15 min
- **Total: ~3.5 hours**
