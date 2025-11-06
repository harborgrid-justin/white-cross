# Refactoring Checklist: ReportBuilder.tsx
**Task ID:** RB9X2Y

## Phase 1: Foundation Setup
- [ ] Create `ReportBuilder/` subdirectory
- [ ] Extract and create `types.ts` with all interfaces
- [ ] Extract and create `utils.ts` with helper functions
- [ ] Extract and create `hooks.ts` with state management hook

## Phase 2: Component Extraction
- [ ] Create `DataSourceSelector.tsx` component
  - [ ] Implement data source card rendering
  - [ ] Add checkbox selection handling
  - [ ] Include field count display
  - [ ] Add proper TypeScript types
  - [ ] Include accessibility attributes

- [ ] Create `FieldSelector.tsx` component
  - [ ] Implement expandable source sections
  - [ ] Add field checkbox grid
  - [ ] Handle expand/collapse state
  - [ ] Add proper TypeScript types
  - [ ] Include accessibility attributes

- [ ] Create `FilterBuilder.tsx` component
  - [ ] Implement filter condition rows
  - [ ] Add filter management (add/update/remove)
  - [ ] Handle operator-based conditional rendering
  - [ ] Add proper TypeScript types
  - [ ] Include accessibility attributes

- [ ] Create `ChartConfigurator.tsx` component
  - [ ] Implement chart type selector
  - [ ] Add configuration options
  - [ ] Handle conditional rendering
  - [ ] Add proper TypeScript types
  - [ ] Include accessibility attributes

- [ ] Create `QueryPreview.tsx` component
  - [ ] Implement preview modal structure
  - [ ] Add data table rendering
  - [ ] Include loading and empty states
  - [ ] Add proper TypeScript types
  - [ ] Include accessibility attributes

- [ ] Create `BuilderCanvas.tsx` component
  - [ ] Implement step navigation
  - [ ] Add header with action buttons
  - [ ] Orchestrate step-based component rendering
  - [ ] Handle validation errors display
  - [ ] Add proper TypeScript types

## Phase 3: Main Component Update
- [ ] Update `ReportBuilder.tsx` to use new components
- [ ] Verify all props are correctly passed
- [ ] Ensure state management works correctly
- [ ] Test all user interactions

## Phase 4: Index and Exports
- [ ] Create `index.ts` with all exports
- [ ] Export main ReportBuilder as default
- [ ] Export all types for external use
- [ ] Export sub-components if needed

## Phase 5: Verification
- [ ] Run TypeScript type checking
- [ ] Verify all imports resolve correctly
- [ ] Test component integration
- [ ] Verify backward compatibility
- [ ] Check accessibility attributes
- [ ] Ensure no console errors
- [ ] Verify all functionality preserved
