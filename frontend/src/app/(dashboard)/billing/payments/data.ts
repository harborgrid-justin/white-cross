/**
 * @fileoverview Billing Payments Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/billing/payments/data
 *
 * @description
 * Server-side data fetching functions for the billing payments dashboard.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Payment records fetching with filtering and search
 * - Payment operations (refund, void)
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { billingApi, type PaymentRecord, type PaymentFilters } from '@/services/api';
import { BillingPaymentRecord } from '@/components/pages/Billing/BillingPayment';

/**
 * Fetch payments data with optional filtering and search
 *
 * @param filters - Filtering options for payments
 * @param searchTerm - Search term for client-side filtering
 * @returns Promise resolving to payments data
 */
export async function fetchPayments(
  filters: PaymentFilters = {},
  searchTerm?: string
): Promise<BillingPaymentRecord[]> {
  try {
    const response = await billingApi.getPayments(1, 50, filters);
    
    // Convert API PaymentRecord to component BillingPaymentRecord format
    const convertedPayments: BillingPaymentRecord[] = response.data.map((payment: PaymentRecord) => ({
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      date: payment.date,
      reference: payment.reference,
      notes: payment.notes,
      status: payment.status,
      type: payment.type,
      patientId: payment.patientId,
      patientName: payment.patientName,
      invoiceId: payment.invoiceId,
      invoiceNumber: payment.invoiceNumber,
      processedBy: payment.processedBy,
      processedAt: payment.processedAt,
      transactionId: payment.transactionId,
      authorizationCode: payment.authorizationCode,
      refundedAmount: payment.refundedAmount,
      refundReason: payment.refundReason,
      metadata: payment.metadata
    }));
    
    // Apply client-side search filter if needed
    if (searchTerm?.trim()) {
      return convertedPayments.filter(payment => 
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return convertedPayments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
}

/**
 * Process a refund for a payment
 *
 * @param paymentId - ID of the payment to refund
 * @param amount - Amount to refund
 * @param reason - Reason for the refund
 * @returns Promise resolving to success status
 */
export async function processPaymentRefund(
  paymentId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await billingApi.processRefund({
      paymentId,
      amount,
      reason
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process refund'
    };
  }
}

/**
 * Void a payment
 *
 * @param paymentId - ID of the payment to void
 * @param reason - Reason for voiding the payment
 * @returns Promise resolving to success status
 */
export async function voidPayment(
  paymentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await billingApi.voidPayment(paymentId, reason);
    
    return { success: true };
  } catch (error) {
    console.error('Error voiding payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to void payment'
    };
  }
}

/**
 * Fetch payments dashboard data
 *
 * @param filters - Filtering options
 * @param searchTerm - Search term for filtering
 * @returns Promise resolving to payments data and error state
 */
export async function fetchPaymentsDashboardData(
  filters: PaymentFilters = {},
  searchTerm?: string
) {
  try {
    const payments = await fetchPayments(filters, searchTerm);
    
    return {
      payments,
      error: null
    };
  } catch (error) {
    console.error('Error fetching payments dashboard data:', error);
    return {
      payments: [],
      error: error instanceof Error ? error.message : 'Failed to load payments data'
    };
  }
}
