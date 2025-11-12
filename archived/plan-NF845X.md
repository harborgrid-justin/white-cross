# Refactoring Plan: CommunicationNotifications.tsx
## Task ID: NF845X

## Overview
Break down the 963-line CommunicationNotifications component into a modular, maintainable structure with each file under 300 LOC.

## Current Analysis
- **Total Lines**: 963 LOC
- **Key Features**:
  - Multi-channel notification preferences (email/SMS/push/in-app)
  - Category-based filtering (emergency/appointment/medication/general/system)
  - Priority-based routing (low/medium/high/urgent)
  - Quiet hours configuration
  - Delivery status tracking
  - Bulk operations (mark read, dismiss, archive)
  - Real-time updates

## Refactoring Strategy

### Phase 1: Setup & Type Extraction (Est. 30 min)
**Deliverables**:
- Create `CommunicationNotifications/` subdirectory
- Extract `types.ts` with all interfaces and type definitions
- Estimated LOC: ~100 lines

### Phase 2: Utility & Helper Extraction (Est. 20 min)
**Deliverables**:
- Extract `utils.ts` with helper functions:
  - Icon helpers (getTypeIcon, getPriorityColor, getChannelIcon)
  - Filtering logic
  - Sorting logic
- Estimated LOC: ~80 lines

### Phase 3: Custom Hooks Extraction (Est. 45 min)
**Deliverables**:
- Extract `hooks.ts` with custom hooks:
  - `useNotifications` - notification data management
  - `useNotificationFilters` - filtering and search logic
  - `useNotificationPreferences` - preferences management
  - `useBulkActions` - bulk operation handlers
- Estimated LOC: ~150 lines

### Phase 4: Component Breakdown (Est. 90 min)
**Deliverables**:
- `ChannelSettings.tsx` - Individual channel preference configuration
- `CategorySettings.tsx` - Category-based notification settings
- `QuietHours.tsx` - Quiet hours time picker component
- `PrioritySettings.tsx` - Priority threshold configuration
- `NotificationPreview.tsx` - Preview panel for notifications
- `NotificationItem.tsx` - Single notification display
- `NotificationFilters.tsx` - Search and filter controls
- `PreferencesModal.tsx` - Modal for preferences management
- Each component: ~80-120 LOC

### Phase 5: Main Component Refactor (Est. 30 min)
**Deliverables**:
- Refactor `CommunicationNotifications.tsx` to orchestrate sub-components
- Update to re-export all public components
- Target: ~200 LOC

### Phase 6: Index & Exports (Est. 15 min)
**Deliverables**:
- Create `index.ts` for clean exports
- Ensure backward compatibility

### Phase 7: Validation (Est. 20 min)
**Deliverables**:
- Verify all TypeScript types are correct
- Check component composition
- Validate props flow
- Test backward compatibility

## Component Architecture

```
CommunicationNotifications/
├── index.ts                      # Main exports
├── CommunicationNotifications.tsx # Main orchestrator (~200 LOC)
├── types.ts                      # TypeScript interfaces (~100 LOC)
├── utils.ts                      # Helper functions (~80 LOC)
├── hooks.ts                      # Custom hooks (~150 LOC)
├── components/
│   ├── NotificationItem.tsx      # Single notification (~120 LOC)
│   ├── NotificationFilters.tsx   # Filters UI (~100 LOC)
│   ├── PreferencesModal.tsx      # Preferences dialog (~200 LOC)
│   ├── ChannelSettings.tsx       # Channel config (~80 LOC)
│   ├── CategorySettings.tsx      # Category config (~80 LOC)
│   ├── QuietHours.tsx           # Time picker (~60 LOC)
│   ├── PrioritySettings.tsx     # Priority config (~60 LOC)
│   └── NotificationPreview.tsx  # Preview panel (~80 LOC)
```

## Success Criteria
- Main component under 300 LOC (target: ~200 LOC)
- All sub-components under 200 LOC
- Full TypeScript type safety maintained
- Backward compatible API
- All functionality preserved
- Improved testability and maintainability

## Timeline
**Total Estimated Time**: 4 hours

## Dependencies
- No blocking dependencies identified
- Can proceed independently
