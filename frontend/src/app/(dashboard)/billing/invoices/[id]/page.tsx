'use client';

/**
 * Force dynamic rendering for specific invoice details - financial data requires real-time accuracy
 */


import React, { useState, useEffect } from 'react';
import { BillingDetail } from '@/components/pages/Billing';
import { BillingInvoice } from '@/components/pages/Billing/BillingCard';
import { useToast } from '@/hooks/use-toast';
import { fetchInvoiceDetailDashboardData, deleteInvoice, downloadInvoicePDF, sendInvoice } from './data';

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
   * Load invoice data from data layer
   */
  useEffect(() => {
    const loadInvoice = async () => {
      setLoading(true);
      
      try {
        const { invoice, error } = await fetchInvoiceDetailDashboardData(params.id);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
          setInvoice(null);
        } else {
          setInvoice(invoice);
        }
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
            const { success, error } = await deleteInvoice(invoice.id);
            
            if (success) {
              toast({
                title: 'Success',
                description: `Invoice ${invoice.invoiceNumber} has been deleted.`,
              });
              window.location.href = '/dashboard/billing';
            } else {
              toast({
                title: 'Error',
                description: error || 'Failed to delete invoice. Please try again.',
                variant: 'destructive',
              });
            }
          }
        }}
        onDownloadInvoice={async (invoice) => {
          const { blob, success, error } = await downloadInvoicePDF(invoice.id);
          
          if (success && blob) {
            // Create download link
            const url = window.URL.createObjectURL(blob);
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
          } else {
            toast({
              title: 'Error',
              description: error || 'Failed to download invoice PDF. Please try again.',
              variant: 'destructive',
            });
          }
        }}
        onSendInvoice={async (invoice) => {
          const { success, error } = await sendInvoice(invoice.id, invoice.patientEmail);
          
          if (success) {
            toast({
              title: 'Success',
              description: `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.patientEmail}`,
            });
          } else {
            toast({
              title: 'Error',
              description: error || 'Failed to send invoice. Please try again.',
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
