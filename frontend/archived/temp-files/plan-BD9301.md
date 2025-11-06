# Refactoring Plan: BillingDetail.tsx

**Agent:** React Component Architect
**Task ID:** BD9301
**Started:** 2025-11-04

## Objective
Refactor BillingDetail.tsx (930 LOC) into a modular, maintainable component structure with tab-based architecture. Each tab component should be under 300 LOC for optimal readability and maintenance.

## Current State Analysis
- **File:** BillingDetail.tsx (930 lines)
- **Structure:** Single monolithic component with inline tab rendering
- **Tabs:** Overview, Payments, Services, History (placeholder), Documents (placeholder)
- **Dependencies:** Imports types from BillingCard.tsx

## Target Architecture

### Directory Structure
```
Billing/
├── BillingDetail/
│   ├── index.ts                    # Re-exports
│   ├── BillingDetail.tsx           # Main orchestrator (~150 LOC)
│   ├── types.ts                    # Shared types
│   ├── utils.ts                    # Utility functions
│   ├── InvoiceOverview.tsx         # Overview tab (~250 LOC)
│   ├── PaymentHistory.tsx          # Payments tab (~200 LOC)
│   ├── ServiceLineItems.tsx        # Services tab (~150 LOC)
│   ├── InvoiceHistory.tsx          # History tab (~100 LOC)
│   └── InvoiceDocuments.tsx        # Documents tab (~100 LOC)
└── BillingDetail.tsx (old - to be replaced)
```

## Refactoring Strategy

### Phase 1: Setup and Extraction (30 minutes)
1. Create `BillingDetail/` subdirectory
2. Extract types to `types.ts`:
   - `BillingDetailTab`
   - `BillingDetailProps`
   - Re-export types from BillingCard
3. Extract utilities to `utils.ts`:
   - `formatCurrency`
   - `getStatusConfig`
   - `getPaymentMethodConfig`
   - `getDaysOverdue`

### Phase 2: Tab Component Creation (90 minutes)
4. **InvoiceOverview.tsx** (~250 LOC)
   - Status and actions section
   - Amount details grid
   - Patient information
   - Important dates
   - Insurance information
   - Notes and terms

5. **PaymentHistory.tsx** (~200 LOC)
   - Payment summary cards
   - Payment history list
   - Record payment button
   - Payment CRUD actions

6. **ServiceLineItems.tsx** (~150 LOC)
   - Services table
   - Add service button
   - Service CRUD actions
   - Category badges

7. **InvoiceHistory.tsx** (~100 LOC)
   - Invoice timeline/audit log
   - Status changes
   - Payment events
   - Modification history

8. **InvoiceDocuments.tsx** (~100 LOC)
   - Related documents list
   - Upload document
   - Download/view actions

### Phase 3: Main Component Refactoring (30 minutes)
9. Refactor `BillingDetail.tsx`:
   - Remove inline tab rendering functions
   - Import and render tab components
   - Maintain header, tabs navigation, modal
   - Pass props to child components
   - Target ~150 LOC

### Phase 4: Integration and Cleanup (20 minutes)
10. Create `index.ts` for clean exports
11. Verify all components under 300 LOC
12. Test component rendering and interactions
13. Update any imports in parent components

## Component Responsibilities

### BillingDetail.tsx (Main Orchestrator)
- Tab navigation
- Header with invoice number
- Delete confirmation modal
- State management for active tab
- Prop distribution to child components

### InvoiceOverview.tsx
- Display comprehensive invoice information
- Status badge and description
- Action buttons (edit, download, print, send, record payment)
- Amount breakdown
- Patient and provider details
- Date information
- Insurance claim details
- Notes and terms

### PaymentHistory.tsx
- Payment summary metrics
- Payment records list
- Payment method icons
- Add/edit/delete payment actions
- Empty state handling

### ServiceLineItems.tsx
- Services table with all columns
- Add service functionality
- Edit/delete service actions
- Category badges
- Pricing calculations display

### InvoiceHistory.tsx
- Timeline of invoice changes
- Status transition history
- Payment events
- User actions audit trail

### InvoiceDocuments.tsx
- List of related documents
- Document upload
- Document download/view
- Document metadata

## Type Safety Strategy
- All props interfaces in `types.ts`
- Maintain full TypeScript coverage
- Export all necessary types for parent components
- Use discriminated unions where appropriate

## Performance Considerations
- Memoize child components with React.memo if needed
- Use callback memoization for handler props
- Avoid prop drilling by grouping related props
- Consider context if prop drilling becomes excessive

## Testing Strategy
- Unit tests for utility functions
- Component tests for each tab
- Integration tests for tab switching
- Accessibility tests for all interactive elements

## Deliverables
1. Modular component structure in `BillingDetail/` directory
2. All tab components under 300 LOC
3. Clean type definitions and utilities
4. Updated exports and imports
5. Maintained functionality and UI
6. Improved code maintainability and readability

## Success Criteria
- [ ] All components under 300 LOC
- [ ] Full TypeScript type safety
- [ ] No loss of functionality
- [ ] Clean component separation
- [ ] Proper prop interfaces
- [ ] Accessible components
- [ ] Clean exports via index.ts
