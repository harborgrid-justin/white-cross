# CommunicationHistory.tsx Refactoring Plan - CH9K3M

## Task Overview
Break down CommunicationHistory.tsx (920 LOC) into a modular, maintainable component architecture with clear separation of concerns.

## Current Analysis
- **File**: `F:\temp\white-cross\frontend\src\components\pages\Communications\CommunicationHistory.tsx`
- **Lines of Code**: 920
- **Main Responsibilities**:
  - Communication history display
  - Search functionality
  - Advanced filtering (type, status, priority, category, date range)
  - Sorting and selection
  - Export functionality
  - Message viewing and thread navigation
  - Resend capabilities

## Architecture Strategy

### 1. Component Hierarchy
```
CommunicationHistory/ (new directory)
├── index.ts                    # Re-exports
├── CommunicationHistory.tsx    # Orchestration component
├── types.ts                    # TypeScript interfaces
├── hooks.ts                    # Custom hooks
├── utils.ts                    # Helper functions
├── HistorySearch.tsx           # Search interface component
├── HistoryFilters.tsx          # Filter controls component
├── ChannelFilter.tsx           # Channel/type filtering component
├── HistoryList.tsx             # Message list display component
└── MessageViewer.tsx           # Individual message viewer component
```

### 2. Component Breakdown

#### types.ts
- `CommunicationRecord` interface
- `HistoryFilters` interface
- `CommunicationHistoryProps` interface
- Badge types and status enums

#### utils.ts
- `getTypeIcon()` - Icon selection utility
- `getStatusBadge()` - Status badge rendering
- `getPriorityBadge()` - Priority badge rendering
- `formatFileSize()` - File size formatting
- `filterCommunications()` - Filtering logic
- `sortCommunications()` - Sorting logic

#### hooks.ts
- `useCommunicationHistory()` - Data fetching and state management
- `useHistoryFilters()` - Filter state management
- `useRecordSelection()` - Selection state management

#### HistorySearch.tsx
- Search input with icon
- Real-time search updates
- Clear search functionality
- Props: `value`, `onChange`, `placeholder`

#### HistoryFilters.tsx
- Filter panel with toggle
- Type, status, priority, category filters
- Date range selection
- Sort controls
- Clear all filters button
- Props: `filters`, `onFilterChange`, `onClear`, `showFilters`, `onToggleFilters`

#### ChannelFilter.tsx
- Channel/type-specific filtering
- Visual channel indicators
- Props: `selectedType`, `onTypeChange`, `availableTypes`

#### HistoryList.tsx
- Communication records list
- Checkbox selection
- Hover states
- Empty state handling
- Props: `communications`, `selectedRecords`, `onRecordSelect`, `onSelectAll`, `onViewCommunication`, `onOpenThread`, `onResendCommunication`

#### MessageViewer.tsx
- Individual message display
- Subject/content preview
- Recipients and sender info
- Attachments display
- Status and priority badges
- Action buttons (View, Thread, Resend)
- Props: `record`, `isSelected`, `onSelect`, `onView`, `onOpenThread`, `onResend`

#### CommunicationHistory.tsx (Refactored)
- Orchestrates child components
- Manages global state
- Handles callbacks and data flow
- Loading and error states

## Implementation Phases

### Phase 1: Foundation (types, utils, hooks)
- Extract all TypeScript interfaces to `types.ts`
- Move utility functions to `utils.ts`
- Create custom hooks in `hooks.ts`
- Estimated complexity: Medium

### Phase 2: Search and Filter Components
- Build `HistorySearch.tsx`
- Build `HistoryFilters.tsx`
- Build `ChannelFilter.tsx`
- Estimated complexity: Low-Medium

### Phase 3: Display Components
- Build `MessageViewer.tsx`
- Build `HistoryList.tsx`
- Estimated complexity: Medium

### Phase 4: Orchestration
- Refactor main `CommunicationHistory.tsx`
- Integrate all child components
- Update state management
- Estimated complexity: Medium-High

### Phase 5: Re-exports and Validation
- Create `index.ts` with proper re-exports
- Verify TypeScript compilation
- Test component integration
- Estimated complexity: Low

## Design Decisions

### State Management
- **Filters**: Managed by `useHistoryFilters` hook, passed to filter components
- **Selection**: Managed by `useRecordSelection` hook, passed to list components
- **Data**: Managed by `useCommunicationHistory` hook, fetched and cached
- **UI State**: Local state in orchestration component (showFilters, etc.)

### Props Design
- All components use explicit TypeScript interfaces
- Props are minimal and focused
- Callbacks use standard event handler patterns
- Optional props have sensible defaults

### Performance Optimization
- `useMemo` for filtered/sorted communications
- `useCallback` for event handlers passed to children
- `React.memo` for MessageViewer (pure presentational)
- Avoid inline function definitions in render

### Accessibility
- Proper ARIA labels maintained
- Semantic HTML structure
- Keyboard navigation support
- Focus management in filters

## Cross-Agent References
- Building on component patterns from previous refactorings (BDM701, CM734R, ST94K2)
- Following established TypeScript patterns
- Maintaining accessibility standards

## Success Criteria
- All components under 200 LOC
- Clear separation of concerns
- Proper TypeScript types throughout
- No regression in functionality
- Successful compilation
- Proper re-exports from index.ts
