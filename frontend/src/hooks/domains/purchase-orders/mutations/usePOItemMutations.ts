/**
 * Purchase Order Line Item Mutation Hooks
 *
 * Provides React Query mutation hooks for managing line items within purchase orders:
 * - Add new line items to a PO
 * - Update existing line items (quantity, price, etc.)
 * - Remove line items from a PO
 *
 * Line item operations are only allowed when the PO is in DRAFT status.
 * All mutations automatically update both the line items cache and the parent PO cache.
 *
 * @module hooks/domains/purchase-orders/mutations/usePOItemMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, POLineItem } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import { AddLineItemInput, UpdateLineItemInput, RemoveLineItemInput } from './types';

/**
 * Mutation hook for adding a new line item to a purchase order.
 *
 * Adds a new product line to an existing purchase order. The PO must be in DRAFT status.
 * Each line item represents a product/service being ordered with:
 * - Product reference (SKU, ID, or description)
 * - Quantity and unit of measure
 * - Unit price and extended amount
 * - Optional notes or specifications
 *
 * The PO total is automatically recalculated after adding a line item.
 *
 * Business Rules:
 * - PO must be in DRAFT status
 * - Quantity must be greater than zero
 * - Unit price must be non-negative
 * - Product must be from the selected vendor's catalog (if applicable)
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for adding line items
 *
 * @example
 * ```tsx
 * const { mutate: addItem, isLoading } = useAddLineItem();
 *
 * const handleAddItem = (formData) => {
 *   addItem({
 *     poId: 'po-123',
 *     lineItem: {
 *       productId: 'prod-456',
 *       description: 'Office Chair - Ergonomic',
 *       quantity: 10,
 *       unitOfMeasure: 'EA',
 *       unitPrice: 299.99,
 *       notes: 'Black color preferred'
 *     }
 *   }, {
 *     onSuccess: () => {
 *       resetForm();
 *     }
 *   });
 * };
 * ```
 */
export const useAddLineItem = (
  options?: UseMutationOptions<POLineItem, Error, AddLineItemInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poId, lineItem }) => mockPurchaseOrderMutationAPI.addLineItem(poId, lineItem),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add line item: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for updating an existing line item.
 *
 * Updates an existing line item in a purchase order. The PO must be in DRAFT status.
 * Common updates include:
 * - Quantity adjustments
 * - Price negotiations
 * - Product substitutions
 * - Specification changes
 * - Notes or requirements
 *
 * The PO total is automatically recalculated after updating a line item.
 *
 * Business Rules:
 * - PO must be in DRAFT status
 * - Cannot reduce quantity below already-received amount (if any)
 * - Price changes may require approval workflow
 * - Significant changes may require re-approval
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for updating line items
 *
 * @example
 * ```tsx
 * const { mutate: updateItem, isLoading } = useUpdateLineItem();
 *
 * const handleQuantityChange = (lineItemId: string, newQuantity: number) => {
 *   updateItem({
 *     id: lineItemId,
 *     poId: 'po-123',
 *     updates: {
 *       quantity: newQuantity,
 *       notes: 'Quantity updated per revised requirements'
 *     }
 *   }, {
 *     onSuccess: () => {
 *       toast.success('Quantity updated');
 *     }
 *   });
 * };
 * ```
 */
export const useUpdateLineItem = (
  options?: UseMutationOptions<POLineItem, Error, UpdateLineItemInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => mockPurchaseOrderMutationAPI.updateLineItem(id, updates),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update line item: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for removing a line item from a purchase order.
 *
 * Removes a line item from a purchase order. The PO must be in DRAFT status.
 * This is a destructive operation - the line item is permanently deleted.
 *
 * The PO total is automatically recalculated after removing a line item.
 * A PO must have at least one line item - cannot remove the last item.
 *
 * Business Rules:
 * - PO must be in DRAFT status
 * - Cannot remove line items with partial receipts
 * - PO must have at least one remaining line item
 * - Removal may trigger budget reallocation
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for removing line items
 *
 * @example
 * ```tsx
 * const { mutate: removeItem, isLoading } = useRemoveLineItem();
 *
 * const handleRemove = (lineItemId: string) => {
 *   if (confirm('Remove this item from the order?')) {
 *     removeItem({
 *       id: lineItemId,
 *       poId: 'po-123'
 *     }, {
 *       onSuccess: () => {
 *         // Item removed, list will update automatically
 *       }
 *     });
 *   }
 * };
 * ```
 */
export const useRemoveLineItem = (
  options?: UseMutationOptions<void, Error, RemoveLineItemInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => mockPurchaseOrderMutationAPI.removeLineItem(id),
    onSuccess: (_, { poId }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
      toast.success('Line item removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove line item: ${error.message}`);
    },
    ...options,
  });
};
