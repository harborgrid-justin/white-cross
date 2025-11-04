/**
 * @fileoverview Invoice Management Operations
 * @module app/billing/invoices
 *
 * Server actions for invoice CRUD operations with HIPAA compliance,
 * audit logging, and cache invalidation.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Utils
import { validateEmail } from '@/utils/validation/userValidation';

// Types and cache
import type {
  ActionResult,
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  ApiResponse
} from './billing.types';
import { BILLING_CACHE_TAGS, getInvoice, getInvoices } from './billing.cache';

// ==========================================
// INVOICE CRUD OPERATIONS
// ==========================================

/**
 * Create a new invoice
 * Includes audit logging and cache invalidation
 */
export async function createInvoiceAction(data: CreateInvoiceData): Promise<ActionResult<Invoice>> {
  try {
    // Validate required fields
    if (!data.customerId || !data.customerName || !data.customerEmail || !data.amount || !data.dueDate) {
      return {
        success: false,
        error: 'Missing required fields: customerId, customerName, customerEmail, amount, dueDate'
      };
    }

    // Validate email format
    if (!validateEmail(data.customerEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Invoice amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICES,
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create invoice');
    }

    // AUDIT LOG - Invoice creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: response.data.id,
      details: `Created invoice for ${data.customerName} - $${data.amount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Invoice',
      details: `Failed to create invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update invoice
 * Includes audit logging and cache invalidation
 */
export async function updateInvoiceAction(
  invoiceId: string,
  data: UpdateInvoiceData
): Promise<ActionResult<Invoice>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    // Validate email if provided
    if (data.customerEmail && !validateEmail(data.customerEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      return {
        success: false,
        error: 'Invoice amount must be greater than 0'
      };
    }

    const response = await serverPut<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_BY_ID(invoiceId),
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update invoice');
    }

    // AUDIT LOG - Invoice update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Updated invoice information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');
    revalidatePath(`/billing/invoices/${invoiceId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to update invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Send invoice to customer
 * Includes audit logging and cache invalidation
 */
export async function sendInvoiceAction(invoiceId: string): Promise<ActionResult<void>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    await serverPost<ApiResponse<void>>(
      API_ENDPOINTS.BILLING.INVOICE_SEND(invoiceId),
      {},
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    // AUDIT LOG - Invoice sent
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Sent invoice to customer',
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidatePath('/billing/invoices', 'page');
    revalidatePath(`/billing/invoices/${invoiceId}`, 'page');

    return {
      success: true,
      message: 'Invoice sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to send invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Void invoice
 * Includes audit logging and cache invalidation
 */
export async function voidInvoiceAction(invoiceId: string): Promise<ActionResult<Invoice>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_VOID(invoiceId),
      {},
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to void invoice');
    }

    // AUDIT LOG - Invoice voided
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Voided invoice',
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice voided successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to void invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to void invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if invoice exists
 */
export async function invoiceExists(invoiceId: string): Promise<boolean> {
  const invoice = await getInvoice(invoiceId);
  return invoice !== null;
}

/**
 * Get invoice count
 */
export const getInvoiceCount = cache(async (filters?: InvoiceFilters): Promise<number> => {
  try {
    const invoices = await getInvoices(filters);
    return invoices.length;
  } catch {
    return 0;
  }
});
