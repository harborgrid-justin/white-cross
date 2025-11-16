# Page Builder State Management

Comprehensive state management architecture for the Next.js Page Builder using Zustand.

## Overview

The page builder state management is organized into specialized modules:

- **Main Store** (`index.ts`) - Core state and actions for components, canvas, history
- **Selectors** (`selectors.ts`) - Memoized selectors for optimal performance
- **Drag-Drop** (`drag-drop.ts`) - Dedicated drag-and-drop state management
- **Serialization** (`serialization.ts`) - Import/export functionality with versioning
- **Hierarchy** (`hierarchy.ts`) - Component tree traversal and query utilities
- **Selection** (`selection.ts`) - Advanced selection features (box select, keyboard nav)
- **Performance** (`performance.ts`) - Performance monitoring and optimization tools

## Architecture Principles

1. **State Normalization** - Components stored in normalized structure (byId, allIds)
2. **Immutability** - Immer middleware for clean immutable updates
3. **Memoization** - Shallow equality checks to prevent unnecessary re-renders
4. **Type Safety** - Full TypeScript coverage with strict types
5. **Persistence** - Selective state persistence to localStorage
6. **DevTools** - Redux DevTools integration in development mode

## Core Features

### Component Management

```typescript
import { usePageBuilderStore } from './store';

// Add a new component
const addComponent = usePageBuilderStore((state) => state.addComponent);
const newId = addComponent({
  type: 'Button',
  name: 'My Button',
  parentId: null,
  childIds: [],
  position: { x: 100, y: 100 },
  size: { width: 120, height: 40 },
  properties: { label: 'Click me' },
  styles: {},
  locked: false,
  hidden: false,
});

// Update component
const updateComponent = usePageBuilderStore((state) => state.updateComponent);
updateComponent(componentId, { name: 'Updated Name' });

// Delete component (recursive - deletes children too)
const deleteComponent = usePageBuilderStore((state) => state.deleteComponent);
deleteComponent(componentId);
```

### Optimized Selectors

```typescript
import {
  useComponentById,
  useSelectedComponents,
  useRootComponents,
  useComponentChildren,
  useComponentAncestors,
} from './store/selectors';

// Get specific component (memoized)
const component = useComponentById(componentId);

// Get selected components (shallow comparison)
const selected = useSelectedComponents();

// Get component hierarchy
const ancestors = useComponentAncestors(componentId);
const children = useComponentChildren(parentId);
```

### Undo/Redo

```typescript
import { useHistory } from './hooks/usePageBuilder';

const { undo, redo, canUndo, canRedo } = useHistory();

// Undo last action
if (canUndo) {
  undo();
}

// Redo
if (canRedo) {
  redo();
}
```

### Drag-Drop Integration

```typescript
import { useDragDropStore } from './store/drag-drop';

// Start dragging
const startDrag = useDragDropStore((state) => state.startDrag);
startDrag({
  id: componentId,
  type: 'Button',
  isNew: false,
  ghostPosition: { x: 100, y: 100 },
  offset: { x: 0, y: 0 },
});

// Update position (with snap-to-grid)
const updateDragPosition = useDragDropStore((state) => state.updateDragPosition);
updateDragPosition({ x: 120, y: 150 });

// End drag
const endDrag = useDragDropStore((state) => state.endDrag);
endDrag();
```

### State Serialization

```typescript
import {
  exportProject,
  importProject,
  downloadAsFile,
  uploadFromFile,
  saveToLocalStorage,
  loadFromLocalStorage,
} from './store/serialization';

// Export current project
const state = usePageBuilderStore.getState();
const exported = exportProject(state, {
  name: 'My Project',
  description: 'Project description',
  author: 'John Doe',
});

// Download as JSON file
downloadAsFile(exported, 'my-project.json');

// Import from file
const uploadedProject = await uploadFromFile();
const result = importProject(uploadedProject, currentState, {
  mode: 'merge',
  handleConflicts: 'rename',
});

// Save/load from localStorage
saveToLocalStorage('project-1', exported);
const loaded = loadFromLocalStorage('project-1');
```

### Component Hierarchy Queries

```typescript
import {
  traverseTree,
  findComponents,
  getAncestors,
  getDescendants,
  getComponentPath,
  isAncestor,
} from './store/hierarchy';

// Traverse tree depth-first
traverseTree(canvas, (node) => {
  console.log(node.component.name, node.depth);
});

// Find components by predicate
const buttons = findComponents(canvas, (comp) => comp.type === 'Button');

// Check relationships
const isParent = isAncestor(canvas, parentId, childId);

// Get component path
const path = getComponentPath(canvas, componentId);
```

### Advanced Selection

```typescript
import {
  useAdvancedSelectionStore,
  getComponentsInBox,
  selectAll,
  selectSiblings,
  selectChildren,
  getNextSibling,
} from './store/selection';

// Box selection
const startBoxSelection = useAdvancedSelectionStore((state) => state.startBoxSelection);
startBoxSelection(100, 100);

const updateBoxSelection = useAdvancedSelectionStore((state) => state.updateBoxSelection);
updateBoxSelection(200, 200);

// Get components in selection box
const box = useAdvancedSelectionStore((state) => state.boxSelection);
const componentsInBox = getComponentsInBox(allComponents, box);

// Select all
const allIds = selectAll(components, { skipHidden: true, skipLocked: true });

// Keyboard navigation
const nextComponent = getNextSibling(components, currentComponent, { wrap: true });
```

### Performance Monitoring

```typescript
import {
  getPerformanceMonitor,
  usePerformanceStats,
  measureAction,
  generatePerformanceReport,
} from './store/performance';

// Get performance stats
const stats = usePerformanceStats();
console.log('Average action duration:', stats.averageDuration);
console.log('Slowest action:', stats.slowestAction);

// Measure custom action
const result = measureAction('myCustomAction', () => {
  // ... complex operation
  return someValue;
});

// Generate report
const report = generatePerformanceReport();
console.log(report);
```

## State Structure

```typescript
interface PageBuilderState {
  canvas: {
    components: {
      byId: Record<ComponentId, ComponentInstance>;
      allIds: ComponentId[];
      rootIds: ComponentId[];
    };
    viewport: { zoom: number; panX: number; panY: number };
    grid: { enabled: boolean; size: number; snapToGrid: boolean };
  };
  selection: {
    selectedIds: ComponentId[];
    hoveredId: ComponentId | null;
    focusedId: ComponentId | null;
  };
  clipboard: {
    operation: 'copy' | 'cut' | null;
    components: ComponentInstance[];
  };
  history: {
    past: CanvasState[];
    future: CanvasState[];
    maxSize: number;
  };
  preview: {
    isPreviewMode: boolean;
    device: 'desktop' | 'tablet' | 'mobile';
    orientation: 'portrait' | 'landscape';
  };
  workflow: {
    pages: Array<{ id: string; name: string; path: string; canvasState: CanvasState }>;
    currentPageId: string;
  };
  properties: {
    isPanelOpen: boolean;
    activeTab: 'properties' | 'styles' | 'events';
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    autoSave: boolean;
    autoSaveInterval: number;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    zoom: number;
  };
}
```

## Best Practices

### 1. Use Selectors Instead of Direct State Access

```typescript
// Bad - subscribes to entire state
const state = usePageBuilderStore();
const component = state.canvas.components.byId[id];

// Good - only subscribes to specific component
const component = useComponentById(id);
```

### 2. Use Shallow Equality for Arrays/Objects

```typescript
import { shallow } from 'zustand/shallow';

// Prevents re-render when array content is same
const selectedIds = usePageBuilderStore(
  (state) => state.selection.selectedIds,
  shallow
);
```

### 3. Debounce Frequent Updates

```typescript
// For property changes while typing
updateComponent(id, { name: newName }, true); // true = debounced
```

### 4. Batch Multiple Updates

```typescript
// Use Immer to batch updates in a single state change
set((state) => {
  state.canvas.components.byId[id1].name = 'New Name 1';
  state.canvas.components.byId[id2].name = 'New Name 2';
  state.selection.selectedIds = [id1, id2];
});
```

### 5. Monitor Performance in Development

```typescript
// Check performance stats regularly
const monitor = getPerformanceMonitor();
const stats = monitor.getStats();

if (stats.warnings.length > 0) {
  console.warn('Performance warnings:', stats.warnings);
}
```

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePageBuilderStore } from './store';

test('adds component to canvas', () => {
  const { result } = renderHook(() => usePageBuilderStore());

  act(() => {
    const id = result.current.addComponent({
      type: 'Button',
      name: 'Test Button',
      parentId: null,
      childIds: [],
      position: { x: 0, y: 0 },
      size: { width: 100, height: 40 },
      properties: {},
      styles: {},
      locked: false,
      hidden: false,
    });

    expect(result.current.canvas.components.byId[id]).toBeDefined();
    expect(result.current.canvas.components.allIds).toContain(id);
  });
});
```

## Performance Tips

1. **Use specific selectors** - Avoid selecting entire state when you only need a slice
2. **Enable shallow comparison** - For arrays and objects that change reference but not content
3. **Debounce rapid updates** - Especially for text input and drag operations
4. **Monitor with DevTools** - Use Redux DevTools to track state changes
5. **Check performance warnings** - Address warnings from performance monitor
6. **Limit history size** - Adjust maxSize based on memory constraints
7. **Use normalized state** - Keep data flat to avoid deep updates

## Migration Guide

If upgrading from a previous version, see [MIGRATION.md](./MIGRATION.md) for detailed migration steps.
