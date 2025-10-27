'use client';

/**
 * TransactionHistoryContent Component
 *
 * View complete history of all inventory transactions.
 * Filter by type, date, item, and user.
 *
 * @module TransactionHistoryContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface Transaction {
  id: string;
  type: 'receive' | 'issue' | 'transfer' | 'adjustment';
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  user: string;
  date: string;
  notes?: string;
  balanceAfter: number;
  location?: string;
}

/**
 * Transaction history view component
 *
 * @returns Rendered transaction history
 */
export default function TransactionHistoryContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'receive',
            itemId: '1',
            itemName: 'Acetaminophen 500mg',
            sku: 'MED-001',
            quantity: 50,
            user: 'Jane Doe',
            date: '2024-01-20T14:30:00Z',
            notes: 'Restocking order #1234',
            balanceAfter: 100,
            location: 'Cabinet A, Shelf 2',
          },
          {
            id: '2',
            type: 'issue',
            itemId: '1',
            itemName: 'Acetaminophen 500mg',
            sku: 'MED-001',
            quantity: -10,
            user: 'John Smith',
            date: '2024-01-18T09:15:00Z',
            notes: 'Issued to student ID: 456',
            balanceAfter: 50,
          },
          {
            id: '3',
            type: 'adjustment',
            itemId: '2',
            itemName: 'Bandages (Adhesive)',
            sku: 'SUP-101',
            quantity: -5,
            user: 'Admin User',
            date: '2024-01-16T11:00:00Z',
            notes: 'Physical count adjustment',
            balanceAfter: 15,
          },
          {
            id: '4',
            type: 'transfer',
            itemId: '3',
            itemName: 'Digital Thermometer',
            sku: 'EQP-201',
            quantity: 2,
            user: 'Jane Doe',
            date: '2024-01-15T16:45:00Z',
            notes: 'Transferred from Main Office to Secondary Office',
            balanceAfter: 5,
          },
        ];

        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.itemName.toLowerCase().includes(query) ||
          t.sku.toLowerCase().includes(query) ||
          t.user.toLowerCase().includes(query) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredTransactions(filtered);
  }, [transactions, selectedType, searchQuery]);

  const getTransactionBadge = (type: string) => {
    const badges = {
      receive: 'bg-green-100 text-green-800',
      issue: 'bg-blue-100 text-blue-800',
      transfer: 'bg-purple-100 text-purple-800',
      adjustment: 'bg-orange-100 text-orange-800',
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionIcon = (type: string) => {
    const icons = {
      receive: '📥',
      issue: '📤',
      transfer: '↔️',
      adjustment: '✏️',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-2">Complete record of all inventory transactions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['receive', 'issue', 'transfer', 'adjustment'].map(type => (
          <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1 capitalize">{type}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => t.type === type).length}
                </p>
              </div>
              <span className="text-3xl">{getTransactionIcon(type)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by item, SKU, user, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="receive">Receive</option>
              <option value="issue">Issue</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No transactions found"
          description={searchQuery || selectedType !== 'all'
            ? "No transactions match your current filters"
            : "No inventory transactions have been recorded yet"}
          action={searchQuery || selectedType !== 'all'
            ? {
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedType('all');
                }
              }
            : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Balance After
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTransactionBadge(transaction.type)}`}>
                        <span>{getTransactionIcon(transaction.type)}</span>
                        <span className="capitalize">{transaction.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.itemName}</p>
                        <p className="text-xs text-gray-500 font-mono">{transaction.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${
                        transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.user}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {transaction.balanceAfter}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => window.location.href = `/inventory/transactions/${transaction.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Showing {filteredTransactions.length} transactions</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
