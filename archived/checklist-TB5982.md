# Table Refactoring Checklist - TB5982

## Phase 1: Analysis & Setup
- [ ] Analyze current Table.tsx structure and dependencies
- [ ] Create Table/ subdirectory structure
- [ ] Document component relationships

## Phase 2: Type Extraction
- [ ] Create types.ts with all interfaces
- [ ] Add JSDoc documentation to types
- [ ] Export all types

## Phase 3: Component Splitting
- [ ] Create TableHeader.tsx
- [ ] Create TableBody.tsx
- [ ] Create TableRow.tsx with selection logic
- [ ] Create TableCell.tsx
- [ ] Create TableHead.tsx with sorting
- [ ] Create TableCaption.tsx
- [ ] Create TableEmpty.tsx (TableEmptyState)
- [ ] Create TableLoading.tsx (TableLoadingState)
- [ ] Extract SortIcon to utils.ts

## Phase 4: Main Component
- [ ] Refactor Table.tsx as composition root
- [ ] Preserve variant and size logic
- [ ] Maintain overflow wrapper
- [ ] Keep comprehensive JSDoc

## Phase 5: Utilities & Hooks
- [ ] Create utils.ts with SortIcon
- [ ] Create hooks.ts (if needed)
- [ ] Add sorting/filtering utilities

## Phase 6: Re-exports
- [ ] Create index.ts re-export hub
- [ ] Export all components
- [ ] Export all types
- [ ] Verify backward compatibility

## Phase 7: Validation
- [ ] TypeScript compilation check
- [ ] Verify all props preserved
- [ ] Test sorting functionality
- [ ] Validate selection states
- [ ] Check variants (default, striped, bordered)
- [ ] Check sizes (sm, md, lg)
- [ ] Verify ARIA attributes
- [ ] Test keyboard navigation
- [ ] Validate semantic HTML
- [ ] Check displayName assignments

## Phase 8: Documentation
- [ ] Update all component JSDoc
- [ ] Document new file structure
- [ ] Update examples if needed
