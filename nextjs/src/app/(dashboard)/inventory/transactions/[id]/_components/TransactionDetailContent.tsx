'use client';

/**
 * TransactionDetailContent Component
 *
 * Detailed view of a single inventory transaction.
 * Shows all transaction metadata, audit information, and related data.
 *
 * @module TransactionDetailContent
 */

import React, { useState, useEffect } from 'react';

export interface TransactionDetailContentProps {
  /** ID of the transaction to display */
  transactionId?: string;
}

export interface TransactionDetail {
  id: string;
  type: 'receive' | 'issue' | 'transfer' | 'adjustment';
  status: 'completed' | 'pending' | 'cancelled';
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  unitOfMeasure: string;
  balanceBefore: number;
  balanceAfter: number;
  user: string;
  date: string;
  notes?: string;
  location?: string;
  fromLocation?: string;
  toLocation?: string;
  supplier?: string;
  purchaseOrderNumber?: string;
  lotNumber?: string;
  expirationDate?: string;
  recipientName?: string;
  recipientType?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction detail view component
 *
 * @param props - Component props
 * @returns Rendered transaction detail
 */
export default function TransactionDetailContent({ transactionId }: TransactionDetailContentProps) {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransaction = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockTransaction: TransactionDetail = {
          id: transactionId || '1',
          type: 'receive',
          status: 'completed',
          itemId: '1',
          itemName: 'Acetaminophen 500mg',
          sku: 'MED-001',
          quantity: 50,
          unitOfMeasure: 'tablet',
          balanceBefore: 50,
          balanceAfter: 100,
          user: 'Jane Doe',
          date: '2024-01-20T14:30:00Z',
          notes: 'Restocking order #1234',
          location: 'Cabinet A, Shelf 2',
          supplier: 'MedSupply Inc.',
          purchaseOrderNumber: 'PO-2024-001',
          lotNumber: 'LOT2024-001',
          expirationDate: '2025-12-31',
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
        };

        setTransaction(mockTransaction);
      } catch (err) {
        console.error('Error loading transaction:', err);
        setError('Failed to load transaction details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransaction();
  }, [transactionId]);

  const getTransactionBadge = (type: string) => {
    const badges = {
      receive: 'bg-green-100 text-green-800',
      issue: 'bg-blue-100 text-blue-800',
      transfer: 'bg-purple-100 text-purple-800',
      adjustment: 'bg-orange-100 text-orange-800',
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Transaction not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Transaction #{transaction.id}</h1>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTransactionBadge(transaction.type)}`}>
              {transaction.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(transaction.status)}`}>
              {transaction.status}
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          {new Date(transaction.date).toLocaleString()} by {transaction.user}
        </p>
      </div>

      {/* Quantity Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Balance Before</p>
            <p className="text-3xl font-bold text-blue-900">{transaction.balanceBefore}</p>
          </div>
          <div className="text-4xl text-blue-600">
            {transaction.quantity > 0 ? '+' : '-'}
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Transaction</p>
            <p className={`text-3xl font-bold ${transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(transaction.quantity)} {transaction.unitOfMeasure}
            </p>
          </div>
          <div className="text-4xl text-blue-600">=</div>
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">Balance After</p>
            <p className="text-3xl font-bold text-blue-900">{transaction.balanceAfter}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Item Name</p>
              <p className="font-medium text-gray-900">{transaction.itemName}</p>
            </div>
            <div>
              <p className="text-gray-600">SKU</p>
              <p className="font-medium text-gray-900 font-mono">{transaction.sku}</p>
            </div>
            <div>
              <p className="text-gray-600">Unit of Measure</p>
              <p className="font-medium text-gray-900 capitalize">{transaction.unitOfMeasure}</p>
            </div>
            {transaction.location && (
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{transaction.location}</p>
              </div>
            )}
            <button
              onClick={() => window.location.href = `/inventory/${transaction.itemId}`}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm mt-4"
            >
              View Item Details
            </button>
          </div>
        </div>

        {/* Transaction Specific Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {transaction.type === 'receive' && 'Receipt Details'}
            {transaction.type === 'issue' && 'Issue Details'}
            {transaction.type === 'transfer' && 'Transfer Details'}
            {transaction.type === 'adjustment' && 'Adjustment Details'}
          </h2>
          <div className="space-y-3 text-sm">
            {/* Receive-specific fields */}
            {transaction.type === 'receive' && (
              <>
                {transaction.supplier && (
                  <div>
                    <p className="text-gray-600">Supplier</p>
                    <p className="font-medium text-gray-900">{transaction.supplier}</p>
                  </div>
                )}
                {transaction.purchaseOrderNumber && (
                  <div>
                    <p className="text-gray-600">Purchase Order</p>
                    <p className="font-medium text-gray-900 font-mono">{transaction.purchaseOrderNumber}</p>
                  </div>
                )}
                {transaction.lotNumber && (
                  <div>
                    <p className="text-gray-600">Lot Number</p>
                    <p className="font-medium text-gray-900 font-mono">{transaction.lotNumber}</p>
                  </div>
                )}
                {transaction.expirationDate && (
                  <div>
                    <p className="text-gray-600">Expiration Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(transaction.expirationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Issue-specific fields */}
            {transaction.type === 'issue' && transaction.recipientName && (
              <>
                <div>
                  <p className="text-gray-600">Recipient</p>
                  <p className="font-medium text-gray-900">{transaction.recipientName}</p>
                </div>
                {transaction.recipientType && (
                  <div>
                    <p className="text-gray-600">Recipient Type</p>
                    <p className="font-medium text-gray-900 capitalize">{transaction.recipientType}</p>
                  </div>
                )}
              </>
            )}

            {/* Transfer-specific fields */}
            {transaction.type === 'transfer' && (
              <>
                {transaction.fromLocation && (
                  <div>
                    <p className="text-gray-600">From Location</p>
                    <p className="font-medium text-gray-900">{transaction.fromLocation}</p>
                  </div>
                )}
                {transaction.toLocation && (
                  <div>
                    <p className="text-gray-600">To Location</p>
                    <p className="font-medium text-gray-900">{transaction.toLocation}</p>
                  </div>
                )}
              </>
            )}

            {/* Adjustment-specific fields */}
            {transaction.type === 'adjustment' && transaction.reason && (
              <div>
                <p className="text-gray-600">Reason</p>
                <p className="font-medium text-gray-900">{transaction.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {transaction.notes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
          <p className="text-sm text-gray-700">{transaction.notes}</p>
        </div>
      )}

      {/* Audit Information */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Transaction ID</p>
            <p className="font-medium text-gray-900 font-mono">{transaction.id}</p>
          </div>
          <div>
            <p className="text-gray-600">Created At</p>
            <p className="font-medium text-gray-900">
              {new Date(transaction.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Last Updated</p>
            <p className="font-medium text-gray-900">
              {new Date(transaction.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to History
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Print
        </button>
      </div>
    </div>
  );
}
