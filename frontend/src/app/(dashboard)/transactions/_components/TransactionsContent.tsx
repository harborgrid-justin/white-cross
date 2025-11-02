'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Eye, 
  MoreHorizontal, 
  Download,
  RefreshCcw,
  DollarSign,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  Transaction, 
  TransactionFilters, 
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  transactionUtils,
  mockTransactions 
} from '../data';

interface TransactionsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: string;
    maxAmount?: string;
    studentId?: string;
    paymentMethod?: string;
  };
}

export function TransactionsContent({ searchParams }: TransactionsContentProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '10');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        // Parse search parameters into filters
        const filters: TransactionFilters = {
          searchQuery: searchParams.search,
          type: searchParams.type ? [searchParams.type as TransactionType] : undefined,
          status: searchParams.status ? [searchParams.status as TransactionStatus] : undefined,
          paymentMethod: searchParams.paymentMethod ? [searchParams.paymentMethod as PaymentMethod] : undefined,
          studentId: searchParams.studentId,
          dateRange: searchParams.dateFrom && searchParams.dateTo ? {
            startDate: new Date(searchParams.dateFrom),
            endDate: new Date(searchParams.dateTo),
          } : undefined,
          amountRange: searchParams.minAmount && searchParams.maxAmount ? {
            min: parseFloat(searchParams.minAmount),
            max: parseFloat(searchParams.maxAmount),
          } : undefined,
        };
        
        // Apply filters to mock data
        const filteredTransactions = transactionUtils.applyFilters(mockTransactions, filters);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Paginate results
        const startIndex = (currentPage - 1) * limit;
        const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);
        
        setTransactions(paginatedTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [searchParams, currentPage, limit]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleViewTransaction = (transactionId: string) => {
    // Navigate to transaction detail view
    window.open(`/dashboard/transactions/${transactionId}`, '_blank');
  };

  const handleExportTransactions = () => {
    // Export functionality
    console.log('Exporting transactions...');
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            {error}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {/* Table Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Transaction Records</h2>
            <Badge variant="secondary">
              {transactions.length} transactions
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTransactions}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {transaction.transactionNumber}
                      </div>
                      <div className="text-sm text-gray-600 truncate max-w-48">
                        {transaction.description}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <Badge 
                      variant="secondary"
                      className={transactionUtils.getTypeColor(transaction.type)}
                    >
                      {transaction.type.replace('_', ' ')}
                    </Badge>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {transactionUtils.formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                    {transaction.insuranceInfo && (
                      <div className="text-sm text-gray-600">
                        Copay: {transactionUtils.formatCurrency(transaction.insuranceInfo.copayAmount || 0)}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <Badge 
                      variant="secondary"
                      className={transactionUtils.getStatusColor(transaction.status)}
                    >
                      {transaction.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {transaction.paymentMethod === 'credit_card' && <CreditCard className="h-4 w-4 text-gray-400" />}
                      {transaction.paymentMethod === 'cash' && <DollarSign className="h-4 w-4 text-gray-400" />}
                      {transaction.paymentMethod === 'insurance' && <FileText className="h-4 w-4 text-gray-400" />}
                      <span className="text-sm text-gray-600">
                        {transaction.paymentMethod?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {transactionUtils.formatTransactionDate(transaction.transactionDate)}
                      </div>
                      {transactionUtils.isOverdue(transaction) && (
                        <div className="text-xs text-red-600">
                          Overdue
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              No financial transactions match your current filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard/transactions'}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, transactions.length + ((currentPage - 1) * limit))} of {transactions.length + ((currentPage - 1) * limit)} transactions
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', String(currentPage - 1));
                  window.location.search = params.toString();
                }}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(transactions.length / limit)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        params.set('page', String(pageNum));
                        window.location.search = params.toString();
                      }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage * limit >= transactions.length}
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', String(currentPage + 1));
                  window.location.search = params.toString();
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}



