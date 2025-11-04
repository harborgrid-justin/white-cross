/**
 * @fileoverview Transaction Query and Statistics Server Actions
 * @module app/transactions/queries
 *
 * Handles transaction retrieval, filtering, and statistics with HIPAA-compliant audit logging.
 */

'use server';

import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  PaginatedResult,
  TransactionWithDetails,
  TransactionFilter,
  TransactionStatistics,
} from './transactions.types';

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
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/${transactionId}`
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: transactionId,
    });

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
    const params: Record<string, string | number | boolean> = {};
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params[key] = value.toISOString();
          } else {
            params[key] = String(value);
          }
        }
      });
    }

    const response = await apiClient.get<PaginatedResult<TransactionWithDetails>>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'inventory_transactions',
      details: JSON.stringify(filter),
    });

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
    const params: Record<string, string> = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    if (locationId) params.locationId = locationId;

    const response = await apiClient.get<TransactionStatistics>(
      `${API_ENDPOINTS.INVENTORY.ANALYTICS}/transaction-statistics`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_analytics',
      details: JSON.stringify({ startDate, endDate, locationId }),
    });

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
