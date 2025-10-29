/**
 * @fileoverview Server Actions for Inventory Transactions
 * @module actions/transactions
 *
 * Next.js Server Actions for stock movements, transfers, and transaction management.
 * HIPAA-compliant with comprehensive audit logging for controlled substances.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Transaction,
  TransactionWithDetails,
  TransactionFilter,
  ReceiveStock,
  IssueStock,
  AdjustStock,
  ReserveStock,
  ReleaseReservedStock,
  TransferOrder,
  CreateTransferOrder,
  ApproveTransferOrder,
  SendTransferOrder,
  ReceiveTransferOrder,
  CancelTransferOrder,
  TransferOrderWithDetails,
  TransferOrderFilter,
  PhysicalCount,
  TransactionStatistics,
} from '@/schemas/transaction.schemas';
import type { ActionResult, PaginatedResult } from './inventory.actions';

// ==========================================
// STOCK RECEIPT OPERATIONS
// ==========================================

/**
 * Receive stock into inventory
 */
export async function receiveStock(data: ReceiveStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/receive`,
      data
    );

    revalidateTag('inventory-transactions');
    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock received successfully',
    };
  } catch (error) {
    console.error('Failed to receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to receive stock',
    };
  }
}

/**
 * Bulk receive multiple items (e.g., from purchase order)
 */
export async function bulkReceiveStock(
  items: ReceiveStock[]
): Promise<ActionResult<Transaction[]>> {
  try {
    const response = await apiClient.post<Transaction[]>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/receive/bulk`,
      { items }
    );

    revalidateTag('inventory-transactions');
    revalidateTag('inventory-stock');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: `Successfully received ${items.length} items`,
    };
  } catch (error) {
    console.error('Failed to bulk receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk receive stock',
    };
  }
}

// ==========================================
// STOCK ISSUE OPERATIONS
// ==========================================

/**
 * Issue stock from inventory
 */
export async function issueStock(data: IssueStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/issue`,
      data
    );

    revalidateTag('inventory-transactions');
    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    // If controlled substance, revalidate audit trail
    revalidateTag('controlled-substance-audit');

    return {
      success: true,
      data: response.data,
      message: 'Stock issued successfully',
    };
  } catch (error) {
    console.error('Failed to issue stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to issue stock',
    };
  }
}

// ==========================================
// STOCK ADJUSTMENT OPERATIONS
// ==========================================

/**
 * Adjust stock level (manual correction)
 */
export async function adjustStock(data: AdjustStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/adjust`,
      data
    );

    revalidateTag('inventory-transactions');
    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock adjusted successfully',
    };
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to adjust stock',
    };
  }
}

// ==========================================
// STOCK RESERVATION OPERATIONS
// ==========================================

/**
 * Reserve stock for future use
 */
export async function reserveStock(data: ReserveStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/reserve`,
      data
    );

    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Stock reserved successfully',
    };
  } catch (error) {
    console.error('Failed to reserve stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reserve stock',
    };
  }
}

/**
 * Release reserved stock
 */
export async function releaseReservedStock(
  data: ReleaseReservedStock
): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/release`,
      data
    );

    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Reserved stock released successfully',
    };
  } catch (error) {
    console.error('Failed to release stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to release stock',
    };
  }
}

// ==========================================
// TRANSACTION QUERY OPERATIONS
// ==========================================

/**
 * Get transaction by ID
 */
export async function getTransaction(
  transactionId: string
): Promise<ActionResult<TransactionWithDetails>> {
  try {
    const response = await apiClient.get<TransactionWithDetails>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/${transactionId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transaction',
    };
  }
}

/**
 * Get transactions with filtering and pagination
 */
export async function getTransactions(
  filter?: TransactionFilter
): Promise<ActionResult<PaginatedResult<TransactionWithDetails>>> {
  try {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await apiClient.get<PaginatedResult<TransactionWithDetails>>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
}

/**
 * Get transaction statistics for reporting
 */
export async function getTransactionStatistics(
  startDate: Date,
  endDate: Date,
  locationId?: string
): Promise<ActionResult<TransactionStatistics>> {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    if (locationId) {
      params.append('locationId', locationId);
    }

    const response = await apiClient.get<TransactionStatistics>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/statistics?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transaction statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics',
    };
  }
}

// ==========================================
// TRANSFER ORDER OPERATIONS
// ==========================================

/**
 * Create new transfer order
 */
export async function createTransferOrder(
  data: CreateTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      API_ENDPOINTS.INVENTORY.TRANSFERS,
      data
    );

    revalidateTag('transfer-orders');
    revalidatePath('/inventory/stock/transfer');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order created successfully',
    };
  } catch (error) {
    console.error('Failed to create transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transfer order',
    };
  }
}

/**
 * Get transfer order by ID
 */
export async function getTransferOrder(
  transferOrderId: string
): Promise<ActionResult<TransferOrderWithDetails>> {
  try {
    const response = await apiClient.get<TransferOrderWithDetails>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}/${transferOrderId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transfer order',
    };
  }
}

/**
 * Get transfer orders with filtering
 */
export async function getTransferOrders(
  filter?: TransferOrderFilter
): Promise<ActionResult<PaginatedResult<TransferOrderWithDetails>>> {
  try {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await apiClient.get<PaginatedResult<TransferOrderWithDetails>>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch transfer orders:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transfer orders',
    };
  }
}

/**
 * Approve transfer order
 */
export async function approveTransferOrder(
  data: ApproveTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}/${data.transferOrderId}/approve`,
      data
    );

    revalidateTag('transfer-orders');
    revalidateTag(`transfer-order-${data.transferOrderId}`);
    revalidatePath('/inventory/stock/transfer');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order approved successfully',
    };
  } catch (error) {
    console.error('Failed to approve transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve transfer order',
    };
  }
}

/**
 * Mark transfer order as sent
 */
export async function sendTransferOrder(
  data: SendTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}/${data.transferOrderId}/send`,
      data
    );

    revalidateTag('transfer-orders');
    revalidateTag(`transfer-order-${data.transferOrderId}`);
    revalidatePath('/inventory/stock/transfer');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order marked as sent',
    };
  } catch (error) {
    console.error('Failed to send transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send transfer order',
    };
  }
}

/**
 * Receive transfer order
 */
export async function receiveTransferOrder(
  data: ReceiveTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}/${data.transferOrderId}/receive`,
      data
    );

    revalidateTag('transfer-orders');
    revalidateTag(`transfer-order-${data.transferOrderId}`);
    revalidateTag('inventory-stock');
    revalidateTag('inventory-transactions');
    revalidatePath('/inventory/stock/transfer');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order received successfully',
    };
  } catch (error) {
    console.error('Failed to receive transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to receive transfer order',
    };
  }
}

/**
 * Cancel transfer order
 */
export async function cancelTransferOrder(
  data: CancelTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const response = await apiClient.post<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.TRANSFERS}/${data.transferOrderId}/cancel`,
      data
    );

    revalidateTag('transfer-orders');
    revalidateTag(`transfer-order-${data.transferOrderId}`);
    revalidatePath('/inventory/stock/transfer');

    return {
      success: true,
      data: response.data,
      message: 'Transfer order cancelled successfully',
    };
  } catch (error) {
    console.error('Failed to cancel transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel transfer order',
    };
  }
}

// ==========================================
// PHYSICAL COUNT OPERATIONS
// ==========================================

/**
 * Perform physical count and adjust stock levels
 */
export async function performPhysicalCount(
  data: PhysicalCount
): Promise<
  ActionResult<{
    transactionsCreated: number;
    itemsAdjusted: number;
    totalVariance: number;
  }>
> {
  try {
    const response = await apiClient.post<{
      transactionsCreated: number;
      itemsAdjusted: number;
      totalVariance: number;
    }>(`${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/physical-count`, data);

    revalidateTag('inventory-stock');
    revalidateTag('inventory-transactions');
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/counts');

    return {
      success: true,
      data: response.data,
      message: `Physical count completed: ${response.data.itemsAdjusted} items adjusted`,
    };
  } catch (error) {
    console.error('Failed to perform physical count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to perform physical count',
    };
  }
}

/**
 * Get physical count history
 */
export async function getPhysicalCountHistory(
  locationId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<ActionResult<any[]>> {
  try {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());

    const response = await apiClient.get<any[]>(
      `${API_ENDPOINTS.INVENTORY.TRANSACTIONS}/physical-count/history?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch physical count history:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch physical count history',
    };
  }
}
