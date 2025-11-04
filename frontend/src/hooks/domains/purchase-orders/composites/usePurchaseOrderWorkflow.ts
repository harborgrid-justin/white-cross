/**
 * Purchase Order Workflow Hook
 *
 * Comprehensive hook that fetches complete PO data and provides workflow capabilities.
 *
 * @module hooks/domains/purchase-orders/composites/usePurchaseOrderWorkflow
 */

import {
  usePurchaseOrderDetails,
  useLineItems,
  useReceipts,
  usePOAnalytics,
} from '../queries/usePurchaseOrderQueries';
import { PurchaseOrderWorkflowData } from './types';

/**
 * Comprehensive purchase order workflow hook.
 *
 * Fetches complete PO data (order, line items, receipts, analytics) and provides
 * business logic for determining what actions are available based on current state.
 *
 * Workflow State Rules:
 * - **canEdit**: DRAFT or PENDING_APPROVAL (before approval/sending)
 * - **canApprove**: PENDING_APPROVAL (submitted for approval)
 * - **canReceive**: ACKNOWLEDGED or PARTIALLY_RECEIVED (vendor confirmed, awaiting items)
 * - **canCancel**: Any state except RECEIVED, CLOSED, or CANCELLED
 *
 * @param {string} purchaseOrderId - Purchase order ID to fetch
 * @param {object} [options] - Configuration options
 * @param {boolean} [options.includeAnalytics] - Whether to fetch analytics data
 * @param {boolean} [options.enableRealTimeUpdates] - Enable 30s auto-refresh
 * @returns {PurchaseOrderWorkflowData} Complete workflow data and capabilities
 *
 * @example
 * ```tsx
 * const {
 *   purchaseOrder,
 *   lineItems,
 *   receipts,
 *   canEdit,
 *   canApprove,
 *   canReceive,
 *   isLoading
 * } = usePurchaseOrderWorkflow(poId, { includeAnalytics: true });
 *
 * return (
 *   <div>
 *     <POHeader purchaseOrder={purchaseOrder} />
 *     <LineItemsTable items={lineItems} editable={canEdit} />
 *     {canApprove && <ApprovalSection poId={poId} />}
 *     {canReceive && <ReceivingSection poId={poId} receipts={receipts} />}
 *   </div>
 * );
 * ```
 */
export const usePurchaseOrderWorkflow = (
  purchaseOrderId: string,
  options?: {
    includeAnalytics?: boolean;
    enableRealTimeUpdates?: boolean;
  }
): PurchaseOrderWorkflowData => {
  const {
    data: purchaseOrder,
    isLoading: poLoading,
    error: poError,
  } = usePurchaseOrderDetails(purchaseOrderId, {
    refetchInterval: options?.enableRealTimeUpdates ? 30000 : undefined,
  } as any);

  const {
    data: lineItems,
    isLoading: lineItemsLoading,
    error: lineItemsError,
  } = useLineItems(purchaseOrderId, {
    enabled: !!purchaseOrderId,
  } as any);

  const {
    data: receipts,
    isLoading: receiptsLoading,
    error: receiptsError,
  } = useReceipts(purchaseOrderId, {
    enabled: !!purchaseOrderId,
  } as any);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = usePOAnalytics(
    { poId: purchaseOrderId },
    {
      enabled: !!purchaseOrderId && options?.includeAnalytics,
    } as any
  );

  const isLoading = poLoading || lineItemsLoading || receiptsLoading || (options?.includeAnalytics && analyticsLoading);
  const error = poError || lineItemsError || receiptsError || (options?.includeAnalytics && analyticsError);

  // Business logic for determining capabilities
  const canEdit = purchaseOrder?.status === 'DRAFT' || purchaseOrder?.status === 'PENDING_APPROVAL';
  const canApprove = purchaseOrder?.status === 'PENDING_APPROVAL';
  const canReceive = purchaseOrder?.status === 'ACKNOWLEDGED' || purchaseOrder?.status === 'PARTIALLY_RECEIVED';
  const canCancel = purchaseOrder?.status !== 'RECEIVED' &&
                   purchaseOrder?.status !== 'CLOSED' &&
                   purchaseOrder?.status !== 'CANCELLED';

  return {
    purchaseOrder,
    lineItems,
    receipts,
    analytics,
    isLoading,
    error,
    canEdit,
    canApprove,
    canReceive,
    canCancel,
  };
};
