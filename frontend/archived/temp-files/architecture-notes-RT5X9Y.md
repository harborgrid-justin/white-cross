# Architecture Notes - ReportTemplates Refactoring (RT5X9Y)

## References to Other Agent Work
- Previous refactoring patterns: `.temp/architecture-notes-BDM701.md`
- Component structure patterns: `.temp/plan-BDM701.md`
- Re-export strategies: `.temp/plan-CM734R.md`

## High-level Design Decisions

### Component Hierarchy
```
ReportTemplates (Main Container)
├── TemplateLibrary (Browsing & Display)
│   ├── TemplateCategories (Category Navigation)
│   └── TemplateMetadata (Metadata Display)
├── TemplateEditor (Create/Edit Modal)
└── TemplatePreview (Preview Modal)
```

### State Management Approach
- **Top-level state** managed in main ReportTemplates component
- **Local state** within each modal component
- **Shared state** passed via props (no Context API needed for this scope)
- **Custom hooks** for template CRUD operations and filtering logic

### Props vs. Context API
**Decision**: Use props for all state passing
**Rationale**:
- Component hierarchy is only 2-3 levels deep
- State is primarily used in modals (isolated contexts)
- No prop drilling issues due to shallow hierarchy
- Easier to test and maintain
- More explicit data flow

## Integration Patterns

### Parent-Child Communication
- **Parent → Child**: Props for data and callbacks
- **Child → Parent**: Event handlers via callback props
- **Sibling Communication**: Via parent state updates

### Modal Management
- Each modal component is self-contained
- Modal visibility controlled by parent state
- Selected template passed via props
- Callbacks for user actions (save, cancel, use)

### Event Handlers
```typescript
// Parent provides handlers
onCreateTemplate: (template) => void
onUpdateTemplate: (id, updates) => void
onDeleteTemplate: (id) => void
onPreviewTemplate: (id) => void
// Children invoke callbacks with appropriate data
```

## React Patterns Used

### Custom Hooks Design
```typescript
// hooks.ts
export const useTemplateFilters = (templates, filters) => {
  // Filter logic with useMemo for performance
}

export const useTemplateActions = (callbacks) => {
  // Unified action handler
}
```

### Component Composition
- **TemplateLibrary**: Composite component with grid/list views
- **TemplateCategories**: Presentational component for category UI
- **TemplateMetadata**: Reusable metadata display
- **TemplateEditor**: Controlled form component
- **TemplatePreview**: Read-only display component

### Render Props vs. Hooks
**Decision**: Use hooks throughout
**Rationale**:
- Modern React pattern
- Better composition
- Easier to test
- More maintainable

## Performance Considerations

### Memoization Strategy
```typescript
// In TemplateLibrary.tsx
const filteredTemplates = useMemo(() => {
  return templates.filter(/* filtering logic */);
}, [templates, searchTerm, categoryFilter, complexityFilter]);

// In utils.ts - Already pure functions, no memoization needed
```

### Code Splitting Points
- Not needed for this component size
- Each file under 300 LOC is sufficiently small
- Lazy loading could be added at route level if needed

### Re-render Optimization
- Use `React.memo` for `TemplateCategories` (static category list)
- Use `React.memo` for `TemplateMetadata` (only re-renders when template changes)
- Avoid inline function definitions in render
- Use `useCallback` for event handlers passed to children

### Lazy Loading Approach
- Not required for this refactoring
- All components loaded together
- Future enhancement: lazy load modals

## Type Safety

### TypeScript Interface Design
```typescript
// types.ts - Comprehensive type definitions
export type TemplateCategory = 'clinical' | 'financial' | 'operational' | 'compliance' | 'patient-satisfaction' | 'custom';
export type TemplateComplexity = 'simple' | 'intermediate' | 'advanced';
export type DataSource = 'students' | 'medications' | 'appointments' | 'communications' | 'health-records' | 'billing' | 'compliance';

export interface ReportTemplate {
  // Full interface with all properties
}

export interface TemplateFolder {
  // Folder structure
}

// Component prop interfaces
export interface TemplateLibraryProps {
  templates: ReportTemplate[];
  // ... other props
}
```

### Generic Component Patterns
- Not required for this component set
- All components work with specific ReportTemplate type

### Props Type Definitions
- All component props defined as interfaces
- Event handlers properly typed with React event types
- Optional props clearly marked with `?`
- Default values provided via default parameters

### Event Handler Typing
```typescript
// Properly typed event handlers
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
```

## File Organization

### Directory Structure
```
ReportTemplates/
├── index.ts                    # Barrel export
├── types.ts                    # ~100 LOC - Type definitions
├── utils.ts                    # ~80 LOC - Helper functions
├── hooks.ts                    # ~120 LOC - Custom hooks
├── TemplateLibrary.tsx         # ~250 LOC - Main browsing
├── TemplateCategories.tsx      # ~80 LOC - Category nav
├── TemplateEditor.tsx          # ~200 LOC - Create/edit
├── TemplatePreview.tsx         # ~180 LOC - Preview
└── TemplateMetadata.tsx        # ~100 LOC - Metadata
```

### Import Strategy
```typescript
// Internal imports (within ReportTemplates/)
import { ReportTemplate, TemplateCategory } from './types';
import { formatDate, getCategoryInfo } from './utils';
import { useTemplateFilters } from './hooks';

// External imports
import React, { useState, useMemo } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
```

### Export Strategy
```typescript
// index.ts - Barrel export
export { default as ReportTemplates } from './ReportTemplates';
export { TemplateLibrary } from './TemplateLibrary';
export { TemplateEditor } from './TemplateEditor';
export { TemplatePreview } from './TemplatePreview';
export * from './types';

// Original ReportTemplates.tsx becomes thin re-export wrapper
```

## Accessibility Considerations
- All buttons have aria-labels
- Form inputs have proper labels
- Modal dialogs have appropriate ARIA attributes
- Keyboard navigation supported
- Screen reader friendly

## Testing Strategy
- Unit tests for utility functions (formatDate, getCategoryInfo)
- Component tests for each extracted component
- Integration tests for ReportTemplates main component
- Event handler tests with user interactions
- Accessibility tests with react-testing-library

## Migration Path
1. Create new directory structure
2. Extract utility files (types, utils, hooks)
3. Create new component files
4. Test each component individually
5. Update original file to re-export
6. Verify backward compatibility
7. Remove old code from original file

## Backward Compatibility
- Original `ReportTemplates` export remains unchanged
- All props interfaces remain the same
- Component API unchanged
- Consumers don't need to update imports

## Future Enhancement Opportunities
1. Add lazy loading for modals
2. Implement virtual scrolling for large template lists
3. Add template versioning UI
4. Enhance preview with live data
5. Add template marketplace features
6. Implement template sharing workflow
