# BillingDetail Refactoring Checklist

**Task ID:** BD9301
**Component:** BillingDetail.tsx (930 LOC)

## Setup Phase
- [ ] Create `BillingDetail/` subdirectory
- [ ] Create `types.ts` with all type definitions
- [ ] Create `utils.ts` with utility functions
- [ ] Verify utility functions work correctly

## Tab Component Creation
- [ ] Create `InvoiceOverview.tsx` (<300 LOC)
  - [ ] Status and actions section
  - [ ] Amount details grid
  - [ ] Patient information section
  - [ ] Important dates section
  - [ ] Insurance information (conditional)
  - [ ] Notes and terms (conditional)
- [ ] Create `PaymentHistory.tsx` (<300 LOC)
  - [ ] Payment summary cards
  - [ ] Payment records list
  - [ ] Empty state
  - [ ] Payment CRUD handlers
- [ ] Create `ServiceLineItems.tsx` (<300 LOC)
  - [ ] Services table with all columns
  - [ ] Add service button
  - [ ] Service CRUD actions
  - [ ] Category rendering
- [ ] Create `InvoiceHistory.tsx` (<300 LOC)
  - [ ] Timeline/audit log structure
  - [ ] Event rendering
  - [ ] Empty state placeholder
- [ ] Create `InvoiceDocuments.tsx` (<300 LOC)
  - [ ] Documents list
  - [ ] Upload functionality
  - [ ] Empty state placeholder

## Main Component Refactoring
- [ ] Import all tab components
- [ ] Remove inline rendering functions
- [ ] Update tab content rendering to use components
- [ ] Maintain header structure
- [ ] Maintain tabs navigation
- [ ] Keep delete confirmation modal
- [ ] Verify prop passing to children
- [ ] Confirm main component <200 LOC

## Integration and Exports
- [ ] Create `index.ts` with proper exports
- [ ] Update parent component imports (if needed)
- [ ] Verify no broken imports

## Validation
- [ ] Verify InvoiceOverview.tsx <300 LOC
- [ ] Verify PaymentHistory.tsx <300 LOC
- [ ] Verify ServiceLineItems.tsx <300 LOC
- [ ] Verify InvoiceHistory.tsx <300 LOC
- [ ] Verify InvoiceDocuments.tsx <300 LOC
- [ ] Verify BillingDetail.tsx <200 LOC
- [ ] Test tab switching
- [ ] Test all action handlers
- [ ] Verify TypeScript types
- [ ] Check accessibility attributes
- [ ] Verify responsive design maintained

## Documentation
- [ ] Add JSDoc comments to all components
- [ ] Document prop interfaces
- [ ] Update architecture notes
- [ ] Create completion summary
