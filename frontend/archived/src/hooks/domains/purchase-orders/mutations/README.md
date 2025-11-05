# Purchase Order Mutations - Module Structure

This directory contains React Query mutation hooks for all purchase order state changes and actions. The code has been refactored from a single 737-line file into smaller, more maintainable modules organized by functionality.

## Module Organization

### Core Files

#### `types.ts` (166 lines)
Type definitions and interfaces for all purchase order mutations.
- Input types for create, update, approve, reject operations
- Receipt and line item types
- Bulk operation types

#### `api.ts` (130 lines)
Mock API functions for all mutation operations.
- Replace with actual API client implementation in production
- Consistent async/await patterns
- Realistic delays for development

### Mutation Hook Modules

#### `usePOCRUDMutations.ts` (235 lines)
Basic CRUD operations on purchase orders.
- `useCreatePurchaseOrder` - Create new PO in DRAFT status
- `useUpdatePurchaseOrder` - Update existing PO (DRAFT only)
- `useDeletePurchaseOrder` - Delete PO (DRAFT only)
- `useDuplicatePurchaseOrder` - Copy existing PO as new draft

#### `usePOItemMutations.ts` (198 lines)
Line item management within purchase orders.
- `useAddLineItem` - Add product line to PO
- `useUpdateLineItem` - Modify line item quantity, price, etc.
- `useRemoveLineItem` - Remove line item from PO

#### `usePOApprovalMutations.ts` (279 lines)
Approval workflow and state transitions.
- `useSubmitForApproval` - Submit DRAFT → PENDING_APPROVAL
- `useApprovePurchaseOrder` - Approve at specified level
- `useRejectPurchaseOrder` - Reject with reason
- `useCancelPurchaseOrder` - Cancel from any state

#### `usePOReceivingMutations.ts` (184 lines)
Receipt operations when items are received.
- `useCreateReceipt` - Record receiving transaction
- `useUpdateReceipt` - Update receipt for corrections

#### `usePOStatusMutations.ts` (246 lines)
Status transition operations.
- `useSendPurchaseOrder` - Send APPROVED → SENT
- `useAcknowledgePurchaseOrder` - Vendor acknowledgment SENT → ACKNOWLEDGED
- `useClosePurchaseOrder` - Final closure RECEIVED → CLOSED

#### `usePOBulkMutations.ts` (262 lines)
Bulk operations on multiple purchase orders.
- `useBulkUpdateStatus` - Update status for multiple POs
- `useBulkDeletePurchaseOrders` - Delete multiple POs
- `useExportPurchaseOrders` - Generate export file

### Main Export

#### `index.ts` (154 lines)
Central export point for backward compatibility.
- Re-exports all hooks
- Re-exports all types
- Exports combined `purchaseOrderMutations` object
- Maintains existing import paths

## Purchase Order State Machine

```
DRAFT → (submit) → PENDING_APPROVAL
  ↓                      ↓              ↓
(cancel)           (approve)      (reject)
  ↓                      ↓              ↓
CANCELLED              APPROVED      REJECTED
                         ↓
                     (send)
                         ↓
                       SENT
                         ↓
                   (acknowledge)
                         ↓
                   ACKNOWLEDGED
                         ↓
                    (receive)
                         ↓
             PARTIALLY_RECEIVED / RECEIVED
                         ↓
                      (close)
                         ↓
                      CLOSED
```

## Usage Examples

### Individual Imports (Recommended)

```tsx
import {
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useSubmitForApproval
} from '@/hooks/domains/purchase-orders/mutations';

function CreatePOPage() {
  const { mutate: createPO, isLoading } = useCreatePurchaseOrder();

  const handleSubmit = (formData) => {
    createPO(formData, {
      onSuccess: (newPO) => {
        navigate(`/purchase-orders/${newPO.id}`);
      }
    });
  };

  // ...
}
```

### Grouped Imports

```tsx
import {
  useAddLineItem,
  useUpdateLineItem,
  useRemoveLineItem
} from '@/hooks/domains/purchase-orders/mutations';

function POLineItemsSection({ poId }) {
  const { mutate: addItem } = useAddLineItem();
  const { mutate: updateItem } = useUpdateLineItem();
  const { mutate: removeItem } = useRemoveLineItem();

  // Line item management logic
}
```

### Type Imports

```tsx
import {
  CreatePurchaseOrderInput,
  ApprovePurchaseOrderInput
} from '@/hooks/domains/purchase-orders/mutations';

// Use types for form validation, prop types, etc.
```

## Migration from Original File

The original `usePurchaseOrderMutations.ts` file has been split into multiple modules. All exports remain the same, so **no code changes are required** in consuming components.

### Before (Still Works)
```tsx
import { useCreatePurchaseOrder } from '@/hooks/domains/purchase-orders/mutations/usePurchaseOrderMutations';
```

### After (Preferred)
```tsx
import { useCreatePurchaseOrder } from '@/hooks/domains/purchase-orders/mutations';
```

Both import paths work due to the `index.ts` re-exports.

## File Size Comparison

| File | Lines of Code | Purpose |
|------|---------------|---------|
| **Original** | 737 | Single file with all mutations |
| **New Structure** | | |
| types.ts | 166 | Type definitions |
| api.ts | 130 | Mock API functions |
| usePOCRUDMutations.ts | 235 | CRUD operations |
| usePOItemMutations.ts | 198 | Line item management |
| usePOApprovalMutations.ts | 279 | Approval workflow |
| usePOReceivingMutations.ts | 184 | Receipt operations |
| usePOStatusMutations.ts | 246 | Status changes |
| usePOBulkMutations.ts | 262 | Bulk operations |
| index.ts | 154 | Re-exports |
| **Total** | **1,854** | More lines but better organized |

The total line count increased due to:
- More detailed documentation in each file
- Module headers and imports
- Better separation of concerns
- More comprehensive JSDoc comments

## Benefits of Refactoring

### Maintainability
- Smaller files are easier to understand and modify
- Clear separation of concerns
- Each file focuses on a specific domain

### Discoverability
- Logical grouping makes it easier to find specific hooks
- File names clearly indicate contents
- Easier to navigate in IDE

### Code Review
- Smaller diffs when making changes
- Easier to review changes in specific domains
- Less merge conflict potential

### Testing
- Can test each module independently
- Mock dependencies more easily
- Better test organization

### Performance
- Tree-shaking benefits from smaller modules
- Can lazy-load specific mutation groups if needed
- Better code splitting potential

## Best Practices

1. **Import only what you need** - Import specific hooks rather than the entire module
2. **Use TypeScript types** - Leverage the exported types for better type safety
3. **Follow the state machine** - Respect the PO status transitions
4. **Handle errors** - Use onError callbacks for proper error handling
5. **Cache invalidation** - Mutations automatically handle this, but be aware of the pattern

## Future Improvements

Potential enhancements to consider:
- Replace mock API with real API client
- Add optimistic updates for better UX
- Implement retry logic for failed mutations
- Add mutation middleware for logging/analytics
- Create custom error types for better error handling
- Add mutation state persistence for draft POs
