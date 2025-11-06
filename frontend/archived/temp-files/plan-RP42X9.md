# Implementation Plan: ReportPermissions Component Refactoring
**Task ID:** RP42X9
**Agent:** React Component Architect
**Started:** 2025-11-04

## Related Agent Work
- Plan BDM701: Previous component refactoring patterns
- Completion CM734R: Recent component breakdown strategies
- Task Status BDM701: Similar large component refactoring

## Objective
Break down ReportPermissions.tsx (1,065 LOC) into smaller, focused components under 300 LOC each while maintaining backward compatibility and improving maintainability.

## Current File Analysis
- **Total Lines:** 1,065
- **Main Sections:**
  - Type definitions (42-164): ~122 LOC
  - Utility functions (229-334): ~105 LOC
  - Permissions list rendering (402-631): ~229 LOC
  - Templates tab rendering (633-727): ~94 LOC
  - Access logs tab rendering (729-831): ~102 LOC
  - Create permission modal (835-964): ~129 LOC
  - Create template modal (966-1060): ~94 LOC

## Refactoring Strategy

### Phase 1: Directory Setup (5 min)
- Create `ReportPermissions/` subdirectory
- Set up file structure for organized component architecture

### Phase 2: Type Extraction (10 min)
**File:** `ReportPermissions/types.ts` (Target: <150 LOC)
- Extract all interfaces and type definitions
- Add comprehensive JSDoc comments
- Export all types for reuse

### Phase 3: Utility Functions (10 min)
**File:** `ReportPermissions/utils.ts` (Target: <150 LOC)
- Extract permission level display logic
- Extract entity type icon mapping
- Extract filtering logic for rules and logs
- Add unit test utilities

### Phase 4: Custom Hooks (15 min)
**File:** `ReportPermissions/hooks.ts` (Target: <200 LOC)
- Create `usePermissionFilters` hook
- Create `usePermissionForm` hook
- Create `useTemplateForm` hook
- Create `useBulkSelection` hook
- Add proper dependency arrays and cleanup

### Phase 5: Feature Component - Permissions Table (20 min)
**File:** `ReportPermissions/PermissionsTable.tsx` (Target: <250 LOC)
- Extract permissions list table rendering
- Include search and filter controls
- Handle bulk selection
- Proper TypeScript props interface

### Phase 6: Feature Component - Templates Grid (15 min)
**File:** `ReportPermissions/TemplatesGrid.tsx` (Target: <200 LOC)
- Extract templates display and management
- Template card rendering
- Apply template functionality

### Phase 7: Feature Component - Access Logs Table (15 min)
**File:** `ReportPermissions/AccessLogsTable.tsx` (Target: <200 LOC)
- Extract access logs display
- Search and filtering
- Log entry rendering

### Phase 8: Feature Component - Permission Modal (15 min)
**File:** `ReportPermissions/PermissionModal.tsx` (Target: <200 LOC)
- Extract permission creation modal
- Form validation
- Conditional rendering for scope selection

### Phase 9: Feature Component - Template Modal (10 min)
**File:** `ReportPermissions/TemplateModal.tsx` (Target: <150 LOC)
- Extract template creation modal
- Template form handling

### Phase 10: Main Component Refactor (20 min)
**File:** `ReportPermissions/index.tsx` (Target: <250 LOC)
- Orchestrate all feature components
- Manage high-level state
- Tab navigation
- Re-export types for backward compatibility

### Phase 11: Backward Compatibility (10 min)
**File:** `Reports/ReportPermissions.tsx` (Target: <20 LOC)
- Create re-export file at original location
- Maintain import compatibility
- Add deprecation notice comments

### Phase 12: Verification (10 min)
- Verify all exports
- Check TypeScript compilation
- Ensure no breaking changes
- Update any affected imports

## File Structure (Final)
```
components/pages/Reports/
├── ReportPermissions.tsx (re-export, ~20 LOC)
└── ReportPermissions/
    ├── index.tsx (~250 LOC)
    ├── types.ts (~150 LOC)
    ├── utils.ts (~150 LOC)
    ├── hooks.ts (~200 LOC)
    ├── PermissionsTable.tsx (~250 LOC)
    ├── TemplatesGrid.tsx (~200 LOC)
    ├── AccessLogsTable.tsx (~200 LOC)
    ├── PermissionModal.tsx (~200 LOC)
    └── TemplateModal.tsx (~150 LOC)
```

## Success Criteria
- All files under 300 LOC
- No TypeScript errors
- Backward compatibility maintained
- All original functionality preserved
- Improved code organization and readability

## Timeline
**Total Estimated Time:** ~2.5 hours

## Risk Mitigation
- Keep original file as backup until verification complete
- Test each component extraction incrementally
- Maintain all prop types and interfaces
- Document any API changes clearly
