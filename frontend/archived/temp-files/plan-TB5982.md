# Table Component Refactoring Plan - TB5982

**Agent:** React Component Architect
**Task ID:** table-component-refactoring-TB5982
**Started:** 2025-11-04T19:30:00Z
**Estimated Duration:** 2-3 hours

## References to Other Agent Work
- Architecture patterns: `.temp/architecture-notes-BDM701.md`
- Recent re-export work: `.temp/completion-summary-CM734R.md`

## Overview
Refactor the 916 LOC enterprise Table.tsx component into a maintainable compound component pattern with focused sub-components, following React best practices for component composition and code organization.

## Current Structure Analysis
- **Location:** `F:\temp\white-cross\frontend\src\components\ui\data\Table.tsx`
- **Size:** 916 lines of code
- **Components:** 9 exported components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableEmptyState, TableLoadingState)
- **Features:** Sorting, selection, variants, responsive sizing, ARIA accessibility, HIPAA compliance

## Target Architecture

### Directory Structure
```
components/ui/data/Table/
├── index.ts                  # Main re-export hub
├── Table.tsx                 # Composition root component
├── TableHeader.tsx           # Header with sorting logic
├── TableBody.tsx             # Body rendering
├── TableRow.tsx              # Row component with selection
├── TableCell.tsx             # Cell component
├── TableHead.tsx             # Header cell with sorting
├── TableCaption.tsx          # Caption component
├── TableEmpty.tsx            # Empty state component
├── TableLoading.tsx          # Loading state component
├── types.ts                  # All TypeScript interfaces
├── hooks.ts                  # Table state hooks (if needed)
└── utils.ts                  # Sorting/filtering utilities
```

## Phase 1: Analysis & Setup (30 minutes)

### 1.1 Current Component Analysis
- Identify component dependencies
- Map props interfaces to components
- Identify shared utilities (SortIcon)
- Document accessibility features

### 1.2 Directory Creation
- Create `Table/` subdirectory
- Set up file structure

## Phase 2: Type Extraction (20 minutes)

### 2.1 Create types.ts
- Extract all TypeScript interfaces:
  - `TableProps`
  - `TableHeaderProps`
  - `TableBodyProps`
  - `TableRowProps`
  - `TableHeadProps`
  - `TableCellProps`
  - `TableCaptionProps`
  - `TableEmptyStateProps`
  - `TableLoadingStateProps`
- Add proper JSDoc documentation

## Phase 3: Component Splitting (60 minutes)

### 3.1 TableHeader.tsx
- Extract TableHeader component
- Include header-specific styling
- Import types from types.ts

### 3.2 TableBody.tsx
- Extract TableBody component
- Include body-specific styling
- Import types from types.ts

### 3.3 TableRow.tsx
- Extract TableRow component
- Include selection and clickable logic
- Maintain ARIA attributes

### 3.4 TableCell.tsx
- Extract TableCell component
- Preserve cell styling
- Import types from types.ts

### 3.5 TableHead.tsx
- Extract TableHead component (column header)
- Include SortIcon component
- Preserve sortable logic and keyboard handlers
- Maintain ARIA sort attributes

### 3.6 TableCaption.tsx
- Extract TableCaption component
- Preserve accessibility features

### 3.7 TableEmpty.tsx
- Extract TableEmptyState as TableEmpty
- Maintain backward compatibility (cols/colSpan)
- Preserve title/description pattern

### 3.8 TableLoading.tsx
- Extract TableLoadingState as TableLoading
- Preserve skeleton animation

## Phase 4: Main Table Component (20 minutes)

### 4.1 Refactor Table.tsx
- Keep as composition root
- Import sub-components
- Preserve variant and size logic
- Maintain overflow wrapper
- Keep comprehensive JSDoc documentation

## Phase 5: Utilities & Hooks (15 minutes)

### 5.1 Create utils.ts
- Extract SortIcon component
- Add utility functions if needed (sorting, filtering helpers)

### 5.2 Create hooks.ts (if needed)
- Create custom hooks for table state management
- Examples: `useTableSort`, `useTableSelection`

## Phase 6: Index & Re-exports (15 minutes)

### 6.1 Create index.ts
- Re-export all components
- Re-export all types
- Maintain backward compatibility

## Phase 7: Validation (20 minutes)

### 7.1 TypeScript Validation
- Verify all types are correctly imported
- Ensure no circular dependencies
- Check displayName assignments

### 7.2 Component Functionality
- Verify all component props are preserved
- Check sorting functionality
- Validate selection states
- Test variants and sizes

### 7.3 Accessibility Check
- Verify ARIA attributes
- Check keyboard navigation
- Validate semantic HTML

### 7.4 Import Path Updates
- Identify files that import from old path
- Update import statements if necessary

## Deliverables

1. **Table/ subdirectory** with 13 files
2. **Focused sub-components** with single responsibilities
3. **Centralized types** in types.ts
4. **Utility functions** in utils.ts
5. **Re-export hub** in index.ts maintaining backward compatibility
6. **Preserved functionality** - sorting, selection, variants, accessibility
7. **Comprehensive documentation** in each component

## Success Criteria

- All 9 components successfully split into focused files
- TypeScript types centralized and properly exported
- No breaking changes to existing usage
- All ARIA attributes and accessibility features preserved
- Compound component pattern properly implemented
- File size reduced from 916 LOC to ~50-100 LOC per file

## Risk Mitigation

- **Breaking Changes:** Maintain exact same exports in index.ts
- **Type Safety:** Verify all type imports after extraction
- **Accessibility:** Preserve all ARIA attributes and semantic HTML
- **Performance:** Ensure no additional re-renders introduced
