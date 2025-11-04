/**
 * @fileoverview Alert acknowledgment and dismissal operations
 * @module app/alerts/acknowledgment
 *
 * Handles acknowledging and dismissing inventory alerts
 * with HIPAA-compliant audit logging and cache invalidation.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type { ActionResult } from './alerts.types';

/**
 * Acknowledge alert with audit logging
 */
export async function acknowledgeAlert(
  alertId: string,
  userId: string,
  actionTaken?: string
): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/acknowledge`, {
      userId,
      actionTaken,
    });

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_alert',
      resourceId: alertId,
      details: JSON.stringify({ actionTaken }),
    });

    revalidateTag('inventory-alerts', 'default');
    revalidateTag('low-stock-alerts', 'default');
    revalidatePath('/inventory/alerts');

    return {
      success: true,
      message: 'Alert acknowledged successfully',
    };
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
    };
  }
}

/**
 * Dismiss alert with audit logging
 */
export async function dismissAlert(
  alertId: string,
  userId: string
): Promise<ActionResult<void>> {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVENTORY.ALERTS}/${alertId}/dismiss`);

    await auditLogWithContext({
      userId,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'inventory_alert',
      resourceId: alertId,
    });

    revalidateTag('inventory-alerts', 'default');
    revalidateTag('expiration-alerts', 'default');
    revalidatePath('/inventory/alerts');

    return {
      success: true,
      message: 'Alert dismissed successfully',
    };
  } catch (error) {
    console.error('Failed to dismiss alert:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to dismiss alert',
    };
  }
}
