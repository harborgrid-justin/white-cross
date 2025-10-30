import { BillingHeader, BillingList } from '@/components/pages/Billing';

/**
 * Billing Dashboard Page
 * 
 * Main billing and invoicing dashboard with financial metrics,
 * invoice management, and billing operations overview.
 */
export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BillingHeader
        totalInvoices={156}
        totalRevenue={245680}
        outstandingBalance={45230}
        paidInvoices={132}
        overdueInvoices={8}
        draftInvoices={16}
        averagePaymentTime={28}
        collectionRate={87.3}
        onCreateInvoice={() => {
          // Navigate to invoice builder
          window.location.href = '/dashboard/billing/invoices/new';
        }}
        onImportInvoices={() => {
          // Handle import
          console.log('Import invoices');
        }}
        onExportInvoices={() => {
          // Handle export
          console.log('Export invoices');
        }}
        onRefresh={() => {
          // Handle refresh
          window.location.reload();
        }}
        onSettings={() => {
          // Navigate to settings
          window.location.href = '/dashboard/billing/settings';
        }}
        onBulkActions={() => {
          console.log('Bulk actions');
        }}
        onSendStatements={() => {
          console.log('Send statements');
        }}
        onProcessPayments={() => {
          window.location.href = '/dashboard/billing/payments';
        }}
      />
      
      <BillingList
        onInvoiceClick={(invoice) => {
          window.location.href = `/dashboard/billing/invoices/${invoice.id}`;
        }}
        onViewDetails={(invoice) => {
          window.location.href = `/dashboard/billing/invoices/${invoice.id}`;
        }}
        onEditInvoice={(invoice) => {
          window.location.href = `/dashboard/billing/invoices/${invoice.id}/edit`;
        }}
        onDeleteInvoice={(invoice) => {
          if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
            console.log('Delete invoice:', invoice.id);
          }
        }}
        onDownloadInvoice={(invoice) => {
          console.log('Download invoice:', invoice.id);
        }}
        onSendInvoice={(invoice) => {
          console.log('Send invoice:', invoice.id);
        }}
        onRecordPayment={(invoice) => {
          window.location.href = `/dashboard/billing/payments/new?invoice=${invoice.id}`;
        }}
        onSelectionChange={(selectedIds) => {
          console.log('Selected invoices:', selectedIds);
        }}
        onPageChange={(page) => {
          console.log('Page change:', page);
        }}
        onViewModeChange={(mode) => {
          console.log('View mode change:', mode);
        }}
        onBulkActions={(action, invoiceIds) => {
          console.log('Bulk action:', action, invoiceIds);
        }}
      />
    </div>
  );
}
