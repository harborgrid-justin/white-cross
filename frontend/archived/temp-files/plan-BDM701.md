# Budget Mutations Breakdown Plan - BDM701

## Task Overview
Break down the large useBudgetMutations.ts file (989 lines) into smaller, maintainable modules (max 300 LOC each).

## Referenced Work
- Related agent task: `.temp/task-status-HRB001.json` (health records breakdown)

## File Breakdown Strategy

### 1. useBudgetCRUDMutations.ts (~150 LOC)
**Lines 128-422 from original**
- `useCreateBudget()` - Create new budget
- `useUpdateBudget()` - Update budget properties
- `useDeleteBudget()` - Delete budget
- `useApproveBudget()` - Approve budget workflow

### 2. useBudgetCategoryMutations.ts (~125 LOC)
**Lines 446-552 from original**
- `useCreateBudgetCategory()` - Create category
- `useUpdateBudgetCategory()` - Update category
- `useDeleteBudgetCategory()` - Delete category

### 3. useBudgetTransactionMutations.ts (~145 LOC)
**Lines 580-690 from original**
- `useCreateBudgetTransaction()` - Create transaction
- `useUpdateBudgetTransaction()` - Update transaction
- `useDeleteBudgetTransaction()` - Delete transaction

### 4. useBudgetApprovalMutations.ts (~125 LOC)
**Lines 714-788 from original**
- `useApproveTransaction()` - Approve pending transaction
- `useRejectTransaction()` - Reject transaction with reason

### 5. useBudgetReportMutations.ts (~115 LOC)
**Lines 816-878 from original**
- `useGenerateBudgetReport()` - Generate budget report
- `useDeleteBudgetReport()` - Delete report

### 6. useBudgetBulkMutations.ts (~130 LOC)
**Lines 903-989 from original**
- `useBulkDeleteBudgets()` - Bulk delete budgets
- `useBulkApproveTransactions()` - Bulk approve transactions

### 7. index.ts (~50 LOC)
- Re-export all hooks for backward compatibility
- Preserve original module API

## Implementation Phases

### Phase 1: CRUD Operations (ws-2)
Create useBudgetCRUDMutations.ts with budget CRUD hooks

### Phase 2: Category Operations (ws-3)
Create useBudgetCategoryMutations.ts with category hooks

### Phase 3: Transaction Operations (ws-4)
Create useBudgetTransactionMutations.ts with transaction hooks

### Phase 4: Approval Operations (ws-5)
Create useBudgetApprovalMutations.ts with approval/rejection hooks

### Phase 5: Report Operations (ws-6)
Create useBudgetReportMutations.ts with report hooks

### Phase 6: Bulk Operations (ws-7)
Create useBudgetBulkMutations.ts with bulk operation hooks

### Phase 7: Index Creation (ws-8)
Create index.ts with all re-exports

### Phase 8: Cleanup (ws-9)
Remove original useBudgetMutations.ts file

## Quality Standards
- Each file < 300 LOC
- Maintain all JSDoc documentation
- Preserve mutation patterns
- Ensure proper imports/exports
- Maintain type safety
- Keep cache invalidation logic intact
- Preserve toast notifications

## Timeline
Estimated completion: 30-45 minutes
