'use client';

import React, { useState, useEffect } from 'react';
import { BillingDetail } from '@/components/pages/Billing';
import { BillingInvoice } from '@/components/pages/Billing/BillingCard';
import { billingApi, type BillingInvoice as ApiBillingInvoice } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

/**
 * Invoice Detail Page
 * 
 * Detailed view of a specific invoice with payment history,
 * status management, and comprehensive invoice information.
 */
export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<BillingInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Load invoice data from API
   */
  useEffect(() => {
    const loadInvoice = async () => {
      setLoading(true);
      
      try {
        const apiInvoice = await billingApi.getInvoiceById(params.id);
        
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
        
        setInvoice(convertedInvoice);
      } catch (error) {
        console.error('Failed to load invoice:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invoice. Please try again.',
          variant: 'destructive',
        });
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [params.id, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BillingDetail
        invoice={invoice || undefined}
        loading={loading}
        onEditInvoice={(invoice) => {
          window.location.href = `/dashboard/billing/invoices/${invoice.id}/edit`;
        }}
        onDeleteInvoice={async (invoice) => {
          if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
            try {
              await billingApi.deleteInvoice(invoice.id);
              toast({
                title: 'Success',
                description: `Invoice ${invoice.invoiceNumber} has been deleted.`,
              });
              window.location.href = '/dashboard/billing';
            } catch (error) {
              console.error('Failed to delete invoice:', error);
              toast({
                title: 'Error',
                description: 'Failed to delete invoice. Please try again.',
                variant: 'destructive',
              });
            }
          }
        }}
        onDownloadInvoice={async (invoice) => {
          try {
            const pdfBlob = await billingApi.downloadInvoicePDF(invoice.id);
            
            // Create download link
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast({
              title: 'Success',
              description: 'Invoice PDF downloaded successfully.',
            });
          } catch (error) {
            console.error('Failed to download invoice:', error);
            toast({
              title: 'Error',
              description: 'Failed to download invoice PDF. Please try again.',
              variant: 'destructive',
            });
          }
        }}
        onSendInvoice={async (invoice) => {
          try {
            await billingApi.sendInvoice(invoice.id, invoice.patientEmail);
            toast({
              title: 'Success',
              description: `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.patientEmail}`,
            });
          } catch (error) {
            console.error('Failed to send invoice:', error);
            toast({
              title: 'Error',
              description: 'Failed to send invoice. Please try again.',
              variant: 'destructive',
            });
          }
        }}
        onPrintInvoice={(invoice) => {
          console.log('Print invoice:', invoice.id);
          // Handle invoice printing
          window.print();
        }}
        onShareInvoice={(invoice) => {
          console.log('Share invoice:', invoice.id);
          // Handle invoice sharing
          alert('Share options would be displayed here...');
        }}
        onRecordPayment={(invoice) => {
          window.location.href = `/dashboard/billing/payments/new?invoice=${invoice.id}`;
        }}
        onEditPayment={(payment) => {
          console.log('Edit payment:', payment.id);
          // Handle payment editing
          alert(`Editing payment ${payment.id}...`);
        }}
        onDeletePayment={(payment) => {
          if (confirm('Are you sure you want to delete this payment?')) {
            console.log('Delete payment:', payment.id);
            // Handle payment deletion
          }
        }}
        onAddService={(invoice) => {
          console.log('Add service to invoice:', invoice.id);
          // Handle adding service
          alert('Add service form would be displayed here...');
        }}
        onEditService={(service) => {
          console.log('Edit service:', service.id);
          // Handle service editing
          alert(`Editing service ${service.description}...`);
        }}
        onDeleteService={(service) => {
          if (confirm(`Are you sure you want to delete ${service.description}?`)) {
            console.log('Delete service:', service.id);
            // Handle service deletion
          }
        }}
        onViewPatient={(patientId) => {
          window.location.href = `/dashboard/patients/${patientId}`;
        }}
        onViewProvider={(providerId) => {
          window.location.href = `/dashboard/providers/${providerId}`;
        }}
        onBack={() => {
          window.location.href = '/dashboard/billing';
        }}
      />
    </div>
  );
}
