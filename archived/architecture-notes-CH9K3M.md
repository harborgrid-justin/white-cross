# Architecture Notes - CommunicationHistory Refactoring - CH9K3M

## References to Other Agent Work
- Component patterns from `.temp/plan-BDM701.md` (Settings refactoring)
- TypeScript best practices from `.temp/plan-CM734R.md` (Communications refactoring)
- Re-export patterns from `.temp/plan-ST94K2.md` (Student refactoring)

## High-level Design Decisions

### Component Composition Strategy
- **Orchestration Pattern**: Main `CommunicationHistory` component orchestrates child components
- **Single Responsibility**: Each component handles one specific concern (search, filter, display)
- **Presentational vs. Container**: MessageViewer is pure presentational, HistoryList manages list logic
- **Compound Component**: HistoryFilters contains multiple filter controls but manages them cohesively

### State Management Approach
- **Custom Hooks Pattern**: Three specialized hooks for different state domains
  - `useCommunicationHistory`: Data fetching and caching
  - `useHistoryFilters`: Filter state and logic
  - `useRecordSelection`: Selection state and bulk operations
- **Local State**: UI-only state (showFilters) remains in orchestration component
- **Props Drilling Avoided**: Hooks provide state management, components receive minimal props

### Props vs. Context API Decisions
- **Props-based**: Chosen over Context API due to:
  - Limited component depth (2 levels max)
  - Clear data flow visibility
  - Better TypeScript inference
  - Easier testing and debugging
- **No Context Needed**: Component tree is shallow, props are sufficient

### Performance Optimization Strategies
- **Memoization**:
  - `useMemo` for filtered/sorted communications (expensive computation)
  - `useCallback` for all event handlers passed to children
  - `React.memo` for MessageViewer (pure, re-renders on record changes only)
- **Code Splitting**: Not needed (components are part of same route)
- **Virtual Scrolling**: Not implemented (future enhancement if list grows very large)
- **Debouncing**: Search input should debounce (implemented in HistorySearch)

## Integration Patterns

### Parent-Child Communication
- **Downward Data Flow**:
  - Orchestration component → HistoryFilters (filters state)
  - Orchestration component → HistorySearch (search value)
  - Orchestration component → HistoryList (filtered communications, selection state)
  - HistoryList → MessageViewer (individual record, callbacks)

- **Upward Event Flow**:
  - HistorySearch → onChange → Orchestration (search changes)
  - HistoryFilters → onFilterChange → Orchestration (filter updates)
  - MessageViewer → onSelect/onView/onResend → HistoryList → Orchestration

### Sibling Component Communication
- No direct sibling communication
- All communication flows through orchestration component
- Siblings affect each other via shared state in parent

### Global State Integration
- No global state required
- Component-local state managed via hooks
- Future integration points: Could connect to Redux/Zustand if needed for cross-page state

### API Integration Patterns
- `useCommunicationHistory` hook encapsulates API calls
- Mock data currently in hook (easy to swap for real API)
- Error and loading states managed by hook
- Potential for React Query integration in future

## React Patterns Used

### Custom Hooks Design
```typescript
// useCommunicationHistory - Data management
interface UseCommunicationHistoryReturn {
  communications: CommunicationRecord[];
  isLoading: boolean;
  error: string | undefined;
  refetch: () => void;
}

// useHistoryFilters - Filter state management
interface UseHistoryFiltersReturn {
  filters: HistoryFilters;
  setFilter: (key: keyof HistoryFilters, value: any) => void;
  clearFilters: () => void;
  filteredCommunications: CommunicationRecord[];
}

// useRecordSelection - Selection state
interface UseRecordSelectionReturn {
  selectedRecords: Set<string>;
  toggleRecord: (id: string) => void;
  toggleAll: (records: CommunicationRecord[]) => void;
  clearSelection: () => void;
}
```

### Compound Components Pattern
- HistoryFilters acts as compound component containing multiple filter controls
- Manages internal layout and coordination of filters
- Exposes clean props interface to parent

### Render Props vs. Hooks
- **Hooks Chosen**: Modern, cleaner, more composable
- No render props used
- All reusable logic extracted to custom hooks

### HOC Usage
- No HOCs needed for this refactoring
- Direct component composition preferred

## Performance Considerations

### Re-render Optimization
- MessageViewer wrapped in React.memo (props rarely change)
- Event handlers memoized with useCallback
- Filtered/sorted data memoized with useMemo
- Avoid object/array literals in render for props

### Code Splitting Strategy
- Not applicable (same route, no lazy loading needed)
- All components bundled together
- Future: Could split if CommunicationHistory used conditionally

### Memoization Strategy
```typescript
// In orchestration component
const filteredCommunications = useMemo(
  () => filterAndSortCommunications(communications, filters),
  [communications, filters]
);

const handleViewCommunication = useCallback(
  (record: CommunicationRecord) => {
    onViewCommunication?.(record);
  },
  [onViewCommunication]
);

// MessageViewer component
export const MessageViewer = React.memo<MessageViewerProps>(({ record, ... }) => {
  // Pure presentational component
});
```

## Type Safety

### TypeScript Interface Design
- All props interfaces explicitly defined
- Shared types in `types.ts`
- Component-specific props in component files
- No `any` types allowed

### Generic Component Patterns
- Not needed for this refactoring
- All types are domain-specific (CommunicationRecord, etc.)

### Props Type Definitions
```typescript
interface HistorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface HistoryFiltersProps {
  filters: HistoryFilters;
  onFilterChange: (filters: HistoryFilters) => void;
  onClear: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  studentId?: string;
}

interface MessageViewerProps {
  record: CommunicationRecord;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onView: (record: CommunicationRecord) => void;
  onOpenThread?: (threadId: string) => void;
  onResend?: (recordId: string) => void;
}
```

### Event Handler Typing
```typescript
// Properly typed event handlers
const handleSearchChange = (value: string): void => {
  setFilters(prev => ({ ...prev, search: value }));
};

const handleRecordSelect = (id: string, selected: boolean): void => {
  toggleRecord(id);
};
```

## Accessibility Considerations
- All interactive elements have ARIA labels
- Keyboard navigation maintained
- Focus management for filter panel toggle
- Semantic HTML structure preserved
- Color not sole indicator of status (icons + text)

## Testing Strategy
- Unit tests for utility functions (filtering, sorting, formatting)
- Component tests for each component with React Testing Library
- Integration test for full CommunicationHistory flow
- Hook tests with renderHook

## Future Enhancements
- Virtual scrolling for large lists (react-window)
- Real-time updates via WebSocket
- Advanced search with operators
- Saved filter presets
- Bulk actions beyond export
- Thread view modal
