# Refactoring Plan: ReportBuilder.tsx
**Task ID:** RB9X2Y
**Agent:** React Component Architect
**Started:** 2025-11-04

## Overview
Break down the 1,021-line ReportBuilder.tsx component into smaller, focused, reusable components following React best practices and single responsibility principle.

## Current Structure Analysis
- **Total Lines:** 1,021 LOC
- **Main Sections:**
  - Type definitions (lines 37-117)
  - Component props interface (lines 122-149)
  - Main component with 5 step navigation states
  - State management with multiple useState hooks
  - Helper functions for data transformation
  - 5 distinct UI sections (Basic Info, Data Sources, Filters, Visualization, Schedule)
  - Preview modal

## Refactoring Strategy

### Phase 1: Foundation Setup (30 minutes)
**Deliverables:**
- `ReportBuilder/` subdirectory created
- `types.ts` - All TypeScript interfaces and types
- `utils.ts` - Helper functions and data transformation utilities
- `hooks.ts` - Custom hooks for state management

**Key Decisions:**
- Extract all type definitions to maintain type safety
- Create useReportBuilder hook to encapsulate state logic
- Utility functions for data source info, operator text, validation

### Phase 2: Component Extraction (90 minutes)
**Deliverables:**
- `DataSourceSelector.tsx` - Data source selection with checkboxes
- `FieldSelector.tsx` - Expandable field picker by data source
- `FilterBuilder.tsx` - Filter condition builder with add/remove
- `ChartConfigurator.tsx` - Chart type and configuration settings
- `QueryPreview.tsx` - Preview modal with data table
- `BuilderCanvas.tsx` - Main orchestration component

**Component Breakdown:**
1. **DataSourceSelector** (~150 LOC)
   - Props: dataSources, selectedSources, onToggle, availableFields
   - Renders data source cards with icons and field counts
   - Handles selection state

2. **FieldSelector** (~200 LOC)
   - Props: dataSources, availableFields, selectedFields, onToggleField
   - Expandable sections per data source
   - Checkbox grid for field selection

3. **FilterBuilder** (~150 LOC)
   - Props: filters, availableFields, onAddFilter, onUpdateFilter, onRemoveFilter
   - Filter condition rows with field/operator/value
   - Dynamic operator options based on field type

4. **ChartConfigurator** (~120 LOC)
   - Props: includeChart, chartConfig, onUpdateConfig
   - Chart type selector with icons
   - Configuration options based on chart type

5. **QueryPreview** (~100 LOC)
   - Props: showPreview, previewData, previewLoading, selectedFields, onClose
   - Modal with data table
   - Loading and empty states

6. **BuilderCanvas** (~250 LOC)
   - Orchestrates all components
   - Step navigation
   - Header with actions
   - Renders appropriate component per active step

### Phase 3: Main Component Update (20 minutes)
**Deliverables:**
- Updated `ReportBuilder.tsx` using new components
- Maintains same external API (props interface)
- Clean composition of sub-components

### Phase 4: Index and Exports (10 minutes)
**Deliverables:**
- `index.ts` with named exports
- Re-export all types for external use
- Default export of main ReportBuilder

### Phase 5: Verification (15 minutes)
**Deliverables:**
- Type checking passes
- All imports resolved correctly
- Component integration verified
- Backward compatibility maintained

## Timeline
**Total Estimated Time:** 2-3 hours

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | 30 min | Pending |
| Phase 2: Components | 90 min | Pending |
| Phase 3: Main Update | 20 min | Pending |
| Phase 4: Exports | 10 min | Pending |
| Phase 5: Verification | 15 min | Pending |

## Success Criteria
- [ ] All components under 300 LOC
- [ ] Each component has single, clear responsibility
- [ ] Type safety maintained throughout
- [ ] No breaking changes to external API
- [ ] All imports resolve correctly
- [ ] Original functionality preserved
- [ ] Improved maintainability and testability

## Cross-Agent References
- Similar refactoring patterns used in previous component breakdowns
- Follows established directory structure patterns
- Maintains consistency with other refactored components

## Risk Mitigation
- Maintain backward compatibility with existing Report types
- Preserve all existing functionality
- Test state management flow between components
- Verify preview modal behavior
- Ensure validation logic remains intact
