/**
 * @fileoverview Physical Count Operations Server Actions
 * @module app/transactions/counts
 *
 * Handles physical count operations with variance tracking and HIPAA-compliant audit logging.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  PhysicalCount,
} from './transactions.types';

// ==========================================
// PHYSICAL COUNT OPERATIONS
// ==========================================

/**
 * Physical count operations with variance tracking
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
    }>(
      `${API_ENDPOINTS.INVENTORY.BASE}/physical-count`,
      data
    );

    await auditLogWithContext({
      userId: data.countedBy,
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'physical_count',
      details: JSON.stringify({
        locationId: data.locationId,
        itemsAdjusted: response.data.itemsAdjusted,
        totalVariance: response.data.totalVariance,
        countDate: data.countedAt
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag('inventory-transactions', 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
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
): Promise<ActionResult<unknown[]>> {
  try {
    const params: Record<string, string> = {};
    if (locationId) params.locationId = locationId;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const response = await apiClient.get<unknown[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/physical-count/history`,
      { params }
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'physical_count_history',
      details: JSON.stringify({ locationId, startDate, endDate }),
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch physical count history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch physical count history',
    };
  }
}
