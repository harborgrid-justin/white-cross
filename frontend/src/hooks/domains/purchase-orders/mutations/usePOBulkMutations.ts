/**
 * Purchase Order Bulk Operations Mutation Hooks
 *
 * Provides React Query mutation hooks for bulk operations on multiple purchase orders:
 * - Bulk status updates (apply status to multiple POs)
 * - Bulk delete (delete multiple POs at once)
 * - Export purchase orders (generate reports/exports)
 *
 * Bulk operations are useful for:
 * - Administrative cleanup
 * - Mass status changes
 * - Reporting and analysis
 * - Data archival
 *
 * @module hooks/domains/purchase-orders/mutations/usePOBulkMutations
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { purchaseOrderKeys, invalidatePOQueries, PurchaseOrder } from '../config';
import { mockPurchaseOrderMutationAPI } from './api';
import { BulkUpdateStatusInput } from './types';

/**
 * Mutation hook for bulk updating purchase order status.
 *
 * Updates status for multiple purchase orders simultaneously.
 * Useful for administrative operations like:
 * - Mass cancellation of old draft POs
 * - Closing completed POs in batch
 * - Status corrections or cleanup
 *
 * Validation Rules:
 * - All POs must be eligible for the target status
 * - Invalid transitions are rejected (partial failure possible)
 * - User must have permission for the status change
 * - Each PO validated individually
 *
 * Safety Considerations:
 * - Preview affected POs before execution
 * - Require confirmation for destructive changes
 * - Log all bulk operations for audit
 * - Provide rollback mechanism if needed
 * - Limit batch size to prevent performance issues
 *
 * Common Use Cases:
 * - Close multiple completed POs at month-end
 * - Cancel draft POs older than 90 days
 * - Mass-send approved POs to vendors
 * - Administrative status corrections
 *
 * Error Handling:
 * - Partial success: Some POs updated, others failed
 * - Reports success/failure count
 * - Lists failed POs with reasons
 * - Allows retry of failures
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for bulk status updates
 *
 * @example
 * ```tsx
 * const { mutate: bulkUpdateStatus, isLoading } = useBulkUpdateStatus();
 *
 * const handleBulkClose = (selectedPoIds: string[]) => {
 *   if (confirm(`Close ${selectedPoIds.length} purchase orders?`)) {
 *     bulkUpdateStatus({
 *       poIds: selectedPoIds,
 *       status: 'CLOSED'
 *     }, {
 *       onSuccess: () => {
 *         toast.success('Purchase orders closed successfully');
 *         clearSelection();
 *       }
 *     });
 *   }
 * };
 * ```
 */
export const useBulkUpdateStatus = (
  options?: UseMutationOptions<PurchaseOrder[], Error, BulkUpdateStatusInput>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poIds, status }) => mockPurchaseOrderMutationAPI.bulkUpdateStatus(poIds, status),
    onSuccess: (_, { poIds }) => {
      poIds.forEach(poId => invalidatePOQueries(queryClient, poId));
      toast.success(`${poIds.length} purchase orders updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update purchase orders: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for bulk deleting purchase orders.
 *
 * Permanently deletes multiple purchase orders at once.
 * This is a destructive operation and should be used carefully.
 *
 * Deletion Rules:
 * - Only DRAFT or CANCELLED POs can be deleted
 * - Cannot delete POs with:
 *   - Active approvals
 *   - Vendor acknowledgment
 *   - Received items
 *   - Posted transactions
 * - Requires elevated permissions
 * - Must pass validation for each PO
 *
 * Safety Measures:
 * - Require explicit confirmation
 * - Preview deletion list
 * - Archive before delete (if configured)
 * - Log deletion in audit trail
 * - Limit batch size
 *
 * Common Use Cases:
 * - Clean up old draft POs
 * - Remove test/duplicate POs
 * - Administrative cleanup
 * - Data maintenance
 *
 * Error Handling:
 * - Partial success: Some deleted, others failed
 * - Reports success/failure count
 * - Lists POs that couldn't be deleted
 * - Provides failure reasons
 *
 * After Deletion:
 * - POs permanently removed from database
 * - Cache invalidated
 * - Audit log entry created
 * - Cannot be recovered (unless backed up)
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for bulk deletion
 *
 * @example
 * ```tsx
 * const { mutate: bulkDelete, isLoading } = useBulkDeletePurchaseOrders();
 *
 * const handleBulkDelete = (selectedPoIds: string[]) => {
 *   if (confirm(
 *     `Permanently delete ${selectedPoIds.length} purchase orders? This cannot be undone.`
 *   )) {
 *     bulkDelete(selectedPoIds, {
 *       onSuccess: () => {
 *         toast.success('Purchase orders deleted');
 *         clearSelection();
 *         refetch();
 *       },
 *       onError: (error) => {
 *         toast.error('Some POs could not be deleted');
 *       }
 *     });
 *   }
 * };
 * ```
 */
export const useBulkDeletePurchaseOrders = (
  options?: UseMutationOptions<void, Error, string[]>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.bulkDelete,
    onSuccess: (_, poIds) => {
      poIds.forEach(poId => invalidatePOQueries(queryClient, poId));
      toast.success(`${poIds.length} purchase orders deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete purchase orders: ${error.message}`);
    },
    ...options,
  });
};

/**
 * Mutation hook for exporting purchase orders.
 *
 * Generates an export file (Excel, CSV, PDF) of purchase orders
 * based on filters and parameters. Useful for:
 * - Financial reporting
 * - Data analysis
 * - Archival
 * - Integration with external systems
 * - Compliance documentation
 *
 * Export Formats:
 * - Excel (.xlsx): Full data with formatting
 * - CSV (.csv): Simple tabular data
 * - PDF (.pdf): Formatted report
 * - JSON (.json): API/integration format
 *
 * Export Options:
 * - Filter by status, date range, vendor, etc.
 * - Select specific fields to include
 * - Include or exclude line items
 * - Include or exclude receipts
 * - Aggregate or detailed view
 *
 * Export Process:
 * 1. Build query based on filters
 * 2. Generate export file server-side
 * 3. Return download URL
 * 4. Trigger browser download
 * 5. Clean up temporary files
 *
 * Large Exports:
 * - Background job for large datasets
 * - Email download link when ready
 * - Progress tracking
 * - Pagination or streaming
 *
 * @param {UseMutationOptions} [options] - React Query mutation options
 * @returns Mutation function and state for exporting purchase orders
 *
 * @example
 * ```tsx
 * const { mutate: exportPOs, isLoading } = useExportPurchaseOrders();
 *
 * const handleExport = () => {
 *   exportPOs({
 *     status: ['APPROVED', 'SENT', 'ACKNOWLEDGED'],
 *     dateFrom: '2025-01-01',
 *     dateTo: '2025-12-31',
 *     format: 'xlsx',
 *     includeLineItems: true
 *   }, {
 *     onSuccess: () => {
 *       toast.success('Export downloaded successfully');
 *     }
 *   });
 * };
 * ```
 */
export const useExportPurchaseOrders = (
  options?: UseMutationOptions<{ downloadUrl: string }, Error, any>
) => {
  return useMutation({
    mutationFn: mockPurchaseOrderMutationAPI.exportPurchaseOrders,
    onSuccess: (result) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = 'purchase-orders-export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Purchase Orders export completed');
    },
    onError: (error: Error) => {
      toast.error(`Failed to export purchase orders: ${error.message}`);
    },
    ...options,
  });
};
