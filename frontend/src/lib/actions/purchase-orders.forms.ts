/**
 * @fileoverview Purchase Order Form Handling
 * @module lib/actions/purchase-orders.forms
 *
 * Form data handling functions for purchase orders to support form-based UI integration.
 */

'use server';

import { revalidatePath } from 'next/cache';
import type {
  PurchaseOrder,
  PurchaseOrderItem,
  CreatePurchaseOrderData,
  ActionResult
} from './purchase-orders.types';
import { createPurchaseOrderAction } from './purchase-orders.crud';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create purchase order from form data
 * Form-friendly wrapper for createPurchaseOrderAction
 */
export async function createPurchaseOrderFromForm(formData: FormData): Promise<ActionResult<PurchaseOrder>> {
  // Parse items from form data (assuming JSON string)
  const itemsJson = formData.get('items') as string;
  let items: Omit<PurchaseOrderItem, 'id' | 'purchaseOrderId' | 'receivedQuantity' | 'status' | 'createdAt' | 'updatedAt'>[] = [];

  try {
    items = JSON.parse(itemsJson || '[]');
  } catch {
    return {
      success: false,
      error: 'Invalid items data'
    };
  }

  const attachmentsJson = formData.get('attachments') as string;
  let attachments: string[] = [];

  try {
    attachments = JSON.parse(attachmentsJson || '[]');
  } catch {
    // Ignore attachment parsing errors
  }

  const purchaseOrderData: CreatePurchaseOrderData = {
    vendorId: formData.get('vendorId') as string,
    department: formData.get('department') as string,
    priority: (formData.get('priority') as PurchaseOrder['priority']) || 'normal',
    budgetCode: formData.get('budgetCode') as string,
    category: formData.get('category') as PurchaseOrder['category'],
    items,
    requestedDeliveryDate: formData.get('requestedDeliveryDate') as string || undefined,
    notes: formData.get('notes') as string || undefined,
    internalNotes: formData.get('internalNotes') as string || undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  const result = await createPurchaseOrderAction(purchaseOrderData);

  if (result.success && result.data) {
    revalidatePath('/purchase-orders', 'page');
  }

  return result;
}
