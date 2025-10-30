'use client';

import React, { useState, useEffect } from 'react';
import { BillingPayment } from '@/components/pages/Billing';
import { BillingPaymentRecord } from '@/components/pages/Billing/BillingPayment';
import { type PaymentFilters } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { fetchPaymentsDashboardData, processPaymentRefund, voidPayment } from './data';

/**
 * Payments Page
 * 
 * Payment management and processing interface with payment history,
 * analytics, and comprehensive payment operations.
 */
export default function PaymentsPage() {
  const [payments, setPayments] = useState<BillingPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const { toast } = useToast();

  /**
   * Load payments data from data layer
   */
  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      
      try {
        const filters: PaymentFilters = {};
        const { payments, error } = await fetchPaymentsDashboardData(filters, searchTerm);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
          setPayments([]);
        } else {
          setPayments(payments);
        }
      } catch (error) {
        console.error('Failed to load payments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payments. Please try again.',
          variant: 'destructive',
        });
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [searchTerm, toast]);

  /**
   * Handle payment creation
   */
  const handleCreatePayment = () => {
    window.location.href = '/dashboard/billing/payments/new';
  };

  /**
   * Handle payment editing
   */
  const handleEditPayment = (payment: BillingPaymentRecord) => {
    console.log('Edit payment:', payment.id);
    alert(`Editing payment ${payment.id}...`);
  };

  /**
   * Handle payment deletion
   */
  const handleDeletePayment = (payment: BillingPaymentRecord) => {
    if (confirm(`Are you sure you want to delete payment ${payment.id}?`)) {
      console.log('Delete payment:', payment.id);
      // Handle payment deletion
      setPayments(payments.filter(p => p.id !== payment.id));
    }
  };

  /**
   * Handle refund processing
   */
  const handleProcessRefund = async (payment: BillingPaymentRecord) => {
    const refundAmount = prompt(`Enter refund amount (max: $${payment.amount}):`);
    const refundReason = prompt('Enter refund reason:');
    
    if (refundAmount && refundReason) {
      const { success, error } = await processPaymentRefund(
        payment.id,
        parseFloat(refundAmount),
        refundReason
      );
      
      if (success) {
        toast({
          title: 'Success',
          description: `Refund of $${refundAmount} processed for payment ${payment.id}`,
        });
        
        // Refresh the payments list
        handleRefresh();
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to process refund. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  /**
   * Handle payment voiding
   */
  const handleVoidPayment = async (payment: BillingPaymentRecord) => {
    const reason = prompt('Enter reason for voiding this payment:');
    
    if (reason && confirm(`Are you sure you want to void payment ${payment.id}?`)) {
      const { success, error } = await voidPayment(payment.id, reason);
      
      if (success) {
        toast({
          title: 'Success',
          description: `Payment ${payment.id} has been voided`,
        });
        
        // Refresh the payments list
        handleRefresh();
      } else {
        toast({
          title: 'Error',
          description: error || 'Failed to void payment. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  /**
   * Handle invoice viewing
   */
  const handleViewInvoice = (invoiceId: string) => {
    window.location.href = `/dashboard/billing/invoices/${invoiceId}`;
  };

  /**
   * Handle patient viewing
   */
  const handleViewPatient = (patientId: string) => {
    window.location.href = `/dashboard/patients/${patientId}`;
  };

  /**
   * Handle bulk actions
   */
  const handleBulkActions = (action: string, paymentIds: string[]) => {
    console.log('Bulk action:', action, paymentIds);
    alert(`Performing ${action} on ${paymentIds.length} payment(s)...`);
  };

  /**
   * Handle payment export
   */
  const handleExportPayments = () => {
    console.log('Exporting payments');
    alert('Payment export started...');
  };

  /**
   * Handle data refresh
   */
  const handleRefresh = () => {
    // Trigger useEffect by updating a dependency or force re-render
    setSearchTerm(searchTerm); // This will trigger the useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BillingPayment
        payments={payments}
        loading={loading}
        totalPayments={payments.length}
        totalAmount={payments.reduce((sum, p) => sum + p.amount, 0)}
        totalRefunds={payments.filter(p => p.type === 'refund').reduce((sum, p) => sum + p.amount, 0)}
        pendingPayments={payments.filter(p => p.status === 'pending').length}
        failedPayments={payments.filter(p => p.status === 'failed').length}
        searchTerm={searchTerm}
        selectedPayments={selectedPayments}
        onSearchChange={setSearchTerm}
        onPaymentClick={(payment) => {
          console.log('View payment details:', payment.id);
          alert(`Viewing details for payment ${payment.id}...`);
        }}
        onCreatePayment={handleCreatePayment}
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
        onProcessRefund={handleProcessRefund}
        onVoidPayment={handleVoidPayment}
        onViewInvoice={handleViewInvoice}
        onViewPatient={handleViewPatient}
        onSelectionChange={setSelectedPayments}
        onBulkActions={handleBulkActions}
        onExportPayments={handleExportPayments}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
