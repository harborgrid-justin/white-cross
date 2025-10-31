/**
 * Force dynamic rendering for invoice creation - requires current billing data
 */
export const dynamic = 'force-dynamic';

import { BillingInvoiceBuilder } from '@/components/pages/Billing';

/**
 * New Invoice Page
 * 
 * Invoice creation and editing interface with line item management,
 * tax calculations, patient information, and comprehensive billing features.
 */
export default function NewInvoicePage() {
  return (
    <BillingInvoiceBuilder
      onSaveInvoice={(invoiceData) => {
        console.log('Saving invoice:', invoiceData);
        // Handle invoice save - could be draft or final
        // Redirect to invoice detail page after save
        // window.location.href = `/dashboard/billing/invoices/${invoiceId}`;
      }}
      onSendInvoice={(invoiceData) => {
        console.log('Sending invoice:', invoiceData);
        // Handle invoice send - save and send to patient
      }}
      onPreviewInvoice={(invoiceData) => {
        console.log('Previewing invoice:', invoiceData);
        // Handle invoice preview - open preview modal or new tab
      }}
      onCancel={() => {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
          window.location.href = '/dashboard/billing';
        }
      }}
    />
  );
}
