/**
 * @fileoverview Stock reorder and transfer recommendations
 * @module app/alerts/recommendations
 *
 * Handles retrieval of reorder recommendations and stock transfer
 * suggestions with HIPAA-compliant audit logging.
 */

'use server';

import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  BulkReorderRecommendations,
  StockTransferRecommendation,
} from './alerts.types';

/**
 * Get reorder recommendations with audit logging
 */
export async function getReorderRecommendations(
  locationId?: string
): Promise<ActionResult<BulkReorderRecommendations>> {
  try {
    const params = locationId ? { locationId } : undefined;
    const data = await serverGet<BulkReorderRecommendations>(
      API_ENDPOINTS.INVENTORY.REORDER,
      params
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_recommendations',
      details: JSON.stringify({ locationId }),
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch reorder recommendations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reorder recommendations',
    };
  }
}

/**
 * Get stock transfer recommendations
 */
export async function getTransferRecommendations(): Promise<
  ActionResult<StockTransferRecommendation[]>
> {
  try {
    const data = await serverGet<StockTransferRecommendation[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-recommendations`
    );

    await auditLogWithContext({
      userId: 'system',
      action: AUDIT_ACTIONS.GENERATE_REPORT,
      resource: 'inventory_recommendations',
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch transfer recommendations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transfer recommendations',
    };
  }
}
