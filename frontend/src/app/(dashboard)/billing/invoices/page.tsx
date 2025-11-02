'use client';

/**
 * Force dynamic rendering for user-specific billing data
 * Invoice data is sensitive financial information that varies per user
 */


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Filter } from 'lucide-react';
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
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">View and manage all invoices</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <Button onClick={handleCreateInvoice} className="flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          {/* Main Invoice List */}
          <ResizablePanel defaultSize={100} minSize={60}>
            <div className="p-6 h-full flex flex-col">
              {invoices.length === 0 ? (
                <Card className="flex-1 flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-2">No invoices found</p>
                      <p className="text-sm">
                        {searchTerm.trim() 
                          ? `No invoices match your search for "${searchTerm}".`
                          : 'Invoices will appear here once they are created.'}
                      </p>
                      <Button onClick={handleCreateInvoice} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Invoice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-4">
                    {invoices.map((invoice) => (
                      <Card 
                        key={invoice.id} 
                        className="cursor-pointer hover:bg-gray-50 transition-colors" 
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {invoice.invoiceNumber}
                              </h3>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">{invoice.patientName}</span> • {invoice.providerName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Service Date: {new Date(invoice.serviceDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="text-lg font-semibold text-gray-900 mb-2">
                                ${invoice.totalAmount.toFixed(2)}
                              </p>
                              <div className="flex flex-col gap-2">
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
                                  <p className="text-sm text-red-600">
                                    Balance: ${invoice.balanceDue.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
