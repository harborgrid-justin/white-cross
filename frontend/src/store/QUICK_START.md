# Quick Start Guide - Page Builder Store

## Installation

Dependencies already installed:
- zustand@5.0.8 ✓
- nanoid@5.1.6 ✓

Check if immer is installed:
```bash
npm list immer
# If not installed:
npm install immer
```

## Basic Import

```typescript
import { usePageBuilderStore } from '@/store';
import { 
  useAddComponent,
  useRemoveComponent,
  useSelectedComponents,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
} from '@/store/hooks';
```

## Common Patterns

### Add a Component
```typescript
const addComponent = useAddComponent();

const id = addComponent({
  type: 'Button',
  name: 'My Button',
  parentId: null, // or parent component ID
  childIds: [],
  position: { x: 100, y: 100 },
  size: { width: 120, height: 40 },
  properties: { text: 'Click me' },
  locked: false,
  hidden: false,
});
```

### Select Components
```typescript
const select = useSelect();
const selectedComponents = useSelectedComponents();

// Single select
select('component-id');

// Multi-select
select('component-id', true);

// Clear selection
const clearSelection = useClearSelection();
clearSelection();
```

### Undo/Redo
```typescript
const undo = useUndo();
const redo = useRedo();
const canUndo = useCanUndo();
const canRedo = useCanRedo();

<button onClick={undo} disabled={!canUndo}>Undo</button>
<button onClick={redo} disabled={!canRedo}>Redo</button>
```

### Copy/Paste
```typescript
const copy = useCopy();
const paste = usePaste();
const canPaste = useCanPaste();

// Copy selected
copy(selectedIds);

// Paste to canvas root
const newIds = paste(null);

// Paste as children of a component
const newIds = paste('parent-id');
```

### Move Component
```typescript
const moveComponent = useMoveComponent();

// Move to new parent
moveComponent('component-id', 'new-parent-id');

// Move to root
moveComponent('component-id', null);

// Move with specific index
moveComponent('component-id', 'new-parent-id', 0);
```

### Update Properties
```typescript
const updateProperty = usePageBuilderStore(state => state.updateProperty);
const updateProperties = usePageBuilderStore(state => state.updateProperties);

// Single property
updateProperty('component-id', 'text', 'New text');

// Multiple properties
updateProperties('component-id', {
  text: 'New text',
  style: { backgroundColor: '#3b82f6' }
});
```

### Get Component Tree
```typescript
const tree = useComponentTree();

// Render tree recursively
function renderTree(nodes) {
  return nodes.map(node => (
    <div key={node.component.id} style={{ marginLeft: node.depth * 20 }}>
      {node.component.name}
      {node.children.length > 0 && renderTree(node.children)}
    </div>
  ));
}
```

## Keyboard Shortcuts

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'c':
          e.preventDefault();
          copy(selectedIds);
          break;
        case 'v':
          e.preventDefault();
          paste();
          break;
        case 'x':
          e.preventDefault();
          cut(selectedIds);
          break;
        case 'd':
          e.preventDefault();
          selectedIds.forEach(id => duplicateComponent(id));
          break;
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      selectedIds.forEach(id => removeComponent(id));
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedIds, undo, redo, copy, paste, cut]);
```

## Access Store Directly (Outside Components)

```typescript
import { usePageBuilderStore } from '@/store';

// Get current state
const state = usePageBuilderStore.getState();

// Call actions
state.addComponent({...});
state.select('component-id');
state.undo();

// Subscribe to changes
const unsubscribe = usePageBuilderStore.subscribe(
  (state) => state.selection.selectedIds,
  (selectedIds) => console.log('Selection changed:', selectedIds)
);
```

## DevTools

Install Redux DevTools browser extension and open DevTools while in development mode.

State will be visible as "PageBuilderStore" with full time-travel debugging.

## Performance Tips

### Use Fine-grained Selectors
```typescript
// ❌ Bad: Re-renders on any canvas change
const canvas = usePageBuilderStore(state => state.canvas);

// ✅ Good: Only re-renders when this component changes
const component = usePageBuilderStore(
  state => state.canvas.components.byId[id]
);

// ✅ Better: Use custom hook
const component = useComponent(id);
```

### Use Shallow Equality for Multiple Values
```typescript
import { useShallow } from 'zustand/react/shallow';

const { theme, zoom } = usePageBuilderStore(
  useShallow(state => ({
    theme: state.preferences.theme,
    zoom: state.preferences.zoomLevel,
  }))
);
```

### Batch Updates
```typescript
// ❌ Bad: Multiple state updates
selectedIds.forEach(id => removeComponent(id));

// ✅ Good: Batch in single action (if available)
// Or use set directly for custom batching
```

## Common Use Cases

### Canvas with Selection
```typescript
function Canvas() {
  const rootComponents = useRootComponents();
  const selectedIds = useSelectedIds();
  const select = useSelect();
  const setHovered = useSetHovered();

  return (
    <div>
      {rootComponents.map(component => (
        <Component
          key={component.id}
          data={component}
          isSelected={selectedIds.includes(component.id)}
          onClick={() => select(component.id)}
          onMouseEnter={() => setHovered(component.id)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
    </div>
  );
}
```

### Toolbar with Actions
```typescript
function Toolbar() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const canPaste = useCanPaste();
  const undo = useUndo();
  const redo = useRedo();
  const paste = usePaste();
  const selectedIds = useSelectedIds();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <button onClick={() => paste()} disabled={!canPaste}>Paste</button>
      <span>{selectedIds.length} selected</span>
    </div>
  );
}
```

### Property Editor
```typescript
function PropertyEditor() {
  const selectedComponents = useSelectedComponents();
  const updateProperty = usePageBuilderStore(state => state.updateProperty);

  if (selectedComponents.length !== 1) {
    return <div>Select a component to edit</div>;
  }

  const component = selectedComponents[0];

  return (
    <div>
      <input
        value={component.properties.text || ''}
        onChange={(e) => updateProperty(component.id, 'text', e.target.value)}
      />
      {/* More property inputs */}
    </div>
  );
}
```

## Troubleshooting

### Store not persisting
Check browser IndexedDB and LocalStorage. Clear if needed:
```typescript
indexedDB.deleteDatabase('page-builder-db');
localStorage.removeItem('page-builder-preferences');
```

### Too many re-renders
Use fine-grained selectors or custom hooks. Check React DevTools Profiler.

### TypeScript errors
Import types from `/store/types` and ensure all actions are properly typed.

## Full Documentation

See `/home/user/white-cross/frontend/src/store/README.md` for complete documentation.
