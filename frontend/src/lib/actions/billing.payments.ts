/**
 * @fileoverview Payment Management Operations
 * @module app/billing/payments
 *
 * Server actions for payment processing with HIPAA compliance,
 * audit logging, and cache invalidation.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types and cache
import type {
  ActionResult,
  Payment,
  CreatePaymentData,
  PaymentFilters,
  ApiResponse
} from './billing.types';
import { BILLING_CACHE_TAGS, getPayment, getPayments } from './billing.cache';

// ==========================================
// PAYMENT OPERATIONS
// ==========================================

/**
 * Create payment
 * Includes audit logging and cache invalidation
 */
export async function createPaymentAction(data: CreatePaymentData): Promise<ActionResult<Payment>> {
  try {
    // Validate required fields
    if (!data.invoiceId || !data.amount || !data.currency || !data.paymentMethod) {
      return {
        success: false,
        error: 'Missing required fields: invoiceId, amount, currency, paymentMethod'
      };
    }

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Payment amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENTS,
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.PAYMENTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create payment');
    }

    // AUDIT LOG - Payment creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Payment',
      resourceId: response.data.id,
      details: `Created payment for invoice ${data.invoiceId} - $${data.amount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.PAYMENTS, 'default');
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag('payment-list', 'default');
    revalidateTag(`invoice-${data.invoiceId}`, 'default');
    revalidatePath('/billing/payments', 'page');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Payment created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create payment';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Payment',
      details: `Failed to create payment: ${errorMessage}`,
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
 * Refund payment
 * Includes audit logging and cache invalidation
 */
export async function refundPaymentAction(
  paymentId: string,
  refundAmount?: number
): Promise<ActionResult<Payment>> {
  try {
    if (!paymentId) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    const refundData = refundAmount ? { amount: refundAmount } : {};

    const response = await serverPost<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENT_REFUND(paymentId),
      refundData,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.PAYMENTS, `payment-${paymentId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to refund payment');
    }

    // AUDIT LOG - Payment refunded
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Payment',
      resourceId: paymentId,
      details: `Refunded payment${refundAmount ? ` - $${refundAmount}` : ''}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.PAYMENTS, 'default');
    revalidateTag(`payment-${paymentId}`, 'default');
    revalidateTag('payment-list', 'default');
    revalidatePath('/billing/payments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Payment refunded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to refund payment';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Payment',
      resourceId: paymentId,
      details: `Failed to refund payment: ${errorMessage}`,
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
 * Check if payment exists
 */
export async function paymentExists(paymentId: string): Promise<boolean> {
  const payment = await getPayment(paymentId);
  return payment !== null;
}

/**
 * Get payment count
 */
export const getPaymentCount = cache(async (filters?: PaymentFilters): Promise<number> => {
  try {
    const payments = await getPayments(filters);
    return payments.length;
  } catch {
    return 0;
  }
});
