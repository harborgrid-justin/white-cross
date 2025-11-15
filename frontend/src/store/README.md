# Page Builder State Management

Comprehensive state management system for the Next.js drag-and-drop page builder using Zustand.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [State Domains](#state-domains)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Performance](#performance)
- [Persistence](#persistence)
- [Testing](#testing)

## Overview

This state management system provides a complete solution for managing all aspects of a page builder application, including:

- ✅ Canvas state (component hierarchy and layout)
- ✅ Selection state (single and multi-select)
- ✅ Clipboard operations (copy/cut/paste)
- ✅ History management (undo/redo with time-travel debugging)
- ✅ Preview modes (desktop/tablet/mobile)
- ✅ Multi-page workflows
- ✅ Component properties
- ✅ User preferences
- ✅ Collaboration (foundation for real-time editing)

### Why Zustand?

We chose Zustand over Redux Toolkit for this project because:

1. **Performance**: Fine-grained reactivity for frequent updates (drag operations, selection changes)
2. **Bundle Size**: 3KB vs 15KB+ for Redux Toolkit
3. **Developer Experience**: Minimal boilerplate, intuitive API
4. **TypeScript**: Excellent first-class TypeScript support
5. **Middleware**: Rich ecosystem for persistence, devtools, and custom needs

## Architecture

### Monolithic Store with Sliced State

The store uses a monolithic approach with logical slices:

```typescript
interface PageBuilderState {
  canvas: CanvasState;
  selection: SelectionState;
  clipboard: ClipboardState;
  history: HistoryState;
  preview: PreviewState;
  workflow: WorkflowState;
  properties: PropertiesState;
  preferences: PreferencesState;
  collaboration: CollaborationState;
}
```

### State Normalization

Components are stored in a normalized structure for O(1) lookups:

```typescript
{
  components: {
    byId: {
      "comp-1": { id: "comp-1", type: "Container", ... },
      "comp-2": { id: "comp-2", type: "Button", ... }
    },
    allIds: ["comp-1", "comp-2"],
    rootIds: ["comp-1"] // Top-level components
  }
}
```

### Middleware Stack

1. **Immer**: Immutable updates with mutable-style code
2. **DevTools**: Redux DevTools integration (development only)
3. **Persist**: IndexedDB persistence for canvas and history
4. **History**: Custom middleware for undo/redo (simplified version)

## State Domains

### 1. Canvas State

Manages the component tree and layout.

**State**:
```typescript
{
  components: ComponentsMap;
  activePageId: string | null;
}
```

**Actions**:
- `addComponent(component)` - Add a new component
- `removeComponent(componentId)` - Remove a component and its children
- `updateComponent(componentId, updates)` - Update component properties
- `moveComponent(componentId, newParentId, index?)` - Move component to new parent
- `duplicateComponent(componentId)` - Clone component and its children
- `clearCanvas()` - Clear all components

### 2. Selection State

Manages selected, hovered, and focused components.

**State**:
```typescript
{
  selectedIds: string[];
  hoveredId: string | null;
  focusedId: string | null;
}
```

**Actions**:
- `select(componentId, multiSelect?)` - Select a component
- `deselect(componentId)` - Deselect a component
- `selectMultiple(componentIds)` - Select multiple components
- `clearSelection()` - Clear all selection
- `setHovered(componentId)` - Set hovered component
- `setFocused(componentId)` - Set focused component

### 3. Clipboard State

Manages copy/cut/paste operations.

**State**:
```typescript
{
  copiedComponents: ComponentNode[];
  operation: 'copy' | 'cut' | null;
}
```

**Actions**:
- `copy(componentIds)` - Copy components to clipboard
- `cut(componentIds)` - Cut components to clipboard
- `paste(targetParentId?)` - Paste components from clipboard
- `clearClipboard()` - Clear clipboard

### 4. History State

Manages undo/redo with state snapshots.

**State**:
```typescript
{
  past: StateSnapshot[];
  future: StateSnapshot[];
  maxSnapshots: number;
}
```

**Actions**:
- `undo()` - Undo last action
- `redo()` - Redo last undone action
- `clearHistory()` - Clear all history
- `takeSnapshot(actionType, actionPayload?)` - Manually take a snapshot

### 5. Preview State

Manages preview mode and viewport settings.

**State**:
```typescript
{
  isPreviewMode: boolean;
  viewport: {
    width: number;
    height: number;
    device: 'desktop' | 'tablet' | 'mobile';
  };
}
```

**Actions**:
- `togglePreview()` - Toggle preview mode
- `setPreviewMode(isPreview)` - Set preview mode explicitly
- `setViewport(viewport)` - Update viewport settings
- `setDevice(device)` - Set device type (auto-updates viewport)

### 6. Workflow State

Manages multi-page workflows.

**State**:
```typescript
{
  pages: PagesMap;
  currentPageId: string | null;
  workflowId: string | null;
}
```

**Actions**:
- `addPage(page)` - Add a new page
- `removePage(pageId)` - Remove a page
- `updatePage(pageId, updates)` - Update page properties
- `setCurrentPage(pageId)` - Set active page
- `reorderPages(pageIds)` - Reorder pages

### 7. Properties State

Manages component properties (synced with canvas).

**State**:
```typescript
{
  componentProperties: Record<string, ComponentProperties>;
}
```

**Actions**:
- `updateProperty(componentId, key, value)` - Update single property
- `updateProperties(componentId, properties)` - Update multiple properties
- `resetProperties(componentId)` - Reset to default properties

### 8. Preferences State

Manages user preferences.

**State**:
```typescript
{
  theme: 'light' | 'dark';
  autoSave: boolean;
  autoSaveInterval: number;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  showGuides: boolean;
  showGrid: boolean;
  zoomLevel: number;
}
```

**Actions**:
- `updatePreference(key, value)` - Update a preference
- `resetPreferences()` - Reset to defaults

### 9. Collaboration State

Foundation for real-time collaboration (future feature).

**State**:
```typescript
{
  activeUsers: CollaborationUser[];
  cursors: Record<string, CursorPosition>;
  locks: Record<string, string>; // componentId -> userId
  isConnected: boolean;
  sessionId: string | null;
}
```

**Actions**:
- `joinSession(sessionId, user)` - Join collaboration session
- `leaveSession()` - Leave session
- `updateCursor(userId, cursor)` - Update user cursor
- `lockComponent(componentId, userId)` - Lock component for editing
- `unlockComponent(componentId)` - Unlock component

## Usage

### Basic Usage

```typescript
import { usePageBuilderStore } from '@/store';

function MyComponent() {
  // Access state
  const components = usePageBuilderStore((state) => state.canvas.components);

  // Access actions
  const addComponent = usePageBuilderStore((state) => state.addComponent);

  // Use action
  const handleAdd = () => {
    addComponent({
      type: 'Button',
      name: 'My Button',
      parentId: null,
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      properties: { text: 'Click me' },
      locked: false,
      hidden: false,
    });
  };

  return <button onClick={handleAdd}>Add Button</button>;
}
```

### Using Custom Hooks (Recommended)

```typescript
import {
  useAddComponent,
  useSelectedComponents,
  useCanUndo,
  useUndo,
} from '@/store/hooks';

function ComponentToolbar() {
  const selectedComponents = useSelectedComponents();
  const addComponent = useAddComponent();
  const canUndo = useCanUndo();
  const undo = useUndo();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <div>Selected: {selectedComponents.length}</div>
    </div>
  );
}
```

### Selecting Specific Data (Performance)

```typescript
// ❌ Bad: Re-renders on any state change
const state = usePageBuilderStore();

// ✅ Good: Only re-renders when selectedIds change
const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);

// ✅ Better: Use custom hook
const selectedIds = useSelectedIds();
```

### Multiple State Values with Shallow Equality

```typescript
import { useShallow } from 'zustand/react/shallow';

function MyComponent() {
  const { selectedIds, hoveredId } = usePageBuilderStore(
    useShallow((state) => ({
      selectedIds: state.selection.selectedIds,
      hoveredId: state.selection.hoveredId,
    }))
  );
}
```

### Actions Outside Components

```typescript
import { usePageBuilderStore } from '@/store';

// Get store instance
const store = usePageBuilderStore.getState();

// Call actions
store.addComponent({ ... });
store.select('component-id');
```

### Subscribing to State Changes

```typescript
import { usePageBuilderStore } from '@/store';

const unsubscribe = usePageBuilderStore.subscribe(
  (state) => state.selection.selectedIds,
  (selectedIds) => {
    console.log('Selection changed:', selectedIds);
  }
);

// Clean up
unsubscribe();
```

## API Reference

See [types.ts](./types.ts) for complete TypeScript definitions.

### Canvas Actions

```typescript
addComponent(component: Omit<ComponentNode, 'id' | 'createdAt' | 'updatedAt'>): string
removeComponent(componentId: string): void
updateComponent(componentId: string, updates: Partial<ComponentNode>): void
moveComponent(componentId: string, newParentId: string | null, index?: number): void
duplicateComponent(componentId: string): string | null
clearCanvas(): void
```

### Selection Actions

```typescript
select(componentId: string, multiSelect?: boolean): void
deselect(componentId: string): void
selectMultiple(componentIds: string[]): void
clearSelection(): void
setHovered(componentId: string | null): void
setFocused(componentId: string | null): void
```

### Clipboard Actions

```typescript
copy(componentIds: string[]): void
cut(componentIds: string[]): void
paste(targetParentId?: string | null): string[]
clearClipboard(): void
```

### History Actions

```typescript
undo(): void
redo(): void
clearHistory(): void
takeSnapshot(actionType: string, actionPayload?: any): void
```

## Performance

### Optimization Strategies

1. **Fine-grained selectors**: Select only needed data
   ```typescript
   const name = usePageBuilderStore((state) => state.canvas.components.byId[id]?.name);
   ```

2. **Custom hooks**: Pre-optimized hooks for common use cases
   ```typescript
   const component = useComponent(componentId);
   ```

3. **Shallow equality**: For selecting multiple primitive values
   ```typescript
   const { theme, zoomLevel } = usePageBuilderStore(
     useShallow((state) => ({
       theme: state.preferences.theme,
       zoomLevel: state.preferences.zoomLevel,
     }))
   );
   ```

4. **Memoization**: For expensive computations
   ```typescript
   const tree = useMemo(() => buildComponentTree(components), [components]);
   ```

### Performance Targets

- Selection update: < 16ms (60fps)
- Canvas update: < 16ms (60fps during drag)
- Undo/Redo: < 100ms
- Initial load: < 500ms

## Persistence

### Storage Strategy

| State Domain | Storage | Timing |
|--------------|---------|--------|
| Canvas | IndexedDB | Debounced auto-save |
| Properties | IndexedDB | With canvas |
| Workflow | LocalStorage | On change |
| Preferences | LocalStorage | On change |
| History | IndexedDB | On action |
| Clipboard | SessionStorage | On copy/cut |
| Selection | None | - |
| Preview | None | - |
| Collaboration | None (WebSocket sync) | - |

### Manual Persistence

```typescript
// Save current state
const state = usePageBuilderStore.getState();
localStorage.setItem('backup', JSON.stringify(state));

// Restore state
const saved = JSON.parse(localStorage.getItem('backup'));
usePageBuilderStore.setState(saved);
```

### Clear Persisted State

```typescript
// Clear IndexedDB
indexedDB.deleteDatabase('page-builder-db');

// Clear LocalStorage
localStorage.removeItem('page-builder-preferences');
```

## Testing

### Unit Testing Actions

```typescript
import { usePageBuilderStore } from '@/store';
import { initialPageBuilderState } from '@/store/utils/initial-state';

describe('Canvas Actions', () => {
  beforeEach(() => {
    usePageBuilderStore.setState(initialPageBuilderState);
  });

  it('should add component', () => {
    const { addComponent } = usePageBuilderStore.getState();

    const id = addComponent({
      type: 'Button',
      name: 'My Button',
      parentId: null,
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      properties: {},
      locked: false,
      hidden: false,
    });

    const state = usePageBuilderStore.getState();
    expect(state.canvas.components.byId[id]).toBeDefined();
    expect(state.canvas.components.allIds).toContain(id);
  });
});
```

### Integration Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAddComponent, useSelectedComponents } from '@/store/hooks';

it('should add and select component', () => {
  const { result: addResult } = renderHook(() => useAddComponent());
  const { result: selectionResult } = renderHook(() => useSelectedComponents());

  act(() => {
    const id = addResult.current({ /* component data */ });
    const select = usePageBuilderStore.getState().select;
    select(id);
  });

  expect(selectionResult.current).toHaveLength(1);
});
```

## Examples

See [examples/](./examples/) directory for complete examples:

- [Basic Canvas](./examples/basic-canvas.tsx)
- [Selection Management](./examples/selection-management.tsx)
- [Undo/Redo](./examples/undo-redo.tsx)
- [Copy/Paste](./examples/copy-paste.tsx)
- [Multi-page Workflow](./examples/workflow.tsx)

## Best Practices

1. ✅ Use custom hooks for better DX and performance
2. ✅ Select minimal state to minimize re-renders
3. ✅ Use `useShallow` for multiple primitive values
4. ✅ Memoize expensive computations
5. ✅ Use action names for better debugging
6. ❌ Don't mutate state directly (use actions)
7. ❌ Don't select entire state in components
8. ❌ Don't subscribe to state you don't use

## Troubleshooting

### Store not persisting

Check if IndexedDB is available and not blocked by browser settings.

### Performance issues

Use React DevTools Profiler to identify unnecessary re-renders. Check if you're selecting too much state.

### TypeScript errors

Ensure you're using the correct types from `types.ts`. The store is fully typed.

### Undo/redo not working

Check if the action is being tracked. Some actions (like selection) are excluded from history by default.

## Future Enhancements

- [ ] Collaboration with WebSocket integration
- [ ] Conflict resolution (CRDT or OT)
- [ ] Snapshot compression
- [ ] Differential snapshots
- [ ] Advanced time-travel debugging UI
- [ ] State migration tools
- [ ] Performance monitoring
- [ ] Offline support with service worker

## License

MIT
