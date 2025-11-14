# Architecture Notes: CommunicationNotifications Refactoring
## Task ID: NF845X

## References to Other Agent Work
- Component refactoring patterns: `.temp/completion-summary-CM734R.md`
- Frontend architecture: `.temp/architecture-notes-BDM701.md`

## High-Level Design Decisions

### Component Composition Strategy
**Decision**: Break monolithic 963-line component into 8 focused sub-components + utility files

**Rationale**:
- Current component violates Single Responsibility Principle
- Mixing concerns: filtering, preferences, display, state management
- 963 LOC makes testing and maintenance difficult
- State management is intertwined with UI logic

**Approach**:
- Extract presentational components for each major UI section
- Create custom hooks for state management logic
- Separate utilities for pure functions (icons, colors, filtering)
- Main component becomes orchestrator, not implementation

### State Management Approach

**Decision**: Custom hooks pattern with local state

**Hook Structure**:
1. **useNotifications**: Manages notification data, loading, and CRUD operations
2. **useNotificationFilters**: Handles search, category, priority, status filtering + sorting
3. **useNotificationPreferences**: Manages preference state and updates
4. **useBulkActions**: Handles selection state and bulk operations

**Rationale**:
- No need for global state (notifications are scoped to component)
- Custom hooks provide reusability and testability
- Separates business logic from presentation
- Easy to mock for testing

### Props vs. Context API Decisions

**Decision**: Props-based composition (no Context)

**Rationale**:
- Component tree is shallow (2-3 levels max)
- Props provide explicit data flow
- Easier to trace and debug
- No prop drilling issues with proper composition
- Context would add unnecessary complexity

### Performance Optimization Strategies

**Performance Concerns Identified**:
1. Large notification lists (could be 100+ items)
2. Complex filtering on every render
3. Preference modal with many form inputs
4. Notification list re-rendering on every state change

**Optimization Strategy**:
1. **Memoization**:
   - `useMemo` for filtered/sorted notifications
   - `useCallback` for event handlers passed to children
   - `React.memo` for NotificationItem component

2. **Code Splitting**:
   - PreferencesModal loaded lazily (it's a modal, not always visible)
   - Consider lazy loading notification list if > 50 items

3. **Virtual Scrolling** (Future):
   - If list exceeds 100 items, implement react-window
   - Not in initial refactor, but architecture supports it

4. **Debouncing**:
   - Search input debounced (300ms)
   - Prevents filtering on every keystroke

## React Patterns Used

### Custom Hooks Pattern
```typescript
// Encapsulates notification state and operations
const useNotifications = (studentId?: string) => {
  const [notifications, setNotifications] = useState<CommunicationNotification[]>([]);
  // ... load logic, CRUD handlers
  return { notifications, handleRead, handleDismiss, handleArchive };
};
```

**Benefits**:
- Logic reusability
- Easy unit testing
- Clear separation of concerns
- Composition over inheritance

### Compound Components Pattern
```typescript
// Main component
<CommunicationNotifications>
  <NotificationFilters />
  <NotificationList>
    {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
  </NotificationList>
</CommunicationNotifications>
```

**Benefits**:
- Flexible composition
- Clear parent-child relationships
- Each component has single responsibility

### Presentational vs. Container Pattern
- **Container**: Main `CommunicationNotifications` (manages state via hooks)
- **Presentational**: All sub-components (receive data via props)

**Benefits**:
- Easy to test presentational components
- State changes isolated to container
- UI components are pure functions

## Integration Patterns

### Parent-Child Communication
- **Downward**: Props from main component to sub-components
- **Upward**: Callback functions passed as props (onRead, onDismiss, etc.)
- **No**: Direct child-to-child communication (goes through parent)

### API Integration
- Currently uses mock data in main component
- Architecture supports easy replacement with API hooks:
  ```typescript
  const { data: notifications } = useQuery('notifications', fetchNotifications);
  ```

## Type Safety

### TypeScript Interface Design
```typescript
// Strict type definitions for all entities
interface CommunicationNotification {
  id: string;
  title: string;
  // ... all fields strongly typed
  channels: Array<{
    type: 'email' | 'sms' | 'push' | 'in_app'; // Union types
    status: 'pending' | 'sent' | 'delivered' | 'failed';
  }>;
}

// Props with strict types and JSDoc
interface NotificationItemProps {
  notification: CommunicationNotification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  // ...
}
```

### Generic Component Patterns
- Not needed for this component (specific domain types)
- Could be introduced if creating reusable notification library

### Event Handler Typing
```typescript
// Properly typed React events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

## Browser Compatibility

### Considerations
- Using modern ES6+ features (arrow functions, spread, destructuring)
- Heroicons SVG icons (universally supported)
- Time input type (supported in all modern browsers, graceful fallback in old browsers)
- No browser-specific APIs used

### Polyfills
- None required for target browsers (modern evergreen browsers)

## Accessibility Considerations

### Preserved from Original
- ARIA labels on search inputs and filters
- Semantic HTML (buttons, inputs, checkboxes)
- Keyboard navigation support
- Form labels properly associated

### Improvements Needed
- Add `role="status"` for unread count live region
- Add `aria-live` for notification updates
- Ensure modal has proper focus trap
- Add keyboard shortcuts (ESC to close modal, etc.)

## File Structure

```
CommunicationNotifications/
├── index.ts                      # Public API exports
├── CommunicationNotifications.tsx # Main orchestrator
├── types.ts                      # All TypeScript interfaces
├── utils.ts                      # Pure functions (icons, colors, filtering)
├── hooks.ts                      # Custom hooks (state management)
└── components/
    ├── NotificationItem.tsx      # Single notification display
    ├── NotificationFilters.tsx   # Search and filter UI
    ├── PreferencesModal.tsx      # Preferences management dialog
    ├── ChannelSettings.tsx       # Channel preference component
    ├── CategorySettings.tsx      # Category settings component
    ├── QuietHours.tsx           # Time range picker
    ├── PrioritySettings.tsx     # Priority threshold selector
    └── NotificationPreview.tsx  # Notification preview panel
```

## Testing Strategy

### Unit Tests
- **Utils**: Test icon helpers, filtering, sorting (pure functions)
- **Hooks**: Test with @testing-library/react-hooks
- **Components**: Test with @testing-library/react (user interactions)

### Integration Tests
- Test notification list filtering
- Test preferences update flow
- Test bulk operations
- Test notification read/dismiss/archive flow

### Key Test Scenarios
1. Filtering by category, priority, status
2. Search functionality
3. Sorting by date, priority, category
4. Bulk mark read/dismiss/archive
5. Preference updates (toggle, quiet hours, threshold)
6. Empty state display
7. Loading state display
8. Error state display

## Migration Path

### Backward Compatibility
```typescript
// Original import still works
import { CommunicationNotifications } from './CommunicationNotifications';

// New imports (if needed)
import {
  CommunicationNotifications,
  NotificationItem,
  type CommunicationNotification
} from './CommunicationNotifications';
```

### Breaking Changes
- None planned
- All props remain the same
- API surface unchanged

## Future Enhancements

### Phase 2 Improvements
1. Virtual scrolling for large lists (react-window)
2. Real-time updates with WebSocket integration
3. Notification grouping by date/category
4. Advanced filtering (date range, sender, etc.)
5. Notification templates and customization
6. Export/import preferences
7. Notification sound/vibration settings
8. Desktop notification permission handling

## Performance Benchmarks

### Target Metrics
- Initial render: < 100ms
- Filter update: < 50ms (with 100 notifications)
- Preference modal open: < 50ms
- Bulk operation (50 items): < 100ms

### Monitoring
- Use React DevTools Profiler to measure
- Monitor re-render count for NotificationItem
- Check bundle size impact (<10KB increase target)
