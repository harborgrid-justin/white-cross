/**
 * @fileoverview Billing Invoice Detail Page Data Layer - Server-Side Data Fetching
 * @module app/(dashboard)/billing/invoices/[id]/data
 *
 * @description
 * Server-side data fetching functions for the billing invoice detail page.
 * Separates data logic from UI components for better maintainability.
 *
 * **Features:**
 * - Invoice detail fetching with conversion to component format
 * - Invoice operations (delete, download, send)
 * - Error handling and caching
 * - Type-safe API responses
 *
 * @since 1.0.0
 */

import { billingApi, type BillingInvoice as ApiBillingInvoice } from '@/services/api';
import { BillingInvoice } from '@/components/pages/Billing/BillingCard';

/**
 * Fetch invoice detail by ID
 *
 * @param invoiceId - ID of the invoice to fetch
 * @returns Promise resolving to converted invoice data
 */
export async function fetchInvoiceDetail(invoiceId: string): Promise<BillingInvoice | null> {
  try {
    const apiInvoice = await billingApi.getInvoiceById(invoiceId);
    
    // Convert API invoice format to component format
    const convertedInvoice: BillingInvoice = {
      id: apiInvoice.id,
      invoiceNumber: apiInvoice.invoiceNumber,
      patientId: apiInvoice.patientId,
      patientName: apiInvoice.patientName,
      patientEmail: apiInvoice.patientEmail,
      patientPhone: apiInvoice.patientPhone,
      patientAddress: apiInvoice.patientAddress,
      providerId: apiInvoice.providerId,
      providerName: apiInvoice.providerName,
      serviceDate: apiInvoice.serviceDate,
      issueDate: apiInvoice.issueDate,
      dueDate: apiInvoice.dueDate,
      status: apiInvoice.status,
      priority: apiInvoice.priority,
      lineItems: apiInvoice.lineItems,
      subtotal: apiInvoice.subtotal,
      discountAmount: apiInvoice.discountAmount,
      taxAmount: apiInvoice.taxAmount,
      totalAmount: apiInvoice.totalAmount,
      amountPaid: apiInvoice.amountPaid,
      balanceDue: apiInvoice.balanceDue,
      payments: apiInvoice.payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        date: payment.date,
        reference: payment.reference,
        notes: payment.notes
      })),
      notes: apiInvoice.notes,
      terms: apiInvoice.terms,
      insuranceClaimId: apiInvoice.insuranceClaimId,
      insuranceStatus: apiInvoice.insuranceStatus,
      createdBy: apiInvoice.createdBy,
      createdAt: apiInvoice.createdAt,
      updatedAt: apiInvoice.updatedAt
    };
    
    return convertedInvoice;
  } catch (error) {
    console.error('Error fetching invoice detail:', error);
    return null;
  }
}

/**
 * Delete an invoice
 *
 * @param invoiceId - ID of the invoice to delete
 * @returns Promise resolving to success status
 */
export async function deleteInvoice(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await billingApi.deleteInvoice(invoiceId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete invoice'
    };
  }
}

/**
 * Download invoice PDF
 *
 * @param invoiceId - ID of the invoice to download
 * @returns Promise resolving to PDF blob and success status
 */
export async function downloadInvoicePDF(invoiceId: string): Promise<{ blob?: Blob; success: boolean; error?: string }> {
  try {
    const pdfBlob = await billingApi.downloadInvoicePDF(invoiceId);
    return { blob: pdfBlob, success: true };
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download invoice PDF'
    };
  }
}

/**
 * Send invoice via email
 *
 * @param invoiceId - ID of the invoice to send
 * @param email - Email address to send to
 * @returns Promise resolving to success status
 */
export async function sendInvoice(invoiceId: string, email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await billingApi.sendInvoice(invoiceId, email);
    return { success: true };
  } catch (error) {
    console.error('Error sending invoice:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send invoice'
    };
  }
}

/**
 * Fetch invoice detail dashboard data
 *
 * @param invoiceId - ID of the invoice to fetch
 * @returns Promise resolving to invoice data and error state
 */
export async function fetchInvoiceDetailDashboardData(invoiceId: string) {
  try {
    const invoice = await fetchInvoiceDetail(invoiceId);
    
    return {
      invoice,
      error: invoice ? null : 'Invoice not found'
    };
  } catch (error) {
    console.error('Error fetching invoice detail dashboard data:', error);
    return {
      invoice: null,
      error: error instanceof Error ? error.message : 'Failed to load invoice data'
    };
  }
}
