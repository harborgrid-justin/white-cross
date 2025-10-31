'use client';

/**
 * Force dynamic rendering for user-specific billing data
 * Invoice data is sensitive financial information that varies per user
 */
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/layout/Card';
import { type BillingInvoice, type InvoiceFilters } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { fetchInvoicesDashboardData } from './data';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  /**
   * Load invoices data from data layer
   */
  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      
      try {
        const filters: InvoiceFilters = {};
        const { invoices, error } = await fetchInvoicesDashboardData(filters, searchTerm);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
          setInvoices([]);
        } else {
          setInvoices(invoices);
        }
      } catch (error) {
        console.error('Failed to load invoices:', error);
        toast({
          title: 'Error',
          description: 'Failed to load invoices. Please try again.',
          variant: 'destructive',
        });
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [searchTerm, toast]);

  const handleCreateInvoice = () => {
    window.location.href = '/dashboard/billing/invoices/new';
  };

  const handleViewInvoice = (invoice: BillingInvoice) => {
    window.location.href = `/dashboard/billing/invoices/${invoice.id}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">View and manage all invoices</p>
          </div>
        </div>
        <Card>
          <div className="p-6 text-center text-gray-500">
            <p>Loading invoices...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">View and manage all invoices</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Invoice
          </button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <div className="p-6 text-center text-gray-500">
            <p>No invoices found.</p>
            <p className="text-sm mt-2">
              {searchTerm.trim() 
                ? `No invoices match your search for "${searchTerm}".`
                : 'Invoices will appear here once they are created.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewInvoice(invoice)}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {invoice.patientName} • {invoice.providerName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Service Date: {new Date(invoice.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${invoice.totalAmount.toFixed(2)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : invoice.status === 'sent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                    {invoice.balanceDue > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        Balance: ${invoice.balanceDue.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
