# Page Builder UI Components

A modern, professional page builder interface with best-in-class UX patterns inspired by Webflow, Framer, and Windmill.

## Overview

The page builder provides a comprehensive drag-and-drop interface for creating pages with a visual editor. It features a three-panel layout with component palette, canvas, and properties panel, along with extensive keyboard shortcuts and accessibility features.

## Components

### PageBuilderLayout

Main layout container that orchestrates all page builder panels and functionality.

**Features:**
- Three-panel layout (Palette, Canvas, Properties)
- Resizable panels with drag handles
- Panel collapse/expand with smooth animations
- Persistent layout preferences (localStorage)
- Responsive design
- Keyboard shortcuts support

**Usage:**
```tsx
import { PageBuilderLayout } from '@/components/page-builder';

function MyPage() {
  return (
    <PageBuilderLayout
      initialPageData={undefined}
      onSave={(pageData) => console.log('Saving:', pageData)}
      onPublish={(pageData) => console.log('Publishing:', pageData)}
    />
  );
}
```

### ComponentPalette

Left sidebar displaying the categorized component library with search and drag-to-canvas.

**Features:**
- Categorized components (Layout, Navigation, Forms, Data Display, Next.js)
- Search and filter functionality
- Component preview with metadata
- Drag-to-canvas interaction
- Collapsible categories
- Server/Client component badges
- Helpful tooltips

**Component Categories:**
1. **Layout** - Container, Grid, Flex, Stack, Section
2. **Navigation** - Navbar, Sidebar, Breadcrumbs, Tabs, Pagination
3. **Forms** - Input, Select, Checkbox, RadioGroup, DatePicker, FileUpload, Textarea
4. **Data Display** - Table, List, Card, Badge, Avatar, Alert
5. **Next.js** - NextImage, NextLink, Loading, ErrorBoundary, SuspenseBoundary, ServerComponent, ClientComponent

### BuilderCanvas

Center canvas area for visual page building with drag-and-drop support.

**Features:**
- Drag-and-drop from palette
- Visual drop zones with hover states
- Component selection with bounding box
- Resize handles for selected components
- Grid-based layout with visual grid
- Zoom controls (25% - 200%)
- Pan tool for canvas navigation
- Responsive viewport modes:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1440px)
- Empty state with helpful onboarding
- Tool selection (Select, Pan)

**Interactions:**
- Drag components from palette onto canvas
- Click to select components
- Drag selected components to reposition
- Use resize handles to adjust size
- Switch viewport modes to preview responsive design
- Zoom in/out for detailed editing

### PropertyPanel

Right sidebar for editing selected component properties.

**Features:**
- Grouped property controls (Basic, Layout, Styling, Behavior)
- Dynamic property rendering based on component type
- Various control types:
  - Text input
  - Number input with stepper
  - Select dropdown
  - Color picker
  - Spacing controls (margin, padding)
  - Toggle switches
- Real-time preview updates
- Property search and filtering
- Collapsible property groups
- Help text and tooltips

**Property Groups:**
1. **Basic** - Component name, visibility
2. **Layout** - Width, height, display, positioning
3. **Styling** - Background, text color, padding, margin, borders
4. **Behavior** - Click actions, event handlers

### FloatingToolbar

Top toolbar with common actions and controls.

**Features:**
- Save and publish buttons
- Undo/redo controls
- Preview mode toggle
- Component tree view toggle
- Code view button
- Page settings
- Help and keyboard shortcuts
- Page status indicator
- Page name editing

**Actions:**
- **Save** (Ctrl+S) - Save current page as draft
- **Publish** - Publish page to production
- **Undo** (Ctrl+Z) - Undo last action
- **Redo** (Ctrl+Y) - Redo last undone action
- **Preview** (Ctrl+P) - Toggle preview mode
- **Tree View** (Ctrl+T) - Show/hide component tree
- **Code View** - View generated code
- **Help** - Show keyboard shortcuts

### ComponentTreeView

Hierarchical tree view of all components on the canvas (layers panel).

**Features:**
- Hierarchical component tree
- Drag-and-drop reordering
- Component visibility toggle
- Component lock toggle
- Component selection
- Expand/collapse nested components
- Drag handles for reordering

**Usage:**
```tsx
import { ComponentTreeView } from '@/components/page-builder';

function MyTreeView() {
  return (
    <ComponentTreeView
      components={components}
      selectedId={selectedId}
      onSelect={(id) => setSelectedId(id)}
      onToggleVisibility={(id) => toggleVisibility(id)}
      onToggleLock={(id) => toggleLock(id)}
    />
  );
}
```

### KeyboardShortcutsDialog

Modal dialog displaying all available keyboard shortcuts.

**Features:**
- Categorized shortcuts
- Search/filter shortcuts
- Visual keyboard hints
- Copy-friendly format

**Shortcut Categories:**
1. **General** - Save, undo/redo, panel toggles
2. **Selection** - Tool selection, navigation
3. **Editing** - Delete, duplicate, copy/paste
4. **Movement** - Arrow keys for positioning
5. **View** - Zoom controls

## Keyboard Shortcuts

### General
- `Ctrl+S` - Save page
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+P` - Toggle preview
- `Ctrl+T` - Toggle tree view
- `Ctrl+B` - Toggle component palette
- `Ctrl+I` - Toggle properties panel
- `?` - Show keyboard shortcuts

### Selection & Navigation
- `V` - Select tool
- `H` - Pan tool
- `Escape` - Clear selection
- `Tab` - Select next component
- `Shift+Tab` - Select previous component

### Editing
- `Delete` - Delete selected component
- `Ctrl+D` - Duplicate selected component
- `Ctrl+C` - Copy selected component
- `Ctrl+V` - Paste component
- `Ctrl+X` - Cut selected component

### Movement
- `↑/↓/←/→` - Move component 1px
- `Shift+↑/↓/←/→` - Move component 10px

### View
- `Ctrl++` - Zoom in
- `Ctrl+-` - Zoom out
- `Ctrl+0` - Reset zoom
- `Ctrl+1` - Fit to screen

## UX Patterns

### Drag-and-Drop
The page builder uses native HTML5 drag-and-drop for simplicity and performance:

1. **From Palette to Canvas**: Drag component cards from the palette onto the canvas
2. **Visual Feedback**: Semi-transparent drag preview shows what you're dragging
3. **Drop Zones**: Canvas highlights valid drop zones when dragging
4. **Component Reordering**: Drag components within the canvas to reposition

### Panel Management
- **Resizable Panels**: Drag panel borders to resize
- **Collapsible Panels**: Click toggle buttons to collapse/expand
- **Persistent State**: Panel sizes and states saved to localStorage
- **Keyboard Shortcuts**: Quick toggle with Ctrl+B (palette) and Ctrl+I (properties)

### Component Selection
- **Click to Select**: Click any component on the canvas to select it
- **Visual Indicator**: Selected component shows blue bounding box with resize handles
- **Properties Update**: Property panel updates to show selected component's properties
- **Tree Highlight**: Selected component highlighted in tree view

### Responsive Design
- **Viewport Modes**: Switch between mobile, tablet, and desktop previews
- **Zoom Controls**: Zoom in/out for detailed editing
- **Grid System**: Visual grid helps with alignment and spacing

### Empty States
- **No Components**: Helpful message guides users to drag their first component
- **No Selection**: Property panel shows message to select a component
- **Search Results**: Clear messaging when no search results found

### Tooltips & Help
- **Control Tooltips**: Hover over any button to see its function
- **Keyboard Hints**: Tooltips show keyboard shortcuts where applicable
- **Component Info**: Component cards show detailed tooltips on hover
- **Help Dialog**: Comprehensive keyboard shortcuts reference

## Accessibility

### WCAG AA Compliance
- All text meets color contrast requirements (4.5:1 minimum)
- Focus indicators visible on all interactive elements
- Semantic HTML structure throughout
- ARIA labels and descriptions on all controls

### Keyboard Navigation
- Full keyboard support for all interactions
- Logical tab order through interface
- Escape key closes modals and clears selection
- Arrow keys for precise component positioning

### Screen Reader Support
- ARIA labels on all interactive elements
- ARIA-expanded on collapsible panels
- ARIA-pressed on toggle buttons
- Descriptive text for all actions

## Performance

### Optimizations
- CSS transforms for smooth animations
- Debounced panel resize operations
- Optimized drag event handlers
- Minimal re-renders with React hooks

### Future Optimizations
- Virtualization for long component lists (>100 items)
- Lazy loading of property controls
- Memoization of expensive calculations
- Web Workers for heavy operations

## Integration

### With Component Catalog
The page builder integrates with the existing component catalog system:

```tsx
import { AllComponents, ComponentGroups } from '@/lib/page-builder/components';
import type { ComponentDefinition } from '@/lib/page-builder/types';
```

### With Store/State Management
The page builder will integrate with the store hooks:

```tsx
import {
  useAddComponent,
  useRemoveComponent,
  useSelectedComponents
} from '@/store/hooks';
```

## Future Enhancements

### Phase 2 Features
- [ ] Template library with pre-built page layouts
- [ ] Advanced undo/redo with history timeline
- [ ] Component variants and presets
- [ ] Responsive property values
- [ ] Animation and transition controls
- [ ] Custom CSS editor
- [ ] Export to code (React, HTML, Vue)

### Phase 3 Features
- [ ] Collaborative editing (real-time)
- [ ] Version history and rollback
- [ ] Component marketplace
- [ ] Advanced data binding
- [ ] Form validation builder
- [ ] API integration wizard
- [ ] A/B testing support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

This component is part of the White Cross project.
