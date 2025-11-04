/**
 * @fileoverview Form Data Handling for Billing
 * @module app/billing/forms
 *
 * Form-friendly wrappers for billing operations.
 * Handles FormData parsing and conversion to typed data structures.
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Types and actions
import type {
  ActionResult,
  Invoice,
  Payment,
  CreateInvoiceData,
  CreatePaymentData,
  InvoiceLineItem
} from './billing.types';
import { createInvoiceAction } from './billing.invoices';
import { createPaymentAction } from './billing.payments';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create invoice from form data
 * Form-friendly wrapper for createInvoiceAction
 */
export async function createInvoiceFromForm(formData: FormData): Promise<ActionResult<Invoice>> {
  const lineItems: Omit<InvoiceLineItem, 'id'>[] = [];

  // Parse line items from form data
  let itemIndex = 0;
  while (formData.has(`lineItems[${itemIndex}].description`)) {
    const description = formData.get(`lineItems[${itemIndex}].description`) as string;
    const quantity = parseFloat(formData.get(`lineItems[${itemIndex}].quantity`) as string) || 1;
    const unitPrice = parseFloat(formData.get(`lineItems[${itemIndex}].unitPrice`) as string) || 0;

    if (description && unitPrice > 0) {
      lineItems.push({
        description,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      });
    }
    itemIndex++;
  }

  const invoiceData: CreateInvoiceData = {
    customerId: formData.get('customerId') as string,
    customerName: formData.get('customerName') as string,
    customerEmail: formData.get('customerEmail') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    currency: formData.get('currency') as string || 'USD',
    dueDate: formData.get('dueDate') as string,
    description: formData.get('description') as string,
    lineItems,
    taxRate: parseFloat(formData.get('taxRate') as string) || 0,
  };

  const result = await createInvoiceAction(invoiceData);

  if (result.success && result.data) {
    redirect(`/billing/invoices/${result.data.id}`);
  }

  return result;
}

/**
 * Create payment from form data
 * Form-friendly wrapper for createPaymentAction
 */
export async function createPaymentFromForm(formData: FormData): Promise<ActionResult<Payment>> {
  const paymentData: CreatePaymentData = {
    invoiceId: formData.get('invoiceId') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    currency: formData.get('currency') as string || 'USD',
    paymentMethod: formData.get('paymentMethod') as Payment['paymentMethod'],
    transactionId: formData.get('transactionId') as string || undefined,
  };

  const result = await createPaymentAction(paymentData);

  if (result.success && result.data) {
    revalidatePath('/billing/payments', 'page');
  }

  return result;
}
