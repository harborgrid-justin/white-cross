# ReportTemplates Refactoring Plan - RT5X9Y

## Overview
Break down ReportTemplates.tsx (1,018 LOC) into modular, maintainable components under 300 LOC per file.

## Current Structure Analysis
- **Total LOC**: 1,018
- **Main Sections**:
  - Types and interfaces (lines 40-141)
  - Component logic and state (lines 153-346)
  - Header and filters (lines 349-468)
  - Template grid/list rendering (lines 470-676)
  - Create/Edit modal (lines 678-831)
  - Import modal (lines 833-877)
  - Preview modal (lines 879-1013)

## Refactoring Strategy

### Phase 1: Foundation Setup (Estimated: 30 minutes)
**Timeline**: Start to +30 mins

1. Create `ReportTemplates/` subdirectory
2. Extract `types.ts` - All TypeScript interfaces and types
3. Extract `utils.ts` - Helper functions (formatDate, getCategoryInfo, getComplexityBadge, renderStarRating)
4. Extract `hooks.ts` - State management and CRUD hooks

**Deliverables**:
- `F:\temp\white-cross\frontend\src\components\pages\Reports\ReportTemplates\types.ts` (~100 LOC)
- `F:\temp\white-cross\frontend\src\components\pages\Reports\ReportTemplates\utils.ts` (~80 LOC)
- `F:\temp\white-cross\frontend\src\components\pages\Reports\ReportTemplates\hooks.ts` (~120 LOC)

### Phase 2: Component Extraction (Estimated: 90 minutes)
**Timeline**: +30 mins to +120 mins

1. **TemplateLibrary.tsx** (~250 LOC)
   - Template browsing grid/list view
   - Search and filter UI
   - View mode toggle
   - Template cards/list items

2. **TemplateCategories.tsx** (~80 LOC)
   - Category navigation
   - Category badges and icons
   - Category filtering logic

3. **TemplateEditor.tsx** (~200 LOC)
   - Template creation modal
   - Template editing modal
   - Form state management
   - Validation logic

4. **TemplatePreview.tsx** (~180 LOC)
   - Preview modal
   - Template details display
   - Sample data table
   - Usage statistics

5. **TemplateMetadata.tsx** (~100 LOC)
   - Template metadata display
   - Tags, ratings, usage count
   - Favorite toggle
   - Built-in badge

**Deliverables**:
- 5 component files, each under 300 LOC
- Clear separation of concerns
- Reusable component structure

### Phase 3: Integration (Estimated: 30 minutes)
**Timeline**: +120 mins to +150 mins

1. Create `index.ts` barrel export
2. Update original `ReportTemplates.tsx` to re-export components
3. Ensure backward compatibility
4. Add JSDoc documentation

**Deliverables**:
- `F:\temp\white-cross\frontend\src\components\pages\Reports\ReportTemplates\index.ts`
- Updated `F:\temp\white-cross\frontend\src\components\pages\Reports\ReportTemplates.tsx` (~50 LOC)

### Phase 4: Validation (Estimated: 20 minutes)
**Timeline**: +150 mins to +170 mins

1. Verify LOC count for each file
2. Check TypeScript compilation
3. Verify imports and exports
4. Ensure no breaking changes

## Success Criteria

- All component files under 300 LOC
- Clear separation of concerns
- Maintained functionality
- No TypeScript errors
- Proper re-exports from original file
- Comprehensive JSDoc documentation

## Component Breakdown Details

### File Structure
```
ReportTemplates/
├── index.ts                    # Barrel export
├── types.ts                    # Type definitions
├── utils.ts                    # Helper functions
├── hooks.ts                    # Custom hooks
├── TemplateLibrary.tsx         # Main browsing interface
├── TemplateCategories.tsx      # Category navigation
├── TemplateEditor.tsx          # Create/edit modal
├── TemplatePreview.tsx         # Preview modal
└── TemplateMetadata.tsx        # Metadata display
```

## Dependencies and Cross-References
- Referenced existing architecture notes: `.temp/architecture-notes-BDM701.md`
- Following patterns from previous refactoring work
- Maintaining consistency with other Reports components

## Risk Mitigation
- Keep original file as fallback during refactoring
- Use barrel exports to maintain backward compatibility
- Test each component individually before integration
- Document all prop interfaces thoroughly

## Total Estimated Time: 170 minutes (~3 hours)
