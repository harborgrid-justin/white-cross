# TypeScript Component Error Resolution Plan - R4C7T2

## Task Overview
Analyze and fix TypeScript errors in React components in /home/user/white-cross/frontend

## Referenced Agent Work
- Error collection by K9M3P6: `.temp/typescript-errors-K9M3P6.txt`
- Previous TypeScript fixes by multiple agents

## Total Component Errors: 42

## Error Categories and Priorities

### Category 1: Missing Utility Module (CRITICAL)
**Error:** Cannot find module '../../../utils/cn'
**Files Affected:** 7 UI components
**Priority:** HIGHEST - Shared utility affecting multiple components
- Avatar.tsx
- Badge.tsx
- Alert.tsx
- Progress.tsx
- Radio.tsx
- Switch.tsx
- Modal.tsx
- Tabs.tsx

### Category 2: Missing UI Components (HIGH)
**Error:** Cannot find module '@/components/ui/*'
**Files Affected:** 6 components
**Priority:** HIGH - Shared components affecting multiple features
- dropdown-menu: 4 occurrences (BroadcastManager, MessageInbox, MessageThread, NotificationBell)
- table: 2 occurrences (BroadcastManager, AuditLogViewer)
- DatePicker: 1 occurrence (MedicationForm)

### Category 3: Missing Action Modules (HIGH)
**Error:** Cannot find module '@/actions/*'
**Files Affected:** 5 components
**Priority:** HIGH - Functional errors affecting user actions
- incidents.actions: 3 occurrences (FollowUpForm, IncidentReportForm, WitnessStatementForm)
- appointments.actions: 2 occurrences (AppointmentCalendar, SchedulingForm)

### Category 4: Missing Hook Modules (MEDIUM)
**Error:** Cannot find module '@/hooks/*'
**Files Affected:** 7 components
**Priority:** MEDIUM
- use-toast: 2 occurrences
- usePermissions: 1 occurrence
- documents: 1 occurrence
- useStudentAllergies: 1 occurrence
- useStudentPhoto: 1 occurrence
- useConnectionMonitor: 1 occurrence
- useOfflineQueue: 1 occurrence

### Category 5: Missing Exports (MEDIUM)
**Error:** Module has no exported member
**Files Affected:** 7 errors
**Priority:** MEDIUM
- Default exports for UI wrapper components: Badge, Checkbox, SearchInput, Switch
- communications.actions: deleteBroadcastAction, markAsReadAction
- reduxStore: RootState, getStorageStats
- types/documents: DocumentMetadata

### Category 6: Other Module Errors (LOW)
**Files Affected:** 4 components
- routeUtils: 2 occurrences (Breadcrumbs)
- inventorySlice: 1 occurrence
- test-utils: 2 occurrences (test files)

## Implementation Plan

### Phase 1: Create Missing Utility Module (Highest Impact)
- Create src/utils/cn.ts utility function
- Fixes: 7 errors immediately

### Phase 2: Create Missing UI Components
- Create src/components/ui/dropdown-menu.tsx
- Create src/components/ui/table.tsx
- Verify DatePicker location
- Fixes: 6-7 errors

### Phase 3: Fix Missing Exports
- Add missing exports to UI component index files
- Add missing exports to action files
- Add missing exports to Redux store
- Fixes: 7 errors

### Phase 4: Create/Fix Action Files
- Create or verify appointments.actions
- Create or verify incidents.actions
- Fixes: 5 errors

### Phase 5: Create/Fix Hook Files
- Create or verify missing hooks
- Fixes: 7 errors

## Success Criteria
- Fix top 20 most common/critical errors
- Prioritize shared components and utilities
- Reduce component errors by at least 50%

## Timeline
- Phase 1: 10 minutes (utility creation)
- Phase 2: 20 minutes (UI components)
- Phase 3: 15 minutes (export fixes)
- Phase 4: 20 minutes (actions)
- Phase 5: 20 minutes (hooks)
- Total: ~85 minutes
