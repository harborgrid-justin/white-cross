# Drag-and-Drop Component Library

Modern, accessible drag-and-drop components and hooks for the Next.js Page Builder.

## Overview

This library provides a comprehensive drag-and-drop system with:

- **Accessibility-first design** - Full keyboard navigation (WCAG 2.1 AA compliant)
- **Visual feedback** - Clear drop zone indicators and state changes
- **Resize functionality** - Interactive handles with constraints
- **Reusable components** - Modular, type-safe APIs
- **Performance optimized** - Memoized calculations and smooth animations

## Components

### DropZone

Visual drop zone component with automatic state management.

```tsx
import { DropZone } from './components/dnd/DropZone';

<DropZone
  id="container-drop-zone"
  accepts={['component', 'widget']}
  onDrop={(data) => handleDrop(data)}
  validate={(data) => ({
    isValid: data.type !== 'locked',
    reason: 'Cannot drop locked components'
  })}
  showLabel={true}
  showIcon={true}
>
  <div>Drop components here</div>
</DropZone>
```

**Props:**
- `id` - Unique identifier
- `accepts` - Array of accepted draggable types
- `validate` - Custom validation function
- `onDrop` - Drop event handler
- `onDragEnter` - Drag enter callback
- `onDragLeave` - Drag leave callback
- `showLabel` - Show state label (default: true)
- `showIcon` - Show state icon (default: true)
- `theme` - Light or dark theme

**States:**
- `idle` - No drag operation
- `potential` - Drag in progress, not over zone
- `active` - Dragged item over zone
- `valid` - Drop would be valid
- `invalid` - Drop would be invalid
- `dropping` - Drop in progress

### ScreenReaderAnnouncements

Provides live region announcements for screen readers.

```tsx
import {
  ScreenReaderAnnouncements,
  useAnnouncements
} from './components/dnd/ScreenReaderAnnouncements';

function MyComponent() {
  const { announcements, announce } = useAnnouncements();

  const handleDrag = () => {
    announce('Component grabbed', 'assertive');
  };

  return (
    <>
      <ScreenReaderAnnouncements announcements={announcements} />
      {/* Your draggable components */}
    </>
  );
}
```

## Hooks

### useDropZone

Manages drop zone state and behavior.

```tsx
import { useDropZone } from './hooks/useDragAndDrop';

const {
  setNodeRef,
  isActive,
  canDrop,
  state,
  validation,
  stateClasses,
  ariaAttributes,
} = useDropZone({
  id: 'my-drop-zone',
  accepts: ['component'],
  validate: (data) => ({
    isValid: data.type === 'button',
  }),
  onDrop: (data) => console.log('Dropped:', data),
});

return (
  <div
    ref={setNodeRef}
    className={stateClasses}
    {...ariaAttributes}
  >
    Drop zone
  </div>
);
```

### useKeyboardDragDrop

Provides keyboard-based drag-and-drop functionality.

```tsx
import { useKeyboardDragDrop } from './hooks/useDragAndDrop';

const {
  mode,
  focusedId,
  draggedId,
  announce,
} = useKeyboardDragDrop({
  componentIds: ['comp-1', 'comp-2'],
  selectedId: 'comp-1',
  onMove: (id, delta) => moveComponent(id, delta),
  onSelect: (id) => selectComponent(id),
  onAnnounce: announce,
  stepSize: 10,
  fineStepSize: 1,
  snapToGrid: true,
  gridSize: 8,
});
```

**Keyboard Controls:**
- `Tab / Shift+Tab` - Navigate between components
- `Space / Enter` - Grab or drop component
- `Arrow Keys` - Move component (10px)
- `Shift + Arrow Keys` - Fine movement (1px)
- `Escape` - Cancel drag operation

### useResize

Manages component resizing with handles.

```tsx
import { useResize } from './hooks/useDragAndDrop';

const {
  size,
  position,
  isResizing,
  activeHandle,
  handleMouseDown,
} = useResize({
  initialSize: { width: 200, height: 100 },
  initialPosition: { x: 0, y: 0 },
  constraints: {
    minWidth: 50,
    minHeight: 50,
    lockAspectRatio: false,
    snapToGrid: true,
    gridSize: 8,
  },
  onResize: (size, pos) => updateComponent(id, { size, position: pos }),
});
```

**Features:**
- 8 resize handles (corners + midpoints)
- Aspect ratio locking (Shift key)
- Min/max size constraints
- Grid-aligned resize
- Smooth visual feedback

## Type Definitions

All drag-drop types are defined in `types/drag-drop.types.ts`:

```tsx
import type {
  DraggableData,
  DroppableConfig,
  DropZoneState,
  DropValidation,
  ResizeHandle,
  ResizeConstraints,
  KeyboardDragMode,
} from './types/drag-drop.types';
```

## Integration Examples

### Enhanced Canvas Component

```tsx
import { useKeyboardDragDrop } from './hooks/useDragAndDrop';
import { useAnnouncements, ScreenReaderAnnouncements } from './components/dnd/ScreenReaderAnnouncements';

function Canvas() {
  const { announcements, announce } = useAnnouncements();

  const { mode, focusedId, draggedId } = useKeyboardDragDrop({
    componentIds: allComponentIds,
    selectedId: selectedIds[0] || null,
    onMove: handleMove,
    onSelect: handleSelect,
    onAnnounce: announce,
    snapToGrid: true,
    gridSize: 8,
  });

  return (
    <>
      <ScreenReaderAnnouncements announcements={announcements} />
      {/* Canvas content */}
    </>
  );
}
```

### Selection Overlay with Resize

```tsx
import { useResize, calculateHandlePositions } from './hooks/useDragAndDrop';

function SelectionOverlay() {
  const {
    size,
    position,
    isResizing,
    activeHandle,
    handleMouseDown,
  } = useResize({
    initialSize: component.size,
    initialPosition: component.position,
    constraints: { minWidth: 20, minHeight: 20, snapToGrid: true },
    onResize: (size, pos) => updateComponent(id, { size, position: pos }),
  });

  const handlePositions = calculateHandlePositions(size, position, 8);

  return (
    <div>
      {/* Selection outline */}
      {handlePositions.map((handle) => (
        <div
          key={handle.handle}
          onMouseDown={(e) => handleMouseDown(handle.handle, e)}
          style={{ cursor: handle.cursor }}
        />
      ))}
    </div>
  );
}
```

## Accessibility Features

### Screen Reader Support

- Live region announcements for all drag-drop operations
- Clear state changes communicated to assistive technologies
- Proper ARIA attributes on all interactive elements

### Keyboard Navigation

Full keyboard control:
- Navigate with Tab
- Grab/drop with Space or Enter
- Move with Arrow keys
- Fine control with Shift modifier
- Cancel with Escape

### Visual Indicators

- High contrast colors for all states
- Clear focus indicators
- Motion respects `prefers-reduced-motion`
- Sufficient color contrast (WCAG AA)

## Performance Considerations

### Optimizations

- Memoized calculations for collision detection
- React.memo for expensive components
- Debounced resize operations
- Efficient re-render prevention

### Best Practices

```tsx
// Good - memoize drop validation
const validate = useMemo(
  () => (data: DraggableData) => ({
    isValid: data.type === 'button',
  }),
  []
);

// Good - useCallback for event handlers
const handleDrop = useCallback(
  (data: DraggableData) => {
    addComponent(data);
  },
  [addComponent]
);
```

## Styling

### CSS Classes

The library provides semantic CSS classes:

```css
.drop-zone { /* Base drop zone styles */ }
.drop-zone--idle { /* Idle state */ }
.drop-zone--active { /* Active state */ }
.drop-zone--valid { /* Valid drop target */ }
.drop-zone--invalid { /* Invalid drop target */ }
.drop-zone--over { /* Mouse over zone */ }
.drop-zone--can-drop { /* Can accept drop */ }
```

### Theming

Support for light and dark themes:

```tsx
<DropZone theme="dark" {...props} />
```

Or use the `getDropZoneStyle` utility:

```tsx
import { getDropZoneStyle } from './hooks/useDragAndDrop';

const style = getDropZoneStyle(state, 'dark');
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `@dnd-kit/core` - Drag-and-drop primitives
- `framer-motion` - Smooth animations
- `lucide-react` - Icons
- `zustand` - State management (project dependency)

## Migration Guide

### From Basic DnD to Enhanced System

**Before:**
```tsx
const { setNodeRef, isOver } = useDroppable({ id: 'zone' });

<div ref={setNodeRef} style={{ border: isOver ? '2px solid blue' : 'none' }}>
  Drop here
</div>
```

**After:**
```tsx
<DropZone
  id="zone"
  accepts={['component']}
  onDrop={handleDrop}
  showLabel={true}
>
  Drop here
</DropZone>
```

### Adding Keyboard Support

Add keyboard navigation to existing drag-drop:

```tsx
// 1. Add hook
const { announcements, announce } = useAnnouncements();

const { mode } = useKeyboardDragDrop({
  componentIds,
  selectedId,
  onMove: handleMove,
  onSelect: handleSelect,
  onAnnounce: announce,
});

// 2. Add announcements component
<ScreenReaderAnnouncements announcements={announcements} />

// 3. Show keyboard mode indicator
{mode !== 'off' && (
  <div>Keyboard Mode: {mode}</div>
)}
```

### Implementing Resize

Replace manual resize with hook:

```tsx
// Before
const [isResizing, setIsResizing] = useState(false);
const handleMouseDown = (e) => { /* manual logic */ };

// After
const { size, isResizing, handleMouseDown } = useResize({
  initialSize,
  initialPosition,
  constraints: { minWidth: 50, minHeight: 50 },
  onResize: handleResize,
});
```

## Testing

### Unit Tests

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { useDropZone } from './hooks/useDragAndDrop';

test('drop zone validates correctly', () => {
  const { result } = renderHook(() =>
    useDropZone({
      id: 'test',
      validate: (data) => ({ isValid: data.type === 'button' }),
    })
  );

  expect(result.current.canDrop).toBe(true);
});
```

### Integration Tests

Test keyboard navigation:

```tsx
import { fireEvent, render } from '@testing-library/react';

test('keyboard navigation works', () => {
  const { getByRole } = render(<Canvas />);
  const canvas = getByRole('application');

  fireEvent.keyDown(canvas, { key: 'Tab' });
  // Assert focus moved

  fireEvent.keyDown(canvas, { key: ' ' });
  // Assert component grabbed
});
```

## Contributing

When adding new drag-drop features:

1. Add types to `types/drag-drop.types.ts`
2. Create hooks in `hooks/useDragAndDrop/`
3. Create components in `components/dnd/`
4. Update this README with examples
5. Add tests for new functionality

## License

Same as main project.
