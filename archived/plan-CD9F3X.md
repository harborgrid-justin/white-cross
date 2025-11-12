# Refactoring Plan: ComplianceDetail.tsx
**Agent ID**: react-component-architect
**Task ID**: CD9F3X
**Created**: 2025-11-04
**Status**: In Progress

## Cross-Agent References
- UI/UX Component Patterns: `.temp/plan-A1B2C3.md`
- Compliance Module Work: `.temp/task-status-CM734R.json`
- Component Architecture: `.temp/plan-BDM701.md`

## Overview
Refactor the massive ComplianceDetail.tsx component (1,105 lines) into smaller, maintainable components under 300 LOC each. The component currently handles all compliance detail functionality in a single file with multiple tabs.

## Current Component Analysis

### Component Structure (1,105 LOC)
- **Lines 1-127**: Imports, interfaces, and props definitions
- **Lines 128-319**: Main component setup, state, utility functions, and loading state
- **Lines 320-488**: Header section with key metrics
- **Lines 489-523**: Tab navigation
- **Lines 524-1105**: Tab content sections
  - Overview tab: Lines 528-702
  - Tasks tab: Lines 706-817
  - Evidence tab: Lines 820-902
  - History tab: Lines 905-935
  - Comments tab: Lines 938-1026
  - Settings tab: Lines 1029-1099

### Key Responsibilities
1. **State Management**: Tab navigation, form state, section expansion
2. **Tab Views**: Overview, Tasks, Evidence, History, Comments, Settings
3. **Inline Editing**: Edit mode for requirement details
4. **Task Management**: Add, toggle, delete tasks
5. **Evidence Management**: Upload, download, delete evidence files
6. **Comments System**: Add and delete comments
7. **History Display**: Activity timeline
8. **Settings**: Status management and notifications

## Refactoring Strategy

### Phase 1: Infrastructure Setup (Day 1, 2 hours)
**Timeline**: Hours 0-2

1. Create directory structure:
   ```
   ComplianceDetail/
   ├── index.ts                    (barrel exports)
   ├── types.ts                    (TypeScript interfaces)
   ├── utils.ts                    (utility functions)
   ├── hooks.ts                    (custom hooks)
   ├── ComplianceOverview.tsx      (overview tab)
   ├── ComplianceTasks.tsx         (tasks tab)
   ├── ComplianceEvidence.tsx      (evidence tab)
   ├── ComplianceHistory.tsx       (history tab)
   ├── ComplianceComments.tsx      (comments tab)
   └── ComplianceSettings.tsx      (settings tab)
   ```

2. Extract shared types to `types.ts`:
   - `DetailTab` type
   - `ComplianceComment` interface
   - `ComplianceHistoryEntry` interface
   - `ComplianceDetailProps` interface
   - Tab-specific prop interfaces

3. Extract utility functions to `utils.ts`:
   - `getStatusConfig()`
   - `getCategoryConfig()`
   - `getPriorityConfig()`
   - `getDaysUntilDue()`

### Phase 2: Tab Component Creation (Day 1-2, 6 hours)
**Timeline**: Hours 2-8

#### Component 1: ComplianceOverview.tsx (~250 LOC)
**Responsibility**: Display overview information including assignment, timeline, risk assessment, and regulations

**Props**:
```typescript
interface ComplianceOverviewProps {
  requirement: ComplianceRequirement;
  users: Array<{ id: string; name: string; email: string; avatar?: string }>;
  editMode: boolean;
  editForm: EditFormState;
  onEditFormChange: (updates: Partial<EditFormState>) => void;
}
```

**Content**:
- Assignment and dates section
- Timeline information
- Risk assessment (collapsible)
- Related regulations (collapsible)

#### Component 2: ComplianceTasks.tsx (~180 LOC)
**Responsibility**: Task management with add, toggle, delete functionality

**Props**:
```typescript
interface ComplianceTasksProps {
  tasks: ComplianceTask[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  onAddTask: (title: string, dueDate?: string) => void;
  onDeleteTask: (taskId: string) => void;
}
```

**Content**:
- Task list with checkboxes
- Add task form
- Empty state
- Task count display

#### Component 3: ComplianceEvidence.tsx (~150 LOC)
**Responsibility**: Evidence file management with upload and download

**Props**:
```typescript
interface ComplianceEvidenceProps {
  evidence: ComplianceEvidence[];
  onUploadEvidence: (files: FileList) => void;
  onDownloadEvidence: (evidenceId: string) => void;
  onDeleteEvidence: (evidenceId: string) => void;
}
```

**Content**:
- Evidence file grid
- Upload button
- Download and delete actions
- Empty state

#### Component 4: ComplianceHistory.tsx (~80 LOC)
**Responsibility**: Display activity history timeline

**Props**:
```typescript
interface ComplianceHistoryProps {
  history: ComplianceHistoryEntry[];
}
```

**Content**:
- History entry list
- Empty state

#### Component 5: ComplianceComments.tsx (~150 LOC)
**Responsibility**: Comments section with add and delete functionality

**Props**:
```typescript
interface ComplianceCommentsProps {
  comments: ComplianceComment[];
  onAddComment: (content: string, mentions?: string[]) => void;
  onDeleteComment: (commentId: string) => void;
}
```

**Content**:
- Comment input form
- Comments list
- Empty state

#### Component 6: ComplianceSettings.tsx (~120 LOC)
**Responsibility**: Settings panel for status management and notifications

**Props**:
```typescript
interface ComplianceSettingsProps {
  requirement: ComplianceRequirement;
  onStatusChange: (status: ComplianceStatus) => void;
}
```

**Content**:
- Status management dropdown
- Notification preferences
- Danger zone (delete requirement)

### Phase 3: Main Component Refactor (Day 2, 2 hours)
**Timeline**: Hours 8-10

Update `ComplianceDetail.tsx` to:
1. Import all tab components
2. Maintain state management (activeTab, editForm, etc.)
3. Render header with key metrics
4. Render tab navigation
5. Conditionally render tab components based on activeTab
6. Pass appropriate props to each component

**Estimated LOC**: ~280 LOC
- Header and metrics: 100 LOC
- Tab navigation: 30 LOC
- State management: 50 LOC
- Tab component orchestration: 100 LOC

### Phase 4: Integration and Exports (Day 2, 1 hour)
**Timeline**: Hours 10-11

1. Create `index.ts` barrel export:
   ```typescript
   export { default as ComplianceDetail } from './ComplianceDetail';
   export * from './types';
   export * from './utils';
   ```

2. Update parent `index.ts` to re-export from subdirectory:
   ```typescript
   export { ComplianceDetail } from './ComplianceDetail';
   ```

3. Ensure backward compatibility for existing imports

### Phase 5: Validation (Day 2, 1 hour)
**Timeline**: Hours 11-12

1. Verify each component is under 300 LOC
2. Check TypeScript types are correct
3. Test import paths work correctly
4. Validate all functionality preserved
5. Check no circular dependencies

## Component Size Targets

| Component | Target LOC | Description |
|-----------|-----------|-------------|
| types.ts | ~100 | Type definitions |
| utils.ts | ~80 | Utility functions |
| hooks.ts | ~50 | Custom hooks (if needed) |
| ComplianceOverview.tsx | ~250 | Overview tab |
| ComplianceTasks.tsx | ~180 | Tasks tab |
| ComplianceEvidence.tsx | ~150 | Evidence tab |
| ComplianceHistory.tsx | ~80 | History tab |
| ComplianceComments.tsx | ~150 | Comments tab |
| ComplianceSettings.tsx | ~120 | Settings tab |
| ComplianceDetail.tsx | ~280 | Main orchestrator |
| index.ts | ~20 | Barrel exports |
| **Total** | **~1,460** | (includes overhead) |

## Key Design Decisions

### 1. Component Boundaries
- Split by tab functionality for clear separation of concerns
- Each tab component is self-contained with minimal dependencies
- Shared state remains in main ComplianceDetail component

### 2. Props Design
- Each tab component receives only the data it needs
- Event handlers passed as callbacks
- No direct state mutations in child components

### 3. State Management
- Main component holds: activeTab, editForm, expandedSections
- Tab components are mostly presentational
- State lifting used for complex interactions

### 4. Type Safety
- All interfaces in dedicated types.ts
- Proper TypeScript for all props and event handlers
- Import types from single source of truth

### 5. Backward Compatibility
- Original import paths continue to work
- Barrel exports provide clean API
- No breaking changes for consumers

## Success Criteria

1. All new components under 300 LOC
2. Main ComplianceDetail.tsx under 300 LOC
3. All existing functionality preserved
4. TypeScript compiles without errors
5. Imports work correctly
6. No runtime errors
7. Clean separation of concerns
8. Reusable component structure

## Risk Mitigation

### Risk 1: Breaking Existing Imports
**Mitigation**: Use barrel exports and maintain original file structure

### Risk 2: Missing Functionality
**Mitigation**: Systematic migration with checklist for each feature

### Risk 3: Type Errors
**Mitigation**: Extract types first, then refactor components

### Risk 4: State Management Issues
**Mitigation**: Keep state management centralized in main component

## Timeline Summary

- **Phase 1**: 2 hours - Infrastructure setup
- **Phase 2**: 6 hours - Create tab components
- **Phase 3**: 2 hours - Refactor main component
- **Phase 4**: 1 hour - Integration and exports
- **Phase 5**: 1 hour - Validation
- **Total**: 12 hours over 2 days

## Deliverables

1. ComplianceDetail/ directory with 11 files
2. All components under 300 LOC
3. Preserved functionality
4. Updated import paths
5. TypeScript type safety maintained
6. Documentation for each component
