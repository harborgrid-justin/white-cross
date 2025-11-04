/**
 * Purchase Order CRUD Mutation Hooks
 *
 * Provides React Query mutation hooks for basic CRUD operations on purchase orders:
 * - Create new purchase orders
 * - Update existing purchase orders
 * - Delete purchase orders
 * - Duplicate purchase orders
 *
 * All mutations automatically invalidate relevant React Query caches
 * and show toast notifications on success/error.
 *
 * @module hooks/domains/purchase-orders/mutations/usePOCRUDMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, invalidatePOQueries, PurchaseOrder } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from './types';

/**
 * Mutation hook for creating a new purchase order.
 *
 * Creates a new purchase order in DRAFT status. The PO must include:
 * - Vendor information
 * - At least one line item
 * - Delivery and billing addresses
 * - Payment and delivery terms
 *
 * After creation, the PO can be edited, submitted for approval, or cancelled.
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for creating purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: createPO, isLoading } = useCreatePurchaseOrder();
 *
 * const handleCreate = (formData) => {
 *   createPO({
 *     title: 'Office Supplies Q1 2025',
 *     vendorId: 'vendor-123',
 *     requestedDeliveryDate: '2025-03-15',
 *     lineItems: [
 *       { productId: 'prod-1', quantity: 100, unitPrice: 10.50 }
 *     ],
 *     paymentTerms: 'Net 30',
 *     deliveryTerms: 'FOB',
 *     shippingAddress: { ... },
 *     billingAddress: { ... }
 *   }, {
 *     onSuccess: (newPO) => {
 *       navigate(`/purchase-orders/${newPO.id}`);
 *     }
 *   });
 * };
 * ```
 */
export const useCreatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, CreatePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.createPurchaseOrder,
    onSuccess: (newPO) => {
      // Invalidate and refetch purchase orders list
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order ${newPO.poNumber || newPO.id} created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create purchase order: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for updating an existing purchase order.
 *
 * Updates purchase order fields. Only allowed in DRAFT status.
 * Once submitted for approval or approved, the PO becomes read-only
 * (except for workflow transitions).
 *
 * Updates can include:
 * - Metadata (title, description, notes)
 * - Vendor information
 * - Dates and terms
 * - Addresses
 * - Budget/project codes
 *
 * Line items should be updated via dedicated line item hooks.
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for updating purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: updatePO, isLoading } = useUpdatePurchaseOrder();
 *
 * const handleUpdate = () => {
 *   updatePO({
 *     id: 'po-123',
 *     title: 'Updated Title',
 *     requestedDeliveryDate: '2025-04-01',
 *     notes: 'Rush order - expedited shipping'
 *   }, {
 *     onSuccess: () => {
 *       toast.success('Changes saved');
 *     }
 *   });
 * };
 * ```
 */
export const useUpdatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, UpdatePurchaseOrderInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.updatePurchaseOrder,
    onSuccess: (updatedPO) => {
      // Update the specific PO in cache
      queryClient.setQueryData(
        purchaseOrderKeys.purchaseOrderDetails(updatedPO.id),
        updatedPO
      );
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase order: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for deleting a purchase order.
 *
 * Permanently deletes a purchase order. Only allowed in DRAFT status.
 * Cannot delete purchase orders that have been:
 * - Submitted for approval
 * - Approved
 * - Sent to vendor
 * - Partially or fully received
 *
 * This is a destructive operation and should require user confirmation.
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for deleting purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: deletePO, isLoading } = useDeletePurchaseOrder();
 *
 * const handleDelete = (poId: string) => {
 *   if (confirm('Are you sure? This cannot be undone.')) {
 *     deletePO(poId, {
 *       onSuccess: () => {
 *         navigate('/purchase-orders');
 *       }
 *     });
 *   }
 * };
 * ```
 */
export const useDeletePurchaseOrder = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.deletePurchaseOrder,
    onSuccess: (_, poId) => {
      invalidatePOQueries(queryClient, poId);
      toast.success('Purchase Order deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase order: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for duplicating a purchase order.
 *
 * Creates a copy of an existing purchase order in DRAFT status.
 * All line items, addresses, terms, and notes are copied.
 * The new PO gets a new PO number and creation timestamp.
 *
 * Useful for:
 * - Reordering from same vendor
 * - Creating similar POs with minor variations
 * - Templates for recurring orders
 *
 * After duplication, the new PO can be edited before submission.
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for duplicating purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: duplicatePO, isLoading } = useDuplicatePurchaseOrder();
 *
 * const handleDuplicate = (poId: string) => {
 *   duplicatePO(poId, {
 *     onSuccess: (newPO) => {
 *       navigate(`/purchase-orders/${newPO.id}/edit`);
 *       toast.success('PO duplicated - review and submit');
 *     }
 *   });
 * };
 * ```
 */
export const useDuplicatePurchaseOrder = (
  options?: UseMutationOptions<PurchaseOrder, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.duplicatePurchaseOrder,
    onSuccess: (duplicatedPO) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success(`Purchase Order duplicated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to duplicate purchase order: ${error.message}`);
    },
    ...options,
  });
};
